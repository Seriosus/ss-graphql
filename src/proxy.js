function createProxy(o, h) {
  return new Proxy(o, h);
}

const handlerAfterCall = {
  get(target, prop, receiver) {
    if (typeof target[prop] === 'undefined') {
      if (prop.toLowerCase() === 'call') {
        throw new Error('Cannot call more than once');
      }

      if (prop.toLowerCase() === 'get') {
        return function (params) {
          target[prop] = params;
        }
      } else {
        throw new Error('Invalid invoke');
      }
    }
    return target[prop];
  }
}

const handler = {
  get(target, prop, receiver) {
    if (typeof target[prop] === 'undefined') {
      if (prop.toLowerCase() === 'another') {
        return function () {
          return createProxy({type: target.type}, handler);
        }
      } else if (prop.toLowerCase() === 'call') {
        return function (type, params) {
          target[prop] = createProxy({
            name: type,
            params,
          }, handlerAfterCall);
          return target[prop];
        }
      } else {
        throw new Error('Call a type first');
      }
    }
    return target[prop];
  }
}

export { handler, createProxy };