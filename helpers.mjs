function field(name, value) {
  return [name, value];
}

function grouping(...args) {
  return [...args];
}

function deepReturn(arr) {
  let str = "";
  const pl = arr.length;
  for (let a = 0; a < pl; a++) {
    const param = arr[a];
    if (Array.isArray(param)) {
      str += `${param[0]} { `;
      str += deepReturn(param[1]);
      str += " }, ";
    } else {
      str += `${param}, `;
    }
  }
  str = str.slice(0, -2);
  return str;
}

function deepParams(arr) {
  console.log(arr);
  let str = "";
  const pl = arr.length;
  for (let a = 0; a < pl; a++) {
    const param = arr[a];
    const name = param[0];
    const value = param[1];
    str += `${name}: `;
    if (Array.isArray(value)) {
      str += `{ ${deepParams(value)} }, `;
    } else {
      if (typeof value === "number") {
        str += ` ${value}, `;
      } else {
        str += ` "${value}", `;
      }
    }
  }
  str = str.slice(0, -2);
  return str;
}

function transform(q) {
  const type = q.type;
  const call = q.call;

  if (type !== "query" && type !== "mutation") {
    throw new Error('Query must have a type, be "query" or be "mutation"');
  }

  if (Object.prototype.toString.call(call) !== "[object Object]") {
    throw new Error(
      "Calling object is not a object, try calling `.call()` first"
    );
  }

  const callName = call.name;

  if (typeof callName !== "string" || callName.length === 0) {
    throw new Error("Query must call a method");
  }

  const callParams = call.params;
  const callReturn = call.get;

  let transformed = `${type} { ${callName} ( `;
  if (typeof callParams !== "undefined") {
    if (callParams) transformed += deepParams(callParams);
  }

  if (typeof callReturn !== "undefined") {
    transformed += ` ) { ${deepReturn(callReturn)} } }`;
  }

  return transformed;
}

export { transform, grouping, field };
