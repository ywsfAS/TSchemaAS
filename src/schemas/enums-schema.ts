import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Literal, Path } from "../types.js";
import { Schema } from "./schema.js";

/**
 * Schema that validates a value against a fixed set of literal values.
 *
 * @typeParam T The tuple containing the allowed enum values.
 */
export class EnumSchema<T extends (string | number | boolean)[]> extends Schema<Literal<T[number]>>{

    private readonly _enums : T;

    /**
    * Creates an enum schema.
    *
    * @param enums The values accepted by the schema.
    */
    constructor(enums : T){
        super();
        this._enums = enums;
    }

    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<Literal<T[number]>> {
        const result = this._enums.some((el) => el === value);
        if (!result) {
            errors.addIssue({
                path,
                message: `Expected one of: ${this._enums.join(", ")}`,
                code: "invalid_value"
            });

            return { success: false };
        }
        this.runRefinements(value as Literal<T[number]>,errors,path);
        return {
            success : true,
            data : value as Literal<T[number]>
        }
    }


}
