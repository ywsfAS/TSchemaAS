
import { Refinement } from "./refinement.js";
import { NumberSchema } from "../schemas/number-schema.js";
import { StringSchema } from "../schemas/string-schema.js";
import { ArraySchema } from "../schemas/array-schema.js";

export abstract class MaxRefinement<T,C> extends Refinement<T> {

    protected abstract max_value : C;
    protected abstract CompareTo(value : T) : boolean;
    public check(value : T): boolean {
        return this.CompareTo(value);
    }
}
export class MaxNumber extends MaxRefinement<number,number> {
    protected max_value ;
    constructor(max : number){
        super(`value Cannot be greater than ${max}`);
        this.max_value = max;
    }

    protected CompareTo(value: number): boolean {
        return value <= this.max_value; 
    }

}
export class MaxString extends MaxRefinement<string,number> {

    protected max_value ;
    constructor(max : number){
        super(`string length cannot be longer than ${max} character`);
        this.max_value = max;
    }
    protected CompareTo(value: string): boolean {
        return value.length <= this.max_value; 
    }
}
export class MaxArray extends MaxRefinement<any[],number> {

    protected max_value ;
    constructor(max : number){
        super(`array length cannot be longer than ${max} character`);
        this.max_value = max;
    }
    protected CompareTo(arr: any[]): boolean {
        return arr.length <= this.max_value; 
    }
}
//@ts-ignore
declare module "../schemas/number-schema.js" {
  interface NumberSchema {
    max(n : number): this;
  }
};
declare module "../schemas/string-schema.js" {
  interface StringSchema{
    max(n : number): this;
  }
}
declare module "../schemas/array-schema.js" {
  interface ArraySchema<T>{
    max(n : number): this;
  }
}
ArraySchema.prototype.max = function (m : number){
    this._refinements.push(new MaxArray(m));
    return this;
}
NumberSchema.prototype.max = function (m : number){
    this._refinements.push(new MaxNumber(m))
    return this;
};
StringSchema.prototype.max = function (n : number){
    this._refinements.push(new MaxString(n));
    return this;
}
