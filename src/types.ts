import type { ErrorSchema } from "./errors/error-schema";
import type { Schema } from "./schemas/schema";

export type SafeParseResult<T> = {success : true , data : T} | {success : false , error : ErrorSchema};
export type SchemaObjectShape = Record<string,Schema<any>>;
export type InferSchemaType<T extends Schema<any>> = T extends Schema<infer S> ? S : never;
export type InferObjectSchemaType<S extends SchemaObjectShape> = {
    [k in keyof S] : InferSchemaType<S[k]>
};
export type inferType<T> = 
    T extends SchemaObjectShape 
        ? InferObjectSchemaType<T> 
        : T extends Schema<any> 
            ? InferSchemaType<T>
            : never;
export type Predicate<T> = (value : T) => boolean;
export type Path = (string | number)[];
export type Issue = {
    path : Path ;
    message : string;
    code : string;

}
export type InternalResult<T> = { success : true, data : T} | { success : false };
