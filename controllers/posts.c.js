const Post = require("../models/Post");
const User = require("../models/User");
const { verifyToken } = require("../utils/tokens");
const { getCurrentUserID } = require("../utils/user.util");

module.exports.browsePosts = async (req, res, next) => {
  const posts = await Post.find();
  const filteredPosts = posts.filter((post) => !post.redacted);
  return res.json(filteredPosts);
};

module.exports.browseMyPosts = async (req, res, next) => {
  try {
    const _id = await getCurrentUserID(req);
    const allPosts = await Post.find();
    const filteredPosts = allPosts.filter(
      (post) => post.user_id === _id && post.redacted === false
    );
    return res.json(filteredPosts);
  } catch (error) {
    return res.json(error);
  }
};

module.exports.createPost = async (req, res, next) => {
  const postData = req.body;

  if (!postData.title) {
    return res.status(422).json({ message: "Missing title parameter" });
  }

  if (!postData.content) {
    return res.status(422).json({ message: "Missing content parameter" });
  }

  try {
    const _id = await getCurrentUserID(req);
    const post = await Post.create({ ...postData, user_id: _id });
    return res.json(post);
  } catch (error) {
    if (error.name === "CastError") {
      return res.json({ message: "Invalid type of user_id", error });
    }
    return res.json(error);
  }
};

module.exports.updatePost = async (req, res, next) => {
  try {
    const postBody = req.body;

    if (!postBody._id) return res.json({ message: "Missing _id parameter" });

    const { _id } = postBody;

    const user_id = await getCurrentUserID(req);

    const prevPost = await Post.findById(_id);

    if (user_id !== prevPost.user_id) {
      return res
        .status(405)
        .json({ message: `You can not update someones post` });
    }

    if (prevPost) {
      const newPost = { ...postBody, __v: prevPost.__v + 1 };
      await Post.findByIdAndUpdate(prevPost._id, newPost);

      return res.json({
        message: `Post id ${_id} has been successfully updated`,
      });
    } else {
      return res.json({
        message: `Unable to find post matches with post id ${postBody._id}`,
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

module.exports.deletePost = async (req, res, next) => {
  try {
    const postBody = req.body;

    if (!postBody._id) return res.json({ message: "Missing _id parameter" });

    const { _id } = postBody;

    const user_id = await getCurrentUserID(req);
    const prevPost = await Post.findById(_id);

    if (user_id !== prevPost.user_id) {
      return res
        .status(405)
        .json({ message: `You can not delete someone else post` });
    }
    await Post.findByIdAndUpdate(prevPost._id, { redacted: true });

    return res.json({
      message: `Post id ${_id} has been successfully deleted`,
    });
  } catch (error) {
    return res.json(error);
  }
};
