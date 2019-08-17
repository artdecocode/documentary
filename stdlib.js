#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const child_process = require('child_process');
const util = require('util');
const _crypto = require('crypto');
const _module = require('module');             
const {createReadStream:y, createWriteStream:C, lstat:I, mkdir:aa, readdir:ba, readlink:ca, symlink:da} = fs;
const ea = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, fa = (a, b = !1) => ea(a, 2 + (b ? 1 : 0)), ha = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:ia} = os;
const ja = /\s+at.*(?:\(|\s)(.*)\)?/, ka = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, la = ia(), J = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ka.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(ja);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(ja, (h, k) => h.replace(k, k.replace(la, "~"))) : f).join("\n");
};
function ma(a, b, c = !1) {
  return function(d) {
    var e = ha(arguments), {stack:f} = Error();
    const h = ea(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [h, b]].join("\n");
    e = J(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function L(a) {
  var {stack:b} = Error();
  const c = ha(arguments);
  b = fa(b, a);
  return ma(c, b, a);
}
;var na = stream;
const {PassThrough:oa, Transform:pa, Writable:qa} = stream;
const ra = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class sa extends qa {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {A:e = L(!0), proxyError:f} = a || {}, h = (k, l) => e(l);
    super(d);
    this.g = [];
    this.w = new Promise((k, l) => {
      this.on("finish", () => {
        let g;
        b ? g = Buffer.concat(this.g) : g = this.g.join("");
        k(g);
        this.g = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          h`${g}`;
        } else {
          const m = J(g.stack);
          g.stack = m;
          f && h`${g}`;
        }
        l(g);
      });
      c && ra(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get promise() {
    return this.w;
  }
}
const M = async(a, b = {}) => {
  ({promise:a} = new sa({rs:a, ...b, A:L(!0)}));
  return await a;
};
async function ta(a) {
  a = y(a);
  return await M(a);
}
;function ua(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function N(a, b, c) {
  const d = L(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, h) => {
    const k = (g, m) => g ? (g = d(g), h(g)) : f(c || m);
    let l = [k];
    Array.isArray(b) ? (b.forEach((g, m) => {
      ua(e, m);
    }), l = [...b, k]) : 1 < Array.from(arguments).length && (ua(e, 0), l = [b, k]);
    a(...l);
  });
}
;const {basename:va, dirname:O, join:P, relative:S, resolve:wa} = path;
async function xa(a) {
  const b = O(a);
  try {
    return await ya(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function ya(a) {
  try {
    await N(aa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = O(a);
      await ya(c);
      await ya(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function za(a, b) {
  b = b.map(async c => {
    const d = P(a, c);
    return {lstat:await N(I, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Aa = a => a.lstat.isDirectory(), Ba = a => !a.lstat.isDirectory();
async function U(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await N(I, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await N(ba, a);
  b = await za(a, b);
  a = b.filter(Aa);
  b = b.filter(Ba).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...c, [d.relativePath]:{type:e}};
  }, {});
  a = await a.reduce(async(c, {path:d, relativePath:e}) => {
    c = await c;
    d = await U(d);
    return {...c, [e]:d};
  }, {});
  return {content:{...b, ...a}, type:"Directory"};
}
;const Ca = async(a, b) => {
  const c = y(a), d = C(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Da = async(a, b) => {
  a = await N(ca, a);
  await N(da, [a, b]);
}, Ea = async(a, b) => {
  await xa(P(b, "path.file"));
  const {content:c} = await U(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], h = P(a, e);
    e = P(b, e);
    "Directory" == f ? await Ea(h, e) : "File" == f ? await Ca(h, e) : "SymbolicLink" == f && await Da(h, e);
  });
  await Promise.all(d);
};
function V(a, b, c, d = !1) {
  const e = [];
  b.replace(a, (f, ...h) => {
    f = h[h.length - 2];
    f = d ? {position:f} : {};
    h = h.slice(0, h.length - 2).reduce((k, l, g) => {
      g = c[g];
      if (!g || void 0 === l) {
        return k;
      }
      k[g] = l;
      return k;
    }, f);
    e.push(h);
  });
  return e;
}
;const Fa = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), Ga = new RegExp(`(?:\\s+((?:${Fa.source}\\s*)*))`);
const Ia = (a, b) => {
  a = (Array.isArray(a) ? a : [a]).join("|");
  return V(new RegExp(`<(${a})${Ga.source}?(?:${/\s*\/>/.source}|${/>([\s\S]+?)?<\/\1>/.source})`, "g"), b, "t a v v1 v2 c".split(" ")).map(({t:c, a:d = "", c:e = ""}) => {
    d = d.replace(/\/$/, "").trim();
    d = Ha(d);
    return {content:e, props:d, tag:c};
  });
}, Ha = a => V(Fa, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const Ja = (a, b, c, d = !1, e = !1) => {
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
}, Ka = a => {
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
const La = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
let Ma = a => `${a}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), Na = a => 40 < `${a}`.length || -1 != `${a}`.indexOf("\n") || -1 !== `${a}`.indexOf("<");
const Oa = {};
function Pa(a) {
  const b = {...a.attributes, children:a.children};
  a = a.nodeName.defaultProps;
  if (void 0 !== a) {
    for (let c in a) {
      void 0 === b[c] && (b[c] = a[c]);
    }
  }
  return b;
}
;const Ua = (a, b, {allAttributes:c, xml:d, D:e, sort:f, s:h} = {}) => {
  let k;
  const l = Object.keys(a);
  f && l.sort();
  return {F:l.map(g => {
    var m = a[g];
    if ("children" != g && !g.match(/[\s\n\\/='"\0<>]/) && (c || !["key", "ref"].includes(g))) {
      if ("className" == g) {
        if (a.class) {
          return;
        }
        g = "class";
      } else {
        if ("htmlFor" == g) {
          if (a.for) {
            return;
          }
          g = "for";
        } else {
          if ("srcSet" == g) {
            if (a.srcset) {
              return;
            }
            g = "srcset";
          }
        }
      }
      e && g.match(/^xlink:?./) && (g = g.toLowerCase().replace(/^xlink:?/, "xlink:"));
      if ("style" == g && m && "object" == typeof m) {
        {
          let p = "";
          for (var n in m) {
            let r = m[n];
            null != r && (p && (p += " "), p += Oa[n] || (Oa[n] = n.replace(/([A-Z])/g, "-$1").toLowerCase()), p += ": ", p += r, "number" == typeof r && !1 === La.test(n) && (p += "px"), p += ";");
          }
          m = p || void 0;
        }
      }
      if ("dangerouslySetInnerHTML" == g) {
        k = m && m.__html;
      } else {
        if ((m || 0 === m || "" === m) && "function" != typeof m) {
          if (!0 === m || "" === m) {
            if (m = g, !d) {
              return g;
            }
          }
          n = "";
          if ("value" == g) {
            if ("select" == b) {
              h = m;
              return;
            }
            "option" == b && h == m && (n = "selected ");
          }
          return `${n}${g}="${Ma(m)}"`;
        }
      }
    }
  }).filter(Boolean), C:k, s:h};
};
const Va = [], Wa = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, Xa = /^(a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/, Za = (a, b = {}) => {
  const {addDoctype:c, pretty:d} = b;
  a = Ya(a, b, {});
  return c ? `<!doctype html>${d ? "\n" : ""}${a}` : a;
};
function Ya(a, b = {}, c = {}, d = !1, e = !1, f) {
  if (null == a || "boolean" == typeof a) {
    return "";
  }
  const {pretty:h = !1, shallow:k = !1, renderRootComponent:l = !1, shallowHighOrder:g = !1, sortAttributes:m, allAttributes:n, xml:p, initialPadding:r = 0, closeVoidTags:u = !1} = b;
  let {lineLength:x = 40} = b;
  x -= r;
  let {nodeName:q, attributes:Q = {}} = a;
  var t = ["textarea", "pre"].includes(q), z = " ".repeat(r);
  const F = "string" == typeof h ? h : `  ${z}`;
  if ("object" != typeof a && !q) {
    return Ma(a);
  }
  if ("function" == typeof q) {
    if (!k || !d && l) {
      return z = Pa(a), q.prototype && "function" == typeof q.prototype.render ? (t = new q(z, c), t._disable = t.__x = !0, t.props = z, t.context = c, q.getDerivedStateFromProps ? t.state = {...t.state, ...q.getDerivedStateFromProps(t.props, t.state)} : t.componentWillMount && t.componentWillMount(), z = t.render(t.props, t.state, t.context), t.getChildContext && (c = {...c, ...t.getChildContext()})) : z = q(z, c), Ya(z, b, c, g, e, f);
    }
    q = q.displayName || q !== Function && q.name || $a(q);
  }
  let v = "";
  ({F:G, C:d, s:f} = Ua(Q, q, {allAttributes:n, xml:p, D:e, sort:m, s:f}));
  if (h) {
    let D = `<${q}`.length;
    v = G.reduce((A, K) => {
      const R = D + 1 + K.length;
      if (R > x) {
        return D = F.length, `${A}\n${F}${K}`;
      }
      D = R;
      return `${A} ${K}`;
    }, "");
  } else {
    v = G.length ? " " + G.join(" ") : "";
  }
  v = `<${q}${v}>`;
  if (`${q}`.match(/[\s\n\\/='"\0<>]/)) {
    throw v;
  }
  var G = `${q}`.match(Wa);
  u && G && (v = v.replace(/>$/, " />"));
  let B = [];
  if (d) {
    h && (Na(d) || d.length + ab(v) > x) && (d = "\n" + F + `${d}`.replace(/(\n+)/g, "$1" + (F || "\t"))), v += d;
  } else {
    if (a.children) {
      let D = h && v.includes("\n");
      B = a.children.map(A => {
        if (null != A && !1 !== A && (A = Ya(A, b, c, !0, "svg" == q ? !0 : "foreignObject" == q ? !1 : e, f))) {
          return h && A.length + ab(v) > x && (D = !0), A;
        }
      }).filter(Boolean);
      if (h && D && !t) {
        for (a = B.length; a--;) {
          B[a] = "\n" + F + `${B[a]}`.replace(/(\n+)/g, "$1" + (F || "\t"));
        }
      }
    }
  }
  if (B.length) {
    v += B.join("");
  } else {
    if (p) {
      return v.substring(0, v.length - 1) + " />";
    }
  }
  G || (a = B[B.length - 1], `${q}`.match(Xa) && (a ? !/>$/.test(a) : 1) || t || !h || !v.includes("\n") || (v += `\n${z}`), v += `</${q}>`);
  return v;
}
function $a(a) {
  var b = (Function.prototype.toString.call(a).match(/^\s*function\s+([^( ]+)/) || "")[1];
  if (!b) {
    b = -1;
    for (let c = Va.length; c--;) {
      if (Va[c] === a) {
        b = c;
        break;
      }
    }
    0 > b && (b = Va.push(a) - 1);
    b = `UnnamedComponent${b}`;
  }
  return b;
}
const ab = a => {
  a = a.split("\n");
  return a[a.length - 1].length;
};
function bb(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const cb = (a, b) => {
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
function db(a, b) {
  function c() {
    return b.filter(bb).reduce((d, {re:e, replacement:f}) => {
      if (this.i) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let h;
        return d.replace(e, (k, ...l) => {
          h = Error();
          try {
            return this.i ? k : f.call(this, k, ...l);
          } catch (g) {
            cb(h, g);
          }
        });
      }
    }, `${a}`);
  }
  c.g = () => {
    c.i = !0;
  };
  return c.call(c);
}
;const eb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), fb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function gb(a, b) {
  return hb(a, b);
}
class W extends pa {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(bb);
    this.i = !1;
    this.B = b;
  }
  async replace(a, b) {
    const c = new W(this.g, this.B);
    b && Object.assign(c, b);
    a = await gb(c, a);
    c.i && (this.i = !0);
    b && Object.keys(b).forEach(d => {
      b[d] = c[d];
    });
    return a;
  }
  async reduce(a) {
    return await this.g.reduce(async(b, {re:c, replacement:d}) => {
      b = await b;
      if (this.i) {
        return b;
      }
      if ("string" == typeof d) {
        b = b.replace(c, d);
      } else {
        const e = [];
        let f;
        const h = b.replace(c, (k, ...l) => {
          f = Error();
          try {
            if (this.i) {
              return e.length ? e.push(Promise.resolve(k)) : k;
            }
            const g = d.call(this, k, ...l);
            g instanceof Promise && e.push(g);
            return g;
          } catch (g) {
            cb(f, g);
          }
        });
        if (e.length) {
          try {
            const k = await Promise.all(e);
            b = b.replace(c, () => k.shift());
          } catch (k) {
            cb(f, k);
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
      a = J(d.stack), d.stack = a, c(d);
    }
  }
}
async function hb(a, b) {
  b instanceof na ? b.pipe(a) : a.end(b);
  return await M(a);
}
;const ib = a => {
  a = `(${a.join("|")})`;
  return new RegExp(`( *)(<${a}${"(?:\\s+(?!\\/>)[^>]*?)?"}(?:\\s*?/>|>[\\s\\S]*?<\\/\\3>))`, "gm");
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function jb(a, b, c) {
  let d = a[a.length - 1];
  d && d.j === b && d.o === c ? a[a.length - 1] = {count:d.count + 1, j:b, o:c} : a.push({count:1, j:b, o:c});
}
function kb(a, b, c, d, e) {
  let f = c.length, h = d.length, k = b.f;
  e = k - e;
  let l = 0;
  for (; k + 1 < f && e + 1 < h && a.equals(c[k + 1], d[e + 1]);) {
    k++, e++, l++;
  }
  l && b.l.push({count:l});
  b.f = k;
  return e;
}
function lb(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function mb(a, b) {
  var c = new nb;
  a = lb(a.split(""));
  b = lb(b.split(""));
  let d = b.length, e = a.length, f = 1, h = d + e, k = [{f:-1, l:[]}];
  var l = kb(c, k[0], b, a, 0);
  if (k[0].f + 1 >= d && l + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; f <= h;) {
    a: {
      for (l = -1 * f; l <= f; l += 2) {
        var g = k[l - 1];
        let n = k[l + 1];
        var m = (n ? n.f : 0) - l;
        g && (k[l - 1] = void 0);
        let p = g && g.f + 1 < d;
        m = n && 0 <= m && m < e;
        if (p || m) {
          !p || m && g.f < n.f ? (g = {f:n.f, l:n.l.slice(0)}, jb(g.l, void 0, !0)) : (g.f++, jb(g.l, !0, void 0));
          m = kb(c, g, b, a, l);
          if (g.f + 1 >= d && m + 1 >= e) {
            l = ob(c, g.l, b, a);
            break a;
          }
          k[l] = g;
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
class nb {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function ob(a, b, c, d) {
  let e = 0, f = b.length, h = 0, k = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.o) {
      l.value = a.join(d.slice(k, k + l.count)), k += l.count, e && b[e - 1].j && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.j) {
        l.value = a.join(c.slice(h, h + l.count));
      } else {
        let g = c.slice(h, h + l.count);
        g = g.map(function(m, n) {
          n = d[k + n];
          return n.length > m.length ? n : m;
        });
        l.value = a.join(g);
      }
      h += l.count;
      l.j || (k += l.count);
    }
  }
  c = b[f - 1];
  1 < f && "string" === typeof c.value && (c.j || c.o) && a.equals("", c.value) && (b[f - 2].value += c.value, b.pop());
  return b;
}
;const pb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, qb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function X(a, b) {
  return (b = pb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function rb(a, b) {
  return (b = qb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Y = async a => {
  try {
    return await N(I, a);
  } catch (b) {
    return null;
  }
};
const Z = async(a, b) => {
  b && (b = O(b), a = P(b, a));
  var c = await Y(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await sb(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await sb(a), c = !0);
      if (!e) {
        b = await sb(P(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? S("", b) : b, H:d};
}, sb = async a => {
  a = `${a}.js`;
  let b = await Y(a);
  b || (a = `${a}x`);
  if (b = await Y(a)) {
    return a;
  }
};
const {fork:tb, spawn:ub} = child_process;
const vb = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", h => {
      e(h);
    });
  }), a.stdout ? M(a.stdout) : void 0, a.stderr ? M(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const {debuglog:wb} = util;
const xb = (a, b) => a.some(c => c == b), yb = (a, b) => {
  const c = xb(a, "index.md"), d = xb(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, h) => {
    f = f.localeCompare(h, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const zb = wb("pedantry"), Bb = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:h, ignoreHidden:k}) => {
  var l = Object.keys(d);
  l = await yb(l, e).reduce(async(g, m) => {
    g = await g;
    const {type:n, content:p} = d[m], r = P(c, m);
    let u;
    "File" == n ? k && m.startsWith(".") || (u = await Ab({stream:a, source:b, path:r, separator:f, includeFilename:h})) : "Directory" == n && (u = await Bb({stream:a, source:b, path:r, content:p, reverse:e, separator:f, includeFilename:h, ignoreHidden:k}));
    return g + u;
  }, 0);
  zb("dir %s size: %s B", c, l);
  return l;
}, Ab = async a => {
  const {stream:b, source:c, path:d, separator:e, includeFilename:f} = a, h = P(c, d);
  b.emit("file", d);
  e && !b.u && (f ? b.push({file:"separator", data:e}) : b.push(e));
  a = await new Promise((k, l) => {
    let g = 0;
    const m = y(h);
    m.on("data", n => {
      g += n.byteLength;
    }).on("error", n => {
      l(n);
    }).on("close", () => {
      k(g);
    });
    if (f) {
      m.on("data", n => {
        b.push({file:h, data:`${n}`});
      });
    } else {
      m.pipe(b, {end:!1});
    }
  });
  b.u = !1;
  zb("file %s :: %s B", h, a);
  return a;
};
class Cb extends oa {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:h = !1} = b;
    super({objectMode:f});
    let k;
    d ? k = "\n" : e && (k = "\n\n");
    this.u = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await U(a));
      } catch (g) {
        this.emit("error", Error(g.message));
      }
      try {
        await Bb({stream:this, source:a, content:l, reverse:c, separator:k, includeFilename:f, ignoreHidden:h});
      } catch (g) {
        this.emit("error", g);
      } finally {
        this.end();
      }
    })();
  }
}
;const {createHash:Db} = _crypto;
const {builtinModules:Eb} = _module;
const Fb = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, Gb = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, Hb = /^ *import\s+(['"])(.+?)\1/gm, Ib = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, Jb = a => [Fb, Gb, Hb, Ib].reduce((b, c) => {
  c = V(c, a, ["q", "from"]).map(d => d.from);
  return [...b, ...c];
}, []);
const Lb = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = P(a, "node_modules", b);
  f = P(f, "package.json");
  const h = await Y(f);
  if (h) {
    a = await Kb(f, d);
    if (void 0 === a) {
      throw Error(`The package ${S("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:k, version:l, packageName:g, main:m, entryExists:n, ...p} = a;
    return {entry:S("", k), packageJson:S("", f), ...l ? {version:l} : {}, packageName:g, ...m ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !h) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Lb(P(wa(a), ".."), b, c);
}, Kb = async(a, b = []) => {
  const c = await ta(a);
  let d, e, f, h, k;
  try {
    ({module:d, version:e, name:f, main:h, ...k} = JSON.parse(c)), k = b.reduce((g, m) => {
      g[m] = k[m];
      return g;
    }, {});
  } catch (g) {
    throw Error(`Could not parse ${a}.`);
  }
  a = O(a);
  b = d || h;
  if (!b) {
    if (!await Y(P(a, "index.js"))) {
      return;
    }
    b = h = "index.js";
  }
  a = P(a, b);
  let l;
  try {
    ({path:l} = await Z(a)), a = l;
  } catch (g) {
  }
  return {entry:a, version:e, packageName:f, main:!d && h, entryExists:!!l, ...k};
};
const Mb = a => /^[./]/.test(a), Nb = async(a, b, c, d, e = null) => {
  const f = L(), h = O(a);
  b = b.map(async k => {
    if (Eb.includes(k)) {
      return {internal:k};
    }
    if (/^[./]/.test(k)) {
      try {
        var {path:l} = await Z(k, a);
        return {entry:l, package:e};
      } catch (g) {
      }
    } else {
      {
        let [n, p, ...r] = k.split("/");
        !n.startsWith("@") && p ? (r = [p, ...r], p = n) : p = n.startsWith("@") ? `${n}/${p}` : n;
        l = {name:p, paths:r.join("/")};
      }
      const {name:g, paths:m} = l;
      if (m) {
        const {packageJson:n, packageName:p} = await Lb(h, g);
        k = O(n);
        ({path:k} = await Z(P(k, m)));
        return {entry:k, package:p};
      }
    }
    try {
      const {entry:g, packageJson:m, version:n, packageName:p, hasMain:r, ...u} = await Lb(h, k, {fields:d});
      return p == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:g, packageJson:m, version:n, name:p, ...r ? {hasMain:r} : {}, ...u};
    } catch (g) {
      if (c) {
        return null;
      }
      throw f(g);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, Pb = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], package:h} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var k = await ta(a), l = Jb(k);
  k = Ob(k);
  l = c ? l : l.filter(Mb);
  k = c ? k : k.filter(Mb);
  let g;
  try {
    const m = await Nb(a, l, e, f, h), n = await Nb(a, k, e, f, h);
    n.forEach(p => {
      p.required = !0;
    });
    g = [...m, ...n];
  } catch (m) {
    throw m.message = `${a}\n [!] ${m.message}`, m;
  }
  h = g.map(m => ({...m, from:a}));
  return await g.filter(({entry:m}) => m && !(m in b)).reduce(async(m, {entry:n, hasMain:p, packageJson:r, name:u, package:x}) => {
    if (r && d) {
      return m;
    }
    m = await m;
    u = (await Pb(n, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:u || x})).map(q => ({...q, from:q.from ? q.from : n, ...!q.packageJson && p ? {hasMain:p} : {}}));
    return [...m, ...u];
  }, h);
}, Ob = a => V(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const Qb = async a => {
  const b = L();
  ({path:a} = await Z(a));
  const {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = []} = {shallow:!0, soft:!0};
  let h;
  try {
    h = await Pb(a, {}, {nodeModules:c, shallow:d, soft:e, fields:f});
  } catch (k) {
    throw b(k);
  }
  return h.filter(({internal:k, entry:l}, g) => k ? h.findIndex(({internal:m}) => m == k) == g : h.findIndex(({entry:m}) => l == m) == g).map(k => {
    const {entry:l, internal:g} = k, m = h.filter(({internal:n, entry:p}) => {
      if (g) {
        return g == n;
      }
      if (l) {
        return l == p;
      }
    }).map(({from:n}) => n).filter((n, p, r) => r.indexOf(n) == p);
    return {...k, from:m};
  }).map(({package:k, ...l}) => k ? {package:k, ...l} : l);
};
const Sb = (a, b, c = console.log) => {
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
    const {entry:h, v:k} = Rb(f);
    c(X("+", "green"), h, k);
  });
  e.forEach(f => {
    const {entry:h, v:k} = Rb(f);
    c(X("-", "red"), h, k);
  });
  return !1;
}, Rb = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, v:a};
}, Tb = async a => (await N(I, a)).mtime.getTime(), Ub = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await Tb(b);
  return `${b} ${c}`;
})), Vb = async a => {
  const b = await Qb(a), c = await Ub(b);
  ({path:a} = await Z(a));
  return {mtime:await Tb(a), hash:c, G:b};
};
const Wb = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({promise:c} = new sa({rs:b}));
    const d = await c;
    await new Promise((e, f) => {
      C(a).once("error", f).end(d, e);
    });
  } else {
    await new Promise((d, e) => {
      const f = C(a);
      b.pipe(f);
      f.once("error", e).on("close", d);
    });
  }
};
module.exports = {competent:(a, b = {}) => {
  async function c(p, r, u, x, q, Q) {
    try {
      const z = a[x], F = Q.slice(0, q), v = Q.slice(q + p.length);
      if (/\x3c!--\s*$/.test(F) && /^\s*--\x3e/.test(v)) {
        return p;
      }
      const [{content:G = "", props:B}] = Ia(x, u);
      if (u = G) {
        var t = new W({re:n, replacement:c});
        if (g) {
          const w = g.call(this);
          Object.assign(t, w);
        }
        u = await gb(t, u);
      }
      t = [u];
      let D = !1, A = !1, K = !1, R, Qa, Ra;
      const Sa = e.call(this, {...B, children:t}, {export(w = !0) {
        D = w;
      }, setPretty(w, T) {
        R = w;
        T && (Qa = T);
      }, renderAgain(w = !1) {
        A = !0;
        K = w;
      }}, x);
      let E;
      try {
        E = await z(Sa);
      } catch (w) {
        if (!w.message.startsWith("Class constructor")) {
          throw w;
        }
        E = (new z).render(Sa);
      }
      D && !E.attributes.id && (Ra = d.call(this), E.attributes.id = Ra);
      const Ta = {pretty:R, lineLength:Qa};
      let H;
      "string" == typeof E ? H = E : Array.isArray(E) ? H = E.map(w => "string" == typeof w ? w : Za(w, Ta)).join("\n") : H = Za(E, Ta);
      H = H.replace(/^/gm, r);
      if (A) {
        let w;
        m ? w = m.call(this, x, K) : w = {re:n, replacement:c};
        const T = new W(w);
        if (g) {
          const Xb = g.call(this);
          Object.assign(T, Xb);
        }
        H = await gb(T, H);
      }
      D && f.call(this, x, E.attributes.id, B, t);
      h && h.call(this, x);
      return H;
    } catch (z) {
      return k && k.call(this, x, z, q, Q), l ? "" : p;
    }
  }
  const {getId:d, getProps:e = (p, r) => ({...p, ...r}), markExported:f, onSuccess:h, onFail:k, removeOnError:l = !1, getContext:g, getReplacements:m} = b, n = ib(Object.keys(a));
  return {re:n, replacement:c};
}, c:X, b:rb, readDirStructure:U, clone:async(a, b) => {
  const c = await N(I, a), d = va(a);
  b = P(b, d);
  c.isDirectory() ? await Ea(a, b) : c.isSymbolicLink() ? await Da(a, b) : (await xa(b), await Ca(a, b));
}, Pedantry:Cb, whichStream:async function(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = y(b));
  "-" == c ? d.pipe(process.stdout) : c ? await Wb(c, d, b) : e instanceof qa && (d.pipe(e), await new Promise((f, h) => {
    e.on("error", h);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await Vb(a);
  a = Db("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const {mtime:f, hash:h} = b;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : Sb(h, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
}, ensurePath:xa, read:ta, replace:hb, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [h] = a.reduce(([g = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((r, u) => u.length > r ? u.length : r, 0);
    p > m && (m = p);
    n.length > g && (g = n.length);
    return [g, m];
  }, []), k = (g, m) => {
    m = " ".repeat(m - g.length);
    return `${g}${m}`;
  };
  a = a.reduce((g, m, n) => {
    n = f[n].split("\n");
    m = k(m, h);
    const [p, ...r] = n;
    m = `${m}\t${p}`;
    const u = k("", h);
    n = r.map(x => `${u}\t${x}`);
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
  a = ub(a, b, c);
  b = vb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = tb(a, b, c);
  b = vb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:db, Replaceable:W, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = fb, getRegex:h = eb} = b || {}, k = h(d);
    e = {name:d, re:e, regExp:k, getReplacement:f, map:{}, lastIndex:0};
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
    return db(e, f);
  }};
}, resolveDependency:Z, rexml:Ia, reduceUsage:a => Object.keys(a).reduce((b, c) => {
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
  const c = L(!0), d = C(a);
  await new Promise((e, f) => {
    d.on("error", h => {
      h = c(h);
      f(h);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = Ka(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({m:e, ...f}, h) => {
    if (0 == e.length && d) {
      return {m:e, ...f};
    }
    const k = a[h];
    let l;
    if ("string" == typeof k) {
      ({value:l, argv:e} = Ja(e, h, k));
    } else {
      try {
        const {short:g, boolean:m, number:n, command:p, multiple:r} = k;
        p && r && c.length ? (l = c, d = !0) : p && c.length ? (l = c[0], d = !0) : {value:l, argv:e} = Ja(e, h, g, m, n);
      } catch (g) {
        return {m:e, ...f};
      }
    }
    return void 0 === l ? {m:e, ...f} : {m:e, ...f, [h]:l};
  }, {m:b});
}, Catchment:sa, collect:M, clearr:a => a.split("\n").map(b => {
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
  return mb(a, b).map(({j:c, o:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => X(h, "green")).join(rb(" ", "green")) : d ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => X(h, "red")).join(rb(" ", "red")) : X(e, "grey");
  }).join("");
}, forkfeed:(a, b, c = [], d = null) => {
  if (d) {
    a.on("data", k => d.write(k));
  }
  let [e, ...f] = c;
  if (e) {
    var h = k => {
      const [l, g] = e;
      l.test(k) && (k = `${g}\n`, d && d.write(k), b.write(k), [e, ...f] = f, e || a.removeListener("data", h));
    };
    a.on("data", h);
  }
}, makepromise:N, mismatch:V};


//# sourceMappingURL=stdlib.js.map