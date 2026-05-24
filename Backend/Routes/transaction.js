const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transaction');

router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
router.get('/transactions/filter/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const transactions = await Transaction.find({ type: type });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
router.get('/transactions/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const transactions = await Transaction.find({ description: { $regex: searchTerm, $options: 'i' } });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

router.post('/transactions', async (req, res) => {
    try {
        const data = req.body;
        const newTransaction = new Transaction(data);
        const response = await newTransaction.save();
        if (!response) {
            return res.status(500).json({ error: "Internal Error:Failed to save transaction" });
        }
        res.status(201).json({ message: "Transaction added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add transaction" });
    }
});

router.put('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const response = await Transaction.findByIdAndUpdate(id, data, { new: true });
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
        const response = await Transaction.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});

module.exports = router;