import type {Schema} from "./schema";

export class BooleanSchema implements Schema<boolean>{

    public parse(value : unknown) : boolean {
        if(typeof value !== "boolean"){
            throw new Error("Expected a boolean");
        }
        return value;
    }

}
