const Query = new Proxy(
  {},
  {
    get(target, name) {
      return `Workaround of ${name}`;
    },
  }
);

export default Query;
