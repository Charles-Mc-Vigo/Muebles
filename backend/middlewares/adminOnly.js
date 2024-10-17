const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin/adminModel');

//admin onyly middleware
//it authenticate the admin before accessing any api endpoints
const adminOnly = async (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  
  if (!adminToken) {
    return res.status(401).json({ message: "No access token!" });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.SECRET);
    const admin = await Admin.findOne({ _id: decoded._id });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (admin.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (!admin.isVerified) {
      return res.status(403).json({ message: "Please verify your account first!" });
    }

    req.user = admin;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = adminOnly;
