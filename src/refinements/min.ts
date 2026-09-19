import { Refinement } from "./refinement";
import { NumberSchema } from "../schemas/number-schema";
import { StringSchema } from "../schemas/string-schema";
import { ArraySchema } from "../schemas/array-schema";


export abstract class MinRefinement<T,C> extends Refinement<T> {

    protected abstract min_value : C;
    protected abstract CompareTo(value : T) : boolean;
    public check(value : T): boolean {
        return this.CompareTo(value);
    }
}
export class MinNumber extends MinRefinement<number,number> {
    protected min_value ;
    constructor(min : number){
        super(`value Cannot be less than ${min}`);
        this.min_value = min;
    }

    protected CompareTo(value: number): boolean {
        return value >= this.min_value; 
    }

}
export class MinString extends MinRefinement<string,number> {

    protected min_value ;
    constructor(min : number){
        super(`string length cannot be shorter than ${min} character`);
        this.min_value = min;
    }
    protected CompareTo(value: string): boolean {
        return value.length >= this.min_value; 
    }
}
export class MinArray extends MinRefinement<any[],number>{
    protected min_value: number;
    constructor(min : number){
        super(`array length cannot be shorter than ${min} character`);
        this.min_value = min;
    }
    protected CompareTo(arr: any[]): boolean {
        return arr.length >= this.min_value; 
    }
}


//@ts-ignore
declare module "../schemas/number-schema.js" {
  interface NumberSchema {
    min(n : number): this;
  }
};
declare module "../schemas/string-schema.js" {
  interface StringSchema{
    min(n : number): this;
  }
}
declare module "../schemas/array-schema.js" {
  interface ArraySchema<T> {
    min(n : number): this;
  }
}
ArraySchema.prototype.min = function (m : number) {
    this._refinements.push(new MinArray(m));
    return this;
}
NumberSchema.prototype.min = function (m : number){
    this._refinements.push(new MinNumber(m))
    return this;
};
StringSchema.prototype.min = function (n : number){
    this._refinements.push(new MinString(n));
    return this;
}
