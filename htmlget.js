"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var fs = require("fs");
function GetHtml(pUrl, bodyParse) {
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
                ("Expected text/html but received " + contentType));
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
            bodyParse(rawBody, contentType);
        });
    }).on('error', function (e) {
        console.error("Got error: " + e.message);
    });
}
exports.GetHtml = GetHtml;
//https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
function DownloadFile(url, dest, commit, error) {
    var file = fs.createWriteStream(dest);
    var request = http_1.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            commit();
            file.close(); // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlinkSync(dest); // Delete the file async. (But we don't check the result)
        error(err);
    });
}
exports.DownloadFile = DownloadFile;
;
//# sourceMappingURL=htmlget.js.map