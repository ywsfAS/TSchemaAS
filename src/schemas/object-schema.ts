import type { ErrorSchema } from "../errors/error-schema";
import type {  SchemaObjectShape  , InferObjectSchemaType, Path, InternalResult, Picked} from "../types";
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
    public _tryParse(obj: unknown , errors : ErrorSchema , path : Path): InternalResult<InferObjectSchemaType<S>>{
        if(!this.checkObj(obj)){
            errors.addIssue({
                path : path,
                message : "The type is incompatible with Object",
                code : ""
            });
            return { success : false };
        }
        const record = obj as Record<string,any>;
        let success = true;
        for(const [k ,s] of Object.entries(this._object)){
            if(!Object.hasOwn(record,k)){
                errors.addIssue({
                    path : path,
                    message : `The property ${k} doesnt exist in the schema`,
                    code : "",
                })
            }
            const result = s._tryParse(record[k],errors,[...path,k]);
            if(!result.success){
                success = false;
            }
        }
        if(!success) return {success : false};
        this.runRefinements(record as InferObjectSchemaType<S>,errors,path);

        return {
            success : true,
            data : record as InferObjectSchemaType<S>
        }
        
    }
    public pick<K extends Partial<Record<keyof S , boolean>>>(obj : K) : ObjectSchema<Picked<S,K>>  {

        const pickedObj : Record<string ,any>= {};
        for(const [p,v] of Object.entries(this._object)){
            if(Object.hasOwn(obj,p)){
                pickedObj[p] = v;
            }
        }
        return new ObjectSchema(pickedObj as Picked<S,K>);
        
    }


}



