import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Path } from "../types.js";
import  {Schema} from "./schema.js";

export class BooleanSchema extends Schema<boolean>{

    public _tryParse(value : unknown , errors : ErrorSchema,path : Path) : InternalResult<boolean> {
        if(typeof value !== "boolean"){
            errors.addIssue({
                path : path,
                message : "Expected a boolean",
                code : ""
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
