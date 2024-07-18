const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();


const Video = require('../models/youtube')
const apiKey = process.env.YOUTUBE_API_KEY;
// const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

exports.youTubeData =  async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ message: 'Missing video URL' });
    }
  
    const videoId = extractVideoId(videoUrl);
  
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid video URL' });
    }
  
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      const data = response.data;
  
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      const video = data.items[0];
      const views = video.statistics.viewCount;
      const likes = video.statistics.likeCount;
  
      const existingVideo = await Video.findOne({ videoId });
      if (existingVideo) {
        existingVideo.views = views;
        existingVideo.likes = likes;
        await existingVideo.save();
      } else {
        const newVideo = new Video({ videoId, views, likes });
        await newVideo.save();
      }
  
      res.json({ views, likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching video data' });
    }
  };
  
  function extractVideoId(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  }

  // Function to update video statistics
async function updateVideoStatistics() {
    try {
      const videos = await Video.find({});
      for (const video of videos) {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${video.videoId}&key=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data;
  
        if (data.items && data.items.length > 0) {
          const videoData = data.items[0];
          video.views = videoData.statistics.viewCount;
          video.likes = videoData.statistics.likeCount;
          await video.save();
        }
      }
      console.log('Video statistics updated successfully');
    } catch (error) {
      console.error('Error updating video statistics:', error);
    }
  }
  
  // Schedule the updateVideoStatistics function to run every hour
  cron.schedule('0 * * * *', () => {
    console.log('Running a task every hour to update video statistics');
    updateVideoStatistics();
  });