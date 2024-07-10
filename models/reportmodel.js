const mongoose = require('mongoose');

// Define a schema for reports
const reportSchema = new mongoose.Schema({
  userCount: Number,
  responseCount: Number,
  companyUsedMost: String,
  medianAnswers: Object,
  averageAnswers: Object,
  createdAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
