const httpStatus = require("http-status");
const AppError = require("../errors/AppError");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QueryBuilder = require("../builder/QueryBuilder");
const unlinkImage = require("../common/image/unlinkImage.js");

const addManager = async (userBody) => {
  const { name, userName, email, password, role } = userBody;
  // Check if the user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new AppError(httpStatus.CONFLICT, "Manager already exists");
  }
  // Create the user in the database
  const user = await User.create({
    name,
    userName,
    email,
    password,
    role,
  });

  return user;
};

const addUser = async (userBody) => {
  const { name, userName, email, password } = userBody;

  // Check if the user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  // Create the user in the database
  const user = await User.create(userBody);

  return user;
};

// Sign in a user
const userSignIn = async (userBody) => {
  const { email, password } = userBody;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User Not Found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password Doesn't Match");
  }

  // Token, set the Cokkie
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    "secret2020",
    { expiresIn: "12h" }
  );

  return { user, accessToken };
};

const getProfile = async (id) => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (userBody) => {
  const { email } = userBody;

  const user = await User.findOne({ email });
  console.log("usererrrr", user);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User Not Found");
  }
  const result = await User.findOneAndUpdate({ email }, userBody, {
    new: true,
  });

  if (userBody?.image && user?.image) {
    unlinkImage(user?.image);
  }
  return result;
};

const getAllUsers = async (query) => {
  const userModel = new QueryBuilder(User.find(), query)
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await userModel.modelQuery;
  const meta = await userModel.meta();
  return { result, meta };
};

const getSingleUser = async (id) => {
  const result = await User.findById(id);
  return result;
};

const updateUserPassword = async (id, payload) => {
  const { oldPassword } = payload;
  const isUserExist = await User.findById(id);

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Found");
  }
  console.log(isUserExist);
  const isPasswordMatched = bcrypt.compare(oldPassword, isUserExist?.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "old password does not match");
  }
  // if old and new password are the same
  if (oldPassword === payload?.newPassword) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "old password and new password should not be same"
    );
  }
  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        password: payload?.newPassword,
      },
    },
    { new: true }
  );
  return result;
};
module.exports = {
  addUser,
  addManager,
  userSignIn,
  getProfile,
  updateUser,
  getAllUsers,
  getSingleUser,
  updateUserPassword,
};
