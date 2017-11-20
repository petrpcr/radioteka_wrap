"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var sanitize = require("sanitize-filename");
var htmlget_1 = require("./htmlget");
var linkrec_1 = require("./linkrec");
var UrlRadioteka = 'http://www.rozhlas.cz/dvojka/stream/';
var UrlRadioteka_mp3 = 'http://media.rozhlas.cz/_audio/';
var StorePath = './';
var StoreFileName = 'radioteka.json';
var RecordStore = new linkrec_1.linkRecStore(StorePath, StoreFileName, UrlRadioteka_mp3);
function capitalize(pString) {
    try {
        pString = sanitize(pString.trim().replace(/[//]/g, "_"));
        return pString.charAt(0).toUpperCase() + pString.slice(1);
    }
    catch (_a) {
        return '';
    }
}
function Parsuj(pHtmlBody, pCntent) {
    var $ = cheerio.load(pHtmlBody);
    var LR = new linkrec_1.linkRecStore();
    var tmpLinkRec = new Array();
    $('li[class=item] > a[class="icon player-archive"]').each(function (index, elm) {
        var Nadpisy = $(elm).parent().children('div[class=image]').children()[0].attribs.title.split(":");
        var ID = elm.attribs.href.split("/").slice(-1).pop();
        tmpLinkRec.push(new linkrec_1.linkRec(capitalize(Nadpisy[0]), capitalize(Nadpisy[1]), ID));
    });
    LR.linkRec = tmpLinkRec;
}
htmlget_1.GetHtml(UrlRadioteka, Parsuj);
//# sourceMappingURL=radioteka.js.map