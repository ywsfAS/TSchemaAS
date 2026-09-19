import { describe, expect, test } from "vitest";
import { s } from "../src/index.js";

describe("OptionalSchema", () => {
    test("accepts undefined", () => {
        const schema = s.number().optional();

        expect(schema.parse(undefined)).toBeUndefined();
    });

    test("accepts a valid value for the inner schema", () => {
        const schema = s.number().optional();

        expect(schema.parse(42)).toBe(42);
    });

    test("rejects an invalid value for the inner schema", () => {
        const schema = s.number().optional();

        expect(() => schema.parse("42")).toThrow();
    });

    test("preserves the inner schema validation", () => {
        const schema = s.string().optional();

        expect(schema.parse("hello")).toBe("hello");
        expect(schema.parse(undefined)).toBeUndefined();
        expect(() => schema.parse(123)).toThrow();
    });

    test("works with an object schema", () => {
        const schema = s.object({
            name: s.string(),
            age: s.number(),
        }).optional();

        expect(schema.parse({
            name: "Youssef",
            age: 22,
        })).toEqual({
            name: "Youssef",
            age: 22,
        });

        expect(schema.parse(undefined)).toBeUndefined();

        expect(() => schema.parse({
            name: "Youssef",
            age: "22",
        })).toThrow();
    });

    test("works with an array schema", () => {
        const schema = s.array(s.number()).optional();

        expect(schema.parse([1, 2, 3])).toEqual([1, 2, 3]);
        expect(schema.parse(undefined)).toBeUndefined();

        expect(() => schema.parse([1, "2", 3])).toThrow();
    });
});
