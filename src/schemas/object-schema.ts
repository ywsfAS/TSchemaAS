import type { SafeParseResult, SchemaObjectShape  , InferObjectSchemaType} from "../types";
import {Schema} from "./schema.js";

export class ObjectSchema<S extends SchemaObjectShape> extends Schema<InferObjectSchemaType<S>> {

    private _object : S;
    constructor(obj : S){
        super();
        this._object = obj;
    }
    private checkObj(obj : unknown) : obj is Object {
        if(typeof obj !== "object" || obj === null){
            return false;
        }
        return true;
    }

    parse(obj: unknown): InferObjectSchemaType<S> {
        if(!this.checkObj(obj)){
            throw new Error("The type is incompatible with Object");
        }
        const record = obj as Record<string,any>;
        for(const [k ,s] of Object.entries(this._object)){
            if(!Object.hasOwn(record,k)){
                throw new Error("The type is incompatible");
            }
            try {
               s.parse(record[k]);
            }catch(err){
                throw new Error(`failed to parse property ${k} in object ${record}`)
            }
        }

        return record as InferObjectSchemaType<S>;
    }

    tryParse(obj: unknown): SafeParseResult<InferObjectSchemaType<S>> {
        if(!this.checkObj(obj)){
            return {
                success : false,
                error : new Error(`The type is incompatible with Object`)
            }
        }
        const record = obj as Record<string,any>;
        for(const [k ,s] of Object.entries(this._object)){
            if(!Object.hasOwn(record,k)){
                return {
                    success : false,
                    error : new Error("The object type is incompatible with the schema")
                }
            }
            const result = s.tryParse(record[k]);
            if(!result.success){
                return {
                    success : false,
                    error : new Error(`failed to parse property ${k} in object ${record}`)
                }
            }
        }

        return {
            success : true,
            data : record as InferObjectSchemaType<S>
        };
        
    }


}



