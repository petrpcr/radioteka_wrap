"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
function GetHtml(pUrl, BodyParse) {
    http_1.get(pUrl, function (res) {
        var statusCode = res.statusCode;
        var contentType = res.headers['content-type'].toString();
        var error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                ("Status Code: " + statusCode));
        }
        else if (!/^text\/html/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                ("Expected application/json but received " + contentType));
        }
        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }
        res.setEncoding('utf8');
        var rawBody = "";
        res.on('data', function (chunk) { rawBody += chunk; });
        res.on('end', function () {
            BodyParse(rawBody, contentType);
        });
    }).on('error', function (e) {
        console.error("Got error: " + e.message);
    });
}
exports.GetHtml = GetHtml;
//# sourceMappingURL=htmlget.js.map