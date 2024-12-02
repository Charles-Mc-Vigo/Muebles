const express = require('express');
const router = express.Router();
const Item = require('../../models/Furniture/furnitureModel');

// Search route
router.get('/search', async (req, res) => {
  const query = req.query.q; 
  try {
    const results = await Item.find({ 
      name: { $regex: query, $options: 'i' } 
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
