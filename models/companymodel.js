const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Company', CompanySchema);
