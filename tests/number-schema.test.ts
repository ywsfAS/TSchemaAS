import { it, describe, expect } from "vitest";
import { s } from "../src/index.js";

describe("number-schema", () => {

    describe("parse", () => {

        it("returns the value when given a number", () => {

            const value = 10;
            expect(s.number().parse(value)).toBe(value);

        });

        it("throws when given a non-number", () => {

            const value = "youssefAS";
            expect(() => {
                s.number().parse(value);
            }).toThrow();

        });
    });

    describe("tryParse", () => {

        it("returns a successful result when given a number", () => {

            const value = 10;
            expect(s.number().tryParse(value)).toEqual({
                success: true,
                data: value
            });

        });

        it("returns a failure result when given a non-number", () => {

            const value = "foo";
            expect(s.number().tryParse(value).success).toBe(false);

        });
    });
});
