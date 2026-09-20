import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Literal, Path } from "../types.js";
import { Schema } from "./schema.js";
/**
 * Schema that validates a value against one exact literal value.
 *
 * A value is considered valid only when it is strictly equal to the
 * configured literal.
 *
 * @typeParam T The literal value accepted by the schema.
 */
export class LiteralSchema<T extends boolean | number | string> extends Schema<Literal<T>> {
    private _literal : T;

    /**
    * Creates a literal schema.
    *
    * @param val The exact value accepted by the schema.
    */
    constructor(val : T){
        super();
        this._literal = val;
    }

    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<Literal<T>> {
        if (value !== this._literal) {
            errors.addIssue({
                path,
                message: `Expected literal ${this._literal}`,
                code: "invalid_value"
            });

            return { success: false };
        }
        this.runRefinements(value as Literal<T>,errors,path);
        return {
            success : true,
            data : value as Literal<T>
        }
    }
    


}
