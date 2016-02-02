'use strict';

import { AEROFLOW, CLASS, PROTOTYPE } from './symbols';
import { isFunction, objectDefineProperties, objectCreate, noop } from './utilites';

import { emptyEmitter } from './emitters/empty';
import { scalarEmitter } from './emitters/scalar';
import { adapters } from './emitters/adapters';
import { adapterEmitter } from './emitters/adapter';
import { customEmitter } from './emitters/custom';
import { errorEmitter } from './emitters/error';
import { expandEmitter } from './emitters/expand';
import { randomEmitter } from './emitters/random';
import { rangeEmitter } from './emitters/range';
import { repeatEmitter } from './emitters/repeat';
import { timerEmitter } from './emitters/timer';

import { countOperator } from './operators/count';
import { delayOperator } from './operators/delay';
import { dumpOperator } from './operators/dump';
import { everyOperator } from './operators/every';
import { filterOperator } from './operators/filter';
import { groupOperator } from './operators/group';
import { joinOperator } from './operators/join';
import { mapOperator } from './operators/map';
import { maxOperator } from './operators/max';
import { meanOperator } from './operators/mean';
import { minOperator } from './operators/min';
import { reduceOperator } from './operators/reduce';
import { reverseOperator } from './operators/reverse';
import { skipOperator } from './operators/skip';
import { someOperator } from './operators/some';
import { sumOperator } from './operators/sum';
import { takeOperator } from './operators/take';
import { tapOperator } from './operators/tap';
import { toArrayOperator } from './operators/toArray';
import { toMapOperator } from './operators/toMap';
import { toSetOperator } from './operators/toSet';

class Aeroflow {
  constructor(emitter, sources) {
    objectDefineProperties(this, {
      emitter: { value: emitter },
      sources: { value: sources }
    });
  }
}
/**
* Returns new flow emitting values from this flow first and then from all provided sources without interleaving them.
* @public @instance @alias Aeroflow@append
* @param {...any} [sources] The value sources to append to this flow.
* @return {Aeroflow} new flow.
* @example
* aeroflow(1).append(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500))).dump().run();
* // next 1
* // next 2
* // next 3
* // next 4
* // next 5 // after 500ms
* // done
*/
function append(...sources) {
  return new Aeroflow(this.emitter, this.sources.concat(sources));
}
function bind(...sources) {
  return new Aeroflow(this.emitter, sources);
}
function chain(operator) {
  return new Aeroflow(operator(this.emitter), this.sources);
}
/**
* Counts the number of values emitted by this flow, returns new flow emitting only this value.
*
* @example
* aeroflow(['a', 'b', 'c']).count().dump().run();
* // next 3
* // done
*/
function count(optional) {
  return this.chain(countOperator(optional));
}
/**
  * Returns new flow delaying emission of each value accordingly provided condition.
  *
  * @param {number|date|function} [interval] The condition used to determine delay for each subsequent emission.
  *   Number is threated as milliseconds interval (negative number is considered as 0).
  *   Date is threated as is (date in past is considered as now).
  *   Function is execute for each emitted value, with three arguments:
  *     value - The current value emitted by this flow
  *     index - The index of the current value
  *     context - The context object
  *   The result of condition function will be converted nu number and used as milliseconds interval.
  *
  * @example:
  * aeroflow(1, 2).delay(500).dump().run();
  * // next 1 // after 500ms
  * // next 2 // after 500ms
  * // done // after 500ms
  * aeroflow(1, 2).delay(new Date(Date.now() + 500)).dump().run();
  * // next 1 // after 500ms
  * // next 2
  * // done // after 500ms
  * aeroflow(1, 2).delay((value, index) => 500 + index * 500).dump().run();
  * // next 1 // after 500ms
  * // next 2 // after 1000ms
  * // done // after 1500ms
  */
function delay(interval) {
  return this.chain(delayOperator(interval));
}
/**
  * Dumps all events emitted by this flow to the `logger` with optional prefix.
  *
  * @param {string} [prefix=''] A string prefix prepended to each event name.
  * @param {function} [logger=console.log] Function to execute for each event emitted, taking two arguments:
  *   event - The name of event emitted prepended with prefix (next or done).
  *   value - The value (next event) or error (done event) emitted by this flow.
  *
  * @example
  * aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
  * // next 1
  * // next 2
  * // done
  */
