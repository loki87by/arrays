import * as C from "./src/consts.js";
import * as U from "./src/utils.js";

export const sum = (array, config = C.SUM_CONFIG) => {
  let configuredArray = U.configurator(array, config);
  let res;
  try {
    let sum;
    if (!config.keyPath) {
      sum = configuredArray.reduce((p, i) => p + i, 0);
    } else {
      sum = configuredArray.reduce((sum, obj) => {
        const value = keyPath.split(".").reduce((o, k) => o?.[k], obj);
        return sum + (Number(value) || 0);
      }, 0);
    }
    res = sum;
  } catch (e) {
    res = e;
  }
  return res;
};

export const repeater = (array1, array2, config = C.REPEATER_CONFIG) => {
  const duplicatesArray = [];
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
        Date.parse(new Date(i)) &&
        Date.parse(new Date(j))
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
};
