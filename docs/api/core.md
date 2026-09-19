# API Reference: Core

## The `s` builder

`s` is the single entry point into the library, exported from `schema.ts`
(re-exported as the package root). It's a plain object of factory functions
plus a namespace carrying the `s.infer<T>` type helper.

```ts
import { s } from "tschemaas";
```

| Builder               | Signature                                                          | Returns                                         |
| --------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `s.string()`          | `(): StringSchema`                                                 | a string schema                                 |
| `s.number()`          | `(): NumberSchema`                                                 | a number schema                                 |
| `s.boolean()`         | `(): BooleanSchema`                                                | a boolean schema                                |
| `s.object(shape)`     | `(shape: SchemaObjectShape): ObjectSchema`                         | an object schema                                |
| `s.array(itemSchema)` | `<T extends Schema<any>>(s: T): ArraySchema<T>`                    | an array schema                                 |
| `s.literal(value)`    | `<T extends string \| number \| boolean>(v: T): LiteralSchema<T>`  | a single exact-value schema                     |
| `s.enum(values)`      | `<T extends (string \| number \| boolean)[]>(v: T): EnumSchema<T>` | a schema matching one of a fixed set of values  |
| `s.union(schemas)`    | `<T extends Schema<any>[]>(u: T): UnionSchema<T>`                  | a schema matching any one of several schemas    |
| `s.lazy(fn)`          | `<T>(fn: () => Schema<T>): Lazy<T>`                                | a deferred schema, for recursive structures     |
| `s.infer<T>`          | _(type only)_                                                      | extracts the static TypeScript type of a schema |

See [Primitives](./primitives.md) and [Structures](./structures.md) for
per-builder details and type-specific refinements.

---

## `Schema<T>` (abstract base class)

Every value returned by an `s.*()` builder and every modifier/refinement
result is a subclass of `Schema<T>`, defined in `src/schemas/schema.ts`.
This is what makes chaining work: calling `.optional()`, `.nullable()`,
`.refine()`, etc. on _any_ schema is always valid, because those methods are
defined once on `Schema<T>` itself (see [Architecture](../architecture.md)
for how this is wired up at runtime).

### `parse(value: unknown): T`

Validates `value` against the schema.

- On success, returns the validated data, typed as `T`.
- On failure, **throws** the accumulated `ErrorSchema` (see
  [Errors](./errors.md)).

```ts
const age = s.number().positive().parse(21); // 21
s.number().positive().parse(-1); // throws ErrorSchema
```

### `tryParse(value: unknown): SafeParseResult<T>`

Same validation as `parse`, but never throws. Returns:

```ts
type SafeParseResult<T> =
  { success: true; data: T } | { success: false; error: ErrorSchema };
```

```ts
const result = s.number().positive().tryParse(-1);
if (!result.success) {
  console.log(result.error.issues); // Issue[]
}
```

### `refine(predicate, message): this`

Attaches a custom validation rule to the schema. See
[Refinements → Custom refinements](./refinements.md#custom-refinements).

### Every subclass implements `_tryParse`

Internally, `parse`/`tryParse` both delegate to a protected
`_tryParse(value, errors, path)` method that each concrete schema class
(`StringSchema`, `NumberSchema`, `ObjectSchema`, ...) implements. This is an
internal extension point application code should not call it directly and
should treat it as unstable.
