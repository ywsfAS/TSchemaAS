import type { Element } from "../types.js";
import { Refinement } from "./refinement.js";
import { ArraySchema } from "../schemas/array-schema.js";
import { StringSchema } from "../schemas/string-schema.js";

/**
 * Refinement that requires a string to contain a specified substring.
 */
export class StringIncludes extends Refinement<string> {
    private readonly _value: string;

    /**
    * Creates a string inclusion refinement.
    *
    * @param v The substring that the string must contain.
    */
    constructor(v: string) {
        super(`String must include ${v}`);
        this._value = v;
    }
    /**
     * Checks whether the string contains the required substring.
     *
     * @param value The string to validate.
     * @returns `true` if the string contains the substring;
     * otherwise, `false`.
     */
    public check(value: string): boolean {
        return this.isIncluded(value);
    }

    private isIncluded(value: string): boolean {
        return value.includes(this._value);
    }
}

/**
 * Refinement that requires an array to contain a specified element
 * or sequence of elements.
 */
export class ArrayIncludes<
    T extends any[],
    C extends T | Element<T>
> extends Refinement<T> {

    private readonly _value: C;

    /**
    * Creates an array inclusion refinement.
    *
    * @param v The element or sequence that the array must contain.
    */
    constructor(v: C) {
        super(`Sequence must include ${v}`);
        this._value = v;
    }

    /**
    * Checks whether the array contains the required element or sequence.
    *
    * @param value The array to validate.
    * @returns `true` if the array contains the specified element or sequence;
    * otherwise, `false`.
    */
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
        /**
        * Requires the array to contain the specified value or sequence.
        *
        * @param m Value that must be present in the array.
        * @returns The current schema with inclusion validation.
        */
        includes(m: any): this;
    }
}

declare module "../schemas/string-schema.js" {
    interface StringSchema {
        /**
         * Requires the string to contain the specified substring.
         *
         * @param m Substring that must be present in the string.
         * @returns The current schema with substring inclusion validation.
         */
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
