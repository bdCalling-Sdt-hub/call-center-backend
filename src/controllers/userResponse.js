const {
  insertResponseintoDb,
  CalculateTotalScore,
} = require("../services/userResponse.js");
const catchAsync = require("../utils/catchAsync.js");
const sendResponse = require("../utils/sendResponse.js");

const insertQuizAnswer = catchAsync(async (req, res) => {
  req.body.userId = req.user.userId;
  const result = await insertResponseintoDb(req.body);
  sendResponse(res, {
    statusCode: 201,
    data: result,
    message: "quiz answer submitted successfully",
    success: true,
  });
});
const calculateScore = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await CalculateTotalScore(req.params.id, userId);
  sendResponse(res, {
    statusCode: 201,
    data: result,
    message: "total score retrive successfully",
    success: true,
  });
});

module.exports = {
  insertQuizAnswer,
  calculateScore,
};
