/* Overview of primitives and data structures in JavaScript */

/** Primitives are the most basic forms of data in a programming language
 * https://developer.mozilla.org/en-US/docs/Glossary/Primitive
 *
 * String: A sequence of characters used to represent text
 * Number: A numeric datatype (JS always uses a double)
 * Boolean: A logical datatype, it only holds the value true OR false
 * Null: Any variable that has a value of nothing
 * Undefined: Any variable that has not been assigned a value
 */
let string = "Hello!";
let number = 5;
let boolean = true;
let nothing = null;
let nonExistent;
console.log(string, number, boolean, nothing, nonExistent); // Hello, World! 5 true null undefined

/* Variables can be given new values! */
string = "Goodbye!";
number = 10;
boolean = false;
nonExistent = "I exist now";
console.log(string, number, boolean, nonExistent); // Goodbye! 10 false I exist now

/* Arrays https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array */
const strings = ["H", "e", "l", "l", "o"];
const numbers = [1, 2, 3, 4, 5];
const booleans = [true, true, true, false, true, false];
// console.log(strings, numbers, booleans); // ["H", "e", "l", "l", "o"] [1, 2, 3, 4, 5] [true, true, true, false, true, false]

strings[0] = "J"; // Index
numbers.push(6); // Array manipulation
booleans[1] = "mixed"; // Mix and match primitive types!
const stringsLength = strings.length; // Size property

// ["J", "e", "l", "l", "o"] [1, 2, 3, 4, 5, 6] [true, "mixed", true, false, true, false] 5
// console.log(strings, numbers, booleans, stringsLength);

/* Objects https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object */
const object = {
  key: "value",
  count: 10,
  isArray: false,
  choices: ["1", "2", "3"],
};

// { key: 'value', count: 10, isArray: false, choices: [ '1', '2', '3' ] } value
// console.log(object, object.key);

object["key"] = "new value"; // Index manipulation
object.count = object.count + 1; // Key manipulation
object["nested"] = {
  structure: true, // Objects can be nested!
};
delete object.choices; // Delete a proprty
let keyCheck = "isArray" in object; // Check property exists

/*
{
    key: 'new value',
    count: 11,
    isArray: false,
    nested: { structure: true }
} true
*/
// console.log(object, keyCheck);
// console.log();
