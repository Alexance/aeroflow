# TOC
   - [aeroflow](#aeroflow)
     - [()](#aeroflow-)
     - [(@source:aeroflow)](#aeroflow-sourceaeroflow)
     - [(@source:array)](#aeroflow-sourcearray)
     - [(@source:date)](#aeroflow-sourcedate)
     - [(@source:error)](#aeroflow-sourceerror)
     - [(@source:function)](#aeroflow-sourcefunction)
     - [(@source:iterable)](#aeroflow-sourceiterable)
     - [(@source:null)](#aeroflow-sourcenull)
     - [(@source:promise)](#aeroflow-sourcepromise)
     - [(@source:string)](#aeroflow-sourcestring)
     - [(@source:undefined)](#aeroflow-sourceundefined)
     - [.empty](#aeroflow-empty)
     - [.expand](#aeroflow-expand)
       - [()](#aeroflow-expand-)
       - [(@expander:function)](#aeroflow-expand-expanderfunction)
       - [(@expander:function, @seed:any)](#aeroflow-expand-expanderfunction-seedany)
     - [.just](#aeroflow-just)
       - [()](#aeroflow-just-)
       - [(@value:aeroflow)](#aeroflow-just-valueaeroflow)
       - [(@value:array)](#aeroflow-just-valuearray)
       - [(@value:function)](#aeroflow-just-valuefunction)
       - [(@value:iterable)](#aeroflow-just-valueiterable)
       - [(@value:promise)](#aeroflow-just-valuepromise)
     - [#average](#aeroflow-average)
       - [()](#aeroflow-average-)
     - [#catch](#aeroflow-catch)
       - [()](#aeroflow-catch-)
       - [(@alternative:function)](#aeroflow-catch-alternativefunction)
       - [(@alternative:!function)](#aeroflow-catch-alternativefunction)
     - [#coalesce](#aeroflow-coalesce)
       - [()](#aeroflow-coalesce-)
       - [(@alternative:function)](#aeroflow-coalesce-alternativefunction)
       - [(@alternative:!function)](#aeroflow-coalesce-alternativefunction)
     - [#count](#aeroflow-count)
       - [()](#aeroflow-count-)
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
Is function.

```js
return exec(function () {}, /* arrange */
function () {
  return aeroflow;
}, /* act */
function (result) {
  return expect(result).to.be.a('function');
} /* assert */);
```

<a name="aeroflow-"></a>
## ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Returns empty flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow().notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns empty flow not emitting "next" notification.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow().notify(spy).run();
}, function (spy) {
  return expect(spy).to.have.not.been.called;
});
```

<a name="aeroflow-sourceaeroflow"></a>
## (@source:aeroflow)
Returns flow emitting "done" notification argumented with "true" when @source is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(aeroflow.empty).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(aeroflow([1, 2])).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(aeroflow([1, 2])).take(1).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(false);
});
```

Returns flow not emitting "next" notification when @source is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(aeroflow.empty).notify(spy).run();
}, function (spy) {
  return expect(spy).to.have.not.been.called;
});
```

Returns flow emitting several "next" notifications argumented with subsequent items from @source.

```js
return exec(function () {
  return { source: [1, 2], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(aeroflow(ctx.source)).notify(ctx.spy).run();
}, function (ctx) {
  return ctx.source.forEach(function (value) {
    return expect(ctx.spy).to.have.been.calledWith(value);
  });
});
```

<a name="aeroflow-sourcearray"></a>
## (@source:array)
Returns flow emitting "done" notification argumented with "true" when @source is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow([]).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow([1, 2]).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow([1, 2]).take(1).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(false);
});
```

Returns flow not emitting "next" notification when @source is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow([]).notify(spy).run();
}, function (spy) {
  return expect(spy).to.have.not.been.called;
});
```

Returns flow emitting several "next" notifications argumented with subsequent items from @source.

```js
return exec(function () {
  return { source: [1, 2], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return ctx.source.forEach(function (value) {
    return expect(ctx.spy).to.have.been.calledWith(value);
  });
});
```

<a name="aeroflow-sourcedate"></a>
## (@source:date)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Date()).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return { source: new Date(), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.source);
});
```

<a name="aeroflow-sourceerror"></a>
## (@source:error)
Returns flow emitting "done" notification argumented with @source.

```js
return exec(function () {
  return { source: new Error('test'), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(Function(), ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.source);
});
```

Returns flow not emitting "next" notification.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Error('test')).notify(spy).run();
}, function (spy) {
  return expect(spy).to.have.not.been.called;
});
```

<a name="aeroflow-sourcefunction"></a>
## (@source:function)
Calls @source and passes ctx data as first argument.

```js
return exec(function () {
  return { data: {}, source: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).run(ctx.data);
}, function (ctx) {
  return expect(ctx.source).to.have.been.calledWith(ctx.data);
});
```

Returns flow emitting "done" notification argumented with "true" when @source does not throw.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(Function()).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with error thrown by @source.

```js
return exec(function () {
  return { error: new Error('test'), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(function () {
    throw ctx.error;
  }).notify(Function(), ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.error);
});
```

Returns flow emitting "next" notification argumented with value returned by @source.

```js
return exec(function () {
  return { value: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(function () {
    return ctx.value;
  }).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-sourceiterable"></a>
## (@source:iterable)
Returns empty flow emitting "done" notification argumented with "true" when source is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Set()).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Set([1, 2])).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Set([1, 2])).take(1).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(false);
});
```

Returns flow not emitting "next" notification when source is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Set()).notify(spy).run();
}, function (spy) {
  return expect(spy).to.have.not.been.called;
});
```

Returns flow emitting several "next" notifications argumented with subsequent items from @source.

```js
return exec(function () {
  return { source: [1, 2], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(new Set(ctx.source)).notify(ctx.spy).run();
}, function (ctx) {
  return ctx.source.forEach(function (value) {
    return expect(ctx.spy).to.have.been.calledWith(value);
  });
});
```

<a name="aeroflow-sourcenull"></a>
## (@source:null)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(null).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return { source: null, spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.source);
});
```

<a name="aeroflow-sourcepromise"></a>
## (@source:promise)
Returns flow emitting "done" notification argumented with "true" when @source resolves.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(Promise.resolve()).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "done" notification argumented with rejection error when @source rejects.

```js
return exec(function () {
  return { error: new Error('test'), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(Promise.reject(ctx.error)).notify(Function(), ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.error);
});
```

Returns flow emitting "next" notification argumented with value resolved by @source.

```js
return exec(function () {
  return { value: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(Promise.resolve(ctx.value)).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-sourcestring"></a>
## (@source:string)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow('test').notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return { source: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.source);
});
```

<a name="aeroflow-sourceundefined"></a>
## (@source:undefined)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(undefined).notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(undefined).notify(function (arg) {
    return spy(typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
  }, Function()).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith('undefined');
});
```

<a name="aeroflow-empty"></a>
## .empty
Gets instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.empty;
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Gets flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Gets flow not emitting "next" notification.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.notify(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

<a name="aeroflow-expand"></a>
## .expand
Is static method.

```js
return exec(null, function () {
  return aeroflow.expand;
}, function (result) {
  return expect(result).to.be.a('function');
});
```

<a name="aeroflow-expand-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.expand();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

<a name="aeroflow-expand-expanderfunction"></a>
### (@expander:function)
Calls @expander.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.expand(spy).take(1).run();
}, function (spy) {
  return expect(spy).to.have.been.called;
});
```

Passes undefined to @expander as first argument when no seed has been specified.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.expand(function (arg) {
    return spy(typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
  }).take(1).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith('undefined');
});
```

Passes value returned by @expander to @expander as first argument on subsequent iteration.

```js
return exec(function () {
  var value = 'test';
  return { value: value, spy: sinon.spy(function () {
      return value;
    }) };
}, function (ctx) {
  return aeroflow.expand(function (result) {
    return ctx.spy(result);
  }).take(2).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

Passes zero-based index of iteration to @expander as second argument.

```js
return exec(function () {
  return { limit: 3, spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.expand(function (_, index) {
    return ctx.spy(index);
  }).take(ctx.limit).run();
}, function (ctx) {
  return Array(ctx.limit).fill(0).forEach(function (_, i) {
    return expect(ctx.spy).to.have.been.calledWith(i);
  });
});
```

Passes context data to @expander as third argument.

```js
return exec(function () {
  return { data: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.expand(function (_, __, data) {
    return ctx.spy(data);
  }).take(1).run(ctx.data);
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.data);
});
```

Emits "next" notification with value returned by @expander.

```js
return exec(function () {
  return { value: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.expand(function () {
    return ctx.value;
  }).take(1).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-expand-expanderfunction-seedany"></a>
### (@expander:function, @seed:any)
Passes @seed to @expander as first argument at first iteration.

```js
return exec(function () {
  return { seed: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.expand(function (seed) {
    return ctx.spy(seed);
  }, ctx.seed).take(1).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.seed);
});
```

<a name="aeroflow-just"></a>
## .just
Is static method.

```js
return exec(null, function () {
  return aeroflow.just;
}, function (result) {
  return expect(result).to.be.a('function');
});
```

<a name="aeroflow-just-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.just();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.just().notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

Returns flow emitting "next" notification argumented with undefined.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.just().notify(function (result) {
    return spy(typeof result === 'undefined' ? 'undefined' : _typeof(result));
  }).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith('undefined');
});
```

<a name="aeroflow-just-valueaeroflow"></a>
### (@value:aeroflow)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: aeroflow.empty, spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-just-valuearray"></a>
### (@value:array)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: [], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-just-valuefunction"></a>
### (@value:function)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: Function(), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-just-valueiterable"></a>
### (@value:iterable)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: new Set(), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-just-valuepromise"></a>
### (@value:promise)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: Promise.resolve, spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-average"></a>
## #average
Is instance method.

```js
return exec(null, function () {
  return aeroflow.empty.average;
}, function (result) {
  return expect(result).to.be.a('function');
});
```

<a name="aeroflow-average-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.empty.average();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Does not emit "next" notification when flow is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.average().notify(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

Emits "next" notification argumented with @value when flow emits single numeric @value.

```js
return exec(function () {
  return { value: 42, spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.value).average().notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

Emits "next" notification argumented with NaN when flow emits single not numeric @value.

```js
return exec(function () {
  return { value: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.value).average().notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(NaN);
});
```

Emits "next" notification argumented with average of @values when flow emits several numeric @values.

```js
return exec(function () {
  return { values: [1, 2, 5], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.values).average().notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / ctx.values.length);
});
```

Emits "next" notification argumented with NaN when flow emits several not numeric @values.

```js
return exec(function () {
  return { values: ['a', 'b'], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.value).average().notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(NaN);
});
```

<a name="aeroflow-catch"></a>
## #catch
Is instance method.

```js
return exec(null, function () {
  return aeroflow.empty.catch;
}, function (result) {
  return expect(result).to.be.a('function');
});
```

<a name="aeroflow-catch-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.empty.catch();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Does not emit "next" notification when flow is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.catch().notify(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

Does not emit "next" notification when flow emits single error.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Error('test')).catch().notify(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

Emits "done" notification argumented with "true" when emits error.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Error('test')).catch().notify(Function(), spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(true);
});
```

<a name="aeroflow-catch-alternativefunction"></a>
### (@alternative:function)
Does not call @alternative when flow is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.catch(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

Does not call @alternative when flow does not emit error.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow('test').catch(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

Calls @alternative and passes error as first argument when flow emits error.

```js
return exec(function () {
  return { error: new Error('test'), spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.error).catch(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.error);
});
```

Calls @alternative and passes context data as second argument when flow emits error.

```js
return exec(function () {
  return { data: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(new Error('test')).catch(function (_, data) {
    return ctx.spy(data);
  }).run(ctx.data);
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.data);
});
```

Emits "next" notification argumented with value returned by @alternative when flow emits error.

```js
return exec(function () {
  return { value: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(new Error('test')).catch(function () {
    return ctx.value;
  }).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-catch-alternativefunction"></a>
### (@alternative:!function)
Emits "next" notification argumented with @alternative when flow emits error.

```js
return exec(function () {
  return { alternative: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.alternative);
});
```

<a name="aeroflow-coalesce"></a>
## #coalesce
Is instance method.

```js
return exec(null, function () {
  return aeroflow.empty.coalesce;
}, function (result) {
  return expect(result).to.be.a('function');
});
```

<a name="aeroflow-coalesce-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.empty.coalesce();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Does not emit "next" notification when flow is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.coalesce().notify(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

<a name="aeroflow-coalesce-alternativefunction"></a>
### (@alternative:function)
Calls @alternative when flow is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.coalesce(spy).run();
}, function (spy) {
  return expect(spy).to.have.been.called;
});
```

Does not call @alternative when flow emits error.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow(new Error('test')).coalesce(spy).run();
}, function (spy) {
  return expect(spy).not.to.have.been.called;
});
```

Emits "next" notification argumented with value returned by @alternative when flow is empty.

```js
return exec(function () {
  return { value: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.empty.coalesce(function () {
    return ctx.value;
  }).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.value);
});
```

<a name="aeroflow-coalesce-alternativefunction"></a>
### (@alternative:!function)
Emits "next" notification argumented with @alternative value when flow is empty.

```js
return exec(function () {
  return { alternative: 'test', spy: sinon.spy() };
}, function (ctx) {
  return aeroflow.empty.coalesce(ctx.alternative).notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.alternative);
});
```

<a name="aeroflow-count"></a>
## #count
Is instance method.

```js
return exec(null, function () {
  return aeroflow.empty.count;
}, function (result) {
  return expect(result).to.be.a('function');
});
```

<a name="aeroflow-count-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(null, function () {
  return aeroflow.empty.count();
}, function (result) {
  return expect(result).to.be.an('Aeroflow');
});
```

Emits "next" notification argumented with "0" when flow is empty.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow.empty.count().notify(function (result) {
    return spy(result);
  }).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(0);
});
```

Emits "next" notification argumented with "1" when flow emits single value.

```js
return exec(function () {
  return sinon.spy();
}, function (spy) {
  return aeroflow('test').count().notify(spy).run();
}, function (spy) {
  return expect(spy).to.have.been.calledWith(1);
});
```

Emits number of @values emitted by flow when flow emits several @values.

```js
return exec(function () {
  return { values: [1, 2, 3], spy: sinon.spy() };
}, function (ctx) {
  return aeroflow(ctx.values).count().notify(ctx.spy).run();
}, function (ctx) {
  return expect(ctx.spy).to.have.been.calledWith(ctx.values.length);
});
```

