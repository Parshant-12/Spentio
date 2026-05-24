// routes/analysis.js
const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transaction');

router.get('/analysis', async (req, res) => {
  try {
    const { startDate, endDate, prevStartDate, prevEndDate } = req.query;

    // Convert strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    const prevStart = new Date(prevStartDate);
    const prevEnd = new Date(prevEndDate);

    // 1. Current Period Total & Categories
    const currentPeriodData = await Transaction.aggregate([
      { 
        $match: { 
          user: req.user._id, 
          date: { $gte: start, $lte: end },
          type: 'expense' // Assuming you track income/expense
        } 
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } } // Sort largest to smallest
    ]);

    // 2. Previous Period Total (For Variance)
    const previousPeriodData = await Transaction.aggregate([
      { 
        $match: { 
          user: req.user._id, 
          date: { $gte: prevStart, $lte: prevEnd },
          type: 'expense' 
        } 
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate totals
    const currentTotal = currentPeriodData.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const previousTotal = previousPeriodData.length > 0 ? previousPeriodData[0].totalAmount : 0;

    // Format Top Categories (Take top 3, calculate percentages)
    const topCategories = currentPeriodData.slice(0, 3).map(cat => ({
      label: cat._id,
      amount: cat.totalAmount,
      percentage: currentTotal > 0 ? ((cat.totalAmount / currentTotal) * 100).toFixed(1) : 0
    }));

    // 3. Time-Series / Weekly Split (Simplified into 4 buckets for UI)
    // In a real app you'd group by $week, but here we'll let frontend bucket the days 
    // for exact alignment with your 4-bar UI.
    const timeSeriesData = await Transaction.find({
        user: req.user._id, 
        date: { $gte: start, $lte: end },
        type: 'expense'
    }).select('amount date');

    res.json({
      success: true,
      data: {
        currentTotal,
        previousTotal,
        topCategories,
        rawTransactions: timeSeriesData // Frontend will split this into the 4 bars
      }
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ success: false, message: 'Server error crunching data' });
  }
});

module.exports = router;