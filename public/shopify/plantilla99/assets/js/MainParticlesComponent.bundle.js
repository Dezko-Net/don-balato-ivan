"use strict";
(() => {
  // public/shopify/plantilla99/assets/js/Mouse.ZrlRGzn3.js
  var e = Object.create;
  var t = Object.defineProperty;
  var n = Object.getOwnPropertyDescriptor;
  var r = Object.getOwnPropertyNames;
  var i = Object.getPrototypeOf;
  var a = Object.prototype.hasOwnProperty;
  var o = (e17, t2) => () => (t2 || (e17((t2 = { exports: {} }).exports, t2), e17 = null), t2.exports);
  var s = (e17, i2, o2, s2) => {
    if (i2 && typeof i2 == `object` || typeof i2 == `function`) for (var c2 = r(i2), l2 = 0, u2 = c2.length, d2; l2 < u2; l2++) d2 = c2[l2], !a.call(e17, d2) && d2 !== o2 && t(e17, d2, { get: ((e18) => i2[e18]).bind(null, d2), enumerable: !(s2 = n(i2, d2)) || s2.enumerable });
    return e17;
  };
  var c = (n2, r2, a2) => (a2 = n2 == null ? {} : e(i(n2)), s(r2 || !n2 || !n2.__esModule ? t(a2, `default`, { value: n2, enumerable: true }) : a2, n2));
  var l = 1e3;
  var u = 1001;
  var d = 1002;
  var f = 1003;
  var p = 1004;
  var m = 1005;
  var h = 1006;
  var g = 1007;
  var _ = 1008;
  var v = 1009;
  var y = 1010;
  var b = 1011;
  var x = 1012;
  var S = 1013;
  var C = 1014;
  var w = 1015;
  var T = 1016;
  var E = 1017;
  var D = 1018;
  var O = 1020;
  var k = 35902;
  var A = 35899;
  var j = 1021;
  var ee = 1022;
  var te = 1023;
  var M = 1026;
  var N = 1027;
  var P = 1028;
  var ne = 1029;
  var re = 1030;
  var ie = 1031;
  var ae = 1033;
  var oe = 33776;
  var se = 33777;
  var F = 33778;
  var ce = 33779;
  var le = 35840;
  var ue = 35841;
  var de = 35842;
  var fe = 35843;
  var pe = 36196;
  var me = 37492;
  var I = 37496;
  var he = 37808;
  var L = 37809;
  var R = 37810;
  var z = 37811;
  var ge = 37812;
  var B = 37813;
  var V = 37814;
  var _e = 37815;
  var ve = 37816;
  var ye = 37817;
  var be = 37818;
  var xe = 37819;
  var Se = 37820;
  var Ce = 37821;
  var we = 36492;
  var Te = 36494;
  var Ee = 36495;
  var De = 36283;
  var Oe = 36284;
  var ke = 36285;
  var Ae = 36286;
  var je = 2300;
  var Me = 2301;
  var Ne = 2302;
  var Pe = 2400;
  var Fe = 2401;
  var Ie = 2402;
  var Le = 3200;
  var Re = 3201;
  var ze = `srgb`;
  var Be = `srgb-linear`;
  var Ve = `linear`;
  var He = `srgb`;
  var Ue = 7680;
  var We = 35044;
  var Ge = 2e3;
  var Ke = class {
    addEventListener(e17, t2) {
      this._listeners === void 0 && (this._listeners = {});
      let n2 = this._listeners;
      n2[e17] === void 0 && (n2[e17] = []), n2[e17].indexOf(t2) === -1 && n2[e17].push(t2);
    }
    hasEventListener(e17, t2) {
      let n2 = this._listeners;
      return n2 !== void 0 && n2[e17] !== void 0 && n2[e17].indexOf(t2) !== -1;
    }
    removeEventListener(e17, t2) {
      let n2 = this._listeners;
      if (n2 === void 0) return;
      let r2 = n2[e17];
      if (r2 !== void 0) {
        let e18 = r2.indexOf(t2);
        e18 !== -1 && r2.splice(e18, 1);
      }
    }
    dispatchEvent(e17) {
      let t2 = this._listeners;
      if (t2 === void 0) return;
      let n2 = t2[e17.type];
      if (n2 !== void 0) {
        e17.target = this;
        let t3 = n2.slice(0);
        for (let n3 = 0, r2 = t3.length; n3 < r2; n3++) t3[n3].call(this, e17);
        e17.target = null;
      }
    }
  };
  var qe = `00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`);
  var Je = Math.PI / 180;
  var Ye = 180 / Math.PI;
  function Xe() {
    let e17 = Math.random() * 4294967295 | 0, t2 = Math.random() * 4294967295 | 0, n2 = Math.random() * 4294967295 | 0, r2 = Math.random() * 4294967295 | 0;
    return (qe[e17 & 255] + qe[e17 >> 8 & 255] + qe[e17 >> 16 & 255] + qe[e17 >> 24 & 255] + `-` + qe[t2 & 255] + qe[t2 >> 8 & 255] + `-` + qe[t2 >> 16 & 15 | 64] + qe[t2 >> 24 & 255] + `-` + qe[n2 & 63 | 128] + qe[n2 >> 8 & 255] + `-` + qe[n2 >> 16 & 255] + qe[n2 >> 24 & 255] + qe[r2 & 255] + qe[r2 >> 8 & 255] + qe[r2 >> 16 & 255] + qe[r2 >> 24 & 255]).toLowerCase();
  }
  function H(e17, t2, n2) {
    return Math.max(t2, Math.min(n2, e17));
  }
  function Ze(e17, t2) {
    return (e17 % t2 + t2) % t2;
  }
  function Qe(e17, t2, n2) {
    return (1 - n2) * e17 + n2 * t2;
  }
  function $e(e17, t2) {
    switch (t2.constructor) {
      case Float32Array:
        return e17;
      case Uint32Array:
        return e17 / 4294967295;
      case Uint16Array:
        return e17 / 65535;
      case Uint8Array:
        return e17 / 255;
      case Int32Array:
        return Math.max(e17 / 2147483647, -1);
      case Int16Array:
        return Math.max(e17 / 32767, -1);
      case Int8Array:
        return Math.max(e17 / 127, -1);
      default:
        throw Error(`Invalid component type.`);
    }
  }
  function et(e17, t2) {
    switch (t2.constructor) {
      case Float32Array:
        return e17;
      case Uint32Array:
        return Math.round(e17 * 4294967295);
      case Uint16Array:
        return Math.round(e17 * 65535);
      case Uint8Array:
        return Math.round(e17 * 255);
      case Int32Array:
        return Math.round(e17 * 2147483647);
      case Int16Array:
        return Math.round(e17 * 32767);
      case Int8Array:
        return Math.round(e17 * 127);
      default:
        throw Error(`Invalid component type.`);
    }
  }
  var U = class e2 {
    constructor(t2 = 0, n2 = 0) {
      e2.prototype.isVector2 = true, this.x = t2, this.y = n2;
    }
    get width() {
      return this.x;
    }
    set width(e17) {
      this.x = e17;
    }
    get height() {
      return this.y;
    }
    set height(e17) {
      this.y = e17;
    }
    set(e17, t2) {
      return this.x = e17, this.y = t2, this;
    }
    setScalar(e17) {
      return this.x = e17, this.y = e17, this;
    }
    setX(e17) {
      return this.x = e17, this;
    }
    setY(e17) {
      return this.y = e17, this;
    }
    setComponent(e17, t2) {
      switch (e17) {
        case 0:
          this.x = t2;
          break;
        case 1:
          this.y = t2;
          break;
        default:
          throw Error(`index is out of range: ` + e17);
      }
      return this;
    }
    getComponent(e17) {
      switch (e17) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw Error(`index is out of range: ` + e17);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e17) {
      return this.x = e17.x, this.y = e17.y, this;
    }
    add(e17) {
      return this.x += e17.x, this.y += e17.y, this;
    }
    addScalar(e17) {
      return this.x += e17, this.y += e17, this;
    }
    addVectors(e17, t2) {
      return this.x = e17.x + t2.x, this.y = e17.y + t2.y, this;
    }
    addScaledVector(e17, t2) {
      return this.x += e17.x * t2, this.y += e17.y * t2, this;
    }
    sub(e17) {
      return this.x -= e17.x, this.y -= e17.y, this;
    }
    subScalar(e17) {
      return this.x -= e17, this.y -= e17, this;
    }
    subVectors(e17, t2) {
      return this.x = e17.x - t2.x, this.y = e17.y - t2.y, this;
    }
    multiply(e17) {
      return this.x *= e17.x, this.y *= e17.y, this;
    }
    multiplyScalar(e17) {
      return this.x *= e17, this.y *= e17, this;
    }
    divide(e17) {
      return this.x /= e17.x, this.y /= e17.y, this;
    }
    divideScalar(e17) {
      return this.multiplyScalar(1 / e17);
    }
    applyMatrix3(e17) {
      let t2 = this.x, n2 = this.y, r2 = e17.elements;
      return this.x = r2[0] * t2 + r2[3] * n2 + r2[6], this.y = r2[1] * t2 + r2[4] * n2 + r2[7], this;
    }
    min(e17) {
      return this.x = Math.min(this.x, e17.x), this.y = Math.min(this.y, e17.y), this;
    }
    max(e17) {
      return this.x = Math.max(this.x, e17.x), this.y = Math.max(this.y, e17.y), this;
    }
    clamp(e17, t2) {
      return this.x = H(this.x, e17.x, t2.x), this.y = H(this.y, e17.y, t2.y), this;
    }
    clampScalar(e17, t2) {
      return this.x = H(this.x, e17, t2), this.y = H(this.y, e17, t2), this;
    }
    clampLength(e17, t2) {
      let n2 = this.length();
      return this.divideScalar(n2 || 1).multiplyScalar(H(n2, e17, t2));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this;
    }
    dot(e17) {
      return this.x * e17.x + this.y * e17.y;
    }
    cross(e17) {
      return this.x * e17.y - this.y * e17.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(e17) {
      let t2 = Math.sqrt(this.lengthSq() * e17.lengthSq());
      if (t2 === 0) return Math.PI / 2;
      let n2 = this.dot(e17) / t2;
      return Math.acos(H(n2, -1, 1));
    }
    distanceTo(e17) {
      return Math.sqrt(this.distanceToSquared(e17));
    }
    distanceToSquared(e17) {
      let t2 = this.x - e17.x, n2 = this.y - e17.y;
      return t2 * t2 + n2 * n2;
    }
    manhattanDistanceTo(e17) {
      return Math.abs(this.x - e17.x) + Math.abs(this.y - e17.y);
    }
    setLength(e17) {
      return this.normalize().multiplyScalar(e17);
    }
    lerp(e17, t2) {
      return this.x += (e17.x - this.x) * t2, this.y += (e17.y - this.y) * t2, this;
    }
    lerpVectors(e17, t2, n2) {
      return this.x = e17.x + (t2.x - e17.x) * n2, this.y = e17.y + (t2.y - e17.y) * n2, this;
    }
    equals(e17) {
      return e17.x === this.x && e17.y === this.y;
    }
    fromArray(e17, t2 = 0) {
      return this.x = e17[t2], this.y = e17[t2 + 1], this;
    }
    toArray(e17 = [], t2 = 0) {
      return e17[t2] = this.x, e17[t2 + 1] = this.y, e17;
    }
    fromBufferAttribute(e17, t2) {
      return this.x = e17.getX(t2), this.y = e17.getY(t2), this;
    }
    rotateAround(e17, t2) {
      let n2 = Math.cos(t2), r2 = Math.sin(t2), i2 = this.x - e17.x, a2 = this.y - e17.y;
      return this.x = i2 * n2 - a2 * r2 + e17.x, this.y = i2 * r2 + a2 * n2 + e17.y, this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  };
  var tt = class {
    constructor(e17 = 0, t2 = 0, n2 = 0, r2 = 1) {
      this.isQuaternion = true, this._x = e17, this._y = t2, this._z = n2, this._w = r2;
    }
    static slerpFlat(e17, t2, n2, r2, i2, a2, o2) {
      let s2 = n2[r2 + 0], c2 = n2[r2 + 1], l2 = n2[r2 + 2], u2 = n2[r2 + 3], d2 = i2[a2 + 0], f2 = i2[a2 + 1], p2 = i2[a2 + 2], m2 = i2[a2 + 3];
      if (o2 === 0) {
        e17[t2 + 0] = s2, e17[t2 + 1] = c2, e17[t2 + 2] = l2, e17[t2 + 3] = u2;
        return;
      }
      if (o2 === 1) {
        e17[t2 + 0] = d2, e17[t2 + 1] = f2, e17[t2 + 2] = p2, e17[t2 + 3] = m2;
        return;
      }
      if (u2 !== m2 || s2 !== d2 || c2 !== f2 || l2 !== p2) {
        let e18 = 1 - o2, t3 = s2 * d2 + c2 * f2 + l2 * p2 + u2 * m2, n3 = t3 >= 0 ? 1 : -1, r3 = 1 - t3 * t3;
        if (r3 > 2 ** -52) {
          let i4 = Math.sqrt(r3), a3 = Math.atan2(i4, t3 * n3);
          e18 = Math.sin(e18 * a3) / i4, o2 = Math.sin(o2 * a3) / i4;
        }
        let i3 = o2 * n3;
        if (s2 = s2 * e18 + d2 * i3, c2 = c2 * e18 + f2 * i3, l2 = l2 * e18 + p2 * i3, u2 = u2 * e18 + m2 * i3, e18 === 1 - o2) {
          let e19 = 1 / Math.sqrt(s2 * s2 + c2 * c2 + l2 * l2 + u2 * u2);
          s2 *= e19, c2 *= e19, l2 *= e19, u2 *= e19;
        }
      }
      e17[t2] = s2, e17[t2 + 1] = c2, e17[t2 + 2] = l2, e17[t2 + 3] = u2;
    }
    static multiplyQuaternionsFlat(e17, t2, n2, r2, i2, a2) {
      let o2 = n2[r2], s2 = n2[r2 + 1], c2 = n2[r2 + 2], l2 = n2[r2 + 3], u2 = i2[a2], d2 = i2[a2 + 1], f2 = i2[a2 + 2], p2 = i2[a2 + 3];
      return e17[t2] = o2 * p2 + l2 * u2 + s2 * f2 - c2 * d2, e17[t2 + 1] = s2 * p2 + l2 * d2 + c2 * u2 - o2 * f2, e17[t2 + 2] = c2 * p2 + l2 * f2 + o2 * d2 - s2 * u2, e17[t2 + 3] = l2 * p2 - o2 * u2 - s2 * d2 - c2 * f2, e17;
    }
    get x() {
      return this._x;
    }
    set x(e17) {
      this._x = e17, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e17) {
      this._y = e17, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e17) {
      this._z = e17, this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(e17) {
      this._w = e17, this._onChangeCallback();
    }
    set(e17, t2, n2, r2) {
      return this._x = e17, this._y = t2, this._z = n2, this._w = r2, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(e17) {
      return this._x = e17.x, this._y = e17.y, this._z = e17.z, this._w = e17.w, this._onChangeCallback(), this;
    }
    setFromEuler(e17, t2 = true) {
      let n2 = e17._x, r2 = e17._y, i2 = e17._z, a2 = e17._order, o2 = Math.cos, s2 = Math.sin, c2 = o2(n2 / 2), l2 = o2(r2 / 2), u2 = o2(i2 / 2), d2 = s2(n2 / 2), f2 = s2(r2 / 2), p2 = s2(i2 / 2);
      switch (a2) {
        case `XYZ`:
          this._x = d2 * l2 * u2 + c2 * f2 * p2, this._y = c2 * f2 * u2 - d2 * l2 * p2, this._z = c2 * l2 * p2 + d2 * f2 * u2, this._w = c2 * l2 * u2 - d2 * f2 * p2;
          break;
        case `YXZ`:
          this._x = d2 * l2 * u2 + c2 * f2 * p2, this._y = c2 * f2 * u2 - d2 * l2 * p2, this._z = c2 * l2 * p2 - d2 * f2 * u2, this._w = c2 * l2 * u2 + d2 * f2 * p2;
          break;
        case `ZXY`:
          this._x = d2 * l2 * u2 - c2 * f2 * p2, this._y = c2 * f2 * u2 + d2 * l2 * p2, this._z = c2 * l2 * p2 + d2 * f2 * u2, this._w = c2 * l2 * u2 - d2 * f2 * p2;
          break;
        case `ZYX`:
          this._x = d2 * l2 * u2 - c2 * f2 * p2, this._y = c2 * f2 * u2 + d2 * l2 * p2, this._z = c2 * l2 * p2 - d2 * f2 * u2, this._w = c2 * l2 * u2 + d2 * f2 * p2;
          break;
        case `YZX`:
          this._x = d2 * l2 * u2 + c2 * f2 * p2, this._y = c2 * f2 * u2 + d2 * l2 * p2, this._z = c2 * l2 * p2 - d2 * f2 * u2, this._w = c2 * l2 * u2 - d2 * f2 * p2;
          break;
        case `XZY`:
          this._x = d2 * l2 * u2 - c2 * f2 * p2, this._y = c2 * f2 * u2 - d2 * l2 * p2, this._z = c2 * l2 * p2 + d2 * f2 * u2, this._w = c2 * l2 * u2 + d2 * f2 * p2;
          break;
        default:
          console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: ` + a2);
      }
      return t2 === true && this._onChangeCallback(), this;
    }
    setFromAxisAngle(e17, t2) {
      let n2 = t2 / 2, r2 = Math.sin(n2);
      return this._x = e17.x * r2, this._y = e17.y * r2, this._z = e17.z * r2, this._w = Math.cos(n2), this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e17) {
      let t2 = e17.elements, n2 = t2[0], r2 = t2[4], i2 = t2[8], a2 = t2[1], o2 = t2[5], s2 = t2[9], c2 = t2[2], l2 = t2[6], u2 = t2[10], d2 = n2 + o2 + u2;
      if (d2 > 0) {
        let e18 = 0.5 / Math.sqrt(d2 + 1);
        this._w = 0.25 / e18, this._x = (l2 - s2) * e18, this._y = (i2 - c2) * e18, this._z = (a2 - r2) * e18;
      } else if (n2 > o2 && n2 > u2) {
        let e18 = 2 * Math.sqrt(1 + n2 - o2 - u2);
        this._w = (l2 - s2) / e18, this._x = 0.25 * e18, this._y = (r2 + a2) / e18, this._z = (i2 + c2) / e18;
      } else if (o2 > u2) {
        let e18 = 2 * Math.sqrt(1 + o2 - n2 - u2);
        this._w = (i2 - c2) / e18, this._x = (r2 + a2) / e18, this._y = 0.25 * e18, this._z = (s2 + l2) / e18;
      } else {
        let e18 = 2 * Math.sqrt(1 + u2 - n2 - o2);
        this._w = (a2 - r2) / e18, this._x = (i2 + c2) / e18, this._y = (s2 + l2) / e18, this._z = 0.25 * e18;
      }
      return this._onChangeCallback(), this;
    }
    setFromUnitVectors(e17, t2) {
      let n2 = e17.dot(t2) + 1;
      return n2 < 1e-8 ? (n2 = 0, Math.abs(e17.x) > Math.abs(e17.z) ? (this._x = -e17.y, this._y = e17.x, this._z = 0, this._w = n2) : (this._x = 0, this._y = -e17.z, this._z = e17.y, this._w = n2)) : (this._x = e17.y * t2.z - e17.z * t2.y, this._y = e17.z * t2.x - e17.x * t2.z, this._z = e17.x * t2.y - e17.y * t2.x, this._w = n2), this.normalize();
    }
    angleTo(e17) {
      return 2 * Math.acos(Math.abs(H(this.dot(e17), -1, 1)));
    }
    rotateTowards(e17, t2) {
      let n2 = this.angleTo(e17);
      if (n2 === 0) return this;
      let r2 = Math.min(1, t2 / n2);
      return this.slerp(e17, r2), this;
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
    }
    dot(e17) {
      return this._x * e17._x + this._y * e17._y + this._z * e17._z + this._w * e17._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let e17 = this.length();
      return e17 === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e17 = 1 / e17, this._x *= e17, this._y *= e17, this._z *= e17, this._w *= e17), this._onChangeCallback(), this;
    }
    multiply(e17) {
      return this.multiplyQuaternions(this, e17);
    }
    premultiply(e17) {
      return this.multiplyQuaternions(e17, this);
    }
    multiplyQuaternions(e17, t2) {
      let n2 = e17._x, r2 = e17._y, i2 = e17._z, a2 = e17._w, o2 = t2._x, s2 = t2._y, c2 = t2._z, l2 = t2._w;
      return this._x = n2 * l2 + a2 * o2 + r2 * c2 - i2 * s2, this._y = r2 * l2 + a2 * s2 + i2 * o2 - n2 * c2, this._z = i2 * l2 + a2 * c2 + n2 * s2 - r2 * o2, this._w = a2 * l2 - n2 * o2 - r2 * s2 - i2 * c2, this._onChangeCallback(), this;
    }
    slerp(e17, t2) {
      if (t2 === 0) return this;
      if (t2 === 1) return this.copy(e17);
      let n2 = this._x, r2 = this._y, i2 = this._z, a2 = this._w, o2 = a2 * e17._w + n2 * e17._x + r2 * e17._y + i2 * e17._z;
      if (o2 < 0 ? (this._w = -e17._w, this._x = -e17._x, this._y = -e17._y, this._z = -e17._z, o2 = -o2) : this.copy(e17), o2 >= 1) return this._w = a2, this._x = n2, this._y = r2, this._z = i2, this;
      let s2 = 1 - o2 * o2;
      if (s2 <= 2 ** -52) {
        let e18 = 1 - t2;
        return this._w = e18 * a2 + t2 * this._w, this._x = e18 * n2 + t2 * this._x, this._y = e18 * r2 + t2 * this._y, this._z = e18 * i2 + t2 * this._z, this.normalize(), this;
      }
      let c2 = Math.sqrt(s2), l2 = Math.atan2(c2, o2), u2 = Math.sin((1 - t2) * l2) / c2, d2 = Math.sin(t2 * l2) / c2;
      return this._w = a2 * u2 + this._w * d2, this._x = n2 * u2 + this._x * d2, this._y = r2 * u2 + this._y * d2, this._z = i2 * u2 + this._z * d2, this._onChangeCallback(), this;
    }
    slerpQuaternions(e17, t2, n2) {
      return this.copy(e17).slerp(t2, n2);
    }
    random() {
      let e17 = 2 * Math.PI * Math.random(), t2 = 2 * Math.PI * Math.random(), n2 = Math.random(), r2 = Math.sqrt(1 - n2), i2 = Math.sqrt(n2);
      return this.set(r2 * Math.sin(e17), r2 * Math.cos(e17), i2 * Math.sin(t2), i2 * Math.cos(t2));
    }
    equals(e17) {
      return e17._x === this._x && e17._y === this._y && e17._z === this._z && e17._w === this._w;
    }
    fromArray(e17, t2 = 0) {
      return this._x = e17[t2], this._y = e17[t2 + 1], this._z = e17[t2 + 2], this._w = e17[t2 + 3], this._onChangeCallback(), this;
    }
    toArray(e17 = [], t2 = 0) {
      return e17[t2] = this._x, e17[t2 + 1] = this._y, e17[t2 + 2] = this._z, e17[t2 + 3] = this._w, e17;
    }
    fromBufferAttribute(e17, t2) {
      return this._x = e17.getX(t2), this._y = e17.getY(t2), this._z = e17.getZ(t2), this._w = e17.getW(t2), this._onChangeCallback(), this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(e17) {
      return this._onChangeCallback = e17, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._w;
    }
  };
  var W = class e3 {
    constructor(t2 = 0, n2 = 0, r2 = 0) {
      e3.prototype.isVector3 = true, this.x = t2, this.y = n2, this.z = r2;
    }
    set(e17, t2, n2) {
      return n2 === void 0 && (n2 = this.z), this.x = e17, this.y = t2, this.z = n2, this;
    }
    setScalar(e17) {
      return this.x = e17, this.y = e17, this.z = e17, this;
    }
    setX(e17) {
      return this.x = e17, this;
    }
    setY(e17) {
      return this.y = e17, this;
    }
    setZ(e17) {
      return this.z = e17, this;
    }
    setComponent(e17, t2) {
      switch (e17) {
        case 0:
          this.x = t2;
          break;
        case 1:
          this.y = t2;
          break;
        case 2:
          this.z = t2;
          break;
        default:
          throw Error(`index is out of range: ` + e17);
      }
      return this;
    }
    getComponent(e17) {
      switch (e17) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw Error(`index is out of range: ` + e17);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(e17) {
      return this.x = e17.x, this.y = e17.y, this.z = e17.z, this;
    }
    add(e17) {
      return this.x += e17.x, this.y += e17.y, this.z += e17.z, this;
    }
    addScalar(e17) {
      return this.x += e17, this.y += e17, this.z += e17, this;
    }
    addVectors(e17, t2) {
      return this.x = e17.x + t2.x, this.y = e17.y + t2.y, this.z = e17.z + t2.z, this;
    }
    addScaledVector(e17, t2) {
      return this.x += e17.x * t2, this.y += e17.y * t2, this.z += e17.z * t2, this;
    }
    sub(e17) {
      return this.x -= e17.x, this.y -= e17.y, this.z -= e17.z, this;
    }
    subScalar(e17) {
      return this.x -= e17, this.y -= e17, this.z -= e17, this;
    }
    subVectors(e17, t2) {
      return this.x = e17.x - t2.x, this.y = e17.y - t2.y, this.z = e17.z - t2.z, this;
    }
    multiply(e17) {
      return this.x *= e17.x, this.y *= e17.y, this.z *= e17.z, this;
    }
    multiplyScalar(e17) {
      return this.x *= e17, this.y *= e17, this.z *= e17, this;
    }
    multiplyVectors(e17, t2) {
      return this.x = e17.x * t2.x, this.y = e17.y * t2.y, this.z = e17.z * t2.z, this;
    }
    applyEuler(e17) {
      return this.applyQuaternion(rt.setFromEuler(e17));
    }
    applyAxisAngle(e17, t2) {
      return this.applyQuaternion(rt.setFromAxisAngle(e17, t2));
    }
    applyMatrix3(e17) {
      let t2 = this.x, n2 = this.y, r2 = this.z, i2 = e17.elements;
      return this.x = i2[0] * t2 + i2[3] * n2 + i2[6] * r2, this.y = i2[1] * t2 + i2[4] * n2 + i2[7] * r2, this.z = i2[2] * t2 + i2[5] * n2 + i2[8] * r2, this;
    }
    applyNormalMatrix(e17) {
      return this.applyMatrix3(e17).normalize();
    }
    applyMatrix4(e17) {
      let t2 = this.x, n2 = this.y, r2 = this.z, i2 = e17.elements, a2 = 1 / (i2[3] * t2 + i2[7] * n2 + i2[11] * r2 + i2[15]);
      return this.x = (i2[0] * t2 + i2[4] * n2 + i2[8] * r2 + i2[12]) * a2, this.y = (i2[1] * t2 + i2[5] * n2 + i2[9] * r2 + i2[13]) * a2, this.z = (i2[2] * t2 + i2[6] * n2 + i2[10] * r2 + i2[14]) * a2, this;
    }
    applyQuaternion(e17) {
      let t2 = this.x, n2 = this.y, r2 = this.z, i2 = e17.x, a2 = e17.y, o2 = e17.z, s2 = e17.w, c2 = 2 * (a2 * r2 - o2 * n2), l2 = 2 * (o2 * t2 - i2 * r2), u2 = 2 * (i2 * n2 - a2 * t2);
      return this.x = t2 + s2 * c2 + a2 * u2 - o2 * l2, this.y = n2 + s2 * l2 + o2 * c2 - i2 * u2, this.z = r2 + s2 * u2 + i2 * l2 - a2 * c2, this;
    }
    project(e17) {
      return this.applyMatrix4(e17.matrixWorldInverse).applyMatrix4(e17.projectionMatrix);
    }
    unproject(e17) {
      return this.applyMatrix4(e17.projectionMatrixInverse).applyMatrix4(e17.matrixWorld);
    }
    transformDirection(e17) {
      let t2 = this.x, n2 = this.y, r2 = this.z, i2 = e17.elements;
      return this.x = i2[0] * t2 + i2[4] * n2 + i2[8] * r2, this.y = i2[1] * t2 + i2[5] * n2 + i2[9] * r2, this.z = i2[2] * t2 + i2[6] * n2 + i2[10] * r2, this.normalize();
    }
    divide(e17) {
      return this.x /= e17.x, this.y /= e17.y, this.z /= e17.z, this;
    }
    divideScalar(e17) {
      return this.multiplyScalar(1 / e17);
    }
    min(e17) {
      return this.x = Math.min(this.x, e17.x), this.y = Math.min(this.y, e17.y), this.z = Math.min(this.z, e17.z), this;
    }
    max(e17) {
      return this.x = Math.max(this.x, e17.x), this.y = Math.max(this.y, e17.y), this.z = Math.max(this.z, e17.z), this;
    }
    clamp(e17, t2) {
      return this.x = H(this.x, e17.x, t2.x), this.y = H(this.y, e17.y, t2.y), this.z = H(this.z, e17.z, t2.z), this;
    }
    clampScalar(e17, t2) {
      return this.x = H(this.x, e17, t2), this.y = H(this.y, e17, t2), this.z = H(this.z, e17, t2), this;
    }
    clampLength(e17, t2) {
      let n2 = this.length();
      return this.divideScalar(n2 || 1).multiplyScalar(H(n2, e17, t2));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
    }
    dot(e17) {
      return this.x * e17.x + this.y * e17.y + this.z * e17.z;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e17) {
      return this.normalize().multiplyScalar(e17);
    }
    lerp(e17, t2) {
      return this.x += (e17.x - this.x) * t2, this.y += (e17.y - this.y) * t2, this.z += (e17.z - this.z) * t2, this;
    }
    lerpVectors(e17, t2, n2) {
      return this.x = e17.x + (t2.x - e17.x) * n2, this.y = e17.y + (t2.y - e17.y) * n2, this.z = e17.z + (t2.z - e17.z) * n2, this;
    }
    cross(e17) {
      return this.crossVectors(this, e17);
    }
    crossVectors(e17, t2) {
      let n2 = e17.x, r2 = e17.y, i2 = e17.z, a2 = t2.x, o2 = t2.y, s2 = t2.z;
      return this.x = r2 * s2 - i2 * o2, this.y = i2 * a2 - n2 * s2, this.z = n2 * o2 - r2 * a2, this;
    }
    projectOnVector(e17) {
      let t2 = e17.lengthSq();
      if (t2 === 0) return this.set(0, 0, 0);
      let n2 = e17.dot(this) / t2;
      return this.copy(e17).multiplyScalar(n2);
    }
    projectOnPlane(e17) {
      return nt.copy(this).projectOnVector(e17), this.sub(nt);
    }
    reflect(e17) {
      return this.sub(nt.copy(e17).multiplyScalar(2 * this.dot(e17)));
    }
    angleTo(e17) {
      let t2 = Math.sqrt(this.lengthSq() * e17.lengthSq());
      if (t2 === 0) return Math.PI / 2;
      let n2 = this.dot(e17) / t2;
      return Math.acos(H(n2, -1, 1));
    }
    distanceTo(e17) {
      return Math.sqrt(this.distanceToSquared(e17));
    }
    distanceToSquared(e17) {
      let t2 = this.x - e17.x, n2 = this.y - e17.y, r2 = this.z - e17.z;
      return t2 * t2 + n2 * n2 + r2 * r2;
    }
    manhattanDistanceTo(e17) {
      return Math.abs(this.x - e17.x) + Math.abs(this.y - e17.y) + Math.abs(this.z - e17.z);
    }
    setFromSpherical(e17) {
      return this.setFromSphericalCoords(e17.radius, e17.phi, e17.theta);
    }
    setFromSphericalCoords(e17, t2, n2) {
      let r2 = Math.sin(t2) * e17;
      return this.x = r2 * Math.sin(n2), this.y = Math.cos(t2) * e17, this.z = r2 * Math.cos(n2), this;
    }
    setFromCylindrical(e17) {
      return this.setFromCylindricalCoords(e17.radius, e17.theta, e17.y);
    }
    setFromCylindricalCoords(e17, t2, n2) {
      return this.x = e17 * Math.sin(t2), this.y = n2, this.z = e17 * Math.cos(t2), this;
    }
    setFromMatrixPosition(e17) {
      let t2 = e17.elements;
      return this.x = t2[12], this.y = t2[13], this.z = t2[14], this;
    }
    setFromMatrixScale(e17) {
      let t2 = this.setFromMatrixColumn(e17, 0).length(), n2 = this.setFromMatrixColumn(e17, 1).length(), r2 = this.setFromMatrixColumn(e17, 2).length();
      return this.x = t2, this.y = n2, this.z = r2, this;
    }
    setFromMatrixColumn(e17, t2) {
      return this.fromArray(e17.elements, t2 * 4);
    }
    setFromMatrix3Column(e17, t2) {
      return this.fromArray(e17.elements, t2 * 3);
    }
    setFromEuler(e17) {
      return this.x = e17._x, this.y = e17._y, this.z = e17._z, this;
    }
    setFromColor(e17) {
      return this.x = e17.r, this.y = e17.g, this.z = e17.b, this;
    }
    equals(e17) {
      return e17.x === this.x && e17.y === this.y && e17.z === this.z;
    }
    fromArray(e17, t2 = 0) {
      return this.x = e17[t2], this.y = e17[t2 + 1], this.z = e17[t2 + 2], this;
    }
    toArray(e17 = [], t2 = 0) {
      return e17[t2] = this.x, e17[t2 + 1] = this.y, e17[t2 + 2] = this.z, e17;
    }
    fromBufferAttribute(e17, t2) {
      return this.x = e17.getX(t2), this.y = e17.getY(t2), this.z = e17.getZ(t2), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
    }
    randomDirection() {
      let e17 = Math.random() * Math.PI * 2, t2 = Math.random() * 2 - 1, n2 = Math.sqrt(1 - t2 * t2);
      return this.x = n2 * Math.cos(e17), this.y = t2, this.z = n2 * Math.sin(e17), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z;
    }
  };
  var nt = new W();
  var rt = new tt();
  var G = class e4 {
    constructor(t2, n2, r2, i2, a2, o2, s2, c2, l2) {
      e4.prototype.isMatrix3 = true, this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1], t2 !== void 0 && this.set(t2, n2, r2, i2, a2, o2, s2, c2, l2);
    }
    set(e17, t2, n2, r2, i2, a2, o2, s2, c2) {
      let l2 = this.elements;
      return l2[0] = e17, l2[1] = r2, l2[2] = o2, l2[3] = t2, l2[4] = i2, l2[5] = s2, l2[6] = n2, l2[7] = a2, l2[8] = c2, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
    }
    copy(e17) {
      let t2 = this.elements, n2 = e17.elements;
      return t2[0] = n2[0], t2[1] = n2[1], t2[2] = n2[2], t2[3] = n2[3], t2[4] = n2[4], t2[5] = n2[5], t2[6] = n2[6], t2[7] = n2[7], t2[8] = n2[8], this;
    }
    extractBasis(e17, t2, n2) {
      return e17.setFromMatrix3Column(this, 0), t2.setFromMatrix3Column(this, 1), n2.setFromMatrix3Column(this, 2), this;
    }
    setFromMatrix4(e17) {
      let t2 = e17.elements;
      return this.set(t2[0], t2[4], t2[8], t2[1], t2[5], t2[9], t2[2], t2[6], t2[10]), this;
    }
    multiply(e17) {
      return this.multiplyMatrices(this, e17);
    }
    premultiply(e17) {
      return this.multiplyMatrices(e17, this);
    }
    multiplyMatrices(e17, t2) {
      let n2 = e17.elements, r2 = t2.elements, i2 = this.elements, a2 = n2[0], o2 = n2[3], s2 = n2[6], c2 = n2[1], l2 = n2[4], u2 = n2[7], d2 = n2[2], f2 = n2[5], p2 = n2[8], m2 = r2[0], h2 = r2[3], g2 = r2[6], _2 = r2[1], v2 = r2[4], y2 = r2[7], b2 = r2[2], x2 = r2[5], S2 = r2[8];
      return i2[0] = a2 * m2 + o2 * _2 + s2 * b2, i2[3] = a2 * h2 + o2 * v2 + s2 * x2, i2[6] = a2 * g2 + o2 * y2 + s2 * S2, i2[1] = c2 * m2 + l2 * _2 + u2 * b2, i2[4] = c2 * h2 + l2 * v2 + u2 * x2, i2[7] = c2 * g2 + l2 * y2 + u2 * S2, i2[2] = d2 * m2 + f2 * _2 + p2 * b2, i2[5] = d2 * h2 + f2 * v2 + p2 * x2, i2[8] = d2 * g2 + f2 * y2 + p2 * S2, this;
    }
    multiplyScalar(e17) {
      let t2 = this.elements;
      return t2[0] *= e17, t2[3] *= e17, t2[6] *= e17, t2[1] *= e17, t2[4] *= e17, t2[7] *= e17, t2[2] *= e17, t2[5] *= e17, t2[8] *= e17, this;
    }
    determinant() {
      let e17 = this.elements, t2 = e17[0], n2 = e17[1], r2 = e17[2], i2 = e17[3], a2 = e17[4], o2 = e17[5], s2 = e17[6], c2 = e17[7], l2 = e17[8];
      return t2 * a2 * l2 - t2 * o2 * c2 - n2 * i2 * l2 + n2 * o2 * s2 + r2 * i2 * c2 - r2 * a2 * s2;
    }
    invert() {
      let e17 = this.elements, t2 = e17[0], n2 = e17[1], r2 = e17[2], i2 = e17[3], a2 = e17[4], o2 = e17[5], s2 = e17[6], c2 = e17[7], l2 = e17[8], u2 = l2 * a2 - o2 * c2, d2 = o2 * s2 - l2 * i2, f2 = c2 * i2 - a2 * s2, p2 = t2 * u2 + n2 * d2 + r2 * f2;
      if (p2 === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      let m2 = 1 / p2;
      return e17[0] = u2 * m2, e17[1] = (r2 * c2 - l2 * n2) * m2, e17[2] = (o2 * n2 - r2 * a2) * m2, e17[3] = d2 * m2, e17[4] = (l2 * t2 - r2 * s2) * m2, e17[5] = (r2 * i2 - o2 * t2) * m2, e17[6] = f2 * m2, e17[7] = (n2 * s2 - c2 * t2) * m2, e17[8] = (a2 * t2 - n2 * i2) * m2, this;
    }
    transpose() {
      let e17, t2 = this.elements;
      return e17 = t2[1], t2[1] = t2[3], t2[3] = e17, e17 = t2[2], t2[2] = t2[6], t2[6] = e17, e17 = t2[5], t2[5] = t2[7], t2[7] = e17, this;
    }
    getNormalMatrix(e17) {
      return this.setFromMatrix4(e17).invert().transpose();
    }
    transposeIntoArray(e17) {
      let t2 = this.elements;
      return e17[0] = t2[0], e17[1] = t2[3], e17[2] = t2[6], e17[3] = t2[1], e17[4] = t2[4], e17[5] = t2[7], e17[6] = t2[2], e17[7] = t2[5], e17[8] = t2[8], this;
    }
    setUvTransform(e17, t2, n2, r2, i2, a2, o2) {
      let s2 = Math.cos(i2), c2 = Math.sin(i2);
      return this.set(n2 * s2, n2 * c2, -n2 * (s2 * a2 + c2 * o2) + a2 + e17, -r2 * c2, r2 * s2, -r2 * (-c2 * a2 + s2 * o2) + o2 + t2, 0, 0, 1), this;
    }
    scale(e17, t2) {
      return this.premultiply(it.makeScale(e17, t2)), this;
    }
    rotate(e17) {
      return this.premultiply(it.makeRotation(-e17)), this;
    }
    translate(e17, t2) {
      return this.premultiply(it.makeTranslation(e17, t2)), this;
    }
    makeTranslation(e17, t2) {
      return e17.isVector2 ? this.set(1, 0, e17.x, 0, 1, e17.y, 0, 0, 1) : this.set(1, 0, e17, 0, 1, t2, 0, 0, 1), this;
    }
    makeRotation(e17) {
      let t2 = Math.cos(e17), n2 = Math.sin(e17);
      return this.set(t2, -n2, 0, n2, t2, 0, 0, 0, 1), this;
    }
    makeScale(e17, t2) {
      return this.set(e17, 0, 0, 0, t2, 0, 0, 0, 1), this;
    }
    equals(e17) {
      let t2 = this.elements, n2 = e17.elements;
      for (let e18 = 0; e18 < 9; e18++) if (t2[e18] !== n2[e18]) return false;
      return true;
    }
    fromArray(e17, t2 = 0) {
      for (let n2 = 0; n2 < 9; n2++) this.elements[n2] = e17[n2 + t2];
      return this;
    }
    toArray(e17 = [], t2 = 0) {
      let n2 = this.elements;
      return e17[t2] = n2[0], e17[t2 + 1] = n2[1], e17[t2 + 2] = n2[2], e17[t2 + 3] = n2[3], e17[t2 + 4] = n2[4], e17[t2 + 5] = n2[5], e17[t2 + 6] = n2[6], e17[t2 + 7] = n2[7], e17[t2 + 8] = n2[8], e17;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  };
  var it = new G();
  function at(e17) {
    for (let t2 = e17.length - 1; t2 >= 0; --t2) if (e17[t2] >= 65535) return true;
    return false;
  }
  function ot(e17) {
    return document.createElementNS(`http://www.w3.org/1999/xhtml`, e17);
  }
  function st() {
    let e17 = ot(`canvas`);
    return e17.style.display = `block`, e17;
  }
  var ct = {};
  function lt(e17) {
    e17 in ct || (ct[e17] = true, console.warn(e17));
  }
  function ut(e17, t2, n2) {
    return new Promise(function(r2, i2) {
      function a2() {
        switch (e17.clientWaitSync(t2, e17.SYNC_FLUSH_COMMANDS_BIT, 0)) {
          case e17.WAIT_FAILED:
            i2();
            break;
          case e17.TIMEOUT_EXPIRED:
            setTimeout(a2, n2);
            break;
          default:
            r2();
        }
      }
      setTimeout(a2, n2);
    });
  }
  var dt = new G().set(0.4123908, 0.3575843, 0.1804808, 0.212639, 0.7151687, 0.0721923, 0.0193308, 0.1191948, 0.9505322);
  var ft = new G().set(3.2409699, -1.5373832, -0.4986108, -0.9692436, 1.8759675, 0.0415551, 0.0556301, -0.203977, 1.0569715);
  function pt() {
    let e17 = { enabled: true, workingColorSpace: Be, spaces: {}, convert: function(e18, t3, n3) {
      return this.enabled === false || t3 === n3 || !t3 || !n3 ? e18 : (this.spaces[t3].transfer === `srgb` && (e18.r = mt(e18.r), e18.g = mt(e18.g), e18.b = mt(e18.b)), this.spaces[t3].primaries !== this.spaces[n3].primaries && (e18.applyMatrix3(this.spaces[t3].toXYZ), e18.applyMatrix3(this.spaces[n3].fromXYZ)), this.spaces[n3].transfer === `srgb` && (e18.r = ht(e18.r), e18.g = ht(e18.g), e18.b = ht(e18.b)), e18);
    }, workingToColorSpace: function(e18, t3) {
      return this.convert(e18, this.workingColorSpace, t3);
    }, colorSpaceToWorking: function(e18, t3) {
      return this.convert(e18, t3, this.workingColorSpace);
    }, getPrimaries: function(e18) {
      return this.spaces[e18].primaries;
    }, getTransfer: function(e18) {
      return e18 === `` ? Ve : this.spaces[e18].transfer;
    }, getToneMappingMode: function(e18) {
      return this.spaces[e18].outputColorSpaceConfig.toneMappingMode || `standard`;
    }, getLuminanceCoefficients: function(e18, t3 = this.workingColorSpace) {
      return e18.fromArray(this.spaces[t3].luminanceCoefficients);
    }, define: function(e18) {
      Object.assign(this.spaces, e18);
    }, _getMatrix: function(e18, t3, n3) {
      return e18.copy(this.spaces[t3].toXYZ).multiply(this.spaces[n3].fromXYZ);
    }, _getDrawingBufferColorSpace: function(e18) {
      return this.spaces[e18].outputColorSpaceConfig.drawingBufferColorSpace;
    }, _getUnpackColorSpace: function(e18 = this.workingColorSpace) {
      return this.spaces[e18].workingColorSpaceConfig.unpackColorSpace;
    }, fromWorkingColorSpace: function(t3, n3) {
      return lt(`THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`), e17.workingToColorSpace(t3, n3);
    }, toWorkingColorSpace: function(t3, n3) {
      return lt(`THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`), e17.colorSpaceToWorking(t3, n3);
    } }, t2 = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], n2 = [0.2126, 0.7152, 0.0722], r2 = [0.3127, 0.329];
    return e17.define({ [Be]: { primaries: t2, whitePoint: r2, transfer: Ve, toXYZ: dt, fromXYZ: ft, luminanceCoefficients: n2, workingColorSpaceConfig: { unpackColorSpace: ze }, outputColorSpaceConfig: { drawingBufferColorSpace: ze } }, [ze]: { primaries: t2, whitePoint: r2, transfer: He, toXYZ: dt, fromXYZ: ft, luminanceCoefficients: n2, outputColorSpaceConfig: { drawingBufferColorSpace: ze } } }), e17;
  }
  var K = pt();
  function mt(e17) {
    return e17 < 0.04045 ? e17 * 0.0773993808 : (e17 * 0.9478672986 + 0.0521327014) ** 2.4;
  }
  function ht(e17) {
    return e17 < 31308e-7 ? e17 * 12.92 : 1.055 * e17 ** 0.41666 - 0.055;
  }
  var gt;
  var _t = class {
    static getDataURL(e17, t2 = `image/png`) {
      if (/^data:/i.test(e17.src) || typeof HTMLCanvasElement > `u`) return e17.src;
      let n2;
      if (e17 instanceof HTMLCanvasElement) n2 = e17;
      else {
        gt === void 0 && (gt = ot(`canvas`)), gt.width = e17.width, gt.height = e17.height;
        let t3 = gt.getContext(`2d`);
        e17 instanceof ImageData ? t3.putImageData(e17, 0, 0) : t3.drawImage(e17, 0, 0, e17.width, e17.height), n2 = gt;
      }
      return n2.toDataURL(t2);
    }
    static sRGBToLinear(e17) {
      if (typeof HTMLImageElement < `u` && e17 instanceof HTMLImageElement || typeof HTMLCanvasElement < `u` && e17 instanceof HTMLCanvasElement || typeof ImageBitmap < `u` && e17 instanceof ImageBitmap) {
        let t2 = ot(`canvas`);
        t2.width = e17.width, t2.height = e17.height;
        let n2 = t2.getContext(`2d`);
        n2.drawImage(e17, 0, 0, e17.width, e17.height);
        let r2 = n2.getImageData(0, 0, e17.width, e17.height), i2 = r2.data;
        for (let e18 = 0; e18 < i2.length; e18++) i2[e18] = mt(i2[e18] / 255) * 255;
        return n2.putImageData(r2, 0, 0), t2;
      } else if (e17.data) {
        let t2 = e17.data.slice(0);
        for (let e18 = 0; e18 < t2.length; e18++) t2 instanceof Uint8Array || t2 instanceof Uint8ClampedArray ? t2[e18] = Math.floor(mt(t2[e18] / 255) * 255) : t2[e18] = mt(t2[e18]);
        return { data: t2, width: e17.width, height: e17.height };
      } else return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`), e17;
    }
  };
  var vt = 0;
  var yt = class {
    constructor(e17 = null) {
      this.isSource = true, Object.defineProperty(this, "id", { value: vt++ }), this.uuid = Xe(), this.data = e17, this.dataReady = true, this.version = 0;
    }
    getSize(e17) {
      let t2 = this.data;
      return typeof HTMLVideoElement < `u` && t2 instanceof HTMLVideoElement ? e17.set(t2.videoWidth, t2.videoHeight, 0) : t2 instanceof VideoFrame ? e17.set(t2.displayHeight, t2.displayWidth, 0) : t2 === null ? e17.set(0, 0, 0) : e17.set(t2.width, t2.height, t2.depth || 0), e17;
    }
    set needsUpdate(e17) {
      e17 === true && this.version++;
    }
    toJSON(e17) {
      let t2 = e17 === void 0 || typeof e17 == `string`;
      if (!t2 && e17.images[this.uuid] !== void 0) return e17.images[this.uuid];
      let n2 = { uuid: this.uuid, url: `` }, r2 = this.data;
      if (r2 !== null) {
        let e18;
        if (Array.isArray(r2)) {
          e18 = [];
          for (let t3 = 0, n3 = r2.length; t3 < n3; t3++) r2[t3].isDataTexture ? e18.push(bt(r2[t3].image)) : e18.push(bt(r2[t3]));
        } else e18 = bt(r2);
        n2.url = e18;
      }
      return t2 || (e17.images[this.uuid] = n2), n2;
    }
  };
  function bt(e17) {
    return typeof HTMLImageElement < `u` && e17 instanceof HTMLImageElement || typeof HTMLCanvasElement < `u` && e17 instanceof HTMLCanvasElement || typeof ImageBitmap < `u` && e17 instanceof ImageBitmap ? _t.getDataURL(e17) : e17.data ? { data: Array.from(e17.data), width: e17.width, height: e17.height, type: e17.data.constructor.name } : (console.warn(`THREE.Texture: Unable to serialize Texture.`), {});
  }
  var xt = 0;
  var St = new W();
  var Ct = class e5 extends Ke {
    constructor(t2 = e5.DEFAULT_IMAGE, n2 = e5.DEFAULT_MAPPING, r2 = u, i2 = u, a2 = h, o2 = _, s2 = te, c2 = v, l2 = e5.DEFAULT_ANISOTROPY, d2 = ``) {
      super(), this.isTexture = true, Object.defineProperty(this, "id", { value: xt++ }), this.uuid = Xe(), this.name = ``, this.source = new yt(t2), this.mipmaps = [], this.mapping = n2, this.channel = 0, this.wrapS = r2, this.wrapT = i2, this.magFilter = a2, this.minFilter = o2, this.anisotropy = l2, this.format = s2, this.internalFormat = null, this.type = c2, this.offset = new U(0, 0), this.repeat = new U(1, 1), this.center = new U(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new G(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = d2, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = false, this.isArrayTexture = !!(t2 && t2.depth && t2.depth > 1), this.pmremVersion = 0;
    }
    get width() {
      return this.source.getSize(St).x;
    }
    get height() {
      return this.source.getSize(St).y;
    }
    get depth() {
      return this.source.getSize(St).z;
    }
    get image() {
      return this.source.data;
    }
    set image(e17 = null) {
      this.source.data = e17;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    addUpdateRange(e17, t2) {
      this.updateRanges.push({ start: e17, count: t2 });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e17) {
      return this.name = e17.name, this.source = e17.source, this.mipmaps = e17.mipmaps.slice(0), this.mapping = e17.mapping, this.channel = e17.channel, this.wrapS = e17.wrapS, this.wrapT = e17.wrapT, this.magFilter = e17.magFilter, this.minFilter = e17.minFilter, this.anisotropy = e17.anisotropy, this.format = e17.format, this.internalFormat = e17.internalFormat, this.type = e17.type, this.offset.copy(e17.offset), this.repeat.copy(e17.repeat), this.center.copy(e17.center), this.rotation = e17.rotation, this.matrixAutoUpdate = e17.matrixAutoUpdate, this.matrix.copy(e17.matrix), this.generateMipmaps = e17.generateMipmaps, this.premultiplyAlpha = e17.premultiplyAlpha, this.flipY = e17.flipY, this.unpackAlignment = e17.unpackAlignment, this.colorSpace = e17.colorSpace, this.renderTarget = e17.renderTarget, this.isRenderTargetTexture = e17.isRenderTargetTexture, this.isArrayTexture = e17.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e17.userData)), this.needsUpdate = true, this;
    }
    setValues(e17) {
      for (let t2 in e17) {
        let n2 = e17[t2];
        if (n2 === void 0) {
          console.warn(`THREE.Texture.setValues(): parameter '${t2}' has value of undefined.`);
          continue;
        }
        let r2 = this[t2];
        if (r2 === void 0) {
          console.warn(`THREE.Texture.setValues(): property '${t2}' does not exist.`);
          continue;
        }
        r2 && n2 && r2.isVector2 && n2.isVector2 || r2 && n2 && r2.isVector3 && n2.isVector3 || r2 && n2 && r2.isMatrix3 && n2.isMatrix3 ? r2.copy(n2) : this[t2] = n2;
      }
    }
    toJSON(e17) {
      let t2 = e17 === void 0 || typeof e17 == `string`;
      if (!t2 && e17.textures[this.uuid] !== void 0) return e17.textures[this.uuid];
      let n2 = { metadata: { version: 4.7, type: `Texture`, generator: `Texture.toJSON` }, uuid: this.uuid, name: this.name, image: this.source.toJSON(e17).uuid, mapping: this.mapping, channel: this.channel, repeat: [this.repeat.x, this.repeat.y], offset: [this.offset.x, this.offset.y], center: [this.center.x, this.center.y], rotation: this.rotation, wrap: [this.wrapS, this.wrapT], format: this.format, internalFormat: this.internalFormat, type: this.type, colorSpace: this.colorSpace, minFilter: this.minFilter, magFilter: this.magFilter, anisotropy: this.anisotropy, flipY: this.flipY, generateMipmaps: this.generateMipmaps, premultiplyAlpha: this.premultiplyAlpha, unpackAlignment: this.unpackAlignment };
      return Object.keys(this.userData).length > 0 && (n2.userData = this.userData), t2 || (e17.textures[this.uuid] = n2), n2;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
    transformUv(e17) {
      if (this.mapping !== 300) return e17;
      if (e17.applyMatrix3(this.matrix), e17.x < 0 || e17.x > 1) switch (this.wrapS) {
        case l:
          e17.x -= Math.floor(e17.x);
          break;
        case u:
          e17.x = e17.x < 0 ? 0 : 1;
          break;
        case d:
          Math.abs(Math.floor(e17.x) % 2) === 1 ? e17.x = Math.ceil(e17.x) - e17.x : e17.x -= Math.floor(e17.x);
          break;
      }
      if (e17.y < 0 || e17.y > 1) switch (this.wrapT) {
        case l:
          e17.y -= Math.floor(e17.y);
          break;
        case u:
          e17.y = e17.y < 0 ? 0 : 1;
          break;
        case d:
          Math.abs(Math.floor(e17.y) % 2) === 1 ? e17.y = Math.ceil(e17.y) - e17.y : e17.y -= Math.floor(e17.y);
          break;
      }
      return this.flipY && (e17.y = 1 - e17.y), e17;
    }
    set needsUpdate(e17) {
      e17 === true && (this.version++, this.source.needsUpdate = true);
    }
    set needsPMREMUpdate(e17) {
      e17 === true && this.pmremVersion++;
    }
  };
  Ct.DEFAULT_IMAGE = null, Ct.DEFAULT_MAPPING = 300, Ct.DEFAULT_ANISOTROPY = 1;
  var wt = class e6 {
    constructor(t2 = 0, n2 = 0, r2 = 0, i2 = 1) {
      e6.prototype.isVector4 = true, this.x = t2, this.y = n2, this.z = r2, this.w = i2;
    }
    get width() {
      return this.z;
    }
    set width(e17) {
      this.z = e17;
    }
    get height() {
      return this.w;
    }
    set height(e17) {
      this.w = e17;
    }
    set(e17, t2, n2, r2) {
      return this.x = e17, this.y = t2, this.z = n2, this.w = r2, this;
    }
    setScalar(e17) {
      return this.x = e17, this.y = e17, this.z = e17, this.w = e17, this;
    }
    setX(e17) {
      return this.x = e17, this;
    }
    setY(e17) {
      return this.y = e17, this;
    }
    setZ(e17) {
      return this.z = e17, this;
    }
    setW(e17) {
      return this.w = e17, this;
    }
    setComponent(e17, t2) {
      switch (e17) {
        case 0:
          this.x = t2;
          break;
        case 1:
          this.y = t2;
          break;
        case 2:
          this.z = t2;
          break;
        case 3:
          this.w = t2;
          break;
        default:
          throw Error(`index is out of range: ` + e17);
      }
      return this;
    }
    getComponent(e17) {
      switch (e17) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw Error(`index is out of range: ` + e17);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(e17) {
      return this.x = e17.x, this.y = e17.y, this.z = e17.z, this.w = e17.w === void 0 ? 1 : e17.w, this;
    }
    add(e17) {
      return this.x += e17.x, this.y += e17.y, this.z += e17.z, this.w += e17.w, this;
    }
    addScalar(e17) {
      return this.x += e17, this.y += e17, this.z += e17, this.w += e17, this;
    }
    addVectors(e17, t2) {
      return this.x = e17.x + t2.x, this.y = e17.y + t2.y, this.z = e17.z + t2.z, this.w = e17.w + t2.w, this;
    }
    addScaledVector(e17, t2) {
      return this.x += e17.x * t2, this.y += e17.y * t2, this.z += e17.z * t2, this.w += e17.w * t2, this;
    }
    sub(e17) {
      return this.x -= e17.x, this.y -= e17.y, this.z -= e17.z, this.w -= e17.w, this;
    }
    subScalar(e17) {
      return this.x -= e17, this.y -= e17, this.z -= e17, this.w -= e17, this;
    }
    subVectors(e17, t2) {
      return this.x = e17.x - t2.x, this.y = e17.y - t2.y, this.z = e17.z - t2.z, this.w = e17.w - t2.w, this;
    }
    multiply(e17) {
      return this.x *= e17.x, this.y *= e17.y, this.z *= e17.z, this.w *= e17.w, this;
    }
    multiplyScalar(e17) {
      return this.x *= e17, this.y *= e17, this.z *= e17, this.w *= e17, this;
    }
    applyMatrix4(e17) {
      let t2 = this.x, n2 = this.y, r2 = this.z, i2 = this.w, a2 = e17.elements;
      return this.x = a2[0] * t2 + a2[4] * n2 + a2[8] * r2 + a2[12] * i2, this.y = a2[1] * t2 + a2[5] * n2 + a2[9] * r2 + a2[13] * i2, this.z = a2[2] * t2 + a2[6] * n2 + a2[10] * r2 + a2[14] * i2, this.w = a2[3] * t2 + a2[7] * n2 + a2[11] * r2 + a2[15] * i2, this;
    }
    divide(e17) {
      return this.x /= e17.x, this.y /= e17.y, this.z /= e17.z, this.w /= e17.w, this;
    }
    divideScalar(e17) {
      return this.multiplyScalar(1 / e17);
    }
    setAxisAngleFromQuaternion(e17) {
      this.w = 2 * Math.acos(e17.w);
      let t2 = Math.sqrt(1 - e17.w * e17.w);
      return t2 < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e17.x / t2, this.y = e17.y / t2, this.z = e17.z / t2), this;
    }
    setAxisAngleFromRotationMatrix(e17) {
      let t2, n2, r2, i2, a2 = 0.01, o2 = 0.1, s2 = e17.elements, c2 = s2[0], l2 = s2[4], u2 = s2[8], d2 = s2[1], f2 = s2[5], p2 = s2[9], m2 = s2[2], h2 = s2[6], g2 = s2[10];
      if (Math.abs(l2 - d2) < a2 && Math.abs(u2 - m2) < a2 && Math.abs(p2 - h2) < a2) {
        if (Math.abs(l2 + d2) < o2 && Math.abs(u2 + m2) < o2 && Math.abs(p2 + h2) < o2 && Math.abs(c2 + f2 + g2 - 3) < o2) return this.set(1, 0, 0, 0), this;
        t2 = Math.PI;
        let e18 = (c2 + 1) / 2, s3 = (f2 + 1) / 2, _3 = (g2 + 1) / 2, v2 = (l2 + d2) / 4, y2 = (u2 + m2) / 4, b2 = (p2 + h2) / 4;
        return e18 > s3 && e18 > _3 ? e18 < a2 ? (n2 = 0, r2 = 0.707106781, i2 = 0.707106781) : (n2 = Math.sqrt(e18), r2 = v2 / n2, i2 = y2 / n2) : s3 > _3 ? s3 < a2 ? (n2 = 0.707106781, r2 = 0, i2 = 0.707106781) : (r2 = Math.sqrt(s3), n2 = v2 / r2, i2 = b2 / r2) : _3 < a2 ? (n2 = 0.707106781, r2 = 0.707106781, i2 = 0) : (i2 = Math.sqrt(_3), n2 = y2 / i2, r2 = b2 / i2), this.set(n2, r2, i2, t2), this;
      }
      let _2 = Math.sqrt((h2 - p2) * (h2 - p2) + (u2 - m2) * (u2 - m2) + (d2 - l2) * (d2 - l2));
      return Math.abs(_2) < 1e-3 && (_2 = 1), this.x = (h2 - p2) / _2, this.y = (u2 - m2) / _2, this.z = (d2 - l2) / _2, this.w = Math.acos((c2 + f2 + g2 - 1) / 2), this;
    }
    setFromMatrixPosition(e17) {
      let t2 = e17.elements;
      return this.x = t2[12], this.y = t2[13], this.z = t2[14], this.w = t2[15], this;
    }
    min(e17) {
      return this.x = Math.min(this.x, e17.x), this.y = Math.min(this.y, e17.y), this.z = Math.min(this.z, e17.z), this.w = Math.min(this.w, e17.w), this;
    }
    max(e17) {
      return this.x = Math.max(this.x, e17.x), this.y = Math.max(this.y, e17.y), this.z = Math.max(this.z, e17.z), this.w = Math.max(this.w, e17.w), this;
    }
    clamp(e17, t2) {
      return this.x = H(this.x, e17.x, t2.x), this.y = H(this.y, e17.y, t2.y), this.z = H(this.z, e17.z, t2.z), this.w = H(this.w, e17.w, t2.w), this;
    }
    clampScalar(e17, t2) {
      return this.x = H(this.x, e17, t2), this.y = H(this.y, e17, t2), this.z = H(this.z, e17, t2), this.w = H(this.w, e17, t2), this;
    }
    clampLength(e17, t2) {
      let n2 = this.length();
      return this.divideScalar(n2 || 1).multiplyScalar(H(n2, e17, t2));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
    }
    dot(e17) {
      return this.x * e17.x + this.y * e17.y + this.z * e17.z + this.w * e17.w;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e17) {
      return this.normalize().multiplyScalar(e17);
    }
    lerp(e17, t2) {
      return this.x += (e17.x - this.x) * t2, this.y += (e17.y - this.y) * t2, this.z += (e17.z - this.z) * t2, this.w += (e17.w - this.w) * t2, this;
    }
    lerpVectors(e17, t2, n2) {
      return this.x = e17.x + (t2.x - e17.x) * n2, this.y = e17.y + (t2.y - e17.y) * n2, this.z = e17.z + (t2.z - e17.z) * n2, this.w = e17.w + (t2.w - e17.w) * n2, this;
    }
    equals(e17) {
      return e17.x === this.x && e17.y === this.y && e17.z === this.z && e17.w === this.w;
    }
    fromArray(e17, t2 = 0) {
      return this.x = e17[t2], this.y = e17[t2 + 1], this.z = e17[t2 + 2], this.w = e17[t2 + 3], this;
    }
    toArray(e17 = [], t2 = 0) {
      return e17[t2] = this.x, e17[t2 + 1] = this.y, e17[t2 + 2] = this.z, e17[t2 + 3] = this.w, e17;
    }
    fromBufferAttribute(e17, t2) {
      return this.x = e17.getX(t2), this.y = e17.getY(t2), this.z = e17.getZ(t2), this.w = e17.getW(t2), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  };
  var Tt = class extends Ke {
    constructor(e17 = 1, t2 = 1, n2 = {}) {
      super(), n2 = Object.assign({ generateMipmaps: false, internalFormat: null, minFilter: h, depthBuffer: true, stencilBuffer: false, resolveDepthBuffer: true, resolveStencilBuffer: true, depthTexture: null, samples: 0, count: 1, depth: 1, multiview: false }, n2), this.isRenderTarget = true, this.width = e17, this.height = t2, this.depth = n2.depth, this.scissor = new wt(0, 0, e17, t2), this.scissorTest = false, this.viewport = new wt(0, 0, e17, t2);
      let r2 = new Ct({ width: e17, height: t2, depth: n2.depth });
      this.textures = [];
      let i2 = n2.count;
      for (let e18 = 0; e18 < i2; e18++) this.textures[e18] = r2.clone(), this.textures[e18].isRenderTargetTexture = true, this.textures[e18].renderTarget = this;
      this._setTextureOptions(n2), this.depthBuffer = n2.depthBuffer, this.stencilBuffer = n2.stencilBuffer, this.resolveDepthBuffer = n2.resolveDepthBuffer, this.resolveStencilBuffer = n2.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n2.depthTexture, this.samples = n2.samples, this.multiview = n2.multiview;
    }
    _setTextureOptions(e17 = {}) {
      let t2 = { minFilter: h, generateMipmaps: false, flipY: false, internalFormat: null };
      e17.mapping !== void 0 && (t2.mapping = e17.mapping), e17.wrapS !== void 0 && (t2.wrapS = e17.wrapS), e17.wrapT !== void 0 && (t2.wrapT = e17.wrapT), e17.wrapR !== void 0 && (t2.wrapR = e17.wrapR), e17.magFilter !== void 0 && (t2.magFilter = e17.magFilter), e17.minFilter !== void 0 && (t2.minFilter = e17.minFilter), e17.format !== void 0 && (t2.format = e17.format), e17.type !== void 0 && (t2.type = e17.type), e17.anisotropy !== void 0 && (t2.anisotropy = e17.anisotropy), e17.colorSpace !== void 0 && (t2.colorSpace = e17.colorSpace), e17.flipY !== void 0 && (t2.flipY = e17.flipY), e17.generateMipmaps !== void 0 && (t2.generateMipmaps = e17.generateMipmaps), e17.internalFormat !== void 0 && (t2.internalFormat = e17.internalFormat);
      for (let e18 = 0; e18 < this.textures.length; e18++) this.textures[e18].setValues(t2);
    }
    get texture() {
      return this.textures[0];
    }
    set texture(e17) {
      this.textures[0] = e17;
    }
    set depthTexture(e17) {
      this._depthTexture !== null && (this._depthTexture.renderTarget = null), e17 !== null && (e17.renderTarget = this), this._depthTexture = e17;
    }
    get depthTexture() {
      return this._depthTexture;
    }
    setSize(e17, t2, n2 = 1) {
      if (this.width !== e17 || this.height !== t2 || this.depth !== n2) {
        this.width = e17, this.height = t2, this.depth = n2;
        for (let r2 = 0, i2 = this.textures.length; r2 < i2; r2++) this.textures[r2].image.width = e17, this.textures[r2].image.height = t2, this.textures[r2].image.depth = n2, this.textures[r2].isArrayTexture = this.textures[r2].image.depth > 1;
        this.dispose();
      }
      this.viewport.set(0, 0, e17, t2), this.scissor.set(0, 0, e17, t2);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e17) {
      this.width = e17.width, this.height = e17.height, this.depth = e17.depth, this.scissor.copy(e17.scissor), this.scissorTest = e17.scissorTest, this.viewport.copy(e17.viewport), this.textures.length = 0;
      for (let t2 = 0, n2 = e17.textures.length; t2 < n2; t2++) {
        this.textures[t2] = e17.textures[t2].clone(), this.textures[t2].isRenderTargetTexture = true, this.textures[t2].renderTarget = this;
        let n3 = Object.assign({}, e17.textures[t2].image);
        this.textures[t2].source = new yt(n3);
      }
      return this.depthBuffer = e17.depthBuffer, this.stencilBuffer = e17.stencilBuffer, this.resolveDepthBuffer = e17.resolveDepthBuffer, this.resolveStencilBuffer = e17.resolveStencilBuffer, e17.depthTexture !== null && (this.depthTexture = e17.depthTexture.clone()), this.samples = e17.samples, this;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
  };
  var Et = class extends Tt {
    constructor(e17 = 1, t2 = 1, n2 = {}) {
      super(e17, t2, n2), this.isWebGLRenderTarget = true;
    }
  };
  var Dt = class extends Ct {
    constructor(e17 = null, t2 = 1, n2 = 1, r2 = 1) {
      super(null), this.isDataArrayTexture = true, this.image = { data: e17, width: t2, height: n2, depth: r2 }, this.magFilter = f, this.minFilter = f, this.wrapR = u, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
    }
    addLayerUpdate(e17) {
      this.layerUpdates.add(e17);
    }
    clearLayerUpdates() {
      this.layerUpdates.clear();
    }
  };
  var Ot = class extends Ct {
    constructor(e17 = null, t2 = 1, n2 = 1, r2 = 1) {
      super(null), this.isData3DTexture = true, this.image = { data: e17, width: t2, height: n2, depth: r2 }, this.magFilter = f, this.minFilter = f, this.wrapR = u, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var kt = class {
    constructor(e17 = new W(1 / 0, 1 / 0, 1 / 0), t2 = new W(-1 / 0, -1 / 0, -1 / 0)) {
      this.isBox3 = true, this.min = e17, this.max = t2;
    }
    set(e17, t2) {
      return this.min.copy(e17), this.max.copy(t2), this;
    }
    setFromArray(e17) {
      this.makeEmpty();
      for (let t2 = 0, n2 = e17.length; t2 < n2; t2 += 3) this.expandByPoint(jt.fromArray(e17, t2));
      return this;
    }
    setFromBufferAttribute(e17) {
      this.makeEmpty();
      for (let t2 = 0, n2 = e17.count; t2 < n2; t2++) this.expandByPoint(jt.fromBufferAttribute(e17, t2));
      return this;
    }
    setFromPoints(e17) {
      this.makeEmpty();
      for (let t2 = 0, n2 = e17.length; t2 < n2; t2++) this.expandByPoint(e17[t2]);
      return this;
    }
    setFromCenterAndSize(e17, t2) {
      let n2 = jt.copy(t2).multiplyScalar(0.5);
      return this.min.copy(e17).sub(n2), this.max.copy(e17).add(n2), this;
    }
    setFromObject(e17, t2 = false) {
      return this.makeEmpty(), this.expandByObject(e17, t2);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e17) {
      return this.min.copy(e17.min), this.max.copy(e17.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(e17) {
      return this.isEmpty() ? e17.set(0, 0, 0) : e17.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(e17) {
      return this.isEmpty() ? e17.set(0, 0, 0) : e17.subVectors(this.max, this.min);
    }
    expandByPoint(e17) {
      return this.min.min(e17), this.max.max(e17), this;
    }
    expandByVector(e17) {
      return this.min.sub(e17), this.max.add(e17), this;
    }
    expandByScalar(e17) {
      return this.min.addScalar(-e17), this.max.addScalar(e17), this;
    }
    expandByObject(e17, t2 = false) {
      e17.updateWorldMatrix(false, false);
      let n2 = e17.geometry;
      if (n2 !== void 0) {
        let r3 = n2.getAttribute(`position`);
        if (t2 === true && r3 !== void 0 && e17.isInstancedMesh !== true) for (let t3 = 0, n3 = r3.count; t3 < n3; t3++) e17.isMesh === true ? e17.getVertexPosition(t3, jt) : jt.fromBufferAttribute(r3, t3), jt.applyMatrix4(e17.matrixWorld), this.expandByPoint(jt);
        else e17.boundingBox === void 0 ? (n2.boundingBox === null && n2.computeBoundingBox(), Mt.copy(n2.boundingBox)) : (e17.boundingBox === null && e17.computeBoundingBox(), Mt.copy(e17.boundingBox)), Mt.applyMatrix4(e17.matrixWorld), this.union(Mt);
      }
      let r2 = e17.children;
      for (let e18 = 0, n3 = r2.length; e18 < n3; e18++) this.expandByObject(r2[e18], t2);
      return this;
    }
    containsPoint(e17) {
      return e17.x >= this.min.x && e17.x <= this.max.x && e17.y >= this.min.y && e17.y <= this.max.y && e17.z >= this.min.z && e17.z <= this.max.z;
    }
    containsBox(e17) {
      return this.min.x <= e17.min.x && e17.max.x <= this.max.x && this.min.y <= e17.min.y && e17.max.y <= this.max.y && this.min.z <= e17.min.z && e17.max.z <= this.max.z;
    }
    getParameter(e17, t2) {
      return t2.set((e17.x - this.min.x) / (this.max.x - this.min.x), (e17.y - this.min.y) / (this.max.y - this.min.y), (e17.z - this.min.z) / (this.max.z - this.min.z));
    }
    intersectsBox(e17) {
      return e17.max.x >= this.min.x && e17.min.x <= this.max.x && e17.max.y >= this.min.y && e17.min.y <= this.max.y && e17.max.z >= this.min.z && e17.min.z <= this.max.z;
    }
    intersectsSphere(e17) {
      return this.clampPoint(e17.center, jt), jt.distanceToSquared(e17.center) <= e17.radius * e17.radius;
    }
    intersectsPlane(e17) {
      let t2, n2;
      return e17.normal.x > 0 ? (t2 = e17.normal.x * this.min.x, n2 = e17.normal.x * this.max.x) : (t2 = e17.normal.x * this.max.x, n2 = e17.normal.x * this.min.x), e17.normal.y > 0 ? (t2 += e17.normal.y * this.min.y, n2 += e17.normal.y * this.max.y) : (t2 += e17.normal.y * this.max.y, n2 += e17.normal.y * this.min.y), e17.normal.z > 0 ? (t2 += e17.normal.z * this.min.z, n2 += e17.normal.z * this.max.z) : (t2 += e17.normal.z * this.max.z, n2 += e17.normal.z * this.min.z), t2 <= -e17.constant && n2 >= -e17.constant;
    }
    intersectsTriangle(e17) {
      if (this.isEmpty()) return false;
      this.getCenter(zt), Bt.subVectors(this.max, zt), Nt.subVectors(e17.a, zt), Pt.subVectors(e17.b, zt), Ft.subVectors(e17.c, zt), It.subVectors(Pt, Nt), Lt.subVectors(Ft, Pt), Rt.subVectors(Nt, Ft);
      let t2 = [0, -It.z, It.y, 0, -Lt.z, Lt.y, 0, -Rt.z, Rt.y, It.z, 0, -It.x, Lt.z, 0, -Lt.x, Rt.z, 0, -Rt.x, -It.y, It.x, 0, -Lt.y, Lt.x, 0, -Rt.y, Rt.x, 0];
      return !Ut(t2, Nt, Pt, Ft, Bt) || (t2 = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Ut(t2, Nt, Pt, Ft, Bt)) ? false : (Vt.crossVectors(It, Lt), t2 = [Vt.x, Vt.y, Vt.z], Ut(t2, Nt, Pt, Ft, Bt));
    }
    clampPoint(e17, t2) {
      return t2.copy(e17).clamp(this.min, this.max);
    }
    distanceToPoint(e17) {
      return this.clampPoint(e17, jt).distanceTo(e17);
    }
    getBoundingSphere(e17) {
      return this.isEmpty() ? e17.makeEmpty() : (this.getCenter(e17.center), e17.radius = this.getSize(jt).length() * 0.5), e17;
    }
    intersect(e17) {
      return this.min.max(e17.min), this.max.min(e17.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(e17) {
      return this.min.min(e17.min), this.max.max(e17.max), this;
    }
    applyMatrix4(e17) {
      return this.isEmpty() ? this : (At[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e17), At[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e17), At[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e17), At[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e17), At[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e17), At[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e17), At[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e17), At[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e17), this.setFromPoints(At), this);
    }
    translate(e17) {
      return this.min.add(e17), this.max.add(e17), this;
    }
    equals(e17) {
      return e17.min.equals(this.min) && e17.max.equals(this.max);
    }
    toJSON() {
      return { min: this.min.toArray(), max: this.max.toArray() };
    }
    fromJSON(e17) {
      return this.min.fromArray(e17.min), this.max.fromArray(e17.max), this;
    }
  };
  var At = [new W(), new W(), new W(), new W(), new W(), new W(), new W(), new W()];
  var jt = new W();
  var Mt = new kt();
  var Nt = new W();
  var Pt = new W();
  var Ft = new W();
  var It = new W();
  var Lt = new W();
  var Rt = new W();
  var zt = new W();
  var Bt = new W();
  var Vt = new W();
  var Ht = new W();
  function Ut(e17, t2, n2, r2, i2) {
    for (let a2 = 0, o2 = e17.length - 3; a2 <= o2; a2 += 3) {
      Ht.fromArray(e17, a2);
      let o3 = i2.x * Math.abs(Ht.x) + i2.y * Math.abs(Ht.y) + i2.z * Math.abs(Ht.z), s2 = t2.dot(Ht), c2 = n2.dot(Ht), l2 = r2.dot(Ht);
      if (Math.max(-Math.max(s2, c2, l2), Math.min(s2, c2, l2)) > o3) return false;
    }
    return true;
  }
  var Wt = new kt();
  var Gt = new W();
  var Kt = new W();
  var qt = class {
    constructor(e17 = new W(), t2 = -1) {
      this.isSphere = true, this.center = e17, this.radius = t2;
    }
    set(e17, t2) {
      return this.center.copy(e17), this.radius = t2, this;
    }
    setFromPoints(e17, t2) {
      let n2 = this.center;
      t2 === void 0 ? Wt.setFromPoints(e17).getCenter(n2) : n2.copy(t2);
      let r2 = 0;
      for (let t3 = 0, i2 = e17.length; t3 < i2; t3++) r2 = Math.max(r2, n2.distanceToSquared(e17[t3]));
      return this.radius = Math.sqrt(r2), this;
    }
    copy(e17) {
      return this.center.copy(e17.center), this.radius = e17.radius, this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return this.center.set(0, 0, 0), this.radius = -1, this;
    }
    containsPoint(e17) {
      return e17.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(e17) {
      return e17.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(e17) {
      let t2 = this.radius + e17.radius;
      return e17.center.distanceToSquared(this.center) <= t2 * t2;
    }
    intersectsBox(e17) {
      return e17.intersectsSphere(this);
    }
    intersectsPlane(e17) {
      return Math.abs(e17.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(e17, t2) {
      let n2 = this.center.distanceToSquared(e17);
      return t2.copy(e17), n2 > this.radius * this.radius && (t2.sub(this.center).normalize(), t2.multiplyScalar(this.radius).add(this.center)), t2;
    }
    getBoundingBox(e17) {
      return this.isEmpty() ? (e17.makeEmpty(), e17) : (e17.set(this.center, this.center), e17.expandByScalar(this.radius), e17);
    }
    applyMatrix4(e17) {
      return this.center.applyMatrix4(e17), this.radius *= e17.getMaxScaleOnAxis(), this;
    }
    translate(e17) {
      return this.center.add(e17), this;
    }
    expandByPoint(e17) {
      if (this.isEmpty()) return this.center.copy(e17), this.radius = 0, this;
      Gt.subVectors(e17, this.center);
      let t2 = Gt.lengthSq();
      if (t2 > this.radius * this.radius) {
        let e18 = Math.sqrt(t2), n2 = (e18 - this.radius) * 0.5;
        this.center.addScaledVector(Gt, n2 / e18), this.radius += n2;
      }
      return this;
    }
    union(e17) {
      return e17.isEmpty() ? this : this.isEmpty() ? (this.copy(e17), this) : (this.center.equals(e17.center) === true ? this.radius = Math.max(this.radius, e17.radius) : (Kt.subVectors(e17.center, this.center).setLength(e17.radius), this.expandByPoint(Gt.copy(e17.center).add(Kt)), this.expandByPoint(Gt.copy(e17.center).sub(Kt))), this);
    }
    equals(e17) {
      return e17.center.equals(this.center) && e17.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      return { radius: this.radius, center: this.center.toArray() };
    }
    fromJSON(e17) {
      return this.radius = e17.radius, this.center.fromArray(e17.center), this;
    }
  };
  var Jt = new W();
  var Yt = new W();
  var Xt = new W();
  var Zt = new W();
  var Qt = new W();
  var $t = new W();
  var en = new W();
  var tn = class {
    constructor(e17 = new W(), t2 = new W(0, 0, -1)) {
      this.origin = e17, this.direction = t2;
    }
    set(e17, t2) {
      return this.origin.copy(e17), this.direction.copy(t2), this;
    }
    copy(e17) {
      return this.origin.copy(e17.origin), this.direction.copy(e17.direction), this;
    }
    at(e17, t2) {
      return t2.copy(this.origin).addScaledVector(this.direction, e17);
    }
    lookAt(e17) {
      return this.direction.copy(e17).sub(this.origin).normalize(), this;
    }
    recast(e17) {
      return this.origin.copy(this.at(e17, Jt)), this;
    }
    closestPointToPoint(e17, t2) {
      t2.subVectors(e17, this.origin);
      let n2 = t2.dot(this.direction);
      return n2 < 0 ? t2.copy(this.origin) : t2.copy(this.origin).addScaledVector(this.direction, n2);
    }
    distanceToPoint(e17) {
      return Math.sqrt(this.distanceSqToPoint(e17));
    }
    distanceSqToPoint(e17) {
      let t2 = Jt.subVectors(e17, this.origin).dot(this.direction);
      return t2 < 0 ? this.origin.distanceToSquared(e17) : (Jt.copy(this.origin).addScaledVector(this.direction, t2), Jt.distanceToSquared(e17));
    }
    distanceSqToSegment(e17, t2, n2, r2) {
      Yt.copy(e17).add(t2).multiplyScalar(0.5), Xt.copy(t2).sub(e17).normalize(), Zt.copy(this.origin).sub(Yt);
      let i2 = e17.distanceTo(t2) * 0.5, a2 = -this.direction.dot(Xt), o2 = Zt.dot(this.direction), s2 = -Zt.dot(Xt), c2 = Zt.lengthSq(), l2 = Math.abs(1 - a2 * a2), u2, d2, f2, p2;
      if (l2 > 0) if (u2 = a2 * s2 - o2, d2 = a2 * o2 - s2, p2 = i2 * l2, u2 >= 0) if (d2 >= -p2) if (d2 <= p2) {
        let e18 = 1 / l2;
        u2 *= e18, d2 *= e18, f2 = u2 * (u2 + a2 * d2 + 2 * o2) + d2 * (a2 * u2 + d2 + 2 * s2) + c2;
      } else d2 = i2, u2 = Math.max(0, -(a2 * d2 + o2)), f2 = -u2 * u2 + d2 * (d2 + 2 * s2) + c2;
      else d2 = -i2, u2 = Math.max(0, -(a2 * d2 + o2)), f2 = -u2 * u2 + d2 * (d2 + 2 * s2) + c2;
      else d2 <= -p2 ? (u2 = Math.max(0, -(-a2 * i2 + o2)), d2 = u2 > 0 ? -i2 : Math.min(Math.max(-i2, -s2), i2), f2 = -u2 * u2 + d2 * (d2 + 2 * s2) + c2) : d2 <= p2 ? (u2 = 0, d2 = Math.min(Math.max(-i2, -s2), i2), f2 = d2 * (d2 + 2 * s2) + c2) : (u2 = Math.max(0, -(a2 * i2 + o2)), d2 = u2 > 0 ? i2 : Math.min(Math.max(-i2, -s2), i2), f2 = -u2 * u2 + d2 * (d2 + 2 * s2) + c2);
      else d2 = a2 > 0 ? -i2 : i2, u2 = Math.max(0, -(a2 * d2 + o2)), f2 = -u2 * u2 + d2 * (d2 + 2 * s2) + c2;
      return n2 && n2.copy(this.origin).addScaledVector(this.direction, u2), r2 && r2.copy(Yt).addScaledVector(Xt, d2), f2;
    }
    intersectSphere(e17, t2) {
      Jt.subVectors(e17.center, this.origin);
      let n2 = Jt.dot(this.direction), r2 = Jt.dot(Jt) - n2 * n2, i2 = e17.radius * e17.radius;
      if (r2 > i2) return null;
      let a2 = Math.sqrt(i2 - r2), o2 = n2 - a2, s2 = n2 + a2;
      return s2 < 0 ? null : o2 < 0 ? this.at(s2, t2) : this.at(o2, t2);
    }
    intersectsSphere(e17) {
      return e17.radius < 0 ? false : this.distanceSqToPoint(e17.center) <= e17.radius * e17.radius;
    }
    distanceToPlane(e17) {
      let t2 = e17.normal.dot(this.direction);
      if (t2 === 0) return e17.distanceToPoint(this.origin) === 0 ? 0 : null;
      let n2 = -(this.origin.dot(e17.normal) + e17.constant) / t2;
      return n2 >= 0 ? n2 : null;
    }
    intersectPlane(e17, t2) {
      let n2 = this.distanceToPlane(e17);
      return n2 === null ? null : this.at(n2, t2);
    }
    intersectsPlane(e17) {
      let t2 = e17.distanceToPoint(this.origin);
      return t2 === 0 || e17.normal.dot(this.direction) * t2 < 0;
    }
    intersectBox(e17, t2) {
      let n2, r2, i2, a2, o2, s2, c2 = 1 / this.direction.x, l2 = 1 / this.direction.y, u2 = 1 / this.direction.z, d2 = this.origin;
      return c2 >= 0 ? (n2 = (e17.min.x - d2.x) * c2, r2 = (e17.max.x - d2.x) * c2) : (n2 = (e17.max.x - d2.x) * c2, r2 = (e17.min.x - d2.x) * c2), l2 >= 0 ? (i2 = (e17.min.y - d2.y) * l2, a2 = (e17.max.y - d2.y) * l2) : (i2 = (e17.max.y - d2.y) * l2, a2 = (e17.min.y - d2.y) * l2), n2 > a2 || i2 > r2 || ((i2 > n2 || isNaN(n2)) && (n2 = i2), (a2 < r2 || isNaN(r2)) && (r2 = a2), u2 >= 0 ? (o2 = (e17.min.z - d2.z) * u2, s2 = (e17.max.z - d2.z) * u2) : (o2 = (e17.max.z - d2.z) * u2, s2 = (e17.min.z - d2.z) * u2), n2 > s2 || o2 > r2) || ((o2 > n2 || n2 !== n2) && (n2 = o2), (s2 < r2 || r2 !== r2) && (r2 = s2), r2 < 0) ? null : this.at(n2 >= 0 ? n2 : r2, t2);
    }
    intersectsBox(e17) {
      return this.intersectBox(e17, Jt) !== null;
    }
    intersectTriangle(e17, t2, n2, r2, i2) {
      Qt.subVectors(t2, e17), $t.subVectors(n2, e17), en.crossVectors(Qt, $t);
      let a2 = this.direction.dot(en), o2;
      if (a2 > 0) {
        if (r2) return null;
        o2 = 1;
      } else if (a2 < 0) o2 = -1, a2 = -a2;
      else return null;
      Zt.subVectors(this.origin, e17);
      let s2 = o2 * this.direction.dot($t.crossVectors(Zt, $t));
      if (s2 < 0) return null;
      let c2 = o2 * this.direction.dot(Qt.cross(Zt));
      if (c2 < 0 || s2 + c2 > a2) return null;
      let l2 = -o2 * Zt.dot(en);
      return l2 < 0 ? null : this.at(l2 / a2, i2);
    }
    applyMatrix4(e17) {
      return this.origin.applyMatrix4(e17), this.direction.transformDirection(e17), this;
    }
    equals(e17) {
      return e17.origin.equals(this.origin) && e17.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var nn = class e7 {
    constructor(t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2) {
      e7.prototype.isMatrix4 = true, this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], t2 !== void 0 && this.set(t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2);
    }
    set(e17, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2) {
      let g2 = this.elements;
      return g2[0] = e17, g2[4] = t2, g2[8] = n2, g2[12] = r2, g2[1] = i2, g2[5] = a2, g2[9] = o2, g2[13] = s2, g2[2] = c2, g2[6] = l2, g2[10] = u2, g2[14] = d2, g2[3] = f2, g2[7] = p2, g2[11] = m2, g2[15] = h2, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    clone() {
      return new e7().fromArray(this.elements);
    }
    copy(e17) {
      let t2 = this.elements, n2 = e17.elements;
      return t2[0] = n2[0], t2[1] = n2[1], t2[2] = n2[2], t2[3] = n2[3], t2[4] = n2[4], t2[5] = n2[5], t2[6] = n2[6], t2[7] = n2[7], t2[8] = n2[8], t2[9] = n2[9], t2[10] = n2[10], t2[11] = n2[11], t2[12] = n2[12], t2[13] = n2[13], t2[14] = n2[14], t2[15] = n2[15], this;
    }
    copyPosition(e17) {
      let t2 = this.elements, n2 = e17.elements;
      return t2[12] = n2[12], t2[13] = n2[13], t2[14] = n2[14], this;
    }
    setFromMatrix3(e17) {
      let t2 = e17.elements;
      return this.set(t2[0], t2[3], t2[6], 0, t2[1], t2[4], t2[7], 0, t2[2], t2[5], t2[8], 0, 0, 0, 0, 1), this;
    }
    extractBasis(e17, t2, n2) {
      return e17.setFromMatrixColumn(this, 0), t2.setFromMatrixColumn(this, 1), n2.setFromMatrixColumn(this, 2), this;
    }
    makeBasis(e17, t2, n2) {
      return this.set(e17.x, t2.x, n2.x, 0, e17.y, t2.y, n2.y, 0, e17.z, t2.z, n2.z, 0, 0, 0, 0, 1), this;
    }
    extractRotation(e17) {
      let t2 = this.elements, n2 = e17.elements, r2 = 1 / rn.setFromMatrixColumn(e17, 0).length(), i2 = 1 / rn.setFromMatrixColumn(e17, 1).length(), a2 = 1 / rn.setFromMatrixColumn(e17, 2).length();
      return t2[0] = n2[0] * r2, t2[1] = n2[1] * r2, t2[2] = n2[2] * r2, t2[3] = 0, t2[4] = n2[4] * i2, t2[5] = n2[5] * i2, t2[6] = n2[6] * i2, t2[7] = 0, t2[8] = n2[8] * a2, t2[9] = n2[9] * a2, t2[10] = n2[10] * a2, t2[11] = 0, t2[12] = 0, t2[13] = 0, t2[14] = 0, t2[15] = 1, this;
    }
    makeRotationFromEuler(e17) {
      let t2 = this.elements, n2 = e17.x, r2 = e17.y, i2 = e17.z, a2 = Math.cos(n2), o2 = Math.sin(n2), s2 = Math.cos(r2), c2 = Math.sin(r2), l2 = Math.cos(i2), u2 = Math.sin(i2);
      if (e17.order === `XYZ`) {
        let e18 = a2 * l2, n3 = a2 * u2, r3 = o2 * l2, i3 = o2 * u2;
        t2[0] = s2 * l2, t2[4] = -s2 * u2, t2[8] = c2, t2[1] = n3 + r3 * c2, t2[5] = e18 - i3 * c2, t2[9] = -o2 * s2, t2[2] = i3 - e18 * c2, t2[6] = r3 + n3 * c2, t2[10] = a2 * s2;
      } else if (e17.order === `YXZ`) {
        let e18 = s2 * l2, n3 = s2 * u2, r3 = c2 * l2, i3 = c2 * u2;
        t2[0] = e18 + i3 * o2, t2[4] = r3 * o2 - n3, t2[8] = a2 * c2, t2[1] = a2 * u2, t2[5] = a2 * l2, t2[9] = -o2, t2[2] = n3 * o2 - r3, t2[6] = i3 + e18 * o2, t2[10] = a2 * s2;
      } else if (e17.order === `ZXY`) {
        let e18 = s2 * l2, n3 = s2 * u2, r3 = c2 * l2, i3 = c2 * u2;
        t2[0] = e18 - i3 * o2, t2[4] = -a2 * u2, t2[8] = r3 + n3 * o2, t2[1] = n3 + r3 * o2, t2[5] = a2 * l2, t2[9] = i3 - e18 * o2, t2[2] = -a2 * c2, t2[6] = o2, t2[10] = a2 * s2;
      } else if (e17.order === `ZYX`) {
        let e18 = a2 * l2, n3 = a2 * u2, r3 = o2 * l2, i3 = o2 * u2;
        t2[0] = s2 * l2, t2[4] = r3 * c2 - n3, t2[8] = e18 * c2 + i3, t2[1] = s2 * u2, t2[5] = i3 * c2 + e18, t2[9] = n3 * c2 - r3, t2[2] = -c2, t2[6] = o2 * s2, t2[10] = a2 * s2;
      } else if (e17.order === `YZX`) {
        let e18 = a2 * s2, n3 = a2 * c2, r3 = o2 * s2, i3 = o2 * c2;
        t2[0] = s2 * l2, t2[4] = i3 - e18 * u2, t2[8] = r3 * u2 + n3, t2[1] = u2, t2[5] = a2 * l2, t2[9] = -o2 * l2, t2[2] = -c2 * l2, t2[6] = n3 * u2 + r3, t2[10] = e18 - i3 * u2;
      } else if (e17.order === `XZY`) {
        let e18 = a2 * s2, n3 = a2 * c2, r3 = o2 * s2, i3 = o2 * c2;
        t2[0] = s2 * l2, t2[4] = -u2, t2[8] = c2 * l2, t2[1] = e18 * u2 + i3, t2[5] = a2 * l2, t2[9] = n3 * u2 - r3, t2[2] = r3 * u2 - n3, t2[6] = o2 * l2, t2[10] = i3 * u2 + e18;
      }
      return t2[3] = 0, t2[7] = 0, t2[11] = 0, t2[12] = 0, t2[13] = 0, t2[14] = 0, t2[15] = 1, this;
    }
    makeRotationFromQuaternion(e17) {
      return this.compose(on, e17, sn);
    }
    lookAt(e17, t2, n2) {
      let r2 = this.elements;
      return un.subVectors(e17, t2), un.lengthSq() === 0 && (un.z = 1), un.normalize(), cn.crossVectors(n2, un), cn.lengthSq() === 0 && (Math.abs(n2.z) === 1 ? un.x += 1e-4 : un.z += 1e-4, un.normalize(), cn.crossVectors(n2, un)), cn.normalize(), ln.crossVectors(un, cn), r2[0] = cn.x, r2[4] = ln.x, r2[8] = un.x, r2[1] = cn.y, r2[5] = ln.y, r2[9] = un.y, r2[2] = cn.z, r2[6] = ln.z, r2[10] = un.z, this;
    }
    multiply(e17) {
      return this.multiplyMatrices(this, e17);
    }
    premultiply(e17) {
      return this.multiplyMatrices(e17, this);
    }
    multiplyMatrices(e17, t2) {
      let n2 = e17.elements, r2 = t2.elements, i2 = this.elements, a2 = n2[0], o2 = n2[4], s2 = n2[8], c2 = n2[12], l2 = n2[1], u2 = n2[5], d2 = n2[9], f2 = n2[13], p2 = n2[2], m2 = n2[6], h2 = n2[10], g2 = n2[14], _2 = n2[3], v2 = n2[7], y2 = n2[11], b2 = n2[15], x2 = r2[0], S2 = r2[4], C2 = r2[8], w2 = r2[12], T2 = r2[1], E2 = r2[5], D2 = r2[9], O2 = r2[13], k2 = r2[2], A3 = r2[6], j3 = r2[10], ee2 = r2[14], te2 = r2[3], M3 = r2[7], N3 = r2[11], P2 = r2[15];
      return i2[0] = a2 * x2 + o2 * T2 + s2 * k2 + c2 * te2, i2[4] = a2 * S2 + o2 * E2 + s2 * A3 + c2 * M3, i2[8] = a2 * C2 + o2 * D2 + s2 * j3 + c2 * N3, i2[12] = a2 * w2 + o2 * O2 + s2 * ee2 + c2 * P2, i2[1] = l2 * x2 + u2 * T2 + d2 * k2 + f2 * te2, i2[5] = l2 * S2 + u2 * E2 + d2 * A3 + f2 * M3, i2[9] = l2 * C2 + u2 * D2 + d2 * j3 + f2 * N3, i2[13] = l2 * w2 + u2 * O2 + d2 * ee2 + f2 * P2, i2[2] = p2 * x2 + m2 * T2 + h2 * k2 + g2 * te2, i2[6] = p2 * S2 + m2 * E2 + h2 * A3 + g2 * M3, i2[10] = p2 * C2 + m2 * D2 + h2 * j3 + g2 * N3, i2[14] = p2 * w2 + m2 * O2 + h2 * ee2 + g2 * P2, i2[3] = _2 * x2 + v2 * T2 + y2 * k2 + b2 * te2, i2[7] = _2 * S2 + v2 * E2 + y2 * A3 + b2 * M3, i2[11] = _2 * C2 + v2 * D2 + y2 * j3 + b2 * N3, i2[15] = _2 * w2 + v2 * O2 + y2 * ee2 + b2 * P2, this;
    }
    multiplyScalar(e17) {
      let t2 = this.elements;
      return t2[0] *= e17, t2[4] *= e17, t2[8] *= e17, t2[12] *= e17, t2[1] *= e17, t2[5] *= e17, t2[9] *= e17, t2[13] *= e17, t2[2] *= e17, t2[6] *= e17, t2[10] *= e17, t2[14] *= e17, t2[3] *= e17, t2[7] *= e17, t2[11] *= e17, t2[15] *= e17, this;
    }
    determinant() {
      let e17 = this.elements, t2 = e17[0], n2 = e17[4], r2 = e17[8], i2 = e17[12], a2 = e17[1], o2 = e17[5], s2 = e17[9], c2 = e17[13], l2 = e17[2], u2 = e17[6], d2 = e17[10], f2 = e17[14], p2 = e17[3], m2 = e17[7], h2 = e17[11], g2 = e17[15];
      return p2 * (+i2 * s2 * u2 - r2 * c2 * u2 - i2 * o2 * d2 + n2 * c2 * d2 + r2 * o2 * f2 - n2 * s2 * f2) + m2 * (+t2 * s2 * f2 - t2 * c2 * d2 + i2 * a2 * d2 - r2 * a2 * f2 + r2 * c2 * l2 - i2 * s2 * l2) + h2 * (+t2 * c2 * u2 - t2 * o2 * f2 - i2 * a2 * u2 + n2 * a2 * f2 + i2 * o2 * l2 - n2 * c2 * l2) + g2 * (-r2 * o2 * l2 - t2 * s2 * u2 + t2 * o2 * d2 + r2 * a2 * u2 - n2 * a2 * d2 + n2 * s2 * l2);
    }
    transpose() {
      let e17 = this.elements, t2;
      return t2 = e17[1], e17[1] = e17[4], e17[4] = t2, t2 = e17[2], e17[2] = e17[8], e17[8] = t2, t2 = e17[6], e17[6] = e17[9], e17[9] = t2, t2 = e17[3], e17[3] = e17[12], e17[12] = t2, t2 = e17[7], e17[7] = e17[13], e17[13] = t2, t2 = e17[11], e17[11] = e17[14], e17[14] = t2, this;
    }
    setPosition(e17, t2, n2) {
      let r2 = this.elements;
      return e17.isVector3 ? (r2[12] = e17.x, r2[13] = e17.y, r2[14] = e17.z) : (r2[12] = e17, r2[13] = t2, r2[14] = n2), this;
    }
    invert() {
      let e17 = this.elements, t2 = e17[0], n2 = e17[1], r2 = e17[2], i2 = e17[3], a2 = e17[4], o2 = e17[5], s2 = e17[6], c2 = e17[7], l2 = e17[8], u2 = e17[9], d2 = e17[10], f2 = e17[11], p2 = e17[12], m2 = e17[13], h2 = e17[14], g2 = e17[15], _2 = u2 * h2 * c2 - m2 * d2 * c2 + m2 * s2 * f2 - o2 * h2 * f2 - u2 * s2 * g2 + o2 * d2 * g2, v2 = p2 * d2 * c2 - l2 * h2 * c2 - p2 * s2 * f2 + a2 * h2 * f2 + l2 * s2 * g2 - a2 * d2 * g2, y2 = l2 * m2 * c2 - p2 * u2 * c2 + p2 * o2 * f2 - a2 * m2 * f2 - l2 * o2 * g2 + a2 * u2 * g2, b2 = p2 * u2 * s2 - l2 * m2 * s2 - p2 * o2 * d2 + a2 * m2 * d2 + l2 * o2 * h2 - a2 * u2 * h2, x2 = t2 * _2 + n2 * v2 + r2 * y2 + i2 * b2;
      if (x2 === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      let S2 = 1 / x2;
      return e17[0] = _2 * S2, e17[1] = (m2 * d2 * i2 - u2 * h2 * i2 - m2 * r2 * f2 + n2 * h2 * f2 + u2 * r2 * g2 - n2 * d2 * g2) * S2, e17[2] = (o2 * h2 * i2 - m2 * s2 * i2 + m2 * r2 * c2 - n2 * h2 * c2 - o2 * r2 * g2 + n2 * s2 * g2) * S2, e17[3] = (u2 * s2 * i2 - o2 * d2 * i2 - u2 * r2 * c2 + n2 * d2 * c2 + o2 * r2 * f2 - n2 * s2 * f2) * S2, e17[4] = v2 * S2, e17[5] = (l2 * h2 * i2 - p2 * d2 * i2 + p2 * r2 * f2 - t2 * h2 * f2 - l2 * r2 * g2 + t2 * d2 * g2) * S2, e17[6] = (p2 * s2 * i2 - a2 * h2 * i2 - p2 * r2 * c2 + t2 * h2 * c2 + a2 * r2 * g2 - t2 * s2 * g2) * S2, e17[7] = (a2 * d2 * i2 - l2 * s2 * i2 + l2 * r2 * c2 - t2 * d2 * c2 - a2 * r2 * f2 + t2 * s2 * f2) * S2, e17[8] = y2 * S2, e17[9] = (p2 * u2 * i2 - l2 * m2 * i2 - p2 * n2 * f2 + t2 * m2 * f2 + l2 * n2 * g2 - t2 * u2 * g2) * S2, e17[10] = (a2 * m2 * i2 - p2 * o2 * i2 + p2 * n2 * c2 - t2 * m2 * c2 - a2 * n2 * g2 + t2 * o2 * g2) * S2, e17[11] = (l2 * o2 * i2 - a2 * u2 * i2 - l2 * n2 * c2 + t2 * u2 * c2 + a2 * n2 * f2 - t2 * o2 * f2) * S2, e17[12] = b2 * S2, e17[13] = (l2 * m2 * r2 - p2 * u2 * r2 + p2 * n2 * d2 - t2 * m2 * d2 - l2 * n2 * h2 + t2 * u2 * h2) * S2, e17[14] = (p2 * o2 * r2 - a2 * m2 * r2 - p2 * n2 * s2 + t2 * m2 * s2 + a2 * n2 * h2 - t2 * o2 * h2) * S2, e17[15] = (a2 * u2 * r2 - l2 * o2 * r2 + l2 * n2 * s2 - t2 * u2 * s2 - a2 * n2 * d2 + t2 * o2 * d2) * S2, this;
    }
    scale(e17) {
      let t2 = this.elements, n2 = e17.x, r2 = e17.y, i2 = e17.z;
      return t2[0] *= n2, t2[4] *= r2, t2[8] *= i2, t2[1] *= n2, t2[5] *= r2, t2[9] *= i2, t2[2] *= n2, t2[6] *= r2, t2[10] *= i2, t2[3] *= n2, t2[7] *= r2, t2[11] *= i2, this;
    }
    getMaxScaleOnAxis() {
      let e17 = this.elements, t2 = e17[0] * e17[0] + e17[1] * e17[1] + e17[2] * e17[2], n2 = e17[4] * e17[4] + e17[5] * e17[5] + e17[6] * e17[6], r2 = e17[8] * e17[8] + e17[9] * e17[9] + e17[10] * e17[10];
      return Math.sqrt(Math.max(t2, n2, r2));
    }
    makeTranslation(e17, t2, n2) {
      return e17.isVector3 ? this.set(1, 0, 0, e17.x, 0, 1, 0, e17.y, 0, 0, 1, e17.z, 0, 0, 0, 1) : this.set(1, 0, 0, e17, 0, 1, 0, t2, 0, 0, 1, n2, 0, 0, 0, 1), this;
    }
    makeRotationX(e17) {
      let t2 = Math.cos(e17), n2 = Math.sin(e17);
      return this.set(1, 0, 0, 0, 0, t2, -n2, 0, 0, n2, t2, 0, 0, 0, 0, 1), this;
    }
    makeRotationY(e17) {
      let t2 = Math.cos(e17), n2 = Math.sin(e17);
      return this.set(t2, 0, n2, 0, 0, 1, 0, 0, -n2, 0, t2, 0, 0, 0, 0, 1), this;
    }
    makeRotationZ(e17) {
      let t2 = Math.cos(e17), n2 = Math.sin(e17);
      return this.set(t2, -n2, 0, 0, n2, t2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    makeRotationAxis(e17, t2) {
      let n2 = Math.cos(t2), r2 = Math.sin(t2), i2 = 1 - n2, a2 = e17.x, o2 = e17.y, s2 = e17.z, c2 = i2 * a2, l2 = i2 * o2;
      return this.set(c2 * a2 + n2, c2 * o2 - r2 * s2, c2 * s2 + r2 * o2, 0, c2 * o2 + r2 * s2, l2 * o2 + n2, l2 * s2 - r2 * a2, 0, c2 * s2 - r2 * o2, l2 * s2 + r2 * a2, i2 * s2 * s2 + n2, 0, 0, 0, 0, 1), this;
    }
    makeScale(e17, t2, n2) {
      return this.set(e17, 0, 0, 0, 0, t2, 0, 0, 0, 0, n2, 0, 0, 0, 0, 1), this;
    }
    makeShear(e17, t2, n2, r2, i2, a2) {
      return this.set(1, n2, i2, 0, e17, 1, a2, 0, t2, r2, 1, 0, 0, 0, 0, 1), this;
    }
    compose(e17, t2, n2) {
      let r2 = this.elements, i2 = t2._x, a2 = t2._y, o2 = t2._z, s2 = t2._w, c2 = i2 + i2, l2 = a2 + a2, u2 = o2 + o2, d2 = i2 * c2, f2 = i2 * l2, p2 = i2 * u2, m2 = a2 * l2, h2 = a2 * u2, g2 = o2 * u2, _2 = s2 * c2, v2 = s2 * l2, y2 = s2 * u2, b2 = n2.x, x2 = n2.y, S2 = n2.z;
      return r2[0] = (1 - (m2 + g2)) * b2, r2[1] = (f2 + y2) * b2, r2[2] = (p2 - v2) * b2, r2[3] = 0, r2[4] = (f2 - y2) * x2, r2[5] = (1 - (d2 + g2)) * x2, r2[6] = (h2 + _2) * x2, r2[7] = 0, r2[8] = (p2 + v2) * S2, r2[9] = (h2 - _2) * S2, r2[10] = (1 - (d2 + m2)) * S2, r2[11] = 0, r2[12] = e17.x, r2[13] = e17.y, r2[14] = e17.z, r2[15] = 1, this;
    }
    decompose(e17, t2, n2) {
      let r2 = this.elements, i2 = rn.set(r2[0], r2[1], r2[2]).length(), a2 = rn.set(r2[4], r2[5], r2[6]).length(), o2 = rn.set(r2[8], r2[9], r2[10]).length();
      this.determinant() < 0 && (i2 = -i2), e17.x = r2[12], e17.y = r2[13], e17.z = r2[14], an.copy(this);
      let s2 = 1 / i2, c2 = 1 / a2, l2 = 1 / o2;
      return an.elements[0] *= s2, an.elements[1] *= s2, an.elements[2] *= s2, an.elements[4] *= c2, an.elements[5] *= c2, an.elements[6] *= c2, an.elements[8] *= l2, an.elements[9] *= l2, an.elements[10] *= l2, t2.setFromRotationMatrix(an), n2.x = i2, n2.y = a2, n2.z = o2, this;
    }
    makePerspective(e17, t2, n2, r2, i2, a2, o2 = Ge, s2 = false) {
      let c2 = this.elements, l2 = 2 * i2 / (t2 - e17), u2 = 2 * i2 / (n2 - r2), d2 = (t2 + e17) / (t2 - e17), f2 = (n2 + r2) / (n2 - r2), p2, m2;
      if (s2) p2 = i2 / (a2 - i2), m2 = a2 * i2 / (a2 - i2);
      else if (o2 === 2e3) p2 = -(a2 + i2) / (a2 - i2), m2 = -2 * a2 * i2 / (a2 - i2);
      else if (o2 === 2001) p2 = -a2 / (a2 - i2), m2 = -a2 * i2 / (a2 - i2);
      else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: ` + o2);
      return c2[0] = l2, c2[4] = 0, c2[8] = d2, c2[12] = 0, c2[1] = 0, c2[5] = u2, c2[9] = f2, c2[13] = 0, c2[2] = 0, c2[6] = 0, c2[10] = p2, c2[14] = m2, c2[3] = 0, c2[7] = 0, c2[11] = -1, c2[15] = 0, this;
    }
    makeOrthographic(e17, t2, n2, r2, i2, a2, o2 = Ge, s2 = false) {
      let c2 = this.elements, l2 = 2 / (t2 - e17), u2 = 2 / (n2 - r2), d2 = -(t2 + e17) / (t2 - e17), f2 = -(n2 + r2) / (n2 - r2), p2, m2;
      if (s2) p2 = 1 / (a2 - i2), m2 = a2 / (a2 - i2);
      else if (o2 === 2e3) p2 = -2 / (a2 - i2), m2 = -(a2 + i2) / (a2 - i2);
      else if (o2 === 2001) p2 = -1 / (a2 - i2), m2 = -i2 / (a2 - i2);
      else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ` + o2);
      return c2[0] = l2, c2[4] = 0, c2[8] = 0, c2[12] = d2, c2[1] = 0, c2[5] = u2, c2[9] = 0, c2[13] = f2, c2[2] = 0, c2[6] = 0, c2[10] = p2, c2[14] = m2, c2[3] = 0, c2[7] = 0, c2[11] = 0, c2[15] = 1, this;
    }
    equals(e17) {
      let t2 = this.elements, n2 = e17.elements;
      for (let e18 = 0; e18 < 16; e18++) if (t2[e18] !== n2[e18]) return false;
      return true;
    }
    fromArray(e17, t2 = 0) {
      for (let n2 = 0; n2 < 16; n2++) this.elements[n2] = e17[n2 + t2];
      return this;
    }
    toArray(e17 = [], t2 = 0) {
      let n2 = this.elements;
      return e17[t2] = n2[0], e17[t2 + 1] = n2[1], e17[t2 + 2] = n2[2], e17[t2 + 3] = n2[3], e17[t2 + 4] = n2[4], e17[t2 + 5] = n2[5], e17[t2 + 6] = n2[6], e17[t2 + 7] = n2[7], e17[t2 + 8] = n2[8], e17[t2 + 9] = n2[9], e17[t2 + 10] = n2[10], e17[t2 + 11] = n2[11], e17[t2 + 12] = n2[12], e17[t2 + 13] = n2[13], e17[t2 + 14] = n2[14], e17[t2 + 15] = n2[15], e17;
    }
  };
  var rn = new W();
  var an = new nn();
  var on = new W(0, 0, 0);
  var sn = new W(1, 1, 1);
  var cn = new W();
  var ln = new W();
  var un = new W();
  var dn = new nn();
  var fn = new tt();
  var pn = class e8 {
    constructor(t2 = 0, n2 = 0, r2 = 0, i2 = e8.DEFAULT_ORDER) {
      this.isEuler = true, this._x = t2, this._y = n2, this._z = r2, this._order = i2;
    }
    get x() {
      return this._x;
    }
    set x(e17) {
      this._x = e17, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e17) {
      this._y = e17, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e17) {
      this._z = e17, this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(e17) {
      this._order = e17, this._onChangeCallback();
    }
    set(e17, t2, n2, r2 = this._order) {
      return this._x = e17, this._y = t2, this._z = n2, this._order = r2, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(e17) {
      return this._x = e17._x, this._y = e17._y, this._z = e17._z, this._order = e17._order, this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e17, t2 = this._order, n2 = true) {
      let r2 = e17.elements, i2 = r2[0], a2 = r2[4], o2 = r2[8], s2 = r2[1], c2 = r2[5], l2 = r2[9], u2 = r2[2], d2 = r2[6], f2 = r2[10];
      switch (t2) {
        case `XYZ`:
          this._y = Math.asin(H(o2, -1, 1)), Math.abs(o2) < 0.9999999 ? (this._x = Math.atan2(-l2, f2), this._z = Math.atan2(-a2, i2)) : (this._x = Math.atan2(d2, c2), this._z = 0);
          break;
        case `YXZ`:
          this._x = Math.asin(-H(l2, -1, 1)), Math.abs(l2) < 0.9999999 ? (this._y = Math.atan2(o2, f2), this._z = Math.atan2(s2, c2)) : (this._y = Math.atan2(-u2, i2), this._z = 0);
          break;
        case `ZXY`:
          this._x = Math.asin(H(d2, -1, 1)), Math.abs(d2) < 0.9999999 ? (this._y = Math.atan2(-u2, f2), this._z = Math.atan2(-a2, c2)) : (this._y = 0, this._z = Math.atan2(s2, i2));
          break;
        case `ZYX`:
          this._y = Math.asin(-H(u2, -1, 1)), Math.abs(u2) < 0.9999999 ? (this._x = Math.atan2(d2, f2), this._z = Math.atan2(s2, i2)) : (this._x = 0, this._z = Math.atan2(-a2, c2));
          break;
        case `YZX`:
          this._z = Math.asin(H(s2, -1, 1)), Math.abs(s2) < 0.9999999 ? (this._x = Math.atan2(-l2, c2), this._y = Math.atan2(-u2, i2)) : (this._x = 0, this._y = Math.atan2(o2, f2));
          break;
        case `XZY`:
          this._z = Math.asin(-H(a2, -1, 1)), Math.abs(a2) < 0.9999999 ? (this._x = Math.atan2(d2, c2), this._y = Math.atan2(o2, i2)) : (this._x = Math.atan2(-l2, f2), this._y = 0);
          break;
        default:
          console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ` + t2);
      }
      return this._order = t2, n2 === true && this._onChangeCallback(), this;
    }
    setFromQuaternion(e17, t2, n2) {
      return dn.makeRotationFromQuaternion(e17), this.setFromRotationMatrix(dn, t2, n2);
    }
    setFromVector3(e17, t2 = this._order) {
      return this.set(e17.x, e17.y, e17.z, t2);
    }
    reorder(e17) {
      return fn.setFromEuler(this), this.setFromQuaternion(fn, e17);
    }
    equals(e17) {
      return e17._x === this._x && e17._y === this._y && e17._z === this._z && e17._order === this._order;
    }
    fromArray(e17) {
      return this._x = e17[0], this._y = e17[1], this._z = e17[2], e17[3] !== void 0 && (this._order = e17[3]), this._onChangeCallback(), this;
    }
    toArray(e17 = [], t2 = 0) {
      return e17[t2] = this._x, e17[t2 + 1] = this._y, e17[t2 + 2] = this._z, e17[t2 + 3] = this._order, e17;
    }
    _onChange(e17) {
      return this._onChangeCallback = e17, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._order;
    }
  };
  pn.DEFAULT_ORDER = `XYZ`;
  var mn = class {
    constructor() {
      this.mask = 1;
    }
    set(e17) {
      this.mask = (1 << e17 | 0) >>> 0;
    }
    enable(e17) {
      this.mask |= 1 << e17 | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(e17) {
      this.mask ^= 1 << e17 | 0;
    }
    disable(e17) {
      this.mask &= ~(1 << e17 | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(e17) {
      return (this.mask & e17.mask) !== 0;
    }
    isEnabled(e17) {
      return (this.mask & (1 << e17 | 0)) != 0;
    }
  };
  var hn = 0;
  var gn = new W();
  var _n = new tt();
  var vn = new nn();
  var yn = new W();
  var bn = new W();
  var xn = new W();
  var Sn = new tt();
  var Cn = new W(1, 0, 0);
  var wn = new W(0, 1, 0);
  var Tn = new W(0, 0, 1);
  var En = { type: `added` };
  var Dn = { type: `removed` };
  var On = { type: `childadded`, child: null };
  var kn = { type: `childremoved`, child: null };
  var An = class e9 extends Ke {
    constructor() {
      super(), this.isObject3D = true, Object.defineProperty(this, "id", { value: hn++ }), this.uuid = Xe(), this.name = ``, this.type = `Object3D`, this.parent = null, this.children = [], this.up = e9.DEFAULT_UP.clone();
      let t2 = new W(), n2 = new pn(), r2 = new tt(), i2 = new W(1, 1, 1);
      function a2() {
        r2.setFromEuler(n2, false);
      }
      function o2() {
        n2.setFromQuaternion(r2, void 0, false);
      }
      n2._onChange(a2), r2._onChange(o2), Object.defineProperties(this, { position: { configurable: true, enumerable: true, value: t2 }, rotation: { configurable: true, enumerable: true, value: n2 }, quaternion: { configurable: true, enumerable: true, value: r2 }, scale: { configurable: true, enumerable: true, value: i2 }, modelViewMatrix: { value: new nn() }, normalMatrix: { value: new G() } }), this.matrix = new nn(), this.matrixWorld = new nn(), this.matrixAutoUpdate = e9.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = e9.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new mn(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(e17) {
      this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e17), this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(e17) {
      return this.quaternion.premultiply(e17), this;
    }
    setRotationFromAxisAngle(e17, t2) {
      this.quaternion.setFromAxisAngle(e17, t2);
    }
    setRotationFromEuler(e17) {
      this.quaternion.setFromEuler(e17, true);
    }
    setRotationFromMatrix(e17) {
      this.quaternion.setFromRotationMatrix(e17);
    }
    setRotationFromQuaternion(e17) {
      this.quaternion.copy(e17);
    }
    rotateOnAxis(e17, t2) {
      return _n.setFromAxisAngle(e17, t2), this.quaternion.multiply(_n), this;
    }
    rotateOnWorldAxis(e17, t2) {
      return _n.setFromAxisAngle(e17, t2), this.quaternion.premultiply(_n), this;
    }
    rotateX(e17) {
      return this.rotateOnAxis(Cn, e17);
    }
    rotateY(e17) {
      return this.rotateOnAxis(wn, e17);
    }
    rotateZ(e17) {
      return this.rotateOnAxis(Tn, e17);
    }
    translateOnAxis(e17, t2) {
      return gn.copy(e17).applyQuaternion(this.quaternion), this.position.add(gn.multiplyScalar(t2)), this;
    }
    translateX(e17) {
      return this.translateOnAxis(Cn, e17);
    }
    translateY(e17) {
      return this.translateOnAxis(wn, e17);
    }
    translateZ(e17) {
      return this.translateOnAxis(Tn, e17);
    }
    localToWorld(e17) {
      return this.updateWorldMatrix(true, false), e17.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(e17) {
      return this.updateWorldMatrix(true, false), e17.applyMatrix4(vn.copy(this.matrixWorld).invert());
    }
    lookAt(e17, t2, n2) {
      e17.isVector3 ? yn.copy(e17) : yn.set(e17, t2, n2);
      let r2 = this.parent;
      this.updateWorldMatrix(true, false), bn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? vn.lookAt(bn, yn, this.up) : vn.lookAt(yn, bn, this.up), this.quaternion.setFromRotationMatrix(vn), r2 && (vn.extractRotation(r2.matrixWorld), _n.setFromRotationMatrix(vn), this.quaternion.premultiply(_n.invert()));
    }
    add(e17) {
      if (arguments.length > 1) {
        for (let e18 = 0; e18 < arguments.length; e18++) this.add(arguments[e18]);
        return this;
      }
      return e17 === this ? (console.error(`THREE.Object3D.add: object can't be added as a child of itself.`, e17), this) : (e17 && e17.isObject3D ? (e17.removeFromParent(), e17.parent = this, this.children.push(e17), e17.dispatchEvent(En), On.child = e17, this.dispatchEvent(On), On.child = null) : console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`, e17), this);
    }
    remove(e17) {
      if (arguments.length > 1) {
        for (let e18 = 0; e18 < arguments.length; e18++) this.remove(arguments[e18]);
        return this;
      }
      let t2 = this.children.indexOf(e17);
      return t2 !== -1 && (e17.parent = null, this.children.splice(t2, 1), e17.dispatchEvent(Dn), kn.child = e17, this.dispatchEvent(kn), kn.child = null), this;
    }
    removeFromParent() {
      let e17 = this.parent;
      return e17 !== null && e17.remove(this), this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(e17) {
      return this.updateWorldMatrix(true, false), vn.copy(this.matrixWorld).invert(), e17.parent !== null && (e17.parent.updateWorldMatrix(true, false), vn.multiply(e17.parent.matrixWorld)), e17.applyMatrix4(vn), e17.removeFromParent(), e17.parent = this, this.children.push(e17), e17.updateWorldMatrix(false, true), e17.dispatchEvent(En), On.child = e17, this.dispatchEvent(On), On.child = null, this;
    }
    getObjectById(e17) {
      return this.getObjectByProperty(`id`, e17);
    }
    getObjectByName(e17) {
      return this.getObjectByProperty(`name`, e17);
    }
    getObjectByProperty(e17, t2) {
      if (this[e17] === t2) return this;
      for (let n2 = 0, r2 = this.children.length; n2 < r2; n2++) {
        let r3 = this.children[n2].getObjectByProperty(e17, t2);
        if (r3 !== void 0) return r3;
      }
    }
    getObjectsByProperty(e17, t2, n2 = []) {
      this[e17] === t2 && n2.push(this);
      let r2 = this.children;
      for (let i2 = 0, a2 = r2.length; i2 < a2; i2++) r2[i2].getObjectsByProperty(e17, t2, n2);
      return n2;
    }
    getWorldPosition(e17) {
      return this.updateWorldMatrix(true, false), e17.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(e17) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(bn, e17, xn), e17;
    }
    getWorldScale(e17) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(bn, Sn, e17), e17;
    }
    getWorldDirection(e17) {
      this.updateWorldMatrix(true, false);
      let t2 = this.matrixWorld.elements;
      return e17.set(t2[8], t2[9], t2[10]).normalize();
    }
    raycast() {
    }
    traverse(e17) {
      e17(this);
      let t2 = this.children;
      for (let n2 = 0, r2 = t2.length; n2 < r2; n2++) t2[n2].traverse(e17);
    }
    traverseVisible(e17) {
      if (this.visible === false) return;
      e17(this);
      let t2 = this.children;
      for (let n2 = 0, r2 = t2.length; n2 < r2; n2++) t2[n2].traverseVisible(e17);
    }
    traverseAncestors(e17) {
      let t2 = this.parent;
      t2 !== null && (e17(t2), t2.traverseAncestors(e17));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(e17) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e17) && (this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = false, e17 = true);
      let t2 = this.children;
      for (let n2 = 0, r2 = t2.length; n2 < r2; n2++) t2[n2].updateMatrixWorld(e17);
    }
    updateWorldMatrix(e17, t2) {
      let n2 = this.parent;
      if (e17 === true && n2 !== null && n2.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t2 === true) {
        let e18 = this.children;
        for (let t3 = 0, n3 = e18.length; t3 < n3; t3++) e18[t3].updateWorldMatrix(false, true);
      }
    }
    toJSON(e17) {
      let t2 = e17 === void 0 || typeof e17 == `string`, n2 = {};
      t2 && (e17 = { geometries: {}, materials: {}, textures: {}, images: {}, shapes: {}, skeletons: {}, animations: {}, nodes: {} }, n2.metadata = { version: 4.7, type: `Object`, generator: `Object3D.toJSON` });
      let r2 = {};
      r2.uuid = this.uuid, r2.type = this.type, this.name !== `` && (r2.name = this.name), this.castShadow === true && (r2.castShadow = true), this.receiveShadow === true && (r2.receiveShadow = true), this.visible === false && (r2.visible = false), this.frustumCulled === false && (r2.frustumCulled = false), this.renderOrder !== 0 && (r2.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (r2.userData = this.userData), r2.layers = this.layers.mask, r2.matrix = this.matrix.toArray(), r2.up = this.up.toArray(), this.matrixAutoUpdate === false && (r2.matrixAutoUpdate = false), this.isInstancedMesh && (r2.type = `InstancedMesh`, r2.count = this.count, r2.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r2.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r2.type = `BatchedMesh`, r2.perObjectFrustumCulled = this.perObjectFrustumCulled, r2.sortObjects = this.sortObjects, r2.drawRanges = this._drawRanges, r2.reservedRanges = this._reservedRanges, r2.geometryInfo = this._geometryInfo.map((e18) => ({ ...e18, boundingBox: e18.boundingBox ? e18.boundingBox.toJSON() : void 0, boundingSphere: e18.boundingSphere ? e18.boundingSphere.toJSON() : void 0 })), r2.instanceInfo = this._instanceInfo.map((e18) => ({ ...e18 })), r2.availableInstanceIds = this._availableInstanceIds.slice(), r2.availableGeometryIds = this._availableGeometryIds.slice(), r2.nextIndexStart = this._nextIndexStart, r2.nextVertexStart = this._nextVertexStart, r2.geometryCount = this._geometryCount, r2.maxInstanceCount = this._maxInstanceCount, r2.maxVertexCount = this._maxVertexCount, r2.maxIndexCount = this._maxIndexCount, r2.geometryInitialized = this._geometryInitialized, r2.matricesTexture = this._matricesTexture.toJSON(e17), r2.indirectTexture = this._indirectTexture.toJSON(e17), this._colorsTexture !== null && (r2.colorsTexture = this._colorsTexture.toJSON(e17)), this.boundingSphere !== null && (r2.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r2.boundingBox = this.boundingBox.toJSON()));
      function i2(t3, n3) {
        return t3[n3.uuid] === void 0 && (t3[n3.uuid] = n3.toJSON(e17)), n3.uuid;
      }
      if (this.isScene) this.background && (this.background.isColor ? r2.background = this.background.toJSON() : this.background.isTexture && (r2.background = this.background.toJSON(e17).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (r2.environment = this.environment.toJSON(e17).uuid);
      else if (this.isMesh || this.isLine || this.isPoints) {
        r2.geometry = i2(e17.geometries, this.geometry);
        let t3 = this.geometry.parameters;
        if (t3 !== void 0 && t3.shapes !== void 0) {
          let n3 = t3.shapes;
          if (Array.isArray(n3)) for (let t4 = 0, r3 = n3.length; t4 < r3; t4++) {
            let r4 = n3[t4];
            i2(e17.shapes, r4);
          }
          else i2(e17.shapes, n3);
        }
      }
      if (this.isSkinnedMesh && (r2.bindMode = this.bindMode, r2.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (i2(e17.skeletons, this.skeleton), r2.skeleton = this.skeleton.uuid)), this.material !== void 0) if (Array.isArray(this.material)) {
        let t3 = [];
        for (let n3 = 0, r3 = this.material.length; n3 < r3; n3++) t3.push(i2(e17.materials, this.material[n3]));
        r2.material = t3;
      } else r2.material = i2(e17.materials, this.material);
      if (this.children.length > 0) {
        r2.children = [];
        for (let t3 = 0; t3 < this.children.length; t3++) r2.children.push(this.children[t3].toJSON(e17).object);
      }
      if (this.animations.length > 0) {
        r2.animations = [];
        for (let t3 = 0; t3 < this.animations.length; t3++) {
          let n3 = this.animations[t3];
          r2.animations.push(i2(e17.animations, n3));
        }
      }
      if (t2) {
        let t3 = a2(e17.geometries), r3 = a2(e17.materials), i3 = a2(e17.textures), o2 = a2(e17.images), s2 = a2(e17.shapes), c2 = a2(e17.skeletons), l2 = a2(e17.animations), u2 = a2(e17.nodes);
        t3.length > 0 && (n2.geometries = t3), r3.length > 0 && (n2.materials = r3), i3.length > 0 && (n2.textures = i3), o2.length > 0 && (n2.images = o2), s2.length > 0 && (n2.shapes = s2), c2.length > 0 && (n2.skeletons = c2), l2.length > 0 && (n2.animations = l2), u2.length > 0 && (n2.nodes = u2);
      }
      return n2.object = r2, n2;
      function a2(e18) {
        let t3 = [];
        for (let n3 in e18) {
          let r3 = e18[n3];
          delete r3.metadata, t3.push(r3);
        }
        return t3;
      }
    }
    clone(e17) {
      return new this.constructor().copy(this, e17);
    }
    copy(e17, t2 = true) {
      if (this.name = e17.name, this.up.copy(e17.up), this.position.copy(e17.position), this.rotation.order = e17.rotation.order, this.quaternion.copy(e17.quaternion), this.scale.copy(e17.scale), this.matrix.copy(e17.matrix), this.matrixWorld.copy(e17.matrixWorld), this.matrixAutoUpdate = e17.matrixAutoUpdate, this.matrixWorldAutoUpdate = e17.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e17.matrixWorldNeedsUpdate, this.layers.mask = e17.layers.mask, this.visible = e17.visible, this.castShadow = e17.castShadow, this.receiveShadow = e17.receiveShadow, this.frustumCulled = e17.frustumCulled, this.renderOrder = e17.renderOrder, this.animations = e17.animations.slice(), this.userData = JSON.parse(JSON.stringify(e17.userData)), t2 === true) for (let t3 = 0; t3 < e17.children.length; t3++) {
        let n2 = e17.children[t3];
        this.add(n2.clone());
      }
      return this;
    }
  };
  An.DEFAULT_UP = new W(0, 1, 0), An.DEFAULT_MATRIX_AUTO_UPDATE = true, An.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
  var jn = new W();
  var Mn = new W();
  var Nn = new W();
  var Pn = new W();
  var Fn = new W();
  var In = new W();
  var Ln = new W();
  var Rn = new W();
  var zn = new W();
  var Bn = new W();
  var Vn = new wt();
  var Hn = new wt();
  var Un = new wt();
  var Wn = class e10 {
    constructor(e17 = new W(), t2 = new W(), n2 = new W()) {
      this.a = e17, this.b = t2, this.c = n2;
    }
    static getNormal(e17, t2, n2, r2) {
      r2.subVectors(n2, t2), jn.subVectors(e17, t2), r2.cross(jn);
      let i2 = r2.lengthSq();
      return i2 > 0 ? r2.multiplyScalar(1 / Math.sqrt(i2)) : r2.set(0, 0, 0);
    }
    static getBarycoord(e17, t2, n2, r2, i2) {
      jn.subVectors(r2, t2), Mn.subVectors(n2, t2), Nn.subVectors(e17, t2);
      let a2 = jn.dot(jn), o2 = jn.dot(Mn), s2 = jn.dot(Nn), c2 = Mn.dot(Mn), l2 = Mn.dot(Nn), u2 = a2 * c2 - o2 * o2;
      if (u2 === 0) return i2.set(0, 0, 0), null;
      let d2 = 1 / u2, f2 = (c2 * s2 - o2 * l2) * d2, p2 = (a2 * l2 - o2 * s2) * d2;
      return i2.set(1 - f2 - p2, p2, f2);
    }
    static containsPoint(e17, t2, n2, r2) {
      return this.getBarycoord(e17, t2, n2, r2, Pn) !== null && Pn.x >= 0 && Pn.y >= 0 && Pn.x + Pn.y <= 1;
    }
    static getInterpolation(e17, t2, n2, r2, i2, a2, o2, s2) {
      return this.getBarycoord(e17, t2, n2, r2, Pn) === null ? (s2.x = 0, s2.y = 0, `z` in s2 && (s2.z = 0), `w` in s2 && (s2.w = 0), null) : (s2.setScalar(0), s2.addScaledVector(i2, Pn.x), s2.addScaledVector(a2, Pn.y), s2.addScaledVector(o2, Pn.z), s2);
    }
    static getInterpolatedAttribute(e17, t2, n2, r2, i2, a2) {
      return Vn.setScalar(0), Hn.setScalar(0), Un.setScalar(0), Vn.fromBufferAttribute(e17, t2), Hn.fromBufferAttribute(e17, n2), Un.fromBufferAttribute(e17, r2), a2.setScalar(0), a2.addScaledVector(Vn, i2.x), a2.addScaledVector(Hn, i2.y), a2.addScaledVector(Un, i2.z), a2;
    }
    static isFrontFacing(e17, t2, n2, r2) {
      return jn.subVectors(n2, t2), Mn.subVectors(e17, t2), jn.cross(Mn).dot(r2) < 0;
    }
    set(e17, t2, n2) {
      return this.a.copy(e17), this.b.copy(t2), this.c.copy(n2), this;
    }
    setFromPointsAndIndices(e17, t2, n2, r2) {
      return this.a.copy(e17[t2]), this.b.copy(e17[n2]), this.c.copy(e17[r2]), this;
    }
    setFromAttributeAndIndices(e17, t2, n2, r2) {
      return this.a.fromBufferAttribute(e17, t2), this.b.fromBufferAttribute(e17, n2), this.c.fromBufferAttribute(e17, r2), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e17) {
      return this.a.copy(e17.a), this.b.copy(e17.b), this.c.copy(e17.c), this;
    }
    getArea() {
      return jn.subVectors(this.c, this.b), Mn.subVectors(this.a, this.b), jn.cross(Mn).length() * 0.5;
    }
    getMidpoint(e17) {
      return e17.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(t2) {
      return e10.getNormal(this.a, this.b, this.c, t2);
    }
    getPlane(e17) {
      return e17.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(t2, n2) {
      return e10.getBarycoord(t2, this.a, this.b, this.c, n2);
    }
    getInterpolation(t2, n2, r2, i2, a2) {
      return e10.getInterpolation(t2, this.a, this.b, this.c, n2, r2, i2, a2);
    }
    containsPoint(t2) {
      return e10.containsPoint(t2, this.a, this.b, this.c);
    }
    isFrontFacing(t2) {
      return e10.isFrontFacing(this.a, this.b, this.c, t2);
    }
    intersectsBox(e17) {
      return e17.intersectsTriangle(this);
    }
    closestPointToPoint(e17, t2) {
      let n2 = this.a, r2 = this.b, i2 = this.c, a2, o2;
      Fn.subVectors(r2, n2), In.subVectors(i2, n2), Rn.subVectors(e17, n2);
      let s2 = Fn.dot(Rn), c2 = In.dot(Rn);
      if (s2 <= 0 && c2 <= 0) return t2.copy(n2);
      zn.subVectors(e17, r2);
      let l2 = Fn.dot(zn), u2 = In.dot(zn);
      if (l2 >= 0 && u2 <= l2) return t2.copy(r2);
      let d2 = s2 * u2 - l2 * c2;
      if (d2 <= 0 && s2 >= 0 && l2 <= 0) return a2 = s2 / (s2 - l2), t2.copy(n2).addScaledVector(Fn, a2);
      Bn.subVectors(e17, i2);
      let f2 = Fn.dot(Bn), p2 = In.dot(Bn);
      if (p2 >= 0 && f2 <= p2) return t2.copy(i2);
      let m2 = f2 * c2 - s2 * p2;
      if (m2 <= 0 && c2 >= 0 && p2 <= 0) return o2 = c2 / (c2 - p2), t2.copy(n2).addScaledVector(In, o2);
      let h2 = l2 * p2 - f2 * u2;
      if (h2 <= 0 && u2 - l2 >= 0 && f2 - p2 >= 0) return Ln.subVectors(i2, r2), o2 = (u2 - l2) / (u2 - l2 + (f2 - p2)), t2.copy(r2).addScaledVector(Ln, o2);
      let g2 = 1 / (h2 + m2 + d2);
      return a2 = m2 * g2, o2 = d2 * g2, t2.copy(n2).addScaledVector(Fn, a2).addScaledVector(In, o2);
    }
    equals(e17) {
      return e17.a.equals(this.a) && e17.b.equals(this.b) && e17.c.equals(this.c);
    }
  };
  var Gn = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, rebeccapurple: 6697881, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 };
  var Kn = { h: 0, s: 0, l: 0 };
  var qn = { h: 0, s: 0, l: 0 };
  function Jn(e17, t2, n2) {
    return n2 < 0 && (n2 += 1), n2 > 1 && --n2, n2 < 1 / 6 ? e17 + (t2 - e17) * 6 * n2 : n2 < 1 / 2 ? t2 : n2 < 2 / 3 ? e17 + (t2 - e17) * 6 * (2 / 3 - n2) : e17;
  }
  var q = class {
    constructor(e17, t2, n2) {
      return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(e17, t2, n2);
    }
    set(e17, t2, n2) {
      if (t2 === void 0 && n2 === void 0) {
        let t3 = e17;
        t3 && t3.isColor ? this.copy(t3) : typeof t3 == `number` ? this.setHex(t3) : typeof t3 == `string` && this.setStyle(t3);
      } else this.setRGB(e17, t2, n2);
      return this;
    }
    setScalar(e17) {
      return this.r = e17, this.g = e17, this.b = e17, this;
    }
    setHex(e17, t2 = ze) {
      return e17 = Math.floor(e17), this.r = (e17 >> 16 & 255) / 255, this.g = (e17 >> 8 & 255) / 255, this.b = (e17 & 255) / 255, K.colorSpaceToWorking(this, t2), this;
    }
    setRGB(e17, t2, n2, r2 = K.workingColorSpace) {
      return this.r = e17, this.g = t2, this.b = n2, K.colorSpaceToWorking(this, r2), this;
    }
    setHSL(e17, t2, n2, r2 = K.workingColorSpace) {
      if (e17 = Ze(e17, 1), t2 = H(t2, 0, 1), n2 = H(n2, 0, 1), t2 === 0) this.r = this.g = this.b = n2;
      else {
        let r3 = n2 <= 0.5 ? n2 * (1 + t2) : n2 + t2 - n2 * t2, i2 = 2 * n2 - r3;
        this.r = Jn(i2, r3, e17 + 1 / 3), this.g = Jn(i2, r3, e17), this.b = Jn(i2, r3, e17 - 1 / 3);
      }
      return K.colorSpaceToWorking(this, r2), this;
    }
    setStyle(e17, t2 = ze) {
      function n2(t3) {
        t3 !== void 0 && parseFloat(t3) < 1 && console.warn(`THREE.Color: Alpha component of ` + e17 + ` will be ignored.`);
      }
      let r2;
      if (r2 = /^(\w+)\(([^\)]*)\)/.exec(e17)) {
        let i2, a2 = r2[1], o2 = r2[2];
        switch (a2) {
          case `rgb`:
          case `rgba`:
            if (i2 = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o2)) return n2(i2[4]), this.setRGB(Math.min(255, parseInt(i2[1], 10)) / 255, Math.min(255, parseInt(i2[2], 10)) / 255, Math.min(255, parseInt(i2[3], 10)) / 255, t2);
            if (i2 = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o2)) return n2(i2[4]), this.setRGB(Math.min(100, parseInt(i2[1], 10)) / 100, Math.min(100, parseInt(i2[2], 10)) / 100, Math.min(100, parseInt(i2[3], 10)) / 100, t2);
            break;
          case `hsl`:
          case `hsla`:
            if (i2 = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o2)) return n2(i2[4]), this.setHSL(parseFloat(i2[1]) / 360, parseFloat(i2[2]) / 100, parseFloat(i2[3]) / 100, t2);
            break;
          default:
            console.warn(`THREE.Color: Unknown color model ` + e17);
        }
      } else if (r2 = /^\#([A-Fa-f\d]+)$/.exec(e17)) {
        let n3 = r2[1], i2 = n3.length;
        if (i2 === 3) return this.setRGB(parseInt(n3.charAt(0), 16) / 15, parseInt(n3.charAt(1), 16) / 15, parseInt(n3.charAt(2), 16) / 15, t2);
        if (i2 === 6) return this.setHex(parseInt(n3, 16), t2);
        console.warn(`THREE.Color: Invalid hex color ` + e17);
      } else if (e17 && e17.length > 0) return this.setColorName(e17, t2);
      return this;
    }
    setColorName(e17, t2 = ze) {
      let n2 = Gn[e17.toLowerCase()];
      return n2 === void 0 ? console.warn(`THREE.Color: Unknown color ` + e17) : this.setHex(n2, t2), this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(e17) {
      return this.r = e17.r, this.g = e17.g, this.b = e17.b, this;
    }
    copySRGBToLinear(e17) {
      return this.r = mt(e17.r), this.g = mt(e17.g), this.b = mt(e17.b), this;
    }
    copyLinearToSRGB(e17) {
      return this.r = ht(e17.r), this.g = ht(e17.g), this.b = ht(e17.b), this;
    }
    convertSRGBToLinear() {
      return this.copySRGBToLinear(this), this;
    }
    convertLinearToSRGB() {
      return this.copyLinearToSRGB(this), this;
    }
    getHex(e17 = ze) {
      return K.workingToColorSpace(Yn.copy(this), e17), Math.round(H(Yn.r * 255, 0, 255)) * 65536 + Math.round(H(Yn.g * 255, 0, 255)) * 256 + Math.round(H(Yn.b * 255, 0, 255));
    }
    getHexString(e17 = ze) {
      return (`000000` + this.getHex(e17).toString(16)).slice(-6);
    }
    getHSL(e17, t2 = K.workingColorSpace) {
      K.workingToColorSpace(Yn.copy(this), t2);
      let n2 = Yn.r, r2 = Yn.g, i2 = Yn.b, a2 = Math.max(n2, r2, i2), o2 = Math.min(n2, r2, i2), s2, c2, l2 = (o2 + a2) / 2;
      if (o2 === a2) s2 = 0, c2 = 0;
      else {
        let e18 = a2 - o2;
        switch (c2 = l2 <= 0.5 ? e18 / (a2 + o2) : e18 / (2 - a2 - o2), a2) {
          case n2:
            s2 = (r2 - i2) / e18 + (r2 < i2 ? 6 : 0);
            break;
          case r2:
            s2 = (i2 - n2) / e18 + 2;
            break;
          case i2:
            s2 = (n2 - r2) / e18 + 4;
            break;
        }
        s2 /= 6;
      }
      return e17.h = s2, e17.s = c2, e17.l = l2, e17;
    }
    getRGB(e17, t2 = K.workingColorSpace) {
      return K.workingToColorSpace(Yn.copy(this), t2), e17.r = Yn.r, e17.g = Yn.g, e17.b = Yn.b, e17;
    }
    getStyle(e17 = ze) {
      K.workingToColorSpace(Yn.copy(this), e17);
      let t2 = Yn.r, n2 = Yn.g, r2 = Yn.b;
      return e17 === `srgb` ? `rgb(${Math.round(t2 * 255)},${Math.round(n2 * 255)},${Math.round(r2 * 255)})` : `color(${e17} ${t2.toFixed(3)} ${n2.toFixed(3)} ${r2.toFixed(3)})`;
    }
    offsetHSL(e17, t2, n2) {
      return this.getHSL(Kn), this.setHSL(Kn.h + e17, Kn.s + t2, Kn.l + n2);
    }
    add(e17) {
      return this.r += e17.r, this.g += e17.g, this.b += e17.b, this;
    }
    addColors(e17, t2) {
      return this.r = e17.r + t2.r, this.g = e17.g + t2.g, this.b = e17.b + t2.b, this;
    }
    addScalar(e17) {
      return this.r += e17, this.g += e17, this.b += e17, this;
    }
    sub(e17) {
      return this.r = Math.max(0, this.r - e17.r), this.g = Math.max(0, this.g - e17.g), this.b = Math.max(0, this.b - e17.b), this;
    }
    multiply(e17) {
      return this.r *= e17.r, this.g *= e17.g, this.b *= e17.b, this;
    }
    multiplyScalar(e17) {
      return this.r *= e17, this.g *= e17, this.b *= e17, this;
    }
    lerp(e17, t2) {
      return this.r += (e17.r - this.r) * t2, this.g += (e17.g - this.g) * t2, this.b += (e17.b - this.b) * t2, this;
    }
    lerpColors(e17, t2, n2) {
      return this.r = e17.r + (t2.r - e17.r) * n2, this.g = e17.g + (t2.g - e17.g) * n2, this.b = e17.b + (t2.b - e17.b) * n2, this;
    }
    lerpHSL(e17, t2) {
      this.getHSL(Kn), e17.getHSL(qn);
      let n2 = Qe(Kn.h, qn.h, t2), r2 = Qe(Kn.s, qn.s, t2), i2 = Qe(Kn.l, qn.l, t2);
      return this.setHSL(n2, r2, i2), this;
    }
    setFromVector3(e17) {
      return this.r = e17.x, this.g = e17.y, this.b = e17.z, this;
    }
    applyMatrix3(e17) {
      let t2 = this.r, n2 = this.g, r2 = this.b, i2 = e17.elements;
      return this.r = i2[0] * t2 + i2[3] * n2 + i2[6] * r2, this.g = i2[1] * t2 + i2[4] * n2 + i2[7] * r2, this.b = i2[2] * t2 + i2[5] * n2 + i2[8] * r2, this;
    }
    equals(e17) {
      return e17.r === this.r && e17.g === this.g && e17.b === this.b;
    }
    fromArray(e17, t2 = 0) {
      return this.r = e17[t2], this.g = e17[t2 + 1], this.b = e17[t2 + 2], this;
    }
    toArray(e17 = [], t2 = 0) {
      return e17[t2] = this.r, e17[t2 + 1] = this.g, e17[t2 + 2] = this.b, e17;
    }
    fromBufferAttribute(e17, t2) {
      return this.r = e17.getX(t2), this.g = e17.getY(t2), this.b = e17.getZ(t2), this;
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      yield this.r, yield this.g, yield this.b;
    }
  };
  var Yn = new q();
  q.NAMES = Gn;
  var Xn = 0;
  var Zn = class extends Ke {
    constructor() {
      super(), this.isMaterial = true, Object.defineProperty(this, "id", { value: Xn++ }), this.uuid = Xe(), this.name = ``, this.type = `Material`, this.blending = 1, this.side = 0, this.vertexColors = false, this.opacity = 1, this.transparent = false, this.alphaHash = false, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new q(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = true, this.depthWrite = true, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Ue, this.stencilZFail = Ue, this.stencilZPass = Ue, this.stencilWrite = false, this.clippingPlanes = null, this.clipIntersection = false, this.clipShadows = false, this.shadowSide = null, this.colorWrite = true, this.precision = null, this.polygonOffset = false, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = false, this.alphaToCoverage = false, this.premultipliedAlpha = false, this.forceSinglePass = false, this.allowOverride = true, this.visible = true, this.toneMapped = true, this.userData = {}, this.version = 0, this._alphaTest = 0;
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(e17) {
      this._alphaTest > 0 != e17 > 0 && this.version++, this._alphaTest = e17;
    }
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(e17) {
      if (e17 !== void 0) for (let t2 in e17) {
        let n2 = e17[t2];
        if (n2 === void 0) {
          console.warn(`THREE.Material: parameter '${t2}' has value of undefined.`);
          continue;
        }
        let r2 = this[t2];
        if (r2 === void 0) {
          console.warn(`THREE.Material: '${t2}' is not a property of THREE.${this.type}.`);
          continue;
        }
        r2 && r2.isColor ? r2.set(n2) : r2 && r2.isVector3 && n2 && n2.isVector3 ? r2.copy(n2) : this[t2] = n2;
      }
    }
    toJSON(e17) {
      let t2 = e17 === void 0 || typeof e17 == `string`;
      t2 && (e17 = { textures: {}, images: {} });
      let n2 = { metadata: { version: 4.7, type: `Material`, generator: `Material.toJSON` } };
      n2.uuid = this.uuid, n2.type = this.type, this.name !== `` && (n2.name = this.name), this.color && this.color.isColor && (n2.color = this.color.getHex()), this.roughness !== void 0 && (n2.roughness = this.roughness), this.metalness !== void 0 && (n2.metalness = this.metalness), this.sheen !== void 0 && (n2.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n2.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n2.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n2.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n2.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n2.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n2.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n2.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n2.shininess = this.shininess), this.clearcoat !== void 0 && (n2.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n2.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n2.clearcoatMap = this.clearcoatMap.toJSON(e17).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n2.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e17).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n2.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e17).uuid, n2.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n2.sheenColorMap = this.sheenColorMap.toJSON(e17).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n2.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e17).uuid), this.dispersion !== void 0 && (n2.dispersion = this.dispersion), this.iridescence !== void 0 && (n2.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n2.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n2.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n2.iridescenceMap = this.iridescenceMap.toJSON(e17).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n2.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e17).uuid), this.anisotropy !== void 0 && (n2.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n2.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n2.anisotropyMap = this.anisotropyMap.toJSON(e17).uuid), this.map && this.map.isTexture && (n2.map = this.map.toJSON(e17).uuid), this.matcap && this.matcap.isTexture && (n2.matcap = this.matcap.toJSON(e17).uuid), this.alphaMap && this.alphaMap.isTexture && (n2.alphaMap = this.alphaMap.toJSON(e17).uuid), this.lightMap && this.lightMap.isTexture && (n2.lightMap = this.lightMap.toJSON(e17).uuid, n2.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n2.aoMap = this.aoMap.toJSON(e17).uuid, n2.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n2.bumpMap = this.bumpMap.toJSON(e17).uuid, n2.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n2.normalMap = this.normalMap.toJSON(e17).uuid, n2.normalMapType = this.normalMapType, n2.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n2.displacementMap = this.displacementMap.toJSON(e17).uuid, n2.displacementScale = this.displacementScale, n2.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n2.roughnessMap = this.roughnessMap.toJSON(e17).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n2.metalnessMap = this.metalnessMap.toJSON(e17).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n2.emissiveMap = this.emissiveMap.toJSON(e17).uuid), this.specularMap && this.specularMap.isTexture && (n2.specularMap = this.specularMap.toJSON(e17).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n2.specularIntensityMap = this.specularIntensityMap.toJSON(e17).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n2.specularColorMap = this.specularColorMap.toJSON(e17).uuid), this.envMap && this.envMap.isTexture && (n2.envMap = this.envMap.toJSON(e17).uuid, this.combine !== void 0 && (n2.combine = this.combine)), this.envMapRotation !== void 0 && (n2.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n2.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n2.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n2.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n2.gradientMap = this.gradientMap.toJSON(e17).uuid), this.transmission !== void 0 && (n2.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n2.transmissionMap = this.transmissionMap.toJSON(e17).uuid), this.thickness !== void 0 && (n2.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n2.thicknessMap = this.thicknessMap.toJSON(e17).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n2.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n2.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n2.size = this.size), this.shadowSide !== null && (n2.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n2.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (n2.blending = this.blending), this.side !== 0 && (n2.side = this.side), this.vertexColors === true && (n2.vertexColors = true), this.opacity < 1 && (n2.opacity = this.opacity), this.transparent === true && (n2.transparent = true), this.blendSrc !== 204 && (n2.blendSrc = this.blendSrc), this.blendDst !== 205 && (n2.blendDst = this.blendDst), this.blendEquation !== 100 && (n2.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n2.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n2.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n2.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n2.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n2.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (n2.depthFunc = this.depthFunc), this.depthTest === false && (n2.depthTest = this.depthTest), this.depthWrite === false && (n2.depthWrite = this.depthWrite), this.colorWrite === false && (n2.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n2.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (n2.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n2.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n2.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (n2.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (n2.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (n2.stencilZPass = this.stencilZPass), this.stencilWrite === true && (n2.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n2.rotation = this.rotation), this.polygonOffset === true && (n2.polygonOffset = true), this.polygonOffsetFactor !== 0 && (n2.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n2.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n2.linewidth = this.linewidth), this.dashSize !== void 0 && (n2.dashSize = this.dashSize), this.gapSize !== void 0 && (n2.gapSize = this.gapSize), this.scale !== void 0 && (n2.scale = this.scale), this.dithering === true && (n2.dithering = true), this.alphaTest > 0 && (n2.alphaTest = this.alphaTest), this.alphaHash === true && (n2.alphaHash = true), this.alphaToCoverage === true && (n2.alphaToCoverage = true), this.premultipliedAlpha === true && (n2.premultipliedAlpha = true), this.forceSinglePass === true && (n2.forceSinglePass = true), this.wireframe === true && (n2.wireframe = true), this.wireframeLinewidth > 1 && (n2.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== `round` && (n2.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== `round` && (n2.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === true && (n2.flatShading = true), this.visible === false && (n2.visible = false), this.toneMapped === false && (n2.toneMapped = false), this.fog === false && (n2.fog = false), Object.keys(this.userData).length > 0 && (n2.userData = this.userData);
      function r2(e18) {
        let t3 = [];
        for (let n3 in e18) {
          let r3 = e18[n3];
          delete r3.metadata, t3.push(r3);
        }
        return t3;
      }
      if (t2) {
        let t3 = r2(e17.textures), i2 = r2(e17.images);
        t3.length > 0 && (n2.textures = t3), i2.length > 0 && (n2.images = i2);
      }
      return n2;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e17) {
      this.name = e17.name, this.blending = e17.blending, this.side = e17.side, this.vertexColors = e17.vertexColors, this.opacity = e17.opacity, this.transparent = e17.transparent, this.blendSrc = e17.blendSrc, this.blendDst = e17.blendDst, this.blendEquation = e17.blendEquation, this.blendSrcAlpha = e17.blendSrcAlpha, this.blendDstAlpha = e17.blendDstAlpha, this.blendEquationAlpha = e17.blendEquationAlpha, this.blendColor.copy(e17.blendColor), this.blendAlpha = e17.blendAlpha, this.depthFunc = e17.depthFunc, this.depthTest = e17.depthTest, this.depthWrite = e17.depthWrite, this.stencilWriteMask = e17.stencilWriteMask, this.stencilFunc = e17.stencilFunc, this.stencilRef = e17.stencilRef, this.stencilFuncMask = e17.stencilFuncMask, this.stencilFail = e17.stencilFail, this.stencilZFail = e17.stencilZFail, this.stencilZPass = e17.stencilZPass, this.stencilWrite = e17.stencilWrite;
      let t2 = e17.clippingPlanes, n2 = null;
      if (t2 !== null) {
        let e18 = t2.length;
        n2 = Array(e18);
        for (let r2 = 0; r2 !== e18; ++r2) n2[r2] = t2[r2].clone();
      }
      return this.clippingPlanes = n2, this.clipIntersection = e17.clipIntersection, this.clipShadows = e17.clipShadows, this.shadowSide = e17.shadowSide, this.colorWrite = e17.colorWrite, this.precision = e17.precision, this.polygonOffset = e17.polygonOffset, this.polygonOffsetFactor = e17.polygonOffsetFactor, this.polygonOffsetUnits = e17.polygonOffsetUnits, this.dithering = e17.dithering, this.alphaTest = e17.alphaTest, this.alphaHash = e17.alphaHash, this.alphaToCoverage = e17.alphaToCoverage, this.premultipliedAlpha = e17.premultipliedAlpha, this.forceSinglePass = e17.forceSinglePass, this.visible = e17.visible, this.toneMapped = e17.toneMapped, this.userData = JSON.parse(JSON.stringify(e17.userData)), this;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
    set needsUpdate(e17) {
      e17 === true && this.version++;
    }
  };
  var Qn = class extends Zn {
    constructor(e17) {
      super(), this.isMeshBasicMaterial = true, this.type = `MeshBasicMaterial`, this.color = new q(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new pn(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = `round`, this.wireframeLinejoin = `round`, this.fog = true, this.setValues(e17);
    }
    copy(e17) {
      return super.copy(e17), this.color.copy(e17.color), this.map = e17.map, this.lightMap = e17.lightMap, this.lightMapIntensity = e17.lightMapIntensity, this.aoMap = e17.aoMap, this.aoMapIntensity = e17.aoMapIntensity, this.specularMap = e17.specularMap, this.alphaMap = e17.alphaMap, this.envMap = e17.envMap, this.envMapRotation.copy(e17.envMapRotation), this.combine = e17.combine, this.reflectivity = e17.reflectivity, this.refractionRatio = e17.refractionRatio, this.wireframe = e17.wireframe, this.wireframeLinewidth = e17.wireframeLinewidth, this.wireframeLinecap = e17.wireframeLinecap, this.wireframeLinejoin = e17.wireframeLinejoin, this.fog = e17.fog, this;
    }
  };
  var $n = new W();
  var er = new U();
  var tr = 0;
  var nr = class {
    constructor(e17, t2, n2 = false) {
      if (Array.isArray(e17)) throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);
      this.isBufferAttribute = true, Object.defineProperty(this, "id", { value: tr++ }), this.name = ``, this.array = e17, this.itemSize = t2, this.count = e17 === void 0 ? 0 : e17.length / t2, this.normalized = n2, this.usage = We, this.updateRanges = [], this.gpuType = w, this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(e17) {
      e17 === true && this.version++;
    }
    setUsage(e17) {
      return this.usage = e17, this;
    }
    addUpdateRange(e17, t2) {
      this.updateRanges.push({ start: e17, count: t2 });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e17) {
      return this.name = e17.name, this.array = new e17.array.constructor(e17.array), this.itemSize = e17.itemSize, this.count = e17.count, this.normalized = e17.normalized, this.usage = e17.usage, this.gpuType = e17.gpuType, this;
    }
    copyAt(e17, t2, n2) {
      e17 *= this.itemSize, n2 *= t2.itemSize;
      for (let r2 = 0, i2 = this.itemSize; r2 < i2; r2++) this.array[e17 + r2] = t2.array[n2 + r2];
      return this;
    }
    copyArray(e17) {
      return this.array.set(e17), this;
    }
    applyMatrix3(e17) {
      if (this.itemSize === 2) for (let t2 = 0, n2 = this.count; t2 < n2; t2++) er.fromBufferAttribute(this, t2), er.applyMatrix3(e17), this.setXY(t2, er.x, er.y);
      else if (this.itemSize === 3) for (let t2 = 0, n2 = this.count; t2 < n2; t2++) $n.fromBufferAttribute(this, t2), $n.applyMatrix3(e17), this.setXYZ(t2, $n.x, $n.y, $n.z);
      return this;
    }
    applyMatrix4(e17) {
      for (let t2 = 0, n2 = this.count; t2 < n2; t2++) $n.fromBufferAttribute(this, t2), $n.applyMatrix4(e17), this.setXYZ(t2, $n.x, $n.y, $n.z);
      return this;
    }
    applyNormalMatrix(e17) {
      for (let t2 = 0, n2 = this.count; t2 < n2; t2++) $n.fromBufferAttribute(this, t2), $n.applyNormalMatrix(e17), this.setXYZ(t2, $n.x, $n.y, $n.z);
      return this;
    }
    transformDirection(e17) {
      for (let t2 = 0, n2 = this.count; t2 < n2; t2++) $n.fromBufferAttribute(this, t2), $n.transformDirection(e17), this.setXYZ(t2, $n.x, $n.y, $n.z);
      return this;
    }
    set(e17, t2 = 0) {
      return this.array.set(e17, t2), this;
    }
    getComponent(e17, t2) {
      let n2 = this.array[e17 * this.itemSize + t2];
      return this.normalized && (n2 = $e(n2, this.array)), n2;
    }
    setComponent(e17, t2, n2) {
      return this.normalized && (n2 = et(n2, this.array)), this.array[e17 * this.itemSize + t2] = n2, this;
    }
    getX(e17) {
      let t2 = this.array[e17 * this.itemSize];
      return this.normalized && (t2 = $e(t2, this.array)), t2;
    }
    setX(e17, t2) {
      return this.normalized && (t2 = et(t2, this.array)), this.array[e17 * this.itemSize] = t2, this;
    }
    getY(e17) {
      let t2 = this.array[e17 * this.itemSize + 1];
      return this.normalized && (t2 = $e(t2, this.array)), t2;
    }
    setY(e17, t2) {
      return this.normalized && (t2 = et(t2, this.array)), this.array[e17 * this.itemSize + 1] = t2, this;
    }
    getZ(e17) {
      let t2 = this.array[e17 * this.itemSize + 2];
      return this.normalized && (t2 = $e(t2, this.array)), t2;
    }
    setZ(e17, t2) {
      return this.normalized && (t2 = et(t2, this.array)), this.array[e17 * this.itemSize + 2] = t2, this;
    }
    getW(e17) {
      let t2 = this.array[e17 * this.itemSize + 3];
      return this.normalized && (t2 = $e(t2, this.array)), t2;
    }
    setW(e17, t2) {
      return this.normalized && (t2 = et(t2, this.array)), this.array[e17 * this.itemSize + 3] = t2, this;
    }
    setXY(e17, t2, n2) {
      return e17 *= this.itemSize, this.normalized && (t2 = et(t2, this.array), n2 = et(n2, this.array)), this.array[e17 + 0] = t2, this.array[e17 + 1] = n2, this;
    }
    setXYZ(e17, t2, n2, r2) {
      return e17 *= this.itemSize, this.normalized && (t2 = et(t2, this.array), n2 = et(n2, this.array), r2 = et(r2, this.array)), this.array[e17 + 0] = t2, this.array[e17 + 1] = n2, this.array[e17 + 2] = r2, this;
    }
    setXYZW(e17, t2, n2, r2, i2) {
      return e17 *= this.itemSize, this.normalized && (t2 = et(t2, this.array), n2 = et(n2, this.array), r2 = et(r2, this.array), i2 = et(i2, this.array)), this.array[e17 + 0] = t2, this.array[e17 + 1] = n2, this.array[e17 + 2] = r2, this.array[e17 + 3] = i2, this;
    }
    onUpload(e17) {
      return this.onUploadCallback = e17, this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      let e17 = { itemSize: this.itemSize, type: this.array.constructor.name, array: Array.from(this.array), normalized: this.normalized };
      return this.name !== `` && (e17.name = this.name), this.usage !== 35044 && (e17.usage = this.usage), e17;
    }
  };
  var rr = class extends nr {
    constructor(e17, t2, n2) {
      super(new Uint16Array(e17), t2, n2);
    }
  };
  var ir = class extends nr {
    constructor(e17, t2, n2) {
      super(new Uint32Array(e17), t2, n2);
    }
  };
  var ar = class extends nr {
    constructor(e17, t2, n2) {
      super(new Float32Array(e17), t2, n2);
    }
  };
  var or = 0;
  var sr = new nn();
  var cr = new An();
  var lr = new W();
  var ur = new kt();
  var dr = new kt();
  var fr = new W();
  var pr = class e11 extends Ke {
    constructor() {
      super(), this.isBufferGeometry = true, Object.defineProperty(this, "id", { value: or++ }), this.uuid = Xe(), this.name = ``, this.type = `BufferGeometry`, this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = false, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
    }
    getIndex() {
      return this.index;
    }
    setIndex(e17) {
      return Array.isArray(e17) ? this.index = new (at(e17) ? ir : rr)(e17, 1) : this.index = e17, this;
    }
    setIndirect(e17) {
      return this.indirect = e17, this;
    }
    getIndirect() {
      return this.indirect;
    }
    getAttribute(e17) {
      return this.attributes[e17];
    }
    setAttribute(e17, t2) {
      return this.attributes[e17] = t2, this;
    }
    deleteAttribute(e17) {
      return delete this.attributes[e17], this;
    }
    hasAttribute(e17) {
      return this.attributes[e17] !== void 0;
    }
    addGroup(e17, t2, n2 = 0) {
      this.groups.push({ start: e17, count: t2, materialIndex: n2 });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(e17, t2) {
      this.drawRange.start = e17, this.drawRange.count = t2;
    }
    applyMatrix4(e17) {
      let t2 = this.attributes.position;
      t2 !== void 0 && (t2.applyMatrix4(e17), t2.needsUpdate = true);
      let n2 = this.attributes.normal;
      if (n2 !== void 0) {
        let t3 = new G().getNormalMatrix(e17);
        n2.applyNormalMatrix(t3), n2.needsUpdate = true;
      }
      let r2 = this.attributes.tangent;
      return r2 !== void 0 && (r2.transformDirection(e17), r2.needsUpdate = true), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
    }
    applyQuaternion(e17) {
      return sr.makeRotationFromQuaternion(e17), this.applyMatrix4(sr), this;
    }
    rotateX(e17) {
      return sr.makeRotationX(e17), this.applyMatrix4(sr), this;
    }
    rotateY(e17) {
      return sr.makeRotationY(e17), this.applyMatrix4(sr), this;
    }
    rotateZ(e17) {
      return sr.makeRotationZ(e17), this.applyMatrix4(sr), this;
    }
    translate(e17, t2, n2) {
      return sr.makeTranslation(e17, t2, n2), this.applyMatrix4(sr), this;
    }
    scale(e17, t2, n2) {
      return sr.makeScale(e17, t2, n2), this.applyMatrix4(sr), this;
    }
    lookAt(e17) {
      return cr.lookAt(e17), cr.updateMatrix(), this.applyMatrix4(cr.matrix), this;
    }
    center() {
      return this.computeBoundingBox(), this.boundingBox.getCenter(lr).negate(), this.translate(lr.x, lr.y, lr.z), this;
    }
    setFromPoints(e17) {
      let t2 = this.getAttribute(`position`);
      if (t2 === void 0) {
        let t3 = [];
        for (let n2 = 0, r2 = e17.length; n2 < r2; n2++) {
          let r3 = e17[n2];
          t3.push(r3.x, r3.y, r3.z || 0);
        }
        this.setAttribute(`position`, new ar(t3, 3));
      } else {
        let n2 = Math.min(e17.length, t2.count);
        for (let r2 = 0; r2 < n2; r2++) {
          let n3 = e17[r2];
          t2.setXYZ(r2, n3.x, n3.y, n3.z || 0);
        }
        e17.length > t2.count && console.warn(`THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`), t2.needsUpdate = true;
      }
      return this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new kt());
      let e17 = this.attributes.position, t2 = this.morphAttributes.position;
      if (e17 && e17.isGLBufferAttribute) {
        console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`, this), this.boundingBox.set(new W(-1 / 0, -1 / 0, -1 / 0), new W(1 / 0, 1 / 0, 1 / 0));
        return;
      }
      if (e17 !== void 0) {
        if (this.boundingBox.setFromBufferAttribute(e17), t2) for (let e18 = 0, n2 = t2.length; e18 < n2; e18++) {
          let n3 = t2[e18];
          ur.setFromBufferAttribute(n3), this.morphTargetsRelative ? (fr.addVectors(this.boundingBox.min, ur.min), this.boundingBox.expandByPoint(fr), fr.addVectors(this.boundingBox.max, ur.max), this.boundingBox.expandByPoint(fr)) : (this.boundingBox.expandByPoint(ur.min), this.boundingBox.expandByPoint(ur.max));
        }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`, this);
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new qt());
      let e17 = this.attributes.position, t2 = this.morphAttributes.position;
      if (e17 && e17.isGLBufferAttribute) {
        console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`, this), this.boundingSphere.set(new W(), 1 / 0);
        return;
      }
      if (e17) {
        let n2 = this.boundingSphere.center;
        if (ur.setFromBufferAttribute(e17), t2) for (let e18 = 0, n3 = t2.length; e18 < n3; e18++) {
          let n4 = t2[e18];
          dr.setFromBufferAttribute(n4), this.morphTargetsRelative ? (fr.addVectors(ur.min, dr.min), ur.expandByPoint(fr), fr.addVectors(ur.max, dr.max), ur.expandByPoint(fr)) : (ur.expandByPoint(dr.min), ur.expandByPoint(dr.max));
        }
        ur.getCenter(n2);
        let r2 = 0;
        for (let t3 = 0, i2 = e17.count; t3 < i2; t3++) fr.fromBufferAttribute(e17, t3), r2 = Math.max(r2, n2.distanceToSquared(fr));
        if (t2) for (let i2 = 0, a2 = t2.length; i2 < a2; i2++) {
          let a3 = t2[i2], o2 = this.morphTargetsRelative;
          for (let t3 = 0, i3 = a3.count; t3 < i3; t3++) fr.fromBufferAttribute(a3, t3), o2 && (lr.fromBufferAttribute(e17, t3), fr.add(lr)), r2 = Math.max(r2, n2.distanceToSquared(fr));
        }
        this.boundingSphere.radius = Math.sqrt(r2), isNaN(this.boundingSphere.radius) && console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`, this);
      }
    }
    computeTangents() {
      let e17 = this.index, t2 = this.attributes;
      if (e17 === null || t2.position === void 0 || t2.normal === void 0 || t2.uv === void 0) {
        console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);
        return;
      }
      let n2 = t2.position, r2 = t2.normal, i2 = t2.uv;
      this.hasAttribute(`tangent`) === false && this.setAttribute(`tangent`, new nr(new Float32Array(4 * n2.count), 4));
      let a2 = this.getAttribute(`tangent`), o2 = [], s2 = [];
      for (let e18 = 0; e18 < n2.count; e18++) o2[e18] = new W(), s2[e18] = new W();
      let c2 = new W(), l2 = new W(), u2 = new W(), d2 = new U(), f2 = new U(), p2 = new U(), m2 = new W(), h2 = new W();
      function g2(e18, t3, r3) {
        c2.fromBufferAttribute(n2, e18), l2.fromBufferAttribute(n2, t3), u2.fromBufferAttribute(n2, r3), d2.fromBufferAttribute(i2, e18), f2.fromBufferAttribute(i2, t3), p2.fromBufferAttribute(i2, r3), l2.sub(c2), u2.sub(c2), f2.sub(d2), p2.sub(d2);
        let a3 = 1 / (f2.x * p2.y - p2.x * f2.y);
        isFinite(a3) && (m2.copy(l2).multiplyScalar(p2.y).addScaledVector(u2, -f2.y).multiplyScalar(a3), h2.copy(u2).multiplyScalar(f2.x).addScaledVector(l2, -p2.x).multiplyScalar(a3), o2[e18].add(m2), o2[t3].add(m2), o2[r3].add(m2), s2[e18].add(h2), s2[t3].add(h2), s2[r3].add(h2));
      }
      let _2 = this.groups;
      _2.length === 0 && (_2 = [{ start: 0, count: e17.count }]);
      for (let t3 = 0, n3 = _2.length; t3 < n3; ++t3) {
        let n4 = _2[t3], r3 = n4.start, i3 = n4.count;
        for (let t4 = r3, n5 = r3 + i3; t4 < n5; t4 += 3) g2(e17.getX(t4 + 0), e17.getX(t4 + 1), e17.getX(t4 + 2));
      }
      let v2 = new W(), y2 = new W(), b2 = new W(), x2 = new W();
      function S2(e18) {
        b2.fromBufferAttribute(r2, e18), x2.copy(b2);
        let t3 = o2[e18];
        v2.copy(t3), v2.sub(b2.multiplyScalar(b2.dot(t3))).normalize(), y2.crossVectors(x2, t3);
        let n3 = y2.dot(s2[e18]) < 0 ? -1 : 1;
        a2.setXYZW(e18, v2.x, v2.y, v2.z, n3);
      }
      for (let t3 = 0, n3 = _2.length; t3 < n3; ++t3) {
        let n4 = _2[t3], r3 = n4.start, i3 = n4.count;
        for (let t4 = r3, n5 = r3 + i3; t4 < n5; t4 += 3) S2(e17.getX(t4 + 0)), S2(e17.getX(t4 + 1)), S2(e17.getX(t4 + 2));
      }
    }
    computeVertexNormals() {
      let e17 = this.index, t2 = this.getAttribute(`position`);
      if (t2 !== void 0) {
        let n2 = this.getAttribute(`normal`);
        if (n2 === void 0) n2 = new nr(new Float32Array(t2.count * 3), 3), this.setAttribute(`normal`, n2);
        else for (let e18 = 0, t3 = n2.count; e18 < t3; e18++) n2.setXYZ(e18, 0, 0, 0);
        let r2 = new W(), i2 = new W(), a2 = new W(), o2 = new W(), s2 = new W(), c2 = new W(), l2 = new W(), u2 = new W();
        if (e17) for (let d2 = 0, f2 = e17.count; d2 < f2; d2 += 3) {
          let f3 = e17.getX(d2 + 0), p2 = e17.getX(d2 + 1), m2 = e17.getX(d2 + 2);
          r2.fromBufferAttribute(t2, f3), i2.fromBufferAttribute(t2, p2), a2.fromBufferAttribute(t2, m2), l2.subVectors(a2, i2), u2.subVectors(r2, i2), l2.cross(u2), o2.fromBufferAttribute(n2, f3), s2.fromBufferAttribute(n2, p2), c2.fromBufferAttribute(n2, m2), o2.add(l2), s2.add(l2), c2.add(l2), n2.setXYZ(f3, o2.x, o2.y, o2.z), n2.setXYZ(p2, s2.x, s2.y, s2.z), n2.setXYZ(m2, c2.x, c2.y, c2.z);
        }
        else for (let e18 = 0, o3 = t2.count; e18 < o3; e18 += 3) r2.fromBufferAttribute(t2, e18 + 0), i2.fromBufferAttribute(t2, e18 + 1), a2.fromBufferAttribute(t2, e18 + 2), l2.subVectors(a2, i2), u2.subVectors(r2, i2), l2.cross(u2), n2.setXYZ(e18 + 0, l2.x, l2.y, l2.z), n2.setXYZ(e18 + 1, l2.x, l2.y, l2.z), n2.setXYZ(e18 + 2, l2.x, l2.y, l2.z);
        this.normalizeNormals(), n2.needsUpdate = true;
      }
    }
    normalizeNormals() {
      let e17 = this.attributes.normal;
      for (let t2 = 0, n2 = e17.count; t2 < n2; t2++) fr.fromBufferAttribute(e17, t2), fr.normalize(), e17.setXYZ(t2, fr.x, fr.y, fr.z);
    }
    toNonIndexed() {
      function t2(e17, t3) {
        let n3 = e17.array, r3 = e17.itemSize, i3 = e17.normalized, a3 = new n3.constructor(t3.length * r3), o3 = 0, s2 = 0;
        for (let i4 = 0, c2 = t3.length; i4 < c2; i4++) {
          o3 = e17.isInterleavedBufferAttribute ? t3[i4] * e17.data.stride + e17.offset : t3[i4] * r3;
          for (let e18 = 0; e18 < r3; e18++) a3[s2++] = n3[o3++];
        }
        return new nr(a3, r3, i3);
      }
      if (this.index === null) return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`), this;
      let n2 = new e11(), r2 = this.index.array, i2 = this.attributes;
      for (let e17 in i2) {
        let a3 = i2[e17], o3 = t2(a3, r2);
        n2.setAttribute(e17, o3);
      }
      let a2 = this.morphAttributes;
      for (let e17 in a2) {
        let i3 = [], o3 = a2[e17];
        for (let e18 = 0, n3 = o3.length; e18 < n3; e18++) {
          let n4 = o3[e18], a3 = t2(n4, r2);
          i3.push(a3);
        }
        n2.morphAttributes[e17] = i3;
      }
      n2.morphTargetsRelative = this.morphTargetsRelative;
      let o2 = this.groups;
      for (let e17 = 0, t3 = o2.length; e17 < t3; e17++) {
        let t4 = o2[e17];
        n2.addGroup(t4.start, t4.count, t4.materialIndex);
      }
      return n2;
    }
    toJSON() {
      let e17 = { metadata: { version: 4.7, type: `BufferGeometry`, generator: `BufferGeometry.toJSON` } };
      if (e17.uuid = this.uuid, e17.type = this.type, this.name !== `` && (e17.name = this.name), Object.keys(this.userData).length > 0 && (e17.userData = this.userData), this.parameters !== void 0) {
        let t3 = this.parameters;
        for (let n3 in t3) t3[n3] !== void 0 && (e17[n3] = t3[n3]);
        return e17;
      }
      e17.data = { attributes: {} };
      let t2 = this.index;
      t2 !== null && (e17.data.index = { type: t2.array.constructor.name, array: Array.prototype.slice.call(t2.array) });
      let n2 = this.attributes;
      for (let t3 in n2) {
        let r3 = n2[t3];
        e17.data.attributes[t3] = r3.toJSON(e17.data);
      }
      let r2 = {}, i2 = false;
      for (let t3 in this.morphAttributes) {
        let n3 = this.morphAttributes[t3], a3 = [];
        for (let t4 = 0, r3 = n3.length; t4 < r3; t4++) {
          let r4 = n3[t4];
          a3.push(r4.toJSON(e17.data));
        }
        a3.length > 0 && (r2[t3] = a3, i2 = true);
      }
      i2 && (e17.data.morphAttributes = r2, e17.data.morphTargetsRelative = this.morphTargetsRelative);
      let a2 = this.groups;
      a2.length > 0 && (e17.data.groups = JSON.parse(JSON.stringify(a2)));
      let o2 = this.boundingSphere;
      return o2 !== null && (e17.data.boundingSphere = o2.toJSON()), e17;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e17) {
      this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
      let t2 = {};
      this.name = e17.name;
      let n2 = e17.index;
      n2 !== null && this.setIndex(n2.clone());
      let r2 = e17.attributes;
      for (let e18 in r2) {
        let n3 = r2[e18];
        this.setAttribute(e18, n3.clone(t2));
      }
      let i2 = e17.morphAttributes;
      for (let e18 in i2) {
        let n3 = [], r3 = i2[e18];
        for (let e19 = 0, i3 = r3.length; e19 < i3; e19++) n3.push(r3[e19].clone(t2));
        this.morphAttributes[e18] = n3;
      }
      this.morphTargetsRelative = e17.morphTargetsRelative;
      let a2 = e17.groups;
      for (let e18 = 0, t3 = a2.length; e18 < t3; e18++) {
        let t4 = a2[e18];
        this.addGroup(t4.start, t4.count, t4.materialIndex);
      }
      let o2 = e17.boundingBox;
      o2 !== null && (this.boundingBox = o2.clone());
      let s2 = e17.boundingSphere;
      return s2 !== null && (this.boundingSphere = s2.clone()), this.drawRange.start = e17.drawRange.start, this.drawRange.count = e17.drawRange.count, this.userData = e17.userData, this;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
  };
  var mr = new nn();
  var hr = new tn();
  var gr = new qt();
  var _r = new W();
  var vr = new W();
  var yr = new W();
  var br = new W();
  var xr = new W();
  var Sr = new W();
  var Cr = new W();
  var wr = new W();
  var Tr = class extends An {
    constructor(e17 = new pr(), t2 = new Qn()) {
      super(), this.isMesh = true, this.type = `Mesh`, this.geometry = e17, this.material = t2, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
    }
    copy(e17, t2) {
      return super.copy(e17, t2), e17.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e17.morphTargetInfluences.slice()), e17.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e17.morphTargetDictionary)), this.material = Array.isArray(e17.material) ? e17.material.slice() : e17.material, this.geometry = e17.geometry, this;
    }
    updateMorphTargets() {
      let e17 = this.geometry.morphAttributes, t2 = Object.keys(e17);
      if (t2.length > 0) {
        let n2 = e17[t2[0]];
        if (n2 !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let e18 = 0, t3 = n2.length; e18 < t3; e18++) {
            let t4 = n2[e18].name || String(e18);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[t4] = e18;
          }
        }
      }
    }
    getVertexPosition(e17, t2) {
      let n2 = this.geometry, r2 = n2.attributes.position, i2 = n2.morphAttributes.position, a2 = n2.morphTargetsRelative;
      t2.fromBufferAttribute(r2, e17);
      let o2 = this.morphTargetInfluences;
      if (i2 && o2) {
        Sr.set(0, 0, 0);
        for (let n3 = 0, r3 = i2.length; n3 < r3; n3++) {
          let r4 = o2[n3], s2 = i2[n3];
          r4 !== 0 && (xr.fromBufferAttribute(s2, e17), a2 ? Sr.addScaledVector(xr, r4) : Sr.addScaledVector(xr.sub(t2), r4));
        }
        t2.add(Sr);
      }
      return t2;
    }
    raycast(e17, t2) {
      let n2 = this.geometry, r2 = this.material, i2 = this.matrixWorld;
      r2 !== void 0 && (n2.boundingSphere === null && n2.computeBoundingSphere(), gr.copy(n2.boundingSphere), gr.applyMatrix4(i2), hr.copy(e17.ray).recast(e17.near), !(gr.containsPoint(hr.origin) === false && (hr.intersectSphere(gr, _r) === null || hr.origin.distanceToSquared(_r) > (e17.far - e17.near) ** 2)) && (mr.copy(i2).invert(), hr.copy(e17.ray).applyMatrix4(mr), !(n2.boundingBox !== null && hr.intersectsBox(n2.boundingBox) === false) && this._computeIntersections(e17, t2, hr)));
    }
    _computeIntersections(e17, t2, n2) {
      let r2, i2 = this.geometry, a2 = this.material, o2 = i2.index, s2 = i2.attributes.position, c2 = i2.attributes.uv, l2 = i2.attributes.uv1, u2 = i2.attributes.normal, d2 = i2.groups, f2 = i2.drawRange;
      if (o2 !== null) if (Array.isArray(a2)) for (let i3 = 0, s3 = d2.length; i3 < s3; i3++) {
        let s4 = d2[i3], p2 = a2[s4.materialIndex], m2 = Math.max(s4.start, f2.start), h2 = Math.min(o2.count, Math.min(s4.start + s4.count, f2.start + f2.count));
        for (let i4 = m2, a3 = h2; i4 < a3; i4 += 3) {
          let a4 = o2.getX(i4), d3 = o2.getX(i4 + 1), f3 = o2.getX(i4 + 2);
          r2 = Dr(this, p2, e17, n2, c2, l2, u2, a4, d3, f3), r2 && (r2.faceIndex = Math.floor(i4 / 3), r2.face.materialIndex = s4.materialIndex, t2.push(r2));
        }
      }
      else {
        let i3 = Math.max(0, f2.start), s3 = Math.min(o2.count, f2.start + f2.count);
        for (let d3 = i3, f3 = s3; d3 < f3; d3 += 3) {
          let i4 = o2.getX(d3), s4 = o2.getX(d3 + 1), f4 = o2.getX(d3 + 2);
          r2 = Dr(this, a2, e17, n2, c2, l2, u2, i4, s4, f4), r2 && (r2.faceIndex = Math.floor(d3 / 3), t2.push(r2));
        }
      }
      else if (s2 !== void 0) if (Array.isArray(a2)) for (let i3 = 0, o3 = d2.length; i3 < o3; i3++) {
        let o4 = d2[i3], p2 = a2[o4.materialIndex], m2 = Math.max(o4.start, f2.start), h2 = Math.min(s2.count, Math.min(o4.start + o4.count, f2.start + f2.count));
        for (let i4 = m2, a3 = h2; i4 < a3; i4 += 3) {
          let a4 = i4, s3 = i4 + 1, d3 = i4 + 2;
          r2 = Dr(this, p2, e17, n2, c2, l2, u2, a4, s3, d3), r2 && (r2.faceIndex = Math.floor(i4 / 3), r2.face.materialIndex = o4.materialIndex, t2.push(r2));
        }
      }
      else {
        let i3 = Math.max(0, f2.start), o3 = Math.min(s2.count, f2.start + f2.count);
        for (let s3 = i3, d3 = o3; s3 < d3; s3 += 3) {
          let i4 = s3, o4 = s3 + 1, d4 = s3 + 2;
          r2 = Dr(this, a2, e17, n2, c2, l2, u2, i4, o4, d4), r2 && (r2.faceIndex = Math.floor(s3 / 3), t2.push(r2));
        }
      }
    }
  };
  function Er(e17, t2, n2, r2, i2, a2, o2, s2) {
    let c2;
    if (c2 = t2.side === 1 ? r2.intersectTriangle(o2, a2, i2, true, s2) : r2.intersectTriangle(i2, a2, o2, t2.side === 0, s2), c2 === null) return null;
    wr.copy(s2), wr.applyMatrix4(e17.matrixWorld);
    let l2 = n2.ray.origin.distanceTo(wr);
    return l2 < n2.near || l2 > n2.far ? null : { distance: l2, point: wr.clone(), object: e17 };
  }
  function Dr(e17, t2, n2, r2, i2, a2, o2, s2, c2, l2) {
    e17.getVertexPosition(s2, vr), e17.getVertexPosition(c2, yr), e17.getVertexPosition(l2, br);
    let u2 = Er(e17, t2, n2, r2, vr, yr, br, Cr);
    if (u2) {
      let e18 = new W();
      Wn.getBarycoord(Cr, vr, yr, br, e18), i2 && (u2.uv = Wn.getInterpolatedAttribute(i2, s2, c2, l2, e18, new U())), a2 && (u2.uv1 = Wn.getInterpolatedAttribute(a2, s2, c2, l2, e18, new U())), o2 && (u2.normal = Wn.getInterpolatedAttribute(o2, s2, c2, l2, e18, new W()), u2.normal.dot(r2.direction) > 0 && u2.normal.multiplyScalar(-1));
      let t3 = { a: s2, b: c2, c: l2, normal: new W(), materialIndex: 0 };
      Wn.getNormal(vr, yr, br, t3.normal), u2.face = t3, u2.barycoord = e18;
    }
    return u2;
  }
  var Or = class e12 extends pr {
    constructor(e17 = 1, t2 = 1, n2 = 1, r2 = 1, i2 = 1, a2 = 1) {
      super(), this.type = `BoxGeometry`, this.parameters = { width: e17, height: t2, depth: n2, widthSegments: r2, heightSegments: i2, depthSegments: a2 };
      let o2 = this;
      r2 = Math.floor(r2), i2 = Math.floor(i2), a2 = Math.floor(a2);
      let s2 = [], c2 = [], l2 = [], u2 = [], d2 = 0, f2 = 0;
      p2(`z`, `y`, `x`, -1, -1, n2, t2, e17, a2, i2, 0), p2(`z`, `y`, `x`, 1, -1, n2, t2, -e17, a2, i2, 1), p2(`x`, `z`, `y`, 1, 1, e17, n2, t2, r2, a2, 2), p2(`x`, `z`, `y`, 1, -1, e17, n2, -t2, r2, a2, 3), p2(`x`, `y`, `z`, 1, -1, e17, t2, n2, r2, i2, 4), p2(`x`, `y`, `z`, -1, -1, e17, t2, -n2, r2, i2, 5), this.setIndex(s2), this.setAttribute(`position`, new ar(c2, 3)), this.setAttribute(`normal`, new ar(l2, 3)), this.setAttribute(`uv`, new ar(u2, 2));
      function p2(e18, t3, n3, r3, i3, a3, p3, m2, h2, g2, _2) {
        let v2 = a3 / h2, y2 = p3 / g2, b2 = a3 / 2, x2 = p3 / 2, S2 = m2 / 2, C2 = h2 + 1, w2 = g2 + 1, T2 = 0, E2 = 0, D2 = new W();
        for (let a4 = 0; a4 < w2; a4++) {
          let o3 = a4 * y2 - x2;
          for (let s3 = 0; s3 < C2; s3++) D2[e18] = (s3 * v2 - b2) * r3, D2[t3] = o3 * i3, D2[n3] = S2, c2.push(D2.x, D2.y, D2.z), D2[e18] = 0, D2[t3] = 0, D2[n3] = m2 > 0 ? 1 : -1, l2.push(D2.x, D2.y, D2.z), u2.push(s3 / h2), u2.push(1 - a4 / g2), T2 += 1;
        }
        for (let e19 = 0; e19 < g2; e19++) for (let t4 = 0; t4 < h2; t4++) {
          let n4 = d2 + t4 + C2 * e19, r4 = d2 + t4 + C2 * (e19 + 1), i4 = d2 + (t4 + 1) + C2 * (e19 + 1), a4 = d2 + (t4 + 1) + C2 * e19;
          s2.push(n4, r4, a4), s2.push(r4, i4, a4), E2 += 6;
        }
        o2.addGroup(f2, E2, _2), f2 += E2, d2 += T2;
      }
    }
    copy(e17) {
      return super.copy(e17), this.parameters = Object.assign({}, e17.parameters), this;
    }
    static fromJSON(t2) {
      return new e12(t2.width, t2.height, t2.depth, t2.widthSegments, t2.heightSegments, t2.depthSegments);
    }
  };
  function kr(e17) {
    let t2 = {};
    for (let n2 in e17) {
      t2[n2] = {};
      for (let r2 in e17[n2]) {
        let i2 = e17[n2][r2];
        i2 && (i2.isColor || i2.isMatrix3 || i2.isMatrix4 || i2.isVector2 || i2.isVector3 || i2.isVector4 || i2.isTexture || i2.isQuaternion) ? i2.isRenderTargetTexture ? (console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`), t2[n2][r2] = null) : t2[n2][r2] = i2.clone() : Array.isArray(i2) ? t2[n2][r2] = i2.slice() : t2[n2][r2] = i2;
      }
    }
    return t2;
  }
  function Ar(e17) {
    let t2 = {};
    for (let n2 = 0; n2 < e17.length; n2++) {
      let r2 = kr(e17[n2]);
      for (let e18 in r2) t2[e18] = r2[e18];
    }
    return t2;
  }
  function jr(e17) {
    let t2 = [];
    for (let n2 = 0; n2 < e17.length; n2++) t2.push(e17[n2].clone());
    return t2;
  }
  function Mr(e17) {
    let t2 = e17.getRenderTarget();
    return t2 === null ? e17.outputColorSpace : t2.isXRRenderTarget === true ? t2.texture.colorSpace : K.workingColorSpace;
  }
  var Nr = { clone: kr, merge: Ar };
  var Pr = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
  var Fr = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
  var Ir = class extends Zn {
    constructor(e17) {
      super(), this.isShaderMaterial = true, this.type = `ShaderMaterial`, this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Pr, this.fragmentShader = Fr, this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = { clipCullDistance: false, multiDraw: false }, this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv1: [0, 0] }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, e17 !== void 0 && this.setValues(e17);
    }
    copy(e17) {
      return super.copy(e17), this.fragmentShader = e17.fragmentShader, this.vertexShader = e17.vertexShader, this.uniforms = kr(e17.uniforms), this.uniformsGroups = jr(e17.uniformsGroups), this.defines = Object.assign({}, e17.defines), this.wireframe = e17.wireframe, this.wireframeLinewidth = e17.wireframeLinewidth, this.fog = e17.fog, this.lights = e17.lights, this.clipping = e17.clipping, this.extensions = Object.assign({}, e17.extensions), this.glslVersion = e17.glslVersion, this;
    }
    toJSON(e17) {
      let t2 = super.toJSON(e17);
      t2.glslVersion = this.glslVersion, t2.uniforms = {};
      for (let n3 in this.uniforms) {
        let r2 = this.uniforms[n3].value;
        r2 && r2.isTexture ? t2.uniforms[n3] = { type: `t`, value: r2.toJSON(e17).uuid } : r2 && r2.isColor ? t2.uniforms[n3] = { type: `c`, value: r2.getHex() } : r2 && r2.isVector2 ? t2.uniforms[n3] = { type: `v2`, value: r2.toArray() } : r2 && r2.isVector3 ? t2.uniforms[n3] = { type: `v3`, value: r2.toArray() } : r2 && r2.isVector4 ? t2.uniforms[n3] = { type: `v4`, value: r2.toArray() } : r2 && r2.isMatrix3 ? t2.uniforms[n3] = { type: `m3`, value: r2.toArray() } : r2 && r2.isMatrix4 ? t2.uniforms[n3] = { type: `m4`, value: r2.toArray() } : t2.uniforms[n3] = { value: r2 };
      }
      Object.keys(this.defines).length > 0 && (t2.defines = this.defines), t2.vertexShader = this.vertexShader, t2.fragmentShader = this.fragmentShader, t2.lights = this.lights, t2.clipping = this.clipping;
      let n2 = {};
      for (let e18 in this.extensions) this.extensions[e18] === true && (n2[e18] = true);
      return Object.keys(n2).length > 0 && (t2.extensions = n2), t2;
    }
  };
  var Lr = class extends An {
    constructor() {
      super(), this.isCamera = true, this.type = `Camera`, this.matrixWorldInverse = new nn(), this.projectionMatrix = new nn(), this.projectionMatrixInverse = new nn(), this.coordinateSystem = Ge, this._reversedDepth = false;
    }
    get reversedDepth() {
      return this._reversedDepth;
    }
    copy(e17, t2) {
      return super.copy(e17, t2), this.matrixWorldInverse.copy(e17.matrixWorldInverse), this.projectionMatrix.copy(e17.projectionMatrix), this.projectionMatrixInverse.copy(e17.projectionMatrixInverse), this.coordinateSystem = e17.coordinateSystem, this;
    }
    getWorldDirection(e17) {
      return super.getWorldDirection(e17).negate();
    }
    updateMatrixWorld(e17) {
      super.updateMatrixWorld(e17), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateWorldMatrix(e17, t2) {
      super.updateWorldMatrix(e17, t2), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var Rr = new W();
  var zr = new U();
  var Br = new U();
  var Vr = class extends Lr {
    constructor(e17 = 50, t2 = 1, n2 = 0.1, r2 = 2e3) {
      super(), this.isPerspectiveCamera = true, this.type = `PerspectiveCamera`, this.fov = e17, this.zoom = 1, this.near = n2, this.far = r2, this.focus = 10, this.aspect = t2, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
    }
    copy(e17, t2) {
      return super.copy(e17, t2), this.fov = e17.fov, this.zoom = e17.zoom, this.near = e17.near, this.far = e17.far, this.focus = e17.focus, this.aspect = e17.aspect, this.view = e17.view === null ? null : Object.assign({}, e17.view), this.filmGauge = e17.filmGauge, this.filmOffset = e17.filmOffset, this;
    }
    setFocalLength(e17) {
      let t2 = 0.5 * this.getFilmHeight() / e17;
      this.fov = Ye * 2 * Math.atan(t2), this.updateProjectionMatrix();
    }
    getFocalLength() {
      let e17 = Math.tan(Je * 0.5 * this.fov);
      return 0.5 * this.getFilmHeight() / e17;
    }
    getEffectiveFOV() {
      return Ye * 2 * Math.atan(Math.tan(Je * 0.5 * this.fov) / this.zoom);
    }
    getFilmWidth() {
      return this.filmGauge * Math.min(this.aspect, 1);
    }
    getFilmHeight() {
      return this.filmGauge / Math.max(this.aspect, 1);
    }
    getViewBounds(e17, t2, n2) {
      Rr.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t2.set(Rr.x, Rr.y).multiplyScalar(-e17 / Rr.z), Rr.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n2.set(Rr.x, Rr.y).multiplyScalar(-e17 / Rr.z);
    }
    getViewSize(e17, t2) {
      return this.getViewBounds(e17, zr, Br), t2.subVectors(Br, zr);
    }
    setViewOffset(e17, t2, n2, r2, i2, a2) {
      this.aspect = e17 / t2, this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e17, this.view.fullHeight = t2, this.view.offsetX = n2, this.view.offsetY = r2, this.view.width = i2, this.view.height = a2, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      let e17 = this.near, t2 = e17 * Math.tan(Je * 0.5 * this.fov) / this.zoom, n2 = 2 * t2, r2 = this.aspect * n2, i2 = -0.5 * r2, a2 = this.view;
      if (this.view !== null && this.view.enabled) {
        let e18 = a2.fullWidth, o3 = a2.fullHeight;
        i2 += a2.offsetX * r2 / e18, t2 -= a2.offsetY * n2 / o3, r2 *= a2.width / e18, n2 *= a2.height / o3;
      }
      let o2 = this.filmOffset;
      o2 !== 0 && (i2 += e17 * o2 / this.getFilmWidth()), this.projectionMatrix.makePerspective(i2, i2 + r2, t2, t2 - n2, e17, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e17) {
      let t2 = super.toJSON(e17);
      return t2.object.fov = this.fov, t2.object.zoom = this.zoom, t2.object.near = this.near, t2.object.far = this.far, t2.object.focus = this.focus, t2.object.aspect = this.aspect, this.view !== null && (t2.object.view = Object.assign({}, this.view)), t2.object.filmGauge = this.filmGauge, t2.object.filmOffset = this.filmOffset, t2;
    }
  };
  var Hr = -90;
  var Ur = 1;
  var Wr = class extends An {
    constructor(e17, t2, n2) {
      super(), this.type = `CubeCamera`, this.renderTarget = n2, this.coordinateSystem = null, this.activeMipmapLevel = 0;
      let r2 = new Vr(Hr, Ur, e17, t2);
      r2.layers = this.layers, this.add(r2);
      let i2 = new Vr(Hr, Ur, e17, t2);
      i2.layers = this.layers, this.add(i2);
      let a2 = new Vr(Hr, Ur, e17, t2);
      a2.layers = this.layers, this.add(a2);
      let o2 = new Vr(Hr, Ur, e17, t2);
      o2.layers = this.layers, this.add(o2);
      let s2 = new Vr(Hr, Ur, e17, t2);
      s2.layers = this.layers, this.add(s2);
      let c2 = new Vr(Hr, Ur, e17, t2);
      c2.layers = this.layers, this.add(c2);
    }
    updateCoordinateSystem() {
      let e17 = this.coordinateSystem, t2 = this.children.concat(), [n2, r2, i2, a2, o2, s2] = t2;
      for (let e18 of t2) this.remove(e18);
      if (e17 === 2e3) n2.up.set(0, 1, 0), n2.lookAt(1, 0, 0), r2.up.set(0, 1, 0), r2.lookAt(-1, 0, 0), i2.up.set(0, 0, -1), i2.lookAt(0, 1, 0), a2.up.set(0, 0, 1), a2.lookAt(0, -1, 0), o2.up.set(0, 1, 0), o2.lookAt(0, 0, 1), s2.up.set(0, 1, 0), s2.lookAt(0, 0, -1);
      else if (e17 === 2001) n2.up.set(0, -1, 0), n2.lookAt(-1, 0, 0), r2.up.set(0, -1, 0), r2.lookAt(1, 0, 0), i2.up.set(0, 0, 1), i2.lookAt(0, 1, 0), a2.up.set(0, 0, -1), a2.lookAt(0, -1, 0), o2.up.set(0, -1, 0), o2.lookAt(0, 0, 1), s2.up.set(0, -1, 0), s2.lookAt(0, 0, -1);
      else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: ` + e17);
      for (let e18 of t2) this.add(e18), e18.updateMatrixWorld();
    }
    update(e17, t2) {
      this.parent === null && this.updateMatrixWorld();
      let { renderTarget: n2, activeMipmapLevel: r2 } = this;
      this.coordinateSystem !== e17.coordinateSystem && (this.coordinateSystem = e17.coordinateSystem, this.updateCoordinateSystem());
      let [i2, a2, o2, s2, c2, l2] = this.children, u2 = e17.getRenderTarget(), d2 = e17.getActiveCubeFace(), f2 = e17.getActiveMipmapLevel(), p2 = e17.xr.enabled;
      e17.xr.enabled = false;
      let m2 = n2.texture.generateMipmaps;
      n2.texture.generateMipmaps = false, e17.setRenderTarget(n2, 0, r2), e17.render(t2, i2), e17.setRenderTarget(n2, 1, r2), e17.render(t2, a2), e17.setRenderTarget(n2, 2, r2), e17.render(t2, o2), e17.setRenderTarget(n2, 3, r2), e17.render(t2, s2), e17.setRenderTarget(n2, 4, r2), e17.render(t2, c2), n2.texture.generateMipmaps = m2, e17.setRenderTarget(n2, 5, r2), e17.render(t2, l2), e17.setRenderTarget(u2, d2, f2), e17.xr.enabled = p2, n2.texture.needsPMREMUpdate = true;
    }
  };
  var Gr = class extends Ct {
    constructor(e17 = [], t2 = 301, n2, r2, i2, a2, o2, s2, c2, l2) {
      super(e17, t2, n2, r2, i2, a2, o2, s2, c2, l2), this.isCubeTexture = true, this.flipY = false;
    }
    get images() {
      return this.image;
    }
    set images(e17) {
      this.image = e17;
    }
  };
  var Kr = class extends Et {
    constructor(e17 = 1, t2 = {}) {
      super(e17, e17, t2), this.isWebGLCubeRenderTarget = true;
      let n2 = { width: e17, height: e17, depth: 1 }, r2 = [n2, n2, n2, n2, n2, n2];
      this.texture = new Gr(r2), this._setTextureOptions(t2), this.texture.isRenderTargetTexture = true;
    }
    fromEquirectangularTexture(e17, t2) {
      this.texture.type = t2.type, this.texture.colorSpace = t2.colorSpace, this.texture.generateMipmaps = t2.generateMipmaps, this.texture.minFilter = t2.minFilter, this.texture.magFilter = t2.magFilter;
      let n2 = { uniforms: { tEquirect: { value: null } }, vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`, fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			` }, r2 = new Or(5, 5, 5), i2 = new Ir({ name: `CubemapFromEquirect`, uniforms: kr(n2.uniforms), vertexShader: n2.vertexShader, fragmentShader: n2.fragmentShader, side: 1, blending: 0 });
      i2.uniforms.tEquirect.value = t2;
      let a2 = new Tr(r2, i2), o2 = t2.minFilter;
      return t2.minFilter === 1008 && (t2.minFilter = h), new Wr(1, 10, this).update(e17, a2), t2.minFilter = o2, a2.geometry.dispose(), a2.material.dispose(), this;
    }
    clear(e17, t2 = true, n2 = true, r2 = true) {
      let i2 = e17.getRenderTarget();
      for (let i3 = 0; i3 < 6; i3++) e17.setRenderTarget(this, i3), e17.clear(t2, n2, r2);
      e17.setRenderTarget(i2);
    }
  };
  var qr = class extends An {
    constructor() {
      super(), this.isGroup = true, this.type = `Group`;
    }
  };
  var Jr = { type: `move` };
  var Yr = class {
    constructor() {
      this._targetRay = null, this._grip = null, this._hand = null;
    }
    getHandSpace() {
      return this._hand === null && (this._hand = new qr(), this._hand.matrixAutoUpdate = false, this._hand.visible = false, this._hand.joints = {}, this._hand.inputState = { pinching: false }), this._hand;
    }
    getTargetRaySpace() {
      return this._targetRay === null && (this._targetRay = new qr(), this._targetRay.matrixAutoUpdate = false, this._targetRay.visible = false, this._targetRay.hasLinearVelocity = false, this._targetRay.linearVelocity = new W(), this._targetRay.hasAngularVelocity = false, this._targetRay.angularVelocity = new W()), this._targetRay;
    }
    getGripSpace() {
      return this._grip === null && (this._grip = new qr(), this._grip.matrixAutoUpdate = false, this._grip.visible = false, this._grip.hasLinearVelocity = false, this._grip.linearVelocity = new W(), this._grip.hasAngularVelocity = false, this._grip.angularVelocity = new W()), this._grip;
    }
    dispatchEvent(e17) {
      return this._targetRay !== null && this._targetRay.dispatchEvent(e17), this._grip !== null && this._grip.dispatchEvent(e17), this._hand !== null && this._hand.dispatchEvent(e17), this;
    }
    connect(e17) {
      if (e17 && e17.hand) {
        let t2 = this._hand;
        if (t2) for (let n2 of e17.hand.values()) this._getHandJoint(t2, n2);
      }
      return this.dispatchEvent({ type: `connected`, data: e17 }), this;
    }
    disconnect(e17) {
      return this.dispatchEvent({ type: `disconnected`, data: e17 }), this._targetRay !== null && (this._targetRay.visible = false), this._grip !== null && (this._grip.visible = false), this._hand !== null && (this._hand.visible = false), this;
    }
    update(e17, t2, n2) {
      let r2 = null, i2 = null, a2 = null, o2 = this._targetRay, s2 = this._grip, c2 = this._hand;
      if (e17 && t2.session.visibilityState !== `visible-blurred`) {
        if (c2 && e17.hand) {
          a2 = true;
          for (let r4 of e17.hand.values()) {
            let e18 = t2.getJointPose(r4, n2), i4 = this._getHandJoint(c2, r4);
            e18 !== null && (i4.matrix.fromArray(e18.transform.matrix), i4.matrix.decompose(i4.position, i4.rotation, i4.scale), i4.matrixWorldNeedsUpdate = true, i4.jointRadius = e18.radius), i4.visible = e18 !== null;
          }
          let r3 = c2.joints[`index-finger-tip`], i3 = c2.joints[`thumb-tip`], o3 = r3.position.distanceTo(i3.position);
          c2.inputState.pinching && o3 > 0.025 ? (c2.inputState.pinching = false, this.dispatchEvent({ type: `pinchend`, handedness: e17.handedness, target: this })) : !c2.inputState.pinching && o3 <= 0.015 && (c2.inputState.pinching = true, this.dispatchEvent({ type: `pinchstart`, handedness: e17.handedness, target: this }));
        } else s2 !== null && e17.gripSpace && (i2 = t2.getPose(e17.gripSpace, n2), i2 !== null && (s2.matrix.fromArray(i2.transform.matrix), s2.matrix.decompose(s2.position, s2.rotation, s2.scale), s2.matrixWorldNeedsUpdate = true, i2.linearVelocity ? (s2.hasLinearVelocity = true, s2.linearVelocity.copy(i2.linearVelocity)) : s2.hasLinearVelocity = false, i2.angularVelocity ? (s2.hasAngularVelocity = true, s2.angularVelocity.copy(i2.angularVelocity)) : s2.hasAngularVelocity = false));
        o2 !== null && (r2 = t2.getPose(e17.targetRaySpace, n2), r2 === null && i2 !== null && (r2 = i2), r2 !== null && (o2.matrix.fromArray(r2.transform.matrix), o2.matrix.decompose(o2.position, o2.rotation, o2.scale), o2.matrixWorldNeedsUpdate = true, r2.linearVelocity ? (o2.hasLinearVelocity = true, o2.linearVelocity.copy(r2.linearVelocity)) : o2.hasLinearVelocity = false, r2.angularVelocity ? (o2.hasAngularVelocity = true, o2.angularVelocity.copy(r2.angularVelocity)) : o2.hasAngularVelocity = false, this.dispatchEvent(Jr)));
      }
      return o2 !== null && (o2.visible = r2 !== null), s2 !== null && (s2.visible = i2 !== null), c2 !== null && (c2.visible = a2 !== null), this;
    }
    _getHandJoint(e17, t2) {
      if (e17.joints[t2.jointName] === void 0) {
        let n2 = new qr();
        n2.matrixAutoUpdate = false, n2.visible = false, e17.joints[t2.jointName] = n2, e17.add(n2);
      }
      return e17.joints[t2.jointName];
    }
  };
  var Xr = class extends An {
    constructor() {
      super(), this.isScene = true, this.type = `Scene`, this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new pn(), this.environmentIntensity = 1, this.environmentRotation = new pn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < `u` && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`, { detail: this }));
    }
    copy(e17, t2) {
      return super.copy(e17, t2), e17.background !== null && (this.background = e17.background.clone()), e17.environment !== null && (this.environment = e17.environment.clone()), e17.fog !== null && (this.fog = e17.fog.clone()), this.backgroundBlurriness = e17.backgroundBlurriness, this.backgroundIntensity = e17.backgroundIntensity, this.backgroundRotation.copy(e17.backgroundRotation), this.environmentIntensity = e17.environmentIntensity, this.environmentRotation.copy(e17.environmentRotation), e17.overrideMaterial !== null && (this.overrideMaterial = e17.overrideMaterial.clone()), this.matrixAutoUpdate = e17.matrixAutoUpdate, this;
    }
    toJSON(e17) {
      let t2 = super.toJSON(e17);
      return this.fog !== null && (t2.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t2.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t2.object.backgroundIntensity = this.backgroundIntensity), t2.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t2.object.environmentIntensity = this.environmentIntensity), t2.object.environmentRotation = this.environmentRotation.toArray(), t2;
    }
  };
  var Zr = class extends Ct {
    constructor(e17 = null, t2 = 1, n2 = 1, r2, i2, a2, o2, s2, c2 = f, l2 = f, u2, d2) {
      super(null, a2, o2, s2, c2, l2, r2, i2, u2, d2), this.isDataTexture = true, this.image = { data: e17, width: t2, height: n2 }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var Qr = new W();
  var $r = new W();
  var ei = new G();
  var ti = class {
    constructor(e17 = new W(1, 0, 0), t2 = 0) {
      this.isPlane = true, this.normal = e17, this.constant = t2;
    }
    set(e17, t2) {
      return this.normal.copy(e17), this.constant = t2, this;
    }
    setComponents(e17, t2, n2, r2) {
      return this.normal.set(e17, t2, n2), this.constant = r2, this;
    }
    setFromNormalAndCoplanarPoint(e17, t2) {
      return this.normal.copy(e17), this.constant = -t2.dot(this.normal), this;
    }
    setFromCoplanarPoints(e17, t2, n2) {
      let r2 = Qr.subVectors(n2, t2).cross($r.subVectors(e17, t2)).normalize();
      return this.setFromNormalAndCoplanarPoint(r2, e17), this;
    }
    copy(e17) {
      return this.normal.copy(e17.normal), this.constant = e17.constant, this;
    }
    normalize() {
      let e17 = 1 / this.normal.length();
      return this.normal.multiplyScalar(e17), this.constant *= e17, this;
    }
    negate() {
      return this.constant *= -1, this.normal.negate(), this;
    }
    distanceToPoint(e17) {
      return this.normal.dot(e17) + this.constant;
    }
    distanceToSphere(e17) {
      return this.distanceToPoint(e17.center) - e17.radius;
    }
    projectPoint(e17, t2) {
      return t2.copy(e17).addScaledVector(this.normal, -this.distanceToPoint(e17));
    }
    intersectLine(e17, t2) {
      let n2 = e17.delta(Qr), r2 = this.normal.dot(n2);
      if (r2 === 0) return this.distanceToPoint(e17.start) === 0 ? t2.copy(e17.start) : null;
      let i2 = -(e17.start.dot(this.normal) + this.constant) / r2;
      return i2 < 0 || i2 > 1 ? null : t2.copy(e17.start).addScaledVector(n2, i2);
    }
    intersectsLine(e17) {
      let t2 = this.distanceToPoint(e17.start), n2 = this.distanceToPoint(e17.end);
      return t2 < 0 && n2 > 0 || n2 < 0 && t2 > 0;
    }
    intersectsBox(e17) {
      return e17.intersectsPlane(this);
    }
    intersectsSphere(e17) {
      return e17.intersectsPlane(this);
    }
    coplanarPoint(e17) {
      return e17.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(e17, t2) {
      let n2 = t2 || ei.getNormalMatrix(e17), r2 = this.coplanarPoint(Qr).applyMatrix4(e17), i2 = this.normal.applyMatrix3(n2).normalize();
      return this.constant = -r2.dot(i2), this;
    }
    translate(e17) {
      return this.constant -= e17.dot(this.normal), this;
    }
    equals(e17) {
      return e17.normal.equals(this.normal) && e17.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var ni = new qt();
  var ri = new U(0.5, 0.5);
  var ii = new W();
  var ai = class {
    constructor(e17 = new ti(), t2 = new ti(), n2 = new ti(), r2 = new ti(), i2 = new ti(), a2 = new ti()) {
      this.planes = [e17, t2, n2, r2, i2, a2];
    }
    set(e17, t2, n2, r2, i2, a2) {
      let o2 = this.planes;
      return o2[0].copy(e17), o2[1].copy(t2), o2[2].copy(n2), o2[3].copy(r2), o2[4].copy(i2), o2[5].copy(a2), this;
    }
    copy(e17) {
      let t2 = this.planes;
      for (let n2 = 0; n2 < 6; n2++) t2[n2].copy(e17.planes[n2]);
      return this;
    }
    setFromProjectionMatrix(e17, t2 = Ge, n2 = false) {
      let r2 = this.planes, i2 = e17.elements, a2 = i2[0], o2 = i2[1], s2 = i2[2], c2 = i2[3], l2 = i2[4], u2 = i2[5], d2 = i2[6], f2 = i2[7], p2 = i2[8], m2 = i2[9], h2 = i2[10], g2 = i2[11], _2 = i2[12], v2 = i2[13], y2 = i2[14], b2 = i2[15];
      if (r2[0].setComponents(c2 - a2, f2 - l2, g2 - p2, b2 - _2).normalize(), r2[1].setComponents(c2 + a2, f2 + l2, g2 + p2, b2 + _2).normalize(), r2[2].setComponents(c2 + o2, f2 + u2, g2 + m2, b2 + v2).normalize(), r2[3].setComponents(c2 - o2, f2 - u2, g2 - m2, b2 - v2).normalize(), n2) r2[4].setComponents(s2, d2, h2, y2).normalize(), r2[5].setComponents(c2 - s2, f2 - d2, g2 - h2, b2 - y2).normalize();
      else if (r2[4].setComponents(c2 - s2, f2 - d2, g2 - h2, b2 - y2).normalize(), t2 === 2e3) r2[5].setComponents(c2 + s2, f2 + d2, g2 + h2, b2 + y2).normalize();
      else if (t2 === 2001) r2[5].setComponents(s2, d2, h2, y2).normalize();
      else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: ` + t2);
      return this;
    }
    intersectsObject(e17) {
      if (e17.boundingSphere !== void 0) e17.boundingSphere === null && e17.computeBoundingSphere(), ni.copy(e17.boundingSphere).applyMatrix4(e17.matrixWorld);
      else {
        let t2 = e17.geometry;
        t2.boundingSphere === null && t2.computeBoundingSphere(), ni.copy(t2.boundingSphere).applyMatrix4(e17.matrixWorld);
      }
      return this.intersectsSphere(ni);
    }
    intersectsSprite(e17) {
      return ni.center.set(0, 0, 0), ni.radius = 0.7071067811865476 + ri.distanceTo(e17.center), ni.applyMatrix4(e17.matrixWorld), this.intersectsSphere(ni);
    }
    intersectsSphere(e17) {
      let t2 = this.planes, n2 = e17.center, r2 = -e17.radius;
      for (let e18 = 0; e18 < 6; e18++) if (t2[e18].distanceToPoint(n2) < r2) return false;
      return true;
    }
    intersectsBox(e17) {
      let t2 = this.planes;
      for (let n2 = 0; n2 < 6; n2++) {
        let r2 = t2[n2];
        if (ii.x = r2.normal.x > 0 ? e17.max.x : e17.min.x, ii.y = r2.normal.y > 0 ? e17.max.y : e17.min.y, ii.z = r2.normal.z > 0 ? e17.max.z : e17.min.z, r2.distanceToPoint(ii) < 0) return false;
      }
      return true;
    }
    containsPoint(e17) {
      let t2 = this.planes;
      for (let n2 = 0; n2 < 6; n2++) if (t2[n2].distanceToPoint(e17) < 0) return false;
      return true;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var oi = class extends Zn {
    constructor(e17) {
      super(), this.isPointsMaterial = true, this.type = `PointsMaterial`, this.color = new q(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(e17);
    }
    copy(e17) {
      return super.copy(e17), this.color.copy(e17.color), this.map = e17.map, this.alphaMap = e17.alphaMap, this.size = e17.size, this.sizeAttenuation = e17.sizeAttenuation, this.fog = e17.fog, this;
    }
  };
  var si = new nn();
  var ci = new tn();
  var li = new qt();
  var ui = new W();
  var di = class extends An {
    constructor(e17 = new pr(), t2 = new oi()) {
      super(), this.isPoints = true, this.type = `Points`, this.geometry = e17, this.material = t2, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
    }
    copy(e17, t2) {
      return super.copy(e17, t2), this.material = Array.isArray(e17.material) ? e17.material.slice() : e17.material, this.geometry = e17.geometry, this;
    }
    raycast(e17, t2) {
      let n2 = this.geometry, r2 = this.matrixWorld, i2 = e17.params.Points.threshold, a2 = n2.drawRange;
      if (n2.boundingSphere === null && n2.computeBoundingSphere(), li.copy(n2.boundingSphere), li.applyMatrix4(r2), li.radius += i2, e17.ray.intersectsSphere(li) === false) return;
      si.copy(r2).invert(), ci.copy(e17.ray).applyMatrix4(si);
      let o2 = i2 / ((this.scale.x + this.scale.y + this.scale.z) / 3), s2 = o2 * o2, c2 = n2.index, l2 = n2.attributes.position;
      if (c2 !== null) {
        let n3 = Math.max(0, a2.start), i3 = Math.min(c2.count, a2.start + a2.count);
        for (let a3 = n3, o3 = i3; a3 < o3; a3++) {
          let n4 = c2.getX(a3);
          ui.fromBufferAttribute(l2, n4), fi(ui, n4, s2, r2, e17, t2, this);
        }
      } else {
        let n3 = Math.max(0, a2.start), i3 = Math.min(l2.count, a2.start + a2.count);
        for (let a3 = n3, o3 = i3; a3 < o3; a3++) ui.fromBufferAttribute(l2, a3), fi(ui, a3, s2, r2, e17, t2, this);
      }
    }
    updateMorphTargets() {
      let e17 = this.geometry.morphAttributes, t2 = Object.keys(e17);
      if (t2.length > 0) {
        let n2 = e17[t2[0]];
        if (n2 !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let e18 = 0, t3 = n2.length; e18 < t3; e18++) {
            let t4 = n2[e18].name || String(e18);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[t4] = e18;
          }
        }
      }
    }
  };
  function fi(e17, t2, n2, r2, i2, a2, o2) {
    let s2 = ci.distanceSqToPoint(e17);
    if (s2 < n2) {
      let n3 = new W();
      ci.closestPointToPoint(e17, n3), n3.applyMatrix4(r2);
      let c2 = i2.ray.origin.distanceTo(n3);
      if (c2 < i2.near || c2 > i2.far) return;
      a2.push({ distance: c2, distanceToRay: Math.sqrt(s2), point: n3, index: t2, face: null, faceIndex: null, barycoord: null, object: o2 });
    }
  }
  var pi = class extends Ct {
    constructor(e17, t2, n2 = C, r2, i2, a2, o2 = f, s2 = f, c2, l2 = M, u2 = 1) {
      if (l2 !== 1026 && l2 !== 1027) throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);
      super({ width: e17, height: t2, depth: u2 }, r2, i2, a2, o2, s2, l2, n2, c2), this.isDepthTexture = true, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
    }
    copy(e17) {
      return super.copy(e17), this.source = new yt(Object.assign({}, e17.image)), this.compareFunction = e17.compareFunction, this;
    }
    toJSON(e17) {
      let t2 = super.toJSON(e17);
      return this.compareFunction !== null && (t2.compareFunction = this.compareFunction), t2;
    }
  };
  var mi = class extends Ct {
    constructor(e17 = null) {
      super(), this.sourceTexture = e17, this.isExternalTexture = true;
    }
    copy(e17) {
      return super.copy(e17), this.sourceTexture = e17.sourceTexture, this;
    }
  };
  var hi = class e13 extends pr {
    constructor(e17 = 1, t2 = 1, n2 = 1, r2 = 1) {
      super(), this.type = `PlaneGeometry`, this.parameters = { width: e17, height: t2, widthSegments: n2, heightSegments: r2 };
      let i2 = e17 / 2, a2 = t2 / 2, o2 = Math.floor(n2), s2 = Math.floor(r2), c2 = o2 + 1, l2 = s2 + 1, u2 = e17 / o2, d2 = t2 / s2, f2 = [], p2 = [], m2 = [], h2 = [];
      for (let e18 = 0; e18 < l2; e18++) {
        let t3 = e18 * d2 - a2;
        for (let n3 = 0; n3 < c2; n3++) {
          let r3 = n3 * u2 - i2;
          p2.push(r3, -t3, 0), m2.push(0, 0, 1), h2.push(n3 / o2), h2.push(1 - e18 / s2);
        }
      }
      for (let e18 = 0; e18 < s2; e18++) for (let t3 = 0; t3 < o2; t3++) {
        let n3 = t3 + c2 * e18, r3 = t3 + c2 * (e18 + 1), i3 = t3 + 1 + c2 * (e18 + 1), a3 = t3 + 1 + c2 * e18;
        f2.push(n3, r3, a3), f2.push(r3, i3, a3);
      }
      this.setIndex(f2), this.setAttribute(`position`, new ar(p2, 3)), this.setAttribute(`normal`, new ar(m2, 3)), this.setAttribute(`uv`, new ar(h2, 2));
    }
    copy(e17) {
      return super.copy(e17), this.parameters = Object.assign({}, e17.parameters), this;
    }
    static fromJSON(t2) {
      return new e13(t2.width, t2.height, t2.widthSegments, t2.heightSegments);
    }
  };
  var gi = class extends Zn {
    constructor(e17) {
      super(), this.isMeshDepthMaterial = true, this.type = `MeshDepthMaterial`, this.depthPacking = Le, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(e17);
    }
    copy(e17) {
      return super.copy(e17), this.depthPacking = e17.depthPacking, this.map = e17.map, this.alphaMap = e17.alphaMap, this.displacementMap = e17.displacementMap, this.displacementScale = e17.displacementScale, this.displacementBias = e17.displacementBias, this.wireframe = e17.wireframe, this.wireframeLinewidth = e17.wireframeLinewidth, this;
    }
  };
  var _i = class extends Zn {
    constructor(e17) {
      super(), this.isMeshDistanceMaterial = true, this.type = `MeshDistanceMaterial`, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e17);
    }
    copy(e17) {
      return super.copy(e17), this.map = e17.map, this.alphaMap = e17.alphaMap, this.displacementMap = e17.displacementMap, this.displacementScale = e17.displacementScale, this.displacementBias = e17.displacementBias, this;
    }
  };
  function vi(e17, t2) {
    return !e17 || e17.constructor === t2 ? e17 : typeof t2.BYTES_PER_ELEMENT == `number` ? new t2(e17) : Array.prototype.slice.call(e17);
  }
  function yi(e17) {
    return ArrayBuffer.isView(e17) && !(e17 instanceof DataView);
  }
  var bi = class {
    constructor(e17, t2, n2, r2) {
      this.parameterPositions = e17, this._cachedIndex = 0, this.resultBuffer = r2 === void 0 ? new t2.constructor(n2) : r2, this.sampleValues = t2, this.valueSize = n2, this.settings = null, this.DefaultSettings_ = {};
    }
    evaluate(e17) {
      let t2 = this.parameterPositions, n2 = this._cachedIndex, r2 = t2[n2], i2 = t2[n2 - 1];
      validate_interval: {
        seek: {
          let a2;
          linear_scan: {
            forward_scan: if (!(e17 < r2)) {
              for (let a3 = n2 + 2; ; ) {
                if (r2 === void 0) {
                  if (e17 < i2) break forward_scan;
                  return n2 = t2.length, this._cachedIndex = n2, this.copySampleValue_(n2 - 1);
                }
                if (n2 === a3) break;
                if (i2 = r2, r2 = t2[++n2], e17 < r2) break seek;
              }
              a2 = t2.length;
              break linear_scan;
            }
            if (!(e17 >= i2)) {
              let o2 = t2[1];
              e17 < o2 && (n2 = 2, i2 = o2);
              for (let a3 = n2 - 2; ; ) {
                if (i2 === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
                if (n2 === a3) break;
                if (r2 = i2, i2 = t2[--n2 - 1], e17 >= i2) break seek;
              }
              a2 = n2, n2 = 0;
              break linear_scan;
            }
            break validate_interval;
          }
          for (; n2 < a2; ) {
            let r3 = n2 + a2 >>> 1;
            e17 < t2[r3] ? a2 = r3 : n2 = r3 + 1;
          }
          if (r2 = t2[n2], i2 = t2[n2 - 1], i2 === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
          if (r2 === void 0) return n2 = t2.length, this._cachedIndex = n2, this.copySampleValue_(n2 - 1);
        }
        this._cachedIndex = n2, this.intervalChanged_(n2, i2, r2);
      }
      return this.interpolate_(n2, i2, e17, r2);
    }
    getSettings_() {
      return this.settings || this.DefaultSettings_;
    }
    copySampleValue_(e17) {
      let t2 = this.resultBuffer, n2 = this.sampleValues, r2 = this.valueSize, i2 = e17 * r2;
      for (let e18 = 0; e18 !== r2; ++e18) t2[e18] = n2[i2 + e18];
      return t2;
    }
    interpolate_() {
      throw Error(`call to abstract method`);
    }
    intervalChanged_() {
    }
  };
  var xi = class extends bi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = { endingStart: Pe, endingEnd: Pe };
    }
    intervalChanged_(e17, t2, n2) {
      let r2 = this.parameterPositions, i2 = e17 - 2, a2 = e17 + 1, o2 = r2[i2], s2 = r2[a2];
      if (o2 === void 0) switch (this.getSettings_().endingStart) {
        case Fe:
          i2 = e17, o2 = 2 * t2 - n2;
          break;
        case Ie:
          i2 = r2.length - 2, o2 = t2 + r2[i2] - r2[i2 + 1];
          break;
        default:
          i2 = e17, o2 = n2;
      }
      if (s2 === void 0) switch (this.getSettings_().endingEnd) {
        case Fe:
          a2 = e17, s2 = 2 * n2 - t2;
          break;
        case Ie:
          a2 = 1, s2 = n2 + r2[1] - r2[0];
          break;
        default:
          a2 = e17 - 1, s2 = t2;
      }
      let c2 = (n2 - t2) * 0.5, l2 = this.valueSize;
      this._weightPrev = c2 / (t2 - o2), this._weightNext = c2 / (s2 - n2), this._offsetPrev = i2 * l2, this._offsetNext = a2 * l2;
    }
    interpolate_(e17, t2, n2, r2) {
      let i2 = this.resultBuffer, a2 = this.sampleValues, o2 = this.valueSize, s2 = e17 * o2, c2 = s2 - o2, l2 = this._offsetPrev, u2 = this._offsetNext, d2 = this._weightPrev, f2 = this._weightNext, p2 = (n2 - t2) / (r2 - t2), m2 = p2 * p2, h2 = m2 * p2, g2 = -d2 * h2 + 2 * d2 * m2 - d2 * p2, _2 = (1 + d2) * h2 + (-1.5 - 2 * d2) * m2 + (-0.5 + d2) * p2 + 1, v2 = (-1 - f2) * h2 + (1.5 + f2) * m2 + 0.5 * p2, y2 = f2 * h2 - f2 * m2;
      for (let e18 = 0; e18 !== o2; ++e18) i2[e18] = g2 * a2[l2 + e18] + _2 * a2[c2 + e18] + v2 * a2[s2 + e18] + y2 * a2[u2 + e18];
      return i2;
    }
  };
  var Si = class extends bi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
    interpolate_(e17, t2, n2, r2) {
      let i2 = this.resultBuffer, a2 = this.sampleValues, o2 = this.valueSize, s2 = e17 * o2, c2 = s2 - o2, l2 = (n2 - t2) / (r2 - t2), u2 = 1 - l2;
      for (let e18 = 0; e18 !== o2; ++e18) i2[e18] = a2[c2 + e18] * u2 + a2[s2 + e18] * l2;
      return i2;
    }
  };
  var Ci = class extends bi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
    interpolate_(e17) {
      return this.copySampleValue_(e17 - 1);
    }
  };
  var wi = class {
    constructor(e17, t2, n2, r2) {
      if (e17 === void 0) throw Error(`THREE.KeyframeTrack: track name is undefined`);
      if (t2 === void 0 || t2.length === 0) throw Error(`THREE.KeyframeTrack: no keyframes in track named ` + e17);
      this.name = e17, this.times = vi(t2, this.TimeBufferType), this.values = vi(n2, this.ValueBufferType), this.setInterpolation(r2 || this.DefaultInterpolation);
    }
    static toJSON(e17) {
      let t2 = e17.constructor, n2;
      if (t2.toJSON !== this.toJSON) n2 = t2.toJSON(e17);
      else {
        n2 = { name: e17.name, times: vi(e17.times, Array), values: vi(e17.values, Array) };
        let t3 = e17.getInterpolation();
        t3 !== e17.DefaultInterpolation && (n2.interpolation = t3);
      }
      return n2.type = e17.ValueTypeName, n2;
    }
    InterpolantFactoryMethodDiscrete(e17) {
      return new Ci(this.times, this.values, this.getValueSize(), e17);
    }
    InterpolantFactoryMethodLinear(e17) {
      return new Si(this.times, this.values, this.getValueSize(), e17);
    }
    InterpolantFactoryMethodSmooth(e17) {
      return new xi(this.times, this.values, this.getValueSize(), e17);
    }
    setInterpolation(e17) {
      let t2;
      switch (e17) {
        case je:
          t2 = this.InterpolantFactoryMethodDiscrete;
          break;
        case Me:
          t2 = this.InterpolantFactoryMethodLinear;
          break;
        case Ne:
          t2 = this.InterpolantFactoryMethodSmooth;
          break;
      }
      if (t2 === void 0) {
        let t3 = `unsupported interpolation for ` + this.ValueTypeName + ` keyframe track named ` + this.name;
        if (this.createInterpolant === void 0) if (e17 !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
        else throw Error(t3);
        return console.warn(`THREE.KeyframeTrack:`, t3), this;
      }
      return this.createInterpolant = t2, this;
    }
    getInterpolation() {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return je;
        case this.InterpolantFactoryMethodLinear:
          return Me;
        case this.InterpolantFactoryMethodSmooth:
          return Ne;
      }
    }
    getValueSize() {
      return this.values.length / this.times.length;
    }
    shift(e17) {
      if (e17 !== 0) {
        let t2 = this.times;
        for (let n2 = 0, r2 = t2.length; n2 !== r2; ++n2) t2[n2] += e17;
      }
      return this;
    }
    scale(e17) {
      if (e17 !== 1) {
        let t2 = this.times;
        for (let n2 = 0, r2 = t2.length; n2 !== r2; ++n2) t2[n2] *= e17;
      }
      return this;
    }
    trim(e17, t2) {
      let n2 = this.times, r2 = n2.length, i2 = 0, a2 = r2 - 1;
      for (; i2 !== r2 && n2[i2] < e17; ) ++i2;
      for (; a2 !== -1 && n2[a2] > t2; ) --a2;
      if (++a2, i2 !== 0 || a2 !== r2) {
        i2 >= a2 && (a2 = Math.max(a2, 1), i2 = a2 - 1);
        let e18 = this.getValueSize();
        this.times = n2.slice(i2, a2), this.values = this.values.slice(i2 * e18, a2 * e18);
      }
      return this;
    }
    validate() {
      let e17 = true, t2 = this.getValueSize();
      t2 - Math.floor(t2) !== 0 && (console.error(`THREE.KeyframeTrack: Invalid value size in track.`, this), e17 = false);
      let n2 = this.times, r2 = this.values, i2 = n2.length;
      i2 === 0 && (console.error(`THREE.KeyframeTrack: Track is empty.`, this), e17 = false);
      let a2 = null;
      for (let t3 = 0; t3 !== i2; t3++) {
        let r3 = n2[t3];
        if (typeof r3 == `number` && isNaN(r3)) {
          console.error(`THREE.KeyframeTrack: Time is not a valid number.`, this, t3, r3), e17 = false;
          break;
        }
        if (a2 !== null && a2 > r3) {
          console.error(`THREE.KeyframeTrack: Out of order keys.`, this, t3, r3, a2), e17 = false;
          break;
        }
        a2 = r3;
      }
      if (r2 !== void 0 && yi(r2)) for (let t3 = 0, n3 = r2.length; t3 !== n3; ++t3) {
        let n4 = r2[t3];
        if (isNaN(n4)) {
          console.error(`THREE.KeyframeTrack: Value is not a valid number.`, this, t3, n4), e17 = false;
          break;
        }
      }
      return e17;
    }
    optimize() {
      let e17 = this.times.slice(), t2 = this.values.slice(), n2 = this.getValueSize(), r2 = this.getInterpolation() === Ne, i2 = e17.length - 1, a2 = 1;
      for (let o2 = 1; o2 < i2; ++o2) {
        let i3 = false, s2 = e17[o2];
        if (s2 !== e17[o2 + 1] && (o2 !== 1 || s2 !== e17[0])) if (r2) i3 = true;
        else {
          let e18 = o2 * n2, r3 = e18 - n2, a3 = e18 + n2;
          for (let o3 = 0; o3 !== n2; ++o3) {
            let n3 = t2[e18 + o3];
            if (n3 !== t2[r3 + o3] || n3 !== t2[a3 + o3]) {
              i3 = true;
              break;
            }
          }
        }
        if (i3) {
          if (o2 !== a2) {
            e17[a2] = e17[o2];
            let r3 = o2 * n2, i4 = a2 * n2;
            for (let e18 = 0; e18 !== n2; ++e18) t2[i4 + e18] = t2[r3 + e18];
          }
          ++a2;
        }
      }
      if (i2 > 0) {
        e17[a2] = e17[i2];
        for (let e18 = i2 * n2, r3 = a2 * n2, o2 = 0; o2 !== n2; ++o2) t2[r3 + o2] = t2[e18 + o2];
        ++a2;
      }
      return a2 === e17.length ? (this.times = e17, this.values = t2) : (this.times = e17.slice(0, a2), this.values = t2.slice(0, a2 * n2)), this;
    }
    clone() {
      let e17 = this.times.slice(), t2 = this.values.slice(), n2 = this.constructor, r2 = new n2(this.name, e17, t2);
      return r2.createInterpolant = this.createInterpolant, r2;
    }
  };
  wi.prototype.ValueTypeName = ``, wi.prototype.TimeBufferType = Float32Array, wi.prototype.ValueBufferType = Float32Array, wi.prototype.DefaultInterpolation = Me;
  var Ti = class extends wi {
    constructor(e17, t2, n2) {
      super(e17, t2, n2);
    }
  };
  Ti.prototype.ValueTypeName = `bool`, Ti.prototype.ValueBufferType = Array, Ti.prototype.DefaultInterpolation = je, Ti.prototype.InterpolantFactoryMethodLinear = void 0, Ti.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Ei = class extends wi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
  };
  Ei.prototype.ValueTypeName = `color`;
  var Di = class extends wi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
  };
  Di.prototype.ValueTypeName = `number`;
  var Oi = class extends bi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
    interpolate_(e17, t2, n2, r2) {
      let i2 = this.resultBuffer, a2 = this.sampleValues, o2 = this.valueSize, s2 = (n2 - t2) / (r2 - t2), c2 = e17 * o2;
      for (let e18 = c2 + o2; c2 !== e18; c2 += 4) tt.slerpFlat(i2, 0, a2, c2 - o2, a2, c2, s2);
      return i2;
    }
  };
  var ki = class extends wi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
    InterpolantFactoryMethodLinear(e17) {
      return new Oi(this.times, this.values, this.getValueSize(), e17);
    }
  };
  ki.prototype.ValueTypeName = `quaternion`, ki.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Ai = class extends wi {
    constructor(e17, t2, n2) {
      super(e17, t2, n2);
    }
  };
  Ai.prototype.ValueTypeName = `string`, Ai.prototype.ValueBufferType = Array, Ai.prototype.DefaultInterpolation = je, Ai.prototype.InterpolantFactoryMethodLinear = void 0, Ai.prototype.InterpolantFactoryMethodSmooth = void 0;
  var ji = class extends wi {
    constructor(e17, t2, n2, r2) {
      super(e17, t2, n2, r2);
    }
  };
  ji.prototype.ValueTypeName = `vector`;
  var Mi = new class {
    constructor(e17, t2, n2) {
      let r2 = this, i2 = false, a2 = 0, o2 = 0, s2, c2 = [];
      this.onStart = void 0, this.onLoad = e17, this.onProgress = t2, this.onError = n2, this.abortController = new AbortController(), this.itemStart = function(e18) {
        o2++, i2 === false && r2.onStart !== void 0 && r2.onStart(e18, a2, o2), i2 = true;
      }, this.itemEnd = function(e18) {
        a2++, r2.onProgress !== void 0 && r2.onProgress(e18, a2, o2), a2 === o2 && (i2 = false, r2.onLoad !== void 0 && r2.onLoad());
      }, this.itemError = function(e18) {
        r2.onError !== void 0 && r2.onError(e18);
      }, this.resolveURL = function(e18) {
        return s2 ? s2(e18) : e18;
      }, this.setURLModifier = function(e18) {
        return s2 = e18, this;
      }, this.addHandler = function(e18, t3) {
        return c2.push(e18, t3), this;
      }, this.removeHandler = function(e18) {
        let t3 = c2.indexOf(e18);
        return t3 !== -1 && c2.splice(t3, 2), this;
      }, this.getHandler = function(e18) {
        for (let t3 = 0, n3 = c2.length; t3 < n3; t3 += 2) {
          let n4 = c2[t3], r3 = c2[t3 + 1];
          if (n4.global && (n4.lastIndex = 0), n4.test(e18)) return r3;
        }
        return null;
      }, this.abort = function() {
        return this.abortController.abort(), this.abortController = new AbortController(), this;
      };
    }
  }();
  var Ni = class {
    constructor(e17) {
      this.manager = e17 === void 0 ? Mi : e17, this.crossOrigin = `anonymous`, this.withCredentials = false, this.path = ``, this.resourcePath = ``, this.requestHeader = {};
    }
    load() {
    }
    loadAsync(e17, t2) {
      let n2 = this;
      return new Promise(function(r2, i2) {
        n2.load(e17, r2, t2, i2);
      });
    }
    parse() {
    }
    setCrossOrigin(e17) {
      return this.crossOrigin = e17, this;
    }
    setWithCredentials(e17) {
      return this.withCredentials = e17, this;
    }
    setPath(e17) {
      return this.path = e17, this;
    }
    setResourcePath(e17) {
      return this.resourcePath = e17, this;
    }
    setRequestHeader(e17) {
      return this.requestHeader = e17, this;
    }
    abort() {
      return this;
    }
  };
  Ni.DEFAULT_MATERIAL_NAME = `__DEFAULT`;
  var Pi = class extends Lr {
    constructor(e17 = -1, t2 = 1, n2 = 1, r2 = -1, i2 = 0.1, a2 = 2e3) {
      super(), this.isOrthographicCamera = true, this.type = `OrthographicCamera`, this.zoom = 1, this.view = null, this.left = e17, this.right = t2, this.top = n2, this.bottom = r2, this.near = i2, this.far = a2, this.updateProjectionMatrix();
    }
    copy(e17, t2) {
      return super.copy(e17, t2), this.left = e17.left, this.right = e17.right, this.top = e17.top, this.bottom = e17.bottom, this.near = e17.near, this.far = e17.far, this.zoom = e17.zoom, this.view = e17.view === null ? null : Object.assign({}, e17.view), this;
    }
    setViewOffset(e17, t2, n2, r2, i2, a2) {
      this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e17, this.view.fullHeight = t2, this.view.offsetX = n2, this.view.offsetY = r2, this.view.width = i2, this.view.height = a2, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      let e17 = (this.right - this.left) / (2 * this.zoom), t2 = (this.top - this.bottom) / (2 * this.zoom), n2 = (this.right + this.left) / 2, r2 = (this.top + this.bottom) / 2, i2 = n2 - e17, a2 = n2 + e17, o2 = r2 + t2, s2 = r2 - t2;
      if (this.view !== null && this.view.enabled) {
        let e18 = (this.right - this.left) / this.view.fullWidth / this.zoom, t3 = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
        i2 += e18 * this.view.offsetX, a2 = i2 + e18 * this.view.width, o2 -= t3 * this.view.offsetY, s2 = o2 - t3 * this.view.height;
      }
      this.projectionMatrix.makeOrthographic(i2, a2, o2, s2, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e17) {
      let t2 = super.toJSON(e17);
      return t2.object.zoom = this.zoom, t2.object.left = this.left, t2.object.right = this.right, t2.object.top = this.top, t2.object.bottom = this.bottom, t2.object.near = this.near, t2.object.far = this.far, this.view !== null && (t2.object.view = Object.assign({}, this.view)), t2;
    }
  };
  var Fi = class extends Vr {
    constructor(e17 = []) {
      super(), this.isArrayCamera = true, this.isMultiViewCamera = false, this.cameras = e17;
    }
  };
  var Ii = class {
    constructor(e17 = true) {
      this.autoStart = e17, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = false;
    }
    start() {
      this.startTime = performance.now(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = true;
    }
    stop() {
      this.getElapsedTime(), this.running = false, this.autoStart = false;
    }
    getElapsedTime() {
      return this.getDelta(), this.elapsedTime;
    }
    getDelta() {
      let e17 = 0;
      if (this.autoStart && !this.running) return this.start(), 0;
      if (this.running) {
        let t2 = performance.now();
        e17 = (t2 - this.oldTime) / 1e3, this.oldTime = t2, this.elapsedTime += e17;
      }
      return e17;
    }
  };
  var Li = `\\[\\]\\.:\\/`;
  var Ri = RegExp(`[\\[\\]\\.:\\/]`, `g`);
  var zi = `[^\\[\\]\\.:\\/]`;
  var Bi = `[^` + Li.replace(`\\.`, ``) + `]`;
  var Vi = `((?:WC+[\\/:])*)`.replace(`WC`, zi);
  var Hi = `(WCOD+)?`.replace(`WCOD`, Bi);
  var Ui = `(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`, zi);
  var Wi = `\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`, zi);
  var Gi = RegExp(`^` + Vi + Hi + Ui + Wi + `$`);
  var Ki = [`material`, `materials`, `bones`, `map`];
  var qi = class {
    constructor(e17, t2, n2) {
      let r2 = n2 || J.parseTrackName(t2);
      this._targetGroup = e17, this._bindings = e17.subscribe_(t2, r2);
    }
    getValue(e17, t2) {
      this.bind();
      let n2 = this._targetGroup.nCachedObjects_, r2 = this._bindings[n2];
      r2 !== void 0 && r2.getValue(e17, t2);
    }
    setValue(e17, t2) {
      let n2 = this._bindings;
      for (let r2 = this._targetGroup.nCachedObjects_, i2 = n2.length; r2 !== i2; ++r2) n2[r2].setValue(e17, t2);
    }
    bind() {
      let e17 = this._bindings;
      for (let t2 = this._targetGroup.nCachedObjects_, n2 = e17.length; t2 !== n2; ++t2) e17[t2].bind();
    }
    unbind() {
      let e17 = this._bindings;
      for (let t2 = this._targetGroup.nCachedObjects_, n2 = e17.length; t2 !== n2; ++t2) e17[t2].unbind();
    }
  };
  var J = class e14 {
    constructor(t2, n2, r2) {
      this.path = n2, this.parsedPath = r2 || e14.parseTrackName(n2), this.node = e14.findNode(t2, this.parsedPath.nodeName), this.rootNode = t2, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
    static create(t2, n2, r2) {
      return t2 && t2.isAnimationObjectGroup ? new e14.Composite(t2, n2, r2) : new e14(t2, n2, r2);
    }
    static sanitizeNodeName(e17) {
      return e17.replace(/\s/g, `_`).replace(Ri, ``);
    }
    static parseTrackName(e17) {
      let t2 = Gi.exec(e17);
      if (t2 === null) throw Error(`PropertyBinding: Cannot parse trackName: ` + e17);
      let n2 = { nodeName: t2[2], objectName: t2[3], objectIndex: t2[4], propertyName: t2[5], propertyIndex: t2[6] }, r2 = n2.nodeName && n2.nodeName.lastIndexOf(`.`);
      if (r2 !== void 0 && r2 !== -1) {
        let e18 = n2.nodeName.substring(r2 + 1);
        Ki.indexOf(e18) !== -1 && (n2.nodeName = n2.nodeName.substring(0, r2), n2.objectName = e18);
      }
      if (n2.propertyName === null || n2.propertyName.length === 0) throw Error(`PropertyBinding: can not parse propertyName from trackName: ` + e17);
      return n2;
    }
    static findNode(e17, t2) {
      if (t2 === void 0 || t2 === `` || t2 === `.` || t2 === -1 || t2 === e17.name || t2 === e17.uuid) return e17;
      if (e17.skeleton) {
        let n2 = e17.skeleton.getBoneByName(t2);
        if (n2 !== void 0) return n2;
      }
      if (e17.children) {
        let n2 = function(e18) {
          for (let r3 = 0; r3 < e18.length; r3++) {
            let i2 = e18[r3];
            if (i2.name === t2 || i2.uuid === t2) return i2;
            let a2 = n2(i2.children);
            if (a2) return a2;
          }
          return null;
        }, r2 = n2(e17.children);
        if (r2) return r2;
      }
      return null;
    }
    _getValue_unavailable() {
    }
    _setValue_unavailable() {
    }
    _getValue_direct(e17, t2) {
      e17[t2] = this.targetObject[this.propertyName];
    }
    _getValue_array(e17, t2) {
      let n2 = this.resolvedProperty;
      for (let r2 = 0, i2 = n2.length; r2 !== i2; ++r2) e17[t2++] = n2[r2];
    }
    _getValue_arrayElement(e17, t2) {
      e17[t2] = this.resolvedProperty[this.propertyIndex];
    }
    _getValue_toArray(e17, t2) {
      this.resolvedProperty.toArray(e17, t2);
    }
    _setValue_direct(e17, t2) {
      this.targetObject[this.propertyName] = e17[t2];
    }
    _setValue_direct_setNeedsUpdate(e17, t2) {
      this.targetObject[this.propertyName] = e17[t2], this.targetObject.needsUpdate = true;
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(e17, t2) {
      this.targetObject[this.propertyName] = e17[t2], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_array(e17, t2) {
      let n2 = this.resolvedProperty;
      for (let r2 = 0, i2 = n2.length; r2 !== i2; ++r2) n2[r2] = e17[t2++];
    }
    _setValue_array_setNeedsUpdate(e17, t2) {
      let n2 = this.resolvedProperty;
      for (let r2 = 0, i2 = n2.length; r2 !== i2; ++r2) n2[r2] = e17[t2++];
      this.targetObject.needsUpdate = true;
    }
    _setValue_array_setMatrixWorldNeedsUpdate(e17, t2) {
      let n2 = this.resolvedProperty;
      for (let r2 = 0, i2 = n2.length; r2 !== i2; ++r2) n2[r2] = e17[t2++];
      this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_arrayElement(e17, t2) {
      this.resolvedProperty[this.propertyIndex] = e17[t2];
    }
    _setValue_arrayElement_setNeedsUpdate(e17, t2) {
      this.resolvedProperty[this.propertyIndex] = e17[t2], this.targetObject.needsUpdate = true;
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(e17, t2) {
      this.resolvedProperty[this.propertyIndex] = e17[t2], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_fromArray(e17, t2) {
      this.resolvedProperty.fromArray(e17, t2);
    }
    _setValue_fromArray_setNeedsUpdate(e17, t2) {
      this.resolvedProperty.fromArray(e17, t2), this.targetObject.needsUpdate = true;
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(e17, t2) {
      this.resolvedProperty.fromArray(e17, t2), this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _getValue_unbound(e17, t2) {
      this.bind(), this.getValue(e17, t2);
    }
    _setValue_unbound(e17, t2) {
      this.bind(), this.setValue(e17, t2);
    }
    bind() {
      let t2 = this.node, n2 = this.parsedPath, r2 = n2.objectName, i2 = n2.propertyName, a2 = n2.propertyIndex;
      if (t2 || (t2 = e14.findNode(this.rootNode, n2.nodeName), this.node = t2), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t2) {
        console.warn(`THREE.PropertyBinding: No target node found for track: ` + this.path + `.`);
        return;
      }
      if (r2) {
        let e17 = n2.objectIndex;
        switch (r2) {
          case `materials`:
            if (!t2.material) {
              console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`, this);
              return;
            }
            if (!t2.material.materials) {
              console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`, this);
              return;
            }
            t2 = t2.material.materials;
            break;
          case `bones`:
            if (!t2.skeleton) {
              console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`, this);
              return;
            }
            t2 = t2.skeleton.bones;
            for (let n3 = 0; n3 < t2.length; n3++) if (t2[n3].name === e17) {
              e17 = n3;
              break;
            }
            break;
          case `map`:
            if (`map` in t2) {
              t2 = t2.map;
              break;
            }
            if (!t2.material) {
              console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`, this);
              return;
            }
            if (!t2.material.map) {
              console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`, this);
              return;
            }
            t2 = t2.material.map;
            break;
          default:
            if (t2[r2] === void 0) {
              console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`, this);
              return;
            }
            t2 = t2[r2];
        }
        if (e17 !== void 0) {
          if (t2[e17] === void 0) {
            console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`, this, t2);
            return;
          }
          t2 = t2[e17];
        }
      }
      let o2 = t2[i2];
      if (o2 === void 0) {
        let e17 = n2.nodeName;
        console.error(`THREE.PropertyBinding: Trying to update property for track: ` + e17 + `.` + i2 + ` but it wasn't found.`, t2);
        return;
      }
      let s2 = this.Versioning.None;
      this.targetObject = t2, t2.isMaterial === true ? s2 = this.Versioning.NeedsUpdate : t2.isObject3D === true && (s2 = this.Versioning.MatrixWorldNeedsUpdate);
      let c2 = this.BindingType.Direct;
      if (a2 !== void 0) {
        if (i2 === `morphTargetInfluences`) {
          if (!t2.geometry) {
            console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`, this);
            return;
          }
          if (!t2.geometry.morphAttributes) {
            console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`, this);
            return;
          }
          t2.morphTargetDictionary[a2] !== void 0 && (a2 = t2.morphTargetDictionary[a2]);
        }
        c2 = this.BindingType.ArrayElement, this.resolvedProperty = o2, this.propertyIndex = a2;
      } else o2.fromArray !== void 0 && o2.toArray !== void 0 ? (c2 = this.BindingType.HasFromToArray, this.resolvedProperty = o2) : Array.isArray(o2) ? (c2 = this.BindingType.EntireArray, this.resolvedProperty = o2) : this.propertyName = i2;
      this.getValue = this.GetterByBindingType[c2], this.setValue = this.SetterByBindingTypeAndVersioning[c2][s2];
    }
    unbind() {
      this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
  };
  J.Composite = qi, J.prototype.BindingType = { Direct: 0, EntireArray: 1, ArrayElement: 2, HasFromToArray: 3 }, J.prototype.Versioning = { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 }, J.prototype.GetterByBindingType = [J.prototype._getValue_direct, J.prototype._getValue_array, J.prototype._getValue_arrayElement, J.prototype._getValue_toArray], J.prototype.SetterByBindingTypeAndVersioning = [[J.prototype._setValue_direct, J.prototype._setValue_direct_setNeedsUpdate, J.prototype._setValue_direct_setMatrixWorldNeedsUpdate], [J.prototype._setValue_array, J.prototype._setValue_array_setNeedsUpdate, J.prototype._setValue_array_setMatrixWorldNeedsUpdate], [J.prototype._setValue_arrayElement, J.prototype._setValue_arrayElement_setNeedsUpdate, J.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate], [J.prototype._setValue_fromArray, J.prototype._setValue_fromArray_setNeedsUpdate, J.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];
  var Ji = new nn();
  var Yi = class {
    constructor(e17, t2, n2 = 0, r2 = 1 / 0) {
      this.ray = new tn(e17, t2), this.near = n2, this.far = r2, this.camera = null, this.layers = new mn(), this.params = { Mesh: {}, Line: { threshold: 1 }, LOD: {}, Points: { threshold: 1 }, Sprite: {} };
    }
    set(e17, t2) {
      this.ray.set(e17, t2);
    }
    setFromCamera(e17, t2) {
      t2.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t2.matrixWorld), this.ray.direction.set(e17.x, e17.y, 0.5).unproject(t2).sub(this.ray.origin).normalize(), this.camera = t2) : t2.isOrthographicCamera ? (this.ray.origin.set(e17.x, e17.y, (t2.near + t2.far) / (t2.near - t2.far)).unproject(t2), this.ray.direction.set(0, 0, -1).transformDirection(t2.matrixWorld), this.camera = t2) : console.error(`THREE.Raycaster: Unsupported camera type: ` + t2.type);
    }
    setFromXRController(e17) {
      return Ji.identity().extractRotation(e17.matrixWorld), this.ray.origin.setFromMatrixPosition(e17.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(Ji), this;
    }
    intersectObject(e17, t2 = true, n2 = []) {
      return Zi(e17, this, n2, t2), n2.sort(Xi), n2;
    }
    intersectObjects(e17, t2 = true, n2 = []) {
      for (let r2 = 0, i2 = e17.length; r2 < i2; r2++) Zi(e17[r2], this, n2, t2);
      return n2.sort(Xi), n2;
    }
  };
  function Xi(e17, t2) {
    return e17.distance - t2.distance;
  }
  function Zi(e17, t2, n2, r2) {
    let i2 = true;
    if (e17.layers.test(t2.layers) && e17.raycast(t2, n2) === false && (i2 = false), i2 === true && r2 === true) {
      let r3 = e17.children;
      for (let e18 = 0, i3 = r3.length; e18 < i3; e18++) Zi(r3[e18], t2, n2, true);
    }
  }
  function Qi(e17, t2, n2, r2) {
    let i2 = $i(r2);
    switch (n2) {
      case j:
        return e17 * t2;
      case P:
        return e17 * t2 / i2.components * i2.byteLength;
      case ne:
        return e17 * t2 / i2.components * i2.byteLength;
      case re:
        return e17 * t2 * 2 / i2.components * i2.byteLength;
      case ie:
        return e17 * t2 * 2 / i2.components * i2.byteLength;
      case ee:
        return e17 * t2 * 3 / i2.components * i2.byteLength;
      case te:
        return e17 * t2 * 4 / i2.components * i2.byteLength;
      case ae:
        return e17 * t2 * 4 / i2.components * i2.byteLength;
      case oe:
      case se:
        return Math.floor((e17 + 3) / 4) * Math.floor((t2 + 3) / 4) * 8;
      case F:
      case ce:
        return Math.floor((e17 + 3) / 4) * Math.floor((t2 + 3) / 4) * 16;
      case ue:
      case fe:
        return Math.max(e17, 16) * Math.max(t2, 8) / 4;
      case le:
      case de:
        return Math.max(e17, 8) * Math.max(t2, 8) / 2;
      case pe:
      case me:
        return Math.floor((e17 + 3) / 4) * Math.floor((t2 + 3) / 4) * 8;
      case I:
        return Math.floor((e17 + 3) / 4) * Math.floor((t2 + 3) / 4) * 16;
      case he:
        return Math.floor((e17 + 3) / 4) * Math.floor((t2 + 3) / 4) * 16;
      case L:
        return Math.floor((e17 + 4) / 5) * Math.floor((t2 + 3) / 4) * 16;
      case R:
        return Math.floor((e17 + 4) / 5) * Math.floor((t2 + 4) / 5) * 16;
      case z:
        return Math.floor((e17 + 5) / 6) * Math.floor((t2 + 4) / 5) * 16;
      case ge:
        return Math.floor((e17 + 5) / 6) * Math.floor((t2 + 5) / 6) * 16;
      case B:
        return Math.floor((e17 + 7) / 8) * Math.floor((t2 + 4) / 5) * 16;
      case V:
        return Math.floor((e17 + 7) / 8) * Math.floor((t2 + 5) / 6) * 16;
      case _e:
        return Math.floor((e17 + 7) / 8) * Math.floor((t2 + 7) / 8) * 16;
      case ve:
        return Math.floor((e17 + 9) / 10) * Math.floor((t2 + 4) / 5) * 16;
      case ye:
        return Math.floor((e17 + 9) / 10) * Math.floor((t2 + 5) / 6) * 16;
      case be:
        return Math.floor((e17 + 9) / 10) * Math.floor((t2 + 7) / 8) * 16;
      case xe:
        return Math.floor((e17 + 9) / 10) * Math.floor((t2 + 9) / 10) * 16;
      case Se:
        return Math.floor((e17 + 11) / 12) * Math.floor((t2 + 9) / 10) * 16;
      case Ce:
        return Math.floor((e17 + 11) / 12) * Math.floor((t2 + 11) / 12) * 16;
      case we:
      case Te:
      case Ee:
        return Math.ceil(e17 / 4) * Math.ceil(t2 / 4) * 16;
      case De:
      case Oe:
        return Math.ceil(e17 / 4) * Math.ceil(t2 / 4) * 8;
      case ke:
      case Ae:
        return Math.ceil(e17 / 4) * Math.ceil(t2 / 4) * 16;
    }
    throw Error(`Unable to determine texture byte length for ${n2} format.`);
  }
  function $i(e17) {
    switch (e17) {
      case v:
      case y:
        return { byteLength: 1, components: 1 };
      case x:
      case b:
      case T:
        return { byteLength: 2, components: 1 };
      case E:
      case D:
        return { byteLength: 2, components: 4 };
      case C:
      case S:
      case w:
        return { byteLength: 4, components: 1 };
      case k:
      case A:
        return { byteLength: 4, components: 3 };
    }
    throw Error(`Unknown texture type ${e17}.`);
  }
  typeof __THREE_DEVTOOLS__ < `u` && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`, { detail: { revision: `180` } })), typeof window < `u` && (window.__THREE__ ? console.warn(`WARNING: Multiple instances of Three.js being imported.`) : window.__THREE__ = `180`);
  function ea() {
    let e17 = null, t2 = false, n2 = null, r2 = null;
    function i2(t3, a2) {
      n2(t3, a2), r2 = e17.requestAnimationFrame(i2);
    }
    return { start: function() {
      t2 !== true && n2 !== null && (r2 = e17.requestAnimationFrame(i2), t2 = true);
    }, stop: function() {
      e17.cancelAnimationFrame(r2), t2 = false;
    }, setAnimationLoop: function(e18) {
      n2 = e18;
    }, setContext: function(t3) {
      e17 = t3;
    } };
  }
  function ta(e17) {
    let t2 = /* @__PURE__ */ new WeakMap();
    function n2(t3, n3) {
      let r3 = t3.array, i3 = t3.usage, a3 = r3.byteLength, o3 = e17.createBuffer();
      e17.bindBuffer(n3, o3), e17.bufferData(n3, r3, i3), t3.onUploadCallback();
      let s2;
      if (r3 instanceof Float32Array) s2 = e17.FLOAT;
      else if (typeof Float16Array < `u` && r3 instanceof Float16Array) s2 = e17.HALF_FLOAT;
      else if (r3 instanceof Uint16Array) s2 = t3.isFloat16BufferAttribute ? e17.HALF_FLOAT : e17.UNSIGNED_SHORT;
      else if (r3 instanceof Int16Array) s2 = e17.SHORT;
      else if (r3 instanceof Uint32Array) s2 = e17.UNSIGNED_INT;
      else if (r3 instanceof Int32Array) s2 = e17.INT;
      else if (r3 instanceof Int8Array) s2 = e17.BYTE;
      else if (r3 instanceof Uint8Array) s2 = e17.UNSIGNED_BYTE;
      else if (r3 instanceof Uint8ClampedArray) s2 = e17.UNSIGNED_BYTE;
      else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: ` + r3);
      return { buffer: o3, type: s2, bytesPerElement: r3.BYTES_PER_ELEMENT, version: t3.version, size: a3 };
    }
    function r2(t3, n3, r3) {
      let i3 = n3.array, a3 = n3.updateRanges;
      if (e17.bindBuffer(r3, t3), a3.length === 0) e17.bufferSubData(r3, 0, i3);
      else {
        a3.sort((e18, t5) => e18.start - t5.start);
        let t4 = 0;
        for (let e18 = 1; e18 < a3.length; e18++) {
          let n4 = a3[t4], r4 = a3[e18];
          r4.start <= n4.start + n4.count + 1 ? n4.count = Math.max(n4.count, r4.start + r4.count - n4.start) : (++t4, a3[t4] = r4);
        }
        a3.length = t4 + 1;
        for (let t5 = 0, n4 = a3.length; t5 < n4; t5++) {
          let n5 = a3[t5];
          e17.bufferSubData(r3, n5.start * i3.BYTES_PER_ELEMENT, i3, n5.start, n5.count);
        }
        n3.clearUpdateRanges();
      }
      n3.onUploadCallback();
    }
    function i2(e18) {
      return e18.isInterleavedBufferAttribute && (e18 = e18.data), t2.get(e18);
    }
    function a2(n3) {
      n3.isInterleavedBufferAttribute && (n3 = n3.data);
      let r3 = t2.get(n3);
      r3 && (e17.deleteBuffer(r3.buffer), t2.delete(n3));
    }
    function o2(e18, i3) {
      if (e18.isInterleavedBufferAttribute && (e18 = e18.data), e18.isGLBufferAttribute) {
        let n3 = t2.get(e18);
        (!n3 || n3.version < e18.version) && t2.set(e18, { buffer: e18.buffer, type: e18.type, bytesPerElement: e18.elementSize, version: e18.version });
        return;
      }
      let a3 = t2.get(e18);
      if (a3 === void 0) t2.set(e18, n2(e18, i3));
      else if (a3.version < e18.version) {
        if (a3.size !== e18.array.byteLength) throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);
        r2(a3.buffer, e18, i3), a3.version = e18.version;
      }
    }
    return { get: i2, remove: a2, update: o2 };
  }
  var Y = { alphahash_fragment: `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, alphahash_pars_fragment: `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, alphamap_fragment: `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, alphamap_pars_fragment: `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, alphatest_fragment: `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, alphatest_pars_fragment: `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, aomap_fragment: `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, aomap_pars_fragment: `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, batching_pars_vertex: `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, batching_vertex: `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, begin_vertex: `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, beginnormal_vertex: `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, bsdfs: `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, iridescence_fragment: `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, bumpmap_pars_fragment: `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, clipping_planes_fragment: `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, clipping_planes_pars_fragment: `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, clipping_planes_pars_vertex: `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, clipping_planes_vertex: `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, color_fragment: `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, color_pars_fragment: `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, color_pars_vertex: `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, color_vertex: `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, common: `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, cube_uv_reflection_fragment: `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, defaultnormal_vertex: `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, displacementmap_pars_vertex: `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, displacementmap_vertex: `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, emissivemap_fragment: `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, emissivemap_pars_fragment: `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, colorspace_fragment: `gl_FragColor = linearToOutputTexel( gl_FragColor );`, colorspace_pars_fragment: `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, envmap_fragment: `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, envmap_common_pars_fragment: `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, envmap_pars_fragment: `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, envmap_pars_vertex: `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, envmap_physical_pars_fragment: `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, envmap_vertex: `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, fog_vertex: `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, fog_pars_vertex: `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, fog_fragment: `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, fog_pars_fragment: `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, gradientmap_pars_fragment: `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, lightmap_pars_fragment: `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, lights_lambert_fragment: `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, lights_lambert_pars_fragment: `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, lights_pars_begin: `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, lights_toon_fragment: `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, lights_toon_pars_fragment: `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, lights_phong_fragment: `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, lights_phong_pars_fragment: `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, lights_physical_fragment: `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, lights_physical_pars_fragment: `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, lights_fragment_begin: `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, lights_fragment_maps: `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, lights_fragment_end: `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, logdepthbuf_fragment: `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, logdepthbuf_pars_fragment: `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, logdepthbuf_pars_vertex: `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, logdepthbuf_vertex: `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, map_fragment: `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, map_pars_fragment: `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, map_particle_fragment: `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, map_particle_pars_fragment: `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, metalnessmap_fragment: `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, metalnessmap_pars_fragment: `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, morphinstance_vertex: `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, morphcolor_vertex: `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, morphnormal_vertex: `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, morphtarget_pars_vertex: `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, morphtarget_vertex: `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, normal_fragment_begin: `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, normal_fragment_maps: `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, normal_pars_fragment: `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, normal_pars_vertex: `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, normal_vertex: `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, normalmap_pars_fragment: `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, clearcoat_normal_fragment_begin: `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, clearcoat_normal_fragment_maps: `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, clearcoat_pars_fragment: `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, iridescence_pars_fragment: `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, opaque_fragment: `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, packing: `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, premultiplied_alpha_fragment: `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, project_vertex: `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, dithering_fragment: `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, dithering_pars_fragment: `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, roughnessmap_fragment: `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, roughnessmap_pars_fragment: `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, shadowmap_pars_fragment: `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, shadowmap_pars_vertex: `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, shadowmap_vertex: `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, shadowmask_pars_fragment: `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, skinbase_vertex: `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, skinning_pars_vertex: `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, skinning_vertex: `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, skinnormal_vertex: `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, specularmap_fragment: `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, specularmap_pars_fragment: `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, tonemapping_fragment: `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, tonemapping_pars_fragment: `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, transmission_fragment: `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, transmission_pars_fragment: `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, uv_pars_fragment: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, uv_pars_vertex: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, uv_vertex: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, worldpos_vertex: `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`, background_vert: `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, background_frag: `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, backgroundCube_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, backgroundCube_frag: `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, cube_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, cube_frag: `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, depth_vert: `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, depth_frag: `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, distanceRGBA_vert: `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, distanceRGBA_frag: `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, equirect_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, equirect_frag: `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, linedashed_vert: `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, linedashed_frag: `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, meshbasic_vert: `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, meshbasic_frag: `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, meshlambert_vert: `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, meshlambert_frag: `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, meshmatcap_vert: `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, meshmatcap_frag: `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, meshnormal_vert: `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, meshnormal_frag: `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, meshphong_vert: `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, meshphong_frag: `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, meshphysical_vert: `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, meshphysical_frag: `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, meshtoon_vert: `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, meshtoon_frag: `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, points_vert: `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, points_frag: `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, shadow_vert: `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, shadow_frag: `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, sprite_vert: `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, sprite_frag: `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}` };
  var X = { common: { diffuse: { value: new q(16777215) }, opacity: { value: 1 }, map: { value: null }, mapTransform: { value: new G() }, alphaMap: { value: null }, alphaMapTransform: { value: new G() }, alphaTest: { value: 0 } }, specularmap: { specularMap: { value: null }, specularMapTransform: { value: new G() } }, envmap: { envMap: { value: null }, envMapRotation: { value: new G() }, flipEnvMap: { value: -1 }, reflectivity: { value: 1 }, ior: { value: 1.5 }, refractionRatio: { value: 0.98 } }, aomap: { aoMap: { value: null }, aoMapIntensity: { value: 1 }, aoMapTransform: { value: new G() } }, lightmap: { lightMap: { value: null }, lightMapIntensity: { value: 1 }, lightMapTransform: { value: new G() } }, bumpmap: { bumpMap: { value: null }, bumpMapTransform: { value: new G() }, bumpScale: { value: 1 } }, normalmap: { normalMap: { value: null }, normalMapTransform: { value: new G() }, normalScale: { value: new U(1, 1) } }, displacementmap: { displacementMap: { value: null }, displacementMapTransform: { value: new G() }, displacementScale: { value: 1 }, displacementBias: { value: 0 } }, emissivemap: { emissiveMap: { value: null }, emissiveMapTransform: { value: new G() } }, metalnessmap: { metalnessMap: { value: null }, metalnessMapTransform: { value: new G() } }, roughnessmap: { roughnessMap: { value: null }, roughnessMapTransform: { value: new G() } }, gradientmap: { gradientMap: { value: null } }, fog: { fogDensity: { value: 25e-5 }, fogNear: { value: 1 }, fogFar: { value: 2e3 }, fogColor: { value: new q(16777215) } }, lights: { ambientLightColor: { value: [] }, lightProbe: { value: [] }, directionalLights: { value: [], properties: { direction: {}, color: {} } }, directionalLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, directionalShadowMap: { value: [] }, directionalShadowMatrix: { value: [] }, spotLights: { value: [], properties: { color: {}, position: {}, direction: {}, distance: {}, coneCos: {}, penumbraCos: {}, decay: {} } }, spotLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, spotLightMap: { value: [] }, spotShadowMap: { value: [] }, spotLightMatrix: { value: [] }, pointLights: { value: [], properties: { color: {}, position: {}, decay: {}, distance: {} } }, pointLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {}, shadowCameraNear: {}, shadowCameraFar: {} } }, pointShadowMap: { value: [] }, pointShadowMatrix: { value: [] }, hemisphereLights: { value: [], properties: { direction: {}, skyColor: {}, groundColor: {} } }, rectAreaLights: { value: [], properties: { color: {}, position: {}, width: {}, height: {} } }, ltc_1: { value: null }, ltc_2: { value: null } }, points: { diffuse: { value: new q(16777215) }, opacity: { value: 1 }, size: { value: 1 }, scale: { value: 1 }, map: { value: null }, alphaMap: { value: null }, alphaMapTransform: { value: new G() }, alphaTest: { value: 0 }, uvTransform: { value: new G() } }, sprite: { diffuse: { value: new q(16777215) }, opacity: { value: 1 }, center: { value: new U(0.5, 0.5) }, rotation: { value: 0 }, map: { value: null }, mapTransform: { value: new G() }, alphaMap: { value: null }, alphaMapTransform: { value: new G() }, alphaTest: { value: 0 } } };
  var na = { basic: { uniforms: Ar([X.common, X.specularmap, X.envmap, X.aomap, X.lightmap, X.fog]), vertexShader: Y.meshbasic_vert, fragmentShader: Y.meshbasic_frag }, lambert: { uniforms: Ar([X.common, X.specularmap, X.envmap, X.aomap, X.lightmap, X.emissivemap, X.bumpmap, X.normalmap, X.displacementmap, X.fog, X.lights, { emissive: { value: new q(0) } }]), vertexShader: Y.meshlambert_vert, fragmentShader: Y.meshlambert_frag }, phong: { uniforms: Ar([X.common, X.specularmap, X.envmap, X.aomap, X.lightmap, X.emissivemap, X.bumpmap, X.normalmap, X.displacementmap, X.fog, X.lights, { emissive: { value: new q(0) }, specular: { value: new q(1118481) }, shininess: { value: 30 } }]), vertexShader: Y.meshphong_vert, fragmentShader: Y.meshphong_frag }, standard: { uniforms: Ar([X.common, X.envmap, X.aomap, X.lightmap, X.emissivemap, X.bumpmap, X.normalmap, X.displacementmap, X.roughnessmap, X.metalnessmap, X.fog, X.lights, { emissive: { value: new q(0) }, roughness: { value: 1 }, metalness: { value: 0 }, envMapIntensity: { value: 1 } }]), vertexShader: Y.meshphysical_vert, fragmentShader: Y.meshphysical_frag }, toon: { uniforms: Ar([X.common, X.aomap, X.lightmap, X.emissivemap, X.bumpmap, X.normalmap, X.displacementmap, X.gradientmap, X.fog, X.lights, { emissive: { value: new q(0) } }]), vertexShader: Y.meshtoon_vert, fragmentShader: Y.meshtoon_frag }, matcap: { uniforms: Ar([X.common, X.bumpmap, X.normalmap, X.displacementmap, X.fog, { matcap: { value: null } }]), vertexShader: Y.meshmatcap_vert, fragmentShader: Y.meshmatcap_frag }, points: { uniforms: Ar([X.points, X.fog]), vertexShader: Y.points_vert, fragmentShader: Y.points_frag }, dashed: { uniforms: Ar([X.common, X.fog, { scale: { value: 1 }, dashSize: { value: 1 }, totalSize: { value: 2 } }]), vertexShader: Y.linedashed_vert, fragmentShader: Y.linedashed_frag }, depth: { uniforms: Ar([X.common, X.displacementmap]), vertexShader: Y.depth_vert, fragmentShader: Y.depth_frag }, normal: { uniforms: Ar([X.common, X.bumpmap, X.normalmap, X.displacementmap, { opacity: { value: 1 } }]), vertexShader: Y.meshnormal_vert, fragmentShader: Y.meshnormal_frag }, sprite: { uniforms: Ar([X.sprite, X.fog]), vertexShader: Y.sprite_vert, fragmentShader: Y.sprite_frag }, background: { uniforms: { uvTransform: { value: new G() }, t2D: { value: null }, backgroundIntensity: { value: 1 } }, vertexShader: Y.background_vert, fragmentShader: Y.background_frag }, backgroundCube: { uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 }, backgroundBlurriness: { value: 0 }, backgroundIntensity: { value: 1 }, backgroundRotation: { value: new G() } }, vertexShader: Y.backgroundCube_vert, fragmentShader: Y.backgroundCube_frag }, cube: { uniforms: { tCube: { value: null }, tFlip: { value: -1 }, opacity: { value: 1 } }, vertexShader: Y.cube_vert, fragmentShader: Y.cube_frag }, equirect: { uniforms: { tEquirect: { value: null } }, vertexShader: Y.equirect_vert, fragmentShader: Y.equirect_frag }, distanceRGBA: { uniforms: Ar([X.common, X.displacementmap, { referencePosition: { value: new W() }, nearDistance: { value: 1 }, farDistance: { value: 1e3 } }]), vertexShader: Y.distanceRGBA_vert, fragmentShader: Y.distanceRGBA_frag }, shadow: { uniforms: Ar([X.lights, X.fog, { color: { value: new q(0) }, opacity: { value: 1 } }]), vertexShader: Y.shadow_vert, fragmentShader: Y.shadow_frag } };
  na.physical = { uniforms: Ar([na.standard.uniforms, { clearcoat: { value: 0 }, clearcoatMap: { value: null }, clearcoatMapTransform: { value: new G() }, clearcoatNormalMap: { value: null }, clearcoatNormalMapTransform: { value: new G() }, clearcoatNormalScale: { value: new U(1, 1) }, clearcoatRoughness: { value: 0 }, clearcoatRoughnessMap: { value: null }, clearcoatRoughnessMapTransform: { value: new G() }, dispersion: { value: 0 }, iridescence: { value: 0 }, iridescenceMap: { value: null }, iridescenceMapTransform: { value: new G() }, iridescenceIOR: { value: 1.3 }, iridescenceThicknessMinimum: { value: 100 }, iridescenceThicknessMaximum: { value: 400 }, iridescenceThicknessMap: { value: null }, iridescenceThicknessMapTransform: { value: new G() }, sheen: { value: 0 }, sheenColor: { value: new q(0) }, sheenColorMap: { value: null }, sheenColorMapTransform: { value: new G() }, sheenRoughness: { value: 1 }, sheenRoughnessMap: { value: null }, sheenRoughnessMapTransform: { value: new G() }, transmission: { value: 0 }, transmissionMap: { value: null }, transmissionMapTransform: { value: new G() }, transmissionSamplerSize: { value: new U() }, transmissionSamplerMap: { value: null }, thickness: { value: 0 }, thicknessMap: { value: null }, thicknessMapTransform: { value: new G() }, attenuationDistance: { value: 0 }, attenuationColor: { value: new q(0) }, specularColor: { value: new q(1, 1, 1) }, specularColorMap: { value: null }, specularColorMapTransform: { value: new G() }, specularIntensity: { value: 1 }, specularIntensityMap: { value: null }, specularIntensityMapTransform: { value: new G() }, anisotropyVector: { value: new U() }, anisotropyMap: { value: null }, anisotropyMapTransform: { value: new G() } }]), vertexShader: Y.meshphysical_vert, fragmentShader: Y.meshphysical_frag };
  var ra = { r: 0, b: 0, g: 0 };
  var ia = new pn();
  var aa = new nn();
  function oa(e17, t2, n2, r2, i2, a2, o2) {
    let s2 = new q(0), c2 = a2 === true ? 0 : 1, l2, u2, d2 = null, f2 = 0, p2 = null;
    function m2(e18) {
      let r3 = e18.isScene === true ? e18.background : null;
      return r3 && r3.isTexture && (r3 = (e18.backgroundBlurriness > 0 ? n2 : t2).get(r3)), r3;
    }
    function h2(t3) {
      let n3 = false, i3 = m2(t3);
      i3 === null ? _2(s2, c2) : i3 && i3.isColor && (_2(i3, 1), n3 = true);
      let a3 = e17.xr.getEnvironmentBlendMode();
      a3 === `additive` ? r2.buffers.color.setClear(0, 0, 0, 1, o2) : a3 === `alpha-blend` && r2.buffers.color.setClear(0, 0, 0, 0, o2), (e17.autoClear || n3) && (r2.buffers.depth.setTest(true), r2.buffers.depth.setMask(true), r2.buffers.color.setMask(true), e17.clear(e17.autoClearColor, e17.autoClearDepth, e17.autoClearStencil));
    }
    function g2(t3, n3) {
      let r3 = m2(n3);
      r3 && (r3.isCubeTexture || r3.mapping === 306) ? (u2 === void 0 && (u2 = new Tr(new Or(1, 1, 1), new Ir({ name: `BackgroundCubeMaterial`, uniforms: kr(na.backgroundCube.uniforms), vertexShader: na.backgroundCube.vertexShader, fragmentShader: na.backgroundCube.fragmentShader, side: 1, depthTest: false, depthWrite: false, fog: false, allowOverride: false })), u2.geometry.deleteAttribute(`normal`), u2.geometry.deleteAttribute(`uv`), u2.onBeforeRender = function(e18, t4, n4) {
        this.matrixWorld.copyPosition(n4.matrixWorld);
      }, Object.defineProperty(u2.material, "envMap", { get: function() {
        return this.uniforms.envMap.value;
      } }), i2.update(u2)), ia.copy(n3.backgroundRotation), ia.x *= -1, ia.y *= -1, ia.z *= -1, r3.isCubeTexture && r3.isRenderTargetTexture === false && (ia.y *= -1, ia.z *= -1), u2.material.uniforms.envMap.value = r3, u2.material.uniforms.flipEnvMap.value = r3.isCubeTexture && r3.isRenderTargetTexture === false ? -1 : 1, u2.material.uniforms.backgroundBlurriness.value = n3.backgroundBlurriness, u2.material.uniforms.backgroundIntensity.value = n3.backgroundIntensity, u2.material.uniforms.backgroundRotation.value.setFromMatrix4(aa.makeRotationFromEuler(ia)), u2.material.toneMapped = K.getTransfer(r3.colorSpace) !== He, (d2 !== r3 || f2 !== r3.version || p2 !== e17.toneMapping) && (u2.material.needsUpdate = true, d2 = r3, f2 = r3.version, p2 = e17.toneMapping), u2.layers.enableAll(), t3.unshift(u2, u2.geometry, u2.material, 0, 0, null)) : r3 && r3.isTexture && (l2 === void 0 && (l2 = new Tr(new hi(2, 2), new Ir({ name: `BackgroundMaterial`, uniforms: kr(na.background.uniforms), vertexShader: na.background.vertexShader, fragmentShader: na.background.fragmentShader, side: 0, depthTest: false, depthWrite: false, fog: false, allowOverride: false })), l2.geometry.deleteAttribute(`normal`), Object.defineProperty(l2.material, "map", { get: function() {
        return this.uniforms.t2D.value;
      } }), i2.update(l2)), l2.material.uniforms.t2D.value = r3, l2.material.uniforms.backgroundIntensity.value = n3.backgroundIntensity, l2.material.toneMapped = K.getTransfer(r3.colorSpace) !== He, r3.matrixAutoUpdate === true && r3.updateMatrix(), l2.material.uniforms.uvTransform.value.copy(r3.matrix), (d2 !== r3 || f2 !== r3.version || p2 !== e17.toneMapping) && (l2.material.needsUpdate = true, d2 = r3, f2 = r3.version, p2 = e17.toneMapping), l2.layers.enableAll(), t3.unshift(l2, l2.geometry, l2.material, 0, 0, null));
    }
    function _2(t3, n3) {
      t3.getRGB(ra, Mr(e17)), r2.buffers.color.setClear(ra.r, ra.g, ra.b, n3, o2);
    }
    function v2() {
      u2 !== void 0 && (u2.geometry.dispose(), u2.material.dispose(), u2 = void 0), l2 !== void 0 && (l2.geometry.dispose(), l2.material.dispose(), l2 = void 0);
    }
    return { getClearColor: function() {
      return s2;
    }, setClearColor: function(e18, t3 = 1) {
      s2.set(e18), c2 = t3, _2(s2, c2);
    }, getClearAlpha: function() {
      return c2;
    }, setClearAlpha: function(e18) {
      c2 = e18, _2(s2, c2);
    }, render: h2, addToRenderList: g2, dispose: v2 };
  }
  function sa(e17, t2) {
    let n2 = e17.getParameter(e17.MAX_VERTEX_ATTRIBS), r2 = {}, i2 = f2(null), a2 = i2, o2 = false;
    function s2(n3, r3, i3, s3, c3) {
      let u3 = false, f3 = d2(s3, i3, r3);
      a2 !== f3 && (a2 = f3, l2(a2.object)), u3 = p2(n3, s3, i3, c3), u3 && m2(n3, s3, i3, c3), c3 !== null && t2.update(c3, e17.ELEMENT_ARRAY_BUFFER), (u3 || o2) && (o2 = false, b2(n3, r3, i3, s3), c3 !== null && e17.bindBuffer(e17.ELEMENT_ARRAY_BUFFER, t2.get(c3).buffer));
    }
    function c2() {
      return e17.createVertexArray();
    }
    function l2(t3) {
      return e17.bindVertexArray(t3);
    }
    function u2(t3) {
      return e17.deleteVertexArray(t3);
    }
    function d2(e18, t3, n3) {
      let i3 = n3.wireframe === true, a3 = r2[e18.id];
      a3 === void 0 && (a3 = {}, r2[e18.id] = a3);
      let o3 = a3[t3.id];
      o3 === void 0 && (o3 = {}, a3[t3.id] = o3);
      let s3 = o3[i3];
      return s3 === void 0 && (s3 = f2(c2()), o3[i3] = s3), s3;
    }
    function f2(e18) {
      let t3 = [], r3 = [], i3 = [];
      for (let e19 = 0; e19 < n2; e19++) t3[e19] = 0, r3[e19] = 0, i3[e19] = 0;
      return { geometry: null, program: null, wireframe: false, newAttributes: t3, enabledAttributes: r3, attributeDivisors: i3, object: e18, attributes: {}, index: null };
    }
    function p2(e18, t3, n3, r3) {
      let i3 = a2.attributes, o3 = t3.attributes, s3 = 0, c3 = n3.getAttributes();
      for (let t4 in c3) if (c3[t4].location >= 0) {
        let n4 = i3[t4], r4 = o3[t4];
        if (r4 === void 0 && (t4 === `instanceMatrix` && e18.instanceMatrix && (r4 = e18.instanceMatrix), t4 === `instanceColor` && e18.instanceColor && (r4 = e18.instanceColor)), n4 === void 0 || n4.attribute !== r4 || r4 && n4.data !== r4.data) return true;
        s3++;
      }
      return a2.attributesNum !== s3 || a2.index !== r3;
    }
    function m2(e18, t3, n3, r3) {
      let i3 = {}, o3 = t3.attributes, s3 = 0, c3 = n3.getAttributes();
      for (let t4 in c3) if (c3[t4].location >= 0) {
        let n4 = o3[t4];
        n4 === void 0 && (t4 === `instanceMatrix` && e18.instanceMatrix && (n4 = e18.instanceMatrix), t4 === `instanceColor` && e18.instanceColor && (n4 = e18.instanceColor));
        let r4 = {};
        r4.attribute = n4, n4 && n4.data && (r4.data = n4.data), i3[t4] = r4, s3++;
      }
      a2.attributes = i3, a2.attributesNum = s3, a2.index = r3;
    }
    function h2() {
      let e18 = a2.newAttributes;
      for (let t3 = 0, n3 = e18.length; t3 < n3; t3++) e18[t3] = 0;
    }
    function g2(e18) {
      _2(e18, 0);
    }
    function _2(t3, n3) {
      let r3 = a2.newAttributes, i3 = a2.enabledAttributes, o3 = a2.attributeDivisors;
      r3[t3] = 1, i3[t3] === 0 && (e17.enableVertexAttribArray(t3), i3[t3] = 1), o3[t3] !== n3 && (e17.vertexAttribDivisor(t3, n3), o3[t3] = n3);
    }
    function v2() {
      let t3 = a2.newAttributes, n3 = a2.enabledAttributes;
      for (let r3 = 0, i3 = n3.length; r3 < i3; r3++) n3[r3] !== t3[r3] && (e17.disableVertexAttribArray(r3), n3[r3] = 0);
    }
    function y2(t3, n3, r3, i3, a3, o3, s3) {
      s3 === true ? e17.vertexAttribIPointer(t3, n3, r3, a3, o3) : e17.vertexAttribPointer(t3, n3, r3, i3, a3, o3);
    }
    function b2(n3, r3, i3, a3) {
      h2();
      let o3 = a3.attributes, s3 = i3.getAttributes(), c3 = r3.defaultAttributeValues;
      for (let r4 in s3) {
        let i4 = s3[r4];
        if (i4.location >= 0) {
          let s4 = o3[r4];
          if (s4 === void 0 && (r4 === `instanceMatrix` && n3.instanceMatrix && (s4 = n3.instanceMatrix), r4 === `instanceColor` && n3.instanceColor && (s4 = n3.instanceColor)), s4 !== void 0) {
            let r5 = s4.normalized, o4 = s4.itemSize, c4 = t2.get(s4);
            if (c4 === void 0) continue;
            let l3 = c4.buffer, u3 = c4.type, d3 = c4.bytesPerElement, f3 = u3 === e17.INT || u3 === e17.UNSIGNED_INT || s4.gpuType === 1013;
            if (s4.isInterleavedBufferAttribute) {
              let t3 = s4.data, c5 = t3.stride, p3 = s4.offset;
              if (t3.isInstancedInterleavedBuffer) {
                for (let e18 = 0; e18 < i4.locationSize; e18++) _2(i4.location + e18, t3.meshPerAttribute);
                n3.isInstancedMesh !== true && a3._maxInstanceCount === void 0 && (a3._maxInstanceCount = t3.meshPerAttribute * t3.count);
              } else for (let e18 = 0; e18 < i4.locationSize; e18++) g2(i4.location + e18);
              e17.bindBuffer(e17.ARRAY_BUFFER, l3);
              for (let e18 = 0; e18 < i4.locationSize; e18++) y2(i4.location + e18, o4 / i4.locationSize, u3, r5, c5 * d3, (p3 + o4 / i4.locationSize * e18) * d3, f3);
            } else {
              if (s4.isInstancedBufferAttribute) {
                for (let e18 = 0; e18 < i4.locationSize; e18++) _2(i4.location + e18, s4.meshPerAttribute);
                n3.isInstancedMesh !== true && a3._maxInstanceCount === void 0 && (a3._maxInstanceCount = s4.meshPerAttribute * s4.count);
              } else for (let e18 = 0; e18 < i4.locationSize; e18++) g2(i4.location + e18);
              e17.bindBuffer(e17.ARRAY_BUFFER, l3);
              for (let e18 = 0; e18 < i4.locationSize; e18++) y2(i4.location + e18, o4 / i4.locationSize, u3, r5, o4 * d3, o4 / i4.locationSize * e18 * d3, f3);
            }
          } else if (c3 !== void 0) {
            let t3 = c3[r4];
            if (t3 !== void 0) switch (t3.length) {
              case 2:
                e17.vertexAttrib2fv(i4.location, t3);
                break;
              case 3:
                e17.vertexAttrib3fv(i4.location, t3);
                break;
              case 4:
                e17.vertexAttrib4fv(i4.location, t3);
                break;
              default:
                e17.vertexAttrib1fv(i4.location, t3);
            }
          }
        }
      }
      v2();
    }
    function x2() {
      w2();
      for (let e18 in r2) {
        let t3 = r2[e18];
        for (let e19 in t3) {
          let n3 = t3[e19];
          for (let e20 in n3) u2(n3[e20].object), delete n3[e20];
          delete t3[e19];
        }
        delete r2[e18];
      }
    }
    function S2(e18) {
      if (r2[e18.id] === void 0) return;
      let t3 = r2[e18.id];
      for (let e19 in t3) {
        let n3 = t3[e19];
        for (let e20 in n3) u2(n3[e20].object), delete n3[e20];
        delete t3[e19];
      }
      delete r2[e18.id];
    }
    function C2(e18) {
      for (let t3 in r2) {
        let n3 = r2[t3];
        if (n3[e18.id] === void 0) continue;
        let i3 = n3[e18.id];
        for (let e19 in i3) u2(i3[e19].object), delete i3[e19];
        delete n3[e18.id];
      }
    }
    function w2() {
      T2(), o2 = true, a2 !== i2 && (a2 = i2, l2(a2.object));
    }
    function T2() {
      i2.geometry = null, i2.program = null, i2.wireframe = false;
    }
    return { setup: s2, reset: w2, resetDefaultState: T2, dispose: x2, releaseStatesOfGeometry: S2, releaseStatesOfProgram: C2, initAttributes: h2, enableAttribute: g2, disableUnusedAttributes: v2 };
  }
  function ca(e17, t2, n2) {
    let r2;
    function i2(e18) {
      r2 = e18;
    }
    function a2(t3, i3) {
      e17.drawArrays(r2, t3, i3), n2.update(i3, r2, 1);
    }
    function o2(t3, i3, a3) {
      a3 !== 0 && (e17.drawArraysInstanced(r2, t3, i3, a3), n2.update(i3, r2, a3));
    }
    function s2(e18, i3, a3) {
      if (a3 === 0) return;
      t2.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r2, e18, 0, i3, 0, a3);
      let o3 = 0;
      for (let e19 = 0; e19 < a3; e19++) o3 += i3[e19];
      n2.update(o3, r2, 1);
    }
    function c2(e18, i3, a3, s3) {
      if (a3 === 0) return;
      let c3 = t2.get(`WEBGL_multi_draw`);
      if (c3 === null) for (let t3 = 0; t3 < e18.length; t3++) o2(e18[t3], i3[t3], s3[t3]);
      else {
        c3.multiDrawArraysInstancedWEBGL(r2, e18, 0, i3, 0, s3, 0, a3);
        let t3 = 0;
        for (let e19 = 0; e19 < a3; e19++) t3 += i3[e19] * s3[e19];
        n2.update(t3, r2, 1);
      }
    }
    this.setMode = i2, this.render = a2, this.renderInstances = o2, this.renderMultiDraw = s2, this.renderMultiDrawInstances = c2;
  }
  function la(e17, t2, n2, r2) {
    let i2;
    function a2() {
      if (i2 !== void 0) return i2;
      if (t2.has(`EXT_texture_filter_anisotropic`) === true) {
        let n3 = t2.get(`EXT_texture_filter_anisotropic`);
        i2 = e17.getParameter(n3.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else i2 = 0;
      return i2;
    }
    function o2(t3) {
      return !(t3 !== 1023 && r2.convert(t3) !== e17.getParameter(e17.IMPLEMENTATION_COLOR_READ_FORMAT));
    }
    function s2(n3) {
      let i3 = n3 === 1016 && (t2.has(`EXT_color_buffer_half_float`) || t2.has(`EXT_color_buffer_float`));
      return !(n3 !== 1009 && r2.convert(n3) !== e17.getParameter(e17.IMPLEMENTATION_COLOR_READ_TYPE) && n3 !== 1015 && !i3);
    }
    function c2(t3) {
      if (t3 === `highp`) {
        if (e17.getShaderPrecisionFormat(e17.VERTEX_SHADER, e17.HIGH_FLOAT).precision > 0 && e17.getShaderPrecisionFormat(e17.FRAGMENT_SHADER, e17.HIGH_FLOAT).precision > 0) return `highp`;
        t3 = `mediump`;
      }
      return t3 === `mediump` && e17.getShaderPrecisionFormat(e17.VERTEX_SHADER, e17.MEDIUM_FLOAT).precision > 0 && e17.getShaderPrecisionFormat(e17.FRAGMENT_SHADER, e17.MEDIUM_FLOAT).precision > 0 ? `mediump` : `lowp`;
    }
    let l2 = n2.precision === void 0 ? `highp` : n2.precision, u2 = c2(l2);
    u2 !== l2 && (console.warn(`THREE.WebGLRenderer:`, l2, `not supported, using`, u2, `instead.`), l2 = u2);
    let d2 = n2.logarithmicDepthBuffer === true, f2 = n2.reversedDepthBuffer === true && t2.has(`EXT_clip_control`), p2 = e17.getParameter(e17.MAX_TEXTURE_IMAGE_UNITS), m2 = e17.getParameter(e17.MAX_VERTEX_TEXTURE_IMAGE_UNITS), h2 = e17.getParameter(e17.MAX_TEXTURE_SIZE), g2 = e17.getParameter(e17.MAX_CUBE_MAP_TEXTURE_SIZE), _2 = e17.getParameter(e17.MAX_VERTEX_ATTRIBS), v2 = e17.getParameter(e17.MAX_VERTEX_UNIFORM_VECTORS), y2 = e17.getParameter(e17.MAX_VARYING_VECTORS), b2 = e17.getParameter(e17.MAX_FRAGMENT_UNIFORM_VECTORS), x2 = m2 > 0, S2 = e17.getParameter(e17.MAX_SAMPLES);
    return { isWebGL2: true, getMaxAnisotropy: a2, getMaxPrecision: c2, textureFormatReadable: o2, textureTypeReadable: s2, precision: l2, logarithmicDepthBuffer: d2, reversedDepthBuffer: f2, maxTextures: p2, maxVertexTextures: m2, maxTextureSize: h2, maxCubemapSize: g2, maxAttributes: _2, maxVertexUniforms: v2, maxVaryings: y2, maxFragmentUniforms: b2, vertexTextures: x2, maxSamples: S2 };
  }
  function ua(e17) {
    let t2 = this, n2 = null, r2 = 0, i2 = false, a2 = false, o2 = new ti(), s2 = new G(), c2 = { value: null, needsUpdate: false };
    this.uniform = c2, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e18, t3) {
      let n3 = e18.length !== 0 || t3 || r2 !== 0 || i2;
      return i2 = t3, r2 = e18.length, n3;
    }, this.beginShadows = function() {
      a2 = true, u2(null);
    }, this.endShadows = function() {
      a2 = false;
    }, this.setGlobalState = function(e18, t3) {
      n2 = u2(e18, t3, 0);
    }, this.setState = function(t3, o3, s3) {
      let d2 = t3.clippingPlanes, f2 = t3.clipIntersection, p2 = t3.clipShadows, m2 = e17.get(t3);
      if (!i2 || d2 === null || d2.length === 0 || a2 && !p2) a2 ? u2(null) : l2();
      else {
        let e18 = a2 ? 0 : r2, t4 = e18 * 4, i3 = m2.clippingState || null;
        c2.value = i3, i3 = u2(d2, o3, t4, s3);
        for (let e19 = 0; e19 !== t4; ++e19) i3[e19] = n2[e19];
        m2.clippingState = i3, this.numIntersection = f2 ? this.numPlanes : 0, this.numPlanes += e18;
      }
    };
    function l2() {
      c2.value !== n2 && (c2.value = n2, c2.needsUpdate = r2 > 0), t2.numPlanes = r2, t2.numIntersection = 0;
    }
    function u2(e18, n3, r3, i3) {
      let a3 = e18 === null ? 0 : e18.length, l3 = null;
      if (a3 !== 0) {
        if (l3 = c2.value, i3 !== true || l3 === null) {
          let t3 = r3 + a3 * 4, i4 = n3.matrixWorldInverse;
          s2.getNormalMatrix(i4), (l3 === null || l3.length < t3) && (l3 = new Float32Array(t3));
          for (let t4 = 0, n4 = r3; t4 !== a3; ++t4, n4 += 4) o2.copy(e18[t4]).applyMatrix4(i4, s2), o2.normal.toArray(l3, n4), l3[n4 + 3] = o2.constant;
        }
        c2.value = l3, c2.needsUpdate = true;
      }
      return t2.numPlanes = a3, t2.numIntersection = 0, l3;
    }
  }
  function da(e17) {
    let t2 = /* @__PURE__ */ new WeakMap();
    function n2(e18, t3) {
      return t3 === 303 ? e18.mapping = 301 : t3 === 304 && (e18.mapping = 302), e18;
    }
    function r2(r3) {
      if (r3 && r3.isTexture) {
        let a3 = r3.mapping;
        if (a3 === 303 || a3 === 304) if (t2.has(r3)) {
          let e18 = t2.get(r3).texture;
          return n2(e18, r3.mapping);
        } else {
          let a4 = r3.image;
          if (a4 && a4.height > 0) {
            let o2 = new Kr(a4.height);
            return o2.fromEquirectangularTexture(e17, r3), t2.set(r3, o2), r3.addEventListener(`dispose`, i2), n2(o2.texture, r3.mapping);
          } else return null;
        }
      }
      return r3;
    }
    function i2(e18) {
      let n3 = e18.target;
      n3.removeEventListener(`dispose`, i2);
      let r3 = t2.get(n3);
      r3 !== void 0 && (t2.delete(n3), r3.dispose());
    }
    function a2() {
      t2 = /* @__PURE__ */ new WeakMap();
    }
    return { get: r2, dispose: a2 };
  }
  var fa = 4;
  var pa = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582];
  var ma = 20;
  var ha = new Pi();
  var ga = new q();
  var _a = null;
  var va = 0;
  var ya = 0;
  var ba = false;
  var xa = (1 + Math.sqrt(5)) / 2;
  var Sa = 1 / xa;
  var Ca = [new W(-xa, Sa, 0), new W(xa, Sa, 0), new W(-Sa, 0, xa), new W(Sa, 0, xa), new W(0, xa, -Sa), new W(0, xa, Sa), new W(-1, 1, -1), new W(1, 1, -1), new W(-1, 1, 1), new W(1, 1, 1)];
  var wa = new W();
  var Ta = class {
    constructor(e17) {
      this._renderer = e17, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
    }
    fromScene(e17, t2 = 0, n2 = 0.1, r2 = 100, i2 = {}) {
      let { size: a2 = 256, position: o2 = wa } = i2;
      _a = this._renderer.getRenderTarget(), va = this._renderer.getActiveCubeFace(), ya = this._renderer.getActiveMipmapLevel(), ba = this._renderer.xr.enabled, this._renderer.xr.enabled = false, this._setSize(a2);
      let s2 = this._allocateTargets();
      return s2.depthBuffer = true, this._sceneToCubeUV(e17, n2, r2, s2, o2), t2 > 0 && this._blur(s2, 0, 0, t2), this._applyPMREM(s2), this._cleanup(s2), s2;
    }
    fromEquirectangular(e17, t2 = null) {
      return this._fromTexture(e17, t2);
    }
    fromCubemap(e17, t2 = null) {
      return this._fromTexture(e17, t2);
    }
    compileCubemapShader() {
      this._cubemapMaterial === null && (this._cubemapMaterial = ja(), this._compileMaterial(this._cubemapMaterial));
    }
    compileEquirectangularShader() {
      this._equirectMaterial === null && (this._equirectMaterial = Aa(), this._compileMaterial(this._equirectMaterial));
    }
    dispose() {
      this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
    }
    _setSize(e17) {
      this._lodMax = Math.floor(Math.log2(e17)), this._cubeSize = 2 ** this._lodMax;
    }
    _dispose() {
      this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
      for (let e17 = 0; e17 < this._lodPlanes.length; e17++) this._lodPlanes[e17].dispose();
    }
    _cleanup(e17) {
      this._renderer.setRenderTarget(_a, va, ya), this._renderer.xr.enabled = ba, e17.scissorTest = false, Oa(e17, 0, 0, e17.width, e17.height);
    }
    _fromTexture(e17, t2) {
      e17.mapping === 301 || e17.mapping === 302 ? this._setSize(e17.image.length === 0 ? 16 : e17.image[0].width || e17.image[0].image.width) : this._setSize(e17.image.width / 4), _a = this._renderer.getRenderTarget(), va = this._renderer.getActiveCubeFace(), ya = this._renderer.getActiveMipmapLevel(), ba = this._renderer.xr.enabled, this._renderer.xr.enabled = false;
      let n2 = t2 || this._allocateTargets();
      return this._textureToCubeUV(e17, n2), this._applyPMREM(n2), this._cleanup(n2), n2;
    }
    _allocateTargets() {
      let e17 = 3 * Math.max(this._cubeSize, 112), t2 = 4 * this._cubeSize, n2 = { magFilter: h, minFilter: h, generateMipmaps: false, type: T, format: te, colorSpace: Be, depthBuffer: false }, r2 = Da(e17, t2, n2);
      if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e17 || this._pingPongRenderTarget.height !== t2) {
        this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Da(e17, t2, n2);
        let { _lodMax: r3 } = this;
        ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Ea(r3)), this._blurMaterial = ka(r3, e17, t2);
      }
      return r2;
    }
    _compileMaterial(e17) {
      let t2 = new Tr(this._lodPlanes[0], e17);
      this._renderer.compile(t2, ha);
    }
    _sceneToCubeUV(e17, t2, n2, r2, i2) {
      let a2 = new Vr(90, 1, t2, n2), o2 = [1, -1, 1, 1, 1, 1], s2 = [1, 1, 1, -1, -1, -1], c2 = this._renderer, l2 = c2.autoClear, u2 = c2.toneMapping;
      c2.getClearColor(ga), c2.toneMapping = 0, c2.autoClear = false, c2.state.buffers.depth.getReversed() && (c2.setRenderTarget(r2), c2.clearDepth(), c2.setRenderTarget(null));
      let d2 = new Qn({ name: `PMREM.Background`, side: 1, depthWrite: false, depthTest: false }), f2 = new Tr(new Or(), d2), p2 = false, m2 = e17.background;
      m2 ? m2.isColor && (d2.color.copy(m2), e17.background = null, p2 = true) : (d2.color.copy(ga), p2 = true);
      for (let t3 = 0; t3 < 6; t3++) {
        let n3 = t3 % 3;
        n3 === 0 ? (a2.up.set(0, o2[t3], 0), a2.position.set(i2.x, i2.y, i2.z), a2.lookAt(i2.x + s2[t3], i2.y, i2.z)) : n3 === 1 ? (a2.up.set(0, 0, o2[t3]), a2.position.set(i2.x, i2.y, i2.z), a2.lookAt(i2.x, i2.y + s2[t3], i2.z)) : (a2.up.set(0, o2[t3], 0), a2.position.set(i2.x, i2.y, i2.z), a2.lookAt(i2.x, i2.y, i2.z + s2[t3]));
        let l3 = this._cubeSize;
        Oa(r2, n3 * l3, t3 > 2 ? l3 : 0, l3, l3), c2.setRenderTarget(r2), p2 && c2.render(f2, a2), c2.render(e17, a2);
      }
      f2.geometry.dispose(), f2.material.dispose(), c2.toneMapping = u2, c2.autoClear = l2, e17.background = m2;
    }
    _textureToCubeUV(e17, t2) {
      let n2 = this._renderer, r2 = e17.mapping === 301 || e17.mapping === 302;
      r2 ? (this._cubemapMaterial === null && (this._cubemapMaterial = ja()), this._cubemapMaterial.uniforms.flipEnvMap.value = e17.isRenderTargetTexture === false ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Aa());
      let i2 = r2 ? this._cubemapMaterial : this._equirectMaterial, a2 = new Tr(this._lodPlanes[0], i2), o2 = i2.uniforms;
      o2.envMap.value = e17;
      let s2 = this._cubeSize;
      Oa(t2, 0, 0, 3 * s2, 2 * s2), n2.setRenderTarget(t2), n2.render(a2, ha);
    }
    _applyPMREM(e17) {
      let t2 = this._renderer, n2 = t2.autoClear;
      t2.autoClear = false;
      let r2 = this._lodPlanes.length;
      for (let t3 = 1; t3 < r2; t3++) {
        let n3 = Math.sqrt(this._sigmas[t3] * this._sigmas[t3] - this._sigmas[t3 - 1] * this._sigmas[t3 - 1]), i2 = Ca[(r2 - t3 - 1) % Ca.length];
        this._blur(e17, t3 - 1, t3, n3, i2);
      }
      t2.autoClear = n2;
    }
    _blur(e17, t2, n2, r2, i2) {
      let a2 = this._pingPongRenderTarget;
      this._halfBlur(e17, a2, t2, n2, r2, `latitudinal`, i2), this._halfBlur(a2, e17, n2, n2, r2, `longitudinal`, i2);
    }
    _halfBlur(e17, t2, n2, r2, i2, a2, o2) {
      let s2 = this._renderer, c2 = this._blurMaterial;
      a2 !== `latitudinal` && a2 !== `longitudinal` && console.error(`blur direction must be either latitudinal or longitudinal!`);
      let l2 = new Tr(this._lodPlanes[r2], c2), u2 = c2.uniforms, d2 = this._sizeLods[n2] - 1, f2 = isFinite(i2) ? Math.PI / (2 * d2) : 2 * Math.PI / (2 * ma - 1), p2 = i2 / f2, m2 = isFinite(i2) ? 1 + Math.floor(3 * p2) : ma;
      m2 > ma && console.warn(`sigmaRadians, ${i2}, is too large and will clip, as it requested ${m2} samples when the maximum is set to ${ma}`);
      let h2 = [], g2 = 0;
      for (let e18 = 0; e18 < ma; ++e18) {
        let t3 = e18 / p2, n3 = Math.exp(-t3 * t3 / 2);
        h2.push(n3), e18 === 0 ? g2 += n3 : e18 < m2 && (g2 += 2 * n3);
      }
      for (let e18 = 0; e18 < h2.length; e18++) h2[e18] = h2[e18] / g2;
      u2.envMap.value = e17.texture, u2.samples.value = m2, u2.weights.value = h2, u2.latitudinal.value = a2 === `latitudinal`, o2 && (u2.poleAxis.value = o2);
      let { _lodMax: _2 } = this;
      u2.dTheta.value = f2, u2.mipInt.value = _2 - n2;
      let v2 = this._sizeLods[r2];
      Oa(t2, 3 * v2 * (r2 > _2 - fa ? r2 - _2 + fa : 0), 4 * (this._cubeSize - v2), 3 * v2, 2 * v2), s2.setRenderTarget(t2), s2.render(l2, ha);
    }
  };
  function Ea(e17) {
    let t2 = [], n2 = [], r2 = [], i2 = e17, a2 = e17 - fa + 1 + pa.length;
    for (let o2 = 0; o2 < a2; o2++) {
      let a3 = 2 ** i2;
      n2.push(a3);
      let s2 = 1 / a3;
      o2 > e17 - fa ? s2 = pa[o2 - e17 + fa - 1] : o2 === 0 && (s2 = 0), r2.push(s2);
      let c2 = 1 / (a3 - 2), l2 = -c2, u2 = 1 + c2, d2 = [l2, l2, u2, l2, u2, u2, l2, l2, u2, u2, l2, u2], f2 = new Float32Array(108), p2 = new Float32Array(72), m2 = new Float32Array(36);
      for (let e18 = 0; e18 < 6; e18++) {
        let t3 = e18 % 3 * 2 / 3 - 1, n3 = e18 > 2 ? 0 : -1, r3 = [t3, n3, 0, t3 + 2 / 3, n3, 0, t3 + 2 / 3, n3 + 1, 0, t3, n3, 0, t3 + 2 / 3, n3 + 1, 0, t3, n3 + 1, 0];
        f2.set(r3, 18 * e18), p2.set(d2, 12 * e18);
        let i3 = [e18, e18, e18, e18, e18, e18];
        m2.set(i3, 6 * e18);
      }
      let h2 = new pr();
      h2.setAttribute(`position`, new nr(f2, 3)), h2.setAttribute(`uv`, new nr(p2, 2)), h2.setAttribute(`faceIndex`, new nr(m2, 1)), t2.push(h2), i2 > fa && i2--;
    }
    return { lodPlanes: t2, sizeLods: n2, sigmas: r2 };
  }
  function Da(e17, t2, n2) {
    let r2 = new Et(e17, t2, n2);
    return r2.texture.mapping = 306, r2.texture.name = `PMREM.cubeUv`, r2.scissorTest = true, r2;
  }
  function Oa(e17, t2, n2, r2, i2) {
    e17.viewport.set(t2, n2, r2, i2), e17.scissor.set(t2, n2, r2, i2);
  }
  function ka(e17, t2, n2) {
    let r2 = new Float32Array(ma), i2 = new W(0, 1, 0);
    return new Ir({ name: `SphericalGaussianBlur`, defines: { n: ma, CUBEUV_TEXEL_WIDTH: 1 / t2, CUBEUV_TEXEL_HEIGHT: 1 / n2, CUBEUV_MAX_MIP: `${e17}.0` }, uniforms: { envMap: { value: null }, samples: { value: 1 }, weights: { value: r2 }, latitudinal: { value: false }, dTheta: { value: 0 }, mipInt: { value: 0 }, poleAxis: { value: i2 } }, vertexShader: Ma(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`, blending: 0, depthTest: false, depthWrite: false });
  }
  function Aa() {
    return new Ir({ name: `EquirectangularToCubeUV`, uniforms: { envMap: { value: null } }, vertexShader: Ma(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`, blending: 0, depthTest: false, depthWrite: false });
  }
  function ja() {
    return new Ir({ name: `CubemapToCubeUV`, uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } }, vertexShader: Ma(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`, blending: 0, depthTest: false, depthWrite: false });
  }
  function Ma() {
    return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
  }
  function Na(e17) {
    let t2 = /* @__PURE__ */ new WeakMap(), n2 = null;
    function r2(r3) {
      if (r3 && r3.isTexture) {
        let o3 = r3.mapping, s2 = o3 === 303 || o3 === 304, c2 = o3 === 301 || o3 === 302;
        if (s2 || c2) {
          let o4 = t2.get(r3), l2 = o4 === void 0 ? 0 : o4.texture.pmremVersion;
          if (r3.isRenderTargetTexture && r3.pmremVersion !== l2) return n2 === null && (n2 = new Ta(e17)), o4 = s2 ? n2.fromEquirectangular(r3, o4) : n2.fromCubemap(r3, o4), o4.texture.pmremVersion = r3.pmremVersion, t2.set(r3, o4), o4.texture;
          if (o4 !== void 0) return o4.texture;
          {
            let l3 = r3.image;
            return s2 && l3 && l3.height > 0 || c2 && l3 && i2(l3) ? (n2 === null && (n2 = new Ta(e17)), o4 = s2 ? n2.fromEquirectangular(r3) : n2.fromCubemap(r3), o4.texture.pmremVersion = r3.pmremVersion, t2.set(r3, o4), r3.addEventListener(`dispose`, a2), o4.texture) : null;
          }
        }
      }
      return r3;
    }
    function i2(e18) {
      let t3 = 0;
      for (let n3 = 0; n3 < 6; n3++) e18[n3] !== void 0 && t3++;
      return t3 === 6;
    }
    function a2(e18) {
      let n3 = e18.target;
      n3.removeEventListener(`dispose`, a2);
      let r3 = t2.get(n3);
      r3 !== void 0 && (t2.delete(n3), r3.dispose());
    }
    function o2() {
      t2 = /* @__PURE__ */ new WeakMap(), n2 !== null && (n2.dispose(), n2 = null);
    }
    return { get: r2, dispose: o2 };
  }
  function Pa(e17) {
    let t2 = {};
    function n2(n3) {
      if (t2[n3] !== void 0) return t2[n3];
      let r2;
      switch (n3) {
        case `WEBGL_depth_texture`:
          r2 = e17.getExtension(`WEBGL_depth_texture`) || e17.getExtension(`MOZ_WEBGL_depth_texture`) || e17.getExtension(`WEBKIT_WEBGL_depth_texture`);
          break;
        case `EXT_texture_filter_anisotropic`:
          r2 = e17.getExtension(`EXT_texture_filter_anisotropic`) || e17.getExtension(`MOZ_EXT_texture_filter_anisotropic`) || e17.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);
          break;
        case `WEBGL_compressed_texture_s3tc`:
          r2 = e17.getExtension(`WEBGL_compressed_texture_s3tc`) || e17.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`) || e17.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);
          break;
        case `WEBGL_compressed_texture_pvrtc`:
          r2 = e17.getExtension(`WEBGL_compressed_texture_pvrtc`) || e17.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);
          break;
        default:
          r2 = e17.getExtension(n3);
      }
      return t2[n3] = r2, r2;
    }
    return { has: function(e18) {
      return n2(e18) !== null;
    }, init: function() {
      n2(`EXT_color_buffer_float`), n2(`WEBGL_clip_cull_distance`), n2(`OES_texture_float_linear`), n2(`EXT_color_buffer_half_float`), n2(`WEBGL_multisampled_render_to_texture`), n2(`WEBGL_render_shared_exponent`);
    }, get: function(e18) {
      let t3 = n2(e18);
      return t3 === null && lt(`THREE.WebGLRenderer: ` + e18 + ` extension not supported.`), t3;
    } };
  }
  function Fa(e17, t2, n2, r2) {
    let i2 = {}, a2 = /* @__PURE__ */ new WeakMap();
    function o2(e18) {
      let s3 = e18.target;
      s3.index !== null && t2.remove(s3.index);
      for (let e19 in s3.attributes) t2.remove(s3.attributes[e19]);
      s3.removeEventListener(`dispose`, o2), delete i2[s3.id];
      let c3 = a2.get(s3);
      c3 && (t2.remove(c3), a2.delete(s3)), r2.releaseStatesOfGeometry(s3), s3.isInstancedBufferGeometry === true && delete s3._maxInstanceCount, n2.memory.geometries--;
    }
    function s2(e18, t3) {
      return i2[t3.id] === true ? t3 : (t3.addEventListener(`dispose`, o2), i2[t3.id] = true, n2.memory.geometries++, t3);
    }
    function c2(n3) {
      let r3 = n3.attributes;
      for (let n4 in r3) t2.update(r3[n4], e17.ARRAY_BUFFER);
    }
    function l2(e18) {
      let n3 = [], r3 = e18.index, i3 = e18.attributes.position, o3 = 0;
      if (r3 !== null) {
        let e19 = r3.array;
        o3 = r3.version;
        for (let t3 = 0, r4 = e19.length; t3 < r4; t3 += 3) {
          let r5 = e19[t3 + 0], i4 = e19[t3 + 1], a3 = e19[t3 + 2];
          n3.push(r5, i4, i4, a3, a3, r5);
        }
      } else if (i3 !== void 0) {
        let e19 = i3.array;
        o3 = i3.version;
        for (let t3 = 0, r4 = e19.length / 3 - 1; t3 < r4; t3 += 3) {
          let e20 = t3 + 0, r5 = t3 + 1, i4 = t3 + 2;
          n3.push(e20, r5, r5, i4, i4, e20);
        }
      } else return;
      let s3 = new (at(n3) ? ir : rr)(n3, 1);
      s3.version = o3;
      let c3 = a2.get(e18);
      c3 && t2.remove(c3), a2.set(e18, s3);
    }
    function u2(e18) {
      let t3 = a2.get(e18);
      if (t3) {
        let n3 = e18.index;
        n3 !== null && t3.version < n3.version && l2(e18);
      } else l2(e18);
      return a2.get(e18);
    }
    return { get: s2, update: c2, getWireframeAttribute: u2 };
  }
  function Ia(e17, t2, n2) {
    let r2;
    function i2(e18) {
      r2 = e18;
    }
    let a2, o2;
    function s2(e18) {
      a2 = e18.type, o2 = e18.bytesPerElement;
    }
    function c2(t3, i3) {
      e17.drawElements(r2, i3, a2, t3 * o2), n2.update(i3, r2, 1);
    }
    function l2(t3, i3, s3) {
      s3 !== 0 && (e17.drawElementsInstanced(r2, i3, a2, t3 * o2, s3), n2.update(i3, r2, s3));
    }
    function u2(e18, i3, o3) {
      if (o3 === 0) return;
      t2.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r2, i3, 0, a2, e18, 0, o3);
      let s3 = 0;
      for (let e19 = 0; e19 < o3; e19++) s3 += i3[e19];
      n2.update(s3, r2, 1);
    }
    function d2(e18, i3, s3, c3) {
      if (s3 === 0) return;
      let u3 = t2.get(`WEBGL_multi_draw`);
      if (u3 === null) for (let t3 = 0; t3 < e18.length; t3++) l2(e18[t3] / o2, i3[t3], c3[t3]);
      else {
        u3.multiDrawElementsInstancedWEBGL(r2, i3, 0, a2, e18, 0, c3, 0, s3);
        let t3 = 0;
        for (let e19 = 0; e19 < s3; e19++) t3 += i3[e19] * c3[e19];
        n2.update(t3, r2, 1);
      }
    }
    this.setMode = i2, this.setIndex = s2, this.render = c2, this.renderInstances = l2, this.renderMultiDraw = u2, this.renderMultiDrawInstances = d2;
  }
  function La(e17) {
    let t2 = { geometries: 0, textures: 0 }, n2 = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
    function r2(t3, r3, i3) {
      switch (n2.calls++, r3) {
        case e17.TRIANGLES:
          n2.triangles += t3 / 3 * i3;
          break;
        case e17.LINES:
          n2.lines += t3 / 2 * i3;
          break;
        case e17.LINE_STRIP:
          n2.lines += i3 * (t3 - 1);
          break;
        case e17.LINE_LOOP:
          n2.lines += i3 * t3;
          break;
        case e17.POINTS:
          n2.points += i3 * t3;
          break;
        default:
          console.error(`THREE.WebGLInfo: Unknown draw mode:`, r3);
          break;
      }
    }
    function i2() {
      n2.calls = 0, n2.triangles = 0, n2.points = 0, n2.lines = 0;
    }
    return { memory: t2, render: n2, programs: null, autoReset: true, reset: i2, update: r2 };
  }
  function Ra(e17, t2, n2) {
    let r2 = /* @__PURE__ */ new WeakMap(), i2 = new wt();
    function a2(a3, o2, s2) {
      let c2 = a3.morphTargetInfluences, l2 = o2.morphAttributes.position || o2.morphAttributes.normal || o2.morphAttributes.color, u2 = l2 === void 0 ? 0 : l2.length, d2 = r2.get(o2);
      if (d2 === void 0 || d2.count !== u2) {
        let v3 = function() {
          g2.dispose(), r2.delete(o2), o2.removeEventListener(`dispose`, v3);
        };
        var v2 = v3;
        d2 !== void 0 && d2.texture.dispose();
        let e18 = o2.morphAttributes.position !== void 0, n3 = o2.morphAttributes.normal !== void 0, a4 = o2.morphAttributes.color !== void 0, s3 = o2.morphAttributes.position || [], c3 = o2.morphAttributes.normal || [], l3 = o2.morphAttributes.color || [], f2 = 0;
        e18 === true && (f2 = 1), n3 === true && (f2 = 2), a4 === true && (f2 = 3);
        let p2 = o2.attributes.position.count * f2, m2 = 1;
        p2 > t2.maxTextureSize && (m2 = Math.ceil(p2 / t2.maxTextureSize), p2 = t2.maxTextureSize);
        let h2 = new Float32Array(p2 * m2 * 4 * u2), g2 = new Dt(h2, p2, m2, u2);
        g2.type = w, g2.needsUpdate = true;
        let _2 = f2 * 4;
        for (let t3 = 0; t3 < u2; t3++) {
          let r3 = s3[t3], o3 = c3[t3], u3 = l3[t3], d3 = p2 * m2 * 4 * t3;
          for (let t4 = 0; t4 < r3.count; t4++) {
            let s4 = t4 * _2;
            e18 === true && (i2.fromBufferAttribute(r3, t4), h2[d3 + s4 + 0] = i2.x, h2[d3 + s4 + 1] = i2.y, h2[d3 + s4 + 2] = i2.z, h2[d3 + s4 + 3] = 0), n3 === true && (i2.fromBufferAttribute(o3, t4), h2[d3 + s4 + 4] = i2.x, h2[d3 + s4 + 5] = i2.y, h2[d3 + s4 + 6] = i2.z, h2[d3 + s4 + 7] = 0), a4 === true && (i2.fromBufferAttribute(u3, t4), h2[d3 + s4 + 8] = i2.x, h2[d3 + s4 + 9] = i2.y, h2[d3 + s4 + 10] = i2.z, h2[d3 + s4 + 11] = u3.itemSize === 4 ? i2.w : 1);
          }
        }
        d2 = { count: u2, texture: g2, size: new U(p2, m2) }, r2.set(o2, d2);
        o2.addEventListener(`dispose`, v3);
      }
      if (a3.isInstancedMesh === true && a3.morphTexture !== null) s2.getUniforms().setValue(e17, `morphTexture`, a3.morphTexture, n2);
      else {
        let t3 = 0;
        for (let e18 = 0; e18 < c2.length; e18++) t3 += c2[e18];
        let n3 = o2.morphTargetsRelative ? 1 : 1 - t3;
        s2.getUniforms().setValue(e17, `morphTargetBaseInfluence`, n3), s2.getUniforms().setValue(e17, `morphTargetInfluences`, c2);
      }
      s2.getUniforms().setValue(e17, `morphTargetsTexture`, d2.texture, n2), s2.getUniforms().setValue(e17, `morphTargetsTextureSize`, d2.size);
    }
    return { update: a2 };
  }
  function za(e17, t2, n2, r2) {
    let i2 = /* @__PURE__ */ new WeakMap();
    function a2(a3) {
      let o3 = r2.render.frame, c2 = a3.geometry, l2 = t2.get(a3, c2);
      if (i2.get(l2) !== o3 && (t2.update(l2), i2.set(l2, o3)), a3.isInstancedMesh && (a3.hasEventListener(`dispose`, s2) === false && a3.addEventListener(`dispose`, s2), i2.get(a3) !== o3 && (n2.update(a3.instanceMatrix, e17.ARRAY_BUFFER), a3.instanceColor !== null && n2.update(a3.instanceColor, e17.ARRAY_BUFFER), i2.set(a3, o3))), a3.isSkinnedMesh) {
        let e18 = a3.skeleton;
        i2.get(e18) !== o3 && (e18.update(), i2.set(e18, o3));
      }
      return l2;
    }
    function o2() {
      i2 = /* @__PURE__ */ new WeakMap();
    }
    function s2(e18) {
      let t3 = e18.target;
      t3.removeEventListener(`dispose`, s2), n2.remove(t3.instanceMatrix), t3.instanceColor !== null && n2.remove(t3.instanceColor);
    }
    return { update: a2, dispose: o2 };
  }
  var Ba = new Ct();
  var Va = new pi(1, 1);
  var Ha = new Dt();
  var Ua = new Ot();
  var Wa = new Gr();
  var Ga = [];
  var Ka = [];
  var qa = new Float32Array(16);
  var Ja = new Float32Array(9);
  var Ya = new Float32Array(4);
  function Xa(e17, t2, n2) {
    let r2 = e17[0];
    if (r2 <= 0 || r2 > 0) return e17;
    let i2 = t2 * n2, a2 = Ga[i2];
    if (a2 === void 0 && (a2 = new Float32Array(i2), Ga[i2] = a2), t2 !== 0) {
      r2.toArray(a2, 0);
      for (let r3 = 1, i3 = 0; r3 !== t2; ++r3) i3 += n2, e17[r3].toArray(a2, i3);
    }
    return a2;
  }
  function Za(e17, t2) {
    if (e17.length !== t2.length) return false;
    for (let n2 = 0, r2 = e17.length; n2 < r2; n2++) if (e17[n2] !== t2[n2]) return false;
    return true;
  }
  function Qa(e17, t2) {
    for (let n2 = 0, r2 = t2.length; n2 < r2; n2++) e17[n2] = t2[n2];
  }
  function $a(e17, t2) {
    let n2 = Ka[t2];
    n2 === void 0 && (n2 = new Int32Array(t2), Ka[t2] = n2);
    for (let r2 = 0; r2 !== t2; ++r2) n2[r2] = e17.allocateTextureUnit();
    return n2;
  }
  function eo(e17, t2) {
    let n2 = this.cache;
    n2[0] !== t2 && (e17.uniform1f(this.addr, t2), n2[0] = t2);
  }
  function to(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y) && (e17.uniform2f(this.addr, t2.x, t2.y), n2[0] = t2.x, n2[1] = t2.y);
    else {
      if (Za(n2, t2)) return;
      e17.uniform2fv(this.addr, t2), Qa(n2, t2);
    }
  }
  function no(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y || n2[2] !== t2.z) && (e17.uniform3f(this.addr, t2.x, t2.y, t2.z), n2[0] = t2.x, n2[1] = t2.y, n2[2] = t2.z);
    else if (t2.r !== void 0) (n2[0] !== t2.r || n2[1] !== t2.g || n2[2] !== t2.b) && (e17.uniform3f(this.addr, t2.r, t2.g, t2.b), n2[0] = t2.r, n2[1] = t2.g, n2[2] = t2.b);
    else {
      if (Za(n2, t2)) return;
      e17.uniform3fv(this.addr, t2), Qa(n2, t2);
    }
  }
  function ro(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y || n2[2] !== t2.z || n2[3] !== t2.w) && (e17.uniform4f(this.addr, t2.x, t2.y, t2.z, t2.w), n2[0] = t2.x, n2[1] = t2.y, n2[2] = t2.z, n2[3] = t2.w);
    else {
      if (Za(n2, t2)) return;
      e17.uniform4fv(this.addr, t2), Qa(n2, t2);
    }
  }
  function io(e17, t2) {
    let n2 = this.cache, r2 = t2.elements;
    if (r2 === void 0) {
      if (Za(n2, t2)) return;
      e17.uniformMatrix2fv(this.addr, false, t2), Qa(n2, t2);
    } else {
      if (Za(n2, r2)) return;
      Ya.set(r2), e17.uniformMatrix2fv(this.addr, false, Ya), Qa(n2, r2);
    }
  }
  function ao(e17, t2) {
    let n2 = this.cache, r2 = t2.elements;
    if (r2 === void 0) {
      if (Za(n2, t2)) return;
      e17.uniformMatrix3fv(this.addr, false, t2), Qa(n2, t2);
    } else {
      if (Za(n2, r2)) return;
      Ja.set(r2), e17.uniformMatrix3fv(this.addr, false, Ja), Qa(n2, r2);
    }
  }
  function oo(e17, t2) {
    let n2 = this.cache, r2 = t2.elements;
    if (r2 === void 0) {
      if (Za(n2, t2)) return;
      e17.uniformMatrix4fv(this.addr, false, t2), Qa(n2, t2);
    } else {
      if (Za(n2, r2)) return;
      qa.set(r2), e17.uniformMatrix4fv(this.addr, false, qa), Qa(n2, r2);
    }
  }
  function so(e17, t2) {
    let n2 = this.cache;
    n2[0] !== t2 && (e17.uniform1i(this.addr, t2), n2[0] = t2);
  }
  function co(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y) && (e17.uniform2i(this.addr, t2.x, t2.y), n2[0] = t2.x, n2[1] = t2.y);
    else {
      if (Za(n2, t2)) return;
      e17.uniform2iv(this.addr, t2), Qa(n2, t2);
    }
  }
  function lo(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y || n2[2] !== t2.z) && (e17.uniform3i(this.addr, t2.x, t2.y, t2.z), n2[0] = t2.x, n2[1] = t2.y, n2[2] = t2.z);
    else {
      if (Za(n2, t2)) return;
      e17.uniform3iv(this.addr, t2), Qa(n2, t2);
    }
  }
  function uo(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y || n2[2] !== t2.z || n2[3] !== t2.w) && (e17.uniform4i(this.addr, t2.x, t2.y, t2.z, t2.w), n2[0] = t2.x, n2[1] = t2.y, n2[2] = t2.z, n2[3] = t2.w);
    else {
      if (Za(n2, t2)) return;
      e17.uniform4iv(this.addr, t2), Qa(n2, t2);
    }
  }
  function fo(e17, t2) {
    let n2 = this.cache;
    n2[0] !== t2 && (e17.uniform1ui(this.addr, t2), n2[0] = t2);
  }
  function po(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y) && (e17.uniform2ui(this.addr, t2.x, t2.y), n2[0] = t2.x, n2[1] = t2.y);
    else {
      if (Za(n2, t2)) return;
      e17.uniform2uiv(this.addr, t2), Qa(n2, t2);
    }
  }
  function mo(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y || n2[2] !== t2.z) && (e17.uniform3ui(this.addr, t2.x, t2.y, t2.z), n2[0] = t2.x, n2[1] = t2.y, n2[2] = t2.z);
    else {
      if (Za(n2, t2)) return;
      e17.uniform3uiv(this.addr, t2), Qa(n2, t2);
    }
  }
  function ho(e17, t2) {
    let n2 = this.cache;
    if (t2.x !== void 0) (n2[0] !== t2.x || n2[1] !== t2.y || n2[2] !== t2.z || n2[3] !== t2.w) && (e17.uniform4ui(this.addr, t2.x, t2.y, t2.z, t2.w), n2[0] = t2.x, n2[1] = t2.y, n2[2] = t2.z, n2[3] = t2.w);
    else {
      if (Za(n2, t2)) return;
      e17.uniform4uiv(this.addr, t2), Qa(n2, t2);
    }
  }
  function go(e17, t2, n2) {
    let r2 = this.cache, i2 = n2.allocateTextureUnit();
    r2[0] !== i2 && (e17.uniform1i(this.addr, i2), r2[0] = i2);
    let a2;
    this.type === e17.SAMPLER_2D_SHADOW ? (Va.compareFunction = 515, a2 = Va) : a2 = Ba, n2.setTexture2D(t2 || a2, i2);
  }
  function _o(e17, t2, n2) {
    let r2 = this.cache, i2 = n2.allocateTextureUnit();
    r2[0] !== i2 && (e17.uniform1i(this.addr, i2), r2[0] = i2), n2.setTexture3D(t2 || Ua, i2);
  }
  function vo(e17, t2, n2) {
    let r2 = this.cache, i2 = n2.allocateTextureUnit();
    r2[0] !== i2 && (e17.uniform1i(this.addr, i2), r2[0] = i2), n2.setTextureCube(t2 || Wa, i2);
  }
  function yo(e17, t2, n2) {
    let r2 = this.cache, i2 = n2.allocateTextureUnit();
    r2[0] !== i2 && (e17.uniform1i(this.addr, i2), r2[0] = i2), n2.setTexture2DArray(t2 || Ha, i2);
  }
  function bo(e17) {
    switch (e17) {
      case 5126:
        return eo;
      case 35664:
        return to;
      case 35665:
        return no;
      case 35666:
        return ro;
      case 35674:
        return io;
      case 35675:
        return ao;
      case 35676:
        return oo;
      case 5124:
      case 35670:
        return so;
      case 35667:
      case 35671:
        return co;
      case 35668:
      case 35672:
        return lo;
      case 35669:
      case 35673:
        return uo;
      case 5125:
        return fo;
      case 36294:
        return po;
      case 36295:
        return mo;
      case 36296:
        return ho;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return go;
      case 35679:
      case 36299:
      case 36307:
        return _o;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return vo;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return yo;
    }
  }
  function xo(e17, t2) {
    e17.uniform1fv(this.addr, t2);
  }
  function So(e17, t2) {
    let n2 = Xa(t2, this.size, 2);
    e17.uniform2fv(this.addr, n2);
  }
  function Co(e17, t2) {
    let n2 = Xa(t2, this.size, 3);
    e17.uniform3fv(this.addr, n2);
  }
  function wo(e17, t2) {
    let n2 = Xa(t2, this.size, 4);
    e17.uniform4fv(this.addr, n2);
  }
  function To(e17, t2) {
    let n2 = Xa(t2, this.size, 4);
    e17.uniformMatrix2fv(this.addr, false, n2);
  }
  function Eo(e17, t2) {
    let n2 = Xa(t2, this.size, 9);
    e17.uniformMatrix3fv(this.addr, false, n2);
  }
  function Do(e17, t2) {
    let n2 = Xa(t2, this.size, 16);
    e17.uniformMatrix4fv(this.addr, false, n2);
  }
  function Oo(e17, t2) {
    e17.uniform1iv(this.addr, t2);
  }
  function ko(e17, t2) {
    e17.uniform2iv(this.addr, t2);
  }
  function Ao(e17, t2) {
    e17.uniform3iv(this.addr, t2);
  }
  function jo(e17, t2) {
    e17.uniform4iv(this.addr, t2);
  }
  function Mo(e17, t2) {
    e17.uniform1uiv(this.addr, t2);
  }
  function No(e17, t2) {
    e17.uniform2uiv(this.addr, t2);
  }
  function Po(e17, t2) {
    e17.uniform3uiv(this.addr, t2);
  }
  function Fo(e17, t2) {
    e17.uniform4uiv(this.addr, t2);
  }
  function Io(e17, t2, n2) {
    let r2 = this.cache, i2 = t2.length, a2 = $a(n2, i2);
    Za(r2, a2) || (e17.uniform1iv(this.addr, a2), Qa(r2, a2));
    for (let e18 = 0; e18 !== i2; ++e18) n2.setTexture2D(t2[e18] || Ba, a2[e18]);
  }
  function Lo(e17, t2, n2) {
    let r2 = this.cache, i2 = t2.length, a2 = $a(n2, i2);
    Za(r2, a2) || (e17.uniform1iv(this.addr, a2), Qa(r2, a2));
    for (let e18 = 0; e18 !== i2; ++e18) n2.setTexture3D(t2[e18] || Ua, a2[e18]);
  }
  function Ro(e17, t2, n2) {
    let r2 = this.cache, i2 = t2.length, a2 = $a(n2, i2);
    Za(r2, a2) || (e17.uniform1iv(this.addr, a2), Qa(r2, a2));
    for (let e18 = 0; e18 !== i2; ++e18) n2.setTextureCube(t2[e18] || Wa, a2[e18]);
  }
  function zo(e17, t2, n2) {
    let r2 = this.cache, i2 = t2.length, a2 = $a(n2, i2);
    Za(r2, a2) || (e17.uniform1iv(this.addr, a2), Qa(r2, a2));
    for (let e18 = 0; e18 !== i2; ++e18) n2.setTexture2DArray(t2[e18] || Ha, a2[e18]);
  }
  function Bo(e17) {
    switch (e17) {
      case 5126:
        return xo;
      case 35664:
        return So;
      case 35665:
        return Co;
      case 35666:
        return wo;
      case 35674:
        return To;
      case 35675:
        return Eo;
      case 35676:
        return Do;
      case 5124:
      case 35670:
        return Oo;
      case 35667:
      case 35671:
        return ko;
      case 35668:
      case 35672:
        return Ao;
      case 35669:
      case 35673:
        return jo;
      case 5125:
        return Mo;
      case 36294:
        return No;
      case 36295:
        return Po;
      case 36296:
        return Fo;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return Io;
      case 35679:
      case 36299:
      case 36307:
        return Lo;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return Ro;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return zo;
    }
  }
  var Vo = class {
    constructor(e17, t2, n2) {
      this.id = e17, this.addr = n2, this.cache = [], this.type = t2.type, this.setValue = bo(t2.type);
    }
  };
  var Ho = class {
    constructor(e17, t2, n2) {
      this.id = e17, this.addr = n2, this.cache = [], this.type = t2.type, this.size = t2.size, this.setValue = Bo(t2.type);
    }
  };
  var Uo = class {
    constructor(e17) {
      this.id = e17, this.seq = [], this.map = {};
    }
    setValue(e17, t2, n2) {
      let r2 = this.seq;
      for (let i2 = 0, a2 = r2.length; i2 !== a2; ++i2) {
        let a3 = r2[i2];
        a3.setValue(e17, t2[a3.id], n2);
      }
    }
  };
  var Wo = /(\w+)(\])?(\[|\.)?/g;
  function Go(e17, t2) {
    e17.seq.push(t2), e17.map[t2.id] = t2;
  }
  function Ko(e17, t2, n2) {
    let r2 = e17.name, i2 = r2.length;
    for (Wo.lastIndex = 0; ; ) {
      let a2 = Wo.exec(r2), o2 = Wo.lastIndex, s2 = a2[1], c2 = a2[2] === `]`, l2 = a2[3];
      if (c2 && (s2 |= 0), l2 === void 0 || l2 === `[` && o2 + 2 === i2) {
        Go(n2, l2 === void 0 ? new Vo(s2, e17, t2) : new Ho(s2, e17, t2));
        break;
      } else {
        let e18 = n2.map[s2];
        e18 === void 0 && (e18 = new Uo(s2), Go(n2, e18)), n2 = e18;
      }
    }
  }
  var qo = class {
    constructor(e17, t2) {
      this.seq = [], this.map = {};
      let n2 = e17.getProgramParameter(t2, e17.ACTIVE_UNIFORMS);
      for (let r2 = 0; r2 < n2; ++r2) {
        let n3 = e17.getActiveUniform(t2, r2);
        Ko(n3, e17.getUniformLocation(t2, n3.name), this);
      }
    }
    setValue(e17, t2, n2, r2) {
      let i2 = this.map[t2];
      i2 !== void 0 && i2.setValue(e17, n2, r2);
    }
    setOptional(e17, t2, n2) {
      let r2 = t2[n2];
      r2 !== void 0 && this.setValue(e17, n2, r2);
    }
    static upload(e17, t2, n2, r2) {
      for (let i2 = 0, a2 = t2.length; i2 !== a2; ++i2) {
        let a3 = t2[i2], o2 = n2[a3.id];
        o2.needsUpdate !== false && a3.setValue(e17, o2.value, r2);
      }
    }
    static seqWithValue(e17, t2) {
      let n2 = [];
      for (let r2 = 0, i2 = e17.length; r2 !== i2; ++r2) {
        let i3 = e17[r2];
        i3.id in t2 && n2.push(i3);
      }
      return n2;
    }
  };
  function Jo(e17, t2, n2) {
    let r2 = e17.createShader(t2);
    return e17.shaderSource(r2, n2), e17.compileShader(r2), r2;
  }
  var Yo = 37297;
  var Xo = 0;
  function Zo(e17, t2) {
    let n2 = e17.split(`
`), r2 = [], i2 = Math.max(t2 - 6, 0), a2 = Math.min(t2 + 6, n2.length);
    for (let e18 = i2; e18 < a2; e18++) {
      let i3 = e18 + 1;
      r2.push(`${i3 === t2 ? `>` : ` `} ${i3}: ${n2[e18]}`);
    }
    return r2.join(`
`);
  }
  var Qo = new G();
  function $o(e17) {
    K._getMatrix(Qo, K.workingColorSpace, e17);
    let t2 = `mat3( ${Qo.elements.map((e18) => e18.toFixed(4))} )`;
    switch (K.getTransfer(e17)) {
      case Ve:
        return [t2, `LinearTransferOETF`];
      case He:
        return [t2, `sRGBTransferOETF`];
      default:
        return console.warn(`THREE.WebGLProgram: Unsupported color space: `, e17), [t2, `LinearTransferOETF`];
    }
  }
  function es(e17, t2, n2) {
    let r2 = e17.getShaderParameter(t2, e17.COMPILE_STATUS), i2 = (e17.getShaderInfoLog(t2) || ``).trim();
    if (r2 && i2 === ``) return ``;
    let a2 = /ERROR: 0:(\d+)/.exec(i2);
    if (a2) {
      let r3 = parseInt(a2[1]);
      return n2.toUpperCase() + `

` + i2 + `

` + Zo(e17.getShaderSource(t2), r3);
    } else return i2;
  }
  function ts(e17, t2) {
    let n2 = $o(t2);
    return [`vec4 ${e17}( vec4 value ) {`, `	return ${n2[1]}( vec4( value.rgb * ${n2[0]}, value.a ) );`, `}`].join(`
`);
  }
  function ns(e17, t2) {
    let n2;
    switch (t2) {
      case 1:
        n2 = `Linear`;
        break;
      case 2:
        n2 = `Reinhard`;
        break;
      case 3:
        n2 = `Cineon`;
        break;
      case 4:
        n2 = `ACESFilmic`;
        break;
      case 6:
        n2 = `AgX`;
        break;
      case 7:
        n2 = `Neutral`;
        break;
      case 5:
        n2 = `Custom`;
        break;
      default:
        console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`, t2), n2 = `Linear`;
    }
    return `vec3 ` + e17 + `( vec3 color ) { return ` + n2 + `ToneMapping( color ); }`;
  }
  var rs = new W();
  function is() {
    return K.getLuminanceCoefficients(rs), [`float luminance( const in vec3 rgb ) {`, `	const vec3 weights = vec3( ${rs.x.toFixed(4)}, ${rs.y.toFixed(4)}, ${rs.z.toFixed(4)} );`, `	return dot( weights, rgb );`, `}`].join(`
`);
  }
  function as(e17) {
    return [e17.extensionClipCullDistance ? `#extension GL_ANGLE_clip_cull_distance : require` : ``, e17.extensionMultiDraw ? `#extension GL_ANGLE_multi_draw : require` : ``].filter(cs).join(`
`);
  }
  function os(e17) {
    let t2 = [];
    for (let n2 in e17) {
      let r2 = e17[n2];
      r2 !== false && t2.push(`#define ` + n2 + ` ` + r2);
    }
    return t2.join(`
`);
  }
  function ss(e17, t2) {
    let n2 = {}, r2 = e17.getProgramParameter(t2, e17.ACTIVE_ATTRIBUTES);
    for (let i2 = 0; i2 < r2; i2++) {
      let r3 = e17.getActiveAttrib(t2, i2), a2 = r3.name, o2 = 1;
      r3.type === e17.FLOAT_MAT2 && (o2 = 2), r3.type === e17.FLOAT_MAT3 && (o2 = 3), r3.type === e17.FLOAT_MAT4 && (o2 = 4), n2[a2] = { type: r3.type, location: e17.getAttribLocation(t2, a2), locationSize: o2 };
    }
    return n2;
  }
  function cs(e17) {
    return e17 !== ``;
  }
  function ls(e17, t2) {
    let n2 = t2.numSpotLightShadows + t2.numSpotLightMaps - t2.numSpotLightShadowsWithMaps;
    return e17.replace(/NUM_DIR_LIGHTS/g, t2.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t2.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t2.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n2).replace(/NUM_RECT_AREA_LIGHTS/g, t2.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t2.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t2.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t2.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t2.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t2.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t2.numPointLightShadows);
  }
  function us(e17, t2) {
    return e17.replace(/NUM_CLIPPING_PLANES/g, t2.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t2.numClippingPlanes - t2.numClipIntersection);
  }
  var ds = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function fs(e17) {
    return e17.replace(ds, ms);
  }
  var ps = /* @__PURE__ */ new Map();
  function ms(e17, t2) {
    let n2 = Y[t2];
    if (n2 === void 0) {
      let e18 = ps.get(t2);
      if (e18 !== void 0) n2 = Y[e18], console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`, t2, e18);
      else throw Error(`Can not resolve #include <` + t2 + `>`);
    }
    return fs(n2);
  }
  var hs = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
  function gs(e17) {
    return e17.replace(hs, _s);
  }
  function _s(e17, t2, n2, r2) {
    let i2 = ``;
    for (let e18 = parseInt(t2); e18 < parseInt(n2); e18++) i2 += r2.replace(/\[\s*i\s*\]/g, `[ ` + e18 + ` ]`).replace(/UNROLLED_LOOP_INDEX/g, e18);
    return i2;
  }
  function vs(e17) {
    let t2 = `precision ${e17.precision} float;
	precision ${e17.precision} int;
	precision ${e17.precision} sampler2D;
	precision ${e17.precision} samplerCube;
	precision ${e17.precision} sampler3D;
	precision ${e17.precision} sampler2DArray;
	precision ${e17.precision} sampler2DShadow;
	precision ${e17.precision} samplerCubeShadow;
	precision ${e17.precision} sampler2DArrayShadow;
	precision ${e17.precision} isampler2D;
	precision ${e17.precision} isampler3D;
	precision ${e17.precision} isamplerCube;
	precision ${e17.precision} isampler2DArray;
	precision ${e17.precision} usampler2D;
	precision ${e17.precision} usampler3D;
	precision ${e17.precision} usamplerCube;
	precision ${e17.precision} usampler2DArray;
	`;
    return e17.precision === `highp` ? t2 += `
#define HIGH_PRECISION` : e17.precision === `mediump` ? t2 += `
#define MEDIUM_PRECISION` : e17.precision === `lowp` && (t2 += `
#define LOW_PRECISION`), t2;
  }
  function ys(e17) {
    let t2 = `SHADOWMAP_TYPE_BASIC`;
    return e17.shadowMapType === 1 ? t2 = `SHADOWMAP_TYPE_PCF` : e17.shadowMapType === 2 ? t2 = `SHADOWMAP_TYPE_PCF_SOFT` : e17.shadowMapType === 3 && (t2 = `SHADOWMAP_TYPE_VSM`), t2;
  }
  function bs(e17) {
    let t2 = `ENVMAP_TYPE_CUBE`;
    if (e17.envMap) switch (e17.envMapMode) {
      case 301:
      case 302:
        t2 = `ENVMAP_TYPE_CUBE`;
        break;
      case 306:
        t2 = `ENVMAP_TYPE_CUBE_UV`;
        break;
    }
    return t2;
  }
  function xs(e17) {
    let t2 = `ENVMAP_MODE_REFLECTION`;
    if (e17.envMap) switch (e17.envMapMode) {
      case 302:
        t2 = `ENVMAP_MODE_REFRACTION`;
        break;
    }
    return t2;
  }
  function Ss(e17) {
    let t2 = `ENVMAP_BLENDING_NONE`;
    if (e17.envMap) switch (e17.combine) {
      case 0:
        t2 = `ENVMAP_BLENDING_MULTIPLY`;
        break;
      case 1:
        t2 = `ENVMAP_BLENDING_MIX`;
        break;
      case 2:
        t2 = `ENVMAP_BLENDING_ADD`;
        break;
    }
    return t2;
  }
  function Cs(e17) {
    let t2 = e17.envMapCubeUVHeight;
    if (t2 === null) return null;
    let n2 = Math.log2(t2) - 2, r2 = 1 / t2;
    return { texelWidth: 1 / (3 * Math.max(2 ** n2, 112)), texelHeight: r2, maxMip: n2 };
  }
  function ws(e17, t2, n2, r2) {
    let i2 = e17.getContext(), a2 = n2.defines, o2 = n2.vertexShader, s2 = n2.fragmentShader, c2 = ys(n2), l2 = bs(n2), u2 = xs(n2), d2 = Ss(n2), f2 = Cs(n2), p2 = as(n2), m2 = os(a2), h2 = i2.createProgram(), g2, _2, v2 = n2.glslVersion ? `#version ` + n2.glslVersion + `
` : ``;
    n2.isRawShaderMaterial ? (g2 = [`#define SHADER_TYPE ` + n2.shaderType, `#define SHADER_NAME ` + n2.shaderName, m2].filter(cs).join(`
`), g2.length > 0 && (g2 += `
`), _2 = [`#define SHADER_TYPE ` + n2.shaderType, `#define SHADER_NAME ` + n2.shaderName, m2].filter(cs).join(`
`), _2.length > 0 && (_2 += `
`)) : (g2 = [vs(n2), `#define SHADER_TYPE ` + n2.shaderType, `#define SHADER_NAME ` + n2.shaderName, m2, n2.extensionClipCullDistance ? `#define USE_CLIP_DISTANCE` : ``, n2.batching ? `#define USE_BATCHING` : ``, n2.batchingColor ? `#define USE_BATCHING_COLOR` : ``, n2.instancing ? `#define USE_INSTANCING` : ``, n2.instancingColor ? `#define USE_INSTANCING_COLOR` : ``, n2.instancingMorph ? `#define USE_INSTANCING_MORPH` : ``, n2.useFog && n2.fog ? `#define USE_FOG` : ``, n2.useFog && n2.fogExp2 ? `#define FOG_EXP2` : ``, n2.map ? `#define USE_MAP` : ``, n2.envMap ? `#define USE_ENVMAP` : ``, n2.envMap ? `#define ` + u2 : ``, n2.lightMap ? `#define USE_LIGHTMAP` : ``, n2.aoMap ? `#define USE_AOMAP` : ``, n2.bumpMap ? `#define USE_BUMPMAP` : ``, n2.normalMap ? `#define USE_NORMALMAP` : ``, n2.normalMapObjectSpace ? `#define USE_NORMALMAP_OBJECTSPACE` : ``, n2.normalMapTangentSpace ? `#define USE_NORMALMAP_TANGENTSPACE` : ``, n2.displacementMap ? `#define USE_DISPLACEMENTMAP` : ``, n2.emissiveMap ? `#define USE_EMISSIVEMAP` : ``, n2.anisotropy ? `#define USE_ANISOTROPY` : ``, n2.anisotropyMap ? `#define USE_ANISOTROPYMAP` : ``, n2.clearcoatMap ? `#define USE_CLEARCOATMAP` : ``, n2.clearcoatRoughnessMap ? `#define USE_CLEARCOAT_ROUGHNESSMAP` : ``, n2.clearcoatNormalMap ? `#define USE_CLEARCOAT_NORMALMAP` : ``, n2.iridescenceMap ? `#define USE_IRIDESCENCEMAP` : ``, n2.iridescenceThicknessMap ? `#define USE_IRIDESCENCE_THICKNESSMAP` : ``, n2.specularMap ? `#define USE_SPECULARMAP` : ``, n2.specularColorMap ? `#define USE_SPECULAR_COLORMAP` : ``, n2.specularIntensityMap ? `#define USE_SPECULAR_INTENSITYMAP` : ``, n2.roughnessMap ? `#define USE_ROUGHNESSMAP` : ``, n2.metalnessMap ? `#define USE_METALNESSMAP` : ``, n2.alphaMap ? `#define USE_ALPHAMAP` : ``, n2.alphaHash ? `#define USE_ALPHAHASH` : ``, n2.transmission ? `#define USE_TRANSMISSION` : ``, n2.transmissionMap ? `#define USE_TRANSMISSIONMAP` : ``, n2.thicknessMap ? `#define USE_THICKNESSMAP` : ``, n2.sheenColorMap ? `#define USE_SHEEN_COLORMAP` : ``, n2.sheenRoughnessMap ? `#define USE_SHEEN_ROUGHNESSMAP` : ``, n2.mapUv ? `#define MAP_UV ` + n2.mapUv : ``, n2.alphaMapUv ? `#define ALPHAMAP_UV ` + n2.alphaMapUv : ``, n2.lightMapUv ? `#define LIGHTMAP_UV ` + n2.lightMapUv : ``, n2.aoMapUv ? `#define AOMAP_UV ` + n2.aoMapUv : ``, n2.emissiveMapUv ? `#define EMISSIVEMAP_UV ` + n2.emissiveMapUv : ``, n2.bumpMapUv ? `#define BUMPMAP_UV ` + n2.bumpMapUv : ``, n2.normalMapUv ? `#define NORMALMAP_UV ` + n2.normalMapUv : ``, n2.displacementMapUv ? `#define DISPLACEMENTMAP_UV ` + n2.displacementMapUv : ``, n2.metalnessMapUv ? `#define METALNESSMAP_UV ` + n2.metalnessMapUv : ``, n2.roughnessMapUv ? `#define ROUGHNESSMAP_UV ` + n2.roughnessMapUv : ``, n2.anisotropyMapUv ? `#define ANISOTROPYMAP_UV ` + n2.anisotropyMapUv : ``, n2.clearcoatMapUv ? `#define CLEARCOATMAP_UV ` + n2.clearcoatMapUv : ``, n2.clearcoatNormalMapUv ? `#define CLEARCOAT_NORMALMAP_UV ` + n2.clearcoatNormalMapUv : ``, n2.clearcoatRoughnessMapUv ? `#define CLEARCOAT_ROUGHNESSMAP_UV ` + n2.clearcoatRoughnessMapUv : ``, n2.iridescenceMapUv ? `#define IRIDESCENCEMAP_UV ` + n2.iridescenceMapUv : ``, n2.iridescenceThicknessMapUv ? `#define IRIDESCENCE_THICKNESSMAP_UV ` + n2.iridescenceThicknessMapUv : ``, n2.sheenColorMapUv ? `#define SHEEN_COLORMAP_UV ` + n2.sheenColorMapUv : ``, n2.sheenRoughnessMapUv ? `#define SHEEN_ROUGHNESSMAP_UV ` + n2.sheenRoughnessMapUv : ``, n2.specularMapUv ? `#define SPECULARMAP_UV ` + n2.specularMapUv : ``, n2.specularColorMapUv ? `#define SPECULAR_COLORMAP_UV ` + n2.specularColorMapUv : ``, n2.specularIntensityMapUv ? `#define SPECULAR_INTENSITYMAP_UV ` + n2.specularIntensityMapUv : ``, n2.transmissionMapUv ? `#define TRANSMISSIONMAP_UV ` + n2.transmissionMapUv : ``, n2.thicknessMapUv ? `#define THICKNESSMAP_UV ` + n2.thicknessMapUv : ``, n2.vertexTangents && n2.flatShading === false ? `#define USE_TANGENT` : ``, n2.vertexColors ? `#define USE_COLOR` : ``, n2.vertexAlphas ? `#define USE_COLOR_ALPHA` : ``, n2.vertexUv1s ? `#define USE_UV1` : ``, n2.vertexUv2s ? `#define USE_UV2` : ``, n2.vertexUv3s ? `#define USE_UV3` : ``, n2.pointsUvs ? `#define USE_POINTS_UV` : ``, n2.flatShading ? `#define FLAT_SHADED` : ``, n2.skinning ? `#define USE_SKINNING` : ``, n2.morphTargets ? `#define USE_MORPHTARGETS` : ``, n2.morphNormals && n2.flatShading === false ? `#define USE_MORPHNORMALS` : ``, n2.morphColors ? `#define USE_MORPHCOLORS` : ``, n2.morphTargetsCount > 0 ? `#define MORPHTARGETS_TEXTURE_STRIDE ` + n2.morphTextureStride : ``, n2.morphTargetsCount > 0 ? `#define MORPHTARGETS_COUNT ` + n2.morphTargetsCount : ``, n2.doubleSided ? `#define DOUBLE_SIDED` : ``, n2.flipSided ? `#define FLIP_SIDED` : ``, n2.shadowMapEnabled ? `#define USE_SHADOWMAP` : ``, n2.shadowMapEnabled ? `#define ` + c2 : ``, n2.sizeAttenuation ? `#define USE_SIZEATTENUATION` : ``, n2.numLightProbes > 0 ? `#define USE_LIGHT_PROBES` : ``, n2.logarithmicDepthBuffer ? `#define USE_LOGARITHMIC_DEPTH_BUFFER` : ``, n2.reversedDepthBuffer ? `#define USE_REVERSED_DEPTH_BUFFER` : ``, `uniform mat4 modelMatrix;`, `uniform mat4 modelViewMatrix;`, `uniform mat4 projectionMatrix;`, `uniform mat4 viewMatrix;`, `uniform mat3 normalMatrix;`, `uniform vec3 cameraPosition;`, `uniform bool isOrthographic;`, `#ifdef USE_INSTANCING`, `	attribute mat4 instanceMatrix;`, `#endif`, `#ifdef USE_INSTANCING_COLOR`, `	attribute vec3 instanceColor;`, `#endif`, `#ifdef USE_INSTANCING_MORPH`, `	uniform sampler2D morphTexture;`, `#endif`, `attribute vec3 position;`, `attribute vec3 normal;`, `attribute vec2 uv;`, `#ifdef USE_UV1`, `	attribute vec2 uv1;`, `#endif`, `#ifdef USE_UV2`, `	attribute vec2 uv2;`, `#endif`, `#ifdef USE_UV3`, `	attribute vec2 uv3;`, `#endif`, `#ifdef USE_TANGENT`, `	attribute vec4 tangent;`, `#endif`, `#if defined( USE_COLOR_ALPHA )`, `	attribute vec4 color;`, `#elif defined( USE_COLOR )`, `	attribute vec3 color;`, `#endif`, `#ifdef USE_SKINNING`, `	attribute vec4 skinIndex;`, `	attribute vec4 skinWeight;`, `#endif`, `
`].filter(cs).join(`
`), _2 = [vs(n2), `#define SHADER_TYPE ` + n2.shaderType, `#define SHADER_NAME ` + n2.shaderName, m2, n2.useFog && n2.fog ? `#define USE_FOG` : ``, n2.useFog && n2.fogExp2 ? `#define FOG_EXP2` : ``, n2.alphaToCoverage ? `#define ALPHA_TO_COVERAGE` : ``, n2.map ? `#define USE_MAP` : ``, n2.matcap ? `#define USE_MATCAP` : ``, n2.envMap ? `#define USE_ENVMAP` : ``, n2.envMap ? `#define ` + l2 : ``, n2.envMap ? `#define ` + u2 : ``, n2.envMap ? `#define ` + d2 : ``, f2 ? `#define CUBEUV_TEXEL_WIDTH ` + f2.texelWidth : ``, f2 ? `#define CUBEUV_TEXEL_HEIGHT ` + f2.texelHeight : ``, f2 ? `#define CUBEUV_MAX_MIP ` + f2.maxMip + `.0` : ``, n2.lightMap ? `#define USE_LIGHTMAP` : ``, n2.aoMap ? `#define USE_AOMAP` : ``, n2.bumpMap ? `#define USE_BUMPMAP` : ``, n2.normalMap ? `#define USE_NORMALMAP` : ``, n2.normalMapObjectSpace ? `#define USE_NORMALMAP_OBJECTSPACE` : ``, n2.normalMapTangentSpace ? `#define USE_NORMALMAP_TANGENTSPACE` : ``, n2.emissiveMap ? `#define USE_EMISSIVEMAP` : ``, n2.anisotropy ? `#define USE_ANISOTROPY` : ``, n2.anisotropyMap ? `#define USE_ANISOTROPYMAP` : ``, n2.clearcoat ? `#define USE_CLEARCOAT` : ``, n2.clearcoatMap ? `#define USE_CLEARCOATMAP` : ``, n2.clearcoatRoughnessMap ? `#define USE_CLEARCOAT_ROUGHNESSMAP` : ``, n2.clearcoatNormalMap ? `#define USE_CLEARCOAT_NORMALMAP` : ``, n2.dispersion ? `#define USE_DISPERSION` : ``, n2.iridescence ? `#define USE_IRIDESCENCE` : ``, n2.iridescenceMap ? `#define USE_IRIDESCENCEMAP` : ``, n2.iridescenceThicknessMap ? `#define USE_IRIDESCENCE_THICKNESSMAP` : ``, n2.specularMap ? `#define USE_SPECULARMAP` : ``, n2.specularColorMap ? `#define USE_SPECULAR_COLORMAP` : ``, n2.specularIntensityMap ? `#define USE_SPECULAR_INTENSITYMAP` : ``, n2.roughnessMap ? `#define USE_ROUGHNESSMAP` : ``, n2.metalnessMap ? `#define USE_METALNESSMAP` : ``, n2.alphaMap ? `#define USE_ALPHAMAP` : ``, n2.alphaTest ? `#define USE_ALPHATEST` : ``, n2.alphaHash ? `#define USE_ALPHAHASH` : ``, n2.sheen ? `#define USE_SHEEN` : ``, n2.sheenColorMap ? `#define USE_SHEEN_COLORMAP` : ``, n2.sheenRoughnessMap ? `#define USE_SHEEN_ROUGHNESSMAP` : ``, n2.transmission ? `#define USE_TRANSMISSION` : ``, n2.transmissionMap ? `#define USE_TRANSMISSIONMAP` : ``, n2.thicknessMap ? `#define USE_THICKNESSMAP` : ``, n2.vertexTangents && n2.flatShading === false ? `#define USE_TANGENT` : ``, n2.vertexColors || n2.instancingColor || n2.batchingColor ? `#define USE_COLOR` : ``, n2.vertexAlphas ? `#define USE_COLOR_ALPHA` : ``, n2.vertexUv1s ? `#define USE_UV1` : ``, n2.vertexUv2s ? `#define USE_UV2` : ``, n2.vertexUv3s ? `#define USE_UV3` : ``, n2.pointsUvs ? `#define USE_POINTS_UV` : ``, n2.gradientMap ? `#define USE_GRADIENTMAP` : ``, n2.flatShading ? `#define FLAT_SHADED` : ``, n2.doubleSided ? `#define DOUBLE_SIDED` : ``, n2.flipSided ? `#define FLIP_SIDED` : ``, n2.shadowMapEnabled ? `#define USE_SHADOWMAP` : ``, n2.shadowMapEnabled ? `#define ` + c2 : ``, n2.premultipliedAlpha ? `#define PREMULTIPLIED_ALPHA` : ``, n2.numLightProbes > 0 ? `#define USE_LIGHT_PROBES` : ``, n2.decodeVideoTexture ? `#define DECODE_VIDEO_TEXTURE` : ``, n2.decodeVideoTextureEmissive ? `#define DECODE_VIDEO_TEXTURE_EMISSIVE` : ``, n2.logarithmicDepthBuffer ? `#define USE_LOGARITHMIC_DEPTH_BUFFER` : ``, n2.reversedDepthBuffer ? `#define USE_REVERSED_DEPTH_BUFFER` : ``, `uniform mat4 viewMatrix;`, `uniform vec3 cameraPosition;`, `uniform bool isOrthographic;`, n2.toneMapping === 0 ? `` : `#define TONE_MAPPING`, n2.toneMapping === 0 ? `` : Y.tonemapping_pars_fragment, n2.toneMapping === 0 ? `` : ns(`toneMapping`, n2.toneMapping), n2.dithering ? `#define DITHERING` : ``, n2.opaque ? `#define OPAQUE` : ``, Y.colorspace_pars_fragment, ts(`linearToOutputTexel`, n2.outputColorSpace), is(), n2.useDepthPacking ? `#define DEPTH_PACKING ` + n2.depthPacking : ``, `
`].filter(cs).join(`
`)), o2 = fs(o2), o2 = ls(o2, n2), o2 = us(o2, n2), s2 = fs(s2), s2 = ls(s2, n2), s2 = us(s2, n2), o2 = gs(o2), s2 = gs(s2), n2.isRawShaderMaterial !== true && (v2 = `#version 300 es
`, g2 = [p2, `#define attribute in`, `#define varying out`, `#define texture2D texture`].join(`
`) + `
` + g2, _2 = [`#define varying in`, n2.glslVersion === `300 es` ? `` : `layout(location = 0) out highp vec4 pc_fragColor;`, n2.glslVersion === `300 es` ? `` : `#define gl_FragColor pc_fragColor`, `#define gl_FragDepthEXT gl_FragDepth`, `#define texture2D texture`, `#define textureCube texture`, `#define texture2DProj textureProj`, `#define texture2DLodEXT textureLod`, `#define texture2DProjLodEXT textureProjLod`, `#define textureCubeLodEXT textureLod`, `#define texture2DGradEXT textureGrad`, `#define texture2DProjGradEXT textureProjGrad`, `#define textureCubeGradEXT textureGrad`].join(`
`) + `
` + _2);
    let y2 = v2 + g2 + o2, b2 = v2 + _2 + s2, x2 = Jo(i2, i2.VERTEX_SHADER, y2), S2 = Jo(i2, i2.FRAGMENT_SHADER, b2);
    i2.attachShader(h2, x2), i2.attachShader(h2, S2), n2.index0AttributeName === void 0 ? n2.morphTargets === true && i2.bindAttribLocation(h2, 0, `position`) : i2.bindAttribLocation(h2, 0, n2.index0AttributeName), i2.linkProgram(h2);
    function C2(t3) {
      if (e17.debug.checkShaderErrors) {
        let n3 = i2.getProgramInfoLog(h2) || ``, r3 = i2.getShaderInfoLog(x2) || ``, a3 = i2.getShaderInfoLog(S2) || ``, o3 = n3.trim(), s3 = r3.trim(), c3 = a3.trim(), l3 = true, u3 = true;
        if (i2.getProgramParameter(h2, i2.LINK_STATUS) === false) if (l3 = false, typeof e17.debug.onShaderError == `function`) e17.debug.onShaderError(i2, h2, x2, S2);
        else {
          let e18 = es(i2, x2, `vertex`), n4 = es(i2, S2, `fragment`);
          console.error(`THREE.WebGLProgram: Shader Error ` + i2.getError() + ` - VALIDATE_STATUS ` + i2.getProgramParameter(h2, i2.VALIDATE_STATUS) + `

Material Name: ` + t3.name + `
Material Type: ` + t3.type + `

Program Info Log: ` + o3 + `
` + e18 + `
` + n4);
        }
        else o3 === `` ? (s3 === `` || c3 === ``) && (u3 = false) : console.warn(`THREE.WebGLProgram: Program Info Log:`, o3);
        u3 && (t3.diagnostics = { runnable: l3, programLog: o3, vertexShader: { log: s3, prefix: g2 }, fragmentShader: { log: c3, prefix: _2 } });
      }
      i2.deleteShader(x2), i2.deleteShader(S2), w2 = new qo(i2, h2), T2 = ss(i2, h2);
    }
    let w2;
    this.getUniforms = function() {
      return w2 === void 0 && C2(this), w2;
    };
    let T2;
    this.getAttributes = function() {
      return T2 === void 0 && C2(this), T2;
    };
    let E2 = n2.rendererExtensionParallelShaderCompile === false;
    return this.isReady = function() {
      return E2 === false && (E2 = i2.getProgramParameter(h2, Yo)), E2;
    }, this.destroy = function() {
      r2.releaseStatesOfProgram(this), i2.deleteProgram(h2), this.program = void 0;
    }, this.type = n2.shaderType, this.name = n2.shaderName, this.id = Xo++, this.cacheKey = t2, this.usedTimes = 1, this.program = h2, this.vertexShader = x2, this.fragmentShader = S2, this;
  }
  var Ts = 0;
  var Es = class {
    constructor() {
      this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
    }
    update(e17) {
      let t2 = e17.vertexShader, n2 = e17.fragmentShader, r2 = this._getShaderStage(t2), i2 = this._getShaderStage(n2), a2 = this._getShaderCacheForMaterial(e17);
      return a2.has(r2) === false && (a2.add(r2), r2.usedTimes++), a2.has(i2) === false && (a2.add(i2), i2.usedTimes++), this;
    }
    remove(e17) {
      let t2 = this.materialCache.get(e17);
      for (let e18 of t2) e18.usedTimes--, e18.usedTimes === 0 && this.shaderCache.delete(e18.code);
      return this.materialCache.delete(e17), this;
    }
    getVertexShaderID(e17) {
      return this._getShaderStage(e17.vertexShader).id;
    }
    getFragmentShaderID(e17) {
      return this._getShaderStage(e17.fragmentShader).id;
    }
    dispose() {
      this.shaderCache.clear(), this.materialCache.clear();
    }
    _getShaderCacheForMaterial(e17) {
      let t2 = this.materialCache, n2 = t2.get(e17);
      return n2 === void 0 && (n2 = /* @__PURE__ */ new Set(), t2.set(e17, n2)), n2;
    }
    _getShaderStage(e17) {
      let t2 = this.shaderCache, n2 = t2.get(e17);
      return n2 === void 0 && (n2 = new Ds(e17), t2.set(e17, n2)), n2;
    }
  };
  var Ds = class {
    constructor(e17) {
      this.id = Ts++, this.code = e17, this.usedTimes = 0;
    }
  };
  function Os(e17, t2, n2, r2, i2, a2, o2) {
    let s2 = new mn(), c2 = new Es(), l2 = /* @__PURE__ */ new Set(), u2 = [], d2 = i2.logarithmicDepthBuffer, f2 = i2.vertexTextures, p2 = i2.precision, m2 = { MeshDepthMaterial: `depth`, MeshDistanceMaterial: `distanceRGBA`, MeshNormalMaterial: `normal`, MeshBasicMaterial: `basic`, MeshLambertMaterial: `lambert`, MeshPhongMaterial: `phong`, MeshToonMaterial: `toon`, MeshStandardMaterial: `physical`, MeshPhysicalMaterial: `physical`, MeshMatcapMaterial: `matcap`, LineBasicMaterial: `basic`, LineDashedMaterial: `dashed`, PointsMaterial: `points`, ShadowMaterial: `shadow`, SpriteMaterial: `sprite` };
    function h2(e18) {
      return l2.add(e18), e18 === 0 ? `uv` : `uv${e18}`;
    }
    function g2(a3, s3, u3, g3, _3) {
      let v3 = g3.fog, y3 = _3.geometry, b3 = a3.isMeshStandardMaterial ? g3.environment : null, x3 = (a3.isMeshStandardMaterial ? n2 : t2).get(a3.envMap || b3), S3 = x3 && x3.mapping === 306 ? x3.image.height : null, C3 = m2[a3.type];
      a3.precision !== null && (p2 = i2.getMaxPrecision(a3.precision), p2 !== a3.precision && console.warn(`THREE.WebGLProgram.getParameters:`, a3.precision, `not supported, using`, p2, `instead.`));
      let w3 = y3.morphAttributes.position || y3.morphAttributes.normal || y3.morphAttributes.color, T2 = w3 === void 0 ? 0 : w3.length, E2 = 0;
      y3.morphAttributes.position !== void 0 && (E2 = 1), y3.morphAttributes.normal !== void 0 && (E2 = 2), y3.morphAttributes.color !== void 0 && (E2 = 3);
      let D2, O2, k2, A3;
      if (C3) {
        let e18 = na[C3];
        D2 = e18.vertexShader, O2 = e18.fragmentShader;
      } else D2 = a3.vertexShader, O2 = a3.fragmentShader, c2.update(a3), k2 = c2.getVertexShaderID(a3), A3 = c2.getFragmentShaderID(a3);
      let j3 = e17.getRenderTarget(), ee2 = e17.state.buffers.depth.getReversed(), te2 = _3.isInstancedMesh === true, M3 = _3.isBatchedMesh === true, N3 = !!a3.map, P2 = !!a3.matcap, ne2 = !!x3, re2 = !!a3.aoMap, ie2 = !!a3.lightMap, ae2 = !!a3.bumpMap, oe2 = !!a3.normalMap, se2 = !!a3.displacementMap, F2 = !!a3.emissiveMap, ce2 = !!a3.metalnessMap, le2 = !!a3.roughnessMap, ue2 = a3.anisotropy > 0, de2 = a3.clearcoat > 0, fe2 = a3.dispersion > 0, pe2 = a3.iridescence > 0, me2 = a3.sheen > 0, I2 = a3.transmission > 0, he2 = ue2 && !!a3.anisotropyMap, L2 = de2 && !!a3.clearcoatMap, R2 = de2 && !!a3.clearcoatNormalMap, z2 = de2 && !!a3.clearcoatRoughnessMap, ge2 = pe2 && !!a3.iridescenceMap, B2 = pe2 && !!a3.iridescenceThicknessMap, V2 = me2 && !!a3.sheenColorMap, _e2 = me2 && !!a3.sheenRoughnessMap, ve2 = !!a3.specularMap, ye2 = !!a3.specularColorMap, be2 = !!a3.specularIntensityMap, xe2 = I2 && !!a3.transmissionMap, Se2 = I2 && !!a3.thicknessMap, Ce2 = !!a3.gradientMap, we2 = !!a3.alphaMap, Te2 = a3.alphaTest > 0, Ee2 = !!a3.alphaHash, De2 = !!a3.extensions, Oe2 = 0;
      a3.toneMapped && (j3 === null || j3.isXRRenderTarget === true) && (Oe2 = e17.toneMapping);
      let ke2 = { shaderID: C3, shaderType: a3.type, shaderName: a3.name, vertexShader: D2, fragmentShader: O2, defines: a3.defines, customVertexShaderID: k2, customFragmentShaderID: A3, isRawShaderMaterial: a3.isRawShaderMaterial === true, glslVersion: a3.glslVersion, precision: p2, batching: M3, batchingColor: M3 && _3._colorsTexture !== null, instancing: te2, instancingColor: te2 && _3.instanceColor !== null, instancingMorph: te2 && _3.morphTexture !== null, supportsVertexTextures: f2, outputColorSpace: j3 === null ? e17.outputColorSpace : j3.isXRRenderTarget === true ? j3.texture.colorSpace : Be, alphaToCoverage: !!a3.alphaToCoverage, map: N3, matcap: P2, envMap: ne2, envMapMode: ne2 && x3.mapping, envMapCubeUVHeight: S3, aoMap: re2, lightMap: ie2, bumpMap: ae2, normalMap: oe2, displacementMap: f2 && se2, emissiveMap: F2, normalMapObjectSpace: oe2 && a3.normalMapType === 1, normalMapTangentSpace: oe2 && a3.normalMapType === 0, metalnessMap: ce2, roughnessMap: le2, anisotropy: ue2, anisotropyMap: he2, clearcoat: de2, clearcoatMap: L2, clearcoatNormalMap: R2, clearcoatRoughnessMap: z2, dispersion: fe2, iridescence: pe2, iridescenceMap: ge2, iridescenceThicknessMap: B2, sheen: me2, sheenColorMap: V2, sheenRoughnessMap: _e2, specularMap: ve2, specularColorMap: ye2, specularIntensityMap: be2, transmission: I2, transmissionMap: xe2, thicknessMap: Se2, gradientMap: Ce2, opaque: a3.transparent === false && a3.blending === 1 && a3.alphaToCoverage === false, alphaMap: we2, alphaTest: Te2, alphaHash: Ee2, combine: a3.combine, mapUv: N3 && h2(a3.map.channel), aoMapUv: re2 && h2(a3.aoMap.channel), lightMapUv: ie2 && h2(a3.lightMap.channel), bumpMapUv: ae2 && h2(a3.bumpMap.channel), normalMapUv: oe2 && h2(a3.normalMap.channel), displacementMapUv: se2 && h2(a3.displacementMap.channel), emissiveMapUv: F2 && h2(a3.emissiveMap.channel), metalnessMapUv: ce2 && h2(a3.metalnessMap.channel), roughnessMapUv: le2 && h2(a3.roughnessMap.channel), anisotropyMapUv: he2 && h2(a3.anisotropyMap.channel), clearcoatMapUv: L2 && h2(a3.clearcoatMap.channel), clearcoatNormalMapUv: R2 && h2(a3.clearcoatNormalMap.channel), clearcoatRoughnessMapUv: z2 && h2(a3.clearcoatRoughnessMap.channel), iridescenceMapUv: ge2 && h2(a3.iridescenceMap.channel), iridescenceThicknessMapUv: B2 && h2(a3.iridescenceThicknessMap.channel), sheenColorMapUv: V2 && h2(a3.sheenColorMap.channel), sheenRoughnessMapUv: _e2 && h2(a3.sheenRoughnessMap.channel), specularMapUv: ve2 && h2(a3.specularMap.channel), specularColorMapUv: ye2 && h2(a3.specularColorMap.channel), specularIntensityMapUv: be2 && h2(a3.specularIntensityMap.channel), transmissionMapUv: xe2 && h2(a3.transmissionMap.channel), thicknessMapUv: Se2 && h2(a3.thicknessMap.channel), alphaMapUv: we2 && h2(a3.alphaMap.channel), vertexTangents: !!y3.attributes.tangent && (oe2 || ue2), vertexColors: a3.vertexColors, vertexAlphas: a3.vertexColors === true && !!y3.attributes.color && y3.attributes.color.itemSize === 4, pointsUvs: _3.isPoints === true && !!y3.attributes.uv && (N3 || we2), fog: !!v3, useFog: a3.fog === true, fogExp2: !!v3 && v3.isFogExp2, flatShading: a3.flatShading === true && a3.wireframe === false, sizeAttenuation: a3.sizeAttenuation === true, logarithmicDepthBuffer: d2, reversedDepthBuffer: ee2, skinning: _3.isSkinnedMesh === true, morphTargets: y3.morphAttributes.position !== void 0, morphNormals: y3.morphAttributes.normal !== void 0, morphColors: y3.morphAttributes.color !== void 0, morphTargetsCount: T2, morphTextureStride: E2, numDirLights: s3.directional.length, numPointLights: s3.point.length, numSpotLights: s3.spot.length, numSpotLightMaps: s3.spotLightMap.length, numRectAreaLights: s3.rectArea.length, numHemiLights: s3.hemi.length, numDirLightShadows: s3.directionalShadowMap.length, numPointLightShadows: s3.pointShadowMap.length, numSpotLightShadows: s3.spotShadowMap.length, numSpotLightShadowsWithMaps: s3.numSpotLightShadowsWithMaps, numLightProbes: s3.numLightProbes, numClippingPlanes: o2.numPlanes, numClipIntersection: o2.numIntersection, dithering: a3.dithering, shadowMapEnabled: e17.shadowMap.enabled && u3.length > 0, shadowMapType: e17.shadowMap.type, toneMapping: Oe2, decodeVideoTexture: N3 && a3.map.isVideoTexture === true && K.getTransfer(a3.map.colorSpace) === `srgb`, decodeVideoTextureEmissive: F2 && a3.emissiveMap.isVideoTexture === true && K.getTransfer(a3.emissiveMap.colorSpace) === `srgb`, premultipliedAlpha: a3.premultipliedAlpha, doubleSided: a3.side === 2, flipSided: a3.side === 1, useDepthPacking: a3.depthPacking >= 0, depthPacking: a3.depthPacking || 0, index0AttributeName: a3.index0AttributeName, extensionClipCullDistance: De2 && a3.extensions.clipCullDistance === true && r2.has(`WEBGL_clip_cull_distance`), extensionMultiDraw: (De2 && a3.extensions.multiDraw === true || M3) && r2.has(`WEBGL_multi_draw`), rendererExtensionParallelShaderCompile: r2.has(`KHR_parallel_shader_compile`), customProgramCacheKey: a3.customProgramCacheKey() };
      return ke2.vertexUv1s = l2.has(1), ke2.vertexUv2s = l2.has(2), ke2.vertexUv3s = l2.has(3), l2.clear(), ke2;
    }
    function _2(t3) {
      let n3 = [];
      if (t3.shaderID ? n3.push(t3.shaderID) : (n3.push(t3.customVertexShaderID), n3.push(t3.customFragmentShaderID)), t3.defines !== void 0) for (let e18 in t3.defines) n3.push(e18), n3.push(t3.defines[e18]);
      return t3.isRawShaderMaterial === false && (v2(n3, t3), y2(n3, t3), n3.push(e17.outputColorSpace)), n3.push(t3.customProgramCacheKey), n3.join();
    }
    function v2(e18, t3) {
      e18.push(t3.precision), e18.push(t3.outputColorSpace), e18.push(t3.envMapMode), e18.push(t3.envMapCubeUVHeight), e18.push(t3.mapUv), e18.push(t3.alphaMapUv), e18.push(t3.lightMapUv), e18.push(t3.aoMapUv), e18.push(t3.bumpMapUv), e18.push(t3.normalMapUv), e18.push(t3.displacementMapUv), e18.push(t3.emissiveMapUv), e18.push(t3.metalnessMapUv), e18.push(t3.roughnessMapUv), e18.push(t3.anisotropyMapUv), e18.push(t3.clearcoatMapUv), e18.push(t3.clearcoatNormalMapUv), e18.push(t3.clearcoatRoughnessMapUv), e18.push(t3.iridescenceMapUv), e18.push(t3.iridescenceThicknessMapUv), e18.push(t3.sheenColorMapUv), e18.push(t3.sheenRoughnessMapUv), e18.push(t3.specularMapUv), e18.push(t3.specularColorMapUv), e18.push(t3.specularIntensityMapUv), e18.push(t3.transmissionMapUv), e18.push(t3.thicknessMapUv), e18.push(t3.combine), e18.push(t3.fogExp2), e18.push(t3.sizeAttenuation), e18.push(t3.morphTargetsCount), e18.push(t3.morphAttributeCount), e18.push(t3.numDirLights), e18.push(t3.numPointLights), e18.push(t3.numSpotLights), e18.push(t3.numSpotLightMaps), e18.push(t3.numHemiLights), e18.push(t3.numRectAreaLights), e18.push(t3.numDirLightShadows), e18.push(t3.numPointLightShadows), e18.push(t3.numSpotLightShadows), e18.push(t3.numSpotLightShadowsWithMaps), e18.push(t3.numLightProbes), e18.push(t3.shadowMapType), e18.push(t3.toneMapping), e18.push(t3.numClippingPlanes), e18.push(t3.numClipIntersection), e18.push(t3.depthPacking);
    }
    function y2(e18, t3) {
      s2.disableAll(), t3.supportsVertexTextures && s2.enable(0), t3.instancing && s2.enable(1), t3.instancingColor && s2.enable(2), t3.instancingMorph && s2.enable(3), t3.matcap && s2.enable(4), t3.envMap && s2.enable(5), t3.normalMapObjectSpace && s2.enable(6), t3.normalMapTangentSpace && s2.enable(7), t3.clearcoat && s2.enable(8), t3.iridescence && s2.enable(9), t3.alphaTest && s2.enable(10), t3.vertexColors && s2.enable(11), t3.vertexAlphas && s2.enable(12), t3.vertexUv1s && s2.enable(13), t3.vertexUv2s && s2.enable(14), t3.vertexUv3s && s2.enable(15), t3.vertexTangents && s2.enable(16), t3.anisotropy && s2.enable(17), t3.alphaHash && s2.enable(18), t3.batching && s2.enable(19), t3.dispersion && s2.enable(20), t3.batchingColor && s2.enable(21), t3.gradientMap && s2.enable(22), e18.push(s2.mask), s2.disableAll(), t3.fog && s2.enable(0), t3.useFog && s2.enable(1), t3.flatShading && s2.enable(2), t3.logarithmicDepthBuffer && s2.enable(3), t3.reversedDepthBuffer && s2.enable(4), t3.skinning && s2.enable(5), t3.morphTargets && s2.enable(6), t3.morphNormals && s2.enable(7), t3.morphColors && s2.enable(8), t3.premultipliedAlpha && s2.enable(9), t3.shadowMapEnabled && s2.enable(10), t3.doubleSided && s2.enable(11), t3.flipSided && s2.enable(12), t3.useDepthPacking && s2.enable(13), t3.dithering && s2.enable(14), t3.transmission && s2.enable(15), t3.sheen && s2.enable(16), t3.opaque && s2.enable(17), t3.pointsUvs && s2.enable(18), t3.decodeVideoTexture && s2.enable(19), t3.decodeVideoTextureEmissive && s2.enable(20), t3.alphaToCoverage && s2.enable(21), e18.push(s2.mask);
    }
    function b2(e18) {
      let t3 = m2[e18.type], n3;
      if (t3) {
        let e19 = na[t3];
        n3 = Nr.clone(e19.uniforms);
      } else n3 = e18.uniforms;
      return n3;
    }
    function x2(t3, n3) {
      let r3;
      for (let e18 = 0, t4 = u2.length; e18 < t4; e18++) {
        let t5 = u2[e18];
        if (t5.cacheKey === n3) {
          r3 = t5, ++r3.usedTimes;
          break;
        }
      }
      return r3 === void 0 && (r3 = new ws(e17, n3, t3, a2), u2.push(r3)), r3;
    }
    function S2(e18) {
      if (--e18.usedTimes === 0) {
        let t3 = u2.indexOf(e18);
        u2[t3] = u2[u2.length - 1], u2.pop(), e18.destroy();
      }
    }
    function C2(e18) {
      c2.remove(e18);
    }
    function w2() {
      c2.dispose();
    }
    return { getParameters: g2, getProgramCacheKey: _2, getUniforms: b2, acquireProgram: x2, releaseProgram: S2, releaseShaderCache: C2, programs: u2, dispose: w2 };
  }
  function ks() {
    let e17 = /* @__PURE__ */ new WeakMap();
    function t2(t3) {
      return e17.has(t3);
    }
    function n2(t3) {
      let n3 = e17.get(t3);
      return n3 === void 0 && (n3 = {}, e17.set(t3, n3)), n3;
    }
    function r2(t3) {
      e17.delete(t3);
    }
    function i2(t3, n3, r3) {
      e17.get(t3)[n3] = r3;
    }
    function a2() {
      e17 = /* @__PURE__ */ new WeakMap();
    }
    return { has: t2, get: n2, remove: r2, update: i2, dispose: a2 };
  }
  function As(e17, t2) {
    return e17.groupOrder === t2.groupOrder ? e17.renderOrder === t2.renderOrder ? e17.material.id === t2.material.id ? e17.z === t2.z ? e17.id - t2.id : e17.z - t2.z : e17.material.id - t2.material.id : e17.renderOrder - t2.renderOrder : e17.groupOrder - t2.groupOrder;
  }
  function js(e17, t2) {
    return e17.groupOrder === t2.groupOrder ? e17.renderOrder === t2.renderOrder ? e17.z === t2.z ? e17.id - t2.id : t2.z - e17.z : e17.renderOrder - t2.renderOrder : e17.groupOrder - t2.groupOrder;
  }
  function Ms() {
    let e17 = [], t2 = 0, n2 = [], r2 = [], i2 = [];
    function a2() {
      t2 = 0, n2.length = 0, r2.length = 0, i2.length = 0;
    }
    function o2(n3, r3, i3, a3, o3, s3) {
      let c3 = e17[t2];
      return c3 === void 0 ? (c3 = { id: n3.id, object: n3, geometry: r3, material: i3, groupOrder: a3, renderOrder: n3.renderOrder, z: o3, group: s3 }, e17[t2] = c3) : (c3.id = n3.id, c3.object = n3, c3.geometry = r3, c3.material = i3, c3.groupOrder = a3, c3.renderOrder = n3.renderOrder, c3.z = o3, c3.group = s3), t2++, c3;
    }
    function s2(e18, t3, a3, s3, c3, l3) {
      let u3 = o2(e18, t3, a3, s3, c3, l3);
      a3.transmission > 0 ? r2.push(u3) : a3.transparent === true ? i2.push(u3) : n2.push(u3);
    }
    function c2(e18, t3, a3, s3, c3, l3) {
      let u3 = o2(e18, t3, a3, s3, c3, l3);
      a3.transmission > 0 ? r2.unshift(u3) : a3.transparent === true ? i2.unshift(u3) : n2.unshift(u3);
    }
    function l2(e18, t3) {
      n2.length > 1 && n2.sort(e18 || As), r2.length > 1 && r2.sort(t3 || js), i2.length > 1 && i2.sort(t3 || js);
    }
    function u2() {
      for (let n3 = t2, r3 = e17.length; n3 < r3; n3++) {
        let t3 = e17[n3];
        if (t3.id === null) break;
        t3.id = null, t3.object = null, t3.geometry = null, t3.material = null, t3.group = null;
      }
    }
    return { opaque: n2, transmissive: r2, transparent: i2, init: a2, push: s2, unshift: c2, finish: u2, sort: l2 };
  }
  function Ns() {
    let e17 = /* @__PURE__ */ new WeakMap();
    function t2(t3, n3) {
      let r2 = e17.get(t3), i2;
      return r2 === void 0 ? (i2 = new Ms(), e17.set(t3, [i2])) : n3 >= r2.length ? (i2 = new Ms(), r2.push(i2)) : i2 = r2[n3], i2;
    }
    function n2() {
      e17 = /* @__PURE__ */ new WeakMap();
    }
    return { get: t2, dispose: n2 };
  }
  function Ps() {
    let e17 = {};
    return { get: function(t2) {
      if (e17[t2.id] !== void 0) return e17[t2.id];
      let n2;
      switch (t2.type) {
        case `DirectionalLight`:
          n2 = { direction: new W(), color: new q() };
          break;
        case `SpotLight`:
          n2 = { position: new W(), direction: new W(), color: new q(), distance: 0, coneCos: 0, penumbraCos: 0, decay: 0 };
          break;
        case `PointLight`:
          n2 = { position: new W(), color: new q(), distance: 0, decay: 0 };
          break;
        case `HemisphereLight`:
          n2 = { direction: new W(), skyColor: new q(), groundColor: new q() };
          break;
        case `RectAreaLight`:
          n2 = { color: new q(), position: new W(), halfWidth: new W(), halfHeight: new W() };
          break;
      }
      return e17[t2.id] = n2, n2;
    } };
  }
  function Fs() {
    let e17 = {};
    return { get: function(t2) {
      if (e17[t2.id] !== void 0) return e17[t2.id];
      let n2;
      switch (t2.type) {
        case `DirectionalLight`:
          n2 = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new U() };
          break;
        case `SpotLight`:
          n2 = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new U() };
          break;
        case `PointLight`:
          n2 = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new U(), shadowCameraNear: 1, shadowCameraFar: 1e3 };
          break;
      }
      return e17[t2.id] = n2, n2;
    } };
  }
  var Is = 0;
  function Ls(e17, t2) {
    return (t2.castShadow ? 2 : 0) - (e17.castShadow ? 2 : 0) + +!!t2.map - !!e17.map;
  }
  function Rs(e17) {
    let t2 = new Ps(), n2 = Fs(), r2 = { version: 0, hash: { directionalLength: -1, pointLength: -1, spotLength: -1, rectAreaLength: -1, hemiLength: -1, numDirectionalShadows: -1, numPointShadows: -1, numSpotShadows: -1, numSpotMaps: -1, numLightProbes: -1 }, ambient: [0, 0, 0], probe: [], directional: [], directionalShadow: [], directionalShadowMap: [], directionalShadowMatrix: [], spot: [], spotLightMap: [], spotShadow: [], spotShadowMap: [], spotLightMatrix: [], rectArea: [], rectAreaLTC1: null, rectAreaLTC2: null, point: [], pointShadow: [], pointShadowMap: [], pointShadowMatrix: [], hemi: [], numSpotLightShadowsWithMaps: 0, numLightProbes: 0 };
    for (let e18 = 0; e18 < 9; e18++) r2.probe.push(new W());
    let i2 = new W(), a2 = new nn(), o2 = new nn();
    function s2(i3) {
      let a3 = 0, o3 = 0, s3 = 0;
      for (let e18 = 0; e18 < 9; e18++) r2.probe[e18].set(0, 0, 0);
      let c3 = 0, l2 = 0, u2 = 0, d2 = 0, f2 = 0, p2 = 0, m2 = 0, h2 = 0, g2 = 0, _2 = 0, v2 = 0;
      i3.sort(Ls);
      for (let e18 = 0, y3 = i3.length; e18 < y3; e18++) {
        let y4 = i3[e18], b2 = y4.color, x2 = y4.intensity, S2 = y4.distance, C2 = y4.shadow && y4.shadow.map ? y4.shadow.map.texture : null;
        if (y4.isAmbientLight) a3 += b2.r * x2, o3 += b2.g * x2, s3 += b2.b * x2;
        else if (y4.isLightProbe) {
          for (let e19 = 0; e19 < 9; e19++) r2.probe[e19].addScaledVector(y4.sh.coefficients[e19], x2);
          v2++;
        } else if (y4.isDirectionalLight) {
          let e19 = t2.get(y4);
          if (e19.color.copy(y4.color).multiplyScalar(y4.intensity), y4.castShadow) {
            let e20 = y4.shadow, t3 = n2.get(y4);
            t3.shadowIntensity = e20.intensity, t3.shadowBias = e20.bias, t3.shadowNormalBias = e20.normalBias, t3.shadowRadius = e20.radius, t3.shadowMapSize = e20.mapSize, r2.directionalShadow[c3] = t3, r2.directionalShadowMap[c3] = C2, r2.directionalShadowMatrix[c3] = y4.shadow.matrix, p2++;
          }
          r2.directional[c3] = e19, c3++;
        } else if (y4.isSpotLight) {
          let e19 = t2.get(y4);
          e19.position.setFromMatrixPosition(y4.matrixWorld), e19.color.copy(b2).multiplyScalar(x2), e19.distance = S2, e19.coneCos = Math.cos(y4.angle), e19.penumbraCos = Math.cos(y4.angle * (1 - y4.penumbra)), e19.decay = y4.decay, r2.spot[u2] = e19;
          let i4 = y4.shadow;
          if (y4.map && (r2.spotLightMap[g2] = y4.map, g2++, i4.updateMatrices(y4), y4.castShadow && _2++), r2.spotLightMatrix[u2] = i4.matrix, y4.castShadow) {
            let e20 = n2.get(y4);
            e20.shadowIntensity = i4.intensity, e20.shadowBias = i4.bias, e20.shadowNormalBias = i4.normalBias, e20.shadowRadius = i4.radius, e20.shadowMapSize = i4.mapSize, r2.spotShadow[u2] = e20, r2.spotShadowMap[u2] = C2, h2++;
          }
          u2++;
        } else if (y4.isRectAreaLight) {
          let e19 = t2.get(y4);
          e19.color.copy(b2).multiplyScalar(x2), e19.halfWidth.set(y4.width * 0.5, 0, 0), e19.halfHeight.set(0, y4.height * 0.5, 0), r2.rectArea[d2] = e19, d2++;
        } else if (y4.isPointLight) {
          let e19 = t2.get(y4);
          if (e19.color.copy(y4.color).multiplyScalar(y4.intensity), e19.distance = y4.distance, e19.decay = y4.decay, y4.castShadow) {
            let e20 = y4.shadow, t3 = n2.get(y4);
            t3.shadowIntensity = e20.intensity, t3.shadowBias = e20.bias, t3.shadowNormalBias = e20.normalBias, t3.shadowRadius = e20.radius, t3.shadowMapSize = e20.mapSize, t3.shadowCameraNear = e20.camera.near, t3.shadowCameraFar = e20.camera.far, r2.pointShadow[l2] = t3, r2.pointShadowMap[l2] = C2, r2.pointShadowMatrix[l2] = y4.shadow.matrix, m2++;
          }
          r2.point[l2] = e19, l2++;
        } else if (y4.isHemisphereLight) {
          let e19 = t2.get(y4);
          e19.skyColor.copy(y4.color).multiplyScalar(x2), e19.groundColor.copy(y4.groundColor).multiplyScalar(x2), r2.hemi[f2] = e19, f2++;
        }
      }
      d2 > 0 && (e17.has(`OES_texture_float_linear`) === true ? (r2.rectAreaLTC1 = X.LTC_FLOAT_1, r2.rectAreaLTC2 = X.LTC_FLOAT_2) : (r2.rectAreaLTC1 = X.LTC_HALF_1, r2.rectAreaLTC2 = X.LTC_HALF_2)), r2.ambient[0] = a3, r2.ambient[1] = o3, r2.ambient[2] = s3;
      let y2 = r2.hash;
      (y2.directionalLength !== c3 || y2.pointLength !== l2 || y2.spotLength !== u2 || y2.rectAreaLength !== d2 || y2.hemiLength !== f2 || y2.numDirectionalShadows !== p2 || y2.numPointShadows !== m2 || y2.numSpotShadows !== h2 || y2.numSpotMaps !== g2 || y2.numLightProbes !== v2) && (r2.directional.length = c3, r2.spot.length = u2, r2.rectArea.length = d2, r2.point.length = l2, r2.hemi.length = f2, r2.directionalShadow.length = p2, r2.directionalShadowMap.length = p2, r2.pointShadow.length = m2, r2.pointShadowMap.length = m2, r2.spotShadow.length = h2, r2.spotShadowMap.length = h2, r2.directionalShadowMatrix.length = p2, r2.pointShadowMatrix.length = m2, r2.spotLightMatrix.length = h2 + g2 - _2, r2.spotLightMap.length = g2, r2.numSpotLightShadowsWithMaps = _2, r2.numLightProbes = v2, y2.directionalLength = c3, y2.pointLength = l2, y2.spotLength = u2, y2.rectAreaLength = d2, y2.hemiLength = f2, y2.numDirectionalShadows = p2, y2.numPointShadows = m2, y2.numSpotShadows = h2, y2.numSpotMaps = g2, y2.numLightProbes = v2, r2.version = Is++);
    }
    function c2(e18, t3) {
      let n3 = 0, s3 = 0, c3 = 0, l2 = 0, u2 = 0, d2 = t3.matrixWorldInverse;
      for (let t4 = 0, f2 = e18.length; t4 < f2; t4++) {
        let f3 = e18[t4];
        if (f3.isDirectionalLight) {
          let e19 = r2.directional[n3];
          e19.direction.setFromMatrixPosition(f3.matrixWorld), i2.setFromMatrixPosition(f3.target.matrixWorld), e19.direction.sub(i2), e19.direction.transformDirection(d2), n3++;
        } else if (f3.isSpotLight) {
          let e19 = r2.spot[c3];
          e19.position.setFromMatrixPosition(f3.matrixWorld), e19.position.applyMatrix4(d2), e19.direction.setFromMatrixPosition(f3.matrixWorld), i2.setFromMatrixPosition(f3.target.matrixWorld), e19.direction.sub(i2), e19.direction.transformDirection(d2), c3++;
        } else if (f3.isRectAreaLight) {
          let e19 = r2.rectArea[l2];
          e19.position.setFromMatrixPosition(f3.matrixWorld), e19.position.applyMatrix4(d2), o2.identity(), a2.copy(f3.matrixWorld), a2.premultiply(d2), o2.extractRotation(a2), e19.halfWidth.set(f3.width * 0.5, 0, 0), e19.halfHeight.set(0, f3.height * 0.5, 0), e19.halfWidth.applyMatrix4(o2), e19.halfHeight.applyMatrix4(o2), l2++;
        } else if (f3.isPointLight) {
          let e19 = r2.point[s3];
          e19.position.setFromMatrixPosition(f3.matrixWorld), e19.position.applyMatrix4(d2), s3++;
        } else if (f3.isHemisphereLight) {
          let e19 = r2.hemi[u2];
          e19.direction.setFromMatrixPosition(f3.matrixWorld), e19.direction.transformDirection(d2), u2++;
        }
      }
    }
    return { setup: s2, setupView: c2, state: r2 };
  }
  function zs(e17) {
    let t2 = new Rs(e17), n2 = [], r2 = [];
    function i2(e18) {
      l2.camera = e18, n2.length = 0, r2.length = 0;
    }
    function a2(e18) {
      n2.push(e18);
    }
    function o2(e18) {
      r2.push(e18);
    }
    function s2() {
      t2.setup(n2);
    }
    function c2(e18) {
      t2.setupView(n2, e18);
    }
    let l2 = { lightsArray: n2, shadowsArray: r2, camera: null, lights: t2, transmissionRenderTarget: {} };
    return { init: i2, state: l2, setupLights: s2, setupLightsView: c2, pushLight: a2, pushShadow: o2 };
  }
  function Bs(e17) {
    let t2 = /* @__PURE__ */ new WeakMap();
    function n2(n3, r3 = 0) {
      let i2 = t2.get(n3), a2;
      return i2 === void 0 ? (a2 = new zs(e17), t2.set(n3, [a2])) : r3 >= i2.length ? (a2 = new zs(e17), i2.push(a2)) : a2 = i2[r3], a2;
    }
    function r2() {
      t2 = /* @__PURE__ */ new WeakMap();
    }
    return { get: n2, dispose: r2 };
  }
  var Vs = `void main() {
	gl_Position = vec4( position, 1.0 );
}`;
  var Hs = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
  function Us(e17, t2, n2) {
    let r2 = new ai(), i2 = new U(), a2 = new U(), o2 = new wt(), s2 = new gi({ depthPacking: Re }), c2 = new _i(), l2 = {}, u2 = n2.maxTextureSize, d2 = { 0: 1, 1: 0, 2: 2 }, p2 = new Ir({ defines: { VSM_SAMPLES: 8 }, uniforms: { shadow_pass: { value: null }, resolution: { value: new U() }, radius: { value: 4 } }, vertexShader: Vs, fragmentShader: Hs }), m2 = p2.clone();
    m2.defines.HORIZONTAL_PASS = 1;
    let h2 = new pr();
    h2.setAttribute(`position`, new nr(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
    let g2 = new Tr(h2, p2), _2 = this;
    this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = 1;
    let v2 = this.type;
    this.render = function(t3, n3, s3) {
      if (_2.enabled === false || _2.autoUpdate === false && _2.needsUpdate === false || t3.length === 0) return;
      let c3 = e17.getRenderTarget(), l3 = e17.getActiveCubeFace(), d3 = e17.getActiveMipmapLevel(), p3 = e17.state;
      p3.setBlending(0), p3.buffers.depth.getReversed() === true ? p3.buffers.color.setClear(0, 0, 0, 0) : p3.buffers.color.setClear(1, 1, 1, 1), p3.buffers.depth.setTest(true), p3.setScissorTest(false);
      let m3 = v2 !== 3 && this.type === 3, h3 = v2 === 3 && this.type !== 3;
      for (let c4 = 0, l4 = t3.length; c4 < l4; c4++) {
        let l5 = t3[c4], d4 = l5.shadow;
        if (d4 === void 0) {
          console.warn(`THREE.WebGLShadowMap:`, l5, `has no shadow.`);
          continue;
        }
        if (d4.autoUpdate === false && d4.needsUpdate === false) continue;
        i2.copy(d4.mapSize);
        let g3 = d4.getFrameExtents();
        if (i2.multiply(g3), a2.copy(d4.mapSize), (i2.x > u2 || i2.y > u2) && (i2.x > u2 && (a2.x = Math.floor(u2 / g3.x), i2.x = a2.x * g3.x, d4.mapSize.x = a2.x), i2.y > u2 && (a2.y = Math.floor(u2 / g3.y), i2.y = a2.y * g3.y, d4.mapSize.y = a2.y)), d4.map === null || m3 === true || h3 === true) {
          let e18 = this.type === 3 ? {} : { minFilter: f, magFilter: f };
          d4.map !== null && d4.map.dispose(), d4.map = new Et(i2.x, i2.y, e18), d4.map.texture.name = l5.name + `.shadowMap`, d4.camera.updateProjectionMatrix();
        }
        e17.setRenderTarget(d4.map), e17.clear();
        let _3 = d4.getViewportCount();
        for (let e18 = 0; e18 < _3; e18++) {
          let t4 = d4.getViewport(e18);
          o2.set(a2.x * t4.x, a2.y * t4.y, a2.x * t4.z, a2.y * t4.w), p3.viewport(o2), d4.updateMatrices(l5, e18), r2 = d4.getFrustum(), x2(n3, s3, d4.camera, l5, this.type);
        }
        d4.isPointLightShadow !== true && this.type === 3 && y2(d4, s3), d4.needsUpdate = false;
      }
      v2 = this.type, _2.needsUpdate = false, e17.setRenderTarget(c3, l3, d3);
    };
    function y2(n3, r3) {
      let a3 = t2.update(g2);
      p2.defines.VSM_SAMPLES !== n3.blurSamples && (p2.defines.VSM_SAMPLES = n3.blurSamples, m2.defines.VSM_SAMPLES = n3.blurSamples, p2.needsUpdate = true, m2.needsUpdate = true), n3.mapPass === null && (n3.mapPass = new Et(i2.x, i2.y)), p2.uniforms.shadow_pass.value = n3.map.texture, p2.uniforms.resolution.value = n3.mapSize, p2.uniforms.radius.value = n3.radius, e17.setRenderTarget(n3.mapPass), e17.clear(), e17.renderBufferDirect(r3, null, a3, p2, g2, null), m2.uniforms.shadow_pass.value = n3.mapPass.texture, m2.uniforms.resolution.value = n3.mapSize, m2.uniforms.radius.value = n3.radius, e17.setRenderTarget(n3.map), e17.clear(), e17.renderBufferDirect(r3, null, a3, m2, g2, null);
    }
    function b2(t3, n3, r3, i3) {
      let a3 = null, o3 = r3.isPointLight === true ? t3.customDistanceMaterial : t3.customDepthMaterial;
      if (o3 !== void 0) a3 = o3;
      else if (a3 = r3.isPointLight === true ? c2 : s2, e17.localClippingEnabled && n3.clipShadows === true && Array.isArray(n3.clippingPlanes) && n3.clippingPlanes.length !== 0 || n3.displacementMap && n3.displacementScale !== 0 || n3.alphaMap && n3.alphaTest > 0 || n3.map && n3.alphaTest > 0 || n3.alphaToCoverage === true) {
        let e18 = a3.uuid, t4 = n3.uuid, r4 = l2[e18];
        r4 === void 0 && (r4 = {}, l2[e18] = r4);
        let i4 = r4[t4];
        i4 === void 0 && (i4 = a3.clone(), r4[t4] = i4, n3.addEventListener(`dispose`, S2)), a3 = i4;
      }
      if (a3.visible = n3.visible, a3.wireframe = n3.wireframe, i3 === 3 ? a3.side = n3.shadowSide === null ? n3.side : n3.shadowSide : a3.side = n3.shadowSide === null ? d2[n3.side] : n3.shadowSide, a3.alphaMap = n3.alphaMap, a3.alphaTest = n3.alphaToCoverage === true ? 0.5 : n3.alphaTest, a3.map = n3.map, a3.clipShadows = n3.clipShadows, a3.clippingPlanes = n3.clippingPlanes, a3.clipIntersection = n3.clipIntersection, a3.displacementMap = n3.displacementMap, a3.displacementScale = n3.displacementScale, a3.displacementBias = n3.displacementBias, a3.wireframeLinewidth = n3.wireframeLinewidth, a3.linewidth = n3.linewidth, r3.isPointLight === true && a3.isMeshDistanceMaterial === true) {
        let t4 = e17.properties.get(a3);
        t4.light = r3;
      }
      return a3;
    }
    function x2(n3, i3, a3, o3, s3) {
      if (n3.visible === false) return;
      if (n3.layers.test(i3.layers) && (n3.isMesh || n3.isLine || n3.isPoints) && (n3.castShadow || n3.receiveShadow && s3 === 3) && (!n3.frustumCulled || r2.intersectsObject(n3))) {
        n3.modelViewMatrix.multiplyMatrices(a3.matrixWorldInverse, n3.matrixWorld);
        let r3 = t2.update(n3), c4 = n3.material;
        if (Array.isArray(c4)) {
          let t3 = r3.groups;
          for (let l3 = 0, u3 = t3.length; l3 < u3; l3++) {
            let u4 = t3[l3], d3 = c4[u4.materialIndex];
            if (d3 && d3.visible) {
              let t4 = b2(n3, d3, o3, s3);
              n3.onBeforeShadow(e17, n3, i3, a3, r3, t4, u4), e17.renderBufferDirect(a3, null, r3, t4, n3, u4), n3.onAfterShadow(e17, n3, i3, a3, r3, t4, u4);
            }
          }
        } else if (c4.visible) {
          let t3 = b2(n3, c4, o3, s3);
          n3.onBeforeShadow(e17, n3, i3, a3, r3, t3, null), e17.renderBufferDirect(a3, null, r3, t3, n3, null), n3.onAfterShadow(e17, n3, i3, a3, r3, t3, null);
        }
      }
      let c3 = n3.children;
      for (let e18 = 0, t3 = c3.length; e18 < t3; e18++) x2(c3[e18], i3, a3, o3, s3);
    }
    function S2(e18) {
      e18.target.removeEventListener(`dispose`, S2);
      for (let t3 in l2) {
        let n3 = l2[t3], r3 = e18.target.uuid;
        r3 in n3 && (n3[r3].dispose(), delete n3[r3]);
      }
    }
  }
  var Ws = { 0: 1, 2: 6, 4: 7, 3: 5, 1: 0, 6: 2, 7: 4, 5: 3 };
  function Gs(e17, t2) {
    function n2() {
      let t3 = false, n3 = new wt(), r3 = null, i3 = new wt(0, 0, 0, 0);
      return { setMask: function(n4) {
        r3 !== n4 && !t3 && (e17.colorMask(n4, n4, n4, n4), r3 = n4);
      }, setLocked: function(e18) {
        t3 = e18;
      }, setClear: function(t4, r4, a3, o3, s3) {
        s3 === true && (t4 *= o3, r4 *= o3, a3 *= o3), n3.set(t4, r4, a3, o3), i3.equals(n3) === false && (e17.clearColor(t4, r4, a3, o3), i3.copy(n3));
      }, reset: function() {
        t3 = false, r3 = null, i3.set(-1, 0, 0, 0);
      } };
    }
    function r2() {
      let n3 = false, r3 = false, i3 = null, a3 = null, o3 = null;
      return { setReversed: function(e18) {
        if (r3 !== e18) {
          let n4 = t2.get(`EXT_clip_control`);
          e18 ? n4.clipControlEXT(n4.LOWER_LEFT_EXT, n4.ZERO_TO_ONE_EXT) : n4.clipControlEXT(n4.LOWER_LEFT_EXT, n4.NEGATIVE_ONE_TO_ONE_EXT), r3 = e18;
          let i4 = o3;
          o3 = null, this.setClear(i4);
        }
      }, getReversed: function() {
        return r3;
      }, setTest: function(t3) {
        t3 ? F2(e17.DEPTH_TEST) : ce2(e17.DEPTH_TEST);
      }, setMask: function(t3) {
        i3 !== t3 && !n3 && (e17.depthMask(t3), i3 = t3);
      }, setFunc: function(t3) {
        if (r3 && (t3 = Ws[t3]), a3 !== t3) {
          switch (t3) {
            case 0:
              e17.depthFunc(e17.NEVER);
              break;
            case 1:
              e17.depthFunc(e17.ALWAYS);
              break;
            case 2:
              e17.depthFunc(e17.LESS);
              break;
            case 3:
              e17.depthFunc(e17.LEQUAL);
              break;
            case 4:
              e17.depthFunc(e17.EQUAL);
              break;
            case 5:
              e17.depthFunc(e17.GEQUAL);
              break;
            case 6:
              e17.depthFunc(e17.GREATER);
              break;
            case 7:
              e17.depthFunc(e17.NOTEQUAL);
              break;
            default:
              e17.depthFunc(e17.LEQUAL);
          }
          a3 = t3;
        }
      }, setLocked: function(e18) {
        n3 = e18;
      }, setClear: function(t3) {
        o3 !== t3 && (r3 && (t3 = 1 - t3), e17.clearDepth(t3), o3 = t3);
      }, reset: function() {
        n3 = false, i3 = null, a3 = null, o3 = null, r3 = false;
      } };
    }
    function i2() {
      let t3 = false, n3 = null, r3 = null, i3 = null, a3 = null, o3 = null, s3 = null, c3 = null, l3 = null;
      return { setTest: function(n4) {
        t3 || (n4 ? F2(e17.STENCIL_TEST) : ce2(e17.STENCIL_TEST));
      }, setMask: function(r4) {
        n3 !== r4 && !t3 && (e17.stencilMask(r4), n3 = r4);
      }, setFunc: function(t4, n4, o4) {
        (r3 !== t4 || i3 !== n4 || a3 !== o4) && (e17.stencilFunc(t4, n4, o4), r3 = t4, i3 = n4, a3 = o4);
      }, setOp: function(t4, n4, r4) {
        (o3 !== t4 || s3 !== n4 || c3 !== r4) && (e17.stencilOp(t4, n4, r4), o3 = t4, s3 = n4, c3 = r4);
      }, setLocked: function(e18) {
        t3 = e18;
      }, setClear: function(t4) {
        l3 !== t4 && (e17.clearStencil(t4), l3 = t4);
      }, reset: function() {
        t3 = false, n3 = null, r3 = null, i3 = null, a3 = null, o3 = null, s3 = null, c3 = null, l3 = null;
      } };
    }
    let a2 = new n2(), o2 = new r2(), s2 = new i2(), c2 = /* @__PURE__ */ new WeakMap(), l2 = /* @__PURE__ */ new WeakMap(), u2 = {}, d2 = {}, f2 = /* @__PURE__ */ new WeakMap(), p2 = [], m2 = null, h2 = false, g2 = null, _2 = null, v2 = null, y2 = null, b2 = null, x2 = null, S2 = null, C2 = new q(0, 0, 0), w2 = 0, T2 = false, E2 = null, D2 = null, O2 = null, k2 = null, A3 = null, j3 = e17.getParameter(e17.MAX_COMBINED_TEXTURE_IMAGE_UNITS), ee2 = false, te2 = 0, M3 = e17.getParameter(e17.VERSION);
    M3.indexOf(`WebGL`) === -1 ? M3.indexOf(`OpenGL ES`) !== -1 && (te2 = parseFloat(/^OpenGL ES (\d)/.exec(M3)[1]), ee2 = te2 >= 2) : (te2 = parseFloat(/^WebGL (\d)/.exec(M3)[1]), ee2 = te2 >= 1);
    let N3 = null, P2 = {}, ne2 = e17.getParameter(e17.SCISSOR_BOX), re2 = e17.getParameter(e17.VIEWPORT), ie2 = new wt().fromArray(ne2), ae2 = new wt().fromArray(re2);
    function oe2(t3, n3, r3, i3) {
      let a3 = new Uint8Array(4), o3 = e17.createTexture();
      e17.bindTexture(t3, o3), e17.texParameteri(t3, e17.TEXTURE_MIN_FILTER, e17.NEAREST), e17.texParameteri(t3, e17.TEXTURE_MAG_FILTER, e17.NEAREST);
      for (let o4 = 0; o4 < r3; o4++) t3 === e17.TEXTURE_3D || t3 === e17.TEXTURE_2D_ARRAY ? e17.texImage3D(n3, 0, e17.RGBA, 1, 1, i3, 0, e17.RGBA, e17.UNSIGNED_BYTE, a3) : e17.texImage2D(n3 + o4, 0, e17.RGBA, 1, 1, 0, e17.RGBA, e17.UNSIGNED_BYTE, a3);
      return o3;
    }
    let se2 = {};
    se2[e17.TEXTURE_2D] = oe2(e17.TEXTURE_2D, e17.TEXTURE_2D, 1), se2[e17.TEXTURE_CUBE_MAP] = oe2(e17.TEXTURE_CUBE_MAP, e17.TEXTURE_CUBE_MAP_POSITIVE_X, 6), se2[e17.TEXTURE_2D_ARRAY] = oe2(e17.TEXTURE_2D_ARRAY, e17.TEXTURE_2D_ARRAY, 1, 1), se2[e17.TEXTURE_3D] = oe2(e17.TEXTURE_3D, e17.TEXTURE_3D, 1, 1), a2.setClear(0, 0, 0, 1), o2.setClear(1), s2.setClear(0), F2(e17.DEPTH_TEST), o2.setFunc(3), he2(false), L2(1), F2(e17.CULL_FACE), me2(0);
    function F2(t3) {
      u2[t3] !== true && (e17.enable(t3), u2[t3] = true);
    }
    function ce2(t3) {
      u2[t3] !== false && (e17.disable(t3), u2[t3] = false);
    }
    function le2(t3, n3) {
      return d2[t3] === n3 ? false : (e17.bindFramebuffer(t3, n3), d2[t3] = n3, t3 === e17.DRAW_FRAMEBUFFER && (d2[e17.FRAMEBUFFER] = n3), t3 === e17.FRAMEBUFFER && (d2[e17.DRAW_FRAMEBUFFER] = n3), true);
    }
    function ue2(t3, n3) {
      let r3 = p2, i3 = false;
      if (t3) {
        r3 = f2.get(n3), r3 === void 0 && (r3 = [], f2.set(n3, r3));
        let a3 = t3.textures;
        if (r3.length !== a3.length || r3[0] !== e17.COLOR_ATTACHMENT0) {
          for (let t4 = 0, n4 = a3.length; t4 < n4; t4++) r3[t4] = e17.COLOR_ATTACHMENT0 + t4;
          r3.length = a3.length, i3 = true;
        }
      } else r3[0] !== e17.BACK && (r3[0] = e17.BACK, i3 = true);
      i3 && e17.drawBuffers(r3);
    }
    function de2(t3) {
      return m2 === t3 ? false : (e17.useProgram(t3), m2 = t3, true);
    }
    let fe2 = { 100: e17.FUNC_ADD, 101: e17.FUNC_SUBTRACT, 102: e17.FUNC_REVERSE_SUBTRACT };
    fe2[103] = e17.MIN, fe2[104] = e17.MAX;
    let pe2 = { 200: e17.ZERO, 201: e17.ONE, 202: e17.SRC_COLOR, 204: e17.SRC_ALPHA, 210: e17.SRC_ALPHA_SATURATE, 208: e17.DST_COLOR, 206: e17.DST_ALPHA, 203: e17.ONE_MINUS_SRC_COLOR, 205: e17.ONE_MINUS_SRC_ALPHA, 209: e17.ONE_MINUS_DST_COLOR, 207: e17.ONE_MINUS_DST_ALPHA, 211: e17.CONSTANT_COLOR, 212: e17.ONE_MINUS_CONSTANT_COLOR, 213: e17.CONSTANT_ALPHA, 214: e17.ONE_MINUS_CONSTANT_ALPHA };
    function me2(t3, n3, r3, i3, a3, o3, s3, c3, l3, u3) {
      if (t3 === 0) {
        h2 === true && (ce2(e17.BLEND), h2 = false);
        return;
      }
      if (h2 === false && (F2(e17.BLEND), h2 = true), t3 !== 5) {
        if (t3 !== g2 || u3 !== T2) {
          if ((_2 !== 100 || b2 !== 100) && (e17.blendEquation(e17.FUNC_ADD), _2 = 100, b2 = 100), u3) switch (t3) {
            case 1:
              e17.blendFuncSeparate(e17.ONE, e17.ONE_MINUS_SRC_ALPHA, e17.ONE, e17.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              e17.blendFunc(e17.ONE, e17.ONE);
              break;
            case 3:
              e17.blendFuncSeparate(e17.ZERO, e17.ONE_MINUS_SRC_COLOR, e17.ZERO, e17.ONE);
              break;
            case 4:
              e17.blendFuncSeparate(e17.DST_COLOR, e17.ONE_MINUS_SRC_ALPHA, e17.ZERO, e17.ONE);
              break;
            default:
              console.error(`THREE.WebGLState: Invalid blending: `, t3);
              break;
          }
          else switch (t3) {
            case 1:
              e17.blendFuncSeparate(e17.SRC_ALPHA, e17.ONE_MINUS_SRC_ALPHA, e17.ONE, e17.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              e17.blendFuncSeparate(e17.SRC_ALPHA, e17.ONE, e17.ONE, e17.ONE);
              break;
            case 3:
              console.error(`THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);
              break;
            case 4:
              console.error(`THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);
              break;
            default:
              console.error(`THREE.WebGLState: Invalid blending: `, t3);
              break;
          }
          v2 = null, y2 = null, x2 = null, S2 = null, C2.set(0, 0, 0), w2 = 0, g2 = t3, T2 = u3;
        }
        return;
      }
      a3 || (a3 = n3), o3 || (o3 = r3), s3 || (s3 = i3), (n3 !== _2 || a3 !== b2) && (e17.blendEquationSeparate(fe2[n3], fe2[a3]), _2 = n3, b2 = a3), (r3 !== v2 || i3 !== y2 || o3 !== x2 || s3 !== S2) && (e17.blendFuncSeparate(pe2[r3], pe2[i3], pe2[o3], pe2[s3]), v2 = r3, y2 = i3, x2 = o3, S2 = s3), (c3.equals(C2) === false || l3 !== w2) && (e17.blendColor(c3.r, c3.g, c3.b, l3), C2.copy(c3), w2 = l3), g2 = t3, T2 = false;
    }
    function I2(t3, n3) {
      t3.side === 2 ? ce2(e17.CULL_FACE) : F2(e17.CULL_FACE);
      let r3 = t3.side === 1;
      n3 && (r3 = !r3), he2(r3), t3.blending === 1 && t3.transparent === false ? me2(0) : me2(t3.blending, t3.blendEquation, t3.blendSrc, t3.blendDst, t3.blendEquationAlpha, t3.blendSrcAlpha, t3.blendDstAlpha, t3.blendColor, t3.blendAlpha, t3.premultipliedAlpha), o2.setFunc(t3.depthFunc), o2.setTest(t3.depthTest), o2.setMask(t3.depthWrite), a2.setMask(t3.colorWrite);
      let i3 = t3.stencilWrite;
      s2.setTest(i3), i3 && (s2.setMask(t3.stencilWriteMask), s2.setFunc(t3.stencilFunc, t3.stencilRef, t3.stencilFuncMask), s2.setOp(t3.stencilFail, t3.stencilZFail, t3.stencilZPass)), z2(t3.polygonOffset, t3.polygonOffsetFactor, t3.polygonOffsetUnits), t3.alphaToCoverage === true ? F2(e17.SAMPLE_ALPHA_TO_COVERAGE) : ce2(e17.SAMPLE_ALPHA_TO_COVERAGE);
    }
    function he2(t3) {
      E2 !== t3 && (t3 ? e17.frontFace(e17.CW) : e17.frontFace(e17.CCW), E2 = t3);
    }
    function L2(t3) {
      t3 === 0 ? ce2(e17.CULL_FACE) : (F2(e17.CULL_FACE), t3 !== D2 && (t3 === 1 ? e17.cullFace(e17.BACK) : t3 === 2 ? e17.cullFace(e17.FRONT) : e17.cullFace(e17.FRONT_AND_BACK))), D2 = t3;
    }
    function R2(t3) {
      t3 !== O2 && (ee2 && e17.lineWidth(t3), O2 = t3);
    }
    function z2(t3, n3, r3) {
      t3 ? (F2(e17.POLYGON_OFFSET_FILL), (k2 !== n3 || A3 !== r3) && (e17.polygonOffset(n3, r3), k2 = n3, A3 = r3)) : ce2(e17.POLYGON_OFFSET_FILL);
    }
    function ge2(t3) {
      t3 ? F2(e17.SCISSOR_TEST) : ce2(e17.SCISSOR_TEST);
    }
    function B2(t3) {
      t3 === void 0 && (t3 = e17.TEXTURE0 + j3 - 1), N3 !== t3 && (e17.activeTexture(t3), N3 = t3);
    }
    function V2(t3, n3, r3) {
      r3 === void 0 && (r3 = N3 === null ? e17.TEXTURE0 + j3 - 1 : N3);
      let i3 = P2[r3];
      i3 === void 0 && (i3 = { type: void 0, texture: void 0 }, P2[r3] = i3), (i3.type !== t3 || i3.texture !== n3) && (N3 !== r3 && (e17.activeTexture(r3), N3 = r3), e17.bindTexture(t3, n3 || se2[t3]), i3.type = t3, i3.texture = n3);
    }
    function _e2() {
      let t3 = P2[N3];
      t3 !== void 0 && t3.type !== void 0 && (e17.bindTexture(t3.type, null), t3.type = void 0, t3.texture = void 0);
    }
    function ve2() {
      try {
        e17.compressedTexImage2D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function ye2() {
      try {
        e17.compressedTexImage3D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function be2() {
      try {
        e17.texSubImage2D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function xe2() {
      try {
        e17.texSubImage3D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function Se2() {
      try {
        e17.compressedTexSubImage2D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function Ce2() {
      try {
        e17.compressedTexSubImage3D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function we2() {
      try {
        e17.texStorage2D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function Te2() {
      try {
        e17.texStorage3D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function Ee2() {
      try {
        e17.texImage2D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function De2() {
      try {
        e17.texImage3D(...arguments);
      } catch (e18) {
        console.error(`THREE.WebGLState:`, e18);
      }
    }
    function Oe2(t3) {
      ie2.equals(t3) === false && (e17.scissor(t3.x, t3.y, t3.z, t3.w), ie2.copy(t3));
    }
    function ke2(t3) {
      ae2.equals(t3) === false && (e17.viewport(t3.x, t3.y, t3.z, t3.w), ae2.copy(t3));
    }
    function Ae2(t3, n3) {
      let r3 = l2.get(n3);
      r3 === void 0 && (r3 = /* @__PURE__ */ new WeakMap(), l2.set(n3, r3));
      let i3 = r3.get(t3);
      i3 === void 0 && (i3 = e17.getUniformBlockIndex(n3, t3.name), r3.set(t3, i3));
    }
    function je2(t3, n3) {
      let r3 = l2.get(n3).get(t3);
      c2.get(n3) !== r3 && (e17.uniformBlockBinding(n3, r3, t3.__bindingPointIndex), c2.set(n3, r3));
    }
    function Me2() {
      e17.disable(e17.BLEND), e17.disable(e17.CULL_FACE), e17.disable(e17.DEPTH_TEST), e17.disable(e17.POLYGON_OFFSET_FILL), e17.disable(e17.SCISSOR_TEST), e17.disable(e17.STENCIL_TEST), e17.disable(e17.SAMPLE_ALPHA_TO_COVERAGE), e17.blendEquation(e17.FUNC_ADD), e17.blendFunc(e17.ONE, e17.ZERO), e17.blendFuncSeparate(e17.ONE, e17.ZERO, e17.ONE, e17.ZERO), e17.blendColor(0, 0, 0, 0), e17.colorMask(true, true, true, true), e17.clearColor(0, 0, 0, 0), e17.depthMask(true), e17.depthFunc(e17.LESS), o2.setReversed(false), e17.clearDepth(1), e17.stencilMask(4294967295), e17.stencilFunc(e17.ALWAYS, 0, 4294967295), e17.stencilOp(e17.KEEP, e17.KEEP, e17.KEEP), e17.clearStencil(0), e17.cullFace(e17.BACK), e17.frontFace(e17.CCW), e17.polygonOffset(0, 0), e17.activeTexture(e17.TEXTURE0), e17.bindFramebuffer(e17.FRAMEBUFFER, null), e17.bindFramebuffer(e17.DRAW_FRAMEBUFFER, null), e17.bindFramebuffer(e17.READ_FRAMEBUFFER, null), e17.useProgram(null), e17.lineWidth(1), e17.scissor(0, 0, e17.canvas.width, e17.canvas.height), e17.viewport(0, 0, e17.canvas.width, e17.canvas.height), u2 = {}, N3 = null, P2 = {}, d2 = {}, f2 = /* @__PURE__ */ new WeakMap(), p2 = [], m2 = null, h2 = false, g2 = null, _2 = null, v2 = null, y2 = null, b2 = null, x2 = null, S2 = null, C2 = new q(0, 0, 0), w2 = 0, T2 = false, E2 = null, D2 = null, O2 = null, k2 = null, A3 = null, ie2.set(0, 0, e17.canvas.width, e17.canvas.height), ae2.set(0, 0, e17.canvas.width, e17.canvas.height), a2.reset(), o2.reset(), s2.reset();
    }
    return { buffers: { color: a2, depth: o2, stencil: s2 }, enable: F2, disable: ce2, bindFramebuffer: le2, drawBuffers: ue2, useProgram: de2, setBlending: me2, setMaterial: I2, setFlipSided: he2, setCullFace: L2, setLineWidth: R2, setPolygonOffset: z2, setScissorTest: ge2, activeTexture: B2, bindTexture: V2, unbindTexture: _e2, compressedTexImage2D: ve2, compressedTexImage3D: ye2, texImage2D: Ee2, texImage3D: De2, updateUBOMapping: Ae2, uniformBlockBinding: je2, texStorage2D: we2, texStorage3D: Te2, texSubImage2D: be2, texSubImage3D: xe2, compressedTexSubImage2D: Se2, compressedTexSubImage3D: Ce2, scissor: Oe2, viewport: ke2, reset: Me2 };
  }
  function Ks(e17, t2, n2, r2, i2, a2, o2) {
    let s2 = t2.has(`WEBGL_multisampled_render_to_texture`) ? t2.get(`WEBGL_multisampled_render_to_texture`) : null, c2 = typeof navigator > `u` ? false : /OculusBrowser/g.test(navigator.userAgent), v2 = new U(), y2 = /* @__PURE__ */ new WeakMap(), b2, x2 = /* @__PURE__ */ new WeakMap(), S2 = false;
    try {
      S2 = typeof OffscreenCanvas < `u` && new OffscreenCanvas(1, 1).getContext(`2d`) !== null;
    } catch {
    }
    function C2(e18, t3) {
      return S2 ? new OffscreenCanvas(e18, t3) : ot(`canvas`);
    }
    function w2(e18, t3, n3) {
      let r3 = 1, i3 = Ee2(e18);
      if ((i3.width > n3 || i3.height > n3) && (r3 = n3 / Math.max(i3.width, i3.height)), r3 < 1) if (typeof HTMLImageElement < `u` && e18 instanceof HTMLImageElement || typeof HTMLCanvasElement < `u` && e18 instanceof HTMLCanvasElement || typeof ImageBitmap < `u` && e18 instanceof ImageBitmap || typeof VideoFrame < `u` && e18 instanceof VideoFrame) {
        let n4 = Math.floor(r3 * i3.width), a3 = Math.floor(r3 * i3.height);
        b2 === void 0 && (b2 = C2(n4, a3));
        let o3 = t3 ? C2(n4, a3) : b2;
        return o3.width = n4, o3.height = a3, o3.getContext(`2d`).drawImage(e18, 0, 0, n4, a3), console.warn(`THREE.WebGLRenderer: Texture has been resized from (` + i3.width + `x` + i3.height + `) to (` + n4 + `x` + a3 + `).`), o3;
      } else return `data` in e18 && console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (` + i3.width + `x` + i3.height + `).`), e18;
      return e18;
    }
    function T2(e18) {
      return e18.generateMipmaps;
    }
    function E2(t3) {
      e17.generateMipmap(t3);
    }
    function D2(t3) {
      return t3.isWebGLCubeRenderTarget ? e17.TEXTURE_CUBE_MAP : t3.isWebGL3DRenderTarget ? e17.TEXTURE_3D : t3.isWebGLArrayRenderTarget || t3.isCompressedArrayTexture ? e17.TEXTURE_2D_ARRAY : e17.TEXTURE_2D;
    }
    function O2(n3, r3, i3, a3, o3 = false) {
      if (n3 !== null) {
        if (e17[n3] !== void 0) return e17[n3];
        console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '` + n3 + `'`);
      }
      let s3 = r3;
      if (r3 === e17.RED && (i3 === e17.FLOAT && (s3 = e17.R32F), i3 === e17.HALF_FLOAT && (s3 = e17.R16F), i3 === e17.UNSIGNED_BYTE && (s3 = e17.R8)), r3 === e17.RED_INTEGER && (i3 === e17.UNSIGNED_BYTE && (s3 = e17.R8UI), i3 === e17.UNSIGNED_SHORT && (s3 = e17.R16UI), i3 === e17.UNSIGNED_INT && (s3 = e17.R32UI), i3 === e17.BYTE && (s3 = e17.R8I), i3 === e17.SHORT && (s3 = e17.R16I), i3 === e17.INT && (s3 = e17.R32I)), r3 === e17.RG && (i3 === e17.FLOAT && (s3 = e17.RG32F), i3 === e17.HALF_FLOAT && (s3 = e17.RG16F), i3 === e17.UNSIGNED_BYTE && (s3 = e17.RG8)), r3 === e17.RG_INTEGER && (i3 === e17.UNSIGNED_BYTE && (s3 = e17.RG8UI), i3 === e17.UNSIGNED_SHORT && (s3 = e17.RG16UI), i3 === e17.UNSIGNED_INT && (s3 = e17.RG32UI), i3 === e17.BYTE && (s3 = e17.RG8I), i3 === e17.SHORT && (s3 = e17.RG16I), i3 === e17.INT && (s3 = e17.RG32I)), r3 === e17.RGB_INTEGER && (i3 === e17.UNSIGNED_BYTE && (s3 = e17.RGB8UI), i3 === e17.UNSIGNED_SHORT && (s3 = e17.RGB16UI), i3 === e17.UNSIGNED_INT && (s3 = e17.RGB32UI), i3 === e17.BYTE && (s3 = e17.RGB8I), i3 === e17.SHORT && (s3 = e17.RGB16I), i3 === e17.INT && (s3 = e17.RGB32I)), r3 === e17.RGBA_INTEGER && (i3 === e17.UNSIGNED_BYTE && (s3 = e17.RGBA8UI), i3 === e17.UNSIGNED_SHORT && (s3 = e17.RGBA16UI), i3 === e17.UNSIGNED_INT && (s3 = e17.RGBA32UI), i3 === e17.BYTE && (s3 = e17.RGBA8I), i3 === e17.SHORT && (s3 = e17.RGBA16I), i3 === e17.INT && (s3 = e17.RGBA32I)), r3 === e17.RGB && (i3 === e17.UNSIGNED_INT_5_9_9_9_REV && (s3 = e17.RGB9_E5), i3 === e17.UNSIGNED_INT_10F_11F_11F_REV && (s3 = e17.R11F_G11F_B10F)), r3 === e17.RGBA) {
        let t3 = o3 ? Ve : K.getTransfer(a3);
        i3 === e17.FLOAT && (s3 = e17.RGBA32F), i3 === e17.HALF_FLOAT && (s3 = e17.RGBA16F), i3 === e17.UNSIGNED_BYTE && (s3 = t3 === `srgb` ? e17.SRGB8_ALPHA8 : e17.RGBA8), i3 === e17.UNSIGNED_SHORT_4_4_4_4 && (s3 = e17.RGBA4), i3 === e17.UNSIGNED_SHORT_5_5_5_1 && (s3 = e17.RGB5_A1);
      }
      return (s3 === e17.R16F || s3 === e17.R32F || s3 === e17.RG16F || s3 === e17.RG32F || s3 === e17.RGBA16F || s3 === e17.RGBA32F) && t2.get(`EXT_color_buffer_float`), s3;
    }
    function k2(t3, n3) {
      let r3;
      return t3 ? n3 === null || n3 === 1014 || n3 === 1020 ? r3 = e17.DEPTH24_STENCIL8 : n3 === 1015 ? r3 = e17.DEPTH32F_STENCIL8 : n3 === 1012 && (r3 = e17.DEPTH24_STENCIL8, console.warn(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)) : n3 === null || n3 === 1014 || n3 === 1020 ? r3 = e17.DEPTH_COMPONENT24 : n3 === 1015 ? r3 = e17.DEPTH_COMPONENT32F : n3 === 1012 && (r3 = e17.DEPTH_COMPONENT16), r3;
    }
    function A3(e18, t3) {
      return T2(e18) === true || e18.isFramebufferTexture && e18.minFilter !== 1003 && e18.minFilter !== 1006 ? Math.log2(Math.max(t3.width, t3.height)) + 1 : e18.mipmaps !== void 0 && e18.mipmaps.length > 0 ? e18.mipmaps.length : e18.isCompressedTexture && Array.isArray(e18.image) ? t3.mipmaps.length : 1;
    }
    function j3(e18) {
      let t3 = e18.target;
      t3.removeEventListener(`dispose`, j3), te2(t3), t3.isVideoTexture && y2.delete(t3);
    }
    function ee2(e18) {
      let t3 = e18.target;
      t3.removeEventListener(`dispose`, ee2), P2(t3);
    }
    function te2(e18) {
      let t3 = r2.get(e18);
      if (t3.__webglInit === void 0) return;
      let n3 = e18.source, i3 = x2.get(n3);
      if (i3) {
        let r3 = i3[t3.__cacheKey];
        r3.usedTimes--, r3.usedTimes === 0 && M3(e18), Object.keys(i3).length === 0 && x2.delete(n3);
      }
      r2.remove(e18);
    }
    function M3(t3) {
      let n3 = r2.get(t3);
      e17.deleteTexture(n3.__webglTexture);
      let i3 = t3.source, a3 = x2.get(i3);
      delete a3[n3.__cacheKey], o2.memory.textures--;
    }
    function P2(t3) {
      let n3 = r2.get(t3);
      if (t3.depthTexture && (t3.depthTexture.dispose(), r2.remove(t3.depthTexture)), t3.isWebGLCubeRenderTarget) for (let t4 = 0; t4 < 6; t4++) {
        if (Array.isArray(n3.__webglFramebuffer[t4])) for (let r3 = 0; r3 < n3.__webglFramebuffer[t4].length; r3++) e17.deleteFramebuffer(n3.__webglFramebuffer[t4][r3]);
        else e17.deleteFramebuffer(n3.__webglFramebuffer[t4]);
        n3.__webglDepthbuffer && e17.deleteRenderbuffer(n3.__webglDepthbuffer[t4]);
      }
      else {
        if (Array.isArray(n3.__webglFramebuffer)) for (let t4 = 0; t4 < n3.__webglFramebuffer.length; t4++) e17.deleteFramebuffer(n3.__webglFramebuffer[t4]);
        else e17.deleteFramebuffer(n3.__webglFramebuffer);
        if (n3.__webglDepthbuffer && e17.deleteRenderbuffer(n3.__webglDepthbuffer), n3.__webglMultisampledFramebuffer && e17.deleteFramebuffer(n3.__webglMultisampledFramebuffer), n3.__webglColorRenderbuffer) for (let t4 = 0; t4 < n3.__webglColorRenderbuffer.length; t4++) n3.__webglColorRenderbuffer[t4] && e17.deleteRenderbuffer(n3.__webglColorRenderbuffer[t4]);
        n3.__webglDepthRenderbuffer && e17.deleteRenderbuffer(n3.__webglDepthRenderbuffer);
      }
      let i3 = t3.textures;
      for (let t4 = 0, n4 = i3.length; t4 < n4; t4++) {
        let n5 = r2.get(i3[t4]);
        n5.__webglTexture && (e17.deleteTexture(n5.__webglTexture), o2.memory.textures--), r2.remove(i3[t4]);
      }
      r2.remove(t3);
    }
    let ne2 = 0;
    function re2() {
      ne2 = 0;
    }
    function ie2() {
      let e18 = ne2;
      return e18 >= i2.maxTextures && console.warn(`THREE.WebGLTextures: Trying to use ` + e18 + ` texture units while this GPU supports only ` + i2.maxTextures), ne2 += 1, e18;
    }
    function ae2(e18) {
      let t3 = [];
      return t3.push(e18.wrapS), t3.push(e18.wrapT), t3.push(e18.wrapR || 0), t3.push(e18.magFilter), t3.push(e18.minFilter), t3.push(e18.anisotropy), t3.push(e18.internalFormat), t3.push(e18.format), t3.push(e18.type), t3.push(e18.generateMipmaps), t3.push(e18.premultiplyAlpha), t3.push(e18.flipY), t3.push(e18.unpackAlignment), t3.push(e18.colorSpace), t3.join();
    }
    function oe2(t3, i3) {
      let a3 = r2.get(t3);
      if (t3.isVideoTexture && we2(t3), t3.isRenderTargetTexture === false && t3.isExternalTexture !== true && t3.version > 0 && a3.__version !== t3.version) {
        let e18 = t3.image;
        if (e18 === null) console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);
        else if (e18.complete === false) console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);
        else {
          he2(a3, t3, i3);
          return;
        }
      } else t3.isExternalTexture && (a3.__webglTexture = t3.sourceTexture ? t3.sourceTexture : null);
      n2.bindTexture(e17.TEXTURE_2D, a3.__webglTexture, e17.TEXTURE0 + i3);
    }
    function se2(t3, i3) {
      let a3 = r2.get(t3);
      if (t3.isRenderTargetTexture === false && t3.version > 0 && a3.__version !== t3.version) {
        he2(a3, t3, i3);
        return;
      }
      n2.bindTexture(e17.TEXTURE_2D_ARRAY, a3.__webglTexture, e17.TEXTURE0 + i3);
    }
    function F2(t3, i3) {
      let a3 = r2.get(t3);
      if (t3.isRenderTargetTexture === false && t3.version > 0 && a3.__version !== t3.version) {
        he2(a3, t3, i3);
        return;
      }
      n2.bindTexture(e17.TEXTURE_3D, a3.__webglTexture, e17.TEXTURE0 + i3);
    }
    function ce2(t3, i3) {
      let a3 = r2.get(t3);
      if (t3.version > 0 && a3.__version !== t3.version) {
        L2(a3, t3, i3);
        return;
      }
      n2.bindTexture(e17.TEXTURE_CUBE_MAP, a3.__webglTexture, e17.TEXTURE0 + i3);
    }
    let le2 = { [l]: e17.REPEAT, [u]: e17.CLAMP_TO_EDGE, [d]: e17.MIRRORED_REPEAT }, ue2 = { [f]: e17.NEAREST, [p]: e17.NEAREST_MIPMAP_NEAREST, [m]: e17.NEAREST_MIPMAP_LINEAR, [h]: e17.LINEAR, [g]: e17.LINEAR_MIPMAP_NEAREST, [_]: e17.LINEAR_MIPMAP_LINEAR }, de2 = { 512: e17.NEVER, 519: e17.ALWAYS, 513: e17.LESS, 515: e17.LEQUAL, 514: e17.EQUAL, 518: e17.GEQUAL, 516: e17.GREATER, 517: e17.NOTEQUAL };
    function fe2(n3, a3) {
      if (a3.type === 1015 && t2.has(`OES_texture_float_linear`) === false && (a3.magFilter === 1006 || a3.magFilter === 1007 || a3.magFilter === 1005 || a3.magFilter === 1008 || a3.minFilter === 1006 || a3.minFilter === 1007 || a3.minFilter === 1005 || a3.minFilter === 1008) && console.warn(`THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`), e17.texParameteri(n3, e17.TEXTURE_WRAP_S, le2[a3.wrapS]), e17.texParameteri(n3, e17.TEXTURE_WRAP_T, le2[a3.wrapT]), (n3 === e17.TEXTURE_3D || n3 === e17.TEXTURE_2D_ARRAY) && e17.texParameteri(n3, e17.TEXTURE_WRAP_R, le2[a3.wrapR]), e17.texParameteri(n3, e17.TEXTURE_MAG_FILTER, ue2[a3.magFilter]), e17.texParameteri(n3, e17.TEXTURE_MIN_FILTER, ue2[a3.minFilter]), a3.compareFunction && (e17.texParameteri(n3, e17.TEXTURE_COMPARE_MODE, e17.COMPARE_REF_TO_TEXTURE), e17.texParameteri(n3, e17.TEXTURE_COMPARE_FUNC, de2[a3.compareFunction])), t2.has(`EXT_texture_filter_anisotropic`) === true) {
        if (a3.magFilter === 1003 || a3.minFilter !== 1005 && a3.minFilter !== 1008 || a3.type === 1015 && t2.has(`OES_texture_float_linear`) === false) return;
        if (a3.anisotropy > 1 || r2.get(a3).__currentAnisotropy) {
          let o3 = t2.get(`EXT_texture_filter_anisotropic`);
          e17.texParameterf(n3, o3.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(a3.anisotropy, i2.getMaxAnisotropy())), r2.get(a3).__currentAnisotropy = a3.anisotropy;
        }
      }
    }
    function pe2(t3, n3) {
      let r3 = false;
      t3.__webglInit === void 0 && (t3.__webglInit = true, n3.addEventListener(`dispose`, j3));
      let i3 = n3.source, a3 = x2.get(i3);
      a3 === void 0 && (a3 = {}, x2.set(i3, a3));
      let s3 = ae2(n3);
      if (s3 !== t3.__cacheKey) {
        a3[s3] === void 0 && (a3[s3] = { texture: e17.createTexture(), usedTimes: 0 }, o2.memory.textures++, r3 = true), a3[s3].usedTimes++;
        let i4 = a3[t3.__cacheKey];
        i4 !== void 0 && (a3[t3.__cacheKey].usedTimes--, i4.usedTimes === 0 && M3(n3)), t3.__cacheKey = s3, t3.__webglTexture = a3[s3].texture;
      }
      return r3;
    }
    function me2(e18, t3, n3) {
      return Math.floor(Math.floor(e18 / n3) / t3);
    }
    function I2(t3, r3, i3, a3) {
      let o3 = t3.updateRanges;
      if (o3.length === 0) n2.texSubImage2D(e17.TEXTURE_2D, 0, 0, 0, r3.width, r3.height, i3, a3, r3.data);
      else {
        o3.sort((e18, t4) => e18.start - t4.start);
        let s3 = 0;
        for (let e18 = 1; e18 < o3.length; e18++) {
          let t4 = o3[s3], n3 = o3[e18], i4 = t4.start + t4.count, a4 = me2(n3.start, r3.width, 4), c4 = me2(t4.start, r3.width, 4);
          n3.start <= i4 + 1 && a4 === c4 && me2(n3.start + n3.count - 1, r3.width, 4) === a4 ? t4.count = Math.max(t4.count, n3.start + n3.count - t4.start) : (++s3, o3[s3] = n3);
        }
        o3.length = s3 + 1;
        let c3 = e17.getParameter(e17.UNPACK_ROW_LENGTH), l2 = e17.getParameter(e17.UNPACK_SKIP_PIXELS), u2 = e17.getParameter(e17.UNPACK_SKIP_ROWS);
        e17.pixelStorei(e17.UNPACK_ROW_LENGTH, r3.width);
        for (let t4 = 0, s4 = o3.length; t4 < s4; t4++) {
          let s5 = o3[t4], c4 = Math.floor(s5.start / 4), l3 = Math.ceil(s5.count / 4), u3 = c4 % r3.width, d2 = Math.floor(c4 / r3.width), f2 = l3;
          e17.pixelStorei(e17.UNPACK_SKIP_PIXELS, u3), e17.pixelStorei(e17.UNPACK_SKIP_ROWS, d2), n2.texSubImage2D(e17.TEXTURE_2D, 0, u3, d2, f2, 1, i3, a3, r3.data);
        }
        t3.clearUpdateRanges(), e17.pixelStorei(e17.UNPACK_ROW_LENGTH, c3), e17.pixelStorei(e17.UNPACK_SKIP_PIXELS, l2), e17.pixelStorei(e17.UNPACK_SKIP_ROWS, u2);
      }
    }
    function he2(t3, o3, s3) {
      let c3 = e17.TEXTURE_2D;
      (o3.isDataArrayTexture || o3.isCompressedArrayTexture) && (c3 = e17.TEXTURE_2D_ARRAY), o3.isData3DTexture && (c3 = e17.TEXTURE_3D);
      let l2 = pe2(t3, o3), u2 = o3.source;
      n2.bindTexture(c3, t3.__webglTexture, e17.TEXTURE0 + s3);
      let d2 = r2.get(u2);
      if (u2.version !== d2.__version || l2 === true) {
        n2.activeTexture(e17.TEXTURE0 + s3);
        let t4 = K.getPrimaries(K.workingColorSpace), r3 = o3.colorSpace === `` ? null : K.getPrimaries(o3.colorSpace), f2 = o3.colorSpace === `` || t4 === r3 ? e17.NONE : e17.BROWSER_DEFAULT_WEBGL;
        e17.pixelStorei(e17.UNPACK_FLIP_Y_WEBGL, o3.flipY), e17.pixelStorei(e17.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o3.premultiplyAlpha), e17.pixelStorei(e17.UNPACK_ALIGNMENT, o3.unpackAlignment), e17.pixelStorei(e17.UNPACK_COLORSPACE_CONVERSION_WEBGL, f2);
        let p2 = w2(o3.image, false, i2.maxTextureSize);
        p2 = Te2(o3, p2);
        let m2 = a2.convert(o3.format, o3.colorSpace), h2 = a2.convert(o3.type), g2 = O2(o3.internalFormat, m2, h2, o3.colorSpace, o3.isVideoTexture);
        fe2(c3, o3);
        let _2, v3 = o3.mipmaps, y3 = o3.isVideoTexture !== true, b3 = d2.__version === void 0 || l2 === true, x3 = u2.dataReady, S3 = A3(o3, p2);
        if (o3.isDepthTexture) g2 = k2(o3.format === N, o3.type), b3 && (y3 ? n2.texStorage2D(e17.TEXTURE_2D, 1, g2, p2.width, p2.height) : n2.texImage2D(e17.TEXTURE_2D, 0, g2, p2.width, p2.height, 0, m2, h2, null));
        else if (o3.isDataTexture) if (v3.length > 0) {
          y3 && b3 && n2.texStorage2D(e17.TEXTURE_2D, S3, g2, v3[0].width, v3[0].height);
          for (let t5 = 0, r4 = v3.length; t5 < r4; t5++) _2 = v3[t5], y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_2D, t5, 0, 0, _2.width, _2.height, m2, h2, _2.data) : n2.texImage2D(e17.TEXTURE_2D, t5, g2, _2.width, _2.height, 0, m2, h2, _2.data);
          o3.generateMipmaps = false;
        } else y3 ? (b3 && n2.texStorage2D(e17.TEXTURE_2D, S3, g2, p2.width, p2.height), x3 && I2(o3, p2, m2, h2)) : n2.texImage2D(e17.TEXTURE_2D, 0, g2, p2.width, p2.height, 0, m2, h2, p2.data);
        else if (o3.isCompressedTexture) if (o3.isCompressedArrayTexture) {
          y3 && b3 && n2.texStorage3D(e17.TEXTURE_2D_ARRAY, S3, g2, v3[0].width, v3[0].height, p2.depth);
          for (let t5 = 0, r4 = v3.length; t5 < r4; t5++) if (_2 = v3[t5], o3.format !== 1023) if (m2 !== null) if (y3) {
            if (x3) if (o3.layerUpdates.size > 0) {
              let r5 = Qi(_2.width, _2.height, o3.format, o3.type);
              for (let i3 of o3.layerUpdates) {
                let a3 = _2.data.subarray(i3 * r5 / _2.data.BYTES_PER_ELEMENT, (i3 + 1) * r5 / _2.data.BYTES_PER_ELEMENT);
                n2.compressedTexSubImage3D(e17.TEXTURE_2D_ARRAY, t5, 0, 0, i3, _2.width, _2.height, 1, m2, a3);
              }
              o3.clearLayerUpdates();
            } else n2.compressedTexSubImage3D(e17.TEXTURE_2D_ARRAY, t5, 0, 0, 0, _2.width, _2.height, p2.depth, m2, _2.data);
          } else n2.compressedTexImage3D(e17.TEXTURE_2D_ARRAY, t5, g2, _2.width, _2.height, p2.depth, 0, _2.data, 0, 0);
          else console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);
          else y3 ? x3 && n2.texSubImage3D(e17.TEXTURE_2D_ARRAY, t5, 0, 0, 0, _2.width, _2.height, p2.depth, m2, h2, _2.data) : n2.texImage3D(e17.TEXTURE_2D_ARRAY, t5, g2, _2.width, _2.height, p2.depth, 0, m2, h2, _2.data);
        } else {
          y3 && b3 && n2.texStorage2D(e17.TEXTURE_2D, S3, g2, v3[0].width, v3[0].height);
          for (let t5 = 0, r4 = v3.length; t5 < r4; t5++) _2 = v3[t5], o3.format === 1023 ? y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_2D, t5, 0, 0, _2.width, _2.height, m2, h2, _2.data) : n2.texImage2D(e17.TEXTURE_2D, t5, g2, _2.width, _2.height, 0, m2, h2, _2.data) : m2 === null ? console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`) : y3 ? x3 && n2.compressedTexSubImage2D(e17.TEXTURE_2D, t5, 0, 0, _2.width, _2.height, m2, _2.data) : n2.compressedTexImage2D(e17.TEXTURE_2D, t5, g2, _2.width, _2.height, 0, _2.data);
        }
        else if (o3.isDataArrayTexture) if (y3) {
          if (b3 && n2.texStorage3D(e17.TEXTURE_2D_ARRAY, S3, g2, p2.width, p2.height, p2.depth), x3) if (o3.layerUpdates.size > 0) {
            let t5 = Qi(p2.width, p2.height, o3.format, o3.type);
            for (let r4 of o3.layerUpdates) {
              let i3 = p2.data.subarray(r4 * t5 / p2.data.BYTES_PER_ELEMENT, (r4 + 1) * t5 / p2.data.BYTES_PER_ELEMENT);
              n2.texSubImage3D(e17.TEXTURE_2D_ARRAY, 0, 0, 0, r4, p2.width, p2.height, 1, m2, h2, i3);
            }
            o3.clearLayerUpdates();
          } else n2.texSubImage3D(e17.TEXTURE_2D_ARRAY, 0, 0, 0, 0, p2.width, p2.height, p2.depth, m2, h2, p2.data);
        } else n2.texImage3D(e17.TEXTURE_2D_ARRAY, 0, g2, p2.width, p2.height, p2.depth, 0, m2, h2, p2.data);
        else if (o3.isData3DTexture) y3 ? (b3 && n2.texStorage3D(e17.TEXTURE_3D, S3, g2, p2.width, p2.height, p2.depth), x3 && n2.texSubImage3D(e17.TEXTURE_3D, 0, 0, 0, 0, p2.width, p2.height, p2.depth, m2, h2, p2.data)) : n2.texImage3D(e17.TEXTURE_3D, 0, g2, p2.width, p2.height, p2.depth, 0, m2, h2, p2.data);
        else if (o3.isFramebufferTexture) {
          if (b3) if (y3) n2.texStorage2D(e17.TEXTURE_2D, S3, g2, p2.width, p2.height);
          else {
            let t5 = p2.width, r4 = p2.height;
            for (let i3 = 0; i3 < S3; i3++) n2.texImage2D(e17.TEXTURE_2D, i3, g2, t5, r4, 0, m2, h2, null), t5 >>= 1, r4 >>= 1;
          }
        } else if (v3.length > 0) {
          if (y3 && b3) {
            let t5 = Ee2(v3[0]);
            n2.texStorage2D(e17.TEXTURE_2D, S3, g2, t5.width, t5.height);
          }
          for (let t5 = 0, r4 = v3.length; t5 < r4; t5++) _2 = v3[t5], y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_2D, t5, 0, 0, m2, h2, _2) : n2.texImage2D(e17.TEXTURE_2D, t5, g2, m2, h2, _2);
          o3.generateMipmaps = false;
        } else if (y3) {
          if (b3) {
            let t5 = Ee2(p2);
            n2.texStorage2D(e17.TEXTURE_2D, S3, g2, t5.width, t5.height);
          }
          x3 && n2.texSubImage2D(e17.TEXTURE_2D, 0, 0, 0, m2, h2, p2);
        } else n2.texImage2D(e17.TEXTURE_2D, 0, g2, m2, h2, p2);
        T2(o3) && E2(c3), d2.__version = u2.version, o3.onUpdate && o3.onUpdate(o3);
      }
      t3.__version = o3.version;
    }
    function L2(t3, o3, s3) {
      if (o3.image.length !== 6) return;
      let c3 = pe2(t3, o3), l2 = o3.source;
      n2.bindTexture(e17.TEXTURE_CUBE_MAP, t3.__webglTexture, e17.TEXTURE0 + s3);
      let u2 = r2.get(l2);
      if (l2.version !== u2.__version || c3 === true) {
        n2.activeTexture(e17.TEXTURE0 + s3);
        let t4 = K.getPrimaries(K.workingColorSpace), r3 = o3.colorSpace === `` ? null : K.getPrimaries(o3.colorSpace), d2 = o3.colorSpace === `` || t4 === r3 ? e17.NONE : e17.BROWSER_DEFAULT_WEBGL;
        e17.pixelStorei(e17.UNPACK_FLIP_Y_WEBGL, o3.flipY), e17.pixelStorei(e17.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o3.premultiplyAlpha), e17.pixelStorei(e17.UNPACK_ALIGNMENT, o3.unpackAlignment), e17.pixelStorei(e17.UNPACK_COLORSPACE_CONVERSION_WEBGL, d2);
        let f2 = o3.isCompressedTexture || o3.image[0].isCompressedTexture, p2 = o3.image[0] && o3.image[0].isDataTexture, m2 = [];
        for (let e18 = 0; e18 < 6; e18++) !f2 && !p2 ? m2[e18] = w2(o3.image[e18], true, i2.maxCubemapSize) : m2[e18] = p2 ? o3.image[e18].image : o3.image[e18], m2[e18] = Te2(o3, m2[e18]);
        let h2 = m2[0], g2 = a2.convert(o3.format, o3.colorSpace), _2 = a2.convert(o3.type), v3 = O2(o3.internalFormat, g2, _2, o3.colorSpace), y3 = o3.isVideoTexture !== true, b3 = u2.__version === void 0 || c3 === true, x3 = l2.dataReady, S3 = A3(o3, h2);
        fe2(e17.TEXTURE_CUBE_MAP, o3);
        let C3;
        if (f2) {
          y3 && b3 && n2.texStorage2D(e17.TEXTURE_CUBE_MAP, S3, v3, h2.width, h2.height);
          for (let t5 = 0; t5 < 6; t5++) {
            C3 = m2[t5].mipmaps;
            for (let r4 = 0; r4 < C3.length; r4++) {
              let i3 = C3[r4];
              o3.format === 1023 ? y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4, 0, 0, i3.width, i3.height, g2, _2, i3.data) : n2.texImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4, v3, i3.width, i3.height, 0, g2, _2, i3.data) : g2 === null ? console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`) : y3 ? x3 && n2.compressedTexSubImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4, 0, 0, i3.width, i3.height, g2, i3.data) : n2.compressedTexImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4, v3, i3.width, i3.height, 0, i3.data);
            }
          }
        } else {
          if (C3 = o3.mipmaps, y3 && b3) {
            C3.length > 0 && S3++;
            let t5 = Ee2(m2[0]);
            n2.texStorage2D(e17.TEXTURE_CUBE_MAP, S3, v3, t5.width, t5.height);
          }
          for (let t5 = 0; t5 < 6; t5++) if (p2) {
            y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, 0, 0, 0, m2[t5].width, m2[t5].height, g2, _2, m2[t5].data) : n2.texImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, 0, v3, m2[t5].width, m2[t5].height, 0, g2, _2, m2[t5].data);
            for (let r4 = 0; r4 < C3.length; r4++) {
              let i3 = C3[r4].image[t5].image;
              y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4 + 1, 0, 0, i3.width, i3.height, g2, _2, i3.data) : n2.texImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4 + 1, v3, i3.width, i3.height, 0, g2, _2, i3.data);
            }
          } else {
            y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, 0, 0, 0, g2, _2, m2[t5]) : n2.texImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, 0, v3, g2, _2, m2[t5]);
            for (let r4 = 0; r4 < C3.length; r4++) {
              let i3 = C3[r4];
              y3 ? x3 && n2.texSubImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4 + 1, 0, 0, g2, _2, i3.image[t5]) : n2.texImage2D(e17.TEXTURE_CUBE_MAP_POSITIVE_X + t5, r4 + 1, v3, g2, _2, i3.image[t5]);
            }
          }
        }
        T2(o3) && E2(e17.TEXTURE_CUBE_MAP), u2.__version = l2.version, o3.onUpdate && o3.onUpdate(o3);
      }
      t3.__version = o3.version;
    }
    function R2(t3, i3, o3, c3, l2, u2) {
      let d2 = a2.convert(o3.format, o3.colorSpace), f2 = a2.convert(o3.type), p2 = O2(o3.internalFormat, d2, f2, o3.colorSpace), m2 = r2.get(i3), h2 = r2.get(o3);
      if (h2.__renderTarget = i3, !m2.__hasExternalTextures) {
        let t4 = Math.max(1, i3.width >> u2), r3 = Math.max(1, i3.height >> u2);
        l2 === e17.TEXTURE_3D || l2 === e17.TEXTURE_2D_ARRAY ? n2.texImage3D(l2, u2, p2, t4, r3, i3.depth, 0, d2, f2, null) : n2.texImage2D(l2, u2, p2, t4, r3, 0, d2, f2, null);
      }
      n2.bindFramebuffer(e17.FRAMEBUFFER, t3), Ce2(i3) ? s2.framebufferTexture2DMultisampleEXT(e17.FRAMEBUFFER, c3, l2, h2.__webglTexture, 0, Se2(i3)) : (l2 === e17.TEXTURE_2D || l2 >= e17.TEXTURE_CUBE_MAP_POSITIVE_X && l2 <= e17.TEXTURE_CUBE_MAP_NEGATIVE_Z) && e17.framebufferTexture2D(e17.FRAMEBUFFER, c3, l2, h2.__webglTexture, u2), n2.bindFramebuffer(e17.FRAMEBUFFER, null);
    }
    function z2(t3, n3, r3) {
      if (e17.bindRenderbuffer(e17.RENDERBUFFER, t3), n3.depthBuffer) {
        let i3 = n3.depthTexture, a3 = i3 && i3.isDepthTexture ? i3.type : null, o3 = k2(n3.stencilBuffer, a3), c3 = n3.stencilBuffer ? e17.DEPTH_STENCIL_ATTACHMENT : e17.DEPTH_ATTACHMENT, l2 = Se2(n3);
        Ce2(n3) ? s2.renderbufferStorageMultisampleEXT(e17.RENDERBUFFER, l2, o3, n3.width, n3.height) : r3 ? e17.renderbufferStorageMultisample(e17.RENDERBUFFER, l2, o3, n3.width, n3.height) : e17.renderbufferStorage(e17.RENDERBUFFER, o3, n3.width, n3.height), e17.framebufferRenderbuffer(e17.FRAMEBUFFER, c3, e17.RENDERBUFFER, t3);
      } else {
        let t4 = n3.textures;
        for (let i3 = 0; i3 < t4.length; i3++) {
          let o3 = t4[i3], c3 = a2.convert(o3.format, o3.colorSpace), l2 = a2.convert(o3.type), u2 = O2(o3.internalFormat, c3, l2, o3.colorSpace), d2 = Se2(n3);
          r3 && Ce2(n3) === false ? e17.renderbufferStorageMultisample(e17.RENDERBUFFER, d2, u2, n3.width, n3.height) : Ce2(n3) ? s2.renderbufferStorageMultisampleEXT(e17.RENDERBUFFER, d2, u2, n3.width, n3.height) : e17.renderbufferStorage(e17.RENDERBUFFER, u2, n3.width, n3.height);
        }
      }
      e17.bindRenderbuffer(e17.RENDERBUFFER, null);
    }
    function ge2(t3, i3) {
      if (i3 && i3.isWebGLCubeRenderTarget) throw Error(`Depth Texture with cube render targets is not supported`);
      if (n2.bindFramebuffer(e17.FRAMEBUFFER, t3), !(i3.depthTexture && i3.depthTexture.isDepthTexture)) throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);
      let a3 = r2.get(i3.depthTexture);
      a3.__renderTarget = i3, (!a3.__webglTexture || i3.depthTexture.image.width !== i3.width || i3.depthTexture.image.height !== i3.height) && (i3.depthTexture.image.width = i3.width, i3.depthTexture.image.height = i3.height, i3.depthTexture.needsUpdate = true), oe2(i3.depthTexture, 0);
      let o3 = a3.__webglTexture, c3 = Se2(i3);
      if (i3.depthTexture.format === 1026) Ce2(i3) ? s2.framebufferTexture2DMultisampleEXT(e17.FRAMEBUFFER, e17.DEPTH_ATTACHMENT, e17.TEXTURE_2D, o3, 0, c3) : e17.framebufferTexture2D(e17.FRAMEBUFFER, e17.DEPTH_ATTACHMENT, e17.TEXTURE_2D, o3, 0);
      else if (i3.depthTexture.format === 1027) Ce2(i3) ? s2.framebufferTexture2DMultisampleEXT(e17.FRAMEBUFFER, e17.DEPTH_STENCIL_ATTACHMENT, e17.TEXTURE_2D, o3, 0, c3) : e17.framebufferTexture2D(e17.FRAMEBUFFER, e17.DEPTH_STENCIL_ATTACHMENT, e17.TEXTURE_2D, o3, 0);
      else throw Error(`Unknown depthTexture format`);
    }
    function B2(t3) {
      let i3 = r2.get(t3), a3 = t3.isWebGLCubeRenderTarget === true;
      if (i3.__boundDepthTexture !== t3.depthTexture) {
        let e18 = t3.depthTexture;
        if (i3.__depthDisposeCallback && i3.__depthDisposeCallback(), e18) {
          let t4 = () => {
            delete i3.__boundDepthTexture, delete i3.__depthDisposeCallback, e18.removeEventListener(`dispose`, t4);
          };
          e18.addEventListener(`dispose`, t4), i3.__depthDisposeCallback = t4;
        }
        i3.__boundDepthTexture = e18;
      }
      if (t3.depthTexture && !i3.__autoAllocateDepthBuffer) {
        if (a3) throw Error(`target.depthTexture not supported in Cube render targets`);
        let e18 = t3.texture.mipmaps;
        e18 && e18.length > 0 ? ge2(i3.__webglFramebuffer[0], t3) : ge2(i3.__webglFramebuffer, t3);
      } else if (a3) {
        i3.__webglDepthbuffer = [];
        for (let r3 = 0; r3 < 6; r3++) if (n2.bindFramebuffer(e17.FRAMEBUFFER, i3.__webglFramebuffer[r3]), i3.__webglDepthbuffer[r3] === void 0) i3.__webglDepthbuffer[r3] = e17.createRenderbuffer(), z2(i3.__webglDepthbuffer[r3], t3, false);
        else {
          let n3 = t3.stencilBuffer ? e17.DEPTH_STENCIL_ATTACHMENT : e17.DEPTH_ATTACHMENT, a4 = i3.__webglDepthbuffer[r3];
          e17.bindRenderbuffer(e17.RENDERBUFFER, a4), e17.framebufferRenderbuffer(e17.FRAMEBUFFER, n3, e17.RENDERBUFFER, a4);
        }
      } else {
        let r3 = t3.texture.mipmaps;
        if (r3 && r3.length > 0 ? n2.bindFramebuffer(e17.FRAMEBUFFER, i3.__webglFramebuffer[0]) : n2.bindFramebuffer(e17.FRAMEBUFFER, i3.__webglFramebuffer), i3.__webglDepthbuffer === void 0) i3.__webglDepthbuffer = e17.createRenderbuffer(), z2(i3.__webglDepthbuffer, t3, false);
        else {
          let n3 = t3.stencilBuffer ? e17.DEPTH_STENCIL_ATTACHMENT : e17.DEPTH_ATTACHMENT, r4 = i3.__webglDepthbuffer;
          e17.bindRenderbuffer(e17.RENDERBUFFER, r4), e17.framebufferRenderbuffer(e17.FRAMEBUFFER, n3, e17.RENDERBUFFER, r4);
        }
      }
      n2.bindFramebuffer(e17.FRAMEBUFFER, null);
    }
    function V2(t3, n3, i3) {
      let a3 = r2.get(t3);
      n3 !== void 0 && R2(a3.__webglFramebuffer, t3, t3.texture, e17.COLOR_ATTACHMENT0, e17.TEXTURE_2D, 0), i3 !== void 0 && B2(t3);
    }
    function _e2(t3) {
      let i3 = t3.texture, s3 = r2.get(t3), c3 = r2.get(i3);
      t3.addEventListener(`dispose`, ee2);
      let l2 = t3.textures, u2 = t3.isWebGLCubeRenderTarget === true, d2 = l2.length > 1;
      if (d2 || (c3.__webglTexture === void 0 && (c3.__webglTexture = e17.createTexture()), c3.__version = i3.version, o2.memory.textures++), u2) {
        s3.__webglFramebuffer = [];
        for (let t4 = 0; t4 < 6; t4++) if (i3.mipmaps && i3.mipmaps.length > 0) {
          s3.__webglFramebuffer[t4] = [];
          for (let n3 = 0; n3 < i3.mipmaps.length; n3++) s3.__webglFramebuffer[t4][n3] = e17.createFramebuffer();
        } else s3.__webglFramebuffer[t4] = e17.createFramebuffer();
      } else {
        if (i3.mipmaps && i3.mipmaps.length > 0) {
          s3.__webglFramebuffer = [];
          for (let t4 = 0; t4 < i3.mipmaps.length; t4++) s3.__webglFramebuffer[t4] = e17.createFramebuffer();
        } else s3.__webglFramebuffer = e17.createFramebuffer();
        if (d2) for (let t4 = 0, n3 = l2.length; t4 < n3; t4++) {
          let n4 = r2.get(l2[t4]);
          n4.__webglTexture === void 0 && (n4.__webglTexture = e17.createTexture(), o2.memory.textures++);
        }
        if (t3.samples > 0 && Ce2(t3) === false) {
          s3.__webglMultisampledFramebuffer = e17.createFramebuffer(), s3.__webglColorRenderbuffer = [], n2.bindFramebuffer(e17.FRAMEBUFFER, s3.__webglMultisampledFramebuffer);
          for (let n3 = 0; n3 < l2.length; n3++) {
            let r3 = l2[n3];
            s3.__webglColorRenderbuffer[n3] = e17.createRenderbuffer(), e17.bindRenderbuffer(e17.RENDERBUFFER, s3.__webglColorRenderbuffer[n3]);
            let i4 = a2.convert(r3.format, r3.colorSpace), o3 = a2.convert(r3.type), c4 = O2(r3.internalFormat, i4, o3, r3.colorSpace, t3.isXRRenderTarget === true), u3 = Se2(t3);
            e17.renderbufferStorageMultisample(e17.RENDERBUFFER, u3, c4, t3.width, t3.height), e17.framebufferRenderbuffer(e17.FRAMEBUFFER, e17.COLOR_ATTACHMENT0 + n3, e17.RENDERBUFFER, s3.__webglColorRenderbuffer[n3]);
          }
          e17.bindRenderbuffer(e17.RENDERBUFFER, null), t3.depthBuffer && (s3.__webglDepthRenderbuffer = e17.createRenderbuffer(), z2(s3.__webglDepthRenderbuffer, t3, true)), n2.bindFramebuffer(e17.FRAMEBUFFER, null);
        }
      }
      if (u2) {
        n2.bindTexture(e17.TEXTURE_CUBE_MAP, c3.__webglTexture), fe2(e17.TEXTURE_CUBE_MAP, i3);
        for (let n3 = 0; n3 < 6; n3++) if (i3.mipmaps && i3.mipmaps.length > 0) for (let r3 = 0; r3 < i3.mipmaps.length; r3++) R2(s3.__webglFramebuffer[n3][r3], t3, i3, e17.COLOR_ATTACHMENT0, e17.TEXTURE_CUBE_MAP_POSITIVE_X + n3, r3);
        else R2(s3.__webglFramebuffer[n3], t3, i3, e17.COLOR_ATTACHMENT0, e17.TEXTURE_CUBE_MAP_POSITIVE_X + n3, 0);
        T2(i3) && E2(e17.TEXTURE_CUBE_MAP), n2.unbindTexture();
      } else if (d2) {
        for (let i4 = 0, a3 = l2.length; i4 < a3; i4++) {
          let a4 = l2[i4], o3 = r2.get(a4), c4 = e17.TEXTURE_2D;
          (t3.isWebGL3DRenderTarget || t3.isWebGLArrayRenderTarget) && (c4 = t3.isWebGL3DRenderTarget ? e17.TEXTURE_3D : e17.TEXTURE_2D_ARRAY), n2.bindTexture(c4, o3.__webglTexture), fe2(c4, a4), R2(s3.__webglFramebuffer, t3, a4, e17.COLOR_ATTACHMENT0 + i4, c4, 0), T2(a4) && E2(c4);
        }
        n2.unbindTexture();
      } else {
        let r3 = e17.TEXTURE_2D;
        if ((t3.isWebGL3DRenderTarget || t3.isWebGLArrayRenderTarget) && (r3 = t3.isWebGL3DRenderTarget ? e17.TEXTURE_3D : e17.TEXTURE_2D_ARRAY), n2.bindTexture(r3, c3.__webglTexture), fe2(r3, i3), i3.mipmaps && i3.mipmaps.length > 0) for (let n3 = 0; n3 < i3.mipmaps.length; n3++) R2(s3.__webglFramebuffer[n3], t3, i3, e17.COLOR_ATTACHMENT0, r3, n3);
        else R2(s3.__webglFramebuffer, t3, i3, e17.COLOR_ATTACHMENT0, r3, 0);
        T2(i3) && E2(r3), n2.unbindTexture();
      }
      t3.depthBuffer && B2(t3);
    }
    function ve2(e18) {
      let t3 = e18.textures;
      for (let i3 = 0, a3 = t3.length; i3 < a3; i3++) {
        let a4 = t3[i3];
        if (T2(a4)) {
          let t4 = D2(e18), i4 = r2.get(a4).__webglTexture;
          n2.bindTexture(t4, i4), E2(t4), n2.unbindTexture();
        }
      }
    }
    let ye2 = [], be2 = [];
    function xe2(t3) {
      if (t3.samples > 0) {
        if (Ce2(t3) === false) {
          let i3 = t3.textures, a3 = t3.width, o3 = t3.height, s3 = e17.COLOR_BUFFER_BIT, l2 = t3.stencilBuffer ? e17.DEPTH_STENCIL_ATTACHMENT : e17.DEPTH_ATTACHMENT, u2 = r2.get(t3), d2 = i3.length > 1;
          if (d2) for (let t4 = 0; t4 < i3.length; t4++) n2.bindFramebuffer(e17.FRAMEBUFFER, u2.__webglMultisampledFramebuffer), e17.framebufferRenderbuffer(e17.FRAMEBUFFER, e17.COLOR_ATTACHMENT0 + t4, e17.RENDERBUFFER, null), n2.bindFramebuffer(e17.FRAMEBUFFER, u2.__webglFramebuffer), e17.framebufferTexture2D(e17.DRAW_FRAMEBUFFER, e17.COLOR_ATTACHMENT0 + t4, e17.TEXTURE_2D, null, 0);
          n2.bindFramebuffer(e17.READ_FRAMEBUFFER, u2.__webglMultisampledFramebuffer);
          let f2 = t3.texture.mipmaps;
          f2 && f2.length > 0 ? n2.bindFramebuffer(e17.DRAW_FRAMEBUFFER, u2.__webglFramebuffer[0]) : n2.bindFramebuffer(e17.DRAW_FRAMEBUFFER, u2.__webglFramebuffer);
          for (let n3 = 0; n3 < i3.length; n3++) {
            if (t3.resolveDepthBuffer && (t3.depthBuffer && (s3 |= e17.DEPTH_BUFFER_BIT), t3.stencilBuffer && t3.resolveStencilBuffer && (s3 |= e17.STENCIL_BUFFER_BIT)), d2) {
              e17.framebufferRenderbuffer(e17.READ_FRAMEBUFFER, e17.COLOR_ATTACHMENT0, e17.RENDERBUFFER, u2.__webglColorRenderbuffer[n3]);
              let t4 = r2.get(i3[n3]).__webglTexture;
              e17.framebufferTexture2D(e17.DRAW_FRAMEBUFFER, e17.COLOR_ATTACHMENT0, e17.TEXTURE_2D, t4, 0);
            }
            e17.blitFramebuffer(0, 0, a3, o3, 0, 0, a3, o3, s3, e17.NEAREST), c2 === true && (ye2.length = 0, be2.length = 0, ye2.push(e17.COLOR_ATTACHMENT0 + n3), t3.depthBuffer && t3.resolveDepthBuffer === false && (ye2.push(l2), be2.push(l2), e17.invalidateFramebuffer(e17.DRAW_FRAMEBUFFER, be2)), e17.invalidateFramebuffer(e17.READ_FRAMEBUFFER, ye2));
          }
          if (n2.bindFramebuffer(e17.READ_FRAMEBUFFER, null), n2.bindFramebuffer(e17.DRAW_FRAMEBUFFER, null), d2) for (let t4 = 0; t4 < i3.length; t4++) {
            n2.bindFramebuffer(e17.FRAMEBUFFER, u2.__webglMultisampledFramebuffer), e17.framebufferRenderbuffer(e17.FRAMEBUFFER, e17.COLOR_ATTACHMENT0 + t4, e17.RENDERBUFFER, u2.__webglColorRenderbuffer[t4]);
            let a4 = r2.get(i3[t4]).__webglTexture;
            n2.bindFramebuffer(e17.FRAMEBUFFER, u2.__webglFramebuffer), e17.framebufferTexture2D(e17.DRAW_FRAMEBUFFER, e17.COLOR_ATTACHMENT0 + t4, e17.TEXTURE_2D, a4, 0);
          }
          n2.bindFramebuffer(e17.DRAW_FRAMEBUFFER, u2.__webglMultisampledFramebuffer);
        } else if (t3.depthBuffer && t3.resolveDepthBuffer === false && c2) {
          let n3 = t3.stencilBuffer ? e17.DEPTH_STENCIL_ATTACHMENT : e17.DEPTH_ATTACHMENT;
          e17.invalidateFramebuffer(e17.DRAW_FRAMEBUFFER, [n3]);
        }
      }
    }
    function Se2(e18) {
      return Math.min(i2.maxSamples, e18.samples);
    }
    function Ce2(e18) {
      let n3 = r2.get(e18);
      return e18.samples > 0 && t2.has(`WEBGL_multisampled_render_to_texture`) === true && n3.__useRenderToTexture !== false;
    }
    function we2(e18) {
      let t3 = o2.render.frame;
      y2.get(e18) !== t3 && (y2.set(e18, t3), e18.update());
    }
    function Te2(e18, t3) {
      let n3 = e18.colorSpace, r3 = e18.format, i3 = e18.type;
      return e18.isCompressedTexture === true || e18.isVideoTexture === true || n3 !== `srgb-linear` && n3 !== `` && (K.getTransfer(n3) === `srgb` ? (r3 !== 1023 || i3 !== 1009) && console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`) : console.error(`THREE.WebGLTextures: Unsupported texture color space:`, n3)), t3;
    }
    function Ee2(e18) {
      return typeof HTMLImageElement < `u` && e18 instanceof HTMLImageElement ? (v2.width = e18.naturalWidth || e18.width, v2.height = e18.naturalHeight || e18.height) : typeof VideoFrame < `u` && e18 instanceof VideoFrame ? (v2.width = e18.displayWidth, v2.height = e18.displayHeight) : (v2.width = e18.width, v2.height = e18.height), v2;
    }
    this.allocateTextureUnit = ie2, this.resetTextureUnits = re2, this.setTexture2D = oe2, this.setTexture2DArray = se2, this.setTexture3D = F2, this.setTextureCube = ce2, this.rebindTextures = V2, this.setupRenderTarget = _e2, this.updateRenderTargetMipmap = ve2, this.updateMultisampleRenderTarget = xe2, this.setupDepthRenderbuffer = B2, this.setupFrameBufferTexture = R2, this.useMultisampledRTT = Ce2;
  }
  function qs(e17, t2) {
    function n2(n3, r2 = ``) {
      let i2, a2 = K.getTransfer(r2);
      if (n3 === 1009) return e17.UNSIGNED_BYTE;
      if (n3 === 1017) return e17.UNSIGNED_SHORT_4_4_4_4;
      if (n3 === 1018) return e17.UNSIGNED_SHORT_5_5_5_1;
      if (n3 === 35902) return e17.UNSIGNED_INT_5_9_9_9_REV;
      if (n3 === 35899) return e17.UNSIGNED_INT_10F_11F_11F_REV;
      if (n3 === 1010) return e17.BYTE;
      if (n3 === 1011) return e17.SHORT;
      if (n3 === 1012) return e17.UNSIGNED_SHORT;
      if (n3 === 1013) return e17.INT;
      if (n3 === 1014) return e17.UNSIGNED_INT;
      if (n3 === 1015) return e17.FLOAT;
      if (n3 === 1016) return e17.HALF_FLOAT;
      if (n3 === 1021) return e17.ALPHA;
      if (n3 === 1022) return e17.RGB;
      if (n3 === 1023) return e17.RGBA;
      if (n3 === 1026) return e17.DEPTH_COMPONENT;
      if (n3 === 1027) return e17.DEPTH_STENCIL;
      if (n3 === 1028) return e17.RED;
      if (n3 === 1029) return e17.RED_INTEGER;
      if (n3 === 1030) return e17.RG;
      if (n3 === 1031) return e17.RG_INTEGER;
      if (n3 === 1033) return e17.RGBA_INTEGER;
      if (n3 === 33776 || n3 === 33777 || n3 === 33778 || n3 === 33779) if (a2 === `srgb`) if (i2 = t2.get(`WEBGL_compressed_texture_s3tc_srgb`), i2 !== null) {
        if (n3 === 33776) return i2.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        if (n3 === 33777) return i2.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        if (n3 === 33778) return i2.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        if (n3 === 33779) return i2.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
      } else return null;
      else if (i2 = t2.get(`WEBGL_compressed_texture_s3tc`), i2 !== null) {
        if (n3 === 33776) return i2.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n3 === 33777) return i2.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n3 === 33778) return i2.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n3 === 33779) return i2.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
      if (n3 === 35840 || n3 === 35841 || n3 === 35842 || n3 === 35843) if (i2 = t2.get(`WEBGL_compressed_texture_pvrtc`), i2 !== null) {
        if (n3 === 35840) return i2.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n3 === 35841) return i2.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n3 === 35842) return i2.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n3 === 35843) return i2.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
      if (n3 === 36196 || n3 === 37492 || n3 === 37496) if (i2 = t2.get(`WEBGL_compressed_texture_etc`), i2 !== null) {
        if (n3 === 36196 || n3 === 37492) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ETC2 : i2.COMPRESSED_RGB8_ETC2;
        if (n3 === 37496) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i2.COMPRESSED_RGBA8_ETC2_EAC;
      } else return null;
      if (n3 === 37808 || n3 === 37809 || n3 === 37810 || n3 === 37811 || n3 === 37812 || n3 === 37813 || n3 === 37814 || n3 === 37815 || n3 === 37816 || n3 === 37817 || n3 === 37818 || n3 === 37819 || n3 === 37820 || n3 === 37821) if (i2 = t2.get(`WEBGL_compressed_texture_astc`), i2 !== null) {
        if (n3 === 37808) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i2.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n3 === 37809) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i2.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n3 === 37810) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i2.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n3 === 37811) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i2.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n3 === 37812) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i2.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n3 === 37813) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i2.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n3 === 37814) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i2.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n3 === 37815) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i2.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n3 === 37816) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i2.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n3 === 37817) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i2.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n3 === 37818) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i2.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n3 === 37819) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i2.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n3 === 37820) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i2.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n3 === 37821) return a2 === `srgb` ? i2.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i2.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
      if (n3 === 36492 || n3 === 36494 || n3 === 36495) if (i2 = t2.get(`EXT_texture_compression_bptc`), i2 !== null) {
        if (n3 === 36492) return a2 === `srgb` ? i2.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i2.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n3 === 36494) return i2.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n3 === 36495) return i2.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
      if (n3 === 36283 || n3 === 36284 || n3 === 36285 || n3 === 36286) if (i2 = t2.get(`EXT_texture_compression_rgtc`), i2 !== null) {
        if (n3 === 36283) return i2.COMPRESSED_RED_RGTC1_EXT;
        if (n3 === 36284) return i2.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n3 === 36285) return i2.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n3 === 36286) return i2.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
      return n3 === 1020 ? e17.UNSIGNED_INT_24_8 : e17[n3] === void 0 ? null : e17[n3];
    }
    return { convert: n2 };
  }
  var Js = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`;
  var Ys = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
  var Xs = class {
    constructor() {
      this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
    }
    init(e17, t2) {
      if (this.texture === null) {
        let n2 = new mi(e17.texture);
        (e17.depthNear !== t2.depthNear || e17.depthFar !== t2.depthFar) && (this.depthNear = e17.depthNear, this.depthFar = e17.depthFar), this.texture = n2;
      }
    }
    getMesh(e17) {
      if (this.texture !== null && this.mesh === null) {
        let t2 = e17.cameras[0].viewport, n2 = new Ir({ vertexShader: Js, fragmentShader: Ys, uniforms: { depthColor: { value: this.texture }, depthWidth: { value: t2.z }, depthHeight: { value: t2.w } } });
        this.mesh = new Tr(new hi(20, 20), n2);
      }
      return this.mesh;
    }
    reset() {
      this.texture = null, this.mesh = null;
    }
    getDepthTexture() {
      return this.texture;
    }
  };
  var Zs = class extends Ke {
    constructor(e17, t2) {
      super();
      let n2 = this, r2 = null, i2 = 1, a2 = null, o2 = `local-floor`, s2 = 1, c2 = null, l2 = null, u2 = null, d2 = null, f2 = null, p2 = null, m2 = typeof XRWebGLBinding < `u`, h2 = new Xs(), g2 = {}, _2 = t2.getContextAttributes(), y2 = null, b2 = null, x2 = [], S2 = [], w2 = new U(), T2 = null, E2 = new Vr();
      E2.viewport = new wt();
      let D2 = new Vr();
      D2.viewport = new wt();
      let k2 = [E2, D2], A3 = new Fi(), j3 = null, ee2 = null;
      this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(e18) {
        let t3 = x2[e18];
        return t3 === void 0 && (t3 = new Yr(), x2[e18] = t3), t3.getTargetRaySpace();
      }, this.getControllerGrip = function(e18) {
        let t3 = x2[e18];
        return t3 === void 0 && (t3 = new Yr(), x2[e18] = t3), t3.getGripSpace();
      }, this.getHand = function(e18) {
        let t3 = x2[e18];
        return t3 === void 0 && (t3 = new Yr(), x2[e18] = t3), t3.getHandSpace();
      };
      function P2(e18) {
        let t3 = S2.indexOf(e18.inputSource);
        if (t3 === -1) return;
        let n3 = x2[t3];
        n3 !== void 0 && (n3.update(e18.inputSource, e18.frame, c2 || a2), n3.dispatchEvent({ type: e18.type, data: e18.inputSource }));
      }
      function ne2() {
        r2.removeEventListener(`select`, P2), r2.removeEventListener(`selectstart`, P2), r2.removeEventListener(`selectend`, P2), r2.removeEventListener(`squeeze`, P2), r2.removeEventListener(`squeezestart`, P2), r2.removeEventListener(`squeezeend`, P2), r2.removeEventListener(`end`, ne2), r2.removeEventListener(`inputsourceschange`, re2);
        for (let e18 = 0; e18 < x2.length; e18++) {
          let t3 = S2[e18];
          t3 !== null && (S2[e18] = null, x2[e18].disconnect(t3));
        }
        j3 = null, ee2 = null, h2.reset();
        for (let e18 in g2) delete g2[e18];
        e17.setRenderTarget(y2), f2 = null, d2 = null, u2 = null, r2 = null, b2 = null, ue2.stop(), n2.isPresenting = false, e17.setPixelRatio(T2), e17.setSize(w2.width, w2.height, false), n2.dispatchEvent({ type: `sessionend` });
      }
      this.setFramebufferScaleFactor = function(e18) {
        i2 = e18, n2.isPresenting === true && console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`);
      }, this.setReferenceSpaceType = function(e18) {
        o2 = e18, n2.isPresenting === true && console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`);
      }, this.getReferenceSpace = function() {
        return c2 || a2;
      }, this.setReferenceSpace = function(e18) {
        c2 = e18;
      }, this.getBaseLayer = function() {
        return d2 === null ? f2 : d2;
      }, this.getBinding = function() {
        return u2 === null && m2 && (u2 = new XRWebGLBinding(r2, t2)), u2;
      }, this.getFrame = function() {
        return p2;
      }, this.getSession = function() {
        return r2;
      }, this.setSession = async function(l3) {
        if (r2 = l3, r2 !== null) {
          if (y2 = e17.getRenderTarget(), r2.addEventListener(`select`, P2), r2.addEventListener(`selectstart`, P2), r2.addEventListener(`selectend`, P2), r2.addEventListener(`squeeze`, P2), r2.addEventListener(`squeezestart`, P2), r2.addEventListener(`squeezeend`, P2), r2.addEventListener(`end`, ne2), r2.addEventListener(`inputsourceschange`, re2), _2.xrCompatible !== true && await t2.makeXRCompatible(), T2 = e17.getPixelRatio(), e17.getSize(w2), m2 && `createProjectionLayer` in XRWebGLBinding.prototype) {
            let n3 = null, a3 = null, o3 = null;
            _2.depth && (o3 = _2.stencil ? t2.DEPTH24_STENCIL8 : t2.DEPTH_COMPONENT24, n3 = _2.stencil ? N : M, a3 = _2.stencil ? O : C);
            let s3 = { colorFormat: t2.RGBA8, depthFormat: o3, scaleFactor: i2 };
            u2 = this.getBinding(), d2 = u2.createProjectionLayer(s3), r2.updateRenderState({ layers: [d2] }), e17.setPixelRatio(1), e17.setSize(d2.textureWidth, d2.textureHeight, false), b2 = new Et(d2.textureWidth, d2.textureHeight, { format: te, type: v, depthTexture: new pi(d2.textureWidth, d2.textureHeight, a3, void 0, void 0, void 0, void 0, void 0, void 0, n3), stencilBuffer: _2.stencil, colorSpace: e17.outputColorSpace, samples: _2.antialias ? 4 : 0, resolveDepthBuffer: d2.ignoreDepthValues === false, resolveStencilBuffer: d2.ignoreDepthValues === false });
          } else {
            let n3 = { antialias: _2.antialias, alpha: true, depth: _2.depth, stencil: _2.stencil, framebufferScaleFactor: i2 };
            f2 = new XRWebGLLayer(r2, t2, n3), r2.updateRenderState({ baseLayer: f2 }), e17.setPixelRatio(1), e17.setSize(f2.framebufferWidth, f2.framebufferHeight, false), b2 = new Et(f2.framebufferWidth, f2.framebufferHeight, { format: te, type: v, colorSpace: e17.outputColorSpace, stencilBuffer: _2.stencil, resolveDepthBuffer: f2.ignoreDepthValues === false, resolveStencilBuffer: f2.ignoreDepthValues === false });
          }
          b2.isXRRenderTarget = true, this.setFoveation(s2), c2 = null, a2 = await r2.requestReferenceSpace(o2), ue2.setContext(r2), ue2.start(), n2.isPresenting = true, n2.dispatchEvent({ type: `sessionstart` });
        }
      }, this.getEnvironmentBlendMode = function() {
        if (r2 !== null) return r2.environmentBlendMode;
      }, this.getDepthTexture = function() {
        return h2.getDepthTexture();
      };
      function re2(e18) {
        for (let t3 = 0; t3 < e18.removed.length; t3++) {
          let n3 = e18.removed[t3], r3 = S2.indexOf(n3);
          r3 >= 0 && (S2[r3] = null, x2[r3].disconnect(n3));
        }
        for (let t3 = 0; t3 < e18.added.length; t3++) {
          let n3 = e18.added[t3], r3 = S2.indexOf(n3);
          if (r3 === -1) {
            for (let e19 = 0; e19 < x2.length; e19++) if (e19 >= S2.length) {
              S2.push(n3), r3 = e19;
              break;
            } else if (S2[e19] === null) {
              S2[e19] = n3, r3 = e19;
              break;
            }
            if (r3 === -1) break;
          }
          let i3 = x2[r3];
          i3 && i3.connect(n3);
        }
      }
      let ie2 = new W(), ae2 = new W();
      function oe2(e18, t3, n3) {
        ie2.setFromMatrixPosition(t3.matrixWorld), ae2.setFromMatrixPosition(n3.matrixWorld);
        let r3 = ie2.distanceTo(ae2), i3 = t3.projectionMatrix.elements, a3 = n3.projectionMatrix.elements, o3 = i3[14] / (i3[10] - 1), s3 = i3[14] / (i3[10] + 1), c3 = (i3[9] + 1) / i3[5], l3 = (i3[9] - 1) / i3[5], u3 = (i3[8] - 1) / i3[0], d3 = (a3[8] + 1) / a3[0], f3 = o3 * u3, p3 = o3 * d3, m3 = r3 / (-u3 + d3), h3 = m3 * -u3;
        if (t3.matrixWorld.decompose(e18.position, e18.quaternion, e18.scale), e18.translateX(h3), e18.translateZ(m3), e18.matrixWorld.compose(e18.position, e18.quaternion, e18.scale), e18.matrixWorldInverse.copy(e18.matrixWorld).invert(), i3[10] === -1) e18.projectionMatrix.copy(t3.projectionMatrix), e18.projectionMatrixInverse.copy(t3.projectionMatrixInverse);
        else {
          let t4 = o3 + m3, n4 = s3 + m3, i4 = f3 - h3, a4 = p3 + (r3 - h3), u4 = c3 * s3 / n4 * t4, d4 = l3 * s3 / n4 * t4;
          e18.projectionMatrix.makePerspective(i4, a4, u4, d4, t4, n4), e18.projectionMatrixInverse.copy(e18.projectionMatrix).invert();
        }
      }
      function se2(e18, t3) {
        t3 === null ? e18.matrixWorld.copy(e18.matrix) : e18.matrixWorld.multiplyMatrices(t3.matrixWorld, e18.matrix), e18.matrixWorldInverse.copy(e18.matrixWorld).invert();
      }
      this.updateCamera = function(e18) {
        if (r2 === null) return;
        let t3 = e18.near, n3 = e18.far;
        h2.texture !== null && (h2.depthNear > 0 && (t3 = h2.depthNear), h2.depthFar > 0 && (n3 = h2.depthFar)), A3.near = D2.near = E2.near = t3, A3.far = D2.far = E2.far = n3, (j3 !== A3.near || ee2 !== A3.far) && (r2.updateRenderState({ depthNear: A3.near, depthFar: A3.far }), j3 = A3.near, ee2 = A3.far), A3.layers.mask = e18.layers.mask | 6, E2.layers.mask = A3.layers.mask & 3, D2.layers.mask = A3.layers.mask & 5;
        let i3 = e18.parent, a3 = A3.cameras;
        se2(A3, i3);
        for (let e19 = 0; e19 < a3.length; e19++) se2(a3[e19], i3);
        a3.length === 2 ? oe2(A3, E2, D2) : A3.projectionMatrix.copy(E2.projectionMatrix), F2(e18, A3, i3);
      };
      function F2(e18, t3, n3) {
        n3 === null ? e18.matrix.copy(t3.matrixWorld) : (e18.matrix.copy(n3.matrixWorld), e18.matrix.invert(), e18.matrix.multiply(t3.matrixWorld)), e18.matrix.decompose(e18.position, e18.quaternion, e18.scale), e18.updateMatrixWorld(true), e18.projectionMatrix.copy(t3.projectionMatrix), e18.projectionMatrixInverse.copy(t3.projectionMatrixInverse), e18.isPerspectiveCamera && (e18.fov = Ye * 2 * Math.atan(1 / e18.projectionMatrix.elements[5]), e18.zoom = 1);
      }
      this.getCamera = function() {
        return A3;
      }, this.getFoveation = function() {
        if (!(d2 === null && f2 === null)) return s2;
      }, this.setFoveation = function(e18) {
        s2 = e18, d2 !== null && (d2.fixedFoveation = e18), f2 !== null && f2.fixedFoveation !== void 0 && (f2.fixedFoveation = e18);
      }, this.hasDepthSensing = function() {
        return h2.texture !== null;
      }, this.getDepthSensingMesh = function() {
        return h2.getMesh(A3);
      }, this.getCameraTexture = function(e18) {
        return g2[e18];
      };
      let ce2 = null;
      function le2(t3, i3) {
        if (l2 = i3.getViewerPose(c2 || a2), p2 = i3, l2 !== null) {
          let t4 = l2.views;
          f2 !== null && (e17.setRenderTargetFramebuffer(b2, f2.framebuffer), e17.setRenderTarget(b2));
          let i4 = false;
          t4.length !== A3.cameras.length && (A3.cameras.length = 0, i4 = true);
          for (let n3 = 0; n3 < t4.length; n3++) {
            let r3 = t4[n3], a4 = null;
            if (f2 !== null) a4 = f2.getViewport(r3);
            else {
              let t5 = u2.getViewSubImage(d2, r3);
              a4 = t5.viewport, n3 === 0 && (e17.setRenderTargetTextures(b2, t5.colorTexture, t5.depthStencilTexture), e17.setRenderTarget(b2));
            }
            let o3 = k2[n3];
            o3 === void 0 && (o3 = new Vr(), o3.layers.enable(n3), o3.viewport = new wt(), k2[n3] = o3), o3.matrix.fromArray(r3.transform.matrix), o3.matrix.decompose(o3.position, o3.quaternion, o3.scale), o3.projectionMatrix.fromArray(r3.projectionMatrix), o3.projectionMatrixInverse.copy(o3.projectionMatrix).invert(), o3.viewport.set(a4.x, a4.y, a4.width, a4.height), n3 === 0 && (A3.matrix.copy(o3.matrix), A3.matrix.decompose(A3.position, A3.quaternion, A3.scale)), i4 === true && A3.cameras.push(o3);
          }
          let a3 = r2.enabledFeatures;
          if (a3 && a3.includes(`depth-sensing`) && r2.depthUsage == `gpu-optimized` && m2) {
            u2 = n2.getBinding();
            let e18 = u2.getDepthInformation(t4[0]);
            e18 && e18.isValid && e18.texture && h2.init(e18, r2.renderState);
          }
          if (a3 && a3.includes(`camera-access`) && m2) {
            e17.state.unbindTexture(), u2 = n2.getBinding();
            for (let e18 = 0; e18 < t4.length; e18++) {
              let n3 = t4[e18].camera;
              if (n3) {
                let e19 = g2[n3];
                e19 || (e19 = new mi(), g2[n3] = e19);
                let t5 = u2.getCameraImage(n3);
                e19.sourceTexture = t5;
              }
            }
          }
        }
        for (let e18 = 0; e18 < x2.length; e18++) {
          let t4 = S2[e18], n3 = x2[e18];
          t4 !== null && n3 !== void 0 && n3.update(t4, i3, c2 || a2);
        }
        ce2 && ce2(t3, i3), i3.detectedPlanes && n2.dispatchEvent({ type: `planesdetected`, data: i3 }), p2 = null;
      }
      let ue2 = new ea();
      ue2.setAnimationLoop(le2), this.setAnimationLoop = function(e18) {
        ce2 = e18;
      }, this.dispose = function() {
      };
    }
  };
  var Qs = new pn();
  var $s = new nn();
  function ec(e17, t2) {
    function n2(e18, t3) {
      e18.matrixAutoUpdate === true && e18.updateMatrix(), t3.value.copy(e18.matrix);
    }
    function r2(t3, n3) {
      n3.color.getRGB(t3.fogColor.value, Mr(e17)), n3.isFog ? (t3.fogNear.value = n3.near, t3.fogFar.value = n3.far) : n3.isFogExp2 && (t3.fogDensity.value = n3.density);
    }
    function i2(e18, t3, n3, r3, i3) {
      t3.isMeshBasicMaterial || t3.isMeshLambertMaterial ? a2(e18, t3) : t3.isMeshToonMaterial ? (a2(e18, t3), d2(e18, t3)) : t3.isMeshPhongMaterial ? (a2(e18, t3), u2(e18, t3)) : t3.isMeshStandardMaterial ? (a2(e18, t3), f2(e18, t3), t3.isMeshPhysicalMaterial && p2(e18, t3, i3)) : t3.isMeshMatcapMaterial ? (a2(e18, t3), m2(e18, t3)) : t3.isMeshDepthMaterial ? a2(e18, t3) : t3.isMeshDistanceMaterial ? (a2(e18, t3), h2(e18, t3)) : t3.isMeshNormalMaterial ? a2(e18, t3) : t3.isLineBasicMaterial ? (o2(e18, t3), t3.isLineDashedMaterial && s2(e18, t3)) : t3.isPointsMaterial ? c2(e18, t3, n3, r3) : t3.isSpriteMaterial ? l2(e18, t3) : t3.isShadowMaterial ? (e18.color.value.copy(t3.color), e18.opacity.value = t3.opacity) : t3.isShaderMaterial && (t3.uniformsNeedUpdate = false);
    }
    function a2(e18, r3) {
      e18.opacity.value = r3.opacity, r3.color && e18.diffuse.value.copy(r3.color), r3.emissive && e18.emissive.value.copy(r3.emissive).multiplyScalar(r3.emissiveIntensity), r3.map && (e18.map.value = r3.map, n2(r3.map, e18.mapTransform)), r3.alphaMap && (e18.alphaMap.value = r3.alphaMap, n2(r3.alphaMap, e18.alphaMapTransform)), r3.bumpMap && (e18.bumpMap.value = r3.bumpMap, n2(r3.bumpMap, e18.bumpMapTransform), e18.bumpScale.value = r3.bumpScale, r3.side === 1 && (e18.bumpScale.value *= -1)), r3.normalMap && (e18.normalMap.value = r3.normalMap, n2(r3.normalMap, e18.normalMapTransform), e18.normalScale.value.copy(r3.normalScale), r3.side === 1 && e18.normalScale.value.negate()), r3.displacementMap && (e18.displacementMap.value = r3.displacementMap, n2(r3.displacementMap, e18.displacementMapTransform), e18.displacementScale.value = r3.displacementScale, e18.displacementBias.value = r3.displacementBias), r3.emissiveMap && (e18.emissiveMap.value = r3.emissiveMap, n2(r3.emissiveMap, e18.emissiveMapTransform)), r3.specularMap && (e18.specularMap.value = r3.specularMap, n2(r3.specularMap, e18.specularMapTransform)), r3.alphaTest > 0 && (e18.alphaTest.value = r3.alphaTest);
      let i3 = t2.get(r3), a3 = i3.envMap, o3 = i3.envMapRotation;
      a3 && (e18.envMap.value = a3, Qs.copy(o3), Qs.x *= -1, Qs.y *= -1, Qs.z *= -1, a3.isCubeTexture && a3.isRenderTargetTexture === false && (Qs.y *= -1, Qs.z *= -1), e18.envMapRotation.value.setFromMatrix4($s.makeRotationFromEuler(Qs)), e18.flipEnvMap.value = a3.isCubeTexture && a3.isRenderTargetTexture === false ? -1 : 1, e18.reflectivity.value = r3.reflectivity, e18.ior.value = r3.ior, e18.refractionRatio.value = r3.refractionRatio), r3.lightMap && (e18.lightMap.value = r3.lightMap, e18.lightMapIntensity.value = r3.lightMapIntensity, n2(r3.lightMap, e18.lightMapTransform)), r3.aoMap && (e18.aoMap.value = r3.aoMap, e18.aoMapIntensity.value = r3.aoMapIntensity, n2(r3.aoMap, e18.aoMapTransform));
    }
    function o2(e18, t3) {
      e18.diffuse.value.copy(t3.color), e18.opacity.value = t3.opacity, t3.map && (e18.map.value = t3.map, n2(t3.map, e18.mapTransform));
    }
    function s2(e18, t3) {
      e18.dashSize.value = t3.dashSize, e18.totalSize.value = t3.dashSize + t3.gapSize, e18.scale.value = t3.scale;
    }
    function c2(e18, t3, r3, i3) {
      e18.diffuse.value.copy(t3.color), e18.opacity.value = t3.opacity, e18.size.value = t3.size * r3, e18.scale.value = i3 * 0.5, t3.map && (e18.map.value = t3.map, n2(t3.map, e18.uvTransform)), t3.alphaMap && (e18.alphaMap.value = t3.alphaMap, n2(t3.alphaMap, e18.alphaMapTransform)), t3.alphaTest > 0 && (e18.alphaTest.value = t3.alphaTest);
    }
    function l2(e18, t3) {
      e18.diffuse.value.copy(t3.color), e18.opacity.value = t3.opacity, e18.rotation.value = t3.rotation, t3.map && (e18.map.value = t3.map, n2(t3.map, e18.mapTransform)), t3.alphaMap && (e18.alphaMap.value = t3.alphaMap, n2(t3.alphaMap, e18.alphaMapTransform)), t3.alphaTest > 0 && (e18.alphaTest.value = t3.alphaTest);
    }
    function u2(e18, t3) {
      e18.specular.value.copy(t3.specular), e18.shininess.value = Math.max(t3.shininess, 1e-4);
    }
    function d2(e18, t3) {
      t3.gradientMap && (e18.gradientMap.value = t3.gradientMap);
    }
    function f2(e18, t3) {
      e18.metalness.value = t3.metalness, t3.metalnessMap && (e18.metalnessMap.value = t3.metalnessMap, n2(t3.metalnessMap, e18.metalnessMapTransform)), e18.roughness.value = t3.roughness, t3.roughnessMap && (e18.roughnessMap.value = t3.roughnessMap, n2(t3.roughnessMap, e18.roughnessMapTransform)), t3.envMap && (e18.envMapIntensity.value = t3.envMapIntensity);
    }
    function p2(e18, t3, r3) {
      e18.ior.value = t3.ior, t3.sheen > 0 && (e18.sheenColor.value.copy(t3.sheenColor).multiplyScalar(t3.sheen), e18.sheenRoughness.value = t3.sheenRoughness, t3.sheenColorMap && (e18.sheenColorMap.value = t3.sheenColorMap, n2(t3.sheenColorMap, e18.sheenColorMapTransform)), t3.sheenRoughnessMap && (e18.sheenRoughnessMap.value = t3.sheenRoughnessMap, n2(t3.sheenRoughnessMap, e18.sheenRoughnessMapTransform))), t3.clearcoat > 0 && (e18.clearcoat.value = t3.clearcoat, e18.clearcoatRoughness.value = t3.clearcoatRoughness, t3.clearcoatMap && (e18.clearcoatMap.value = t3.clearcoatMap, n2(t3.clearcoatMap, e18.clearcoatMapTransform)), t3.clearcoatRoughnessMap && (e18.clearcoatRoughnessMap.value = t3.clearcoatRoughnessMap, n2(t3.clearcoatRoughnessMap, e18.clearcoatRoughnessMapTransform)), t3.clearcoatNormalMap && (e18.clearcoatNormalMap.value = t3.clearcoatNormalMap, n2(t3.clearcoatNormalMap, e18.clearcoatNormalMapTransform), e18.clearcoatNormalScale.value.copy(t3.clearcoatNormalScale), t3.side === 1 && e18.clearcoatNormalScale.value.negate())), t3.dispersion > 0 && (e18.dispersion.value = t3.dispersion), t3.iridescence > 0 && (e18.iridescence.value = t3.iridescence, e18.iridescenceIOR.value = t3.iridescenceIOR, e18.iridescenceThicknessMinimum.value = t3.iridescenceThicknessRange[0], e18.iridescenceThicknessMaximum.value = t3.iridescenceThicknessRange[1], t3.iridescenceMap && (e18.iridescenceMap.value = t3.iridescenceMap, n2(t3.iridescenceMap, e18.iridescenceMapTransform)), t3.iridescenceThicknessMap && (e18.iridescenceThicknessMap.value = t3.iridescenceThicknessMap, n2(t3.iridescenceThicknessMap, e18.iridescenceThicknessMapTransform))), t3.transmission > 0 && (e18.transmission.value = t3.transmission, e18.transmissionSamplerMap.value = r3.texture, e18.transmissionSamplerSize.value.set(r3.width, r3.height), t3.transmissionMap && (e18.transmissionMap.value = t3.transmissionMap, n2(t3.transmissionMap, e18.transmissionMapTransform)), e18.thickness.value = t3.thickness, t3.thicknessMap && (e18.thicknessMap.value = t3.thicknessMap, n2(t3.thicknessMap, e18.thicknessMapTransform)), e18.attenuationDistance.value = t3.attenuationDistance, e18.attenuationColor.value.copy(t3.attenuationColor)), t3.anisotropy > 0 && (e18.anisotropyVector.value.set(t3.anisotropy * Math.cos(t3.anisotropyRotation), t3.anisotropy * Math.sin(t3.anisotropyRotation)), t3.anisotropyMap && (e18.anisotropyMap.value = t3.anisotropyMap, n2(t3.anisotropyMap, e18.anisotropyMapTransform))), e18.specularIntensity.value = t3.specularIntensity, e18.specularColor.value.copy(t3.specularColor), t3.specularColorMap && (e18.specularColorMap.value = t3.specularColorMap, n2(t3.specularColorMap, e18.specularColorMapTransform)), t3.specularIntensityMap && (e18.specularIntensityMap.value = t3.specularIntensityMap, n2(t3.specularIntensityMap, e18.specularIntensityMapTransform));
    }
    function m2(e18, t3) {
      t3.matcap && (e18.matcap.value = t3.matcap);
    }
    function h2(e18, n3) {
      let r3 = t2.get(n3).light;
      e18.referencePosition.value.setFromMatrixPosition(r3.matrixWorld), e18.nearDistance.value = r3.shadow.camera.near, e18.farDistance.value = r3.shadow.camera.far;
    }
    return { refreshFogUniforms: r2, refreshMaterialUniforms: i2 };
  }
  function tc(e17, t2, n2, r2) {
    let i2 = {}, a2 = {}, o2 = [], s2 = e17.getParameter(e17.MAX_UNIFORM_BUFFER_BINDINGS);
    function c2(e18, t3) {
      let n3 = t3.program;
      r2.uniformBlockBinding(e18, n3);
    }
    function l2(e18, n3) {
      let o3 = i2[e18.id];
      o3 === void 0 && (m2(e18), o3 = u2(e18), i2[e18.id] = o3, e18.addEventListener(`dispose`, g2));
      let s3 = n3.program;
      r2.updateUBOMapping(e18, s3);
      let c3 = t2.render.frame;
      a2[e18.id] !== c3 && (f2(e18), a2[e18.id] = c3);
    }
    function u2(t3) {
      let n3 = d2();
      t3.__bindingPointIndex = n3;
      let r3 = e17.createBuffer(), i3 = t3.__size, a3 = t3.usage;
      return e17.bindBuffer(e17.UNIFORM_BUFFER, r3), e17.bufferData(e17.UNIFORM_BUFFER, i3, a3), e17.bindBuffer(e17.UNIFORM_BUFFER, null), e17.bindBufferBase(e17.UNIFORM_BUFFER, n3, r3), r3;
    }
    function d2() {
      for (let e18 = 0; e18 < s2; e18++) if (o2.indexOf(e18) === -1) return o2.push(e18), e18;
      return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`), 0;
    }
    function f2(t3) {
      let n3 = i2[t3.id], r3 = t3.uniforms, a3 = t3.__cache;
      e17.bindBuffer(e17.UNIFORM_BUFFER, n3);
      for (let t4 = 0, n4 = r3.length; t4 < n4; t4++) {
        let n5 = Array.isArray(r3[t4]) ? r3[t4] : [r3[t4]];
        for (let r4 = 0, i3 = n5.length; r4 < i3; r4++) {
          let i4 = n5[r4];
          if (p2(i4, t4, r4, a3) === true) {
            let t5 = i4.__offset, n6 = Array.isArray(i4.value) ? i4.value : [i4.value], r5 = 0;
            for (let a4 = 0; a4 < n6.length; a4++) {
              let o3 = n6[a4], s3 = h2(o3);
              typeof o3 == `number` || typeof o3 == `boolean` ? (i4.__data[0] = o3, e17.bufferSubData(e17.UNIFORM_BUFFER, t5 + r5, i4.__data)) : o3.isMatrix3 ? (i4.__data[0] = o3.elements[0], i4.__data[1] = o3.elements[1], i4.__data[2] = o3.elements[2], i4.__data[3] = 0, i4.__data[4] = o3.elements[3], i4.__data[5] = o3.elements[4], i4.__data[6] = o3.elements[5], i4.__data[7] = 0, i4.__data[8] = o3.elements[6], i4.__data[9] = o3.elements[7], i4.__data[10] = o3.elements[8], i4.__data[11] = 0) : (o3.toArray(i4.__data, r5), r5 += s3.storage / Float32Array.BYTES_PER_ELEMENT);
            }
            e17.bufferSubData(e17.UNIFORM_BUFFER, t5, i4.__data);
          }
        }
      }
      e17.bindBuffer(e17.UNIFORM_BUFFER, null);
    }
    function p2(e18, t3, n3, r3) {
      let i3 = e18.value, a3 = t3 + `_` + n3;
      if (r3[a3] === void 0) return typeof i3 == `number` || typeof i3 == `boolean` ? r3[a3] = i3 : r3[a3] = i3.clone(), true;
      {
        let e19 = r3[a3];
        if (typeof i3 == `number` || typeof i3 == `boolean`) {
          if (e19 !== i3) return r3[a3] = i3, true;
        } else if (e19.equals(i3) === false) return e19.copy(i3), true;
      }
      return false;
    }
    function m2(e18) {
      let t3 = e18.uniforms, n3 = 0;
      for (let e19 = 0, r4 = t3.length; e19 < r4; e19++) {
        let r5 = Array.isArray(t3[e19]) ? t3[e19] : [t3[e19]];
        for (let e20 = 0, t4 = r5.length; e20 < t4; e20++) {
          let t5 = r5[e20], i3 = Array.isArray(t5.value) ? t5.value : [t5.value];
          for (let e21 = 0, r6 = i3.length; e21 < r6; e21++) {
            let r7 = i3[e21], a3 = h2(r7), o3 = n3 % 16, s3 = o3 % a3.boundary, c3 = o3 + s3;
            n3 += s3, c3 !== 0 && 16 - c3 < a3.storage && (n3 += 16 - c3), t5.__data = new Float32Array(a3.storage / Float32Array.BYTES_PER_ELEMENT), t5.__offset = n3, n3 += a3.storage;
          }
        }
      }
      let r3 = n3 % 16;
      return r3 > 0 && (n3 += 16 - r3), e18.__size = n3, e18.__cache = {}, this;
    }
    function h2(e18) {
      let t3 = { boundary: 0, storage: 0 };
      return typeof e18 == `number` || typeof e18 == `boolean` ? (t3.boundary = 4, t3.storage = 4) : e18.isVector2 ? (t3.boundary = 8, t3.storage = 8) : e18.isVector3 || e18.isColor ? (t3.boundary = 16, t3.storage = 12) : e18.isVector4 ? (t3.boundary = 16, t3.storage = 16) : e18.isMatrix3 ? (t3.boundary = 48, t3.storage = 48) : e18.isMatrix4 ? (t3.boundary = 64, t3.storage = 64) : e18.isTexture ? console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`) : console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`, e18), t3;
    }
    function g2(t3) {
      let n3 = t3.target;
      n3.removeEventListener(`dispose`, g2);
      let r3 = o2.indexOf(n3.__bindingPointIndex);
      o2.splice(r3, 1), e17.deleteBuffer(i2[n3.id]), delete i2[n3.id], delete a2[n3.id];
    }
    function _2() {
      for (let t3 in i2) e17.deleteBuffer(i2[t3]);
      o2 = [], i2 = {}, a2 = {};
    }
    return { bind: c2, update: l2, dispose: _2 };
  }
  var nc = class {
    constructor(e17 = {}) {
      let { canvas: t2 = st(), context: n2 = null, depth: r2 = true, stencil: i2 = false, alpha: a2 = false, antialias: o2 = false, premultipliedAlpha: s2 = true, preserveDrawingBuffer: c2 = false, powerPreference: l2 = `default`, failIfMajorPerformanceCaveat: u2 = false, reversedDepthBuffer: d2 = false } = e17;
      this.isWebGLRenderer = true;
      let f2;
      if (n2 !== null) {
        if (typeof WebGLRenderingContext < `u` && n2 instanceof WebGLRenderingContext) throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);
        f2 = n2.getContextAttributes().alpha;
      } else f2 = a2;
      let p2 = new Uint32Array(4), m2 = new Int32Array(4), h2 = null, g2 = null, y2 = [], b2 = [];
      this.domElement = t2, this.debug = { checkShaderErrors: true, onShaderError: null }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
      let x2 = this, S2 = false;
      this._outputColorSpace = ze;
      let C2 = 0, w2 = 0, E2 = null, D2 = -1, O2 = null, k2 = new wt(), A3 = new wt(), j3 = null, ee2 = new q(0), te2 = 0, M3 = t2.width, N3 = t2.height, P2 = 1, ne2 = null, re2 = null, ie2 = new wt(0, 0, M3, N3), ae2 = new wt(0, 0, M3, N3), oe2 = false, se2 = new ai(), F2 = false, ce2 = false, le2 = new nn(), ue2 = new W(), de2 = new wt(), fe2 = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: true }, pe2 = false;
      function me2() {
        return E2 === null ? P2 : 1;
      }
      let I2 = n2;
      function he2(e18, n3) {
        return t2.getContext(e18, n3);
      }
      try {
        let e18 = { alpha: true, depth: r2, stencil: i2, antialias: o2, premultipliedAlpha: s2, preserveDrawingBuffer: c2, powerPreference: l2, failIfMajorPerformanceCaveat: u2 };
        if (`setAttribute` in t2 && t2.setAttribute(`data-engine`, `three.js r180`), t2.addEventListener(`webglcontextlost`, Le2, false), t2.addEventListener(`webglcontextrestored`, Re2, false), t2.addEventListener(`webglcontextcreationerror`, Ve2, false), I2 === null) {
          let t3 = `webgl2`;
          if (I2 = he2(t3, e18), I2 === null) throw he2(t3) ? Error(`Error creating WebGL context with your selected attributes.`) : Error(`Error creating WebGL context.`);
        }
      } catch (e18) {
        throw console.error(`THREE.WebGLRenderer: ` + e18.message), e18;
      }
      let L2, R2, z2, ge2, B2, V2, _e2, ve2, ye2, be2, xe2, Se2, Ce2, we2, Te2, Ee2, De2, Oe2, ke2, Ae2, je2, Me2, Ne2, Pe2;
      function Fe2() {
        L2 = new Pa(I2), L2.init(), Me2 = new qs(I2, L2), R2 = new la(I2, L2, e17, Me2), z2 = new Gs(I2, L2), R2.reversedDepthBuffer && d2 && z2.buffers.depth.setReversed(true), ge2 = new La(I2), B2 = new ks(), V2 = new Ks(I2, L2, z2, B2, R2, Me2, ge2), _e2 = new da(x2), ve2 = new Na(x2), ye2 = new ta(I2), Ne2 = new sa(I2, ye2), be2 = new Fa(I2, ye2, ge2, Ne2), xe2 = new za(I2, be2, ye2, ge2), ke2 = new Ra(I2, R2, V2), Ee2 = new ua(B2), Se2 = new Os(x2, _e2, ve2, L2, R2, Ne2, Ee2), Ce2 = new ec(x2, B2), we2 = new Ns(), Te2 = new Bs(L2), Oe2 = new oa(x2, _e2, ve2, z2, xe2, f2, s2), De2 = new Us(x2, xe2, R2), Pe2 = new tc(I2, ge2, R2, z2), Ae2 = new ca(I2, L2, ge2), je2 = new Ia(I2, L2, ge2), ge2.programs = Se2.programs, x2.capabilities = R2, x2.extensions = L2, x2.properties = B2, x2.renderLists = we2, x2.shadowMap = De2, x2.state = z2, x2.info = ge2;
      }
      Fe2();
      let Ie2 = new Zs(x2, I2);
      this.xr = Ie2, this.getContext = function() {
        return I2;
      }, this.getContextAttributes = function() {
        return I2.getContextAttributes();
      }, this.forceContextLoss = function() {
        let e18 = L2.get(`WEBGL_lose_context`);
        e18 && e18.loseContext();
      }, this.forceContextRestore = function() {
        let e18 = L2.get(`WEBGL_lose_context`);
        e18 && e18.restoreContext();
      }, this.getPixelRatio = function() {
        return P2;
      }, this.setPixelRatio = function(e18) {
        e18 !== void 0 && (P2 = e18, this.setSize(M3, N3, false));
      }, this.getSize = function(e18) {
        return e18.set(M3, N3);
      }, this.setSize = function(e18, n3, r3 = true) {
        if (Ie2.isPresenting) {
          console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`);
          return;
        }
        M3 = e18, N3 = n3, t2.width = Math.floor(e18 * P2), t2.height = Math.floor(n3 * P2), r3 === true && (t2.style.width = e18 + `px`, t2.style.height = n3 + `px`), this.setViewport(0, 0, e18, n3);
      }, this.getDrawingBufferSize = function(e18) {
        return e18.set(M3 * P2, N3 * P2).floor();
      }, this.setDrawingBufferSize = function(e18, n3, r3) {
        M3 = e18, N3 = n3, P2 = r3, t2.width = Math.floor(e18 * r3), t2.height = Math.floor(n3 * r3), this.setViewport(0, 0, e18, n3);
      }, this.getCurrentViewport = function(e18) {
        return e18.copy(k2);
      }, this.getViewport = function(e18) {
        return e18.copy(ie2);
      }, this.setViewport = function(e18, t3, n3, r3) {
        e18.isVector4 ? ie2.set(e18.x, e18.y, e18.z, e18.w) : ie2.set(e18, t3, n3, r3), z2.viewport(k2.copy(ie2).multiplyScalar(P2).round());
      }, this.getScissor = function(e18) {
        return e18.copy(ae2);
      }, this.setScissor = function(e18, t3, n3, r3) {
        e18.isVector4 ? ae2.set(e18.x, e18.y, e18.z, e18.w) : ae2.set(e18, t3, n3, r3), z2.scissor(A3.copy(ae2).multiplyScalar(P2).round());
      }, this.getScissorTest = function() {
        return oe2;
      }, this.setScissorTest = function(e18) {
        z2.setScissorTest(oe2 = e18);
      }, this.setOpaqueSort = function(e18) {
        ne2 = e18;
      }, this.setTransparentSort = function(e18) {
        re2 = e18;
      }, this.getClearColor = function(e18) {
        return e18.copy(Oe2.getClearColor());
      }, this.setClearColor = function() {
        Oe2.setClearColor(...arguments);
      }, this.getClearAlpha = function() {
        return Oe2.getClearAlpha();
      }, this.setClearAlpha = function() {
        Oe2.setClearAlpha(...arguments);
      }, this.clear = function(e18 = true, t3 = true, n3 = true) {
        let r3 = 0;
        if (e18) {
          let e19 = false;
          if (E2 !== null) {
            let t4 = E2.texture.format;
            e19 = t4 === 1033 || t4 === 1031 || t4 === 1029;
          }
          if (e19) {
            let e20 = E2.texture.type, t4 = e20 === 1009 || e20 === 1014 || e20 === 1012 || e20 === 1020 || e20 === 1017 || e20 === 1018, n4 = Oe2.getClearColor(), r4 = Oe2.getClearAlpha(), i3 = n4.r, a3 = n4.g, o3 = n4.b;
            t4 ? (p2[0] = i3, p2[1] = a3, p2[2] = o3, p2[3] = r4, I2.clearBufferuiv(I2.COLOR, 0, p2)) : (m2[0] = i3, m2[1] = a3, m2[2] = o3, m2[3] = r4, I2.clearBufferiv(I2.COLOR, 0, m2));
          } else r3 |= I2.COLOR_BUFFER_BIT;
        }
        t3 && (r3 |= I2.DEPTH_BUFFER_BIT), n3 && (r3 |= I2.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), I2.clear(r3);
      }, this.clearColor = function() {
        this.clear(true, false, false);
      }, this.clearDepth = function() {
        this.clear(false, true, false);
      }, this.clearStencil = function() {
        this.clear(false, false, true);
      }, this.dispose = function() {
        t2.removeEventListener(`webglcontextlost`, Le2, false), t2.removeEventListener(`webglcontextrestored`, Re2, false), t2.removeEventListener(`webglcontextcreationerror`, Ve2, false), Oe2.dispose(), we2.dispose(), Te2.dispose(), B2.dispose(), _e2.dispose(), ve2.dispose(), xe2.dispose(), Ne2.dispose(), Pe2.dispose(), Se2.dispose(), Ie2.dispose(), Ie2.removeEventListener(`sessionstart`, Ye2), Ie2.removeEventListener(`sessionend`, Xe2), H2.stop();
      };
      function Le2(e18) {
        e18.preventDefault(), console.log(`THREE.WebGLRenderer: Context Lost.`), S2 = true;
      }
      function Re2() {
        console.log(`THREE.WebGLRenderer: Context Restored.`), S2 = false;
        let e18 = ge2.autoReset, t3 = De2.enabled, n3 = De2.autoUpdate, r3 = De2.needsUpdate, i3 = De2.type;
        Fe2(), ge2.autoReset = e18, De2.enabled = t3, De2.autoUpdate = n3, De2.needsUpdate = r3, De2.type = i3;
      }
      function Ve2(e18) {
        console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `, e18.statusMessage);
      }
      function He2(e18) {
        let t3 = e18.target;
        t3.removeEventListener(`dispose`, He2), Ue2(t3);
      }
      function Ue2(e18) {
        We2(e18), B2.remove(e18);
      }
      function We2(e18) {
        let t3 = B2.get(e18).programs;
        t3 !== void 0 && (t3.forEach(function(e19) {
          Se2.releaseProgram(e19);
        }), e18.isShaderMaterial && Se2.releaseShaderCache(e18));
      }
      this.renderBufferDirect = function(e18, t3, n3, r3, i3, a3) {
        t3 === null && (t3 = fe2);
        let o3 = i3.isMesh && i3.matrixWorld.determinant() < 0, s3 = G2(e18, t3, n3, r3, i3);
        z2.setMaterial(r3, o3);
        let c3 = n3.index, l3 = 1;
        if (r3.wireframe === true) {
          if (c3 = be2.getWireframeAttribute(n3), c3 === void 0) return;
          l3 = 2;
        }
        let u3 = n3.drawRange, d3 = n3.attributes.position, f3 = u3.start * l3, p3 = (u3.start + u3.count) * l3;
        a3 !== null && (f3 = Math.max(f3, a3.start * l3), p3 = Math.min(p3, (a3.start + a3.count) * l3)), c3 === null ? d3 != null && (f3 = Math.max(f3, 0), p3 = Math.min(p3, d3.count)) : (f3 = Math.max(f3, 0), p3 = Math.min(p3, c3.count));
        let m3 = p3 - f3;
        if (m3 < 0 || m3 === 1 / 0) return;
        Ne2.setup(i3, r3, s3, n3, c3);
        let h3, g3 = Ae2;
        if (c3 !== null && (h3 = ye2.get(c3), g3 = je2, g3.setIndex(h3)), i3.isMesh) r3.wireframe === true ? (z2.setLineWidth(r3.wireframeLinewidth * me2()), g3.setMode(I2.LINES)) : g3.setMode(I2.TRIANGLES);
        else if (i3.isLine) {
          let e19 = r3.linewidth;
          e19 === void 0 && (e19 = 1), z2.setLineWidth(e19 * me2()), i3.isLineSegments ? g3.setMode(I2.LINES) : i3.isLineLoop ? g3.setMode(I2.LINE_LOOP) : g3.setMode(I2.LINE_STRIP);
        } else i3.isPoints ? g3.setMode(I2.POINTS) : i3.isSprite && g3.setMode(I2.TRIANGLES);
        if (i3.isBatchedMesh) if (i3._multiDrawInstances !== null) lt(`THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection.`), g3.renderMultiDrawInstances(i3._multiDrawStarts, i3._multiDrawCounts, i3._multiDrawCount, i3._multiDrawInstances);
        else if (L2.get(`WEBGL_multi_draw`)) g3.renderMultiDraw(i3._multiDrawStarts, i3._multiDrawCounts, i3._multiDrawCount);
        else {
          let e19 = i3._multiDrawStarts, t4 = i3._multiDrawCounts, n4 = i3._multiDrawCount, a4 = c3 ? ye2.get(c3).bytesPerElement : 1, o4 = B2.get(r3).currentProgram.getUniforms();
          for (let r4 = 0; r4 < n4; r4++) o4.setValue(I2, `_gl_DrawID`, r4), g3.render(e19[r4] / a4, t4[r4]);
        }
        else if (i3.isInstancedMesh) g3.renderInstances(f3, m3, i3.count);
        else if (n3.isInstancedBufferGeometry) {
          let e19 = n3._maxInstanceCount === void 0 ? 1 / 0 : n3._maxInstanceCount, t4 = Math.min(n3.instanceCount, e19);
          g3.renderInstances(f3, m3, t4);
        } else g3.render(f3, m3);
      };
      function Ke2(e18, t3, n3) {
        e18.transparent === true && e18.side === 2 && e18.forceSinglePass === false ? (e18.side = 1, e18.needsUpdate = true, tt2(e18, t3, n3), e18.side = 0, e18.needsUpdate = true, tt2(e18, t3, n3), e18.side = 2) : tt2(e18, t3, n3);
      }
      this.compile = function(e18, t3, n3 = null) {
        n3 === null && (n3 = e18), g2 = Te2.get(n3), g2.init(t3), b2.push(g2), n3.traverseVisible(function(e19) {
          e19.isLight && e19.layers.test(t3.layers) && (g2.pushLight(e19), e19.castShadow && g2.pushShadow(e19));
        }), e18 !== n3 && e18.traverseVisible(function(e19) {
          e19.isLight && e19.layers.test(t3.layers) && (g2.pushLight(e19), e19.castShadow && g2.pushShadow(e19));
        }), g2.setupLights();
        let r3 = /* @__PURE__ */ new Set();
        return e18.traverse(function(e19) {
          if (!(e19.isMesh || e19.isPoints || e19.isLine || e19.isSprite)) return;
          let t4 = e19.material;
          if (t4) if (Array.isArray(t4)) for (let i3 = 0; i3 < t4.length; i3++) {
            let a3 = t4[i3];
            Ke2(a3, n3, e19), r3.add(a3);
          }
          else Ke2(t4, n3, e19), r3.add(t4);
        }), g2 = b2.pop(), r3;
      }, this.compileAsync = function(e18, t3, n3 = null) {
        let r3 = this.compile(e18, t3, n3);
        return new Promise((t4) => {
          function n4() {
            if (r3.forEach(function(e19) {
              B2.get(e19).currentProgram.isReady() && r3.delete(e19);
            }), r3.size === 0) {
              t4(e18);
              return;
            }
            setTimeout(n4, 10);
          }
          L2.get(`KHR_parallel_shader_compile`) === null ? setTimeout(n4, 10) : n4();
        });
      };
      let qe2 = null;
      function Je2(e18) {
        qe2 && qe2(e18);
      }
      function Ye2() {
        H2.stop();
      }
      function Xe2() {
        H2.start();
      }
      let H2 = new ea();
      H2.setAnimationLoop(Je2), typeof self < `u` && H2.setContext(self), this.setAnimationLoop = function(e18) {
        qe2 = e18, Ie2.setAnimationLoop(e18), e18 === null ? H2.stop() : H2.start();
      }, Ie2.addEventListener(`sessionstart`, Ye2), Ie2.addEventListener(`sessionend`, Xe2), this.render = function(e18, t3) {
        if (t3 !== void 0 && t3.isCamera !== true) {
          console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);
          return;
        }
        if (S2 === true) return;
        if (e18.matrixWorldAutoUpdate === true && e18.updateMatrixWorld(), t3.parent === null && t3.matrixWorldAutoUpdate === true && t3.updateMatrixWorld(), Ie2.enabled === true && Ie2.isPresenting === true && (Ie2.cameraAutoUpdate === true && Ie2.updateCamera(t3), t3 = Ie2.getCamera()), e18.isScene === true && e18.onBeforeRender(x2, e18, t3, E2), g2 = Te2.get(e18, b2.length), g2.init(t3), b2.push(g2), le2.multiplyMatrices(t3.projectionMatrix, t3.matrixWorldInverse), se2.setFromProjectionMatrix(le2, Ge, t3.reversedDepth), ce2 = this.localClippingEnabled, F2 = Ee2.init(this.clippingPlanes, ce2), h2 = we2.get(e18, y2.length), h2.init(), y2.push(h2), Ie2.enabled === true && Ie2.isPresenting === true) {
          let e19 = x2.xr.getDepthSensingMesh();
          e19 !== null && Ze2(e19, t3, -1 / 0, x2.sortObjects);
        }
        Ze2(e18, t3, 0, x2.sortObjects), h2.finish(), x2.sortObjects === true && h2.sort(ne2, re2), pe2 = Ie2.enabled === false || Ie2.isPresenting === false || Ie2.hasDepthSensing() === false, pe2 && Oe2.addToRenderList(h2, e18), this.info.render.frame++, F2 === true && Ee2.beginShadows();
        let n3 = g2.state.shadowsArray;
        De2.render(n3, e18, t3), F2 === true && Ee2.endShadows(), this.info.autoReset === true && this.info.reset();
        let r3 = h2.opaque, i3 = h2.transmissive;
        if (g2.setupLights(), t3.isArrayCamera) {
          let n4 = t3.cameras;
          if (i3.length > 0) for (let t4 = 0, a3 = n4.length; t4 < a3; t4++) {
            let a4 = n4[t4];
            $e2(r3, i3, e18, a4);
          }
          pe2 && Oe2.render(e18);
          for (let t4 = 0, r4 = n4.length; t4 < r4; t4++) {
            let r5 = n4[t4];
            Qe2(h2, e18, r5, r5.viewport);
          }
        } else i3.length > 0 && $e2(r3, i3, e18, t3), pe2 && Oe2.render(e18), Qe2(h2, e18, t3);
        E2 !== null && w2 === 0 && (V2.updateMultisampleRenderTarget(E2), V2.updateRenderTargetMipmap(E2)), e18.isScene === true && e18.onAfterRender(x2, e18, t3), Ne2.resetDefaultState(), D2 = -1, O2 = null, b2.pop(), b2.length > 0 ? (g2 = b2[b2.length - 1], F2 === true && Ee2.setGlobalState(x2.clippingPlanes, g2.state.camera)) : g2 = null, y2.pop(), h2 = y2.length > 0 ? y2[y2.length - 1] : null;
      };
      function Ze2(e18, t3, n3, r3) {
        if (e18.visible === false) return;
        if (e18.layers.test(t3.layers)) {
          if (e18.isGroup) n3 = e18.renderOrder;
          else if (e18.isLOD) e18.autoUpdate === true && e18.update(t3);
          else if (e18.isLight) g2.pushLight(e18), e18.castShadow && g2.pushShadow(e18);
          else if (e18.isSprite) {
            if (!e18.frustumCulled || se2.intersectsSprite(e18)) {
              r3 && de2.setFromMatrixPosition(e18.matrixWorld).applyMatrix4(le2);
              let t4 = xe2.update(e18), i4 = e18.material;
              i4.visible && h2.push(e18, t4, i4, n3, de2.z, null);
            }
          } else if ((e18.isMesh || e18.isLine || e18.isPoints) && (!e18.frustumCulled || se2.intersectsObject(e18))) {
            let t4 = xe2.update(e18), i4 = e18.material;
            if (r3 && (e18.boundingSphere === void 0 ? (t4.boundingSphere === null && t4.computeBoundingSphere(), de2.copy(t4.boundingSphere.center)) : (e18.boundingSphere === null && e18.computeBoundingSphere(), de2.copy(e18.boundingSphere.center)), de2.applyMatrix4(e18.matrixWorld).applyMatrix4(le2)), Array.isArray(i4)) {
              let r4 = t4.groups;
              for (let a3 = 0, o3 = r4.length; a3 < o3; a3++) {
                let o4 = r4[a3], s3 = i4[o4.materialIndex];
                s3 && s3.visible && h2.push(e18, t4, s3, n3, de2.z, o4);
              }
            } else i4.visible && h2.push(e18, t4, i4, n3, de2.z, null);
          }
        }
        let i3 = e18.children;
        for (let e19 = 0, a3 = i3.length; e19 < a3; e19++) Ze2(i3[e19], t3, n3, r3);
      }
      function Qe2(e18, t3, n3, r3) {
        let i3 = e18.opaque, a3 = e18.transmissive, o3 = e18.transparent;
        g2.setupLightsView(n3), F2 === true && Ee2.setGlobalState(x2.clippingPlanes, n3), r3 && z2.viewport(k2.copy(r3)), i3.length > 0 && et2(i3, t3, n3), a3.length > 0 && et2(a3, t3, n3), o3.length > 0 && et2(o3, t3, n3), z2.buffers.depth.setTest(true), z2.buffers.depth.setMask(true), z2.buffers.color.setMask(true), z2.setPolygonOffset(false);
      }
      function $e2(e18, t3, n3, r3) {
        if ((n3.isScene === true ? n3.overrideMaterial : null) !== null) return;
        g2.state.transmissionRenderTarget[r3.id] === void 0 && (g2.state.transmissionRenderTarget[r3.id] = new Et(1, 1, { generateMipmaps: true, type: L2.has(`EXT_color_buffer_half_float`) || L2.has(`EXT_color_buffer_float`) ? T : v, minFilter: _, samples: 4, stencilBuffer: i2, resolveDepthBuffer: false, resolveStencilBuffer: false, colorSpace: K.workingColorSpace }));
        let a3 = g2.state.transmissionRenderTarget[r3.id], o3 = r3.viewport || k2;
        a3.setSize(o3.z * x2.transmissionResolutionScale, o3.w * x2.transmissionResolutionScale);
        let s3 = x2.getRenderTarget(), c3 = x2.getActiveCubeFace(), l3 = x2.getActiveMipmapLevel();
        x2.setRenderTarget(a3), x2.getClearColor(ee2), te2 = x2.getClearAlpha(), te2 < 1 && x2.setClearColor(16777215, 0.5), x2.clear(), pe2 && Oe2.render(n3);
        let u3 = x2.toneMapping;
        x2.toneMapping = 0;
        let d3 = r3.viewport;
        if (r3.viewport !== void 0 && (r3.viewport = void 0), g2.setupLightsView(r3), F2 === true && Ee2.setGlobalState(x2.clippingPlanes, r3), et2(e18, n3, r3), V2.updateMultisampleRenderTarget(a3), V2.updateRenderTargetMipmap(a3), L2.has(`WEBGL_multisampled_render_to_texture`) === false) {
          let e19 = false;
          for (let i3 = 0, a4 = t3.length; i3 < a4; i3++) {
            let a5 = t3[i3], o4 = a5.object, s4 = a5.geometry, c4 = a5.material, l4 = a5.group;
            if (c4.side === 2 && o4.layers.test(r3.layers)) {
              let t4 = c4.side;
              c4.side = 1, c4.needsUpdate = true, U2(o4, n3, r3, s4, c4, l4), c4.side = t4, c4.needsUpdate = true, e19 = true;
            }
          }
          e19 === true && (V2.updateMultisampleRenderTarget(a3), V2.updateRenderTargetMipmap(a3));
        }
        x2.setRenderTarget(s3, c3, l3), x2.setClearColor(ee2, te2), d3 !== void 0 && (r3.viewport = d3), x2.toneMapping = u3;
      }
      function et2(e18, t3, n3) {
        let r3 = t3.isScene === true ? t3.overrideMaterial : null;
        for (let i3 = 0, a3 = e18.length; i3 < a3; i3++) {
          let a4 = e18[i3], o3 = a4.object, s3 = a4.geometry, c3 = a4.group, l3 = a4.material;
          l3.allowOverride === true && r3 !== null && (l3 = r3), o3.layers.test(n3.layers) && U2(o3, t3, n3, s3, l3, c3);
        }
      }
      function U2(e18, t3, n3, r3, i3, a3) {
        e18.onBeforeRender(x2, t3, n3, r3, i3, a3), e18.modelViewMatrix.multiplyMatrices(n3.matrixWorldInverse, e18.matrixWorld), e18.normalMatrix.getNormalMatrix(e18.modelViewMatrix), i3.onBeforeRender(x2, t3, n3, r3, e18, a3), i3.transparent === true && i3.side === 2 && i3.forceSinglePass === false ? (i3.side = 1, i3.needsUpdate = true, x2.renderBufferDirect(n3, t3, r3, i3, e18, a3), i3.side = 0, i3.needsUpdate = true, x2.renderBufferDirect(n3, t3, r3, i3, e18, a3), i3.side = 2) : x2.renderBufferDirect(n3, t3, r3, i3, e18, a3), e18.onAfterRender(x2, t3, n3, r3, i3, a3);
      }
      function tt2(e18, t3, n3) {
        t3.isScene !== true && (t3 = fe2);
        let r3 = B2.get(e18), i3 = g2.state.lights, a3 = g2.state.shadowsArray, o3 = i3.state.version, s3 = Se2.getParameters(e18, i3.state, a3, t3, n3), c3 = Se2.getProgramCacheKey(s3), l3 = r3.programs;
        r3.environment = e18.isMeshStandardMaterial ? t3.environment : null, r3.fog = t3.fog, r3.envMap = (e18.isMeshStandardMaterial ? ve2 : _e2).get(e18.envMap || r3.environment), r3.envMapRotation = r3.environment !== null && e18.envMap === null ? t3.environmentRotation : e18.envMapRotation, l3 === void 0 && (e18.addEventListener(`dispose`, He2), l3 = /* @__PURE__ */ new Map(), r3.programs = l3);
        let u3 = l3.get(c3);
        if (u3 !== void 0) {
          if (r3.currentProgram === u3 && r3.lightsStateVersion === o3) return rt2(e18, s3), u3;
        } else s3.uniforms = Se2.getUniforms(e18), e18.onBeforeCompile(s3, x2), u3 = Se2.acquireProgram(s3, c3), l3.set(c3, u3), r3.uniforms = s3.uniforms;
        let d3 = r3.uniforms;
        return (!e18.isShaderMaterial && !e18.isRawShaderMaterial || e18.clipping === true) && (d3.clippingPlanes = Ee2.uniform), rt2(e18, s3), r3.needsLights = at2(e18), r3.lightsStateVersion = o3, r3.needsLights && (d3.ambientLightColor.value = i3.state.ambient, d3.lightProbe.value = i3.state.probe, d3.directionalLights.value = i3.state.directional, d3.directionalLightShadows.value = i3.state.directionalShadow, d3.spotLights.value = i3.state.spot, d3.spotLightShadows.value = i3.state.spotShadow, d3.rectAreaLights.value = i3.state.rectArea, d3.ltc_1.value = i3.state.rectAreaLTC1, d3.ltc_2.value = i3.state.rectAreaLTC2, d3.pointLights.value = i3.state.point, d3.pointLightShadows.value = i3.state.pointShadow, d3.hemisphereLights.value = i3.state.hemi, d3.directionalShadowMap.value = i3.state.directionalShadowMap, d3.directionalShadowMatrix.value = i3.state.directionalShadowMatrix, d3.spotShadowMap.value = i3.state.spotShadowMap, d3.spotLightMatrix.value = i3.state.spotLightMatrix, d3.spotLightMap.value = i3.state.spotLightMap, d3.pointShadowMap.value = i3.state.pointShadowMap, d3.pointShadowMatrix.value = i3.state.pointShadowMatrix), r3.currentProgram = u3, r3.uniformsList = null, u3;
      }
      function nt2(e18) {
        if (e18.uniformsList === null) {
          let t3 = e18.currentProgram.getUniforms();
          e18.uniformsList = qo.seqWithValue(t3.seq, e18.uniforms);
        }
        return e18.uniformsList;
      }
      function rt2(e18, t3) {
        let n3 = B2.get(e18);
        n3.outputColorSpace = t3.outputColorSpace, n3.batching = t3.batching, n3.batchingColor = t3.batchingColor, n3.instancing = t3.instancing, n3.instancingColor = t3.instancingColor, n3.instancingMorph = t3.instancingMorph, n3.skinning = t3.skinning, n3.morphTargets = t3.morphTargets, n3.morphNormals = t3.morphNormals, n3.morphColors = t3.morphColors, n3.morphTargetsCount = t3.morphTargetsCount, n3.numClippingPlanes = t3.numClippingPlanes, n3.numIntersection = t3.numClipIntersection, n3.vertexAlphas = t3.vertexAlphas, n3.vertexTangents = t3.vertexTangents, n3.toneMapping = t3.toneMapping;
      }
      function G2(e18, t3, n3, r3, i3) {
        t3.isScene !== true && (t3 = fe2), V2.resetTextureUnits();
        let a3 = t3.fog, o3 = r3.isMeshStandardMaterial ? t3.environment : null, s3 = E2 === null ? x2.outputColorSpace : E2.isXRRenderTarget === true ? E2.texture.colorSpace : Be, c3 = (r3.isMeshStandardMaterial ? ve2 : _e2).get(r3.envMap || o3), l3 = r3.vertexColors === true && !!n3.attributes.color && n3.attributes.color.itemSize === 4, u3 = !!n3.attributes.tangent && (!!r3.normalMap || r3.anisotropy > 0), d3 = !!n3.morphAttributes.position, f3 = !!n3.morphAttributes.normal, p3 = !!n3.morphAttributes.color, m3 = 0;
        r3.toneMapped && (E2 === null || E2.isXRRenderTarget === true) && (m3 = x2.toneMapping);
        let h3 = n3.morphAttributes.position || n3.morphAttributes.normal || n3.morphAttributes.color, _2 = h3 === void 0 ? 0 : h3.length, v2 = B2.get(r3), y3 = g2.state.lights;
        if (F2 === true && (ce2 === true || e18 !== O2)) {
          let t4 = e18 === O2 && r3.id === D2;
          Ee2.setState(r3, e18, t4);
        }
        let b3 = false;
        r3.version === v2.__version ? v2.needsLights && v2.lightsStateVersion !== y3.state.version ? b3 = true : v2.outputColorSpace === s3 ? i3.isBatchedMesh && v2.batching === false || !i3.isBatchedMesh && v2.batching === true || i3.isBatchedMesh && v2.batchingColor === true && i3.colorTexture === null || i3.isBatchedMesh && v2.batchingColor === false && i3.colorTexture !== null || i3.isInstancedMesh && v2.instancing === false || !i3.isInstancedMesh && v2.instancing === true || i3.isSkinnedMesh && v2.skinning === false || !i3.isSkinnedMesh && v2.skinning === true || i3.isInstancedMesh && v2.instancingColor === true && i3.instanceColor === null || i3.isInstancedMesh && v2.instancingColor === false && i3.instanceColor !== null || i3.isInstancedMesh && v2.instancingMorph === true && i3.morphTexture === null || i3.isInstancedMesh && v2.instancingMorph === false && i3.morphTexture !== null ? b3 = true : v2.envMap === c3 ? r3.fog === true && v2.fog !== a3 || v2.numClippingPlanes !== void 0 && (v2.numClippingPlanes !== Ee2.numPlanes || v2.numIntersection !== Ee2.numIntersection) ? b3 = true : v2.vertexAlphas === l3 && v2.vertexTangents === u3 && v2.morphTargets === d3 && v2.morphNormals === f3 && v2.morphColors === p3 && v2.toneMapping === m3 ? v2.morphTargetsCount !== _2 && (b3 = true) : b3 = true : b3 = true : b3 = true : (b3 = true, v2.__version = r3.version);
        let S3 = v2.currentProgram;
        b3 === true && (S3 = tt2(r3, t3, i3));
        let C3 = false, w3 = false, T2 = false, k3 = S3.getUniforms(), A4 = v2.uniforms;
        if (z2.useProgram(S3.program) && (C3 = true, w3 = true, T2 = true), r3.id !== D2 && (D2 = r3.id, w3 = true), C3 || O2 !== e18) {
          z2.buffers.depth.getReversed() && e18.reversedDepth !== true && (e18._reversedDepth = true, e18.updateProjectionMatrix()), k3.setValue(I2, `projectionMatrix`, e18.projectionMatrix), k3.setValue(I2, `viewMatrix`, e18.matrixWorldInverse);
          let t4 = k3.map.cameraPosition;
          t4 !== void 0 && t4.setValue(I2, ue2.setFromMatrixPosition(e18.matrixWorld)), R2.logarithmicDepthBuffer && k3.setValue(I2, `logDepthBufFC`, 2 / (Math.log(e18.far + 1) / Math.LN2)), (r3.isMeshPhongMaterial || r3.isMeshToonMaterial || r3.isMeshLambertMaterial || r3.isMeshBasicMaterial || r3.isMeshStandardMaterial || r3.isShaderMaterial) && k3.setValue(I2, `isOrthographic`, e18.isOrthographicCamera === true), O2 !== e18 && (O2 = e18, w3 = true, T2 = true);
        }
        if (i3.isSkinnedMesh) {
          k3.setOptional(I2, i3, `bindMatrix`), k3.setOptional(I2, i3, `bindMatrixInverse`);
          let e19 = i3.skeleton;
          e19 && (e19.boneTexture === null && e19.computeBoneTexture(), k3.setValue(I2, `boneTexture`, e19.boneTexture, V2));
        }
        i3.isBatchedMesh && (k3.setOptional(I2, i3, `batchingTexture`), k3.setValue(I2, `batchingTexture`, i3._matricesTexture, V2), k3.setOptional(I2, i3, `batchingIdTexture`), k3.setValue(I2, `batchingIdTexture`, i3._indirectTexture, V2), k3.setOptional(I2, i3, `batchingColorTexture`), i3._colorsTexture !== null && k3.setValue(I2, `batchingColorTexture`, i3._colorsTexture, V2));
        let j4 = n3.morphAttributes;
        if ((j4.position !== void 0 || j4.normal !== void 0 || j4.color !== void 0) && ke2.update(i3, n3, S3), (w3 || v2.receiveShadow !== i3.receiveShadow) && (v2.receiveShadow = i3.receiveShadow, k3.setValue(I2, `receiveShadow`, i3.receiveShadow)), r3.isMeshGouraudMaterial && r3.envMap !== null && (A4.envMap.value = c3, A4.flipEnvMap.value = c3.isCubeTexture && c3.isRenderTargetTexture === false ? -1 : 1), r3.isMeshStandardMaterial && r3.envMap === null && t3.environment !== null && (A4.envMapIntensity.value = t3.environmentIntensity), w3 && (k3.setValue(I2, `toneMappingExposure`, x2.toneMappingExposure), v2.needsLights && it2(A4, T2), a3 && r3.fog === true && Ce2.refreshFogUniforms(A4, a3), Ce2.refreshMaterialUniforms(A4, r3, P2, N3, g2.state.transmissionRenderTarget[e18.id]), qo.upload(I2, nt2(v2), A4, V2)), r3.isShaderMaterial && r3.uniformsNeedUpdate === true && (qo.upload(I2, nt2(v2), A4, V2), r3.uniformsNeedUpdate = false), r3.isSpriteMaterial && k3.setValue(I2, `center`, i3.center), k3.setValue(I2, `modelViewMatrix`, i3.modelViewMatrix), k3.setValue(I2, `normalMatrix`, i3.normalMatrix), k3.setValue(I2, `modelMatrix`, i3.matrixWorld), r3.isShaderMaterial || r3.isRawShaderMaterial) {
          let e19 = r3.uniformsGroups;
          for (let t4 = 0, n4 = e19.length; t4 < n4; t4++) {
            let n5 = e19[t4];
            Pe2.update(n5, S3), Pe2.bind(n5, S3);
          }
        }
        return S3;
      }
      function it2(e18, t3) {
        e18.ambientLightColor.needsUpdate = t3, e18.lightProbe.needsUpdate = t3, e18.directionalLights.needsUpdate = t3, e18.directionalLightShadows.needsUpdate = t3, e18.pointLights.needsUpdate = t3, e18.pointLightShadows.needsUpdate = t3, e18.spotLights.needsUpdate = t3, e18.spotLightShadows.needsUpdate = t3, e18.rectAreaLights.needsUpdate = t3, e18.hemisphereLights.needsUpdate = t3;
      }
      function at2(e18) {
        return e18.isMeshLambertMaterial || e18.isMeshToonMaterial || e18.isMeshPhongMaterial || e18.isMeshStandardMaterial || e18.isShadowMaterial || e18.isShaderMaterial && e18.lights === true;
      }
      this.getActiveCubeFace = function() {
        return C2;
      }, this.getActiveMipmapLevel = function() {
        return w2;
      }, this.getRenderTarget = function() {
        return E2;
      }, this.setRenderTargetTextures = function(e18, t3, n3) {
        let r3 = B2.get(e18);
        r3.__autoAllocateDepthBuffer = e18.resolveDepthBuffer === false, r3.__autoAllocateDepthBuffer === false && (r3.__useRenderToTexture = false), B2.get(e18.texture).__webglTexture = t3, B2.get(e18.depthTexture).__webglTexture = r3.__autoAllocateDepthBuffer ? void 0 : n3, r3.__hasExternalTextures = true;
      }, this.setRenderTargetFramebuffer = function(e18, t3) {
        let n3 = B2.get(e18);
        n3.__webglFramebuffer = t3, n3.__useDefaultFramebuffer = t3 === void 0;
      };
      let ot2 = I2.createFramebuffer();
      this.setRenderTarget = function(e18, t3 = 0, n3 = 0) {
        E2 = e18, C2 = t3, w2 = n3;
        let r3 = true, i3 = null, a3 = false, o3 = false;
        if (e18) {
          let s3 = B2.get(e18);
          if (s3.__useDefaultFramebuffer !== void 0) z2.bindFramebuffer(I2.FRAMEBUFFER, null), r3 = false;
          else if (s3.__webglFramebuffer === void 0) V2.setupRenderTarget(e18);
          else if (s3.__hasExternalTextures) V2.rebindTextures(e18, B2.get(e18.texture).__webglTexture, B2.get(e18.depthTexture).__webglTexture);
          else if (e18.depthBuffer) {
            let t4 = e18.depthTexture;
            if (s3.__boundDepthTexture !== t4) {
              if (t4 !== null && B2.has(t4) && (e18.width !== t4.image.width || e18.height !== t4.image.height)) throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);
              V2.setupDepthRenderbuffer(e18);
            }
          }
          let c3 = e18.texture;
          (c3.isData3DTexture || c3.isDataArrayTexture || c3.isCompressedArrayTexture) && (o3 = true);
          let l3 = B2.get(e18).__webglFramebuffer;
          e18.isWebGLCubeRenderTarget ? (i3 = Array.isArray(l3[t3]) ? l3[t3][n3] : l3[t3], a3 = true) : i3 = e18.samples > 0 && V2.useMultisampledRTT(e18) === false ? B2.get(e18).__webglMultisampledFramebuffer : Array.isArray(l3) ? l3[n3] : l3, k2.copy(e18.viewport), A3.copy(e18.scissor), j3 = e18.scissorTest;
        } else k2.copy(ie2).multiplyScalar(P2).floor(), A3.copy(ae2).multiplyScalar(P2).floor(), j3 = oe2;
        if (n3 !== 0 && (i3 = ot2), z2.bindFramebuffer(I2.FRAMEBUFFER, i3) && r3 && z2.drawBuffers(e18, i3), z2.viewport(k2), z2.scissor(A3), z2.setScissorTest(j3), a3) {
          let r4 = B2.get(e18.texture);
          I2.framebufferTexture2D(I2.FRAMEBUFFER, I2.COLOR_ATTACHMENT0, I2.TEXTURE_CUBE_MAP_POSITIVE_X + t3, r4.__webglTexture, n3);
        } else if (o3) {
          let r4 = t3;
          for (let t4 = 0; t4 < e18.textures.length; t4++) {
            let i4 = B2.get(e18.textures[t4]);
            I2.framebufferTextureLayer(I2.FRAMEBUFFER, I2.COLOR_ATTACHMENT0 + t4, i4.__webglTexture, n3, r4);
          }
        } else if (e18 !== null && n3 !== 0) {
          let t4 = B2.get(e18.texture);
          I2.framebufferTexture2D(I2.FRAMEBUFFER, I2.COLOR_ATTACHMENT0, I2.TEXTURE_2D, t4.__webglTexture, n3);
        }
        D2 = -1;
      }, this.readRenderTargetPixels = function(e18, t3, n3, r3, i3, a3, o3, s3 = 0) {
        if (!(e18 && e18.isWebGLRenderTarget)) {
          console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);
          return;
        }
        let c3 = B2.get(e18).__webglFramebuffer;
        if (e18.isWebGLCubeRenderTarget && o3 !== void 0 && (c3 = c3[o3]), c3) {
          z2.bindFramebuffer(I2.FRAMEBUFFER, c3);
          try {
            let o4 = e18.textures[s3], c4 = o4.format, l3 = o4.type;
            if (!R2.textureFormatReadable(c4)) {
              console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);
              return;
            }
            if (!R2.textureTypeReadable(l3)) {
              console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);
              return;
            }
            t3 >= 0 && t3 <= e18.width - r3 && n3 >= 0 && n3 <= e18.height - i3 && (e18.textures.length > 1 && I2.readBuffer(I2.COLOR_ATTACHMENT0 + s3), I2.readPixels(t3, n3, r3, i3, Me2.convert(c4), Me2.convert(l3), a3));
          } finally {
            let e19 = E2 === null ? null : B2.get(E2).__webglFramebuffer;
            z2.bindFramebuffer(I2.FRAMEBUFFER, e19);
          }
        }
      }, this.readRenderTargetPixelsAsync = async function(e18, t3, n3, r3, i3, a3, o3, s3 = 0) {
        if (!(e18 && e18.isWebGLRenderTarget)) throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);
        let c3 = B2.get(e18).__webglFramebuffer;
        if (e18.isWebGLCubeRenderTarget && o3 !== void 0 && (c3 = c3[o3]), c3) if (t3 >= 0 && t3 <= e18.width - r3 && n3 >= 0 && n3 <= e18.height - i3) {
          z2.bindFramebuffer(I2.FRAMEBUFFER, c3);
          let o4 = e18.textures[s3], l3 = o4.format, u3 = o4.type;
          if (!R2.textureFormatReadable(l3)) throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);
          if (!R2.textureTypeReadable(u3)) throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);
          let d3 = I2.createBuffer();
          I2.bindBuffer(I2.PIXEL_PACK_BUFFER, d3), I2.bufferData(I2.PIXEL_PACK_BUFFER, a3.byteLength, I2.STREAM_READ), e18.textures.length > 1 && I2.readBuffer(I2.COLOR_ATTACHMENT0 + s3), I2.readPixels(t3, n3, r3, i3, Me2.convert(l3), Me2.convert(u3), 0);
          let f3 = E2 === null ? null : B2.get(E2).__webglFramebuffer;
          z2.bindFramebuffer(I2.FRAMEBUFFER, f3);
          let p3 = I2.fenceSync(I2.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return I2.flush(), await ut(I2, p3, 4), I2.bindBuffer(I2.PIXEL_PACK_BUFFER, d3), I2.getBufferSubData(I2.PIXEL_PACK_BUFFER, 0, a3), I2.deleteBuffer(d3), I2.deleteSync(p3), a3;
        } else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`);
      }, this.copyFramebufferToTexture = function(e18, t3 = null, n3 = 0) {
        let r3 = 2 ** -n3, i3 = Math.floor(e18.image.width * r3), a3 = Math.floor(e18.image.height * r3), o3 = t3 === null ? 0 : t3.x, s3 = t3 === null ? 0 : t3.y;
        V2.setTexture2D(e18, 0), I2.copyTexSubImage2D(I2.TEXTURE_2D, n3, 0, 0, o3, s3, i3, a3), z2.unbindTexture();
      };
      let ct2 = I2.createFramebuffer(), dt2 = I2.createFramebuffer();
      this.copyTextureToTexture = function(e18, t3, n3 = null, r3 = null, i3 = 0, a3 = null) {
        a3 === null && (i3 === 0 ? a3 = 0 : (lt(`WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels.`), a3 = i3, i3 = 0));
        let o3, s3, c3, l3, u3, d3, f3, p3, m3, h3 = e18.isCompressedTexture ? e18.mipmaps[a3] : e18.image;
        if (n3 !== null) o3 = n3.max.x - n3.min.x, s3 = n3.max.y - n3.min.y, c3 = n3.isBox3 ? n3.max.z - n3.min.z : 1, l3 = n3.min.x, u3 = n3.min.y, d3 = n3.isBox3 ? n3.min.z : 0;
        else {
          let t4 = 2 ** -i3;
          o3 = Math.floor(h3.width * t4), s3 = Math.floor(h3.height * t4), c3 = e18.isDataArrayTexture ? h3.depth : e18.isData3DTexture ? Math.floor(h3.depth * t4) : 1, l3 = 0, u3 = 0, d3 = 0;
        }
        r3 === null ? (f3 = 0, p3 = 0, m3 = 0) : (f3 = r3.x, p3 = r3.y, m3 = r3.z);
        let g3 = Me2.convert(t3.format), _2 = Me2.convert(t3.type), v2;
        t3.isData3DTexture ? (V2.setTexture3D(t3, 0), v2 = I2.TEXTURE_3D) : t3.isDataArrayTexture || t3.isCompressedArrayTexture ? (V2.setTexture2DArray(t3, 0), v2 = I2.TEXTURE_2D_ARRAY) : (V2.setTexture2D(t3, 0), v2 = I2.TEXTURE_2D), I2.pixelStorei(I2.UNPACK_FLIP_Y_WEBGL, t3.flipY), I2.pixelStorei(I2.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t3.premultiplyAlpha), I2.pixelStorei(I2.UNPACK_ALIGNMENT, t3.unpackAlignment);
        let y3 = I2.getParameter(I2.UNPACK_ROW_LENGTH), b3 = I2.getParameter(I2.UNPACK_IMAGE_HEIGHT), x3 = I2.getParameter(I2.UNPACK_SKIP_PIXELS), S3 = I2.getParameter(I2.UNPACK_SKIP_ROWS), C3 = I2.getParameter(I2.UNPACK_SKIP_IMAGES);
        I2.pixelStorei(I2.UNPACK_ROW_LENGTH, h3.width), I2.pixelStorei(I2.UNPACK_IMAGE_HEIGHT, h3.height), I2.pixelStorei(I2.UNPACK_SKIP_PIXELS, l3), I2.pixelStorei(I2.UNPACK_SKIP_ROWS, u3), I2.pixelStorei(I2.UNPACK_SKIP_IMAGES, d3);
        let w3 = e18.isDataArrayTexture || e18.isData3DTexture, T2 = t3.isDataArrayTexture || t3.isData3DTexture;
        if (e18.isDepthTexture) {
          let n4 = B2.get(e18), r4 = B2.get(t3), h4 = B2.get(n4.__renderTarget), g4 = B2.get(r4.__renderTarget);
          z2.bindFramebuffer(I2.READ_FRAMEBUFFER, h4.__webglFramebuffer), z2.bindFramebuffer(I2.DRAW_FRAMEBUFFER, g4.__webglFramebuffer);
          for (let n5 = 0; n5 < c3; n5++) w3 && (I2.framebufferTextureLayer(I2.READ_FRAMEBUFFER, I2.COLOR_ATTACHMENT0, B2.get(e18).__webglTexture, i3, d3 + n5), I2.framebufferTextureLayer(I2.DRAW_FRAMEBUFFER, I2.COLOR_ATTACHMENT0, B2.get(t3).__webglTexture, a3, m3 + n5)), I2.blitFramebuffer(l3, u3, o3, s3, f3, p3, o3, s3, I2.DEPTH_BUFFER_BIT, I2.NEAREST);
          z2.bindFramebuffer(I2.READ_FRAMEBUFFER, null), z2.bindFramebuffer(I2.DRAW_FRAMEBUFFER, null);
        } else if (i3 !== 0 || e18.isRenderTargetTexture || B2.has(e18)) {
          let n4 = B2.get(e18), r4 = B2.get(t3);
          z2.bindFramebuffer(I2.READ_FRAMEBUFFER, ct2), z2.bindFramebuffer(I2.DRAW_FRAMEBUFFER, dt2);
          for (let e19 = 0; e19 < c3; e19++) w3 ? I2.framebufferTextureLayer(I2.READ_FRAMEBUFFER, I2.COLOR_ATTACHMENT0, n4.__webglTexture, i3, d3 + e19) : I2.framebufferTexture2D(I2.READ_FRAMEBUFFER, I2.COLOR_ATTACHMENT0, I2.TEXTURE_2D, n4.__webglTexture, i3), T2 ? I2.framebufferTextureLayer(I2.DRAW_FRAMEBUFFER, I2.COLOR_ATTACHMENT0, r4.__webglTexture, a3, m3 + e19) : I2.framebufferTexture2D(I2.DRAW_FRAMEBUFFER, I2.COLOR_ATTACHMENT0, I2.TEXTURE_2D, r4.__webglTexture, a3), i3 === 0 ? T2 ? I2.copyTexSubImage3D(v2, a3, f3, p3, m3 + e19, l3, u3, o3, s3) : I2.copyTexSubImage2D(v2, a3, f3, p3, l3, u3, o3, s3) : I2.blitFramebuffer(l3, u3, o3, s3, f3, p3, o3, s3, I2.COLOR_BUFFER_BIT, I2.NEAREST);
          z2.bindFramebuffer(I2.READ_FRAMEBUFFER, null), z2.bindFramebuffer(I2.DRAW_FRAMEBUFFER, null);
        } else T2 ? e18.isDataTexture || e18.isData3DTexture ? I2.texSubImage3D(v2, a3, f3, p3, m3, o3, s3, c3, g3, _2, h3.data) : t3.isCompressedArrayTexture ? I2.compressedTexSubImage3D(v2, a3, f3, p3, m3, o3, s3, c3, g3, h3.data) : I2.texSubImage3D(v2, a3, f3, p3, m3, o3, s3, c3, g3, _2, h3) : e18.isDataTexture ? I2.texSubImage2D(I2.TEXTURE_2D, a3, f3, p3, o3, s3, g3, _2, h3.data) : e18.isCompressedTexture ? I2.compressedTexSubImage2D(I2.TEXTURE_2D, a3, f3, p3, h3.width, h3.height, g3, h3.data) : I2.texSubImage2D(I2.TEXTURE_2D, a3, f3, p3, o3, s3, g3, _2, h3);
        I2.pixelStorei(I2.UNPACK_ROW_LENGTH, y3), I2.pixelStorei(I2.UNPACK_IMAGE_HEIGHT, b3), I2.pixelStorei(I2.UNPACK_SKIP_PIXELS, x3), I2.pixelStorei(I2.UNPACK_SKIP_ROWS, S3), I2.pixelStorei(I2.UNPACK_SKIP_IMAGES, C3), a3 === 0 && t3.generateMipmaps && I2.generateMipmap(v2), z2.unbindTexture();
      }, this.initRenderTarget = function(e18) {
        B2.get(e18).__webglFramebuffer === void 0 && V2.setupRenderTarget(e18);
      }, this.initTexture = function(e18) {
        e18.isCubeTexture ? V2.setTextureCube(e18, 0) : e18.isData3DTexture ? V2.setTexture3D(e18, 0) : e18.isDataArrayTexture || e18.isCompressedArrayTexture ? V2.setTexture2DArray(e18, 0) : V2.setTexture2D(e18, 0), z2.unbindTexture();
      }, this.resetState = function() {
        C2 = 0, w2 = 0, E2 = null, z2.reset(), Ne2.reset();
      }, typeof __THREE_DEVTOOLS__ < `u` && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`, { detail: this }));
    }
    get coordinateSystem() {
      return Ge;
    }
    get outputColorSpace() {
      return this._outputColorSpace;
    }
    set outputColorSpace(e17) {
      this._outputColorSpace = e17;
      let t2 = this.getContext();
      t2.drawingBufferColorSpace = K._getDrawingBufferColorSpace(e17), t2.unpackColorSpace = K._getUnpackColorSpace();
    }
  };
  function rc(e17) {
    if (e17 && !(typeof window > `u`)) {
      var t2 = document.createElement(`style`);
      return t2.setAttribute(`type`, `text/css`), t2.innerHTML = e17, document.head.appendChild(t2), e17;
    }
  }
  function ic(e17, t2) {
    var n2 = e17.__state.conversionName.toString(), r2 = Math.round(e17.r), i2 = Math.round(e17.g), a2 = Math.round(e17.b), o2 = e17.a, s2 = Math.round(e17.h), c2 = e17.s.toFixed(1), l2 = e17.v.toFixed(1);
    if (t2 || n2 === `THREE_CHAR_HEX` || n2 === `SIX_CHAR_HEX`) {
      for (var u2 = e17.hex.toString(16); u2.length < 6; ) u2 = `0` + u2;
      return `#` + u2;
    } else if (n2 === `CSS_RGB`) return `rgb(` + r2 + `,` + i2 + `,` + a2 + `)`;
    else if (n2 === `CSS_RGBA`) return `rgba(` + r2 + `,` + i2 + `,` + a2 + `,` + o2 + `)`;
    else if (n2 === `HEX`) return `0x` + e17.hex.toString(16);
    else if (n2 === `RGB_ARRAY`) return `[` + r2 + `,` + i2 + `,` + a2 + `]`;
    else if (n2 === `RGBA_ARRAY`) return `[` + r2 + `,` + i2 + `,` + a2 + `,` + o2 + `]`;
    else if (n2 === `RGB_OBJ`) return `{r:` + r2 + `,g:` + i2 + `,b:` + a2 + `}`;
    else if (n2 === `RGBA_OBJ`) return `{r:` + r2 + `,g:` + i2 + `,b:` + a2 + `,a:` + o2 + `}`;
    else if (n2 === `HSV_OBJ`) return `{h:` + s2 + `,s:` + c2 + `,v:` + l2 + `}`;
    else if (n2 === `HSVA_OBJ`) return `{h:` + s2 + `,s:` + c2 + `,v:` + l2 + `,a:` + o2 + `}`;
    return `unknown format`;
  }
  var ac = Array.prototype.forEach;
  var oc = Array.prototype.slice;
  var Z = { BREAK: {}, extend: function(e17) {
    return this.each(oc.call(arguments, 1), function(t2) {
      (this.isObject(t2) ? Object.keys(t2) : []).forEach(function(n2) {
        this.isUndefined(t2[n2]) || (e17[n2] = t2[n2]);
      }.bind(this));
    }, this), e17;
  }, defaults: function(e17) {
    return this.each(oc.call(arguments, 1), function(t2) {
      (this.isObject(t2) ? Object.keys(t2) : []).forEach(function(n2) {
        this.isUndefined(e17[n2]) && (e17[n2] = t2[n2]);
      }.bind(this));
    }, this), e17;
  }, compose: function() {
    var e17 = oc.call(arguments);
    return function() {
      for (var t2 = oc.call(arguments), n2 = e17.length - 1; n2 >= 0; n2--) t2 = [e17[n2].apply(this, t2)];
      return t2[0];
    };
  }, each: function(e17, t2, n2) {
    if (e17) {
      if (ac && e17.forEach && e17.forEach === ac) e17.forEach(t2, n2);
      else if (e17.length === e17.length + 0) {
        var r2 = void 0, i2 = void 0;
        for (r2 = 0, i2 = e17.length; r2 < i2; r2++) if (r2 in e17 && t2.call(n2, e17[r2], r2) === this.BREAK) return;
      } else for (var a2 in e17) if (t2.call(n2, e17[a2], a2) === this.BREAK) return;
    }
  }, defer: function(e17) {
    setTimeout(e17, 0);
  }, debounce: function(e17, t2, n2) {
    var r2 = void 0;
    return function() {
      var i2 = this, a2 = arguments;
      function o2() {
        r2 = null, n2 || e17.apply(i2, a2);
      }
      var s2 = n2 || !r2;
      clearTimeout(r2), r2 = setTimeout(o2, t2), s2 && e17.apply(i2, a2);
    };
  }, toArray: function(e17) {
    return e17.toArray ? e17.toArray() : oc.call(e17);
  }, isUndefined: function(e17) {
    return e17 === void 0;
  }, isNull: function(e17) {
    return e17 === null;
  }, isNaN: (function(e17) {
    function t2(t3) {
      return e17.apply(this, arguments);
    }
    return t2.toString = function() {
      return e17.toString();
    }, t2;
  })(function(e17) {
    return isNaN(e17);
  }), isArray: Array.isArray || function(e17) {
    return e17.constructor === Array;
  }, isObject: function(e17) {
    return e17 === Object(e17);
  }, isNumber: function(e17) {
    return e17 === e17 + 0;
  }, isString: function(e17) {
    return e17 === e17 + ``;
  }, isBoolean: function(e17) {
    return e17 === false || e17 === true;
  }, isFunction: function(e17) {
    return e17 instanceof Function;
  } };
  var sc = [{ litmus: Z.isString, conversions: { THREE_CHAR_HEX: { read: function(e17) {
    var t2 = e17.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
    return t2 !== null && { space: `HEX`, hex: parseInt(`0x` + t2[1].toString() + t2[1].toString() + t2[2].toString() + t2[2].toString() + t2[3].toString() + t2[3].toString(), 0) };
  }, write: ic }, SIX_CHAR_HEX: { read: function(e17) {
    var t2 = e17.match(/^#([A-F0-9]{6})$/i);
    return t2 !== null && { space: `HEX`, hex: parseInt(`0x` + t2[1].toString(), 0) };
  }, write: ic }, CSS_RGB: { read: function(e17) {
    var t2 = e17.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
    return t2 !== null && { space: `RGB`, r: parseFloat(t2[1]), g: parseFloat(t2[2]), b: parseFloat(t2[3]) };
  }, write: ic }, CSS_RGBA: { read: function(e17) {
    var t2 = e17.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
    return t2 !== null && { space: `RGB`, r: parseFloat(t2[1]), g: parseFloat(t2[2]), b: parseFloat(t2[3]), a: parseFloat(t2[4]) };
  }, write: ic } } }, { litmus: Z.isNumber, conversions: { HEX: { read: function(e17) {
    return { space: `HEX`, hex: e17, conversionName: `HEX` };
  }, write: function(e17) {
    return e17.hex;
  } } } }, { litmus: Z.isArray, conversions: { RGB_ARRAY: { read: function(e17) {
    return e17.length === 3 && { space: `RGB`, r: e17[0], g: e17[1], b: e17[2] };
  }, write: function(e17) {
    return [e17.r, e17.g, e17.b];
  } }, RGBA_ARRAY: { read: function(e17) {
    return e17.length === 4 && { space: `RGB`, r: e17[0], g: e17[1], b: e17[2], a: e17[3] };
  }, write: function(e17) {
    return [e17.r, e17.g, e17.b, e17.a];
  } } } }, { litmus: Z.isObject, conversions: { RGBA_OBJ: { read: function(e17) {
    return Z.isNumber(e17.r) && Z.isNumber(e17.g) && Z.isNumber(e17.b) && Z.isNumber(e17.a) ? { space: `RGB`, r: e17.r, g: e17.g, b: e17.b, a: e17.a } : false;
  }, write: function(e17) {
    return { r: e17.r, g: e17.g, b: e17.b, a: e17.a };
  } }, RGB_OBJ: { read: function(e17) {
    return Z.isNumber(e17.r) && Z.isNumber(e17.g) && Z.isNumber(e17.b) ? { space: `RGB`, r: e17.r, g: e17.g, b: e17.b } : false;
  }, write: function(e17) {
    return { r: e17.r, g: e17.g, b: e17.b };
  } }, HSVA_OBJ: { read: function(e17) {
    return Z.isNumber(e17.h) && Z.isNumber(e17.s) && Z.isNumber(e17.v) && Z.isNumber(e17.a) ? { space: `HSV`, h: e17.h, s: e17.s, v: e17.v, a: e17.a } : false;
  }, write: function(e17) {
    return { h: e17.h, s: e17.s, v: e17.v, a: e17.a };
  } }, HSV_OBJ: { read: function(e17) {
    return Z.isNumber(e17.h) && Z.isNumber(e17.s) && Z.isNumber(e17.v) ? { space: `HSV`, h: e17.h, s: e17.s, v: e17.v } : false;
  }, write: function(e17) {
    return { h: e17.h, s: e17.s, v: e17.v };
  } } } }];
  var cc = void 0;
  var lc = void 0;
  var uc = function() {
    lc = false;
    var e17 = arguments.length > 1 ? Z.toArray(arguments) : arguments[0];
    return Z.each(sc, function(t2) {
      if (t2.litmus(e17)) return Z.each(t2.conversions, function(t3, n2) {
        if (cc = t3.read(e17), lc === false && cc !== false) return lc = cc, cc.conversionName = n2, cc.conversion = t3, Z.BREAK;
      }), Z.BREAK;
    }), lc;
  };
  var dc = void 0;
  var fc = { hsv_to_rgb: function(e17, t2, n2) {
    var r2 = Math.floor(e17 / 60) % 6, i2 = e17 / 60 - Math.floor(e17 / 60), a2 = n2 * (1 - t2), o2 = n2 * (1 - i2 * t2), s2 = n2 * (1 - (1 - i2) * t2), c2 = [[n2, s2, a2], [o2, n2, a2], [a2, n2, s2], [a2, o2, n2], [s2, a2, n2], [n2, a2, o2]][r2];
    return { r: c2[0] * 255, g: c2[1] * 255, b: c2[2] * 255 };
  }, rgb_to_hsv: function(e17, t2, n2) {
    var r2 = Math.min(e17, t2, n2), i2 = Math.max(e17, t2, n2), a2 = i2 - r2, o2 = void 0, s2 = void 0;
    if (i2 !== 0) s2 = a2 / i2;
    else return { h: NaN, s: 0, v: 0 };
    return o2 = e17 === i2 ? (t2 - n2) / a2 : t2 === i2 ? 2 + (n2 - e17) / a2 : 4 + (e17 - t2) / a2, o2 /= 6, o2 < 0 && (o2 += 1), { h: o2 * 360, s: s2, v: i2 / 255 };
  }, rgb_to_hex: function(e17, t2, n2) {
    var r2 = this.hex_with_component(0, 2, e17);
    return r2 = this.hex_with_component(r2, 1, t2), r2 = this.hex_with_component(r2, 0, n2), r2;
  }, component_from_hex: function(e17, t2) {
    return e17 >> t2 * 8 & 255;
  }, hex_with_component: function(e17, t2, n2) {
    return n2 << (dc = t2 * 8) | e17 & ~(255 << dc);
  } };
  var pc = typeof Symbol == `function` && typeof Symbol.iterator == `symbol` ? function(e17) {
    return typeof e17;
  } : function(e17) {
    return e17 && typeof Symbol == `function` && e17.constructor === Symbol && e17 !== Symbol.prototype ? `symbol` : typeof e17;
  };
  var mc = function(e17, t2) {
    if (!(e17 instanceof t2)) throw TypeError(`Cannot call a class as a function`);
  };
  var hc = /* @__PURE__ */ (function() {
    function e17(e18, t2) {
      for (var n2 = 0; n2 < t2.length; n2++) {
        var r2 = t2[n2];
        r2.enumerable = r2.enumerable || false, r2.configurable = true, `value` in r2 && (r2.writable = true), Object.defineProperty(e18, r2.key, r2);
      }
    }
    return function(t2, n2, r2) {
      return n2 && e17(t2.prototype, n2), r2 && e17(t2, r2), t2;
    };
  })();
  var gc = function e15(t2, n2, r2) {
    t2 === null && (t2 = Function.prototype);
    var i2 = Object.getOwnPropertyDescriptor(t2, n2);
    if (i2 === void 0) {
      var a2 = Object.getPrototypeOf(t2);
      return a2 === null ? void 0 : e15(a2, n2, r2);
    } else if (`value` in i2) return i2.value;
    else {
      var o2 = i2.get;
      return o2 === void 0 ? void 0 : o2.call(r2);
    }
  };
  var _c = function(e17, t2) {
    if (typeof t2 != `function` && t2 !== null) throw TypeError(`Super expression must either be null or a function, not ` + typeof t2);
    e17.prototype = Object.create(t2 && t2.prototype, { constructor: { value: e17, enumerable: false, writable: true, configurable: true } }), t2 && (Object.setPrototypeOf ? Object.setPrototypeOf(e17, t2) : e17.__proto__ = t2);
  };
  var vc = function(e17, t2) {
    if (!e17) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return t2 && (typeof t2 == `object` || typeof t2 == `function`) ? t2 : e17;
  };
  var yc = (function() {
    function e17() {
      if (mc(this, e17), this.__state = uc.apply(this, arguments), this.__state === false) throw Error(`Failed to interpret color arguments`);
      this.__state.a = this.__state.a || 1;
    }
    return hc(e17, [{ key: `toString`, value: function() {
      return ic(this);
    } }, { key: `toHexString`, value: function() {
      return ic(this, true);
    } }, { key: `toOriginal`, value: function() {
      return this.__state.conversion.write(this);
    } }]), e17;
  })();
  function bc(e17, t2, n2) {
    Object.defineProperty(e17, t2, { get: function() {
      return this.__state.space === `RGB` || yc.recalculateRGB(this, t2, n2), this.__state[t2];
    }, set: function(e18) {
      this.__state.space !== `RGB` && (yc.recalculateRGB(this, t2, n2), this.__state.space = `RGB`), this.__state[t2] = e18;
    } });
  }
  function xc(e17, t2) {
    Object.defineProperty(e17, t2, { get: function() {
      return this.__state.space === `HSV` || yc.recalculateHSV(this), this.__state[t2];
    }, set: function(e18) {
      this.__state.space !== `HSV` && (yc.recalculateHSV(this), this.__state.space = `HSV`), this.__state[t2] = e18;
    } });
  }
  yc.recalculateRGB = function(e17, t2, n2) {
    if (e17.__state.space === `HEX`) e17.__state[t2] = fc.component_from_hex(e17.__state.hex, n2);
    else if (e17.__state.space === `HSV`) Z.extend(e17.__state, fc.hsv_to_rgb(e17.__state.h, e17.__state.s, e17.__state.v));
    else throw Error(`Corrupted color state`);
  }, yc.recalculateHSV = function(e17) {
    var t2 = fc.rgb_to_hsv(e17.r, e17.g, e17.b);
    Z.extend(e17.__state, { s: t2.s, v: t2.v }), Z.isNaN(t2.h) ? Z.isUndefined(e17.__state.h) && (e17.__state.h = 0) : e17.__state.h = t2.h;
  }, yc.COMPONENTS = [`r`, `g`, `b`, `h`, `s`, `v`, `hex`, `a`], bc(yc.prototype, `r`, 2), bc(yc.prototype, `g`, 1), bc(yc.prototype, `b`, 0), xc(yc.prototype, `h`), xc(yc.prototype, `s`), xc(yc.prototype, `v`), Object.defineProperty(yc.prototype, "a", { get: function() {
    return this.__state.a;
  }, set: function(e17) {
    this.__state.a = e17;
  } }), Object.defineProperty(yc.prototype, "hex", { get: function() {
    return this.__state.space !== `HEX` && (this.__state.hex = fc.rgb_to_hex(this.r, this.g, this.b), this.__state.space = `HEX`), this.__state.hex;
  }, set: function(e17) {
    this.__state.space = `HEX`, this.__state.hex = e17;
  } });
  var Sc = (function() {
    function e17(t2, n2) {
      mc(this, e17), this.initialValue = t2[n2], this.domElement = document.createElement(`div`), this.object = t2, this.property = n2, this.__onChange = void 0, this.__onFinishChange = void 0;
    }
    return hc(e17, [{ key: `onChange`, value: function(e18) {
      return this.__onChange = e18, this;
    } }, { key: `onFinishChange`, value: function(e18) {
      return this.__onFinishChange = e18, this;
    } }, { key: `setValue`, value: function(e18) {
      return this.object[this.property] = e18, this.__onChange && this.__onChange.call(this, e18), this.updateDisplay(), this;
    } }, { key: `getValue`, value: function() {
      return this.object[this.property];
    } }, { key: `updateDisplay`, value: function() {
      return this;
    } }, { key: `isModified`, value: function() {
      return this.initialValue !== this.getValue();
    } }]), e17;
  })();
  var Cc = { HTMLEvents: [`change`], MouseEvents: [`click`, `mousemove`, `mousedown`, `mouseup`, `mouseover`], KeyboardEvents: [`keydown`] };
  var wc = {};
  Z.each(Cc, function(e17, t2) {
    Z.each(e17, function(e18) {
      wc[e18] = t2;
    });
  });
  var Tc = /(\d+(\.\d+)?)px/;
  function Ec(e17) {
    if (e17 === `0` || Z.isUndefined(e17)) return 0;
    var t2 = e17.match(Tc);
    return Z.isNull(t2) ? 0 : parseFloat(t2[1]);
  }
  var Q = { makeSelectable: function(e17, t2) {
    e17 === void 0 || e17.style === void 0 || (e17.onselectstart = t2 ? function() {
      return false;
    } : function() {
    }, e17.style.MozUserSelect = t2 ? `auto` : `none`, e17.style.KhtmlUserSelect = t2 ? `auto` : `none`, e17.unselectable = t2 ? `on` : `off`);
  }, makeFullscreen: function(e17, t2, n2) {
    var r2 = n2, i2 = t2;
    Z.isUndefined(i2) && (i2 = true), Z.isUndefined(r2) && (r2 = true), e17.style.position = `absolute`, i2 && (e17.style.left = 0, e17.style.right = 0), r2 && (e17.style.top = 0, e17.style.bottom = 0);
  }, fakeEvent: function(e17, t2, n2, r2) {
    var i2 = n2 || {}, a2 = wc[t2];
    if (!a2) throw Error(`Event type ` + t2 + ` not supported.`);
    var o2 = document.createEvent(a2);
    switch (a2) {
      case `MouseEvents`:
        var s2 = i2.x || i2.clientX || 0, c2 = i2.y || i2.clientY || 0;
        o2.initMouseEvent(t2, i2.bubbles || false, i2.cancelable || true, window, i2.clickCount || 1, 0, 0, s2, c2, false, false, false, false, 0, null);
        break;
      case `KeyboardEvents`:
        var l2 = o2.initKeyboardEvent || o2.initKeyEvent;
        Z.defaults(i2, { cancelable: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, keyCode: void 0, charCode: void 0 }), l2(t2, i2.bubbles || false, i2.cancelable, window, i2.ctrlKey, i2.altKey, i2.shiftKey, i2.metaKey, i2.keyCode, i2.charCode);
        break;
      default:
        o2.initEvent(t2, i2.bubbles || false, i2.cancelable || true);
        break;
    }
    Z.defaults(o2, r2), e17.dispatchEvent(o2);
  }, bind: function(e17, t2, n2, r2) {
    var i2 = r2 || false;
    return e17.addEventListener ? e17.addEventListener(t2, n2, i2) : e17.attachEvent && e17.attachEvent(`on` + t2, n2), Q;
  }, unbind: function(e17, t2, n2, r2) {
    var i2 = r2 || false;
    return e17.removeEventListener ? e17.removeEventListener(t2, n2, i2) : e17.detachEvent && e17.detachEvent(`on` + t2, n2), Q;
  }, addClass: function(e17, t2) {
    if (e17.className === void 0) e17.className = t2;
    else if (e17.className !== t2) {
      var n2 = e17.className.split(/ +/);
      n2.indexOf(t2) === -1 && (n2.push(t2), e17.className = n2.join(` `).replace(/^\s+/, ``).replace(/\s+$/, ``));
    }
    return Q;
  }, removeClass: function(e17, t2) {
    if (t2) if (e17.className === t2) e17.removeAttribute(`class`);
    else {
      var n2 = e17.className.split(/ +/), r2 = n2.indexOf(t2);
      r2 !== -1 && (n2.splice(r2, 1), e17.className = n2.join(` `));
    }
    else e17.className = void 0;
    return Q;
  }, hasClass: function(e17, t2) {
    return RegExp(`(?:^|\\s+)` + t2 + `(?:\\s+|$)`).test(e17.className) || false;
  }, getWidth: function(e17) {
    var t2 = getComputedStyle(e17);
    return Ec(t2[`border-left-width`]) + Ec(t2[`border-right-width`]) + Ec(t2[`padding-left`]) + Ec(t2[`padding-right`]) + Ec(t2.width);
  }, getHeight: function(e17) {
    var t2 = getComputedStyle(e17);
    return Ec(t2[`border-top-width`]) + Ec(t2[`border-bottom-width`]) + Ec(t2[`padding-top`]) + Ec(t2[`padding-bottom`]) + Ec(t2.height);
  }, getOffset: function(e17) {
    var t2 = e17, n2 = { left: 0, top: 0 };
    if (t2.offsetParent) do
      n2.left += t2.offsetLeft, n2.top += t2.offsetTop, t2 = t2.offsetParent;
    while (t2);
    return n2;
  }, isActive: function(e17) {
    return e17 === document.activeElement && (e17.type || e17.href);
  } };
  var Dc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2) {
      mc(this, t2);
      var r2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2)), i2 = r2;
      r2.__prev = r2.getValue(), r2.__checkbox = document.createElement(`input`), r2.__checkbox.setAttribute(`type`, `checkbox`);
      function a2() {
        i2.setValue(!i2.__prev);
      }
      return Q.bind(r2.__checkbox, `change`, a2, false), r2.domElement.appendChild(r2.__checkbox), r2.updateDisplay(), r2;
    }
    return hc(t2, [{ key: `setValue`, value: function(e18) {
      var n2 = gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `setValue`, this).call(this, e18);
      return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), n2;
    } }, { key: `updateDisplay`, value: function() {
      return this.getValue() === true ? (this.__checkbox.setAttribute(`checked`, `checked`), this.__checkbox.checked = true, this.__prev = true) : (this.__checkbox.checked = false, this.__prev = false), gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `updateDisplay`, this).call(this);
    } }]), t2;
  })(Sc);
  var Oc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2, r2) {
      mc(this, t2);
      var i2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2)), a2 = r2, o2 = i2;
      if (i2.__select = document.createElement(`select`), Z.isArray(a2)) {
        var s2 = {};
        Z.each(a2, function(e19) {
          s2[e19] = e19;
        }), a2 = s2;
      }
      return Z.each(a2, function(e19, t3) {
        var n3 = document.createElement(`option`);
        n3.innerHTML = t3, n3.setAttribute(`value`, e19), o2.__select.appendChild(n3);
      }), i2.updateDisplay(), Q.bind(i2.__select, `change`, function() {
        var e19 = this.options[this.selectedIndex].value;
        o2.setValue(e19);
      }), i2.domElement.appendChild(i2.__select), i2;
    }
    return hc(t2, [{ key: `setValue`, value: function(e18) {
      var n2 = gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `setValue`, this).call(this, e18);
      return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), n2;
    } }, { key: `updateDisplay`, value: function() {
      return Q.isActive(this.__select) ? this : (this.__select.value = this.getValue(), gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `updateDisplay`, this).call(this));
    } }]), t2;
  })(Sc);
  var kc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2) {
      mc(this, t2);
      var r2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2)), i2 = r2;
      function a2() {
        i2.setValue(i2.__input.value);
      }
      function o2() {
        i2.__onFinishChange && i2.__onFinishChange.call(i2, i2.getValue());
      }
      return r2.__input = document.createElement(`input`), r2.__input.setAttribute(`type`, `text`), Q.bind(r2.__input, `keyup`, a2), Q.bind(r2.__input, `change`, a2), Q.bind(r2.__input, `blur`, o2), Q.bind(r2.__input, `keydown`, function(e19) {
        e19.keyCode === 13 && this.blur();
      }), r2.updateDisplay(), r2.domElement.appendChild(r2.__input), r2;
    }
    return hc(t2, [{ key: `updateDisplay`, value: function() {
      return Q.isActive(this.__input) || (this.__input.value = this.getValue()), gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `updateDisplay`, this).call(this);
    } }]), t2;
  })(Sc);
  function Ac(e17) {
    var t2 = e17.toString();
    return t2.indexOf(`.`) > -1 ? t2.length - t2.indexOf(`.`) - 1 : 0;
  }
  var jc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2, r2) {
      mc(this, t2);
      var i2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2)), a2 = r2 || {};
      return i2.__min = a2.min, i2.__max = a2.max, i2.__step = a2.step, Z.isUndefined(i2.__step) ? i2.initialValue === 0 ? i2.__impliedStep = 1 : i2.__impliedStep = 10 ** Math.floor(Math.log(Math.abs(i2.initialValue)) / Math.LN10) / 10 : i2.__impliedStep = i2.__step, i2.__precision = Ac(i2.__impliedStep), i2;
    }
    return hc(t2, [{ key: `setValue`, value: function(e18) {
      var n2 = e18;
      return this.__min !== void 0 && n2 < this.__min ? n2 = this.__min : this.__max !== void 0 && n2 > this.__max && (n2 = this.__max), this.__step !== void 0 && n2 % this.__step !== 0 && (n2 = Math.round(n2 / this.__step) * this.__step), gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `setValue`, this).call(this, n2);
    } }, { key: `min`, value: function(e18) {
      return this.__min = e18, this;
    } }, { key: `max`, value: function(e18) {
      return this.__max = e18, this;
    } }, { key: `step`, value: function(e18) {
      return this.__step = e18, this.__impliedStep = e18, this.__precision = Ac(e18), this;
    } }]), t2;
  })(Sc);
  function Mc(e17, t2) {
    var n2 = 10 ** t2;
    return Math.round(e17 * n2) / n2;
  }
  var Nc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2, r2) {
      mc(this, t2);
      var i2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2, r2));
      i2.__truncationSuspended = false;
      var a2 = i2, o2 = void 0;
      function s2() {
        var e19 = parseFloat(a2.__input.value);
        Z.isNaN(e19) || a2.setValue(e19);
      }
      function c2() {
        a2.__onFinishChange && a2.__onFinishChange.call(a2, a2.getValue());
      }
      function l2() {
        c2();
      }
      function u2(e19) {
        var t3 = o2 - e19.clientY;
        a2.setValue(a2.getValue() + t3 * a2.__impliedStep), o2 = e19.clientY;
      }
      function d2() {
        Q.unbind(window, `mousemove`, u2), Q.unbind(window, `mouseup`, d2), c2();
      }
      function f2(e19) {
        Q.bind(window, `mousemove`, u2), Q.bind(window, `mouseup`, d2), o2 = e19.clientY;
      }
      return i2.__input = document.createElement(`input`), i2.__input.setAttribute(`type`, `text`), Q.bind(i2.__input, `change`, s2), Q.bind(i2.__input, `blur`, l2), Q.bind(i2.__input, `mousedown`, f2), Q.bind(i2.__input, `keydown`, function(e19) {
        e19.keyCode === 13 && (a2.__truncationSuspended = true, this.blur(), a2.__truncationSuspended = false, c2());
      }), i2.updateDisplay(), i2.domElement.appendChild(i2.__input), i2;
    }
    return hc(t2, [{ key: `updateDisplay`, value: function() {
      return this.__input.value = this.__truncationSuspended ? this.getValue() : Mc(this.getValue(), this.__precision), gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `updateDisplay`, this).call(this);
    } }]), t2;
  })(jc);
  function Pc(e17, t2, n2, r2, i2) {
    return r2 + (i2 - r2) * ((e17 - t2) / (n2 - t2));
  }
  var Fc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2, r2, i2, a2) {
      mc(this, t2);
      var o2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2, { min: r2, max: i2, step: a2 })), s2 = o2;
      o2.__background = document.createElement(`div`), o2.__foreground = document.createElement(`div`), Q.bind(o2.__background, `mousedown`, c2), Q.bind(o2.__background, `touchstart`, d2), Q.addClass(o2.__background, `slider`), Q.addClass(o2.__foreground, `slider-fg`);
      function c2(e19) {
        document.activeElement.blur(), Q.bind(window, `mousemove`, l2), Q.bind(window, `mouseup`, u2), l2(e19);
      }
      function l2(e19) {
        e19.preventDefault();
        var t3 = s2.__background.getBoundingClientRect();
        return s2.setValue(Pc(e19.clientX, t3.left, t3.right, s2.__min, s2.__max)), false;
      }
      function u2() {
        Q.unbind(window, `mousemove`, l2), Q.unbind(window, `mouseup`, u2), s2.__onFinishChange && s2.__onFinishChange.call(s2, s2.getValue());
      }
      function d2(e19) {
        e19.touches.length === 1 && (Q.bind(window, `touchmove`, f2), Q.bind(window, `touchend`, p2), f2(e19));
      }
      function f2(e19) {
        var t3 = e19.touches[0].clientX, n3 = s2.__background.getBoundingClientRect();
        s2.setValue(Pc(t3, n3.left, n3.right, s2.__min, s2.__max));
      }
      function p2() {
        Q.unbind(window, `touchmove`, f2), Q.unbind(window, `touchend`, p2), s2.__onFinishChange && s2.__onFinishChange.call(s2, s2.getValue());
      }
      return o2.updateDisplay(), o2.__background.appendChild(o2.__foreground), o2.domElement.appendChild(o2.__background), o2;
    }
    return hc(t2, [{ key: `updateDisplay`, value: function() {
      var e18 = (this.getValue() - this.__min) / (this.__max - this.__min);
      return this.__foreground.style.width = e18 * 100 + `%`, gc(t2.prototype.__proto__ || Object.getPrototypeOf(t2.prototype), `updateDisplay`, this).call(this);
    } }]), t2;
  })(jc);
  var Ic = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2, r2) {
      mc(this, t2);
      var i2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2)), a2 = i2;
      return i2.__button = document.createElement(`div`), i2.__button.innerHTML = r2 === void 0 ? `Fire` : r2, Q.bind(i2.__button, `click`, function(e19) {
        return e19.preventDefault(), a2.fire(), false;
      }), Q.addClass(i2.__button, `button`), i2.domElement.appendChild(i2.__button), i2;
    }
    return hc(t2, [{ key: `fire`, value: function() {
      this.__onChange && this.__onChange.call(this), this.getValue().call(this.object), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue());
    } }]), t2;
  })(Sc);
  var Lc = (function(e17) {
    _c(t2, e17);
    function t2(e18, n2) {
      mc(this, t2);
      var r2 = vc(this, (t2.__proto__ || Object.getPrototypeOf(t2)).call(this, e18, n2));
      r2.__color = new yc(r2.getValue()), r2.__temp = new yc(0);
      var i2 = r2;
      r2.domElement = document.createElement(`div`), Q.makeSelectable(r2.domElement, false), r2.__selector = document.createElement(`div`), r2.__selector.className = `selector`, r2.__saturation_field = document.createElement(`div`), r2.__saturation_field.className = `saturation-field`, r2.__field_knob = document.createElement(`div`), r2.__field_knob.className = `field-knob`, r2.__field_knob_border = `2px solid `, r2.__hue_knob = document.createElement(`div`), r2.__hue_knob.className = `hue-knob`, r2.__hue_field = document.createElement(`div`), r2.__hue_field.className = `hue-field`, r2.__input = document.createElement(`input`), r2.__input.type = `text`, r2.__input_textShadow = `0 1px 1px `, Q.bind(r2.__input, `keydown`, function(e19) {
        e19.keyCode === 13 && u2.call(this);
      }), Q.bind(r2.__input, `blur`, u2), Q.bind(r2.__selector, `mousedown`, function() {
        Q.addClass(this, `drag`).bind(window, `mouseup`, function() {
          Q.removeClass(i2.__selector, `drag`);
        });
      }), Q.bind(r2.__selector, `touchstart`, function() {
        Q.addClass(this, `drag`).bind(window, `touchend`, function() {
          Q.removeClass(i2.__selector, `drag`);
        });
      });
      var a2 = document.createElement(`div`);
      Z.extend(r2.__selector.style, { width: `122px`, height: `102px`, padding: `3px`, backgroundColor: `#222`, boxShadow: `0px 1px 3px rgba(0,0,0,0.3)` }), Z.extend(r2.__field_knob.style, { position: `absolute`, width: `12px`, height: `12px`, border: r2.__field_knob_border + (r2.__color.v < 0.5 ? `#fff` : `#000`), boxShadow: `0px 1px 3px rgba(0,0,0,0.5)`, borderRadius: `12px`, zIndex: 1 }), Z.extend(r2.__hue_knob.style, { position: `absolute`, width: `15px`, height: `2px`, borderRight: `4px solid #fff`, zIndex: 1 }), Z.extend(r2.__saturation_field.style, { width: `100px`, height: `100px`, border: `1px solid #555`, marginRight: `3px`, display: `inline-block`, cursor: `pointer` }), Z.extend(a2.style, { width: `100%`, height: `100%`, background: `none` }), zc(a2, `top`, `rgba(0,0,0,0)`, `#000`), Z.extend(r2.__hue_field.style, { width: `15px`, height: `100px`, border: `1px solid #555`, cursor: `ns-resize`, position: `absolute`, top: `3px`, right: `3px` }), Bc(r2.__hue_field), Z.extend(r2.__input.style, { outline: `none`, textAlign: `center`, color: `#fff`, border: 0, fontWeight: `bold`, textShadow: r2.__input_textShadow + `rgba(0,0,0,0.7)` }), Q.bind(r2.__saturation_field, `mousedown`, o2), Q.bind(r2.__saturation_field, `touchstart`, o2), Q.bind(r2.__field_knob, `mousedown`, o2), Q.bind(r2.__field_knob, `touchstart`, o2), Q.bind(r2.__hue_field, `mousedown`, s2), Q.bind(r2.__hue_field, `touchstart`, s2);
      function o2(e19) {
        f2(e19), Q.bind(window, `mousemove`, f2), Q.bind(window, `touchmove`, f2), Q.bind(window, `mouseup`, c2), Q.bind(window, `touchend`, c2);
      }
      function s2(e19) {
        p2(e19), Q.bind(window, `mousemove`, p2), Q.bind(window, `touchmove`, p2), Q.bind(window, `mouseup`, l2), Q.bind(window, `touchend`, l2);
      }
      function c2() {
        Q.unbind(window, `mousemove`, f2), Q.unbind(window, `touchmove`, f2), Q.unbind(window, `mouseup`, c2), Q.unbind(window, `touchend`, c2), d2();
      }
      function l2() {
        Q.unbind(window, `mousemove`, p2), Q.unbind(window, `touchmove`, p2), Q.unbind(window, `mouseup`, l2), Q.unbind(window, `touchend`, l2), d2();
      }
      function u2() {
        var e19 = uc(this.value);
        e19 === false ? this.value = i2.__color.toString() : (i2.__color.__state = e19, i2.setValue(i2.__color.toOriginal()));
      }
      function d2() {
        i2.__onFinishChange && i2.__onFinishChange.call(i2, i2.__color.toOriginal());
      }
      r2.__saturation_field.appendChild(a2), r2.__selector.appendChild(r2.__field_knob), r2.__selector.appendChild(r2.__saturation_field), r2.__selector.appendChild(r2.__hue_field), r2.__hue_field.appendChild(r2.__hue_knob), r2.domElement.appendChild(r2.__input), r2.domElement.appendChild(r2.__selector), r2.updateDisplay();
      function f2(e19) {
        e19.type.indexOf(`touch`) === -1 && e19.preventDefault();
        var t3 = i2.__saturation_field.getBoundingClientRect(), n3 = e19.touches && e19.touches[0] || e19, r3 = n3.clientX, a3 = n3.clientY, o3 = (r3 - t3.left) / (t3.right - t3.left), s3 = 1 - (a3 - t3.top) / (t3.bottom - t3.top);
        return s3 > 1 ? s3 = 1 : s3 < 0 && (s3 = 0), o3 > 1 ? o3 = 1 : o3 < 0 && (o3 = 0), i2.__color.v = s3, i2.__color.s = o3, i2.setValue(i2.__color.toOriginal()), false;
      }
      function p2(e19) {
        e19.type.indexOf(`touch`) === -1 && e19.preventDefault();
        var t3 = i2.__hue_field.getBoundingClientRect(), n3 = 1 - ((e19.touches && e19.touches[0] || e19).clientY - t3.top) / (t3.bottom - t3.top);
        return n3 > 1 ? n3 = 1 : n3 < 0 && (n3 = 0), i2.__color.h = n3 * 360, i2.setValue(i2.__color.toOriginal()), false;
      }
      return r2;
    }
    return hc(t2, [{ key: `updateDisplay`, value: function() {
      var e18 = uc(this.getValue());
      if (e18 !== false) {
        var t3 = false;
        Z.each(yc.COMPONENTS, function(n3) {
          if (!Z.isUndefined(e18[n3]) && !Z.isUndefined(this.__color.__state[n3]) && e18[n3] !== this.__color.__state[n3]) return t3 = true, {};
        }, this), t3 && Z.extend(this.__color.__state, e18);
      }
      Z.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
      var n2 = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0, r2 = 255 - n2;
      Z.extend(this.__field_knob.style, { marginLeft: 100 * this.__color.s - 7 + `px`, marginTop: 100 * (1 - this.__color.v) - 7 + `px`, backgroundColor: this.__temp.toHexString(), border: this.__field_knob_border + `rgb(` + n2 + `,` + n2 + `,` + n2 + `)` }), this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + `px`, this.__temp.s = 1, this.__temp.v = 1, zc(this.__saturation_field, `left`, `#fff`, this.__temp.toHexString()), this.__input.value = this.__color.toString(), Z.extend(this.__input.style, { backgroundColor: this.__color.toHexString(), color: `rgb(` + n2 + `,` + n2 + `,` + n2 + `)`, textShadow: this.__input_textShadow + `rgba(` + r2 + `,` + r2 + `,` + r2 + `,.7)` });
    } }]), t2;
  })(Sc);
  var Rc = [`-moz-`, `-o-`, `-webkit-`, `-ms-`, ``];
  function zc(e17, t2, n2, r2) {
    e17.style.background = ``, Z.each(Rc, function(i2) {
      e17.style.cssText += `background: ` + i2 + `linear-gradient(` + t2 + `, ` + n2 + ` 0%, ` + r2 + ` 100%); `;
    });
  }
  function Bc(e17) {
    e17.style.background = ``, e17.style.cssText += `background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);`, e17.style.cssText += `background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`, e17.style.cssText += `background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`, e17.style.cssText += `background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`, e17.style.cssText += `background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`;
  }
  var Vc = { load: function(e17, t2) {
    var n2 = t2 || document, r2 = n2.createElement(`link`);
    r2.type = `text/css`, r2.rel = `stylesheet`, r2.href = e17, n2.getElementsByTagName(`head`)[0].appendChild(r2);
  }, inject: function(e17, t2) {
    var n2 = t2 || document, r2 = document.createElement(`style`);
    r2.type = `text/css`, r2.innerHTML = e17;
    var i2 = n2.getElementsByTagName(`head`)[0];
    try {
      i2.appendChild(r2);
    } catch {
    }
  } };
  var Hc = `<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`;
  var Uc = function(e17, t2) {
    var n2 = e17[t2];
    return Z.isArray(arguments[2]) || Z.isObject(arguments[2]) ? new Oc(e17, t2, arguments[2]) : Z.isNumber(n2) ? Z.isNumber(arguments[2]) && Z.isNumber(arguments[3]) ? Z.isNumber(arguments[4]) ? new Fc(e17, t2, arguments[2], arguments[3], arguments[4]) : new Fc(e17, t2, arguments[2], arguments[3]) : Z.isNumber(arguments[4]) ? new Nc(e17, t2, { min: arguments[2], max: arguments[3], step: arguments[4] }) : new Nc(e17, t2, { min: arguments[2], max: arguments[3] }) : Z.isString(n2) ? new kc(e17, t2) : Z.isFunction(n2) ? new Ic(e17, t2, ``) : Z.isBoolean(n2) ? new Dc(e17, t2) : null;
  };
  function Wc(e17) {
    setTimeout(e17, 1e3 / 60);
  }
  var Gc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Wc;
  var Kc = (function() {
    function e17() {
      mc(this, e17), this.backgroundElement = document.createElement(`div`), Z.extend(this.backgroundElement.style, { backgroundColor: `rgba(0,0,0,0.8)`, top: 0, left: 0, display: `none`, zIndex: `1000`, opacity: 0, WebkitTransition: `opacity 0.2s linear`, transition: `opacity 0.2s linear` }), Q.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = `fixed`, this.domElement = document.createElement(`div`), Z.extend(this.domElement.style, { position: `fixed`, display: `none`, zIndex: `1001`, opacity: 0, WebkitTransition: `-webkit-transform 0.2s ease-out, opacity 0.2s linear`, transition: `transform 0.2s ease-out, opacity 0.2s linear` }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
      var t2 = this;
      Q.bind(this.backgroundElement, `click`, function() {
        t2.hide();
      });
    }
    return hc(e17, [{ key: `show`, value: function() {
      var e18 = this;
      this.backgroundElement.style.display = `block`, this.domElement.style.display = `block`, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = `scale(1.1)`, this.layout(), Z.defer(function() {
        e18.backgroundElement.style.opacity = 1, e18.domElement.style.opacity = 1, e18.domElement.style.webkitTransform = `scale(1)`;
      });
    } }, { key: `hide`, value: function() {
      var e18 = this, t2 = function t3() {
        e18.domElement.style.display = `none`, e18.backgroundElement.style.display = `none`, Q.unbind(e18.domElement, `webkitTransitionEnd`, t3), Q.unbind(e18.domElement, `transitionend`, t3), Q.unbind(e18.domElement, `oTransitionEnd`, t3);
      };
      Q.bind(this.domElement, `webkitTransitionEnd`, t2), Q.bind(this.domElement, `transitionend`, t2), Q.bind(this.domElement, `oTransitionEnd`, t2), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = `scale(1.1)`;
    } }, { key: `layout`, value: function() {
      this.domElement.style.left = window.innerWidth / 2 - Q.getWidth(this.domElement) / 2 + `px`, this.domElement.style.top = window.innerHeight / 2 - Q.getHeight(this.domElement) / 2 + `px`;
    } }]), e17;
  })();
  var qc = rc(`.dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}
`);
  Vc.inject(qc);
  var Jc = `dg`;
  var Yc = 72;
  var Xc = 20;
  var Zc = `Default`;
  var Qc = (function() {
    try {
      return !!window.localStorage;
    } catch {
      return false;
    }
  })();
  var $c = void 0;
  var el = true;
  var tl = void 0;
  var nl = false;
  var rl = [];
  var $ = function e16(t2) {
    var n2 = this, r2 = t2 || {};
    this.domElement = document.createElement(`div`), this.__ul = document.createElement(`ul`), this.domElement.appendChild(this.__ul), Q.addClass(this.domElement, Jc), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], r2 = Z.defaults(r2, { closeOnTop: false, autoPlace: true, width: e16.DEFAULT_WIDTH }), r2 = Z.defaults(r2, { resizable: r2.autoPlace, hideable: r2.autoPlace }), Z.isUndefined(r2.load) ? r2.load = { preset: Zc } : r2.preset && (r2.load.preset = r2.preset), Z.isUndefined(r2.parent) && r2.hideable && rl.push(this), r2.resizable = Z.isUndefined(r2.parent) && r2.resizable, r2.autoPlace && Z.isUndefined(r2.scrollable) && (r2.scrollable = true);
    var i2 = Qc && localStorage.getItem(ul(this, `isLocal`)) === `true`, a2 = void 0, o2 = void 0;
    if (Object.defineProperties(this, { parent: { get: function() {
      return r2.parent;
    } }, scrollable: { get: function() {
      return r2.scrollable;
    } }, autoPlace: { get: function() {
      return r2.autoPlace;
    } }, closeOnTop: { get: function() {
      return r2.closeOnTop;
    } }, preset: { get: function() {
      return n2.parent ? n2.getRoot().preset : r2.load.preset;
    }, set: function(e17) {
      n2.parent ? n2.getRoot().preset = e17 : r2.load.preset = e17, _l(this), n2.revert();
    } }, width: { get: function() {
      return r2.width;
    }, set: function(e17) {
      r2.width = e17, hl(n2, e17);
    } }, name: { get: function() {
      return r2.name;
    }, set: function(e17) {
      r2.name = e17, o2 && (o2.innerHTML = r2.name);
    } }, closed: { get: function() {
      return r2.closed;
    }, set: function(t3) {
      r2.closed = t3, r2.closed ? Q.addClass(n2.__ul, e16.CLASS_CLOSED) : Q.removeClass(n2.__ul, e16.CLASS_CLOSED), this.onResize(), n2.__closeButton && (n2.__closeButton.innerHTML = t3 ? e16.TEXT_OPEN : e16.TEXT_CLOSED);
    } }, load: { get: function() {
      return r2.load;
    } }, useLocalStorage: { get: function() {
      return i2;
    }, set: function(e17) {
      Qc && (i2 = e17, e17 ? Q.bind(window, `unload`, a2) : Q.unbind(window, `unload`, a2), localStorage.setItem(ul(n2, `isLocal`), e17));
    } } }), Z.isUndefined(r2.parent)) {
      if (this.closed = r2.closed || false, Q.addClass(this.domElement, e16.CLASS_MAIN), Q.makeSelectable(this.domElement, false), Qc && i2) {
        n2.useLocalStorage = true;
        var s2 = localStorage.getItem(ul(this, `gui`));
        s2 && (r2.load = JSON.parse(s2));
      }
      this.__closeButton = document.createElement(`div`), this.__closeButton.innerHTML = e16.TEXT_CLOSED, Q.addClass(this.__closeButton, e16.CLASS_CLOSE_BUTTON), r2.closeOnTop ? (Q.addClass(this.__closeButton, e16.CLASS_CLOSE_TOP), this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0])) : (Q.addClass(this.__closeButton, e16.CLASS_CLOSE_BOTTOM), this.domElement.appendChild(this.__closeButton)), Q.bind(this.__closeButton, `click`, function() {
        n2.closed = !n2.closed;
      });
    } else {
      r2.closed === void 0 && (r2.closed = true);
      var c2 = document.createTextNode(r2.name);
      Q.addClass(c2, `controller-name`), o2 = il(n2, c2), Q.addClass(this.__ul, e16.CLASS_CLOSED), Q.addClass(o2, `title`), Q.bind(o2, `click`, function(e17) {
        return e17.preventDefault(), n2.closed = !n2.closed, false;
      }), r2.closed || (this.closed = false);
    }
    r2.autoPlace && (Z.isUndefined(r2.parent) && (el && (el = (tl = document.createElement(`div`), Q.addClass(tl, Jc), Q.addClass(tl, e16.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(tl), false)), tl.appendChild(this.domElement), Q.addClass(this.domElement, e16.CLASS_AUTO_PLACE)), this.parent || hl(n2, r2.width)), this.__resizeHandler = function() {
      n2.onResizeDebounced();
    }, Q.bind(window, `resize`, this.__resizeHandler), Q.bind(this.__ul, `webkitTransitionEnd`, this.__resizeHandler), Q.bind(this.__ul, `transitionend`, this.__resizeHandler), Q.bind(this.__ul, `oTransitionEnd`, this.__resizeHandler), this.onResize(), r2.resizable && ml(this), a2 = function() {
      Qc && localStorage.getItem(ul(n2, `isLocal`)) === `true` && localStorage.setItem(ul(n2, `gui`), JSON.stringify(n2.getSaveObject()));
    }, this.saveToLocalStorageIfPossible = a2;
    function l2() {
      var e17 = n2.getRoot();
      e17.width += 1, Z.defer(function() {
        --e17.width;
      });
    }
    r2.parent || l2();
  };
  $.toggleHide = function() {
    nl = !nl, Z.each(rl, function(e17) {
      e17.domElement.style.display = nl ? `none` : ``;
    });
  }, $.CLASS_AUTO_PLACE = `a`, $.CLASS_AUTO_PLACE_CONTAINER = `ac`, $.CLASS_MAIN = `main`, $.CLASS_CONTROLLER_ROW = `cr`, $.CLASS_TOO_TALL = `taller-than-window`, $.CLASS_CLOSED = `closed`, $.CLASS_CLOSE_BUTTON = `close-button`, $.CLASS_CLOSE_TOP = `close-top`, $.CLASS_CLOSE_BOTTOM = `close-bottom`, $.CLASS_DRAG = `drag`, $.DEFAULT_WIDTH = 245, $.TEXT_CLOSED = `Close Controls`, $.TEXT_OPEN = `Open Controls`, $._keydownHandler = function(e17) {
    document.activeElement.type !== `text` && (e17.which === Yc || e17.keyCode === Yc) && $.toggleHide();
  }, Q.bind(window, `keydown`, $._keydownHandler, false), Z.extend($.prototype, { add: function(e17, t2) {
    return ll(this, e17, t2, { factoryArgs: Array.prototype.slice.call(arguments, 2) });
  }, addColor: function(e17, t2) {
    return ll(this, e17, t2, { color: true });
  }, remove: function(e17) {
    this.__ul.removeChild(e17.__li), this.__controllers.splice(this.__controllers.indexOf(e17), 1);
    var t2 = this;
    Z.defer(function() {
      t2.onResize();
    });
  }, destroy: function() {
    if (this.parent) throw Error(`Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.`);
    this.autoPlace && tl.removeChild(this.domElement);
    var e17 = this;
    Z.each(this.__folders, function(t2) {
      e17.removeFolder(t2);
    }), Q.unbind(window, `keydown`, $._keydownHandler, false), al(this);
  }, addFolder: function(e17) {
    if (this.__folders[e17] !== void 0) throw Error(`You already have a folder in this GUI by the name "` + e17 + `"`);
    var t2 = { name: e17, parent: this };
    t2.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[e17] && (t2.closed = this.load.folders[e17].closed, t2.load = this.load.folders[e17]);
    var n2 = new $(t2);
    this.__folders[e17] = n2;
    var r2 = il(this, n2.domElement);
    return Q.addClass(r2, `folder`), n2;
  }, removeFolder: function(e17) {
    this.__ul.removeChild(e17.domElement.parentElement), delete this.__folders[e17.name], this.load && this.load.folders && this.load.folders[e17.name] && delete this.load.folders[e17.name], al(e17);
    var t2 = this;
    Z.each(e17.__folders, function(t3) {
      e17.removeFolder(t3);
    }), Z.defer(function() {
      t2.onResize();
    });
  }, open: function() {
    this.closed = false;
  }, close: function() {
    this.closed = true;
  }, hide: function() {
    this.domElement.style.display = `none`;
  }, show: function() {
    this.domElement.style.display = ``;
  }, onResize: function() {
    var e17 = this.getRoot();
    if (e17.scrollable) {
      var t2 = Q.getOffset(e17.__ul).top, n2 = 0;
      Z.each(e17.__ul.childNodes, function(t3) {
        e17.autoPlace && t3 === e17.__save_row || (n2 += Q.getHeight(t3));
      }), window.innerHeight - t2 - Xc < n2 ? (Q.addClass(e17.domElement, $.CLASS_TOO_TALL), e17.__ul.style.height = window.innerHeight - t2 - Xc + `px`) : (Q.removeClass(e17.domElement, $.CLASS_TOO_TALL), e17.__ul.style.height = `auto`);
    }
    e17.__resize_handle && Z.defer(function() {
      e17.__resize_handle.style.height = e17.__ul.offsetHeight + `px`;
    }), e17.__closeButton && (e17.__closeButton.style.width = e17.width + `px`);
  }, onResizeDebounced: Z.debounce(function() {
    this.onResize();
  }, 50), remember: function() {
    if (Z.isUndefined($c) && ($c = new Kc(), $c.domElement.innerHTML = Hc), this.parent) throw Error(`You can only call remember on a top level GUI.`);
    var e17 = this;
    Z.each(Array.prototype.slice.call(arguments), function(t2) {
      e17.__rememberedObjects.length === 0 && pl(e17), e17.__rememberedObjects.indexOf(t2) === -1 && e17.__rememberedObjects.push(t2);
    }), this.autoPlace && hl(this, this.width);
  }, getRoot: function() {
    for (var e17 = this; e17.parent; ) e17 = e17.parent;
    return e17;
  }, getSaveObject: function() {
    var e17 = this.load;
    return e17.closed = this.closed, this.__rememberedObjects.length > 0 && (e17.preset = this.preset, e17.remembered || (e17.remembered = {}), e17.remembered[this.preset] = gl(this)), e17.folders = {}, Z.each(this.__folders, function(t2, n2) {
      e17.folders[n2] = t2.getSaveObject();
    }), e17;
  }, save: function() {
    this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = gl(this), ol(this, false), this.saveToLocalStorageIfPossible();
  }, saveAs: function(e17) {
    this.load.remembered || (this.load.remembered = {}, this.load.remembered[Zc] = gl(this, true)), this.load.remembered[e17] = gl(this), this.preset = e17, dl(this, e17, true), this.saveToLocalStorageIfPossible();
  }, revert: function(e17) {
    Z.each(this.__controllers, function(t2) {
      this.getRoot().load.remembered ? cl(e17 || this.getRoot(), t2) : t2.setValue(t2.initialValue), t2.__onFinishChange && t2.__onFinishChange.call(t2, t2.getValue());
    }, this), Z.each(this.__folders, function(e18) {
      e18.revert(e18);
    }), e17 || ol(this.getRoot(), false);
  }, listen: function(e17) {
    var t2 = this.__listening.length === 0;
    this.__listening.push(e17), t2 && vl(this.__listening);
  }, updateDisplay: function() {
    Z.each(this.__controllers, function(e17) {
      e17.updateDisplay();
    }), Z.each(this.__folders, function(e17) {
      e17.updateDisplay();
    });
  } });
  function il(e17, t2, n2) {
    var r2 = document.createElement(`li`);
    return t2 && r2.appendChild(t2), n2 ? e17.__ul.insertBefore(r2, n2) : e17.__ul.appendChild(r2), e17.onResize(), r2;
  }
  function al(e17) {
    Q.unbind(window, `resize`, e17.__resizeHandler), e17.saveToLocalStorageIfPossible && Q.unbind(window, `unload`, e17.saveToLocalStorageIfPossible);
  }
  function ol(e17, t2) {
    var n2 = e17.__preset_select[e17.__preset_select.selectedIndex];
    t2 ? n2.innerHTML = n2.value + `*` : n2.innerHTML = n2.value;
  }
  function sl(e17, t2, n2) {
    if (n2.__li = t2, n2.__gui = e17, Z.extend(n2, { options: function(t3) {
      if (arguments.length > 1) {
        var r3 = n2.__li.nextElementSibling;
        return n2.remove(), ll(e17, n2.object, n2.property, { before: r3, factoryArgs: [Z.toArray(arguments)] });
      }
      if (Z.isArray(t3) || Z.isObject(t3)) {
        var i3 = n2.__li.nextElementSibling;
        return n2.remove(), ll(e17, n2.object, n2.property, { before: i3, factoryArgs: [t3] });
      }
    }, name: function(e18) {
      return n2.__li.firstElementChild.firstElementChild.innerHTML = e18, n2;
    }, listen: function() {
      return n2.__gui.listen(n2), n2;
    }, remove: function() {
      return n2.__gui.remove(n2), n2;
    } }), n2 instanceof Fc) {
      var r2 = new Nc(n2.object, n2.property, { min: n2.__min, max: n2.__max, step: n2.__step });
      Z.each([`updateDisplay`, `onChange`, `onFinishChange`, `step`, `min`, `max`], function(e18) {
        var t3 = n2[e18], i3 = r2[e18];
        n2[e18] = r2[e18] = function() {
          var e19 = Array.prototype.slice.call(arguments);
          return i3.apply(r2, e19), t3.apply(n2, e19);
        };
      }), Q.addClass(t2, `has-slider`), n2.domElement.insertBefore(r2.domElement, n2.domElement.firstElementChild);
    } else if (n2 instanceof Nc) {
      var i2 = function(t3) {
        if (Z.isNumber(n2.__min) && Z.isNumber(n2.__max)) {
          var r3 = n2.__li.firstElementChild.firstElementChild.innerHTML, i3 = n2.__gui.__listening.indexOf(n2) > -1;
          n2.remove();
          var a2 = ll(e17, n2.object, n2.property, { before: n2.__li.nextElementSibling, factoryArgs: [n2.__min, n2.__max, n2.__step] });
          return a2.name(r3), i3 && a2.listen(), a2;
        }
        return t3;
      };
      n2.min = Z.compose(i2, n2.min), n2.max = Z.compose(i2, n2.max);
    } else n2 instanceof Dc ? (Q.bind(t2, `click`, function() {
      Q.fakeEvent(n2.__checkbox, `click`);
    }), Q.bind(n2.__checkbox, `click`, function(e18) {
      e18.stopPropagation();
    })) : n2 instanceof Ic ? (Q.bind(t2, `click`, function() {
      Q.fakeEvent(n2.__button, `click`);
    }), Q.bind(t2, `mouseover`, function() {
      Q.addClass(n2.__button, `hover`);
    }), Q.bind(t2, `mouseout`, function() {
      Q.removeClass(n2.__button, `hover`);
    })) : n2 instanceof Lc && (Q.addClass(t2, `color`), n2.updateDisplay = Z.compose(function(e18) {
      return t2.style.borderLeftColor = n2.__color.toString(), e18;
    }, n2.updateDisplay), n2.updateDisplay());
    n2.setValue = Z.compose(function(t3) {
      return e17.getRoot().__preset_select && n2.isModified() && ol(e17.getRoot(), true), t3;
    }, n2.setValue);
  }
  function cl(e17, t2) {
    var n2 = e17.getRoot(), r2 = n2.__rememberedObjects.indexOf(t2.object);
    if (r2 !== -1) {
      var i2 = n2.__rememberedObjectIndecesToControllers[r2];
      if (i2 === void 0 && (i2 = {}, n2.__rememberedObjectIndecesToControllers[r2] = i2), i2[t2.property] = t2, n2.load && n2.load.remembered) {
        var a2 = n2.load.remembered, o2 = void 0;
        if (a2[e17.preset]) o2 = a2[e17.preset];
        else if (a2[Zc]) o2 = a2[Zc];
        else return;
        if (o2[r2] && o2[r2][t2.property] !== void 0) {
          var s2 = o2[r2][t2.property];
          t2.initialValue = s2, t2.setValue(s2);
        }
      }
    }
  }
  function ll(e17, t2, n2, r2) {
    if (t2[n2] === void 0) throw Error(`Object "` + t2 + `" has no property "` + n2 + `"`);
    var i2 = void 0;
    if (r2.color) i2 = new Lc(t2, n2);
    else {
      var a2 = [t2, n2].concat(r2.factoryArgs);
      i2 = Uc.apply(e17, a2);
    }
    r2.before instanceof Sc && (r2.before = r2.before.__li), cl(e17, i2), Q.addClass(i2.domElement, `c`);
    var o2 = document.createElement(`span`);
    Q.addClass(o2, `property-name`), o2.innerHTML = i2.property;
    var s2 = document.createElement(`div`);
    s2.appendChild(o2), s2.appendChild(i2.domElement);
    var c2 = il(e17, s2, r2.before);
    return Q.addClass(c2, $.CLASS_CONTROLLER_ROW), i2 instanceof Lc ? Q.addClass(c2, `color`) : Q.addClass(c2, pc(i2.getValue())), sl(e17, c2, i2), e17.__controllers.push(i2), i2;
  }
  function ul(e17, t2) {
    return document.location.href + `.` + t2;
  }
  function dl(e17, t2, n2) {
    var r2 = document.createElement(`option`);
    r2.innerHTML = t2, r2.value = t2, e17.__preset_select.appendChild(r2), n2 && (e17.__preset_select.selectedIndex = e17.__preset_select.length - 1);
  }
  function fl(e17, t2) {
    t2.style.display = e17.useLocalStorage ? `block` : `none`;
  }
  function pl(e17) {
    var t2 = e17.__save_row = document.createElement(`li`);
    Q.addClass(e17.domElement, `has-save`), e17.__ul.insertBefore(t2, e17.__ul.firstChild), Q.addClass(t2, `save-row`);
    var n2 = document.createElement(`span`);
    n2.innerHTML = `&nbsp;`, Q.addClass(n2, `button gears`);
    var r2 = document.createElement(`span`);
    r2.innerHTML = `Save`, Q.addClass(r2, `button`), Q.addClass(r2, `save`);
    var i2 = document.createElement(`span`);
    i2.innerHTML = `New`, Q.addClass(i2, `button`), Q.addClass(i2, `save-as`);
    var a2 = document.createElement(`span`);
    a2.innerHTML = `Revert`, Q.addClass(a2, `button`), Q.addClass(a2, `revert`);
    var o2 = e17.__preset_select = document.createElement(`select`);
    if (e17.load && e17.load.remembered ? Z.each(e17.load.remembered, function(t3, n3) {
      dl(e17, n3, n3 === e17.preset);
    }) : dl(e17, Zc, false), Q.bind(o2, `change`, function() {
      for (var t3 = 0; t3 < e17.__preset_select.length; t3++) e17.__preset_select[t3].innerHTML = e17.__preset_select[t3].value;
      e17.preset = this.value;
    }), t2.appendChild(o2), t2.appendChild(n2), t2.appendChild(r2), t2.appendChild(i2), t2.appendChild(a2), Qc) {
      var s2 = document.getElementById(`dg-local-explain`), c2 = document.getElementById(`dg-local-storage`), l2 = document.getElementById(`dg-save-locally`);
      l2.style.display = `block`, localStorage.getItem(ul(e17, `isLocal`)) === `true` && c2.setAttribute(`checked`, `checked`), fl(e17, s2), Q.bind(c2, `change`, function() {
        e17.useLocalStorage = !e17.useLocalStorage, fl(e17, s2);
      });
    }
    var u2 = document.getElementById(`dg-new-constructor`);
    Q.bind(u2, `keydown`, function(e18) {
      e18.metaKey && (e18.which === 67 || e18.keyCode === 67) && $c.hide();
    }), Q.bind(n2, `click`, function() {
      u2.innerHTML = JSON.stringify(e17.getSaveObject(), void 0, 2), $c.show(), u2.focus(), u2.select();
    }), Q.bind(r2, `click`, function() {
      e17.save();
    }), Q.bind(i2, `click`, function() {
      var t3 = prompt(`Enter a new preset name.`);
      t3 && e17.saveAs(t3);
    }), Q.bind(a2, `click`, function() {
      e17.revert();
    });
  }
  function ml(e17) {
    var t2 = void 0;
    e17.__resize_handle = document.createElement(`div`), Z.extend(e17.__resize_handle.style, { width: `6px`, marginLeft: `-3px`, height: `200px`, cursor: `ew-resize`, position: `absolute` });
    function n2(n3) {
      return n3.preventDefault(), e17.width += t2 - n3.clientX, e17.onResize(), t2 = n3.clientX, false;
    }
    function r2() {
      Q.removeClass(e17.__closeButton, $.CLASS_DRAG), Q.unbind(window, `mousemove`, n2), Q.unbind(window, `mouseup`, r2);
    }
    function i2(i3) {
      return i3.preventDefault(), t2 = i3.clientX, Q.addClass(e17.__closeButton, $.CLASS_DRAG), Q.bind(window, `mousemove`, n2), Q.bind(window, `mouseup`, r2), false;
    }
    Q.bind(e17.__resize_handle, `mousedown`, i2), Q.bind(e17.__closeButton, `mousedown`, i2), e17.domElement.insertBefore(e17.__resize_handle, e17.domElement.firstElementChild);
  }
  function hl(e17, t2) {
    e17.domElement.style.width = t2 + `px`, e17.__save_row && e17.autoPlace && (e17.__save_row.style.width = t2 + `px`), e17.__closeButton && (e17.__closeButton.style.width = t2 + `px`);
  }
  function gl(e17, t2) {
    var n2 = {};
    return Z.each(e17.__rememberedObjects, function(r2, i2) {
      var a2 = {}, o2 = e17.__rememberedObjectIndecesToControllers[i2];
      Z.each(o2, function(e18, n3) {
        a2[n3] = t2 ? e18.initialValue : e18.getValue();
      }), n2[i2] = a2;
    }), n2;
  }
  function _l(e17) {
    for (var t2 = 0; t2 < e17.__preset_select.length; t2++) e17.__preset_select[t2].value === e17.preset && (e17.__preset_select.selectedIndex = t2);
  }
  function vl(e17) {
    e17.length !== 0 && Gc.call(window, function() {
      vl(e17);
    }), Z.each(e17, function(e18) {
      e18.updateDisplay();
    });
  }
  var yl = $;
  var bl = { noise: `
  // MATHS
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}

  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

  // SIMPLEX NOISES
  // Simplex 2D noise
  //
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  //	Simplex 3D Noise
  //	by Ian McEwan, Ashima Arts
  //
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }


  //	Simplex 4D Noise
  //	by Ian McEwan, Ashima Arts
  //
  vec4 grad4(float j, vec4 ip){
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
  }

  float snoise(vec4 v){
    const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                          0.309016994374947451); // (sqrt(5) - 1)/4   F4
  // First corner
    vec4 i  = floor(v + dot(v, C.yyyy) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

  // Other corners

  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;

    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
  //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;

  //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;

    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    //  x0 = x0 - 0.0 + 0.0 * C
    vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
    vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
    vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  // Permutations
    i = mod(i, 289.0);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
              i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
  // Gradients
  // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

  // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

  // Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }
` };
  var xl = o(((e17, t2) => {
    function n2(e18) {
      var t3 = e18.length, n3 = 1, r3 = Array(t3), i2;
      for (i2 = t3; i2 > 0; i2--) r3[i2 - 1] = n3, n3 *= e18[i2 - 1];
      return { stride: r3, data: new Uint32Array(n3) };
    }
    function r2(e18) {
      var t3 = e18.length, n3 = 1, r3 = Array(t3), i2 = [], a2, o2;
      for (a2 = t3; a2 > 0; a2--) r3[a2 - 1] = n3, n3 *= e18[a2 - 1];
      for (o2 = 0; o2 < n3; o2++) i2.push([]);
      return { stride: r3, data: i2 };
    }
    t2.exports = { integer: n2, array: r2 };
  }));
  var Sl = o(((e17, t2) => {
    t2.exports = n2;
    function n2(e18, t3) {
      var n3 = Array(e18), r2 = Math.floor(e18 / 2) << 1, i2 = 0, a2, o2, s2, c2, l2;
      for (l2 = 0; l2 < r2; l2 += 2) a2 = -2 * Math.log(t3()), o2 = Math.sqrt(a2), s2 = 2 * Math.PI * t3(), i2 += a2, n3[l2] = o2 * Math.cos(s2), n3[l2 + 1] = o2 * Math.sin(s2);
      if (e18 % 2) {
        var u2 = Math.sqrt(-2 * Math.log(t3())) * Math.cos(2 * Math.PI * t3());
        n3[e18 - 1] = u2, i2 += u2 ** 2;
      }
      for (c2 = 1 / Math.sqrt(i2), l2 = 0; l2 < e18; ++l2) n3[l2] *= c2;
      return n3;
    }
  }));
  var Cl = o(((e17, t2) => {
    t2.exports = function(e18, t3) {
      e18 || (e18 = 1), t3 || (t3 = 2);
      for (var n2 = e18 * 2 + 1, r2 = n2 ** +t3 - 1, i2 = Array(r2), a2 = 0; a2 < r2; a2++) for (var o2 = i2[a2] = Array(t3), s2 = a2 < r2 / 2 ? a2 : a2 + 1, c2 = 1; c2 <= t3; c2++) {
        var l2 = s2 % n2 ** +c2;
        o2[c2 - 1] = l2 / n2 ** (c2 - 1) - e18, s2 -= l2;
      }
      return i2;
    };
  }));
  var wl = o(((e17, t2) => {
    var n2 = Cl();
    function r2(e18) {
      var t3 = n2(2, e18), r3 = [], i3;
      for (t3 = t3.filter(function(t4) {
        for (var n3 = 0, r4 = 0; r4 < e18; r4++) n3 += Math.max(0, Math.abs(t4[r4]) - 1) ** 2;
        return n3 < e18;
      }), i3 = 0; i3 < e18; i3++) r3.push(0);
      return t3.push(r3), t3.sort(function(t4, n3) {
        var r4 = 0, i4 = 0, a3;
        for (a3 = 0; a3 < e18; a3++) r4 += t4[a3] ** 2, i4 += n3[a3] ** 2;
        return r4 < i4 ? -1 : +(r4 > i4);
      }), t3;
    }
    var i2 = {};
    function a2(e18) {
      return i2[e18] || (i2[e18] = r2(e18)), i2[e18];
    }
    t2.exports = a2;
  }));
  var Tl = o(((e17, t2) => {
    var n2 = xl().integer, r2 = Sl(), i2 = wl();
    function a2(e18, t3) {
      for (var n3 = 0, r3 = 0; r3 < e18.length; r3++) n3 += (e18[r3] - t3[r3]) ** 2;
      return n3;
    }
    function o2(e18, t3) {
      if (typeof e18.distanceFunction == `function`) throw Error(`PoissonDiskSampling: Tried to instantiate the fixed density implementation with a distanceFunction`);
      this.shape = e18.shape, this.minDistance = e18.minDistance, this.maxDistance = e18.maxDistance || e18.minDistance * 2, this.maxTries = Math.ceil(Math.max(1, e18.tries || 30)), this.rng = t3 || Math.random;
      for (var r3 = 0, a3 = 0; a3 < this.shape.length; a3++) r3 = Math.max(r3, this.shape[a3]);
      var o3 = 1e-14 * Math.max(1, r3 / 128 | 0);
      this.dimension = this.shape.length, this.squaredMinDistance = this.minDistance * this.minDistance, this.minDistancePlusEpsilon = this.minDistance + o3, this.deltaDistance = Math.max(0, this.maxDistance - this.minDistancePlusEpsilon), this.cellSize = this.minDistance / Math.sqrt(this.dimension), this.neighbourhood = i2(this.dimension), this.currentPoint = null, this.processList = [], this.samplePoints = [], this.gridShape = [];
      for (var a3 = 0; a3 < this.dimension; a3++) this.gridShape.push(Math.ceil(this.shape[a3] / this.cellSize));
      this.grid = n2(this.gridShape);
    }
    o2.prototype.shape = null, o2.prototype.dimension = null, o2.prototype.minDistance = null, o2.prototype.maxDistance = null, o2.prototype.minDistancePlusEpsilon = null, o2.prototype.squaredMinDistance = null, o2.prototype.deltaDistance = null, o2.prototype.cellSize = null, o2.prototype.maxTries = null, o2.prototype.rng = null, o2.prototype.neighbourhood = null, o2.prototype.currentPoint = null, o2.prototype.processList = null, o2.prototype.samplePoints = null, o2.prototype.gridShape = null, o2.prototype.grid = null, o2.prototype.addRandomPoint = function() {
      for (var e18 = Array(this.dimension), t3 = 0; t3 < this.dimension; t3++) e18[t3] = this.rng() * this.shape[t3];
      return this.directAddPoint(e18);
    }, o2.prototype.addPoint = function(e18) {
      var t3, n3 = true;
      if (e18.length === this.dimension) for (t3 = 0; t3 < this.dimension && n3; t3++) n3 = e18[t3] >= 0 && e18[t3] < this.shape[t3];
      else n3 = false;
      return n3 ? this.directAddPoint(e18) : null;
    }, o2.prototype.directAddPoint = function(e18) {
      var t3 = 0, n3 = this.grid.stride, r3;
      for (this.processList.push(e18), this.samplePoints.push(e18), r3 = 0; r3 < this.dimension; r3++) t3 += (e18[r3] / this.cellSize | 0) * n3[r3];
      return this.grid.data[t3] = this.samplePoints.length, e18;
    }, o2.prototype.inNeighbourhood = function(e18) {
      var t3 = this.dimension, n3 = this.grid.stride, r3, i3, o3, s2, c2;
      for (r3 = 0; r3 < this.neighbourhood.length; r3++) {
        for (i3 = 0, o3 = 0; o3 < t3; o3++) {
          if (s2 = (e18[o3] / this.cellSize | 0) + this.neighbourhood[r3][o3], s2 < 0 || s2 >= this.gridShape[o3]) {
            i3 = -1;
            break;
          }
          i3 += s2 * n3[o3];
        }
        if (i3 !== -1 && this.grid.data[i3] !== 0 && (c2 = this.samplePoints[this.grid.data[i3] - 1], a2(e18, c2) < this.squaredMinDistance)) return true;
      }
      return false;
    }, o2.prototype.next = function() {
      for (var e18, t3, n3, i3, a3, o3, s2; this.processList.length > 0; ) {
        for (this.currentPoint === null && (this.currentPoint = this.processList.shift()), i3 = this.currentPoint, e18 = 0; e18 < this.maxTries; e18++) {
          for (o3 = true, n3 = this.minDistancePlusEpsilon + this.deltaDistance * this.rng(), this.dimension === 2 ? (t3 = this.rng() * Math.PI * 2, a3 = [Math.cos(t3), Math.sin(t3)]) : a3 = r2(this.dimension, this.rng), s2 = 0; o3 && s2 < this.dimension; s2++) a3[s2] = i3[s2] + a3[s2] * n3, o3 = a3[s2] >= 0 && a3[s2] < this.shape[s2];
          if (o3 && !this.inNeighbourhood(a3)) return this.directAddPoint(a3);
        }
        e18 === this.maxTries && (this.currentPoint = null);
      }
      return null;
    }, o2.prototype.fill = function() {
      for (this.samplePoints.length === 0 && this.addRandomPoint(); this.next(); ) ;
      return this.samplePoints;
    }, o2.prototype.getAllPoints = function() {
      return this.samplePoints;
    }, o2.prototype.getAllPointsWithDistance = function() {
      throw Error(`PoissonDiskSampling: getAllPointsWithDistance() is not available in fixed-density implementation`);
    }, o2.prototype.reset = function() {
      var e18 = this.grid.data, t3 = 0;
      for (t3 = 0; t3 < e18.length; t3++) e18[t3] = 0;
      this.samplePoints = [], this.currentPoint = null, this.processList.length = 0;
    }, t2.exports = o2;
  }));
  var El = o(((e17, t2) => {
    var n2 = xl().array, r2 = Sl(), i2 = wl();
    function a2(e18, t3) {
      for (var n3 = 0, r3 = 0; r3 < e18.length; r3++) n3 += (e18[r3] - t3[r3]) ** 2;
      return Math.sqrt(n3);
    }
    function o2(e18, t3) {
      if (typeof e18.distanceFunction != `function`) throw Error(`PoissonDiskSampling: Tried to instantiate the variable density implementation without a distanceFunction`);
      this.shape = e18.shape, this.minDistance = e18.minDistance, this.maxDistance = e18.maxDistance || e18.minDistance * 2, this.maxTries = Math.ceil(Math.max(1, e18.tries || 30)), this.distanceFunction = e18.distanceFunction, this.bias = Math.max(0, Math.min(1, e18.bias || 0)), this.rng = t3 || Math.random;
      for (var r3 = 0, a3 = 0; a3 < this.shape.length; a3++) r3 = Math.max(r3, this.shape[a3]);
      var o3 = 1e-14 * Math.max(1, r3 / 128 | 0);
      this.dimension = this.shape.length, this.minDistancePlusEpsilon = this.minDistance + o3, this.deltaDistance = Math.max(0, this.maxDistance - this.minDistancePlusEpsilon), this.cellSize = this.maxDistance / Math.sqrt(this.dimension), this.neighbourhood = i2(this.dimension), this.currentPoint = null, this.currentDistance = 0, this.processList = [], this.samplePoints = [], this.sampleDistance = [], this.gridShape = [];
      for (var a3 = 0; a3 < this.dimension; a3++) this.gridShape.push(Math.ceil(this.shape[a3] / this.cellSize));
      this.grid = n2(this.gridShape);
    }
    o2.prototype.shape = null, o2.prototype.dimension = null, o2.prototype.minDistance = null, o2.prototype.maxDistance = null, o2.prototype.minDistancePlusEpsilon = null, o2.prototype.deltaDistance = null, o2.prototype.cellSize = null, o2.prototype.maxTries = null, o2.prototype.distanceFunction = null, o2.prototype.bias = null, o2.prototype.rng = null, o2.prototype.neighbourhood = null, o2.prototype.currentPoint = null, o2.prototype.currentDistance = null, o2.prototype.processList = null, o2.prototype.samplePoints = null, o2.prototype.sampleDistance = null, o2.prototype.gridShape = null, o2.prototype.grid = null, o2.prototype.addRandomPoint = function() {
      for (var e18 = Array(this.dimension), t3 = 0; t3 < this.dimension; t3++) e18[t3] = this.rng() * this.shape[t3];
      return this.directAddPoint(e18);
    }, o2.prototype.addPoint = function(e18) {
      var t3, n3 = true;
      if (e18.length === this.dimension) for (t3 = 0; t3 < this.dimension && n3; t3++) n3 = e18[t3] >= 0 && e18[t3] < this.shape[t3];
      else n3 = false;
      return n3 ? this.directAddPoint(e18) : null;
    }, o2.prototype.directAddPoint = function(e18) {
      var t3 = 0, n3 = this.grid.stride, r3 = this.samplePoints.length, i3;
      for (this.processList.push(r3), this.samplePoints.push(e18), this.sampleDistance.push(this.distanceFunction(e18)), i3 = 0; i3 < this.dimension; i3++) t3 += (e18[i3] / this.cellSize | 0) * n3[i3];
      return this.grid.data[t3].push(r3), e18;
    }, o2.prototype.inNeighbourhood = function(e18) {
      var t3 = this.dimension, n3 = this.grid.stride, r3, i3, o3, s2, c2, l2, u2 = this.distanceFunction(e18);
      for (r3 = 0; r3 < this.neighbourhood.length; r3++) {
        for (i3 = 0, o3 = 0; o3 < t3; o3++) {
          if (s2 = (e18[o3] / this.cellSize | 0) + this.neighbourhood[r3][o3], s2 < 0 || s2 >= this.gridShape[o3]) {
            i3 = -1;
            break;
          }
          i3 += s2 * n3[o3];
        }
        if (i3 !== -1 && this.grid.data[i3].length > 0) for (var d2 = 0; d2 < this.grid.data[i3].length; d2++) {
          c2 = this.samplePoints[this.grid.data[i3][d2]], l2 = this.sampleDistance[this.grid.data[i3][d2]];
          var f2 = Math.min(l2, u2), p2 = f2 + (Math.max(l2, u2) - f2) * this.bias;
          if (a2(e18, c2) < this.minDistance + this.deltaDistance * p2) return true;
        }
      }
      return false;
    }, o2.prototype.next = function() {
      for (var e18, t3, n3, i3, a3, o3, s2, c2; this.processList.length > 0; ) {
        if (this.currentPoint === null) {
          var l2 = this.processList.shift();
          this.currentPoint = this.samplePoints[l2], this.currentDistance = this.sampleDistance[l2];
        }
        for (i3 = this.currentPoint, a3 = this.currentDistance, e18 = 0; e18 < this.maxTries; e18++) {
          for (s2 = true, n3 = this.minDistancePlusEpsilon + this.deltaDistance * (a3 + (1 - a3) * this.bias), this.dimension === 2 ? (t3 = this.rng() * Math.PI * 2, o3 = [Math.cos(t3), Math.sin(t3)]) : o3 = r2(this.dimension, this.rng), c2 = 0; s2 && c2 < this.dimension; c2++) o3[c2] = i3[c2] + o3[c2] * n3, s2 = o3[c2] >= 0 && o3[c2] < this.shape[c2];
          if (s2 && !this.inNeighbourhood(o3)) return this.directAddPoint(o3);
        }
        e18 === this.maxTries && (this.currentPoint = null);
      }
      return null;
    }, o2.prototype.fill = function() {
      for (this.samplePoints.length === 0 && this.addRandomPoint(); this.next(); ) ;
      return this.samplePoints;
    }, o2.prototype.getAllPoints = function() {
      return this.samplePoints;
    }, o2.prototype.getAllPointsWithDistance = function() {
      var e18 = Array(this.samplePoints.length), t3 = 0, n3 = 0, r3;
      for (t3 = 0; t3 < this.samplePoints.length; t3++) {
        for (r3 = Array(this.dimension + 1), n3 = 0; n3 < this.dimension; n3++) r3[n3] = this.samplePoints[t3][n3];
        r3[this.dimension] = this.sampleDistance[t3], e18[t3] = r3;
      }
      return e18;
    }, o2.prototype.reset = function() {
      var e18 = this.grid.data, t3 = 0;
      for (t3 = 0; t3 < e18.length; t3++) e18[t3] = [];
      this.samplePoints = [], this.currentPoint = null, this.processList.length = 0;
    }, t2.exports = o2;
  }));
  var Dl = o(((e17, t2) => {
    var n2 = Tl(), r2 = El();
    function i2(e18, t3) {
      this.shape = e18.shape, typeof e18.distanceFunction == `function` ? this.implementation = new r2(e18, t3) : this.implementation = new n2(e18, t3);
    }
    i2.prototype.implementation = null, i2.prototype.addRandomPoint = function() {
      return this.implementation.addRandomPoint();
    }, i2.prototype.addPoint = function(e18) {
      return this.implementation.addPoint(e18);
    }, i2.prototype.next = function() {
      return this.implementation.next();
    }, i2.prototype.fill = function() {
      return this.implementation.fill();
    }, i2.prototype.getAllPoints = function() {
      return this.implementation.getAllPoints();
    }, i2.prototype.getAllPointsWithDistance = function() {
      return this.implementation.getAllPointsWithDistance();
    }, i2.prototype.reset = function() {
      this.implementation.reset();
    }, t2.exports = i2;
  }));
  var Ol = class {
    constructor() {
      this.MAX_VERTICES = 256, this.MAX_VERTICES_MASK = this.MAX_VERTICES - 1, this.amplitude = 1, this.scale = 1, this.r = [];
      for (var e17 = 0; e17 < this.MAX_VERTICES; ++e17) this.r.push(Math.random());
    }
    getVal(e17) {
      var t2 = e17 * this.scale, n2 = Math.floor(t2), r2 = t2 - n2, i2 = r2 * r2 * (3 - 2 * r2), a2 = n2 % this.MAX_VERTICES_MASK, o2 = (a2 + 1) % this.MAX_VERTICES_MASK;
      return this.lerp(this.r[a2], this.r[o2], i2) * this.amplitude;
    }
    lerp(e17, t2, n2) {
      return e17 * (1 - n2) + t2 * n2;
    }
  };
  var kl = new class {
    constructor() {
      this.cursor = new U(), this.initEvents(), window.__debugMouse = this, this.screenWidth = window.innerWidth, this.screenHeight = window.innerHeight, this.update();
    }
    initEvents() {
      window.addEventListener(`mousemove`, (e17) => {
        this.onMouve(e17);
      }), window.addEventListener(`resize`, () => {
        this.screenWidth = window.innerWidth, this.screenHeight = window.innerHeight;
      });
    }
    onMouve(e17) {
      this.cursor.x = e17.clientX, this.cursor.y = e17.clientY;
    }
    update() {
      requestAnimationFrame(() => {
        this.update();
      });
    }
  }();

  // public/shopify/plantilla99/assets/js/MainParticlesComponent.astro_astro_type_script_index_0_lang.Dox42TL8.js
  var A2 = c(Dl(), 1);
  var j2 = (e17, t2, n2, r2, i2) => (e17 - t2) * (i2 - r2) / (n2 - t2) + r2;
  var M2 = class {
    constructor(e17) {
      this.scene = e17, this.renderer = e17.renderer, this.gl = this.gl, this.camera = e17.camera, this.lastTime = 0, this.everRendered = false, this.ringPos = new U(0, 0), this.cursorPos = new U(0, 0), this.colorScheme = e17.theme === `dark` ? 0 : 1, this.particleScale = this.scene.renderer.domElement.width / this.scene.pixelRatio / 2e3 * this.scene.particlesScale, this.createPoints(), this.init();
    }
    createPoints() {
      let e17 = new A2.default({ shape: [500, 500], minDistance: j2(this.scene.density, 0, 300, 10, 2), maxDistance: j2(this.scene.density, 0, 300, 11, 3), tries: 20 }).fill();
      this.pointsData = [];
      for (let t2 = 0; t2 < e17.length; t2++) this.pointsData.push(e17[t2][0] - 250, e17[t2][1] - 250);
      this.count = this.pointsData.length / 2;
    }
    createDataTexturePosition() {
      let e17 = new Float32Array(this.length * 4);
      for (let t3 = 0; t3 < this.count; t3++) {
        let n2 = t3 * 4;
        e17[n2 + 0] = this.pointsData[t3 * 2 + 0] * (1 / 250), e17[n2 + 1] = this.pointsData[t3 * 2 + 1] * (1 / 250), e17[n2 + 2] = 0, e17[n2 + 3] = 0;
      }
      let t2 = new Zr(e17, this.size, this.size, te, w);
      return t2.needsUpdate = true, t2;
    }
    createRenderTarget() {
      return new Et(this.size, this.size, { wrapS: l, wrapT: l, minFilter: f, magFilter: f, texture: this.posTex, format: te, type: T, depthBuffer: false, stencilBuffer: false });
    }
    init() {
      this.size = 256, this.length = this.size * this.size, this.posTex = this.createDataTexturePosition(), this.rt1 = this.createRenderTarget(), this.rt2 = this.createRenderTarget(), this.renderer.setRenderTarget(this.rt1), this.renderer.setClearColor(0, 0), this.renderer.clear(), this.renderer.setRenderTarget(this.rt2), this.renderer.setClearColor(0, 0), this.renderer.clear(), this.renderer.setRenderTarget(null), this.noise = new Ol(), this.simScene = new Xr(), this.simCamera = new Pi(-1, 1, 1, -1, 0, 1), this.simMaterial = new Ir({ uniforms: { uPosition: { value: this.posTex }, uPosRefs: { value: this.posTex }, uRingPos: { value: new U(0, 0) }, uRingRadius: { value: 0.2 }, uDeltaTime: { value: 0 }, uRingWidth: { value: 0.05 }, uRingWidth2: { value: 0.015 }, uRingDisplacement: { value: this.scene.ringDisplacement }, uTime: { value: 0 } }, vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `, fragmentShader: `
                precision highp float;
                uniform sampler2D uPosition;
                uniform sampler2D uPosRefs;
                uniform vec2 uRingPos;
                uniform float uTime;
                uniform float uDeltaTime;
                uniform float uRingRadius;

                uniform float uRingWidth;
                uniform float uRingWidth2;
                uniform float uRingDisplacement;

                ${bl.noise}

                void main() {

                    vec2 simTexCoords = gl_FragCoord.xy / vec2(${this.size.toFixed(1)}, ${this.size.toFixed(1)});
                    vec4 pFrame = texture2D(uPosition, simTexCoords);
                    // float pTime = pFrame.w - uDeltaTime;

                    float scale = pFrame.z;
                    float velocity = pFrame.w;
                    vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

                    float time = uTime * .5;
                    vec2 curentPos = refPos;

                    vec2 pos = pFrame.xy;
                    pos *= .8;

                    float dist = distance(curentPos.xy, uRingPos);
                    float noise0 = snoise(vec3(curentPos.xy * .2 + vec2(18.4924, 72.9744), time * 0.5));
                    float dist1 = distance(curentPos.xy + (noise0 * .005), uRingPos);


                    float t = smoothstep(uRingRadius - (uRingWidth * 2.), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
                    float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
                    float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

                    t = pow(t, 2.);
                    t2 = pow(t2, 3.);

                    t += t2 * 3.;
                    t += t3 * .4;
                    t += snoise(vec3(curentPos.xy * 30. + vec2(11.4924, 12.9744), time * 0.5)) * t3 * .5;

                    float nS = snoise(vec3(curentPos.xy * 2. + vec2(18.4924, 72.9744), time * 0.5));
                    t += pow((nS + 1.5) * .5, 2.) * .6;

                    // Mid scale noise
                    float noise1 = snoise(vec3(curentPos.xy * 4. + vec2(88.494, 32.4397), time * 0.35));
                    float noise2 = snoise(vec3(curentPos.xy * 4. + vec2(50.904, 120.947), time * 0.35));

                    // Close scale noise
                    float noise3 = snoise(vec3(curentPos.xy * 20. + vec2(18.4924, 72.9744), time * .5));
                    float noise4 = snoise(vec3(curentPos.xy * 20. + vec2(50.904, 120.947), time * .5));

                    // Far scale noise
                    // float noise5 = snoise(vec3(curentPos.xy * .5 + vec2(89.4924, 12.9744), time * 0.1));
                    // float noise6 = snoise(vec3(curentPos.xy * .5 + vec2(70.904, 120.947), time * 0.1));

                    vec2 disp = vec2(noise1, noise2) * .03;
                    disp += vec2(noise3, noise4) * .005;
                    // disp += vec2(noise5, noise6) * .05;

                    // Sin wave
                    disp.x += sin((refPos.x * 20.) + (time * 4.)) * .02 * clamp(dist, 0., 1.);
                    disp.y += cos((refPos.y * 20.) + (time * 3.)) * .02 * clamp(dist, 0., 1.);

                    pos -= (uRingPos - (curentPos + disp)) * pow(t2, .75) * uRingDisplacement;

                    // Add min scale
                    // t += .25;


                    // Add scale
                    float scaleDiff = t - scale;
                    scaleDiff *= .2;
                    scale += scaleDiff;


                    // Final position
                    vec2 finalPos = curentPos + disp + (pos * .25);

                    velocity *= .5;
                    velocity += scale * .25;

                    vec4 frame = vec4(finalPos, scale, velocity);

                    gl_FragColor = frame;

                }
            ` });
      let e17 = new Tr(new hi(2, 2), this.simMaterial);
      this.simScene.add(e17);
      let t2 = new pr(), i2 = new Float32Array(this.count * 2), a2 = new Float32Array(this.count * 3), s2 = new Float32Array(this.count * 4);
      for (let e18 = 0; e18 < this.count; e18++) {
        let t3 = e18 % this.size, n2 = Math.floor(e18 / this.size);
        i2[e18 * 2] = t3 / this.size, i2[e18 * 2 + 1] = n2 / this.size;
      }
      for (let e18 = 0; e18 < this.count; e18++) s2[e18 * 4] = Math.random(), s2[e18 * 4 + 1] = Math.random(), s2[e18 * 4 + 2] = Math.random(), s2[e18 * 4 + 3] = Math.random();
      t2.setAttribute(`position`, new nr(a2, 3)), t2.setAttribute(`uv`, new nr(i2, 2)), t2.setAttribute(`seeds`, new nr(s2, 4)), this.renderMaterial = new Ir({ uniforms: { uPosition: { value: this.posTex }, uTime: { value: 0 }, uColor1: { value: new q(this.scene.colorControls.color1) }, uColor2: { value: new q(this.scene.colorControls.color2) }, uColor3: { value: new q(this.scene.colorControls.color3) }, uAlpha: { value: 1 }, uRingPos: { value: new U(0, 0) }, uRez: { value: new U(this.scene.renderer.domElement.width, this.scene.renderer.domElement.height) }, uParticleScale: { value: this.particleScale }, uPixelRatio: { value: this.scene.pixelRatio }, uColorScheme: { value: this.colorScheme } }, vertexShader: `
                precision highp float;
                attribute vec4 seeds;

                uniform sampler2D uPosition;
                uniform float uTime;
                uniform float uParticleScale;
                uniform float uPixelRatio;
                uniform int uColorScheme;

                varying vec4 vSeeds;
                varying float vVelocity;
                varying vec2 vLocalPos;
                varying vec2 vScreenPos;
                varying float vScale;

                void main() {

                    vec4 pos = texture2D(uPosition, uv);
                    vSeeds = seeds;

                    vVelocity = pos.w;
                    vScale = pos.z;
                    vLocalPos = pos.xy;
                    vec4 viewSpace  = modelViewMatrix * vec4(vec3(pos.xy, 0.), 1.0);

                    gl_Position = projectionMatrix * viewSpace;
                    vScreenPos = gl_Position.xy;

                    gl_PointSize = ((vScale * 7.) * (uPixelRatio * 0.5) * uParticleScale);

                }
            `, fragmentShader: `
                precision highp float;

                varying vec4 vSeeds;
                varying vec2 vScreenPos;
                varying vec2 vLocalPos;
                varying float vScale;
                varying float vVelocity;

                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform vec3 uColor3;

                uniform vec2 uRingPos;
                uniform vec2 uRez;

                uniform float uAlpha;
                uniform float uTime;

                uniform int uColorScheme;

                ${bl.noise}

                #define PI 3.1415926535897932384626433832795

                float sdRoundBox( in vec2 p, in vec2 b, in vec4 r )
                {
                    r.xy = (p.x>0.0)?r.xy : r.zw;
                    r.x  = (p.y>0.0)?r.x  : r.y;
                    vec2 q = abs(p)-b+r.x;
                    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
                }

                // rotate uv by angle
                vec2 rotate(vec2 v, float a) {
                    float s = sin(a);
                    float c = cos(a);
                    mat2 m = mat2(c, s, -s, c);
                    return m * v;
                }

                void main() {

                    float uBorderSize = 0.2;
                    vec2 center = vec2(.48, .4);
                    float ratio = uRez.x / uRez.y;

                    // Noise
                    float noiseAngle = snoise(vec3(vLocalPos * 10. + vec2(18.4924, 72.9744), uTime * .85));
                    float noiseColor = snoise(vec3(vLocalPos * 2. + vec2(74.664, 91.556), uTime * .5));
                    noiseColor = (noiseColor + 1.) * .5;

                    // get angle between
                    float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

                    vec2 uv = gl_PointCoord.xy;
                    uv -= vec2(0.5);
                    uv.y *= -1.;
                    uv = rotate(uv, -angle + (noiseAngle * .5));

                    vec2 tuv = vScreenPos;
                    tuv = rotate(tuv, uTime * 1.);
                    tuv.y *= 1./ratio;
                    tuv += .5;

                    float h = 0.8; // adjust position of middleColor
                    float progress = smoothstep(0., .75, pow(noiseColor, 2.));
                    vec3 col = mix(mix(uColor1, uColor2, progress/h), mix(uColor2, uColor3, (progress - h)/(1.0 - h)), step(h, progress));
                    vec3 color = col;

                    float dist = sqrt(dot(uv, uv));

                    float dr = .5;
                    float t = smoothstep(dr+(uBorderSize + .0001), dr-uBorderSize, dist);
                    t = clamp(t, 0., 1.);

                    float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25));
                    rounded = smoothstep(.1, 0., rounded);

                    float a = uAlpha * rounded * smoothstep(0.1, 0.2, vScale);

                    if(a < 0.01){
                        discard;
                    }

                    color = clamp(color, 0., 1.);
                    color = mix(color, color * clamp(vVelocity, 0., 1.), float(uColorScheme));

                    gl_FragColor = vec4(color, clamp(a, 0., 1.));

                    #ifdef SRGB_TRANSFER
                        gl_FragColor = sRGBTransferOETF( gl_FragColor );
                    #endif

                }
            `, transparent: true, depthTest: false, depthWrite: false }), this.mesh = new di(t2, this.renderMaterial), this.mesh.position.set(0, 0, 0), this.mesh.scale.set(5, 5, 5), this.scene.scene.add(this.mesh);
    }
    resize() {
      this.renderMaterial.uniforms.uRez.value = new U(this.scene.renderer.domElement.width, this.scene.renderer.domElement.height), this.renderMaterial.uniforms.uPixelRatio.value = this.scene.pixelRatio, this.renderMaterial.needsUpdate = true;
    }
    update() {
      let e17 = this.scene.clock.getElapsedTime() - this.lastTime;
      this.lastTime = this.scene.clock.getElapsedTime();
      let t2 = (this.noise.getVal(this.scene.time * 0.66 + 94.234) - 0.5) * 2, n2 = (this.noise.getVal(this.scene.time * 0.75 + 21.028) - 0.5) * 2;
      this.cursorPos.set(t2 * 0.2, n2 * 0.1), this.scene.isIntersecting ? (this.cursorPos.set(this.scene.intersectionPoint.x * 0.175 + t2 * 0.1, this.scene.intersectionPoint.y * 0.175 + n2 * 0.1), this.ringPos.set(this.ringPos.x + (this.cursorPos.x - this.ringPos.x) * 0.02, this.ringPos.y + (this.cursorPos.y - this.ringPos.y) * 0.02)) : (this.cursorPos.set(t2 * 0.2, n2 * 0.1), this.ringPos.set(this.ringPos.x + (this.cursorPos.x - this.ringPos.x) * 0.01, this.ringPos.y + (this.cursorPos.y - this.ringPos.y) * 0.01)), this.particleScale = this.scene.renderer.domElement.width / this.scene.pixelRatio / 2e3 * this.scene.particlesScale, this.simMaterial.uniforms.uPosition.value = this.everRendered ? this.rt1.texture : this.posTex, this.simMaterial.uniforms.uTime.value = this.scene.clock.getElapsedTime(), this.simMaterial.uniforms.uDeltaTime.value = e17, this.simMaterial.uniforms.uRingRadius.value = 0.175 + Math.sin(this.scene.time * 1) * 0.03 + Math.cos(this.scene.time * 3) * 0.02, this.simMaterial.uniforms.uRingPos.value = this.ringPos, this.simMaterial.uniforms.uRingWidth.value = this.scene.ringWidth, this.simMaterial.uniforms.uRingWidth2.value = this.scene.ringWidth2, this.simMaterial.uniforms.uRingDisplacement.value = this.scene.ringDisplacement, this.renderer.setRenderTarget(this.rt2), this.renderer.render(this.simScene, this.simCamera), this.renderer.setRenderTarget(null), this.renderMaterial.uniforms.uPosition.value = this.everRendered ? this.rt2.texture : this.posTex, this.renderMaterial.uniforms.uTime.value = this.scene.clock.getElapsedTime(), this.renderMaterial.uniforms.uRingPos.value = this.ringPos, this.renderMaterial.uniforms.uParticleScale.value = this.particleScale;
    }
    postRender() {
      let e17 = this.rt1;
      this.rt1 = this.rt2, this.rt2 = e17, this.everRendered = true;
    }
    kill() {
      this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.rt1.dispose(), this.rt2.dispose(), this.posTex.dispose(), this.simMaterial.dispose(), this.renderMaterial.dispose();
    }
  };
  var N2 = class {
    constructor(e17) {
      this.loaded = false, this.texture = null, this.options = e17, this.theme = e17.theme || `dark`, this.interactive = e17.interactive || false, this.options.background = this.theme === `dark` ? new q(0) : new q(16777215), this.pixelRatio = e17.pixelRatio || window.devicePixelRatio, this.particlesScale = e17.particlesScale || 1, this.density = e17.density || 200, this.verbose = e17.verbose || false, this.scene = new Xr(), this.scene.background = this.options.background, this.canvas = document.createElement(`canvas`), this.options.container.appendChild(this.canvas), this.canvas.width = this.options.container.offsetWidth, this.canvas.height = this.options.container.offsetHeight, K.enabled = false, this.renderer = new nc({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: `high-performance`, preserveDrawingBuffer: true, stencil: false, precision: `highp` }), this.gl = this.renderer.getContext(), this.renderer.extensions.get(`EXT_color_buffer_float`), this.renderer.setSize(this.canvas.width, this.canvas.height), this.renderer.setPixelRatio(this.pixelRatio), this.onWindowResize = this.onWindowResize.bind(this), this.initCamera(), this.initScene(), this.initEvents(), this.clock = new Ii(), this.time = 0, this.lastTime = 0, this.dt = 0, this.skipFrame = false, this.isPaused = false, this.raycaster = new Yi(), this.mouse = new U(), this.intersectionPoint = new W(), this.isIntersecting = false, this.mouseIsOver = false, this.raycastPlane = new Tr(new hi(12.5, 12.5), new Qn({ color: 16711680, visible: false, side: 2 })), this.scene.add(this.raycastPlane);
    }
    initEvents() {
      window.addEventListener(`resize`, (e17) => {
        this.onWindowResize();
      });
    }
    onWindowResize() {
      this.canvas.width = this.options.container.offsetWidth, this.canvas.height = this.options.container.offsetHeight, this.renderer.setSize(this.canvas.width, this.canvas.height), this.camera.aspect = this.canvas.width / this.canvas.height, this.camera.updateProjectionMatrix(), this.particles && this.particles.resize();
    }
    initCamera() {
      this.camera = new Vr(40, this.gl.drawingBufferWidth / this.gl.drawingBufferHeight, 0.1, 1e3), this.camera.position.z = 3.1;
    }
    initScene() {
      this.colorControls = { color1: this.theme === `dark` ? `#7189ff` : `#2c64ed`, color2: this.theme === `dark` ? `#3074f9` : `#f84242`, color3: this.theme === `dark` ? `#000000` : `#ffcf03` }, this.ringWidth = this.options.ringWidth || 0.107, this.ringWidth2 = this.options.ringWidth2 || 0.05, this.ringDisplacement = this.options.ringDisplacement || 0.15, this.initParticles(), this.options.gui && this.initGUI(), this.onLoaded();
    }
    initParticles() {
      this.particles = new M2(this);
    }
    initGUI() {
      this.gui = new yl({ autoPlace: false }), this.options.container.appendChild(this.gui.domElement), this.gui.domElement.style.position = `absolute`, this.gui.domElement.style.top = `0`, this.gui.domElement.style.right = `0`, this.gui.domElement.style.zIndex = `1000`;
      let e17 = this.gui.addFolder(`Colors`);
      e17.addColor(this.colorControls, `color1`).name(`Color 1`).onChange((e18) => {
        this.particles.renderMaterial.uniforms.uColor1.value.set(new q(e18));
      }), e17.addColor(this.colorControls, `color2`).name(`Color 2`).onChange((e18) => {
        this.particles.renderMaterial.uniforms.uColor2.value.set(new q(e18));
      }), e17.addColor(this.colorControls, `color3`).name(`Color 3`).onChange((e18) => {
        this.particles.renderMaterial.uniforms.uColor3.value.set(new q(e18));
      }), e17.add(this, `ringWidth`).name(`Ring Width`).min(1e-3).max(0.2).step(1e-3).onChange((e18) => {
        this.ringWidth = e18;
      }), e17.add(this, `ringWidth2`).name(`Ring Width 2`).min(1e-3).max(0.2).step(1e-3).onChange((e18) => {
        this.ringWidth2 = e18;
      }), e17.add(this, `particlesScale`).name(`Particles Scale`).min(0.1).max(2).step(0.01).onChange((e18) => {
        this.particlesScale = e18;
      }), e17.add(this, `ringDisplacement`).name(`Displacement`).min(0.01).max(1).step(0.01).onChange((e18) => {
        this.ringDisplacement = e18;
      }), e17.add(this, `density`).name(`Density`).min(100).max(300).step(10).onChange((e18) => {
        this.density = e18, this.verbose, this.killParticles(), this.initParticles();
      }), e17.open();
    }
    stop() {
      this.isPaused = true, this.clock.stop(), this.verbose;
    }
    resume() {
      this.isPaused = false, this.clock.start(), this.verbose;
    }
    killParticles() {
      this.scene.remove(this.particles.mesh), this.particles.kill();
    }
    kill() {
      this.stop(), window.removeEventListener(`resize`, this.onWindowResize), this.raycastPlane && (this.scene.remove(this.raycastPlane), this.raycastPlane.geometry.dispose(), this.raycastPlane.material.dispose()), this.renderer && this.renderer.dispose(), this.canvas && this.canvas.parentElement && this.canvas.parentElement.removeChild(this.canvas);
    }
    onLoaded() {
      this.loaded = true;
    }
    preRender() {
      if (this.dt = this.clock.getElapsedTime() - this.lastTime, this.lastTime = this.clock.getElapsedTime(), this.time += this.dt, this.particles.update(), this.interactive && !this.skipFrame) {
        let e18 = this.canvas.getBoundingClientRect();
        kl.cursor, this.mouse.x = (kl.cursor.x - e18.left) * (kl.screenWidth / e18.width), this.mouse.y = (kl.cursor.y - e18.top) * (kl.screenHeight / e18.height), this.mouse.x = this.mouse.x / kl.screenWidth * 2 - 1, this.mouse.y = -(this.mouse.y / kl.screenHeight) * 2 + 1, this.mouse.x < -1 || this.mouse.x > 1 || this.mouse.y < -1 || this.mouse.y > 1 ? this.mouseIsOver = false : this.mouseIsOver = true;
      }
      if (this.skipFrame = !this.skipFrame, this.skipFrame) return;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      let e17 = this.raycaster.intersectObject(this.raycastPlane);
      e17.length > 0 && this.mouseIsOver ? (this.intersectionPoint.copy(e17[0].point), this.isIntersecting = true) : this.isIntersecting = false;
    }
    render() {
      !this.loaded || this.isPaused || (this.preRender(), this.renderer.setRenderTarget(null), this.renderer.autoClear = false, this.renderer.clear(), this.renderer.render(this.scene, this.camera), this.postRender());
    }
    postRender() {
      this.particles.postRender();
    }
  };
  document.addEventListener(`DOMContentLoaded`, () => {
    document.querySelectorAll(`[data-main-particles-component]`).forEach((e17) => {
      let t2 = e17.querySelector(`[data-container]`);
      if (!t2) return;
      let n2 = e17.getAttribute(`data-theme`) || `light`, r2 = parseFloat(e17.getAttribute(`data-ring-width`) || `0.15`), i2 = parseFloat(e17.getAttribute(`data-ring-width2`) || `0.05`), a2 = parseFloat(e17.getAttribute(`data-ring-displacement`) || `0.15`), o2 = parseInt(e17.getAttribute(`data-density`) || `200`), s2 = new N2({ container: t2, theme: n2, particlesScale: parseFloat(e17.getAttribute(`data-particles-scale`) || `0.75`), density: o2, interactive: true, gui: new URLSearchParams(window.location.search).get(`gui`) === `true`, verbose: false, ringWidth: r2, ringWidth2: i2, ringDisplacement: a2 }), c2 = false, l2 = null, u2 = new IntersectionObserver((e18) => {
        e18.forEach((e19) => {
          c2 = e19.isIntersecting, e19.isIntersecting ? s2.resume() : s2.stop();
        });
      }, { root: null, rootMargin: `0px`, threshold: 0 });
      u2.observe(t2);
      let d2 = () => {
        l2 = requestAnimationFrame(d2), c2 && s2.render();
      };
      d2(), window.addEventListener(`beforeunload`, () => {
        u2.disconnect(), l2 !== null && cancelAnimationFrame(l2), s2.kill();
      });
    });
  });
})();
