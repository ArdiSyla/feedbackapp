const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the questionnaire schema
const questionnaireSchema = new Schema({
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
