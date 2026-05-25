const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true // e.g., "Netflix", "AWS Hosting"
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  dueDate: {
    type: Number,
    required: true,
    min: 1,
    max: 31 // The day of the month the bill is due
  },
  isAutoDebit: {
    type: Boolean,
    default: false
  },
  lastProcessed: {
    type: Date,
    default: null // Tracks the exact date the cron job last posted this to the Transactions ledger
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);