import net from "net";
const clients = [];
const server = net.createServer((socket) => {
    console.log("someone connected");
    socket.setEncoding("utf-8");
    socket.id = `User-${clients.length + 1}`;
    socket.write(`Your are ${socket.id}`);
    if (clients) {
        clients.map((c) => {
            c.write(`>${socket.id} has connected`);
        });
    }
    socket.on("data", (chunk) => {
        clients.map((c) => {
            c.write(`${chunk}`);
        });
    });
    socket.on("end", () => {
        clients.map((c) => {
            c.write(`>${socket.id} disconnected`);
        });
    });
    socket.on("error", () => {
        clients.map((c) => {
            c.write(`>${socket.id} disconnected`);
        });
    });
    clients.push(socket);
});
server.listen(3099, "127.0.0.1", () => {
    console.log("connected to server at: ", server.address());
});
//# sourceMappingURL=server.js.map