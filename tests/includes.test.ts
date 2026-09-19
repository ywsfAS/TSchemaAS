import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("includes", () => {

    describe("StringSchema", () => {

        it("should accept a string containing the value", () => {
            const schema = s.string().includes("world");

            expect(schema.tryParse("hello world").success).toBe(true);
        });

        it("should reject a string that does not contain the value", () => {
            const schema = s.string().includes("world");

            expect(schema.tryParse("hello there").success).toBe(false);
        });

        it("should accept an exact match", () => {
            const schema = s.string().includes("hello");

            expect(schema.tryParse("hello").success).toBe(true);
        });

        it("should reject when the included value is longer than the string", () => {
            const schema = s.string().includes("hello world");

            expect(schema.tryParse("hello").success).toBe(false);
        });

        it("should be case-sensitive", () => {
            const schema = s.string().includes("World");

            expect(schema.tryParse("hello world").success).toBe(false);
        });

        it("should accept a value appearing in the middle", () => {
            const schema = s.string().includes("lo wo");

            expect(schema.tryParse("hello world").success).toBe(true);
        });
    });


    describe("ArraySchema", () => {

        describe("with an element", () => {

            it("should accept an array containing the element", () => {
                const schema = s.array(s.number()).includes(3);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(true);
            });

            it("should reject an array that does not contain the element", () => {
                const schema = s.array(s.number()).includes(3);

                expect(schema.tryParse([1, 2, 4]).success).toBe(false);
            });

            it("should accept the first element", () => {
                const schema = s.array(s.number()).includes(1);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should accept the last element", () => {
                const schema = s.array(s.number()).includes(3);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should reject an empty array", () => {
                const schema = s.array(s.number()).includes(1);

                expect(schema.tryParse([]).success).toBe(false);
            });
        });


        describe("with a sequence", () => {

            it("should accept a sequence appearing in the array", () => {
                const schema = s.array(s.number()).includes([2, 3]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(true);
            });

            it("should accept a sequence appearing in the middle", () => {
                const schema = s.array(s.number()).includes([2, 3]);

                expect(schema.tryParse([1, 2, 3, 4, 5]).success).toBe(true);
            });

            it("should accept a sequence at the beginning", () => {
                const schema = s.array(s.number()).includes([1, 2]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(true);
            });

            it("should accept a sequence at the end", () => {
                const schema = s.array(s.number()).includes([3, 4]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(true);
            });

            it("should reject a sequence that does not appear", () => {
                const schema = s.array(s.number()).includes([2, 4]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(false);
            });

            it("should reject a non-contiguous sequence", () => {
                const schema = s.array(s.number()).includes([2, 4]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(false);
            });

            it("should accept an exact sequence", () => {
                const schema = s.array(s.number()).includes([1, 2, 3]);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should reject when the sequence is longer than the array", () => {
                const schema = s.array(s.number()).includes([1, 2, 3]);

                expect(schema.tryParse([1, 2]).success).toBe(false);
            });

            it("should accept an empty sequence", () => {
                const schema = s.array(s.number()).includes([]);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });
        });
    });
});
