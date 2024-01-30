const express = require('express');
const { getAllQuizzes, answerQuestion, updateQuiz, createQuiz, singleQuiz } = require('../controllers/quizController');
const auth = require('../middlewares/auth');
const router = express.Router();

// Create a new quiz
router.post('/quizzes', auth('manager'), createQuiz);

router.put('/quizzes/:id', auth('manager'), updateQuiz);

// Get all quizzes
router.get('/quizzes', auth('manager', 'user'), getAllQuizzes);

// Get single quizzes
router.get('/:id', auth('manager', 'user'), singleQuiz);

// Answer a question in a quiz
router.post('/quizzes/:quizId/questions/:questionId/answer/:answerIndex', answerQuestion);

module.exports = router;
