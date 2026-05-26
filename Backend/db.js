const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

mongoose.connect(process.env.MONGODB_URI)

const connectWithRetry = async () => {
    console.log('Attempting MongoDB connection...');
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, 
        });
    } catch (err) {
        console.error('Initial MongoDB connection failed. Retrying in 5 seconds...', err.message);
        setTimeout(connectWithRetry, 5000);
    }
};

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
    console.warn('Disconnected from MongoDB. Mongoose is attempting runtime reconnection...');
});

db.on('reconnected', () => {
    console.log('Successfully reconnected to MongoDB!');
});

db.on('error', (err) => {
    console.error('MongoDB database connection error:', err);
});


module.exports = {db,connectWithRetry};