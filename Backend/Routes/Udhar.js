const express = require('express');
const router = express.Router();
const Udhar = require('../Models/Udhar');

router.get('/udhars', async (req, res) => {
    try {
        const udhars = await Udhar.find();
        res.status(200).json(udhars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

router.get('/udhars/filter/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const udhars = await Udhar.find({ type: type });
        res.status(200).json(udhars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

router.get('/udhars/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const udhars = await Udhar.find({ name: { $regex: searchTerm, $options: 'i' } });
        res.status(200).json(udhars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

router.post('/udhar', async (req, res) => {
    try {
        const data = req.body;
        const newUdhar = new Udhar(data);
        const response = await newUdhar.save();
        if (!response) {
            return res.status(500).json({ error: "Internal Error:Failed to save udhar" });
        }
        res.status(201).json({ message: "Udhar added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add udhar" });
    }
});

router.put('/udhar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const response = await Udhar.findByIdAndUpdate(id, data, { new: true });
        if (!response) {
            return res.status(404).json({ error: "Udhar not found" });
        }
        res.status(200).json({ message: "Udhar updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update udhar" });
    }
});

router.delete('/udhar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Udhar.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ error: "Udhar not found" });
        }
        res.status(200).json({ message: "Udhar deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete udhar" });
    }
});

module.exports = router;