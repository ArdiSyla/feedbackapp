const CustomerSupportRating = require('../models/customerSupportRatingmodel');

// Create a new customer support rating
exports.createCustomerSupportRating = async (req, res) => {
    try {
        const rating = new CustomerSupportRating(req.body);
        const savedRating = await rating.save();
        res.status(201).json(savedRating);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all customer support ratings
exports.getCustomerSupportRatings = async (req, res) => {
    try {
        const ratings = await CustomerSupportRating.find().populate('customerId');
        res.status(200).json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single customer support rating by ID
exports.getCustomerSupportRatingById = async (req, res) => {
    try {
        const rating = await CustomerSupportRating.findById(req.params.id).populate('customerId');
        if (!rating) return res.status(404).json({ message: 'Rating not found' });
        res.status(200).json(rating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a customer support rating by ID
exports.deleteCustomerSupportRating = async (req, res) => {
    try {
        const deletedRating = await CustomerSupportRating.findByIdAndDelete(req.params.id);
        if (!deletedRating) return res.status(404).json({ message: 'Rating not found' });
        res.status(200).json({ message: 'Rating deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
