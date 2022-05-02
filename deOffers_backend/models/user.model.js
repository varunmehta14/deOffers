const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const Addtask = require("./task.model");
require("dotenv").config();
// const regexForEmailValidation =
//   /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    walletAddress: {
      type: String, // Wallet Address (Hash)
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name required"],
      trim: true,
    },

    pass: {
      type: String,
      required: [true, "Password required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default: '',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // tasks: ["Addtask"],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name },
    process.env.task_jwtprivate
  );
  return token;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
