import type { Schema } from "./schemas/schema";

export type SafeParseResult<T> = {success : true , data : T} | {success : false , error : Error};
export type SchemaObjectShape = Record<string,Schema<any>>;
export type InferSchemaType<T extends Schema<any>> = T extends Schema<infer S> ? S : never;
export type InferObjectSchemaType<S extends SchemaObjectShape> = {
    [k in keyof S] : InferSchemaType<S[k]>
};
