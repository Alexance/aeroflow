## Classes

<dl>
<dt><a href="#Flow">Flow</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#aeroflow">aeroflow([sources])</a> ⇒ <code><a href="#Flow">Flow</a></code></dt>
<dd><p>Creates new instance emitting values extracted from every provided data source in series.
If no data sources provided, creates empty instance emitting &quot;done&quot; event only.</p>
</dd>
</dl>

<a name="Flow"></a>

## Flow
**Kind**: global class  
**Properties**

- emitter <code>function</code>  
- sources <code>array</code>  


* [Flow](#Flow)
    * [.average()](#Flow+average) ⇒ <code>[Flow](#Flow)</code>
    * [.catch([alternative])](#Flow+catch) ⇒ <code>[Flow](#Flow)</code>
    * [.chain([operator])](#Flow+chain) ⇒ <code>[Flow](#Flow)</code>
    * [.coalesce([alternative])](#Flow+coalesce) ⇒ <code>[Flow](#Flow)</code>
    * [.count()](#Flow+count) ⇒ <code>[Flow](#Flow)</code>
    * [.delay([delayer])](#Flow+delay) ⇒ <code>[Flow](#Flow)</code>
    * [.distinct(untilChanged)](#Flow+distinct) ⇒ <code>[Flow](#Flow)</code>
    * [.every([predicate])](#Flow+every) ⇒ <code>[Flow](#Flow)</code>
    * [.filter([predicate])](#Flow+filter) ⇒ <code>[Flow](#Flow)</code>
    * [.flatten([depth])](#Flow+flatten) ⇒ <code>[Flow](#Flow)</code>
    * [.group([...selectors])](#Flow+group) ⇒ <code>[Flow](#Flow)</code>
    * [.map([mapper])](#Flow+map) ⇒ <code>[Flow](#Flow)</code>
    * [.max()](#Flow+max) ⇒ <code>[Flow](#Flow)</code>
    * [.mean()](#Flow+mean) ⇒ <code>[Flow](#Flow)</code>
    * [.min()](#Flow+min) ⇒ <code>[Flow](#Flow)</code>
    * [.reduce([reducer], [accumulator], [required])](#Flow+reduce) ⇒ <code>[Flow](#Flow)</code>
    * [.replay(delay, timing)](#Flow+replay) ⇒ <code>[Flow](#Flow)</code>
    * [.retry(attempts)](#Flow+retry) ⇒ <code>[Flow](#Flow)</code>
    * [.reverse()](#Flow+reverse) ⇒ <code>[Flow](#Flow)</code>
    * [.run([next], [done])](#Flow+run) ⇒ <code>Promise</code>
    * [.scan([scanner])](#Flow+scan)
    * [.skip([condition])](#Flow+skip) ⇒ <code>[Flow](#Flow)</code>
    * [.slice([begin], [end])](#Flow+slice) ⇒ <code>[Flow](#Flow)</code>
    * [.some([predicate])](#Flow+some) ⇒ <code>[Flow](#Flow)</code>
    * [.sort([...parameters])](#Flow+sort) ⇒ <code>[Flow](#Flow)</code> &#124; <code>[Flow](#Flow)</code>
    * [.sum([required])](#Flow+sum) ⇒ <code>[Flow](#Flow)</code>
    * [.take([condition])](#Flow+take) ⇒ <code>[Flow](#Flow)</code>
    * [.toArray()](#Flow+toArray) ⇒ <code>[Flow](#Flow)</code>
    * [.toMap([keySelector], [valueSelector])](#Flow+toMap) ⇒ <code>[Flow](#Flow)</code>
    * [.toSet()](#Flow+toSet) ⇒ <code>[Flow](#Flow)</code>
    * [.toString([separator])](#Flow+toString) ⇒ <code>[Flow](#Flow)</code>

<a name="Flow+average"></a>

### flow.average() ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Example**  
```js
aeroflow().average().notify(console).run();
// done true
aeroflow('test').average().notify(console).run();
// next NaN
// done true
aeroflow(1, 2, 6).average().notify(console).run();
// next 3
// done true
```
<a name="Flow+catch"></a>

### flow.catch([alternative]) ⇒ <code>[Flow](#Flow)</code>
Returns new flow suppressing error, emitted by this flow, or replacing it with alternative data source.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [alternative] <code>function</code> | <code>any</code> - Optional alternative data source to replace error, emitted by this flow.
If not passed, the emitted error is supressed.
If a function passed, it is called with two arguments:
1) the error, emitted by this flow,
2) context data (see [run](#Flow+run) method documentation for additional information about context data).
The result, returned by this function, as well as any other value passed as alternative,
is adapted with suitable adapter from [aeroflow.adapters](aeroflow.adapters) registry and emitted to this flow.

**Example**  
```js
aeroflow(new Error('test')).catch().notify(console).run();
// done false
aeroflow(new Error('test')).dump('before ').catch('success').dump('after ').run();
// before done Error: test(…)
// after next success
// after done false
aeroflow(new Error('test')).catch([1, 2]).notify(console).run();
// next 1
// next 2
// done false
aeroflow(new Error('test')).catch(() => [1, 2]).notify(console).run();
// next 1
// next 2
// done false
aeroflow(new Error('test')).catch(() => [[1], [2]]).notify(console).run();
// next [1]
// next [2]
// done false
```
<a name="Flow+chain"></a>

### flow.chain([operator]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [operator] <code>function</code>

<a name="Flow+coalesce"></a>

### flow.coalesce([alternative]) ⇒ <code>[Flow](#Flow)</code>
Returns new flow emitting values from alternate data source when this flow is empty.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [alternative] <code>any</code> - Optional alternative data source to use when this flow is empty.
If not passed, this method does nothing.
If a function passed, it is called with one argument:
1) the context data (see [run](#Flow+run) method documentation for additional information about context data).
The result, returned by this function, as well as any other value passed as alternative,
is adapted with suitable adapter from [aeroflow.adapters](aeroflow.adapters) registry and emitted to this flow.

**Example**  
```js
aeroflow.empty.coalesce().notify(console).run();
// done true
aeroflow.empty.coalesce([1, 2]).notify(console).run();
// next 1
// next 2
// done true
aeroflow.empty.coalesce(() => [1, 2]).notify(console).run();
// next 1
// next 2
// done true
aeroflow.empty.coalesce(() => [[1], [2]]).notify(console).run();
// next [1]
// next [2]
// done true
```
<a name="Flow+count"></a>

### flow.count() ⇒ <code>[Flow](#Flow)</code>
Counts the number of values emitted by this flow and emits only count value.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Example**  
```js
aeroflow().count().notify(console).run();
// next 0
// done
aeroflow('a', 'b', 'c').count().notify(console).run();
// next 3
// done
```
<a name="Flow+delay"></a>

### flow.delay([delayer]) ⇒ <code>[Flow](#Flow)</code>
Delays emission of each value by specified amount of time.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Example:**: aeroflow(1, 2).delay(500).notify(console).run();
// next 1 // after 500ms
// next 2 // after 500ms
// done true // after 500ms
aeroflow(1, 2).delay(new Date(Date.now() + 500)).notify(console).run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(1, 2).delay((value, index) => 500 + 500 * index).notify(console).run();
// next 1 // after 500ms
// next 2 // after 1000ms
// done true
aeroflow(1, 2).delay(value => { throw new Error }).notify(console).run();
// done Error(…)
// Uncaught (in promise) Error: test(…)  
**Params**

- [delayer] <code>function</code> | <code>number</code> | <code>date</code> - Function, defining dynamic delay, called for each emitted value with three arguments:
  1) Value being emitted;
  2) Index of iteration.
The result returned by delayer function is converted to number and used as delay in milliseconds.
Or static numeric delay in milliseconds.
Or date to delay until.

<a name="Flow+distinct"></a>

### flow.distinct(untilChanged) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- untilChanged <code>boolean</code>

**Example**  
```js
aeroflow(1, 1, 2, 2, 1, 1).distinct().notify(console).run();
// next 1
// next 2
// done true
aeroflow(1, 1, 2, 2, 1, 1).distinct(true).notify(console).run();
// next 1
// next 2
// next 1
// done true
```
<a name="Flow+every"></a>

### flow.every([predicate]) ⇒ <code>[Flow](#Flow)</code>
Tests whether all values emitted by this flow pass the provided test.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting true if all emitted values pass the test; otherwise, false.  
**Params**

- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

**Example**  
```js
aeroflow().every().notify(console).run();
// next true
// done true
aeroflow('a', 'b').every('a').notify(console).run();
// next false
// done false
aeroflow(1, 2).every(value => value > 0).notify(console).run();
// next true
// done true
aeroflow(1, 2).every(value => { throw new Error }).notify(console).run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
```
<a name="Flow+filter"></a>

### flow.filter([predicate]) ⇒ <code>[Flow](#Flow)</code>
Filters values emitted by this flow with the provided test.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting only values passing the provided test.  
**Params**

- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

**Example**  
```js
aeroflow().filter().notify(console).run();
// done true
aeroflow(0, 1).filter().notify(console).run();
// next 1
// done true
aeroflow('a', 'b', 'a').filter('a').notify(console).run();
// next "a"
// next "a"
// done true
aeroflow('a', 'b', 'a').filter(/a/).notify(console).run();
// next "b"
// next "b"
// done true
aeroflow(1, 2, 3, 4, 5).filter(value => (value % 2) === 0).notify(console).run();
// next 2
// next 4
// done true
aeroflow(1, 2).filter(value => { throw new Error }).notify(console).run();
// done Error: (…)
// Uncaught (in promise) Error: test(…)
```
<a name="Flow+flatten"></a>

### flow.flatten([depth]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [depth] <code>number</code>

**Example**  
```js
aeroflow([[1, 2]]).flatten().notify(console).run();
// next 1
// next 2
// done true
aeroflow(() => [[1], [2]]).flatten(1).notify(console).run();
// next [1]
// next [2]
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten().notify(console).run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten(1).notify(console).run();
// next [1, 2] // after 500ms
// done true
```
<a name="Flow+group"></a>

### flow.group([...selectors]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [...selectors] <code>function</code> | <code>Array.&lt;any&gt;</code>

**Example**  
```js
aeroflow.range(1, 10).group(value => (value % 2) ? 'odd' : 'even').notify(console).run();
// next ["odd", Array[5]]
// next ["even", Array[5]]
// done true
aeroflow(
  { country: 'Belarus', city: 'Brest' },
  { country: 'Poland', city: 'Krakow' },
  { country: 'Belarus', city: 'Minsk' },
  { country: 'Belarus', city: 'Grodno' },
  { country: 'Poland', city: 'Lodz' }
).group(value => value.country, value => value.city).notify(console).run();
// next ["Belarus", {{"Brest" => Array[1]}, {"Minsk" => Array[1]}, {"Grodno" => Array[1]}}]
// next ["Poland", {{"Krakow" => Array[1]}, {"Lodz" => Array[1]}}]
// done
```
<a name="Flow+map"></a>

### flow.map([mapper]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [mapper] <code>function</code> | <code>any</code>

**Example**  
```js
aeroflow().map().notify(console).run();
// done true
aeroflow(1, 2).map().notify(console).run();
// next 1
// next 2
// done true
aeroflow(1, 2).map('test').notify(console).run();
// next test
// next test
// done true
aeroflow(1, 2).map(value => value * 10).notify(console).run();
// next 10
// next 20
// done true
```
<a name="Flow+max"></a>

### flow.max() ⇒ <code>[Flow](#Flow)</code>
Determines the maximum value emitted by this flow.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting the maximum value only.  
**Example**  
```js
aeroflow().max().notify(console).run();
// done true
aeroflow(1, 3, 2).max().notify(console).run();
// next 3
// done true
aeroflow('b', 'a', 'c').max().notify(console).run();
// next c
// done true
```
<a name="Flow+mean"></a>

### flow.mean() ⇒ <code>[Flow](#Flow)</code>
Determines the mean value emitted by this flow.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting the mean value only.  
**Example**  
```js
aeroflow().mean().notify(console).run();
// done true
aeroflow(3, 1, 2).mean().notify(console).run();
// next 2
// done true
aeroflow('a', 'd', 'f', 'm').mean().notify(console).run();
// next f
// done true
```
<a name="Flow+min"></a>

### flow.min() ⇒ <code>[Flow](#Flow)</code>
Determines the minimum value emitted by this flow.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting the minimum value only.  
**Example**  
```js
aeroflow().min().notify(console).run();
// done true
aeroflow(3, 1, 2).min().notify(console).run();
// next 1
// done true
aeroflow('b', 'a', 'c').min().notify(console).run();
// next a
// done true
```
<a name="Flow+reduce"></a>

### flow.reduce([reducer], [accumulator], [required]) ⇒ <code>[Flow](#Flow)</code>
Applies a function against an accumulator and each value emitted by this flow
to reduce it to a single value, returns new flow emitting the reduced value.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting reduced result only or no result at all if this flow is empty
and the 'required' argument is false.  
**Params**

- [reducer] <code>function</code> | <code>any</code> - Function to execute on each emitted value, taking four arguments:
  result - the value previously returned in the last invocation of the reducer, or seed, if supplied;
  value - the current value emitted by this flow;
  index - the index of the current value emitted by the flow;
  data - the data bound to current execution context.
  If is not a function, the returned flow will emit just the reducer value.
- [accumulator] <code>any</code> | <code>boolean</code> - Value to use as the first argument to the first call of the reducer.
When boolean value is passed and no value defined for the 'required' argument,
the 'seed' argument is considered to be omitted.
- [required] <code>boolean</code> <code> = false</code> - True to emit reduced result always, even if this flow is empty.
False to emit only 'done' event for empty flow.

**Example**  
```js
aeroflow().reduce().notify(console).run();
// done false
aeroflow(1, 2).reduce().notify(console).run();
// done false
aeroflow().reduce('test').notify(console).run();
// next test
// done true
aeroflow().reduce((product, value) => product * value).notify(console).run();
// next undefined
// done true
aeroflow().reduce((product, value) => product * value, 1, true).notify(console).run();
// next 1
// done true
aeroflow(2, 4, 8).reduce((product, value) => product * value).notify(console).run();
// next 64
// done
aeroflow(2, 4, 8).reduce((product, value) => product * value, 2).notify(console).run();
// next 128
// done
aeroflow(['a', 'b', 'c'])
  .reduce((product, value, index) => product + value + index, '')
  .notify(console).run();
// next a0b1c2
// done
```
<a name="Flow+replay"></a>

### flow.replay(delay, timing) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- delay <code>number</code> | <code>function</code>
- timing <code>boolean</code>

**Example**  
```js
aeroflow(1, 2).replay(1000).take(4).notify(console).run();
// next 1
// next 2
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000).take(4).notify(console).run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000, true).take(4).notify(console).run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2 // after 500ms
// done false
```
<a name="Flow+retry"></a>

### flow.retry(attempts) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- attempts <code>number</code>

**Example**  
```js
var attempt = 0; aeroflow(() => {
  if (attempt++ % 2) return 'success';
  else throw new Error('error');
}).dump('before ').retry().dump('after ').run();
// before done Error: error(…)
// before next success
// after next success
// before done true
// after done true
```
<a name="Flow+reverse"></a>

### flow.reverse() ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Example**  
```js
aeroflow().reverse().notify(console).run();
// done true
aeroflow(1, 2, 3).reverse().notify(console).run();
// next 3
// next 2
// next 1
// done true
```
<a name="Flow+run"></a>

### flow.run([next], [done]) ⇒ <code>Promise</code>
Runs this flow.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>Promise</code> - New promise,
resolving to the latest value emitted by this flow (for compatibility with ES7 await operator),
or rejecting to the error thrown within this flow.  
**Params**

- [next] <code>function</code> | <code>any</code> - Optional callback called for each data value emitted by this flow with 3 arguments:
1) the emitted value,
2) zero-based index of emitted value,
3) context data.
When passed something other than function, it considered as context data.
- [done] <code>function</code> | <code>any</code> - Optional callback called after this flow has finished emission of data with 2 arguments:
1) the error thrown within this flow
or boolean value indicating lazy (false) or eager (true) enumeration of data sources,
2) context data.
When passed something other than function, it considered as context data.

**Example**  
```js
aeroflow('test').notify(console).run();
// next test
// done true
(async function() {
  var result = await aeroflow('test').notify(console).run();
  console.log(result);
})();
// test
aeroflow(Promise.reject('test')).run();
// Uncaught (in promise) Error: test(…)
```
<a name="Flow+scan"></a>

### flow.scan([scanner])
Emits first value emitted by this flow,
and then values returned by scanner applied to each successive emitted value.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [scanner] <code>function</code> | <code>any</code> - Function to apply to each emitted value, called with three arguments:
1) First value emitted by this flow or value returned by previous call to scanner;
2) Current value emitted by this flow;
3) Index of iteration.

**Example**  
```js
aeroflow.range(1, 3).scan((prev, next) => prev + next).notify(console).run();
```
<a name="Flow+skip"></a>

### flow.skip([condition]) ⇒ <code>[Flow](#Flow)</code>
Skips some of the values emitted by this flow,
returns flow emitting remaining values.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting remaining values.  
**Params**

- [condition] <code>number</code> | <code>function</code> | <code>any</code> - The number or predicate function used to determine how many values to skip.
  If omitted, returned flow skips all values emitting done event only.
  If zero, returned flow skips nothing.
  If positive number, returned flow skips this number of first emitted values.
  If negative number, returned flow skips this number of last emitted values.
  If function, returned flow skips emitted values while this function returns trythy value.

**Example**  
```js
aeroflow(1, 2, 3).skip().notify(console).run();
// done true
aeroflow(1, 2, 3).skip(1).notify(console).run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).skip(-1).notify(console).run();
// next 1
// next 2
// done true
aeroflow(1, 2, 3).skip(value => value < 3).notify(console).run();
// next 3
// done true
```
<a name="Flow+slice"></a>

### flow.slice([begin], [end]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [begin] <code>number</code>
- [end] <code>number</code>

**Example**  
```js
aeroflow(1, 2, 3).slice().notify(console).run();
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1).notify(console).run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1, 2).notify(console).run();
// next 2
// done false
aeroflow(1, 2, 3).slice(-2).notify(console).run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(-3, -1).notify(console).run();
// next 1
// next 2
// done true
```
<a name="Flow+some"></a>

### flow.some([predicate]) ⇒ <code>[Flow](#Flow)</code>
Tests whether some value emitted by this flow passes the predicate test,
returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow that emits true or false.  
**Params**

- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value.
Or scalar value to compare emitted values with.
If omitted, truthy predicate is used.

**Example**  
```js
aeroflow().some().notify(console).run();
// next false
// done true
aeroflow(1, 2, 3).some(2).notify(console).run();
// next true
// done false
aeroflow(1, 2, 3).some(value => value % 2).notify(console).run();
// next true
// done false
aeroflow(1, 2, 3).some(value => { throw new Error }).notify(console).run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
```
<a name="Flow+sort"></a>

### flow.sort([...parameters]) ⇒ <code>[Flow](#Flow)</code> &#124; <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [...parameters] <code>function</code> | <code>boolean</code> | <code>Array.&lt;&#x27;desc&#x27;&gt;</code>

**Example**  
```js
aeroflow(3, 1, 2).sort().notify(console).run();
// next 1
// next 2
// next 3
// done true
aeroflow(2, 1, 3).sort('desc').notify(console).run();
// next 3
// next 2
// next 1
// done true
aeroflow(
  { country: 'Belarus', city: 'Brest' },
  { country: 'Poland', city: 'Krakow' },
  { country: 'Belarus', city: 'Minsk' },
  { country: 'Belarus', city: 'Grodno' },
  { country: 'Poland', city: 'Lodz' }
).sort(value => value.country, value => value.city, 'desc').notify(console).run();
// next Object {country: "Belarus", city: "Minsk"}
// next Object {country: "Belarus", city: "Grodno"}
// next Object {country: "Belarus", city: "Brest"}
// next Object {country: "Poland", city: "Lodz"}
// next Object {country: "Poland", city: "Krakow"}
// done true
```
<a name="Flow+sum"></a>

### flow.sum([required]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [required] <code>boolean</code> <code> = false</code>

**Example**  
```js
aeroflow().sum().notify(console).run();
// done true
aeroflow('test').sum().notify(console).run();
// next NaN
// done true
aeroflow(1, 2, 3).sum().notify(console).run();
// next 6
// done true
```
<a name="Flow+take"></a>

### flow.take([condition]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Params**

- [condition] <code>function</code> | <code>number</code>

**Example**  
```js
aeroflow(1, 2, 3).take().notify(console).run();
// done false
aeroflow(1, 2, 3).take(1).notify(console).run();
// next 1
// done false
aeroflow(1, 2, 3).take(-1).notify(console).run();
// next 3
// done true
```
<a name="Flow+toArray"></a>

### flow.toArray() ⇒ <code>[Flow](#Flow)</code>
Collects all values emitted by this flow to array, returns flow emitting this array.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting array containing all results emitted by this flow.  
**Example**  
```js
aeroflow().toArray().notify(console).run();
// next []
// done true
aeroflow('test').toArray().notify(console).run();
// next ["test"]
// done true
aeroflow(1, 2, 3).toArray().notify(console).run();
// next [1, 2, 3]
// done true
```
<a name="Flow+toMap"></a>

### flow.toMap([keySelector], [valueSelector]) ⇒ <code>[Flow](#Flow)</code>
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting map containing all results emitted by this flow.  
**Params**

- [keySelector] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map key.
Or scalar value to use as map key.
- [valueSelector] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map value,
Or scalar value to use as map value.

**Example**  
```js
aeroflow().toMap().notify(console).run();
// next Map {}
// done true
aeroflow('test').toMap().notify(console).run();
// next Map {"test" => "test"}
done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, true).notify(console).run();
// next Map {"key1" => true, "key2" => true, "key3" => true}
// done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, v => 10 * v).notify(console).run();
// next Map {"key1" => 10, "key2" => 20, "key3" => 30}
// done true
```
<a name="Flow+toSet"></a>

### flow.toSet() ⇒ <code>[Flow](#Flow)</code>
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting set containing all results emitted by this flow.  
**Example**  
```js
aeroflow().toSet().notify(console).run();
// next Set {}
// done true
aeroflow(1, 2, 3).toSet().notify(console).run();
// next Set {1, 2, 3}
// done true
```
<a name="Flow+toString"></a>

### flow.toString([separator]) ⇒ <code>[Flow](#Flow)</code>
Returns new flow joining all values emitted by this flow into a string
and emitting this string.

**Kind**: instance method of <code>[Flow](#Flow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting string representation of this flow.  
**Params**

- [separator] <code>string</code> | <code>function</code> | <code>boolean</code> - Optional. Specifies a string to separate each value emitted by this flow.
The separator is converted to a string if necessary.
If omitted, the array elements are separated with a comma.
If separator is an empty string, all values are joined without any characters in between them.
If separator is a boolean value, it is used instead a second parameter of this method.

**Example**  
```js
aeroflow().toString().notify(console).run();
// next
// done true
aeroflow('test').toString().notify(console).run();
// next test
// done true
aeroflow(1, 2, 3).toString().notify(console).run();
// next 1,2,3
// done true
aeroflow(1, 2, 3).toString(';').notify(console).run();
// next 1;2;3
// done true
aeroflow(1, 2, 3).toString((value, index) => '-'.repeat(index + 1)).notify(console).run();
// next 1--2---3
// done true
```
<a name="aeroflow"></a>

## aeroflow([sources]) ⇒ <code>[Flow](#Flow)</code>
Creates new instance emitting values extracted from every provided data source in series.
If no data sources provided, creates empty instance emitting "done" event only.

**Kind**: global function  
**Params**

- [sources] <code>any</code> - Data sources to extract values from.

**Properties**

- adapters <code>Adapters</code> - Mixed array/map of adapters for various types of data sources.
As a map matches the type of a data source to adapter function (e.g. Promise -> promiseAdapter).
As an array contains functions performing arbitrary (more complex than type matching) testing
of a data source (e.g. some iterable -> iterableAdapter).
When aeroflow adapts particular data source, direct type mapping is attempted first.
Then, if mapping attempt did not return an adapter function,
array is enumerated in reverse order, from last indexed adapter to first,
until a function is returned.
This returned function is used as adapter and called with single argument: the data source being adapted.
Expected that adapter function being called with data source returns an emitter function accepting 2 arguments:
next callback, done callback and execution context.
If no adapter function has been found, the data source is treated as scalar value and emitted as is.
See examples to find out how to create and register custom adapters.  
- operators <code>object</code> - Map of operators available for use with every instance.
See examples to find out how to create and register custom operators.  

**Example**  
```js
aeroflow().notify(console).run();
// done true
aeroflow(
  1,
  [2, 3],
  new Set([4, 5]),
  () => 6,
  Promise.resolve(7),
  new Promise(resolve => setTimeout(() => resolve(8), 500))
).notify(console).run();
// next 1
// next 2
// next 3
// next 4
// next 5
// next 6
// next 7
// next 8 // after 500ms
// done true
aeroflow(new Error('test')).notify(console).run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
aeroflow(() => { throw new Error }).notify(console).run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
aeroflow("test").notify(console).run();
// next test
// done true
aeroflow.adapters.use('String', aeroflow.adapters['Array']);
aeroflow("test").notify(console).run();
// next t
// next e
// next s
// next t
// done true
aeroflow.operators.test = function() {
  return this.chain(emitter => (next, done, context) => emitter(
    value => next('test:' + value),
    done,
    context));
}
aeroflow(42).test().notify(console).run();
// next test:42
// done true
```

* [aeroflow([sources])](#aeroflow) ⇒ <code>[Flow](#Flow)</code>
    * [.create(emitter)](#aeroflow.create) ⇒ <code>[Flow](#Flow)</code>
    * [.expand(expander, [seed])](#aeroflow.expand) ⇒ <code>[Flow](#Flow)</code>
    * [.just(source)](#aeroflow.just) ⇒ <code>[Flow](#Flow)</code>
    * [.listen()](#aeroflow.listen)
    * [.random([minimum], [maximum])](#aeroflow.random) ⇒ <code>[Flow](#Flow)</code>
    * [.range([start], [end], [step])](#aeroflow.range) ⇒ <code>[Flow](#Flow)</code>
    * [.repeat([repeater], [delayer])](#aeroflow.repeat) ⇒ <code>[Flow](#Flow)</code>

<a name="aeroflow.create"></a>

### aeroflow.create(emitter) ⇒ <code>[Flow](#Flow)</code>
Creates programmatically controlled instance.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - The new instance emitting values generated by emitter function.  
**Params**

- emitter <code>function</code> | <code>any</code> - The emitter function taking three arguments:
next - the function emitting 'next' event,
done - the function emitting 'done' event,
context - the execution context.

**Example**  
```js
aeroflow.create((next, done, context) => {
  next('test');
  done();
}).notify(console).run();
// next test
// done true
aeroflow.create((next, done, context) => {
  window.addEventListener('click', next);
  return () => window.removeEventListener('click', next);
}).take(2).notify(console).run();
// next MouseEvent {...}
// next MouseEvent {...}
// done false
```
<a name="aeroflow.expand"></a>

### aeroflow.expand(expander, [seed]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**

- expander <code>function</code>
- [seed] <code>any</code>

**Example**  
```js
aeroflow.expand(value => value * 2, 1).take(3).notify(console).run();
// next 2
// next 4
// next 8
// done false
```
<a name="aeroflow.just"></a>

### aeroflow.just(source) ⇒ <code>[Flow](#Flow)</code>
Returns new instance emitting the provided source as is.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - The new instance emitting provided value.  
**Params**

- source <code>any</code> - The source to emit as is.

**Example**  
```js
aeroflow.just([1, 2, 3]).notify(console).run();
// next [1, 2, 3]
// done
```
<a name="aeroflow.listen"></a>

### aeroflow.listen()
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Example**  
```js
aeroflow
  .listen(document, 'mousemove')
  .map(event => ({ x: event.x, y: event.y }))
  .take(3)
  .notify(console)
  .run();
// next Object {x: 241, y: 269}
// next Object {x: 221, y: 272}
// next Object {x: 200, y: 273}
// done false
```
<a name="aeroflow.random"></a>

### aeroflow.random([minimum], [maximum]) ⇒ <code>[Flow](#Flow)</code>
Creates new instance emitting infinite sequence of random numbers.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - The new instance emitting random numbers.  
**Params**

- [minimum] <code>number</code>
- [maximum] <code>number</code>

**Example**  
```js
aeroflow.random().take(2).notify(console).run();
// next 0.07417976693250232
// next 0.5904422281309957
// done false
aeroflow.random(1, 9).take(2).notify(console).run();
// next 7
// next 2
// done false
aeroflow.random(1.1, 8.9).take(2).notify(console).run();
// next 4.398837305698544
// next 2.287970747705549
// done false
```
<a name="aeroflow.range"></a>

### aeroflow.range([start], [end], [step]) ⇒ <code>[Flow](#Flow)</code>
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**

- [start] <code>number</code>
- [end] <code>number</code>
- [step] <code>number</code>

**Example**  
```js
aeroflow.range().take(3).notify(console).run();
// next 0
// next 1
// next 2
// done false
aeroflow.range(-3).take(3).notify(console).run();
// next -3
// next -2
// next -1
// done false
aeroflow.range(1, 1).notify(console).run();
// next 1
// done true
aeroflow.range(0, 5, 2).notify(console).run();
// next 0
// next 2
// next 4
// done true
aeroflow.range(5, 0, -2).notify(console).run();
// next 5
// next 3
// next 1
// done true
```
<a name="aeroflow.repeat"></a>

### aeroflow.repeat([repeater], [delayer]) ⇒ <code>[Flow](#Flow)</code>
Creates infinite flow, repeating static/dynamic value immediately or with static/dynamic delay.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Flow](#Flow)</code> - New flow emitting repeated values.  
**Params**

- [repeater] <code>function</code> | <code>any</code> - Optional static value to repeat;
or function providing dynamic value and called with one argument:
1) index of current iteration.
- [delayer] <code>function</code> | <code>number</code> - Optional static delay between iterations in milliseconds;
or function providing dynamic delay and called with one argument:
1) index of current iteration.

**Example**  
```js
aeroflow.repeat(Math.random()).take(2).notify(console).run();
// next 0.7492001398932189
// next 0.7492001398932189
// done false
aeroflow.repeat(() => Math.random()).take(2).notify(console).run();
// next 0.46067174314521253
// next 0.7977648684754968
// done false
aeroflow.repeat(index => Math.pow(2, index)).take(3).notify(console).run();
// next 1
// next 2
// next 4
// done false
aeroflow.repeat('ping', 500).take(3).notify(console).run();
// next ping // after 500ms
// next ping // after 500ms
// next ping // after 500ms
// done false
aeroflow.repeat(index => index, index => 500 + 500 * index).take(3).notify(console).run();
// next 0 // after 500ms
// next 1 // after 1000ms
// next 2 // after 1500ms
// done false
```
