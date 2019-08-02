#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const child_process = require('child_process');
const util = require('util');             
const {createReadStream:q, createWriteStream:r, lstat:v, mkdir:aa, readdir:ba, readlink:ca, symlink:da} = fs;
const w = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ea = (a, b = !1) => w(a, 2 + (b ? 1 : 0)), x = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:fa} = os;
const y = /\s+at.*(?:\(|\s)(.*)\)?/, ha = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ia = fa(), z = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ha.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(y);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(y, (g, k) => g.replace(k, k.replace(ia, "~"))) : f).join("\n");
};
function ja(a, b, c = !1) {
  return function(d) {
    var e = x(arguments), {stack:f} = Error();
    const g = w(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = z(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function A(a) {
  var {stack:b} = Error();
  const c = x(arguments);
  b = ea(b, a);
  return ja(c, b, a);
}
;var ka = stream;
const {PassThrough:la, Transform:ma, Writable:na} = stream;
const oa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class B extends na {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {u:e = A(!0), proxyError:f} = a || {}, g = (k, l) => e(l);
    super(d);
    this.g = [];
    this.s = new Promise((k, l) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.g) : h = this.g.join("");
        k(h);
        this.g = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          g`${h}`;
        } else {
          const m = z(h.stack);
          h.stack = m;
          f && g`${h}`;
        }
        l(h);
      });
      c && oa(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get promise() {
    return this.s;
  }
}
const C = async(a, b = {}) => {
  ({promise:a} = new B({rs:a, ...b, u:A(!0)}));
  return await a;
};
function D(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function E(a, b, c) {
  const d = A(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, g) => {
    const k = (h, m) => h ? (h = d(h), g(h)) : f(c || m);
    let l = [k];
    Array.isArray(b) ? (b.forEach((h, m) => {
      D(e, m);
    }), l = [...b, k]) : 1 < Array.from(arguments).length && (D(e, 0), l = [b, k]);
    a(...l);
  });
}
;const {basename:pa, dirname:F, join:G, relative:qa} = path;
async function H(a) {
  const b = F(a);
  try {
    return await I(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function I(a) {
  try {
    await E(aa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = F(a);
      await I(c);
      await I(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function ra(a, b) {
  b = b.map(async c => {
    const d = G(a, c);
    return {lstat:await E(v, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const sa = a => a.lstat.isDirectory(), ta = a => !a.lstat.isDirectory();
async function J(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await E(v, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await E(ba, a);
  b = await ra(a, b);
  a = b.filter(sa);
  b = b.filter(ta).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...c, [d.relativePath]:{type:e}};
  }, {});
  a = await a.reduce(async(c, {path:d, relativePath:e}) => {
    c = await c;
    d = await J(d);
    return {...c, [e]:d};
  }, {});
  return {content:{...b, ...a}, type:"Directory"};
}
;const K = async(a, b) => {
  const c = q(a), d = r(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, L = async(a, b) => {
  a = await E(ca, a);
  await E(da, [a, b]);
}, M = async(a, b) => {
  await H(G(b, "path.file"));
  const {content:c} = await J(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], g = G(a, e);
    e = G(b, e);
    "Directory" == f ? await M(g, e) : "File" == f ? await K(g, e) : "SymbolicLink" == f && await L(g, e);
  });
  await Promise.all(d);
};
function N(a, b, c, d = !1) {
  const e = [];
  b.replace(a, (f, ...g) => {
    f = g[g.length - 2];
    f = d ? {position:f} : {};
    g = g.slice(0, g.length - 2).reduce((k, l, h) => {
      h = c[h];
      if (!h || void 0 === l) {
        return k;
      }
      k[h] = l;
      return k;
    }, f);
    e.push(g);
  });
  return e;
}
;const O = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), ua = new RegExp(`\\s*((?:${O.source}\\s*)*)`);
const va = a => N(O, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const P = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(g => f.test(g));
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
}, wa = a => {
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
function Q(a, b, c) {
  let d = a[a.length - 1];
  d && d.i === b && d.m === c ? a[a.length - 1] = {count:d.count + 1, i:b, m:c} : a.push({count:1, i:b, m:c});
}
function R(a, b, c, d, e) {
  let f = c.length, g = d.length, k = b.f;
  e = k - e;
  let l = 0;
  for (; k + 1 < f && e + 1 < g && a.equals(c[k + 1], d[e + 1]);) {
    k++, e++, l++;
  }
  l && b.j.push({count:l});
  b.f = k;
  return e;
}
function S(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function xa(a, b) {
  var c = new ya;
  a = S(a.split(""));
  b = S(b.split(""));
  let d = b.length, e = a.length, f = 1, g = d + e, k = [{f:-1, j:[]}];
  var l = R(c, k[0], b, a, 0);
  if (k[0].f + 1 >= d && l + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; f <= g;) {
    a: {
      for (l = -1 * f; l <= f; l += 2) {
        var h = k[l - 1];
        let n = k[l + 1];
        var m = (n ? n.f : 0) - l;
        h && (k[l - 1] = void 0);
        let p = h && h.f + 1 < d;
        m = n && 0 <= m && m < e;
        if (p || m) {
          !p || m && h.f < n.f ? (h = {f:n.f, j:n.j.slice(0)}, Q(h.j, void 0, !0)) : (h.f++, Q(h.j, !0, void 0));
          m = R(c, h, b, a, l);
          if (h.f + 1 >= d && m + 1 >= e) {
            l = za(c, h.j, b, a);
            break a;
          }
          k[l] = h;
        } else {
          k[l] = void 0;
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
class ya {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function za(a, b, c, d) {
  let e = 0, f = b.length, g = 0, k = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.m) {
      l.value = a.join(d.slice(k, k + l.count)), k += l.count, e && b[e - 1].i && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.i) {
        l.value = a.join(c.slice(g, g + l.count));
      } else {
        let h = c.slice(g, g + l.count);
        h = h.map(function(m, n) {
          n = d[k + n];
          return n.length > m.length ? n : m;
        });
        l.value = a.join(h);
      }
      g += l.count;
      l.i || (k += l.count);
    }
  }
  c = b[f - 1];
  1 < f && "string" === typeof c.value && (c.i || c.m) && a.equals("", c.value) && (b[f - 2].value += c.value, b.pop());
  return b;
}
;const Aa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Ba = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function T(a, b) {
  return (b = Aa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function U(a, b) {
  return (b = Ba[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const V = async a => {
  try {
    return await E(v, a);
  } catch (b) {
    return null;
  }
};
const W = async a => {
  a = `${a}.js`;
  let b = await V(a);
  b || (a = `${a}x`);
  if (b = await V(a)) {
    return a;
  }
};
const {fork:Ca, spawn:Da} = child_process;
const X = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", g => {
      e(g);
    });
  }), a.stdout ? C(a.stdout) : void 0, a.stderr ? C(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
function Y(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const Z = (a, b) => {
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
function Ea(a, b) {
  function c() {
    return b.filter(Y).reduce((d, {re:e, replacement:f}) => {
      if (this.h) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let g;
        return d.replace(e, (k, ...l) => {
          g = Error();
          try {
            return this.h ? k : f.call(this, k, ...l);
          } catch (h) {
            Z(g, h);
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
;const Fa = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), Ga = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function Ha(a, b) {
  return Ia(a, b);
}
class Ja extends ma {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(Y);
    this.h = !1;
    this.v = b;
  }
  async replace(a, b) {
    const c = new Ja(this.g, this.v);
    b && Object.assign(c, b);
    a = await Ha(c, a);
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
        const g = b.replace(c, (k, ...l) => {
          f = Error();
          try {
            if (this.h) {
              return e.length ? e.push(Promise.resolve(k)) : k;
            }
            const h = d.call(this, k, ...l);
            h instanceof Promise && e.push(h);
            return h;
          } catch (h) {
            Z(f, h);
          }
        });
        if (e.length) {
          try {
            const k = await Promise.all(e);
            b = b.replace(c, () => k.shift());
          } catch (k) {
            Z(f, k);
          }
        } else {
          b = g;
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
      a = z(d.stack), d.stack = a, c(d);
    }
  }
}
async function Ia(a, b) {
  b instanceof ka ? b.pipe(a) : a.end(b);
  return await C(a);
}
;const {debuglog:Ka} = util;
const La = (a, b) => a.some(c => c == b), Ma = (a, b) => {
  const c = La(a, "index.md"), d = La(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, g) => {
    f = f.localeCompare(g, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const Na = Ka("pedantry"), Pa = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:g, ignoreHidden:k}) => {
  var l = Object.keys(d);
  l = await Ma(l, e).reduce(async(h, m) => {
    h = await h;
    const {type:n, content:p} = d[m], t = G(c, m);
    let u;
    "File" == n ? k && m.startsWith(".") || (u = await Oa({stream:a, source:b, path:t, separator:f, includeFilename:g})) : "Directory" == n && (u = await Pa({stream:a, source:b, path:t, content:p, reverse:e, separator:f, includeFilename:g, ignoreHidden:k}));
    return h + u;
  }, 0);
  Na("dir %s size: %s B", c, l);
  return l;
}, Oa = async a => {
  const {stream:b, source:c, path:d, separator:e, includeFilename:f} = a, g = G(c, d);
  b.emit("file", d);
  e && !b.o && (f ? b.push({file:"separator", data:e}) : b.push(e));
  a = await new Promise((k, l) => {
    let h = 0;
    const m = q(g);
    m.on("data", n => {
      h += n.byteLength;
    }).on("error", n => {
      l(n);
    }).on("close", () => {
      k(h);
    });
    if (f) {
      m.on("data", n => {
        b.push({file:g, data:`${n}`});
      });
    } else {
      m.pipe(b, {end:!1});
    }
  });
  b.o = !1;
  Na("file %s :: %s B", g, a);
  return a;
};
class Qa extends la {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:g = !1} = b;
    super({objectMode:f});
    let k;
    d ? k = "\n" : e && (k = "\n\n");
    this.o = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await J(a));
      } catch (h) {
        this.emit("error", Error(h.message));
      }
      try {
        await Pa({stream:this, source:a, content:l, reverse:c, separator:k, includeFilename:f, ignoreHidden:g});
      } catch (h) {
        this.emit("error", h);
      } finally {
        this.end();
      }
    })();
  }
}
;module.exports = {c:T, b:U, clone:async(a, b) => {
  const c = await E(v, a), d = pa(a);
  b = G(b, d);
  c.isDirectory() ? await M(a, b) : c.isSymbolicLink() ? await L(a, b) : (await H(b), await K(a, b));
}, Pedantry:Qa, ensurePath:H, read:async function(a) {
  a = q(a);
  return await C(a);
}, replace:Ia, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([h = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((t, u) => u.length > t ? u.length : t, 0);
    p > m && (m = p);
    n.length > h && (h = n.length);
    return [h, m];
  }, []), k = (h, m) => {
    m = " ".repeat(m - h.length);
    return `${h}${m}`;
  };
  a = a.reduce((h, m, n) => {
    n = f[n].split("\n");
    m = k(m, g);
    const [p, ...t] = n;
    m = `${m}\t${p}`;
    const u = k("", g);
    n = t.map(Ra => `${u}\t${Ra}`);
    return [...h, m, ...n];
  }, []).map(h => `\t${h}`);
  const l = [c, `  ${d || ""}`].filter(h => h ? h.trim() : h).join("\n\n");
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
  a = Da(a, b, c);
  b = X(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = Ca(a, b, c);
  b = X(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:Ea, Replaceable:Ja, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = Ga, getRegex:g = Fa} = b || {}, k = g(d);
    e = {name:d, re:e, regExp:k, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...c, [d]:e};
}, {}), makeCutRule:a => {
  const {re:b, map:c, getReplacement:d, name:e} = a;
  return {re:b, replacement(f) {
    const {lastIndex:g} = a;
    c[g] = f;
    a.lastIndex += 1;
    return d(e, g);
  }};
}, makePasteRule:(a, b = []) => {
  const {regExp:c, map:d} = a;
  return {re:c, replacement(e, f) {
    e = d[f];
    delete d[f];
    f = Array.isArray(b) ? b : [b];
    return Ea(e, f);
  }};
}, resolveDependency:async(a, b) => {
  b && (b = F(b), a = G(b, a));
  var c = await V(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await W(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await W(a), c = !0);
      if (!e) {
        b = await W(G(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? qa("", b) : b, w:d};
}, rexml:(a, b) => N(new RegExp(`<${a}${ua.source}?(?:${/\s*\/>/.source}|${(new RegExp(`>([\\s\\S]+?)?</${a}>`)).source})`, "g"), b, ["a", "v", "v1", "v2", "c"]).map(({a:c = "", c:d = ""}) => {
  c = c.replace(/\/$/, "").trim();
  c = va(c);
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
  const c = A(!0), d = r(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = wa(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({l:e, ...f}, g) => {
    if (0 == e.length && d) {
      return {l:e, ...f};
    }
    const k = a[g];
    let l;
    if ("string" == typeof k) {
      ({value:l, argv:e} = P(e, g, k));
    } else {
      try {
        const {short:h, boolean:m, number:n, command:p, multiple:t} = k;
        p && t && c.length ? (l = c, d = !0) : p && c.length ? (l = c[0], d = !0) : {value:l, argv:e} = P(e, g, h, m, n);
      } catch (h) {
        return {l:e, ...f};
      }
    }
    return void 0 === l ? {l:e, ...f} : {l:e, ...f, [g]:l};
  }, {l:b});
}, Catchment:B, collect:C, clearr:a => a.split("\n").map(b => {
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
  return xa(a, b).map(({i:c, m:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => T(g, "green")).join(U(" ", "green")) : d ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => T(g, "red")).join(U(" ", "red")) : T(e, "grey");
  }).join("");
}, forkfeed:(a, b, c = [], d = null) => {
  if (d) {
    a.on("data", k => d.write(k));
  }
  let [e, ...f] = c;
  if (e) {
    var g = k => {
      const [l, h] = e;
      l.test(k) && (k = `${h}\n`, d && d.write(k), b.write(k), [e, ...f] = f, e || a.removeListener("data", g));
    };
    a.on("data", g);
  }
}, makepromise:E, mismatch:N};


//# sourceMappingURL=stdlib.js.map