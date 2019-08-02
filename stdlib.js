#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const child_process = require('child_process');             
const {createReadStream:r, createWriteStream:t, lstat:u} = fs;
const w = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, x = (a, b = !1) => w(a, 2 + (b ? 1 : 0)), y = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:z} = os;
const A = /\s+at.*(?:\(|\s)(.*)\)?/, B = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, C = z(), D = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(B.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(A);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(A, (k, h) => k.replace(h, h.replace(C, "~"))) : f).join("\n");
};
function E(a, b, c = !1) {
  return function(d) {
    var e = y(arguments), {stack:f} = Error();
    const k = w(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [k, b]].join("\n");
    e = D(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function F(a) {
  var {stack:b} = Error();
  const c = y(arguments);
  b = x(b, a);
  return E(c, b, a);
}
;var aa = stream;
const {Transform:ba, Writable:ca} = stream;
const da = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class G extends ca {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {s:e = F(!0), proxyError:f} = a || {}, k = (h, l) => e(l);
    super(d);
    this.g = [];
    this.o = new Promise((h, l) => {
      this.on("finish", () => {
        let g;
        b ? g = Buffer.concat(this.g) : g = this.g.join("");
        h(g);
        this.g = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          k`${g}`;
        } else {
          const m = D(g.stack);
          g.stack = m;
          f && k`${g}`;
        }
        l(g);
      });
      c && da(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get promise() {
    return this.o;
  }
}
const H = async(a, b = {}) => {
  ({promise:a} = new G({rs:a, ...b, s:F(!0)}));
  return await a;
};
function I(a, b, c, d = !1) {
  const e = [];
  b.replace(a, (f, ...k) => {
    f = k[k.length - 2];
    f = d ? {position:f} : {};
    k = k.slice(0, k.length - 2).reduce((h, l, g) => {
      g = c[g];
      if (!g || void 0 === l) {
        return h;
      }
      h[g] = l;
      return h;
    }, f);
    e.push(k);
  });
  return e;
}
;const J = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), ea = new RegExp(`\\s*((?:${J.source}\\s*)*)`);
const fa = a => I(J, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const K = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(k => f.test(k));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  d = b + 1;
  c = a[d];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  e && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(d + 1)]};
}, ha = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function L(a, b, c) {
  let d = a[a.length - 1];
  d && d.i === b && d.m === c ? a[a.length - 1] = {count:d.count + 1, i:b, m:c} : a.push({count:1, i:b, m:c});
}
function M(a, b, c, d, e) {
  let f = c.length, k = d.length, h = b.f;
  e = h - e;
  let l = 0;
  for (; h + 1 < f && e + 1 < k && a.equals(c[h + 1], d[e + 1]);) {
    h++, e++, l++;
  }
  l && b.j.push({count:l});
  b.f = h;
  return e;
}
function N(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function ia(a, b) {
  var c = new ja;
  a = N(a.split(""));
  b = N(b.split(""));
  let d = b.length, e = a.length, f = 1, k = d + e, h = [{f:-1, j:[]}];
  var l = M(c, h[0], b, a, 0);
  if (h[0].f + 1 >= d && l + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; f <= k;) {
    a: {
      for (l = -1 * f; l <= f; l += 2) {
        var g = h[l - 1];
        let n = h[l + 1];
        var m = (n ? n.f : 0) - l;
        g && (h[l - 1] = void 0);
        let p = g && g.f + 1 < d;
        m = n && 0 <= m && m < e;
        if (p || m) {
          !p || m && g.f < n.f ? (g = {f:n.f, j:n.j.slice(0)}, L(g.j, void 0, !0)) : (g.f++, L(g.j, !0, void 0));
          m = M(c, g, b, a, l);
          if (g.f + 1 >= d && m + 1 >= e) {
            l = ka(c, g.j, b, a);
            break a;
          }
          h[l] = g;
        } else {
          h[l] = void 0;
        }
      }
      f++;
      l = void 0;
    }
    if (l) {
      return l;
    }
  }
}
class ja {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function ka(a, b, c, d) {
  let e = 0, f = b.length, k = 0, h = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.m) {
      l.value = a.join(d.slice(h, h + l.count)), h += l.count, e && b[e - 1].i && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.i) {
        l.value = a.join(c.slice(k, k + l.count));
      } else {
        let g = c.slice(k, k + l.count);
        g = g.map(function(m, n) {
          n = d[h + n];
          return n.length > m.length ? n : m;
        });
        l.value = a.join(g);
      }
      k += l.count;
      l.i || (h += l.count);
    }
  }
  c = b[f - 1];
  1 < f && "string" === typeof c.value && (c.i || c.m) && a.equals("", c.value) && (b[f - 2].value += c.value, b.pop());
  return b;
}
;const la = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ma = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function O(a, b) {
  return (b = la[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function P(a, b) {
  return (b = ma[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;function Q(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function R(a, b, c) {
  const d = F(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, k) => {
    const h = (g, m) => g ? (g = d(g), k(g)) : f(c || m);
    let l = [h];
    Array.isArray(b) ? (b.forEach((g, m) => {
      Q(e, m);
    }), l = [...b, h]) : 1 < Array.from(arguments).length && (Q(e, 0), l = [b, h]);
    a(...l);
  });
}
;const S = async a => {
  try {
    return await R(u, a);
  } catch (b) {
    return null;
  }
};
const {dirname:na, join:T, relative:oa} = path;
const U = async a => {
  a = `${a}.js`;
  let b = await S(a);
  b || (a = `${a}x`);
  if (b = await S(a)) {
    return a;
  }
};
const {fork:pa, spawn:qa} = child_process;
const V = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", k => {
      e(k);
    });
  }), a.stdout ? H(a.stdout) : void 0, a.stderr ? H(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
function W(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const X = (a, b) => {
  if (!(b instanceof Error)) {
    throw b;
  }
  [, , a] = a.stack.split("\n", 3);
  a = b.stack.indexOf(a);
  if (-1 == a) {
    throw b;
  }
  a = b.stack.substr(0, a - 1);
  const c = a.lastIndexOf("\n");
  b.stack = a.substr(0, c);
  throw b;
};
function Y(a, b) {
  function c() {
    return b.filter(W).reduce((d, {re:e, replacement:f}) => {
      if (this.h) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let k;
        return d.replace(e, (h, ...l) => {
          k = Error();
          try {
            return this.h ? h : f.call(this, h, ...l);
          } catch (g) {
            X(k, g);
          }
        });
      }
    }, `${a}`);
  }
  c.g = () => {
    c.h = !0;
  };
  return c.call(c);
}
;const ra = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), sa = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function ta(a, b) {
  b instanceof aa ? b.pipe(a) : a.end(b);
  return await H(a);
}
class Z extends ba {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(W);
    this.h = !1;
    this.u = b;
  }
  async replace(a, b) {
    const c = new Z(this.g, this.u);
    b && Object.assign(c, b);
    a = await ta(c, a);
    c.h && (this.h = !0);
    b && Object.keys(b).forEach(d => {
      b[d] = c[d];
    });
    return a;
  }
  async reduce(a) {
    return await this.g.reduce(async(b, {re:c, replacement:d}) => {
      b = await b;
      if (this.h) {
        return b;
      }
      if ("string" == typeof d) {
        b = b.replace(c, d);
      } else {
        const e = [];
        let f;
        const k = b.replace(c, (h, ...l) => {
          f = Error();
          try {
            if (this.h) {
              return e.length ? e.push(Promise.resolve(h)) : h;
            }
            const g = d.call(this, h, ...l);
            g instanceof Promise && e.push(g);
            return g;
          } catch (g) {
            X(f, g);
          }
        });
        if (e.length) {
          try {
            const h = await Promise.all(e);
            b = b.replace(c, () => h.shift());
          } catch (h) {
            X(f, h);
          }
        } else {
          b = k;
        }
      }
      return b;
    }, `${a}`);
  }
  async _transform(a, b, c) {
    try {
      const d = await this.reduce(a);
      this.push(d);
      c();
    } catch (d) {
      a = D(d.stack), d.stack = a, c(d);
    }
  }
}
;module.exports = {c:O, b:P, read:async function(a) {
  a = r(a);
  return await H(a);
}, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [k] = a.reduce(([g = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((q, v) => v.length > q ? v.length : q, 0);
    p > m && (m = p);
    n.length > g && (g = n.length);
    return [g, m];
  }, []), h = (g, m) => {
    m = " ".repeat(m - g.length);
    return `${g}${m}`;
  };
  a = a.reduce((g, m, n) => {
    n = f[n].split("\n");
    m = h(m, k);
    const [p, ...q] = n;
    m = `${m}\t${p}`;
    const v = h("", k);
    n = q.map(ua => `${v}\t${ua}`);
    return [...g, m, ...n];
  }, []).map(g => `\t${g}`);
  const l = [c, `  ${d || ""}`].filter(g => g ? g.trim() : g).join("\n\n");
  a = `${l ? `${l}\n` : ""}
${a.join("\n")}
`;
  return e ? `${a}
  Example:

    ${e}
` : a;
}, spawn:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a command to spawn.");
  }
  a = qa(a, b, c);
  b = V(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = pa(a, b, c);
  b = V(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:Y, Replaceable:Z, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = sa, getRegex:k = ra} = b || {}, h = k(d);
    e = {name:d, re:e, regExp:h, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...c, [d]:e};
}, {}), makeCutRule:a => {
  const {re:b, map:c, getReplacement:d, name:e} = a;
  return {re:b, replacement(f) {
    const {lastIndex:k} = a;
    c[k] = f;
    a.lastIndex += 1;
    return d(e, k);
  }};
}, makePasteRule:(a, b = []) => {
  const {regExp:c, map:d} = a;
  return {re:c, replacement(e, f) {
    e = d[f];
    delete d[f];
    return Y(e, Array.isArray(b) ? b : [b]);
  }};
}, resolveDependency:async(a, b) => {
  b && (b = na(b), a = T(b, a));
  var c = await S(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await U(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await U(a), c = !0);
      if (!e) {
        b = await U(T(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? oa("", b) : b, v:d};
}, rexml:(a, b) => I(new RegExp(`<${a}${ea.source}?(?:${/\s*\/>/.source}|${(new RegExp(`>([\\s\\S]+?)?</${a}>`)).source})`, "g"), b, ["a", "v", "v1", "v2", "c"]).map(({a:c = "", c:d = ""}) => {
  c = c.replace(/\/$/, "").trim();
  c = fa(c);
  return {content:d, props:c};
}), reduceUsage:a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if ("string" == typeof d) {
    return b[`-${d}`] = "", b;
  }
  c = d.command ? c : `--${c}`;
  d.short && (c = `${c}, -${d.short}`);
  let e = d.description;
  d.default && (e = `${e}\nDefault: ${d.default}.`);
  b[c] = e;
  return b;
}, {}), write:async function(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = F(!0), d = t(a);
  await new Promise((e, f) => {
    d.on("error", k => {
      k = c(k);
      f(k);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = ha(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({l:e, ...f}, k) => {
    if (0 == e.length && d) {
      return {l:e, ...f};
    }
    const h = a[k];
    let l;
    if ("string" == typeof h) {
      ({value:l, argv:e} = K(e, k, h));
    } else {
      try {
        const {short:g, boolean:m, number:n, command:p, multiple:q} = h;
        p && q && c.length ? (l = c, d = !0) : p && c.length ? (l = c[0], d = !0) : {value:l, argv:e} = K(e, k, g, m, n);
      } catch (g) {
        return {l:e, ...f};
      }
    }
    return void 0 === l ? {l:e, ...f} : {l:e, ...f, [k]:l};
  }, {l:b});
}, Catchment:G, collect:H, clearr:a => a.split("\n").map(b => {
  b = b.split("\r");
  return b.reduce((c, d, e) => {
    if (!e) {
      return c;
    }
    ({length:e} = d);
    c = c.slice(e);
    return `${d}${c}`;
  }, b[0]);
}).join("\n"), erte:function(a, b) {
  return ia(a, b).map(({i:c, m:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(k => k.replace(/\n$/mg, "\u23ce\n")).map(k => O(k, "green")).join(P(" ", "green")) : d ? f.map(k => k.replace(/\n$/mg, "\u23ce\n")).map(k => O(k, "red")).join(P(" ", "red")) : O(e, "grey");
  }).join("");
}, forkfeed:(a, b, c = [], d = null) => {
  if (d) {
    a.on("data", h => d.write(h));
  }
  let [e, ...f] = c;
  if (e) {
    var k = h => {
      const [l, g] = e;
      l.test(h) && (h = `${g}\n`, d && d.write(h), b.write(h), [e, ...f] = f, e || a.removeListener("data", k));
    };
    a.on("data", k);
  }
}, makepromise:R, mismatch:I};


//# sourceMappingURL=stdlib.js.map