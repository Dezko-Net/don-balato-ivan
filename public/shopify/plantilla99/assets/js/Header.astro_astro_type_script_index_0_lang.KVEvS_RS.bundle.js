"use strict";
(() => {
  // public/shopify/plantilla99/assets/js/gsap.Bi_c5vh2.js
  function e(e15) {
    if (e15 === void 0) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return e15;
  }
  function t(e15, t3) {
    e15.prototype = Object.create(t3.prototype), e15.prototype.constructor = e15, e15.__proto__ = t3;
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
  var h = function(e15) {
    return typeof e15 == `string`;
  };
  var g = function(e15) {
    return typeof e15 == `function`;
  };
  var _ = function(e15) {
    return typeof e15 == `number`;
  };
  var v = function(e15) {
    return e15 === void 0;
  };
  var y = function(e15) {
    return typeof e15 == `object`;
  };
  var b = function(e15) {
    return e15 !== false;
  };
  var x = function() {
    return typeof window < `u`;
  };
  var S = function(e15) {
    return g(e15) || h(e15);
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
  var ee = function(e15) {
    return (z = Oe(e15, R)) && Z;
  };
  var te = function(e15, t3) {
    return console.warn(`Invalid property`, e15, `set to`, t3, `Missing plugin? gsap.registerPlugin()`);
  };
  var ne = function(e15, t3) {
    return !t3 && console.warn(e15);
  };
  var re = function(e15, t3) {
    return e15 && (R[e15] = t3) && z && (z[e15] = t3) || R;
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
  var ge = function(e15) {
    var t3 = e15[0], n2, r2;
    if (y(t3) || g(t3) || (e15 = [e15]), !(n2 = (t3._gsap || {}).harness)) {
      for (r2 = me.length; r2-- && !me[r2].targetTest(t3); ) ;
      n2 = me[r2];
    }
    for (r2 = e15.length; r2--; ) e15[r2] && (e15[r2]._gsap || (e15[r2]._gsap = new en(e15[r2], n2))) || e15.splice(r2, 1);
    return e15;
  };
  var _e = function(e15) {
    return e15._gsap || ge(ut(e15))[0]._gsap;
  };
  var ve = function(e15, t3, n2) {
    return (n2 = e15[t3]) && g(n2) ? e15[t3]() : v(n2) && e15.getAttribute && e15.getAttribute(t3) || n2;
  };
  var H = function(e15, t3) {
    return (e15 = e15.split(`,`)).forEach(t3) || e15;
  };
  var U = function(e15) {
    return Math.round(e15 * 1e5) / 1e5 || 0;
  };
  var W = function(e15) {
    return Math.round(e15 * 1e7) / 1e7 || 0;
  };
  var ye = function(e15, t3) {
    var n2 = t3.charAt(0), r2 = parseFloat(t3.substr(2));
    return e15 = parseFloat(e15), n2 === `+` ? e15 + r2 : n2 === `-` ? e15 - r2 : n2 === `*` ? e15 * r2 : e15 / r2;
  };
  var be = function(e15, t3) {
    for (var n2 = t3.length, r2 = 0; e15.indexOf(t3[r2]) < 0 && ++r2 < n2; ) ;
    return r2 < n2;
  };
  var xe = function() {
    var e15 = le.length, t3 = le.slice(0), n2, r2;
    for (ue = {}, le.length = 0, n2 = 0; n2 < e15; n2++) r2 = t3[n2], r2 && r2._lazy && (r2.render(r2._lazy[0], r2._lazy[1], true)._lazy = 0);
  };
  var Se = function(e15) {
    return !!(e15._initted || e15._startAt || e15.add);
  };
  var Ce = function(e15, t3, n2, r2) {
    le.length && !a && xe(), e15.render(t3, n2, r2 || !!(a && t3 < 0 && Se(e15))), le.length && !a && xe();
  };
  var we = function(e15) {
    var t3 = parseFloat(e15);
    return (t3 || t3 === 0) && (e15 + ``).match(M).length < 2 ? t3 : h(e15) ? e15.trim() : e15;
  };
  var Te = function(e15) {
    return e15;
  };
  var Ee = function(e15, t3) {
    for (var n2 in t3) n2 in e15 || (e15[n2] = t3[n2]);
    return e15;
  };
  var De = function(e15) {
    return function(t3, n2) {
      for (var r2 in n2) r2 in t3 || r2 === `duration` && e15 || r2 === `ease` || (t3[r2] = n2[r2]);
    };
  };
  var Oe = function(e15, t3) {
    for (var n2 in t3) e15[n2] = t3[n2];
    return e15;
  };
  var ke = function e2(t3, n2) {
    for (var r2 in n2) r2 !== `__proto__` && r2 !== `constructor` && r2 !== `prototype` && (t3[r2] = y(n2[r2]) ? e2(t3[r2] || (t3[r2] = {}), n2[r2]) : n2[r2]);
    return t3;
  };
  var Ae = function(e15, t3) {
    var n2 = {}, r2;
    for (r2 in e15) r2 in t3 || (n2[r2] = e15[r2]);
    return n2;
  };
  var je = function(e15) {
    var t3 = e15.parent || P, n2 = e15.keyframes ? De(w(e15.keyframes)) : Ee;
    if (b(e15.inherit)) for (; t3; ) n2(e15, t3.vars.defaults), t3 = t3.parent || t3._dp;
    return e15;
  };
  var Me = function(e15, t3) {
    for (var n2 = e15.length, r2 = n2 === t3.length; r2 && n2-- && e15[n2] === t3[n2]; ) ;
    return n2 < 0;
  };
  var Ne = function(e15, t3, n2, r2, i2) {
    n2 === void 0 && (n2 = `_first`), r2 === void 0 && (r2 = `_last`);
    var a2 = e15[r2], o2;
    if (i2) for (o2 = t3[i2]; a2 && a2[i2] > o2; ) a2 = a2._prev;
    return a2 ? (t3._next = a2._next, a2._next = t3) : (t3._next = e15[n2], e15[n2] = t3), t3._next ? t3._next._prev = t3 : e15[r2] = t3, t3._prev = a2, t3.parent = t3._dp = e15, t3;
  };
  var Pe = function(e15, t3, n2, r2) {
    n2 === void 0 && (n2 = `_first`), r2 === void 0 && (r2 = `_last`);
    var i2 = t3._prev, a2 = t3._next;
    i2 ? i2._next = a2 : e15[n2] === t3 && (e15[n2] = a2), a2 ? a2._prev = i2 : e15[r2] === t3 && (e15[r2] = i2), t3._next = t3._prev = t3.parent = null;
  };
  var Fe = function(e15, t3) {
    e15.parent && (!t3 || e15.parent.autoRemoveChildren) && e15.parent.remove && e15.parent.remove(e15), e15._act = 0;
  };
  var Ie = function(e15, t3) {
    if (e15 && (!t3 || t3._end > e15._dur || t3._start < 0)) for (var n2 = e15; n2; ) n2._dirty = 1, n2 = n2.parent;
    return e15;
  };
  var Le = function(e15) {
    for (var t3 = e15.parent; t3 && t3.parent; ) t3._dirty = 1, t3.totalDuration(), t3 = t3.parent;
    return e15;
  };
  var Re = function(e15, t3, n2, r2) {
    return e15._startAt && (a ? e15._startAt.revert(oe) : e15.vars.immediateRender && !e15.vars.autoRevert || e15._startAt.render(t3, true, r2));
  };
  var ze = function e3(t3) {
    return !t3 || t3._ts && e3(t3.parent);
  };
  var Be = function(e15) {
    return e15._repeat ? Ve(e15._tTime, e15 = e15.duration() + e15._rDelay) * e15 : 0;
  };
  var Ve = function(e15, t3) {
    var n2 = Math.floor(e15 = W(e15 / t3));
    return e15 && n2 === e15 ? n2 - 1 : n2;
  };
  var He = function(e15, t3) {
    return (e15 - t3._start) * t3._ts + (t3._ts >= 0 ? 0 : t3._dirty ? t3.totalDuration() : t3._tDur);
  };
  var Ue = function(e15) {
    return e15._end = W(e15._start + (e15._tDur / Math.abs(e15._ts || e15._rts || c) || 0));
  };
  var We = function(e15, t3) {
    var n2 = e15._dp;
    return n2 && n2.smoothChildTiming && e15._ts && (e15._start = W(n2._time - (e15._ts > 0 ? t3 / e15._ts : ((e15._dirty ? e15.totalDuration() : e15._tDur) - t3) / -e15._ts)), Ue(e15), n2._dirty || Ie(n2, e15)), e15;
  };
  var Ge = function(e15, t3) {
    var n2;
    if ((t3._time || !t3._dur && t3._initted || t3._start < e15._time && (t3._dur || !t3.add)) && (n2 = He(e15.rawTime(), t3), (!t3._dur || at(0, t3.totalDuration(), n2) - t3._tTime > c) && t3.render(n2, true)), Ie(e15, t3)._dp && e15._initted && e15._time >= e15._dur && e15._ts) {
      if (e15._dur < e15.duration()) for (n2 = e15; n2._dp; ) n2.rawTime() >= 0 && n2.totalTime(n2._tTime), n2 = n2._dp;
      e15._zTime = -c;
    }
  };
  var Ke = function(e15, t3, n2, r2) {
    return t3.parent && Fe(t3), t3._start = W((_(n2) ? n2 : n2 || e15 !== P ? nt(e15, n2, t3) : e15._time) + t3._delay), t3._end = W(t3._start + (t3.totalDuration() / Math.abs(t3.timeScale()) || 0)), Ne(e15, t3, `_first`, `_last`, e15._sort ? `_start` : 0), Xe(t3) || (e15._recent = t3), r2 || Ge(e15, t3), e15._ts < 0 && We(e15, e15._tTime), e15;
  };
  var qe = function(e15, t3) {
    return (R.ScrollTrigger || te(`scrollTrigger`, t3)) && R.ScrollTrigger.create(t3, e15);
  };
  var Je = function(e15, t3, n2, r2, i2) {
    if (ln(e15, t3, i2), !e15._initted) return 1;
    if (!n2 && e15._pt && !a && (e15._dur && e15.vars.lazy !== false || !e15._dur && e15.vars.lazy) && de !== Vt.frame) return le.push(e15), e15._lazy = [i2, r2], 1;
  };
  var Ye = function e4(t3) {
    var n2 = t3.parent;
    return n2 && n2._ts && n2._initted && !n2._lock && (n2.rawTime() < 0 || e4(n2));
  };
  var Xe = function(e15) {
    var t3 = e15.data;
    return t3 === `isFromStart` || t3 === `isStart`;
  };
  var Ze = function(e15, t3, n2, r2) {
    var i2 = e15.ratio, o2 = t3 < 0 || !t3 && (!e15._start && Ye(e15) && !(!e15._initted && Xe(e15)) || (e15._ts < 0 || e15._dp._ts < 0) && !Xe(e15)) ? 0 : 1, s2 = e15._rDelay, l2 = 0, u2, d2, f2;
    if (s2 && e15._repeat && (l2 = at(0, e15._tDur, t3), d2 = Ve(l2, s2), e15._yoyo && d2 & 1 && (o2 = 1 - o2), d2 !== Ve(e15._tTime, s2) && (i2 = 1 - o2, e15.vars.repeatRefresh && e15._initted && e15.invalidate())), o2 !== i2 || a || r2 || e15._zTime === c || !t3 && e15._zTime) {
      if (!e15._initted && Je(e15, t3, r2, n2, l2)) return;
      for (f2 = e15._zTime, e15._zTime = t3 || (n2 ? c : 0), n2 || (n2 = t3 && !f2), e15.ratio = o2, e15._from && (o2 = 1 - o2), e15._time = 0, e15._tTime = l2, u2 = e15._pt; u2; ) u2.r(o2, u2.d), u2 = u2._next;
      t3 < 0 && Re(e15, t3, n2, true), e15._onUpdate && !n2 && Dt(e15, `onUpdate`), l2 && e15._repeat && !n2 && e15.parent && Dt(e15, `onRepeat`), (t3 >= e15._tDur || t3 < 0) && e15.ratio === o2 && (o2 && Fe(e15, 1), !n2 && !a && (Dt(e15, o2 ? `onComplete` : `onReverseComplete`, true), e15._prom && e15._prom()));
    } else e15._zTime || (e15._zTime = t3);
  };
  var Qe = function(e15, t3, n2) {
    var r2;
    if (n2 > t3) for (r2 = e15._first; r2 && r2._start <= n2; ) {
      if (r2.data === `isPause` && r2._start > t3) return r2;
      r2 = r2._next;
    }
    else for (r2 = e15._last; r2 && r2._start >= n2; ) {
      if (r2.data === `isPause` && r2._start < t3) return r2;
      r2 = r2._prev;
    }
  };
  var $e = function(e15, t3, n2, r2) {
    var i2 = e15._repeat, a2 = W(t3) || 0, o2 = e15._tTime / e15._tDur;
    return o2 && !r2 && (e15._time *= a2 / e15._dur), e15._dur = a2, e15._tDur = i2 ? i2 < 0 ? 1e10 : W(a2 * (i2 + 1) + e15._rDelay * i2) : a2, o2 > 0 && !r2 && We(e15, e15._tTime = e15._tDur * o2), e15.parent && Ue(e15), n2 || Ie(e15.parent, e15), e15;
  };
  var et = function(e15) {
    return e15 instanceof J ? Ie(e15) : $e(e15, e15._dur);
  };
  var tt = { _start: 0, endTime: ie, totalDuration: ie };
  var nt = function e5(t3, n2, r2) {
    var i2 = t3.labels, a2 = t3._recent || tt, o2 = t3.duration() >= s ? a2.endTime(false) : t3._dur, c2, l2, u2;
    return h(n2) && (isNaN(n2) || n2 in i2) ? (l2 = n2.charAt(0), u2 = n2.substr(-1) === `%`, c2 = n2.indexOf(`=`), l2 === `<` || l2 === `>` ? (c2 >= 0 && (n2 = n2.replace(/=/, ``)), (l2 === `<` ? a2._start : a2.endTime(a2._repeat >= 0)) + (parseFloat(n2.substr(1)) || 0) * (u2 ? (c2 < 0 ? a2 : r2).totalDuration() / 100 : 1)) : c2 < 0 ? (n2 in i2 || (i2[n2] = o2), i2[n2]) : (l2 = parseFloat(n2.charAt(c2 - 1) + n2.substr(c2 + 1)), u2 && r2 && (l2 = l2 / 100 * (w(r2) ? r2[0] : r2).totalDuration()), c2 > 1 ? e5(t3, n2.substr(0, c2 - 1), r2) + l2 : o2 + l2)) : n2 == null ? o2 : +n2;
  };
  var rt = function(e15, t3, n2) {
    var r2 = _(t3[1]), i2 = (r2 ? 2 : 1) + (e15 < 2 ? 0 : 1), a2 = t3[i2], o2, s2;
    if (r2 && (a2.duration = t3[1]), a2.parent = n2, e15) {
      for (o2 = a2, s2 = n2; s2 && !(`immediateRender` in o2); ) o2 = s2.vars.defaults || {}, s2 = b(s2.vars.inherit) && s2.parent;
      a2.immediateRender = b(o2.immediateRender), e15 < 2 ? a2.runBackwards = 1 : a2.startAt = t3[i2 - 1];
    }
    return new Y(t3[0], a2, t3[i2 + 1]);
  };
  var it = function(e15, t3) {
    return e15 || e15 === 0 ? t3(e15) : t3;
  };
  var at = function(e15, t3, n2) {
    return n2 < e15 ? e15 : n2 > t3 ? t3 : n2;
  };
  var G = function(e15, t3) {
    return !h(e15) || !(t3 = N.exec(e15)) ? `` : t3[1];
  };
  var ot = function(e15, t3, n2) {
    return it(n2, function(n3) {
      return at(e15, t3, n3);
    });
  };
  var st = [].slice;
  var ct = function(e15, t3) {
    return e15 && y(e15) && `length` in e15 && (!t3 && !e15.length || e15.length - 1 in e15 && y(e15[0])) && !e15.nodeType && e15 !== F;
  };
  var lt = function(e15, t3, n2) {
    return n2 === void 0 && (n2 = []), e15.forEach(function(e16) {
      var r2;
      return h(e16) && !t3 || ct(e16, 1) ? (r2 = n2).push.apply(r2, ut(e16)) : n2.push(e16);
    }) || n2;
  };
  var ut = function(e15, t3, n2) {
    return o && !t3 && o.selector ? o.selector(e15) : h(e15) && !n2 && (I || !Ht()) ? st.call((t3 || L).querySelectorAll(e15), 0) : w(e15) ? lt(e15, n2) : ct(e15) ? st.call(e15, 0) : e15 ? [e15] : [];
  };
  var dt = function(e15) {
    return e15 = ut(e15)[0] || ne(`Invalid scope`) || {}, function(t3) {
      var n2 = e15.current || e15.nativeElement || e15;
      return ut(t3, n2.querySelectorAll ? n2 : n2 === e15 ? ne(`Invalid scope`) || L.createElement(`div`) : e15);
    };
  };
  var ft = function(e15) {
    return e15.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var pt = function(e15) {
    if (g(e15)) return e15;
    var t3 = y(e15) ? e15 : { each: e15 }, n2 = Yt(t3.ease), r2 = t3.from || 0, i2 = parseFloat(t3.base) || 0, a2 = {}, o2 = r2 > 0 && r2 < 1, c2 = isNaN(r2) || o2, l2 = t3.axis, u2 = r2, d2 = r2;
    return h(r2) ? u2 = d2 = { center: 0.5, edges: 0.5, end: 1 }[r2] || 0 : !o2 && c2 && (u2 = r2[0], d2 = r2[1]), function(e16, o3, p2) {
      var m2 = (p2 || t3).length, h2 = a2[m2], g2, _2, v2, y2, b2, x2, S2, C2, w2;
      if (!h2) {
        if (w2 = t3.grid === `auto` ? 0 : (t3.grid || [1, s])[1], !w2) {
          for (S2 = -s; S2 < (S2 = p2[w2++].getBoundingClientRect().left) && w2 < m2; ) ;
          w2 < m2 && w2--;
        }
        for (h2 = a2[m2] = [], g2 = c2 ? Math.min(w2, m2) * u2 - 0.5 : r2 % w2, _2 = w2 === s ? 0 : c2 ? m2 * d2 / w2 - 0.5 : r2 / w2 | 0, S2 = 0, C2 = s, x2 = 0; x2 < m2; x2++) v2 = x2 % w2 - g2, y2 = _2 - (x2 / w2 | 0), h2[x2] = b2 = l2 ? Math.abs(l2 === `y` ? y2 : v2) : f(v2 * v2 + y2 * y2), b2 > S2 && (S2 = b2), b2 < C2 && (C2 = b2);
        r2 === `random` && ft(h2), h2.max = S2 - C2, h2.min = C2, h2.v = m2 = (parseFloat(t3.amount) || parseFloat(t3.each) * (w2 > m2 ? m2 - 1 : l2 ? l2 === `y` ? m2 / w2 : w2 : Math.max(w2, m2 / w2)) || 0) * (r2 === `edges` ? -1 : 1), h2.b = m2 < 0 ? i2 - m2 : i2, h2.u = G(t3.amount || t3.each) || 0, n2 = n2 && m2 < 0 ? Jt(n2) : n2;
      }
      return m2 = (h2[e16] - h2.min) / h2.max || 0, W(h2.b + (n2 ? n2(m2) : m2) * h2.v) + h2.u;
    };
  };
  var mt = function(e15) {
    var t3 = 10 ** ((e15 + ``).split(`.`)[1] || ``).length;
    return function(n2) {
      var r2 = W(Math.round(parseFloat(n2) / e15) * e15 * t3);
      return (r2 - r2 % 1) / t3 + (_(n2) ? 0 : G(n2));
    };
  };
  var ht = function(e15, t3) {
    var n2 = w(e15), r2, i2;
    return !n2 && y(e15) && (r2 = n2 = e15.radius || s, e15.values ? (e15 = ut(e15.values), (i2 = !_(e15[0])) && (r2 *= r2)) : e15 = mt(e15.increment)), it(t3, n2 ? g(e15) ? function(t4) {
      return i2 = e15(t4), Math.abs(i2 - t4) <= r2 ? i2 : t4;
    } : function(t4) {
      for (var n3 = parseFloat(i2 ? t4.x : t4), a2 = parseFloat(i2 ? t4.y : 0), o2 = s, c2 = 0, l2 = e15.length, u2, d2; l2--; ) i2 ? (u2 = e15[l2].x - n3, d2 = e15[l2].y - a2, u2 = u2 * u2 + d2 * d2) : u2 = Math.abs(e15[l2] - n3), u2 < o2 && (o2 = u2, c2 = l2);
      return c2 = !r2 || o2 <= r2 ? e15[c2] : t4, i2 || c2 === t4 || _(t4) ? c2 : c2 + G(t4);
    } : mt(e15));
  };
  var gt = function(e15, t3, n2, r2) {
    return it(w(e15) ? !t3 : n2 === true ? !!(n2 = 0) : !r2, function() {
      return w(e15) ? e15[~~(Math.random() * e15.length)] : (n2 || (n2 = 1e-5)) && (r2 = n2 < 1 ? 10 ** ((n2 + ``).length - 2) : 1) && Math.floor(Math.round((e15 - n2 / 2 + Math.random() * (t3 - e15 + n2 * 0.99)) / n2) * n2 * r2) / r2;
    });
  };
  var _t = function() {
    var e15 = [...arguments];
    return function(t3) {
      return e15.reduce(function(e16, t4) {
        return t4(e16);
      }, t3);
    };
  };
  var vt = function(e15, t3) {
    return function(n2) {
      return e15(parseFloat(n2)) + (t3 || G(n2));
    };
  };
  var yt = function(e15, t3, n2) {
    return wt(e15, t3, 0, 1, n2);
  };
  var bt = function(e15, t3, n2) {
    return it(n2, function(n3) {
      return e15[~~t3(n3)];
    });
  };
  var xt = function e6(t3, n2, r2) {
    var i2 = n2 - t3;
    return w(t3) ? bt(t3, e6(0, t3.length), n2) : it(r2, function(e15) {
      return (i2 + (e15 - t3) % i2) % i2 + t3;
    });
  };
  var St = function e7(t3, n2, r2) {
    var i2 = n2 - t3, a2 = i2 * 2;
    return w(t3) ? bt(t3, e7(0, t3.length - 1), n2) : it(r2, function(e15) {
      return e15 = (a2 + (e15 - t3) % a2) % a2 || 0, t3 + (e15 > i2 ? a2 - e15 : e15);
    });
  };
  var Ct = function(e15) {
    return e15.replace(T, function(e16) {
      var t3 = e16.indexOf(`[`) + 1, n2 = e16.substring(t3 || 7, t3 ? e16.indexOf(`]`) : e16.length - 1).split(E);
      return gt(t3 ? n2 : +n2[0], t3 ? 0 : +n2[1], +n2[2] || 1e-5);
    });
  };
  var wt = function(e15, t3, n2, r2, i2) {
    var a2 = t3 - e15, o2 = r2 - n2;
    return it(i2, function(t4) {
      return n2 + ((t4 - e15) / a2 * o2 || 0);
    });
  };
  var Tt = function e8(t3, n2, r2, i2) {
    var a2 = isNaN(t3 + n2) ? 0 : function(e15) {
      return (1 - e15) * t3 + e15 * n2;
    };
    if (!a2) {
      var o2 = h(t3), s2 = {}, c2, l2, u2, d2, f2;
      if (r2 === true && (i2 = 1) && (r2 = null), o2) t3 = { p: t3 }, n2 = { p: n2 };
      else if (w(t3) && !w(n2)) {
        for (u2 = [], d2 = t3.length, f2 = d2 - 2, l2 = 1; l2 < d2; l2++) u2.push(e8(t3[l2 - 1], t3[l2]));
        d2--, a2 = function(e15) {
          e15 *= d2;
          var t4 = Math.min(f2, ~~e15);
          return u2[t4](e15 - t4);
        }, r2 = n2;
      } else i2 || (t3 = Oe(w(t3) ? [] : {}, t3));
      if (!u2) {
        for (c2 in n2) rn.call(s2, t3, c2, `get`, n2[c2]);
        a2 = function(e15) {
          return wn(e15, s2) || (o2 ? t3.p : t3);
        };
      }
    }
    return it(r2, a2);
  };
  var Et = function(e15, t3, n2) {
    var r2 = e15.labels, i2 = s, a2, o2, c2;
    for (a2 in r2) o2 = r2[a2] - t3, o2 < 0 == !!n2 && o2 && i2 > (o2 = Math.abs(o2)) && (c2 = a2, i2 = o2);
    return c2;
  };
  var Dt = function(e15, t3, n2) {
    var r2 = e15.vars, i2 = r2[t3], a2 = o, s2 = e15._ctx, c2, l2, u2;
    if (i2) return c2 = r2[t3 + `Params`], l2 = r2.callbackScope || e15, n2 && le.length && xe(), s2 && (o = s2), u2 = c2 ? i2.apply(l2, c2) : i2.call(l2), o = a2, u2;
  };
  var Ot = function(e15) {
    return Fe(e15), e15.scrollTrigger && e15.scrollTrigger.kill(!!a), e15.progress() < 1 && Dt(e15, `onInterrupt`), e15;
  };
  var kt;
  var At = [];
  var jt = function(e15) {
    if (e15) if (e15 = !e15.name && e15.default || e15, x() || e15.headless) {
      var t3 = e15.name, n2 = g(e15), r2 = t3 && !n2 && e15.init ? function() {
        this._props = [];
      } : e15, i2 = { init: ie, render: wn, add: rn, kill: En, modifier: Tn, rawVars: 0 }, a2 = { targetTest: 0, get: 0, getSetter: bn, aliases: {}, register: 0 };
      if (Ht(), e15 !== r2) {
        if (V[t3]) return;
        Ee(r2, Ee(Ae(e15, i2), a2)), Oe(r2.prototype, Oe(i2, Ae(e15, a2))), V[r2.prop = t3] = r2, e15.targetTest && (me.push(r2), ce[t3] = 1), t3 = (t3 === `css` ? `CSS` : t3.charAt(0).toUpperCase() + t3.substr(1)) + `Plugin`;
      }
      re(t3, r2), e15.register && e15.register(Z, r2, X);
    } else At.push(e15);
  };
  var K = 255;
  var Mt = { aqua: [0, K, K], lime: [0, K, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, K], navy: [0, 0, 128], white: [K, K, K], olive: [128, 128, 0], yellow: [K, K, 0], orange: [K, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [K, 0, 0], pink: [K, 192, 203], cyan: [0, K, K], transparent: [K, K, K, 0] };
  var Nt = function(e15, t3, n2) {
    return e15 += e15 < 0 ? 1 : e15 > 1 ? -1 : 0, (e15 * 6 < 1 ? t3 + (n2 - t3) * e15 * 6 : e15 < 0.5 ? n2 : e15 * 3 < 2 ? t3 + (n2 - t3) * (2 / 3 - e15) * 6 : t3) * K + 0.5 | 0;
  };
  var Pt = function(e15, t3, n2) {
    var r2 = e15 ? _(e15) ? [e15 >> 16, e15 >> 8 & K, e15 & K] : 0 : Mt.black, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2;
    if (!r2) {
      if (e15.substr(-1) === `,` && (e15 = e15.substr(0, e15.length - 1)), Mt[e15]) r2 = Mt[e15];
      else if (e15.charAt(0) === `#`) {
        if (e15.length < 6 && (i2 = e15.charAt(1), a2 = e15.charAt(2), o2 = e15.charAt(3), e15 = `#` + i2 + i2 + a2 + a2 + o2 + o2 + (e15.length === 5 ? e15.charAt(4) + e15.charAt(4) : ``)), e15.length === 9) return r2 = parseInt(e15.substr(1, 6), 16), [r2 >> 16, r2 >> 8 & K, r2 & K, parseInt(e15.substr(7), 16) / 255];
        e15 = parseInt(e15.substr(1), 16), r2 = [e15 >> 16, e15 >> 8 & K, e15 & K];
      } else if (e15.substr(0, 3) === `hsl`) {
        if (r2 = p2 = e15.match(D), !t3) s2 = r2[0] % 360 / 360, c2 = r2[1] / 100, l2 = r2[2] / 100, a2 = l2 <= 0.5 ? l2 * (c2 + 1) : l2 + c2 - l2 * c2, i2 = l2 * 2 - a2, r2.length > 3 && (r2[3] *= 1), r2[0] = Nt(s2 + 1 / 3, i2, a2), r2[1] = Nt(s2, i2, a2), r2[2] = Nt(s2 - 1 / 3, i2, a2);
        else if (~e15.indexOf(`=`)) return r2 = e15.match(O), n2 && r2.length < 4 && (r2[3] = 1), r2;
      } else r2 = e15.match(D) || Mt.transparent;
      r2 = r2.map(Number);
    }
    return t3 && !p2 && (i2 = r2[0] / K, a2 = r2[1] / K, o2 = r2[2] / K, u2 = Math.max(i2, a2, o2), d2 = Math.min(i2, a2, o2), l2 = (u2 + d2) / 2, u2 === d2 ? s2 = c2 = 0 : (f2 = u2 - d2, c2 = l2 > 0.5 ? f2 / (2 - u2 - d2) : f2 / (u2 + d2), s2 = u2 === i2 ? (a2 - o2) / f2 + (a2 < o2 ? 6 : 0) : u2 === a2 ? (o2 - i2) / f2 + 2 : (i2 - a2) / f2 + 4, s2 *= 60), r2[0] = ~~(s2 + 0.5), r2[1] = ~~(c2 * 100 + 0.5), r2[2] = ~~(l2 * 100 + 0.5)), n2 && r2.length < 4 && (r2[3] = 1), r2;
  };
  var Ft = function(e15) {
    var t3 = [], n2 = [], r2 = -1;
    return e15.split(Lt).forEach(function(e16) {
      var i2 = e16.match(k) || [];
      t3.push.apply(t3, i2), n2.push(r2 += i2.length + 1);
    }), t3.c = n2, t3;
  };
  var It = function(e15, t3, n2) {
    var r2 = ``, i2 = (e15 + r2).match(Lt), a2 = t3 ? `hsla(` : `rgba(`, o2 = 0, s2, c2, l2, u2;
    if (!i2) return e15;
    if (i2 = i2.map(function(e16) {
      return (e16 = Pt(e16, t3, 1)) && a2 + (t3 ? e16[0] + `,` + e16[1] + `%,` + e16[2] + `%,` + e16[3] : e16.join(`,`)) + `)`;
    }), n2 && (l2 = Ft(e15), s2 = n2.c, s2.join(r2) !== l2.c.join(r2))) for (c2 = e15.replace(Lt, `1`).split(k), u2 = c2.length - 1; o2 < u2; o2++) r2 += c2[o2] + (~s2.indexOf(o2) ? i2.shift() || a2 + `0,0,0,0)` : (l2.length ? l2 : i2.length ? i2 : n2).shift());
    if (!c2) for (c2 = e15.split(Lt), u2 = c2.length - 1; o2 < u2; o2++) r2 += c2[o2] + i2[o2];
    return r2 + c2[u2];
  };
  var Lt = (function() {
    var e15 = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`, t3;
    for (t3 in Mt) e15 += `|` + t3 + `\\b`;
    return RegExp(e15 + `)`, `gi`);
  })();
  var Rt = /hsl[a]?\(/;
  var zt = function(e15) {
    var t3 = e15.join(` `), n2;
    if (Lt.lastIndex = 0, Lt.test(t3)) return n2 = Rt.test(t3), e15[1] = It(e15[1], n2), e15[0] = It(e15[0], n2, Ft(e15[1])), true;
  };
  var Bt;
  var Vt = (function() {
    var e15 = Date.now, t3 = 500, n2 = 33, r2 = e15(), i2 = r2, a2 = 1e3 / 240, o2 = a2, s2 = [], c2, l2, u2, d2, f2, p2, m2 = function u3(m3) {
      var h2 = e15() - i2, g2 = m3 === true, _2, v2, y2, b2;
      if ((h2 > t3 || h2 < 0) && (r2 += h2 - n2), i2 += h2, y2 = i2 - r2, _2 = y2 - o2, (_2 > 0 || g2) && (b2 = ++d2.frame, f2 = y2 - d2.time * 1e3, d2.time = y2 /= 1e3, o2 += _2 + (_2 >= a2 ? 4 : a2 - _2), v2 = 1), g2 || (c2 = l2(u3)), v2) for (p2 = 0; p2 < s2.length; p2++) s2[p2](y2, f2, b2, m3);
    };
    return d2 = { time: 0, frame: 0, tick: function() {
      m2(true);
    }, deltaRatio: function(e16) {
      return f2 / (1e3 / (e16 || 60));
    }, wake: function() {
      B && (!I && x() && (F = I = window, L = F.document || {}, R.gsap = Z, (F.gsapVersions || (F.gsapVersions = [])).push(Z.version), ee(z || F.GreenSockGlobals || !F.gsap && F || {}), At.forEach(jt)), u2 = typeof requestAnimationFrame < `u` && requestAnimationFrame, c2 && d2.sleep(), l2 = u2 || function(e16) {
        return setTimeout(e16, o2 - d2.time * 1e3 + 1 | 0);
      }, Bt = 1, m2(2));
    }, sleep: function() {
      (u2 ? cancelAnimationFrame : clearTimeout)(c2), Bt = 0, l2 = ie;
    }, lagSmoothing: function(e16, r3) {
      t3 = e16 || 1 / 0, n2 = Math.min(r3 || 33, t3);
    }, fps: function(e16) {
      a2 = 1e3 / (e16 || 240), o2 = d2.time * 1e3 + a2;
    }, add: function(e16, t4, n3) {
      var r3 = t4 ? function(t5, n4, i3, a3) {
        e16(t5, n4, i3, a3), d2.remove(r3);
      } : e16;
      return d2.remove(e16), s2[n3 ? `unshift` : `push`](r3), Ht(), r3;
    }, remove: function(e16, t4) {
      ~(t4 = s2.indexOf(e16)) && s2.splice(t4, 1) && p2 >= t4 && p2--;
    }, _listeners: s2 }, d2;
  })();
  var Ht = function() {
    return !Bt && Vt.wake();
  };
  var q = {};
  var Ut = /^[\d.\-M][\d.\-,\s]/;
  var Wt = /["']/g;
  var Gt = function(e15) {
    for (var t3 = {}, n2 = e15.substr(1, e15.length - 3).split(`:`), r2 = n2[0], i2 = 1, a2 = n2.length, o2, s2, c2; i2 < a2; i2++) s2 = n2[i2], o2 = i2 === a2 - 1 ? s2.length : s2.lastIndexOf(`,`), c2 = s2.substr(0, o2), t3[r2] = isNaN(c2) ? c2.replace(Wt, ``).trim() : +c2, r2 = s2.substr(o2 + 1).trim();
    return t3;
  };
  var Kt = function(e15) {
    var t3 = e15.indexOf(`(`) + 1, n2 = e15.indexOf(`)`), r2 = e15.indexOf(`(`, t3);
    return e15.substring(t3, ~r2 && r2 < n2 ? e15.indexOf(`)`, n2 + 1) : n2);
  };
  var qt = function(e15) {
    var t3 = (e15 + ``).split(`(`), n2 = q[t3[0]];
    return n2 && t3.length > 1 && n2.config ? n2.config.apply(null, ~e15.indexOf(`{`) ? [Gt(t3[1])] : Kt(e15).split(`,`).map(we)) : q._CE && Ut.test(e15) ? q._CE(``, e15) : n2;
  };
  var Jt = function(e15) {
    return function(t3) {
      return 1 - e15(1 - t3);
    };
  };
  var Yt = function(e15, t3) {
    return e15 && (g(e15) ? e15 : q[e15] || qt(e15)) || t3;
  };
  var Xt = function(e15, t3, n2, r2) {
    n2 === void 0 && (n2 = function(e16) {
      return 1 - t3(1 - e16);
    }), r2 === void 0 && (r2 = function(e16) {
      return e16 < 0.5 ? t3(e16 * 2) / 2 : 1 - t3((1 - e16) * 2) / 2;
    });
    var i2 = { easeIn: t3, easeOut: n2, easeInOut: r2 }, a2;
    return H(e15, function(e16) {
      for (var t4 in q[e16] = R[e16] = i2, q[a2 = e16.toLowerCase()] = n2, i2) q[a2 + (t4 === `easeIn` ? `.in` : t4 === `easeOut` ? `.out` : `.inOut`)] = q[e16 + `.` + t4] = i2[t4];
    }), i2;
  };
  var Zt = function(e15) {
    return function(t3) {
      return t3 < 0.5 ? (1 - e15(1 - t3 * 2)) / 2 : 0.5 + e15((t3 - 0.5) * 2) / 2;
    };
  };
  var Qt = function e9(t3, n2, r2) {
    var i2 = n2 >= 1 ? n2 : 1, a2 = (r2 || (t3 ? 0.3 : 0.45)) / (n2 < 1 ? n2 : 1), o2 = a2 / l * (Math.asin(1 / i2) || 0), s2 = function(e15) {
      return e15 === 1 ? 1 : i2 * 2 ** (-10 * e15) * m((e15 - o2) * a2) + 1;
    }, c2 = t3 === `out` ? s2 : t3 === `in` ? function(e15) {
      return 1 - s2(1 - e15);
    } : Zt(s2);
    return a2 = l / a2, c2.config = function(n3, r3) {
      return e9(t3, n3, r3);
    }, c2;
  };
  var $t = function e10(t3, n2) {
    n2 === void 0 && (n2 = 1.70158);
    var r2 = function(e15) {
      return e15 ? --e15 * e15 * ((n2 + 1) * e15 + n2) + 1 : 0;
    }, i2 = t3 === `out` ? r2 : t3 === `in` ? function(e15) {
      return 1 - r2(1 - e15);
    } : Zt(r2);
    return i2.config = function(n3) {
      return e10(t3, n3);
    }, i2;
  };
  H(`Linear,Quad,Cubic,Quart,Quint,Strong`, function(e15, t3) {
    var n2 = t3 < 5 ? t3 + 1 : t3;
    Xt(e15 + `,Power` + (n2 - 1), t3 ? function(e16) {
      return e16 ** +n2;
    } : function(e16) {
      return e16;
    }, function(e16) {
      return 1 - (1 - e16) ** n2;
    }, function(e16) {
      return e16 < 0.5 ? (e16 * 2) ** n2 / 2 : 1 - ((1 - e16) * 2) ** n2 / 2;
    });
  }), q.Linear.easeNone = q.none = q.Linear.easeIn, Xt(`Elastic`, Qt(`in`), Qt(`out`), Qt()), (function(e15, t3) {
    var n2 = 1 / t3, r2 = 2 * n2, i2 = 2.5 * n2, a2 = function(a3) {
      return a3 < n2 ? e15 * a3 * a3 : a3 < r2 ? e15 * (a3 - 1.5 / t3) ** 2 + 0.75 : a3 < i2 ? e15 * (a3 -= 2.25 / t3) * a3 + 0.9375 : e15 * (a3 - 2.625 / t3) ** 2 + 0.984375;
    };
    Xt(`Bounce`, function(e16) {
      return 1 - a2(1 - e16);
    }, a2);
  })(7.5625, 2.75), Xt(`Expo`, function(e15) {
    return 2 ** (10 * (e15 - 1)) * e15 + e15 * e15 * e15 * e15 * e15 * e15 * (1 - e15);
  }), Xt(`Circ`, function(e15) {
    return -(f(1 - e15 * e15) - 1);
  }), Xt(`Sine`, function(e15) {
    return e15 === 1 ? 1 : -p(e15 * u) + 1;
  }), Xt(`Back`, $t(`in`), $t(`out`), $t()), q.SteppedEase = q.steps = R.SteppedEase = { config: function(e15, t3) {
    e15 === void 0 && (e15 = 1);
    var n2 = 1 / e15, r2 = e15 + +!t3, i2 = +!!t3, a2 = 1 - c;
    return function(e16) {
      return ((r2 * at(0, a2, e16) | 0) + i2) * n2;
    };
  } }, r.ease = q[`quad.out`], H(`onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`, function(e15) {
    return he += e15 + `,` + e15 + `Params,`;
  });
  var en = function(e15, t3) {
    this.id = d++, e15._gsap = this, this.target = e15, this.harness = t3, this.get = t3 ? t3.get : ve, this.set = t3 ? t3.getSetter : bn;
  };
  var tn = (function() {
    function e15(e16) {
      this.vars = e16, this._delay = +e16.delay || 0, (this._repeat = e16.repeat === 1 / 0 ? -2 : e16.repeat || 0) && (this._rDelay = e16.repeatDelay || 0, this._yoyo = !!e16.yoyo || !!e16.yoyoEase), this._ts = 1, $e(this, +e16.duration, 1, 1), this.data = e16.data, o && (this._ctx = o, o.data.push(this)), Bt || Vt.wake();
    }
    var t3 = e15.prototype;
    return t3.delay = function(e16) {
      return e16 || e16 === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e16 - this._delay), this._delay = e16, this) : this._delay;
    }, t3.duration = function(e16) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? e16 + (e16 + this._rDelay) * this._repeat : e16) : this.totalDuration() && this._dur;
    }, t3.totalDuration = function(e16) {
      return arguments.length ? (this._dirty = 0, $e(this, this._repeat < 0 ? e16 : (e16 - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, t3.totalTime = function(e16, t4) {
      if (Ht(), !arguments.length) return this._tTime;
      var n2 = this._dp;
      if (n2 && n2.smoothChildTiming && this._ts) {
        for (We(this, e16), !n2._dp || n2.parent || Ge(n2, this); n2 && n2.parent; ) n2.parent._time !== n2._start + (n2._ts >= 0 ? n2._tTime / n2._ts : (n2.totalDuration() - n2._tTime) / -n2._ts) && n2.totalTime(n2._tTime, true), n2 = n2.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e16 < this._tDur || this._ts < 0 && e16 > 0 || !this._tDur && !e16) && Ke(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== e16 || !this._dur && !t4 || this._initted && Math.abs(this._zTime) === c || !this._initted && this._dur && e16 || !e16 && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e16), Ce(this, e16, t4)), this;
    }, t3.time = function(e16, t4) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e16 + Be(this)) % (this._dur + this._rDelay) || (e16 ? this._dur : 0), t4) : this._time;
    }, t3.totalProgress = function(e16, t4) {
      return arguments.length ? this.totalTime(this.totalDuration() * e16, t4) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, t3.progress = function(e16, t4) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e16 : e16) + Be(this), t4) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
    }, t3.iteration = function(e16, t4) {
      var n2 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (e16 - 1) * n2, t4) : this._repeat ? Ve(this._tTime, n2) + 1 : 1;
    }, t3.timeScale = function(e16, t4) {
      if (!arguments.length) return this._rts === -c ? 0 : this._rts;
      if (this._rts === e16) return this;
      var n2 = this.parent && this._ts ? He(this.parent._time, this) : this._tTime;
      return this._rts = +e16 || 0, this._ts = this._ps || e16 === -c ? 0 : this._rts, this.totalTime(at(-Math.abs(this._delay), this.totalDuration(), n2), t4 !== false), Ue(this), Le(this);
    }, t3.paused = function(e16) {
      return arguments.length ? (this._ps !== e16 && (this._ps = e16, e16 ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Ht(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== c && (this._tTime -= c)))), this) : this._ps;
    }, t3.startTime = function(e16) {
      if (arguments.length) {
        this._start = W(e16);
        var t4 = this.parent || this._dp;
        return t4 && (t4._sort || !this.parent) && Ke(t4, this, this._start - this._delay), this;
      }
      return this._start;
    }, t3.endTime = function(e16) {
      return this._start + (b(e16) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, t3.rawTime = function(e16) {
      var t4 = this.parent || this._dp;
      return t4 ? e16 && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? He(t4.rawTime(e16), this) : this._tTime : this._tTime;
    }, t3.revert = function(e16) {
      e16 === void 0 && (e16 = se);
      var t4 = a;
      return a = e16, Se(this) && (this.timeline && this.timeline.revert(e16), this.totalTime(-0.01, e16.suppressEvents)), this.data !== `nested` && e16.kill !== false && this.kill(), a = t4, this;
    }, t3.globalTime = function(e16) {
      for (var t4 = this, n2 = arguments.length ? e16 : t4.rawTime(); t4; ) n2 = t4._start + n2 / (Math.abs(t4._ts) || 1), t4 = t4._dp;
      return !this.parent && this._sat ? this._sat.globalTime(e16) : n2;
    }, t3.repeat = function(e16) {
      return arguments.length ? (this._repeat = e16 === 1 / 0 ? -2 : e16, et(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, t3.repeatDelay = function(e16) {
      if (arguments.length) {
        var t4 = this._time;
        return this._rDelay = e16, et(this), t4 ? this.time(t4) : this;
      }
      return this._rDelay;
    }, t3.yoyo = function(e16) {
      return arguments.length ? (this._yoyo = e16, this) : this._yoyo;
    }, t3.seek = function(e16, t4) {
      return this.totalTime(nt(this, e16), b(t4));
    }, t3.restart = function(e16, t4) {
      return this.play().totalTime(e16 ? -this._delay : 0, b(t4)), this._dur || (this._zTime = -c), this;
    }, t3.play = function(e16, t4) {
      return e16 != null && this.seek(e16, t4), this.reversed(false).paused(false);
    }, t3.reverse = function(e16, t4) {
      return e16 != null && this.seek(e16 || this.totalDuration(), t4), this.reversed(true).paused(false);
    }, t3.pause = function(e16, t4) {
      return e16 != null && this.seek(e16, t4), this.paused(true);
    }, t3.resume = function() {
      return this.paused(false);
    }, t3.reversed = function(e16) {
      return arguments.length ? (!!e16 !== this.reversed() && this.timeScale(-this._rts || (e16 ? -c : 0)), this) : this._rts < 0;
    }, t3.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -c, this;
    }, t3.isActive = function() {
      var e16 = this.parent || this._dp, t4 = this._start, n2;
      return !!(!e16 || this._ts && this._initted && e16.isActive() && (n2 = e16.rawTime(true)) >= t4 && n2 < this.endTime(true) - c);
    }, t3.eventCallback = function(e16, t4, n2) {
      var r2 = this.vars;
      return arguments.length > 1 ? (t4 ? (r2[e16] = t4, n2 && (r2[e16 + `Params`] = n2), e16 === `onUpdate` && (this._onUpdate = t4)) : delete r2[e16], this) : r2[e16];
    }, t3.then = function(e16) {
      var t4 = this, n2 = t4._prom;
      return new Promise(function(r2) {
        var i2 = g(e16) ? e16 : Te, a2 = function() {
          var e17 = t4.then;
          t4.then = null, n2 && n2(), g(i2) && (i2 = i2(t4)) && (i2.then || i2 === t4) && (t4.then = e17), r2(i2), t4.then = e17;
        };
        t4._initted && t4.totalProgress() === 1 && t4._ts >= 0 || !t4._tTime && t4._ts < 0 ? a2() : t4._prom = a2;
      });
    }, t3.kill = function() {
      Ot(this);
    }, e15;
  })();
  Ee(tn.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -c, _prom: 0, _ps: false, _rts: 1 });
  var J = (function(r2) {
    t(i2, r2);
    function i2(t3, n2) {
      var i3;
      return t3 === void 0 && (t3 = {}), i3 = r2.call(this, t3) || this, i3.labels = {}, i3.smoothChildTiming = !!t3.smoothChildTiming, i3.autoRemoveChildren = !!t3.autoRemoveChildren, i3._sort = b(t3.sortChildren), P && Ke(t3.parent || P, e(i3), n2), t3.reversed && i3.reverse(), t3.paused && i3.paused(true), t3.scrollTrigger && qe(e(i3), t3.scrollTrigger), i3;
    }
    var o2 = i2.prototype;
    return o2.to = function(e15, t3, n2) {
      return rt(0, arguments, this), this;
    }, o2.from = function(e15, t3, n2) {
      return rt(1, arguments, this), this;
    }, o2.fromTo = function(e15, t3, n2, r3) {
      return rt(2, arguments, this), this;
    }, o2.set = function(e15, t3, n2) {
      return t3.duration = 0, t3.parent = this, je(t3).repeatDelay || (t3.repeat = 0), t3.immediateRender = !!t3.immediateRender, new Y(e15, t3, nt(this, n2), 1), this;
    }, o2.call = function(e15, t3, n2) {
      return Ke(this, Y.delayedCall(0, e15, t3), n2);
    }, o2.staggerTo = function(e15, t3, n2, r3, i3, a2, o3) {
      return n2.duration = t3, n2.stagger = n2.stagger || r3, n2.onComplete = a2, n2.onCompleteParams = o3, n2.parent = this, new Y(e15, n2, nt(this, i3)), this;
    }, o2.staggerFrom = function(e15, t3, n2, r3, i3, a2, o3) {
      return n2.runBackwards = 1, je(n2).immediateRender = b(n2.immediateRender), this.staggerTo(e15, t3, n2, r3, i3, a2, o3);
    }, o2.staggerFromTo = function(e15, t3, n2, r3, i3, a2, o3, s2) {
      return r3.startAt = n2, je(r3).immediateRender = b(r3.immediateRender), this.staggerTo(e15, t3, r3, i3, a2, o3, s2);
    }, o2.render = function(e15, t3, n2) {
      var r3 = this._time, i3 = this._dirty ? this.totalDuration() : this._tDur, o3 = this._dur, s2 = e15 <= 0 ? 0 : W(e15), l2 = this._zTime < 0 != e15 < 0 && (this._initted || !o3), u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2;
      if (this !== P && s2 > i3 && e15 >= 0 && (s2 = i3), s2 !== this._tTime || n2 || l2) {
        if (r3 !== this._time && o3 && (s2 += this._time - r3, e15 += this._time - r3), u2 = s2, v2 = this._start, _2 = this._ts, h2 = !_2, l2 && (o3 || (r3 = this._zTime), (e15 || !t3) && (this._zTime = e15)), this._repeat) {
          if (b2 = this._yoyo, m2 = o3 + this._rDelay, this._repeat < -1 && e15 < 0) return this.totalTime(m2 * 100 + e15, t3, n2);
          if (u2 = W(s2 % m2), s2 === i3 ? (p2 = this._repeat, u2 = o3) : (y2 = W(s2 / m2), p2 = ~~y2, p2 && p2 === y2 && (u2 = o3, p2--), u2 > o3 && (u2 = o3)), y2 = Ve(this._tTime, m2), !r3 && this._tTime && y2 !== p2 && this._tTime - y2 * m2 - this._dur <= 0 && (y2 = p2), b2 && p2 & 1 && (u2 = o3 - u2, x2 = 1), p2 !== y2 && !this._lock) {
            var S2 = b2 && y2 & 1, C2 = S2 === (b2 && p2 & 1);
            if (p2 < y2 && (S2 = !S2), r3 = S2 ? 0 : s2 % o3 ? o3 : s2, this._lock = 1, this.render(r3 || (x2 ? 0 : W(p2 * m2)), t3, !o3)._lock = 0, this._tTime = s2, !t3 && this.parent && Dt(this, `onRepeat`), this.vars.repeatRefresh && !x2 && (this.invalidate()._lock = 1, y2 = p2), r3 && r3 !== this._time || h2 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (o3 = this._dur, i3 = this._tDur, C2 && (this._lock = 2, r3 = S2 ? o3 : -1e-4, this.render(r3, true), this.vars.repeatRefresh && !x2 && this.invalidate()), this._lock = 0, !this._ts && !h2)) return this;
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g2 = Qe(this, W(r3), W(u2)), g2 && (s2 -= u2 - (u2 = g2._start))), this._tTime = s2, this._time = u2, this._act = !!_2, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e15, r3 = 0), !r3 && s2 && o3 && !t3 && !y2 && (Dt(this, `onStart`), this._tTime !== s2)) return this;
        if (u2 >= r3 && e15 >= 0) for (d2 = this._first; d2; ) {
          if (f2 = d2._next, (d2._act || u2 >= d2._start) && d2._ts && g2 !== d2) {
            if (d2.parent !== this) return this.render(e15, t3, n2);
            if (d2.render(d2._ts > 0 ? (u2 - d2._start) * d2._ts : (d2._dirty ? d2.totalDuration() : d2._tDur) + (u2 - d2._start) * d2._ts, t3, n2), u2 !== this._time || !this._ts && !h2) {
              g2 = 0, f2 && (s2 += this._zTime = -c);
              break;
            }
          }
          d2 = f2;
        }
        else {
          d2 = this._last;
          for (var w2 = e15 < 0 ? e15 : u2; d2; ) {
            if (f2 = d2._prev, (d2._act || w2 <= d2._end) && d2._ts && g2 !== d2) {
              if (d2.parent !== this) return this.render(e15, t3, n2);
              if (d2.render(d2._ts > 0 ? (w2 - d2._start) * d2._ts : (d2._dirty ? d2.totalDuration() : d2._tDur) + (w2 - d2._start) * d2._ts, t3, n2 || a && Se(d2)), u2 !== this._time || !this._ts && !h2) {
                g2 = 0, f2 && (s2 += this._zTime = w2 ? -c : c);
                break;
              }
            }
            d2 = f2;
          }
        }
        if (g2 && !t3 && (this.pause(), g2.render(u2 >= r3 ? 0 : -c)._zTime = u2 >= r3 ? 1 : -1, this._ts)) return this._start = v2, Ue(this), this.render(e15, t3, n2);
        this._onUpdate && !t3 && Dt(this, `onUpdate`, true), (s2 === i3 && this._tTime >= this.totalDuration() || !s2 && r3) && (v2 === this._start || Math.abs(_2) !== Math.abs(this._ts)) && (this._lock || ((e15 || !o3) && (s2 === i3 && this._ts > 0 || !s2 && this._ts < 0) && Fe(this, 1), !t3 && !(e15 < 0 && !r3) && (s2 || r3 || !i3) && (Dt(this, s2 === i3 && e15 >= 0 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s2 < i3 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, o2.add = function(e15, t3) {
      var n2 = this;
      if (_(t3) || (t3 = nt(this, t3, e15)), !(e15 instanceof tn)) {
        if (w(e15)) return e15.forEach(function(e16) {
          return n2.add(e16, t3);
        }), this;
        if (h(e15)) return this.addLabel(e15, t3);
        if (g(e15)) e15 = Y.delayedCall(0, e15);
        else return this;
      }
      return this === e15 ? this : Ke(this, e15, t3);
    }, o2.getChildren = function(e15, t3, n2, r3) {
      e15 === void 0 && (e15 = true), t3 === void 0 && (t3 = true), n2 === void 0 && (n2 = true), r3 === void 0 && (r3 = -s);
      for (var i3 = [], a2 = this._first; a2; ) a2._start >= r3 && (a2 instanceof Y ? t3 && i3.push(a2) : (n2 && i3.push(a2), e15 && i3.push.apply(i3, a2.getChildren(true, t3, n2)))), a2 = a2._next;
      return i3;
    }, o2.getById = function(e15) {
      for (var t3 = this.getChildren(1, 1, 1), n2 = t3.length; n2--; ) if (t3[n2].vars.id === e15) return t3[n2];
    }, o2.remove = function(e15) {
      return h(e15) ? this.removeLabel(e15) : g(e15) ? this.killTweensOf(e15) : (e15.parent === this && Pe(this, e15), e15 === this._recent && (this._recent = this._last), Ie(this));
    }, o2.totalTime = function(e15, t3) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = W(Vt.time - (this._ts > 0 ? e15 / this._ts : (this.totalDuration() - e15) / -this._ts))), r2.prototype.totalTime.call(this, e15, t3), this._forcing = 0, this) : this._tTime;
    }, o2.addLabel = function(e15, t3) {
      return this.labels[e15] = nt(this, t3), this;
    }, o2.removeLabel = function(e15) {
      return delete this.labels[e15], this;
    }, o2.addPause = function(e15, t3, n2) {
      var r3 = Y.delayedCall(0, t3 || ie, n2);
      return r3.data = `isPause`, this._hasPause = 1, Ke(this, r3, nt(this, e15));
    }, o2.removePause = function(e15) {
      var t3 = this._first;
      for (e15 = nt(this, e15); t3; ) t3._start === e15 && t3.data === `isPause` && Fe(t3), t3 = t3._next;
    }, o2.killTweensOf = function(e15, t3, n2) {
      for (var r3 = this.getTweensOf(e15, n2), i3 = r3.length; i3--; ) sn !== r3[i3] && r3[i3].kill(e15, t3);
      return this;
    }, o2.getTweensOf = function(e15, t3) {
      for (var n2 = [], r3 = ut(e15), i3 = this._first, a2 = _(t3), o3; i3; ) i3 instanceof Y ? be(i3._targets, r3) && (a2 ? (!sn || i3._initted && i3._ts) && i3.globalTime(0) <= t3 && i3.globalTime(i3.totalDuration()) > t3 : !t3 || i3.isActive()) && n2.push(i3) : (o3 = i3.getTweensOf(r3, t3)).length && n2.push.apply(n2, o3), i3 = i3._next;
      return n2;
    }, o2.tweenTo = function(e15, t3) {
      t3 || (t3 = {});
      var n2 = this, r3 = nt(n2, e15), i3 = t3, a2 = i3.startAt, o3 = i3.onStart, s2 = i3.onStartParams, l2 = i3.immediateRender, u2, d2 = Y.to(n2, Ee({ ease: t3.ease || `none`, lazy: false, immediateRender: false, time: r3, overwrite: `auto`, duration: t3.duration || Math.abs((r3 - (a2 && `time` in a2 ? a2.time : n2._time)) / n2.timeScale()) || c, onStart: function() {
        if (n2.pause(), !u2) {
          var e16 = t3.duration || Math.abs((r3 - (a2 && `time` in a2 ? a2.time : n2._time)) / n2.timeScale());
          d2._dur !== e16 && $e(d2, e16, 0, 1).render(d2._time, true, true), u2 = 1;
        }
        o3 && o3.apply(d2, s2 || []);
      } }, t3));
      return l2 ? d2.render(0) : d2;
    }, o2.tweenFromTo = function(e15, t3, n2) {
      return this.tweenTo(t3, Ee({ startAt: { time: nt(this, e15) } }, n2));
    }, o2.recent = function() {
      return this._recent;
    }, o2.nextLabel = function(e15) {
      return e15 === void 0 && (e15 = this._time), Et(this, nt(this, e15));
    }, o2.previousLabel = function(e15) {
      return e15 === void 0 && (e15 = this._time), Et(this, nt(this, e15), 1);
    }, o2.currentLabel = function(e15) {
      return arguments.length ? this.seek(e15, true) : this.previousLabel(this._time + c);
    }, o2.shiftChildren = function(e15, t3, n2) {
      n2 === void 0 && (n2 = 0);
      var r3 = this._first, i3 = this.labels, a2;
      for (e15 = W(e15); r3; ) r3._start >= n2 && (r3._start += e15, r3._end += e15), r3 = r3._next;
      if (t3) for (a2 in i3) i3[a2] >= n2 && (i3[a2] += e15);
      return Ie(this);
    }, o2.invalidate = function(e15) {
      var t3 = this._first;
      for (this._lock = 0; t3; ) t3.invalidate(e15), t3 = t3._next;
      return r2.prototype.invalidate.call(this, e15);
    }, o2.clear = function(e15) {
      e15 === void 0 && (e15 = true);
      for (var t3 = this._first, n2; t3; ) n2 = t3._next, this.remove(t3), t3 = n2;
      return this._dp && (this._time = this._tTime = this._pTime = 0), e15 && (this.labels = {}), Ie(this);
    }, o2.totalDuration = function(e15) {
      var t3 = 0, n2 = this, r3 = n2._last, i3 = s, a2, o3, c2;
      if (arguments.length) return n2.timeScale((n2._repeat < 0 ? n2.duration() : n2.totalDuration()) / (n2.reversed() ? -e15 : e15));
      if (n2._dirty) {
        for (c2 = n2.parent; r3; ) a2 = r3._prev, r3._dirty && r3.totalDuration(), o3 = r3._start, o3 > i3 && n2._sort && r3._ts && !n2._lock ? (n2._lock = 1, Ke(n2, r3, o3 - r3._delay, 1)._lock = 0) : i3 = o3, o3 < 0 && r3._ts && (t3 -= o3, (!c2 && !n2._dp || c2 && c2.smoothChildTiming) && (n2._start += W(o3 / n2._ts), n2._time -= o3, n2._tTime -= o3), n2.shiftChildren(-o3, false, -1 / 0), i3 = 0), r3._end > t3 && r3._ts && (t3 = r3._end), r3 = a2;
        $e(n2, n2 === P && n2._time > t3 ? n2._time : t3, 1, 1), n2._dirty = 0;
      }
      return n2._tDur;
    }, i2.updateRoot = function(e15) {
      if (P._ts && (Ce(P, He(e15, P)), de = Vt.frame), Vt.frame >= pe) {
        pe += n.autoSleep || 120;
        var t3 = P._first;
        if ((!t3 || !t3._ts) && n.autoSleep && Vt._listeners.length < 2) {
          for (; t3 && !t3._ts; ) t3 = t3._next;
          t3 || Vt.sleep();
        }
      }
    }, i2;
  })(tn);
  Ee(J.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
  var nn = function(e15, t3, n2, r2, i2, a2, o2) {
    var s2 = new X(this._pt, e15, t3, 0, 1, Cn, null, i2), c2 = 0, l2 = 0, u2, d2, f2, p2, m2, h2, g2, _2;
    for (s2.b = n2, s2.e = r2, n2 += ``, r2 += ``, (g2 = ~r2.indexOf(`random(`)) && (r2 = Ct(r2)), a2 && (_2 = [n2, r2], a2(_2, e15, t3), n2 = _2[0], r2 = _2[1]), d2 = n2.match(A) || []; u2 = A.exec(r2); ) p2 = u2[0], m2 = r2.substring(c2, u2.index), f2 ? f2 = (f2 + 1) % 5 : m2.substr(-5) === `rgba(` && (f2 = 1), p2 !== d2[l2++] && (h2 = parseFloat(d2[l2 - 1]) || 0, s2._pt = { _next: s2._pt, p: m2 || l2 === 1 ? m2 : `,`, s: h2, c: p2.charAt(1) === `=` ? ye(h2, p2) - h2 : parseFloat(p2) - h2, m: f2 && f2 < 4 ? Math.round : 0 }, c2 = A.lastIndex);
    return s2.c = c2 < r2.length ? r2.substring(c2, r2.length) : ``, s2.fp = o2, (j.test(r2) || g2) && (s2.e = 0), this._pt = s2, s2;
  };
  var rn = function(e15, t3, r2, i2, a2, o2, s2, c2, l2, u2) {
    g(i2) && (i2 = i2(a2 || 0, e15, o2));
    var d2 = e15[t3], f2 = r2 === `get` ? g(d2) ? l2 ? e15[t3.indexOf(`set`) || !g(e15[`get` + t3.substr(3)]) ? t3 : `get` + t3.substr(3)](l2) : e15[t3]() : d2 : r2, p2 = g(d2) ? l2 ? vn : _n : gn, m2;
    if (h(i2) && (~i2.indexOf(`random(`) && (i2 = Ct(i2)), i2.charAt(1) === `=` && (m2 = ye(f2, i2) + (G(f2) || 0), (m2 || m2 === 0) && (i2 = m2))), !u2 || f2 !== i2 || cn) return !isNaN(f2 * i2) && i2 !== `` ? (m2 = new X(this._pt, e15, t3, +f2 || 0, i2 - (f2 || 0), typeof d2 == `boolean` ? Sn : xn, 0, p2), l2 && (m2.fp = l2), s2 && m2.modifier(s2, this, e15), this._pt = m2) : (!d2 && !(t3 in e15) && te(t3, i2), nn.call(this, e15, t3, f2, i2, p2, c2 || n.stringFilter, l2));
  };
  var an = function(e15, t3, n2, r2, i2) {
    if (g(e15) && (e15 = pn(e15, i2, t3, n2, r2)), !y(e15) || e15.style && e15.nodeType || w(e15) || C(e15)) return h(e15) ? pn(e15, i2, t3, n2, r2) : e15;
    var a2 = {}, o2;
    for (o2 in e15) a2[o2] = pn(e15[o2], i2, t3, n2, r2);
    return a2;
  };
  var on = function(e15, t3, n2, r2, i2, a2) {
    var o2, s2, c2, l2;
    if (V[e15] && (o2 = new V[e15]()).init(i2, o2.rawVars ? t3[e15] : an(t3[e15], r2, i2, a2, n2), n2, r2, a2) !== false && (n2._pt = s2 = new X(n2._pt, i2, e15, 0, 1, o2.render, o2, 0, o2.priority), n2 !== kt)) for (c2 = n2._ptLookup[n2._targets.indexOf(i2)], l2 = o2._props.length; l2--; ) c2[o2._props[l2]] = s2;
    return o2;
  };
  var sn;
  var cn;
  var ln = function e11(t3, n2, o2) {
    var l2 = t3.vars, u2 = l2.ease, d2 = l2.startAt, f2 = l2.immediateRender, p2 = l2.lazy, m2 = l2.onUpdate, h2 = l2.runBackwards, g2 = l2.yoyoEase, _2 = l2.keyframes, v2 = l2.autoRevert, y2 = t3._dur, x2 = t3._startAt, S2 = t3._targets, C2 = t3.parent, w2 = C2 && C2.data === `nested` ? C2.vars.targets : S2, T2 = t3._overwrite === `auto` && !i, E2 = t3.timeline, D2 = l2.easeReverse || g2, O2, k2, A2, j2, M2, N2, F2, I2, L2, R2, z2, B2, ee2;
    if (E2 && (!_2 || !u2) && (u2 = `none`), t3._ease = Yt(u2, r.ease), t3._rEase = D2 && (Yt(D2) || t3._ease), t3._from = !E2 && !!l2.runBackwards, t3._from && (t3.ratio = 1), !E2 || _2 && !l2.stagger) {
      if (I2 = S2[0] ? _e(S2[0]).harness : 0, B2 = I2 && l2[I2.prop], O2 = Ae(l2, ce), x2 && (x2._zTime < 0 && x2.progress(1), n2 < 0 && h2 && f2 && !v2 ? x2.render(-1, true) : x2.revert(h2 && y2 ? oe : ae), x2._lazy = 0), d2) {
        if (Fe(t3._startAt = Y.set(S2, Ee({ data: `isStart`, overwrite: false, parent: C2, immediateRender: true, lazy: !x2 && b(p2), startAt: null, delay: 0, onUpdate: m2 && function() {
          return Dt(t3, `onUpdate`);
        }, stagger: 0 }, d2))), t3._startAt._dp = 0, t3._startAt._sat = t3, n2 < 0 && (a || !f2 && !v2) && t3._startAt.revert(oe), f2 && y2 && n2 <= 0 && o2 <= 0) {
          n2 && (t3._zTime = n2);
          return;
        }
      } else if (h2 && y2 && !x2) {
        if (n2 && (f2 = false), A2 = Ee({ overwrite: false, data: `isFromStart`, lazy: f2 && !x2 && b(p2), immediateRender: f2, stagger: 0, parent: C2 }, O2), B2 && (A2[I2.prop] = B2), Fe(t3._startAt = Y.set(S2, A2)), t3._startAt._dp = 0, t3._startAt._sat = t3, n2 < 0 && (a ? t3._startAt.revert(oe) : t3._startAt.render(-1, true)), t3._zTime = n2, !f2) e11(t3._startAt, c, c);
        else if (!n2) return;
      }
      for (t3._pt = t3._ptCache = 0, p2 = y2 && b(p2) || p2 && !y2, k2 = 0; k2 < S2.length; k2++) {
        if (M2 = S2[k2], F2 = M2._gsap || ge(S2)[k2]._gsap, t3._ptLookup[k2] = R2 = {}, ue[F2.id] && le.length && xe(), z2 = w2 === S2 ? k2 : w2.indexOf(M2), I2 && (L2 = new I2()).init(M2, B2 || O2, t3, z2, w2) !== false && (t3._pt = j2 = new X(t3._pt, M2, L2.name, 0, 1, L2.render, L2, 0, L2.priority), L2._props.forEach(function(e15) {
          R2[e15] = j2;
        }), L2.priority && (N2 = 1)), !I2 || B2) for (A2 in O2) V[A2] && (L2 = on(A2, O2, t3, z2, M2, w2)) ? L2.priority && (N2 = 1) : R2[A2] = j2 = rn.call(t3, M2, A2, `get`, O2[A2], z2, w2, 0, l2.stringFilter);
        t3._op && t3._op[k2] && t3.kill(M2, t3._op[k2]), T2 && t3._pt && (sn = t3, P.killTweensOf(M2, R2, t3.globalTime(n2)), ee2 = !t3.parent, sn = 0), t3._pt && p2 && (ue[F2.id] = 1);
      }
      N2 && On(t3), t3._onInit && t3._onInit(t3);
    }
    t3._onUpdate = m2, t3._initted = (!t3._op || t3._pt) && !ee2, _2 && n2 <= 0 && E2.render(s, true, true);
  };
  var un = function(e15, t3, n2, r2, i2, a2, o2, s2) {
    var c2 = (e15._pt && e15._ptCache || (e15._ptCache = {}))[t3], l2, u2, d2, f2;
    if (!c2) for (c2 = e15._ptCache[t3] = [], d2 = e15._ptLookup, f2 = e15._targets.length; f2--; ) {
      if (l2 = d2[f2][t3], l2 && l2.d && l2.d._pt) for (l2 = l2.d._pt; l2 && l2.p !== t3 && l2.fp !== t3; ) l2 = l2._next;
      if (!l2) return cn = 1, e15.vars[t3] = `+=0`, ln(e15, o2), cn = 0, s2 ? ne(t3 + ` not eligible for reset. Try splitting into individual properties`) : 1;
      c2.push(l2);
    }
    for (f2 = c2.length; f2--; ) u2 = c2[f2], l2 = u2._pt || u2, l2.s = (r2 || r2 === 0) && !i2 ? r2 : l2.s + (r2 || 0) + a2 * l2.c, l2.c = n2 - l2.s, u2.e && (u2.e = U(n2) + G(u2.e)), u2.b && (u2.b = l2.s + G(u2.b));
  };
  var dn = function(e15, t3) {
    var n2 = e15[0] ? _e(e15[0]).harness : 0, r2 = n2 && n2.aliases, i2, a2, o2, s2;
    if (!r2) return t3;
    for (a2 in i2 = Oe({}, t3), r2) if (a2 in i2) for (s2 = r2[a2].split(`,`), o2 = s2.length; o2--; ) i2[s2[o2]] = i2[a2];
    return i2;
  };
  var fn = function(e15, t3, n2, r2) {
    var i2 = t3.ease || r2 || `power1.inOut`, a2, o2;
    if (w(t3)) o2 = n2[e15] || (n2[e15] = []), t3.forEach(function(e16, n3) {
      return o2.push({ t: n3 / (t3.length - 1) * 100, v: e16, e: i2 });
    });
    else for (a2 in t3) o2 = n2[a2] || (n2[a2] = []), a2 === `ease` || o2.push({ t: parseFloat(e15), v: t3[a2], e: i2 });
  };
  var pn = function(e15, t3, n2, r2, i2) {
    return g(e15) ? e15.call(t3, n2, r2, i2) : h(e15) && ~e15.indexOf(`random(`) ? Ct(e15) : e15;
  };
  var mn = he + `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`;
  var hn = {};
  H(mn + `,id,stagger,delay,duration,paused,scrollTrigger`, function(e15) {
    return hn[e15] = 1;
  });
  var Y = (function(r2) {
    t(o2, r2);
    function o2(t3, a2, o3, s3) {
      var l2;
      typeof a2 == `number` && (o3.duration = a2, a2 = o3, o3 = null), l2 = r2.call(this, s3 ? a2 : je(a2)) || this;
      var u2 = l2.vars, d2 = u2.duration, f2 = u2.delay, p2 = u2.immediateRender, m2 = u2.stagger, h2 = u2.overwrite, g2 = u2.keyframes, v2 = u2.defaults, x2 = u2.scrollTrigger, T2 = a2.parent || P, E2 = (w(t3) || C(t3) ? _(t3[0]) : `length` in a2) ? [t3] : ut(t3), D2, O2, k2, A2, j2, M2, N2, F2;
      if (l2._targets = E2.length ? ge(E2) : ne(`GSAP target ` + t3 + ` not found. https://gsap.com`, !n.nullTargetWarn) || [], l2._ptLookup = [], l2._overwrite = h2, g2 || m2 || S(d2) || S(f2)) {
        a2 = l2.vars;
        var I2 = a2.easeReverse || a2.yoyoEase;
        if (D2 = l2.timeline = new J({ data: `nested`, defaults: v2 || {}, targets: T2 && T2.data === `nested` ? T2.vars.targets : E2 }), D2.kill(), D2.parent = D2._dp = e(l2), D2._start = 0, m2 || S(d2) || S(f2)) {
          if (A2 = E2.length, N2 = m2 && pt(m2), y(m2)) for (j2 in m2) ~mn.indexOf(j2) && (F2 || (F2 = {}), F2[j2] = m2[j2]);
          for (O2 = 0; O2 < A2; O2++) k2 = Ae(a2, hn), k2.stagger = 0, I2 && (k2.easeReverse = I2), F2 && Oe(k2, F2), M2 = E2[O2], k2.duration = +pn(d2, e(l2), O2, M2, E2), k2.delay = (+pn(f2, e(l2), O2, M2, E2) || 0) - l2._delay, !m2 && A2 === 1 && k2.delay && (l2._delay = f2 = k2.delay, l2._start += f2, k2.delay = 0), D2.to(M2, k2, N2 ? N2(O2, M2, E2) : 0), D2._ease = q.none;
          D2.duration() ? d2 = f2 = 0 : l2.timeline = 0;
        } else if (g2) {
          je(Ee(D2.vars.defaults, { ease: `none` })), D2._ease = Yt(g2.ease || a2.ease || `none`);
          var L2 = 0, R2, z2, B2;
          if (w(g2)) g2.forEach(function(e15) {
            return D2.to(E2, e15, `>`);
          }), D2.duration();
          else {
            for (j2 in k2 = {}, g2) j2 === `ease` || j2 === `easeEach` || fn(j2, g2[j2], k2, g2.easeEach);
            for (j2 in k2) for (R2 = k2[j2].sort(function(e15, t4) {
              return e15.t - t4.t;
            }), L2 = 0, O2 = 0; O2 < R2.length; O2++) z2 = R2[O2], B2 = { ease: z2.e, duration: (z2.t - (O2 ? R2[O2 - 1].t : 0)) / 100 * d2 }, B2[j2] = z2.v, D2.to(E2, B2, L2), L2 += B2.duration;
            D2.duration() < d2 && D2.to({}, { duration: d2 - D2.duration() });
          }
        }
        d2 || l2.duration(d2 = D2.duration());
      } else l2.timeline = 0;
      return h2 === true && !i && (sn = e(l2), P.killTweensOf(E2), sn = 0), Ke(T2, e(l2), o3), a2.reversed && l2.reverse(), a2.paused && l2.paused(true), (p2 || !d2 && !g2 && l2._start === W(T2._time) && b(p2) && ze(e(l2)) && T2.data !== `nested`) && (l2._tTime = -c, l2.render(Math.max(0, -f2) || 0)), x2 && qe(e(l2), x2), l2;
    }
    var s2 = o2.prototype;
    return s2.render = function(e15, t3, n2) {
      var r3 = this._time, i2 = this._tDur, a2 = this._dur, o3 = e15 < 0, s3 = e15 > i2 - c && !o3 ? i2 : e15 < c ? 0 : e15, l2, u2, d2, f2, p2, m2, h2, g2;
      if (!a2) Ze(this, e15, t3, n2);
      else if (s3 !== this._tTime || !e15 || n2 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o3 || this._lazy) {
        if (l2 = s3, g2 = this.timeline, this._repeat) {
          if (f2 = a2 + this._rDelay, this._repeat < -1 && o3) return this.totalTime(f2 * 100 + e15, t3, n2);
          if (l2 = W(s3 % f2), s3 === i2 ? (d2 = this._repeat, l2 = a2) : (p2 = W(s3 / f2), d2 = ~~p2, d2 && d2 === p2 ? (l2 = a2, d2--) : l2 > a2 && (l2 = a2)), m2 = this._yoyo && d2 & 1, m2 && (l2 = a2 - l2), p2 = Ve(this._tTime, f2), l2 === r3 && !n2 && this._initted && d2 === p2) return this._tTime = s3, this;
          d2 !== p2 && this.vars.repeatRefresh && !m2 && !this._lock && l2 !== f2 && this._initted && (this._lock = n2 = 1, this.render(W(f2 * d2), true).invalidate()._lock = 0);
        }
        if (!this._initted) {
          if (Je(this, o3 ? e15 : l2, n2, t3, s3)) return this._tTime = 0, this;
          if (r3 !== this._time && !(n2 && this.vars.repeatRefresh && d2 !== p2)) return this;
          if (a2 !== this._dur) return this.render(e15, t3, n2);
        }
        if (this._rEase) {
          var _2 = l2 < r3;
          if (_2 !== this._inv) {
            var v2 = _2 ? r3 : a2 - r3;
            this._inv = _2, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = r3, this._invRecip = v2 ? (_2 ? -1 : 1) / v2 : 0, this._invScale = _2 ? -this.ratio : 1 - this.ratio, this._invEase = _2 ? this._rEase : this._ease;
          }
          this.ratio = h2 = this._invRatio + this._invScale * this._invEase((l2 - this._invTime) * this._invRecip);
        } else this.ratio = h2 = this._ease(l2 / a2);
        if (this._from && (this.ratio = h2 = 1 - h2), this._tTime = s3, this._time = l2, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r3 && s3 && !t3 && !p2 && (Dt(this, `onStart`), this._tTime !== s3)) return this;
        for (u2 = this._pt; u2; ) u2.r(h2, u2.d), u2 = u2._next;
        g2 && g2.render(e15 < 0 ? e15 : g2._dur * g2._ease(l2 / this._dur), t3, n2) || this._startAt && (this._zTime = e15), this._onUpdate && !t3 && (o3 && Re(this, e15, t3, n2), Dt(this, `onUpdate`)), this._repeat && d2 !== p2 && this.vars.onRepeat && !t3 && this.parent && Dt(this, `onRepeat`), (s3 === this._tDur || !s3) && this._tTime === s3 && (o3 && !this._onUpdate && Re(this, e15, true, true), (e15 || !a2) && (s3 === this._tDur && this._ts > 0 || !s3 && this._ts < 0) && Fe(this, 1), !t3 && !(o3 && !r3) && (s3 || r3 || m2) && (Dt(this, s3 === i2 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s3 < i2 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, s2.targets = function() {
      return this._targets;
    }, s2.invalidate = function(e15) {
      return (!e15 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e15), r2.prototype.invalidate.call(this, e15);
    }, s2.resetTo = function(e15, t3, n2, r3, i2) {
      Bt || Vt.wake(), this._ts || this.play();
      var a2 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o3;
      return this._initted || ln(this, a2), o3 = this._ease(a2 / this._dur), un(this, e15, t3, n2, r3, o3, a2, i2) ? this.resetTo(e15, t3, n2, r3, 1) : (We(this, 0), this.parent || Ne(this._dp, this, `_first`, `_last`, this._dp._sort ? `_start` : 0), this.render(0));
    }, s2.kill = function(e15, t3) {
      if (t3 === void 0 && (t3 = `all`), !e15 && (!t3 || t3 === `all`)) return this._lazy = this._pt = 0, this.parent ? Ot(this) : this.scrollTrigger && this.scrollTrigger.kill(!!a), this;
      if (this.timeline) {
        var n2 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(e15, t3, sn && sn.vars.overwrite !== true)._first || Ot(this), this.parent && n2 !== this.timeline.totalDuration() && $e(this, this._dur * this.timeline._tDur / n2, 0, 1), this;
      }
      var r3 = this._targets, i2 = e15 ? ut(e15) : r3, o3 = this._ptLookup, s3 = this._pt, c2, l2, u2, d2, f2, p2, m2;
      if ((!t3 || t3 === `all`) && Me(r3, i2)) return t3 === `all` && (this._pt = 0), Ot(this);
      for (c2 = this._op = this._op || [], t3 !== `all` && (h(t3) && (f2 = {}, H(t3, function(e16) {
        return f2[e16] = 1;
      }), t3 = f2), t3 = dn(r3, t3)), m2 = r3.length; m2--; ) if (~i2.indexOf(r3[m2])) for (f2 in l2 = o3[m2], t3 === `all` ? (c2[m2] = t3, d2 = l2, u2 = {}) : (u2 = c2[m2] = c2[m2] || {}, d2 = t3), d2) p2 = l2 && l2[f2], p2 && ((!(`kill` in p2.d) || p2.d.kill(f2) === true) && Pe(this, p2, `_pt`), delete l2[f2]), u2 !== `all` && (u2[f2] = 1);
      return this._initted && !this._pt && s3 && Ot(this), this;
    }, o2.to = function(e15, t3) {
      return new o2(e15, t3, arguments[2]);
    }, o2.from = function(e15, t3) {
      return rt(1, arguments);
    }, o2.delayedCall = function(e15, t3, n2, r3) {
      return new o2(t3, 0, { immediateRender: false, lazy: false, overwrite: false, delay: e15, onComplete: t3, onReverseComplete: t3, onCompleteParams: n2, onReverseCompleteParams: n2, callbackScope: r3 });
    }, o2.fromTo = function(e15, t3, n2) {
      return rt(2, arguments);
    }, o2.set = function(e15, t3) {
      return t3.duration = 0, t3.repeatDelay || (t3.repeat = 0), new o2(e15, t3);
    }, o2.killTweensOf = function(e15, t3, n2) {
      return P.killTweensOf(e15, t3, n2);
    }, o2;
  })(tn);
  Ee(Y.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }), H(`staggerTo,staggerFrom,staggerFromTo`, function(e15) {
    Y[e15] = function() {
      var t3 = new J(), n2 = st.call(arguments, 0);
      return n2.splice(e15 === `staggerFromTo` ? 5 : 4, 0, 0), t3[e15].apply(t3, n2);
    };
  });
  var gn = function(e15, t3, n2) {
    return e15[t3] = n2;
  };
  var _n = function(e15, t3, n2) {
    return e15[t3](n2);
  };
  var vn = function(e15, t3, n2, r2) {
    return e15[t3](r2.fp, n2);
  };
  var yn = function(e15, t3, n2) {
    return e15.setAttribute(t3, n2);
  };
  var bn = function(e15, t3) {
    return g(e15[t3]) ? _n : v(e15[t3]) && e15.setAttribute ? yn : gn;
  };
  var xn = function(e15, t3) {
    return t3.set(t3.t, t3.p, Math.round((t3.s + t3.c * e15) * 1e6) / 1e6, t3);
  };
  var Sn = function(e15, t3) {
    return t3.set(t3.t, t3.p, !!(t3.s + t3.c * e15), t3);
  };
  var Cn = function(e15, t3) {
    var n2 = t3._pt, r2 = ``;
    if (!e15 && t3.b) r2 = t3.b;
    else if (e15 === 1 && t3.e) r2 = t3.e;
    else {
      for (; n2; ) r2 = n2.p + (n2.m ? n2.m(n2.s + n2.c * e15) : Math.round((n2.s + n2.c * e15) * 1e4) / 1e4) + r2, n2 = n2._next;
      r2 += t3.c;
    }
    t3.set(t3.t, t3.p, r2, t3);
  };
  var wn = function(e15, t3) {
    for (var n2 = t3._pt; n2; ) n2.r(e15, n2.d), n2 = n2._next;
  };
  var Tn = function(e15, t3, n2, r2) {
    for (var i2 = this._pt, a2; i2; ) a2 = i2._next, i2.p === r2 && i2.modifier(e15, t3, n2), i2 = a2;
  };
  var En = function(e15) {
    for (var t3 = this._pt, n2, r2; t3; ) r2 = t3._next, t3.p === e15 && !t3.op || t3.op === e15 ? Pe(this, t3, `_pt`) : t3.dep || (n2 = 1), t3 = r2;
    return !n2;
  };
  var Dn = function(e15, t3, n2, r2) {
    r2.mSet(e15, t3, r2.m.call(r2.tween, n2, r2.mt), r2);
  };
  var On = function(e15) {
    for (var t3 = e15._pt, n2, r2, i2, a2; t3; ) {
      for (n2 = t3._next, r2 = i2; r2 && r2.pr > t3.pr; ) r2 = r2._next;
      (t3._prev = r2 ? r2._prev : a2) ? t3._prev._next = t3 : i2 = t3, (t3._next = r2) ? r2._prev = t3 : a2 = t3, t3 = n2;
    }
    e15._pt = i2;
  };
  var X = (function() {
    function e15(e16, t4, n2, r2, i2, a2, o2, s2, c2) {
      this.t = t4, this.s = r2, this.c = i2, this.p = n2, this.r = a2 || xn, this.d = o2 || this, this.set = s2 || gn, this.pr = c2 || 0, this._next = e16, e16 && (e16._prev = this);
    }
    var t3 = e15.prototype;
    return t3.modifier = function(e16, t4, n2) {
      this.mSet = this.mSet || this.set, this.set = Dn, this.m = e16, this.mt = n2, this.tween = t4;
    }, e15;
  })();
  H(he + `parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`, function(e15) {
    return ce[e15] = 1;
  }), R.TweenMax = R.TweenLite = Y, R.TimelineLite = R.TimelineMax = J, P = new J({ sortChildren: false, defaults: r, autoRemoveChildren: true, id: `root`, smoothChildTiming: true }), n.stringFilter = zt;
  var kn = [];
  var An = {};
  var jn = [];
  var Mn = 0;
  var Nn = 0;
  var Pn = function(e15) {
    return (An[e15] || jn).map(function(e16) {
      return e16();
    });
  };
  var Fn = function() {
    var e15 = Date.now(), t3 = [];
    e15 - Mn > 2 && (Pn(`matchMediaInit`), kn.forEach(function(e16) {
      var n2 = e16.queries, r2 = e16.conditions, i2, a2, o2, s2;
      for (a2 in n2) i2 = F.matchMedia(n2[a2]).matches, i2 && (o2 = 1), i2 !== r2[a2] && (r2[a2] = i2, s2 = 1);
      s2 && (e16.revert(), o2 && t3.push(e16));
    }), Pn(`matchMediaRevert`), t3.forEach(function(e16) {
      return e16.onMatch(e16, function(t4) {
        return e16.add(null, t4);
      });
    }), Mn = e15, Pn(`matchMedia`));
  };
  var In = (function() {
    function e15(e16, t4) {
      this.selector = t4 && dt(t4), this.data = [], this._r = [], this.isReverted = false, this.id = Nn++, e16 && this.add(e16);
    }
    var t3 = e15.prototype;
    return t3.add = function(e16, t4, n2) {
      g(e16) && (n2 = t4, t4 = e16, e16 = g);
      var r2 = this, i2 = function() {
        var e17 = o, i3 = r2.selector, a2;
        return e17 && e17 !== r2 && e17.data.push(r2), n2 && (r2.selector = dt(n2)), o = r2, a2 = t4.apply(r2, arguments), g(a2) && r2._r.push(a2), o = e17, r2.selector = i3, r2.isReverted = false, a2;
      };
      return r2.last = i2, e16 === g ? i2(r2, function(e17) {
        return r2.add(null, e17);
      }) : e16 ? r2[e16] = i2 : i2;
    }, t3.ignore = function(e16) {
      var t4 = o;
      o = null, e16(this), o = t4;
    }, t3.getTweens = function() {
      var t4 = [];
      return this.data.forEach(function(n2) {
        return n2 instanceof e15 ? t4.push.apply(t4, n2.getTweens()) : n2 instanceof Y && !(n2.parent && n2.parent.data === `nested`) && t4.push(n2);
      }), t4;
    }, t3.clear = function() {
      this._r.length = this.data.length = 0;
    }, t3.kill = function(e16, t4) {
      var n2 = this;
      if (e16 ? (function() {
        for (var t5 = n2.getTweens(), r3 = n2.data.length, i2; r3--; ) i2 = n2.data[r3], i2.data === `isFlip` && (i2.revert(), i2.getChildren(true, true, false).forEach(function(e17) {
          return t5.splice(t5.indexOf(e17), 1);
        }));
        for (t5.map(function(e17) {
          return { g: e17._dur || e17._delay || e17._sat && !e17._sat.vars.immediateRender ? e17.globalTime(0) : -1 / 0, t: e17 };
        }).sort(function(e17, t6) {
          return t6.g - e17.g || -1 / 0;
        }).forEach(function(t6) {
          return t6.t.revert(e16);
        }), r3 = n2.data.length; r3--; ) i2 = n2.data[r3], i2 instanceof J ? i2.data !== `nested` && (i2.scrollTrigger && i2.scrollTrigger.revert(), i2.kill()) : !(i2 instanceof Y) && i2.revert && i2.revert(e16);
        n2._r.forEach(function(t6) {
          return t6(e16, n2);
        }), n2.isReverted = true;
      })() : this.data.forEach(function(e17) {
        return e17.kill && e17.kill();
      }), this.clear(), t4) for (var r2 = kn.length; r2--; ) kn[r2].id === this.id && kn.splice(r2, 1);
    }, t3.revert = function(e16) {
      this.kill(e16 || {});
    }, e15;
  })();
  var Ln = (function() {
    function e15(e16) {
      this.contexts = [], this.scope = e16, o && o.data.push(this);
    }
    var t3 = e15.prototype;
    return t3.add = function(e16, t4, n2) {
      y(e16) || (e16 = { matches: e16 });
      var r2 = new In(0, n2 || this.scope), i2 = r2.conditions = {}, a2, s2, c2;
      for (s2 in o && !r2.selector && (r2.selector = o.selector), this.contexts.push(r2), t4 = r2.add(`onMatch`, t4), r2.queries = e16, e16) s2 === `all` ? c2 = 1 : (a2 = F.matchMedia(e16[s2]), a2 && (kn.indexOf(r2) < 0 && kn.push(r2), (i2[s2] = a2.matches) && (c2 = 1), a2.addListener ? a2.addListener(Fn) : a2.addEventListener(`change`, Fn)));
      return c2 && t4(r2, function(e17) {
        return r2.add(null, e17);
      }), this;
    }, t3.revert = function(e16) {
      this.kill(e16 || {});
    }, t3.kill = function(e16) {
      this.contexts.forEach(function(t4) {
        return t4.kill(e16, true);
      });
    }, e15;
  })();
  var Rn = { registerPlugin: function() {
    [...arguments].forEach(function(e15) {
      return jt(e15);
    });
  }, timeline: function(e15) {
    return new J(e15);
  }, getTweensOf: function(e15, t3) {
    return P.getTweensOf(e15, t3);
  }, getProperty: function(e15, t3, n2, r2) {
    h(e15) && (e15 = ut(e15)[0]);
    var i2 = _e(e15 || {}).get, a2 = n2 ? Te : we;
    return n2 === `native` && (n2 = ``), e15 && (t3 ? a2((V[t3] && V[t3].get || i2)(e15, t3, n2, r2)) : function(t4, n3, r3) {
      return a2((V[t4] && V[t4].get || i2)(e15, t4, n3, r3));
    });
  }, quickSetter: function(e15, t3, n2) {
    if (e15 = ut(e15), e15.length > 1) {
      var r2 = e15.map(function(e16) {
        return Z.quickSetter(e16, t3, n2);
      }), i2 = r2.length;
      return function(e16) {
        for (var t4 = i2; t4--; ) r2[t4](e16);
      };
    }
    e15 = e15[0] || {};
    var a2 = V[t3], o2 = _e(e15), s2 = o2.harness && (o2.harness.aliases || {})[t3] || t3, c2 = a2 ? function(t4) {
      var r3 = new a2();
      kt._pt = 0, r3.init(e15, n2 ? t4 + n2 : t4, kt, 0, [e15]), r3.render(1, r3), kt._pt && wn(1, kt);
    } : o2.set(e15, s2);
    return a2 ? c2 : function(t4) {
      return c2(e15, s2, n2 ? t4 + n2 : t4, o2, 1);
    };
  }, quickTo: function(e15, t3, n2) {
    var r2, i2 = Z.to(e15, Ee((r2 = {}, r2[t3] = `+=0.1`, r2.paused = true, r2.stagger = 0, r2), n2 || {})), a2 = function(e16, n3, r3) {
      return i2.resetTo(t3, e16, n3, r3);
    };
    return a2.tween = i2, a2;
  }, isTweening: function(e15) {
    return P.getTweensOf(e15, true).length > 0;
  }, defaults: function(e15) {
    return e15 && e15.ease && (e15.ease = Yt(e15.ease, r.ease)), ke(r, e15 || {});
  }, config: function(e15) {
    return ke(n, e15 || {});
  }, registerEffect: function(e15) {
    var t3 = e15.name, n2 = e15.effect, r2 = e15.plugins, i2 = e15.defaults, a2 = e15.extendTimeline;
    (r2 || ``).split(`,`).forEach(function(e16) {
      return e16 && !V[e16] && !R[e16] && ne(t3 + ` effect requires ` + e16 + ` plugin.`);
    }), fe[t3] = function(e16, t4, r3) {
      return n2(ut(e16), Ee(t4 || {}, i2), r3);
    }, a2 && (J.prototype[t3] = function(e16, n3, r3) {
      return this.add(fe[t3](e16, y(n3) ? n3 : (r3 = n3) && {}, this), r3);
    });
  }, registerEase: function(e15, t3) {
    q[e15] = Yt(t3);
  }, parseEase: function(e15, t3) {
    return arguments.length ? Yt(e15, t3) : q;
  }, getById: function(e15) {
    return P.getById(e15);
  }, exportRoot: function(e15, t3) {
    e15 === void 0 && (e15 = {});
    var n2 = new J(e15), r2, i2;
    for (n2.smoothChildTiming = b(e15.smoothChildTiming), P.remove(n2), n2._dp = 0, n2._time = n2._tTime = P._time, r2 = P._first; r2; ) i2 = r2._next, (t3 || !(!r2._dur && r2 instanceof Y && r2.vars.onComplete === r2._targets[0])) && Ke(n2, r2, r2._start - r2._delay), r2 = i2;
    return Ke(P, n2, 0), n2;
  }, context: function(e15, t3) {
    return e15 ? new In(e15, t3) : o;
  }, matchMedia: function(e15) {
    return new Ln(e15);
  }, matchMediaRefresh: function() {
    return kn.forEach(function(e15) {
      var t3 = e15.conditions, n2, r2;
      for (r2 in t3) t3[r2] && (t3[r2] = false, n2 = 1);
      n2 && e15.revert();
    }) || Fn();
  }, addEventListener: function(e15, t3) {
    var n2 = An[e15] || (An[e15] = []);
    ~n2.indexOf(t3) || n2.push(t3);
  }, removeEventListener: function(e15, t3) {
    var n2 = An[e15], r2 = n2 && n2.indexOf(t3);
    r2 >= 0 && n2.splice(r2, 1);
  }, utils: { wrap: xt, wrapYoyo: St, distribute: pt, random: gt, snap: ht, normalize: yt, getUnit: G, clamp: ot, splitColor: Pt, toArray: ut, selector: dt, mapRange: wt, pipe: _t, unitize: vt, interpolate: Tt, shuffle: ft }, install: ee, effects: fe, ticker: Vt, updateRoot: J.updateRoot, plugins: V, globalTimeline: P, core: { PropTween: X, globals: re, Tween: Y, Timeline: J, Animation: tn, getCache: _e, _removeLinkedListItem: Pe, reverting: function() {
    return a;
  }, context: function(e15) {
    return e15 && o && (o.data.push(e15), e15._ctx = o), o;
  }, suppressOverwrites: function(e15) {
    return i = e15;
  } } };
  H(`to,from,fromTo,delayedCall,set,killTweensOf`, function(e15) {
    return Rn[e15] = Y[e15];
  }), Vt.add(J.updateRoot), kt = Rn.to({}, { duration: 0 });
  var zn = function(e15, t3) {
    for (var n2 = e15._pt; n2 && n2.p !== t3 && n2.op !== t3 && n2.fp !== t3; ) n2 = n2._next;
    return n2;
  };
  var Bn = function(e15, t3) {
    var n2 = e15._targets, r2, i2, a2;
    for (r2 in t3) for (i2 = n2.length; i2--; ) a2 = e15._ptLookup[i2][r2], a2 && (a2 = a2.d) && (a2._pt && (a2 = zn(a2, r2)), a2 && a2.modifier && a2.modifier(t3[r2], e15, n2[i2], r2));
  };
  var Vn = function(e15, t3) {
    return { name: e15, headless: 1, rawVars: 1, init: function(e16, n2, r2) {
      r2._onInit = function(e17) {
        var r3, i2;
        if (h(n2) && (r3 = {}, H(n2, function(e18) {
          return r3[e18] = 1;
        }), n2 = r3), t3) {
          for (i2 in r3 = {}, n2) r3[i2] = t3(n2[i2]);
          n2 = r3;
        }
        Bn(e17, n2);
      };
    } };
  };
  var Z = Rn.registerPlugin({ name: `attr`, init: function(e15, t3, n2, r2, i2) {
    var a2, o2, s2;
    for (a2 in this.tween = n2, t3) s2 = e15.getAttribute(a2) || ``, o2 = this.add(e15, `setAttribute`, (s2 || 0) + ``, t3[a2], r2, i2, 0, 0, a2), o2.op = a2, o2.b = s2, this._props.push(a2);
  }, render: function(e15, t3) {
    for (var n2 = t3._pt; n2; ) a ? n2.set(n2.t, n2.p, n2.b, n2) : n2.r(e15, n2.d), n2 = n2._next;
  } }, { name: `endArray`, headless: 1, init: function(e15, t3) {
    for (var n2 = t3.length; n2--; ) this.add(e15, n2, e15[n2] || 0, t3[n2], 0, 0, 0, 0, 0, 1);
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
  var ar = function(e15, t3) {
    return t3.set(t3.t, t3.p, Math.round((t3.s + t3.c * e15) * 1e4) / 1e4 + t3.u, t3);
  };
  var or = function(e15, t3) {
    return t3.set(t3.t, t3.p, e15 === 1 ? t3.e : Math.round((t3.s + t3.c * e15) * 1e4) / 1e4 + t3.u, t3);
  };
  var sr = function(e15, t3) {
    return t3.set(t3.t, t3.p, e15 ? Math.round((t3.s + t3.c * e15) * 1e4) / 1e4 + t3.u : t3.b, t3);
  };
  var cr = function(e15, t3) {
    return t3.set(t3.t, t3.p, e15 === 1 ? t3.e : e15 ? Math.round((t3.s + t3.c * e15) * 1e4) / 1e4 + t3.u : t3.b, t3);
  };
  var lr = function(e15, t3) {
    var n2 = t3.s + t3.c * e15;
    t3.set(t3.t, t3.p, ~~(n2 + (n2 < 0 ? -0.5 : 0.5)) + t3.u, t3);
  };
  var ur = function(e15, t3) {
    return t3.set(t3.t, t3.p, e15 ? t3.e : t3.b, t3);
  };
  var dr = function(e15, t3) {
    return t3.set(t3.t, t3.p, e15 === 1 ? t3.e : t3.b, t3);
  };
  var fr = function(e15, t3, n2) {
    return e15.style[t3] = n2;
  };
  var pr = function(e15, t3, n2) {
    return e15.style.setProperty(t3, n2);
  };
  var mr = function(e15, t3, n2) {
    return e15._gsap[t3] = n2;
  };
  var hr = function(e15, t3, n2) {
    return e15._gsap.scaleX = e15._gsap.scaleY = n2;
  };
  var gr = function(e15, t3, n2, r2, i2) {
    var a2 = e15._gsap;
    a2.scaleX = a2.scaleY = n2, a2.renderTransform(i2, a2);
  };
  var _r = function(e15, t3, n2, r2, i2) {
    var a2 = e15._gsap;
    a2[t3] = n2, a2.renderTransform(i2, a2);
  };
  var Q = `transform`;
  var $ = Q + `Origin`;
  var vr = function e12(t3, n2) {
    var r2 = this, i2 = this.target, a2 = i2.style, o2 = i2._gsap;
    if (t3 in Xn && a2) {
      if (this.tfm = this.tfm || {}, t3 !== `transform`) t3 = ir[t3] || t3, ~t3.indexOf(`,`) ? t3.split(`,`).forEach(function(e15) {
        return r2.tfm[e15] = Lr(i2, e15);
      }) : this.tfm[t3] = o2.x ? o2[t3] : Lr(i2, t3), t3 === $ && (this.tfm.zOrigin = o2.zOrigin);
      else return ir.transform.split(`,`).forEach(function(t4) {
        return e12.call(r2, t4, n2);
      });
      if (this.props.indexOf(Q) >= 0) return;
      o2.svg && (this.svgo = i2.getAttribute(`data-svg-origin`), this.props.push($, n2, ``)), t3 = Q;
    }
    (a2 || n2) && this.props.push(t3, n2, a2[t3]);
  };
  var yr = function(e15) {
    e15.translate && (e15.removeProperty(`translate`), e15.removeProperty(`scale`), e15.removeProperty(`rotate`));
  };
  var br = function() {
    var e15 = this.props, t3 = this.target, n2 = t3.style, r2 = t3._gsap, i2, a2;
    for (i2 = 0; i2 < e15.length; i2 += 3) e15[i2 + 1] ? e15[i2 + 1] === 2 ? t3[e15[i2]](e15[i2 + 2]) : t3[e15[i2]] = e15[i2 + 2] : e15[i2 + 2] ? n2[e15[i2]] = e15[i2 + 2] : n2.removeProperty(e15[i2].substr(0, 2) === `--` ? e15[i2] : e15[i2].replace(tr, `-$1`).toLowerCase());
    if (this.tfm) {
      for (a2 in this.tfm) r2[a2] = this.tfm[a2];
      r2.svg && (r2.renderTransform(), t3.setAttribute(`data-svg-origin`, this.svgo || ``)), i2 = Jn(), (!i2 || !i2.isStart) && !n2[Q] && (yr(n2), r2.zOrigin && n2[$] && (n2[$] += ` ` + r2.zOrigin + `px`, r2.zOrigin = 0, r2.renderTransform()), r2.uncache = 1);
    }
  };
  var xr = function(e15, t3) {
    var n2 = { target: e15, props: [], revert: br, save: vr };
    return e15._gsap || Z.core.getCache(e15), t3 && e15.style && e15.nodeType && t3.split(`,`).forEach(function(e16) {
      return n2.save(e16);
    }), n2;
  };
  var Sr;
  var Cr = function(e15, t3) {
    var n2 = Un.createElementNS ? Un.createElementNS((t3 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e15) : Un.createElement(e15);
    return n2 && n2.style ? n2 : Un.createElement(e15);
  };
  var wr = function e13(t3, n2, r2) {
    var i2 = getComputedStyle(t3);
    return i2[n2] || i2.getPropertyValue(n2.replace(tr, `-$1`).toLowerCase()) || i2.getPropertyValue(n2) || !r2 && e13(t3, Er(n2) || n2, 1) || ``;
  };
  var Tr = `O,Moz,ms,Ms,Webkit`.split(`,`);
  var Er = function(e15, t3, n2) {
    var r2 = (t3 || Kn).style, i2 = 5;
    if (e15 in r2 && !n2) return e15;
    for (e15 = e15.charAt(0).toUpperCase() + e15.substr(1); i2-- && !(Tr[i2] + e15 in r2); ) ;
    return i2 < 0 ? null : (i2 === 3 ? `ms` : i2 >= 0 ? Tr[i2] : ``) + e15;
  };
  var Dr = function() {
    Yn() && window.document && (Hn = window, Un = Hn.document, Wn = Un.documentElement, Kn = Cr(`div`) || { style: {} }, Cr(`div`), Q = Er(Q), $ = Q + `Origin`, Kn.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`, Sr = !!Er(`perspective`), Jn = Z.core.reverting, Gn = 1);
  };
  var Or = function(e15) {
    var t3 = e15.ownerSVGElement, n2 = Cr(`svg`, t3 && t3.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg`), r2 = e15.cloneNode(true), i2;
    r2.style.display = `block`, n2.appendChild(r2), Wn.appendChild(n2);
    try {
      i2 = r2.getBBox();
    } catch {
    }
    return n2.removeChild(r2), Wn.removeChild(n2), i2;
  };
  var kr = function(e15, t3) {
    for (var n2 = t3.length; n2--; ) if (e15.hasAttribute(t3[n2])) return e15.getAttribute(t3[n2]);
  };
  var Ar = function(e15) {
    var t3, n2;
    try {
      t3 = e15.getBBox();
    } catch {
      t3 = Or(e15), n2 = 1;
    }
    return t3 && (t3.width || t3.height) || n2 || (t3 = Or(e15)), t3 && !t3.width && !t3.x && !t3.y ? { x: +kr(e15, [`x`, `cx`, `x1`]) || 0, y: +kr(e15, [`y`, `cy`, `y1`]) || 0, width: 0, height: 0 } : t3;
  };
  var jr = function(e15) {
    return !!(e15.getCTM && (!e15.parentNode || e15.ownerSVGElement) && Ar(e15));
  };
  var Mr = function(e15, t3) {
    if (t3) {
      var n2 = e15.style, r2;
      t3 in Xn && t3 !== $ && (t3 = Q), n2.removeProperty ? (r2 = t3.substr(0, 2), (r2 === `ms` || t3.substr(0, 6) === `webkit`) && (t3 = `-` + t3), n2.removeProperty(r2 === `--` ? t3 : t3.replace(tr, `-$1`).toLowerCase())) : n2.removeAttribute(t3);
    }
  };
  var Nr = function(e15, t3, n2, r2, i2, a2) {
    var o2 = new X(e15._pt, t3, n2, 0, 1, a2 ? dr : ur);
    return e15._pt = o2, o2.b = r2, o2.e = i2, e15._props.push(n2), o2;
  };
  var Pr = { deg: 1, rad: 1, turn: 1 };
  var Fr = { grid: 1, flex: 1 };
  var Ir = function e14(t3, n2, r2, i2) {
    var a2 = parseFloat(r2) || 0, o2 = (r2 + ``).trim().substr((a2 + ``).length) || `px`, s2 = Kn.style, c2 = nr.test(n2), l2 = t3.tagName.toLowerCase() === `svg`, u2 = (l2 ? `client` : `offset`) + (c2 ? `Width` : `Height`), d2 = 100, f2 = i2 === `px`, p2 = i2 === `%`, m2, h2, g2, _2;
    if (i2 === o2 || !a2 || Pr[i2] || Pr[o2]) return a2;
    if (o2 !== `px` && !f2 && (a2 = e14(t3, n2, r2, `px`)), _2 = t3.getCTM && jr(t3), (p2 || o2 === `%`) && (Xn[n2] || ~n2.indexOf(`adius`))) return m2 = _2 ? t3.getBBox()[c2 ? `width` : `height`] : t3[u2], U(p2 ? a2 / m2 * d2 : a2 / 100 * m2);
    if (s2[c2 ? `width` : `height`] = d2 + (f2 ? o2 : i2), h2 = i2 !== `rem` && ~n2.indexOf(`adius`) || i2 === `em` && t3.appendChild && !l2 ? t3 : t3.parentNode, _2 && (h2 = (t3.ownerSVGElement || {}).parentNode), (!h2 || h2 === Un || !h2.appendChild) && (h2 = Un.body), g2 = h2._gsap, g2 && p2 && g2.width && c2 && g2.time === Vt.time && !g2.uncache) return U(a2 / g2.width * d2);
    if (p2 && (n2 === `height` || n2 === `width`)) {
      var v2 = t3.style[n2];
      t3.style[n2] = d2 + i2, m2 = t3[u2], v2 ? t3.style[n2] = v2 : Mr(t3, n2);
    } else (p2 || o2 === `%`) && !Fr[wr(h2, `display`)] && (s2.position = wr(t3, `position`)), h2 === t3 && (s2.position = `static`), h2.appendChild(Kn), m2 = Kn[u2], h2.removeChild(Kn), s2.position = `absolute`;
    return c2 && p2 && (g2 = _e(h2), g2.time = Vt.time, g2.width = h2[u2]), U(f2 ? m2 * a2 / d2 : m2 && a2 ? d2 / m2 * a2 : 0);
  };
  var Lr = function(e15, t3, n2, r2) {
    var i2;
    return Gn || Dr(), t3 in ir && t3 !== `transform` && (t3 = ir[t3], ~t3.indexOf(`,`) && (t3 = t3.split(`,`)[0])), Xn[t3] && t3 !== `transform` ? (i2 = Yr(e15, r2), i2 = t3 === `transformOrigin` ? i2.svg ? i2.origin : Xr(wr(e15, $)) + ` ` + i2.zOrigin + `px` : i2[t3]) : (i2 = e15.style[t3], (!i2 || i2 === `auto` || r2 || ~(i2 + ``).indexOf(`calc(`)) && (i2 = Hr[t3] && Hr[t3](e15, t3, n2) || wr(e15, t3) || ve(e15, t3) || +(t3 === `opacity`))), n2 && !~(i2 + ``).trim().indexOf(` `) ? Ir(e15, t3, i2, n2) + n2 : i2;
  };
  var Rr = function(e15, t3, r2, i2) {
    if (!r2 || r2 === `none`) {
      var a2 = Er(t3, e15, 1), o2 = a2 && wr(e15, a2, 1);
      o2 && o2 !== r2 ? (t3 = a2, r2 = o2) : t3 === `borderColor` && (r2 = wr(e15, `borderTopColor`));
    }
    var s2 = new X(this._pt, e15.style, t3, 0, 1, Cn), c2 = 0, l2 = 0, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2;
    if (s2.b = r2, s2.e = i2, r2 += ``, i2 += ``, i2.substring(0, 6) === `var(--` && (i2 = wr(e15, i2.substring(4, i2.indexOf(`)`)))), i2 === `auto` && (h2 = e15.style[t3], e15.style[t3] = i2, i2 = wr(e15, t3) || i2, h2 ? e15.style[t3] = h2 : Mr(e15, t3)), u2 = [r2, i2], zt(u2), r2 = u2[0], i2 = u2[1], f2 = r2.match(k) || [], x2 = i2.match(k) || [], x2.length) {
      for (; d2 = k.exec(i2); ) g2 = d2[0], v2 = i2.substring(c2, d2.index), m2 ? m2 = (m2 + 1) % 5 : (v2.substr(-5) === `rgba(` || v2.substr(-5) === `hsla(`) && (m2 = 1), g2 !== (h2 = f2[l2++] || ``) && (p2 = parseFloat(h2) || 0, b2 = h2.substr((p2 + ``).length), g2.charAt(1) === `=` && (g2 = ye(p2, g2) + b2), _2 = parseFloat(g2), y2 = g2.substr((_2 + ``).length), c2 = k.lastIndex - y2.length, y2 || (y2 = y2 || n.units[t3] || b2, c2 === i2.length && (i2 += y2, s2.e += y2)), b2 !== y2 && (p2 = Ir(e15, t3, h2, y2) || 0), s2._pt = { _next: s2._pt, p: v2 || l2 === 1 ? v2 : `,`, s: p2, c: _2 - p2, m: m2 && m2 < 4 || t3 === `zIndex` ? Math.round : 0 });
      s2.c = c2 < i2.length ? i2.substring(c2, i2.length) : ``;
    } else s2.r = t3 === `display` && i2 === `none` ? dr : ur;
    return j.test(i2) && (s2.e = 0), this._pt = s2, s2;
  };
  var zr = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` };
  var Br = function(e15) {
    var t3 = e15.split(` `), n2 = t3[0], r2 = t3[1] || `50%`;
    return (n2 === `top` || n2 === `bottom` || r2 === `left` || r2 === `right`) && (e15 = n2, n2 = r2, r2 = e15), t3[0] = zr[n2] || n2, t3[1] = zr[r2] || r2, t3.join(` `);
  };
  var Vr = function(e15, t3) {
    if (t3.tween && t3.tween._time === t3.tween._dur) {
      var n2 = t3.t, r2 = n2.style, i2 = t3.u, a2 = n2._gsap, o2, s2, c2;
      if (i2 === `all` || i2 === true) r2.cssText = ``, s2 = 1;
      else for (i2 = i2.split(`,`), c2 = i2.length; --c2 > -1; ) o2 = i2[c2], Xn[o2] && (s2 = 1, o2 = o2 === `transformOrigin` ? $ : Q), Mr(n2, o2);
      s2 && (Mr(n2, Q), a2 && (a2.svg && n2.removeAttribute(`transform`), r2.scale = r2.rotate = r2.translate = `none`, Yr(n2, 1), a2.uncache = 1, yr(r2)));
    }
  };
  var Hr = { clearProps: function(e15, t3, n2, r2, i2) {
    if (i2.data !== `isFromStart`) {
      var a2 = e15._pt = new X(e15._pt, t3, n2, 0, 0, Vr);
      return a2.u = r2, a2.pr = -10, a2.tween = i2, e15._props.push(n2), 1;
    }
  } };
  var Ur = [1, 0, 0, 1, 0, 0];
  var Wr = {};
  var Gr = function(e15) {
    return e15 === `matrix(1, 0, 0, 1, 0, 0)` || e15 === `none` || !e15;
  };
  var Kr = function(e15) {
    var t3 = wr(e15, Q);
    return Gr(t3) ? Ur : t3.substr(7).match(O).map(U);
  };
  var qr = function(e15, t3) {
    var n2 = e15._gsap || _e(e15), r2 = e15.style, i2 = Kr(e15), a2, o2, s2, c2;
    return n2.svg && e15.getAttribute(`transform`) ? (s2 = e15.transform.baseVal.consolidate().matrix, i2 = [s2.a, s2.b, s2.c, s2.d, s2.e, s2.f], i2.join(`,`) === `1,0,0,1,0,0` ? Ur : i2) : (i2 === Ur && !e15.offsetParent && e15 !== Wn && !n2.svg && (s2 = r2.display, r2.display = `block`, a2 = e15.parentNode, (!a2 || !e15.offsetParent && !e15.getBoundingClientRect().width) && (c2 = 1, o2 = e15.nextElementSibling, Wn.appendChild(e15)), i2 = Kr(e15), s2 ? r2.display = s2 : Mr(e15, `display`), c2 && (o2 ? a2.insertBefore(e15, o2) : a2 ? a2.appendChild(e15) : Wn.removeChild(e15))), t3 && i2.length > 6 ? [i2[0], i2[1], i2[4], i2[5], i2[12], i2[13]] : i2);
  };
  var Jr = function(e15, t3, n2, r2, i2, a2) {
    var o2 = e15._gsap, s2 = i2 || qr(e15, true), c2 = o2.xOrigin || 0, l2 = o2.yOrigin || 0, u2 = o2.xOffset || 0, d2 = o2.yOffset || 0, f2 = s2[0], p2 = s2[1], m2 = s2[2], h2 = s2[3], g2 = s2[4], _2 = s2[5], v2 = t3.split(` `), y2 = parseFloat(v2[0]) || 0, b2 = parseFloat(v2[1]) || 0, x2, S2, C2, w2;
    n2 ? s2 !== Ur && (S2 = f2 * h2 - p2 * m2) && (C2 = h2 / S2 * y2 + b2 * (-m2 / S2) + (m2 * _2 - h2 * g2) / S2, w2 = y2 * (-p2 / S2) + f2 / S2 * b2 - (f2 * _2 - p2 * g2) / S2, y2 = C2, b2 = w2) : (x2 = Ar(e15), y2 = x2.x + (~v2[0].indexOf(`%`) ? y2 / 100 * x2.width : y2), b2 = x2.y + (~(v2[1] || v2[0]).indexOf(`%`) ? b2 / 100 * x2.height : b2)), r2 || r2 !== false && o2.smooth ? (g2 = y2 - c2, _2 = b2 - l2, o2.xOffset = u2 + (g2 * f2 + _2 * m2) - g2, o2.yOffset = d2 + (g2 * p2 + _2 * h2) - _2) : o2.xOffset = o2.yOffset = 0, o2.xOrigin = y2, o2.yOrigin = b2, o2.smooth = !!r2, o2.origin = t3, o2.originIsAbsolute = !!n2, e15.style[$] = `0px 0px`, a2 && (Nr(a2, o2, `xOrigin`, c2, y2), Nr(a2, o2, `yOrigin`, l2, b2), Nr(a2, o2, `xOffset`, u2, o2.xOffset), Nr(a2, o2, `yOffset`, d2, o2.yOffset)), e15.setAttribute(`data-svg-origin`, y2 + ` ` + b2);
  };
  var Yr = function(e15, t3) {
    var r2 = e15._gsap || new en(e15);
    if (`x` in r2 && !t3 && !r2.uncache) return r2;
    var i2 = e15.style, a2 = r2.scaleX < 0, o2 = `px`, s2 = `deg`, c2 = getComputedStyle(e15), l2 = wr(e15, $) || `0`, u2 = d2 = f2 = h2 = g2 = _2 = v2 = y2 = b2 = 0, d2, f2, p2 = m2 = 1, m2, h2, g2, _2, v2, y2, b2, x2, S2, C2, w2, T2, E2, D2, O2, k2, A2, j2, M2, N2, P2, F2, I2, L2, R2, z2, B2, ee2;
    return r2.svg = !!(e15.getCTM && jr(e15)), c2.translate && ((c2.translate !== `none` || c2.scale !== `none` || c2.rotate !== `none`) && (i2[Q] = (c2.translate === `none` ? `` : `translate3d(` + (c2.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) + `) `) + (c2.rotate === `none` ? `` : `rotate(` + c2.rotate + `) `) + (c2.scale === `none` ? `` : `scale(` + c2.scale.split(` `).join(`,`) + `) `) + (c2[Q] === `none` ? `` : c2[Q])), i2.scale = i2.rotate = i2.translate = `none`), C2 = qr(e15, r2.svg), r2.svg && (r2.uncache ? (P2 = e15.getBBox(), l2 = r2.xOrigin - P2.x + `px ` + (r2.yOrigin - P2.y) + `px`, N2 = ``) : N2 = !t3 && e15.getAttribute(`data-svg-origin`), Jr(e15, N2 || l2, !!N2 || r2.originIsAbsolute, r2.smooth !== false, C2)), x2 = r2.xOrigin || 0, S2 = r2.yOrigin || 0, C2 !== Ur && (D2 = C2[0], O2 = C2[1], k2 = C2[2], A2 = C2[3], u2 = j2 = C2[4], d2 = M2 = C2[5], C2.length === 6 ? (p2 = Math.sqrt(D2 * D2 + O2 * O2), m2 = Math.sqrt(A2 * A2 + k2 * k2), h2 = D2 || O2 ? $n(O2, D2) * Zn : 0, v2 = k2 || A2 ? $n(k2, A2) * Zn + h2 : 0, v2 && (m2 *= Math.abs(Math.cos(v2 * Qn))), r2.svg && (u2 -= x2 - (x2 * D2 + S2 * k2), d2 -= S2 - (x2 * O2 + S2 * A2))) : (ee2 = C2[6], z2 = C2[7], I2 = C2[8], L2 = C2[9], R2 = C2[10], B2 = C2[11], u2 = C2[12], d2 = C2[13], f2 = C2[14], w2 = $n(ee2, R2), g2 = w2 * Zn, w2 && (T2 = Math.cos(-w2), E2 = Math.sin(-w2), N2 = j2 * T2 + I2 * E2, P2 = M2 * T2 + L2 * E2, F2 = ee2 * T2 + R2 * E2, I2 = j2 * -E2 + I2 * T2, L2 = M2 * -E2 + L2 * T2, R2 = ee2 * -E2 + R2 * T2, B2 = z2 * -E2 + B2 * T2, j2 = N2, M2 = P2, ee2 = F2), w2 = $n(-k2, R2), _2 = w2 * Zn, w2 && (T2 = Math.cos(-w2), E2 = Math.sin(-w2), N2 = D2 * T2 - I2 * E2, P2 = O2 * T2 - L2 * E2, F2 = k2 * T2 - R2 * E2, B2 = A2 * E2 + B2 * T2, D2 = N2, O2 = P2, k2 = F2), w2 = $n(O2, D2), h2 = w2 * Zn, w2 && (T2 = Math.cos(w2), E2 = Math.sin(w2), N2 = D2 * T2 + O2 * E2, P2 = j2 * T2 + M2 * E2, O2 = O2 * T2 - D2 * E2, M2 = M2 * T2 - j2 * E2, D2 = N2, j2 = P2), g2 && Math.abs(g2) + Math.abs(h2) > 359.9 && (g2 = h2 = 0, _2 = 180 - _2), p2 = U(Math.sqrt(D2 * D2 + O2 * O2 + k2 * k2)), m2 = U(Math.sqrt(M2 * M2 + ee2 * ee2)), w2 = $n(j2, M2), v2 = Math.abs(w2) > 2e-4 ? w2 * Zn : 0, b2 = B2 ? 1 / (B2 < 0 ? -B2 : B2) : 0), r2.svg && (N2 = e15.getAttribute(`transform`), r2.forceCSS = e15.setAttribute(`transform`, ``) || !Gr(wr(e15, Q)), N2 && e15.setAttribute(`transform`, N2))), Math.abs(v2) > 90 && Math.abs(v2) < 270 && (a2 ? (p2 *= -1, v2 += h2 <= 0 ? 180 : -180, h2 += h2 <= 0 ? 180 : -180) : (m2 *= -1, v2 += v2 <= 0 ? 180 : -180)), t3 || (t3 = r2.uncache), r2.x = u2 - ((r2.xPercent = u2 && (!t3 && r2.xPercent || (Math.round(e15.offsetWidth / 2) === Math.round(-u2) ? -50 : 0))) ? e15.offsetWidth * r2.xPercent / 100 : 0) + o2, r2.y = d2 - ((r2.yPercent = d2 && (!t3 && r2.yPercent || (Math.round(e15.offsetHeight / 2) === Math.round(-d2) ? -50 : 0))) ? e15.offsetHeight * r2.yPercent / 100 : 0) + o2, r2.z = f2 + o2, r2.scaleX = U(p2), r2.scaleY = U(m2), r2.rotation = U(h2) + s2, r2.rotationX = U(g2) + s2, r2.rotationY = U(_2) + s2, r2.skewX = v2 + s2, r2.skewY = y2 + s2, r2.transformPerspective = b2 + o2, (r2.zOrigin = parseFloat(l2.split(` `)[2]) || !t3 && r2.zOrigin || 0) && (i2[$] = Xr(l2)), r2.xOffset = r2.yOffset = 0, r2.force3D = n.force3D, r2.renderTransform = r2.svg ? ri : Sr ? ni : Qr, r2.uncache = 0, r2;
  };
  var Xr = function(e15) {
    return (e15 = e15.split(` `))[0] + ` ` + e15[1];
  };
  var Zr = function(e15, t3, n2) {
    var r2 = G(t3);
    return U(parseFloat(t3) + parseFloat(Ir(e15, `x`, n2 + `px`, r2))) + r2;
  };
  var Qr = function(e15, t3) {
    t3.z = `0px`, t3.rotationY = t3.rotationX = `0deg`, t3.force3D = 0, ni(e15, t3);
  };
  var $r = `0deg`;
  var ei = `0px`;
  var ti = `) `;
  var ni = function(e15, t3) {
    var n2 = t3 || this, r2 = n2.xPercent, i2 = n2.yPercent, a2 = n2.x, o2 = n2.y, s2 = n2.z, c2 = n2.rotation, l2 = n2.rotationY, u2 = n2.rotationX, d2 = n2.skewX, f2 = n2.skewY, p2 = n2.scaleX, m2 = n2.scaleY, h2 = n2.transformPerspective, g2 = n2.force3D, _2 = n2.target, v2 = n2.zOrigin, y2 = ``, b2 = g2 === `auto` && e15 && e15 !== 1 || g2 === true;
    if (v2 && (u2 !== $r || l2 !== $r)) {
      var x2 = parseFloat(l2) * Qn, S2 = Math.sin(x2), C2 = Math.cos(x2), w2;
      x2 = parseFloat(u2) * Qn, w2 = Math.cos(x2), a2 = Zr(_2, a2, S2 * w2 * -v2), o2 = Zr(_2, o2, -Math.sin(x2) * -v2), s2 = Zr(_2, s2, C2 * w2 * -v2 + v2);
    }
    h2 !== ei && (y2 += `perspective(` + h2 + ti), (r2 || i2) && (y2 += `translate(` + r2 + `%, ` + i2 + `%) `), (b2 || a2 !== ei || o2 !== ei || s2 !== ei) && (y2 += s2 !== ei || b2 ? `translate3d(` + a2 + `, ` + o2 + `, ` + s2 + `) ` : `translate(` + a2 + `, ` + o2 + ti), c2 !== $r && (y2 += `rotate(` + c2 + ti), l2 !== $r && (y2 += `rotateY(` + l2 + ti), u2 !== $r && (y2 += `rotateX(` + u2 + ti), (d2 !== $r || f2 !== $r) && (y2 += `skew(` + d2 + `, ` + f2 + ti), (p2 !== 1 || m2 !== 1) && (y2 += `scale(` + p2 + `, ` + m2 + ti), _2.style[Q] = y2 || `translate(0, 0)`;
  };
  var ri = function(e15, t3) {
    var n2 = t3 || this, r2 = n2.xPercent, i2 = n2.yPercent, a2 = n2.x, o2 = n2.y, s2 = n2.rotation, c2 = n2.skewX, l2 = n2.skewY, u2 = n2.scaleX, d2 = n2.scaleY, f2 = n2.target, p2 = n2.xOrigin, m2 = n2.yOrigin, h2 = n2.xOffset, g2 = n2.yOffset, _2 = n2.forceCSS, v2 = parseFloat(a2), y2 = parseFloat(o2), b2, x2, S2, C2, w2;
    s2 = parseFloat(s2), c2 = parseFloat(c2), l2 = parseFloat(l2), l2 && (l2 = parseFloat(l2), c2 += l2, s2 += l2), s2 || c2 ? (s2 *= Qn, c2 *= Qn, b2 = Math.cos(s2) * u2, x2 = Math.sin(s2) * u2, S2 = Math.sin(s2 - c2) * -d2, C2 = Math.cos(s2 - c2) * d2, c2 && (l2 *= Qn, w2 = Math.tan(c2 - l2), w2 = Math.sqrt(1 + w2 * w2), S2 *= w2, C2 *= w2, l2 && (w2 = Math.tan(l2), w2 = Math.sqrt(1 + w2 * w2), b2 *= w2, x2 *= w2)), b2 = U(b2), x2 = U(x2), S2 = U(S2), C2 = U(C2)) : (b2 = u2, C2 = d2, x2 = S2 = 0), (v2 && !~(a2 + ``).indexOf(`px`) || y2 && !~(o2 + ``).indexOf(`px`)) && (v2 = Ir(f2, `x`, a2, `px`), y2 = Ir(f2, `y`, o2, `px`)), (p2 || m2 || h2 || g2) && (v2 = U(v2 + p2 - (p2 * b2 + m2 * S2) + h2), y2 = U(y2 + m2 - (p2 * x2 + m2 * C2) + g2)), (r2 || i2) && (w2 = f2.getBBox(), v2 = U(v2 + r2 / 100 * w2.width), y2 = U(y2 + i2 / 100 * w2.height)), w2 = `matrix(` + b2 + `,` + x2 + `,` + S2 + `,` + C2 + `,` + v2 + `,` + y2 + `)`, f2.setAttribute(`transform`, w2), _2 && (f2.style[Q] = w2);
  };
  var ii = function(e15, t3, n2, r2, i2) {
    var a2 = 360, o2 = h(i2), s2 = parseFloat(i2) * (o2 && ~i2.indexOf(`rad`) ? Zn : 1) - r2, c2 = r2 + s2 + `deg`, l2, u2;
    return o2 && (l2 = i2.split(`_`)[1], l2 === `short` && (s2 %= a2, s2 !== s2 % (a2 / 2) && (s2 += s2 < 0 ? a2 : -a2)), l2 === `cw` && s2 < 0 ? s2 = (s2 + a2 * er) % a2 - ~~(s2 / a2) * a2 : l2 === `ccw` && s2 > 0 && (s2 = (s2 - a2 * er) % a2 - ~~(s2 / a2) * a2)), e15._pt = u2 = new X(e15._pt, t3, n2, r2, s2, or), u2.e = c2, u2.u = `deg`, e15._props.push(n2), u2;
  };
  var ai = function(e15, t3) {
    for (var n2 in t3) e15[n2] = t3[n2];
    return e15;
  };
  var oi = function(e15, t3, n2) {
    var r2 = ai({}, n2._gsap), i2 = `perspective,force3D,transformOrigin,svgOrigin`, a2 = n2.style, o2, s2, c2, l2, u2, d2, f2, p2;
    for (s2 in r2.svg ? (c2 = n2.getAttribute(`transform`), n2.setAttribute(`transform`, ``), a2[Q] = t3, o2 = Yr(n2, 1), Mr(n2, Q), n2.setAttribute(`transform`, c2)) : (c2 = getComputedStyle(n2)[Q], a2[Q] = t3, o2 = Yr(n2, 1), a2[Q] = c2), Xn) c2 = r2[s2], l2 = o2[s2], c2 !== l2 && i2.indexOf(s2) < 0 && (f2 = G(c2), p2 = G(l2), u2 = f2 === p2 ? parseFloat(c2) : Ir(n2, s2, c2, p2), d2 = parseFloat(l2), e15._pt = new X(e15._pt, o2, s2, u2, d2 - u2, ar), e15._pt.u = p2 || 0, e15._props.push(s2));
    ai(o2, r2);
  };
  H(`padding,margin,Width,Radius`, function(e15, t3) {
    var n2 = `Top`, r2 = `Right`, i2 = `Bottom`, a2 = `Left`, o2 = (t3 < 3 ? [n2, r2, i2, a2] : [n2 + a2, n2 + r2, i2 + r2, i2 + a2]).map(function(n3) {
      return t3 < 2 ? e15 + n3 : `border` + n3 + e15;
    });
    Hr[t3 > 1 ? `border` + e15 : e15] = function(e16, t4, n3, r3, i3) {
      var a3, s2;
      if (arguments.length < 4) return a3 = o2.map(function(t5) {
        return Lr(e16, t5, n3);
      }), s2 = a3.join(` `), s2.split(a3[0]).length === 5 ? a3[0] : s2;
      a3 = (r3 + ``).split(` `), s2 = {}, o2.forEach(function(e17, t5) {
        return s2[e17] = a3[t5] = a3[t5] || a3[(t5 - 1) / 2 | 0];
      }), e16.init(t4, s2, i3);
    };
  });
  var si = { name: `css`, register: Dr, targetTest: function(e15) {
    return e15.style && e15.nodeType;
  }, init: function(e15, t3, r2, i2, a2) {
    var o2 = this._props, s2 = e15.style, c2 = r2.vars.startAt, l2, u2, d2, f2, p2, m2, g2, _2, v2, y2, b2, x2, S2, C2, w2, T2, E2;
    for (g2 in Gn || Dr(), this.styles = this.styles || xr(e15), T2 = this.styles.props, this.tween = r2, t3) if (g2 !== `autoRound` && (u2 = t3[g2], !(V[g2] && on(g2, t3, r2, i2, e15, a2)))) {
      if (p2 = typeof u2, m2 = Hr[g2], p2 === `function` && (u2 = u2.call(r2, i2, e15, a2), p2 = typeof u2), p2 === `string` && ~u2.indexOf(`random(`) && (u2 = Ct(u2)), m2) m2(this, e15, g2, u2, r2) && (w2 = 1);
      else if (g2.substr(0, 2) === `--`) l2 = (getComputedStyle(e15).getPropertyValue(g2) + ``).trim(), u2 += ``, Lt.lastIndex = 0, Lt.test(l2) || (_2 = G(l2), v2 = G(u2), v2 ? _2 !== v2 && (l2 = Ir(e15, g2, l2, v2) + v2) : _2 && (u2 += _2)), this.add(s2, `setProperty`, l2, u2, i2, a2, 0, 0, g2), o2.push(g2), T2.push(g2, 0, s2[g2]);
      else if (p2 !== `undefined`) {
        if (c2 && g2 in c2 ? (l2 = typeof c2[g2] == `function` ? c2[g2].call(r2, i2, e15, a2) : c2[g2], h(l2) && ~l2.indexOf(`random(`) && (l2 = Ct(l2)), G(l2 + ``) || l2 === `auto` || (l2 += n.units[g2] || G(Lr(e15, g2)) || ``), (l2 + ``).charAt(1) === `=` && (l2 = Lr(e15, g2))) : l2 = Lr(e15, g2), f2 = parseFloat(l2), y2 = p2 === `string` && u2.charAt(1) === `=` && u2.substr(0, 2), y2 && (u2 = u2.substr(2)), d2 = parseFloat(u2), g2 in ir && (g2 === `autoAlpha` && (f2 === 1 && Lr(e15, `visibility`) === `hidden` && d2 && (f2 = 0), T2.push(`visibility`, 0, s2.visibility), Nr(this, s2, `visibility`, f2 ? `inherit` : `hidden`, d2 ? `inherit` : `hidden`, !d2)), g2 !== `scale` && g2 !== `transform` && (g2 = ir[g2], ~g2.indexOf(`,`) && (g2 = g2.split(`,`)[0]))), b2 = g2 in Xn, b2) {
          if (this.styles.save(g2), E2 = u2, p2 === `string` && u2.substring(0, 6) === `var(--`) {
            if (u2 = wr(e15, u2.substring(4, u2.indexOf(`)`))), u2.substring(0, 5) === `calc(`) {
              var D2 = e15.style.perspective;
              e15.style.perspective = u2, u2 = wr(e15, `perspective`), D2 ? e15.style.perspective = D2 : Mr(e15, `perspective`);
            }
            d2 = parseFloat(u2);
          }
          if (x2 || (S2 = e15._gsap, S2.renderTransform && !t3.parseTransform || Yr(e15, t3.parseTransform), C2 = t3.smoothOrigin !== false && S2.smooth, x2 = this._pt = new X(this._pt, s2, Q, 0, 1, S2.renderTransform, S2, 0, -1), x2.dep = 1), g2 === `scale`) this._pt = new X(this._pt, S2, `scaleY`, S2.scaleY, (y2 ? ye(S2.scaleY, y2 + d2) : d2) - S2.scaleY || 0, ar), this._pt.u = 0, o2.push(`scaleY`, g2), g2 += `X`;
          else if (g2 === `transformOrigin`) {
            T2.push($, 0, s2[$]), u2 = Br(u2), S2.svg ? Jr(e15, u2, 0, C2, 0, this) : (v2 = parseFloat(u2.split(` `)[2]) || 0, v2 !== S2.zOrigin && Nr(this, S2, `zOrigin`, S2.zOrigin, v2), Nr(this, s2, g2, Xr(l2), Xr(u2)));
            continue;
          } else if (g2 === `svgOrigin`) {
            Jr(e15, u2, 1, C2, 0, this);
            continue;
          } else if (g2 in Wr) {
            ii(this, S2, g2, f2, y2 ? ye(f2, y2 + u2) : u2);
            continue;
          } else if (g2 === `smoothOrigin`) {
            Nr(this, S2, `smooth`, S2.smooth, u2);
            continue;
          } else if (g2 === `force3D`) {
            S2[g2] = u2;
            continue;
          } else if (g2 === `transform`) {
            oi(this, u2, e15);
            continue;
          }
        } else g2 in s2 || (g2 = Er(g2) || g2);
        if (b2 || (d2 || d2 === 0) && (f2 || f2 === 0) && !rr.test(u2) && g2 in s2) _2 = (l2 + ``).substr((f2 + ``).length), d2 || (d2 = 0), v2 = G(u2) || (g2 in n.units ? n.units[g2] : _2), _2 !== v2 && (f2 = Ir(e15, g2, l2, v2)), this._pt = new X(this._pt, b2 ? S2 : s2, g2, f2, (y2 ? ye(f2, y2 + d2) : d2) - f2, !b2 && (v2 === `px` || g2 === `zIndex`) && t3.autoRound !== false ? lr : ar), this._pt.u = v2 || 0, b2 && E2 !== u2 ? (this._pt.b = l2, this._pt.e = E2, this._pt.r = cr) : _2 !== v2 && v2 !== `%` && (this._pt.b = l2, this._pt.r = sr);
        else if (g2 in s2) Rr.call(this, e15, g2, l2, y2 ? y2 + u2 : u2);
        else if (g2 in e15) this.add(e15, g2, l2 || e15[g2], y2 ? y2 + u2 : u2, i2, a2);
        else if (g2 !== `parseTransform`) {
          te(g2, u2);
          continue;
        }
        b2 || (g2 in s2 ? T2.push(g2, 0, s2[g2]) : typeof e15[g2] == `function` ? T2.push(g2, 2, e15[g2]()) : T2.push(g2, 1, l2 || e15[g2])), o2.push(g2);
      }
    }
    w2 && On(this);
  }, render: function(e15, t3) {
    if (t3.tween._time || !Jn()) for (var n2 = t3._pt; n2; ) n2.r(e15, n2.d), n2 = n2._next;
    else t3.styles.revert();
  }, get: Lr, aliases: ir, getSetter: function(e15, t3, n2) {
    var r2 = ir[t3];
    return r2 && r2.indexOf(`,`) < 0 && (t3 = r2), t3 in Xn && t3 !== $ && (e15._gsap.x || Lr(e15, `x`)) ? n2 && qn === n2 ? t3 === `scale` ? hr : mr : (qn = n2 || {}) && (t3 === `scale` ? gr : _r) : e15.style && !v(e15.style[t3]) ? fr : ~t3.indexOf(`-`) ? pr : bn(e15, t3);
  }, core: { _removeProperty: Mr, _getMatrix: qr } };
  Z.utils.checkPrefix = Er, Z.core.getStyleSaver = xr, (function(e15, t3, r2, i2) {
    var a2 = H(e15 + `,` + t3 + `,` + r2, function(e16) {
      Xn[e16] = 1;
    });
    H(t3, function(e16) {
      n.units[e16] = `deg`, Wr[e16] = 1;
    }), ir[a2[13]] = e15 + `,` + t3, H(i2, function(e16) {
      var t4 = e16.split(`:`);
      ir[t4[1]] = a2[t4[0]];
    });
  })(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`, `rotation,rotationX,rotationY,skewX,skewY`, `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`, `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`), H(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`, function(e15) {
    n.units[e15] = `px`;
  }), Z.registerPlugin(si);
  var ci = Z.registerPlugin(si) || Z;
  ci.core.Tween;

  // public/shopify/plantilla99/assets/js/Header.astro_astro_type_script_index_0_lang.KVEvS_RS.js
  var t2 = () => {
    let t3 = document.querySelector(`[data-header]`);
    if (!t3) return;
    let n2 = t3.getAttribute(`data-scroll-reactive`) === `true`, r2 = t3.querySelectorAll(`[data-dropdown-trigger]`), i2 = t3.querySelectorAll(`[data-dropdown-panel-id]`), a2 = t3.querySelector(`[data-dropdowns-container]`), o2 = t3.querySelector(`[data-dropdown-overlay]`), s2 = t3.querySelector(`[data-mobile-menu-toggle]`), c2 = t3.querySelector(`[data-mobile-menu]`), l2 = t3.querySelectorAll(`[data-mobile-dropdown-trigger]`), u2 = t3.querySelectorAll(`[data-mobile-dropdown-panel]`), d2 = window.scrollY, f2 = false, p2 = null;
    n2 && window.addEventListener(`scroll`, () => {
      if (f2) return;
      let e15 = window.scrollY;
      e15 > 0 ? t3.classList.add(`scrolled`) : t3.classList.remove(`scrolled`);
      let n3 = e15 - d2;
      n3 > 5 ? (t3.classList.add(`hidden`), _2(), g2()) : n3 < -5 && t3.classList.remove(`hidden`), Math.abs(n3) > 5 && (d2 = e15);
    });
    let m2 = t3.querySelector(`[data-logo-link]`), h2 = t3.querySelector(`[data-logo-context-menu]`), g2 = () => {
      h2 && (h2.classList.remove(`visible`), h2.setAttribute(`aria-hidden`, `true`));
    };
    if (m2 && h2) {
      m2.addEventListener(`contextmenu`, (e16) => {
        e16.preventDefault(), e16.stopPropagation(), h2.classList.add(`visible`), h2.setAttribute(`aria-hidden`, `false`);
      }), m2.addEventListener(`click`, (e16) => {
        h2.classList.contains(`visible`) && e16.preventDefault();
      }), window.addEventListener(`pointerdown`, (e16) => {
        let t5 = e16.target;
        h2.contains(t5) || m2.contains(t5) || g2();
      }), window.addEventListener(`scroll`, g2, { passive: true }), window.addEventListener(`keydown`, (e16) => {
        e16.key === `Escape` && g2();
      });
      let e15 = h2.querySelector(`[data-context-action="copy-logo"]`), t4 = h2.querySelector(`[data-context-action="copy-wordmark"]`), n3 = (e16) => {
        e16.classList.add(`copied`), setTimeout(() => {
          e16.classList.remove(`copied`), g2();
        }, 1200);
      };
      e15 && e15.addEventListener(`click`, (t5) => {
        t5.stopPropagation(), navigator.clipboard.writeText(`<svg viewBox="0 0 113 113" height="113" width="113" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z" fill="#3186FF"/>
  <mask id="mask0_logo" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="13" y="18" width="85" height="78">
    <path d="M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z" fill="black"/>
  </mask>
  <g mask="url(#mask0_logo)">
    <g filter="url(#filter0_logo)">
      <ellipse cx="22.7873" cy="26.8098" rx="22.7873" ry="26.8098" transform="matrix(-0.112784 0.99362 -0.99362 -0.112781 66.2473 -15.5344)" fill="#FFE432"/>
    </g>
    <g filter="url(#filter1_logo)">
      <ellipse cx="96.491" cy="35.1231" rx="29.5007" ry="30.1492" transform="rotate(76.9243 96.491 35.1231)" fill="#FC413D"/>
    </g>
    <g filter="url(#filter2_logo)">
      <ellipse cx="9.02988" cy="41.6647" rx="30.832" ry="39.9417" transform="rotate(74.1257 9.02988 41.6647)" fill="#00B95C"/>
    </g>
    <g filter="url(#filter3_logo)">
      <ellipse cx="11.2212" cy="42.8915" rx="30.22" ry="33.2695" transform="rotate(45.6065 11.2212 42.8915)" fill="#00B95C"/>
    </g>
    <g filter="url(#filter4_logo)">
      <ellipse cx="75.7546" cy="104.822" rx="29.0177" ry="27.943" transform="rotate(76.9243 75.7546 104.822)" fill="#3186FF"/>
    </g>
    <g filter="url(#filter5_logo)">
      <ellipse cx="33.5661" cy="35.4043" rx="33.5661" ry="35.4043" transform="matrix(-0.409539 0.912293 -0.912294 -0.409537 101.25 -15.1674)" fill="#FBBC04"/>
    </g>
    <g filter="url(#filter6_logo)">
      <path d="M2.56802 149.695C-15.8116 142.48 15.5987 83.1163 23.4093 63.2203C31.22 43.3244 52.4514 33.0447 70.831 40.26C89.2107 47.4753 110.996 87.2162 103.185 107.112C95.3742 127.008 20.9477 156.91 2.56802 149.695Z" fill="#3186FF"/>
    </g>
    <g filter="url(#filter7_logo)">
      <path d="M113.934 75.8079C109.013 81.5509 96.1724 78.6224 85.253 69.2667C74.3335 59.911 69.4704 47.6711 74.391 41.928C79.3116 36.185 92.1525 39.1136 103.072 48.4692C113.991 57.8249 118.855 70.0648 113.934 75.8079Z" fill="#749BFF"/>
    </g>
    <g filter="url(#filter8_logo)">
      <ellipse cx="92.611" cy="23.7962" rx="44.2411" ry="27.5016" transform="rotate(34.0763 92.611 23.7962)" fill="#FC413D"/>
    </g>
    <g filter="url(#filter9_logo)">
      <ellipse cx="23.4949" cy="29.5887" rx="23.7071" ry="13.7869" transform="rotate(112.516 23.4949 29.5887)" fill="#FFEE48"/>
    </g>
  </g>
  <defs>
    <filter id="filter0_logo" x="2.49348" y="-26.5423" width="69.0899" height="61.2525" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="3.89034" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter1_logo" x="28.7524" y="-32.0333" width="135.477" height="134.313" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="18.8078" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter2_logo" x="-62.2884" y="-21.9253" width="142.637" height="127.18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="15.9884" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter3_logo" x="-52.5697" y="-20.8346" width="127.582" height="127.452" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="15.9884" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter4_logo" x="17.3619" y="45.4646" width="116.786" height="118.715" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="15.1937" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter5_logo" x="-7.44765" y="-60.4737" width="125.303" height="122.858" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="13.7698" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter6_logo" x="-27.7086" y="13.3597" width="157.119" height="162.029" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="12.297" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter7_logo" x="50.4638" y="16.981" width="87.3973" height="83.7738" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="11.0036" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter8_logo" x="34.2604" y="-28.457" width="116.701" height="104.506" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="9.29385" result="effect1_foregroundBlur"/>
    </filter>
    <filter id="filter9_logo" x="-15.1522" y="-15.9493" width="77.2941" height="91.076" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="11.5027" result="effect1_foregroundBlur"/>
    </filter>
  </defs>
</svg>`).then(() => {
          n3(e15);
        });
      }), t4 && t4.addEventListener(`click`, (e16) => {
        e16.stopPropagation();
        let r3 = m2.querySelector(`svg`)?.outerHTML || ``;
        navigator.clipboard.writeText(r3).then(() => {
          n3(t4);
        });
      });
    }
    r2.forEach((n3) => {
      let r3 = n3.getAttribute(`data-dropdown-trigger`), s3 = () => {
        if (!r3) {
          _2();
          return;
        }
        if (p2 === r3) return;
        p2 = r3, g2(), i2.forEach((e15) => {
          e15.classList.remove(`open`), e15.getAttribute(`data-dropdown-panel-id`) === r3 && e15.classList.add(`open`);
        }), t3.classList.add(`dropdown-open`), a2.classList.add(`open`), o2.classList.add(`open`);
        let n4 = a2.querySelector(`[data-dropdown-panel-id="${r3}"]`);
        if (n4) {
          let t4 = n4.querySelectorAll(`.dropdown-title, .dropdown-info, .nav-button`), r4 = n4.querySelectorAll(`.subnav-link`);
          ci.timeline().set(t4, { opacity: 0, y: `1em` }).to(a2, { duration: 0.3, height: `auto`, opacity: 1, ease: `power2.out` }).to(t4, { duration: 0.3, opacity: 1, y: 0, stagger: 0.08, ease: `power2.out` }, `<`).fromTo(r4, { y: `1em`, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, ease: `power2.out` }, `<0.15`);
        }
      };
      n3.addEventListener(`mouseenter`, s3), n3.addEventListener(`focus`, s3), n3.addEventListener(`click`, (e15) => {
        r3 && (e15.preventDefault(), s3());
      });
    }), t3.addEventListener(`mouseleave`, () => {
      _2(), g2();
    }), o2.addEventListener(`click`, () => {
      _2(), g2();
    });
    function _2() {
      p2 = null, t3.classList.remove(`dropdown-open`), a2.classList.remove(`open`), o2.classList.remove(`open`), i2.forEach((e15) => e15.classList.remove(`open`));
    }
    s2 && s2.addEventListener(`click`, () => {
      f2 = !f2, f2 ? (t3.classList.add(`menu-open`), c2.classList.add(`open`), document.body.classList.add(`no-scroll`), s2.querySelector(`span`).textContent = `close`, g2()) : v2();
    });
    function v2() {
      f2 = false, t3.classList.remove(`menu-open`), c2.classList.remove(`open`), document.body.classList.remove(`no-scroll`), s2.querySelector(`span`).textContent = `menu`, u2.forEach((e15) => e15.classList.remove(`open`)), l2.forEach((e15) => e15.classList.remove(`open`));
    }
    l2.forEach((e15) => {
      let t4 = e15.getAttribute(`data-mobile-dropdown-trigger`);
      e15.addEventListener(`click`, () => {
        let n3 = c2.querySelector(`[data-mobile-dropdown-panel="${t4}"]`);
        if (n3) {
          let t5 = n3.classList.contains(`open`);
          n3.classList.toggle(`open`, !t5), e15.classList.toggle(`open`, !t5), e15.setAttribute(`aria-expanded`, t5 ? `false` : `true`);
        }
      });
    }), t3.querySelectorAll(`a`).forEach((e15) => {
      e15.addEventListener(`click`, () => {
        v2(), _2(), g2();
      });
    });
  };
  document.readyState === `loading` ? document.addEventListener(`DOMContentLoaded`, t2) : t2();
})();
