import {it,describe,expect} from "vitest";
import {s} from "../src/index.js";

describe("string-schema",() => {

    describe("parse", () => {

      it("returns the value when given a string",() => {

          const value = "youssefAS";
          expect(s.string().parse(value)).toBe(value);

      });
      it("throw when given a number",() => {

          const value = 10;
          expect(() => {s.string().parse(value)}).toThrow();

      });
    })
    describe("tryParse" , () => {

      it("returns a successful result when given a string",() => {

          const value = "foo";
          expect(s.string().tryParse(value)).toEqual({
              success : true,
              data : value
          });

      });
      it("returns a failure result when given a number",() => {

          const value = 10;
          expect(s.string().tryParse(value).success).toBe(false);
      });
    })










})
