import { Refinement } from "./refinement";
import { NumberSchema } from "../schemas/number-schema";

export class Positive extends Refinement<number> {

    constructor(){
        super("Number must be positive");
    }
    public check(value: number): boolean {
        return value > 0;
    }
}
export class Negative extends Refinement<number> {

    constructor(){
        super("Number must be negative");
    }
    public check(value: number): boolean {
        return value < 0;
    }
}
//@ts-ignore
declare module "../schemas/number-schema.js" {
    interface NumberSchema{
        positive() : this;
        negative() : this;
    }
}
NumberSchema.prototype.positive = function () {
    this._refinements.push(new Positive());
    return this;
}
NumberSchema.prototype.negative = function () {
    this._refinements.push(new Negative());
    return this;
}
