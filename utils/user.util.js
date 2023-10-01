const { verifyToken } = require("./tokens");

module.exports.getCurrentUserID = async (req) => {
  try {
    const tokens = req.headers.cookie.split(";");
    const accessToken = tokens[0].split("=")[1];

    const {
      result: { _id },
      error,
    } = await verifyToken(accessToken);

    return _id;
  } catch (error) {
    return null;
  }
};
