const { default: mongoose } = require("mongoose");
const { Question } = require("../models/Quiz.js");

const insertNewQuestionsIntoDb = async (id, payload) => {
  const data = {
    context: id,
    ...payload,
  };
  const result = await Question.create(data);
  return result;
};

const updateQuestionintoDB = async (id, payload) => {
  const result = await Question.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const deleteQuestionFromDb = async (id, payload) => {
  const result = await Question.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const findRandomQuestionsFromDb = async (contextId, userId) => {
  const contextObjectId = new mongoose.Types.ObjectId(contextId);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    { $match: { context: contextObjectId } },
    {
      $lookup: {
        from: "userresponses",
        let: { questionId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$questionId", "$$questionId"] },
                  { $eq: ["$userId", userObjectId] },
                ],
              },
            },
          },
        ],
        as: "userResponses",
      },
    },
    { $match: { userResponses: [] } },
    { $sample: { size: 1 } },
    { $unset: "userResponses" },
  ];

  const result = await Question.aggregate(pipeline);
  return result;
};
module.exports = {
  insertNewQuestionsIntoDb,
  updateQuestionintoDB,
  deleteQuestionFromDb,
  findRandomQuestionsFromDb,
};
