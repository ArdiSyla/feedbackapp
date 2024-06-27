const Questionnaire = require('../models/questionnairemodel');

// Create a new questionnaire
exports.createQuestionnaire = async (req, res) => {
    try {
        const questionnaire = new Questionnaire(req.body);
        const savedQuestionnaire = await questionnaire.save();
        res.status(201).json(savedQuestionnaire);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all questionnaires
exports.getQuestionnaires = async (req, res) => {
    try {
        const questionnaires = await Questionnaire.find();
        res.status(200).json(questionnaires);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findById(req.params.id);
        if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
        res.status(200).json(questionnaire);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a questionnaire by ID
exports.deleteQuestionnaire = async (req, res) => {
    try {
        const deletedQuestionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
        if (!deletedQuestionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
        res.status(200).json({ message: 'Questionnaire deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};