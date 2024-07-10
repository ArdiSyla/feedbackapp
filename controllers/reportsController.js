// reportsRouter.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/reportmodel');

// Function to calculate reports
async function getReports(req, res) {
  try {
    // Logic to generate reports...

    // Prepare reports object
    const reports = {
      userCount,
      responseCount,
      companyUsedMost,
      medianAnswers,
      averageAnswers,
    };

    // Save reports data to MongoDB
    const savedReport = await Report.create(reports);

    // Return the saved report as a JSON response
    res.json(savedReport);

  } catch (err) {
    console.error('Error retrieving or saving reports:', err);
    res.status(500).json({ error: 'Error retrieving or saving reports' });
  }
}

// Route to get reports
router.get('/reports', getReports);

// Route to add a report
router.post('/reports', async (req, res) => {
  try {
    const { userCount, responseCount, companyUsedMost, medianAnswers, averageAnswers } = req.body;

    const newReport = new Report({
      userCount,
      responseCount,
      companyUsedMost,
      medianAnswers,
      averageAnswers,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error('Error adding report:', err);
    res.status(500).json({ error: 'Error adding report' });
  }
});

// Route to delete a report by ID
router.delete('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully', deletedReport });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ error: 'Error deleting report' });
  }
});

module.exports = router;
