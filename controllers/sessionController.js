const Session = require('../models/sessionmodel');

// Create a new session
exports.createSession = async (req, res) => {
    try {
        const session = new Session(req.body);
        const savedSession = await session.save();
        res.status(201).json(savedSession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate('userId');
        res.status(200).json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single session by ID
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate('userId');
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.status(200).json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('userId');
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.status(200).json(session);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a session by ID
exports.deleteSession = async (req, res) => {
    try {
        const deletedSession = await Session.findByIdAndDelete(req.params.id);
        if (!deletedSession) return res.status(404).json({ message: 'Session not found' });
        res.status(200).json({ message: 'Session deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
