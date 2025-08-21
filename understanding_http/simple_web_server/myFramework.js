import http from "http";
import fs from "fs/promises";
class MyFramework {
    server;
    routes = {};
    constructor() {
        this.server = http.createServer();
        this.server.on("request", (req, res) => {
            console.log(`a request came in...`);
            const fwRes = res;
            const route = this.routes[req.method.toLocaleLowerCase() + req.url];
            fwRes.status = (code) => {
                res.statusCode = code;
                return fwRes;
            };
            fwRes.json = (data) => {
                fwRes.setHeader("conent-type", "application/json");
                fwRes.end(JSON.stringify(data));
            };
            if (!route) {
                fwRes.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
                return;
            }
            fwRes.sendFile = async (path, mime) => {
                const fileHandler = await fs.open(path, "r");
                const fileStream = fileHandler.createReadStream();
                res.setHeader("content-type", mime);
                console.log("sending file");
                fileStream.pipe(res);
            };
            route(req, res);
        });
    }
    listen = (port, cb) => {
        this.server.listen(port, () => {
            cb();
        });
    };
    route = (method, path, cb) => {
        this.routes[method + path] = cb;
    };
}
export default MyFramework;
//# sourceMappingURL=myFramework.js.map