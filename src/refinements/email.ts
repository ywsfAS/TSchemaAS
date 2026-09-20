import { Refinement } from "./refinement.js";
import { StringSchema } from "../schemas/string-schema.js";

 /**
  * Refinement that validates whether a string follows an email format.
  *
  * Uses a regular expression to perform the email format check.
  */
export class Email extends Refinement<string>{

    private _emailExp : string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    /**
    * Creates an email format refinement.
    */
    constructor(){
        super("Invalid email format");
    }

    /**
    * Checks whether the provided string matches the email format.
    *
    * @param value The string to validate.
    * @returns `true` if the string matches the expected email format;
    * otherwise, `false`.
    */
    public check(value: string): boolean {
        const regex = new RegExp(this._emailExp);
        return regex.test(value);
    }

} 

//@ts-ignore
declare module "../schemas/string-schema.js" {
    interface StringSchema{
        /**
        * Requires the string to have a valid email format.
        *
        * @returns The current schema with email format validation.
        */
        email() : this;
    }
}
StringSchema.prototype.email = function () {
        this._refinements.push(new Email());
        return this;
}
