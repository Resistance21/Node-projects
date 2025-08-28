import { stdin, stdout, argv } from "node:process";

let chunks: Buffer[] = [];

stdin.on("data", async (data) => {
  console.log("getting data");
  chunks.push(data);
});

stdin.on("end", () => {
  const allChunks = Buffer.concat(chunks).toString();
  const formattedData = allChunks
    .split(" ")
    .map((x) => {
      const n = Number(x);
      return isNaN(n) ? "" : `$${n.toLocaleString()}`;
    })
    .join(" ");
  stdout.write(formattedData.toString());
});
