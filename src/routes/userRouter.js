const express = require('express');
const { signUp, createManager, signIn, updateProfile, allUsers, singleUser } = require('../controllers/userController');
const router = express.Router();
const fs = require('fs');
const userFileUploadMiddleware = require("../middlewares/fileUpload");

const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);
const { isValidUser, verifyRefreshToken } = require('../middlewares/auth')
const validationMiddleware = require('../middlewares/user/signupValidation');
const { getSingleUser } = require('../services/userService');
const auth = require('../middlewares/auth');

if (!fs.existsSync(UPLOADS_FOLDER_USERS)) {
    // If not, create the folder
    fs.mkdirSync(UPLOADS_FOLDER_USERS, { recursive: true }, (err) => {
        if (err) {
            console.error("Error creating uploads folder:", err);
        } else {
            console.log("Uploads folder created successfully");
        }
    });
}

//Sign-up user
router.post('/sign-up', auth('manager'), signUp);
router.post('/create-manager', createManager);
router.post('/sign-in', signIn);
router.get('/', auth('manager'), allUsers);
router.get('/:id', auth('manager', 'user'), singleUser);
router.put('/', [uploadUsers.single("image")], updateProfile);

module.exports = router;