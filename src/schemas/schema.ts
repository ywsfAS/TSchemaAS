import type { Refinement } from "../refinements/refinement";
import type { SafeParseResult } from "../types";

export abstract class Schema<T> {
    protected readonly _refinements: Refinement<T>[] = [];

    abstract _parse(value: unknown): T;

    abstract _tryParse(value: unknown): SafeParseResult<T>;

    protected runRefinements(value: T): void {
        for (const ref of this._refinements) {
            if (!ref.check(value)) {
                throw new Error(ref.message);
            }
        }
    }

    protected tryRunRefinements(value: T): SafeParseResult<T> | void {
        for (const ref of this._refinements) {
            if (!ref.check(value)) {
                return {
                    success: false,
                    error: new Error(ref.message)
                };
            }
        }
    }

    public parse(value: unknown): T {
        const result = this._parse(value);

        this.runRefinements(result);

        return result;
    }

    public tryParse(value: unknown): SafeParseResult<T> {
        const result = this._tryParse(value);

        if (!result.success) {
            return result;
        }

        const refinementResult = this.tryRunRefinements(result.data);

        if (refinementResult) {
            return refinementResult;
        }

        return result;
    }
}
