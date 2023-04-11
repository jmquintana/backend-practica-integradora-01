import mongoose from "mongoose";

const Schema = mongoose.Schema;
const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
	products: [
		{
			type: Schema.ObjectId,
			ref: "products",
			quantity: Number,
		},
	],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
