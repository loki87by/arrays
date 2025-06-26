export const BASE_CONFIG = {
  skipUndefined: false,
  skipNull: false,
  skipNaN: false,
  skipInfinity: false,
  booleanToNumber: false,
  stringToNumber: false,
  dateToNumber: null, // or object
  /* {
  pre, // object Setter
        y, //year
        yp, //year + iterator
        m, //month
        mp, //month + iterator
        d, //date
        dp, //date + iterator
        c, //calendarDay
        cp, //calendarDay + iterator
        h, //hours,
        hp, //hours, + iterator
        mi, //minutes,
        mip, //minutes,+ iterator
        s, //seconds,
        sp, //seconds,+ iterator
        ms, //milliseconds,
        msp, //milliseconds,+ iterator
        ds, //toDateString
        iso, //toISOString
        js, //toJSON
        lds, //toLocaleDateString
        ls, //toLocaleString
        lts, //toLocaleTimeString
        ts, //toString
        tts, //toTimeString
        utc, //toUTCString

    p, //parse
    y, //year
    f, //fullYear
    m, //month
    d, //date
    c, //calendarDay
    h, //hours,
    mi, //minutes,
    s, //seconds,
    ms, //milliseconds,
    reg, //+replace(/\D/, '') || callback
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
