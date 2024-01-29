require('dotenv').config();
const response = require("../helpers/response");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const unlinkImage = require('../common/image/unlinkImage')
const { addUser, userSignIn, addManager, getUserByEmail, getAllUsers, getUserById, updateUser, loginWithPasscode, getSingleUser } = require('../services/userService')
const User = require('../models/User');
const sendResponse = require('../utils/sendResponse');
const catchAsync = require('../utils/catchAsync');


// create a manager
const createManager = catchAsync(async (req, res) => {
    const result = await addManager(req.body);

    sendResponse(res, { statusCode: 201, data: result, message: 'Manager added successfully', success: true });
});

//Sign up
const signUp = catchAsync(async (req, res) => {
    const { userId } = req.user;
    req.body.managerId = userId;
    const result = await addUser(req.body)
    sendResponse(res, { statusCode: 201, data: result, message: 'User added successfully', success: true })
});

//Sign in
const signIn = catchAsync(async (req, res) => {
    const result = await userSignIn(req.body)
    sendResponse(res, { statusCode: 200, data: result, message: 'Sign In successfully', success: true })
});

const updateProfile = catchAsync(async (req, res) => {
    const file = req.file;
    const result = await updateUser(req.body, { file })

    sendResponse(res, { statusCode: 200, data: result, message: 'User Update successfully', success: true })
});

const allUsers = catchAsync(async (req, res) => {
    const result = await getAllUsers(req.query)
    sendResponse(res, { statusCode: 200, data: result, message: 'Users Retrieve successfully', success: true })
});
const singleUser = catchAsync(async (req, res) => {
    const result = await getSingleUser(req.params.id)
    sendResponse(res, { statusCode: 200, data: result, message: 'User Retrieve successfully', success: true })
})


module.exports = { signUp, signIn, updateProfile, createManager, allUsers, singleUser }