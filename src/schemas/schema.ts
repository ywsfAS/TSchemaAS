import type { Refinement } from "../refinements/refinement";
import type {SafeParseResult} from "../types";
export abstract class Schema<T> {
    // init refinements
    protected readonly _refinements : Refinement<T>[] = [];
    // Parse the value and throw if validation fails.
    abstract _parse(value : unknown) : T;
    // Parse the value without throwing; return the validation result instead.
    abstract _tryParse(value : unknown) : SafeParseResult<T>

    protected runRefinements(value : T){
        for(let ref of this._refinements){
            if(!ref.check(value)){
                // error message from that refinement
                throw new Error(ref.message);
            }
        }
    }
    public parse(value : unknown) : T {
        const result = this._parse(value);
        this.runRefinements(value as T);
        return result;

    }
    public tryParse(value : unknown) : SafeParseResult<T>{
        const result = this._tryParse(value);
        this.runRefinements(value as T);
        return result;
    }
};
