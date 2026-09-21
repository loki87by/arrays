/**
 * Делает первую букву строки заглавной.
 *
 * @param {string} text - Исходная строка.
 * @returns {string} Строка с заглавной первой буквой.
 *
 * @example
 * firstUpper("hello"); // "Hello"
 */
const firstUpper = (text) => {
  const letters = text.split("");
  return [letters[0].toUpperCase(), ...letters.slice(1)].join("");
};

/**
 * Приводит массив к заданному виду согласно конфигурации.
 *
 * Работает по принципу «цепочки фильтров и преобразователей»: каждая опция
 * конфига последовательно применяется к копии исходного массива. Порядок
 * применения: skip-фильтры → преобразования типов → dateToNumber → allToTypes → callback.
 *
 * @param {Array} array - Исходный массив (не мутируется, создаётся копия).
 * @param {Object} config - Конфигурация преобразований.
 * @param {boolean|Function} [config.skipUndefined] - Удаляет `undefined`.
 *   Если `true` — просто фильтрует; если функция — вызывается с `undefined`
 *   и результат приводится к boolean (true — оставить).
 * @param {boolean|Function} [config.skipNull] - Удаляет `null`.
 *   Если `true` — просто фильтрует; если функция — вызывается с `null`.
 * @param {boolean|Function} [config.skipNaN] - Удаляет `NaN`.
 *   Если `true` — использует `isNaN`; если функция — вызывается со значением,
 *   для которого `isNaN` вернул true.
 * @param {boolean|Function} [config.skipInfinity] - Удаляет `Infinity` / `-Infinity`.
 *   Если функция — вызывается со значением, если оно `NaN` (⚠️ поведение как в оригинале).
 * @param {boolean|Function} [config.booleanToNumber] - Преобразует `boolean` в `0`/`1`.
 *   Если функция — вызывается с boolean-значением.
 * @param {boolean|Function} [config.stringToNumber] - Преобразует строки в числа.
 *   При `true`: `+i`, если это валидное число, иначе `0`.
 *   Если функция — вызывается со строкой.
 * @param {Function|Object} [config.dateToNumber] - Преобразование `Date`.
 *   - Если функция — вызывается с датой и её результат используется.
 *   - Если объект:
 *     - `pre` — объект с опциями предобработки даты перед извлечением
 *       (y, yp, m, mp, d, dp, c, cp, h, hp, mi, mip, s, sp, ms, msp — установка/прибавление,
 *        ds, iso, js, lds, ls, lts, ts, tts, utc — строковые представления).
 *     - `reg` — функция или RegExp/строка; применяется к результату как замена.
 *     - иначе — набор ключей для извлечения части даты
 *       (p — timestamp, y — двузначный год, f — полный год, m — месяц, d — день,
 *        c — день недели, h — часы, mi — минуты, s — секунды, ms — миллисекунды).
 * @param {boolean} [config.allToTypes] - Заменяет каждый элемент строкой с именем его типа
 *   (Date, RegExp, Set, Map, WeakSet, WeakMap, ArrayBuffer, TypedArray, Promise, Error,
 *    Array, BigInt, Symbol, String, Boolean, Number, Function, Null, Undefined, Window
 *    или "<Constructor> (constructor)").
 * @param {Function} [config.callback] - Финальный преобразователь массива:
 *   получает уже сконфигурированный массив и возвращает новый.
 * @returns {Array} Новый сконфигурированный массив.
 *
 * @example
 * configurator([1, undefined, 2], { skipUndefined: true }); // [1, 2]
 * configurator([true, false], { booleanToNumber: true });   // [1, 0]
 * configurator(["1", "abc"], { stringToNumber: true });     // [1, 0]
 * configurator([new Date()], { allToTypes: true });         // ["Date"]
 */
