"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // public/shopify/plantilla99/assets/js/gsap.Bi_c5vh2.js
  function e(e16) {
    if (e16 === void 0) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return e16;
  }
  function t(e16, t3) {
    e16.prototype = Object.create(t3.prototype), e16.prototype.constructor = e16, e16.__proto__ = t3;
  }
  var n = { autoSleep: 120, force3D: `auto`, nullTargetWarn: 1, units: { lineHeight: `` } };
  var r = { duration: 0.5, overwrite: false, delay: 0 };
  var i;
  var a;
  var o;
  var s = 1e8;
  var c = 1 / s;
  var l = Math.PI * 2;
  var u = l / 4;
  var d = 0;
  var f = Math.sqrt;
  var p = Math.cos;
  var m = Math.sin;
  var h = function(e16) {
    return typeof e16 == `string`;
  };
  var g = function(e16) {
    return typeof e16 == `function`;
  };
  var _ = function(e16) {
    return typeof e16 == `number`;
  };
  var v = function(e16) {
    return e16 === void 0;
  };
  var y = function(e16) {
    return typeof e16 == `object`;
  };
  var b = function(e16) {
    return e16 !== false;
  };
  var x = function() {
    return typeof window < `u`;
  };
  var S = function(e16) {
    return g(e16) || h(e16);
  };
  var C = typeof ArrayBuffer == `function` && ArrayBuffer.isView || function() {
  };
  var w = Array.isArray;
  var T = /random\([^)]+\)/g;
  var E = /,\s*/g;
  var D = /(?:-?\.?\d|\.)+/gi;
  var O = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
  var k = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
  var A = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
  var j = /[+-]=-?[.\d]+/;
  var M = /[^,'"\[\]\s]+/gi;
  var N = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
  var P;
  var F;
  var I;
  var L;
  var R = {};
  var z = {};
  var B;
  var ee = function(e16) {
    return (z = Oe(e16, R)) && Z;
  };
  var te = function(e16, t3) {
    return console.warn(`Invalid property`, e16, `set to`, t3, `Missing plugin? gsap.registerPlugin()`);
  };
  var ne = function(e16, t3) {
    return !t3 && console.warn(e16);
  };
  var re = function(e16, t3) {
    return e16 && (R[e16] = t3) && z && (z[e16] = t3) || R;
  };
  var ie = function() {
    return 0;
  };
  var ae = { suppressEvents: true, isStart: true, kill: false };
  var oe = { suppressEvents: true, kill: false };
  var se = { suppressEvents: true };
  var ce = {};
  var le = [];
  var ue = {};
  var de;
  var V = {};
  var fe = {};
  var pe = 30;
  var me = [];
  var he = ``;
  var ge = function(e16) {
    var t3 = e16[0], n4, r4;
    if (y(t3) || g(t3) || (e16 = [e16]), !(n4 = (t3._gsap || {}).harness)) {
      for (r4 = me.length; r4-- && !me[r4].targetTest(t3); ) ;
      n4 = me[r4];
    }
    for (r4 = e16.length; r4--; ) e16[r4] && (e16[r4]._gsap || (e16[r4]._gsap = new en(e16[r4], n4))) || e16.splice(r4, 1);
    return e16;
  };
  var _e = function(e16) {
    return e16._gsap || ge(ut(e16))[0]._gsap;
  };
  var ve = function(e16, t3, n4) {
    return (n4 = e16[t3]) && g(n4) ? e16[t3]() : v(n4) && e16.getAttribute && e16.getAttribute(t3) || n4;
  };
  var H = function(e16, t3) {
    return (e16 = e16.split(`,`)).forEach(t3) || e16;
  };
  var U = function(e16) {
    return Math.round(e16 * 1e5) / 1e5 || 0;
  };
  var W = function(e16) {
    return Math.round(e16 * 1e7) / 1e7 || 0;
  };
  var ye = function(e16, t3) {
    var n4 = t3.charAt(0), r4 = parseFloat(t3.substr(2));
    return e16 = parseFloat(e16), n4 === `+` ? e16 + r4 : n4 === `-` ? e16 - r4 : n4 === `*` ? e16 * r4 : e16 / r4;
  };
  var be = function(e16, t3) {
    for (var n4 = t3.length, r4 = 0; e16.indexOf(t3[r4]) < 0 && ++r4 < n4; ) ;
    return r4 < n4;
  };
  var xe = function() {
    var e16 = le.length, t3 = le.slice(0), n4, r4;
    for (ue = {}, le.length = 0, n4 = 0; n4 < e16; n4++) r4 = t3[n4], r4 && r4._lazy && (r4.render(r4._lazy[0], r4._lazy[1], true)._lazy = 0);
  };
  var Se = function(e16) {
    return !!(e16._initted || e16._startAt || e16.add);
  };
  var Ce = function(e16, t3, n4, r4) {
    le.length && !a && xe(), e16.render(t3, n4, r4 || !!(a && t3 < 0 && Se(e16))), le.length && !a && xe();
  };
  var we = function(e16) {
    var t3 = parseFloat(e16);
    return (t3 || t3 === 0) && (e16 + ``).match(M).length < 2 ? t3 : h(e16) ? e16.trim() : e16;
  };
  var Te = function(e16) {
    return e16;
  };
  var Ee = function(e16, t3) {
    for (var n4 in t3) n4 in e16 || (e16[n4] = t3[n4]);
    return e16;
  };
  var De = function(e16) {
    return function(t3, n4) {
      for (var r4 in n4) r4 in t3 || r4 === `duration` && e16 || r4 === `ease` || (t3[r4] = n4[r4]);
    };
  };
  var Oe = function(e16, t3) {
    for (var n4 in t3) e16[n4] = t3[n4];
    return e16;
  };
  var ke = function e2(t3, n4) {
    for (var r4 in n4) r4 !== `__proto__` && r4 !== `constructor` && r4 !== `prototype` && (t3[r4] = y(n4[r4]) ? e2(t3[r4] || (t3[r4] = {}), n4[r4]) : n4[r4]);
    return t3;
  };
  var Ae = function(e16, t3) {
    var n4 = {}, r4;
    for (r4 in e16) r4 in t3 || (n4[r4] = e16[r4]);
    return n4;
  };
  var je = function(e16) {
    var t3 = e16.parent || P, n4 = e16.keyframes ? De(w(e16.keyframes)) : Ee;
    if (b(e16.inherit)) for (; t3; ) n4(e16, t3.vars.defaults), t3 = t3.parent || t3._dp;
    return e16;
  };
  var Me = function(e16, t3) {
    for (var n4 = e16.length, r4 = n4 === t3.length; r4 && n4-- && e16[n4] === t3[n4]; ) ;
    return n4 < 0;
  };
  var Ne = function(e16, t3, n4, r4, i3) {
    n4 === void 0 && (n4 = `_first`), r4 === void 0 && (r4 = `_last`);
    var a4 = e16[r4], o3;
    if (i3) for (o3 = t3[i3]; a4 && a4[i3] > o3; ) a4 = a4._prev;
    return a4 ? (t3._next = a4._next, a4._next = t3) : (t3._next = e16[n4], e16[n4] = t3), t3._next ? t3._next._prev = t3 : e16[r4] = t3, t3._prev = a4, t3.parent = t3._dp = e16, t3;
  };
  var Pe = function(e16, t3, n4, r4) {
    n4 === void 0 && (n4 = `_first`), r4 === void 0 && (r4 = `_last`);
    var i3 = t3._prev, a4 = t3._next;
    i3 ? i3._next = a4 : e16[n4] === t3 && (e16[n4] = a4), a4 ? a4._prev = i3 : e16[r4] === t3 && (e16[r4] = i3), t3._next = t3._prev = t3.parent = null;
  };
  var Fe = function(e16, t3) {
    e16.parent && (!t3 || e16.parent.autoRemoveChildren) && e16.parent.remove && e16.parent.remove(e16), e16._act = 0;
  };
  var Ie = function(e16, t3) {
    if (e16 && (!t3 || t3._end > e16._dur || t3._start < 0)) for (var n4 = e16; n4; ) n4._dirty = 1, n4 = n4.parent;
    return e16;
  };
  var Le = function(e16) {
    for (var t3 = e16.parent; t3 && t3.parent; ) t3._dirty = 1, t3.totalDuration(), t3 = t3.parent;
    return e16;
  };
  var Re = function(e16, t3, n4, r4) {
    return e16._startAt && (a ? e16._startAt.revert(oe) : e16.vars.immediateRender && !e16.vars.autoRevert || e16._startAt.render(t3, true, r4));
  };
  var ze = function e3(t3) {
    return !t3 || t3._ts && e3(t3.parent);
  };
  var Be = function(e16) {
    return e16._repeat ? Ve(e16._tTime, e16 = e16.duration() + e16._rDelay) * e16 : 0;
  };
  var Ve = function(e16, t3) {
    var n4 = Math.floor(e16 = W(e16 / t3));
    return e16 && n4 === e16 ? n4 - 1 : n4;
  };
  var He = function(e16, t3) {
    return (e16 - t3._start) * t3._ts + (t3._ts >= 0 ? 0 : t3._dirty ? t3.totalDuration() : t3._tDur);
  };
  var Ue = function(e16) {
    return e16._end = W(e16._start + (e16._tDur / Math.abs(e16._ts || e16._rts || c) || 0));
  };
  var We = function(e16, t3) {
    var n4 = e16._dp;
    return n4 && n4.smoothChildTiming && e16._ts && (e16._start = W(n4._time - (e16._ts > 0 ? t3 / e16._ts : ((e16._dirty ? e16.totalDuration() : e16._tDur) - t3) / -e16._ts)), Ue(e16), n4._dirty || Ie(n4, e16)), e16;
  };
  var Ge = function(e16, t3) {
    var n4;
    if ((t3._time || !t3._dur && t3._initted || t3._start < e16._time && (t3._dur || !t3.add)) && (n4 = He(e16.rawTime(), t3), (!t3._dur || at(0, t3.totalDuration(), n4) - t3._tTime > c) && t3.render(n4, true)), Ie(e16, t3)._dp && e16._initted && e16._time >= e16._dur && e16._ts) {
      if (e16._dur < e16.duration()) for (n4 = e16; n4._dp; ) n4.rawTime() >= 0 && n4.totalTime(n4._tTime), n4 = n4._dp;
      e16._zTime = -c;
    }
  };
  var Ke = function(e16, t3, n4, r4) {
    return t3.parent && Fe(t3), t3._start = W((_(n4) ? n4 : n4 || e16 !== P ? nt(e16, n4, t3) : e16._time) + t3._delay), t3._end = W(t3._start + (t3.totalDuration() / Math.abs(t3.timeScale()) || 0)), Ne(e16, t3, `_first`, `_last`, e16._sort ? `_start` : 0), Xe(t3) || (e16._recent = t3), r4 || Ge(e16, t3), e16._ts < 0 && We(e16, e16._tTime), e16;
  };
  var qe = function(e16, t3) {
    return (R.ScrollTrigger || te(`scrollTrigger`, t3)) && R.ScrollTrigger.create(t3, e16);
  };
  var Je = function(e16, t3, n4, r4, i3) {
    if (ln(e16, t3, i3), !e16._initted) return 1;
    if (!n4 && e16._pt && !a && (e16._dur && e16.vars.lazy !== false || !e16._dur && e16.vars.lazy) && de !== Vt.frame) return le.push(e16), e16._lazy = [i3, r4], 1;
  };
  var Ye = function e4(t3) {
    var n4 = t3.parent;
    return n4 && n4._ts && n4._initted && !n4._lock && (n4.rawTime() < 0 || e4(n4));
  };
  var Xe = function(e16) {
    var t3 = e16.data;
    return t3 === `isFromStart` || t3 === `isStart`;
  };
  var Ze = function(e16, t3, n4, r4) {
    var i3 = e16.ratio, o3 = t3 < 0 || !t3 && (!e16._start && Ye(e16) && !(!e16._initted && Xe(e16)) || (e16._ts < 0 || e16._dp._ts < 0) && !Xe(e16)) ? 0 : 1, s3 = e16._rDelay, l3 = 0, u3, d3, f3;
    if (s3 && e16._repeat && (l3 = at(0, e16._tDur, t3), d3 = Ve(l3, s3), e16._yoyo && d3 & 1 && (o3 = 1 - o3), d3 !== Ve(e16._tTime, s3) && (i3 = 1 - o3, e16.vars.repeatRefresh && e16._initted && e16.invalidate())), o3 !== i3 || a || r4 || e16._zTime === c || !t3 && e16._zTime) {
      if (!e16._initted && Je(e16, t3, r4, n4, l3)) return;
      for (f3 = e16._zTime, e16._zTime = t3 || (n4 ? c : 0), n4 || (n4 = t3 && !f3), e16.ratio = o3, e16._from && (o3 = 1 - o3), e16._time = 0, e16._tTime = l3, u3 = e16._pt; u3; ) u3.r(o3, u3.d), u3 = u3._next;
      t3 < 0 && Re(e16, t3, n4, true), e16._onUpdate && !n4 && Dt(e16, `onUpdate`), l3 && e16._repeat && !n4 && e16.parent && Dt(e16, `onRepeat`), (t3 >= e16._tDur || t3 < 0) && e16.ratio === o3 && (o3 && Fe(e16, 1), !n4 && !a && (Dt(e16, o3 ? `onComplete` : `onReverseComplete`, true), e16._prom && e16._prom()));
    } else e16._zTime || (e16._zTime = t3);
  };
  var Qe = function(e16, t3, n4) {
    var r4;
    if (n4 > t3) for (r4 = e16._first; r4 && r4._start <= n4; ) {
      if (r4.data === `isPause` && r4._start > t3) return r4;
      r4 = r4._next;
    }
    else for (r4 = e16._last; r4 && r4._start >= n4; ) {
      if (r4.data === `isPause` && r4._start < t3) return r4;
      r4 = r4._prev;
    }
  };
  var $e = function(e16, t3, n4, r4) {
    var i3 = e16._repeat, a4 = W(t3) || 0, o3 = e16._tTime / e16._tDur;
    return o3 && !r4 && (e16._time *= a4 / e16._dur), e16._dur = a4, e16._tDur = i3 ? i3 < 0 ? 1e10 : W(a4 * (i3 + 1) + e16._rDelay * i3) : a4, o3 > 0 && !r4 && We(e16, e16._tTime = e16._tDur * o3), e16.parent && Ue(e16), n4 || Ie(e16.parent, e16), e16;
  };
  var et = function(e16) {
    return e16 instanceof J ? Ie(e16) : $e(e16, e16._dur);
  };
  var tt = { _start: 0, endTime: ie, totalDuration: ie };
  var nt = function e5(t3, n4, r4) {
    var i3 = t3.labels, a4 = t3._recent || tt, o3 = t3.duration() >= s ? a4.endTime(false) : t3._dur, c3, l3, u3;
    return h(n4) && (isNaN(n4) || n4 in i3) ? (l3 = n4.charAt(0), u3 = n4.substr(-1) === `%`, c3 = n4.indexOf(`=`), l3 === `<` || l3 === `>` ? (c3 >= 0 && (n4 = n4.replace(/=/, ``)), (l3 === `<` ? a4._start : a4.endTime(a4._repeat >= 0)) + (parseFloat(n4.substr(1)) || 0) * (u3 ? (c3 < 0 ? a4 : r4).totalDuration() / 100 : 1)) : c3 < 0 ? (n4 in i3 || (i3[n4] = o3), i3[n4]) : (l3 = parseFloat(n4.charAt(c3 - 1) + n4.substr(c3 + 1)), u3 && r4 && (l3 = l3 / 100 * (w(r4) ? r4[0] : r4).totalDuration()), c3 > 1 ? e5(t3, n4.substr(0, c3 - 1), r4) + l3 : o3 + l3)) : n4 == null ? o3 : +n4;
  };
  var rt = function(e16, t3, n4) {
    var r4 = _(t3[1]), i3 = (r4 ? 2 : 1) + (e16 < 2 ? 0 : 1), a4 = t3[i3], o3, s3;
    if (r4 && (a4.duration = t3[1]), a4.parent = n4, e16) {
      for (o3 = a4, s3 = n4; s3 && !(`immediateRender` in o3); ) o3 = s3.vars.defaults || {}, s3 = b(s3.vars.inherit) && s3.parent;
      a4.immediateRender = b(o3.immediateRender), e16 < 2 ? a4.runBackwards = 1 : a4.startAt = t3[i3 - 1];
    }
    return new Y(t3[0], a4, t3[i3 + 1]);
  };
  var it = function(e16, t3) {
    return e16 || e16 === 0 ? t3(e16) : t3;
  };
  var at = function(e16, t3, n4) {
    return n4 < e16 ? e16 : n4 > t3 ? t3 : n4;
  };
  var G = function(e16, t3) {
    return !h(e16) || !(t3 = N.exec(e16)) ? `` : t3[1];
  };
  var ot = function(e16, t3, n4) {
    return it(n4, function(n5) {
      return at(e16, t3, n5);
    });
  };
  var st = [].slice;
  var ct = function(e16, t3) {
    return e16 && y(e16) && `length` in e16 && (!t3 && !e16.length || e16.length - 1 in e16 && y(e16[0])) && !e16.nodeType && e16 !== F;
  };
  var lt = function(e16, t3, n4) {
    return n4 === void 0 && (n4 = []), e16.forEach(function(e17) {
      var r4;
      return h(e17) && !t3 || ct(e17, 1) ? (r4 = n4).push.apply(r4, ut(e17)) : n4.push(e17);
    }) || n4;
  };
  var ut = function(e16, t3, n4) {
    return o && !t3 && o.selector ? o.selector(e16) : h(e16) && !n4 && (I || !Ht()) ? st.call((t3 || L).querySelectorAll(e16), 0) : w(e16) ? lt(e16, n4) : ct(e16) ? st.call(e16, 0) : e16 ? [e16] : [];
  };
  var dt = function(e16) {
    return e16 = ut(e16)[0] || ne(`Invalid scope`) || {}, function(t3) {
      var n4 = e16.current || e16.nativeElement || e16;
      return ut(t3, n4.querySelectorAll ? n4 : n4 === e16 ? ne(`Invalid scope`) || L.createElement(`div`) : e16);
    };
  };
  var ft = function(e16) {
    return e16.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var pt = function(e16) {
    if (g(e16)) return e16;
    var t3 = y(e16) ? e16 : { each: e16 }, n4 = Yt(t3.ease), r4 = t3.from || 0, i3 = parseFloat(t3.base) || 0, a4 = {}, o3 = r4 > 0 && r4 < 1, c3 = isNaN(r4) || o3, l3 = t3.axis, u3 = r4, d3 = r4;
    return h(r4) ? u3 = d3 = { center: 0.5, edges: 0.5, end: 1 }[r4] || 0 : !o3 && c3 && (u3 = r4[0], d3 = r4[1]), function(e17, o4, p3) {
      var m3 = (p3 || t3).length, h3 = a4[m3], g3, _3, v3, y3, b3, x3, S3, C3, w2;
      if (!h3) {
        if (w2 = t3.grid === `auto` ? 0 : (t3.grid || [1, s])[1], !w2) {
          for (S3 = -s; S3 < (S3 = p3[w2++].getBoundingClientRect().left) && w2 < m3; ) ;
          w2 < m3 && w2--;
        }
        for (h3 = a4[m3] = [], g3 = c3 ? Math.min(w2, m3) * u3 - 0.5 : r4 % w2, _3 = w2 === s ? 0 : c3 ? m3 * d3 / w2 - 0.5 : r4 / w2 | 0, S3 = 0, C3 = s, x3 = 0; x3 < m3; x3++) v3 = x3 % w2 - g3, y3 = _3 - (x3 / w2 | 0), h3[x3] = b3 = l3 ? Math.abs(l3 === `y` ? y3 : v3) : f(v3 * v3 + y3 * y3), b3 > S3 && (S3 = b3), b3 < C3 && (C3 = b3);
        r4 === `random` && ft(h3), h3.max = S3 - C3, h3.min = C3, h3.v = m3 = (parseFloat(t3.amount) || parseFloat(t3.each) * (w2 > m3 ? m3 - 1 : l3 ? l3 === `y` ? m3 / w2 : w2 : Math.max(w2, m3 / w2)) || 0) * (r4 === `edges` ? -1 : 1), h3.b = m3 < 0 ? i3 - m3 : i3, h3.u = G(t3.amount || t3.each) || 0, n4 = n4 && m3 < 0 ? Jt(n4) : n4;
      }
      return m3 = (h3[e17] - h3.min) / h3.max || 0, W(h3.b + (n4 ? n4(m3) : m3) * h3.v) + h3.u;
    };
  };
  var mt = function(e16) {
    var t3 = 10 ** ((e16 + ``).split(`.`)[1] || ``).length;
    return function(n4) {
      var r4 = W(Math.round(parseFloat(n4) / e16) * e16 * t3);
      return (r4 - r4 % 1) / t3 + (_(n4) ? 0 : G(n4));
    };
  };
  var ht = function(e16, t3) {
    var n4 = w(e16), r4, i3;
    return !n4 && y(e16) && (r4 = n4 = e16.radius || s, e16.values ? (e16 = ut(e16.values), (i3 = !_(e16[0])) && (r4 *= r4)) : e16 = mt(e16.increment)), it(t3, n4 ? g(e16) ? function(t4) {
      return i3 = e16(t4), Math.abs(i3 - t4) <= r4 ? i3 : t4;
    } : function(t4) {
      for (var n5 = parseFloat(i3 ? t4.x : t4), a4 = parseFloat(i3 ? t4.y : 0), o3 = s, c3 = 0, l3 = e16.length, u3, d3; l3--; ) i3 ? (u3 = e16[l3].x - n5, d3 = e16[l3].y - a4, u3 = u3 * u3 + d3 * d3) : u3 = Math.abs(e16[l3] - n5), u3 < o3 && (o3 = u3, c3 = l3);
      return c3 = !r4 || o3 <= r4 ? e16[c3] : t4, i3 || c3 === t4 || _(t4) ? c3 : c3 + G(t4);
    } : mt(e16));
  };
  var gt = function(e16, t3, n4, r4) {
    return it(w(e16) ? !t3 : n4 === true ? !!(n4 = 0) : !r4, function() {
      return w(e16) ? e16[~~(Math.random() * e16.length)] : (n4 || (n4 = 1e-5)) && (r4 = n4 < 1 ? 10 ** ((n4 + ``).length - 2) : 1) && Math.floor(Math.round((e16 - n4 / 2 + Math.random() * (t3 - e16 + n4 * 0.99)) / n4) * n4 * r4) / r4;
    });
  };
  var _t = function() {
    var e16 = [...arguments];
    return function(t3) {
      return e16.reduce(function(e17, t4) {
        return t4(e17);
      }, t3);
    };
  };
  var vt = function(e16, t3) {
    return function(n4) {
      return e16(parseFloat(n4)) + (t3 || G(n4));
    };
  };
  var yt = function(e16, t3, n4) {
    return wt(e16, t3, 0, 1, n4);
  };
  var bt = function(e16, t3, n4) {
    return it(n4, function(n5) {
      return e16[~~t3(n5)];
    });
  };
  var xt = function e6(t3, n4, r4) {
    var i3 = n4 - t3;
    return w(t3) ? bt(t3, e6(0, t3.length), n4) : it(r4, function(e16) {
      return (i3 + (e16 - t3) % i3) % i3 + t3;
    });
  };
  var St = function e7(t3, n4, r4) {
    var i3 = n4 - t3, a4 = i3 * 2;
    return w(t3) ? bt(t3, e7(0, t3.length - 1), n4) : it(r4, function(e16) {
      return e16 = (a4 + (e16 - t3) % a4) % a4 || 0, t3 + (e16 > i3 ? a4 - e16 : e16);
    });
  };
  var Ct = function(e16) {
    return e16.replace(T, function(e17) {
      var t3 = e17.indexOf(`[`) + 1, n4 = e17.substring(t3 || 7, t3 ? e17.indexOf(`]`) : e17.length - 1).split(E);
      return gt(t3 ? n4 : +n4[0], t3 ? 0 : +n4[1], +n4[2] || 1e-5);
    });
  };
  var wt = function(e16, t3, n4, r4, i3) {
    var a4 = t3 - e16, o3 = r4 - n4;
    return it(i3, function(t4) {
      return n4 + ((t4 - e16) / a4 * o3 || 0);
    });
  };
  var Tt = function e8(t3, n4, r4, i3) {
    var a4 = isNaN(t3 + n4) ? 0 : function(e16) {
      return (1 - e16) * t3 + e16 * n4;
    };
    if (!a4) {
      var o3 = h(t3), s3 = {}, c3, l3, u3, d3, f3;
      if (r4 === true && (i3 = 1) && (r4 = null), o3) t3 = { p: t3 }, n4 = { p: n4 };
      else if (w(t3) && !w(n4)) {
        for (u3 = [], d3 = t3.length, f3 = d3 - 2, l3 = 1; l3 < d3; l3++) u3.push(e8(t3[l3 - 1], t3[l3]));
        d3--, a4 = function(e16) {
          e16 *= d3;
          var t4 = Math.min(f3, ~~e16);
          return u3[t4](e16 - t4);
        }, r4 = n4;
      } else i3 || (t3 = Oe(w(t3) ? [] : {}, t3));
      if (!u3) {
        for (c3 in n4) rn.call(s3, t3, c3, `get`, n4[c3]);
        a4 = function(e16) {
          return wn(e16, s3) || (o3 ? t3.p : t3);
        };
      }
    }
    return it(r4, a4);
  };
  var Et = function(e16, t3, n4) {
    var r4 = e16.labels, i3 = s, a4, o3, c3;
    for (a4 in r4) o3 = r4[a4] - t3, o3 < 0 == !!n4 && o3 && i3 > (o3 = Math.abs(o3)) && (c3 = a4, i3 = o3);
    return c3;
  };
  var Dt = function(e16, t3, n4) {
    var r4 = e16.vars, i3 = r4[t3], a4 = o, s3 = e16._ctx, c3, l3, u3;
    if (i3) return c3 = r4[t3 + `Params`], l3 = r4.callbackScope || e16, n4 && le.length && xe(), s3 && (o = s3), u3 = c3 ? i3.apply(l3, c3) : i3.call(l3), o = a4, u3;
  };
  var Ot = function(e16) {
    return Fe(e16), e16.scrollTrigger && e16.scrollTrigger.kill(!!a), e16.progress() < 1 && Dt(e16, `onInterrupt`), e16;
  };
  var kt;
  var At = [];
  var jt = function(e16) {
    if (e16) if (e16 = !e16.name && e16.default || e16, x() || e16.headless) {
      var t3 = e16.name, n4 = g(e16), r4 = t3 && !n4 && e16.init ? function() {
        this._props = [];
      } : e16, i3 = { init: ie, render: wn, add: rn, kill: En, modifier: Tn, rawVars: 0 }, a4 = { targetTest: 0, get: 0, getSetter: bn, aliases: {}, register: 0 };
      if (Ht(), e16 !== r4) {
        if (V[t3]) return;
        Ee(r4, Ee(Ae(e16, i3), a4)), Oe(r4.prototype, Oe(i3, Ae(e16, a4))), V[r4.prop = t3] = r4, e16.targetTest && (me.push(r4), ce[t3] = 1), t3 = (t3 === `css` ? `CSS` : t3.charAt(0).toUpperCase() + t3.substr(1)) + `Plugin`;
      }
      re(t3, r4), e16.register && e16.register(Z, r4, X);
    } else At.push(e16);
  };
  var K = 255;
  var Mt = { aqua: [0, K, K], lime: [0, K, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, K], navy: [0, 0, 128], white: [K, K, K], olive: [128, 128, 0], yellow: [K, K, 0], orange: [K, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [K, 0, 0], pink: [K, 192, 203], cyan: [0, K, K], transparent: [K, K, K, 0] };
  var Nt = function(e16, t3, n4) {
    return e16 += e16 < 0 ? 1 : e16 > 1 ? -1 : 0, (e16 * 6 < 1 ? t3 + (n4 - t3) * e16 * 6 : e16 < 0.5 ? n4 : e16 * 3 < 2 ? t3 + (n4 - t3) * (2 / 3 - e16) * 6 : t3) * K + 0.5 | 0;
  };
  var Pt = function(e16, t3, n4) {
    var r4 = e16 ? _(e16) ? [e16 >> 16, e16 >> 8 & K, e16 & K] : 0 : Mt.black, i3, a4, o3, s3, c3, l3, u3, d3, f3, p3;
    if (!r4) {
      if (e16.substr(-1) === `,` && (e16 = e16.substr(0, e16.length - 1)), Mt[e16]) r4 = Mt[e16];
      else if (e16.charAt(0) === `#`) {
        if (e16.length < 6 && (i3 = e16.charAt(1), a4 = e16.charAt(2), o3 = e16.charAt(3), e16 = `#` + i3 + i3 + a4 + a4 + o3 + o3 + (e16.length === 5 ? e16.charAt(4) + e16.charAt(4) : ``)), e16.length === 9) return r4 = parseInt(e16.substr(1, 6), 16), [r4 >> 16, r4 >> 8 & K, r4 & K, parseInt(e16.substr(7), 16) / 255];
        e16 = parseInt(e16.substr(1), 16), r4 = [e16 >> 16, e16 >> 8 & K, e16 & K];
      } else if (e16.substr(0, 3) === `hsl`) {
        if (r4 = p3 = e16.match(D), !t3) s3 = r4[0] % 360 / 360, c3 = r4[1] / 100, l3 = r4[2] / 100, a4 = l3 <= 0.5 ? l3 * (c3 + 1) : l3 + c3 - l3 * c3, i3 = l3 * 2 - a4, r4.length > 3 && (r4[3] *= 1), r4[0] = Nt(s3 + 1 / 3, i3, a4), r4[1] = Nt(s3, i3, a4), r4[2] = Nt(s3 - 1 / 3, i3, a4);
        else if (~e16.indexOf(`=`)) return r4 = e16.match(O), n4 && r4.length < 4 && (r4[3] = 1), r4;
      } else r4 = e16.match(D) || Mt.transparent;
      r4 = r4.map(Number);
    }
    return t3 && !p3 && (i3 = r4[0] / K, a4 = r4[1] / K, o3 = r4[2] / K, u3 = Math.max(i3, a4, o3), d3 = Math.min(i3, a4, o3), l3 = (u3 + d3) / 2, u3 === d3 ? s3 = c3 = 0 : (f3 = u3 - d3, c3 = l3 > 0.5 ? f3 / (2 - u3 - d3) : f3 / (u3 + d3), s3 = u3 === i3 ? (a4 - o3) / f3 + (a4 < o3 ? 6 : 0) : u3 === a4 ? (o3 - i3) / f3 + 2 : (i3 - a4) / f3 + 4, s3 *= 60), r4[0] = ~~(s3 + 0.5), r4[1] = ~~(c3 * 100 + 0.5), r4[2] = ~~(l3 * 100 + 0.5)), n4 && r4.length < 4 && (r4[3] = 1), r4;
  };
  var Ft = function(e16) {
    var t3 = [], n4 = [], r4 = -1;
    return e16.split(Lt).forEach(function(e17) {
      var i3 = e17.match(k) || [];
      t3.push.apply(t3, i3), n4.push(r4 += i3.length + 1);
    }), t3.c = n4, t3;
  };
  var It = function(e16, t3, n4) {
    var r4 = ``, i3 = (e16 + r4).match(Lt), a4 = t3 ? `hsla(` : `rgba(`, o3 = 0, s3, c3, l3, u3;
    if (!i3) return e16;
    if (i3 = i3.map(function(e17) {
      return (e17 = Pt(e17, t3, 1)) && a4 + (t3 ? e17[0] + `,` + e17[1] + `%,` + e17[2] + `%,` + e17[3] : e17.join(`,`)) + `)`;
    }), n4 && (l3 = Ft(e16), s3 = n4.c, s3.join(r4) !== l3.c.join(r4))) for (c3 = e16.replace(Lt, `1`).split(k), u3 = c3.length - 1; o3 < u3; o3++) r4 += c3[o3] + (~s3.indexOf(o3) ? i3.shift() || a4 + `0,0,0,0)` : (l3.length ? l3 : i3.length ? i3 : n4).shift());
    if (!c3) for (c3 = e16.split(Lt), u3 = c3.length - 1; o3 < u3; o3++) r4 += c3[o3] + i3[o3];
    return r4 + c3[u3];
  };
  var Lt = (function() {
    var e16 = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`, t3;
    for (t3 in Mt) e16 += `|` + t3 + `\\b`;
    return RegExp(e16 + `)`, `gi`);
  })();
  var Rt = /hsl[a]?\(/;
  var zt = function(e16) {
    var t3 = e16.join(` `), n4;
    if (Lt.lastIndex = 0, Lt.test(t3)) return n4 = Rt.test(t3), e16[1] = It(e16[1], n4), e16[0] = It(e16[0], n4, Ft(e16[1])), true;
  };
  var Bt;
  var Vt = (function() {
    var e16 = Date.now, t3 = 500, n4 = 33, r4 = e16(), i3 = r4, a4 = 1e3 / 240, o3 = a4, s3 = [], c3, l3, u3, d3, f3, p3, m3 = function u4(m4) {
      var h3 = e16() - i3, g3 = m4 === true, _3, v3, y3, b3;
      if ((h3 > t3 || h3 < 0) && (r4 += h3 - n4), i3 += h3, y3 = i3 - r4, _3 = y3 - o3, (_3 > 0 || g3) && (b3 = ++d3.frame, f3 = y3 - d3.time * 1e3, d3.time = y3 /= 1e3, o3 += _3 + (_3 >= a4 ? 4 : a4 - _3), v3 = 1), g3 || (c3 = l3(u4)), v3) for (p3 = 0; p3 < s3.length; p3++) s3[p3](y3, f3, b3, m4);
    };
    return d3 = { time: 0, frame: 0, tick: function() {
      m3(true);
    }, deltaRatio: function(e17) {
      return f3 / (1e3 / (e17 || 60));
    }, wake: function() {
      B && (!I && x() && (F = I = window, L = F.document || {}, R.gsap = Z, (F.gsapVersions || (F.gsapVersions = [])).push(Z.version), ee(z || F.GreenSockGlobals || !F.gsap && F || {}), At.forEach(jt)), u3 = typeof requestAnimationFrame < `u` && requestAnimationFrame, c3 && d3.sleep(), l3 = u3 || function(e17) {
        return setTimeout(e17, o3 - d3.time * 1e3 + 1 | 0);
      }, Bt = 1, m3(2));
    }, sleep: function() {
      (u3 ? cancelAnimationFrame : clearTimeout)(c3), Bt = 0, l3 = ie;
    }, lagSmoothing: function(e17, r5) {
      t3 = e17 || 1 / 0, n4 = Math.min(r5 || 33, t3);
    }, fps: function(e17) {
      a4 = 1e3 / (e17 || 240), o3 = d3.time * 1e3 + a4;
    }, add: function(e17, t4, n5) {
      var r5 = t4 ? function(t5, n6, i4, a5) {
        e17(t5, n6, i4, a5), d3.remove(r5);
      } : e17;
      return d3.remove(e17), s3[n5 ? `unshift` : `push`](r5), Ht(), r5;
    }, remove: function(e17, t4) {
      ~(t4 = s3.indexOf(e17)) && s3.splice(t4, 1) && p3 >= t4 && p3--;
    }, _listeners: s3 }, d3;
  })();
  var Ht = function() {
    return !Bt && Vt.wake();
  };
  var q = {};
  var Ut = /^[\d.\-M][\d.\-,\s]/;
  var Wt = /["']/g;
  var Gt = function(e16) {
    for (var t3 = {}, n4 = e16.substr(1, e16.length - 3).split(`:`), r4 = n4[0], i3 = 1, a4 = n4.length, o3, s3, c3; i3 < a4; i3++) s3 = n4[i3], o3 = i3 === a4 - 1 ? s3.length : s3.lastIndexOf(`,`), c3 = s3.substr(0, o3), t3[r4] = isNaN(c3) ? c3.replace(Wt, ``).trim() : +c3, r4 = s3.substr(o3 + 1).trim();
    return t3;
  };
  var Kt = function(e16) {
    var t3 = e16.indexOf(`(`) + 1, n4 = e16.indexOf(`)`), r4 = e16.indexOf(`(`, t3);
    return e16.substring(t3, ~r4 && r4 < n4 ? e16.indexOf(`)`, n4 + 1) : n4);
  };
  var qt = function(e16) {
    var t3 = (e16 + ``).split(`(`), n4 = q[t3[0]];
    return n4 && t3.length > 1 && n4.config ? n4.config.apply(null, ~e16.indexOf(`{`) ? [Gt(t3[1])] : Kt(e16).split(`,`).map(we)) : q._CE && Ut.test(e16) ? q._CE(``, e16) : n4;
  };
  var Jt = function(e16) {
    return function(t3) {
      return 1 - e16(1 - t3);
    };
  };
  var Yt = function(e16, t3) {
    return e16 && (g(e16) ? e16 : q[e16] || qt(e16)) || t3;
  };
  var Xt = function(e16, t3, n4, r4) {
    n4 === void 0 && (n4 = function(e17) {
      return 1 - t3(1 - e17);
    }), r4 === void 0 && (r4 = function(e17) {
      return e17 < 0.5 ? t3(e17 * 2) / 2 : 1 - t3((1 - e17) * 2) / 2;
    });
    var i3 = { easeIn: t3, easeOut: n4, easeInOut: r4 }, a4;
    return H(e16, function(e17) {
      for (var t4 in q[e17] = R[e17] = i3, q[a4 = e17.toLowerCase()] = n4, i3) q[a4 + (t4 === `easeIn` ? `.in` : t4 === `easeOut` ? `.out` : `.inOut`)] = q[e17 + `.` + t4] = i3[t4];
    }), i3;
  };
  var Zt = function(e16) {
    return function(t3) {
      return t3 < 0.5 ? (1 - e16(1 - t3 * 2)) / 2 : 0.5 + e16((t3 - 0.5) * 2) / 2;
    };
  };
  var Qt = function e9(t3, n4, r4) {
    var i3 = n4 >= 1 ? n4 : 1, a4 = (r4 || (t3 ? 0.3 : 0.45)) / (n4 < 1 ? n4 : 1), o3 = a4 / l * (Math.asin(1 / i3) || 0), s3 = function(e16) {
      return e16 === 1 ? 1 : i3 * 2 ** (-10 * e16) * m((e16 - o3) * a4) + 1;
    }, c3 = t3 === `out` ? s3 : t3 === `in` ? function(e16) {
      return 1 - s3(1 - e16);
    } : Zt(s3);
    return a4 = l / a4, c3.config = function(n5, r5) {
      return e9(t3, n5, r5);
    }, c3;
  };
  var $t = function e10(t3, n4) {
    n4 === void 0 && (n4 = 1.70158);
    var r4 = function(e16) {
      return e16 ? --e16 * e16 * ((n4 + 1) * e16 + n4) + 1 : 0;
    }, i3 = t3 === `out` ? r4 : t3 === `in` ? function(e16) {
      return 1 - r4(1 - e16);
    } : Zt(r4);
    return i3.config = function(n5) {
      return e10(t3, n5);
    }, i3;
  };
  H(`Linear,Quad,Cubic,Quart,Quint,Strong`, function(e16, t3) {
    var n4 = t3 < 5 ? t3 + 1 : t3;
    Xt(e16 + `,Power` + (n4 - 1), t3 ? function(e17) {
      return e17 ** +n4;
    } : function(e17) {
      return e17;
    }, function(e17) {
      return 1 - (1 - e17) ** n4;
    }, function(e17) {
      return e17 < 0.5 ? (e17 * 2) ** n4 / 2 : 1 - ((1 - e17) * 2) ** n4 / 2;
    });
  }), q.Linear.easeNone = q.none = q.Linear.easeIn, Xt(`Elastic`, Qt(`in`), Qt(`out`), Qt()), (function(e16, t3) {
    var n4 = 1 / t3, r4 = 2 * n4, i3 = 2.5 * n4, a4 = function(a5) {
      return a5 < n4 ? e16 * a5 * a5 : a5 < r4 ? e16 * (a5 - 1.5 / t3) ** 2 + 0.75 : a5 < i3 ? e16 * (a5 -= 2.25 / t3) * a5 + 0.9375 : e16 * (a5 - 2.625 / t3) ** 2 + 0.984375;
    };
    Xt(`Bounce`, function(e17) {
      return 1 - a4(1 - e17);
    }, a4);
  })(7.5625, 2.75), Xt(`Expo`, function(e16) {
    return 2 ** (10 * (e16 - 1)) * e16 + e16 * e16 * e16 * e16 * e16 * e16 * (1 - e16);
  }), Xt(`Circ`, function(e16) {
    return -(f(1 - e16 * e16) - 1);
  }), Xt(`Sine`, function(e16) {
    return e16 === 1 ? 1 : -p(e16 * u) + 1;
  }), Xt(`Back`, $t(`in`), $t(`out`), $t()), q.SteppedEase = q.steps = R.SteppedEase = { config: function(e16, t3) {
    e16 === void 0 && (e16 = 1);
    var n4 = 1 / e16, r4 = e16 + +!t3, i3 = +!!t3, a4 = 1 - c;
    return function(e17) {
      return ((r4 * at(0, a4, e17) | 0) + i3) * n4;
    };
  } }, r.ease = q[`quad.out`], H(`onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`, function(e16) {
    return he += e16 + `,` + e16 + `Params,`;
  });
  var en = function(e16, t3) {
    this.id = d++, e16._gsap = this, this.target = e16, this.harness = t3, this.get = t3 ? t3.get : ve, this.set = t3 ? t3.getSetter : bn;
  };
  var tn = (function() {
    function e16(e17) {
      this.vars = e17, this._delay = +e17.delay || 0, (this._repeat = e17.repeat === 1 / 0 ? -2 : e17.repeat || 0) && (this._rDelay = e17.repeatDelay || 0, this._yoyo = !!e17.yoyo || !!e17.yoyoEase), this._ts = 1, $e(this, +e17.duration, 1, 1), this.data = e17.data, o && (this._ctx = o, o.data.push(this)), Bt || Vt.wake();
    }
    var t3 = e16.prototype;
    return t3.delay = function(e17) {
      return e17 || e17 === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e17 - this._delay), this._delay = e17, this) : this._delay;
    }, t3.duration = function(e17) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? e17 + (e17 + this._rDelay) * this._repeat : e17) : this.totalDuration() && this._dur;
    }, t3.totalDuration = function(e17) {
      return arguments.length ? (this._dirty = 0, $e(this, this._repeat < 0 ? e17 : (e17 - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, t3.totalTime = function(e17, t4) {
      if (Ht(), !arguments.length) return this._tTime;
      var n4 = this._dp;
      if (n4 && n4.smoothChildTiming && this._ts) {
        for (We(this, e17), !n4._dp || n4.parent || Ge(n4, this); n4 && n4.parent; ) n4.parent._time !== n4._start + (n4._ts >= 0 ? n4._tTime / n4._ts : (n4.totalDuration() - n4._tTime) / -n4._ts) && n4.totalTime(n4._tTime, true), n4 = n4.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e17 < this._tDur || this._ts < 0 && e17 > 0 || !this._tDur && !e17) && Ke(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== e17 || !this._dur && !t4 || this._initted && Math.abs(this._zTime) === c || !this._initted && this._dur && e17 || !e17 && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e17), Ce(this, e17, t4)), this;
    }, t3.time = function(e17, t4) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e17 + Be(this)) % (this._dur + this._rDelay) || (e17 ? this._dur : 0), t4) : this._time;
    }, t3.totalProgress = function(e17, t4) {
      return arguments.length ? this.totalTime(this.totalDuration() * e17, t4) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, t3.progress = function(e17, t4) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e17 : e17) + Be(this), t4) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
    }, t3.iteration = function(e17, t4) {
      var n4 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (e17 - 1) * n4, t4) : this._repeat ? Ve(this._tTime, n4) + 1 : 1;
    }, t3.timeScale = function(e17, t4) {
      if (!arguments.length) return this._rts === -c ? 0 : this._rts;
      if (this._rts === e17) return this;
      var n4 = this.parent && this._ts ? He(this.parent._time, this) : this._tTime;
      return this._rts = +e17 || 0, this._ts = this._ps || e17 === -c ? 0 : this._rts, this.totalTime(at(-Math.abs(this._delay), this.totalDuration(), n4), t4 !== false), Ue(this), Le(this);
    }, t3.paused = function(e17) {
      return arguments.length ? (this._ps !== e17 && (this._ps = e17, e17 ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Ht(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== c && (this._tTime -= c)))), this) : this._ps;
    }, t3.startTime = function(e17) {
      if (arguments.length) {
        this._start = W(e17);
        var t4 = this.parent || this._dp;
        return t4 && (t4._sort || !this.parent) && Ke(t4, this, this._start - this._delay), this;
      }
      return this._start;
    }, t3.endTime = function(e17) {
      return this._start + (b(e17) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, t3.rawTime = function(e17) {
      var t4 = this.parent || this._dp;
      return t4 ? e17 && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? He(t4.rawTime(e17), this) : this._tTime : this._tTime;
    }, t3.revert = function(e17) {
      e17 === void 0 && (e17 = se);
      var t4 = a;
      return a = e17, Se(this) && (this.timeline && this.timeline.revert(e17), this.totalTime(-0.01, e17.suppressEvents)), this.data !== `nested` && e17.kill !== false && this.kill(), a = t4, this;
    }, t3.globalTime = function(e17) {
      for (var t4 = this, n4 = arguments.length ? e17 : t4.rawTime(); t4; ) n4 = t4._start + n4 / (Math.abs(t4._ts) || 1), t4 = t4._dp;
      return !this.parent && this._sat ? this._sat.globalTime(e17) : n4;
    }, t3.repeat = function(e17) {
      return arguments.length ? (this._repeat = e17 === 1 / 0 ? -2 : e17, et(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, t3.repeatDelay = function(e17) {
      if (arguments.length) {
        var t4 = this._time;
        return this._rDelay = e17, et(this), t4 ? this.time(t4) : this;
      }
      return this._rDelay;
    }, t3.yoyo = function(e17) {
      return arguments.length ? (this._yoyo = e17, this) : this._yoyo;
    }, t3.seek = function(e17, t4) {
      return this.totalTime(nt(this, e17), b(t4));
    }, t3.restart = function(e17, t4) {
      return this.play().totalTime(e17 ? -this._delay : 0, b(t4)), this._dur || (this._zTime = -c), this;
    }, t3.play = function(e17, t4) {
      return e17 != null && this.seek(e17, t4), this.reversed(false).paused(false);
    }, t3.reverse = function(e17, t4) {
      return e17 != null && this.seek(e17 || this.totalDuration(), t4), this.reversed(true).paused(false);
    }, t3.pause = function(e17, t4) {
      return e17 != null && this.seek(e17, t4), this.paused(true);
    }, t3.resume = function() {
      return this.paused(false);
    }, t3.reversed = function(e17) {
      return arguments.length ? (!!e17 !== this.reversed() && this.timeScale(-this._rts || (e17 ? -c : 0)), this) : this._rts < 0;
    }, t3.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -c, this;
    }, t3.isActive = function() {
      var e17 = this.parent || this._dp, t4 = this._start, n4;
      return !!(!e17 || this._ts && this._initted && e17.isActive() && (n4 = e17.rawTime(true)) >= t4 && n4 < this.endTime(true) - c);
    }, t3.eventCallback = function(e17, t4, n4) {
      var r4 = this.vars;
      return arguments.length > 1 ? (t4 ? (r4[e17] = t4, n4 && (r4[e17 + `Params`] = n4), e17 === `onUpdate` && (this._onUpdate = t4)) : delete r4[e17], this) : r4[e17];
    }, t3.then = function(e17) {
      var t4 = this, n4 = t4._prom;
      return new Promise(function(r4) {
        var i3 = g(e17) ? e17 : Te, a4 = function() {
          var e18 = t4.then;
          t4.then = null, n4 && n4(), g(i3) && (i3 = i3(t4)) && (i3.then || i3 === t4) && (t4.then = e18), r4(i3), t4.then = e18;
        };
        t4._initted && t4.totalProgress() === 1 && t4._ts >= 0 || !t4._tTime && t4._ts < 0 ? a4() : t4._prom = a4;
      });
    }, t3.kill = function() {
      Ot(this);
    }, e16;
  })();
  Ee(tn.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -c, _prom: 0, _ps: false, _rts: 1 });
  var J = (function(r4) {
    t(i3, r4);
    function i3(t3, n4) {
      var i4;
      return t3 === void 0 && (t3 = {}), i4 = r4.call(this, t3) || this, i4.labels = {}, i4.smoothChildTiming = !!t3.smoothChildTiming, i4.autoRemoveChildren = !!t3.autoRemoveChildren, i4._sort = b(t3.sortChildren), P && Ke(t3.parent || P, e(i4), n4), t3.reversed && i4.reverse(), t3.paused && i4.paused(true), t3.scrollTrigger && qe(e(i4), t3.scrollTrigger), i4;
    }
    var o3 = i3.prototype;
    return o3.to = function(e16, t3, n4) {
      return rt(0, arguments, this), this;
    }, o3.from = function(e16, t3, n4) {
      return rt(1, arguments, this), this;
    }, o3.fromTo = function(e16, t3, n4, r5) {
      return rt(2, arguments, this), this;
    }, o3.set = function(e16, t3, n4) {
      return t3.duration = 0, t3.parent = this, je(t3).repeatDelay || (t3.repeat = 0), t3.immediateRender = !!t3.immediateRender, new Y(e16, t3, nt(this, n4), 1), this;
    }, o3.call = function(e16, t3, n4) {
      return Ke(this, Y.delayedCall(0, e16, t3), n4);
    }, o3.staggerTo = function(e16, t3, n4, r5, i4, a4, o4) {
      return n4.duration = t3, n4.stagger = n4.stagger || r5, n4.onComplete = a4, n4.onCompleteParams = o4, n4.parent = this, new Y(e16, n4, nt(this, i4)), this;
    }, o3.staggerFrom = function(e16, t3, n4, r5, i4, a4, o4) {
      return n4.runBackwards = 1, je(n4).immediateRender = b(n4.immediateRender), this.staggerTo(e16, t3, n4, r5, i4, a4, o4);
    }, o3.staggerFromTo = function(e16, t3, n4, r5, i4, a4, o4, s3) {
      return r5.startAt = n4, je(r5).immediateRender = b(r5.immediateRender), this.staggerTo(e16, t3, r5, i4, a4, o4, s3);
    }, o3.render = function(e16, t3, n4) {
      var r5 = this._time, i4 = this._dirty ? this.totalDuration() : this._tDur, o4 = this._dur, s3 = e16 <= 0 ? 0 : W(e16), l3 = this._zTime < 0 != e16 < 0 && (this._initted || !o4), u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
      if (this !== P && s3 > i4 && e16 >= 0 && (s3 = i4), s3 !== this._tTime || n4 || l3) {
        if (r5 !== this._time && o4 && (s3 += this._time - r5, e16 += this._time - r5), u3 = s3, v3 = this._start, _3 = this._ts, h3 = !_3, l3 && (o4 || (r5 = this._zTime), (e16 || !t3) && (this._zTime = e16)), this._repeat) {
          if (b3 = this._yoyo, m3 = o4 + this._rDelay, this._repeat < -1 && e16 < 0) return this.totalTime(m3 * 100 + e16, t3, n4);
          if (u3 = W(s3 % m3), s3 === i4 ? (p3 = this._repeat, u3 = o4) : (y3 = W(s3 / m3), p3 = ~~y3, p3 && p3 === y3 && (u3 = o4, p3--), u3 > o4 && (u3 = o4)), y3 = Ve(this._tTime, m3), !r5 && this._tTime && y3 !== p3 && this._tTime - y3 * m3 - this._dur <= 0 && (y3 = p3), b3 && p3 & 1 && (u3 = o4 - u3, x3 = 1), p3 !== y3 && !this._lock) {
            var S3 = b3 && y3 & 1, C3 = S3 === (b3 && p3 & 1);
            if (p3 < y3 && (S3 = !S3), r5 = S3 ? 0 : s3 % o4 ? o4 : s3, this._lock = 1, this.render(r5 || (x3 ? 0 : W(p3 * m3)), t3, !o4)._lock = 0, this._tTime = s3, !t3 && this.parent && Dt(this, `onRepeat`), this.vars.repeatRefresh && !x3 && (this.invalidate()._lock = 1, y3 = p3), r5 && r5 !== this._time || h3 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (o4 = this._dur, i4 = this._tDur, C3 && (this._lock = 2, r5 = S3 ? o4 : -1e-4, this.render(r5, true), this.vars.repeatRefresh && !x3 && this.invalidate()), this._lock = 0, !this._ts && !h3)) return this;
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g3 = Qe(this, W(r5), W(u3)), g3 && (s3 -= u3 - (u3 = g3._start))), this._tTime = s3, this._time = u3, this._act = !!_3, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e16, r5 = 0), !r5 && s3 && o4 && !t3 && !y3 && (Dt(this, `onStart`), this._tTime !== s3)) return this;
        if (u3 >= r5 && e16 >= 0) for (d3 = this._first; d3; ) {
          if (f3 = d3._next, (d3._act || u3 >= d3._start) && d3._ts && g3 !== d3) {
            if (d3.parent !== this) return this.render(e16, t3, n4);
            if (d3.render(d3._ts > 0 ? (u3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (u3 - d3._start) * d3._ts, t3, n4), u3 !== this._time || !this._ts && !h3) {
              g3 = 0, f3 && (s3 += this._zTime = -c);
              break;
            }
          }
          d3 = f3;
        }
        else {
          d3 = this._last;
          for (var w2 = e16 < 0 ? e16 : u3; d3; ) {
            if (f3 = d3._prev, (d3._act || w2 <= d3._end) && d3._ts && g3 !== d3) {
              if (d3.parent !== this) return this.render(e16, t3, n4);
              if (d3.render(d3._ts > 0 ? (w2 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (w2 - d3._start) * d3._ts, t3, n4 || a && Se(d3)), u3 !== this._time || !this._ts && !h3) {
                g3 = 0, f3 && (s3 += this._zTime = w2 ? -c : c);
                break;
              }
            }
            d3 = f3;
          }
        }
        if (g3 && !t3 && (this.pause(), g3.render(u3 >= r5 ? 0 : -c)._zTime = u3 >= r5 ? 1 : -1, this._ts)) return this._start = v3, Ue(this), this.render(e16, t3, n4);
        this._onUpdate && !t3 && Dt(this, `onUpdate`, true), (s3 === i4 && this._tTime >= this.totalDuration() || !s3 && r5) && (v3 === this._start || Math.abs(_3) !== Math.abs(this._ts)) && (this._lock || ((e16 || !o4) && (s3 === i4 && this._ts > 0 || !s3 && this._ts < 0) && Fe(this, 1), !t3 && !(e16 < 0 && !r5) && (s3 || r5 || !i4) && (Dt(this, s3 === i4 && e16 >= 0 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s3 < i4 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, o3.add = function(e16, t3) {
      var n4 = this;
      if (_(t3) || (t3 = nt(this, t3, e16)), !(e16 instanceof tn)) {
        if (w(e16)) return e16.forEach(function(e17) {
          return n4.add(e17, t3);
        }), this;
        if (h(e16)) return this.addLabel(e16, t3);
        if (g(e16)) e16 = Y.delayedCall(0, e16);
        else return this;
      }
      return this === e16 ? this : Ke(this, e16, t3);
    }, o3.getChildren = function(e16, t3, n4, r5) {
      e16 === void 0 && (e16 = true), t3 === void 0 && (t3 = true), n4 === void 0 && (n4 = true), r5 === void 0 && (r5 = -s);
      for (var i4 = [], a4 = this._first; a4; ) a4._start >= r5 && (a4 instanceof Y ? t3 && i4.push(a4) : (n4 && i4.push(a4), e16 && i4.push.apply(i4, a4.getChildren(true, t3, n4)))), a4 = a4._next;
      return i4;
    }, o3.getById = function(e16) {
      for (var t3 = this.getChildren(1, 1, 1), n4 = t3.length; n4--; ) if (t3[n4].vars.id === e16) return t3[n4];
    }, o3.remove = function(e16) {
      return h(e16) ? this.removeLabel(e16) : g(e16) ? this.killTweensOf(e16) : (e16.parent === this && Pe(this, e16), e16 === this._recent && (this._recent = this._last), Ie(this));
    }, o3.totalTime = function(e16, t3) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = W(Vt.time - (this._ts > 0 ? e16 / this._ts : (this.totalDuration() - e16) / -this._ts))), r4.prototype.totalTime.call(this, e16, t3), this._forcing = 0, this) : this._tTime;
    }, o3.addLabel = function(e16, t3) {
      return this.labels[e16] = nt(this, t3), this;
    }, o3.removeLabel = function(e16) {
      return delete this.labels[e16], this;
    }, o3.addPause = function(e16, t3, n4) {
      var r5 = Y.delayedCall(0, t3 || ie, n4);
      return r5.data = `isPause`, this._hasPause = 1, Ke(this, r5, nt(this, e16));
    }, o3.removePause = function(e16) {
      var t3 = this._first;
      for (e16 = nt(this, e16); t3; ) t3._start === e16 && t3.data === `isPause` && Fe(t3), t3 = t3._next;
    }, o3.killTweensOf = function(e16, t3, n4) {
      for (var r5 = this.getTweensOf(e16, n4), i4 = r5.length; i4--; ) sn !== r5[i4] && r5[i4].kill(e16, t3);
      return this;
    }, o3.getTweensOf = function(e16, t3) {
      for (var n4 = [], r5 = ut(e16), i4 = this._first, a4 = _(t3), o4; i4; ) i4 instanceof Y ? be(i4._targets, r5) && (a4 ? (!sn || i4._initted && i4._ts) && i4.globalTime(0) <= t3 && i4.globalTime(i4.totalDuration()) > t3 : !t3 || i4.isActive()) && n4.push(i4) : (o4 = i4.getTweensOf(r5, t3)).length && n4.push.apply(n4, o4), i4 = i4._next;
      return n4;
    }, o3.tweenTo = function(e16, t3) {
      t3 || (t3 = {});
      var n4 = this, r5 = nt(n4, e16), i4 = t3, a4 = i4.startAt, o4 = i4.onStart, s3 = i4.onStartParams, l3 = i4.immediateRender, u3, d3 = Y.to(n4, Ee({ ease: t3.ease || `none`, lazy: false, immediateRender: false, time: r5, overwrite: `auto`, duration: t3.duration || Math.abs((r5 - (a4 && `time` in a4 ? a4.time : n4._time)) / n4.timeScale()) || c, onStart: function() {
        if (n4.pause(), !u3) {
          var e17 = t3.duration || Math.abs((r5 - (a4 && `time` in a4 ? a4.time : n4._time)) / n4.timeScale());
          d3._dur !== e17 && $e(d3, e17, 0, 1).render(d3._time, true, true), u3 = 1;
        }
        o4 && o4.apply(d3, s3 || []);
      } }, t3));
      return l3 ? d3.render(0) : d3;
    }, o3.tweenFromTo = function(e16, t3, n4) {
      return this.tweenTo(t3, Ee({ startAt: { time: nt(this, e16) } }, n4));
    }, o3.recent = function() {
      return this._recent;
    }, o3.nextLabel = function(e16) {
      return e16 === void 0 && (e16 = this._time), Et(this, nt(this, e16));
    }, o3.previousLabel = function(e16) {
      return e16 === void 0 && (e16 = this._time), Et(this, nt(this, e16), 1);
    }, o3.currentLabel = function(e16) {
      return arguments.length ? this.seek(e16, true) : this.previousLabel(this._time + c);
    }, o3.shiftChildren = function(e16, t3, n4) {
      n4 === void 0 && (n4 = 0);
      var r5 = this._first, i4 = this.labels, a4;
      for (e16 = W(e16); r5; ) r5._start >= n4 && (r5._start += e16, r5._end += e16), r5 = r5._next;
      if (t3) for (a4 in i4) i4[a4] >= n4 && (i4[a4] += e16);
      return Ie(this);
    }, o3.invalidate = function(e16) {
      var t3 = this._first;
      for (this._lock = 0; t3; ) t3.invalidate(e16), t3 = t3._next;
      return r4.prototype.invalidate.call(this, e16);
    }, o3.clear = function(e16) {
      e16 === void 0 && (e16 = true);
      for (var t3 = this._first, n4; t3; ) n4 = t3._next, this.remove(t3), t3 = n4;
      return this._dp && (this._time = this._tTime = this._pTime = 0), e16 && (this.labels = {}), Ie(this);
    }, o3.totalDuration = function(e16) {
      var t3 = 0, n4 = this, r5 = n4._last, i4 = s, a4, o4, c3;
      if (arguments.length) return n4.timeScale((n4._repeat < 0 ? n4.duration() : n4.totalDuration()) / (n4.reversed() ? -e16 : e16));
      if (n4._dirty) {
        for (c3 = n4.parent; r5; ) a4 = r5._prev, r5._dirty && r5.totalDuration(), o4 = r5._start, o4 > i4 && n4._sort && r5._ts && !n4._lock ? (n4._lock = 1, Ke(n4, r5, o4 - r5._delay, 1)._lock = 0) : i4 = o4, o4 < 0 && r5._ts && (t3 -= o4, (!c3 && !n4._dp || c3 && c3.smoothChildTiming) && (n4._start += W(o4 / n4._ts), n4._time -= o4, n4._tTime -= o4), n4.shiftChildren(-o4, false, -1 / 0), i4 = 0), r5._end > t3 && r5._ts && (t3 = r5._end), r5 = a4;
        $e(n4, n4 === P && n4._time > t3 ? n4._time : t3, 1, 1), n4._dirty = 0;
      }
      return n4._tDur;
    }, i3.updateRoot = function(e16) {
      if (P._ts && (Ce(P, He(e16, P)), de = Vt.frame), Vt.frame >= pe) {
        pe += n.autoSleep || 120;
        var t3 = P._first;
        if ((!t3 || !t3._ts) && n.autoSleep && Vt._listeners.length < 2) {
          for (; t3 && !t3._ts; ) t3 = t3._next;
          t3 || Vt.sleep();
        }
      }
    }, i3;
  })(tn);
  Ee(J.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
  var nn = function(e16, t3, n4, r4, i3, a4, o3) {
    var s3 = new X(this._pt, e16, t3, 0, 1, Cn, null, i3), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3;
    for (s3.b = n4, s3.e = r4, n4 += ``, r4 += ``, (g3 = ~r4.indexOf(`random(`)) && (r4 = Ct(r4)), a4 && (_3 = [n4, r4], a4(_3, e16, t3), n4 = _3[0], r4 = _3[1]), d3 = n4.match(A) || []; u3 = A.exec(r4); ) p3 = u3[0], m3 = r4.substring(c3, u3.index), f3 ? f3 = (f3 + 1) % 5 : m3.substr(-5) === `rgba(` && (f3 = 1), p3 !== d3[l3++] && (h3 = parseFloat(d3[l3 - 1]) || 0, s3._pt = { _next: s3._pt, p: m3 || l3 === 1 ? m3 : `,`, s: h3, c: p3.charAt(1) === `=` ? ye(h3, p3) - h3 : parseFloat(p3) - h3, m: f3 && f3 < 4 ? Math.round : 0 }, c3 = A.lastIndex);
    return s3.c = c3 < r4.length ? r4.substring(c3, r4.length) : ``, s3.fp = o3, (j.test(r4) || g3) && (s3.e = 0), this._pt = s3, s3;
  };
  var rn = function(e16, t3, r4, i3, a4, o3, s3, c3, l3, u3) {
    g(i3) && (i3 = i3(a4 || 0, e16, o3));
    var d3 = e16[t3], f3 = r4 === `get` ? g(d3) ? l3 ? e16[t3.indexOf(`set`) || !g(e16[`get` + t3.substr(3)]) ? t3 : `get` + t3.substr(3)](l3) : e16[t3]() : d3 : r4, p3 = g(d3) ? l3 ? vn : _n : gn, m3;
    if (h(i3) && (~i3.indexOf(`random(`) && (i3 = Ct(i3)), i3.charAt(1) === `=` && (m3 = ye(f3, i3) + (G(f3) || 0), (m3 || m3 === 0) && (i3 = m3))), !u3 || f3 !== i3 || cn) return !isNaN(f3 * i3) && i3 !== `` ? (m3 = new X(this._pt, e16, t3, +f3 || 0, i3 - (f3 || 0), typeof d3 == `boolean` ? Sn : xn, 0, p3), l3 && (m3.fp = l3), s3 && m3.modifier(s3, this, e16), this._pt = m3) : (!d3 && !(t3 in e16) && te(t3, i3), nn.call(this, e16, t3, f3, i3, p3, c3 || n.stringFilter, l3));
  };
  var an = function(e16, t3, n4, r4, i3) {
    if (g(e16) && (e16 = pn(e16, i3, t3, n4, r4)), !y(e16) || e16.style && e16.nodeType || w(e16) || C(e16)) return h(e16) ? pn(e16, i3, t3, n4, r4) : e16;
    var a4 = {}, o3;
    for (o3 in e16) a4[o3] = pn(e16[o3], i3, t3, n4, r4);
    return a4;
  };
  var on = function(e16, t3, n4, r4, i3, a4) {
    var o3, s3, c3, l3;
    if (V[e16] && (o3 = new V[e16]()).init(i3, o3.rawVars ? t3[e16] : an(t3[e16], r4, i3, a4, n4), n4, r4, a4) !== false && (n4._pt = s3 = new X(n4._pt, i3, e16, 0, 1, o3.render, o3, 0, o3.priority), n4 !== kt)) for (c3 = n4._ptLookup[n4._targets.indexOf(i3)], l3 = o3._props.length; l3--; ) c3[o3._props[l3]] = s3;
    return o3;
  };
  var sn;
  var cn;
  var ln = function e11(t3, n4, o3) {
    var l3 = t3.vars, u3 = l3.ease, d3 = l3.startAt, f3 = l3.immediateRender, p3 = l3.lazy, m3 = l3.onUpdate, h3 = l3.runBackwards, g3 = l3.yoyoEase, _3 = l3.keyframes, v3 = l3.autoRevert, y3 = t3._dur, x3 = t3._startAt, S3 = t3._targets, C3 = t3.parent, w2 = C3 && C3.data === `nested` ? C3.vars.targets : S3, T2 = t3._overwrite === `auto` && !i, E2 = t3.timeline, D2 = l3.easeReverse || g3, O2, k2, A2, j2, M2, N2, F2, I2, L2, R2, z2, B2, ee2;
    if (E2 && (!_3 || !u3) && (u3 = `none`), t3._ease = Yt(u3, r.ease), t3._rEase = D2 && (Yt(D2) || t3._ease), t3._from = !E2 && !!l3.runBackwards, t3._from && (t3.ratio = 1), !E2 || _3 && !l3.stagger) {
      if (I2 = S3[0] ? _e(S3[0]).harness : 0, B2 = I2 && l3[I2.prop], O2 = Ae(l3, ce), x3 && (x3._zTime < 0 && x3.progress(1), n4 < 0 && h3 && f3 && !v3 ? x3.render(-1, true) : x3.revert(h3 && y3 ? oe : ae), x3._lazy = 0), d3) {
        if (Fe(t3._startAt = Y.set(S3, Ee({ data: `isStart`, overwrite: false, parent: C3, immediateRender: true, lazy: !x3 && b(p3), startAt: null, delay: 0, onUpdate: m3 && function() {
          return Dt(t3, `onUpdate`);
        }, stagger: 0 }, d3))), t3._startAt._dp = 0, t3._startAt._sat = t3, n4 < 0 && (a || !f3 && !v3) && t3._startAt.revert(oe), f3 && y3 && n4 <= 0 && o3 <= 0) {
          n4 && (t3._zTime = n4);
          return;
        }
      } else if (h3 && y3 && !x3) {
        if (n4 && (f3 = false), A2 = Ee({ overwrite: false, data: `isFromStart`, lazy: f3 && !x3 && b(p3), immediateRender: f3, stagger: 0, parent: C3 }, O2), B2 && (A2[I2.prop] = B2), Fe(t3._startAt = Y.set(S3, A2)), t3._startAt._dp = 0, t3._startAt._sat = t3, n4 < 0 && (a ? t3._startAt.revert(oe) : t3._startAt.render(-1, true)), t3._zTime = n4, !f3) e11(t3._startAt, c, c);
        else if (!n4) return;
      }
      for (t3._pt = t3._ptCache = 0, p3 = y3 && b(p3) || p3 && !y3, k2 = 0; k2 < S3.length; k2++) {
        if (M2 = S3[k2], F2 = M2._gsap || ge(S3)[k2]._gsap, t3._ptLookup[k2] = R2 = {}, ue[F2.id] && le.length && xe(), z2 = w2 === S3 ? k2 : w2.indexOf(M2), I2 && (L2 = new I2()).init(M2, B2 || O2, t3, z2, w2) !== false && (t3._pt = j2 = new X(t3._pt, M2, L2.name, 0, 1, L2.render, L2, 0, L2.priority), L2._props.forEach(function(e16) {
          R2[e16] = j2;
        }), L2.priority && (N2 = 1)), !I2 || B2) for (A2 in O2) V[A2] && (L2 = on(A2, O2, t3, z2, M2, w2)) ? L2.priority && (N2 = 1) : R2[A2] = j2 = rn.call(t3, M2, A2, `get`, O2[A2], z2, w2, 0, l3.stringFilter);
        t3._op && t3._op[k2] && t3.kill(M2, t3._op[k2]), T2 && t3._pt && (sn = t3, P.killTweensOf(M2, R2, t3.globalTime(n4)), ee2 = !t3.parent, sn = 0), t3._pt && p3 && (ue[F2.id] = 1);
      }
      N2 && On(t3), t3._onInit && t3._onInit(t3);
    }
    t3._onUpdate = m3, t3._initted = (!t3._op || t3._pt) && !ee2, _3 && n4 <= 0 && E2.render(s, true, true);
  };
  var un = function(e16, t3, n4, r4, i3, a4, o3, s3) {
    var c3 = (e16._pt && e16._ptCache || (e16._ptCache = {}))[t3], l3, u3, d3, f3;
    if (!c3) for (c3 = e16._ptCache[t3] = [], d3 = e16._ptLookup, f3 = e16._targets.length; f3--; ) {
      if (l3 = d3[f3][t3], l3 && l3.d && l3.d._pt) for (l3 = l3.d._pt; l3 && l3.p !== t3 && l3.fp !== t3; ) l3 = l3._next;
      if (!l3) return cn = 1, e16.vars[t3] = `+=0`, ln(e16, o3), cn = 0, s3 ? ne(t3 + ` not eligible for reset. Try splitting into individual properties`) : 1;
      c3.push(l3);
    }
    for (f3 = c3.length; f3--; ) u3 = c3[f3], l3 = u3._pt || u3, l3.s = (r4 || r4 === 0) && !i3 ? r4 : l3.s + (r4 || 0) + a4 * l3.c, l3.c = n4 - l3.s, u3.e && (u3.e = U(n4) + G(u3.e)), u3.b && (u3.b = l3.s + G(u3.b));
  };
  var dn = function(e16, t3) {
    var n4 = e16[0] ? _e(e16[0]).harness : 0, r4 = n4 && n4.aliases, i3, a4, o3, s3;
    if (!r4) return t3;
    for (a4 in i3 = Oe({}, t3), r4) if (a4 in i3) for (s3 = r4[a4].split(`,`), o3 = s3.length; o3--; ) i3[s3[o3]] = i3[a4];
    return i3;
  };
  var fn = function(e16, t3, n4, r4) {
    var i3 = t3.ease || r4 || `power1.inOut`, a4, o3;
    if (w(t3)) o3 = n4[e16] || (n4[e16] = []), t3.forEach(function(e17, n5) {
      return o3.push({ t: n5 / (t3.length - 1) * 100, v: e17, e: i3 });
    });
    else for (a4 in t3) o3 = n4[a4] || (n4[a4] = []), a4 === `ease` || o3.push({ t: parseFloat(e16), v: t3[a4], e: i3 });
  };
  var pn = function(e16, t3, n4, r4, i3) {
    return g(e16) ? e16.call(t3, n4, r4, i3) : h(e16) && ~e16.indexOf(`random(`) ? Ct(e16) : e16;
  };
  var mn = he + `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`;
  var hn = {};
  H(mn + `,id,stagger,delay,duration,paused,scrollTrigger`, function(e16) {
    return hn[e16] = 1;
  });
  var Y = (function(r4) {
    t(o3, r4);
    function o3(t3, a4, o4, s4) {
      var l3;
      typeof a4 == `number` && (o4.duration = a4, a4 = o4, o4 = null), l3 = r4.call(this, s4 ? a4 : je(a4)) || this;
      var u3 = l3.vars, d3 = u3.duration, f3 = u3.delay, p3 = u3.immediateRender, m3 = u3.stagger, h3 = u3.overwrite, g3 = u3.keyframes, v3 = u3.defaults, x3 = u3.scrollTrigger, T2 = a4.parent || P, E2 = (w(t3) || C(t3) ? _(t3[0]) : `length` in a4) ? [t3] : ut(t3), D2, O2, k2, A2, j2, M2, N2, F2;
      if (l3._targets = E2.length ? ge(E2) : ne(`GSAP target ` + t3 + ` not found. https://gsap.com`, !n.nullTargetWarn) || [], l3._ptLookup = [], l3._overwrite = h3, g3 || m3 || S(d3) || S(f3)) {
        a4 = l3.vars;
        var I2 = a4.easeReverse || a4.yoyoEase;
        if (D2 = l3.timeline = new J({ data: `nested`, defaults: v3 || {}, targets: T2 && T2.data === `nested` ? T2.vars.targets : E2 }), D2.kill(), D2.parent = D2._dp = e(l3), D2._start = 0, m3 || S(d3) || S(f3)) {
          if (A2 = E2.length, N2 = m3 && pt(m3), y(m3)) for (j2 in m3) ~mn.indexOf(j2) && (F2 || (F2 = {}), F2[j2] = m3[j2]);
          for (O2 = 0; O2 < A2; O2++) k2 = Ae(a4, hn), k2.stagger = 0, I2 && (k2.easeReverse = I2), F2 && Oe(k2, F2), M2 = E2[O2], k2.duration = +pn(d3, e(l3), O2, M2, E2), k2.delay = (+pn(f3, e(l3), O2, M2, E2) || 0) - l3._delay, !m3 && A2 === 1 && k2.delay && (l3._delay = f3 = k2.delay, l3._start += f3, k2.delay = 0), D2.to(M2, k2, N2 ? N2(O2, M2, E2) : 0), D2._ease = q.none;
          D2.duration() ? d3 = f3 = 0 : l3.timeline = 0;
        } else if (g3) {
          je(Ee(D2.vars.defaults, { ease: `none` })), D2._ease = Yt(g3.ease || a4.ease || `none`);
          var L2 = 0, R2, z2, B2;
          if (w(g3)) g3.forEach(function(e16) {
            return D2.to(E2, e16, `>`);
          }), D2.duration();
          else {
            for (j2 in k2 = {}, g3) j2 === `ease` || j2 === `easeEach` || fn(j2, g3[j2], k2, g3.easeEach);
            for (j2 in k2) for (R2 = k2[j2].sort(function(e16, t4) {
              return e16.t - t4.t;
            }), L2 = 0, O2 = 0; O2 < R2.length; O2++) z2 = R2[O2], B2 = { ease: z2.e, duration: (z2.t - (O2 ? R2[O2 - 1].t : 0)) / 100 * d3 }, B2[j2] = z2.v, D2.to(E2, B2, L2), L2 += B2.duration;
            D2.duration() < d3 && D2.to({}, { duration: d3 - D2.duration() });
          }
        }
        d3 || l3.duration(d3 = D2.duration());
      } else l3.timeline = 0;
      return h3 === true && !i && (sn = e(l3), P.killTweensOf(E2), sn = 0), Ke(T2, e(l3), o4), a4.reversed && l3.reverse(), a4.paused && l3.paused(true), (p3 || !d3 && !g3 && l3._start === W(T2._time) && b(p3) && ze(e(l3)) && T2.data !== `nested`) && (l3._tTime = -c, l3.render(Math.max(0, -f3) || 0)), x3 && qe(e(l3), x3), l3;
    }
    var s3 = o3.prototype;
    return s3.render = function(e16, t3, n4) {
      var r5 = this._time, i3 = this._tDur, a4 = this._dur, o4 = e16 < 0, s4 = e16 > i3 - c && !o4 ? i3 : e16 < c ? 0 : e16, l3, u3, d3, f3, p3, m3, h3, g3;
      if (!a4) Ze(this, e16, t3, n4);
      else if (s4 !== this._tTime || !e16 || n4 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o4 || this._lazy) {
        if (l3 = s4, g3 = this.timeline, this._repeat) {
          if (f3 = a4 + this._rDelay, this._repeat < -1 && o4) return this.totalTime(f3 * 100 + e16, t3, n4);
          if (l3 = W(s4 % f3), s4 === i3 ? (d3 = this._repeat, l3 = a4) : (p3 = W(s4 / f3), d3 = ~~p3, d3 && d3 === p3 ? (l3 = a4, d3--) : l3 > a4 && (l3 = a4)), m3 = this._yoyo && d3 & 1, m3 && (l3 = a4 - l3), p3 = Ve(this._tTime, f3), l3 === r5 && !n4 && this._initted && d3 === p3) return this._tTime = s4, this;
          d3 !== p3 && this.vars.repeatRefresh && !m3 && !this._lock && l3 !== f3 && this._initted && (this._lock = n4 = 1, this.render(W(f3 * d3), true).invalidate()._lock = 0);
        }
        if (!this._initted) {
          if (Je(this, o4 ? e16 : l3, n4, t3, s4)) return this._tTime = 0, this;
          if (r5 !== this._time && !(n4 && this.vars.repeatRefresh && d3 !== p3)) return this;
          if (a4 !== this._dur) return this.render(e16, t3, n4);
        }
        if (this._rEase) {
          var _3 = l3 < r5;
          if (_3 !== this._inv) {
            var v3 = _3 ? r5 : a4 - r5;
            this._inv = _3, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = r5, this._invRecip = v3 ? (_3 ? -1 : 1) / v3 : 0, this._invScale = _3 ? -this.ratio : 1 - this.ratio, this._invEase = _3 ? this._rEase : this._ease;
          }
          this.ratio = h3 = this._invRatio + this._invScale * this._invEase((l3 - this._invTime) * this._invRecip);
        } else this.ratio = h3 = this._ease(l3 / a4);
        if (this._from && (this.ratio = h3 = 1 - h3), this._tTime = s4, this._time = l3, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r5 && s4 && !t3 && !p3 && (Dt(this, `onStart`), this._tTime !== s4)) return this;
        for (u3 = this._pt; u3; ) u3.r(h3, u3.d), u3 = u3._next;
        g3 && g3.render(e16 < 0 ? e16 : g3._dur * g3._ease(l3 / this._dur), t3, n4) || this._startAt && (this._zTime = e16), this._onUpdate && !t3 && (o4 && Re(this, e16, t3, n4), Dt(this, `onUpdate`)), this._repeat && d3 !== p3 && this.vars.onRepeat && !t3 && this.parent && Dt(this, `onRepeat`), (s4 === this._tDur || !s4) && this._tTime === s4 && (o4 && !this._onUpdate && Re(this, e16, true, true), (e16 || !a4) && (s4 === this._tDur && this._ts > 0 || !s4 && this._ts < 0) && Fe(this, 1), !t3 && !(o4 && !r5) && (s4 || r5 || m3) && (Dt(this, s4 === i3 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s4 < i3 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, s3.targets = function() {
      return this._targets;
    }, s3.invalidate = function(e16) {
      return (!e16 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e16), r4.prototype.invalidate.call(this, e16);
    }, s3.resetTo = function(e16, t3, n4, r5, i3) {
      Bt || Vt.wake(), this._ts || this.play();
      var a4 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o4;
      return this._initted || ln(this, a4), o4 = this._ease(a4 / this._dur), un(this, e16, t3, n4, r5, o4, a4, i3) ? this.resetTo(e16, t3, n4, r5, 1) : (We(this, 0), this.parent || Ne(this._dp, this, `_first`, `_last`, this._dp._sort ? `_start` : 0), this.render(0));
    }, s3.kill = function(e16, t3) {
      if (t3 === void 0 && (t3 = `all`), !e16 && (!t3 || t3 === `all`)) return this._lazy = this._pt = 0, this.parent ? Ot(this) : this.scrollTrigger && this.scrollTrigger.kill(!!a), this;
      if (this.timeline) {
        var n4 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(e16, t3, sn && sn.vars.overwrite !== true)._first || Ot(this), this.parent && n4 !== this.timeline.totalDuration() && $e(this, this._dur * this.timeline._tDur / n4, 0, 1), this;
      }
      var r5 = this._targets, i3 = e16 ? ut(e16) : r5, o4 = this._ptLookup, s4 = this._pt, c3, l3, u3, d3, f3, p3, m3;
      if ((!t3 || t3 === `all`) && Me(r5, i3)) return t3 === `all` && (this._pt = 0), Ot(this);
      for (c3 = this._op = this._op || [], t3 !== `all` && (h(t3) && (f3 = {}, H(t3, function(e17) {
        return f3[e17] = 1;
      }), t3 = f3), t3 = dn(r5, t3)), m3 = r5.length; m3--; ) if (~i3.indexOf(r5[m3])) for (f3 in l3 = o4[m3], t3 === `all` ? (c3[m3] = t3, d3 = l3, u3 = {}) : (u3 = c3[m3] = c3[m3] || {}, d3 = t3), d3) p3 = l3 && l3[f3], p3 && ((!(`kill` in p3.d) || p3.d.kill(f3) === true) && Pe(this, p3, `_pt`), delete l3[f3]), u3 !== `all` && (u3[f3] = 1);
      return this._initted && !this._pt && s4 && Ot(this), this;
    }, o3.to = function(e16, t3) {
      return new o3(e16, t3, arguments[2]);
    }, o3.from = function(e16, t3) {
      return rt(1, arguments);
    }, o3.delayedCall = function(e16, t3, n4, r5) {
      return new o3(t3, 0, { immediateRender: false, lazy: false, overwrite: false, delay: e16, onComplete: t3, onReverseComplete: t3, onCompleteParams: n4, onReverseCompleteParams: n4, callbackScope: r5 });
    }, o3.fromTo = function(e16, t3, n4) {
      return rt(2, arguments);
    }, o3.set = function(e16, t3) {
      return t3.duration = 0, t3.repeatDelay || (t3.repeat = 0), new o3(e16, t3);
    }, o3.killTweensOf = function(e16, t3, n4) {
      return P.killTweensOf(e16, t3, n4);
    }, o3;
  })(tn);
  Ee(Y.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }), H(`staggerTo,staggerFrom,staggerFromTo`, function(e16) {
    Y[e16] = function() {
      var t3 = new J(), n4 = st.call(arguments, 0);
      return n4.splice(e16 === `staggerFromTo` ? 5 : 4, 0, 0), t3[e16].apply(t3, n4);
    };
  });
  var gn = function(e16, t3, n4) {
    return e16[t3] = n4;
  };
  var _n = function(e16, t3, n4) {
    return e16[t3](n4);
  };
  var vn = function(e16, t3, n4, r4) {
    return e16[t3](r4.fp, n4);
  };
  var yn = function(e16, t3, n4) {
    return e16.setAttribute(t3, n4);
  };
  var bn = function(e16, t3) {
    return g(e16[t3]) ? _n : v(e16[t3]) && e16.setAttribute ? yn : gn;
  };
  var xn = function(e16, t3) {
    return t3.set(t3.t, t3.p, Math.round((t3.s + t3.c * e16) * 1e6) / 1e6, t3);
  };
  var Sn = function(e16, t3) {
    return t3.set(t3.t, t3.p, !!(t3.s + t3.c * e16), t3);
  };
  var Cn = function(e16, t3) {
    var n4 = t3._pt, r4 = ``;
    if (!e16 && t3.b) r4 = t3.b;
    else if (e16 === 1 && t3.e) r4 = t3.e;
    else {
      for (; n4; ) r4 = n4.p + (n4.m ? n4.m(n4.s + n4.c * e16) : Math.round((n4.s + n4.c * e16) * 1e4) / 1e4) + r4, n4 = n4._next;
      r4 += t3.c;
    }
    t3.set(t3.t, t3.p, r4, t3);
  };
  var wn = function(e16, t3) {
    for (var n4 = t3._pt; n4; ) n4.r(e16, n4.d), n4 = n4._next;
  };
  var Tn = function(e16, t3, n4, r4) {
    for (var i3 = this._pt, a4; i3; ) a4 = i3._next, i3.p === r4 && i3.modifier(e16, t3, n4), i3 = a4;
  };
  var En = function(e16) {
    for (var t3 = this._pt, n4, r4; t3; ) r4 = t3._next, t3.p === e16 && !t3.op || t3.op === e16 ? Pe(this, t3, `_pt`) : t3.dep || (n4 = 1), t3 = r4;
    return !n4;
  };
  var Dn = function(e16, t3, n4, r4) {
    r4.mSet(e16, t3, r4.m.call(r4.tween, n4, r4.mt), r4);
  };
  var On = function(e16) {
    for (var t3 = e16._pt, n4, r4, i3, a4; t3; ) {
      for (n4 = t3._next, r4 = i3; r4 && r4.pr > t3.pr; ) r4 = r4._next;
      (t3._prev = r4 ? r4._prev : a4) ? t3._prev._next = t3 : i3 = t3, (t3._next = r4) ? r4._prev = t3 : a4 = t3, t3 = n4;
    }
    e16._pt = i3;
  };
  var X = (function() {
    function e16(e17, t4, n4, r4, i3, a4, o3, s3, c3) {
      this.t = t4, this.s = r4, this.c = i3, this.p = n4, this.r = a4 || xn, this.d = o3 || this, this.set = s3 || gn, this.pr = c3 || 0, this._next = e17, e17 && (e17._prev = this);
    }
    var t3 = e16.prototype;
    return t3.modifier = function(e17, t4, n4) {
      this.mSet = this.mSet || this.set, this.set = Dn, this.m = e17, this.mt = n4, this.tween = t4;
    }, e16;
  })();
  H(he + `parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`, function(e16) {
    return ce[e16] = 1;
  }), R.TweenMax = R.TweenLite = Y, R.TimelineLite = R.TimelineMax = J, P = new J({ sortChildren: false, defaults: r, autoRemoveChildren: true, id: `root`, smoothChildTiming: true }), n.stringFilter = zt;
  var kn = [];
  var An = {};
  var jn = [];
  var Mn = 0;
  var Nn = 0;
  var Pn = function(e16) {
    return (An[e16] || jn).map(function(e17) {
      return e17();
    });
  };
  var Fn = function() {
    var e16 = Date.now(), t3 = [];
    e16 - Mn > 2 && (Pn(`matchMediaInit`), kn.forEach(function(e17) {
      var n4 = e17.queries, r4 = e17.conditions, i3, a4, o3, s3;
      for (a4 in n4) i3 = F.matchMedia(n4[a4]).matches, i3 && (o3 = 1), i3 !== r4[a4] && (r4[a4] = i3, s3 = 1);
      s3 && (e17.revert(), o3 && t3.push(e17));
    }), Pn(`matchMediaRevert`), t3.forEach(function(e17) {
      return e17.onMatch(e17, function(t4) {
        return e17.add(null, t4);
      });
    }), Mn = e16, Pn(`matchMedia`));
  };
  var In = (function() {
    function e16(e17, t4) {
      this.selector = t4 && dt(t4), this.data = [], this._r = [], this.isReverted = false, this.id = Nn++, e17 && this.add(e17);
    }
    var t3 = e16.prototype;
    return t3.add = function(e17, t4, n4) {
      g(e17) && (n4 = t4, t4 = e17, e17 = g);
      var r4 = this, i3 = function() {
        var e18 = o, i4 = r4.selector, a4;
        return e18 && e18 !== r4 && e18.data.push(r4), n4 && (r4.selector = dt(n4)), o = r4, a4 = t4.apply(r4, arguments), g(a4) && r4._r.push(a4), o = e18, r4.selector = i4, r4.isReverted = false, a4;
      };
      return r4.last = i3, e17 === g ? i3(r4, function(e18) {
        return r4.add(null, e18);
      }) : e17 ? r4[e17] = i3 : i3;
    }, t3.ignore = function(e17) {
      var t4 = o;
      o = null, e17(this), o = t4;
    }, t3.getTweens = function() {
      var t4 = [];
      return this.data.forEach(function(n4) {
        return n4 instanceof e16 ? t4.push.apply(t4, n4.getTweens()) : n4 instanceof Y && !(n4.parent && n4.parent.data === `nested`) && t4.push(n4);
      }), t4;
    }, t3.clear = function() {
      this._r.length = this.data.length = 0;
    }, t3.kill = function(e17, t4) {
      var n4 = this;
      if (e17 ? (function() {
        for (var t5 = n4.getTweens(), r5 = n4.data.length, i3; r5--; ) i3 = n4.data[r5], i3.data === `isFlip` && (i3.revert(), i3.getChildren(true, true, false).forEach(function(e18) {
          return t5.splice(t5.indexOf(e18), 1);
        }));
        for (t5.map(function(e18) {
          return { g: e18._dur || e18._delay || e18._sat && !e18._sat.vars.immediateRender ? e18.globalTime(0) : -1 / 0, t: e18 };
        }).sort(function(e18, t6) {
          return t6.g - e18.g || -1 / 0;
        }).forEach(function(t6) {
          return t6.t.revert(e17);
        }), r5 = n4.data.length; r5--; ) i3 = n4.data[r5], i3 instanceof J ? i3.data !== `nested` && (i3.scrollTrigger && i3.scrollTrigger.revert(), i3.kill()) : !(i3 instanceof Y) && i3.revert && i3.revert(e17);
        n4._r.forEach(function(t6) {
          return t6(e17, n4);
        }), n4.isReverted = true;
      })() : this.data.forEach(function(e18) {
        return e18.kill && e18.kill();
      }), this.clear(), t4) for (var r4 = kn.length; r4--; ) kn[r4].id === this.id && kn.splice(r4, 1);
    }, t3.revert = function(e17) {
      this.kill(e17 || {});
    }, e16;
  })();
  var Ln = (function() {
    function e16(e17) {
      this.contexts = [], this.scope = e17, o && o.data.push(this);
    }
    var t3 = e16.prototype;
    return t3.add = function(e17, t4, n4) {
      y(e17) || (e17 = { matches: e17 });
      var r4 = new In(0, n4 || this.scope), i3 = r4.conditions = {}, a4, s3, c3;
      for (s3 in o && !r4.selector && (r4.selector = o.selector), this.contexts.push(r4), t4 = r4.add(`onMatch`, t4), r4.queries = e17, e17) s3 === `all` ? c3 = 1 : (a4 = F.matchMedia(e17[s3]), a4 && (kn.indexOf(r4) < 0 && kn.push(r4), (i3[s3] = a4.matches) && (c3 = 1), a4.addListener ? a4.addListener(Fn) : a4.addEventListener(`change`, Fn)));
      return c3 && t4(r4, function(e18) {
        return r4.add(null, e18);
      }), this;
    }, t3.revert = function(e17) {
      this.kill(e17 || {});
    }, t3.kill = function(e17) {
      this.contexts.forEach(function(t4) {
        return t4.kill(e17, true);
      });
    }, e16;
  })();
  var Rn = { registerPlugin: function() {
    [...arguments].forEach(function(e16) {
      return jt(e16);
    });
  }, timeline: function(e16) {
    return new J(e16);
  }, getTweensOf: function(e16, t3) {
    return P.getTweensOf(e16, t3);
  }, getProperty: function(e16, t3, n4, r4) {
    h(e16) && (e16 = ut(e16)[0]);
    var i3 = _e(e16 || {}).get, a4 = n4 ? Te : we;
    return n4 === `native` && (n4 = ``), e16 && (t3 ? a4((V[t3] && V[t3].get || i3)(e16, t3, n4, r4)) : function(t4, n5, r5) {
      return a4((V[t4] && V[t4].get || i3)(e16, t4, n5, r5));
    });
  }, quickSetter: function(e16, t3, n4) {
    if (e16 = ut(e16), e16.length > 1) {
      var r4 = e16.map(function(e17) {
        return Z.quickSetter(e17, t3, n4);
      }), i3 = r4.length;
      return function(e17) {
        for (var t4 = i3; t4--; ) r4[t4](e17);
      };
    }
    e16 = e16[0] || {};
    var a4 = V[t3], o3 = _e(e16), s3 = o3.harness && (o3.harness.aliases || {})[t3] || t3, c3 = a4 ? function(t4) {
      var r5 = new a4();
      kt._pt = 0, r5.init(e16, n4 ? t4 + n4 : t4, kt, 0, [e16]), r5.render(1, r5), kt._pt && wn(1, kt);
    } : o3.set(e16, s3);
    return a4 ? c3 : function(t4) {
      return c3(e16, s3, n4 ? t4 + n4 : t4, o3, 1);
    };
  }, quickTo: function(e16, t3, n4) {
    var r4, i3 = Z.to(e16, Ee((r4 = {}, r4[t3] = `+=0.1`, r4.paused = true, r4.stagger = 0, r4), n4 || {})), a4 = function(e17, n5, r5) {
      return i3.resetTo(t3, e17, n5, r5);
    };
    return a4.tween = i3, a4;
  }, isTweening: function(e16) {
    return P.getTweensOf(e16, true).length > 0;
  }, defaults: function(e16) {
    return e16 && e16.ease && (e16.ease = Yt(e16.ease, r.ease)), ke(r, e16 || {});
  }, config: function(e16) {
    return ke(n, e16 || {});
  }, registerEffect: function(e16) {
    var t3 = e16.name, n4 = e16.effect, r4 = e16.plugins, i3 = e16.defaults, a4 = e16.extendTimeline;
    (r4 || ``).split(`,`).forEach(function(e17) {
      return e17 && !V[e17] && !R[e17] && ne(t3 + ` effect requires ` + e17 + ` plugin.`);
    }), fe[t3] = function(e17, t4, r5) {
      return n4(ut(e17), Ee(t4 || {}, i3), r5);
    }, a4 && (J.prototype[t3] = function(e17, n5, r5) {
      return this.add(fe[t3](e17, y(n5) ? n5 : (r5 = n5) && {}, this), r5);
    });
  }, registerEase: function(e16, t3) {
    q[e16] = Yt(t3);
  }, parseEase: function(e16, t3) {
    return arguments.length ? Yt(e16, t3) : q;
  }, getById: function(e16) {
    return P.getById(e16);
  }, exportRoot: function(e16, t3) {
    e16 === void 0 && (e16 = {});
    var n4 = new J(e16), r4, i3;
    for (n4.smoothChildTiming = b(e16.smoothChildTiming), P.remove(n4), n4._dp = 0, n4._time = n4._tTime = P._time, r4 = P._first; r4; ) i3 = r4._next, (t3 || !(!r4._dur && r4 instanceof Y && r4.vars.onComplete === r4._targets[0])) && Ke(n4, r4, r4._start - r4._delay), r4 = i3;
    return Ke(P, n4, 0), n4;
  }, context: function(e16, t3) {
    return e16 ? new In(e16, t3) : o;
  }, matchMedia: function(e16) {
    return new Ln(e16);
  }, matchMediaRefresh: function() {
    return kn.forEach(function(e16) {
      var t3 = e16.conditions, n4, r4;
      for (r4 in t3) t3[r4] && (t3[r4] = false, n4 = 1);
      n4 && e16.revert();
    }) || Fn();
  }, addEventListener: function(e16, t3) {
    var n4 = An[e16] || (An[e16] = []);
    ~n4.indexOf(t3) || n4.push(t3);
  }, removeEventListener: function(e16, t3) {
    var n4 = An[e16], r4 = n4 && n4.indexOf(t3);
    r4 >= 0 && n4.splice(r4, 1);
  }, utils: { wrap: xt, wrapYoyo: St, distribute: pt, random: gt, snap: ht, normalize: yt, getUnit: G, clamp: ot, splitColor: Pt, toArray: ut, selector: dt, mapRange: wt, pipe: _t, unitize: vt, interpolate: Tt, shuffle: ft }, install: ee, effects: fe, ticker: Vt, updateRoot: J.updateRoot, plugins: V, globalTimeline: P, core: { PropTween: X, globals: re, Tween: Y, Timeline: J, Animation: tn, getCache: _e, _removeLinkedListItem: Pe, reverting: function() {
    return a;
  }, context: function(e16) {
    return e16 && o && (o.data.push(e16), e16._ctx = o), o;
  }, suppressOverwrites: function(e16) {
    return i = e16;
  } } };
  H(`to,from,fromTo,delayedCall,set,killTweensOf`, function(e16) {
    return Rn[e16] = Y[e16];
  }), Vt.add(J.updateRoot), kt = Rn.to({}, { duration: 0 });
  var zn = function(e16, t3) {
    for (var n4 = e16._pt; n4 && n4.p !== t3 && n4.op !== t3 && n4.fp !== t3; ) n4 = n4._next;
    return n4;
  };
  var Bn = function(e16, t3) {
    var n4 = e16._targets, r4, i3, a4;
    for (r4 in t3) for (i3 = n4.length; i3--; ) a4 = e16._ptLookup[i3][r4], a4 && (a4 = a4.d) && (a4._pt && (a4 = zn(a4, r4)), a4 && a4.modifier && a4.modifier(t3[r4], e16, n4[i3], r4));
  };
  var Vn = function(e16, t3) {
    return { name: e16, headless: 1, rawVars: 1, init: function(e17, n4, r4) {
      r4._onInit = function(e18) {
        var r5, i3;
        if (h(n4) && (r5 = {}, H(n4, function(e19) {
          return r5[e19] = 1;
        }), n4 = r5), t3) {
          for (i3 in r5 = {}, n4) r5[i3] = t3(n4[i3]);
          n4 = r5;
        }
        Bn(e18, n4);
      };
    } };
  };
  var Z = Rn.registerPlugin({ name: `attr`, init: function(e16, t3, n4, r4, i3) {
    var a4, o3, s3;
    for (a4 in this.tween = n4, t3) s3 = e16.getAttribute(a4) || ``, o3 = this.add(e16, `setAttribute`, (s3 || 0) + ``, t3[a4], r4, i3, 0, 0, a4), o3.op = a4, o3.b = s3, this._props.push(a4);
  }, render: function(e16, t3) {
    for (var n4 = t3._pt; n4; ) a ? n4.set(n4.t, n4.p, n4.b, n4) : n4.r(e16, n4.d), n4 = n4._next;
  } }, { name: `endArray`, headless: 1, init: function(e16, t3) {
    for (var n4 = t3.length; n4--; ) this.add(e16, n4, e16[n4] || 0, t3[n4], 0, 0, 0, 0, 0, 1);
  } }, Vn(`roundProps`, mt), Vn(`modifiers`), Vn(`snap`, ht)) || Rn;
  Y.version = J.version = Z.version = `3.15.0`, B = 1, x() && Ht(), q.Power0, q.Power1, q.Power2, q.Power3, q.Power4, q.Linear, q.Quad, q.Cubic, q.Quart, q.Quint, q.Strong, q.Elastic, q.Back, q.SteppedEase, q.Bounce, q.Sine, q.Expo, q.Circ;
  var Hn;
  var Un;
  var Wn;
  var Gn;
  var Kn;
  var qn;
  var Jn;
  var Yn = function() {
    return typeof window < `u`;
  };
  var Xn = {};
  var Zn = 180 / Math.PI;
  var Qn = Math.PI / 180;
  var $n = Math.atan2;
  var er = 1e8;
  var tr = /([A-Z])/g;
  var nr = /(left|right|width|margin|padding|x)/i;
  var rr = /[\s,\(]\S/;
  var ir = { autoAlpha: `opacity,visibility`, scale: `scaleX,scaleY`, alpha: `opacity` };
  var ar = function(e16, t3) {
    return t3.set(t3.t, t3.p, Math.round((t3.s + t3.c * e16) * 1e4) / 1e4 + t3.u, t3);
  };
  var or = function(e16, t3) {
    return t3.set(t3.t, t3.p, e16 === 1 ? t3.e : Math.round((t3.s + t3.c * e16) * 1e4) / 1e4 + t3.u, t3);
  };
  var sr = function(e16, t3) {
    return t3.set(t3.t, t3.p, e16 ? Math.round((t3.s + t3.c * e16) * 1e4) / 1e4 + t3.u : t3.b, t3);
  };
  var cr = function(e16, t3) {
    return t3.set(t3.t, t3.p, e16 === 1 ? t3.e : e16 ? Math.round((t3.s + t3.c * e16) * 1e4) / 1e4 + t3.u : t3.b, t3);
  };
  var lr = function(e16, t3) {
    var n4 = t3.s + t3.c * e16;
    t3.set(t3.t, t3.p, ~~(n4 + (n4 < 0 ? -0.5 : 0.5)) + t3.u, t3);
  };
  var ur = function(e16, t3) {
    return t3.set(t3.t, t3.p, e16 ? t3.e : t3.b, t3);
  };
  var dr = function(e16, t3) {
    return t3.set(t3.t, t3.p, e16 === 1 ? t3.e : t3.b, t3);
  };
  var fr = function(e16, t3, n4) {
    return e16.style[t3] = n4;
  };
  var pr = function(e16, t3, n4) {
    return e16.style.setProperty(t3, n4);
  };
  var mr = function(e16, t3, n4) {
    return e16._gsap[t3] = n4;
  };
  var hr = function(e16, t3, n4) {
    return e16._gsap.scaleX = e16._gsap.scaleY = n4;
  };
  var gr = function(e16, t3, n4, r4, i3) {
    var a4 = e16._gsap;
    a4.scaleX = a4.scaleY = n4, a4.renderTransform(i3, a4);
  };
  var _r = function(e16, t3, n4, r4, i3) {
    var a4 = e16._gsap;
    a4[t3] = n4, a4.renderTransform(i3, a4);
  };
  var Q = `transform`;
  var $ = Q + `Origin`;
  var vr = function e12(t3, n4) {
    var r4 = this, i3 = this.target, a4 = i3.style, o3 = i3._gsap;
    if (t3 in Xn && a4) {
      if (this.tfm = this.tfm || {}, t3 !== `transform`) t3 = ir[t3] || t3, ~t3.indexOf(`,`) ? t3.split(`,`).forEach(function(e16) {
        return r4.tfm[e16] = Lr(i3, e16);
      }) : this.tfm[t3] = o3.x ? o3[t3] : Lr(i3, t3), t3 === $ && (this.tfm.zOrigin = o3.zOrigin);
      else return ir.transform.split(`,`).forEach(function(t4) {
        return e12.call(r4, t4, n4);
      });
      if (this.props.indexOf(Q) >= 0) return;
      o3.svg && (this.svgo = i3.getAttribute(`data-svg-origin`), this.props.push($, n4, ``)), t3 = Q;
    }
    (a4 || n4) && this.props.push(t3, n4, a4[t3]);
  };
  var yr = function(e16) {
    e16.translate && (e16.removeProperty(`translate`), e16.removeProperty(`scale`), e16.removeProperty(`rotate`));
  };
  var br = function() {
    var e16 = this.props, t3 = this.target, n4 = t3.style, r4 = t3._gsap, i3, a4;
    for (i3 = 0; i3 < e16.length; i3 += 3) e16[i3 + 1] ? e16[i3 + 1] === 2 ? t3[e16[i3]](e16[i3 + 2]) : t3[e16[i3]] = e16[i3 + 2] : e16[i3 + 2] ? n4[e16[i3]] = e16[i3 + 2] : n4.removeProperty(e16[i3].substr(0, 2) === `--` ? e16[i3] : e16[i3].replace(tr, `-$1`).toLowerCase());
    if (this.tfm) {
      for (a4 in this.tfm) r4[a4] = this.tfm[a4];
      r4.svg && (r4.renderTransform(), t3.setAttribute(`data-svg-origin`, this.svgo || ``)), i3 = Jn(), (!i3 || !i3.isStart) && !n4[Q] && (yr(n4), r4.zOrigin && n4[$] && (n4[$] += ` ` + r4.zOrigin + `px`, r4.zOrigin = 0, r4.renderTransform()), r4.uncache = 1);
    }
  };
  var xr = function(e16, t3) {
    var n4 = { target: e16, props: [], revert: br, save: vr };
    return e16._gsap || Z.core.getCache(e16), t3 && e16.style && e16.nodeType && t3.split(`,`).forEach(function(e17) {
      return n4.save(e17);
    }), n4;
  };
  var Sr;
  var Cr = function(e16, t3) {
    var n4 = Un.createElementNS ? Un.createElementNS((t3 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e16) : Un.createElement(e16);
    return n4 && n4.style ? n4 : Un.createElement(e16);
  };
  var wr = function e13(t3, n4, r4) {
    var i3 = getComputedStyle(t3);
    return i3[n4] || i3.getPropertyValue(n4.replace(tr, `-$1`).toLowerCase()) || i3.getPropertyValue(n4) || !r4 && e13(t3, Er(n4) || n4, 1) || ``;
  };
  var Tr = `O,Moz,ms,Ms,Webkit`.split(`,`);
  var Er = function(e16, t3, n4) {
    var r4 = (t3 || Kn).style, i3 = 5;
    if (e16 in r4 && !n4) return e16;
    for (e16 = e16.charAt(0).toUpperCase() + e16.substr(1); i3-- && !(Tr[i3] + e16 in r4); ) ;
    return i3 < 0 ? null : (i3 === 3 ? `ms` : i3 >= 0 ? Tr[i3] : ``) + e16;
  };
  var Dr = function() {
    Yn() && window.document && (Hn = window, Un = Hn.document, Wn = Un.documentElement, Kn = Cr(`div`) || { style: {} }, Cr(`div`), Q = Er(Q), $ = Q + `Origin`, Kn.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`, Sr = !!Er(`perspective`), Jn = Z.core.reverting, Gn = 1);
  };
  var Or = function(e16) {
    var t3 = e16.ownerSVGElement, n4 = Cr(`svg`, t3 && t3.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg`), r4 = e16.cloneNode(true), i3;
    r4.style.display = `block`, n4.appendChild(r4), Wn.appendChild(n4);
    try {
      i3 = r4.getBBox();
    } catch {
    }
    return n4.removeChild(r4), Wn.removeChild(n4), i3;
  };
  var kr = function(e16, t3) {
    for (var n4 = t3.length; n4--; ) if (e16.hasAttribute(t3[n4])) return e16.getAttribute(t3[n4]);
  };
  var Ar = function(e16) {
    var t3, n4;
    try {
      t3 = e16.getBBox();
    } catch {
      t3 = Or(e16), n4 = 1;
    }
    return t3 && (t3.width || t3.height) || n4 || (t3 = Or(e16)), t3 && !t3.width && !t3.x && !t3.y ? { x: +kr(e16, [`x`, `cx`, `x1`]) || 0, y: +kr(e16, [`y`, `cy`, `y1`]) || 0, width: 0, height: 0 } : t3;
  };
  var jr = function(e16) {
    return !!(e16.getCTM && (!e16.parentNode || e16.ownerSVGElement) && Ar(e16));
  };
  var Mr = function(e16, t3) {
    if (t3) {
      var n4 = e16.style, r4;
      t3 in Xn && t3 !== $ && (t3 = Q), n4.removeProperty ? (r4 = t3.substr(0, 2), (r4 === `ms` || t3.substr(0, 6) === `webkit`) && (t3 = `-` + t3), n4.removeProperty(r4 === `--` ? t3 : t3.replace(tr, `-$1`).toLowerCase())) : n4.removeAttribute(t3);
    }
  };
  var Nr = function(e16, t3, n4, r4, i3, a4) {
    var o3 = new X(e16._pt, t3, n4, 0, 1, a4 ? dr : ur);
    return e16._pt = o3, o3.b = r4, o3.e = i3, e16._props.push(n4), o3;
  };
  var Pr = { deg: 1, rad: 1, turn: 1 };
  var Fr = { grid: 1, flex: 1 };
  var Ir = function e14(t3, n4, r4, i3) {
    var a4 = parseFloat(r4) || 0, o3 = (r4 + ``).trim().substr((a4 + ``).length) || `px`, s3 = Kn.style, c3 = nr.test(n4), l3 = t3.tagName.toLowerCase() === `svg`, u3 = (l3 ? `client` : `offset`) + (c3 ? `Width` : `Height`), d3 = 100, f3 = i3 === `px`, p3 = i3 === `%`, m3, h3, g3, _3;
    if (i3 === o3 || !a4 || Pr[i3] || Pr[o3]) return a4;
    if (o3 !== `px` && !f3 && (a4 = e14(t3, n4, r4, `px`)), _3 = t3.getCTM && jr(t3), (p3 || o3 === `%`) && (Xn[n4] || ~n4.indexOf(`adius`))) return m3 = _3 ? t3.getBBox()[c3 ? `width` : `height`] : t3[u3], U(p3 ? a4 / m3 * d3 : a4 / 100 * m3);
    if (s3[c3 ? `width` : `height`] = d3 + (f3 ? o3 : i3), h3 = i3 !== `rem` && ~n4.indexOf(`adius`) || i3 === `em` && t3.appendChild && !l3 ? t3 : t3.parentNode, _3 && (h3 = (t3.ownerSVGElement || {}).parentNode), (!h3 || h3 === Un || !h3.appendChild) && (h3 = Un.body), g3 = h3._gsap, g3 && p3 && g3.width && c3 && g3.time === Vt.time && !g3.uncache) return U(a4 / g3.width * d3);
    if (p3 && (n4 === `height` || n4 === `width`)) {
      var v3 = t3.style[n4];
      t3.style[n4] = d3 + i3, m3 = t3[u3], v3 ? t3.style[n4] = v3 : Mr(t3, n4);
    } else (p3 || o3 === `%`) && !Fr[wr(h3, `display`)] && (s3.position = wr(t3, `position`)), h3 === t3 && (s3.position = `static`), h3.appendChild(Kn), m3 = Kn[u3], h3.removeChild(Kn), s3.position = `absolute`;
    return c3 && p3 && (g3 = _e(h3), g3.time = Vt.time, g3.width = h3[u3]), U(f3 ? m3 * a4 / d3 : m3 && a4 ? d3 / m3 * a4 : 0);
  };
  var Lr = function(e16, t3, n4, r4) {
    var i3;
    return Gn || Dr(), t3 in ir && t3 !== `transform` && (t3 = ir[t3], ~t3.indexOf(`,`) && (t3 = t3.split(`,`)[0])), Xn[t3] && t3 !== `transform` ? (i3 = Yr(e16, r4), i3 = t3 === `transformOrigin` ? i3.svg ? i3.origin : Xr(wr(e16, $)) + ` ` + i3.zOrigin + `px` : i3[t3]) : (i3 = e16.style[t3], (!i3 || i3 === `auto` || r4 || ~(i3 + ``).indexOf(`calc(`)) && (i3 = Hr[t3] && Hr[t3](e16, t3, n4) || wr(e16, t3) || ve(e16, t3) || +(t3 === `opacity`))), n4 && !~(i3 + ``).trim().indexOf(` `) ? Ir(e16, t3, i3, n4) + n4 : i3;
  };
  var Rr = function(e16, t3, r4, i3) {
    if (!r4 || r4 === `none`) {
      var a4 = Er(t3, e16, 1), o3 = a4 && wr(e16, a4, 1);
      o3 && o3 !== r4 ? (t3 = a4, r4 = o3) : t3 === `borderColor` && (r4 = wr(e16, `borderTopColor`));
    }
    var s3 = new X(this._pt, e16.style, t3, 0, 1, Cn), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
    if (s3.b = r4, s3.e = i3, r4 += ``, i3 += ``, i3.substring(0, 6) === `var(--` && (i3 = wr(e16, i3.substring(4, i3.indexOf(`)`)))), i3 === `auto` && (h3 = e16.style[t3], e16.style[t3] = i3, i3 = wr(e16, t3) || i3, h3 ? e16.style[t3] = h3 : Mr(e16, t3)), u3 = [r4, i3], zt(u3), r4 = u3[0], i3 = u3[1], f3 = r4.match(k) || [], x3 = i3.match(k) || [], x3.length) {
      for (; d3 = k.exec(i3); ) g3 = d3[0], v3 = i3.substring(c3, d3.index), m3 ? m3 = (m3 + 1) % 5 : (v3.substr(-5) === `rgba(` || v3.substr(-5) === `hsla(`) && (m3 = 1), g3 !== (h3 = f3[l3++] || ``) && (p3 = parseFloat(h3) || 0, b3 = h3.substr((p3 + ``).length), g3.charAt(1) === `=` && (g3 = ye(p3, g3) + b3), _3 = parseFloat(g3), y3 = g3.substr((_3 + ``).length), c3 = k.lastIndex - y3.length, y3 || (y3 = y3 || n.units[t3] || b3, c3 === i3.length && (i3 += y3, s3.e += y3)), b3 !== y3 && (p3 = Ir(e16, t3, h3, y3) || 0), s3._pt = { _next: s3._pt, p: v3 || l3 === 1 ? v3 : `,`, s: p3, c: _3 - p3, m: m3 && m3 < 4 || t3 === `zIndex` ? Math.round : 0 });
      s3.c = c3 < i3.length ? i3.substring(c3, i3.length) : ``;
    } else s3.r = t3 === `display` && i3 === `none` ? dr : ur;
    return j.test(i3) && (s3.e = 0), this._pt = s3, s3;
  };
  var zr = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` };
  var Br = function(e16) {
    var t3 = e16.split(` `), n4 = t3[0], r4 = t3[1] || `50%`;
    return (n4 === `top` || n4 === `bottom` || r4 === `left` || r4 === `right`) && (e16 = n4, n4 = r4, r4 = e16), t3[0] = zr[n4] || n4, t3[1] = zr[r4] || r4, t3.join(` `);
  };
  var Vr = function(e16, t3) {
    if (t3.tween && t3.tween._time === t3.tween._dur) {
      var n4 = t3.t, r4 = n4.style, i3 = t3.u, a4 = n4._gsap, o3, s3, c3;
      if (i3 === `all` || i3 === true) r4.cssText = ``, s3 = 1;
      else for (i3 = i3.split(`,`), c3 = i3.length; --c3 > -1; ) o3 = i3[c3], Xn[o3] && (s3 = 1, o3 = o3 === `transformOrigin` ? $ : Q), Mr(n4, o3);
      s3 && (Mr(n4, Q), a4 && (a4.svg && n4.removeAttribute(`transform`), r4.scale = r4.rotate = r4.translate = `none`, Yr(n4, 1), a4.uncache = 1, yr(r4)));
    }
  };
  var Hr = { clearProps: function(e16, t3, n4, r4, i3) {
    if (i3.data !== `isFromStart`) {
      var a4 = e16._pt = new X(e16._pt, t3, n4, 0, 0, Vr);
      return a4.u = r4, a4.pr = -10, a4.tween = i3, e16._props.push(n4), 1;
    }
  } };
  var Ur = [1, 0, 0, 1, 0, 0];
  var Wr = {};
  var Gr = function(e16) {
    return e16 === `matrix(1, 0, 0, 1, 0, 0)` || e16 === `none` || !e16;
  };
  var Kr = function(e16) {
    var t3 = wr(e16, Q);
    return Gr(t3) ? Ur : t3.substr(7).match(O).map(U);
  };
  var qr = function(e16, t3) {
    var n4 = e16._gsap || _e(e16), r4 = e16.style, i3 = Kr(e16), a4, o3, s3, c3;
    return n4.svg && e16.getAttribute(`transform`) ? (s3 = e16.transform.baseVal.consolidate().matrix, i3 = [s3.a, s3.b, s3.c, s3.d, s3.e, s3.f], i3.join(`,`) === `1,0,0,1,0,0` ? Ur : i3) : (i3 === Ur && !e16.offsetParent && e16 !== Wn && !n4.svg && (s3 = r4.display, r4.display = `block`, a4 = e16.parentNode, (!a4 || !e16.offsetParent && !e16.getBoundingClientRect().width) && (c3 = 1, o3 = e16.nextElementSibling, Wn.appendChild(e16)), i3 = Kr(e16), s3 ? r4.display = s3 : Mr(e16, `display`), c3 && (o3 ? a4.insertBefore(e16, o3) : a4 ? a4.appendChild(e16) : Wn.removeChild(e16))), t3 && i3.length > 6 ? [i3[0], i3[1], i3[4], i3[5], i3[12], i3[13]] : i3);
  };
  var Jr = function(e16, t3, n4, r4, i3, a4) {
    var o3 = e16._gsap, s3 = i3 || qr(e16, true), c3 = o3.xOrigin || 0, l3 = o3.yOrigin || 0, u3 = o3.xOffset || 0, d3 = o3.yOffset || 0, f3 = s3[0], p3 = s3[1], m3 = s3[2], h3 = s3[3], g3 = s3[4], _3 = s3[5], v3 = t3.split(` `), y3 = parseFloat(v3[0]) || 0, b3 = parseFloat(v3[1]) || 0, x3, S3, C3, w2;
    n4 ? s3 !== Ur && (S3 = f3 * h3 - p3 * m3) && (C3 = h3 / S3 * y3 + b3 * (-m3 / S3) + (m3 * _3 - h3 * g3) / S3, w2 = y3 * (-p3 / S3) + f3 / S3 * b3 - (f3 * _3 - p3 * g3) / S3, y3 = C3, b3 = w2) : (x3 = Ar(e16), y3 = x3.x + (~v3[0].indexOf(`%`) ? y3 / 100 * x3.width : y3), b3 = x3.y + (~(v3[1] || v3[0]).indexOf(`%`) ? b3 / 100 * x3.height : b3)), r4 || r4 !== false && o3.smooth ? (g3 = y3 - c3, _3 = b3 - l3, o3.xOffset = u3 + (g3 * f3 + _3 * m3) - g3, o3.yOffset = d3 + (g3 * p3 + _3 * h3) - _3) : o3.xOffset = o3.yOffset = 0, o3.xOrigin = y3, o3.yOrigin = b3, o3.smooth = !!r4, o3.origin = t3, o3.originIsAbsolute = !!n4, e16.style[$] = `0px 0px`, a4 && (Nr(a4, o3, `xOrigin`, c3, y3), Nr(a4, o3, `yOrigin`, l3, b3), Nr(a4, o3, `xOffset`, u3, o3.xOffset), Nr(a4, o3, `yOffset`, d3, o3.yOffset)), e16.setAttribute(`data-svg-origin`, y3 + ` ` + b3);
  };
  var Yr = function(e16, t3) {
    var r4 = e16._gsap || new en(e16);
    if (`x` in r4 && !t3 && !r4.uncache) return r4;
    var i3 = e16.style, a4 = r4.scaleX < 0, o3 = `px`, s3 = `deg`, c3 = getComputedStyle(e16), l3 = wr(e16, $) || `0`, u3 = d3 = f3 = h3 = g3 = _3 = v3 = y3 = b3 = 0, d3, f3, p3 = m3 = 1, m3, h3, g3, _3, v3, y3, b3, x3, S3, C3, w2, T2, E2, D2, O2, k2, A2, j2, M2, N2, P2, F2, I2, L2, R2, z2, B2, ee2;
    return r4.svg = !!(e16.getCTM && jr(e16)), c3.translate && ((c3.translate !== `none` || c3.scale !== `none` || c3.rotate !== `none`) && (i3[Q] = (c3.translate === `none` ? `` : `translate3d(` + (c3.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) + `) `) + (c3.rotate === `none` ? `` : `rotate(` + c3.rotate + `) `) + (c3.scale === `none` ? `` : `scale(` + c3.scale.split(` `).join(`,`) + `) `) + (c3[Q] === `none` ? `` : c3[Q])), i3.scale = i3.rotate = i3.translate = `none`), C3 = qr(e16, r4.svg), r4.svg && (r4.uncache ? (P2 = e16.getBBox(), l3 = r4.xOrigin - P2.x + `px ` + (r4.yOrigin - P2.y) + `px`, N2 = ``) : N2 = !t3 && e16.getAttribute(`data-svg-origin`), Jr(e16, N2 || l3, !!N2 || r4.originIsAbsolute, r4.smooth !== false, C3)), x3 = r4.xOrigin || 0, S3 = r4.yOrigin || 0, C3 !== Ur && (D2 = C3[0], O2 = C3[1], k2 = C3[2], A2 = C3[3], u3 = j2 = C3[4], d3 = M2 = C3[5], C3.length === 6 ? (p3 = Math.sqrt(D2 * D2 + O2 * O2), m3 = Math.sqrt(A2 * A2 + k2 * k2), h3 = D2 || O2 ? $n(O2, D2) * Zn : 0, v3 = k2 || A2 ? $n(k2, A2) * Zn + h3 : 0, v3 && (m3 *= Math.abs(Math.cos(v3 * Qn))), r4.svg && (u3 -= x3 - (x3 * D2 + S3 * k2), d3 -= S3 - (x3 * O2 + S3 * A2))) : (ee2 = C3[6], z2 = C3[7], I2 = C3[8], L2 = C3[9], R2 = C3[10], B2 = C3[11], u3 = C3[12], d3 = C3[13], f3 = C3[14], w2 = $n(ee2, R2), g3 = w2 * Zn, w2 && (T2 = Math.cos(-w2), E2 = Math.sin(-w2), N2 = j2 * T2 + I2 * E2, P2 = M2 * T2 + L2 * E2, F2 = ee2 * T2 + R2 * E2, I2 = j2 * -E2 + I2 * T2, L2 = M2 * -E2 + L2 * T2, R2 = ee2 * -E2 + R2 * T2, B2 = z2 * -E2 + B2 * T2, j2 = N2, M2 = P2, ee2 = F2), w2 = $n(-k2, R2), _3 = w2 * Zn, w2 && (T2 = Math.cos(-w2), E2 = Math.sin(-w2), N2 = D2 * T2 - I2 * E2, P2 = O2 * T2 - L2 * E2, F2 = k2 * T2 - R2 * E2, B2 = A2 * E2 + B2 * T2, D2 = N2, O2 = P2, k2 = F2), w2 = $n(O2, D2), h3 = w2 * Zn, w2 && (T2 = Math.cos(w2), E2 = Math.sin(w2), N2 = D2 * T2 + O2 * E2, P2 = j2 * T2 + M2 * E2, O2 = O2 * T2 - D2 * E2, M2 = M2 * T2 - j2 * E2, D2 = N2, j2 = P2), g3 && Math.abs(g3) + Math.abs(h3) > 359.9 && (g3 = h3 = 0, _3 = 180 - _3), p3 = U(Math.sqrt(D2 * D2 + O2 * O2 + k2 * k2)), m3 = U(Math.sqrt(M2 * M2 + ee2 * ee2)), w2 = $n(j2, M2), v3 = Math.abs(w2) > 2e-4 ? w2 * Zn : 0, b3 = B2 ? 1 / (B2 < 0 ? -B2 : B2) : 0), r4.svg && (N2 = e16.getAttribute(`transform`), r4.forceCSS = e16.setAttribute(`transform`, ``) || !Gr(wr(e16, Q)), N2 && e16.setAttribute(`transform`, N2))), Math.abs(v3) > 90 && Math.abs(v3) < 270 && (a4 ? (p3 *= -1, v3 += h3 <= 0 ? 180 : -180, h3 += h3 <= 0 ? 180 : -180) : (m3 *= -1, v3 += v3 <= 0 ? 180 : -180)), t3 || (t3 = r4.uncache), r4.x = u3 - ((r4.xPercent = u3 && (!t3 && r4.xPercent || (Math.round(e16.offsetWidth / 2) === Math.round(-u3) ? -50 : 0))) ? e16.offsetWidth * r4.xPercent / 100 : 0) + o3, r4.y = d3 - ((r4.yPercent = d3 && (!t3 && r4.yPercent || (Math.round(e16.offsetHeight / 2) === Math.round(-d3) ? -50 : 0))) ? e16.offsetHeight * r4.yPercent / 100 : 0) + o3, r4.z = f3 + o3, r4.scaleX = U(p3), r4.scaleY = U(m3), r4.rotation = U(h3) + s3, r4.rotationX = U(g3) + s3, r4.rotationY = U(_3) + s3, r4.skewX = v3 + s3, r4.skewY = y3 + s3, r4.transformPerspective = b3 + o3, (r4.zOrigin = parseFloat(l3.split(` `)[2]) || !t3 && r4.zOrigin || 0) && (i3[$] = Xr(l3)), r4.xOffset = r4.yOffset = 0, r4.force3D = n.force3D, r4.renderTransform = r4.svg ? ri : Sr ? ni : Qr, r4.uncache = 0, r4;
  };
  var Xr = function(e16) {
    return (e16 = e16.split(` `))[0] + ` ` + e16[1];
  };
  var Zr = function(e16, t3, n4) {
    var r4 = G(t3);
    return U(parseFloat(t3) + parseFloat(Ir(e16, `x`, n4 + `px`, r4))) + r4;
  };
  var Qr = function(e16, t3) {
    t3.z = `0px`, t3.rotationY = t3.rotationX = `0deg`, t3.force3D = 0, ni(e16, t3);
  };
  var $r = `0deg`;
  var ei = `0px`;
  var ti = `) `;
  var ni = function(e16, t3) {
    var n4 = t3 || this, r4 = n4.xPercent, i3 = n4.yPercent, a4 = n4.x, o3 = n4.y, s3 = n4.z, c3 = n4.rotation, l3 = n4.rotationY, u3 = n4.rotationX, d3 = n4.skewX, f3 = n4.skewY, p3 = n4.scaleX, m3 = n4.scaleY, h3 = n4.transformPerspective, g3 = n4.force3D, _3 = n4.target, v3 = n4.zOrigin, y3 = ``, b3 = g3 === `auto` && e16 && e16 !== 1 || g3 === true;
    if (v3 && (u3 !== $r || l3 !== $r)) {
      var x3 = parseFloat(l3) * Qn, S3 = Math.sin(x3), C3 = Math.cos(x3), w2;
      x3 = parseFloat(u3) * Qn, w2 = Math.cos(x3), a4 = Zr(_3, a4, S3 * w2 * -v3), o3 = Zr(_3, o3, -Math.sin(x3) * -v3), s3 = Zr(_3, s3, C3 * w2 * -v3 + v3);
    }
    h3 !== ei && (y3 += `perspective(` + h3 + ti), (r4 || i3) && (y3 += `translate(` + r4 + `%, ` + i3 + `%) `), (b3 || a4 !== ei || o3 !== ei || s3 !== ei) && (y3 += s3 !== ei || b3 ? `translate3d(` + a4 + `, ` + o3 + `, ` + s3 + `) ` : `translate(` + a4 + `, ` + o3 + ti), c3 !== $r && (y3 += `rotate(` + c3 + ti), l3 !== $r && (y3 += `rotateY(` + l3 + ti), u3 !== $r && (y3 += `rotateX(` + u3 + ti), (d3 !== $r || f3 !== $r) && (y3 += `skew(` + d3 + `, ` + f3 + ti), (p3 !== 1 || m3 !== 1) && (y3 += `scale(` + p3 + `, ` + m3 + ti), _3.style[Q] = y3 || `translate(0, 0)`;
  };
  var ri = function(e16, t3) {
    var n4 = t3 || this, r4 = n4.xPercent, i3 = n4.yPercent, a4 = n4.x, o3 = n4.y, s3 = n4.rotation, c3 = n4.skewX, l3 = n4.skewY, u3 = n4.scaleX, d3 = n4.scaleY, f3 = n4.target, p3 = n4.xOrigin, m3 = n4.yOrigin, h3 = n4.xOffset, g3 = n4.yOffset, _3 = n4.forceCSS, v3 = parseFloat(a4), y3 = parseFloat(o3), b3, x3, S3, C3, w2;
    s3 = parseFloat(s3), c3 = parseFloat(c3), l3 = parseFloat(l3), l3 && (l3 = parseFloat(l3), c3 += l3, s3 += l3), s3 || c3 ? (s3 *= Qn, c3 *= Qn, b3 = Math.cos(s3) * u3, x3 = Math.sin(s3) * u3, S3 = Math.sin(s3 - c3) * -d3, C3 = Math.cos(s3 - c3) * d3, c3 && (l3 *= Qn, w2 = Math.tan(c3 - l3), w2 = Math.sqrt(1 + w2 * w2), S3 *= w2, C3 *= w2, l3 && (w2 = Math.tan(l3), w2 = Math.sqrt(1 + w2 * w2), b3 *= w2, x3 *= w2)), b3 = U(b3), x3 = U(x3), S3 = U(S3), C3 = U(C3)) : (b3 = u3, C3 = d3, x3 = S3 = 0), (v3 && !~(a4 + ``).indexOf(`px`) || y3 && !~(o3 + ``).indexOf(`px`)) && (v3 = Ir(f3, `x`, a4, `px`), y3 = Ir(f3, `y`, o3, `px`)), (p3 || m3 || h3 || g3) && (v3 = U(v3 + p3 - (p3 * b3 + m3 * S3) + h3), y3 = U(y3 + m3 - (p3 * x3 + m3 * C3) + g3)), (r4 || i3) && (w2 = f3.getBBox(), v3 = U(v3 + r4 / 100 * w2.width), y3 = U(y3 + i3 / 100 * w2.height)), w2 = `matrix(` + b3 + `,` + x3 + `,` + S3 + `,` + C3 + `,` + v3 + `,` + y3 + `)`, f3.setAttribute(`transform`, w2), _3 && (f3.style[Q] = w2);
  };
  var ii = function(e16, t3, n4, r4, i3) {
    var a4 = 360, o3 = h(i3), s3 = parseFloat(i3) * (o3 && ~i3.indexOf(`rad`) ? Zn : 1) - r4, c3 = r4 + s3 + `deg`, l3, u3;
    return o3 && (l3 = i3.split(`_`)[1], l3 === `short` && (s3 %= a4, s3 !== s3 % (a4 / 2) && (s3 += s3 < 0 ? a4 : -a4)), l3 === `cw` && s3 < 0 ? s3 = (s3 + a4 * er) % a4 - ~~(s3 / a4) * a4 : l3 === `ccw` && s3 > 0 && (s3 = (s3 - a4 * er) % a4 - ~~(s3 / a4) * a4)), e16._pt = u3 = new X(e16._pt, t3, n4, r4, s3, or), u3.e = c3, u3.u = `deg`, e16._props.push(n4), u3;
  };
  var ai = function(e16, t3) {
    for (var n4 in t3) e16[n4] = t3[n4];
    return e16;
  };
  var oi = function(e16, t3, n4) {
    var r4 = ai({}, n4._gsap), i3 = `perspective,force3D,transformOrigin,svgOrigin`, a4 = n4.style, o3, s3, c3, l3, u3, d3, f3, p3;
    for (s3 in r4.svg ? (c3 = n4.getAttribute(`transform`), n4.setAttribute(`transform`, ``), a4[Q] = t3, o3 = Yr(n4, 1), Mr(n4, Q), n4.setAttribute(`transform`, c3)) : (c3 = getComputedStyle(n4)[Q], a4[Q] = t3, o3 = Yr(n4, 1), a4[Q] = c3), Xn) c3 = r4[s3], l3 = o3[s3], c3 !== l3 && i3.indexOf(s3) < 0 && (f3 = G(c3), p3 = G(l3), u3 = f3 === p3 ? parseFloat(c3) : Ir(n4, s3, c3, p3), d3 = parseFloat(l3), e16._pt = new X(e16._pt, o3, s3, u3, d3 - u3, ar), e16._pt.u = p3 || 0, e16._props.push(s3));
    ai(o3, r4);
  };
  H(`padding,margin,Width,Radius`, function(e16, t3) {
    var n4 = `Top`, r4 = `Right`, i3 = `Bottom`, a4 = `Left`, o3 = (t3 < 3 ? [n4, r4, i3, a4] : [n4 + a4, n4 + r4, i3 + r4, i3 + a4]).map(function(n5) {
      return t3 < 2 ? e16 + n5 : `border` + n5 + e16;
    });
    Hr[t3 > 1 ? `border` + e16 : e16] = function(e17, t4, n5, r5, i4) {
      var a5, s3;
      if (arguments.length < 4) return a5 = o3.map(function(t5) {
        return Lr(e17, t5, n5);
      }), s3 = a5.join(` `), s3.split(a5[0]).length === 5 ? a5[0] : s3;
      a5 = (r5 + ``).split(` `), s3 = {}, o3.forEach(function(e18, t5) {
        return s3[e18] = a5[t5] = a5[t5] || a5[(t5 - 1) / 2 | 0];
      }), e17.init(t4, s3, i4);
    };
  });
  var si = { name: `css`, register: Dr, targetTest: function(e16) {
    return e16.style && e16.nodeType;
  }, init: function(e16, t3, r4, i3, a4) {
    var o3 = this._props, s3 = e16.style, c3 = r4.vars.startAt, l3, u3, d3, f3, p3, m3, g3, _3, v3, y3, b3, x3, S3, C3, w2, T2, E2;
    for (g3 in Gn || Dr(), this.styles = this.styles || xr(e16), T2 = this.styles.props, this.tween = r4, t3) if (g3 !== `autoRound` && (u3 = t3[g3], !(V[g3] && on(g3, t3, r4, i3, e16, a4)))) {
      if (p3 = typeof u3, m3 = Hr[g3], p3 === `function` && (u3 = u3.call(r4, i3, e16, a4), p3 = typeof u3), p3 === `string` && ~u3.indexOf(`random(`) && (u3 = Ct(u3)), m3) m3(this, e16, g3, u3, r4) && (w2 = 1);
      else if (g3.substr(0, 2) === `--`) l3 = (getComputedStyle(e16).getPropertyValue(g3) + ``).trim(), u3 += ``, Lt.lastIndex = 0, Lt.test(l3) || (_3 = G(l3), v3 = G(u3), v3 ? _3 !== v3 && (l3 = Ir(e16, g3, l3, v3) + v3) : _3 && (u3 += _3)), this.add(s3, `setProperty`, l3, u3, i3, a4, 0, 0, g3), o3.push(g3), T2.push(g3, 0, s3[g3]);
      else if (p3 !== `undefined`) {
        if (c3 && g3 in c3 ? (l3 = typeof c3[g3] == `function` ? c3[g3].call(r4, i3, e16, a4) : c3[g3], h(l3) && ~l3.indexOf(`random(`) && (l3 = Ct(l3)), G(l3 + ``) || l3 === `auto` || (l3 += n.units[g3] || G(Lr(e16, g3)) || ``), (l3 + ``).charAt(1) === `=` && (l3 = Lr(e16, g3))) : l3 = Lr(e16, g3), f3 = parseFloat(l3), y3 = p3 === `string` && u3.charAt(1) === `=` && u3.substr(0, 2), y3 && (u3 = u3.substr(2)), d3 = parseFloat(u3), g3 in ir && (g3 === `autoAlpha` && (f3 === 1 && Lr(e16, `visibility`) === `hidden` && d3 && (f3 = 0), T2.push(`visibility`, 0, s3.visibility), Nr(this, s3, `visibility`, f3 ? `inherit` : `hidden`, d3 ? `inherit` : `hidden`, !d3)), g3 !== `scale` && g3 !== `transform` && (g3 = ir[g3], ~g3.indexOf(`,`) && (g3 = g3.split(`,`)[0]))), b3 = g3 in Xn, b3) {
          if (this.styles.save(g3), E2 = u3, p3 === `string` && u3.substring(0, 6) === `var(--`) {
            if (u3 = wr(e16, u3.substring(4, u3.indexOf(`)`))), u3.substring(0, 5) === `calc(`) {
              var D2 = e16.style.perspective;
              e16.style.perspective = u3, u3 = wr(e16, `perspective`), D2 ? e16.style.perspective = D2 : Mr(e16, `perspective`);
            }
            d3 = parseFloat(u3);
          }
          if (x3 || (S3 = e16._gsap, S3.renderTransform && !t3.parseTransform || Yr(e16, t3.parseTransform), C3 = t3.smoothOrigin !== false && S3.smooth, x3 = this._pt = new X(this._pt, s3, Q, 0, 1, S3.renderTransform, S3, 0, -1), x3.dep = 1), g3 === `scale`) this._pt = new X(this._pt, S3, `scaleY`, S3.scaleY, (y3 ? ye(S3.scaleY, y3 + d3) : d3) - S3.scaleY || 0, ar), this._pt.u = 0, o3.push(`scaleY`, g3), g3 += `X`;
          else if (g3 === `transformOrigin`) {
            T2.push($, 0, s3[$]), u3 = Br(u3), S3.svg ? Jr(e16, u3, 0, C3, 0, this) : (v3 = parseFloat(u3.split(` `)[2]) || 0, v3 !== S3.zOrigin && Nr(this, S3, `zOrigin`, S3.zOrigin, v3), Nr(this, s3, g3, Xr(l3), Xr(u3)));
            continue;
          } else if (g3 === `svgOrigin`) {
            Jr(e16, u3, 1, C3, 0, this);
            continue;
          } else if (g3 in Wr) {
            ii(this, S3, g3, f3, y3 ? ye(f3, y3 + u3) : u3);
            continue;
          } else if (g3 === `smoothOrigin`) {
            Nr(this, S3, `smooth`, S3.smooth, u3);
            continue;
          } else if (g3 === `force3D`) {
            S3[g3] = u3;
            continue;
          } else if (g3 === `transform`) {
            oi(this, u3, e16);
            continue;
          }
        } else g3 in s3 || (g3 = Er(g3) || g3);
        if (b3 || (d3 || d3 === 0) && (f3 || f3 === 0) && !rr.test(u3) && g3 in s3) _3 = (l3 + ``).substr((f3 + ``).length), d3 || (d3 = 0), v3 = G(u3) || (g3 in n.units ? n.units[g3] : _3), _3 !== v3 && (f3 = Ir(e16, g3, l3, v3)), this._pt = new X(this._pt, b3 ? S3 : s3, g3, f3, (y3 ? ye(f3, y3 + d3) : d3) - f3, !b3 && (v3 === `px` || g3 === `zIndex`) && t3.autoRound !== false ? lr : ar), this._pt.u = v3 || 0, b3 && E2 !== u3 ? (this._pt.b = l3, this._pt.e = E2, this._pt.r = cr) : _3 !== v3 && v3 !== `%` && (this._pt.b = l3, this._pt.r = sr);
        else if (g3 in s3) Rr.call(this, e16, g3, l3, y3 ? y3 + u3 : u3);
        else if (g3 in e16) this.add(e16, g3, l3 || e16[g3], y3 ? y3 + u3 : u3, i3, a4);
        else if (g3 !== `parseTransform`) {
          te(g3, u3);
          continue;
        }
        b3 || (g3 in s3 ? T2.push(g3, 0, s3[g3]) : typeof e16[g3] == `function` ? T2.push(g3, 2, e16[g3]()) : T2.push(g3, 1, l3 || e16[g3])), o3.push(g3);
      }
    }
    w2 && On(this);
  }, render: function(e16, t3) {
    if (t3.tween._time || !Jn()) for (var n4 = t3._pt; n4; ) n4.r(e16, n4.d), n4 = n4._next;
    else t3.styles.revert();
  }, get: Lr, aliases: ir, getSetter: function(e16, t3, n4) {
    var r4 = ir[t3];
    return r4 && r4.indexOf(`,`) < 0 && (t3 = r4), t3 in Xn && t3 !== $ && (e16._gsap.x || Lr(e16, `x`)) ? n4 && qn === n4 ? t3 === `scale` ? hr : mr : (qn = n4 || {}) && (t3 === `scale` ? gr : _r) : e16.style && !v(e16.style[t3]) ? fr : ~t3.indexOf(`-`) ? pr : bn(e16, t3);
  }, core: { _removeProperty: Mr, _getMatrix: qr } };
  Z.utils.checkPrefix = Er, Z.core.getStyleSaver = xr, (function(e16, t3, r4, i3) {
    var a4 = H(e16 + `,` + t3 + `,` + r4, function(e17) {
      Xn[e17] = 1;
    });
    H(t3, function(e17) {
      n.units[e17] = `deg`, Wr[e17] = 1;
    }), ir[a4[13]] = e16 + `,` + t3, H(i3, function(e17) {
      var t4 = e17.split(`:`);
      ir[t4[1]] = a4[t4[0]];
    });
  })(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`, `rotation,rotationX,rotationY,skewX,skewY`, `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`, `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`), H(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`, function(e16) {
    n.units[e16] = `px`;
  }), Z.registerPlugin(si);
  var ci = Z.registerPlugin(si) || Z;
  ci.core.Tween;

  // public/shopify/plantilla99/assets/js/SplitText.Bj_bHxnY.js
  var e15;
  var t2;
  var n2 = typeof Symbol == `function` ? /* @__PURE__ */ Symbol() : `_split`;
  var r2;
  var i2 = () => r2 || C2.register(window.gsap);
  var a2 = typeof Intl < `u` && `Segmenter` in Intl ? new Intl.Segmenter() : 0;
  var o2 = (e16) => e16 ? typeof e16 == `string` ? o2(document.querySelectorAll(e16)) : `length` in e16 ? Array.from(e16).reduce((e17, t3) => (typeof t3 == `string` ? e17.push(...o2(t3)) : e17.push(t3), e17), []) : [e16] : [];
  var s2 = (e16) => o2(e16).filter((e17) => e17 && e17.nodeType === 1);
  var c2 = [];
  var l2 = function() {
  };
  var u2 = { add: (e16) => e16() };
  var d2 = /\s+/g;
  var f2 = RegExp(`\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.`, `gu`);
  var p2 = { left: 0, top: 0, width: 0, height: 0 };
  var m2 = (e16, t3) => {
    for (; ++t3 < e16.length && e16[t3] === p2; ) ;
    return e16[t3] || p2;
  };
  var h2 = ({ element: e16, html: t3, ariaL: n4, ariaH: r4 }) => {
    e16.innerHTML = t3, n4 ? e16.setAttribute(`aria-label`, n4) : e16.removeAttribute(`aria-label`), r4 ? e16.setAttribute(`aria-hidden`, r4) : e16.removeAttribute(`aria-hidden`);
  };
  var g2 = (e16, t3) => {
    if (t3) {
      let n4 = new Set(e16.join(``).match(t3) || c2), r4 = e16.length, i3, a4, o3, s3;
      if (n4.size) for (; --r4 > -1; ) {
        a4 = e16[r4];
        for (o3 of n4) if (o3.startsWith(a4) && o3.length > a4.length) {
          for (i3 = 0, s3 = a4; o3.startsWith(s3 += e16[r4 + ++i3]) && s3.length < o3.length; ) ;
          if (i3 && s3.length === o3.length) {
            e16[r4] = o3, e16.splice(r4 + 1, i3);
            break;
          }
        }
      }
    }
    return e16;
  };
  var _2 = (e16) => window.getComputedStyle(e16).display === `inline` && (e16.style.display = `inline-block`);
  var v2 = (e16, t3, n4) => t3.insertBefore(typeof e16 == `string` ? document.createTextNode(e16) : e16, n4);
  var y2 = (e16, t3, n4) => {
    let r4 = t3[e16 + `sClass`] || ``, { tag: i3 = `div`, aria: a4 = `auto`, propIndex: o3 = false } = t3, s3 = e16 === `line` ? `block` : `inline-block`, c3 = r4.indexOf(`++`) > -1, l3 = (t4) => {
      let l4 = document.createElement(i3), u3 = n4.length + 1;
      return r4 && (l4.className = r4 + (c3 ? ` ` + r4 + u3 : ``)), o3 && l4.style.setProperty(`--` + e16, u3 + ``), a4 !== `none` && l4.setAttribute(`aria-hidden`, `true`), i3 !== `span` && (l4.style.position = `relative`, l4.style.display = s3), l4.textContent = t4, n4.push(l4), l4;
    };
    return c3 && (r4 = r4.replace(`++`, ``)), l3.collection = n4, l3;
  };
  var b2 = (e16, t3, n4, r4) => {
    let i3 = y2(`line`, n4, r4), a4 = window.getComputedStyle(e16).textAlign || `left`;
    return (n5, r5) => {
      let o3 = i3(``);
      for (o3.style.textAlign = a4, e16.insertBefore(o3, t3[n5]); n5 < r5; n5++) o3.appendChild(t3[n5]);
      o3.normalize();
    };
  };
  var x2 = (e16, t3, n4, r4, i3, o3, s3, l3, u3, f3) => {
    var p3;
    let m3 = Array.from(e16.childNodes), h3 = 0, { wordDelimiter: y3, reduceWhiteSpace: b3 = true, prepareText: S3 } = t3, C3 = e16.getBoundingClientRect(), w2 = C3, T2 = !b3 && window.getComputedStyle(e16).whiteSpace.substring(0, 3) === `pre`, E2 = 0, D2 = n4.collection, O2, k2, A2, j2, M2, N2, P2, F2, I2, L2, R2, z2, B2, V2, H2, U2, W2, G2;
    for (typeof y3 == `object` ? (A2 = y3.delimiter || y3, k2 = y3.replaceWith || ``) : k2 = y3 === `` ? `` : y3 || ` `, O2 = k2 !== ` `; h3 < m3.length; h3++) if (j2 = m3[h3], j2.nodeType === 3) {
      for (H2 = j2.textContent || ``, b3 ? H2 = H2.replace(d2, ` `) : T2 && (H2 = H2.replace(/\n/g, k2 + `
`)), S3 && (H2 = S3(H2, e16)), j2.textContent = H2, M2 = k2 || A2 ? H2.split(A2 || k2) : H2.match(l3) || c2, W2 = M2[M2.length - 1], F2 = O2 ? W2.slice(-1) === ` ` : !W2, W2 || M2.pop(), w2 = C3, P2 = O2 ? M2[0].charAt(0) === ` ` : !M2[0], P2 && v2(` `, e16, j2), M2[0] || M2.shift(), g2(M2, u3), o3 && f3 || (j2.textContent = ``), I2 = 1; I2 <= M2.length; I2++) if (U2 = M2[I2 - 1], !b3 && T2 && U2.charAt(0) === `
` && ((p3 = j2.previousSibling) == null || p3.remove(), v2(document.createElement(`br`), e16, j2), U2 = U2.slice(1)), !b3 && U2 === ``) v2(k2, e16, j2);
      else if (U2 === ` `) e16.insertBefore(document.createTextNode(` `), j2);
      else {
        if (O2 && U2.charAt(0) === ` ` && v2(` `, e16, j2), E2 && I2 === 1 && !P2 && D2.indexOf(E2.parentNode) > -1 ? (N2 = D2[D2.length - 1], N2.appendChild(document.createTextNode(r4 ? `` : U2))) : (N2 = n4(r4 ? `` : U2), v2(N2, e16, j2), E2 && I2 === 1 && !P2 && N2.insertBefore(E2, N2.firstChild)), r4) for (R2 = a2 ? g2([...a2.segment(U2)].map((e17) => e17.segment), u3) : U2.match(l3) || c2, G2 = 0; G2 < R2.length; G2++) N2.appendChild(R2[G2] === ` ` ? document.createTextNode(` `) : r4(R2[G2]));
        if (o3 && f3) {
          if (H2 = j2.textContent = H2.substring(U2.length + 1, H2.length), L2 = N2.getBoundingClientRect(), L2.top > w2.top && L2.left <= w2.left) {
            for (z2 = e16.cloneNode(), B2 = e16.childNodes[0]; B2 && B2 !== N2; ) V2 = B2, B2 = B2.nextSibling, z2.appendChild(V2);
            e16.parentNode.insertBefore(z2, e16), i3 && _2(z2);
          }
          w2 = L2;
        }
        (I2 < M2.length || F2) && v2(I2 >= M2.length ? ` ` : O2 && U2.slice(-1) === ` ` ? ` ` + k2 : k2, e16, j2);
      }
      e16.removeChild(j2), E2 = 0;
    } else j2.nodeType === 1 && (s3 && s3.indexOf(j2) > -1 ? (D2.indexOf(j2.previousSibling) > -1 && D2[D2.length - 1].appendChild(j2), E2 = j2) : (x2(j2, t3, n4, r4, i3, o3, s3, l3, u3, true), E2 = 0), i3 && _2(j2));
  };
  var S2 = class a3 {
    constructor(e16, t3) {
      this.isSplit = false, i2(), this.elements = s2(e16), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = t3, this.elements.forEach((e17) => {
        var r5;
        t3.overwrite !== false && ((r5 = e17[n2]) == null || r5._data.orig.filter(({ element: t4 }) => t4 === e17).forEach(h2)), e17[n2] = this;
      }), this._split = () => this.isSplit && this.split(this.vars);
      let r4 = [], a4, o3 = () => {
        let e17 = r4.length, t4;
        for (; e17--; ) {
          t4 = r4[e17];
          let n4 = t4.element.offsetWidth;
          if (n4 !== t4.width) {
            t4.width = n4, this._split();
            return;
          }
        }
      };
      this._data = { orig: r4, obs: typeof ResizeObserver < `u` && new ResizeObserver(() => {
        clearTimeout(a4), a4 = setTimeout(o3, 200);
      }) }, l2(this), this.split(t3);
    }
    split(e16) {
      return (this._ctx || u2).add(() => {
        this.isSplit && this.revert(), this.vars = e16 = e16 || this.vars || {};
        let { type: n4 = `chars,words,lines`, aria: r4 = `auto`, deepSlice: i3 = true, smartWrap: a4, onSplit: c3, autoSplit: l3 = false, specialChars: u3, mask: d3 } = this.vars, h3 = n4.indexOf(`lines`) > -1, g3 = n4.indexOf(`chars`) > -1, _3 = n4.indexOf(`words`) > -1, v3 = g3 && !_3 && !h3, S3 = u3 && (`push` in u3 ? RegExp(`(?:` + u3.join(`|`) + `)`, `gu`) : u3), C3 = S3 ? RegExp(S3.source + `|` + f2.source, `gu`) : f2, w2 = !!e16.ignore && s2(e16.ignore), { orig: T2, animTime: E2, obs: D2 } = this._data, O2;
        (g3 || _3 || h3) && (this.elements.forEach((t3, n5) => {
          T2[n5] = { element: t3, html: t3.innerHTML, ariaL: t3.getAttribute(`aria-label`), ariaH: t3.getAttribute(`aria-hidden`) }, r4 === `auto` ? t3.setAttribute(`aria-label`, (t3.textContent || ``).trim()) : r4 === `hidden` && t3.setAttribute(`aria-hidden`, `true`);
          let s3 = [], c4 = [], l4 = [], u4 = g3 ? y2(`char`, e16, s3) : null, d4 = y2(`word`, e16, c4), f3, E3, D3, O3;
          if (x2(t3, e16, d4, u4, v3, i3 && (h3 || v3), w2, C3, S3, false), h3) {
            let n6 = o2(t3.childNodes), r5 = b2(t3, n6, e16, l4), i4, a5 = [], s4 = 0, c5 = n6.map((e17) => e17.nodeType === 1 ? e17.getBoundingClientRect() : p2), u5 = p2, d5;
            for (f3 = 0; f3 < n6.length; f3++) i4 = n6[f3], i4.nodeType === 1 && (i4.nodeName === `BR` ? ((!f3 || n6[f3 - 1].nodeName !== `BR`) && (a5.push(i4), r5(s4, f3 + 1)), s4 = f3 + 1, u5 = m2(c5, f3)) : (d5 = c5[f3], f3 && d5.top > u5.top && d5.left < u5.left + u5.width - 1 && (r5(s4, f3), s4 = f3), u5 = d5));
            s4 < f3 && r5(s4, f3), a5.forEach((e17) => e17.parentNode?.removeChild(e17));
          }
          if (!_3) {
            for (f3 = 0; f3 < c4.length; f3++) if (E3 = c4[f3], g3 || !E3.nextSibling || E3.nextSibling.nodeType !== 3) if (a4 && !h3) {
              for (D3 = document.createElement(`span`), D3.style.whiteSpace = `nowrap`; E3.firstChild; ) D3.appendChild(E3.firstChild);
              E3.replaceWith(D3);
            } else E3.replaceWith(...E3.childNodes);
            else O3 = E3.nextSibling, O3 && O3.nodeType === 3 && (O3.textContent = (E3.textContent || ``) + (O3.textContent || ``), E3.remove());
            c4.length = 0, t3.normalize();
          }
          this.lines.push(...l4), this.words.push(...c4), this.chars.push(...s3);
        }), d3 && this[d3] && this.masks.push(...this[d3].map((e17) => {
          let t3 = e17.cloneNode();
          return e17.replaceWith(t3), t3.appendChild(e17), e17.className && (t3.className = e17.className.trim().split(` `).map((e18) => e18 + `-mask`).join(` `)), t3.style.overflow = `clip`, t3;
        }))), this.isSplit = true, t2 && h3 && l3 && t2.addEventListener(`loadingdone`, this._split), (O2 = c3 && c3(this)) && O2.totalTime && (this._data.anim = E2 ? O2.totalTime(E2) : O2), h3 && l3 && this.elements.forEach((e17, t3) => {
          T2[t3].width = e17.offsetWidth, D2 && D2.observe(e17);
        });
      }), this;
    }
    kill() {
      let { obs: e16 } = this._data;
      e16 && e16.disconnect(), t2?.removeEventListener(`loadingdone`, this._split);
    }
    revert() {
      var e16, t3;
      if (this.isSplit) {
        let { orig: n4, anim: r4 } = this._data;
        this.kill(), n4.forEach(h2), this.chars.length = this.words.length = this.lines.length = n4.length = this.masks.length = 0, this.isSplit = false, r4 && (this._data.animTime = r4.totalTime(), r4.revert()), (t3 = (e16 = this.vars).onRevert) == null || t3.call(e16, this);
      }
      return this;
    }
    static create(e16, t3) {
      return new a3(e16, t3);
    }
    static register(n4) {
      e15 = e15 || n4 || window.gsap, e15 && (o2 = e15.utils.toArray, l2 = e15.core.context || l2), !r2 && window.innerWidth > 0 && (t2 = document.fonts, r2 = true);
    }
  };
  S2.version = `3.15.0`;
  var C2 = S2;

  // public/shopify/plantilla99/assets/js/TypedHeader.astro_astro_type_script_index_0_lang.gO3r8hlV.js
  ci.registerPlugin(C2);
  var n3 = class {
    constructor(n4) {
      __publicField(this, "element");
      __publicField(this, "cursorContainer");
      __publicField(this, "typedContent");
      __publicField(this, "splitContent");
      __publicField(this, "cursorPersists");
      __publicField(this, "doneTyping", false);
      __publicField(this, "activeTimeline", null);
      this.element = n4, this.cursorContainer = n4.querySelector(`[data-cursor-container]`), this.typedContent = n4.querySelector(`.typed-content`), this.cursorPersists = n4.getAttribute(`data-cursor-persists`) === `true`, this.splitContent = C2.create(this.typedContent, { type: `chars, words` }), ci.set(this.cursorContainer, { opacity: 0 }), ci.set(this.splitContent.chars, { opacity: 0 });
      let r4 = this.splitContent.chars[0];
      if (r4) {
        let e16 = r4.offsetParent;
        this.updateBlinkingCursor(e16 ? e16.offsetLeft + r4.offsetLeft : r4.offsetLeft, e16 ? e16.offsetTop + r4.offsetTop : r4.offsetTop);
      }
      window.addEventListener(`resize`, () => this.onResize());
    }
    stopAnimation() {
      this.activeTimeline && (this.activeTimeline = (this.activeTimeline.kill(), null)), this.cursorContainer && ci.killTweensOf(this.cursorContainer), this.splitContent?.chars && ci.killTweensOf(this.splitContent.chars);
    }
    initialize() {
      if (this.stopAnimation(), this.cursorContainer && ci.set(this.cursorContainer, { opacity: 0 }), this.splitContent?.chars) {
        ci.set(this.splitContent.chars, { opacity: 0 });
        let t3 = this.splitContent.chars[0];
        t3 && t3.offsetParent && this.updateBlinkingCursor(t3.offsetParent.offsetLeft + t3.offsetLeft, t3.offsetParent.offsetTop + t3.offsetTop);
      }
      this.doneTyping = false;
    }
    reset() {
      this.initialize();
    }
    hideAndReset() {
      this.stopAnimation(), this.cursorContainer && ci.to(this.cursorContainer, { opacity: 0, duration: 0.01 }), this.splitContent?.chars ? ci.to(this.splitContent.chars, { opacity: 0, duration: 0.01, stagger: -0.05, onComplete: () => {
        this.reset();
      } }) : this.reset();
    }
    updateBlinkingCursor(e16, t3) {
      this.cursorContainer.style.setProperty(`--cursor-pos-x`, `${e16}px`), this.cursorContainer.style.setProperty(`--cursor-pos-y`, `${t3}px`);
    }
    onResize() {
      if (this.doneTyping && this.cursorPersists) {
        let e16 = this.splitContent?.chars.length || 1, t3 = this.splitContent?.chars[e16 - 1];
        t3 && t3.offsetParent && this.updateBlinkingCursor(t3.offsetParent.offsetLeft + t3.offsetLeft + t3.offsetWidth + 10, t3.offsetParent.offsetTop + t3.offsetTop);
      }
    }
    startTyping(t3, n4 = 0, r4 = 0.05) {
      this.stopAnimation();
      let i3 = t3 || ci.timeline();
      this.activeTimeline = i3;
      let a4 = this;
      return i3.set(this.cursorContainer, { opacity: 1 }), i3.fromTo(this.splitContent.chars, { opacity: 0 }, { opacity: 1, duration: 0.01, delay: n4, stagger: { each: r4, onStart: function() {
        let e16 = this.targets()[0];
        e16 && e16.offsetParent && a4.updateBlinkingCursor(e16.offsetParent.offsetLeft + e16.offsetLeft + e16.offsetWidth + 10, e16.offsetParent.offsetTop + e16.offsetTop);
      } }, ease: `power2.out`, onComplete: () => {
        a4.doneTyping = true, a4.activeTimeline = null;
      } }), this.cursorPersists || i3.to(this.cursorContainer, { opacity: 0, duration: 0.5, ease: `none` }), i3;
    }
  };
  window.TypedHeaderHelper = n3;
  var r3 = () => {
    document.querySelectorAll(`[data-typed-header]`).forEach((t3) => {
      let r4 = t3;
      if (!r4.helper) {
        let t4 = new n3(r4);
        r4.helper = t4, t4.startTyping(ci.timeline(), 0.2);
      }
    });
  };
  document.readyState === `loading` ? document.addEventListener(`DOMContentLoaded`, r3) : r3();
})();
