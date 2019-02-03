// NB Box is essentialy an Identity functor
const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
});

// Either
// const Either = Right || Left
const Right = x => ({
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
});
const Left = x => ({
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
});

const Either = Right || Left;

const fromNullable = x => (x ? Right(x) : Left(null));

const fs = require("fs");
//Imperative:
// const getPort = () => {
//   try {
//     const str = fs.readFileSync("config.json");
//     const config = JSON.parse(str);
//     return config.port;
//   } catch (e) {
//     return 3005;
//   }
// };

//Functional:
const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const getPort = () =>
  tryCatch(() => fs.readFileSync("config.json")) // Right('')
    // .map(c => JSON.parse(c))
    // .map(c => tryCatch(() => JSON.parse(c))) // Right(Right) or Right(Left)
    .chain(c => tryCatch(() => JSON.parse(c))) // Right or Left
    .fold(e => 5000, p => p.port);

result = getPort();
console.log(result);
