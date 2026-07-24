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
    var t4 = e20[0], n3, r3;
    if (y(t4) || g(t4) || (e20 = [e20]), !(n3 = (t4._gsap || {}).harness)) {
      for (r3 = me.length; r3-- && !me[r3].targetTest(t4); ) ;
      n3 = me[r3];
    }
    for (r3 = e20.length; r3--; ) e20[r3] && (e20[r3]._gsap || (e20[r3]._gsap = new en(e20[r3], n3))) || e20.splice(r3, 1);
    return e20;
  };
  var _e = function(e20) {
    return e20._gsap || ge(ut(e20))[0]._gsap;
  };
  var ve = function(e20, t4, n3) {
    return (n3 = e20[t4]) && g(n3) ? e20[t4]() : v(n3) && e20.getAttribute && e20.getAttribute(t4) || n3;
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
    var n3 = t4.charAt(0), r3 = parseFloat(t4.substr(2));
    return e20 = parseFloat(e20), n3 === `+` ? e20 + r3 : n3 === `-` ? e20 - r3 : n3 === `*` ? e20 * r3 : e20 / r3;
  };
  var be = function(e20, t4) {
    for (var n3 = t4.length, r3 = 0; e20.indexOf(t4[r3]) < 0 && ++r3 < n3; ) ;
    return r3 < n3;
  };
  var xe = function() {
    var e20 = le.length, t4 = le.slice(0), n3, r3;
    for (ue = {}, le.length = 0, n3 = 0; n3 < e20; n3++) r3 = t4[n3], r3 && r3._lazy && (r3.render(r3._lazy[0], r3._lazy[1], true)._lazy = 0);
  };
  var Se = function(e20) {
    return !!(e20._initted || e20._startAt || e20.add);
  };
  var Ce = function(e20, t4, n3, r3) {
    le.length && !a && xe(), e20.render(t4, n3, r3 || !!(a && t4 < 0 && Se(e20))), le.length && !a && xe();
  };
  var we = function(e20) {
    var t4 = parseFloat(e20);
    return (t4 || t4 === 0) && (e20 + ``).match(M).length < 2 ? t4 : h(e20) ? e20.trim() : e20;
  };
  var Te = function(e20) {
    return e20;
  };
  var Ee = function(e20, t4) {
    for (var n3 in t4) n3 in e20 || (e20[n3] = t4[n3]);
    return e20;
  };
  var De = function(e20) {
    return function(t4, n3) {
      for (var r3 in n3) r3 in t4 || r3 === `duration` && e20 || r3 === `ease` || (t4[r3] = n3[r3]);
    };
  };
  var Oe = function(e20, t4) {
    for (var n3 in t4) e20[n3] = t4[n3];
    return e20;
  };
  var ke = function e2(t4, n3) {
    for (var r3 in n3) r3 !== `__proto__` && r3 !== `constructor` && r3 !== `prototype` && (t4[r3] = y(n3[r3]) ? e2(t4[r3] || (t4[r3] = {}), n3[r3]) : n3[r3]);
    return t4;
  };
  var Ae = function(e20, t4) {
    var n3 = {}, r3;
    for (r3 in e20) r3 in t4 || (n3[r3] = e20[r3]);
    return n3;
  };
  var je = function(e20) {
    var t4 = e20.parent || P, n3 = e20.keyframes ? De(w(e20.keyframes)) : Ee;
    if (b(e20.inherit)) for (; t4; ) n3(e20, t4.vars.defaults), t4 = t4.parent || t4._dp;
    return e20;
  };
  var Me = function(e20, t4) {
    for (var n3 = e20.length, r3 = n3 === t4.length; r3 && n3-- && e20[n3] === t4[n3]; ) ;
    return n3 < 0;
  };
  var Ne = function(e20, t4, n3, r3, i3) {
    n3 === void 0 && (n3 = `_first`), r3 === void 0 && (r3 = `_last`);
    var a3 = e20[r3], o3;
    if (i3) for (o3 = t4[i3]; a3 && a3[i3] > o3; ) a3 = a3._prev;
    return a3 ? (t4._next = a3._next, a3._next = t4) : (t4._next = e20[n3], e20[n3] = t4), t4._next ? t4._next._prev = t4 : e20[r3] = t4, t4._prev = a3, t4.parent = t4._dp = e20, t4;
  };
  var Pe = function(e20, t4, n3, r3) {
    n3 === void 0 && (n3 = `_first`), r3 === void 0 && (r3 = `_last`);
    var i3 = t4._prev, a3 = t4._next;
    i3 ? i3._next = a3 : e20[n3] === t4 && (e20[n3] = a3), a3 ? a3._prev = i3 : e20[r3] === t4 && (e20[r3] = i3), t4._next = t4._prev = t4.parent = null;
  };
  var Fe = function(e20, t4) {
    e20.parent && (!t4 || e20.parent.autoRemoveChildren) && e20.parent.remove && e20.parent.remove(e20), e20._act = 0;
  };
  var Ie = function(e20, t4) {
    if (e20 && (!t4 || t4._end > e20._dur || t4._start < 0)) for (var n3 = e20; n3; ) n3._dirty = 1, n3 = n3.parent;
    return e20;
  };
  var Le = function(e20) {
    for (var t4 = e20.parent; t4 && t4.parent; ) t4._dirty = 1, t4.totalDuration(), t4 = t4.parent;
    return e20;
  };
  var Re = function(e20, t4, n3, r3) {
    return e20._startAt && (a ? e20._startAt.revert(oe) : e20.vars.immediateRender && !e20.vars.autoRevert || e20._startAt.render(t4, true, r3));
  };
  var ze = function e3(t4) {
    return !t4 || t4._ts && e3(t4.parent);
  };
  var Be = function(e20) {
    return e20._repeat ? Ve(e20._tTime, e20 = e20.duration() + e20._rDelay) * e20 : 0;
  };
  var Ve = function(e20, t4) {
    var n3 = Math.floor(e20 = W(e20 / t4));
    return e20 && n3 === e20 ? n3 - 1 : n3;
  };
  var He = function(e20, t4) {
    return (e20 - t4._start) * t4._ts + (t4._ts >= 0 ? 0 : t4._dirty ? t4.totalDuration() : t4._tDur);
  };
  var Ue = function(e20) {
    return e20._end = W(e20._start + (e20._tDur / Math.abs(e20._ts || e20._rts || c) || 0));
  };
  var We = function(e20, t4) {
    var n3 = e20._dp;
    return n3 && n3.smoothChildTiming && e20._ts && (e20._start = W(n3._time - (e20._ts > 0 ? t4 / e20._ts : ((e20._dirty ? e20.totalDuration() : e20._tDur) - t4) / -e20._ts)), Ue(e20), n3._dirty || Ie(n3, e20)), e20;
  };
  var Ge = function(e20, t4) {
    var n3;
    if ((t4._time || !t4._dur && t4._initted || t4._start < e20._time && (t4._dur || !t4.add)) && (n3 = He(e20.rawTime(), t4), (!t4._dur || at(0, t4.totalDuration(), n3) - t4._tTime > c) && t4.render(n3, true)), Ie(e20, t4)._dp && e20._initted && e20._time >= e20._dur && e20._ts) {
      if (e20._dur < e20.duration()) for (n3 = e20; n3._dp; ) n3.rawTime() >= 0 && n3.totalTime(n3._tTime), n3 = n3._dp;
      e20._zTime = -c;
    }
  };
  var Ke = function(e20, t4, n3, r3) {
    return t4.parent && Fe(t4), t4._start = W((_(n3) ? n3 : n3 || e20 !== P ? nt(e20, n3, t4) : e20._time) + t4._delay), t4._end = W(t4._start + (t4.totalDuration() / Math.abs(t4.timeScale()) || 0)), Ne(e20, t4, `_first`, `_last`, e20._sort ? `_start` : 0), Xe(t4) || (e20._recent = t4), r3 || Ge(e20, t4), e20._ts < 0 && We(e20, e20._tTime), e20;
  };
  var qe = function(e20, t4) {
    return (R.ScrollTrigger || te(`scrollTrigger`, t4)) && R.ScrollTrigger.create(t4, e20);
  };
  var Je = function(e20, t4, n3, r3, i3) {
    if (ln(e20, t4, i3), !e20._initted) return 1;
    if (!n3 && e20._pt && !a && (e20._dur && e20.vars.lazy !== false || !e20._dur && e20.vars.lazy) && de !== Vt.frame) return le.push(e20), e20._lazy = [i3, r3], 1;
  };
  var Ye = function e4(t4) {
    var n3 = t4.parent;
    return n3 && n3._ts && n3._initted && !n3._lock && (n3.rawTime() < 0 || e4(n3));
  };
  var Xe = function(e20) {
    var t4 = e20.data;
    return t4 === `isFromStart` || t4 === `isStart`;
  };
  var Ze = function(e20, t4, n3, r3) {
    var i3 = e20.ratio, o3 = t4 < 0 || !t4 && (!e20._start && Ye(e20) && !(!e20._initted && Xe(e20)) || (e20._ts < 0 || e20._dp._ts < 0) && !Xe(e20)) ? 0 : 1, s3 = e20._rDelay, l3 = 0, u3, d3, f3;
    if (s3 && e20._repeat && (l3 = at(0, e20._tDur, t4), d3 = Ve(l3, s3), e20._yoyo && d3 & 1 && (o3 = 1 - o3), d3 !== Ve(e20._tTime, s3) && (i3 = 1 - o3, e20.vars.repeatRefresh && e20._initted && e20.invalidate())), o3 !== i3 || a || r3 || e20._zTime === c || !t4 && e20._zTime) {
      if (!e20._initted && Je(e20, t4, r3, n3, l3)) return;
      for (f3 = e20._zTime, e20._zTime = t4 || (n3 ? c : 0), n3 || (n3 = t4 && !f3), e20.ratio = o3, e20._from && (o3 = 1 - o3), e20._time = 0, e20._tTime = l3, u3 = e20._pt; u3; ) u3.r(o3, u3.d), u3 = u3._next;
      t4 < 0 && Re(e20, t4, n3, true), e20._onUpdate && !n3 && Dt(e20, `onUpdate`), l3 && e20._repeat && !n3 && e20.parent && Dt(e20, `onRepeat`), (t4 >= e20._tDur || t4 < 0) && e20.ratio === o3 && (o3 && Fe(e20, 1), !n3 && !a && (Dt(e20, o3 ? `onComplete` : `onReverseComplete`, true), e20._prom && e20._prom()));
    } else e20._zTime || (e20._zTime = t4);
  };
  var Qe = function(e20, t4, n3) {
    var r3;
    if (n3 > t4) for (r3 = e20._first; r3 && r3._start <= n3; ) {
      if (r3.data === `isPause` && r3._start > t4) return r3;
      r3 = r3._next;
    }
    else for (r3 = e20._last; r3 && r3._start >= n3; ) {
      if (r3.data === `isPause` && r3._start < t4) return r3;
      r3 = r3._prev;
    }
  };
  var $e = function(e20, t4, n3, r3) {
    var i3 = e20._repeat, a3 = W(t4) || 0, o3 = e20._tTime / e20._tDur;
    return o3 && !r3 && (e20._time *= a3 / e20._dur), e20._dur = a3, e20._tDur = i3 ? i3 < 0 ? 1e10 : W(a3 * (i3 + 1) + e20._rDelay * i3) : a3, o3 > 0 && !r3 && We(e20, e20._tTime = e20._tDur * o3), e20.parent && Ue(e20), n3 || Ie(e20.parent, e20), e20;
  };
  var et = function(e20) {
    return e20 instanceof J ? Ie(e20) : $e(e20, e20._dur);
  };
  var tt = { _start: 0, endTime: ie, totalDuration: ie };
  var nt = function e5(t4, n3, r3) {
    var i3 = t4.labels, a3 = t4._recent || tt, o3 = t4.duration() >= s ? a3.endTime(false) : t4._dur, c3, l3, u3;
    return h(n3) && (isNaN(n3) || n3 in i3) ? (l3 = n3.charAt(0), u3 = n3.substr(-1) === `%`, c3 = n3.indexOf(`=`), l3 === `<` || l3 === `>` ? (c3 >= 0 && (n3 = n3.replace(/=/, ``)), (l3 === `<` ? a3._start : a3.endTime(a3._repeat >= 0)) + (parseFloat(n3.substr(1)) || 0) * (u3 ? (c3 < 0 ? a3 : r3).totalDuration() / 100 : 1)) : c3 < 0 ? (n3 in i3 || (i3[n3] = o3), i3[n3]) : (l3 = parseFloat(n3.charAt(c3 - 1) + n3.substr(c3 + 1)), u3 && r3 && (l3 = l3 / 100 * (w(r3) ? r3[0] : r3).totalDuration()), c3 > 1 ? e5(t4, n3.substr(0, c3 - 1), r3) + l3 : o3 + l3)) : n3 == null ? o3 : +n3;
  };
  var rt = function(e20, t4, n3) {
    var r3 = _(t4[1]), i3 = (r3 ? 2 : 1) + (e20 < 2 ? 0 : 1), a3 = t4[i3], o3, s3;
    if (r3 && (a3.duration = t4[1]), a3.parent = n3, e20) {
      for (o3 = a3, s3 = n3; s3 && !(`immediateRender` in o3); ) o3 = s3.vars.defaults || {}, s3 = b(s3.vars.inherit) && s3.parent;
      a3.immediateRender = b(o3.immediateRender), e20 < 2 ? a3.runBackwards = 1 : a3.startAt = t4[i3 - 1];
    }
    return new Y(t4[0], a3, t4[i3 + 1]);
  };
  var it = function(e20, t4) {
    return e20 || e20 === 0 ? t4(e20) : t4;
  };
  var at = function(e20, t4, n3) {
    return n3 < e20 ? e20 : n3 > t4 ? t4 : n3;
  };
  var G = function(e20, t4) {
    return !h(e20) || !(t4 = N.exec(e20)) ? `` : t4[1];
  };
  var ot = function(e20, t4, n3) {
    return it(n3, function(n4) {
      return at(e20, t4, n4);
    });
  };
  var st = [].slice;
  var ct = function(e20, t4) {
    return e20 && y(e20) && `length` in e20 && (!t4 && !e20.length || e20.length - 1 in e20 && y(e20[0])) && !e20.nodeType && e20 !== F;
  };
  var lt = function(e20, t4, n3) {
    return n3 === void 0 && (n3 = []), e20.forEach(function(e21) {
      var r3;
      return h(e21) && !t4 || ct(e21, 1) ? (r3 = n3).push.apply(r3, ut(e21)) : n3.push(e21);
    }) || n3;
  };
  var ut = function(e20, t4, n3) {
    return o && !t4 && o.selector ? o.selector(e20) : h(e20) && !n3 && (I || !Ht()) ? st.call((t4 || L).querySelectorAll(e20), 0) : w(e20) ? lt(e20, n3) : ct(e20) ? st.call(e20, 0) : e20 ? [e20] : [];
  };
  var dt = function(e20) {
    return e20 = ut(e20)[0] || ne(`Invalid scope`) || {}, function(t4) {
      var n3 = e20.current || e20.nativeElement || e20;
      return ut(t4, n3.querySelectorAll ? n3 : n3 === e20 ? ne(`Invalid scope`) || L.createElement(`div`) : e20);
    };
  };
  var ft = function(e20) {
    return e20.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var pt = function(e20) {
    if (g(e20)) return e20;
    var t4 = y(e20) ? e20 : { each: e20 }, n3 = Yt(t4.ease), r3 = t4.from || 0, i3 = parseFloat(t4.base) || 0, a3 = {}, o3 = r3 > 0 && r3 < 1, c3 = isNaN(r3) || o3, l3 = t4.axis, u3 = r3, d3 = r3;
    return h(r3) ? u3 = d3 = { center: 0.5, edges: 0.5, end: 1 }[r3] || 0 : !o3 && c3 && (u3 = r3[0], d3 = r3[1]), function(e21, o4, p3) {
      var m3 = (p3 || t4).length, h3 = a3[m3], g3, _3, v3, y3, b3, x3, S3, C3, w3;
      if (!h3) {
        if (w3 = t4.grid === `auto` ? 0 : (t4.grid || [1, s])[1], !w3) {
          for (S3 = -s; S3 < (S3 = p3[w3++].getBoundingClientRect().left) && w3 < m3; ) ;
          w3 < m3 && w3--;
        }
        for (h3 = a3[m3] = [], g3 = c3 ? Math.min(w3, m3) * u3 - 0.5 : r3 % w3, _3 = w3 === s ? 0 : c3 ? m3 * d3 / w3 - 0.5 : r3 / w3 | 0, S3 = 0, C3 = s, x3 = 0; x3 < m3; x3++) v3 = x3 % w3 - g3, y3 = _3 - (x3 / w3 | 0), h3[x3] = b3 = l3 ? Math.abs(l3 === `y` ? y3 : v3) : f(v3 * v3 + y3 * y3), b3 > S3 && (S3 = b3), b3 < C3 && (C3 = b3);
        r3 === `random` && ft(h3), h3.max = S3 - C3, h3.min = C3, h3.v = m3 = (parseFloat(t4.amount) || parseFloat(t4.each) * (w3 > m3 ? m3 - 1 : l3 ? l3 === `y` ? m3 / w3 : w3 : Math.max(w3, m3 / w3)) || 0) * (r3 === `edges` ? -1 : 1), h3.b = m3 < 0 ? i3 - m3 : i3, h3.u = G(t4.amount || t4.each) || 0, n3 = n3 && m3 < 0 ? Jt(n3) : n3;
      }
      return m3 = (h3[e21] - h3.min) / h3.max || 0, W(h3.b + (n3 ? n3(m3) : m3) * h3.v) + h3.u;
    };
  };
  var mt = function(e20) {
    var t4 = 10 ** ((e20 + ``).split(`.`)[1] || ``).length;
    return function(n3) {
      var r3 = W(Math.round(parseFloat(n3) / e20) * e20 * t4);
      return (r3 - r3 % 1) / t4 + (_(n3) ? 0 : G(n3));
    };
  };
  var ht = function(e20, t4) {
    var n3 = w(e20), r3, i3;
    return !n3 && y(e20) && (r3 = n3 = e20.radius || s, e20.values ? (e20 = ut(e20.values), (i3 = !_(e20[0])) && (r3 *= r3)) : e20 = mt(e20.increment)), it(t4, n3 ? g(e20) ? function(t5) {
      return i3 = e20(t5), Math.abs(i3 - t5) <= r3 ? i3 : t5;
    } : function(t5) {
      for (var n4 = parseFloat(i3 ? t5.x : t5), a3 = parseFloat(i3 ? t5.y : 0), o3 = s, c3 = 0, l3 = e20.length, u3, d3; l3--; ) i3 ? (u3 = e20[l3].x - n4, d3 = e20[l3].y - a3, u3 = u3 * u3 + d3 * d3) : u3 = Math.abs(e20[l3] - n4), u3 < o3 && (o3 = u3, c3 = l3);
      return c3 = !r3 || o3 <= r3 ? e20[c3] : t5, i3 || c3 === t5 || _(t5) ? c3 : c3 + G(t5);
    } : mt(e20));
  };
  var gt = function(e20, t4, n3, r3) {
    return it(w(e20) ? !t4 : n3 === true ? !!(n3 = 0) : !r3, function() {
      return w(e20) ? e20[~~(Math.random() * e20.length)] : (n3 || (n3 = 1e-5)) && (r3 = n3 < 1 ? 10 ** ((n3 + ``).length - 2) : 1) && Math.floor(Math.round((e20 - n3 / 2 + Math.random() * (t4 - e20 + n3 * 0.99)) / n3) * n3 * r3) / r3;
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
    return function(n3) {
      return e20(parseFloat(n3)) + (t4 || G(n3));
    };
  };
  var yt = function(e20, t4, n3) {
    return wt(e20, t4, 0, 1, n3);
  };
  var bt = function(e20, t4, n3) {
    return it(n3, function(n4) {
      return e20[~~t4(n4)];
    });
  };
  var xt = function e6(t4, n3, r3) {
    var i3 = n3 - t4;
    return w(t4) ? bt(t4, e6(0, t4.length), n3) : it(r3, function(e20) {
      return (i3 + (e20 - t4) % i3) % i3 + t4;
    });
  };
  var St = function e7(t4, n3, r3) {
    var i3 = n3 - t4, a3 = i3 * 2;
    return w(t4) ? bt(t4, e7(0, t4.length - 1), n3) : it(r3, function(e20) {
      return e20 = (a3 + (e20 - t4) % a3) % a3 || 0, t4 + (e20 > i3 ? a3 - e20 : e20);
    });
  };
  var Ct = function(e20) {
    return e20.replace(T, function(e21) {
      var t4 = e21.indexOf(`[`) + 1, n3 = e21.substring(t4 || 7, t4 ? e21.indexOf(`]`) : e21.length - 1).split(E);
      return gt(t4 ? n3 : +n3[0], t4 ? 0 : +n3[1], +n3[2] || 1e-5);
    });
  };
  var wt = function(e20, t4, n3, r3, i3) {
    var a3 = t4 - e20, o3 = r3 - n3;
    return it(i3, function(t5) {
      return n3 + ((t5 - e20) / a3 * o3 || 0);
    });
  };
  var Tt = function e8(t4, n3, r3, i3) {
    var a3 = isNaN(t4 + n3) ? 0 : function(e20) {
      return (1 - e20) * t4 + e20 * n3;
    };
    if (!a3) {
      var o3 = h(t4), s3 = {}, c3, l3, u3, d3, f3;
      if (r3 === true && (i3 = 1) && (r3 = null), o3) t4 = { p: t4 }, n3 = { p: n3 };
      else if (w(t4) && !w(n3)) {
        for (u3 = [], d3 = t4.length, f3 = d3 - 2, l3 = 1; l3 < d3; l3++) u3.push(e8(t4[l3 - 1], t4[l3]));
        d3--, a3 = function(e20) {
          e20 *= d3;
          var t5 = Math.min(f3, ~~e20);
          return u3[t5](e20 - t5);
        }, r3 = n3;
      } else i3 || (t4 = Oe(w(t4) ? [] : {}, t4));
      if (!u3) {
        for (c3 in n3) rn.call(s3, t4, c3, `get`, n3[c3]);
        a3 = function(e20) {
          return wn(e20, s3) || (o3 ? t4.p : t4);
        };
      }
    }
    return it(r3, a3);
  };
  var Et = function(e20, t4, n3) {
    var r3 = e20.labels, i3 = s, a3, o3, c3;
    for (a3 in r3) o3 = r3[a3] - t4, o3 < 0 == !!n3 && o3 && i3 > (o3 = Math.abs(o3)) && (c3 = a3, i3 = o3);
    return c3;
  };
  var Dt = function(e20, t4, n3) {
    var r3 = e20.vars, i3 = r3[t4], a3 = o, s3 = e20._ctx, c3, l3, u3;
    if (i3) return c3 = r3[t4 + `Params`], l3 = r3.callbackScope || e20, n3 && le.length && xe(), s3 && (o = s3), u3 = c3 ? i3.apply(l3, c3) : i3.call(l3), o = a3, u3;
  };
  var Ot = function(e20) {
    return Fe(e20), e20.scrollTrigger && e20.scrollTrigger.kill(!!a), e20.progress() < 1 && Dt(e20, `onInterrupt`), e20;
  };
  var kt;
  var At = [];
  var jt = function(e20) {
    if (e20) if (e20 = !e20.name && e20.default || e20, x() || e20.headless) {
      var t4 = e20.name, n3 = g(e20), r3 = t4 && !n3 && e20.init ? function() {
        this._props = [];
      } : e20, i3 = { init: ie, render: wn, add: rn, kill: En, modifier: Tn, rawVars: 0 }, a3 = { targetTest: 0, get: 0, getSetter: bn, aliases: {}, register: 0 };
      if (Ht(), e20 !== r3) {
        if (V[t4]) return;
        Ee(r3, Ee(Ae(e20, i3), a3)), Oe(r3.prototype, Oe(i3, Ae(e20, a3))), V[r3.prop = t4] = r3, e20.targetTest && (me.push(r3), ce[t4] = 1), t4 = (t4 === `css` ? `CSS` : t4.charAt(0).toUpperCase() + t4.substr(1)) + `Plugin`;
      }
      re(t4, r3), e20.register && e20.register(Z, r3, X);
    } else At.push(e20);
  };
  var K = 255;
  var Mt = { aqua: [0, K, K], lime: [0, K, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, K], navy: [0, 0, 128], white: [K, K, K], olive: [128, 128, 0], yellow: [K, K, 0], orange: [K, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [K, 0, 0], pink: [K, 192, 203], cyan: [0, K, K], transparent: [K, K, K, 0] };
  var Nt = function(e20, t4, n3) {
    return e20 += e20 < 0 ? 1 : e20 > 1 ? -1 : 0, (e20 * 6 < 1 ? t4 + (n3 - t4) * e20 * 6 : e20 < 0.5 ? n3 : e20 * 3 < 2 ? t4 + (n3 - t4) * (2 / 3 - e20) * 6 : t4) * K + 0.5 | 0;
  };
  var Pt = function(e20, t4, n3) {
    var r3 = e20 ? _(e20) ? [e20 >> 16, e20 >> 8 & K, e20 & K] : 0 : Mt.black, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3;
    if (!r3) {
      if (e20.substr(-1) === `,` && (e20 = e20.substr(0, e20.length - 1)), Mt[e20]) r3 = Mt[e20];
      else if (e20.charAt(0) === `#`) {
        if (e20.length < 6 && (i3 = e20.charAt(1), a3 = e20.charAt(2), o3 = e20.charAt(3), e20 = `#` + i3 + i3 + a3 + a3 + o3 + o3 + (e20.length === 5 ? e20.charAt(4) + e20.charAt(4) : ``)), e20.length === 9) return r3 = parseInt(e20.substr(1, 6), 16), [r3 >> 16, r3 >> 8 & K, r3 & K, parseInt(e20.substr(7), 16) / 255];
        e20 = parseInt(e20.substr(1), 16), r3 = [e20 >> 16, e20 >> 8 & K, e20 & K];
      } else if (e20.substr(0, 3) === `hsl`) {
        if (r3 = p3 = e20.match(D), !t4) s3 = r3[0] % 360 / 360, c3 = r3[1] / 100, l3 = r3[2] / 100, a3 = l3 <= 0.5 ? l3 * (c3 + 1) : l3 + c3 - l3 * c3, i3 = l3 * 2 - a3, r3.length > 3 && (r3[3] *= 1), r3[0] = Nt(s3 + 1 / 3, i3, a3), r3[1] = Nt(s3, i3, a3), r3[2] = Nt(s3 - 1 / 3, i3, a3);
        else if (~e20.indexOf(`=`)) return r3 = e20.match(O), n3 && r3.length < 4 && (r3[3] = 1), r3;
      } else r3 = e20.match(D) || Mt.transparent;
      r3 = r3.map(Number);
    }
    return t4 && !p3 && (i3 = r3[0] / K, a3 = r3[1] / K, o3 = r3[2] / K, u3 = Math.max(i3, a3, o3), d3 = Math.min(i3, a3, o3), l3 = (u3 + d3) / 2, u3 === d3 ? s3 = c3 = 0 : (f3 = u3 - d3, c3 = l3 > 0.5 ? f3 / (2 - u3 - d3) : f3 / (u3 + d3), s3 = u3 === i3 ? (a3 - o3) / f3 + (a3 < o3 ? 6 : 0) : u3 === a3 ? (o3 - i3) / f3 + 2 : (i3 - a3) / f3 + 4, s3 *= 60), r3[0] = ~~(s3 + 0.5), r3[1] = ~~(c3 * 100 + 0.5), r3[2] = ~~(l3 * 100 + 0.5)), n3 && r3.length < 4 && (r3[3] = 1), r3;
  };
  var Ft = function(e20) {
    var t4 = [], n3 = [], r3 = -1;
    return e20.split(Lt).forEach(function(e21) {
      var i3 = e21.match(k) || [];
      t4.push.apply(t4, i3), n3.push(r3 += i3.length + 1);
    }), t4.c = n3, t4;
  };
  var It = function(e20, t4, n3) {
    var r3 = ``, i3 = (e20 + r3).match(Lt), a3 = t4 ? `hsla(` : `rgba(`, o3 = 0, s3, c3, l3, u3;
    if (!i3) return e20;
    if (i3 = i3.map(function(e21) {
      return (e21 = Pt(e21, t4, 1)) && a3 + (t4 ? e21[0] + `,` + e21[1] + `%,` + e21[2] + `%,` + e21[3] : e21.join(`,`)) + `)`;
    }), n3 && (l3 = Ft(e20), s3 = n3.c, s3.join(r3) !== l3.c.join(r3))) for (c3 = e20.replace(Lt, `1`).split(k), u3 = c3.length - 1; o3 < u3; o3++) r3 += c3[o3] + (~s3.indexOf(o3) ? i3.shift() || a3 + `0,0,0,0)` : (l3.length ? l3 : i3.length ? i3 : n3).shift());
    if (!c3) for (c3 = e20.split(Lt), u3 = c3.length - 1; o3 < u3; o3++) r3 += c3[o3] + i3[o3];
    return r3 + c3[u3];
  };
  var Lt = (function() {
    var e20 = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`, t4;
    for (t4 in Mt) e20 += `|` + t4 + `\\b`;
    return RegExp(e20 + `)`, `gi`);
  })();
  var Rt = /hsl[a]?\(/;
  var zt = function(e20) {
    var t4 = e20.join(` `), n3;
    if (Lt.lastIndex = 0, Lt.test(t4)) return n3 = Rt.test(t4), e20[1] = It(e20[1], n3), e20[0] = It(e20[0], n3, Ft(e20[1])), true;
  };
  var Bt;
  var Vt = (function() {
    var e20 = Date.now, t4 = 500, n3 = 33, r3 = e20(), i3 = r3, a3 = 1e3 / 240, o3 = a3, s3 = [], c3, l3, u3, d3, f3, p3, m3 = function u4(m4) {
      var h3 = e20() - i3, g3 = m4 === true, _3, v3, y3, b3;
      if ((h3 > t4 || h3 < 0) && (r3 += h3 - n3), i3 += h3, y3 = i3 - r3, _3 = y3 - o3, (_3 > 0 || g3) && (b3 = ++d3.frame, f3 = y3 - d3.time * 1e3, d3.time = y3 /= 1e3, o3 += _3 + (_3 >= a3 ? 4 : a3 - _3), v3 = 1), g3 || (c3 = l3(u4)), v3) for (p3 = 0; p3 < s3.length; p3++) s3[p3](y3, f3, b3, m4);
    };
    return d3 = { time: 0, frame: 0, tick: function() {
      m3(true);
    }, deltaRatio: function(e21) {
      return f3 / (1e3 / (e21 || 60));
    }, wake: function() {
      B && (!I && x() && (F = I = window, L = F.document || {}, R.gsap = Z, (F.gsapVersions || (F.gsapVersions = [])).push(Z.version), ee(z || F.GreenSockGlobals || !F.gsap && F || {}), At.forEach(jt)), u3 = typeof requestAnimationFrame < `u` && requestAnimationFrame, c3 && d3.sleep(), l3 = u3 || function(e21) {
        return setTimeout(e21, o3 - d3.time * 1e3 + 1 | 0);
      }, Bt = 1, m3(2));
    }, sleep: function() {
      (u3 ? cancelAnimationFrame : clearTimeout)(c3), Bt = 0, l3 = ie;
    }, lagSmoothing: function(e21, r4) {
      t4 = e21 || 1 / 0, n3 = Math.min(r4 || 33, t4);
    }, fps: function(e21) {
      a3 = 1e3 / (e21 || 240), o3 = d3.time * 1e3 + a3;
    }, add: function(e21, t5, n4) {
      var r4 = t5 ? function(t6, n5, i4, a4) {
        e21(t6, n5, i4, a4), d3.remove(r4);
      } : e21;
      return d3.remove(e21), s3[n4 ? `unshift` : `push`](r4), Ht(), r4;
    }, remove: function(e21, t5) {
      ~(t5 = s3.indexOf(e21)) && s3.splice(t5, 1) && p3 >= t5 && p3--;
    }, _listeners: s3 }, d3;
  })();
  var Ht = function() {
    return !Bt && Vt.wake();
  };
  var q = {};
  var Ut = /^[\d.\-M][\d.\-,\s]/;
  var Wt = /["']/g;
  var Gt = function(e20) {
    for (var t4 = {}, n3 = e20.substr(1, e20.length - 3).split(`:`), r3 = n3[0], i3 = 1, a3 = n3.length, o3, s3, c3; i3 < a3; i3++) s3 = n3[i3], o3 = i3 === a3 - 1 ? s3.length : s3.lastIndexOf(`,`), c3 = s3.substr(0, o3), t4[r3] = isNaN(c3) ? c3.replace(Wt, ``).trim() : +c3, r3 = s3.substr(o3 + 1).trim();
    return t4;
  };
  var Kt = function(e20) {
    var t4 = e20.indexOf(`(`) + 1, n3 = e20.indexOf(`)`), r3 = e20.indexOf(`(`, t4);
    return e20.substring(t4, ~r3 && r3 < n3 ? e20.indexOf(`)`, n3 + 1) : n3);
  };
  var qt = function(e20) {
    var t4 = (e20 + ``).split(`(`), n3 = q[t4[0]];
    return n3 && t4.length > 1 && n3.config ? n3.config.apply(null, ~e20.indexOf(`{`) ? [Gt(t4[1])] : Kt(e20).split(`,`).map(we)) : q._CE && Ut.test(e20) ? q._CE(``, e20) : n3;
  };
  var Jt = function(e20) {
    return function(t4) {
      return 1 - e20(1 - t4);
    };
  };
  var Yt = function(e20, t4) {
    return e20 && (g(e20) ? e20 : q[e20] || qt(e20)) || t4;
  };
  var Xt = function(e20, t4, n3, r3) {
    n3 === void 0 && (n3 = function(e21) {
      return 1 - t4(1 - e21);
    }), r3 === void 0 && (r3 = function(e21) {
      return e21 < 0.5 ? t4(e21 * 2) / 2 : 1 - t4((1 - e21) * 2) / 2;
    });
    var i3 = { easeIn: t4, easeOut: n3, easeInOut: r3 }, a3;
    return H(e20, function(e21) {
      for (var t5 in q[e21] = R[e21] = i3, q[a3 = e21.toLowerCase()] = n3, i3) q[a3 + (t5 === `easeIn` ? `.in` : t5 === `easeOut` ? `.out` : `.inOut`)] = q[e21 + `.` + t5] = i3[t5];
    }), i3;
  };
  var Zt = function(e20) {
    return function(t4) {
      return t4 < 0.5 ? (1 - e20(1 - t4 * 2)) / 2 : 0.5 + e20((t4 - 0.5) * 2) / 2;
    };
  };
  var Qt = function e9(t4, n3, r3) {
    var i3 = n3 >= 1 ? n3 : 1, a3 = (r3 || (t4 ? 0.3 : 0.45)) / (n3 < 1 ? n3 : 1), o3 = a3 / l * (Math.asin(1 / i3) || 0), s3 = function(e20) {
      return e20 === 1 ? 1 : i3 * 2 ** (-10 * e20) * m((e20 - o3) * a3) + 1;
    }, c3 = t4 === `out` ? s3 : t4 === `in` ? function(e20) {
      return 1 - s3(1 - e20);
    } : Zt(s3);
    return a3 = l / a3, c3.config = function(n4, r4) {
      return e9(t4, n4, r4);
    }, c3;
  };
  var $t = function e10(t4, n3) {
    n3 === void 0 && (n3 = 1.70158);
    var r3 = function(e20) {
      return e20 ? --e20 * e20 * ((n3 + 1) * e20 + n3) + 1 : 0;
    }, i3 = t4 === `out` ? r3 : t4 === `in` ? function(e20) {
      return 1 - r3(1 - e20);
    } : Zt(r3);
    return i3.config = function(n4) {
      return e10(t4, n4);
    }, i3;
  };
  H(`Linear,Quad,Cubic,Quart,Quint,Strong`, function(e20, t4) {
    var n3 = t4 < 5 ? t4 + 1 : t4;
    Xt(e20 + `,Power` + (n3 - 1), t4 ? function(e21) {
      return e21 ** +n3;
    } : function(e21) {
      return e21;
    }, function(e21) {
      return 1 - (1 - e21) ** n3;
    }, function(e21) {
      return e21 < 0.5 ? (e21 * 2) ** n3 / 2 : 1 - ((1 - e21) * 2) ** n3 / 2;
    });
  }), q.Linear.easeNone = q.none = q.Linear.easeIn, Xt(`Elastic`, Qt(`in`), Qt(`out`), Qt()), (function(e20, t4) {
    var n3 = 1 / t4, r3 = 2 * n3, i3 = 2.5 * n3, a3 = function(a4) {
      return a4 < n3 ? e20 * a4 * a4 : a4 < r3 ? e20 * (a4 - 1.5 / t4) ** 2 + 0.75 : a4 < i3 ? e20 * (a4 -= 2.25 / t4) * a4 + 0.9375 : e20 * (a4 - 2.625 / t4) ** 2 + 0.984375;
    };
    Xt(`Bounce`, function(e21) {
      return 1 - a3(1 - e21);
    }, a3);
  })(7.5625, 2.75), Xt(`Expo`, function(e20) {
    return 2 ** (10 * (e20 - 1)) * e20 + e20 * e20 * e20 * e20 * e20 * e20 * (1 - e20);
  }), Xt(`Circ`, function(e20) {
    return -(f(1 - e20 * e20) - 1);
  }), Xt(`Sine`, function(e20) {
    return e20 === 1 ? 1 : -p(e20 * u) + 1;
  }), Xt(`Back`, $t(`in`), $t(`out`), $t()), q.SteppedEase = q.steps = R.SteppedEase = { config: function(e20, t4) {
    e20 === void 0 && (e20 = 1);
    var n3 = 1 / e20, r3 = e20 + +!t4, i3 = +!!t4, a3 = 1 - c;
    return function(e21) {
      return ((r3 * at(0, a3, e21) | 0) + i3) * n3;
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
      var n3 = this._dp;
      if (n3 && n3.smoothChildTiming && this._ts) {
        for (We(this, e21), !n3._dp || n3.parent || Ge(n3, this); n3 && n3.parent; ) n3.parent._time !== n3._start + (n3._ts >= 0 ? n3._tTime / n3._ts : (n3.totalDuration() - n3._tTime) / -n3._ts) && n3.totalTime(n3._tTime, true), n3 = n3.parent;
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
      var n3 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (e21 - 1) * n3, t5) : this._repeat ? Ve(this._tTime, n3) + 1 : 1;
    }, t4.timeScale = function(e21, t5) {
      if (!arguments.length) return this._rts === -c ? 0 : this._rts;
      if (this._rts === e21) return this;
      var n3 = this.parent && this._ts ? He(this.parent._time, this) : this._tTime;
      return this._rts = +e21 || 0, this._ts = this._ps || e21 === -c ? 0 : this._rts, this.totalTime(at(-Math.abs(this._delay), this.totalDuration(), n3), t5 !== false), Ue(this), Le(this);
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
      for (var t5 = this, n3 = arguments.length ? e21 : t5.rawTime(); t5; ) n3 = t5._start + n3 / (Math.abs(t5._ts) || 1), t5 = t5._dp;
      return !this.parent && this._sat ? this._sat.globalTime(e21) : n3;
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
      var e21 = this.parent || this._dp, t5 = this._start, n3;
      return !!(!e21 || this._ts && this._initted && e21.isActive() && (n3 = e21.rawTime(true)) >= t5 && n3 < this.endTime(true) - c);
    }, t4.eventCallback = function(e21, t5, n3) {
      var r3 = this.vars;
      return arguments.length > 1 ? (t5 ? (r3[e21] = t5, n3 && (r3[e21 + `Params`] = n3), e21 === `onUpdate` && (this._onUpdate = t5)) : delete r3[e21], this) : r3[e21];
    }, t4.then = function(e21) {
      var t5 = this, n3 = t5._prom;
      return new Promise(function(r3) {
        var i3 = g(e21) ? e21 : Te, a3 = function() {
          var e22 = t5.then;
          t5.then = null, n3 && n3(), g(i3) && (i3 = i3(t5)) && (i3.then || i3 === t5) && (t5.then = e22), r3(i3), t5.then = e22;
        };
        t5._initted && t5.totalProgress() === 1 && t5._ts >= 0 || !t5._tTime && t5._ts < 0 ? a3() : t5._prom = a3;
      });
    }, t4.kill = function() {
      Ot(this);
    }, e20;
  })();
  Ee(tn.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -c, _prom: 0, _ps: false, _rts: 1 });
  var J = (function(r3) {
    t(i3, r3);
    function i3(t4, n3) {
      var i4;
      return t4 === void 0 && (t4 = {}), i4 = r3.call(this, t4) || this, i4.labels = {}, i4.smoothChildTiming = !!t4.smoothChildTiming, i4.autoRemoveChildren = !!t4.autoRemoveChildren, i4._sort = b(t4.sortChildren), P && Ke(t4.parent || P, e(i4), n3), t4.reversed && i4.reverse(), t4.paused && i4.paused(true), t4.scrollTrigger && qe(e(i4), t4.scrollTrigger), i4;
    }
    var o3 = i3.prototype;
    return o3.to = function(e20, t4, n3) {
      return rt(0, arguments, this), this;
    }, o3.from = function(e20, t4, n3) {
      return rt(1, arguments, this), this;
    }, o3.fromTo = function(e20, t4, n3, r4) {
      return rt(2, arguments, this), this;
    }, o3.set = function(e20, t4, n3) {
      return t4.duration = 0, t4.parent = this, je(t4).repeatDelay || (t4.repeat = 0), t4.immediateRender = !!t4.immediateRender, new Y(e20, t4, nt(this, n3), 1), this;
    }, o3.call = function(e20, t4, n3) {
      return Ke(this, Y.delayedCall(0, e20, t4), n3);
    }, o3.staggerTo = function(e20, t4, n3, r4, i4, a3, o4) {
      return n3.duration = t4, n3.stagger = n3.stagger || r4, n3.onComplete = a3, n3.onCompleteParams = o4, n3.parent = this, new Y(e20, n3, nt(this, i4)), this;
    }, o3.staggerFrom = function(e20, t4, n3, r4, i4, a3, o4) {
      return n3.runBackwards = 1, je(n3).immediateRender = b(n3.immediateRender), this.staggerTo(e20, t4, n3, r4, i4, a3, o4);
    }, o3.staggerFromTo = function(e20, t4, n3, r4, i4, a3, o4, s3) {
      return r4.startAt = n3, je(r4).immediateRender = b(r4.immediateRender), this.staggerTo(e20, t4, r4, i4, a3, o4, s3);
    }, o3.render = function(e20, t4, n3) {
      var r4 = this._time, i4 = this._dirty ? this.totalDuration() : this._tDur, o4 = this._dur, s3 = e20 <= 0 ? 0 : W(e20), l3 = this._zTime < 0 != e20 < 0 && (this._initted || !o4), u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
      if (this !== P && s3 > i4 && e20 >= 0 && (s3 = i4), s3 !== this._tTime || n3 || l3) {
        if (r4 !== this._time && o4 && (s3 += this._time - r4, e20 += this._time - r4), u3 = s3, v3 = this._start, _3 = this._ts, h3 = !_3, l3 && (o4 || (r4 = this._zTime), (e20 || !t4) && (this._zTime = e20)), this._repeat) {
          if (b3 = this._yoyo, m3 = o4 + this._rDelay, this._repeat < -1 && e20 < 0) return this.totalTime(m3 * 100 + e20, t4, n3);
          if (u3 = W(s3 % m3), s3 === i4 ? (p3 = this._repeat, u3 = o4) : (y3 = W(s3 / m3), p3 = ~~y3, p3 && p3 === y3 && (u3 = o4, p3--), u3 > o4 && (u3 = o4)), y3 = Ve(this._tTime, m3), !r4 && this._tTime && y3 !== p3 && this._tTime - y3 * m3 - this._dur <= 0 && (y3 = p3), b3 && p3 & 1 && (u3 = o4 - u3, x3 = 1), p3 !== y3 && !this._lock) {
            var S3 = b3 && y3 & 1, C3 = S3 === (b3 && p3 & 1);
            if (p3 < y3 && (S3 = !S3), r4 = S3 ? 0 : s3 % o4 ? o4 : s3, this._lock = 1, this.render(r4 || (x3 ? 0 : W(p3 * m3)), t4, !o4)._lock = 0, this._tTime = s3, !t4 && this.parent && Dt(this, `onRepeat`), this.vars.repeatRefresh && !x3 && (this.invalidate()._lock = 1, y3 = p3), r4 && r4 !== this._time || h3 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (o4 = this._dur, i4 = this._tDur, C3 && (this._lock = 2, r4 = S3 ? o4 : -1e-4, this.render(r4, true), this.vars.repeatRefresh && !x3 && this.invalidate()), this._lock = 0, !this._ts && !h3)) return this;
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g3 = Qe(this, W(r4), W(u3)), g3 && (s3 -= u3 - (u3 = g3._start))), this._tTime = s3, this._time = u3, this._act = !!_3, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e20, r4 = 0), !r4 && s3 && o4 && !t4 && !y3 && (Dt(this, `onStart`), this._tTime !== s3)) return this;
        if (u3 >= r4 && e20 >= 0) for (d3 = this._first; d3; ) {
          if (f3 = d3._next, (d3._act || u3 >= d3._start) && d3._ts && g3 !== d3) {
            if (d3.parent !== this) return this.render(e20, t4, n3);
            if (d3.render(d3._ts > 0 ? (u3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (u3 - d3._start) * d3._ts, t4, n3), u3 !== this._time || !this._ts && !h3) {
              g3 = 0, f3 && (s3 += this._zTime = -c);
              break;
            }
          }
          d3 = f3;
        }
        else {
          d3 = this._last;
          for (var w3 = e20 < 0 ? e20 : u3; d3; ) {
            if (f3 = d3._prev, (d3._act || w3 <= d3._end) && d3._ts && g3 !== d3) {
              if (d3.parent !== this) return this.render(e20, t4, n3);
              if (d3.render(d3._ts > 0 ? (w3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (w3 - d3._start) * d3._ts, t4, n3 || a && Se(d3)), u3 !== this._time || !this._ts && !h3) {
                g3 = 0, f3 && (s3 += this._zTime = w3 ? -c : c);
                break;
              }
            }
            d3 = f3;
          }
        }
        if (g3 && !t4 && (this.pause(), g3.render(u3 >= r4 ? 0 : -c)._zTime = u3 >= r4 ? 1 : -1, this._ts)) return this._start = v3, Ue(this), this.render(e20, t4, n3);
        this._onUpdate && !t4 && Dt(this, `onUpdate`, true), (s3 === i4 && this._tTime >= this.totalDuration() || !s3 && r4) && (v3 === this._start || Math.abs(_3) !== Math.abs(this._ts)) && (this._lock || ((e20 || !o4) && (s3 === i4 && this._ts > 0 || !s3 && this._ts < 0) && Fe(this, 1), !t4 && !(e20 < 0 && !r4) && (s3 || r4 || !i4) && (Dt(this, s3 === i4 && e20 >= 0 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s3 < i4 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, o3.add = function(e20, t4) {
      var n3 = this;
      if (_(t4) || (t4 = nt(this, t4, e20)), !(e20 instanceof tn)) {
        if (w(e20)) return e20.forEach(function(e21) {
          return n3.add(e21, t4);
        }), this;
        if (h(e20)) return this.addLabel(e20, t4);
        if (g(e20)) e20 = Y.delayedCall(0, e20);
        else return this;
      }
      return this === e20 ? this : Ke(this, e20, t4);
    }, o3.getChildren = function(e20, t4, n3, r4) {
      e20 === void 0 && (e20 = true), t4 === void 0 && (t4 = true), n3 === void 0 && (n3 = true), r4 === void 0 && (r4 = -s);
      for (var i4 = [], a3 = this._first; a3; ) a3._start >= r4 && (a3 instanceof Y ? t4 && i4.push(a3) : (n3 && i4.push(a3), e20 && i4.push.apply(i4, a3.getChildren(true, t4, n3)))), a3 = a3._next;
      return i4;
    }, o3.getById = function(e20) {
      for (var t4 = this.getChildren(1, 1, 1), n3 = t4.length; n3--; ) if (t4[n3].vars.id === e20) return t4[n3];
    }, o3.remove = function(e20) {
      return h(e20) ? this.removeLabel(e20) : g(e20) ? this.killTweensOf(e20) : (e20.parent === this && Pe(this, e20), e20 === this._recent && (this._recent = this._last), Ie(this));
    }, o3.totalTime = function(e20, t4) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = W(Vt.time - (this._ts > 0 ? e20 / this._ts : (this.totalDuration() - e20) / -this._ts))), r3.prototype.totalTime.call(this, e20, t4), this._forcing = 0, this) : this._tTime;
    }, o3.addLabel = function(e20, t4) {
      return this.labels[e20] = nt(this, t4), this;
    }, o3.removeLabel = function(e20) {
      return delete this.labels[e20], this;
    }, o3.addPause = function(e20, t4, n3) {
      var r4 = Y.delayedCall(0, t4 || ie, n3);
      return r4.data = `isPause`, this._hasPause = 1, Ke(this, r4, nt(this, e20));
    }, o3.removePause = function(e20) {
      var t4 = this._first;
      for (e20 = nt(this, e20); t4; ) t4._start === e20 && t4.data === `isPause` && Fe(t4), t4 = t4._next;
    }, o3.killTweensOf = function(e20, t4, n3) {
      for (var r4 = this.getTweensOf(e20, n3), i4 = r4.length; i4--; ) sn !== r4[i4] && r4[i4].kill(e20, t4);
      return this;
    }, o3.getTweensOf = function(e20, t4) {
      for (var n3 = [], r4 = ut(e20), i4 = this._first, a3 = _(t4), o4; i4; ) i4 instanceof Y ? be(i4._targets, r4) && (a3 ? (!sn || i4._initted && i4._ts) && i4.globalTime(0) <= t4 && i4.globalTime(i4.totalDuration()) > t4 : !t4 || i4.isActive()) && n3.push(i4) : (o4 = i4.getTweensOf(r4, t4)).length && n3.push.apply(n3, o4), i4 = i4._next;
      return n3;
    }, o3.tweenTo = function(e20, t4) {
      t4 || (t4 = {});
      var n3 = this, r4 = nt(n3, e20), i4 = t4, a3 = i4.startAt, o4 = i4.onStart, s3 = i4.onStartParams, l3 = i4.immediateRender, u3, d3 = Y.to(n3, Ee({ ease: t4.ease || `none`, lazy: false, immediateRender: false, time: r4, overwrite: `auto`, duration: t4.duration || Math.abs((r4 - (a3 && `time` in a3 ? a3.time : n3._time)) / n3.timeScale()) || c, onStart: function() {
        if (n3.pause(), !u3) {
          var e21 = t4.duration || Math.abs((r4 - (a3 && `time` in a3 ? a3.time : n3._time)) / n3.timeScale());
          d3._dur !== e21 && $e(d3, e21, 0, 1).render(d3._time, true, true), u3 = 1;
        }
        o4 && o4.apply(d3, s3 || []);
      } }, t4));
      return l3 ? d3.render(0) : d3;
    }, o3.tweenFromTo = function(e20, t4, n3) {
      return this.tweenTo(t4, Ee({ startAt: { time: nt(this, e20) } }, n3));
    }, o3.recent = function() {
      return this._recent;
    }, o3.nextLabel = function(e20) {
      return e20 === void 0 && (e20 = this._time), Et(this, nt(this, e20));
    }, o3.previousLabel = function(e20) {
      return e20 === void 0 && (e20 = this._time), Et(this, nt(this, e20), 1);
    }, o3.currentLabel = function(e20) {
      return arguments.length ? this.seek(e20, true) : this.previousLabel(this._time + c);
    }, o3.shiftChildren = function(e20, t4, n3) {
      n3 === void 0 && (n3 = 0);
      var r4 = this._first, i4 = this.labels, a3;
      for (e20 = W(e20); r4; ) r4._start >= n3 && (r4._start += e20, r4._end += e20), r4 = r4._next;
      if (t4) for (a3 in i4) i4[a3] >= n3 && (i4[a3] += e20);
      return Ie(this);
    }, o3.invalidate = function(e20) {
      var t4 = this._first;
      for (this._lock = 0; t4; ) t4.invalidate(e20), t4 = t4._next;
      return r3.prototype.invalidate.call(this, e20);
    }, o3.clear = function(e20) {
      e20 === void 0 && (e20 = true);
      for (var t4 = this._first, n3; t4; ) n3 = t4._next, this.remove(t4), t4 = n3;
      return this._dp && (this._time = this._tTime = this._pTime = 0), e20 && (this.labels = {}), Ie(this);
    }, o3.totalDuration = function(e20) {
      var t4 = 0, n3 = this, r4 = n3._last, i4 = s, a3, o4, c3;
      if (arguments.length) return n3.timeScale((n3._repeat < 0 ? n3.duration() : n3.totalDuration()) / (n3.reversed() ? -e20 : e20));
      if (n3._dirty) {
        for (c3 = n3.parent; r4; ) a3 = r4._prev, r4._dirty && r4.totalDuration(), o4 = r4._start, o4 > i4 && n3._sort && r4._ts && !n3._lock ? (n3._lock = 1, Ke(n3, r4, o4 - r4._delay, 1)._lock = 0) : i4 = o4, o4 < 0 && r4._ts && (t4 -= o4, (!c3 && !n3._dp || c3 && c3.smoothChildTiming) && (n3._start += W(o4 / n3._ts), n3._time -= o4, n3._tTime -= o4), n3.shiftChildren(-o4, false, -1 / 0), i4 = 0), r4._end > t4 && r4._ts && (t4 = r4._end), r4 = a3;
        $e(n3, n3 === P && n3._time > t4 ? n3._time : t4, 1, 1), n3._dirty = 0;
      }
      return n3._tDur;
    }, i3.updateRoot = function(e20) {
      if (P._ts && (Ce(P, He(e20, P)), de = Vt.frame), Vt.frame >= pe) {
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
  var nn = function(e20, t4, n3, r3, i3, a3, o3) {
    var s3 = new X(this._pt, e20, t4, 0, 1, Cn, null, i3), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3;
    for (s3.b = n3, s3.e = r3, n3 += ``, r3 += ``, (g3 = ~r3.indexOf(`random(`)) && (r3 = Ct(r3)), a3 && (_3 = [n3, r3], a3(_3, e20, t4), n3 = _3[0], r3 = _3[1]), d3 = n3.match(A) || []; u3 = A.exec(r3); ) p3 = u3[0], m3 = r3.substring(c3, u3.index), f3 ? f3 = (f3 + 1) % 5 : m3.substr(-5) === `rgba(` && (f3 = 1), p3 !== d3[l3++] && (h3 = parseFloat(d3[l3 - 1]) || 0, s3._pt = { _next: s3._pt, p: m3 || l3 === 1 ? m3 : `,`, s: h3, c: p3.charAt(1) === `=` ? ye(h3, p3) - h3 : parseFloat(p3) - h3, m: f3 && f3 < 4 ? Math.round : 0 }, c3 = A.lastIndex);
    return s3.c = c3 < r3.length ? r3.substring(c3, r3.length) : ``, s3.fp = o3, (j.test(r3) || g3) && (s3.e = 0), this._pt = s3, s3;
  };
  var rn = function(e20, t4, r3, i3, a3, o3, s3, c3, l3, u3) {
    g(i3) && (i3 = i3(a3 || 0, e20, o3));
    var d3 = e20[t4], f3 = r3 === `get` ? g(d3) ? l3 ? e20[t4.indexOf(`set`) || !g(e20[`get` + t4.substr(3)]) ? t4 : `get` + t4.substr(3)](l3) : e20[t4]() : d3 : r3, p3 = g(d3) ? l3 ? vn : _n : gn, m3;
    if (h(i3) && (~i3.indexOf(`random(`) && (i3 = Ct(i3)), i3.charAt(1) === `=` && (m3 = ye(f3, i3) + (G(f3) || 0), (m3 || m3 === 0) && (i3 = m3))), !u3 || f3 !== i3 || cn) return !isNaN(f3 * i3) && i3 !== `` ? (m3 = new X(this._pt, e20, t4, +f3 || 0, i3 - (f3 || 0), typeof d3 == `boolean` ? Sn : xn, 0, p3), l3 && (m3.fp = l3), s3 && m3.modifier(s3, this, e20), this._pt = m3) : (!d3 && !(t4 in e20) && te(t4, i3), nn.call(this, e20, t4, f3, i3, p3, c3 || n.stringFilter, l3));
  };
  var an = function(e20, t4, n3, r3, i3) {
    if (g(e20) && (e20 = pn(e20, i3, t4, n3, r3)), !y(e20) || e20.style && e20.nodeType || w(e20) || C(e20)) return h(e20) ? pn(e20, i3, t4, n3, r3) : e20;
    var a3 = {}, o3;
    for (o3 in e20) a3[o3] = pn(e20[o3], i3, t4, n3, r3);
    return a3;
  };
  var on = function(e20, t4, n3, r3, i3, a3) {
    var o3, s3, c3, l3;
    if (V[e20] && (o3 = new V[e20]()).init(i3, o3.rawVars ? t4[e20] : an(t4[e20], r3, i3, a3, n3), n3, r3, a3) !== false && (n3._pt = s3 = new X(n3._pt, i3, e20, 0, 1, o3.render, o3, 0, o3.priority), n3 !== kt)) for (c3 = n3._ptLookup[n3._targets.indexOf(i3)], l3 = o3._props.length; l3--; ) c3[o3._props[l3]] = s3;
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
        if (M3 = S3[k3], F3 = M3._gsap || ge(S3)[k3]._gsap, t4._ptLookup[k3] = R3 = {}, ue[F3.id] && le.length && xe(), z3 = w3 === S3 ? k3 : w3.indexOf(M3), I3 && (L3 = new I3()).init(M3, B3 || O3, t4, z3, w3) !== false && (t4._pt = j3 = new X(t4._pt, M3, L3.name, 0, 1, L3.render, L3, 0, L3.priority), L3._props.forEach(function(e20) {
          R3[e20] = j3;
        }), L3.priority && (N3 = 1)), !I3 || B3) for (A3 in O3) V[A3] && (L3 = on(A3, O3, t4, z3, M3, w3)) ? L3.priority && (N3 = 1) : R3[A3] = j3 = rn.call(t4, M3, A3, `get`, O3[A3], z3, w3, 0, l3.stringFilter);
        t4._op && t4._op[k3] && t4.kill(M3, t4._op[k3]), T3 && t4._pt && (sn = t4, P.killTweensOf(M3, R3, t4.globalTime(n3)), ee3 = !t4.parent, sn = 0), t4._pt && p3 && (ue[F3.id] = 1);
      }
      N3 && On(t4), t4._onInit && t4._onInit(t4);
    }
    t4._onUpdate = m3, t4._initted = (!t4._op || t4._pt) && !ee3, _3 && n3 <= 0 && E3.render(s, true, true);
  };
  var un = function(e20, t4, n3, r3, i3, a3, o3, s3) {
    var c3 = (e20._pt && e20._ptCache || (e20._ptCache = {}))[t4], l3, u3, d3, f3;
    if (!c3) for (c3 = e20._ptCache[t4] = [], d3 = e20._ptLookup, f3 = e20._targets.length; f3--; ) {
      if (l3 = d3[f3][t4], l3 && l3.d && l3.d._pt) for (l3 = l3.d._pt; l3 && l3.p !== t4 && l3.fp !== t4; ) l3 = l3._next;
      if (!l3) return cn = 1, e20.vars[t4] = `+=0`, ln(e20, o3), cn = 0, s3 ? ne(t4 + ` not eligible for reset. Try splitting into individual properties`) : 1;
      c3.push(l3);
    }
    for (f3 = c3.length; f3--; ) u3 = c3[f3], l3 = u3._pt || u3, l3.s = (r3 || r3 === 0) && !i3 ? r3 : l3.s + (r3 || 0) + a3 * l3.c, l3.c = n3 - l3.s, u3.e && (u3.e = U(n3) + G(u3.e)), u3.b && (u3.b = l3.s + G(u3.b));
  };
  var dn = function(e20, t4) {
    var n3 = e20[0] ? _e(e20[0]).harness : 0, r3 = n3 && n3.aliases, i3, a3, o3, s3;
    if (!r3) return t4;
    for (a3 in i3 = Oe({}, t4), r3) if (a3 in i3) for (s3 = r3[a3].split(`,`), o3 = s3.length; o3--; ) i3[s3[o3]] = i3[a3];
    return i3;
  };
  var fn = function(e20, t4, n3, r3) {
    var i3 = t4.ease || r3 || `power1.inOut`, a3, o3;
    if (w(t4)) o3 = n3[e20] || (n3[e20] = []), t4.forEach(function(e21, n4) {
      return o3.push({ t: n4 / (t4.length - 1) * 100, v: e21, e: i3 });
    });
    else for (a3 in t4) o3 = n3[a3] || (n3[a3] = []), a3 === `ease` || o3.push({ t: parseFloat(e20), v: t4[a3], e: i3 });
  };
  var pn = function(e20, t4, n3, r3, i3) {
    return g(e20) ? e20.call(t4, n3, r3, i3) : h(e20) && ~e20.indexOf(`random(`) ? Ct(e20) : e20;
  };
  var mn = he + `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`;
  var hn = {};
  H(mn + `,id,stagger,delay,duration,paused,scrollTrigger`, function(e20) {
    return hn[e20] = 1;
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
          if (w(g3)) g3.forEach(function(e20) {
            return D3.to(E3, e20, `>`);
          }), D3.duration();
          else {
            for (j3 in k3 = {}, g3) j3 === `ease` || j3 === `easeEach` || fn(j3, g3[j3], k3, g3.easeEach);
            for (j3 in k3) for (R3 = k3[j3].sort(function(e20, t5) {
              return e20.t - t5.t;
            }), L3 = 0, O3 = 0; O3 < R3.length; O3++) z3 = R3[O3], B3 = { ease: z3.e, duration: (z3.t - (O3 ? R3[O3 - 1].t : 0)) / 100 * d3 }, B3[j3] = z3.v, D3.to(E3, B3, L3), L3 += B3.duration;
            D3.duration() < d3 && D3.to({}, { duration: d3 - D3.duration() });
          }
        }
        d3 || l3.duration(d3 = D3.duration());
      } else l3.timeline = 0;
      return h3 === true && !i && (sn = e(l3), P.killTweensOf(E3), sn = 0), Ke(T3, e(l3), o4), a3.reversed && l3.reverse(), a3.paused && l3.paused(true), (p3 || !d3 && !g3 && l3._start === W(T3._time) && b(p3) && ze(e(l3)) && T3.data !== `nested`) && (l3._tTime = -c, l3.render(Math.max(0, -f3) || 0)), x3 && qe(e(l3), x3), l3;
    }
    var s3 = o3.prototype;
    return s3.render = function(e20, t4, n3) {
      var r4 = this._time, i3 = this._tDur, a3 = this._dur, o4 = e20 < 0, s4 = e20 > i3 - c && !o4 ? i3 : e20 < c ? 0 : e20, l3, u3, d3, f3, p3, m3, h3, g3;
      if (!a3) Ze(this, e20, t4, n3);
      else if (s4 !== this._tTime || !e20 || n3 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o4 || this._lazy) {
        if (l3 = s4, g3 = this.timeline, this._repeat) {
          if (f3 = a3 + this._rDelay, this._repeat < -1 && o4) return this.totalTime(f3 * 100 + e20, t4, n3);
          if (l3 = W(s4 % f3), s4 === i3 ? (d3 = this._repeat, l3 = a3) : (p3 = W(s4 / f3), d3 = ~~p3, d3 && d3 === p3 ? (l3 = a3, d3--) : l3 > a3 && (l3 = a3)), m3 = this._yoyo && d3 & 1, m3 && (l3 = a3 - l3), p3 = Ve(this._tTime, f3), l3 === r4 && !n3 && this._initted && d3 === p3) return this._tTime = s4, this;
          d3 !== p3 && this.vars.repeatRefresh && !m3 && !this._lock && l3 !== f3 && this._initted && (this._lock = n3 = 1, this.render(W(f3 * d3), true).invalidate()._lock = 0);
        }
        if (!this._initted) {
          if (Je(this, o4 ? e20 : l3, n3, t4, s4)) return this._tTime = 0, this;
          if (r4 !== this._time && !(n3 && this.vars.repeatRefresh && d3 !== p3)) return this;
          if (a3 !== this._dur) return this.render(e20, t4, n3);
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
        g3 && g3.render(e20 < 0 ? e20 : g3._dur * g3._ease(l3 / this._dur), t4, n3) || this._startAt && (this._zTime = e20), this._onUpdate && !t4 && (o4 && Re(this, e20, t4, n3), Dt(this, `onUpdate`)), this._repeat && d3 !== p3 && this.vars.onRepeat && !t4 && this.parent && Dt(this, `onRepeat`), (s4 === this._tDur || !s4) && this._tTime === s4 && (o4 && !this._onUpdate && Re(this, e20, true, true), (e20 || !a3) && (s4 === this._tDur && this._ts > 0 || !s4 && this._ts < 0) && Fe(this, 1), !t4 && !(o4 && !r4) && (s4 || r4 || m3) && (Dt(this, s4 === i3 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s4 < i3 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, s3.targets = function() {
      return this._targets;
    }, s3.invalidate = function(e20) {
      return (!e20 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e20), r3.prototype.invalidate.call(this, e20);
    }, s3.resetTo = function(e20, t4, n3, r4, i3) {
      Bt || Vt.wake(), this._ts || this.play();
      var a3 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o4;
      return this._initted || ln(this, a3), o4 = this._ease(a3 / this._dur), un(this, e20, t4, n3, r4, o4, a3, i3) ? this.resetTo(e20, t4, n3, r4, 1) : (We(this, 0), this.parent || Ne(this._dp, this, `_first`, `_last`, this._dp._sort ? `_start` : 0), this.render(0));
    }, s3.kill = function(e20, t4) {
      if (t4 === void 0 && (t4 = `all`), !e20 && (!t4 || t4 === `all`)) return this._lazy = this._pt = 0, this.parent ? Ot(this) : this.scrollTrigger && this.scrollTrigger.kill(!!a), this;
      if (this.timeline) {
        var n3 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(e20, t4, sn && sn.vars.overwrite !== true)._first || Ot(this), this.parent && n3 !== this.timeline.totalDuration() && $e(this, this._dur * this.timeline._tDur / n3, 0, 1), this;
      }
      var r4 = this._targets, i3 = e20 ? ut(e20) : r4, o4 = this._ptLookup, s4 = this._pt, c3, l3, u3, d3, f3, p3, m3;
      if ((!t4 || t4 === `all`) && Me(r4, i3)) return t4 === `all` && (this._pt = 0), Ot(this);
      for (c3 = this._op = this._op || [], t4 !== `all` && (h(t4) && (f3 = {}, H(t4, function(e21) {
        return f3[e21] = 1;
      }), t4 = f3), t4 = dn(r4, t4)), m3 = r4.length; m3--; ) if (~i3.indexOf(r4[m3])) for (f3 in l3 = o4[m3], t4 === `all` ? (c3[m3] = t4, d3 = l3, u3 = {}) : (u3 = c3[m3] = c3[m3] || {}, d3 = t4), d3) p3 = l3 && l3[f3], p3 && ((!(`kill` in p3.d) || p3.d.kill(f3) === true) && Pe(this, p3, `_pt`), delete l3[f3]), u3 !== `all` && (u3[f3] = 1);
      return this._initted && !this._pt && s4 && Ot(this), this;
    }, o3.to = function(e20, t4) {
      return new o3(e20, t4, arguments[2]);
    }, o3.from = function(e20, t4) {
      return rt(1, arguments);
    }, o3.delayedCall = function(e20, t4, n3, r4) {
      return new o3(t4, 0, { immediateRender: false, lazy: false, overwrite: false, delay: e20, onComplete: t4, onReverseComplete: t4, onCompleteParams: n3, onReverseCompleteParams: n3, callbackScope: r4 });
    }, o3.fromTo = function(e20, t4, n3) {
      return rt(2, arguments);
    }, o3.set = function(e20, t4) {
      return t4.duration = 0, t4.repeatDelay || (t4.repeat = 0), new o3(e20, t4);
    }, o3.killTweensOf = function(e20, t4, n3) {
      return P.killTweensOf(e20, t4, n3);
    }, o3;
  })(tn);
  Ee(Y.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }), H(`staggerTo,staggerFrom,staggerFromTo`, function(e20) {
    Y[e20] = function() {
      var t4 = new J(), n3 = st.call(arguments, 0);
      return n3.splice(e20 === `staggerFromTo` ? 5 : 4, 0, 0), t4[e20].apply(t4, n3);
    };
  });
  var gn = function(e20, t4, n3) {
    return e20[t4] = n3;
  };
  var _n = function(e20, t4, n3) {
    return e20[t4](n3);
  };
  var vn = function(e20, t4, n3, r3) {
    return e20[t4](r3.fp, n3);
  };
  var yn = function(e20, t4, n3) {
    return e20.setAttribute(t4, n3);
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
    var n3 = t4._pt, r3 = ``;
    if (!e20 && t4.b) r3 = t4.b;
    else if (e20 === 1 && t4.e) r3 = t4.e;
    else {
      for (; n3; ) r3 = n3.p + (n3.m ? n3.m(n3.s + n3.c * e20) : Math.round((n3.s + n3.c * e20) * 1e4) / 1e4) + r3, n3 = n3._next;
      r3 += t4.c;
    }
    t4.set(t4.t, t4.p, r3, t4);
  };
  var wn = function(e20, t4) {
    for (var n3 = t4._pt; n3; ) n3.r(e20, n3.d), n3 = n3._next;
  };
  var Tn = function(e20, t4, n3, r3) {
    for (var i3 = this._pt, a3; i3; ) a3 = i3._next, i3.p === r3 && i3.modifier(e20, t4, n3), i3 = a3;
  };
  var En = function(e20) {
    for (var t4 = this._pt, n3, r3; t4; ) r3 = t4._next, t4.p === e20 && !t4.op || t4.op === e20 ? Pe(this, t4, `_pt`) : t4.dep || (n3 = 1), t4 = r3;
    return !n3;
  };
  var Dn = function(e20, t4, n3, r3) {
    r3.mSet(e20, t4, r3.m.call(r3.tween, n3, r3.mt), r3);
  };
  var On = function(e20) {
    for (var t4 = e20._pt, n3, r3, i3, a3; t4; ) {
      for (n3 = t4._next, r3 = i3; r3 && r3.pr > t4.pr; ) r3 = r3._next;
      (t4._prev = r3 ? r3._prev : a3) ? t4._prev._next = t4 : i3 = t4, (t4._next = r3) ? r3._prev = t4 : a3 = t4, t4 = n3;
    }
    e20._pt = i3;
  };
  var X = (function() {
    function e20(e21, t5, n3, r3, i3, a3, o3, s3, c3) {
      this.t = t5, this.s = r3, this.c = i3, this.p = n3, this.r = a3 || xn, this.d = o3 || this, this.set = s3 || gn, this.pr = c3 || 0, this._next = e21, e21 && (e21._prev = this);
    }
    var t4 = e20.prototype;
    return t4.modifier = function(e21, t5, n3) {
      this.mSet = this.mSet || this.set, this.set = Dn, this.m = e21, this.mt = n3, this.tween = t5;
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
      var n3 = e21.queries, r3 = e21.conditions, i3, a3, o3, s3;
      for (a3 in n3) i3 = F.matchMedia(n3[a3]).matches, i3 && (o3 = 1), i3 !== r3[a3] && (r3[a3] = i3, s3 = 1);
      s3 && (e21.revert(), o3 && t4.push(e21));
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
    return t4.add = function(e21, t5, n3) {
      g(e21) && (n3 = t5, t5 = e21, e21 = g);
      var r3 = this, i3 = function() {
        var e22 = o, i4 = r3.selector, a3;
        return e22 && e22 !== r3 && e22.data.push(r3), n3 && (r3.selector = dt(n3)), o = r3, a3 = t5.apply(r3, arguments), g(a3) && r3._r.push(a3), o = e22, r3.selector = i4, r3.isReverted = false, a3;
      };
      return r3.last = i3, e21 === g ? i3(r3, function(e22) {
        return r3.add(null, e22);
      }) : e21 ? r3[e21] = i3 : i3;
    }, t4.ignore = function(e21) {
      var t5 = o;
      o = null, e21(this), o = t5;
    }, t4.getTweens = function() {
      var t5 = [];
      return this.data.forEach(function(n3) {
        return n3 instanceof e20 ? t5.push.apply(t5, n3.getTweens()) : n3 instanceof Y && !(n3.parent && n3.parent.data === `nested`) && t5.push(n3);
      }), t5;
    }, t4.clear = function() {
      this._r.length = this.data.length = 0;
    }, t4.kill = function(e21, t5) {
      var n3 = this;
      if (e21 ? (function() {
        for (var t6 = n3.getTweens(), r4 = n3.data.length, i3; r4--; ) i3 = n3.data[r4], i3.data === `isFlip` && (i3.revert(), i3.getChildren(true, true, false).forEach(function(e22) {
          return t6.splice(t6.indexOf(e22), 1);
        }));
        for (t6.map(function(e22) {
          return { g: e22._dur || e22._delay || e22._sat && !e22._sat.vars.immediateRender ? e22.globalTime(0) : -1 / 0, t: e22 };
        }).sort(function(e22, t7) {
          return t7.g - e22.g || -1 / 0;
        }).forEach(function(t7) {
          return t7.t.revert(e21);
        }), r4 = n3.data.length; r4--; ) i3 = n3.data[r4], i3 instanceof J ? i3.data !== `nested` && (i3.scrollTrigger && i3.scrollTrigger.revert(), i3.kill()) : !(i3 instanceof Y) && i3.revert && i3.revert(e21);
        n3._r.forEach(function(t7) {
          return t7(e21, n3);
        }), n3.isReverted = true;
      })() : this.data.forEach(function(e22) {
        return e22.kill && e22.kill();
      }), this.clear(), t5) for (var r3 = kn.length; r3--; ) kn[r3].id === this.id && kn.splice(r3, 1);
    }, t4.revert = function(e21) {
      this.kill(e21 || {});
    }, e20;
  })();
  var Ln = (function() {
    function e20(e21) {
      this.contexts = [], this.scope = e21, o && o.data.push(this);
    }
    var t4 = e20.prototype;
    return t4.add = function(e21, t5, n3) {
      y(e21) || (e21 = { matches: e21 });
      var r3 = new In(0, n3 || this.scope), i3 = r3.conditions = {}, a3, s3, c3;
      for (s3 in o && !r3.selector && (r3.selector = o.selector), this.contexts.push(r3), t5 = r3.add(`onMatch`, t5), r3.queries = e21, e21) s3 === `all` ? c3 = 1 : (a3 = F.matchMedia(e21[s3]), a3 && (kn.indexOf(r3) < 0 && kn.push(r3), (i3[s3] = a3.matches) && (c3 = 1), a3.addListener ? a3.addListener(Fn) : a3.addEventListener(`change`, Fn)));
      return c3 && t5(r3, function(e22) {
        return r3.add(null, e22);
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
  }, getProperty: function(e20, t4, n3, r3) {
    h(e20) && (e20 = ut(e20)[0]);
    var i3 = _e(e20 || {}).get, a3 = n3 ? Te : we;
    return n3 === `native` && (n3 = ``), e20 && (t4 ? a3((V[t4] && V[t4].get || i3)(e20, t4, n3, r3)) : function(t5, n4, r4) {
      return a3((V[t5] && V[t5].get || i3)(e20, t5, n4, r4));
    });
  }, quickSetter: function(e20, t4, n3) {
    if (e20 = ut(e20), e20.length > 1) {
      var r3 = e20.map(function(e21) {
        return Z.quickSetter(e21, t4, n3);
      }), i3 = r3.length;
      return function(e21) {
        for (var t5 = i3; t5--; ) r3[t5](e21);
      };
    }
    e20 = e20[0] || {};
    var a3 = V[t4], o3 = _e(e20), s3 = o3.harness && (o3.harness.aliases || {})[t4] || t4, c3 = a3 ? function(t5) {
      var r4 = new a3();
      kt._pt = 0, r4.init(e20, n3 ? t5 + n3 : t5, kt, 0, [e20]), r4.render(1, r4), kt._pt && wn(1, kt);
    } : o3.set(e20, s3);
    return a3 ? c3 : function(t5) {
      return c3(e20, s3, n3 ? t5 + n3 : t5, o3, 1);
    };
  }, quickTo: function(e20, t4, n3) {
    var r3, i3 = Z.to(e20, Ee((r3 = {}, r3[t4] = `+=0.1`, r3.paused = true, r3.stagger = 0, r3), n3 || {})), a3 = function(e21, n4, r4) {
      return i3.resetTo(t4, e21, n4, r4);
    };
    return a3.tween = i3, a3;
  }, isTweening: function(e20) {
    return P.getTweensOf(e20, true).length > 0;
  }, defaults: function(e20) {
    return e20 && e20.ease && (e20.ease = Yt(e20.ease, r.ease)), ke(r, e20 || {});
  }, config: function(e20) {
    return ke(n, e20 || {});
  }, registerEffect: function(e20) {
    var t4 = e20.name, n3 = e20.effect, r3 = e20.plugins, i3 = e20.defaults, a3 = e20.extendTimeline;
    (r3 || ``).split(`,`).forEach(function(e21) {
      return e21 && !V[e21] && !R[e21] && ne(t4 + ` effect requires ` + e21 + ` plugin.`);
    }), fe[t4] = function(e21, t5, r4) {
      return n3(ut(e21), Ee(t5 || {}, i3), r4);
    }, a3 && (J.prototype[t4] = function(e21, n4, r4) {
      return this.add(fe[t4](e21, y(n4) ? n4 : (r4 = n4) && {}, this), r4);
    });
  }, registerEase: function(e20, t4) {
    q[e20] = Yt(t4);
  }, parseEase: function(e20, t4) {
    return arguments.length ? Yt(e20, t4) : q;
  }, getById: function(e20) {
    return P.getById(e20);
  }, exportRoot: function(e20, t4) {
    e20 === void 0 && (e20 = {});
    var n3 = new J(e20), r3, i3;
    for (n3.smoothChildTiming = b(e20.smoothChildTiming), P.remove(n3), n3._dp = 0, n3._time = n3._tTime = P._time, r3 = P._first; r3; ) i3 = r3._next, (t4 || !(!r3._dur && r3 instanceof Y && r3.vars.onComplete === r3._targets[0])) && Ke(n3, r3, r3._start - r3._delay), r3 = i3;
    return Ke(P, n3, 0), n3;
  }, context: function(e20, t4) {
    return e20 ? new In(e20, t4) : o;
  }, matchMedia: function(e20) {
    return new Ln(e20);
  }, matchMediaRefresh: function() {
    return kn.forEach(function(e20) {
      var t4 = e20.conditions, n3, r3;
      for (r3 in t4) t4[r3] && (t4[r3] = false, n3 = 1);
      n3 && e20.revert();
    }) || Fn();
  }, addEventListener: function(e20, t4) {
    var n3 = An[e20] || (An[e20] = []);
    ~n3.indexOf(t4) || n3.push(t4);
  }, removeEventListener: function(e20, t4) {
    var n3 = An[e20], r3 = n3 && n3.indexOf(t4);
    r3 >= 0 && n3.splice(r3, 1);
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
    for (var n3 = e20._pt; n3 && n3.p !== t4 && n3.op !== t4 && n3.fp !== t4; ) n3 = n3._next;
    return n3;
  };
  var Bn = function(e20, t4) {
    var n3 = e20._targets, r3, i3, a3;
    for (r3 in t4) for (i3 = n3.length; i3--; ) a3 = e20._ptLookup[i3][r3], a3 && (a3 = a3.d) && (a3._pt && (a3 = zn(a3, r3)), a3 && a3.modifier && a3.modifier(t4[r3], e20, n3[i3], r3));
  };
  var Vn = function(e20, t4) {
    return { name: e20, headless: 1, rawVars: 1, init: function(e21, n3, r3) {
      r3._onInit = function(e22) {
        var r4, i3;
        if (h(n3) && (r4 = {}, H(n3, function(e23) {
          return r4[e23] = 1;
        }), n3 = r4), t4) {
          for (i3 in r4 = {}, n3) r4[i3] = t4(n3[i3]);
          n3 = r4;
        }
        Bn(e22, n3);
      };
    } };
  };
  var Z = Rn.registerPlugin({ name: `attr`, init: function(e20, t4, n3, r3, i3) {
    var a3, o3, s3;
    for (a3 in this.tween = n3, t4) s3 = e20.getAttribute(a3) || ``, o3 = this.add(e20, `setAttribute`, (s3 || 0) + ``, t4[a3], r3, i3, 0, 0, a3), o3.op = a3, o3.b = s3, this._props.push(a3);
  }, render: function(e20, t4) {
    for (var n3 = t4._pt; n3; ) a ? n3.set(n3.t, n3.p, n3.b, n3) : n3.r(e20, n3.d), n3 = n3._next;
  } }, { name: `endArray`, headless: 1, init: function(e20, t4) {
    for (var n3 = t4.length; n3--; ) this.add(e20, n3, e20[n3] || 0, t4[n3], 0, 0, 0, 0, 0, 1);
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
    var n3 = t4.s + t4.c * e20;
    t4.set(t4.t, t4.p, ~~(n3 + (n3 < 0 ? -0.5 : 0.5)) + t4.u, t4);
  };
  var ur = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 ? t4.e : t4.b, t4);
  };
  var dr = function(e20, t4) {
    return t4.set(t4.t, t4.p, e20 === 1 ? t4.e : t4.b, t4);
  };
  var fr = function(e20, t4, n3) {
    return e20.style[t4] = n3;
  };
  var pr = function(e20, t4, n3) {
    return e20.style.setProperty(t4, n3);
  };
  var mr = function(e20, t4, n3) {
    return e20._gsap[t4] = n3;
  };
  var hr = function(e20, t4, n3) {
    return e20._gsap.scaleX = e20._gsap.scaleY = n3;
  };
  var gr = function(e20, t4, n3, r3, i3) {
    var a3 = e20._gsap;
    a3.scaleX = a3.scaleY = n3, a3.renderTransform(i3, a3);
  };
  var _r = function(e20, t4, n3, r3, i3) {
    var a3 = e20._gsap;
    a3[t4] = n3, a3.renderTransform(i3, a3);
  };
  var Q = `transform`;
  var $ = Q + `Origin`;
  var vr = function e12(t4, n3) {
    var r3 = this, i3 = this.target, a3 = i3.style, o3 = i3._gsap;
    if (t4 in Xn && a3) {
      if (this.tfm = this.tfm || {}, t4 !== `transform`) t4 = ir[t4] || t4, ~t4.indexOf(`,`) ? t4.split(`,`).forEach(function(e20) {
        return r3.tfm[e20] = Lr(i3, e20);
      }) : this.tfm[t4] = o3.x ? o3[t4] : Lr(i3, t4), t4 === $ && (this.tfm.zOrigin = o3.zOrigin);
      else return ir.transform.split(`,`).forEach(function(t5) {
        return e12.call(r3, t5, n3);
      });
      if (this.props.indexOf(Q) >= 0) return;
      o3.svg && (this.svgo = i3.getAttribute(`data-svg-origin`), this.props.push($, n3, ``)), t4 = Q;
    }
    (a3 || n3) && this.props.push(t4, n3, a3[t4]);
  };
  var yr = function(e20) {
    e20.translate && (e20.removeProperty(`translate`), e20.removeProperty(`scale`), e20.removeProperty(`rotate`));
  };
  var br = function() {
    var e20 = this.props, t4 = this.target, n3 = t4.style, r3 = t4._gsap, i3, a3;
    for (i3 = 0; i3 < e20.length; i3 += 3) e20[i3 + 1] ? e20[i3 + 1] === 2 ? t4[e20[i3]](e20[i3 + 2]) : t4[e20[i3]] = e20[i3 + 2] : e20[i3 + 2] ? n3[e20[i3]] = e20[i3 + 2] : n3.removeProperty(e20[i3].substr(0, 2) === `--` ? e20[i3] : e20[i3].replace(tr, `-$1`).toLowerCase());
    if (this.tfm) {
      for (a3 in this.tfm) r3[a3] = this.tfm[a3];
      r3.svg && (r3.renderTransform(), t4.setAttribute(`data-svg-origin`, this.svgo || ``)), i3 = Jn(), (!i3 || !i3.isStart) && !n3[Q] && (yr(n3), r3.zOrigin && n3[$] && (n3[$] += ` ` + r3.zOrigin + `px`, r3.zOrigin = 0, r3.renderTransform()), r3.uncache = 1);
    }
  };
  var xr = function(e20, t4) {
    var n3 = { target: e20, props: [], revert: br, save: vr };
    return e20._gsap || Z.core.getCache(e20), t4 && e20.style && e20.nodeType && t4.split(`,`).forEach(function(e21) {
      return n3.save(e21);
    }), n3;
  };
  var Sr;
  var Cr = function(e20, t4) {
    var n3 = Un.createElementNS ? Un.createElementNS((t4 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e20) : Un.createElement(e20);
    return n3 && n3.style ? n3 : Un.createElement(e20);
  };
  var wr = function e13(t4, n3, r3) {
    var i3 = getComputedStyle(t4);
    return i3[n3] || i3.getPropertyValue(n3.replace(tr, `-$1`).toLowerCase()) || i3.getPropertyValue(n3) || !r3 && e13(t4, Er(n3) || n3, 1) || ``;
  };
  var Tr = `O,Moz,ms,Ms,Webkit`.split(`,`);
  var Er = function(e20, t4, n3) {
    var r3 = (t4 || Kn).style, i3 = 5;
    if (e20 in r3 && !n3) return e20;
    for (e20 = e20.charAt(0).toUpperCase() + e20.substr(1); i3-- && !(Tr[i3] + e20 in r3); ) ;
    return i3 < 0 ? null : (i3 === 3 ? `ms` : i3 >= 0 ? Tr[i3] : ``) + e20;
  };
  var Dr = function() {
    Yn() && window.document && (Hn = window, Un = Hn.document, Wn = Un.documentElement, Kn = Cr(`div`) || { style: {} }, Cr(`div`), Q = Er(Q), $ = Q + `Origin`, Kn.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`, Sr = !!Er(`perspective`), Jn = Z.core.reverting, Gn = 1);
  };
  var Or = function(e20) {
    var t4 = e20.ownerSVGElement, n3 = Cr(`svg`, t4 && t4.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg`), r3 = e20.cloneNode(true), i3;
    r3.style.display = `block`, n3.appendChild(r3), Wn.appendChild(n3);
    try {
      i3 = r3.getBBox();
    } catch {
    }
    return n3.removeChild(r3), Wn.removeChild(n3), i3;
  };
  var kr = function(e20, t4) {
    for (var n3 = t4.length; n3--; ) if (e20.hasAttribute(t4[n3])) return e20.getAttribute(t4[n3]);
  };
  var Ar = function(e20) {
    var t4, n3;
    try {
      t4 = e20.getBBox();
    } catch {
      t4 = Or(e20), n3 = 1;
    }
    return t4 && (t4.width || t4.height) || n3 || (t4 = Or(e20)), t4 && !t4.width && !t4.x && !t4.y ? { x: +kr(e20, [`x`, `cx`, `x1`]) || 0, y: +kr(e20, [`y`, `cy`, `y1`]) || 0, width: 0, height: 0 } : t4;
  };
  var jr = function(e20) {
    return !!(e20.getCTM && (!e20.parentNode || e20.ownerSVGElement) && Ar(e20));
  };
  var Mr = function(e20, t4) {
    if (t4) {
      var n3 = e20.style, r3;
      t4 in Xn && t4 !== $ && (t4 = Q), n3.removeProperty ? (r3 = t4.substr(0, 2), (r3 === `ms` || t4.substr(0, 6) === `webkit`) && (t4 = `-` + t4), n3.removeProperty(r3 === `--` ? t4 : t4.replace(tr, `-$1`).toLowerCase())) : n3.removeAttribute(t4);
    }
  };
  var Nr = function(e20, t4, n3, r3, i3, a3) {
    var o3 = new X(e20._pt, t4, n3, 0, 1, a3 ? dr : ur);
    return e20._pt = o3, o3.b = r3, o3.e = i3, e20._props.push(n3), o3;
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
  var Lr = function(e20, t4, n3, r3) {
    var i3;
    return Gn || Dr(), t4 in ir && t4 !== `transform` && (t4 = ir[t4], ~t4.indexOf(`,`) && (t4 = t4.split(`,`)[0])), Xn[t4] && t4 !== `transform` ? (i3 = Yr(e20, r3), i3 = t4 === `transformOrigin` ? i3.svg ? i3.origin : Xr(wr(e20, $)) + ` ` + i3.zOrigin + `px` : i3[t4]) : (i3 = e20.style[t4], (!i3 || i3 === `auto` || r3 || ~(i3 + ``).indexOf(`calc(`)) && (i3 = Hr[t4] && Hr[t4](e20, t4, n3) || wr(e20, t4) || ve(e20, t4) || +(t4 === `opacity`))), n3 && !~(i3 + ``).trim().indexOf(` `) ? Ir(e20, t4, i3, n3) + n3 : i3;
  };
  var Rr = function(e20, t4, r3, i3) {
    if (!r3 || r3 === `none`) {
      var a3 = Er(t4, e20, 1), o3 = a3 && wr(e20, a3, 1);
      o3 && o3 !== r3 ? (t4 = a3, r3 = o3) : t4 === `borderColor` && (r3 = wr(e20, `borderTopColor`));
    }
    var s3 = new X(this._pt, e20.style, t4, 0, 1, Cn), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
    if (s3.b = r3, s3.e = i3, r3 += ``, i3 += ``, i3.substring(0, 6) === `var(--` && (i3 = wr(e20, i3.substring(4, i3.indexOf(`)`)))), i3 === `auto` && (h3 = e20.style[t4], e20.style[t4] = i3, i3 = wr(e20, t4) || i3, h3 ? e20.style[t4] = h3 : Mr(e20, t4)), u3 = [r3, i3], zt(u3), r3 = u3[0], i3 = u3[1], f3 = r3.match(k) || [], x3 = i3.match(k) || [], x3.length) {
      for (; d3 = k.exec(i3); ) g3 = d3[0], v3 = i3.substring(c3, d3.index), m3 ? m3 = (m3 + 1) % 5 : (v3.substr(-5) === `rgba(` || v3.substr(-5) === `hsla(`) && (m3 = 1), g3 !== (h3 = f3[l3++] || ``) && (p3 = parseFloat(h3) || 0, b3 = h3.substr((p3 + ``).length), g3.charAt(1) === `=` && (g3 = ye(p3, g3) + b3), _3 = parseFloat(g3), y3 = g3.substr((_3 + ``).length), c3 = k.lastIndex - y3.length, y3 || (y3 = y3 || n.units[t4] || b3, c3 === i3.length && (i3 += y3, s3.e += y3)), b3 !== y3 && (p3 = Ir(e20, t4, h3, y3) || 0), s3._pt = { _next: s3._pt, p: v3 || l3 === 1 ? v3 : `,`, s: p3, c: _3 - p3, m: m3 && m3 < 4 || t4 === `zIndex` ? Math.round : 0 });
      s3.c = c3 < i3.length ? i3.substring(c3, i3.length) : ``;
    } else s3.r = t4 === `display` && i3 === `none` ? dr : ur;
    return j.test(i3) && (s3.e = 0), this._pt = s3, s3;
  };
  var zr = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` };
  var Br = function(e20) {
    var t4 = e20.split(` `), n3 = t4[0], r3 = t4[1] || `50%`;
    return (n3 === `top` || n3 === `bottom` || r3 === `left` || r3 === `right`) && (e20 = n3, n3 = r3, r3 = e20), t4[0] = zr[n3] || n3, t4[1] = zr[r3] || r3, t4.join(` `);
  };
  var Vr = function(e20, t4) {
    if (t4.tween && t4.tween._time === t4.tween._dur) {
      var n3 = t4.t, r3 = n3.style, i3 = t4.u, a3 = n3._gsap, o3, s3, c3;
      if (i3 === `all` || i3 === true) r3.cssText = ``, s3 = 1;
      else for (i3 = i3.split(`,`), c3 = i3.length; --c3 > -1; ) o3 = i3[c3], Xn[o3] && (s3 = 1, o3 = o3 === `transformOrigin` ? $ : Q), Mr(n3, o3);
      s3 && (Mr(n3, Q), a3 && (a3.svg && n3.removeAttribute(`transform`), r3.scale = r3.rotate = r3.translate = `none`, Yr(n3, 1), a3.uncache = 1, yr(r3)));
    }
  };
  var Hr = { clearProps: function(e20, t4, n3, r3, i3) {
    if (i3.data !== `isFromStart`) {
      var a3 = e20._pt = new X(e20._pt, t4, n3, 0, 0, Vr);
      return a3.u = r3, a3.pr = -10, a3.tween = i3, e20._props.push(n3), 1;
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
    var n3 = e20._gsap || _e(e20), r3 = e20.style, i3 = Kr(e20), a3, o3, s3, c3;
    return n3.svg && e20.getAttribute(`transform`) ? (s3 = e20.transform.baseVal.consolidate().matrix, i3 = [s3.a, s3.b, s3.c, s3.d, s3.e, s3.f], i3.join(`,`) === `1,0,0,1,0,0` ? Ur : i3) : (i3 === Ur && !e20.offsetParent && e20 !== Wn && !n3.svg && (s3 = r3.display, r3.display = `block`, a3 = e20.parentNode, (!a3 || !e20.offsetParent && !e20.getBoundingClientRect().width) && (c3 = 1, o3 = e20.nextElementSibling, Wn.appendChild(e20)), i3 = Kr(e20), s3 ? r3.display = s3 : Mr(e20, `display`), c3 && (o3 ? a3.insertBefore(e20, o3) : a3 ? a3.appendChild(e20) : Wn.removeChild(e20))), t4 && i3.length > 6 ? [i3[0], i3[1], i3[4], i3[5], i3[12], i3[13]] : i3);
  };
  var Jr = function(e20, t4, n3, r3, i3, a3) {
    var o3 = e20._gsap, s3 = i3 || qr(e20, true), c3 = o3.xOrigin || 0, l3 = o3.yOrigin || 0, u3 = o3.xOffset || 0, d3 = o3.yOffset || 0, f3 = s3[0], p3 = s3[1], m3 = s3[2], h3 = s3[3], g3 = s3[4], _3 = s3[5], v3 = t4.split(` `), y3 = parseFloat(v3[0]) || 0, b3 = parseFloat(v3[1]) || 0, x3, S3, C3, w3;
    n3 ? s3 !== Ur && (S3 = f3 * h3 - p3 * m3) && (C3 = h3 / S3 * y3 + b3 * (-m3 / S3) + (m3 * _3 - h3 * g3) / S3, w3 = y3 * (-p3 / S3) + f3 / S3 * b3 - (f3 * _3 - p3 * g3) / S3, y3 = C3, b3 = w3) : (x3 = Ar(e20), y3 = x3.x + (~v3[0].indexOf(`%`) ? y3 / 100 * x3.width : y3), b3 = x3.y + (~(v3[1] || v3[0]).indexOf(`%`) ? b3 / 100 * x3.height : b3)), r3 || r3 !== false && o3.smooth ? (g3 = y3 - c3, _3 = b3 - l3, o3.xOffset = u3 + (g3 * f3 + _3 * m3) - g3, o3.yOffset = d3 + (g3 * p3 + _3 * h3) - _3) : o3.xOffset = o3.yOffset = 0, o3.xOrigin = y3, o3.yOrigin = b3, o3.smooth = !!r3, o3.origin = t4, o3.originIsAbsolute = !!n3, e20.style[$] = `0px 0px`, a3 && (Nr(a3, o3, `xOrigin`, c3, y3), Nr(a3, o3, `yOrigin`, l3, b3), Nr(a3, o3, `xOffset`, u3, o3.xOffset), Nr(a3, o3, `yOffset`, d3, o3.yOffset)), e20.setAttribute(`data-svg-origin`, y3 + ` ` + b3);
  };
  var Yr = function(e20, t4) {
    var r3 = e20._gsap || new en(e20);
    if (`x` in r3 && !t4 && !r3.uncache) return r3;
    var i3 = e20.style, a3 = r3.scaleX < 0, o3 = `px`, s3 = `deg`, c3 = getComputedStyle(e20), l3 = wr(e20, $) || `0`, u3 = d3 = f3 = h3 = g3 = _3 = v3 = y3 = b3 = 0, d3, f3, p3 = m3 = 1, m3, h3, g3, _3, v3, y3, b3, x3, S3, C3, w3, T3, E3, D3, O3, k3, A3, j3, M3, N3, P3, F3, I3, L3, R3, z3, B3, ee3;
    return r3.svg = !!(e20.getCTM && jr(e20)), c3.translate && ((c3.translate !== `none` || c3.scale !== `none` || c3.rotate !== `none`) && (i3[Q] = (c3.translate === `none` ? `` : `translate3d(` + (c3.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) + `) `) + (c3.rotate === `none` ? `` : `rotate(` + c3.rotate + `) `) + (c3.scale === `none` ? `` : `scale(` + c3.scale.split(` `).join(`,`) + `) `) + (c3[Q] === `none` ? `` : c3[Q])), i3.scale = i3.rotate = i3.translate = `none`), C3 = qr(e20, r3.svg), r3.svg && (r3.uncache ? (P3 = e20.getBBox(), l3 = r3.xOrigin - P3.x + `px ` + (r3.yOrigin - P3.y) + `px`, N3 = ``) : N3 = !t4 && e20.getAttribute(`data-svg-origin`), Jr(e20, N3 || l3, !!N3 || r3.originIsAbsolute, r3.smooth !== false, C3)), x3 = r3.xOrigin || 0, S3 = r3.yOrigin || 0, C3 !== Ur && (D3 = C3[0], O3 = C3[1], k3 = C3[2], A3 = C3[3], u3 = j3 = C3[4], d3 = M3 = C3[5], C3.length === 6 ? (p3 = Math.sqrt(D3 * D3 + O3 * O3), m3 = Math.sqrt(A3 * A3 + k3 * k3), h3 = D3 || O3 ? $n(O3, D3) * Zn : 0, v3 = k3 || A3 ? $n(k3, A3) * Zn + h3 : 0, v3 && (m3 *= Math.abs(Math.cos(v3 * Qn))), r3.svg && (u3 -= x3 - (x3 * D3 + S3 * k3), d3 -= S3 - (x3 * O3 + S3 * A3))) : (ee3 = C3[6], z3 = C3[7], I3 = C3[8], L3 = C3[9], R3 = C3[10], B3 = C3[11], u3 = C3[12], d3 = C3[13], f3 = C3[14], w3 = $n(ee3, R3), g3 = w3 * Zn, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N3 = j3 * T3 + I3 * E3, P3 = M3 * T3 + L3 * E3, F3 = ee3 * T3 + R3 * E3, I3 = j3 * -E3 + I3 * T3, L3 = M3 * -E3 + L3 * T3, R3 = ee3 * -E3 + R3 * T3, B3 = z3 * -E3 + B3 * T3, j3 = N3, M3 = P3, ee3 = F3), w3 = $n(-k3, R3), _3 = w3 * Zn, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N3 = D3 * T3 - I3 * E3, P3 = O3 * T3 - L3 * E3, F3 = k3 * T3 - R3 * E3, B3 = A3 * E3 + B3 * T3, D3 = N3, O3 = P3, k3 = F3), w3 = $n(O3, D3), h3 = w3 * Zn, w3 && (T3 = Math.cos(w3), E3 = Math.sin(w3), N3 = D3 * T3 + O3 * E3, P3 = j3 * T3 + M3 * E3, O3 = O3 * T3 - D3 * E3, M3 = M3 * T3 - j3 * E3, D3 = N3, j3 = P3), g3 && Math.abs(g3) + Math.abs(h3) > 359.9 && (g3 = h3 = 0, _3 = 180 - _3), p3 = U(Math.sqrt(D3 * D3 + O3 * O3 + k3 * k3)), m3 = U(Math.sqrt(M3 * M3 + ee3 * ee3)), w3 = $n(j3, M3), v3 = Math.abs(w3) > 2e-4 ? w3 * Zn : 0, b3 = B3 ? 1 / (B3 < 0 ? -B3 : B3) : 0), r3.svg && (N3 = e20.getAttribute(`transform`), r3.forceCSS = e20.setAttribute(`transform`, ``) || !Gr(wr(e20, Q)), N3 && e20.setAttribute(`transform`, N3))), Math.abs(v3) > 90 && Math.abs(v3) < 270 && (a3 ? (p3 *= -1, v3 += h3 <= 0 ? 180 : -180, h3 += h3 <= 0 ? 180 : -180) : (m3 *= -1, v3 += v3 <= 0 ? 180 : -180)), t4 || (t4 = r3.uncache), r3.x = u3 - ((r3.xPercent = u3 && (!t4 && r3.xPercent || (Math.round(e20.offsetWidth / 2) === Math.round(-u3) ? -50 : 0))) ? e20.offsetWidth * r3.xPercent / 100 : 0) + o3, r3.y = d3 - ((r3.yPercent = d3 && (!t4 && r3.yPercent || (Math.round(e20.offsetHeight / 2) === Math.round(-d3) ? -50 : 0))) ? e20.offsetHeight * r3.yPercent / 100 : 0) + o3, r3.z = f3 + o3, r3.scaleX = U(p3), r3.scaleY = U(m3), r3.rotation = U(h3) + s3, r3.rotationX = U(g3) + s3, r3.rotationY = U(_3) + s3, r3.skewX = v3 + s3, r3.skewY = y3 + s3, r3.transformPerspective = b3 + o3, (r3.zOrigin = parseFloat(l3.split(` `)[2]) || !t4 && r3.zOrigin || 0) && (i3[$] = Xr(l3)), r3.xOffset = r3.yOffset = 0, r3.force3D = n.force3D, r3.renderTransform = r3.svg ? ri : Sr ? ni : Qr, r3.uncache = 0, r3;
  };
  var Xr = function(e20) {
    return (e20 = e20.split(` `))[0] + ` ` + e20[1];
  };
  var Zr = function(e20, t4, n3) {
    var r3 = G(t4);
    return U(parseFloat(t4) + parseFloat(Ir(e20, `x`, n3 + `px`, r3))) + r3;
  };
  var Qr = function(e20, t4) {
    t4.z = `0px`, t4.rotationY = t4.rotationX = `0deg`, t4.force3D = 0, ni(e20, t4);
  };
  var $r = `0deg`;
  var ei = `0px`;
  var ti = `) `;
  var ni = function(e20, t4) {
    var n3 = t4 || this, r3 = n3.xPercent, i3 = n3.yPercent, a3 = n3.x, o3 = n3.y, s3 = n3.z, c3 = n3.rotation, l3 = n3.rotationY, u3 = n3.rotationX, d3 = n3.skewX, f3 = n3.skewY, p3 = n3.scaleX, m3 = n3.scaleY, h3 = n3.transformPerspective, g3 = n3.force3D, _3 = n3.target, v3 = n3.zOrigin, y3 = ``, b3 = g3 === `auto` && e20 && e20 !== 1 || g3 === true;
    if (v3 && (u3 !== $r || l3 !== $r)) {
      var x3 = parseFloat(l3) * Qn, S3 = Math.sin(x3), C3 = Math.cos(x3), w3;
      x3 = parseFloat(u3) * Qn, w3 = Math.cos(x3), a3 = Zr(_3, a3, S3 * w3 * -v3), o3 = Zr(_3, o3, -Math.sin(x3) * -v3), s3 = Zr(_3, s3, C3 * w3 * -v3 + v3);
    }
    h3 !== ei && (y3 += `perspective(` + h3 + ti), (r3 || i3) && (y3 += `translate(` + r3 + `%, ` + i3 + `%) `), (b3 || a3 !== ei || o3 !== ei || s3 !== ei) && (y3 += s3 !== ei || b3 ? `translate3d(` + a3 + `, ` + o3 + `, ` + s3 + `) ` : `translate(` + a3 + `, ` + o3 + ti), c3 !== $r && (y3 += `rotate(` + c3 + ti), l3 !== $r && (y3 += `rotateY(` + l3 + ti), u3 !== $r && (y3 += `rotateX(` + u3 + ti), (d3 !== $r || f3 !== $r) && (y3 += `skew(` + d3 + `, ` + f3 + ti), (p3 !== 1 || m3 !== 1) && (y3 += `scale(` + p3 + `, ` + m3 + ti), _3.style[Q] = y3 || `translate(0, 0)`;
  };
  var ri = function(e20, t4) {
    var n3 = t4 || this, r3 = n3.xPercent, i3 = n3.yPercent, a3 = n3.x, o3 = n3.y, s3 = n3.rotation, c3 = n3.skewX, l3 = n3.skewY, u3 = n3.scaleX, d3 = n3.scaleY, f3 = n3.target, p3 = n3.xOrigin, m3 = n3.yOrigin, h3 = n3.xOffset, g3 = n3.yOffset, _3 = n3.forceCSS, v3 = parseFloat(a3), y3 = parseFloat(o3), b3, x3, S3, C3, w3;
    s3 = parseFloat(s3), c3 = parseFloat(c3), l3 = parseFloat(l3), l3 && (l3 = parseFloat(l3), c3 += l3, s3 += l3), s3 || c3 ? (s3 *= Qn, c3 *= Qn, b3 = Math.cos(s3) * u3, x3 = Math.sin(s3) * u3, S3 = Math.sin(s3 - c3) * -d3, C3 = Math.cos(s3 - c3) * d3, c3 && (l3 *= Qn, w3 = Math.tan(c3 - l3), w3 = Math.sqrt(1 + w3 * w3), S3 *= w3, C3 *= w3, l3 && (w3 = Math.tan(l3), w3 = Math.sqrt(1 + w3 * w3), b3 *= w3, x3 *= w3)), b3 = U(b3), x3 = U(x3), S3 = U(S3), C3 = U(C3)) : (b3 = u3, C3 = d3, x3 = S3 = 0), (v3 && !~(a3 + ``).indexOf(`px`) || y3 && !~(o3 + ``).indexOf(`px`)) && (v3 = Ir(f3, `x`, a3, `px`), y3 = Ir(f3, `y`, o3, `px`)), (p3 || m3 || h3 || g3) && (v3 = U(v3 + p3 - (p3 * b3 + m3 * S3) + h3), y3 = U(y3 + m3 - (p3 * x3 + m3 * C3) + g3)), (r3 || i3) && (w3 = f3.getBBox(), v3 = U(v3 + r3 / 100 * w3.width), y3 = U(y3 + i3 / 100 * w3.height)), w3 = `matrix(` + b3 + `,` + x3 + `,` + S3 + `,` + C3 + `,` + v3 + `,` + y3 + `)`, f3.setAttribute(`transform`, w3), _3 && (f3.style[Q] = w3);
  };
  var ii = function(e20, t4, n3, r3, i3) {
    var a3 = 360, o3 = h(i3), s3 = parseFloat(i3) * (o3 && ~i3.indexOf(`rad`) ? Zn : 1) - r3, c3 = r3 + s3 + `deg`, l3, u3;
    return o3 && (l3 = i3.split(`_`)[1], l3 === `short` && (s3 %= a3, s3 !== s3 % (a3 / 2) && (s3 += s3 < 0 ? a3 : -a3)), l3 === `cw` && s3 < 0 ? s3 = (s3 + a3 * er) % a3 - ~~(s3 / a3) * a3 : l3 === `ccw` && s3 > 0 && (s3 = (s3 - a3 * er) % a3 - ~~(s3 / a3) * a3)), e20._pt = u3 = new X(e20._pt, t4, n3, r3, s3, or), u3.e = c3, u3.u = `deg`, e20._props.push(n3), u3;
  };
  var ai = function(e20, t4) {
    for (var n3 in t4) e20[n3] = t4[n3];
    return e20;
  };
  var oi = function(e20, t4, n3) {
    var r3 = ai({}, n3._gsap), i3 = `perspective,force3D,transformOrigin,svgOrigin`, a3 = n3.style, o3, s3, c3, l3, u3, d3, f3, p3;
    for (s3 in r3.svg ? (c3 = n3.getAttribute(`transform`), n3.setAttribute(`transform`, ``), a3[Q] = t4, o3 = Yr(n3, 1), Mr(n3, Q), n3.setAttribute(`transform`, c3)) : (c3 = getComputedStyle(n3)[Q], a3[Q] = t4, o3 = Yr(n3, 1), a3[Q] = c3), Xn) c3 = r3[s3], l3 = o3[s3], c3 !== l3 && i3.indexOf(s3) < 0 && (f3 = G(c3), p3 = G(l3), u3 = f3 === p3 ? parseFloat(c3) : Ir(n3, s3, c3, p3), d3 = parseFloat(l3), e20._pt = new X(e20._pt, o3, s3, u3, d3 - u3, ar), e20._pt.u = p3 || 0, e20._props.push(s3));
    ai(o3, r3);
  };
  H(`padding,margin,Width,Radius`, function(e20, t4) {
    var n3 = `Top`, r3 = `Right`, i3 = `Bottom`, a3 = `Left`, o3 = (t4 < 3 ? [n3, r3, i3, a3] : [n3 + a3, n3 + r3, i3 + r3, i3 + a3]).map(function(n4) {
      return t4 < 2 ? e20 + n4 : `border` + n4 + e20;
    });
    Hr[t4 > 1 ? `border` + e20 : e20] = function(e21, t5, n4, r4, i4) {
      var a4, s3;
      if (arguments.length < 4) return a4 = o3.map(function(t6) {
        return Lr(e21, t6, n4);
      }), s3 = a4.join(` `), s3.split(a4[0]).length === 5 ? a4[0] : s3;
      a4 = (r4 + ``).split(` `), s3 = {}, o3.forEach(function(e22, t6) {
        return s3[e22] = a4[t6] = a4[t6] || a4[(t6 - 1) / 2 | 0];
      }), e21.init(t5, s3, i4);
    };
  });
  var si = { name: `css`, register: Dr, targetTest: function(e20) {
    return e20.style && e20.nodeType;
  }, init: function(e20, t4, r3, i3, a3) {
    var o3 = this._props, s3 = e20.style, c3 = r3.vars.startAt, l3, u3, d3, f3, p3, m3, g3, _3, v3, y3, b3, x3, S3, C3, w3, T3, E3;
    for (g3 in Gn || Dr(), this.styles = this.styles || xr(e20), T3 = this.styles.props, this.tween = r3, t4) if (g3 !== `autoRound` && (u3 = t4[g3], !(V[g3] && on(g3, t4, r3, i3, e20, a3)))) {
      if (p3 = typeof u3, m3 = Hr[g3], p3 === `function` && (u3 = u3.call(r3, i3, e20, a3), p3 = typeof u3), p3 === `string` && ~u3.indexOf(`random(`) && (u3 = Ct(u3)), m3) m3(this, e20, g3, u3, r3) && (w3 = 1);
      else if (g3.substr(0, 2) === `--`) l3 = (getComputedStyle(e20).getPropertyValue(g3) + ``).trim(), u3 += ``, Lt.lastIndex = 0, Lt.test(l3) || (_3 = G(l3), v3 = G(u3), v3 ? _3 !== v3 && (l3 = Ir(e20, g3, l3, v3) + v3) : _3 && (u3 += _3)), this.add(s3, `setProperty`, l3, u3, i3, a3, 0, 0, g3), o3.push(g3), T3.push(g3, 0, s3[g3]);
      else if (p3 !== `undefined`) {
        if (c3 && g3 in c3 ? (l3 = typeof c3[g3] == `function` ? c3[g3].call(r3, i3, e20, a3) : c3[g3], h(l3) && ~l3.indexOf(`random(`) && (l3 = Ct(l3)), G(l3 + ``) || l3 === `auto` || (l3 += n.units[g3] || G(Lr(e20, g3)) || ``), (l3 + ``).charAt(1) === `=` && (l3 = Lr(e20, g3))) : l3 = Lr(e20, g3), f3 = parseFloat(l3), y3 = p3 === `string` && u3.charAt(1) === `=` && u3.substr(0, 2), y3 && (u3 = u3.substr(2)), d3 = parseFloat(u3), g3 in ir && (g3 === `autoAlpha` && (f3 === 1 && Lr(e20, `visibility`) === `hidden` && d3 && (f3 = 0), T3.push(`visibility`, 0, s3.visibility), Nr(this, s3, `visibility`, f3 ? `inherit` : `hidden`, d3 ? `inherit` : `hidden`, !d3)), g3 !== `scale` && g3 !== `transform` && (g3 = ir[g3], ~g3.indexOf(`,`) && (g3 = g3.split(`,`)[0]))), b3 = g3 in Xn, b3) {
          if (this.styles.save(g3), E3 = u3, p3 === `string` && u3.substring(0, 6) === `var(--`) {
            if (u3 = wr(e20, u3.substring(4, u3.indexOf(`)`))), u3.substring(0, 5) === `calc(`) {
              var D3 = e20.style.perspective;
              e20.style.perspective = u3, u3 = wr(e20, `perspective`), D3 ? e20.style.perspective = D3 : Mr(e20, `perspective`);
            }
            d3 = parseFloat(u3);
          }
          if (x3 || (S3 = e20._gsap, S3.renderTransform && !t4.parseTransform || Yr(e20, t4.parseTransform), C3 = t4.smoothOrigin !== false && S3.smooth, x3 = this._pt = new X(this._pt, s3, Q, 0, 1, S3.renderTransform, S3, 0, -1), x3.dep = 1), g3 === `scale`) this._pt = new X(this._pt, S3, `scaleY`, S3.scaleY, (y3 ? ye(S3.scaleY, y3 + d3) : d3) - S3.scaleY || 0, ar), this._pt.u = 0, o3.push(`scaleY`, g3), g3 += `X`;
          else if (g3 === `transformOrigin`) {
            T3.push($, 0, s3[$]), u3 = Br(u3), S3.svg ? Jr(e20, u3, 0, C3, 0, this) : (v3 = parseFloat(u3.split(` `)[2]) || 0, v3 !== S3.zOrigin && Nr(this, S3, `zOrigin`, S3.zOrigin, v3), Nr(this, s3, g3, Xr(l3), Xr(u3)));
            continue;
          } else if (g3 === `svgOrigin`) {
            Jr(e20, u3, 1, C3, 0, this);
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
            oi(this, u3, e20);
            continue;
          }
        } else g3 in s3 || (g3 = Er(g3) || g3);
        if (b3 || (d3 || d3 === 0) && (f3 || f3 === 0) && !rr.test(u3) && g3 in s3) _3 = (l3 + ``).substr((f3 + ``).length), d3 || (d3 = 0), v3 = G(u3) || (g3 in n.units ? n.units[g3] : _3), _3 !== v3 && (f3 = Ir(e20, g3, l3, v3)), this._pt = new X(this._pt, b3 ? S3 : s3, g3, f3, (y3 ? ye(f3, y3 + d3) : d3) - f3, !b3 && (v3 === `px` || g3 === `zIndex`) && t4.autoRound !== false ? lr : ar), this._pt.u = v3 || 0, b3 && E3 !== u3 ? (this._pt.b = l3, this._pt.e = E3, this._pt.r = cr) : _3 !== v3 && v3 !== `%` && (this._pt.b = l3, this._pt.r = sr);
        else if (g3 in s3) Rr.call(this, e20, g3, l3, y3 ? y3 + u3 : u3);
        else if (g3 in e20) this.add(e20, g3, l3 || e20[g3], y3 ? y3 + u3 : u3, i3, a3);
        else if (g3 !== `parseTransform`) {
          te(g3, u3);
          continue;
        }
        b3 || (g3 in s3 ? T3.push(g3, 0, s3[g3]) : typeof e20[g3] == `function` ? T3.push(g3, 2, e20[g3]()) : T3.push(g3, 1, l3 || e20[g3])), o3.push(g3);
      }
    }
    w3 && On(this);
  }, render: function(e20, t4) {
    if (t4.tween._time || !Jn()) for (var n3 = t4._pt; n3; ) n3.r(e20, n3.d), n3 = n3._next;
    else t4.styles.revert();
  }, get: Lr, aliases: ir, getSetter: function(e20, t4, n3) {
    var r3 = ir[t4];
    return r3 && r3.indexOf(`,`) < 0 && (t4 = r3), t4 in Xn && t4 !== $ && (e20._gsap.x || Lr(e20, `x`)) ? n3 && qn === n3 ? t4 === `scale` ? hr : mr : (qn = n3 || {}) && (t4 === `scale` ? gr : _r) : e20.style && !v(e20.style[t4]) ? fr : ~t4.indexOf(`-`) ? pr : bn(e20, t4);
  }, core: { _removeProperty: Mr, _getMatrix: qr } };
  Z.utils.checkPrefix = Er, Z.core.getStyleSaver = xr, (function(e20, t4, r3, i3) {
    var a3 = H(e20 + `,` + t4 + `,` + r3, function(e21) {
      Xn[e21] = 1;
    });
    H(t4, function(e21) {
      n.units[e21] = `deg`, Wr[e21] = 1;
    }), ir[a3[13]] = e20 + `,` + t4, H(i3, function(e21) {
      var t5 = e21.split(`:`);
      ir[t5[1]] = a3[t5[0]];
    });
  })(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`, `rotation,rotationX,rotationY,skewX,skewY`, `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`, `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`), H(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`, function(e20) {
    n.units[e20] = `px`;
  }), Z.registerPlugin(si);
  var ci = Z.registerPlugin(si) || Z;
  ci.core.Tween;

  // public/shopify/plantilla99/assets/js/ScrollTrigger.BTGKJApg.js
  function e15(e20, t4) {
    for (var n3 = 0; n3 < t4.length; n3++) {
      var r3 = t4[n3];
      r3.enumerable = r3.enumerable || false, r3.configurable = true, `value` in r3 && (r3.writable = true), Object.defineProperty(e20, r3.key, r3);
    }
  }
  function t2(t4, n3, r3) {
    return n3 && e15(t4.prototype, n3), r3 && e15(t4, r3), t4;
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
    var e20 = u2.core, t4 = e20.bridge || {}, n3 = e20._scrollers, r3 = e20._proxies;
    n3.push.apply(n3, v2), r3.push.apply(r3, y2), v2 = n3, y2 = r3, x2 = function(e21, n4) {
      return t4[e21](n4);
    };
  };
  var C2 = function(e20, t4) {
    return ~y2.indexOf(e20) && y2[y2.indexOf(e20) + 1][t4];
  };
  var w2 = function(e20) {
    return !!~d2.indexOf(e20);
  };
  var T2 = function(e20, t4, n3, r3, i3) {
    return e20.addEventListener(t4, n3, { passive: r3 !== false, capture: !!i3 });
  };
  var E2 = function(e20, t4, n3, r3) {
    return e20.removeEventListener(t4, n3, !!r3);
  };
  var D2 = `scrollLeft`;
  var O2 = `scrollTop`;
  var k2 = function() {
    return f2 && f2.isPressed || v2.cache++;
  };
  var A2 = function(e20, t4) {
    var n3 = function n4(r3) {
      if (r3 || r3 === 0) {
        g2 && (i2.history.scrollRestoration = `manual`);
        var a3 = f2 && f2.isPressed;
        r3 = n4.v = Math.round(r3) || (f2 && f2.iOS ? 1 : 0), e20(r3), n4.cacheID = v2.cache, a3 && x2(`ss`, r3);
      } else (t4 || v2.cache !== n4.cacheID || x2(`ref`)) && (n4.cacheID = v2.cache, n4.v = e20());
      return n4.v + n4.offset;
    };
    return n3.offset = 0, e20 && n3;
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
    for (var n3 = t4.length; n3--; ) if (t4[n3] === e20 || t4[n3].contains(e20)) return true;
    return false;
  };
  var ie2 = function(e20, t4) {
    var r3 = t4.s, i3 = t4.sc;
    w2(e20) && (e20 = a2.scrollingElement || o2);
    var s3 = v2.indexOf(e20), c3 = i3 === te2.sc ? 1 : 2;
    !~s3 && (s3 = v2.push(e20) - 1), v2[s3 + c3] || T2(e20, `scroll`, k2);
    var l3 = v2[s3 + c3], u3 = l3 || (v2[s3 + c3] = A2(C2(e20, r3), true) || (w2(e20) ? i3 : A2(function(t5) {
      return arguments.length ? e20[r3] = t5 : e20[r3];
    })));
    return u3.target = e20, l3 || (u3.smooth = n2.getProperty(e20, `scrollBehavior`) === `smooth`), u3;
  };
  var ae2 = function(e20, t4, n3) {
    var r3 = e20, i3 = e20, a3 = b2(), o3 = a3, s3 = t4 || 50, c3 = Math.max(500, s3 * 3), l3 = function(e21, t5) {
      var c4 = b2();
      t5 || c4 - a3 > s3 ? (i3 = r3, r3 = e21, o3 = a3, a3 = c4) : n3 ? r3 += e21 : r3 = i3 + (e21 - i3) / (c4 - o3) * (a3 - o3);
    };
    return { update: l3, reset: function() {
      i3 = r3 = n3 ? 0 : r3, o3 = a3 = 0;
    }, getVelocity: function(e21) {
      var t5 = o3, s4 = i3, u3 = b2();
      return (e21 || e21 === 0) && e21 !== r3 && l3(e21), a3 === o3 || u3 - o3 > c3 ? 0 : (r3 + (n3 ? s4 : -s4)) / ((n3 ? u3 : a3) - t5) * 1e3;
    } };
  };
  var oe2 = function(e20, t4) {
    return t4 && !e20._gsapAllow && e20.cancelable !== false && e20.preventDefault(), e20.changedTouches ? e20.changedTouches[0] : e20;
  };
  var se2 = function(e20) {
    var t4 = Math.max.apply(Math, e20), n3 = Math.min.apply(Math, e20);
    return Math.abs(t4) >= Math.abs(n3) ? t4 : n3;
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
    var d3 = e20.prototype;
    return d3.init = function(e21) {
      r2 || le2(n2) || console.warn(`Please gsap.registerPlugin(Observer)`), u2 || ce2();
      var t4 = e21.tolerance, d4 = e21.dragMinimum, h3 = e21.type, g3 = e21.target, v3 = e21.lineHeight, y3 = e21.debounce, x3 = e21.preventDefault, S3 = e21.onStop, C3 = e21.onStopDelay, D3 = e21.ignore, O3 = e21.wheelSpeed, A3 = e21.event, j3 = e21.onDragStart, M3 = e21.onDragEnd, ue3 = e21.onDrag, N3 = e21.onPress, P3 = e21.onRelease, de3 = e21.onRight, F3 = e21.onLeft, fe3 = e21.onUp, pe3 = e21.onDown, I3 = e21.onChangeX, me3 = e21.onChangeY, he3 = e21.onChange, ge3 = e21.onToggleX, _e3 = e21.onToggleY, ve3 = e21.onHover, ye3 = e21.onHoverEnd, L3 = e21.onMove, be3 = e21.ignoreCheck, R3 = e21.isNormalizer, z3 = e21.onGestureStart, xe3 = e21.onGestureEnd, Se3 = e21.onWheel, B3 = e21.onEnable, V3 = e21.onDisable, Ce3 = e21.onClick, we3 = e21.scrollSpeed, H3 = e21.capture, U3 = e21.allowClicks, Te3 = e21.lockAxis, Ee3 = e21.onLockAxis;
      this.target = g3 = ne2(g3) || o2, this.vars = e21, D3 && (D3 = n2.utils.toArray(D3)), t4 || (t4 = 1e-9), d4 || (d4 = 0), O3 || (O3 = 1), we3 || (we3 = 1), h3 || (h3 = `wheel,touch,pointer`), y3 = y3 !== false, v3 || (v3 = parseFloat(i2.getComputedStyle(s2).lineHeight) || 22);
      var W3, De3, Oe3, ke3, Ae3, je3, G3, K3 = this, Me3 = 0, Ne3 = 0, Pe3 = e21.passive || !x3 && e21.passive !== false, Fe3 = ie2(g3, ee2), q3 = ie2(g3, te2), Ie3 = Fe3(), Le3 = q3(), Re3 = ~h3.indexOf(`touch`) && !~h3.indexOf(`pointer`) && p2[0] === `pointerdown`, ze3 = w2(g3), J3 = g3.ownerDocument || a2, Y3 = [0, 0, 0], Be3 = [0, 0, 0], Ve3 = 0, He3 = function() {
        return Ve3 = b2();
      }, Ue3 = function(e22, t5) {
        return (K3.event = e22) && D3 && re2(e22.target, D3) || t5 && Re3 && e22.pointerType !== `touch` || be3 && be3(e22, t5);
      }, We3 = function() {
        K3._vx.reset(), K3._vy.reset(), De3.pause(), S3 && S3(K3);
      }, Ge3 = function() {
        var e22 = K3.deltaX = se2(Y3), n3 = K3.deltaY = se2(Be3), r3 = Math.abs(e22) >= t4, i3 = Math.abs(n3) >= t4;
        he3 && (r3 || i3) && he3(K3, e22, n3, Y3, Be3), r3 && (de3 && K3.deltaX > 0 && de3(K3), F3 && K3.deltaX < 0 && F3(K3), I3 && I3(K3), ge3 && K3.deltaX < 0 != Me3 < 0 && ge3(K3), Me3 = K3.deltaX, Y3[0] = Y3[1] = Y3[2] = 0), i3 && (pe3 && K3.deltaY > 0 && pe3(K3), fe3 && K3.deltaY < 0 && fe3(K3), me3 && me3(K3), _e3 && K3.deltaY < 0 != Ne3 < 0 && _e3(K3), Ne3 = K3.deltaY, Be3[0] = Be3[1] = Be3[2] = 0), (ke3 || Oe3) && (L3 && L3(K3), Oe3 && (Oe3 = (j3 && Oe3 === 1 && j3(K3), ue3 && ue3(K3), 0)), ke3 = false), je3 && !(je3 = false) && Ee3 && Ee3(K3), Ae3 && (Ae3 = (Se3(K3), false)), W3 = 0;
      }, Ke3 = function(e22, t5, n3) {
        Y3[n3] += e22, Be3[n3] += t5, K3._vx.update(e22), K3._vy.update(t5), y3 ? W3 || (W3 = requestAnimationFrame(Ge3)) : Ge3();
      }, qe3 = function(e22, t5) {
        Te3 && !G3 && (K3.axis = G3 = Math.abs(e22) > Math.abs(t5) ? `x` : `y`, je3 = true), G3 !== `y` && (Y3[2] += e22, K3._vx.update(e22, true)), G3 !== `x` && (Be3[2] += t5, K3._vy.update(t5, true)), y3 ? W3 || (W3 = requestAnimationFrame(Ge3)) : Ge3();
      }, Je3 = function(e22) {
        if (!Ue3(e22, 1)) {
          e22 = oe2(e22, x3);
          var t5 = e22.clientX, n3 = e22.clientY, r3 = t5 - K3.x, i3 = n3 - K3.y, a3 = K3.isDragging;
          K3.x = t5, K3.y = n3, (a3 || (r3 || i3) && (Math.abs(K3.startX - t5) >= d4 || Math.abs(K3.startY - n3) >= d4)) && (Oe3 || (Oe3 = a3 ? 2 : 1), a3 || (K3.isDragging = true), qe3(r3, i3));
        }
      }, Ye3 = K3.onPress = function(e22) {
        Ue3(e22, 1) || e22 && e22.button || (K3.axis = G3 = null, De3.pause(), K3.isPressed = true, e22 = oe2(e22), Me3 = Ne3 = 0, K3.startX = K3.x = e22.clientX, K3.startY = K3.y = e22.clientY, K3._vx.reset(), K3._vy.reset(), T2(R3 ? g3 : J3, p2[1], Je3, Pe3, true), K3.deltaX = K3.deltaY = 0, N3 && N3(K3));
      }, Xe3 = K3.onRelease = function(e22) {
        if (!Ue3(e22, 1)) {
          E2(R3 ? g3 : J3, p2[1], Je3, true);
          var t5 = !isNaN(K3.y - K3.startY), r3 = K3.isDragging, a3 = r3 && (Math.abs(K3.x - K3.startX) > 3 || Math.abs(K3.y - K3.startY) > 3), o3 = oe2(e22);
          !a3 && t5 && (K3._vx.reset(), K3._vy.reset(), x3 && U3 && n2.delayedCall(0.08, function() {
            if (b2() - Ve3 > 300 && !e22.defaultPrevented) {
              if (e22.target.click) e22.target.click();
              else if (J3.createEvent) {
                var t6 = J3.createEvent(`MouseEvents`);
                t6.initMouseEvent(`click`, true, true, i2, 1, o3.screenX, o3.screenY, o3.clientX, o3.clientY, false, false, false, false, 0, null), e22.target.dispatchEvent(t6);
              }
            }
          })), K3.isDragging = K3.isGesturing = K3.isPressed = false, S3 && r3 && !R3 && De3.restart(true), Oe3 && Ge3(), M3 && r3 && M3(K3), P3 && P3(K3, a3);
        }
      }, Ze3 = function(e22) {
        return e22.touches && e22.touches.length > 1 && (K3.isGesturing = true) && z3(e22, K3.isDragging);
      }, Qe3 = function() {
        return (K3.isGesturing = false) || xe3(K3);
      }, $e3 = function(e22) {
        if (!Ue3(e22)) {
          var t5 = Fe3(), n3 = q3();
          Ke3((t5 - Ie3) * we3, (n3 - Le3) * we3, 1), Ie3 = t5, Le3 = n3, S3 && De3.restart(true);
        }
      }, et3 = function(e22) {
        if (!Ue3(e22)) {
          e22 = oe2(e22, x3), Se3 && (Ae3 = true);
          var t5 = (e22.deltaMode === 1 ? v3 : e22.deltaMode === 2 ? i2.innerHeight : 1) * O3;
          Ke3(e22.deltaX * t5, e22.deltaY * t5, 0), S3 && !R3 && De3.restart(true);
        }
      }, tt3 = function(e22) {
        if (!Ue3(e22)) {
          var t5 = e22.clientX, n3 = e22.clientY, r3 = t5 - K3.x, i3 = n3 - K3.y;
          K3.x = t5, K3.y = n3, ke3 = true, S3 && De3.restart(true), (r3 || i3) && qe3(r3, i3);
        }
      }, nt3 = function(e22) {
        K3.event = e22, ve3(K3);
      }, rt3 = function(e22) {
        K3.event = e22, ye3(K3);
      }, it3 = function(e22) {
        return Ue3(e22) || oe2(e22, x3) && Ce3(K3);
      };
      De3 = K3._dc = n2.delayedCall(C3 || 0.25, We3).pause(), K3.deltaX = K3.deltaY = 0, K3._vx = ae2(0, 50, true), K3._vy = ae2(0, 50, true), K3.scrollX = Fe3, K3.scrollY = q3, K3.isDragging = K3.isGesturing = K3.isPressed = false, m2(this), K3.enable = function(e22) {
        return K3.isEnabled || (T2(ze3 ? J3 : g3, `scroll`, k2), h3.indexOf(`scroll`) >= 0 && T2(ze3 ? J3 : g3, `scroll`, $e3, Pe3, H3), h3.indexOf(`wheel`) >= 0 && T2(g3, `wheel`, et3, Pe3, H3), (h3.indexOf(`touch`) >= 0 && c2 || h3.indexOf(`pointer`) >= 0) && (T2(g3, p2[0], Ye3, Pe3, H3), T2(J3, p2[2], Xe3), T2(J3, p2[3], Xe3), U3 && T2(g3, `click`, He3, true, true), Ce3 && T2(g3, `click`, it3), z3 && T2(J3, `gesturestart`, Ze3), xe3 && T2(J3, `gestureend`, Qe3), ve3 && T2(g3, l2 + `enter`, nt3), ye3 && T2(g3, l2 + `leave`, rt3), L3 && T2(g3, l2 + `move`, tt3)), K3.isEnabled = true, K3.isDragging = K3.isGesturing = K3.isPressed = ke3 = Oe3 = false, K3._vx.reset(), K3._vy.reset(), Ie3 = Fe3(), Le3 = q3(), e22 && e22.type && Ye3(e22), B3 && B3(K3)), K3;
      }, K3.disable = function() {
        K3.isEnabled && (_2.filter(function(e22) {
          return e22 !== K3 && w2(e22.target);
        }).length || E2(ze3 ? J3 : g3, `scroll`, k2), K3.isPressed && (K3._vx.reset(), K3._vy.reset(), E2(R3 ? g3 : J3, p2[1], Je3, true)), E2(ze3 ? J3 : g3, `scroll`, $e3, H3), E2(g3, `wheel`, et3, H3), E2(g3, p2[0], Ye3, H3), E2(J3, p2[2], Xe3), E2(J3, p2[3], Xe3), E2(g3, `click`, He3, true), E2(g3, `click`, it3), E2(J3, `gesturestart`, Ze3), E2(J3, `gestureend`, Qe3), E2(g3, l2 + `enter`, nt3), E2(g3, l2 + `leave`, rt3), E2(g3, l2 + `move`, tt3), K3.isEnabled = K3.isPressed = K3.isDragging = false, V3 && V3(K3));
      }, K3.kill = K3.revert = function() {
        K3.disable();
        var e22 = _2.indexOf(K3);
        e22 >= 0 && _2.splice(e22, 1), f2 === K3 && (f2 = 0);
      }, _2.push(K3), R3 && w2(g3) && (f2 = K3), K3.enable(A3);
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
  var Pe2 = function(e20, t4, n3) {
    var r3 = qe2(e20) && (e20.substr(0, 6) === `clamp(` || e20.indexOf(`max`) > -1);
    return n3[`_` + t4 + `Clamp`] = r3, r3 ? e20.substr(6, e20.length - 7) : e20;
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
  var Ue2 = function(e20, t4, n3) {
    var r3 = n3.d, i3 = n3.d2, a3 = n3.a;
    return (a3 = C2(e20, `getBoundingClientRect`)) ? function() {
      return a3()[r3];
    } : function() {
      return (t4 ? Ve2(i3) : e20[`client` + i3]) || 0;
    };
  };
  var We2 = function(e20, t4) {
    return !t4 || ~y2.indexOf(e20) ? He2(e20) : function() {
      return pn2;
    };
  };
  var Ge2 = function(e20, t4) {
    var n3 = t4.s, r3 = t4.d2, i3 = t4.d, a3 = t4.a;
    return Math.max(0, (n3 = `scroll` + r3) && (a3 = C2(e20, n3)) ? a3() - He2(e20)()[i3] : Be2(e20) ? (de2[n3] || F2[n3]) - Ve2(r3) : e20[n3] - e20[`offset` + r3]);
  };
  var Ke2 = function(e20, t4) {
    for (var n3 = 0; n3 < z2.length; n3 += 3) (!t4 || ~t4.indexOf(z2[n3 + 1])) && e20(z2[n3], z2[n3 + 1], z2[n3 + 2]);
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
  var Ze2 = function(e20, t4, n3) {
    return e20 && e20.progress(+!t4) && n3 && e20.pause();
  };
  var Qe2 = function(e20, t4, n3) {
    if (e20.enabled) {
      var r3 = e20._ctx ? e20._ctx.add(function() {
        return t4(e20, n3);
      }) : t4(e20, n3);
      r3 && r3.totalTime && (e20.callbackAnimation = r3);
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
    for (var n3 in t4) n3 in e20 || (e20[n3] = t4[n3]);
    return e20;
  };
  var _t2 = function(e20, t4) {
    var n3 = t4 && mt2(e20)[ye2] !== `matrix(1, 0, 0, 1, 0, 0)` && M2.to(e20, { x: 0, y: 0, xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, skewX: 0, skewY: 0 }).progress(1), r3 = e20.getBoundingClientRect ? e20.getBoundingClientRect() : e20.scrollingElement.getBoundingClientRect();
    return n3 && n3.progress(0).kill(), r3;
  };
  var vt2 = function(e20, t4) {
    var n3 = t4.d2;
    return e20[`offset` + n3] || e20[`client` + n3] || 0;
  };
  var yt2 = function(e20) {
    var t4 = [], n3 = e20.labels, r3 = e20.duration(), i3;
    for (i3 in n3) t4.push(n3[i3] / r3);
    return t4;
  };
  var bt2 = function(e20) {
    return function(t4) {
      return M2.utils.snap(yt2(e20), t4);
    };
  };
  var xt2 = function(e20) {
    var t4 = M2.utils.snap(e20), n3 = Array.isArray(e20) && e20.slice(0).sort(function(e21, t5) {
      return e21 - t5;
    });
    return n3 ? function(e21, r3, i3) {
      i3 === void 0 && (i3 = 1e-3);
      var a3;
      if (!r3) return t4(e21);
      if (r3 > 0) {
        for (e21 -= i3, a3 = 0; a3 < n3.length; a3++) if (n3[a3] >= e21) return n3[a3];
        return n3[a3 - 1];
      } else for (a3 = n3.length, e21 += i3; a3--; ) if (n3[a3] <= e21) return n3[a3];
      return n3[0];
    } : function(n4, r3, i3) {
      i3 === void 0 && (i3 = 1e-3);
      var a3 = t4(n4);
      return !r3 || Math.abs(a3 - n4) < i3 || a3 - n4 < 0 == r3 < 0 ? a3 : t4(r3 < 0 ? n4 - e20 : n4 + e20);
    };
  };
  var St2 = function(e20) {
    return function(t4, n3) {
      return xt2(yt2(e20))(t4, n3.direction);
    };
  };
  var Ct2 = function(e20, t4, n3, r3) {
    return n3.split(`,`).forEach(function(n4) {
      return e20(t4, n4, r3);
    });
  };
  var wt2 = function(e20, t4, n3, r3, i3) {
    return e20.addEventListener(t4, n3, { passive: !r3, capture: !!i3 });
  };
  var Tt2 = function(e20, t4, n3, r3) {
    return e20.removeEventListener(t4, n3, !!r3);
  };
  var Et2 = function(e20, t4, n3) {
    n3 && (n3 = n3.wheelHandler), n3 && (e20(t4, `wheel`, n3), e20(t4, `touchmove`, n3));
  };
  var Dt2 = { startColor: `green`, endColor: `red`, indent: 0, fontSize: `16px`, fontWeight: `normal` };
  var Ot2 = { toggleActions: `play`, anticipatePin: 0 };
  var kt2 = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 };
  var At2 = function(e20, t4) {
    if (qe2(e20)) {
      var n3 = e20.indexOf(`=`), r3 = ~n3 ? +(e20.charAt(n3 - 1) + 1) * parseFloat(e20.substr(n3 + 1)) : 0;
      ~n3 && (e20.indexOf(`%`) > n3 && (r3 *= t4 / 100), e20 = e20.substr(0, n3 - 1)), e20 = r3 + (e20 in kt2 ? kt2[e20] * t4 : ~e20.indexOf(`%`) ? parseFloat(e20) * t4 / 100 : parseFloat(e20) || 0);
    }
    return e20;
  };
  var jt2 = function(e20, t4, n3, r3, i3, a3, o3, s3) {
    var c3 = i3.startColor, l3 = i3.endColor, u3 = i3.fontSize, d3 = i3.indent, f3 = i3.fontWeight, p3 = P2.createElement(`div`), m3 = Be2(n3) || C2(n3, `pinType`) === `fixed`, h3 = e20.indexOf(`scroller`) !== -1, g3 = m3 ? F2 : n3.tagName === `IFRAME` ? n3.contentDocument.body : n3, _3 = e20.indexOf(`start`) !== -1, v3 = _3 ? c3 : l3, y3 = `border-color:` + v3 + `;font-size:` + u3 + `;color:` + v3 + `;font-weight:` + f3 + `;pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;`;
    return y3 += `position:` + ((h3 || s3) && m3 ? `fixed;` : `absolute;`), (h3 || s3 || !m3) && (y3 += (r3 === te2 ? nt2 : rt2) + `:` + (a3 + parseFloat(d3)) + `px;`), o3 && (y3 += `box-sizing:border-box;text-align:left;width:` + o3.offsetWidth + `px;`), p3._isStart = _3, p3.setAttribute(`class`, `gsap-marker-` + e20 + (t4 ? ` marker-` + t4 : ``)), p3.style.cssText = y3, p3.innerText = t4 || t4 === 0 ? e20 + `-` + t4 : e20, g3.children[0] ? g3.insertBefore(p3, g3.children[0]) : g3.appendChild(p3), p3._offset = p3[`offset` + r3.op.d2], Mt2(p3, 0, r3, _3), p3;
  };
  var Mt2 = function(e20, t4, n3, r3) {
    var i3 = { display: `block` }, a3 = n3[r3 ? `os2` : `p2`], o3 = n3[r3 ? `p2` : `os2`];
    e20._isFlipped = r3, i3[n3.a + `Percent`] = r3 ? -100 : 0, i3[n3.a] = r3 ? `1px` : 0, i3[`border` + a3 + dt2] = 1, i3[`border` + o3 + dt2] = 0, i3[n3.p] = t4 + `px`, M2.set(e20, i3);
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
    var n3;
    for (L2 = 0; L2 < Z2.length; L2++) n3 = Z2[L2], n3 && (!t4 || n3._ctx === t4) && (e20 ? n3.kill(1) : n3.revert(true, true));
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
    var n3 = Vt2(`refreshInit`);
    xe2 && $2.sort(), t4 || Gt2(), v2.forEach(function(e21) {
      Je2(e21) && (e21.smooth && (e21.target.style.scrollBehavior = `auto`), e21(0));
    }), Z2.slice(0).forEach(function(e21) {
      return e21.refresh();
    }), Oe2 = false, Z2.forEach(function(e21) {
      if (e21._subPinOffset && e21.pin) {
        var t5 = e21.vars.horizontal ? `offsetWidth` : `offsetHeight`, n4 = e21.pin[t5];
        e21.revert(true, 1), e21.adjustPinSpacing(e21.pin[t5] - n4), e21.refresh();
      }
    }), ke2 = 1, Qt2(true), Z2.forEach(function(e21) {
      var t5 = Ge2(e21.scroller, e21._dir), n4 = e21.vars.end === `max` || e21._endClamp && e21.end > t5, r3 = e21._startClamp && e21.start >= t5;
      (n4 || r3) && e21.setPositions(r3 ? t5 - 1 : e21.start, n4 ? Math.max(r3 ? t5 : e21.start + 1, t5) : e21.end, true);
    }), Qt2(false), ke2 = 0, n3.forEach(function(e21) {
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
      var t4 = Z2.length, n3 = G2(), r3 = n3 - K2 >= 50, i3 = t4 && Z2[0].scroll();
      if (tn2 = en2 > i3 ? -1 : 1, qt2 || (en2 = i3), r3 && (Me2 && !ve2 && n3 - Me2 > 200 && (Me2 = 0, Vt2(`scrollEnd`)), he2 = K2, K2 = n3), tn2 < 0) {
        for (L2 = t4; L2-- > 0; ) Z2[L2] && Z2[L2].update(0, r3);
        tn2 = 1;
      } else for (L2 = 0; L2 < t4; L2++) Z2[L2] && Z2[L2].update(0, r3);
      $2.isUpdating = false;
    }
    Pt2 = 0;
  };
  var an2 = [et2, tt2, rt2, nt2, ut2 + lt2, ut2 + ot2, ut2 + ct2, ut2 + st2, `display`, `flexShrink`, `float`, `zIndex`, `gridColumnStart`, `gridColumnEnd`, `gridRowStart`, `gridRowEnd`, `gridArea`, `justifySelf`, `alignSelf`, `placeSelf`, `order`];
  var on2 = an2.concat([it2, at2, `boxSizing`, `max` + dt2, `max` + ft2, `position`, ut2, X2, X2 + ct2, X2 + ot2, X2 + lt2, X2 + st2]);
  var sn2 = function(e20, t4, n3) {
    un2(n3);
    var r3 = e20._gsap;
    if (r3.spacerIsNative) un2(r3.spacerState);
    else if (e20._gsap.swappedIn) {
      var i3 = t4.parentNode;
      i3 && (i3.insertBefore(e20, t4), i3.removeChild(t4));
    }
    e20._gsap.swappedIn = false;
  };
  var cn2 = function(e20, t4, n3, r3) {
    if (!e20._gsap.swappedIn) {
      for (var i3 = an2.length, a3 = t4.style, o3 = e20.style, s3; i3--; ) s3 = an2[i3], a3[s3] = n3[s3];
      a3.position = n3.position === `absolute` ? `absolute` : `relative`, n3.display === `inline` && (a3.display = `inline-block`), o3[rt2] = o3[nt2] = `auto`, a3.flexBasis = n3.flexBasis || `auto`, a3.overflow = `visible`, a3.boxSizing = `border-box`, a3[it2] = vt2(e20, ee2) + pt2, a3[at2] = vt2(e20, te2) + pt2, a3[X2] = o3[ut2] = o3[tt2] = o3[et2] = `0`, un2(r3), o3[it2] = o3[`max` + dt2] = n3[it2], o3[at2] = o3[`max` + ft2] = n3[at2], o3[X2] = n3[X2], e20.parentNode !== t4 && (e20.parentNode.insertBefore(t4, e20), t4.appendChild(e20)), e20._gsap.swappedIn = true;
    }
  };
  var ln2 = /([A-Z])/g;
  var un2 = function(e20) {
    if (e20) {
      var t4 = e20.t.style, n3 = e20.length, r3 = 0, i3, a3;
      for ((e20.t._gsap || M2.core.getCache(e20.t)).uncache = 1; r3 < n3; r3 += 2) a3 = e20[r3 + 1], i3 = e20[r3], a3 ? t4[i3] = a3 : t4[i3] && t4.removeProperty(i3.replace(ln2, `-$1`).toLowerCase());
    }
  };
  var dn2 = function(e20) {
    for (var t4 = on2.length, n3 = e20.style, r3 = [], i3 = 0; i3 < t4; i3++) r3.push(on2[i3], n3[on2[i3]]);
    return r3.t = e20, r3;
  };
  var fn2 = function(e20, t4, n3) {
    for (var r3 = [], i3 = e20.length, a3 = n3 ? 8 : 0, o3; a3 < i3; a3 += 2) o3 = e20[a3], r3.push(o3, o3 in t4 ? t4[o3] : e20[a3 + 1]);
    return r3.t = e20.t, r3;
  };
  var pn2 = { left: 0, top: 0 };
  var mn2 = function(e20, t4, n3, r3, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3) {
    Je2(e20) && (e20 = e20(s3)), qe2(e20) && e20.substr(0, 3) === `max` && (e20 = d3 + (e20.charAt(4) === `=` ? At2(`0` + e20.substr(3), n3) : 0));
    var m3 = f3 ? f3.time() : 0, h3, g3, _3;
    if (f3 && f3.seek(0), isNaN(e20) || (e20 = +e20), Ye2(e20)) f3 && (e20 = M2.utils.mapRange(f3.scrollTrigger.start, f3.scrollTrigger.end, 0, d3, e20)), o3 && Mt2(o3, n3, r3, true);
    else {
      Je2(t4) && (t4 = t4(s3));
      var v3 = (e20 || `0`).split(` `), y3, b3, x3, S3;
      _3 = ne2(t4, s3) || F2, y3 = _t2(_3) || {}, (!y3 || !y3.left && !y3.top) && mt2(_3).display === `none` && (S3 = _3.style.display, _3.style.display = `block`, y3 = _t2(_3), S3 ? _3.style.display = S3 : _3.style.removeProperty(`display`)), b3 = At2(v3[0], y3[r3.d]), x3 = At2(v3[1] || `0`, n3), e20 = y3[r3.p] - c3[r3.p] - l3 + b3 + i3 - x3, o3 && Mt2(o3, x3, r3, n3 - x3 < 20 || o3._isStart && x3 > 20), n3 -= n3 - x3;
    }
    if (p3 && (s3[p3] = e20 || -1e-3, e20 < 0 && (e20 = 0)), a3) {
      var C3 = e20 + n3, w3 = a3._isStart;
      h3 = `scroll` + r3.d2, Mt2(a3, C3, r3, w3 && C3 > 20 || !w3 && (u3 ? Math.max(F2[h3], de2[h3]) : a3.parentNode[h3]) <= C3 + 1), u3 && (c3 = _t2(o3), u3 && (a3.style[r3.op.p] = c3[r3.op.p] - r3.op.m - a3._offset + pt2));
    }
    return f3 && _3 && (h3 = _t2(_3), f3.seek(d3), g3 = _t2(_3), f3._caScrollDist = h3[r3.p] - g3[r3.p], e20 = e20 / f3._caScrollDist * d3), f3 && f3.seek(m3), f3 ? e20 : Math.round(e20);
  };
  var hn2 = /(webkit|moz|length|cssText|inset)/i;
  var gn2 = function(e20, t4, n3, r3) {
    if (e20.parentNode !== t4) {
      var i3 = e20.style, a3, o3;
      if (t4 === F2) {
        for (a3 in e20._stOrig = i3.cssText, o3 = mt2(e20), o3) !+a3 && !hn2.test(a3) && o3[a3] && typeof i3[a3] == `string` && a3 !== `0` && (i3[a3] = o3[a3]);
        i3.top = n3, i3.left = r3;
      } else i3.cssText = e20._stOrig;
      M2.core.getCache(e20).uncache = 1, t4.appendChild(e20);
    }
  };
  var _n2 = function(e20, t4, n3) {
    var r3 = t4, i3 = r3;
    return function(t5) {
      var a3 = Math.round(e20());
      return a3 !== r3 && a3 !== i3 && Math.abs(a3 - r3) > 3 && Math.abs(a3 - i3) > 3 && (t5 = a3, n3 && n3()), i3 = r3, r3 = Math.round(t5), r3;
    };
  };
  var vn2 = function(e20, t4, n3) {
    var r3 = {};
    r3[t4.p] = `+=` + n3, M2.set(e20, r3);
  };
  var yn2 = function(e20, t4) {
    var n3 = ie2(e20, t4), r3 = `_scroll` + t4.p2, i3 = function t5(i4, a3, o3, s3, c3) {
      var l3 = t5.tween, u3 = a3.onComplete, d3 = {};
      o3 || (o3 = n3());
      var f3 = _n2(n3, o3, function() {
        l3.kill(), t5.tween = 0;
      });
      return c3 = s3 && c3 || 0, s3 || (s3 = i4 - o3), l3 && l3.kill(), a3[r3] = i4, a3.inherit = false, a3.modifiers = d3, d3[r3] = function() {
        return f3(o3 + s3 * l3.ratio + c3 * l3.ratio * l3.ratio);
      }, a3.onUpdate = function() {
        v2.cache++, t5.tween && rn2();
      }, a3.onComplete = function() {
        t5.tween = 0, u3 && u3.call(l3);
      }, l3 = t5.tween = M2.to(e20, a3), l3;
    };
    return e20[r3] = n3, n3.wheelHandler = function() {
      return i3.tween && i3.tween.kill() && (i3.tween = 0);
    }, wt2(e20, `wheel`, n3.wheelHandler), $2.isTouch && wt2(e20, `touchmove`, n3.wheelHandler), i3;
  };
  var $2 = (function() {
    function e20(t5, n3) {
      ue2 || e20.register(M2) || console.warn(`Please gsap.registerPlugin(ScrollTrigger)`), Te2(this), this.init(t5, n3);
    }
    var t4 = e20.prototype;
    return t4.init = function(t5, n3) {
      if (this.progress = this.start = 0, this.vars && this.kill(true, true), !Ne2) {
        this.update = this.refresh = this.kill = Re2;
        return;
      }
      t5 = gt2(qe2(t5) || Ye2(t5) || t5.nodeType ? { trigger: t5 } : t5, Ot2);
      var r3 = t5, i3 = r3.onUpdate, a3 = r3.toggleClass, o3 = r3.id, s3 = r3.onToggle, c3 = r3.onRefresh, l3 = r3.scrub, u3 = r3.trigger, d3 = r3.pin, f3 = r3.pinSpacing, p3 = r3.invalidateOnRefresh, m3 = r3.anticipatePin, h3 = r3.onScrubComplete, g3 = r3.onSnapComplete, _3 = r3.once, b3 = r3.snap, x3 = r3.pinReparent, S3 = r3.pinSpacer, w3 = r3.containerAnimation, T3 = r3.fastScrollEnd, E3 = r3.preventOverlaps, D3 = t5.horizontal || t5.containerAnimation && t5.horizontal !== false ? ee2 : te2, O3 = !l3 && l3 !== 0, k3 = ne2(t5.scroller || N2), A3 = M2.core.getCache(k3), re3 = Be2(k3), ae3 = (`pinType` in t5 ? t5.pinType : C2(k3, `pinType`) || re3 && `fixed`) === `fixed`, oe3 = [t5.onEnter, t5.onLeave, t5.onEnterBack, t5.onLeaveBack], se3 = O3 && t5.toggleActions.split(` `), ce3 = `markers` in t5 ? t5.markers : Ot2.markers, le3 = re3 ? 0 : parseFloat(mt2(k3)[`border` + D3.p2 + dt2]) || 0, j3 = this, ue3 = t5.onRefreshInit && function() {
        return t5.onRefreshInit(j3);
      }, fe3 = Ue2(k3, re3, D3), pe3 = We2(k3, re3), ge3 = 0, ye3 = 0, be3 = 0, R3 = ie2(k3, D3), z3, B3, V3, Ce3, we3, H3, U3, Te3, Ee3, W3, De3, Oe3, K3, q3, Ie3, Le3, J3, Y3, Ve3, He3, Ke3, et3, tt3, nt3, rt3, yt3, Ct3, Et3, kt3, Mt3, Pt3, Q3, It3, Rt3, zt3, Vt3, Ht3, Ut3, Wt3;
      if (j3._startClamp = j3._endClamp = false, j3._dir = D3, m3 *= 45, j3.scroller = k3, j3.scroll = w3 ? w3.time.bind(w3) : R3, Ce3 = R3(), j3.vars = t5, n3 || (n3 = t5.animation), `refreshPriority` in t5 && (xe2 = 1, t5.refreshPriority === -9999 && (nn2 = j3)), A3.tweenScroll = A3.tweenScroll || { top: yn2(k3, te2), left: yn2(k3, ee2) }, j3.tweenTo = z3 = A3.tweenScroll[D3.p], j3.scrubDuration = function(e21) {
        It3 = Ye2(e21) && e21, It3 ? Q3 ? Q3.duration(e21) : Q3 = M2.to(n3, { ease: `expo`, totalProgress: `+=0`, inherit: false, duration: It3, paused: true, onComplete: function() {
          return h3 && h3(j3);
        } }) : (Q3 && Q3.progress(1).kill(), Q3 = 0);
      }, n3 && (n3.vars.lazy = false, n3._initted && !j3.isReverted || n3.vars.immediateRender !== false && t5.immediateRender !== false && n3.duration() && n3.render(0, true, true), j3.animation = n3.pause(), n3.scrollTrigger = j3, j3.scrubDuration(l3), Mt3 = 0, o3 || (o3 = n3.vars.id)), b3 && ((!Xe2(b3) || b3.push) && (b3 = { snapTo: b3 }), `scrollBehavior` in F2.style && M2.set(re3 ? [F2, de2] : k3, { scrollBehavior: `auto` }), v2.forEach(function(e21) {
        return Je2(e21) && e21.target === (re3 ? P2.scrollingElement || de2 : k3) && (e21.smooth = false);
      }), V3 = Je2(b3.snapTo) ? b3.snapTo : b3.snapTo === `labels` ? bt2(n3) : b3.snapTo === `labelsDirectional` ? St2(n3) : b3.directional === false ? M2.utils.snap(b3.snapTo) : function(e21, t6) {
        return xt2(b3.snapTo)(e21, G2() - ye3 < 500 ? 0 : t6.direction);
      }, Rt3 = b3.duration || { min: 0.1, max: 2 }, Rt3 = Xe2(Rt3) ? me2(Rt3.min, Rt3.max) : me2(Rt3, Rt3), zt3 = M2.delayedCall(b3.delay || It3 / 2 || 0.1, function() {
        var e21 = R3(), t6 = G2() - ye3 < 500, r4 = z3.tween;
        if ((t6 || Math.abs(j3.getVelocity()) < 10) && !r4 && !ve2 && ge3 !== e21) {
          var i4 = (e21 - H3) / q3, a4 = n3 && !O3 ? n3.totalProgress() : i4, o4 = t6 ? 0 : (a4 - Pt3) / (G2() - he2) * 1e3 || 0, s4 = M2.utils.clamp(-i4, 1 - i4, $e2(o4 / 2) * o4 / 0.185), c4 = i4 + (b3.inertia === false ? 0 : s4), l4, u4, d4 = b3, f4 = d4.onStart, p4 = d4.onInterrupt, m4 = d4.onComplete;
          if (l4 = V3(c4, j3), Ye2(l4) || (l4 = c4), u4 = Math.max(0, Math.round(H3 + l4 * q3)), e21 <= U3 && e21 >= H3 && u4 !== e21) {
            if (r4 && !r4._initted && r4.data <= $e2(u4 - e21)) return;
            b3.inertia === false && (s4 = l4 - i4), z3(u4, { duration: Rt3($e2(Math.max($e2(c4 - a4), $e2(l4 - a4)) * 0.185 / o4 / 0.05 || 0)), ease: b3.ease || `power3`, data: $e2(u4 - e21), onInterrupt: function() {
              return zt3.restart(true) && p4 && Qe2(j3, p4);
            }, onComplete: function() {
              j3.update(), ge3 = R3(), n3 && !O3 && (Q3 ? Q3.resetTo(`totalProgress`, l4, n3._tTime / n3._tDur) : n3.progress(l4)), Mt3 = Pt3 = n3 && !O3 ? n3.totalProgress() : j3.progress, g3 && g3(j3), m4 && Qe2(j3, m4);
            } }, e21, s4 * q3, u4 - e21 - s4 * q3), f4 && Qe2(j3, f4, z3.tween);
          }
        } else j3.isActive && ge3 !== e21 && zt3.restart(true);
      }).pause()), o3 && (Nt2[o3] = j3), u3 = j3.trigger = ne2(u3 || d3 !== true && d3), Wt3 = u3 && u3._gsap && u3._gsap.stRevert, Wt3 && (Wt3 = Wt3(j3)), d3 = d3 === true ? u3 : ne2(d3), qe2(a3) && (a3 = { targets: u3, className: a3 }), d3 && (f3 === false || f3 === ut2 || (f3 = !f3 && d3.parentNode && d3.parentNode.style && mt2(d3.parentNode).display === `flex` ? false : X2), j3.pin = d3, B3 = M2.core.getCache(d3), B3.spacer ? Ie3 = B3.pinState : (S3 && (S3 = ne2(S3), S3 && !S3.nodeType && (S3 = S3.current || S3.nativeElement), B3.spacerIsNative = !!S3, S3 && (B3.spacerState = dn2(S3))), B3.spacer = Y3 = S3 || P2.createElement(`div`), Y3.classList.add(`pin-spacer`), o3 && Y3.classList.add(`pin-spacer-` + o3), B3.pinState = Ie3 = dn2(d3)), t5.force3D !== false && M2.set(d3, { force3D: true }), j3.spacer = Y3 = B3.spacer, kt3 = mt2(d3), nt3 = kt3[f3 + D3.os2], He3 = M2.getProperty(d3), Ke3 = M2.quickSetter(d3, D3.a, pt2), cn2(d3, Y3, kt3), J3 = dn2(d3)), ce3) {
        Oe3 = Xe2(ce3) ? gt2(ce3, Dt2) : Dt2, W3 = jt2(`scroller-start`, o3, k3, D3, Oe3, 0), De3 = jt2(`scroller-end`, o3, k3, D3, Oe3, 0, W3), Ve3 = W3[`offset` + D3.op.d2];
        var Gt3 = ne2(C2(k3, `content`) || k3);
        Te3 = this.markerStart = jt2(`start`, o3, Gt3, D3, Oe3, Ve3, 0, w3), Ee3 = this.markerEnd = jt2(`end`, o3, Gt3, D3, Oe3, Ve3, 0, w3), w3 && (Ut3 = M2.quickSetter([Te3, Ee3], D3.a, pt2)), !ae3 && !(y2.length && C2(k3, `fixedMarkers`) === true) && (ht2(re3 ? F2 : k3), M2.set([W3, De3], { force3D: true }), yt3 = M2.quickSetter(W3, D3.a, pt2), Et3 = M2.quickSetter(De3, D3.a, pt2));
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
        var r4 = e21 !== false || !j3.enabled, i4 = _e2;
        r4 !== j3.isReverted && (r4 && (Vt3 = Math.max(R3(), j3.scroll.rec || 0), be3 = j3.progress, Ht3 = n3 && n3.progress()), Te3 && [Te3, Ee3, W3, De3].forEach(function(e22) {
          return e22.style.display = r4 ? `none` : `block`;
        }), r4 && (_e2 = j3, j3.update(r4)), d3 && (!x3 || !j3.isActive) && (r4 ? sn2(d3, Y3, Ie3) : cn2(d3, Y3, mt2(d3), rt3)), r4 || j3.update(r4), _e2 = i4, j3.isReverted = r4);
      }, j3.refresh = function(r4, i4, a4, o4) {
        if (!((_e2 || !j3.enabled) && !i4)) {
          if (d3 && r4 && Me2) {
            wt2(e20, `scrollEnd`, Bt2);
            return;
          }
          !qt2 && ue3 && ue3(j3), _e2 = j3, z3.tween && !a4 && (z3.tween.kill(), z3.tween = 0), Q3 && Q3.pause(), p3 && n3 && (n3.revert({ kill: false }).invalidate(), n3.getChildren ? n3.getChildren(true, true, false).forEach(function(e21) {
            return e21.vars.immediateRender && e21.render(0, true, true);
          }) : n3.vars.immediateRender && n3.render(0, true, true)), j3.isReverted || j3.revert(true, true), j3._subPinOffset = false;
          var s4 = fe3(), l4 = pe3(), m4 = w3 ? w3.duration() : Ge2(k3, D3), h4 = q3 <= 0.01 || !q3, g4 = 0, _4 = o4 || 0, v3 = Xe2(a4) ? a4.end : t5.end, y3 = t5.endTrigger || u3, b4 = Xe2(a4) ? a4.start : t5.start || (t5.start === 0 || !u3 ? 0 : d3 ? `0 0` : `0 100%`), S4 = j3.pinnedContainer = t5.pinnedContainer && ne2(t5.pinnedContainer, j3), C3 = u3 && Math.max(0, Z2.indexOf(j3)) || 0, T4 = C3, E4, A4, oe4, se4, N3, I3, me3, he3, ve3, L3, xe3, B4, V4;
          for (ce3 && Xe2(a4) && (B4 = M2.getProperty(W3, D3.p), V4 = M2.getProperty(De3, D3.p)); T4-- > 0; ) I3 = Z2[T4], I3.end || I3.refresh(0, 1) || (_e2 = j3), me3 = I3.pin, me3 && (me3 === u3 || me3 === d3 || me3 === S4) && !I3.isReverted && (L3 || (L3 = []), L3.unshift(I3), I3.revert(true, true)), I3 !== Z2[T4] && (C3--, T4--);
          for (Je2(b4) && (b4 = b4(j3)), b4 = Pe2(b4, `start`, j3), H3 = mn2(b4, u3, s4, D3, R3(), Te3, W3, j3, l4, le3, ae3, m4, w3, j3._startClamp && `_startClamp`) || (d3 ? -1e-3 : 0), Je2(v3) && (v3 = v3(j3)), qe2(v3) && !v3.indexOf(`+=`) && (~v3.indexOf(` `) ? v3 = (qe2(b4) ? b4.split(` `)[0] : ``) + v3 : (g4 = At2(v3.substr(2), s4), v3 = qe2(b4) ? b4 : (w3 ? M2.utils.mapRange(0, w3.duration(), w3.scrollTrigger.start, w3.scrollTrigger.end, H3) : H3) + g4, y3 = u3)), v3 = Pe2(v3, `end`, j3), U3 = Math.max(H3, mn2(v3 || (y3 ? `100% 0` : m4), y3, s4, D3, R3() + g4, Ee3, De3, j3, l4, le3, ae3, m4, w3, j3._endClamp && `_endClamp`)) || -1e-3, g4 = 0, T4 = C3; T4--; ) I3 = Z2[T4] || {}, me3 = I3.pin, me3 && I3.start - I3._pinPush <= H3 && !w3 && I3.end > 0 && (E4 = I3.end - (j3._startClamp ? Math.max(0, I3.start) : I3.start), (me3 === u3 && I3.start - I3._pinPush < H3 || me3 === S4) && isNaN(b4) && (g4 += E4 * (1 - I3.progress)), me3 === d3 && (_4 += E4));
          if (H3 += g4, U3 += g4, j3._startClamp && (j3._startClamp += g4), j3._endClamp && !qt2 && (j3._endClamp = U3 || -1e-3, U3 = Math.min(U3, Ge2(k3, D3))), q3 = U3 - H3 || (H3 -= 0.01) && 1e-3, h4 && (be3 = M2.utils.clamp(0, 1, M2.utils.normalize(H3, U3, Vt3))), j3._pinPush = _4, Te3 && g4 && (E4 = {}, E4[D3.a] = `+=` + g4, S4 && (E4[D3.p] = `-=` + R3()), M2.set([Te3, Ee3], E4)), d3 && !(ke2 && j3.end >= Ge2(k3, D3))) E4 = mt2(d3), se4 = D3 === te2, oe4 = R3(), et3 = parseFloat(He3(D3.a)) + _4, !m4 && U3 > 1 && (xe3 = (re3 ? P2.scrollingElement || de2 : k3).style, xe3 = { style: xe3, value: xe3[`overflow` + D3.a.toUpperCase()] }, re3 && mt2(F2)[`overflow` + D3.a.toUpperCase()] !== `scroll` && (xe3.style[`overflow` + D3.a.toUpperCase()] = `scroll`)), cn2(d3, Y3, E4), J3 = dn2(d3), A4 = _t2(d3, true), he3 = ae3 && ie2(k3, se4 ? ee2 : te2)(), f3 ? (rt3 = [f3 + D3.os2, q3 + _4 + pt2], rt3.t = Y3, T4 = f3 === X2 ? vt2(d3, D3) + q3 + _4 : 0, T4 && (rt3.push(D3.d, T4 + pt2), Y3.style.flexBasis !== `auto` && (Y3.style.flexBasis = T4 + pt2)), un2(rt3), S4 && Z2.forEach(function(e21) {
            e21.pin === S4 && e21.vars.pinSpacing !== false && (e21._subPinOffset = true);
          }), ae3 && R3(Vt3)) : (T4 = vt2(d3, D3), T4 && Y3.style.flexBasis !== `auto` && (Y3.style.flexBasis = T4 + pt2)), ae3 && (N3 = { top: A4.top + (se4 ? oe4 - H3 : he3) + pt2, left: A4.left + (se4 ? he3 : oe4 - H3) + pt2, boxSizing: `border-box`, position: `fixed` }, N3[it2] = N3[`max` + dt2] = Math.ceil(A4.width) + pt2, N3[at2] = N3[`max` + ft2] = Math.ceil(A4.height) + pt2, N3[ut2] = N3[ut2 + ct2] = N3[ut2 + ot2] = N3[ut2 + lt2] = N3[ut2 + st2] = `0`, N3[X2] = E4[X2], N3[X2 + ct2] = E4[X2 + ct2], N3[X2 + ot2] = E4[X2 + ot2], N3[X2 + lt2] = E4[X2 + lt2], N3[X2 + st2] = E4[X2 + st2], Le3 = fn2(Ie3, N3, x3), qt2 && R3(0)), n3 ? (ve3 = n3._initted, Se2(1), n3.render(n3.duration(), true, true), tt3 = He3(D3.a) - et3 + q3 + _4, Ct3 = Math.abs(q3 - tt3) > 1, ae3 && Ct3 && Le3.splice(Le3.length - 2, 2), n3.render(0, true, true), ve3 || n3.invalidate(true), n3.parent || n3.totalTime(n3.totalTime()), Se2(0)) : tt3 = q3, xe3 && (xe3.value ? xe3.style[`overflow` + D3.a.toUpperCase()] = xe3.value : xe3.style.removeProperty(`overflow-` + D3.a));
          else if (u3 && R3() && !w3) for (A4 = u3.parentNode; A4 && A4 !== F2; ) A4._pinOffset && (H3 -= A4._pinOffset, U3 -= A4._pinOffset), A4 = A4.parentNode;
          L3 && L3.forEach(function(e21) {
            return e21.revert(false, true);
          }), j3.start = H3, j3.end = U3, Ce3 = we3 = qt2 ? Vt3 : R3(), !w3 && !qt2 && (Ce3 < Vt3 && R3(Vt3), j3.scroll.rec = 0), j3.revert(false, true), ye3 = G2(), zt3 && (ge3 = -1, zt3.restart(true)), _e2 = 0, n3 && O3 && (n3._initted || Ht3) && n3.progress() !== Ht3 && n3.progress(Ht3 || 0, true).render(n3.time(), true, true), (h4 || be3 !== j3.progress || w3 || p3 || n3 && !n3._initted) && (n3 && !O3 && (n3._initted || be3 || n3.vars.immediateRender !== false) && n3.totalProgress(w3 && H3 < -1e-3 && !be3 ? M2.utils.normalize(H3, U3, 0) : be3, true), j3.progress = h4 || (Ce3 - H3) / q3 === be3 ? 0 : be3), d3 && f3 && (Y3._pinOffset = Math.round(j3.progress * tt3)), Q3 && Q3.invalidate(), isNaN(B4) || (B4 -= M2.getProperty(W3, D3.p), V4 -= M2.getProperty(De3, D3.p), vn2(W3, D3, B4), vn2(Te3, D3, B4 - (o4 || 0)), vn2(De3, D3, V4), vn2(Ee3, D3, V4 - (o4 || 0))), h4 && !qt2 && j3.update(), c3 && !qt2 && !K3 && (K3 = true, c3(j3), K3 = false);
        }
      }, j3.getVelocity = function() {
        return (R3() - we3) / (G2() - he2) * 1e3 || 0;
      }, j3.endAnimation = function() {
        Ze2(j3.callbackAnimation), n3 && (Q3 ? Q3.progress(1) : n3.paused() ? O3 || Ze2(n3, j3.direction < 0, 1) : Ze2(n3, n3.reversed()));
      }, j3.labelToScroll = function(e21) {
        return n3 && n3.labels && (H3 || j3.refresh() || H3) + n3.labels[e21] / n3.duration() * q3 || 0;
      }, j3.getTrailing = function(e21) {
        var t6 = Z2.indexOf(j3), n4 = j3.direction > 0 ? Z2.slice(0, t6).reverse() : Z2.slice(t6 + 1);
        return (qe2(e21) ? n4.filter(function(t7) {
          return t7.vars.preventOverlaps === e21;
        }) : n4).filter(function(e22) {
          return j3.direction > 0 ? e22.end <= H3 : e22.start >= U3;
        });
      }, j3.update = function(e21, t6, r4) {
        if (!(w3 && !r4 && !e21)) {
          var o4 = qt2 === true ? Vt3 : j3.scroll(), c4 = e21 ? 0 : (o4 - H3) / q3, u4 = c4 < 0 ? 0 : c4 > 1 ? 1 : c4 || 0, p4 = j3.progress, h4, g4, v3, y3, S4, C3, A4, ee3;
          if (t6 && (we3 = Ce3, Ce3 = w3 ? R3() : o4, b3 && (Pt3 = Mt3, Mt3 = n3 && !O3 ? n3.totalProgress() : u4)), m3 && d3 && !_e2 && !je2 && Me2 && (!u4 && H3 < o4 + (o4 - we3) / (G2() - he2) * m3 ? u4 = 1e-4 : u4 === 1 && U3 > o4 + (o4 - we3) / (G2() - he2) * m3 && (u4 = 0.9999)), u4 !== p4 && j3.enabled) {
            if (h4 = j3.isActive = !!u4 && u4 < 1, g4 = !!p4 && p4 < 1, C3 = h4 !== g4, S4 = C3 || !!u4 != !!p4, j3.direction = u4 > p4 ? 1 : -1, j3.progress = u4, S4 && !_e2 && (v3 = u4 && !p4 ? 0 : u4 === 1 ? 1 : p4 === 1 ? 2 : 3, O3 && (y3 = !C3 && se3[v3 + 1] !== `none` && se3[v3 + 1] || se3[v3], ee3 = n3 && (y3 === `complete` || y3 === `reset` || y3 in n3))), E3 && (C3 || ee3) && (ee3 || l3 || !n3) && (Je2(E3) ? E3(j3) : j3.getTrailing(E3).forEach(function(e22) {
              return e22.endAnimation();
            })), O3 || (Q3 && !_e2 && !je2 ? (Q3._dp._time - Q3._start !== Q3._time && Q3.render(Q3._dp._time - Q3._start), Q3.resetTo ? Q3.resetTo(`totalProgress`, u4, n3._tTime / n3._tDur) : (Q3.vars.totalProgress = u4, Q3.invalidate().restart())) : n3 && n3.totalProgress(u4, !!(_e2 && (ye3 || e21)))), d3) {
              if (e21 && f3 && (Y3.style[f3 + D3.os2] = nt3), !ae3) Ke3(ze2(et3 + tt3 * u4));
              else if (S4) {
                if (A4 = !e21 && u4 > p4 && U3 + 1 > o4 && o4 + 1 >= Ge2(k3, D3), x3) if (!e21 && (h4 || A4)) {
                  var ne3 = _t2(d3, true), re4 = o4 - H3;
                  gn2(d3, F2, ne3.top + (D3 === te2 ? re4 : 0) + pt2, ne3.left + (D3 === te2 ? 0 : re4) + pt2);
                } else gn2(d3, Y3);
                un2(h4 || A4 ? Le3 : J3), Ct3 && u4 < 1 && h4 || Ke3(et3 + (u4 === 1 && !A4 ? tt3 : 0));
              }
            }
            b3 && !z3.tween && !_e2 && !je2 && zt3.restart(true), a3 && (C3 || _3 && u4 && (u4 < 1 || !Ae2)) && I2(a3.targets).forEach(function(e22) {
              return e22.classList[h4 || _3 ? `add` : `remove`](a3.className);
            }), i3 && !O3 && !e21 && i3(j3), S4 && !_e2 ? (O3 && (ee3 && (y3 === `complete` ? n3.pause().totalProgress(1) : y3 === `reset` ? n3.restart(true).pause() : y3 === `restart` ? n3.restart(true) : n3[y3]()), i3 && i3(j3)), (C3 || !Ae2) && (s3 && C3 && Qe2(j3, s3), oe3[v3] && Qe2(j3, oe3[v3]), _3 && (u4 === 1 ? j3.kill(false, 1) : oe3[v3] = 0), C3 || (v3 = u4 === 1 ? 1 : 3, oe3[v3] && Qe2(j3, oe3[v3]))), T3 && !h4 && Math.abs(j3.getVelocity()) > (Ye2(T3) ? T3 : 2500) && (Ze2(j3.callbackAnimation), Q3 ? Q3.progress(1) : Ze2(n3, y3 === `reverse` ? 1 : !u4, 1))) : O3 && i3 && !_e2 && i3(j3);
          }
          if (Et3) {
            var ie3 = w3 ? o4 / w3.duration() * (w3._caScrollDist || 0) : o4;
            yt3(ie3 + +!!W3._isFlipped), Et3(ie3);
          }
          Ut3 && Ut3(-o4 / w3.duration() * (w3._caScrollDist || 0));
        }
      }, j3.enable = function(t6, n4) {
        j3.enabled || (j3.enabled = true, wt2(k3, `resize`, Lt2), re3 || wt2(k3, `scroll`, Ft2), ue3 && wt2(e20, `refreshInit`, ue3), t6 !== false && (j3.progress = be3 = 0, Ce3 = we3 = ge3 = R3()), n4 !== false && j3.refresh());
      }, j3.getTween = function(e21) {
        return e21 && z3 ? z3.tween : Q3;
      }, j3.setPositions = function(e21, t6, n4, r4) {
        if (w3) {
          var i4 = w3.scrollTrigger, a4 = w3.duration(), o4 = i4.end - i4.start;
          e21 = i4.start + o4 * e21 / a4, t6 = i4.start + o4 * t6 / a4;
        }
        j3.refresh(false, false, { start: Fe2(e21, n4 && !!j3._startClamp), end: Fe2(t6, n4 && !!j3._endClamp) }, r4), j3.update();
      }, j3.adjustPinSpacing = function(e21) {
        if (rt3 && e21) {
          var t6 = rt3.indexOf(D3.d) + 1;
          rt3[t6] = parseFloat(rt3[t6]) + e21 + pt2, rt3[1] = parseFloat(rt3[1]) + e21 + pt2, un2(rt3);
        }
      }, j3.disable = function(t6, n4) {
        if (t6 !== false && j3.revert(true, true), j3.enabled && (j3.enabled = j3.isActive = false, n4 || Q3 && Q3.pause(), Vt3 = 0, B3 && (B3.uncache = 1), ue3 && Tt2(e20, `refreshInit`, ue3), zt3 && (zt3.pause(), z3.tween && z3.tween.kill() && (z3.tween = 0)), !re3)) {
          for (var r4 = Z2.length; r4--; ) if (Z2[r4].scroller === k3 && Z2[r4] !== j3) return;
          Tt2(k3, `resize`, Lt2), re3 || Tt2(k3, `scroll`, Ft2);
        }
      }, j3.kill = function(e21, r4) {
        j3.disable(e21, r4), Q3 && !r4 && Q3.kill(), o3 && delete Nt2[o3];
        var i4 = Z2.indexOf(j3);
        i4 >= 0 && Z2.splice(i4, 1), i4 === L2 && tn2 > 0 && L2--, i4 = 0, Z2.forEach(function(e22) {
          return e22.scroller === j3.scroller && (i4 = 1);
        }), i4 || qt2 || (j3.scroll.rec = 0), n3 && (n3.scrollTrigger = null, e21 && n3.revert({ kill: false }), r4 || n3.kill()), Te3 && [Te3, Ee3, W3, De3].forEach(function(e22) {
          return e22.parentNode && e22.parentNode.removeChild(e22);
        }), nn2 === j3 && (nn2 = 0), d3 && (B3 && (B3.uncache = 1), i4 = 0, Z2.forEach(function(e22) {
          return e22.pin === d3 && i4++;
        }), i4 || (B3.spacer = 0)), t5.onKill && t5.onKill(j3);
      }, Z2.push(j3), j3.enable(false, false), Wt3 && Wt3(j3), n3 && n3.add && !q3) {
        var Yt3 = j3.update;
        j3.update = function() {
          j3.update = Yt3, v2.cache++, H3 || U3 || j3.refresh();
        }, M2.delayedCall(0.01, j3.update), q3 = 0.01, H3 = U3 = 0;
      } else j3.refresh();
      d3 && Xt2();
    }, e20.register = function(t5) {
      return ue2 || (ue2 = (M2 = t5 || Y2(), J2() && window.document && e20.enable(), Ne2)), ue2;
    }, e20.defaults = function(e21) {
      if (e21) for (var t5 in e21) Ot2[t5] = e21[t5];
      return Ot2;
    }, e20.disable = function(e21, t5) {
      Ne2 = 0, Z2.forEach(function(n4) {
        return n4[t5 ? `kill` : `disable`](e21);
      }), Tt2(N2, `wheel`, Ft2), Tt2(P2, `scroll`, Ft2), clearInterval(ge2), Tt2(P2, `touchcancel`, Re2), Tt2(F2, `touchstart`, Re2), Ct2(Tt2, P2, `pointerdown,touchstart,mousedown`, Ie2), Ct2(Tt2, P2, `pointerup,touchend,mouseup`, Le2), pe2.kill(), Ke2(Tt2);
      for (var n3 = 0; n3 < v2.length; n3 += 3) Et2(Tt2, v2[n3], v2[n3 + 1]), Et2(Tt2, v2[n3], v2[n3 + 2]);
    }, e20.enable = function() {
      if (N2 = window, P2 = document, de2 = P2.documentElement, F2 = P2.body, M2) if (I2 = M2.utils.toArray, me2 = M2.utils.clamp, Te2 = M2.core.context || Re2, Se2 = M2.core.suppressOverwrites || Re2, Ee2 = N2.history.scrollRestoration || `auto`, en2 = N2.pageYOffset || 0, M2.core.globals(`ScrollTrigger`, e20), F2) {
        Ne2 = 1, W2 = document.createElement(`div`), W2.style.height = `100vh`, W2.style.position = `absolute`, Zt2(), q2(), j2.register(M2), e20.isTouch = j2.isTouch, U2 = j2.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), Ce2 = j2.isTouch === 1, wt2(N2, `wheel`, Ft2), fe2 = [N2, P2, de2, F2], M2.matchMedia ? (e20.matchMedia = function(e21) {
          var t6 = M2.matchMedia(), n4;
          for (n4 in e21) t6.add(n4, e21[n4]);
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
        var t5 = F2.hasAttribute(`style`), n3 = F2.style, r3 = n3.borderTopStyle, i3 = M2.core.Animation.prototype, a3, o3;
        for (i3.revert || Object.defineProperty(i3, "revert", { value: function() {
          return this.time(-0.01, true);
        } }), n3.borderTopStyle = `solid`, a3 = _t2(F2), te2.m = Math.round(a3.top + te2.sc()) || 0, ee2.m = Math.round(a3.left + ee2.sc()) || 0, r3 ? n3.borderTopStyle = r3 : n3.removeProperty(`border-top-style`), t5 || (F2.setAttribute(`style`, ``), F2.removeAttribute(`style`)), ge2 = setInterval(Q2, 250), M2.delayedCall(0.5, function() {
          return je2 = 0;
        }), wt2(P2, `touchcancel`, Re2), wt2(F2, `touchstart`, Re2), Ct2(wt2, P2, `pointerdown,touchstart,mousedown`, Ie2), Ct2(wt2, P2, `pointerup,touchend,mouseup`, Le2), ye2 = M2.utils.checkPrefix(`transform`), on2.push(ye2), ue2 = G2(), pe2 = M2.delayedCall(0.2, $t2).pause(), z2 = [P2, `visibilitychange`, function() {
          var e21 = N2.innerWidth, t6 = N2.innerHeight;
          P2.hidden ? (be2 = e21, R2 = t6) : (be2 !== e21 || R2 !== t6) && Lt2();
        }, P2, `DOMContentLoaded`, $t2, N2, `load`, $t2, N2, `resize`, Lt2], Ke2(wt2), Z2.forEach(function(e21) {
          return e21.enable(0, 1);
        }), o3 = 0; o3 < v2.length; o3 += 3) Et2(Tt2, v2[o3], v2[o3 + 1]), Et2(Tt2, v2[o3], v2[o3 + 2]);
      } else P2 && P2.addEventListener(`DOMContentLoaded`, function t6() {
        e20.enable(), P2.removeEventListener(`DOMContentLoaded`, t6);
      });
    }, e20.config = function(t5) {
      `limitCallbacks` in t5 && (Ae2 = !!t5.limitCallbacks);
      var n3 = t5.syncInterval;
      n3 && clearInterval(ge2) || (ge2 = n3) && setInterval(Q2, n3), `ignoreMobileResize` in t5 && (Ce2 = e20.isTouch === 1 && t5.ignoreMobileResize), `autoRefreshEvents` in t5 && (Ke2(Tt2) || Ke2(wt2, t5.autoRefreshEvents || `none`), B2 = (t5.autoRefreshEvents + ``).indexOf(`resize`) === -1);
    }, e20.scrollerProxy = function(e21, t5) {
      var n3 = ne2(e21), r3 = v2.indexOf(n3), i3 = Be2(n3);
      ~r3 && v2.splice(r3, i3 ? 6 : 2), t5 && (i3 ? y2.unshift(N2, t5, F2, t5, de2, t5) : y2.unshift(n3, t5));
    }, e20.clearMatchMedia = function(e21) {
      Z2.forEach(function(t5) {
        return t5._ctx && t5._ctx.query === e21 && t5._ctx.kill(true, true);
      });
    }, e20.isInViewport = function(e21, t5, n3) {
      var r3 = (qe2(e21) ? ne2(e21) : e21).getBoundingClientRect(), i3 = r3[n3 ? it2 : at2] * t5 || 0;
      return n3 ? r3.right - i3 > 0 && r3.left + i3 < N2.innerWidth : r3.bottom - i3 > 0 && r3.top + i3 < N2.innerHeight;
    }, e20.positionInViewport = function(e21, t5, n3) {
      qe2(e21) && (e21 = ne2(e21));
      var r3 = e21.getBoundingClientRect(), i3 = r3[n3 ? it2 : at2], a3 = t5 == null ? i3 / 2 : t5 in kt2 ? kt2[t5] * i3 : ~t5.indexOf(`%`) ? parseFloat(t5) * i3 / 100 : parseFloat(t5) || 0;
      return n3 ? (r3.left + a3) / N2.innerWidth : (r3.top + a3) / N2.innerHeight;
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
    var n3 = Rt2[e20] || (Rt2[e20] = []);
    ~n3.indexOf(t4) || n3.push(t4);
  }, $2.removeEventListener = function(e20, t4) {
    var n3 = Rt2[e20], r3 = n3 && n3.indexOf(t4);
    r3 >= 0 && n3.splice(r3, 1);
  }, $2.batch = function(e20, t4) {
    var n3 = [], r3 = {}, i3 = t4.interval || 0.016, a3 = t4.batchMax || 1e9, o3 = function(e21, t5) {
      var n4 = [], r4 = [], o4 = M2.delayedCall(i3, function() {
        t5(n4, r4), n4 = [], r4 = [];
      }).pause();
      return function(e22) {
        n4.length || o4.restart(true), n4.push(e22.trigger), r4.push(e22), a3 <= n4.length && o4.progress(1);
      };
    }, s3;
    for (s3 in t4) r3[s3] = s3.substr(0, 2) === `on` && Je2(t4[s3]) && s3 !== `onRefreshInit` ? o3(s3, t4[s3]) : t4[s3];
    return Je2(a3) && (a3 = a3(), wt2($2, `refresh`, function() {
      return a3 = t4.batchMax();
    })), I2(e20).forEach(function(e21) {
      var t5 = {};
      for (s3 in r3) t5[s3] = r3[s3];
      t5.trigger = e21, n3.push($2.create(t5));
    }), n3;
  };
  var bn2 = function(e20, t4, n3, r3) {
    return t4 > r3 ? e20(r3) : t4 < 0 && e20(0), n3 > r3 ? (r3 - t4) / (n3 - t4) : n3 < 0 ? t4 / (t4 - n3) : 1;
  };
  var xn2 = function e18(t4, n3) {
    n3 === true ? t4.style.removeProperty(`touch-action`) : t4.style.touchAction = n3 === true ? `auto` : n3 ? `pan-` + n3 + (j2.isTouch ? ` pinch-zoom` : ``) : `none`, t4 === de2 && e18(F2, n3);
  };
  var Sn2 = { auto: 1, scroll: 1 };
  var Cn2 = function(e20) {
    var t4 = e20.event, n3 = e20.target, r3 = e20.axis, i3 = (t4.changedTouches ? t4.changedTouches[0] : t4).target, a3 = i3._gsap || M2.core.getCache(i3), o3 = G2(), s3;
    if (!a3._isScrollT || o3 - a3._isScrollT > 2e3) {
      for (; i3 && i3 !== F2 && (i3.scrollHeight <= i3.clientHeight && i3.scrollWidth <= i3.clientWidth || !(Sn2[(s3 = mt2(i3)).overflowY] || Sn2[s3.overflowX])); ) i3 = i3.parentNode;
      a3._isScroll = i3 && i3 !== n3 && !Be2(i3) && (Sn2[(s3 = mt2(i3)).overflowY] || Sn2[s3.overflowX]), a3._isScrollT = o3;
    }
    (a3._isScroll || r3 === `x`) && (t4.stopPropagation(), t4._gsapAllow = true);
  };
  var wn2 = function(e20, t4, n3, r3) {
    return j2.create({ target: e20, capture: true, debounce: false, lockAxis: true, type: t4, onWheel: r3 && (r3 = Cn2), onPress: r3, onDrag: r3, onScroll: r3, onEnable: function() {
      return n3 && wt2(P2, j2.eventTypes[0], Dn2, false, true);
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
    var t4 = e20, n3 = t4.normalizeScrollX, r3 = t4.momentum, i3 = t4.allowNestedScroll, a3 = t4.onRelease, o3, s3, c3 = ne2(e20.target) || de2, l3 = M2.core.globals().ScrollSmoother, u3 = l3 && l3.get(), d3 = U2 && (e20.content && ne2(e20.content) || u3 && e20.content !== false && !u3.smooth() && u3.content()), f3 = ie2(c3, te2), p3 = ie2(c3, ee2), m3 = 1, h3 = (j2.isTouch && N2.visualViewport ? N2.visualViewport.scale * N2.visualViewport.width : N2.outerWidth) / N2.innerWidth, g3 = 0, _3 = Je2(r3) ? function() {
      return r3(o3);
    } : function() {
      return r3 || 2.8;
    }, y3, b3, x3 = wn2(c3, e20.type, true, i3), S3 = function() {
      return b3 = false;
    }, C3 = Re2, w3 = Re2, T3 = function() {
      s3 = Ge2(c3, te2), w3 = me2(+!!U2, s3), n3 && (C3 = me2(0, Ge2(c3, ee2))), y3 = Jt2;
    }, E3 = function() {
      d3._gsap.y = ze2(parseFloat(d3._gsap.y) + f3.offset) + `px`, d3.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` + parseFloat(d3._gsap.y) + `, 0, 1)`, f3.offset = f3.cacheID = 0;
    }, D3 = function() {
      if (b3) {
        requestAnimationFrame(S3);
        var e21 = ze2(o3.deltaY / 2), t5 = w3(f3.v - e21);
        if (d3 && t5 !== f3.v + f3.offset) {
          f3.offset = t5 - f3.v;
          var n4 = ze2((parseFloat(d3 && d3._gsap.y) || 0) - f3.offset);
          d3.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` + n4 + `, 0, 1)`, d3._gsap.y = n4 + `px`, f3.cacheID = v2.cache, rn2();
        }
        return true;
      }
      f3.offset && E3(), b3 = true;
    }, O3, k3, A3, re3, ae3 = function() {
      T3(), O3.isActive() && O3.vars.scrollY > s3 && (f3() > s3 ? O3.progress(1) && f3(s3) : O3.resetTo(`scrollY`, s3));
    };
    return d3 && M2.set(d3, { y: `+=0` }), e20.ignoreCheck = function(e21) {
      return U2 && e21.type === `touchmove` && D3(e21) || m3 > 1.05 && e21.type !== `touchstart` || o3.isGesturing || e21.touches && e21.touches.length > 1;
    }, e20.onPress = function() {
      b3 = false;
      var e21 = m3;
      m3 = ze2((N2.visualViewport && N2.visualViewport.scale || 1) / h3), O3.pause(), e21 !== m3 && xn2(c3, m3 > 1.01 || !n3 && `x`), k3 = p3(), A3 = f3(), T3(), y3 = Jt2;
    }, e20.onRelease = e20.onGestureStart = function(e21, t5) {
      if (f3.offset && E3(), !t5) re3.restart(true);
      else {
        v2.cache++;
        var r4 = _3(), i4, o4;
        n3 && (i4 = p3(), o4 = i4 + r4 * 0.05 * -e21.velocityX / 0.227, r4 *= bn2(p3, i4, o4, Ge2(c3, ee2)), O3.vars.scrollX = C3(o4)), i4 = f3(), o4 = i4 + r4 * 0.05 * -e21.velocityY / 0.227, r4 *= bn2(f3, i4, o4, Ge2(c3, te2)), O3.vars.scrollY = w3(o4), O3.invalidate().duration(r4).play(0.01), (U2 && O3.vars.scrollY >= s3 || i4 >= s3 - 1) && M2.to({}, { onUpdate: ae3, duration: r4 });
      }
      a3 && a3(e21);
    }, e20.onWheel = function() {
      O3._ts && O3.pause(), G2() - g3 > 1e3 && (y3 = 0, g3 = G2());
    }, e20.onChange = function(e21, t5, r4, i4, a4) {
      if (Jt2 !== y3 && T3(), t5 && n3 && p3(C3(i4[2] === t5 ? k3 + (e21.startX - e21.x) : p3() + t5 - i4[1])), r4) {
        f3.offset && E3();
        var o4 = a4[2] === r4, s4 = o4 ? A3 + e21.startY - e21.y : f3() + r4 - a4[1], c4 = w3(s4);
        o4 && s4 !== c4 && (A3 += c4 - s4), f3(c4);
      }
      (r4 || t5) && rn2();
    }, e20.onEnable = function() {
      xn2(c3, !n3 && `x`), $2.addEventListener(`refresh`, ae3), wt2(N2, `resize`, ae3), f3.smooth && (f3.smooth = (f3.target.style.scrollBehavior = `auto`, p3.smooth = false)), x3.enable();
    }, e20.onDisable = function() {
      xn2(c3, true), Tt2(N2, `resize`, ae3), $2.removeEventListener(`refresh`, ae3), x3.kill();
    }, e20.lockAxis = e20.lockAxis !== false, o3 = new j2(e20), o3.iOS = U2, U2 && !f3() && f3(1), U2 && M2.ticker.add(Re2), re3 = o3._dc, O3 = M2.to(o3, { ease: `power4`, paused: true, inherit: false, scrollX: n3 ? `+=0.1` : `+=0`, scrollY: `+=0.1`, modifiers: { scrollY: _n2(f3, f3(), function() {
      return O3.pause();
    }) }, onUpdate: rn2, onComplete: re3.vars.onComplete }), o3;
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

  // public/shopify/plantilla99/assets/js/deviceInfo.eHzC_0c8.js
  var e19 = (e20) => {
    switch (e20) {
      case `10.0`:
        return `Windows 10/11`;
      case `6.3`:
        return `Windows 8.1`;
      case `6.2`:
        return `Windows 8`;
      case `6.1`:
        return `Windows 7`;
      default:
        return `NT ${e20}`;
    }
  };
  var t3 = { get ua() {
    return typeof window < `u` ? navigator.userAgent : ``;
  }, get userAgent() {
    return this.ua;
  }, get isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(this.ua);
  }, get operatingSystem() {
    let t4 = this.ua, n3 = null;
    if (/windows/i.test(t4)) {
      let r3 = t4.match(/Windows NT (\d+\.\d+)/i);
      return n3 = r3 && r3[1] ? e19(r3[1]) : `Unknown Version`, { name: `windows`, version: n3, buttonText: ` for Windows`, links: [{ buttonText: `Download for x64`, href: null }, { buttonText: `Download for ARM64`, href: null }] };
    } else if (/macintosh|mac os x/i.test(t4)) {
      let e20 = t4.match(/Mac OS X (\d+[_.]\d+([_.]\d+)?)/i);
      return n3 = e20 && e20[1] ? `macOS ` + e20[1].replace(/_/g, `.`) : `Unknown Version`, { name: `mac`, version: n3, buttonText: ` for MacOS`, links: [{ buttonText: `Download for Apple Silicon`, href: null }, { buttonText: `Download for Intel`, href: null }] };
    } else if (/linux/i.test(t4)) return n3 = `Generic/Unknown Distribution`, { name: `linux`, version: n3, buttonText: ` for Linux`, links: [{ buttonText: `Download`, href: null }] };
    else return { name: `unknown`, version: null, buttonText: ``, links: [] };
  } };

  // public/shopify/plantilla99/assets/js/index.astro_astro_type_script_index_0_lang.CghSekDP.js
  ci.registerPlugin($2), document.addEventListener(`DOMContentLoaded`, () => {
    let t4 = document.querySelector(`[data-welcome-section]`);
    if (!t4) return;
    let r3 = t4.querySelector(`[data-logo]`), i3 = t4.querySelector(`[data-welcome-header]`), a3 = t4.querySelector(`[data-cta]`), o3 = t4.querySelector(`[data-hero-particles]`), s3 = t4.querySelector(`[data-os-cta-container]`);
    if (s3) {
      let e20 = t3.operatingSystem;
      s3.innerHTML = `
        <a class="call-to-action button button-primary" href="/download">
          <span style="display: flex; align-items: center; gap: 8px;">
            ${e20.name === `unknown` ? `` : `<span class="symbol" style="font-size: 20px;">${e20.name === `mac` ? `desktop_mac` : e20.name === `windows` ? `desktop_windows` : `terminal`}</span>`}
            Download${e20.buttonText}
          </span>
        </a>
      `;
    }
    let c3 = ci.timeline();
    i3 && i3.helper && (i3.helper.initialize(), i3.helper.startTyping(c3)), c3.from(r3, { opacity: 0, y: `1em`, duration: 2, ease: `power2.out` }).from(a3, { opacity: 0, y: 50, duration: 2, ease: `power2.out` }, `<`).from(o3, { opacity: 0, duration: 4, ease: `power2.out` }, `<`), ci.to(o3, { scrollTrigger: { trigger: t4, start: `center top`, end: `bottom top`, scrub: true, onUpdate: (e20) => {
      o3.style.opacity = String(1 - e20.progress);
    } }, opacity: 0, ease: `power2.out` });
  });
})();
