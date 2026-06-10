const express = require('express');
const router = express.Router();
const fetchUser = require('../ Middleware/authmiddleware');
const Transaction = require('../Models/transaction');
const Message = require('../Models/message');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/copilot', fetchUser, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, reply: "Message cannot be empty." });

        const userId = req.user.id;

        // 2. Fetch data in parallel to keep things fast
        const MonthAgo = new Date();
        MonthAgo.setMonth(MonthAgo.getMonth() - 1);

        const [transactions, pastMessages] = await Promise.all([
            Transaction.find({ user: userId, date: { $gte: MonthAgo } }).sort({ date: -1 }),
            Message.find({ user: userId }).sort({ createdAt: -1 }).limit(10) // Get last 10 chat messages for context
        ]);

        // Reverse past messages so they read in chronological order (oldest to newest)
        const sortedChatHistory = pastMessages.reverse();

        // 3. Format Financial Data
        const transactionSummary = transactions.map(tx => 
            `${tx.date.toISOString().split('T')[0]},${tx.type},${tx.category},${tx.amount},${tx.description}`
        ).join('\n');

        // 4. Format Conversation History
        const chatContext = sortedChatHistory.map(msg => 
            `${msg.role === 'user' ? 'User' : 'Copilot'}: ${msg.content}`
        ).join('\n');

        // 5. Construct System Prompt with both context pieces
        const systemPrompt = `
        You are 'Copilot', an expert financial AI assistant integrated into a personal finance app.
        Be concise, helpful, and professional.

        Here is the user's transaction history for the last month (Format: Date,Type,Category,Amount,Description):
        ${transactionSummary || "No transaction data available yet."}

        Here is the recent chat history between you and the User (Use this to remember context of previous questions):
        ${chatContext || "No previous conversation history."}

        Rules:
        1. Answer the user's question based on their financial data and the conversation history.
        2. If they ask a follow-up question (like "Why? " or "Details on the first one"), refer to the chat history above.
        3. If they ask something unrelated to finance, politely decline and guide them back to their finances.
        4. Do not show raw data strings to the user; format your numbers and insights beautifully.

        User Current Question: ${message}
        `;

        // 6. Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const aiResponse = result.response.text();

        // 7. PERSISTENCE: Save both messages to MongoDB
        await Message.insertMany([
            { user: userId, role: 'user', content: message },
            { user: userId, role: 'model', content: aiResponse }
        ]);

        // 8. Return response to React
        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Copilot Error:", error.message);
        
        if (error.status === 429 || error.message.includes('429')) {
            return res.status(200).json({ 
                success: true, 
                reply: "Whoa, slow down! 🚦 I'm processing too many requests right now. Please wait about 60 seconds and ask me again." 
            });
        }

        res.status(500).json({ success: false, reply: "I'm having trouble connecting to my neural network right now." });
    }
});

router.get('/copilot/history', fetchUser, async (req, res) => {
    try {
        // Fetch last 50 messages to display in the UI chat window
        const history = await Message.find({ user: req.user.id })
            .sort({ createdAt: 1 }); // Sorted oldest to newest for UI timeline

        res.status(200).json({ success: true, history });
    } catch (error) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching chat history." });
    }
});

module.exports = router;