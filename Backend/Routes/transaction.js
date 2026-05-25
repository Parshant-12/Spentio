const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transaction');

router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
router.get('/transactions/filter/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const transactions = await Transaction.find({ type: type , user: req.user.id });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
router.get('/transactions/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const transactions = await Transaction.find({ description: { $regex: searchTerm, $options: 'i' }, user: req.user.id });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

router.post('/transactions', async (req, res) => {
    try {
        const data = req.body;
        data.user = req.user.id; // Associate transaction with the logged-in user
        const newTransaction = new Transaction(data);
        const response = await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add transaction" });
    }
});

router.put('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        data.user = req.user.id;
        const response = await Transaction.findOneAndUpdate({ _id: id, user: req.user.id }, data, { new: true });
        if (!response) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update transaction" });
    }
});

router.delete('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: id,
            user: req.user.id 
        });
        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});

module.exports = router;