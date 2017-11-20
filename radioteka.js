"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var htmlget_1 = require("./htmlget");
var linkrec_1 = require("./linkrec");
var UrlRadioteka = 'http://www.rozhlas.cz/dvojka/stream/';
var RecordStore = new linkrec_1.linkRecStore();
function capitalize(pString) {
    pString = pString.trim().replace(/ /g, "_");
    return pString.charAt(0).toUpperCase() + pString.slice(1);
}
function Parsuj(pHtmlBody, pCntent) {
    var $ = cheerio.load(pHtmlBody);
    var LR = new linkrec_1.linkRecStore();
    LR.linkRec = $('li[class=item]').each(function (index, element) {
        var el = cheerio.load(element);
        var Nadpisy = el('div[class=image] > a')[0].attribs.title.split(":");
        var Nazev = capitalize(Nadpisy[0]);
        var Soubor = capitalize(Nadpisy[1]);
        var icon = el('a[class="icon player-archive"]');
        if (!icon) {
            return;
        }
        var ID = icon[0].attribs.href.split("/").slice(-1).pop();
        var lrT = new linkrec_1.linkRec(Nazev, Soubor, ID);
        return lrT;
    });
    console.log(LR);
}
htmlget_1.GetHtml(UrlRadioteka, Parsuj);
//# sourceMappingURL=radioteka.js.map