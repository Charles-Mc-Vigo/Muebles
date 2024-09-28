const Stocks = require("../../models/Furniture/stocksModel");

exports.addStocks = async (req, res) => {
  try {
    const { stock } = req.body;
    
    // Check if the stock value is provided and is a valid number
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: "Stock quantity is required!" });
    }

    const newStocks = new Stocks({ stock });
    await newStocks.save();
    
    res.status(201).json({
      message: "Stocks successfully added!",
      stocks: newStocks, // Return the created stock object
    });
  } catch (error) {
    console.error("Error adding stocks: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};


exports.checkStocks = async (req, res) => {
  try {
    const stocks = await Stocks.find();
    
    if (stocks.length === 0) {
      return res.status(404).json({ message: "No stocks found!" });
    }

    res.status(200).json(stocks); // Use 200 for successful GET request
  } catch (error) {
    console.error("Error fetching stocks: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};
