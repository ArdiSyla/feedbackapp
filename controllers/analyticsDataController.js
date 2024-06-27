const AnalyticsData = require('../models/analyticsDatamodel');

// Create a new analytics data entry
exports.createAnalyticsData = async (req, res) => {
    try {
        const analyticsData = new AnalyticsData(req.body);
        const savedAnalyticsData = await analyticsData.save();
        res.status(201).json(savedAnalyticsData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all analytics data entries
exports.getAnalyticsData = async (req, res) => {
    try {
        const analyticsData = await AnalyticsData.find().populate('userId');
        res.status(200).json(analyticsData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single analytics data entry by ID
exports.getAnalyticsDataById = async (req, res) => {
    try {
        const analyticsData = await AnalyticsData.findById(req.params.id).populate('userId');
        if (!analyticsData) return res.status(404).json({ message: 'Analytics data not found' });
        res.status(200).json(analyticsData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an analytics data entry by ID
exports.deleteAnalyticsData = async (req, res) => {
    try {
        const deletedAnalyticsData = await AnalyticsData.findByIdAndDelete(req.params.id);
        if (!deletedAnalyticsData) return res.status(404).json({ message: 'Analytics data not found' });
        res.status(200).json({ message: 'Analytics data deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
