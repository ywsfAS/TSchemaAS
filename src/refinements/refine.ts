import type { Predicate } from "../types.js";
import { Refinement } from "./refinement.js";
import { Schema } from "../schemas/schema.js";

/**
 * Refinement that validates a value using a user-provided predicate.
 *
 * Unlike built-in refinements, this allows callers to define custom
 * validation rules that are specific to their application.
 */
export class Refine<T> extends Refinement<T>{

    private _fn : Predicate<T>;

    /**
    * Creates a custom refinement.
    *
    * @param fn Predicate used to determine whether the value is valid.
    * @param message Error message used when the predicate returns `false`.
    */
    constructor(fn : Predicate<T> , message : string){
        super(message);
        this._fn = fn;
    }

    /**
    * Checks whether the value satisfies the custom predicate.
    *
    * @param value The value to validate.
    * @returns `true` if the predicate accepts the value; otherwise, `false`.
    */
    public check(value: T): boolean {
       return this._fn(value); 
    }

}
//@ts-ignore
declare module "../schemas/schema.js" {
    interface Schema <T> {
        /**
        * Adds a custom validation rule to the schema.
        *
        * The provided predicate is called with the parsed value and must
        * return `true` for the value to be considered valid.
        *
        * @param fn Predicate used to validate the value.
        * @param message Error message used when the predicate returns `false`.
        * @returns The current schema with the custom validation rule.
        */
        refine(fn : Predicate<T> , message : string) : this;
    }
}
Schema.prototype.refine = function (fn : Predicate<any> , message : string) {
    this._refinements.push(new Refine(fn,message));
    return this;
}
