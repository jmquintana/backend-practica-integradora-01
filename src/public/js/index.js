const socket = io();
const openModalBtn = document.querySelector(".open-modal-btn");
const deleteButtons = document.querySelectorAll(".delete-btn");
const addProductBtn = document.querySelector(".submit");
const form = document.querySelector(".form");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const openModal = () => {
	form.classList.remove("hidden");
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
	form.classList.remove("transparent");
	modal.classList.remove("transparent");
	overlay.classList.remove("transparent");
	form.classList.remove("animate__fadeOutUp");
	modal.classList.remove("animate__fadeOut");
	overlay.classList.remove("animate__fadeOut");
	form.classList.add("animate__fadeInDown");
	modal.classList.add("animate__fadeIn");
	overlay.classList.add("animate__fadeIn");
	populateForm(form, PRODUCTS[random(PRODUCTS.length)]);
	addProductBtn.focus();
};

const closeModal = () => {
	form.classList.add("transparent");
	modal.classList.add("transparent");
	overlay.classList.add("transparent");
	form.classList.add("animate__fadeOutUp");
	modal.classList.add("animate__fadeOut");
	overlay.classList.add("animate__fadeOut");
	form.classList.remove("animate__fadeInDown");
	modal.classList.remove("animate__fadeIn");
	overlay.classList.remove("animate__fadeIn");
};

overlay.addEventListener("click", closeModal);
addProductBtn.addEventListener("click", closeModal);
openModalBtn.addEventListener("click", openModal);

const random = (max) => {
	return Math.floor(Math.random() * max);
};

const handleAdd = (e) => {
	e.preventDefault();
	const myFormData = new FormData(e.target);
	fetch("/api/products", {
		method: "POST",
		body: myFormData,
	})
		.then((resp) => resp.json())
		.then((data) => {
			if (data.ok) {
				showAlert(data.message, "success");
			} else {
				console.log(data);
				showAlert(data.message, "error");
			}
		});
};

