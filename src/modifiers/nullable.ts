import type { ErrorSchema } from "../errors/error-schema.js";
import { Schema } from "../schemas/schema.js";
import type { inferType, InternalResult, Path} from "../types.js";

/**
 * Schema wrapper that allows `null` as a valid value.
 *
 * When the input is `null`, validation succeeds without validating
 * the underlying schema. Otherwise, the value is validated normally.
 */
export class Nullable<T extends Schema<any>> extends Schema<inferType<T> | null> {

    private _object : T;
    /**
    * Creates a nullable schema around another schema.
    *
    * @param s The underlying schema used to validate non-null values.
    */
    constructor(s : T){
        super();
        this._object = s;
    }
    public _tryParse(value: unknown , errors : ErrorSchema,path : Path): InternalResult<inferType<T> | null> {
        if(value === null) return {success : true , data : value};
        this.runRefinements(value as inferType<T> , errors , path);
        return this._object._tryParse(value,errors,path);
    }

}
//@ts-ignore
declare module "../schemas/schema.js" {
  interface Schema<T> {
    /**
    * Allows `null` as a valid value for the schema.
    *
    * When the input is `null`, validation succeeds without
    * validating the underlying schema.
    *
    * @returns A schema that accepts the original value or `null`.
    */
    nullable(): Nullable<this>;
  }
}
Schema.prototype.nullable = function (){
    return new Nullable(this);
};
