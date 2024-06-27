const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companycontrollers');

// Create a new company
router.post('/', companyController.createCompany);

// Get all companies
router.get('/', companyController.getAllCompanies);

// Get a company by ID
router.get('/:id', companyController.getCompanyById);

// Update a company by ID
router.patch('/:id', companyController.updateCompanyById);

// Delete a company by ID
router.delete('/:id', companyController.deleteCompanyById);

module.exports = router;
