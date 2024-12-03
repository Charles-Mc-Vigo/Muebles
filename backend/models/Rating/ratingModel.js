const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema({
  user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
  furniture: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Furniture",
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	review: {
		type: String,
	},
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
