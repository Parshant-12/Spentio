const express = require('express');
const router = express.Router();
const Udhar = require('../Models/Udhar');

router.get('/udhars', async (req, res) => {
    try {
        const udhars = await Udhar.find({ user: req.user.id });
        res.status(200).json(udhars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

router.get('/udhars/filter/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const udhars = await Udhar.find({ type: type, user: req.user.id });
        res.status(200).json(udhars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

router.get('/udhars/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const udhars = await Udhar.find({ name: { $regex: searchTerm, $options: 'i' }, user: req.user.id });
        res.status(200).json(udhars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch udhars" });
    }
});

router.post('/udhar', async (req, res) => {
    try {
        const data = req.body;
        data.user = req.user.id; // Associate udhar with the logged-in user
        const newUdhar = new Udhar(data);
        const response = await newUdhar.save();
        res.status(201).json({ message: "Udhar added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add udhar" });
    }
});

router.put('/udhar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        data.user = req.user.id;
        const response = await Udhar.findOneAndUpdate({ _id: id, user: req.user.id }, data, { new: true });
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
        const deletedUdhar = await Udhar.findOneAndDelete({
            _id: id,
            user: req.user.id
        });
        if (!deletedUdhar) {
            return res.status(404).json({ error: "Udhar not found" });
        }
        res.status(200).json({ message: "Udhar deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete udhar" });
    }
});

module.exports = router;