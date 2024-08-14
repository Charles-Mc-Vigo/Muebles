const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authRoutes = async (req, res, next) => {
  
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select('_id');
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized request denied!" });
  }
}

module.exports = authRoutes;
