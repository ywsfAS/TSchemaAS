import type { InferSchemaType, SafeParseResult } from "../types";
import { Schema } from "./schema.js";

export class ArraySchema<T extends Schema<any>> extends Schema<InferSchemaType<T>> {

    private readonly _schema : Schema<T>;
    constructor(s : T){
        super();
        this._schema = s;
    }
    private checkArray(arr : unknown){
        if(!Array.isArray(arr)){
            throw new Error("the type is incomplatible");
        }
    }
    public parse(arr : unknown): InferSchemaType<T> {
       this.checkArray(arr); 
       const list = arr as any[];
       for(let el of list){
            try{
                this._schema.parse(el);
            }
            catch(err){
                throw new Error(`failed to parse element ${el}`,{
                    cause : err
                });
            }
       }
       return list as InferSchemaType<T>; 
    }
    public tryParse(arr : unknown): SafeParseResult<InferSchemaType<T>> {
       this.checkArray(arr); 
       const list = arr as any[];
       for(let el of list){
            const result = this._schema.tryParse(el);
            if(!result.success){
                return {
                    success : false,
                    error :  new Error(`failed to parse element ${el}`)
                }
            }
        }
       return {
           success : true,
           data : list as InferSchemaType<T>
       }; 
        
    }



}
