"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const htmlget_1 = require("./htmlget");
const fs = require("fs");
const linkrec_1 = require("./linkrec");
class Config {
}
var MyConfig = JSON.parse(fs.readFileSync(__dirname + "/radioteka_config.json").toString());
var RecordStore = new linkrec_1.linkRecStore(MyConfig.StorePath, MyConfig.StoreFileName, MyConfig.UrlMp3);
function Parsuj(pHtmlBody) {
    const $ = cheerio.load(pHtmlBody);
    var tmpLinkRec = new Array();
    $('li[class=item] > a[class="icon player-archive"]').each((index, elm) => {
        var ID = elm.attribs.href.split("/").slice(-1).pop();
        tmpLinkRec.push(new linkrec_1.linkRec(ID));
    });
    RecordStore.linkRec = tmpLinkRec;
}
htmlget_1.httpGet(MyConfig.UrlHtml)
    .then((data) => {
    Parsuj(data.Buffer.toString());
})
    .catch((e) => {
    console.error(e);
});
//# sourceMappingURL=radioteka.js.map