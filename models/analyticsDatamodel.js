const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticsDataSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company' 
    },
    action: String,
    data: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AnalyticsData', analyticsDataSchema);
