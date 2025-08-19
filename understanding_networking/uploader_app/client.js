import net from "net";
import fs from "fs/promises";
import path from "path";
const socket = net.createConnection({
    host: "ec2-13-211-222-194.ap-southeast-2.compute.amazonaws.com",
    port: 5050,
});
const clearLine = (dir) => {
    return new Promise((res, rej) => {
        process.stdout.clearLine(dir, () => {
            res("done");
        });
    });
};
const moveCursor = (dx, dy) => {
    return new Promise((res, rej) => {
        process.stdout.moveCursor(dx, dy, () => {
            res("done");
        });
    });
};
const sendFile = async (filePathString = "test.txt") => {
    const fileHandler = await fs.open(filePathString, "r");
    const fileSteam = fileHandler.createReadStream();
    let fileName = path.basename(filePathString);
    let uploadPercentage;
    let lastLoggedPercentage = 0;
    let bytesUploaded = 0;
    let fileSize = (await fileHandler.stat()).size;
    console.log(fileName);
    socket.on("drain", () => {
        fileSteam.resume();
    });
    if (!socket.write(fileName + "\n")) {
        fileSteam.pause();
    }
    fileSteam.on("data", (data) => {
        if (!socket.write(data)) {
            fileSteam.pause();
        }
        bytesUploaded += data.length;
        uploadPercentage = Math.floor((bytesUploaded / fileSize) * 100);
        if (uploadPercentage % 5 === 0 &&
            lastLoggedPercentage !== Math.floor((bytesUploaded / fileSize) * 100)) {
            moveCursor(0, -1);
            clearLine(0);
            console.log(`Current Upload progress... ${uploadPercentage}`);
            lastLoggedPercentage = uploadPercentage;
        }
    });
    fileSteam.on("end", () => {
        console.log("File uploaded, closing connection");
        if (!socket.write(Buffer.alloc(0))) {
            socket.once("drain", () => socket.end());
        }
        else {
            socket.end();
        }
    });
};
socket.on("connect", () => {
    let filePath = process.argv[2];
    sendFile(filePath);
});
//# sourceMappingURL=client.js.map