# TSchemaAS

A lightweight schema validation library built with TypeScript.

TSchema allows you to define the structure of your data once and use the same schema for runtime validation and TypeScript type inference.

## Example

```ts
import { s } from "./schema.js";

const userSchema = s.object({
  name: s.string(),
  id: s.number(),
});

const user = userSchema.parse({
  name: "Youssef",
  id: 10,
});
```

## Project Structure

```
TSchemaAS/
├── src/
│   ├── schemas/
│   │   ├── boolean-schema.ts
│   │   ├── number-schema.ts
│   │   ├── object-schema.ts
│   │   ├── schema.ts
│   │   └── string-schema.ts
│   ├── schema.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```
