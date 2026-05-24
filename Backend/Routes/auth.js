const express = require('express');
const router = express.Router();
const User = require('../Models/User');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const existingUser = await User.findOne({ email });
        const existingPwd = await User.findOne({ password });
        if (existingUser) {
            return res.status(409).json({ field: "Email", message: "Email already registered" });
        }
        else if (existingPwd) {
            return res.status(409).json({ field: "Password", message: "Password already Taken" });
        }
        const newUser = new User(data);
        const response = await newUser.save();
        if (!response) {
            return res.status(500).json({ error: "Internal Error:Failed to save user" });
        }
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email });
        console.log(user);
        if (user) {
            return res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ field: "Email/Password", message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});
module.exports = router;