import fs from "node:fs/promises";
import { pipeline } from "stream";

const streamReader = async () => {
  try {
    console.time("copy");

    const originalFile = await fs.open("./dummy_data.txt", "r");
    const copiedFile = await fs.open("./Copied-File-piping.txt", "w");

    const readStream = originalFile.createReadStream();
    const writeStream = copiedFile.createWriteStream();

    pipeline(readStream, writeStream, (err) => {
      if (err !== undefined) console.log(`error message: ${err}`);
      console.timeEnd("copy");
    });
  } catch (error) {
    console.log(`Error message ${error}`);
  }

  console.log("done");
};

streamReader();
