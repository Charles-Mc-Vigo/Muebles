const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin/adminModel');
const User = require('../models/User/userModel'); 

const router = express.Router();

router.get('/api/check-auth', async (req, res) => {
  const adminToken = req.cookies.adminToken;
  const userToken = req.cookies.authToken;

  if (!adminToken && !userToken) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    if (adminToken) {
      const decoded = jwt.verify(adminToken, process.env.SECRET);
      const admin = await Admin.findById(decoded._id);

      if (!admin) {
        return res.status(401).json({ isAuthenticated: false });
      }

      return res.json({ 
        isAuthenticated: true, 
        isAdmin: admin.role === 'Admin' || admin.role === 'Manager',
        userType: 'admin',
        userId: admin._id
      });
    }

    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.SECRET);
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(401).json({ isAuthenticated: false });
      }

      return res.json({ 
        isAuthenticated: true, 
        isAdmin: false,
        userType: 'user',
        userId: user._id
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ isAuthenticated: false });
  }
});

module.exports = router;