const handleDelete = (e) => {
	e.stopPropagation();
	const productId = e.target.parentNode.id;
	fetch(`/api/products/${productId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

form.addEventListener("submit", handleAdd);

deleteButtons.forEach((element) => {
	element.addEventListener("click", handleDelete);
});

socket.on("product_added", (data) => addProductElement(data));
socket.on("product_deleted", (_id) => deleteProductElement({ _id }));

const addProductElement = (data) => {
	console.log(data);
	if (data.ok) {
		const product = data?.result;
		const groupListElement = document.querySelector(".product-list");
		const listElement = document.createElement("div");
		let htmlContent = `
			<div class="product-item-text">
				<div class="first row">
					<div class="item-title">
						${product.title}
					</div>
					<div class="item-code">
						Código:
						${product.code}
					</div>
				</div>
				<div class="second row">
					<div class="item-description">
						${product.description}
					</div>
				</div>
				<div class="third row">
					<div class="item-price">
						$
						${product.price}
					</div>
					<div class="item-stock">
						Stock:
						${product.stock}
						unidades
					</div>
				</div>
			</div>
			<div class="item-thumbnails">`;
		const images = product.thumbnails;
		if (images.length > 0) {
			product.thumbnails.forEach((thumbnail) => {
				htmlContent += `<div class="item-thumbnail"><img src="${thumbnail}" alt="" /></div>`;
			});
		} else {
			htmlContent += `<div class="no-image">Sin imágenes</div>`;
		}
		htmlContent += `</div><div class="delete-btn btn">Borrar</div>`;
		listElement.innerHTML = htmlContent;
		listElement.id = product._id;
		listElement.classList.add("product-item-full");
		groupListElement.appendChild(listElement);
		const deleteButtons = document.querySelectorAll(".delete-btn");
		deleteButtons[deleteButtons.length - 1].addEventListener(
			"click",
			handleDelete
		);
		const noProductsNode = document.querySelectorAll(".no-products");
		noProductsNode.forEach((node) => node.remove());

		showAlert("Product added", "success");
	} else {
		showAlert("Product not added", "error");
	}
};

const deleteProductElement = (product) => {
	const liToRemove = document.getElementById(product._id);
	const parentNode = liToRemove.parentNode;
	liToRemove.remove();
	const liElements = document.querySelectorAll(".product-list > div");
	if (!liElements.length) {
		const noProductsNode = document.createElement("div");
		noProductsNode.innerHTML = `No products loaded`;
		noProductsNode.classList.add("no-products");
		parentNode.appendChild(noProductsNode);
	}
	showAlert("Product deleted", "success");
};

const showAlert = (message, icon) => {
	Swal.fire({
		html: message,
		target: "#custom-target",
		customClass: {
			container: "position-absolute",
		},
		toast: true,
		position: "bottom-right",
		showConfirmButton: false,
		timer: 1500,
		icon: icon,
	});
};

const populateForm = (form, data) => {
	const formElements = [...form.elements];
	formElements.forEach((element) => {
		const id = element.id;
		element.value = data[id];
		if (element.id === "thumbnails") {
			element.value = "";
		}
	});

	const label = document.querySelector(".file-upload__label");
	const defaultLabelText = "No se seleccionó ninguna imagen";
	label.textContent = defaultLabelText;
	label.title = defaultLabelText;
};

Array.prototype.forEach.call(
	document.querySelectorAll(".browse-btn"),
	(button) => {
		const hiddenInput = button.parentElement.querySelector(
			".file-upload__input"
		);
		const label = button.parentElement.querySelector(".file-upload__label");
		const defaultLabelText = "No se seleccionó ninguna imagen";

		// Set default text for label
		label.textContent = defaultLabelText;
		label.title = defaultLabelText;

		button.addEventListener("click", function () {
			hiddenInput.click();
		});

		hiddenInput.addEventListener("change", function () {
			const filenameList = Array.prototype.map.call(
				hiddenInput.files,
				function (file) {
					return file.name;
				}
			);

			label.textContent = filenameList.join(", ") || defaultLabelText;
			label.title = label.textContent;
		});
	}
);

const PRODUCTS = [
	{
		title: "Martillo de doble cabeza",
		description:
			"un martillo con dos cabezas diferentes en cada extremo. Una cabeza es plana y la otra es redonda.",
		price: 25,
		stock: 100,
		thumbnails: [],
		code: "MRT1234",
		category: "herramientas",
	},
	{
		title: "Llave de trinquete ajustable",
		description:
			"una llave ajustable con un mecanismo de trinquete incorporado que permite un ajuste rápido y fácil.",
		price: 35,
		stock: 50,
		thumbnails: [],
		code: "LLA5678",
		category: "herramientas",
	},
	{
		title: "Destornillador magnético",
		description:
			"un destornillador con un imán incorporado en la punta para ayudar a sostener los tornillos en su lugar mientras se atornillan.",
		price: 15,
		stock: 200,
		thumbnails: [],
		code: "DES9012",
		category: "herramientas",
	},
	{
		title: "Sierra eléctrica portátil",
		description:
			"una sierra eléctrica portátil que se puede usar para cortar madera y otros materiales similares.",
		price: 75,
		stock: 20,
		thumbnails: [],
		code: "SIE3456",
		category: "herramientas",
	},
	{
		title: "Cinta métrica digital",
		description:
			"una cinta métrica que muestra las mediciones en una pantalla digital en lugar de en una cinta física.",
		price: 20,
		stock: 150,
		thumbnails: [],
		code: "CIN7890",
		category: "herramientas",
	},
	{
		title: "Llave inglesa de doble extremo",
		description:
			"una llave inglesa con dos extremos diferentes, uno para tuercas hexagonales y otro para tuercas cuadradas o rectangulares.",
		price: 30,
		stock: 75,
		thumbnails: [],
		code: "LLI2345",
		category: "herramientas",
	},
	{
		title: "Zanahoria",
		description: "raíz comestible de la planta Daucus carota",
		price: 50,
		stock: 234,
		thumbnails: [],
		code: "ABC1234",
		category: "verdura",
	},
	{
		title: "Camote",
		description: "raíz comestible de la planta Ipomoea batatas",
		price: 60,
		stock: 432,
		thumbnails: [],
		code: "DEF5678",
		category: "verdura",
	},
	{
		title: "Cebolla Verde",
		description: "planta de la familia de los lirios",
		price: 30,
		stock: 567,
		thumbnails: [],
		code: "GHI9012",
		category: "verdura",
	},
	{
		title: "Ejote Verde",
		description: "vaina comestible de la planta Phaseolus vulgaris",
		price: 40,
		stock: 123,
		thumbnails: [],
		code: "JKL3456",
		category: "verdura",
	},
	{
		title: "Espinaca",
		description: "hoja comestible de la planta Spinacia oleracea",
		price: 20,
		stock: 345,
		thumbnails: [],
		code: "MNO7890",
		category: "verdura",
	},
	{
		title: "Nabo",
		description: "raíz comestible de la planta Brassica rapa",
		price: 35,
		stock: 678,
		thumbnails: [],
		code: "PQR1234",
		category: "verdura",
	},
	{
		title: "Puerro",
		description: "planta de la familia de los lirios",
		price: 25,
		stock: 456,
		thumbnails: [],
		code: "STU5678",
		category: "verdura",
	},
	{
		title: "Rábano",
		description: "raíz comestible de la planta Raphanus sativus",
		price: 45,
		stock: 789,
		thumbnails: [],
		code: "VWX9012",
		category: "verdura",
	},
	{
		title: "Remolacha",
		description: "raíz comestible de la planta Beta vulgaris",
		price: 55,
		stock: 321,
		thumbnails: [],
		code: "YZA3456",
		category: "verdura",
	},
	{
		title: "Calabaza",
		description: "fruto comestible de la planta Cucurbita pepo",
		price: 65,
		stock: 876,
		thumbnails: [],
		code: "BCD7890",
		category: "verdura",
	},
	{
		title: "Manzana",
		description: "fruto comestible de la planta Malus domestica",
		price: 70,
		stock: 123,
		thumbnails: [],
		code: "ABC1239",
		category: "fruta",
	},
	{
		title: "Plátano",
		description: "fruto comestible de la planta Musa",
		price: 80,
		stock: 234,
		thumbnails: [],
		code: "DEF5679",
		category: "fruta",
	},
	{
		title: "Cereza",
		description: "fruto comestible de la planta Prunus avium",
		price: 90,
		stock: 345,
		thumbnails: [],
		code: "GHI9019",
		category: "fruta",
	},
	{
		title: "Fresa",
		description: "fruto comestible de la planta Fragaria × ananassa",
		price: 100,
		stock: 456,
		thumbnails: [],
		code: "JKL3459",
		category: "fruta",
	},
	{
		title: "Kiwi",
		description: "fruto comestible de la planta Actinidia deliciosa",
		price: 110,
		stock: 567,
		thumbnails: [],
		code: "MNO7899",
		category: "fruta",
	},
	{
		title: "Mango",
		description: "fruto comestible de la planta Mangifera indica",
		price: 120,
		stock: 678,
		thumbnails: [],
		code: "PQR1239",
		category: "fruta",
	},
	{
		title: "Naranja",
		description: "fruto comestible de la planta Citrus × sinensis",
		price: 130,
		stock: 789,
		thumbnails: [],
		code: "STU5679",
		category: "fruta",
	},
	{
		title: "Pera",
		description: "fruto comestible de la planta Pyrus communis",
		price: 140,
		stock: 890,
		thumbnails: [],
		code: "VWX9019",
		category: "fruta",
	},
	{
		title: "Piña",
		description: "fruto comestible de la planta Ananas comosus",
		price: 150,
		stock: 901,
		thumbnails: [],
		code: "YZA3459",
		category: "fruta",
	},
	{
		title: "Uva",
		description: "fruto comestible de la planta Vitis vinifera",
		price: 160,
		stock: 12,
		thumbnails: [],
		code: "BCD7899",
		category: "fruta",
	},
];
