const Response = require('../models/responsemodel');

// Create a new response
exports.createResponse = async (req, res) => {
    try {
        const response = new Response(req.body);
        const savedResponse = await response.save();
        res.status(201).json(savedResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all responses
exports.getResponses = async (req, res) => {
    try {
        const responses = await Response.find();
        res.status(200).json(responses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single response by ID
exports.getResponseById = async (req, res) => {
    try {
        const response = await Response.findById(req.params.id);
        if (!response) return res.status(404).json({ message: 'Response not found' });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateResponse = async (req, res) => {
    try {
        const updatedResponse = await Response.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedResponse) return res.status(404).json({ message: 'Response not found' });
        res.status(200).json(updatedResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a response by ID
exports.deleteResponse = async (req, res) => {
    try {
        const deletedResponse = await Response.findByIdAndDelete(req.params.id);
        if (!deletedResponse) return res.status(404).json({ message: 'Response not found' });
        res.status(200).json({ message: 'Response deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
