const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSupportRatingSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CustomerSupportRating', customerSupportRatingSchema);
