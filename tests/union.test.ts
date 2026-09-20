import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("union schema", () => {
    it("accepts a value matching any schema", () => {
        const schema = s.union([
            s.string(),
            s.number(),
        ]);

        expect(schema.tryParse("hello").success).toBe(true);
        expect(schema.tryParse(42).success).toBe(true);
    });

    it("rejects a value matching no schema", () => {
        const schema = s.union([
            s.string(),
            s.number(),
        ]);

        expect(schema.tryParse(true).success).toBe(false);
    });

    it("does not leak errors from failed branches", () => {
        const schema = s.union([
            s.string(),
            s.number(),
        ]);

        const result = schema.tryParse(true);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(1);
            expect(result.error.issues[0].message)
                .toBe("Expected a union");
        }
    });

    it("preserves the union of schema output types", () => {
        const schema = s.union([
            s.string(),
            s.number(),
        ]);

        const value: string | number = schema.parse("hello");

        expect(value).toBe("hello");
    });

    it("works with literal schemas", () => {
        const schema = s.union([
            s.literal("admin"),
            s.literal("user"),
        ]);

        expect(schema.tryParse("admin").success).toBe(true);
        expect(schema.tryParse("user").success).toBe(true);
        expect(schema.tryParse("guest").success).toBe(false);
    });

    it("works with object schemas", () => {
        const schema = s.union([
            s.object({
                type: s.literal("user"),
                name: s.string(),
            }),
            s.object({
                type: s.literal("admin"),
                permissions: s.array(s.string()),
            }),
        ]);

        expect(schema.tryParse({
            type: "user",
            name: "Youssef",
        }).success).toBe(true);

        expect(schema.tryParse({
            type: "admin",
            permissions: ["read", "write"],
        }).success).toBe(true);

        expect(schema.tryParse({
            type: "guest",
        }).success).toBe(false);
    });
});
