import type {SafeParseResult} from "../types";
export abstract class Schema<T> {
    // Parse the value and throw if validation fails.
    abstract parse(value : unknown) : T;
    // Parse the value without throwing; return the validation result instead.
    abstract tryParse(value : unknown) : SafeParseResult<T>
};
