const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');
const User = require('./Models/User');
const db = require('./db');
env.config();
app.use(express.json());
app.use(cors());

//Signup and Login Routes
app.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const existingUser = await User.findOne({ email });
        const existingPwd = await User.findOne({password});
        if (existingUser) {
            return res.status(409).json({ field:"Email", message:"Email already registered" });
        }
        else if(existingPwd){
            return res.status(409).json({ field:"Password", message:"Password already Taken" });
        }
        const newUser = new User(data);
        const response = await newUser.save();
        if(!response){
            return res.status(500).json({ error: "Internal Error:Failed to save user" });
        }
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});