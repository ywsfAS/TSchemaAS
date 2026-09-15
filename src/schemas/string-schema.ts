import type {Schema} from "./schema";

export class StringSchema implements Schema<string> {
    public parse(value: unknown): string {
        if(typeof value !== "string"){
            throw new Error("Expected a string");
        }
        return value;
    }
}
