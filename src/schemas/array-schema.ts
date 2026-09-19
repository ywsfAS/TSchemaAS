import type { ErrorSchema } from "../errors/error-schema.js";
import type { InferSchemaType ,InternalResult,Path} from "../types.js";
import { Schema } from "./schema.js";

export class ArraySchema<T extends Schema<any>> extends Schema<InferSchemaType<T>[]> {

    private readonly _schema : T;
    constructor(s : T){
        super();
        this._schema = s;
    }
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
                message : "The type is incompatible with any[]",
                code : ""
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
