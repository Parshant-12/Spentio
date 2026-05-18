const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');
const User = require('./Models/User');
const db = require('./db');
const Transaction = require('./Models/transaction');
const Udhar = require('./Models/Udhar');
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

//Transaction Routes
app.get('/transactions', async (req, res) => {
    try{
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
app.get('/transactions/filter/:type', async (req, res) => {
    try{
        const { type } = req.params;
        const transactions = await Transaction.find({ type: type });
        res.status(200).json(transactions);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
app.get('/transactions/search/:searchTerm', async (req, res) => {
    try{
        const { searchTerm } = req.params;
        const transactions = await Transaction.find({ description: { $regex: searchTerm, $options: 'i' } });
        res.status(200).json(transactions);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

app.post('/transactions', async (req, res) => {
    try{
        const data = req.body;
        const newTransaction = new Transaction(data);
        const response = await newTransaction.save();
        if(!response){
            return res.status(500).json({ error: "Internal Error:Failed to save transaction" });
        }
        res.status(201).json({ message: "Transaction added successfully" });
    }catch(err){
        res.status(500).json({ error: "Failed to add transaction" });
    }
});

app.put('/transaction/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const data = req.body;
        const response = await Transaction.findByIdAndUpdate(id, data, { new: true });
        if(!response){
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction updated successfully" });
    }catch(err){
        res.status(500).json({ error: "Failed to update transaction" });
    }
});

app.delete('/transaction/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const response = await Transaction.findByIdAndDelete(id);
        if(!response){
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    }catch(err){
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});

//Udhar Routes
app.get('/udhars', async (req, res) => {
    try{
        const udhars = await Udhar.find();
        res.status(200).json(udhars);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

app.post('/udhar', async (req, res) => {
    try{
        const data = req.body;
        const newUdhar = new Udhar(data);
        const response = await newUdhar.save();
        if(!response){
            return res.status(500).json({ error: "Internal Error:Failed to save udhar" });
        }
        res.status(201).json({ message: "Udhar added successfully" });
    }catch(err){
        res.status(500).json({ error: "Failed to add udhar" });
    }
});

app.put('/udhar/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const data = req.body;
        const response = await Udhar.findByIdAndUpdate(id, data, { new: true });
        if(!response){
            return res.status(404).json({ error: "Udhar not found" });
        }
        res.status(200).json({ message: "Udhar updated successfully" });
    }catch(err){
        res.status(500).json({ error: "Failed to update udhar" });
    }
});

app.delete('/udhar/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const response = await Udhar.findByIdAndDelete(id);
        if(!response){
            return res.status(404).json({ error: "Udhar not found" });
        }
        res.status(200).json({ message: "Udhar deleted successfully" });
    }catch(err){
        res.status(500).json({ error: "Failed to delete udhar" });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});