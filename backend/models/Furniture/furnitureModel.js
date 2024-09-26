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
		color: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: true
      }
    ],
		description: { type: String, required: true },
		size: {
			type: String,
      required:true
		},
		stocks: { type: Number, required: true },
		materials: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Materials",
			required: true,
		}],
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;