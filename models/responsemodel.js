const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    questionnaireId: {
        type: Schema.Types.ObjectId,
        ref: 'Questionnaire',
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',  // Reference to the Company schema
        required: true  // Modify as per your application logic
    },
    responses: [{
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        answer: {
            type: Schema.Types.Mixed, // Allows for different data types (String, Array)
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware function executed before saving a response document
responseSchema.pre('save', async function(next) {
    try {
        const response = this; // Reference to the current response being saved
        const questionnaire = await mongoose.model('Questionnaire').findById(response.questionnaireId).populate('questions'); // Fetch the associated questionnaire based on questionnaireId
        if (!questionnaire) {
            throw new Error('Questionnaire not found');
        }
    // Validate each response in the 'responses' array
        for (const resp of response.responses) {
            // Find the corresponding question in the questionnaire
            const question = questionnaire.questions.find(q => q._id.equals(resp.questionId));
            if (!question) {
                throw new Error(`Question with id ${resp.questionId} not found`);
            }
           // Check the type of the question and validate the answer
            const { type, isBoolean } = question;
            const { answer } = resp;

            if (isBoolean) {
                // For boolean questions, ensure the answer is a boolean
                if (typeof answer !== 'boolean') {
                    throw new Error('Invalid answer for boolean question');
                }
            } else {
                switch (type) {
                    case 'single':
                        // For single choice questions, validate the answer against available options
                        if (typeof answer !== 'string' || !question.options.includes(answer)) {
                            throw new Error('Invalid answer for single choice question');
                        }
                        break;
                    case 'multiple':
                        // For multiple choice questions, validate each selected option
                        if (!Array.isArray(answer) || !answer.every(opt => question.options.includes(opt))) {
                            throw new Error('Invalid answer for multiple choice question');
                        }
                        break;
                    case 'text':
                         // For text questions, ensure the answer is a string
                        if (typeof answer !== 'string') {
                            throw new Error('Invalid answer for text question');
                        }
                        break;
                    default:
                        throw new Error('Unknown question type');
                }
            }
        }
        // If all validations pass, proceed with saving the response
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Response', responseSchema);
