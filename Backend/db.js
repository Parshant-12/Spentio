const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = db;