import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
	user: String,
	message: String,
});

export const productModel = mongoose.model(messagesCollection, messagesSchema);
