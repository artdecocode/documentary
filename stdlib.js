#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');             
const {createWriteStream:q} = fs;
const r = (b, a = 0, c = !1) => {
  if (0 === a && !c) {
    return b;
  }
  b = b.split("\n", c ? a + 1 : void 0);
  return c ? b[b.length - 1] : b.slice(a).join("\n");
}, t = (b, a = !1) => r(b, 2 + (a ? 1 : 0)), u = b => {
  ({callee:{caller:b}} = b);
  return b;
};
const {homedir:v} = os;
const w = /\s+at.*(?:\(|\s)(.*)\)?/, x = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, y = v(), z = b => {
  const {pretty:a = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(x.source.replace("IGNORED_MODULES", c.join("|")));
  return b.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(w);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => a ? d.replace(w, (l, g) => l.replace(g, g.replace(y, "~"))) : d).join("\n");
};
function A(b, a, c = !1) {
  return function(e) {
    var d = u(arguments), {stack:l} = Error();
    const g = r(l, 2, !0), h = (l = e instanceof Error) ? e.message : e;
    d = [`Error: ${h}`, ...null !== d && b === d || c ? [a] : [g, a]].join("\n");
    d = z(d);
    return Object.assign(l ? e : Error(), {message:h, stack:d});
  };
}
;function B(b) {
  var {stack:a} = Error();
  const c = u(arguments);
  a = t(a, b);
  return A(c, a, b);
}
;const C = (b, a, c, e = !1, d = !1) => {
  const l = c ? new RegExp(`^-(${c}|-${a})`) : new RegExp(`^--${a}`);
  a = b.findIndex(g => l.test(g));
  if (-1 == a) {
    return {argv:b};
  }
  if (e) {
    return {value:!0, argv:[...b.slice(0, a), ...b.slice(a + 1)]};
  }
  e = a + 1;
  c = b[e];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:b};
  }
  d && (c = parseInt(c, 10));
  return {value:c, argv:[...b.slice(0, a), ...b.slice(e + 1)]};
}, D = b => {
  const a = [];
  for (let c = 0; c < b.length; c++) {
    const e = b[c];
    if (e.startsWith("-")) {
      break;
    }
    a.push(e);
  }
  return a;
};
const {Writable:E} = stream;
const F = (b, a) => {
  a.once("error", c => {
    b.emit("error", c);
  });
  return a;
};
class G extends E {
  constructor(b) {
    const {binary:a = !1, rs:c = null, ...e} = b || {}, {m:d = B(!0), proxyError:l} = b || {}, g = (h, f) => d(f);
    super(e);
    this.j = [];
    this.l = new Promise((h, f) => {
      this.on("finish", () => {
        let k;
        a ? k = Buffer.concat(this.j) : k = this.j.join("");
        h(k);
        this.j = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          g`${k}`;
        } else {
          const m = z(k.stack);
          k.stack = m;
          l && g`${k}`;
        }
        f(k);
      });
      c && F(this, c).pipe(this);
    });
  }
  _write(b, a, c) {
    this.j.push(b);
    c();
  }
  get o() {
    return this.l;
  }
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function H(b, a, c) {
  let e = b[b.length - 1];
  e && e.f === a && e.i === c ? b[b.length - 1] = {count:e.count + 1, f:a, i:c} : b.push({count:1, f:a, i:c});
}
function I(b, a, c, e, d) {
  let l = c.length, g = e.length, h = a.a;
  d = h - d;
  let f = 0;
  for (; h + 1 < l && d + 1 < g && b.equals(c[h + 1], e[d + 1]);) {
    h++, d++, f++;
  }
  f && a.g.push({count:f});
  a.a = h;
  return d;
}
function J(b) {
  let a = [];
  for (let c = 0; c < b.length; c++) {
    b[c] && a.push(b[c]);
  }
  return a;
}
function K(b, a) {
  var c = new L;
  b = J(b.split(""));
  a = J(a.split(""));
  let e = a.length, d = b.length, l = 1, g = e + d, h = [{a:-1, g:[]}];
  var f = I(c, h[0], a, b, 0);
  if (h[0].a + 1 >= e && f + 1 >= d) {
    return [{value:c.join(a), count:a.length}];
  }
  for (; l <= g;) {
    a: {
      for (f = -1 * l; f <= l; f += 2) {
        var k = h[f - 1];
        let n = h[f + 1];
        var m = (n ? n.a : 0) - f;
        k && (h[f - 1] = void 0);
        let p = k && k.a + 1 < e;
        m = n && 0 <= m && m < d;
        if (p || m) {
          !p || m && k.a < n.a ? (k = {a:n.a, g:n.g.slice(0)}, H(k.g, void 0, !0)) : (k.a++, H(k.g, !0, void 0));
          m = I(c, k, a, b, f);
          if (k.a + 1 >= e && m + 1 >= d) {
            f = M(c, k.g, a, b);
            break a;
          }
          h[f] = k;
        } else {
          h[f] = void 0;
        }
      }
      l++;
      f = void 0;
    }
    if (f) {
      return f;
    }
  }
}
class L {
  equals(b, a) {
    return b === a;
  }
  join(b) {
    return b.join("");
  }
}
function M(b, a, c, e) {
  let d = 0, l = a.length, g = 0, h = 0;
  for (; d < l; d++) {
    var f = a[d];
    if (f.i) {
      f.value = b.join(e.slice(h, h + f.count)), h += f.count, d && a[d - 1].f && (f = a[d - 1], a[d - 1] = a[d], a[d] = f);
    } else {
      if (f.f) {
        f.value = b.join(c.slice(g, g + f.count));
      } else {
        let k = c.slice(g, g + f.count);
        k = k.map(function(m, n) {
          n = e[h + n];
          return n.length > m.length ? n : m;
        });
        f.value = b.join(k);
      }
      g += f.count;
      f.f || (h += f.count);
    }
  }
  c = a[l - 1];
  1 < l && "string" === typeof c.value && (c.f || c.i) && b.equals("", c.value) && (a[l - 2].value += c.value, a.pop());
  return a;
}
;const N = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, O = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function P(b, a) {
  return (a = N[a]) ? `\x1b[${a}m${b}\x1b[0m` : b;
}
function Q(b, a) {
  return (a = O[a]) ? `\x1b[${a}m${b}\x1b[0m` : b;
}
;function R(b, a) {
  if (a > b - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
;module.exports = {c:P, b:Q, reduceUsage:b => Object.keys(b).reduce((a, c) => {
  const e = b[c];
  if ("string" == typeof e) {
    return a[`-${e}`] = "", a;
  }
  c = e.command ? c : `--${c}`;
  e.short && (c = `${c}, -${e.short}`);
  let d = e.description;
  e.default && (d = `${d}\nDefault: ${e.default}.`);
  a[c] = d;
  return a;
}, {}), write:async function(b, a) {
  if (!b) {
    throw Error("No path is given.");
  }
  const c = B(!0), e = q(b);
  await new Promise((d, l) => {
    e.on("error", g => {
      g = c(g);
      l(g);
    }).on("close", d).end(a);
  });
}, argufy:function(b = {}, a = process.argv) {
  [, , ...a] = a;
  const c = D(a);
  a = a.slice(c.length);
  let e = !c.length;
  return Object.keys(b).reduce(({h:d, ...l}, g) => {
    if (0 == d.length && e) {
      return {h:d, ...l};
    }
    const h = b[g];
    let f;
    if ("string" == typeof h) {
      ({value:f, argv:d} = C(d, g, h));
    } else {
      try {
        const {short:k, boolean:m, number:n, command:p, multiple:S} = h;
        p && S && c.length ? (f = c, e = !0) : p && c.length ? (f = c[0], e = !0) : {value:f, argv:d} = C(d, g, k, m, n);
      } catch (k) {
        return {h:d, ...l};
      }
    }
    return void 0 === f ? {h:d, ...l} : {h:d, ...l, [g]:f};
  }, {h:a});
}, Catchment:G, collect:async(b, a = {}) => {
  ({o:b} = new G({rs:b, ...a, m:B(!0)}));
  return await b;
}, clearr:b => b.split("\n").map(a => {
  a = a.split("\r");
  return a.reduce((c, e, d) => {
    if (!d) {
      return c;
    }
    ({length:d} = e);
    c = c.slice(d);
    return `${e}${c}`;
  }, a[0]);
}).join("\n"), erte:function(b, a) {
  return K(b, a).map(({f:c, i:e, value:d}) => {
    const l = d.split(" ");
    return c ? l.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => P(g, "green")).join(Q(" ", "green")) : e ? l.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => P(g, "red")).join(Q(" ", "red")) : P(d, "grey");
  }).join("");
}, forkfeed:(b, a, c = [], e = null) => {
  if (e) {
    b.on("data", h => e.write(h));
  }
  let [d, ...l] = c;
  if (d) {
    var g = h => {
      const [f, k] = d;
      f.test(h) && (h = `${k}\n`, e && e.write(h), a.write(h), [d, ...l] = l, d || b.removeListener("data", g));
    };
    b.on("data", g);
  }
}, makepromise:async function(b, a, c) {
  const e = B(!0);
  if ("function" !== typeof b) {
    throw Error("Function must be passed.");
  }
  const {length:d} = b;
  if (!d) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((l, g) => {
    const h = (k, m) => k ? (k = e(k), g(k)) : l(c || m);
    let f = [h];
    Array.isArray(a) ? (a.forEach((k, m) => {
      R(d, m);
    }), f = [...a, h]) : 1 < Array.from(arguments).length && (R(d, 0), f = [a, h]);
    b(...f);
  });
}, mismatch:function(b, a, c, e = !1) {
  const d = [];
  a.replace(b, (l, ...g) => {
    l = g[g.length - 2];
    l = e ? {position:l} : {};
    g = g.slice(0, g.length - 2).reduce((h, f, k) => {
      k = c[k];
      if (!k || void 0 === f) {
        return h;
      }
      h[k] = f;
      return h;
    }, l);
    d.push(g);
  });
  return d;
}};


//# sourceMappingURL=stdlib.js.map