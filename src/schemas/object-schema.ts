import type { ErrorSchema } from "../errors/error-schema";
import type {  SchemaObjectShape  , InferObjectSchemaType, Path, InternalResult, Picked, Omited, PartialSchema} from "../types";
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
    public get shape(){
        return this._object;
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

        const pickedObj : SchemaObjectShape = {};
        for(const [p,v] of Object.entries(this._object)){
            if(Object.hasOwn(obj,p)){
                pickedObj[p] = v;
            }
        }
        return new ObjectSchema(pickedObj as Picked<S,K>);
        
    }
    public omit<K extends Partial<Record<keyof S, boolean>>>(obj : K) : ObjectSchema<Omited<S,K>>{

        const omitedObj : SchemaObjectShape = {};
        for(const [p,v] of Object.entries(this._object)){
            if(!Object.hasOwn(obj,p)){
                omitedObj[p] = v;
            }
        }
        return new ObjectSchema(omitedObj as Omited<S,K>);
    }
    public partial<K extends Partial<S>>() : ObjectSchema<PartialSchema<S>>{

        const partialObj : SchemaObjectShape = {};
        for(const [p,v] of Object.entries(this._object)){
                partialObj[p] = v.optional();
        }
        return new ObjectSchema(partialObj as PartialSchema<S>);
    
    }
    public extend<E extends SchemaObjectShape>(obj : E) : ObjectSchema<E & S>{
        const extendedObj : SchemaObjectShape = {...this._object,...obj};
        return new ObjectSchema(extendedObj as E & S);
    }


}



