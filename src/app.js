const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const quizRouter = require("./routes/quizRouter");

const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const globalErrorHandler = require("./middlewares/GlobalErrorHanlder");
const questionRoutes = require("./routes/questionRouter.js");
const { userResponseRouter } = require("./routes/userResponseRouter.js");
const leaderBoardRoutes = require("./routes/leaderBoardRouter.js");
require("dotenv").config();
const app = express();

// Connect to the MongoDB database
mongoose.connect(
  `mongodb+srv://call-center:08oJUQ0Q9h2svmaS@cluster0.mordayw.mongodb.net/call-center?retryWrites=true&w=majority`,
  {}
);

//making public folder static for publicly access
app.use(express.static("public"));

// For handling form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: "165.227.211.138",
    //[
    //   process.env.ALLOWED_CLIENT_URL_DASHBOARD,
    //   process.env.ALLOWED_CLIENT_URL_WEB,
    //   process.env.ALLOWED_CLIENT_URL_SUB_DASHBOARD
    // ],
    optionsSuccessStatus: 200,
  })
);

//initilizing API routes
app.use("/api/users", userRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/questions", questionRoutes);
app.use("/api/user-response", userResponseRouter);
app.use("/api/leaderboard", leaderBoardRoutes);

//testing API is alive
app.get("/test", (req, res) => {
  res.send("Back-end is responding!!");
});

//invalid route handler
app.use(notFoundHandler);
//error handling
app.use(globalErrorHandler);

module.exports = app;
