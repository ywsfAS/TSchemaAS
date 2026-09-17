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
import { MinRefinement } from "./refinements/Min.js";
import { MaxRefinement } from "./refinements/Max.js";


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
}
export namespace s {
    export type infer<T> = inferType<T>;
}
