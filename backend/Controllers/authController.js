const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "Fill All Fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User Not Registered , sign up first" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password is inCorrect" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "login success", token: token });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal Server Error : login failed",
        Error: error?.message,
      });
  }
};

//registerUser
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(401).json({ message: "Fill All Fields" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(401).json({ message: "Email is Already Register" });
    }

    //passwordHashing
    const hashedPassword = await bcrypt.hash(password, 10);

    let avatar;
    if (req.file) {
      avatar = req.file?.path;
    }

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    if (!user) {
      return res.status(500).json({ message: "Internal Server error" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "register success", token: token });
  } catch (error) {
        res
      .status(500)
      .json({
        message: "Internal Server Error : signup failed",
        Error: error?.message,
      });
  }
};

const authControllers = { loginUser, registerUser };

module.exports = authControllers;
