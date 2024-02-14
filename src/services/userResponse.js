const { Question } = require("../models/Quiz.js");
const UserResponse = require("../models/UserResponses.js");
const mongoose = require("mongoose");
const insertResponseintoDb = async (payload) => {
  const { questionId, answerId } = payload;
  const questionObjectId = new mongoose.Types.ObjectId(questionId);
  const answerObjectId = new mongoose.Types.ObjectId(answerId);
  const findAnswer = await Question.aggregate([
    { $match: { _id: questionObjectId } },
    { $unwind: "$answers" },
    { $match: { "answers._id": answerObjectId } },
    {
      $project: {
        _id: 0,
        isCorrect: {
          $ifNull: ["$answers.isCorrect", false],
        },
      },
    },
  ]);
  const isCorrect = findAnswer[0]?.isCorrect;
  if (isCorrect) {
    payload.score = 3;
  } else {
    payload.score = 1;
  }
  const result = await UserResponse.create(payload);
  return result;
};
const CalculateTotalScore = async (questionId, userId) => {
  const questionObjectId = new mongoose.Types.ObjectId(questionId);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const result = await UserResponse.aggregate([
    { $match: { questionId: questionObjectId, userId: userObjectId } },
    {
      $group: {
        _id: 0,
        totalScore: { $sum: "$score" },
      },
    },
    {
      $project: {
        _id: 0,
        totalScore: 1,
      },
    },
  ]);
  return result[0];
};

module.exports = {
  insertResponseintoDb,
  CalculateTotalScore,
};
