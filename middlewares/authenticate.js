const jwt = require("jsonwebtoken");
const { verifyToken, generateAccessToken } = require("../utils/tokens");

module.exports.authenticate = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      return res.status(401).json({ message: "user not authenticated" });
    }

    const tokens = req.headers.cookie.split(";");
    const accessToken = tokens[0].split("=")[1];
    const refreshToken = tokens[1].split("=")[1];

    const { result, error } = await verifyToken(accessToken);

    if (error) {
      if (error.toString().includes("jwt expired")) {
        const result = jwt.verify(
          refreshToken,
          process.env.REFRESH_ACCESS_TOKEN
        );

        if (result) {
          const { _id, email } = result;
          const accessToken = await generateAccessToken({ _id, email });
          res.cookie("access-token", accessToken);
          return next();
        }

        return res.status(401).json({ message: "expired access token" });
      }

      return res.status(403).json({ error: "Invalid access token" });
    }

    next();
  } catch (error) {
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    return res.status(401).json(error);
  }
};
