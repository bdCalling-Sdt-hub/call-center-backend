const {
  insertNewQuestionsIntoDb,
  updateQuestionintoDB,
  deleteQuestionFromDb,
} = require("../services/questionService.js");
const catchAsync = require("../utils/catchAsync.js");
const sendResponse = require("../utils/sendResponse.js");

const insertNewQuestion = catchAsync(async (req, res) => {
  const result = await insertNewQuestionsIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "questions added  successfully",
    success: true,
  });
});
const updateQuestion = catchAsync(async (req, res) => {
  const result = await updateQuestionintoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "questions Updated  successfully",
    success: true,
  });
});
const deleteQuestion = catchAsync(async (req, res) => {
  const result = await deleteQuestionFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "question deleted  successfully",
    success: true,
  });
});

module.exports = {
  insertNewQuestion,
  updateQuestion,
  deleteQuestion,
};
