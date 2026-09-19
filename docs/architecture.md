# Architecture

## Project layout

```
src/
├── index.ts            # Example/demo script (not the package entry point)
├── schema.ts            # The `s` builder object & `s.infer` namespace
├── types.ts              # SchemaObjectShape, inferType, Issue, Path, etc.
├── schemas/               # Schema<T> base class + one class per schema kind
│   ├── schema.ts            # abstract Schema<T> — parse/tryParse/refine host
│   ├── string-schema.ts
│   ├── number-schema.ts
│   ├── boolean-schema.ts
│   ├── object-schema.ts     # + pick / omit / partial / extend
│   ├── array-schema.ts
│   ├── literal-schema.ts
│   ├── enums-schema.ts
│   ├── union-schema.ts
│   └── lazy-schema.ts
├── modifiers/              # .optional() / .nullable() / .default()
│   ├── optional.ts
│   ├── nullable.ts
│   └── default.ts
├── refinements/            # chainable validation rules
│   ├── refinement.ts        # abstract Refinement<T> base
│   ├── min.ts / max.ts
│   ├── regex.ts / email.ts / url.ts
│   ├── positive-negative.ts / nan-finit.ts
│   ├── startswith.ts / endsWith.ts / includes.ts
│   └── refine.ts            # generic .refine(predicate, message)
└── errors/
    └── error-schema.ts      # ErrorSchema + Issue accumulation
```

## The validation pipeline

Every schema class implements one required method:

```ts
abstract _tryParse(value: unknown, errors: ErrorSchema, path: Path): InternalResult<T>;
```

`Schema<T>.parse()` and `Schema<T>.tryParse()` are both thin, non-overridable
wrappers around `_tryParse`: they create a fresh `ErrorSchema` and an empty
`path`, call `_tryParse`, and then either throw or return based on whether
any issues were recorded. Concrete classes (`StringSchema`, `ObjectSchema`,
...) only need to implement the type-check-and-recurse logic in
`_tryParse` the throw-vs-return-result branching is handled once, in the
base class.

Composite schemas (`ObjectSchema`, `ArraySchema`, `UnionSchema`, modifiers)
call `_tryParse` on their child schema(s), passing along the same `errors`
collector and an extended `path`, so a single `ErrorSchema` accumulates
every issue across an arbitrarily nested structure in one pass.

## Refinements: `Refinement<T>`

A `Refinement<T>` is a small object with a `check(value: T): boolean` method
and a `message`. Every `Schema<T>` instance holds a `_refinements:
Refinement<T>[]` array (protected, populated by chained methods like
`.min()`), and `runRefinements()` (also on the base class) runs each one
after the base type check passes, adding an `Issue` for every refinement
that returns `false`.

## Why refinements/modifiers are attached via `declare module` + prototype patching

Refinements like `.email()` only make sense on `StringSchema`, and
`s.number().email` shouldn't type-check. But `StringSchema`, `NumberSchema`,
etc. are defined in `schemas/`, while refinements live in a separate
`refinements/` folder and refinements would need to import the schema
classes, while the schema classes would need to know about every possible
refinement method, creating a circular dependency.

The library resolves this with TypeScript's [declaration
merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html):
each refinement/modifier file does two things:

```ts
// 1. Extend the class's *type* via `declare module`, so TypeScript
//    knows the method exists on that class (compile-time only).
declare module "../schemas/string-schema.js" {
  interface StringSchema {
    email(): this;
  }
}

// 2. Actually attach the method at runtime via prototype assignment.
StringSchema.prototype.email = function () {
  this._refinements.push(new Email());
  return this;
};
```

This keeps each refinement/modifier self-contained (its own file owns both
the class and the implementation) while avoiding import cycles between
`schemas/` and `refinements/` / `modifiers/`. The practical implication for
consumers: **every refinement/modifier module must be imported somewhere in
the module graph for its methods to exist at runtime.** Importing `s` from
`schema.ts` pulls in all of them, so this is transparent as long as you
always import the library through `s` rather than importing individual
schema classes directly.

## Universal vs type-specific methods

| Where it's attached             | Applies to          | Examples                                                                                            |
| ------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| `Schema.prototype` directly     | Every schema        | `.optional()`, `.nullable()`, `.default()`, `.refine()`                                             |
| `StringSchema.prototype`        | String schemas only | `.min()`, `.max()`, `.email()`, `.url()`, `.regex()`, `.startsWith()`, `.endsWith()`, `.includes()` |
| `NumberSchema.prototype`        | Number schemas only | `.min()`, `.max()`, `.positive()`, `.negative()`, `.finite()`, `.nan()`                             |
| `ArraySchema.prototype`         | Array schemas only  | `.min()`, `.max()`, `.startsWith()`, `.endsWith()`, `.includes()`                                   |
| `ObjectSchema` instance methods | Object schemas only | `.pick()`, `.omit()`, `.partial()`, `.extend()` (defined directly in the class, not patched)        |

Note that `.min()`/`.max()` are three separate implementations
(`MinString`/`MinNumber`/`MinArray`, `MaxString`/`MaxNumber`/`MaxArray`)
sharing the same method name across different prototypes not one generic
implementation.
