import { describe, expect, test } from "vitest";
import { s } from "../src/schema.js";

describe("ObjectSchema.omit", () => {
    const User = s.object({
        id: s.number(),
        name: s.string(),
        email: s.string().email(),
        age: s.number(),
    });

    test("should omit the selected properties", () => {
        const UserWithoutEmail = User.omit({
            email: true,
        });

        expect(
            UserWithoutEmail.parse({
                id: 1,
                name: "Youssef",
                age: 22,
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            age: 22,
        });
    });

    test("should omit multiple properties", () => {
        const UserWithoutPrivateData = User.omit({
            email: true,
            age: true,
        });

        expect(
            UserWithoutPrivateData.parse({
                id: 1,
                name: "Youssef",
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
        });
    });

    test("should keep properties that were not omitted", () => {
        const UserWithoutEmail = User.omit({
            email: true,
        });

        expect(
            UserWithoutEmail.parse({
                id: 1,
                name: "Youssef",
                age: 22,
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            age: 22,
        });
    });

    test("should still validate the remaining properties", () => {
        const UserWithoutEmail = User.omit({
            email: true,
        });

        expect(() =>
            UserWithoutEmail.parse({
                id: "invalid",
                name: "Youssef",
                age: 22,
            })
        ).toThrow();
    });

    test("should not require omitted properties", () => {
        const UserWithoutEmail = User.omit({
            email: true,
        });

        expect(
            UserWithoutEmail.parse({
                id: 1,
                name: "Youssef",
                age: 22,
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            age: 22,
        });
    });

    test("should work when omitting a single property", () => {
        const UserWithoutId = User.omit({
            id: true,
        });

        expect(
            UserWithoutId.parse({
                name: "Youssef",
                email: "youssef@example.com",
                age: 22,
            })
        ).toEqual({
            name: "Youssef",
            email: "youssef@example.com",
            age: 22,
        });
    });

    test("should work when omitting all properties", () => {
        const EmptyUser = User.omit({
            id: true,
            name: true,
            email: true,
            age: true,
        });

        expect(
            EmptyUser.parse({})
        ).toEqual({});
    });
});
