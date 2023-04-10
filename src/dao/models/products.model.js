import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	category: String,
	code: {
		type: String,
		unique: true,
	},
	price: Number,
	stock: Number,
	thumbnails: {
		type: Object,
		default: [],
	},
	status: {
		type: Boolean,
		default: true,
	},
});

export const productModel = mongoose.model(productCollection, productSchema);
