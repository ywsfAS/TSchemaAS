import {StringSchema} from "./schemas/string-schema.js";
import {NumberSchema} from "./schemas/number-schema.js";
import {BooleanSchema} from "./schemas/boolean-schema.js";
import {ObjectSchema} from "./schemas/object-schema.js";
import type { SchemaObjectShape } from "./types.js";


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
    }
}
