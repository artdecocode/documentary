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
const {createReadStream:aa, createWriteStream:ba, lstat:B, mkdir:ca, readdir:ea, readlink:fa, symlink:ha} = fs;
const ia = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ja = (a, b = !1) => ia(a, 2 + (b ? 1 : 0)), ka = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:la} = os;
const ma = /\s+at.*(?:\(|\s)(.*)\)?/, na = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, oa = la(), pa = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(na.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(ma);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(ma, (g, k) => g.replace(k, k.replace(oa, "~"))) : f).join("\n");
};
function qa(a, b, c = !1) {
  return function(d) {
    var e = ka(arguments), {stack:f} = Error();
    const g = ia(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = pa(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function H(a) {
  var {stack:b} = Error();
  const c = ka(arguments);
  b = ja(b, a);
  return qa(c, b, a);
}
;var ra = stream;
const {PassThrough:sa, Transform:ta, Writable:ua} = stream;
const va = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class wa extends ua {
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
          const m = pa(h.stack);
          h.stack = m;
          f && g`${h}`;
        }
        l(h);
      });
      c && va(this, c).pipe(this);
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
const xa = async(a, b = {}) => {
  ({promise:a} = new wa({rs:a, ...b, H:H(!0)}));
  return await a;
};
async function ya(a) {
  a = aa(a);
  return await xa(a);
}
;function za(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function I(a, b, c) {
  const d = H(!0);
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
      za(e, m);
    }), l = [...b, k]) : 1 < Array.from(arguments).length && (za(e, 0), l = [b, k]);
    a(...l);
  });
}
;const {basename:Aa, dirname:P, join:Q, relative:Ba, resolve:Ca} = path;
async function Da(a) {
  const b = P(a);
  try {
    return await Ea(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function Ea(a) {
  try {
    await I(ca, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = P(a);
      await Ea(c);
      await Ea(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Fa(a, b) {
  b = b.map(async c => {
    const d = Q(a, c);
    return {lstat:await I(B, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ga = a => a.lstat.isDirectory(), Ha = a => !a.lstat.isDirectory();
async function Ia(a, b = {}) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:c = []} = b;
  if (!(await I(B, a)).isDirectory()) {
    throw b = Error("Path is not a directory"), b.code = "ENOTDIR", b;
  }
  b = await I(ea, a);
  var d = await Fa(a, b);
  b = d.filter(Ga);
  d = d.filter(Ha).reduce((e, f) => {
    var g = f.lstat.isDirectory() ? "Directory" : f.lstat.isFile() ? "File" : f.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [f.relativePath]:{type:g}};
  }, {});
  b = await b.reduce(async(e, {path:f, relativePath:g}) => {
    const k = Ba(a, f);
    if (c.includes(k)) {
      return e;
    }
    e = await e;
    f = await Ia(f);
    return {...e, [g]:f};
  }, {});
  return {content:{...d, ...b}, type:"Directory"};
}
;const Ja = async(a, b) => {
  const c = aa(a), d = ba(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Ka = async(a, b) => {
  a = await I(fa, a);
  await I(ha, [a, b]);
}, La = async(a, b) => {
  await Da(Q(b, "path.file"));
  const {content:c} = await Ia(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], g = Q(a, e);
    e = Q(b, e);
    "Directory" == f ? await La(g, e) : "File" == f ? await Ja(g, e) : "SymbolicLink" == f && await Ka(g, e);
  });
  await Promise.all(d);
};
function Ma(a, b, c, d = !1) {
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
;const Na = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), Oa = new RegExp(`(?:\\s+((?:${Na.source}\\s*)*))`);
const Qa = (a, b) => {
  a = (Array.isArray(a) ? a : [a]).join("|");
  return Ma(new RegExp(`<(${a})${Oa.source}?(?:${/\s*\/>/.source}|${/>([\s\S]+?)?<\/\1>/.source})`, "g"), b, "t a v v1 v2 c".split(" ")).map(({t:c, a:d = "", c:e = ""}) => {
    d = d.replace(/\/$/, "").trim();
    d = Pa(d);
    return {content:e, props:d, tag:c};
  });
}, Pa = a => Ma(Na, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const Ra = (a, b, c, d = !1, e = !1) => {
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
}, Sa = a => {
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
const Ta = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
let Ua = a => `${a}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), Va = a => 40 < `${a}`.length || -1 != `${a}`.indexOf("\n") || -1 !== `${a}`.indexOf("<");
const Wa = {};
function Xa(a) {
  const b = {...a.attributes, children:a.children};
  a = a.nodeName.defaultProps;
  if (void 0 !== a) {
    for (let c in a) {
      void 0 === b[c] && (b[c] = a[c]);
    }
  }
  return b;
}
;const Ya = (a, b, {allAttributes:c, xml:d, J:e, sort:f, w:g} = {}) => {
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
            let r = m[p];
            null != r && (n && (n += " "), n += Wa[p] || (Wa[p] = p.replace(/([A-Z])/g, "-$1").toLowerCase()), n += ": ", n += r, "number" == typeof r && !1 === Ta.test(p) && (n += "px"), n += ";");
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
          return `${p}${h}="${Ua(m)}"`;
        }
      }
    }
  }).filter(Boolean), I:k, w:g};
};
const Za = [], $a = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, ab = /^(a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/, cb = (a, b = {}) => {
  const {addDoctype:c, pretty:d} = b;
  a = bb(a, b, {});
  return c ? `<!doctype html>${d ? "\n" : ""}${a}` : a;
};
function bb(a, b = {}, c = {}, d = !1, e = !1, f) {
  if (null == a || "boolean" == typeof a) {
    return "";
  }
  const {pretty:g = !1, shallow:k = !1, renderRootComponent:l = !1, shallowHighOrder:h = !1, sortAttributes:m, allAttributes:p, xml:n, initialPadding:r = 0, closeVoidTags:t = !1} = b;
  let {lineLength:y = 40} = b;
  y -= r;
  let {nodeName:q, attributes:C = {}} = a;
  var v = ["textarea", "pre"].includes(q);
  const da = " ".repeat(r), E = "string" == typeof g ? g : `  ${da}`;
  if ("object" != typeof a && !q) {
    return Ua(a);
  }
  if ("function" == typeof q) {
    if (!k || !d && l) {
      return v = Xa(a), q.prototype && "function" == typeof q.prototype.render ? (a = new q(v, c), a._disable = a.__x = !0, a.props = v, a.context = c, q.getDerivedStateFromProps ? a.state = {...a.state, ...q.getDerivedStateFromProps(a.props, a.state)} : a.componentWillMount && a.componentWillMount(), v = a.render(a.props, a.state, a.context), a.getChildContext && (c = {...c, ...a.getChildContext()})) : v = q(v, c), bb(v, b, c, h, e, f);
    }
    q = q.displayName || q !== Function && q.name || db(q);
  }
  let w = "";
  ({K:M, I:d, w:f} = Ya(C, q, {allAttributes:p, xml:n, J:e, sort:m, w:f}));
  if (g) {
    let G = `<${q}`.length;
    w = M.reduce((K, u) => {
      const A = G + 1 + u.length;
      if (A > y) {
        return G = E.length, `${K}\n${E}${u}`;
      }
      G = A;
      return `${K} ${u}`;
    }, "");
  } else {
    w = M.length ? " " + M.join(" ") : "";
  }
  w = `<${q}${w}>`;
  if (`${q}`.match(/[\s\n\\/='"\0<>]/)) {
    throw w;
  }
  var M = `${q}`.match($a);
  t && M && (w = w.replace(/>$/, " />"));
  let L = [];
  if (d) {
    !v && g && (Va(d) || d.length + eb(w) > y) && (d = "\n" + E + `${d}`.replace(/(\n+)/g, "$1" + (E || "\t"))), w += d;
  } else {
    if (a.children) {
      let G = g && w.includes("\n");
      const K = [];
      L = a.children.map((u, A) => {
        if (null != u && !1 !== u) {
          var D = bb(u, b, c, !0, "svg" == q ? !0 : "foreignObject" == q ? !1 : e, f);
          if (D) {
            g && D.length + eb(w) > y && (G = !0);
            if ("string" == typeof u.nodeName) {
              const x = D.replace(new RegExp(`</${u.nodeName}>$`), "");
              fb(u.nodeName, x) && (K[A] = D.length);
            }
            return D;
          }
        }
      }).filter(Boolean);
      g && G && !v && (L = L.reduce((u, A, D) => {
        var x = (D = K[D - 1]) && /^<([\s\S]+?)>/.exec(A);
        x && ([, x] = x, x = !ab.test(x));
        if (D && !x) {
          x = /[^<]*?(\s)/y;
          var J;
          let V = !0, N;
          for (; null !== (J = x.exec(A));) {
            const [O] = J;
            [, N] = J;
            x.lastIndex + O.length - 1 > y - (V ? D : 0) && (J = A.slice(0, x.lastIndex - 1), A = A.slice(x.lastIndex), V ? (u.push(J), V = !1) : u.push("\n" + E + `${J}`.replace(/(\n+)/g, "$1" + (E || "\t"))), x.lastIndex = 0);
          }
          N && u.push(N);
          u.push(A);
        } else {
          u.push("\n" + E + `${A}`.replace(/(\n+)/g, "$1" + (E || "\t")));
        }
        return u;
      }, []));
    }
  }
  if (L.length) {
    w += L.join("");
  } else {
    if (n) {
      return w.substring(0, w.length - 1) + " />";
    }
  }
  M || (!fb(q, L[L.length - 1]) && !v && g && w.includes("\n") && (w += `\n${da}`), w += `</${q}>`);
  return w;
}
const fb = (a, b) => `${a}`.match(ab) && (b ? !/>$/.test(b) : !0);
function db(a) {
  var b = (Function.prototype.toString.call(a).match(/^\s*function\s+([^( ]+)/) || "")[1];
  if (!b) {
    b = -1;
    for (let c = Za.length; c--;) {
      if (Za[c] === a) {
        b = c;
        break;
      }
    }
    0 > b && (b = Za.push(a) - 1);
    b = `UnnamedComponent${b}`;
  }
  return b;
}
const eb = a => {
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
const ib = (a, b) => {
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
function jb(a, b) {
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
        return d.replace(e, (k, ...l) => {
          g = Error();
          try {
            return this.j ? k : f.call(this, k, ...l);
          } catch (h) {
            ib(g, h);
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
;const kb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), lb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`;
async function mb(a, b) {
  return nb(a, b);
}
class ob extends ta {
  constructor(a, b) {
    super(b);
    this.g = (Array.isArray(a) ? a : [a]).filter(gb);
    this.j = !1;
    this.s = b;
  }
  async replace(a, b) {
    const c = new ob(this.g, this.s);
    b && Object.assign(c, b);
    a = await mb(c, a);
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
            ib(f, h);
          }
        });
        if (e.length) {
          try {
            const k = await Promise.all(e);
            b = b.replace(c, () => k.shift());
          } catch (k) {
            ib(f, k);
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
      a = pa(d.stack), d.stack = a, c(d);
    }
  }
}
async function nb(a, b) {
  b instanceof ra ? b.pipe(a) : a.end(b);
  return await xa(a);
}
;const pb = a => {
  a = `(${a.join("|")})`;
  return new RegExp(`(\\n)?( *)(<${a}${"(?:\\s+(?!\\/>)[^>]*?)?"}(?:\\s*?/>|>[\\s\\S]*?<\\/\\4>))`, "gm");
};
var qb = tty;
const {debuglog:rb, format:sb, inspect:tb} = util;
/*

 Copyright (c) 2016 Zeit, Inc.
 https://npmjs.org/ms
*/
function ub(a) {
  var b = {}, c = typeof a;
  if ("string" == c && 0 < a.length) {
    return vb(a);
  }
  if ("number" == c && isFinite(a)) {
    return b.S ? (b = Math.abs(a), a = 864E5 <= b ? wb(a, b, 864E5, "day") : 36E5 <= b ? wb(a, b, 36E5, "hour") : 6E4 <= b ? wb(a, b, 6E4, "minute") : 1000 <= b ? wb(a, b, 1000, "second") : a + " ms") : (b = Math.abs(a), a = 864E5 <= b ? Math.round(a / 864E5) + "d" : 36E5 <= b ? Math.round(a / 36E5) + "h" : 6E4 <= b ? Math.round(a / 6E4) + "m" : 1000 <= b ? Math.round(a / 1000) + "s" : a + "ms"), a;
  }
  throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(a));
}
function vb(a) {
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
function wb(a, b, c, d) {
  return Math.round(a / c) + " " + d + (b >= 1.5 * c ? "s" : "");
}
;/*
 bytes
 Copyright(c) 2012-2014 TJ Holowaychuk
 Copyright(c) 2015 Jed Watson
 MIT Licensed
*/
const xb = /\B(?=(\d{3})+(?!\d))/g, yb = /(?:\.0*|(\.[^0]+)0+)$/, T = {b:1, kb:1024, mb:1048576, gb:1073741824, tb:Math.pow(1024, 4), pb:Math.pow(1024, 5)};
function U(a, b) {
  if (!Number.isFinite(a)) {
    return null;
  }
  const c = Math.abs(a), d = b && b.T || "", e = b && b.V || "", f = b && void 0 !== b.G ? b.G : 2, g = !(!b || !b.P);
  (b = b && b.U || "") && T[b.toLowerCase()] || (b = c >= T.pb ? "PB" : c >= T.tb ? "TB" : c >= T.gb ? "GB" : c >= T.mb ? "MB" : c >= T.kb ? "KB" : "B");
  a = (a / T[b.toLowerCase()]).toFixed(f);
  g || (a = a.replace(yb, "$1"));
  d && (a = a.replace(xb, d));
  return a + e + b;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function zb(a, b, c) {
  let d = a[a.length - 1];
  d && d.l === b && d.u === c ? a[a.length - 1] = {count:d.count + 1, l:b, u:c} : a.push({count:1, l:b, u:c});
}
function Ab(a, b, c, d, e) {
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
function Bb(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
class Cb {
  diff(a, b) {
    a = Bb(a.split(""));
    b = Bb(b.split(""));
    let c = b.length, d = a.length, e = 1, f = c + d, g = [{i:-1, m:[]}];
    var k = Ab(this, g[0], b, a, 0);
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
            !p || h && l.i < m.i ? (l = {i:m.i, m:m.m.slice(0)}, zb(l.m, void 0, !0)) : (l.i++, zb(l.m, !0, void 0));
            h = Ab(this, l, b, a, k);
            if (l.i + 1 >= c && h + 1 >= d) {
              k = Db(this, l.m, b, a);
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
function Db(a, b, c, d) {
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
;const Eb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Fb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function W(a, b) {
  return (b = Eb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Gb(a, b) {
  return (b = Fb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;var Hb = {f:U, ["fy"](a) {
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
const Ib = Object.keys(process.env).filter(a => /^debug_/i.test(a)).reduce((a, b) => {
  const c = b.substring(6).toLowerCase().replace(/_([a-z])/g, (d, e) => e.toUpperCase());
  b = process.env[b];
  /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : "null" === b ? b = null : b = Number(b);
  a[c] = b;
  return a;
}, {}), Jb = {init:function(a) {
  a.inspectOpts = {...Ib};
}, log:function(...a) {
  return process.stderr.write(sb(...a) + "\n");
}, formatArgs:function(a) {
  const {namespace:b, useColors:c, color:d, diff:e} = this;
  if (c) {
    const f = "\u001b[3" + (8 > d ? d : "8;5;" + d), g = `  ${f};1m${b} \u001B[0m`;
    a[0] = g + a[0].split("\n").join("\n" + g);
    a.push(f + "m+" + ub(e) + "\u001b[0m");
  } else {
    a[0] = (Ib.hideDate ? "" : (new Date).toISOString() + " ") + b + " " + a[0];
  }
}, save:function(a) {
  a ? process.env.DEBUG = a : delete process.env.DEBUG;
}, load:function() {
  return process.env.DEBUG;
}, useColors:function() {
  return "colors" in Ib ? !!Ib.colors : qb.isatty(process.stderr.fd);
}, colors:[6, 2, 3, 4, 5, 1], inspectOpts:Ib, formatters:{o:function(a) {
  return tb(a, {...this.inspectOpts, colors:this.useColors}).replace(/\s*\n\s*/g, " ");
}, O:function(a) {
  return tb(a, {...this.inspectOpts, colors:this.useColors});
}, ...Hb}};
function Kb(a) {
  function b(...g) {
    if (b.enabled) {
      var k = Number(new Date);
      b.diff = k - (f || k);
      b.prev = f;
      f = b.curr = k;
      g[0] = Lb(g[0]);
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
function Mb(a) {
  const b = Kb(a);
  "function" == typeof a.init && a.init(b);
  a.g.push(b);
  return b;
}
function Nb(a, b) {
  let c = 0;
  for (let d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d), c |= 0;
  }
  return a.colors[Math.abs(c) % a.colors.length];
}
function Ob(a) {
  var b = Jb.load();
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
class Pb {
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
function Lb(a) {
  return a instanceof Error ? a.stack || a.message : a;
}
;const {createHash:Qb} = _crypto;
require("./init");
require("./make-io");
require("./start");
require("./preact-proxy");
require("./start-plain");
var Rb;
Rb = function() {
  const a = new Pb(Jb);
  return function(b) {
    const c = Mb(a);
    c.namespace = b;
    c.useColors = Jb.useColors();
    c.enabled = a.enabled(b);
    c.color = Nb(a, b);
    c.destroy = function() {
      a.destroy(this);
    };
    c.extend = function(d, e) {
      d = this.namespace + (void 0 === e ? ":" : e) + d;
      d.log = this.log;
      return d;
    };
    Ob(a);
    return c;
  };
}()("competent");
const Sb = (a, b) => {
  let c;
  "string" == typeof a ? c = a : Array.isArray(a) ? c = a.map(d => "string" == typeof d ? d : cb(d, b)).join("\n") : c = cb(a, b);
  return c;
}, Ub = async({getReplacements:a, key:b, D:c, re:d, replacement:e, getContext:f, A:g, position:k, body:l}) => {
  let h;
  a ? h = a(b, c) : c ? h = {re:Tb(d, b), replacement:e} : h = {re:d, replacement:e};
  a = new ob(h);
  f && (b = f(g, {position:k, key:b}), Object.assign(a, b));
  return await mb(a, l);
}, Tb = (a, b) => new RegExp(a.source.replace(new RegExp(`([|(])${b}([|)])`), (c, d, e) => "|" == d && "|" == e ? "|" : ")" == e ? e : "(" == d ? d : ""), a.flags);
const Vb = async a => {
  try {
    return await I(B, a);
  } catch (b) {
    return null;
  }
};
const Z = async(a, b) => {
  b && (b = P(b), a = Q(b, a));
  var c = await Vb(a);
  b = a;
  let d = !1;
  if (!c) {
    if (b = await Wb(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let e;
      a.endsWith("/") || (e = b = await Wb(a), c = !0);
      if (!e) {
        b = await Wb(Q(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? Ba("", b) : b, R:d};
}, Wb = async a => {
  a = `${a}.js`;
  let b = await Vb(a);
  b || (a = `${a}x`);
  if (b = await Vb(a)) {
    return a;
  }
};
const {fork:Xb, spawn:Yb} = child_process;
const Zb = async a => {
  const [b, c, d] = await Promise.all([new Promise((e, f) => {
    a.on("error", f).on("exit", g => {
      e(g);
    });
  }), a.stdout ? xa(a.stdout) : void 0, a.stderr ? xa(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const $b = (a, b) => a.some(c => c == b), ac = (a, b) => {
  const c = $b(a, "index.md"), d = $b(a, "footer.md"), e = ["index.md", "footer.md"];
  a = a.filter(f => !e.includes(f)).sort((f, g) => {
    f = f.localeCompare(g, void 0, {numeric:!0});
    return b ? -f : f;
  });
  return c && d ? ["index.md", ...a, "footer.md"] : c ? ["index.md", ...a] : d ? [...a, "footer.md"] : a;
};
const bc = rb("pedantry"), dc = async({stream:a, source:b, path:c = ".", content:d = {}, reverse:e = !1, separator:f, includeFilename:g, ignoreHidden:k}) => {
  var l = Object.keys(d);
  l = await ac(l, e).reduce(async(h, m) => {
    h = await h;
    const {type:p, content:n} = d[m], r = Q(c, m);
    let t;
    "File" == p ? k && m.startsWith(".") || (t = await cc({stream:a, source:b, path:r, separator:f, includeFilename:g})) : "Directory" == p && (t = await dc({stream:a, source:b, path:r, content:n, reverse:e, separator:f, includeFilename:g, ignoreHidden:k}));
    return h + t;
  }, 0);
  bc("dir %s size: %s B", c, l);
  return l;
}, cc = async a => {
  const {stream:b, source:c, path:d, separator:e, includeFilename:f} = a, g = Q(c, d);
  b.emit("file", d);
  e && !b.B && (f ? b.push({file:"separator", data:e}) : b.push(e));
  a = await new Promise((k, l) => {
    let h = 0;
    const m = aa(g);
    m.on("data", p => {
      h += p.byteLength;
    }).on("error", p => {
      l(p);
    }).on("close", () => {
      k(h);
    });
    if (f) {
      m.on("data", p => {
        b.push({file:g, data:`${p}`});
      });
    } else {
      m.pipe(b, {end:!1});
    }
  });
  b.B = !1;
  bc("file %s :: %s B", g, a);
  return a;
};
class ec extends sa {
  constructor(a, b = {}) {
    const {reverse:c = !1, addNewLine:d = !1, addBlankLine:e = !1, includeFilename:f = !1, ignoreHidden:g = !1} = b;
    super({objectMode:f});
    let k;
    d ? k = "\n" : e && (k = "\n\n");
    this.B = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await Ia(a));
      } catch (h) {
        this.emit("error", Error(h.message));
      }
      try {
        await dc({stream:this, source:a, content:l, reverse:c, separator:k, includeFilename:f, ignoreHidden:g});
      } catch (h) {
        this.emit("error", h);
      } finally {
        this.end();
      }
    })();
  }
}
;const {builtinModules:fc} = _module;
const gc = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, hc = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, ic = /^ *import\s+(['"])(.+?)\1/gm, jc = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, kc = a => [gc, hc, ic, jc].reduce((b, c) => {
  c = Ma(c, a, ["q", "from"]).map(d => d.from);
  return [...b, ...c];
}, []);
const mc = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = Q(a, "node_modules", b);
  f = Q(f, "package.json");
  const g = await Vb(f);
  if (g) {
    a = await lc(f, d);
    if (void 0 === a) {
      throw Error(`The package ${Ba("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:k, version:l, packageName:h, main:m, entryExists:p, ...n} = a;
    return {entry:Ba("", k), packageJson:Ba("", f), ...l ? {version:l} : {}, packageName:h, ...m ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...n};
  }
  if ("/" == a && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return mc(Q(Ca(a), ".."), b, c);
}, lc = async(a, b = []) => {
  const c = await ya(a);
  let d, e, f, g, k;
  try {
    ({module:d, version:e, name:f, main:g, ...k} = JSON.parse(c)), k = b.reduce((h, m) => {
      h[m] = k[m];
      return h;
    }, {});
  } catch (h) {
    throw Error(`Could not parse ${a}.`);
  }
  a = P(a);
  b = d || g;
  if (!b) {
    if (!await Vb(Q(a, "index.js"))) {
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
const nc = a => /^[./]/.test(a), oc = async(a, b, c, d, e = null) => {
  const f = H(), g = P(a);
  b = b.map(async k => {
    if (fc.includes(k)) {
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
        let [p, n, ...r] = k.split("/");
        !p.startsWith("@") && n ? (r = [n, ...r], n = p) : n = p.startsWith("@") ? `${p}/${n}` : p;
        l = {name:n, paths:r.join("/")};
      }
      const {name:h, paths:m} = l;
      if (m) {
        const {packageJson:p, packageName:n} = await mc(g, h);
        k = P(p);
        ({path:k} = await Z(Q(k, m)));
        return {entry:k, package:n};
      }
    }
    try {
      const {entry:h, packageJson:m, version:p, packageName:n, hasMain:r, ...t} = await mc(g, k, {fields:d});
      return n == e ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", n, a), null) : {entry:h, packageJson:m, version:p, name:n, ...r ? {hasMain:r} : {}, ...t};
    } catch (h) {
      if (c) {
        return null;
      }
      throw f(h);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, qc = async(a, b = {}, {nodeModules:c = !0, shallow:d = !1, soft:e = !1, fields:f = [], L:g = {}, mergeSameNodeModules:k = !0, package:l} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var h = await ya(a), m = kc(h);
  h = pc(h);
  m = c ? m : m.filter(nc);
  h = c ? h : h.filter(nc);
  try {
    const n = await oc(a, m, e, f, l), r = await oc(a, h, e, f, l);
    r.forEach(t => {
      t.required = !0;
    });
    var p = [...n, ...r];
  } catch (n) {
    throw n.message = `${a}\n [!] ${n.message}`, n;
  }
  l = k ? p.map(n => {
    const {name:r, version:t, required:y} = n;
    if (r && t) {
      const q = `${r}:${t}${y ? "-required" : ""}`, C = g[q];
      if (C) {
        return C;
      }
      g[q] = n;
    }
    return n;
  }) : p;
  p = l.map(n => ({...n, from:a}));
  return await l.filter(({entry:n}) => n && !(n in b)).reduce(async(n, {entry:r, hasMain:t, packageJson:y, name:q, package:C}) => {
    if (y && d) {
      return n;
    }
    n = await n;
    q = (await qc(r, b, {nodeModules:c, shallow:d, soft:e, fields:f, package:q || C, L:g, mergeSameNodeModules:k})).map(v => ({...v, from:v.from ? v.from : r, ...!v.packageJson && t ? {hasMain:t} : {}}));
    return [...n, ...q];
  }, p);
}, pc = a => Ma(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a, ["q", "from"]).map(b => b.from);
const rc = async a => {
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
      m = await qc(m, l, {nodeModules:c, shallow:d, soft:e, fields:f, mergeSameNodeModules:g});
      h.push(...m);
      return h;
    }, []);
  } catch (l) {
    throw b(l);
  }
  return k.filter(({internal:l, entry:h}, m) => l ? k.findIndex(({internal:p}) => p == l) == m : k.findIndex(({entry:p}) => h == p) == m).map(l => {
    const {entry:h, internal:m} = l, p = k.filter(({internal:n, entry:r}) => {
      if (m) {
        return m == n;
      }
      if (h) {
        return h == r;
      }
    }).map(({from:n}) => n).filter((n, r, t) => t.indexOf(n) == r);
    return {...l, from:p};
  }).map(({package:l, ...h}) => l ? {package:l, ...h} : h);
};
const tc = (a, b, c = console.log) => {
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
    const {entry:g, C:k} = sc(f);
    c(W("+", "green"), g, k);
  });
  e.forEach(f => {
    const {entry:g, C:k} = sc(f);
    c(W("-", "red"), g, k);
  });
  return !1;
}, sc = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, C:a};
}, uc = async a => (await I(B, a)).mtime.getTime(), vc = async a => await Promise.all(a.map(async({entry:b, name:c, internal:d, version:e}) => {
  if (c) {
    return `${c} ${e}`;
  }
  if (d) {
    return d;
  }
  c = await uc(b);
  return `${b} ${c}`;
})), wc = async a => {
  const b = await rc(a), c = await vc(b);
  ({path:a} = await Z(a));
  return {mtime:await uc(a), hash:c, N:b};
};
const xc = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({promise:c} = new wa({rs:b}));
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
  async function c(n, r, t, y, q, C, v) {
    Rb("render %s", q);
    const da = Error("Skip render");
    try {
      const E = a[q], w = v.slice(0, C), M = v.slice(C + n.length);
      if (/\x3c!--\s*$/.test(w) && /^\s*--\x3e/.test(M)) {
        return n;
      }
      const [{content:L = "", props:G}] = Qa(q, y);
      y = [L];
      let K = !1, u = !0, A = !1;
      const D = {pretty:void 0, lineLength:void 0};
      let x, J, V, N;
      const O = e.call(this, {...G, children:y}, {export(z = !0, F = null) {
        K = z;
        F && (N = Object.entries(F).reduce((R, [S, hb]) => {
          if (void 0 === hb) {
            return R;
          }
          R[S] = hb;
          return R;
        }, {}));
      }, setPretty(z, F) {
        D.pretty = z;
        F && (D.lineLength = F);
      }, renderAgain(z = !0, F = !1) {
        u = z;
        A = F;
      }, setChildContext(z) {
        J = z;
      }, removeLine(z = !0) {
        V = z;
      }, skipRender() {
        throw da;
      }}, q, C, v);
      let X;
      try {
        const z = E.call(this, O);
        X = z instanceof Promise ? await z : z;
      } catch (z) {
        if (!z.message.startsWith("Class constructor")) {
          throw z;
        }
        const F = new E, R = F.serverRender ? F.serverRender(O) : F.render(O);
        X = R instanceof Promise ? await R : R;
        if (F.fileRender) {
          let S = await F.render(O);
          S = Sb(S, D);
          u && (S = await Ub({getContext:h.bind(this), getReplacements:m.bind(this), key:q, D:A, re:p, replacement:c, A:J, body:S}));
          await F.fileRender(S, O);
        }
      }
      if (K) {
        const z = Array.isArray(X) ? X[0] : X;
        x = z.attributes.id;
        x || (x = d.call(this, q, N || G), z.attributes.id = x);
      }
      let Y = Sb(X, D);
      if (!Y && V) {
        return g && g.call(this, q, G), "";
      }
      Y = (r || "") + Y.replace(/^/gm, t);
      u && (Y = await Ub({getContext:h ? h.bind(this) : void 0, getReplacements:m ? m.bind(this) : void 0, key:q, D:A, re:p, replacement:c, A:J, body:Y, position:C}));
      K && f.call(this, q, x, N || G, y);
      g && g.call(this, q, G);
      return Y;
    } catch (E) {
      if (E === da) {
        return n;
      }
      k && k.call(this, q, E, C, v);
      return l ? "" : n;
    }
  }
  const {getId:d, getProps:e = (n, r) => ({...n, ...r}), markExported:f, onSuccess:g, onFail:k, removeOnError:l = !1, getContext:h, getReplacements:m} = b, p = pb(Object.keys(a));
  return {re:p, replacement:c};
}, c:W, b:Gb, readDirStructure:Ia, clone:async(a, b) => {
  const c = await I(B, a), d = Aa(a);
  b = Q(b, d);
  c.isDirectory() ? await La(a, b) : c.isSymbolicLink() ? await Ka(a, b) : (await Da(b), await Ja(a, b));
}, Pedantry:ec, whichStream:async function(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = aa(b));
  "-" == c ? d.pipe(process.stdout) : c ? await xc(c, d, b) : e instanceof ua && (d.pipe(e), await new Promise((f, g) => {
    e.on("error", g);
    e.on("finish", f);
  }));
}, compare:async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:d, hash:e} = await wc(a);
  a = Qb("md5").update(JSON.stringify(e)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:d, hash:e, md5:a};
  }
  const {mtime:f, hash:g} = b;
  return d != f ? {result:!1, reason:"MTIME_CHANGE", mtime:d, hash:e, currentMtime:f, md5:a} : tc(g, e, c) ? {result:!0, md5:a} : {result:!1, mtime:d, hash:e, reason:"HASH_CHANGE", md5:a};
}, ensurePath:Da, read:ya, replace:nb, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([h = 0, m = 0], p) => {
    const n = b[p].split("\n").reduce((r, t) => t.length > r ? t.length : r, 0);
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
    const [n, ...r] = p;
    m = `${m}\t${n}`;
    const t = k("", g);
    p = r.map(y => `${t}\t${y}`);
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
  a = Yb(a, b, c);
  b = Zb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, fork:function(a, b, c) {
  if (!a) {
    throw Error("Please specify a module to fork");
  }
  a = Xb(a, b, c);
  b = Zb(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}, SyncReplaceable:jb, Replaceable:ob, makeMarkers:(a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = lb, getRegex:g = kb} = b || {}, k = g(d);
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
    return jb(e, f);
  }};
}, resolveDependency:Z, rexml:Qa, reduceUsage:a => Object.keys(a).reduce((b, c) => {
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
  const d = Sa(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [k, l]) => {
    g[k] = "string" == typeof l ? {short:l} : l;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [k, l]) => {
    let h;
    try {
      const {short:m, boolean:p, number:n, command:r, multiple:t} = l;
      if (r && t && d.length) {
        h = d;
      } else {
        if (r && d.length) {
          h = d[0];
        } else {
          const y = Ra(c, k, m, p, n);
          ({value:h} = y);
          const {index:q, length:C} = y;
          void 0 !== q && C && e.push({index:q, length:C});
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
}, Catchment:wa, collect:xa, clearr:a => a.split("\n").map(b => {
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
  return (new Cb).diff(a, b).map(({l:c, u:d, value:e}) => {
    const f = e.split(" ");
    return c ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => W(g, "green")).join(Gb(" ", "green")) : d ? f.map(g => g.replace(/\n$/mg, "\u23ce\n")).map(g => W(g, "red")).join(Gb(" ", "red")) : W(e, "grey");
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
}, makepromise:I, mismatch:Ma};


//# sourceMappingURL=index.js.map