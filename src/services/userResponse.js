const httpStatus = require("http-status");
const AppError = require("../errors/AppError.js");
const { Question } = require("../models/Quiz.js");
const UserResponse = require("../models/UserResponses.js");
const mongoose = require("mongoose");
const LeaderBoard = require("../models/leaderBorad.js");
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
const CalculateTotalScore = async (contextId, userId) => {
  const contextObjectId = new mongoose.Types.ObjectId(contextId);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const result = await UserResponse.aggregate([
    { $match: { userId: userObjectId } },
    {
      $lookup: {
        from: "questions",
        localField: "questionId",
        foreignField: "_id",
        as: "questionss",
      },
    },
    { $unwind: "$questionss" },
    { $match: { "questionss.context": contextObjectId } },
    {
      $group: {
        _id: null,
        totalScore: {
          $sum: "$score",
        },
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
const getManagerLeaderBoardDataFromDB = async () => {
  const result = await UserResponse.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: "$users" },
    { $match: { "users.role": "manager" } },
    {
      $lookup: {
        from: "questions",
        localField: "questionId",
        foreignField: "_id",
        as: "questions",
      },
    },
    { $unwind: "$questions" },
    {
      $group: {
        _id: { userId: "$users._id" },
        score: { $sum: "$score" },
        userDetails: { $first: "$users" },
      },
    },

    { $sort: { score: -1 } },
  ]);

  return result;
};
const getUsersLeaderboardDataFromDB = async () => {
  const result = await UserResponse.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: "$users" },
    { $match: { "users.role": "user" } },
    {
      $group: {
        _id: null,
        score: { $sum: "$score" },
        userDetails: { $push: "$users" },
      },
    },
    { $unwind: "$userDetails" },
    { $sort: { score: -1 } },
  ]);
  return result;
};

const deleteAllResponsesFromDB = async (contextId, usreId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteAllResponses = await UserResponse.findOneAndDelete(
      [
        {
          userId: usreId,
          contextId: contextId,
        },
      ],
      { session }
    );
    if (!deleteAllResponses) {
      throw new AppError(httpStatus.BAD_REQUEST, "something went wrong");
    }
    const deleteLeaderBoard = await LeaderBoard.findOneAndDelete(
      [
        {
          userId: usreId,
          contextId: contextId,
        },
      ],
      { session }
    );
    if (!deleteLeaderBoard) {
      throw new AppError(httpStatus.BAD_REQUEST, "something went wrong");
    }

    await session.commitTransaction();
    session.endSession();
    return deleteAllResponses[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};
module.exports = {
  insertResponseintoDb,
  CalculateTotalScore,
  getManagerLeaderBoardDataFromDB,
  getUsersLeaderboardDataFromDB,
  deleteAllResponsesFromDB,
};
