"use strict";
(() => {
  // public/shopify/plantilla99/assets/js/gsap.Bi_c5vh2.js
  function e(e20) {
    if (e20 === void 0) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return e20;
  }
  function t(e20, t4) {
    e20.prototype = Object.create(t4.prototype), e20.prototype.constructor = e20, e20.__proto__ = t4;
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
  var h = function(e20) {
    return typeof e20 == `string`;
  };
  var g = function(e20) {
    return typeof e20 == `function`;
  };
  var _ = function(e20) {
    return typeof e20 == `number`;
  };
  var v = function(e20) {
    return e20 === void 0;
  };
  var y = function(e20) {
    return typeof e20 == `object`;
  };
  var b = function(e20) {
    return e20 !== false;
  };
  var x = function() {
    return typeof window < `u`;
  };
  var S = function(e20) {
    return g(e20) || h(e20);
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
  var ee = function(e20) {
    return (z = Oe(e20, R)) && Z;
  };
  var te = function(e20, t4) {
    return console.warn(`Invalid property`, e20, `set to`, t4, `Missing plugin? gsap.registerPlugin()`);
  };
  var ne = function(e20, t4) {
    return !t4 && console.warn(e20);
  };
  var re = function(e20, t4) {
    return e20 && (R[e20] = t4) && z && (z[e20] = t4) || R;
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
  var ge = function(e20) {
    var t4 = e20[0], n4, r4;
    if (y(t4) || g(t4) || (e20 = [e20]), !(n4 = (t4._gsap || {}).harness)) {
      for (r4 = me.length; r4-- && !me[r4].targetTest(t4); ) ;
      n4 = me[r4];
    }
    for (r4 = e20.length; r4--; ) e20[r4] && (e20[r4]._gsap || (e20[r4]._gsap = new en(e20[r4], n4))) || e20.splice(r4, 1);
    return e20;
  };
  var _e = function(e20) {
    return e20._gsap || ge(ut(e20))[0]._gsap;
  };
  var ve = function(e20, t4, n4) {
    return (n4 = e20[t4]) && g(n4) ? e20[t4]() : v(n4) && e20.getAttribute && e20.getAttribute(t4) || n4;
  };
  var H = function(e20, t4) {
    return (e20 = e20.split(`,`)).forEach(t4) || e20;
  };
  var U = function(e20) {
    return Math.round(e20 * 1e5) / 1e5 || 0;
  };
  var W = function(e20) {
    return Math.round(e20 * 1e7) / 1e7 || 0;
  };
  var ye = function(e20, t4) {
    var n4 = t4.charAt(0), r4 = parseFloat(t4.substr(2));
    return e20 = parseFloat(e20), n4 === `+` ? e20 + r4 : n4 === `-` ? e20 - r4 : n4 === `*` ? e20 * r4 : e20 / r4;
  };
  var be = function(e20, t4) {
    for (var n4 = t4.length, r4 = 0; e20.indexOf(t4[r4]) < 0 && ++r4 < n4; ) ;
    return r4 < n4;
  };
  var xe = function() {
    var e20 = le.length, t4 = le.slice(0), n4, r4;
    for (ue = {}, le.length = 0, n4 = 0; n4 < e20; n4++) r4 = t4[n4], r4 && r4._lazy && (r4.render(r4._lazy[0], r4._lazy[1], true)._lazy = 0);
  };
  var Se = function(e20) {
    return !!(e20._initted || e20._startAt || e20.add);
  };
  var Ce = function(e20, t4, n4, r4) {
    le.length && !a && xe(), e20.render(t4, n4, r4 || !!(a && t4 < 0 && Se(e20))), le.length && !a && xe();
  };
  var we = function(e20) {
    var t4 = parseFloat(e20);
    return (t4 || t4 === 0) && (e20 + ``).match(M).length < 2 ? t4 : h(e20) ? e20.trim() : e20;
  };
  var Te = function(e20) {
    return e20;
  };
  var Ee = function(e20, t4) {
    for (var n4 in t4) n4 in e20 || (e20[n4] = t4[n4]);
    return e20;
  };
  var De = function(e20) {
    return function(t4, n4) {
      for (var r4 in n4) r4 in t4 || r4 === `duration` && e20 || r4 === `ease` || (t4[r4] = n4[r4]);
    };
  };
  var Oe = function(e20, t4) {
    for (var n4 in t4) e20[n4] = t4[n4];
    return e20;
  };
  var ke = function e2(t4, n4) {
    for (var r4 in n4) r4 !== `__proto__` && r4 !== `constructor` && r4 !== `prototype` && (t4[r4] = y(n4[r4]) ? e2(t4[r4] || (t4[r4] = {}), n4[r4]) : n4[r4]);
    return t4;
  };
  var Ae = function(e20, t4) {
    var n4 = {}, r4;
    for (r4 in e20) r4 in t4 || (n4[r4] = e20[r4]);
    return n4;
  };
  var je = function(e20) {
    var t4 = e20.parent || P, n4 = e20.keyframes ? De(w(e20.keyframes)) : Ee;
    if (b(e20.inherit)) for (; t4; ) n4(e20, t4.vars.defaults), t4 = t4.parent || t4._dp;
    return e20;
  };
  var Me = function(e20, t4) {
    for (var n4 = e20.length, r4 = n4 === t4.length; r4 && n4-- && e20[n4] === t4[n4]; ) ;
    return n4 < 0;
  };
  var Ne = function(e20, t4, n4, r4, i4) {
    n4 === void 0 && (n4 = `_first`), r4 === void 0 && (r4 = `_last`);
    var a4 = e20[r4], o4;
    if (i4) for (o4 = t4[i4]; a4 && a4[i4] > o4; ) a4 = a4._prev;
    return a4 ? (t4._next = a4._next, a4._next = t4) : (t4._next = e20[n4], e20[n4] = t4), t4._next ? t4._next._prev = t4 : e20[r4] = t4, t4._prev = a4, t4.parent = t4._dp = e20, t4;
  };
  var Pe = function(e20, t4, n4, r4) {
    n4 === void 0 && (n4 = `_first`), r4 === void 0 && (r4 = `_last`);
    var i4 = t4._prev, a4 = t4._next;
    i4 ? i4._next = a4 : e20[n4] === t4 && (e20[n4] = a4), a4 ? a4._prev = i4 : e20[r4] === t4 && (e20[r4] = i4), t4._next = t4._prev = t4.parent = null;
  };
  var Fe = function(e20, t4) {
    e20.parent && (!t4 || e20.parent.autoRemoveChildren) && e20.parent.remove && e20.parent.remove(e20), e20._act = 0;
  };
  var Ie = function(e20, t4) {
    if (e20 && (!t4 || t4._end > e20._dur || t4._start < 0)) for (var n4 = e20; n4; ) n4._dirty = 1, n4 = n4.parent;
    return e20;
  };
  var Le = function(e20) {
    for (var t4 = e20.parent; t4 && t4.parent; ) t4._dirty = 1, t4.totalDuration(), t4 = t4.parent;
    return e20;
  };
  var Re = function(e20, t4, n4, r4) {
    return e20._startAt && (a ? e20._startAt.revert(oe) : e20.vars.immediateRender && !e20.vars.autoRevert || e20._startAt.render(t4, true, r4));
  };
  var ze = function e3(t4) {
    return !t4 || t4._ts && e3(t4.parent);
  };
  var Be = function(e20) {
    return e20._repeat ? Ve(e20._tTime, e20 = e20.duration() + e20._rDelay) * e20 : 0;
  };
  var Ve = function(e20, t4) {
    var n4 = Math.floor(e20 = W(e20 / t4));
    return e20 && n4 === e20 ? n4 - 1 : n4;
  };
  var He = function(e20, t4) {
    return (e20 - t4._start) * t4._ts + (t4._ts >= 0 ? 0 : t4._dirty ? t4.totalDuration() : t4._tDur);
  };
  var Ue = function(e20) {
    return e20._end = W(e20._start + (e20._tDur / Math.abs(e20._ts || e20._rts || c) || 0));
  };
  var We = function(e20, t4) {
    var n4 = e20._dp;
    return n4 && n4.smoothChildTiming && e20._ts && (e20._start = W(n4._time - (e20._ts > 0 ? t4 / e20._ts : ((e20._dirty ? e20.totalDuration() : e20._tDur) - t4) / -e20._ts)), Ue(e20), n4._dirty || Ie(n4, e20)), e20;
  };
  var Ge = function(e20, t4) {
    var n4;
    if ((t4._time || !t4._dur && t4._initted || t4._start < e20._time && (t4._dur || !t4.add)) && (n4 = He(e20.rawTime(), t4), (!t4._dur || at(0, t4.totalDuration(), n4) - t4._tTime > c) && t4.render(n4, true)), Ie(e20, t4)._dp && e20._initted && e20._time >= e20._dur && e20._ts) {
      if (e20._dur < e20.duration()) for (n4 = e20; n4._dp; ) n4.rawTime() >= 0 && n4.totalTime(n4._tTime), n4 = n4._dp;
      e20._zTime = -c;
    }
  };
  var Ke = function(e20, t4, n4, r4) {
    return t4.parent && Fe(t4), t4._start = W((_(n4) ? n4 : n4 || e20 !== P ? nt(e20, n4, t4) : e20._time) + t4._delay), t4._end = W(t4._start + (t4.totalDuration() / Math.abs(t4.timeScale()) || 0)), Ne(e20, t4, `_first`, `_last`, e20._sort ? `_start` : 0), Xe(t4) || (e20._recent = t4), r4 || Ge(e20, t4), e20._ts < 0 && We(e20, e20._tTime), e20;
  };
  var qe = function(e20, t4) {
    return (R.ScrollTrigger || te(`scrollTrigger`, t4)) && R.ScrollTrigger.create(t4, e20);
  };
  var Je = function(e20, t4, n4, r4, i4) {
    if (ln(e20, t4, i4), !e20._initted) return 1;
    if (!n4 && e20._pt && !a && (e20._dur && e20.vars.lazy !== false || !e20._dur && e20.vars.lazy) && de !== Vt.frame) return le.push(e20), e20._lazy = [i4, r4], 1;
  };
  var Ye = function e4(t4) {
    var n4 = t4.parent;
    return n4 && n4._ts && n4._initted && !n4._lock && (n4.rawTime() < 0 || e4(n4));
  };
  var Xe = function(e20) {
    var t4 = e20.data;
    return t4 === `isFromStart` || t4 === `isStart`;
  };
  var Ze = function(e20, t4, n4, r4) {
    var i4 = e20.ratio, o4 = t4 < 0 || !t4 && (!e20._start && Ye(e20) && !(!e20._initted && Xe(e20)) || (e20._ts < 0 || e20._dp._ts < 0) && !Xe(e20)) ? 0 : 1, s4 = e20._rDelay, l4 = 0, u4, d4, f4;
    if (s4 && e20._repeat && (l4 = at(0, e20._tDur, t4), d4 = Ve(l4, s4), e20._yoyo && d4 & 1 && (o4 = 1 - o4), d4 !== Ve(e20._tTime, s4) && (i4 = 1 - o4, e20.vars.repeatRefresh && e20._initted && e20.invalidate())), o4 !== i4 || a || r4 || e20._zTime === c || !t4 && e20._zTime) {
      if (!e20._initted && Je(e20, t4, r4, n4, l4)) return;
      for (f4 = e20._zTime, e20._zTime = t4 || (n4 ? c : 0), n4 || (n4 = t4 && !f4), e20.ratio = o4, e20._from && (o4 = 1 - o4), e20._time = 0, e20._tTime = l4, u4 = e20._pt; u4; ) u4.r(o4, u4.d), u4 = u4._next;
      t4 < 0 && Re(e20, t4, n4, true), e20._onUpdate && !n4 && Dt(e20, `onUpdate`), l4 && e20._repeat && !n4 && e20.parent && Dt(e20, `onRepeat`), (t4 >= e20._tDur || t4 < 0) && e20.ratio === o4 && (o4 && Fe(e20, 1), !n4 && !a && (Dt(e20, o4 ? `onComplete` : `onReverseComplete`, true), e20._prom && e20._prom()));
    } else e20._zTime || (e20._zTime = t4);
  };
  var Qe = function(e20, t4, n4) {
    var r4;
    if (n4 > t4) for (r4 = e20._first; r4 && r4._start <= n4; ) {
      if (r4.data === `isPause` && r4._start > t4) return r4;
      r4 = r4._next;
    }
    else for (r4 = e20._last; r4 && r4._start >= n4; ) {
      if (r4.data === `isPause` && r4._start < t4) return r4;
      r4 = r4._prev;
    }
  };
  var $e = function(e20, t4, n4, r4) {
    var i4 = e20._repeat, a4 = W(t4) || 0, o4 = e20._tTime / e20._tDur;
    return o4 && !r4 && (e20._time *= a4 / e20._dur), e20._dur = a4, e20._tDur = i4 ? i4 < 0 ? 1e10 : W(a4 * (i4 + 1) + e20._rDelay * i4) : a4, o4 > 0 && !r4 && We(e20, e20._tTime = e20._tDur * o4), e20.parent && Ue(e20), n4 || Ie(e20.parent, e20), e20;
  };
  var et = function(e20) {
    return e20 instanceof J ? Ie(e20) : $e(e20, e20._dur);
  };
  var tt = { _start: 0, endTime: ie, totalDuration: ie };
  var nt = function e5(t4, n4, r4) {
    var i4 = t4.labels, a4 = t4._recent || tt, o4 = t4.duration() >= s ? a4.endTime(false) : t4._dur, c4, l4, u4;
    return h(n4) && (isNaN(n4) || n4 in i4) ? (l4 = n4.charAt(0), u4 = n4.substr(-1) === `%`, c4 = n4.indexOf(`=`), l4 === `<` || l4 === `>` ? (c4 >= 0 && (n4 = n4.replace(/=/, ``)), (l4 === `<` ? a4._start : a4.endTime(a4._repeat >= 0)) + (parseFloat(n4.substr(1)) || 0) * (u4 ? (c4 < 0 ? a4 : r4).totalDuration() / 100 : 1)) : c4 < 0 ? (n4 in i4 || (i4[n4] = o4), i4[n4]) : (l4 = parseFloat(n4.charAt(c4 - 1) + n4.substr(c4 + 1)), u4 && r4 && (l4 = l4 / 100 * (w(r4) ? r4[0] : r4).totalDuration()), c4 > 1 ? e5(t4, n4.substr(0, c4 - 1), r4) + l4 : o4 + l4)) : n4 == null ? o4 : +n4;
  };
  var rt = function(e20, t4, n4) {
    var r4 = _(t4[1]), i4 = (r4 ? 2 : 1) + (e20 < 2 ? 0 : 1), a4 = t4[i4], o4, s4;
    if (r4 && (a4.duration = t4[1]), a4.parent = n4, e20) {
      for (o4 = a4, s4 = n4; s4 && !(`immediateRender` in o4); ) o4 = s4.vars.defaults || {}, s4 = b(s4.vars.inherit) && s4.parent;
      a4.immediateRender = b(o4.immediateRender), e20 < 2 ? a4.runBackwards = 1 : a4.startAt = t4[i4 - 1];
    }
    return new Y(t4[0], a4, t4[i4 + 1]);
  };
  var it = function(e20, t4) {
    return e20 || e20 === 0 ? t4(e20) : t4;
  };
  var at = function(e20, t4, n4) {
    return n4 < e20 ? e20 : n4 > t4 ? t4 : n4;
  };
  var G = function(e20, t4) {
    return !h(e20) || !(t4 = N.exec(e20)) ? `` : t4[1];
  };
  var ot = function(e20, t4, n4) {
    return it(n4, function(n5) {
      return at(e20, t4, n5);
    });
  };
  var st = [].slice;
  var ct = function(e20, t4) {
    return e20 && y(e20) && `length` in e20 && (!t4 && !e20.length || e20.length - 1 in e20 && y(e20[0])) && !e20.nodeType && e20 !== F;
  };
  var lt = function(e20, t4, n4) {
    return n4 === void 0 && (n4 = []), e20.forEach(function(e21) {
      var r4;
      return h(e21) && !t4 || ct(e21, 1) ? (r4 = n4).push.apply(r4, ut(e21)) : n4.push(e21);
    }) || n4;
  };
  var ut = function(e20, t4, n4) {
    return o && !t4 && o.selector ? o.selector(e20) : h(e20) && !n4 && (I || !Ht()) ? st.call((t4 || L).querySelectorAll(e20), 0) : w(e20) ? lt(e20, n4) : ct(e20) ? st.call(e20, 0) : e20 ? [e20] : [];
  };
  var dt = function(e20) {
    return e20 = ut(e20)[0] || ne(`Invalid scope`) || {}, function(t4) {
      var n4 = e20.current || e20.nativeElement || e20;
      return ut(t4, n4.querySelectorAll ? n4 : n4 === e20 ? ne(`Invalid scope`) || L.createElement(`div`) : e20);
    };
  };
  var ft = function(e20) {
    return e20.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var pt = function(e20) {
    if (g(e20)) return e20;
    var t4 = y(e20) ? e20 : { each: e20 }, n4 = Yt(t4.ease), r4 = t4.from || 0, i4 = parseFloat(t4.base) || 0, a4 = {}, o4 = r4 > 0 && r4 < 1, c4 = isNaN(r4) || o4, l4 = t4.axis, u4 = r4, d4 = r4;
    return h(r4) ? u4 = d4 = { center: 0.5, edges: 0.5, end: 1 }[r4] || 0 : !o4 && c4 && (u4 = r4[0], d4 = r4[1]), function(e21, o5, p4) {
      var m4 = (p4 || t4).length, h4 = a4[m4], g4, _4, v4, y4, b4, x4, S3, C3, w3;
      if (!h4) {
        if (w3 = t4.grid === `auto` ? 0 : (t4.grid || [1, s])[1], !w3) {
          for (S3 = -s; S3 < (S3 = p4[w3++].getBoundingClientRect().left) && w3 < m4; ) ;
          w3 < m4 && w3--;
        }
        for (h4 = a4[m4] = [], g4 = c4 ? Math.min(w3, m4) * u4 - 0.5 : r4 % w3, _4 = w3 === s ? 0 : c4 ? m4 * d4 / w3 - 0.5 : r4 / w3 | 0, S3 = 0, C3 = s, x4 = 0; x4 < m4; x4++) v4 = x4 % w3 - g4, y4 = _4 - (x4 / w3 | 0), h4[x4] = b4 = l4 ? Math.abs(l4 === `y` ? y4 : v4) : f(v4 * v4 + y4 * y4), b4 > S3 && (S3 = b4), b4 < C3 && (C3 = b4);
        r4 === `random` && ft(h4), h4.max = S3 - C3, h4.min = C3, h4.v = m4 = (parseFloat(t4.amount) || parseFloat(t4.each) * (w3 > m4 ? m4 - 1 : l4 ? l4 === `y` ? m4 / w3 : w3 : Math.max(w3, m4 / w3)) || 0) * (r4 === `edges` ? -1 : 1), h4.b = m4 < 0 ? i4 - m4 : i4, h4.u = G(t4.amount || t4.each) || 0, n4 = n4 && m4 < 0 ? Jt(n4) : n4;
      }
      return m4 = (h4[e21] - h4.min) / h4.max || 0, W(h4.b + (n4 ? n4(m4) : m4) * h4.v) + h4.u;
    };
  };
  var mt = function(e20) {
    var t4 = 10 ** ((e20 + ``).split(`.`)[1] || ``).length;
    return function(n4) {
      var r4 = W(Math.round(parseFloat(n4) / e20) * e20 * t4);
      return (r4 - r4 % 1) / t4 + (_(n4) ? 0 : G(n4));
    };
  };
  var ht = function(e20, t4) {
    var n4 = w(e20), r4, i4;
    return !n4 && y(e20) && (r4 = n4 = e20.radius || s, e20.values ? (e20 = ut(e20.values), (i4 = !_(e20[0])) && (r4 *= r4)) : e20 = mt(e20.increment)), it(t4, n4 ? g(e20) ? function(t5) {
      return i4 = e20(t5), Math.abs(i4 - t5) <= r4 ? i4 : t5;
    } : function(t5) {
      for (var n5 = parseFloat(i4 ? t5.x : t5), a4 = parseFloat(i4 ? t5.y : 0), o4 = s, c4 = 0, l4 = e20.length, u4, d4; l4--; ) i4 ? (u4 = e20[l4].x - n5, d4 = e20[l4].y - a4, u4 = u4 * u4 + d4 * d4) : u4 = Math.abs(e20[l4] - n5), u4 < o4 && (o4 = u4, c4 = l4);
      return c4 = !r4 || o4 <= r4 ? e20[c4] : t5, i4 || c4 === t5 || _(t5) ? c4 : c4 + G(t5);
    } : mt(e20));
  };
  var gt = function(e20, t4, n4, r4) {
    return it(w(e20) ? !t4 : n4 === true ? !!(n4 = 0) : !r4, function() {
      return w(e20) ? e20[~~(Math.random() * e20.length)] : (n4 || (n4 = 1e-5)) && (r4 = n4 < 1 ? 10 ** ((n4 + ``).length - 2) : 1) && Math.floor(Math.round((e20 - n4 / 2 + Math.random() * (t4 - e20 + n4 * 0.99)) / n4) * n4 * r4) / r4;
    });
  };
  var _t = function() {
    var e20 = [...arguments];
    return function(t4) {
      return e20.reduce(function(e21, t5) {
        return t5(e21);
      }, t4);
    };
  };
  var vt = function(e20, t4) {
    return function(n4) {
      return e20(parseFloat(n4)) + (t4 || G(n4));
    };
  };
  var yt = function(e20, t4, n4) {
    return wt(e20, t4, 0, 1, n4);
  };
  var bt = function(e20, t4, n4) {
    return it(n4, function(n5) {
      return e20[~~t4(n5)];
    });
  };
  var xt = function e6(t4, n4, r4) {
    var i4 = n4 - t4;
    return w(t4) ? bt(t4, e6(0, t4.length), n4) : it(r4, function(e20) {
      return (i4 + (e20 - t4) % i4) % i4 + t4;
    });
  };
  var St = function e7(t4, n4, r4) {
    var i4 = n4 - t4, a4 = i4 * 2;
    return w(t4) ? bt(t4, e7(0, t4.length - 1), n4) : it(r4, function(e20) {
      return e20 = (a4 + (e20 - t4) % a4) % a4 || 0, t4 + (e20 > i4 ? a4 - e20 : e20);
    });
  };
  var Ct = function(e20) {
    return e20.replace(T, function(e21) {
      var t4 = e21.indexOf(`[`) + 1, n4 = e21.substring(t4 || 7, t4 ? e21.indexOf(`]`) : e21.length - 1).split(E);
      return gt(t4 ? n4 : +n4[0], t4 ? 0 : +n4[1], +n4[2] || 1e-5);
    });
  };
  var wt = function(e20, t4, n4, r4, i4) {
    var a4 = t4 - e20, o4 = r4 - n4;
    return it(i4, function(t5) {
      return n4 + ((t5 - e20) / a4 * o4 || 0);
    });
  };
  var Tt = function e8(t4, n4, r4, i4) {
    var a4 = isNaN(t4 + n4) ? 0 : function(e20) {
      return (1 - e20) * t4 + e20 * n4;
    };
    if (!a4) {
      var o4 = h(t4), s4 = {}, c4, l4, u4, d4, f4;
      if (r4 === true && (i4 = 1) && (r4 = null), o4) t4 = { p: t4 }, n4 = { p: n4 };
      else if (w(t4) && !w(n4)) {
        for (u4 = [], d4 = t4.length, f4 = d4 - 2, l4 = 1; l4 < d4; l4++) u4.push(e8(t4[l4 - 1], t4[l4]));
        d4--, a4 = function(e20) {
          e20 *= d4;
          var t5 = Math.min(f4, ~~e20);
          return u4[t5](e20 - t5);
        }, r4 = n4;
      } else i4 || (t4 = Oe(w(t4) ? [] : {}, t4));
      if (!u4) {
        for (c4 in n4) rn.call(s4, t4, c4, `get`, n4[c4]);
        a4 = function(e20) {
          return wn(e20, s4) || (o4 ? t4.p : t4);
        };
      }
    }
    return it(r4, a4);
  };
  var Et = function(e20, t4, n4) {
    var r4 = e20.labels, i4 = s, a4, o4, c4;
    for (a4 in r4) o4 = r4[a4] - t4, o4 < 0 == !!n4 && o4 && i4 > (o4 = Math.abs(o4)) && (c4 = a4, i4 = o4);
    return c4;
  };
  var Dt = function(e20, t4, n4) {
    var r4 = e20.vars, i4 = r4[t4], a4 = o, s4 = e20._ctx, c4, l4, u4;
    if (i4) return c4 = r4[t4 + `Params`], l4 = r4.callbackScope || e20, n4 && le.length && xe(), s4 && (o = s4), u4 = c4 ? i4.apply(l4, c4) : i4.call(l4), o = a4, u4;
  };
  var Ot = function(e20) {
    return Fe(e20), e20.scrollTrigger && e20.scrollTrigger.kill(!!a), e20.progress() < 1 && Dt(e20, `onInterrupt`), e20;
  };
  var kt;
  var At = [];
  var jt = function(e20) {
    if (e20) if (e20 = !e20.name && e20.default || e20, x() || e20.headless) {
      var t4 = e20.name, n4 = g(e20), r4 = t4 && !n4 && e20.init ? function() {
        this._props = [];
      } : e20, i4 = { init: ie, render: wn, add: rn, kill: En, modifier: Tn, rawVars: 0 }, a4 = { targetTest: 0, get: 0, getSetter: bn, aliases: {}, register: 0 };
      if (Ht(), e20 !== r4) {
        if (V[t4]) return;
        Ee(r4, Ee(Ae(e20, i4), a4)), Oe(r4.prototype, Oe(i4, Ae(e20, a4))), V[r4.prop = t4] = r4, e20.targetTest && (me.push(r4), ce[t4] = 1), t4 = (t4 === `css` ? `CSS` : t4.charAt(0).toUpperCase() + t4.substr(1)) + `Plugin`;
      }
      re(t4, r4), e20.register && e20.register(Z, r4, X);
    } else At.push(e20);
  };
  var K = 255;
  var Mt = { aqua: [0, K, K], lime: [0, K, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, K], navy: [0, 0, 128], white: [K, K, K], olive: [128, 128, 0], yellow: [K, K, 0], orange: [K, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [K, 0, 0], pink: [K, 192, 203], cyan: [0, K, K], transparent: [K, K, K, 0] };
  var Nt = function(e20, t4, n4) {
    return e20 += e20 < 0 ? 1 : e20 > 1 ? -1 : 0, (e20 * 6 < 1 ? t4 + (n4 - t4) * e20 * 6 : e20 < 0.5 ? n4 : e20 * 3 < 2 ? t4 + (n4 - t4) * (2 / 3 - e20) * 6 : t4) * K + 0.5 | 0;
  };
  var Pt = function(e20, t4, n4) {
    var r4 = e20 ? _(e20) ? [e20 >> 16, e20 >> 8 & K, e20 & K] : 0 : Mt.black, i4, a4, o4, s4, c4, l4, u4, d4, f4, p4;
    if (!r4) {
      if (e20.substr(-1) === `,` && (e20 = e20.substr(0, e20.length - 1)), Mt[e20]) r4 = Mt[e20];
      else if (e20.charAt(0) === `#`) {
        if (e20.length < 6 && (i4 = e20.charAt(1), a4 = e20.charAt(2), o4 = e20.charAt(3), e20 = `#` + i4 + i4 + a4 + a4 + o4 + o4 + (e20.length === 5 ? e20.charAt(4) + e20.charAt(4) : ``)), e20.length === 9) return r4 = parseInt(e20.substr(1, 6), 16), [r4 >> 16, r4 >> 8 & K, r4 & K, parseInt(e20.substr(7), 16) / 255];
        e20 = parseInt(e20.substr(1), 16), r4 = [e20 >> 16, e20 >> 8 & K, e20 & K];
      } else if (e20.substr(0, 3) === `hsl`) {
        if (r4 = p4 = e20.match(D), !t4) s4 = r4[0] % 360 / 360, c4 = r4[1] / 100, l4 = r4[2] / 100, a4 = l4 <= 0.5 ? l4 * (c4 + 1) : l4 + c4 - l4 * c4, i4 = l4 * 2 - a4, r4.length > 3 && (r4[3] *= 1), r4[0] = Nt(s4 + 1 / 3, i4, a4), r4[1] = Nt(s4, i4, a4), r4[2] = Nt(s4 - 1 / 3, i4, a4);
        else if (~e20.indexOf(`=`)) return r4 = e20.match(O), n4 && r4.length < 4 && (r4[3] = 1), r4;
      } else r4 = e20.match(D) || Mt.transparent;
      r4 = r4.map(Number);
    }
    return t4 && !p4 && (i4 = r4[0] / K, a4 = r4[1] / K, o4 = r4[2] / K, u4 = Math.max(i4, a4, o4), d4 = Math.min(i4, a4, o4), l4 = (u4 + d4) / 2, u4 === d4 ? s4 = c4 = 0 : (f4 = u4 - d4, c4 = l4 > 0.5 ? f4 / (2 - u4 - d4) : f4 / (u4 + d4), s4 = u4 === i4 ? (a4 - o4) / f4 + (a4 < o4 ? 6 : 0) : u4 === a4 ? (o4 - i4) / f4 + 2 : (i4 - a4) / f4 + 4, s4 *= 60), r4[0] = ~~(s4 + 0.5), r4[1] = ~~(c4 * 100 + 0.5), r4[2] = ~~(l4 * 100 + 0.5)), n4 && r4.length < 4 && (r4[3] = 1), r4;
  };
  var Ft = function(e20) {
    var t4 = [], n4 = [], r4 = -1;
    return e20.split(Lt).forEach(function(e21) {
      var i4 = e21.match(k) || [];
      t4.push.apply(t4, i4), n4.push(r4 += i4.length + 1);
    }), t4.c = n4, t4;
  };
  var It = function(e20, t4, n4) {
    var r4 = ``, i4 = (e20 + r4).match(Lt), a4 = t4 ? `hsla(` : `rgba(`, o4 = 0, s4, c4, l4, u4;
    if (!i4) return e20;
    if (i4 = i4.map(function(e21) {
      return (e21 = Pt(e21, t4, 1)) && a4 + (t4 ? e21[0] + `,` + e21[1] + `%,` + e21[2] + `%,` + e21[3] : e21.join(`,`)) + `)`;
    }), n4 && (l4 = Ft(e20), s4 = n4.c, s4.join(r4) !== l4.c.join(r4))) for (c4 = e20.replace(Lt, `1`).split(k), u4 = c4.length - 1; o4 < u4; o4++) r4 += c4[o4] + (~s4.indexOf(o4) ? i4.shift() || a4 + `0,0,0,0)` : (l4.length ? l4 : i4.length ? i4 : n4).shift());
    if (!c4) for (c4 = e20.split(Lt), u4 = c4.length - 1; o4 < u4; o4++) r4 += c4[o4] + i4[o4];
    return r4 + c4[u4];
  };
  var Lt = (function() {
    var e20 = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`, t4;
    for (t4 in Mt) e20 += `|` + t4 + `\\b`;
    return RegExp(e20 + `)`, `gi`);
  })();
  var Rt = /hsl[a]?\(/;
  var zt = function(e20) {
    var t4 = e20.join(` `), n4;
    if (Lt.lastIndex = 0, Lt.test(t4)) return n4 = Rt.test(t4), e20[1] = It(e20[1], n4), e20[0] = It(e20[0], n4, Ft(e20[1])), true;
  };
  var Bt;
  var Vt = (function() {
    var e20 = Date.now, t4 = 500, n4 = 33, r4 = e20(), i4 = r4, a4 = 1e3 / 240, o4 = a4, s4 = [], c4, l4, u4, d4, f4, p4, m4 = function u5(m5) {
      var h4 = e20() - i4, g4 = m5 === true, _4, v4, y4, b4;
      if ((h4 > t4 || h4 < 0) && (r4 += h4 - n4), i4 += h4, y4 = i4 - r4, _4 = y4 - o4, (_4 > 0 || g4) && (b4 = ++d4.frame, f4 = y4 - d4.time * 1e3, d4.time = y4 /= 1e3, o4 += _4 + (_4 >= a4 ? 4 : a4 - _4), v4 = 1), g4 || (c4 = l4(u5)), v4) for (p4 = 0; p4 < s4.length; p4++) s4[p4](y4, f4, b4, m5);
    };
    return d4 = { time: 0, frame: 0, tick: function() {
      m4(true);
    }, deltaRatio: function(e21) {
      return f4 / (1e3 / (e21 || 60));
    }, wake: function() {
      B && (!I && x() && (F = I = window, L = F.document || {}, R.gsap = Z, (F.gsapVersions || (F.gsapVersions = [])).push(Z.version), ee(z || F.GreenSockGlobals || !F.gsap && F || {}), At.forEach(jt)), u4 = typeof requestAnimationFrame < `u` && requestAnimationFrame, c4 && d4.sleep(), l4 = u4 || function(e21) {
        return setTimeout(e21, o4 - d4.time * 1e3 + 1 | 0);
      }, Bt = 1, m4(2));
    }, sleep: function() {
      (u4 ? cancelAnimationFrame : clearTimeout)(c4), Bt = 0, l4 = ie;
    }, lagSmoothing: function(e21, r5) {
      t4 = e21 || 1 / 0, n4 = Math.min(r5 || 33, t4);
    }, fps: function(e21) {
      a4 = 1e3 / (e21 || 240), o4 = d4.time * 1e3 + a4;
    }, add: function(e21, t5, n5) {
      var r5 = t5 ? function(t6, n6, i5, a5) {
        e21(t6, n6, i5, a5), d4.remove(r5);
      } : e21;
      return d4.remove(e21), s4[n5 ? `unshift` : `push`](r5), Ht(), r5;
    }, remove: function(e21, t5) {
      ~(t5 = s4.indexOf(e21)) && s4.splice(t5, 1) && p4 >= t5 && p4--;
    }, _listeners: s4 }, d4;
  })();
  var Ht = function() {
    return !Bt && Vt.wake();
  };
  var q = {};
  var Ut = /^[\d.\-M][\d.\-,\s]/;
  var Wt = /["']/g;
  var Gt = function(e20) {
    for (var t4 = {}, n4 = e20.substr(1, e20.length - 3).split(`:`), r4 = n4[0], i4 = 1, a4 = n4.length, o4, s4, c4; i4 < a4; i4++) s4 = n4[i4], o4 = i4 === a4 - 1 ? s4.length : s4.lastIndexOf(`,`), c4 = s4.substr(0, o4), t4[r4] = isNaN(c4) ? c4.replace(Wt, ``).trim() : +c4, r4 = s4.substr(o4 + 1).trim();
    return t4;
  };
  var Kt = function(e20) {
    var t4 = e20.indexOf(`(`) + 1, n4 = e20.indexOf(`)`), r4 = e20.indexOf(`(`, t4);
    return e20.substring(t4, ~r4 && r4 < n4 ? e20.indexOf(`)`, n4 + 1) : n4);
  };
  var qt = function(e20) {
    var t4 = (e20 + ``).split(`(`), n4 = q[t4[0]];
    return n4 && t4.length > 1 && n4.config ? n4.config.apply(null, ~e20.indexOf(`{`) ? [Gt(t4[1])] : Kt(e20).split(`,`).map(we)) : q._CE && Ut.test(e20) ? q._CE(``, e20) : n4;
  };
  var Jt = function(e20) {
    return function(t4) {
      return 1 - e20(1 - t4);
    };
  };
  var Yt = function(e20, t4) {
    return e20 && (g(e20) ? e20 : q[e20] || qt(e20)) || t4;
  };
  var Xt = function(e20, t4, n4, r4) {
    n4 === void 0 && (n4 = function(e21) {
      return 1 - t4(1 - e21);
    }), r4 === void 0 && (r4 = function(e21) {
      return e21 < 0.5 ? t4(e21 * 2) / 2 : 1 - t4((1 - e21) * 2) / 2;
    });
    var i4 = { easeIn: t4, easeOut: n4, easeInOut: r4 }, a4;
    return H(e20, function(e21) {
      for (var t5 in q[e21] = R[e21] = i4, q[a4 = e21.toLowerCase()] = n4, i4) q[a4 + (t5 === `easeIn` ? `.in` : t5 === `easeOut` ? `.out` : `.inOut`)] = q[e21 + `.` + t5] = i4[t5];
    }), i4;
  };
  var Zt = function(e20) {
    return function(t4) {
      return t4 < 0.5 ? (1 - e20(1 - t4 * 2)) / 2 : 0.5 + e20((t4 - 0.5) * 2) / 2;
    };
  };
  var Qt = function e9(t4, n4, r4) {
    var i4 = n4 >= 1 ? n4 : 1, a4 = (r4 || (t4 ? 0.3 : 0.45)) / (n4 < 1 ? n4 : 1), o4 = a4 / l * (Math.asin(1 / i4) || 0), s4 = function(e20) {
      return e20 === 1 ? 1 : i4 * 2 ** (-10 * e20) * m((e20 - o4) * a4) + 1;
    }, c4 = t4 === `out` ? s4 : t4 === `in` ? function(e20) {
      return 1 - s4(1 - e20);
    } : Zt(s4);
    return a4 = l / a4, c4.config = function(n5, r5) {
      return e9(t4, n5, r5);
    }, c4;
  };
  var $t = function e10(t4, n4) {
    n4 === void 0 && (n4 = 1.70158);
    var r4 = function(e20) {
      return e20 ? --e20 * e20 * ((n4 + 1) * e20 + n4) + 1 : 0;
    }, i4 = t4 === `out` ? r4 : t4 === `in` ? function(e20) {
      return 1 - r4(1 - e20);
    } : Zt(r4);
    return i4.config = function(n5) {
      return e10(t4, n5);
    }, i4;
  };
  H(`Linear,Quad,Cubic,Quart,Quint,Strong`, function(e20, t4) {
    var n4 = t4 < 5 ? t4 + 1 : t4;
    Xt(e20 + `,Power` + (n4 - 1), t4 ? function(e21) {
      return e21 ** +n4;
    } : function(e21) {
      return e21;
    }, function(e21) {
      return 1 - (1 - e21) ** n4;
    }, function(e21) {
      return e21 < 0.5 ? (e21 * 2) ** n4 / 2 : 1 - ((1 - e21) * 2) ** n4 / 2;
    });
  }), q.Linear.easeNone = q.none = q.Linear.easeIn, Xt(`Elastic`, Qt(`in`), Qt(`out`), Qt()), (function(e20, t4) {
    var n4 = 1 / t4, r4 = 2 * n4, i4 = 2.5 * n4, a4 = function(a5) {
      return a5 < n4 ? e20 * a5 * a5 : a5 < r4 ? e20 * (a5 - 1.5 / t4) ** 2 + 0.75 : a5 < i4 ? e20 * (a5 -= 2.25 / t4) * a5 + 0.9375 : e20 * (a5 - 2.625 / t4) ** 2 + 0.984375;
    };
    Xt(`Bounce`, function(e21) {
      return 1 - a4(1 - e21);
    }, a4);
  })(7.5625, 2.75), Xt(`Expo`, function(e20) {
    return 2 ** (10 * (e20 - 1)) * e20 + e20 * e20 * e20 * e20 * e20 * e20 * (1 - e20);
  }), Xt(`Circ`, function(e20) {
    return -(f(1 - e20 * e20) - 1);
  }), Xt(`Sine`, function(e20) {
    return e20 === 1 ? 1 : -p(e20 * u) + 1;
  }), Xt(`Back`, $t(`in`), $t(`out`), $t()), q.SteppedEase = q.steps = R.SteppedEase = { config: function(e20, t4) {
    e20 === void 0 && (e20 = 1);
    var n4 = 1 / e20, r4 = e20 + +!t4, i4 = +!!t4, a4 = 1 - c;
    return function(e21) {
      return ((r4 * at(0, a4, e21) | 0) + i4) * n4;
    };
  } }, r.ease = q[`quad.out`], H(`onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`, function(e20) {
    return he += e20 + `,` + e20 + `Params,`;
  });
  var en = function(e20, t4) {
    this.id = d++, e20._gsap = this, this.target = e20, this.harness = t4, this.get = t4 ? t4.get : ve, this.set = t4 ? t4.getSetter : bn;
  };
  var tn = (function() {
    function e20(e21) {
      this.vars = e21, this._delay = +e21.delay || 0, (this._repeat = e21.repeat === 1 / 0 ? -2 : e21.repeat || 0) && (this._rDelay = e21.repeatDelay || 0, this._yoyo = !!e21.yoyo || !!e21.yoyoEase), this._ts = 1, $e(this, +e21.duration, 1, 1), this.data = e21.data, o && (this._ctx = o, o.data.push(this)), Bt || Vt.wake();
    }
    var t4 = e20.prototype;
    return t4.delay = function(e21) {
      return e21 || e21 === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e21 - this._delay), this._delay = e21, this) : this._delay;
    }, t4.duration = function(e21) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? e21 + (e21 + this._rDelay) * this._repeat : e21) : this.totalDuration() && this._dur;
    }, t4.totalDuration = function(e21) {
      return arguments.length ? (this._dirty = 0, $e(this, this._repeat < 0 ? e21 : (e21 - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, t4.totalTime = function(e21, t5) {
      if (Ht(), !arguments.length) return this._tTime;
      var n4 = this._dp;
      if (n4 && n4.smoothChildTiming && this._ts) {
        for (We(this, e21), !n4._dp || n4.parent || Ge(n4, this); n4 && n4.parent; ) n4.parent._time !== n4._start + (n4._ts >= 0 ? n4._tTime / n4._ts : (n4.totalDuration() - n4._tTime) / -n4._ts) && n4.totalTime(n4._tTime, true), n4 = n4.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e21 < this._tDur || this._ts < 0 && e21 > 0 || !this._tDur && !e21) && Ke(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== e21 || !this._dur && !t5 || this._initted && Math.abs(this._zTime) === c || !this._initted && this._dur && e21 || !e21 && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e21), Ce(this, e21, t5)), this;
    }, t4.time = function(e21, t5) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e21 + Be(this)) % (this._dur + this._rDelay) || (e21 ? this._dur : 0), t5) : this._time;
    }, t4.totalProgress = function(e21, t5) {
      return arguments.length ? this.totalTime(this.totalDuration() * e21, t5) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, t4.progress = function(e21, t5) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e21 : e21) + Be(this), t5) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
    }, t4.iteration = function(e21, t5) {
      var n4 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (e21 - 1) * n4, t5) : this._repeat ? Ve(this._tTime, n4) + 1 : 1;
    }, t4.timeScale = function(e21, t5) {
      if (!arguments.length) return this._rts === -c ? 0 : this._rts;
      if (this._rts === e21) return this;
      var n4 = this.parent && this._ts ? He(this.parent._time, this) : this._tTime;
      return this._rts = +e21 || 0, this._ts = this._ps || e21 === -c ? 0 : this._rts, this.totalTime(at(-Math.abs(this._delay), this.totalDuration(), n4), t5 !== false), Ue(this), Le(this);
    }, t4.paused = function(e21) {
      return arguments.length ? (this._ps !== e21 && (this._ps = e21, e21 ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Ht(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== c && (this._tTime -= c)))), this) : this._ps;
    }, t4.startTime = function(e21) {
      if (arguments.length) {
        this._start = W(e21);
        var t5 = this.parent || this._dp;
        return t5 && (t5._sort || !this.parent) && Ke(t5, this, this._start - this._delay), this;
      }
      return this._start;
    }, t4.endTime = function(e21) {
      return this._start + (b(e21) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, t4.rawTime = function(e21) {
      var t5 = this.parent || this._dp;
      return t5 ? e21 && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? He(t5.rawTime(e21), this) : this._tTime : this._tTime;
    }, t4.revert = function(e21) {
      e21 === void 0 && (e21 = se);
      var t5 = a;
      return a = e21, Se(this) && (this.timeline && this.timeline.revert(e21), this.totalTime(-0.01, e21.suppressEvents)), this.data !== `nested` && e21.kill !== false && this.kill(), a = t5, this;
    }, t4.globalTime = function(e21) {
      for (var t5 = this, n4 = arguments.length ? e21 : t5.rawTime(); t5; ) n4 = t5._start + n4 / (Math.abs(t5._ts) || 1), t5 = t5._dp;
      return !this.parent && this._sat ? this._sat.globalTime(e21) : n4;
    }, t4.repeat = function(e21) {
      return arguments.length ? (this._repeat = e21 === 1 / 0 ? -2 : e21, et(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, t4.repeatDelay = function(e21) {
      if (arguments.length) {
        var t5 = this._time;
        return this._rDelay = e21, et(this), t5 ? this.time(t5) : this;
      }
      return this._rDelay;
    }, t4.yoyo = function(e21) {
      return arguments.length ? (this._yoyo = e21, this) : this._yoyo;
    }, t4.seek = function(e21, t5) {
      return this.totalTime(nt(this, e21), b(t5));
    }, t4.restart = function(e21, t5) {
      return this.play().totalTime(e21 ? -this._delay : 0, b(t5)), this._dur || (this._zTime = -c), this;
    }, t4.play = function(e21, t5) {
      return e21 != null && this.seek(e21, t5), this.reversed(false).paused(false);
    }, t4.reverse = function(e21, t5) {
      return e21 != null && this.seek(e21 || this.totalDuration(), t5), this.reversed(true).paused(false);
    }, t4.pause = function(e21, t5) {
      return e21 != null && this.seek(e21, t5), this.paused(true);
    }, t4.resume = function() {
      return this.paused(false);
    }, t4.reversed = function(e21) {
      return arguments.length ? (!!e21 !== this.reversed() && this.timeScale(-this._rts || (e21 ? -c : 0)), this) : this._rts < 0;
    }, t4.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -c, this;
    }, t4.isActive = function() {
      var e21 = this.parent || this._dp, t5 = this._start, n4;
      return !!(!e21 || this._ts && this._initted && e21.isActive() && (n4 = e21.rawTime(true)) >= t5 && n4 < this.endTime(true) - c);
    }, t4.eventCallback = function(e21, t5, n4) {
      var r4 = this.vars;
      return arguments.length > 1 ? (t5 ? (r4[e21] = t5, n4 && (r4[e21 + `Params`] = n4), e21 === `onUpdate` && (this._onUpdate = t5)) : delete r4[e21], this) : r4[e21];
    }, t4.then = function(e21) {
      var t5 = this, n4 = t5._prom;
      return new Promise(function(r4) {
        var i4 = g(e21) ? e21 : Te, a4 = function() {
          var e22 = t5.then;
          t5.then = null, n4 && n4(), g(i4) && (i4 = i4(t5)) && (i4.then || i4 === t5) && (t5.then = e22), r4(i4), t5.then = e22;
        };
        t5._initted && t5.totalProgress() === 1 && t5._ts >= 0 || !t5._tTime && t5._ts < 0 ? a4() : t5._prom = a4;
      });
    }, t4.kill = function() {
      Ot(this);
    }, e20;
  })();
  Ee(tn.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -c, _prom: 0, _ps: false, _rts: 1 });
  var J = (function(r4) {
    t(i4, r4);
    function i4(t4, n4) {
      var i5;
      return t4 === void 0 && (t4 = {}), i5 = r4.call(this, t4) || this, i5.labels = {}, i5.smoothChildTiming = !!t4.smoothChildTiming, i5.autoRemoveChildren = !!t4.autoRemoveChildren, i5._sort = b(t4.sortChildren), P && Ke(t4.parent || P, e(i5), n4), t4.reversed && i5.reverse(), t4.paused && i5.paused(true), t4.scrollTrigger && qe(e(i5), t4.scrollTrigger), i5;
    }
    var o4 = i4.prototype;
    return o4.to = function(e20, t4, n4) {
      return rt(0, arguments, this), this;
    }, o4.from = function(e20, t4, n4) {
      return rt(1, arguments, this), this;
    }, o4.fromTo = function(e20, t4, n4, r5) {
      return rt(2, arguments, this), this;
    }, o4.set = function(e20, t4, n4) {
      return t4.duration = 0, t4.parent = this, je(t4).repeatDelay || (t4.repeat = 0), t4.immediateRender = !!t4.immediateRender, new Y(e20, t4, nt(this, n4), 1), this;
    }, o4.call = function(e20, t4, n4) {
      return Ke(this, Y.delayedCall(0, e20, t4), n4);
    }, o4.staggerTo = function(e20, t4, n4, r5, i5, a4, o5) {
      return n4.duration = t4, n4.stagger = n4.stagger || r5, n4.onComplete = a4, n4.onCompleteParams = o5, n4.parent = this, new Y(e20, n4, nt(this, i5)), this;
    }, o4.staggerFrom = function(e20, t4, n4, r5, i5, a4, o5) {
      return n4.runBackwards = 1, je(n4).immediateRender = b(n4.immediateRender), this.staggerTo(e20, t4, n4, r5, i5, a4, o5);
    }, o4.staggerFromTo = function(e20, t4, n4, r5, i5, a4, o5, s4) {
      return r5.startAt = n4, je(r5).immediateRender = b(r5.immediateRender), this.staggerTo(e20, t4, r5, i5, a4, o5, s4);
    }, o4.render = function(e20, t4, n4) {
      var r5 = this._time, i5 = this._dirty ? this.totalDuration() : this._tDur, o5 = this._dur, s4 = e20 <= 0 ? 0 : W(e20), l4 = this._zTime < 0 != e20 < 0 && (this._initted || !o5), u4, d4, f4, p4, m4, h4, g4, _4, v4, y4, b4, x4;
      if (this !== P && s4 > i5 && e20 >= 0 && (s4 = i5), s4 !== this._tTime || n4 || l4) {
        if (r5 !== this._time && o5 && (s4 += this._time - r5, e20 += this._time - r5), u4 = s4, v4 = this._start, _4 = this._ts, h4 = !_4, l4 && (o5 || (r5 = this._zTime), (e20 || !t4) && (this._zTime = e20)), this._repeat) {
          if (b4 = this._yoyo, m4 = o5 + this._rDelay, this._repeat < -1 && e20 < 0) return this.totalTime(m4 * 100 + e20, t4, n4);
          if (u4 = W(s4 % m4), s4 === i5 ? (p4 = this._repeat, u4 = o5) : (y4 = W(s4 / m4), p4 = ~~y4, p4 && p4 === y4 && (u4 = o5, p4--), u4 > o5 && (u4 = o5)), y4 = Ve(this._tTime, m4), !r5 && this._tTime && y4 !== p4 && this._tTime - y4 * m4 - this._dur <= 0 && (y4 = p4), b4 && p4 & 1 && (u4 = o5 - u4, x4 = 1), p4 !== y4 && !this._lock) {
            var S3 = b4 && y4 & 1, C3 = S3 === (b4 && p4 & 1);
            if (p4 < y4 && (S3 = !S3), r5 = S3 ? 0 : s4 % o5 ? o5 : s4, this._lock = 1, this.render(r5 || (x4 ? 0 : W(p4 * m4)), t4, !o5)._lock = 0, this._tTime = s4, !t4 && this.parent && Dt(this, `onRepeat`), this.vars.repeatRefresh && !x4 && (this.invalidate()._lock = 1, y4 = p4), r5 && r5 !== this._time || h4 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (o5 = this._dur, i5 = this._tDur, C3 && (this._lock = 2, r5 = S3 ? o5 : -1e-4, this.render(r5, true), this.vars.repeatRefresh && !x4 && this.invalidate()), this._lock = 0, !this._ts && !h4)) return this;
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g4 = Qe(this, W(r5), W(u4)), g4 && (s4 -= u4 - (u4 = g4._start))), this._tTime = s4, this._time = u4, this._act = !!_4, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e20, r5 = 0), !r5 && s4 && o5 && !t4 && !y4 && (Dt(this, `onStart`), this._tTime !== s4)) return this;
        if (u4 >= r5 && e20 >= 0) for (d4 = this._first; d4; ) {
          if (f4 = d4._next, (d4._act || u4 >= d4._start) && d4._ts && g4 !== d4) {
            if (d4.parent !== this) return this.render(e20, t4, n4);
            if (d4.render(d4._ts > 0 ? (u4 - d4._start) * d4._ts : (d4._dirty ? d4.totalDuration() : d4._tDur) + (u4 - d4._start) * d4._ts, t4, n4), u4 !== this._time || !this._ts && !h4) {
              g4 = 0, f4 && (s4 += this._zTime = -c);
              break;
            }
          }
          d4 = f4;
        }
        else {
          d4 = this._last;
          for (var w3 = e20 < 0 ? e20 : u4; d4; ) {
            if (f4 = d4._prev, (d4._act || w3 <= d4._end) && d4._ts && g4 !== d4) {
              if (d4.parent !== this) return this.render(e20, t4, n4);
              if (d4.render(d4._ts > 0 ? (w3 - d4._start) * d4._ts : (d4._dirty ? d4.totalDuration() : d4._tDur) + (w3 - d4._start) * d4._ts, t4, n4 || a && Se(d4)), u4 !== this._time || !this._ts && !h4) {
                g4 = 0, f4 && (s4 += this._zTime = w3 ? -c : c);
                break;
              }
            }
            d4 = f4;
          }
        }
        if (g4 && !t4 && (this.pause(), g4.render(u4 >= r5 ? 0 : -c)._zTime = u4 >= r5 ? 1 : -1, this._ts)) return this._start = v4, Ue(this), this.render(e20, t4, n4);
        this._onUpdate && !t4 && Dt(this, `onUpdate`, true), (s4 === i5 && this._tTime >= this.totalDuration() || !s4 && r5) && (v4 === this._start || Math.abs(_4) !== Math.abs(this._ts)) && (this._lock || ((e20 || !o5) && (s4 === i5 && this._ts > 0 || !s4 && this._ts < 0) && Fe(this, 1), !t4 && !(e20 < 0 && !r5) && (s4 || r5 || !i5) && (Dt(this, s4 === i5 && e20 >= 0 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s4 < i5 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, o4.add = function(e20, t4) {
      var n4 = this;
      if (_(t4) || (t4 = nt(this, t4, e20)), !(e20 instanceof tn)) {
        if (w(e20)) return e20.forEach(function(e21) {
          return n4.add(e21, t4);
        }), this;
        if (h(e20)) return this.addLabel(e20, t4);
        if (g(e20)) e20 = Y.delayedCall(0, e20);
        else return this;
      }
      return this === e20 ? this : Ke(this, e20, t4);
    }, o4.getChildren = function(e20, t4, n4, r5) {
      e20 === void 0 && (e20 = true), t4 === void 0 && (t4 = true), n4 === void 0 && (n4 = true), r5 === void 0 && (r5 = -s);
      for (var i5 = [], a4 = this._first; a4; ) a4._start >= r5 && (a4 instanceof Y ? t4 && i5.push(a4) : (n4 && i5.push(a4), e20 && i5.push.apply(i5, a4.getChildren(true, t4, n4)))), a4 = a4._next;
      return i5;
    }, o4.getById = function(e20) {
      for (var t4 = this.getChildren(1, 1, 1), n4 = t4.length; n4--; ) if (t4[n4].vars.id === e20) return t4[n4];
    }, o4.remove = function(e20) {
      return h(e20) ? this.removeLabel(e20) : g(e20) ? this.killTweensOf(e20) : (e20.parent === this && Pe(this, e20), e20 === this._recent && (this._recent = this._last), Ie(this));
    }, o4.totalTime = function(e20, t4) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = W(Vt.time - (this._ts > 0 ? e20 / this._ts : (this.totalDuration() - e20) / -this._ts))), r4.prototype.totalTime.call(this, e20, t4), this._forcing = 0, this) : this._tTime;
    }, o4.addLabel = function(e20, t4) {
      return this.labels[e20] = nt(this, t4), this;
    }, o4.removeLabel = function(e20) {
      return delete this.labels[e20], this;
    }, o4.addPause = function(e20, t4, n4) {
      var r5 = Y.delayedCall(0, t4 || ie, n4);
      return r5.data = `isPause`, this._hasPause = 1, Ke(this, r5, nt(this, e20));
    }, o4.removePause = function(e20) {
      var t4 = this._first;
      for (e20 = nt(this, e20); t4; ) t4._start === e20 && t4.data === `isPause` && Fe(t4), t4 = t4._next;
    }, o4.killTweensOf = function(e20, t4, n4) {
      for (var r5 = this.getTweensOf(e20, n4), i5 = r5.length; i5--; ) sn !== r5[i5] && r5[i5].kill(e20, t4);
      return this;
    }, o4.getTweensOf = function(e20, t4) {
      for (var n4 = [], r5 = ut(e20), i5 = this._first, a4 = _(t4), o5; i5; ) i5 instanceof Y ? be(i5._targets, r5) && (a4 ? (!sn || i5._initted && i5._ts) && i5.globalTime(0) <= t4 && i5.globalTime(i5.totalDuration()) > t4 : !t4 || i5.isActive()) && n4.push(i5) : (o5 = i5.getTweensOf(r5, t4)).length && n4.push.apply(n4, o5), i5 = i5._next;
      return n4;
    }, o4.tweenTo = function(e20, t4) {
      t4 || (t4 = {});
      var n4 = this, r5 = nt(n4, e20), i5 = t4, a4 = i5.startAt, o5 = i5.onStart, s4 = i5.onStartParams, l4 = i5.immediateRender, u4, d4 = Y.to(n4, Ee({ ease: t4.ease || `none`, lazy: false, immediateRender: false, time: r5, overwrite: `auto`, duration: t4.duration || Math.abs((r5 - (a4 && `time` in a4 ? a4.time : n4._time)) / n4.timeScale()) || c, onStart: function() {
        if (n4.pause(), !u4) {
          var e21 = t4.duration || Math.abs((r5 - (a4 && `time` in a4 ? a4.time : n4._time)) / n4.timeScale());
          d4._dur !== e21 && $e(d4, e21, 0, 1).render(d4._time, true, true), u4 = 1;
        }
        o5 && o5.apply(d4, s4 || []);
      } }, t4));
      return l4 ? d4.render(0) : d4;
    }, o4.tweenFromTo = function(e20, t4, n4) {
      return this.tweenTo(t4, Ee({ startAt: { time: nt(this, e20) } }, n4));
    }, o4.recent = function() {
      return this._recent;
    }, o4.nextLabel = function(e20) {
      return e20 === void 0 && (e20 = this._time), Et(this, nt(this, e20));
    }, o4.previousLabel = function(e20) {
      return e20 === void 0 && (e20 = this._time), Et(this, nt(this, e20), 1);
    }, o4.currentLabel = function(e20) {
      return arguments.length ? this.seek(e20, true) : this.previousLabel(this._time + c);
    }, o4.shiftChildren = function(e20, t4, n4) {
      n4 === void 0 && (n4 = 0);
      var r5 = this._first, i5 = this.labels, a4;
      for (e20 = W(e20); r5; ) r5._start >= n4 && (r5._start += e20, r5._end += e20), r5 = r5._next;
      if (t4) for (a4 in i5) i5[a4] >= n4 && (i5[a4] += e20);
      return Ie(this);
    }, o4.invalidate = function(e20) {
      var t4 = this._first;
      for (this._lock = 0; t4; ) t4.invalidate(e20), t4 = t4._next;
      return r4.prototype.invalidate.call(this, e20);
    }, o4.clear = function(e20) {
      e20 === void 0 && (e20 = true);
      for (var t4 = this._first, n4; t4; ) n4 = t4._next, this.remove(t4), t4 = n4;
      return this._dp && (this._time = this._tTime = this._pTime = 0), e20 && (this.labels = {}), Ie(this);
    }, o4.totalDuration = function(e20) {
      var t4 = 0, n4 = this, r5 = n4._last, i5 = s, a4, o5, c4;
      if (arguments.length) return n4.timeScale((n4._repeat < 0 ? n4.duration() : n4.totalDuration()) / (n4.reversed() ? -e20 : e20));
      if (n4._dirty) {
        for (c4 = n4.parent; r5; ) a4 = r5._prev, r5._dirty && r5.totalDuration(), o5 = r5._start, o5 > i5 && n4._sort && r5._ts && !n4._lock ? (n4._lock = 1, Ke(n4, r5, o5 - r5._delay, 1)._lock = 0) : i5 = o5, o5 < 0 && r5._ts && (t4 -= o5, (!c4 && !n4._dp || c4 && c4.smoothChildTiming) && (n4._start += W(o5 / n4._ts), n4._time -= o5, n4._tTime -= o5), n4.shiftChildren(-o5, false, -1 / 0), i5 = 0), r5._end > t4 && r5._ts && (t4 = r5._end), r5 = a4;
        $e(n4, n4 === P && n4._time > t4 ? n4._time : t4, 1, 1), n4._dirty = 0;
      }
      return n4._tDur;
    }, i4.updateRoot = function(e20) {
      if (P._ts && (Ce(P, He(e20, P)), de = Vt.frame), Vt.frame >= pe) {
        pe += n.autoSleep || 120;
        var t4 = P._first;
        if ((!t4 || !t4._ts) && n.autoSleep && Vt._listeners.length < 2) {
          for (; t4 && !t4._ts; ) t4 = t4._next;
          t4 || Vt.sleep();
        }
      }
    }, i4;
  })(tn);
  Ee(J.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
  var nn = function(e20, t4, n4, r4, i4, a4, o4) {
    var s4 = new X(this._pt, e20, t4, 0, 1, Cn, null, i4), c4 = 0, l4 = 0, u4, d4, f4, p4, m4, h4, g4, _4;
    for (s4.b = n4, s4.e = r4, n4 += ``, r4 += ``, (g4 = ~r4.indexOf(`random(`)) && (r4 = Ct(r4)), a4 && (_4 = [n4, r4], a4(_4, e20, t4), n4 = _4[0], r4 = _4[1]), d4 = n4.match(A) || []; u4 = A.exec(r4); ) p4 = u4[0], m4 = r4.substring(c4, u4.index), f4 ? f4 = (f4 + 1) % 5 : m4.substr(-5) === `rgba(` && (f4 = 1), p4 !== d4[l4++] && (h4 = parseFloat(d4[l4 - 1]) || 0, s4._pt = { _next: s4._pt, p: m4 || l4 === 1 ? m4 : `,`, s: h4, c: p4.charAt(1) === `=` ? ye(h4, p4) - h4 : parseFloat(p4) - h4, m: f4 && f4 < 4 ? Math.round : 0 }, c4 = A.lastIndex);
    return s4.c = c4 < r4.length ? r4.substring(c4, r4.length) : ``, s4.fp = o4, (j.test(r4) || g4) && (s4.e = 0), this._pt = s4, s4;
  };
  var rn = function(e20, t4, r4, i4, a4, o4, s4, c4, l4, u4) {
    g(i4) && (i4 = i4(a4 || 0, e20, o4));
    var d4 = e20[t4], f4 = r4 === `get` ? g(d4) ? l4 ? e20[t4.indexOf(`set`) || !g(e20[`get` + t4.substr(3)]) ? t4 : `get` + t4.substr(3)](l4) : e20[t4]() : d4 : r4, p4 = g(d4) ? l4 ? vn : _n : gn, m4;
    if (h(i4) && (~i4.indexOf(`random(`) && (i4 = Ct(i4)), i4.charAt(1) === `=` && (m4 = ye(f4, i4) + (G(f4) || 0), (m4 || m4 === 0) && (i4 = m4))), !u4 || f4 !== i4 || cn) return !isNaN(f4 * i4) && i4 !== `` ? (m4 = new X(this._pt, e20, t4, +f4 || 0, i4 - (f4 || 0), typeof d4 == `boolean` ? Sn : xn, 0, p4), l4 && (m4.fp = l4), s4 && m4.modifier(s4, this, e20), this._pt = m4) : (!d4 && !(t4 in e20) && te(t4, i4), nn.call(this, e20, t4, f4, i4, p4, c4 || n.stringFilter, l4));
  };
  var an = function(e20, t4, n4, r4, i4) {
    if (g(e20) && (e20 = pn(e20, i4, t4, n4, r4)), !y(e20) || e20.style && e20.nodeType || w(e20) || C(e20)) return h(e20) ? pn(e20, i4, t4, n4, r4) : e20;
    var a4 = {}, o4;
    for (o4 in e20) a4[o4] = pn(e20[o4], i4, t4, n4, r4);
    return a4;
  };
  var on = function(e20, t4, n4, r4, i4, a4) {
    var o4, s4, c4, l4;
    if (V[e20] && (o4 = new V[e20]()).init(i4, o4.rawVars ? t4[e20] : an(t4[e20], r4, i4, a4, n4), n4, r4, a4) !== false && (n4._pt = s4 = new X(n4._pt, i4, e20, 0, 1, o4.render, o4, 0, o4.priority), n4 !== kt)) for (c4 = n4._ptLookup[n4._targets.indexOf(i4)], l4 = o4._props.length; l4--; ) c4[o4._props[l4]] = s4;
    return o4;
  };
  var sn;
  var cn;
  var ln = function e11(t4, n4, o4) {
    var l4 = t4.vars, u4 = l4.ease, d4 = l4.startAt, f4 = l4.immediateRender, p4 = l4.lazy, m4 = l4.onUpdate, h4 = l4.runBackwards, g4 = l4.yoyoEase, _4 = l4.keyframes, v4 = l4.autoRevert, y4 = t4._dur, x4 = t4._startAt, S3 = t4._targets, C3 = t4.parent, w3 = C3 && C3.data === `nested` ? C3.vars.targets : S3, T3 = t4._overwrite === `auto` && !i, E3 = t4.timeline, D3 = l4.easeReverse || g4, O3, k3, A3, j3, M3, N3, F3, I3, L3, R3, z3, B3, ee4;
    if (E3 && (!_4 || !u4) && (u4 = `none`), t4._ease = Yt(u4, r.ease), t4._rEase = D3 && (Yt(D3) || t4._ease), t4._from = !E3 && !!l4.runBackwards, t4._from && (t4.ratio = 1), !E3 || _4 && !l4.stagger) {
      if (I3 = S3[0] ? _e(S3[0]).harness : 0, B3 = I3 && l4[I3.prop], O3 = Ae(l4, ce), x4 && (x4._zTime < 0 && x4.progress(1), n4 < 0 && h4 && f4 && !v4 ? x4.render(-1, true) : x4.revert(h4 && y4 ? oe : ae), x4._lazy = 0), d4) {
        if (Fe(t4._startAt = Y.set(S3, Ee({ data: `isStart`, overwrite: false, parent: C3, immediateRender: true, lazy: !x4 && b(p4), startAt: null, delay: 0, onUpdate: m4 && function() {
          return Dt(t4, `onUpdate`);
        }, stagger: 0 }, d4))), t4._startAt._dp = 0, t4._startAt._sat = t4, n4 < 0 && (a || !f4 && !v4) && t4._startAt.revert(oe), f4 && y4 && n4 <= 0 && o4 <= 0) {
          n4 && (t4._zTime = n4);
          return;
        }
      } else if (h4 && y4 && !x4) {
        if (n4 && (f4 = false), A3 = Ee({ overwrite: false, data: `isFromStart`, lazy: f4 && !x4 && b(p4), immediateRender: f4, stagger: 0, parent: C3 }, O3), B3 && (A3[I3.prop] = B3), Fe(t4._startAt = Y.set(S3, A3)), t4._startAt._dp = 0, t4._startAt._sat = t4, n4 < 0 && (a ? t4._startAt.revert(oe) : t4._startAt.render(-1, true)), t4._zTime = n4, !f4) e11(t4._startAt, c, c);
        else if (!n4) return;
      }
      for (t4._pt = t4._ptCache = 0, p4 = y4 && b(p4) || p4 && !y4, k3 = 0; k3 < S3.length; k3++) {
        if (M3 = S3[k3], F3 = M3._gsap || ge(S3)[k3]._gsap, t4._ptLookup[k3] = R3 = {}, ue[F3.id] && le.length && xe(), z3 = w3 === S3 ? k3 : w3.indexOf(M3), I3 && (L3 = new I3()).init(M3, B3 || O3, t4, z3, w3) !== false && (t4._pt = j3 = new X(t4._pt, M3, L3.name, 0, 1, L3.render, L3, 0, L3.priority), L3._props.forEach(function(e20) {
          R3[e20] = j3;
        }), L3.priority && (N3 = 1)), !I3 || B3) for (A3 in O3) V[A3] && (L3 = on(A3, O3, t4, z3, M3, w3)) ? L3.priority && (N3 = 1) : R3[A3] = j3 = rn.call(t4, M3, A3, `get`, O3[A3], z3, w3, 0, l4.stringFilter);
        t4._op && t4._op[k3] && t4.kill(M3, t4._op[k3]), T3 && t4._pt && (sn = t4, P.killTweensOf(M3, R3, t4.globalTime(n4)), ee4 = !t4.parent, sn = 0), t4._pt && p4 && (ue[F3.id] = 1);
      }
      N3 && On(t4), t4._onInit && t4._onInit(t4);
    }
    t4._onUpdate = m4, t4._initted = (!t4._op || t4._pt) && !ee4, _4 && n4 <= 0 && E3.render(s, true, true);
  };
  var un = function(e20, t4, n4, r4, i4, a4, o4, s4) {
    var c4 = (e20._pt && e20._ptCache || (e20._ptCache = {}))[t4], l4, u4, d4, f4;
    if (!c4) for (c4 = e20._ptCache[t4] = [], d4 = e20._ptLookup, f4 = e20._targets.length; f4--; ) {
      if (l4 = d4[f4][t4], l4 && l4.d && l4.d._pt) for (l4 = l4.d._pt; l4 && l4.p !== t4 && l4.fp !== t4; ) l4 = l4._next;
      if (!l4) return cn = 1, e20.vars[t4] = `+=0`, ln(e20, o4), cn = 0, s4 ? ne(t4 + ` not eligible for reset. Try splitting into individual properties`) : 1;
      c4.push(l4);
    }
    for (f4 = c4.length; f4--; ) u4 = c4[f4], l4 = u4._pt || u4, l4.s = (r4 || r4 === 0) && !i4 ? r4 : l4.s + (r4 || 0) + a4 * l4.c, l4.c = n4 - l4.s, u4.e && (u4.e = U(n4) + G(u4.e)), u4.b && (u4.b = l4.s + G(u4.b));
  };
  var dn = function(e20, t4) {
    var n4 = e20[0] ? _e(e20[0]).harness : 0, r4 = n4 && n4.aliases, i4, a4, o4, s4;
    if (!r4) return t4;
    for (a4 in i4 = Oe({}, t4), r4) if (a4 in i4) for (s4 = r4[a4].split(`,`), o4 = s4.length; o4--; ) i4[s4[o4]] = i4[a4];
    return i4;
  };
  var fn = function(e20, t4, n4, r4) {
    var i4 = t4.ease || r4 || `power1.inOut`, a4, o4;
    if (w(t4)) o4 = n4[e20] || (n4[e20] = []), t4.forEach(function(e21, n5) {
      return o4.push({ t: n5 / (t4.length - 1) * 100, v: e21, e: i4 });
    });
    else for (a4 in t4) o4 = n4[a4] || (n4[a4] = []), a4 === `ease` || o4.push({ t: parseFloat(e20), v: t4[a4], e: i4 });
  };
  var pn = function(e20, t4, n4, r4, i4) {
    return g(e20) ? e20.call(t4, n4, r4, i4) : h(e20) && ~e20.indexOf(`random(`) ? Ct(e20) : e20;
  };
  var mn = he + `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`;
  var hn = {};
  H(mn + `,id,stagger,delay,duration,paused,scrollTrigger`, function(e20) {
    return hn[e20] = 1;
  });
  var Y = (function(r4) {
    t(o4, r4);
    function o4(t4, a4, o5, s5) {
      var l4;
      typeof a4 == `number` && (o5.duration = a4, a4 = o5, o5 = null), l4 = r4.call(this, s5 ? a4 : je(a4)) || this;
      var u4 = l4.vars, d4 = u4.duration, f4 = u4.delay, p4 = u4.immediateRender, m4 = u4.stagger, h4 = u4.overwrite, g4 = u4.keyframes, v4 = u4.defaults, x4 = u4.scrollTrigger, T3 = a4.parent || P, E3 = (w(t4) || C(t4) ? _(t4[0]) : `length` in a4) ? [t4] : ut(t4), D3, O3, k3, A3, j3, M3, N3, F3;
      if (l4._targets = E3.length ? ge(E3) : ne(`GSAP target ` + t4 + ` not found. https://gsap.com`, !n.nullTargetWarn) || [], l4._ptLookup = [], l4._overwrite = h4, g4 || m4 || S(d4) || S(f4)) {
        a4 = l4.vars;
        var I3 = a4.easeReverse || a4.yoyoEase;
        if (D3 = l4.timeline = new J({ data: `nested`, defaults: v4 || {}, targets: T3 && T3.data === `nested` ? T3.vars.targets : E3 }), D3.kill(), D3.parent = D3._dp = e(l4), D3._start = 0, m4 || S(d4) || S(f4)) {
          if (A3 = E3.length, N3 = m4 && pt(m4), y(m4)) for (j3 in m4) ~mn.indexOf(j3) && (F3 || (F3 = {}), F3[j3] = m4[j3]);
          for (O3 = 0; O3 < A3; O3++) k3 = Ae(a4, hn), k3.stagger = 0, I3 && (k3.easeReverse = I3), F3 && Oe(k3, F3), M3 = E3[O3], k3.duration = +pn(d4, e(l4), O3, M3, E3), k3.delay = (+pn(f4, e(l4), O3, M3, E3) || 0) - l4._delay, !m4 && A3 === 1 && k3.delay && (l4._delay = f4 = k3.delay, l4._start += f4, k3.delay = 0), D3.to(M3, k3, N3 ? N3(O3, M3, E3) : 0), D3._ease = q.none;
          D3.duration() ? d4 = f4 = 0 : l4.timeline = 0;
        } else if (g4) {
          je(Ee(D3.vars.defaults, { ease: `none` })), D3._ease = Yt(g4.ease || a4.ease || `none`);
          var L3 = 0, R3, z3, B3;
          if (w(g4)) g4.forEach(function(e20) {
            return D3.to(E3, e20, `>`);
          }), D3.duration();
          else {
            for (j3 in k3 = {}, g4) j3 === `ease` || j3 === `easeEach` || fn(j3, g4[j3], k3, g4.easeEach);
            for (j3 in k3) for (R3 = k3[j3].sort(function(e20, t5) {
              return e20.t - t5.t;
            }), L3 = 0, O3 = 0; O3 < R3.length; O3++) z3 = R3[O3], B3 = { ease: z3.e, duration: (z3.t - (O3 ? R3[O3 - 1].t : 0)) / 100 * d4 }, B3[j3] = z3.v, D3.to(E3, B3, L3), L3 += B3.duration;
            D3.duration() < d4 && D3.to({}, { duration: d4 - D3.duration() });
          }
        }
        d4 || l4.duration(d4 = D3.duration());
      } else l4.timeline = 0;
      return h4 === true && !i && (sn = e(l4), P.killTweensOf(E3), sn = 0), Ke(T3, e(l4), o5), a4.reversed && l4.reverse(), a4.paused && l4.paused(true), (p4 || !d4 && !g4 && l4._start === W(T3._time) && b(p4) && ze(e(l4)) && T3.data !== `nested`) && (l4._tTime = -c, l4.render(Math.max(0, -f4) || 0)), x4 && qe(e(l4), x4), l4;
    }
    var s4 = o4.prototype;
    return s4.render = function(e20, t4, n4) {
      var r5 = this._time, i4 = this._tDur, a4 = this._dur, o5 = e20 < 0, s5 = e20 > i4 - c && !o5 ? i4 : e20 < c ? 0 : e20, l4, u4, d4, f4, p4, m4, h4, g4;
      if (!a4) Ze(this, e20, t4, n4);
      else if (s5 !== this._tTime || !e20 || n4 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o5 || this._lazy) {
        if (l4 = s5, g4 = this.timeline, this._repeat) {
          if (f4 = a4 + this._rDelay, this._repeat < -1 && o5) return this.totalTime(f4 * 100 + e20, t4, n4);
          if (l4 = W(s5 % f4), s5 === i4 ? (d4 = this._repeat, l4 = a4) : (p4 = W(s5 / f4), d4 = ~~p4, d4 && d4 === p4 ? (l4 = a4, d4--) : l4 > a4 && (l4 = a4)), m4 = this._yoyo && d4 & 1, m4 && (l4 = a4 - l4), p4 = Ve(this._tTime, f4), l4 === r5 && !n4 && this._initted && d4 === p4) return this._tTime = s5, this;
          d4 !== p4 && this.vars.repeatRefresh && !m4 && !this._lock && l4 !== f4 && this._initted && (this._lock = n4 = 1, this.render(W(f4 * d4), true).invalidate()._lock = 0);
        }
        if (!this._initted) {
          if (Je(this, o5 ? e20 : l4, n4, t4, s5)) return this._tTime = 0, this;
          if (r5 !== this._time && !(n4 && this.vars.repeatRefresh && d4 !== p4)) return this;
          if (a4 !== this._dur) return this.render(e20, t4, n4);
        }
        if (this._rEase) {
          var _4 = l4 < r5;
          if (_4 !== this._inv) {
            var v4 = _4 ? r5 : a4 - r5;
            this._inv = _4, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = r5, this._invRecip = v4 ? (_4 ? -1 : 1) / v4 : 0, this._invScale = _4 ? -this.ratio : 1 - this.ratio, this._invEase = _4 ? this._rEase : this._ease;
          }
          this.ratio = h4 = this._invRatio + this._invScale * this._invEase((l4 - this._invTime) * this._invRecip);
        } else this.ratio = h4 = this._ease(l4 / a4);
        if (this._from && (this.ratio = h4 = 1 - h4), this._tTime = s5, this._time = l4, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r5 && s5 && !t4 && !p4 && (Dt(this, `onStart`), this._tTime !== s5)) return this;
        for (u4 = this._pt; u4; ) u4.r(h4, u4.d), u4 = u4._next;
        g4 && g4.render(e20 < 0 ? e20 : g4._dur * g4._ease(l4 / this._dur), t4, n4) || this._startAt && (this._zTime = e20), this._onUpdate && !t4 && (o5 && Re(this, e20, t4, n4), Dt(this, `onUpdate`)), this._repeat && d4 !== p4 && this.vars.onRepeat && !t4 && this.parent && Dt(this, `onRepeat`), (s5 === this._tDur || !s5) && this._tTime === s5 && (o5 && !this._onUpdate && Re(this, e20, true, true), (e20 || !a4) && (s5 === this._tDur && this._ts > 0 || !s5 && this._ts < 0) && Fe(this, 1), !t4 && !(o5 && !r5) && (s5 || r5 || m4) && (Dt(this, s5 === i4 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s5 < i4 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, s4.targets = function() {
      return this._targets;
    }, s4.invalidate = function(e20) {
      return (!e20 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e20), r4.prototype.invalidate.call(this, e20);
    }, s4.resetTo = function(e20, t4, n4, r5, i4) {
      Bt || Vt.wake(), this._ts || this.play();
      var a4 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o5;
      return this._initted || ln(this, a4), o5 = this._ease(a4 / this._dur), un(this, e20, t4, n4, r5, o5, a4, i4) ? this.resetTo(e20, t4, n4, r5, 1) : (We(this, 0), this.parent || Ne(this._dp, this, `_first`, `_last`, this._dp._sort ? `_start` : 0), this.render(0));
    }, s4.kill = function(e20, t4) {
      if (t4 === void 0 && (t4 = `all`), !e20 && (!t4 || t4 === `all`)) return this._lazy = this._pt = 0, this.parent ? Ot(this) : this.scrollTrigger && this.scrollTrigger.kill(!!a), this;
      if (this.timeline) {
        var n4 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(e20, t4, sn && sn.vars.overwrite !== true)._first || Ot(this), this.parent && n4 !== this.timeline.totalDuration() && $e(this, this._dur * this.timeline._tDur / n4, 0, 1), this;
      }
      var r5 = this._targets, i4 = e20 ? ut(e20) : r5, o5 = this._ptLookup, s5 = this._pt, c4, l4, u4, d4, f4, p4, m4;
      if ((!t4 || t4 === `all`) && Me(r5, i4)) return t4 === `all` && (this._pt = 0), Ot(this);
      for (c4 = this._op = this._op || [], t4 !== `all` && (h(t4) && (f4 = {}, H(t4, function(e21) {
        return f4[e21] = 1;
      }), t4 = f4), t4 = dn(r5, t4)), m4 = r5.length; m4--; ) if (~i4.indexOf(r5[m4])) for (f4 in l4 = o5[m4], t4 === `all` ? (c4[m4] = t4, d4 = l4, u4 = {}) : (u4 = c4[m4] = c4[m4] || {}, d4 = t4), d4) p4 = l4 && l4[f4], p4 && ((!(`kill` in p4.d) || p4.d.kill(f4) === true) && Pe(this, p4, `_pt`), delete l4[f4]), u4 !== `all` && (u4[f4] = 1);
      return this._initted && !this._pt && s5 && Ot(this), this;
    }, o4.to = function(e20, t4) {
      return new o4(e20, t4, arguments[2]);
    }, o4.from = function(e20, t4) {
      return rt(1, arguments);
    }, o4.delayedCall = function(e20, t4, n4, r5) {
      return new o4(t4, 0, { immediateRender: false, lazy: false, overwrite: false, delay: e20, onComplete: t4, onReverseComplete: t4, onCompleteParams: n4, onReverseCompleteParams: n4, callbackScope: r5 });
    }, o4.fromTo = function(e20, t4, n4) {
      return rt(2, arguments);
    }, o4.set = function(e20, t4) {
      return t4.duration = 0, t4.repeatDelay || (t4.repeat = 0), new o4(e20, t4);
    }, o4.killTweensOf = function(e20, t4, n4) {
      return P.killTweensOf(e20, t4, n4);
    }, o4;
  })(tn);
  Ee(Y.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }), H(`staggerTo,staggerFrom,staggerFromTo`, function(e20) {
    Y[e20] = function() {
      var t4 = new J(), n4 = st.call(arguments, 0);
      return n4.splice(e20 === `staggerFromTo` ? 5 : 4, 0, 0), t4[e20].apply(t4, n4);
    };
  });
  var gn = function(e20, t4, n4) {
    return e20[t4] = n4;
  };
  var _n = function(e20, t4, n4) {
    return e20[t4](n4);
  };
  var vn = function(e20, t4, n4, r4) {
    return e20[t4](r4.fp, n4);
  };
  var yn = function(e20, t4, n4) {
    return e20.setAttribute(t4, n4);
  };
  var bn = function(e20, t4) {
    return g(e20[t4]) ? _n : v(e20[t4]) && e20.setAttribute ? yn : gn;
  };
  var xn = function(e20, t4) {
    return t4.set(t4.t, t4.p, Math.round((t4.s + t4.c * e20) * 1e6) / 1e6, t4);
  };
  var Sn = function(e20, t4) {
    return t4.set(t4.t, t4.p, !!(t4.s + t4.c * e20), t4);
  };
  var Cn = function(e20, t4) {
    var n4 = t4._pt, r4 = ``;
    if (!e20 && t4.b) r4 = t4.b;
    else if (e20 === 1 && t4.e) r4 = t4.e;
    else {
      for (; n4; ) r4 = n4.p + (n4.m ? n4.m(n4.s + n4.c * e20) : Math.round((n4.s + n4.c * e20) * 1e4) / 1e4) + r4, n4 = n4._next;
      r4 += t4.c;
    }
    t4.set(t4.t, t4.p, r4, t4);
  };
  var wn = function(e20, t4) {
    for (var n4 = t4._pt; n4; ) n4.r(e20, n4.d), n4 = n4._next;
  };
  var Tn = function(e20, t4, n4, r4) {
    for (var i4 = this._pt, a4; i4; ) a4 = i4._next, i4.p === r4 && i4.modifier(e20, t4, n4), i4 = a4;
  };
  var En = function(e20) {
    for (var t4 = this._pt, n4, r4; t4; ) r4 = t4._next, t4.p === e20 && !t4.op || t4.op === e20 ? Pe(this, t4, `_pt`) : t4.dep || (n4 = 1), t4 = r4;
    return !n4;
  };
  var Dn = function(e20, t4, n4, r4) {
    r4.mSet(e20, t4, r4.m.call(r4.tween, n4, r4.mt), r4);
  };
  var On = function(e20) {
    for (var t4 = e20._pt, n4, r4, i4, a4; t4; ) {
      for (n4 = t4._next, r4 = i4; r4 && r4.pr > t4.pr; ) r4 = r4._next;
      (t4._prev = r4 ? r4._prev : a4) ? t4._prev._next = t4 : i4 = t4, (t4._next = r4) ? r4._prev = t4 : a4 = t4, t4 = n4;
    }
    e20._pt = i4;
  };
  var X = (function() {
    function e20(e21, t5, n4, r4, i4, a4, o4, s4, c4) {
      this.t = t5, this.s = r4, this.c = i4, this.p = n4, this.r = a4 || xn, this.d = o4 || this, this.set = s4 || gn, this.pr = c4 || 0, this._next = e21, e21 && (e21._prev = this);
    }
    var t4 = e20.prototype;
    return t4.modifier = function(e21, t5, n4) {
      this.mSet = this.mSet || this.set, this.set = Dn, this.m = e21, this.mt = n4, this.tween = t5;
    }, e20;
  })();
  H(he + `parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`, function(e20) {
    return ce[e20] = 1;
  }), R.TweenMax = R.TweenLite = Y, R.TimelineLite = R.TimelineMax = J, P = new J({ sortChildren: false, defaults: r, autoRemoveChildren: true, id: `root`, smoothChildTiming: true }), n.stringFilter = zt;
  var kn = [];
  var An = {};
  var jn = [];
  var Mn = 0;
  var Nn = 0;
  var Pn = function(e20) {
    return (An[e20] || jn).map(function(e21) {
      return e21();
    });
  };
  var Fn = function() {
    var e20 = Date.now(), t4 = [];
    e20 - Mn > 2 && (Pn(`matchMediaInit`), kn.forEach(function(e21) {
      var n4 = e21.queries, r4 = e21.conditions, i4, a4, o4, s4;
      for (a4 in n4) i4 = F.matchMedia(n4[a4]).matches, i4 && (o4 = 1), i4 !== r4[a4] && (r4[a4] = i4, s4 = 1);
      s4 && (e21.revert(), o4 && t4.push(e21));
    }), Pn(`matchMediaRevert`), t4.forEach(function(e21) {
      return e21.onMatch(e21, function(t5) {
        return e21.add(null, t5);
      });
    }), Mn = e20, Pn(`matchMedia`));
  };
  var In = (function() {
    function e20(e21, t5) {
      this.selector = t5 && dt(t5), this.data = [], this._r = [], this.isReverted = false, this.id = Nn++, e21 && this.add(e21);
    }
    var t4 = e20.prototype;
    return t4.add = function(e21, t5, n4) {
      g(e21) && (n4 = t5, t5 = e21, e21 = g);
      var r4 = this, i4 = function() {
        var e22 = o, i5 = r4.selector, a4;
        return e22 && e22 !== r4 && e22.data.push(r4), n4 && (r4.selector = dt(n4)), o = r4, a4 = t5.apply(r4, arguments), g(a4) && r4._r.push(a4), o = e22, r4.selector = i5, r4.isReverted = false, a4;
      };
      return r4.last = i4, e21 === g ? i4(r4, function(e22) {
        return r4.add(null, e22);
      }) : e21 ? r4[e21] = i4 : i4;
    }, t4.ignore = function(e21) {
      var t5 = o;
      o = null, e21(this), o = t5;
    }, t4.getTweens = function() {
      var t5 = [];
      return this.data.forEach(function(n4) {
        return n4 instanceof e20 ? t5.push.apply(t5, n4.getTweens()) : n4 instanceof Y && !(n4.parent && n4.parent.data === `nested`) && t5.push(n4);
      }), t5;
    }, t4.clear = function() {
      this._r.length = this.data.length = 0;
    }, t4.kill = function(e21, t5) {
      var n4 = this;
      if (e21 ? (function() {
        for (var t6 = n4.getTweens(), r5 = n4.data.length, i4; r5--; ) i4 = n4.data[r5], i4.data === `isFlip` && (i4.revert(), i4.getChildren(true, true, false).forEach(function(e22) {
          return t6.splice(t6.indexOf(e22), 1);
        }));
        for (t6.map(function(e22) {
          return { g: e22._dur || e22._delay || e22._sat && !e22._sat.vars.immediateRender ? e22.globalTime(0) : -1 / 0, t: e22 };
        }).sort(function(e22, t7) {
          return t7.g - e22.g || -1 / 0;
        }).forEach(function(t7) {
          return t7.t.revert(e21);
        }), r5 = n4.data.length; r5--; ) i4 = n4.data[r5], i4 instanceof J ? i4.data !== `nested` && (i4.scrollTrigger && i4.scrollTrigger.revert(), i4.kill()) : !(i4 instanceof Y) && i4.revert && i4.revert(e21);
        n4._r.forEach(function(t7) {
          return t7(e21, n4);
        }), n4.isReverted = true;
      })() : this.data.forEach(function(e22) {
        return e22.kill && e22.kill();
      }), this.clear(), t5) for (var r4 = kn.length; r4--; ) kn[r4].id === this.id && kn.splice(r4, 1);
    }, t4.revert = function(e21) {
      this.kill(e21 || {});
    }, e20;
  })();
  var Ln = (function() {
    function e20(e21) {
      this.contexts = [], this.scope = e21, o && o.data.push(this);
    }
    var t4 = e20.prototype;
    return t4.add = function(e21, t5, n4) {
      y(e21) || (e21 = { matches: e21 });
      var r4 = new In(0, n4 || this.scope), i4 = r4.conditions = {}, a4, s4, c4;
      for (s4 in o && !r4.selector && (r4.selector = o.selector), this.contexts.push(r4), t5 = r4.add(`onMatch`, t5), r4.queries = e21, e21) s4 === `all` ? c4 = 1 : (a4 = F.matchMedia(e21[s4]), a4 && (kn.indexOf(r4) < 0 && kn.push(r4), (i4[s4] = a4.matches) && (c4 = 1), a4.addListener ? a4.addListener(Fn) : a4.addEventListener(`change`, Fn)));
      return c4 && t5(r4, function(e22) {
        return r4.add(null, e22);
      }), this;
    }, t4.revert = function(e21) {
      this.kill(e21 || {});
    }, t4.kill = function(e21) {
      this.contexts.forEach(function(t5) {
        return t5.kill(e21, true);
      });
    }, e20;
  })();
  var Rn = { registerPlugin: function() {
    [...arguments].forEach(function(e20) {
      return jt(e20);
    });
  }, timeline: function(e20) {
    return new J(e20);
  }, getTweensOf: function(e20, t4) {
    return P.getTweensOf(e20, t4);
  }, getProperty: function(e20, t4, n4, r4) {
    h(e20) && (e20 = ut(e20)[0]);
    var i4 = _e(e20 || {}).get, a4 = n4 ? Te : we;
    return n4 === `native` && (n4 = ``), e20 && (t4 ? a4((V[t4] && V[t4].get || i4)(e20, t4, n4, r4)) : function(t5, n5, r5) {
      return a4((V[t5] && V[t5].get || i4)(e20, t5, n5, r5));
    });
  }, quickSetter: function(e20, t4, n4) {
    if (e20 = ut(e20), e20.length > 1) {
      var r4 = e20.map(function(e21) {
        return Z.quickSetter(e21, t4, n4);
      }), i4 = r4.length;
      return function(e21) {
        for (var t5 = i4; t5--; ) r4[t5](e21);
      };
    }
    e20 = e20[0] || {};
    var a4 = V[t4], o4 = _e(e20), s4 = o4.harness && (o4.harness.aliases || {})[t4] || t4, c4 = a4 ? function(t5) {
      var r5 = new a4();
      kt._pt = 0, r5.init(e20, n4 ? t5 + n4 : t5, kt, 0, [e20]), r5.render(1, r5), kt._pt && wn(1, kt);
    } : o4.set(e20, s4);
    return a4 ? c4 : function(t5) {
      return c4(e20, s4, n4 ? t5 + n4 : t5, o4, 1);
    };
  }, quickTo: function(e20, t4, n4) {
    var r4, i4 = Z.to(e20, Ee((r4 = {}, r4[t4] = `+=0.1`, r4.paused = true, r4.stagger = 0, r4), n4 || {})), a4 = function(e21, n5, r5) {
      return i4.resetTo(t4, e21, n5, r5);
    };
    return a4.tween = i4, a4;
  }, isTweening: function(e20) {
    return P.getTweensOf(e20, true).length > 0;
  }, defaults: function(e20) {
    return e20 && e20.ease && (e20.ease = Yt(e20.ease, r.ease)), ke(r, e20 || {});
  }, config: function(e20) {
    return ke(n, e20 || {});
  }, registerEffect: function(e20) {
    var t4 = e20.name, n4 = e20.effect, r4 = e20.plugins, i4 = e20.defaults, a4 = e20.extendTimeline;
    (r4 || ``).split(`,`).forEach(function(e21) {
      return e21 && !V[e21] && !R[e21] && ne(t4 + ` effect requires ` + e21 + ` plugin.`);
    }), fe[t4] = function(e21, t5, r5) {
      return n4(ut(e21), Ee(t5 || {}, i4), r5);
    }, a4 && (J.prototype[t4] = function(e21, n5, r5) {
      return this.add(fe[t4](e21, y(n5) ? n5 : (r5 = n5) && {}, this), r5);
    });
  }, registerEase: function(e20, t4) {
    q[e20] = Yt(t4);
  }, parseEase: function(e20, t4) {
    return arguments.length ? Yt(e20, t4) : q;
  }, getById: function(e20) {
    return P.getById(e20);
  }, exportRoot: function(e20, t4) {
    e20 === void 0 && (e20 = {});
    var n4 = new J(e20), r4, i4;
    for (n4.smoothChildTiming = b(e20.smoothChildTiming), P.remove(n4), n4._dp = 0, n4._time = n4._tTime = P._time, r4 = P._first; r4; ) i4 = r4._next, (t4 || !(!r4._dur && r4 instanceof Y && r4.vars.onComplete === r4._targets[0])) && Ke(n4, r4, r4._start - r4._delay), r4 = i4;
    return Ke(P, n4, 0), n4;
  }, context: function(e20, t4) {
    return e20 ? new In(e20, t4) : o;
  }, matchMedia: function(e20) {
    return new Ln(e20);
  }, matchMediaRefresh: function() {
    return kn.forEach(function(e20) {
      var t4 = e20.conditions, n4, r4;
      for (r4 in t4) t4[r4] && (t4[r4] = false, n4 = 1);
      n4 && e20.revert();
    }) || Fn();
  }, addEventListener: function(e20, t4) {
    var n4 = An[e20] || (An[e20] = []);
    ~n4.indexOf(t4) || n4.push(t4);
  }, removeEventListener: function(e20, t4) {
    var n4 = An[e20], r4 = n4 && n4.indexOf(t4);
    r4 >= 0 && n4.splice(r4, 1);
  }, utils: { wrap: xt, wrapYoyo: St, distribute: pt, random: gt, snap: ht, normalize: yt, getUnit: G, clamp: ot, splitColor: Pt, toArray: ut, selector: dt, mapRange: wt, pipe: _t, unitize: vt, interpolate: Tt, shuffle: ft }, install: ee, effects: fe, ticker: Vt, updateRoot: J.updateRoot, plugins: V, globalTimeline: P, core: { PropTween: X, globals: re, Tween: Y, Timeline: J, Animation: tn, getCache: _e, _removeLinkedListItem: Pe, reverting: function() {
    return a;
  }, context: function(e20) {
    return e20 && o && (o.data.push(e20), e20._ctx = o), o;
  }, suppressOverwrites: function(e20) {
    return i = e20;
  } } };
  H(`to,from,fromTo,delayedCall,set,killTweensOf`, function(e20) {
    return Rn[e20] = Y[e20];
  }), Vt.add(J.updateRoot), kt = Rn.to({}, { duration: 0 });
  var zn = function(e20, t4) {
    for (var n4 = e20._pt; n4 && n4.p !== t4 && n4.op !== t4 && n4.fp !== t4; ) n4 = n4._next;
    return n4;
  };
  var Bn = function(e20, t4) {
    var n4 = e20._targets, r4, i4, a4;
    for (r4 in t4) for (i4 = n4.length; i4--; ) a4 = e20._ptLookup[i4][r4], a4 && (a4 = a4.d) && (a4._pt && (a4 = zn(a4, r4)), a4 && a4.modifier && a4.modifier(t4[r4], e20, n4[i4], r4));
  };
  var Vn = function(e20, t4) {
    return { name: e20, headless: 1, rawVars: 1, init: function(e21, n4, r4) {
      r4._onInit = function(e22) {
        var r5, i4;
        if (h(n4) && (r5 = {}, H(n4, function(e23) {
          return r5[e23] = 1;
        }), n4 = r5), t4) {
          for (i4 in r5 = {}, n4) r5[i4] = t4(n4[i4]);
          n4 = r5;
        }
        Bn(e22, n4);
      };
    } };
  };
  var Z = Rn.registerPlugin({ name: `attr`, init: function(e20, t4, n4, r4, i4) {
    var a4, o4, s4;
    for (a4 in this.tween = n4, t4) s4 = e20.getAttribute(a4) || ``, o4 = this.add(e20, `setAttribute`, (s4 || 0) + ``, t4[a4], r4, i4, 0, 0, a4), o4.op = a4, o4.b = s4, this._props.push(a4);
  }, render: function(e20, t4) {
    for (var n4 = t4._pt; n4; ) a ? n4.set(n4.t, n4.p, n4.b, n4) : n4.r(e20, n4.d), n4 = n4._next;
  } }, { name: `endArray`, headless: 1, init: function(e20, t4) {
    for (var n4 = t4.length; n4--; ) this.add(e20, n4, e20[n4] || 0, t4[n4], 0, 0, 0, 0, 0, 1);
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
  var ar = function(e20, t4) {
    return t4.set(t4.t, t4.p, Math.round((t4.s + t4.c * e20) * 1e4) / 1e4 + t4.u, t4);
  };
  var or = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 === 1 ? t4.e : Math.round((t4.s + t4.c * e20) * 1e4) / 1e4 + t4.u, t4);
  };
  var sr = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 ? Math.round((t4.s + t4.c * e20) * 1e4) / 1e4 + t4.u : t4.b, t4);
  };
  var cr = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 === 1 ? t4.e : e20 ? Math.round((t4.s + t4.c * e20) * 1e4) / 1e4 + t4.u : t4.b, t4);
  };
  var lr = function(e20, t4) {
    var n4 = t4.s + t4.c * e20;
    t4.set(t4.t, t4.p, ~~(n4 + (n4 < 0 ? -0.5 : 0.5)) + t4.u, t4);
  };
  var ur = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 ? t4.e : t4.b, t4);
  };
  var dr = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 === 1 ? t4.e : t4.b, t4);
  };
  var fr = function(e20, t4, n4) {
    return e20.style[t4] = n4;
  };
  var pr = function(e20, t4, n4) {
    return e20.style.setProperty(t4, n4);
  };
  var mr = function(e20, t4, n4) {
    return e20._gsap[t4] = n4;
  };
  var hr = function(e20, t4, n4) {
    return e20._gsap.scaleX = e20._gsap.scaleY = n4;
  };
  var gr = function(e20, t4, n4, r4, i4) {
    var a4 = e20._gsap;
    a4.scaleX = a4.scaleY = n4, a4.renderTransform(i4, a4);
  };
  var _r = function(e20, t4, n4, r4, i4) {
    var a4 = e20._gsap;
    a4[t4] = n4, a4.renderTransform(i4, a4);
  };
  var Q = `transform`;
  var $ = Q + `Origin`;
  var vr = function e12(t4, n4) {
    var r4 = this, i4 = this.target, a4 = i4.style, o4 = i4._gsap;
    if (t4 in Xn && a4) {
      if (this.tfm = this.tfm || {}, t4 !== `transform`) t4 = ir[t4] || t4, ~t4.indexOf(`,`) ? t4.split(`,`).forEach(function(e20) {
        return r4.tfm[e20] = Lr(i4, e20);
      }) : this.tfm[t4] = o4.x ? o4[t4] : Lr(i4, t4), t4 === $ && (this.tfm.zOrigin = o4.zOrigin);
      else return ir.transform.split(`,`).forEach(function(t5) {
        return e12.call(r4, t5, n4);
      });
      if (this.props.indexOf(Q) >= 0) return;
      o4.svg && (this.svgo = i4.getAttribute(`data-svg-origin`), this.props.push($, n4, ``)), t4 = Q;
    }
    (a4 || n4) && this.props.push(t4, n4, a4[t4]);
  };
  var yr = function(e20) {
    e20.translate && (e20.removeProperty(`translate`), e20.removeProperty(`scale`), e20.removeProperty(`rotate`));
  };
  var br = function() {
    var e20 = this.props, t4 = this.target, n4 = t4.style, r4 = t4._gsap, i4, a4;
    for (i4 = 0; i4 < e20.length; i4 += 3) e20[i4 + 1] ? e20[i4 + 1] === 2 ? t4[e20[i4]](e20[i4 + 2]) : t4[e20[i4]] = e20[i4 + 2] : e20[i4 + 2] ? n4[e20[i4]] = e20[i4 + 2] : n4.removeProperty(e20[i4].substr(0, 2) === `--` ? e20[i4] : e20[i4].replace(tr, `-$1`).toLowerCase());
    if (this.tfm) {
      for (a4 in this.tfm) r4[a4] = this.tfm[a4];
      r4.svg && (r4.renderTransform(), t4.setAttribute(`data-svg-origin`, this.svgo || ``)), i4 = Jn(), (!i4 || !i4.isStart) && !n4[Q] && (yr(n4), r4.zOrigin && n4[$] && (n4[$] += ` ` + r4.zOrigin + `px`, r4.zOrigin = 0, r4.renderTransform()), r4.uncache = 1);
    }
  };
  var xr = function(e20, t4) {
    var n4 = { target: e20, props: [], revert: br, save: vr };
    return e20._gsap || Z.core.getCache(e20), t4 && e20.style && e20.nodeType && t4.split(`,`).forEach(function(e21) {
      return n4.save(e21);
    }), n4;
  };
  var Sr;
  var Cr = function(e20, t4) {
    var n4 = Un.createElementNS ? Un.createElementNS((t4 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e20) : Un.createElement(e20);
    return n4 && n4.style ? n4 : Un.createElement(e20);
  };
  var wr = function e13(t4, n4, r4) {
    var i4 = getComputedStyle(t4);
    return i4[n4] || i4.getPropertyValue(n4.replace(tr, `-$1`).toLowerCase()) || i4.getPropertyValue(n4) || !r4 && e13(t4, Er(n4) || n4, 1) || ``;
  };
  var Tr = `O,Moz,ms,Ms,Webkit`.split(`,`);
  var Er = function(e20, t4, n4) {
    var r4 = (t4 || Kn).style, i4 = 5;
    if (e20 in r4 && !n4) return e20;
    for (e20 = e20.charAt(0).toUpperCase() + e20.substr(1); i4-- && !(Tr[i4] + e20 in r4); ) ;
    return i4 < 0 ? null : (i4 === 3 ? `ms` : i4 >= 0 ? Tr[i4] : ``) + e20;
  };
  var Dr = function() {
    Yn() && window.document && (Hn = window, Un = Hn.document, Wn = Un.documentElement, Kn = Cr(`div`) || { style: {} }, Cr(`div`), Q = Er(Q), $ = Q + `Origin`, Kn.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`, Sr = !!Er(`perspective`), Jn = Z.core.reverting, Gn = 1);
  };
  var Or = function(e20) {
    var t4 = e20.ownerSVGElement, n4 = Cr(`svg`, t4 && t4.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg`), r4 = e20.cloneNode(true), i4;
    r4.style.display = `block`, n4.appendChild(r4), Wn.appendChild(n4);
    try {
      i4 = r4.getBBox();
    } catch {
    }
    return n4.removeChild(r4), Wn.removeChild(n4), i4;
  };
  var kr = function(e20, t4) {
    for (var n4 = t4.length; n4--; ) if (e20.hasAttribute(t4[n4])) return e20.getAttribute(t4[n4]);
  };
  var Ar = function(e20) {
    var t4, n4;
    try {
      t4 = e20.getBBox();
    } catch {
      t4 = Or(e20), n4 = 1;
    }
    return t4 && (t4.width || t4.height) || n4 || (t4 = Or(e20)), t4 && !t4.width && !t4.x && !t4.y ? { x: +kr(e20, [`x`, `cx`, `x1`]) || 0, y: +kr(e20, [`y`, `cy`, `y1`]) || 0, width: 0, height: 0 } : t4;
  };
  var jr = function(e20) {
    return !!(e20.getCTM && (!e20.parentNode || e20.ownerSVGElement) && Ar(e20));
  };
  var Mr = function(e20, t4) {
    if (t4) {
      var n4 = e20.style, r4;
      t4 in Xn && t4 !== $ && (t4 = Q), n4.removeProperty ? (r4 = t4.substr(0, 2), (r4 === `ms` || t4.substr(0, 6) === `webkit`) && (t4 = `-` + t4), n4.removeProperty(r4 === `--` ? t4 : t4.replace(tr, `-$1`).toLowerCase())) : n4.removeAttribute(t4);
    }
  };
  var Nr = function(e20, t4, n4, r4, i4, a4) {
    var o4 = new X(e20._pt, t4, n4, 0, 1, a4 ? dr : ur);
    return e20._pt = o4, o4.b = r4, o4.e = i4, e20._props.push(n4), o4;
  };
  var Pr = { deg: 1, rad: 1, turn: 1 };
  var Fr = { grid: 1, flex: 1 };
  var Ir = function e14(t4, n4, r4, i4) {
    var a4 = parseFloat(r4) || 0, o4 = (r4 + ``).trim().substr((a4 + ``).length) || `px`, s4 = Kn.style, c4 = nr.test(n4), l4 = t4.tagName.toLowerCase() === `svg`, u4 = (l4 ? `client` : `offset`) + (c4 ? `Width` : `Height`), d4 = 100, f4 = i4 === `px`, p4 = i4 === `%`, m4, h4, g4, _4;
    if (i4 === o4 || !a4 || Pr[i4] || Pr[o4]) return a4;
    if (o4 !== `px` && !f4 && (a4 = e14(t4, n4, r4, `px`)), _4 = t4.getCTM && jr(t4), (p4 || o4 === `%`) && (Xn[n4] || ~n4.indexOf(`adius`))) return m4 = _4 ? t4.getBBox()[c4 ? `width` : `height`] : t4[u4], U(p4 ? a4 / m4 * d4 : a4 / 100 * m4);
    if (s4[c4 ? `width` : `height`] = d4 + (f4 ? o4 : i4), h4 = i4 !== `rem` && ~n4.indexOf(`adius`) || i4 === `em` && t4.appendChild && !l4 ? t4 : t4.parentNode, _4 && (h4 = (t4.ownerSVGElement || {}).parentNode), (!h4 || h4 === Un || !h4.appendChild) && (h4 = Un.body), g4 = h4._gsap, g4 && p4 && g4.width && c4 && g4.time === Vt.time && !g4.uncache) return U(a4 / g4.width * d4);
    if (p4 && (n4 === `height` || n4 === `width`)) {
      var v4 = t4.style[n4];
      t4.style[n4] = d4 + i4, m4 = t4[u4], v4 ? t4.style[n4] = v4 : Mr(t4, n4);
    } else (p4 || o4 === `%`) && !Fr[wr(h4, `display`)] && (s4.position = wr(t4, `position`)), h4 === t4 && (s4.position = `static`), h4.appendChild(Kn), m4 = Kn[u4], h4.removeChild(Kn), s4.position = `absolute`;
    return c4 && p4 && (g4 = _e(h4), g4.time = Vt.time, g4.width = h4[u4]), U(f4 ? m4 * a4 / d4 : m4 && a4 ? d4 / m4 * a4 : 0);
  };
  var Lr = function(e20, t4, n4, r4) {
    var i4;
    return Gn || Dr(), t4 in ir && t4 !== `transform` && (t4 = ir[t4], ~t4.indexOf(`,`) && (t4 = t4.split(`,`)[0])), Xn[t4] && t4 !== `transform` ? (i4 = Yr(e20, r4), i4 = t4 === `transformOrigin` ? i4.svg ? i4.origin : Xr(wr(e20, $)) + ` ` + i4.zOrigin + `px` : i4[t4]) : (i4 = e20.style[t4], (!i4 || i4 === `auto` || r4 || ~(i4 + ``).indexOf(`calc(`)) && (i4 = Hr[t4] && Hr[t4](e20, t4, n4) || wr(e20, t4) || ve(e20, t4) || +(t4 === `opacity`))), n4 && !~(i4 + ``).trim().indexOf(` `) ? Ir(e20, t4, i4, n4) + n4 : i4;
  };
  var Rr = function(e20, t4, r4, i4) {
    if (!r4 || r4 === `none`) {
      var a4 = Er(t4, e20, 1), o4 = a4 && wr(e20, a4, 1);
      o4 && o4 !== r4 ? (t4 = a4, r4 = o4) : t4 === `borderColor` && (r4 = wr(e20, `borderTopColor`));
    }
    var s4 = new X(this._pt, e20.style, t4, 0, 1, Cn), c4 = 0, l4 = 0, u4, d4, f4, p4, m4, h4, g4, _4, v4, y4, b4, x4;
    if (s4.b = r4, s4.e = i4, r4 += ``, i4 += ``, i4.substring(0, 6) === `var(--` && (i4 = wr(e20, i4.substring(4, i4.indexOf(`)`)))), i4 === `auto` && (h4 = e20.style[t4], e20.style[t4] = i4, i4 = wr(e20, t4) || i4, h4 ? e20.style[t4] = h4 : Mr(e20, t4)), u4 = [r4, i4], zt(u4), r4 = u4[0], i4 = u4[1], f4 = r4.match(k) || [], x4 = i4.match(k) || [], x4.length) {
      for (; d4 = k.exec(i4); ) g4 = d4[0], v4 = i4.substring(c4, d4.index), m4 ? m4 = (m4 + 1) % 5 : (v4.substr(-5) === `rgba(` || v4.substr(-5) === `hsla(`) && (m4 = 1), g4 !== (h4 = f4[l4++] || ``) && (p4 = parseFloat(h4) || 0, b4 = h4.substr((p4 + ``).length), g4.charAt(1) === `=` && (g4 = ye(p4, g4) + b4), _4 = parseFloat(g4), y4 = g4.substr((_4 + ``).length), c4 = k.lastIndex - y4.length, y4 || (y4 = y4 || n.units[t4] || b4, c4 === i4.length && (i4 += y4, s4.e += y4)), b4 !== y4 && (p4 = Ir(e20, t4, h4, y4) || 0), s4._pt = { _next: s4._pt, p: v4 || l4 === 1 ? v4 : `,`, s: p4, c: _4 - p4, m: m4 && m4 < 4 || t4 === `zIndex` ? Math.round : 0 });
      s4.c = c4 < i4.length ? i4.substring(c4, i4.length) : ``;
    } else s4.r = t4 === `display` && i4 === `none` ? dr : ur;
    return j.test(i4) && (s4.e = 0), this._pt = s4, s4;
  };
  var zr = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` };
  var Br = function(e20) {
    var t4 = e20.split(` `), n4 = t4[0], r4 = t4[1] || `50%`;
    return (n4 === `top` || n4 === `bottom` || r4 === `left` || r4 === `right`) && (e20 = n4, n4 = r4, r4 = e20), t4[0] = zr[n4] || n4, t4[1] = zr[r4] || r4, t4.join(` `);
  };
  var Vr = function(e20, t4) {
    if (t4.tween && t4.tween._time === t4.tween._dur) {
      var n4 = t4.t, r4 = n4.style, i4 = t4.u, a4 = n4._gsap, o4, s4, c4;
      if (i4 === `all` || i4 === true) r4.cssText = ``, s4 = 1;
      else for (i4 = i4.split(`,`), c4 = i4.length; --c4 > -1; ) o4 = i4[c4], Xn[o4] && (s4 = 1, o4 = o4 === `transformOrigin` ? $ : Q), Mr(n4, o4);
      s4 && (Mr(n4, Q), a4 && (a4.svg && n4.removeAttribute(`transform`), r4.scale = r4.rotate = r4.translate = `none`, Yr(n4, 1), a4.uncache = 1, yr(r4)));
    }
  };
  var Hr = { clearProps: function(e20, t4, n4, r4, i4) {
    if (i4.data !== `isFromStart`) {
      var a4 = e20._pt = new X(e20._pt, t4, n4, 0, 0, Vr);
      return a4.u = r4, a4.pr = -10, a4.tween = i4, e20._props.push(n4), 1;
    }
  } };
  var Ur = [1, 0, 0, 1, 0, 0];
  var Wr = {};
  var Gr = function(e20) {
    return e20 === `matrix(1, 0, 0, 1, 0, 0)` || e20 === `none` || !e20;
  };
  var Kr = function(e20) {
    var t4 = wr(e20, Q);
    return Gr(t4) ? Ur : t4.substr(7).match(O).map(U);
  };
  var qr = function(e20, t4) {
    var n4 = e20._gsap || _e(e20), r4 = e20.style, i4 = Kr(e20), a4, o4, s4, c4;
    return n4.svg && e20.getAttribute(`transform`) ? (s4 = e20.transform.baseVal.consolidate().matrix, i4 = [s4.a, s4.b, s4.c, s4.d, s4.e, s4.f], i4.join(`,`) === `1,0,0,1,0,0` ? Ur : i4) : (i4 === Ur && !e20.offsetParent && e20 !== Wn && !n4.svg && (s4 = r4.display, r4.display = `block`, a4 = e20.parentNode, (!a4 || !e20.offsetParent && !e20.getBoundingClientRect().width) && (c4 = 1, o4 = e20.nextElementSibling, Wn.appendChild(e20)), i4 = Kr(e20), s4 ? r4.display = s4 : Mr(e20, `display`), c4 && (o4 ? a4.insertBefore(e20, o4) : a4 ? a4.appendChild(e20) : Wn.removeChild(e20))), t4 && i4.length > 6 ? [i4[0], i4[1], i4[4], i4[5], i4[12], i4[13]] : i4);
  };
  var Jr = function(e20, t4, n4, r4, i4, a4) {
    var o4 = e20._gsap, s4 = i4 || qr(e20, true), c4 = o4.xOrigin || 0, l4 = o4.yOrigin || 0, u4 = o4.xOffset || 0, d4 = o4.yOffset || 0, f4 = s4[0], p4 = s4[1], m4 = s4[2], h4 = s4[3], g4 = s4[4], _4 = s4[5], v4 = t4.split(` `), y4 = parseFloat(v4[0]) || 0, b4 = parseFloat(v4[1]) || 0, x4, S3, C3, w3;
    n4 ? s4 !== Ur && (S3 = f4 * h4 - p4 * m4) && (C3 = h4 / S3 * y4 + b4 * (-m4 / S3) + (m4 * _4 - h4 * g4) / S3, w3 = y4 * (-p4 / S3) + f4 / S3 * b4 - (f4 * _4 - p4 * g4) / S3, y4 = C3, b4 = w3) : (x4 = Ar(e20), y4 = x4.x + (~v4[0].indexOf(`%`) ? y4 / 100 * x4.width : y4), b4 = x4.y + (~(v4[1] || v4[0]).indexOf(`%`) ? b4 / 100 * x4.height : b4)), r4 || r4 !== false && o4.smooth ? (g4 = y4 - c4, _4 = b4 - l4, o4.xOffset = u4 + (g4 * f4 + _4 * m4) - g4, o4.yOffset = d4 + (g4 * p4 + _4 * h4) - _4) : o4.xOffset = o4.yOffset = 0, o4.xOrigin = y4, o4.yOrigin = b4, o4.smooth = !!r4, o4.origin = t4, o4.originIsAbsolute = !!n4, e20.style[$] = `0px 0px`, a4 && (Nr(a4, o4, `xOrigin`, c4, y4), Nr(a4, o4, `yOrigin`, l4, b4), Nr(a4, o4, `xOffset`, u4, o4.xOffset), Nr(a4, o4, `yOffset`, d4, o4.yOffset)), e20.setAttribute(`data-svg-origin`, y4 + ` ` + b4);
  };
  var Yr = function(e20, t4) {
    var r4 = e20._gsap || new en(e20);
    if (`x` in r4 && !t4 && !r4.uncache) return r4;
    var i4 = e20.style, a4 = r4.scaleX < 0, o4 = `px`, s4 = `deg`, c4 = getComputedStyle(e20), l4 = wr(e20, $) || `0`, u4 = d4 = f4 = h4 = g4 = _4 = v4 = y4 = b4 = 0, d4, f4, p4 = m4 = 1, m4, h4, g4, _4, v4, y4, b4, x4, S3, C3, w3, T3, E3, D3, O3, k3, A3, j3, M3, N3, P3, F3, I3, L3, R3, z3, B3, ee4;
    return r4.svg = !!(e20.getCTM && jr(e20)), c4.translate && ((c4.translate !== `none` || c4.scale !== `none` || c4.rotate !== `none`) && (i4[Q] = (c4.translate === `none` ? `` : `translate3d(` + (c4.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) + `) `) + (c4.rotate === `none` ? `` : `rotate(` + c4.rotate + `) `) + (c4.scale === `none` ? `` : `scale(` + c4.scale.split(` `).join(`,`) + `) `) + (c4[Q] === `none` ? `` : c4[Q])), i4.scale = i4.rotate = i4.translate = `none`), C3 = qr(e20, r4.svg), r4.svg && (r4.uncache ? (P3 = e20.getBBox(), l4 = r4.xOrigin - P3.x + `px ` + (r4.yOrigin - P3.y) + `px`, N3 = ``) : N3 = !t4 && e20.getAttribute(`data-svg-origin`), Jr(e20, N3 || l4, !!N3 || r4.originIsAbsolute, r4.smooth !== false, C3)), x4 = r4.xOrigin || 0, S3 = r4.yOrigin || 0, C3 !== Ur && (D3 = C3[0], O3 = C3[1], k3 = C3[2], A3 = C3[3], u4 = j3 = C3[4], d4 = M3 = C3[5], C3.length === 6 ? (p4 = Math.sqrt(D3 * D3 + O3 * O3), m4 = Math.sqrt(A3 * A3 + k3 * k3), h4 = D3 || O3 ? $n(O3, D3) * Zn : 0, v4 = k3 || A3 ? $n(k3, A3) * Zn + h4 : 0, v4 && (m4 *= Math.abs(Math.cos(v4 * Qn))), r4.svg && (u4 -= x4 - (x4 * D3 + S3 * k3), d4 -= S3 - (x4 * O3 + S3 * A3))) : (ee4 = C3[6], z3 = C3[7], I3 = C3[8], L3 = C3[9], R3 = C3[10], B3 = C3[11], u4 = C3[12], d4 = C3[13], f4 = C3[14], w3 = $n(ee4, R3), g4 = w3 * Zn, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N3 = j3 * T3 + I3 * E3, P3 = M3 * T3 + L3 * E3, F3 = ee4 * T3 + R3 * E3, I3 = j3 * -E3 + I3 * T3, L3 = M3 * -E3 + L3 * T3, R3 = ee4 * -E3 + R3 * T3, B3 = z3 * -E3 + B3 * T3, j3 = N3, M3 = P3, ee4 = F3), w3 = $n(-k3, R3), _4 = w3 * Zn, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N3 = D3 * T3 - I3 * E3, P3 = O3 * T3 - L3 * E3, F3 = k3 * T3 - R3 * E3, B3 = A3 * E3 + B3 * T3, D3 = N3, O3 = P3, k3 = F3), w3 = $n(O3, D3), h4 = w3 * Zn, w3 && (T3 = Math.cos(w3), E3 = Math.sin(w3), N3 = D3 * T3 + O3 * E3, P3 = j3 * T3 + M3 * E3, O3 = O3 * T3 - D3 * E3, M3 = M3 * T3 - j3 * E3, D3 = N3, j3 = P3), g4 && Math.abs(g4) + Math.abs(h4) > 359.9 && (g4 = h4 = 0, _4 = 180 - _4), p4 = U(Math.sqrt(D3 * D3 + O3 * O3 + k3 * k3)), m4 = U(Math.sqrt(M3 * M3 + ee4 * ee4)), w3 = $n(j3, M3), v4 = Math.abs(w3) > 2e-4 ? w3 * Zn : 0, b4 = B3 ? 1 / (B3 < 0 ? -B3 : B3) : 0), r4.svg && (N3 = e20.getAttribute(`transform`), r4.forceCSS = e20.setAttribute(`transform`, ``) || !Gr(wr(e20, Q)), N3 && e20.setAttribute(`transform`, N3))), Math.abs(v4) > 90 && Math.abs(v4) < 270 && (a4 ? (p4 *= -1, v4 += h4 <= 0 ? 180 : -180, h4 += h4 <= 0 ? 180 : -180) : (m4 *= -1, v4 += v4 <= 0 ? 180 : -180)), t4 || (t4 = r4.uncache), r4.x = u4 - ((r4.xPercent = u4 && (!t4 && r4.xPercent || (Math.round(e20.offsetWidth / 2) === Math.round(-u4) ? -50 : 0))) ? e20.offsetWidth * r4.xPercent / 100 : 0) + o4, r4.y = d4 - ((r4.yPercent = d4 && (!t4 && r4.yPercent || (Math.round(e20.offsetHeight / 2) === Math.round(-d4) ? -50 : 0))) ? e20.offsetHeight * r4.yPercent / 100 : 0) + o4, r4.z = f4 + o4, r4.scaleX = U(p4), r4.scaleY = U(m4), r4.rotation = U(h4) + s4, r4.rotationX = U(g4) + s4, r4.rotationY = U(_4) + s4, r4.skewX = v4 + s4, r4.skewY = y4 + s4, r4.transformPerspective = b4 + o4, (r4.zOrigin = parseFloat(l4.split(` `)[2]) || !t4 && r4.zOrigin || 0) && (i4[$] = Xr(l4)), r4.xOffset = r4.yOffset = 0, r4.force3D = n.force3D, r4.renderTransform = r4.svg ? ri : Sr ? ni : Qr, r4.uncache = 0, r4;
  };
  var Xr = function(e20) {
    return (e20 = e20.split(` `))[0] + ` ` + e20[1];
  };
  var Zr = function(e20, t4, n4) {
    var r4 = G(t4);
    return U(parseFloat(t4) + parseFloat(Ir(e20, `x`, n4 + `px`, r4))) + r4;
  };
  var Qr = function(e20, t4) {
    t4.z = `0px`, t4.rotationY = t4.rotationX = `0deg`, t4.force3D = 0, ni(e20, t4);
  };
  var $r = `0deg`;
  var ei = `0px`;
  var ti = `) `;
  var ni = function(e20, t4) {
    var n4 = t4 || this, r4 = n4.xPercent, i4 = n4.yPercent, a4 = n4.x, o4 = n4.y, s4 = n4.z, c4 = n4.rotation, l4 = n4.rotationY, u4 = n4.rotationX, d4 = n4.skewX, f4 = n4.skewY, p4 = n4.scaleX, m4 = n4.scaleY, h4 = n4.transformPerspective, g4 = n4.force3D, _4 = n4.target, v4 = n4.zOrigin, y4 = ``, b4 = g4 === `auto` && e20 && e20 !== 1 || g4 === true;
    if (v4 && (u4 !== $r || l4 !== $r)) {
      var x4 = parseFloat(l4) * Qn, S3 = Math.sin(x4), C3 = Math.cos(x4), w3;
      x4 = parseFloat(u4) * Qn, w3 = Math.cos(x4), a4 = Zr(_4, a4, S3 * w3 * -v4), o4 = Zr(_4, o4, -Math.sin(x4) * -v4), s4 = Zr(_4, s4, C3 * w3 * -v4 + v4);
    }
    h4 !== ei && (y4 += `perspective(` + h4 + ti), (r4 || i4) && (y4 += `translate(` + r4 + `%, ` + i4 + `%) `), (b4 || a4 !== ei || o4 !== ei || s4 !== ei) && (y4 += s4 !== ei || b4 ? `translate3d(` + a4 + `, ` + o4 + `, ` + s4 + `) ` : `translate(` + a4 + `, ` + o4 + ti), c4 !== $r && (y4 += `rotate(` + c4 + ti), l4 !== $r && (y4 += `rotateY(` + l4 + ti), u4 !== $r && (y4 += `rotateX(` + u4 + ti), (d4 !== $r || f4 !== $r) && (y4 += `skew(` + d4 + `, ` + f4 + ti), (p4 !== 1 || m4 !== 1) && (y4 += `scale(` + p4 + `, ` + m4 + ti), _4.style[Q] = y4 || `translate(0, 0)`;
  };
  var ri = function(e20, t4) {
    var n4 = t4 || this, r4 = n4.xPercent, i4 = n4.yPercent, a4 = n4.x, o4 = n4.y, s4 = n4.rotation, c4 = n4.skewX, l4 = n4.skewY, u4 = n4.scaleX, d4 = n4.scaleY, f4 = n4.target, p4 = n4.xOrigin, m4 = n4.yOrigin, h4 = n4.xOffset, g4 = n4.yOffset, _4 = n4.forceCSS, v4 = parseFloat(a4), y4 = parseFloat(o4), b4, x4, S3, C3, w3;
    s4 = parseFloat(s4), c4 = parseFloat(c4), l4 = parseFloat(l4), l4 && (l4 = parseFloat(l4), c4 += l4, s4 += l4), s4 || c4 ? (s4 *= Qn, c4 *= Qn, b4 = Math.cos(s4) * u4, x4 = Math.sin(s4) * u4, S3 = Math.sin(s4 - c4) * -d4, C3 = Math.cos(s4 - c4) * d4, c4 && (l4 *= Qn, w3 = Math.tan(c4 - l4), w3 = Math.sqrt(1 + w3 * w3), S3 *= w3, C3 *= w3, l4 && (w3 = Math.tan(l4), w3 = Math.sqrt(1 + w3 * w3), b4 *= w3, x4 *= w3)), b4 = U(b4), x4 = U(x4), S3 = U(S3), C3 = U(C3)) : (b4 = u4, C3 = d4, x4 = S3 = 0), (v4 && !~(a4 + ``).indexOf(`px`) || y4 && !~(o4 + ``).indexOf(`px`)) && (v4 = Ir(f4, `x`, a4, `px`), y4 = Ir(f4, `y`, o4, `px`)), (p4 || m4 || h4 || g4) && (v4 = U(v4 + p4 - (p4 * b4 + m4 * S3) + h4), y4 = U(y4 + m4 - (p4 * x4 + m4 * C3) + g4)), (r4 || i4) && (w3 = f4.getBBox(), v4 = U(v4 + r4 / 100 * w3.width), y4 = U(y4 + i4 / 100 * w3.height)), w3 = `matrix(` + b4 + `,` + x4 + `,` + S3 + `,` + C3 + `,` + v4 + `,` + y4 + `)`, f4.setAttribute(`transform`, w3), _4 && (f4.style[Q] = w3);
  };
  var ii = function(e20, t4, n4, r4, i4) {
    var a4 = 360, o4 = h(i4), s4 = parseFloat(i4) * (o4 && ~i4.indexOf(`rad`) ? Zn : 1) - r4, c4 = r4 + s4 + `deg`, l4, u4;
    return o4 && (l4 = i4.split(`_`)[1], l4 === `short` && (s4 %= a4, s4 !== s4 % (a4 / 2) && (s4 += s4 < 0 ? a4 : -a4)), l4 === `cw` && s4 < 0 ? s4 = (s4 + a4 * er) % a4 - ~~(s4 / a4) * a4 : l4 === `ccw` && s4 > 0 && (s4 = (s4 - a4 * er) % a4 - ~~(s4 / a4) * a4)), e20._pt = u4 = new X(e20._pt, t4, n4, r4, s4, or), u4.e = c4, u4.u = `deg`, e20._props.push(n4), u4;
  };
  var ai = function(e20, t4) {
    for (var n4 in t4) e20[n4] = t4[n4];
    return e20;
  };
  var oi = function(e20, t4, n4) {
    var r4 = ai({}, n4._gsap), i4 = `perspective,force3D,transformOrigin,svgOrigin`, a4 = n4.style, o4, s4, c4, l4, u4, d4, f4, p4;
    for (s4 in r4.svg ? (c4 = n4.getAttribute(`transform`), n4.setAttribute(`transform`, ``), a4[Q] = t4, o4 = Yr(n4, 1), Mr(n4, Q), n4.setAttribute(`transform`, c4)) : (c4 = getComputedStyle(n4)[Q], a4[Q] = t4, o4 = Yr(n4, 1), a4[Q] = c4), Xn) c4 = r4[s4], l4 = o4[s4], c4 !== l4 && i4.indexOf(s4) < 0 && (f4 = G(c4), p4 = G(l4), u4 = f4 === p4 ? parseFloat(c4) : Ir(n4, s4, c4, p4), d4 = parseFloat(l4), e20._pt = new X(e20._pt, o4, s4, u4, d4 - u4, ar), e20._pt.u = p4 || 0, e20._props.push(s4));
    ai(o4, r4);
  };
  H(`padding,margin,Width,Radius`, function(e20, t4) {
    var n4 = `Top`, r4 = `Right`, i4 = `Bottom`, a4 = `Left`, o4 = (t4 < 3 ? [n4, r4, i4, a4] : [n4 + a4, n4 + r4, i4 + r4, i4 + a4]).map(function(n5) {
      return t4 < 2 ? e20 + n5 : `border` + n5 + e20;
    });
    Hr[t4 > 1 ? `border` + e20 : e20] = function(e21, t5, n5, r5, i5) {
      var a5, s4;
      if (arguments.length < 4) return a5 = o4.map(function(t6) {
        return Lr(e21, t6, n5);
      }), s4 = a5.join(` `), s4.split(a5[0]).length === 5 ? a5[0] : s4;
      a5 = (r5 + ``).split(` `), s4 = {}, o4.forEach(function(e22, t6) {
        return s4[e22] = a5[t6] = a5[t6] || a5[(t6 - 1) / 2 | 0];
      }), e21.init(t5, s4, i5);
    };
  });
  var si = { name: `css`, register: Dr, targetTest: function(e20) {
    return e20.style && e20.nodeType;
  }, init: function(e20, t4, r4, i4, a4) {
    var o4 = this._props, s4 = e20.style, c4 = r4.vars.startAt, l4, u4, d4, f4, p4, m4, g4, _4, v4, y4, b4, x4, S3, C3, w3, T3, E3;
    for (g4 in Gn || Dr(), this.styles = this.styles || xr(e20), T3 = this.styles.props, this.tween = r4, t4) if (g4 !== `autoRound` && (u4 = t4[g4], !(V[g4] && on(g4, t4, r4, i4, e20, a4)))) {
      if (p4 = typeof u4, m4 = Hr[g4], p4 === `function` && (u4 = u4.call(r4, i4, e20, a4), p4 = typeof u4), p4 === `string` && ~u4.indexOf(`random(`) && (u4 = Ct(u4)), m4) m4(this, e20, g4, u4, r4) && (w3 = 1);
      else if (g4.substr(0, 2) === `--`) l4 = (getComputedStyle(e20).getPropertyValue(g4) + ``).trim(), u4 += ``, Lt.lastIndex = 0, Lt.test(l4) || (_4 = G(l4), v4 = G(u4), v4 ? _4 !== v4 && (l4 = Ir(e20, g4, l4, v4) + v4) : _4 && (u4 += _4)), this.add(s4, `setProperty`, l4, u4, i4, a4, 0, 0, g4), o4.push(g4), T3.push(g4, 0, s4[g4]);
      else if (p4 !== `undefined`) {
        if (c4 && g4 in c4 ? (l4 = typeof c4[g4] == `function` ? c4[g4].call(r4, i4, e20, a4) : c4[g4], h(l4) && ~l4.indexOf(`random(`) && (l4 = Ct(l4)), G(l4 + ``) || l4 === `auto` || (l4 += n.units[g4] || G(Lr(e20, g4)) || ``), (l4 + ``).charAt(1) === `=` && (l4 = Lr(e20, g4))) : l4 = Lr(e20, g4), f4 = parseFloat(l4), y4 = p4 === `string` && u4.charAt(1) === `=` && u4.substr(0, 2), y4 && (u4 = u4.substr(2)), d4 = parseFloat(u4), g4 in ir && (g4 === `autoAlpha` && (f4 === 1 && Lr(e20, `visibility`) === `hidden` && d4 && (f4 = 0), T3.push(`visibility`, 0, s4.visibility), Nr(this, s4, `visibility`, f4 ? `inherit` : `hidden`, d4 ? `inherit` : `hidden`, !d4)), g4 !== `scale` && g4 !== `transform` && (g4 = ir[g4], ~g4.indexOf(`,`) && (g4 = g4.split(`,`)[0]))), b4 = g4 in Xn, b4) {
          if (this.styles.save(g4), E3 = u4, p4 === `string` && u4.substring(0, 6) === `var(--`) {
            if (u4 = wr(e20, u4.substring(4, u4.indexOf(`)`))), u4.substring(0, 5) === `calc(`) {
              var D3 = e20.style.perspective;
              e20.style.perspective = u4, u4 = wr(e20, `perspective`), D3 ? e20.style.perspective = D3 : Mr(e20, `perspective`);
            }
            d4 = parseFloat(u4);
          }
          if (x4 || (S3 = e20._gsap, S3.renderTransform && !t4.parseTransform || Yr(e20, t4.parseTransform), C3 = t4.smoothOrigin !== false && S3.smooth, x4 = this._pt = new X(this._pt, s4, Q, 0, 1, S3.renderTransform, S3, 0, -1), x4.dep = 1), g4 === `scale`) this._pt = new X(this._pt, S3, `scaleY`, S3.scaleY, (y4 ? ye(S3.scaleY, y4 + d4) : d4) - S3.scaleY || 0, ar), this._pt.u = 0, o4.push(`scaleY`, g4), g4 += `X`;
          else if (g4 === `transformOrigin`) {
            T3.push($, 0, s4[$]), u4 = Br(u4), S3.svg ? Jr(e20, u4, 0, C3, 0, this) : (v4 = parseFloat(u4.split(` `)[2]) || 0, v4 !== S3.zOrigin && Nr(this, S3, `zOrigin`, S3.zOrigin, v4), Nr(this, s4, g4, Xr(l4), Xr(u4)));
            continue;
          } else if (g4 === `svgOrigin`) {
            Jr(e20, u4, 1, C3, 0, this);
            continue;
          } else if (g4 in Wr) {
            ii(this, S3, g4, f4, y4 ? ye(f4, y4 + u4) : u4);
            continue;
          } else if (g4 === `smoothOrigin`) {
            Nr(this, S3, `smooth`, S3.smooth, u4);
            continue;
          } else if (g4 === `force3D`) {
            S3[g4] = u4;
            continue;
          } else if (g4 === `transform`) {
            oi(this, u4, e20);
            continue;
          }
        } else g4 in s4 || (g4 = Er(g4) || g4);
        if (b4 || (d4 || d4 === 0) && (f4 || f4 === 0) && !rr.test(u4) && g4 in s4) _4 = (l4 + ``).substr((f4 + ``).length), d4 || (d4 = 0), v4 = G(u4) || (g4 in n.units ? n.units[g4] : _4), _4 !== v4 && (f4 = Ir(e20, g4, l4, v4)), this._pt = new X(this._pt, b4 ? S3 : s4, g4, f4, (y4 ? ye(f4, y4 + d4) : d4) - f4, !b4 && (v4 === `px` || g4 === `zIndex`) && t4.autoRound !== false ? lr : ar), this._pt.u = v4 || 0, b4 && E3 !== u4 ? (this._pt.b = l4, this._pt.e = E3, this._pt.r = cr) : _4 !== v4 && v4 !== `%` && (this._pt.b = l4, this._pt.r = sr);
        else if (g4 in s4) Rr.call(this, e20, g4, l4, y4 ? y4 + u4 : u4);
        else if (g4 in e20) this.add(e20, g4, l4 || e20[g4], y4 ? y4 + u4 : u4, i4, a4);
        else if (g4 !== `parseTransform`) {
          te(g4, u4);
          continue;
        }
        b4 || (g4 in s4 ? T3.push(g4, 0, s4[g4]) : typeof e20[g4] == `function` ? T3.push(g4, 2, e20[g4]()) : T3.push(g4, 1, l4 || e20[g4])), o4.push(g4);
      }
    }
    w3 && On(this);
  }, render: function(e20, t4) {
    if (t4.tween._time || !Jn()) for (var n4 = t4._pt; n4; ) n4.r(e20, n4.d), n4 = n4._next;
    else t4.styles.revert();
  }, get: Lr, aliases: ir, getSetter: function(e20, t4, n4) {
    var r4 = ir[t4];
    return r4 && r4.indexOf(`,`) < 0 && (t4 = r4), t4 in Xn && t4 !== $ && (e20._gsap.x || Lr(e20, `x`)) ? n4 && qn === n4 ? t4 === `scale` ? hr : mr : (qn = n4 || {}) && (t4 === `scale` ? gr : _r) : e20.style && !v(e20.style[t4]) ? fr : ~t4.indexOf(`-`) ? pr : bn(e20, t4);
  }, core: { _removeProperty: Mr, _getMatrix: qr } };
  Z.utils.checkPrefix = Er, Z.core.getStyleSaver = xr, (function(e20, t4, r4, i4) {
    var a4 = H(e20 + `,` + t4 + `,` + r4, function(e21) {
      Xn[e21] = 1;
    });
    H(t4, function(e21) {
      n.units[e21] = `deg`, Wr[e21] = 1;
    }), ir[a4[13]] = e20 + `,` + t4, H(i4, function(e21) {
      var t5 = e21.split(`:`);
      ir[t5[1]] = a4[t5[0]];
    });
  })(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`, `rotation,rotationX,rotationY,skewX,skewY`, `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`, `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`), H(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`, function(e20) {
    n.units[e20] = `px`;
  }), Z.registerPlugin(si);
  var ci = Z.registerPlugin(si) || Z;
  ci.core.Tween;

  // public/shopify/plantilla99/assets/js/ScrollTrigger.BTGKJApg.js
  function e15(e20, t4) {
    for (var n4 = 0; n4 < t4.length; n4++) {
      var r4 = t4[n4];
      r4.enumerable = r4.enumerable || false, r4.configurable = true, `value` in r4 && (r4.writable = true), Object.defineProperty(e20, r4.key, r4);
    }
  }
  function t2(t4, n4, r4) {
    return n4 && e15(t4.prototype, n4), r4 && e15(t4, r4), t4;
  }
  var n2;
  var r2;
  var i2;
  var a2;
  var o2;
  var s2;
  var c2;
  var l2;
  var u2;
  var d2;
  var f2;
  var p2;
  var m2;
  var h2 = function() {
    return n2 || typeof window < `u` && (n2 = window.gsap) && n2.registerPlugin && n2;
  };
  var g2 = 1;
  var _2 = [];
  var v2 = [];
  var y2 = [];
  var b2 = Date.now;
  var x2 = function(e20, t4) {
    return t4;
  };
  var S2 = function() {
    var e20 = u2.core, t4 = e20.bridge || {}, n4 = e20._scrollers, r4 = e20._proxies;
    n4.push.apply(n4, v2), r4.push.apply(r4, y2), v2 = n4, y2 = r4, x2 = function(e21, n5) {
      return t4[e21](n5);
    };
  };
  var C2 = function(e20, t4) {
    return ~y2.indexOf(e20) && y2[y2.indexOf(e20) + 1][t4];
  };
  var w2 = function(e20) {
    return !!~d2.indexOf(e20);
  };
  var T2 = function(e20, t4, n4, r4, i4) {
    return e20.addEventListener(t4, n4, { passive: r4 !== false, capture: !!i4 });
  };
  var E2 = function(e20, t4, n4, r4) {
    return e20.removeEventListener(t4, n4, !!r4);
  };
  var D2 = `scrollLeft`;
  var O2 = `scrollTop`;
  var k2 = function() {
    return f2 && f2.isPressed || v2.cache++;
  };
  var A2 = function(e20, t4) {
    var n4 = function n5(r4) {
      if (r4 || r4 === 0) {
        g2 && (i2.history.scrollRestoration = `manual`);
        var a4 = f2 && f2.isPressed;
        r4 = n5.v = Math.round(r4) || (f2 && f2.iOS ? 1 : 0), e20(r4), n5.cacheID = v2.cache, a4 && x2(`ss`, r4);
      } else (t4 || v2.cache !== n5.cacheID || x2(`ref`)) && (n5.cacheID = v2.cache, n5.v = e20());
      return n5.v + n5.offset;
    };
    return n4.offset = 0, e20 && n4;
  };
  var ee2 = { s: D2, p: `left`, p2: `Left`, os: `right`, os2: `Right`, d: `width`, d2: `Width`, a: `x`, sc: A2(function(e20) {
    return arguments.length ? i2.scrollTo(e20, te2.sc()) : i2.pageXOffset || a2[D2] || o2[D2] || s2[D2] || 0;
  }) };
  var te2 = { s: O2, p: `top`, p2: `Top`, os: `bottom`, os2: `Bottom`, d: `height`, d2: `Height`, a: `y`, op: ee2, sc: A2(function(e20) {
    return arguments.length ? i2.scrollTo(ee2.sc(), e20) : i2.pageYOffset || a2[O2] || o2[O2] || s2[O2] || 0;
  }) };
  var ne2 = function(e20, t4) {
    return (t4 && t4._ctx && t4._ctx.selector || n2.utils.toArray)(e20)[0] || (typeof e20 == `string` && n2.config().nullTargetWarn !== false ? console.warn(`Element not found:`, e20) : null);
  };
  var re2 = function(e20, t4) {
    for (var n4 = t4.length; n4--; ) if (t4[n4] === e20 || t4[n4].contains(e20)) return true;
    return false;
  };
  var ie2 = function(e20, t4) {
    var r4 = t4.s, i4 = t4.sc;
    w2(e20) && (e20 = a2.scrollingElement || o2);
    var s4 = v2.indexOf(e20), c4 = i4 === te2.sc ? 1 : 2;
    !~s4 && (s4 = v2.push(e20) - 1), v2[s4 + c4] || T2(e20, `scroll`, k2);
    var l4 = v2[s4 + c4], u4 = l4 || (v2[s4 + c4] = A2(C2(e20, r4), true) || (w2(e20) ? i4 : A2(function(t5) {
      return arguments.length ? e20[r4] = t5 : e20[r4];
    })));
    return u4.target = e20, l4 || (u4.smooth = n2.getProperty(e20, `scrollBehavior`) === `smooth`), u4;
  };
  var ae2 = function(e20, t4, n4) {
    var r4 = e20, i4 = e20, a4 = b2(), o4 = a4, s4 = t4 || 50, c4 = Math.max(500, s4 * 3), l4 = function(e21, t5) {
      var c5 = b2();
      t5 || c5 - a4 > s4 ? (i4 = r4, r4 = e21, o4 = a4, a4 = c5) : n4 ? r4 += e21 : r4 = i4 + (e21 - i4) / (c5 - o4) * (a4 - o4);
    };
    return { update: l4, reset: function() {
      i4 = r4 = n4 ? 0 : r4, o4 = a4 = 0;
    }, getVelocity: function(e21) {
      var t5 = o4, s5 = i4, u4 = b2();
      return (e21 || e21 === 0) && e21 !== r4 && l4(e21), a4 === o4 || u4 - o4 > c4 ? 0 : (r4 + (n4 ? s5 : -s5)) / ((n4 ? u4 : a4) - t5) * 1e3;
    } };
  };
  var oe2 = function(e20, t4) {
    return t4 && !e20._gsapAllow && e20.cancelable !== false && e20.preventDefault(), e20.changedTouches ? e20.changedTouches[0] : e20;
  };
  var se2 = function(e20) {
    var t4 = Math.max.apply(Math, e20), n4 = Math.min.apply(Math, e20);
    return Math.abs(t4) >= Math.abs(n4) ? t4 : n4;
  };
  var ce2 = function() {
    u2 = n2.core.globals().ScrollTrigger, u2 && u2.core && S2();
  };
  var le2 = function(e20) {
    return n2 = e20 || h2(), !r2 && n2 && typeof document < `u` && document.body && (i2 = window, a2 = document, o2 = a2.documentElement, s2 = a2.body, d2 = [i2, a2, o2, s2], n2.utils.clamp, m2 = n2.core.context || function() {
    }, l2 = `onpointerenter` in s2 ? `pointer` : `mouse`, c2 = j2.isTouch = i2.matchMedia && i2.matchMedia(`(hover: none), (pointer: coarse)`).matches ? 1 : `ontouchstart` in i2 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, p2 = j2.eventTypes = (`ontouchstart` in o2 ? `touchstart,touchmove,touchcancel,touchend` : `onpointerdown` in o2 ? `pointerdown,pointermove,pointercancel,pointerup` : `mousedown,mousemove,mouseup,mouseup`).split(`,`), setTimeout(function() {
      return g2 = 0;
    }, 500), r2 = 1), u2 || ce2(), r2;
  };
  ee2.op = te2, v2.cache = 0;
  var j2 = (function() {
    function e20(e21) {
      this.init(e21);
    }
    var d4 = e20.prototype;
    return d4.init = function(e21) {
      r2 || le2(n2) || console.warn(`Please gsap.registerPlugin(Observer)`), u2 || ce2();
      var t4 = e21.tolerance, d5 = e21.dragMinimum, h4 = e21.type, g4 = e21.target, v4 = e21.lineHeight, y4 = e21.debounce, x4 = e21.preventDefault, S3 = e21.onStop, C3 = e21.onStopDelay, D3 = e21.ignore, O3 = e21.wheelSpeed, A3 = e21.event, j3 = e21.onDragStart, M3 = e21.onDragEnd, ue3 = e21.onDrag, N3 = e21.onPress, P3 = e21.onRelease, de3 = e21.onRight, F3 = e21.onLeft, fe3 = e21.onUp, pe3 = e21.onDown, I3 = e21.onChangeX, me3 = e21.onChangeY, he3 = e21.onChange, ge3 = e21.onToggleX, _e3 = e21.onToggleY, ve3 = e21.onHover, ye3 = e21.onHoverEnd, L3 = e21.onMove, be3 = e21.ignoreCheck, R3 = e21.isNormalizer, z3 = e21.onGestureStart, xe3 = e21.onGestureEnd, Se3 = e21.onWheel, B3 = e21.onEnable, V3 = e21.onDisable, Ce3 = e21.onClick, we3 = e21.scrollSpeed, H3 = e21.capture, U3 = e21.allowClicks, Te3 = e21.lockAxis, Ee3 = e21.onLockAxis;
      this.target = g4 = ne2(g4) || o2, this.vars = e21, D3 && (D3 = n2.utils.toArray(D3)), t4 || (t4 = 1e-9), d5 || (d5 = 0), O3 || (O3 = 1), we3 || (we3 = 1), h4 || (h4 = `wheel,touch,pointer`), y4 = y4 !== false, v4 || (v4 = parseFloat(i2.getComputedStyle(s2).lineHeight) || 22);
      var W3, De3, Oe3, ke3, Ae3, je3, G3, K3 = this, Me3 = 0, Ne3 = 0, Pe3 = e21.passive || !x4 && e21.passive !== false, Fe3 = ie2(g4, ee2), q3 = ie2(g4, te2), Ie3 = Fe3(), Le3 = q3(), Re3 = ~h4.indexOf(`touch`) && !~h4.indexOf(`pointer`) && p2[0] === `pointerdown`, ze3 = w2(g4), J3 = g4.ownerDocument || a2, Y3 = [0, 0, 0], Be3 = [0, 0, 0], Ve3 = 0, He3 = function() {
        return Ve3 = b2();
      }, Ue3 = function(e22, t5) {
        return (K3.event = e22) && D3 && re2(e22.target, D3) || t5 && Re3 && e22.pointerType !== `touch` || be3 && be3(e22, t5);
      }, We3 = function() {
        K3._vx.reset(), K3._vy.reset(), De3.pause(), S3 && S3(K3);
      }, Ge3 = function() {
        var e22 = K3.deltaX = se2(Y3), n4 = K3.deltaY = se2(Be3), r4 = Math.abs(e22) >= t4, i4 = Math.abs(n4) >= t4;
        he3 && (r4 || i4) && he3(K3, e22, n4, Y3, Be3), r4 && (de3 && K3.deltaX > 0 && de3(K3), F3 && K3.deltaX < 0 && F3(K3), I3 && I3(K3), ge3 && K3.deltaX < 0 != Me3 < 0 && ge3(K3), Me3 = K3.deltaX, Y3[0] = Y3[1] = Y3[2] = 0), i4 && (pe3 && K3.deltaY > 0 && pe3(K3), fe3 && K3.deltaY < 0 && fe3(K3), me3 && me3(K3), _e3 && K3.deltaY < 0 != Ne3 < 0 && _e3(K3), Ne3 = K3.deltaY, Be3[0] = Be3[1] = Be3[2] = 0), (ke3 || Oe3) && (L3 && L3(K3), Oe3 && (Oe3 = (j3 && Oe3 === 1 && j3(K3), ue3 && ue3(K3), 0)), ke3 = false), je3 && !(je3 = false) && Ee3 && Ee3(K3), Ae3 && (Ae3 = (Se3(K3), false)), W3 = 0;
      }, Ke3 = function(e22, t5, n4) {
        Y3[n4] += e22, Be3[n4] += t5, K3._vx.update(e22), K3._vy.update(t5), y4 ? W3 || (W3 = requestAnimationFrame(Ge3)) : Ge3();
      }, qe3 = function(e22, t5) {
        Te3 && !G3 && (K3.axis = G3 = Math.abs(e22) > Math.abs(t5) ? `x` : `y`, je3 = true), G3 !== `y` && (Y3[2] += e22, K3._vx.update(e22, true)), G3 !== `x` && (Be3[2] += t5, K3._vy.update(t5, true)), y4 ? W3 || (W3 = requestAnimationFrame(Ge3)) : Ge3();
      }, Je3 = function(e22) {
        if (!Ue3(e22, 1)) {
          e22 = oe2(e22, x4);
          var t5 = e22.clientX, n4 = e22.clientY, r4 = t5 - K3.x, i4 = n4 - K3.y, a4 = K3.isDragging;
          K3.x = t5, K3.y = n4, (a4 || (r4 || i4) && (Math.abs(K3.startX - t5) >= d5 || Math.abs(K3.startY - n4) >= d5)) && (Oe3 || (Oe3 = a4 ? 2 : 1), a4 || (K3.isDragging = true), qe3(r4, i4));
        }
      }, Ye3 = K3.onPress = function(e22) {
        Ue3(e22, 1) || e22 && e22.button || (K3.axis = G3 = null, De3.pause(), K3.isPressed = true, e22 = oe2(e22), Me3 = Ne3 = 0, K3.startX = K3.x = e22.clientX, K3.startY = K3.y = e22.clientY, K3._vx.reset(), K3._vy.reset(), T2(R3 ? g4 : J3, p2[1], Je3, Pe3, true), K3.deltaX = K3.deltaY = 0, N3 && N3(K3));
      }, Xe3 = K3.onRelease = function(e22) {
        if (!Ue3(e22, 1)) {
          E2(R3 ? g4 : J3, p2[1], Je3, true);
          var t5 = !isNaN(K3.y - K3.startY), r4 = K3.isDragging, a4 = r4 && (Math.abs(K3.x - K3.startX) > 3 || Math.abs(K3.y - K3.startY) > 3), o4 = oe2(e22);
          !a4 && t5 && (K3._vx.reset(), K3._vy.reset(), x4 && U3 && n2.delayedCall(0.08, function() {
            if (b2() - Ve3 > 300 && !e22.defaultPrevented) {
              if (e22.target.click) e22.target.click();
              else if (J3.createEvent) {
                var t6 = J3.createEvent(`MouseEvents`);
                t6.initMouseEvent(`click`, true, true, i2, 1, o4.screenX, o4.screenY, o4.clientX, o4.clientY, false, false, false, false, 0, null), e22.target.dispatchEvent(t6);
              }
            }
          })), K3.isDragging = K3.isGesturing = K3.isPressed = false, S3 && r4 && !R3 && De3.restart(true), Oe3 && Ge3(), M3 && r4 && M3(K3), P3 && P3(K3, a4);
        }
      }, Ze3 = function(e22) {
        return e22.touches && e22.touches.length > 1 && (K3.isGesturing = true) && z3(e22, K3.isDragging);
      }, Qe3 = function() {
        return (K3.isGesturing = false) || xe3(K3);
      }, $e3 = function(e22) {
        if (!Ue3(e22)) {
          var t5 = Fe3(), n4 = q3();
          Ke3((t5 - Ie3) * we3, (n4 - Le3) * we3, 1), Ie3 = t5, Le3 = n4, S3 && De3.restart(true);
        }
      }, et3 = function(e22) {
        if (!Ue3(e22)) {
          e22 = oe2(e22, x4), Se3 && (Ae3 = true);
          var t5 = (e22.deltaMode === 1 ? v4 : e22.deltaMode === 2 ? i2.innerHeight : 1) * O3;
          Ke3(e22.deltaX * t5, e22.deltaY * t5, 0), S3 && !R3 && De3.restart(true);
        }
      }, tt3 = function(e22) {
        if (!Ue3(e22)) {
          var t5 = e22.clientX, n4 = e22.clientY, r4 = t5 - K3.x, i4 = n4 - K3.y;
          K3.x = t5, K3.y = n4, ke3 = true, S3 && De3.restart(true), (r4 || i4) && qe3(r4, i4);
        }
      }, nt3 = function(e22) {
        K3.event = e22, ve3(K3);
      }, rt3 = function(e22) {
        K3.event = e22, ye3(K3);
      }, it3 = function(e22) {
        return Ue3(e22) || oe2(e22, x4) && Ce3(K3);
      };
      De3 = K3._dc = n2.delayedCall(C3 || 0.25, We3).pause(), K3.deltaX = K3.deltaY = 0, K3._vx = ae2(0, 50, true), K3._vy = ae2(0, 50, true), K3.scrollX = Fe3, K3.scrollY = q3, K3.isDragging = K3.isGesturing = K3.isPressed = false, m2(this), K3.enable = function(e22) {
        return K3.isEnabled || (T2(ze3 ? J3 : g4, `scroll`, k2), h4.indexOf(`scroll`) >= 0 && T2(ze3 ? J3 : g4, `scroll`, $e3, Pe3, H3), h4.indexOf(`wheel`) >= 0 && T2(g4, `wheel`, et3, Pe3, H3), (h4.indexOf(`touch`) >= 0 && c2 || h4.indexOf(`pointer`) >= 0) && (T2(g4, p2[0], Ye3, Pe3, H3), T2(J3, p2[2], Xe3), T2(J3, p2[3], Xe3), U3 && T2(g4, `click`, He3, true, true), Ce3 && T2(g4, `click`, it3), z3 && T2(J3, `gesturestart`, Ze3), xe3 && T2(J3, `gestureend`, Qe3), ve3 && T2(g4, l2 + `enter`, nt3), ye3 && T2(g4, l2 + `leave`, rt3), L3 && T2(g4, l2 + `move`, tt3)), K3.isEnabled = true, K3.isDragging = K3.isGesturing = K3.isPressed = ke3 = Oe3 = false, K3._vx.reset(), K3._vy.reset(), Ie3 = Fe3(), Le3 = q3(), e22 && e22.type && Ye3(e22), B3 && B3(K3)), K3;
      }, K3.disable = function() {
        K3.isEnabled && (_2.filter(function(e22) {
          return e22 !== K3 && w2(e22.target);
        }).length || E2(ze3 ? J3 : g4, `scroll`, k2), K3.isPressed && (K3._vx.reset(), K3._vy.reset(), E2(R3 ? g4 : J3, p2[1], Je3, true)), E2(ze3 ? J3 : g4, `scroll`, $e3, H3), E2(g4, `wheel`, et3, H3), E2(g4, p2[0], Ye3, H3), E2(J3, p2[2], Xe3), E2(J3, p2[3], Xe3), E2(g4, `click`, He3, true), E2(g4, `click`, it3), E2(J3, `gesturestart`, Ze3), E2(J3, `gestureend`, Qe3), E2(g4, l2 + `enter`, nt3), E2(g4, l2 + `leave`, rt3), E2(g4, l2 + `move`, tt3), K3.isEnabled = K3.isPressed = K3.isDragging = false, V3 && V3(K3));
      }, K3.kill = K3.revert = function() {
        K3.disable();
        var e22 = _2.indexOf(K3);
        e22 >= 0 && _2.splice(e22, 1), f2 === K3 && (f2 = 0);
      }, _2.push(K3), R3 && w2(g4) && (f2 = K3), K3.enable(A3);
    }, t2(e20, [{ key: `velocityX`, get: function() {
      return this._vx.getVelocity();
    } }, { key: `velocityY`, get: function() {
      return this._vy.getVelocity();
    } }]), e20;
  })();
  j2.version = `3.15.0`, j2.create = function(e20) {
    return new j2(e20);
  }, j2.register = le2, j2.getAll = function() {
    return _2.slice();
  }, j2.getById = function(e20) {
    return _2.filter(function(t4) {
      return t4.vars.id === e20;
    })[0];
  }, h2() && n2.registerPlugin(j2);
  var M2;
  var ue2;
  var N2;
  var P2;
  var de2;
  var F2;
  var fe2;
  var pe2;
  var I2;
  var me2;
  var he2;
  var ge2;
  var _e2;
  var ve2;
  var ye2;
  var L2;
  var be2;
  var R2;
  var z2;
  var xe2;
  var Se2;
  var B2;
  var V2;
  var Ce2;
  var we2;
  var H2;
  var U2;
  var Te2;
  var Ee2;
  var W2;
  var De2;
  var Oe2;
  var ke2;
  var Ae2;
  var je2 = 1;
  var G2 = Date.now;
  var K2 = G2();
  var Me2 = 0;
  var Ne2 = 0;
  var Pe2 = function(e20, t4, n4) {
    var r4 = qe2(e20) && (e20.substr(0, 6) === `clamp(` || e20.indexOf(`max`) > -1);
    return n4[`_` + t4 + `Clamp`] = r4, r4 ? e20.substr(6, e20.length - 7) : e20;
  };
  var Fe2 = function(e20, t4) {
    return t4 && (!qe2(e20) || e20.substr(0, 6) !== `clamp(`) ? `clamp(` + e20 + `)` : e20;
  };
  var q2 = function e16() {
    return Ne2 && requestAnimationFrame(e16);
  };
  var Ie2 = function() {
    return ve2 = 1;
  };
  var Le2 = function() {
    return ve2 = 0;
  };
  var Re2 = function(e20) {
    return e20;
  };
  var ze2 = function(e20) {
    return Math.round(e20 * 1e5) / 1e5 || 0;
  };
  var J2 = function() {
    return typeof window < `u`;
  };
  var Y2 = function() {
    return M2 || J2() && (M2 = window.gsap) && M2.registerPlugin && M2;
  };
  var Be2 = function(e20) {
    return !!~fe2.indexOf(e20);
  };
  var Ve2 = function(e20) {
    return (e20 === `Height` ? De2 : N2[`inner` + e20]) || de2[`client` + e20] || F2[`client` + e20];
  };
  var He2 = function(e20) {
    return C2(e20, `getBoundingClientRect`) || (Be2(e20) ? function() {
      return pn2.width = N2.innerWidth, pn2.height = De2, pn2;
    } : function() {
      return _t2(e20);
    });
  };
  var Ue2 = function(e20, t4, n4) {
    var r4 = n4.d, i4 = n4.d2, a4 = n4.a;
    return (a4 = C2(e20, `getBoundingClientRect`)) ? function() {
      return a4()[r4];
    } : function() {
      return (t4 ? Ve2(i4) : e20[`client` + i4]) || 0;
    };
  };
  var We2 = function(e20, t4) {
    return !t4 || ~y2.indexOf(e20) ? He2(e20) : function() {
      return pn2;
    };
  };
  var Ge2 = function(e20, t4) {
    var n4 = t4.s, r4 = t4.d2, i4 = t4.d, a4 = t4.a;
    return Math.max(0, (n4 = `scroll` + r4) && (a4 = C2(e20, n4)) ? a4() - He2(e20)()[i4] : Be2(e20) ? (de2[n4] || F2[n4]) - Ve2(r4) : e20[n4] - e20[`offset` + r4]);
  };
  var Ke2 = function(e20, t4) {
    for (var n4 = 0; n4 < z2.length; n4 += 3) (!t4 || ~t4.indexOf(z2[n4 + 1])) && e20(z2[n4], z2[n4 + 1], z2[n4 + 2]);
  };
  var qe2 = function(e20) {
    return typeof e20 == `string`;
  };
  var Je2 = function(e20) {
    return typeof e20 == `function`;
  };
  var Ye2 = function(e20) {
    return typeof e20 == `number`;
  };
  var Xe2 = function(e20) {
    return typeof e20 == `object`;
  };
  var Ze2 = function(e20, t4, n4) {
    return e20 && e20.progress(+!t4) && n4 && e20.pause();
  };
  var Qe2 = function(e20, t4, n4) {
    if (e20.enabled) {
      var r4 = e20._ctx ? e20._ctx.add(function() {
        return t4(e20, n4);
      }) : t4(e20, n4);
      r4 && r4.totalTime && (e20.callbackAnimation = r4);
    }
  };
  var $e2 = Math.abs;
  var et2 = `left`;
  var tt2 = `top`;
  var nt2 = `right`;
  var rt2 = `bottom`;
  var it2 = `width`;
  var at2 = `height`;
  var ot2 = `Right`;
  var st2 = `Left`;
  var ct2 = `Top`;
  var lt2 = `Bottom`;
  var X2 = `padding`;
  var ut2 = `margin`;
  var dt2 = `Width`;
  var ft2 = `Height`;
  var pt2 = `px`;
  var mt2 = function(e20) {
    return N2.getComputedStyle(e20.nodeType === Node.DOCUMENT_NODE ? e20.scrollingElement : e20);
  };
  var ht2 = function(e20) {
    var t4 = mt2(e20).position;
    e20.style.position = t4 === `absolute` || t4 === `fixed` ? t4 : `relative`;
  };
  var gt2 = function(e20, t4) {
    for (var n4 in t4) n4 in e20 || (e20[n4] = t4[n4]);
    return e20;
  };
  var _t2 = function(e20, t4) {
    var n4 = t4 && mt2(e20)[ye2] !== `matrix(1, 0, 0, 1, 0, 0)` && M2.to(e20, { x: 0, y: 0, xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, skewX: 0, skewY: 0 }).progress(1), r4 = e20.getBoundingClientRect ? e20.getBoundingClientRect() : e20.scrollingElement.getBoundingClientRect();
    return n4 && n4.progress(0).kill(), r4;
  };
  var vt2 = function(e20, t4) {
    var n4 = t4.d2;
    return e20[`offset` + n4] || e20[`client` + n4] || 0;
  };
  var yt2 = function(e20) {
    var t4 = [], n4 = e20.labels, r4 = e20.duration(), i4;
    for (i4 in n4) t4.push(n4[i4] / r4);
    return t4;
  };
  var bt2 = function(e20) {
    return function(t4) {
      return M2.utils.snap(yt2(e20), t4);
    };
  };
  var xt2 = function(e20) {
    var t4 = M2.utils.snap(e20), n4 = Array.isArray(e20) && e20.slice(0).sort(function(e21, t5) {
      return e21 - t5;
    });
    return n4 ? function(e21, r4, i4) {
      i4 === void 0 && (i4 = 1e-3);
      var a4;
      if (!r4) return t4(e21);
      if (r4 > 0) {
        for (e21 -= i4, a4 = 0; a4 < n4.length; a4++) if (n4[a4] >= e21) return n4[a4];
        return n4[a4 - 1];
      } else for (a4 = n4.length, e21 += i4; a4--; ) if (n4[a4] <= e21) return n4[a4];
      return n4[0];
    } : function(n5, r4, i4) {
      i4 === void 0 && (i4 = 1e-3);
      var a4 = t4(n5);
      return !r4 || Math.abs(a4 - n5) < i4 || a4 - n5 < 0 == r4 < 0 ? a4 : t4(r4 < 0 ? n5 - e20 : n5 + e20);
    };
  };
  var St2 = function(e20) {
    return function(t4, n4) {
      return xt2(yt2(e20))(t4, n4.direction);
    };
  };
  var Ct2 = function(e20, t4, n4, r4) {
    return n4.split(`,`).forEach(function(n5) {
      return e20(t4, n5, r4);
    });
  };
  var wt2 = function(e20, t4, n4, r4, i4) {
    return e20.addEventListener(t4, n4, { passive: !r4, capture: !!i4 });
  };
  var Tt2 = function(e20, t4, n4, r4) {
    return e20.removeEventListener(t4, n4, !!r4);
  };
  var Et2 = function(e20, t4, n4) {
    n4 && (n4 = n4.wheelHandler), n4 && (e20(t4, `wheel`, n4), e20(t4, `touchmove`, n4));
  };
  var Dt2 = { startColor: `green`, endColor: `red`, indent: 0, fontSize: `16px`, fontWeight: `normal` };
  var Ot2 = { toggleActions: `play`, anticipatePin: 0 };
  var kt2 = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 };
  var At2 = function(e20, t4) {
    if (qe2(e20)) {
      var n4 = e20.indexOf(`=`), r4 = ~n4 ? +(e20.charAt(n4 - 1) + 1) * parseFloat(e20.substr(n4 + 1)) : 0;
      ~n4 && (e20.indexOf(`%`) > n4 && (r4 *= t4 / 100), e20 = e20.substr(0, n4 - 1)), e20 = r4 + (e20 in kt2 ? kt2[e20] * t4 : ~e20.indexOf(`%`) ? parseFloat(e20) * t4 / 100 : parseFloat(e20) || 0);
    }
    return e20;
  };
  var jt2 = function(e20, t4, n4, r4, i4, a4, o4, s4) {
    var c4 = i4.startColor, l4 = i4.endColor, u4 = i4.fontSize, d4 = i4.indent, f4 = i4.fontWeight, p4 = P2.createElement(`div`), m4 = Be2(n4) || C2(n4, `pinType`) === `fixed`, h4 = e20.indexOf(`scroller`) !== -1, g4 = m4 ? F2 : n4.tagName === `IFRAME` ? n4.contentDocument.body : n4, _4 = e20.indexOf(`start`) !== -1, v4 = _4 ? c4 : l4, y4 = `border-color:` + v4 + `;font-size:` + u4 + `;color:` + v4 + `;font-weight:` + f4 + `;pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;`;
    return y4 += `position:` + ((h4 || s4) && m4 ? `fixed;` : `absolute;`), (h4 || s4 || !m4) && (y4 += (r4 === te2 ? nt2 : rt2) + `:` + (a4 + parseFloat(d4)) + `px;`), o4 && (y4 += `box-sizing:border-box;text-align:left;width:` + o4.offsetWidth + `px;`), p4._isStart = _4, p4.setAttribute(`class`, `gsap-marker-` + e20 + (t4 ? ` marker-` + t4 : ``)), p4.style.cssText = y4, p4.innerText = t4 || t4 === 0 ? e20 + `-` + t4 : e20, g4.children[0] ? g4.insertBefore(p4, g4.children[0]) : g4.appendChild(p4), p4._offset = p4[`offset` + r4.op.d2], Mt2(p4, 0, r4, _4), p4;
  };
  var Mt2 = function(e20, t4, n4, r4) {
    var i4 = { display: `block` }, a4 = n4[r4 ? `os2` : `p2`], o4 = n4[r4 ? `p2` : `os2`];
    e20._isFlipped = r4, i4[n4.a + `Percent`] = r4 ? -100 : 0, i4[n4.a] = r4 ? `1px` : 0, i4[`border` + a4 + dt2] = 1, i4[`border` + o4 + dt2] = 0, i4[n4.p] = t4 + `px`, M2.set(e20, i4);
  };
  var Z2 = [];
  var Nt2 = {};
  var Pt2;
  var Q2 = function() {
    return G2() - Me2 > 34 && (Pt2 || (Pt2 = requestAnimationFrame(rn2)));
  };
  var Ft2 = function() {
    (!V2 || !V2.isPressed || V2.startX > F2.clientWidth) && (v2.cache++, V2 ? Pt2 || (Pt2 = requestAnimationFrame(rn2)) : rn2(), Me2 || Vt2(`scrollStart`), Me2 = G2());
  };
  var It2 = function() {
    H2 = N2.innerWidth, we2 = N2.innerHeight;
  };
  var Lt2 = function(e20) {
    v2.cache++, (e20 === true || !_e2 && !B2 && !P2.fullscreenElement && !P2.webkitFullscreenElement && (!Ce2 || H2 !== N2.innerWidth || Math.abs(N2.innerHeight - we2) > N2.innerHeight * 0.25)) && pe2.restart(true);
  };
  var Rt2 = {};
  var zt2 = [];
  var Bt2 = function e17() {
    return Tt2($2, `scrollEnd`, e17) || $t2(true);
  };
  var Vt2 = function(e20) {
    return Rt2[e20] && Rt2[e20].map(function(e21) {
      return e21();
    }) || zt2;
  };
  var Ht2 = [];
  var Ut2 = function(e20) {
    for (var t4 = 0; t4 < Ht2.length; t4 += 5) (!e20 || Ht2[t4 + 4] && Ht2[t4 + 4].query === e20) && (Ht2[t4].style.cssText = Ht2[t4 + 1], Ht2[t4].getBBox && Ht2[t4].setAttribute(`transform`, Ht2[t4 + 2] || ``), Ht2[t4 + 3].uncache = 1);
  };
  var Wt2 = function() {
    return v2.forEach(function(e20) {
      return Je2(e20) && ++e20.cacheID && (e20.rec = e20());
    });
  };
  var Gt2 = function(e20, t4) {
    var n4;
    for (L2 = 0; L2 < Z2.length; L2++) n4 = Z2[L2], n4 && (!t4 || n4._ctx === t4) && (e20 ? n4.kill(1) : n4.revert(true, true));
    Oe2 = true, t4 && Ut2(t4), t4 || Vt2(`revert`);
  };
  var Kt2 = function(e20, t4) {
    v2.cache++, (t4 || !qt2) && v2.forEach(function(e21) {
      return Je2(e21) && e21.cacheID++ && (e21.rec = 0);
    }), qe2(e20) && (N2.history.scrollRestoration = Ee2 = e20);
  };
  var qt2;
  var Jt2 = 0;
  var Yt2;
  var Xt2 = function() {
    if (Yt2 !== Jt2) {
      var e20 = Yt2 = Jt2;
      requestAnimationFrame(function() {
        return e20 === Jt2 && $t2(true);
      });
    }
  };
  var Zt2 = function() {
    F2.appendChild(W2), De2 = !V2 && W2.offsetHeight || N2.innerHeight, F2.removeChild(W2);
  };
  var Qt2 = function(e20) {
    return I2(`.gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end`).forEach(function(t4) {
      return t4.style.display = e20 ? `none` : `block`;
    });
  };
  var $t2 = function(e20, t4) {
    if (de2 = P2.documentElement, F2 = P2.body, fe2 = [N2, P2, de2, F2], Me2 && !e20 && !Oe2) {
      wt2($2, `scrollEnd`, Bt2);
      return;
    }
    Zt2(), qt2 = $2.isRefreshing = true, Oe2 || Wt2();
    var n4 = Vt2(`refreshInit`);
    xe2 && $2.sort(), t4 || Gt2(), v2.forEach(function(e21) {
      Je2(e21) && (e21.smooth && (e21.target.style.scrollBehavior = `auto`), e21(0));
    }), Z2.slice(0).forEach(function(e21) {
      return e21.refresh();
    }), Oe2 = false, Z2.forEach(function(e21) {
      if (e21._subPinOffset && e21.pin) {
        var t5 = e21.vars.horizontal ? `offsetWidth` : `offsetHeight`, n5 = e21.pin[t5];
        e21.revert(true, 1), e21.adjustPinSpacing(e21.pin[t5] - n5), e21.refresh();
      }
    }), ke2 = 1, Qt2(true), Z2.forEach(function(e21) {
      var t5 = Ge2(e21.scroller, e21._dir), n5 = e21.vars.end === `max` || e21._endClamp && e21.end > t5, r4 = e21._startClamp && e21.start >= t5;
      (n5 || r4) && e21.setPositions(r4 ? t5 - 1 : e21.start, n5 ? Math.max(r4 ? t5 : e21.start + 1, t5) : e21.end, true);
    }), Qt2(false), ke2 = 0, n4.forEach(function(e21) {
      return e21 && e21.render && e21.render(-1);
    }), v2.forEach(function(e21) {
      Je2(e21) && (e21.smooth && requestAnimationFrame(function() {
        return e21.target.style.scrollBehavior = `smooth`;
      }), e21.rec && e21(e21.rec));
    }), Kt2(Ee2, 1), pe2.pause(), Jt2++, qt2 = 2, rn2(2), Z2.forEach(function(e21) {
      return Je2(e21.vars.onRefresh) && e21.vars.onRefresh(e21);
    }), qt2 = $2.isRefreshing = false, Vt2(`refresh`);
  };
  var en2 = 0;
  var tn2 = 1;
  var nn2;
  var rn2 = function(e20) {
    if (e20 === 2 || !qt2 && !Oe2) {
      $2.isUpdating = true, nn2 && nn2.update(0);
      var t4 = Z2.length, n4 = G2(), r4 = n4 - K2 >= 50, i4 = t4 && Z2[0].scroll();
      if (tn2 = en2 > i4 ? -1 : 1, qt2 || (en2 = i4), r4 && (Me2 && !ve2 && n4 - Me2 > 200 && (Me2 = 0, Vt2(`scrollEnd`)), he2 = K2, K2 = n4), tn2 < 0) {
        for (L2 = t4; L2-- > 0; ) Z2[L2] && Z2[L2].update(0, r4);
        tn2 = 1;
      } else for (L2 = 0; L2 < t4; L2++) Z2[L2] && Z2[L2].update(0, r4);
      $2.isUpdating = false;
    }
    Pt2 = 0;
  };
  var an2 = [et2, tt2, rt2, nt2, ut2 + lt2, ut2 + ot2, ut2 + ct2, ut2 + st2, `display`, `flexShrink`, `float`, `zIndex`, `gridColumnStart`, `gridColumnEnd`, `gridRowStart`, `gridRowEnd`, `gridArea`, `justifySelf`, `alignSelf`, `placeSelf`, `order`];
  var on2 = an2.concat([it2, at2, `boxSizing`, `max` + dt2, `max` + ft2, `position`, ut2, X2, X2 + ct2, X2 + ot2, X2 + lt2, X2 + st2]);
  var sn2 = function(e20, t4, n4) {
    un2(n4);
    var r4 = e20._gsap;
    if (r4.spacerIsNative) un2(r4.spacerState);
    else if (e20._gsap.swappedIn) {
      var i4 = t4.parentNode;
      i4 && (i4.insertBefore(e20, t4), i4.removeChild(t4));
    }
    e20._gsap.swappedIn = false;
  };
  var cn2 = function(e20, t4, n4, r4) {
    if (!e20._gsap.swappedIn) {
      for (var i4 = an2.length, a4 = t4.style, o4 = e20.style, s4; i4--; ) s4 = an2[i4], a4[s4] = n4[s4];
      a4.position = n4.position === `absolute` ? `absolute` : `relative`, n4.display === `inline` && (a4.display = `inline-block`), o4[rt2] = o4[nt2] = `auto`, a4.flexBasis = n4.flexBasis || `auto`, a4.overflow = `visible`, a4.boxSizing = `border-box`, a4[it2] = vt2(e20, ee2) + pt2, a4[at2] = vt2(e20, te2) + pt2, a4[X2] = o4[ut2] = o4[tt2] = o4[et2] = `0`, un2(r4), o4[it2] = o4[`max` + dt2] = n4[it2], o4[at2] = o4[`max` + ft2] = n4[at2], o4[X2] = n4[X2], e20.parentNode !== t4 && (e20.parentNode.insertBefore(t4, e20), t4.appendChild(e20)), e20._gsap.swappedIn = true;
    }
  };
  var ln2 = /([A-Z])/g;
  var un2 = function(e20) {
    if (e20) {
      var t4 = e20.t.style, n4 = e20.length, r4 = 0, i4, a4;
      for ((e20.t._gsap || M2.core.getCache(e20.t)).uncache = 1; r4 < n4; r4 += 2) a4 = e20[r4 + 1], i4 = e20[r4], a4 ? t4[i4] = a4 : t4[i4] && t4.removeProperty(i4.replace(ln2, `-$1`).toLowerCase());
    }
  };
  var dn2 = function(e20) {
    for (var t4 = on2.length, n4 = e20.style, r4 = [], i4 = 0; i4 < t4; i4++) r4.push(on2[i4], n4[on2[i4]]);
    return r4.t = e20, r4;
  };
  var fn2 = function(e20, t4, n4) {
    for (var r4 = [], i4 = e20.length, a4 = n4 ? 8 : 0, o4; a4 < i4; a4 += 2) o4 = e20[a4], r4.push(o4, o4 in t4 ? t4[o4] : e20[a4 + 1]);
    return r4.t = e20.t, r4;
  };
  var pn2 = { left: 0, top: 0 };
  var mn2 = function(e20, t4, n4, r4, i4, a4, o4, s4, c4, l4, u4, d4, f4, p4) {
    Je2(e20) && (e20 = e20(s4)), qe2(e20) && e20.substr(0, 3) === `max` && (e20 = d4 + (e20.charAt(4) === `=` ? At2(`0` + e20.substr(3), n4) : 0));
    var m4 = f4 ? f4.time() : 0, h4, g4, _4;
    if (f4 && f4.seek(0), isNaN(e20) || (e20 = +e20), Ye2(e20)) f4 && (e20 = M2.utils.mapRange(f4.scrollTrigger.start, f4.scrollTrigger.end, 0, d4, e20)), o4 && Mt2(o4, n4, r4, true);
    else {
      Je2(t4) && (t4 = t4(s4));
      var v4 = (e20 || `0`).split(` `), y4, b4, x4, S3;
      _4 = ne2(t4, s4) || F2, y4 = _t2(_4) || {}, (!y4 || !y4.left && !y4.top) && mt2(_4).display === `none` && (S3 = _4.style.display, _4.style.display = `block`, y4 = _t2(_4), S3 ? _4.style.display = S3 : _4.style.removeProperty(`display`)), b4 = At2(v4[0], y4[r4.d]), x4 = At2(v4[1] || `0`, n4), e20 = y4[r4.p] - c4[r4.p] - l4 + b4 + i4 - x4, o4 && Mt2(o4, x4, r4, n4 - x4 < 20 || o4._isStart && x4 > 20), n4 -= n4 - x4;
    }
    if (p4 && (s4[p4] = e20 || -1e-3, e20 < 0 && (e20 = 0)), a4) {
      var C3 = e20 + n4, w3 = a4._isStart;
      h4 = `scroll` + r4.d2, Mt2(a4, C3, r4, w3 && C3 > 20 || !w3 && (u4 ? Math.max(F2[h4], de2[h4]) : a4.parentNode[h4]) <= C3 + 1), u4 && (c4 = _t2(o4), u4 && (a4.style[r4.op.p] = c4[r4.op.p] - r4.op.m - a4._offset + pt2));
    }
    return f4 && _4 && (h4 = _t2(_4), f4.seek(d4), g4 = _t2(_4), f4._caScrollDist = h4[r4.p] - g4[r4.p], e20 = e20 / f4._caScrollDist * d4), f4 && f4.seek(m4), f4 ? e20 : Math.round(e20);
  };
  var hn2 = /(webkit|moz|length|cssText|inset)/i;
  var gn2 = function(e20, t4, n4, r4) {
    if (e20.parentNode !== t4) {
      var i4 = e20.style, a4, o4;
      if (t4 === F2) {
        for (a4 in e20._stOrig = i4.cssText, o4 = mt2(e20), o4) !+a4 && !hn2.test(a4) && o4[a4] && typeof i4[a4] == `string` && a4 !== `0` && (i4[a4] = o4[a4]);
        i4.top = n4, i4.left = r4;
      } else i4.cssText = e20._stOrig;
      M2.core.getCache(e20).uncache = 1, t4.appendChild(e20);
    }
  };
  var _n2 = function(e20, t4, n4) {
    var r4 = t4, i4 = r4;
    return function(t5) {
      var a4 = Math.round(e20());
      return a4 !== r4 && a4 !== i4 && Math.abs(a4 - r4) > 3 && Math.abs(a4 - i4) > 3 && (t5 = a4, n4 && n4()), i4 = r4, r4 = Math.round(t5), r4;
    };
  };
  var vn2 = function(e20, t4, n4) {
    var r4 = {};
    r4[t4.p] = `+=` + n4, M2.set(e20, r4);
  };
  var yn2 = function(e20, t4) {
    var n4 = ie2(e20, t4), r4 = `_scroll` + t4.p2, i4 = function t5(i5, a4, o4, s4, c4) {
      var l4 = t5.tween, u4 = a4.onComplete, d4 = {};
      o4 || (o4 = n4());
      var f4 = _n2(n4, o4, function() {
        l4.kill(), t5.tween = 0;
      });
      return c4 = s4 && c4 || 0, s4 || (s4 = i5 - o4), l4 && l4.kill(), a4[r4] = i5, a4.inherit = false, a4.modifiers = d4, d4[r4] = function() {
        return f4(o4 + s4 * l4.ratio + c4 * l4.ratio * l4.ratio);
      }, a4.onUpdate = function() {
        v2.cache++, t5.tween && rn2();
      }, a4.onComplete = function() {
        t5.tween = 0, u4 && u4.call(l4);
      }, l4 = t5.tween = M2.to(e20, a4), l4;
    };
    return e20[r4] = n4, n4.wheelHandler = function() {
      return i4.tween && i4.tween.kill() && (i4.tween = 0);
    }, wt2(e20, `wheel`, n4.wheelHandler), $2.isTouch && wt2(e20, `touchmove`, n4.wheelHandler), i4;
  };
  var $2 = (function() {
    function e20(t5, n4) {
      ue2 || e20.register(M2) || console.warn(`Please gsap.registerPlugin(ScrollTrigger)`), Te2(this), this.init(t5, n4);
    }
    var t4 = e20.prototype;
    return t4.init = function(t5, n4) {
      if (this.progress = this.start = 0, this.vars && this.kill(true, true), !Ne2) {
        this.update = this.refresh = this.kill = Re2;
        return;
      }
      t5 = gt2(qe2(t5) || Ye2(t5) || t5.nodeType ? { trigger: t5 } : t5, Ot2);
      var r4 = t5, i4 = r4.onUpdate, a4 = r4.toggleClass, o4 = r4.id, s4 = r4.onToggle, c4 = r4.onRefresh, l4 = r4.scrub, u4 = r4.trigger, d4 = r4.pin, f4 = r4.pinSpacing, p4 = r4.invalidateOnRefresh, m4 = r4.anticipatePin, h4 = r4.onScrubComplete, g4 = r4.onSnapComplete, _4 = r4.once, b4 = r4.snap, x4 = r4.pinReparent, S3 = r4.pinSpacer, w3 = r4.containerAnimation, T3 = r4.fastScrollEnd, E3 = r4.preventOverlaps, D3 = t5.horizontal || t5.containerAnimation && t5.horizontal !== false ? ee2 : te2, O3 = !l4 && l4 !== 0, k3 = ne2(t5.scroller || N2), A3 = M2.core.getCache(k3), re3 = Be2(k3), ae3 = (`pinType` in t5 ? t5.pinType : C2(k3, `pinType`) || re3 && `fixed`) === `fixed`, oe3 = [t5.onEnter, t5.onLeave, t5.onEnterBack, t5.onLeaveBack], se3 = O3 && t5.toggleActions.split(` `), ce3 = `markers` in t5 ? t5.markers : Ot2.markers, le3 = re3 ? 0 : parseFloat(mt2(k3)[`border` + D3.p2 + dt2]) || 0, j3 = this, ue3 = t5.onRefreshInit && function() {
        return t5.onRefreshInit(j3);
      }, fe3 = Ue2(k3, re3, D3), pe3 = We2(k3, re3), ge3 = 0, ye3 = 0, be3 = 0, R3 = ie2(k3, D3), z3, B3, V3, Ce3, we3, H3, U3, Te3, Ee3, W3, De3, Oe3, K3, q3, Ie3, Le3, J3, Y3, Ve3, He3, Ke3, et3, tt3, nt3, rt3, yt3, Ct3, Et3, kt3, Mt3, Pt3, Q3, It3, Rt3, zt3, Vt3, Ht3, Ut3, Wt3;
      if (j3._startClamp = j3._endClamp = false, j3._dir = D3, m4 *= 45, j3.scroller = k3, j3.scroll = w3 ? w3.time.bind(w3) : R3, Ce3 = R3(), j3.vars = t5, n4 || (n4 = t5.animation), `refreshPriority` in t5 && (xe2 = 1, t5.refreshPriority === -9999 && (nn2 = j3)), A3.tweenScroll = A3.tweenScroll || { top: yn2(k3, te2), left: yn2(k3, ee2) }, j3.tweenTo = z3 = A3.tweenScroll[D3.p], j3.scrubDuration = function(e21) {
        It3 = Ye2(e21) && e21, It3 ? Q3 ? Q3.duration(e21) : Q3 = M2.to(n4, { ease: `expo`, totalProgress: `+=0`, inherit: false, duration: It3, paused: true, onComplete: function() {
          return h4 && h4(j3);
        } }) : (Q3 && Q3.progress(1).kill(), Q3 = 0);
      }, n4 && (n4.vars.lazy = false, n4._initted && !j3.isReverted || n4.vars.immediateRender !== false && t5.immediateRender !== false && n4.duration() && n4.render(0, true, true), j3.animation = n4.pause(), n4.scrollTrigger = j3, j3.scrubDuration(l4), Mt3 = 0, o4 || (o4 = n4.vars.id)), b4 && ((!Xe2(b4) || b4.push) && (b4 = { snapTo: b4 }), `scrollBehavior` in F2.style && M2.set(re3 ? [F2, de2] : k3, { scrollBehavior: `auto` }), v2.forEach(function(e21) {
        return Je2(e21) && e21.target === (re3 ? P2.scrollingElement || de2 : k3) && (e21.smooth = false);
      }), V3 = Je2(b4.snapTo) ? b4.snapTo : b4.snapTo === `labels` ? bt2(n4) : b4.snapTo === `labelsDirectional` ? St2(n4) : b4.directional === false ? M2.utils.snap(b4.snapTo) : function(e21, t6) {
        return xt2(b4.snapTo)(e21, G2() - ye3 < 500 ? 0 : t6.direction);
      }, Rt3 = b4.duration || { min: 0.1, max: 2 }, Rt3 = Xe2(Rt3) ? me2(Rt3.min, Rt3.max) : me2(Rt3, Rt3), zt3 = M2.delayedCall(b4.delay || It3 / 2 || 0.1, function() {
        var e21 = R3(), t6 = G2() - ye3 < 500, r5 = z3.tween;
        if ((t6 || Math.abs(j3.getVelocity()) < 10) && !r5 && !ve2 && ge3 !== e21) {
          var i5 = (e21 - H3) / q3, a5 = n4 && !O3 ? n4.totalProgress() : i5, o5 = t6 ? 0 : (a5 - Pt3) / (G2() - he2) * 1e3 || 0, s5 = M2.utils.clamp(-i5, 1 - i5, $e2(o5 / 2) * o5 / 0.185), c5 = i5 + (b4.inertia === false ? 0 : s5), l5, u5, d5 = b4, f5 = d5.onStart, p5 = d5.onInterrupt, m5 = d5.onComplete;
          if (l5 = V3(c5, j3), Ye2(l5) || (l5 = c5), u5 = Math.max(0, Math.round(H3 + l5 * q3)), e21 <= U3 && e21 >= H3 && u5 !== e21) {
            if (r5 && !r5._initted && r5.data <= $e2(u5 - e21)) return;
            b4.inertia === false && (s5 = l5 - i5), z3(u5, { duration: Rt3($e2(Math.max($e2(c5 - a5), $e2(l5 - a5)) * 0.185 / o5 / 0.05 || 0)), ease: b4.ease || `power3`, data: $e2(u5 - e21), onInterrupt: function() {
              return zt3.restart(true) && p5 && Qe2(j3, p5);
            }, onComplete: function() {
              j3.update(), ge3 = R3(), n4 && !O3 && (Q3 ? Q3.resetTo(`totalProgress`, l5, n4._tTime / n4._tDur) : n4.progress(l5)), Mt3 = Pt3 = n4 && !O3 ? n4.totalProgress() : j3.progress, g4 && g4(j3), m5 && Qe2(j3, m5);
            } }, e21, s5 * q3, u5 - e21 - s5 * q3), f5 && Qe2(j3, f5, z3.tween);
          }
        } else j3.isActive && ge3 !== e21 && zt3.restart(true);
      }).pause()), o4 && (Nt2[o4] = j3), u4 = j3.trigger = ne2(u4 || d4 !== true && d4), Wt3 = u4 && u4._gsap && u4._gsap.stRevert, Wt3 && (Wt3 = Wt3(j3)), d4 = d4 === true ? u4 : ne2(d4), qe2(a4) && (a4 = { targets: u4, className: a4 }), d4 && (f4 === false || f4 === ut2 || (f4 = !f4 && d4.parentNode && d4.parentNode.style && mt2(d4.parentNode).display === `flex` ? false : X2), j3.pin = d4, B3 = M2.core.getCache(d4), B3.spacer ? Ie3 = B3.pinState : (S3 && (S3 = ne2(S3), S3 && !S3.nodeType && (S3 = S3.current || S3.nativeElement), B3.spacerIsNative = !!S3, S3 && (B3.spacerState = dn2(S3))), B3.spacer = Y3 = S3 || P2.createElement(`div`), Y3.classList.add(`pin-spacer`), o4 && Y3.classList.add(`pin-spacer-` + o4), B3.pinState = Ie3 = dn2(d4)), t5.force3D !== false && M2.set(d4, { force3D: true }), j3.spacer = Y3 = B3.spacer, kt3 = mt2(d4), nt3 = kt3[f4 + D3.os2], He3 = M2.getProperty(d4), Ke3 = M2.quickSetter(d4, D3.a, pt2), cn2(d4, Y3, kt3), J3 = dn2(d4)), ce3) {
        Oe3 = Xe2(ce3) ? gt2(ce3, Dt2) : Dt2, W3 = jt2(`scroller-start`, o4, k3, D3, Oe3, 0), De3 = jt2(`scroller-end`, o4, k3, D3, Oe3, 0, W3), Ve3 = W3[`offset` + D3.op.d2];
        var Gt3 = ne2(C2(k3, `content`) || k3);
        Te3 = this.markerStart = jt2(`start`, o4, Gt3, D3, Oe3, Ve3, 0, w3), Ee3 = this.markerEnd = jt2(`end`, o4, Gt3, D3, Oe3, Ve3, 0, w3), w3 && (Ut3 = M2.quickSetter([Te3, Ee3], D3.a, pt2)), !ae3 && !(y2.length && C2(k3, `fixedMarkers`) === true) && (ht2(re3 ? F2 : k3), M2.set([W3, De3], { force3D: true }), yt3 = M2.quickSetter(W3, D3.a, pt2), Et3 = M2.quickSetter(De3, D3.a, pt2));
      }
      if (w3) {
        var Kt3 = w3.vars.onUpdate, Jt3 = w3.vars.onUpdateParams;
        w3.eventCallback(`onUpdate`, function() {
          j3.update(0, 0, 1), Kt3 && Kt3.apply(w3, Jt3 || []);
        });
      }
      if (j3.previous = function() {
        return Z2[Z2.indexOf(j3) - 1];
      }, j3.next = function() {
        return Z2[Z2.indexOf(j3) + 1];
      }, j3.revert = function(e21, t6) {
        if (!t6) return j3.kill(true);
        var r5 = e21 !== false || !j3.enabled, i5 = _e2;
        r5 !== j3.isReverted && (r5 && (Vt3 = Math.max(R3(), j3.scroll.rec || 0), be3 = j3.progress, Ht3 = n4 && n4.progress()), Te3 && [Te3, Ee3, W3, De3].forEach(function(e22) {
          return e22.style.display = r5 ? `none` : `block`;
        }), r5 && (_e2 = j3, j3.update(r5)), d4 && (!x4 || !j3.isActive) && (r5 ? sn2(d4, Y3, Ie3) : cn2(d4, Y3, mt2(d4), rt3)), r5 || j3.update(r5), _e2 = i5, j3.isReverted = r5);
      }, j3.refresh = function(r5, i5, a5, o5) {
        if (!((_e2 || !j3.enabled) && !i5)) {
          if (d4 && r5 && Me2) {
            wt2(e20, `scrollEnd`, Bt2);
            return;
          }
          !qt2 && ue3 && ue3(j3), _e2 = j3, z3.tween && !a5 && (z3.tween.kill(), z3.tween = 0), Q3 && Q3.pause(), p4 && n4 && (n4.revert({ kill: false }).invalidate(), n4.getChildren ? n4.getChildren(true, true, false).forEach(function(e21) {
            return e21.vars.immediateRender && e21.render(0, true, true);
          }) : n4.vars.immediateRender && n4.render(0, true, true)), j3.isReverted || j3.revert(true, true), j3._subPinOffset = false;
          var s5 = fe3(), l5 = pe3(), m5 = w3 ? w3.duration() : Ge2(k3, D3), h5 = q3 <= 0.01 || !q3, g5 = 0, _5 = o5 || 0, v4 = Xe2(a5) ? a5.end : t5.end, y4 = t5.endTrigger || u4, b5 = Xe2(a5) ? a5.start : t5.start || (t5.start === 0 || !u4 ? 0 : d4 ? `0 0` : `0 100%`), S4 = j3.pinnedContainer = t5.pinnedContainer && ne2(t5.pinnedContainer, j3), C3 = u4 && Math.max(0, Z2.indexOf(j3)) || 0, T4 = C3, E4, A4, oe4, se4, N3, I3, me3, he3, ve3, L3, xe3, B4, V4;
          for (ce3 && Xe2(a5) && (B4 = M2.getProperty(W3, D3.p), V4 = M2.getProperty(De3, D3.p)); T4-- > 0; ) I3 = Z2[T4], I3.end || I3.refresh(0, 1) || (_e2 = j3), me3 = I3.pin, me3 && (me3 === u4 || me3 === d4 || me3 === S4) && !I3.isReverted && (L3 || (L3 = []), L3.unshift(I3), I3.revert(true, true)), I3 !== Z2[T4] && (C3--, T4--);
          for (Je2(b5) && (b5 = b5(j3)), b5 = Pe2(b5, `start`, j3), H3 = mn2(b5, u4, s5, D3, R3(), Te3, W3, j3, l5, le3, ae3, m5, w3, j3._startClamp && `_startClamp`) || (d4 ? -1e-3 : 0), Je2(v4) && (v4 = v4(j3)), qe2(v4) && !v4.indexOf(`+=`) && (~v4.indexOf(` `) ? v4 = (qe2(b5) ? b5.split(` `)[0] : ``) + v4 : (g5 = At2(v4.substr(2), s5), v4 = qe2(b5) ? b5 : (w3 ? M2.utils.mapRange(0, w3.duration(), w3.scrollTrigger.start, w3.scrollTrigger.end, H3) : H3) + g5, y4 = u4)), v4 = Pe2(v4, `end`, j3), U3 = Math.max(H3, mn2(v4 || (y4 ? `100% 0` : m5), y4, s5, D3, R3() + g5, Ee3, De3, j3, l5, le3, ae3, m5, w3, j3._endClamp && `_endClamp`)) || -1e-3, g5 = 0, T4 = C3; T4--; ) I3 = Z2[T4] || {}, me3 = I3.pin, me3 && I3.start - I3._pinPush <= H3 && !w3 && I3.end > 0 && (E4 = I3.end - (j3._startClamp ? Math.max(0, I3.start) : I3.start), (me3 === u4 && I3.start - I3._pinPush < H3 || me3 === S4) && isNaN(b5) && (g5 += E4 * (1 - I3.progress)), me3 === d4 && (_5 += E4));
          if (H3 += g5, U3 += g5, j3._startClamp && (j3._startClamp += g5), j3._endClamp && !qt2 && (j3._endClamp = U3 || -1e-3, U3 = Math.min(U3, Ge2(k3, D3))), q3 = U3 - H3 || (H3 -= 0.01) && 1e-3, h5 && (be3 = M2.utils.clamp(0, 1, M2.utils.normalize(H3, U3, Vt3))), j3._pinPush = _5, Te3 && g5 && (E4 = {}, E4[D3.a] = `+=` + g5, S4 && (E4[D3.p] = `-=` + R3()), M2.set([Te3, Ee3], E4)), d4 && !(ke2 && j3.end >= Ge2(k3, D3))) E4 = mt2(d4), se4 = D3 === te2, oe4 = R3(), et3 = parseFloat(He3(D3.a)) + _5, !m5 && U3 > 1 && (xe3 = (re3 ? P2.scrollingElement || de2 : k3).style, xe3 = { style: xe3, value: xe3[`overflow` + D3.a.toUpperCase()] }, re3 && mt2(F2)[`overflow` + D3.a.toUpperCase()] !== `scroll` && (xe3.style[`overflow` + D3.a.toUpperCase()] = `scroll`)), cn2(d4, Y3, E4), J3 = dn2(d4), A4 = _t2(d4, true), he3 = ae3 && ie2(k3, se4 ? ee2 : te2)(), f4 ? (rt3 = [f4 + D3.os2, q3 + _5 + pt2], rt3.t = Y3, T4 = f4 === X2 ? vt2(d4, D3) + q3 + _5 : 0, T4 && (rt3.push(D3.d, T4 + pt2), Y3.style.flexBasis !== `auto` && (Y3.style.flexBasis = T4 + pt2)), un2(rt3), S4 && Z2.forEach(function(e21) {
            e21.pin === S4 && e21.vars.pinSpacing !== false && (e21._subPinOffset = true);
          }), ae3 && R3(Vt3)) : (T4 = vt2(d4, D3), T4 && Y3.style.flexBasis !== `auto` && (Y3.style.flexBasis = T4 + pt2)), ae3 && (N3 = { top: A4.top + (se4 ? oe4 - H3 : he3) + pt2, left: A4.left + (se4 ? he3 : oe4 - H3) + pt2, boxSizing: `border-box`, position: `fixed` }, N3[it2] = N3[`max` + dt2] = Math.ceil(A4.width) + pt2, N3[at2] = N3[`max` + ft2] = Math.ceil(A4.height) + pt2, N3[ut2] = N3[ut2 + ct2] = N3[ut2 + ot2] = N3[ut2 + lt2] = N3[ut2 + st2] = `0`, N3[X2] = E4[X2], N3[X2 + ct2] = E4[X2 + ct2], N3[X2 + ot2] = E4[X2 + ot2], N3[X2 + lt2] = E4[X2 + lt2], N3[X2 + st2] = E4[X2 + st2], Le3 = fn2(Ie3, N3, x4), qt2 && R3(0)), n4 ? (ve3 = n4._initted, Se2(1), n4.render(n4.duration(), true, true), tt3 = He3(D3.a) - et3 + q3 + _5, Ct3 = Math.abs(q3 - tt3) > 1, ae3 && Ct3 && Le3.splice(Le3.length - 2, 2), n4.render(0, true, true), ve3 || n4.invalidate(true), n4.parent || n4.totalTime(n4.totalTime()), Se2(0)) : tt3 = q3, xe3 && (xe3.value ? xe3.style[`overflow` + D3.a.toUpperCase()] = xe3.value : xe3.style.removeProperty(`overflow-` + D3.a));
          else if (u4 && R3() && !w3) for (A4 = u4.parentNode; A4 && A4 !== F2; ) A4._pinOffset && (H3 -= A4._pinOffset, U3 -= A4._pinOffset), A4 = A4.parentNode;
          L3 && L3.forEach(function(e21) {
            return e21.revert(false, true);
          }), j3.start = H3, j3.end = U3, Ce3 = we3 = qt2 ? Vt3 : R3(), !w3 && !qt2 && (Ce3 < Vt3 && R3(Vt3), j3.scroll.rec = 0), j3.revert(false, true), ye3 = G2(), zt3 && (ge3 = -1, zt3.restart(true)), _e2 = 0, n4 && O3 && (n4._initted || Ht3) && n4.progress() !== Ht3 && n4.progress(Ht3 || 0, true).render(n4.time(), true, true), (h5 || be3 !== j3.progress || w3 || p4 || n4 && !n4._initted) && (n4 && !O3 && (n4._initted || be3 || n4.vars.immediateRender !== false) && n4.totalProgress(w3 && H3 < -1e-3 && !be3 ? M2.utils.normalize(H3, U3, 0) : be3, true), j3.progress = h5 || (Ce3 - H3) / q3 === be3 ? 0 : be3), d4 && f4 && (Y3._pinOffset = Math.round(j3.progress * tt3)), Q3 && Q3.invalidate(), isNaN(B4) || (B4 -= M2.getProperty(W3, D3.p), V4 -= M2.getProperty(De3, D3.p), vn2(W3, D3, B4), vn2(Te3, D3, B4 - (o5 || 0)), vn2(De3, D3, V4), vn2(Ee3, D3, V4 - (o5 || 0))), h5 && !qt2 && j3.update(), c4 && !qt2 && !K3 && (K3 = true, c4(j3), K3 = false);
        }
      }, j3.getVelocity = function() {
        return (R3() - we3) / (G2() - he2) * 1e3 || 0;
      }, j3.endAnimation = function() {
        Ze2(j3.callbackAnimation), n4 && (Q3 ? Q3.progress(1) : n4.paused() ? O3 || Ze2(n4, j3.direction < 0, 1) : Ze2(n4, n4.reversed()));
      }, j3.labelToScroll = function(e21) {
        return n4 && n4.labels && (H3 || j3.refresh() || H3) + n4.labels[e21] / n4.duration() * q3 || 0;
      }, j3.getTrailing = function(e21) {
        var t6 = Z2.indexOf(j3), n5 = j3.direction > 0 ? Z2.slice(0, t6).reverse() : Z2.slice(t6 + 1);
        return (qe2(e21) ? n5.filter(function(t7) {
          return t7.vars.preventOverlaps === e21;
        }) : n5).filter(function(e22) {
          return j3.direction > 0 ? e22.end <= H3 : e22.start >= U3;
        });
      }, j3.update = function(e21, t6, r5) {
        if (!(w3 && !r5 && !e21)) {
          var o5 = qt2 === true ? Vt3 : j3.scroll(), c5 = e21 ? 0 : (o5 - H3) / q3, u5 = c5 < 0 ? 0 : c5 > 1 ? 1 : c5 || 0, p5 = j3.progress, h5, g5, v4, y4, S4, C3, A4, ee4;
          if (t6 && (we3 = Ce3, Ce3 = w3 ? R3() : o5, b4 && (Pt3 = Mt3, Mt3 = n4 && !O3 ? n4.totalProgress() : u5)), m4 && d4 && !_e2 && !je2 && Me2 && (!u5 && H3 < o5 + (o5 - we3) / (G2() - he2) * m4 ? u5 = 1e-4 : u5 === 1 && U3 > o5 + (o5 - we3) / (G2() - he2) * m4 && (u5 = 0.9999)), u5 !== p5 && j3.enabled) {
            if (h5 = j3.isActive = !!u5 && u5 < 1, g5 = !!p5 && p5 < 1, C3 = h5 !== g5, S4 = C3 || !!u5 != !!p5, j3.direction = u5 > p5 ? 1 : -1, j3.progress = u5, S4 && !_e2 && (v4 = u5 && !p5 ? 0 : u5 === 1 ? 1 : p5 === 1 ? 2 : 3, O3 && (y4 = !C3 && se3[v4 + 1] !== `none` && se3[v4 + 1] || se3[v4], ee4 = n4 && (y4 === `complete` || y4 === `reset` || y4 in n4))), E3 && (C3 || ee4) && (ee4 || l4 || !n4) && (Je2(E3) ? E3(j3) : j3.getTrailing(E3).forEach(function(e22) {
              return e22.endAnimation();
            })), O3 || (Q3 && !_e2 && !je2 ? (Q3._dp._time - Q3._start !== Q3._time && Q3.render(Q3._dp._time - Q3._start), Q3.resetTo ? Q3.resetTo(`totalProgress`, u5, n4._tTime / n4._tDur) : (Q3.vars.totalProgress = u5, Q3.invalidate().restart())) : n4 && n4.totalProgress(u5, !!(_e2 && (ye3 || e21)))), d4) {
              if (e21 && f4 && (Y3.style[f4 + D3.os2] = nt3), !ae3) Ke3(ze2(et3 + tt3 * u5));
              else if (S4) {
                if (A4 = !e21 && u5 > p5 && U3 + 1 > o5 && o5 + 1 >= Ge2(k3, D3), x4) if (!e21 && (h5 || A4)) {
                  var ne3 = _t2(d4, true), re4 = o5 - H3;
                  gn2(d4, F2, ne3.top + (D3 === te2 ? re4 : 0) + pt2, ne3.left + (D3 === te2 ? 0 : re4) + pt2);
                } else gn2(d4, Y3);
                un2(h5 || A4 ? Le3 : J3), Ct3 && u5 < 1 && h5 || Ke3(et3 + (u5 === 1 && !A4 ? tt3 : 0));
              }
            }
            b4 && !z3.tween && !_e2 && !je2 && zt3.restart(true), a4 && (C3 || _4 && u5 && (u5 < 1 || !Ae2)) && I2(a4.targets).forEach(function(e22) {
              return e22.classList[h5 || _4 ? `add` : `remove`](a4.className);
            }), i4 && !O3 && !e21 && i4(j3), S4 && !_e2 ? (O3 && (ee4 && (y4 === `complete` ? n4.pause().totalProgress(1) : y4 === `reset` ? n4.restart(true).pause() : y4 === `restart` ? n4.restart(true) : n4[y4]()), i4 && i4(j3)), (C3 || !Ae2) && (s4 && C3 && Qe2(j3, s4), oe3[v4] && Qe2(j3, oe3[v4]), _4 && (u5 === 1 ? j3.kill(false, 1) : oe3[v4] = 0), C3 || (v4 = u5 === 1 ? 1 : 3, oe3[v4] && Qe2(j3, oe3[v4]))), T3 && !h5 && Math.abs(j3.getVelocity()) > (Ye2(T3) ? T3 : 2500) && (Ze2(j3.callbackAnimation), Q3 ? Q3.progress(1) : Ze2(n4, y4 === `reverse` ? 1 : !u5, 1))) : O3 && i4 && !_e2 && i4(j3);
          }
          if (Et3) {
            var ie3 = w3 ? o5 / w3.duration() * (w3._caScrollDist || 0) : o5;
            yt3(ie3 + +!!W3._isFlipped), Et3(ie3);
          }
          Ut3 && Ut3(-o5 / w3.duration() * (w3._caScrollDist || 0));
        }
      }, j3.enable = function(t6, n5) {
        j3.enabled || (j3.enabled = true, wt2(k3, `resize`, Lt2), re3 || wt2(k3, `scroll`, Ft2), ue3 && wt2(e20, `refreshInit`, ue3), t6 !== false && (j3.progress = be3 = 0, Ce3 = we3 = ge3 = R3()), n5 !== false && j3.refresh());
      }, j3.getTween = function(e21) {
        return e21 && z3 ? z3.tween : Q3;
      }, j3.setPositions = function(e21, t6, n5, r5) {
        if (w3) {
          var i5 = w3.scrollTrigger, a5 = w3.duration(), o5 = i5.end - i5.start;
          e21 = i5.start + o5 * e21 / a5, t6 = i5.start + o5 * t6 / a5;
        }
        j3.refresh(false, false, { start: Fe2(e21, n5 && !!j3._startClamp), end: Fe2(t6, n5 && !!j3._endClamp) }, r5), j3.update();
      }, j3.adjustPinSpacing = function(e21) {
        if (rt3 && e21) {
          var t6 = rt3.indexOf(D3.d) + 1;
          rt3[t6] = parseFloat(rt3[t6]) + e21 + pt2, rt3[1] = parseFloat(rt3[1]) + e21 + pt2, un2(rt3);
        }
      }, j3.disable = function(t6, n5) {
        if (t6 !== false && j3.revert(true, true), j3.enabled && (j3.enabled = j3.isActive = false, n5 || Q3 && Q3.pause(), Vt3 = 0, B3 && (B3.uncache = 1), ue3 && Tt2(e20, `refreshInit`, ue3), zt3 && (zt3.pause(), z3.tween && z3.tween.kill() && (z3.tween = 0)), !re3)) {
          for (var r5 = Z2.length; r5--; ) if (Z2[r5].scroller === k3 && Z2[r5] !== j3) return;
          Tt2(k3, `resize`, Lt2), re3 || Tt2(k3, `scroll`, Ft2);
        }
      }, j3.kill = function(e21, r5) {
        j3.disable(e21, r5), Q3 && !r5 && Q3.kill(), o4 && delete Nt2[o4];
        var i5 = Z2.indexOf(j3);
        i5 >= 0 && Z2.splice(i5, 1), i5 === L2 && tn2 > 0 && L2--, i5 = 0, Z2.forEach(function(e22) {
          return e22.scroller === j3.scroller && (i5 = 1);
        }), i5 || qt2 || (j3.scroll.rec = 0), n4 && (n4.scrollTrigger = null, e21 && n4.revert({ kill: false }), r5 || n4.kill()), Te3 && [Te3, Ee3, W3, De3].forEach(function(e22) {
          return e22.parentNode && e22.parentNode.removeChild(e22);
        }), nn2 === j3 && (nn2 = 0), d4 && (B3 && (B3.uncache = 1), i5 = 0, Z2.forEach(function(e22) {
          return e22.pin === d4 && i5++;
        }), i5 || (B3.spacer = 0)), t5.onKill && t5.onKill(j3);
      }, Z2.push(j3), j3.enable(false, false), Wt3 && Wt3(j3), n4 && n4.add && !q3) {
        var Yt3 = j3.update;
        j3.update = function() {
          j3.update = Yt3, v2.cache++, H3 || U3 || j3.refresh();
        }, M2.delayedCall(0.01, j3.update), q3 = 0.01, H3 = U3 = 0;
      } else j3.refresh();
      d4 && Xt2();
    }, e20.register = function(t5) {
      return ue2 || (ue2 = (M2 = t5 || Y2(), J2() && window.document && e20.enable(), Ne2)), ue2;
    }, e20.defaults = function(e21) {
      if (e21) for (var t5 in e21) Ot2[t5] = e21[t5];
      return Ot2;
    }, e20.disable = function(e21, t5) {
      Ne2 = 0, Z2.forEach(function(n5) {
        return n5[t5 ? `kill` : `disable`](e21);
      }), Tt2(N2, `wheel`, Ft2), Tt2(P2, `scroll`, Ft2), clearInterval(ge2), Tt2(P2, `touchcancel`, Re2), Tt2(F2, `touchstart`, Re2), Ct2(Tt2, P2, `pointerdown,touchstart,mousedown`, Ie2), Ct2(Tt2, P2, `pointerup,touchend,mouseup`, Le2), pe2.kill(), Ke2(Tt2);
      for (var n4 = 0; n4 < v2.length; n4 += 3) Et2(Tt2, v2[n4], v2[n4 + 1]), Et2(Tt2, v2[n4], v2[n4 + 2]);
    }, e20.enable = function() {
      if (N2 = window, P2 = document, de2 = P2.documentElement, F2 = P2.body, M2) if (I2 = M2.utils.toArray, me2 = M2.utils.clamp, Te2 = M2.core.context || Re2, Se2 = M2.core.suppressOverwrites || Re2, Ee2 = N2.history.scrollRestoration || `auto`, en2 = N2.pageYOffset || 0, M2.core.globals(`ScrollTrigger`, e20), F2) {
        Ne2 = 1, W2 = document.createElement(`div`), W2.style.height = `100vh`, W2.style.position = `absolute`, Zt2(), q2(), j2.register(M2), e20.isTouch = j2.isTouch, U2 = j2.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), Ce2 = j2.isTouch === 1, wt2(N2, `wheel`, Ft2), fe2 = [N2, P2, de2, F2], M2.matchMedia ? (e20.matchMedia = function(e21) {
          var t6 = M2.matchMedia(), n5;
          for (n5 in e21) t6.add(n5, e21[n5]);
          return t6;
        }, M2.addEventListener(`matchMediaInit`, function() {
          Wt2(), Gt2();
        }), M2.addEventListener(`matchMediaRevert`, function() {
          return Ut2();
        }), M2.addEventListener(`matchMedia`, function() {
          $t2(0, 1), Vt2(`matchMedia`);
        }), M2.matchMedia().add(`(orientation: portrait)`, function() {
          return It2(), It2;
        })) : console.warn(`Requires GSAP 3.11.0 or later`), It2(), wt2(P2, `scroll`, Ft2);
        var t5 = F2.hasAttribute(`style`), n4 = F2.style, r4 = n4.borderTopStyle, i4 = M2.core.Animation.prototype, a4, o4;
        for (i4.revert || Object.defineProperty(i4, "revert", { value: function() {
          return this.time(-0.01, true);
        } }), n4.borderTopStyle = `solid`, a4 = _t2(F2), te2.m = Math.round(a4.top + te2.sc()) || 0, ee2.m = Math.round(a4.left + ee2.sc()) || 0, r4 ? n4.borderTopStyle = r4 : n4.removeProperty(`border-top-style`), t5 || (F2.setAttribute(`style`, ``), F2.removeAttribute(`style`)), ge2 = setInterval(Q2, 250), M2.delayedCall(0.5, function() {
          return je2 = 0;
        }), wt2(P2, `touchcancel`, Re2), wt2(F2, `touchstart`, Re2), Ct2(wt2, P2, `pointerdown,touchstart,mousedown`, Ie2), Ct2(wt2, P2, `pointerup,touchend,mouseup`, Le2), ye2 = M2.utils.checkPrefix(`transform`), on2.push(ye2), ue2 = G2(), pe2 = M2.delayedCall(0.2, $t2).pause(), z2 = [P2, `visibilitychange`, function() {
          var e21 = N2.innerWidth, t6 = N2.innerHeight;
          P2.hidden ? (be2 = e21, R2 = t6) : (be2 !== e21 || R2 !== t6) && Lt2();
        }, P2, `DOMContentLoaded`, $t2, N2, `load`, $t2, N2, `resize`, Lt2], Ke2(wt2), Z2.forEach(function(e21) {
          return e21.enable(0, 1);
        }), o4 = 0; o4 < v2.length; o4 += 3) Et2(Tt2, v2[o4], v2[o4 + 1]), Et2(Tt2, v2[o4], v2[o4 + 2]);
      } else P2 && P2.addEventListener(`DOMContentLoaded`, function t6() {
        e20.enable(), P2.removeEventListener(`DOMContentLoaded`, t6);
      });
    }, e20.config = function(t5) {
      `limitCallbacks` in t5 && (Ae2 = !!t5.limitCallbacks);
      var n4 = t5.syncInterval;
      n4 && clearInterval(ge2) || (ge2 = n4) && setInterval(Q2, n4), `ignoreMobileResize` in t5 && (Ce2 = e20.isTouch === 1 && t5.ignoreMobileResize), `autoRefreshEvents` in t5 && (Ke2(Tt2) || Ke2(wt2, t5.autoRefreshEvents || `none`), B2 = (t5.autoRefreshEvents + ``).indexOf(`resize`) === -1);
    }, e20.scrollerProxy = function(e21, t5) {
      var n4 = ne2(e21), r4 = v2.indexOf(n4), i4 = Be2(n4);
      ~r4 && v2.splice(r4, i4 ? 6 : 2), t5 && (i4 ? y2.unshift(N2, t5, F2, t5, de2, t5) : y2.unshift(n4, t5));
    }, e20.clearMatchMedia = function(e21) {
      Z2.forEach(function(t5) {
        return t5._ctx && t5._ctx.query === e21 && t5._ctx.kill(true, true);
      });
    }, e20.isInViewport = function(e21, t5, n4) {
      var r4 = (qe2(e21) ? ne2(e21) : e21).getBoundingClientRect(), i4 = r4[n4 ? it2 : at2] * t5 || 0;
      return n4 ? r4.right - i4 > 0 && r4.left + i4 < N2.innerWidth : r4.bottom - i4 > 0 && r4.top + i4 < N2.innerHeight;
    }, e20.positionInViewport = function(e21, t5, n4) {
      qe2(e21) && (e21 = ne2(e21));
      var r4 = e21.getBoundingClientRect(), i4 = r4[n4 ? it2 : at2], a4 = t5 == null ? i4 / 2 : t5 in kt2 ? kt2[t5] * i4 : ~t5.indexOf(`%`) ? parseFloat(t5) * i4 / 100 : parseFloat(t5) || 0;
      return n4 ? (r4.left + a4) / N2.innerWidth : (r4.top + a4) / N2.innerHeight;
    }, e20.killAll = function(e21) {
      if (Z2.slice(0).forEach(function(e22) {
        return e22.vars.id !== `ScrollSmoother` && e22.kill();
      }), e21 !== true) {
        var t5 = Rt2.killAll || [];
        Rt2 = {}, t5.forEach(function(e22) {
          return e22();
        });
      }
    }, e20;
  })();
  $2.version = `3.15.0`, $2.saveStyles = function(e20) {
    return e20 ? I2(e20).forEach(function(e21) {
      if (e21 && e21.style) {
        var t4 = Ht2.indexOf(e21);
        t4 >= 0 && Ht2.splice(t4, 5), Ht2.push(e21, e21.style.cssText, e21.getBBox && e21.getAttribute(`transform`), M2.core.getCache(e21), Te2());
      }
    }) : Ht2;
  }, $2.revert = function(e20, t4) {
    return Gt2(!e20, t4);
  }, $2.create = function(e20, t4) {
    return new $2(e20, t4);
  }, $2.refresh = function(e20) {
    return e20 ? Lt2(true) : (ue2 || $2.register()) && $t2(true);
  }, $2.update = function(e20) {
    return ++v2.cache && rn2(e20 === true ? 2 : 0);
  }, $2.clearScrollMemory = Kt2, $2.maxScroll = function(e20, t4) {
    return Ge2(e20, t4 ? ee2 : te2);
  }, $2.getScrollFunc = function(e20, t4) {
    return ie2(ne2(e20), t4 ? ee2 : te2);
  }, $2.getById = function(e20) {
    return Nt2[e20];
  }, $2.getAll = function() {
    return Z2.filter(function(e20) {
      return e20.vars.id !== `ScrollSmoother`;
    });
  }, $2.isScrolling = function() {
    return !!Me2;
  }, $2.snapDirectional = xt2, $2.addEventListener = function(e20, t4) {
    var n4 = Rt2[e20] || (Rt2[e20] = []);
    ~n4.indexOf(t4) || n4.push(t4);
  }, $2.removeEventListener = function(e20, t4) {
    var n4 = Rt2[e20], r4 = n4 && n4.indexOf(t4);
    r4 >= 0 && n4.splice(r4, 1);
  }, $2.batch = function(e20, t4) {
    var n4 = [], r4 = {}, i4 = t4.interval || 0.016, a4 = t4.batchMax || 1e9, o4 = function(e21, t5) {
      var n5 = [], r5 = [], o5 = M2.delayedCall(i4, function() {
        t5(n5, r5), n5 = [], r5 = [];
      }).pause();
      return function(e22) {
        n5.length || o5.restart(true), n5.push(e22.trigger), r5.push(e22), a4 <= n5.length && o5.progress(1);
      };
    }, s4;
    for (s4 in t4) r4[s4] = s4.substr(0, 2) === `on` && Je2(t4[s4]) && s4 !== `onRefreshInit` ? o4(s4, t4[s4]) : t4[s4];
    return Je2(a4) && (a4 = a4(), wt2($2, `refresh`, function() {
      return a4 = t4.batchMax();
    })), I2(e20).forEach(function(e21) {
      var t5 = {};
      for (s4 in r4) t5[s4] = r4[s4];
      t5.trigger = e21, n4.push($2.create(t5));
    }), n4;
  };
  var bn2 = function(e20, t4, n4, r4) {
    return t4 > r4 ? e20(r4) : t4 < 0 && e20(0), n4 > r4 ? (r4 - t4) / (n4 - t4) : n4 < 0 ? t4 / (t4 - n4) : 1;
  };
  var xn2 = function e18(t4, n4) {
    n4 === true ? t4.style.removeProperty(`touch-action`) : t4.style.touchAction = n4 === true ? `auto` : n4 ? `pan-` + n4 + (j2.isTouch ? ` pinch-zoom` : ``) : `none`, t4 === de2 && e18(F2, n4);
  };
  var Sn2 = { auto: 1, scroll: 1 };
  var Cn2 = function(e20) {
    var t4 = e20.event, n4 = e20.target, r4 = e20.axis, i4 = (t4.changedTouches ? t4.changedTouches[0] : t4).target, a4 = i4._gsap || M2.core.getCache(i4), o4 = G2(), s4;
    if (!a4._isScrollT || o4 - a4._isScrollT > 2e3) {
      for (; i4 && i4 !== F2 && (i4.scrollHeight <= i4.clientHeight && i4.scrollWidth <= i4.clientWidth || !(Sn2[(s4 = mt2(i4)).overflowY] || Sn2[s4.overflowX])); ) i4 = i4.parentNode;
      a4._isScroll = i4 && i4 !== n4 && !Be2(i4) && (Sn2[(s4 = mt2(i4)).overflowY] || Sn2[s4.overflowX]), a4._isScrollT = o4;
    }
    (a4._isScroll || r4 === `x`) && (t4.stopPropagation(), t4._gsapAllow = true);
  };
  var wn2 = function(e20, t4, n4, r4) {
    return j2.create({ target: e20, capture: true, debounce: false, lockAxis: true, type: t4, onWheel: r4 && (r4 = Cn2), onPress: r4, onDrag: r4, onScroll: r4, onEnable: function() {
      return n4 && wt2(P2, j2.eventTypes[0], Dn2, false, true);
    }, onDisable: function() {
      return Tt2(P2, j2.eventTypes[0], Dn2, true);
    } });
  };
  var Tn2 = /(input|label|select|textarea)/i;
  var En2;
  var Dn2 = function(e20) {
    var t4 = Tn2.test(e20.target.tagName);
    (t4 || En2) && (e20._gsapAllow = true, En2 = t4);
  };
  var On2 = function(e20) {
    Xe2(e20) || (e20 = {}), e20.preventDefault = e20.isNormalizer = e20.allowClicks = true, e20.type || (e20.type = `wheel,touch`), e20.debounce = !!e20.debounce, e20.id = e20.id || `normalizer`;
    var t4 = e20, n4 = t4.normalizeScrollX, r4 = t4.momentum, i4 = t4.allowNestedScroll, a4 = t4.onRelease, o4, s4, c4 = ne2(e20.target) || de2, l4 = M2.core.globals().ScrollSmoother, u4 = l4 && l4.get(), d4 = U2 && (e20.content && ne2(e20.content) || u4 && e20.content !== false && !u4.smooth() && u4.content()), f4 = ie2(c4, te2), p4 = ie2(c4, ee2), m4 = 1, h4 = (j2.isTouch && N2.visualViewport ? N2.visualViewport.scale * N2.visualViewport.width : N2.outerWidth) / N2.innerWidth, g4 = 0, _4 = Je2(r4) ? function() {
      return r4(o4);
    } : function() {
      return r4 || 2.8;
    }, y4, b4, x4 = wn2(c4, e20.type, true, i4), S3 = function() {
      return b4 = false;
    }, C3 = Re2, w3 = Re2, T3 = function() {
      s4 = Ge2(c4, te2), w3 = me2(+!!U2, s4), n4 && (C3 = me2(0, Ge2(c4, ee2))), y4 = Jt2;
    }, E3 = function() {
      d4._gsap.y = ze2(parseFloat(d4._gsap.y) + f4.offset) + `px`, d4.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` + parseFloat(d4._gsap.y) + `, 0, 1)`, f4.offset = f4.cacheID = 0;
    }, D3 = function() {
      if (b4) {
        requestAnimationFrame(S3);
        var e21 = ze2(o4.deltaY / 2), t5 = w3(f4.v - e21);
        if (d4 && t5 !== f4.v + f4.offset) {
          f4.offset = t5 - f4.v;
          var n5 = ze2((parseFloat(d4 && d4._gsap.y) || 0) - f4.offset);
          d4.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` + n5 + `, 0, 1)`, d4._gsap.y = n5 + `px`, f4.cacheID = v2.cache, rn2();
        }
        return true;
      }
      f4.offset && E3(), b4 = true;
    }, O3, k3, A3, re3, ae3 = function() {
      T3(), O3.isActive() && O3.vars.scrollY > s4 && (f4() > s4 ? O3.progress(1) && f4(s4) : O3.resetTo(`scrollY`, s4));
    };
    return d4 && M2.set(d4, { y: `+=0` }), e20.ignoreCheck = function(e21) {
      return U2 && e21.type === `touchmove` && D3(e21) || m4 > 1.05 && e21.type !== `touchstart` || o4.isGesturing || e21.touches && e21.touches.length > 1;
    }, e20.onPress = function() {
      b4 = false;
      var e21 = m4;
      m4 = ze2((N2.visualViewport && N2.visualViewport.scale || 1) / h4), O3.pause(), e21 !== m4 && xn2(c4, m4 > 1.01 || !n4 && `x`), k3 = p4(), A3 = f4(), T3(), y4 = Jt2;
    }, e20.onRelease = e20.onGestureStart = function(e21, t5) {
      if (f4.offset && E3(), !t5) re3.restart(true);
      else {
        v2.cache++;
        var r5 = _4(), i5, o5;
        n4 && (i5 = p4(), o5 = i5 + r5 * 0.05 * -e21.velocityX / 0.227, r5 *= bn2(p4, i5, o5, Ge2(c4, ee2)), O3.vars.scrollX = C3(o5)), i5 = f4(), o5 = i5 + r5 * 0.05 * -e21.velocityY / 0.227, r5 *= bn2(f4, i5, o5, Ge2(c4, te2)), O3.vars.scrollY = w3(o5), O3.invalidate().duration(r5).play(0.01), (U2 && O3.vars.scrollY >= s4 || i5 >= s4 - 1) && M2.to({}, { onUpdate: ae3, duration: r5 });
      }
      a4 && a4(e21);
    }, e20.onWheel = function() {
      O3._ts && O3.pause(), G2() - g4 > 1e3 && (y4 = 0, g4 = G2());
    }, e20.onChange = function(e21, t5, r5, i5, a5) {
      if (Jt2 !== y4 && T3(), t5 && n4 && p4(C3(i5[2] === t5 ? k3 + (e21.startX - e21.x) : p4() + t5 - i5[1])), r5) {
        f4.offset && E3();
        var o5 = a5[2] === r5, s5 = o5 ? A3 + e21.startY - e21.y : f4() + r5 - a5[1], c5 = w3(s5);
        o5 && s5 !== c5 && (A3 += c5 - s5), f4(c5);
      }
      (r5 || t5) && rn2();
    }, e20.onEnable = function() {
      xn2(c4, !n4 && `x`), $2.addEventListener(`refresh`, ae3), wt2(N2, `resize`, ae3), f4.smooth && (f4.smooth = (f4.target.style.scrollBehavior = `auto`, p4.smooth = false)), x4.enable();
    }, e20.onDisable = function() {
      xn2(c4, true), Tt2(N2, `resize`, ae3), $2.removeEventListener(`refresh`, ae3), x4.kill();
    }, e20.lockAxis = e20.lockAxis !== false, o4 = new j2(e20), o4.iOS = U2, U2 && !f4() && f4(1), U2 && M2.ticker.add(Re2), re3 = o4._dc, O3 = M2.to(o4, { ease: `power4`, paused: true, inherit: false, scrollX: n4 ? `+=0.1` : `+=0`, scrollY: `+=0.1`, modifiers: { scrollY: _n2(f4, f4(), function() {
      return O3.pause();
    }) }, onUpdate: rn2, onComplete: re3.vars.onComplete }), o4;
  };
  $2.sort = function(e20) {
    if (Je2(e20)) return Z2.sort(e20);
    var t4 = N2.pageYOffset || 0;
    return $2.getAll().forEach(function(e21) {
      return e21._sortY = e21.trigger ? t4 + e21.trigger.getBoundingClientRect().top : e21.start + N2.innerHeight;
    }), Z2.sort(e20 || function(e21, t5) {
      return (e21.vars.refreshPriority || 0) * -1e6 + (e21.vars.containerAnimation ? 1e6 : e21._sortY) - ((t5.vars.containerAnimation ? 1e6 : t5._sortY) + (t5.vars.refreshPriority || 0) * -1e6);
    });
  }, $2.observe = function(e20) {
    return new j2(e20);
  }, $2.normalizeScroll = function(e20) {
    if (e20 === void 0) return V2;
    if (e20 === true && V2) return V2.enable();
    if (e20 === false) {
      V2 && V2.kill(), V2 = e20;
      return;
    }
    var t4 = e20 instanceof j2 ? e20 : On2(e20);
    return V2 && V2.target === t4.target && V2.kill(), Be2(t4.target) && (V2 = t4), t4;
  }, $2.core = { _getVelocityProp: ae2, _inputObserver: wn2, _scrollers: v2, _proxies: y2, bridge: { ss: function() {
    Me2 || Vt2(`scrollStart`), Me2 = G2();
  }, ref: function() {
    return _e2;
  } } }, Y2() && M2.registerPlugin($2);

  // public/shopify/plantilla99/assets/js/ScrollSmoother.CzArhDqk.js
  function e19(e20, t4) {
    for (var n4 = 0; n4 < t4.length; n4++) {
      var r4 = t4[n4];
      r4.enumerable = r4.enumerable || false, r4.configurable = true, `value` in r4 && (r4.writable = true), Object.defineProperty(e20, r4.key, r4);
    }
  }
  function t3(t4, n4, r4) {
    return n4 && e19(t4.prototype, n4), r4 && e19(t4, r4), t4;
  }
  var n3;
  var r3;
  var i3;
  var a3;
  var o3;
  var s3;
  var c3;
  var l3;
  var u3;
  var d3;
  var f3;
  var p3;
  var m3;
  var h3;
  var g3;
  var _3 = function() {
    return typeof window < `u`;
  };
  var v3 = function() {
    return n3 || _3() && (n3 = window.gsap) && n3.registerPlugin && n3;
  };
  var ee3 = function(e20) {
    return Math.round(e20 * 1e5) / 1e5 || 0;
  };
  var y3 = function(e20) {
    return u3.maxScroll(e20 || i3);
  };
  var te3 = function(e20, t4) {
    var n4 = e20.parentNode || o3, r4 = e20.getBoundingClientRect(), a4 = n4.getBoundingClientRect(), s4 = a4.top - r4.top, c4 = a4.bottom - r4.bottom, l4 = (Math.abs(s4) > Math.abs(c4) ? s4 : c4) / (1 - t4), u4 = -l4 * t4, d4, f4;
    return l4 > 0 && (d4 = a4.height / (i3.innerHeight + a4.height), f4 = d4 === 0.5 ? a4.height * 2 : Math.min(a4.height, Math.abs(-l4 * d4 / (2 * d4 - 1))) * 2 * (t4 || 1), u4 += t4 ? -f4 * t4 : -f4 / 2, l4 += f4), { change: l4, offset: u4 };
  };
  var b3 = function(e20) {
    var t4 = a3.querySelector(`.ScrollSmoother-wrapper`);
    return t4 || (t4 = a3.createElement(`div`), t4.classList.add(`ScrollSmoother-wrapper`), e20.parentNode.insertBefore(t4, e20), t4.appendChild(e20)), t4;
  };
  var x3 = (function() {
    function e20(t4) {
      var _4 = this;
      r3 || e20.register(n3) || console.warn(`Please gsap.registerPlugin(ScrollSmoother)`), t4 = this.vars = t4 || {}, d3 && d3.kill(), d3 = this, h3(this);
      var v4 = t4, x4 = v4.smoothTouch, S3 = v4.onUpdate, C3 = v4.onStop, w3 = v4.smooth, T3 = v4.onFocusIn, E3 = v4.normalizeScroll, ne3 = v4.wholePixels, D3, O3, k3, A3, j3, M3, re3, ie3, ae3, N3, P3, F3, I3, L3, oe3 = this, R3 = t4.effectsPrefix || ``, z3 = u3.getScrollFunc(i3), B3 = u3.isTouch === 1 ? x4 === true ? 0.8 : parseFloat(x4) || 0 : w3 === 0 || w3 === false ? 0 : parseFloat(w3) || 0.8, V3 = B3 && +t4.speed || 1, H3 = 0, U3 = 0, W3 = 1, G3 = p3(0), se3 = function() {
        return G3.update(-H3);
      }, K3 = { y: 0 }, ce3 = function() {
        return D3.style.overflow = `visible`;
      }, q3, J3 = function(e21) {
        e21.update();
        var t5 = e21.getTween();
        t5 && (t5.pause(), t5._time = t5._dur, t5._tTime = t5._tDur), q3 = false, e21.animation.progress(e21.progress, true);
      }, Y3 = function(t5, n4) {
        (t5 !== H3 && !N3 || n4) && (ne3 && (t5 = Math.round(t5)), B3 && (D3.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` + t5 + `, 0, 1)`, D3._gsap.y = t5 + `px`), U3 = t5 - H3, H3 = t5, u3.isUpdating || e20.isRefreshing || u3.update());
      }, X3 = function(e21) {
        return arguments.length ? (e21 < 0 && (e21 = 0), K3.y = -e21, q3 = true, N3 ? H3 = -e21 : Y3(-e21), u3.isRefreshing ? A3.update() : z3(e21 / V3), this) : -H3;
      }, Z3 = typeof ResizeObserver < `u` && t4.autoResize !== false && new ResizeObserver(function() {
        if (!u3.isRefreshing) {
          var e21 = y3(O3) * V3;
          e21 < -H3 && X3(e21), g3.restart(true);
        }
      }), le3, ue3 = function(e21) {
        O3.scrollTop = 0, !(e21.target.contains && e21.target.contains(O3) || T3 && T3(_4, e21) === false) && (u3.isInViewport(e21.target) || e21.target === le3 || _4.scrollTo(e21.target, false, `center center`), le3 = e21.target);
      }, de3 = function(e21, t5) {
        if (e21 < t5.start) return e21;
        var n4 = isNaN(t5.ratio) ? 1 : t5.ratio, r4 = t5.end - t5.start, i4 = e21 - t5.start, a4 = t5.offset || 0, o4 = t5.pins || [], s4 = o4.offset || 0, c4 = t5._startClamp && t5.start <= 0 || t5.pins && t5.pins.offset ? 0 : t5._endClamp && t5.end === y3() ? 1 : 0.5;
        return o4.forEach(function(t6) {
          r4 -= t6.distance, t6.nativeStart <= e21 && (i4 -= t6.distance);
        }), s4 && (i4 *= (r4 - s4 / n4) / r4), e21 + (i4 - a4 * c4) / n4 - i4;
      }, fe3 = function e21(t5, r4, i4) {
        i4 || (t5.pins.length = t5.pins.offset = 0);
        var a4 = t5.pins, o4 = t5.markers, s4, c4, l4, u4, d4, f4, p4, m4;
        for (p4 = 0; p4 < r4.length; p4++) if (m4 = r4[p4], t5.trigger && m4.trigger && t5 !== m4 && (m4.trigger === t5.trigger || m4.pinnedContainer === t5.trigger || t5.trigger.contains(m4.trigger)) && (d4 = m4._startNative || m4._startClamp || m4.start, f4 = m4._endNative || m4._endClamp || m4.end, l4 = de3(d4, t5), u4 = m4.pin && f4 > 0 ? l4 + (f4 - d4) : de3(f4, t5), m4.setPositions(l4, u4, true, (m4._startClamp ? Math.max(0, l4) : l4) - d4), m4.markerStart && o4.push(n3.quickSetter([m4.markerStart, m4.markerEnd], `y`, `px`)), m4.pin && m4.end > 0 && !i4)) {
          if (s4 = m4.end - m4.start, c4 = t5._startClamp && m4.start < 0, c4) {
            if (t5.start > 0) {
              t5.setPositions(0, t5.end + (t5._startNative - t5.start), true), e21(t5, r4);
              return;
            }
            s4 += m4.start, a4.offset = -m4.start;
          }
          a4.push({ start: m4.start, nativeStart: d4, end: m4.end, distance: s4, trig: m4 }), t5.setPositions(t5.start, t5.end + (c4 ? -m4.start : s4), true);
        }
      }, pe3 = function(e21, t5) {
        j3.forEach(function(n4) {
          return fe3(n4, e21, t5);
        });
      }, me3 = function() {
        o3 = a3.documentElement, s3 = a3.body, ce3(), requestAnimationFrame(ce3), j3 && (u3.getAll().forEach(function(e21) {
          e21._startNative = e21.start, e21._endNative = e21.end;
        }), j3.forEach(function(e21) {
          var t5 = e21._startClamp || e21.start, n4 = e21.autoSpeed ? Math.min(y3(), e21.end) : t5 + Math.abs((e21.end - t5) / e21.ratio), r4 = n4 - e21.end;
          if (t5 -= r4 / 2, n4 -= r4 / 2, t5 > n4) {
            var i4 = t5;
            t5 = n4, n4 = i4;
          }
          e21._startClamp && t5 < 0 ? (n4 = e21.ratio < 0 ? y3() : e21.end / e21.ratio, r4 = n4 - e21.end, t5 = 0) : (e21.ratio < 0 || e21._endClamp && n4 >= y3()) && (n4 = y3(), t5 = e21.ratio < 0 || e21.ratio > 1 ? 0 : n4 - (n4 - e21.start) / e21.ratio, r4 = (n4 - t5) * e21.ratio - (e21.end - e21.start)), e21.offset = r4 || 1e-4, e21.pins.length = e21.pins.offset = 0, e21.setPositions(t5, n4, true);
        }), pe3(u3.sort())), G3.reset();
      }, Q3 = function() {
        return u3.addEventListener(`refresh`, me3);
      }, he3 = function() {
        return j3 && j3.forEach(function(e21) {
          return e21.vars.onRefresh(e21);
        });
      }, ge3 = function() {
        return j3 && j3.forEach(function(e21) {
          return e21.vars.onRefreshInit(e21);
        }), he3;
      }, _e3 = function(e21, t5, n4, r4) {
        return function() {
          var i4 = typeof t5 == `function` ? t5(n4, r4) : t5;
          i4 || i4 === 0 || (i4 = r4.getAttribute(`data-` + R3 + e21) || +(e21 === `speed`)), r4.setAttribute(`data-` + R3 + e21, i4);
          var a4 = (i4 + ``).substr(0, 6) === `clamp(`;
          return { clamp: a4, value: a4 ? i4.substr(6, i4.length - 7) : i4 };
        };
      }, ve3 = function(e21, t5, r4, i4, a4) {
        a4 = (typeof a4 == `function` ? a4(i4, e21) : a4) || 0;
        var o4 = _e3(`speed`, t5, i4, e21), s4 = _e3(`lag`, r4, i4, e21), c4 = n3.getProperty(e21, `y`), d4 = e21._gsap, p4, m4, h4, g4, _5, v5, b4 = [], x5 = function() {
          t5 = o4(), r4 = parseFloat(s4().value), p4 = parseFloat(t5.value) || 1, h4 = t5.value === `auto`, _5 = h4 || m4 && m4._startClamp && m4.start <= 0 || b4.offset ? 0 : m4 && m4._endClamp && m4.end === y3() ? 1 : 0.5, g4 && g4.kill(), g4 = r4 && n3.to(e21, { ease: f3, overwrite: false, y: `+=0`, duration: r4 }), m4 && (m4.ratio = p4, m4.autoSpeed = h4);
        }, S4 = function() {
          d4.y = c4 + `px`, d4.renderTransform(1), x5();
        }, C4 = [], w4 = 0, T4 = function(t6) {
          if (h4) {
            S4();
            var n4 = te3(e21, l3(0, 1, -t6.start / (t6.end - t6.start)));
            w4 = n4.change, v5 = n4.offset;
          } else v5 = b4.offset || 0, w4 = (t6.end - t6.start - v5) * (1 - p4);
          b4.forEach(function(e22) {
            return w4 -= e22.distance * (1 - p4);
          }), t6.offset = w4 || 1e-3, t6.vars.onUpdate(t6), g4 && g4.progress(1);
        };
        return x5(), (p4 !== 1 || h4 || g4) && (m4 = u3.create({ trigger: h4 ? e21.parentNode : e21, start: function() {
          return t5.clamp ? `clamp(top bottom+=` + a4 + `)` : `top bottom+=` + a4;
        }, end: function() {
          return t5.value < 0 ? `max` : t5.clamp ? `clamp(bottom top-=` + a4 + `)` : `bottom top-=` + a4;
        }, scroller: O3, scrub: true, refreshPriority: -999, onRefreshInit: S4, onRefresh: T4, onKill: function(e22) {
          var t6 = j3.indexOf(e22);
          t6 >= 0 && j3.splice(t6, 1), S4();
        }, onUpdate: function(e22) {
          var t6 = c4 + w4 * (e22.progress - _5), r5 = b4.length, i5 = 0, a5, o5, s5;
          if (e22.offset) {
            if (r5) {
              for (o5 = -H3, s5 = e22.end; r5--; ) {
                if (a5 = b4[r5], a5.trig.isActive || o5 >= a5.start && o5 <= a5.end) {
                  g4 && (a5.trig.progress += a5.trig.direction < 0 ? 1e-3 : -1e-3, a5.trig.update(0, 0, 1), g4.resetTo(`y`, parseFloat(d4.y), -U3, true), W3 && g4.progress(1));
                  return;
                }
                o5 > a5.end && (i5 += a5.distance), s5 -= a5.distance;
              }
              t6 = c4 + i5 + w4 * ((n3.utils.clamp(e22.start, e22.end, o5) - e22.start - i5) / (s5 - e22.start) - _5);
            }
            C4.length && !h4 && C4.forEach(function(e23) {
              return e23(t6 - i5);
            }), t6 = ee3(t6 + v5), g4 ? (g4.resetTo(`y`, t6, -U3, true), W3 && g4.progress(1)) : (d4.y = t6 + `px`, d4.renderTransform(1));
          }
        } }), T4(m4), n3.core.getCache(m4.trigger).stRevert = ge3, m4.startY = c4, m4.pins = b4, m4.markers = C4, m4.ratio = p4, m4.autoSpeed = h4, e21.style.willChange = `transform`), m4;
      };
      Q3(), u3.addEventListener(`killAll`, Q3), n3.delayedCall(0.5, function() {
        return W3 = 0;
      }), this.scrollTop = X3, this.scrollTo = function(e21, t5, r4) {
        var i4 = n3.utils.clamp(0, y3(), isNaN(e21) ? _4.offset(e21, r4, !!t5 && !N3) : +e21);
        t5 ? N3 ? n3.to(_4, { duration: B3, scrollTop: i4, overwrite: `auto`, ease: f3 }) : z3(i4) : X3(i4);
      }, this.offset = function(e21, t5, r4) {
        e21 = c3(e21)[0];
        var i4 = e21.style.cssText, a4 = u3.create({ trigger: e21, start: t5 || `top top` }), o4;
        return j3 && (W3 ? u3.refresh() : pe3([a4], true)), o4 = a4.start / (r4 ? V3 : 1), a4.kill(false), e21.style.cssText = i4, n3.core.getCache(e21).uncache = 1, o4;
      };
      function $3() {
        return k3 = D3.clientHeight, D3.style.overflow = `visible`, s3.style.height = i3.innerHeight + (k3 - i3.innerHeight) / V3 + `px`, k3 - i3.innerHeight;
      }
      this.content = function(e21) {
        if (arguments.length) {
          var t5 = c3(e21 || `#smooth-content`)[0] || console.warn(`ScrollSmoother needs a valid content element.`) || s3.children[0];
          return t5 !== D3 && (D3 = t5, ae3 = D3.getAttribute(`style`) || ``, Z3 && Z3.observe(D3), n3.set(D3, { overflow: `visible`, width: `100%`, boxSizing: `border-box`, y: `+=0` }), B3 || n3.set(D3, { clearProps: `transform` })), this;
        }
        return D3;
      }, this.wrapper = function(e21) {
        return arguments.length ? (O3 = c3(e21 || `#smooth-wrapper`)[0] || b3(D3), ie3 = O3.getAttribute(`style`) || ``, $3(), n3.set(O3, B3 ? { overflow: `hidden`, position: `fixed`, height: `100%`, width: `100%`, top: 0, left: 0, right: 0, bottom: 0 } : { overflow: `visible`, position: `relative`, width: `100%`, height: `auto`, top: `auto`, bottom: `auto`, left: `auto`, right: `auto` }), this) : O3;
      }, this.effects = function(e21, t5) {
        var n4;
        if (j3 || (j3 = []), !e21) return j3.slice(0);
        e21 = c3(e21), e21.forEach(function(e22) {
          for (var t6 = j3.length; t6--; ) j3[t6].trigger === e22 && j3[t6].kill();
        }), t5 || (t5 = {});
        var r4 = t5, i4 = r4.speed, a4 = r4.lag, o4 = r4.effectsPadding, s4 = [], l4, d4;
        for (l4 = 0; l4 < e21.length; l4++) d4 = ve3(e21[l4], i4, a4, l4, o4), d4 && s4.push(d4);
        return (n4 = j3).push.apply(n4, s4), t5.refresh !== false && u3.refresh(), s4;
      }, this.sections = function(e21, t5) {
        var n4;
        if (M3 || (M3 = []), !e21) return M3.slice(0);
        var r4 = c3(e21).map(function(e22) {
          return u3.create({ trigger: e22, start: `top 120%`, end: `bottom -20%`, onToggle: function(t6) {
            e22.style.opacity = t6.isActive ? `1` : `0`, e22.style.pointerEvents = t6.isActive ? `all` : `none`;
          } });
        });
        return t5 && t5.add ? (n4 = M3).push.apply(n4, r4) : M3 = r4.slice(0), r4;
      }, this.content(t4.content), this.wrapper(t4.wrapper), this.render = function(e21) {
        return Y3(e21 || e21 === 0 ? e21 : H3);
      }, this.getVelocity = function() {
        return G3.getVelocity(-H3);
      }, u3.scrollerProxy(O3, { scrollTop: X3, scrollHeight: function() {
        return $3() && s3.scrollHeight;
      }, fixedMarkers: t4.fixedMarkers !== false && !!B3, content: D3, getBoundingClientRect: function() {
        return { top: 0, left: 0, width: i3.innerWidth, height: i3.innerHeight };
      } }), u3.defaults({ scroller: O3 });
      var ye3 = u3.getAll().filter(function(e21) {
        return e21.scroller === i3 || e21.scroller === O3;
      });
      ye3.forEach(function(e21) {
        return e21.revert(true, true);
      }), A3 = u3.create({ animation: n3.fromTo(K3, { y: function() {
        return L3 = 0, 0;
      } }, { y: function() {
        return L3 = 1, -$3();
      }, immediateRender: false, ease: `none`, data: `ScrollSmoother`, duration: 100, onUpdate: function() {
        if (L3) {
          var e21 = q3;
          e21 && (J3(A3), K3.y = H3), Y3(K3.y, e21), se3(), S3 && !N3 && S3(oe3);
        }
      } }), onRefreshInit: function(t5) {
        if (!e20.isRefreshing) {
          if (e20.isRefreshing = true, j3) {
            var n4 = u3.getAll().filter(function(e21) {
              return !!e21.pin;
            });
            j3.forEach(function(e21) {
              e21.vars.pinnedContainer || n4.forEach(function(t6) {
                if (t6.pin.contains(e21.trigger)) {
                  var n5 = e21.vars;
                  n5.pinnedContainer = t6.pin, e21.vars = null, e21.init(n5, e21.animation);
                }
              });
            });
          }
          var r4 = t5.getTween();
          I3 = r4 && r4._end > r4._dp._time, F3 = H3, K3.y = 0, B3 && (u3.isTouch === 1 && (O3.style.position = `absolute`), O3.scrollTop = 0, u3.isTouch === 1 && (O3.style.position = `fixed`));
        }
      }, onRefresh: function(t5) {
        t5.animation.invalidate(), K3.y = 0, t5.setPositions(t5.start, $3() / V3), I3 || J3(t5), K3.y = -z3() * V3, Y3(K3.y), W3 || (I3 && (q3 = false), t5.animation.progress(n3.utils.clamp(0, 1, F3 / V3 / -t5.end))), I3 && (t5.progress -= 1e-3, t5.update()), e20.isRefreshing = false;
      }, id: `ScrollSmoother`, scroller: i3, invalidateOnRefresh: true, start: 0, refreshPriority: -9999, end: function() {
        return $3() / V3;
      }, onScrubComplete: function() {
        G3.reset(), C3 && C3(_4);
      }, scrub: B3 || true }), this.smooth = function(e21) {
        return arguments.length && (B3 = e21 || 0, V3 = B3 && +t4.speed || 1, A3.scrubDuration(e21)), A3.getTween() ? A3.getTween().duration() : 0;
      }, A3.getTween() && (A3.getTween().vars.ease = t4.ease || f3), this.scrollTrigger = A3, t4.effects && this.effects(t4.effects === true ? `[data-` + R3 + `speed], [data-` + R3 + `lag]` : t4.effects, { effectsPadding: t4.effectsPadding, refresh: false }), t4.sections && this.sections(t4.sections === true ? `[data-section]` : t4.sections), ye3.forEach(function(e21) {
        e21.vars.scroller = O3, e21.revert(false, true), e21.init(e21.vars, e21.animation);
      }), this.paused = function(e21, t5) {
        return arguments.length ? (!!N3 !== e21 && (e21 ? (A3.getTween() && A3.getTween().pause(), z3(-H3 / V3), G3.reset(), P3 = u3.normalizeScroll(), P3 && P3.disable(), N3 = u3.observe({ preventDefault: true, type: `wheel,touch,scroll`, debounce: false, allowClicks: true, onChangeY: function() {
          return X3(-H3);
        } }), N3.nested = m3(o3, `wheel,touch,scroll`, true, t5 !== false)) : (N3.nested.kill(), N3.kill(), N3 = 0, P3 && P3.enable(), A3.progress = (-H3 / V3 - A3.start) / (A3.end - A3.start), J3(A3))), this) : !!N3;
      }, this.kill = this.revert = function() {
        _4.paused(false), J3(A3), A3.kill();
        for (var e21 = (j3 || []).concat(M3 || []), t5 = e21.length; t5--; ) e21[t5].kill();
        u3.scrollerProxy(O3), u3.removeEventListener(`killAll`, Q3), u3.removeEventListener(`refresh`, me3), O3.style.cssText = ie3, D3.style.cssText = ae3;
        var n4 = u3.defaults({});
        n4 && n4.scroller === O3 && u3.defaults({ scroller: i3 }), _4.normalizer && u3.normalizeScroll(false), clearInterval(re3), d3 = null, Z3 && Z3.disconnect(), s3.style.removeProperty(`height`), i3.removeEventListener(`focusin`, ue3);
      }, this.refresh = function(e21, t5) {
        return A3.refresh(e21, t5);
      }, E3 && (this.normalizer = u3.normalizeScroll(E3 === true ? { debounce: true, content: !B3 && D3 } : E3)), u3.config(t4), `scrollBehavior` in i3.getComputedStyle(s3) && n3.set([s3, o3], { scrollBehavior: `auto` }), i3.addEventListener(`focusin`, ue3), re3 = setInterval(se3, 250), a3.readyState === `loading` || requestAnimationFrame(function() {
        return u3.refresh();
      });
    }
    return e20.register = function(t4) {
      return r3 || (n3 = t4 || v3(), _3() && window.document && (i3 = window, a3 = document, o3 = a3.documentElement, s3 = a3.body), n3 && (c3 = n3.utils.toArray, l3 = n3.utils.clamp, f3 = n3.parseEase(`expo`), h3 = n3.core.context || function() {
      }, u3 = n3.core.globals().ScrollTrigger, n3.core.globals(`ScrollSmoother`, e20), s3 && u3 && (g3 = n3.delayedCall(0.2, function() {
        return u3.isRefreshing || d3 && d3.refresh();
      }).pause(), p3 = u3.core._getVelocityProp, m3 = u3.core._inputObserver, e20.refresh = u3.refresh, r3 = 1))), r3;
    }, t3(e20, [{ key: `progress`, get: function() {
      return this.scrollTrigger ? this.scrollTrigger.animation._time / 100 : 0;
    } }]), e20;
  })();
  x3.version = `3.15.0`, x3.create = function(e20) {
    return d3 && e20 && d3.content() === c3(e20.content)[0] ? d3 : new x3(e20);
  }, x3.get = function() {
    return d3;
  }, v3() && n3.registerPlugin(x3);

  // public/shopify/plantilla99/assets/js/SmoothScrollLayout.astro_astro_type_script_index_0_lang.DSfk63xh.js
  if (ci.registerPlugin($2, x3), document.getElementById(`smooth-wrapper`) && document.getElementById(`smooth-content`) && $2.isTouch !== 1) {
    let e20 = x3.create({ wrapper: `#smooth-wrapper`, content: `#smooth-content`, normalizeScroll: { allowNestedScroll: true }, smooth: 0.6, effects: true, smoothTouch: 0.1 });
    window.ScrollSmootherInstance = e20, $2.refresh(), document.addEventListener(`click`, (t4) => {
      let n4 = t4.target.closest(`a[href^="#"]`);
      if (n4) {
        let r4 = n4.getAttribute(`href`);
        if (r4 && r4.length > 1) {
          let n5 = document.querySelector(r4);
          n5 && (t4.preventDefault(), e20.scrollTo(n5, true, `center center`));
        }
      }
    });
  }
})();
