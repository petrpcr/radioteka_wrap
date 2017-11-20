"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var linkRec = /** @class */ (function () {
    function linkRec(_Folder, _Name, _ID) {
        this._Folder = _Folder;
        this._Name = _Name;
        this._ID = _ID;
        this.Date = new Date();
        this._Name = (this._Name || '') == '' ? this._Folder : this._Name;
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
            return this._Name + '.mp3';
        },
        enumerable: true,
        configurable: true
    });
    return linkRec;
}());
exports.linkRec = linkRec;
var linkRecStore = /** @class */ (function () {
    function linkRecStore(_path, _fileName) {
        if (_path === void 0) { _path = "./"; }
        if (_fileName === void 0) { _fileName = "radioteka.json"; }
        this._path = _path;
        this._fileName = _fileName;
        this._path += this._path.slice(-1) != "/" ? "/" : "";
        this.loadData();
    }
    Object.defineProperty(linkRecStore.prototype, "linkRec", {
        get: function () {
            return this._linkRec;
        },
        set: function (pLinkRec) {
            this._linkRec = pLinkRec;
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
    linkRecStore.prototype.loadData = function () {
        if (fs_1.existsSync(this.fullName)) {
            var x = fs_1.readFileSync(this.fullName).toString();
            this._linkRec = JSON.parse(x);
        }
        else
            this._linkRec = new Array();
    };
    linkRecStore.prototype.saveData = function () {
        fs_1.writeFileSync(this.fullName, JSON.stringify(this._linkRec));
    };
    return linkRecStore;
}());
exports.linkRecStore = linkRecStore;
//# sourceMappingURL=linkrec.js.map