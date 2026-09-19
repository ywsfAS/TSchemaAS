import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("String min and max", () => {
    it("accepts a string equal to the minimum length", () => {
        const schema = s.string().min(3);

        expect(schema.parse("abc")).toBe("abc");
    });

    it("accepts a string longer than the minimum", () => {
        const schema = s.string().min(3);

        expect(schema.parse("hello")).toBe("hello");
    });

    it("rejects a string shorter than the minimum", () => {
        const schema = s.string().min(3);

        expect(() => schema.parse("ab")).toThrow();
    });

    it("accepts a string equal to the maximum length", () => {
        const schema = s.string().max(5);

        expect(schema.parse("hello")).toBe("hello");
    });

    it("accepts a string shorter than the maximum", () => {
        const schema = s.string().max(5);

        expect(schema.parse("hi")).toBe("hi");
    });

    it("rejects a string longer than the maximum", () => {
        const schema = s.string().max(5);

        expect(() => schema.parse("hello!")).toThrow();
    });

    it("supports min and max together", () => {
        const schema = s.string()
            .min(3)
            .max(5);

        expect(schema.parse("abc")).toBe("abc");
        expect(schema.parse("hello")).toBe("hello");

        expect(() => schema.parse("ab")).toThrow();
        expect(() => schema.parse("hello!")).toThrow();
    });
});

describe("Number min and max", () => {
    it("accepts a number equal to the minimum", () => {
        const schema = s.number().min(10);

        expect(schema.parse(10)).toBe(10);
    });

    it("accepts a number greater than the minimum", () => {
        const schema = s.number().min(10);

        expect(schema.parse(20)).toBe(20);
    });

    it("rejects a number less than the minimum", () => {
        const schema = s.number().min(10);

        expect(() => schema.parse(9)).toThrow();
    });

    it("accepts a number equal to the maximum", () => {
        const schema = s.number().max(100);

        expect(schema.parse(100)).toBe(100);
    });

    it("accepts a number less than the maximum", () => {
        const schema = s.number().max(100);

        expect(schema.parse(50)).toBe(50);
    });

    it("rejects a number greater than the maximum", () => {
        const schema = s.number().max(100);

        expect(() => schema.parse(101)).toThrow();
    });

    it("supports min and max together", () => {
        const schema = s.number()
            .min(10)
            .max(100);

        expect(schema.parse(10)).toBe(10);
        expect(schema.parse(50)).toBe(50);
        expect(schema.parse(100)).toBe(100);

        expect(() => schema.parse(9)).toThrow();
        expect(() => schema.parse(101)).toThrow();
    });
    it("supports min and max together for arrays", () => {

        const schema = s.array(s.number())
        .min(10)
        .max(20);

        const validArr = new Array(15).fill(67);
        const invalidArr = new Array(5).fill(10);

        expect(schema.parse(validArr)).toEqual(validArr);
        expect(() => schema.parse(invalidArr)).throws();

    })
});
