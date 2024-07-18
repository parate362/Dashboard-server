const { youTubeData } = require('../controllers/youtube');

module.exports = function(app, router) {
    router.get('/video-data', youTubeData);
    app.use('/api',router)
}


