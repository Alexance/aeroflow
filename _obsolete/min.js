'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { reduceAlongEmitter } from './reduce';

const minEmitter = emitter => reduceAlongEmitter(
  emitter,
  (minimum, value) => value < minimum ? value : minimum);

/**
  * Determine the minimum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 2, 3]).min().dump().run();
  * // next 1
  * // done
  */
function min() {
  return flow(minEmitter(this[EMITTER]));
}

export { min, minEmitter };