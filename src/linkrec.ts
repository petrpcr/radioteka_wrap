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
    public Date: Date;
    public Title:string
    private _fileExt: string;

    constructor(
        private _ID: string,
        pDate?: Date,
        pTitle?:string
    ) {
        this.Date = pDate || new Date()
        this.Title = pTitle || ''
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

    public get StoreObj():any {
        return {_ID:this._ID,Date:this.Date,_fileExt: this._fileExt}
        ;
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

        fs.writeFileSync(this._path + "linkRecLOG.json", JSON.stringify(pLinkRec))

        // filtering items where aren't exists in linkRec database
        var NoExists = pLinkRec.filter(itemfilter => {
            console.log(" Testing : " + itemfilter.urlFileName)
            return  !this._linkRec.some(actItemSome => 
                actItemSome.ID == itemfilter.ID
             )})
             
        var countdown = NoExists.length;

        NoExists.forEach((item, index) => {
            
            // downloading a adding to database
            console.log(" Download : " + item.urlFileName)
            hget.httpGet(this._URL + item.urlFileName)
                .then((data) => {
                    var informace
                    if((item.Title || '') ==''){
                        let tags = <mp3Tags>NodeID3.read(data.Buffer)
                        informace = tags.title.split(".")[0].split(":")    
                    }
                    else{
                        informace = item.Title.split(":")
                    }
                    

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
                    countdown -= 1
                    console.log(" Saved : " + fileName + "  index:" +countdown +"  "+item.ID)
                   
                    // If last item then save
                    if (countdown == 0){
                        this.saveStore()
                        console.log("Finished downloading")
                    }
                        
                    
                })
                .catch((err) => {
                    console.log(err)
                }
                )

        })


    }

    public get fullName(): string {
        return this._path + this._fileName
    }

    private loadStore() {
        this._linkRec = new Array<linkRec>();
        if (fs.existsSync(this.fullName)) {
            var x: string = fs.readFileSync(this.fullName).toString()
            JSON.parse(x).forEach((item: any, index: number) => {
                this._linkRec.push(new linkRec(item._ID, new Date(item.Date)))
            })
        }
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
            var storeItems = this._linkRec.map(item => item.StoreObj)
        fs.writeFileSync(this.fullName, JSON.stringify(storeItems))
    }

}
