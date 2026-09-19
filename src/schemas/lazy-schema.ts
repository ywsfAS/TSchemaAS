import type { ErrorSchema } from "../errors/error-schema.js";
import type { Path, InternalResult } from "../types.js";
import { Schema } from "./schema.js";

export class Lazy<T> extends Schema<T> {
    private _schemafn : () => Schema<T>;

    constructor(fn : () => Schema<T>){
        super();
        this._schemafn = fn;
    }
    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<T> {
       const schema = this._schemafn();
       return schema._tryParse(value,errors,path);
    }


}
