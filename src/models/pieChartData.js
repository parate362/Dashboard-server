const mongoose =require('mongoose');

const dataSchema = new mongoose.Schema({
  platform: String,
  likes: Number,
  views: Number,
  year: Number,
  month: String,
  week: String,
  day: String, // Add this field to store the day of the week
});

const NewData = mongoose.model('Data', dataSchema);
module.exports = NewData;
