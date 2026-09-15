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

const arraySchema = s.array(s.string());

// valid array of strings
const names = ["youssef", "badr", "adam"];

console.log(arraySchema.parse(names));
console.log(arraySchema.tryParse(names));

// invalid array (contains a number)
const names1 = ["youssef", 10, "messi"];

console.log(arraySchema.tryParse(names1));

// invalid format (not an array)
const names2 = "youssef";

console.log(arraySchema.tryParse(names2));
