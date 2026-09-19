import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("literal", () => {
    it("accepts the exact literal and rejects a different value", () => {
        const schema = s.literal("admin");

        expect(schema.tryParse("admin").success).toBe(true);
        expect(schema.tryParse("user").success).toBe(false);
    });

    it("supports string, number, and boolean literals", () => {
        expect(s.literal("admin").tryParse("admin").success).toBe(true);
        expect(s.literal(42).tryParse(42).success).toBe(true);
        expect(s.literal(true).tryParse(true).success).toBe(true);
    });

    it("distinguishes values with the same representation but different types", () => {
        const schema = s.literal("42");

        expect(schema.tryParse(42).success).toBe(false);
        expect(schema.tryParse(true).success).toBe(false);
    });

    it("preserves the literal type", () => {
        const schema = s.literal("admin");

        const value: "admin" = schema.parse("admin");

        expect(value).toBe("admin");
    });

    it("rejects widened primitive types at compile time", () => {
        const stringValue: string = "admin";
        const numberValue: number = 42;
        const booleanValue: boolean = true;

        // @ts-expect-error widened string is not a literal
        s.literal(stringValue);

        // @ts-expect-error widened number is not a literal
        s.literal(numberValue);

        s.literal(booleanValue);
    });

    it("accepts explicitly typed literal values", () => {
        const stringValue: "admin" = "admin";
        const numberValue: 42 = 42;
        const booleanValue: true = true;

        expect(s.literal(stringValue).parse("admin")).toBe("admin");
        expect(s.literal(numberValue).parse(42)).toBe(42);
        expect(s.literal(booleanValue).parse(true)).toBe(true);
    });
});
