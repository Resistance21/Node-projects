import { spawn } from "child_process";
import { stdin, stdout, argv } from "process";
import fs from "fs";

const child = spawn("./communicator-c", ["./output.txt", "$", ","]);

const start = async () => {
  const readStream = fs.createReadStream("./testtest.txt");
  readStream.pipe(child.stdin);

  readStream.on("end", () => {
    child.stdin.end();
  });
};

child.stdout.on("data", async (data) => {
  console.log(data.toString());
});

child.on("close", (code: number) => {
  console.log(code);
});

start();
