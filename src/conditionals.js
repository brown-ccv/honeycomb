/**
 * Overview of conditionals in JavaScript
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals
 */

const a = "a";
const b = "b";
const nothing = null;
const nonExistent = undefined;
const trueValue = true;
const five = 5;

/* == means "loose equality" */

console.log("Loose", a == b, nothing == nonExistent, 0 == "0"); // loose false true true

/* === means "strict equality" */
console.log("Strict", a === b, nothing === nonExistent, 0 === "0"); // Strict false false false
console.log();

/* ! means "not" */
console.log("Not", trueValue, !trueValue, !!trueValue); // Not true false true
console.log("Notequal", a !== b, nothing !== nonExistent, 0 !== "0"); // Notequal true true true
console.log();

/* < means "less than" */
console.log("Less", 4 < five, 5 < five); // Less true false
/* > means "greater than" */
console.log("Greater", 4 > five, 5 > five); // Greater false false
/* "Or equal to" only needs one = */
console.log("OrEqual", 4 <= five, 5 <= five, 5 >= five, 6 >= five); // OrEqualTo true true true true
console.log();

/* Control flow with if and else */
let maybeValue;
maybeValue = 5;
if (maybeValue !== undefined) {
  // This is what executes!
  console.log("maybeValue is equal to something!", maybeValue);
} else {
  console.log("maybeValue has not been defined yet");
}

/* You can chain if statements */
let honeycomb = "honeycomb";
if (honeycomb === "this") {
  console.log("honeycomb is equal to this");
} else if (honeycomb == "that") {
  console.log("honeycomb is equal to that");
} else {
  // This is what executes!
  console.log("honeycomb is not equal to this or that");
}
console.log();

/* Use a switch if you need more options */
let num = 1;
switch (num) {
  case 1:
    console.log("num is equal to 1");
    break;
  case 2:
    console.log("num is equal to 2");
    break;
  case 3:
    // This is what executes!
    console.log("num is equal to 3");
    break;
  default:
    // I run if num is not yet accounted for!
    throw new Error("num was a different value: ", num);
}
console.log();

/* Use a ternary for very short conditionals */
/* [conditional check] ? [value if true] : [value if false] */
const checkedValue = num === 5 ? "yes" : "no";
console.log(checkedValue); // no
