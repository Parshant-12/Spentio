const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transaction'); // Adjust path to match your folder structure
const mongoose = require('mongoose');

router.get('/analysis', async (req, res) => {
    try {
        // 1. Extract dates from the URL query parameters
        const { startDate, endDate, prevStartDate, prevEndDate } = req.query;

        const currentStart = new Date(startDate);
        const currentEnd = new Date(endDate);
        const prevStart = new Date(prevStartDate);
        const prevEnd = new Date(prevEndDate);

        const userId = new mongoose.Types.ObjectId(req.user.id);

        // 2. Fetch all raw transactions for the current period (for the bar chart buckets)
        const rawTransactions = await Transaction.find({
            user: userId,
            type: 'expense',
            date: { $gte: currentStart, $lte: currentEnd }
        });

        // 3. Calculate Current Period Total
        const currentPeriodData = await Transaction.aggregate([
            { $match: { user: userId, type: 'expense', date: { $gte: currentStart, $lte: currentEnd } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const currentTotal = currentPeriodData.length > 0 ? currentPeriodData[0].total : 0;

        // 4. Calculate Previous Period Total (for Variance)
        const prevPeriodData = await Transaction.aggregate([
            { $match: { user: userId, type: 'expense', date: { $gte: prevStart, $lte: prevEnd } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const previousTotal = prevPeriodData.length > 0 ? prevPeriodData[0].total : 0;

        // 5. Calculate Top Categories (Group by category, sum amounts, sort descending)
        const topCategoriesData = await Transaction.aggregate([
            { $match: { user: userId, type: 'expense', date: { $gte: currentStart, $lte: currentEnd } } },
            { $group: { _id: "$category", amount: { $sum: "$amount" } } },
            { $sort: { amount: -1 } }, // Sort highest to lowest
            { $limit: 3 } // Grab only the top 3
        ]);

        // Map the top categories to include the percentage your React UI expects
        const topCategories = topCategoriesData.map(cat => ({
            label: cat._id,
            amount: cat.amount,
            percentage: currentTotal > 0 ? ((cat.amount / currentTotal) * 100).toFixed(1) : 0
        }));

        // 6. Send the payload back to React
        res.status(200).json({
            success: true,
            data: {
                currentTotal,
                previousTotal,
                topCategories,
                rawTransactions
            }
        });

    } catch (error) {
        console.error("Analysis Calculation Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate analysis" });
    }
});

module.exports = router;