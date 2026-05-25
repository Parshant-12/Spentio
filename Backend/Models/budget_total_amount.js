const mongoose = require('mongoose');

const budgetTotalAmountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true }
});

const BudgetTotalAmount = mongoose.model('BudgetTotalAmount', budgetTotalAmountSchema);

module.exports = BudgetTotalAmount;