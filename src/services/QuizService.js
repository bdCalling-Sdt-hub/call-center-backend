const QueryBuilder = require("../builder/QueryBuilder");
const { Quiz } = require("../models/Quiz");
const User = require("../models/User");
const UserResponse = require("../models/UserResponses");

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


// const getAllQuizs = async (query, loginUser) => {
//     console.log(loginUser?.userId)
//     const quizModel = new QueryBuilder(Quiz.find(), query)
//         .search()
//         .filter()
//         .paginate()
//         .sort()
//         .fields();

//     const result = await quizModel.modelQuery;
//     console.log(result)
//     const meta = await quizModel.meta();


//     const managerScores = await UserResponse.find({ userId: loginUser?.userId });
//     const quizScores = managerScores.reduce((accumulator, item) => {
//         const { quizId, score } = item;
//         accumulator[quizId] = (accumulator[quizId] || 0) + score;
//         return accumulator;
//     }, {});
//     console.log(quizScores)


//     return { result, meta };
// }

const getAllQuizs = async (query, loginUser) => {
    console.log(loginUser?.userId);

    // Use the QueryBuilder for fetching quiz data
    const quizModel = new QueryBuilder(Quiz.find(), query)
        .search()
        .filter()
        .paginate()
        .sort()
        .fields();

    // Fetch quiz data
    const result = await quizModel.modelQuery;
    console.log(result);

    // Fetch meta information
    const meta = await quizModel.meta();

    // Fetch manager scores for the logged-in user
    const managerScores = await UserResponse.find({ userId: loginUser?.userId });

    // Calculate quiz scores
    const quizScores = managerScores.reduce((accumulator, item) => {
        const { quizId, score } = item;
        accumulator[quizId] = (accumulator[quizId] || 0) + score;
        return accumulator;
    }, {});
    console.log(quizScores);

    // Associate quizScores with corresponding quiz objects based on _id matching
    const resultWithScores = result.map(quiz => ({
        ...quiz.toObject(),
        score: quizScores[quiz._id] || 0
    }));

    console.log(resultWithScores)

    return { result: resultWithScores, meta };
};


const getSingleQuiz = async (id) => {
    const result = await Quiz.findById(id)
    return result
}

const getSingleQuestion = async (id) => {
    const results = await Quiz.find({});

    let question;
    // Loop through each result
    for (const result of results) {
        // Find the question with the matching _id
        question = result?.questions?.find(question => question?._id == id);

        if (question) {
            return question;
        }
    }
}

const getAnswerQuestion = async (quizBody, loginUser) => {
    const { quizId, questionId, answerIndex } = quizBody;
    const { userId } = loginUser;
    const user = await User.findOne({ _id: userId });
    let managerId = user.managerId;

    console.log("quizId", quizId, "questionId", questionId, "answerIndex", answerIndex);

    // Check if the user has already answered this question in the current quiz
    // const hasAnswered = await UserResponse.findOne({ userId, quizId, managerId, questionId });
    // const hasAnswered = await UserResponse.findOne({ questionId });

    // if (hasAnswered) {
    //     throw new Error('You have already answered this question in the current quiz.');
    // }

    // Assuming answerIndex is the index of the selected answer in the array
    const quiz = await Quiz.findById(quizId);
    // console.log(quiz)

    if (!quiz) {
        throw new Error('Quiz not found');
    }

    const question = quiz?.questions?.id(questionId);
    // console.log("Question", question)
    if (!question) {
        throw new Error('Question not found');
    }

    // Assuming answerIndex is within the bounds of the answers array
    const selectedAnswer = question.answers[answerIndex];
    if (!selectedAnswer) {
        throw new Error('Invalid answer index');
    }

    const isCorrect = selectedAnswer.isCorrect;
    const score = isCorrect ? 3 : 1;

    const answer = selectedAnswer.text;

    // Create or update user response in the UserResponses collection
    const existingUserResponse = await UserResponse.findOneAndUpdate(
        { userId, quizId, managerId, questionId, answer },
        { $inc: { score } },
        { upsert: true, new: true }
    );

    console.log("userResponse", existingUserResponse);

    return selectedAnswer;
};

