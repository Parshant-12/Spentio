const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/settings', async (req, res) => {
    try{
        const data = await User.findById(req.user.id);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error, success: false, message: 'Failed to fetch settings' });
    }
});

router.post('/settings', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updatedData = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        );
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedData.password = hashedPassword;
        await updatedData.save();
        res.status(200).json({ success: true, data: updatedData });
    } catch (error) {
        res.status(500).json({ error, success: false, message: 'Failed to save settings' });
    }
});

module.exports = router;