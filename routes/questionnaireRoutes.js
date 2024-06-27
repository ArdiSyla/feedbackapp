const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');

router.post('/', questionnaireController.createQuestionnaire);
router.get('/', questionnaireController.getQuestionnaires);
router.get('/:id', questionnaireController.getQuestionnaireById);
router.delete('/:id', questionnaireController.deleteQuestionnaire);

module.exports = router;
