
export abstract class Refinement<T> {
    private _message : string;
    abstract check(value : T , ...options : any[]) : boolean;

    constructor(msg : string){
        this._message = msg;
    }
    get message() : string {
        return this._message;
    }
}
