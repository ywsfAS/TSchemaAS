import { StringSchema } from "../schemas/string-schema.js";
import { Refinement } from "./refinement.js";


/**
 * Refinement that requires a string to match a regular expression pattern.
 */
export class Regex extends Refinement<string> {

    private _exp : string;
    private _opts : string | undefined;
    /**
    * Creates a regular-expression refinement.
    *
    * @param expr Regular expression pattern used for validation.
    * @param options Optional regular expression flags, such as `"i"` for
    * case-insensitive matching.
    */
    constructor(expr : string , options : string | undefined){
        super("String does not match the required pattern");
        this._exp = expr;
        this._opts = options;
    }
    /**
    * Checks whether the string matches the configured pattern.
    *
    * @param value The string to validate.
    * @returns `true` if the string matches the pattern; otherwise, `false`.
    */
    public check(value: string): boolean {
       const regex = new RegExp(this._exp,this._opts);
       return regex.test(value);
    }

}
//@ts-ignore
declare module "../schemas/string-schema.js" {
    interface StringSchema{
        /**
        * Requires the string to match the specified regular expression.
        *
        * @param exp Regular expression pattern used for validation.
        * @param opts Optional regular expression flags, such as `"i"` for case-insensitive matching.
        * @returns The current schema with regular expression validation.
        */
        regex(exp : string,opts : string | undefined) : this;
    }
}
StringSchema.prototype.regex = function (exp : string , opts : string | undefined) {
        this._refinements.push(new Regex(exp,opts));
        return this;
}

