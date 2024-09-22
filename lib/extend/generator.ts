import Promise from 'bluebird';
import type { NodeJSLikeCallback } from '../types';

interface BaseObj {
  path: string;
  data?: any;
  layout?: string | string[];
}
type ReturnType = BaseObj | BaseObj[];
type GeneratorReturnType = ReturnType | Promise<ReturnType>;

interface GeneratorFunction {
  (locals: any, callback?: NodeJSLikeCallback<any>): GeneratorReturnType;
}

type StoreFunctionReturn = Promise<ReturnType>;

interface StoreFunction {
  (locals: any): StoreFunctionReturn;
}

interface Store {
  [key: string]: StoreFunction
}

class Generator {
  public id: number;
  public store: Store;

  constructor() {
    this.id = 0;
    this.store = {};
  }

  list(): Store {
    return this.store;
  }

  get(name: string): StoreFunction {
    return this.store[name];
  }

  /**
  * Registers a generator function with an optional name. If no name is provided, a default name is generated using an internal ID counter.
  * 
  * @param {string | GeneratorFunction} name - The name for the generator function or the function itself if no name is provided.
  * @param {GeneratorFunction} [fn] - The generator function to be registered.
  * 
  * @throws {TypeError} If the provided 'fn' is not a function.
  * 
  * If no name is provided, the method will automatically generate a name using the internal ID counter (e.g., 'generator-1', 'generator-2', etc.).
  * If the function takes more than one argument, it is converted into a promise-based function using `Promise.promisify`.
  * The function is stored in an internal registry (`store`) under the given or generated name.
  */
  register(fn: GeneratorFunction): void
  register(name: string, fn: GeneratorFunction): void
  register(name: string | GeneratorFunction, fn?: GeneratorFunction): void {
    if (!fn) {
      if (typeof name === 'function') { // fn
        fn = name;
        name = `generator-${this.id++}`;
      } else {
        throw new TypeError('fn must be a function');
      }
    }

    if (fn.length > 1) fn = Promise.promisify(fn);
    this.store[name as string] = Promise.method(fn);
  }
}

export = Generator;
