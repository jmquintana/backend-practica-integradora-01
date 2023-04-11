import fs from "fs";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager();

export default class CartManager {
	constructor() {
		this.path = "./src/files/carts.json";
	}

	#writeFile = async (content) => {
		await fs.promises.writeFile(this.path, JSON.stringify(content, null, "\t"));
	};

	#readFile = async (filePath) => await fs.promises.readFile(filePath, "utf-8");

	getCarts = async () => {
		if (!fs.existsSync(this.path)) return [];
		try {
			const data = await this.#readFile(this.path);
			const result = JSON.parse(data);
			return result;
		} catch (error) {
			console.log(`# Error reading file. ${error}`);
			return [];
		}
	};

	addCart = async () => {
		const carts = await this.getCarts();
		const newCart = { id: 0, products: [] };
		newCart.id = !carts.length ? 1 : carts[carts.length - 1].id + 1;
		carts.push(newCart);

		await this.#writeFile(carts);
		return { status: "Added", newCart };
	};

	getCartById = async (cartId) => {
		if (fs.existsSync(this.path)) {
			const data = await this.#readFile(this.path);
			const json = JSON.parse(data);
			const cartIndex = json.findIndex((cart) => cart.id === cartId);
			console.log(cartIndex);
			if (cartIndex === -1) {
				const message = "# Cart not found!";
				console.error(message);
				return { status: "Rejected", message };
			} else {
				const result = json[cartIndex];
				return { status: "Success", result };
			}
		} else {
			return { status: "Empty", result: "No carts created" };
		}
	};

	addProductToCart = async (productId, cartId) => {
		// check if cart exists
		const cart = await this.getCartById(cartId);
		if (!(cart.status === "Success"))
			return { status: "Error", message: "Cart not found!" };
		// check if product exists
		const product = await productManager.getProductById(productId);
		console.log(product);
		if (!(product.status === "Success"))
			return { status: "Error", message: "Product not found!" };
		// check if product has stock
		if (!product.result.status)
			return { status: "Error", message: "Product out of stock!" };
		// check if product exists in cart
		const productIndex = cart.result.products.findIndex(
			(product) => product.id === productId
		);
		// add product to cart
		if (productIndex === -1) {
			cart.result.products.push({ id: productId, quantity: 1 });
		} else {
			cart.result.products[productIndex].quantity++;
		}
		const carts = await this.getCarts();
		const cartIndex = carts.findIndex((cart) => cart.id === cartId);
		carts[cartIndex] = cart.result;
		await this.#writeFile(carts);
		return { status: "Success", result: cart.result };
	};
}
