'use strict';

export default (aeroflow, assert) => describe('Aeroflow', () => {
    describe('#max()', ()=> {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.max));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow().max(), 'Aeroflow'));

        it('emitting undefined if empty flow', (done) => {
            let actual;
            aeroflow().max()
                    .run(value => actual = value);

            setImmediate(() => done(assert.isUndefined(actual)));
        });

        it('emitting valid result for non-empty flow', (done) => {
            let values = [1, 9, 2, 8, 3, 7, 4, 6, 5]
                , expected = Math.max(...values)
                , actual;

            aeroflow(values).max()
                    .run(value => actual = value);

            setImmediate(() => done(assert.strictEqual(actual, expected)));
        });
    });

    describe('#skip()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.skip));

        it('emitting undefined if called without param', (done) => {
            let actual;
            aeroflow([1, 2, 3, 4]).skip()
                    .run(value => actual = value);

            setImmediate(() => done(assert.isUndefined(actual)));
        });
    });

    describe('#skip(@Number)', () => {
        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow([1 ,2 ,3, 4]).skip(), 'Aeroflow'));

        describe('@Number', () => {

            describe('skipps provided number of values from start', () => {
                it('values passed as single source', (done) => {
                    let values = [1, 2, 3, 4],
                        skip = 2,
                        actual = [];

                    aeroflow(values).skip(skip)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, i) => assert.strictEqual(item, values[skip + i]));
                        done();
                    });
                });

                it('values passed as separate sources', () => {
                    let expected = [1, 2, 3, 4],
                        skip = 2,
                        actual = [];

                    aeroflow(1, 2, 3, 4).skip(skip)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, i) => assert.strictEqual(item, values[skip + i]));
                        done();
                    });
                });
            });

            it('emitting values skipped provided number of values from end', (done) => {
                let values = [1, 2, 3, 4]
                    , skip = 2
                    , actual = [];

                aeroflow(values).skip(-skip)
                                .run(value => actual.push(value));
                setImmediate(() => {
                    actual.forEach((item, i) => assert.strictEqual(item, values[i]));
                    done();
                });
            });
        });
    });

    describe('#skip(@Function)', () => {
        describe('@Function', () => {
            it('emitting remained values when provided function returns false', (done) => {
                let values = [1, 2, 3, 4]
                    , skip = Math.floor(values.length / 2)
                    , limiter = (value, index) => index < skip
                    , actual = [];

                aeroflow(values).skip(skip)
                                .run(value => actual.push(value));

                setImmediate(() => {
                    actual.forEach((item, i) => assert.strictEqual(item, values[skip + i]));
                    done();
                });
            });
        });
    });

    describe('#tap()', () => {
         it('is instance method', () =>
            assert.isFunction(aeroflow.empty.tap));

         it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow([1 ,2 ,3, 4]).tap(), 'Aeroflow'));
    });

    describe('#tap(@Function)', () => {
        describe('@Function', () => {
            it('intercepts each emitted value', done => {
                let expected = [0, 1, 2]
                    , actual = [];

                aeroflow(expected).tap(value => actual.push(value)).run();

                setImmediate(() => {
                    actual.forEach((item, i) => assert.strictEqual(item, expected[i]));
                    done();
                });
            });
        });
    });

    describe('#toArray()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.toArray));

        it('emitting single array containing all values', done => {
            let expected = [1, 2, 3]
                , actual;

            aeroflow(...expected).toArray().run(value => actual = value);

            setImmediate(() => {
                assert.isArray(actual);
                assert.sameMembers(actual, expected);
                done();
            });
        });
    });

    describe('#toMap()', () => {
        it('is instance method', () =>
            assert.isFunction(aeroflow.empty.toMap));

        it('emitting single map containing all values', done => {
            let expected = [1, 2, 3]
                , actual;

            aeroflow(...expected).toMap().run(value => actual = value);

            setImmediate(() => {
                assert.typeOf(actual, 'Map');
                assert.includeMembers(Array.from(actual.keys()), expected);
                assert.includeMembers(Array.from(actual.values()), expected);
                done();
            });
        });
    });
});