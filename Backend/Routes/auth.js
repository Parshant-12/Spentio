const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BudgetTotalAmount = require('../Models/budget_total_amount');
const sendEmail = require('../Utils/email');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email exists
    let user = await User.findOne({ email });
    if (user){
        return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save User
    user = await User.create({ name, email, password: hashedPassword });

    
    // 4. Generate JWT
    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    
    // default budget
    await BudgetTotalAmount.create({
      user: user.id,
      totalAmount: 50000,
    });
    res.json({ success: true, authToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    let user = await User.findOne({ email });
    if (!user){
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({ success: true, authToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 900000; // 15 minutes
    await user.save();

    // Use a service like Nodemailer to send the email here
    await sendEmail(user.email, `http://localhost:5173/reset-password/${resetToken}`);
    res.send("Reset link sent");
});

router.post('/reset-password/:token', async (req, res) => {
    const user = await User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } 
    });
    
    if (!user) return res.status(400).send("Token invalid or expired");

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.send("Password updated successfully");
});

module.exports = router;