import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("String email refinement", () => {
    it("accepts a valid email", () => {
        const schema = s.string().email();

        expect(schema.parse("user@example.com")).toBe("user@example.com");
    });

    it("accepts an email with a subdomain", () => {
        const schema = s.string().email();

        expect(schema.parse("user@mail.example.com")).toBe(
            "user@mail.example.com"
        );
    });

    it("accepts an email with numbers", () => {
        const schema = s.string().email();

        expect(schema.parse("user123@example.com")).toBe(
            "user123@example.com"
        );
    });

    it("accepts an email with a dot in the local part", () => {
        const schema = s.string().email();

        expect(schema.parse("first.last@example.com")).toBe(
            "first.last@example.com"
        );
    });

    it("rejects an email without @", () => {
        const schema = s.string().email();

        expect(() => schema.parse("userexample.com")).toThrow();
    });

    it("rejects an email without a domain", () => {
        const schema = s.string().email();

        expect(() => schema.parse("user@")).toThrow();
    });

    it("rejects an email without a local part", () => {
        const schema = s.string().email();

        expect(() => schema.parse("@example.com")).toThrow();
    });

    it("rejects an email without a domain extension", () => {
        const schema = s.string().email();

        expect(() => schema.parse("user@example")).toThrow();
    });

    it("rejects an email containing spaces", () => {
        const schema = s.string().email();

        expect(() => schema.parse("user name@example.com")).toThrow();
    });

    it("rejects an empty string", () => {
        const schema = s.string().email();

        expect(() => schema.parse("")).toThrow();
    });

    it("supports chaining with min", () => {
        const schema = s.string()
            .min(10)
            .email();

        expect(schema.parse("user@example.com")).toBe("user@example.com");
        expect(() => schema.parse("a@b.co")).toThrow();
    });

    it("tryParse returns success for a valid email", () => {
        const schema = s.string().email();

        const result = schema.tryParse("user@example.com");

        expect(result.success).toBe(true);
    });

    it("tryParse returns failure for an invalid email", () => {
        const schema = s.string().email();

        const result = schema.tryParse("invalid-email");

        expect(result.success).toBe(false);
    });
});
