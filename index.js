import * as C from "./src/consts.js";
import * as U from "./src/utils.js";

/**
 * Суммирует элементы массива.
 *
 * Поддерживает работу как с примитивами (числа, строки, приводимые к числу),
 * так и с объектами, у которых нужно извлечь числовое значение по вложенному пути.
 *
 * @param {Array} array - Исходный массив для суммирования.
 * @param {Object} [config=C.SUM_CONFIG] - Конфигурация.
 * @param {string} [config.keyPath] - Путь к числовому значению внутри объекта,
 *   например "a.b.c". Если не указан, массив суммируется как набор примитивов.
 * @param {*} [config.*] - Прочие поля, передаваемые в U.configurator.
 * @returns {number|Error} Сумма элементов массива либо объект ошибки,
 *   если в процессе вычисления произошёл сбой.
 *
 * @example
 * sum([1, 2, 3]); // 6
 * sum([{ a: { b: 1 } }, { a: { b: 2 } }], { keyPath: "a.b" }); // 3
 */
export const sum = (array, config = C.SUM_CONFIG) => {
  let configuredArray = U.configurator(array, config);
  let res;
  try {
    let sum;
    if (!config.keyPath) {
      sum = configuredArray.reduce((p, i) => p + i, 0);
    } else {
      // Извлекаем значение по пути config.keyPath и приводим к числу.
      // Если значение не является числом — трактуем его как 0.
      sum = configuredArray.reduce((sum, obj) => {
        const value = config.keyPath
          .split(".")
          .reduce((o, k) => o?.[k], obj);
        return sum + (Number(value) || 0);
      }, 0);
    }
    res = sum;
  } catch (e) {
    res = e;
  }
  return res;
};

/**
 * Находит совпадающие элементы между двумя массивами.
 *
 * Поддерживает сравнение:
 *  - примитивов и null/undefined — по строгому равенству;
 *  - Date — по валидности обеих дат;
 *  - RegExp — по source и flags;
 *  - функций — по ссылке;
 *  - объектов — по набору ключей (config.keys) с возможностью
 *    предварительного преобразования через config.fec / config.sec.
 *
 * @param {Array} array1 - Первый массив.
 * @param {Array} array2 - Второй массив.
 * @param {Object} [config=C.REPEATER_CONFIG] - Конфигурация сравнения объектов.
 * @param {string[]|"*"} [config.keys] - Ключи для сравнения объектов.
 *   Если "*" — берутся все ключи первого объекта.
 * @param {Function} [config.fec] - Преобразователь элемента первого массива.
 * @param {Function} [config.sec] - Преобразователь элемента второго массива.
 * @returns {Array<{element: *, indexInFirstArray: number, indexInSecondArray: number}>}
 *   Массив совпадений: значение из второго массива и индексы в обоих массивах.
 *
 * @example
 * repeater([1, 2, 3], [2, 4]);
 * // [{ element: 2, indexInFirstArray: 1, indexInSecondArray: 0 }]
 *
 * repeater(
 *   [{ id: 1 }, { id: 2 }],
 *   [{ id: 2 }, { id: 3 }],
 *   { keys: ["id"] }
 * );
 * // [{ element: { id: 2 }, indexInFirstArray: 1, indexInSecondArray: 0 }]
 */
export const repeater = (array1, array2, config = C.REPEATER_CONFIG) => {
  const duplicatesArray = [];

  /**
   * Добавляет найденное совпадение в результирующий массив.
   *
   * @param {*} e - Значение из второго массива (для объектов — копия).
   * @param {number} i1 - Индекс в первом массиве.
   * @param {number} i2 - Индекс во втором массиве.
   */
  const add = (e, i1, i2) => {
    duplicatesArray.push({
      element: e,
      indexInFirstArray: i1,
      indexInSecondArray: i2,
    });
  };

  array1.forEach((i, index) => {
    const primitive = ["string", "boolean", "number"].includes(typeof i);
    const zero = i === null || i === undefined;

    array2.forEach((j, ind) => {
      if ((primitive || zero) && i === j) {
        add(j, index, ind);
      } else if (
        i instanceof Date &&
        j instanceof Date &&
        Date.parse(i) &&
        Date.parse(j)
      ) {
        add(new Date(j), index, ind);
      } else if (
        i instanceof RegExp &&
        j instanceof RegExp &&
        i.source === j.source &&
        i.flags === j.flags
      ) {
        add(new RegExp(j), index, ind);
      } else if (
        typeof i === "function" &&
        typeof j === "function" &&
        i === j
      ) {
        add(j, index, ind);
      } else if (typeof i === "object" && typeof j === "object" && config) {
        const comparedObj1 = config.fec ? config.fec(i) : i;
        const comparedObj2 = config.sec ? config.sec(j) : j;

        if (config.keys) {
          const keys =
            typeof config.keys === "string" && config.keys === "*"
              ? Object.keys(comparedObj1)
              : config.keys;

          if (keys.every((k) => comparedObj1[k] === comparedObj2[k])) {
            add(Object.assign({}, j), index, ind);
          }
        }
      }
    });
  });

  return duplicatesArray;
};

/**
 * Сортирует массив по дате, извлечённой из вложенного свойства по пути.
 *
 * Сортировка выполняется «на месте» (мутирует исходный массив).
 *
 * @param {Array} array - Исходный массив объектов.
 * @param {string} path - Путь к дате внутри объекта, например "meta.createdAt".
 * @param {boolean} reverse - Если true — сортировка по убыванию.
 * @returns {Array} Тот же массив, отсортированный по указанной дате.
 *
 * @example
 * sortDeepDates(
 *   [{ d: "2023-01-01" }, { d: "2022-01-01" }],
 *   "d"
 * ); // [{ d: "2022-01-01" }, { d: "2023-01-01" }]
 */
export const sortDeepDates = (array, path, reverse) => {
  return array.sort((a, b) => {
    const aValue = path.split(".").reduce((o, k) => o?.[k], a);
    const bValue = path.split(".").reduce((o, k) => o?.[k], b);

    const aTime = Date.parse(aValue);
    const bTime = Date.parse(bValue);

    if (aTime > bTime) {
      return reverse ? -1 : 1;
    } else if (aTime < bTime) {
      return reverse ? 1 : -1;
    } else {
      return 0;
    }
  });
};

/**
 * Подсчитывает частоту встречаемости элементов массива.
 *
 * @param {Array} array - Исходный массив.
 * @param {Object} [config=C.COUNTER_CONFIG] - Конфигурация для U.configurator.
 * @returns {Object} Объект-счётчик вида { <значение>: <количество> }.
 *
 * @example
 * countObject(["a", "b", "a", "a"]); // { a: 3, b: 1 }
 */
export const countObject = (array, config = C.COUNTER_CONFIG) => {
  let configuredArray = U.configurator(array, config);

  return configuredArray.reduce((p, i) => {
    p[i] = (p[i] || 0) + 1;
    return p;
  }, {});
};
