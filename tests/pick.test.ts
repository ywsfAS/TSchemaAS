import { describe, expect, test } from "vitest";
import { s } from "../src/index.js";

describe("pick", () => {

    const User = s.object({
        id: s.number(),
        name: s.string(),
        email: s.string(),
        age: s.number(),
    });

    test("should keep only the selected properties", () => {
        const UserPreview = User.pick({
            id: true,
            name: true,
        });

        expect(
            UserPreview.parse({
                id: 1,
                name: "Youssef",
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
        });
    });

    test("should not require properties that were not picked", () => {
        const UserPreview = User.pick({
            id: true,
            name: true,
        });

        expect(
            UserPreview.parse({
                id: 1,
                name: "Youssef",
            })
        ).toEqual({
            id: 1,
            name: "Youssef",
        });
    });

    test("should validate the picked properties", () => {
        const UserPreview = User.pick({
            id: true,
            name: true,
        });

        expect(() =>
            UserPreview.parse({
                id: "1",
                name: "Youssef",
            })
        ).toThrow();
    });

    test("should work when picking a single property", () => {
        const UserId = User.pick({
            id: true,
        });

        expect(
            UserId.parse({
                id: 42,
            })
        ).toEqual({
            id: 42,
        });
    });

    test("should work when picking all properties", () => {
        const AllUser = User.pick({
            id: true,
            name: true,
            email: true,
            age: true,
        });

        expect(
            AllUser.parse({
                id: 1,
                name: "youssef",
                email: "youssef@example.com",
                age: 22,
            })
        ).toEqual({
            id: 1,
            name: "youssef",
            email: "youssef@example.com",
            age: 22,
        });
    });

});
