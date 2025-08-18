import net from "net";
import fs from "fs/promises";
const server = net.createServer(async (socket) => {
    console.log("new connection");
    let fileHandle;
    let fileStream;
    let fileName;
    console.log("Starting Transfer");
    const headerBuffer = await new Promise((resolve) => socket.once("data", (data) => resolve(data)));
    console.log("inside once");
    const fileEndIndex = headerBuffer.indexOf("\n");
    fileName = headerBuffer.subarray(0, fileEndIndex).toString();
    fileHandle = await fs.open(`storage/${fileName}`, "w");
    fileStream = fileHandle.createWriteStream();
    fileStream.on("drain", () => {
        socket.resume();
    });
    if (!fileStream.write(headerBuffer.subarray(fileEndIndex + 1))) {
        socket.pause();
    }
    console.log(fileName);
    socket.on("data", async (data) => {
        if (!fileStream.write(data)) {
            socket.pause();
        }
    });
    socket.on("end", async () => {
        console.log("File finised being saved");
        fileName = undefined;
        await fileHandle.close();
    });
});
server.listen(5050, "::1", () => {
    console.log(`Upload server running on: `, server.address());
});
//# sourceMappingURL=server.js.map