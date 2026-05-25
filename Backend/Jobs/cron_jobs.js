const cron = require('node-cron');
const Subscription = require('../Models/subscription');
const Loan = require('../Models/loan');
const Transaction = require('../Models/transaction');

// Run ONCE a day at Midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily auto-debit routine...');

    const todayDate = new Date().getDate();
    const todayString = new Date().toDateString(); // e.g., "Sun May 24 2026"

    try {
        // ==========================================
        // 1. PROCESS SUBSCRIPTIONS
        // ==========================================
        const dueBills = await Subscription.find({ dueDate: todayDate, isAutoDebit: true });

        for (let bill of dueBills) {
            // Idempotency Check: Did we already process this exact bill today?
            if (bill.lastProcessed && bill.lastProcessed.toDateString() === todayString) {
                continue; // Skip to the next bill
            }

            await Transaction.create({
                user: bill.user, // <-- THE FIX: Pull the user ID directly from the bill!
                type: 'expense',
                amount: bill.amount, // Verify this matches your Subscription schema!
                category: 'Subscriptions & Entertainment',
                date: new Date(),
                description: `${bill.name} (Auto-Debit)`
            });

            bill.lastProcessed = new Date();
            await bill.save();
        }
        console.log(`Processed ${dueBills.length} subscriptions.`);

        // ==========================================
        // 2. PROCESS LOANS & EMIs
        // ==========================================
        const dueLoans = await Loan.find({ dueDate: todayDate, isAutoDebit: true });

        for (let loan of dueLoans) {
            // Idempotency Check: Don't double-charge EMIs
            if (loan.lastProcessed && loan.lastProcessed.toDateString() === todayString) {
                continue; 
            }

            await Transaction.create({
                user: loan.user, // <-- THE FIX: Pull the user ID directly from the loan!
                type: 'expense',
                amount: loan.emiAmount, // WARNING: Check your Loan schema. It's likely 'emiAmount' not 'amount'.
                category: 'Bills & EMIs',
                date: new Date(),
                description: `${loan.name} EMI (Auto-Debit)`
            });

            loan.remainingBalance -= loan.emiAmount;

            if (loan.remainingBalance < 0) {
                loan.remainingBalance = 0;
            }

            loan.lastProcessed = new Date();
            await loan.save();
        }
        console.log(`Processed ${dueLoans.length} loans.`); 

    } catch (error) {
        console.error('CRITICAL: Daily Auto-Debit Job Failed:', error);
    }
});
module.exports = cron;