require("dotenv/config");

const jwt = require("jsonwebtoken");

module.exports.generateAccessToken = async (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });
};

module.exports.generateRefreshToken = async (payload) => {
  return jwt.sign(payload, process.env.REFRESH_ACCESS_TOKEN, {
    expiresIn: "365days",
  });
};

module.exports.verifyToken = async (token) => {
  try {
    const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
};
