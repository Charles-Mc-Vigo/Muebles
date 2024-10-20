const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin/adminModel');

const router = express.Router();

router.get('/api/check-auth', async (req, res) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const admin = await Admin.findById(decoded._id);

    if (!admin) {
      return res.status(401).json({ isAuthenticated: false });
    }

    res.json({ 
      isAuthenticated: true, 
      isAdmin: admin.role === 'Admin' || admin.role === 'Manager'
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ isAuthenticated: false });
  }
});

module.exports = router;