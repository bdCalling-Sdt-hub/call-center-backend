const QueryBuilder = require("../builder/QueryBuilder");
const { Quiz } = require("../models/Quiz");

const addQuiz = async (quizBody) => {

    const savedQuiz = await Quiz.create(
        quizBody
    )
    return savedQuiz
}

const updateQuestion = async (quizBody, quizId) => {

    const updatedQuiz = await Quiz.findOneAndUpdate({ _id: quizId }, {
        $push: { questions: quizBody }
    }, { new: true })
    return updatedQuiz
}


const getAllQuizs = async (query) => {
    const quizModel = new QueryBuilder(Quiz.find(), query)
        .search()
        .filter()
        .paginate()
        .sort()
        .fields();

    const result = await quizModel.modelQuery;
    const meta = await quizModel.meta();
    return { result, meta };
}

const getSingleQuiz = async (id) => {
    const result = await Quiz.findById(id)
    return result
}

const getAnswerQuestion = async (quizBody) => {
    const { quizId, questionId, answerIndex } = quizBody;

    console.log("quizId", quizId, "questionId", questionId, "answerIndex", answerIndex);

    // Assuming answerIndex is the index of the selected answer in the array

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw new Error('Quiz not found');
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
        throw new Error('Question not found');
    }

    // Assuming answerIndex is within the bounds of the answers array
    const selectedAnswer = question.answers[answerIndex];
    if (!selectedAnswer) {
        throw new Error('Invalid answer index');
    }

    return selectedAnswer;
}


module.exports = {
    addQuiz,
    updateQuestion,
    getAllQuizs,
    getSingleQuiz,
    getAnswerQuestion
}