"use strict";
exports.__esModule = true;
var http = require("http");
http.get('http://www.rozhlas.cz/dvojka/stream/', function (res) {
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
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });
    res.on('end', function () {
        try {
            console.log(rawData);
        }
        catch (e) {
            console.error(e.message);
        }
    });
}).on('error', function (e) {
    console.error("Got error: " + e.message);
});
