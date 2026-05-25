const mongoose = require('mongoose');

const UdharSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['gave', 'took'],
        required: true
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, maxlength: 100 }
});

const Udhar = mongoose.model('Udhar', UdharSchema);
module.exports = Udhar;