"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var sanitize = require("sanitize-filename");
var htmlget_1 = require("./htmlget");
var linkrec_1 = require("./linkrec");
var UrlRadioteka = 'http://www.rozhlas.cz/dvojka/stream/';
var RecordStore = new linkrec_1.linkRecStore();
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
    LR.linkRec = $('li[class=item] > a[class="icon player-archive"]').map(function (index, elm) {
        var Nadpisy = $(elm).parent().children('div[class=image]').children()[0].attribs.title.split(":");
        var ID = elm.attribs.href.split("/").slice(-1).pop();
        return new linkrec_1.linkRec(capitalize(Nadpisy[0]), capitalize(Nadpisy[1]), ID);
    });
    console.log(LR);
}
htmlget_1.GetHtml(UrlRadioteka, Parsuj);
//# sourceMappingURL=radioteka.js.map