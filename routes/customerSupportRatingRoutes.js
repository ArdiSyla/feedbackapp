const express = require('express');
const router = express.Router();
const customerSupportRatingController = require('../controllers/customerSupportRatingController');

router.post('/', customerSupportRatingController.createCustomerSupportRating);
router.get('/', customerSupportRatingController.getCustomerSupportRatings);
router.get('/:id', customerSupportRatingController.getCustomerSupportRatingById);
router.delete('/:id', customerSupportRatingController.deleteCustomerSupportRating);

module.exports = router;
