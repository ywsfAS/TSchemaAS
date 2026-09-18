import type { ErrorSchema } from "./errors/error-schema";
import type { Optional } from "./modifiers/optional";
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
export type Picked<T,K extends Partial<Record<keyof T,boolean>>> = {
   [P in keyof K as K[P] extends true ? P : never ] : P extends keyof T ? T[P] : never;
}
export type Omited<T,K extends Partial<Record<keyof T,boolean>>> = {
   [P in keyof K as K[P] extends true ? never : P ] : P extends keyof T ? T[P] : never;
}
export type PartialSchema<T extends SchemaObjectShape> = {
    [k in keyof T] : Optional<T[k]>;
}
export type InternalResult<T> = { success : true, data : T} | { success : false };
