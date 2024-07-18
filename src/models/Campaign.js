// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  target: Number,
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer'
  },
  startDate: Date,   // Add startDate field
  endDate: Date      // Add endDate field
});

module.exports = mongoose.model('Campaign', campaignSchema);
