import type { Refinement } from "../refinements/refinement";
import type {SafeParseResult} from "../types";
export abstract class Schema<T> {
    // init refinements
    protected readonly _refinements : Refinement<T>[] = [];
    // Parse the value and throw if validation fails.
    abstract parse(value : unknown) : T;
    // Parse the value without throwing; return the validation result instead.
    abstract tryParse(value : unknown) : SafeParseResult<T>

    protected runRefinements(value : T){
        for(let ref of this._refinements){
            if(!ref.check(value)){
                // error message from that refinement
                throw new Error(ref.message);
            }
        }
    }
};
