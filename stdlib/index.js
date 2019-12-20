#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const tty = require('tty');
const util = require('util');
const _crypto = require('crypto');
const child_process = require('child_process');
const _module = require('module');             
const aa = fs.createReadStream, ba = fs.createWriteStream, B = fs.lstat, ca = fs.mkdir, ea = fs.mkdirSync, fa = fs.readdir, ha = fs.readlink, ia = fs.symlink;
const ja = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ka = (a, b = !1) => ja(a, 2 + (b ? 1 : 0)), la = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const ma = os.homedir;
const na = /\s+at.*(?:\(|\s)(.*)\)?/, oa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, pa = ma(), qa = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(oa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(na);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(na, (h, k) => h.replace(k, k.replace(pa, "~"))) : f).join("\n");
};
function ra(a, b, c = !1) {
  return function(d) {
    var e = la(arguments), {stack:f} = Error();
    const h = ja(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [h, b]].join("\n");
    e = qa(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function H(a) {
  var {stack:b} = Error();
  const c = la(arguments);
  b = ka(b, a);
  return ra(c, b, a);
}
;var sa = stream;
const ta = stream.PassThrough, ua = stream.Transform, va = stream.Writable;
const wa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class xa extends va {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {H:e = H(!0), proxyError:f} = a || {}, h = (k, l) => e(l);
    super(d);
    this.g = [];
    this.F = new Promise((k, l) => {
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
          const m = qa(g.stack);
          g.stack = m;
          f && h`${g}`;
        }
        l(g);
      });
      c && wa(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get promise() {
    return this.F;
  }
}
const ya = async(a, b = {}) => {
  ({promise:a} = new xa({rs:a, ...b, H:H(!0)}));
  return await a;
};
async function za(a) {
  a = aa(a);
  return await ya(a);
}
;function Aa(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function I(a, b, c) {
  const d = H(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const e = a.length;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, h) => {
    const k = (g, m) => g ? (g = d(g), h(g)) : f(c || m);
    let l = [k];
    Array.isArray(b) ? (b.forEach((g, m) => {
      Aa(e, m);
    }), l = [...b, k]) : 1 < Array.from(arguments).length && (Aa(e, 0), l = [b, k]);
    a(...l);
  });
}
;const Ba = path.basename, M = path.dirname, Q = path.join, Ca = path.relative, Da = path.resolve;
async function Ea(a) {
  const b = M(a);
  try {
    return await Fa(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function Fa(a) {
  try {
    await I(ca, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = M(a);
      await Fa(c);
      await Fa(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
function Ga(a) {
  try {
    ea(a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = M(a);
      Ga(c);
      Ga(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Ha(a, b) {
  b = b.map(async c => {
    const d = Q(a, c);
    return {lstat:await I(B, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ia = a => a.lstat.isDirectory(), Ja = a => !a.lstat.isDirectory();
async function Ka(a, b = {}) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:c = []} = b;
  if (!(await I(B, a)).isDirectory()) {
    throw b = Error("Path is not a directory"), b.code = "ENOTDIR", b;
  }
  b = await I(fa, a);
  var d = await Ha(a, b);
  b = d.filter(Ia);
  d = d.filter(Ja).reduce((e, f) => {
    var h = f.lstat.isDirectory() ? "Directory" : f.lstat.isFile() ? "File" : f.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [f.relativePath]:{type:h}};
  }, {});
  b = await b.reduce(async(e, {path:f, relativePath:h}) => {
    const k = Ca(a, f);
    if (c.includes(k)) {
      return e;
    }
    e = await e;
    f = await Ka(f);
    return {...e, [h]:f};
  }, {});
  return {content:{...d, ...b}, type:"Directory"};
}
;const La = async(a, b) => {
  const c = aa(a), d = ba(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Ma = async(a, b) => {
  a = await I(ha, a);
  await I(ia, [a, b]);
}, Na = async(a, b) => {
  await Ea(Q(b, "path.file"));
  const {content:c} = await Ka(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], h = Q(a, e);
    e = Q(b, e);
    "Directory" == f ? await Na(h, e) : "File" == f ? await La(h, e) : "SymbolicLink" == f && await Ma(h, e);
  });
  await Promise.all(d);
};
function Oa(a, b, c, d = !1) {
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
;const Pa = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), Qa = new RegExp(`(?:\\s+((?:${Pa.source}\\s*)*))`);
const Sa = (a, b) => {
  a = (Array.isArray(a) ? a : [a]).join("|");
  return Oa(new RegExp(`<(${a})${Qa.source}?(?:${/\s*\/>/.source}|${/>([\s\S]+?)?<\/\1>/.source})`, "g"), b, "t a v v1 v2 c".split(" ")).map(({t:c, a:d = "", c:e = ""}) => {
    d = d.replace(/\/$/, "").trim();
    d = Ra(d);
    return {content:e, props:d, tag:c};
  });
}, Ra = a => Oa(Pa, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const Ta = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(h => f.test(h));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, index:b, length:1};
  }
  d = a[b + 1];
  if (!d || "string" == typeof d && d.startsWith("--")) {
    return {argv:a};
  }
  e && (d = parseInt(d, 10));
  return {value:d, index:b, length:2};
}, Ua = a => {
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
const Va = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
let Wa = a => `${a}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), Xa = a => 40 < `${a}`.length || -1 != `${a}`.indexOf("\n") || -1 !== `${a}`.indexOf("<");
const Ya = {};
function Za(a) {
  const b = {...a.attributes, children:a.children};
  a = a.nodeName.defaultProps;
  if (void 0 !== a) {
    for (let c in a) {
      void 0 === b[c] && (b[c] = a[c]);
    }
  }
  return b;
}
;const $a = (a, b, {allAttributes:c, xml:d, J:e, sort:f, w:h} = {}) => {
  let k;
  const l = Object.keys(a);
  f && l.sort();
  return {K:l.map(g => {
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
          let n = "";
          for (var p in m) {
            let q = m[p];
            null != q && (n && (n += " "), n += Ya[p] || (Ya[p] = p.replace(/([A-Z])/g, "-$1").toLowerCase()), n += ": ", n += q, "number" == typeof q && !1 === Va.test(p) && (n += "px"), n += ";");
          }
          m = n || void 0;
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
          p = "";
          if ("value" == g) {
            if ("select" == b) {
              h = m;
              return;
            }
            "option" == b && h == m && (p = "selected ");
          }
          return `${p}${g}="${Wa(m)}"`;
        }
      }
    }
  }).filter(Boolean), I:k, w:h};
};
const ab = [], bb = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, cb = /^(a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/, eb = (a, b = {}) => {
  const c = b.addDoctype, d = b.pretty;
  a = db(a, b, {});
  return c ? `<!doctype html>${d ? "\n" : ""}${a}` : a;
};
function db(a, b = {}, c = {}, d = !1, e = !1, f) {
  if (null == a || "boolean" == typeof a) {
    return "";
  }
  const {pretty:h = !1, shallow:k = !1, renderRootComponent:l = !1, shallowHighOrder:g = !1, sortAttributes:m, allAttributes:p, xml:n, initialPadding:q = 0, closeVoidTags:t = !1} = b;
  let {lineLength:v = 40} = b;
  v -= q;
  let {nodeName:r, attributes:F = {}} = a;
  var w = ["textarea", "pre"].includes(r);
  const da = " ".repeat(q), D = "string" == typeof h ? h : `  ${da}`;
  if ("object" != typeof a && !r) {
    return Wa(a);
  }
  if ("function" == typeof r) {
    if (!k || !d && l) {
      return w = Za(a), r.prototype && "function" == typeof r.prototype.render ? (a = new r(w, c), a._disable = a.__x = !0, a.props = w, a.context = c, r.getDerivedStateFromProps ? a.state = {...a.state, ...r.getDerivedStateFromProps(a.props, a.state)} : a.componentWillMount && a.componentWillMount(), w = a.render(a.props, a.state, a.context), a.getChildContext && (c = {...c, ...a.getChildContext()})) : w = r(w, c), db(w, b, c, g, e, f);
    }
    r = r.displayName || r !== Function && r.name || fb(r);
  }
  let x = "";
  ({K:N, I:d, w:f} = $a(F, r, {allAttributes:p, xml:n, J:e, sort:m, w:f}));
  if (h) {
    let G = `<${r}`.length;
    x = N.reduce((K, u) => {
      const A = G + 1 + u.length;
      if (A > v) {
        return G = D.length, `${K}\n${D}${u}`;
      }
      G = A;
      return `${K} ${u}`;
    }, "");
  } else {
    x = N.length ? " " + N.join(" ") : "";
  }
  x = `<${r}${x}>`;
  if (`${r}`.match(/[\s\n\\/='"\0<>]/)) {
    throw x;
  }
  var N = `${r}`.match(bb);
  t && N && (x = x.replace(/>$/, " />"));
  let L = [];
  if (d) {
    !w && h && (Xa(d) || d.length + gb(x) > v) && (d = "\n" + D + `${d}`.replace(/(\n+)/g, "$1" + (D || "\t"))), x += d;
  } else {
    if (a.children) {
      let G = h && x.includes("\n");
      const K = [];
      L = a.children.map((u, A) => {
        if (null != u && !1 !== u) {
          var C = db(u, b, c, !0, "svg" == r ? !0 : "foreignObject" == r ? !1 : e, f);
          if (C) {
            h && C.length + gb(x) > v && (G = !0);
            if ("string" == typeof u.nodeName) {
              const y = C.replace(new RegExp(`</${u.nodeName}>$`), "");
              hb(u.nodeName, y) && (K[A] = C.length);
            }
            return C;
          }
        }
      }).filter(Boolean);
      h && G && !w && (L = L.reduce((u, A, C) => {
        var y = (C = K[C - 1]) && /^<([\s\S]+?)>/.exec(A);
        y && ([, y] = y, y = !cb.test(y));
        if (C && !y) {
          y = /[^<]*?(\s)/y;
          var J;
          let V = !0, O;
          for (; null !== (J = y.exec(A));) {
            const [P] = J;
            [, O] = J;
            y.lastIndex + P.length - 1 > v - (V ? C : 0) && (J = A.slice(0, y.lastIndex - 1), A = A.slice(y.lastIndex), V ? (u.push(J), V = !1) : u.push("\n" + D + `${J}`.replace(/(\n+)/g, "$1" + (D || "\t"))), y.lastIndex = 0);
          }
          O && u.push(O);
          u.push(A);
        } else {
          u.push("\n" + D + `${A}`.replace(/(\n+)/g, "$1" + (D || "\t")));
        }
        return u;
      }, []));
    }
  }
  if (L.length) {
    x += L.join("");
  } else {
    if (n) {
      return x.substring(0, x.length - 1) + " />";
    }
  }
  N || (!hb(r, L[L.length - 1]) && !w && h && x.includes("\n") && (x += `\n${da}`), x += `</${r}>`);
  return x;
}
const hb = (a, b) => `${a}`.match(cb) && (b ? !/>$/.test(b) : !0);
function fb(a) {
  var b = (Function.prototype.toString.call(a).match(/^\s*function\s+([^( ]+)/) || "")[1];
  if (!b) {
    b = -1;
    for (let c = ab.length; c--;) {
      if (ab[c] === a) {
        b = c;
        break;
      }
    }
    0 > b && (b = ab.push(a) - 1);
    b = `UnnamedComponent${b}`;
  }
  return b;
}
const gb = a => {
  a = a.split("\n");
  return a[a.length - 1].length;
};
function jb(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const b = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return b && a;
}
const kb = (a, b) => {
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
function lb(a, b) {
  function c() {
    return b.filter(jb).reduce((d, {re:e, replacement:f}) => {
      if (this.j) {
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
            return this.j ? k : f.call(this, k, ...l);
          } catch (g) {
            kb(h, g);
          }
        });
      }
    }, `${a}`);
  }
  c.g = () => {
    c.j = !0;
  };
  return c.call(c);
}
;const mb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), nb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function ob(a, b) {
  return pb(a, b);
}
class qb extends ua {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(jb);
    this.j = !1;
    this.s = b;
  }
  async replace(a, b) {
    const c = new qb(this.g, this.s);
    b && Object.assign(c, b);
    a = await ob(c, a);
    c.j && (this.j = !0);
    b && Object.keys(b).forEach(d => {
      b[d] = c[d];
    });
    return a;
  }
  async reduce(a) {
    return await this.g.reduce(async(b, {re:c, replacement:d}) => {
      b = await b;
      if (this.j) {
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
            if (this.j) {
              return e.length ? e.push(Promise.resolve(k)) : k;
            }
            const g = d.call(this, k, ...l);
            g instanceof Promise && e.push(g);
            return g;
          } catch (g) {
            kb(f, g);
          }
        });
        if (e.length) {
          try {
            const k = await Promise.all(e);
            b = b.replace(c, () => k.shift());
          } catch (k) {
            kb(f, k);
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
      a = qa(d.stack), d.stack = a, c(d);
    }
  }
}
async function pb(a, b) {
  b instanceof sa ? b.pipe(a) : a.end(b);
  return await ya(a);
}
;const rb = a => {
  a = `(${a.join("|")})`;
  return new RegExp(`(\\n)?( *)(<${a}${"(?:\\s+(?!\\/>)[^>]*?)?"}(?:\\s*?/>|>[\\s\\S]*?<\\/\\4>))`, "gm");
};
var sb = tty;
const tb = util.debuglog, ub = util.format, vb = util.inspect;
/*

 Copyright (c) 2016 Zeit, Inc.
 https://npmjs.org/ms
*/
function wb(a) {
  var b = {}, c = typeof a;
  if ("string" == c && 0 < a.length) {
    return xb(a);
  }
  if ("number" == c && isFinite(a)) {
    return b.S ? (b = Math.abs(a), a = 864E5 <= b ? yb(a, b, 864E5, "day") : 36E5 <= b ? yb(a, b, 36E5, "hour") : 6E4 <= b ? yb(a, b, 6E4, "minute") : 1000 <= b ? yb(a, b, 1000, "second") : a + " ms") : (b = Math.abs(a), a = 864E5 <= b ? Math.round(a / 864E5) + "d" : 36E5 <= b ? Math.round(a / 36E5) + "h" : 6E4 <= b ? Math.round(a / 6E4) + "m" : 1000 <= b ? Math.round(a / 1000) + "s" : a + "ms"), a;
  }
  throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(a));
}
function xb(a) {
  a = String(a);
  if (!(100 < a.length) && (a = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(a))) {
    var b = parseFloat(a[1]);
    switch((a[2] || "ms").toLowerCase()) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return 315576E5 * b;
      case "weeks":
      case "week":
      case "w":
        return 6048E5 * b;
      case "days":
      case "day":
      case "d":
        return 864E5 * b;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return 36E5 * b;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return 6E4 * b;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return 1000 * b;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return b;
    }
  }
}
function yb(a, b, c, d) {
  return Math.round(a / c) + " " + d + (b >= 1.5 * c ? "s" : "");
}
;/*
 bytes
 Copyright(c) 2012-2014 TJ Holowaychuk
 Copyright(c) 2015 Jed Watson
 MIT Licensed
*/
const zb = /\B(?=(\d{3})+(?!\d))/g, Ab = /(?:\.0*|(\.[^0]+)0+)$/, R = {b:1, kb:1024, mb:1048576, gb:1073741824, tb:Math.pow(1024, 4), pb:Math.pow(1024, 5)};
function U(a, b) {
  if (!Number.isFinite(a)) {
    return null;
  }
  const c = Math.abs(a), d = b && b.T || "", e = b && b.V || "", f = b && void 0 !== b.G ? b.G : 2, h = !(!b || !b.P);
  (b = b && b.U || "") && R[b.toLowerCase()] || (b = c >= R.pb ? "PB" : c >= R.tb ? "TB" : c >= R.gb ? "GB" : c >= R.mb ? "MB" : c >= R.kb ? "KB" : "B");
  a = (a / R[b.toLowerCase()]).toFixed(f);
  h || (a = a.replace(Ab, "$1"));
  d && (a = a.replace(zb, d));
  return a + e + b;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function Bb(a, b, c) {
  let d = a[a.length - 1];
  d && d.l === b && d.u === c ? a[a.length - 1] = {count:d.count + 1, l:b, u:c} : a.push({count:1, l:b, u:c});
}
function Cb(a, b, c, d, e) {
  let f = c.length, h = d.length, k = b.i;
  e = k - e;
  let l = 0;
  for (; k + 1 < f && e + 1 < h && a.equals(c[k + 1], d[e + 1]);) {
    k++, e++, l++;
  }
  l && b.m.push({count:l});
  b.i = k;
  return e;
}
function Db(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
class Eb {
  diff(a, b) {
    a = Db(a.split(""));
    b = Db(b.split(""));
    let c = b.length, d = a.length, e = 1, f = c + d, h = [{i:-1, m:[]}];
    var k = Cb(this, h[0], b, a, 0);
    if (h[0].i + 1 >= c && k + 1 >= d) {
      return [{value:this.join(b), count:b.length}];
    }
    for (; e <= f;) {
      a: {
        for (k = -1 * e; k <= e; k += 2) {
          var l = h[k - 1];
          let m = h[k + 1];
          var g = (m ? m.i : 0) - k;
          l && (h[k - 1] = void 0);
          let p = l && l.i + 1 < c;
          g = m && 0 <= g && g < d;
          if (p || g) {
            !p || g && l.i < m.i ? (l = {i:m.i, m:m.m.slice(0)}, Bb(l.m, void 0, !0)) : (l.i++, Bb(l.m, !0, void 0));
            g = Cb(this, l, b, a, k);
            if (l.i + 1 >= c && g + 1 >= d) {
              k = Fb(this, l.m, b, a);
              break a;
            }
            h[k] = l;
          } else {
            h[k] = void 0;
          }
        }
        e++;
        k = void 0;
      }
      if (k) {
        return k;
      }
    }
  }
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function Fb(a, b, c, d) {
  let e = 0, f = b.length, h = 0, k = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.u) {
      l.value = a.join(d.slice(k, k + l.count)), k += l.count, e && b[e - 1].l && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.l) {
        l.value = a.join(c.slice(h, h + l.count));
      } else {
        let g = c.slice(h, h + l.count);
        g = g.map(function(m, p) {
          p = d[k + p];
          return p.length > m.length ? p : m;
        });
        l.value = a.join(g);
      }
      h += l.count;
      l.l || (k += l.count);
    }
  }
  c = b[f - 1];
  1 < f && "string" === typeof c.value && (c.l || c.u) && a.equals("", c.value) && (b[f - 2].value += c.value, b.pop());
  return b;
}
;const Gb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Hb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function W(a, b) {
  return (b = Gb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Ib(a, b) {
  return (b = Hb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;var Jb = {f:U, ["fy"](a) {
  return W(U(a) || "", "yellow");
}, ["fr"](a) {
  return W(U(a) || "", "red");
}, ["fb"](a) {
  return W(U(a) || "", "blue");
}, ["fg"](a) {
  return W(U(a) || "", "green");
}, ["fc"](a) {
  return W(U(a) || "", "cyan");
}, ["fm"](a) {
  return W(U(a) || "", "magenta");
}};
const Kb = Object.keys(process.env).filter(a => /^debug_/i.test(a)).reduce((a, b) => {
  const c = b.substring(6).toLowerCase().replace(/_([a-z])/g, (d, e) => e.toUpperCase());
  b = process.env[b];
  /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : "null" === b ? b = null : b = Number(b);
  a[c] = b;
  return a;
}, {}), Lb = {init:function(a) {
  a.inspectOpts = {...Kb};
}, log:function(...a) {
  return process.stderr.write(ub(...a) + "\n");
}, formatArgs:function(a) {
  var b = this.namespace, c = this.color;
  const d = this.diff;
  this.useColors ? (c = "\u001b[3" + (8 > c ? c : "8;5;" + c), b = `  ${c};1m${b} \u001B[0m`, a[0] = b + a[0].split("\n").join("\n" + b), a.push(c + "m+" + wb(d) + "\u001b[0m")) : a[0] = (Kb.hideDate ? "" : (new Date).toISOString() + " ") + b + " " + a[0];
}, save:function(a) {
  a ? process.env.DEBUG = a : delete process.env.DEBUG;
}, load:function() {
  return process.env.DEBUG;
}, useColors:function() {
  return "colors" in Kb ? !!Kb.colors : sb.isatty(process.stderr.fd);
}, colors:[6, 2, 3, 4, 5, 1], inspectOpts:Kb, formatters:{o:function(a) {
  return vb(a, {...this.inspectOpts, colors:this.useColors}).replace(/\s*\n\s*/g, " ");
}, O:function(a) {
  return vb(a, {...this.inspectOpts, colors:this.useColors});
}, ...Jb}};
function Mb(a) {
  function b(...h) {
    if (b.enabled) {
      var k = Number(new Date);
      b.diff = k - (f || k);
      b.prev = f;
      f = b.curr = k;
      h[0] = Nb(h[0]);
      "string" != typeof h[0] && h.unshift("%O");
      var l = 0;
      h[0] = h[0].replace(/%([a-zA-Z%]+)/g, (g, m) => {
        if ("%%" == g) {
          return g;
        }
        l++;
        if (m = c[m]) {
          g = m.call(b, h[l]), h.splice(l, 1), l--;
        }
        return g;
      });
      d.call(b, h);
      (b.log || e).apply(b, h);
    }
  }
  const c = a.formatters, d = a.formatArgs, e = a.log;
  let f;
  return b;
}
function Ob(a) {
  const b = Mb(a);
  "function" == typeof a.init && a.init(b);
  a.g.push(b);
  return b;
}
function Pb(a, b) {
  let c = 0;
  for (let d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d), c |= 0;
  }
  return a.colors[Math.abs(c) % a.colors.length];
}
function Qb(a) {
  var b = Lb.load();
  a.save(b);
  a.s = [];
  a.v = [];
  let c;
  const d = ("string" == typeof b ? b : "").split(/[\s,]+/), e = d.length;
  for (c = 0; c < e; c++) {
    d[c] && (b = d[c].replace(/\*/g, ".*?"), "-" == b[0] ? a.v.push(new RegExp("^" + b.substr(1) + "$")) : a.s.push(new RegExp("^" + b + "$")));
  }
  for (c = 0; c < a.g.length; c++) {
    b = a.g[c], b.enabled = a.enabled(b.namespace);
  }
}
class Rb {
  constructor(a) {
    this.colors = a.colors;
    this.formatArgs = a.formatArgs;
    this.inspectOpts = a.inspectOpts;
    this.log = a.log;
    this.save = a.save;
    this.init = a.init;
    this.formatters = a.formatters || {};
    this.g = [];
    this.s = [];
    this.v = [];
  }
  destroy(a) {
    a = this.g.indexOf(a);
    return -1 !== a ? (this.g.splice(a, 1), !0) : !1;
  }
  enabled(a) {
    if ("*" == a[a.length - 1]) {
      return !0;
    }
    let b, c;
    b = 0;
    for (c = this.v.length; b < c; b++) {
      if (this.v[b].test(a)) {
        return !1;
      }
    }
    b = 0;
    for (c = this.s.length; b < c; b++) {
      if (this.s[b].test(a)) {
        return !0;
      }
    }
    return !1;
  }
}
function Nb(a) {
  return a instanceof Error ? a.stack || a.message : a;
}
;const Sb = _crypto.createHash;
require("./init");
require("./make-io");
require("./start");
require("./preact-proxy");
require("./start-plain");
var Tb;
Tb = function() {
  const a = new Rb(Lb);
  return function(b) {
    const c = Ob(a);
    c.namespace = b;
    c.useColors = Lb.useColors();
    c.enabled = a.enabled(b);
    c.color = Pb(a, b);
    c.destroy = function() {
      a.destroy(this);
    };
    c.extend = function(d, e) {
      d = this.namespace + (void 0 === e ? ":" : e) + d;
      d.log = this.log;
      return d;
    };
    Qb(a);
    return c;
  };
}()("competent");
const Ub = (a, b) => {
  let c;
  "string" == typeof a ? c = a : Array.isArray(a) ? c = a.map(d => "string" == typeof d ? d : eb(d, b)).join("\n") : c = eb(a, b);
  return c;
}, Wb = async({getReplacements:a, key:b, D:c, re:d, replacement:e, getContext:f, A:h, position:k, body:l}) => {
  let g;
  a ? g = a(b, c) : c ? g = {re:Vb(d, b), replacement:e} : g = {re:d, replacement:e};
  a = new qb(g);
  f && (b = f(h, {position:k, key:b}), Object.assign(a, b));
  return await ob(a, l);
}, Vb = (a, b) => new RegExp(a.source.replace(new RegExp(`([|(])${b}([|)])`), (c, d, e) => "|" == d && "|" == e ? "|" : ")" == e ? e : "(" == d ? d : ""), a.flags);
const Xb = async a => {
  try {
    return await I(B, a);
  } catch (b) {
    return null;
  }
};
const Z = async(a, b) => {
  b && (b = M(b), a = Q(b, a));
  var c = await Xb(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await Yb(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await Yb(a), c = !0);
      if (!e) {
        b = await Yb(Q(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? Ca("", b) : b, R:d};
}, Yb = async a => {
  a = `${a}.js`;
  let b = await Xb(a);
  b || (a = `${a}x`);
  if (b = await Xb(a)) {
    return a;
  }
};
const Zb = child_process.fork, $b = child_process.spawn;
const ac = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", h => {
      e(h);
    });
  }), a.stdout ? ya(a.stdout) : void 0, a.stderr ? ya(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const bc = (a, b) => a.some(c => c == b), cc = (a, b) => {
  const c = bc(a, "index.md"), d = bc(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, h) => {
    f = f.localeCompare(h, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const dc = tb("pedantry"), fc = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:h, ignoreHidden:k}) => {
  var l = Object.keys(d);
  l = await cc(l, e).reduce(async(g, m) => {
    g = await g;
    const {type:p, content:n} = d[m], q = Q(c, m);
    let t;
    "File" == p ? k && m.startsWith(".") || (t = await ec({stream:a, source:b, path:q, separator:f, includeFilename:h})) : "Directory" == p && (t = await fc({stream:a, source:b, path:q, content:n, reverse:e, separator:f, includeFilename:h, ignoreHidden:k}));
    return g + t;
  }, 0);
  dc("dir %s size: %s B", c, l);
  return l;
}, ec = async a => {
  const b = a.stream, c = a.path, d = a.separator, e = a.includeFilename, f = Q(a.source, c);
  b.emit("file", c);
  d && !b.B && (e ? b.push({file:"separator", data:d}) : b.push(d));
  a = await new Promise((h, k) => {
    let l = 0;
    const g = aa(f);
    g.on("data", m => {
      l += m.byteLength;
    }).on("error", m => {
      k(m);
    }).on("close", () => {
      h(l);
    });
    if (e) {
      g.on("data", m => {
        b.push({file:f, data:`${m}`});
      });
    } else {
      g.pipe(b, {end:!1});
    }
  });
  b.B = !1;
  dc("file %s :: %s B", f, a);
  return a;
};
class gc extends ta {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:h = !1} = b;
    super({objectMode:f});
    let k;
    d ? k = "\n" : e && (k = "\n\n");
    this.B = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await Ka(a));
      } catch (g) {
        this.emit("error", Error(g.message));
      }
      try {
        await fc({stream:this, source:a, content:l, reverse:c, separator:k, includeFilename:f, ignoreHidden:h});
      } catch (g) {
        this.emit("error", g);
      } finally {
        this.end();
      }
    })();
  }
}
;const hc = _module.builtinModules;
const ic = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, jc = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, kc = /^ *import\s+(['"])(.+?)\1/gm, lc = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, mc = a => [ic, jc, kc, lc].reduce((b, c) => {
  c = Oa(c, a, ["q", "from"]).map(d => d.from);
  return [...b, ...c];
}, []);
const oc = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = Q(a, "node_modules", b);
  f = Q(f, "package.json");
  const h = await Xb(f);
  if (h) {
    a = await nc(f, d);
    if (void 0 === a) {
      throw Error(`The package ${Ca("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:k, version:l, packageName:g, main:m, entryExists:p, ...n} = a;
    return {entry:Ca("", k), packageJson:Ca("", f), ...l ? {version:l} : {}, packageName:g, ...m ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...n};
  }
  if ("/" == a && !h) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return oc(Q(Da(a), ".."), b, c);
}, nc = async(a, b = []) => {
  const c = await za(a);
  let d, e, f, h, k;
  try {
    ({module:d, version:e, name:f, main:h, ...k} = JSON.parse(c)), k = b.reduce((g, m) => {
      g[m] = k[m];
      return g;
    }, {});
  } catch (g) {
    throw Error(`Could not parse ${a}.`);
  }
  a = M(a);
  b = d || h;
  if (!b) {
    if (!await Xb(Q(a, "index.js"))) {
      return;
    }
    b = h = "index.js";
  }
  a = Q(a, b);
  let l;
  try {
    ({path:l} = await Z(a)), a = l;
  } catch (g) {
  }
  return {entry:a, version:e, packageName:f, main:!d && h, entryExists:!!l, ...k};
};
const pc = a => /^[./]/.test(a), qc = async(a, b, c, d, e = null) => {
  const f = H(), h = M(a);
  b = b.map(async k => {
    if (hc.includes(k)) {
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
        let [p, n, ...q] = k.split("/");
        !p.startsWith("@") && n ? (q = [n, ...q], n = p) : n = p.startsWith("@") ? `${p}/${n}` : p;
        l = {name:n, paths:q.join("/")};
      }
      const {name:g, paths:m} = l;
      if (m) {
        const {packageJson:p, packageName:n} = await oc(h, g);
        k = M(p);
        ({path:k} = await Z(Q(k, m)));
        return {entry:k, package:n};
      }
    }
    try {
      const {entry:g, packageJson:m, version:p, packageName:n, hasMain:q, ...t} = await oc(h, k, {fields:d});
      return n == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", n, a), null) : {entry:g, packageJson:m, version:p, name:n, ...q ? {hasMain:q} : {}, ...t};
    } catch (g) {
      if (c) {
        return null;
      }
      throw f(g);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, sc = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], L:h = {}, mergeSameNodeModules:k = !0, package:l} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var g = await za(a), m = mc(g);
  g = rc(g);
  m = c ? m : m.filter(pc);
  g = c ? g : g.filter(pc);
  try {
    const n = await qc(a, m, e, f, l), q = await qc(a, g, e, f, l);
    q.forEach(t => {
      t.required = !0;
    });
    var p = [...n, ...q];
  } catch (n) {
    throw n.message = `${a}\n [!] ${n.message}`, n;
  }
  l = k ? p.map(n => {
    var q = n.name, t = n.version;
    const v = n.required;
    if (q && t) {
      q = `${q}:${t}${v ? "-required" : ""}`;
      if (t = h[q]) {
        return t;
      }
      h[q] = n;
    }
    return n;
  }) : p;
  p = l.map(n => ({...n, from:a}));
  return await l.filter(({entry:n}) => n && !(n in b)).reduce(async(n, {entry:q, hasMain:t, packageJson:v, name:r, package:F}) => {
    if (v && d) {
      return n;
    }
    n = await n;
    r = (await sc(q, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:r || F, L:h, mergeSameNodeModules:k})).map(w => ({...w, from:w.from ? w.from : q, ...!w.packageJson && t ? {hasMain:t} : {}}));
    return [...n, ...r];
  }, p);
}, rc = a => Oa(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const tc = async a => {
  const b = H();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async l => {
    ({path:l} = await Z(l));
    return l;
  }));
  const {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], mergeSameNodeModules:h = !0} = {shallow:!0, soft:!0};
  let k;
  try {
    const l = {};
    k = await a.reduce(async(g, m) => {
      g = await g;
      m = await sc(m, l, {nodeModules:c, shallow:d, soft:e, fields:f, mergeSameNodeModules:h});
      g.push(...m);
      return g;
    }, []);
  } catch (l) {
    throw b(l);
  }
  return k.filter(({internal:l, entry:g}, m) => l ? k.findIndex(({internal:p}) => p == l) == m : k.findIndex(({entry:p}) => g == p) == m).map(l => {
    const g = l.entry, m = l.internal, p = k.filter(({internal:n, entry:q}) => {
      if (m) {
        return m == n;
      }
      if (g) {
        return g == q;
      }
    }).map(({from:n}) => n).filter((n, q, t) => t.indexOf(n) == q);
    return {...l, from:p};
  }).map(({package:l, ...g}) => l ? {package:l, ...g} : g);
};
const vc = (a, b, c = console.log) => {
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
    const {entry:h, C:k} = uc(f);
    c(W("+", "green"), h, k);
  });
  e.forEach(f => {
    const {entry:h, C:k} = uc(f);
    c(W("-", "red"), h, k);
  });
  return !1;
}, uc = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, C:a};
}, wc = async a => (await I(B, a)).mtime.getTime(), xc = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await wc(b);
  return `${b} ${c}`;
})), yc = async a => {
  const b = await tc(a), c = await xc(b);
  ({path:a} = await Z(a));
  return {mtime:await wc(a), hash:c, N:b};
};
const zc = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({promise:c} = new xa({rs:b}));
    const d = await c;
    await new Promise((e, f) => {
      ba(a).once("error", f).end(d, e);
    });
  } else {
    await new Promise((d, e) => {
      const f = ba(a);
      b.pipe(f);
      f.once("error", e).on("close", d);
    });
  }
};
module.exports = {competent:(a, b = {}) => {
  async function c(n, q, t, v, r, F, w) {
    Tb("render %s", r);
    const da = Error("Skip render");
    try {
      const D = a[r], x = w.slice(0, F), N = w.slice(F + n.length);
      if (/\x3c!--\s*$/.test(x) && /^\s*--\x3e/.test(N)) {
        return n;
      }
      const [{content:L = "", props:G}] = Sa(r, v);
      v = [L];
      let K = !1, u = !0, A = !1;
      const C = {pretty:void 0, lineLength:void 0};
      let y, J, V, O;
      const P = e.call(this, {...G, children:v}, {export(z = !0, E = null) {
        K = z;
        E && (O = Object.entries(E).reduce((S, [T, ib]) => {
          if (void 0 === ib) {
            return S;
          }
          S[T] = ib;
          return S;
        }, {}));
      }, setPretty(z, E) {
        C.pretty = z;
        E && (C.lineLength = E);
      }, renderAgain(z = !0, E = !1) {
        u = z;
        A = E;
      }, setChildContext(z) {
        J = z;
      }, removeLine(z = !0) {
        V = z;
      }, skipRender() {
        throw da;
      }}, r, F, w);
      let X;
      try {
        const z = D.call(this, P);
        X = z instanceof Promise ? await z : z;
      } catch (z) {
        if (!z.message.startsWith("Class constructor")) {
          throw z;
        }
        const E = new D, S = E.serverRender ? E.serverRender(P) : E.render(P);
        X = S instanceof Promise ? await S : S;
        if (E.fileRender) {
          let T = await E.render(P);
          T = Ub(T, C);
          u && (T = await Wb({getContext:g.bind(this), getReplacements:m.bind(this), key:r, D:A, re:p, replacement:c, A:J, body:T}));
          await E.fileRender(T, P);
        }
      }
      if (K) {
        const z = Array.isArray(X) ? X[0] : X;
        y = z.attributes.id;
        y || (y = d.call(this, r, O || G), z.attributes.id = y);
      }
      let Y = Ub(X, C);
      if (!Y && V) {
        return h && h.call(this, r, G), "";
      }
      Y = (q || "") + Y.replace(/^/gm, t);
      u && (Y = await Wb({getContext:g ? g.bind(this) : void 0, getReplacements:m ? m.bind(this) : void 0, key:r, D:A, re:p, replacement:c, A:J, body:Y, position:F}));
      K && f.call(this, r, y, O || G, v);
      h && h.call(this, r, G);
      return Y;
    } catch (D) {
      if (D === da) {
        return n;
      }
      k && k.call(this, r, D, F, w);
      return l ? "" : n;
    }
  }
  const {getId:d, getProps:e = (n, q) => ({...n, ...q}), markExported:f, onSuccess:h, onFail:k, removeOnError:l = !1, getContext:g, getReplacements:m} = b, p = rb(Object.keys(a));
  return {re:p, replacement:c};
}, c:W, b:Ib, readDirStructure:Ka, clone:async(a, b) => {
  const c = await I(B, a), d = Ba(a);
  b = Q(b, d);
  c.isDirectory() ? await Na(a, b) : c.isSymbolicLink() ? await Ma(a, b) : (await Ea(b), await La(a, b));
}, Pedantry:gc, whichStream:async function(a) {
  const b = a.source, c = a.destination;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = aa(b));
  "-" == c ? d.pipe(process.stdout) : c ? await zc(c, d, b) : e instanceof va && (d.pipe(e), await new Promise((f, h) => {
    e.on("error", h);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await yc(a);
  a = Sb("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const f = b.mtime;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : vc(b.hash, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
}, ensurePath:Ea, ensurePathSync:function(a) {
  const b = M(a);
  try {
    return Ga(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}, read:za, replace:pb, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [h] = a.reduce(([g = 0, m = 0], p) => {
    const n = b[p].split("\n").reduce((q, t) => t.length > q ? t.length : q, 0);
    n > m && (m = n);
    p.length > g && (g = p.length);
    return [g, m];
  }, []), k = (g, m) => {
    m = " ".repeat(m - g.length);
    return `${g}${m}`;
  };
  a = a.reduce((g, m, p) => {
    p = f[p].split("\n");
    m = k(m, h);
    const [n, ...q] = p;
    m = `${m}\t${n}`;
    const t = k("", h);
    p = q.map(v => `${t}\t${v}`);
    return [...g, m, ...p];
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
  a = $b(a, b, c);
  b = ac(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = Zb(a, b, c);
  b = ac(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:lb, Replaceable:qb, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = nb, getRegex:h = mb} = b || {}, k = h(d);
    e = {name:d, re:e, regExp:k, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...c, [d]:e};
}, {}), makeCutRule:a => {
  const b = a.map, c = a.getReplacement, d = a.name;
  return {re:a.re, replacement(e) {
    const f = a.lastIndex;
    b[f] = e;
    a.lastIndex += 1;
    return c(d, f);
  }};
}, makePasteRule:(a, b = []) => {
  const c = a.map;
  return {re:a.regExp, replacement(d, e) {
    d = c[e];
    delete c[e];
    e = Array.isArray(b) ? b : [b];
    return lb(d, e);
  }};
}, resolveDependency:Z, rexml:Sa, reduceUsage:a => Object.keys(a).reduce((b, c) => {
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
  const c = H(!0), d = ba(a);
  await new Promise((e, f) => {
    d.on("error", h => {
      h = c(h);
      f(h);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = Ua(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((h, [k, l]) => {
    h[k] = "string" == typeof l ? {short:l} : l;
    return h;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((h, [k, l]) => {
    let g;
    try {
      const m = l.short, p = l.boolean, n = l.number, q = l.command, t = l.multiple;
      if (q && t && d.length) {
        g = d;
      } else {
        if (q && d.length) {
          g = d[0];
        } else {
          const v = Ta(c, k, m, p, n);
          ({value:g} = v);
          const r = v.index, F = v.length;
          void 0 !== r && F && e.push({index:r, length:F});
        }
      }
    } catch (m) {
      return h;
    }
    return void 0 === g ? h : {...h, [k]:g};
  }, {});
  let f = c;
  e.forEach(({index:h, length:k}) => {
    Array.from({length:k}).forEach((l, g) => {
      f[h + g] = null;
    });
  });
  f = f.filter(h => null !== h);
  Object.assign(a, {M:f});
  return a;
}, Catchment:xa, collect:ya, clearr:a => a.split("\n").map(b => {
  b = b.split("\r");
  return b.reduce((c, d, e) => {
    if (!e) {
      return c;
    }
    c = c.slice(d.length);
    return `${d}${c}`;
  }, b[0]);
}).join("\n"), erte:function(a, b) {
  return (new Eb).diff(a, b).map(({l:c, u:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => W(h, "green")).join(Ib(" ", "green")) : d ? f.map(h => h.replace(/\n$/mg, "\u23ce\n")).map(h => W(h, "red")).join(Ib(" ", "red")) : W(e, "grey");
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
}, makepromise:I, mismatch:Oa};


//# sourceMappingURL=index.js.map