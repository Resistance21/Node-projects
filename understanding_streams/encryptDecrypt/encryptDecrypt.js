import { Transform } from "stream";
import { open } from "fs/promises";
class Encrypt extends Transform {
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] = chunk[i] + 1;
            }
        }
        this.push(chunk);
        callback();
    }
    _flush(callback) {
        callback();
    }
}
class Decrypt extends Transform {
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] = chunk[i] - 1;
            }
        }
        this.push(chunk);
        callback();
    }
    _flush(callback) {
        callback();
    }
}
const encryptStream = async () => {
    const fileReadHandle = await open("dummy_data.txt", "r");
    const fileEncryptHandle = await open("encrypt_text.txt", "a");
    const readStream = fileReadHandle.createReadStream();
    const encryptStream = fileEncryptHandle.createWriteStream();
    const encrypt = new Encrypt();
    readStream.pipe(encrypt).pipe(encryptStream);
    encryptStream.on("finish", () => {
        readStream.close();
        encryptStream.close();
    });
};
const decryptStream = async () => {
    const fileReadHandle = await open("encrypt_text.txt", "r");
    const fileDecryptHandle = await open("decrypt_text.txt", "a");
    const readStream = fileReadHandle.createReadStream();
    const decryptStream = fileDecryptHandle.createWriteStream();
    const decrypt = new Decrypt();
    readStream.pipe(decrypt).pipe(decryptStream);
    decryptStream.on("finish", () => {
        readStream.close();
        decryptStream.close();
    });
};
await encryptStream();
await decryptStream();
//# sourceMappingURL=encryptDecrypt.js.map