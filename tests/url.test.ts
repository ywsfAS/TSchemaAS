import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("String URL refinement", () => {
    it("accepts a valid HTTPS URL", () => {
        const schema = s.string().url();

        expect(schema.parse("https://example.com")).toBe(
            "https://example.com"
        );
    });

    it("accepts a valid HTTP URL", () => {
        const schema = s.string().url();

        expect(schema.parse("http://example.com")).toBe(
            "http://example.com"
        );
    });

    it("accepts a URL with a path", () => {
        const schema = s.string().url();

        expect(schema.parse("https://example.com/users/profile")).toBe(
            "https://example.com/users/profile"
        );
    });

    it("accepts a URL with query parameters", () => {
        const schema = s.string().url();

        expect(schema.parse("https://example.com/search?q=test&page=2")).toBe(
            "https://example.com/search?q=test&page=2"
        );
    });

    it("accepts a URL with a port", () => {
        const schema = s.string().url();

        expect(schema.parse("https://example.com:8080")).toBe(
            "https://example.com:8080"
        );
    });

    it("rejects a URL without a protocol", () => {
        const schema = s.string().url();

        expect(() => schema.parse("example.com")).toThrow();
    });

    it("rejects an invalid URL", () => {
        const schema = s.string().url();

        expect(() => schema.parse("not-a-url")).toThrow();
    });

    it("rejects an empty string", () => {
        const schema = s.string().url();

        expect(() => schema.parse("")).toThrow();
    });

    it("supports chaining with min", () => {
        const schema = s.string()
            .min(10)
            .url();

        expect(schema.parse("https://example.com")).toBe(
            "https://example.com"
        );

        expect(() => schema.parse("http://a")).toThrow();
    });

    it("supports chaining with max", () => {
        const schema = s.string()
            .max(30)
            .url();

        expect(schema.parse("https://example.com")).toBe(
            "https://example.com"
        );

        expect(() => schema.parse("https://example.com/this/is/a/very/long/path")).toThrow();
    });

    it("tryParse returns success for a valid URL", () => {
        const schema = s.string().url();

        const result = schema.tryParse("https://example.com");

        expect(result.success).toBe(true);
    });

    it("tryParse returns failure for an invalid URL", () => {
        const schema = s.string().url();

        const result = schema.tryParse("not-a-url");

        expect(result.success).toBe(false);
    });
});
