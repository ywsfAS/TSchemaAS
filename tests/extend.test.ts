import { describe, expect, it } from "vitest";
import { s } from "../src/schema.js";

describe("ObjectSchema.extend", () => {
    const User = s.object({
        id: s.number(),
        name: s.string(),
    });

    it("should add new properties", () => {
        const ExtendedUser = User.extend({
            email: s.string().email(),
            age: s.number(),
        });

        expect(
            ExtendedUser.parse({
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

    it("should keep the original properties", () => {
        const ExtendedUser = User.extend({
            email: s.string(),
        });

        expect(
            ExtendedUser.parse({
                id: 1,
                name: "Youssef",
                email: "youssef@example.com",
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            email: "youssef@example.com",
        });
    });

    it("should validate the extended properties", () => {
        const ExtendedUser = User.extend({
            email: s.string().email(),
            age: s.number(),
        });

        expect(() =>
            ExtendedUser.parse({
                id: 1,
                name: "Youssef",
                email: "invalid-email",
                age: 22,
            })
        ).toThrow();

        expect(() =>
            ExtendedUser.parse({
                id: 1,
                name: "Youssef",
                email: "youssef@example.com",
                age: "22",
            })
        ).toThrow();
    });

    it("should still validate the original properties", () => {
        const ExtendedUser = User.extend({
            email: s.string(),
        });

        expect(() =>
            ExtendedUser.parse({
                id: "invalid",
                name: "Youssef",
                email: "youssef@example.com",
            })
        ).toThrow();

        expect(() =>
            ExtendedUser.parse({
                id: 1,
                name: 123,
                email: "youssef@example.com",
            })
        ).toThrow();
    });

    it("should allow overriding an existing property", () => {
        const ExtendedUser = User.extend({
            name: s.number(),
        });

        expect(
            ExtendedUser.parse({
                id: 1,
                name: 123,
            })
        ).toEqual({
            id: 1,
            name: 123,
        });

        expect(() =>
            ExtendedUser.parse({
                id: 1,
                name: "Youssef",
            })
        ).toThrow();
    });

    it("should extend with a single property", () => {
        const ExtendedUser = User.extend({
            email: s.string(),
        });

        expect(
            ExtendedUser.parse({
                id: 1,
                name: "Youssef",
                email: "youssef@example.com",
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
            email: "youssef@example.com",
        });
    });

    it("should work when extending an empty schema", () => {
        const Empty = s.object({});

        const Extended = Empty.extend({
            name: s.string(),
            age: s.number(),
        });

        expect(
            Extended.parse({
                name: "Youssef",
                age: 22,
            })
        ).toEqual({
            name: "Youssef",
            age: 22,
        });
    });
});
