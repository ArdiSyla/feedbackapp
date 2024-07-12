const mongoose = require('mongoose');

const serviceStatisticSchema = new mongoose.Schema({
    numberOfServices: { type: Number, required: true },
    popularServices: [{
        category: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    servicesPerCompany: [{
        companyName: { type: String, required: true },
        services: [{ type: String }]
    }],
    serviceUsageTrends: [{
        month: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceStatistic', serviceStatisticSchema);