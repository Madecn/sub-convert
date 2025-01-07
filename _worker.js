var Jt = Object.defineProperty;
var et = (e) => {
  throw TypeError(e);
};
var Qt = (e, i, t) => i in e ? Jt(e, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[i] = t;
var k = (e, i, t) => Qt(e, typeof i != "symbol" ? i + "" : i, t), He = (e, i, t) => i.has(e) || et("Cannot " + t);
var c = (e, i, t) => (He(e, i, "read from private field"), t ? t.call(e) : i.get(e)), x = (e, i, t) => i.has(e) ? et("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(e) : i.set(e, t), g = (e, i, t, n) => (He(e, i, "write to private field"), n ? n.call(e, t) : i.set(e, t), t), tt = (e, i, t) => (He(e, i, "access private method"), t);
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function xt(e) {
  return typeof e > "u" || e === null;
}
function Xt(e) {
  return typeof e == "object" && e !== null;
}
function Zt(e) {
  return Array.isArray(e) ? e : xt(e) ? [] : [e];
}
function ei(e, i) {
  var t, n, r, s;
  if (i)
    for (s = Object.keys(i), t = 0, n = s.length; t < n; t += 1)
      r = s[t], e[r] = i[r];
  return e;
}
function ti(e, i) {
  var t = "", n;
  for (n = 0; n < i; n += 1)
    t += e;
  return t;
}
function ii(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var ri = xt, ni = Xt, oi = Zt, si = ti, ai = ii, li = ei, _ = {
  isNothing: ri,
  isObject: ni,
  toArray: oi,
  repeat: si,
  isNegativeZero: ai,
  extend: li
};
function Ct(e, i) {
  var t = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (t += 'in "' + e.mark.name + '" '), t += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !i && e.mark.snippet && (t += `

` + e.mark.snippet), n + " " + t) : n;
}
function ge(e, i) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = i, this.message = Ct(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
ge.prototype = Object.create(Error.prototype);
ge.prototype.constructor = ge;
ge.prototype.toString = function(i) {
  return this.name + ": " + Ct(this, i);
};
var O = ge;
function Be(e, i, t, n, r) {
  var s = "", o = "", a = Math.floor(r / 2) - 1;
  return n - i > a && (s = " ... ", i = n - a + s.length), t - n > a && (o = " ...", t = n + a - o.length), {
    str: s + e.slice(i, t).replace(/\t/g, "→") + o,
    pos: n - i + s.length
    // relative position
  };
}
function Ve(e, i) {
  return _.repeat(" ", i - e.length) + e;
}
function ui(e, i) {
  if (i = Object.create(i || null), !e.buffer) return null;
  i.maxLength || (i.maxLength = 79), typeof i.indent != "number" && (i.indent = 1), typeof i.linesBefore != "number" && (i.linesBefore = 3), typeof i.linesAfter != "number" && (i.linesAfter = 2);
  for (var t = /\r?\n|\r|\0/g, n = [0], r = [], s, o = -1; s = t.exec(e.buffer); )
    r.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  var a = "", l, u, h = Math.min(e.line + i.linesAfter, r.length).toString().length, p = i.maxLength - (i.indent + h + 3);
  for (l = 1; l <= i.linesBefore && !(o - l < 0); l++)
    u = Be(
      e.buffer,
      n[o - l],
      r[o - l],
      e.position - (n[o] - n[o - l]),
      p
    ), a = _.repeat(" ", i.indent) + Ve((e.line - l + 1).toString(), h) + " | " + u.str + `
` + a;
  for (u = Be(e.buffer, n[o], r[o], e.position, p), a += _.repeat(" ", i.indent) + Ve((e.line + 1).toString(), h) + " | " + u.str + `
`, a += _.repeat("-", i.indent + h + 3 + u.pos) + `^
`, l = 1; l <= i.linesAfter && !(o + l >= r.length); l++)
    u = Be(
      e.buffer,
      n[o + l],
      r[o + l],
      e.position - (n[o] - n[o + l]),
      p
    ), a += _.repeat(" ", i.indent) + Ve((e.line + l + 1).toString(), h) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var ci = ui, pi = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], hi = [
  "scalar",
  "sequence",
  "mapping"
];
function di(e) {
  var i = {};
  return e !== null && Object.keys(e).forEach(function(t) {
    e[t].forEach(function(n) {
      i[String(n)] = t;
    });
  }), i;
}
function fi(e, i) {
  if (i = i || {}, Object.keys(i).forEach(function(t) {
    if (pi.indexOf(t) === -1)
      throw new O('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = i, this.tag = e, this.kind = i.kind || null, this.resolve = i.resolve || function() {
    return !0;
  }, this.construct = i.construct || function(t) {
    return t;
  }, this.instanceOf = i.instanceOf || null, this.predicate = i.predicate || null, this.represent = i.represent || null, this.representName = i.representName || null, this.defaultStyle = i.defaultStyle || null, this.multi = i.multi || !1, this.styleAliases = di(i.styleAliases || null), hi.indexOf(this.kind) === -1)
    throw new O('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var S = fi;
function it(e, i) {
  var t = [];
  return e[i].forEach(function(n) {
    var r = t.length;
    t.forEach(function(s, o) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (r = o);
    }), t[r] = n;
  }), t;
}
function mi() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, i, t;
  function n(r) {
    r.multi ? (e.multi[r.kind].push(r), e.multi.fallback.push(r)) : e[r.kind][r.tag] = e.fallback[r.tag] = r;
  }
  for (i = 0, t = arguments.length; i < t; i += 1)
    arguments[i].forEach(n);
  return e;
}
function $e(e) {
  return this.extend(e);
}
$e.prototype.extend = function(i) {
  var t = [], n = [];
  if (i instanceof S)
    n.push(i);
  else if (Array.isArray(i))
    n = n.concat(i);
  else if (i && (Array.isArray(i.implicit) || Array.isArray(i.explicit)))
    i.implicit && (t = t.concat(i.implicit)), i.explicit && (n = n.concat(i.explicit));
  else
    throw new O("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  t.forEach(function(s) {
    if (!(s instanceof S))
      throw new O("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new O("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new O("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof S))
      throw new O("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var r = Object.create($e.prototype);
  return r.implicit = (this.implicit || []).concat(t), r.explicit = (this.explicit || []).concat(n), r.compiledImplicit = it(r, "implicit"), r.compiledExplicit = it(r, "explicit"), r.compiledTypeMap = mi(r.compiledImplicit, r.compiledExplicit), r;
};
var gi = $e, bi = new S("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), vi = new S("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), xi = new S("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Ci = new gi({
  explicit: [
    bi,
    vi,
    xi
  ]
});
function wi(e) {
  if (e === null) return !0;
  var i = e.length;
  return i === 1 && e === "~" || i === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function yi() {
  return null;
}
function _i(e) {
  return e === null;
}
var Si = new S("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: wi,
  construct: yi,
  predicate: _i,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function Ai(e) {
  if (e === null) return !1;
  var i = e.length;
  return i === 4 && (e === "true" || e === "True" || e === "TRUE") || i === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function ki(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Ei(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Li = new S("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Ai,
  construct: ki,
  predicate: Ei,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function Oi(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Ri(e) {
  return 48 <= e && e <= 55;
}
function Ti(e) {
  return 48 <= e && e <= 57;
}
function Ni(e) {
  if (e === null) return !1;
  var i = e.length, t = 0, n = !1, r;
  if (!i) return !1;
  if (r = e[t], (r === "-" || r === "+") && (r = e[++t]), r === "0") {
    if (t + 1 === i) return !0;
    if (r = e[++t], r === "b") {
      for (t++; t < i; t++)
        if (r = e[t], r !== "_") {
          if (r !== "0" && r !== "1") return !1;
          n = !0;
        }
      return n && r !== "_";
    }
    if (r === "x") {
      for (t++; t < i; t++)
        if (r = e[t], r !== "_") {
          if (!Oi(e.charCodeAt(t))) return !1;
          n = !0;
        }
      return n && r !== "_";
    }
    if (r === "o") {
      for (t++; t < i; t++)
        if (r = e[t], r !== "_") {
          if (!Ri(e.charCodeAt(t))) return !1;
          n = !0;
        }
      return n && r !== "_";
    }
  }
  if (r === "_") return !1;
  for (; t < i; t++)
    if (r = e[t], r !== "_") {
      if (!Ti(e.charCodeAt(t)))
        return !1;
      n = !0;
    }
  return !(!n || r === "_");
}
function Fi(e) {
  var i = e, t = 1, n;
  if (i.indexOf("_") !== -1 && (i = i.replace(/_/g, "")), n = i[0], (n === "-" || n === "+") && (n === "-" && (t = -1), i = i.slice(1), n = i[0]), i === "0") return 0;
  if (n === "0") {
    if (i[1] === "b") return t * parseInt(i.slice(2), 2);
    if (i[1] === "x") return t * parseInt(i.slice(2), 16);
    if (i[1] === "o") return t * parseInt(i.slice(2), 8);
  }
  return t * parseInt(i, 10);
}
function Ii(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !_.isNegativeZero(e);
}
var Pi = new S("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Ni,
  construct: Fi,
  predicate: Ii,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Mi = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Ui(e) {
  return !(e === null || !Mi.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Di(e) {
  var i, t;
  return i = e.replace(/_/g, "").toLowerCase(), t = i[0] === "-" ? -1 : 1, "+-".indexOf(i[0]) >= 0 && (i = i.slice(1)), i === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : i === ".nan" ? NaN : t * parseFloat(i, 10);
}
var Hi = /^[-+]?[0-9]+e/;
function Bi(e, i) {
  var t;
  if (isNaN(e))
    switch (i) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (i) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (i) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (_.isNegativeZero(e))
    return "-0.0";
  return t = e.toString(10), Hi.test(t) ? t.replace("e", ".e") : t;
}
function Vi(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || _.isNegativeZero(e));
}
var ji = new S("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Ui,
  construct: Di,
  predicate: Vi,
  represent: Bi,
  defaultStyle: "lowercase"
}), $i = Ci.extend({
  implicit: [
    Si,
    Li,
    Pi,
    ji
  ]
}), Yi = $i, wt = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), yt = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function zi(e) {
  return e === null ? !1 : wt.exec(e) !== null || yt.exec(e) !== null;
}
function Wi(e) {
  var i, t, n, r, s, o, a, l = 0, u = null, h, p, f;
  if (i = wt.exec(e), i === null && (i = yt.exec(e)), i === null) throw new Error("Date resolve error");
  if (t = +i[1], n = +i[2] - 1, r = +i[3], !i[4])
    return new Date(Date.UTC(t, n, r));
  if (s = +i[4], o = +i[5], a = +i[6], i[7]) {
    for (l = i[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return i[9] && (h = +i[10], p = +(i[11] || 0), u = (h * 60 + p) * 6e4, i[9] === "-" && (u = -u)), f = new Date(Date.UTC(t, n, r, s, o, a, l)), u && f.setTime(f.getTime() - u), f;
}
function Gi(e) {
  return e.toISOString();
}
var Ki = new S("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: zi,
  construct: Wi,
  instanceOf: Date,
  represent: Gi
});
function qi(e) {
  return e === "<<" || e === null;
}
var Ji = new S("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: qi
}), qe = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Qi(e) {
  if (e === null) return !1;
  var i, t, n = 0, r = e.length, s = qe;
  for (t = 0; t < r; t++)
    if (i = s.indexOf(e.charAt(t)), !(i > 64)) {
      if (i < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Xi(e) {
  var i, t, n = e.replace(/[\r\n=]/g, ""), r = n.length, s = qe, o = 0, a = [];
  for (i = 0; i < r; i++)
    i % 4 === 0 && i && (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(o & 255)), o = o << 6 | s.indexOf(n.charAt(i));
  return t = r % 4 * 6, t === 0 ? (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(o & 255)) : t === 18 ? (a.push(o >> 10 & 255), a.push(o >> 2 & 255)) : t === 12 && a.push(o >> 4 & 255), new Uint8Array(a);
}
function Zi(e) {
  var i = "", t = 0, n, r, s = e.length, o = qe;
  for (n = 0; n < s; n++)
    n % 3 === 0 && n && (i += o[t >> 18 & 63], i += o[t >> 12 & 63], i += o[t >> 6 & 63], i += o[t & 63]), t = (t << 8) + e[n];
  return r = s % 3, r === 0 ? (i += o[t >> 18 & 63], i += o[t >> 12 & 63], i += o[t >> 6 & 63], i += o[t & 63]) : r === 2 ? (i += o[t >> 10 & 63], i += o[t >> 4 & 63], i += o[t << 2 & 63], i += o[64]) : r === 1 && (i += o[t >> 2 & 63], i += o[t << 4 & 63], i += o[64], i += o[64]), i;
}
function er(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var tr = new S("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Qi,
  construct: Xi,
  predicate: er,
  represent: Zi
}), ir = Object.prototype.hasOwnProperty, rr = Object.prototype.toString;
function nr(e) {
  if (e === null) return !0;
  var i = [], t, n, r, s, o, a = e;
  for (t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], o = !1, rr.call(r) !== "[object Object]") return !1;
    for (s in r)
      if (ir.call(r, s))
        if (!o) o = !0;
        else return !1;
    if (!o) return !1;
    if (i.indexOf(s) === -1) i.push(s);
    else return !1;
  }
  return !0;
}
function or(e) {
  return e !== null ? e : [];
}
var sr = new S("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: nr,
  construct: or
}), ar = Object.prototype.toString;
function lr(e) {
  if (e === null) return !0;
  var i, t, n, r, s, o = e;
  for (s = new Array(o.length), i = 0, t = o.length; i < t; i += 1) {
    if (n = o[i], ar.call(n) !== "[object Object]" || (r = Object.keys(n), r.length !== 1)) return !1;
    s[i] = [r[0], n[r[0]]];
  }
  return !0;
}
function ur(e) {
  if (e === null) return [];
  var i, t, n, r, s, o = e;
  for (s = new Array(o.length), i = 0, t = o.length; i < t; i += 1)
    n = o[i], r = Object.keys(n), s[i] = [r[0], n[r[0]]];
  return s;
}
var cr = new S("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: lr,
  construct: ur
}), pr = Object.prototype.hasOwnProperty;
function hr(e) {
  if (e === null) return !0;
  var i, t = e;
  for (i in t)
    if (pr.call(t, i) && t[i] !== null)
      return !1;
  return !0;
}
function dr(e) {
  return e !== null ? e : {};
}
var fr = new S("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: hr,
  construct: dr
}), _t = Yi.extend({
  implicit: [
    Ki,
    Ji
  ],
  explicit: [
    tr,
    sr,
    cr,
    fr
  ]
}), z = Object.prototype.hasOwnProperty, Te = 1, St = 2, At = 3, Ne = 4, je = 1, mr = 2, rt = 3, gr = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, br = /[\x85\u2028\u2029]/, vr = /[,\[\]\{\}]/, kt = /^(?:!|!!|![a-z\-]+!)$/i, Et = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function nt(e) {
  return Object.prototype.toString.call(e);
}
function U(e) {
  return e === 10 || e === 13;
}
function re(e) {
  return e === 9 || e === 32;
}
function R(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function se(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function xr(e) {
  var i;
  return 48 <= e && e <= 57 ? e - 48 : (i = e | 32, 97 <= i && i <= 102 ? i - 97 + 10 : -1);
}
function Cr(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function wr(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function ot(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function yr(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Lt = new Array(256), Ot = new Array(256);
for (var ne = 0; ne < 256; ne++)
  Lt[ne] = ot(ne) ? 1 : 0, Ot[ne] = ot(ne);
function _r(e, i) {
  this.input = e, this.filename = i.filename || null, this.schema = i.schema || _t, this.onWarning = i.onWarning || null, this.legacy = i.legacy || !1, this.json = i.json || !1, this.listener = i.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Rt(e, i) {
  var t = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return t.snippet = ci(t), new O(i, t);
}
function m(e, i) {
  throw Rt(e, i);
}
function Fe(e, i) {
  e.onWarning && e.onWarning.call(null, Rt(e, i));
}
var st = {
  YAML: function(i, t, n) {
    var r, s, o;
    i.version !== null && m(i, "duplication of %YAML directive"), n.length !== 1 && m(i, "YAML directive accepts exactly one argument"), r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), r === null && m(i, "ill-formed argument of the YAML directive"), s = parseInt(r[1], 10), o = parseInt(r[2], 10), s !== 1 && m(i, "unacceptable YAML version of the document"), i.version = n[0], i.checkLineBreaks = o < 2, o !== 1 && o !== 2 && Fe(i, "unsupported YAML version of the document");
  },
  TAG: function(i, t, n) {
    var r, s;
    n.length !== 2 && m(i, "TAG directive accepts exactly two arguments"), r = n[0], s = n[1], kt.test(r) || m(i, "ill-formed tag handle (first argument) of the TAG directive"), z.call(i.tagMap, r) && m(i, 'there is a previously declared suffix for "' + r + '" tag handle'), Et.test(s) || m(i, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      s = decodeURIComponent(s);
    } catch {
      m(i, "tag prefix is malformed: " + s);
    }
    i.tagMap[r] = s;
  }
};
function Y(e, i, t, n) {
  var r, s, o, a;
  if (i < t) {
    if (a = e.input.slice(i, t), n)
      for (r = 0, s = a.length; r < s; r += 1)
        o = a.charCodeAt(r), o === 9 || 32 <= o && o <= 1114111 || m(e, "expected valid JSON character");
    else gr.test(a) && m(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function at(e, i, t, n) {
  var r, s, o, a;
  for (_.isObject(t) || m(e, "cannot merge mappings; the provided source object is unacceptable"), r = Object.keys(t), o = 0, a = r.length; o < a; o += 1)
    s = r[o], z.call(i, s) || (i[s] = t[s], n[s] = !0);
}
function ae(e, i, t, n, r, s, o, a, l) {
  var u, h;
  if (Array.isArray(r))
    for (r = Array.prototype.slice.call(r), u = 0, h = r.length; u < h; u += 1)
      Array.isArray(r[u]) && m(e, "nested arrays are not supported inside keys"), typeof r == "object" && nt(r[u]) === "[object Object]" && (r[u] = "[object Object]");
  if (typeof r == "object" && nt(r) === "[object Object]" && (r = "[object Object]"), r = String(r), i === null && (i = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s))
      for (u = 0, h = s.length; u < h; u += 1)
        at(e, i, s[u], t);
    else
      at(e, i, s, t);
  else
    !e.json && !z.call(t, r) && z.call(i, r) && (e.line = o || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, m(e, "duplicated mapping key")), r === "__proto__" ? Object.defineProperty(i, r, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: s
    }) : i[r] = s, delete t[r];
  return i;
}
function Je(e) {
  var i;
  i = e.input.charCodeAt(e.position), i === 10 ? e.position++ : i === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : m(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function y(e, i, t) {
  for (var n = 0, r = e.input.charCodeAt(e.position); r !== 0; ) {
    for (; re(r); )
      r === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), r = e.input.charCodeAt(++e.position);
    if (i && r === 35)
      do
        r = e.input.charCodeAt(++e.position);
      while (r !== 10 && r !== 13 && r !== 0);
    if (U(r))
      for (Je(e), r = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; r === 32; )
        e.lineIndent++, r = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return t !== -1 && n !== 0 && e.lineIndent < t && Fe(e, "deficient indentation"), n;
}
function De(e) {
  var i = e.position, t;
  return t = e.input.charCodeAt(i), !!((t === 45 || t === 46) && t === e.input.charCodeAt(i + 1) && t === e.input.charCodeAt(i + 2) && (i += 3, t = e.input.charCodeAt(i), t === 0 || R(t)));
}
function Qe(e, i) {
  i === 1 ? e.result += " " : i > 1 && (e.result += _.repeat(`
`, i - 1));
}
function Sr(e, i, t) {
  var n, r, s, o, a, l, u, h, p = e.kind, f = e.result, d;
  if (d = e.input.charCodeAt(e.position), R(d) || se(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96 || (d === 63 || d === 45) && (r = e.input.charCodeAt(e.position + 1), R(r) || t && se(r)))
    return !1;
  for (e.kind = "scalar", e.result = "", s = o = e.position, a = !1; d !== 0; ) {
    if (d === 58) {
      if (r = e.input.charCodeAt(e.position + 1), R(r) || t && se(r))
        break;
    } else if (d === 35) {
      if (n = e.input.charCodeAt(e.position - 1), R(n))
        break;
    } else {
      if (e.position === e.lineStart && De(e) || t && se(d))
        break;
      if (U(d))
        if (l = e.line, u = e.lineStart, h = e.lineIndent, y(e, !1, -1), e.lineIndent >= i) {
          a = !0, d = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = o, e.line = l, e.lineStart = u, e.lineIndent = h;
          break;
        }
    }
    a && (Y(e, s, o, !1), Qe(e, e.line - l), s = o = e.position, a = !1), re(d) || (o = e.position + 1), d = e.input.charCodeAt(++e.position);
  }
  return Y(e, s, o, !1), e.result ? !0 : (e.kind = p, e.result = f, !1);
}
function Ar(e, i) {
  var t, n, r;
  if (t = e.input.charCodeAt(e.position), t !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (t = e.input.charCodeAt(e.position)) !== 0; )
    if (t === 39)
      if (Y(e, n, e.position, !0), t = e.input.charCodeAt(++e.position), t === 39)
        n = e.position, e.position++, r = e.position;
      else
        return !0;
    else U(t) ? (Y(e, n, r, !0), Qe(e, y(e, !1, i)), n = r = e.position) : e.position === e.lineStart && De(e) ? m(e, "unexpected end of the document within a single quoted scalar") : (e.position++, r = e.position);
  m(e, "unexpected end of the stream within a single quoted scalar");
}
function kr(e, i) {
  var t, n, r, s, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, t = n = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return Y(e, t, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (Y(e, t, e.position, !0), a = e.input.charCodeAt(++e.position), U(a))
        y(e, !1, i);
      else if (a < 256 && Lt[a])
        e.result += Ot[a], e.position++;
      else if ((o = Cr(a)) > 0) {
        for (r = o, s = 0; r > 0; r--)
          a = e.input.charCodeAt(++e.position), (o = xr(a)) >= 0 ? s = (s << 4) + o : m(e, "expected hexadecimal character");
        e.result += yr(s), e.position++;
      } else
        m(e, "unknown escape sequence");
      t = n = e.position;
    } else U(a) ? (Y(e, t, n, !0), Qe(e, y(e, !1, i)), t = n = e.position) : e.position === e.lineStart && De(e) ? m(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  m(e, "unexpected end of the stream within a double quoted scalar");
}
function Er(e, i) {
  var t = !0, n, r, s, o = e.tag, a, l = e.anchor, u, h, p, f, d, b = /* @__PURE__ */ Object.create(null), v, w, L, C;
  if (C = e.input.charCodeAt(e.position), C === 91)
    h = 93, d = !1, a = [];
  else if (C === 123)
    h = 125, d = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), C = e.input.charCodeAt(++e.position); C !== 0; ) {
    if (y(e, !0, i), C = e.input.charCodeAt(e.position), C === h)
      return e.position++, e.tag = o, e.anchor = l, e.kind = d ? "mapping" : "sequence", e.result = a, !0;
    t ? C === 44 && m(e, "expected the node content, but found ','") : m(e, "missed comma between flow collection entries"), w = v = L = null, p = f = !1, C === 63 && (u = e.input.charCodeAt(e.position + 1), R(u) && (p = f = !0, e.position++, y(e, !0, i))), n = e.line, r = e.lineStart, s = e.position, fe(e, i, Te, !1, !0), w = e.tag, v = e.result, y(e, !0, i), C = e.input.charCodeAt(e.position), (f || e.line === n) && C === 58 && (p = !0, C = e.input.charCodeAt(++e.position), y(e, !0, i), fe(e, i, Te, !1, !0), L = e.result), d ? ae(e, a, b, w, v, L, n, r, s) : p ? a.push(ae(e, null, b, w, v, L, n, r, s)) : a.push(v), y(e, !0, i), C = e.input.charCodeAt(e.position), C === 44 ? (t = !0, C = e.input.charCodeAt(++e.position)) : t = !1;
  }
  m(e, "unexpected end of the stream within a flow collection");
}
function Lr(e, i) {
  var t, n, r = je, s = !1, o = !1, a = i, l = 0, u = !1, h, p;
  if (p = e.input.charCodeAt(e.position), p === 124)
    n = !1;
  else if (p === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; p !== 0; )
    if (p = e.input.charCodeAt(++e.position), p === 43 || p === 45)
      je === r ? r = p === 43 ? rt : mr : m(e, "repeat of a chomping mode identifier");
    else if ((h = wr(p)) >= 0)
      h === 0 ? m(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? m(e, "repeat of an indentation width identifier") : (a = i + h - 1, o = !0);
    else
      break;
  if (re(p)) {
    do
      p = e.input.charCodeAt(++e.position);
    while (re(p));
    if (p === 35)
      do
        p = e.input.charCodeAt(++e.position);
      while (!U(p) && p !== 0);
  }
  for (; p !== 0; ) {
    for (Je(e), e.lineIndent = 0, p = e.input.charCodeAt(e.position); (!o || e.lineIndent < a) && p === 32; )
      e.lineIndent++, p = e.input.charCodeAt(++e.position);
    if (!o && e.lineIndent > a && (a = e.lineIndent), U(p)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      r === rt ? e.result += _.repeat(`
`, s ? 1 + l : l) : r === je && s && (e.result += `
`);
      break;
    }
    for (n ? re(p) ? (u = !0, e.result += _.repeat(`
`, s ? 1 + l : l)) : u ? (u = !1, e.result += _.repeat(`
`, l + 1)) : l === 0 ? s && (e.result += " ") : e.result += _.repeat(`
`, l) : e.result += _.repeat(`
`, s ? 1 + l : l), s = !0, o = !0, l = 0, t = e.position; !U(p) && p !== 0; )
      p = e.input.charCodeAt(++e.position);
    Y(e, t, e.position, !1);
  }
  return !0;
}
function lt(e, i) {
  var t, n = e.tag, r = e.anchor, s = [], o, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), !(l !== 45 || (o = e.input.charCodeAt(e.position + 1), !R(o)))); ) {
    if (a = !0, e.position++, y(e, !0, -1) && e.lineIndent <= i) {
      s.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (t = e.line, fe(e, i, At, !1, !0), s.push(e.result), y(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === t || e.lineIndent > i) && l !== 0)
      m(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < i)
      break;
  }
  return a ? (e.tag = n, e.anchor = r, e.kind = "sequence", e.result = s, !0) : !1;
}
function Or(e, i, t) {
  var n, r, s, o, a, l, u = e.tag, h = e.anchor, p = {}, f = /* @__PURE__ */ Object.create(null), d = null, b = null, v = null, w = !1, L = !1, C;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = p), C = e.input.charCodeAt(e.position); C !== 0; ) {
    if (!w && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), s = e.line, (C === 63 || C === 58) && R(n))
      C === 63 ? (w && (ae(e, p, f, d, b, null, o, a, l), d = b = v = null), L = !0, w = !0, r = !0) : w ? (w = !1, r = !0) : m(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, C = n;
    else {
      if (o = e.line, a = e.lineStart, l = e.position, !fe(e, t, St, !1, !0))
        break;
      if (e.line === s) {
        for (C = e.input.charCodeAt(e.position); re(C); )
          C = e.input.charCodeAt(++e.position);
        if (C === 58)
          C = e.input.charCodeAt(++e.position), R(C) || m(e, "a whitespace character is expected after the key-value separator within a block mapping"), w && (ae(e, p, f, d, b, null, o, a, l), d = b = v = null), L = !0, w = !1, r = !1, d = e.tag, b = e.result;
        else if (L)
          m(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = h, !0;
      } else if (L)
        m(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = h, !0;
    }
    if ((e.line === s || e.lineIndent > i) && (w && (o = e.line, a = e.lineStart, l = e.position), fe(e, i, Ne, !0, r) && (w ? b = e.result : v = e.result), w || (ae(e, p, f, d, b, v, o, a, l), d = b = v = null), y(e, !0, -1), C = e.input.charCodeAt(e.position)), (e.line === s || e.lineIndent > i) && C !== 0)
      m(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < i)
      break;
  }
  return w && ae(e, p, f, d, b, null, o, a, l), L && (e.tag = u, e.anchor = h, e.kind = "mapping", e.result = p), L;
}
function Rr(e) {
  var i, t = !1, n = !1, r, s, o;
  if (o = e.input.charCodeAt(e.position), o !== 33) return !1;
  if (e.tag !== null && m(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (t = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, r = "!!", o = e.input.charCodeAt(++e.position)) : r = "!", i = e.position, t) {
    do
      o = e.input.charCodeAt(++e.position);
    while (o !== 0 && o !== 62);
    e.position < e.length ? (s = e.input.slice(i, e.position), o = e.input.charCodeAt(++e.position)) : m(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !R(o); )
      o === 33 && (n ? m(e, "tag suffix cannot contain exclamation marks") : (r = e.input.slice(i - 1, e.position + 1), kt.test(r) || m(e, "named tag handle cannot contain such characters"), n = !0, i = e.position + 1)), o = e.input.charCodeAt(++e.position);
    s = e.input.slice(i, e.position), vr.test(s) && m(e, "tag suffix cannot contain flow indicator characters");
  }
  s && !Et.test(s) && m(e, "tag name cannot contain such characters: " + s);
  try {
    s = decodeURIComponent(s);
  } catch {
    m(e, "tag name is malformed: " + s);
  }
  return t ? e.tag = s : z.call(e.tagMap, r) ? e.tag = e.tagMap[r] + s : r === "!" ? e.tag = "!" + s : r === "!!" ? e.tag = "tag:yaml.org,2002:" + s : m(e, 'undeclared tag handle "' + r + '"'), !0;
}
function Tr(e) {
  var i, t;
  if (t = e.input.charCodeAt(e.position), t !== 38) return !1;
  for (e.anchor !== null && m(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position), i = e.position; t !== 0 && !R(t) && !se(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === i && m(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(i, e.position), !0;
}
function Nr(e) {
  var i, t, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), i = e.position; n !== 0 && !R(n) && !se(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === i && m(e, "name of an alias node must contain at least one character"), t = e.input.slice(i, e.position), z.call(e.anchorMap, t) || m(e, 'unidentified alias "' + t + '"'), e.result = e.anchorMap[t], y(e, !0, -1), !0;
}
function fe(e, i, t, n, r) {
  var s, o, a, l = 1, u = !1, h = !1, p, f, d, b, v, w;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, s = o = a = Ne === t || At === t, n && y(e, !0, -1) && (u = !0, e.lineIndent > i ? l = 1 : e.lineIndent === i ? l = 0 : e.lineIndent < i && (l = -1)), l === 1)
    for (; Rr(e) || Tr(e); )
      y(e, !0, -1) ? (u = !0, a = s, e.lineIndent > i ? l = 1 : e.lineIndent === i ? l = 0 : e.lineIndent < i && (l = -1)) : a = !1;
  if (a && (a = u || r), (l === 1 || Ne === t) && (Te === t || St === t ? v = i : v = i + 1, w = e.position - e.lineStart, l === 1 ? a && (lt(e, w) || Or(e, w, v)) || Er(e, v) ? h = !0 : (o && Lr(e, v) || Ar(e, v) || kr(e, v) ? h = !0 : Nr(e) ? (h = !0, (e.tag !== null || e.anchor !== null) && m(e, "alias node should not have any properties")) : Sr(e, v, Te === t) && (h = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (h = a && lt(e, w))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && m(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), p = 0, f = e.implicitTypes.length; p < f; p += 1)
      if (b = e.implicitTypes[p], b.resolve(e.result)) {
        e.result = b.construct(e.result), e.tag = b.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (z.call(e.typeMap[e.kind || "fallback"], e.tag))
      b = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (b = null, d = e.typeMap.multi[e.kind || "fallback"], p = 0, f = d.length; p < f; p += 1)
        if (e.tag.slice(0, d[p].tag.length) === d[p].tag) {
          b = d[p];
          break;
        }
    b || m(e, "unknown tag !<" + e.tag + ">"), e.result !== null && b.kind !== e.kind && m(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + b.kind + '", not "' + e.kind + '"'), b.resolve(e.result, e.tag) ? (e.result = b.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : m(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || h;
}
function Fr(e) {
  var i = e.position, t, n, r, s = !1, o;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (y(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37)); ) {
    for (s = !0, o = e.input.charCodeAt(++e.position), t = e.position; o !== 0 && !R(o); )
      o = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(t, e.position), r = [], n.length < 1 && m(e, "directive name must not be less than one character in length"); o !== 0; ) {
      for (; re(o); )
        o = e.input.charCodeAt(++e.position);
      if (o === 35) {
        do
          o = e.input.charCodeAt(++e.position);
        while (o !== 0 && !U(o));
        break;
      }
      if (U(o)) break;
      for (t = e.position; o !== 0 && !R(o); )
        o = e.input.charCodeAt(++e.position);
      r.push(e.input.slice(t, e.position));
    }
    o !== 0 && Je(e), z.call(st, n) ? st[n](e, n, r) : Fe(e, 'unknown document directive "' + n + '"');
  }
  if (y(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, y(e, !0, -1)) : s && m(e, "directives end mark is expected"), fe(e, e.lineIndent - 1, Ne, !1, !0), y(e, !0, -1), e.checkLineBreaks && br.test(e.input.slice(i, e.position)) && Fe(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && De(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, y(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    m(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Tt(e, i) {
  e = String(e), i = i || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var t = new _r(e, i), n = e.indexOf("\0");
  for (n !== -1 && (t.position = n, m(t, "null byte is not allowed in input")), t.input += "\0"; t.input.charCodeAt(t.position) === 32; )
    t.lineIndent += 1, t.position += 1;
  for (; t.position < t.length - 1; )
    Fr(t);
  return t.documents;
}
function Ir(e, i, t) {
  i !== null && typeof i == "object" && typeof t > "u" && (t = i, i = null);
  var n = Tt(e, t);
  if (typeof i != "function")
    return n;
  for (var r = 0, s = n.length; r < s; r += 1)
    i(n[r]);
}
function Pr(e, i) {
  var t = Tt(e, i);
  if (t.length !== 0) {
    if (t.length === 1)
      return t[0];
    throw new O("expected a single document in the stream, but found more");
  }
}
var Mr = Ir, Ur = Pr, Dr = {
  loadAll: Mr,
  load: Ur
}, Nt = Object.prototype.toString, Ft = Object.prototype.hasOwnProperty, Xe = 65279, Hr = 9, be = 10, Br = 13, Vr = 32, jr = 33, $r = 34, Ye = 35, Yr = 37, zr = 38, Wr = 39, Gr = 42, It = 44, Kr = 45, Ie = 58, qr = 61, Jr = 62, Qr = 63, Xr = 64, Pt = 91, Mt = 93, Zr = 96, Ut = 123, en = 124, Dt = 125, A = {};
A[0] = "\\0";
A[7] = "\\a";
A[8] = "\\b";
A[9] = "\\t";
A[10] = "\\n";
A[11] = "\\v";
A[12] = "\\f";
A[13] = "\\r";
A[27] = "\\e";
A[34] = '\\"';
A[92] = "\\\\";
A[133] = "\\N";
A[160] = "\\_";
A[8232] = "\\L";
A[8233] = "\\P";
var tn = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], rn = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function nn(e, i) {
  var t, n, r, s, o, a, l;
  if (i === null) return {};
  for (t = {}, n = Object.keys(i), r = 0, s = n.length; r < s; r += 1)
    o = n[r], a = String(i[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), l = e.compiledTypeMap.fallback[o], l && Ft.call(l.styleAliases, a) && (a = l.styleAliases[a]), t[o] = a;
  return t;
}
function on(e) {
  var i, t, n;
  if (i = e.toString(16).toUpperCase(), e <= 255)
    t = "x", n = 2;
  else if (e <= 65535)
    t = "u", n = 4;
  else if (e <= 4294967295)
    t = "U", n = 8;
  else
    throw new O("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + _.repeat("0", n - i.length) + i;
}
var sn = 1, ve = 2;
function an(e) {
  this.schema = e.schema || _t, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = _.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = nn(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? ve : sn, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function ut(e, i) {
  for (var t = _.repeat(" ", i), n = 0, r = -1, s = "", o, a = e.length; n < a; )
    r = e.indexOf(`
`, n), r === -1 ? (o = e.slice(n), n = a) : (o = e.slice(n, r + 1), n = r + 1), o.length && o !== `
` && (s += t), s += o;
  return s;
}
function ze(e, i) {
  return `
` + _.repeat(" ", e.indent * i);
}
function ln(e, i) {
  var t, n, r;
  for (t = 0, n = e.implicitTypes.length; t < n; t += 1)
    if (r = e.implicitTypes[t], r.resolve(i))
      return !0;
  return !1;
}
function Pe(e) {
  return e === Vr || e === Hr;
}
function xe(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Xe || 65536 <= e && e <= 1114111;
}
function ct(e) {
  return xe(e) && e !== Xe && e !== Br && e !== be;
}
function pt(e, i, t) {
  var n = ct(e), r = n && !Pe(e);
  return (
    // ns-plain-safe
    (t ? (
      // c = flow-in
      n
    ) : n && e !== It && e !== Pt && e !== Mt && e !== Ut && e !== Dt) && e !== Ye && !(i === Ie && !r) || ct(i) && !Pe(i) && e === Ye || i === Ie && r
  );
}
function un(e) {
  return xe(e) && e !== Xe && !Pe(e) && e !== Kr && e !== Qr && e !== Ie && e !== It && e !== Pt && e !== Mt && e !== Ut && e !== Dt && e !== Ye && e !== zr && e !== Gr && e !== jr && e !== en && e !== qr && e !== Jr && e !== Wr && e !== $r && e !== Yr && e !== Xr && e !== Zr;
}
function cn(e) {
  return !Pe(e) && e !== Ie;
}
function me(e, i) {
  var t = e.charCodeAt(i), n;
  return t >= 55296 && t <= 56319 && i + 1 < e.length && (n = e.charCodeAt(i + 1), n >= 56320 && n <= 57343) ? (t - 55296) * 1024 + n - 56320 + 65536 : t;
}
function Ht(e) {
  var i = /^\n* /;
  return i.test(e);
}
var Bt = 1, We = 2, Vt = 3, jt = 4, oe = 5;
function pn(e, i, t, n, r, s, o, a) {
  var l, u = 0, h = null, p = !1, f = !1, d = n !== -1, b = -1, v = un(me(e, 0)) && cn(me(e, e.length - 1));
  if (i || o)
    for (l = 0; l < e.length; u >= 65536 ? l += 2 : l++) {
      if (u = me(e, l), !xe(u))
        return oe;
      v = v && pt(u, h, a), h = u;
    }
  else {
    for (l = 0; l < e.length; u >= 65536 ? l += 2 : l++) {
      if (u = me(e, l), u === be)
        p = !0, d && (f = f || // Foldable line = too long, and not more-indented.
        l - b - 1 > n && e[b + 1] !== " ", b = l);
      else if (!xe(u))
        return oe;
      v = v && pt(u, h, a), h = u;
    }
    f = f || d && l - b - 1 > n && e[b + 1] !== " ";
  }
  return !p && !f ? v && !o && !r(e) ? Bt : s === ve ? oe : We : t > 9 && Ht(e) ? oe : o ? s === ve ? oe : We : f ? jt : Vt;
}
function hn(e, i, t, n, r) {
  e.dump = function() {
    if (i.length === 0)
      return e.quotingType === ve ? '""' : "''";
    if (!e.noCompatMode && (tn.indexOf(i) !== -1 || rn.test(i)))
      return e.quotingType === ve ? '"' + i + '"' : "'" + i + "'";
    var s = e.indent * Math.max(1, t), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), a = n || e.flowLevel > -1 && t >= e.flowLevel;
    function l(u) {
      return ln(e, u);
    }
    switch (pn(
      i,
      a,
      e.indent,
      o,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      r
    )) {
      case Bt:
        return i;
      case We:
        return "'" + i.replace(/'/g, "''") + "'";
      case Vt:
        return "|" + ht(i, e.indent) + dt(ut(i, s));
      case jt:
        return ">" + ht(i, e.indent) + dt(ut(dn(i, o), s));
      case oe:
        return '"' + fn(i) + '"';
      default:
        throw new O("impossible error: invalid scalar style");
    }
  }();
}
function ht(e, i) {
  var t = Ht(e) ? String(i) : "", n = e[e.length - 1] === `
`, r = n && (e[e.length - 2] === `
` || e === `
`), s = r ? "+" : n ? "" : "-";
  return t + s + `
`;
}
function dt(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function dn(e, i) {
  for (var t = /(\n+)([^\n]*)/g, n = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, t.lastIndex = u, ft(e.slice(0, u), i);
  }(), r = e[0] === `
` || e[0] === " ", s, o; o = t.exec(e); ) {
    var a = o[1], l = o[2];
    s = l[0] === " ", n += a + (!r && !s && l !== "" ? `
` : "") + ft(l, i), r = s;
  }
  return n;
}
function ft(e, i) {
  if (e === "" || e[0] === " ") return e;
  for (var t = / [^ ]/g, n, r = 0, s, o = 0, a = 0, l = ""; n = t.exec(e); )
    a = n.index, a - r > i && (s = o > r ? o : a, l += `
` + e.slice(r, s), r = s + 1), o = a;
  return l += `
`, e.length - r > i && o > r ? l += e.slice(r, o) + `
` + e.slice(o + 1) : l += e.slice(r), l.slice(1);
}
function fn(e) {
  for (var i = "", t = 0, n, r = 0; r < e.length; t >= 65536 ? r += 2 : r++)
    t = me(e, r), n = A[t], !n && xe(t) ? (i += e[r], t >= 65536 && (i += e[r + 1])) : i += n || on(t);
  return i;
}
function mn(e, i, t) {
  var n = "", r = e.tag, s, o, a;
  for (s = 0, o = t.length; s < o; s += 1)
    a = t[s], e.replacer && (a = e.replacer.call(t, String(s), a)), (H(e, i, a, !1, !1) || typeof a > "u" && H(e, i, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = r, e.dump = "[" + n + "]";
}
function mt(e, i, t, n) {
  var r = "", s = e.tag, o, a, l;
  for (o = 0, a = t.length; o < a; o += 1)
    l = t[o], e.replacer && (l = e.replacer.call(t, String(o), l)), (H(e, i + 1, l, !0, !0, !1, !0) || typeof l > "u" && H(e, i + 1, null, !0, !0, !1, !0)) && ((!n || r !== "") && (r += ze(e, i)), e.dump && be === e.dump.charCodeAt(0) ? r += "-" : r += "- ", r += e.dump);
  e.tag = s, e.dump = r || "[]";
}
function gn(e, i, t) {
  var n = "", r = e.tag, s = Object.keys(t), o, a, l, u, h;
  for (o = 0, a = s.length; o < a; o += 1)
    h = "", n !== "" && (h += ", "), e.condenseFlow && (h += '"'), l = s[o], u = t[l], e.replacer && (u = e.replacer.call(t, l, u)), H(e, i, l, !1, !1) && (e.dump.length > 1024 && (h += "? "), h += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), H(e, i, u, !1, !1) && (h += e.dump, n += h));
  e.tag = r, e.dump = "{" + n + "}";
}
function bn(e, i, t, n) {
  var r = "", s = e.tag, o = Object.keys(t), a, l, u, h, p, f;
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new O("sortKeys must be a boolean or a function");
  for (a = 0, l = o.length; a < l; a += 1)
    f = "", (!n || r !== "") && (f += ze(e, i)), u = o[a], h = t[u], e.replacer && (h = e.replacer.call(t, u, h)), H(e, i + 1, u, !0, !0, !0) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && be === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, p && (f += ze(e, i)), H(e, i + 1, h, !0, p) && (e.dump && be === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, r += f));
  e.tag = s, e.dump = r || "{}";
}
function gt(e, i, t) {
  var n, r, s, o, a, l;
  for (r = t ? e.explicitTypes : e.implicitTypes, s = 0, o = r.length; s < o; s += 1)
    if (a = r[s], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof i == "object" && i instanceof a.instanceOf) && (!a.predicate || a.predicate(i))) {
      if (t ? a.multi && a.representName ? e.tag = a.representName(i) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Nt.call(a.represent) === "[object Function]")
          n = a.represent(i, l);
        else if (Ft.call(a.represent, l))
          n = a.represent[l](i, l);
        else
          throw new O("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function H(e, i, t, n, r, s, o) {
  e.tag = null, e.dump = t, gt(e, t, !1) || gt(e, t, !0);
  var a = Nt.call(e.dump), l = n, u;
  n && (n = e.flowLevel < 0 || e.flowLevel > i);
  var h = a === "[object Object]" || a === "[object Array]", p, f;
  if (h && (p = e.duplicates.indexOf(t), f = p !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && i > 0) && (r = !1), f && e.usedDuplicates[p])
    e.dump = "*ref_" + p;
  else {
    if (h && f && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (bn(e, i, e.dump, r), f && (e.dump = "&ref_" + p + e.dump)) : (gn(e, i, e.dump), f && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && i > 0 ? mt(e, i - 1, e.dump, r) : mt(e, i, e.dump, r), f && (e.dump = "&ref_" + p + e.dump)) : (mn(e, i, e.dump), f && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && hn(e, e.dump, i, s, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new O("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function vn(e, i) {
  var t = [], n = [], r, s;
  for (Ge(e, t, n), r = 0, s = n.length; r < s; r += 1)
    i.duplicates.push(t[n[r]]);
  i.usedDuplicates = new Array(s);
}
function Ge(e, i, t) {
  var n, r, s;
  if (e !== null && typeof e == "object")
    if (r = i.indexOf(e), r !== -1)
      t.indexOf(r) === -1 && t.push(r);
    else if (i.push(e), Array.isArray(e))
      for (r = 0, s = e.length; r < s; r += 1)
        Ge(e[r], i, t);
    else
      for (n = Object.keys(e), r = 0, s = n.length; r < s; r += 1)
        Ge(e[n[r]], i, t);
}
function xn(e, i) {
  i = i || {};
  var t = new an(i);
  t.noRefs || vn(e, t);
  var n = e;
  return t.replacer && (n = t.replacer.call({ "": n }, "", n)), H(t, 0, n, !0, !0) ? t.dump + `
` : "";
}
var Cn = xn, wn = {
  dump: Cn
}, $t = Dr.load, yn = wn.dump;
const Oe = {
  BACKEND: "https://url.v1.mk",
  LOCK_BACKEND: !1,
  REMOTE_CONFIG: "",
  CHUNK_COUNT: "20",
  SHORT_SERVER: "https://short.looby.us.kg"
};
function _n(e, i = 10) {
  const t = [];
  let n = [];
  return e.forEach((r, s) => {
    n.push(r), (s + 1) % i === 0 && (t.push(n.join("|")), n = []);
  }), n.length > 0 && t.push(n.join("|")), t;
}
const Re = {
  /** 默认不启用重试 */
  retries: 0,
  /** 默认重试间隔（毫秒） */
  retryDelay: 1e3,
  /** 默认需要重试的状态码 */
  retryOnStatusCodes: [500, 502, 503, 504]
};
async function Ze(e, i = Re) {
  const {
    retries: t = Re.retries,
    retryDelay: n = Re.retryDelay,
    retryOnStatusCodes: r = Re.retryOnStatusCodes,
    onError: s,
    ...o
  } = i;
  let a = 0;
  const l = async () => {
    a++;
    try {
      let u, h;
      e instanceof Request ? (h = e.url, u = new Request(e, o)) : (h = e.toString(), u = new Request(h, o));
      const p = await fetch(u), f = {
        status: p.status,
        statusText: p.statusText,
        headers: Object.fromEntries(p.headers.entries()),
        data: p,
        config: { url: h, ...o },
        ok: p.ok
      };
      if (r.includes(f.status) && a <= t) {
        if (s) {
          const d = s(new Error(`请求失败，状态码 ${f.status}`), a);
          d instanceof Promise && await d;
        }
        return await new Promise((d) => setTimeout(d, n)), l();
      }
      return f;
    } catch (u) {
      if (s) {
        const h = s(u, a);
        h instanceof Promise && await h;
      }
      if (a <= t)
        return await new Promise((h) => setTimeout(h, n)), l();
      throw u;
    }
  };
  return l();
}
function Ke(e) {
  if (!e) return e;
  const i = atob(e), t = new Uint8Array(i.length);
  for (let n = 0; n < i.length; n++)
    t[n] = i.charCodeAt(n);
  return new TextDecoder().decode(t);
}
function bt(e) {
  if (!e) return e;
  const i = new TextEncoder().encode(e.trim());
  let t = "";
  for (let n = 0; n < i.length; n += 1)
    t += String.fromCharCode(i[n]);
  return btoa(t);
}
class Sn {
  constructor(i = []) {
    k(this, "existVps", []);
    k(this, "existVpsMap", /* @__PURE__ */ new Map());
    this.existVps = i, this.updateExist(this.existVps);
  }
  updateExist(i = []) {
    for (const t of i) {
      const n = this.getParser(t);
      n && this.setExistVpsMap(n);
    }
  }
  updateVpsPs(i) {
    const t = this.getParser(i);
    if (!t) return null;
    const n = t.originPs, [r, s] = n.split("#");
    if (!s) return i;
    const o = this.existVpsMap.get(s) || 0, a = o === 0 ? n : `${r}#${s} ${o}`;
    return t.updateOriginConfig(a), this.existVpsMap.set(s, o + 1), t.originLink;
  }
  setExistVpsMap(i) {
    const t = i.originPs, [, n] = t.split("#");
    if (!n) return;
    const [r, s] = n.split(" "), o = s ? Number.parseInt(s) >>> 0 : 0, a = this.existVpsMap.get(r) || 0;
    this.existVpsMap.set(r, Math.max(a, o + 1));
  }
  getParser(i) {
    return i.startsWith("vless://") ? new Gt(i) : i.startsWith("vmess://") ? new Kt(i) : i.startsWith("trojan://") ? new Wt(i) : i.startsWith("ss://") ? new zt(i) : i.startsWith("hysteria2://") || i.startsWith("hysteria://") || i.startsWith("hy2://") ? new Yt(i) : null;
  }
}
class An extends Sn {
  constructor(i = []) {
    super(i);
  }
}
var Ce, we, ye, Me;
class Le {
  constructor() {
    x(this, Ce, ["localhost", "127.0.0.1", "abc.cba.com"]);
    x(this, we, ["AES_256_GCM", "CHACHA20_POLY1305", "AES_128_GCM", "CHACHA20_IETF"]);
    x(this, ye, 1024);
    x(this, Me, 65535);
  }
  /**
   * @description 获取随机uuid
   * @returns {crypto.UUID} crypto.UUID
   */
  getUUID() {
    return crypto.randomUUID();
  }
  /**
   * @description 获取随机username
   * @returns {string} username
   */
  getUsername() {
    return this.getUUID();
  }
  /**
   * @description 获取随机password
   * @returns {string} crypto.UUID
   */
  getPassword() {
    return this.getUUID();
  }
  getHost() {
    return `${this.getHostName()}:${this.getPort()}`;
  }
  /**
   * @description 获取随机hostname
   * @returns {string} hostname
   */
  getHostName() {
    return c(this, Ce)[Math.floor(Math.random() * c(this, Ce).length)];
  }
  /**
   * @description 获取随机端口
   * @returns {string} port
   */
  getPort() {
    return Math.floor(Math.random() * (c(this, Me) - c(this, ye) + 1) + c(this, ye)).toString();
  }
  /**
   * @description 获取随机 SS协议的加密类型
   */
  getEncrtptionProtocol() {
    return c(this, we)[Math.floor(Math.random() * c(this, we).length)];
  }
}
Ce = new WeakMap(), we = new WeakMap(), ye = new WeakMap(), Me = new WeakMap();
var W, G;
const T = class T {
  /**
   * @description 获取备注
   * @param {string} name
   * @returns {[string, string]} [origin, confuse]
   */
  static getPs(i) {
    const t = i.split(c(T, W));
    return [t[0], t[1]];
  }
  /**
   * @description 设置备注
   * @param {string} name 原始备注
   * @param {string} ps 混淆备注
   * @returns {string} origin^LINK_TO^confuse
   */
  static setPs(i, t) {
    return [i, t].join(c(T, W));
  }
  /**
   * @description 获取前缀（带缓存）
   * @param {string} name
   * @returns {string|null} prefix
   */
  static getPrefix(i) {
    if (!(i != null && i.includes(c(T, W)))) return null;
    if (c(T, G).has(i))
      return c(T, G).get(i);
    const [t] = T.getPs(i);
    if (t) {
      const n = t.trim();
      return c(T, G).set(i, n), n;
    }
    return null;
  }
  static isConfigType(i) {
    return i.includes(c(this, W));
  }
  // 清除缓存
  static clearCache() {
    c(this, G).clear();
  }
};
W = new WeakMap(), G = new WeakMap(), x(T, W, "^LINK_TO^"), x(T, G, /* @__PURE__ */ new Map());
let E = T;
var K, _e, B, N, q, le;
class Yt extends Le {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, K, "");
    /** * @description 混淆链接 */
    x(this, _e, "");
    /** * @description vps原始配置 */
    x(this, B, {});
    /** * @description 混淆配置 */
    x(this, N, {});
    /** * @description 原始备注 */
    x(this, q, "");
    /** * @description 混淆备注 */
    x(this, le, "");
    g(this, le, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, K, t), g(this, B, new URL(t)), g(this, q, c(this, B).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, B).hash = t, g(this, q, t), g(this, K, c(this, B).href), this.setConfuseConfig(c(this, K));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, N, new URL(t)), c(this, N).username = this.getUsername(), c(this, N).host = this.getHost(), c(this, N).hostname = this.getHostName(), c(this, N).port = this.getPort(), c(this, N).hash = E.setPs(c(this, q), c(this, le)), g(this, _e, c(this, N).href);
  }
  restoreClash(t, n) {
    var r;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(this.originConfig.port ?? 0), t.password = ((r = this.originConfig) == null ? void 0 : r.username) ?? "", t;
  }
  restoreSingbox(t, n) {
    var r;
    return t.password = ((r = this.originConfig) == null ? void 0 : r.username) ?? "", t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return c(this, q);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return c(this, K);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, B);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(c(this, le));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return c(this, _e);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, N);
  }
}
K = new WeakMap(), _e = new WeakMap(), B = new WeakMap(), N = new WeakMap(), q = new WeakMap(), le = new WeakMap();
var J, Se, V, F, Q, ue;
class zt extends Le {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, J, "");
    /** * @description 混淆链接 */
    x(this, Se, "");
    /** * @description vps原始配置 */
    x(this, V, {});
    /** * @description 混淆配置 */
    x(this, F, {});
    /** * @description 原始备注 */
    x(this, Q, "");
    /** * @description 混淆备注 */
    x(this, ue, "");
    g(this, ue, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, J, t), g(this, V, new URL(t)), g(this, Q, c(this, V).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, V).hash = t, g(this, Q, t), g(this, J, c(this, V).href), this.setConfuseConfig(c(this, J));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, F, new URL(t)), c(this, F).username = this.getUsername(), c(this, F).host = this.getHost(), c(this, F).hostname = this.getHostName(), c(this, F).port = this.getPort(), c(this, F).hash = E.setPs(c(this, Q), c(this, ue)), g(this, Se, c(this, F).href);
  }
  restoreClash(t, n) {
    var r;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(((r = this.originConfig) == null ? void 0 : r.port) ?? 0), t;
  }
  restoreSingbox(t, n) {
    return t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return c(this, Q);
  }
  /**
   * @description 原始链接
   * @example 'ss://...'
   */
  get originLink() {
    return c(this, J);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, V);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return c(this, ue);
  }
  /**
   * @description 混淆链接
   * @example 'ss://...'
   */
  get confuseLink() {
    return c(this, Se);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, F);
  }
}
J = new WeakMap(), Se = new WeakMap(), V = new WeakMap(), F = new WeakMap(), Q = new WeakMap(), ue = new WeakMap();
var X, Ae, j, I, Z, ce;
class Wt extends Le {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, X, "");
    /** * @description 混淆链接 */
    x(this, Ae, "");
    /** * @description vps原始配置 */
    x(this, j, {});
    /** * @description 混淆配置 */
    x(this, I, {});
    /** * @description 原始备注 */
    x(this, Z, "");
    /** * @description 混淆备注 */
    x(this, ce, "");
    g(this, ce, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, X, t), g(this, j, new URL(t)), g(this, Z, c(this, j).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, j).hash = t, g(this, Z, t), g(this, X, c(this, j).href), this.setConfuseConfig(c(this, X));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, I, new URL(t)), c(this, I).username = this.getUsername(), c(this, I).host = this.getHost(), c(this, I).hostname = this.getHostName(), c(this, I).port = this.getPort(), c(this, I).hash = E.setPs(c(this, Z), c(this, ce)), g(this, Ae, c(this, I).href);
  }
  restoreClash(t, n) {
    var r;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(this.originConfig.port ?? 0), t.password = ((r = this.originConfig) == null ? void 0 : r.username) ?? "", t;
  }
  restoreSingbox(t, n) {
    var r;
    return t.password = ((r = this.originConfig) == null ? void 0 : r.username) ?? "", t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return c(this, Z);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return c(this, X);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, j);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(c(this, ce));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return c(this, Ae);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, I);
  }
}
X = new WeakMap(), Ae = new WeakMap(), j = new WeakMap(), I = new WeakMap(), Z = new WeakMap(), ce = new WeakMap();
var ee, ke, $, P, te, pe;
class Gt extends Le {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, ee, "");
    /** * @description 混淆链接 */
    x(this, ke, "");
    /** * @description vps原始配置 */
    x(this, $, {});
    /** * @description 混淆配置 */
    x(this, P, {});
    /** * @description 原始备注 */
    x(this, te, "");
    /** * @description 混淆备注 */
    x(this, pe, "");
    g(this, pe, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, ee, t), g(this, $, new URL(t)), g(this, te, c(this, $).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, $).hash = t, g(this, te, t), g(this, ee, c(this, $).href), this.setConfuseConfig(c(this, ee));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, P, new URL(t)), c(this, P).username = this.getUsername(), c(this, P).host = this.getHost(), c(this, P).hostname = this.getHostName(), c(this, P).port = this.getPort(), c(this, P).hash = E.setPs(c(this, te), c(this, pe)), g(this, ke, c(this, P).href);
  }
  restoreClash(t, n) {
    var r;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(((r = this.originConfig) == null ? void 0 : r.port) ?? 0), t.uuid = this.originConfig.username ?? "", t;
  }
  restoreSingbox(t, n) {
    var r;
    return t.tag = n, t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.uuid = this.originConfig.username ?? "", (r = t.tls) != null && r.server_name && (t.tls.server_name = this.originConfig.hostname ?? ""), t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return c(this, te);
  }
  /**
   * @description 原始链接
   * @example 'vless://...'
   */
  get originLink() {
    return c(this, ee);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, $);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return c(this, pe);
  }
  /**
   * @description 混淆链接
   * @example 'vless://...'
   */
  get confuseLink() {
    return c(this, ke);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, P);
  }
}
ee = new WeakMap(), ke = new WeakMap(), $ = new WeakMap(), P = new WeakMap(), te = new WeakMap(), pe = new WeakMap();
var he, Ee, D, M, ie, de, Ue, qt;
class Kt extends Le {
  constructor(t) {
    super();
    x(this, Ue);
    /** * @description 原始链接 */
    x(this, he, "");
    /** * @description 混淆链接 */
    x(this, Ee, "");
    /** * @description vps原始配置 */
    x(this, D, {});
    /** * @description 混淆配置 */
    x(this, M, {});
    /** * @description 原始备注 */
    x(this, ie, "");
    /** * @description 混淆备注 */
    x(this, de, "");
    g(this, de, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig();
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    const [n, r] = t.match(/vmess:\/\/(.*)/) || [];
    g(this, he, t), g(this, D, JSON.parse(Ke(r))), g(this, ie, c(this, D).ps ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, D).ps = t, g(this, ie, t), g(this, he, `vmess://${bt(JSON.stringify(c(this, D)))}`), this.setConfuseConfig();
  }
  /**
   * @description 设置混淆配置
   */
  setConfuseConfig() {
    g(this, M, structuredClone(c(this, D))), c(this, M).add = this.getHostName(), c(this, M).port = this.getPort(), c(this, M).id = this.getPassword(), c(this, M).ps = E.setPs(c(this, ie), c(this, de)), g(this, Ee, `vmess://${bt(JSON.stringify(c(this, M)))}`);
  }
  restoreClash(t, n) {
    var r, s;
    return tt(this, Ue, qt).call(this, t), t.name = n, t.server = this.originConfig.add ?? "", t.port = Number(((r = this.originConfig) == null ? void 0 : r.port) ?? 0), t.uuid = ((s = this.originConfig) == null ? void 0 : s.id) ?? "", t;
  }
  restoreSingbox(t, n) {
    var r, s;
    return t.server = this.originConfig.add ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, (r = t.tls) != null && r.server_name && (t.tls.server_name = this.originConfig.add ?? ""), t.uuid = ((s = this.originConfig) == null ? void 0 : s.id) ?? "", t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return c(this, ie);
  }
  /**
   * @description 原始链接
   * @example 'vmess://...'
   */
  get originLink() {
    return c(this, he);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, D);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return c(this, de);
  }
  /**
   * @description 混淆链接
   * @example 'vmess://...'
   */
  get confuseLink() {
    return c(this, Ee);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, M);
  }
}
he = new WeakMap(), Ee = new WeakMap(), D = new WeakMap(), M = new WeakMap(), ie = new WeakMap(), de = new WeakMap(), Ue = new WeakSet(), qt = function(t) {
  t.network === "ws" && (t["ws-opts"] = {
    ...t["ws-opts"],
    path: this.originConfig.path,
    headers: {
      ...t["ws-opts"].headers,
      Host: this.originConfig.host
    }
  });
};
class kn extends An {
  constructor(t, n = []) {
    super(n);
    k(this, "urlSet", /* @__PURE__ */ new Set());
    k(this, "vpsStore", /* @__PURE__ */ new Map());
    k(this, "originUrls", /* @__PURE__ */ new Set());
    k(this, "vps", []);
    this.vps = t;
  }
  async parse(t = this.vps) {
    for await (const n of t) {
      const r = this.updateVpsPs(n);
      if (r) {
        let s = null;
        r.startsWith("vless://") ? s = new Gt(r) : r.startsWith("vmess://") ? s = new Kt(r) : r.startsWith("trojan://") ? s = new Wt(r) : r.startsWith("ss://") ? s = new zt(r) : this.isHysteria2(r) && (s = new Yt(r)), s && this.setStore(r, s);
      }
      if (n.startsWith("https://") || n.startsWith("http://")) {
        const s = await Ze(n, { retries: 3 }).then((a) => a.data.text());
        if (this.getSubType(s) === "base64") {
          this.updateExist(Array.from(this.originUrls));
          const a = Ke(s);
          await this.parse(a.split(`
`).filter(Boolean));
        }
      }
    }
  }
  setStore(t, n) {
    this.urlSet.add(n.confuseLink), this.originUrls.add(t), this.vpsStore.set(n.confusePs, n);
  }
  getSubType(t) {
    try {
      return Ke(t), "base64";
    } catch {
      try {
        return $t(t), "yaml";
      } catch {
        try {
          return JSON.parse(t), "json";
        } catch {
          return "unknown";
        }
      }
    }
  }
  isHysteria2(t) {
    return t.startsWith("hysteria2://") || t.startsWith("hysteria://") || t.startsWith("hy2://");
  }
  get urls() {
    return Array.from(this.urlSet);
  }
  get vpsMap() {
    return this.vpsStore;
  }
}
let En = class {
  async getConfig(i) {
    try {
      const t = await Promise.all(i.map((n) => Ze(n, { retries: 3 }).then((r) => r.data.text())));
      return this.setClashConfig(t);
    } catch (t) {
      throw new Error(t.message || t);
    }
  }
  setClashConfig(i) {
    const t = i.map((n) => $t(n));
    return this.mergeClashConfig(t);
  }
  /**
   * @description 合并配置
   * @param {ClashType[]} configs
   * @returns {ClashType} mergedConfig
   */
  mergeClashConfig(i = []) {
    var u, h, p, f;
    if (!i.length)
      return {};
    const t = structuredClone(i[0]);
    if (i.length === 1)
      return t;
    const n = {
      ...t,
      proxies: t.proxies || [],
      "proxy-groups": t["proxy-groups"] || []
    }, r = i.reduce((d, b) => {
      var v;
      return d + (((v = b.proxies) == null ? void 0 : v.length) || 0);
    }, 0), s = new Int32Array(r), o = new Set((u = t.proxies) == null ? void 0 : u.map((d) => d.name));
    let a = ((h = t.proxies) == null ? void 0 : h.length) || 0;
    const l = new Map(n["proxy-groups"].map((d) => [d.name, d]));
    for (let d = 1; d < i.length; d++) {
      const b = i[d];
      if ((p = b.proxies) != null && p.length)
        for (const v of b.proxies)
          o.has(v.name) || (n.proxies[a] = v, s[a] = a, o.add(v.name), a++);
      if ((f = b["proxy-groups"]) != null && f.length)
        for (const v of b["proxy-groups"]) {
          const w = l.get(v.name);
          if (w) {
            const L = new Set(w.proxies);
            for (const C of v.proxies || [])
              L.add(C);
            w.proxies = Array.from(L), Object.assign(w, {
              ...v,
              proxies: w.proxies
            });
          } else
            n["proxy-groups"].push(v), l.set(v.name, v);
        }
    }
    return n.proxies = n.proxies.filter((d, b) => s[b] !== -1), n;
  }
}, Ln = class {
  async getConfig(i) {
    try {
      const t = await Promise.all(
        i.map((n) => Ze(n, { retries: 3 }).then((r) => r.data.json()))
      );
      return this.mergeConfig(t);
    } catch (t) {
      throw new Error(t.message || t);
    }
  }
  mergeConfig(i) {
    var o, a;
    if (i.length === 0)
      return {};
    const t = structuredClone(i[0]), n = [], r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
    for (const l of i)
      if ((o = l.outbounds) != null && o.length) {
        for (const u of l.outbounds)
          if (u.outbounds) {
            const h = `${u.type}:${u.tag}`;
            if (!s.has(h)) {
              const p = new Set(u.outbounds.filter((f) => !E.isConfigType(f)));
              s.set(h, {
                base: u,
                baseOutbounds: p,
                linkOutbounds: /* @__PURE__ */ new Set()
              });
            }
            u.outbounds.forEach((p) => {
              var f;
              E.isConfigType(p) && ((f = s.get(h)) == null || f.linkOutbounds.add(p));
            });
          }
      }
    for (const l of i)
      if ((a = l.outbounds) != null && a.length) {
        for (const u of l.outbounds)
          if (!u.outbounds)
            if (E.isConfigType(u.tag))
              n.push(u);
            else {
              const h = `${u.type}:${u.tag}`;
              r.has(h) || (r.add(h), n.push(u));
            }
      }
    for (const [l, u] of s) {
      const h = { ...u.base }, p = /* @__PURE__ */ new Set([...u.baseOutbounds, ...u.linkOutbounds]);
      h.outbounds = Array.from(p), n.push(h);
    }
    return t.outbounds = n, t;
  }
};
class On {
  constructor(i) {
    k(this, "urls", []);
    k(this, "chunkCount", Number(Oe.CHUNK_COUNT));
    k(this, "backend", Oe.BACKEND);
    k(this, "parser", null);
    k(this, "clashClient", new En());
    k(this, "singboxClient", new Ln());
    this.chunkCount = Number(i.CHUNK_COUNT ?? Oe.CHUNK_COUNT), this.backend = i.BACKEND ?? Oe.BACKEND, this.parser = null;
  }
  async setSubUrls(i) {
    const { searchParams: t } = new URL(i.url), r = t.get("url").split(/\||\n/).filter(Boolean);
    this.parser = new kn(r), await this.parser.parse(r);
    const s = _n(Array.from(this.parser.urls), Number(this.chunkCount));
    this.urls = s.map((o) => {
      const a = new URL(`${this.backend}/sub`), { searchParams: l } = new URL(i.url);
      return l.set("url", o), a.search = l.toString(), a.toString();
    });
  }
  async getClashConfig() {
    return await this.clashClient.getConfig(this.urls);
  }
  async getSingboxConfig() {
    return await this.singboxClient.getConfig(this.urls);
  }
  get vpsStore() {
    var i;
    return (i = this.parser) == null ? void 0 : i.vpsMap;
  }
}
class Rn {
  constructor(i) {
    k(this, "confuseConfig");
    this.confuseConfig = i;
  }
  getOriginConfig(i) {
    try {
      return this.confuseConfig.proxies = this.restoreProxies(this.confuseConfig.proxies, i), this.confuseConfig["proxy-groups"] = this.confuseConfig["proxy-groups"].map((t) => (t.proxies && (t.proxies = this.updateProxiesGroups(t.proxies)), t)), this.confuseConfig;
    } catch (t) {
      throw new Error(`Get origin config failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  restoreProxies(i, t) {
    try {
      if (!i)
        return [];
      const n = [];
      for (const r of i) {
        const [s, o] = E.getPs(r.name);
        if (t.has(o)) {
          const a = t.get(o);
          a == null || a.restoreClash(r, s), n.push(r);
        }
      }
      return n;
    } catch (n) {
      throw new Error(`Restore proxies failed: ${n.message || n}, function trace: ${n.stack}`);
    }
  }
  updateProxiesGroups(i) {
    try {
      return i.map((t) => {
        const [n] = E.getPs(t);
        return n;
      });
    } catch (t) {
      throw new Error(`Update proxies groups failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
}
class Tn {
  constructor(i) {
    k(this, "confuseConfig");
    this.confuseConfig = i;
  }
  getOriginConfig(i) {
    try {
      return this.confuseConfig.outbounds = this.restoreOutbounds(this.confuseConfig.outbounds, i), this.confuseConfig;
    } catch (t) {
      throw new Error(`Get origin config failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  restoreOutbounds(i = [], t) {
    try {
      const n = [];
      for (const r of i) {
        if (this.isConfuseVps(r.tag)) {
          const [s, o] = E.getPs(r.tag), a = t.get(o);
          a == null || a.restoreSingbox(r, s);
        }
        Reflect.has(r, "outbounds") && (r.outbounds = this.updateOutbouns(r.outbounds)), n.push(r);
      }
      return n;
    } catch (n) {
      throw new Error(`Restore outbounds failed: ${n.message || n}, function trace: ${n.stack}`);
    }
  }
  updateOutbouns(i = []) {
    try {
      return i.map((t) => {
        if (this.isConfuseVps(t)) {
          const [n] = E.getPs(t);
          return n;
        }
        return t;
      });
    } catch (t) {
      throw new Error(`Update outbounds failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  isConfuseVps(i) {
    return E.isConfigType(i);
  }
}
class Nn {
  constructor(i) {
    this.confuse = i, this.confuse = i;
  }
  async getClashConfig() {
    const i = await this.confuse.getClashConfig();
    return new Rn(i).getOriginConfig(this.confuse.vpsStore);
  }
  async getSingboxConfig() {
    const i = await this.confuse.getSingboxConfig();
    return new Tn(i).getOriginConfig(this.confuse.vpsStore);
  }
}
function Fn() {
  return `
        <script>
            class SubButton extends HTMLElement {
                static get observedAttributes() {
                    return ['disabled', 'readonly', 'type'];
                }

                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.#render();
                }

                #injectStyle() {
                    const style = document.createElement('style');
                    style.textContent = \`
                        :host {
                            display: inline-block;
                        }

                        .sub-button {
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 4px 15px;
                            font-size: 14px;
                            border-radius: var(--radius);
                            border: 1px solid var(--border-color);
                            background: var(--background);
                            color: var(--text-primary);
                            cursor: pointer;
                            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                            user-select: none;
                            height: 32px;
                            min-width: 88px;
                            white-space: nowrap;
                            gap: 6px;
                        }

                        .sub-button:not(:disabled):not([readonly]):hover {
                            color: var(--primary-color);
                            border-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active {
                            opacity: 0.8;
                        }

                        .sub-button[type="primary"] {
                            background: var(--primary-color);
                            border-color: var(--primary-color);
                            color: #fff;
                        }

                        .sub-button[type="primary"]:not(:disabled):not([readonly]):hover {
                            background: var(--primary-hover);
                            border-color: var(--primary-hover);
                            color: #fff;
                        }

                        .sub-button:disabled,
                        .sub-button[readonly] {
                            cursor: not-allowed;
                            background-color: var(--background-disabled);
                            border-color: var(--border-color);
                            color: var(--text-disabled);
                        }

                        /* 波纹效果 */
                        .sub-button::after {
                            content: '';
                            position: absolute;
                            inset: -1px;
                            border-radius: inherit;
                            opacity: 0;
                            transition: all 0.2s;
                            background-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active::after {
                            opacity: 0.1;
                            transition: 0s;
                        }

                        /* 图标样式 */
                        ::slotted(svg) {
                            width: 16px;
                            height: 16px;
                            fill: currentColor;
                        }
                    \`;
                    this.shadowRoot.appendChild(style);
                }

                #injectElement() {
                    const button = document.createElement('button');
                    button.className = 'sub-button';

                    // 添加插槽
                    const slot = document.createElement('slot');
                    button.appendChild(slot);

                    this.shadowRoot.appendChild(button);
                }

                #render() {
                    this.#injectStyle();
                    this.#injectElement();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue === newValue) return;

                    const button = this.shadowRoot.querySelector('.sub-button');
                    if (!button) return;

                    switch (name) {
                        case 'disabled':
                            button.disabled = this.hasAttribute('disabled');
                            break;
                        case 'readonly':
                            button.setAttribute('readonly', '');
                            break;
                        case 'type':
                            button.setAttribute('type', newValue);
                            break;
                    }
                }
            }

            customElements.define('sub-button', SubButton);
        <\/script>
    `;
}
function In() {
  return `
    <script>
        class SubCheckbox extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled', 'key', 'span'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: []
                };
                this.#render();
            }

            #initValue() {
                const selectedValues = this.getAttribute('value') || [];

                if (selectedValues.length > 0) {
                    this.state.value = selectedValues;
                    this.#renderOptions();
                }
            }

            #injectStyle() {
                const style = document.createElement('style');
                const span = this.getAttribute('span') || 4;
                style.textContent = \`
                    :host {
                        display: block;
                        width: 100%;
                    }
                    .sub-checkbox-container {
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                    }
                    .sub-checkbox-container:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-checkbox-group {
                        display: grid;
                        grid-template-columns: repeat(\${span}, 1fr);
                        gap: 16px;
                        width: 100%;
                        height: 32px;
                    }
                    .sub-checkbox {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        user-select: none;
                        color: var(--text-primary);
                    }
                    .sub-checkbox__input {
                        position: relative;
                        width: 10px;
                        height: 10px;
                        border: 2px solid var(--border-color);
                        border-radius: 4px;
                        background-color: var(--background);
                        margin-right: 8px;
                        transition: all .3s;
                    }
                    .sub-checkbox__input::after {
                        content: '';
                        position: absolute;
                        top: 0px;
                        left: 3px;
                        width: 3px;
                        height: 6px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scaleY(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }
                    .sub-checkbox__input_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_checked::after {
                        transform: rotate(45deg) scaleY(1);
                    }

                    .sub-checkbox__label {
                        font-size: 14px;
                        line-height: 14px;
                    }

                    .sub-checkbox:hover .sub-checkbox__input:not(.sub-checkbox__input_disabled) {
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                    }
                    .sub-checkbox__label_disabled {
                        color: var(--text-disabled);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const container = document.createElement('div');
                container.className = 'sub-checkbox-container';

                const wrapper = document.createElement('div');
                wrapper.className = 'sub-checkbox-group';

                container.appendChild(wrapper);
                this.shadowRoot.appendChild(container);

                this.#renderOptions();
            }

            #renderOptions() {
                const wrapper = this.shadowRoot.querySelector('.sub-checkbox-group');
                wrapper.innerHTML = '';

                this.state.options.forEach(option => {
                    const checkbox = document.createElement('label');
                    checkbox.className = 'sub-checkbox';

                    const input = document.createElement('span');
                    input.className = 'sub-checkbox__input';
                    if (this.state.value.includes(option.value)) {
                        input.classList.add('sub-checkbox__input_checked');
                    }
                    if (this.hasAttribute('disabled')) {
                        input.classList.add('sub-checkbox__input_disabled');
                    }

                    const label = document.createElement('span');
                    label.className = 'sub-checkbox__label';
                    if (this.hasAttribute('disabled')) {
                        label.classList.add('sub-checkbox__label_disabled');
                    }
                    label.textContent = option.label;

                    checkbox.appendChild(input);
                    checkbox.appendChild(label);

                    if (!this.hasAttribute('disabled')) {
                        checkbox.addEventListener('click', () => this.#handleClick(option.value));
                    }

                    wrapper.appendChild(checkbox);
                });
            }

            #handleClick(value) {
                const index = this.state.value.indexOf(value);
                if (index === -1) {
                    this.state.value.push(value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderOptions();

                // 触发事件
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderOptions();
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#initValue(); // 设置选项后初始化选中状态
                            this.#renderOptions();
                        } catch (e) {
                            console.error('Invalid options format:', e);
                        }
                        break;
                    case 'disabled':
                        this.#renderOptions();
                        break;
                }
            }
        }
        customElements.define('sub-checkbox', SubCheckbox);
    <\/script>
    `;
}
function Pn() {
  return `
    <script>
        class SubForm extends HTMLElement {
            static get observedAttributes() {
                return ['model', 'label-width'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.model = {};
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'model' && oldValue !== newValue) {
                    try {
                        this.model = JSON.parse(newValue);
                        // 更新所有子组件的值
                        this.#updateChildrenValues();
                    } catch (e) {
                        console.error('Invalid model:', e);
                    }
                }
            }

            #updateChildrenValues() {
                // 找到所有带有 key 属性的子组件
                this.querySelectorAll('[key]').forEach(child => {
                    const key = child.getAttribute('key');
                    if (key && this.model[key] !== undefined) {
                        // 根据值的类型设置不同的格式
                        if (Array.isArray(this.model[key])) {
                            child.setAttribute('value', JSON.stringify(this.model[key]));
                        } else {
                            child.setAttribute('value', this.model[key]);
                        }
                    }
                });
            }

            connectedCallback() {
                const modelStr = this.getAttribute('model');
                if (modelStr) {
                    this.model = JSON.parse(modelStr);
                }

                this.addEventListener('update:value', e => {
                    const key = e.target.getAttribute('key');
                    if (key && this.model) {
                        this.model[key] = e.detail.value;
                        this.dispatchEvent(
                            new CustomEvent('form:change', {
                                detail: {
                                    key,
                                    value: e.detail.value,
                                    formData: this.model
                                },
                                bubbles: true
                            })
                        );
                    }
                });

                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                const labelWidth = this.getAttribute('label-width') || '80px';
                style.textContent = \`
                    :host {
                        display: block;
                    }
                    form {
                        margin: 0;
                        padding: 0;
                    }
                    ::slotted(sub-form-item) {
                        --label-width: \${labelWidth};
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const form = document.createElement('form');
                const slot = document.createElement('slot');
                form.appendChild(slot);
                this.shadowRoot.appendChild(form);

                this.#bindEvents(form);
            }

            #bindEvents(form) {
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    if (this.validate()) {
                        this.dispatchEvent(
                            new CustomEvent('submit', {
                                detail: this.getFormData(),
                                bubbles: true
                            })
                        );
                    }
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
                this.#bindEvents(this.shadowRoot.querySelector('form'));
            }
        }
        customElements.define('sub-form', SubForm);
    <\/script>
    `;
}
function Mn() {
  return `
    <script>
        class SubFormItem extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.#render();
            }

            #render() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: block;
                        margin-bottom: 24px;
                    }
                    .sub-form-item {
                        display: flex;
                        align-items: flex-start;
                        position: relative;
                    }
                    .sub-form-item__label {
                        flex: 0 0 auto;
                        width: var(--label-width, 80px);
                        text-align: right;
                        padding: 6px 12px 0 0;
                        color: var(--text-secondary);
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 500;
                        transition: var(--transition);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .sub-form-item__content {
                        flex: 1;
                        min-width: 0;
                        position: relative;
                        transition: var(--transition);
                    }
                    .sub-form-item__label.required::before {
                        content: '*';
                        color: #ff4d4f;
                        margin-right: 4px;
                    }
                    :host([disabled]) .sub-form-item__label {
                        color: var(--text-disabled);
                    }
                    :host([error]) .sub-form-item__label {
                        color: #ff4d4f;
                    }
                \`;

                const template = document.createElement('div');
                template.className = 'sub-form-item';

                const label = document.createElement('label');
                label.className = 'sub-form-item__label';
                label.textContent = this.getAttribute('label') || '';

                const content = document.createElement('div');
                content.className = 'sub-form-item__content';
                content.appendChild(document.createElement('slot'));

                template.appendChild(label);
                template.appendChild(content);

                this.shadowRoot.appendChild(style);
                this.shadowRoot.appendChild(template);
            }
        }
        customElements.define('sub-form-item', SubFormItem);
    <\/script>
    `;
}
function Un() {
  return `
    <script>
        class SubInput extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-input {
                        position: relative;
                        font-size: 14px;
                        display: inline-flex;
                        width: 100%;
                        line-height: 32px;
                    }
                    .sub-input__wrapper {
                        display: flex;
                        flex: 1;
                        align-items: center;
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        overflow: hidden;
                    }
                    .sub-input__wrapper:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-input__wrapper:focus-within {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-input__inner {
                        flex: 1;
                        padding: 0 15px;
                        background: none;
                        border: none;
                        outline: none;
                        color: var(--text-primary);
                        font-size: inherit;
                        height: 100%;
                    }
                    .sub-input__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-input__inner:disabled {
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                    }
                    .sub-input__append {
                        background-color: var(--background-secondary);
                        border-color: var(--border-color);
                    }
                    ::slotted(button) {
                        margin: 0;
                        height: 100%;
                        width: 100%;
                        background-color: var(--primary-color);
                        color: var(--background);
                        border: 1px solid var(--primary-color);
                        padding: 0 20px;
                        border-radius: 0 var(--radius) var(--radius) 0;
                        cursor: pointer;
                        font-size: 14px;
                        line-height: 32px;
                        white-space: nowrap;
                        transition: var(--transition);
                        position: relative;
                        outline: none;
                    }
                    ::slotted(button:hover) {
                        background-color: var(--primary-hover);
                        border-color: var(--primary-hover);
                    }
                    ::slotted(button:active) {
                        background-color: var(--primary-active);
                        border-color: var(--primary-active);
                    }
                    .sub-input__prepend,
                    .sub-input__append {
                        display: flex;
                        align-items: center;
                        background-color: var(--background-secondary);
                        color: var(--text-secondary);
                        white-space: nowrap;
                        padding: 0 15px;
                        border: 1px solid var(--border-color);
                        transition: var(--transition);
                    }
                    .sub-input__prepend {
                        border-right: 0;
                        border-radius: var(--radius) 0 0 var(--radius);
                    }
                    .sub-input__append {
                        padding: 0;
                        border-left: 0;
                        border-radius: 0 var(--radius) var(--radius) 0;
                    }
                    .sub-input__prepend ::slotted(*) {
                        color: var(--text-secondary);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-input';

                // prepend slot
                const prepend = document.createElement('div');
                prepend.className = 'sub-input__prepend';
                prepend.style.display = 'none'; // 默认隐藏
                const prependSlot = document.createElement('slot');
                prependSlot.name = 'prepend';
                prepend.appendChild(prependSlot);

                // input wrapper
                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'sub-input__wrapper';

                // input
                const input = document.createElement('input');
                input.className = 'sub-input__inner';
                input.value = this.state.value;
                input.placeholder = this.getAttribute('placeholder') || '';
                input.disabled = this.hasAttribute('disabled');
                inputWrapper.appendChild(input);

                // append slot
                const append = document.createElement('div');
                append.className = 'sub-input__append';
                append.style.display = 'none'; // 默认隐藏
                const appendSlot = document.createElement('slot');
                appendSlot.name = 'append';
                append.appendChild(appendSlot);

                wrapper.appendChild(prepend);
                wrapper.appendChild(inputWrapper);
                wrapper.appendChild(append);
                this.shadowRoot.appendChild(wrapper);

                // 监听插槽内容变化
                prependSlot.addEventListener('slotchange', e => {
                    const nodes = prependSlot.assignedNodes();
                    prepend.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopLeftRadius = '0';
                        inputWrapper.style.borderBottomLeftRadius = '0';
                    } else {
                        inputWrapper.style.borderTopLeftRadius = '4px';
                        inputWrapper.style.borderBottomLeftRadius = '4px';
                    }
                });

                appendSlot.addEventListener('slotchange', e => {
                    const nodes = appendSlot.assignedNodes();
                    append.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopRightRadius = '0';
                        inputWrapper.style.borderBottomRightRadius = '0';
                    } else {
                        inputWrapper.style.borderTopRightRadius = '4px';
                        inputWrapper.style.borderBottomRightRadius = '4px';
                    }
                });

                this.#bindEvents(input);
            }

            #bindEvents(input) {
                input.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const input = this.shadowRoot.querySelector('input');
                    if (input) {
                        input.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const input = this.shadowRoot.querySelector('input');
                if (!input) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        input.placeholder = newValue;
                        break;
                    case 'disabled':
                        input.disabled = this.hasAttribute('disabled');
                        break;
                }
            }
        }
        customElements.define('sub-input', SubInput);
    <\/script>
    `;
}
function Dn() {
  return `
        <style>
            /* 添加通知组件样式 */
            .notification-container {
                position: fixed;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: none;
            }

            .notification {
                padding: 9px 12px;
                margin-bottom: 8px;
                border-radius: 4px;
                background: var(--background);
                box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                display: inline-flex;
                align-items: center;
                gap: 8px;
                pointer-events: auto;
                animation: messageMove 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }

            .notification-icon {
                font-size: 16px;
                line-height: 1;
            }

            .notification.success .notification-icon {
                color: #52c41a;
            }

            .notification.error .notification-icon {
                color: #ff4d4f;
            }

            .notification.info .notification-icon {
                color: var(--primary-color);
            }

            .notification-content {
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
            }

            @keyframes messageMove {
                0% {
                    padding: 6px 12px;
                    opacity: 0;
                    transform: translateY(-100%);
                }
                100% {
                    padding: 9px 12px;
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>


        <script>
            class SubNotification {
                static instance = null;

                constructor() {
                    if (SubNotification.instance) {
                        return SubNotification.instance;
                    }
                    this.init();
                    SubNotification.instance = this;
                }

                init() {
                    const container = document.createElement('div');
                    container.className = 'notification-container';
                    document.body.appendChild(container);
                    this.container = container;
                }

                show(message, type = 'info', duration = 3000) {
                    const notification = document.createElement('div');
                    notification.className = \`notification \${type}\`;

                    // 添加图标
                    const icon = document.createElement('span');
                    icon.className = 'notification-icon';
                    icon.innerHTML = this.#getIconByType(type);

                    const content = document.createElement('span');
                    content.className = 'notification-content';
                    content.textContent = message;

                    notification.appendChild(icon);
                    notification.appendChild(content);
                    this.container.appendChild(notification);

                    const close = () => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateY(-100%)';
                        notification.style.transition = 'all .3s cubic-bezier(.645,.045,.355,1)';
                        setTimeout(() => {
                            this.container.removeChild(notification);
                        }, 300);
                    };

                    if (duration > 0) {
                        setTimeout(close, duration);
                    }
                }

                static success(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'success', duration);
                }

                static error(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'error', duration);
                }

                static info(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'info', duration);
                }

                #getIconByType(type) {
                    const icons = {
                        success: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="currentColor"/>
                        </svg>\`,
                        error: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                        </svg>\`,
                        info: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" fill="currentColor"/>
                        </svg>\`
                    };
                    return icons[type] || icons.info;
                }
            }

            // 添加到全局
            window.notification = SubNotification;
        <\/script>
    
    
    `;
}
function Hn() {
  return {
    arrow: `<svg viewBox="0 0 1024 1024" width="12" height="12">
                    <path d="M831.872 340.864L512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752-.064z" fill="currentColor"></path>
                </svg>`,
    empty: `<svg viewBox="0 0 1024 1024" width="64" height="64">
                    <path d="M855.6 427.2H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V450.4c0-12.8-11.2-23.2-24-23.2z" fill="#e6f0fc"></path>
                    <path d="M296 428.8h-128v372.8h128V428.8z m32 0v372.8h496V428.8H328z" fill="#ffffff"></path>
                    <path d="M440 176h144v76.8H440z" fill="#e6f0fc"></path>
                    <path d="M855.6 400H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V423.2c0-12.8-11.2-23.2-24-23.2z m-687.2 27.2h687.2v374.4H168.4V427.2z" fill="#4c98f7"></path>
                </svg>`
  };
}
const vt = Hn();
function Bn() {
  return `
    <script>
        class SubSelect extends HTMLElement {
           
            static get observedAttributes() {
                return ['value', 'options', 'placeholder', 'disabled', 'filterable'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.#init();
            }

            #render() {
                // 清空 shadowRoot
                this.shadowRoot.innerHTML = '';

                // 注入样式和元素
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state?.value || '';
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    // 更新输入框显示
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === val);
                    if (input && option) {
                        input.value = option.label;
                    }
                }
            }

        
            #init() {
                this.state = {
                    isOpen: false,
                    options: [],
                    value: this.getAttribute('value') || '',
                    filterValue: ''
                };
                this.#render();
            }

             #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-select__wrapper_disabled');
                }

                // 创建输入框
                const input = document.createElement('input');
                input.className = 'sub-select__input';
                input.placeholder = this.getAttribute('placeholder') || '请选择';
                input.readOnly = !this.hasAttribute('filterable');

                // 如果有初始值，设置输入框的值
                if (this.state.value) {
                    const option = this.state.options.find(opt => opt.value === this.state.value);
                    if (option) {
                        input.value = option.label;
                    }
                }

                if (this.hasAttribute('disabled')) {
                    input.classList.add('sub-select__input_disabled');
                    input.disabled = true;
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-select__arrow';
                arrow.innerHTML = \`${vt.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-select__dropdown';

                // 组装组件
                wrapper.appendChild(input);
                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                // 绑定事件
                this.#bindEvents(wrapper, input, arrow, dropdown);
            }

            

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    .sub-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-select__wrapper {
                        position: relative;
                        height: 32px;
                        padding: 0 30px 0 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                    }

                    .sub-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-select__wrapper_disabled {
                        background-color: #f5f7fa;
                        border-color: #e4e7ed;
                        cursor: not-allowed;
                    }

                    .sub-select__input {
                        width: 100%;
                        height: 100%;
                        border: none;
                        outline: none;
                        background: none;
                        padding: 0;
                        margin: 0;
                        color: var(--text-primary);
                        cursor: inherit;
                    }

                    .sub-select__input::placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__input_disabled {
                        cursor: not-allowed;
                        color: #c0c4cc;
                    }

                    .sub-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 34px;
                        line-height: 34px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                    }

                    .sub-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_selected {
                        color: var(--primary-color);
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_custom {
                        color: #409eff;
                    }

                    .sub-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }

                    .sub-select__empty-icon {
                        margin-bottom: 8px;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

           

            

        

            #bindEvents(wrapper, input, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-select__dropdown_visible');
                    wrapper.classList.remove('sub-select__wrapper_active');
                    arrow.classList.remove('sub-select__arrow_active');
                };


                // 添加全局点击事件监听
                const handleClickOutside = (event) => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                        if (this.state.value) {
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option) {
                                input.value = option.label;
                            }
                        }
                        this.state.filterValue = '';
                    }
                };

                // 在组件连接到 DOM 时添加事件监听
                document.addEventListener('click', handleClickOutside);

                // 在组件断开连接时移除事件监听，防止内存泄漏
                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    if (this.state.isOpen) {
                        closeDropdown();
                        if (this.state.value) {
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option) {
                                input.value = option.label;
                            }
                        }
                        this.state.filterValue = '';
                    } else {
                        // 触发全局事件，通知其他 select 关闭
                        document.dispatchEvent(
                            new CustomEvent('sub-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-select__dropdown_visible');
                        wrapper.classList.add('sub-select__wrapper_active');
                        arrow.classList.add('sub-select__arrow_active');
                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                // 监听全局事件，当其他 select 打开时关闭当前 select
                document.addEventListener('sub-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                        if (this.state.value) {
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option) {
                                input.value = option.label;
                            }
                        }
                        this.state.filterValue = '';
                    }
                });

                if (this.hasAttribute('filterable')) {
                    input.addEventListener('input', e => {
                        e.stopPropagation();
                        this.state.filterValue = e.target.value;
                        if (!this.state.isOpen) {
                            toggleDropdown();
                        } else {
                            this.#renderOptions(dropdown);
                        }
                    });
                }
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';
                let options = this.state.options;

                // 如果是过滤模式且有输入值
                if (this.hasAttribute('filterable') && this.state.filterValue) {
                    // 清空下拉框，只显示当前输入的值
                    const customOption = document.createElement('div');
                    customOption.className = 'sub-select__option';
                    customOption.textContent = this.state.filterValue;
                    customOption.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#selectOption({
                            value: this.state.filterValue,
                            label: this.state.filterValue
                        });
                    });
                    dropdown.appendChild(customOption);
                    return;
                }

                // 如果没有选项，显示空状态
                if (options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-select__empty';
                    empty.innerHTML = \`
                        <div class="sub-select__empty-icon">${vt.empty}</div>
                        <div>暂无数据</div>
                    \`;
                    dropdown.appendChild(empty);
                    return;
                }

                // 渲染选项列表
                options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-select__option';
                    if (option.value === this.state.value) {
                        optionEl.classList.add('sub-select__option_selected');
                    }
                    optionEl.textContent = option.label;
                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#selectOption(option);
                    });
                    dropdown.appendChild(optionEl);
                });
            }

            #selectOption(option) {
                this.state.value = option.value;
                const input = this.shadowRoot.querySelector('.sub-select__input');
                input.value = option.label;

                // 如果是自定义选项，添加到选项列表中
                if (!this.state.options.some(opt => opt.value === option.value)) {
                    this.state.options.push(option);
                }

                // 关闭下拉框
                const wrapper = this.shadowRoot.querySelector('.sub-select__wrapper');
                const arrow = this.shadowRoot.querySelector('.sub-select__arrow');
                const dropdown = this.shadowRoot.querySelector('.sub-select__dropdown');
                dropdown.classList.remove('sub-select__dropdown_visible');
                wrapper.classList.remove('sub-select__wrapper_active');
                arrow.classList.remove('sub-select__arrow_active');
                this.state.isOpen = false;

                // 触发事件通知外部值变化
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 update:value 事件，用于表单数据同步
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: option.value,
                            option
                        },
                        bubbles: true
                    })
                );
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'options' && newValue !== oldValue) {
                    try {
                        this.state.options = JSON.parse(newValue);
                        // 设置初始值
                        if (this.state.value) {
                            const input = this.shadowRoot.querySelector('.sub-select__input');
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option && input) {
                                input.value = option.label;
                            }
                        }
                        if (this.shadowRoot.querySelector('.sub-select__dropdown')) {
                            this.#renderOptions(this.shadowRoot.querySelector('.sub-select__dropdown'));
                        }
                    } catch (e) {
                        console.error('Invalid options format:', e);
                        this.state.options = [];
                    }
                } else if (name === 'value' && newValue !== oldValue) {
                    this.state.value = newValue;
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === newValue);
                    if (option && input) {
                        input.value = option.label;
                    }
                }
            }
        }

        customElements.define('sub-select', SubSelect);
    <\/script>`;
}
function Vn() {
  return `
    <script>
        class SubTextarea extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'rows', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-textarea {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }
                    .sub-textarea__inner {
                        display: block;
                        resize: vertical;
                        padding: 5px 15px;
                        line-height: 1.5;
                        box-sizing: border-box;
                        width: 100%;
                        font-size: inherit;
                        color: var(--text-primary);
                        background-color: var(--background);
                        background-image: none;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        font-family: inherit;
                    }
                    .sub-textarea__inner:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-textarea__inner:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-textarea__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-textarea__inner:disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-textarea';

                const textarea = document.createElement('textarea');
                textarea.className = 'sub-textarea__inner';
                textarea.value = this.state.value;
                textarea.placeholder = this.getAttribute('placeholder') || '';
                textarea.rows = this.getAttribute('rows') || 2;
                textarea.disabled = this.hasAttribute('disabled');

                wrapper.appendChild(textarea);
                this.shadowRoot.appendChild(wrapper);

                this.#bindEvents(textarea);
            }

            #bindEvents(textarea) {
                textarea.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    // 触发原生事件
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    // 触发自定义事件
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            // 提供 value 的 getter/setter
            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const textarea = this.shadowRoot.querySelector('textarea');
                    if (textarea) {
                        textarea.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const textarea = this.shadowRoot.querySelector('textarea');
                if (!textarea) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        textarea.placeholder = newValue;
                        break;
                    case 'disabled':
                        textarea.disabled = this.hasAttribute('disabled');
                        break;
                    case 'rows':
                        textarea.rows = newValue;
                        break;
                }
            }
        }
        customElements.define('sub-textarea', SubTextarea);
    <\/script>
    `;
}
function jn() {
  return [
    { label: "Emoji", value: "emoji" },
    { label: "Clash New Field", value: "new_name" },
    { label: "启用 UDP", value: "udp" },
    { label: "排序节点", value: "sort" },
    { label: "启用TFO", value: "tfo" }
  ];
}
function $n(e, i) {
  var r;
  const { origin: t } = new URL(e.url);
  return (((r = i.BACKEND) == null ? void 0 : r.split(`
`).filter(Boolean)) ?? []).reduce(
    (s, o) => (s.unshift({ label: o, value: o }), s),
    [
      { label: t, value: t },
      { label: "肥羊增强型后端【vless+hysteria】", value: "https://api.v1.mk" },
      { label: "肥羊备用后端【vless+hysteria】", value: "https://sub.d1.mk" },
      { label: "品云提供后端【实验性】", value: "https://v.id9.cc" },
      { label: "つつ-多地防失联【负载均衡+国内优化】", value: "https://api.tsutsu.one" },
      { label: "nameless13提供", value: "https://www.nameless13.com" },
      { label: "subconverter作者提供", value: "https://sub.xeton.dev" },
      { label: "sub-web作者提供", value: "https://api.wcc.best" },
      { label: "sub作者&lhie1提供", value: "https://api.dler.io" }
    ]
  );
}
function Yn(e) {
  var t;
  return (((t = e.REMOTE_CONFIG) == null ? void 0 : t.split(`
`).filter(Boolean)) ?? []).reduce(
    (n, r) => (n.unshift({
      label: r,
      value: r
    }), n),
    [
      {
        label: "ACL4SSR_Online 默认版 分组比较全 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini"
      },
      {
        label: "ACL4SSR_Online_AdblockPlus 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_NoAuto 无自动测速 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_NoReject 无广告拦截规则 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini"
      },
      {
        label: "ACL4SSR_Online_Mini 精简版 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_AdblockPlus.ini 精简版 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_NoAuto.ini 精简版 不带自动测速 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_Fallback.ini 精简版 带故障转移 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_MultiMode.ini 精简版 自动测速、故障转移、负载均衡 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"
      },
      {
        label: "ACL4SSR_Online_Full 全分组 重度用户使用 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini"
      },
      {
        label: "ACL4SSR_Online_Full_NoAuto.ini 全分组 无自动测速 重度用户使用 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_Full_AdblockPlus 全分组 重度用户使用 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_Full_Netflix 全分组 重度用户使用 奈飞全量 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini"
      }
    ]
  );
}
function zn(e) {
  var t;
  return (((t = e.SHORT_SERVER) == null ? void 0 : t.split(`
`).filter(Boolean)) ?? []).reduce((n, r) => (n.push({ label: r, value: r }), n), []);
}
function Wn() {
  return [
    { label: "Clash", value: "clash" },
    { label: "ClashR", value: "clashr" },
    { label: "Sing-box", value: "sing-box" }
  ];
}
function Gn() {
  return `
        <script>
            // 检测系统主题
            function detectSystemTheme() {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                }
                return 'light';
            }

            // 设置主题
            function setTheme(theme) {
                if (theme === 'dark') {
                    document.documentElement.setAttribute('theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('theme');
                }
                localStorage.setItem('theme', theme);
            }

            // 初始化主题
            function initTheme() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    setTheme(detectSystemTheme());
                }
            }

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });

            // 页面加载时初始化主题
            document.addEventListener('DOMContentLoaded', () => {
                initTheme();

                // 添加主题切换按钮
                const toggleBtn = document.querySelector('.header__theme');
                toggleBtn.onclick = () => {
                    const isDark = document.documentElement.hasAttribute('theme');
                    setTheme(isDark ? 'light' : 'dark');
                };
            });
        <\/script>
    `;
}
function Kn() {
  return `
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Arial, sans-serif;
                background-color: var(--background);
                color: var(--text-primary);
                transition: var(--transition);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            /* 调整主体内容的布局 */
            main {
                width: 70%;
                max-width: 1200px;
                margin: 0 auto;
                margin-top: 20px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
            }

            main > header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid var(--border-color);
                padding: 10px 15px;
            }

            main > header > .header__icon {
                width: 25px;
                height: 25px;
                cursor: pointer;
                transition: var(--transition);
            }

            main > header > .header__icon svg {
                width: 100%;
                height: 100%;
            }

            main > header > .header__iconsvg path {
                fill: var(--text-primary); /* 使用主题文字颜色 */
                transition: var(--transition);
            }

            main > header > .header__icon:hover svg path {
                fill: var(--primary-color); /* 悬浮时使用主题主色 */
            }

            /* 暗色主题下的样式 */
            :root[theme='dark'] main > header > .header__icon svg path {
                fill: var(--text-primary);
            }

            :root[theme='dark'] main > header > .header__icon:hover svg path {
                fill: var(--primary-color);
            }

            main > header > .header__title {
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
                text-align: center;
            }

            /* 主题切换按钮样式优化 */
            main > header > .header__theme {
                padding: 5px 10px;
                border-radius: var(--radius);
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--text-primary);
                cursor: pointer;
                font-size: 14px;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            main > header > .header__theme:hover {
                border-color: var(--primary-color);
                color: var(--primary-color);
            }

            /* 添加主题图标 */
            main > header > .header__theme::before {
                content: '';
                width: 16px;
                height: 16px;
                background-image: var(--theme-icon);
                background-size: contain;
                background-repeat: no-repeat;
                transition: var(--transition);
            }

            /* 暗色主题图标 */
            :root[theme='dark'] main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/%3E%3C/svg%3E");
            }

            /* 亮色主题图标 */
            :root:not([theme='dark']) main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z'/%3E%3C/svg%3E");
            }

            main > section {
                margin-top: 20px;
                padding: 0 20px;
            }
        
        </style>`;
}
function qn() {
  return `
    <style>
        /* 全局主题变量 */
        :root {
            /* Light Theme */
            --primary-color: #007aff;
            --primary-hover: #3395ff;
            --primary-active: #0056b3;
            --text-primary: #000000;
            --text-secondary: #666666;
            --text-disabled: #999999;
            --border-color: #9f9fa7;
            --border-hover: #b8b8bd;
            --background: #ffffff;
            --background-secondary: #f5f5f5;
            --background-disabled: #f2f2f7;
            --shadow: rgba(0, 0, 0, 0.1);
            --radius: 8px;
            --transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* Dark Theme */
        :root[theme='dark'] {
            --primary-color: #0a84ff;
            --primary-hover: #409cff;
            --primary-active: #0066cc;
            --text-primary: #ffffff;
            --text-secondary: #98989d;
            --text-disabled: #666666;
            --border-color: #9494a6;
            --border-hover: #48484c;
            --background: #1c1c1e;
            --background-secondary: #2c2c2e;
            --background-disabled: #38383c;
            --shadow: rgba(0, 0, 0, 0.3);
        }
    </style>
    `;
}
function Jn(e, i) {
  const t = Yn(i), n = $n(e, i), r = zn(i), s = Wn(), o = jn(), a = `  
    <!DOCTYPE html>
        <html lang="en" theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sub Converter</title>

                ${qn()}
                ${Kn()}

                <style>
                    .input-group {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .input-group input {
                        width: 100%;
                        padding: 4px 11px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        min-height: 32px;
                        box-sizing: border-box;
                        flex: 1;
                        background-color: var(--background);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }

                    .input-group input:disabled {
                        border-color: var(--border-color);
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                        opacity: 1;
                    }

                    .sub-form-item__actions {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 20px;
                        margin-top: 24px;
                        padding-right: 100px;
                    }
                </style>
            </head>
            <body>
                ${Gn()}

                <main>
                    <header>
                        <span class="header__icon">
                            <svg
                                t="1735896323200"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1626"
                            >
                                <path
                                    d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                                    fill="#231F20"
                                    p-id="1627"
                                ></path>
                            </svg>
                        </span>

                        <span class="header__title">订阅转换</span>

                        <button class="header__theme"></button>
                    </header>

                    <section>
                        <sub-form id="sub-convert-form" label-width="100px">
                            <sub-form-item label="订阅链接">
                                <sub-textarea
                                    key="url"
                                    placeholder="支持各种订阅链接或单节点链接，多个链接每行一个或用 | 分隔"
                                    rows="4"
                                ></sub-textarea>
                            </sub-form-item>

                            <sub-form-item label="生成类型">
                                <sub-select key="target"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="远程配置">
                                <sub-select key="config"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="后端地址">
                                <sub-select key="backend"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="高级选项">
                                <sub-checkbox key="advanced" span="5"></sub-checkbox>
                            </sub-form-item>

                            <sub-form-item label="短链地址">
                                <sub-select key="shortServe"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="定制订阅">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-subscribe" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-subscribe')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item label="订阅短链">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-short-url" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-short-url')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item>
                                <div class="sub-form-item__actions">
                                    <sub-button disabled id="generate-sub-btn" type="default">生成订阅链接</sub-button>
                                    <sub-button disabled id="generate-short-url-btn" type="default">生成短链</sub-button>
                                </div>
                            </sub-form-item>
                        </sub-form>
                    </section>
                </main>

                ${Un()}
                ${Vn()}
                ${Bn()}
                ${In()}
                ${Mn()}
                ${Pn()}
                ${Fn()}
                ${Dn()}

                <script>
                    const formConfig = {
                        target: {
                            type: 'sub-select',
                            options: ${JSON.stringify(s)}
                        },
                        config: {
                            type: 'sub-select',
                            options: ${JSON.stringify(t)}
                        },
                        backend: {
                            type: 'sub-select',
                            options: ${JSON.stringify(n)}
                        },
                        advanced: {
                            type: 'sub-checkbox',
                            options: ${JSON.stringify(o)}
                        },
                        shortServe: {
                            type: 'sub-select',
                            options: ${JSON.stringify(r)}
                        }
                    };

                    class Sub {
                        #model = {
                            target: '${s[0].value}',
                            config: '${t[0].value}',
                            backend: '${n[0].value}',
                            advanced: ['emoji', 'new_name'],
                            shortServe: '',

                            subUrl: '',
                            shortUrl: ''
                        };

                        #formSubscribe = this.#$('#form-subscribe');
                        #formShortUrl = this.#$('#form-short-url');

                        #generateSubBtn = this.#$('#generate-sub-btn');
                        #generateShortUrlBtn = this.#$('#generate-short-url-btn');

                        #form = this.#$('#sub-convert-form');
                        #formItems = this.#form.querySelectorAll('sub-form-item');

                        constructor() {
                            this.#init();
                            this.#bindEvents();
                        }

                        #init() {
                            this.#formItems.forEach(item => {
                                const formItem = item.querySelector('[key]');
                                if (formItem) {
                                    const formItemKey = formItem.getAttribute('key');
                                    const type = formConfig[formItemKey]?.type;
                                    if (type && ['sub-select', 'sub-checkbox'].includes(type)) {
                                        formItem.setAttribute('options', JSON.stringify(formConfig[formItemKey].options));
                                    }
                                    formItem.setAttribute('placeholder', formConfig[formItemKey]?.placeholder ?? '');
                                    if (formConfig[formItemKey]?.disabled) {
                                        formItem.setAttribute('disabled', '');
                                    }
                                }
                            });

                            this.#form.setAttribute('model', JSON.stringify(this.#model));
                        }

                        #bindEvents() {
                            this.#form.addEventListener('form:change', e => {
                                this.#model[e.detail.key] = e.detail.value;
                                this.#form.setAttribute('model', JSON.stringify(this.#model));

                                if (this.#model.url) {
                                    this.#generateSubBtn.removeAttribute('disabled');
                                } else {
                                    this.#generateSubBtn.setAttribute('disabled', '');
                                }
                            });

                            this.#generateSubBtn.addEventListener('click', () => {
                                const url = new URL(this.#model.backend + '/sub');
                                url.searchParams.set('target', this.#model.target);
                                url.searchParams.set('url', this.#model.url);
                                url.searchParams.set('insert', 'false');
                                url.searchParams.set('config', this.#model.config);
                                url.searchParams.set('list', false);
                                url.searchParams.set('scv', false);
                                url.searchParams.set('fdn', false);

                                const advancedOptions = this.#getAdvancedOptions(this.#model);

                                advancedOptions.forEach(option => {
                                    url.searchParams.set(option.label, option.value);
                                });

                                const subUrl = url.toString();
                                this.#formSubscribe.value = subUrl;
                                this.#model.subUrl = subUrl;

                                this.#generateShortUrlBtn.removeAttribute('disabled');
                            });



                            this.#generateShortUrlBtn.addEventListener('click', async () => {
                                if (!this.#model.shortServe) {
                                    notification.error('短链服务不存在');
                                    return;
                                }

                                // 构建请求数据
                                const requestData = {
                                    serve: this.#model.shortServe,
                                    long_url: this.#model.subUrl
                                };

                                // 发送请求
                                const response = await fetch(\`\${this.#model.shortServe}/api/add\`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestData)
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    this.#formShortUrl.value = data.data.short_url;
                                    this.#model.shortUrl = data.data.short_url;
                                    notification.success('生成短链接成功');
                                } else {
                                    notification.error('生成短链接失败');
                                }
                            });
                        }

                        #getAdvancedOptions(model) {
                            return formConfig.advanced.options.map(option => {
                                return {
                                    label: option.value,
                                    value: model.advanced.includes(option.value)
                                };
                            });
                        }

                        /**
                         * 获取元素
                         * @param {string} selector
                         * @returns {HTMLElement}
                         */
                        #$(selector) {
                            return document.querySelector(selector);
                        }

                        async copySubUrl(dom) {
                            const text = this.#$(\`#\${dom}\`).value;
                            if (!text) {
                                notification.error('复制内容不能为空');
                                return;
                            }

                            const success = await this.copyToClipboard(text);
                            if (success) {
                                notification.success('复制成功');
                            }
                        }

                        async copyToClipboard(text) {
                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    // 优先使用 Clipboard API
                                    await navigator.clipboard.writeText(text);
                                    return true;
                                } else {
                                    // 降级使用 document.execCommand
                                    const textArea = document.createElement('textarea');
                                    textArea.value = text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();

                                    const success = document.execCommand('copy');
                                    textArea.remove();

                                    if (!success) {
                                        throw new Error('复制失败');
                                    }
                                    return true;
                                }
                            } catch (error) {
                                notification.error('复制失败: ' + (error.message || '未知错误'));
                                return false;
                            }
                        }
                    }

                    const sub = new Sub();

                <\/script>

        

            </body>
        </html>
    `;
  return new Response(a, {
    headers: new Headers({
      "Content-Type": "text/html; charset=UTF-8"
    })
  });
}
const eo = {
  async fetch(e, i) {
    try {
      const { pathname: t } = new URL(e.url);
      if (t === "/sub") {
        const n = new On(i);
        await n.setSubUrls(e);
        const r = new URL(e.url).searchParams.get("target");
        if (!r)
          return new Response("Unsupported client type", { status: 400 });
        const s = new Nn(n);
        if (["clash", "clashr"].includes(r)) {
          const o = await s.getClashConfig();
          return new Response(yn(o, { indent: 2, lineWidth: 200 }), {
            headers: new Headers({
              "Content-Type": "text/yaml; charset=UTF-8",
              "Cache-Control": "no-store"
            })
          });
        }
        if (r === "singbox") {
          const o = await s.getSingboxConfig();
          return new Response(JSON.stringify(o), {
            headers: new Headers({
              "Content-Type": "text/plain; charset=UTF-8",
              "Cache-Control": "no-store"
            })
          });
        }
        return new Response("Unsupported client type, support list: clash, clashr", { status: 400 });
      }
      return Jn(e, i);
    } catch (t) {
      return new Response(t.message || t);
    }
  }
};
export {
  eo as default
};
