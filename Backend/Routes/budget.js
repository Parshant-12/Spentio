const express = require('express');
const router = express.Router();
const BudgetTotalAmount = require('../Models/budget_total_amount');
const Budget = require('../Models/budget');
const Transaction = require('../Models/transaction');
const mongoose = require('mongoose');
router.post('/budget', async (req, res) => {
    try {
        const totalAmount = req.body;
        const {id} = req.user;
        const response = await BudgetTotalAmount.findOneAndUpdate({ user: id }, totalAmount, { returnDocument:'after'});
        res.status(201).json({ message: "Budget added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add budget" });
    }
});

router.get('/budget/global', async (req, res) => {
    try {
        const {id} = req.user;
        const response = await BudgetTotalAmount.findOne({ user: id });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch budget" });
    }
});

router.post('/budget/track', async (req, res) => {
    try {
        const data = req.body;
        data.user = req.user.id;
        const check = await Budget.findOne({ category: data.category, user: req.user.id });
        if (check) {
            check.amount = data.amount;
            const response = await check.save();
            if (!response) {
                return res.status(500).json({ error: "Internal Error:Failed to update budget" });
            }
            return res.status(200).json({ message: "Budget updated successfully" });
        }
        const newBudget = new Budget(data);
        const response = await newBudget.save();
        res.status(201).json({ message: "Budget added successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete('/budget/track/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const response = await Budget.findOneAndDelete({ category, user: req.user.id });
        if (!response) {
            return res.status(404).json({ error: "Budget not found" });
        }
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/budgets/untracked', async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // FIX 1: The safest way to capture the whole month is to go up to the exact start of the NEXT month
        const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const spentData = await Transaction.aggregate([
            { 
                $match: { 
                    // FIX 2: Manually cast the string to a MongoDB ObjectId
                    user: new mongoose.Types.ObjectId(req.user.id), 
                    date: { $gte: firstDayOfMonth, $lt: firstDayOfNextMonth }, // Changed $lte to $lt
                    type: "expense" 
                } 
            },
            { 
                $group: { 
                    _id: "$category", 
                    totalSpent: { $sum: "$amount" } 
                } 
            }
        ]);

        const budgetLimits = await Budget.find({ user: req.user.id });

        const untrackedSpending = spentData.filter(spentItem => {
            const hasBudget = budgetLimits.some(budget => budget.category.toLowerCase() === spentItem._id.toLowerCase());
            return !hasBudget; 
        });

        const formattedUntracked = untrackedSpending.map(item => ({
            category: item._id,
            spent: item.totalSpent
        }));

        res.status(200).json(formattedUntracked);
    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ error: "Failed to calculate untracked spending" });
    }
});

router.get('/budgets/summary', async (req, res) => {
    try {
        // STEP 1: Define the current month's date range
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // STEP 2: The Aggregation Pipeline (The Heavy Lifting)
        // This looks at the Transactions collection and calculates the spent totals
        const spentData = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), date: { $gte: firstDayOfMonth, $lt: firstDayOfNextMonth }, type: "expense" } },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } }
        ]);

        // STEP 3: Fetch the user's saved limits
        const budgetLimits = await Budget.find({ user: req.user.id });

        // STEP 4: Merge the Data
        const formattedBudgets = budgetLimits.map(budget => {
            const matchedSpent = spentData.find(item => item._id.toLowerCase() === budget.category.toLowerCase());

            return {
                category: budget.category,
                spent: matchedSpent ? matchedSpent.totalSpent : 0,
                amount: budget.amount
            };
        });
        res.status(200).json(formattedBudgets);
    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ error: "Failed to calculate budget summary" });
    }
});

module.exports = router;