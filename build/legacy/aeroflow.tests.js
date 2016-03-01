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
    global.aeroflowTests = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.aeroflowTests = factory();
  })(undefined, function () {
    'use strict';

    var factoryTests = function factoryTests(aeroflow, execute, expect) {
      return describe('aeroflow', function () {
        it('Is function', function () {
          return execute(function (context) {}, function (context) {
            return aeroflow;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@source:aeroflow)', function () {
          it('When @source is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(aeroflow.empty).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(aeroflow(context.values)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:array)', function () {
          it('When @source is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow([]).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:date)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = new Date();
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:error)', function () {
          it('Emits only single faulty "done" with @source', function () {
            return execute(function (context) {
              return aeroflow(context.error).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
        });
        describe('(@source:function)', function () {
          it('Calls @source once with context data', function () {
            return execute(function (context) {
              return context.source = context.spy();
            }, function (context) {
              return aeroflow(context.source).run(context.data);
            }, function (context) {
              expect(context.source).to.have.been.calledOnce;
              expect(context.source).to.have.been.calledWith(context.data);
            });
          });
          it('When @source returns value, emits single "next" with value, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(function () {
                return context.data;
              }).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.data);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
          it('When @source throws, emits only single faulty "done" with thrown error', function () {
            return execute(function (context) {
              return aeroflow(context.fail).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
        });
        describe('(@source:iterable)', function () {
          it('When @source is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(new Set()).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(new Set(context.values)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:null)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = null;
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:promise)', function () {
          it('When @source rejects, emits single faulty "done" with rejected error', function () {
            return execute(function (context) {
              return aeroflow(Promise.reject(context.error)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
          it('When @source resolves, emits single "next" with resolved value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = 42;
            }, function (context) {
              return aeroflow(Promise.resolve(context.value)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:string)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = 'test';
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:undefined)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = undefined;
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(...@sources)', function () {
          it('Emits "next" with each serial value from @sources, then single greedy "done"', function () {
            return execute(function (context) {
              var values = context.values = [true, new Date(), null, 42, 'test', Symbol('test'), undefined];
              context.sources = [values[0], [values[1]], new Set([values[2], values[3]]), function () {
                return values[4];
              }, Promise.resolve(values[5]), new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve(values[6]);
                });
              })];
            }, function (context) {
              return aeroflow.apply(undefined, _toConsumableArray(context.sources)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var emptyGeneratorTests = function emptyGeneratorTests(aeroflow, execute, expect) {
      return describe('.empty', function () {
        it('Gets instance of Aeroflow', function () {
          return execute(function (context) {
            return aeroflow.empty;
          }, function (context) {
            return expect(context.result).to.be.an('Aeroflow');
          });
        });
        it('Emits only single greedy "done"', function () {
          return execute(function (context) {
            return aeroflow.empty.run(context.next, context.done);
          }, function (context) {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          });
        });
      });
    };

    var expandGeneratorTests = function expandGeneratorTests(aeroflow, execute, expect) {
      return describe('.expand', function () {
        it('Is static method', function () {
          return execute(function (context) {
            return aeroflow.expand;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.expand();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
        });
        describe('(@expander:function)', function () {
          it('Calls @expander with undefined, 0  and context data on first iteration', function () {
            return execute(function (context) {
              return context.expander = context.spy();
            }, function (context) {
              return aeroflow.expand(context.expander).take(1).run(context.data);
            }, function (context) {
              return expect(context.expander).to.have.been.calledWithExactly(undefined, 0, context.data);
            });
          });
          it('Calls @expander with value previously returned by @expander, iteration index and context data on subsequent iterations', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.expander = context.spy(function (_, index) {
                return context.values[index];
              });
            }, function (context) {
              return aeroflow.expand(context.expander).take(context.values.length + 1).run(context.data);
            }, function (context) {
              return [undefined].concat(context.values).forEach(function (value, index) {
                return expect(context.expander.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('If @expander throws, emits only single faulty "done" with thrown error', function () {
            return execute(function (context) {
              return context.expander = context.fail;
            }, function (context) {
              return aeroflow(context.expander).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
          it('Emits "next" for each serial value returned by @expander, then not being infinite, lazy "done"', function () {
            return execute(function (context) {
              context.values = [1, 2, 3];
              context.expander = context.spy(function (_, index) {
                return context.values[index];
              });
            }, function (context) {
              return aeroflow.expand(context.expander).take(context.values.length).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@expander:function, @seed)', function () {
          it('Calls @expander with @seed on first iteration', function () {
            return execute(function (context) {
              context.expander = context.spy();
              context.seed = 'test';
            }, function (context) {
              return aeroflow.expand(context.expander, context.seed).take(1).run();
            }, function (context) {
              return expect(context.expander).to.have.been.calledWith(context.seed);
            });
          });
        });
        describe('(@expander:!function)', function () {
          it('Emits "next" with @expander', function () {
            return execute(function (context) {
              return context.expander = 'test';
            }, function (context) {
              return aeroflow.expand(context.expander).take(1).run(context.next);
            }, function (context) {
              return expect(context.next).to.have.been.calledWith(context.expander);
            });
          });
        });
      });
    };

    var justGeneratorTests = function justGeneratorTests(aeroflow, execute, expect) {
      return describe('.just', function () {
        it('Is static method', function () {
          return execute(function (context) {
            return aeroflow.just;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.just();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
        });
        describe('(@value:aeroflow)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = aeroflow.empty;
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:array)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = [42];
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:function)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = Function();
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:iterable)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = new Set();
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:promise)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = Promise.resolve();
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var averageOperatorTests = function averageOperatorTests(aeroflow, execute, expect) {
      return describe('#average', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.average;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.average();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.average().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits numeric values, emits single "next" with average of values, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2, 5];
            }, function (context) {
              return aeroflow(context.values).average().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.reduce(function (sum, value) {
                return sum + value;
              }, 0) / context.values.length);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
          it('When flow emits some not numeric values, emits single "next" with NaN, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 'test', 2];
            }, function (context) {
              return aeroflow(context.values).average().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(NaN);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var catchOperatorTests = function catchOperatorTests(aeroflow, execute, expect) {
      return describe('#catch', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.catch;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.catch();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.catch().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits only error, supresses error and emits only single lazy "done"', function () {
            return execute(function (context) {
              return aeroflow(context.error).catch().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
          it('When flow emits some values and then error, emits "next" for each serial value before error, then supresses error and emits single lazy "done" ignoring values emitted after error', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values, context.error, context.values).catch().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:array)', function () {
          it('When flow emits error, emits "next" for each serial value from @alternative, then single lazy "done"', function () {
            return execute(function (context) {
              return context.alternative = [1, 2];
            }, function (context) {
              return aeroflow(context.error).catch(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.alternative.length);
              context.alternative.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:function)', function () {
          it('When flow is empty, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow.empty.catch(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).not.to.have.been.called;
            });
          });
          it('When flow does not emit error, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow('test').catch(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).not.to.have.been.called;
            });
          });
          it('When flow emits several values and then error, calls @alternative once with emitted error and context data, then emits "next" for each serial value from result returned by @alternative, then emits single lazy "done"', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.alternative = context.spy(context.values);
            }, function (context) {
              return aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done, context.data);
            }, function (context) {
              expect(context.alternative).to.have.been.calledOnce;
              expect(context.alternative).to.have.been.calledWith(context.error, context.data);
              expect(context.next).to.have.callCount(context.values.length * 2);
              context.values.forEach(function (value, index) {
                expect(context.next.getCall(index)).to.have.been.calledWith(value);
                expect(context.next.getCall(index + context.values.length)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:string)', function () {
          it('When flow emits error, emits "next" with @alternative, then single lazy "done"', function () {
            return execute(function (context) {
              return context.alternative = 'test';
            }, function (context) {
              return aeroflow(context.error).catch(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.alternative);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var coalesceOperatorTests = function coalesceOperatorTests(aeroflow, execute, expect) {
      return describe('#coalesce', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.coalesce;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.coalesce();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.coalesce().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@alternative:array)', function () {
          it('When flow is empty, emits "next" for each serial value from @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.alternative = [1, 2];
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.alternative.length);
              context.alternative.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:function)', function () {
          it('When flow is empty, calls @alternative once with context data, emits single "next" with value returned by @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.alternative = context.spy(context.values);
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done, context.data);
            }, function (context) {
              expect(context.alternative).to.have.been.calledOnce;
              expect(context.alternative).to.have.been.calledWith(context.data);
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
          it('When flow emits error, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow(context.error).coalesce(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).to.have.not.been.called;
            });
          });
          it('When flow emits some values, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow('test').coalesce(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).to.have.not.been.called;
            });
          });
        });
        describe('(@alternative:promise)', function () {
          it('When flow is empty, emits single "next" with value resolved by @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.value = 42;
              context.alternative = Promise.resolve(context.value);
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:string)', function () {
          it('When flow is empty, emits single "next" with @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.alternative = 'test';
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.alternative);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var countOperatorTests = function countOperatorTests(aeroflow, execute, expect) {
      return describe('#count', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.count;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.count();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits single "next" with 0, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.count().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(0);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits single "next" with number of values emitted by flow, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2, 3];
            }, function (context) {
              return aeroflow(context.values).count().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.length);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits error, emits only single faulty "done"', function () {
            return execute(function (context) {
              return aeroflow(context.error).count().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
        });
      });
    };

    var everyOperatorTests = function everyOperatorTests(aeroflow, execute, expect) {
      return describe('#every', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.every;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.every();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits "next" with true, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.every().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several truthy values, emits "next" with true, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [true, 1, 'test'];
            }, function (context) {
              return aeroflow(context.values).every().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits at least one falsey value, emits "next" with false, then single lazy "done"', function () {
            return execute(function (context) {
              return context.values = [true, 1, ''];
            }, function (context) {
              return aeroflow(context.values).every().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
        describe('(@condition:function)', function () {
          it('When flow is empty, does not call @condition', function () {
            return execute(function (context) {
              return context.condition = context.spy();
            }, function (context) {
              return aeroflow.empty.every(context.condition).run();
            }, function (context) {
              return expect(context.condition).to.have.not.been.called;
            });
          });
          it('When flow is not empty, calls @condition with each emitted value, index of value and context data until @condition returns falsey result', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.condition = context.spy(function (_, index) {
                return index !== context.values.length - 1;
              });
            }, function (context) {
              return aeroflow(context.values, 3).every(context.condition).run(context.data);
            }, function (context) {
              expect(context.condition).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return value > 0;
              };

              context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).every(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return value > 0;
              };

              context.values = [1, 0];
            }, function (context) {
              return aeroflow(context.values).every(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
        describe('(@condition:regex)', function () {
          it('When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = /a/;
              context.values = ['a', 'aa'];
            }, function (context) {
              return aeroflow(context.values).every(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done"', function () {
            return execute(function (context) {
              context.condition = /a/;
              context.values = ['a', 'b'];
            }, function (context) {
              return aeroflow(context.values).every(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
        describe('(@condition:string)', function () {
          it('When flow emits several values equal to @condition, emits single "next" with true, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = 1;
              context.values = [1, 1];
            }, function (context) {
              return aeroflow(context.values).every(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several values not equal to @condition, emits single "next" with false, then single lazy "done"', function () {
            return execute(function (context) {
              context.condition = 1;
              context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).every(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
      });
    };

    var filterOperatorTests = function filterOperatorTests(aeroflow, execute, expect) {
      return describe('#filter', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.filter;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.filter();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.filter().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits "next" for each truthy value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [0, 1, false, true, '', 'test'];
            }, function (context) {
              return aeroflow(context.values).filter().run(context.next, context.done);
            }, function (context) {
              var filtered = context.values.filter(function (value) {
                return !!value;
              });
              expect(context.next).to.have.callCount(filtered.length);
              filtered.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:function)', function () {
          it('When flow is empty, does not call @condition', function () {
            return execute(function (context) {
              return context.condition = context.spy();
            }, function (context) {
              return aeroflow.empty.filter(context.condition).run();
            }, function (context) {
              return expect(context.condition).to.have.not.been.called;
            });
          });
          it('When flow is not empty, calls @condition with each emitted value, index of value and context data', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.condition = context.spy();
            }, function (context) {
              return aeroflow(context.values).filter(context.condition).run(context.data);
            }, function (context) {
              expect(context.condition).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('When flow is not empty, emits "next" for each value passing the @condition test, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return 0 === value % 2;
              };

              context.values = [1, 2, 3];
            }, function (context) {
              return aeroflow(context.values).filter(context.condition).run(context.next, context.done);
            }, function (context) {
              var filtered = context.values.filter(context.condition);
              expect(context.next).to.have.callCount(filtered.length);
              filtered.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:regex)', function () {
          it('When flow is not empty, emits "next" for each value passing the @condition test, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = /b/;
              context.values = ['a', 'b', 'c'];
            }, function (context) {
              return aeroflow(context.values).filter(context.condition).run(context.next, context.done);
            }, function (context) {
              var filtered = context.values.filter(function (value) {
                return context.condition.test(value);
              });
              expect(context.next).to.have.callCount(filtered.length);
              filtered.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:number)', function () {
          it('When flow is not empty, emits "next" for each value equal to @condition, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = 2;
              context.values = [1, 2, 3];
            }, function (context) {
              return aeroflow(context.values).filter(context.condition).run(context.next, context.done);
            }, function (context) {
              var filtered = context.values.filter(function (value) {
                return value === context.condition;
              });
              expect(context.next).to.have.callCount(filtered.length);
              filtered.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var mapOperatorTests = function mapOperatorTests(aeroflow, execute, expect) {
      return describe('#map', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.map;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.map();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.map().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits "next" for each emitted value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).map().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@mapper:function)', function () {
          it('When flow is empty, does not call @mapper', function () {
            return execute(function (context) {
              return context.mapper = context.spy();
            }, function (context) {
              return aeroflow.empty.map(context.mapper).run();
            }, function (context) {
              return expect(context.mapper).to.have.not.been.called;
            });
          });
          it('When flow is not empty, calls @mapper with each emitted value, index of value and context data', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.mapper = context.spy();
            }, function (context) {
              return aeroflow(context.values).map(context.mapper).run(context.data);
            }, function (context) {
              expect(context.mapper).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.mapper.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('When flow is not empty, emits "next" for each emitted value with result returned by @mapper, then single greedy "done"', function () {
            return execute(function (context) {
              context.mapper = function (value) {
                return -value;
              };

              context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).map(context.mapper).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper(value));
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@mapper:number)', function () {
          it('When flow is not empty, emits "next" for each emitted value with @mapper instead of value, then single greedy "done"', function () {
            return execute(function (context) {
              context.mapper = 42;
              context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).map(context.mapper).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (_, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var maxOperatorTests = function maxOperatorTests(aeroflow, execute, expect) {
      return describe('#max', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.max;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.max();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.max().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 3, 2];
            }, function (context) {
              return aeroflow(context.values).max().run(context.next, context.done);
            }, function (context) {
              var _Math;

              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith((_Math = Math).max.apply(_Math, _toConsumableArray(context.values)));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several string values, emits single "next" with emitted value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = ['a', 'c', 'b'];
            }, function (context) {
              return aeroflow(context.values).max().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.reduce(function (max, value) {
                return value > max ? value : max;
              }));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var meanOperatorTests = function meanOperatorTests(aeroflow, execute, expect) {
      return describe('#mean', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.mean;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.mean();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.mean().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several numeric values, emits single "next" with mean emitted value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 3, 2];
            }, function (context) {
              return aeroflow(context.values).mean().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.sort()[Math.floor(context.values.length / 2)]);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var minOperatorTests = function minOperatorTests(aeroflow, execute, expect) {
      return describe('#min', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.min;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.min();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.min().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 3, 2];
            }, function (context) {
              return aeroflow(context.values).min().run(context.next, context.done);
            }, function (context) {
              var _Math2;

              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith((_Math2 = Math).min.apply(_Math2, _toConsumableArray(context.values)));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several string values, emits single "next" with minnimum emitted value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = ['a', 'c', 'b'];
            }, function (context) {
              return aeroflow(context.values).min().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.reduce(function (min, value) {
                return value < min ? value : min;
              }));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var reduceOperatorTests = function reduceOperatorTests(aeroflow, execute, expect) {
      return describe('#reduce', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.reduce;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.reduce();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.reduce().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several values, emits single "next" with first emitted value, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.value = 1;
            }, function (context) {
              return aeroflow(context.value, 2).reduce().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@reducer:function)', function () {
          it('When flow is empty, does not call @reducer', function () {
            return execute(function (context) {
              return context.reducer = context.spy();
            }, function (context) {
              return aeroflow.empty.reduce(context.reducer).run();
            }, function (context) {
              return expect(context.reducer).to.have.not.been.called;
            });
          });
          it('When flow emits single value, does not call @reducer', function () {
            return execute(function (context) {
              return context.reducer = context.spy();
            }, function (context) {
              return aeroflow(1).reduce(context.reducer).run();
            }, function (context) {
              return expect(context.reducer).to.have.not.been.called;
            });
          });
          it('When flow emits several values, calls @reducer with first emitted value, second emitted value, 0 and context data on first iteration', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.reducer = context.spy();
            }, function (context) {
              return aeroflow(context.values).reduce(context.reducer).run(context.data);
            }, function (context) {
              return expect(context.reducer).to.have.been.calledWithExactly(context.values[0], context.values[1], 0, context.data);
            });
          });
          it('When flow is not empty, calls @reducer with result returned by @reducer on previous iteration, emitted value, index of value and context data on next iterations', function () {
            return execute(function (context) {
              context.values = [1, 2, 3];
              context.reducer = context.spy(function (_, value) {
                return value;
              });
            }, function (context) {
              return aeroflow(context.values).reduce(context.reducer).run(context.data);
            }, function (context) {
              expect(context.reducer).to.have.callCount(context.values.length - 1);
              context.values.slice(0, -1).forEach(function (value, index) {
                return expect(context.reducer.getCall(index)).to.have.been.calledWithExactly(value, context.values[index + 1], index, context.data);
              });
            });
          });
          it('When flow emits several values, emits single "next" with last value returned by @reducer, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.value = 3;
              context.reducer = context.spy(function (_, value) {
                return value;
              });
            }, function (context) {
              return aeroflow(1, 2, context.value).reduce(context.reducer).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@reducer:function, @seed:function)', function () {
          it('When flow is not empty, calls @seed with context data, calls @reducer with result returned by @seed, first emitted value, 0 and context data on first iteration', function () {
            return execute(function (context) {
              context.value = 42;
              context.seed = context.spy(function () {
                return context.value;
              });
              context.reducer = context.spy();
            }, function (context) {
              return aeroflow(context.value).reduce(context.reducer, context.seed).run(context.data);
            }, function (context) {
              expect(context.seed).to.have.been.calledWithExactly(context.data);
              expect(context.reducer).to.have.been.calledWithExactly(context.value, context.value, 0, context.data);
            });
          });
        });
        describe('(@reducer:function, @seed:number)', function () {
          it('When flow is not empty, calls @reducer with @seed, first emitted value, 0 and context data on first iteration', function () {
            return execute(function (context) {
              context.seed = 1;
              context.value = 2;
              context.reducer = context.spy();
            }, function (context) {
              return aeroflow(context.value).reduce(context.reducer, context.seed).run(context.data);
            }, function (context) {
              return expect(context.reducer).to.have.been.calledWithExactly(context.seed, context.value, 0, context.data);
            });
          });
        });
        describe('(@reducer:string)', function () {
          it('When flow emits several values, emits single "next" with @reducer, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.reducer = 42;
            }, function (context) {
              return aeroflow(1, 2).reduce(context.reducer).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.reducer);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var reverseOperatorTests = function reverseOperatorTests(aeroflow, execute, expect) {
      return describe('#reverse', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.reverse;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.reverse();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.reverse().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits "next" for each emitted value in reverse order, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2, 3];
            }, function (context) {
              return aeroflow(context.values).reverse().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(context.values.length - index - 1)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var skipOperatorTests = function skipOperatorTests(aeroflow, execute, expect) {
      return describe('#skip', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.skip;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.skip();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.skip().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(42).skip().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(false)', function () {
          it('When flow is not empty, emits "next" for each emitted value, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).skip(false).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(true)', function () {
          it('When flow is not empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(42).skip(true).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:function)', function () {
          it('When flow is empty, does not call @condition', function () {
            return execute(function (context) {
              return context.condition = context.spy();
            }, function (context) {
              return aeroflow.empty.skip(context.condition).run();
            }, function (context) {
              return expect(context.condition).to.have.not.been.called;
            });
          });
          it('When flow is not empty, calls @condition with each emitted value, index of value and context data while it returns truthy', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.condition = context.spy(function (_, index) {
                return index < context.values.length - 1;
              });
            }, function (context) {
              return aeroflow(context.values, 3).skip(context.condition).run(context.data);
            }, function (context) {
              expect(context.condition).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('When flow emits several values, skips values while @condition returns truthy, then emits "next" for all remaining values, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return value < 2;
              };

              context.values = [1, 2, 3, 4];
            }, function (context) {
              return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
            }, function (context) {
              var index = context.values.findIndex(function (value) {
                return !context.condition(value);
              });
              expect(context.next).to.have.callCount(context.values.length - index);
              context.values.slice(index).forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:number)', function () {
          it('When flow emits several values and @condition is positive, skips first @condition of values, then emits "next" for each remaining value, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.condition = 2;
              context.values = [1, 2, 3, 4];
            }, function (context) {
              return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length - context.condition);
              context.values.slice(context.condition).forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several values and @condition is negative, emits "next" for each value except the last @condition ones, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.condition = -2;
              context.values = [1, 2, 3, 4];
            }, function (context) {
              return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length + context.condition);
              context.values.slice(0, -context.condition).forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var someOperatorTests = function someOperatorTests(aeroflow, execute, expect) {
      return describe('#some', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.some;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.some();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits "next" with false, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.some().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several falsey values, emits "next" with false, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [false, 0, ''];
            }, function (context) {
              return aeroflow(context.values).some().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits at least one truthy value, emits "next" with true, then single lazy "done"', function () {
            return execute(function (context) {
              return context.values = [false, 1, ''];
            }, function (context) {
              return aeroflow(context.values).some().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
        describe('(@condition:function)', function () {
          it('When flow is empty, does not call @condition', function () {
            return execute(function (context) {
              return context.condition = context.spy();
            }, function (context) {
              return aeroflow.empty.some(context.condition).run();
            }, function (context) {
              return expect(context.condition).to.have.not.been.called;
            });
          });
          it('When flow is not empty, calls @condition with each emitted value, index of value and context data until @condition returns truthy result', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.condition = context.spy(function (_, index) {
                return index === context.values.length - 1;
              });
            }, function (context) {
              return aeroflow(context.values, 3).some(context.condition).run(context.data);
            }, function (context) {
              expect(context.condition).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return value > 0;
              };

              context.values = [0, 1];
            }, function (context) {
              return aeroflow(context.values).some(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
          it('When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return value > 0;
              };

              context.values = [0, -1];
            }, function (context) {
              return aeroflow(context.values).some(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:regex)', function () {
          it('When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done"', function () {
            return execute(function (context) {
              context.condition = /b/;
              context.values = ['a', 'b'];
            }, function (context) {
              return aeroflow(context.values).some(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
          it('When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = /b/;
              context.values = ['a', 'aa'];
            }, function (context) {
              return aeroflow(context.values).some(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:string)', function () {
          it('When flow emits at least one value equal to @condition, emits single "next" with true, then single lazy "done"', function () {
            return execute(function (context) {
              context.condition = 1;
              context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).some(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
          it('When flow emits several values not equal to @condition, emits single "next" with false, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = 1;
              context.values = [2, 3];
            }, function (context) {
              return aeroflow(context.values).some(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var sumOperatorTests = function sumOperatorTests(aeroflow, execute, expect) {
      return describe('#sum', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.sum;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.sum();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.sum().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several numeric values, emits single "next" with sum of emitted values, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 3, 2];
            }, function (context) {
              return aeroflow(context.values).sum().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.reduce(function (sum, value) {
                return sum + value;
              }, 0));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits at least one not numeric value, emits single "next" with NaN, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 'test', 2];
            }, function (context) {
              return aeroflow(context.values).sum().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(NaN);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var takeOperatorTests = function takeOperatorTests(aeroflow, execute, expect) {
      return describe('#take', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.take;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.take();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.take().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits "next" for each emitted value, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).take().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(false)', function () {
          it('When flow is not empty, emits only single lazy "done"', function () {
            return execute(function (context) {
              return aeroflow('test').take(false).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
        describe('(true)', function () {
          it('When flow is not empty, emits "next" for each emitted value, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).take(true).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@condition:function)', function () {
          it('When flow is empty, does not call @condition', function () {
            return execute(function (context) {
              return context.condition = context.spy();
            }, function (context) {
              return aeroflow.empty.take(context.condition).run();
            }, function (context) {
              return expect(context.condition).to.have.not.been.called;
            });
          });
          it('When flow is not empty, calls @condition with each emitted value, index of value and context data while it returns truthy', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.condition = context.spy(function (_, index) {
                return index < context.values.length - 1;
              });
            }, function (context) {
              return aeroflow(context.values, 3).take(context.condition).run(context.data);
            }, function (context) {
              expect(context.condition).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('When flow emits several values, then emits "next" for each emitted value while @condition returns truthy and skips remaining values, then emits single lazy "done"', function () {
            return execute(function (context) {
              context.condition = function (value) {
                return value < 3;
              };

              context.values = [1, 2, 3, 4];
            }, function (context) {
              return aeroflow(context.values).take(context.condition).run(context.next, context.done);
            }, function (context) {
              var index = context.values.findIndex(function (value) {
                return !context.condition(value);
              });
              expect(context.next).to.have.callCount(context.values.length - index);
              context.values.slice(0, index).forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
        });
        describe('(@condition:number)', function () {
          it('When flow emits several values and @condition is positive, emits "next" for each @condition of first values, then emits single lazy "done"', function () {
            return execute(function (context) {
              context.condition = 2;
              context.values = [1, 2, 3, 4];
            }, function (context) {
              return aeroflow(context.values).take(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.condition);
              context.values.slice(0, context.condition).forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
          it('When flow emits several values and @condition is negative, skips several values and emits "next" for each of @condition last values, then single greedy "done"', function () {
            return execute(function (context) {
              context.condition = -2;
              context.values = [1, 2, 3, 4];
            }, function (context) {
              return aeroflow(context.values).take(context.condition).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(-context.condition);
              context.values.slice(-context.condition).forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var toArrayOperatorTests = function toArrayOperatorTests(aeroflow, execute, expect) {
      return describe('#toArray', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.toArray;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.toArray();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits single "next" with empty array, then emits single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.toArray().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith([]);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits single "next" with array containing all emitted values, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).toArray().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var toSetOperatorTests = function toSetOperatorTests(aeroflow, execute, expect, sinon) {
      return describe('#toSet', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.toSet;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.toSet();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits single "next" with empty set, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.toSet().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(new Set());
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow is not empty, emits single "next" with set containing all unique emitted values, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 3, 5, 3, 1];
            }, function (context) {
              return aeroflow(context.values).toSet().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(new Set(context.values));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var toStringOperatorTests = function toStringOperatorTests(aeroflow, execute, expect, sinon) {
      return describe('#toString', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.toString;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.toString();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits single "next" with empty string, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.toString().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith('');
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits single number, emits single "next" with emitted number converted to string, then single greedy "done"', function () {
            return execute(function (context) {
              return context.number = 42;
            }, function (context) {
              return aeroflow(context.number).toString().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.number.toString());
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits single string, emits single "next" with emitted string, then single greedy "done"', function () {
            return execute(function (context) {
              return context.string = 'test';
            }, function (context) {
              return aeroflow(context.string).toString().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.string);
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several numbers, emits single "next" with emitted numbers converted to strings and concatenated via ",", then single greedy "done"', function () {
            return execute(function (context) {
              return context.numbers = [1, 2];
            }, function (context) {
              return aeroflow(context.numbers).toString().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.numbers.join());
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits several strings, emits single "next" with emitted strings concatenated via ",", then single greedy "done"', function () {
            return execute(function (context) {
              return context.strings = ['a', 'b'];
            }, function (context) {
              return aeroflow(context.strings).toString().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.strings.join());
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@seperator:string)', function () {
          it('When flow emits several strings, emits single "next" with emitted strings concatenated via @separator, then single greedy "done"', function () {
            return execute(function (context) {
              context.separator = ':';
              context.strings = ['a', 'b'];
            }, function (context) {
              return aeroflow(context.strings).toString(context.separator).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.strings.join(context.separator));
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
      });
    };

    var tests = [factoryTests, emptyGeneratorTests, expandGeneratorTests, justGeneratorTests, averageOperatorTests, catchOperatorTests, coalesceOperatorTests, countOperatorTests, everyOperatorTests, filterOperatorTests, mapOperatorTests, maxOperatorTests, meanOperatorTests, minOperatorTests, reduceOperatorTests, reverseOperatorTests, skipOperatorTests, someOperatorTests, sumOperatorTests, takeOperatorTests, toArrayOperatorTests, toSetOperatorTests, toStringOperatorTests];

    var index = function index(aeroflow, expect, sinon) {
      var data = {
        data: true
      },
          error = new Error('test');

      function fail() {
        throw error;
      }

      function noop() {}

      function spy(result) {
        return sinon.spy(typeof result === 'function' ? result : function () {
          return result;
        });
      }

      var Context = function () {
        function Context() {
          _classCallCheck(this, Context);
        }

        _createClass(Context, [{
          key: 'done',
          get: function get() {
            return this._done || (this._done = spy());
          },
          set: function set(result) {
            this._done = spy(result);
          }
        }, {
          key: 'next',
          get: function get() {
            return this._next || (this._next = spy());
          },
          set: function set(result) {
            this._next = spy(result);
          }
        }]);

        return Context;
      }();

      Object.defineProperties(Context.prototype, {
        data: {
          value: data
        },
        error: {
          value: error
        },
        fail: {
          value: fail
        },
        noop: {
          value: noop
        },
        spy: {
          value: spy
        }
      });

      function execute(arrange, act, assert) {
        if (arguments.length < 3) {
          assert = act;
          act = arrange;
          arrange = null;
        }

        var context = new Context();
        if (arrange) arrange(context);
        return Promise.resolve(act(context)).catch(Function()).then(function (result) {
          context.result = result;
          assert(context);
        });
      }

      tests.forEach(function (test) {
        return test(aeroflow, execute, expect);
      });
    };

    return index;
  });
});
