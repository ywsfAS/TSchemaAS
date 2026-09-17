# TSchemaAS

A lightweight, type-safe schema validation library for TypeScript. Define your schema once and get both **runtime validation** and **TypeScript type inference**.

---

## Features

- **Runtime Validation** & **Type Inference** (`s.infer<T>`)
- **Primitives**: `string`, `number`, `boolean`
- **Structures**: Composable `object` and `array` schemas
- **Modifiers**: `optional()`, `nullable()`, `default()`
- **Refinement Rules**: `min()`, `max()`, `regex()`, `email()`, `url()`, `positive()`, `negative()`
- **Custom Refinements**: `refine(predicate, message)`

---

## Installation

```bash
npm install tschemaas
```

> The package is currently under development and may not be published yet.

---

## Quick Start

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

// Infer static TypeScript type
type User = s.infer<typeof userSchema>;

// Validate data at runtime
const user = userSchema.parse({
  id: 1,
  name: "Youssef",
  email: "youssefAS@example.com",
  tags: ["typescript", "developer"],
});
```

---

## Usage Guide

### Primitives

```ts
const name = s.string();
name.parse("Youssef"); // Returns "Youssef"

const age = s.number();
age.parse(21); // Returns 21

const active = s.boolean();
active.parse(true); // Returns true
```

### Objects & Arrays

```ts
// Object Schema
const personSchema = s.object({
  name: s.string(),
  age: s.number(),
});

// Array Schema
const numbersSchema = s.array(s.number());
numbersSchema.parse([1, 2, 3]);

// Nested Schemas
const teamSchema = s.object({
  teamName: s.string(),
  members: s.array(personSchema),
});

type Team = s.infer<typeof teamSchema>;
```

### Modifiers

Modifiers change validation behavior while updating the inferred type.

```ts
s.string().optional(); // Type: string | undefined
s.string().nullable(); // Type: string | null
s.boolean().default(true); // Fallback value when missing
```

### Built-in Refinement Methods

Chain validation rules directly onto your primitive schemas:

```ts
// Strings
s.string().min(3);
s.string().max(20);
s.string().regex(/^[a-zA-Z0-9_]+$/);
s.string().email();
s.string().url();

// Numbers
s.number().positive();
s.number().negative();
s.number().min(0).max(100);
```

### Custom Refinements

Add domain-specific logic with `.refine()`:

```ts
const evenNumber = s
  .number()
  .refine((val) => val % 2 === 0, "Number must be even");

evenNumber.parse(4); // Success
evenNumber.parse(5); // Throws exception
```

---

## API Summary

```ts
// Core Builders
s.string()
s.number()
s.boolean()
s.object(shape)
s.array(schema)

// Type Extraction
s.infer<typeof schema>

// Extended Modifiers & Refinements
.optional()
.nullable()
.default(value)
.min(value)
.max(value)
.regex(pattern)
.email()
.url()
.positive()
.negative()
.refine(predicate, message)
```

---

## Project Architecture

```
src/
├── index.ts
├── schema.ts          # Core 's' builder export & namespace
├── types.ts           # SchemaObjectShape & inferType mapping
├── schemas/           # Base Schema & concrete type classes
│   ├── schema.ts
│   ├── string-schema.ts
│   ├── number-schema.ts
│   ├── boolean-schema.ts
│   ├── object-schema.ts
│   └── array-schema.ts
├── modifiers/         # Class wrappers for schema properties
│   ├── optional.ts
│   ├── nullable.ts
│   └── default.ts
└── refinements/       # Validation constraints
    ├── min.ts
    ├── max.ts
    ├── regex.ts
    ├── email.ts
    ├── url.ts
    ├── positive-negative.ts
    └── refine.ts
```

---

## Design Goals

- **Single source of truth** : define structure once instead of maintaining separate validation logic and TypeScript interfaces.
- **Strong type preservation** : schema composition preserves useful type information rather than falling back to `any`.
- **Composition** : small schemas act as reusable building blocks for larger schemas.
- **Runtime safety** : TypeScript types disappear at runtime; schemas provide actual runtime validation for incoming data.
- **Small abstractions** : the implementation stays understandable while making practical use of TypeScript's type system.

---

## Testing

Run the test suite with:

```bash
npx vitest
```

---

## License

MIT © YoussefAS an educational project made with love.
