const { GoogleGenAI, Type } = require('@google/genai');
const express = require('express');
const router = express.Router();

// Initialize the client with your environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/scan-receipt', async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'No image payload provided' });
        }

        // Isolate pure base64 data by stripping out the data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const todayDate = new Date().toISOString().split('T')[0];

        // 2. Inject it into a conditional prompt using template literals
        const prompt = `
            Analyze this image. First, classify whether the image is a "Receipt/Document" or a "Physical Product" (e.g., a can of Coca-Cola, a laptop, groceries).
            Extract the data and strictly map it to the requested JSON schema using these specific rules:
            - amount: The total purchase amount. If it's a physical product and no price tag is visible, default to "0".
            - type: Default to "expense".
            - category: The closest matching budget category based on the item or vendor.
            - date: IF the image is a Receipt, extract the exact date printed on the paper. IF the image is a Physical Product, you MUST ignore any random numbers and strictly output this exact date: "${todayDate}".
            - description: A short summary of the item or vendor name.
        `;

        // Define strict structural formatting rules using Gemini's responseSchema
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                    }
                }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        amount: { type: Type.STRING, description: "The total numerical money spent without currency symbols" },
                        type: { type: Type.STRING, enum: ["expense", "income", "transfer"], description: "Default to expense for bills" },
                        category: {
                            type: Type.STRING,
                            enum: [
                                "Food & Groceries", "Bills & EMIs", "Education & Skilling",
                                "Travel & Cabs", "Shopping", "Rent & PG",
                                "Subscriptions & Entertainment", "Investments & Savings",
                                "Pharmacy & Medical", "Others"
                            ]
                        },
                        date: { type: Type.STRING, description: "ISO date format string YYYY-MM-DD" },
                        description: { type: Type.STRING, description: "Vendor name combined with key items bought" }
                    },
                    required: ["amount", "type", "category", "date", "description"],
                },
            },
        });

        // Parse out the structured response string returned from the model
        const extractedData = JSON.parse(response.text);
        return res.status(200).json(extractedData);

    } catch (error) {
        console.error("Gemini OCR Error:", error);
        return res.status(500).json({ error: "Failed parsing transaction vectors from token payload." });
    }
});

module.exports = router;