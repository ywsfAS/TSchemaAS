import type { ErrorSchema } from "../errors/error-schema";
import { Schema } from "../schemas/schema";
import type { inferType, InternalResult, Path} from "../types";

export class Nullable<T extends Schema<any>> extends Schema<inferType<T> | null> {

    private _object : T;
    constructor(s : T){
        super();
        this._object = s;
    }
    public _tryParse(value: unknown , errors : ErrorSchema,path : Path): InternalResult<inferType<T> | null> {
        if(value === null) return {success : true , data : value};
        this.runRefinements(value as inferType<T> , errors , path);
        return this._object._tryParse(value,errors,path);
    }

}
//@ts-ignore
declare module "../schemas/schema.js" {
  interface Schema<T> {
    nullable(): Nullable<this>;
  }
}
Schema.prototype.nullable = function (){
    return new Nullable(this);
};
