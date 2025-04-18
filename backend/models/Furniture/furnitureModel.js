const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
	{
		images: { type: [String], required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		furnitureType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "FurnitureType",
			required: true,
		},
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Colors" }],
		materials: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Materials",
				required: true,
			},
		],
		sizes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Size",
				required: true,
			},
		],
		ratings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Rating",
			},
		],
		isRated:{
			type:Boolean,
			default:false
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Create model for Furniture
const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;
