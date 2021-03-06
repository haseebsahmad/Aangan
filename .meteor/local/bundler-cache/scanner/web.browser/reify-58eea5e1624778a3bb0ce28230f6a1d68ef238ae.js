let useState,useEffect;module.link('react',{useState(v){useState=v},useEffect(v){useEffect=v}},0);

var arraysEqual = function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

var useDelayed = function useDelayed(value, delay, ignore) {
  var _useState = useState(function () {
    return value;
  }),
      state = _useState[0],
      setState = _useState[1];

  var _useState2 = useState(function () {
    return ignore || [];
  }),
      cachedIgnore = _useState2[0],
      setCachedIgnore = _useState2[1];

  useEffect(function () {
    if (!Array.isArray(ignore)) {
      if (Array.isArray(cachedIgnore)) setCachedIgnore([]);
      return;
    }

    if (!arraysEqual(ignore, cachedIgnore)) setCachedIgnore(ignore);
  }, [ignore]);
  useEffect(function () {
    if (Array.isArray(cachedIgnore) && cachedIgnore.indexOf(value) != -1) {
      setState(value);
      return;
    }

    var to = setTimeout(function () {
      setState(value);
    }, delay);
    return function () {
      return clearTimeout(to);
    };
  }, [value, delay, cachedIgnore]);
  return state;
};

module.exportDefault(useDelayed);
//# sourceMappingURL=use-delayed.esm.js.map
