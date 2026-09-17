import { Schema } from "../schemas/schema.js";
import type {  inferType, SafeParseResult } from "../types";

export class Optional<T extends Schema<any>> extends Schema<inferType<T> | undefined>{
    private _object : T;
    constructor(s : T){
        super();
        this._object = s; 
    }

    public parse(value: unknown): inferType<T> | undefined {
        if(value === undefined) return value;
        return this._object.parse(value);
    }

    public tryParse(value: unknown): SafeParseResult<inferType<T> | undefined> {
        if(value === undefined){
            return {
                success : true,
                data : value
            }
        };
        return this._object.tryParse(value);
        
    }


}
//@ts-ignore
// Add optional() to Schema.prototype at runtime to avoid a circular dependency at runtime.
// decalare module for typescripte type system at compile time
declare module "../schemas/schema.js" {
  interface Schema<T> {
    optional(): Optional<this>;
  }
}
Schema.prototype.optional = function (){
    return new Optional(this);
};
