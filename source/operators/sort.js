'use strict';

import { FUNCTION, NUMBER, STRING } from '../symbols';
import { classOf, compare, isError, tie } from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { toArrayOperator } from './toArray';

export function sortOperator(parameters) {
  const directions = [], selectors = [];
  let direction = 1;
  for (var i = -1, l = parameters.length; ++i < l;) {
    let parameter = parameters[i];
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
    if (directions.length) directions[directions.length - 1] = parameter;
    else direction = parameter;
  }
  const comparer = selectors.length
    ? (left, right) => {
      let result;
      for (let i = -1, l = selectors.length; ++i < l;) {
        const selector = selectors[i];
        result = compare(selector(left), selector(right), directions[i]);
        if (result) break;
      }
      return result;
    }
    : (left, right) => compare(left, right, direction);
  return emitter => (next, done, context) => {
    let array;
    toArrayOperator()(emitter)(
      result => {
        array = result;
        return true;
      },
      result => {
        if (isError(result)) done(result);
        else {
          array.sort(comparer);
          arrayEmitter(array)(next, done, context);
        }
      },
      context);
  };
}
