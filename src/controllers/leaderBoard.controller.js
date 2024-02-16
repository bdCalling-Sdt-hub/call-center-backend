const {
  insertnewDataIntoLeaderBoardDB,
} = require("../services/leaderboard.service.js");
const catchAsync = require("../utils/catchAsync.js");
const sendResponse = require("../utils/sendResponse.js");

const insertLeaderboardData = catchAsync(async (req, res) => {
  req.body.userId = req.user.userId;
  const result = await insertnewDataIntoLeaderBoardDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "user progress  submitted successfully",
    success: true,
  });
});

module.exports = {
  insertLeaderboardData,
};
