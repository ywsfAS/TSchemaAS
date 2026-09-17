import { Refinement } from "./refinement";
import { StringSchema } from "../schemas/string-schema";

export class Url extends Refinement<string> {

    constructor(){
        super("Invalid url format");
    }
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
        url() : this;
    }
}
StringSchema.prototype.url = function () {
        this._refinements.push(new Url());
        return this;
}

