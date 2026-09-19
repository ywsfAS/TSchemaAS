import { describe, expect, test } from "vitest";
import { s } from "../src/index.js";

describe("ObjectSchema.partial", () => {
    const User = s.object({
        id: s.number(),
        name: s.string(),
        email: s.string().email(),
        age: s.number(),
    });

    test("should make all properties optional", () => {
        const PartialUser = User.partial();
        expect(PartialUser.parse({})).toEqual({});
    });

    test("should allow only some properties", () => {
        const PartialUser = User.partial();

        expect(
            PartialUser.parse({
                name: "Youssef",
            })
        ).toEqual({
            name: "Youssef",
        });
    });

    test("should allow a single property", () => {
        const PartialUser = User.partial();

        expect(
            PartialUser.parse({
                age: 22,
            })
        ).toEqual({
            age: 22,
        });
    });

    test("should allow all properties", () => {
        const PartialUser = User.partial();

        expect(
            PartialUser.parse({
                id: 1,
                name: "Youssef",
                email: "youssef@example.com",
                age: 22,
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            email: "youssef@example.com",
            age: 22,
        });
    });

    test("should still validate provided properties", () => {
        const PartialUser = User.partial();

        expect(() =>
            PartialUser.parse({
                name: 123,
            })
        ).toThrow();
    });

    test("should still validate each provided property", () => {
        const PartialUser = User.partial();

        expect(() =>
            PartialUser.parse({
                id: "invalid",
                age: "invalid",
            })
        ).toThrow();
    });

    test("should not remove any properties from the schema", () => {
        const PartialUser = User.partial();

        expect(
            PartialUser.parse({
                id: 1,
                name: "Youssef",
                email: "youssef@example.com",
                age: 22,
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            email: "youssef@example.com",
            age: 22,
        });
    });
});
