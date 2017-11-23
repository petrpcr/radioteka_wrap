"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const htmlget_1 = require("./htmlget");
const linkrec_1 = require("./linkrec");
var UrlRadioteka = 'http://www.rozhlas.cz/dvojka/stream/';
var UrlRadioteka_mp3 = 'http://media.rozhlas.cz/_audio/';
var StorePath = '/Users/petrp/Music/Povídky/Radiotéka/';
var StoreFileName = 'radioteka.json';
var RecordStore = new linkrec_1.linkRecStore(StorePath, StoreFileName, UrlRadioteka_mp3);
function Parsuj(pHtmlBody) {
    const $ = cheerio.load(pHtmlBody);
    var tmpLinkRec = new Array();
    $('li[class=item] > a[class="icon player-archive"]').each((index, elm) => {
        var ID = elm.attribs.href.split("/").slice(-1).pop();
        tmpLinkRec.push(new linkrec_1.linkRec(ID));
    });
    RecordStore.linkRec = tmpLinkRec;
}
htmlget_1.httpGet(UrlRadioteka)
    .then((data) => {
    Parsuj(data.Buffer.toString());
})
    .catch((e) => {
    console.error(e);
});
//# sourceMappingURL=radioteka.js.map