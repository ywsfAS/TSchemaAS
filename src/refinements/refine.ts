import type { Predicate } from "../types";
import { Refinement } from "./refinement";
import { Schema } from "../schemas/schema";

export class Refine<T> extends Refinement<T>{

    private _fn : Predicate<T>;

    constructor(fn : Predicate<T> , message : string){
        super(message);
        this._fn = fn;
    }
    public check(value: T): boolean {
       return this._fn(value); 
    }

}
//@ts-ignore
declare module "../schemas/schema.js" {
    interface Schema <T> {
        refine(fn : Predicate<T> , message : string) : this;
    }
}
Schema.prototype.refine = function (fn : Predicate<any> , message : string) {
    this._refinements.push(new Refine(fn,message));
    return this;
}
