import { StringSchema } from "../schemas/string-schema.js";
import { Refinement } from "./refinement.js";


export class Regex extends Refinement<string> {

    private _exp : string;
    private _opts : string | undefined;
    constructor(expr : string , options : string | undefined){
        super("String does not match the required pattern");
        this._exp = expr;
        this._opts = options;
    }
    public check(value: string): boolean {
       const regex = new RegExp(this._exp,this._opts);
       return regex.test(value);
    }

}
//@ts-ignore
declare module "../schemas/string-schema.js" {
    interface StringSchema{
        regex(exp : string,opts : string | undefined) : this;
    }
}
StringSchema.prototype.regex = function (exp : string , opts : string | undefined) {
        this._refinements.push(new Regex(exp,opts));
        return this;
}

