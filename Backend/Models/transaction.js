const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['expense', 'income', 'transfer'], 
        required: true 
    },
    amount: {
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: function() { return this.type !== 'transfer'; }
    },
    date: { 
        type: Date, 
        required: true 
    },
    description: { 
        type: String,
        maxlength: 100
    },
    fromAccount: {
        type: String,
        required: function() { return this.type === 'transfer'; }
    },
    toAccount: {
        type: String,
        required: function() { return this.type === 'transfer'; }
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;