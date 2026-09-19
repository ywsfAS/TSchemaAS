import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("finite", () => {

    it("should accept positive finite numbers", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(42).success).toBe(true);
    });

    it("should accept negative finite numbers", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(-42).success).toBe(true);
    });

    it("should accept zero", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(0).success).toBe(true);
    });

    it("should accept decimal numbers", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(3.14).success).toBe(true);
    });

    it("should reject Infinity", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(Infinity).success).toBe(false);
    });

    it("should reject negative Infinity", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(-Infinity).success).toBe(false);
    });

    it("should reject NaN", () => {
        const schema = s.number().finite();

        expect(schema.tryParse(NaN).success).toBe(false);
    });
});


describe("nan", () => {

    it("should accept NaN", () => {
        const schema = s.number().nan();

        expect(schema.tryParse(NaN).success).toBe(true);
    });

    it("should reject positive numbers", () => {
        const schema = s.number().nan();

        expect(schema.tryParse(42).success).toBe(false);
    });

    it("should reject negative numbers", () => {
        const schema = s.number().nan();

        expect(schema.tryParse(-42).success).toBe(false);
    });

    it("should reject zero", () => {
        const schema = s.number().nan();

        expect(schema.tryParse(0).success).toBe(false);
    });

    it("should reject Infinity", () => {
        const schema = s.number().nan();

        expect(schema.tryParse(Infinity).success).toBe(false);
    });

    it("should reject negative Infinity", () => {
        const schema = s.number().nan();

        expect(schema.tryParse(-Infinity).success).toBe(false);
    });
});
