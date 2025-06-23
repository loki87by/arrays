const firstUpper = (text) => {
  const letters = text.split('')
  return [letters[0].toUpperCase(), ...letters.slice(1)].join('')
}

export function configurator(array, config) {
  let configuredArray = array.slice();

  if (config.skipUndefined) {
    if (typeof config.skipUndefined === "boolean") {
      configuredArray = configuredArray.filter((i) => i !== undefined);
    } else if (typeof config.skipUndefined === "function") {
      configuredArray = configuredArray.filter((i) => {
        if (i === undefined) {
          return config.skipUndefined(i);
        }
        return true;
      });
    } 
  }

  if (config.skipNull) {
    if (typeof config.skipNull === "boolean") {
      configuredArray = configuredArray.filter((i) => i !== null);
    } else if (typeof config.skipNull === "function") {
      configuredArray = configuredArray.filter((i) => {
        if (i === null) {
          return config.skipNull(i);
        }
        return true;
      });
    } 
  }

  if (config.skipNaN) {
    if (typeof config.skipNaN === "boolean") {
      configuredArray = configuredArray.filter((i) => !isNaN(i));
    } else if (typeof config.skipNaN === "function") {
      configuredArray = configuredArray.filter((i) => {
        if (isNaN(i)) {
          return config.skipNaN(i);
        }
        return true;
      });
    } 
  }

  if (config.skipInfinity) {
    if (typeof config.skipInfinity === "boolean") {
      configuredArray = configuredArray.filter(
        (i) => i !== +Infinity && i !== -Infinity && i !== Infinity
      );
    } else if (typeof config.skipInfinity === "function") {
      configuredArray = configuredArray.filter((i) => {
        if (isNaN(i)) {
          return config.skipInfinity(i);
        }
        return true;
      });
    } 
  }

  if (config.booleanToNumber) {
    if (typeof config.booleanToNumber === "boolean") {
      configuredArray = configuredArray.map((i) => {
        if (typeof i === "boolean") {
          return +i;
        }
        return i;
      });
    } else if (typeof config.booleanToNumber === "function") {
      configuredArray = configuredArray.map((i) => {
        if (typeof i === "boolean") {
          return config.booleanToNumber(i);
        }
        return i;
      });
    } 
  }

  if (config.stringToNumber) {
    if (typeof config.stringToNumber === "boolean") {
      configuredArray = configuredArray.map((i) => {
        if (typeof i === "string") {
          return !isNaN(+i) ? +i : 0;
        }
        return i;
      });
    } else if (typeof config.stringToNumber === "function") {
      configuredArray = configuredArray.map((i) => {
        if (typeof i === "string") {
          return config.stringToNumber(i);
        }
        return i;
      });
    } 
  }

  if (config.allToTypes) {
    configuredArray = configuredArray.map(i => {
        if (i instanceof Date) return 'Date'
        if (i instanceof RegExp) return 'RegExp'
        if (i instanceof Set) return 'Set'
        if (i instanceof Map) return 'Map'
        if (i instanceof WeakSet) return 'WeakSet'
        if (i instanceof WeakMap) return 'WeakMap'
        if (i instanceof ArrayBuffer) return 'ArrayBuffer'
        if (ArrayBuffer.isView(i)) return 'TypedArray'
        if (i instanceof Promise) return 'Promise'
        if (i instanceof Error) return 'Error'
        if (Array.isArray(i)) return 'Array'
        if (typeof i === 'bigint') return 'BigInt'
        if (typeof i === 'symbol') return 'Symbol'
        if (["string", "boolean", "number", "function"].includes(typeof i)) {
            if (i instanceof Function && i.constructor.name !== 'Function') {
                return `${firstUpper(i.constructor.name)} (constructor)`
            }
            return firstUpper(typeof i)
        }
        if (i === null) return 'Null'
        if (i === undefined) return 'Undefined'
        if (i && typeof i.then === 'function' && typeof i.catch === 'function') return 'Promise'
        if (i && Object.prototype.toString.call(i) === '[object Window]') return 'Window'
        return `${firstUpper(i?.constructor?.name)} (constructor)` || 'Object'
    })
}

  if (config.callback && typeof config.callback === "function") {
    configuredArray = config.callback(configuredArray)
  }

  return configuredArray
}
