require("dotenv").config();
const { default: mongoose } = require("mongoose");
const socket_io = require("socket.io");
const io = socket_io();
const Post = require("./models/Post");

const express = require("express");
const rootRoute = require("./routes/root.r");
const userRoute = require("./routes/user.r");
const postRoute = require("./routes/post.r");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rootRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);

app.get("/logout", (req, res) => {
  res.clearCookie("refreshToken").send("<h1>Hello</h1>");
});

const postStream = Post.watch();

postStream.on("change", (change) => {
  console.log(change);
});

io.on("connection", () => {
  console.log("connected");
});

app.listen(3000, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
});
