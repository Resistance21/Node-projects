import { Readable } from "stream";
import { open, read, close } from "fs";

type MyReadableOptions = {
  highWaterMark?: number;
  fileName: string;
};

class MyReadable extends Readable {
  private fileName: string;
  private fd: number = 0;
  private bufferSize: number = 64 * 1024;
  private position: number = 0;
  private numberOfReads: number = 0;

  constructor({ highWaterMark, fileName }: MyReadableOptions) {
    super({ highWaterMark });

    this.fileName = fileName;
  }

  _construct(callback: (error?: Error | null) => void): void {
    open(this.fileName, "r", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _read(size: number): void {
    const buffer = Buffer.alloc(this.bufferSize);
    read(
      this.fd,
      buffer,
      0,
      this.bufferSize,
      this.position,
      (err, bytesRead, buffer) => {
        if (err) return this.destroy(err);
        if (bytesRead > 0) {
          this.position += bytesRead;
          this.push(buffer.subarray(0, bytesRead));
          ++this.numberOfReads;
        } else {
          this.push(null);
        }
      }
    );
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    console.log(`Number of reads: ${this.numberOfReads}`);
    if (this.fd) {
      close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
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
