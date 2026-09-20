import type { ErrorSchema } from "../errors/error-schema.js";
import { Schema } from "../schemas/schema.js";
import type {  inferType, InternalResult, Path} from "../types.js";

/**
 * Schema wrapper that allows `undefined` as a valid value.
 *
 * When the input is `undefined`, validation succeeds without validating
 * the underlying schema. Otherwise, the value is validated normally.
 */
export class Optional<T extends Schema<any>> extends Schema<inferType<T> | undefined>{
    private _object : T;
    /**
    * Creates an optional schema around another schema.
    *
    * @param s The underlying schema used to validate defined values.
    */
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
    /**
    * Allows `undefined` as a valid value for the schema.
    *
    * When the input is `undefined`, validation succeeds without
    * validating the underlying schema.
    *
    * @returns A schema that accepts the original value or `undefined`.
    */
    optional(): Optional<this>;
  }
}
Schema.prototype.optional = function (){
    return new Optional(this);
};
