"use strict";
(() => {
  // public/shopify/plantilla99/assets/js/gsap.Bi_c5vh2.js
  function e(e24) {
    if (e24 === void 0) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return e24;
  }
  function t(e24, t4) {
    e24.prototype = Object.create(t4.prototype), e24.prototype.constructor = e24, e24.__proto__ = t4;
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
  var h = function(e24) {
    return typeof e24 == `string`;
  };
  var g = function(e24) {
    return typeof e24 == `function`;
  };
  var _ = function(e24) {
    return typeof e24 == `number`;
  };
  var v = function(e24) {
    return e24 === void 0;
  };
  var y = function(e24) {
    return typeof e24 == `object`;
  };
  var b = function(e24) {
    return e24 !== false;
  };
  var x = function() {
    return typeof window < `u`;
  };
  var S = function(e24) {
    return g(e24) || h(e24);
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
  var ee = function(e24) {
    return (z = Oe(e24, R)) && Z;
  };
  var te = function(e24, t4) {
    return console.warn(`Invalid property`, e24, `set to`, t4, `Missing plugin? gsap.registerPlugin()`);
  };
  var ne = function(e24, t4) {
    return !t4 && console.warn(e24);
  };
  var re = function(e24, t4) {
    return e24 && (R[e24] = t4) && z && (z[e24] = t4) || R;
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
  var ge = function(e24) {
    var t4 = e24[0], n3, r3;
    if (y(t4) || g(t4) || (e24 = [e24]), !(n3 = (t4._gsap || {}).harness)) {
      for (r3 = me.length; r3-- && !me[r3].targetTest(t4); ) ;
      n3 = me[r3];
    }
    for (r3 = e24.length; r3--; ) e24[r3] && (e24[r3]._gsap || (e24[r3]._gsap = new en(e24[r3], n3))) || e24.splice(r3, 1);
    return e24;
  };
  var _e = function(e24) {
    return e24._gsap || ge(ut(e24))[0]._gsap;
  };
  var ve = function(e24, t4, n3) {
    return (n3 = e24[t4]) && g(n3) ? e24[t4]() : v(n3) && e24.getAttribute && e24.getAttribute(t4) || n3;
  };
  var H = function(e24, t4) {
    return (e24 = e24.split(`,`)).forEach(t4) || e24;
  };
  var U = function(e24) {
    return Math.round(e24 * 1e5) / 1e5 || 0;
  };
  var W = function(e24) {
    return Math.round(e24 * 1e7) / 1e7 || 0;
  };
  var ye = function(e24, t4) {
    var n3 = t4.charAt(0), r3 = parseFloat(t4.substr(2));
    return e24 = parseFloat(e24), n3 === `+` ? e24 + r3 : n3 === `-` ? e24 - r3 : n3 === `*` ? e24 * r3 : e24 / r3;
  };
  var be = function(e24, t4) {
    for (var n3 = t4.length, r3 = 0; e24.indexOf(t4[r3]) < 0 && ++r3 < n3; ) ;
    return r3 < n3;
  };
  var xe = function() {
    var e24 = le.length, t4 = le.slice(0), n3, r3;
    for (ue = {}, le.length = 0, n3 = 0; n3 < e24; n3++) r3 = t4[n3], r3 && r3._lazy && (r3.render(r3._lazy[0], r3._lazy[1], true)._lazy = 0);
  };
  var Se = function(e24) {
    return !!(e24._initted || e24._startAt || e24.add);
  };
  var Ce = function(e24, t4, n3, r3) {
    le.length && !a && xe(), e24.render(t4, n3, r3 || !!(a && t4 < 0 && Se(e24))), le.length && !a && xe();
  };
  var we = function(e24) {
    var t4 = parseFloat(e24);
    return (t4 || t4 === 0) && (e24 + ``).match(M).length < 2 ? t4 : h(e24) ? e24.trim() : e24;
  };
  var Te = function(e24) {
    return e24;
  };
  var Ee = function(e24, t4) {
    for (var n3 in t4) n3 in e24 || (e24[n3] = t4[n3]);
    return e24;
  };
  var De = function(e24) {
    return function(t4, n3) {
      for (var r3 in n3) r3 in t4 || r3 === `duration` && e24 || r3 === `ease` || (t4[r3] = n3[r3]);
    };
  };
  var Oe = function(e24, t4) {
    for (var n3 in t4) e24[n3] = t4[n3];
    return e24;
  };
  var ke = function e2(t4, n3) {
    for (var r3 in n3) r3 !== `__proto__` && r3 !== `constructor` && r3 !== `prototype` && (t4[r3] = y(n3[r3]) ? e2(t4[r3] || (t4[r3] = {}), n3[r3]) : n3[r3]);
    return t4;
  };
  var Ae = function(e24, t4) {
    var n3 = {}, r3;
    for (r3 in e24) r3 in t4 || (n3[r3] = e24[r3]);
    return n3;
  };
  var je = function(e24) {
    var t4 = e24.parent || P, n3 = e24.keyframes ? De(w(e24.keyframes)) : Ee;
    if (b(e24.inherit)) for (; t4; ) n3(e24, t4.vars.defaults), t4 = t4.parent || t4._dp;
    return e24;
  };
  var Me = function(e24, t4) {
    for (var n3 = e24.length, r3 = n3 === t4.length; r3 && n3-- && e24[n3] === t4[n3]; ) ;
    return n3 < 0;
  };
  var Ne = function(e24, t4, n3, r3, i3) {
    n3 === void 0 && (n3 = `_first`), r3 === void 0 && (r3 = `_last`);
    var a3 = e24[r3], o3;
    if (i3) for (o3 = t4[i3]; a3 && a3[i3] > o3; ) a3 = a3._prev;
    return a3 ? (t4._next = a3._next, a3._next = t4) : (t4._next = e24[n3], e24[n3] = t4), t4._next ? t4._next._prev = t4 : e24[r3] = t4, t4._prev = a3, t4.parent = t4._dp = e24, t4;
  };
  var Pe = function(e24, t4, n3, r3) {
    n3 === void 0 && (n3 = `_first`), r3 === void 0 && (r3 = `_last`);
    var i3 = t4._prev, a3 = t4._next;
    i3 ? i3._next = a3 : e24[n3] === t4 && (e24[n3] = a3), a3 ? a3._prev = i3 : e24[r3] === t4 && (e24[r3] = i3), t4._next = t4._prev = t4.parent = null;
  };
  var Fe = function(e24, t4) {
    e24.parent && (!t4 || e24.parent.autoRemoveChildren) && e24.parent.remove && e24.parent.remove(e24), e24._act = 0;
  };
  var Ie = function(e24, t4) {
    if (e24 && (!t4 || t4._end > e24._dur || t4._start < 0)) for (var n3 = e24; n3; ) n3._dirty = 1, n3 = n3.parent;
    return e24;
  };
  var Le = function(e24) {
    for (var t4 = e24.parent; t4 && t4.parent; ) t4._dirty = 1, t4.totalDuration(), t4 = t4.parent;
    return e24;
  };
  var Re = function(e24, t4, n3, r3) {
    return e24._startAt && (a ? e24._startAt.revert(oe) : e24.vars.immediateRender && !e24.vars.autoRevert || e24._startAt.render(t4, true, r3));
  };
  var ze = function e3(t4) {
    return !t4 || t4._ts && e3(t4.parent);
  };
  var Be = function(e24) {
    return e24._repeat ? Ve(e24._tTime, e24 = e24.duration() + e24._rDelay) * e24 : 0;
  };
  var Ve = function(e24, t4) {
    var n3 = Math.floor(e24 = W(e24 / t4));
    return e24 && n3 === e24 ? n3 - 1 : n3;
  };
  var He = function(e24, t4) {
    return (e24 - t4._start) * t4._ts + (t4._ts >= 0 ? 0 : t4._dirty ? t4.totalDuration() : t4._tDur);
  };
  var Ue = function(e24) {
    return e24._end = W(e24._start + (e24._tDur / Math.abs(e24._ts || e24._rts || c) || 0));
  };
  var We = function(e24, t4) {
    var n3 = e24._dp;
    return n3 && n3.smoothChildTiming && e24._ts && (e24._start = W(n3._time - (e24._ts > 0 ? t4 / e24._ts : ((e24._dirty ? e24.totalDuration() : e24._tDur) - t4) / -e24._ts)), Ue(e24), n3._dirty || Ie(n3, e24)), e24;
  };
  var Ge = function(e24, t4) {
    var n3;
    if ((t4._time || !t4._dur && t4._initted || t4._start < e24._time && (t4._dur || !t4.add)) && (n3 = He(e24.rawTime(), t4), (!t4._dur || at(0, t4.totalDuration(), n3) - t4._tTime > c) && t4.render(n3, true)), Ie(e24, t4)._dp && e24._initted && e24._time >= e24._dur && e24._ts) {
      if (e24._dur < e24.duration()) for (n3 = e24; n3._dp; ) n3.rawTime() >= 0 && n3.totalTime(n3._tTime), n3 = n3._dp;
      e24._zTime = -c;
    }
  };
  var Ke = function(e24, t4, n3, r3) {
    return t4.parent && Fe(t4), t4._start = W((_(n3) ? n3 : n3 || e24 !== P ? nt(e24, n3, t4) : e24._time) + t4._delay), t4._end = W(t4._start + (t4.totalDuration() / Math.abs(t4.timeScale()) || 0)), Ne(e24, t4, `_first`, `_last`, e24._sort ? `_start` : 0), Xe(t4) || (e24._recent = t4), r3 || Ge(e24, t4), e24._ts < 0 && We(e24, e24._tTime), e24;
  };
  var qe = function(e24, t4) {
    return (R.ScrollTrigger || te(`scrollTrigger`, t4)) && R.ScrollTrigger.create(t4, e24);
  };
  var Je = function(e24, t4, n3, r3, i3) {
    if (ln(e24, t4, i3), !e24._initted) return 1;
    if (!n3 && e24._pt && !a && (e24._dur && e24.vars.lazy !== false || !e24._dur && e24.vars.lazy) && de !== Vt.frame) return le.push(e24), e24._lazy = [i3, r3], 1;
  };
  var Ye = function e4(t4) {
    var n3 = t4.parent;
    return n3 && n3._ts && n3._initted && !n3._lock && (n3.rawTime() < 0 || e4(n3));
  };
  var Xe = function(e24) {
    var t4 = e24.data;
    return t4 === `isFromStart` || t4 === `isStart`;
  };
  var Ze = function(e24, t4, n3, r3) {
    var i3 = e24.ratio, o3 = t4 < 0 || !t4 && (!e24._start && Ye(e24) && !(!e24._initted && Xe(e24)) || (e24._ts < 0 || e24._dp._ts < 0) && !Xe(e24)) ? 0 : 1, s3 = e24._rDelay, l3 = 0, u3, d3, f3;
    if (s3 && e24._repeat && (l3 = at(0, e24._tDur, t4), d3 = Ve(l3, s3), e24._yoyo && d3 & 1 && (o3 = 1 - o3), d3 !== Ve(e24._tTime, s3) && (i3 = 1 - o3, e24.vars.repeatRefresh && e24._initted && e24.invalidate())), o3 !== i3 || a || r3 || e24._zTime === c || !t4 && e24._zTime) {
      if (!e24._initted && Je(e24, t4, r3, n3, l3)) return;
      for (f3 = e24._zTime, e24._zTime = t4 || (n3 ? c : 0), n3 || (n3 = t4 && !f3), e24.ratio = o3, e24._from && (o3 = 1 - o3), e24._time = 0, e24._tTime = l3, u3 = e24._pt; u3; ) u3.r(o3, u3.d), u3 = u3._next;
      t4 < 0 && Re(e24, t4, n3, true), e24._onUpdate && !n3 && Dt(e24, `onUpdate`), l3 && e24._repeat && !n3 && e24.parent && Dt(e24, `onRepeat`), (t4 >= e24._tDur || t4 < 0) && e24.ratio === o3 && (o3 && Fe(e24, 1), !n3 && !a && (Dt(e24, o3 ? `onComplete` : `onReverseComplete`, true), e24._prom && e24._prom()));
    } else e24._zTime || (e24._zTime = t4);
  };
  var Qe = function(e24, t4, n3) {
    var r3;
    if (n3 > t4) for (r3 = e24._first; r3 && r3._start <= n3; ) {
      if (r3.data === `isPause` && r3._start > t4) return r3;
      r3 = r3._next;
    }
    else for (r3 = e24._last; r3 && r3._start >= n3; ) {
      if (r3.data === `isPause` && r3._start < t4) return r3;
      r3 = r3._prev;
    }
  };
  var $e = function(e24, t4, n3, r3) {
    var i3 = e24._repeat, a3 = W(t4) || 0, o3 = e24._tTime / e24._tDur;
    return o3 && !r3 && (e24._time *= a3 / e24._dur), e24._dur = a3, e24._tDur = i3 ? i3 < 0 ? 1e10 : W(a3 * (i3 + 1) + e24._rDelay * i3) : a3, o3 > 0 && !r3 && We(e24, e24._tTime = e24._tDur * o3), e24.parent && Ue(e24), n3 || Ie(e24.parent, e24), e24;
  };
  var et = function(e24) {
    return e24 instanceof J ? Ie(e24) : $e(e24, e24._dur);
  };
  var tt = { _start: 0, endTime: ie, totalDuration: ie };
  var nt = function e5(t4, n3, r3) {
    var i3 = t4.labels, a3 = t4._recent || tt, o3 = t4.duration() >= s ? a3.endTime(false) : t4._dur, c3, l3, u3;
    return h(n3) && (isNaN(n3) || n3 in i3) ? (l3 = n3.charAt(0), u3 = n3.substr(-1) === `%`, c3 = n3.indexOf(`=`), l3 === `<` || l3 === `>` ? (c3 >= 0 && (n3 = n3.replace(/=/, ``)), (l3 === `<` ? a3._start : a3.endTime(a3._repeat >= 0)) + (parseFloat(n3.substr(1)) || 0) * (u3 ? (c3 < 0 ? a3 : r3).totalDuration() / 100 : 1)) : c3 < 0 ? (n3 in i3 || (i3[n3] = o3), i3[n3]) : (l3 = parseFloat(n3.charAt(c3 - 1) + n3.substr(c3 + 1)), u3 && r3 && (l3 = l3 / 100 * (w(r3) ? r3[0] : r3).totalDuration()), c3 > 1 ? e5(t4, n3.substr(0, c3 - 1), r3) + l3 : o3 + l3)) : n3 == null ? o3 : +n3;
  };
  var rt = function(e24, t4, n3) {
    var r3 = _(t4[1]), i3 = (r3 ? 2 : 1) + (e24 < 2 ? 0 : 1), a3 = t4[i3], o3, s3;
    if (r3 && (a3.duration = t4[1]), a3.parent = n3, e24) {
      for (o3 = a3, s3 = n3; s3 && !(`immediateRender` in o3); ) o3 = s3.vars.defaults || {}, s3 = b(s3.vars.inherit) && s3.parent;
      a3.immediateRender = b(o3.immediateRender), e24 < 2 ? a3.runBackwards = 1 : a3.startAt = t4[i3 - 1];
    }
    return new Y(t4[0], a3, t4[i3 + 1]);
  };
  var it = function(e24, t4) {
    return e24 || e24 === 0 ? t4(e24) : t4;
  };
  var at = function(e24, t4, n3) {
    return n3 < e24 ? e24 : n3 > t4 ? t4 : n3;
  };
  var G = function(e24, t4) {
    return !h(e24) || !(t4 = N.exec(e24)) ? `` : t4[1];
  };
  var ot = function(e24, t4, n3) {
    return it(n3, function(n4) {
      return at(e24, t4, n4);
    });
  };
  var st = [].slice;
  var ct = function(e24, t4) {
    return e24 && y(e24) && `length` in e24 && (!t4 && !e24.length || e24.length - 1 in e24 && y(e24[0])) && !e24.nodeType && e24 !== F;
  };
  var lt = function(e24, t4, n3) {
    return n3 === void 0 && (n3 = []), e24.forEach(function(e25) {
      var r3;
      return h(e25) && !t4 || ct(e25, 1) ? (r3 = n3).push.apply(r3, ut(e25)) : n3.push(e25);
    }) || n3;
  };
  var ut = function(e24, t4, n3) {
    return o && !t4 && o.selector ? o.selector(e24) : h(e24) && !n3 && (I || !Ht()) ? st.call((t4 || L).querySelectorAll(e24), 0) : w(e24) ? lt(e24, n3) : ct(e24) ? st.call(e24, 0) : e24 ? [e24] : [];
  };
  var dt = function(e24) {
    return e24 = ut(e24)[0] || ne(`Invalid scope`) || {}, function(t4) {
      var n3 = e24.current || e24.nativeElement || e24;
      return ut(t4, n3.querySelectorAll ? n3 : n3 === e24 ? ne(`Invalid scope`) || L.createElement(`div`) : e24);
    };
  };
  var ft = function(e24) {
    return e24.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var pt = function(e24) {
    if (g(e24)) return e24;
    var t4 = y(e24) ? e24 : { each: e24 }, n3 = Yt(t4.ease), r3 = t4.from || 0, i3 = parseFloat(t4.base) || 0, a3 = {}, o3 = r3 > 0 && r3 < 1, c3 = isNaN(r3) || o3, l3 = t4.axis, u3 = r3, d3 = r3;
    return h(r3) ? u3 = d3 = { center: 0.5, edges: 0.5, end: 1 }[r3] || 0 : !o3 && c3 && (u3 = r3[0], d3 = r3[1]), function(e25, o4, p3) {
      var m3 = (p3 || t4).length, h3 = a3[m3], g3, _3, v3, y3, b3, x3, S3, C3, w3;
      if (!h3) {
        if (w3 = t4.grid === `auto` ? 0 : (t4.grid || [1, s])[1], !w3) {
          for (S3 = -s; S3 < (S3 = p3[w3++].getBoundingClientRect().left) && w3 < m3; ) ;
          w3 < m3 && w3--;
        }
        for (h3 = a3[m3] = [], g3 = c3 ? Math.min(w3, m3) * u3 - 0.5 : r3 % w3, _3 = w3 === s ? 0 : c3 ? m3 * d3 / w3 - 0.5 : r3 / w3 | 0, S3 = 0, C3 = s, x3 = 0; x3 < m3; x3++) v3 = x3 % w3 - g3, y3 = _3 - (x3 / w3 | 0), h3[x3] = b3 = l3 ? Math.abs(l3 === `y` ? y3 : v3) : f(v3 * v3 + y3 * y3), b3 > S3 && (S3 = b3), b3 < C3 && (C3 = b3);
        r3 === `random` && ft(h3), h3.max = S3 - C3, h3.min = C3, h3.v = m3 = (parseFloat(t4.amount) || parseFloat(t4.each) * (w3 > m3 ? m3 - 1 : l3 ? l3 === `y` ? m3 / w3 : w3 : Math.max(w3, m3 / w3)) || 0) * (r3 === `edges` ? -1 : 1), h3.b = m3 < 0 ? i3 - m3 : i3, h3.u = G(t4.amount || t4.each) || 0, n3 = n3 && m3 < 0 ? Jt(n3) : n3;
      }
      return m3 = (h3[e25] - h3.min) / h3.max || 0, W(h3.b + (n3 ? n3(m3) : m3) * h3.v) + h3.u;
    };
  };
  var mt = function(e24) {
    var t4 = 10 ** ((e24 + ``).split(`.`)[1] || ``).length;
    return function(n3) {
      var r3 = W(Math.round(parseFloat(n3) / e24) * e24 * t4);
      return (r3 - r3 % 1) / t4 + (_(n3) ? 0 : G(n3));
    };
  };
  var ht = function(e24, t4) {
    var n3 = w(e24), r3, i3;
    return !n3 && y(e24) && (r3 = n3 = e24.radius || s, e24.values ? (e24 = ut(e24.values), (i3 = !_(e24[0])) && (r3 *= r3)) : e24 = mt(e24.increment)), it(t4, n3 ? g(e24) ? function(t5) {
      return i3 = e24(t5), Math.abs(i3 - t5) <= r3 ? i3 : t5;
    } : function(t5) {
      for (var n4 = parseFloat(i3 ? t5.x : t5), a3 = parseFloat(i3 ? t5.y : 0), o3 = s, c3 = 0, l3 = e24.length, u3, d3; l3--; ) i3 ? (u3 = e24[l3].x - n4, d3 = e24[l3].y - a3, u3 = u3 * u3 + d3 * d3) : u3 = Math.abs(e24[l3] - n4), u3 < o3 && (o3 = u3, c3 = l3);
      return c3 = !r3 || o3 <= r3 ? e24[c3] : t5, i3 || c3 === t5 || _(t5) ? c3 : c3 + G(t5);
    } : mt(e24));
  };
  var gt = function(e24, t4, n3, r3) {
    return it(w(e24) ? !t4 : n3 === true ? !!(n3 = 0) : !r3, function() {
      return w(e24) ? e24[~~(Math.random() * e24.length)] : (n3 || (n3 = 1e-5)) && (r3 = n3 < 1 ? 10 ** ((n3 + ``).length - 2) : 1) && Math.floor(Math.round((e24 - n3 / 2 + Math.random() * (t4 - e24 + n3 * 0.99)) / n3) * n3 * r3) / r3;
    });
  };
  var _t = function() {
    var e24 = [...arguments];
    return function(t4) {
      return e24.reduce(function(e25, t5) {
        return t5(e25);
      }, t4);
    };
  };
  var vt = function(e24, t4) {
    return function(n3) {
      return e24(parseFloat(n3)) + (t4 || G(n3));
    };
  };
  var yt = function(e24, t4, n3) {
    return wt(e24, t4, 0, 1, n3);
  };
  var bt = function(e24, t4, n3) {
    return it(n3, function(n4) {
      return e24[~~t4(n4)];
    });
  };
  var xt = function e6(t4, n3, r3) {
    var i3 = n3 - t4;
    return w(t4) ? bt(t4, e6(0, t4.length), n3) : it(r3, function(e24) {
      return (i3 + (e24 - t4) % i3) % i3 + t4;
    });
  };
  var St = function e7(t4, n3, r3) {
    var i3 = n3 - t4, a3 = i3 * 2;
    return w(t4) ? bt(t4, e7(0, t4.length - 1), n3) : it(r3, function(e24) {
      return e24 = (a3 + (e24 - t4) % a3) % a3 || 0, t4 + (e24 > i3 ? a3 - e24 : e24);
    });
  };
  var Ct = function(e24) {
    return e24.replace(T, function(e25) {
      var t4 = e25.indexOf(`[`) + 1, n3 = e25.substring(t4 || 7, t4 ? e25.indexOf(`]`) : e25.length - 1).split(E);
      return gt(t4 ? n3 : +n3[0], t4 ? 0 : +n3[1], +n3[2] || 1e-5);
    });
  };
  var wt = function(e24, t4, n3, r3, i3) {
    var a3 = t4 - e24, o3 = r3 - n3;
    return it(i3, function(t5) {
      return n3 + ((t5 - e24) / a3 * o3 || 0);
    });
  };
  var Tt = function e8(t4, n3, r3, i3) {
    var a3 = isNaN(t4 + n3) ? 0 : function(e24) {
      return (1 - e24) * t4 + e24 * n3;
    };
    if (!a3) {
      var o3 = h(t4), s3 = {}, c3, l3, u3, d3, f3;
      if (r3 === true && (i3 = 1) && (r3 = null), o3) t4 = { p: t4 }, n3 = { p: n3 };
      else if (w(t4) && !w(n3)) {
        for (u3 = [], d3 = t4.length, f3 = d3 - 2, l3 = 1; l3 < d3; l3++) u3.push(e8(t4[l3 - 1], t4[l3]));
        d3--, a3 = function(e24) {
          e24 *= d3;
          var t5 = Math.min(f3, ~~e24);
          return u3[t5](e24 - t5);
        }, r3 = n3;
      } else i3 || (t4 = Oe(w(t4) ? [] : {}, t4));
      if (!u3) {
        for (c3 in n3) rn.call(s3, t4, c3, `get`, n3[c3]);
        a3 = function(e24) {
          return wn(e24, s3) || (o3 ? t4.p : t4);
        };
      }
    }
    return it(r3, a3);
  };
  var Et = function(e24, t4, n3) {
    var r3 = e24.labels, i3 = s, a3, o3, c3;
    for (a3 in r3) o3 = r3[a3] - t4, o3 < 0 == !!n3 && o3 && i3 > (o3 = Math.abs(o3)) && (c3 = a3, i3 = o3);
    return c3;
  };
  var Dt = function(e24, t4, n3) {
    var r3 = e24.vars, i3 = r3[t4], a3 = o, s3 = e24._ctx, c3, l3, u3;
    if (i3) return c3 = r3[t4 + `Params`], l3 = r3.callbackScope || e24, n3 && le.length && xe(), s3 && (o = s3), u3 = c3 ? i3.apply(l3, c3) : i3.call(l3), o = a3, u3;
  };
  var Ot = function(e24) {
    return Fe(e24), e24.scrollTrigger && e24.scrollTrigger.kill(!!a), e24.progress() < 1 && Dt(e24, `onInterrupt`), e24;
  };
  var kt;
  var At = [];
  var jt = function(e24) {
    if (e24) if (e24 = !e24.name && e24.default || e24, x() || e24.headless) {
      var t4 = e24.name, n3 = g(e24), r3 = t4 && !n3 && e24.init ? function() {
        this._props = [];
      } : e24, i3 = { init: ie, render: wn, add: rn, kill: En, modifier: Tn, rawVars: 0 }, a3 = { targetTest: 0, get: 0, getSetter: bn, aliases: {}, register: 0 };
      if (Ht(), e24 !== r3) {
        if (V[t4]) return;
        Ee(r3, Ee(Ae(e24, i3), a3)), Oe(r3.prototype, Oe(i3, Ae(e24, a3))), V[r3.prop = t4] = r3, e24.targetTest && (me.push(r3), ce[t4] = 1), t4 = (t4 === `css` ? `CSS` : t4.charAt(0).toUpperCase() + t4.substr(1)) + `Plugin`;
      }
      re(t4, r3), e24.register && e24.register(Z, r3, X);
    } else At.push(e24);
  };
  var K = 255;
  var Mt = { aqua: [0, K, K], lime: [0, K, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, K], navy: [0, 0, 128], white: [K, K, K], olive: [128, 128, 0], yellow: [K, K, 0], orange: [K, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [K, 0, 0], pink: [K, 192, 203], cyan: [0, K, K], transparent: [K, K, K, 0] };
  var Nt = function(e24, t4, n3) {
    return e24 += e24 < 0 ? 1 : e24 > 1 ? -1 : 0, (e24 * 6 < 1 ? t4 + (n3 - t4) * e24 * 6 : e24 < 0.5 ? n3 : e24 * 3 < 2 ? t4 + (n3 - t4) * (2 / 3 - e24) * 6 : t4) * K + 0.5 | 0;
  };
  var Pt = function(e24, t4, n3) {
    var r3 = e24 ? _(e24) ? [e24 >> 16, e24 >> 8 & K, e24 & K] : 0 : Mt.black, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3;
    if (!r3) {
      if (e24.substr(-1) === `,` && (e24 = e24.substr(0, e24.length - 1)), Mt[e24]) r3 = Mt[e24];
      else if (e24.charAt(0) === `#`) {
        if (e24.length < 6 && (i3 = e24.charAt(1), a3 = e24.charAt(2), o3 = e24.charAt(3), e24 = `#` + i3 + i3 + a3 + a3 + o3 + o3 + (e24.length === 5 ? e24.charAt(4) + e24.charAt(4) : ``)), e24.length === 9) return r3 = parseInt(e24.substr(1, 6), 16), [r3 >> 16, r3 >> 8 & K, r3 & K, parseInt(e24.substr(7), 16) / 255];
        e24 = parseInt(e24.substr(1), 16), r3 = [e24 >> 16, e24 >> 8 & K, e24 & K];
      } else if (e24.substr(0, 3) === `hsl`) {
        if (r3 = p3 = e24.match(D), !t4) s3 = r3[0] % 360 / 360, c3 = r3[1] / 100, l3 = r3[2] / 100, a3 = l3 <= 0.5 ? l3 * (c3 + 1) : l3 + c3 - l3 * c3, i3 = l3 * 2 - a3, r3.length > 3 && (r3[3] *= 1), r3[0] = Nt(s3 + 1 / 3, i3, a3), r3[1] = Nt(s3, i3, a3), r3[2] = Nt(s3 - 1 / 3, i3, a3);
        else if (~e24.indexOf(`=`)) return r3 = e24.match(O), n3 && r3.length < 4 && (r3[3] = 1), r3;
      } else r3 = e24.match(D) || Mt.transparent;
      r3 = r3.map(Number);
    }
    return t4 && !p3 && (i3 = r3[0] / K, a3 = r3[1] / K, o3 = r3[2] / K, u3 = Math.max(i3, a3, o3), d3 = Math.min(i3, a3, o3), l3 = (u3 + d3) / 2, u3 === d3 ? s3 = c3 = 0 : (f3 = u3 - d3, c3 = l3 > 0.5 ? f3 / (2 - u3 - d3) : f3 / (u3 + d3), s3 = u3 === i3 ? (a3 - o3) / f3 + (a3 < o3 ? 6 : 0) : u3 === a3 ? (o3 - i3) / f3 + 2 : (i3 - a3) / f3 + 4, s3 *= 60), r3[0] = ~~(s3 + 0.5), r3[1] = ~~(c3 * 100 + 0.5), r3[2] = ~~(l3 * 100 + 0.5)), n3 && r3.length < 4 && (r3[3] = 1), r3;
  };
  var Ft = function(e24) {
    var t4 = [], n3 = [], r3 = -1;
    return e24.split(Lt).forEach(function(e25) {
      var i3 = e25.match(k) || [];
      t4.push.apply(t4, i3), n3.push(r3 += i3.length + 1);
    }), t4.c = n3, t4;
  };
  var It = function(e24, t4, n3) {
    var r3 = ``, i3 = (e24 + r3).match(Lt), a3 = t4 ? `hsla(` : `rgba(`, o3 = 0, s3, c3, l3, u3;
    if (!i3) return e24;
    if (i3 = i3.map(function(e25) {
      return (e25 = Pt(e25, t4, 1)) && a3 + (t4 ? e25[0] + `,` + e25[1] + `%,` + e25[2] + `%,` + e25[3] : e25.join(`,`)) + `)`;
    }), n3 && (l3 = Ft(e24), s3 = n3.c, s3.join(r3) !== l3.c.join(r3))) for (c3 = e24.replace(Lt, `1`).split(k), u3 = c3.length - 1; o3 < u3; o3++) r3 += c3[o3] + (~s3.indexOf(o3) ? i3.shift() || a3 + `0,0,0,0)` : (l3.length ? l3 : i3.length ? i3 : n3).shift());
    if (!c3) for (c3 = e24.split(Lt), u3 = c3.length - 1; o3 < u3; o3++) r3 += c3[o3] + i3[o3];
    return r3 + c3[u3];
  };
  var Lt = (function() {
    var e24 = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`, t4;
    for (t4 in Mt) e24 += `|` + t4 + `\\b`;
    return RegExp(e24 + `)`, `gi`);
  })();
  var Rt = /hsl[a]?\(/;
  var zt = function(e24) {
    var t4 = e24.join(` `), n3;
    if (Lt.lastIndex = 0, Lt.test(t4)) return n3 = Rt.test(t4), e24[1] = It(e24[1], n3), e24[0] = It(e24[0], n3, Ft(e24[1])), true;
  };
  var Bt;
  var Vt = (function() {
    var e24 = Date.now, t4 = 500, n3 = 33, r3 = e24(), i3 = r3, a3 = 1e3 / 240, o3 = a3, s3 = [], c3, l3, u3, d3, f3, p3, m3 = function u4(m4) {
      var h3 = e24() - i3, g3 = m4 === true, _3, v3, y3, b3;
      if ((h3 > t4 || h3 < 0) && (r3 += h3 - n3), i3 += h3, y3 = i3 - r3, _3 = y3 - o3, (_3 > 0 || g3) && (b3 = ++d3.frame, f3 = y3 - d3.time * 1e3, d3.time = y3 /= 1e3, o3 += _3 + (_3 >= a3 ? 4 : a3 - _3), v3 = 1), g3 || (c3 = l3(u4)), v3) for (p3 = 0; p3 < s3.length; p3++) s3[p3](y3, f3, b3, m4);
    };
    return d3 = { time: 0, frame: 0, tick: function() {
      m3(true);
    }, deltaRatio: function(e25) {
      return f3 / (1e3 / (e25 || 60));
    }, wake: function() {
      B && (!I && x() && (F = I = window, L = F.document || {}, R.gsap = Z, (F.gsapVersions || (F.gsapVersions = [])).push(Z.version), ee(z || F.GreenSockGlobals || !F.gsap && F || {}), At.forEach(jt)), u3 = typeof requestAnimationFrame < `u` && requestAnimationFrame, c3 && d3.sleep(), l3 = u3 || function(e25) {
        return setTimeout(e25, o3 - d3.time * 1e3 + 1 | 0);
      }, Bt = 1, m3(2));
    }, sleep: function() {
      (u3 ? cancelAnimationFrame : clearTimeout)(c3), Bt = 0, l3 = ie;
    }, lagSmoothing: function(e25, r4) {
      t4 = e25 || 1 / 0, n3 = Math.min(r4 || 33, t4);
    }, fps: function(e25) {
      a3 = 1e3 / (e25 || 240), o3 = d3.time * 1e3 + a3;
    }, add: function(e25, t5, n4) {
      var r4 = t5 ? function(t6, n5, i4, a4) {
        e25(t6, n5, i4, a4), d3.remove(r4);
      } : e25;
      return d3.remove(e25), s3[n4 ? `unshift` : `push`](r4), Ht(), r4;
    }, remove: function(e25, t5) {
      ~(t5 = s3.indexOf(e25)) && s3.splice(t5, 1) && p3 >= t5 && p3--;
    }, _listeners: s3 }, d3;
  })();
  var Ht = function() {
    return !Bt && Vt.wake();
  };
  var q = {};
  var Ut = /^[\d.\-M][\d.\-,\s]/;
  var Wt = /["']/g;
  var Gt = function(e24) {
    for (var t4 = {}, n3 = e24.substr(1, e24.length - 3).split(`:`), r3 = n3[0], i3 = 1, a3 = n3.length, o3, s3, c3; i3 < a3; i3++) s3 = n3[i3], o3 = i3 === a3 - 1 ? s3.length : s3.lastIndexOf(`,`), c3 = s3.substr(0, o3), t4[r3] = isNaN(c3) ? c3.replace(Wt, ``).trim() : +c3, r3 = s3.substr(o3 + 1).trim();
    return t4;
  };
  var Kt = function(e24) {
    var t4 = e24.indexOf(`(`) + 1, n3 = e24.indexOf(`)`), r3 = e24.indexOf(`(`, t4);
    return e24.substring(t4, ~r3 && r3 < n3 ? e24.indexOf(`)`, n3 + 1) : n3);
  };
  var qt = function(e24) {
    var t4 = (e24 + ``).split(`(`), n3 = q[t4[0]];
    return n3 && t4.length > 1 && n3.config ? n3.config.apply(null, ~e24.indexOf(`{`) ? [Gt(t4[1])] : Kt(e24).split(`,`).map(we)) : q._CE && Ut.test(e24) ? q._CE(``, e24) : n3;
  };
  var Jt = function(e24) {
    return function(t4) {
      return 1 - e24(1 - t4);
    };
  };
  var Yt = function(e24, t4) {
    return e24 && (g(e24) ? e24 : q[e24] || qt(e24)) || t4;
  };
  var Xt = function(e24, t4, n3, r3) {
    n3 === void 0 && (n3 = function(e25) {
      return 1 - t4(1 - e25);
    }), r3 === void 0 && (r3 = function(e25) {
      return e25 < 0.5 ? t4(e25 * 2) / 2 : 1 - t4((1 - e25) * 2) / 2;
    });
    var i3 = { easeIn: t4, easeOut: n3, easeInOut: r3 }, a3;
    return H(e24, function(e25) {
      for (var t5 in q[e25] = R[e25] = i3, q[a3 = e25.toLowerCase()] = n3, i3) q[a3 + (t5 === `easeIn` ? `.in` : t5 === `easeOut` ? `.out` : `.inOut`)] = q[e25 + `.` + t5] = i3[t5];
    }), i3;
  };
  var Zt = function(e24) {
    return function(t4) {
      return t4 < 0.5 ? (1 - e24(1 - t4 * 2)) / 2 : 0.5 + e24((t4 - 0.5) * 2) / 2;
    };
  };
  var Qt = function e9(t4, n3, r3) {
    var i3 = n3 >= 1 ? n3 : 1, a3 = (r3 || (t4 ? 0.3 : 0.45)) / (n3 < 1 ? n3 : 1), o3 = a3 / l * (Math.asin(1 / i3) || 0), s3 = function(e24) {
      return e24 === 1 ? 1 : i3 * 2 ** (-10 * e24) * m((e24 - o3) * a3) + 1;
    }, c3 = t4 === `out` ? s3 : t4 === `in` ? function(e24) {
      return 1 - s3(1 - e24);
    } : Zt(s3);
    return a3 = l / a3, c3.config = function(n4, r4) {
      return e9(t4, n4, r4);
    }, c3;
  };
  var $t = function e10(t4, n3) {
    n3 === void 0 && (n3 = 1.70158);
    var r3 = function(e24) {
      return e24 ? --e24 * e24 * ((n3 + 1) * e24 + n3) + 1 : 0;
    }, i3 = t4 === `out` ? r3 : t4 === `in` ? function(e24) {
      return 1 - r3(1 - e24);
    } : Zt(r3);
    return i3.config = function(n4) {
      return e10(t4, n4);
    }, i3;
  };
  H(`Linear,Quad,Cubic,Quart,Quint,Strong`, function(e24, t4) {
    var n3 = t4 < 5 ? t4 + 1 : t4;
    Xt(e24 + `,Power` + (n3 - 1), t4 ? function(e25) {
      return e25 ** +n3;
    } : function(e25) {
      return e25;
    }, function(e25) {
      return 1 - (1 - e25) ** n3;
    }, function(e25) {
      return e25 < 0.5 ? (e25 * 2) ** n3 / 2 : 1 - ((1 - e25) * 2) ** n3 / 2;
    });
  }), q.Linear.easeNone = q.none = q.Linear.easeIn, Xt(`Elastic`, Qt(`in`), Qt(`out`), Qt()), (function(e24, t4) {
    var n3 = 1 / t4, r3 = 2 * n3, i3 = 2.5 * n3, a3 = function(a4) {
      return a4 < n3 ? e24 * a4 * a4 : a4 < r3 ? e24 * (a4 - 1.5 / t4) ** 2 + 0.75 : a4 < i3 ? e24 * (a4 -= 2.25 / t4) * a4 + 0.9375 : e24 * (a4 - 2.625 / t4) ** 2 + 0.984375;
    };
    Xt(`Bounce`, function(e25) {
      return 1 - a3(1 - e25);
    }, a3);
  })(7.5625, 2.75), Xt(`Expo`, function(e24) {
    return 2 ** (10 * (e24 - 1)) * e24 + e24 * e24 * e24 * e24 * e24 * e24 * (1 - e24);
  }), Xt(`Circ`, function(e24) {
    return -(f(1 - e24 * e24) - 1);
  }), Xt(`Sine`, function(e24) {
    return e24 === 1 ? 1 : -p(e24 * u) + 1;
  }), Xt(`Back`, $t(`in`), $t(`out`), $t()), q.SteppedEase = q.steps = R.SteppedEase = { config: function(e24, t4) {
    e24 === void 0 && (e24 = 1);
    var n3 = 1 / e24, r3 = e24 + +!t4, i3 = +!!t4, a3 = 1 - c;
    return function(e25) {
      return ((r3 * at(0, a3, e25) | 0) + i3) * n3;
    };
  } }, r.ease = q[`quad.out`], H(`onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`, function(e24) {
    return he += e24 + `,` + e24 + `Params,`;
  });
  var en = function(e24, t4) {
    this.id = d++, e24._gsap = this, this.target = e24, this.harness = t4, this.get = t4 ? t4.get : ve, this.set = t4 ? t4.getSetter : bn;
  };
  var tn = (function() {
    function e24(e25) {
      this.vars = e25, this._delay = +e25.delay || 0, (this._repeat = e25.repeat === 1 / 0 ? -2 : e25.repeat || 0) && (this._rDelay = e25.repeatDelay || 0, this._yoyo = !!e25.yoyo || !!e25.yoyoEase), this._ts = 1, $e(this, +e25.duration, 1, 1), this.data = e25.data, o && (this._ctx = o, o.data.push(this)), Bt || Vt.wake();
    }
    var t4 = e24.prototype;
    return t4.delay = function(e25) {
      return e25 || e25 === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e25 - this._delay), this._delay = e25, this) : this._delay;
    }, t4.duration = function(e25) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? e25 + (e25 + this._rDelay) * this._repeat : e25) : this.totalDuration() && this._dur;
    }, t4.totalDuration = function(e25) {
      return arguments.length ? (this._dirty = 0, $e(this, this._repeat < 0 ? e25 : (e25 - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, t4.totalTime = function(e25, t5) {
      if (Ht(), !arguments.length) return this._tTime;
      var n3 = this._dp;
      if (n3 && n3.smoothChildTiming && this._ts) {
        for (We(this, e25), !n3._dp || n3.parent || Ge(n3, this); n3 && n3.parent; ) n3.parent._time !== n3._start + (n3._ts >= 0 ? n3._tTime / n3._ts : (n3.totalDuration() - n3._tTime) / -n3._ts) && n3.totalTime(n3._tTime, true), n3 = n3.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e25 < this._tDur || this._ts < 0 && e25 > 0 || !this._tDur && !e25) && Ke(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== e25 || !this._dur && !t5 || this._initted && Math.abs(this._zTime) === c || !this._initted && this._dur && e25 || !e25 && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e25), Ce(this, e25, t5)), this;
    }, t4.time = function(e25, t5) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e25 + Be(this)) % (this._dur + this._rDelay) || (e25 ? this._dur : 0), t5) : this._time;
    }, t4.totalProgress = function(e25, t5) {
      return arguments.length ? this.totalTime(this.totalDuration() * e25, t5) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, t4.progress = function(e25, t5) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e25 : e25) + Be(this), t5) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
    }, t4.iteration = function(e25, t5) {
      var n3 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (e25 - 1) * n3, t5) : this._repeat ? Ve(this._tTime, n3) + 1 : 1;
    }, t4.timeScale = function(e25, t5) {
      if (!arguments.length) return this._rts === -c ? 0 : this._rts;
      if (this._rts === e25) return this;
      var n3 = this.parent && this._ts ? He(this.parent._time, this) : this._tTime;
      return this._rts = +e25 || 0, this._ts = this._ps || e25 === -c ? 0 : this._rts, this.totalTime(at(-Math.abs(this._delay), this.totalDuration(), n3), t5 !== false), Ue(this), Le(this);
    }, t4.paused = function(e25) {
      return arguments.length ? (this._ps !== e25 && (this._ps = e25, e25 ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Ht(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== c && (this._tTime -= c)))), this) : this._ps;
    }, t4.startTime = function(e25) {
      if (arguments.length) {
        this._start = W(e25);
        var t5 = this.parent || this._dp;
        return t5 && (t5._sort || !this.parent) && Ke(t5, this, this._start - this._delay), this;
      }
      return this._start;
    }, t4.endTime = function(e25) {
      return this._start + (b(e25) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, t4.rawTime = function(e25) {
      var t5 = this.parent || this._dp;
      return t5 ? e25 && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? He(t5.rawTime(e25), this) : this._tTime : this._tTime;
    }, t4.revert = function(e25) {
      e25 === void 0 && (e25 = se);
      var t5 = a;
      return a = e25, Se(this) && (this.timeline && this.timeline.revert(e25), this.totalTime(-0.01, e25.suppressEvents)), this.data !== `nested` && e25.kill !== false && this.kill(), a = t5, this;
    }, t4.globalTime = function(e25) {
      for (var t5 = this, n3 = arguments.length ? e25 : t5.rawTime(); t5; ) n3 = t5._start + n3 / (Math.abs(t5._ts) || 1), t5 = t5._dp;
      return !this.parent && this._sat ? this._sat.globalTime(e25) : n3;
    }, t4.repeat = function(e25) {
      return arguments.length ? (this._repeat = e25 === 1 / 0 ? -2 : e25, et(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, t4.repeatDelay = function(e25) {
      if (arguments.length) {
        var t5 = this._time;
        return this._rDelay = e25, et(this), t5 ? this.time(t5) : this;
      }
      return this._rDelay;
    }, t4.yoyo = function(e25) {
      return arguments.length ? (this._yoyo = e25, this) : this._yoyo;
    }, t4.seek = function(e25, t5) {
      return this.totalTime(nt(this, e25), b(t5));
    }, t4.restart = function(e25, t5) {
      return this.play().totalTime(e25 ? -this._delay : 0, b(t5)), this._dur || (this._zTime = -c), this;
    }, t4.play = function(e25, t5) {
      return e25 != null && this.seek(e25, t5), this.reversed(false).paused(false);
    }, t4.reverse = function(e25, t5) {
      return e25 != null && this.seek(e25 || this.totalDuration(), t5), this.reversed(true).paused(false);
    }, t4.pause = function(e25, t5) {
      return e25 != null && this.seek(e25, t5), this.paused(true);
    }, t4.resume = function() {
      return this.paused(false);
    }, t4.reversed = function(e25) {
      return arguments.length ? (!!e25 !== this.reversed() && this.timeScale(-this._rts || (e25 ? -c : 0)), this) : this._rts < 0;
    }, t4.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -c, this;
    }, t4.isActive = function() {
      var e25 = this.parent || this._dp, t5 = this._start, n3;
      return !!(!e25 || this._ts && this._initted && e25.isActive() && (n3 = e25.rawTime(true)) >= t5 && n3 < this.endTime(true) - c);
    }, t4.eventCallback = function(e25, t5, n3) {
      var r3 = this.vars;
      return arguments.length > 1 ? (t5 ? (r3[e25] = t5, n3 && (r3[e25 + `Params`] = n3), e25 === `onUpdate` && (this._onUpdate = t5)) : delete r3[e25], this) : r3[e25];
    }, t4.then = function(e25) {
      var t5 = this, n3 = t5._prom;
      return new Promise(function(r3) {
        var i3 = g(e25) ? e25 : Te, a3 = function() {
          var e26 = t5.then;
          t5.then = null, n3 && n3(), g(i3) && (i3 = i3(t5)) && (i3.then || i3 === t5) && (t5.then = e26), r3(i3), t5.then = e26;
        };
        t5._initted && t5.totalProgress() === 1 && t5._ts >= 0 || !t5._tTime && t5._ts < 0 ? a3() : t5._prom = a3;
      });
    }, t4.kill = function() {
      Ot(this);
    }, e24;
  })();
  Ee(tn.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -c, _prom: 0, _ps: false, _rts: 1 });
  var J = (function(r3) {
    t(i3, r3);
    function i3(t4, n3) {
      var i4;
      return t4 === void 0 && (t4 = {}), i4 = r3.call(this, t4) || this, i4.labels = {}, i4.smoothChildTiming = !!t4.smoothChildTiming, i4.autoRemoveChildren = !!t4.autoRemoveChildren, i4._sort = b(t4.sortChildren), P && Ke(t4.parent || P, e(i4), n3), t4.reversed && i4.reverse(), t4.paused && i4.paused(true), t4.scrollTrigger && qe(e(i4), t4.scrollTrigger), i4;
    }
    var o3 = i3.prototype;
    return o3.to = function(e24, t4, n3) {
      return rt(0, arguments, this), this;
    }, o3.from = function(e24, t4, n3) {
      return rt(1, arguments, this), this;
    }, o3.fromTo = function(e24, t4, n3, r4) {
      return rt(2, arguments, this), this;
    }, o3.set = function(e24, t4, n3) {
      return t4.duration = 0, t4.parent = this, je(t4).repeatDelay || (t4.repeat = 0), t4.immediateRender = !!t4.immediateRender, new Y(e24, t4, nt(this, n3), 1), this;
    }, o3.call = function(e24, t4, n3) {
      return Ke(this, Y.delayedCall(0, e24, t4), n3);
    }, o3.staggerTo = function(e24, t4, n3, r4, i4, a3, o4) {
      return n3.duration = t4, n3.stagger = n3.stagger || r4, n3.onComplete = a3, n3.onCompleteParams = o4, n3.parent = this, new Y(e24, n3, nt(this, i4)), this;
    }, o3.staggerFrom = function(e24, t4, n3, r4, i4, a3, o4) {
      return n3.runBackwards = 1, je(n3).immediateRender = b(n3.immediateRender), this.staggerTo(e24, t4, n3, r4, i4, a3, o4);
    }, o3.staggerFromTo = function(e24, t4, n3, r4, i4, a3, o4, s3) {
      return r4.startAt = n3, je(r4).immediateRender = b(r4.immediateRender), this.staggerTo(e24, t4, r4, i4, a3, o4, s3);
    }, o3.render = function(e24, t4, n3) {
      var r4 = this._time, i4 = this._dirty ? this.totalDuration() : this._tDur, o4 = this._dur, s3 = e24 <= 0 ? 0 : W(e24), l3 = this._zTime < 0 != e24 < 0 && (this._initted || !o4), u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
      if (this !== P && s3 > i4 && e24 >= 0 && (s3 = i4), s3 !== this._tTime || n3 || l3) {
        if (r4 !== this._time && o4 && (s3 += this._time - r4, e24 += this._time - r4), u3 = s3, v3 = this._start, _3 = this._ts, h3 = !_3, l3 && (o4 || (r4 = this._zTime), (e24 || !t4) && (this._zTime = e24)), this._repeat) {
          if (b3 = this._yoyo, m3 = o4 + this._rDelay, this._repeat < -1 && e24 < 0) return this.totalTime(m3 * 100 + e24, t4, n3);
          if (u3 = W(s3 % m3), s3 === i4 ? (p3 = this._repeat, u3 = o4) : (y3 = W(s3 / m3), p3 = ~~y3, p3 && p3 === y3 && (u3 = o4, p3--), u3 > o4 && (u3 = o4)), y3 = Ve(this._tTime, m3), !r4 && this._tTime && y3 !== p3 && this._tTime - y3 * m3 - this._dur <= 0 && (y3 = p3), b3 && p3 & 1 && (u3 = o4 - u3, x3 = 1), p3 !== y3 && !this._lock) {
            var S3 = b3 && y3 & 1, C3 = S3 === (b3 && p3 & 1);
            if (p3 < y3 && (S3 = !S3), r4 = S3 ? 0 : s3 % o4 ? o4 : s3, this._lock = 1, this.render(r4 || (x3 ? 0 : W(p3 * m3)), t4, !o4)._lock = 0, this._tTime = s3, !t4 && this.parent && Dt(this, `onRepeat`), this.vars.repeatRefresh && !x3 && (this.invalidate()._lock = 1, y3 = p3), r4 && r4 !== this._time || h3 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (o4 = this._dur, i4 = this._tDur, C3 && (this._lock = 2, r4 = S3 ? o4 : -1e-4, this.render(r4, true), this.vars.repeatRefresh && !x3 && this.invalidate()), this._lock = 0, !this._ts && !h3)) return this;
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g3 = Qe(this, W(r4), W(u3)), g3 && (s3 -= u3 - (u3 = g3._start))), this._tTime = s3, this._time = u3, this._act = !!_3, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e24, r4 = 0), !r4 && s3 && o4 && !t4 && !y3 && (Dt(this, `onStart`), this._tTime !== s3)) return this;
        if (u3 >= r4 && e24 >= 0) for (d3 = this._first; d3; ) {
          if (f3 = d3._next, (d3._act || u3 >= d3._start) && d3._ts && g3 !== d3) {
            if (d3.parent !== this) return this.render(e24, t4, n3);
            if (d3.render(d3._ts > 0 ? (u3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (u3 - d3._start) * d3._ts, t4, n3), u3 !== this._time || !this._ts && !h3) {
              g3 = 0, f3 && (s3 += this._zTime = -c);
              break;
            }
          }
          d3 = f3;
        }
        else {
          d3 = this._last;
          for (var w3 = e24 < 0 ? e24 : u3; d3; ) {
            if (f3 = d3._prev, (d3._act || w3 <= d3._end) && d3._ts && g3 !== d3) {
              if (d3.parent !== this) return this.render(e24, t4, n3);
              if (d3.render(d3._ts > 0 ? (w3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (w3 - d3._start) * d3._ts, t4, n3 || a && Se(d3)), u3 !== this._time || !this._ts && !h3) {
                g3 = 0, f3 && (s3 += this._zTime = w3 ? -c : c);
                break;
              }
            }
            d3 = f3;
          }
        }
        if (g3 && !t4 && (this.pause(), g3.render(u3 >= r4 ? 0 : -c)._zTime = u3 >= r4 ? 1 : -1, this._ts)) return this._start = v3, Ue(this), this.render(e24, t4, n3);
        this._onUpdate && !t4 && Dt(this, `onUpdate`, true), (s3 === i4 && this._tTime >= this.totalDuration() || !s3 && r4) && (v3 === this._start || Math.abs(_3) !== Math.abs(this._ts)) && (this._lock || ((e24 || !o4) && (s3 === i4 && this._ts > 0 || !s3 && this._ts < 0) && Fe(this, 1), !t4 && !(e24 < 0 && !r4) && (s3 || r4 || !i4) && (Dt(this, s3 === i4 && e24 >= 0 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s3 < i4 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, o3.add = function(e24, t4) {
      var n3 = this;
      if (_(t4) || (t4 = nt(this, t4, e24)), !(e24 instanceof tn)) {
        if (w(e24)) return e24.forEach(function(e25) {
          return n3.add(e25, t4);
        }), this;
        if (h(e24)) return this.addLabel(e24, t4);
        if (g(e24)) e24 = Y.delayedCall(0, e24);
        else return this;
      }
      return this === e24 ? this : Ke(this, e24, t4);
    }, o3.getChildren = function(e24, t4, n3, r4) {
      e24 === void 0 && (e24 = true), t4 === void 0 && (t4 = true), n3 === void 0 && (n3 = true), r4 === void 0 && (r4 = -s);
      for (var i4 = [], a3 = this._first; a3; ) a3._start >= r4 && (a3 instanceof Y ? t4 && i4.push(a3) : (n3 && i4.push(a3), e24 && i4.push.apply(i4, a3.getChildren(true, t4, n3)))), a3 = a3._next;
      return i4;
    }, o3.getById = function(e24) {
      for (var t4 = this.getChildren(1, 1, 1), n3 = t4.length; n3--; ) if (t4[n3].vars.id === e24) return t4[n3];
    }, o3.remove = function(e24) {
      return h(e24) ? this.removeLabel(e24) : g(e24) ? this.killTweensOf(e24) : (e24.parent === this && Pe(this, e24), e24 === this._recent && (this._recent = this._last), Ie(this));
    }, o3.totalTime = function(e24, t4) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = W(Vt.time - (this._ts > 0 ? e24 / this._ts : (this.totalDuration() - e24) / -this._ts))), r3.prototype.totalTime.call(this, e24, t4), this._forcing = 0, this) : this._tTime;
    }, o3.addLabel = function(e24, t4) {
      return this.labels[e24] = nt(this, t4), this;
    }, o3.removeLabel = function(e24) {
      return delete this.labels[e24], this;
    }, o3.addPause = function(e24, t4, n3) {
      var r4 = Y.delayedCall(0, t4 || ie, n3);
      return r4.data = `isPause`, this._hasPause = 1, Ke(this, r4, nt(this, e24));
    }, o3.removePause = function(e24) {
      var t4 = this._first;
      for (e24 = nt(this, e24); t4; ) t4._start === e24 && t4.data === `isPause` && Fe(t4), t4 = t4._next;
    }, o3.killTweensOf = function(e24, t4, n3) {
      for (var r4 = this.getTweensOf(e24, n3), i4 = r4.length; i4--; ) sn !== r4[i4] && r4[i4].kill(e24, t4);
      return this;
    }, o3.getTweensOf = function(e24, t4) {
      for (var n3 = [], r4 = ut(e24), i4 = this._first, a3 = _(t4), o4; i4; ) i4 instanceof Y ? be(i4._targets, r4) && (a3 ? (!sn || i4._initted && i4._ts) && i4.globalTime(0) <= t4 && i4.globalTime(i4.totalDuration()) > t4 : !t4 || i4.isActive()) && n3.push(i4) : (o4 = i4.getTweensOf(r4, t4)).length && n3.push.apply(n3, o4), i4 = i4._next;
      return n3;
    }, o3.tweenTo = function(e24, t4) {
      t4 || (t4 = {});
      var n3 = this, r4 = nt(n3, e24), i4 = t4, a3 = i4.startAt, o4 = i4.onStart, s3 = i4.onStartParams, l3 = i4.immediateRender, u3, d3 = Y.to(n3, Ee({ ease: t4.ease || `none`, lazy: false, immediateRender: false, time: r4, overwrite: `auto`, duration: t4.duration || Math.abs((r4 - (a3 && `time` in a3 ? a3.time : n3._time)) / n3.timeScale()) || c, onStart: function() {
        if (n3.pause(), !u3) {
          var e25 = t4.duration || Math.abs((r4 - (a3 && `time` in a3 ? a3.time : n3._time)) / n3.timeScale());
          d3._dur !== e25 && $e(d3, e25, 0, 1).render(d3._time, true, true), u3 = 1;
        }
        o4 && o4.apply(d3, s3 || []);
      } }, t4));
      return l3 ? d3.render(0) : d3;
    }, o3.tweenFromTo = function(e24, t4, n3) {
      return this.tweenTo(t4, Ee({ startAt: { time: nt(this, e24) } }, n3));
    }, o3.recent = function() {
      return this._recent;
    }, o3.nextLabel = function(e24) {
      return e24 === void 0 && (e24 = this._time), Et(this, nt(this, e24));
    }, o3.previousLabel = function(e24) {
      return e24 === void 0 && (e24 = this._time), Et(this, nt(this, e24), 1);
    }, o3.currentLabel = function(e24) {
      return arguments.length ? this.seek(e24, true) : this.previousLabel(this._time + c);
    }, o3.shiftChildren = function(e24, t4, n3) {
      n3 === void 0 && (n3 = 0);
      var r4 = this._first, i4 = this.labels, a3;
      for (e24 = W(e24); r4; ) r4._start >= n3 && (r4._start += e24, r4._end += e24), r4 = r4._next;
      if (t4) for (a3 in i4) i4[a3] >= n3 && (i4[a3] += e24);
      return Ie(this);
    }, o3.invalidate = function(e24) {
      var t4 = this._first;
      for (this._lock = 0; t4; ) t4.invalidate(e24), t4 = t4._next;
      return r3.prototype.invalidate.call(this, e24);
    }, o3.clear = function(e24) {
      e24 === void 0 && (e24 = true);
      for (var t4 = this._first, n3; t4; ) n3 = t4._next, this.remove(t4), t4 = n3;
      return this._dp && (this._time = this._tTime = this._pTime = 0), e24 && (this.labels = {}), Ie(this);
    }, o3.totalDuration = function(e24) {
      var t4 = 0, n3 = this, r4 = n3._last, i4 = s, a3, o4, c3;
      if (arguments.length) return n3.timeScale((n3._repeat < 0 ? n3.duration() : n3.totalDuration()) / (n3.reversed() ? -e24 : e24));
      if (n3._dirty) {
        for (c3 = n3.parent; r4; ) a3 = r4._prev, r4._dirty && r4.totalDuration(), o4 = r4._start, o4 > i4 && n3._sort && r4._ts && !n3._lock ? (n3._lock = 1, Ke(n3, r4, o4 - r4._delay, 1)._lock = 0) : i4 = o4, o4 < 0 && r4._ts && (t4 -= o4, (!c3 && !n3._dp || c3 && c3.smoothChildTiming) && (n3._start += W(o4 / n3._ts), n3._time -= o4, n3._tTime -= o4), n3.shiftChildren(-o4, false, -1 / 0), i4 = 0), r4._end > t4 && r4._ts && (t4 = r4._end), r4 = a3;
        $e(n3, n3 === P && n3._time > t4 ? n3._time : t4, 1, 1), n3._dirty = 0;
      }
      return n3._tDur;
    }, i3.updateRoot = function(e24) {
      if (P._ts && (Ce(P, He(e24, P)), de = Vt.frame), Vt.frame >= pe) {
        pe += n.autoSleep || 120;
        var t4 = P._first;
        if ((!t4 || !t4._ts) && n.autoSleep && Vt._listeners.length < 2) {
          for (; t4 && !t4._ts; ) t4 = t4._next;
          t4 || Vt.sleep();
        }
      }
    }, i3;
  })(tn);
  Ee(J.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
  var nn = function(e24, t4, n3, r3, i3, a3, o3) {
    var s3 = new X(this._pt, e24, t4, 0, 1, Cn, null, i3), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3;
    for (s3.b = n3, s3.e = r3, n3 += ``, r3 += ``, (g3 = ~r3.indexOf(`random(`)) && (r3 = Ct(r3)), a3 && (_3 = [n3, r3], a3(_3, e24, t4), n3 = _3[0], r3 = _3[1]), d3 = n3.match(A) || []; u3 = A.exec(r3); ) p3 = u3[0], m3 = r3.substring(c3, u3.index), f3 ? f3 = (f3 + 1) % 5 : m3.substr(-5) === `rgba(` && (f3 = 1), p3 !== d3[l3++] && (h3 = parseFloat(d3[l3 - 1]) || 0, s3._pt = { _next: s3._pt, p: m3 || l3 === 1 ? m3 : `,`, s: h3, c: p3.charAt(1) === `=` ? ye(h3, p3) - h3 : parseFloat(p3) - h3, m: f3 && f3 < 4 ? Math.round : 0 }, c3 = A.lastIndex);
    return s3.c = c3 < r3.length ? r3.substring(c3, r3.length) : ``, s3.fp = o3, (j.test(r3) || g3) && (s3.e = 0), this._pt = s3, s3;
  };
  var rn = function(e24, t4, r3, i3, a3, o3, s3, c3, l3, u3) {
    g(i3) && (i3 = i3(a3 || 0, e24, o3));
    var d3 = e24[t4], f3 = r3 === `get` ? g(d3) ? l3 ? e24[t4.indexOf(`set`) || !g(e24[`get` + t4.substr(3)]) ? t4 : `get` + t4.substr(3)](l3) : e24[t4]() : d3 : r3, p3 = g(d3) ? l3 ? vn : _n : gn, m3;
    if (h(i3) && (~i3.indexOf(`random(`) && (i3 = Ct(i3)), i3.charAt(1) === `=` && (m3 = ye(f3, i3) + (G(f3) || 0), (m3 || m3 === 0) && (i3 = m3))), !u3 || f3 !== i3 || cn) return !isNaN(f3 * i3) && i3 !== `` ? (m3 = new X(this._pt, e24, t4, +f3 || 0, i3 - (f3 || 0), typeof d3 == `boolean` ? Sn : xn, 0, p3), l3 && (m3.fp = l3), s3 && m3.modifier(s3, this, e24), this._pt = m3) : (!d3 && !(t4 in e24) && te(t4, i3), nn.call(this, e24, t4, f3, i3, p3, c3 || n.stringFilter, l3));
  };
  var an = function(e24, t4, n3, r3, i3) {
    if (g(e24) && (e24 = pn(e24, i3, t4, n3, r3)), !y(e24) || e24.style && e24.nodeType || w(e24) || C(e24)) return h(e24) ? pn(e24, i3, t4, n3, r3) : e24;
    var a3 = {}, o3;
    for (o3 in e24) a3[o3] = pn(e24[o3], i3, t4, n3, r3);
    return a3;
  };
  var on = function(e24, t4, n3, r3, i3, a3) {
    var o3, s3, c3, l3;
    if (V[e24] && (o3 = new V[e24]()).init(i3, o3.rawVars ? t4[e24] : an(t4[e24], r3, i3, a3, n3), n3, r3, a3) !== false && (n3._pt = s3 = new X(n3._pt, i3, e24, 0, 1, o3.render, o3, 0, o3.priority), n3 !== kt)) for (c3 = n3._ptLookup[n3._targets.indexOf(i3)], l3 = o3._props.length; l3--; ) c3[o3._props[l3]] = s3;
    return o3;
  };
  var sn;
  var cn;
  var ln = function e11(t4, n3, o3) {
    var l3 = t4.vars, u3 = l3.ease, d3 = l3.startAt, f3 = l3.immediateRender, p3 = l3.lazy, m3 = l3.onUpdate, h3 = l3.runBackwards, g3 = l3.yoyoEase, _3 = l3.keyframes, v3 = l3.autoRevert, y3 = t4._dur, x3 = t4._startAt, S3 = t4._targets, C3 = t4.parent, w3 = C3 && C3.data === `nested` ? C3.vars.targets : S3, T3 = t4._overwrite === `auto` && !i, E3 = t4.timeline, D3 = l3.easeReverse || g3, O3, k3, A3, j3, M3, N3, F3, I3, L3, R3, z3, B3, ee3;
    if (E3 && (!_3 || !u3) && (u3 = `none`), t4._ease = Yt(u3, r.ease), t4._rEase = D3 && (Yt(D3) || t4._ease), t4._from = !E3 && !!l3.runBackwards, t4._from && (t4.ratio = 1), !E3 || _3 && !l3.stagger) {
      if (I3 = S3[0] ? _e(S3[0]).harness : 0, B3 = I3 && l3[I3.prop], O3 = Ae(l3, ce), x3 && (x3._zTime < 0 && x3.progress(1), n3 < 0 && h3 && f3 && !v3 ? x3.render(-1, true) : x3.revert(h3 && y3 ? oe : ae), x3._lazy = 0), d3) {
        if (Fe(t4._startAt = Y.set(S3, Ee({ data: `isStart`, overwrite: false, parent: C3, immediateRender: true, lazy: !x3 && b(p3), startAt: null, delay: 0, onUpdate: m3 && function() {
          return Dt(t4, `onUpdate`);
        }, stagger: 0 }, d3))), t4._startAt._dp = 0, t4._startAt._sat = t4, n3 < 0 && (a || !f3 && !v3) && t4._startAt.revert(oe), f3 && y3 && n3 <= 0 && o3 <= 0) {
          n3 && (t4._zTime = n3);
          return;
        }
      } else if (h3 && y3 && !x3) {
        if (n3 && (f3 = false), A3 = Ee({ overwrite: false, data: `isFromStart`, lazy: f3 && !x3 && b(p3), immediateRender: f3, stagger: 0, parent: C3 }, O3), B3 && (A3[I3.prop] = B3), Fe(t4._startAt = Y.set(S3, A3)), t4._startAt._dp = 0, t4._startAt._sat = t4, n3 < 0 && (a ? t4._startAt.revert(oe) : t4._startAt.render(-1, true)), t4._zTime = n3, !f3) e11(t4._startAt, c, c);
        else if (!n3) return;
      }
      for (t4._pt = t4._ptCache = 0, p3 = y3 && b(p3) || p3 && !y3, k3 = 0; k3 < S3.length; k3++) {
        if (M3 = S3[k3], F3 = M3._gsap || ge(S3)[k3]._gsap, t4._ptLookup[k3] = R3 = {}, ue[F3.id] && le.length && xe(), z3 = w3 === S3 ? k3 : w3.indexOf(M3), I3 && (L3 = new I3()).init(M3, B3 || O3, t4, z3, w3) !== false && (t4._pt = j3 = new X(t4._pt, M3, L3.name, 0, 1, L3.render, L3, 0, L3.priority), L3._props.forEach(function(e24) {
          R3[e24] = j3;
        }), L3.priority && (N3 = 1)), !I3 || B3) for (A3 in O3) V[A3] && (L3 = on(A3, O3, t4, z3, M3, w3)) ? L3.priority && (N3 = 1) : R3[A3] = j3 = rn.call(t4, M3, A3, `get`, O3[A3], z3, w3, 0, l3.stringFilter);
        t4._op && t4._op[k3] && t4.kill(M3, t4._op[k3]), T3 && t4._pt && (sn = t4, P.killTweensOf(M3, R3, t4.globalTime(n3)), ee3 = !t4.parent, sn = 0), t4._pt && p3 && (ue[F3.id] = 1);
      }
      N3 && On(t4), t4._onInit && t4._onInit(t4);
    }
    t4._onUpdate = m3, t4._initted = (!t4._op || t4._pt) && !ee3, _3 && n3 <= 0 && E3.render(s, true, true);
  };
  var un = function(e24, t4, n3, r3, i3, a3, o3, s3) {
    var c3 = (e24._pt && e24._ptCache || (e24._ptCache = {}))[t4], l3, u3, d3, f3;
    if (!c3) for (c3 = e24._ptCache[t4] = [], d3 = e24._ptLookup, f3 = e24._targets.length; f3--; ) {
      if (l3 = d3[f3][t4], l3 && l3.d && l3.d._pt) for (l3 = l3.d._pt; l3 && l3.p !== t4 && l3.fp !== t4; ) l3 = l3._next;
      if (!l3) return cn = 1, e24.vars[t4] = `+=0`, ln(e24, o3), cn = 0, s3 ? ne(t4 + ` not eligible for reset. Try splitting into individual properties`) : 1;
      c3.push(l3);
    }
    for (f3 = c3.length; f3--; ) u3 = c3[f3], l3 = u3._pt || u3, l3.s = (r3 || r3 === 0) && !i3 ? r3 : l3.s + (r3 || 0) + a3 * l3.c, l3.c = n3 - l3.s, u3.e && (u3.e = U(n3) + G(u3.e)), u3.b && (u3.b = l3.s + G(u3.b));
  };
  var dn = function(e24, t4) {
    var n3 = e24[0] ? _e(e24[0]).harness : 0, r3 = n3 && n3.aliases, i3, a3, o3, s3;
    if (!r3) return t4;
    for (a3 in i3 = Oe({}, t4), r3) if (a3 in i3) for (s3 = r3[a3].split(`,`), o3 = s3.length; o3--; ) i3[s3[o3]] = i3[a3];
    return i3;
  };
  var fn = function(e24, t4, n3, r3) {
    var i3 = t4.ease || r3 || `power1.inOut`, a3, o3;
    if (w(t4)) o3 = n3[e24] || (n3[e24] = []), t4.forEach(function(e25, n4) {
      return o3.push({ t: n4 / (t4.length - 1) * 100, v: e25, e: i3 });
    });
    else for (a3 in t4) o3 = n3[a3] || (n3[a3] = []), a3 === `ease` || o3.push({ t: parseFloat(e24), v: t4[a3], e: i3 });
  };
  var pn = function(e24, t4, n3, r3, i3) {
    return g(e24) ? e24.call(t4, n3, r3, i3) : h(e24) && ~e24.indexOf(`random(`) ? Ct(e24) : e24;
  };
  var mn = he + `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`;
  var hn = {};
  H(mn + `,id,stagger,delay,duration,paused,scrollTrigger`, function(e24) {
    return hn[e24] = 1;
  });
  var Y = (function(r3) {
    t(o3, r3);
    function o3(t4, a3, o4, s4) {
      var l3;
      typeof a3 == `number` && (o4.duration = a3, a3 = o4, o4 = null), l3 = r3.call(this, s4 ? a3 : je(a3)) || this;
      var u3 = l3.vars, d3 = u3.duration, f3 = u3.delay, p3 = u3.immediateRender, m3 = u3.stagger, h3 = u3.overwrite, g3 = u3.keyframes, v3 = u3.defaults, x3 = u3.scrollTrigger, T3 = a3.parent || P, E3 = (w(t4) || C(t4) ? _(t4[0]) : `length` in a3) ? [t4] : ut(t4), D3, O3, k3, A3, j3, M3, N3, F3;
      if (l3._targets = E3.length ? ge(E3) : ne(`GSAP target ` + t4 + ` not found. https://gsap.com`, !n.nullTargetWarn) || [], l3._ptLookup = [], l3._overwrite = h3, g3 || m3 || S(d3) || S(f3)) {
        a3 = l3.vars;
        var I3 = a3.easeReverse || a3.yoyoEase;
        if (D3 = l3.timeline = new J({ data: `nested`, defaults: v3 || {}, targets: T3 && T3.data === `nested` ? T3.vars.targets : E3 }), D3.kill(), D3.parent = D3._dp = e(l3), D3._start = 0, m3 || S(d3) || S(f3)) {
          if (A3 = E3.length, N3 = m3 && pt(m3), y(m3)) for (j3 in m3) ~mn.indexOf(j3) && (F3 || (F3 = {}), F3[j3] = m3[j3]);
          for (O3 = 0; O3 < A3; O3++) k3 = Ae(a3, hn), k3.stagger = 0, I3 && (k3.easeReverse = I3), F3 && Oe(k3, F3), M3 = E3[O3], k3.duration = +pn(d3, e(l3), O3, M3, E3), k3.delay = (+pn(f3, e(l3), O3, M3, E3) || 0) - l3._delay, !m3 && A3 === 1 && k3.delay && (l3._delay = f3 = k3.delay, l3._start += f3, k3.delay = 0), D3.to(M3, k3, N3 ? N3(O3, M3, E3) : 0), D3._ease = q.none;
          D3.duration() ? d3 = f3 = 0 : l3.timeline = 0;
        } else if (g3) {
          je(Ee(D3.vars.defaults, { ease: `none` })), D3._ease = Yt(g3.ease || a3.ease || `none`);
          var L3 = 0, R3, z3, B3;
          if (w(g3)) g3.forEach(function(e24) {
            return D3.to(E3, e24, `>`);
          }), D3.duration();
          else {
            for (j3 in k3 = {}, g3) j3 === `ease` || j3 === `easeEach` || fn(j3, g3[j3], k3, g3.easeEach);
            for (j3 in k3) for (R3 = k3[j3].sort(function(e24, t5) {
              return e24.t - t5.t;
            }), L3 = 0, O3 = 0; O3 < R3.length; O3++) z3 = R3[O3], B3 = { ease: z3.e, duration: (z3.t - (O3 ? R3[O3 - 1].t : 0)) / 100 * d3 }, B3[j3] = z3.v, D3.to(E3, B3, L3), L3 += B3.duration;
            D3.duration() < d3 && D3.to({}, { duration: d3 - D3.duration() });
          }
        }
        d3 || l3.duration(d3 = D3.duration());
      } else l3.timeline = 0;
      return h3 === true && !i && (sn = e(l3), P.killTweensOf(E3), sn = 0), Ke(T3, e(l3), o4), a3.reversed && l3.reverse(), a3.paused && l3.paused(true), (p3 || !d3 && !g3 && l3._start === W(T3._time) && b(p3) && ze(e(l3)) && T3.data !== `nested`) && (l3._tTime = -c, l3.render(Math.max(0, -f3) || 0)), x3 && qe(e(l3), x3), l3;
    }
    var s3 = o3.prototype;
    return s3.render = function(e24, t4, n3) {
      var r4 = this._time, i3 = this._tDur, a3 = this._dur, o4 = e24 < 0, s4 = e24 > i3 - c && !o4 ? i3 : e24 < c ? 0 : e24, l3, u3, d3, f3, p3, m3, h3, g3;
      if (!a3) Ze(this, e24, t4, n3);
      else if (s4 !== this._tTime || !e24 || n3 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o4 || this._lazy) {
        if (l3 = s4, g3 = this.timeline, this._repeat) {
          if (f3 = a3 + this._rDelay, this._repeat < -1 && o4) return this.totalTime(f3 * 100 + e24, t4, n3);
          if (l3 = W(s4 % f3), s4 === i3 ? (d3 = this._repeat, l3 = a3) : (p3 = W(s4 / f3), d3 = ~~p3, d3 && d3 === p3 ? (l3 = a3, d3--) : l3 > a3 && (l3 = a3)), m3 = this._yoyo && d3 & 1, m3 && (l3 = a3 - l3), p3 = Ve(this._tTime, f3), l3 === r4 && !n3 && this._initted && d3 === p3) return this._tTime = s4, this;
          d3 !== p3 && this.vars.repeatRefresh && !m3 && !this._lock && l3 !== f3 && this._initted && (this._lock = n3 = 1, this.render(W(f3 * d3), true).invalidate()._lock = 0);
        }
        if (!this._initted) {
          if (Je(this, o4 ? e24 : l3, n3, t4, s4)) return this._tTime = 0, this;
          if (r4 !== this._time && !(n3 && this.vars.repeatRefresh && d3 !== p3)) return this;
          if (a3 !== this._dur) return this.render(e24, t4, n3);
        }
        if (this._rEase) {
          var _3 = l3 < r4;
          if (_3 !== this._inv) {
            var v3 = _3 ? r4 : a3 - r4;
            this._inv = _3, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = r4, this._invRecip = v3 ? (_3 ? -1 : 1) / v3 : 0, this._invScale = _3 ? -this.ratio : 1 - this.ratio, this._invEase = _3 ? this._rEase : this._ease;
          }
          this.ratio = h3 = this._invRatio + this._invScale * this._invEase((l3 - this._invTime) * this._invRecip);
        } else this.ratio = h3 = this._ease(l3 / a3);
        if (this._from && (this.ratio = h3 = 1 - h3), this._tTime = s4, this._time = l3, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r4 && s4 && !t4 && !p3 && (Dt(this, `onStart`), this._tTime !== s4)) return this;
        for (u3 = this._pt; u3; ) u3.r(h3, u3.d), u3 = u3._next;
        g3 && g3.render(e24 < 0 ? e24 : g3._dur * g3._ease(l3 / this._dur), t4, n3) || this._startAt && (this._zTime = e24), this._onUpdate && !t4 && (o4 && Re(this, e24, t4, n3), Dt(this, `onUpdate`)), this._repeat && d3 !== p3 && this.vars.onRepeat && !t4 && this.parent && Dt(this, `onRepeat`), (s4 === this._tDur || !s4) && this._tTime === s4 && (o4 && !this._onUpdate && Re(this, e24, true, true), (e24 || !a3) && (s4 === this._tDur && this._ts > 0 || !s4 && this._ts < 0) && Fe(this, 1), !t4 && !(o4 && !r4) && (s4 || r4 || m3) && (Dt(this, s4 === i3 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s4 < i3 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, s3.targets = function() {
      return this._targets;
    }, s3.invalidate = function(e24) {
      return (!e24 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e24), r3.prototype.invalidate.call(this, e24);
    }, s3.resetTo = function(e24, t4, n3, r4, i3) {
      Bt || Vt.wake(), this._ts || this.play();
      var a3 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o4;
      return this._initted || ln(this, a3), o4 = this._ease(a3 / this._dur), un(this, e24, t4, n3, r4, o4, a3, i3) ? this.resetTo(e24, t4, n3, r4, 1) : (We(this, 0), this.parent || Ne(this._dp, this, `_first`, `_last`, this._dp._sort ? `_start` : 0), this.render(0));
    }, s3.kill = function(e24, t4) {
      if (t4 === void 0 && (t4 = `all`), !e24 && (!t4 || t4 === `all`)) return this._lazy = this._pt = 0, this.parent ? Ot(this) : this.scrollTrigger && this.scrollTrigger.kill(!!a), this;
      if (this.timeline) {
        var n3 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(e24, t4, sn && sn.vars.overwrite !== true)._first || Ot(this), this.parent && n3 !== this.timeline.totalDuration() && $e(this, this._dur * this.timeline._tDur / n3, 0, 1), this;
      }
      var r4 = this._targets, i3 = e24 ? ut(e24) : r4, o4 = this._ptLookup, s4 = this._pt, c3, l3, u3, d3, f3, p3, m3;
      if ((!t4 || t4 === `all`) && Me(r4, i3)) return t4 === `all` && (this._pt = 0), Ot(this);
      for (c3 = this._op = this._op || [], t4 !== `all` && (h(t4) && (f3 = {}, H(t4, function(e25) {
        return f3[e25] = 1;
      }), t4 = f3), t4 = dn(r4, t4)), m3 = r4.length; m3--; ) if (~i3.indexOf(r4[m3])) for (f3 in l3 = o4[m3], t4 === `all` ? (c3[m3] = t4, d3 = l3, u3 = {}) : (u3 = c3[m3] = c3[m3] || {}, d3 = t4), d3) p3 = l3 && l3[f3], p3 && ((!(`kill` in p3.d) || p3.d.kill(f3) === true) && Pe(this, p3, `_pt`), delete l3[f3]), u3 !== `all` && (u3[f3] = 1);
      return this._initted && !this._pt && s4 && Ot(this), this;
    }, o3.to = function(e24, t4) {
      return new o3(e24, t4, arguments[2]);
    }, o3.from = function(e24, t4) {
      return rt(1, arguments);
    }, o3.delayedCall = function(e24, t4, n3, r4) {
      return new o3(t4, 0, { immediateRender: false, lazy: false, overwrite: false, delay: e24, onComplete: t4, onReverseComplete: t4, onCompleteParams: n3, onReverseCompleteParams: n3, callbackScope: r4 });
    }, o3.fromTo = function(e24, t4, n3) {
      return rt(2, arguments);
    }, o3.set = function(e24, t4) {
      return t4.duration = 0, t4.repeatDelay || (t4.repeat = 0), new o3(e24, t4);
    }, o3.killTweensOf = function(e24, t4, n3) {
      return P.killTweensOf(e24, t4, n3);
    }, o3;
  })(tn);
  Ee(Y.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }), H(`staggerTo,staggerFrom,staggerFromTo`, function(e24) {
    Y[e24] = function() {
      var t4 = new J(), n3 = st.call(arguments, 0);
      return n3.splice(e24 === `staggerFromTo` ? 5 : 4, 0, 0), t4[e24].apply(t4, n3);
    };
  });
  var gn = function(e24, t4, n3) {
    return e24[t4] = n3;
  };
  var _n = function(e24, t4, n3) {
    return e24[t4](n3);
  };
  var vn = function(e24, t4, n3, r3) {
    return e24[t4](r3.fp, n3);
  };
  var yn = function(e24, t4, n3) {
    return e24.setAttribute(t4, n3);
  };
  var bn = function(e24, t4) {
    return g(e24[t4]) ? _n : v(e24[t4]) && e24.setAttribute ? yn : gn;
  };
  var xn = function(e24, t4) {
    return t4.set(t4.t, t4.p, Math.round((t4.s + t4.c * e24) * 1e6) / 1e6, t4);
  };
  var Sn = function(e24, t4) {
    return t4.set(t4.t, t4.p, !!(t4.s + t4.c * e24), t4);
  };
  var Cn = function(e24, t4) {
    var n3 = t4._pt, r3 = ``;
    if (!e24 && t4.b) r3 = t4.b;
    else if (e24 === 1 && t4.e) r3 = t4.e;
    else {
      for (; n3; ) r3 = n3.p + (n3.m ? n3.m(n3.s + n3.c * e24) : Math.round((n3.s + n3.c * e24) * 1e4) / 1e4) + r3, n3 = n3._next;
      r3 += t4.c;
    }
    t4.set(t4.t, t4.p, r3, t4);
  };
  var wn = function(e24, t4) {
    for (var n3 = t4._pt; n3; ) n3.r(e24, n3.d), n3 = n3._next;
  };
  var Tn = function(e24, t4, n3, r3) {
    for (var i3 = this._pt, a3; i3; ) a3 = i3._next, i3.p === r3 && i3.modifier(e24, t4, n3), i3 = a3;
  };
  var En = function(e24) {
    for (var t4 = this._pt, n3, r3; t4; ) r3 = t4._next, t4.p === e24 && !t4.op || t4.op === e24 ? Pe(this, t4, `_pt`) : t4.dep || (n3 = 1), t4 = r3;
    return !n3;
  };
  var Dn = function(e24, t4, n3, r3) {
    r3.mSet(e24, t4, r3.m.call(r3.tween, n3, r3.mt), r3);
  };
  var On = function(e24) {
    for (var t4 = e24._pt, n3, r3, i3, a3; t4; ) {
      for (n3 = t4._next, r3 = i3; r3 && r3.pr > t4.pr; ) r3 = r3._next;
      (t4._prev = r3 ? r3._prev : a3) ? t4._prev._next = t4 : i3 = t4, (t4._next = r3) ? r3._prev = t4 : a3 = t4, t4 = n3;
    }
    e24._pt = i3;
  };
  var X = (function() {
    function e24(e25, t5, n3, r3, i3, a3, o3, s3, c3) {
      this.t = t5, this.s = r3, this.c = i3, this.p = n3, this.r = a3 || xn, this.d = o3 || this, this.set = s3 || gn, this.pr = c3 || 0, this._next = e25, e25 && (e25._prev = this);
    }
    var t4 = e24.prototype;
    return t4.modifier = function(e25, t5, n3) {
      this.mSet = this.mSet || this.set, this.set = Dn, this.m = e25, this.mt = n3, this.tween = t5;
    }, e24;
  })();
  H(he + `parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`, function(e24) {
    return ce[e24] = 1;
  }), R.TweenMax = R.TweenLite = Y, R.TimelineLite = R.TimelineMax = J, P = new J({ sortChildren: false, defaults: r, autoRemoveChildren: true, id: `root`, smoothChildTiming: true }), n.stringFilter = zt;
  var kn = [];
  var An = {};
  var jn = [];
  var Mn = 0;
  var Nn = 0;
  var Pn = function(e24) {
    return (An[e24] || jn).map(function(e25) {
      return e25();
    });
  };
  var Fn = function() {
    var e24 = Date.now(), t4 = [];
    e24 - Mn > 2 && (Pn(`matchMediaInit`), kn.forEach(function(e25) {
      var n3 = e25.queries, r3 = e25.conditions, i3, a3, o3, s3;
      for (a3 in n3) i3 = F.matchMedia(n3[a3]).matches, i3 && (o3 = 1), i3 !== r3[a3] && (r3[a3] = i3, s3 = 1);
      s3 && (e25.revert(), o3 && t4.push(e25));
    }), Pn(`matchMediaRevert`), t4.forEach(function(e25) {
      return e25.onMatch(e25, function(t5) {
        return e25.add(null, t5);
      });
    }), Mn = e24, Pn(`matchMedia`));
  };
  var In = (function() {
    function e24(e25, t5) {
      this.selector = t5 && dt(t5), this.data = [], this._r = [], this.isReverted = false, this.id = Nn++, e25 && this.add(e25);
    }
    var t4 = e24.prototype;
    return t4.add = function(e25, t5, n3) {
      g(e25) && (n3 = t5, t5 = e25, e25 = g);
      var r3 = this, i3 = function() {
        var e26 = o, i4 = r3.selector, a3;
        return e26 && e26 !== r3 && e26.data.push(r3), n3 && (r3.selector = dt(n3)), o = r3, a3 = t5.apply(r3, arguments), g(a3) && r3._r.push(a3), o = e26, r3.selector = i4, r3.isReverted = false, a3;
      };
      return r3.last = i3, e25 === g ? i3(r3, function(e26) {
        return r3.add(null, e26);
      }) : e25 ? r3[e25] = i3 : i3;
    }, t4.ignore = function(e25) {
      var t5 = o;
      o = null, e25(this), o = t5;
    }, t4.getTweens = function() {
      var t5 = [];
      return this.data.forEach(function(n3) {
        return n3 instanceof e24 ? t5.push.apply(t5, n3.getTweens()) : n3 instanceof Y && !(n3.parent && n3.parent.data === `nested`) && t5.push(n3);
      }), t5;
    }, t4.clear = function() {
      this._r.length = this.data.length = 0;
    }, t4.kill = function(e25, t5) {
      var n3 = this;
      if (e25 ? (function() {
        for (var t6 = n3.getTweens(), r4 = n3.data.length, i3; r4--; ) i3 = n3.data[r4], i3.data === `isFlip` && (i3.revert(), i3.getChildren(true, true, false).forEach(function(e26) {
          return t6.splice(t6.indexOf(e26), 1);
        }));
        for (t6.map(function(e26) {
          return { g: e26._dur || e26._delay || e26._sat && !e26._sat.vars.immediateRender ? e26.globalTime(0) : -1 / 0, t: e26 };
        }).sort(function(e26, t7) {
          return t7.g - e26.g || -1 / 0;
        }).forEach(function(t7) {
          return t7.t.revert(e25);
        }), r4 = n3.data.length; r4--; ) i3 = n3.data[r4], i3 instanceof J ? i3.data !== `nested` && (i3.scrollTrigger && i3.scrollTrigger.revert(), i3.kill()) : !(i3 instanceof Y) && i3.revert && i3.revert(e25);
        n3._r.forEach(function(t7) {
          return t7(e25, n3);
        }), n3.isReverted = true;
      })() : this.data.forEach(function(e26) {
        return e26.kill && e26.kill();
      }), this.clear(), t5) for (var r3 = kn.length; r3--; ) kn[r3].id === this.id && kn.splice(r3, 1);
    }, t4.revert = function(e25) {
      this.kill(e25 || {});
    }, e24;
  })();
  var Ln = (function() {
    function e24(e25) {
      this.contexts = [], this.scope = e25, o && o.data.push(this);
    }
    var t4 = e24.prototype;
    return t4.add = function(e25, t5, n3) {
      y(e25) || (e25 = { matches: e25 });
      var r3 = new In(0, n3 || this.scope), i3 = r3.conditions = {}, a3, s3, c3;
      for (s3 in o && !r3.selector && (r3.selector = o.selector), this.contexts.push(r3), t5 = r3.add(`onMatch`, t5), r3.queries = e25, e25) s3 === `all` ? c3 = 1 : (a3 = F.matchMedia(e25[s3]), a3 && (kn.indexOf(r3) < 0 && kn.push(r3), (i3[s3] = a3.matches) && (c3 = 1), a3.addListener ? a3.addListener(Fn) : a3.addEventListener(`change`, Fn)));
      return c3 && t5(r3, function(e26) {
        return r3.add(null, e26);
      }), this;
    }, t4.revert = function(e25) {
      this.kill(e25 || {});
    }, t4.kill = function(e25) {
      this.contexts.forEach(function(t5) {
        return t5.kill(e25, true);
      });
    }, e24;
  })();
  var Rn = { registerPlugin: function() {
    [...arguments].forEach(function(e24) {
      return jt(e24);
    });
  }, timeline: function(e24) {
    return new J(e24);
  }, getTweensOf: function(e24, t4) {
    return P.getTweensOf(e24, t4);
  }, getProperty: function(e24, t4, n3, r3) {
    h(e24) && (e24 = ut(e24)[0]);
    var i3 = _e(e24 || {}).get, a3 = n3 ? Te : we;
    return n3 === `native` && (n3 = ``), e24 && (t4 ? a3((V[t4] && V[t4].get || i3)(e24, t4, n3, r3)) : function(t5, n4, r4) {
      return a3((V[t5] && V[t5].get || i3)(e24, t5, n4, r4));
    });
  }, quickSetter: function(e24, t4, n3) {
    if (e24 = ut(e24), e24.length > 1) {
      var r3 = e24.map(function(e25) {
        return Z.quickSetter(e25, t4, n3);
      }), i3 = r3.length;
      return function(e25) {
        for (var t5 = i3; t5--; ) r3[t5](e25);
      };
    }
    e24 = e24[0] || {};
    var a3 = V[t4], o3 = _e(e24), s3 = o3.harness && (o3.harness.aliases || {})[t4] || t4, c3 = a3 ? function(t5) {
      var r4 = new a3();
      kt._pt = 0, r4.init(e24, n3 ? t5 + n3 : t5, kt, 0, [e24]), r4.render(1, r4), kt._pt && wn(1, kt);
    } : o3.set(e24, s3);
    return a3 ? c3 : function(t5) {
      return c3(e24, s3, n3 ? t5 + n3 : t5, o3, 1);
    };
  }, quickTo: function(e24, t4, n3) {
    var r3, i3 = Z.to(e24, Ee((r3 = {}, r3[t4] = `+=0.1`, r3.paused = true, r3.stagger = 0, r3), n3 || {})), a3 = function(e25, n4, r4) {
      return i3.resetTo(t4, e25, n4, r4);
    };
    return a3.tween = i3, a3;
  }, isTweening: function(e24) {
    return P.getTweensOf(e24, true).length > 0;
  }, defaults: function(e24) {
    return e24 && e24.ease && (e24.ease = Yt(e24.ease, r.ease)), ke(r, e24 || {});
  }, config: function(e24) {
    return ke(n, e24 || {});
  }, registerEffect: function(e24) {
    var t4 = e24.name, n3 = e24.effect, r3 = e24.plugins, i3 = e24.defaults, a3 = e24.extendTimeline;
    (r3 || ``).split(`,`).forEach(function(e25) {
      return e25 && !V[e25] && !R[e25] && ne(t4 + ` effect requires ` + e25 + ` plugin.`);
    }), fe[t4] = function(e25, t5, r4) {
      return n3(ut(e25), Ee(t5 || {}, i3), r4);
    }, a3 && (J.prototype[t4] = function(e25, n4, r4) {
      return this.add(fe[t4](e25, y(n4) ? n4 : (r4 = n4) && {}, this), r4);
    });
  }, registerEase: function(e24, t4) {
    q[e24] = Yt(t4);
  }, parseEase: function(e24, t4) {
    return arguments.length ? Yt(e24, t4) : q;
  }, getById: function(e24) {
    return P.getById(e24);
  }, exportRoot: function(e24, t4) {
    e24 === void 0 && (e24 = {});
    var n3 = new J(e24), r3, i3;
    for (n3.smoothChildTiming = b(e24.smoothChildTiming), P.remove(n3), n3._dp = 0, n3._time = n3._tTime = P._time, r3 = P._first; r3; ) i3 = r3._next, (t4 || !(!r3._dur && r3 instanceof Y && r3.vars.onComplete === r3._targets[0])) && Ke(n3, r3, r3._start - r3._delay), r3 = i3;
    return Ke(P, n3, 0), n3;
  }, context: function(e24, t4) {
    return e24 ? new In(e24, t4) : o;
  }, matchMedia: function(e24) {
    return new Ln(e24);
  }, matchMediaRefresh: function() {
    return kn.forEach(function(e24) {
      var t4 = e24.conditions, n3, r3;
      for (r3 in t4) t4[r3] && (t4[r3] = false, n3 = 1);
      n3 && e24.revert();
    }) || Fn();
  }, addEventListener: function(e24, t4) {
    var n3 = An[e24] || (An[e24] = []);
    ~n3.indexOf(t4) || n3.push(t4);
  }, removeEventListener: function(e24, t4) {
    var n3 = An[e24], r3 = n3 && n3.indexOf(t4);
    r3 >= 0 && n3.splice(r3, 1);
  }, utils: { wrap: xt, wrapYoyo: St, distribute: pt, random: gt, snap: ht, normalize: yt, getUnit: G, clamp: ot, splitColor: Pt, toArray: ut, selector: dt, mapRange: wt, pipe: _t, unitize: vt, interpolate: Tt, shuffle: ft }, install: ee, effects: fe, ticker: Vt, updateRoot: J.updateRoot, plugins: V, globalTimeline: P, core: { PropTween: X, globals: re, Tween: Y, Timeline: J, Animation: tn, getCache: _e, _removeLinkedListItem: Pe, reverting: function() {
    return a;
  }, context: function(e24) {
    return e24 && o && (o.data.push(e24), e24._ctx = o), o;
  }, suppressOverwrites: function(e24) {
    return i = e24;
  } } };
  H(`to,from,fromTo,delayedCall,set,killTweensOf`, function(e24) {
    return Rn[e24] = Y[e24];
  }), Vt.add(J.updateRoot), kt = Rn.to({}, { duration: 0 });
  var zn = function(e24, t4) {
    for (var n3 = e24._pt; n3 && n3.p !== t4 && n3.op !== t4 && n3.fp !== t4; ) n3 = n3._next;
    return n3;
  };
  var Bn = function(e24, t4) {
    var n3 = e24._targets, r3, i3, a3;
    for (r3 in t4) for (i3 = n3.length; i3--; ) a3 = e24._ptLookup[i3][r3], a3 && (a3 = a3.d) && (a3._pt && (a3 = zn(a3, r3)), a3 && a3.modifier && a3.modifier(t4[r3], e24, n3[i3], r3));
  };
  var Vn = function(e24, t4) {
    return { name: e24, headless: 1, rawVars: 1, init: function(e25, n3, r3) {
      r3._onInit = function(e26) {
        var r4, i3;
        if (h(n3) && (r4 = {}, H(n3, function(e27) {
          return r4[e27] = 1;
        }), n3 = r4), t4) {
          for (i3 in r4 = {}, n3) r4[i3] = t4(n3[i3]);
          n3 = r4;
        }
        Bn(e26, n3);
      };
    } };
  };
  var Z = Rn.registerPlugin({ name: `attr`, init: function(e24, t4, n3, r3, i3) {
    var a3, o3, s3;
    for (a3 in this.tween = n3, t4) s3 = e24.getAttribute(a3) || ``, o3 = this.add(e24, `setAttribute`, (s3 || 0) + ``, t4[a3], r3, i3, 0, 0, a3), o3.op = a3, o3.b = s3, this._props.push(a3);
  }, render: function(e24, t4) {
    for (var n3 = t4._pt; n3; ) a ? n3.set(n3.t, n3.p, n3.b, n3) : n3.r(e24, n3.d), n3 = n3._next;
  } }, { name: `endArray`, headless: 1, init: function(e24, t4) {
    for (var n3 = t4.length; n3--; ) this.add(e24, n3, e24[n3] || 0, t4[n3], 0, 0, 0, 0, 0, 1);
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
  var ar = function(e24, t4) {
    return t4.set(t4.t, t4.p, Math.round((t4.s + t4.c * e24) * 1e4) / 1e4 + t4.u, t4);
  };
  var or = function(e24, t4) {
    return t4.set(t4.t, t4.p, e24 === 1 ? t4.e : Math.round((t4.s + t4.c * e24) * 1e4) / 1e4 + t4.u, t4);
  };
  var sr = function(e24, t4) {
    return t4.set(t4.t, t4.p, e24 ? Math.round((t4.s + t4.c * e24) * 1e4) / 1e4 + t4.u : t4.b, t4);
  };
  var cr = function(e24, t4) {
    return t4.set(t4.t, t4.p, e24 === 1 ? t4.e : e24 ? Math.round((t4.s + t4.c * e24) * 1e4) / 1e4 + t4.u : t4.b, t4);
  };
  var lr = function(e24, t4) {
    var n3 = t4.s + t4.c * e24;
    t4.set(t4.t, t4.p, ~~(n3 + (n3 < 0 ? -0.5 : 0.5)) + t4.u, t4);
  };
  var ur = function(e24, t4) {
    return t4.set(t4.t, t4.p, e24 ? t4.e : t4.b, t4);
  };
  var dr = function(e24, t4) {
    return t4.set(t4.t, t4.p, e24 === 1 ? t4.e : t4.b, t4);
  };
  var fr = function(e24, t4, n3) {
    return e24.style[t4] = n3;
  };
  var pr = function(e24, t4, n3) {
    return e24.style.setProperty(t4, n3);
  };
  var mr = function(e24, t4, n3) {
    return e24._gsap[t4] = n3;
  };
  var hr = function(e24, t4, n3) {
    return e24._gsap.scaleX = e24._gsap.scaleY = n3;
  };
  var gr = function(e24, t4, n3, r3, i3) {
    var a3 = e24._gsap;
    a3.scaleX = a3.scaleY = n3, a3.renderTransform(i3, a3);
  };
  var _r = function(e24, t4, n3, r3, i3) {
    var a3 = e24._gsap;
    a3[t4] = n3, a3.renderTransform(i3, a3);
  };
  var Q = `transform`;
  var $ = Q + `Origin`;
  var vr = function e12(t4, n3) {
    var r3 = this, i3 = this.target, a3 = i3.style, o3 = i3._gsap;
    if (t4 in Xn && a3) {
      if (this.tfm = this.tfm || {}, t4 !== `transform`) t4 = ir[t4] || t4, ~t4.indexOf(`,`) ? t4.split(`,`).forEach(function(e24) {
        return r3.tfm[e24] = Lr(i3, e24);
      }) : this.tfm[t4] = o3.x ? o3[t4] : Lr(i3, t4), t4 === $ && (this.tfm.zOrigin = o3.zOrigin);
      else return ir.transform.split(`,`).forEach(function(t5) {
        return e12.call(r3, t5, n3);
      });
      if (this.props.indexOf(Q) >= 0) return;
      o3.svg && (this.svgo = i3.getAttribute(`data-svg-origin`), this.props.push($, n3, ``)), t4 = Q;
    }
    (a3 || n3) && this.props.push(t4, n3, a3[t4]);
  };
  var yr = function(e24) {
    e24.translate && (e24.removeProperty(`translate`), e24.removeProperty(`scale`), e24.removeProperty(`rotate`));
  };
  var br = function() {
    var e24 = this.props, t4 = this.target, n3 = t4.style, r3 = t4._gsap, i3, a3;
    for (i3 = 0; i3 < e24.length; i3 += 3) e24[i3 + 1] ? e24[i3 + 1] === 2 ? t4[e24[i3]](e24[i3 + 2]) : t4[e24[i3]] = e24[i3 + 2] : e24[i3 + 2] ? n3[e24[i3]] = e24[i3 + 2] : n3.removeProperty(e24[i3].substr(0, 2) === `--` ? e24[i3] : e24[i3].replace(tr, `-$1`).toLowerCase());
    if (this.tfm) {
      for (a3 in this.tfm) r3[a3] = this.tfm[a3];
      r3.svg && (r3.renderTransform(), t4.setAttribute(`data-svg-origin`, this.svgo || ``)), i3 = Jn(), (!i3 || !i3.isStart) && !n3[Q] && (yr(n3), r3.zOrigin && n3[$] && (n3[$] += ` ` + r3.zOrigin + `px`, r3.zOrigin = 0, r3.renderTransform()), r3.uncache = 1);
    }
  };
  var xr = function(e24, t4) {
    var n3 = { target: e24, props: [], revert: br, save: vr };
    return e24._gsap || Z.core.getCache(e24), t4 && e24.style && e24.nodeType && t4.split(`,`).forEach(function(e25) {
      return n3.save(e25);
    }), n3;
  };
  var Sr;
  var Cr = function(e24, t4) {
    var n3 = Un.createElementNS ? Un.createElementNS((t4 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e24) : Un.createElement(e24);
    return n3 && n3.style ? n3 : Un.createElement(e24);
  };
  var wr = function e13(t4, n3, r3) {
    var i3 = getComputedStyle(t4);
    return i3[n3] || i3.getPropertyValue(n3.replace(tr, `-$1`).toLowerCase()) || i3.getPropertyValue(n3) || !r3 && e13(t4, Er(n3) || n3, 1) || ``;
  };
  var Tr = `O,Moz,ms,Ms,Webkit`.split(`,`);
  var Er = function(e24, t4, n3) {
    var r3 = (t4 || Kn).style, i3 = 5;
    if (e24 in r3 && !n3) return e24;
    for (e24 = e24.charAt(0).toUpperCase() + e24.substr(1); i3-- && !(Tr[i3] + e24 in r3); ) ;
    return i3 < 0 ? null : (i3 === 3 ? `ms` : i3 >= 0 ? Tr[i3] : ``) + e24;
  };
  var Dr = function() {
    Yn() && window.document && (Hn = window, Un = Hn.document, Wn = Un.documentElement, Kn = Cr(`div`) || { style: {} }, Cr(`div`), Q = Er(Q), $ = Q + `Origin`, Kn.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`, Sr = !!Er(`perspective`), Jn = Z.core.reverting, Gn = 1);
  };
  var Or = function(e24) {
    var t4 = e24.ownerSVGElement, n3 = Cr(`svg`, t4 && t4.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg`), r3 = e24.cloneNode(true), i3;
    r3.style.display = `block`, n3.appendChild(r3), Wn.appendChild(n3);
    try {
      i3 = r3.getBBox();
    } catch {
    }
    return n3.removeChild(r3), Wn.removeChild(n3), i3;
  };
  var kr = function(e24, t4) {
    for (var n3 = t4.length; n3--; ) if (e24.hasAttribute(t4[n3])) return e24.getAttribute(t4[n3]);
  };
  var Ar = function(e24) {
    var t4, n3;
    try {
      t4 = e24.getBBox();
    } catch {
      t4 = Or(e24), n3 = 1;
    }
    return t4 && (t4.width || t4.height) || n3 || (t4 = Or(e24)), t4 && !t4.width && !t4.x && !t4.y ? { x: +kr(e24, [`x`, `cx`, `x1`]) || 0, y: +kr(e24, [`y`, `cy`, `y1`]) || 0, width: 0, height: 0 } : t4;
  };
  var jr = function(e24) {
    return !!(e24.getCTM && (!e24.parentNode || e24.ownerSVGElement) && Ar(e24));
  };
  var Mr = function(e24, t4) {
    if (t4) {
      var n3 = e24.style, r3;
      t4 in Xn && t4 !== $ && (t4 = Q), n3.removeProperty ? (r3 = t4.substr(0, 2), (r3 === `ms` || t4.substr(0, 6) === `webkit`) && (t4 = `-` + t4), n3.removeProperty(r3 === `--` ? t4 : t4.replace(tr, `-$1`).toLowerCase())) : n3.removeAttribute(t4);
    }
  };
  var Nr = function(e24, t4, n3, r3, i3, a3) {
    var o3 = new X(e24._pt, t4, n3, 0, 1, a3 ? dr : ur);
    return e24._pt = o3, o3.b = r3, o3.e = i3, e24._props.push(n3), o3;
  };
  var Pr = { deg: 1, rad: 1, turn: 1 };
  var Fr = { grid: 1, flex: 1 };
  var Ir = function e14(t4, n3, r3, i3) {
    var a3 = parseFloat(r3) || 0, o3 = (r3 + ``).trim().substr((a3 + ``).length) || `px`, s3 = Kn.style, c3 = nr.test(n3), l3 = t4.tagName.toLowerCase() === `svg`, u3 = (l3 ? `client` : `offset`) + (c3 ? `Width` : `Height`), d3 = 100, f3 = i3 === `px`, p3 = i3 === `%`, m3, h3, g3, _3;
    if (i3 === o3 || !a3 || Pr[i3] || Pr[o3]) return a3;
    if (o3 !== `px` && !f3 && (a3 = e14(t4, n3, r3, `px`)), _3 = t4.getCTM && jr(t4), (p3 || o3 === `%`) && (Xn[n3] || ~n3.indexOf(`adius`))) return m3 = _3 ? t4.getBBox()[c3 ? `width` : `height`] : t4[u3], U(p3 ? a3 / m3 * d3 : a3 / 100 * m3);
    if (s3[c3 ? `width` : `height`] = d3 + (f3 ? o3 : i3), h3 = i3 !== `rem` && ~n3.indexOf(`adius`) || i3 === `em` && t4.appendChild && !l3 ? t4 : t4.parentNode, _3 && (h3 = (t4.ownerSVGElement || {}).parentNode), (!h3 || h3 === Un || !h3.appendChild) && (h3 = Un.body), g3 = h3._gsap, g3 && p3 && g3.width && c3 && g3.time === Vt.time && !g3.uncache) return U(a3 / g3.width * d3);
    if (p3 && (n3 === `height` || n3 === `width`)) {
      var v3 = t4.style[n3];
      t4.style[n3] = d3 + i3, m3 = t4[u3], v3 ? t4.style[n3] = v3 : Mr(t4, n3);
    } else (p3 || o3 === `%`) && !Fr[wr(h3, `display`)] && (s3.position = wr(t4, `position`)), h3 === t4 && (s3.position = `static`), h3.appendChild(Kn), m3 = Kn[u3], h3.removeChild(Kn), s3.position = `absolute`;
    return c3 && p3 && (g3 = _e(h3), g3.time = Vt.time, g3.width = h3[u3]), U(f3 ? m3 * a3 / d3 : m3 && a3 ? d3 / m3 * a3 : 0);
  };
  var Lr = function(e24, t4, n3, r3) {
    var i3;
    return Gn || Dr(), t4 in ir && t4 !== `transform` && (t4 = ir[t4], ~t4.indexOf(`,`) && (t4 = t4.split(`,`)[0])), Xn[t4] && t4 !== `transform` ? (i3 = Yr(e24, r3), i3 = t4 === `transformOrigin` ? i3.svg ? i3.origin : Xr(wr(e24, $)) + ` ` + i3.zOrigin + `px` : i3[t4]) : (i3 = e24.style[t4], (!i3 || i3 === `auto` || r3 || ~(i3 + ``).indexOf(`calc(`)) && (i3 = Hr[t4] && Hr[t4](e24, t4, n3) || wr(e24, t4) || ve(e24, t4) || +(t4 === `opacity`))), n3 && !~(i3 + ``).trim().indexOf(` `) ? Ir(e24, t4, i3, n3) + n3 : i3;
  };
  var Rr = function(e24, t4, r3, i3) {
    if (!r3 || r3 === `none`) {
      var a3 = Er(t4, e24, 1), o3 = a3 && wr(e24, a3, 1);
      o3 && o3 !== r3 ? (t4 = a3, r3 = o3) : t4 === `borderColor` && (r3 = wr(e24, `borderTopColor`));
    }
    var s3 = new X(this._pt, e24.style, t4, 0, 1, Cn), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
    if (s3.b = r3, s3.e = i3, r3 += ``, i3 += ``, i3.substring(0, 6) === `var(--` && (i3 = wr(e24, i3.substring(4, i3.indexOf(`)`)))), i3 === `auto` && (h3 = e24.style[t4], e24.style[t4] = i3, i3 = wr(e24, t4) || i3, h3 ? e24.style[t4] = h3 : Mr(e24, t4)), u3 = [r3, i3], zt(u3), r3 = u3[0], i3 = u3[1], f3 = r3.match(k) || [], x3 = i3.match(k) || [], x3.length) {
      for (; d3 = k.exec(i3); ) g3 = d3[0], v3 = i3.substring(c3, d3.index), m3 ? m3 = (m3 + 1) % 5 : (v3.substr(-5) === `rgba(` || v3.substr(-5) === `hsla(`) && (m3 = 1), g3 !== (h3 = f3[l3++] || ``) && (p3 = parseFloat(h3) || 0, b3 = h3.substr((p3 + ``).length), g3.charAt(1) === `=` && (g3 = ye(p3, g3) + b3), _3 = parseFloat(g3), y3 = g3.substr((_3 + ``).length), c3 = k.lastIndex - y3.length, y3 || (y3 = y3 || n.units[t4] || b3, c3 === i3.length && (i3 += y3, s3.e += y3)), b3 !== y3 && (p3 = Ir(e24, t4, h3, y3) || 0), s3._pt = { _next: s3._pt, p: v3 || l3 === 1 ? v3 : `,`, s: p3, c: _3 - p3, m: m3 && m3 < 4 || t4 === `zIndex` ? Math.round : 0 });
      s3.c = c3 < i3.length ? i3.substring(c3, i3.length) : ``;
    } else s3.r = t4 === `display` && i3 === `none` ? dr : ur;
    return j.test(i3) && (s3.e = 0), this._pt = s3, s3;
  };
  var zr = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` };
  var Br = function(e24) {
    var t4 = e24.split(` `), n3 = t4[0], r3 = t4[1] || `50%`;
    return (n3 === `top` || n3 === `bottom` || r3 === `left` || r3 === `right`) && (e24 = n3, n3 = r3, r3 = e24), t4[0] = zr[n3] || n3, t4[1] = zr[r3] || r3, t4.join(` `);
  };
  var Vr = function(e24, t4) {
    if (t4.tween && t4.tween._time === t4.tween._dur) {
      var n3 = t4.t, r3 = n3.style, i3 = t4.u, a3 = n3._gsap, o3, s3, c3;
      if (i3 === `all` || i3 === true) r3.cssText = ``, s3 = 1;
      else for (i3 = i3.split(`,`), c3 = i3.length; --c3 > -1; ) o3 = i3[c3], Xn[o3] && (s3 = 1, o3 = o3 === `transformOrigin` ? $ : Q), Mr(n3, o3);
      s3 && (Mr(n3, Q), a3 && (a3.svg && n3.removeAttribute(`transform`), r3.scale = r3.rotate = r3.translate = `none`, Yr(n3, 1), a3.uncache = 1, yr(r3)));
    }
  };
  var Hr = { clearProps: function(e24, t4, n3, r3, i3) {
    if (i3.data !== `isFromStart`) {
      var a3 = e24._pt = new X(e24._pt, t4, n3, 0, 0, Vr);
      return a3.u = r3, a3.pr = -10, a3.tween = i3, e24._props.push(n3), 1;
    }
  } };
  var Ur = [1, 0, 0, 1, 0, 0];
  var Wr = {};
  var Gr = function(e24) {
    return e24 === `matrix(1, 0, 0, 1, 0, 0)` || e24 === `none` || !e24;
  };
  var Kr = function(e24) {
    var t4 = wr(e24, Q);
    return Gr(t4) ? Ur : t4.substr(7).match(O).map(U);
  };
  var qr = function(e24, t4) {
    var n3 = e24._gsap || _e(e24), r3 = e24.style, i3 = Kr(e24), a3, o3, s3, c3;
    return n3.svg && e24.getAttribute(`transform`) ? (s3 = e24.transform.baseVal.consolidate().matrix, i3 = [s3.a, s3.b, s3.c, s3.d, s3.e, s3.f], i3.join(`,`) === `1,0,0,1,0,0` ? Ur : i3) : (i3 === Ur && !e24.offsetParent && e24 !== Wn && !n3.svg && (s3 = r3.display, r3.display = `block`, a3 = e24.parentNode, (!a3 || !e24.offsetParent && !e24.getBoundingClientRect().width) && (c3 = 1, o3 = e24.nextElementSibling, Wn.appendChild(e24)), i3 = Kr(e24), s3 ? r3.display = s3 : Mr(e24, `display`), c3 && (o3 ? a3.insertBefore(e24, o3) : a3 ? a3.appendChild(e24) : Wn.removeChild(e24))), t4 && i3.length > 6 ? [i3[0], i3[1], i3[4], i3[5], i3[12], i3[13]] : i3);
  };
  var Jr = function(e24, t4, n3, r3, i3, a3) {
    var o3 = e24._gsap, s3 = i3 || qr(e24, true), c3 = o3.xOrigin || 0, l3 = o3.yOrigin || 0, u3 = o3.xOffset || 0, d3 = o3.yOffset || 0, f3 = s3[0], p3 = s3[1], m3 = s3[2], h3 = s3[3], g3 = s3[4], _3 = s3[5], v3 = t4.split(` `), y3 = parseFloat(v3[0]) || 0, b3 = parseFloat(v3[1]) || 0, x3, S3, C3, w3;
    n3 ? s3 !== Ur && (S3 = f3 * h3 - p3 * m3) && (C3 = h3 / S3 * y3 + b3 * (-m3 / S3) + (m3 * _3 - h3 * g3) / S3, w3 = y3 * (-p3 / S3) + f3 / S3 * b3 - (f3 * _3 - p3 * g3) / S3, y3 = C3, b3 = w3) : (x3 = Ar(e24), y3 = x3.x + (~v3[0].indexOf(`%`) ? y3 / 100 * x3.width : y3), b3 = x3.y + (~(v3[1] || v3[0]).indexOf(`%`) ? b3 / 100 * x3.height : b3)), r3 || r3 !== false && o3.smooth ? (g3 = y3 - c3, _3 = b3 - l3, o3.xOffset = u3 + (g3 * f3 + _3 * m3) - g3, o3.yOffset = d3 + (g3 * p3 + _3 * h3) - _3) : o3.xOffset = o3.yOffset = 0, o3.xOrigin = y3, o3.yOrigin = b3, o3.smooth = !!r3, o3.origin = t4, o3.originIsAbsolute = !!n3, e24.style[$] = `0px 0px`, a3 && (Nr(a3, o3, `xOrigin`, c3, y3), Nr(a3, o3, `yOrigin`, l3, b3), Nr(a3, o3, `xOffset`, u3, o3.xOffset), Nr(a3, o3, `yOffset`, d3, o3.yOffset)), e24.setAttribute(`data-svg-origin`, y3 + ` ` + b3);
  };
  var Yr = function(e24, t4) {
    var r3 = e24._gsap || new en(e24);
    if (`x` in r3 && !t4 && !r3.uncache) return r3;
    var i3 = e24.style, a3 = r3.scaleX < 0, o3 = `px`, s3 = `deg`, c3 = getComputedStyle(e24), l3 = wr(e24, $) || `0`, u3 = d3 = f3 = h3 = g3 = _3 = v3 = y3 = b3 = 0, d3, f3, p3 = m3 = 1, m3, h3, g3, _3, v3, y3, b3, x3, S3, C3, w3, T3, E3, D3, O3, k3, A3, j3, M3, N3, P3, F3, I3, L3, R3, z3, B3, ee3;
    return r3.svg = !!(e24.getCTM && jr(e24)), c3.translate && ((c3.translate !== `none` || c3.scale !== `none` || c3.rotate !== `none`) && (i3[Q] = (c3.translate === `none` ? `` : `translate3d(` + (c3.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) + `) `) + (c3.rotate === `none` ? `` : `rotate(` + c3.rotate + `) `) + (c3.scale === `none` ? `` : `scale(` + c3.scale.split(` `).join(`,`) + `) `) + (c3[Q] === `none` ? `` : c3[Q])), i3.scale = i3.rotate = i3.translate = `none`), C3 = qr(e24, r3.svg), r3.svg && (r3.uncache ? (P3 = e24.getBBox(), l3 = r3.xOrigin - P3.x + `px ` + (r3.yOrigin - P3.y) + `px`, N3 = ``) : N3 = !t4 && e24.getAttribute(`data-svg-origin`), Jr(e24, N3 || l3, !!N3 || r3.originIsAbsolute, r3.smooth !== false, C3)), x3 = r3.xOrigin || 0, S3 = r3.yOrigin || 0, C3 !== Ur && (D3 = C3[0], O3 = C3[1], k3 = C3[2], A3 = C3[3], u3 = j3 = C3[4], d3 = M3 = C3[5], C3.length === 6 ? (p3 = Math.sqrt(D3 * D3 + O3 * O3), m3 = Math.sqrt(A3 * A3 + k3 * k3), h3 = D3 || O3 ? $n(O3, D3) * Zn : 0, v3 = k3 || A3 ? $n(k3, A3) * Zn + h3 : 0, v3 && (m3 *= Math.abs(Math.cos(v3 * Qn))), r3.svg && (u3 -= x3 - (x3 * D3 + S3 * k3), d3 -= S3 - (x3 * O3 + S3 * A3))) : (ee3 = C3[6], z3 = C3[7], I3 = C3[8], L3 = C3[9], R3 = C3[10], B3 = C3[11], u3 = C3[12], d3 = C3[13], f3 = C3[14], w3 = $n(ee3, R3), g3 = w3 * Zn, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N3 = j3 * T3 + I3 * E3, P3 = M3 * T3 + L3 * E3, F3 = ee3 * T3 + R3 * E3, I3 = j3 * -E3 + I3 * T3, L3 = M3 * -E3 + L3 * T3, R3 = ee3 * -E3 + R3 * T3, B3 = z3 * -E3 + B3 * T3, j3 = N3, M3 = P3, ee3 = F3), w3 = $n(-k3, R3), _3 = w3 * Zn, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N3 = D3 * T3 - I3 * E3, P3 = O3 * T3 - L3 * E3, F3 = k3 * T3 - R3 * E3, B3 = A3 * E3 + B3 * T3, D3 = N3, O3 = P3, k3 = F3), w3 = $n(O3, D3), h3 = w3 * Zn, w3 && (T3 = Math.cos(w3), E3 = Math.sin(w3), N3 = D3 * T3 + O3 * E3, P3 = j3 * T3 + M3 * E3, O3 = O3 * T3 - D3 * E3, M3 = M3 * T3 - j3 * E3, D3 = N3, j3 = P3), g3 && Math.abs(g3) + Math.abs(h3) > 359.9 && (g3 = h3 = 0, _3 = 180 - _3), p3 = U(Math.sqrt(D3 * D3 + O3 * O3 + k3 * k3)), m3 = U(Math.sqrt(M3 * M3 + ee3 * ee3)), w3 = $n(j3, M3), v3 = Math.abs(w3) > 2e-4 ? w3 * Zn : 0, b3 = B3 ? 1 / (B3 < 0 ? -B3 : B3) : 0), r3.svg && (N3 = e24.getAttribute(`transform`), r3.forceCSS = e24.setAttribute(`transform`, ``) || !Gr(wr(e24, Q)), N3 && e24.setAttribute(`transform`, N3))), Math.abs(v3) > 90 && Math.abs(v3) < 270 && (a3 ? (p3 *= -1, v3 += h3 <= 0 ? 180 : -180, h3 += h3 <= 0 ? 180 : -180) : (m3 *= -1, v3 += v3 <= 0 ? 180 : -180)), t4 || (t4 = r3.uncache), r3.x = u3 - ((r3.xPercent = u3 && (!t4 && r3.xPercent || (Math.round(e24.offsetWidth / 2) === Math.round(-u3) ? -50 : 0))) ? e24.offsetWidth * r3.xPercent / 100 : 0) + o3, r3.y = d3 - ((r3.yPercent = d3 && (!t4 && r3.yPercent || (Math.round(e24.offsetHeight / 2) === Math.round(-d3) ? -50 : 0))) ? e24.offsetHeight * r3.yPercent / 100 : 0) + o3, r3.z = f3 + o3, r3.scaleX = U(p3), r3.scaleY = U(m3), r3.rotation = U(h3) + s3, r3.rotationX = U(g3) + s3, r3.rotationY = U(_3) + s3, r3.skewX = v3 + s3, r3.skewY = y3 + s3, r3.transformPerspective = b3 + o3, (r3.zOrigin = parseFloat(l3.split(` `)[2]) || !t4 && r3.zOrigin || 0) && (i3[$] = Xr(l3)), r3.xOffset = r3.yOffset = 0, r3.force3D = n.force3D, r3.renderTransform = r3.svg ? ri : Sr ? ni : Qr, r3.uncache = 0, r3;
  };
  var Xr = function(e24) {
    return (e24 = e24.split(` `))[0] + ` ` + e24[1];
  };
  var Zr = function(e24, t4, n3) {
    var r3 = G(t4);
    return U(parseFloat(t4) + parseFloat(Ir(e24, `x`, n3 + `px`, r3))) + r3;
  };
  var Qr = function(e24, t4) {
    t4.z = `0px`, t4.rotationY = t4.rotationX = `0deg`, t4.force3D = 0, ni(e24, t4);
  };
  var $r = `0deg`;
  var ei = `0px`;
  var ti = `) `;
  var ni = function(e24, t4) {
    var n3 = t4 || this, r3 = n3.xPercent, i3 = n3.yPercent, a3 = n3.x, o3 = n3.y, s3 = n3.z, c3 = n3.rotation, l3 = n3.rotationY, u3 = n3.rotationX, d3 = n3.skewX, f3 = n3.skewY, p3 = n3.scaleX, m3 = n3.scaleY, h3 = n3.transformPerspective, g3 = n3.force3D, _3 = n3.target, v3 = n3.zOrigin, y3 = ``, b3 = g3 === `auto` && e24 && e24 !== 1 || g3 === true;
    if (v3 && (u3 !== $r || l3 !== $r)) {
      var x3 = parseFloat(l3) * Qn, S3 = Math.sin(x3), C3 = Math.cos(x3), w3;
      x3 = parseFloat(u3) * Qn, w3 = Math.cos(x3), a3 = Zr(_3, a3, S3 * w3 * -v3), o3 = Zr(_3, o3, -Math.sin(x3) * -v3), s3 = Zr(_3, s3, C3 * w3 * -v3 + v3);
    }
    h3 !== ei && (y3 += `perspective(` + h3 + ti), (r3 || i3) && (y3 += `translate(` + r3 + `%, ` + i3 + `%) `), (b3 || a3 !== ei || o3 !== ei || s3 !== ei) && (y3 += s3 !== ei || b3 ? `translate3d(` + a3 + `, ` + o3 + `, ` + s3 + `) ` : `translate(` + a3 + `, ` + o3 + ti), c3 !== $r && (y3 += `rotate(` + c3 + ti), l3 !== $r && (y3 += `rotateY(` + l3 + ti), u3 !== $r && (y3 += `rotateX(` + u3 + ti), (d3 !== $r || f3 !== $r) && (y3 += `skew(` + d3 + `, ` + f3 + ti), (p3 !== 1 || m3 !== 1) && (y3 += `scale(` + p3 + `, ` + m3 + ti), _3.style[Q] = y3 || `translate(0, 0)`;
  };
  var ri = function(e24, t4) {
    var n3 = t4 || this, r3 = n3.xPercent, i3 = n3.yPercent, a3 = n3.x, o3 = n3.y, s3 = n3.rotation, c3 = n3.skewX, l3 = n3.skewY, u3 = n3.scaleX, d3 = n3.scaleY, f3 = n3.target, p3 = n3.xOrigin, m3 = n3.yOrigin, h3 = n3.xOffset, g3 = n3.yOffset, _3 = n3.forceCSS, v3 = parseFloat(a3), y3 = parseFloat(o3), b3, x3, S3, C3, w3;
    s3 = parseFloat(s3), c3 = parseFloat(c3), l3 = parseFloat(l3), l3 && (l3 = parseFloat(l3), c3 += l3, s3 += l3), s3 || c3 ? (s3 *= Qn, c3 *= Qn, b3 = Math.cos(s3) * u3, x3 = Math.sin(s3) * u3, S3 = Math.sin(s3 - c3) * -d3, C3 = Math.cos(s3 - c3) * d3, c3 && (l3 *= Qn, w3 = Math.tan(c3 - l3), w3 = Math.sqrt(1 + w3 * w3), S3 *= w3, C3 *= w3, l3 && (w3 = Math.tan(l3), w3 = Math.sqrt(1 + w3 * w3), b3 *= w3, x3 *= w3)), b3 = U(b3), x3 = U(x3), S3 = U(S3), C3 = U(C3)) : (b3 = u3, C3 = d3, x3 = S3 = 0), (v3 && !~(a3 + ``).indexOf(`px`) || y3 && !~(o3 + ``).indexOf(`px`)) && (v3 = Ir(f3, `x`, a3, `px`), y3 = Ir(f3, `y`, o3, `px`)), (p3 || m3 || h3 || g3) && (v3 = U(v3 + p3 - (p3 * b3 + m3 * S3) + h3), y3 = U(y3 + m3 - (p3 * x3 + m3 * C3) + g3)), (r3 || i3) && (w3 = f3.getBBox(), v3 = U(v3 + r3 / 100 * w3.width), y3 = U(y3 + i3 / 100 * w3.height)), w3 = `matrix(` + b3 + `,` + x3 + `,` + S3 + `,` + C3 + `,` + v3 + `,` + y3 + `)`, f3.setAttribute(`transform`, w3), _3 && (f3.style[Q] = w3);
  };
  var ii = function(e24, t4, n3, r3, i3) {
    var a3 = 360, o3 = h(i3), s3 = parseFloat(i3) * (o3 && ~i3.indexOf(`rad`) ? Zn : 1) - r3, c3 = r3 + s3 + `deg`, l3, u3;
    return o3 && (l3 = i3.split(`_`)[1], l3 === `short` && (s3 %= a3, s3 !== s3 % (a3 / 2) && (s3 += s3 < 0 ? a3 : -a3)), l3 === `cw` && s3 < 0 ? s3 = (s3 + a3 * er) % a3 - ~~(s3 / a3) * a3 : l3 === `ccw` && s3 > 0 && (s3 = (s3 - a3 * er) % a3 - ~~(s3 / a3) * a3)), e24._pt = u3 = new X(e24._pt, t4, n3, r3, s3, or), u3.e = c3, u3.u = `deg`, e24._props.push(n3), u3;
  };
  var ai = function(e24, t4) {
    for (var n3 in t4) e24[n3] = t4[n3];
    return e24;
  };
  var oi = function(e24, t4, n3) {
    var r3 = ai({}, n3._gsap), i3 = `perspective,force3D,transformOrigin,svgOrigin`, a3 = n3.style, o3, s3, c3, l3, u3, d3, f3, p3;
    for (s3 in r3.svg ? (c3 = n3.getAttribute(`transform`), n3.setAttribute(`transform`, ``), a3[Q] = t4, o3 = Yr(n3, 1), Mr(n3, Q), n3.setAttribute(`transform`, c3)) : (c3 = getComputedStyle(n3)[Q], a3[Q] = t4, o3 = Yr(n3, 1), a3[Q] = c3), Xn) c3 = r3[s3], l3 = o3[s3], c3 !== l3 && i3.indexOf(s3) < 0 && (f3 = G(c3), p3 = G(l3), u3 = f3 === p3 ? parseFloat(c3) : Ir(n3, s3, c3, p3), d3 = parseFloat(l3), e24._pt = new X(e24._pt, o3, s3, u3, d3 - u3, ar), e24._pt.u = p3 || 0, e24._props.push(s3));
    ai(o3, r3);
  };
  H(`padding,margin,Width,Radius`, function(e24, t4) {
    var n3 = `Top`, r3 = `Right`, i3 = `Bottom`, a3 = `Left`, o3 = (t4 < 3 ? [n3, r3, i3, a3] : [n3 + a3, n3 + r3, i3 + r3, i3 + a3]).map(function(n4) {
      return t4 < 2 ? e24 + n4 : `border` + n4 + e24;
    });
    Hr[t4 > 1 ? `border` + e24 : e24] = function(e25, t5, n4, r4, i4) {
      var a4, s3;
      if (arguments.length < 4) return a4 = o3.map(function(t6) {
        return Lr(e25, t6, n4);
      }), s3 = a4.join(` `), s3.split(a4[0]).length === 5 ? a4[0] : s3;
      a4 = (r4 + ``).split(` `), s3 = {}, o3.forEach(function(e26, t6) {
        return s3[e26] = a4[t6] = a4[t6] || a4[(t6 - 1) / 2 | 0];
      }), e25.init(t5, s3, i4);
    };
  });
  var si = { name: `css`, register: Dr, targetTest: function(e24) {
    return e24.style && e24.nodeType;
  }, init: function(e24, t4, r3, i3, a3) {
    var o3 = this._props, s3 = e24.style, c3 = r3.vars.startAt, l3, u3, d3, f3, p3, m3, g3, _3, v3, y3, b3, x3, S3, C3, w3, T3, E3;
    for (g3 in Gn || Dr(), this.styles = this.styles || xr(e24), T3 = this.styles.props, this.tween = r3, t4) if (g3 !== `autoRound` && (u3 = t4[g3], !(V[g3] && on(g3, t4, r3, i3, e24, a3)))) {
      if (p3 = typeof u3, m3 = Hr[g3], p3 === `function` && (u3 = u3.call(r3, i3, e24, a3), p3 = typeof u3), p3 === `string` && ~u3.indexOf(`random(`) && (u3 = Ct(u3)), m3) m3(this, e24, g3, u3, r3) && (w3 = 1);
      else if (g3.substr(0, 2) === `--`) l3 = (getComputedStyle(e24).getPropertyValue(g3) + ``).trim(), u3 += ``, Lt.lastIndex = 0, Lt.test(l3) || (_3 = G(l3), v3 = G(u3), v3 ? _3 !== v3 && (l3 = Ir(e24, g3, l3, v3) + v3) : _3 && (u3 += _3)), this.add(s3, `setProperty`, l3, u3, i3, a3, 0, 0, g3), o3.push(g3), T3.push(g3, 0, s3[g3]);
      else if (p3 !== `undefined`) {
        if (c3 && g3 in c3 ? (l3 = typeof c3[g3] == `function` ? c3[g3].call(r3, i3, e24, a3) : c3[g3], h(l3) && ~l3.indexOf(`random(`) && (l3 = Ct(l3)), G(l3 + ``) || l3 === `auto` || (l3 += n.units[g3] || G(Lr(e24, g3)) || ``), (l3 + ``).charAt(1) === `=` && (l3 = Lr(e24, g3))) : l3 = Lr(e24, g3), f3 = parseFloat(l3), y3 = p3 === `string` && u3.charAt(1) === `=` && u3.substr(0, 2), y3 && (u3 = u3.substr(2)), d3 = parseFloat(u3), g3 in ir && (g3 === `autoAlpha` && (f3 === 1 && Lr(e24, `visibility`) === `hidden` && d3 && (f3 = 0), T3.push(`visibility`, 0, s3.visibility), Nr(this, s3, `visibility`, f3 ? `inherit` : `hidden`, d3 ? `inherit` : `hidden`, !d3)), g3 !== `scale` && g3 !== `transform` && (g3 = ir[g3], ~g3.indexOf(`,`) && (g3 = g3.split(`,`)[0]))), b3 = g3 in Xn, b3) {
          if (this.styles.save(g3), E3 = u3, p3 === `string` && u3.substring(0, 6) === `var(--`) {
            if (u3 = wr(e24, u3.substring(4, u3.indexOf(`)`))), u3.substring(0, 5) === `calc(`) {
              var D3 = e24.style.perspective;
              e24.style.perspective = u3, u3 = wr(e24, `perspective`), D3 ? e24.style.perspective = D3 : Mr(e24, `perspective`);
            }
            d3 = parseFloat(u3);
          }
          if (x3 || (S3 = e24._gsap, S3.renderTransform && !t4.parseTransform || Yr(e24, t4.parseTransform), C3 = t4.smoothOrigin !== false && S3.smooth, x3 = this._pt = new X(this._pt, s3, Q, 0, 1, S3.renderTransform, S3, 0, -1), x3.dep = 1), g3 === `scale`) this._pt = new X(this._pt, S3, `scaleY`, S3.scaleY, (y3 ? ye(S3.scaleY, y3 + d3) : d3) - S3.scaleY || 0, ar), this._pt.u = 0, o3.push(`scaleY`, g3), g3 += `X`;
          else if (g3 === `transformOrigin`) {
            T3.push($, 0, s3[$]), u3 = Br(u3), S3.svg ? Jr(e24, u3, 0, C3, 0, this) : (v3 = parseFloat(u3.split(` `)[2]) || 0, v3 !== S3.zOrigin && Nr(this, S3, `zOrigin`, S3.zOrigin, v3), Nr(this, s3, g3, Xr(l3), Xr(u3)));
            continue;
          } else if (g3 === `svgOrigin`) {
            Jr(e24, u3, 1, C3, 0, this);
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
            oi(this, u3, e24);
            continue;
          }
        } else g3 in s3 || (g3 = Er(g3) || g3);
        if (b3 || (d3 || d3 === 0) && (f3 || f3 === 0) && !rr.test(u3) && g3 in s3) _3 = (l3 + ``).substr((f3 + ``).length), d3 || (d3 = 0), v3 = G(u3) || (g3 in n.units ? n.units[g3] : _3), _3 !== v3 && (f3 = Ir(e24, g3, l3, v3)), this._pt = new X(this._pt, b3 ? S3 : s3, g3, f3, (y3 ? ye(f3, y3 + d3) : d3) - f3, !b3 && (v3 === `px` || g3 === `zIndex`) && t4.autoRound !== false ? lr : ar), this._pt.u = v3 || 0, b3 && E3 !== u3 ? (this._pt.b = l3, this._pt.e = E3, this._pt.r = cr) : _3 !== v3 && v3 !== `%` && (this._pt.b = l3, this._pt.r = sr);
        else if (g3 in s3) Rr.call(this, e24, g3, l3, y3 ? y3 + u3 : u3);
        else if (g3 in e24) this.add(e24, g3, l3 || e24[g3], y3 ? y3 + u3 : u3, i3, a3);
        else if (g3 !== `parseTransform`) {
          te(g3, u3);
          continue;
        }
        b3 || (g3 in s3 ? T3.push(g3, 0, s3[g3]) : typeof e24[g3] == `function` ? T3.push(g3, 2, e24[g3]()) : T3.push(g3, 1, l3 || e24[g3])), o3.push(g3);
      }
    }
    w3 && On(this);
  }, render: function(e24, t4) {
    if (t4.tween._time || !Jn()) for (var n3 = t4._pt; n3; ) n3.r(e24, n3.d), n3 = n3._next;
    else t4.styles.revert();
  }, get: Lr, aliases: ir, getSetter: function(e24, t4, n3) {
    var r3 = ir[t4];
    return r3 && r3.indexOf(`,`) < 0 && (t4 = r3), t4 in Xn && t4 !== $ && (e24._gsap.x || Lr(e24, `x`)) ? n3 && qn === n3 ? t4 === `scale` ? hr : mr : (qn = n3 || {}) && (t4 === `scale` ? gr : _r) : e24.style && !v(e24.style[t4]) ? fr : ~t4.indexOf(`-`) ? pr : bn(e24, t4);
  }, core: { _removeProperty: Mr, _getMatrix: qr } };
  Z.utils.checkPrefix = Er, Z.core.getStyleSaver = xr, (function(e24, t4, r3, i3) {
    var a3 = H(e24 + `,` + t4 + `,` + r3, function(e25) {
      Xn[e25] = 1;
    });
    H(t4, function(e25) {
      n.units[e25] = `deg`, Wr[e25] = 1;
    }), ir[a3[13]] = e24 + `,` + t4, H(i3, function(e25) {
      var t5 = e25.split(`:`);
      ir[t5[1]] = a3[t5[0]];
    });
  })(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`, `rotation,rotationX,rotationY,skewX,skewY`, `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`, `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`), H(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`, function(e24) {
    n.units[e24] = `px`;
  }), Z.registerPlugin(si);
  var ci = Z.registerPlugin(si) || Z;
  ci.core.Tween;

  // public/shopify/plantilla99/assets/js/Draggable.G44Hfzvd.js
  var e15;
  var t2;
  var n2;
  var r2;
  var i2;
  var a2;
  var o2;
  var s2;
  var c2 = `transform`;
  var l2 = c2 + `Origin`;
  var u2;
  var d2 = function(i3) {
    var a3 = i3.ownerDocument || i3;
    for (!(c2 in i3.style) && (`msTransform` in i3.style) && (c2 = `msTransform`, l2 = c2 + `Origin`); a3.parentNode && (a3 = a3.parentNode); ) ;
    if (t2 = window, o2 = new w2(), a3) {
      e15 = a3, n2 = a3.documentElement, r2 = a3.body, s2 = e15.createElementNS(`http://www.w3.org/2000/svg`, `g`), s2.style.transform = `none`;
      var d3 = a3.createElement(`div`), f3 = a3.createElement(`div`), p3 = a3 && (a3.body || a3.firstElementChild);
      p3 && p3.appendChild && (p3.appendChild(d3), d3.appendChild(f3), d3.style.position = `static`, d3.style.transform = `translate3d(0,0,1px)`, u2 = f3.offsetParent !== d3, p3.removeChild(d3));
    }
    return a3;
  };
  var f2 = function(e24) {
    for (var t4, n3; e24 && e24 !== r2; ) n3 = e24._gsap, n3 && n3.uncache && n3.get(e24, `x`), n3 && !n3.scaleX && !n3.scaleY && n3.renderTransform && (n3.scaleX = n3.scaleY = 1e-4, n3.renderTransform(1, n3), t4 ? t4.push(n3) : t4 = [n3]), e24 = e24.parentNode;
    return t4;
  };
  var p2 = [];
  var m2 = [];
  var h2 = function() {
    return t2.pageYOffset || e15.scrollTop || n2.scrollTop || r2.scrollTop || 0;
  };
  var g2 = function() {
    return t2.pageXOffset || e15.scrollLeft || n2.scrollLeft || r2.scrollLeft || 0;
  };
  var _2 = function(e24) {
    return e24.ownerSVGElement || ((e24.tagName + ``).toLowerCase() === `svg` ? e24 : null);
  };
  var v2 = function e16(n3) {
    if (t2.getComputedStyle(n3).position === `fixed`) return true;
    if (n3 = n3.parentNode, n3 && n3.nodeType === 1) return e16(n3);
  };
  var y2 = function t3(n3, r3) {
    if (n3.parentNode && (e15 || d2(n3))) {
      var o3 = _2(n3), s3 = o3 ? o3.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg` : `http://www.w3.org/1999/xhtml`, c3 = o3 ? r3 ? `rect` : `g` : `div`, l3 = r3 === 2 ? 100 : 0, u3 = r3 === 3 ? 100 : 0, f3 = { position: `absolute`, display: `block`, pointerEvents: `none`, margin: `0`, padding: `0` }, p3 = e15.createElementNS ? e15.createElementNS(s3.replace(/^https/, `http`), c3) : e15.createElement(c3);
      return r3 && (o3 ? (a2 || (a2 = t3(n3)), p3.setAttribute(`width`, 0.01), p3.setAttribute(`height`, 0.01), p3.setAttribute(`transform`, `translate(` + l3 + `,` + u3 + `)`), p3.setAttribute(`fill`, `transparent`), a2.appendChild(p3)) : (i2 || (i2 = t3(n3), Object.assign(i2.style, f3)), Object.assign(p3.style, f3, { width: `0.1px`, height: `0.1px`, top: u3 + `px`, left: l3 + `px` }), i2.appendChild(p3))), p3;
    }
    throw `Need document and parent.`;
  };
  var b2 = function(e24) {
    for (var t4 = new w2(), n3 = 0; n3 < e24.numberOfItems; n3++) t4.multiply(e24.getItem(n3).matrix);
    return t4;
  };
  var x2 = function(e24) {
    var t4 = e24.getCTM(), n3;
    return t4 || (n3 = e24.style[c2], e24.style[c2] = `none`, e24.appendChild(s2), t4 = s2.getCTM(), e24.removeChild(s2), n3 ? e24.style[c2] = n3 : e24.style.removeProperty(c2.replace(/([A-Z])/g, `-$1`).toLowerCase())), t4 || o2.clone();
  };
  var S2 = function(e24, n3) {
    var r3 = _2(e24), s3 = e24 === r3, d3 = r3 ? p2 : m2, f3 = e24.parentNode, h3 = f3 && !r3 && f3.shadowRoot && f3.shadowRoot.appendChild ? f3.shadowRoot : f3, g3, v3, S3, C3, T3, ee3;
    if (e24 === t2) return e24;
    if (d3.length || d3.push(y2(e24, 1), y2(e24, 2), y2(e24, 3)), g3 = r3 ? a2 : i2, r3) s3 ? (S3 = x2(e24), C3 = -S3.e / S3.a, T3 = -S3.f / S3.d, v3 = o2) : e24.getBBox ? (S3 = e24.getBBox(), v3 = e24.transform ? e24.transform.baseVal : {}, v3 = v3.numberOfItems ? v3.numberOfItems > 1 ? b2(v3) : v3.getItem(0).matrix : o2, C3 = v3.a * S3.x + v3.c * S3.y, T3 = v3.b * S3.x + v3.d * S3.y) : (v3 = new w2(), C3 = T3 = 0), n3 && e24.tagName.toLowerCase() === `g` && (C3 = T3 = 0), (s3 || !e24.getBoundingClientRect().width ? r3 : f3).appendChild(g3), g3.setAttribute(`transform`, `matrix(` + v3.a + `,` + v3.b + `,` + v3.c + `,` + v3.d + `,` + (v3.e + C3) + `,` + (v3.f + T3) + `)`);
    else {
      if (C3 = T3 = 0, u2) for (v3 = e24.offsetParent, S3 = e24; S3 && (S3 = S3.parentNode) && S3 !== v3 && S3.parentNode; ) (t2.getComputedStyle(S3)[c2] + ``).length > 4 && (C3 = S3.offsetLeft, T3 = S3.offsetTop, S3 = 0);
      if (ee3 = t2.getComputedStyle(e24), ee3.position !== `absolute` && ee3.position !== `fixed`) for (v3 = e24.offsetParent; f3 && f3 !== v3; ) C3 += f3.scrollLeft || 0, T3 += f3.scrollTop || 0, f3 = f3.parentNode;
      S3 = g3.style, S3.top = e24.offsetTop - T3 + `px`, S3.left = e24.offsetLeft - C3 + `px`, S3[c2] = ee3[c2], S3[l2] = ee3[l2], S3.position = ee3.position === `fixed` ? `fixed` : `absolute`, h3.appendChild(g3);
    }
    return g3;
  };
  var C2 = function(e24, t4, n3, r3, i3, a3, o3) {
    return e24.a = t4, e24.b = n3, e24.c = r3, e24.d = i3, e24.e = a3, e24.f = o3, e24;
  };
  var w2 = (function() {
    function e24(e25, t5, n3, r3, i3, a3) {
      e25 === void 0 && (e25 = 1), t5 === void 0 && (t5 = 0), n3 === void 0 && (n3 = 0), r3 === void 0 && (r3 = 1), i3 === void 0 && (i3 = 0), a3 === void 0 && (a3 = 0), C2(this, e25, t5, n3, r3, i3, a3);
    }
    var t4 = e24.prototype;
    return t4.inverse = function() {
      var e25 = this.a, t5 = this.b, n3 = this.c, r3 = this.d, i3 = this.e, a3 = this.f, o3 = e25 * r3 - t5 * n3 || 1e-10;
      return C2(this, r3 / o3, -t5 / o3, -n3 / o3, e25 / o3, (n3 * a3 - r3 * i3) / o3, -(e25 * a3 - t5 * i3) / o3);
    }, t4.multiply = function(e25) {
      var t5 = this.a, n3 = this.b, r3 = this.c, i3 = this.d, a3 = this.e, o3 = this.f, s3 = e25.a, c3 = e25.c, l3 = e25.b, u3 = e25.d, d3 = e25.e, f3 = e25.f;
      return C2(this, s3 * t5 + l3 * r3, s3 * n3 + l3 * i3, c3 * t5 + u3 * r3, c3 * n3 + u3 * i3, a3 + d3 * t5 + f3 * r3, o3 + d3 * n3 + f3 * i3);
    }, t4.clone = function() {
      return new e24(this.a, this.b, this.c, this.d, this.e, this.f);
    }, t4.equals = function(e25) {
      var t5 = this.a, n3 = this.b, r3 = this.c, i3 = this.d, a3 = this.e, o3 = this.f;
      return t5 === e25.a && n3 === e25.b && r3 === e25.c && i3 === e25.d && a3 === e25.e && o3 === e25.f;
    }, t4.apply = function(e25, t5) {
      t5 === void 0 && (t5 = {});
      var n3 = e25.x, r3 = e25.y, i3 = this.a, a3 = this.b, o3 = this.c, s3 = this.d, c3 = this.e, l3 = this.f;
      return t5.x = n3 * i3 + r3 * o3 + c3 || 0, t5.y = n3 * a3 + r3 * s3 + l3 || 0, t5;
    }, e24;
  })();
  function T2(t4, n3, r3, i3) {
    if (!t4 || !t4.parentNode || (e15 || d2(t4)).documentElement === t4) return new w2();
    var a3 = f2(t4), o3 = _2(t4) ? p2 : m2, s3 = S2(t4, r3), c3 = o3[0].getBoundingClientRect(), l3 = o3[1].getBoundingClientRect(), u3 = o3[2].getBoundingClientRect(), y3 = s3.parentNode, b3 = !i3 && v2(t4), x3 = new w2((l3.left - c3.left) / 100, (l3.top - c3.top) / 100, (u3.left - c3.left) / 100, (u3.top - c3.top) / 100, c3.left + (b3 ? 0 : g2()), c3.top + (b3 ? 0 : h2()));
    if (y3.removeChild(s3), a3) for (c3 = a3.length; c3--; ) l3 = a3[c3], l3.scaleX = l3.scaleY = 0, l3.renderTransform(1, l3);
    return n3 ? x3.inverse() : x3;
  }
  function ee2(e24) {
    if (e24 === void 0) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return e24;
  }
  function E2(e24, t4) {
    e24.prototype = Object.create(t4.prototype), e24.prototype.constructor = e24, e24.__proto__ = t4;
  }
  var D2;
  var O2;
  var k2;
  var te2;
  var A2;
  var ne2;
  var re2;
  var ie2;
  var j2;
  var ae2;
  var oe2;
  var se2;
  var ce2;
  var le2;
  var ue2;
  var M2;
  var de2;
  var fe2;
  var pe2;
  var me2;
  var he2 = 0;
  var N2 = function() {
    return typeof window < `u`;
  };
  var P2 = function() {
    return D2 || N2() && (D2 = window.gsap) && D2.registerPlugin && D2;
  };
  var ge2 = function(e24) {
    return typeof e24 == `function`;
  };
  var _e2 = function(e24) {
    return typeof e24 == `object`;
  };
  var ve2 = function(e24) {
    return e24 === void 0;
  };
  var F2 = function() {
    return false;
  };
  var I2 = `transform`;
  var ye2 = `transformOrigin`;
  var L2 = function(e24) {
    return Math.round(e24 * 1e4) / 1e4;
  };
  var be2 = Array.isArray;
  var R2 = function(e24, t4) {
    var n3 = k2.createElementNS ? k2.createElementNS((t4 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e24) : k2.createElement(e24);
    return n3.style ? n3 : k2.createElement(e24);
  };
  var xe2 = 180 / Math.PI;
  var Se2 = 1e20;
  var Ce2 = new w2();
  var we2 = Date.now || function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
  var z2 = [];
  var Te2 = {};
  var Ee2 = 0;
  var De2 = /^(?:a|input|textarea|button|select)$/i;
  var Oe2 = 0;
  var ke2 = {};
  var Ae2 = {};
  var je2 = function(e24, t4) {
    var n3 = {}, r3;
    for (r3 in e24) n3[r3] = t4 ? e24[r3] * t4 : e24[r3];
    return n3;
  };
  var Me2 = function(e24, t4) {
    for (var n3 in t4) n3 in e24 || (e24[n3] = t4[n3]);
    return e24;
  };
  var Ne2 = function e17(t4, n3) {
    for (var r3 = t4.length, i3; r3--; ) n3 ? t4[r3].style.touchAction = n3 : t4[r3].style.removeProperty(`touch-action`), i3 = t4[r3].children, i3 && i3.length && e17(i3, n3);
  };
  var Pe2 = function() {
    return z2.forEach(function(e24) {
      return e24();
    });
  };
  var Fe2 = function(e24) {
    z2.push(e24), z2.length === 1 && D2.ticker.add(Pe2);
  };
  var B2 = function() {
    return !z2.length && D2.ticker.remove(Pe2);
  };
  var Ie2 = function(e24) {
    for (var t4 = z2.length; t4--; ) z2[t4] === e24 && z2.splice(t4, 1);
    D2.to(B2, { overwrite: true, delay: 15, duration: 0, onComplete: B2, data: `_draggable` });
  };
  var V2 = function(e24, t4) {
    for (var n3 in t4) n3 in e24 || (e24[n3] = t4[n3]);
    return e24;
  };
  var H2 = function(e24, t4, n3, r3) {
    if (e24.addEventListener) {
      var i3 = ce2[t4];
      r3 || (r3 = oe2 ? { passive: false } : null), e24.addEventListener(i3 || t4, n3, r3), i3 && t4 !== i3 && e24.addEventListener(t4, n3, r3);
    }
  };
  var U2 = function(e24, t4, n3, r3) {
    if (e24.removeEventListener) {
      var i3 = ce2[t4];
      e24.removeEventListener(i3 || t4, n3, r3), i3 && t4 !== i3 && e24.removeEventListener(t4, n3, r3);
    }
  };
  var W2 = function(e24) {
    e24.preventDefault && e24.preventDefault(), e24.preventManipulation && e24.preventManipulation();
  };
  var Le2 = function(e24, t4) {
    for (var n3 = e24.length; n3--; ) if (e24[n3].identifier === t4) return true;
  };
  var G2 = function e18(t4) {
    le2 = t4.touches && he2 < t4.touches.length, U2(t4.target, `touchend`, e18);
  };
  var Re2 = function(e24) {
    le2 = e24.touches && he2 < e24.touches.length, H2(e24.target, `touchend`, G2);
  };
  var ze2 = function(e24) {
    return O2.pageYOffset || e24.scrollTop || e24.documentElement.scrollTop || e24.body.scrollTop || 0;
  };
  var Be2 = function(e24) {
    return O2.pageXOffset || e24.scrollLeft || e24.documentElement.scrollLeft || e24.body.scrollLeft || 0;
  };
  var Ve2 = function e19(t4, n3) {
    H2(t4, `scroll`, n3), Ue2(t4.parentNode) || e19(t4.parentNode, n3);
  };
  var He2 = function e20(t4, n3) {
    U2(t4, `scroll`, n3), Ue2(t4.parentNode) || e20(t4.parentNode, n3);
  };
  var Ue2 = function(e24) {
    return !e24 || e24 === te2 || e24.nodeType === 9 || e24 === k2.body || e24 === O2 || !e24.nodeType || !e24.parentNode;
  };
  var K2 = function(e24, t4) {
    var n3 = t4 === `x` ? `Width` : `Height`, r3 = `scroll` + n3, i3 = `client` + n3;
    return Math.max(0, Ue2(e24) ? Math.max(te2[r3], A2[r3]) - (O2[`inner` + n3] || te2[i3] || A2[i3]) : e24[r3] - e24[i3]);
  };
  var We2 = function e21(t4, n3) {
    var r3 = K2(t4, `x`), i3 = K2(t4, `y`);
    Ue2(t4) ? t4 = Ae2 : e21(t4.parentNode, n3), t4._gsMaxScrollX = r3, t4._gsMaxScrollY = i3, n3 || (t4._gsScrollX = t4.scrollLeft || 0, t4._gsScrollY = t4.scrollTop || 0);
  };
  var Ge2 = function(e24, t4, n3) {
    var r3 = e24.style;
    r3 && (ve2(r3[t4]) && (t4 = j2(t4, e24) || t4), n3 == null ? r3.removeProperty && r3.removeProperty(t4.replace(/([A-Z])/g, `-$1`).toLowerCase()) : r3[t4] = n3);
  };
  var Ke2 = function(e24) {
    return O2.getComputedStyle(e24 instanceof Element ? e24 : e24.host || (e24.parentNode || {}).host || e24);
  };
  var qe2 = {};
  var Je2 = function(e24) {
    if (e24 === O2) return qe2.left = qe2.top = 0, qe2.width = qe2.right = te2.clientWidth || e24.innerWidth || A2.clientWidth || 0, qe2.height = qe2.bottom = (e24.innerHeight || 0) - 20 < te2.clientHeight ? te2.clientHeight : e24.innerHeight || A2.clientHeight || 0, qe2;
    var t4 = e24.ownerDocument || k2, n3 = ve2(e24.pageX) ? !e24.nodeType && !ve2(e24.left) && !ve2(e24.top) ? e24 : ae2(e24)[0].getBoundingClientRect() : { left: e24.pageX - Be2(t4), top: e24.pageY - ze2(t4), right: e24.pageX - Be2(t4) + 1, bottom: e24.pageY - ze2(t4) + 1 };
    return ve2(n3.right) && !ve2(n3.width) ? (n3.right = n3.left + n3.width, n3.bottom = n3.top + n3.height) : ve2(n3.width) && (n3 = { width: n3.right - n3.left, height: n3.bottom - n3.top, right: n3.right, left: n3.left, bottom: n3.bottom, top: n3.top }), n3;
  };
  var q2 = function(e24, t4, n3) {
    var r3 = e24.vars, i3 = r3[n3], a3 = e24._listeners[t4], o3;
    return ge2(i3) && (o3 = i3.apply(r3.callbackScope || e24, r3[n3 + `Params`] || [e24.pointerEvent])), a3 && e24.dispatchEvent(t4) === false && (o3 = false), o3;
  };
  var Ye2 = function(e24, t4) {
    var n3 = ae2(e24)[0], r3, i3, a3;
    return !n3.nodeType && n3 !== O2 ? ve2(e24.left) ? (i3 = e24.min || e24.minX || e24.minRotation || 0, r3 = e24.min || e24.minY || 0, { left: i3, top: r3, width: (e24.max || e24.maxX || e24.maxRotation || 0) - i3, height: (e24.max || e24.maxY || 0) - r3 }) : (a3 = { x: 0, y: 0 }, { left: e24.left - a3.x, top: e24.top - a3.y, width: e24.width, height: e24.height }) : Y2(n3, t4);
  };
  var J2 = {};
  var Y2 = function(e24, t4) {
    t4 = ae2(t4)[0];
    var n3 = e24.getBBox && e24.ownerSVGElement, r3 = e24.ownerDocument || k2, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3, m3, h3, g3;
    if (e24 === O2) o3 = ze2(r3), i3 = Be2(r3), a3 = i3 + (r3.documentElement.clientWidth || e24.innerWidth || r3.body.clientWidth || 0), s3 = o3 + ((e24.innerHeight || 0) - 20 < r3.documentElement.clientHeight ? r3.documentElement.clientHeight : e24.innerHeight || r3.body.clientHeight || 0);
    else if (t4 === O2 || ve2(t4)) return e24.getBoundingClientRect();
    else i3 = o3 = 0, n3 ? (p3 = e24.getBBox(), m3 = p3.width, h3 = p3.height) : (e24.viewBox && (p3 = e24.viewBox.baseVal) && (i3 = p3.x || 0, o3 = p3.y || 0, m3 = p3.width, h3 = p3.height), m3 || (g3 = Ke2(e24), p3 = g3.boxSizing === `border-box`, m3 = (parseFloat(g3.width) || e24.clientWidth || 0) + (p3 ? 0 : parseFloat(g3.borderLeftWidth) + parseFloat(g3.borderRightWidth)), h3 = (parseFloat(g3.height) || e24.clientHeight || 0) + (p3 ? 0 : parseFloat(g3.borderTopWidth) + parseFloat(g3.borderBottomWidth)))), a3 = m3, s3 = h3;
    return e24 === t4 ? { left: i3, top: o3, width: a3 - i3, height: s3 - o3 } : (c3 = T2(t4, true).multiply(T2(e24)), l3 = c3.apply({ x: i3, y: o3 }), u3 = c3.apply({ x: a3, y: o3 }), d3 = c3.apply({ x: a3, y: s3 }), f3 = c3.apply({ x: i3, y: s3 }), i3 = Math.min(l3.x, u3.x, d3.x, f3.x), o3 = Math.min(l3.y, u3.y, d3.y, f3.y), { left: i3, top: o3, width: Math.max(l3.x, u3.x, d3.x, f3.x) - i3, height: Math.max(l3.y, u3.y, d3.y, f3.y) - o3 });
  };
  var Xe2 = function(e24, t4, n3, r3, i3, a3) {
    var o3 = {}, s3, c3, l3;
    if (t4) if (i3 !== 1 && t4 instanceof Array) {
      if (o3.end = s3 = [], l3 = t4.length, _e2(t4[0])) for (c3 = 0; c3 < l3; c3++) s3[c3] = je2(t4[c3], i3);
      else for (c3 = 0; c3 < l3; c3++) s3[c3] = t4[c3] * i3;
      n3 += 1.1, r3 -= 1.1;
    } else ge2(t4) ? o3.end = function(n4) {
      var r4 = t4.call(e24, n4), a4, o4;
      if (i3 !== 1) if (_e2(r4)) {
        for (o4 in a4 = {}, r4) a4[o4] = r4[o4] * i3;
        r4 = a4;
      } else r4 *= i3;
      return r4;
    } : o3.end = t4;
    return (n3 || n3 === 0) && (o3.max = n3), (r3 || r3 === 0) && (o3.min = r3), a3 && (o3.velocity = 0), o3;
  };
  var Ze2 = function e22(t4) {
    var n3;
    return !t4 || !t4.getAttribute || t4 === A2 ? false : (n3 = t4.getAttribute(`data-clickable`)) === `true` || n3 !== `false` && (De2.test(t4.nodeName + ``) || t4.getAttribute(`contentEditable`) === `true`) ? true : e22(t4.parentNode);
  };
  var Qe2 = function(e24, t4) {
    for (var n3 = e24.length, r3; n3--; ) r3 = e24[n3], r3.ondragstart = r3.onselectstart = t4 ? null : F2, D2.set(r3, { lazy: true, userSelect: t4 ? `text` : `none` });
  };
  var $e2 = function e23(t4) {
    if (Ke2(t4).position === `fixed`) return true;
    if (t4 = t4.parentNode, t4 && t4.nodeType === 1) return e23(t4);
  };
  var et2;
  var X2;
  var tt2 = function(e24, t4) {
    e24 = D2.utils.toArray(e24)[0], t4 || (t4 = {});
    var n3 = document.createElement(`div`), r3 = n3.style, i3 = e24.firstChild, a3 = 0, o3 = 0, s3 = e24.scrollTop, c3 = e24.scrollLeft, l3 = e24.scrollWidth, u3 = e24.scrollHeight, d3 = 0, f3 = 0, p3 = 0, m3, h3, g3, _3, v3, y3;
    et2 && t4.force3D !== false ? (v3 = `translate3d(`, y3 = `px,0px)`) : I2 && (v3 = `translate(`, y3 = `px)`), this.scrollTop = function(e25, t5) {
      if (!arguments.length) return -this.top();
      this.top(-e25, t5);
    }, this.scrollLeft = function(e25, t5) {
      if (!arguments.length) return -this.left();
      this.left(-e25, t5);
    }, this.left = function(n4, i4) {
      if (!arguments.length) return -(e24.scrollLeft + o3);
      var s4 = e24.scrollLeft - c3, l4 = o3;
      if ((s4 > 2 || s4 < -2) && !i4) {
        c3 = e24.scrollLeft, D2.killTweensOf(this, { left: 1, scrollLeft: 1 }), this.left(-c3), t4.onKill && t4.onKill();
        return;
      }
      n4 = -n4, n4 < 0 ? (o3 = n4 - 0.5 | 0, n4 = 0) : n4 > f3 ? (o3 = n4 - f3 | 0, n4 = f3) : o3 = 0, (o3 || l4) && (this._skip || (r3[I2] = v3 + -o3 + `px,` + -a3 + y3), o3 + d3 >= 0 && (r3.paddingRight = o3 + d3 + `px`)), e24.scrollLeft = n4 | 0, c3 = e24.scrollLeft;
    }, this.top = function(n4, i4) {
      if (!arguments.length) return -(e24.scrollTop + a3);
      var c4 = e24.scrollTop - s3, l4 = a3;
      if ((c4 > 2 || c4 < -2) && !i4) {
        s3 = e24.scrollTop, D2.killTweensOf(this, { top: 1, scrollTop: 1 }), this.top(-s3), t4.onKill && t4.onKill();
        return;
      }
      n4 = -n4, n4 < 0 ? (a3 = n4 - 0.5 | 0, n4 = 0) : n4 > p3 ? (a3 = n4 - p3 | 0, n4 = p3) : a3 = 0, (a3 || l4) && (this._skip || (r3[I2] = v3 + -o3 + `px,` + -a3 + y3)), e24.scrollTop = n4 | 0, s3 = e24.scrollTop;
    }, this.maxScrollTop = function() {
      return p3;
    }, this.maxScrollLeft = function() {
      return f3;
    }, this.disable = function() {
      for (i3 = n3.firstChild; i3; ) _3 = i3.nextSibling, e24.appendChild(i3), i3 = _3;
      e24 === n3.parentNode && e24.removeChild(n3);
    }, this.enable = function() {
      if (i3 = e24.firstChild, i3 !== n3) {
        for (; i3; ) _3 = i3.nextSibling, n3.appendChild(i3), i3 = _3;
        e24.appendChild(n3), this.calibrate();
      }
    }, this.calibrate = function(t5) {
      var i4 = e24.clientWidth === m3, _4, v4, y4;
      s3 = e24.scrollTop, c3 = e24.scrollLeft, !(i4 && e24.clientHeight === h3 && n3.offsetHeight === g3 && l3 === e24.scrollWidth && u3 === e24.scrollHeight && !t5) && ((a3 || o3) && (v4 = this.left(), y4 = this.top(), this.left(-e24.scrollLeft), this.top(-e24.scrollTop)), _4 = Ke2(e24), (!i4 || t5) && (r3.display = `block`, r3.width = `auto`, r3.paddingRight = `0px`, d3 = Math.max(0, e24.scrollWidth - e24.clientWidth), d3 && (d3 += parseFloat(_4.paddingLeft) + (X2 ? parseFloat(_4.paddingRight) : 0))), r3.display = `inline-block`, r3.position = `relative`, r3.overflow = `visible`, r3.verticalAlign = `top`, r3.boxSizing = `content-box`, r3.width = `100%`, r3.paddingRight = d3 + `px`, X2 && (r3.paddingBottom = _4.paddingBottom), m3 = e24.clientWidth, h3 = e24.clientHeight, l3 = e24.scrollWidth, u3 = e24.scrollHeight, f3 = e24.scrollWidth - m3, p3 = e24.scrollHeight - h3, g3 = n3.offsetHeight, r3.display = `block`, (v4 || y4) && (this.left(v4), this.top(y4)));
    }, this.content = n3, this.element = e24, this._skip = false, this.enable();
  };
  var nt2 = function(e24) {
    if (N2() && document.body) {
      var t4 = window && window.navigator;
      O2 = window, k2 = document, te2 = k2.documentElement, A2 = k2.body, ne2 = R2(`div`), fe2 = !!window.PointerEvent, re2 = R2(`div`), re2.style.cssText = `visibility:hidden;height:1px;top:-1px;pointer-events:none;position:relative;clear:both;cursor:grab`, de2 = re2.style.cursor === `grab` ? `grab` : `move`, ue2 = t4 && t4.userAgent.toLowerCase().indexOf(`android`) !== -1, se2 = `ontouchstart` in te2 && `orientation` in O2 || t4 && (t4.MaxTouchPoints > 0 || t4.msMaxTouchPoints > 0), X2 = (function() {
        var e25 = R2(`div`), t5 = R2(`div`), n3 = t5.style, r3 = A2, i3;
        return n3.display = `inline-block`, n3.position = `relative`, e25.style.cssText = `width:90px;height:40px;padding:10px;overflow:auto;visibility:hidden`, e25.appendChild(t5), r3.appendChild(e25), i3 = t5.offsetHeight + 18 > e25.scrollHeight, r3.removeChild(e25), i3;
      })(), ce2 = (function(e25) {
        for (var t5 = e25.split(`,`), n3 = (`onpointerdown` in ne2 ? `pointerdown,pointermove,pointerup,pointercancel` : `onmspointerdown` in ne2 ? `MSPointerDown,MSPointerMove,MSPointerUp,MSPointerCancel` : e25).split(`,`), r3 = {}, i3 = 4; --i3 > -1; ) r3[t5[i3]] = n3[i3], r3[n3[i3]] = t5[i3];
        try {
          te2.addEventListener(`test`, null, Object.defineProperty({}, "passive", { get: function() {
            oe2 = 1;
          } }));
        } catch {
        }
        return r3;
      })(`touchstart,touchmove,touchend,touchcancel`), H2(k2, `touchcancel`, F2), H2(O2, `touchmove`, F2), A2 && A2.addEventListener(`touchstart`, F2), H2(k2, `contextmenu`, function() {
        for (var e25 in Te2) Te2[e25].isPressed && Te2[e25].endDrag();
      }), D2 = ie2 = P2();
    }
    D2 ? (M2 = D2.plugins.inertia, pe2 = D2.core.context || function() {
    }, j2 = D2.utils.checkPrefix, I2 = j2(I2), ye2 = j2(ye2), ae2 = D2.utils.toArray, me2 = D2.core.getStyleSaver, et2 = !!j2(`perspective`)) : e24 && console.warn(`Please gsap.registerPlugin(Draggable)`);
  };
  var rt2 = (function(e24) {
    E2(t4, e24);
    function t4(n3, r3) {
      var i3 = e24.call(this) || this;
      ie2 || nt2(1), n3 = ae2(n3)[0], i3.styles = me2 && me2(n3, `transform,left,top`), M2 || (M2 = D2.plugins.inertia), i3.vars = r3 = je2(r3 || {}), i3.target = n3, i3.x = i3.y = i3.rotation = 0, i3.dragResistance = parseFloat(r3.dragResistance) || 0, i3.edgeResistance = isNaN(r3.edgeResistance) ? 1 : parseFloat(r3.edgeResistance) || 0, i3.lockAxis = r3.lockAxis, i3.autoScroll = r3.autoScroll || 0, i3.lockedAxis = null, i3.allowEventDefault = !!r3.allowEventDefault, D2.getProperty(n3, `x`);
      var a3 = (r3.type || `x,y`).toLowerCase(), o3 = ~a3.indexOf(`x`) || ~a3.indexOf(`y`), s3 = a3.indexOf(`rotation`) !== -1, c3 = s3 ? `rotation` : o3 ? `x` : `left`, l3 = o3 ? `y` : `top`, u3 = !!(~a3.indexOf(`x`) || ~a3.indexOf(`left`) || a3 === `scroll`), d3 = !!(~a3.indexOf(`y`) || ~a3.indexOf(`top`) || a3 === `scroll`), f3 = r3.minimumMovement || 2, p3 = ee2(i3), m3 = ae2(r3.trigger || r3.handle || n3), h3 = {}, g3 = 0, _3 = false, v3 = r3.autoScrollMarginTop || 40, y3 = r3.autoScrollMarginRight || 40, b3 = r3.autoScrollMarginBottom || 40, x3 = r3.autoScrollMarginLeft || 40, S3 = r3.clickableTest || Ze2, C3 = 0, E3 = n3._gsap || D2.core.getCache(n3), A3 = $e2(n3), ne3 = function(e25, t5) {
        return parseFloat(E3.get(n3, e25, t5));
      }, j3 = n3.ownerDocument || k2, oe3, N3, P3, F3, I3, R3, z3, De3, Pe3, B3, V3, G3, K3, qe3, Y3, et3, X3, rt3, it2, at2, ot2, st2, Z2, Q2, ct2, $2, lt2, ut2, dt2, ft2, pt2, mt2, ht2, gt2 = function(e25) {
        return W2(e25), e25.stopImmediatePropagation && e25.stopImmediatePropagation(), false;
      }, _t2 = function e25(t5) {
        if (p3.autoScroll && p3.isDragging && (_3 || X3)) {
          var r4 = n3, i4 = p3.autoScroll * 15, a4, c4, l4, f4, m4, h4, g4, S4;
          for (_3 = false, Ae2.scrollTop = O2.pageYOffset == null ? j3.documentElement.scrollTop == null ? j3.body.scrollTop : j3.documentElement.scrollTop : O2.pageYOffset, Ae2.scrollLeft = O2.pageXOffset == null ? j3.documentElement.scrollLeft == null ? j3.body.scrollLeft : j3.documentElement.scrollLeft : O2.pageXOffset, f4 = p3.pointerX - Ae2.scrollLeft, m4 = p3.pointerY - Ae2.scrollTop; r4 && !c4; ) c4 = Ue2(r4.parentNode), a4 = c4 ? Ae2 : r4.parentNode, l4 = c4 ? { bottom: Math.max(te2.clientHeight, O2.innerHeight || 0), right: Math.max(te2.clientWidth, O2.innerWidth || 0), left: 0, top: 0 } : a4.getBoundingClientRect(), h4 = g4 = 0, d3 && (S4 = a4._gsMaxScrollY - a4.scrollTop, S4 < 0 ? g4 = S4 : m4 > l4.bottom - b3 && S4 ? (_3 = true, g4 = Math.min(S4, i4 * (1 - Math.max(0, l4.bottom - m4) / b3) | 0)) : m4 < l4.top + v3 && a4.scrollTop && (_3 = true, g4 = -Math.min(a4.scrollTop, i4 * (1 - Math.max(0, m4 - l4.top) / v3) | 0)), g4 && (a4.scrollTop += g4)), u3 && (S4 = a4._gsMaxScrollX - a4.scrollLeft, S4 < 0 ? h4 = S4 : f4 > l4.right - y3 && S4 ? (_3 = true, h4 = Math.min(S4, i4 * (1 - Math.max(0, l4.right - f4) / y3) | 0)) : f4 < l4.left + x3 && a4.scrollLeft && (_3 = true, h4 = -Math.min(a4.scrollLeft, i4 * (1 - Math.max(0, f4 - l4.left) / x3) | 0)), h4 && (a4.scrollLeft += h4)), c4 && (h4 || g4) && (O2.scrollTo(a4.scrollLeft, a4.scrollTop), jt2(p3.pointerX + h4, p3.pointerY + g4)), r4 = a4;
        }
        if (X3) {
          var C4 = p3.x, w3 = p3.y;
          s3 ? (p3.deltaX = C4 - parseFloat(E3.rotation), p3.rotation = C4, E3.rotation = C4 + `deg`, E3.renderTransform(1, E3)) : N3 ? (d3 && (p3.deltaY = w3 - N3.top(), N3.top(w3)), u3 && (p3.deltaX = C4 - N3.left(), N3.left(C4))) : o3 ? (d3 && (p3.deltaY = w3 - parseFloat(E3.y), E3.y = w3 + `px`), u3 && (p3.deltaX = C4 - parseFloat(E3.x), E3.x = C4 + `px`), E3.renderTransform(1, E3)) : (d3 && (p3.deltaY = w3 - parseFloat(n3.style.top || 0), n3.style.top = w3 + `px`), u3 && (p3.deltaX = C4 - parseFloat(n3.style.left || 0), n3.style.left = C4 + `px`)), De3 && !t5 && !ut2 && (ut2 = true, q2(p3, `drag`, `onDrag`) === false && (u3 && (p3.x -= p3.deltaX), d3 && (p3.y -= p3.deltaY), e25(true)), ut2 = false);
        }
        X3 = false;
      }, vt2 = function(e25, t5) {
        var r4 = p3.x, i4 = p3.y, a4, c4;
        n3._gsap || (E3 = D2.core.getCache(n3)), E3.uncache && D2.getProperty(n3, `x`), o3 ? (p3.x = parseFloat(E3.x), p3.y = parseFloat(E3.y)) : s3 ? p3.x = p3.rotation = L2(parseFloat(E3.rotation)) : N3 ? (p3.y = N3.top(), p3.x = N3.left()) : (p3.y = parseFloat(n3.style.top || (c4 = Ke2(n3)) && c4.top) || 0, p3.x = parseFloat(n3.style.left || (c4 || {}).left) || 0), (it2 || at2 || ot2) && !t5 && (p3.isDragging || p3.isThrowing) && (ot2 && (ke2.x = p3.x, ke2.y = p3.y, a4 = ot2(ke2), a4.x !== p3.x && (p3.x = a4.x, X3 = true), a4.y !== p3.y && (p3.y = a4.y, X3 = true)), it2 && (a4 = it2(p3.x), a4 !== p3.x && (p3.x = a4, s3 && (p3.rotation = a4), X3 = true)), at2 && (a4 = at2(p3.y), a4 !== p3.y && (p3.y = a4), X3 = true)), X3 && _t2(true), e25 || (p3.deltaX = p3.x - r4, p3.deltaY = p3.y - i4, q2(p3, `throwupdate`, `onThrowUpdate`));
      }, yt2 = function(e25, t5, n4, r4) {
        return t5 ?? (t5 = -Se2), n4 ?? (n4 = Se2), ge2(e25) ? function(i4) {
          var a4 = p3.isPressed ? 1 - p3.edgeResistance : 1;
          return e25.call(p3, (i4 > n4 ? n4 + (i4 - n4) * a4 : i4 < t5 ? t5 + (i4 - t5) * a4 : i4) * r4) * r4;
        } : be2(e25) ? function(r5) {
          for (var i4 = e25.length, a4 = 0, o4 = Se2, s4, c4; --i4 > -1; ) s4 = e25[i4], c4 = s4 - r5, c4 < 0 && (c4 = -c4), c4 < o4 && s4 >= t5 && s4 <= n4 && (a4 = i4, o4 = c4);
          return e25[a4];
        } : isNaN(e25) ? function(e26) {
          return e26;
        } : function() {
          return e25 * r4;
        };
      }, bt2 = function(e25, t5, n4, r4, i4, a4, o4) {
        return a4 = a4 && a4 < Se2 ? a4 * a4 : Se2, ge2(e25) ? function(s4) {
          var c4 = p3.isPressed ? 1 - p3.edgeResistance : 1, l4 = s4.x, u4 = s4.y, d4, f4, m4;
          return s4.x = l4 = l4 > n4 ? n4 + (l4 - n4) * c4 : l4 < t5 ? t5 + (l4 - t5) * c4 : l4, s4.y = u4 = u4 > i4 ? i4 + (u4 - i4) * c4 : u4 < r4 ? r4 + (u4 - r4) * c4 : u4, d4 = e25.call(p3, s4), d4 !== s4 && (s4.x = d4.x, s4.y = d4.y), o4 !== 1 && (s4.x *= o4, s4.y *= o4), a4 < Se2 && (f4 = s4.x - l4, m4 = s4.y - u4, f4 * f4 + m4 * m4 > a4 && (s4.x = l4, s4.y = u4)), s4;
        } : be2(e25) ? function(t6) {
          for (var n5 = e25.length, r5 = 0, i5 = Se2, o5, s4, c4, l4; --n5 > -1; ) c4 = e25[n5], o5 = c4.x - t6.x, s4 = c4.y - t6.y, l4 = o5 * o5 + s4 * s4, l4 < i5 && (r5 = n5, i5 = l4);
          return i5 <= a4 ? e25[r5] : t6;
        } : function(e26) {
          return e26;
        };
      }, xt2 = function() {
        var e25, t5, i4, a4;
        z3 = false, N3 ? (N3.calibrate(), p3.minX = V3 = -N3.maxScrollLeft(), p3.minY = K3 = -N3.maxScrollTop(), p3.maxX = B3 = p3.maxY = G3 = 0, z3 = true) : r3.bounds && (e25 = Ye2(r3.bounds, n3.parentNode), s3 ? (p3.minX = V3 = e25.left, p3.maxX = B3 = e25.left + e25.width, p3.minY = K3 = p3.maxY = G3 = 0) : !ve2(r3.bounds.maxX) || !ve2(r3.bounds.maxY) ? (e25 = r3.bounds, p3.minX = V3 = e25.minX, p3.minY = K3 = e25.minY, p3.maxX = B3 = e25.maxX, p3.maxY = G3 = e25.maxY) : (t5 = Ye2(n3, n3.parentNode), p3.minX = V3 = Math.round(ne3(c3, `px`) + e25.left - t5.left), p3.minY = K3 = Math.round(ne3(l3, `px`) + e25.top - t5.top), p3.maxX = B3 = Math.round(V3 + (e25.width - t5.width)), p3.maxY = G3 = Math.round(K3 + (e25.height - t5.height))), V3 > B3 && (p3.minX = B3, p3.maxX = B3 = V3, V3 = p3.minX), K3 > G3 && (p3.minY = G3, p3.maxY = G3 = K3, K3 = p3.minY), s3 && (p3.minRotation = V3, p3.maxRotation = B3), z3 = true), r3.liveSnap && (i4 = r3.liveSnap === true ? r3.snap || {} : r3.liveSnap, a4 = be2(i4) || ge2(i4), s3 ? (it2 = yt2(a4 ? i4 : i4.rotation, V3, B3, 1), at2 = null) : i4.points ? ot2 = bt2(a4 ? i4 : i4.points, V3, B3, K3, G3, i4.radius, N3 ? -1 : 1) : (u3 && (it2 = yt2(a4 ? i4 : i4.x || i4.left || i4.scrollLeft, V3, B3, N3 ? -1 : 1)), d3 && (at2 = yt2(a4 ? i4 : i4.y || i4.top || i4.scrollTop, K3, G3, N3 ? -1 : 1))));
      }, St2 = function() {
        p3.isThrowing = false, q2(p3, `throwcomplete`, `onThrowComplete`);
      }, Ct2 = function() {
        p3.isThrowing = false;
      }, wt2 = function(e25, t5) {
        var i4, a4, o4, f4;
        e25 && M2 ? (e25 === true && (i4 = r3.snap || r3.liveSnap || {}, a4 = be2(i4) || ge2(i4), e25 = { resistance: (r3.throwResistance || r3.resistance || 1e3) / (s3 ? 10 : 1) }, s3 ? e25.rotation = Xe2(p3, a4 ? i4 : i4.rotation, B3, V3, 1, t5) : (u3 && (e25[c3] = Xe2(p3, a4 ? i4 : i4.points || i4.x || i4.left, B3, V3, N3 ? -1 : 1, t5 || p3.lockedAxis === `x`)), d3 && (e25[l3] = Xe2(p3, a4 ? i4 : i4.points || i4.y || i4.top, G3, K3, N3 ? -1 : 1, t5 || p3.lockedAxis === `y`)), (i4.points || be2(i4) && _e2(i4[0])) && (e25.linkedProps = c3 + `,` + l3, e25.radius = i4.radius))), p3.isThrowing = true, f4 = isNaN(r3.overshootTolerance) ? r3.edgeResistance === 1 ? 0 : 1 - p3.edgeResistance + 0.2 : r3.overshootTolerance, e25.duration || (e25.duration = { max: Math.max(r3.minDuration || 0, `maxDuration` in r3 ? r3.maxDuration : 2), min: isNaN(r3.minDuration) ? f4 === 0 || _e2(e25) && e25.resistance > 1e3 ? 0 : 0.5 : r3.minDuration, overshoot: f4 }), p3.tween = o4 = D2.to(N3 || n3, { inertia: e25, data: `_draggable`, inherit: false, onComplete: St2, onInterrupt: Ct2, onUpdate: r3.fastMode ? q2 : vt2, onUpdateParams: r3.fastMode ? [p3, `onthrowupdate`, `onThrowUpdate`] : i4 && i4.radius ? [false, true] : [] }), r3.fastMode || (N3 && (N3._skip = true), o4.render(1e9, true, true), vt2(true, true), p3.endX = p3.x, p3.endY = p3.y, s3 && (p3.endRotation = p3.x), o4.play(0), vt2(true, true), N3 && (N3._skip = false))) : z3 && p3.applyBounds();
      }, Tt2 = function(e25) {
        var t5 = Q2, r4;
        Q2 = T2(n3.parentNode, true), e25 && p3.isPressed && !Q2.equals(t5 || new w2()) && (r4 = t5.inverse().apply({ x: P3, y: F3 }), Q2.apply(r4, r4), P3 = r4.x, F3 = r4.y), Q2.equals(Ce2) && (Q2 = null);
      }, Et2 = function() {
        var e25 = 1 - p3.edgeResistance, t5 = A3 ? Be2(j3) : 0, r4 = A3 ? ze2(j3) : 0, i4, a4, u4;
        o3 && (E3.x = ne3(c3, `px`) + `px`, E3.y = ne3(l3, `px`) + `px`, E3.renderTransform()), Tt2(false), J2.x = p3.pointerX - t5, J2.y = p3.pointerY - r4, Q2 && Q2.apply(J2, J2), P3 = J2.x, F3 = J2.y, X3 && (jt2(p3.pointerX, p3.pointerY), _t2(true)), mt2 = T2(n3), N3 ? (xt2(), R3 = N3.top(), I3 = N3.left()) : (Dt2() ? (vt2(true, true), xt2()) : p3.applyBounds(), s3 ? (i4 = n3.ownerSVGElement ? [E3.xOrigin - n3.getBBox().x, E3.yOrigin - n3.getBBox().y] : (Ke2(n3)[ye2] || `0 0`).split(` `), et3 = p3.rotationOrigin = T2(n3).apply({ x: parseFloat(i4[0]) || 0, y: parseFloat(i4[1]) || 0 }), vt2(true, true), a4 = p3.pointerX - et3.x - t5, u4 = et3.y - p3.pointerY + r4, I3 = p3.x, R3 = p3.y = Math.atan2(u4, a4) * xe2) : (R3 = ne3(l3, `px`), I3 = ne3(c3, `px`))), z3 && e25 && (I3 > B3 ? I3 = B3 + (I3 - B3) / e25 : I3 < V3 && (I3 = V3 - (V3 - I3) / e25), s3 || (R3 > G3 ? R3 = G3 + (R3 - G3) / e25 : R3 < K3 && (R3 = K3 - (K3 - R3) / e25))), p3.startX = I3 = L2(I3), p3.startY = R3 = L2(R3);
      }, Dt2 = function() {
        return p3.tween && p3.tween.isActive();
      }, Ot2 = function() {
        re2.parentNode && !Dt2() && !p3.isDragging && re2.parentNode.removeChild(re2);
      }, kt2 = function(e25, i4) {
        var a4;
        if (!oe3 || p3.isPressed || !e25 || (e25.type === `mousedown` || e25.type === `pointerdown`) && !i4 && we2() - C3 < 30 && ce2[p3.pointerEvent.type]) {
          pt2 && e25 && oe3 && W2(e25);
          return;
        }
        if (ct2 = Dt2(), ht2 = false, p3.pointerEvent = e25, ce2[e25.type] ? (Z2 = ~e25.type.indexOf(`touch`) ? e25.currentTarget || e25.target : j3, H2(Z2, `touchend`, Mt2), H2(Z2, `touchmove`, At2), H2(Z2, `touchcancel`, Mt2), H2(j3, `touchstart`, Re2)) : (Z2 = null, H2(j3, `mousemove`, At2)), lt2 = null, (!fe2 || !Z2) && (H2(j3, `mouseup`, Mt2), e25 && e25.target && H2(e25.target, `mouseup`, Mt2)), st2 = S3.call(p3, e25.target) && r3.dragClickables === false && !i4, st2) {
          H2(e25.target, `change`, Mt2), q2(p3, `pressInit`, `onPressInit`), q2(p3, `press`, `onPress`), Qe2(m3, true), pt2 = false;
          return;
        }
        if ($2 = !Z2 || u3 === d3 || p3.vars.allowNativeTouchScrolling === false || p3.vars.allowContextMenu && e25 && (e25.ctrlKey || e25.which > 2) ? false : u3 ? `y` : `x`, pt2 = !$2 && !p3.allowEventDefault, pt2 && (W2(e25), H2(O2, `touchforcechange`, W2)), e25.changedTouches ? (e25 = qe3 = e25.changedTouches[0], Y3 = e25.identifier) : e25.pointerId ? Y3 = e25.pointerId : qe3 = Y3 = null, he2++, Fe2(_t2), F3 = p3.pointerY = e25.pageY, P3 = p3.pointerX = e25.pageX, q2(p3, `pressInit`, `onPressInit`), ($2 || p3.autoScroll) && We2(n3.parentNode), n3.parentNode && p3.autoScroll && !N3 && !s3 && n3.parentNode._gsMaxScrollX && !re2.parentNode && !n3.getBBox && (re2.style.width = n3.parentNode.scrollWidth + `px`, n3.parentNode.appendChild(re2)), Et2(), p3.tween && p3.tween.kill(), p3.isThrowing = false, D2.killTweensOf(N3 || n3, h3, true), N3 && D2.killTweensOf(n3, { scrollTo: 1 }, true), p3.tween = p3.lockedAxis = null, (r3.zIndexBoost || !s3 && !N3 && r3.zIndexBoost !== false) && (n3.style.zIndex = t4.zIndex++), p3.isPressed = true, De3 = !!(r3.onDrag || p3._listeners.drag), Pe3 = !!(r3.onMove || p3._listeners.move), r3.cursor !== false || r3.activeCursor) for (a4 = m3.length; --a4 > -1; ) D2.set(m3[a4], { cursor: r3.activeCursor || r3.cursor || (de2 === `grab` ? `grabbing` : de2) });
        q2(p3, `press`, `onPress`), M2 && M2.track(N3 || n3, o3 ? `x,y` : s3 ? `rotation` : `top,left`);
      }, At2 = function(e25) {
        var t5 = e25, r4, i4, a4, o4, s4, c4;
        if (!oe3 || le2 || !p3.isPressed || !e25) {
          pt2 && e25 && oe3 && W2(e25);
          return;
        }
        if (p3.pointerEvent = e25, r4 = e25.changedTouches, r4) {
          if (e25 = r4[0], e25 !== qe3 && e25.identifier !== Y3) {
            for (o4 = r4.length; --o4 > -1 && (e25 = r4[o4]).identifier !== Y3 && e25.target !== n3; ) ;
            if (o4 < 0) return;
          }
        } else if (e25.pointerId && Y3 && e25.pointerId !== Y3) return;
        if (Z2 && $2 && !lt2 && (J2.x = e25.pageX - (A3 ? Be2(j3) : 0), J2.y = e25.pageY - (A3 ? ze2(j3) : 0), Q2 && Q2.apply(J2, J2), i4 = J2.x, a4 = J2.y, s4 = Math.abs(i4 - P3), c4 = Math.abs(a4 - F3), (s4 !== c4 && (s4 > f3 || c4 > f3) || ue2 && $2 === lt2) && (lt2 = s4 > c4 && u3 ? `x` : `y`, $2 && lt2 !== $2 && H2(O2, `touchforcechange`, W2), p3.vars.lockAxisOnTouchScroll !== false && u3 && d3 && (p3.lockedAxis = lt2 === `x` ? `y` : `x`, ge2(p3.vars.onLockAxis) && p3.vars.onLockAxis.call(p3, t5)), ue2 && $2 === lt2))) {
          Mt2(t5);
          return;
        }
        !p3.allowEventDefault && (!$2 || lt2 && $2 !== lt2) && t5.cancelable !== false ? (W2(t5), pt2 = true) : pt2 && (pt2 = false), p3.autoScroll && (_3 = true), jt2(e25.pageX, e25.pageY, Pe3);
      }, jt2 = function(e25, t5, n4) {
        var r4 = 1 - p3.dragResistance, i4 = 1 - p3.edgeResistance, a4 = p3.pointerX, o4 = p3.pointerY, c4 = R3, l4 = p3.x, m4 = p3.y, h4 = p3.endX, g4 = p3.endY, _4 = p3.endRotation, v4 = X3, y4, b4, x4, S4, C4, w3;
        p3.pointerX = e25, p3.pointerY = t5, A3 && (e25 -= Be2(j3), t5 -= ze2(j3)), s3 ? (S4 = L2(Math.atan2(et3.y - t5, e25 - et3.x) * xe2), C4 = p3.y - S4, C4 > 180 ? (R3 -= 360, p3.y = S4) : C4 < -180 && (R3 += 360, p3.y = S4), Q2 && (w3 = e25 * Q2.a + t5 * Q2.c + Q2.e, t5 = e25 * Q2.b + t5 * Q2.d + Q2.f, e25 = w3), p3.x !== I3 || Math.max(Math.abs(P3 - e25), Math.abs(F3 - t5)) > f3 ? (p3.y = S4, x4 = L2(I3 + (R3 - S4) * r4)) : x4 = I3) : (Q2 && (w3 = e25 * Q2.a + t5 * Q2.c + Q2.e, t5 = e25 * Q2.b + t5 * Q2.d + Q2.f, e25 = w3), b4 = t5 - F3, y4 = e25 - P3, b4 < f3 && b4 > -f3 && (b4 = 0), y4 < f3 && y4 > -f3 && (y4 = 0), (p3.lockAxis || p3.lockedAxis) && (y4 || b4) && (w3 = p3.lockedAxis, w3 || (p3.lockedAxis = w3 = u3 && Math.abs(y4) > Math.abs(b4) ? `y` : d3 ? `x` : null, w3 && ge2(p3.vars.onLockAxis) && p3.vars.onLockAxis.call(p3, p3.pointerEvent)), w3 === `y` ? b4 = 0 : w3 === `x` && (y4 = 0)), x4 = L2(I3 + y4 * r4), S4 = L2(R3 + b4 * r4)), (it2 || at2 || ot2) && (p3.x !== x4 || p3.y !== S4 && !s3) && (ot2 && (ke2.x = x4, ke2.y = S4, w3 = ot2(ke2), x4 = L2(w3.x), S4 = L2(w3.y)), it2 && (x4 = L2(it2(x4))), at2 && (S4 = L2(at2(S4)))), z3 && (x4 > B3 ? x4 = B3 + Math.round((x4 - B3) * i4) : x4 < V3 && (x4 = V3 + Math.round((x4 - V3) * i4)), s3 || (S4 > G3 ? S4 = Math.round(G3 + (S4 - G3) * i4) : S4 < K3 && (S4 = Math.round(K3 + (S4 - K3) * i4)))), (p3.x !== x4 || p3.y !== S4 && !s3) && (s3 ? (p3.endRotation = p3.x = p3.endX = L2(x4), X3 = true) : (d3 && (p3.y = p3.endY = S4, X3 = true), u3 && (p3.x = p3.endX = x4, X3 = true)), !n4 || q2(p3, `move`, `onMove`) !== false ? !p3.isDragging && p3.isPressed && (p3.isDragging = ht2 = true, q2(p3, `dragstart`, `onDragStart`)) : (p3.pointerX = a4, p3.pointerY = o4, R3 = c4, p3.x = l4, p3.y = m4, p3.endX = h4, p3.endY = g4, p3.endRotation = _4, X3 = v4));
      }, Mt2 = function e25(t5, i4) {
        if (!oe3 || !p3.isPressed || t5 && Y3 != null && !i4 && (t5.pointerId && t5.pointerId !== Y3 && t5.target !== n3 || t5.changedTouches && !Le2(t5.changedTouches, Y3))) {
          pt2 && t5 && oe3 && W2(t5);
          return;
        }
        p3.isPressed = false;
        var a4 = t5, o4 = p3.isDragging, s4 = p3.vars.allowContextMenu && t5 && (t5.ctrlKey || t5.which > 2), c4 = D2.delayedCall(1e-3, Ot2), l4, u4, d4, f4, h4;
        if (Z2 ? (U2(Z2, `touchend`, e25), U2(Z2, `touchmove`, At2), U2(Z2, `touchcancel`, e25), U2(j3, `touchstart`, Re2)) : U2(j3, `mousemove`, At2), U2(O2, `touchforcechange`, W2), (!fe2 || !Z2) && (U2(j3, `mouseup`, e25), t5 && t5.target && U2(t5.target, `mouseup`, e25)), X3 = false, o4 && (g3 = Oe2 = we2(), p3.isDragging = false), Ie2(_t2), st2 && !s4) {
          t5 && (U2(t5.target, `change`, e25), p3.pointerEvent = a4), Qe2(m3, false), q2(p3, `release`, `onRelease`), q2(p3, `click`, `onClick`), st2 = false;
          return;
        }
        for (u4 = m3.length; --u4 > -1; ) Ge2(m3[u4], `cursor`, r3.cursor || (r3.cursor === false ? null : de2));
        if (he2--, t5) {
          if (l4 = t5.changedTouches, l4 && (t5 = l4[0], t5 !== qe3 && t5.identifier !== Y3)) {
            for (u4 = l4.length; --u4 > -1 && (t5 = l4[u4]).identifier !== Y3 && t5.target !== n3; ) ;
            if (u4 < 0 && !i4) return;
          }
          p3.pointerEvent = a4, p3.pointerX = t5.pageX, p3.pointerY = t5.pageY;
        }
        return s4 && a4 ? (W2(a4), pt2 = true, q2(p3, `release`, `onRelease`)) : a4 && !o4 ? (pt2 = false, ct2 && (r3.snap || r3.bounds) && wt2(r3.inertia || r3.throwProps), q2(p3, `release`, `onRelease`), (!ue2 || a4.type !== `touchmove`) && a4.type.indexOf(`cancel`) === -1 && (q2(p3, `click`, `onClick`), we2() - C3 < 300 && q2(p3, `doubleclick`, `onDoubleClick`), f4 = a4.target || n3, C3 = we2(), h4 = function() {
          C3 !== dt2 && p3.enabled() && !p3.isPressed && !a4.defaultPrevented && (f4.click ? f4.click() : j3.createEvent && (d4 = j3.createEvent(`MouseEvents`), d4.initMouseEvent(`click`, true, true, O2, 1, p3.pointerEvent.screenX, p3.pointerEvent.screenY, p3.pointerX, p3.pointerY, false, false, false, false, 0, null), f4.dispatchEvent(d4)));
        }, !ue2 && !a4.defaultPrevented && D2.delayedCall(0.05, h4))) : (wt2(r3.inertia || r3.throwProps), !p3.allowEventDefault && a4 && (r3.dragClickables !== false || !S3.call(p3, a4.target)) && o4 && (!$2 || lt2 && $2 === lt2) && a4.cancelable !== false ? (pt2 = true, W2(a4)) : pt2 = false, q2(p3, `release`, `onRelease`)), Dt2() && c4.duration(p3.tween.duration()), o4 && q2(p3, `dragend`, `onDragEnd`), true;
      }, Nt2 = function(e25) {
        if (e25 && p3.isDragging && !N3) {
          var t5 = e25.target || n3.parentNode, r4 = t5.scrollLeft - t5._gsScrollX, i4 = t5.scrollTop - t5._gsScrollY;
          (r4 || i4) && (Q2 ? (P3 -= r4 * Q2.a + i4 * Q2.c, F3 -= i4 * Q2.d + r4 * Q2.b) : (P3 -= r4, F3 -= i4), t5._gsScrollX += r4, t5._gsScrollY += i4, jt2(p3.pointerX, p3.pointerY));
        }
      }, Pt2 = function(e25) {
        var t5 = we2(), n4 = t5 - C3 < 100, r4 = t5 - g3 < 50, i4 = n4 && dt2 === C3, a4 = p3.pointerEvent && p3.pointerEvent.defaultPrevented, o4 = n4 && ft2 === C3, s4 = e25.isTrusted || e25.isTrusted == null && n4 && i4;
        if ((i4 || r4 && p3.vars.suppressClickOnDrag !== false) && e25.stopImmediatePropagation && e25.stopImmediatePropagation(), n4 && !(p3.pointerEvent && p3.pointerEvent.defaultPrevented) && (!i4 || s4 && !o4)) {
          s4 && i4 && (ft2 = C3), dt2 = C3;
          return;
        }
        (p3.isPressed || r4 || n4) && (!s4 || !e25.detail || !n4 || a4) && W2(e25), !n4 && !r4 && !ht2 && (e25 && e25.target && (p3.pointerEvent = e25), q2(p3, `click`, `onClick`));
      }, Ft2 = function(e25) {
        return Q2 ? { x: e25.x * Q2.a + e25.y * Q2.c + Q2.e, y: e25.x * Q2.b + e25.y * Q2.d + Q2.f } : { x: e25.x, y: e25.y };
      };
      return rt3 = t4.get(n3), rt3 && rt3.kill(), i3.startDrag = function(e25, t5) {
        var r4, i4, a4, o4;
        kt2(e25 || p3.pointerEvent, true), t5 && !p3.hitTest(e25 || p3.pointerEvent) && (r4 = Je2(e25 || p3.pointerEvent), i4 = Je2(n3), a4 = Ft2({ x: r4.left + r4.width / 2, y: r4.top + r4.height / 2 }), o4 = Ft2({ x: i4.left + i4.width / 2, y: i4.top + i4.height / 2 }), P3 -= a4.x - o4.x, F3 -= a4.y - o4.y), p3.isDragging || (p3.isDragging = ht2 = true, q2(p3, `dragstart`, `onDragStart`));
      }, i3.drag = At2, i3.endDrag = function(e25) {
        return Mt2(e25 || p3.pointerEvent, true);
      }, i3.timeSinceDrag = function() {
        return p3.isDragging ? 0 : (we2() - g3) / 1e3;
      }, i3.timeSinceClick = function() {
        return (we2() - C3) / 1e3;
      }, i3.hitTest = function(e25, n4) {
        return t4.hitTest(p3.target, e25, n4);
      }, i3.getDirection = function(e25, t5) {
        var r4 = e25 === `velocity` && M2 ? e25 : _e2(e25) && !s3 ? `element` : `start`, i4, a4, o4, u4, d4, f4;
        return r4 === `element` && (d4 = Je2(p3.target), f4 = Je2(e25)), i4 = r4 === `start` ? p3.x - I3 : r4 === `velocity` ? M2.getVelocity(n3, c3) : d4.left + d4.width / 2 - (f4.left + f4.width / 2), s3 ? i4 < 0 ? `counter-clockwise` : `clockwise` : (t5 || (t5 = 2), a4 = r4 === `start` ? p3.y - R3 : r4 === `velocity` ? M2.getVelocity(n3, l3) : d4.top + d4.height / 2 - (f4.top + f4.height / 2), o4 = Math.abs(i4 / a4), u4 = o4 < 1 / t5 ? `` : i4 < 0 ? `left` : `right`, o4 < t5 && (u4 !== `` && (u4 += `-`), u4 += a4 < 0 ? `up` : `down`), u4);
      }, i3.applyBounds = function(e25, t5) {
        var i4, a4, o4, c4, l4, f4;
        if (e25 && r3.bounds !== e25) return r3.bounds = e25, p3.update(true, t5);
        if (vt2(true), xt2(), z3 && !Dt2()) {
          if (i4 = p3.x, a4 = p3.y, i4 > B3 ? i4 = B3 : i4 < V3 && (i4 = V3), a4 > G3 ? a4 = G3 : a4 < K3 && (a4 = K3), (p3.x !== i4 || p3.y !== a4) && (o4 = true, p3.x = p3.endX = i4, s3 ? p3.endRotation = i4 : p3.y = p3.endY = a4, X3 = true, _t2(true), p3.autoScroll && !p3.isDragging)) for (We2(n3.parentNode), c4 = n3, Ae2.scrollTop = O2.pageYOffset == null ? j3.documentElement.scrollTop == null ? j3.body.scrollTop : j3.documentElement.scrollTop : O2.pageYOffset, Ae2.scrollLeft = O2.pageXOffset == null ? j3.documentElement.scrollLeft == null ? j3.body.scrollLeft : j3.documentElement.scrollLeft : O2.pageXOffset; c4 && !f4; ) f4 = Ue2(c4.parentNode), l4 = f4 ? Ae2 : c4.parentNode, d3 && l4.scrollTop > l4._gsMaxScrollY && (l4.scrollTop = l4._gsMaxScrollY), u3 && l4.scrollLeft > l4._gsMaxScrollX && (l4.scrollLeft = l4._gsMaxScrollX), c4 = l4;
          p3.isThrowing && (o4 || p3.endX > B3 || p3.endX < V3 || p3.endY > G3 || p3.endY < K3) && wt2(r3.inertia || r3.throwProps, o4);
        }
        return p3;
      }, i3.update = function(e25, t5, r4) {
        if (t5 && p3.isPressed) {
          if (s3) p3.x = p3.y = L2(parseFloat(E3.rotation));
          else {
            var i4 = T2(n3), a4 = mt2.apply({ x: p3.x - I3, y: p3.y - R3 }), o4 = T2(n3.parentNode, true);
            o4.apply({ x: i4.e - a4.x, y: i4.f - a4.y }, a4), p3.x = L2(p3.x - (a4.x - o4.e)), p3.y = L2(p3.y - (a4.y - o4.f));
          }
          _t2(true), Et2();
        }
        var c4 = p3.x, l4 = p3.y;
        return Tt2(!t5), e25 ? p3.applyBounds() : (X3 && r4 && _t2(true), vt2(true)), t5 && (jt2(p3.pointerX, p3.pointerY), X3 && _t2(true)), p3.isPressed && !t5 && (u3 && Math.abs(c4 - p3.x) > 0.01 || d3 && Math.abs(l4 - p3.y) > 0.01 && !s3) && Et2(), p3.autoScroll && (We2(n3.parentNode, p3.isDragging), _3 = p3.isDragging, _t2(true), He2(n3, Nt2), Ve2(n3, Nt2)), p3;
      }, i3.enable = function(e25) {
        var t5 = { lazy: true }, i4, a4, c4;
        if (r3.cursor !== false && (t5.cursor = r3.cursor || de2), D2.utils.checkPrefix(`touchCallout`) && (t5.touchCallout = `none`), e25 !== `soft`) {
          for (Ne2(m3, u3 === d3 ? `none` : r3.allowNativeTouchScrolling && n3.scrollHeight === n3.clientHeight == (n3.scrollWidth === n3.clientHeight) || r3.allowEventDefault ? `manipulation` : u3 ? `pan-y` : `pan-x`), a4 = m3.length; --a4 > -1; ) c4 = m3[a4], fe2 || H2(c4, `mousedown`, kt2), H2(c4, `touchstart`, kt2), H2(c4, `click`, Pt2, true), D2.set(c4, t5), c4.getBBox && c4.ownerSVGElement && u3 !== d3 && D2.set(c4.ownerSVGElement, { touchAction: r3.allowNativeTouchScrolling || r3.allowEventDefault ? `manipulation` : u3 ? `pan-y` : `pan-x` }), r3.allowContextMenu || H2(c4, `contextmenu`, gt2);
          Qe2(m3, false);
        }
        return Ve2(n3, Nt2), oe3 = true, M2 && e25 !== `soft` && M2.track(N3 || n3, o3 ? `x,y` : s3 ? `rotation` : `top,left`), n3._gsDragID = i4 = n3._gsDragID || `d` + Ee2++, Te2[i4] = p3, N3 && (N3.enable(), N3.element._gsDragID = i4), (r3.bounds || s3) && Et2(), r3.bounds && p3.applyBounds(), p3;
      }, i3.disable = function(e25) {
        for (var t5 = p3.isDragging, r4 = m3.length, i4; --r4 > -1; ) Ge2(m3[r4], `cursor`, null);
        if (e25 !== `soft`) {
          for (Ne2(m3, null), r4 = m3.length; --r4 > -1; ) i4 = m3[r4], Ge2(i4, `touchCallout`, null), U2(i4, `mousedown`, kt2), U2(i4, `touchstart`, kt2), U2(i4, `click`, Pt2, true), U2(i4, `contextmenu`, gt2);
          Qe2(m3, true), Z2 && (U2(Z2, `touchcancel`, Mt2), U2(Z2, `touchend`, Mt2), U2(Z2, `touchmove`, At2)), U2(j3, `mouseup`, Mt2), U2(j3, `mousemove`, At2);
        }
        return He2(n3, Nt2), oe3 = false, M2 && e25 !== `soft` && (M2.untrack(N3 || n3, o3 ? `x,y` : s3 ? `rotation` : `top,left`), p3.tween && p3.tween.kill()), N3 && N3.disable(), Ie2(_t2), p3.isDragging = p3.isPressed = st2 = false, t5 && q2(p3, `dragend`, `onDragEnd`), p3;
      }, i3.enabled = function(e25, t5) {
        return arguments.length ? e25 ? p3.enable(t5) : p3.disable(t5) : oe3;
      }, i3.kill = function() {
        return p3.isThrowing = false, p3.tween && p3.tween.kill(), p3.disable(), D2.set(m3, { clearProps: `userSelect` }), delete Te2[n3._gsDragID], p3;
      }, i3.revert = function() {
        this.kill(), this.styles && this.styles.revert();
      }, ~a3.indexOf(`scroll`) && (N3 = i3.scrollProxy = new tt2(n3, Me2({ onKill: function() {
        p3.isPressed && Mt2(null);
      } }, r3)), n3.style.overflowY = d3 && !se2 ? `auto` : `hidden`, n3.style.overflowX = u3 && !se2 ? `auto` : `hidden`, n3 = N3.content), s3 ? h3.rotation = 1 : (u3 && (h3[c3] = 1), d3 && (h3[l3] = 1)), E3.force3D = `force3D` in r3 ? r3.force3D : true, pe2(ee2(i3)), i3.enable(), i3;
    }
    return t4.register = function(e25) {
      D2 = e25, nt2();
    }, t4.create = function(e25, n3) {
      return ie2 || nt2(true), ae2(e25).map(function(e26) {
        return new t4(e26, n3);
      });
    }, t4.get = function(e25) {
      return Te2[(ae2(e25)[0] || {})._gsDragID];
    }, t4.timeSinceDrag = function() {
      return (we2() - Oe2) / 1e3;
    }, t4.hitTest = function(e25, t5, n3) {
      if (e25 === t5) return false;
      var r3 = Je2(e25), i3 = Je2(t5), a3 = r3.top, o3 = r3.left, s3 = r3.right, c3 = r3.bottom, l3 = r3.width, u3 = r3.height, d3 = i3.left > s3 || i3.right < o3 || i3.top > c3 || i3.bottom < a3, f3, p3, m3;
      return d3 || !n3 ? !d3 : (m3 = (n3 + ``).indexOf(`%`) !== -1, n3 = parseFloat(n3) || 0, f3 = { left: Math.max(o3, i3.left), top: Math.max(a3, i3.top) }, f3.width = Math.min(s3, i3.right) - f3.left, f3.height = Math.min(c3, i3.bottom) - f3.top, f3.width < 0 || f3.height < 0 ? false : m3 ? (n3 *= 0.01, p3 = f3.width * f3.height, p3 >= l3 * u3 * n3 || p3 >= i3.width * i3.height * n3) : f3.width > n3 && f3.height > n3);
    }, t4;
  })((function() {
    function e24(e25) {
      this._listeners = {}, this.target = e25 || this;
    }
    var t4 = e24.prototype;
    return t4.addEventListener = function(e25, t5) {
      var n3 = this._listeners[e25] || (this._listeners[e25] = []);
      ~n3.indexOf(t5) || n3.push(t5);
    }, t4.removeEventListener = function(e25, t5) {
      var n3 = this._listeners[e25], r3 = n3 && n3.indexOf(t5);
      r3 >= 0 && n3.splice(r3, 1);
    }, t4.dispatchEvent = function(e25) {
      var t5 = this, n3;
      return (this._listeners[e25] || []).forEach(function(r3) {
        return r3.call(t5, { type: e25, target: t5.target }) === false && (n3 = false);
      }), n3;
    }, e24;
  })());
  V2(rt2.prototype, { pointerX: 0, pointerY: 0, startX: 0, startY: 0, deltaX: 0, deltaY: 0, isDragging: false, isPressed: false }), rt2.zIndex = 1e3, rt2.version = `3.15.0`, P2() && D2.registerPlugin(rt2);

  // public/shopify/plantilla99/assets/js/LandingLatestBlogs.astro_astro_type_script_index_0_lang.C0pOmJid.js
  ci.registerPlugin(rt2), document.addEventListener(`DOMContentLoaded`, () => {
    let n3 = document.querySelector(`[data-latest-blogs-section]`);
    if (!n3) return;
    let r3 = n3.querySelector(`[data-slider-wrapper]`), i3 = n3.querySelector(`[data-slider-inner]`), a3 = n3.querySelector(`[data-arrow-controls-wrapper]`), o3 = a3.querySelector(`[data-arrow-left]`), s3 = a3.querySelector(`[data-arrow-right]`), c3 = i3.querySelectorAll(`.list-item`), l3 = 0, u3 = 4, d3 = 288, f3 = 24, p3 = c3.length, m3 = null, h3 = false, g3 = () => {
      let t4 = window.innerWidth;
      u3 = t4 < 600 ? 1 : t4 < 840 ? 2 : t4 < 1200 ? 3 : 4;
      let n4 = window.getComputedStyle(document.documentElement).getPropertyValue(`--grid-gutter`);
      f3 = parseInt(n4.replace(`px`, ``)) || 24, d3 = (r3.getBoundingClientRect().width - f3 * (u3 - 1)) / u3, i3.style.setProperty(`--item-width`, `${d3}px`);
      let a4 = p3 - u3;
      l3 = p3 > u3 ? ci.utils.clamp(0, a4, l3) : 0;
      let o4 = d3 + f3, s4 = l3 * o4 * -1;
      ci.to(i3, { x: s4, duration: 0.3, ease: `power1.inOut` }), _3();
    }, _3 = () => {
      m3 && m3.kill();
      let n4 = d3 + f3, r4 = p3 - u3, a4 = [];
      for (let e24 = 0; e24 <= r4; e24++) a4.push(e24 * n4 * -1);
      let o4 = p3 <= u3 ? 0 : a4[a4.length - 1];
      m3 = rt2.create(i3, { type: `x`, bounds: { minX: o4, maxX: 0 }, snap: { x: a4 }, edgeResistance: 0.8, dragResistance: 0.2, lockAxis: true, inertia: true, allowEventDefault: true, onDragStart: () => {
        h3 = true;
      }, onDragEnd: function() {
        let t4 = ci.getProperty(i3, `x`);
        l3 = Math.round(t4 / n4) * -1, h3 = false, y3();
      } })[0];
    }, v3 = (t4) => {
      if (h3) return;
      let n4 = l3 + u3 * t4, r4 = p3 - u3;
      n4 = p3 <= u3 ? 0 : ci.utils.clamp(0, r4, n4);
      let a4 = d3 + f3, o4 = n4 * a4 * -1;
      ci.to(i3, { x: o4, duration: 0.5, ease: `power2.out`, onComplete: () => {
        l3 = n4, y3();
      } });
    }, y3 = () => {
      o3.disabled = l3 === 0, s3.disabled = l3 === p3 - u3;
    };
    o3.addEventListener(`click`, () => v3(-1)), s3.addEventListener(`click`, () => v3(1)), window.addEventListener(`resize`, g3), g3(), y3();
  });
})();
