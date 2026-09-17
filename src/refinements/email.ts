import { Refinement } from "./refinement";
import { StringSchema } from "../schemas/string-schema";

export class Email extends Refinement<string>{

    private _emailExp : string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    constructor(){
        super("Invalid email format");
    }

    public check(value: string): boolean {
        const regex = new RegExp(this._emailExp);
        return regex.test(value);
    }

} 

//@ts-ignore
declare module "../schemas/string-schema.js" {
    interface StringSchema{
        email() : this;
    }
}
StringSchema.prototype.email = function () {
        this._refinements.push(new Email());
        return this;
}
