import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("String regex refinement", () => {
    it("accepts a string matching the regex", () => {
        const schema = s.string().regex("^[A-Z]+$", undefined);

        expect(schema.parse("HELLO")).toBe("HELLO");
    });

    it("rejects a string that does not match the regex", () => {
        const schema = s.string().regex("^[A-Z]+$", undefined);

        expect(() => schema.parse("Hello")).toThrow();
    });

    it("accepts a string matching a regex with options", () => {
        const schema = s.string().regex("^[a-z]+$", "i");

        expect(schema.parse("Hello")).toBe("Hello");
    });

    it("rejects a string when regex options do not allow the match", () => {
        const schema = s.string().regex("^[a-z]+$", undefined);

        expect(() => schema.parse("Hello")).toThrow();
    });

    it("supports regex with digits", () => {
        const schema = s.string().regex("^\\d+$", undefined);

        expect(schema.parse("12345")).toBe("12345");
    });

    it("rejects a string containing non-digits", () => {
        const schema = s.string().regex("^\\d+$", undefined);

        expect(() => schema.parse("123a45")).toThrow();
    });

    it("can be chained with min", () => {
        const schema = s.string()
            .min(5)
            .regex("^[A-Z]+$", undefined);

        expect(schema.parse("HELLO")).toBe("HELLO");
        expect(() => schema.parse("HI")).toThrow();
        expect(() => schema.parse("Hello")).toThrow();
    });

    it("can be chained with max", () => {
        const schema = s.string()
            .max(5)
            .regex("^[A-Z]+$", undefined);

        expect(schema.parse("HELLO")).toBe("HELLO");
        expect(() => schema.parse("HELLOWORLD")).toThrow();
        expect(() => schema.parse("Hello")).toThrow();
    });

    it("tryParse returns success for a matching string", () => {
        const schema = s.string().regex("^[A-Z]+$", undefined);

        const result = schema.tryParse("HELLO");

        expect(result.success).toBe(true);
    });

    it("tryParse returns failure for a non-matching string", () => {
        const schema = s.string().regex("^[A-Z]+$", undefined);

        const result = schema.tryParse("Hello");

        expect(result.success).toBe(false);
    });
});
