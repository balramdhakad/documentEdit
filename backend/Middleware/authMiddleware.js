const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    if(!req.header("Authorization")) {
       return res.status(404).json({ message: "No Token Found" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(404).json({ message: "No Token Found" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.user = user;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: `internal Server error : ${error.message}` });
  }
};

module.exports = authMiddleware;
