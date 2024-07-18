const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoId: String,
    views: Number,
    likes: Number,
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Video', videoSchema);