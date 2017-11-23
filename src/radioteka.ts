const cheerio = require("cheerio");

import { httpGet } from "./htmlget"
import * as fs from "fs";
import { linkRec, linkRecStore } from "./linkrec"

class Config {
  UrlHtml: string
  UrlMp3:string
  StorePath:string
  StoreFileName:string
}

var MyConfig = <Config>JSON.parse(fs.readFileSync(__dirname + "/radioteka_config.json").toString())

var RecordStore = new linkRecStore(MyConfig.StorePath, MyConfig.StoreFileName, MyConfig.UrlMp3);

function Parsuj(pHtmlBody: string) {
  const $ = cheerio.load(pHtmlBody);
  var tmpLinkRec = new Array<linkRec>()
  $('li[class=item] > a[class="icon player-archive"]').each((index: number, elm: any) => {
    var ID = elm.attribs.href.split("/").slice(-1).pop()
    tmpLinkRec.push(new linkRec(ID))
  });
  RecordStore.linkRec = tmpLinkRec
}

httpGet(MyConfig.UrlHtml)
  .then((data) => {
    Parsuj(data.Buffer.toString())
  })
  .catch((e) => {
    console.error(e)
  })


