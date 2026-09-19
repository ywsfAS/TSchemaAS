import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("enum schema", () => {
    it("accepts values that belong to the enum", () => {
        const schema = s.enum(["admin", "user", "guest"]);

        expect(schema.tryParse("admin").success).toBe(true);
        expect(schema.tryParse("user").success).toBe(true);
        expect(schema.tryParse("guest").success).toBe(true);
    });

    it("rejects values outside the enum", () => {
        const schema = s.enum(["admin", "user", "guest"]);

        expect(schema.tryParse("moderator").success).toBe(false);
        expect(schema.tryParse("")).toBeDefined();
    });

    it("uses strict equality between enum values and input", () => {
        const schema = s.enum(["1", "2", "3"]);

        expect(schema.tryParse(1).success).toBe(false);
        expect(schema.tryParse(true).success).toBe(false);
    });

    it("supports number enums", () => {
        const schema = s.enum([200, 201, 404]);

        expect(schema.tryParse(200).success).toBe(true);
        expect(schema.tryParse(404).success).toBe(true);
        expect(schema.tryParse(500).success).toBe(false);
    });

    it("supports boolean enums", () => {
        const schema = s.enum([true, false]);

        expect(schema.tryParse(true).success).toBe(true);
        expect(schema.tryParse(false).success).toBe(true);
        expect(schema.tryParse("true").success).toBe(false);
        expect(schema.tryParse(1).success).toBe(false);
    });

    it("preserves the union of  iteral types", () => {
        const schema = s.enum(["admin", "user", "guest"]);

        const value: "admin" | "user" | "guest" =
            schema.parse("admin");

        expect(value).toBe("admin");
    });

    it("handles a single-value enum", () => {
        const schema = s.enum(["admin"]);

        expect(schema.tryParse("admin").success).toBe(true);
        expect(schema.tryParse("user").success).toBe(false);
    });

    it("handles duplicate enum values", () => {
        const schema = s.enum(["admin", "admin", "user"]);

        expect(schema.tryParse("admin").success).toBe(true);
        expect(schema.tryParse("user").success).toBe(true);
        expect(schema.tryParse("guest").success).toBe(false);
    });
});
