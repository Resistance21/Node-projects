import http from "http";
import fs from "fs/promises";

export type FrameWorkResponse = http.ServerResponse & {
  sendFile: (path: string, mime: string) => Promise<void>;
  status: (code: number) => FrameWorkResponse;
  json: (data: any) => void;
};

export type FrameWorkRequest = http.IncomingMessage & {
  userId?: number;
  body?: any;
};

export type middleWare = (
  req: FrameWorkRequest,
  res: FrameWorkResponse,
  next: () => void
) => void;

type Handler = (req: FrameWorkRequest, res: FrameWorkResponse) => void;

class MyFramework {
  private server: http.Server;
  private routes: Record<string, CallableFunction> = {};
  private middleWare: middleWare[] = [];

  constructor() {
    this.server = http.createServer();

    this.server.on("request", (req, res) => {
      const fwRes = res as FrameWorkResponse;
      const fwReq = req as FrameWorkRequest;
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

  listen = (port: number, cb: () => any) => {
    this.server.listen(port, () => {
      cb();
    });
  };

  private middleWareLoop = (
    i: number,
    req: FrameWorkRequest,
    res: FrameWorkResponse
  ) => {
    if (i < this.middleWare.length) {
      const mw = this.middleWare[i];
      if (mw) mw(req, res, () => this.middleWareLoop(i + 1, req, res));
    } else {
      const route = this.routes[req.method!.toLocaleLowerCase() + req.url];
      if (route) {
        route(req, res);
      } else {
        res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
        return;
      }
    }
  };

  beforeRoute = (cb: middleWare) => {
    this.middleWare.push(cb);
  };

  route = (method: string, path: string, handler: Handler) => {
    this.routes[method + path] = handler;
  };
}

export default MyFramework;
