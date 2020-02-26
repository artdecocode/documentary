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
  }).filter(f => f.trim()).map(f => b ? f.replace(na, (g, k) => g.replace(k, k.replace(pa, "~"))) : f).join("\n");
};
function ra(a, b, c = !1) {
  return function(d) {
    var e = la(arguments), {stack:f} = Error();
    const g = ja(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
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
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {H:e = H(!0), proxyError:f} = a || {}, g = (k, l) => e(l);
    super(d);
    this.g = [];
    this.F = new Promise((k, l) => {
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
          const m = qa(h.stack);
          h.stack = m;
          f && g`${h}`;
        }
        l(h);
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
;async function I(a, b, c) {
  const d = H(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((e, f) => {
    const g = (l, h) => l ? (l = d(l), f(l)) : e(c || h);
    let k = [g];
    Array.isArray(b) ? k = [...b, g] : 1 < Array.from(arguments).length && (k = [b, g]);
    a(...k);
  });
}
;const Aa = path.basename, M = path.dirname, Q = path.join, Ba = path.parse, Ca = path.relative, Da = path.resolve;
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
    var g = f.lstat.isDirectory() ? "Directory" : f.lstat.isFile() ? "File" : f.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [f.relativePath]:{type:g}};
  }, {});
  b = await b.reduce(async(e, {path:f, relativePath:g}) => {
    const k = Ca(a, f);
    if (c.includes(k)) {
      return e;
    }
    e = await e;
    f = await Ka(f);
    return {...e, [g]:f};
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
    const {type:f} = c[e], g = Q(a, e);
    e = Q(b, e);
    "Directory" == f ? await Na(g, e) : "File" == f ? await La(g, e) : "SymbolicLink" == f && await Ma(g, e);
  });
  await Promise.all(d);
};
function Oa(a, b, c, d = !1) {
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
  b = a.findIndex(g => f.test(g));
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
;const $a = (a, b, {allAttributes:c, xml:d, J:e, sort:f, w:g} = {}) => {
  let k;
  const l = Object.keys(a);
  f && l.sort();
  return {K:l.map(h => {
    var m = a[h];
    if ("children" != h && !h.match(/[\s\n\\/='"\0<>]/) && (c || !["key", "ref"].includes(h))) {
      if ("className" == h) {
        if (a.class) {
          return;
        }
        h = "class";
      } else {
        if ("htmlFor" == h) {
          if (a.for) {
            return;
          }
          h = "for";
        } else {
          if ("srcSet" == h) {
            if (a.srcset) {
              return;
            }
            h = "srcset";
          }
        }
      }
      e && h.match(/^xlink:?./) && (h = h.toLowerCase().replace(/^xlink:?/, "xlink:"));
      if ("style" == h && m && "object" == typeof m) {
        {
          let n = "";
          for (var p in m) {
            let q = m[p];
            null != q && (n && (n += " "), n += Ya[p] || (Ya[p] = p.replace(/([A-Z])/g, "-$1").toLowerCase()), n += ": ", n += q, "number" == typeof q && !1 === Va.test(p) && (n += "px"), n += ";");
          }
          m = n || void 0;
        }
      }
      if ("dangerouslySetInnerHTML" == h) {
        k = m && m.__html;
      } else {
        if ((m || 0 === m || "" === m) && "function" != typeof m) {
          if (!0 === m || "" === m) {
            if (m = h, !d) {
              return h;
            }
          }
          p = "";
          if ("value" == h) {
            if ("select" == b) {
              g = m;
              return;
            }
            "option" == b && g == m && (p = "selected ");
          }
          return `${p}${h}="${Wa(m)}"`;
        }
      }
    }
  }).filter(Boolean), I:k, w:g};
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
  const {pretty:g = !1, shallow:k = !1, renderRootComponent:l = !1, shallowHighOrder:h = !1, sortAttributes:m, allAttributes:p, xml:n, initialPadding:q = 0, closeVoidTags:t = !1} = b;
  let {lineLength:v = 40} = b;
  v -= q;
  let {nodeName:r, attributes:F = {}} = a;
  var w = ["textarea", "pre"].includes(r);
  const da = " ".repeat(q), D = "string" == typeof g ? g : `  ${da}`;
  if ("object" != typeof a && !r) {
    return Wa(a);
  }
  if ("function" == typeof r) {
    if (!k || !d && l) {
      return w = Za(a), r.prototype && "function" == typeof r.prototype.render ? (a = new r(w, c), a._disable = a.__x = !0, a.props = w, a.context = c, r.getDerivedStateFromProps ? a.state = {...a.state, ...r.getDerivedStateFromProps(a.props, a.state)} : a.componentWillMount && a.componentWillMount(), w = a.render(a.props, a.state, a.context), a.getChildContext && (c = {...c, ...a.getChildContext()})) : w = r(w, c), db(w, b, c, h, e, f);
    }
    r = r.displayName || r !== Function && r.name || fb(r);
  }
  let x = "";
  ({K:N, I:d, w:f} = $a(F, r, {allAttributes:p, xml:n, J:e, sort:m, w:f}));
  if (g) {
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
    !w && g && (Xa(d) || d.length + gb(x) > v) && (d = "\n" + D + `${d}`.replace(/(\n+)/g, "$1" + (D || "\t"))), x += d;
  } else {
    if (a.children) {
      let G = g && x.includes("\n");
      const K = [];
      L = a.children.map((u, A) => {
        if (null != u && !1 !== u) {
          var C = db(u, b, c, !0, "svg" == r ? !0 : "foreignObject" == r ? !1 : e, f);
          if (C) {
            g && C.length + gb(x) > v && (G = !0);
            if ("string" == typeof u.nodeName) {
              const y = C.replace(new RegExp(`</${u.nodeName}>$`), "");
              hb(u.nodeName, y) && (K[A] = C.length);
            }
            return C;
          }
        }
      }).filter(Boolean);
      g && G && !w && (L = L.reduce((u, A, C) => {
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
  N || (!hb(r, L[L.length - 1]) && !w && g && x.includes("\n") && (x += `\n${da}`), x += `</${r}>`);
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
        let g;
        return d.replace(e, (k, ...l) => {
          g = Error();
          try {
            return this.j ? k : f.call(this, k, ...l);
          } catch (h) {
            kb(g, h);
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
        const g = b.replace(c, (k, ...l) => {
          f = Error();
          try {
            if (this.j) {
              return e.length ? e.push(Promise.resolve(k)) : k;
            }
            const h = d.call(this, k, ...l);
            h instanceof Promise && e.push(h);
            return h;
          } catch (h) {
            kb(f, h);
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
  const c = Math.abs(a), d = b && b.T || "", e = b && b.V || "", f = b && void 0 !== b.G ? b.G : 2, g = !(!b || !b.P);
  (b = b && b.U || "") && R[b.toLowerCase()] || (b = c >= R.pb ? "PB" : c >= R.tb ? "TB" : c >= R.gb ? "GB" : c >= R.mb ? "MB" : c >= R.kb ? "KB" : "B");
  a = (a / R[b.toLowerCase()]).toFixed(f);
  g || (a = a.replace(Ab, "$1"));
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
  let f = c.length, g = d.length, k = b.i;
  e = k - e;
  let l = 0;
  for (; k + 1 < f && e + 1 < g && a.equals(c[k + 1], d[e + 1]);) {
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
    let c = b.length, d = a.length, e = 1, f = c + d, g = [{i:-1, m:[]}];
    var k = Cb(this, g[0], b, a, 0);
    if (g[0].i + 1 >= c && k + 1 >= d) {
      return [{value:this.join(b), count:b.length}];
    }
    for (; e <= f;) {
      a: {
        for (k = -1 * e; k <= e; k += 2) {
          var l = g[k - 1];
          let m = g[k + 1];
          var h = (m ? m.i : 0) - k;
          l && (g[k - 1] = void 0);
          let p = l && l.i + 1 < c;
          h = m && 0 <= h && h < d;
          if (p || h) {
            !p || h && l.i < m.i ? (l = {i:m.i, m:m.m.slice(0)}, Bb(l.m, void 0, !0)) : (l.i++, Bb(l.m, !0, void 0));
            h = Cb(this, l, b, a, k);
            if (l.i + 1 >= c && h + 1 >= d) {
              k = Fb(this, l.m, b, a);
              break a;
            }
            g[k] = l;
          } else {
            g[k] = void 0;
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
  let e = 0, f = b.length, g = 0, k = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.u) {
      l.value = a.join(d.slice(k, k + l.count)), k += l.count, e && b[e - 1].l && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.l) {
        l.value = a.join(c.slice(g, g + l.count));
      } else {
        let h = c.slice(g, g + l.count);
        h = h.map(function(m, p) {
          p = d[k + p];
          return p.length > m.length ? p : m;
        });
        l.value = a.join(h);
      }
      g += l.count;
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
  function b(...g) {
    if (b.enabled) {
      var k = Number(new Date);
      b.diff = k - (f || k);
      b.prev = f;
      f = b.curr = k;
      g[0] = Nb(g[0]);
      "string" != typeof g[0] && g.unshift("%O");
      var l = 0;
      g[0] = g[0].replace(/%([a-zA-Z%]+)/g, (h, m) => {
        if ("%%" == h) {
          return h;
        }
        l++;
        if (m = c[m]) {
          h = m.call(b, g[l]), g.splice(l, 1), l--;
        }
        return h;
      });
      d.call(b, g);
      (b.log || e).apply(b, g);
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
}, Wb = async({getReplacements:a, key:b, D:c, re:d, replacement:e, getContext:f, A:g, position:k, body:l}) => {
  let h;
  a ? h = a(b, c) : c ? h = {re:Vb(d, b), replacement:e} : h = {re:d, replacement:e};
  a = new qb(h);
  f && (b = f(g, {position:k, key:b}), Object.assign(a, b));
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
    a.on("error", f).on("exit", g => {
      e(g);
    });
  }), a.stdout ? ya(a.stdout) : void 0, a.stderr ? ya(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const bc = (a, b) => a.some(c => c == b), cc = (a, b) => {
  const c = bc(a, "index.md"), d = bc(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, g) => {
    f = f.localeCompare(g, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const dc = tb("pedantry"), fc = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:g, ignoreHidden:k}) => {
  var l = Object.keys(d);
  l = await cc(l, e).reduce(async(h, m) => {
    h = await h;
    const {type:p, content:n} = d[m], q = Q(c, m);
    let t;
    "File" == p ? k && m.startsWith(".") || (t = await ec({stream:a, source:b, path:q, separator:f, includeFilename:g})) : "Directory" == p && (t = await fc({stream:a, source:b, path:q, content:n, reverse:e, separator:f, includeFilename:g, ignoreHidden:k}));
    return h + t;
  }, 0);
  dc("dir %s size: %s B", c, l);
  return l;
}, ec = async a => {
  const b = a.stream, c = a.path, d = a.separator, e = a.includeFilename, f = Q(a.source, c);
  b.emit("file", c);
  d && !b.B && (e ? b.push({file:"separator", data:d}) : b.push(d));
  a = await new Promise((g, k) => {
    let l = 0;
    const h = aa(f);
    h.on("data", m => {
      l += m.byteLength;
    }).on("error", m => {
      k(m);
    }).on("close", () => {
      g(l);
    });
    if (e) {
      h.on("data", m => {
        b.push({file:f, data:`${m}`});
      });
    } else {
      h.pipe(b, {end:!1});
    }
  });
  b.B = !1;
  dc("file %s :: %s B", f, a);
  return a;
};
class gc extends ta {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:g = !1} = b;
    super({objectMode:f});
    let k;
    d ? k = "\n" : e && (k = "\n\n");
    this.B = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await Ka(a));
      } catch (h) {
        this.emit("error", Error(h.message));
      }
      try {
        await fc({stream:this, source:a, content:l, reverse:c, separator:k, includeFilename:f, ignoreHidden:g});
      } catch (h) {
        this.emit("error", h);
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
let nc;
const pc = async(a, b, c = {}) => {
  nc || ({root:nc} = Ba(process.cwd()));
  const {fields:d, soft:e = !1} = c;
  var f = Q(a, "node_modules", b);
  f = Q(f, "package.json");
  const g = await Xb(f);
  if (g) {
    a = await oc(f, d);
    if (void 0 === a) {
      throw Error(`The package ${Ca("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:k, version:l, packageName:h, main:m, entryExists:p, ...n} = a;
    return {entry:Ca("", k), packageJson:Ca("", f), ...l ? {version:l} : {}, packageName:h, ...m ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...n};
  }
  if (a == nc && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return pc(Q(Da(a), ".."), b, c);
}, oc = async(a, b = []) => {
  const c = await za(a);
  let d, e, f, g, k;
  try {
    ({module:d, version:e, name:f, main:g, ...k} = JSON.parse(c)), k = b.reduce((h, m) => {
      h[m] = k[m];
      return h;
    }, {});
  } catch (h) {
    throw Error(`Could not parse ${a}.`);
  }
  a = M(a);
  b = d || g;
  if (!b) {
    if (!await Xb(Q(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = Q(a, b);
  let l;
  try {
    ({path:l} = await Z(a)), a = l;
  } catch (h) {
  }
  return {entry:a, version:e, packageName:f, main:!d && g, entryExists:!!l, ...k};
};
const qc = a => /^[./]/.test(a), rc = async(a, b, c, d, e = null) => {
  const f = H(), g = M(a);
  b = b.map(async k => {
    if (hc.includes(k)) {
      return {internal:k};
    }
    if (/^[./]/.test(k)) {
      try {
        var {path:l} = await Z(k, a);
        return {entry:l, package:e};
      } catch (h) {
      }
    } else {
      {
        let [p, n, ...q] = k.split("/");
        !p.startsWith("@") && n ? (q = [n, ...q], n = p) : n = p.startsWith("@") ? `${p}/${n}` : p;
        l = {name:n, paths:q.join("/")};
      }
      const {name:h, paths:m} = l;
      if (m) {
        const {packageJson:p, packageName:n} = await pc(g, h);
        k = M(p);
        ({path:k} = await Z(Q(k, m)));
        return {entry:k, package:n};
      }
    }
    try {
      const {entry:h, packageJson:m, version:p, packageName:n, hasMain:q, ...t} = await pc(g, k, {fields:d});
      return n == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", n, a), null) : {entry:h, packageJson:m, version:p, name:n, ...q ? {hasMain:q} : {}, ...t};
    } catch (h) {
      if (c) {
        return null;
      }
      [k] = process.version.split(".");
      k = parseInt(k.replace("v", ""), 10);
      if (12 <= k) {
        throw h;
      }
      throw f(h);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, tc = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], L:g = {}, mergeSameNodeModules:k = !0, package:l} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var h = await za(a), m = mc(h);
  h = sc(h);
  m = c ? m : m.filter(qc);
  h = c ? h : h.filter(qc);
  try {
    const n = await rc(a, m, e, f, l), q = await rc(a, h, e, f, l);
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
      if (t = g[q]) {
        return t;
      }
      g[q] = n;
    }
    return n;
  }) : p;
  p = l.map(n => ({...n, from:a}));
  return await l.filter(({entry:n}) => n && !(n in b)).reduce(async(n, {entry:q, hasMain:t, packageJson:v, name:r, package:F}) => {
    if (v && d) {
      return n;
    }
    n = await n;
    r = (await tc(q, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:r || F, L:g, mergeSameNodeModules:k})).map(w => ({...w, from:w.from ? w.from : q, ...!w.packageJson && t ? {hasMain:t} : {}}));
    return [...n, ...r];
  }, p);
}, sc = a => Oa(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const uc = async a => {
  const b = H();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async l => {
    ({path:l} = await Z(l));
    return l;
  }));
  const {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], mergeSameNodeModules:g = !0} = {shallow:!0, soft:!0};
  let k;
  try {
    const l = {};
    k = await a.reduce(async(h, m) => {
      h = await h;
      m = await tc(m, l, {nodeModules:c, shallow:d, soft:e, fields:f, mergeSameNodeModules:g});
      h.push(...m);
      return h;
    }, []);
  } catch (l) {
    [a] = process.version.split(".");
    a = parseInt(a.replace("v", ""), 10);
    if (12 <= a) {
      throw l;
    }
    throw b(l);
  }
  return k.filter(({internal:l, entry:h}, m) => l ? k.findIndex(({internal:p}) => p == l) == m : k.findIndex(({entry:p}) => h == p) == m).map(l => {
    const h = l.entry, m = l.internal, p = k.filter(({internal:n, entry:q}) => {
      if (m) {
        return m == n;
      }
      if (h) {
        return h == q;
      }
    }).map(({from:n}) => n).filter((n, q, t) => t.indexOf(n) == q);
    return {...l, from:p};
  }).map(({package:l, ...h}) => l ? {package:l, ...h} : h);
};
const wc = (a, b, c = console.log) => {
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
    const {entry:g, C:k} = vc(f);
    c(W("+", "green"), g, k);
  });
  e.forEach(f => {
    const {entry:g, C:k} = vc(f);
    c(W("-", "red"), g, k);
  });
  return !1;
}, vc = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, C:a};
}, xc = async a => (await I(B, a)).mtime.getTime(), yc = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await xc(b);
  return `${b} ${c}`;
})), zc = async a => {
  const b = await uc(a), c = await yc(b);
  ({path:a} = await Z(a));
  return {mtime:await xc(a), hash:c, N:b};
};
const Ac = async(a, b, c) => {
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
          u && (T = await Wb({getContext:h.bind(this), getReplacements:m.bind(this), key:r, D:A, re:p, replacement:c, A:J, body:T}));
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
        return g && g.call(this, r, G), "";
      }
      Y = (q || "") + Y.replace(/^/gm, t);
      u && (Y = await Wb({getContext:h ? h.bind(this) : void 0, getReplacements:m ? m.bind(this) : void 0, key:r, D:A, re:p, replacement:c, A:J, body:Y, position:F}));
      K && f.call(this, r, y, O || G, v);
      g && g.call(this, r, G);
      return Y;
    } catch (D) {
      if (D === da) {
        return n;
      }
      k && k.call(this, r, D, F, w);
      return l ? "" : n;
    }
  }
  const {getId:d, getProps:e = (n, q) => ({...n, ...q}), markExported:f, onSuccess:g, onFail:k, removeOnError:l = !1, getContext:h, getReplacements:m} = b, p = rb(Object.keys(a));
  return {re:p, replacement:c};
}, c:W, b:Ib, readDirStructure:Ka, clone:async(a, b) => {
  const c = await I(B, a), d = Aa(a);
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
  "-" == c ? d.pipe(process.stdout) : c ? await Ac(c, d, b) : e instanceof va && (d.pipe(e), await new Promise((f, g) => {
    e.on("error", g);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await zc(a);
  a = Sb("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const {mtime:f, hash:g} = b;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : wc(g, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
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
  const f = Object.values(b), [g] = a.reduce(([h = 0, m = 0], p) => {
    const n = b[p].split("\n").reduce((q, t) => t.length > q ? t.length : q, 0);
    n > m && (m = n);
    p.length > h && (h = p.length);
    return [h, m];
  }, []), k = (h, m) => {
    m = " ".repeat(m - h.length);
    return `${h}${m}`;
  };
  a = a.reduce((h, m, p) => {
    p = f[p].split("\n");
    m = k(m, g);
    const [n, ...q] = p;
    m = `${m}\t${n}`;
    const t = k("", g);
    p = q.map(v => `${t}\t${v}`);
    return [...h, m, ...p];
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
    const {getReplacement:f = nb, getRegex:g = mb} = b || {}, k = g(d);
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
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = Ua(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [k, l]) => {
    g[k] = "string" == typeof l ? {short:l} : l;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [k, l]) => {
    let h;
    try {
      const m = l.short, p = l.boolean, n = l.number, q = l.command, t = l.multiple;
      if (q && t && d.length) {
        h = d;
      } else {
        if (q && d.length) {
          h = d[0];
        } else {
          const v = Ta(c, k, m, p, n);
          ({value:h} = v);
          const r = v.index, F = v.length;
          void 0 !== r && F && e.push({index:r, length:F});
        }
      }
    } catch (m) {
      return g;
    }
    return void 0 === h ? g : {...g, [k]:h};
  }, {});
  let f = c;
  e.forEach(({index:g, length:k}) => {
    Array.from({length:k}).forEach((l, h) => {
      f[g + h] = null;
    });
  });
  f = f.filter(g => null !== g);
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
    return c ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => W(g, "green")).join(Ib(" ", "green")) : d ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => W(g, "red")).join(Ib(" ", "red")) : W(e, "grey");
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
}, makepromise:I, mismatch:Oa};


//# sourceMappingURL=index.js.map