'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { constant, isFunction } from './utilites';

const mapEmitter = (emitter, mapper) => (next, done, context) => {
  let index = 0;
  emitter(
    value => next(mapper(value, index++, context.data)),
    done,
    context);
}

function map(mapper) {
  return arguments.length
    ? new Aeroflow(mapEmitter(
        this[SYMBOL_EMITTER],
        isFunction(mapper)
          ? mapper
          : constant(mapper)))
    : this;
}

export { map, mapEmitter };
