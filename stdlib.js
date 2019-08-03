#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const child_process = require('child_process');
const util = require('util');
const _crypto = require('crypto');
const _module = require('module');             
const {createReadStream:r, createWriteStream:u, lstat:v, mkdir:aa, readdir:ba, readlink:ca, symlink:da} = fs;
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
  }).filter(f => f.trim()).map(f => b ? f.replace(y, (h, g) => h.replace(g, g.replace(ia, "~"))) : f).join("\n");
};
function ja(a, b, c = !1) {
  return function(d) {
    var e = x(arguments), {stack:f} = Error();
    const h = w(f, 2, !0), g = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${g}`, ...null !== e && a === e || c ? [b] : [h, b]].join("\n");
    e = z(e);
    return Object.assign(f ? d : Error(), {message:g, stack:e});
  };
}
;function A(a) {
  var {stack:b} = Error();
  const c = x(arguments);
  b = ea(b, a);
  return ja(c, b, a);
}
;var ka = stream;
const {PassThrough:la, Transform:ma, Writable:B} = stream;
const na = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class C extends B {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {v:e = A(!0), proxyError:f} = a || {}, h = (g, l) => e(l);
    super(d);
    this.g = [];
    this.u = new Promise((g, l) => {
      this.on("finish", () => {
        let k;
        b ? k = Buffer.concat(this.g) : k = this.g.join("");
        g(k);
        this.g = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          h`${k}`;
        } else {
          const m = z(k.stack);
          k.stack = m;
          f && h`${k}`;
        }
        l(k);
      });
      c && na(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get promise() {
    return this.u;
  }
}
const D = async(a, b = {}) => {
  ({promise:a} = new C({rs:a, ...b, v:A(!0)}));
  return await a;
};
async function E(a) {
  a = r(a);
  return await D(a);
}
;function F(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function G(a, b, c) {
  const d = A(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, h) => {
    const g = (k, m) => k ? (k = d(k), h(k)) : f(c || m);
    let l = [g];
    Array.isArray(b) ? (b.forEach((k, m) => {
      F(e, m);
    }), l = [...b, g]) : 1 < Array.from(arguments).length && (F(e, 0), l = [b, g]);
    a(...l);
  });
}
;const {basename:oa, dirname:I, join:J, relative:K, resolve:pa} = path;
async function L(a) {
  const b = I(a);
  try {
    return await M(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function M(a) {
  try {
    await G(aa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = I(a);
      await M(c);
      await M(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function qa(a, b) {
  b = b.map(async c => {
    const d = J(a, c);
    return {lstat:await G(v, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const ra = a => a.lstat.isDirectory(), sa = a => !a.lstat.isDirectory();
async function N(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await G(v, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await G(ba, a);
  b = await qa(a, b);
  a = b.filter(ra);
  b = b.filter(sa).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...c, [d.relativePath]:{type:e}};
  }, {});
  a = await a.reduce(async(c, {path:d, relativePath:e}) => {
    c = await c;
    d = await N(d);
    return {...c, [e]:d};
  }, {});
  return {content:{...b, ...a}, type:"Directory"};
}
;const O = async(a, b) => {
  const c = r(a), d = u(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, P = async(a, b) => {
  a = await G(ca, a);
  await G(da, [a, b]);
}, Q = async(a, b) => {
  await L(J(b, "path.file"));
  const {content:c} = await N(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], h = J(a, e);
    e = J(b, e);
    "Directory" == f ? await Q(h, e) : "File" == f ? await O(h, e) : "SymbolicLink" == f && await P(h, e);
  });
  await Promise.all(d);
};
function S(a, b, c, d = !1) {
  const e = [];
  b.replace(a, (f, ...h) => {
    f = h[h.length - 2];
    f = d ? {position:f} : {};
    h = h.slice(0, h.length - 2).reduce((g, l, k) => {
      k = c[k];
      if (!k || void 0 === l) {
        return g;
      }
      g[k] = l;
      return g;
    }, f);
    e.push(h);
  });
  return e;
}
;const ta = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), ua = new RegExp(`\\s*((?:${ta.source}\\s*)*)`);
const va = a => S(ta, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const wa = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(h => f.test(h));
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
}, xa = a => {
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
function ya(a, b, c) {
  let d = a[a.length - 1];
  d && d.i === b && d.m === c ? a[a.length - 1] = {count:d.count + 1, i:b, m:c} : a.push({count:1, i:b, m:c});
}
function za(a, b, c, d, e) {
  let f = c.length, h = d.length, g = b.f;
  e = g - e;
  let l = 0;
  for (; g + 1 < f && e + 1 < h && a.equals(c[g + 1], d[e + 1]);) {
    g++, e++, l++;
  }
  l && b.j.push({count:l});
  b.f = g;
  return e;
}
function Aa(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function Ba(a, b) {
  var c = new Ca;
  a = Aa(a.split(""));
  b = Aa(b.split(""));
  let d = b.length, e = a.length, f = 1, h = d + e, g = [{f:-1, j:[]}];
  var l = za(c, g[0], b, a, 0);
  if (g[0].f + 1 >= d && l + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; f <= h;) {
    a: {
      for (l = -1 * f; l <= f; l += 2) {
        var k = g[l - 1];
        let n = g[l + 1];
        var m = (n ? n.f : 0) - l;
        k && (g[l - 1] = void 0);
        let p = k && k.f + 1 < d;
        m = n && 0 <= m && m < e;
        if (p || m) {
          !p || m && k.f < n.f ? (k = {f:n.f, j:n.j.slice(0)}, ya(k.j, void 0, !0)) : (k.f++, ya(k.j, !0, void 0));
          m = za(c, k, b, a, l);
          if (k.f + 1 >= d && m + 1 >= e) {
            l = Da(c, k.j, b, a);
            break a;
          }
          g[l] = k;
        } else {
          g[l] = void 0;
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
class Ca {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function Da(a, b, c, d) {
  let e = 0, f = b.length, h = 0, g = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.m) {
      l.value = a.join(d.slice(g, g + l.count)), g += l.count, e && b[e - 1].i && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.i) {
        l.value = a.join(c.slice(h, h + l.count));
      } else {
        let k = c.slice(h, h + l.count);
        k = k.map(function(m, n) {
          n = d[g + n];
          return n.length > m.length ? n : m;
        });
        l.value = a.join(k);
      }
      h += l.count;
      l.i || (g += l.count);
    }
  }
  c = b[f - 1];
  1 < f && "string" === typeof c.value && (c.i || c.m) && a.equals("", c.value) && (b[f - 2].value += c.value, b.pop());
  return b;
}
;const Ea = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Fa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function T(a, b) {
  return (b = Ea[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function U(a, b) {
  return (b = Fa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const V = async a => {
  try {
    return await G(v, a);
  } catch (b) {
    return null;
  }
};
const X = async(a, b) => {
  b && (b = I(b), a = J(b, a));
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
        b = await W(J(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? K("", b) : b, B:d};
}, W = async a => {
  a = `${a}.js`;
  let b = await V(a);
  b || (a = `${a}x`);
  if (b = await V(a)) {
    return a;
  }
};
const {fork:Ga, spawn:Ha} = child_process;
const Ia = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", h => {
      e(h);
    });
  }), a.stdout ? D(a.stdout) : void 0, a.stderr ? D(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
function Ja(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const Y = (a, b) => {
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
function Ka(a, b) {
  function c() {
    return b.filter(Ja).reduce((d, {re:e, replacement:f}) => {
      if (this.h) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let h;
        return d.replace(e, (g, ...l) => {
          h = Error();
          try {
            return this.h ? g : f.call(this, g, ...l);
          } catch (k) {
            Y(h, k);
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
;const La = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), Ma = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function Na(a, b) {
  return Oa(a, b);
}
class Pa extends ma {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(Ja);
    this.h = !1;
    this.w = b;
  }
  async replace(a, b) {
    const c = new Pa(this.g, this.w);
    b && Object.assign(c, b);
    a = await Na(c, a);
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
        const h = b.replace(c, (g, ...l) => {
          f = Error();
          try {
            if (this.h) {
              return e.length ? e.push(Promise.resolve(g)) : g;
            }
            const k = d.call(this, g, ...l);
            k instanceof Promise && e.push(k);
            return k;
          } catch (k) {
            Y(f, k);
          }
        });
        if (e.length) {
          try {
            const g = await Promise.all(e);
            b = b.replace(c, () => g.shift());
          } catch (g) {
            Y(f, g);
          }
        } else {
          b = h;
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
async function Oa(a, b) {
  b instanceof ka ? b.pipe(a) : a.end(b);
  return await D(a);
}
;const {debuglog:Qa} = util;
const Ra = (a, b) => a.some(c => c == b), Sa = (a, b) => {
  const c = Ra(a, "index.md"), d = Ra(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, h) => {
    f = f.localeCompare(h, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const Ta = Qa("pedantry"), Va = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:h, ignoreHidden:g}) => {
  var l = Object.keys(d);
  l = await Sa(l, e).reduce(async(k, m) => {
    k = await k;
    const {type:n, content:p} = d[m], q = J(c, m);
    let t;
    "File" == n ? g && m.startsWith(".") || (t = await Ua({stream:a, source:b, path:q, separator:f, includeFilename:h})) : "Directory" == n && (t = await Va({stream:a, source:b, path:q, content:p, reverse:e, separator:f, includeFilename:h, ignoreHidden:g}));
    return k + t;
  }, 0);
  Ta("dir %s size: %s B", c, l);
  return l;
}, Ua = async a => {
  const {stream:b, source:c, path:d, separator:e, includeFilename:f} = a, h = J(c, d);
  b.emit("file", d);
  e && !b.o && (f ? b.push({file:"separator", data:e}) : b.push(e));
  a = await new Promise((g, l) => {
    let k = 0;
    const m = r(h);
    m.on("data", n => {
      k += n.byteLength;
    }).on("error", n => {
      l(n);
    }).on("close", () => {
      g(k);
    });
    if (f) {
      m.on("data", n => {
        b.push({file:h, data:`${n}`});
      });
    } else {
      m.pipe(b, {end:!1});
    }
  });
  b.o = !1;
  Ta("file %s :: %s B", h, a);
  return a;
};
class Wa extends la {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:h = !1} = b;
    super({objectMode:f});
    let g;
    d ? g = "\n" : e && (g = "\n\n");
    this.o = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await N(a));
      } catch (k) {
        this.emit("error", Error(k.message));
      }
      try {
        await Va({stream:this, source:a, content:l, reverse:c, separator:g, includeFilename:f, ignoreHidden:h});
      } catch (k) {
        this.emit("error", k);
      } finally {
        this.end();
      }
    })();
  }
}
;const {createHash:Xa} = _crypto;
const {builtinModules:Ya} = _module;
const Za = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, $a = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, ab = /^ *import\s+(['"])(.+?)\1/gm, bb = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, cb = a => [Za, $a, ab, bb].reduce((b, c) => {
  c = S(c, a, ["q", "from"]).map(d => d.from);
  return [...b, ...c];
}, []);
const Z = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = J(a, "node_modules", b);
  f = J(f, "package.json");
  const h = await V(f);
  if (h) {
    a = await db(f, d);
    if (void 0 === a) {
      throw Error(`The package ${K("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:g, version:l, packageName:k, main:m, entryExists:n, ...p} = a;
    return {entry:K("", g), packageJson:K("", f), ...l ? {version:l} : {}, packageName:k, ...m ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !h) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Z(J(pa(a), ".."), b, c);
}, db = async(a, b = []) => {
  const c = await E(a);
  let d, e, f, h, g;
  try {
    ({module:d, version:e, name:f, main:h, ...g} = JSON.parse(c)), g = b.reduce((k, m) => {
      k[m] = g[m];
      return k;
    }, {});
  } catch (k) {
    throw Error(`Could not parse ${a}.`);
  }
  a = I(a);
  b = d || h;
  if (!b) {
    if (!await V(J(a, "index.js"))) {
      return;
    }
    b = h = "index.js";
  }
  a = J(a, b);
  let l;
  try {
    ({path:l} = await X(a)), a = l;
  } catch (k) {
  }
  return {entry:a, version:e, packageName:f, main:!d && h, entryExists:!!l, ...g};
};
const eb = a => /^[./]/.test(a), fb = async(a, b, c, d, e = null) => {
  const f = A(), h = I(a);
  b = b.map(async g => {
    if (Ya.includes(g)) {
      return {internal:g};
    }
    if (/^[./]/.test(g)) {
      try {
        var {path:l} = await X(g, a);
        return {entry:l, package:e};
      } catch (k) {
      }
    } else {
      {
        let [n, p, ...q] = g.split("/");
        !n.startsWith("@") && p ? (q = [p, ...q], p = n) : p = n.startsWith("@") ? `${n}/${p}` : n;
        l = {name:p, paths:q.join("/")};
      }
      const {name:k, paths:m} = l;
      if (m) {
        const {packageJson:n, packageName:p} = await Z(h, k);
        g = I(n);
        ({path:g} = await X(J(g, m)));
        return {entry:g, package:p};
      }
    }
    try {
      const {entry:k, packageJson:m, version:n, packageName:p, hasMain:q, ...t} = await Z(h, g, {fields:d});
      return p == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:k, packageJson:m, version:n, name:p, ...q ? {hasMain:q} : {}, ...t};
    } catch (k) {
      if (c) {
        return null;
      }
      throw f(k);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, hb = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], package:h} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var g = await E(a), l = cb(g);
  g = gb(g);
  l = c ? l : l.filter(eb);
  g = c ? g : g.filter(eb);
  let k;
  try {
    const m = await fb(a, l, e, f, h), n = await fb(a, g, e, f, h);
    n.forEach(p => {
      p.required = !0;
    });
    k = [...m, ...n];
  } catch (m) {
    throw m.message = `${a}\n [!] ${m.message}`, m;
  }
  h = k.map(m => ({...m, from:a}));
  return await k.filter(({entry:m}) => m && !(m in b)).reduce(async(m, {entry:n, hasMain:p, packageJson:q, name:t, package:R}) => {
    if (q && d) {
      return m;
    }
    m = await m;
    t = (await hb(n, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:t || R})).map(H => ({...H, from:H.from ? H.from : n, ...!H.packageJson && p ? {hasMain:p} : {}}));
    return [...m, ...t];
  }, h);
}, gb = a => S(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const ib = async a => {
  const b = A();
  ({path:a} = await X(a));
  const {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = []} = {shallow:!0, soft:!0};
  let h;
  try {
    h = await hb(a, {}, {nodeModules:c, shallow:d, soft:e, fields:f});
  } catch (g) {
    throw b(g);
  }
  return h.filter(({internal:g, entry:l}, k) => g ? h.findIndex(({internal:m}) => m == g) == k : h.findIndex(({entry:m}) => l == m) == k).map(g => {
    const {entry:l, internal:k} = g, m = h.filter(({internal:n, entry:p}) => {
      if (k) {
        return k == n;
      }
      if (l) {
        return l == p;
      }
    }).map(({from:n}) => n).filter((n, p, q) => q.indexOf(n) == p);
    return {...g, from:m};
  }).map(({package:g, ...l}) => g ? {package:g, ...l} : l);
};
const kb = (a, b, c = console.log) => {
  const d = [], e = [];
  b.forEach(f => {
    a.includes(f) || d.push(f);
  });
  a.forEach(f => {
    b.includes(f) || e.push(f);
  });
  if (!d.length && !e.length) {
    return !0;
  }
  d.forEach(f => {
    const {entry:h, s:g} = jb(f);
    c(T("+", "green"), h, g);
  });
  e.forEach(f => {
    const {entry:h, s:g} = jb(f);
    c(T("-", "red"), h, g);
  });
  return !1;
}, jb = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, s:a};
}, lb = async a => (await G(v, a)).mtime.getTime(), mb = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await lb(b);
  return `${b} ${c}`;
})), nb = async a => {
  const b = await ib(a), c = await mb(b);
  ({path:a} = await X(a));
  return {mtime:await lb(a), hash:c, A:b};
};
const ob = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({promise:c} = new C({rs:b}));
    const d = await c;
    await new Promise((e, f) => {
      u(a).once("error", f).end(d, e);
    });
  } else {
    await new Promise((d, e) => {
      const f = u(a);
      b.pipe(f);
      f.once("error", e).on("close", d);
    });
  }
};
module.exports = {c:T, b:U, readDirStructure:N, clone:async(a, b) => {
  const c = await G(v, a), d = oa(a);
  b = J(b, d);
  c.isDirectory() ? await Q(a, b) : c.isSymbolicLink() ? await P(a, b) : (await L(b), await O(a, b));
}, Pedantry:Wa, whichStream:async function(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = r(b));
  "-" == c ? d.pipe(process.stdout) : c ? await ob(c, d, b) : e instanceof B && (d.pipe(e), await new Promise((f, h) => {
    e.on("error", h);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await nb(a);
  a = Xa("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const {mtime:f, hash:h} = b;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : kb(h, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
}, ensurePath:L, read:E, replace:Oa, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [h] = a.reduce(([k = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((q, t) => t.length > q ? t.length : q, 0);
    p > m && (m = p);
    n.length > k && (k = n.length);
    return [k, m];
  }, []), g = (k, m) => {
    m = " ".repeat(m - k.length);
    return `${k}${m}`;
  };
  a = a.reduce((k, m, n) => {
    n = f[n].split("\n");
    m = g(m, h);
    const [p, ...q] = n;
    m = `${m}\t${p}`;
    const t = g("", h);
    n = q.map(R => `${t}\t${R}`);
    return [...k, m, ...n];
  }, []).map(k => `\t${k}`);
  const l = [c, `  ${d || ""}`].filter(k => k ? k.trim() : k).join("\n\n");
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
  a = Ha(a, b, c);
  b = Ia(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = Ga(a, b, c);
  b = Ia(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:Ka, Replaceable:Pa, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = Ma, getRegex:h = La} = b || {}, g = h(d);
    e = {name:d, re:e, regExp:g, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...c, [d]:e};
}, {}), makeCutRule:a => {
  const {re:b, map:c, getReplacement:d, name:e} = a;
  return {re:b, replacement(f) {
    const {lastIndex:h} = a;
    c[h] = f;
    a.lastIndex += 1;
    return d(e, h);
  }};
}, makePasteRule:(a, b = []) => {
  const {regExp:c, map:d} = a;
  return {re:c, replacement(e, f) {
    e = d[f];
    delete d[f];
    f = Array.isArray(b) ? b : [b];
    return Ka(e, f);
  }};
}, resolveDependency:X, rexml:(a, b) => S(new RegExp(`<${a}${ua.source}?(?:${/\s*\/>/.source}|${(new RegExp(`>([\\s\\S]+?)?</${a}>`)).source})`, "g"), b, ["a", "v", "v1", "v2", "c"]).map(({a:c = "", c:d = ""}) => {
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
  const c = A(!0), d = u(a);
  await new Promise((e, f) => {
    d.on("error", h => {
      h = c(h);
      f(h);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = xa(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({l:e, ...f}, h) => {
    if (0 == e.length && d) {
      return {l:e, ...f};
    }
    const g = a[h];
    let l;
    if ("string" == typeof g) {
      ({value:l, argv:e} = wa(e, h, g));
    } else {
      try {
        const {short:k, boolean:m, number:n, command:p, multiple:q} = g;
        p && q && c.length ? (l = c, d = !0) : p && c.length ? (l = c[0], d = !0) : {value:l, argv:e} = wa(e, h, k, m, n);
      } catch (k) {
        return {l:e, ...f};
      }
    }
    return void 0 === l ? {l:e, ...f} : {l:e, ...f, [h]:l};
  }, {l:b});
}, Catchment:C, collect:D, clearr:a => a.split("\n").map(b => {
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
  return Ba(a, b).map(({i:c, m:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => T(h, "green")).join(U(" ", "green")) : d ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => T(h, "red")).join(U(" ", "red")) : T(e, "grey");
  }).join("");
}, forkfeed:(a, b, c = [], d = null) => {
  if (d) {
    a.on("data", g => d.write(g));
  }
  let [e, ...f] = c;
  if (e) {
    var h = g => {
      const [l, k] = e;
      l.test(g) && (g = `${k}\n`, d && d.write(g), b.write(g), [e, ...f] = f, e || a.removeListener("data", h));
    };
    a.on("data", h);
  }
}, makepromise:G, mismatch:S};


//# sourceMappingURL=stdlib.js.map