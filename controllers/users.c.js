const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

module.exports.logout = async (req, res, next) => {
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");

  return res.json({ message: "log out" });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user === null) return res.json({ message: "user not found", user: null });

  const passwordsMatch = bcrypt.compareSync(password, user.password);

  if (!passwordsMatch)
    return res.json({ message: "incorrect email or password", user: null });

  const payload = { _id: user._id, email };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  const cookieOpts = { httpOnly: true };

  res.cookie("access-token", accessToken, cookieOpts);
  res.cookie("refresh-token", refreshToken, cookieOpts);

  return res.json({ message: null, user });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const existingUser = await User.findOne({ email });

    if (existingUser) return res.json({ message: "user exist" });

    const { _id } = await User.create({
      email,
      password: hash,
    });

    return await res.json({ message: "sign up success", user: { _id, email } });
  } catch (error) {
    return res.json(error);
  }
};

module.exports.browseUser = async (req, res, next) => {
  return res.json({ message: "browse user" });
};
