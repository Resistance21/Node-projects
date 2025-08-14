import { Readable } from "stream";
import { open, read, close } from "fs";
class MyReadable extends Readable {
    fileName;
    fd = 0;
    bufferSize = 64 * 1024;
    position = 0;
    numberOfReads = 0;
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });
        this.fileName = fileName;
    }
    _construct(callback) {
        open(this.fileName, "r", (err, fd) => {
            if (err) {
                callback(err);
            }
            else {
                this.fd = fd;
                callback();
            }
        });
    }
    _read(size) {
        const buffer = Buffer.alloc(this.bufferSize);
        read(this.fd, buffer, 0, this.bufferSize, this.position, (err, bytesRead, buffer) => {
            if (err)
                return this.destroy(err);
            if (bytesRead > 0) {
                this.position += bytesRead;
                this.push(buffer.subarray(0, bytesRead));
                ++this.numberOfReads;
            }
            else {
                this.push(null);
            }
        });
    }
    _destroy(error, callback) {
        console.log(`Number of reads: ${this.numberOfReads}`);
        if (this.fd) {
            close(this.fd, (err) => {
                callback(err || error);
            });
        }
        else {
            callback(error);
        }
    }
}
const stream = new MyReadable({
    highWaterMark: 1800,
    fileName: "dummy_data.txt",
});
//stream.read();
stream.on("data", (chunk) => {
    console.log(chunk.toString());
});
//# sourceMappingURL=customReadable.js.map