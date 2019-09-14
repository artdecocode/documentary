#!/usr/bin/env node
             
const fs = require('fs');
const os = require('os');
const stream = require('stream');
const path = require('path');
const tty = require('tty');
const util = require('util');
const child_process = require('child_process');
const _crypto = require('crypto');
const _module = require('module');             
const {createReadStream:x, createWriteStream:C, lstat:E, mkdir:aa, readdir:ba, readlink:ca, symlink:da} = fs;
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
const ja = /\s+at.*(?:\(|\s)(.*)\)?/, ka = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, la = ia(), ma = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ka.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(ja);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(ja, (g, h) => g.replace(h, h.replace(la, "~"))) : f).join("\n");
};
function na(a, b, c = !1) {
  return function(d) {
    var e = ha(arguments), {stack:f} = Error();
    const g = ea(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = ma(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function J(a) {
  var {stack:b} = Error();
  const c = ha(arguments);
  b = fa(b, a);
  return na(c, b, a);
}
;var oa = stream;
const {PassThrough:pa, Transform:qa, Writable:ra} = stream;
const sa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class ta extends ra {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {G:e = J(!0), proxyError:f} = a || {}, g = (h, l) => e(l);
    super(d);
    this.g = [];
    this.D = new Promise((h, l) => {
      this.on("finish", () => {
        let k;
        b ? k = Buffer.concat(this.g) : k = this.g.join("");
        h(k);
        this.g = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          g`${k}`;
        } else {
          const m = ma(k.stack);
          k.stack = m;
          f && g`${k}`;
        }
        l(k);
      });
      c && sa(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get promise() {
    return this.D;
  }
}
const K = async(a, b = {}) => {
  ({promise:a} = new ta({rs:a, ...b, G:J(!0)}));
  return await a;
};
async function ua(a) {
  a = x(a);
  return await K(a);
}
;function va(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function M(a, b, c) {
  const d = J(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, g) => {
    const h = (k, m) => k ? (k = d(k), g(k)) : f(c || m);
    let l = [h];
    Array.isArray(b) ? (b.forEach((k, m) => {
      va(e, m);
    }), l = [...b, h]) : 1 < Array.from(arguments).length && (va(e, 0), l = [b, h]);
    a(...l);
  });
}
;const {basename:wa, dirname:N, join:Q, relative:R, resolve:xa} = path;
async function ya(a) {
  const b = N(a);
  try {
    return await za(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function za(a) {
  try {
    await M(aa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = N(a);
      await za(c);
      await za(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Aa(a, b) {
  b = b.map(async c => {
    const d = Q(a, c);
    return {lstat:await M(E, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ba = a => a.lstat.isDirectory(), Ca = a => !a.lstat.isDirectory();
async function Da(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await M(E, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await M(ba, a);
  b = await Aa(a, b);
  a = b.filter(Ba);
  b = b.filter(Ca).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...c, [d.relativePath]:{type:e}};
  }, {});
  a = await a.reduce(async(c, {path:d, relativePath:e}) => {
    c = await c;
    d = await Da(d);
    return {...c, [e]:d};
  }, {});
  return {content:{...b, ...a}, type:"Directory"};
}
;const Ea = async(a, b) => {
  const c = x(a), d = C(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Fa = async(a, b) => {
  a = await M(ca, a);
  await M(da, [a, b]);
}, Ga = async(a, b) => {
  await ya(Q(b, "path.file"));
  const {content:c} = await Da(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], g = Q(a, e);
    e = Q(b, e);
    "Directory" == f ? await Ga(g, e) : "File" == f ? await Ea(g, e) : "SymbolicLink" == f && await Fa(g, e);
  });
  await Promise.all(d);
};
function S(a, b, c, d = !1) {
  const e = [];
  b.replace(a, (f, ...g) => {
    f = g[g.length - 2];
    f = d ? {position:f} : {};
    g = g.slice(0, g.length - 2).reduce((h, l, k) => {
      k = c[k];
      if (!k || void 0 === l) {
        return h;
      }
      h[k] = l;
      return h;
    }, f);
    e.push(g);
  });
  return e;
}
;const Ha = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), Ia = new RegExp(`(?:\\s+((?:${Ha.source}\\s*)*))`);
const Ka = (a, b) => {
  a = (Array.isArray(a) ? a : [a]).join("|");
  return S(new RegExp(`<(${a})${Ia.source}?(?:${/\s*\/>/.source}|${/>([\s\S]+?)?<\/\1>/.source})`, "g"), b, "t a v v1 v2 c".split(" ")).map(({t:c, a:d = "", c:e = ""}) => {
    d = d.replace(/\/$/, "").trim();
    d = Ja(d);
    return {content:e, props:d, tag:c};
  });
}, Ja = a => S(Ha, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const La = (a, b, c, d = !1, e = !1) => {
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
}, Ma = a => {
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
const Na = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
let Oa = a => `${a}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), Pa = a => 40 < `${a}`.length || -1 != `${a}`.indexOf("\n") || -1 !== `${a}`.indexOf("<");
const Qa = {};
function Ra(a) {
  const b = {...a.attributes, children:a.children};
  a = a.nodeName.defaultProps;
  if (void 0 !== a) {
    for (let c in a) {
      void 0 === b[c] && (b[c] = a[c]);
    }
  }
  return b;
}
;const Sa = (a, b, {allAttributes:c, xml:d, I:e, sort:f, A:g} = {}) => {
  let h;
  const l = Object.keys(a);
  f && l.sort();
  return {J:l.map(k => {
    var m = a[k];
    if ("children" != k && !k.match(/[\s\n\\/='"\0<>]/) && (c || !["key", "ref"].includes(k))) {
      if ("className" == k) {
        if (a.class) {
          return;
        }
        k = "class";
      } else {
        if ("htmlFor" == k) {
          if (a.for) {
            return;
          }
          k = "for";
        } else {
          if ("srcSet" == k) {
            if (a.srcset) {
              return;
            }
            k = "srcset";
          }
        }
      }
      e && k.match(/^xlink:?./) && (k = k.toLowerCase().replace(/^xlink:?/, "xlink:"));
      if ("style" == k && m && "object" == typeof m) {
        {
          let p = "";
          for (var n in m) {
            let r = m[n];
            null != r && (p && (p += " "), p += Qa[n] || (Qa[n] = n.replace(/([A-Z])/g, "-$1").toLowerCase()), p += ": ", p += r, "number" == typeof r && !1 === Na.test(n) && (p += "px"), p += ";");
          }
          m = p || void 0;
        }
      }
      if ("dangerouslySetInnerHTML" == k) {
        h = m && m.__html;
      } else {
        if ((m || 0 === m || "" === m) && "function" != typeof m) {
          if (!0 === m || "" === m) {
            if (m = k, !d) {
              return k;
            }
          }
          n = "";
          if ("value" == k) {
            if ("select" == b) {
              g = m;
              return;
            }
            "option" == b && g == m && (n = "selected ");
          }
          return `${n}${k}="${Oa(m)}"`;
        }
      }
    }
  }).filter(Boolean), H:h, A:g};
};
const Ta = [], Ua = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, Va = /^(a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/, db = (a, b = {}) => {
  const {addDoctype:c, pretty:d} = b;
  a = Wa(a, b, {});
  return c ? `<!doctype html>${d ? "\n" : ""}${a}` : a;
};
function Wa(a, b = {}, c = {}, d = !1, e = !1, f) {
  if (null == a || "boolean" == typeof a) {
    return "";
  }
  const {pretty:g = !1, shallow:h = !1, renderRootComponent:l = !1, shallowHighOrder:k = !1, sortAttributes:m, allAttributes:n, xml:p, initialPadding:r = 0, closeVoidTags:w = !1} = b;
  let {lineLength:y = 40} = b;
  y -= r;
  let {nodeName:q, attributes:U = {}} = a;
  var u = ["textarea", "pre"].includes(q), A = " ".repeat(r);
  const B = "string" == typeof g ? g : `  ${A}`;
  if ("object" != typeof a && !q) {
    return Oa(a);
  }
  if ("function" == typeof q) {
    if (!h || !d && l) {
      return A = Ra(a), q.prototype && "function" == typeof q.prototype.render ? (u = new q(A, c), u._disable = u.__x = !0, u.props = A, u.context = c, q.getDerivedStateFromProps ? u.state = {...u.state, ...q.getDerivedStateFromProps(u.props, u.state)} : u.componentWillMount && u.componentWillMount(), A = u.render(u.props, u.state, u.context), u.getChildContext && (c = {...c, ...u.getChildContext()})) : A = q(A, c), Wa(A, b, c, k, e, f);
    }
    q = q.displayName || q !== Function && q.name || eb(q);
  }
  let v = "";
  ({J:I, H:d, A:f} = Sa(U, q, {allAttributes:n, xml:p, I:e, sort:m, A:f}));
  if (g) {
    let D = `<${q}`.length;
    v = I.reduce((z, O) => {
      const P = D + 1 + O.length;
      if (P > y) {
        return D = B.length, `${z}\n${B}${O}`;
      }
      D = P;
      return `${z} ${O}`;
    }, "");
  } else {
    v = I.length ? " " + I.join(" ") : "";
  }
  v = `<${q}${v}>`;
  if (`${q}`.match(/[\s\n\\/='"\0<>]/)) {
    throw v;
  }
  var I = `${q}`.match(Ua);
  w && I && (v = v.replace(/>$/, " />"));
  let F = [];
  if (d) {
    !u && g && (Pa(d) || d.length + fb(v) > y) && (d = "\n" + B + `${d}`.replace(/(\n+)/g, "$1" + (B || "\t"))), v += d;
  } else {
    if (a.children) {
      let D = g && v.includes("\n");
      F = a.children.map(z => {
        if (null != z && !1 !== z && (z = Wa(z, b, c, !0, "svg" == q ? !0 : "foreignObject" == q ? !1 : e, f))) {
          return g && z.length + fb(v) > y && (D = !0), z;
        }
      }).filter(Boolean);
      if (g && D && !u) {
        for (a = F.length; a--;) {
          F[a] = "\n" + B + `${F[a]}`.replace(/(\n+)/g, "$1" + (B || "\t"));
        }
      }
    }
  }
  if (F.length) {
    v += F.join("");
  } else {
    if (p) {
      return v.substring(0, v.length - 1) + " />";
    }
  }
  I || (a = F[F.length - 1], `${q}`.match(Va) && (a ? !/>$/.test(a) : 1) || u || !g || !v.includes("\n") || (v += `\n${A}`), v += `</${q}>`);
  return v;
}
function eb(a) {
  var b = (Function.prototype.toString.call(a).match(/^\s*function\s+([^( ]+)/) || "")[1];
  if (!b) {
    b = -1;
    for (let c = Ta.length; c--;) {
      if (Ta[c] === a) {
        b = c;
        break;
      }
    }
    0 > b && (b = Ta.push(a) - 1);
    b = `UnnamedComponent${b}`;
  }
  return b;
}
const fb = a => {
  a = a.split("\n");
  return a[a.length - 1].length;
};
function gb(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const hb = (a, b) => {
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
function ib(a, b) {
  function c() {
    return b.filter(gb).reduce((d, {re:e, replacement:f}) => {
      if (this.j) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let g;
        return d.replace(e, (h, ...l) => {
          g = Error();
          try {
            return this.j ? h : f.call(this, h, ...l);
          } catch (k) {
            hb(g, k);
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
;const jb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), kb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function lb(a, b) {
  return mb(a, b);
}
class nb extends qa {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(gb);
    this.j = !1;
    this.s = b;
  }
  async replace(a, b) {
    const c = new nb(this.g, this.s);
    b && Object.assign(c, b);
    a = await lb(c, a);
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
        const g = b.replace(c, (h, ...l) => {
          f = Error();
          try {
            if (this.j) {
              return e.length ? e.push(Promise.resolve(h)) : h;
            }
            const k = d.call(this, h, ...l);
            k instanceof Promise && e.push(k);
            return k;
          } catch (k) {
            hb(f, k);
          }
        });
        if (e.length) {
          try {
            const h = await Promise.all(e);
            b = b.replace(c, () => h.shift());
          } catch (h) {
            hb(f, h);
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
      a = ma(d.stack), d.stack = a, c(d);
    }
  }
}
async function mb(a, b) {
  b instanceof oa ? b.pipe(a) : a.end(b);
  return await K(a);
}
;const ob = a => {
  a = `(${a.join("|")})`;
  return new RegExp(`(\\n)?( *)(<${a}${"(?:\\s+(?!\\/>)[^>]*?)?"}(?:\\s*?/>|>[\\s\\S]*?<\\/\\4>))`, "gm");
};
var pb = tty;
const {debuglog:qb, format:rb, inspect:sb} = util;
/*

 Copyright (c) 2016 Zeit, Inc.
 https://npmjs.org/ms
*/
function tb(a) {
  var b = {}, c = typeof a;
  if ("string" == c && 0 < a.length) {
    return ub(a);
  }
  if ("number" == c && isFinite(a)) {
    return b.N ? (b = Math.abs(a), a = 864E5 <= b ? vb(a, b, 864E5, "day") : 36E5 <= b ? vb(a, b, 36E5, "hour") : 6E4 <= b ? vb(a, b, 6E4, "minute") : 1000 <= b ? vb(a, b, 1000, "second") : a + " ms") : (b = Math.abs(a), a = 864E5 <= b ? Math.round(a / 864E5) + "d" : 36E5 <= b ? Math.round(a / 36E5) + "h" : 6E4 <= b ? Math.round(a / 6E4) + "m" : 1000 <= b ? Math.round(a / 1000) + "s" : a + "ms"), a;
  }
  throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(a));
}
function ub(a) {
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
function vb(a, b, c, d) {
  return Math.round(a / c) + " " + d + (b >= 1.5 * c ? "s" : "");
}
;/*
 bytes
 Copyright(c) 2012-2014 TJ Holowaychuk
 Copyright(c) 2015 Jed Watson
 MIT Licensed
*/
const wb = /\B(?=(\d{3})+(?!\d))/g, xb = /(?:\.0*|(\.[^0]+)0+)$/, T = {b:1, kb:1024, mb:1048576, gb:1073741824, tb:Math.pow(1024, 4), pb:Math.pow(1024, 5)};
function V(a, b) {
  if (!Number.isFinite(a)) {
    return null;
  }
  const c = Math.abs(a), d = b && b.P || "", e = b && b.S || "", f = b && void 0 !== b.F ? b.F : 2, g = !(!b || !b.L);
  (b = b && b.R || "") && T[b.toLowerCase()] || (b = c >= T.pb ? "PB" : c >= T.tb ? "TB" : c >= T.gb ? "GB" : c >= T.mb ? "MB" : c >= T.kb ? "KB" : "B");
  a = (a / T[b.toLowerCase()]).toFixed(f);
  g || (a = a.replace(xb, "$1"));
  d && (a = a.replace(wb, d));
  return a + e + b;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function yb(a, b, c) {
  let d = a[a.length - 1];
  d && d.l === b && d.v === c ? a[a.length - 1] = {count:d.count + 1, l:b, v:c} : a.push({count:1, l:b, v:c});
}
function zb(a, b, c, d, e) {
  let f = c.length, g = d.length, h = b.i;
  e = h - e;
  let l = 0;
  for (; h + 1 < f && e + 1 < g && a.equals(c[h + 1], d[e + 1]);) {
    h++, e++, l++;
  }
  l && b.m.push({count:l});
  b.i = h;
  return e;
}
function Ab(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
class Bb {
  diff(a, b) {
    a = Ab(a.split(""));
    b = Ab(b.split(""));
    let c = b.length, d = a.length, e = 1, f = c + d, g = [{i:-1, m:[]}];
    var h = zb(this, g[0], b, a, 0);
    if (g[0].i + 1 >= c && h + 1 >= d) {
      return [{value:this.join(b), count:b.length}];
    }
    for (; e <= f;) {
      a: {
        for (h = -1 * e; h <= e; h += 2) {
          var l = g[h - 1];
          let m = g[h + 1];
          var k = (m ? m.i : 0) - h;
          l && (g[h - 1] = void 0);
          let n = l && l.i + 1 < c;
          k = m && 0 <= k && k < d;
          if (n || k) {
            !n || k && l.i < m.i ? (l = {i:m.i, m:m.m.slice(0)}, yb(l.m, void 0, !0)) : (l.i++, yb(l.m, !0, void 0));
            k = zb(this, l, b, a, h);
            if (l.i + 1 >= c && k + 1 >= d) {
              h = Cb(this, l.m, b, a);
              break a;
            }
            g[h] = l;
          } else {
            g[h] = void 0;
          }
        }
        e++;
        h = void 0;
      }
      if (h) {
        return h;
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
function Cb(a, b, c, d) {
  let e = 0, f = b.length, g = 0, h = 0;
  for (; e < f; e++) {
    var l = b[e];
    if (l.v) {
      l.value = a.join(d.slice(h, h + l.count)), h += l.count, e && b[e - 1].l && (l = b[e - 1], b[e - 1] = b[e], b[e] = l);
    } else {
      if (l.l) {
        l.value = a.join(c.slice(g, g + l.count));
      } else {
        let k = c.slice(g, g + l.count);
        k = k.map(function(m, n) {
          n = d[h + n];
          return n.length > m.length ? n : m;
        });
        l.value = a.join(k);
      }
      g += l.count;
      l.l || (h += l.count);
    }
  }
  c = b[f - 1];
  1 < f && "string" === typeof c.value && (c.l || c.v) && a.equals("", c.value) && (b[f - 2].value += c.value, b.pop());
  return b;
}
;const Db = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Eb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function W(a, b) {
  return (b = Db[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Fb(a, b) {
  return (b = Eb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;var Gb = {f:V, ["fy"](a) {
  return W(V(a) || "", "yellow");
}, ["fr"](a) {
  return W(V(a) || "", "red");
}, ["fb"](a) {
  return W(V(a) || "", "blue");
}, ["fg"](a) {
  return W(V(a) || "", "green");
}, ["fc"](a) {
  return W(V(a) || "", "cyan");
}, ["fm"](a) {
  return W(V(a) || "", "magenta");
}};
const X = Object.keys(process.env).filter(a => /^debug_/i.test(a)).reduce((a, b) => {
  const c = b.substring(6).toLowerCase().replace(/_([a-z])/g, (d, e) => e.toUpperCase());
  b = process.env[b];
  /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : "null" === b ? b = null : b = Number(b);
  a[c] = b;
  return a;
}, {}), Hb = {init:function(a) {
  a.inspectOpts = {...X};
}, log:function(...a) {
  return process.stderr.write(rb(...a) + "\n");
}, formatArgs:function(a) {
  const {namespace:b, useColors:c, color:d, diff:e} = this;
  if (c) {
    const f = "\u001b[3" + (8 > d ? d : "8;5;" + d), g = `  ${f};1m${b} \u001B[0m`;
    a[0] = g + a[0].split("\n").join("\n" + g);
    a.push(f + "m+" + tb(e) + "\u001b[0m");
  } else {
    a[0] = (X.hideDate ? "" : (new Date).toISOString() + " ") + b + " " + a[0];
  }
}, save:function(a) {
  a ? process.env.DEBUG = a : delete process.env.DEBUG;
}, load:function() {
  return process.env.DEBUG;
}, useColors:function() {
  return "colors" in X ? !!X.colors : pb.isatty(process.stderr.fd);
}, colors:[6, 2, 3, 4, 5, 1], inspectOpts:X, formatters:{o:function(a) {
  return sb(a, {...this.inspectOpts, colors:this.useColors}).replace(/\s*\n\s*/g, " ");
}, O:function(a) {
  return sb(a, {...this.inspectOpts, colors:this.useColors});
}, ...Gb}};
function Ib(a) {
  function b(...g) {
    if (b.enabled) {
      var h = Number(new Date);
      b.diff = h - (f || h);
      b.prev = f;
      f = b.curr = h;
      g[0] = Jb(g[0]);
      "string" != typeof g[0] && g.unshift("%O");
      var l = 0;
      g[0] = g[0].replace(/%([a-zA-Z%]+)/g, (k, m) => {
        if ("%%" == k) {
          return k;
        }
        l++;
        if (m = c[m]) {
          k = m.call(b, g[l]), g.splice(l, 1), l--;
        }
        return k;
      });
      d.call(b, g);
      (b.log || e).apply(b, g);
    }
  }
  const c = a.formatters, d = a.formatArgs, e = a.log;
  let f;
  return b;
}
function Kb(a) {
  const b = Ib(a);
  "function" == typeof a.init && a.init(b);
  a.g.push(b);
  return b;
}
function Lb(a, b) {
  let c = 0;
  for (let d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d), c |= 0;
  }
  return a.colors[Math.abs(c) % a.colors.length];
}
function Mb(a) {
  var b = Hb.load();
  a.save(b);
  a.s = [];
  a.w = [];
  let c;
  const d = ("string" == typeof b ? b : "").split(/[\s,]+/), e = d.length;
  for (c = 0; c < e; c++) {
    d[c] && (b = d[c].replace(/\*/g, ".*?"), "-" == b[0] ? a.w.push(new RegExp("^" + b.substr(1) + "$")) : a.s.push(new RegExp("^" + b + "$")));
  }
  for (c = 0; c < a.g.length; c++) {
    b = a.g[c], b.enabled = a.enabled(b.namespace);
  }
}
class Nb {
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
    this.w = [];
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
    for (c = this.w.length; b < c; b++) {
      if (this.w[b].test(a)) {
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
function Jb(a) {
  return a instanceof Error ? a.stack || a.message : a;
}
;require("./init");
require("./make-io");
var Ob;
Ob = function() {
  const a = new Nb(Hb);
  return function(b) {
    const c = Kb(a);
    c.namespace = b;
    c.useColors = Hb.useColors();
    c.enabled = a.enabled(b);
    c.color = Lb(a, b);
    c.destroy = function() {
      a.destroy(this);
    };
    c.extend = function(d, e) {
      d = this.namespace + (void 0 === e ? ":" : e) + d;
      d.log = this.log;
      return d;
    };
    Mb(a);
    return c;
  };
}()("competent");
const Pb = (a, b) => new RegExp(a.source.replace(new RegExp(`([|(])${b}([|)])`), (c, d, e) => "|" == d && "|" == e ? "|" : ")" == e ? e : "(" == d ? d : ""), a.flags);
const Y = async a => {
  try {
    return await M(E, a);
  } catch (b) {
    return null;
  }
};
const Z = async(a, b) => {
  b && (b = N(b), a = Q(b, a));
  var c = await Y(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await Qb(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await Qb(a), c = !0);
      if (!e) {
        b = await Qb(Q(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? R("", b) : b, M:d};
}, Qb = async a => {
  a = `${a}.js`;
  let b = await Y(a);
  b || (a = `${a}x`);
  if (b = await Y(a)) {
    return a;
  }
};
const {fork:Rb, spawn:Sb} = child_process;
const Tb = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", g => {
      e(g);
    });
  }), a.stdout ? K(a.stdout) : void 0, a.stderr ? K(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const Ub = (a, b) => a.some(c => c == b), Vb = (a, b) => {
  const c = Ub(a, "index.md"), d = Ub(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, g) => {
    f = f.localeCompare(g, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const Wb = qb("pedantry"), Yb = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:g, ignoreHidden:h}) => {
  var l = Object.keys(d);
  l = await Vb(l, e).reduce(async(k, m) => {
    k = await k;
    const {type:n, content:p} = d[m], r = Q(c, m);
    let w;
    "File" == n ? h && m.startsWith(".") || (w = await Xb({stream:a, source:b, path:r, separator:f, includeFilename:g})) : "Directory" == n && (w = await Yb({stream:a, source:b, path:r, content:p, reverse:e, separator:f, includeFilename:g, ignoreHidden:h}));
    return k + w;
  }, 0);
  Wb("dir %s size: %s B", c, l);
  return l;
}, Xb = async a => {
  const {stream:b, source:c, path:d, separator:e, includeFilename:f} = a, g = Q(c, d);
  b.emit("file", d);
  e && !b.B && (f ? b.push({file:"separator", data:e}) : b.push(e));
  a = await new Promise((h, l) => {
    let k = 0;
    const m = x(g);
    m.on("data", n => {
      k += n.byteLength;
    }).on("error", n => {
      l(n);
    }).on("close", () => {
      h(k);
    });
    if (f) {
      m.on("data", n => {
        b.push({file:g, data:`${n}`});
      });
    } else {
      m.pipe(b, {end:!1});
    }
  });
  b.B = !1;
  Wb("file %s :: %s B", g, a);
  return a;
};
class Zb extends pa {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:g = !1} = b;
    super({objectMode:f});
    let h;
    d ? h = "\n" : e && (h = "\n\n");
    this.B = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await Da(a));
      } catch (k) {
        this.emit("error", Error(k.message));
      }
      try {
        await Yb({stream:this, source:a, content:l, reverse:c, separator:h, includeFilename:f, ignoreHidden:g});
      } catch (k) {
        this.emit("error", k);
      } finally {
        this.end();
      }
    })();
  }
}
;const {createHash:$b} = _crypto;
const {builtinModules:ac} = _module;
const bc = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, cc = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, dc = /^ *import\s+(['"])(.+?)\1/gm, ec = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, fc = a => [bc, cc, dc, ec].reduce((b, c) => {
  c = S(c, a, ["q", "from"]).map(d => d.from);
  return [...b, ...c];
}, []);
const hc = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = Q(a, "node_modules", b);
  f = Q(f, "package.json");
  const g = await Y(f);
  if (g) {
    a = await gc(f, d);
    if (void 0 === a) {
      throw Error(`The package ${R("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:h, version:l, packageName:k, main:m, entryExists:n, ...p} = a;
    return {entry:R("", h), packageJson:R("", f), ...l ? {version:l} : {}, packageName:k, ...m ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return hc(Q(xa(a), ".."), b, c);
}, gc = async(a, b = []) => {
  const c = await ua(a);
  let d, e, f, g, h;
  try {
    ({module:d, version:e, name:f, main:g, ...h} = JSON.parse(c)), h = b.reduce((k, m) => {
      k[m] = h[m];
      return k;
    }, {});
  } catch (k) {
    throw Error(`Could not parse ${a}.`);
  }
  a = N(a);
  b = d || g;
  if (!b) {
    if (!await Y(Q(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = Q(a, b);
  let l;
  try {
    ({path:l} = await Z(a)), a = l;
  } catch (k) {
  }
  return {entry:a, version:e, packageName:f, main:!d && g, entryExists:!!l, ...h};
};
const ic = a => /^[./]/.test(a), jc = async(a, b, c, d, e = null) => {
  const f = J(), g = N(a);
  b = b.map(async h => {
    if (ac.includes(h)) {
      return {internal:h};
    }
    if (/^[./]/.test(h)) {
      try {
        var {path:l} = await Z(h, a);
        return {entry:l, package:e};
      } catch (k) {
      }
    } else {
      {
        let [n, p, ...r] = h.split("/");
        !n.startsWith("@") && p ? (r = [p, ...r], p = n) : p = n.startsWith("@") ? `${n}/${p}` : n;
        l = {name:p, paths:r.join("/")};
      }
      const {name:k, paths:m} = l;
      if (m) {
        const {packageJson:n, packageName:p} = await hc(g, k);
        h = N(n);
        ({path:h} = await Z(Q(h, m)));
        return {entry:h, package:p};
      }
    }
    try {
      const {entry:k, packageJson:m, version:n, packageName:p, hasMain:r, ...w} = await hc(g, h, {fields:d});
      return p == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:k, packageJson:m, version:n, name:p, ...r ? {hasMain:r} : {}, ...w};
    } catch (k) {
      if (c) {
        return null;
      }
      throw f(k);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, lc = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], package:g} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var h = await ua(a), l = fc(h);
  h = kc(h);
  l = c ? l : l.filter(ic);
  h = c ? h : h.filter(ic);
  let k;
  try {
    const m = await jc(a, l, e, f, g), n = await jc(a, h, e, f, g);
    n.forEach(p => {
      p.required = !0;
    });
    k = [...m, ...n];
  } catch (m) {
    throw m.message = `${a}\n [!] ${m.message}`, m;
  }
  g = k.map(m => ({...m, from:a}));
  return await k.filter(({entry:m}) => m && !(m in b)).reduce(async(m, {entry:n, hasMain:p, packageJson:r, name:w, package:y}) => {
    if (r && d) {
      return m;
    }
    m = await m;
    w = (await lc(n, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:w || y})).map(q => ({...q, from:q.from ? q.from : n, ...!q.packageJson && p ? {hasMain:p} : {}}));
    return [...m, ...w];
  }, g);
}, kc = a => S(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const mc = async a => {
  const b = J();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async h => {
    ({path:h} = await Z(h));
    return h;
  }));
  const {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = []} = {shallow:!0, soft:!0};
  let g;
  try {
    const h = {};
    g = await a.reduce(async(l, k) => {
      l = await l;
      k = await lc(k, h, {nodeModules:c, shallow:d, soft:e, fields:f});
      l.push(...k);
      return l;
    }, []);
  } catch (h) {
    throw b(h);
  }
  return g.filter(({internal:h, entry:l}, k) => h ? g.findIndex(({internal:m}) => m == h) == k : g.findIndex(({entry:m}) => l == m) == k).map(h => {
    const {entry:l, internal:k} = h, m = g.filter(({internal:n, entry:p}) => {
      if (k) {
        return k == n;
      }
      if (l) {
        return l == p;
      }
    }).map(({from:n}) => n).filter((n, p, r) => r.indexOf(n) == p);
    return {...h, from:m};
  }).map(({package:h, ...l}) => h ? {package:h, ...l} : l);
};
const oc = (a, b, c = console.log) => {
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
    const {entry:g, C:h} = nc(f);
    c(W("+", "green"), g, h);
  });
  e.forEach(f => {
    const {entry:g, C:h} = nc(f);
    c(W("-", "red"), g, h);
  });
  return !1;
}, nc = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, C:a};
}, pc = async a => (await M(E, a)).mtime.getTime(), qc = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await pc(b);
  return `${b} ${c}`;
})), rc = async a => {
  const b = await mc(a), c = await qc(b);
  ({path:a} = await Z(a));
  return {mtime:await pc(a), hash:c, K:b};
};
const sc = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({promise:c} = new ta({rs:b}));
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
  async function c(p, r, w, y, q, U, u) {
    Ob("render %s", q);
    const A = Error("Skip render");
    try {
      const B = a[q], v = u.slice(0, U), I = u.slice(U + p.length);
      if (/\x3c!--\s*$/.test(v) && /^\s*--\x3e/.test(I)) {
        return p;
      }
      const [{content:F = "", props:D}] = Ka(q, y);
      y = [F];
      let z = !1, O = !0, P = !1, Xa, Ya, Za, $a, ab;
      const bb = e.call(this, {...D, children:y}, {export(t = !0) {
        z = t;
      }, setPretty(t, L) {
        Xa = t;
        L && (Ya = L);
      }, renderAgain(t = !0, L = !1) {
        O = t;
        P = L;
      }, setChildContext(t) {
        $a = t;
      }, removeLine(t = !0) {
        ab = t;
      }, skipRender() {
        throw A;
      }}, q);
      let G;
      try {
        const t = B.call(this, bb);
        G = t instanceof Promise ? await t : t;
      } catch (t) {
        if (!t.message.startsWith("Class constructor")) {
          throw t;
        }
        G = (new B).render(bb);
      }
      z && !G.attributes.id && (Za = d.call(this), G.attributes.id = Za);
      const cb = {pretty:Xa, lineLength:Ya};
      let H;
      "string" == typeof G ? H = G : Array.isArray(G) ? H = G.map(t => "string" == typeof t ? t : db(t, cb)).join("\n") : H = db(G, cb);
      if (!H && ab) {
        return g && g.call(this, q, D), "";
      }
      H = (r || "") + H.replace(/^/gm, w);
      if (O) {
        let t;
        m ? t = m.call(this, q, P) : P ? t = {re:Pb(n, q), replacement:c} : t = {re:n, replacement:c};
        const L = new nb(t);
        if (k) {
          const tc = k.call(this, $a);
          Object.assign(L, tc);
        }
        H = await lb(L, H);
      }
      z && f.call(this, q, G.attributes.id, D, y);
      g && g.call(this, q, D);
      return H;
    } catch (B) {
      if (B === A) {
        return p;
      }
      h && h.call(this, q, B, U, u);
      return l ? "" : p;
    }
  }
  const {getId:d, getProps:e = (p, r) => ({...p, ...r}), markExported:f, onSuccess:g, onFail:h, removeOnError:l = !1, getContext:k, getReplacements:m} = b, n = ob(Object.keys(a));
  return {re:n, replacement:c};
}, c:W, b:Fb, readDirStructure:Da, clone:async(a, b) => {
  const c = await M(E, a), d = wa(a);
  b = Q(b, d);
  c.isDirectory() ? await Ga(a, b) : c.isSymbolicLink() ? await Fa(a, b) : (await ya(b), await Ea(a, b));
}, Pedantry:Zb, whichStream:async function(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = x(b));
  "-" == c ? d.pipe(process.stdout) : c ? await sc(c, d, b) : e instanceof ra && (d.pipe(e), await new Promise((f, g) => {
    e.on("error", g);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await rc(a);
  a = $b("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const {mtime:f, hash:g} = b;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : oc(g, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
}, ensurePath:ya, read:ua, replace:mb, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([k = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((r, w) => w.length > r ? w.length : r, 0);
    p > m && (m = p);
    n.length > k && (k = n.length);
    return [k, m];
  }, []), h = (k, m) => {
    m = " ".repeat(m - k.length);
    return `${k}${m}`;
  };
  a = a.reduce((k, m, n) => {
    n = f[n].split("\n");
    m = h(m, g);
    const [p, ...r] = n;
    m = `${m}\t${p}`;
    const w = h("", g);
    n = r.map(y => `${w}\t${y}`);
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
  a = Sb(a, b, c);
  b = Tb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = Rb(a, b, c);
  b = Tb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:ib, Replaceable:nb, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = kb, getRegex:g = jb} = b || {}, h = g(d);
    e = {name:d, re:e, regExp:h, getReplacement:f, map:{}, lastIndex:0};
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
    return ib(e, f);
  }};
}, resolveDependency:Z, rexml:Ka, reduceUsage:a => Object.keys(a).reduce((b, c) => {
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
  const c = J(!0), d = C(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}, argufy:function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = Ma(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({u:e, ...f}, g) => {
    if (0 == e.length && d) {
      return {u:e, ...f};
    }
    const h = a[g];
    let l;
    if ("string" == typeof h) {
      ({value:l, argv:e} = La(e, g, h));
    } else {
      try {
        const {short:k, boolean:m, number:n, command:p, multiple:r} = h;
        p && r && c.length ? (l = c, d = !0) : p && c.length ? (l = c[0], d = !0) : {value:l, argv:e} = La(e, g, k, m, n);
      } catch (k) {
        return {u:e, ...f};
      }
    }
    return void 0 === l ? {u:e, ...f} : {u:e, ...f, [g]:l};
  }, {u:b});
}, Catchment:ta, collect:K, clearr:a => a.split("\n").map(b => {
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
  return (new Bb).diff(a, b).map(({l:c, v:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => W(g, "green")).join(Fb(" ", "green")) : d ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => W(g, "red")).join(Fb(" ", "red")) : W(e, "grey");
  }).join("");
}, forkfeed:(a, b, c = [], d = null) => {
  if (d) {
    a.on("data", h => d.write(h));
  }
  let [e, ...f] = c;
  if (e) {
    var g = h => {
      const [l, k] = e;
      l.test(h) && (h = `${k}\n`, d && d.write(h), b.write(h), [e, ...f] = f, e || a.removeListener("data", g));
    };
    a.on("data", g);
  }
}, makepromise:M, mismatch:S};


//# sourceMappingURL=index.js.map