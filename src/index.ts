import {s} from "./schema.js";

const schema = s.string();
const value = schema.parse("Hello validator! ");
console.log(value);
