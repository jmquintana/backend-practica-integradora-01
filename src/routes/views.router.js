import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { productModel } from "../model/products.model.js";

// const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
	const products = await productModel.find().lean();
	res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
	// const products = await productManager.getProducts();
	const products = await productModel.find().lean();
	res.render("realTimeProducts", { products });
});

export default router;
