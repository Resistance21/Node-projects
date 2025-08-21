import http from "http";
export type FrameWorkResponse = http.ServerResponse & {
    sendFile: (path: string, mime: string) => Promise<void>;
    status: (code: number) => FrameWorkResponse;
    json: (data: any) => void;
};
declare class MyFramework {
    private server;
    private routes;
    constructor();
    listen: (port: number, cb: () => any) => void;
    route: (method: string, path: string, cb: (req: http.IncomingMessage, res: http.ServerResponse) => void) => void;
}
export default MyFramework;
//# sourceMappingURL=myFramework.d.ts.map