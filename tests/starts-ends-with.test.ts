import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("startsWith", () => {

    describe("StringSchema", () => {

        it("should accept a string starting with the prefix", () => {
            const schema = s.string().startsWith("hello");

            expect(schema.tryParse("hello world").success).toBe(true);
        });

        it("should reject a string that does not start with the prefix", () => {
            const schema = s.string().startsWith("hello");

            expect(schema.tryParse("goodbye world").success).toBe(false);
        });

        it("should accept an exact match", () => {
            const schema = s.string().startsWith("hello");

            expect(schema.tryParse("hello").success).toBe(true);
        });

        it("should reject when the value is shorter than the prefix", () => {
            const schema = s.string().startsWith("hello");

            expect(schema.tryParse("he").success).toBe(false);
        });

        it("should be case-sensitive", () => {
            const schema = s.string().startsWith("Hello");

            expect(schema.tryParse("hello world").success).toBe(false);
        });
    });


    describe("ArraySchema", () => {

        describe("with an element", () => {

            it("should accept an array whose first element matches", () => {
                const schema = s.array(s.number()).startsWith(1);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should reject an array whose first element does not match", () => {
                const schema = s.array(s.number()).startsWith(1);

                expect(schema.tryParse([2, 1, 3]).success).toBe(false);
            });

            it("should accept a single-element array", () => {
                const schema = s.array(s.number()).startsWith(1);

                expect(schema.tryParse([1]).success).toBe(true);
            });

            it("should reject an empty array", () => {
                const schema = s.array(s.number()).startsWith(1);

                expect(schema.tryParse([]).success).toBe(false);
            });
        });


        describe("with a sequence", () => {

            it("should accept an array starting with the sequence", () => {
                const schema = s.array(s.number()).startsWith([1, 2]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(true);
            });

            it("should reject when the sequence does not match", () => {
                const schema = s.array(s.number()).startsWith([1, 2]);

                expect(schema.tryParse([1, 3, 2, 4]).success).toBe(false);
            });

            it("should accept an exact sequence", () => {
                const schema = s.array(s.number()).startsWith([1, 2, 3]);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should reject when the prefix is longer than the array", () => {
                const schema = s.array(s.number()).startsWith([1, 2, 3]);

                expect(schema.tryParse([1, 2]).success).toBe(false);
            });

            it("should accept an empty prefix", () => {
                const schema = s.array(s.number()).startsWith([]);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });
        });
    });
});
describe("endsWith", () => {

    describe("StringSchema", () => {

        it("should accept a string ending with the suffix", () => {
            const schema = s.string().endsWith("world");

            expect(schema.tryParse("hello world").success).toBe(true);
        });

        it("should reject a string that does not end with the suffix", () => {
            const schema = s.string().endsWith("world");

            expect(schema.tryParse("world hello").success).toBe(false);
        });

        it("should accept an exact match", () => {
            const schema = s.string().endsWith("hello");

            expect(schema.tryParse("hello").success).toBe(true);
        });

        it("should reject when the value is shorter than the suffix", () => {
            const schema = s.string().endsWith("hello");

            expect(schema.tryParse("hel").success).toBe(false);
        });

        it("should be case-sensitive", () => {
            const schema = s.string().endsWith("World");

            expect(schema.tryParse("hello world").success).toBe(false);
        });
    });


    describe("ArraySchema", () => {

        describe("with an element", () => {

            it("should accept an array whose last element matches", () => {
                const schema = s.array(s.number()).endsWith(3);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should reject an array whose last element does not match", () => {
                const schema = s.array(s.number()).endsWith(3);

                expect(schema.tryParse([3, 2, 1]).success).toBe(false);
            });

            it("should accept a single-element array", () => {
                const schema = s.array(s.number()).endsWith(3);

                expect(schema.tryParse([3]).success).toBe(true);
            });

            it("should reject an empty array", () => {
                const schema = s.array(s.number()).endsWith(3);

                expect(schema.tryParse([]).success).toBe(false);
            });
        });


        describe("with a sequence", () => {

            it("should accept an array ending with the sequence", () => {
                const schema = s.array(s.number()).endsWith([3, 4]);

                expect(schema.tryParse([1, 2, 3, 4]).success).toBe(true);
            });

            it("should reject when the sequence does not match", () => {
                const schema = s.array(s.number()).endsWith([3, 4]);

                expect(schema.tryParse([1, 3, 2, 4]).success).toBe(false);
            });

            it("should accept an exact sequence", () => {
                const schema = s.array(s.number()).endsWith([1, 2, 3]);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });

            it("should reject when the suffix is longer than the array", () => {
                const schema = s.array(s.number()).endsWith([1, 2, 3]);

                expect(schema.tryParse([2, 3]).success).toBe(false);
            });

            it("should accept an empty suffix", () => {
                const schema = s.array(s.number()).endsWith([]);

                expect(schema.tryParse([1, 2, 3]).success).toBe(true);
            });
        });
    });
});
