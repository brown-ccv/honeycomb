/* Overview of conditionals in JavaScript */

let a = "a";
let b = "b";
let nothing = null;
let nonExistent = undefined;

/* == means "loose equality" */
// loose false true true
console.log("Loose", a == b, nothing == nonExistent, 0 == "0");

/* === means "strict equality" */
// Strict false false false
console.log("Strict", a === b, nothing === nonExistent, 0 === "0");

console.log();
let trueValue = true;

/* ! means "not" */
// Not true false true
console.log("Not", trueValue, !trueValue, !!trueValue);
// Notequal true true true
console.log("Notequal", a !== b, nothing !== nonExistent, 0 !== "0");

console.log();
let five = 5;

/* < means "less than" */
// Less true false
console.log("Less", 4 < five, 5 < five);

/* > means "greater than" */
// Greater false false
console.log("Greater", 4 > five, 5 > five);

/* "Or equal to" only needs one = */
// OrEqualTo true true true true
console.log("OrEqual", 4 <= five, 5 <= five, 5 >= five, 6 >= five);

console.log();
let maybeValue;
maybeValue = 5;

/* Control flow with if and else */
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
let num = 1;

/* Use a switch if you need more options */
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
// ([conditional check]) ? [value if true] : [value if false]
const checkedValue = num === 5 ? "yes" : "no";
// no
console.log(checkedValue);
