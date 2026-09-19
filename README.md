# TSchemaAS

A lightweight, type-safe schema validation library for TypeScript. Define
your schema once and get both **runtime validation** and **TypeScript type
inference** from the same declaration.

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

type User = s.infer<typeof userSchema>;

const user = userSchema.parse({
  id: 1,
  name: "Youssef",
  email: "youssef@example.com",
  tags: ["typescript", "developer"],
});
```

---

## Features

- **Runtime validation** and **static type inference** (`s.infer<T>`) from one schema definition
- **Primitives**: `string`, `number`, `boolean`, `literal`, `enum`
- **Structures**: composable `object`, `array`, `union`, and `lazy` (recursive) schemas
- **Object utilities**: `.pick()`, `.omit()`, `.partial()`, `.extend()`
- **Modifiers**: `.optional()`, `.nullable()`, `.default()`
- **Refinements**: `.min()`, `.max()`, `.regex()`, `.email()`, `.url()`, `.positive()`, `.negative()`, `.finite()`, `.nan()`, `.startsWith()`, `.endsWith()`, `.includes()`
- **Custom refinements**: `.refine(predicate, message)`
- **Full error reporting**: every failing field is collected into a single error, not just the first one

## Installation

```bash
npm install tschemaas
```

> The package is currently under development and may not be published to
> the npm registry yet. Until it is, install from source: clone the repo,
> then import from `src/schema.ts` (build it with your own `tsc`/bundler
> step as needed).

## Quick start

```ts
import { s } from "./schema.js";

const userSchema = s.object({
  id: s.number().positive(),
  name: s.string().min(2).max(50),
  email: s.string().email(),
  website: s.string().url().optional(),
  tags: s.array(s.string()),
  active: s.boolean().default(true),
});

// Infer the static TypeScript type
type User = s.infer<typeof userSchema>;

// Validate data at runtime throws on invalid input
const user = userSchema.parse({
  id: 1,
  name: "Youssef",
  email: "youssefAS@example.com",
  tags: ["typescript", "developer"],
});

// Or validate without throwing
const result = userSchema.tryParse(user);
if (!result.success) {
  console.log(result.error.issues);
}
```

## Documentation

Full API documentation lives in [`docs/`](./docs/Intro.md):

|                                                |                                                          |
| ---------------------------------------------- | -------------------------------------------------------- |
| [Getting Started](./docs/getting-started.md)   | Install, quick start, `parse` vs `tryParse`              |
| [API / Core](./docs/api/core.md)               | The `s` builder and the `Schema<T>` base class           |
| [API / Primitives](./docs/api/primitives.md)   | `string`, `number`, `boolean`, `literal`, `enum`         |
| [API / Structures](./docs/api/structures.md)   | `object`, `array`, `union`, `lazy`, and object utilities |
| [API / Modifiers](./docs/api/modifiers.md)     | `.optional()`, `.nullable()`, `.default()`               |
| [API / Refinements](./docs/api/refinements.md) | All built-in and custom validation rules                 |
| [API / Errors](./docs/api/errors.md)           | `ErrorSchema`, `Issue`, `SafeParseResult<T>`             |
| [Type Inference](./docs/type-inference.md)     | How `s.infer<T>` works                                   |
| [Architecture](./docs/architecture.md)         | Codebase layout and internal design                      |
| [Examples](./docs/examples.md)                 | Copy-pasteable, end-to-end examples                      |

## Project architecture

```
src/
├── index.ts            # Demo script
├── schema.ts             # Core `s` builder export & `s.infer` namespace
├── types.ts               # SchemaObjectShape & inferType mapping
├── schemas/                # Base Schema<T> class & concrete schema classes
│   ├── schema.ts
│   ├── string-schema.ts
│   ├── number-schema.ts
│   ├── boolean-schema.ts
│   ├── object-schema.ts     # + pick / omit / partial / extend
│   ├── array-schema.ts
│   ├── literal-schema.ts
│   ├── enums-schema.ts
│   ├── union-schema.ts
│   └── lazy-schema.ts
├── modifiers/               # optional / nullable / default
│   ├── optional.ts
│   ├── nullable.ts
│   └── default.ts
├── refinements/              # Chainable validation constraints
│   ├── min.ts
│   ├── max.ts
│   ├── regex.ts
│   ├── email.ts
│   ├── url.ts
│   ├── positive-negative.ts
│   ├── nan-finit.ts
│   ├── startswith.ts
│   ├── endsWith.ts
│   ├── includes.ts
│   └── refine.ts
└── errors/
    └── error-schema.ts       # ErrorSchema + Issue accumulation
```

See [Architecture](./docs/architecture.md) for how chainable, type-specific
methods (like `.email()` existing only on string schemas) are wired up
without circular imports.

## Design goals

- **Single source of truth** : define structure once instead of maintaining separate validation logic and TypeScript interfaces.
- **Strong type preservation** : schema composition preserves useful type information rather than falling back to `any`.
- **Composition** : small schemas act as reusable building blocks for larger schemas.
- **Runtime safety** : TypeScript types disappear at runtime; schemas provide actual runtime validation for incoming data.
- **Small abstractions** : the implementation stays understandable while making practical use of TypeScript's type system.

## Testing

```bash
npx vitest
```

## License

MIT © Youssef AS an educational project made with love.
