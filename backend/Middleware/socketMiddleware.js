const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const socketAuthMiddleware = async (socket, next) => {
  try {
    let token = socket?.handshake?.auth?.token || socket?.handshake?.headers?.authorization?.split(" ")[1];

    if (!token) return next(new Error("Authentication error: Token required"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) return next(new Error("Authentication error: User not found"));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};

module.exports = socketAuthMiddleware;