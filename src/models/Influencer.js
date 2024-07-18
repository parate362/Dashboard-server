// models/Influencer.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  likes: { type: Number, required: true },
  views: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const influencerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  posts: [postSchema],
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
});

module.exports = mongoose.model('Influencer', influencerSchema);
