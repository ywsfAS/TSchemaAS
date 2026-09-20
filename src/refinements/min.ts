import { Refinement } from "./refinement.js";
import { NumberSchema } from "../schemas/number-schema.js";
import { ArraySchema } from "../schemas/array-schema.js";
import { StringSchema } from "../schemas/string-schema.js";

/**
 * Base refinement for values that must satisfy a minimum constraint.
 *
 * Concrete implementations define how the value is compared with
 * the configured minimum.
 */
export abstract class MinRefinement<T,C> extends Refinement<T> {

    protected abstract min_value : C;
    protected abstract CompareTo(value : T) : boolean;
    /**
    * Checks whether the value satisfies the minimum constraint.
    *
    * @param value The value to validate.
    * @returns `true` if the value satisfies the minimum constraint;
    * otherwise, `false`.
    */
    public check(value : T): boolean {
        return this.CompareTo(value);
    }
}
/**
 * Refinement that requires a number to be greater than or equal to
 * the specified minimum value.
 */
export class MinNumber extends MinRefinement<number,number> {
    protected min_value ;
    /**
    * Creates a minimum-value refinement for numbers.
    *
    * @param min The minimum allowed number.
    */
    constructor(min : number){
        super(`value Cannot be less than ${min}`);
        this.min_value = min;
    }

    protected CompareTo(value: number): boolean {
        return value >= this.min_value; 
    }

}
/**
 * Refinement that requires a string to contain at least
 * the specified number of characters.
 */
export class MinString extends MinRefinement<string,number> {

    protected min_value ;
    /**
    * Creates a minimum-length refinement for strings.
    *
    * @param min The minimum number of characters required.
    */
    constructor(min : number){
        super(`string length cannot be shorter than ${min} characters`);
        this.min_value = min;
    }
    protected CompareTo(value: string): boolean {
        return value.length >= this.min_value; 
    }
}
/**
 * Refinement that requires an array to contain at least
 * the specified number of elements.
 */
export class MinArray extends MinRefinement<any[],number>{
    protected min_value: number;
    /**
    * Creates a minimum-length refinement for arrays.
    *
    * @param min The minimum number of elements required.
    */
    constructor(min : number){
        super(`array length cannot be shorter than ${min} elements`);
        this.min_value = min;
    }
    protected CompareTo(arr: any[]): boolean {
        return arr.length >= this.min_value; 
    }
}


//@ts-ignore
declare module "../schemas/number-schema.js" {
  interface NumberSchema {
    /**
    * Requires the number to be greater than or equal to `n`.
    *
    * @param n Minimum allowed value.
    * @returns The current schema with minimum value validation.
    */
    min(n : number): this;
  }
};
declare module "../schemas/string-schema.js" {
  interface StringSchema{
    /**
    * Requires the string to contain at least `n` characters.
    *
    * @param n Minimum number of characters.
    * @returns The current schema with minimum length validation.
    */

    min(n : number): this;
  }
}
declare module "../schemas/array-schema.js" {
    /**
    * Requires the array to contain at least `n` elements.
    *
    * @param n Minimum number of elements.
    * @returns The current schema with minimum length validation.
    */
  interface ArraySchema<T> {
    min(n : number): this;
  }
}
ArraySchema.prototype.min = function (m : number) {
    this._refinements.push(new MinArray(m));
    return this;
}
NumberSchema.prototype.min = function (m : number){
    this._refinements.push(new MinNumber(m))
    return this;
};
StringSchema.prototype.min = function (n : number){
    this._refinements.push(new MinString(n));
    return this;
}
