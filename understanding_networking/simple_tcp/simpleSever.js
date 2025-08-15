import net from "net";
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(data.toString());
    });
    socket.on("error", (err) => {
        console.log("Socket error:", err.message);
        if (err.code !== "ECONNRESET") {
            console.error(err);
        }
    });
});
server.listen(3099, "127.0.0.1", () => {
    console.log("server is running on", server.address());
});
//# sourceMappingURL=simpleSever.js.map