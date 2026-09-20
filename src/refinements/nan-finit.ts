import { Refinement } from "./refinement.js";
import { NumberSchema } from "../schemas/number-schema.js";

/**
 * Refinement that requires a number to be finite.
 *
 * Rejects positive infinity, negative infinity, and `NaN`.
 */
export class NumberFinite extends Refinement<number> {

    /**
    * Creates a finite-number refinement.
    */
    constructor() {
        super("Number must be finite");
    }

    /**
    * Checks whether the number is finite.
    *
    * @param value The number to validate.
    * @returns `true` if the number is finite; otherwise, `false`.
    */
    public check(value: number): boolean {
        return Number.isFinite(value);
    }
}
/**
 * Refinement that requires a value to be `NaN`.
 */
export class NumberNaN extends Refinement<number> {

    /**
    * Creates a `NaN` refinement.
    */
    constructor() {
        super("Number must be NaN");
    }

    /**
    * Checks whether the value is `NaN`.
    *
    * @param value The number to validate.
    * @returns `true` if the value is `NaN`; otherwise, `false`.
    */
    public check(value: number): boolean {
        return Number.isNaN(value);
    }
}
declare module "../schemas/number-schema.js" {
    interface NumberSchema {
        /**
        * Requires the number to be finite.
        *
        * @returns The current schema with finite-number validation.
        */
        finite(): this;
        /**
        * Requires the value to be `NaN`.
        *
        * @returns The current schema with `NaN` validation.
        */
        nan(): this;
    }
}

NumberSchema.prototype.finite = function () {
    this._refinements.push(new NumberFinite());
    return this;
};

NumberSchema.prototype.nan = function () {
    this._refinements.push(new NumberNaN());
    return this;
};
