import  {Schema} from "./schema.js";
import type {SafeParseResult}  from "../types";

export class BooleanSchema extends Schema<boolean>{

    public parse(value : unknown) : boolean {

        if(typeof value !== "boolean"){
            throw new Error("Expected a boolean");
        }

        return value;
    }

    public tryParse(value : unknown) : SafeParseResult<boolean>{
        
        if(typeof value !== "boolean"){

            return {
                success : false,
                error : Error("Expected a boolean")
            }
        }

        return {
            success : true,
            data : value
        };

    }

}
