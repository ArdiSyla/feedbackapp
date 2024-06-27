const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = require('./questionmodel');

// Define the questionnaire schema
const questionnaireSchema = new Schema({
    questions: [Question.schema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);

