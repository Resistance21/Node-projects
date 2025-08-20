import http from "http";
import fs from "fs/promises";

const server = http.createServer();

server.on("request", async (request, response) => {
  if (request.url === "/" && request.method === "GET") {
    const htmlFileHandler = await fs.open("./public/index.html");
    const htmlFileStream = htmlFileHandler.createReadStream();
    response.setHeader("content-type", "text/html");
    htmlFileStream.pipe(response);
  }

  if (request.url === "/styles.css" && request.method === "GET") {
    const cssFileHandler = await fs.open("./public/styles.css");
    const cssFileStream = cssFileHandler.createReadStream();
    response.setHeader("content-type", "text/css");
    cssFileStream.pipe(response);
  }

  if (request.url === "/scripts.js" && request.method === "GET") {
    const jsFileHandler = await fs.open("./public/scripts.js");
    const jsFileStream = jsFileHandler.createReadStream();
    response.setHeader("content-type", "application/javascript");
    jsFileStream.pipe(response);
  }

  if (request.url === "/login" && request.method === "POST") {
    response.setHeader("content-type", "application/json");
    response.statusCode = 200;
    const body = {
      message: "Logging you in...",
    };

    response.end(JSON.stringify(body));
  }
});

server.listen(9000, () => {
  console.log("web server is running on http://localhost:9000");
});