function dump(prefix, logger) {
  return this.chain(dumpOperator(prefix, logger));
}
/**
  * Tests whether all values emitted by this flow pass the predicate test, returns flow emitting true if the predicate returns true for all emitted values; otherwise, false.
  *
  * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
  *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
  * @returns {Aeroflow} New flow that emits true or false.
  *
  * @example
  * aeroflow(1).every().dump().run();
  * // next true
  * // done
  * aeroflow.range(1, 3).every(2).dump().run();
  * // next false
  * // done
  * aeroflow.range(1, 3).every(value => value > 0).dump().run();
  * // next true
  * // done
  */
function every(condition) {
  return this.chain(everyOperator(condition));
}
/**
  * Returns new from emitting inly values that pass the test implemented by the provided predicate.
  *
  * @param {function|regexp|any} [predicate] The test applied to each emitted value.
  *
  * @example
  * aeroflow(0, 1).filter().dump().run();
  * // next 1
  * // done
  * aeroflow('a', 'b', 'a').filter('a').dump().run();
  * // next "a"
  * // next "a"
  * // done
  * aeroflow(a', 'b', 'a').filter(/a/).dump().run();
  * // next "b"
  * // next "b"
  * // done
  * aeroflow.range(1, 5).filter(value => (value % 2) === 0).dump().run();
  * // next 2
  * // next 4
  * // done
  */
function filter(condition) {
  return this.chain(filterOperator(condition)); 
}
/*
aeroflow(
  { country: 'Belarus', city: 'Brest' },
  { country: 'Poland', city: 'Krakow' },
  { country: 'Belarus', city: 'Minsk' },
  { country: 'Belarus', city: 'Grodno' },
  { country: 'Poland', city: 'Lodz' }
).group(value => value.country, value => value.city).dump().run();
// next ["Belarus", {{"Brest" => Array[1]}, {"Minsk" => Array[1]}, {"Grodno" => Array[1]}}]
// next ["Poland", {{"Krakow" => Array[1]}, {"Lodz" => Array[1]}}]
// done
*/
function group(...selectors) {
  return this.chain(groupOperator(selectors)); 
}
function join(condition, optional) {
  return this.chain(joinOperator(condition, optional)); 
}
function map(mapping) {
  return this.chain(mapOperator(mapping)); 
}
/**
  * Determines the maximum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 3, 2]).max().dump().run();
  * // next 3
  * // done
  */
function max() {
  return this.chain(maxOperator());
}
/**
  * Determines the mean value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  * // next 3
  * // done
  */
function mean() {
  return this.chain(meanOperator());
}
/**
  * Determine the minimum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([2, 1, 3]).min().dump().run();
  * // next 1
  * // done
  */
function min() {
  return this.chain(minOperator());
}
/**
* Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.
* @public @instance @alias Aeroflow@prepend
* @param {...any} [sources] Values to concatenate with this flow.
* @example
* aeroflow(1).prepend(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500))).dump().run();
* // next 2
* // next 3
* // next 4
* // next 5 // after 500ms
* // next 1
* // done
*/
function prepend(...sources) {
  return new Aeroflow(this.emitter, sources.concat(this.sources));
}
/**
* Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
* returns new flow emitting reduced value.
*
* @param {function|any} reducer Function to execute on each emitted value, taking four arguments:
*   result - the value previously returned in the last invocation of the reducer, or seed, if supplied
*   value - the current value emitted by this flow
*   index - the index of the current value emitted by the flow
*   context.data.
*   If is not a function, a flow emitting just reducer value will be returned.
* @param {any} initial Value to use as the first argument to the first call of the reducer.
*
* @example
* aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
* // next 64
* // done
* aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
* // next a0b1c2
* // done
*/
function reduce(reducer, seed, optional) {
  return this.chain(reduceOperator(reducer, seed, optional));
}
/**
 * @example
 * aeroflow(1, 2, 3).reverse().dump().run()
 * // next 3
 * // next 2
 * // next 1
 * // done
 * aeroflow.range(1, 3).reverse().dump().run()
 * // next 3
 * // next 2
 * // next 1
 * // done
 */
function reverse() {
  return this.chain(reverseOperator());
}
/**
 * Runs this flow asynchronously, initiating source to emit values,
 * applying declared operators to emitted values and invoking provided callbacks.
 * If no callbacks provided, runs this flow for its side-effects only.
 * @public @instance @alias Aeroflow@run
 * @param {function} [next] Callback to execute for each emitted value, taking two arguments: value, context.
 * @param {function} [done] Callback to execute as emission is complete, taking two arguments: error, context.
 * @param {function} [data] Arbitrary value passed to each callback invoked by this flow as context.data.
 * @example
 * aeroflow(1, 2, 3).run(value => console.log('next', value), error => console.log('done', error));
 * // next 1
 * // next 2
 * // next 3
 * // done undefined
 */
