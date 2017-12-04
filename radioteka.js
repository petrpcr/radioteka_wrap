"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var htmlget_1 = require("./htmlget");
var fs = require("fs");
var linkrec_1 = require("./linkrec");
var Config = /** @class */ (function () {
    function Config() {
    }
    return Config;
}());
var MyConfig = JSON.parse(fs.readFileSync(__dirname + "/radioteka_config.json").toString());
var RecordStore = new linkrec_1.linkRecStore(MyConfig.StorePath, MyConfig.StoreFileName, MyConfig.UrlMp3);
function Parsuj(pHtmlBody) {
    var $ = cheerio.load(pHtmlBody);
    var tmpLinkRec = new Array();
    $('li[class=item] > a[class="icon player-archive"]').each(function (index, elm) {
        var ID = elm.attribs.href.split("/").slice(-1).pop();
        var title = elm.parent.children[0].children[0].attribs.title;
        tmpLinkRec.push(new linkrec_1.linkRec(ID, undefined, title));
    });
    RecordStore.linkRec = tmpLinkRec;
}
htmlget_1.httpGet(MyConfig.UrlHtml)
    .then(function (data) {
    Parsuj(data.Buffer.toString());
})
    .catch(function (e) {
    console.error(e);
});
//# sourceMappingURL=radioteka.js.map