const getUserScores = async (userId) => {
    const userScores = await UserResponse.find({ userId });
    const totalScore = userScores.reduce((sum, response) => sum + response.score, 0);
    return userScores;
}

const getManager = async (managerId) => {
    const managerScores = await UserResponse.find({ userId: managerId });
    return managerScores;
}

const getQuizManagerScores = async (managerId) => {
    const managerScores = await UserResponse.find({ userId: managerId });
    const quizScores = managerScores.reduce((accumulator, item) => {
        const { quizId, score } = item;
        accumulator[quizId] = (accumulator[quizId] || 0) + score;
        return accumulator;
    }, {});
    console.log(quizScores)
    return quizScores;
}

const getManagerWiseScores = async (managerId) => {
    // Find all users under the specified manager
    const usersUnderManager = await User.find({ managerId });
    const userIds = usersUnderManager.map(user => user._id);


    // Find user responses for the users under the manager
    const managerWiseScores = await UserResponse.find({ userId: { $in: userIds } });

    return managerWiseScores;
}

const getUserLeaderboard = async () => {
    // Find all distinct user IDs in the UserResponse collection
    const distinctUserIds = await UserResponse.distinct('userId');
    // Calculate total scores for each user
    const leaderboard = await Promise.all(
        distinctUserIds.map(async (userId) => {
            const userScores = await UserResponse.find({ userId });
            const totalScore = userScores.reduce((sum, response) => sum + response.score, 0);
            return { userId, totalScore };
        })
    );

    // Sort the leaderboard in descending order based on total scores
    const sortedLeaderboard = leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    // Add rankings to the sorted leaderboard
    // const rankedLeaderboard = sortedLeaderboard.map((user, index) => ({
    //     rank: index + 1,
    //     ...user,
    // }));

    // Add rankings to the sorted leaderboard
    const rankedLeaderboard = await Promise.all(
        sortedLeaderboard.map(async (user, index) => {
            const userDetails = await User.findById(user.userId); // Assuming you have a User model
            return {
                rank: index + 1,
                userId: user.userId,
                totalScore: user.totalScore,
                userDetails
            };
        })
    );

    console.log(rankedLeaderboard)

    return rankedLeaderboard;
}

const getManagerLeaderboard = async (managerId) => {
    // Find all distinct user IDs in the UserResponse collection for the given manager
    const distinctUserIds = await UserResponse.distinct('userId', { managerId });

    // Calculate total scores for each user
    const leaderboard = await Promise.all(
        distinctUserIds.map(async (userId) => {
            const userScores = await UserResponse.find({ userId, managerId }).populate('userId');
            const totalScore = userScores.reduce((sum, response) => sum + response.score, 0);
            return { userId, totalScore };
        })
    );

    // Sort the leaderboard in descending order based on total scores
    const sortedLeaderboard = leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    // Add rankings to the sorted leaderboard
    // const rankedLeaderboard = sortedLeaderboard.map((user, index) => ({
    //     rank: index + 1,
    //     ...user,
    // }));
    const rankedLeaderboard = await Promise.all(
        sortedLeaderboard.map(async (user, index) => {
            const populatedUser = await User.findById(user.userId);
            return {
                rank: index + 1,
                ...user,
                userDetails: populatedUser, // Include populated user details in the result
            };
        })
    );



    return rankedLeaderboard;
}


module.exports = {
    addQuiz,
    updateQuestion,
    getAllQuizs,
    getSingleQuiz,
    getSingleQuestion,
    getAnswerQuestion,
    getUserScores,
    getManager,
    getQuizManagerScores,
    getManagerWiseScores,
    getUserLeaderboard,
    getManagerLeaderboard
}