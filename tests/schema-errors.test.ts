import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("Schema errors", () => {

    it("collects a refinement error message", () => {
        const schema = s.number().refine(
            n => n % 2 === 0,
            "Number must be even"
        );

        const result = schema.tryParse(5);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(1);
            expect(result.error.issues[0].message)
                .toBe("Number must be even");
        }
    });

    it("collects multiple refinement errors", () => {
        const schema = s.number()
            .refine(
                n => n > 0,
                "Number must be positive"
            )
            .refine(
                n => n % 2 === 0,
                "Number must be even"
            );

        const result = schema.tryParse(-3);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(2);

            expect(result.error.issues[0].message)
                .toBe("Number must be positive");

            expect(result.error.issues[1].message)
                .toBe("Number must be even");
        }
    });

    it("reports the correct path for a nested refinement", () => {
        const schema = s.object({
            user: s.object({
                age: s.number().refine(
                    age => age >= 18,
                    "Must be an adult"
                )
            })
        });

        const result = schema.tryParse({
            user: {
                age: 15
            }
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(1);

            expect(result.error.issues[0].message)
                .toBe("Must be an adult");

            expect(result.error.issues[0].path)
                .toEqual(["user", "age"]);
        }
    });

    it("reports array indexes in refinement paths", () => {
        const schema = s.array(
            s.number().refine(
                n => n > 0,
                "Number must be positive"
            )
        );

        const result = schema.tryParse([
            10,
            -2,
            5,
            -8
        ]);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(2);

            expect(result.error.issues[0].message)
                .toBe("Number must be positive");

            expect(result.error.issues[0].path)
                .toEqual([1]);

            expect(result.error.issues[1].message)
                .toBe("Number must be positive");

            expect(result.error.issues[1].path)
                .toEqual([3]);
        }
    });

    it("builds paths through arrays and objects", () => {
        const schema = s.array(
            s.object({
                name: s.string().refine(
                    name => name.length >= 3,
                    "Name is too short"
                )
            })
        );

        const result = schema.tryParse([
            { name: "John" },
            { name: "A" },
            { name: "Bob" }
        ]);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(1);

            expect(result.error.issues[0].message)
                .toBe("Name is too short");

            expect(result.error.issues[0].path)
                .toEqual([1, "name"]);
        }
    });

    it("collects multiple errors from a nested object", () => {
        const schema = s.object({
            name: s.string().refine(
                name => name.length >= 3,
                "Name is too short"
            ),

            age: s.number().refine(
                age => age >= 18,
                "Must be an adult"
            )
        });

        const result = schema.tryParse({
            name: "A",
            age: 15
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(2);

            expect(result.error.issues).toEqual([
                {
                    path: ["name"],
                    message: "Name is too short",
                    code: "custom"
                },
                {
                    path: ["age"],
                    message: "Must be an adult",
                    code: "custom"
                }
            ]);
        }
    });

    it("does not run refinement when the base schema fails", () => {
        const schema = s.number().refine(
            n => n > 0,
            "Number must be positive"
        );

        const result = schema.tryParse("hello");

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(1);

            expect(result.error.issues[0].message)
                .toBe("Expected a number");
        }
    });

    it("runs refinement on the default value", () => {
        const schema = s.number()
            .default(10)
            .refine(
                n => n > 0,
                "Number must be positive"
            );

        const result = schema.tryParse(undefined);

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBe(10);
        }
    });

    it("reports refinement errors for an invalid default", () => {
        const schema = s.number()
            .default(-5)
            .refine(
                n => n > 0,
                "Default number must be positive"
            );

        const result = schema.tryParse(undefined);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(1);

            expect(result.error.issues[0].message)
                .toBe("Default number must be positive");
        }
    });

    it("allows undefined through optional", () => {
        const schema = s.number()
            .refine(
                n => n > 0,
                "Number must be positive"
            )
            .optional();

        const result = schema.tryParse(undefined);

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBeUndefined();
        }
    });

    it("allows null through nullable", () => {
        const schema = s.number()
            .refine(
                n => n > 0,
                "Number must be positive"
            )
            .nullable();

        const result = schema.tryParse(null);

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBeNull();
        }
    });

    it("collects errors from a deeply nested schema", () => {
        const schema = s.object({
            username: s.string().refine(
                value => value.length >= 3,
                "Username is too short"
            ),

            profile: s.object({
                age: s.number().refine(
                    value => value >= 18,
                    "Must be an adult"
                )
            }),

            scores: s.array(
                s.number().refine(
                    value => value >= 0,
                    "Score cannot be negative"
                )
            )
        });

        const result = schema.tryParse({
            username: "A",

            profile: {
                age: 15
            },

            scores: [10, -5, 20, -3]
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toHaveLength(4);

            expect(result.error.issues).toEqual([
                {
                    path: ["username"],
                    message: "Username is too short",
                    code: "custom"
                },
                {
                    path: ["profile", "age"],
                    message: "Must be an adult",
                    code: "custom"
                },
                {
                    path: ["scores", 1],
                    message: "Score cannot be negative",
                    code: "custom"
                },
                {
                    path: ["scores", 3],
                    message: "Score cannot be negative",
                    code: "custom"
                }
            ]);
        }
    });
});
