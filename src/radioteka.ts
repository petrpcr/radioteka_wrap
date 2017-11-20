
const cheerio = require("cheerio");

import {GetHtml}  from "./htmlget"
import {linkRec,linkRecStore} from "./linkrec"

var UrlRadioteka : string ='http://www.rozhlas.cz/dvojka/stream/';
var RecordStore = new linkRecStore();

function capitalize(pString:string):string {
  pString = pString.trim().replace(/ /g,"_")
  return pString.charAt(0).toUpperCase() + pString.slice(1);
}

 function Parsuj(pHtmlBody:string,pCntent:string){
  const $ = cheerio.load(pHtmlBody);
  const LR = new linkRecStore();

  LR.linkRec = $('li[class=item]').each((index:number,element:any) => {
    var el = cheerio.load(element)
 
    var Nadpisy = el('div[class=image] > a')[0].attribs.title.split(":");
    var Nazev = capitalize(Nadpisy[0])
    var Soubor = capitalize(Nadpisy[1])
    var icon = el('a[class="icon player-archive"]')
    if (!icon){
      return
    }
    var ID = icon[0].attribs.href.split("/").slice(-1).pop()
    var lrT = new linkRec(Nazev,Soubor,ID)
    return lrT
  });

  console.log(LR)
 }

 GetHtml(UrlRadioteka,Parsuj);

