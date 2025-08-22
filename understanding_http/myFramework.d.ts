import http from "http";
export type FrameWorkResponse = http.ServerResponse & {
    sendFile: (path: string, mime: string) => Promise<void>;
    status: (code: number) => FrameWorkResponse;
    json: (data: any) => void;
};
export type FrameWorkRequest = http.IncomingMessage & {
    userId?: number;
    body?: any;
};
export type middleWare = (req: FrameWorkRequest, res: FrameWorkResponse, next: () => void) => void;
type Handler = (req: FrameWorkRequest, res: FrameWorkResponse) => void;
declare class MyFramework {
    private server;
    private routes;
    private middleWare;
    constructor();
    listen: (port: number, cb: () => any) => void;
    private middleWareLoop;
    beforeRoute: (cb: middleWare) => void;
    route: (method: string, path: string, handler: Handler) => void;
}
export default MyFramework;
//# sourceMappingURL=myFramework.d.ts.map