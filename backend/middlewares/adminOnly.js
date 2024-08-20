const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminOnly = async (req, res, next) => {
  const token = req.cookies.adminToken || req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id }).select('isAdmin');

    if (user.isAdmin !== true) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized request denied!" });
  }
};

module.exports = adminOnly;
