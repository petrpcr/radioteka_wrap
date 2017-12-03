"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var Promise = require("bluebird");
function httpGet(pUrl) {
    return new Promise(function (resolve, reject) {
        http.get(pUrl, function (res) {
            var buffers = new Array();
            res.on('data', function (buffer) { return buffers.push(buffer); });
            res.on('error', reject);
            res.on('end', function () { return res.statusCode === 200
                ? resolve({ Response: res, Buffer: Buffer.concat(buffers) })
                : reject({ Response: res, Buffer: Buffer.concat(buffers) }); });
        })
            .on('error', reject)
            .end();
    });
}
exports.httpGet = httpGet;
//# sourceMappingURL=htmlget.js.map