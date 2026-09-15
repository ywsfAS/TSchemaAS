import {s} from "./schema.js";

// user schema definition
const schema = s.object({
    name : s.string(),
    id : s.number()
});

// valid user format
const user = {
    name : "youssef",
    id : 10
}
console.log(schema.parse(user),schema.tryParse(user));

// invalid user format (missing a key)
const user1 = {
    name : "messi"
}
console.log(schema.tryParse(user1));

const user2 = {
    name : "messi",
    id : "greatest"
}
console.log(schema.tryParse(user2));

// not typeof object
const n = 10;

console.log(schema.tryParse(n));

