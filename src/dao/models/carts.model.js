import mongoose from "mongoose";

const productCollection = "carts";

const cartSchema = new mongoose.Schema({
	products: {
		quantity: Number,
	},
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
