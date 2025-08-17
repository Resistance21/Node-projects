import net from "net";
import fs from "fs/promises";
const socket = net.createConnection({ host: "::1", port: 5050 });
const sendFile = async (path) => {
    const fileHandler = await fs.open(path, "r");
    const fileSteam = fileHandler.createReadStream();
    fileSteam.on("data", (data) => {
        console.log("sending file data");
        if (!socket.write(data)) {
            fileSteam.pause();
        }
    });
    socket.on("drain", () => {
        fileSteam.resume();
    });
    fileSteam.on("end", () => {
        console.log("File uploaded, closing connection");
        socket.end();
    });
};
socket.on("connect", () => {
    sendFile("test.txt");
});
//# sourceMappingURL=client.js.map