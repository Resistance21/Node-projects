import { Writable } from "stream";
import { open, write, close } from "fs";

type MyWritableOptions = {
  highWaterMark?: number;
  fileName: string;
};

class MyWritable extends Writable {
  private fileName: string;
  private fd: number;
  private chunks: Array<Buffer | string | any>;
  private chunnksSize: number;
  private numberOfWrites: number;

  constructor({ highWaterMark, fileName }: MyWritableOptions) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = 0;
    this.chunks = [];
    this.chunnksSize = 0;
    this.numberOfWrites = 0;
  }

  _construct(callback: (error?: Error | null) => void): void {
    open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (err?: Error | null) => void
  ): void {
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
    } else {
      ++this.numberOfWrites;
      callback();
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      this.chunks = [];
      callback();
    });
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    console.log(`Number of writes: ${this.numberOfWrites}`);
    if (this.fd) {
      close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
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
