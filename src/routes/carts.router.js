import CartManager from "../dao/filesManager/CartManager.js";
import { cartModel } from "../dao/models/carts.model.js";
import { Router } from "express";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
	const result = await cartManager.addCart();
	res.send({ status: "Cart added", result: result });
});

router.get("/:cid", async (req, res) => {
	let cartId = parseInt(req.params.cid);

	const result = await cartManager.getCartById(cartId);
	return res.send(result);
});

router.put("/:cid/product/:pid", async (req, res) => {
	const productId = parseInt(req.params.pid);
	const cartId = parseInt(req.params.cid);
	const result = await cartManager.addProductToCart(productId, cartId);
	res.send(result);
});

export default router;
