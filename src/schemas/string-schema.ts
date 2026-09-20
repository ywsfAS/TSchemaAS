import {Schema} from "./schema.js";
import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Path } from "../types.js";

/**
 * Schema that validates string values.
 *
 * Accepts only primitive JavaScript strings. Additional string constraints
 * can be applied through refinements such as `min()`, `max()`, `email()`,
 * `regex()`, `url()`, `startsWith()`, `endsWith()`, and `includes()`.
 */
export class StringSchema extends Schema<string> {

    public _tryParse(value : unknown , errors : ErrorSchema , path : Path) : InternalResult<string> {
        if(typeof value !== "string"){
            errors.addIssue({
                path : path,
                message : "Expected a string",
                code : "invalid_type",
            });
            return { success : false};

        }
        this.runRefinements(value,errors,path);
        return {
            success : true,
            data : value
        }
    }
}
