# Getting Started

## Installation

```bash
npm install tschemaas
```

> The package is under active development and may not yet be published to
> the npm registry. Until then, consume it directly from source (see the
> project's main [README](../README.md#installation)).

TSchemaAS ships as an ES module (`"type": "module"` in `package.json`) and
targets TypeScript. No runtime dependencies are required beyond TypeScript
itself for type-checking.

## The core idea

Every schema is an instance of the abstract `Schema<T>` class. Building a
schema never validates anything by itself — validation happens when you call
`.parse()` or `.tryParse()` on it with the data you want to check.

```ts
import { s } from "tschemaas";

const userSchema = s.object({
  id: s.number().positive(),
  name: s.string().min(2).max(50),
  email: s.string().email(),
  website: s.string().url().optional(),
  tags: s.array(s.string()),
  active: s.boolean().default(true),
});

// Static type, derived from the schema:
type User = s.infer<typeof userSchema>;
// -> { id: number; name: string; email: string; website?: string; tags: string[]; active: boolean }
```

## Validating data: `parse` vs `tryParse`

Every schema exposes two validation entry points, inherited from `Schema<T>`:

- **`schema.parse(value)`** — returns the validated (and possibly
  defaulted) data on success, or **throws** an `ErrorSchema` on failure.
- **`schema.tryParse(value)`** — never throws. Returns a discriminated
  union: `{ success: true, data: T }` or `{ success: false, error: ErrorSchema }`.

```ts
// Throwing form good for "fail fast" contexts (e.g. request handlers
// wrapped in a try/catch, or startup config validation).
try {
  const user = userSchema.parse(rawInput);
} catch (err) {
  // err is an ErrorSchema instance
}

// Non-throwing form good for form validation / user-facing flows
// where you want to inspect all issues without exception handling.
const result = userSchema.tryParse(rawInput);
if (!result.success) {
  console.log(result.error.issues);
} else {
  console.log(result.data);
}
```

See [API / Errors](./api/errors.md) for the shape of `ErrorSchema` and its
`issues`.

## Building blocks at a glance

```ts
// Primitives
s.string();
s.number();
s.boolean();
s.literal("admin");
s.enum(["admin", "editor", "viewer"]);

// Structures
s.object({ ... });
s.array(itemSchema);
s.union([schemaA, schemaB]);
s.lazy(() => someSchema); // for recursive / forward-referenced schemas

// Modifiers (available on every schema)
schema.optional();
schema.nullable();
schema.default(value);

// Refinements (chainable, type-specific see api/refinements.md)
s.string().min(3).max(20).email();
s.number().positive().finite();

// Custom refinement (available on every schema)
schema.refine((value) => /* boolean */ true, "error message");
```

Continue to [API / Core](./api/core.md) for the full reference.
