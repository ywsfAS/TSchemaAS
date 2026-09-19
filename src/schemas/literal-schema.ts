import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Literal, Path } from "../types.js";
import { Schema } from "./schema.js";

export class LiteralSchema<T extends boolean | number | string> extends Schema<Literal<T>> {
    private _literal : T;

    constructor(val : T){
        super();
        this._literal = val;
    }

    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<Literal<T>> {
        if(value !== this._literal){
            errors.addIssue({
                path,
                message : `Expected a lateral of ${this._literal}`,
                code : ""
            })
            return { success : false }
        }  
        this.runRefinements(value as Literal<T>,errors,path);
        return {
            success : true,
            data : value as Literal<T>
        }
    }
    


}
