const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: String,
    description: String,
    category: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company' // Reference to the Company model
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', serviceSchema);
