"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var htmlget_1 = require("./htmlget");
var linkRec = /** @class */ (function () {
    function linkRec(_Folder, _Name, _ID) {
        this._Folder = _Folder;
        this._Name = _Name;
        this._ID = _ID;
        this.Date = new Date();
        this._Name = (this._Name || '') == '' ? this._Folder : this._Name;
        this._fileExt = '.mp3';
    }
    Object.defineProperty(linkRec.prototype, "folderName", {
        get: function () {
            return this._Folder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(linkRec.prototype, "fileName", {
        get: function () {
            return this._Name + this._fileExt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(linkRec.prototype, "urlName", {
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
            pLinkRec.forEach(function (item) {
                if (!_this._linkRec.some(function (itemthis) {
                    return itemthis.ID == item.ID;
                })) {
                    var fullFolder = _this._path + item.folderName;
                    if (!fs.existsSync(fullFolder))
                        fs.mkdirSync(fullFolder);
                    var fullFileName = fullFolder + "/" + item.fileName;
                    htmlget_1.DownloadFile(_this._URL + item.urlName, fullFileName, function () {
                        _this._linkRec.push(item);
                        _this.saveStore();
                    }, function (msg) {
                        console.error(msg);
                    });
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(linkRecStore.prototype, "fullName", {
        get: function () {
            return this._path + this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    linkRecStore.prototype.loadStore = function () {
        if (fs.existsSync(this.fullName)) {
            var x = fs.readFileSync(this.fullName).toString();
            this._linkRec = JSON.parse(x);
        }
        else
            this._linkRec = new Array();
    };
    linkRecStore.prototype.saveStore = function () {
        var today = new Date();
        today.setDate(today.getDate() + 20); // only 20 day old history
        // filtering and sorting history
        this._linkRec = this._linkRec.filter(function (a) {
            a.Date.getTime() < today.getTime();
        }).sort(function (a, b) {
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