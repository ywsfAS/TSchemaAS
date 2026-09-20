import type { ErrorSchema } from "../errors/error-schema.js";
import type { InferSchemaType ,InternalResult,Path} from "../types.js";
import { Schema } from "./schema.js";

/**
 * Schema that validates arrays by applying an underlying schema
 * to each element.
 *
 * @typeParam T The schema used to validate each array element.
 */
export class ArraySchema<T extends Schema<any>> extends Schema<InferSchemaType<T>[]> {

    private readonly _schema : T;
    /**
    * Creates an array schema.
    *
    * @param s Schema used to validate each element of the array.
    */
    constructor(s : T){
        super();
        this._schema = s;
    }
    /**
    * Checks whether a value is an array.
    *
    * @param arr The value to check.
    * @returns `true` if the value is an array; otherwise, `false`.
    */
    private checkArray(arr : unknown) : arr is any[]{
        if(!Array.isArray(arr)){
            return false;
        }
        return true;
    }
    public _tryParse(arr : unknown , errors : ErrorSchema , path : Path): InternalResult<InferSchemaType<T>[]> {
        if(!this.checkArray(arr)){
            errors.addIssue({
                path : path,
                message : "Expected an array",
                code : "invalid_type"
            });
            return { success : false};
        }
       const list = arr as any[];
       let success = true;
       for(let i = 0 ; i < list.length ; i++){
            const curr = list[i];
            const result = this._schema._tryParse(curr,errors,[...path,i]);
            if(!result.success){
                success = false;
            }
        }

        if(!success) return {success : false};
        this.runRefinements(arr,errors,path);
        return {
            success : true,
            data : list
        }
        
    }
}
