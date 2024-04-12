/* Overview of loops in JavaScript */

/** For loops run until the condition is false */
// for (initialization; condition; afterthought)
for (let i = 0; i < 4; i++) {
  console.log("i is equal to", i);
}

console.log();

/** While loops run until the condition is false */
// while(condition)
let j = 0;
while (j < 4) {
  console.log("j is equal to", j);
  j++;
}

console.log();
const array = [6, 7, 8, 9, 10];

/** .map loops over the array and builds a new one */
const newArray = array.map((value, index) => {
  console.log(`Element at index ${index} has value ${value}`); // Template strings??? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  // console.log("Element at index", index, "has the value", value);
  return value + index;
});
// [ 6, 7, 8, 9, 10 ] [ 6, 8, 10, 12, 14 ]
console.log(array, newArray);

/** .forEach loops over the array with no return */
const noReturn = array.forEach((value, index) => {
  console.log(`Element at index ${index} has value ${value}`); // Template strings??? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
});
// [ 6, 7, 8, 9, 10 ] undefined
console.log(array, noReturn);

console.log();
console.log("Watch me run forever");
while (true) {
  console.log(new Date());
}
console.log("You'll never reach me!");
