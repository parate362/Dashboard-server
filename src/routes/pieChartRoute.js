const { getVideoViews,getVideoLikes } = require('../controllers/pie-chart');

module.exports = function(app, router) {
    router.get('/video-views', getVideoViews);
    router.get('/video-likes', getVideoLikes)
    app.use('/api',router)
}


