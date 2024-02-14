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
module.exports = {
  insertNewQuestionsIntoDb,
  updateQuestionintoDB,
  deleteQuestionFromDb,
};