function run(next, done, data) {
  if (!isFunction(done)) done = noop;
  if (!isFunction(next)) next = noop;
  const context = objectDefineProperties({}, {
    data: { value: data },
    flow: { value: this }
  });
  try {
    context.flow.emitter(
      result => false !== next(result, data),
      result => done(result, data),
      context);
  }
  catch(error) {
    done(error, data);
  }
  return this;
}
/**
  * Skips some of the values emitted by this flow,
  *   returns flow emitting remaining values.
  *
  * @param {number|function|any} [condition] The number or predicate function used to determine how many values to skip.
  *   If omitted, returned flow skips all values emitting done event only.
  *   If zero, returned flow skips nothing.
  *   If positive number, returned flow skips this number of first emitted values.
  *   If negative number, returned flow skips this number of last emitted values.
  *   If function, returned flow skips emitted values while this function returns trythy value.
  * @returns {Aeroflow} new flow emitting remaining values.
  *
  * @example
  * aeroflow([1, 2, 3]).skip().dump().run();
  * // done
  * aeroflow([1, 2, 3]).skip(1).dump().run();
  * // next 2
  * // next 3
  * // done
  * aeroflow([1, 2, 3]).skip(-1).dump().run();
  * // next 1
  * // next 2
  * // done
  * aeroflow([1, 2, 3]).skip(value => value < 3).dump().run();
  * // next 3
  * // done
  */
function skip(condition) {
  return this.chain(skipOperator(condition));
}
/**
* Tests whether some value emitted by this flow passes the predicate test,
  *   returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.
  *
  * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
  *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
  * @returns {Aeroflow} New flow that emits true or false.
  *
  * @example
  * aeroflow(0).some().dump().run();
  * // next false
  * // done
  * aeroflow.range(1, 3).some(2).dump().run();
  * // next true
  * // done
  * aeroflow.range(1, 3).some(value => value % 2).dump().run();
  * // next true
  * // done
  */
function some(condition) {
  return this.chain(someOperator(condition));
}
/*
  aeroflow([1, 2, 3]).sum().dump().run();
*/
function sum() {
  return this.chain(sumOperator());
}
function take(condition) {
  return this.chain(takeOperator(condition));
}
/**
  * Executes provided callback once per each value emitted by this flow,
  * returns new tapped flow or this flow if no callback provided.
  *
  * @param {function} [callback] Function to execute for each value emitted, taking three arguments:
  *   value emitted by this flow,
  *   index of the value,
  *   context object.
  *
  * @example
  * aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
  * // value: 1 index: 0
  * // value: 2 index: 1
  * // value: 3 index: 2
  */
function tap(callback) {
  return this.chain(tapOperator(callback));
}
/**
  * Collects all values emitted by this flow to array, returns flow emitting this array.
  *
  * @returns {Aeroflow} New flow that emits an array.
  *
  * @example
  * aeroflow.range(1, 3).toArray().dump().run();
  * // next [1, 2, 3]
  * // done
  */
function toArray() {
  return this.chain(toArrayOperator());
}
/**
  * Collects all values emitted by this flow to ES6 map, returns flow emitting this map.
  *
  * @param {function|any} [keyTransformation] The mapping function used to transform each emitted value to map key,
  *   or scalar value to use as map key.
  * @param {function|any} [valueTransformation] The mapping function used to transform each emitted value to map value,
  *   or scalar value to use as map value.
  * @returns {Aeroflow} New flow that emits a map.
  *
  * @example
  * aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();
  * // next Map {"key1" => true, "key2" => true, "key3" => true}
  * // done
  * aeroflow.range(1, 3).toMap(v => 'key' + v, v => v * 10).dump().run();
  * // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
  * // done
  */
function toMap(keyTransformation, valueTransformation) {
   return this.chain(toMapOperator(keyTransformation, valueTransformation));
}
/**
  * Collects all values emitted by this flow to ES6 set, returns flow emitting this set.
  *
  * @returns {Aeroflow} New flow that emits a set.
  *
  * @example
  * aeroflow.range(1, 3).toSet().dump().run();
  * // next Set {1, 2, 3}
  * // done
  */
