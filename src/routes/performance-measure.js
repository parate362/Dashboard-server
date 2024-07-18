const { generateData, getPerformanceMeasure } = require('../controllers/performance-measure');

module.exports = function(app, router) {
    router.post('/generate-data', generateData);
    router.get('/get-performance', getPerformanceMeasure);
    app.use('/api',router)
}