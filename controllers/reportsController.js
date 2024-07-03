const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Function to calculate reports
async function getReports(req, res) {
  try {
    // Get user registration count
    const userCount = await mongoose.model('User').countDocuments();

    // Get total number of questions filled (assuming responses reference questions)
    const responseCount = await mongoose.model('Response').countDocuments();

    // Find company used most (requires aggregation)
    const companyUsage = await mongoose.model('Response')
      .aggregate([
        {
          $lookup: {
            from: 'companies', // Replace with your company collection name
            localField: 'company',
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
    const companyUsedMost = companyUsage.length > 0 ? companyUsage[0]._id : 'No data';

    // Calculate median and average answers (requires looking up questions and potentially iterating through responses)
    const medianAnswers = {};
    const averageAnswers = {};

    const allResponses = await mongoose.model('Response').find();

    for (const response of allResponses) {
      for (const resp of response.responses) {
        const question = await mongoose.model('Question').findById(resp.questionId);
        if (!question) {
          continue; // Skip if question not found
        }

        const answerData = question.options ? question.options[resp.answer] : resp.answer;

        if (!medianAnswers[question._id]) {
          medianAnswers[question._id] = [];
        }
        medianAnswers[question._id].push(answerData);

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

    const reports = {
      userCount,
      responseCount,
      companyUsedMost,
      medianAnswers,
      averageAnswers,
    };

    // Return the reports as a JSON response
    res.json(reports);

  } catch (err) {
    console.error('Error retrieving reports:', err);
    res.status(500).json({ error: 'Error retrieving reports' });
  }
}

// Define a route to get reports
router.get('/reports', getReports);

module.exports = router;
