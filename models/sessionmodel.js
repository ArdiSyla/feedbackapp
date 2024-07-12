const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        default: function() {
            return crypto.randomBytes(20).toString('hex'); // Generate a random token
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema);
