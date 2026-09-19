import { ErrorSchema } from "../errors/error-schema.js";
import type { InferSchemaType, InternalResult, Path } from "../types.js";
import { Schema } from "./schema.js";

export class UnionSchema<T extends Schema<any>[]> extends Schema<InferSchemaType<T[number]>> {
    private readonly _union : T;
    constructor(union : T){
        super();
        this._union = union;
    }
    public _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<InferSchemaType<T[number]>> {
       const result = this._union.some((s) => {
           const branchErrors = new ErrorSchema();
           const result = s._tryParse(value,branchErrors,path);
           if(!result.success) return false;
           return true;
       })
       if(!result){
           errors.addIssue({
               path,
               message : `Expected a value in the union`,
               code : ""
           });
           return {success : false};
       }
        this.runRefinements(value as InferSchemaType<T[number]>,errors,path);
        return {
            success : true,
            data : value as InferSchemaType<T[number]>

        }
    }
}
