import { Writable } from "stream";
import { open, write, close } from "fs";
class MyWritable extends Writable {
    fileName;
    fd;
    chunks;
    chunnksSize;
    numberOfWrites;
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });
        this.fileName = fileName;
        this.fd = 0;
        this.chunks = [];
        this.chunnksSize = 0;
        this.numberOfWrites = 0;
    }
    _construct(callback) {
        open(this.fileName, "w", (err, fd) => {
            if (err) {
                callback(err);
            }
            else {
                this.fd = fd;
                callback();
            }
        });
    }
    _write(chunk, encoding, callback) {
        //console.log(this.fd);
        this.chunks.push(chunk);
        this.chunnksSize = +chunk.length;
        console.log(this.chunnksSize);
        if (this.chunnksSize > this.writableHighWaterMark) {
            write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunnksSize = 0;
                ++this.numberOfWrites;
                callback();
            });
        }
        else {
            ++this.numberOfWrites;
            callback();
        }
    }
    _final(callback) {
        write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err)
                return callback(err);
            this.chunks = [];
            callback();
        });
    }
    _destroy(error, callback) {
        console.log(`Number of writes: ${this.numberOfWrites}`);
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
const stream = new MyWritable({
    highWaterMark: 1800,
    fileName: "Output-file.txt",
});
stream.write(Buffer.from("this is some text"));
stream.end(Buffer.from("end of the file"));
stream.on("finish", () => {
    console.log(`Stream is finished.`);
});
//# sourceMappingURL=customeWritable.js.map