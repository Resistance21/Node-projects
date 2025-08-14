import fs from "node:fs/promises";

const streamReader = async () => {
  try {
    console.time("copy");

    const originalFile = await fs.open("./dummy_data.txt", "r");
    const copiedFile = await fs.open("./Copied-File.txt", "w");

    let dataRead: number = -1;

    while (dataRead !== 0) {
      const originalFileRead = await originalFile.read();
      dataRead = originalFileRead.bytesRead;
      if (dataRead === 0) break;
      if (dataRead !== 16384) {
        const endBuffer = Buffer.alloc(dataRead);
        originalFileRead.buffer.copy(endBuffer, 0, 0, dataRead);
        copiedFile.write(endBuffer);
      } else {
        copiedFile.write(originalFileRead.buffer);
      }
    }

    originalFile.close();
    copiedFile.close();
  } catch (error) {
    console.log(`Error message ${error}`);
  }

  console.log("done");
  console.timeEnd("copy");
};

streamReader();
