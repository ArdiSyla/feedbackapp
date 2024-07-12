const express = require('express');
const router = express.Router();
const { getServiceUsageStatistics, deleteServiceStatisticsById } = require('../controllers/serviceStatisticsController');

router.get('/', getServiceUsageStatistics);
router.delete('/:id', deleteServiceStatisticsById);

module.exports = router;
