const express = require("express")
const router = express.Router();
const Loan = require('../Models/loan');
const Subscription = require('../Models/subscription');

router.post('/loan', async (req, res) => {
    try {
        const data = req.body;
        const newLoan = new Loan(data);
        const response = await newLoan.save();
        if (!response) {
            return res.status(500).json({ error: "Internal Error:Failed to save loan" });
        }
        res.status(201).json({ message: "Loan added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add loan" });
    }
});

router.post('/subscription', async (req, res) => {
    try {
        const data = req.body;
        const newSubscription = new Subscription(data);
        const response = await newSubscription.save();
        if (!response) {
            return res.status(500).json({ error: "Internal Error:Failed to save subscription" });
        }
        res.status(201).json({ message: "Subscription added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add subscription" });
    }
});

router.get('/loans', async (req, res) => {
    try {
        const loans = await Loan.find();
        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch loans" });
    }
});
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
});

router.delete('/subscription/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Subscription.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete subscription" });
    }
});

router.delete('/loan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Loan.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ error: "Loan not found" });
        }
        res.status(200).json({ message: "Loan deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete loan" });
    }
});

module.exports = router;