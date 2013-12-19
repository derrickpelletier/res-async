var express = require('express');
var app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

// Right here!
app.use(require('./index'));
// yow!

app.use(app.router);


app.get("/cool", function (req, res) {
  
  res.jsonWhenDone({
    day: someAsyncMethod,
    faveFood: someAsyncQuery,
    argsExample: [delaySquare, 5]
  });

});


app.listen(3000, function () {
  console.log("listening!");
});


var someAsyncMethod = function (next) {
  setTimeout(function () { next(null, "Monday") }, 1500);
}

var someAsyncQuery = function (next) {
  setTimeout(function () { next(null, "Pizza") }, 1000);
}

var delaySquare = function (input, next) {
  setTimeout(function () { next(null, input * input) }, 500);
}