export function configurator(array, config) {
  // Создаём копию, чтобы не мутировать исходный массив.
  let configuredArray = array.slice();

  // --- Фильтр: undefined ---
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

  // --- Фильтр: null ---
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

  // --- Фильтр: NaN ---
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

  // --- Фильтр: Infinity / -Infinity ---
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

  // --- Преобразование: boolean → number ---
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

  // --- Преобразование: string → number ---
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

  // --- Преобразование: Date → number (или строка/часть даты) ---
  if (config.dateToNumber) {
    if (typeof config.dateToNumber === "function") {
      configuredArray = configuredArray.map((i) => {
        if (i instanceof Date) {
          return config.dateToNumber(i);
        }
        return i;
      });
    } else {
      // Индексы элементов-дат, которые нужно преобразовать.
      const indexArray = configuredArray
        .map((i, ind) => (i instanceof Date ? ind : null))
        .filter((i) => !!i);

      configuredArray.forEach((i, ind) => {
        if (indexArray.includes(ind)) {
          if (config.dateToNumber.hasOwnProperty("pre")) {
            // Предобработка даты: установка или прибавление компонентов,
            // либо строковые представления.
            for ([key, val] of Object.entries(config.dateToNumber.pre)) {
              switch (key) {
                case "y":
                  i = new Date(i).setFullYear(val);
                case "yp":
                  i = new Date(i).setFullYear(new Date(i).getFullYear() + val);
                case "m":
                  i = new Date(i).setMonth(val);
                case "mp":
                  i = new Date(i).setMonth(new Date(i).getMonth() + val);
                case "d":
                  i = new Date(i).setDate(val);
                case "dp":
                  i = new Date(i).setDate(new Date(i).getDate() + val);
                case "c":
                  i = new Date(i).setDay(val);
                case "cp":
                  i = new Date(i).setDay(new Date(i).getDay() + val);
                case "h":
                  i = new Date(i).setHours(val);
                case "hp":
                  i = new Date(i).setHours(new Date(i).getHours() + val);
                case "mi":
                  i = new Date(i).setMinutes(val);
                case "mip":
                  i = new Date(i).setMinutes(new Date(i).getMinutes() + val);
                case "s":
                  i = new Date(i).getSeconds(val);
                case "sp":
                  i = new Date(i).getSeconds(new Date(i).getSeconds() + val);
                case "ms":
                  i = new Date(i).setMilliseconds(val);
                case "msp":
                  i = new Date(i).setMilliseconds(
                    new Date(i).getMilliseconds() + val
                  );
                case "ds":
                  i = new Date(i).toDateString();
                case "iso":
                  i = new Date(i).toISOString();
                case "js":
                  i = new Date(i).toJSON();
                case "lds":
                  i = new Date(i).toLocaleDateString();
                case "ls":
                  i = new Date(i).toLocaleString();
                case "lts":
                  i = new Date(i).toLocaleTimeString();
                case "ts":
                  i = new Date(i).toString();
                case "tts":
                  i = new Date(i).toTimeString();
                case "utc":
                  i = new Date(i).toUTCString();
                default:
                  i = new Date(i);
              }
            }
          } else {
            // Извлечение одной из частей даты.
            for (key of Object.keys(config.dateToNumber)) {
              switch (key) {
                case "p":
                  i = Date.parse(i);
                case "y":
                  i = +`${new Date(i).getFullYear()}`.slice(2);
                case "f":
                  i = new Date(i).getFullYear();
                case "m":
                  i = new Date(i).getMonth();
                case "d":
                  i = new Date(i).getDate();
                case "c":
                  i = new Date(i).getDay();
                case "h":
                  i = new Date(i).getHours();
                case "mi":
                  i = new Date(i).getMinutes();
                case "s":
                  i = new Date(i).getSeconds();
                case "ms":
                  i = new Date(i).getMilliseconds();
                default:
                  i = new Date(i);
              }
            }
          }

          // Постобработка результата через reg (функция или RegExp/строка).
          if (config.dateToNumber.hasOwnProperty("reg")) {
            if (typeof config.dateToNumber.reg === "function") {
              i = config.dateToNumber.reg(i);
            } else if (
              config.dateToNumber.reg instanceof RegExp ||
              typeof config.dateToNumber.reg === "string"
            ) {
              i = `${i}`.replace(new RegExp(config.dateToNumber.reg));
            }
          }
        }
      });
    }
  }

  // --- Преобразование: каждый элемент → строка с именем его типа ---
  if (config.allToTypes) {
    configuredArray = configuredArray.map((i) => {
      if (i instanceof Date) return "Date";
      if (i instanceof RegExp) return "RegExp";
      if (i instanceof Set) return "Set";
      if (i instanceof Map) return "Map";
      if (i instanceof WeakSet) return "WeakSet";
      if (i instanceof WeakMap) return "WeakMap";
      if (i instanceof ArrayBuffer) return "ArrayBuffer";
      if (ArrayBuffer.isView(i)) return "TypedArray";
      if (i instanceof Promise) return "Promise";
      if (i instanceof Error) return "Error";
      if (Array.isArray(i)) return "Array";
      if (typeof i === "bigint") return "BigInt";
      if (typeof i === "symbol") return "Symbol";
      if (["string", "boolean", "number", "function"].includes(typeof i)) {
        if (i instanceof Function && i.constructor.name !== "Function") {
          return `${firstUpper(i.constructor.name)} (constructor)`;
        }
        return firstUpper(typeof i);
      }
      if (i === null) return "Null";
      if (i === undefined) return "Undefined";
      if (i && typeof i.then === "function" && typeof i.catch === "function")
        return "Promise";
      if (i && Object.prototype.toString.call(i) === "[object Window]")
        return "Window";
      return `${firstUpper(i?.constructor?.name)} (constructor)` || "Object";
    });
  }

  // --- Финальный пользовательский преобразователь ---
  if (config.callback && typeof config.callback === "function") {
    configuredArray = config.callback(configuredArray);
  }

  return configuredArray;
}
