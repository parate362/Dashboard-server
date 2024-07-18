const Video = require('../models/youtube')

//APIs to fetch data stored in mongodb
exports.getVideoViews = async (req, res) => {
    try {
      let viewsCount = 0;
      const videos = await Video.find({}, { views: 1, _id: 0 });
      // const viewsData = videos.map(video => video.views);
      const viewsData = videos.map(video => viewsCount += video.views);
      res.json(viewsCount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching video views' });
    }
  };
  
  
  exports.getVideoLikes = async (req, res) => {
    try {
      let likesCount = 0;
      const videos = await Video.find({}, { likes: 1, _id:0});
      // const likesData = videos.map(video => video.likes);
      const likesData = videos.map(video => likesCount += video.likes);
      res.json(likesCount);
    } catch (error) {
      console.error('Error fetching video likes:', error);
      res.status(500).json({ message: 'Error fetching video likes' });
    }
  };
  