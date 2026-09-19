import type { Element} from "../types";
import { Refinement } from "./refinement";
import { ArraySchema } from "../schemas/array-schema";
import { StringSchema } from "../schemas/string-schema";



export class StringStartsWith extends Refinement<string>{
    private readonly _prefix : string;

    constructor(p : string){
        super(`String must starts with ${p}`);
        this._prefix = p;
    }
    public check(value: string): boolean {
       return this.isPrefix(value); 
    }

    private isPrefix(value : string) : boolean {
        return value.startsWith(this._prefix);
    }

}
export class ArrayStartsWith<T extends any[],C extends (T | Element<T>)> extends Refinement<T> {

    private readonly _prefix : C;
    constructor(p : C){
        super(`Sequence must starts with ${p}`);
        this._prefix = p;
    }

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
    startsWith(m : any): this;
  }
}
declare module "../schemas/string-schema.js" {
  interface StringSchema{
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

