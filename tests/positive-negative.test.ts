import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("Number positive refinement", () => {
    it("accepts a positive number", () => {
        const schema = s.number().positive();

        expect(schema.parse(10)).toBe(10);
    });

    it("rejects zero", () => {
        const schema = s.number().positive();

        expect(() => schema.parse(0)).toThrow();
    });

    it("rejects a negative number", () => {
        const schema = s.number().positive();

        expect(() => schema.parse(-10)).toThrow();
    });

    it("accepts a positive decimal", () => {
        const schema = s.number().positive();

        expect(schema.parse(0.5)).toBe(0.5);
    });

    it("works with min and max", () => {
        const schema = s.number()
            .positive()
            .min(1)
            .max(100);

        expect(schema.parse(50)).toBe(50);
        expect(() => schema.parse(0)).toThrow();
        expect(() => schema.parse(-1)).toThrow();
        expect(() => schema.parse(101)).toThrow();
    });
});

describe("Number negative refinement", () => {
    it("accepts a negative number", () => {
        const schema = s.number().negative();

        expect(schema.parse(-10)).toBe(-10);
    });

    it("rejects zero", () => {
        const schema = s.number().negative();

        expect(() => schema.parse(0)).toThrow();
    });

    it("rejects a positive number", () => {
        const schema = s.number().negative();

        expect(() => schema.parse(10)).toThrow();
    });

    it("accepts a negative decimal", () => {
        const schema = s.number().negative();

        expect(schema.parse(-0.5)).toBe(-0.5);
    });

    it("works with min and max", () => {
        const schema = s.number()
            .negative()
            .min(-100)
            .max(-1);

        expect(schema.parse(-50)).toBe(-50);
        expect(() => schema.parse(0)).toThrow();
        expect(() => schema.parse(1)).toThrow();
        expect(() => schema.parse(-101)).toThrow();
    });
});
