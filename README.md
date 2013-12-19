Express async helpers to reduce some endpoint complexity. Injected into res via middleware. 

-------

Available methods:
+ `res.renderWhenDone(view, functionHash)`
+ `res.jsonWhenDone(functionHash)`
+ `res.asyncProcess(functionHash, callback)`

The function hash is a number of properties whose values are functions with a callback pattern of (err, result). Upon completion the hash is transformed into the results of each function, and handled according to the helper called:
+ `renderWhenDone` provides the hash to the view.
+ `jsonWhenDone` returns the hash to the client as json.
+ `asyncProcess` returns the hash to the callback given.

The function hash can contain non-function entities which will be merged into the final result after the functions themselves have been processed. If your function requires arguments, pass them in as an array wherein the first item is the function. See below (or test.js) for an example.


-----

## Using

```
npm install res-async
```

Setup:
```javascript
//... app config

app.use(express.methodOverride());
app.use(require('res-async'));
app.use(app.router);

//... more app config
```

Use (see test.js):
```javascript
app.get('/cool', function (req, res) {
  
  res.renderWhenDone('somecoolview', {
    propOne: someAsyncMethod,
    justAString: "I'm not a function",
    faveFood: someAsyncQuery,
    argsExample: [delaySquare, 5]
  });

});
```
