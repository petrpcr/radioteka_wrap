"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
function httpGet(pUrl) {
    return new Promise((resolve, reject) => {
        http.get(pUrl, (res) => {
            let buffers = new Array();
            res.on('data', (buffer) => buffers.push(buffer));
            res.on('error', reject);
            res.on('end', () => res.statusCode === 200
                ? resolve({ Response: res, Buffer: Buffer.concat(buffers) })
                : reject({ Response: res, Buffer: Buffer.concat(buffers) }));
        })
            .on('error', reject)
            .end();
    });
}
exports.httpGet = httpGet;
//# sourceMappingURL=htmlget.js.map