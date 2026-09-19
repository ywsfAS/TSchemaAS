# API Reference: Errors

TSchemaAS accumulates **all** validation failures for a single `parse()` /
`tryParse()` call into one error object, rather than throwing on the first
failing field. This lets you report every problem with the input at once
(e.g. for a form with multiple invalid fields).

## `ErrorSchema`

`ErrorSchema` (`src/errors/error-schema.ts`) extends the built-in `Error`
class and is the object thrown by `.parse()` or returned in
`tryParse()`'s `error` field.

```ts
class ErrorSchema extends Error {
  readonly issues: readonly Issue[];

  addIssue(issue: Issue): void;
  clear(): void;
  isEmpty(): boolean;
}
```

| Member            | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `issues`          | A read-only, deep-cloned snapshot of every `Issue` collected during validation.                         |
| `addIssue(issue)` | Appends an issue. Used internally by schemas and refinements you generally won't call this yourself.    |
| `clear()`         | Empties the issue list.                                                                                 |
| `isEmpty()`       | `true` if no issues have been recorded.                                                                 |
| `.name`           | Always `"SchemaError"`.                                                                                 |
| `.message`        | Always `"Validation failed"` (inherited `Error` message inspect `.issues` for details, not `.message`). |

```ts
try {
  schema.parse(badInput);
} catch (err) {
  if (err instanceof ErrorSchema) {
    for (const issue of err.issues) {
      console.log(`${issue.path.join(".")}: ${issue.message}`);
    }
  }
}
```

## `Issue`

Each validation failure a wrong base type or a failed refinement is
recorded as one `Issue`:

```ts
type Path = (string | number)[];

type Issue = {
  path: Path;
  message: string;
  code: string;
};
```

| Field     | Description                                                                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`    | Location of the failing value, as an array of keys/indices from the root. E.g. `["members", 2, "email"]` for the third array element's `email` field. An empty array means the root value itself failed. |
| `message` | Human-readable description of the failure (e.g. `"Expected a string"`, `"Invalid email format"`).                                                                                                        |
| `code`    | Reserved for a machine-readable error code. **Currently always an empty string** in this version of the library don't branch on it yet.                                                                  |

## `SafeParseResult<T>`

The return type of `.tryParse()`:

```ts
type SafeParseResult<T> =
  { success: true; data: T } | { success: false; error: ErrorSchema };
```

```ts
const result = schema.tryParse(input);

if (result.success) {
  // result.data is T
} else {
  // result.error is an ErrorSchema
  console.log(result.error.issues);
}
```

## Error propagation through nested schemas

- **Objects** validate every declared key even after one fails, and merge
  every child's issues (with the child's key appended to `path`) into the
  same `ErrorSchema`.
- **Arrays** behave the same way per-index one invalid element does not
  stop the rest of the array from being checked.
- **Unions** validate each branch against its own throwaway `ErrorSchema`;
  those per-branch issues are discarded, and only a single top-level
  `"Expected a value in the union"` issue is added if _every_ branch fails.
- **`optional()` / `nullable()` / `default()`** short-circuit to success (no
  issues added) when the value is `undefined` / `null` / defaulted,
  respectively; otherwise they delegate to the wrapped schema.
