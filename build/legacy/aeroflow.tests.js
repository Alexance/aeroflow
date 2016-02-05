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

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var staticMethodsTests = function staticMethodsTests(aeroflow, assert) {
        return describe('aeroflow', function () {
            it('is function', function () {
                return assert.isFunction(aeroflow);
            });
            describe('#empty', function () {
                it('is static property returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.empty, 'Aeroflow');
                });
                it('emitting empty flow', function (done) {
                    var result = undefined;
                    aeroflow.empty.run(function (value) {
                        return result = value;
                    });
                    setImmediate(function () {
                        return done(assert.isUndefined(result));
                    });
                });
            });
            describe('#expand()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.expand);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.expand(), 'Aeroflow');
                });
            });
            describe('#expand(@function)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.expand(function () {
                        return true;
                    }, 1), 'Aeroflow');
                });
                describe('@function', function () {
                    it('emitting geometric progression', function (done) {
                        var expander = function expander(value) {
                            return value * 2;
                        },
                            actual = [],
                            seed = 1,
                            expected = [2, 4, 8],
                            index = 0;

                        aeroflow.expand(expander, seed).take(expected.length).run(function (value) {
                            actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#just()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.just);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.just(), 'Aeroflow');
                });
                it('emitting empty flow', function (done) {
                    var actual = undefined;
                    aeroflow.just().run(function (value) {
                        return value = actual;
                    });
                    setImmediate(function () {
                        assert.isUndefined(actual);
                        done();
                    });
                });
            });
            describe('#just(@*)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.just(function () {
                        return true;
                    }), 'Aeroflow');
                });
                describe('@function', function () {
                    it('emitting single function', function (done) {
                        var expected = function expected() {},
                            actual = undefined;

                        aeroflow.just(expected).run(function (value) {
                            return actual = value;
                        });
                        setImmediate(function () {
                            return done(assert.strictEqual(actual, expected));
                        });
                    });
                });
                describe('@Promise', function () {
                    it('emitting single promise', function (done) {
                        var expected = Promise.resolve([1, 2, 3]),
                            actual = undefined;
                        aeroflow.just(expected).run(function (value) {
                            return actual = value;
                        });
                        setImmediate(function () {
                            return done(assert.strictEqual(actual, expected));
                        });
                    });
                });
            });
            describe('#random()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.random);
                });
                it('emitting random decimals within 0 and 1', function (done) {
                    var actual = [];
                    aeroflow.random().take(10).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        actual.forEach(function (item) {
                            return assert.isTrue(!Number.isInteger(item) && item >= 0 && item < 1);
                        });
                        done();
                    });
                });
            });
            describe('#random(@Number, @Number)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.random(0, 1), 'Aeroflow');
                });
                describe('@Number, @Number', function () {
                    it('emitting random integers within a range', function (done) {
                        var limit = 10,
                            max = 10,
                            min = 1,
                            actual = [];
                        aeroflow.random(min, max).take(limit).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item) {
                                return assert.isTrue(Number.isInteger(item) && item >= min && item < max);
                            });
                            done();
                        });
                    });
                    it('emitting random decimals within a range', function (done) {
                        var limit = 10,
                            max = 10.1,
                            min = 1.1,
                            actual = [];
                        aeroflow.random(min, max).take(limit).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item) {
                                return assert.isTrue(!Number.isInteger(item) && item >= min && item < max);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#range()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.range);
                });
                it('emitting ascending sequential starting from 0', function (done) {
                    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        actual = [];
                    aeroflow.range().take(10).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        actual.forEach(function (item, index) {
                            return assert.strictEqual(item, expected[index]);
                        });
                        done();
                    });
                });
            });
            describe('#range(@Number, @Number, @Number)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.random(0, 1), 'Aeroflow');
                });
                describe('@Number', function () {
                    it('emitting ascending sequential starting from passed number', function (done) {
                        var expected = [5, 6, 7, 8],
                            actual = [];
                        aeroflow.range(expected[0]).take(4).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
                describe('@Number, @Number', function () {
                    it('emitting ascending sequential integers within a range', function (done) {
                        var expected = [5, 6, 7, 8],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            actual = [];
                        aeroflow.range(start, end).take(4).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                    it('emitting descending sequential integers within a range', function (done) {
                        var expected = [8, 7, 6, 5],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            actual = [];
                        aeroflow.range(start, end).take(4).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
                describe('@Number, @Number, @Number', function () {
                    it('emitting ascending sequential integers within a stepped range', function (done) {
                        var expected = [0, 2, 4, 6],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            step = 2,
                            actual = [];
                        aeroflow.range(start, end, step).take(10).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                    it('emitting descending sequential integers within a stepped range', function (done) {
                        var expected = [6, 4, 2, 0],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            step = -2,
                            actual = [];
                        aeroflow.range(start, end, step).take(10).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#repeat()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.repeat);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.repeat(), 'Aeroflow');
                });
            });
            describe('#repeat(@function)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.repeat(function () {
                        return true;
                    }), 'Aeroflow');
                });
                describe('@function', function () {
                    it('emitting geometric progression', function (done) {
                        var repeater = function repeater(index) {
                            return index * 2;
                        },
                            expected = [0, 2, 4, 6, 8],
                            actual = [];

                        aeroflow.repeat(repeater).take(expected.length).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
        });
    };

    var factoryTests = function factoryTests(aeroflow, assert) {
        return describe('aeroflow', function () {
            describe('aeroflow()', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(), 'Aeroflow');
                });
                describe('#sources', function () {
                    it('is initially empty array', function () {
                        assert.strictEqual(aeroflow().sources.length, 0);
                    });
                });
                describe('#emitter', function () {
                    it('is function', function () {
                        assert.isFunction(aeroflow().emitter);
                    });
                });
            });
            describe('aeroflow(@Array)', function (done) {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow([1, 2]), 'Aeroflow');
                });
                describe('@Array', function () {
                    it('emitting array items', function (done) {
                        var expected = ['str', new Date(), {}, 2],
                            actual = [];
                        aeroflow(expected).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            return done(assert.sameMembers(actual, expected));
                        });
                    });
                });
            });
            describe('aeroflow(@Map)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(new Map([[1, 2], [2, 1]])), 'Aeroflow');
                });
                describe('@Map', function () {
                    it('emitting map entries', function (done) {
                        var expected = [['a', 1], ['b', 2]],
                            actual = [];
                        aeroflow(new Map(expected)).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            expected.forEach(function (item, index) {
                                return assert.sameMembers(actual[index], expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('aerflow(@Set)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(new Set([1, 2])), 'Aeroflow');
                });
                describe('@Set', function () {
                    it('emitting set keys', function (done) {
                        var expected = ['a', 'b'],
                            actual = [];
                        aeroflow(new Set(expected)).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            return done(assert.sameMembers(actual, expected));
                        });
                    });
                });
            });
            describe('aeroflow(@Function)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(function () {
                        return true;
                    }), 'Aeroflow');
                });
                describe('@Function', function () {
                    it('emitting scalar value returned by function', function (done) {
                        var expected = 'test tester',
                            actual = undefined;
                        aeroflow(function () {
                            return expected;
                        }).run(function (value) {
                            return actual = value;
                        });
                        setImmediate(function () {
                            return done(assert.strictEqual(actual, expected));
                        });
                    });
                });
            });
            describe('Aeroflow(@Promise)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(Promise.resolve({})), 'Aeroflow');
                });
                describe('@Promise', function () {
                    it('emitting array resolved by promise', function (done) {
                        var expected = ['a', 'b'],
                            actual = undefined;
                        aeroflow(Promise.resolve(expected)).run(function (value) {
                            return assert.strictEqual(value, expected);
                        }, function () {
                            return done();
                        });
                    });
                });
            });
        });
    };

    var instanceTests = function instanceTests(aeroflow, assert) {
        return describe('Aeroflow', function () {
            describe('#max()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.max);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().max(), 'Aeroflow');
                });
                it('emitting undefined if empty flow', function (done) {
                    var actual = undefined;
                    aeroflow().max().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.isUndefined(actual));
                    });
                });
                it('emitting valid result for non-empty flow', function (done) {
                    var _Math;

                    var values = [1, 9, 2, 8, 3, 7, 4, 6, 5],
                        expected = (_Math = Math).max.apply(_Math, values),
                        actual = undefined;

                    aeroflow(values).max().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#skip()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.skip);
                });
                it('emitting undefined if called without param', function (done) {
                    var actual = undefined;
                    aeroflow([1, 2, 3, 4]).skip().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.isUndefined(actual));
                    });
                });
            });
            describe('#skip(@Number)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow([1, 2, 3, 4]).skip(), 'Aeroflow');
                });
                describe('@Number', function () {
                    describe('skipps provided number of values from start', function () {
                        it('values passed as single source', function (done) {
                            var values = [1, 2, 3, 4],
                                skip = 2,
                                actual = [];
                            aeroflow(values).skip(skip).run(function (value) {
                                return actual.push(value);
                            });
                            setImmediate(function () {
                                actual.forEach(function (item, i) {
                                    return assert.strictEqual(item, values[skip + i]);
                                });
                                done();
                            });
                        });
                        it('values passed as separate sources', function () {
                            var expected = [1, 2, 3, 4],
                                skip = 2,
                                actual = [];
                            aeroflow(1, 2, 3, 4).skip(skip).run(function (value) {
                                return actual.push(value);
                            });
                            setImmediate(function () {
                                actual.forEach(function (item, i) {
                                    return assert.strictEqual(item, values[skip + i]);
                                });
                                done();
                            });
                        });
                    });
                    it('emitting values skipped provided number of values from end', function (done) {
                        var values = [1, 2, 3, 4],
                            skip = 2,
                            actual = [];
                        aeroflow(values).skip(-skip).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, i) {
                                return assert.strictEqual(item, values[i]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#skip(@Function)', function () {
                describe('@Function', function () {
                    it('emitting remained values when provided function returns false', function (done) {
                        var values = [1, 2, 3, 4],
                            skip = Math.floor(values.length / 2),
                            limiter = function limiter(value, index) {
                            return index < skip;
                        },
                            actual = [];

                        aeroflow(values).skip(skip).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, i) {
                                return assert.strictEqual(item, values[skip + i]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#tap()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.tap);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow([1, 2, 3, 4]).tap(), 'Aeroflow');
                });
            });
            describe('#tap(@Function)', function () {
                describe('@Function', function () {
                    it('intercepts each emitted value', function (done) {
                        var expected = [0, 1, 2],
                            actual = [];
                        aeroflow(expected).tap(function (value) {
                            return actual.push(value);
                        }).run();
                        setImmediate(function () {
                            actual.forEach(function (item, i) {
                                return assert.strictEqual(item, expected[i]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#toArray()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.toArray);
                });
                it('emitting single array containing all values', function (done) {
                    var expected = [1, 2, 3],
                        actual = undefined;
                    aeroflow.apply(undefined, expected).toArray().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.isArray(actual);
                        assert.sameMembers(actual, expected);
                        done();
                    });
                });
            });
            describe('#toMap()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.toMap);
                });
                it('emitting single map containing all values', function (done) {
                    var expected = [1, 2, 3],
                        actual = undefined;
                    aeroflow.apply(undefined, expected).toMap().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.typeOf(actual, 'Map');
                        assert.includeMembers(Array.from(actual.keys()), expected);
                        assert.includeMembers(Array.from(actual.values()), expected);
                        done();
                    });
                });
            });
        });
    };

    var aeroflow = function aeroflow(_aeroflow, assert) {
        factoryTests(_aeroflow, assert);
        staticMethodsTests(_aeroflow, assert);
        instanceTests(_aeroflow, assert);
    };

    exports.default = aeroflow;
    module.exports = exports['default'];
});
