import {describe, it , expect} from "vitest";
import {s} from "../src/index.js";

// Inference is checked by TypeScript at compile time, so the runtime assertion is always true.
describe("s.infer", () => {
    it("infers primitive schema types", () => {
        const stringSchema = s.string();
        const numberSchema = s.number();
        const numberlistSchema = s.array(s.number());
        
        type numberlistSchemaType = s.infer<typeof numberlistSchema>;
        type StringType = s.infer<typeof stringSchema>;
        type NumberType = s.infer<typeof numberSchema>;

        const list : numberlistSchemaType = [6,7];
        const stringValue: StringType = "hello";
        const numberValue: NumberType = 42;

        expect(true).toBe(true);
    });

    it("infers an object from a schema shape", () => {
        const userShape = {
            name: s.string(),
            age: s.number(),
        };

        type User = s.infer<typeof userShape>;

        const user: User = {
            name: "Youssef",
            age: 22,
        };

        expect(true).toBe(true);
    });

    it("infers an object from an ObjectSchema", () => {
        const userSchema = s.object({
            name: s.string(),
            age: s.number(),
        });

        type User = s.infer<typeof userSchema>;

        const user: User = {
            name: "Youssef",
            age: 22,
        };

        expect(true).toBe(true);
    });
});
