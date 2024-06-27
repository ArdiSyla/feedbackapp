const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questioncontroller');

// Create a new question
router.post('/', questionController.createQuestion);

// Get all questions
router.get('/', questionController.getQuestions);

// Get a single question by ID
router.get('/:id', questionController.getQuestionById);

// Update a question by ID
router.patch('/:id', questionController.updateQuestion);

// Delete a question by ID
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
