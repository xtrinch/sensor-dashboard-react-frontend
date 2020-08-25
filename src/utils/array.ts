export const uniq = (a: Array<any>) => {
  const prims = { boolean: {}, number: {}, string: {} };
  const objs = [];

  const retVal = a.filter((item) => {
    const type = typeof item;
    let arr;
    if (type in prims) {
      arr = Object.prototype.hasOwnProperty.call(prims[type], item)
        ? false
        : (prims[type][item] = true);
      return arr;
    }
    arr = objs.indexOf(item) >= 0 ? false : objs.push(item);
    return arr;
  });

  return retVal;
};
