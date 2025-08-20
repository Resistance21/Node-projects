import http from "http";

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent,
  hostname: "localhost",
  port: 8050,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "apllication/jason",
    name: "john",
  },
});

request.on("response", (response) => {
  console.log("--------- STATUS: ---------");
  console.log(response.statusCode);

  console.log("--------- HEADERS: ---------");
  console.log(response.headers);

  console.log("--------- BODY: ---------");
  response.on("data", (chunk) => {
    const data = JSON.parse(chunk.toString());
    console.log(data);
  });
});

request.end(
  JSON.stringify({
    title: "message to server 1",
    body: "message to server final",
  })
);
