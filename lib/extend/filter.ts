import Promise from 'bluebird';

const typeAlias = {
  pre: 'before_post_render',
  post: 'after_post_render',
  'after_render:html': '_after_html_render'
};

interface FilterOptions {
  context?: any;
  args?: any[];
}


interface StoreFunction {
  (data?: any, ...args: any[]): any;
  priority?: number;
}

interface Store {
  [key: string]: StoreFunction[]
}

class Filter {
  public store: Store;

  constructor() {
    this.store = {};
  }

  list(): Store;
  list(type: string): StoreFunction[];
  list(type?: string) {
    if (!type) return this.store;
    return this.store[type] || [];
  }

  /**
  * Registers a function to a specific event type with an optional priority. 
  * If only a function is provided, it registers the function to the default event type ('after_post_render') with a default priority.
  *
  * @param {string | StoreFunction} type - The event type to register the function for, or the function itself if no type is provided.
  * @param {StoreFunction | number} [fn] - The function to be registered, or the priority if the first argument is the function.
  * @param {number} [priority=10] - The priority of the function. Lower numbers are higher priority.
  * 
  * @throws {TypeError} If the provided 'fn' is not a function.
  * 
  * The registered functions are sorted by priority in ascending order, meaning functions with lower priority values are executed first.
  * 
  * If no type is provided and only a function is given, it defaults to 'after_post_render'.
  */
  register(fn: StoreFunction): void
  register(fn: StoreFunction, priority: number): void
  register(type: string, fn: StoreFunction): void
  register(type: string, fn: StoreFunction, priority: number): void
  register(type: string | StoreFunction, fn?: StoreFunction | number, priority?: number): void {
    if (!priority) {
      if (typeof type === 'function') {
        priority = fn as number;
        fn = type;
        type = 'after_post_render';
      }
    }

    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    type = typeAlias[type as string] || type;
    priority = priority == null ? 10 : priority;

    const store = this.store[type as string] || [];
    this.store[type as string] = store;

    fn.priority = priority;
    store.push(fn);

    store.sort((a, b) => a.priority - b.priority);
  }

  /**
  * Unregisters a function from a specific event type. If the function is not found in the list of registered functions for the event type, no action is taken.
  *
  * @param {string} type - The event type from which the function will be removed.
  * @param {StoreFunction} fn - The function to be unregistered.
  * 
  * @throws {TypeError} If 'type' is not provided or if 'fn' is not a function.
  * 
  * The function searches for the specified function in the list of registered functions for the given event type. If the function is found, it is removed.
  * If the event type or the function is invalid, or the function is not found, no changes are made to the list.
  */
  unregister(type: string, fn: StoreFunction): void {
    if (!type) throw new TypeError('type is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    type = typeAlias[type] || type;

    const list = this.list(type);
    if (!list || !list.length) return;

    const index = list.indexOf(fn);

    if (index !== -1) list.splice(index, 1);
  }

   /**
  * Executes a list of registered filters for a specific event type, passing the provided data through each filter sequentially.
  * The result of each filter is passed as input to the next one. If no filters are registered for the event type, it returns the input data unchanged.
  *
  * @param {string} type - The event type for which the filters will be executed.
  * @param {any} data - The initial data to be passed through the filters.
  * @param {FilterOptions} [options={}] - Additional options for the filter execution.
  * @param {any} [options.context] - The context in which the filters will be executed.
  * @param {any[]} [options.args=[]] - Additional arguments to be passed to the filters, with the data as the first argument.
  * 
  * @returns {Promise<any>} A promise that resolves with the final result after all filters have been executed.
  * 
  * This method iterates over the filters registered for the given event type. Each filter is applied sequentially, and the result of one filter is passed as the input to the next.
  * If no result is returned by a filter, the previous data is carried forward.
  * 
  * If no filters are registered for the event type, it returns a promise resolving to the original data.
  */
  exec(type: string, data: any, options: FilterOptions = {}): Promise<any> {
    const filters = this.list(type);
    if (filters.length === 0) return Promise.resolve(data);

    const ctx = options.context;
    const args = options.args || [];

    args.unshift(data);

    return Promise.each(filters, filter => Reflect.apply(Promise.method(filter), ctx, args).then(result => {
      args[0] = result == null ? args[0] : result;
      return args[0];
    })).then(() => args[0]);
  }

  /**
  * Executes a list of registered filters for a specific event type synchronously, passing the provided data through each filter sequentially.
  * The result of each filter is passed as input to the next. If no filters are registered for the event type, it returns the input data unchanged.
  *
  * @param {string} type - The event type for which the filters will be executed.
  * @param {any} data - The initial data to be passed through the filters.
  * @param {FilterOptions} [options={}] - Additional options for the filter execution.
  * @param {any} [options.context] - The context in which the filters will be executed.
  * @param {any[]} [options.args=[]] - Additional arguments to be passed to the filters, with the data as the first argument.
  * 
  * @returns {any} The final result after all filters have been executed.
  * 
  * This method iterates over the filters registered for the given event type synchronously. Each filter is applied sequentially, and the result of one filter is passed as the input to the next.
  * If a filter returns null or undefined, the previous data is carried forward.
  * 
  * If no filters are registered for the event type, the method returns the original data.
  */
  execSync(type: string, data: any, options: FilterOptions = {}) {
    const filters = this.list(type);
    const filtersLen = filters.length;
    if (filtersLen === 0) return data;

    const ctx = options.context;
    const args = options.args || [];

    args.unshift(data);

    for (let i = 0, len = filtersLen; i < len; i++) {
      const result = Reflect.apply(filters[i], ctx, args);
      args[0] = result == null ? args[0] : result;
    }

    return args[0];
  }
}

export = Filter;
