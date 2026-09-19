import { describe, expect, it } from "vitest";
import { s } from "../src/index.js";

describe("Lazy", () => {

    it("should not evaluate the schema when created", () => {
        let evaluations = 0;

        const schema = s.lazy(() => {
            evaluations++;
            return s.string();
        });

        expect(evaluations).toBe(0);

        void schema;

        expect(evaluations).toBe(0);
    });

    it("should evaluate the schema when parsing", () => {
        let evaluations = 0;

        const schema = s.lazy(() => {
            evaluations++;
            return s.string();
        });

        schema.parse("hello");

        expect(evaluations).toBe(1);
    });

    it("should use the schema returned by the callback", () => {
        const schema = s.lazy(() => s.number());

        expect(schema.parse(42)).toBe(42);

        expect(() => schema.parse("42")).toThrow();
    });

    it("should resolve the schema again when parsing recursively", () => {
        let evaluations = 0;

        const Tree : any = s.lazy(() => {
            evaluations++;

            return s.object({
                value: s.number(),
                children: s.array(Tree),
            });
        });

        Tree.parse({
            value: 1,
            children: [
                {
                    value: 2,
                    children: [],
                },
            ],
        });

        expect(evaluations).toBe(2);
    });

    it("should validate every recursive level", () => {
        const Tree : any = s.lazy(() =>
            s.object({
                value: s.number(),
                children: s.array(Tree),
            })
        );

        expect(() =>
            Tree.parse({
                value: 1,
                children: [
                    {
                        value: 2,
                        children: [
                            {
                                value: "invalid",
                                children: [],
                            },
                        ],
                    },
                ],
            })
        ).toThrow();
    });

    it("should support deeply nested recursive structures", () => {
        const Tree : any = s.lazy(() =>
            s.object({
                value: s.number(),
                children: s.array(Tree),
            })
        );

        expect(
            Tree.parse({
                value: 1,
                children: [
                    {
                        value: 2,
                        children: [
                            {
                                value: 3,
                                children: [
                                    {
                                        value: 4,
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            })
        ).toEqual({
            value: 1,
            children: [
                {
                    value: 2,
                    children: [
                        {
                            value: 3,
                            children: [
                                {
                                    value: 4,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});
