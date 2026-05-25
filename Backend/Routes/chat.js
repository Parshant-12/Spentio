const express = require('express');
const router = express.Router();
const fetchUser = require('../ Middleware/authmiddleware');
const Transaction = require('../Models/transaction');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/copilot', fetchUser, async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Fetch the user's actual financial data from MongoDB
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(50); // Get recent data for context

        // 2. Format the data so the LLM can read it easily
        const transactionSummary = transactions.map(tx => 
            `${tx.date.toISOString().split('T')[0]} | ${tx.type} | ${tx.category} | ₹${tx.amount} | ${tx.description}`
        ).join('\n');

        // 3. Construct the "System Prompt" giving Gemini its identity and context
        const systemPrompt = `
        You are 'Copilot', an expert financial AI assistant integrated into a personal finance app.
        Be concise, helpful, and professional. 
        Here is the user's recent transaction history:
        ${transactionSummary}

        Answer the user's question based ONLY on the data above. If they ask something unrelated to finance or their data, politely guide them back to their finances.
        
        User Question: ${message}
        `;

        // 4. Call the Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const aiResponse = result.response.text();

        // 5. Send back to React
        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Copilot Error:", error);
        res.status(500).json({ success: false, reply: "I'm having trouble connecting to my neural network right now. Please try again later." });
    }
});

module.exports = router;