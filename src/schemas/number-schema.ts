import type {Schema} from "./schema";

export class NumberSchema implements Schema<number> {

    public parse(value : unknown) : number {
        if(typeof value !== "number"){
            throw new Error("Expected a number");
        }
        return value;
    }
}

