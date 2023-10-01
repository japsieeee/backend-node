const { Schema, model } = require("mongoose");
const { v4: uid } = require("uuid");

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

module.exports = userModel;
