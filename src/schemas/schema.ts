import { ErrorSchema } from "../errors/error-schema";
import type { Refinement } from "../refinements/refinement";
import type { SafeParseResult , Path, InternalResult} from "../types";

export abstract class Schema<T> {
    protected readonly _refinements: Refinement<T>[] = [];

    abstract _tryParse(value: unknown, errors : ErrorSchema , path : Path): InternalResult<T>;

    protected runRefinements(value: T, errors : ErrorSchema ,path : Path): void {
        for (const ref of this._refinements) {
            if (!ref.check(value)) {
                errors.addIssue({
                    path,
                    message : ref.message,
                    code : "",
                });
            }
        }
    }
    public parse(value: unknown): T {
        const path : Path = [];
        const errors : ErrorSchema = new ErrorSchema();
        const result = this._tryParse(value,errors,path);
        if(!errors.isEmpty() || !result.success){
            throw errors;
        }
        return result.data;
    }

    public tryParse(value: unknown): SafeParseResult<T> {
        const path : Path = [];
        const errors : ErrorSchema = new ErrorSchema();
        const result = this._tryParse(value,errors,path);
        if(!errors.isEmpty() || !result.success){
            return {
                success : false,
                error : errors
            }
        }
        return {
            success : true,
            data : result.data as T
        }
    }
}
