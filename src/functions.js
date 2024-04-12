/* Overview of functions in JavaScript */

/* Functions are defined */
function hello() {
  console.log("Hello, World!");
}
console.log(hello); // [Function: hello]

/* And are called later */
hello(); // Hello, World!

console.log();

/* Functions take parameters */
function sayHello(person) {
  console.log("Hello,", person);
}
/* And are called with many inputs */
sayHello("Rob"); // Hello, Rob
sayHello("Peter"); // Hello, Peter
sayHello(true); // Hello, true

console.log();

/* Parameters can be optional. And docstrings make things better! */
/**
 * @param word {string} The word to say hello to
 * @param useComma {boolean} Whether or not to include a comma
 */
function betterHello(word, useComma = true) {
  console.log(`Hello${useComma ? "," : ""} ${word}`);
}
/* Hover over the function calls to see */
betterHello("World!"); // Hello, World!
betterHello("again", false); // Hello again
/* Be carefule! I still work! */
betterHello(14, false); // Hello, 14

console.log();

/* Arrow functions are defined "inline" */
// () => {}
const arrowHello = () => {
  console.log("Hello, World!");
  return undefined;
};
console.log(arrowHello); // [Function: arrowHello]
arrowHello(); // Hello, World!

/* Arrow functions can automatically return */
const add = (x, y = 5) => x + y;
function addFunc(x, y) {
  return x + y;
}
console.log(add(0, 5), add(1, 4), add(2, 3)); // 5 5 5

/* You've already seen them! */
const array = [6, 7, 8, 9, 10];
const newArray = array.map((val, idx) => val + idx);
console.log(array, newArray); // [ 6, 7, 8, 9, 10 ] [ 6, 8, 10, 12, 14 ]

/* Returning objects requires parenthesis */
// const makeObject = (key, value) => { [key]: value };
const makeObject = (key, value) => ({ [key]: value });
// { '0': 5 } { '1': 4 } { '2': 3 }
console.log(makeObject(0, 5), makeObject(1, 4), makeObject(2, 3));

function useMe() {
  console.log("I'm defined but never used!");
}
