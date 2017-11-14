import { readFileSync,existsSync,writeFileSync }  from "fs";

export class linkRec {
    Date: Date;

    constructor(
        public Folder: string,
        public Name: string,
        public ID: string
    ) {
        this.Date = new Date()
    }

    public get fileName(): string {
        return this.Name + '.mp3'
    }

}

export class linkRecStore {
    private _linkRec : Array<linkRec>;
    
    constructor( private _path:string = "./", private _fileName  :string = "radioteka.json"){
        this._path += this._path.slice(-1) != "/" ? "/" : ""
        this.loadData();
    }

    public get linkRec() : Array<linkRec> {
        return this._linkRec;
    }
    
    public get fullName() : string  {
        return this._path + this._fileName
    }

    private loadData() {
        if (existsSync(this.fullName)){
            var x : string = readFileSync(this.fullName).toString()
            this._linkRec = JSON.parse(x);
        }
        else
        this._linkRec = new Array<linkRec>();
    }

    saveData(){
        writeFileSync(this.fullName,JSON.stringify(this._linkRec))
    }
    
}