function toSet() {
  return this.chain(toSetOperator()); 
}
const operators = objectCreate(Object[PROTOTYPE], {
  count: { value: count, writable: true },
  delay: { value: delay, writable: true },
  dump: { value: dump, writable: true },
  every: { value: every, writable: true },
  filter: { value: filter, writable: true },
  group: { value: group, writable: true },
  join: { value: join, writable: true },
  map: { value: map, writable: true },
  max: { value: max, writable: true },
  mean: { value: mean, writable: true },
  min: { value: min, writable: true },
  reduce: { value: reduce, writable: true },
  reverse: { value: reverse, writable: true },
  skip: { value: skip, writable: true },
  some: { value: some, writable: true },
  sum: { value: sum, writable: true },
  take: { value: take, writable: true },
  tap: { value: tap, writable: true },
  toArray: { value: toArray, writable: true },
  toMap: { value: toMap, writable: true },
  toSet: { value: toSet, writable: true }
});
Aeroflow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  append: { value: append },
  bind: { value: bind },
  chain: { value: chain },
  prepend: { value: prepend },
  run: { value: run }
});

function emit(next, done, context) {
  const sources = context.flow.sources, limit = sources.length;
  let index = -1;
  !function proceed(result) {
    if (result !== true || ++index >= limit) done(result);
    else adapterEmitter(sources[index], true)(next, proceed, context);
  }();
}

export default function aeroflow(...sources) {
  return new Aeroflow(emit, sources);
}
/**
  * Creates programmatically controlled flow.
  * @static
  * @alias aeroflow.create
  * @param {function|any} emitter The emitter function taking three arguments:
  *   next - the function emitting 'next' event,
  *   done - the function emitting 'done' event,
  *   context - current execution context.
  * @example
  * aeroflow.create((next, done, context) => {
  *   next(1);
  *   next(new Promise(resolve => setTimeout(() => resolve(2), 500)));
  *   setTimeout(done, 1000);
  * }).dump().run();
  * // next 1 // after 500ms
  * // next 2 // after 1000ms
  * // done
  */
function create(emitter) {
  return new Aeroflow(customEmitter(emitter));
}
function error(message) {
  return new Aeroflow(errorEmitter(message));
}
function expand(expander, seed) {
  return new Aeroflow(expandEmitter(expander, seed));
}
/**
  * Returns new flow emitting the provided value only.
  * @static
  * @alias aeroflow.just
  * @param {any} value The value to emit.
  * @example
  * aeroflow.just('test').dump().run();
  * // next "test"
  * // done
  * aeroflow.just(() => 'test').dump().run();
  * // next "test"
  * // done
  */
function just(value) {
  return new Aeroflow(scalarEmitter(value));
}
/**
  * Returns new flow emitting random numbers.
  * @static
  * @alias aeroflow.random
  * @example
  * aeroflow.random().take(3).dump().run();
  * aeroflow.random(0.1).take(3).dump().run();
  * aeroflow.random(null, 0.1).take(3).dump().run();
  * aeroflow.random(1, 9).take(3).dump().run();
  */
function random(minimum, maximum) {
  return new Aeroflow(randomEmitter(minimum, maximum));
}
/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
function range(start, end, step) {
  return new Aeroflow(rangeEmitter(start, end, step));
}
/**
  * Creates flow of repeting values.
  * @static
  * @alias.aeroflow.repeat
  * @param {function|any} repeater Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments: 
  *   index - index of the value being emitted,
  *   data - contextual data.
  * @returns {Aeroflow} new flow.
  * @example
  * aeroflow.repeat(new Date().getSeconds(), 3).dump().run();
  * // next 1
  * // next 1
  * // next 1
  * // done
  * aeroflow.repeat(() => new Date().getSeconds(), 3).delay((value, index) => index * 1000).dump().run();
  * // next 1
  * // next 2
  * // next 3
  * // done
  * aeroflow.repeat(index => Math.pow(2, index), 3).dump().run();
  * // next 1
  * // next 2
  * // next 4
  * // done
  */
function repeat(value) {
  return new Aeroflow(repeatEmitter(value));
}
function timer(interval) {
  return new Aeroflow(timerEmitter(interval));
}
objectDefineProperties(aeroflow, {
  adapters: { get: () => adapters },
  create: { value: create },
  empty: { enumerable: true, value: new Aeroflow(emptyEmitter()) },
  error: { value: error },
  expand: { value: expand },
  just: { value: just },
  operators: { get: () => operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat },
  timer: { value: timer }
});
