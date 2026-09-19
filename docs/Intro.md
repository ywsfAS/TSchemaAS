# TSchemaAS Documentation

TSchemaAS is a lightweight, type-safe schema validation library for TypeScript.
Define a schema once and get both **runtime validation** and **static TypeScript
type inference** (`s.infer<typeof schema>`) from the same declaration.

This folder is the full documentation set for the library's public API. Start
at [Getting Started](./getting-started.md) if you're new, or jump straight to
the reference pages below.

## Contents

| Page                                      | Description                                                                                                                                                           |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Getting Started](./getting-started.md)   | Install, quick start, and the core `parse` / `tryParse` mental model                                                                                                  |
| [API / Core](./api/core.md)               | The `s` builder namespace, the `Schema<T>` base class, `.parse()`, `.tryParse()`, `.refine()`                                                                         |
| [API / Primitives](./api/primitives.md)   | `s.string()`, `s.number()`, `s.boolean()`, `s.literal()`, `s.enum()`                                                                                                  |
| [API / Structures](./api/structures.md)   | `s.object()` (+ `.pick`, `.omit`, `.partial`, `.extend`), `s.array()`, `s.union()`, `s.lazy()`                                                                        |
| [API / Modifiers](./api/modifiers.md)     | `.optional()`, `.nullable()`, `.default()`                                                                                                                            |
| [API / Refinements](./api/refinements.md) | `.min()`, `.max()`, `.regex()`, `.email()`, `.url()`, `.positive()`, `.negative()`, `.startsWith()`, `.endsWith()`, `.includes()`, `.finite()`, `.nan()`, `.refine()` |
| [API / Errors](./api/errors.md)           | `ErrorSchema`, `Issue`, `SafeParseResult<T>`, and how validation failures are reported                                                                                |
| [Type Inference](./type-inference.md)     | How `s.infer<T>` derives static types from schemas                                                                                                                    |
| [Architecture](./architecture.md)         | How the codebase is organized and how chainable methods are attached at runtime                                                                                       |
| [Examples](./examples.md)                 | End-to-end, copy-pasteable examples                                                                                                                                   |

## Conventions used in this documentation

- `s` always refers to the library's root export: `import { s } from "tschemaas"`.
- Code blocks are TypeScript unless stated otherwise.
- "Schema" (capital-S in prose) refers to any instance of the `Schema<T>` base
  class the object returned by every `s.*()` builder function.
- Method signatures are written as `methodName(args): ReturnType` using the
  types as declared in source, not the erased JavaScript runtime signature.
