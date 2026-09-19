import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("DefaultSchema", () => {
    it("returns the default value when input is undefined", () => {
        const schema = s.string().default("guest");

        expect(schema.parse(undefined)).toBe("guest");
    });

    it("returns the provided value when it is defined", () => {
        const schema = s.string().default("guest");

        expect(schema.parse("Youssef")).toBe("Youssef");
    });

    it("validates the provided value with the inner schema", () => {
        const schema = s.number().default(0);

        expect(schema.parse(42)).toBe(42);
        expect(() => schema.parse("42")).toThrow();
    });

    it("does not use the default for null", () => {
        const schema = s.string().default("guest");

        expect(() => schema.parse(null)).toThrow();
    });

    it("works with object schemas", () => {
        const schema = s.object({
            name: s.string(),
        }).default({
            name: "Guest",
        });

        expect(schema.parse(undefined)).toEqual({
            name: "Guest",
        });

        expect(schema.parse({
            name: "Youssef",
        })).toEqual({
            name: "Youssef",
        });
    });

    it("works with array schemas", () => {
        const schema = s.array(s.number()).default([]);

        expect(schema.parse(undefined)).toEqual([]);
        expect(schema.parse([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => schema.parse(["1", "2"])).toThrow();
    });

    it("can be chained with optional", () => {
        const schema = s.string().optional().default("guest");

        expect(schema.parse(undefined)).toBe("guest");
        expect(schema.parse("Youssef")).toBe("Youssef");
    });

    it("can be chained with nullable", () => {
        const schema = s.string().nullable().default("guest");

        expect(schema.parse(undefined)).toBe("guest");
        expect(schema.parse(null)).toBeNull();
        expect(schema.parse("Youssef")).toBe("Youssef");
    });
});
