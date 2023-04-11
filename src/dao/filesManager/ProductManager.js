import fs from "fs";
import __dirname from "../../utils.js";
import socket from "../../socket.js";
import { productModel } from "../models/products.model.js";

export default class ProductManager {
	constructor() {
		this.path = `${__dirname}/files/products.json`;
	}

	#writeFile = async (content) => {
		await fs.promises.writeFile(this.path, JSON.stringify(content, null, "\t"));
	};

	#readFile = async (filePath) => await fs.promises.readFile(filePath, "utf-8");

	#isValidProduct = (product) => {
		const hasTitle = product.title ?? "" !== "";
		const hasDescription = product.description ?? "" !== "";
		const hasCode = product.code ?? "" !== "";
		const hasPrice = product.price >= 0;
		const hasStock = product.stock > 0;
		const hasCategory = product.category ?? "" !== "";

		if (
			!(
				hasTitle &&
				hasDescription &&
				hasCode &&
				hasPrice &&
				hasStock &&
				hasCategory
			)
		) {
			return {
				ok: false,
				message: "Invalid product",
				response: {
					hasTitle,
					hasDescription,
					hasCode,
					hasPrice,
					hasStock,
					hasCategory,
				},
			};
		} else {
			return {
				ok: true,
			};
		}
	};

	getProducts = async () => {
		if (!fs.existsSync(this.path)) return [];
		try {
			const result = await productModel.find();
			// const data = await this.#readFile(this.path);
			// const result = JSON.parse(data);
			return result;
		} catch (error) {
			console.log(`Error reading file. ${error}`);
			return [];
		}
	};

	addProduct = async (newProduct) => {
		// check if it is a valid product
		const isValidProduct = this.#isValidProduct(newProduct);
		if (!isValidProduct.ok)
			return {
				ok: false,
				status: "Rejected",
				message: "Invalid product",
				result: isValidProduct.response,
			};

		newProduct.status = newProduct.stock > 0;
		newProduct.price = parseFloat(newProduct.price);
		newProduct.stock = parseInt(newProduct.stock);

		const products = await this.getProducts();
		const productIndex = products.findIndex(
			(product) => product.code === newProduct.code
		);

		if (productIndex === -1) {
			if (products.length === 0) {
				newProduct.id = 1;
			} else {
				newProduct.id = products[products.length - 1].id + 1;
			}
			products.push(newProduct);
		} else {
			const message = `Product already exist <br>You may update it`;
			console.log(message);
			return { ok: false, status: "Rejected", message };
		}

		await this.#writeFile(products);

		const response = {
			ok: true,
			status: "Added",
			message: "Product added",
			result: newProduct,
		};
		socket.io.emit("product_added", response);

		return response;
	};

	getProductById = async (productId) => {
		try {
			const result = await productModel.find({ _id: productId });
			return { ok: true, status: "Success", result };
		} catch (error) {
			console.log(error);
		}
		// if (fs.existsSync(this.path)) {
		// 	const data = await this.#readFile(this.path);
		// 	const json = JSON.parse(data);
		// 	const productIndex = json.findIndex(
		// 		(product) => product.id === productId
		// 	);

		// 	if (productIndex === -1) {
		// 		const message = "Product missing";
		// 		console.error(message);
		// 		return { ok: false, status: "Rejected", message };
		// 	} else {
		// 		const result = json[productIndex];
		// 		return { ok: true, status: "Success", result };
		// 	}
		// } else {
		// 	return { ok: true, status: "Empty", result: [] };
		// }
	};

	updateProduct = async (productId, newProperties) => {
		const product = await this.getProductById(productId);
		const products = await this.getProducts();
		if (!product.ok) {
			return product;
		} else {
			const updatedProduct = {
				...product.result,
				...newProperties,
			};
			updatedProduct.id = productId;
			updatedProduct.status = updatedProduct.stock > 0;
			const productIndex = products.findIndex(
				(product) => product.id === productId
			);
			products[productIndex] = updatedProduct;
			await this.#writeFile(products);
			console.log("Product updated");
			return { ok: true, status: "Updated", updatedProduct };
		}
	};

	deleteProduct = async (productId) => {
		const product = await this.getProductById(productId);
		if (!product.ok) {
			return product;
		} else {
			const products = await this.getProducts();
			const newProducts = products.filter(
				(element) => element.id !== productId
			);
			await this.#writeFile(newProducts);

			const result = {
				ok: true,
				status: "Success",
				message: "Product deleted",
				result: product.result,
			};
			socket.io.emit("product_deleted", result);

			if (products.length - newProducts.length > 0) {
				return result;
			}
		}
	};
}
