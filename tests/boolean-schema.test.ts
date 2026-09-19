import { it, describe, expect } from "vitest";
import { s } from "../src/index.js";

describe("boolean-schema", () => {

    describe("parse", () => {

        it("returns the value when given a boolean", () => {

            const value = true;
            expect(s.boolean().parse(value)).toBe(value);

        });

        it("throws when given a non-boolean", () => {

            const value = "true";
            expect(() => {
                s.boolean().parse(value);
            }).toThrow();

        });
    });

    describe("tryParse", () => {

        it("returns a successful result when given a boolean", () => {

            const value = false;
            expect(s.boolean().tryParse(value)).toEqual({
                success: true,
                data: value
            });

        });

        it("returns a failure result when given a non-boolean", () => {

            const value = 10;
            expect(s.boolean().tryParse(value).success).toBe(false);

        });
    });
});
