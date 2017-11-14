
const cheerio = require("cheerio");

import {GetHtml}  from "./htmlget"

var UrlRadioteka : string ='http://www.rozhlas.cz/dvojka/stream/';

function capitalize(pString:string):string {
  pString = pString.trim().replace(/ /g,"_")
  return pString.charAt(0).toUpperCase() + pString.slice(1);
}

 function Parsuj(pHtmlBody:string,pCntent:string){
  const $ = cheerio.load(pHtmlBody);
  var items  = $('li[class=item]')
  for (var element of items)  {
    var el = cheerio.load(element)
    var Nadpisy = el('div[class=image] > a')[0].attribs.title.split(":");
    var Nazev = capitalize(Nadpisy[0])
    var Soubor = capitalize(Nadpisy[1])
    var ID = el('a[class="icon player-archive"]')[0].attribs.href.split("/").slice(-1).pop()
    var uu = 1
  };
 }

 GetHtml(UrlRadioteka,Parsuj);

