const mongoose = require('mongoose');

const RoiDataSchema = new mongoose.Schema({
  platform: String,
  likes: Number,
  views: Number,
  year: Number,
  month: String,
  week: String,
  day: String,
  amt: Number, // New field to store the calculated ROI
});

const RoiData = mongoose.model('RoiData', RoiDataSchema);

module.exports = RoiData;
