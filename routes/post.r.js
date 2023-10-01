const {
  createPost,
  updatePost,
  deletePost,
  browsePosts,
  browseMyPosts,
} = require("../controllers/posts.c");
const { authenticate } = require("../middlewares/authenticate");

const Route = require("express").Router();

Route.get("/", authenticate, browsePosts);

Route.get("/me", authenticate, browseMyPosts);

Route.post("/", authenticate, createPost);

Route.put("/", authenticate, updatePost);

Route.delete("/", authenticate, deletePost);

module.exports = Route;
