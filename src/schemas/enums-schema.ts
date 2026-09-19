import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Literal, Path } from "../types.js";
import { Schema } from "./schema.js";

export class EnumSchema<T extends (string | number | boolean)[]> extends Schema<Literal<T[number]>>{

    private readonly _enums : T;

    constructor(enums : T){
        super();
        this._enums = enums;
    }

    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<Literal<T[number]>> {
        const result = this._enums.some((el) => el === value);
        if(!result){
            errors.addIssue({
                path,
                message : `Expected a enum of ${this._enums}`,
                code : ""
            });
            return {success : false}
        }
        this.runRefinements(value as Literal<T[number]>,errors,path);
        return {
            success : true,
            data : value as Literal<T[number]>
        }
    }


}
