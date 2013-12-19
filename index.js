var async = require('async');

module.exports = function (req, res, next) {

  /**
   * asyncProcess takes the options hash and splits it into two sets: one for nonFunctions and one for functions
   * nonFunctions will be merged into the final result, the functions will be run through async.parallel
   * completed results are returned to callback as options hash matching original, only now with final values
   */
  res.asyncProcess = function (options, next) {
    var functions = {},
      nonFunctions = {};

    Object.keys(options).forEach(function (key) {
      if(!options.hasOwnProperty(key)) return;
      var item = options[key];

      if(typeof item !== 'function' && (!Array.isArray(item) || typeof item[0] !== 'function')) {
        nonFunctions[key] = item;
        return;
      }

      item = Array.isArray(item) ? item : [item];

      // This was a function! So wrap it up and doctor it so the results will get passed appropriately
      functions[key] = function (callback) {
        var itemArguments = [],
          itemFunction = item.shift(),
          finalCallback = callback;

        // If the last item in the array is already a callback,
        // we need to wrap it in order to pass the final callback to async.parallel into it!
        if(item.length && typeof item[item.length - 1] === 'function') {
          var originalCallback = item.pop();

          // Make a new finalCallback that calls the original, with another callback parameter so it can deliver the results!
          finalCallback = function (err, result) {
            originalCallback.call(this, err, result, callback);
          };
        }

        // combine all the doctored callback into the arguments list and apply it.
        itemArguments = item.concat([finalCallback]);
        itemFunction.apply(this, itemArguments);
      };
    });

    // Now that functions have been processed, pass into async.parallels to run em async and return results
    async.parallel(functions, function (err, results) {

      // Merge the nonFunctions into the result set
      Object.keys(nonFunctions).forEach(function (key) {
        results[key] = nonFunctions[key];
      });

      // Better have passed in a callback.
      if(typeof next === 'function') {
        return next(err, results);
      }

    });
  };

  // Processes through asyncProcess and then renders results as json.
  res.jsonWhenDone = function (options, next) {
    res.asyncProcess(options, function (err, results) {
      res.json(results);
      if(typeof next === 'function') next(err);
    });
  };

  // Process through asyncProcess and renders results with the passed in view.
  res.renderWhenDone = function (view, options, next) {
    res.asyncProcess(options, function (err, results) {
      res.render(view, results);
      if(typeof next === 'function') next(err);
    });
  };

  next();
};
