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
