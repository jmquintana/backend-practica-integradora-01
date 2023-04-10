import { Server } from "socket.io";

const socket = {};

socket.connect = (server) => {
	socket.io = new Server(server);

	socket.io.on("connection", (socket) => {
		console.log(`${socket.id} connected`);
	});

	socket.io.on("delete_product", (data) => {
		console.log(data);
	});
};

export default socket;
