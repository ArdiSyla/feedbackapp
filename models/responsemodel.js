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

responseSchema.pre('save', async function(next) {
    try {
        const response = this;
        const questionnaire = await mongoose.model('Questionnaire').findById(response.questionnaireId).populate('questions');
        if (!questionnaire) {
            throw new Error('Questionnaire not found');
        }

        for (const resp of response.responses) {
            const question = questionnaire.questions.find(q => q._id.equals(resp.questionId));
            if (!question) {
                throw new Error(`Question with id ${resp.questionId} not found`);
            }

            const { type, isBoolean } = question;
            const { answer } = resp;

            if (isBoolean) {
                if (typeof answer !== 'boolean') {
                    throw new Error('Invalid answer for boolean question');
                }
            } else {
                switch (type) {
                    case 'single':
                        if (typeof answer !== 'string' || !question.options.includes(answer)) {
                            throw new Error('Invalid answer for single choice question');
                        }
                        break;
                    case 'multiple':
                        if (!Array.isArray(answer) || !answer.every(opt => question.options.includes(opt))) {
                            throw new Error('Invalid answer for multiple choice question');
                        }
                        break;
                    case 'text':
                        if (typeof answer !== 'string') {
                            throw new Error('Invalid answer for text question');
                        }
                        break;
                    default:
                        throw new Error('Unknown question type');
                }
            }
        }

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Response', responseSchema);
