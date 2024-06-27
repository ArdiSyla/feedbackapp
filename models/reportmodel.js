const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    data: {
        type: Schema.Types.Mixed, // To store various types of report data (JSON, arrays, etc.)
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
