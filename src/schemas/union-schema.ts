import { ErrorSchema } from "../errors/error-schema.js";
import type { InferSchemaType, InternalResult, Path } from "../types.js";
import { Schema } from "./schema.js";
/**
 * Schema that validates a value against multiple alternative schemas.
 *
 * A value is considered valid when at least one of the schemas in the
 * union successfully parses it.
 *
 * Failed branch errors are kept internal to the union and are not added
 * to the parent error collection. When all branches fail, the union
 * reports a single validation issue.
 *
 * @typeParam T The tuple of schemas that make up the union.
 */
export class UnionSchema<T extends Schema<any>[]> extends Schema<InferSchemaType<T[number]>> {
    private readonly _union : T;

    /**
    * Creates a union schema from multiple alternative schemas.
    *
    * @param union Schemas that can be used to validate the value.
    */
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
               message : `Expected a union`,
               code : "invalid_type"
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
