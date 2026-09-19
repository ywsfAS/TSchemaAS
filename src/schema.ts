import {StringSchema} from "./schemas/string-schema.js";
import {NumberSchema} from "./schemas/number-schema.js";
import {BooleanSchema} from "./schemas/boolean-schema.js";
import {ObjectSchema} from "./schemas/object-schema.js";
import { ArraySchema } from "./schemas/array-schema.js";
import type { SchemaObjectShape , inferType} from "./types.js";
import type { Schema } from "./schemas/schema.js";
import { Optional } from "./modifiers/optional.js";
import { Nullable } from "./modifiers/nullable.js";
import { Default } from "./modifiers/default.js";
import { MinRefinement } from "./refinements/min.js";
import { MaxRefinement } from "./refinements/max.js";
import { Regex } from "./refinements/regex.js";
import { Email } from "./refinements/email.js";
import {Url} from "./refinements/url.js";
import { Negative , Positive } from "./refinements/positive-negative.js";
import { Refine } from "./refinements/refine.js";
import { StringStartsWith , ArrayStartsWith } from "./refinements/startswith.js";
import { StringEndsWith , ArrayEndsWith} from "./refinements/endsWith.js";
import { StringIncludes , ArrayIncludes } from "./refinements/includes.js";
import { NumberNaN , NumberFinite } from "./refinements/nan-finit.js";
import { Lazy } from "./schemas/lazy-schema.js";


export const s = {
    string(){
        return new StringSchema();
    },
    number(){
        return new NumberSchema();
    },
    boolean(){
        return new BooleanSchema();
    },
    object(obj : SchemaObjectShape){
        return new ObjectSchema(obj);
    },
    array<T extends Schema<any>>(s : T){
        return new ArraySchema(s);
    },
    lazy<T>(fn : () => Schema<T>){
        return new Lazy(fn);
    }
}
export namespace s {
    export type infer<T> = inferType<T>;
}
