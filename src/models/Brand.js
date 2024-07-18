// models/Brand.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
});

module.exports = mongoose.model('Brand', brandSchema);
