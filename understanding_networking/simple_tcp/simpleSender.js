import net from "net";
const socket = net.createConnection({ host: "127.0.0.1", port: 3099 }, () => {
    console.log("connected to server and sending");
    socket.write("wrting to server");
});
//# sourceMappingURL=simpleSender.js.map