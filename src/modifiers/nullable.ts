import { Schema } from "../schemas/schema";
import type { inferType, SafeParseResult } from "../types";

export class Nullable<T extends Schema<any>> extends Schema<inferType<T> | null> {

    private _object : T;
    constructor(s : T){
        super();
        this._object = s;
    }

    public parse(value: unknown): inferType<T> | null {
        if(value === null) return value;
        return this._object.parse(value);
    }

    public tryParse(value: unknown): SafeParseResult<inferType<T> | null> {
        
        if(value === null){
            return {
                success : true,
                data : value,
            }
        }
        return this._object.tryParse(value);
    }




}
//@ts-ignore
declare module "../schemas/schema.js" {
  interface Schema<T> {
    nullable(): Nullable<this>;
  }
}
Schema.prototype.nullable = function (){
    return new Nullable(this);
};
