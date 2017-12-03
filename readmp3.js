"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hget = require("./htmlget");
var fs = require("fs");
var NodeID3 = require('node-id3');
var testName = "/Users/petrp/Music/Povídky/TestMP3.mp3";
//let tg = NodeID3.read("/Users/petrp/Music/Povídky/mistri-slova-velky-cirkus/02  Cast 1 - Pilotem v peruti Alsasko.mp3")
hget.httpGet("http://media.rozhlas.cz/_audio/3949248.mp3")
    .then(function (data) {
    var tags = NodeID3.read(data.Buffer);
    fs.writeFileSync(testName, data.Buffer);
    console.log(tags.title);
    console.log(tags.artist);
    console.log(tags.album);
})
    .catch(function (msg) {
});
//# sourceMappingURL=readmp3.js.map