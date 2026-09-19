# Type Inference

TSchemaAS's core value proposition is defining validation logic once and
deriving the static TypeScript type from it, instead of maintaining a
hand-written `interface` alongside a separate validator.

## `s.infer<T>`

```ts
namespace s {
  export type infer<T> = inferType<T>;
}
```

`s.infer<typeof schema>` resolves to the type that `schema.parse(...)`
returns.

```ts
const userSchema = s.object({
  id: s.number(),
  name: s.string(),
  tags: s.array(s.string()),
  bio: s.string().optional(),
});

type User = s.infer<typeof userSchema>;
// {
//   id: number;
//   name: string;
//   tags: string[];
//   bio?: string;
// }
```

## How resolution works

`inferType<T>` (in `src/types.ts`) branches on what `T` is:

```ts
type inferType<T> = T extends SchemaObjectShape
  ? InferObjectSchemaType<T>
  : T extends Schema<any>
    ? InferSchemaType<T>
    : never;
```

- If `T` is a raw shape object (`Record<string, Schema<any>>`, as passed to
  `s.object()`), each property is inferred individually and assembled into
  an object type.
- If `T` is a `Schema<any>` instance (the common case any `s.*()` builder
  result), the type is extracted from the class's generic parameter via
  `InferSchemaType<T> = T extends Schema<infer S> ? S : never`.

This means every concrete schema class carries its output type as its own
generic parameter (`StringSchema extends Schema<string>`,
`ArraySchema<T> extends Schema<InferSchemaType<T>[]>`, `ObjectSchema<S>
extends Schema<InferObjectSchemaType<S>>`, etc.), and modifiers/refinements
preserve or adjust that parameter (e.g. `Optional<T> extends
Schema<inferType<T> | undefined>`).

## Effect of modifiers and structures on the inferred type

| Wrapper                         | Effect on `s.infer<...>`                                                    |
| ------------------------------- | --------------------------------------------------------------------------- |
| `.optional()`                   | Adds `\| undefined`                                                         |
| `.nullable()`                   | Adds `\| null`                                                              |
| `.default(v)`                   | No `undefined` in the output type (a value is always guaranteed)            |
| `s.array(item)`                 | `InferOf<item>[]`                                                           |
| `s.union([a, b])`               | `InferOf<a> \| InferOf<b>`                                                  |
| `s.literal("x")`                | The literal type `"x"`, not `string`                                        |
| `s.enum([...values])`           | A union of the literal values                                               |
| `s.object(shape).pick({...})`   | Object type restricted to the picked keys                                   |
| `s.object(shape).omit({...})`   | Object type with the omitted keys removed                                   |
| `s.object(shape).partial()`     | Every key becomes optional (`\| undefined`)                                 |
| `s.object(shape).extend({...})` | Merged object type, with `.extend()`'s keys overriding same-named originals |

Because these are all ordinary TypeScript type-level computations, they
compose the same way the runtime schemas do build the schema the way you
want the data shaped, and the type follows automatically.
