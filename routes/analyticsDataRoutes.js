const express = require('express');
const router = express.Router();
const analyticsDataController = require('../controllers/analyticsDataController');

router.post('/', analyticsDataController.createAnalyticsData);
router.get('/', analyticsDataController.getAnalyticsData);
router.get('/:id', analyticsDataController.getAnalyticsDataById);
router.delete('/:id', analyticsDataController.deleteAnalyticsData);

module.exports = router;
