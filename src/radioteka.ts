
const cheerio = require("cheerio");

import { httpGet } from "./htmlget"
import { linkRec, linkRecStore } from "./linkrec"

var UrlRadioteka: string = 'http://www.rozhlas.cz/dvojka/stream/';
var UrlRadioteka_mp3: string = 'http://media.rozhlas.cz/_audio/'
var StorePath: string = '/Users/petrp/Music/Povídky/Radiotéka/'
var StoreFileName: string = 'radioteka.json'

var RecordStore = new linkRecStore(StorePath, StoreFileName, UrlRadioteka_mp3);

function Parsuj(pHtmlBody: string) {
  const $ = cheerio.load(pHtmlBody);
  var tmpLinkRec = new Array<linkRec>()
  $('li[class=item] > a[class="icon player-archive"]').each((index: number, elm: any) => {
    var ID = elm.attribs.href.split("/").slice(-1).pop()
    tmpLinkRec.push(new linkRec(ID))
  });
  RecordStore.linkRec = tmpLinkRec
}

httpGet(UrlRadioteka)
  .then((data) => {
    Parsuj(data.Buffer.toString())
  })
  .catch((e) => {
    console.error(e)
  })


