const express = require('express');
const router = express.Router();
const Furniture = require('../../models/Furniture/furnitureModel');  
// Search Route
router.get("/", async (req, res) => {
  const searchQuery = req.query.query || '';  // Get search query from URL parameters
  const filters = {};  // To hold additional search filters, if needed

  try {
    // Search for furniture items that match the search query (case-insensitive search)
    const results = await Furniture.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },  // Search by name
        { description: { $regex: searchQuery, $options: "i" } },  // Search by description (optional)
      ],
      isArchived: false  // Optional: Exclude archived items
    })
    .populate('category')  // Populate category
    .populate('furnitureType')  // Populate furnitureType
    .populate('colors')  // Populate colors
    .populate('materials')  // Populate materials
    .populate('sizes')  // Populate sizes
    .exec();

    // Return the search results
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
