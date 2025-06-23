export const BASE_CONFIG = {
  skipUndefined: false,
  skipNull: false,
  skipNaN: false,
  skipInfinity: false,
  booleanToNumber: false,
  stringToNumber: false,
  dateToNumber: null, // or object
  /* {
  pre, // one of date to string (toLocaleString, toISOString, etc...)
    p, //parse
    y, //year
    f, //fullYear
    m, //month
    w, //week
    d, //date
    c, //calendarDay
    r, //+replace(/\D/, '') || callback
  } */
  // ToDo: add handle date, regexp and other types
};

export const SUM_CONFIG = Object.assign({}, BASE_CONFIG, {
  callback: null
});

export const REPEATER_CONFIG = {
    fec: null,  //firstElementCallback
    sec: null,  //secondElementCallback
    keys: null, // accepted '*' or string[]
}

export const COUNTER_CONFIG = Object.assign({}, BASE_CONFIG, {
  allToTypes: false,
  callback: null
})
