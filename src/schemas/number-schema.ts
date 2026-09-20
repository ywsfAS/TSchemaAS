import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Path } from "../types.js";
import  {Schema} from "./schema.js";

/**
 * Schema that validates JavaScript numbers.
 *
 * Accepts values whose type is `number`, including `NaN`, `Infinity`,
 * and `-Infinity`. Use the corresponding refinements when these values
 * need to be restricted.
 */
export class NumberSchema extends Schema<number> {

    public _tryParse(value: unknown , errors : ErrorSchema , path : Path): InternalResult<number> {

        if(typeof value !== "number"){
            errors.addIssue({
                path : path,
                message : "Expected a number",
                code : "invalid_type"
            });
            return { success : false}
        }
        this.runRefinements(value,errors,path);
        return {
            success : true,
            data : value
        }
    }
}

