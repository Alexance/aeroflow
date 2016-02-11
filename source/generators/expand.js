'use strict';

import { constant, isFunction } from '../utilites';
import { unsync } from '../unsync';

export function expandGenerator(expanding, seed) {
  const expander = isFunction(expanding)
    ? expanding
    : constant(expanding);
  return (next, done, context) => {
    let index = 0, value = seed;
    !function proceed() {
      while (!unsync(next(value = expander(value, index++, context.data)), proceed, done));
    }();
  };
}
