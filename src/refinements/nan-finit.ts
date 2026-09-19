import { Refinement } from "./refinement";
import { NumberSchema } from "../schemas/number-schema";

export class NumberFinite extends Refinement<number> {

    constructor() {
        super("Number must be finite");
    }

    public check(value: number): boolean {
        return Number.isFinite(value);
    }
}
export class NumberNaN extends Refinement<number> {

    constructor() {
        super("Number must be NaN");
    }

    public check(value: number): boolean {
        return Number.isNaN(value);
    }
}
declare module "../schemas/number-schema.js" {
    interface NumberSchema {
        finite(): this;
        nan(): this;
    }
}

NumberSchema.prototype.finite = function () {
    this._refinements.push(new NumberFinite());
    return this;
};

NumberSchema.prototype.nan = function () {
    this._refinements.push(new NumberNaN());
    return this;
};
