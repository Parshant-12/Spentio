const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');
const db = require('./db');
const cron = require('node-cron');
env.config();
app.use(express.json());
app.use(cors());


//Signup and Login Routes
const authRoutes = require('./Routes/auth');
app.use('/', authRoutes);

//Transaction Routes
const transactionRoutes = require('./Routes/transaction');
app.use('/', transactionRoutes);


//Udhar Routes
const udharRoutes = require('./Routes/Udhar');
app.use('/', udharRoutes);


// Budget Routes
const budgetRoutes = require('./Routes/budget');
app.use('/', budgetRoutes);


// Loan and Subscription routes + cron jobs for auto-debit
const Subscription = require('./Models/subscription');
const Loan = require('./Models/loan');
const Transaction = require('./Models/transaction');
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily auto-debit check...');

    // 1. Get today's date (e.g., the 24th)
    const today = new Date().getDate();

    try {
        // 2. Find all subscriptions due today where auto-debit is enabled
        const dueBills = await Subscription.find({
            dueDate: today,
            isAutoDebit: true
        });

        // 3. Loop through them and create standard Transactions
        for (let bill of dueBills) {
            await Transaction.create({
                type: 'expense',
                amount: bill.amount,
                category: 'Subscriptions and Entertainment',
                date: new Date(),
                description: `${bill.name} (Auto-Debit)`
            });
            // Update lastProcessed so we don't double-charge them!
            bill.lastProcessed = new Date();
            await bill.save();
        }
    } catch (error) {
        console.error('Cron Job Failed:', error);
    }
});

cron.schedule('0 0 * * *', async () => {
    console.log('Running daily auto-debit check...');

    // 1. Get today's date (e.g., the 24th)
    const today = new Date().getDate();

    try {
        // 2. Find all loans due today where auto-debit is enabled
        const dueloans = await Loan.find({
            dueDate: today,
            isAutoDebit: true
        });

        // 3. Loop through them and create standard Transactions
        for (let loan of dueloans) {
            await Transaction.create({
                type: 'expense',
                amount: loan.amount,
                category: 'Bills & EMIs',
                date: new Date(),
                description: `${loan.name} (Auto-Debit)`
            });
            // Update lastProcessed so we don't double-charge them!
            loan.lastProcessed = new Date();
            await loan.save();
        }
    } catch (error) {
        console.error('Cron Job Failed:', error);
    }
});

const loanSubscriptionRoutes = require('./Routes/loan_subscription');
app.use('/', loanSubscriptionRoutes);

const analysisRoutes = require('./Routes/analysis');
app.use('/', analysisRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});