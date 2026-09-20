import type { ErrorSchema } from "../errors/error-schema.js";
import { Schema } from "../schemas/schema.js";
import type {inferType, InternalResult, Path} from "../types";

 /**
  * Schema wrapper that provides a default value when the input is `undefined`.
  *
  * The default value is passed through the underlying schema, so it must
  * satisfy the wrapped schema's validation rules.
  */
export class Default<T extends Schema<any>> extends Schema<inferType<T>>{

    private _object : T;
    private _d : inferType<T>;

    /**
    * Creates a default-value schema around another schema.
    *
    * @param s The underlying schema used to validate the input or default value.
    * @param d The value to use when the input is `undefined`.
    */
    constructor(s : T, d : inferType<T>){
        super();
        this._object = s;
        this._d = d;
    }

    public _tryParse(value: unknown, errors : ErrorSchema,path : Path): InternalResult<inferType<T>> {
       const modifiedValue = value === undefined ? this._d : value;
       this.runRefinements(modifiedValue as inferType<T>,errors,path);
       return this._object._tryParse(modifiedValue,errors ,path); 
    }


}
//@ts-ignore
declare module "../schemas/schema.js" {
  interface Schema<T> {
    /**
    * Provides a default value when the input is `undefined`.
    *
    * The default value is validated using the underlying schema.
    *
    * @param d Value to use when the input is `undefined`.
    * @returns A schema that replaces `undefined` with the default value.
    */
    default(d : T): Default<this>;
  }
}
Schema.prototype.default = function (d : any){
    return new Default(this,d);
};
