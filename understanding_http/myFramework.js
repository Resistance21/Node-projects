import http from "http";
import fs from "fs/promises";
class MyFramework {
    server;
    routes = {};
    middleWare = [];
    constructor() {
        this.server = http.createServer();
        this.server.on("request", (req, res) => {
            const fwRes = res;
            const fwReq = req;
            fwRes.status = (code) => {
                fwRes.statusCode = code;
                return fwRes;
            };
            fwRes.json = (data) => {
                fwRes.setHeader("content-type", "application/json");
                fwRes.end(JSON.stringify(data));
            };
            fwRes.sendFile = async (path, mime) => {
                const fileHandler = await fs.open(path, "r");
                const fileStream = fileHandler.createReadStream();
                res.setHeader("content-type", mime);
                fileStream.pipe(fwRes);
            };
            this.middleWareLoop(0, fwReq, fwRes);
        });
    }
    listen = (port, cb) => {
        this.server.listen(port, () => {
            cb();
        });
    };
    middleWareLoop = (i, req, res) => {
        if (i < this.middleWare.length) {
            const mw = this.middleWare[i];
            if (mw)
                mw(req, res, () => this.middleWareLoop(i + 1, req, res));
        }
        else {
            const route = this.routes[req.method.toLocaleLowerCase() + req.url];
            if (route) {
                route(req, res);
            }
            else {
                res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
                return;
            }
        }
    };
    beforeRoute = (cb) => {
        this.middleWare.push(cb);
    };
    route = (method, path, handler) => {
        this.routes[method + path] = handler;
    };
}
export default MyFramework;
//# sourceMappingURL=myFramework.js.map