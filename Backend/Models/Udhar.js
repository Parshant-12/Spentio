const mongoose = require('mongoose');

const UdharSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['lent', 'borrow'], 
        required: true 
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, maxlength: 100 }
});

const Udhar = mongoose.model('Udhar', UdharSchema);
module.exports = Udhar;