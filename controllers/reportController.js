const Report = require('../models/reportmodel');

// Create a new report
exports.createReport = async (req, res) => {
    try {
        const report = new Report(req.body);
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a report by ID
exports.updateReport = async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReport) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json(updatedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json({ message: 'Report deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
