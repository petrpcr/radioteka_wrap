import * as fs from "fs";
import { GetHtml, DownloadFile } from "./htmlget"

export class linkRec {
    Date: Date;
    private _fileExt: string;

    constructor(
        private _Folder: string,
        private _Name: string,
        private _ID: string
    ) {
        this.Date = new Date()
        this._Name = (this._Name || '') == '' ? this._Folder : this._Name
        this._fileExt = '.mp3'
    }

    public get folderName(): string {
        return this._Folder
    }
    public get fileName(): string {
        return this._Name + this._fileExt
    }

    public get urlName(): string {
        return this._ID + this._fileExt
    }

    public get ID(): string {
        return this._ID;
    }

}

export class linkRecStore {
    private _linkRec: Array<linkRec>;
    

    constructor(private _path: string = "./",
        private _fileName: string = "radioteka.json",
        private _URL: string = 'http://media.rozhlas.cz/_audio/') {
        this._path += this._path.slice(-1) != "/" ? "/" : ""
        this._URL += this._URL.slice(-1) != "/" ? "/" : ""
        this.loadStore();
    }

    public get linkRec(): Array<linkRec> {
        return this._linkRec;
    }
    public set linkRec(pLinkRec: Array<linkRec>) {
        
        pLinkRec.forEach( item => {

            if (!this._linkRec.some(itemthis => {
                return itemthis.ID == item.ID
            }))
            {
                var fullFolder = this._path + item.folderName
                if (!fs.existsSync(fullFolder))
                    fs.mkdirSync(fullFolder)
                var fullFileName = fullFolder + "/" + item.fileName
                DownloadFile(this._URL+item.urlName, fullFileName, () => {
                    this._linkRec.push(item)
                    this.saveStore()
                }, (msg) => {
                    console.error(msg)
                })
            }
        })
    }


    public get fullName(): string {
        return this._path + this._fileName
    }

    private loadStore() {
        if (fs.existsSync(this.fullName)) {
            var x: string = fs.readFileSync(this.fullName).toString()
            this._linkRec = JSON.parse(x);
        }
        else
            this._linkRec = new Array<linkRec>();
    }

    saveStore() {
        var today = new Date()
        today.setDate(today.getDate() + 20) // only 20 day old history

        // filtering and sorting history
        this._linkRec = this._linkRec.filter(a => {
            a.Date.getTime() < today.getTime()
        }).sort((a, b) => {

            if (a.Date < b.Date)
                return -1

            if (a.Date < b.Date)
                return 1

            return 0

        })
        fs.writeFileSync(this.fullName, JSON.stringify(this._linkRec))
    }

}
