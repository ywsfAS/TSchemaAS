import { Refinement } from "./refinement.js";
import { NumberSchema } from "../schemas/number-schema.js";
import { StringSchema } from "../schemas/string-schema.js";
import { ArraySchema } from "../schemas/array-schema.js";

/**
 * Base refinement for values that must not exceed a maximum.
 *
 * Concrete implementations define how the value is compared with
 * the configured maximum.
 */
export abstract class MaxRefinement<T,C> extends Refinement<T> {

    protected abstract max_value : C;
    protected abstract CompareTo(value : T) : boolean;

    /**
    * Checks whether the value satisfies the maximum constraint.
    *
    * @param value The value to validate.
    * @returns `true` if the value does not exceed the maximum;
    * otherwise, `false`.
    */
    public check(value : T): boolean {
        return this.CompareTo(value);
    }
}

/**
 * Refinement that requires a number to be less than or equal to
 * the specified maximum value.
 */
export class MaxNumber extends MaxRefinement<number,number> {
    protected max_value ;
    /**
    * Creates a maximum-value refinement for numbers.
    *
    * @param max The maximum allowed number.
    */
    constructor(max : number){
        super(`value Cannot be greater than ${max}`);
        this.max_value = max;
    }

    protected CompareTo(value: number): boolean {
        return value <= this.max_value; 
    }

}
/**
 * Refinement that requires a string to contain no more than
 * the specified number of characters.
 */
export class MaxString extends MaxRefinement<string,number> {

    protected max_value ;

    /**
    * Creates a maximum-length refinement for strings.
    *
    * @param max The maximum number of characters allowed.
    */
    constructor(max : number){
        super(`string length cannot be longer than ${max} character`);
        this.max_value = max;
    }
    protected CompareTo(value: string): boolean {
        return value.length <= this.max_value; 
    }
}
/**
 * Refinement that requires an array to contain no more than
 * the specified number of elements.
 */
export class MaxArray extends MaxRefinement<any[],number> {

    protected max_value ;
    /**
    * Creates a maximum-length refinement for arrays.
    *
    * @param max The maximum number of elements allowed.
    */
    constructor(max : number){
        super(`array length cannot be longer than ${max} character`);
        this.max_value = max;
    }
    protected CompareTo(arr: any[]): boolean {
        return arr.length <= this.max_value; 
    }
}
//@ts-ignore
declare module "../schemas/number-schema.js" {
  interface NumberSchema {
    /**
    * Requires the number to be less than or equal to `n`.
    *
    * @param n Maximum allowed value.
    * @returns The current schema with maximum value validation.
    */
    max(n : number): this;
  }
};
declare module "../schemas/string-schema.js" {
  interface StringSchema{
    /**
    * Requires the string to contain at most `n` characters.
    *
    * @param n Maximum number of characters.
    * @returns The current schema with maximum length validation.
    */
    max(n : number): this;
  }
}
declare module "../schemas/array-schema.js" {
  interface ArraySchema<T>{
    /**
    * Requires the array to contain at most `n` elements.
    *
    * @param n Maximum number of elements.
    * @returns The current schema with maximum length validation.
    */
    max(n : number): this;
  }
}
ArraySchema.prototype.max = function (m : number){
    this._refinements.push(new MaxArray(m));
    return this;
}
NumberSchema.prototype.max = function (m : number){
    this._refinements.push(new MaxNumber(m))
    return this;
};
StringSchema.prototype.max = function (n : number){
    this._refinements.push(new MaxString(n));
    return this;
}
