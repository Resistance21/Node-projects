import net from "net";
import type { WriteStream } from "fs";
import fs from "fs/promises";

const server = net.createServer(async (socket: net.Socket) => {
  console.log("new connection");
  let fileHandle: fs.FileHandle;
  let fileStream: WriteStream;
  let fileName: string | undefined;
  console.log("Starting Transfer");

  const headerBuffer = await new Promise<Buffer>((resolve) =>
    socket.once("data", (data) => resolve(data))
  );

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

server.listen(5050, "172.31.", () => {
  console.log(`Upload server running on: `, server.address());
});
