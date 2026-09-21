import type { Element, InferSchemaType} from "../types.js";
import { Refinement } from "./refinement.js";
import { ArraySchema } from "../schemas/array-schema.js";
import { StringSchema } from "../schemas/string-schema.js";


/**
 * Refinement that requires a string to start with a specified prefix.
 */
export class StringStartsWith extends Refinement<string>{
    private readonly _prefix : string;

    /**
    * Creates a string-prefix refinement.
    *
    * @param p Prefix that the string must start with.
    */
    constructor(p : string){
        super(`String must starts with ${p}`);
        this._prefix = p;
    }
    /**
    * Checks whether the string starts with the configured prefix.
    *
    * @param value The string to validate.
    * @returns `true` if the string starts with the prefix; otherwise, `false`.
    */
    public check(value: string): boolean {
       return this.isPrefix(value); 
    }

    private isPrefix(value : string) : boolean {
        return value.startsWith(this._prefix);
    }

}
/**
 * Refinement that requires an array to start with a specified element
 * or sequence of elements.
 *
 * @typeParam T The array type being validated.
 * @typeParam C The type of prefix accepted by the refinement.
 */
export class ArrayStartsWith<T extends any[],C extends (T | Element<T>)> extends Refinement<T> {

    private readonly _prefix : C;
    /**
    * Creates an array-prefix refinement.
    *
    * @param p Element or sequence of elements that the array must start with.
    */
    constructor(p : C){
        super(`Sequence must starts with ${p}`);
        this._prefix = p;
    }

    /**
    * Checks whether the array starts with the configured element or sequence.
    *
    * @param value The array to validate.
    * @returns `true` if the array starts with the configured prefix;
    * otherwise, `false`.
    */
    public check(value: T): boolean {
        return this.isPrefix(value);    
    }
    private isElement(value : C) : value is Element<T> {
        return !Array.isArray(value);
    }
    private startsWithElement(value : T) : boolean {
       return value[0] === this._prefix;
    }
    private startsWithSquence(value : T) : boolean {
        if(this._prefix.length > value.length){
            return false;
        }
        return (this._prefix as T).every((el,index) => el === value[index]);

    }
    private isPrefix(value : T) : boolean {
       if(this.isElement(this._prefix)){
            return this.startsWithElement(value);
       }
       return this.startsWithSquence(value);
    }
}
// @ts-ignore
declare module "../schemas/array-schema.js" {
  interface ArraySchema<T>{
    /**
    * Requires the array to start with the specified value or sequence.
    *
    * @param m Element or sequence that must appear at the beginning of the array.
    * @returns The current schema with prefix validation.
    */
    startsWith(m : InferSchemaType<T> | InferSchemaType<T>[]): this;
  }
}
declare module "../schemas/string-schema.js" {
  interface StringSchema{
    /**
    * Requires the string to start with the specified prefix.
    *
    * @param m Prefix that must appear at the beginning of the string.
    * @returns The current schema with prefix validation.
    */
    startsWith(m : string): this;
  }
}
ArraySchema.prototype.startsWith = function (m : any) {
    this._refinements.push(new ArrayStartsWith(m));
    return this;
}
StringSchema.prototype.startsWith = function (m : string) {
    this._refinements.push(new StringStartsWith(m));
    return this;
}

