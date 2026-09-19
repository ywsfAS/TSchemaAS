# Examples

## Basic object validation

```ts
import { s } from "tschemaas";

const schema = s.object({
  name: s.string(),
  id: s.number(),
});

const user = { name: "youssef", id: 10 };
console.log(schema.parse(user)); // { name: "youssef", id: 10 }
console.log(schema.tryParse(user)); // { success: true, data: { ... } }

const missingField = { name: "messi" };
console.log(schema.tryParse(missingField));
// { success: false, error: ErrorSchema { issues: [{ path: ["id"], message: "Expected a number", code: "" }] } }

const wrongType = { name: "messi", id: "greatest" };
console.log(schema.tryParse(wrongType));
// { success: false, error: ErrorSchema { issues: [{ path: ["id"], message: "Expected a number", code: "" }] } }
```

## Arrays

```ts
const arraySchema = s.array(s.string());

arraySchema.parse(["youssef", "badr", "adam"]); // ok

arraySchema.tryParse(["youssef", 10, "messi"]);
// { success: false, error: { issues: [{ path: [1], message: "Expected a string", code: "" }] } }

arraySchema.tryParse("youssef");
// { success: false, error: { issues: [{ path: [], message: "The type is incompatible with any[]", code: "" }] } }
```

## Nested objects and reusable sub-schemas

```ts
const personSchema = s.object({
  name: s.string(),
  age: s.number(),
});

const teamSchema = s.object({
  teamName: s.string(),
  members: s.array(personSchema),
});

type Team = s.infer<typeof teamSchema>;

teamSchema.parse({
  teamName: "Core",
  members: [
    { name: "Youssef", age: 22 },
    { name: "Badr", age: 25 },
  ],
});
```

## Shaping API request/response DTOs with `pick` / `omit` / `partial` / `extend`

```ts
const User = s.object({
  id: s.number(),
  name: s.string(),
  email: s.string().email(),
  age: s.number(),
});

// Response shape for a public listing drop sensitive fields
const UserPublic = User.omit({ email: true });

// Payload for creating a user no id yet, add a role
const CreateUserInput = User.omit({ id: true }).extend({
  role: s.enum(["admin", "editor", "viewer"]),
});

// Payload for a PATCH endpoint every field optional
const UpdateUserInput = User.partial();

// A minimal preview shape
const UserPreview = User.pick({ id: true, name: true });
```

## Discriminated-ish values with `union` and `literal`

```ts
const shapeSchema = s.union([
  s.object({ kind: s.literal("circle"), radius: s.number().positive() }),
  s.object({
    kind: s.literal("rectangle"),
    width: s.number().positive(),
    height: s.number().positive(),
  }),
]);

type Shape = s.infer<typeof shapeSchema>;

shapeSchema.parse({ kind: "circle", radius: 5 }); // ok
shapeSchema.parse({ kind: "triangle", base: 3 }); // throws
```

## Recursive structures with `lazy`

```ts
import type { Schema } from "tschemaas";

type Comment = {
  text: string;
  replies: Comment[];
};

const commentSchema: Schema<Comment> = s.object({
  text: s.string(),
  replies: s.array(s.lazy(() => commentSchema)),
}) as unknown as Schema<Comment>;

commentSchema.parse({
  text: "Nice library!",
  replies: [{ text: "Thanks!", replies: [] }],
});
```

## Custom domain rules with `refine`

```ts
const passwordSchema = s
  .string()
  .min(8)
  .refine((v) => /[A-Z]/.test(v), "Must contain an uppercase letter")
  .refine((v) => /[0-9]/.test(v), "Must contain a digit");

const evenNumber = s.number().refine((v) => v % 2 === 0, "Number must be even");
```

## Defaults and optional fields together

```ts
const settingsSchema = s.object({
  theme: s.enum(["light", "dark"]).default("light"),
  notificationsEnabled: s.boolean().default(true),
  nickname: s.string().optional(),
});

settingsSchema.parse({});
// { theme: "light", notificationsEnabled: true, nickname: undefined }
```

## Collecting and formatting all errors for a form

```ts
function formatIssues(err: import("tschemaas").ErrorSchema) {
  return err.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
```
