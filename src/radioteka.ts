
const cheerio = require("cheerio");
const sanitize = require("sanitize-filename")

import { GetHtml } from "./htmlget"
import { linkRec, linkRecStore } from "./linkrec"

var UrlRadioteka: string = 'http://www.rozhlas.cz/dvojka/stream/';
var UrlRadioteka_mp3 : string = 'http://media.rozhlas.cz/_audio/'
var StorePath :string = './'
var StoreFileName : string = 'radioteka.json'

var RecordStore = new linkRecStore(StorePath,StoreFileName,UrlRadioteka_mp3);

function capitalize(pString: string): string {
  try {
    pString = sanitize(pString.trim().replace(/[//]/g,"_"))
    return pString.charAt(0).toUpperCase() + pString.slice(1);
  }
  catch{
    return ''
  }
}

function Parsuj(pHtmlBody: string, pCntent: string) {
  const $ = cheerio.load(pHtmlBody);
  const LR = new linkRecStore();
  var tmpLinkRec = new Array<linkRec>()
  $('li[class=item] > a[class="icon player-archive"]').each((index: number, elm: any) => {
    var Nadpisy = $(elm).parent().children('div[class=image]').children()[0].attribs.title.split(":")
    var ID = elm.attribs.href.split("/").slice(-1).pop()
     tmpLinkRec.push(new linkRec(capitalize(Nadpisy[0]), capitalize(Nadpisy[1]), ID))
  });
  LR.linkRec = tmpLinkRec
}

GetHtml(UrlRadioteka, Parsuj);

