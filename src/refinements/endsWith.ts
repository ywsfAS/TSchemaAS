import type { Element } from "../types.js";
import { Refinement } from "./refinement.js";
import { ArraySchema } from "../schemas/array-schema.js";
import { StringSchema } from "../schemas/string-schema.js";


export class StringEndsWith extends Refinement<string> {
    private readonly _suffix: string;

    constructor(s: string) {
        super(`String must end with ${s}`);
        this._suffix = s;
    }

    public check(value: string): boolean {
        return this.isSuffix(value);
    }

    private isSuffix(value: string): boolean {
        return value.endsWith(this._suffix);
    }
}


export class ArrayEndsWith<
    T extends any[],
    C extends T | Element<T>
> extends Refinement<T> {

    private readonly _suffix: C;

    constructor(s: C) {
        super(`Sequence must end with ${s}`);
        this._suffix = s;
    }

    public check(value: T): boolean {
        return this.isSuffix(value);
    }

    private isElement(value: C): value is Element<T> {
        return !Array.isArray(value);
    }

    private endsWithElement(value: T): boolean {
        return value[value.length - 1] === this._suffix;
    }

    private endsWithSequence(value: T): boolean {
        if (this._suffix.length > value.length) {
            return false;
        }

        const start = value.length - this._suffix.length;

        return (this._suffix as T).every(
            (element, index) => element === value[start + index]
        );
    }

    private isSuffix(value: T): boolean {
        if (this.isElement(this._suffix)) {
            return this.endsWithElement(value);
        }

        return this.endsWithSequence(value);
    }
}


// @ts-ignore
declare module "../schemas/array-schema.js" {
    interface ArraySchema<T> {
        endsWith(m: any): this;
    }
}

declare module "../schemas/string-schema.js" {
    interface StringSchema {
        endsWith(m: string): this;
    }
}


ArraySchema.prototype.endsWith = function (m: any) {
    this._refinements.push(new ArrayEndsWith(m));
    return this;
};

StringSchema.prototype.endsWith = function (m: string) {
    this._refinements.push(new StringEndsWith(m));
    return this;
};
