const UserProgress = require("../models/leaderBorad.js");

const insertnewDataIntoLeaderBoardDB = async (payload) => {
  const result = await UserProgress.create(payload);
  return result;
};

module.exports = {
  insertnewDataIntoLeaderBoardDB,
};
