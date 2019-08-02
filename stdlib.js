#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');             
const {createReadStream:q, createWriteStream:r} = fs;
const t = (b, a = 0, c = !1) => {
  if (0 === a && !c) {
    return b;
  }
  b = b.split("\n", c ? a + 1 : void 0);
  return c ? b[b.length - 1] : b.slice(a).join("\n");
}, u = (b, a = !1) => t(b, 2 + (a ? 1 : 0)), v = b => {
  ({callee:{caller:b}} = b);
  return b;
};
const {homedir:w} = os;
const x = /\s+at.*(?:\(|\s)(.*)\)?/, y = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, z = w(), A = b => {
  const {pretty:a = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(y.source.replace("IGNORED_MODULES", c.join("|")));
  return b.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(x);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => a ? d.replace(x, (l, g) => l.replace(g, g.replace(z, "~"))) : d).join("\n");
};
function B(b, a, c = !1) {
  return function(e) {
    var d = v(arguments), {stack:l} = Error();
    const g = t(l, 2, !0), h = (l = e instanceof Error) ? e.message : e;
    d = [`Error: ${h}`, ...null !== d && b === d || c ? [a] : [g, a]].join("\n");
    d = A(d);
    return Object.assign(l ? e : Error(), {message:h, stack:d});
  };
}
;function C(b) {
  var {stack:a} = Error();
  const c = v(arguments);
  a = u(a, b);
  return B(c, a, b);
}
;const {Writable:D} = stream;
const E = (b, a) => {
  a.once("error", c => {
    b.emit("error", c);
  });
  return a;
};
class F extends D {
  constructor(b) {
    const {binary:a = !1, rs:c = null, ...e} = b || {}, {o:d = C(!0), proxyError:l} = b || {}, g = (h, f) => d(f);
    super(e);
    this.l = [];
    this.m = new Promise((h, f) => {
      this.on("finish", () => {
        let k;
        a ? k = Buffer.concat(this.l) : k = this.l.join("");
        h(k);
        this.l = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          g`${k}`;
        } else {
          const m = A(k.stack);
          k.stack = m;
          l && g`${k}`;
        }
        f(k);
      });
      c && E(this, c).pipe(this);
    });
  }
  _write(b, a, c) {
    this.l.push(b);
    c();
  }
  get s() {
    return this.m;
  }
}
const G = async(b, a = {}) => {
  ({s:b} = new F({rs:b, ...a, o:C(!0)}));
  return await b;
};
function H(b, a, c, e = !1) {
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
}
;const I = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), J = new RegExp(`\\s*((?:${I.source}\\s*)*)`);
const K = b => H(I, b, ["key", "val", "def", "f"]).reduce((a, {key:c, val:e}) => {
  if (void 0 === e) {
    return a[c] = !0, a;
  }
  a[c] = "true" == e ? !0 : "false" == e ? !1 : /^\d+$/.test(e) ? parseInt(e, 10) : e;
  return a;
}, {});
const L = (b, a, c, e = !1, d = !1) => {
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
}, M = b => {
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
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function N(b, a, c) {
  let e = b[b.length - 1];
  e && e.g === a && e.j === c ? b[b.length - 1] = {count:e.count + 1, g:a, j:c} : b.push({count:1, g:a, j:c});
}
function O(b, a, c, e, d) {
  let l = c.length, g = e.length, h = a.f;
  d = h - d;
  let f = 0;
  for (; h + 1 < l && d + 1 < g && b.equals(c[h + 1], e[d + 1]);) {
    h++, d++, f++;
  }
  f && a.h.push({count:f});
  a.f = h;
  return d;
}
function P(b) {
  let a = [];
  for (let c = 0; c < b.length; c++) {
    b[c] && a.push(b[c]);
  }
  return a;
}
function Q(b, a) {
  var c = new R;
  b = P(b.split(""));
  a = P(a.split(""));
  let e = a.length, d = b.length, l = 1, g = e + d, h = [{f:-1, h:[]}];
  var f = O(c, h[0], a, b, 0);
  if (h[0].f + 1 >= e && f + 1 >= d) {
    return [{value:c.join(a), count:a.length}];
  }
  for (; l <= g;) {
    a: {
      for (f = -1 * l; f <= l; f += 2) {
        var k = h[f - 1];
        let n = h[f + 1];
        var m = (n ? n.f : 0) - f;
        k && (h[f - 1] = void 0);
        let p = k && k.f + 1 < e;
        m = n && 0 <= m && m < d;
        if (p || m) {
          !p || m && k.f < n.f ? (k = {f:n.f, h:n.h.slice(0)}, N(k.h, void 0, !0)) : (k.f++, N(k.h, !0, void 0));
          m = O(c, k, a, b, f);
          if (k.f + 1 >= e && m + 1 >= d) {
            f = S(c, k.h, a, b);
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
class R {
  equals(b, a) {
    return b === a;
  }
  join(b) {
    return b.join("");
  }
}
function S(b, a, c, e) {
  let d = 0, l = a.length, g = 0, h = 0;
  for (; d < l; d++) {
    var f = a[d];
    if (f.j) {
      f.value = b.join(e.slice(h, h + f.count)), h += f.count, d && a[d - 1].g && (f = a[d - 1], a[d - 1] = a[d], a[d] = f);
    } else {
      if (f.g) {
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
      f.g || (h += f.count);
    }
  }
  c = a[l - 1];
  1 < l && "string" === typeof c.value && (c.g || c.j) && b.equals("", c.value) && (a[l - 2].value += c.value, a.pop());
  return a;
}
;const T = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, U = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function V(b, a) {
  return (a = T[a]) ? `\x1b[${a}m${b}\x1b[0m` : b;
}
function W(b, a) {
  return (a = U[a]) ? `\x1b[${a}m${b}\x1b[0m` : b;
}
;function X(b, a) {
  if (a > b - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
;module.exports = {c:V, b:W, read:async function(b) {
  b = q(b);
  return await G(b);
}, rexml:(b, a) => H(new RegExp(`<${b}${J.source}?(?:${/\s*\/>/.source}|${(new RegExp(`>([\\s\\S]+?)?</${b}>`)).source})`, "g"), a, ["a", "v", "v1", "v2", "c"]).map(({a:c = "", c:e = ""}) => {
  c = c.replace(/\/$/, "").trim();
  c = K(c);
  return {content:e, u:c};
}), reduceUsage:b => Object.keys(b).reduce((a, c) => {
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
  const c = C(!0), e = r(b);
  await new Promise((d, l) => {
    e.on("error", g => {
      g = c(g);
      l(g);
    }).on("close", d).end(a);
  });
}, argufy:function(b = {}, a = process.argv) {
  [, , ...a] = a;
  const c = M(a);
  a = a.slice(c.length);
  let e = !c.length;
  return Object.keys(b).reduce(({i:d, ...l}, g) => {
    if (0 == d.length && e) {
      return {i:d, ...l};
    }
    const h = b[g];
    let f;
    if ("string" == typeof h) {
      ({value:f, argv:d} = L(d, g, h));
    } else {
      try {
        const {short:k, boolean:m, number:n, command:p, multiple:Y} = h;
        p && Y && c.length ? (f = c, e = !0) : p && c.length ? (f = c[0], e = !0) : {value:f, argv:d} = L(d, g, k, m, n);
      } catch (k) {
        return {i:d, ...l};
      }
    }
    return void 0 === f ? {i:d, ...l} : {i:d, ...l, [g]:f};
  }, {i:a});
}, Catchment:F, collect:G, clearr:b => b.split("\n").map(a => {
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
  return Q(b, a).map(({g:c, j:e, value:d}) => {
    const l = d.split(" ");
    return c ? l.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => V(g, "green")).join(W(" ", "green")) : e ? l.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => V(g, "red")).join(W(" ", "red")) : V(d, "grey");
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
  const e = C(!0);
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
      X(d, m);
    }), f = [...a, h]) : 1 < Array.from(arguments).length && (X(d, 0), f = [a, h]);
    b(...f);
  });
}, mismatch:H};


//# sourceMappingURL=stdlib.js.map