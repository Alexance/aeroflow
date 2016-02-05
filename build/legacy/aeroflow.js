(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.aeroflow = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _objectCreate, _objectCreate2;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AEROFLOW = 'Aeroflow';
  var ARRAY = 'Array';
  var BOOLEAN = 'Boolean';
  var CLASS = Symbol.toStringTag;
  var CONTEXT = 'Aeroflow.Context';
  var DATE = 'Date';
  var ERROR = 'Error';
  var FUNCTION = 'Function';
  var ITERATOR = Symbol.iterator;
  var NULL = 'Null';
  var NUMBER = 'Number';
  var PROMISE = 'Promise';
  var PROTOTYPE = 'prototype';
  var REGEXP = 'RegExp';
  var STRING = 'String';
  var SYMBOL = 'Symbol';
  var UNDEFINED = 'Undefined';
  var primitives = new Set([BOOLEAN, DATE, ERROR, NULL, NUMBER, REGEXP, STRING, SYMBOL, UNDEFINED]);
  var dateNow = Date.now;
  var mathFloor = Math.floor;
  var mathPow = Math.pow;
  var mathRandom = Math.random;
  var mathMin = Math.min;
  var maxInteger = Number.MAX_SAFE_INTEGER;
  var objectCreate = Object.create;
  var objectDefineProperties = Object.defineProperties;
  var objectDefineProperty = Object.defineProperty;
  var objectToString = Object.prototype.toString;

  var compare = function compare(left, right, direction) {
    return left < right ? -direction : left > right ? direction : 0;
  };

  var constant = function constant(value) {
    return function () {
      return value;
    };
  };

  var identity = function identity(value) {
    return value;
  };

  var noop = function noop() {};

  var classOf = function classOf(value) {
    return objectToString.call(value).slice(8, -1);
  };

  var classIs = function classIs(className) {
    return function (value) {
      return classOf(value) === className;
    };
  };

  var isBoolean = function isBoolean(value) {
    return value === true || value === false;
  };

  var isDefined = function isDefined(value) {
    return value !== undefined;
  };

  var isError = classIs(ERROR);

  var isFunction = function isFunction(value) {
    return typeof value == 'function';
  };

  var isInteger = Number.isInteger;
  var isNumber = classIs(NUMBER);
  var isPromise = classIs(PROMISE);

  var isUndefined = function isUndefined(value) {
    return value === undefined;
  };

  var tie = function tie(func) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      return func.apply(undefined, args);
    };
  };

  var falsey = function falsey() {
    return false;
  };

  var truthy = function truthy() {
    return true;
  };

  var toDelay = function toDelay(value, def) {
    switch (classOf(value)) {
      case DATE:
        value = value - dateNow();
        break;

      case NUMBER:
        break;

      default:
        value = +value;
        break;
    }

    return isNaN(value) ? def : value < 0 ? 0 : value;
  };

  var toFunction = function toFunction(value, def) {
    return isFunction(value) ? value : def;
  };

  var toNumber = function toNumber(value, def) {
    if (!isNumber(value)) {
      value = +value;
      if (isNaN(value)) return def;
    }

    return value;
  };

  var toError = function toError(value) {
    return isError(value) ? value : new Error(value);
  };

  var Context = function Context(data, flow) {
    _classCallCheck(this, Context);

    objectDefineProperties(this, {
      data: {
        value: data
      },
      flow: {
        value: flow
      }
    });
  };

  objectDefineProperty(Context[PROTOTYPE], CLASS, {
    value: CONTEXT
  });

  function emptyEmitter(result) {
    return function (next, done) {
      return done(result);
    };
  }

  function unsync(result, next, done) {
    switch (result) {
      case true:
        return false;

      case false:
        done(false);
        return true;
    }

    switch (classOf(result)) {
      case PROMISE:
        result.then(function (promiseResult) {
          if (!unsync(promiseResult, next, done)) next(true);
        }, function (promiseError) {
          return done(toError(promiseError));
        });
        break;

      case ERROR:
        done(result);
        break;
    }

    return true;
  }

  function scalarEmitter(value) {
    return function (next, done) {
      if (!unsync(next(value), done, done)) done(true);
    };
  }

  function aeroflowEmitter(source) {
    return function (next, done, context) {
      return source.emitter(next, done, new Context(context.data, source));
    };
  }

  function arrayEmitter(source) {
    return function (next, done, context) {
      var index = -1;
      !function proceed() {
        while (++index < source.length) {
          if (unsync(next(source[index]), proceed, done)) return;
        }

        done(true);
      }();
    };
  }

  function functionEmitter(source) {
    return function (next, done, context) {
      if (!unsync(next(source(context.data)), done, done)) done(true);
    };
  }

  function promiseEmitter(source) {
    return function (next, done, context) {
      return source.then(function (result) {
        if (!unsync(next(result), done, done)) done(true);
      }, function (result) {
        return done(toError(result));
      });
    };
  }

  var adapters = objectCreate(null, (_objectCreate = {}, _defineProperty(_objectCreate, AEROFLOW, {
    value: aeroflowEmitter
  }), _defineProperty(_objectCreate, ARRAY, {
    value: arrayEmitter,
    writable: true
  }), _defineProperty(_objectCreate, FUNCTION, {
    value: functionEmitter,
    writable: true
  }), _defineProperty(_objectCreate, PROMISE, {
    value: promiseEmitter,
    writable: true
  }), _objectCreate));

  function iterableEmitter(source) {
    return function (next, done, context) {
      var iteration = undefined,
          iterator = iterator = source[ITERATOR]();
      !function proceed() {
        while (!(iteration = iterator.next()).done) {
          if (unsync(next(iteration.value), proceed, done)) return;
        }

        done(true);
      }();
    };
  }

  function adapterEmitter(source, scalar) {
    var cls = classOf(source),
        adapter = adapters[cls];
    if (isFunction(adapter)) return adapter(source);
    if (!primitives.has(cls) && ITERATOR in source) return iterableEmitter(source);
    if (scalar) return scalarEmitter(source);
  }

  function customEmitter(emitter) {
    if (isUndefined(emitter)) return emptyEmitter(true);
    if (!isFunction(emitter)) return scalarEmitter(emitter);
    return function (next, done, context) {
      var buffer = [],
          completed = false,
          finalizer = undefined,
          waiting = false;
      finalizer = emitter(accept, finish, context);

      function accept(result) {
        buffer.push(result);
        proceed();
      }

      function finish(result) {
        if (completed) return;
        completed = true;
        if (isFunction(finalizer)) setTimeout(finalizer, 0);
        if (isUndefined(result)) result = true;
        done(result);
      }

      function proceed() {
        waiting = false;

        while (buffer.length) {
          if (unsync(next(buffer.shift()), proceed, finish)) {
            waiting = true;
            return;
          }
        }
      }
    };
  }

  function expandEmitter(expanding, seed) {
    var expander = isFunction(expanding) ? expanding : constant(expanding);
    return function (next, done, context) {
      var index = 0,
          value = seed;
      !function proceed() {
        while (!unsync(next(value = expander(value, index++, context.data)), proceed, done)) {}
      }();
    };
  }

  function randomEmitter(minimum, maximum) {
    maximum = toNumber(maximum, 1 - mathPow(10, -15));
    minimum = toNumber(minimum, 0);
    maximum -= minimum;
    var rounder = isInteger(minimum) && isInteger(maximum) ? mathFloor : identity;
    return function (next, done) {
      !function proceed() {
        while (!unsync(next(rounder(minimum + maximum * mathRandom())), proceed, done)) {}
      }();
    };
  }

  function rangeEmitter(start, end, step) {
    end = toNumber(end, maxInteger);
    start = toNumber(start, 0);
    if (start === end) return scalarEmitter(start);
    var down = start < end;

    if (down) {
      step = toNumber(step, 1);
      if (step < 1) return scalarEmitter(start);
    } else {
      step = toNumber(step, -1);
      if (step > -1) return scalarEmitter(start);
    }

    var limiter = down ? function (value) {
      return value <= end;
    } : function (value) {
      return value >= end;
    };
    return function (next, done, context) {
      var value = start - step;
      !function proceed() {
        while (limiter(value += step)) {
          if (unsync(next(value), proceed, done)) return;
        }

        done(true);
      }();
    };
  }

  function repeatDeferredEmitter(repeater, delayer) {
    return function (next, done, context) {
      var index = -1;
      !function proceed(result) {
        setTimeout(function () {
          if (!unsync(next(repeater(index, context.data)), proceed, done)) proceed();
        }, toDelay(delayer(++index, context.data), 1000));
      }();
    };
  }

  function repeatImmediateEmitter(repeater) {
    return function (next, done, context) {
      var index = 0;
      !function proceed() {
        while (!unsync(next(repeater(index++, context.data)), proceed, done)) {}
      }();
    };
  }

  function repeatEmitter(value, interval) {
    var repeater = toFunction(value, constant(value));
    return isDefined(interval) ? repeatDeferredEmitter(repeater, toFunction(interval, constant(interval))) : repeatImmediateEmitter(repeater);
  }

  function reduceAlongOperator(reducer) {
    return function (emitter) {
      return function (next, done, context) {
        var empty = true,
            index = 1,
            reduced = undefined;
        emitter(function (result) {
          if (empty) {
            empty = false;
            reduced = result;
          } else reduced = reducer(reduced, result, index++, context.data);

          return true;
        }, function (result) {
          if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function reduceGeneralOperator(reducer, seed) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0,
            reduced = seed;
        emitter(function (result) {
          reduced = reducer(reduced, result, index++, context.data);
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(reduced), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function reduceOptionalOperator(reducer, seed) {
    return function (emitter) {
      return function (next, done, context) {
        var empty = true,
            index = 0,
            reduced = seed;
        emitter(function (result) {
          empty = false;
          reduced = reducer(reduced, result, index++, context.data);
          return true;
        }, function (result) {
          if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function reduceOperator(reducer, seed, optional) {
    return isUndefined(reducer) ? function () {
      return emptyEmitter(false);
    } : !isFunction(reducer) ? function () {
      return scalarEmitter(reducer);
    } : isUndefined(seed) ? reduceAlongOperator(reducer) : optional ? reduceOptionalOperator(reducer, seed) : reduceGeneralOperator(reducer, seed);
  }

  function averageOperator() {
    return reduceAlongOperator(function (result, value, index) {
      return (result * index + value) / (index + 1);
    });
  }

  function catchOperator(alternative) {
    var regressor = isDefined(alternative) ? adapterEmitter(alternative, true) : function (next, done) {
      return done(false);
    };
    return function (emitter) {
      return function (next, done, context) {
        return emitter(next, function (result) {
          return isError(result) ? regressor(next, done, context) : done(result);
        }, context);
      };
    };
  }

  function countOperator(optional) {
    var reducer = optional ? reduceOptionalOperator : reduceGeneralOperator;
    return reducer(function (result) {
      return result + 1;
    }, 0);
  }

  function delayOperator(interval) {
    var delayer = toFunction(interval, constant(interval));
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        return emitter(function (result) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              try {
                if (!unsync(next(result), resolve, reject)) resolve(true);
              } catch (error) {
                reject(error);
              }
            }, toDelay(delayer(result, index++, context.data), 1000));
          });
        }, done, context);
      };
    };
  }

  function distinctOperator(untilChanged) {
    return function (emitter) {
      return untilChanged ? function (next, done, context) {
        var idle = true,
            last = undefined;
        emitter(function (result) {
          if (!idle && last === result) return true;
          idle = false;
          last = result;
          return next(result);
        }, done, context);
      } : function (next, done, context) {
        var set = new Set();
        emitter(function (result) {
          if (set.has(result)) return true;
          set.add(result);
          return next(result);
        }, done, context);
      };
    };
  }

  function dumpToConsoleOperator(prefix) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (result) {
          console.log(prefix + 'next', result);
          return next(result);
        }, function (result) {
          console[isError(result) ? 'error' : 'log'](prefix + 'done', result);
          done(result);
        }, context);
      };
    };
  }

  function dumpToLoggerOperator(prefix, logger) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (result) {
          logger(prefix + 'next', result);
          return next(result);
        }, function (result) {
          logger(prefix + 'done', result);
          done(result);
        }, context);
      };
    };
  }

  function dumpOperator(prefix, logger) {
    return isFunction(prefix) ? dumpToLoggerOperator('', prefix) : isFunction(logger) ? dumpToLoggerOperator(prefix, logger) : isUndefined(prefix) ? dumpToConsoleOperator('') : dumpToConsoleOperator(prefix);
  }

  function everyOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(result) {
          return condition.test(result);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(result) {
          return !!result;
        };

        break;

      default:
        predicate = function predicate(result) {
          return result === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var empty = true,
            every = true;
        emitter(function (result) {
          empty = false;
          if (predicate(result)) return true;
          every = false;
          return false;
        }, function (result) {
          if (isError(result) || !unsync(next(every || empty), done, done)) done(result);
        }, context);
      };
    };
  }

  function filterOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(result) {
          return condition.test(result);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(result) {
          return !!result;
        };

        break;

      default:
        predicate = function predicate(result) {
          return result === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          return !predicate(result, index++, context.data) || next(result);
        }, done, context);
      };
    };
  }

  function flattenOperator(depth) {
    depth = toNumber(depth, maxInteger);
    if (depth < 1) return identity;
    return function (emitter) {
      return function (next, done, context) {
        var level = 0;

        var flatten = function flatten(result) {
          if (level === depth) return next(result);
          var adapter = adapterEmitter(result, false);

          if (adapter) {
            level++;
            return new Promise(function (resolve) {
              return adapter(flatten, function (adapterResult) {
                level--;
                resolve(adapterResult);
              }, context);
            });
          } else return next(result);
        };

        emitter(flatten, done, context);
      };
    };
  }

  function groupOperator(selectors) {
    selectors = selectors.length ? selectors.map(function (selector) {
      return isFunction(selector) ? selector : constant(selector);
    }) : [constant()];
    var limit = selectors.length - 1;
    return function (emitter) {
      return function (next, done, context) {
        var groups = new Map(),
            index = 0;
        emitter(function (value) {
          var current = undefined,
              parent = groups;

          for (var i = -1; ++i <= limit;) {
            var key = selectors[i](value, index++, context.data);
            current = parent.get(key);

            if (!current) {
              current = i === limit ? [] : new Map();
              parent.set(key, current);
            }

            parent = current;
          }

          current.push(value);
          return true;
        }, function (result) {
          if (isError(result)) done(result);else iterableEmitter(groups)(next, tie(done, result), context);
        }, context);
      };
    };
  }

  function toArrayOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var array = [];
        emitter(function (result) {
          array.push(result);
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(array), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function mapOperator(mapping) {
    if (isUndefined(mapping)) return identity;
    var mapper = isFunction(mapping) ? mapping : constant(mapping);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return next(mapper(value, index++, context.data));
        }, done, context);
      };
    };
  }

  function joinOperator(right, condition) {
    var comparer = toFunction(condition, truthy),
        toArray = toArrayOperator()(adapterEmitter(right, true));
    return function (emitter) {
      return function (next, done, context) {
        return toArray(function (rightArray) {
          return new Promise(function (rightResolve) {
            return emitter(function (leftResult) {
              return new Promise(function (leftResolve) {
                var array = arrayEmitter(rightArray),
                    filter = filterOperator(function (rightResult) {
                  return comparer(leftResult, rightResult);
                }),
                    map = mapOperator(function (rightResult) {
                  return [leftResult, rightResult];
                });
                return map(filter(array))(next, leftResolve, context);
              });
            }, rightResolve, context);
          });
        }, done, context);
      };
    };
  }

  function maxOperator() {
    return reduceAlongOperator(function (maximum, value) {
      return value > maximum ? value : maximum;
    });
  }

  function meanOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          if (!result.length) return true;
          result.sort();
          return next(result[mathFloor(result.length / 2)]);
        }, done, context);
      };
    };
  }

  function minOperator() {
    return reduceAlongOperator(function (minimum, value) {
      return value < minimum ? value : minimum;
    });
  }

  function retryOperator(attempts) {
    attempts = toNumber(attempts, 1);
    if (!attempts) return identity;
    return function (emitter) {
      return function (next, done, context) {
        var attempt = 0;
        proceed();

        function proceed() {
          emitter(next, retry, context);
        }

        function retry(result) {
          if (++attempt <= attempts && isError(result)) proceed();else done(result);
        }

        ;
      };
    };
  }

  function reverseOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          return new Promise(function (resolve) {
            var index = result.length;
            !function proceed() {
              while (--index >= 0 && !unsync(next(result[index]), proceed, resolve)) {}

              resolve(true);
            }();
          });
        }, done, context);
      };
    };
  }

  function skipAllOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(truthy, done, context);
      };
    };
  }

  function skipFirstOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var index = -1;
        emitter(function (result) {
          return ++index < count || next(result);
        }, done, context);
      };
    };
  }

  function skipLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          return result.length <= count || new Promise(function (resolve) {
            var index = 0,
                limit = result.length - count;
            !function proceed() {
              while (!unsync(next(result[index++]), proceed, resolve) && index < limit) {}

              resolve(true);
            }();
          });
        }, done, context);
      };
    };
  }

  function skipWhileOperator(predicate) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0,
            skipping = true;
        emitter(function (value) {
          if (skipping && !predicate(value, index++, context.data)) skipping = false;
          return skipping || next(value);
        }, done, context);
      };
    };
  }

  function skipOperator(condition) {
    switch (classOf(condition)) {
      case NUMBER:
        return condition > 0 ? skipFirstOperator(condition) : condition < 0 ? skipLastOperator(-condition) : identity;

      case FUNCTION:
        return skipWhileOperator(condition);

      case UNDEFINED:
        return skipAllOperator();

      default:
        return condition ? skipAllOperator() : identity;
    }
  }

  function sliceOperator(begin, end) {
    begin = toNumber(begin, 0);
    end = toNumber(end, maxInteger);
    return begin < 0 || end < 0 ? function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          var length = result.length,
              index = begin < 0 ? length + begin : begin,
              limit = end < 0 ? length + end : mathMin(length, end);
          if (index < 0) index = 0;
          if (limit < 0) limit = 0;
          return index >= limit || new Promise(function (resolve) {
            !function proceed() {
              while (!unsync(next(result[index++]), proceed, resolve) && index < limit) {}

              resolve(true);
            }();
          });
        }, done, context);
      };
    } : function (emitter) {
      return function (next, done, context) {
        var index = -1;
        emitter(function (value) {
          return ++index < begin || index < end && next(value);
        }, done, context);
      };
    };
  }

  function someOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(result) {
          return condition.test(result);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(result) {
          return !!result;
        };

        break;

      default:
        predicate = function predicate(result) {
          return result === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var some = false;
        emitter(function (result) {
          if (!predicate(result)) return true;
          some = true;
          return false;
        }, function (result) {
          if (isError(result) || !unsync(next(some), done, done)) done(result);
        }, context);
      };
    };
  }

  function sortOperator(parameters) {
    var directions = [],
        selectors = [];
    var direction = 1;

    for (var i = -1, l = parameters.length; ++i < l;) {
      var parameter = parameters[i];

      switch (classOf(parameter)) {
        case FUNCTION:
          selectors.push(parameter);
          directions.push(direction);
          continue;

        case NUMBER:
          parameter = parameter > 0 ? 1 : -1;
          break;

        case STRING:
          parameter = parameter.toLowerCase() === 'desc' ? -1 : 1;
          break;

        default:
          parameter = parameter ? 1 : -1;
          break;
      }

      if (directions.length) directions[directions.length - 1] = parameter;else direction = parameter;
    }

    var comparer = selectors.length ? function (left, right) {
      var result = undefined;

      for (var _i = -1, _l = selectors.length; ++_i < _l;) {
        var selector = selectors[_i];
        result = compare(selector(left), selector(right), directions[_i]);
        if (result) break;
      }

      return result;
    } : function (left, right) {
      return compare(left, right, direction);
    };
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          return new Promise(function (resolve) {
            return arrayEmitter(result.sort(comparer))(next, resolve, context);
          });
        }, done, context);
      };
    };
  }

  function sumOperator() {
    return reduceAlongOperator(function (result, value) {
      return result + value;
    });
  }

  function takeFirstOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          if (++index < count) return next(result);
          result = next(result);
          if (isBoolean(result)) return false;
          if (isPromise(result)) return result.then(falsey);
          return result;
        }, done, context);
      };
    };
  }

  function takeLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          return !result.length || new Promise(function (resolve) {
            var limit = result.length,
                index = limit - count;
            if (index < 0) index = 0;
            !function proceed() {
              while (!unsync(next(result[index++]), proceed, resolve) && index < limit) {}

              resolve(true);
            }();
          });
        }, done, context);
      };
    };
  }

  function takeWhileOperator(predicate) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return predicate(value, index++, context.data) && next(value);
        }, done, context);
      };
    };
  }

  function takeOperator(condition) {
    switch (classOf(condition)) {
      case NUMBER:
        return condition > 0 ? takeFirstOperator(condition) : condition < 0 ? takeLastOperator(-condition) : function () {
          return emptyEmitter(false);
        };

      case FUNCTION:
        return takeWhileOperator(condition);

      default:
        return condition ? identity : function () {
          return emptyEmitter(false);
        };
    }
  }

  function tapOperator(callback) {
    return function (emitter) {
      return isFunction(callback) ? function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          callback(result, index++, context.data);
          return next(result);
        }, done, context);
      } : emitter;
    };
  }

  function toMapOperator(keyTransformation, valueTransformation) {
    var keyTransformer = isUndefined(keyTransformation) ? identity : isFunction(keyTransformation) ? keyTransformation : constant(keyTransformation);
    var valueTransformer = isUndefined(valueTransformation) ? identity : isFunction(valueTransformation) ? valueTransformation : constant(valueTransformation);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0,
            map = new Map();
        emitter(function (result) {
          map.set(keyTransformer(result, index++, context.data), valueTransformer(result, index++, context.data));
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(map), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function toSetOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var set = new Set();
        emitter(function (result) {
          set.add(result);
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(set), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function toStringOperator(separator, optional) {
    var joiner = isUndefined(separator) ? constant(',') : isFunction(separator) ? separator : constant(separator);
    var reducer = optional ? reduceOptionalOperator : reduceGeneralOperator;
    return reducer(function (result, value, index, data) {
      return result.length ? result + joiner(value, index, data) + value : '' + value;
    }, '');
  }

  var Aeroflow = function Aeroflow(emitter, sources) {
    _classCallCheck(this, Aeroflow);

    objectDefineProperties(this, {
      emitter: {
        value: emitter
      },
      sources: {
        value: sources
      }
    });
  };

  function append() {
    for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      sources[_key2] = arguments[_key2];
    }

    return new Aeroflow(this.emitter, this.sources.concat(sources));
  }

  function average() {
    return this.chain(averageOperator());
  }

  function bind() {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    return new Aeroflow(this.emitter, sources);
  }

  function catch_(alternative) {
    return this.chain(catchOperator(alternative));
  }

  function chain(operator) {
    return new Aeroflow(operator(this.emitter), this.sources);
  }

  function count(optional) {
    return this.chain(countOperator(optional));
  }

  function delay(interval) {
    return this.chain(delayOperator(interval));
  }

  function distinct(untilChanged) {
    return this.chain(distinctOperator(untilChanged));
  }

  function dump(prefix, logger) {
    return this.chain(dumpOperator(prefix, logger));
  }

  function every(condition) {
    return this.chain(everyOperator(condition));
  }

  function filter(condition) {
    return this.chain(filterOperator(condition));
  }

  function flatten(depth) {
    return this.chain(flattenOperator(depth));
  }

  function group() {
    for (var _len4 = arguments.length, selectors = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      selectors[_key4] = arguments[_key4];
    }

    return this.chain(groupOperator(selectors));
  }

  function join(right, comparer) {
    return this.chain(joinOperator(right, comparer));
  }

  function map(mapping) {
    return this.chain(mapOperator(mapping));
  }

  function max() {
    return this.chain(maxOperator());
  }

  function mean() {
    return this.chain(meanOperator());
  }

  function min() {
    return this.chain(minOperator());
  }

  function prepend() {
    for (var _len5 = arguments.length, sources = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      sources[_key5] = arguments[_key5];
    }

    return new Aeroflow(this.emitter, sources.concat(this.sources));
  }

  function reduce(reducer, seed, optional) {
    return this.chain(reduceOperator(reducer, seed, optional));
  }

  function retry(attempts) {
    return this.chain(retryOperator(attempts));
  }

  function reverse() {
    return this.chain(reverseOperator());
  }

  function run(next, done, data) {
    if (isFunction(next)) {
      if (!isFunction(done)) {
        data = done;

        done = function done(result) {
          if (isError(result)) throw result;
        };
      }
    } else if (primitives.has(classOf(next))) {
      data = next;
      next = noop;

      done = function done(result) {
        if (isError(result)) throw result;
      };
    } else if (isFunction(next.dispatchEvent)) {
      (function () {
        var target = next;
        data = done;

        done = function done(result) {
          target.dispatchEvent(new CustomEvent('done', {
            detail: result
          }));
          return true;
        };

        next = function next(result) {
          target.dispatchEvent(new CustomEvent('next', {
            detail: result
          }));
          return true;
        };
      })();
    } else if (isFunction(next.emit)) {
      (function () {
        var emitter = next;
        data = done;

        done = function done(result) {
          emitter.emit('done', result);
          return true;
        };

        next = function next(result) {
          emitter.emit('next', result);
          return true;
        };
      })();
    } else if (isFunction(next.onNext) && isFunction(next.onError) && isFunction(next.onCompleted)) {
      (function () {
        var observer = next;
        data = done;

        done = function done(result) {
          (isError(result) ? observer.onError : observer.onCompleted)(result);
          return true;
        };

        next = function next(result) {
          observer.onNext(result);
          return true;
        };
      })();
    }

    var context = new Context(data, this);
    setImmediate(function () {
      return context.flow.emitter(function (result) {
        return false !== next(result, data);
      }, function (result) {
        return done(result, data);
      }, context);
    });
    return this;
  }

  function skip(condition) {
    return this.chain(skipOperator(condition));
  }

  function slice(begin, end) {
    return this.chain(sliceOperator(begin, end));
  }

  function some(condition) {
    return this.chain(someOperator(condition));
  }

  function sort() {
    for (var _len6 = arguments.length, parameters = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      parameters[_key6] = arguments[_key6];
    }

    return this.chain(sortOperator(parameters));
  }

  function sum() {
    return this.chain(sumOperator());
  }

  function take(condition) {
    return this.chain(takeOperator(condition));
  }

  function tap(callback) {
    return this.chain(tapOperator(callback));
  }

  function toArray() {
    return this.chain(toArrayOperator());
  }

  function toMap(keyTransformation, valueTransformation) {
    return this.chain(toMapOperator(keyTransformation, valueTransformation));
  }

  function toSet() {
    return this.chain(toSetOperator());
  }

  function toString(separator, optional) {
    return this.chain(toStringOperator(separator, optional));
  }

  var operators = objectCreate(Object[PROTOTYPE], {
    average: {
      value: average,
      writable: true
    },
    catch: {
      value: catch_,
      writable: true
    },
    count: {
      value: count,
      writable: true
    },
    delay: {
      value: delay,
      writable: true
    },
    distinct: {
      value: distinct,
      writable: true
    },
    dump: {
      value: dump,
      writable: true
    },
    every: {
      value: every,
      writable: true
    },
    filter: {
      value: filter,
      writable: true
    },
    flatten: {
      value: flatten,
      writable: true
    },
    group: {
      value: group,
      writable: true
    },
    join: {
      value: join,
      writable: true
    },
    map: {
      value: map,
      writable: true
    },
    max: {
      value: max,
      writable: true
    },
    mean: {
      value: mean,
      writable: true
    },
    min: {
      value: min,
      writable: true
    },
    reduce: {
      value: reduce,
      writable: true
    },
    retry: {
      value: retry,
      writable: true
    },
    reverse: {
      value: reverse,
      writable: true
    },
    skip: {
      value: skip,
      writable: true
    },
    slice: {
      value: slice,
      writable: true
    },
    some: {
      value: some,
      writable: true
    },
    sort: {
      value: sort,
      writable: true
    },
    sum: {
      value: sum,
      writable: true
    },
    take: {
      value: take,
      writable: true
    },
    tap: {
      value: tap,
      writable: true
    },
    toArray: {
      value: toArray,
      writable: true
    },
    toMap: {
      value: toMap,
      writable: true
    },
    toSet: {
      value: toSet,
      writable: true
    },
    toString: {
      value: toString,
      writable: true
    }
  });
  Aeroflow[PROTOTYPE] = objectCreate(operators, (_objectCreate2 = {}, _defineProperty(_objectCreate2, CLASS, {
    value: AEROFLOW
  }), _defineProperty(_objectCreate2, 'append', {
    value: append
  }), _defineProperty(_objectCreate2, 'bind', {
    value: bind
  }), _defineProperty(_objectCreate2, 'chain', {
    value: chain
  }), _defineProperty(_objectCreate2, 'prepend', {
    value: prepend
  }), _defineProperty(_objectCreate2, 'run', {
    value: run
  }), _objectCreate2));

  function emit(next, done, context) {
    var sources = context.flow.sources,
        limit = sources.length;
    var index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= limit) done(result);else try {
        adapterEmitter(sources[index], true)(next, proceed, context);
      } catch (err) {
        done(err);
      }
    }(true);
  }

  function aeroflow() {
    for (var _len7 = arguments.length, sources = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      sources[_key7] = arguments[_key7];
    }

    return new Aeroflow(emit, sources);
  }

  function create(emitter) {
    return new Aeroflow(customEmitter(emitter));
  }

  function error(message) {
    return new Aeroflow(emptyEmitter(toError(message)));
  }

  function expand(expander, seed) {
    return new Aeroflow(expandEmitter(expander, seed));
  }

  function just(value) {
    return new Aeroflow(scalarEmitter(value));
  }

  function random(minimum, maximum) {
    return new Aeroflow(randomEmitter(minimum, maximum));
  }

  function range(start, end, step) {
    return new Aeroflow(rangeEmitter(start, end, step));
  }

  function repeat(value, interval) {
    return new Aeroflow(repeatEmitter(value, interval));
  }

  objectDefineProperties(aeroflow, {
    adapters: {
      get: function get() {
        return adapters;
      }
    },
    create: {
      value: create
    },
    empty: {
      enumerable: true,
      value: new Aeroflow(emptyEmitter(true))
    },
    error: {
      value: error
    },
    expand: {
      value: expand
    },
    just: {
      value: just
    },
    operators: {
      get: function get() {
        return operators;
      }
    },
    random: {
      value: random
    },
    range: {
      value: range
    },
    repeat: {
      value: repeat
    }
  });
  exports.default = aeroflow;
  module.exports = exports['default'];
});
