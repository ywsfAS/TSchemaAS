import {Schema} from "./schema.js";
import type {SafeParseResult} from "../types";

export class StringSchema extends Schema<string> {

    public parse(value: unknown): string {
        if(typeof value !== "string"){
            throw new Error("Expected a string");
        }
        return value;
    }

    public tryParse(value : unknown) : SafeParseResult<string>{
        if(typeof value !== "string"){
            return {
                success : false ,
                error : new Error("Expected a string")
            };
        }

        return {
            success : true,
            data : value
        }
    }
}
