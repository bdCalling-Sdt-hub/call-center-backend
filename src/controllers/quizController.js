const { Quiz } = require("../models/Quiz");
const { addQuiz, updateQuestion, getAllQuizs, getSingleQuiz, getAnswerQuestion } = require("../services/QuizService");
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
    const result = await getAllQuizs(req.query)
    sendResponse(res, { statusCode: 200, data: result, message: 'Quiz Retrieve successfully', success: true })
});


// Get single quizzes
const singleQuiz = catchAsync(async (req, res) => {
    const result = await getSingleQuiz(req.params.id)
    sendResponse(res, { statusCode: 200, data: result, message: 'Quiz Retrieve successfully', success: true })
})

// Answer a question in a quiz
const answerQuestion = catchAsync(async (req, res) => {
    const result = await getAnswerQuestion(req.params)
    sendResponse(res, { statusCode: 200, data: result, message: result.text, success: true })
})
// const answerQuestion = async (req, res) => {
//     try {
//         const { quizId, questionId, answerIndex } = req.params;

//         console.log("quizId", quizId, "questionId", questionId, "answerIndex", answerIndex)

//         // Assuming answerIndex is the index of the selected answer in the array

//         const quiz = await Quiz.findById(quizId);
//         console.log("quiz", quiz)
//         if (!quiz) {
//             return res.status(404).json({ error: 'Quiz not found' });
//         }

//         const question = quiz.questions.id(questionId);
//         console.log("question", question)
//         if (!question) {
//             return res.status(404).json({ error: 'Question not found' });
//         }

//         // Assuming answerIndex is within the bounds of the answers array
//         const selectedAnswer = question.answers[answerIndex];
//         console.log("selectedAnswer", selectedAnswer)
//         if (!selectedAnswer) {
//             return res.status(400).json({ error: 'Invalid answer index' });
//         }

//         // You can implement scoring logic here based on selectedAnswer.isCorrect

//         res.status(200).json({ message: 'Answer submitted successfully', data: selectedAnswer });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

module.exports = { createQuiz, getAllQuizzes, singleQuiz, answerQuestion, updateQuiz };
