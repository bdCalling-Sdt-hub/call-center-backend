const mongoose = require('mongoose');

// Answer Schema
const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

// Question Schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answers: [answerSchema]
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
    context: { type: String, required: true },
    questions: [questionSchema]
});

// Model for Answers
const Answer = mongoose.model('Answer', answerSchema);

// Model for Questions
const Question = mongoose.model('Question', questionSchema);

// Model for Quizzes
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Answer, Question, Quiz };
