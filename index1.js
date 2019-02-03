// NB Box is essentialy an Identity functor
const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
});

// const nextCharFromString = str =>
//   [str]
//     .map(s => s.trim())
//     .map(s => parseInt(s, 10))
//     .map(i => i + 1)
//     .map(i => String.fromCharCode(i));

const nextCharFromString = str =>
  Box(str)
    .map(s => s.trim())
    .map(s => parseInt(s, 10))
    .map(i => i + 1)
    .map(i => String.fromCharCode(i))
    .fold(c => c.toLowerCase());
// .map(String.toLowerCase); // return error f not defined

let result = nextCharFromString(" 64      ");
console.log("lowercase of code 64 + 1 is: ", result);

// Imperative:
// const moneyToFloat = str => parseFloat(str.replace(/\$/g, ""));
// Functional:
const moneyToFloat = str => Box(str.replace(/\$/g, "")).map(s => parseFloat(s));

// Imperative
// const percentToFloat = str => {
//   const replaced = str.replace(/\%/g, "");
//   const number = parseFloat(replaced);
//   return number * 0.01;
// }
//
// Functional:
const percentToFloat = str =>
  Box(str.replace(/\%/g, ""))
    .map(s => parseFloat(s))
    .map(n => n * 0.01);

// Imperative:
// const applyDiscount = (price, discount) => {
//   const cost = moneyToFloat(price).fold(n => n);
//   const savings = percentToFloat(discount).fold(n => n);
//   return cost - cost * savings;
// };

// Functional:
// const applyDiscount = (price, discount) =>
//   moneyToFloat(price)
//     .map(cost => percentToFloat(discount).map(savings => cost - cost * savings))
//     .fold(n => n.fold(n => n));
const applyDiscount = (price, discount) =>
  moneyToFloat(price).fold(cost =>
    percentToFloat(discount).fold(savings => cost - cost * savings)
  );

result = applyDiscount("$100", "50%");
console.log("discounted price: ", result);

// Either
// const Either = Right || Left
const Right = x => ({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
});
const Left = x => ({
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
});

const Either = Right || Left
;
result = Right(3)
  .map(x => x * 2)
  .map(x => x + 1)
  .fold(x => "error", x => x);
console.log("Right(3): ", result);
result = Left(3)
  .map(x => x * 2)
  .map(x => x + 1)
  .fold(x => "error", x => x);
console.log("Left(3): ", result);

const fromNullable = x => (x ? Right(x) : Left(null));
const findColor = name =>
  fromNullable({ red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name]);

// const findColor = name => {
//   const found = { red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name];
//   return found ? Right(found) : Left(null);
// };
result = findColor("blue")
  .map(c => c.slice(1))
  .fold(x => "no color", x => x);

console.log("blue code is: ", result);

result = findColor("green")
  .map(c => c.slice(1))
  .fold(x => "no color", x => x);

console.log("green code is: ", result);
