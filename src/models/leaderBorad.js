const mongoose = require("mongoose");

const LeaderBoardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Context",
      required: true,
    },
    scores: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LeaderBoard = mongoose.model("LeaderBoard", LeaderBoardSchema);
module.exports = LeaderBoard;
