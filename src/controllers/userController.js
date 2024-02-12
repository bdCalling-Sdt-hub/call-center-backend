require("dotenv").config();
const response = require("../helpers/response");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const unlinkImage = require("../common/image/unlinkImage");
const {
  addUser,
  userSignIn,
  addManager,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  loginWithPasscode,
  getSingleUser,
  getProfile,
  updateUserPassword,
  getManagerUsers,
} = require("../services/userService");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const catchAsync = require("../utils/catchAsync");
const { createFileDetails } = require("../common/image/createImage.js");
const { request } = require("../app.js");
const generateRandomPassword = require("../utils/randomPasswordGenerator.js");

// create a manager
const createManager = catchAsync(async (req, res) => {
  const result = await addManager(req.body);

  sendResponse(res, {
    statusCode: 201,
    data: result,
    message: "Manager added successfully",
    success: true,
  });
});

//Sign up
const signUp = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  if (role === "manager" && userId) {
    req.body.managerId = userId;
    req.body.password = generateRandomPassword();
    req.body.needPasswordChange = true;
  }
  const result = await addUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    data: result,
    message: "User added successfully",
    success: true,
  });
});

//Sign in
const signIn = catchAsync(async (req, res) => {
  const result = await userSignIn(req.body);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "Sign In successfully",
    success: true,
  });
});

const profile = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await getProfile(id);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "User Profile successfully",
    success: true,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  if (req?.file) {
    req.body.image = createFileDetails("users", req?.file?.filename);
  }
  const result = await updateUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "User Update successfully",
    success: true,
  });
});

const allUsers = catchAsync(async (req, res) => {
  const result = await getAllUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "Users Retrieve successfully",
    success: true,
  });
});
const retriveAllManagerUsers = catchAsync(async (req, res) => {
  req.query.managerId = req.user.userId;
  const result = await getManagerUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    data: result?.data,
    meta: result?.meta,
    message: "Users Retrieve successfully",
    success: true,
  });
});
const singleUser = catchAsync(async (req, res) => {
  const result = await getSingleUser(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "User Retrieve successfully",
    success: true,
  });
});
const updatePassword = catchAsync(async (req, res) => {
  const id = req.user.userId;
  console.log(req);
  const result = await updateUserPassword(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "Password updated successfully",
    success: true,
  });
});

module.exports = {
  signUp,
  signIn,
  updateProfile,
  profile,
  createManager,
  allUsers,
  singleUser,
  updatePassword,
  retriveAllManagerUsers,
};
