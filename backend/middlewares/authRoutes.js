const jwt = require("jsonwebtoken");
const User = require("../../backend/models/User/userModel");

const authRoutes = async (req, res, next) => {
  const token = req.cookies.authToken; // Siguraduhin na tama ang cookie name

  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET); // Token verification
    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Corrected check for user verification
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your account first!" });
    }

    req.user = user; // Attach the user to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized request denied!" });
  }
};

module.exports = authRoutes;
