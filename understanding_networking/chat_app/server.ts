import net from "net";
const clients: CustomSocket[] = [];

type CustomSocket = net.Socket & {
  id?: string;
};

const server = net.createServer((socket: CustomSocket) => {
  console.log("someone connected");
  socket.setEncoding("utf-8");
  socket.id = `User-${clients.length + 1}`;
  socket.write(`Your are ${socket.id}`);
  if (clients) {
    clients.map((c) => {
      c.write(`>${socket.id} has connected`);
    });
  }

  socket.on("end", (socket: net.Socket) => {
    console.log("someone disconnected");
  });

  socket.on("data", (chunk: string) => {
    clients.map((c) => {
      c.write(`${chunk}`);
    });
  });

  socket.on("end", () => {
    clients.map((c) => {
      c.write(`>${socket.id} disconnected`);
    });
  });

  socket.on("error", () => {
    clients.map((c) => {
      c.write(`>${socket.id} disconnected`);
    });
  });

  clients.push(socket);
});

server.listen(3099, "127.0.0.1", () => {
  console.log("connected to server at: ", server.address());
});
