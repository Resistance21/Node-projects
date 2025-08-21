import MyFramework from "./myFramework.js";
const server = new MyFramework();
server.route("get", "/", (req, res) => {
    const fwRes = res;
    fwRes.status(200).sendFile("./public/index.html", "text/html");
});
server.route("get", "/styles.css", (req, res) => {
    const fwRes = res;
    fwRes.status(200).sendFile("./public/styles.css", "text/css");
});
server.route("get", "/scripts.js", (req, res) => {
    const fwRes = res;
    fwRes.status(200).sendFile("./public/scripts.js", "application/javascript");
});
server.listen(9000, () => {
    console.log("server on http://localhost:9000");
});
//# sourceMappingURL=server.js.map