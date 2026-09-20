import type { ErrorSchema } from "../errors/error-schema.js";
import type {  SchemaObjectShape  , InferObjectSchemaType, Path, InternalResult, Picked, Omited, PartialSchema} from "../types.js";
import {Schema} from "./schema.js";

/**
 * Schema that validates objects according to a defined property shape.
 *
 * Each property in the shape is validated using its corresponding schema.
 * Validation errors include the property path where they occurred.
 *
 * @typeParam S The schema shape describing the object's properties.
 */
export class ObjectSchema<S extends SchemaObjectShape> extends Schema<InferObjectSchemaType<S>> {

    private _object : S;
    /**
    * Creates an object schema from a property shape.
    *
    * @param obj Object whose properties define the schemas used to validate
    * each corresponding property.
    */
    constructor(obj : S){
        super();
        this._object = obj;
    }
    /**
    * Checks whether a value is a non-null object.
    *
    * @param obj The value to check.
    * @returns `true` if the value is a non-null object; otherwise, `false`.
    */
    private checkObj(obj : unknown) : obj is Object {
        if(typeof obj !== "object" || obj === null){
            return false;
        }
        return true;
    }
    /**
    * Gets the schemas that define the object's properties.
    *
    * @returns The schema shape used by this object schema.
    */
    public get shape(){
        return this._object;
    }
    public _tryParse(obj: unknown , errors : ErrorSchema , path : Path): InternalResult<InferObjectSchemaType<S>>{
        if (!this.checkObj(obj)) {
            errors.addIssue({
                path,
                message: "Expected an object",
                code: "invalid_type"
            });

        return { success: false };
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
    /**
    * Creates a new object schema containing only the selected properties.
    *
    * @param obj Object whose keys indicate the properties to keep.
    * @returns A new object schema containing the selected properties.
    */
    public pick<K extends Partial<Record<keyof S , boolean>>>(obj : K) : ObjectSchema<Picked<S,K>>  {

        const pickedObj : SchemaObjectShape = {};
        for(const [p,v] of Object.entries(this._object)){
            if(Object.hasOwn(obj,p)){
                pickedObj[p] = v;
            }
        }
        return new ObjectSchema(pickedObj as Picked<S,K>);
        
    }
    /**
    * Creates a new object schema without the selected properties.
    *
    * @param obj Object whose keys indicate the properties to remove.
    * @returns A new object schema containing all properties except those selected.
    */
    public omit<K extends Partial<Record<keyof S, boolean>>>(obj : K) : ObjectSchema<Omited<S,K>>{

        const omitedObj : SchemaObjectShape = {};
        for(const [p,v] of Object.entries(this._object)){
            if(!Object.hasOwn(obj,p)){
                omitedObj[p] = v;
            }
        }
        return new ObjectSchema(omitedObj as Omited<S,K>);
    }
    /**
    * Creates a new object schema where all properties are optional.
    *
    * @returns A new object schema with optional properties.
    */
    public partial<K extends Partial<S>>() : ObjectSchema<PartialSchema<S>>{

        const partialObj : SchemaObjectShape = {};
        for(const [p,v] of Object.entries(this._object)){
                partialObj[p] = v.optional();
        }
        return new ObjectSchema(partialObj as PartialSchema<S>);
    
    }
    /**
    * Creates a new object schema by adding or replacing properties.
    *
    * If a property already exists in the current schema, the schema
    * provided by `obj` replaces it.
    *
    * @param obj Additional property schemas to add or replace.
    * @returns A new object schema containing the original and extended properties.
    */
    public extend<E extends SchemaObjectShape>(obj : E) : ObjectSchema<E & S>{
        const extendedObj : SchemaObjectShape = {...this._object,...obj};
        return new ObjectSchema(extendedObj as E & S);
    }


}



