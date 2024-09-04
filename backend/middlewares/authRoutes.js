const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authRoutes = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    // console.log("Token verification successful, _id:", _id);
    
    const user = await User.findOne({ _id });

    if (!user) {
      // console.log("User not found");
      return res.status(401).json({ message: "User not found!" });
    }

    if (!user.isVerified !== true) {
      // console.log("User not found");
      return res.status(401).json({ message: "Please verify your account first!" });
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log("Error in authRoutes middleware:", error);
    res.status(401).json({ message: "Unauthorized request denied!" });
  }
};


module.exports = authRoutes;
