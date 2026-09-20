import { Refinement } from "./refinement.js";
import { StringSchema } from "../schemas/string-schema.js";

/**
 * Refinement that validates whether a string is a valid URL.
 *
 * Uses the built-in `URL` constructor to determine whether the value
 * can be parsed as a URL.
 */
export class Url extends Refinement<string> {

    /**
    * Creates a URL-format refinement.
    */
    constructor(){
        super("Invalid url format");
    }
    /**
    * Checks whether the string can be parsed as a URL.
    *
    * @param value The string to validate.
    * @returns `true` if the string is a valid URL; otherwise, `false`.
    */
    public check(value: string): boolean {
       try{
           new URL(value);
           return true;
       } 
       catch{
        return false;
       }
    }

}

//@ts-ignore
declare module "../schemas/string-schema.js" {
    interface StringSchema{
        /**
        * Requires the string to be a valid URL.
        *
        * @returns The current schema with URL validation.
        */
        url() : this;
    }
}
StringSchema.prototype.url = function () {
        this._refinements.push(new Url());
        return this;
}

