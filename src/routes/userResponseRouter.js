const express = require("express");
const {
  insertQuizAnswer,
  calculateScore,
  getManagerLeaderBoardData,
  getUserLeaderBoardData,
} = require("../controllers/userResponse.js");
const auth = require("../middlewares/auth.js");
const router = express.Router();
router.post("/", auth("user", "manager"), insertQuizAnswer);
router.get("/manager-leaderboard", auth("manager"), getManagerLeaderBoardData);
router.get(
  "/manager-leaderboard",
  auth("user", "manager"),
  getUserLeaderBoardData
);
router.get("/total-score/:id", auth("user", "manager"), calculateScore);
const userResponseRouter = router;
module.exports = {
  userResponseRouter,
};
