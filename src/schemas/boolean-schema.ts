import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Path } from "../types.js";
import  {Schema} from "./schema.js";

/**
 * Schema that validates boolean values.
 *
 * Accepts only the primitive `true` and `false` values.
 */
export class BooleanSchema extends Schema<boolean>{

    public _tryParse(value : unknown , errors : ErrorSchema,path : Path) : InternalResult<boolean> {
        if(typeof value !== "boolean"){
            errors.addIssue({
                path : path,
                message : "Expected a boolean",
                code : "invalid_type"
            });
            return { success : false }
        }
        this.runRefinements(value,errors,path);
        return {
            success : true,
            data : value
        }
    }

}
