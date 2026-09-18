import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Path } from "../types.js";
import  {Schema} from "./schema.js";

export class NumberSchema extends Schema<number> {

    public _tryParse(value: unknown , errors : ErrorSchema , path : Path): InternalResult<number> {

        if(typeof value !== "number"){
            errors.addIssue({
                path : path,
                message : "Expected a number",
                code : ""
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

