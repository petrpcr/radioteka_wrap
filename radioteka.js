"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var htmlget_1 = require("./htmlget");
var UrlRadioteka = 'http://www.rozhlas.cz/dvojka/stream/';
function capitalize(pString) {
    pString = pString.trim().replace(/ /g, "_");
    return pString.charAt(0).toUpperCase() + pString.slice(1);
}
function Parsuj(pHtmlBody, pCntent) {
    var $ = cheerio.load(pHtmlBody);
    var items = $('li[class=item]');
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var element = items_1[_i];
        var el = cheerio.load(element);
        var Nadpisy = el('div[class=image] > a')[0].attribs.title.split(":");
        var Nazev = capitalize(Nadpisy[0]);
        var Soubor = capitalize(Nadpisy[1]);
        var ID = el('a[class="icon player-archive"]')[0].attribs.href.split("/").slice(-1).pop();
        var uu = 1;
    }
    ;
}
htmlget_1.GetHtml(UrlRadioteka, Parsuj);
//# sourceMappingURL=radioteka.js.map