import { it, describe, expect } from "vitest";
import { s } from "../src/index.js";

const testSchema = s.array(s.string());

const test = ["today", "there", "is", "a", "test"];

const invalidTest = ["today", 10, "test"];

describe("array-schema", () => {

    describe("parse", () => {

        it("returns the value when given a valid array", () => {
            expect(testSchema.parse(test)).toEqual(test);
        });

        it("throws when given an array with invalid elements", () => {
            expect(() => {
                testSchema.parse(invalidTest);
            }).toThrow();
        });
    });

    describe("tryParse", () => {

        it("returns a successful result when given a valid array", () => {
            expect(testSchema.tryParse(test)).toEqual({
                success: true,
                data: test
            });
        });

        it("returns a failure result when given an array with invalid elements", () => {
            expect(testSchema.tryParse(invalidTest).success).toBe(false);
        });
    });
});
