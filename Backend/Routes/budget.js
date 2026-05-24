const express = require('express');
const router = express.Router();
const BudgetTotalAmount = require('../Models/budget_total_amount');
const Budget = require('../Models/budget');
const Transaction = require('../Models/transaction');
router.post('/budget', async (req, res) => {
    try {
        const id = '6a115503fded1e11c42541a5';
        const totalAmount = req.body;
        const response = await BudgetTotalAmount.findByIdAndUpdate(id, totalAmount, { new: true });
        if (!response) {
            return res.status(500).json({ error: "Internal Error:Failed to save budget" });
        }
        res.status(201).json({ message: "Budget added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add budget" });
    }
});

router.get('/budget/global', async (req, res) => {
    try {
        const id = '6a115503fded1e11c42541a5';
        const response = await BudgetTotalAmount.findById(id);
        if (!response) {
            return res.status(404).json({ error: "Budget not found" });
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch budget" });
    }
});

router.post('/budget/track', async (req, res) => {
    try {
        const data = req.body;
        const check = await Budget.findOne({ category: data.category });
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
        const response = await Budget.findOneAndDelete({ category });
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
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const spentData = await Transaction.aggregate([
            { $match: { date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, type: "expense" } },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } }
        ]);

        const budgetLimits = await Budget.find();

        const untrackedSpending = spentData.filter(spentItem => {
            // Check if this spent category exists in the budget database 
            const hasBudget = budgetLimits.some(budget => budget.category === spentItem._id);
            return !hasBudget; // Return true to keep it if it has NO budget
        });
        const formattedUntracked = untrackedSpending.map(item => {
            return {
                category: item._id,
                spent: item.totalSpent
            };
        });
        res.status(200).json(formattedUntracked);
    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(500).json({ error: "Failed to calculate budget summary" });
    }
});

router.get('/budgets/summary', async (req, res) => {
    try {
        // STEP 1: Define the current month's date range
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // STEP 2: The Aggregation Pipeline (The Heavy Lifting)
        // This looks at the Transactions collection and calculates the spent totals
        const spentData = await Transaction.aggregate([
            { $match: { date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, type: "expense" } },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } }
        ]);

        // STEP 3: Fetch the user's saved limits
        const budgetLimits = await Budget.find();

        // STEP 4: Merge the Data
        const formattedBudgets = budgetLimits.map(budget => {
            const matchedSpent = spentData.find(item => item._id === budget.category);

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