import net from "net";
import type { Direction } from "readline";
import { createInterface } from "readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });
let userId: string;

const clearLine = (dir: Direction) => {
  return new Promise((res, rej) => {
    process.stdout.clearLine(dir, () => {
      res("done");
    });
  });
};
const moveCursor = (dx: number, dy: number) => {
  return new Promise((res, rej) => {
    process.stdout.moveCursor(dx, dy, () => {
      res("done");
    });
  });
};

const message = async () => {
  const answer = await rl.question(">Enter your message: ");
  await moveCursor(0, -1);
  await clearLine(0);
  client.write(`>User-${userId}: ${answer}`);
};

const client = net.createConnection(
  { port: 3099, host: "127.0.0.1" },
  async () => {
    console.log("connected to server at: ", client.address());
    message();
  }
);

client.on("data", async (chunk: string) => {
  console.log();
  await moveCursor(0, -1);
  await clearLine(0);
  if (chunk.toString().substring(0, 14) === "Your are User-") {
    userId = chunk.toString().substring(14);
    console.log(chunk.toString());
    message();
  } else {
    console.log(chunk.toString());
    message();
  }
});

client.on("end", () => {
  client.write(`>User-${userId} has disconnected`);
});
