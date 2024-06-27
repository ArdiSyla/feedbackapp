const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const questionSchema = new Schema({
    question: String,
    options: [String],
    type: {
        type: String,
        enum: ['single', 'multiple', 'text'],
        required: true
    },
    isBoolean: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Question', questionSchema);
