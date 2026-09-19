# API Reference: Modifiers

Modifiers wrap any schema to change how `undefined` / `null` / missing
values are treated. They are attached to `Schema.prototype` at import time
(see [Architecture](../architecture.md)), so they're available on **every**
schema primitives, objects, arrays, unions, etc.

## `.optional()` → `Optional<this>`

Allows the value to be `undefined`, in addition to whatever the wrapped
schema accepts. If the value is `undefined`, validation short-circuits and
succeeds without running the wrapped schema or its refinements.

```ts
const website = s.string().url().optional();

website.parse(undefined); // undefined
website.parse("https://example.com"); // "https://example.com"
website.parse("not a url"); // throws
```

Type impact: `s.infer<typeof website>` is `string | undefined`.

## `.nullable()` → `Nullable<this>`

Allows the value to be `null`, in addition to whatever the wrapped schema
accepts. If the value is `null`, validation short-circuits and succeeds.

```ts
const middleName = s.string().nullable();

middleName.parse(null); // null
middleName.parse("Ali"); // "Ali"
```

Type impact: `s.infer<typeof middleName>` is `string | null`.

## `.default(value)` → `Default<this>`

Substitutes `value` whenever the input is `undefined`, then validates the
(possibly substituted) value against the wrapped schema.

```ts
const active = s.boolean().default(true);

active.parse(undefined); // true
active.parse(false); // false
```

Unlike `.optional()`, the inferred output type of `.default()` does **not**
include `undefined` the default guarantees a concrete value is always
returned.

## Combining modifiers

Modifiers can be chained with refinements and with each other in any order,
since each modifier returns a full `Schema<T>` instance:

```ts
s.number().positive().optional(); // number | undefined, positive if present
s.string().email().nullable(); // string | null, valid email if present
s.array(s.string()).min(1).default([]); // string[], defaults to [] if missing
```

> **Note:** a value of `null` passed to a schema wrapped only in
> `.optional()` (not `.nullable()`) will fail validation, and vice versa
> the two modifiers only short-circuit for the value they're each named
> after. Stack both if you need to accept `T | null | undefined`.
