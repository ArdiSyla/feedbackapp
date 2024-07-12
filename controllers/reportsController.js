// reportsRouter.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/reportmodel');

// Function to calculate reports
async function getReports(req, res) {
  try {
    
    const userCount = await mongoose.model('User').countDocuments();

    // Get total number of responses
    const responseCount = await mongoose.model('Response').countDocuments();

    // Find company used most (requires aggregation)
    const companyUsage = await mongoose.model('Response')
      .aggregate([
        {
          $lookup: {
            from: 'companies', // Replace with your company collection name
            localField: 'companyId',
            foreignField: '_id',
            as: 'companyData'
          }
        },
        {
          $unwind: '$companyData'
        },
        {
          $group: {
            _id: '$companyData.name',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 1
        }
      ]);

    // Extract the company with highest usage or default to 'No data'
    const companyUsedMost = companyUsage.length > 0 ? companyUsage[0]._id : 'No data';

    // Calculate median and average answers
    const medianAnswers = {};
    const averageAnswers = {};

    const allResponses = await mongoose.model('Response').find();

    // Iterate through all responses
    for (const response of allResponses) {
      for (const resp of response.responses) {
        const question = await mongoose.model('Question').findById(resp.questionId);
        if (!question) {
          continue; // Skip if question not found
        }

        // Calculate answer data based on question type
        let answerData;
        if (question.type === 'single' || question.type === 'multiple') {
          answerData = question.options ? question.options[resp.answer] : resp.answer;
        } else {
          answerData = resp.answer;
        }

        // Update medianAnswers
        if (!medianAnswers[question._id]) {
          medianAnswers[question._id] = [];
        }
        medianAnswers[question._id].push(answerData);

        // Update averageAnswers
        if (!averageAnswers[question._id]) {
          averageAnswers[question._id] = { sum: 0, count: 0 };
        }
        if (typeof answerData === 'number') {
          averageAnswers[question._id].sum += answerData;
        }
        averageAnswers[question._id].count++;
      }
    }

    // Calculate median for each question
    for (const questionId in medianAnswers) {
      medianAnswers[questionId].sort((a, b) => a - b);
      const midIndex = Math.floor(medianAnswers[questionId].length / 2);
      medianAnswers[questionId] = medianAnswers[questionId].length % 2 === 0
        ? (medianAnswers[questionId][midIndex] + medianAnswers[questionId][midIndex - 1]) / 2
        : medianAnswers[questionId][midIndex];
    }

    // Calculate average for each question (numeric answers only)
    for (const questionId in averageAnswers) {
      averageAnswers[questionId].average = averageAnswers[questionId].count > 0
        ? averageAnswers[questionId].sum / averageAnswers[questionId].count
        : 0;
    }
   

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
