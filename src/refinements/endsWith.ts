import type { Element, InferSchemaType } from "../types.js";
import { Refinement } from "./refinement.js";
import { ArraySchema } from "../schemas/array-schema.js";
import { StringSchema } from "../schemas/string-schema.js";
import { Schema } from "../schemas/schema.js";

/**
 * Refinement that requires a string to end with a specified suffix.
 */
export class StringEndsWith extends Refinement<string> {
    private readonly _suffix: string;

    /**
    * Creates a string suffix refinement.
    *
    * @param s The suffix that the string must end with.
    */
    constructor(s: string) {
        super(`String must end with ${s}`);
        this._suffix = s;
    }
    /**
    * Checks whether the string ends with the required suffix.
    *
    * @param value The string to validate.
    * @returns `true` if the string ends with the suffix; otherwise, `false`.
    */
    public check(value: string): boolean {
        return this.isSuffix(value);
    }

    private isSuffix(value: string): boolean {
        return value.endsWith(this._suffix);
    }
}

/**
 * Refinement that requires an array to end with a specified element
 * or sequence of elements.
 */
export class ArrayEndsWith<
    T extends any[],
    C extends T | Element<T>
> extends Refinement<T> {

    private readonly _suffix: C;

    /**
    * Creates an array suffix refinement.
    *
    * @param s The element or sequence that the array must end with.
    */
    constructor(s: C) {
        super(`Sequence must end with ${s}`);
        this._suffix = s;
    }

    /**
    * Checks whether the array ends with the required element or sequence.
    *
    * @param value The array to validate.
    * @returns `true` if the array ends with the specified suffix;
    * otherwise, `false`.
    */
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
        /**
        * Requires the array to end with the specified value or sequence.
        *
        * @param m Element or sequence that must appear at the end of the array.
        * @returns The current schema with suffix validation.
        */
        endsWith(m: InferSchemaType<T> | InferSchemaType<T>[]): this;
    }
}

declare module "../schemas/string-schema.js" {
    interface StringSchema {
        /**
        * Requires the string to end with the specified suffix.
        *
        * @param m Suffix that must appear at the end of the string.
        * @returns The current schema with suffix validation.
        */
        endsWith(m: string): this;
    }
}


ArraySchema.prototype.endsWith = function<T extends Schema<any>> (m: InferSchemaType<T> | InferSchemaType<T>[]) {
    this._refinements.push(new ArrayEndsWith(m));
    return this;
};

StringSchema.prototype.endsWith = function (m: string) {
    this._refinements.push(new StringEndsWith(m));
    return this;
};
