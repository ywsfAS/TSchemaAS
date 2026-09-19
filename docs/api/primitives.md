# API Reference: Primitives

Primitive schemas validate a single JS value against a base JavaScript type
(or an exact value / set of values), and expose the type-specific chainable
refinements listed in [Refinements](./refinements.md).

## `s.string()` → `StringSchema`

Validates that a value is a `string` (via `typeof value === "string"`).

```ts
const name = s.string();
name.parse("Youssef"); // "Youssef"
name.parse(42); // throws "Expected a string"
```

Chainable refinements: `.min()`, `.max()`, `.regex()`, `.email()`, `.url()`,
`.startsWith()`, `.endsWith()`, `.includes()`.

## `s.number()` → `NumberSchema`

Validates that a value is a `number` (via `typeof value === "number"`). Note
that this means `NaN` passes the base type check by default use `.nan()`
or `.finite()` to constrain further (see [Refinements](./refinements.md)).

```ts
const age = s.number();
age.parse(21); // 21
age.parse("21"); // throws "Expected a number"
```

Chainable refinements: `.min()`, `.max()`, `.positive()`, `.negative()`,
`.finite()`, `.nan()`.

## `s.boolean()` → `BooleanSchema`

Validates that a value is a `boolean`.

```ts
const active = s.boolean();
active.parse(true); // true
```

No type-specific refinements beyond the universal `.refine()`.

## `s.literal(value)` → `LiteralSchema<T>`

Validates that a value is **exactly equal** (`===`) to a single given
`string`, `number`, or `boolean` literal. The inferred type is the literal
itself, not the wider primitive type.

```ts
const role = s.literal("admin");
role.parse("admin"); // "admin"
role.parse("editor"); // throws "Expected a lateral of admin"

type Role = s.infer<typeof role>; // "admin"
```

## `s.enum(values)` → `EnumSchema<T>`

Validates that a value is one of a fixed list of `string` / `number` /
`boolean` literals.

```ts
const status = s.enum(["draft", "published", "archived"]);
status.parse("draft"); // "draft"
status.parse("deleted"); // throws "Expected a enum of draft,published,archived"

type Status = s.infer<typeof status>; // "draft" | "published" | "archived"
```

> Both `s.literal()` and `s.enum()` support `.refine()` and the universal
> modifiers (`.optional()`, `.nullable()`, `.default()`), but no type-specific
> refinements.
