import http from "http";
const server = http.createServer();
server.on("request", (request, response) => {
    console.log("--------- METHOD: ---------");
    console.log(request.method);
    console.log("--------- URL: ---------");
    console.log(request.url);
    console.log("--------- HEADERS: ---------");
    console.log(request.headers);
    const name = request.headers.name;
    console.log("--------- BODY: ---------");
    let data;
    request.on("data", (chunk) => {
        data = chunk;
    });
    request.on("end", () => {
        console.log(JSON.parse(data.toString()));
        console.log(name);
        const dataJson = JSON.parse(data.toString());
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({
            message: `Post with title ${dataJson.title} was created by ${name}`,
        }));
    });
});
server.listen(8050, () => {
    console.log('"Server listening on http://localhost:8050"');
});
//# sourceMappingURL=server.js.map