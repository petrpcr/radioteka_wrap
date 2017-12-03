
import * as http from "http";
import * as fs from "fs"
import * as stream from "stream"

const  Promise = require("bluebird")

export type httpStat = {
    Response: http.IncomingMessage,
    Buffer: Buffer
}
export function httpGet(pUrl: string): Promise<httpStat> {
    return new Promise((resolve: (value: httpStat) => void, reject: (reason: any) => void) => {

        http.get(pUrl, (res: http.IncomingMessage) => {
            let buffers = new Array();
            res.on('data', (buffer) => buffers.push(buffer));
            res.on('error', reject);
            res.on('end', () => res.statusCode === 200
                ? resolve(<httpStat>{ Response: res, Buffer: Buffer.concat(buffers) })
                : reject(<httpStat>{ Response: res, Buffer: Buffer.concat(buffers) }))
        })
            .on('error', reject)
            .end();
    });
}