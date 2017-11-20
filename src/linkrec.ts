import { readFileSync, existsSync, writeFileSync, createWriteStream,unlinkSync} from "fs";
import { GetHtml } from "./htmlget"

export class linkRec {
    Date: Date;
    private _fileExt:string;

    constructor(
        private _Folder: string,
        private _Name: string,
        private _ID: string
    ) {
        this.Date = new Date()
        this._Name = (this._Name || '') == '' ? this._Folder : this._Name
        this._fileExt = '.mp3'
    }

    public get folderName():string{
        return this._Folder
    }
    public get fileName(): string {
        return this._Name  + this._fileExt
    }

    public get urlName():string{
        return this._ID + this._fileExt
    }

    public get ID():string{
        return this._ID;
    }

}

export class linkRecStore {
    private _linkRec: Array<linkRec>;
    private _noExists:Array<linkRec>;

    constructor(private _path: string = "./", 
                private _fileName: string = "radioteka.json",
                private _URL:string= 'http://media.rozhlas.cz/_audio/') {
        this._path += this._path.slice(-1) != "/" ? "/" : ""
        this._URL += this._URL.slice(-1) != "/" ? "/" : ""
        this.loadData();
    }

    public get linkRec(): Array<linkRec> {
        return this._linkRec;
    }
    public set linkRec(pLinkRec: Array<linkRec>) {
        this._noExists = pLinkRec.filter(item => {
            return !this._linkRec.some(itemthis => {
                    return itemthis.ID == item.ID
            })
        })

        this._linkRec = pLinkRec;
    }
    private DownloadAll(){
        this._noExists.forEach(item =>{
            var file = createWriteStream(dest);
            var request = http.get(url, function(response) {
              response.pipe(file);
              file.on('finish', function() {
                file.close(cb);  // close() is async, call cb after close completes.
              });
            }).on('error', function(err) { // Handle errors
              fs.unlink(dest); // Delete the file async. (But we don't check the result)
              if (cb) cb(err.message);
            });
        })
    }

    public get fullName(): string {
        return this._path + this._fileName
    }

    private loadData() {
        if (existsSync(this.fullName)) {
            var x: string = readFileSync(this.fullName).toString()
            this._linkRec = JSON.parse(x);
        }
        else
            this._linkRec = new Array<linkRec>();
    }

    saveData() {
        writeFileSync(this.fullName, JSON.stringify(this._linkRec))
    }

}
