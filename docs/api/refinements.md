# API Reference: Refinements

Refinements are extra validation rules chained onto a schema. Unlike
modifiers, most refinements are **type-specific**: they're only attached to
the schema classes they make sense for (e.g. `.email()` only exists on
`StringSchema`). The one exception is `.refine()`, which is universal.

All refinements run _after_ the base type check passes, and all of them
return `this`, so they're freely chainable.

## String refinements (`StringSchema`)

| Method                    | Signature                            | Behavior                                            |
| ------------------------- | ------------------------------------ | --------------------------------------------------- |
| `.min(n)`                 | `(n: number): this`                  | String length must be `>= n`                        |
| `.max(n)`                 | `(n: number): this`                  | String length must be `<= n`                        |
| `.regex(pattern, flags?)` | `(exp: string, opts?: string): this` | Must match `new RegExp(exp, opts)`                  |
| `.email()`                | `(): this`                           | Must match a standard email pattern                 |
| `.url()`                  | `(): this`                           | Must be parseable by the built-in `URL` constructor |
| `.startsWith(prefix)`     | `(m: string): this`                  | String must start with `prefix`                     |
| `.endsWith(suffix)`       | `(m: string): this`                  | String must end with `suffix`                       |
| `.includes(substring)`    | `(m: string): this`                  | String must contain `substring`                     |

```ts
s.string().min(2).max(50);
s.string().regex(/^[a-zA-Z0-9_]+$/.source); // regex() takes a pattern string, not a RegExp literal
s.string().email();
s.string().url();
s.string().startsWith("usr_");
```

> `.regex()` takes the pattern as a `string` (plus an optional flags
> string), matching `new RegExp(exp, opts)` pass `/pattern/.source` if you
> have a `RegExp` literal, or just write the pattern as a string directly.

## Number refinements (`NumberSchema`)

| Method        | Signature           | Behavior                             |
| ------------- | ------------------- | ------------------------------------ |
| `.min(n)`     | `(n: number): this` | Value must be `>= n`                 |
| `.max(n)`     | `(n: number): this` | Value must be `<= n`                 |
| `.positive()` | `(): this`          | Value must be `> 0`                  |
| `.negative()` | `(): this`          | Value must be `< 0`                  |
| `.finite()`   | `(): this`          | Value must satisfy `Number.isFinite` |
| `.nan()`      | `(): this`          | Value must satisfy `Number.isNaN`    |

```ts
s.number().min(0).max(100);
s.number().positive();
s.number().finite(); // rejects Infinity / -Infinity
```

> Note that `s.number()` on its own accepts `NaN` and `Infinity`, since it
> only checks `typeof value === "number"`. Add `.finite()` if you need to
> exclude non-finite values.

## Array refinements (`ArraySchema`)

| Method           | Signature           | Behavior                                                                                  |
| ---------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `.min(n)`        | `(n: number): this` | Array length must be `>= n`                                                               |
| `.max(n)`        | `(n: number): this` | Array length must be `<= n`                                                               |
| `.startsWith(x)` | `(m: any): this`    | Array must start with element `x`, or with the sub-sequence `x` if `x` is itself an array |
| `.endsWith(x)`   | `(m: any): this`    | Array must end with element `x`, or with the sub-sequence `x` if `x` is itself an array   |
| `.includes(x)`   | `(m: any): this`    | Array must contain element `x`, or contain the sub-sequence `x` if `x` is itself an array |

```ts
s.array(s.string()).min(1); // non-empty array
s.array(s.number()).max(10);
s.array(s.number()).startsWith(0); // first element === 0
s.array(s.number()).startsWith([0, 1]); // starts with the sequence [0, 1]
```

## Custom refinements

`.refine(predicate, message)` is defined on the `Schema<T>` base class, so
it's available on **every** schema (primitives, objects, arrays, unions...).

```ts
const evenNumber = s
  .number()
  .refine((val) => val % 2 === 0, "Number must be even");

evenNumber.parse(4); // 4
evenNumber.parse(5); // throws "Number must be even"
```

```ts
const passwordsMatch = s
  .object({ password: s.string(), confirm: s.string() })
  .refine((v) => v.password === v.confirm, "Passwords must match");
```

`predicate` receives the already-validated value (typed as `T`) and must
return a `boolean`. On `false`, an issue is added with `message` at the
current path; validation does not stop after a failed refinement other
refinements on the same schema still run so you can collect every failing
rule in one pass.
