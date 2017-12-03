"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var hget = require("./htmlget");
var NodeID3 = require('node-id3');
var sanitize = require("sanitize-filename");
var linkRec = /** @class */ (function () {
    function linkRec(_ID, pDate) {
        this._ID = _ID;
        this.pDate = pDate;
        this.Date = pDate || new Date();
        this._fileExt = '.mp3';
    }
    Object.defineProperty(linkRec.prototype, "urlFileName", {
        get: function () {
            return this._ID + this._fileExt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(linkRec.prototype, "ID", {
        get: function () {
            return this._ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(linkRec.prototype, "fileExt", {
        get: function () {
            return this._fileExt;
        },
        enumerable: true,
        configurable: true
    });
    return linkRec;
}());
exports.linkRec = linkRec;
var linkRecStore = /** @class */ (function () {
    function linkRecStore(_path, _fileName, _URL) {
        if (_path === void 0) { _path = "./"; }
        if (_fileName === void 0) { _fileName = "radioteka.json"; }
        if (_URL === void 0) { _URL = 'http://media.rozhlas.cz/_audio/'; }
        this._path = _path;
        this._fileName = _fileName;
        this._URL = _URL;
        this._path += this._path.slice(-1) != "/" ? "/" : "";
        this._URL += this._URL.slice(-1) != "/" ? "/" : "";
        this.loadStore();
    }
    Object.defineProperty(linkRecStore.prototype, "linkRec", {
        get: function () {
            return this._linkRec;
        },
        set: function (pLinkRec) {
            var _this = this;
            fs.writeFileSync(this._path + "linkRecLOG.json", JSON.stringify(pLinkRec));
            // filtering items where aren't exists in linkRec database
            var NoExists = pLinkRec.filter(function (itemfilter) {
                console.log(" Testing : " + itemfilter.urlFileName);
                return !_this._linkRec.some(function (actItemSome) {
                    return actItemSome.ID == itemfilter.ID;
                });
            });
            var countdown = NoExists.length;
            NoExists.forEach(function (item, index) {
                // downloading a adding to database
                console.log(" Download : " + item.urlFileName);
                hget.httpGet(_this._URL + item.urlFileName)
                    .then(function (data) {
                    var tags = NodeID3.read(data.Buffer);
                    var informace = tags.title.split(".")[0].split(":");
                    // not exist ":" separator :-((
                    if (informace.length == 1)
                        informace.push(informace[0]);
                    var fileName = _this.sanitizeFileName(informace[1] + item.fileExt);
                    var folderName = _this.sanitizeFileName(informace[0]);
                    var fullFolder = _this._path + folderName;
                    if (!fs.existsSync(fullFolder))
                        fs.mkdirSync(fullFolder);
                    var fullFileName = fullFolder + "/" + fileName;
                    fs.writeFileSync(fullFileName, data.Buffer);
                    _this._linkRec.push(item);
                    countdown -= 1;
                    console.log(" Saved : " + fileName + "  index:" + countdown + "  " + item.ID);
                    // If last item then save
                    if (countdown == 0) {
                        _this.saveStore();
                        console.log("Finished downloading");
                    }
                })
                    .catch(function (err) {
                    console.log(err);
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    linkRecStore.prototype.sanitizeFileName = function (pString) {
        try {
            pString = sanitize(pString.trim().replace(/[//]/g, "_"));
            return pString.charAt(0).toUpperCase() + pString.slice(1);
        }
        catch (_a) {
            return '';
        }
    };
    Object.defineProperty(linkRecStore.prototype, "fullName", {
        get: function () {
            return this._path + this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    linkRecStore.prototype.loadStore = function () {
        var _this = this;
        this._linkRec = new Array();
        if (fs.existsSync(this.fullName)) {
            var x = fs.readFileSync(this.fullName).toString();
            JSON.parse(x).forEach(function (item, index) {
                _this._linkRec.push(new linkRec(item._ID, new Date(item.Date)));
            });
        }
    };
    linkRecStore.prototype.saveStore = function () {
        var timeLimit = new Date();
        timeLimit.setDate(timeLimit.getDate() - 20); // only 20 day old history
        // filtering and sorting history
        this._linkRec = this._linkRec.filter(function (a) {
            return a.Date.getTime() > timeLimit.getTime();
        })
            .sort(function (a, b) {
            if (a.Date < b.Date)
                return -1;
            if (a.Date < b.Date)
                return 1;
            return 0;
        });
        fs.writeFileSync(this.fullName, JSON.stringify(this._linkRec));
    };
    return linkRecStore;
}());
exports.linkRecStore = linkRecStore;
//# sourceMappingURL=linkrec.js.map