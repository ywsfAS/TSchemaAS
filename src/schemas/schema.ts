import { ErrorSchema } from "../errors/error-schema.js";
import type { Refinement } from "../refinements/refinement.js";
import type { SafeParseResult , Path, InternalResult} from "../types.js";

/**
 * Base class for all schemas.
 *
 * A schema defines how a value is validated at runtime and provides
 * methods for parsing values and collecting validation errors.
 *
 * @typeParam T The TypeScript type produced when the schema successfully
 * parses a value.
 */
export abstract class Schema<T> {
    protected readonly _refinements: Refinement<T>[] = [];

    /**
    * Performs the internal parsing and validation operation.
    *
    * This method is used internally by schemas and schema wrappers to
    * compose validation logic and propagate errors and paths.
    *
    * It is not part of the public schema API. Use `parse()` or `tryParse()`
    * to validate values from application code.
    *
    * @param value The value to validate.
    * @param errors Error collection used to accumulate validation issues.
    * @param path Path to the current value within the input.
    * @returns The internal parsing result.
    *
    * @internal
    */
    abstract _tryParse(value: unknown, errors : ErrorSchema , path : Path): InternalResult<T>;
    /**
    * Runs all refinements registered on the schema.
    *
    * Each refinement is evaluated against the successfully parsed value.
    * Failed refinements add their validation issue to the provided error
    * collection.
    *
    * @param value The validated value to refine.
    * @param errors Error collection used to store refinement issues.
    * @param path Path to the value being refined.
    */
    protected runRefinements(value: T, errors : ErrorSchema ,path : Path): void {
        for (const ref of this._refinements) {
            if (!ref.check(value)) {
                errors.addIssue({
                    path,
                    message : ref.message,
                    code : "custom",
                });
            }
        }
    }
    /**
    * Parses a value and returns the validated value.
    *
    * Throws an `ErrorSchema` when validation fails.
    *
    * @param value The value to validate.
    * @returns The validated value.
    * @throws {ErrorSchema} When the value fails validation.
    *
    * @example
    * ```ts
    * const user = s.object({
    *     name: s.string(),
    *     age: s.number()
    * });
    *
    * const result = user.parse({
    *     name: "Youssef",
    *     age: 22
    * });
    * ```
    */
    public parse(value: unknown): T {
        const path : Path = [];
        const errors : ErrorSchema = new ErrorSchema();
        const result = this._tryParse(value,errors,path);
        if(!errors.isEmpty() || !result.success){
            throw errors;
        }
        return result.data;
    }
    /**
    * Parses a value without throwing when validation fails.
    *
    * Returns a discriminated result containing either the validated data
    * or the collected validation error.
    *
    * @param value The value to validate.
    * @returns A successful result containing the parsed data, or a failed
    * result containing the validation error.
    *
    * @example
    * ```ts
    * const result = s.string().tryParse("hello");
    *
    * if (result.success) {
    *     console.log(result.data);
    * } else {
    *     console.log(result.error);
    * }
    * ```
    */
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
