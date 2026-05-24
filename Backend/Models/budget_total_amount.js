const mongoose = require('mongoose');

const budgetTotalAmountSchema = new mongoose.Schema({
    id: {type: String, required: true},
    totalAmount: { type: Number, required: true },
});

const BudgetTotalAmount = mongoose.model('BudgetTotalAmount', budgetTotalAmountSchema);

module.exports = BudgetTotalAmount;