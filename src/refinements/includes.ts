import type { Element } from "../types";
import { Refinement } from "./refinement";
import { ArraySchema } from "../schemas/array-schema";
import { StringSchema } from "../schemas/string-schema";


export class StringIncludes extends Refinement<string> {
    private readonly _value: string;

    constructor(v: string) {
        super(`String must include ${v}`);
        this._value = v;
    }

    public check(value: string): boolean {
        return this.isIncluded(value);
    }

    private isIncluded(value: string): boolean {
        return value.includes(this._value);
    }
}


export class ArrayIncludes<
    T extends any[],
    C extends T | Element<T>
> extends Refinement<T> {

    private readonly _value: C;

    constructor(v: C) {
        super(`Sequence must include ${v}`);
        this._value = v;
    }

    public check(value: T): boolean {
        return this.isIncluded(value);
    }

    private isElement(value: C): value is Element<T> {
        return !Array.isArray(value);
    }

    private includesElement(value: T): boolean {
        return value.includes(this._value as Element<T>);
    }

    private includesSequence(value: T): boolean {
        if (this._value.length > value.length) {
            return false;
        }

        const sequence = this._value as T;

        return value.some((_, index) =>
            index + sequence.length <= value.length &&
            sequence.every(
                (element, sequenceIndex) =>
                    element === value[index + sequenceIndex]
            )
        );
    }

    private isIncluded(value: T): boolean {
        if (this.isElement(this._value)) {
            return this.includesElement(value);
        }

        return this.includesSequence(value);
    }
}


// @ts-ignore
declare module "../schemas/array-schema.js" {
    interface ArraySchema<T> {
        includes(m: any): this;
    }
}

declare module "../schemas/string-schema.js" {
    interface StringSchema {
        includes(m: string): this;
    }
}


ArraySchema.prototype.includes = function (m: any) {
    this._refinements.push(new ArrayIncludes(m));
    return this;
};

StringSchema.prototype.includes = function (m: string) {
    this._refinements.push(new StringIncludes(m));
    return this;
};
