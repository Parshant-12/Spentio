const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  totalPrincipal: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  remainingBalance: { type: Number, default: function () { return this.totalPrincipal; } },
  emiAmount: { type: Number, required: true },
  dueDate: { type: Number, required: true, min: 1, max: 31 },
  isAutoDebit: { type: Boolean, default: false, required: true },
  lastProcessed: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);