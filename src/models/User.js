const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is must be given"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "User Name is must be given"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Email should be unique"],
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
        },
        message: "Please enter a valid Email",
      },
    },
    password: {
      type: String,
      required: [true, "Password must be given"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "manager", "company-admin", "system-admin"],
      default: "user",
    },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
