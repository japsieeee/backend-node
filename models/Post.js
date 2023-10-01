const { Schema, model } = require("mongoose");
const { v4: uid } = require("uuid");

const postSchema = new Schema(
  {
    user_id: String,
    title: String,
    content: String,
    redacted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const postModel = model("post", postSchema);

module.exports = postModel;
