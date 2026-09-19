import type { ErrorSchema } from "../errors/error-schema.js";
import { Schema } from "../schemas/schema.js";
import type { InferSchemaType, inferType, InternalResult, Path} from "../types";

export class Default<T extends Schema<any>> extends Schema<inferType<T>>{

    private _object : T;
    private _d : inferType<T>;

    constructor(s : T, d : inferType<T>){
        super();
        this._object = s;
        this._d = d;
    }

    public _tryParse(value: unknown, errors : ErrorSchema,path : Path): InternalResult<inferType<T>> {
       const modifiedValue = value === undefined ? this._d : value;
       this.runRefinements(modifiedValue as inferType<T>,errors,path);
       return this._object._tryParse(modifiedValue,errors ,path); 
    }


}
//@ts-ignore
declare module "../schemas/schema.js" {
  interface Schema<T> {
    default(d : T): Default<this>;
  }
}
Schema.prototype.default = function (d : any){
    return new Default(this,d);
};
