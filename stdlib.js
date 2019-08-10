#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const child_process = require('child_process');
const util = require('util');
const _crypto = require('crypto');
const _module = require('module');             
const {createReadStream:x, createWriteStream:A, lstat:I, mkdir:aa, readdir:ba, readlink:ca, symlink:da} = fs;
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
const ja = /\s+at.*(?:\(|\s)(.*)\)?/, ma = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, na = ia(), J = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ma.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(ja);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(ja, (h, k) => h.replace(k, k.replace(na, "~"))) : f).join("\n");
};
function oa(a, b, c = !1) {
  return function(d) {
    var e = ha(arguments), {stack:f} = Error();
    const h = ea(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [h, b]].join("\n");
    e = J(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function K(a) {
  var {stack:b} = Error();
  const c = ha(arguments);
  b = fa(b, a);
  return oa(c, b, a);
}
;var pa = stream;
const {PassThrough:qa, Transform:ra, Writable:sa} = stream;
const ta = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class L extends sa {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {A:e = K(!0), proxyError:f} = a || {}, h = (k, l) => e(l);
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
      c && ta(this, c).pipe(this);
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
  ({promise:a} = new L({rs:a, ...b, A:K(!0)}));
  return await a;
};
async function N(a) {
  a = x(a);
  return await M(a);
}
;function ua(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function O(a, b, c) {
  const d = K(!0);
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
;const {basename:va, dirname:Q, join:S, relative:T, resolve:wa} = path;
async function xa(a) {
  const b = Q(a);
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
    await O(aa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = Q(a);
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
    const d = S(a, c);
    return {lstat:await O(I, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Aa = a => a.lstat.isDirectory(), Ba = a => !a.lstat.isDirectory();
async function U(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await O(I, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await O(ba, a);
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
  const c = x(a), d = A(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Da = async(a, b) => {
  a = await O(ca, a);
  await O(da, [a, b]);
}, Ea = async(a, b) => {
  await xa(S(b, "path.file"));
  const {content:c} = await U(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], h = S(a, e);
    e = S(b, e);
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
;const Ta = (a, b, {allAttributes:c, xml:d, D:e, sort:f, s:h} = {}) => {
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
const Ua = [], Va = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, Xa = (a, b = {}) => {
  const {addDoctype:c, pretty:d} = b;
  a = Wa(a, b, {});
  return c ? `<!doctype html>${d ? "\n" : ""}${a}` : a;
};
function Wa(a, b = {}, c = {}, d = !1, e = !1, f) {
  if (null == a || "boolean" == typeof a) {
    return "";
  }
  const {pretty:h = !1, shallow:k = !1, renderRootComponent:l = !1, shallowHighOrder:g = !1, sortAttributes:m, allAttributes:n, xml:p, lineLength:r = 40, closeVoidTags:v = !1} = b;
  let {nodeName:q, attributes:B = {}} = a;
  var t = ["textarea", "pre"].includes(q);
  const y = "string" == typeof h ? h : "  ";
  if ("object" != typeof a && !q) {
    return Ma(a);
  }
  if ("function" == typeof q) {
    if (!k || !d && l) {
      return a = Pa(a), q.prototype && "function" == typeof q.prototype.render ? (t = new q(a, c), t._disable = t.__x = !0, t.props = a, t.context = c, q.getDerivedStateFromProps ? t.state = {...t.state, ...q.getDerivedStateFromProps(t.props, t.state)} : t.componentWillMount && t.componentWillMount(), a = t.render(t.props, t.state, t.context), t.getChildContext && (c = {...c, ...t.getChildContext()})) : a = q(a, c), Wa(a, b, c, g, e, f);
    }
    q = q.displayName || q !== Function && q.name || Ya(q);
  }
  let u = "";
  ({F:D, C:d, s:f} = Ta(B, q, {allAttributes:n, xml:p, D:e, sort:m, s:f}));
  if (h) {
    let E = `<${q}`.length;
    u = D.reduce((z, H) => {
      const P = E + 1 + H.length;
      if (P > r) {
        return E = y.length, `${z}\n${y}${H}`;
      }
      E = P;
      return `${z} ${H}`;
    }, "");
  } else {
    u = D.length ? " " + D.join(" ") : "";
  }
  u = `<${q}${u}>`;
  if (`${q}`.match(/[\s\n\\/='"\0<>]/)) {
    throw u;
  }
  var D = `${q}`.match(Va);
  v && D && (u = u.replace(/>$/, " />"));
  let F = [];
  if (d) {
    h && (Na(d) || d.length + Za(u) > r) && (d = "\n" + y + `${d}`.replace(/(\n+)/g, "$1" + (y || "\t"))), u += d;
  } else {
    if (a.children) {
      let E = h && ~u.indexOf("\n");
      F = a.children.map(z => {
        if (null != z && !1 !== z && (z = Wa(z, b, c, !0, "svg" == q ? !0 : "foreignObject" == q ? !1 : e, f))) {
          return h && z.length + Za(u) > r && (E = !0), z;
        }
      }).filter(Boolean);
      if (h && E && !t) {
        for (a = F.length; a--;) {
          F[a] = "\n" + y + `${F[a]}`.replace(/(\n+)/g, "$1" + (y || "\t"));
        }
      }
    }
  }
  if (F.length) {
    u += F.join("");
  } else {
    if (p) {
      return u.substring(0, u.length - 1) + " />";
    }
  }
  D || (!t && h && ~u.indexOf("\n") && (u += "\n"), u += `</${q}>`);
  return u;
}
function Ya(a) {
  var b = (Function.prototype.toString.call(a).match(/^\s*function\s+([^( ]+)/) || "")[1];
  if (!b) {
    b = -1;
    for (let c = Ua.length; c--;) {
      if (Ua[c] === a) {
        b = c;
        break;
      }
    }
    0 > b && (b = Ua.push(a) - 1);
    b = `UnnamedComponent${b}`;
  }
  return b;
}
const Za = a => {
  a = a.split("\n");
  return a[a.length - 1].length;
};
function $a(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const ab = (a, b) => {
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
function bb(a, b) {
  function c() {
    return b.filter($a).reduce((d, {re:e, replacement:f}) => {
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
            ab(h, g);
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
;const cb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), db = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function eb(a, b) {
  return fb(a, b);
}
class W extends ra {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter($a);
    this.i = !1;
    this.B = b;
  }
  async replace(a, b) {
    const c = new W(this.g, this.B);
    b && Object.assign(c, b);
    a = await eb(c, a);
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
            ab(f, g);
          }
        });
        if (e.length) {
          try {
            const k = await Promise.all(e);
            b = b.replace(c, () => k.shift());
          } catch (k) {
            ab(f, k);
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
async function fb(a, b) {
  b instanceof pa ? b.pipe(a) : a.end(b);
  return await M(a);
}
;const gb = a => {
  a = `(${a.join("|")})`;
  return new RegExp(`( *)(<${a}${"(?:\\s+(?!\\/>)[^>]*?)?"}(?:\\s*?/>|>[\\s\\S]*?<\\/\\3>))`, "gm");
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function hb(a, b, c) {
  let d = a[a.length - 1];
  d && d.j === b && d.o === c ? a[a.length - 1] = {count:d.count + 1, j:b, o:c} : a.push({count:1, j:b, o:c});
}
function ib(a, b, c, d, e) {
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
function jb(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function kb(a, b) {
  var c = new lb;
  a = jb(a.split(""));
  b = jb(b.split(""));
  let d = b.length, e = a.length, f = 1, h = d + e, k = [{f:-1, l:[]}];
  var l = ib(c, k[0], b, a, 0);
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
          !p || m && g.f < n.f ? (g = {f:n.f, l:n.l.slice(0)}, hb(g.l, void 0, !0)) : (g.f++, hb(g.l, !0, void 0));
          m = ib(c, g, b, a, l);
          if (g.f + 1 >= d && m + 1 >= e) {
            l = mb(c, g.l, b, a);
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
class lb {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function mb(a, b, c, d) {
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
;const nb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ob = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function X(a, b) {
  return (b = nb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function pb(a, b) {
  return (b = ob[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Y = async a => {
  try {
    return await O(I, a);
  } catch (b) {
    return null;
  }
};
const Z = async(a, b) => {
  b && (b = Q(b), a = S(b, a));
  var c = await Y(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await qb(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await qb(a), c = !0);
      if (!e) {
        b = await qb(S(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? T("", b) : b, H:d};
}, qb = async a => {
  a = `${a}.js`;
  let b = await Y(a);
  b || (a = `${a}x`);
  if (b = await Y(a)) {
    return a;
  }
};
const {fork:rb, spawn:sb} = child_process;
const tb = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", h => {
      e(h);
    });
  }), a.stdout ? M(a.stdout) : void 0, a.stderr ? M(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const {debuglog:ub} = util;
const vb = (a, b) => a.some(c => c == b), wb = (a, b) => {
  const c = vb(a, "index.md"), d = vb(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, h) => {
    f = f.localeCompare(h, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const xb = ub("pedantry"), zb = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:h, ignoreHidden:k}) => {
  var l = Object.keys(d);
  l = await wb(l, e).reduce(async(g, m) => {
    g = await g;
    const {type:n, content:p} = d[m], r = S(c, m);
    let v;
    "File" == n ? k && m.startsWith(".") || (v = await yb({stream:a, source:b, path:r, separator:f, includeFilename:h})) : "Directory" == n && (v = await zb({stream:a, source:b, path:r, content:p, reverse:e, separator:f, includeFilename:h, ignoreHidden:k}));
    return g + v;
  }, 0);
  xb("dir %s size: %s B", c, l);
  return l;
}, yb = async a => {
  const {stream:b, source:c, path:d, separator:e, includeFilename:f} = a, h = S(c, d);
  b.emit("file", d);
  e && !b.u && (f ? b.push({file:"separator", data:e}) : b.push(e));
  a = await new Promise((k, l) => {
    let g = 0;
    const m = x(h);
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
  xb("file %s :: %s B", h, a);
  return a;
};
class Ab extends qa {
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
        await zb({stream:this, source:a, content:l, reverse:c, separator:k, includeFilename:f, ignoreHidden:h});
      } catch (g) {
        this.emit("error", g);
      } finally {
        this.end();
      }
    })();
  }
}
;const {createHash:Bb} = _crypto;
const {builtinModules:Cb} = _module;
const Db = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, Eb = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, Fb = /^ *import\s+(['"])(.+?)\1/gm, Gb = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, Hb = a => [Db, Eb, Fb, Gb].reduce((b, c) => {
  c = V(c, a, ["q", "from"]).map(d => d.from);
  return [...b, ...c];
}, []);
const Jb = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = S(a, "node_modules", b);
  f = S(f, "package.json");
  const h = await Y(f);
  if (h) {
    a = await Ib(f, d);
    if (void 0 === a) {
      throw Error(`The package ${T("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:k, version:l, packageName:g, main:m, entryExists:n, ...p} = a;
    return {entry:T("", k), packageJson:T("", f), ...l ? {version:l} : {}, packageName:g, ...m ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !h) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Jb(S(wa(a), ".."), b, c);
}, Ib = async(a, b = []) => {
  const c = await N(a);
  let d, e, f, h, k;
  try {
    ({module:d, version:e, name:f, main:h, ...k} = JSON.parse(c)), k = b.reduce((g, m) => {
      g[m] = k[m];
      return g;
    }, {});
  } catch (g) {
    throw Error(`Could not parse ${a}.`);
  }
  a = Q(a);
  b = d || h;
  if (!b) {
    if (!await Y(S(a, "index.js"))) {
      return;
    }
    b = h = "index.js";
  }
  a = S(a, b);
  let l;
  try {
    ({path:l} = await Z(a)), a = l;
  } catch (g) {
  }
  return {entry:a, version:e, packageName:f, main:!d && h, entryExists:!!l, ...k};
};
const Kb = a => /^[./]/.test(a), Lb = async(a, b, c, d, e = null) => {
  const f = K(), h = Q(a);
  b = b.map(async k => {
    if (Cb.includes(k)) {
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
        const {packageJson:n, packageName:p} = await Jb(h, g);
        k = Q(n);
        ({path:k} = await Z(S(k, m)));
        return {entry:k, package:p};
      }
    }
    try {
      const {entry:g, packageJson:m, version:n, packageName:p, hasMain:r, ...v} = await Jb(h, k, {fields:d});
      return p == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:g, packageJson:m, version:n, name:p, ...r ? {hasMain:r} : {}, ...v};
    } catch (g) {
      if (c) {
        return null;
      }
      throw f(g);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, Nb = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], package:h} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var k = await N(a), l = Hb(k);
  k = Mb(k);
  l = c ? l : l.filter(Kb);
  k = c ? k : k.filter(Kb);
  let g;
  try {
    const m = await Lb(a, l, e, f, h), n = await Lb(a, k, e, f, h);
    n.forEach(p => {
      p.required = !0;
    });
    g = [...m, ...n];
  } catch (m) {
    throw m.message = `${a}\n [!] ${m.message}`, m;
  }
  h = g.map(m => ({...m, from:a}));
  return await g.filter(({entry:m}) => m && !(m in b)).reduce(async(m, {entry:n, hasMain:p, packageJson:r, name:v, package:q}) => {
    if (r && d) {
      return m;
    }
    m = await m;
    v = (await Nb(n, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:v || q})).map(B => ({...B, from:B.from ? B.from : n, ...!B.packageJson && p ? {hasMain:p} : {}}));
    return [...m, ...v];
  }, h);
}, Mb = a => V(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const Ob = async a => {
  const b = K();
  ({path:a} = await Z(a));
  const {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = []} = {shallow:!0, soft:!0};
  let h;
  try {
    h = await Nb(a, {}, {nodeModules:c, shallow:d, soft:e, fields:f});
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
const Qb = (a, b, c = console.log) => {
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
    const {entry:h, v:k} = Pb(f);
    c(X("+", "green"), h, k);
  });
  e.forEach(f => {
    const {entry:h, v:k} = Pb(f);
    c(X("-", "red"), h, k);
  });
  return !1;
}, Pb = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, v:a};
}, Rb = async a => (await O(I, a)).mtime.getTime(), Sb = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await Rb(b);
  return `${b} ${c}`;
})), Tb = async a => {
  const b = await Ob(a), c = await Sb(b);
  ({path:a} = await Z(a));
  return {mtime:await Rb(a), hash:c, G:b};
};
const Ub = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({promise:c} = new L({rs:b}));
    const d = await c;
    await new Promise((e, f) => {
      A(a).once("error", f).end(d, e);
    });
  } else {
    await new Promise((d, e) => {
      const f = A(a);
      b.pipe(f);
      f.once("error", e).on("close", d);
    });
  }
};
module.exports = {competent:(a, b = {}) => {
  async function c(p, r, v, q, B, t) {
    try {
      const u = a[q], D = t.slice(0, B), F = t.slice(B + p.length);
      if (/\x3c!--\s*$/.test(D) && /^\s*--\x3e/.test(F)) {
        return p;
      }
      const [{content:E = "", props:z}] = Ia(q, v);
      if (v = E) {
        var y = new W({re:n, replacement:c});
        if (g) {
          const w = g.call(this);
          Object.assign(y, w);
        }
        v = await eb(y, v);
      }
      y = [v];
      let H = !1, P = !1, Qa = !1, ka, la, Ra;
      const Sa = e.call(this, {...z, children:y}, {export(w = !0) {
        H = w;
      }, setPretty(w, R) {
        ka = w;
        R && (la = R);
      }, renderAgain(w = !1) {
        P = !0;
        Qa = w;
      }}, q);
      let C;
      try {
        C = await u(Sa);
      } catch (w) {
        if (!w.message.startsWith("Class constructor")) {
          throw w;
        }
        C = (new u).render(Sa);
      }
      H && !C.attributes.id && (Ra = d.call(this), C.attributes.id = Ra);
      let G;
      "string" == typeof C ? G = C : Array.isArray(C) ? G = C.map(w => "string" == typeof w ? w : Xa(w, {pretty:ka, lineLength:la})).join("\n") : G = Xa(C, {pretty:ka, lineLength:la});
      G = G.replace(/^/gm, r);
      if (P) {
        let w;
        m ? w = m.call(this, q, Qa) : w = {re:n, replacement:c};
        const R = new W(w);
        if (g) {
          const Vb = g.call(this);
          Object.assign(R, Vb);
        }
        G = await eb(R, G);
      }
      H && f.call(this, q, C.attributes.id, z, y);
      h && h.call(this, q);
      return G;
    } catch (u) {
      return k && k.call(this, q, u, B, t), l ? "" : p;
    }
  }
  const {getId:d, getProps:e = (p, r) => ({...p, ...r}), markExported:f, onSuccess:h, onFail:k, removeOnError:l = !1, getContext:g, getReplacements:m} = b, n = gb(Object.keys(a));
  return {re:n, replacement:c};
}, c:X, b:pb, readDirStructure:U, clone:async(a, b) => {
  const c = await O(I, a), d = va(a);
  b = S(b, d);
  c.isDirectory() ? await Ea(a, b) : c.isSymbolicLink() ? await Da(a, b) : (await xa(b), await Ca(a, b));
}, Pedantry:Ab, whichStream:async function(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = x(b));
  "-" == c ? d.pipe(process.stdout) : c ? await Ub(c, d, b) : e instanceof sa && (d.pipe(e), await new Promise((f, h) => {
    e.on("error", h);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await Tb(a);
  a = Bb("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const {mtime:f, hash:h} = b;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : Qb(h, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
}, ensurePath:xa, read:N, replace:fb, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [h] = a.reduce(([g = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((r, v) => v.length > r ? v.length : r, 0);
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
    const v = k("", h);
    n = r.map(q => `${v}\t${q}`);
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
  a = sb(a, b, c);
  b = tb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = rb(a, b, c);
  b = tb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:bb, Replaceable:W, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = db, getRegex:h = cb} = b || {}, k = h(d);
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
    return bb(e, f);
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
  const c = K(!0), d = A(a);
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
}, Catchment:L, collect:M, clearr:a => a.split("\n").map(b => {
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
  return kb(a, b).map(({j:c, o:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => X(h, "green")).join(pb(" ", "green")) : d ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => X(h, "red")).join(pb(" ", "red")) : X(e, "grey");
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
}, makepromise:O, mismatch:V};


//# sourceMappingURL=stdlib.js.map