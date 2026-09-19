import {Schema} from "./schema.js";
import type { ErrorSchema } from "../errors/error-schema.js";
import type { InternalResult, Path } from "../types.js";

export class StringSchema extends Schema<string> {

    public _tryParse(value : unknown , errors : ErrorSchema , path : Path) : InternalResult<string> {
        if(typeof value !== "string"){
            errors.addIssue({
                path : path,
                message : "Expected a string",
                code : "",
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
