"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const hget = require("./htmlget");
const NodeID3 = require('node-id3');
const sanitize = require("sanitize-filename");
class linkRec {
    constructor(_ID) {
        this._ID = _ID;
        this.Date = new Date();
        this._fileExt = '.mp3';
    }
    get urlFileName() {
        return this._ID + this._fileExt;
    }
    get ID() {
        return this._ID;
    }
    get fileExt() {
        return this._fileExt;
    }
}
exports.linkRec = linkRec;
class linkRecStore {
    constructor(_path = "./", _fileName = "radioteka.json", _URL = 'http://media.rozhlas.cz/_audio/') {
        this._path = _path;
        this._fileName = _fileName;
        this._URL = _URL;
        this._path += this._path.slice(-1) != "/" ? "/" : "";
        this._URL += this._URL.slice(-1) != "/" ? "/" : "";
        this.loadStore();
    }
    get linkRec() {
        return this._linkRec;
    }
    sanititeFileName(pString) {
        try {
            pString = sanitize(pString.trim().replace(/[//]/g, "_"));
            return pString.charAt(0).toUpperCase() + pString.slice(1);
        }
        catch (_a) {
            return '';
        }
    }
    set linkRec(pLinkRec) {
        var tmpLeng = this._linkRec.length;
        pLinkRec.forEach((item, index) => {
            // if not exists in linkRec database
            if (!this._linkRec.some(itemthis => {
                return itemthis.ID == item.ID;
            })) {
                // downloading a adding to database
                hget.httpGet(this._URL + item.urlFileName)
                    .then((data) => {
                    let tags = NodeID3.read(data.Buffer);
                    var informace = tags.title.split(".")[0].split(":");
                    // not exist ":" separator :-((
                    if (informace.length == 1)
                        informace.push(informace[0]);
                    var fileName = this.sanititeFileName(informace[1] + item.fileExt);
                    var folderName = this.sanititeFileName(informace[0]);
                    var fullFolder = this._path + folderName;
                    if (!fs.existsSync(fullFolder))
                        fs.mkdirSync(fullFolder);
                    var fullFileName = fullFolder + "/" + fileName;
                    fs.writeFileSync(fullFileName, data.Buffer);
                    this._linkRec.push(item);
                })
                    .catch((err) => {
                    console.log(err);
                });
            }
        });
        if (tmpLeng < this._linkRec.length)
            this.saveStore();
    }
    get fullName() {
        return this._path + this._fileName;
    }
    loadStore() {
        if (fs.existsSync(this.fullName)) {
            var x = fs.readFileSync(this.fullName).toString();
            this._linkRec = JSON.parse(x);
        }
        else
            this._linkRec = new Array();
    }
    saveStore() {
        var timeLimit = new Date();
        timeLimit.setDate(timeLimit.getDate() - 20); // only 20 day old history
        // filtering and sorting history
        this._linkRec = this._linkRec.filter(a => {
            return a.Date.getTime() > timeLimit.getTime();
        })
            .sort((a, b) => {
            if (a.Date < b.Date)
                return -1;
            if (a.Date < b.Date)
                return 1;
            return 0;
        });
        fs.writeFileSync(this.fullName, JSON.stringify(this._linkRec));
    }
}
exports.linkRecStore = linkRecStore;
//# sourceMappingURL=linkrec.js.map