import type { ErrorSchema } from "../errors/error-schema.js";
import { Schema } from "../schemas/schema.js";
import type {  inferType, InternalResult, Path, SafeParseResult } from "../types";

export class Optional<T extends Schema<any>> extends Schema<inferType<T> | undefined>{
    private _object : T;
    constructor(s : T){
        super();
        this._object = s; 
    }
    public _tryParse(value: unknown , errors : ErrorSchema , path : Path): InternalResult<inferType<T> | undefined> {
        if(value === undefined) return {success : true , data : value};
        this.runRefinements(value as inferType<T> , errors , path);
        return this._object._tryParse(value,errors,path);
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
