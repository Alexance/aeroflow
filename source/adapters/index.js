import { AEROFLOW, ARRAY, ERROR, FUNCTION, PROMISE } from '../symbols';
import registry from '../registry';
import arrayAdapter from './array';
import errorAdapter from './error';
import flowAdapter from './flow';
import functionAdapter from './function';
import iterableAdapter from './iterable';
import promiseAdapter from './promise';
import valueAdapter from './value';

const adapters = registry()
  .use(iterableAdapter)
  .use(AEROFLOW, flowAdapter)
  .use(ARRAY, arrayAdapter)
  .use(ERROR, errorAdapter)
  .use(FUNCTION, functionAdapter)
  .use(PROMISE, promiseAdapter);

export default adapters;
export {
  arrayAdapter,
  errorAdapter,
  flowAdapter,
  functionAdapter,
  iterableAdapter,
  promiseAdapter,
  valueAdapter
};

export function adapter(sources) {
  return (next, done, context) => {
    let index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= sources.length) done(result);
      else try {
        const source = sources[index];
        (adapters.get(source) || valueAdapter(source))(next, proceed, context);
      }
      catch (error) {
        done(error);
      }
    }(true);
  }
}
