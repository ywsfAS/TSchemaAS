# API Reference: Structures

## `s.object(shape)` → `ObjectSchema<S>`

Validates that a value is a non `null` object, then validates each key of
`shape` against the corresponding key of the input.

```ts
const personSchema = s.object({
  name: s.string(),
  age: s.number(),
});

personSchema.parse({ name: "Youssef", age: 22 });
```

- Fails if the input is `null` or not typed `"object"`.
- Every key declared in `shape` is validated against `record[key]`
  (`undefined` if missing) required keys must therefore either receive a
  value or be wrapped in `.optional()` / given a `.default()`.
- Keys present on the input but **not** declared in `shape` are ignored (not
  stripped from a returned reference, but not validated either TSchemaAS
  does not currently support "strict"/no-extra-keys mode).

Object schemas can be nested and composed:

```ts
const teamSchema = s.object({
  teamName: s.string(),
  members: s.array(personSchema),
});
```

### `.pick(keys)` → `ObjectSchema`

Returns a new object schema containing only the selected keys.

```ts
const UserPreview = User.pick({ id: true, name: true });
```

### `.omit(keys)` → `ObjectSchema`

Returns a new object schema with the selected keys removed.

```ts
const UserWithoutEmail = User.omit({ email: true });
```

### `.partial()` → `ObjectSchema`

Returns a new object schema where **every** key is wrapped in `.optional()`.

```ts
const PartialUser = User.partial();
// every field of PartialUser is now optional
```

### `.extend(shape)` → `ObjectSchema`

Returns a new object schema merging the original shape with `shape`. Keys in
`shape` override same-named keys from the original.

```ts
const AdminUser = User.extend({
  role: s.literal("admin"),
});
```

For `.pick` / `.omit`, keys are selected with a partial map of
`{ [key]: true }` (only truthy keys are considered).

---

## `s.array(itemSchema)` → `ArraySchema<T>`

Validates that a value is an `Array`, then validates each element against
`itemSchema`.

```ts
const numbersSchema = s.array(s.number());
numbersSchema.parse([1, 2, 3]); // [1, 2, 3]
numbersSchema.parse([1, "2", 3]); // throws element 1 fails
numbersSchema.parse("not an array"); // throws "The type is incompatible with any[]"
```

Chainable refinements: `.min()`, `.max()`, `.startsWith()`, `.endsWith()`,
`.includes()` (see [Refinements](./refinements.md) array refinements
accept either a single element or a sub-sequence).

---

## `s.union(schemas)` → `UnionSchema<T>`

Validates that a value matches **at least one** of the given schemas, tried
in order. The inferred type is the union of each branch's inferred type.

```ts
const idSchema = s.union([s.string(), s.number()]);

idSchema.parse("abc-123"); // ok
idSchema.parse(42); // ok
idSchema.parse(true); // throws "Expected a value in the union"

type Id = s.infer<typeof idSchema>; // string | number
```

Each branch is checked independently with its own error collector, so a
failing branch does not leak issues into the final error unless **every**
branch fails.

---

## `s.lazy(fn)` → `Lazy<T>`

Defers schema construction to call time, so you can reference a schema
before it's fully defined most commonly for **recursive** or mutually
referential structures.

```ts
import type { Schema } from "tschemaas";

type Category = {
  name: string;
  children: Category[];
};

const categorySchema: Schema<Category> = s.object({
  name: s.string(),
  children: s.array(s.lazy(() => categorySchema)),
}) as unknown as Schema<Category>;
```

`Lazy` forwards `_tryParse` to whatever schema `fn()` returns at validation
time, so it behaves identically to the wrapped schema for `.parse()` /
`.tryParse()` purposes.
