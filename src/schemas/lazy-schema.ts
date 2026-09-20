import type { ErrorSchema } from "../errors/error-schema.js";
import type { Path, InternalResult } from "../types.js";
import { Schema } from "./schema.js";

/**
 * Schema that defers resolving the underlying schema until validation time.
 *
 * Lazy schemas are useful when a schema cannot be created immediately,
 * particularly for recursive or circular schema definitions.
 *
 * @typeParam T The type produced by the deferred schema.
 */
export class Lazy<T> extends Schema<T> {
    private _schemafn : () => Schema<T>;
    /**
     * Creates a lazy schema.
     *
     * @param fn Function that returns the schema to use for validation.
     * The function is evaluated each time the value is parsed.
     */
    constructor(fn : () => Schema<T>){
        super();
        this._schemafn = fn;
    }
    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<T> {
       const schema = this._schemafn();
       return schema._tryParse(value,errors,path);
    }


}
