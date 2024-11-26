const Furniture = require("../../models/Furniture/furnitureModel");
const Rating = require("../../models/Rating/ratingModel");
const User = require("../../models/User/userModel");

exports.createReviewsAndRatings = async (req, res) => {
	try {
    const {furnitureId} = req.params
		const { rating, review } = req.body;

    const user = await User.findById(req.user._id);

    if(!user) return res.status(404).json({message:"User not found!"});

    const exisitingFurniture = await Furniture.findById(furnitureId);
    if(!exisitingFurniture) return res.status(404).json({message:"Furniture not found!"});


		const newReviewAndRating = new Rating({
      user:user,
			furniture: exisitingFurniture,
			rating,
			review,
		});

		// Save the document to the database
		await newReviewAndRating.save();

    await Furniture.findByIdAndUpdate(furnitureId, {
      $push: { ratings: newReviewAndRating },
    })

		res.status(201).json({ message: "Review and rating created successfully", newReviewAndRating });
	} catch (error) {
		console.log("Error creating a review and rating: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};
exports.getRatingOfaFurniture = async(req,res) => {
  try {
    const {furnitureId} = req.params
    const exisitingFurniture = await Furniture.findById(furnitureId);
    if(!exisitingFurniture) return res.status(404).json({message:"Furniture not found!"});

    const reviewsAndRatings = await Rating.find({furniture:furnitureId})
    .populate('user') // Populate the 'user' field
    .populate('furniture'); // Populate the 'furniture' field;

    if(reviewsAndRatings.length === 0) return res.status(400).json({message:"No reviews yet!"});
    

    res.status(200).json(reviewsAndRatings)
  } catch (error) {
    console.log("Error getting the ratings: ", error);
    res.status(500).json({message:"Server error!"})
  }
}
exports.viewRaviewsAndRatings = async (req, res) => {
	try {
    // const {furnitureId} = req.params

    const  furnitureRating = await Rating.find();
    
    if(furnitureRating.length === 0) return res.status(400).json({message:"No reviews yet"});

    res.status(200).json(furnitureRating);
	} catch (error) {
		console.log("Error creating a review and rating: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};