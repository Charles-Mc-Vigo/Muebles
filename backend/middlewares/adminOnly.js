const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminOnly = async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: "No access token!" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id })

    if (user.isAdmin !== true) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (user.isVerified !== true) {
      return res.status(403).json({ message: "Please verify your account first!" });
    }

    req.user = user;
    // console.log(req.user) for testing and debugging
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized request denied!" });
  }
};

module.exports = adminOnly;
