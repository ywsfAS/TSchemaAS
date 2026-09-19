import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("Schema refine", () => {
    it("accepts a value when the predicate returns true", () => {
        const schema = s.number().refine(
            value => value % 2 === 0,
            "Number must be even"
        );

        expect(schema.parse(10)).toBe(10);
    });

    it("rejects a value when the predicate returns false", () => {
        const schema = s.number().refine(
            value => value % 2 === 0,
            "Number must be even"
        );

        expect(() => schema.parse(5)).toThrow("Validation failed");
    });

    it("uses the custom error message", () => {
        const schema = s.string().refine(
            value => value.startsWith("TS"),
            "String must start with TS"
        );

        expect(() => schema.parse("JavaScript"))
            .toThrow("Validation failed");
    });

    it("works with string schemas", () => {
        const schema = s.string().refine(
            value => value.length % 2 === 0,
            "String length must be even"
        );

        expect(schema.parse("test")).toBe("test");
        expect(() => schema.parse("hello")).toThrow();
    });

    it("works with boolean schemas", () => {
        const schema = s.boolean().refine(
            value => value === true,
            "Value must be true"
        );

        expect(schema.parse(true)).toBe(true);
        expect(() => schema.parse(false)).toThrow("Validation failed");
    });

    it("supports multiple refinements", () => {
        const schema = s.number()
            .refine(value => value > 0, "Number must be positive")
            .refine(value => value % 2 === 0, "Number must be even");

        expect(schema.parse(10)).toBe(10);

        expect(() => schema.parse(-2))
            .toThrow("Validation failed");

        expect(() => schema.parse(3))
            .toThrow("Validation failed");
    });

    it("can be chained with built-in refinements", () => {
        const schema = s.number()
            .positive()
            .refine(value => value % 2 === 0, "Number must be even");

        expect(schema.parse(10)).toBe(10);
        expect(() => schema.parse(5)).toThrow("Validation failed");
        expect(() => schema.parse(-2)).toThrow();
    });

    it("tryParse returns success when the predicate passes", () => {
        const schema = s.number().refine(
            value => value > 10,
            "Number must be greater than 10"
        );

        const result = schema.tryParse(20);

        expect(result.success).toBe(true);
    });

    it("tryParse returns failure when the predicate fails", () => {
        const schema = s.number().refine(
            value => value > 10,
            "Number must be greater than 10"
        );

        const result = schema.tryParse(5);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.message).toBe(
                "Validation failed"
            );
        }
    });

    it("does not change the inferred output type", () => {
        const schema = s.number().refine(
            value => value > 0,
            "Number must be positive"
        );

        const value: number = schema.parse(10);

        expect(value).toBe(10);
    });
});
