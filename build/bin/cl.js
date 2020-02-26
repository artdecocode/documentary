#!/usr/bin/env node
'use strict';
const fs = require('fs');
const child_process = require('child_process');
const readline = require('readline');             
const m = fs.readFileSync, n = fs.writeFileSync;
const p = readline.createInterface;
function q(b, c, f) {
  return setTimeout(() => {
    const a = Error(`${b ? b : "Promise"} has timed out after ${c}ms`);
    a.stack = `Error: ${a.message}`;
    f(a);
  }, c);
}
function r(b, c) {
  let f;
  const a = new Promise((e, d) => {
    f = q(b, c, d);
  });
  return {timeout:f, a};
}
async function t(b, c, f) {
  if (!(b instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!c) {
    throw Error("Timeout must be a number");
  }
  if (0 > c) {
    throw Error("Timeout cannot be negative");
  }
  const {a, timeout:e} = r(f, c);
  try {
    return await Promise.race([b, a]);
  } finally {
    clearTimeout(e);
  }
}
;function u(b, c = {}) {
  const {timeout:f, password:a = !1, output:e = process.stdout, input:d = process.stdin, ...g} = c, h = p({input:d, output:e, ...g});
  if (a) {
    const k = h.output;
    h._writeToOutput = l => {
      if (["\r\n", "\n", "\r"].includes(l)) {
        return k.write(l);
      }
      l = l.split(b);
      "2" == l.length ? (k.write(b), k.write("*".repeat(l[1].length))) : k.write("*");
    };
  }
  c = new Promise(k => {
    h.question(b, k);
  });
  c = f ? t(c, f, `reloquent: ${b}`) : c;
  h.promise = v(c, h);
  return h;
}
const v = async(b, c) => {
  try {
    return await b;
  } finally {
    c.close();
  }
};
async function w(b) {
  if ("object" != typeof b) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(b).reduce(async(c, f) => {
    c = await c;
    var a = b[f];
    switch(typeof a) {
      case "object":
        a = {...a};
        break;
      case "string":
        a = {text:a};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    a.text = `${a.text}${a.text.endsWith("?") ? "" : ":"} `;
    var e;
    if (a.defaultValue) {
      var d = a.defaultValue;
    }
    a.getDefault && (e = await a.getDefault());
    let g = d || "";
    d && e && d != e ? g = `\x1b[90m${d}\x1b[0m` : d && d == e && (g = "");
    d = e || "";
    ({promise:d} = u(`${a.text}${g ? `[${g}] ` : ""}${d ? `[${d}] ` : ""}`, {timeout:void 0, password:a.password, ...a}));
    e = await d || e || a.defaultValue;
    "function" == typeof a.validation && a.validation(e);
    "function" == typeof a.postProcess && (e = await a.postProcess(e));
    return {...c, [f]:e};
  }, {});
}
;async function x(b) {
  ({question:b} = await w({question:b}));
  return b;
}
;const y = child_process.spawnSync;
(async() => {
  var b = m("package.json", "utf8");
  const {version:c, repository:f} = JSON.parse(b);
  ({url:b} = f);
  b = b.replace(/^git:\/\//, "https://").replace(/\.git$/, "");
  const a = await x(`What is the next version after ${c}?`), e = m("CHANGELOG.md", "utf8");
  var d = new Date;
  d = `## ${`${d.getDate()} ${d.toLocaleString("en-GB", {month:"long"})} ${d.getFullYear()}`}`;
  b = `${d}
### [${a}](${b}/compare/v${c}...v${a})
${e.startsWith(d) ? e.replace(`${d}\n\n`, "") : e}`;
  n("CHANGELOG.md", b);
  try {
    y("code", ["CHANGELOG.md"], {shell:"win32" == process.platform});
  } catch (g) {
  }
})();


//# sourceMappingURL=cl.js.map