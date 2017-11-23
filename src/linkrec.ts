import * as fs from "fs";
import * as hget from "./htmlget"
const NodeID3 = require('node-id3')
const sanitize = require("sanitize-filename")

export type mp3Tags = {
    title: string,
    artist: string,
    album: string
}

export class linkRec {
    Date: Date;
    private _fileExt: string;

    constructor(
        private _ID: string
    ) {
        this.Date = new Date()
        this._fileExt = '.mp3'
    }

    public get urlFileName(): string {
        return this._ID + this._fileExt
    }

    public get ID(): string {
        return this._ID;
    }

    public get fileExt(): string {
        return this._fileExt
    }

}

export class linkRecStore {
    private _linkRec: Array<linkRec>;
    private _CountDown: number;


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

    private sanitizeFileName(pString: string): string {
        try {
            pString = sanitize(pString.trim().replace(/[//]/g, "_"))
            return pString.charAt(0).toUpperCase() + pString.slice(1);
        }
        catch{
            return ''
        }
    }

    public set linkRec(pLinkRec: Array<linkRec>) {

        var tmpLeng = this._linkRec.length;

        pLinkRec.forEach((item, index) => {


            // if not exists in linkRec database
            if (!this._linkRec.some(itemthis => {
                return itemthis.ID == item.ID
            })) {
                // downloading a adding to database
                hget.httpGet(this._URL + item.urlFileName)
                    .then((data) => {
                        let tags = <mp3Tags>NodeID3.read(data.Buffer)
                        var informace = tags.title.split(".")[0].split(":")

                        // not exist ":" separator :-((
                        if (informace.length == 1)
                            informace.push(informace[0])

                        var fileName = this.sanitizeFileName(informace[1] + item.fileExt)
                        var folderName = this.sanitizeFileName(informace[0])
                        var fullFolder = this._path + folderName

                        if (!fs.existsSync(fullFolder))
                            fs.mkdirSync(fullFolder)

                        var fullFileName = fullFolder + "/" + fileName

                        fs.writeFileSync(fullFileName, data.Buffer)
                        this._linkRec.push(item)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }

        })

        if (tmpLeng < this._linkRec.length)
            this.saveStore()
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

    private saveStore() {

        var timeLimit = new Date()
        timeLimit.setDate(timeLimit.getDate() - 20) // only 20 day old history

        // filtering and sorting history

        this._linkRec = this._linkRec.filter(a => {
            return a.Date.getTime() > timeLimit.getTime()
        })
            .sort((a, b) => {
                if (a.Date < b.Date)
                    return -1

                if (a.Date < b.Date)
                    return 1

                return 0
            })
        fs.writeFileSync(this.fullName, JSON.stringify(this._linkRec))
    }

}
