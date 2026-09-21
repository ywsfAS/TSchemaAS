// Package entry point.
import "./modifiers/optional.js";
import "./modifiers/nullable.js";
import "./modifiers/default.js";

import "./refinements/min.js";
import "./refinements/max.js";
import "./refinements/regex.js";
import "./refinements/email.js";
import "./refinements/url.js";
import "./refinements/positive-negative.js";
import "./refinements/refine.js";
import "./refinements/startswith.js";
import "./refinements/endsWith.js";
import "./refinements/includes.js";
import "./refinements/nan-finit.js";
import {StringSchema} from "./schemas/string-schema.js";
import {NumberSchema} from "./schemas/number-schema.js";
import {BooleanSchema} from "./schemas/boolean-schema.js";
import {ObjectSchema} from "./schemas/object-schema.js";
import { ArraySchema } from "./schemas/array-schema.js";
import type {  Literal, SchemaObjectShape , inferType} from "./types.js";
import type { Schema } from "./schemas/schema.js";
import { Lazy } from "./schemas/lazy-schema.js";
import { LiteralSchema } from "./schemas/literal-schema.js";
import { EnumSchema } from "./schemas/enums-schema.js";
import { UnionSchema } from "./schemas/union-schema.js";

export const s = {
    /**
    * Creates a schema that validates string values.
    *
    * @returns A string schema.
    */
    string(){
        return new StringSchema();
    },
    /**
    * Creates a schema that validates number values.
    *
    * @returns A number schema.
    */
    number(){
        return new NumberSchema();
    },
    /**
    * Creates a schema that validates boolean values.
    *
    * @returns A boolean schema.
    */
    boolean(){
        return new BooleanSchema();
    },
    /**
    * Creates an object schema from a shape of property schemas.
    *
    * Each property is validated using its corresponding schema.
    *
    * @param obj Object containing the schemas for each property.
    * @returns An object schema.
    */
    object<T extends SchemaObjectShape>(obj : T){
        return new ObjectSchema(obj);
    },
      /**
    * Creates an array schema that validates each element using the provided schema.
    *
    * @param s Schema used to validate every array element.
    * @returns An array schema.
    */
    array<T extends Schema<any>>(s : T){
        return new ArraySchema(s);
    },
      /**
   * Creates a schema whose definition is evaluated lazily.
   *
   * Useful for recursive or circular schemas where a schema
   * needs to reference itself during its definition.
   *
   * @param fn Function that returns the schema when it is evaluated.
   * @returns A lazy schema.
   */
    lazy<T>(fn : () => Schema<T>){
        return new Lazy(fn);
    },
      /**
    * Creates a schema that only accepts the specified literal value.
    *
    * @param l Literal value that the input must exactly match.
    * @returns A literal schema.
    */
    literal<T extends string | boolean | number>(l : T & Literal<T>){
        return new LiteralSchema(l);
    },
    /**
     * Creates a schema that accepts one of the specified literal values.
     *
     * @param e Array of allowed string, number, or boolean values.
     * @returns An enum schema.
     */
    enum<const T extends readonly (string | boolean | number)[]>(e : T ){
        return new EnumSchema(e);
    },
    /**
    * Creates a schema that accepts a value matching at least one
    * of the provided schemas.
    *
    * @param u Schemas to try when validating the input.
    * @returns A union schema.
    */
    union<T extends Schema<any>[]>(u : T){
        return new UnionSchema(u);
    },



}
export namespace s {
    /**
   * Extracts the TypeScript type represented by a schema.
   *
   * @example
   * type User = s.infer<typeof userSchema>;
   */
    export type infer<T> = inferType<T>;
}
export { Schema } from "./schemas/schema.js";
export type {
  SafeParseResult,
  SchemaObjectShape,
  Issue,
  Path,
} from "./types.js";
export { ErrorSchema } from "./errors/error-schema.js";
