const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');
const db = require('./db');
const cron = require('node-cron');
const fetchUser = require('./ Middleware/authmiddleware');
env.config();
app.use(express.json());
app.use(cors());


//Signup and Login Routes
const authRoutes = require('./Routes/auth');
app.use('/', authRoutes);

//Transaction Routes
const transactionRoutes = require('./Routes/transaction');
app.use('/',fetchUser, transactionRoutes);


//Udhar Routes
const udharRoutes = require('./Routes/Udhar');
app.use('/',fetchUser, udharRoutes);


// Budget Routes
const budgetRoutes = require('./Routes/budget');
app.use('/', fetchUser, budgetRoutes);


// Loan and Subscription routes + cron jobs for auto-debit
const cronJobs = require('./Jobs/cron_jobs');

const loanSubscriptionRoutes = require('./Routes/loan_subscription');
app.use('/', fetchUser, loanSubscriptionRoutes);


// Analysis Routes
const analysisRoutes = require('./Routes/analysis');
app.use('/', fetchUser, analysisRoutes);

// AI Chat Route
const chatRoutes = require('./Routes/chat');
app.use('/', fetchUser, chatRoutes);


// Settings Route
const settingsRoutes = require('./Routes/settings');
app.use('/',fetchUser, settingsRoutes);

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is awake' });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});