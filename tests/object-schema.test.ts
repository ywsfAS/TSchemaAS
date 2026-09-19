import { it, describe, expect } from "vitest";
import { s } from "../src/index.js";

const testSchema = s.object({
    name: s.string(),
    id: s.number(),
    notes: s.array(s.string())
});

const test = {
    name: "test",
    id: 20,
    notes: ["today", "there", "is", "a", "test"]
};

const invalidTest = {
    name: "test",
    id: 20,
    notes: "nothing"
};

describe("object-schema", () => {

    describe("parse", () => {

        it("returns the value when given a valid object", () => {
            expect(testSchema.parse(test)).toEqual(test);
        });

        it("throws when given an invalid object", () => {
            expect(() => {
                testSchema.parse(invalidTest);
            }).toThrow();
        });
    });

    describe("tryParse", () => {

        it("returns a successful result when given a valid object", () => {
            expect(testSchema.tryParse(test)).toEqual({
                success: true,
                data: test
            });
        });

        it("returns a failure result when given an invalid object", () => {
            expect(testSchema.tryParse(invalidTest).success).toBe(false);
        });
    });
});
