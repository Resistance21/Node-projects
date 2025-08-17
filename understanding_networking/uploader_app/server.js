import net from "net";
import fs from "fs/promises";
const server = net.createServer((socket) => {
    console.log("new connection");
    let fileHandle;
    let fileStream;
    console.log("Starting Transfer");
    socket.on("data", async (data) => {
        if (!fileHandle) {
            socket.pause();
            fileHandle = await fs.open("storage/test.txt", "w");
            fileStream = fileHandle.createWriteStream();
            fileStream.write(data);
            socket.resume();
            fileStream.on("drain", () => {
                socket.resume();
            });
        }
        else {
            if (!fileStream.write(data)) {
                console.log("large file still sending");
                socket.pause();
            }
        }
    });
    socket.on("end", async () => {
        console.log("File finised being saved");
        await fileHandle.close();
    });
});
server.listen(5050, "::1", () => {
    console.log(`Upload server running on: `, server.address());
});
//# sourceMappingURL=server.js.map