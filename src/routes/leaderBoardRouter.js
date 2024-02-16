const express = require("express");
const auth = require("../middlewares/auth.js");
const {
  insertLeaderboardData,
} = require("../controllers/leaderBoard.controller.js");
const router = express.Router();
router.post("/", auth("user", "manager"), insertLeaderboardData);
const leaderBoardRoutes = router;
module.exports = leaderBoardRoutes;
