import { Schema } from "../schemas/schema";
import type { inferType, SafeParseResult } from "../types";

export class Default<T extends Schema<any>> extends Schema<inferType<T>>{

    private _object : T;
    private _d : inferType<T>;

    constructor(s : T, d : inferType<T>){
        super();
        this._object = s;
        this._d = d;
    }

    public parse(value: unknown): inferType<T> {
        
        return this._object.parse(value === undefined ? this._d : value);
    }

    public tryParse(value: unknown): SafeParseResult<inferType<T>> {
       return this._object.tryParse(value === undefined ? this._d : value); 
    }








}
//@ts-ignore
declare module "../schemas/schema.js" {
  interface Schema<T> {
    default(d : T): Default<this>;
  }
}
Schema.prototype.default = function (d : any){
    return new Default(this,d);
};
