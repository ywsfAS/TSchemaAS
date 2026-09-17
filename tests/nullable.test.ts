import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("NullableSchema", () => {
    it("accepts null", () => {
        const schema = s.string().nullable();

        expect(schema.parse(null)).toBeNull();
    });

    it("accepts valid values from the inner schema", () => {
        const schema = s.string().nullable();

        expect(schema.parse("hello")).toBe("hello");
    });

    it("rejects invalid values from the inner schema", () => {
        const schema = s.string().nullable();

        expect(() => schema.parse(123)).toThrow();
    });

    it("does not treat undefined as null", () => {
        const schema = s.string().nullable();

        expect(() => schema.parse(undefined)).toThrow();
    });

    it("preserves the inner schema validation", () => {
        const schema = s.number().nullable();

        expect(schema.parse(42)).toBe(42);
        expect(() => schema.parse("42")).toThrow();
    });

    it("works with object schemas", () => {
        const schema = s.object({
            name: s.string(),
        }).nullable();

        expect(schema.parse(null)).toBeNull();

        expect(schema.parse({
            name: "Youssef",
        })).toEqual({
            name: "Youssef",
        });
    });

    it("works with array schemas", () => {
        const schema = s.array(s.number()).nullable();

        expect(schema.parse(null)).toBeNull();
        expect(schema.parse([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => schema.parse(["1", "2"])).toThrow();
    });

    it("can be chained with optional", () => {
        const schema = s.string().nullable().optional();

        expect(schema.parse(null)).toBeNull();
        expect(schema.parse(undefined)).toBeUndefined();
        expect(schema.parse("hello")).toBe("hello");
    });
});
