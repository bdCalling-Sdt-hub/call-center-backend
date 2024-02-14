const express = require("express");
const auth = require("../middlewares/auth.js");
const {
  insertNewQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question.controller.js");
const router = express.Router();
router.post("/:id", auth("manager"), insertNewQuestion);
router.patch("/:id", auth("manager"), updateQuestion);
router.delete("/:id", auth("manager"), deleteQuestion);
const questionRoutes = router;
module.exports = questionRoutes;
