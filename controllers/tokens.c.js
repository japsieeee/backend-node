const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/tokens");

module.exports.handleRefreshToken = async (req, res) => {
  const tokens = req.headers.cookie.split(";");
  const refreshToken = tokens[1].split("=")[1];

  try {
    const result = jwt.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN);

    if (result) {
      const { _id, email } = result;
      const accessToken = await generateAccessToken({ _id, email });
      res.cookie("access-token", accessToken);
    }

    return res.json({ message: "handled refresh token" });
  } catch (error) {
    return res.json({ error });
  }
};
