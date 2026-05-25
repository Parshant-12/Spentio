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
        let updateFields = {};
        
        if (name) updateFields.name = name;
        if (email) updateFields.email = email.toLowerCase();

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedData = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true } 
        );

        if (!updatedData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        updatedData.password = undefined;

        res.status(200).json({ success: true, data: updatedData });
        
    } catch (error) {
        console.error("Settings Update Error:", error);
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Email is already in use.' });
        }
        
        res.status(500).json({ success: false, message: 'Failed to save settings' });
    }
});

module.exports = router;