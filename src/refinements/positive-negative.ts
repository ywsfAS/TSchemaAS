import { Refinement } from "./refinement.js";
import { NumberSchema } from "../schemas/number-schema.js";

/**
 * Refinement that requires a number to be greater than zero.
 */
export class Positive extends Refinement<number> {

    /**
    * Creates a positive-number refinement.
    */
    constructor(){
        super("Number must be positive");
    }

    /**
    * Checks whether the number is greater than zero.
    *
    * @param value The number to validate.
    * @returns `true` if the number is positive; otherwise, `false`.
    */
    public check(value: number): boolean {
        return value > 0;
    }
}
/**
 * Refinement that requires a number to be less than zero.
 */
export class Negative extends Refinement<number> {

    /**
    * Creates a negative-number refinement.
    */
    constructor(){
        super("Number must be negative");
    }

    /**
    * Checks whether the number is less than zero.
    *
    * @param value The number to validate.
    * @returns `true` if the number is negative; otherwise, `false`.
    */
    public check(value: number): boolean {
        return value < 0;
    }
}
//@ts-ignore
declare module "../schemas/number-schema.js" {
    interface NumberSchema{
        /**
        * Requires the number to be greater than zero.
        *
        * @returns The current schema with positive-number validation.
        */
        positive() : this;
        /**
        * Requires the number to be less than zero.
        *
        * @returns The current schema with negative-number validation.
        */
        negative() : this;
    }
}
NumberSchema.prototype.positive = function () {
    this._refinements.push(new Positive());
    return this;
}
NumberSchema.prototype.negative = function () {
    this._refinements.push(new Negative());
    return this;
}
