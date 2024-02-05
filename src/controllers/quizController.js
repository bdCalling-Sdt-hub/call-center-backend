const { Quiz } = require("../models/Quiz");
const User = require("../models/User");
const UserResponse = require("../models/UserResponses");
const { addQuiz, updateQuestion, getAllQuizs, getSingleQuiz, getAnswerQuestion, getUserScores, getManager, getManagerWiseScores, getUserLeaderboard, getManagerLeaderboard, getSingleQuestion, getQuizManagerScores } = require("../services/QuizService");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");


// Create a new quiz (with questions and answers)
const createQuiz = catchAsync(async (req, res) => {
    const result = await addQuiz(req.body)
    sendResponse(res, { statusCode: 200, data: result, message: 'Quiz added successfully', success: true })
});

// Update a new question
const updateQuiz = catchAsync(async (req, res) => {
    const quizData = req.body;
    const quizId = req.params.id;

    const result = await updateQuestion(quizData, quizId)
    sendResponse(res, { statusCode: 200, data: result, message: 'Question updated successfully', success: true })
});


// Get all quizzes
const getAllQuizzes = catchAsync(async (req, res) => {
    const result = await getAllQuizs(req.query, req.user)
    sendResponse(res, { statusCode: 200, data: result, message: 'Quiz Retrieve successfully', success: true })
});


// Get single quizzes
const singleQuiz = catchAsync(async (req, res) => {
    const result = await getSingleQuiz(req.params.id)
    sendResponse(res, { statusCode: 200, data: result, message: 'Quiz Retrieve successfully', success: true })
})

// Get single question
const singleQuestion = catchAsync(async (req, res) => {
    const result = await getSingleQuestion(req.params.id)
    sendResponse(res, { statusCode: 200, data: result, message: 'Question Retrieve successfully', success: true })
})

// Answer a question in a quiz
const answerQuestion = catchAsync(async (req, res) => {
    const result = await getAnswerQuestion(req.params, req.user)
    sendResponse(res, { statusCode: 200, data: result, message: result.text, success: true })
})

// User scores
const userScores = catchAsync(async (req, res) => {
    const result = await getUserScores(req.params.userId)
    sendResponse(res, { statusCode: 200, data: result, message: "User Scores Retrieve successfully", success: true })
})

// Manager scores
const managerScores = catchAsync(async (req, res) => {
    const result = await getManager(req.params.managerId)
    sendResponse(res, { statusCode: 200, data: result, message: "Manager Scores Retrieve successfully", success: true })
})

// Manager Quiz scores
const managerQuizScores = catchAsync(async (req, res) => {
    const result = await getQuizManagerScores(req.params.managerId)
    sendResponse(res, { statusCode: 200, data: result, message: "Manager Scores Retrieve successfully", success: true })
})

// Manager Wise scores
const managerWiseScores = catchAsync(async (req, res) => {
    const result = await getManagerWiseScores(req.params.managerId)
    sendResponse(res, { statusCode: 200, data: result, message: "Manager Wise Scores Retrieve successfully", success: true })
})

// User Leaderboard
const userLeaderboard = catchAsync(async (req, res) => {
    const result = await getUserLeaderboard()
    sendResponse(res, { statusCode: 200, data: result, message: "User Leaderboard Retrieve successfully", success: true })
})

// Manager Leaderboard
const managerLeaderboard = catchAsync(async (req, res) => {
    const result = await getManagerLeaderboard(req.params.managerId)
    sendResponse(res, { statusCode: 200, data: result, message: "Manager Leaderboard Retrieve successfully", success: true })
})


module.exports = { createQuiz, getAllQuizzes, singleQuiz, singleQuestion, answerQuestion, updateQuiz, userScores, managerScores, managerQuizScores, managerWiseScores, userLeaderboard, managerLeaderboard };
