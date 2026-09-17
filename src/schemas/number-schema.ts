import  {Schema} from "./schema.js";
import type {SafeParseResult} from "../types";

export class NumberSchema extends Schema<number> {

    public _parse(value : unknown) : number {
        if(typeof value !== "number"){
            throw new Error("Expected a number");
        }
        return value;
    }

    public _tryParse(value: unknown): SafeParseResult<number> {

        if(typeof value !== "number"){
            return {
                success : false,
                error : new Error("Expected a number")
            }
        }
        return {
            success : true,
            data : value
        };
        
    }
}

