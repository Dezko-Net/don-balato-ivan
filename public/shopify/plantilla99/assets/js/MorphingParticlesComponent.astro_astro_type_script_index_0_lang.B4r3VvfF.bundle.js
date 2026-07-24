"use strict";
(() => {
  // public/shopify/plantilla99/assets/js/Mouse.ZrlRGzn3.js
  var e = Object.create;
  var t = Object.defineProperty;
  var n = Object.getOwnPropertyDescriptor;
  var r = Object.getOwnPropertyNames;
  var i = Object.getPrototypeOf;
  var a = Object.prototype.hasOwnProperty;
  var o = (e32, t3) => () => (t3 || (e32((t3 = { exports: {} }).exports, t3), e32 = null), t3.exports);
  var s = (e32, i3, o3, s3) => {
    if (i3 && typeof i3 == `object` || typeof i3 == `function`) for (var c3 = r(i3), l3 = 0, u3 = c3.length, d3; l3 < u3; l3++) d3 = c3[l3], !a.call(e32, d3) && d3 !== o3 && t(e32, d3, { get: ((e33) => i3[e33]).bind(null, d3), enumerable: !(s3 = n(i3, d3)) || s3.enumerable });
    return e32;
  };
  var c = (n3, r3, a3) => (a3 = n3 == null ? {} : e(i(n3)), s(r3 || !n3 || !n3.__esModule ? t(a3, `default`, { value: n3, enumerable: true }) : a3, n3));
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
    addEventListener(e32, t3) {
      this._listeners === void 0 && (this._listeners = {});
      let n3 = this._listeners;
      n3[e32] === void 0 && (n3[e32] = []), n3[e32].indexOf(t3) === -1 && n3[e32].push(t3);
    }
    hasEventListener(e32, t3) {
      let n3 = this._listeners;
      return n3 !== void 0 && n3[e32] !== void 0 && n3[e32].indexOf(t3) !== -1;
    }
    removeEventListener(e32, t3) {
      let n3 = this._listeners;
      if (n3 === void 0) return;
      let r3 = n3[e32];
      if (r3 !== void 0) {
        let e33 = r3.indexOf(t3);
        e33 !== -1 && r3.splice(e33, 1);
      }
    }
    dispatchEvent(e32) {
      let t3 = this._listeners;
      if (t3 === void 0) return;
      let n3 = t3[e32.type];
      if (n3 !== void 0) {
        e32.target = this;
        let t4 = n3.slice(0);
        for (let n4 = 0, r3 = t4.length; n4 < r3; n4++) t4[n4].call(this, e32);
        e32.target = null;
      }
    }
  };
  var qe = `00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`);
  var Je = Math.PI / 180;
  var Ye = 180 / Math.PI;
  function Xe() {
    let e32 = Math.random() * 4294967295 | 0, t3 = Math.random() * 4294967295 | 0, n3 = Math.random() * 4294967295 | 0, r3 = Math.random() * 4294967295 | 0;
    return (qe[e32 & 255] + qe[e32 >> 8 & 255] + qe[e32 >> 16 & 255] + qe[e32 >> 24 & 255] + `-` + qe[t3 & 255] + qe[t3 >> 8 & 255] + `-` + qe[t3 >> 16 & 15 | 64] + qe[t3 >> 24 & 255] + `-` + qe[n3 & 63 | 128] + qe[n3 >> 8 & 255] + `-` + qe[n3 >> 16 & 255] + qe[n3 >> 24 & 255] + qe[r3 & 255] + qe[r3 >> 8 & 255] + qe[r3 >> 16 & 255] + qe[r3 >> 24 & 255]).toLowerCase();
  }
  function H(e32, t3, n3) {
    return Math.max(t3, Math.min(n3, e32));
  }
  function Ze(e32, t3) {
    return (e32 % t3 + t3) % t3;
  }
  function Qe(e32, t3, n3) {
    return (1 - n3) * e32 + n3 * t3;
  }
  function $e(e32, t3) {
    switch (t3.constructor) {
      case Float32Array:
        return e32;
      case Uint32Array:
        return e32 / 4294967295;
      case Uint16Array:
        return e32 / 65535;
      case Uint8Array:
        return e32 / 255;
      case Int32Array:
        return Math.max(e32 / 2147483647, -1);
      case Int16Array:
        return Math.max(e32 / 32767, -1);
      case Int8Array:
        return Math.max(e32 / 127, -1);
      default:
        throw Error(`Invalid component type.`);
    }
  }
  function et(e32, t3) {
    switch (t3.constructor) {
      case Float32Array:
        return e32;
      case Uint32Array:
        return Math.round(e32 * 4294967295);
      case Uint16Array:
        return Math.round(e32 * 65535);
      case Uint8Array:
        return Math.round(e32 * 255);
      case Int32Array:
        return Math.round(e32 * 2147483647);
      case Int16Array:
        return Math.round(e32 * 32767);
      case Int8Array:
        return Math.round(e32 * 127);
      default:
        throw Error(`Invalid component type.`);
    }
  }
  var U = class e2 {
    constructor(t3 = 0, n3 = 0) {
      e2.prototype.isVector2 = true, this.x = t3, this.y = n3;
    }
    get width() {
      return this.x;
    }
    set width(e32) {
      this.x = e32;
    }
    get height() {
      return this.y;
    }
    set height(e32) {
      this.y = e32;
    }
    set(e32, t3) {
      return this.x = e32, this.y = t3, this;
    }
    setScalar(e32) {
      return this.x = e32, this.y = e32, this;
    }
    setX(e32) {
      return this.x = e32, this;
    }
    setY(e32) {
      return this.y = e32, this;
    }
    setComponent(e32, t3) {
      switch (e32) {
        case 0:
          this.x = t3;
          break;
        case 1:
          this.y = t3;
          break;
        default:
          throw Error(`index is out of range: ` + e32);
      }
      return this;
    }
    getComponent(e32) {
      switch (e32) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw Error(`index is out of range: ` + e32);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e32) {
      return this.x = e32.x, this.y = e32.y, this;
    }
    add(e32) {
      return this.x += e32.x, this.y += e32.y, this;
    }
    addScalar(e32) {
      return this.x += e32, this.y += e32, this;
    }
    addVectors(e32, t3) {
      return this.x = e32.x + t3.x, this.y = e32.y + t3.y, this;
    }
    addScaledVector(e32, t3) {
      return this.x += e32.x * t3, this.y += e32.y * t3, this;
    }
    sub(e32) {
      return this.x -= e32.x, this.y -= e32.y, this;
    }
    subScalar(e32) {
      return this.x -= e32, this.y -= e32, this;
    }
    subVectors(e32, t3) {
      return this.x = e32.x - t3.x, this.y = e32.y - t3.y, this;
    }
    multiply(e32) {
      return this.x *= e32.x, this.y *= e32.y, this;
    }
    multiplyScalar(e32) {
      return this.x *= e32, this.y *= e32, this;
    }
    divide(e32) {
      return this.x /= e32.x, this.y /= e32.y, this;
    }
    divideScalar(e32) {
      return this.multiplyScalar(1 / e32);
    }
    applyMatrix3(e32) {
      let t3 = this.x, n3 = this.y, r3 = e32.elements;
      return this.x = r3[0] * t3 + r3[3] * n3 + r3[6], this.y = r3[1] * t3 + r3[4] * n3 + r3[7], this;
    }
    min(e32) {
      return this.x = Math.min(this.x, e32.x), this.y = Math.min(this.y, e32.y), this;
    }
    max(e32) {
      return this.x = Math.max(this.x, e32.x), this.y = Math.max(this.y, e32.y), this;
    }
    clamp(e32, t3) {
      return this.x = H(this.x, e32.x, t3.x), this.y = H(this.y, e32.y, t3.y), this;
    }
    clampScalar(e32, t3) {
      return this.x = H(this.x, e32, t3), this.y = H(this.y, e32, t3), this;
    }
    clampLength(e32, t3) {
      let n3 = this.length();
      return this.divideScalar(n3 || 1).multiplyScalar(H(n3, e32, t3));
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
    dot(e32) {
      return this.x * e32.x + this.y * e32.y;
    }
    cross(e32) {
      return this.x * e32.y - this.y * e32.x;
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
    angleTo(e32) {
      let t3 = Math.sqrt(this.lengthSq() * e32.lengthSq());
      if (t3 === 0) return Math.PI / 2;
      let n3 = this.dot(e32) / t3;
      return Math.acos(H(n3, -1, 1));
    }
    distanceTo(e32) {
      return Math.sqrt(this.distanceToSquared(e32));
    }
    distanceToSquared(e32) {
      let t3 = this.x - e32.x, n3 = this.y - e32.y;
      return t3 * t3 + n3 * n3;
    }
    manhattanDistanceTo(e32) {
      return Math.abs(this.x - e32.x) + Math.abs(this.y - e32.y);
    }
    setLength(e32) {
      return this.normalize().multiplyScalar(e32);
    }
    lerp(e32, t3) {
      return this.x += (e32.x - this.x) * t3, this.y += (e32.y - this.y) * t3, this;
    }
    lerpVectors(e32, t3, n3) {
      return this.x = e32.x + (t3.x - e32.x) * n3, this.y = e32.y + (t3.y - e32.y) * n3, this;
    }
    equals(e32) {
      return e32.x === this.x && e32.y === this.y;
    }
    fromArray(e32, t3 = 0) {
      return this.x = e32[t3], this.y = e32[t3 + 1], this;
    }
    toArray(e32 = [], t3 = 0) {
      return e32[t3] = this.x, e32[t3 + 1] = this.y, e32;
    }
    fromBufferAttribute(e32, t3) {
      return this.x = e32.getX(t3), this.y = e32.getY(t3), this;
    }
    rotateAround(e32, t3) {
      let n3 = Math.cos(t3), r3 = Math.sin(t3), i3 = this.x - e32.x, a3 = this.y - e32.y;
      return this.x = i3 * n3 - a3 * r3 + e32.x, this.y = i3 * r3 + a3 * n3 + e32.y, this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  };
  var tt = class {
    constructor(e32 = 0, t3 = 0, n3 = 0, r3 = 1) {
      this.isQuaternion = true, this._x = e32, this._y = t3, this._z = n3, this._w = r3;
    }
    static slerpFlat(e32, t3, n3, r3, i3, a3, o3) {
      let s3 = n3[r3 + 0], c3 = n3[r3 + 1], l3 = n3[r3 + 2], u3 = n3[r3 + 3], d3 = i3[a3 + 0], f3 = i3[a3 + 1], p3 = i3[a3 + 2], m3 = i3[a3 + 3];
      if (o3 === 0) {
        e32[t3 + 0] = s3, e32[t3 + 1] = c3, e32[t3 + 2] = l3, e32[t3 + 3] = u3;
        return;
      }
      if (o3 === 1) {
        e32[t3 + 0] = d3, e32[t3 + 1] = f3, e32[t3 + 2] = p3, e32[t3 + 3] = m3;
        return;
      }
      if (u3 !== m3 || s3 !== d3 || c3 !== f3 || l3 !== p3) {
        let e33 = 1 - o3, t4 = s3 * d3 + c3 * f3 + l3 * p3 + u3 * m3, n4 = t4 >= 0 ? 1 : -1, r4 = 1 - t4 * t4;
        if (r4 > 2 ** -52) {
          let i5 = Math.sqrt(r4), a4 = Math.atan2(i5, t4 * n4);
          e33 = Math.sin(e33 * a4) / i5, o3 = Math.sin(o3 * a4) / i5;
        }
        let i4 = o3 * n4;
        if (s3 = s3 * e33 + d3 * i4, c3 = c3 * e33 + f3 * i4, l3 = l3 * e33 + p3 * i4, u3 = u3 * e33 + m3 * i4, e33 === 1 - o3) {
          let e34 = 1 / Math.sqrt(s3 * s3 + c3 * c3 + l3 * l3 + u3 * u3);
          s3 *= e34, c3 *= e34, l3 *= e34, u3 *= e34;
        }
      }
      e32[t3] = s3, e32[t3 + 1] = c3, e32[t3 + 2] = l3, e32[t3 + 3] = u3;
    }
    static multiplyQuaternionsFlat(e32, t3, n3, r3, i3, a3) {
      let o3 = n3[r3], s3 = n3[r3 + 1], c3 = n3[r3 + 2], l3 = n3[r3 + 3], u3 = i3[a3], d3 = i3[a3 + 1], f3 = i3[a3 + 2], p3 = i3[a3 + 3];
      return e32[t3] = o3 * p3 + l3 * u3 + s3 * f3 - c3 * d3, e32[t3 + 1] = s3 * p3 + l3 * d3 + c3 * u3 - o3 * f3, e32[t3 + 2] = c3 * p3 + l3 * f3 + o3 * d3 - s3 * u3, e32[t3 + 3] = l3 * p3 - o3 * u3 - s3 * d3 - c3 * f3, e32;
    }
    get x() {
      return this._x;
    }
    set x(e32) {
      this._x = e32, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e32) {
      this._y = e32, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e32) {
      this._z = e32, this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(e32) {
      this._w = e32, this._onChangeCallback();
    }
    set(e32, t3, n3, r3) {
      return this._x = e32, this._y = t3, this._z = n3, this._w = r3, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(e32) {
      return this._x = e32.x, this._y = e32.y, this._z = e32.z, this._w = e32.w, this._onChangeCallback(), this;
    }
    setFromEuler(e32, t3 = true) {
      let n3 = e32._x, r3 = e32._y, i3 = e32._z, a3 = e32._order, o3 = Math.cos, s3 = Math.sin, c3 = o3(n3 / 2), l3 = o3(r3 / 2), u3 = o3(i3 / 2), d3 = s3(n3 / 2), f3 = s3(r3 / 2), p3 = s3(i3 / 2);
      switch (a3) {
        case `XYZ`:
          this._x = d3 * l3 * u3 + c3 * f3 * p3, this._y = c3 * f3 * u3 - d3 * l3 * p3, this._z = c3 * l3 * p3 + d3 * f3 * u3, this._w = c3 * l3 * u3 - d3 * f3 * p3;
          break;
        case `YXZ`:
          this._x = d3 * l3 * u3 + c3 * f3 * p3, this._y = c3 * f3 * u3 - d3 * l3 * p3, this._z = c3 * l3 * p3 - d3 * f3 * u3, this._w = c3 * l3 * u3 + d3 * f3 * p3;
          break;
        case `ZXY`:
          this._x = d3 * l3 * u3 - c3 * f3 * p3, this._y = c3 * f3 * u3 + d3 * l3 * p3, this._z = c3 * l3 * p3 + d3 * f3 * u3, this._w = c3 * l3 * u3 - d3 * f3 * p3;
          break;
        case `ZYX`:
          this._x = d3 * l3 * u3 - c3 * f3 * p3, this._y = c3 * f3 * u3 + d3 * l3 * p3, this._z = c3 * l3 * p3 - d3 * f3 * u3, this._w = c3 * l3 * u3 + d3 * f3 * p3;
          break;
        case `YZX`:
          this._x = d3 * l3 * u3 + c3 * f3 * p3, this._y = c3 * f3 * u3 + d3 * l3 * p3, this._z = c3 * l3 * p3 - d3 * f3 * u3, this._w = c3 * l3 * u3 - d3 * f3 * p3;
          break;
        case `XZY`:
          this._x = d3 * l3 * u3 - c3 * f3 * p3, this._y = c3 * f3 * u3 - d3 * l3 * p3, this._z = c3 * l3 * p3 + d3 * f3 * u3, this._w = c3 * l3 * u3 + d3 * f3 * p3;
          break;
        default:
          console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: ` + a3);
      }
      return t3 === true && this._onChangeCallback(), this;
    }
    setFromAxisAngle(e32, t3) {
      let n3 = t3 / 2, r3 = Math.sin(n3);
      return this._x = e32.x * r3, this._y = e32.y * r3, this._z = e32.z * r3, this._w = Math.cos(n3), this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e32) {
      let t3 = e32.elements, n3 = t3[0], r3 = t3[4], i3 = t3[8], a3 = t3[1], o3 = t3[5], s3 = t3[9], c3 = t3[2], l3 = t3[6], u3 = t3[10], d3 = n3 + o3 + u3;
      if (d3 > 0) {
        let e33 = 0.5 / Math.sqrt(d3 + 1);
        this._w = 0.25 / e33, this._x = (l3 - s3) * e33, this._y = (i3 - c3) * e33, this._z = (a3 - r3) * e33;
      } else if (n3 > o3 && n3 > u3) {
        let e33 = 2 * Math.sqrt(1 + n3 - o3 - u3);
        this._w = (l3 - s3) / e33, this._x = 0.25 * e33, this._y = (r3 + a3) / e33, this._z = (i3 + c3) / e33;
      } else if (o3 > u3) {
        let e33 = 2 * Math.sqrt(1 + o3 - n3 - u3);
        this._w = (i3 - c3) / e33, this._x = (r3 + a3) / e33, this._y = 0.25 * e33, this._z = (s3 + l3) / e33;
      } else {
        let e33 = 2 * Math.sqrt(1 + u3 - n3 - o3);
        this._w = (a3 - r3) / e33, this._x = (i3 + c3) / e33, this._y = (s3 + l3) / e33, this._z = 0.25 * e33;
      }
      return this._onChangeCallback(), this;
    }
    setFromUnitVectors(e32, t3) {
      let n3 = e32.dot(t3) + 1;
      return n3 < 1e-8 ? (n3 = 0, Math.abs(e32.x) > Math.abs(e32.z) ? (this._x = -e32.y, this._y = e32.x, this._z = 0, this._w = n3) : (this._x = 0, this._y = -e32.z, this._z = e32.y, this._w = n3)) : (this._x = e32.y * t3.z - e32.z * t3.y, this._y = e32.z * t3.x - e32.x * t3.z, this._z = e32.x * t3.y - e32.y * t3.x, this._w = n3), this.normalize();
    }
    angleTo(e32) {
      return 2 * Math.acos(Math.abs(H(this.dot(e32), -1, 1)));
    }
    rotateTowards(e32, t3) {
      let n3 = this.angleTo(e32);
      if (n3 === 0) return this;
      let r3 = Math.min(1, t3 / n3);
      return this.slerp(e32, r3), this;
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
    dot(e32) {
      return this._x * e32._x + this._y * e32._y + this._z * e32._z + this._w * e32._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let e32 = this.length();
      return e32 === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e32 = 1 / e32, this._x *= e32, this._y *= e32, this._z *= e32, this._w *= e32), this._onChangeCallback(), this;
    }
    multiply(e32) {
      return this.multiplyQuaternions(this, e32);
    }
    premultiply(e32) {
      return this.multiplyQuaternions(e32, this);
    }
    multiplyQuaternions(e32, t3) {
      let n3 = e32._x, r3 = e32._y, i3 = e32._z, a3 = e32._w, o3 = t3._x, s3 = t3._y, c3 = t3._z, l3 = t3._w;
      return this._x = n3 * l3 + a3 * o3 + r3 * c3 - i3 * s3, this._y = r3 * l3 + a3 * s3 + i3 * o3 - n3 * c3, this._z = i3 * l3 + a3 * c3 + n3 * s3 - r3 * o3, this._w = a3 * l3 - n3 * o3 - r3 * s3 - i3 * c3, this._onChangeCallback(), this;
    }
    slerp(e32, t3) {
      if (t3 === 0) return this;
      if (t3 === 1) return this.copy(e32);
      let n3 = this._x, r3 = this._y, i3 = this._z, a3 = this._w, o3 = a3 * e32._w + n3 * e32._x + r3 * e32._y + i3 * e32._z;
      if (o3 < 0 ? (this._w = -e32._w, this._x = -e32._x, this._y = -e32._y, this._z = -e32._z, o3 = -o3) : this.copy(e32), o3 >= 1) return this._w = a3, this._x = n3, this._y = r3, this._z = i3, this;
      let s3 = 1 - o3 * o3;
      if (s3 <= 2 ** -52) {
        let e33 = 1 - t3;
        return this._w = e33 * a3 + t3 * this._w, this._x = e33 * n3 + t3 * this._x, this._y = e33 * r3 + t3 * this._y, this._z = e33 * i3 + t3 * this._z, this.normalize(), this;
      }
      let c3 = Math.sqrt(s3), l3 = Math.atan2(c3, o3), u3 = Math.sin((1 - t3) * l3) / c3, d3 = Math.sin(t3 * l3) / c3;
      return this._w = a3 * u3 + this._w * d3, this._x = n3 * u3 + this._x * d3, this._y = r3 * u3 + this._y * d3, this._z = i3 * u3 + this._z * d3, this._onChangeCallback(), this;
    }
    slerpQuaternions(e32, t3, n3) {
      return this.copy(e32).slerp(t3, n3);
    }
    random() {
      let e32 = 2 * Math.PI * Math.random(), t3 = 2 * Math.PI * Math.random(), n3 = Math.random(), r3 = Math.sqrt(1 - n3), i3 = Math.sqrt(n3);
      return this.set(r3 * Math.sin(e32), r3 * Math.cos(e32), i3 * Math.sin(t3), i3 * Math.cos(t3));
    }
    equals(e32) {
      return e32._x === this._x && e32._y === this._y && e32._z === this._z && e32._w === this._w;
    }
    fromArray(e32, t3 = 0) {
      return this._x = e32[t3], this._y = e32[t3 + 1], this._z = e32[t3 + 2], this._w = e32[t3 + 3], this._onChangeCallback(), this;
    }
    toArray(e32 = [], t3 = 0) {
      return e32[t3] = this._x, e32[t3 + 1] = this._y, e32[t3 + 2] = this._z, e32[t3 + 3] = this._w, e32;
    }
    fromBufferAttribute(e32, t3) {
      return this._x = e32.getX(t3), this._y = e32.getY(t3), this._z = e32.getZ(t3), this._w = e32.getW(t3), this._onChangeCallback(), this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(e32) {
      return this._onChangeCallback = e32, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._w;
    }
  };
  var W = class e3 {
    constructor(t3 = 0, n3 = 0, r3 = 0) {
      e3.prototype.isVector3 = true, this.x = t3, this.y = n3, this.z = r3;
    }
    set(e32, t3, n3) {
      return n3 === void 0 && (n3 = this.z), this.x = e32, this.y = t3, this.z = n3, this;
    }
    setScalar(e32) {
      return this.x = e32, this.y = e32, this.z = e32, this;
    }
    setX(e32) {
      return this.x = e32, this;
    }
    setY(e32) {
      return this.y = e32, this;
    }
    setZ(e32) {
      return this.z = e32, this;
    }
    setComponent(e32, t3) {
      switch (e32) {
        case 0:
          this.x = t3;
          break;
        case 1:
          this.y = t3;
          break;
        case 2:
          this.z = t3;
          break;
        default:
          throw Error(`index is out of range: ` + e32);
      }
      return this;
    }
    getComponent(e32) {
      switch (e32) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw Error(`index is out of range: ` + e32);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(e32) {
      return this.x = e32.x, this.y = e32.y, this.z = e32.z, this;
    }
    add(e32) {
      return this.x += e32.x, this.y += e32.y, this.z += e32.z, this;
    }
    addScalar(e32) {
      return this.x += e32, this.y += e32, this.z += e32, this;
    }
    addVectors(e32, t3) {
      return this.x = e32.x + t3.x, this.y = e32.y + t3.y, this.z = e32.z + t3.z, this;
    }
    addScaledVector(e32, t3) {
      return this.x += e32.x * t3, this.y += e32.y * t3, this.z += e32.z * t3, this;
    }
    sub(e32) {
      return this.x -= e32.x, this.y -= e32.y, this.z -= e32.z, this;
    }
    subScalar(e32) {
      return this.x -= e32, this.y -= e32, this.z -= e32, this;
    }
    subVectors(e32, t3) {
      return this.x = e32.x - t3.x, this.y = e32.y - t3.y, this.z = e32.z - t3.z, this;
    }
    multiply(e32) {
      return this.x *= e32.x, this.y *= e32.y, this.z *= e32.z, this;
    }
    multiplyScalar(e32) {
      return this.x *= e32, this.y *= e32, this.z *= e32, this;
    }
    multiplyVectors(e32, t3) {
      return this.x = e32.x * t3.x, this.y = e32.y * t3.y, this.z = e32.z * t3.z, this;
    }
    applyEuler(e32) {
      return this.applyQuaternion(rt.setFromEuler(e32));
    }
    applyAxisAngle(e32, t3) {
      return this.applyQuaternion(rt.setFromAxisAngle(e32, t3));
    }
    applyMatrix3(e32) {
      let t3 = this.x, n3 = this.y, r3 = this.z, i3 = e32.elements;
      return this.x = i3[0] * t3 + i3[3] * n3 + i3[6] * r3, this.y = i3[1] * t3 + i3[4] * n3 + i3[7] * r3, this.z = i3[2] * t3 + i3[5] * n3 + i3[8] * r3, this;
    }
    applyNormalMatrix(e32) {
      return this.applyMatrix3(e32).normalize();
    }
    applyMatrix4(e32) {
      let t3 = this.x, n3 = this.y, r3 = this.z, i3 = e32.elements, a3 = 1 / (i3[3] * t3 + i3[7] * n3 + i3[11] * r3 + i3[15]);
      return this.x = (i3[0] * t3 + i3[4] * n3 + i3[8] * r3 + i3[12]) * a3, this.y = (i3[1] * t3 + i3[5] * n3 + i3[9] * r3 + i3[13]) * a3, this.z = (i3[2] * t3 + i3[6] * n3 + i3[10] * r3 + i3[14]) * a3, this;
    }
    applyQuaternion(e32) {
      let t3 = this.x, n3 = this.y, r3 = this.z, i3 = e32.x, a3 = e32.y, o3 = e32.z, s3 = e32.w, c3 = 2 * (a3 * r3 - o3 * n3), l3 = 2 * (o3 * t3 - i3 * r3), u3 = 2 * (i3 * n3 - a3 * t3);
      return this.x = t3 + s3 * c3 + a3 * u3 - o3 * l3, this.y = n3 + s3 * l3 + o3 * c3 - i3 * u3, this.z = r3 + s3 * u3 + i3 * l3 - a3 * c3, this;
    }
    project(e32) {
      return this.applyMatrix4(e32.matrixWorldInverse).applyMatrix4(e32.projectionMatrix);
    }
    unproject(e32) {
      return this.applyMatrix4(e32.projectionMatrixInverse).applyMatrix4(e32.matrixWorld);
    }
    transformDirection(e32) {
      let t3 = this.x, n3 = this.y, r3 = this.z, i3 = e32.elements;
      return this.x = i3[0] * t3 + i3[4] * n3 + i3[8] * r3, this.y = i3[1] * t3 + i3[5] * n3 + i3[9] * r3, this.z = i3[2] * t3 + i3[6] * n3 + i3[10] * r3, this.normalize();
    }
    divide(e32) {
      return this.x /= e32.x, this.y /= e32.y, this.z /= e32.z, this;
    }
    divideScalar(e32) {
      return this.multiplyScalar(1 / e32);
    }
    min(e32) {
      return this.x = Math.min(this.x, e32.x), this.y = Math.min(this.y, e32.y), this.z = Math.min(this.z, e32.z), this;
    }
    max(e32) {
      return this.x = Math.max(this.x, e32.x), this.y = Math.max(this.y, e32.y), this.z = Math.max(this.z, e32.z), this;
    }
    clamp(e32, t3) {
      return this.x = H(this.x, e32.x, t3.x), this.y = H(this.y, e32.y, t3.y), this.z = H(this.z, e32.z, t3.z), this;
    }
    clampScalar(e32, t3) {
      return this.x = H(this.x, e32, t3), this.y = H(this.y, e32, t3), this.z = H(this.z, e32, t3), this;
    }
    clampLength(e32, t3) {
      let n3 = this.length();
      return this.divideScalar(n3 || 1).multiplyScalar(H(n3, e32, t3));
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
    dot(e32) {
      return this.x * e32.x + this.y * e32.y + this.z * e32.z;
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
    setLength(e32) {
      return this.normalize().multiplyScalar(e32);
    }
    lerp(e32, t3) {
      return this.x += (e32.x - this.x) * t3, this.y += (e32.y - this.y) * t3, this.z += (e32.z - this.z) * t3, this;
    }
    lerpVectors(e32, t3, n3) {
      return this.x = e32.x + (t3.x - e32.x) * n3, this.y = e32.y + (t3.y - e32.y) * n3, this.z = e32.z + (t3.z - e32.z) * n3, this;
    }
    cross(e32) {
      return this.crossVectors(this, e32);
    }
    crossVectors(e32, t3) {
      let n3 = e32.x, r3 = e32.y, i3 = e32.z, a3 = t3.x, o3 = t3.y, s3 = t3.z;
      return this.x = r3 * s3 - i3 * o3, this.y = i3 * a3 - n3 * s3, this.z = n3 * o3 - r3 * a3, this;
    }
    projectOnVector(e32) {
      let t3 = e32.lengthSq();
      if (t3 === 0) return this.set(0, 0, 0);
      let n3 = e32.dot(this) / t3;
      return this.copy(e32).multiplyScalar(n3);
    }
    projectOnPlane(e32) {
      return nt.copy(this).projectOnVector(e32), this.sub(nt);
    }
    reflect(e32) {
      return this.sub(nt.copy(e32).multiplyScalar(2 * this.dot(e32)));
    }
    angleTo(e32) {
      let t3 = Math.sqrt(this.lengthSq() * e32.lengthSq());
      if (t3 === 0) return Math.PI / 2;
      let n3 = this.dot(e32) / t3;
      return Math.acos(H(n3, -1, 1));
    }
    distanceTo(e32) {
      return Math.sqrt(this.distanceToSquared(e32));
    }
    distanceToSquared(e32) {
      let t3 = this.x - e32.x, n3 = this.y - e32.y, r3 = this.z - e32.z;
      return t3 * t3 + n3 * n3 + r3 * r3;
    }
    manhattanDistanceTo(e32) {
      return Math.abs(this.x - e32.x) + Math.abs(this.y - e32.y) + Math.abs(this.z - e32.z);
    }
    setFromSpherical(e32) {
      return this.setFromSphericalCoords(e32.radius, e32.phi, e32.theta);
    }
    setFromSphericalCoords(e32, t3, n3) {
      let r3 = Math.sin(t3) * e32;
      return this.x = r3 * Math.sin(n3), this.y = Math.cos(t3) * e32, this.z = r3 * Math.cos(n3), this;
    }
    setFromCylindrical(e32) {
      return this.setFromCylindricalCoords(e32.radius, e32.theta, e32.y);
    }
    setFromCylindricalCoords(e32, t3, n3) {
      return this.x = e32 * Math.sin(t3), this.y = n3, this.z = e32 * Math.cos(t3), this;
    }
    setFromMatrixPosition(e32) {
      let t3 = e32.elements;
      return this.x = t3[12], this.y = t3[13], this.z = t3[14], this;
    }
    setFromMatrixScale(e32) {
      let t3 = this.setFromMatrixColumn(e32, 0).length(), n3 = this.setFromMatrixColumn(e32, 1).length(), r3 = this.setFromMatrixColumn(e32, 2).length();
      return this.x = t3, this.y = n3, this.z = r3, this;
    }
    setFromMatrixColumn(e32, t3) {
      return this.fromArray(e32.elements, t3 * 4);
    }
    setFromMatrix3Column(e32, t3) {
      return this.fromArray(e32.elements, t3 * 3);
    }
    setFromEuler(e32) {
      return this.x = e32._x, this.y = e32._y, this.z = e32._z, this;
    }
    setFromColor(e32) {
      return this.x = e32.r, this.y = e32.g, this.z = e32.b, this;
    }
    equals(e32) {
      return e32.x === this.x && e32.y === this.y && e32.z === this.z;
    }
    fromArray(e32, t3 = 0) {
      return this.x = e32[t3], this.y = e32[t3 + 1], this.z = e32[t3 + 2], this;
    }
    toArray(e32 = [], t3 = 0) {
      return e32[t3] = this.x, e32[t3 + 1] = this.y, e32[t3 + 2] = this.z, e32;
    }
    fromBufferAttribute(e32, t3) {
      return this.x = e32.getX(t3), this.y = e32.getY(t3), this.z = e32.getZ(t3), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
    }
    randomDirection() {
      let e32 = Math.random() * Math.PI * 2, t3 = Math.random() * 2 - 1, n3 = Math.sqrt(1 - t3 * t3);
      return this.x = n3 * Math.cos(e32), this.y = t3, this.z = n3 * Math.sin(e32), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z;
    }
  };
  var nt = new W();
  var rt = new tt();
  var G = class e4 {
    constructor(t3, n3, r3, i3, a3, o3, s3, c3, l3) {
      e4.prototype.isMatrix3 = true, this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1], t3 !== void 0 && this.set(t3, n3, r3, i3, a3, o3, s3, c3, l3);
    }
    set(e32, t3, n3, r3, i3, a3, o3, s3, c3) {
      let l3 = this.elements;
      return l3[0] = e32, l3[1] = r3, l3[2] = o3, l3[3] = t3, l3[4] = i3, l3[5] = s3, l3[6] = n3, l3[7] = a3, l3[8] = c3, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
    }
    copy(e32) {
      let t3 = this.elements, n3 = e32.elements;
      return t3[0] = n3[0], t3[1] = n3[1], t3[2] = n3[2], t3[3] = n3[3], t3[4] = n3[4], t3[5] = n3[5], t3[6] = n3[6], t3[7] = n3[7], t3[8] = n3[8], this;
    }
    extractBasis(e32, t3, n3) {
      return e32.setFromMatrix3Column(this, 0), t3.setFromMatrix3Column(this, 1), n3.setFromMatrix3Column(this, 2), this;
    }
    setFromMatrix4(e32) {
      let t3 = e32.elements;
      return this.set(t3[0], t3[4], t3[8], t3[1], t3[5], t3[9], t3[2], t3[6], t3[10]), this;
    }
    multiply(e32) {
      return this.multiplyMatrices(this, e32);
    }
    premultiply(e32) {
      return this.multiplyMatrices(e32, this);
    }
    multiplyMatrices(e32, t3) {
      let n3 = e32.elements, r3 = t3.elements, i3 = this.elements, a3 = n3[0], o3 = n3[3], s3 = n3[6], c3 = n3[1], l3 = n3[4], u3 = n3[7], d3 = n3[2], f3 = n3[5], p3 = n3[8], m3 = r3[0], h3 = r3[3], g3 = r3[6], _3 = r3[1], v3 = r3[4], y3 = r3[7], b3 = r3[2], x3 = r3[5], S3 = r3[8];
      return i3[0] = a3 * m3 + o3 * _3 + s3 * b3, i3[3] = a3 * h3 + o3 * v3 + s3 * x3, i3[6] = a3 * g3 + o3 * y3 + s3 * S3, i3[1] = c3 * m3 + l3 * _3 + u3 * b3, i3[4] = c3 * h3 + l3 * v3 + u3 * x3, i3[7] = c3 * g3 + l3 * y3 + u3 * S3, i3[2] = d3 * m3 + f3 * _3 + p3 * b3, i3[5] = d3 * h3 + f3 * v3 + p3 * x3, i3[8] = d3 * g3 + f3 * y3 + p3 * S3, this;
    }
    multiplyScalar(e32) {
      let t3 = this.elements;
      return t3[0] *= e32, t3[3] *= e32, t3[6] *= e32, t3[1] *= e32, t3[4] *= e32, t3[7] *= e32, t3[2] *= e32, t3[5] *= e32, t3[8] *= e32, this;
    }
    determinant() {
      let e32 = this.elements, t3 = e32[0], n3 = e32[1], r3 = e32[2], i3 = e32[3], a3 = e32[4], o3 = e32[5], s3 = e32[6], c3 = e32[7], l3 = e32[8];
      return t3 * a3 * l3 - t3 * o3 * c3 - n3 * i3 * l3 + n3 * o3 * s3 + r3 * i3 * c3 - r3 * a3 * s3;
    }
    invert() {
      let e32 = this.elements, t3 = e32[0], n3 = e32[1], r3 = e32[2], i3 = e32[3], a3 = e32[4], o3 = e32[5], s3 = e32[6], c3 = e32[7], l3 = e32[8], u3 = l3 * a3 - o3 * c3, d3 = o3 * s3 - l3 * i3, f3 = c3 * i3 - a3 * s3, p3 = t3 * u3 + n3 * d3 + r3 * f3;
      if (p3 === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      let m3 = 1 / p3;
      return e32[0] = u3 * m3, e32[1] = (r3 * c3 - l3 * n3) * m3, e32[2] = (o3 * n3 - r3 * a3) * m3, e32[3] = d3 * m3, e32[4] = (l3 * t3 - r3 * s3) * m3, e32[5] = (r3 * i3 - o3 * t3) * m3, e32[6] = f3 * m3, e32[7] = (n3 * s3 - c3 * t3) * m3, e32[8] = (a3 * t3 - n3 * i3) * m3, this;
    }
    transpose() {
      let e32, t3 = this.elements;
      return e32 = t3[1], t3[1] = t3[3], t3[3] = e32, e32 = t3[2], t3[2] = t3[6], t3[6] = e32, e32 = t3[5], t3[5] = t3[7], t3[7] = e32, this;
    }
    getNormalMatrix(e32) {
      return this.setFromMatrix4(e32).invert().transpose();
    }
    transposeIntoArray(e32) {
      let t3 = this.elements;
      return e32[0] = t3[0], e32[1] = t3[3], e32[2] = t3[6], e32[3] = t3[1], e32[4] = t3[4], e32[5] = t3[7], e32[6] = t3[2], e32[7] = t3[5], e32[8] = t3[8], this;
    }
    setUvTransform(e32, t3, n3, r3, i3, a3, o3) {
      let s3 = Math.cos(i3), c3 = Math.sin(i3);
      return this.set(n3 * s3, n3 * c3, -n3 * (s3 * a3 + c3 * o3) + a3 + e32, -r3 * c3, r3 * s3, -r3 * (-c3 * a3 + s3 * o3) + o3 + t3, 0, 0, 1), this;
    }
    scale(e32, t3) {
      return this.premultiply(it.makeScale(e32, t3)), this;
    }
    rotate(e32) {
      return this.premultiply(it.makeRotation(-e32)), this;
    }
    translate(e32, t3) {
      return this.premultiply(it.makeTranslation(e32, t3)), this;
    }
    makeTranslation(e32, t3) {
      return e32.isVector2 ? this.set(1, 0, e32.x, 0, 1, e32.y, 0, 0, 1) : this.set(1, 0, e32, 0, 1, t3, 0, 0, 1), this;
    }
    makeRotation(e32) {
      let t3 = Math.cos(e32), n3 = Math.sin(e32);
      return this.set(t3, -n3, 0, n3, t3, 0, 0, 0, 1), this;
    }
    makeScale(e32, t3) {
      return this.set(e32, 0, 0, 0, t3, 0, 0, 0, 1), this;
    }
    equals(e32) {
      let t3 = this.elements, n3 = e32.elements;
      for (let e33 = 0; e33 < 9; e33++) if (t3[e33] !== n3[e33]) return false;
      return true;
    }
    fromArray(e32, t3 = 0) {
      for (let n3 = 0; n3 < 9; n3++) this.elements[n3] = e32[n3 + t3];
      return this;
    }
    toArray(e32 = [], t3 = 0) {
      let n3 = this.elements;
      return e32[t3] = n3[0], e32[t3 + 1] = n3[1], e32[t3 + 2] = n3[2], e32[t3 + 3] = n3[3], e32[t3 + 4] = n3[4], e32[t3 + 5] = n3[5], e32[t3 + 6] = n3[6], e32[t3 + 7] = n3[7], e32[t3 + 8] = n3[8], e32;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  };
  var it = new G();
  function at(e32) {
    for (let t3 = e32.length - 1; t3 >= 0; --t3) if (e32[t3] >= 65535) return true;
    return false;
  }
  function ot(e32) {
    return document.createElementNS(`http://www.w3.org/1999/xhtml`, e32);
  }
  function st() {
    let e32 = ot(`canvas`);
    return e32.style.display = `block`, e32;
  }
  var ct = {};
  function lt(e32) {
    e32 in ct || (ct[e32] = true, console.warn(e32));
  }
  function ut(e32, t3, n3) {
    return new Promise(function(r3, i3) {
      function a3() {
        switch (e32.clientWaitSync(t3, e32.SYNC_FLUSH_COMMANDS_BIT, 0)) {
          case e32.WAIT_FAILED:
            i3();
            break;
          case e32.TIMEOUT_EXPIRED:
            setTimeout(a3, n3);
            break;
          default:
            r3();
        }
      }
      setTimeout(a3, n3);
    });
  }
  var dt = new G().set(0.4123908, 0.3575843, 0.1804808, 0.212639, 0.7151687, 0.0721923, 0.0193308, 0.1191948, 0.9505322);
  var ft = new G().set(3.2409699, -1.5373832, -0.4986108, -0.9692436, 1.8759675, 0.0415551, 0.0556301, -0.203977, 1.0569715);
  function pt() {
    let e32 = { enabled: true, workingColorSpace: Be, spaces: {}, convert: function(e33, t4, n4) {
      return this.enabled === false || t4 === n4 || !t4 || !n4 ? e33 : (this.spaces[t4].transfer === `srgb` && (e33.r = mt(e33.r), e33.g = mt(e33.g), e33.b = mt(e33.b)), this.spaces[t4].primaries !== this.spaces[n4].primaries && (e33.applyMatrix3(this.spaces[t4].toXYZ), e33.applyMatrix3(this.spaces[n4].fromXYZ)), this.spaces[n4].transfer === `srgb` && (e33.r = ht(e33.r), e33.g = ht(e33.g), e33.b = ht(e33.b)), e33);
    }, workingToColorSpace: function(e33, t4) {
      return this.convert(e33, this.workingColorSpace, t4);
    }, colorSpaceToWorking: function(e33, t4) {
      return this.convert(e33, t4, this.workingColorSpace);
    }, getPrimaries: function(e33) {
      return this.spaces[e33].primaries;
    }, getTransfer: function(e33) {
      return e33 === `` ? Ve : this.spaces[e33].transfer;
    }, getToneMappingMode: function(e33) {
      return this.spaces[e33].outputColorSpaceConfig.toneMappingMode || `standard`;
    }, getLuminanceCoefficients: function(e33, t4 = this.workingColorSpace) {
      return e33.fromArray(this.spaces[t4].luminanceCoefficients);
    }, define: function(e33) {
      Object.assign(this.spaces, e33);
    }, _getMatrix: function(e33, t4, n4) {
      return e33.copy(this.spaces[t4].toXYZ).multiply(this.spaces[n4].fromXYZ);
    }, _getDrawingBufferColorSpace: function(e33) {
      return this.spaces[e33].outputColorSpaceConfig.drawingBufferColorSpace;
    }, _getUnpackColorSpace: function(e33 = this.workingColorSpace) {
      return this.spaces[e33].workingColorSpaceConfig.unpackColorSpace;
    }, fromWorkingColorSpace: function(t4, n4) {
      return lt(`THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`), e32.workingToColorSpace(t4, n4);
    }, toWorkingColorSpace: function(t4, n4) {
      return lt(`THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`), e32.colorSpaceToWorking(t4, n4);
    } }, t3 = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], n3 = [0.2126, 0.7152, 0.0722], r3 = [0.3127, 0.329];
    return e32.define({ [Be]: { primaries: t3, whitePoint: r3, transfer: Ve, toXYZ: dt, fromXYZ: ft, luminanceCoefficients: n3, workingColorSpaceConfig: { unpackColorSpace: ze }, outputColorSpaceConfig: { drawingBufferColorSpace: ze } }, [ze]: { primaries: t3, whitePoint: r3, transfer: He, toXYZ: dt, fromXYZ: ft, luminanceCoefficients: n3, outputColorSpaceConfig: { drawingBufferColorSpace: ze } } }), e32;
  }
  var K = pt();
  function mt(e32) {
    return e32 < 0.04045 ? e32 * 0.0773993808 : (e32 * 0.9478672986 + 0.0521327014) ** 2.4;
  }
  function ht(e32) {
    return e32 < 31308e-7 ? e32 * 12.92 : 1.055 * e32 ** 0.41666 - 0.055;
  }
  var gt;
  var _t = class {
    static getDataURL(e32, t3 = `image/png`) {
      if (/^data:/i.test(e32.src) || typeof HTMLCanvasElement > `u`) return e32.src;
      let n3;
      if (e32 instanceof HTMLCanvasElement) n3 = e32;
      else {
        gt === void 0 && (gt = ot(`canvas`)), gt.width = e32.width, gt.height = e32.height;
        let t4 = gt.getContext(`2d`);
        e32 instanceof ImageData ? t4.putImageData(e32, 0, 0) : t4.drawImage(e32, 0, 0, e32.width, e32.height), n3 = gt;
      }
      return n3.toDataURL(t3);
    }
    static sRGBToLinear(e32) {
      if (typeof HTMLImageElement < `u` && e32 instanceof HTMLImageElement || typeof HTMLCanvasElement < `u` && e32 instanceof HTMLCanvasElement || typeof ImageBitmap < `u` && e32 instanceof ImageBitmap) {
        let t3 = ot(`canvas`);
        t3.width = e32.width, t3.height = e32.height;
        let n3 = t3.getContext(`2d`);
        n3.drawImage(e32, 0, 0, e32.width, e32.height);
        let r3 = n3.getImageData(0, 0, e32.width, e32.height), i3 = r3.data;
        for (let e33 = 0; e33 < i3.length; e33++) i3[e33] = mt(i3[e33] / 255) * 255;
        return n3.putImageData(r3, 0, 0), t3;
      } else if (e32.data) {
        let t3 = e32.data.slice(0);
        for (let e33 = 0; e33 < t3.length; e33++) t3 instanceof Uint8Array || t3 instanceof Uint8ClampedArray ? t3[e33] = Math.floor(mt(t3[e33] / 255) * 255) : t3[e33] = mt(t3[e33]);
        return { data: t3, width: e32.width, height: e32.height };
      } else return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`), e32;
    }
  };
  var vt = 0;
  var yt = class {
    constructor(e32 = null) {
      this.isSource = true, Object.defineProperty(this, "id", { value: vt++ }), this.uuid = Xe(), this.data = e32, this.dataReady = true, this.version = 0;
    }
    getSize(e32) {
      let t3 = this.data;
      return typeof HTMLVideoElement < `u` && t3 instanceof HTMLVideoElement ? e32.set(t3.videoWidth, t3.videoHeight, 0) : t3 instanceof VideoFrame ? e32.set(t3.displayHeight, t3.displayWidth, 0) : t3 === null ? e32.set(0, 0, 0) : e32.set(t3.width, t3.height, t3.depth || 0), e32;
    }
    set needsUpdate(e32) {
      e32 === true && this.version++;
    }
    toJSON(e32) {
      let t3 = e32 === void 0 || typeof e32 == `string`;
      if (!t3 && e32.images[this.uuid] !== void 0) return e32.images[this.uuid];
      let n3 = { uuid: this.uuid, url: `` }, r3 = this.data;
      if (r3 !== null) {
        let e33;
        if (Array.isArray(r3)) {
          e33 = [];
          for (let t4 = 0, n4 = r3.length; t4 < n4; t4++) r3[t4].isDataTexture ? e33.push(bt(r3[t4].image)) : e33.push(bt(r3[t4]));
        } else e33 = bt(r3);
        n3.url = e33;
      }
      return t3 || (e32.images[this.uuid] = n3), n3;
    }
  };
  function bt(e32) {
    return typeof HTMLImageElement < `u` && e32 instanceof HTMLImageElement || typeof HTMLCanvasElement < `u` && e32 instanceof HTMLCanvasElement || typeof ImageBitmap < `u` && e32 instanceof ImageBitmap ? _t.getDataURL(e32) : e32.data ? { data: Array.from(e32.data), width: e32.width, height: e32.height, type: e32.data.constructor.name } : (console.warn(`THREE.Texture: Unable to serialize Texture.`), {});
  }
  var xt = 0;
  var St = new W();
  var Ct = class e5 extends Ke {
    constructor(t3 = e5.DEFAULT_IMAGE, n3 = e5.DEFAULT_MAPPING, r3 = u, i3 = u, a3 = h, o3 = _, s3 = te, c3 = v, l3 = e5.DEFAULT_ANISOTROPY, d3 = ``) {
      super(), this.isTexture = true, Object.defineProperty(this, "id", { value: xt++ }), this.uuid = Xe(), this.name = ``, this.source = new yt(t3), this.mipmaps = [], this.mapping = n3, this.channel = 0, this.wrapS = r3, this.wrapT = i3, this.magFilter = a3, this.minFilter = o3, this.anisotropy = l3, this.format = s3, this.internalFormat = null, this.type = c3, this.offset = new U(0, 0), this.repeat = new U(1, 1), this.center = new U(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new G(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = d3, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = false, this.isArrayTexture = !!(t3 && t3.depth && t3.depth > 1), this.pmremVersion = 0;
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
    set image(e32 = null) {
      this.source.data = e32;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    addUpdateRange(e32, t3) {
      this.updateRanges.push({ start: e32, count: t3 });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e32) {
      return this.name = e32.name, this.source = e32.source, this.mipmaps = e32.mipmaps.slice(0), this.mapping = e32.mapping, this.channel = e32.channel, this.wrapS = e32.wrapS, this.wrapT = e32.wrapT, this.magFilter = e32.magFilter, this.minFilter = e32.minFilter, this.anisotropy = e32.anisotropy, this.format = e32.format, this.internalFormat = e32.internalFormat, this.type = e32.type, this.offset.copy(e32.offset), this.repeat.copy(e32.repeat), this.center.copy(e32.center), this.rotation = e32.rotation, this.matrixAutoUpdate = e32.matrixAutoUpdate, this.matrix.copy(e32.matrix), this.generateMipmaps = e32.generateMipmaps, this.premultiplyAlpha = e32.premultiplyAlpha, this.flipY = e32.flipY, this.unpackAlignment = e32.unpackAlignment, this.colorSpace = e32.colorSpace, this.renderTarget = e32.renderTarget, this.isRenderTargetTexture = e32.isRenderTargetTexture, this.isArrayTexture = e32.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e32.userData)), this.needsUpdate = true, this;
    }
    setValues(e32) {
      for (let t3 in e32) {
        let n3 = e32[t3];
        if (n3 === void 0) {
          console.warn(`THREE.Texture.setValues(): parameter '${t3}' has value of undefined.`);
          continue;
        }
        let r3 = this[t3];
        if (r3 === void 0) {
          console.warn(`THREE.Texture.setValues(): property '${t3}' does not exist.`);
          continue;
        }
        r3 && n3 && r3.isVector2 && n3.isVector2 || r3 && n3 && r3.isVector3 && n3.isVector3 || r3 && n3 && r3.isMatrix3 && n3.isMatrix3 ? r3.copy(n3) : this[t3] = n3;
      }
    }
    toJSON(e32) {
      let t3 = e32 === void 0 || typeof e32 == `string`;
      if (!t3 && e32.textures[this.uuid] !== void 0) return e32.textures[this.uuid];
      let n3 = { metadata: { version: 4.7, type: `Texture`, generator: `Texture.toJSON` }, uuid: this.uuid, name: this.name, image: this.source.toJSON(e32).uuid, mapping: this.mapping, channel: this.channel, repeat: [this.repeat.x, this.repeat.y], offset: [this.offset.x, this.offset.y], center: [this.center.x, this.center.y], rotation: this.rotation, wrap: [this.wrapS, this.wrapT], format: this.format, internalFormat: this.internalFormat, type: this.type, colorSpace: this.colorSpace, minFilter: this.minFilter, magFilter: this.magFilter, anisotropy: this.anisotropy, flipY: this.flipY, generateMipmaps: this.generateMipmaps, premultiplyAlpha: this.premultiplyAlpha, unpackAlignment: this.unpackAlignment };
      return Object.keys(this.userData).length > 0 && (n3.userData = this.userData), t3 || (e32.textures[this.uuid] = n3), n3;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
    transformUv(e32) {
      if (this.mapping !== 300) return e32;
      if (e32.applyMatrix3(this.matrix), e32.x < 0 || e32.x > 1) switch (this.wrapS) {
        case l:
          e32.x -= Math.floor(e32.x);
          break;
        case u:
          e32.x = e32.x < 0 ? 0 : 1;
          break;
        case d:
          Math.abs(Math.floor(e32.x) % 2) === 1 ? e32.x = Math.ceil(e32.x) - e32.x : e32.x -= Math.floor(e32.x);
          break;
      }
      if (e32.y < 0 || e32.y > 1) switch (this.wrapT) {
        case l:
          e32.y -= Math.floor(e32.y);
          break;
        case u:
          e32.y = e32.y < 0 ? 0 : 1;
          break;
        case d:
          Math.abs(Math.floor(e32.y) % 2) === 1 ? e32.y = Math.ceil(e32.y) - e32.y : e32.y -= Math.floor(e32.y);
          break;
      }
      return this.flipY && (e32.y = 1 - e32.y), e32;
    }
    set needsUpdate(e32) {
      e32 === true && (this.version++, this.source.needsUpdate = true);
    }
    set needsPMREMUpdate(e32) {
      e32 === true && this.pmremVersion++;
    }
  };
  Ct.DEFAULT_IMAGE = null, Ct.DEFAULT_MAPPING = 300, Ct.DEFAULT_ANISOTROPY = 1;
  var wt = class e6 {
    constructor(t3 = 0, n3 = 0, r3 = 0, i3 = 1) {
      e6.prototype.isVector4 = true, this.x = t3, this.y = n3, this.z = r3, this.w = i3;
    }
    get width() {
      return this.z;
    }
    set width(e32) {
      this.z = e32;
    }
    get height() {
      return this.w;
    }
    set height(e32) {
      this.w = e32;
    }
    set(e32, t3, n3, r3) {
      return this.x = e32, this.y = t3, this.z = n3, this.w = r3, this;
    }
    setScalar(e32) {
      return this.x = e32, this.y = e32, this.z = e32, this.w = e32, this;
    }
    setX(e32) {
      return this.x = e32, this;
    }
    setY(e32) {
      return this.y = e32, this;
    }
    setZ(e32) {
      return this.z = e32, this;
    }
    setW(e32) {
      return this.w = e32, this;
    }
    setComponent(e32, t3) {
      switch (e32) {
        case 0:
          this.x = t3;
          break;
        case 1:
          this.y = t3;
          break;
        case 2:
          this.z = t3;
          break;
        case 3:
          this.w = t3;
          break;
        default:
          throw Error(`index is out of range: ` + e32);
      }
      return this;
    }
    getComponent(e32) {
      switch (e32) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw Error(`index is out of range: ` + e32);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(e32) {
      return this.x = e32.x, this.y = e32.y, this.z = e32.z, this.w = e32.w === void 0 ? 1 : e32.w, this;
    }
    add(e32) {
      return this.x += e32.x, this.y += e32.y, this.z += e32.z, this.w += e32.w, this;
    }
    addScalar(e32) {
      return this.x += e32, this.y += e32, this.z += e32, this.w += e32, this;
    }
    addVectors(e32, t3) {
      return this.x = e32.x + t3.x, this.y = e32.y + t3.y, this.z = e32.z + t3.z, this.w = e32.w + t3.w, this;
    }
    addScaledVector(e32, t3) {
      return this.x += e32.x * t3, this.y += e32.y * t3, this.z += e32.z * t3, this.w += e32.w * t3, this;
    }
    sub(e32) {
      return this.x -= e32.x, this.y -= e32.y, this.z -= e32.z, this.w -= e32.w, this;
    }
    subScalar(e32) {
      return this.x -= e32, this.y -= e32, this.z -= e32, this.w -= e32, this;
    }
    subVectors(e32, t3) {
      return this.x = e32.x - t3.x, this.y = e32.y - t3.y, this.z = e32.z - t3.z, this.w = e32.w - t3.w, this;
    }
    multiply(e32) {
      return this.x *= e32.x, this.y *= e32.y, this.z *= e32.z, this.w *= e32.w, this;
    }
    multiplyScalar(e32) {
      return this.x *= e32, this.y *= e32, this.z *= e32, this.w *= e32, this;
    }
    applyMatrix4(e32) {
      let t3 = this.x, n3 = this.y, r3 = this.z, i3 = this.w, a3 = e32.elements;
      return this.x = a3[0] * t3 + a3[4] * n3 + a3[8] * r3 + a3[12] * i3, this.y = a3[1] * t3 + a3[5] * n3 + a3[9] * r3 + a3[13] * i3, this.z = a3[2] * t3 + a3[6] * n3 + a3[10] * r3 + a3[14] * i3, this.w = a3[3] * t3 + a3[7] * n3 + a3[11] * r3 + a3[15] * i3, this;
    }
    divide(e32) {
      return this.x /= e32.x, this.y /= e32.y, this.z /= e32.z, this.w /= e32.w, this;
    }
    divideScalar(e32) {
      return this.multiplyScalar(1 / e32);
    }
    setAxisAngleFromQuaternion(e32) {
      this.w = 2 * Math.acos(e32.w);
      let t3 = Math.sqrt(1 - e32.w * e32.w);
      return t3 < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e32.x / t3, this.y = e32.y / t3, this.z = e32.z / t3), this;
    }
    setAxisAngleFromRotationMatrix(e32) {
      let t3, n3, r3, i3, a3 = 0.01, o3 = 0.1, s3 = e32.elements, c3 = s3[0], l3 = s3[4], u3 = s3[8], d3 = s3[1], f3 = s3[5], p3 = s3[9], m3 = s3[2], h3 = s3[6], g3 = s3[10];
      if (Math.abs(l3 - d3) < a3 && Math.abs(u3 - m3) < a3 && Math.abs(p3 - h3) < a3) {
        if (Math.abs(l3 + d3) < o3 && Math.abs(u3 + m3) < o3 && Math.abs(p3 + h3) < o3 && Math.abs(c3 + f3 + g3 - 3) < o3) return this.set(1, 0, 0, 0), this;
        t3 = Math.PI;
        let e33 = (c3 + 1) / 2, s4 = (f3 + 1) / 2, _4 = (g3 + 1) / 2, v3 = (l3 + d3) / 4, y3 = (u3 + m3) / 4, b3 = (p3 + h3) / 4;
        return e33 > s4 && e33 > _4 ? e33 < a3 ? (n3 = 0, r3 = 0.707106781, i3 = 0.707106781) : (n3 = Math.sqrt(e33), r3 = v3 / n3, i3 = y3 / n3) : s4 > _4 ? s4 < a3 ? (n3 = 0.707106781, r3 = 0, i3 = 0.707106781) : (r3 = Math.sqrt(s4), n3 = v3 / r3, i3 = b3 / r3) : _4 < a3 ? (n3 = 0.707106781, r3 = 0.707106781, i3 = 0) : (i3 = Math.sqrt(_4), n3 = y3 / i3, r3 = b3 / i3), this.set(n3, r3, i3, t3), this;
      }
      let _3 = Math.sqrt((h3 - p3) * (h3 - p3) + (u3 - m3) * (u3 - m3) + (d3 - l3) * (d3 - l3));
      return Math.abs(_3) < 1e-3 && (_3 = 1), this.x = (h3 - p3) / _3, this.y = (u3 - m3) / _3, this.z = (d3 - l3) / _3, this.w = Math.acos((c3 + f3 + g3 - 1) / 2), this;
    }
    setFromMatrixPosition(e32) {
      let t3 = e32.elements;
      return this.x = t3[12], this.y = t3[13], this.z = t3[14], this.w = t3[15], this;
    }
    min(e32) {
      return this.x = Math.min(this.x, e32.x), this.y = Math.min(this.y, e32.y), this.z = Math.min(this.z, e32.z), this.w = Math.min(this.w, e32.w), this;
    }
    max(e32) {
      return this.x = Math.max(this.x, e32.x), this.y = Math.max(this.y, e32.y), this.z = Math.max(this.z, e32.z), this.w = Math.max(this.w, e32.w), this;
    }
    clamp(e32, t3) {
      return this.x = H(this.x, e32.x, t3.x), this.y = H(this.y, e32.y, t3.y), this.z = H(this.z, e32.z, t3.z), this.w = H(this.w, e32.w, t3.w), this;
    }
    clampScalar(e32, t3) {
      return this.x = H(this.x, e32, t3), this.y = H(this.y, e32, t3), this.z = H(this.z, e32, t3), this.w = H(this.w, e32, t3), this;
    }
    clampLength(e32, t3) {
      let n3 = this.length();
      return this.divideScalar(n3 || 1).multiplyScalar(H(n3, e32, t3));
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
    dot(e32) {
      return this.x * e32.x + this.y * e32.y + this.z * e32.z + this.w * e32.w;
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
    setLength(e32) {
      return this.normalize().multiplyScalar(e32);
    }
    lerp(e32, t3) {
      return this.x += (e32.x - this.x) * t3, this.y += (e32.y - this.y) * t3, this.z += (e32.z - this.z) * t3, this.w += (e32.w - this.w) * t3, this;
    }
    lerpVectors(e32, t3, n3) {
      return this.x = e32.x + (t3.x - e32.x) * n3, this.y = e32.y + (t3.y - e32.y) * n3, this.z = e32.z + (t3.z - e32.z) * n3, this.w = e32.w + (t3.w - e32.w) * n3, this;
    }
    equals(e32) {
      return e32.x === this.x && e32.y === this.y && e32.z === this.z && e32.w === this.w;
    }
    fromArray(e32, t3 = 0) {
      return this.x = e32[t3], this.y = e32[t3 + 1], this.z = e32[t3 + 2], this.w = e32[t3 + 3], this;
    }
    toArray(e32 = [], t3 = 0) {
      return e32[t3] = this.x, e32[t3 + 1] = this.y, e32[t3 + 2] = this.z, e32[t3 + 3] = this.w, e32;
    }
    fromBufferAttribute(e32, t3) {
      return this.x = e32.getX(t3), this.y = e32.getY(t3), this.z = e32.getZ(t3), this.w = e32.getW(t3), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  };
  var Tt = class extends Ke {
    constructor(e32 = 1, t3 = 1, n3 = {}) {
      super(), n3 = Object.assign({ generateMipmaps: false, internalFormat: null, minFilter: h, depthBuffer: true, stencilBuffer: false, resolveDepthBuffer: true, resolveStencilBuffer: true, depthTexture: null, samples: 0, count: 1, depth: 1, multiview: false }, n3), this.isRenderTarget = true, this.width = e32, this.height = t3, this.depth = n3.depth, this.scissor = new wt(0, 0, e32, t3), this.scissorTest = false, this.viewport = new wt(0, 0, e32, t3);
      let r3 = new Ct({ width: e32, height: t3, depth: n3.depth });
      this.textures = [];
      let i3 = n3.count;
      for (let e33 = 0; e33 < i3; e33++) this.textures[e33] = r3.clone(), this.textures[e33].isRenderTargetTexture = true, this.textures[e33].renderTarget = this;
      this._setTextureOptions(n3), this.depthBuffer = n3.depthBuffer, this.stencilBuffer = n3.stencilBuffer, this.resolveDepthBuffer = n3.resolveDepthBuffer, this.resolveStencilBuffer = n3.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n3.depthTexture, this.samples = n3.samples, this.multiview = n3.multiview;
    }
    _setTextureOptions(e32 = {}) {
      let t3 = { minFilter: h, generateMipmaps: false, flipY: false, internalFormat: null };
      e32.mapping !== void 0 && (t3.mapping = e32.mapping), e32.wrapS !== void 0 && (t3.wrapS = e32.wrapS), e32.wrapT !== void 0 && (t3.wrapT = e32.wrapT), e32.wrapR !== void 0 && (t3.wrapR = e32.wrapR), e32.magFilter !== void 0 && (t3.magFilter = e32.magFilter), e32.minFilter !== void 0 && (t3.minFilter = e32.minFilter), e32.format !== void 0 && (t3.format = e32.format), e32.type !== void 0 && (t3.type = e32.type), e32.anisotropy !== void 0 && (t3.anisotropy = e32.anisotropy), e32.colorSpace !== void 0 && (t3.colorSpace = e32.colorSpace), e32.flipY !== void 0 && (t3.flipY = e32.flipY), e32.generateMipmaps !== void 0 && (t3.generateMipmaps = e32.generateMipmaps), e32.internalFormat !== void 0 && (t3.internalFormat = e32.internalFormat);
      for (let e33 = 0; e33 < this.textures.length; e33++) this.textures[e33].setValues(t3);
    }
    get texture() {
      return this.textures[0];
    }
    set texture(e32) {
      this.textures[0] = e32;
    }
    set depthTexture(e32) {
      this._depthTexture !== null && (this._depthTexture.renderTarget = null), e32 !== null && (e32.renderTarget = this), this._depthTexture = e32;
    }
    get depthTexture() {
      return this._depthTexture;
    }
    setSize(e32, t3, n3 = 1) {
      if (this.width !== e32 || this.height !== t3 || this.depth !== n3) {
        this.width = e32, this.height = t3, this.depth = n3;
        for (let r3 = 0, i3 = this.textures.length; r3 < i3; r3++) this.textures[r3].image.width = e32, this.textures[r3].image.height = t3, this.textures[r3].image.depth = n3, this.textures[r3].isArrayTexture = this.textures[r3].image.depth > 1;
        this.dispose();
      }
      this.viewport.set(0, 0, e32, t3), this.scissor.set(0, 0, e32, t3);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e32) {
      this.width = e32.width, this.height = e32.height, this.depth = e32.depth, this.scissor.copy(e32.scissor), this.scissorTest = e32.scissorTest, this.viewport.copy(e32.viewport), this.textures.length = 0;
      for (let t3 = 0, n3 = e32.textures.length; t3 < n3; t3++) {
        this.textures[t3] = e32.textures[t3].clone(), this.textures[t3].isRenderTargetTexture = true, this.textures[t3].renderTarget = this;
        let n4 = Object.assign({}, e32.textures[t3].image);
        this.textures[t3].source = new yt(n4);
      }
      return this.depthBuffer = e32.depthBuffer, this.stencilBuffer = e32.stencilBuffer, this.resolveDepthBuffer = e32.resolveDepthBuffer, this.resolveStencilBuffer = e32.resolveStencilBuffer, e32.depthTexture !== null && (this.depthTexture = e32.depthTexture.clone()), this.samples = e32.samples, this;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
  };
  var Et = class extends Tt {
    constructor(e32 = 1, t3 = 1, n3 = {}) {
      super(e32, t3, n3), this.isWebGLRenderTarget = true;
    }
  };
  var Dt = class extends Ct {
    constructor(e32 = null, t3 = 1, n3 = 1, r3 = 1) {
      super(null), this.isDataArrayTexture = true, this.image = { data: e32, width: t3, height: n3, depth: r3 }, this.magFilter = f, this.minFilter = f, this.wrapR = u, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
    }
    addLayerUpdate(e32) {
      this.layerUpdates.add(e32);
    }
    clearLayerUpdates() {
      this.layerUpdates.clear();
    }
  };
  var Ot = class extends Ct {
    constructor(e32 = null, t3 = 1, n3 = 1, r3 = 1) {
      super(null), this.isData3DTexture = true, this.image = { data: e32, width: t3, height: n3, depth: r3 }, this.magFilter = f, this.minFilter = f, this.wrapR = u, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var kt = class {
    constructor(e32 = new W(1 / 0, 1 / 0, 1 / 0), t3 = new W(-1 / 0, -1 / 0, -1 / 0)) {
      this.isBox3 = true, this.min = e32, this.max = t3;
    }
    set(e32, t3) {
      return this.min.copy(e32), this.max.copy(t3), this;
    }
    setFromArray(e32) {
      this.makeEmpty();
      for (let t3 = 0, n3 = e32.length; t3 < n3; t3 += 3) this.expandByPoint(jt.fromArray(e32, t3));
      return this;
    }
    setFromBufferAttribute(e32) {
      this.makeEmpty();
      for (let t3 = 0, n3 = e32.count; t3 < n3; t3++) this.expandByPoint(jt.fromBufferAttribute(e32, t3));
      return this;
    }
    setFromPoints(e32) {
      this.makeEmpty();
      for (let t3 = 0, n3 = e32.length; t3 < n3; t3++) this.expandByPoint(e32[t3]);
      return this;
    }
    setFromCenterAndSize(e32, t3) {
      let n3 = jt.copy(t3).multiplyScalar(0.5);
      return this.min.copy(e32).sub(n3), this.max.copy(e32).add(n3), this;
    }
    setFromObject(e32, t3 = false) {
      return this.makeEmpty(), this.expandByObject(e32, t3);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e32) {
      return this.min.copy(e32.min), this.max.copy(e32.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(e32) {
      return this.isEmpty() ? e32.set(0, 0, 0) : e32.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(e32) {
      return this.isEmpty() ? e32.set(0, 0, 0) : e32.subVectors(this.max, this.min);
    }
    expandByPoint(e32) {
      return this.min.min(e32), this.max.max(e32), this;
    }
    expandByVector(e32) {
      return this.min.sub(e32), this.max.add(e32), this;
    }
    expandByScalar(e32) {
      return this.min.addScalar(-e32), this.max.addScalar(e32), this;
    }
    expandByObject(e32, t3 = false) {
      e32.updateWorldMatrix(false, false);
      let n3 = e32.geometry;
      if (n3 !== void 0) {
        let r4 = n3.getAttribute(`position`);
        if (t3 === true && r4 !== void 0 && e32.isInstancedMesh !== true) for (let t4 = 0, n4 = r4.count; t4 < n4; t4++) e32.isMesh === true ? e32.getVertexPosition(t4, jt) : jt.fromBufferAttribute(r4, t4), jt.applyMatrix4(e32.matrixWorld), this.expandByPoint(jt);
        else e32.boundingBox === void 0 ? (n3.boundingBox === null && n3.computeBoundingBox(), Mt.copy(n3.boundingBox)) : (e32.boundingBox === null && e32.computeBoundingBox(), Mt.copy(e32.boundingBox)), Mt.applyMatrix4(e32.matrixWorld), this.union(Mt);
      }
      let r3 = e32.children;
      for (let e33 = 0, n4 = r3.length; e33 < n4; e33++) this.expandByObject(r3[e33], t3);
      return this;
    }
    containsPoint(e32) {
      return e32.x >= this.min.x && e32.x <= this.max.x && e32.y >= this.min.y && e32.y <= this.max.y && e32.z >= this.min.z && e32.z <= this.max.z;
    }
    containsBox(e32) {
      return this.min.x <= e32.min.x && e32.max.x <= this.max.x && this.min.y <= e32.min.y && e32.max.y <= this.max.y && this.min.z <= e32.min.z && e32.max.z <= this.max.z;
    }
    getParameter(e32, t3) {
      return t3.set((e32.x - this.min.x) / (this.max.x - this.min.x), (e32.y - this.min.y) / (this.max.y - this.min.y), (e32.z - this.min.z) / (this.max.z - this.min.z));
    }
    intersectsBox(e32) {
      return e32.max.x >= this.min.x && e32.min.x <= this.max.x && e32.max.y >= this.min.y && e32.min.y <= this.max.y && e32.max.z >= this.min.z && e32.min.z <= this.max.z;
    }
    intersectsSphere(e32) {
      return this.clampPoint(e32.center, jt), jt.distanceToSquared(e32.center) <= e32.radius * e32.radius;
    }
    intersectsPlane(e32) {
      let t3, n3;
      return e32.normal.x > 0 ? (t3 = e32.normal.x * this.min.x, n3 = e32.normal.x * this.max.x) : (t3 = e32.normal.x * this.max.x, n3 = e32.normal.x * this.min.x), e32.normal.y > 0 ? (t3 += e32.normal.y * this.min.y, n3 += e32.normal.y * this.max.y) : (t3 += e32.normal.y * this.max.y, n3 += e32.normal.y * this.min.y), e32.normal.z > 0 ? (t3 += e32.normal.z * this.min.z, n3 += e32.normal.z * this.max.z) : (t3 += e32.normal.z * this.max.z, n3 += e32.normal.z * this.min.z), t3 <= -e32.constant && n3 >= -e32.constant;
    }
    intersectsTriangle(e32) {
      if (this.isEmpty()) return false;
      this.getCenter(zt), Bt.subVectors(this.max, zt), Nt.subVectors(e32.a, zt), Pt.subVectors(e32.b, zt), Ft.subVectors(e32.c, zt), It.subVectors(Pt, Nt), Lt.subVectors(Ft, Pt), Rt.subVectors(Nt, Ft);
      let t3 = [0, -It.z, It.y, 0, -Lt.z, Lt.y, 0, -Rt.z, Rt.y, It.z, 0, -It.x, Lt.z, 0, -Lt.x, Rt.z, 0, -Rt.x, -It.y, It.x, 0, -Lt.y, Lt.x, 0, -Rt.y, Rt.x, 0];
      return !Ut(t3, Nt, Pt, Ft, Bt) || (t3 = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Ut(t3, Nt, Pt, Ft, Bt)) ? false : (Vt.crossVectors(It, Lt), t3 = [Vt.x, Vt.y, Vt.z], Ut(t3, Nt, Pt, Ft, Bt));
    }
    clampPoint(e32, t3) {
      return t3.copy(e32).clamp(this.min, this.max);
    }
    distanceToPoint(e32) {
      return this.clampPoint(e32, jt).distanceTo(e32);
    }
    getBoundingSphere(e32) {
      return this.isEmpty() ? e32.makeEmpty() : (this.getCenter(e32.center), e32.radius = this.getSize(jt).length() * 0.5), e32;
    }
    intersect(e32) {
      return this.min.max(e32.min), this.max.min(e32.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(e32) {
      return this.min.min(e32.min), this.max.max(e32.max), this;
    }
    applyMatrix4(e32) {
      return this.isEmpty() ? this : (At[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e32), At[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e32), At[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e32), At[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e32), At[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e32), At[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e32), At[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e32), At[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e32), this.setFromPoints(At), this);
    }
    translate(e32) {
      return this.min.add(e32), this.max.add(e32), this;
    }
    equals(e32) {
      return e32.min.equals(this.min) && e32.max.equals(this.max);
    }
    toJSON() {
      return { min: this.min.toArray(), max: this.max.toArray() };
    }
    fromJSON(e32) {
      return this.min.fromArray(e32.min), this.max.fromArray(e32.max), this;
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
  function Ut(e32, t3, n3, r3, i3) {
    for (let a3 = 0, o3 = e32.length - 3; a3 <= o3; a3 += 3) {
      Ht.fromArray(e32, a3);
      let o4 = i3.x * Math.abs(Ht.x) + i3.y * Math.abs(Ht.y) + i3.z * Math.abs(Ht.z), s3 = t3.dot(Ht), c3 = n3.dot(Ht), l3 = r3.dot(Ht);
      if (Math.max(-Math.max(s3, c3, l3), Math.min(s3, c3, l3)) > o4) return false;
    }
    return true;
  }
  var Wt = new kt();
  var Gt = new W();
  var Kt = new W();
  var qt = class {
    constructor(e32 = new W(), t3 = -1) {
      this.isSphere = true, this.center = e32, this.radius = t3;
    }
    set(e32, t3) {
      return this.center.copy(e32), this.radius = t3, this;
    }
    setFromPoints(e32, t3) {
      let n3 = this.center;
      t3 === void 0 ? Wt.setFromPoints(e32).getCenter(n3) : n3.copy(t3);
      let r3 = 0;
      for (let t4 = 0, i3 = e32.length; t4 < i3; t4++) r3 = Math.max(r3, n3.distanceToSquared(e32[t4]));
      return this.radius = Math.sqrt(r3), this;
    }
    copy(e32) {
      return this.center.copy(e32.center), this.radius = e32.radius, this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return this.center.set(0, 0, 0), this.radius = -1, this;
    }
    containsPoint(e32) {
      return e32.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(e32) {
      return e32.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(e32) {
      let t3 = this.radius + e32.radius;
      return e32.center.distanceToSquared(this.center) <= t3 * t3;
    }
    intersectsBox(e32) {
      return e32.intersectsSphere(this);
    }
    intersectsPlane(e32) {
      return Math.abs(e32.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(e32, t3) {
      let n3 = this.center.distanceToSquared(e32);
      return t3.copy(e32), n3 > this.radius * this.radius && (t3.sub(this.center).normalize(), t3.multiplyScalar(this.radius).add(this.center)), t3;
    }
    getBoundingBox(e32) {
      return this.isEmpty() ? (e32.makeEmpty(), e32) : (e32.set(this.center, this.center), e32.expandByScalar(this.radius), e32);
    }
    applyMatrix4(e32) {
      return this.center.applyMatrix4(e32), this.radius *= e32.getMaxScaleOnAxis(), this;
    }
    translate(e32) {
      return this.center.add(e32), this;
    }
    expandByPoint(e32) {
      if (this.isEmpty()) return this.center.copy(e32), this.radius = 0, this;
      Gt.subVectors(e32, this.center);
      let t3 = Gt.lengthSq();
      if (t3 > this.radius * this.radius) {
        let e33 = Math.sqrt(t3), n3 = (e33 - this.radius) * 0.5;
        this.center.addScaledVector(Gt, n3 / e33), this.radius += n3;
      }
      return this;
    }
    union(e32) {
      return e32.isEmpty() ? this : this.isEmpty() ? (this.copy(e32), this) : (this.center.equals(e32.center) === true ? this.radius = Math.max(this.radius, e32.radius) : (Kt.subVectors(e32.center, this.center).setLength(e32.radius), this.expandByPoint(Gt.copy(e32.center).add(Kt)), this.expandByPoint(Gt.copy(e32.center).sub(Kt))), this);
    }
    equals(e32) {
      return e32.center.equals(this.center) && e32.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      return { radius: this.radius, center: this.center.toArray() };
    }
    fromJSON(e32) {
      return this.radius = e32.radius, this.center.fromArray(e32.center), this;
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
    constructor(e32 = new W(), t3 = new W(0, 0, -1)) {
      this.origin = e32, this.direction = t3;
    }
    set(e32, t3) {
      return this.origin.copy(e32), this.direction.copy(t3), this;
    }
    copy(e32) {
      return this.origin.copy(e32.origin), this.direction.copy(e32.direction), this;
    }
    at(e32, t3) {
      return t3.copy(this.origin).addScaledVector(this.direction, e32);
    }
    lookAt(e32) {
      return this.direction.copy(e32).sub(this.origin).normalize(), this;
    }
    recast(e32) {
      return this.origin.copy(this.at(e32, Jt)), this;
    }
    closestPointToPoint(e32, t3) {
      t3.subVectors(e32, this.origin);
      let n3 = t3.dot(this.direction);
      return n3 < 0 ? t3.copy(this.origin) : t3.copy(this.origin).addScaledVector(this.direction, n3);
    }
    distanceToPoint(e32) {
      return Math.sqrt(this.distanceSqToPoint(e32));
    }
    distanceSqToPoint(e32) {
      let t3 = Jt.subVectors(e32, this.origin).dot(this.direction);
      return t3 < 0 ? this.origin.distanceToSquared(e32) : (Jt.copy(this.origin).addScaledVector(this.direction, t3), Jt.distanceToSquared(e32));
    }
    distanceSqToSegment(e32, t3, n3, r3) {
      Yt.copy(e32).add(t3).multiplyScalar(0.5), Xt.copy(t3).sub(e32).normalize(), Zt.copy(this.origin).sub(Yt);
      let i3 = e32.distanceTo(t3) * 0.5, a3 = -this.direction.dot(Xt), o3 = Zt.dot(this.direction), s3 = -Zt.dot(Xt), c3 = Zt.lengthSq(), l3 = Math.abs(1 - a3 * a3), u3, d3, f3, p3;
      if (l3 > 0) if (u3 = a3 * s3 - o3, d3 = a3 * o3 - s3, p3 = i3 * l3, u3 >= 0) if (d3 >= -p3) if (d3 <= p3) {
        let e33 = 1 / l3;
        u3 *= e33, d3 *= e33, f3 = u3 * (u3 + a3 * d3 + 2 * o3) + d3 * (a3 * u3 + d3 + 2 * s3) + c3;
      } else d3 = i3, u3 = Math.max(0, -(a3 * d3 + o3)), f3 = -u3 * u3 + d3 * (d3 + 2 * s3) + c3;
      else d3 = -i3, u3 = Math.max(0, -(a3 * d3 + o3)), f3 = -u3 * u3 + d3 * (d3 + 2 * s3) + c3;
      else d3 <= -p3 ? (u3 = Math.max(0, -(-a3 * i3 + o3)), d3 = u3 > 0 ? -i3 : Math.min(Math.max(-i3, -s3), i3), f3 = -u3 * u3 + d3 * (d3 + 2 * s3) + c3) : d3 <= p3 ? (u3 = 0, d3 = Math.min(Math.max(-i3, -s3), i3), f3 = d3 * (d3 + 2 * s3) + c3) : (u3 = Math.max(0, -(a3 * i3 + o3)), d3 = u3 > 0 ? i3 : Math.min(Math.max(-i3, -s3), i3), f3 = -u3 * u3 + d3 * (d3 + 2 * s3) + c3);
      else d3 = a3 > 0 ? -i3 : i3, u3 = Math.max(0, -(a3 * d3 + o3)), f3 = -u3 * u3 + d3 * (d3 + 2 * s3) + c3;
      return n3 && n3.copy(this.origin).addScaledVector(this.direction, u3), r3 && r3.copy(Yt).addScaledVector(Xt, d3), f3;
    }
    intersectSphere(e32, t3) {
      Jt.subVectors(e32.center, this.origin);
      let n3 = Jt.dot(this.direction), r3 = Jt.dot(Jt) - n3 * n3, i3 = e32.radius * e32.radius;
      if (r3 > i3) return null;
      let a3 = Math.sqrt(i3 - r3), o3 = n3 - a3, s3 = n3 + a3;
      return s3 < 0 ? null : o3 < 0 ? this.at(s3, t3) : this.at(o3, t3);
    }
    intersectsSphere(e32) {
      return e32.radius < 0 ? false : this.distanceSqToPoint(e32.center) <= e32.radius * e32.radius;
    }
    distanceToPlane(e32) {
      let t3 = e32.normal.dot(this.direction);
      if (t3 === 0) return e32.distanceToPoint(this.origin) === 0 ? 0 : null;
      let n3 = -(this.origin.dot(e32.normal) + e32.constant) / t3;
      return n3 >= 0 ? n3 : null;
    }
    intersectPlane(e32, t3) {
      let n3 = this.distanceToPlane(e32);
      return n3 === null ? null : this.at(n3, t3);
    }
    intersectsPlane(e32) {
      let t3 = e32.distanceToPoint(this.origin);
      return t3 === 0 || e32.normal.dot(this.direction) * t3 < 0;
    }
    intersectBox(e32, t3) {
      let n3, r3, i3, a3, o3, s3, c3 = 1 / this.direction.x, l3 = 1 / this.direction.y, u3 = 1 / this.direction.z, d3 = this.origin;
      return c3 >= 0 ? (n3 = (e32.min.x - d3.x) * c3, r3 = (e32.max.x - d3.x) * c3) : (n3 = (e32.max.x - d3.x) * c3, r3 = (e32.min.x - d3.x) * c3), l3 >= 0 ? (i3 = (e32.min.y - d3.y) * l3, a3 = (e32.max.y - d3.y) * l3) : (i3 = (e32.max.y - d3.y) * l3, a3 = (e32.min.y - d3.y) * l3), n3 > a3 || i3 > r3 || ((i3 > n3 || isNaN(n3)) && (n3 = i3), (a3 < r3 || isNaN(r3)) && (r3 = a3), u3 >= 0 ? (o3 = (e32.min.z - d3.z) * u3, s3 = (e32.max.z - d3.z) * u3) : (o3 = (e32.max.z - d3.z) * u3, s3 = (e32.min.z - d3.z) * u3), n3 > s3 || o3 > r3) || ((o3 > n3 || n3 !== n3) && (n3 = o3), (s3 < r3 || r3 !== r3) && (r3 = s3), r3 < 0) ? null : this.at(n3 >= 0 ? n3 : r3, t3);
    }
    intersectsBox(e32) {
      return this.intersectBox(e32, Jt) !== null;
    }
    intersectTriangle(e32, t3, n3, r3, i3) {
      Qt.subVectors(t3, e32), $t.subVectors(n3, e32), en.crossVectors(Qt, $t);
      let a3 = this.direction.dot(en), o3;
      if (a3 > 0) {
        if (r3) return null;
        o3 = 1;
      } else if (a3 < 0) o3 = -1, a3 = -a3;
      else return null;
      Zt.subVectors(this.origin, e32);
      let s3 = o3 * this.direction.dot($t.crossVectors(Zt, $t));
      if (s3 < 0) return null;
      let c3 = o3 * this.direction.dot(Qt.cross(Zt));
      if (c3 < 0 || s3 + c3 > a3) return null;
      let l3 = -o3 * Zt.dot(en);
      return l3 < 0 ? null : this.at(l3 / a3, i3);
    }
    applyMatrix4(e32) {
      return this.origin.applyMatrix4(e32), this.direction.transformDirection(e32), this;
    }
    equals(e32) {
      return e32.origin.equals(this.origin) && e32.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var nn = class e7 {
    constructor(t3, n3, r3, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3, m3, h3, g3) {
      e7.prototype.isMatrix4 = true, this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], t3 !== void 0 && this.set(t3, n3, r3, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3, m3, h3, g3);
    }
    set(e32, t3, n3, r3, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3, m3, h3) {
      let g3 = this.elements;
      return g3[0] = e32, g3[4] = t3, g3[8] = n3, g3[12] = r3, g3[1] = i3, g3[5] = a3, g3[9] = o3, g3[13] = s3, g3[2] = c3, g3[6] = l3, g3[10] = u3, g3[14] = d3, g3[3] = f3, g3[7] = p3, g3[11] = m3, g3[15] = h3, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    clone() {
      return new e7().fromArray(this.elements);
    }
    copy(e32) {
      let t3 = this.elements, n3 = e32.elements;
      return t3[0] = n3[0], t3[1] = n3[1], t3[2] = n3[2], t3[3] = n3[3], t3[4] = n3[4], t3[5] = n3[5], t3[6] = n3[6], t3[7] = n3[7], t3[8] = n3[8], t3[9] = n3[9], t3[10] = n3[10], t3[11] = n3[11], t3[12] = n3[12], t3[13] = n3[13], t3[14] = n3[14], t3[15] = n3[15], this;
    }
    copyPosition(e32) {
      let t3 = this.elements, n3 = e32.elements;
      return t3[12] = n3[12], t3[13] = n3[13], t3[14] = n3[14], this;
    }
    setFromMatrix3(e32) {
      let t3 = e32.elements;
      return this.set(t3[0], t3[3], t3[6], 0, t3[1], t3[4], t3[7], 0, t3[2], t3[5], t3[8], 0, 0, 0, 0, 1), this;
    }
    extractBasis(e32, t3, n3) {
      return e32.setFromMatrixColumn(this, 0), t3.setFromMatrixColumn(this, 1), n3.setFromMatrixColumn(this, 2), this;
    }
    makeBasis(e32, t3, n3) {
      return this.set(e32.x, t3.x, n3.x, 0, e32.y, t3.y, n3.y, 0, e32.z, t3.z, n3.z, 0, 0, 0, 0, 1), this;
    }
    extractRotation(e32) {
      let t3 = this.elements, n3 = e32.elements, r3 = 1 / rn.setFromMatrixColumn(e32, 0).length(), i3 = 1 / rn.setFromMatrixColumn(e32, 1).length(), a3 = 1 / rn.setFromMatrixColumn(e32, 2).length();
      return t3[0] = n3[0] * r3, t3[1] = n3[1] * r3, t3[2] = n3[2] * r3, t3[3] = 0, t3[4] = n3[4] * i3, t3[5] = n3[5] * i3, t3[6] = n3[6] * i3, t3[7] = 0, t3[8] = n3[8] * a3, t3[9] = n3[9] * a3, t3[10] = n3[10] * a3, t3[11] = 0, t3[12] = 0, t3[13] = 0, t3[14] = 0, t3[15] = 1, this;
    }
    makeRotationFromEuler(e32) {
      let t3 = this.elements, n3 = e32.x, r3 = e32.y, i3 = e32.z, a3 = Math.cos(n3), o3 = Math.sin(n3), s3 = Math.cos(r3), c3 = Math.sin(r3), l3 = Math.cos(i3), u3 = Math.sin(i3);
      if (e32.order === `XYZ`) {
        let e33 = a3 * l3, n4 = a3 * u3, r4 = o3 * l3, i4 = o3 * u3;
        t3[0] = s3 * l3, t3[4] = -s3 * u3, t3[8] = c3, t3[1] = n4 + r4 * c3, t3[5] = e33 - i4 * c3, t3[9] = -o3 * s3, t3[2] = i4 - e33 * c3, t3[6] = r4 + n4 * c3, t3[10] = a3 * s3;
      } else if (e32.order === `YXZ`) {
        let e33 = s3 * l3, n4 = s3 * u3, r4 = c3 * l3, i4 = c3 * u3;
        t3[0] = e33 + i4 * o3, t3[4] = r4 * o3 - n4, t3[8] = a3 * c3, t3[1] = a3 * u3, t3[5] = a3 * l3, t3[9] = -o3, t3[2] = n4 * o3 - r4, t3[6] = i4 + e33 * o3, t3[10] = a3 * s3;
      } else if (e32.order === `ZXY`) {
        let e33 = s3 * l3, n4 = s3 * u3, r4 = c3 * l3, i4 = c3 * u3;
        t3[0] = e33 - i4 * o3, t3[4] = -a3 * u3, t3[8] = r4 + n4 * o3, t3[1] = n4 + r4 * o3, t3[5] = a3 * l3, t3[9] = i4 - e33 * o3, t3[2] = -a3 * c3, t3[6] = o3, t3[10] = a3 * s3;
      } else if (e32.order === `ZYX`) {
        let e33 = a3 * l3, n4 = a3 * u3, r4 = o3 * l3, i4 = o3 * u3;
        t3[0] = s3 * l3, t3[4] = r4 * c3 - n4, t3[8] = e33 * c3 + i4, t3[1] = s3 * u3, t3[5] = i4 * c3 + e33, t3[9] = n4 * c3 - r4, t3[2] = -c3, t3[6] = o3 * s3, t3[10] = a3 * s3;
      } else if (e32.order === `YZX`) {
        let e33 = a3 * s3, n4 = a3 * c3, r4 = o3 * s3, i4 = o3 * c3;
        t3[0] = s3 * l3, t3[4] = i4 - e33 * u3, t3[8] = r4 * u3 + n4, t3[1] = u3, t3[5] = a3 * l3, t3[9] = -o3 * l3, t3[2] = -c3 * l3, t3[6] = n4 * u3 + r4, t3[10] = e33 - i4 * u3;
      } else if (e32.order === `XZY`) {
        let e33 = a3 * s3, n4 = a3 * c3, r4 = o3 * s3, i4 = o3 * c3;
        t3[0] = s3 * l3, t3[4] = -u3, t3[8] = c3 * l3, t3[1] = e33 * u3 + i4, t3[5] = a3 * l3, t3[9] = n4 * u3 - r4, t3[2] = r4 * u3 - n4, t3[6] = o3 * l3, t3[10] = i4 * u3 + e33;
      }
      return t3[3] = 0, t3[7] = 0, t3[11] = 0, t3[12] = 0, t3[13] = 0, t3[14] = 0, t3[15] = 1, this;
    }
    makeRotationFromQuaternion(e32) {
      return this.compose(on, e32, sn);
    }
    lookAt(e32, t3, n3) {
      let r3 = this.elements;
      return un.subVectors(e32, t3), un.lengthSq() === 0 && (un.z = 1), un.normalize(), cn.crossVectors(n3, un), cn.lengthSq() === 0 && (Math.abs(n3.z) === 1 ? un.x += 1e-4 : un.z += 1e-4, un.normalize(), cn.crossVectors(n3, un)), cn.normalize(), ln.crossVectors(un, cn), r3[0] = cn.x, r3[4] = ln.x, r3[8] = un.x, r3[1] = cn.y, r3[5] = ln.y, r3[9] = un.y, r3[2] = cn.z, r3[6] = ln.z, r3[10] = un.z, this;
    }
    multiply(e32) {
      return this.multiplyMatrices(this, e32);
    }
    premultiply(e32) {
      return this.multiplyMatrices(e32, this);
    }
    multiplyMatrices(e32, t3) {
      let n3 = e32.elements, r3 = t3.elements, i3 = this.elements, a3 = n3[0], o3 = n3[4], s3 = n3[8], c3 = n3[12], l3 = n3[1], u3 = n3[5], d3 = n3[9], f3 = n3[13], p3 = n3[2], m3 = n3[6], h3 = n3[10], g3 = n3[14], _3 = n3[3], v3 = n3[7], y3 = n3[11], b3 = n3[15], x3 = r3[0], S3 = r3[4], C3 = r3[8], w3 = r3[12], T3 = r3[1], E3 = r3[5], D3 = r3[9], O3 = r3[13], k3 = r3[2], A4 = r3[6], j4 = r3[10], ee3 = r3[14], te3 = r3[3], M4 = r3[7], N4 = r3[11], P3 = r3[15];
      return i3[0] = a3 * x3 + o3 * T3 + s3 * k3 + c3 * te3, i3[4] = a3 * S3 + o3 * E3 + s3 * A4 + c3 * M4, i3[8] = a3 * C3 + o3 * D3 + s3 * j4 + c3 * N4, i3[12] = a3 * w3 + o3 * O3 + s3 * ee3 + c3 * P3, i3[1] = l3 * x3 + u3 * T3 + d3 * k3 + f3 * te3, i3[5] = l3 * S3 + u3 * E3 + d3 * A4 + f3 * M4, i3[9] = l3 * C3 + u3 * D3 + d3 * j4 + f3 * N4, i3[13] = l3 * w3 + u3 * O3 + d3 * ee3 + f3 * P3, i3[2] = p3 * x3 + m3 * T3 + h3 * k3 + g3 * te3, i3[6] = p3 * S3 + m3 * E3 + h3 * A4 + g3 * M4, i3[10] = p3 * C3 + m3 * D3 + h3 * j4 + g3 * N4, i3[14] = p3 * w3 + m3 * O3 + h3 * ee3 + g3 * P3, i3[3] = _3 * x3 + v3 * T3 + y3 * k3 + b3 * te3, i3[7] = _3 * S3 + v3 * E3 + y3 * A4 + b3 * M4, i3[11] = _3 * C3 + v3 * D3 + y3 * j4 + b3 * N4, i3[15] = _3 * w3 + v3 * O3 + y3 * ee3 + b3 * P3, this;
    }
    multiplyScalar(e32) {
      let t3 = this.elements;
      return t3[0] *= e32, t3[4] *= e32, t3[8] *= e32, t3[12] *= e32, t3[1] *= e32, t3[5] *= e32, t3[9] *= e32, t3[13] *= e32, t3[2] *= e32, t3[6] *= e32, t3[10] *= e32, t3[14] *= e32, t3[3] *= e32, t3[7] *= e32, t3[11] *= e32, t3[15] *= e32, this;
    }
    determinant() {
      let e32 = this.elements, t3 = e32[0], n3 = e32[4], r3 = e32[8], i3 = e32[12], a3 = e32[1], o3 = e32[5], s3 = e32[9], c3 = e32[13], l3 = e32[2], u3 = e32[6], d3 = e32[10], f3 = e32[14], p3 = e32[3], m3 = e32[7], h3 = e32[11], g3 = e32[15];
      return p3 * (+i3 * s3 * u3 - r3 * c3 * u3 - i3 * o3 * d3 + n3 * c3 * d3 + r3 * o3 * f3 - n3 * s3 * f3) + m3 * (+t3 * s3 * f3 - t3 * c3 * d3 + i3 * a3 * d3 - r3 * a3 * f3 + r3 * c3 * l3 - i3 * s3 * l3) + h3 * (+t3 * c3 * u3 - t3 * o3 * f3 - i3 * a3 * u3 + n3 * a3 * f3 + i3 * o3 * l3 - n3 * c3 * l3) + g3 * (-r3 * o3 * l3 - t3 * s3 * u3 + t3 * o3 * d3 + r3 * a3 * u3 - n3 * a3 * d3 + n3 * s3 * l3);
    }
    transpose() {
      let e32 = this.elements, t3;
      return t3 = e32[1], e32[1] = e32[4], e32[4] = t3, t3 = e32[2], e32[2] = e32[8], e32[8] = t3, t3 = e32[6], e32[6] = e32[9], e32[9] = t3, t3 = e32[3], e32[3] = e32[12], e32[12] = t3, t3 = e32[7], e32[7] = e32[13], e32[13] = t3, t3 = e32[11], e32[11] = e32[14], e32[14] = t3, this;
    }
    setPosition(e32, t3, n3) {
      let r3 = this.elements;
      return e32.isVector3 ? (r3[12] = e32.x, r3[13] = e32.y, r3[14] = e32.z) : (r3[12] = e32, r3[13] = t3, r3[14] = n3), this;
    }
    invert() {
      let e32 = this.elements, t3 = e32[0], n3 = e32[1], r3 = e32[2], i3 = e32[3], a3 = e32[4], o3 = e32[5], s3 = e32[6], c3 = e32[7], l3 = e32[8], u3 = e32[9], d3 = e32[10], f3 = e32[11], p3 = e32[12], m3 = e32[13], h3 = e32[14], g3 = e32[15], _3 = u3 * h3 * c3 - m3 * d3 * c3 + m3 * s3 * f3 - o3 * h3 * f3 - u3 * s3 * g3 + o3 * d3 * g3, v3 = p3 * d3 * c3 - l3 * h3 * c3 - p3 * s3 * f3 + a3 * h3 * f3 + l3 * s3 * g3 - a3 * d3 * g3, y3 = l3 * m3 * c3 - p3 * u3 * c3 + p3 * o3 * f3 - a3 * m3 * f3 - l3 * o3 * g3 + a3 * u3 * g3, b3 = p3 * u3 * s3 - l3 * m3 * s3 - p3 * o3 * d3 + a3 * m3 * d3 + l3 * o3 * h3 - a3 * u3 * h3, x3 = t3 * _3 + n3 * v3 + r3 * y3 + i3 * b3;
      if (x3 === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      let S3 = 1 / x3;
      return e32[0] = _3 * S3, e32[1] = (m3 * d3 * i3 - u3 * h3 * i3 - m3 * r3 * f3 + n3 * h3 * f3 + u3 * r3 * g3 - n3 * d3 * g3) * S3, e32[2] = (o3 * h3 * i3 - m3 * s3 * i3 + m3 * r3 * c3 - n3 * h3 * c3 - o3 * r3 * g3 + n3 * s3 * g3) * S3, e32[3] = (u3 * s3 * i3 - o3 * d3 * i3 - u3 * r3 * c3 + n3 * d3 * c3 + o3 * r3 * f3 - n3 * s3 * f3) * S3, e32[4] = v3 * S3, e32[5] = (l3 * h3 * i3 - p3 * d3 * i3 + p3 * r3 * f3 - t3 * h3 * f3 - l3 * r3 * g3 + t3 * d3 * g3) * S3, e32[6] = (p3 * s3 * i3 - a3 * h3 * i3 - p3 * r3 * c3 + t3 * h3 * c3 + a3 * r3 * g3 - t3 * s3 * g3) * S3, e32[7] = (a3 * d3 * i3 - l3 * s3 * i3 + l3 * r3 * c3 - t3 * d3 * c3 - a3 * r3 * f3 + t3 * s3 * f3) * S3, e32[8] = y3 * S3, e32[9] = (p3 * u3 * i3 - l3 * m3 * i3 - p3 * n3 * f3 + t3 * m3 * f3 + l3 * n3 * g3 - t3 * u3 * g3) * S3, e32[10] = (a3 * m3 * i3 - p3 * o3 * i3 + p3 * n3 * c3 - t3 * m3 * c3 - a3 * n3 * g3 + t3 * o3 * g3) * S3, e32[11] = (l3 * o3 * i3 - a3 * u3 * i3 - l3 * n3 * c3 + t3 * u3 * c3 + a3 * n3 * f3 - t3 * o3 * f3) * S3, e32[12] = b3 * S3, e32[13] = (l3 * m3 * r3 - p3 * u3 * r3 + p3 * n3 * d3 - t3 * m3 * d3 - l3 * n3 * h3 + t3 * u3 * h3) * S3, e32[14] = (p3 * o3 * r3 - a3 * m3 * r3 - p3 * n3 * s3 + t3 * m3 * s3 + a3 * n3 * h3 - t3 * o3 * h3) * S3, e32[15] = (a3 * u3 * r3 - l3 * o3 * r3 + l3 * n3 * s3 - t3 * u3 * s3 - a3 * n3 * d3 + t3 * o3 * d3) * S3, this;
    }
    scale(e32) {
      let t3 = this.elements, n3 = e32.x, r3 = e32.y, i3 = e32.z;
      return t3[0] *= n3, t3[4] *= r3, t3[8] *= i3, t3[1] *= n3, t3[5] *= r3, t3[9] *= i3, t3[2] *= n3, t3[6] *= r3, t3[10] *= i3, t3[3] *= n3, t3[7] *= r3, t3[11] *= i3, this;
    }
    getMaxScaleOnAxis() {
      let e32 = this.elements, t3 = e32[0] * e32[0] + e32[1] * e32[1] + e32[2] * e32[2], n3 = e32[4] * e32[4] + e32[5] * e32[5] + e32[6] * e32[6], r3 = e32[8] * e32[8] + e32[9] * e32[9] + e32[10] * e32[10];
      return Math.sqrt(Math.max(t3, n3, r3));
    }
    makeTranslation(e32, t3, n3) {
      return e32.isVector3 ? this.set(1, 0, 0, e32.x, 0, 1, 0, e32.y, 0, 0, 1, e32.z, 0, 0, 0, 1) : this.set(1, 0, 0, e32, 0, 1, 0, t3, 0, 0, 1, n3, 0, 0, 0, 1), this;
    }
    makeRotationX(e32) {
      let t3 = Math.cos(e32), n3 = Math.sin(e32);
      return this.set(1, 0, 0, 0, 0, t3, -n3, 0, 0, n3, t3, 0, 0, 0, 0, 1), this;
    }
    makeRotationY(e32) {
      let t3 = Math.cos(e32), n3 = Math.sin(e32);
      return this.set(t3, 0, n3, 0, 0, 1, 0, 0, -n3, 0, t3, 0, 0, 0, 0, 1), this;
    }
    makeRotationZ(e32) {
      let t3 = Math.cos(e32), n3 = Math.sin(e32);
      return this.set(t3, -n3, 0, 0, n3, t3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    makeRotationAxis(e32, t3) {
      let n3 = Math.cos(t3), r3 = Math.sin(t3), i3 = 1 - n3, a3 = e32.x, o3 = e32.y, s3 = e32.z, c3 = i3 * a3, l3 = i3 * o3;
      return this.set(c3 * a3 + n3, c3 * o3 - r3 * s3, c3 * s3 + r3 * o3, 0, c3 * o3 + r3 * s3, l3 * o3 + n3, l3 * s3 - r3 * a3, 0, c3 * s3 - r3 * o3, l3 * s3 + r3 * a3, i3 * s3 * s3 + n3, 0, 0, 0, 0, 1), this;
    }
    makeScale(e32, t3, n3) {
      return this.set(e32, 0, 0, 0, 0, t3, 0, 0, 0, 0, n3, 0, 0, 0, 0, 1), this;
    }
    makeShear(e32, t3, n3, r3, i3, a3) {
      return this.set(1, n3, i3, 0, e32, 1, a3, 0, t3, r3, 1, 0, 0, 0, 0, 1), this;
    }
    compose(e32, t3, n3) {
      let r3 = this.elements, i3 = t3._x, a3 = t3._y, o3 = t3._z, s3 = t3._w, c3 = i3 + i3, l3 = a3 + a3, u3 = o3 + o3, d3 = i3 * c3, f3 = i3 * l3, p3 = i3 * u3, m3 = a3 * l3, h3 = a3 * u3, g3 = o3 * u3, _3 = s3 * c3, v3 = s3 * l3, y3 = s3 * u3, b3 = n3.x, x3 = n3.y, S3 = n3.z;
      return r3[0] = (1 - (m3 + g3)) * b3, r3[1] = (f3 + y3) * b3, r3[2] = (p3 - v3) * b3, r3[3] = 0, r3[4] = (f3 - y3) * x3, r3[5] = (1 - (d3 + g3)) * x3, r3[6] = (h3 + _3) * x3, r3[7] = 0, r3[8] = (p3 + v3) * S3, r3[9] = (h3 - _3) * S3, r3[10] = (1 - (d3 + m3)) * S3, r3[11] = 0, r3[12] = e32.x, r3[13] = e32.y, r3[14] = e32.z, r3[15] = 1, this;
    }
    decompose(e32, t3, n3) {
      let r3 = this.elements, i3 = rn.set(r3[0], r3[1], r3[2]).length(), a3 = rn.set(r3[4], r3[5], r3[6]).length(), o3 = rn.set(r3[8], r3[9], r3[10]).length();
      this.determinant() < 0 && (i3 = -i3), e32.x = r3[12], e32.y = r3[13], e32.z = r3[14], an.copy(this);
      let s3 = 1 / i3, c3 = 1 / a3, l3 = 1 / o3;
      return an.elements[0] *= s3, an.elements[1] *= s3, an.elements[2] *= s3, an.elements[4] *= c3, an.elements[5] *= c3, an.elements[6] *= c3, an.elements[8] *= l3, an.elements[9] *= l3, an.elements[10] *= l3, t3.setFromRotationMatrix(an), n3.x = i3, n3.y = a3, n3.z = o3, this;
    }
    makePerspective(e32, t3, n3, r3, i3, a3, o3 = Ge, s3 = false) {
      let c3 = this.elements, l3 = 2 * i3 / (t3 - e32), u3 = 2 * i3 / (n3 - r3), d3 = (t3 + e32) / (t3 - e32), f3 = (n3 + r3) / (n3 - r3), p3, m3;
      if (s3) p3 = i3 / (a3 - i3), m3 = a3 * i3 / (a3 - i3);
      else if (o3 === 2e3) p3 = -(a3 + i3) / (a3 - i3), m3 = -2 * a3 * i3 / (a3 - i3);
      else if (o3 === 2001) p3 = -a3 / (a3 - i3), m3 = -a3 * i3 / (a3 - i3);
      else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: ` + o3);
      return c3[0] = l3, c3[4] = 0, c3[8] = d3, c3[12] = 0, c3[1] = 0, c3[5] = u3, c3[9] = f3, c3[13] = 0, c3[2] = 0, c3[6] = 0, c3[10] = p3, c3[14] = m3, c3[3] = 0, c3[7] = 0, c3[11] = -1, c3[15] = 0, this;
    }
    makeOrthographic(e32, t3, n3, r3, i3, a3, o3 = Ge, s3 = false) {
      let c3 = this.elements, l3 = 2 / (t3 - e32), u3 = 2 / (n3 - r3), d3 = -(t3 + e32) / (t3 - e32), f3 = -(n3 + r3) / (n3 - r3), p3, m3;
      if (s3) p3 = 1 / (a3 - i3), m3 = a3 / (a3 - i3);
      else if (o3 === 2e3) p3 = -2 / (a3 - i3), m3 = -(a3 + i3) / (a3 - i3);
      else if (o3 === 2001) p3 = -1 / (a3 - i3), m3 = -i3 / (a3 - i3);
      else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ` + o3);
      return c3[0] = l3, c3[4] = 0, c3[8] = 0, c3[12] = d3, c3[1] = 0, c3[5] = u3, c3[9] = 0, c3[13] = f3, c3[2] = 0, c3[6] = 0, c3[10] = p3, c3[14] = m3, c3[3] = 0, c3[7] = 0, c3[11] = 0, c3[15] = 1, this;
    }
    equals(e32) {
      let t3 = this.elements, n3 = e32.elements;
      for (let e33 = 0; e33 < 16; e33++) if (t3[e33] !== n3[e33]) return false;
      return true;
    }
    fromArray(e32, t3 = 0) {
      for (let n3 = 0; n3 < 16; n3++) this.elements[n3] = e32[n3 + t3];
      return this;
    }
    toArray(e32 = [], t3 = 0) {
      let n3 = this.elements;
      return e32[t3] = n3[0], e32[t3 + 1] = n3[1], e32[t3 + 2] = n3[2], e32[t3 + 3] = n3[3], e32[t3 + 4] = n3[4], e32[t3 + 5] = n3[5], e32[t3 + 6] = n3[6], e32[t3 + 7] = n3[7], e32[t3 + 8] = n3[8], e32[t3 + 9] = n3[9], e32[t3 + 10] = n3[10], e32[t3 + 11] = n3[11], e32[t3 + 12] = n3[12], e32[t3 + 13] = n3[13], e32[t3 + 14] = n3[14], e32[t3 + 15] = n3[15], e32;
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
    constructor(t3 = 0, n3 = 0, r3 = 0, i3 = e8.DEFAULT_ORDER) {
      this.isEuler = true, this._x = t3, this._y = n3, this._z = r3, this._order = i3;
    }
    get x() {
      return this._x;
    }
    set x(e32) {
      this._x = e32, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e32) {
      this._y = e32, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e32) {
      this._z = e32, this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(e32) {
      this._order = e32, this._onChangeCallback();
    }
    set(e32, t3, n3, r3 = this._order) {
      return this._x = e32, this._y = t3, this._z = n3, this._order = r3, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(e32) {
      return this._x = e32._x, this._y = e32._y, this._z = e32._z, this._order = e32._order, this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e32, t3 = this._order, n3 = true) {
      let r3 = e32.elements, i3 = r3[0], a3 = r3[4], o3 = r3[8], s3 = r3[1], c3 = r3[5], l3 = r3[9], u3 = r3[2], d3 = r3[6], f3 = r3[10];
      switch (t3) {
        case `XYZ`:
          this._y = Math.asin(H(o3, -1, 1)), Math.abs(o3) < 0.9999999 ? (this._x = Math.atan2(-l3, f3), this._z = Math.atan2(-a3, i3)) : (this._x = Math.atan2(d3, c3), this._z = 0);
          break;
        case `YXZ`:
          this._x = Math.asin(-H(l3, -1, 1)), Math.abs(l3) < 0.9999999 ? (this._y = Math.atan2(o3, f3), this._z = Math.atan2(s3, c3)) : (this._y = Math.atan2(-u3, i3), this._z = 0);
          break;
        case `ZXY`:
          this._x = Math.asin(H(d3, -1, 1)), Math.abs(d3) < 0.9999999 ? (this._y = Math.atan2(-u3, f3), this._z = Math.atan2(-a3, c3)) : (this._y = 0, this._z = Math.atan2(s3, i3));
          break;
        case `ZYX`:
          this._y = Math.asin(-H(u3, -1, 1)), Math.abs(u3) < 0.9999999 ? (this._x = Math.atan2(d3, f3), this._z = Math.atan2(s3, i3)) : (this._x = 0, this._z = Math.atan2(-a3, c3));
          break;
        case `YZX`:
          this._z = Math.asin(H(s3, -1, 1)), Math.abs(s3) < 0.9999999 ? (this._x = Math.atan2(-l3, c3), this._y = Math.atan2(-u3, i3)) : (this._x = 0, this._y = Math.atan2(o3, f3));
          break;
        case `XZY`:
          this._z = Math.asin(-H(a3, -1, 1)), Math.abs(a3) < 0.9999999 ? (this._x = Math.atan2(d3, c3), this._y = Math.atan2(o3, i3)) : (this._x = Math.atan2(-l3, f3), this._y = 0);
          break;
        default:
          console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ` + t3);
      }
      return this._order = t3, n3 === true && this._onChangeCallback(), this;
    }
    setFromQuaternion(e32, t3, n3) {
      return dn.makeRotationFromQuaternion(e32), this.setFromRotationMatrix(dn, t3, n3);
    }
    setFromVector3(e32, t3 = this._order) {
      return this.set(e32.x, e32.y, e32.z, t3);
    }
    reorder(e32) {
      return fn.setFromEuler(this), this.setFromQuaternion(fn, e32);
    }
    equals(e32) {
      return e32._x === this._x && e32._y === this._y && e32._z === this._z && e32._order === this._order;
    }
    fromArray(e32) {
      return this._x = e32[0], this._y = e32[1], this._z = e32[2], e32[3] !== void 0 && (this._order = e32[3]), this._onChangeCallback(), this;
    }
    toArray(e32 = [], t3 = 0) {
      return e32[t3] = this._x, e32[t3 + 1] = this._y, e32[t3 + 2] = this._z, e32[t3 + 3] = this._order, e32;
    }
    _onChange(e32) {
      return this._onChangeCallback = e32, this;
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
    set(e32) {
      this.mask = (1 << e32 | 0) >>> 0;
    }
    enable(e32) {
      this.mask |= 1 << e32 | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(e32) {
      this.mask ^= 1 << e32 | 0;
    }
    disable(e32) {
      this.mask &= ~(1 << e32 | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(e32) {
      return (this.mask & e32.mask) !== 0;
    }
    isEnabled(e32) {
      return (this.mask & (1 << e32 | 0)) != 0;
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
      let t3 = new W(), n3 = new pn(), r3 = new tt(), i3 = new W(1, 1, 1);
      function a3() {
        r3.setFromEuler(n3, false);
      }
      function o3() {
        n3.setFromQuaternion(r3, void 0, false);
      }
      n3._onChange(a3), r3._onChange(o3), Object.defineProperties(this, { position: { configurable: true, enumerable: true, value: t3 }, rotation: { configurable: true, enumerable: true, value: n3 }, quaternion: { configurable: true, enumerable: true, value: r3 }, scale: { configurable: true, enumerable: true, value: i3 }, modelViewMatrix: { value: new nn() }, normalMatrix: { value: new G() } }), this.matrix = new nn(), this.matrixWorld = new nn(), this.matrixAutoUpdate = e9.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = e9.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new mn(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(e32) {
      this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e32), this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(e32) {
      return this.quaternion.premultiply(e32), this;
    }
    setRotationFromAxisAngle(e32, t3) {
      this.quaternion.setFromAxisAngle(e32, t3);
    }
    setRotationFromEuler(e32) {
      this.quaternion.setFromEuler(e32, true);
    }
    setRotationFromMatrix(e32) {
      this.quaternion.setFromRotationMatrix(e32);
    }
    setRotationFromQuaternion(e32) {
      this.quaternion.copy(e32);
    }
    rotateOnAxis(e32, t3) {
      return _n.setFromAxisAngle(e32, t3), this.quaternion.multiply(_n), this;
    }
    rotateOnWorldAxis(e32, t3) {
      return _n.setFromAxisAngle(e32, t3), this.quaternion.premultiply(_n), this;
    }
    rotateX(e32) {
      return this.rotateOnAxis(Cn, e32);
    }
    rotateY(e32) {
      return this.rotateOnAxis(wn, e32);
    }
    rotateZ(e32) {
      return this.rotateOnAxis(Tn, e32);
    }
    translateOnAxis(e32, t3) {
      return gn.copy(e32).applyQuaternion(this.quaternion), this.position.add(gn.multiplyScalar(t3)), this;
    }
    translateX(e32) {
      return this.translateOnAxis(Cn, e32);
    }
    translateY(e32) {
      return this.translateOnAxis(wn, e32);
    }
    translateZ(e32) {
      return this.translateOnAxis(Tn, e32);
    }
    localToWorld(e32) {
      return this.updateWorldMatrix(true, false), e32.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(e32) {
      return this.updateWorldMatrix(true, false), e32.applyMatrix4(vn.copy(this.matrixWorld).invert());
    }
    lookAt(e32, t3, n3) {
      e32.isVector3 ? yn.copy(e32) : yn.set(e32, t3, n3);
      let r3 = this.parent;
      this.updateWorldMatrix(true, false), bn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? vn.lookAt(bn, yn, this.up) : vn.lookAt(yn, bn, this.up), this.quaternion.setFromRotationMatrix(vn), r3 && (vn.extractRotation(r3.matrixWorld), _n.setFromRotationMatrix(vn), this.quaternion.premultiply(_n.invert()));
    }
    add(e32) {
      if (arguments.length > 1) {
        for (let e33 = 0; e33 < arguments.length; e33++) this.add(arguments[e33]);
        return this;
      }
      return e32 === this ? (console.error(`THREE.Object3D.add: object can't be added as a child of itself.`, e32), this) : (e32 && e32.isObject3D ? (e32.removeFromParent(), e32.parent = this, this.children.push(e32), e32.dispatchEvent(En), On.child = e32, this.dispatchEvent(On), On.child = null) : console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`, e32), this);
    }
    remove(e32) {
      if (arguments.length > 1) {
        for (let e33 = 0; e33 < arguments.length; e33++) this.remove(arguments[e33]);
        return this;
      }
      let t3 = this.children.indexOf(e32);
      return t3 !== -1 && (e32.parent = null, this.children.splice(t3, 1), e32.dispatchEvent(Dn), kn.child = e32, this.dispatchEvent(kn), kn.child = null), this;
    }
    removeFromParent() {
      let e32 = this.parent;
      return e32 !== null && e32.remove(this), this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(e32) {
      return this.updateWorldMatrix(true, false), vn.copy(this.matrixWorld).invert(), e32.parent !== null && (e32.parent.updateWorldMatrix(true, false), vn.multiply(e32.parent.matrixWorld)), e32.applyMatrix4(vn), e32.removeFromParent(), e32.parent = this, this.children.push(e32), e32.updateWorldMatrix(false, true), e32.dispatchEvent(En), On.child = e32, this.dispatchEvent(On), On.child = null, this;
    }
    getObjectById(e32) {
      return this.getObjectByProperty(`id`, e32);
    }
    getObjectByName(e32) {
      return this.getObjectByProperty(`name`, e32);
    }
    getObjectByProperty(e32, t3) {
      if (this[e32] === t3) return this;
      for (let n3 = 0, r3 = this.children.length; n3 < r3; n3++) {
        let r4 = this.children[n3].getObjectByProperty(e32, t3);
        if (r4 !== void 0) return r4;
      }
    }
    getObjectsByProperty(e32, t3, n3 = []) {
      this[e32] === t3 && n3.push(this);
      let r3 = this.children;
      for (let i3 = 0, a3 = r3.length; i3 < a3; i3++) r3[i3].getObjectsByProperty(e32, t3, n3);
      return n3;
    }
    getWorldPosition(e32) {
      return this.updateWorldMatrix(true, false), e32.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(e32) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(bn, e32, xn), e32;
    }
    getWorldScale(e32) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(bn, Sn, e32), e32;
    }
    getWorldDirection(e32) {
      this.updateWorldMatrix(true, false);
      let t3 = this.matrixWorld.elements;
      return e32.set(t3[8], t3[9], t3[10]).normalize();
    }
    raycast() {
    }
    traverse(e32) {
      e32(this);
      let t3 = this.children;
      for (let n3 = 0, r3 = t3.length; n3 < r3; n3++) t3[n3].traverse(e32);
    }
    traverseVisible(e32) {
      if (this.visible === false) return;
      e32(this);
      let t3 = this.children;
      for (let n3 = 0, r3 = t3.length; n3 < r3; n3++) t3[n3].traverseVisible(e32);
    }
    traverseAncestors(e32) {
      let t3 = this.parent;
      t3 !== null && (e32(t3), t3.traverseAncestors(e32));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(e32) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e32) && (this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = false, e32 = true);
      let t3 = this.children;
      for (let n3 = 0, r3 = t3.length; n3 < r3; n3++) t3[n3].updateMatrixWorld(e32);
    }
    updateWorldMatrix(e32, t3) {
      let n3 = this.parent;
      if (e32 === true && n3 !== null && n3.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t3 === true) {
        let e33 = this.children;
        for (let t4 = 0, n4 = e33.length; t4 < n4; t4++) e33[t4].updateWorldMatrix(false, true);
      }
    }
    toJSON(e32) {
      let t3 = e32 === void 0 || typeof e32 == `string`, n3 = {};
      t3 && (e32 = { geometries: {}, materials: {}, textures: {}, images: {}, shapes: {}, skeletons: {}, animations: {}, nodes: {} }, n3.metadata = { version: 4.7, type: `Object`, generator: `Object3D.toJSON` });
      let r3 = {};
      r3.uuid = this.uuid, r3.type = this.type, this.name !== `` && (r3.name = this.name), this.castShadow === true && (r3.castShadow = true), this.receiveShadow === true && (r3.receiveShadow = true), this.visible === false && (r3.visible = false), this.frustumCulled === false && (r3.frustumCulled = false), this.renderOrder !== 0 && (r3.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (r3.userData = this.userData), r3.layers = this.layers.mask, r3.matrix = this.matrix.toArray(), r3.up = this.up.toArray(), this.matrixAutoUpdate === false && (r3.matrixAutoUpdate = false), this.isInstancedMesh && (r3.type = `InstancedMesh`, r3.count = this.count, r3.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r3.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r3.type = `BatchedMesh`, r3.perObjectFrustumCulled = this.perObjectFrustumCulled, r3.sortObjects = this.sortObjects, r3.drawRanges = this._drawRanges, r3.reservedRanges = this._reservedRanges, r3.geometryInfo = this._geometryInfo.map((e33) => ({ ...e33, boundingBox: e33.boundingBox ? e33.boundingBox.toJSON() : void 0, boundingSphere: e33.boundingSphere ? e33.boundingSphere.toJSON() : void 0 })), r3.instanceInfo = this._instanceInfo.map((e33) => ({ ...e33 })), r3.availableInstanceIds = this._availableInstanceIds.slice(), r3.availableGeometryIds = this._availableGeometryIds.slice(), r3.nextIndexStart = this._nextIndexStart, r3.nextVertexStart = this._nextVertexStart, r3.geometryCount = this._geometryCount, r3.maxInstanceCount = this._maxInstanceCount, r3.maxVertexCount = this._maxVertexCount, r3.maxIndexCount = this._maxIndexCount, r3.geometryInitialized = this._geometryInitialized, r3.matricesTexture = this._matricesTexture.toJSON(e32), r3.indirectTexture = this._indirectTexture.toJSON(e32), this._colorsTexture !== null && (r3.colorsTexture = this._colorsTexture.toJSON(e32)), this.boundingSphere !== null && (r3.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r3.boundingBox = this.boundingBox.toJSON()));
      function i3(t4, n4) {
        return t4[n4.uuid] === void 0 && (t4[n4.uuid] = n4.toJSON(e32)), n4.uuid;
      }
      if (this.isScene) this.background && (this.background.isColor ? r3.background = this.background.toJSON() : this.background.isTexture && (r3.background = this.background.toJSON(e32).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (r3.environment = this.environment.toJSON(e32).uuid);
      else if (this.isMesh || this.isLine || this.isPoints) {
        r3.geometry = i3(e32.geometries, this.geometry);
        let t4 = this.geometry.parameters;
        if (t4 !== void 0 && t4.shapes !== void 0) {
          let n4 = t4.shapes;
          if (Array.isArray(n4)) for (let t5 = 0, r4 = n4.length; t5 < r4; t5++) {
            let r5 = n4[t5];
            i3(e32.shapes, r5);
          }
          else i3(e32.shapes, n4);
        }
      }
      if (this.isSkinnedMesh && (r3.bindMode = this.bindMode, r3.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (i3(e32.skeletons, this.skeleton), r3.skeleton = this.skeleton.uuid)), this.material !== void 0) if (Array.isArray(this.material)) {
        let t4 = [];
        for (let n4 = 0, r4 = this.material.length; n4 < r4; n4++) t4.push(i3(e32.materials, this.material[n4]));
        r3.material = t4;
      } else r3.material = i3(e32.materials, this.material);
      if (this.children.length > 0) {
        r3.children = [];
        for (let t4 = 0; t4 < this.children.length; t4++) r3.children.push(this.children[t4].toJSON(e32).object);
      }
      if (this.animations.length > 0) {
        r3.animations = [];
        for (let t4 = 0; t4 < this.animations.length; t4++) {
          let n4 = this.animations[t4];
          r3.animations.push(i3(e32.animations, n4));
        }
      }
      if (t3) {
        let t4 = a3(e32.geometries), r4 = a3(e32.materials), i4 = a3(e32.textures), o3 = a3(e32.images), s3 = a3(e32.shapes), c3 = a3(e32.skeletons), l3 = a3(e32.animations), u3 = a3(e32.nodes);
        t4.length > 0 && (n3.geometries = t4), r4.length > 0 && (n3.materials = r4), i4.length > 0 && (n3.textures = i4), o3.length > 0 && (n3.images = o3), s3.length > 0 && (n3.shapes = s3), c3.length > 0 && (n3.skeletons = c3), l3.length > 0 && (n3.animations = l3), u3.length > 0 && (n3.nodes = u3);
      }
      return n3.object = r3, n3;
      function a3(e33) {
        let t4 = [];
        for (let n4 in e33) {
          let r4 = e33[n4];
          delete r4.metadata, t4.push(r4);
        }
        return t4;
      }
    }
    clone(e32) {
      return new this.constructor().copy(this, e32);
    }
    copy(e32, t3 = true) {
      if (this.name = e32.name, this.up.copy(e32.up), this.position.copy(e32.position), this.rotation.order = e32.rotation.order, this.quaternion.copy(e32.quaternion), this.scale.copy(e32.scale), this.matrix.copy(e32.matrix), this.matrixWorld.copy(e32.matrixWorld), this.matrixAutoUpdate = e32.matrixAutoUpdate, this.matrixWorldAutoUpdate = e32.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e32.matrixWorldNeedsUpdate, this.layers.mask = e32.layers.mask, this.visible = e32.visible, this.castShadow = e32.castShadow, this.receiveShadow = e32.receiveShadow, this.frustumCulled = e32.frustumCulled, this.renderOrder = e32.renderOrder, this.animations = e32.animations.slice(), this.userData = JSON.parse(JSON.stringify(e32.userData)), t3 === true) for (let t4 = 0; t4 < e32.children.length; t4++) {
        let n3 = e32.children[t4];
        this.add(n3.clone());
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
    constructor(e32 = new W(), t3 = new W(), n3 = new W()) {
      this.a = e32, this.b = t3, this.c = n3;
    }
    static getNormal(e32, t3, n3, r3) {
      r3.subVectors(n3, t3), jn.subVectors(e32, t3), r3.cross(jn);
      let i3 = r3.lengthSq();
      return i3 > 0 ? r3.multiplyScalar(1 / Math.sqrt(i3)) : r3.set(0, 0, 0);
    }
    static getBarycoord(e32, t3, n3, r3, i3) {
      jn.subVectors(r3, t3), Mn.subVectors(n3, t3), Nn.subVectors(e32, t3);
      let a3 = jn.dot(jn), o3 = jn.dot(Mn), s3 = jn.dot(Nn), c3 = Mn.dot(Mn), l3 = Mn.dot(Nn), u3 = a3 * c3 - o3 * o3;
      if (u3 === 0) return i3.set(0, 0, 0), null;
      let d3 = 1 / u3, f3 = (c3 * s3 - o3 * l3) * d3, p3 = (a3 * l3 - o3 * s3) * d3;
      return i3.set(1 - f3 - p3, p3, f3);
    }
    static containsPoint(e32, t3, n3, r3) {
      return this.getBarycoord(e32, t3, n3, r3, Pn) !== null && Pn.x >= 0 && Pn.y >= 0 && Pn.x + Pn.y <= 1;
    }
    static getInterpolation(e32, t3, n3, r3, i3, a3, o3, s3) {
      return this.getBarycoord(e32, t3, n3, r3, Pn) === null ? (s3.x = 0, s3.y = 0, `z` in s3 && (s3.z = 0), `w` in s3 && (s3.w = 0), null) : (s3.setScalar(0), s3.addScaledVector(i3, Pn.x), s3.addScaledVector(a3, Pn.y), s3.addScaledVector(o3, Pn.z), s3);
    }
    static getInterpolatedAttribute(e32, t3, n3, r3, i3, a3) {
      return Vn.setScalar(0), Hn.setScalar(0), Un.setScalar(0), Vn.fromBufferAttribute(e32, t3), Hn.fromBufferAttribute(e32, n3), Un.fromBufferAttribute(e32, r3), a3.setScalar(0), a3.addScaledVector(Vn, i3.x), a3.addScaledVector(Hn, i3.y), a3.addScaledVector(Un, i3.z), a3;
    }
    static isFrontFacing(e32, t3, n3, r3) {
      return jn.subVectors(n3, t3), Mn.subVectors(e32, t3), jn.cross(Mn).dot(r3) < 0;
    }
    set(e32, t3, n3) {
      return this.a.copy(e32), this.b.copy(t3), this.c.copy(n3), this;
    }
    setFromPointsAndIndices(e32, t3, n3, r3) {
      return this.a.copy(e32[t3]), this.b.copy(e32[n3]), this.c.copy(e32[r3]), this;
    }
    setFromAttributeAndIndices(e32, t3, n3, r3) {
      return this.a.fromBufferAttribute(e32, t3), this.b.fromBufferAttribute(e32, n3), this.c.fromBufferAttribute(e32, r3), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e32) {
      return this.a.copy(e32.a), this.b.copy(e32.b), this.c.copy(e32.c), this;
    }
    getArea() {
      return jn.subVectors(this.c, this.b), Mn.subVectors(this.a, this.b), jn.cross(Mn).length() * 0.5;
    }
    getMidpoint(e32) {
      return e32.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(t3) {
      return e10.getNormal(this.a, this.b, this.c, t3);
    }
    getPlane(e32) {
      return e32.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(t3, n3) {
      return e10.getBarycoord(t3, this.a, this.b, this.c, n3);
    }
    getInterpolation(t3, n3, r3, i3, a3) {
      return e10.getInterpolation(t3, this.a, this.b, this.c, n3, r3, i3, a3);
    }
    containsPoint(t3) {
      return e10.containsPoint(t3, this.a, this.b, this.c);
    }
    isFrontFacing(t3) {
      return e10.isFrontFacing(this.a, this.b, this.c, t3);
    }
    intersectsBox(e32) {
      return e32.intersectsTriangle(this);
    }
    closestPointToPoint(e32, t3) {
      let n3 = this.a, r3 = this.b, i3 = this.c, a3, o3;
      Fn.subVectors(r3, n3), In.subVectors(i3, n3), Rn.subVectors(e32, n3);
      let s3 = Fn.dot(Rn), c3 = In.dot(Rn);
      if (s3 <= 0 && c3 <= 0) return t3.copy(n3);
      zn.subVectors(e32, r3);
      let l3 = Fn.dot(zn), u3 = In.dot(zn);
      if (l3 >= 0 && u3 <= l3) return t3.copy(r3);
      let d3 = s3 * u3 - l3 * c3;
      if (d3 <= 0 && s3 >= 0 && l3 <= 0) return a3 = s3 / (s3 - l3), t3.copy(n3).addScaledVector(Fn, a3);
      Bn.subVectors(e32, i3);
      let f3 = Fn.dot(Bn), p3 = In.dot(Bn);
      if (p3 >= 0 && f3 <= p3) return t3.copy(i3);
      let m3 = f3 * c3 - s3 * p3;
      if (m3 <= 0 && c3 >= 0 && p3 <= 0) return o3 = c3 / (c3 - p3), t3.copy(n3).addScaledVector(In, o3);
      let h3 = l3 * p3 - f3 * u3;
      if (h3 <= 0 && u3 - l3 >= 0 && f3 - p3 >= 0) return Ln.subVectors(i3, r3), o3 = (u3 - l3) / (u3 - l3 + (f3 - p3)), t3.copy(r3).addScaledVector(Ln, o3);
      let g3 = 1 / (h3 + m3 + d3);
      return a3 = m3 * g3, o3 = d3 * g3, t3.copy(n3).addScaledVector(Fn, a3).addScaledVector(In, o3);
    }
    equals(e32) {
      return e32.a.equals(this.a) && e32.b.equals(this.b) && e32.c.equals(this.c);
    }
  };
  var Gn = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, rebeccapurple: 6697881, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 };
  var Kn = { h: 0, s: 0, l: 0 };
  var qn = { h: 0, s: 0, l: 0 };
  function Jn(e32, t3, n3) {
    return n3 < 0 && (n3 += 1), n3 > 1 && --n3, n3 < 1 / 6 ? e32 + (t3 - e32) * 6 * n3 : n3 < 1 / 2 ? t3 : n3 < 2 / 3 ? e32 + (t3 - e32) * 6 * (2 / 3 - n3) : e32;
  }
  var q = class {
    constructor(e32, t3, n3) {
      return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(e32, t3, n3);
    }
    set(e32, t3, n3) {
      if (t3 === void 0 && n3 === void 0) {
        let t4 = e32;
        t4 && t4.isColor ? this.copy(t4) : typeof t4 == `number` ? this.setHex(t4) : typeof t4 == `string` && this.setStyle(t4);
      } else this.setRGB(e32, t3, n3);
      return this;
    }
    setScalar(e32) {
      return this.r = e32, this.g = e32, this.b = e32, this;
    }
    setHex(e32, t3 = ze) {
      return e32 = Math.floor(e32), this.r = (e32 >> 16 & 255) / 255, this.g = (e32 >> 8 & 255) / 255, this.b = (e32 & 255) / 255, K.colorSpaceToWorking(this, t3), this;
    }
    setRGB(e32, t3, n3, r3 = K.workingColorSpace) {
      return this.r = e32, this.g = t3, this.b = n3, K.colorSpaceToWorking(this, r3), this;
    }
    setHSL(e32, t3, n3, r3 = K.workingColorSpace) {
      if (e32 = Ze(e32, 1), t3 = H(t3, 0, 1), n3 = H(n3, 0, 1), t3 === 0) this.r = this.g = this.b = n3;
      else {
        let r4 = n3 <= 0.5 ? n3 * (1 + t3) : n3 + t3 - n3 * t3, i3 = 2 * n3 - r4;
        this.r = Jn(i3, r4, e32 + 1 / 3), this.g = Jn(i3, r4, e32), this.b = Jn(i3, r4, e32 - 1 / 3);
      }
      return K.colorSpaceToWorking(this, r3), this;
    }
    setStyle(e32, t3 = ze) {
      function n3(t4) {
        t4 !== void 0 && parseFloat(t4) < 1 && console.warn(`THREE.Color: Alpha component of ` + e32 + ` will be ignored.`);
      }
      let r3;
      if (r3 = /^(\w+)\(([^\)]*)\)/.exec(e32)) {
        let i3, a3 = r3[1], o3 = r3[2];
        switch (a3) {
          case `rgb`:
          case `rgba`:
            if (i3 = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o3)) return n3(i3[4]), this.setRGB(Math.min(255, parseInt(i3[1], 10)) / 255, Math.min(255, parseInt(i3[2], 10)) / 255, Math.min(255, parseInt(i3[3], 10)) / 255, t3);
            if (i3 = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o3)) return n3(i3[4]), this.setRGB(Math.min(100, parseInt(i3[1], 10)) / 100, Math.min(100, parseInt(i3[2], 10)) / 100, Math.min(100, parseInt(i3[3], 10)) / 100, t3);
            break;
          case `hsl`:
          case `hsla`:
            if (i3 = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o3)) return n3(i3[4]), this.setHSL(parseFloat(i3[1]) / 360, parseFloat(i3[2]) / 100, parseFloat(i3[3]) / 100, t3);
            break;
          default:
            console.warn(`THREE.Color: Unknown color model ` + e32);
        }
      } else if (r3 = /^\#([A-Fa-f\d]+)$/.exec(e32)) {
        let n4 = r3[1], i3 = n4.length;
        if (i3 === 3) return this.setRGB(parseInt(n4.charAt(0), 16) / 15, parseInt(n4.charAt(1), 16) / 15, parseInt(n4.charAt(2), 16) / 15, t3);
        if (i3 === 6) return this.setHex(parseInt(n4, 16), t3);
        console.warn(`THREE.Color: Invalid hex color ` + e32);
      } else if (e32 && e32.length > 0) return this.setColorName(e32, t3);
      return this;
    }
    setColorName(e32, t3 = ze) {
      let n3 = Gn[e32.toLowerCase()];
      return n3 === void 0 ? console.warn(`THREE.Color: Unknown color ` + e32) : this.setHex(n3, t3), this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(e32) {
      return this.r = e32.r, this.g = e32.g, this.b = e32.b, this;
    }
    copySRGBToLinear(e32) {
      return this.r = mt(e32.r), this.g = mt(e32.g), this.b = mt(e32.b), this;
    }
    copyLinearToSRGB(e32) {
      return this.r = ht(e32.r), this.g = ht(e32.g), this.b = ht(e32.b), this;
    }
    convertSRGBToLinear() {
      return this.copySRGBToLinear(this), this;
    }
    convertLinearToSRGB() {
      return this.copyLinearToSRGB(this), this;
    }
    getHex(e32 = ze) {
      return K.workingToColorSpace(Yn.copy(this), e32), Math.round(H(Yn.r * 255, 0, 255)) * 65536 + Math.round(H(Yn.g * 255, 0, 255)) * 256 + Math.round(H(Yn.b * 255, 0, 255));
    }
    getHexString(e32 = ze) {
      return (`000000` + this.getHex(e32).toString(16)).slice(-6);
    }
    getHSL(e32, t3 = K.workingColorSpace) {
      K.workingToColorSpace(Yn.copy(this), t3);
      let n3 = Yn.r, r3 = Yn.g, i3 = Yn.b, a3 = Math.max(n3, r3, i3), o3 = Math.min(n3, r3, i3), s3, c3, l3 = (o3 + a3) / 2;
      if (o3 === a3) s3 = 0, c3 = 0;
      else {
        let e33 = a3 - o3;
        switch (c3 = l3 <= 0.5 ? e33 / (a3 + o3) : e33 / (2 - a3 - o3), a3) {
          case n3:
            s3 = (r3 - i3) / e33 + (r3 < i3 ? 6 : 0);
            break;
          case r3:
            s3 = (i3 - n3) / e33 + 2;
            break;
          case i3:
            s3 = (n3 - r3) / e33 + 4;
            break;
        }
        s3 /= 6;
      }
      return e32.h = s3, e32.s = c3, e32.l = l3, e32;
    }
    getRGB(e32, t3 = K.workingColorSpace) {
      return K.workingToColorSpace(Yn.copy(this), t3), e32.r = Yn.r, e32.g = Yn.g, e32.b = Yn.b, e32;
    }
    getStyle(e32 = ze) {
      K.workingToColorSpace(Yn.copy(this), e32);
      let t3 = Yn.r, n3 = Yn.g, r3 = Yn.b;
      return e32 === `srgb` ? `rgb(${Math.round(t3 * 255)},${Math.round(n3 * 255)},${Math.round(r3 * 255)})` : `color(${e32} ${t3.toFixed(3)} ${n3.toFixed(3)} ${r3.toFixed(3)})`;
    }
    offsetHSL(e32, t3, n3) {
      return this.getHSL(Kn), this.setHSL(Kn.h + e32, Kn.s + t3, Kn.l + n3);
    }
    add(e32) {
      return this.r += e32.r, this.g += e32.g, this.b += e32.b, this;
    }
    addColors(e32, t3) {
      return this.r = e32.r + t3.r, this.g = e32.g + t3.g, this.b = e32.b + t3.b, this;
    }
    addScalar(e32) {
      return this.r += e32, this.g += e32, this.b += e32, this;
    }
    sub(e32) {
      return this.r = Math.max(0, this.r - e32.r), this.g = Math.max(0, this.g - e32.g), this.b = Math.max(0, this.b - e32.b), this;
    }
    multiply(e32) {
      return this.r *= e32.r, this.g *= e32.g, this.b *= e32.b, this;
    }
    multiplyScalar(e32) {
      return this.r *= e32, this.g *= e32, this.b *= e32, this;
    }
    lerp(e32, t3) {
      return this.r += (e32.r - this.r) * t3, this.g += (e32.g - this.g) * t3, this.b += (e32.b - this.b) * t3, this;
    }
    lerpColors(e32, t3, n3) {
      return this.r = e32.r + (t3.r - e32.r) * n3, this.g = e32.g + (t3.g - e32.g) * n3, this.b = e32.b + (t3.b - e32.b) * n3, this;
    }
    lerpHSL(e32, t3) {
      this.getHSL(Kn), e32.getHSL(qn);
      let n3 = Qe(Kn.h, qn.h, t3), r3 = Qe(Kn.s, qn.s, t3), i3 = Qe(Kn.l, qn.l, t3);
      return this.setHSL(n3, r3, i3), this;
    }
    setFromVector3(e32) {
      return this.r = e32.x, this.g = e32.y, this.b = e32.z, this;
    }
    applyMatrix3(e32) {
      let t3 = this.r, n3 = this.g, r3 = this.b, i3 = e32.elements;
      return this.r = i3[0] * t3 + i3[3] * n3 + i3[6] * r3, this.g = i3[1] * t3 + i3[4] * n3 + i3[7] * r3, this.b = i3[2] * t3 + i3[5] * n3 + i3[8] * r3, this;
    }
    equals(e32) {
      return e32.r === this.r && e32.g === this.g && e32.b === this.b;
    }
    fromArray(e32, t3 = 0) {
      return this.r = e32[t3], this.g = e32[t3 + 1], this.b = e32[t3 + 2], this;
    }
    toArray(e32 = [], t3 = 0) {
      return e32[t3] = this.r, e32[t3 + 1] = this.g, e32[t3 + 2] = this.b, e32;
    }
    fromBufferAttribute(e32, t3) {
      return this.r = e32.getX(t3), this.g = e32.getY(t3), this.b = e32.getZ(t3), this;
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
    set alphaTest(e32) {
      this._alphaTest > 0 != e32 > 0 && this.version++, this._alphaTest = e32;
    }
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(e32) {
      if (e32 !== void 0) for (let t3 in e32) {
        let n3 = e32[t3];
        if (n3 === void 0) {
          console.warn(`THREE.Material: parameter '${t3}' has value of undefined.`);
          continue;
        }
        let r3 = this[t3];
        if (r3 === void 0) {
          console.warn(`THREE.Material: '${t3}' is not a property of THREE.${this.type}.`);
          continue;
        }
        r3 && r3.isColor ? r3.set(n3) : r3 && r3.isVector3 && n3 && n3.isVector3 ? r3.copy(n3) : this[t3] = n3;
      }
    }
    toJSON(e32) {
      let t3 = e32 === void 0 || typeof e32 == `string`;
      t3 && (e32 = { textures: {}, images: {} });
      let n3 = { metadata: { version: 4.7, type: `Material`, generator: `Material.toJSON` } };
      n3.uuid = this.uuid, n3.type = this.type, this.name !== `` && (n3.name = this.name), this.color && this.color.isColor && (n3.color = this.color.getHex()), this.roughness !== void 0 && (n3.roughness = this.roughness), this.metalness !== void 0 && (n3.metalness = this.metalness), this.sheen !== void 0 && (n3.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n3.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n3.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n3.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n3.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n3.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n3.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n3.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n3.shininess = this.shininess), this.clearcoat !== void 0 && (n3.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n3.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n3.clearcoatMap = this.clearcoatMap.toJSON(e32).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n3.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e32).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n3.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e32).uuid, n3.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n3.sheenColorMap = this.sheenColorMap.toJSON(e32).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n3.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e32).uuid), this.dispersion !== void 0 && (n3.dispersion = this.dispersion), this.iridescence !== void 0 && (n3.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n3.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n3.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n3.iridescenceMap = this.iridescenceMap.toJSON(e32).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n3.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e32).uuid), this.anisotropy !== void 0 && (n3.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n3.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n3.anisotropyMap = this.anisotropyMap.toJSON(e32).uuid), this.map && this.map.isTexture && (n3.map = this.map.toJSON(e32).uuid), this.matcap && this.matcap.isTexture && (n3.matcap = this.matcap.toJSON(e32).uuid), this.alphaMap && this.alphaMap.isTexture && (n3.alphaMap = this.alphaMap.toJSON(e32).uuid), this.lightMap && this.lightMap.isTexture && (n3.lightMap = this.lightMap.toJSON(e32).uuid, n3.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n3.aoMap = this.aoMap.toJSON(e32).uuid, n3.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n3.bumpMap = this.bumpMap.toJSON(e32).uuid, n3.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n3.normalMap = this.normalMap.toJSON(e32).uuid, n3.normalMapType = this.normalMapType, n3.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n3.displacementMap = this.displacementMap.toJSON(e32).uuid, n3.displacementScale = this.displacementScale, n3.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n3.roughnessMap = this.roughnessMap.toJSON(e32).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n3.metalnessMap = this.metalnessMap.toJSON(e32).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n3.emissiveMap = this.emissiveMap.toJSON(e32).uuid), this.specularMap && this.specularMap.isTexture && (n3.specularMap = this.specularMap.toJSON(e32).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n3.specularIntensityMap = this.specularIntensityMap.toJSON(e32).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n3.specularColorMap = this.specularColorMap.toJSON(e32).uuid), this.envMap && this.envMap.isTexture && (n3.envMap = this.envMap.toJSON(e32).uuid, this.combine !== void 0 && (n3.combine = this.combine)), this.envMapRotation !== void 0 && (n3.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n3.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n3.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n3.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n3.gradientMap = this.gradientMap.toJSON(e32).uuid), this.transmission !== void 0 && (n3.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n3.transmissionMap = this.transmissionMap.toJSON(e32).uuid), this.thickness !== void 0 && (n3.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n3.thicknessMap = this.thicknessMap.toJSON(e32).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n3.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n3.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n3.size = this.size), this.shadowSide !== null && (n3.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n3.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (n3.blending = this.blending), this.side !== 0 && (n3.side = this.side), this.vertexColors === true && (n3.vertexColors = true), this.opacity < 1 && (n3.opacity = this.opacity), this.transparent === true && (n3.transparent = true), this.blendSrc !== 204 && (n3.blendSrc = this.blendSrc), this.blendDst !== 205 && (n3.blendDst = this.blendDst), this.blendEquation !== 100 && (n3.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n3.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n3.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n3.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n3.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n3.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (n3.depthFunc = this.depthFunc), this.depthTest === false && (n3.depthTest = this.depthTest), this.depthWrite === false && (n3.depthWrite = this.depthWrite), this.colorWrite === false && (n3.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n3.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (n3.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n3.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n3.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (n3.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (n3.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (n3.stencilZPass = this.stencilZPass), this.stencilWrite === true && (n3.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n3.rotation = this.rotation), this.polygonOffset === true && (n3.polygonOffset = true), this.polygonOffsetFactor !== 0 && (n3.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n3.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n3.linewidth = this.linewidth), this.dashSize !== void 0 && (n3.dashSize = this.dashSize), this.gapSize !== void 0 && (n3.gapSize = this.gapSize), this.scale !== void 0 && (n3.scale = this.scale), this.dithering === true && (n3.dithering = true), this.alphaTest > 0 && (n3.alphaTest = this.alphaTest), this.alphaHash === true && (n3.alphaHash = true), this.alphaToCoverage === true && (n3.alphaToCoverage = true), this.premultipliedAlpha === true && (n3.premultipliedAlpha = true), this.forceSinglePass === true && (n3.forceSinglePass = true), this.wireframe === true && (n3.wireframe = true), this.wireframeLinewidth > 1 && (n3.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== `round` && (n3.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== `round` && (n3.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === true && (n3.flatShading = true), this.visible === false && (n3.visible = false), this.toneMapped === false && (n3.toneMapped = false), this.fog === false && (n3.fog = false), Object.keys(this.userData).length > 0 && (n3.userData = this.userData);
      function r3(e33) {
        let t4 = [];
        for (let n4 in e33) {
          let r4 = e33[n4];
          delete r4.metadata, t4.push(r4);
        }
        return t4;
      }
      if (t3) {
        let t4 = r3(e32.textures), i3 = r3(e32.images);
        t4.length > 0 && (n3.textures = t4), i3.length > 0 && (n3.images = i3);
      }
      return n3;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e32) {
      this.name = e32.name, this.blending = e32.blending, this.side = e32.side, this.vertexColors = e32.vertexColors, this.opacity = e32.opacity, this.transparent = e32.transparent, this.blendSrc = e32.blendSrc, this.blendDst = e32.blendDst, this.blendEquation = e32.blendEquation, this.blendSrcAlpha = e32.blendSrcAlpha, this.blendDstAlpha = e32.blendDstAlpha, this.blendEquationAlpha = e32.blendEquationAlpha, this.blendColor.copy(e32.blendColor), this.blendAlpha = e32.blendAlpha, this.depthFunc = e32.depthFunc, this.depthTest = e32.depthTest, this.depthWrite = e32.depthWrite, this.stencilWriteMask = e32.stencilWriteMask, this.stencilFunc = e32.stencilFunc, this.stencilRef = e32.stencilRef, this.stencilFuncMask = e32.stencilFuncMask, this.stencilFail = e32.stencilFail, this.stencilZFail = e32.stencilZFail, this.stencilZPass = e32.stencilZPass, this.stencilWrite = e32.stencilWrite;
      let t3 = e32.clippingPlanes, n3 = null;
      if (t3 !== null) {
        let e33 = t3.length;
        n3 = Array(e33);
        for (let r3 = 0; r3 !== e33; ++r3) n3[r3] = t3[r3].clone();
      }
      return this.clippingPlanes = n3, this.clipIntersection = e32.clipIntersection, this.clipShadows = e32.clipShadows, this.shadowSide = e32.shadowSide, this.colorWrite = e32.colorWrite, this.precision = e32.precision, this.polygonOffset = e32.polygonOffset, this.polygonOffsetFactor = e32.polygonOffsetFactor, this.polygonOffsetUnits = e32.polygonOffsetUnits, this.dithering = e32.dithering, this.alphaTest = e32.alphaTest, this.alphaHash = e32.alphaHash, this.alphaToCoverage = e32.alphaToCoverage, this.premultipliedAlpha = e32.premultipliedAlpha, this.forceSinglePass = e32.forceSinglePass, this.visible = e32.visible, this.toneMapped = e32.toneMapped, this.userData = JSON.parse(JSON.stringify(e32.userData)), this;
    }
    dispose() {
      this.dispatchEvent({ type: `dispose` });
    }
    set needsUpdate(e32) {
      e32 === true && this.version++;
    }
  };
  var Qn = class extends Zn {
    constructor(e32) {
      super(), this.isMeshBasicMaterial = true, this.type = `MeshBasicMaterial`, this.color = new q(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new pn(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = `round`, this.wireframeLinejoin = `round`, this.fog = true, this.setValues(e32);
    }
    copy(e32) {
      return super.copy(e32), this.color.copy(e32.color), this.map = e32.map, this.lightMap = e32.lightMap, this.lightMapIntensity = e32.lightMapIntensity, this.aoMap = e32.aoMap, this.aoMapIntensity = e32.aoMapIntensity, this.specularMap = e32.specularMap, this.alphaMap = e32.alphaMap, this.envMap = e32.envMap, this.envMapRotation.copy(e32.envMapRotation), this.combine = e32.combine, this.reflectivity = e32.reflectivity, this.refractionRatio = e32.refractionRatio, this.wireframe = e32.wireframe, this.wireframeLinewidth = e32.wireframeLinewidth, this.wireframeLinecap = e32.wireframeLinecap, this.wireframeLinejoin = e32.wireframeLinejoin, this.fog = e32.fog, this;
    }
  };
  var $n = new W();
  var er = new U();
  var tr = 0;
  var nr = class {
    constructor(e32, t3, n3 = false) {
      if (Array.isArray(e32)) throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);
      this.isBufferAttribute = true, Object.defineProperty(this, "id", { value: tr++ }), this.name = ``, this.array = e32, this.itemSize = t3, this.count = e32 === void 0 ? 0 : e32.length / t3, this.normalized = n3, this.usage = We, this.updateRanges = [], this.gpuType = w, this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(e32) {
      e32 === true && this.version++;
    }
    setUsage(e32) {
      return this.usage = e32, this;
    }
    addUpdateRange(e32, t3) {
      this.updateRanges.push({ start: e32, count: t3 });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e32) {
      return this.name = e32.name, this.array = new e32.array.constructor(e32.array), this.itemSize = e32.itemSize, this.count = e32.count, this.normalized = e32.normalized, this.usage = e32.usage, this.gpuType = e32.gpuType, this;
    }
    copyAt(e32, t3, n3) {
      e32 *= this.itemSize, n3 *= t3.itemSize;
      for (let r3 = 0, i3 = this.itemSize; r3 < i3; r3++) this.array[e32 + r3] = t3.array[n3 + r3];
      return this;
    }
    copyArray(e32) {
      return this.array.set(e32), this;
    }
    applyMatrix3(e32) {
      if (this.itemSize === 2) for (let t3 = 0, n3 = this.count; t3 < n3; t3++) er.fromBufferAttribute(this, t3), er.applyMatrix3(e32), this.setXY(t3, er.x, er.y);
      else if (this.itemSize === 3) for (let t3 = 0, n3 = this.count; t3 < n3; t3++) $n.fromBufferAttribute(this, t3), $n.applyMatrix3(e32), this.setXYZ(t3, $n.x, $n.y, $n.z);
      return this;
    }
    applyMatrix4(e32) {
      for (let t3 = 0, n3 = this.count; t3 < n3; t3++) $n.fromBufferAttribute(this, t3), $n.applyMatrix4(e32), this.setXYZ(t3, $n.x, $n.y, $n.z);
      return this;
    }
    applyNormalMatrix(e32) {
      for (let t3 = 0, n3 = this.count; t3 < n3; t3++) $n.fromBufferAttribute(this, t3), $n.applyNormalMatrix(e32), this.setXYZ(t3, $n.x, $n.y, $n.z);
      return this;
    }
    transformDirection(e32) {
      for (let t3 = 0, n3 = this.count; t3 < n3; t3++) $n.fromBufferAttribute(this, t3), $n.transformDirection(e32), this.setXYZ(t3, $n.x, $n.y, $n.z);
      return this;
    }
    set(e32, t3 = 0) {
      return this.array.set(e32, t3), this;
    }
    getComponent(e32, t3) {
      let n3 = this.array[e32 * this.itemSize + t3];
      return this.normalized && (n3 = $e(n3, this.array)), n3;
    }
    setComponent(e32, t3, n3) {
      return this.normalized && (n3 = et(n3, this.array)), this.array[e32 * this.itemSize + t3] = n3, this;
    }
    getX(e32) {
      let t3 = this.array[e32 * this.itemSize];
      return this.normalized && (t3 = $e(t3, this.array)), t3;
    }
    setX(e32, t3) {
      return this.normalized && (t3 = et(t3, this.array)), this.array[e32 * this.itemSize] = t3, this;
    }
    getY(e32) {
      let t3 = this.array[e32 * this.itemSize + 1];
      return this.normalized && (t3 = $e(t3, this.array)), t3;
    }
    setY(e32, t3) {
      return this.normalized && (t3 = et(t3, this.array)), this.array[e32 * this.itemSize + 1] = t3, this;
    }
    getZ(e32) {
      let t3 = this.array[e32 * this.itemSize + 2];
      return this.normalized && (t3 = $e(t3, this.array)), t3;
    }
    setZ(e32, t3) {
      return this.normalized && (t3 = et(t3, this.array)), this.array[e32 * this.itemSize + 2] = t3, this;
    }
    getW(e32) {
      let t3 = this.array[e32 * this.itemSize + 3];
      return this.normalized && (t3 = $e(t3, this.array)), t3;
    }
    setW(e32, t3) {
      return this.normalized && (t3 = et(t3, this.array)), this.array[e32 * this.itemSize + 3] = t3, this;
    }
    setXY(e32, t3, n3) {
      return e32 *= this.itemSize, this.normalized && (t3 = et(t3, this.array), n3 = et(n3, this.array)), this.array[e32 + 0] = t3, this.array[e32 + 1] = n3, this;
    }
    setXYZ(e32, t3, n3, r3) {
      return e32 *= this.itemSize, this.normalized && (t3 = et(t3, this.array), n3 = et(n3, this.array), r3 = et(r3, this.array)), this.array[e32 + 0] = t3, this.array[e32 + 1] = n3, this.array[e32 + 2] = r3, this;
    }
    setXYZW(e32, t3, n3, r3, i3) {
      return e32 *= this.itemSize, this.normalized && (t3 = et(t3, this.array), n3 = et(n3, this.array), r3 = et(r3, this.array), i3 = et(i3, this.array)), this.array[e32 + 0] = t3, this.array[e32 + 1] = n3, this.array[e32 + 2] = r3, this.array[e32 + 3] = i3, this;
    }
    onUpload(e32) {
      return this.onUploadCallback = e32, this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      let e32 = { itemSize: this.itemSize, type: this.array.constructor.name, array: Array.from(this.array), normalized: this.normalized };
      return this.name !== `` && (e32.name = this.name), this.usage !== 35044 && (e32.usage = this.usage), e32;
    }
  };
  var rr = class extends nr {
    constructor(e32, t3, n3) {
      super(new Uint16Array(e32), t3, n3);
    }
  };
  var ir = class extends nr {
    constructor(e32, t3, n3) {
      super(new Uint32Array(e32), t3, n3);
    }
  };
  var ar = class extends nr {
    constructor(e32, t3, n3) {
      super(new Float32Array(e32), t3, n3);
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
    setIndex(e32) {
      return Array.isArray(e32) ? this.index = new (at(e32) ? ir : rr)(e32, 1) : this.index = e32, this;
    }
    setIndirect(e32) {
      return this.indirect = e32, this;
    }
    getIndirect() {
      return this.indirect;
    }
    getAttribute(e32) {
      return this.attributes[e32];
    }
    setAttribute(e32, t3) {
      return this.attributes[e32] = t3, this;
    }
    deleteAttribute(e32) {
      return delete this.attributes[e32], this;
    }
    hasAttribute(e32) {
      return this.attributes[e32] !== void 0;
    }
    addGroup(e32, t3, n3 = 0) {
      this.groups.push({ start: e32, count: t3, materialIndex: n3 });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(e32, t3) {
      this.drawRange.start = e32, this.drawRange.count = t3;
    }
    applyMatrix4(e32) {
      let t3 = this.attributes.position;
      t3 !== void 0 && (t3.applyMatrix4(e32), t3.needsUpdate = true);
      let n3 = this.attributes.normal;
      if (n3 !== void 0) {
        let t4 = new G().getNormalMatrix(e32);
        n3.applyNormalMatrix(t4), n3.needsUpdate = true;
      }
      let r3 = this.attributes.tangent;
      return r3 !== void 0 && (r3.transformDirection(e32), r3.needsUpdate = true), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
    }
    applyQuaternion(e32) {
      return sr.makeRotationFromQuaternion(e32), this.applyMatrix4(sr), this;
    }
    rotateX(e32) {
      return sr.makeRotationX(e32), this.applyMatrix4(sr), this;
    }
    rotateY(e32) {
      return sr.makeRotationY(e32), this.applyMatrix4(sr), this;
    }
    rotateZ(e32) {
      return sr.makeRotationZ(e32), this.applyMatrix4(sr), this;
    }
    translate(e32, t3, n3) {
      return sr.makeTranslation(e32, t3, n3), this.applyMatrix4(sr), this;
    }
    scale(e32, t3, n3) {
      return sr.makeScale(e32, t3, n3), this.applyMatrix4(sr), this;
    }
    lookAt(e32) {
      return cr.lookAt(e32), cr.updateMatrix(), this.applyMatrix4(cr.matrix), this;
    }
    center() {
      return this.computeBoundingBox(), this.boundingBox.getCenter(lr).negate(), this.translate(lr.x, lr.y, lr.z), this;
    }
    setFromPoints(e32) {
      let t3 = this.getAttribute(`position`);
      if (t3 === void 0) {
        let t4 = [];
        for (let n3 = 0, r3 = e32.length; n3 < r3; n3++) {
          let r4 = e32[n3];
          t4.push(r4.x, r4.y, r4.z || 0);
        }
        this.setAttribute(`position`, new ar(t4, 3));
      } else {
        let n3 = Math.min(e32.length, t3.count);
        for (let r3 = 0; r3 < n3; r3++) {
          let n4 = e32[r3];
          t3.setXYZ(r3, n4.x, n4.y, n4.z || 0);
        }
        e32.length > t3.count && console.warn(`THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`), t3.needsUpdate = true;
      }
      return this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new kt());
      let e32 = this.attributes.position, t3 = this.morphAttributes.position;
      if (e32 && e32.isGLBufferAttribute) {
        console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`, this), this.boundingBox.set(new W(-1 / 0, -1 / 0, -1 / 0), new W(1 / 0, 1 / 0, 1 / 0));
        return;
      }
      if (e32 !== void 0) {
        if (this.boundingBox.setFromBufferAttribute(e32), t3) for (let e33 = 0, n3 = t3.length; e33 < n3; e33++) {
          let n4 = t3[e33];
          ur.setFromBufferAttribute(n4), this.morphTargetsRelative ? (fr.addVectors(this.boundingBox.min, ur.min), this.boundingBox.expandByPoint(fr), fr.addVectors(this.boundingBox.max, ur.max), this.boundingBox.expandByPoint(fr)) : (this.boundingBox.expandByPoint(ur.min), this.boundingBox.expandByPoint(ur.max));
        }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`, this);
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new qt());
      let e32 = this.attributes.position, t3 = this.morphAttributes.position;
      if (e32 && e32.isGLBufferAttribute) {
        console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`, this), this.boundingSphere.set(new W(), 1 / 0);
        return;
      }
      if (e32) {
        let n3 = this.boundingSphere.center;
        if (ur.setFromBufferAttribute(e32), t3) for (let e33 = 0, n4 = t3.length; e33 < n4; e33++) {
          let n5 = t3[e33];
          dr.setFromBufferAttribute(n5), this.morphTargetsRelative ? (fr.addVectors(ur.min, dr.min), ur.expandByPoint(fr), fr.addVectors(ur.max, dr.max), ur.expandByPoint(fr)) : (ur.expandByPoint(dr.min), ur.expandByPoint(dr.max));
        }
        ur.getCenter(n3);
        let r3 = 0;
        for (let t4 = 0, i3 = e32.count; t4 < i3; t4++) fr.fromBufferAttribute(e32, t4), r3 = Math.max(r3, n3.distanceToSquared(fr));
        if (t3) for (let i3 = 0, a3 = t3.length; i3 < a3; i3++) {
          let a4 = t3[i3], o3 = this.morphTargetsRelative;
          for (let t4 = 0, i4 = a4.count; t4 < i4; t4++) fr.fromBufferAttribute(a4, t4), o3 && (lr.fromBufferAttribute(e32, t4), fr.add(lr)), r3 = Math.max(r3, n3.distanceToSquared(fr));
        }
        this.boundingSphere.radius = Math.sqrt(r3), isNaN(this.boundingSphere.radius) && console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`, this);
      }
    }
    computeTangents() {
      let e32 = this.index, t3 = this.attributes;
      if (e32 === null || t3.position === void 0 || t3.normal === void 0 || t3.uv === void 0) {
        console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);
        return;
      }
      let n3 = t3.position, r3 = t3.normal, i3 = t3.uv;
      this.hasAttribute(`tangent`) === false && this.setAttribute(`tangent`, new nr(new Float32Array(4 * n3.count), 4));
      let a3 = this.getAttribute(`tangent`), o3 = [], s3 = [];
      for (let e33 = 0; e33 < n3.count; e33++) o3[e33] = new W(), s3[e33] = new W();
      let c3 = new W(), l3 = new W(), u3 = new W(), d3 = new U(), f3 = new U(), p3 = new U(), m3 = new W(), h3 = new W();
      function g3(e33, t4, r4) {
        c3.fromBufferAttribute(n3, e33), l3.fromBufferAttribute(n3, t4), u3.fromBufferAttribute(n3, r4), d3.fromBufferAttribute(i3, e33), f3.fromBufferAttribute(i3, t4), p3.fromBufferAttribute(i3, r4), l3.sub(c3), u3.sub(c3), f3.sub(d3), p3.sub(d3);
        let a4 = 1 / (f3.x * p3.y - p3.x * f3.y);
        isFinite(a4) && (m3.copy(l3).multiplyScalar(p3.y).addScaledVector(u3, -f3.y).multiplyScalar(a4), h3.copy(u3).multiplyScalar(f3.x).addScaledVector(l3, -p3.x).multiplyScalar(a4), o3[e33].add(m3), o3[t4].add(m3), o3[r4].add(m3), s3[e33].add(h3), s3[t4].add(h3), s3[r4].add(h3));
      }
      let _3 = this.groups;
      _3.length === 0 && (_3 = [{ start: 0, count: e32.count }]);
      for (let t4 = 0, n4 = _3.length; t4 < n4; ++t4) {
        let n5 = _3[t4], r4 = n5.start, i4 = n5.count;
        for (let t5 = r4, n6 = r4 + i4; t5 < n6; t5 += 3) g3(e32.getX(t5 + 0), e32.getX(t5 + 1), e32.getX(t5 + 2));
      }
      let v3 = new W(), y3 = new W(), b3 = new W(), x3 = new W();
      function S3(e33) {
        b3.fromBufferAttribute(r3, e33), x3.copy(b3);
        let t4 = o3[e33];
        v3.copy(t4), v3.sub(b3.multiplyScalar(b3.dot(t4))).normalize(), y3.crossVectors(x3, t4);
        let n4 = y3.dot(s3[e33]) < 0 ? -1 : 1;
        a3.setXYZW(e33, v3.x, v3.y, v3.z, n4);
      }
      for (let t4 = 0, n4 = _3.length; t4 < n4; ++t4) {
        let n5 = _3[t4], r4 = n5.start, i4 = n5.count;
        for (let t5 = r4, n6 = r4 + i4; t5 < n6; t5 += 3) S3(e32.getX(t5 + 0)), S3(e32.getX(t5 + 1)), S3(e32.getX(t5 + 2));
      }
    }
    computeVertexNormals() {
      let e32 = this.index, t3 = this.getAttribute(`position`);
      if (t3 !== void 0) {
        let n3 = this.getAttribute(`normal`);
        if (n3 === void 0) n3 = new nr(new Float32Array(t3.count * 3), 3), this.setAttribute(`normal`, n3);
        else for (let e33 = 0, t4 = n3.count; e33 < t4; e33++) n3.setXYZ(e33, 0, 0, 0);
        let r3 = new W(), i3 = new W(), a3 = new W(), o3 = new W(), s3 = new W(), c3 = new W(), l3 = new W(), u3 = new W();
        if (e32) for (let d3 = 0, f3 = e32.count; d3 < f3; d3 += 3) {
          let f4 = e32.getX(d3 + 0), p3 = e32.getX(d3 + 1), m3 = e32.getX(d3 + 2);
          r3.fromBufferAttribute(t3, f4), i3.fromBufferAttribute(t3, p3), a3.fromBufferAttribute(t3, m3), l3.subVectors(a3, i3), u3.subVectors(r3, i3), l3.cross(u3), o3.fromBufferAttribute(n3, f4), s3.fromBufferAttribute(n3, p3), c3.fromBufferAttribute(n3, m3), o3.add(l3), s3.add(l3), c3.add(l3), n3.setXYZ(f4, o3.x, o3.y, o3.z), n3.setXYZ(p3, s3.x, s3.y, s3.z), n3.setXYZ(m3, c3.x, c3.y, c3.z);
        }
        else for (let e33 = 0, o4 = t3.count; e33 < o4; e33 += 3) r3.fromBufferAttribute(t3, e33 + 0), i3.fromBufferAttribute(t3, e33 + 1), a3.fromBufferAttribute(t3, e33 + 2), l3.subVectors(a3, i3), u3.subVectors(r3, i3), l3.cross(u3), n3.setXYZ(e33 + 0, l3.x, l3.y, l3.z), n3.setXYZ(e33 + 1, l3.x, l3.y, l3.z), n3.setXYZ(e33 + 2, l3.x, l3.y, l3.z);
        this.normalizeNormals(), n3.needsUpdate = true;
      }
    }
    normalizeNormals() {
      let e32 = this.attributes.normal;
      for (let t3 = 0, n3 = e32.count; t3 < n3; t3++) fr.fromBufferAttribute(e32, t3), fr.normalize(), e32.setXYZ(t3, fr.x, fr.y, fr.z);
    }
    toNonIndexed() {
      function t3(e32, t4) {
        let n4 = e32.array, r4 = e32.itemSize, i4 = e32.normalized, a4 = new n4.constructor(t4.length * r4), o4 = 0, s3 = 0;
        for (let i5 = 0, c3 = t4.length; i5 < c3; i5++) {
          o4 = e32.isInterleavedBufferAttribute ? t4[i5] * e32.data.stride + e32.offset : t4[i5] * r4;
          for (let e33 = 0; e33 < r4; e33++) a4[s3++] = n4[o4++];
        }
        return new nr(a4, r4, i4);
      }
      if (this.index === null) return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`), this;
      let n3 = new e11(), r3 = this.index.array, i3 = this.attributes;
      for (let e32 in i3) {
        let a4 = i3[e32], o4 = t3(a4, r3);
        n3.setAttribute(e32, o4);
      }
      let a3 = this.morphAttributes;
      for (let e32 in a3) {
        let i4 = [], o4 = a3[e32];
        for (let e33 = 0, n4 = o4.length; e33 < n4; e33++) {
          let n5 = o4[e33], a4 = t3(n5, r3);
          i4.push(a4);
        }
        n3.morphAttributes[e32] = i4;
      }
      n3.morphTargetsRelative = this.morphTargetsRelative;
      let o3 = this.groups;
      for (let e32 = 0, t4 = o3.length; e32 < t4; e32++) {
        let t5 = o3[e32];
        n3.addGroup(t5.start, t5.count, t5.materialIndex);
      }
      return n3;
    }
    toJSON() {
      let e32 = { metadata: { version: 4.7, type: `BufferGeometry`, generator: `BufferGeometry.toJSON` } };
      if (e32.uuid = this.uuid, e32.type = this.type, this.name !== `` && (e32.name = this.name), Object.keys(this.userData).length > 0 && (e32.userData = this.userData), this.parameters !== void 0) {
        let t4 = this.parameters;
        for (let n4 in t4) t4[n4] !== void 0 && (e32[n4] = t4[n4]);
        return e32;
      }
      e32.data = { attributes: {} };
      let t3 = this.index;
      t3 !== null && (e32.data.index = { type: t3.array.constructor.name, array: Array.prototype.slice.call(t3.array) });
      let n3 = this.attributes;
      for (let t4 in n3) {
        let r4 = n3[t4];
        e32.data.attributes[t4] = r4.toJSON(e32.data);
      }
      let r3 = {}, i3 = false;
      for (let t4 in this.morphAttributes) {
        let n4 = this.morphAttributes[t4], a4 = [];
        for (let t5 = 0, r4 = n4.length; t5 < r4; t5++) {
          let r5 = n4[t5];
          a4.push(r5.toJSON(e32.data));
        }
        a4.length > 0 && (r3[t4] = a4, i3 = true);
      }
      i3 && (e32.data.morphAttributes = r3, e32.data.morphTargetsRelative = this.morphTargetsRelative);
      let a3 = this.groups;
      a3.length > 0 && (e32.data.groups = JSON.parse(JSON.stringify(a3)));
      let o3 = this.boundingSphere;
      return o3 !== null && (e32.data.boundingSphere = o3.toJSON()), e32;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e32) {
      this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
      let t3 = {};
      this.name = e32.name;
      let n3 = e32.index;
      n3 !== null && this.setIndex(n3.clone());
      let r3 = e32.attributes;
      for (let e33 in r3) {
        let n4 = r3[e33];
        this.setAttribute(e33, n4.clone(t3));
      }
      let i3 = e32.morphAttributes;
      for (let e33 in i3) {
        let n4 = [], r4 = i3[e33];
        for (let e34 = 0, i4 = r4.length; e34 < i4; e34++) n4.push(r4[e34].clone(t3));
        this.morphAttributes[e33] = n4;
      }
      this.morphTargetsRelative = e32.morphTargetsRelative;
      let a3 = e32.groups;
      for (let e33 = 0, t4 = a3.length; e33 < t4; e33++) {
        let t5 = a3[e33];
        this.addGroup(t5.start, t5.count, t5.materialIndex);
      }
      let o3 = e32.boundingBox;
      o3 !== null && (this.boundingBox = o3.clone());
      let s3 = e32.boundingSphere;
      return s3 !== null && (this.boundingSphere = s3.clone()), this.drawRange.start = e32.drawRange.start, this.drawRange.count = e32.drawRange.count, this.userData = e32.userData, this;
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
    constructor(e32 = new pr(), t3 = new Qn()) {
      super(), this.isMesh = true, this.type = `Mesh`, this.geometry = e32, this.material = t3, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
    }
    copy(e32, t3) {
      return super.copy(e32, t3), e32.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e32.morphTargetInfluences.slice()), e32.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e32.morphTargetDictionary)), this.material = Array.isArray(e32.material) ? e32.material.slice() : e32.material, this.geometry = e32.geometry, this;
    }
    updateMorphTargets() {
      let e32 = this.geometry.morphAttributes, t3 = Object.keys(e32);
      if (t3.length > 0) {
        let n3 = e32[t3[0]];
        if (n3 !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let e33 = 0, t4 = n3.length; e33 < t4; e33++) {
            let t5 = n3[e33].name || String(e33);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[t5] = e33;
          }
        }
      }
    }
    getVertexPosition(e32, t3) {
      let n3 = this.geometry, r3 = n3.attributes.position, i3 = n3.morphAttributes.position, a3 = n3.morphTargetsRelative;
      t3.fromBufferAttribute(r3, e32);
      let o3 = this.morphTargetInfluences;
      if (i3 && o3) {
        Sr.set(0, 0, 0);
        for (let n4 = 0, r4 = i3.length; n4 < r4; n4++) {
          let r5 = o3[n4], s3 = i3[n4];
          r5 !== 0 && (xr.fromBufferAttribute(s3, e32), a3 ? Sr.addScaledVector(xr, r5) : Sr.addScaledVector(xr.sub(t3), r5));
        }
        t3.add(Sr);
      }
      return t3;
    }
    raycast(e32, t3) {
      let n3 = this.geometry, r3 = this.material, i3 = this.matrixWorld;
      r3 !== void 0 && (n3.boundingSphere === null && n3.computeBoundingSphere(), gr.copy(n3.boundingSphere), gr.applyMatrix4(i3), hr.copy(e32.ray).recast(e32.near), !(gr.containsPoint(hr.origin) === false && (hr.intersectSphere(gr, _r) === null || hr.origin.distanceToSquared(_r) > (e32.far - e32.near) ** 2)) && (mr.copy(i3).invert(), hr.copy(e32.ray).applyMatrix4(mr), !(n3.boundingBox !== null && hr.intersectsBox(n3.boundingBox) === false) && this._computeIntersections(e32, t3, hr)));
    }
    _computeIntersections(e32, t3, n3) {
      let r3, i3 = this.geometry, a3 = this.material, o3 = i3.index, s3 = i3.attributes.position, c3 = i3.attributes.uv, l3 = i3.attributes.uv1, u3 = i3.attributes.normal, d3 = i3.groups, f3 = i3.drawRange;
      if (o3 !== null) if (Array.isArray(a3)) for (let i4 = 0, s4 = d3.length; i4 < s4; i4++) {
        let s5 = d3[i4], p3 = a3[s5.materialIndex], m3 = Math.max(s5.start, f3.start), h3 = Math.min(o3.count, Math.min(s5.start + s5.count, f3.start + f3.count));
        for (let i5 = m3, a4 = h3; i5 < a4; i5 += 3) {
          let a5 = o3.getX(i5), d4 = o3.getX(i5 + 1), f4 = o3.getX(i5 + 2);
          r3 = Dr(this, p3, e32, n3, c3, l3, u3, a5, d4, f4), r3 && (r3.faceIndex = Math.floor(i5 / 3), r3.face.materialIndex = s5.materialIndex, t3.push(r3));
        }
      }
      else {
        let i4 = Math.max(0, f3.start), s4 = Math.min(o3.count, f3.start + f3.count);
        for (let d4 = i4, f4 = s4; d4 < f4; d4 += 3) {
          let i5 = o3.getX(d4), s5 = o3.getX(d4 + 1), f5 = o3.getX(d4 + 2);
          r3 = Dr(this, a3, e32, n3, c3, l3, u3, i5, s5, f5), r3 && (r3.faceIndex = Math.floor(d4 / 3), t3.push(r3));
        }
      }
      else if (s3 !== void 0) if (Array.isArray(a3)) for (let i4 = 0, o4 = d3.length; i4 < o4; i4++) {
        let o5 = d3[i4], p3 = a3[o5.materialIndex], m3 = Math.max(o5.start, f3.start), h3 = Math.min(s3.count, Math.min(o5.start + o5.count, f3.start + f3.count));
        for (let i5 = m3, a4 = h3; i5 < a4; i5 += 3) {
          let a5 = i5, s4 = i5 + 1, d4 = i5 + 2;
          r3 = Dr(this, p3, e32, n3, c3, l3, u3, a5, s4, d4), r3 && (r3.faceIndex = Math.floor(i5 / 3), r3.face.materialIndex = o5.materialIndex, t3.push(r3));
        }
      }
      else {
        let i4 = Math.max(0, f3.start), o4 = Math.min(s3.count, f3.start + f3.count);
        for (let s4 = i4, d4 = o4; s4 < d4; s4 += 3) {
          let i5 = s4, o5 = s4 + 1, d5 = s4 + 2;
          r3 = Dr(this, a3, e32, n3, c3, l3, u3, i5, o5, d5), r3 && (r3.faceIndex = Math.floor(s4 / 3), t3.push(r3));
        }
      }
    }
  };
  function Er(e32, t3, n3, r3, i3, a3, o3, s3) {
    let c3;
    if (c3 = t3.side === 1 ? r3.intersectTriangle(o3, a3, i3, true, s3) : r3.intersectTriangle(i3, a3, o3, t3.side === 0, s3), c3 === null) return null;
    wr.copy(s3), wr.applyMatrix4(e32.matrixWorld);
    let l3 = n3.ray.origin.distanceTo(wr);
    return l3 < n3.near || l3 > n3.far ? null : { distance: l3, point: wr.clone(), object: e32 };
  }
  function Dr(e32, t3, n3, r3, i3, a3, o3, s3, c3, l3) {
    e32.getVertexPosition(s3, vr), e32.getVertexPosition(c3, yr), e32.getVertexPosition(l3, br);
    let u3 = Er(e32, t3, n3, r3, vr, yr, br, Cr);
    if (u3) {
      let e33 = new W();
      Wn.getBarycoord(Cr, vr, yr, br, e33), i3 && (u3.uv = Wn.getInterpolatedAttribute(i3, s3, c3, l3, e33, new U())), a3 && (u3.uv1 = Wn.getInterpolatedAttribute(a3, s3, c3, l3, e33, new U())), o3 && (u3.normal = Wn.getInterpolatedAttribute(o3, s3, c3, l3, e33, new W()), u3.normal.dot(r3.direction) > 0 && u3.normal.multiplyScalar(-1));
      let t4 = { a: s3, b: c3, c: l3, normal: new W(), materialIndex: 0 };
      Wn.getNormal(vr, yr, br, t4.normal), u3.face = t4, u3.barycoord = e33;
    }
    return u3;
  }
  var Or = class e12 extends pr {
    constructor(e32 = 1, t3 = 1, n3 = 1, r3 = 1, i3 = 1, a3 = 1) {
      super(), this.type = `BoxGeometry`, this.parameters = { width: e32, height: t3, depth: n3, widthSegments: r3, heightSegments: i3, depthSegments: a3 };
      let o3 = this;
      r3 = Math.floor(r3), i3 = Math.floor(i3), a3 = Math.floor(a3);
      let s3 = [], c3 = [], l3 = [], u3 = [], d3 = 0, f3 = 0;
      p3(`z`, `y`, `x`, -1, -1, n3, t3, e32, a3, i3, 0), p3(`z`, `y`, `x`, 1, -1, n3, t3, -e32, a3, i3, 1), p3(`x`, `z`, `y`, 1, 1, e32, n3, t3, r3, a3, 2), p3(`x`, `z`, `y`, 1, -1, e32, n3, -t3, r3, a3, 3), p3(`x`, `y`, `z`, 1, -1, e32, t3, n3, r3, i3, 4), p3(`x`, `y`, `z`, -1, -1, e32, t3, -n3, r3, i3, 5), this.setIndex(s3), this.setAttribute(`position`, new ar(c3, 3)), this.setAttribute(`normal`, new ar(l3, 3)), this.setAttribute(`uv`, new ar(u3, 2));
      function p3(e33, t4, n4, r4, i4, a4, p4, m3, h3, g3, _3) {
        let v3 = a4 / h3, y3 = p4 / g3, b3 = a4 / 2, x3 = p4 / 2, S3 = m3 / 2, C3 = h3 + 1, w3 = g3 + 1, T3 = 0, E3 = 0, D3 = new W();
        for (let a5 = 0; a5 < w3; a5++) {
          let o4 = a5 * y3 - x3;
          for (let s4 = 0; s4 < C3; s4++) D3[e33] = (s4 * v3 - b3) * r4, D3[t4] = o4 * i4, D3[n4] = S3, c3.push(D3.x, D3.y, D3.z), D3[e33] = 0, D3[t4] = 0, D3[n4] = m3 > 0 ? 1 : -1, l3.push(D3.x, D3.y, D3.z), u3.push(s4 / h3), u3.push(1 - a5 / g3), T3 += 1;
        }
        for (let e34 = 0; e34 < g3; e34++) for (let t5 = 0; t5 < h3; t5++) {
          let n5 = d3 + t5 + C3 * e34, r5 = d3 + t5 + C3 * (e34 + 1), i5 = d3 + (t5 + 1) + C3 * (e34 + 1), a5 = d3 + (t5 + 1) + C3 * e34;
          s3.push(n5, r5, a5), s3.push(r5, i5, a5), E3 += 6;
        }
        o3.addGroup(f3, E3, _3), f3 += E3, d3 += T3;
      }
    }
    copy(e32) {
      return super.copy(e32), this.parameters = Object.assign({}, e32.parameters), this;
    }
    static fromJSON(t3) {
      return new e12(t3.width, t3.height, t3.depth, t3.widthSegments, t3.heightSegments, t3.depthSegments);
    }
  };
  function kr(e32) {
    let t3 = {};
    for (let n3 in e32) {
      t3[n3] = {};
      for (let r3 in e32[n3]) {
        let i3 = e32[n3][r3];
        i3 && (i3.isColor || i3.isMatrix3 || i3.isMatrix4 || i3.isVector2 || i3.isVector3 || i3.isVector4 || i3.isTexture || i3.isQuaternion) ? i3.isRenderTargetTexture ? (console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`), t3[n3][r3] = null) : t3[n3][r3] = i3.clone() : Array.isArray(i3) ? t3[n3][r3] = i3.slice() : t3[n3][r3] = i3;
      }
    }
    return t3;
  }
  function Ar(e32) {
    let t3 = {};
    for (let n3 = 0; n3 < e32.length; n3++) {
      let r3 = kr(e32[n3]);
      for (let e33 in r3) t3[e33] = r3[e33];
    }
    return t3;
  }
  function jr(e32) {
    let t3 = [];
    for (let n3 = 0; n3 < e32.length; n3++) t3.push(e32[n3].clone());
    return t3;
  }
  function Mr(e32) {
    let t3 = e32.getRenderTarget();
    return t3 === null ? e32.outputColorSpace : t3.isXRRenderTarget === true ? t3.texture.colorSpace : K.workingColorSpace;
  }
  var Nr = { clone: kr, merge: Ar };
  var Pr = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
  var Fr = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
  var Ir = class extends Zn {
    constructor(e32) {
      super(), this.isShaderMaterial = true, this.type = `ShaderMaterial`, this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Pr, this.fragmentShader = Fr, this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = { clipCullDistance: false, multiDraw: false }, this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv1: [0, 0] }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, e32 !== void 0 && this.setValues(e32);
    }
    copy(e32) {
      return super.copy(e32), this.fragmentShader = e32.fragmentShader, this.vertexShader = e32.vertexShader, this.uniforms = kr(e32.uniforms), this.uniformsGroups = jr(e32.uniformsGroups), this.defines = Object.assign({}, e32.defines), this.wireframe = e32.wireframe, this.wireframeLinewidth = e32.wireframeLinewidth, this.fog = e32.fog, this.lights = e32.lights, this.clipping = e32.clipping, this.extensions = Object.assign({}, e32.extensions), this.glslVersion = e32.glslVersion, this;
    }
    toJSON(e32) {
      let t3 = super.toJSON(e32);
      t3.glslVersion = this.glslVersion, t3.uniforms = {};
      for (let n4 in this.uniforms) {
        let r3 = this.uniforms[n4].value;
        r3 && r3.isTexture ? t3.uniforms[n4] = { type: `t`, value: r3.toJSON(e32).uuid } : r3 && r3.isColor ? t3.uniforms[n4] = { type: `c`, value: r3.getHex() } : r3 && r3.isVector2 ? t3.uniforms[n4] = { type: `v2`, value: r3.toArray() } : r3 && r3.isVector3 ? t3.uniforms[n4] = { type: `v3`, value: r3.toArray() } : r3 && r3.isVector4 ? t3.uniforms[n4] = { type: `v4`, value: r3.toArray() } : r3 && r3.isMatrix3 ? t3.uniforms[n4] = { type: `m3`, value: r3.toArray() } : r3 && r3.isMatrix4 ? t3.uniforms[n4] = { type: `m4`, value: r3.toArray() } : t3.uniforms[n4] = { value: r3 };
      }
      Object.keys(this.defines).length > 0 && (t3.defines = this.defines), t3.vertexShader = this.vertexShader, t3.fragmentShader = this.fragmentShader, t3.lights = this.lights, t3.clipping = this.clipping;
      let n3 = {};
      for (let e33 in this.extensions) this.extensions[e33] === true && (n3[e33] = true);
      return Object.keys(n3).length > 0 && (t3.extensions = n3), t3;
    }
  };
  var Lr = class extends An {
    constructor() {
      super(), this.isCamera = true, this.type = `Camera`, this.matrixWorldInverse = new nn(), this.projectionMatrix = new nn(), this.projectionMatrixInverse = new nn(), this.coordinateSystem = Ge, this._reversedDepth = false;
    }
    get reversedDepth() {
      return this._reversedDepth;
    }
    copy(e32, t3) {
      return super.copy(e32, t3), this.matrixWorldInverse.copy(e32.matrixWorldInverse), this.projectionMatrix.copy(e32.projectionMatrix), this.projectionMatrixInverse.copy(e32.projectionMatrixInverse), this.coordinateSystem = e32.coordinateSystem, this;
    }
    getWorldDirection(e32) {
      return super.getWorldDirection(e32).negate();
    }
    updateMatrixWorld(e32) {
      super.updateMatrixWorld(e32), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateWorldMatrix(e32, t3) {
      super.updateWorldMatrix(e32, t3), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var Rr = new W();
  var zr = new U();
  var Br = new U();
  var Vr = class extends Lr {
    constructor(e32 = 50, t3 = 1, n3 = 0.1, r3 = 2e3) {
      super(), this.isPerspectiveCamera = true, this.type = `PerspectiveCamera`, this.fov = e32, this.zoom = 1, this.near = n3, this.far = r3, this.focus = 10, this.aspect = t3, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
    }
    copy(e32, t3) {
      return super.copy(e32, t3), this.fov = e32.fov, this.zoom = e32.zoom, this.near = e32.near, this.far = e32.far, this.focus = e32.focus, this.aspect = e32.aspect, this.view = e32.view === null ? null : Object.assign({}, e32.view), this.filmGauge = e32.filmGauge, this.filmOffset = e32.filmOffset, this;
    }
    setFocalLength(e32) {
      let t3 = 0.5 * this.getFilmHeight() / e32;
      this.fov = Ye * 2 * Math.atan(t3), this.updateProjectionMatrix();
    }
    getFocalLength() {
      let e32 = Math.tan(Je * 0.5 * this.fov);
      return 0.5 * this.getFilmHeight() / e32;
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
    getViewBounds(e32, t3, n3) {
      Rr.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t3.set(Rr.x, Rr.y).multiplyScalar(-e32 / Rr.z), Rr.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n3.set(Rr.x, Rr.y).multiplyScalar(-e32 / Rr.z);
    }
    getViewSize(e32, t3) {
      return this.getViewBounds(e32, zr, Br), t3.subVectors(Br, zr);
    }
    setViewOffset(e32, t3, n3, r3, i3, a3) {
      this.aspect = e32 / t3, this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e32, this.view.fullHeight = t3, this.view.offsetX = n3, this.view.offsetY = r3, this.view.width = i3, this.view.height = a3, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      let e32 = this.near, t3 = e32 * Math.tan(Je * 0.5 * this.fov) / this.zoom, n3 = 2 * t3, r3 = this.aspect * n3, i3 = -0.5 * r3, a3 = this.view;
      if (this.view !== null && this.view.enabled) {
        let e33 = a3.fullWidth, o4 = a3.fullHeight;
        i3 += a3.offsetX * r3 / e33, t3 -= a3.offsetY * n3 / o4, r3 *= a3.width / e33, n3 *= a3.height / o4;
      }
      let o3 = this.filmOffset;
      o3 !== 0 && (i3 += e32 * o3 / this.getFilmWidth()), this.projectionMatrix.makePerspective(i3, i3 + r3, t3, t3 - n3, e32, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e32) {
      let t3 = super.toJSON(e32);
      return t3.object.fov = this.fov, t3.object.zoom = this.zoom, t3.object.near = this.near, t3.object.far = this.far, t3.object.focus = this.focus, t3.object.aspect = this.aspect, this.view !== null && (t3.object.view = Object.assign({}, this.view)), t3.object.filmGauge = this.filmGauge, t3.object.filmOffset = this.filmOffset, t3;
    }
  };
  var Hr = -90;
  var Ur = 1;
  var Wr = class extends An {
    constructor(e32, t3, n3) {
      super(), this.type = `CubeCamera`, this.renderTarget = n3, this.coordinateSystem = null, this.activeMipmapLevel = 0;
      let r3 = new Vr(Hr, Ur, e32, t3);
      r3.layers = this.layers, this.add(r3);
      let i3 = new Vr(Hr, Ur, e32, t3);
      i3.layers = this.layers, this.add(i3);
      let a3 = new Vr(Hr, Ur, e32, t3);
      a3.layers = this.layers, this.add(a3);
      let o3 = new Vr(Hr, Ur, e32, t3);
      o3.layers = this.layers, this.add(o3);
      let s3 = new Vr(Hr, Ur, e32, t3);
      s3.layers = this.layers, this.add(s3);
      let c3 = new Vr(Hr, Ur, e32, t3);
      c3.layers = this.layers, this.add(c3);
    }
    updateCoordinateSystem() {
      let e32 = this.coordinateSystem, t3 = this.children.concat(), [n3, r3, i3, a3, o3, s3] = t3;
      for (let e33 of t3) this.remove(e33);
      if (e32 === 2e3) n3.up.set(0, 1, 0), n3.lookAt(1, 0, 0), r3.up.set(0, 1, 0), r3.lookAt(-1, 0, 0), i3.up.set(0, 0, -1), i3.lookAt(0, 1, 0), a3.up.set(0, 0, 1), a3.lookAt(0, -1, 0), o3.up.set(0, 1, 0), o3.lookAt(0, 0, 1), s3.up.set(0, 1, 0), s3.lookAt(0, 0, -1);
      else if (e32 === 2001) n3.up.set(0, -1, 0), n3.lookAt(-1, 0, 0), r3.up.set(0, -1, 0), r3.lookAt(1, 0, 0), i3.up.set(0, 0, 1), i3.lookAt(0, 1, 0), a3.up.set(0, 0, -1), a3.lookAt(0, -1, 0), o3.up.set(0, -1, 0), o3.lookAt(0, 0, 1), s3.up.set(0, -1, 0), s3.lookAt(0, 0, -1);
      else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: ` + e32);
      for (let e33 of t3) this.add(e33), e33.updateMatrixWorld();
    }
    update(e32, t3) {
      this.parent === null && this.updateMatrixWorld();
      let { renderTarget: n3, activeMipmapLevel: r3 } = this;
      this.coordinateSystem !== e32.coordinateSystem && (this.coordinateSystem = e32.coordinateSystem, this.updateCoordinateSystem());
      let [i3, a3, o3, s3, c3, l3] = this.children, u3 = e32.getRenderTarget(), d3 = e32.getActiveCubeFace(), f3 = e32.getActiveMipmapLevel(), p3 = e32.xr.enabled;
      e32.xr.enabled = false;
      let m3 = n3.texture.generateMipmaps;
      n3.texture.generateMipmaps = false, e32.setRenderTarget(n3, 0, r3), e32.render(t3, i3), e32.setRenderTarget(n3, 1, r3), e32.render(t3, a3), e32.setRenderTarget(n3, 2, r3), e32.render(t3, o3), e32.setRenderTarget(n3, 3, r3), e32.render(t3, s3), e32.setRenderTarget(n3, 4, r3), e32.render(t3, c3), n3.texture.generateMipmaps = m3, e32.setRenderTarget(n3, 5, r3), e32.render(t3, l3), e32.setRenderTarget(u3, d3, f3), e32.xr.enabled = p3, n3.texture.needsPMREMUpdate = true;
    }
  };
  var Gr = class extends Ct {
    constructor(e32 = [], t3 = 301, n3, r3, i3, a3, o3, s3, c3, l3) {
      super(e32, t3, n3, r3, i3, a3, o3, s3, c3, l3), this.isCubeTexture = true, this.flipY = false;
    }
    get images() {
      return this.image;
    }
    set images(e32) {
      this.image = e32;
    }
  };
  var Kr = class extends Et {
    constructor(e32 = 1, t3 = {}) {
      super(e32, e32, t3), this.isWebGLCubeRenderTarget = true;
      let n3 = { width: e32, height: e32, depth: 1 }, r3 = [n3, n3, n3, n3, n3, n3];
      this.texture = new Gr(r3), this._setTextureOptions(t3), this.texture.isRenderTargetTexture = true;
    }
    fromEquirectangularTexture(e32, t3) {
      this.texture.type = t3.type, this.texture.colorSpace = t3.colorSpace, this.texture.generateMipmaps = t3.generateMipmaps, this.texture.minFilter = t3.minFilter, this.texture.magFilter = t3.magFilter;
      let n3 = { uniforms: { tEquirect: { value: null } }, vertexShader: `

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
			` }, r3 = new Or(5, 5, 5), i3 = new Ir({ name: `CubemapFromEquirect`, uniforms: kr(n3.uniforms), vertexShader: n3.vertexShader, fragmentShader: n3.fragmentShader, side: 1, blending: 0 });
      i3.uniforms.tEquirect.value = t3;
      let a3 = new Tr(r3, i3), o3 = t3.minFilter;
      return t3.minFilter === 1008 && (t3.minFilter = h), new Wr(1, 10, this).update(e32, a3), t3.minFilter = o3, a3.geometry.dispose(), a3.material.dispose(), this;
    }
    clear(e32, t3 = true, n3 = true, r3 = true) {
      let i3 = e32.getRenderTarget();
      for (let i4 = 0; i4 < 6; i4++) e32.setRenderTarget(this, i4), e32.clear(t3, n3, r3);
      e32.setRenderTarget(i3);
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
    dispatchEvent(e32) {
      return this._targetRay !== null && this._targetRay.dispatchEvent(e32), this._grip !== null && this._grip.dispatchEvent(e32), this._hand !== null && this._hand.dispatchEvent(e32), this;
    }
    connect(e32) {
      if (e32 && e32.hand) {
        let t3 = this._hand;
        if (t3) for (let n3 of e32.hand.values()) this._getHandJoint(t3, n3);
      }
      return this.dispatchEvent({ type: `connected`, data: e32 }), this;
    }
    disconnect(e32) {
      return this.dispatchEvent({ type: `disconnected`, data: e32 }), this._targetRay !== null && (this._targetRay.visible = false), this._grip !== null && (this._grip.visible = false), this._hand !== null && (this._hand.visible = false), this;
    }
    update(e32, t3, n3) {
      let r3 = null, i3 = null, a3 = null, o3 = this._targetRay, s3 = this._grip, c3 = this._hand;
      if (e32 && t3.session.visibilityState !== `visible-blurred`) {
        if (c3 && e32.hand) {
          a3 = true;
          for (let r5 of e32.hand.values()) {
            let e33 = t3.getJointPose(r5, n3), i5 = this._getHandJoint(c3, r5);
            e33 !== null && (i5.matrix.fromArray(e33.transform.matrix), i5.matrix.decompose(i5.position, i5.rotation, i5.scale), i5.matrixWorldNeedsUpdate = true, i5.jointRadius = e33.radius), i5.visible = e33 !== null;
          }
          let r4 = c3.joints[`index-finger-tip`], i4 = c3.joints[`thumb-tip`], o4 = r4.position.distanceTo(i4.position);
          c3.inputState.pinching && o4 > 0.025 ? (c3.inputState.pinching = false, this.dispatchEvent({ type: `pinchend`, handedness: e32.handedness, target: this })) : !c3.inputState.pinching && o4 <= 0.015 && (c3.inputState.pinching = true, this.dispatchEvent({ type: `pinchstart`, handedness: e32.handedness, target: this }));
        } else s3 !== null && e32.gripSpace && (i3 = t3.getPose(e32.gripSpace, n3), i3 !== null && (s3.matrix.fromArray(i3.transform.matrix), s3.matrix.decompose(s3.position, s3.rotation, s3.scale), s3.matrixWorldNeedsUpdate = true, i3.linearVelocity ? (s3.hasLinearVelocity = true, s3.linearVelocity.copy(i3.linearVelocity)) : s3.hasLinearVelocity = false, i3.angularVelocity ? (s3.hasAngularVelocity = true, s3.angularVelocity.copy(i3.angularVelocity)) : s3.hasAngularVelocity = false));
        o3 !== null && (r3 = t3.getPose(e32.targetRaySpace, n3), r3 === null && i3 !== null && (r3 = i3), r3 !== null && (o3.matrix.fromArray(r3.transform.matrix), o3.matrix.decompose(o3.position, o3.rotation, o3.scale), o3.matrixWorldNeedsUpdate = true, r3.linearVelocity ? (o3.hasLinearVelocity = true, o3.linearVelocity.copy(r3.linearVelocity)) : o3.hasLinearVelocity = false, r3.angularVelocity ? (o3.hasAngularVelocity = true, o3.angularVelocity.copy(r3.angularVelocity)) : o3.hasAngularVelocity = false, this.dispatchEvent(Jr)));
      }
      return o3 !== null && (o3.visible = r3 !== null), s3 !== null && (s3.visible = i3 !== null), c3 !== null && (c3.visible = a3 !== null), this;
    }
    _getHandJoint(e32, t3) {
      if (e32.joints[t3.jointName] === void 0) {
        let n3 = new qr();
        n3.matrixAutoUpdate = false, n3.visible = false, e32.joints[t3.jointName] = n3, e32.add(n3);
      }
      return e32.joints[t3.jointName];
    }
  };
  var Xr = class extends An {
    constructor() {
      super(), this.isScene = true, this.type = `Scene`, this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new pn(), this.environmentIntensity = 1, this.environmentRotation = new pn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < `u` && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`, { detail: this }));
    }
    copy(e32, t3) {
      return super.copy(e32, t3), e32.background !== null && (this.background = e32.background.clone()), e32.environment !== null && (this.environment = e32.environment.clone()), e32.fog !== null && (this.fog = e32.fog.clone()), this.backgroundBlurriness = e32.backgroundBlurriness, this.backgroundIntensity = e32.backgroundIntensity, this.backgroundRotation.copy(e32.backgroundRotation), this.environmentIntensity = e32.environmentIntensity, this.environmentRotation.copy(e32.environmentRotation), e32.overrideMaterial !== null && (this.overrideMaterial = e32.overrideMaterial.clone()), this.matrixAutoUpdate = e32.matrixAutoUpdate, this;
    }
    toJSON(e32) {
      let t3 = super.toJSON(e32);
      return this.fog !== null && (t3.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t3.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t3.object.backgroundIntensity = this.backgroundIntensity), t3.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t3.object.environmentIntensity = this.environmentIntensity), t3.object.environmentRotation = this.environmentRotation.toArray(), t3;
    }
  };
  var Zr = class extends Ct {
    constructor(e32 = null, t3 = 1, n3 = 1, r3, i3, a3, o3, s3, c3 = f, l3 = f, u3, d3) {
      super(null, a3, o3, s3, c3, l3, r3, i3, u3, d3), this.isDataTexture = true, this.image = { data: e32, width: t3, height: n3 }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var Qr = new W();
  var $r = new W();
  var ei = new G();
  var ti = class {
    constructor(e32 = new W(1, 0, 0), t3 = 0) {
      this.isPlane = true, this.normal = e32, this.constant = t3;
    }
    set(e32, t3) {
      return this.normal.copy(e32), this.constant = t3, this;
    }
    setComponents(e32, t3, n3, r3) {
      return this.normal.set(e32, t3, n3), this.constant = r3, this;
    }
    setFromNormalAndCoplanarPoint(e32, t3) {
      return this.normal.copy(e32), this.constant = -t3.dot(this.normal), this;
    }
    setFromCoplanarPoints(e32, t3, n3) {
      let r3 = Qr.subVectors(n3, t3).cross($r.subVectors(e32, t3)).normalize();
      return this.setFromNormalAndCoplanarPoint(r3, e32), this;
    }
    copy(e32) {
      return this.normal.copy(e32.normal), this.constant = e32.constant, this;
    }
    normalize() {
      let e32 = 1 / this.normal.length();
      return this.normal.multiplyScalar(e32), this.constant *= e32, this;
    }
    negate() {
      return this.constant *= -1, this.normal.negate(), this;
    }
    distanceToPoint(e32) {
      return this.normal.dot(e32) + this.constant;
    }
    distanceToSphere(e32) {
      return this.distanceToPoint(e32.center) - e32.radius;
    }
    projectPoint(e32, t3) {
      return t3.copy(e32).addScaledVector(this.normal, -this.distanceToPoint(e32));
    }
    intersectLine(e32, t3) {
      let n3 = e32.delta(Qr), r3 = this.normal.dot(n3);
      if (r3 === 0) return this.distanceToPoint(e32.start) === 0 ? t3.copy(e32.start) : null;
      let i3 = -(e32.start.dot(this.normal) + this.constant) / r3;
      return i3 < 0 || i3 > 1 ? null : t3.copy(e32.start).addScaledVector(n3, i3);
    }
    intersectsLine(e32) {
      let t3 = this.distanceToPoint(e32.start), n3 = this.distanceToPoint(e32.end);
      return t3 < 0 && n3 > 0 || n3 < 0 && t3 > 0;
    }
    intersectsBox(e32) {
      return e32.intersectsPlane(this);
    }
    intersectsSphere(e32) {
      return e32.intersectsPlane(this);
    }
    coplanarPoint(e32) {
      return e32.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(e32, t3) {
      let n3 = t3 || ei.getNormalMatrix(e32), r3 = this.coplanarPoint(Qr).applyMatrix4(e32), i3 = this.normal.applyMatrix3(n3).normalize();
      return this.constant = -r3.dot(i3), this;
    }
    translate(e32) {
      return this.constant -= e32.dot(this.normal), this;
    }
    equals(e32) {
      return e32.normal.equals(this.normal) && e32.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var ni = new qt();
  var ri = new U(0.5, 0.5);
  var ii = new W();
  var ai = class {
    constructor(e32 = new ti(), t3 = new ti(), n3 = new ti(), r3 = new ti(), i3 = new ti(), a3 = new ti()) {
      this.planes = [e32, t3, n3, r3, i3, a3];
    }
    set(e32, t3, n3, r3, i3, a3) {
      let o3 = this.planes;
      return o3[0].copy(e32), o3[1].copy(t3), o3[2].copy(n3), o3[3].copy(r3), o3[4].copy(i3), o3[5].copy(a3), this;
    }
    copy(e32) {
      let t3 = this.planes;
      for (let n3 = 0; n3 < 6; n3++) t3[n3].copy(e32.planes[n3]);
      return this;
    }
    setFromProjectionMatrix(e32, t3 = Ge, n3 = false) {
      let r3 = this.planes, i3 = e32.elements, a3 = i3[0], o3 = i3[1], s3 = i3[2], c3 = i3[3], l3 = i3[4], u3 = i3[5], d3 = i3[6], f3 = i3[7], p3 = i3[8], m3 = i3[9], h3 = i3[10], g3 = i3[11], _3 = i3[12], v3 = i3[13], y3 = i3[14], b3 = i3[15];
      if (r3[0].setComponents(c3 - a3, f3 - l3, g3 - p3, b3 - _3).normalize(), r3[1].setComponents(c3 + a3, f3 + l3, g3 + p3, b3 + _3).normalize(), r3[2].setComponents(c3 + o3, f3 + u3, g3 + m3, b3 + v3).normalize(), r3[3].setComponents(c3 - o3, f3 - u3, g3 - m3, b3 - v3).normalize(), n3) r3[4].setComponents(s3, d3, h3, y3).normalize(), r3[5].setComponents(c3 - s3, f3 - d3, g3 - h3, b3 - y3).normalize();
      else if (r3[4].setComponents(c3 - s3, f3 - d3, g3 - h3, b3 - y3).normalize(), t3 === 2e3) r3[5].setComponents(c3 + s3, f3 + d3, g3 + h3, b3 + y3).normalize();
      else if (t3 === 2001) r3[5].setComponents(s3, d3, h3, y3).normalize();
      else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: ` + t3);
      return this;
    }
    intersectsObject(e32) {
      if (e32.boundingSphere !== void 0) e32.boundingSphere === null && e32.computeBoundingSphere(), ni.copy(e32.boundingSphere).applyMatrix4(e32.matrixWorld);
      else {
        let t3 = e32.geometry;
        t3.boundingSphere === null && t3.computeBoundingSphere(), ni.copy(t3.boundingSphere).applyMatrix4(e32.matrixWorld);
      }
      return this.intersectsSphere(ni);
    }
    intersectsSprite(e32) {
      return ni.center.set(0, 0, 0), ni.radius = 0.7071067811865476 + ri.distanceTo(e32.center), ni.applyMatrix4(e32.matrixWorld), this.intersectsSphere(ni);
    }
    intersectsSphere(e32) {
      let t3 = this.planes, n3 = e32.center, r3 = -e32.radius;
      for (let e33 = 0; e33 < 6; e33++) if (t3[e33].distanceToPoint(n3) < r3) return false;
      return true;
    }
    intersectsBox(e32) {
      let t3 = this.planes;
      for (let n3 = 0; n3 < 6; n3++) {
        let r3 = t3[n3];
        if (ii.x = r3.normal.x > 0 ? e32.max.x : e32.min.x, ii.y = r3.normal.y > 0 ? e32.max.y : e32.min.y, ii.z = r3.normal.z > 0 ? e32.max.z : e32.min.z, r3.distanceToPoint(ii) < 0) return false;
      }
      return true;
    }
    containsPoint(e32) {
      let t3 = this.planes;
      for (let n3 = 0; n3 < 6; n3++) if (t3[n3].distanceToPoint(e32) < 0) return false;
      return true;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var oi = class extends Zn {
    constructor(e32) {
      super(), this.isPointsMaterial = true, this.type = `PointsMaterial`, this.color = new q(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(e32);
    }
    copy(e32) {
      return super.copy(e32), this.color.copy(e32.color), this.map = e32.map, this.alphaMap = e32.alphaMap, this.size = e32.size, this.sizeAttenuation = e32.sizeAttenuation, this.fog = e32.fog, this;
    }
  };
  var si = new nn();
  var ci = new tn();
  var li = new qt();
  var ui = new W();
  var di = class extends An {
    constructor(e32 = new pr(), t3 = new oi()) {
      super(), this.isPoints = true, this.type = `Points`, this.geometry = e32, this.material = t3, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
    }
    copy(e32, t3) {
      return super.copy(e32, t3), this.material = Array.isArray(e32.material) ? e32.material.slice() : e32.material, this.geometry = e32.geometry, this;
    }
    raycast(e32, t3) {
      let n3 = this.geometry, r3 = this.matrixWorld, i3 = e32.params.Points.threshold, a3 = n3.drawRange;
      if (n3.boundingSphere === null && n3.computeBoundingSphere(), li.copy(n3.boundingSphere), li.applyMatrix4(r3), li.radius += i3, e32.ray.intersectsSphere(li) === false) return;
      si.copy(r3).invert(), ci.copy(e32.ray).applyMatrix4(si);
      let o3 = i3 / ((this.scale.x + this.scale.y + this.scale.z) / 3), s3 = o3 * o3, c3 = n3.index, l3 = n3.attributes.position;
      if (c3 !== null) {
        let n4 = Math.max(0, a3.start), i4 = Math.min(c3.count, a3.start + a3.count);
        for (let a4 = n4, o4 = i4; a4 < o4; a4++) {
          let n5 = c3.getX(a4);
          ui.fromBufferAttribute(l3, n5), fi(ui, n5, s3, r3, e32, t3, this);
        }
      } else {
        let n4 = Math.max(0, a3.start), i4 = Math.min(l3.count, a3.start + a3.count);
        for (let a4 = n4, o4 = i4; a4 < o4; a4++) ui.fromBufferAttribute(l3, a4), fi(ui, a4, s3, r3, e32, t3, this);
      }
    }
    updateMorphTargets() {
      let e32 = this.geometry.morphAttributes, t3 = Object.keys(e32);
      if (t3.length > 0) {
        let n3 = e32[t3[0]];
        if (n3 !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let e33 = 0, t4 = n3.length; e33 < t4; e33++) {
            let t5 = n3[e33].name || String(e33);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[t5] = e33;
          }
        }
      }
    }
  };
  function fi(e32, t3, n3, r3, i3, a3, o3) {
    let s3 = ci.distanceSqToPoint(e32);
    if (s3 < n3) {
      let n4 = new W();
      ci.closestPointToPoint(e32, n4), n4.applyMatrix4(r3);
      let c3 = i3.ray.origin.distanceTo(n4);
      if (c3 < i3.near || c3 > i3.far) return;
      a3.push({ distance: c3, distanceToRay: Math.sqrt(s3), point: n4, index: t3, face: null, faceIndex: null, barycoord: null, object: o3 });
    }
  }
  var pi = class extends Ct {
    constructor(e32, t3, n3 = C, r3, i3, a3, o3 = f, s3 = f, c3, l3 = M, u3 = 1) {
      if (l3 !== 1026 && l3 !== 1027) throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);
      super({ width: e32, height: t3, depth: u3 }, r3, i3, a3, o3, s3, l3, n3, c3), this.isDepthTexture = true, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
    }
    copy(e32) {
      return super.copy(e32), this.source = new yt(Object.assign({}, e32.image)), this.compareFunction = e32.compareFunction, this;
    }
    toJSON(e32) {
      let t3 = super.toJSON(e32);
      return this.compareFunction !== null && (t3.compareFunction = this.compareFunction), t3;
    }
  };
  var mi = class extends Ct {
    constructor(e32 = null) {
      super(), this.sourceTexture = e32, this.isExternalTexture = true;
    }
    copy(e32) {
      return super.copy(e32), this.sourceTexture = e32.sourceTexture, this;
    }
  };
  var hi = class e13 extends pr {
    constructor(e32 = 1, t3 = 1, n3 = 1, r3 = 1) {
      super(), this.type = `PlaneGeometry`, this.parameters = { width: e32, height: t3, widthSegments: n3, heightSegments: r3 };
      let i3 = e32 / 2, a3 = t3 / 2, o3 = Math.floor(n3), s3 = Math.floor(r3), c3 = o3 + 1, l3 = s3 + 1, u3 = e32 / o3, d3 = t3 / s3, f3 = [], p3 = [], m3 = [], h3 = [];
      for (let e33 = 0; e33 < l3; e33++) {
        let t4 = e33 * d3 - a3;
        for (let n4 = 0; n4 < c3; n4++) {
          let r4 = n4 * u3 - i3;
          p3.push(r4, -t4, 0), m3.push(0, 0, 1), h3.push(n4 / o3), h3.push(1 - e33 / s3);
        }
      }
      for (let e33 = 0; e33 < s3; e33++) for (let t4 = 0; t4 < o3; t4++) {
        let n4 = t4 + c3 * e33, r4 = t4 + c3 * (e33 + 1), i4 = t4 + 1 + c3 * (e33 + 1), a4 = t4 + 1 + c3 * e33;
        f3.push(n4, r4, a4), f3.push(r4, i4, a4);
      }
      this.setIndex(f3), this.setAttribute(`position`, new ar(p3, 3)), this.setAttribute(`normal`, new ar(m3, 3)), this.setAttribute(`uv`, new ar(h3, 2));
    }
    copy(e32) {
      return super.copy(e32), this.parameters = Object.assign({}, e32.parameters), this;
    }
    static fromJSON(t3) {
      return new e13(t3.width, t3.height, t3.widthSegments, t3.heightSegments);
    }
  };
  var gi = class extends Zn {
    constructor(e32) {
      super(), this.isMeshDepthMaterial = true, this.type = `MeshDepthMaterial`, this.depthPacking = Le, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(e32);
    }
    copy(e32) {
      return super.copy(e32), this.depthPacking = e32.depthPacking, this.map = e32.map, this.alphaMap = e32.alphaMap, this.displacementMap = e32.displacementMap, this.displacementScale = e32.displacementScale, this.displacementBias = e32.displacementBias, this.wireframe = e32.wireframe, this.wireframeLinewidth = e32.wireframeLinewidth, this;
    }
  };
  var _i = class extends Zn {
    constructor(e32) {
      super(), this.isMeshDistanceMaterial = true, this.type = `MeshDistanceMaterial`, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e32);
    }
    copy(e32) {
      return super.copy(e32), this.map = e32.map, this.alphaMap = e32.alphaMap, this.displacementMap = e32.displacementMap, this.displacementScale = e32.displacementScale, this.displacementBias = e32.displacementBias, this;
    }
  };
  function vi(e32, t3) {
    return !e32 || e32.constructor === t3 ? e32 : typeof t3.BYTES_PER_ELEMENT == `number` ? new t3(e32) : Array.prototype.slice.call(e32);
  }
  function yi(e32) {
    return ArrayBuffer.isView(e32) && !(e32 instanceof DataView);
  }
  var bi = class {
    constructor(e32, t3, n3, r3) {
      this.parameterPositions = e32, this._cachedIndex = 0, this.resultBuffer = r3 === void 0 ? new t3.constructor(n3) : r3, this.sampleValues = t3, this.valueSize = n3, this.settings = null, this.DefaultSettings_ = {};
    }
    evaluate(e32) {
      let t3 = this.parameterPositions, n3 = this._cachedIndex, r3 = t3[n3], i3 = t3[n3 - 1];
      validate_interval: {
        seek: {
          let a3;
          linear_scan: {
            forward_scan: if (!(e32 < r3)) {
              for (let a4 = n3 + 2; ; ) {
                if (r3 === void 0) {
                  if (e32 < i3) break forward_scan;
                  return n3 = t3.length, this._cachedIndex = n3, this.copySampleValue_(n3 - 1);
                }
                if (n3 === a4) break;
                if (i3 = r3, r3 = t3[++n3], e32 < r3) break seek;
              }
              a3 = t3.length;
              break linear_scan;
            }
            if (!(e32 >= i3)) {
              let o3 = t3[1];
              e32 < o3 && (n3 = 2, i3 = o3);
              for (let a4 = n3 - 2; ; ) {
                if (i3 === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
                if (n3 === a4) break;
                if (r3 = i3, i3 = t3[--n3 - 1], e32 >= i3) break seek;
              }
              a3 = n3, n3 = 0;
              break linear_scan;
            }
            break validate_interval;
          }
          for (; n3 < a3; ) {
            let r4 = n3 + a3 >>> 1;
            e32 < t3[r4] ? a3 = r4 : n3 = r4 + 1;
          }
          if (r3 = t3[n3], i3 = t3[n3 - 1], i3 === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
          if (r3 === void 0) return n3 = t3.length, this._cachedIndex = n3, this.copySampleValue_(n3 - 1);
        }
        this._cachedIndex = n3, this.intervalChanged_(n3, i3, r3);
      }
      return this.interpolate_(n3, i3, e32, r3);
    }
    getSettings_() {
      return this.settings || this.DefaultSettings_;
    }
    copySampleValue_(e32) {
      let t3 = this.resultBuffer, n3 = this.sampleValues, r3 = this.valueSize, i3 = e32 * r3;
      for (let e33 = 0; e33 !== r3; ++e33) t3[e33] = n3[i3 + e33];
      return t3;
    }
    interpolate_() {
      throw Error(`call to abstract method`);
    }
    intervalChanged_() {
    }
  };
  var xi = class extends bi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = { endingStart: Pe, endingEnd: Pe };
    }
    intervalChanged_(e32, t3, n3) {
      let r3 = this.parameterPositions, i3 = e32 - 2, a3 = e32 + 1, o3 = r3[i3], s3 = r3[a3];
      if (o3 === void 0) switch (this.getSettings_().endingStart) {
        case Fe:
          i3 = e32, o3 = 2 * t3 - n3;
          break;
        case Ie:
          i3 = r3.length - 2, o3 = t3 + r3[i3] - r3[i3 + 1];
          break;
        default:
          i3 = e32, o3 = n3;
      }
      if (s3 === void 0) switch (this.getSettings_().endingEnd) {
        case Fe:
          a3 = e32, s3 = 2 * n3 - t3;
          break;
        case Ie:
          a3 = 1, s3 = n3 + r3[1] - r3[0];
          break;
        default:
          a3 = e32 - 1, s3 = t3;
      }
      let c3 = (n3 - t3) * 0.5, l3 = this.valueSize;
      this._weightPrev = c3 / (t3 - o3), this._weightNext = c3 / (s3 - n3), this._offsetPrev = i3 * l3, this._offsetNext = a3 * l3;
    }
    interpolate_(e32, t3, n3, r3) {
      let i3 = this.resultBuffer, a3 = this.sampleValues, o3 = this.valueSize, s3 = e32 * o3, c3 = s3 - o3, l3 = this._offsetPrev, u3 = this._offsetNext, d3 = this._weightPrev, f3 = this._weightNext, p3 = (n3 - t3) / (r3 - t3), m3 = p3 * p3, h3 = m3 * p3, g3 = -d3 * h3 + 2 * d3 * m3 - d3 * p3, _3 = (1 + d3) * h3 + (-1.5 - 2 * d3) * m3 + (-0.5 + d3) * p3 + 1, v3 = (-1 - f3) * h3 + (1.5 + f3) * m3 + 0.5 * p3, y3 = f3 * h3 - f3 * m3;
      for (let e33 = 0; e33 !== o3; ++e33) i3[e33] = g3 * a3[l3 + e33] + _3 * a3[c3 + e33] + v3 * a3[s3 + e33] + y3 * a3[u3 + e33];
      return i3;
    }
  };
  var Si = class extends bi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
    interpolate_(e32, t3, n3, r3) {
      let i3 = this.resultBuffer, a3 = this.sampleValues, o3 = this.valueSize, s3 = e32 * o3, c3 = s3 - o3, l3 = (n3 - t3) / (r3 - t3), u3 = 1 - l3;
      for (let e33 = 0; e33 !== o3; ++e33) i3[e33] = a3[c3 + e33] * u3 + a3[s3 + e33] * l3;
      return i3;
    }
  };
  var Ci = class extends bi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
    interpolate_(e32) {
      return this.copySampleValue_(e32 - 1);
    }
  };
  var wi = class {
    constructor(e32, t3, n3, r3) {
      if (e32 === void 0) throw Error(`THREE.KeyframeTrack: track name is undefined`);
      if (t3 === void 0 || t3.length === 0) throw Error(`THREE.KeyframeTrack: no keyframes in track named ` + e32);
      this.name = e32, this.times = vi(t3, this.TimeBufferType), this.values = vi(n3, this.ValueBufferType), this.setInterpolation(r3 || this.DefaultInterpolation);
    }
    static toJSON(e32) {
      let t3 = e32.constructor, n3;
      if (t3.toJSON !== this.toJSON) n3 = t3.toJSON(e32);
      else {
        n3 = { name: e32.name, times: vi(e32.times, Array), values: vi(e32.values, Array) };
        let t4 = e32.getInterpolation();
        t4 !== e32.DefaultInterpolation && (n3.interpolation = t4);
      }
      return n3.type = e32.ValueTypeName, n3;
    }
    InterpolantFactoryMethodDiscrete(e32) {
      return new Ci(this.times, this.values, this.getValueSize(), e32);
    }
    InterpolantFactoryMethodLinear(e32) {
      return new Si(this.times, this.values, this.getValueSize(), e32);
    }
    InterpolantFactoryMethodSmooth(e32) {
      return new xi(this.times, this.values, this.getValueSize(), e32);
    }
    setInterpolation(e32) {
      let t3;
      switch (e32) {
        case je:
          t3 = this.InterpolantFactoryMethodDiscrete;
          break;
        case Me:
          t3 = this.InterpolantFactoryMethodLinear;
          break;
        case Ne:
          t3 = this.InterpolantFactoryMethodSmooth;
          break;
      }
      if (t3 === void 0) {
        let t4 = `unsupported interpolation for ` + this.ValueTypeName + ` keyframe track named ` + this.name;
        if (this.createInterpolant === void 0) if (e32 !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
        else throw Error(t4);
        return console.warn(`THREE.KeyframeTrack:`, t4), this;
      }
      return this.createInterpolant = t3, this;
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
    shift(e32) {
      if (e32 !== 0) {
        let t3 = this.times;
        for (let n3 = 0, r3 = t3.length; n3 !== r3; ++n3) t3[n3] += e32;
      }
      return this;
    }
    scale(e32) {
      if (e32 !== 1) {
        let t3 = this.times;
        for (let n3 = 0, r3 = t3.length; n3 !== r3; ++n3) t3[n3] *= e32;
      }
      return this;
    }
    trim(e32, t3) {
      let n3 = this.times, r3 = n3.length, i3 = 0, a3 = r3 - 1;
      for (; i3 !== r3 && n3[i3] < e32; ) ++i3;
      for (; a3 !== -1 && n3[a3] > t3; ) --a3;
      if (++a3, i3 !== 0 || a3 !== r3) {
        i3 >= a3 && (a3 = Math.max(a3, 1), i3 = a3 - 1);
        let e33 = this.getValueSize();
        this.times = n3.slice(i3, a3), this.values = this.values.slice(i3 * e33, a3 * e33);
      }
      return this;
    }
    validate() {
      let e32 = true, t3 = this.getValueSize();
      t3 - Math.floor(t3) !== 0 && (console.error(`THREE.KeyframeTrack: Invalid value size in track.`, this), e32 = false);
      let n3 = this.times, r3 = this.values, i3 = n3.length;
      i3 === 0 && (console.error(`THREE.KeyframeTrack: Track is empty.`, this), e32 = false);
      let a3 = null;
      for (let t4 = 0; t4 !== i3; t4++) {
        let r4 = n3[t4];
        if (typeof r4 == `number` && isNaN(r4)) {
          console.error(`THREE.KeyframeTrack: Time is not a valid number.`, this, t4, r4), e32 = false;
          break;
        }
        if (a3 !== null && a3 > r4) {
          console.error(`THREE.KeyframeTrack: Out of order keys.`, this, t4, r4, a3), e32 = false;
          break;
        }
        a3 = r4;
      }
      if (r3 !== void 0 && yi(r3)) for (let t4 = 0, n4 = r3.length; t4 !== n4; ++t4) {
        let n5 = r3[t4];
        if (isNaN(n5)) {
          console.error(`THREE.KeyframeTrack: Value is not a valid number.`, this, t4, n5), e32 = false;
          break;
        }
      }
      return e32;
    }
    optimize() {
      let e32 = this.times.slice(), t3 = this.values.slice(), n3 = this.getValueSize(), r3 = this.getInterpolation() === Ne, i3 = e32.length - 1, a3 = 1;
      for (let o3 = 1; o3 < i3; ++o3) {
        let i4 = false, s3 = e32[o3];
        if (s3 !== e32[o3 + 1] && (o3 !== 1 || s3 !== e32[0])) if (r3) i4 = true;
        else {
          let e33 = o3 * n3, r4 = e33 - n3, a4 = e33 + n3;
          for (let o4 = 0; o4 !== n3; ++o4) {
            let n4 = t3[e33 + o4];
            if (n4 !== t3[r4 + o4] || n4 !== t3[a4 + o4]) {
              i4 = true;
              break;
            }
          }
        }
        if (i4) {
          if (o3 !== a3) {
            e32[a3] = e32[o3];
            let r4 = o3 * n3, i5 = a3 * n3;
            for (let e33 = 0; e33 !== n3; ++e33) t3[i5 + e33] = t3[r4 + e33];
          }
          ++a3;
        }
      }
      if (i3 > 0) {
        e32[a3] = e32[i3];
        for (let e33 = i3 * n3, r4 = a3 * n3, o3 = 0; o3 !== n3; ++o3) t3[r4 + o3] = t3[e33 + o3];
        ++a3;
      }
      return a3 === e32.length ? (this.times = e32, this.values = t3) : (this.times = e32.slice(0, a3), this.values = t3.slice(0, a3 * n3)), this;
    }
    clone() {
      let e32 = this.times.slice(), t3 = this.values.slice(), n3 = this.constructor, r3 = new n3(this.name, e32, t3);
      return r3.createInterpolant = this.createInterpolant, r3;
    }
  };
  wi.prototype.ValueTypeName = ``, wi.prototype.TimeBufferType = Float32Array, wi.prototype.ValueBufferType = Float32Array, wi.prototype.DefaultInterpolation = Me;
  var Ti = class extends wi {
    constructor(e32, t3, n3) {
      super(e32, t3, n3);
    }
  };
  Ti.prototype.ValueTypeName = `bool`, Ti.prototype.ValueBufferType = Array, Ti.prototype.DefaultInterpolation = je, Ti.prototype.InterpolantFactoryMethodLinear = void 0, Ti.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Ei = class extends wi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
  };
  Ei.prototype.ValueTypeName = `color`;
  var Di = class extends wi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
  };
  Di.prototype.ValueTypeName = `number`;
  var Oi = class extends bi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
    interpolate_(e32, t3, n3, r3) {
      let i3 = this.resultBuffer, a3 = this.sampleValues, o3 = this.valueSize, s3 = (n3 - t3) / (r3 - t3), c3 = e32 * o3;
      for (let e33 = c3 + o3; c3 !== e33; c3 += 4) tt.slerpFlat(i3, 0, a3, c3 - o3, a3, c3, s3);
      return i3;
    }
  };
  var ki = class extends wi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
    InterpolantFactoryMethodLinear(e32) {
      return new Oi(this.times, this.values, this.getValueSize(), e32);
    }
  };
  ki.prototype.ValueTypeName = `quaternion`, ki.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Ai = class extends wi {
    constructor(e32, t3, n3) {
      super(e32, t3, n3);
    }
  };
  Ai.prototype.ValueTypeName = `string`, Ai.prototype.ValueBufferType = Array, Ai.prototype.DefaultInterpolation = je, Ai.prototype.InterpolantFactoryMethodLinear = void 0, Ai.prototype.InterpolantFactoryMethodSmooth = void 0;
  var ji = class extends wi {
    constructor(e32, t3, n3, r3) {
      super(e32, t3, n3, r3);
    }
  };
  ji.prototype.ValueTypeName = `vector`;
  var Mi = new class {
    constructor(e32, t3, n3) {
      let r3 = this, i3 = false, a3 = 0, o3 = 0, s3, c3 = [];
      this.onStart = void 0, this.onLoad = e32, this.onProgress = t3, this.onError = n3, this.abortController = new AbortController(), this.itemStart = function(e33) {
        o3++, i3 === false && r3.onStart !== void 0 && r3.onStart(e33, a3, o3), i3 = true;
      }, this.itemEnd = function(e33) {
        a3++, r3.onProgress !== void 0 && r3.onProgress(e33, a3, o3), a3 === o3 && (i3 = false, r3.onLoad !== void 0 && r3.onLoad());
      }, this.itemError = function(e33) {
        r3.onError !== void 0 && r3.onError(e33);
      }, this.resolveURL = function(e33) {
        return s3 ? s3(e33) : e33;
      }, this.setURLModifier = function(e33) {
        return s3 = e33, this;
      }, this.addHandler = function(e33, t4) {
        return c3.push(e33, t4), this;
      }, this.removeHandler = function(e33) {
        let t4 = c3.indexOf(e33);
        return t4 !== -1 && c3.splice(t4, 2), this;
      }, this.getHandler = function(e33) {
        for (let t4 = 0, n4 = c3.length; t4 < n4; t4 += 2) {
          let n5 = c3[t4], r4 = c3[t4 + 1];
          if (n5.global && (n5.lastIndex = 0), n5.test(e33)) return r4;
        }
        return null;
      }, this.abort = function() {
        return this.abortController.abort(), this.abortController = new AbortController(), this;
      };
    }
  }();
  var Ni = class {
    constructor(e32) {
      this.manager = e32 === void 0 ? Mi : e32, this.crossOrigin = `anonymous`, this.withCredentials = false, this.path = ``, this.resourcePath = ``, this.requestHeader = {};
    }
    load() {
    }
    loadAsync(e32, t3) {
      let n3 = this;
      return new Promise(function(r3, i3) {
        n3.load(e32, r3, t3, i3);
      });
    }
    parse() {
    }
    setCrossOrigin(e32) {
      return this.crossOrigin = e32, this;
    }
    setWithCredentials(e32) {
      return this.withCredentials = e32, this;
    }
    setPath(e32) {
      return this.path = e32, this;
    }
    setResourcePath(e32) {
      return this.resourcePath = e32, this;
    }
    setRequestHeader(e32) {
      return this.requestHeader = e32, this;
    }
    abort() {
      return this;
    }
  };
  Ni.DEFAULT_MATERIAL_NAME = `__DEFAULT`;
  var Pi = class extends Lr {
    constructor(e32 = -1, t3 = 1, n3 = 1, r3 = -1, i3 = 0.1, a3 = 2e3) {
      super(), this.isOrthographicCamera = true, this.type = `OrthographicCamera`, this.zoom = 1, this.view = null, this.left = e32, this.right = t3, this.top = n3, this.bottom = r3, this.near = i3, this.far = a3, this.updateProjectionMatrix();
    }
    copy(e32, t3) {
      return super.copy(e32, t3), this.left = e32.left, this.right = e32.right, this.top = e32.top, this.bottom = e32.bottom, this.near = e32.near, this.far = e32.far, this.zoom = e32.zoom, this.view = e32.view === null ? null : Object.assign({}, e32.view), this;
    }
    setViewOffset(e32, t3, n3, r3, i3, a3) {
      this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e32, this.view.fullHeight = t3, this.view.offsetX = n3, this.view.offsetY = r3, this.view.width = i3, this.view.height = a3, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      let e32 = (this.right - this.left) / (2 * this.zoom), t3 = (this.top - this.bottom) / (2 * this.zoom), n3 = (this.right + this.left) / 2, r3 = (this.top + this.bottom) / 2, i3 = n3 - e32, a3 = n3 + e32, o3 = r3 + t3, s3 = r3 - t3;
      if (this.view !== null && this.view.enabled) {
        let e33 = (this.right - this.left) / this.view.fullWidth / this.zoom, t4 = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
        i3 += e33 * this.view.offsetX, a3 = i3 + e33 * this.view.width, o3 -= t4 * this.view.offsetY, s3 = o3 - t4 * this.view.height;
      }
      this.projectionMatrix.makeOrthographic(i3, a3, o3, s3, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e32) {
      let t3 = super.toJSON(e32);
      return t3.object.zoom = this.zoom, t3.object.left = this.left, t3.object.right = this.right, t3.object.top = this.top, t3.object.bottom = this.bottom, t3.object.near = this.near, t3.object.far = this.far, this.view !== null && (t3.object.view = Object.assign({}, this.view)), t3;
    }
  };
  var Fi = class extends Vr {
    constructor(e32 = []) {
      super(), this.isArrayCamera = true, this.isMultiViewCamera = false, this.cameras = e32;
    }
  };
  var Ii = class {
    constructor(e32 = true) {
      this.autoStart = e32, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = false;
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
      let e32 = 0;
      if (this.autoStart && !this.running) return this.start(), 0;
      if (this.running) {
        let t3 = performance.now();
        e32 = (t3 - this.oldTime) / 1e3, this.oldTime = t3, this.elapsedTime += e32;
      }
      return e32;
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
    constructor(e32, t3, n3) {
      let r3 = n3 || J.parseTrackName(t3);
      this._targetGroup = e32, this._bindings = e32.subscribe_(t3, r3);
    }
    getValue(e32, t3) {
      this.bind();
      let n3 = this._targetGroup.nCachedObjects_, r3 = this._bindings[n3];
      r3 !== void 0 && r3.getValue(e32, t3);
    }
    setValue(e32, t3) {
      let n3 = this._bindings;
      for (let r3 = this._targetGroup.nCachedObjects_, i3 = n3.length; r3 !== i3; ++r3) n3[r3].setValue(e32, t3);
    }
    bind() {
      let e32 = this._bindings;
      for (let t3 = this._targetGroup.nCachedObjects_, n3 = e32.length; t3 !== n3; ++t3) e32[t3].bind();
    }
    unbind() {
      let e32 = this._bindings;
      for (let t3 = this._targetGroup.nCachedObjects_, n3 = e32.length; t3 !== n3; ++t3) e32[t3].unbind();
    }
  };
  var J = class e14 {
    constructor(t3, n3, r3) {
      this.path = n3, this.parsedPath = r3 || e14.parseTrackName(n3), this.node = e14.findNode(t3, this.parsedPath.nodeName), this.rootNode = t3, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
    static create(t3, n3, r3) {
      return t3 && t3.isAnimationObjectGroup ? new e14.Composite(t3, n3, r3) : new e14(t3, n3, r3);
    }
    static sanitizeNodeName(e32) {
      return e32.replace(/\s/g, `_`).replace(Ri, ``);
    }
    static parseTrackName(e32) {
      let t3 = Gi.exec(e32);
      if (t3 === null) throw Error(`PropertyBinding: Cannot parse trackName: ` + e32);
      let n3 = { nodeName: t3[2], objectName: t3[3], objectIndex: t3[4], propertyName: t3[5], propertyIndex: t3[6] }, r3 = n3.nodeName && n3.nodeName.lastIndexOf(`.`);
      if (r3 !== void 0 && r3 !== -1) {
        let e33 = n3.nodeName.substring(r3 + 1);
        Ki.indexOf(e33) !== -1 && (n3.nodeName = n3.nodeName.substring(0, r3), n3.objectName = e33);
      }
      if (n3.propertyName === null || n3.propertyName.length === 0) throw Error(`PropertyBinding: can not parse propertyName from trackName: ` + e32);
      return n3;
    }
    static findNode(e32, t3) {
      if (t3 === void 0 || t3 === `` || t3 === `.` || t3 === -1 || t3 === e32.name || t3 === e32.uuid) return e32;
      if (e32.skeleton) {
        let n3 = e32.skeleton.getBoneByName(t3);
        if (n3 !== void 0) return n3;
      }
      if (e32.children) {
        let n3 = function(e33) {
          for (let r4 = 0; r4 < e33.length; r4++) {
            let i3 = e33[r4];
            if (i3.name === t3 || i3.uuid === t3) return i3;
            let a3 = n3(i3.children);
            if (a3) return a3;
          }
          return null;
        }, r3 = n3(e32.children);
        if (r3) return r3;
      }
      return null;
    }
    _getValue_unavailable() {
    }
    _setValue_unavailable() {
    }
    _getValue_direct(e32, t3) {
      e32[t3] = this.targetObject[this.propertyName];
    }
    _getValue_array(e32, t3) {
      let n3 = this.resolvedProperty;
      for (let r3 = 0, i3 = n3.length; r3 !== i3; ++r3) e32[t3++] = n3[r3];
    }
    _getValue_arrayElement(e32, t3) {
      e32[t3] = this.resolvedProperty[this.propertyIndex];
    }
    _getValue_toArray(e32, t3) {
      this.resolvedProperty.toArray(e32, t3);
    }
    _setValue_direct(e32, t3) {
      this.targetObject[this.propertyName] = e32[t3];
    }
    _setValue_direct_setNeedsUpdate(e32, t3) {
      this.targetObject[this.propertyName] = e32[t3], this.targetObject.needsUpdate = true;
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(e32, t3) {
      this.targetObject[this.propertyName] = e32[t3], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_array(e32, t3) {
      let n3 = this.resolvedProperty;
      for (let r3 = 0, i3 = n3.length; r3 !== i3; ++r3) n3[r3] = e32[t3++];
    }
    _setValue_array_setNeedsUpdate(e32, t3) {
      let n3 = this.resolvedProperty;
      for (let r3 = 0, i3 = n3.length; r3 !== i3; ++r3) n3[r3] = e32[t3++];
      this.targetObject.needsUpdate = true;
    }
    _setValue_array_setMatrixWorldNeedsUpdate(e32, t3) {
      let n3 = this.resolvedProperty;
      for (let r3 = 0, i3 = n3.length; r3 !== i3; ++r3) n3[r3] = e32[t3++];
      this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_arrayElement(e32, t3) {
      this.resolvedProperty[this.propertyIndex] = e32[t3];
    }
    _setValue_arrayElement_setNeedsUpdate(e32, t3) {
      this.resolvedProperty[this.propertyIndex] = e32[t3], this.targetObject.needsUpdate = true;
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(e32, t3) {
      this.resolvedProperty[this.propertyIndex] = e32[t3], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_fromArray(e32, t3) {
      this.resolvedProperty.fromArray(e32, t3);
    }
    _setValue_fromArray_setNeedsUpdate(e32, t3) {
      this.resolvedProperty.fromArray(e32, t3), this.targetObject.needsUpdate = true;
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(e32, t3) {
      this.resolvedProperty.fromArray(e32, t3), this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _getValue_unbound(e32, t3) {
      this.bind(), this.getValue(e32, t3);
    }
    _setValue_unbound(e32, t3) {
      this.bind(), this.setValue(e32, t3);
    }
    bind() {
      let t3 = this.node, n3 = this.parsedPath, r3 = n3.objectName, i3 = n3.propertyName, a3 = n3.propertyIndex;
      if (t3 || (t3 = e14.findNode(this.rootNode, n3.nodeName), this.node = t3), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t3) {
        console.warn(`THREE.PropertyBinding: No target node found for track: ` + this.path + `.`);
        return;
      }
      if (r3) {
        let e32 = n3.objectIndex;
        switch (r3) {
          case `materials`:
            if (!t3.material) {
              console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`, this);
              return;
            }
            if (!t3.material.materials) {
              console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`, this);
              return;
            }
            t3 = t3.material.materials;
            break;
          case `bones`:
            if (!t3.skeleton) {
              console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`, this);
              return;
            }
            t3 = t3.skeleton.bones;
            for (let n4 = 0; n4 < t3.length; n4++) if (t3[n4].name === e32) {
              e32 = n4;
              break;
            }
            break;
          case `map`:
            if (`map` in t3) {
              t3 = t3.map;
              break;
            }
            if (!t3.material) {
              console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`, this);
              return;
            }
            if (!t3.material.map) {
              console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`, this);
              return;
            }
            t3 = t3.material.map;
            break;
          default:
            if (t3[r3] === void 0) {
              console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`, this);
              return;
            }
            t3 = t3[r3];
        }
        if (e32 !== void 0) {
          if (t3[e32] === void 0) {
            console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`, this, t3);
            return;
          }
          t3 = t3[e32];
        }
      }
      let o3 = t3[i3];
      if (o3 === void 0) {
        let e32 = n3.nodeName;
        console.error(`THREE.PropertyBinding: Trying to update property for track: ` + e32 + `.` + i3 + ` but it wasn't found.`, t3);
        return;
      }
      let s3 = this.Versioning.None;
      this.targetObject = t3, t3.isMaterial === true ? s3 = this.Versioning.NeedsUpdate : t3.isObject3D === true && (s3 = this.Versioning.MatrixWorldNeedsUpdate);
      let c3 = this.BindingType.Direct;
      if (a3 !== void 0) {
        if (i3 === `morphTargetInfluences`) {
          if (!t3.geometry) {
            console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`, this);
            return;
          }
          if (!t3.geometry.morphAttributes) {
            console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`, this);
            return;
          }
          t3.morphTargetDictionary[a3] !== void 0 && (a3 = t3.morphTargetDictionary[a3]);
        }
        c3 = this.BindingType.ArrayElement, this.resolvedProperty = o3, this.propertyIndex = a3;
      } else o3.fromArray !== void 0 && o3.toArray !== void 0 ? (c3 = this.BindingType.HasFromToArray, this.resolvedProperty = o3) : Array.isArray(o3) ? (c3 = this.BindingType.EntireArray, this.resolvedProperty = o3) : this.propertyName = i3;
      this.getValue = this.GetterByBindingType[c3], this.setValue = this.SetterByBindingTypeAndVersioning[c3][s3];
    }
    unbind() {
      this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
  };
  J.Composite = qi, J.prototype.BindingType = { Direct: 0, EntireArray: 1, ArrayElement: 2, HasFromToArray: 3 }, J.prototype.Versioning = { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 }, J.prototype.GetterByBindingType = [J.prototype._getValue_direct, J.prototype._getValue_array, J.prototype._getValue_arrayElement, J.prototype._getValue_toArray], J.prototype.SetterByBindingTypeAndVersioning = [[J.prototype._setValue_direct, J.prototype._setValue_direct_setNeedsUpdate, J.prototype._setValue_direct_setMatrixWorldNeedsUpdate], [J.prototype._setValue_array, J.prototype._setValue_array_setNeedsUpdate, J.prototype._setValue_array_setMatrixWorldNeedsUpdate], [J.prototype._setValue_arrayElement, J.prototype._setValue_arrayElement_setNeedsUpdate, J.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate], [J.prototype._setValue_fromArray, J.prototype._setValue_fromArray_setNeedsUpdate, J.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];
  var Ji = new nn();
  var Yi = class {
    constructor(e32, t3, n3 = 0, r3 = 1 / 0) {
      this.ray = new tn(e32, t3), this.near = n3, this.far = r3, this.camera = null, this.layers = new mn(), this.params = { Mesh: {}, Line: { threshold: 1 }, LOD: {}, Points: { threshold: 1 }, Sprite: {} };
    }
    set(e32, t3) {
      this.ray.set(e32, t3);
    }
    setFromCamera(e32, t3) {
      t3.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t3.matrixWorld), this.ray.direction.set(e32.x, e32.y, 0.5).unproject(t3).sub(this.ray.origin).normalize(), this.camera = t3) : t3.isOrthographicCamera ? (this.ray.origin.set(e32.x, e32.y, (t3.near + t3.far) / (t3.near - t3.far)).unproject(t3), this.ray.direction.set(0, 0, -1).transformDirection(t3.matrixWorld), this.camera = t3) : console.error(`THREE.Raycaster: Unsupported camera type: ` + t3.type);
    }
    setFromXRController(e32) {
      return Ji.identity().extractRotation(e32.matrixWorld), this.ray.origin.setFromMatrixPosition(e32.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(Ji), this;
    }
    intersectObject(e32, t3 = true, n3 = []) {
      return Zi(e32, this, n3, t3), n3.sort(Xi), n3;
    }
    intersectObjects(e32, t3 = true, n3 = []) {
      for (let r3 = 0, i3 = e32.length; r3 < i3; r3++) Zi(e32[r3], this, n3, t3);
      return n3.sort(Xi), n3;
    }
  };
  function Xi(e32, t3) {
    return e32.distance - t3.distance;
  }
  function Zi(e32, t3, n3, r3) {
    let i3 = true;
    if (e32.layers.test(t3.layers) && e32.raycast(t3, n3) === false && (i3 = false), i3 === true && r3 === true) {
      let r4 = e32.children;
      for (let e33 = 0, i4 = r4.length; e33 < i4; e33++) Zi(r4[e33], t3, n3, true);
    }
  }
  function Qi(e32, t3, n3, r3) {
    let i3 = $i(r3);
    switch (n3) {
      case j:
        return e32 * t3;
      case P:
        return e32 * t3 / i3.components * i3.byteLength;
      case ne:
        return e32 * t3 / i3.components * i3.byteLength;
      case re:
        return e32 * t3 * 2 / i3.components * i3.byteLength;
      case ie:
        return e32 * t3 * 2 / i3.components * i3.byteLength;
      case ee:
        return e32 * t3 * 3 / i3.components * i3.byteLength;
      case te:
        return e32 * t3 * 4 / i3.components * i3.byteLength;
      case ae:
        return e32 * t3 * 4 / i3.components * i3.byteLength;
      case oe:
      case se:
        return Math.floor((e32 + 3) / 4) * Math.floor((t3 + 3) / 4) * 8;
      case F:
      case ce:
        return Math.floor((e32 + 3) / 4) * Math.floor((t3 + 3) / 4) * 16;
      case ue:
      case fe:
        return Math.max(e32, 16) * Math.max(t3, 8) / 4;
      case le:
      case de:
        return Math.max(e32, 8) * Math.max(t3, 8) / 2;
      case pe:
      case me:
        return Math.floor((e32 + 3) / 4) * Math.floor((t3 + 3) / 4) * 8;
      case I:
        return Math.floor((e32 + 3) / 4) * Math.floor((t3 + 3) / 4) * 16;
      case he:
        return Math.floor((e32 + 3) / 4) * Math.floor((t3 + 3) / 4) * 16;
      case L:
        return Math.floor((e32 + 4) / 5) * Math.floor((t3 + 3) / 4) * 16;
      case R:
        return Math.floor((e32 + 4) / 5) * Math.floor((t3 + 4) / 5) * 16;
      case z:
        return Math.floor((e32 + 5) / 6) * Math.floor((t3 + 4) / 5) * 16;
      case ge:
        return Math.floor((e32 + 5) / 6) * Math.floor((t3 + 5) / 6) * 16;
      case B:
        return Math.floor((e32 + 7) / 8) * Math.floor((t3 + 4) / 5) * 16;
      case V:
        return Math.floor((e32 + 7) / 8) * Math.floor((t3 + 5) / 6) * 16;
      case _e:
        return Math.floor((e32 + 7) / 8) * Math.floor((t3 + 7) / 8) * 16;
      case ve:
        return Math.floor((e32 + 9) / 10) * Math.floor((t3 + 4) / 5) * 16;
      case ye:
        return Math.floor((e32 + 9) / 10) * Math.floor((t3 + 5) / 6) * 16;
      case be:
        return Math.floor((e32 + 9) / 10) * Math.floor((t3 + 7) / 8) * 16;
      case xe:
        return Math.floor((e32 + 9) / 10) * Math.floor((t3 + 9) / 10) * 16;
      case Se:
        return Math.floor((e32 + 11) / 12) * Math.floor((t3 + 9) / 10) * 16;
      case Ce:
        return Math.floor((e32 + 11) / 12) * Math.floor((t3 + 11) / 12) * 16;
      case we:
      case Te:
      case Ee:
        return Math.ceil(e32 / 4) * Math.ceil(t3 / 4) * 16;
      case De:
      case Oe:
        return Math.ceil(e32 / 4) * Math.ceil(t3 / 4) * 8;
      case ke:
      case Ae:
        return Math.ceil(e32 / 4) * Math.ceil(t3 / 4) * 16;
    }
    throw Error(`Unable to determine texture byte length for ${n3} format.`);
  }
  function $i(e32) {
    switch (e32) {
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
    throw Error(`Unknown texture type ${e32}.`);
  }
  typeof __THREE_DEVTOOLS__ < `u` && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`, { detail: { revision: `180` } })), typeof window < `u` && (window.__THREE__ ? console.warn(`WARNING: Multiple instances of Three.js being imported.`) : window.__THREE__ = `180`);
  function ea() {
    let e32 = null, t3 = false, n3 = null, r3 = null;
    function i3(t4, a3) {
      n3(t4, a3), r3 = e32.requestAnimationFrame(i3);
    }
    return { start: function() {
      t3 !== true && n3 !== null && (r3 = e32.requestAnimationFrame(i3), t3 = true);
    }, stop: function() {
      e32.cancelAnimationFrame(r3), t3 = false;
    }, setAnimationLoop: function(e33) {
      n3 = e33;
    }, setContext: function(t4) {
      e32 = t4;
    } };
  }
  function ta(e32) {
    let t3 = /* @__PURE__ */ new WeakMap();
    function n3(t4, n4) {
      let r4 = t4.array, i4 = t4.usage, a4 = r4.byteLength, o4 = e32.createBuffer();
      e32.bindBuffer(n4, o4), e32.bufferData(n4, r4, i4), t4.onUploadCallback();
      let s3;
      if (r4 instanceof Float32Array) s3 = e32.FLOAT;
      else if (typeof Float16Array < `u` && r4 instanceof Float16Array) s3 = e32.HALF_FLOAT;
      else if (r4 instanceof Uint16Array) s3 = t4.isFloat16BufferAttribute ? e32.HALF_FLOAT : e32.UNSIGNED_SHORT;
      else if (r4 instanceof Int16Array) s3 = e32.SHORT;
      else if (r4 instanceof Uint32Array) s3 = e32.UNSIGNED_INT;
      else if (r4 instanceof Int32Array) s3 = e32.INT;
      else if (r4 instanceof Int8Array) s3 = e32.BYTE;
      else if (r4 instanceof Uint8Array) s3 = e32.UNSIGNED_BYTE;
      else if (r4 instanceof Uint8ClampedArray) s3 = e32.UNSIGNED_BYTE;
      else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: ` + r4);
      return { buffer: o4, type: s3, bytesPerElement: r4.BYTES_PER_ELEMENT, version: t4.version, size: a4 };
    }
    function r3(t4, n4, r4) {
      let i4 = n4.array, a4 = n4.updateRanges;
      if (e32.bindBuffer(r4, t4), a4.length === 0) e32.bufferSubData(r4, 0, i4);
      else {
        a4.sort((e33, t6) => e33.start - t6.start);
        let t5 = 0;
        for (let e33 = 1; e33 < a4.length; e33++) {
          let n5 = a4[t5], r5 = a4[e33];
          r5.start <= n5.start + n5.count + 1 ? n5.count = Math.max(n5.count, r5.start + r5.count - n5.start) : (++t5, a4[t5] = r5);
        }
        a4.length = t5 + 1;
        for (let t6 = 0, n5 = a4.length; t6 < n5; t6++) {
          let n6 = a4[t6];
          e32.bufferSubData(r4, n6.start * i4.BYTES_PER_ELEMENT, i4, n6.start, n6.count);
        }
        n4.clearUpdateRanges();
      }
      n4.onUploadCallback();
    }
    function i3(e33) {
      return e33.isInterleavedBufferAttribute && (e33 = e33.data), t3.get(e33);
    }
    function a3(n4) {
      n4.isInterleavedBufferAttribute && (n4 = n4.data);
      let r4 = t3.get(n4);
      r4 && (e32.deleteBuffer(r4.buffer), t3.delete(n4));
    }
    function o3(e33, i4) {
      if (e33.isInterleavedBufferAttribute && (e33 = e33.data), e33.isGLBufferAttribute) {
        let n4 = t3.get(e33);
        (!n4 || n4.version < e33.version) && t3.set(e33, { buffer: e33.buffer, type: e33.type, bytesPerElement: e33.elementSize, version: e33.version });
        return;
      }
      let a4 = t3.get(e33);
      if (a4 === void 0) t3.set(e33, n3(e33, i4));
      else if (a4.version < e33.version) {
        if (a4.size !== e33.array.byteLength) throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);
        r3(a4.buffer, e33, i4), a4.version = e33.version;
      }
    }
    return { get: i3, remove: a3, update: o3 };
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
  function oa(e32, t3, n3, r3, i3, a3, o3) {
    let s3 = new q(0), c3 = a3 === true ? 0 : 1, l3, u3, d3 = null, f3 = 0, p3 = null;
    function m3(e33) {
      let r4 = e33.isScene === true ? e33.background : null;
      return r4 && r4.isTexture && (r4 = (e33.backgroundBlurriness > 0 ? n3 : t3).get(r4)), r4;
    }
    function h3(t4) {
      let n4 = false, i4 = m3(t4);
      i4 === null ? _3(s3, c3) : i4 && i4.isColor && (_3(i4, 1), n4 = true);
      let a4 = e32.xr.getEnvironmentBlendMode();
      a4 === `additive` ? r3.buffers.color.setClear(0, 0, 0, 1, o3) : a4 === `alpha-blend` && r3.buffers.color.setClear(0, 0, 0, 0, o3), (e32.autoClear || n4) && (r3.buffers.depth.setTest(true), r3.buffers.depth.setMask(true), r3.buffers.color.setMask(true), e32.clear(e32.autoClearColor, e32.autoClearDepth, e32.autoClearStencil));
    }
    function g3(t4, n4) {
      let r4 = m3(n4);
      r4 && (r4.isCubeTexture || r4.mapping === 306) ? (u3 === void 0 && (u3 = new Tr(new Or(1, 1, 1), new Ir({ name: `BackgroundCubeMaterial`, uniforms: kr(na.backgroundCube.uniforms), vertexShader: na.backgroundCube.vertexShader, fragmentShader: na.backgroundCube.fragmentShader, side: 1, depthTest: false, depthWrite: false, fog: false, allowOverride: false })), u3.geometry.deleteAttribute(`normal`), u3.geometry.deleteAttribute(`uv`), u3.onBeforeRender = function(e33, t5, n5) {
        this.matrixWorld.copyPosition(n5.matrixWorld);
      }, Object.defineProperty(u3.material, "envMap", { get: function() {
        return this.uniforms.envMap.value;
      } }), i3.update(u3)), ia.copy(n4.backgroundRotation), ia.x *= -1, ia.y *= -1, ia.z *= -1, r4.isCubeTexture && r4.isRenderTargetTexture === false && (ia.y *= -1, ia.z *= -1), u3.material.uniforms.envMap.value = r4, u3.material.uniforms.flipEnvMap.value = r4.isCubeTexture && r4.isRenderTargetTexture === false ? -1 : 1, u3.material.uniforms.backgroundBlurriness.value = n4.backgroundBlurriness, u3.material.uniforms.backgroundIntensity.value = n4.backgroundIntensity, u3.material.uniforms.backgroundRotation.value.setFromMatrix4(aa.makeRotationFromEuler(ia)), u3.material.toneMapped = K.getTransfer(r4.colorSpace) !== He, (d3 !== r4 || f3 !== r4.version || p3 !== e32.toneMapping) && (u3.material.needsUpdate = true, d3 = r4, f3 = r4.version, p3 = e32.toneMapping), u3.layers.enableAll(), t4.unshift(u3, u3.geometry, u3.material, 0, 0, null)) : r4 && r4.isTexture && (l3 === void 0 && (l3 = new Tr(new hi(2, 2), new Ir({ name: `BackgroundMaterial`, uniforms: kr(na.background.uniforms), vertexShader: na.background.vertexShader, fragmentShader: na.background.fragmentShader, side: 0, depthTest: false, depthWrite: false, fog: false, allowOverride: false })), l3.geometry.deleteAttribute(`normal`), Object.defineProperty(l3.material, "map", { get: function() {
        return this.uniforms.t2D.value;
      } }), i3.update(l3)), l3.material.uniforms.t2D.value = r4, l3.material.uniforms.backgroundIntensity.value = n4.backgroundIntensity, l3.material.toneMapped = K.getTransfer(r4.colorSpace) !== He, r4.matrixAutoUpdate === true && r4.updateMatrix(), l3.material.uniforms.uvTransform.value.copy(r4.matrix), (d3 !== r4 || f3 !== r4.version || p3 !== e32.toneMapping) && (l3.material.needsUpdate = true, d3 = r4, f3 = r4.version, p3 = e32.toneMapping), l3.layers.enableAll(), t4.unshift(l3, l3.geometry, l3.material, 0, 0, null));
    }
    function _3(t4, n4) {
      t4.getRGB(ra, Mr(e32)), r3.buffers.color.setClear(ra.r, ra.g, ra.b, n4, o3);
    }
    function v3() {
      u3 !== void 0 && (u3.geometry.dispose(), u3.material.dispose(), u3 = void 0), l3 !== void 0 && (l3.geometry.dispose(), l3.material.dispose(), l3 = void 0);
    }
    return { getClearColor: function() {
      return s3;
    }, setClearColor: function(e33, t4 = 1) {
      s3.set(e33), c3 = t4, _3(s3, c3);
    }, getClearAlpha: function() {
      return c3;
    }, setClearAlpha: function(e33) {
      c3 = e33, _3(s3, c3);
    }, render: h3, addToRenderList: g3, dispose: v3 };
  }
  function sa(e32, t3) {
    let n3 = e32.getParameter(e32.MAX_VERTEX_ATTRIBS), r3 = {}, i3 = f3(null), a3 = i3, o3 = false;
    function s3(n4, r4, i4, s4, c4) {
      let u4 = false, f4 = d3(s4, i4, r4);
      a3 !== f4 && (a3 = f4, l3(a3.object)), u4 = p3(n4, s4, i4, c4), u4 && m3(n4, s4, i4, c4), c4 !== null && t3.update(c4, e32.ELEMENT_ARRAY_BUFFER), (u4 || o3) && (o3 = false, b3(n4, r4, i4, s4), c4 !== null && e32.bindBuffer(e32.ELEMENT_ARRAY_BUFFER, t3.get(c4).buffer));
    }
    function c3() {
      return e32.createVertexArray();
    }
    function l3(t4) {
      return e32.bindVertexArray(t4);
    }
    function u3(t4) {
      return e32.deleteVertexArray(t4);
    }
    function d3(e33, t4, n4) {
      let i4 = n4.wireframe === true, a4 = r3[e33.id];
      a4 === void 0 && (a4 = {}, r3[e33.id] = a4);
      let o4 = a4[t4.id];
      o4 === void 0 && (o4 = {}, a4[t4.id] = o4);
      let s4 = o4[i4];
      return s4 === void 0 && (s4 = f3(c3()), o4[i4] = s4), s4;
    }
    function f3(e33) {
      let t4 = [], r4 = [], i4 = [];
      for (let e34 = 0; e34 < n3; e34++) t4[e34] = 0, r4[e34] = 0, i4[e34] = 0;
      return { geometry: null, program: null, wireframe: false, newAttributes: t4, enabledAttributes: r4, attributeDivisors: i4, object: e33, attributes: {}, index: null };
    }
    function p3(e33, t4, n4, r4) {
      let i4 = a3.attributes, o4 = t4.attributes, s4 = 0, c4 = n4.getAttributes();
      for (let t5 in c4) if (c4[t5].location >= 0) {
        let n5 = i4[t5], r5 = o4[t5];
        if (r5 === void 0 && (t5 === `instanceMatrix` && e33.instanceMatrix && (r5 = e33.instanceMatrix), t5 === `instanceColor` && e33.instanceColor && (r5 = e33.instanceColor)), n5 === void 0 || n5.attribute !== r5 || r5 && n5.data !== r5.data) return true;
        s4++;
      }
      return a3.attributesNum !== s4 || a3.index !== r4;
    }
    function m3(e33, t4, n4, r4) {
      let i4 = {}, o4 = t4.attributes, s4 = 0, c4 = n4.getAttributes();
      for (let t5 in c4) if (c4[t5].location >= 0) {
        let n5 = o4[t5];
        n5 === void 0 && (t5 === `instanceMatrix` && e33.instanceMatrix && (n5 = e33.instanceMatrix), t5 === `instanceColor` && e33.instanceColor && (n5 = e33.instanceColor));
        let r5 = {};
        r5.attribute = n5, n5 && n5.data && (r5.data = n5.data), i4[t5] = r5, s4++;
      }
      a3.attributes = i4, a3.attributesNum = s4, a3.index = r4;
    }
    function h3() {
      let e33 = a3.newAttributes;
      for (let t4 = 0, n4 = e33.length; t4 < n4; t4++) e33[t4] = 0;
    }
    function g3(e33) {
      _3(e33, 0);
    }
    function _3(t4, n4) {
      let r4 = a3.newAttributes, i4 = a3.enabledAttributes, o4 = a3.attributeDivisors;
      r4[t4] = 1, i4[t4] === 0 && (e32.enableVertexAttribArray(t4), i4[t4] = 1), o4[t4] !== n4 && (e32.vertexAttribDivisor(t4, n4), o4[t4] = n4);
    }
    function v3() {
      let t4 = a3.newAttributes, n4 = a3.enabledAttributes;
      for (let r4 = 0, i4 = n4.length; r4 < i4; r4++) n4[r4] !== t4[r4] && (e32.disableVertexAttribArray(r4), n4[r4] = 0);
    }
    function y3(t4, n4, r4, i4, a4, o4, s4) {
      s4 === true ? e32.vertexAttribIPointer(t4, n4, r4, a4, o4) : e32.vertexAttribPointer(t4, n4, r4, i4, a4, o4);
    }
    function b3(n4, r4, i4, a4) {
      h3();
      let o4 = a4.attributes, s4 = i4.getAttributes(), c4 = r4.defaultAttributeValues;
      for (let r5 in s4) {
        let i5 = s4[r5];
        if (i5.location >= 0) {
          let s5 = o4[r5];
          if (s5 === void 0 && (r5 === `instanceMatrix` && n4.instanceMatrix && (s5 = n4.instanceMatrix), r5 === `instanceColor` && n4.instanceColor && (s5 = n4.instanceColor)), s5 !== void 0) {
            let r6 = s5.normalized, o5 = s5.itemSize, c5 = t3.get(s5);
            if (c5 === void 0) continue;
            let l4 = c5.buffer, u4 = c5.type, d4 = c5.bytesPerElement, f4 = u4 === e32.INT || u4 === e32.UNSIGNED_INT || s5.gpuType === 1013;
            if (s5.isInterleavedBufferAttribute) {
              let t4 = s5.data, c6 = t4.stride, p4 = s5.offset;
              if (t4.isInstancedInterleavedBuffer) {
                for (let e33 = 0; e33 < i5.locationSize; e33++) _3(i5.location + e33, t4.meshPerAttribute);
                n4.isInstancedMesh !== true && a4._maxInstanceCount === void 0 && (a4._maxInstanceCount = t4.meshPerAttribute * t4.count);
              } else for (let e33 = 0; e33 < i5.locationSize; e33++) g3(i5.location + e33);
              e32.bindBuffer(e32.ARRAY_BUFFER, l4);
              for (let e33 = 0; e33 < i5.locationSize; e33++) y3(i5.location + e33, o5 / i5.locationSize, u4, r6, c6 * d4, (p4 + o5 / i5.locationSize * e33) * d4, f4);
            } else {
              if (s5.isInstancedBufferAttribute) {
                for (let e33 = 0; e33 < i5.locationSize; e33++) _3(i5.location + e33, s5.meshPerAttribute);
                n4.isInstancedMesh !== true && a4._maxInstanceCount === void 0 && (a4._maxInstanceCount = s5.meshPerAttribute * s5.count);
              } else for (let e33 = 0; e33 < i5.locationSize; e33++) g3(i5.location + e33);
              e32.bindBuffer(e32.ARRAY_BUFFER, l4);
              for (let e33 = 0; e33 < i5.locationSize; e33++) y3(i5.location + e33, o5 / i5.locationSize, u4, r6, o5 * d4, o5 / i5.locationSize * e33 * d4, f4);
            }
          } else if (c4 !== void 0) {
            let t4 = c4[r5];
            if (t4 !== void 0) switch (t4.length) {
              case 2:
                e32.vertexAttrib2fv(i5.location, t4);
                break;
              case 3:
                e32.vertexAttrib3fv(i5.location, t4);
                break;
              case 4:
                e32.vertexAttrib4fv(i5.location, t4);
                break;
              default:
                e32.vertexAttrib1fv(i5.location, t4);
            }
          }
        }
      }
      v3();
    }
    function x3() {
      w3();
      for (let e33 in r3) {
        let t4 = r3[e33];
        for (let e34 in t4) {
          let n4 = t4[e34];
          for (let e35 in n4) u3(n4[e35].object), delete n4[e35];
          delete t4[e34];
        }
        delete r3[e33];
      }
    }
    function S3(e33) {
      if (r3[e33.id] === void 0) return;
      let t4 = r3[e33.id];
      for (let e34 in t4) {
        let n4 = t4[e34];
        for (let e35 in n4) u3(n4[e35].object), delete n4[e35];
        delete t4[e34];
      }
      delete r3[e33.id];
    }
    function C3(e33) {
      for (let t4 in r3) {
        let n4 = r3[t4];
        if (n4[e33.id] === void 0) continue;
        let i4 = n4[e33.id];
        for (let e34 in i4) u3(i4[e34].object), delete i4[e34];
        delete n4[e33.id];
      }
    }
    function w3() {
      T3(), o3 = true, a3 !== i3 && (a3 = i3, l3(a3.object));
    }
    function T3() {
      i3.geometry = null, i3.program = null, i3.wireframe = false;
    }
    return { setup: s3, reset: w3, resetDefaultState: T3, dispose: x3, releaseStatesOfGeometry: S3, releaseStatesOfProgram: C3, initAttributes: h3, enableAttribute: g3, disableUnusedAttributes: v3 };
  }
  function ca(e32, t3, n3) {
    let r3;
    function i3(e33) {
      r3 = e33;
    }
    function a3(t4, i4) {
      e32.drawArrays(r3, t4, i4), n3.update(i4, r3, 1);
    }
    function o3(t4, i4, a4) {
      a4 !== 0 && (e32.drawArraysInstanced(r3, t4, i4, a4), n3.update(i4, r3, a4));
    }
    function s3(e33, i4, a4) {
      if (a4 === 0) return;
      t3.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r3, e33, 0, i4, 0, a4);
      let o4 = 0;
      for (let e34 = 0; e34 < a4; e34++) o4 += i4[e34];
      n3.update(o4, r3, 1);
    }
    function c3(e33, i4, a4, s4) {
      if (a4 === 0) return;
      let c4 = t3.get(`WEBGL_multi_draw`);
      if (c4 === null) for (let t4 = 0; t4 < e33.length; t4++) o3(e33[t4], i4[t4], s4[t4]);
      else {
        c4.multiDrawArraysInstancedWEBGL(r3, e33, 0, i4, 0, s4, 0, a4);
        let t4 = 0;
        for (let e34 = 0; e34 < a4; e34++) t4 += i4[e34] * s4[e34];
        n3.update(t4, r3, 1);
      }
    }
    this.setMode = i3, this.render = a3, this.renderInstances = o3, this.renderMultiDraw = s3, this.renderMultiDrawInstances = c3;
  }
  function la(e32, t3, n3, r3) {
    let i3;
    function a3() {
      if (i3 !== void 0) return i3;
      if (t3.has(`EXT_texture_filter_anisotropic`) === true) {
        let n4 = t3.get(`EXT_texture_filter_anisotropic`);
        i3 = e32.getParameter(n4.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else i3 = 0;
      return i3;
    }
    function o3(t4) {
      return !(t4 !== 1023 && r3.convert(t4) !== e32.getParameter(e32.IMPLEMENTATION_COLOR_READ_FORMAT));
    }
    function s3(n4) {
      let i4 = n4 === 1016 && (t3.has(`EXT_color_buffer_half_float`) || t3.has(`EXT_color_buffer_float`));
      return !(n4 !== 1009 && r3.convert(n4) !== e32.getParameter(e32.IMPLEMENTATION_COLOR_READ_TYPE) && n4 !== 1015 && !i4);
    }
    function c3(t4) {
      if (t4 === `highp`) {
        if (e32.getShaderPrecisionFormat(e32.VERTEX_SHADER, e32.HIGH_FLOAT).precision > 0 && e32.getShaderPrecisionFormat(e32.FRAGMENT_SHADER, e32.HIGH_FLOAT).precision > 0) return `highp`;
        t4 = `mediump`;
      }
      return t4 === `mediump` && e32.getShaderPrecisionFormat(e32.VERTEX_SHADER, e32.MEDIUM_FLOAT).precision > 0 && e32.getShaderPrecisionFormat(e32.FRAGMENT_SHADER, e32.MEDIUM_FLOAT).precision > 0 ? `mediump` : `lowp`;
    }
    let l3 = n3.precision === void 0 ? `highp` : n3.precision, u3 = c3(l3);
    u3 !== l3 && (console.warn(`THREE.WebGLRenderer:`, l3, `not supported, using`, u3, `instead.`), l3 = u3);
    let d3 = n3.logarithmicDepthBuffer === true, f3 = n3.reversedDepthBuffer === true && t3.has(`EXT_clip_control`), p3 = e32.getParameter(e32.MAX_TEXTURE_IMAGE_UNITS), m3 = e32.getParameter(e32.MAX_VERTEX_TEXTURE_IMAGE_UNITS), h3 = e32.getParameter(e32.MAX_TEXTURE_SIZE), g3 = e32.getParameter(e32.MAX_CUBE_MAP_TEXTURE_SIZE), _3 = e32.getParameter(e32.MAX_VERTEX_ATTRIBS), v3 = e32.getParameter(e32.MAX_VERTEX_UNIFORM_VECTORS), y3 = e32.getParameter(e32.MAX_VARYING_VECTORS), b3 = e32.getParameter(e32.MAX_FRAGMENT_UNIFORM_VECTORS), x3 = m3 > 0, S3 = e32.getParameter(e32.MAX_SAMPLES);
    return { isWebGL2: true, getMaxAnisotropy: a3, getMaxPrecision: c3, textureFormatReadable: o3, textureTypeReadable: s3, precision: l3, logarithmicDepthBuffer: d3, reversedDepthBuffer: f3, maxTextures: p3, maxVertexTextures: m3, maxTextureSize: h3, maxCubemapSize: g3, maxAttributes: _3, maxVertexUniforms: v3, maxVaryings: y3, maxFragmentUniforms: b3, vertexTextures: x3, maxSamples: S3 };
  }
  function ua(e32) {
    let t3 = this, n3 = null, r3 = 0, i3 = false, a3 = false, o3 = new ti(), s3 = new G(), c3 = { value: null, needsUpdate: false };
    this.uniform = c3, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e33, t4) {
      let n4 = e33.length !== 0 || t4 || r3 !== 0 || i3;
      return i3 = t4, r3 = e33.length, n4;
    }, this.beginShadows = function() {
      a3 = true, u3(null);
    }, this.endShadows = function() {
      a3 = false;
    }, this.setGlobalState = function(e33, t4) {
      n3 = u3(e33, t4, 0);
    }, this.setState = function(t4, o4, s4) {
      let d3 = t4.clippingPlanes, f3 = t4.clipIntersection, p3 = t4.clipShadows, m3 = e32.get(t4);
      if (!i3 || d3 === null || d3.length === 0 || a3 && !p3) a3 ? u3(null) : l3();
      else {
        let e33 = a3 ? 0 : r3, t5 = e33 * 4, i4 = m3.clippingState || null;
        c3.value = i4, i4 = u3(d3, o4, t5, s4);
        for (let e34 = 0; e34 !== t5; ++e34) i4[e34] = n3[e34];
        m3.clippingState = i4, this.numIntersection = f3 ? this.numPlanes : 0, this.numPlanes += e33;
      }
    };
    function l3() {
      c3.value !== n3 && (c3.value = n3, c3.needsUpdate = r3 > 0), t3.numPlanes = r3, t3.numIntersection = 0;
    }
    function u3(e33, n4, r4, i4) {
      let a4 = e33 === null ? 0 : e33.length, l4 = null;
      if (a4 !== 0) {
        if (l4 = c3.value, i4 !== true || l4 === null) {
          let t4 = r4 + a4 * 4, i5 = n4.matrixWorldInverse;
          s3.getNormalMatrix(i5), (l4 === null || l4.length < t4) && (l4 = new Float32Array(t4));
          for (let t5 = 0, n5 = r4; t5 !== a4; ++t5, n5 += 4) o3.copy(e33[t5]).applyMatrix4(i5, s3), o3.normal.toArray(l4, n5), l4[n5 + 3] = o3.constant;
        }
        c3.value = l4, c3.needsUpdate = true;
      }
      return t3.numPlanes = a4, t3.numIntersection = 0, l4;
    }
  }
  function da(e32) {
    let t3 = /* @__PURE__ */ new WeakMap();
    function n3(e33, t4) {
      return t4 === 303 ? e33.mapping = 301 : t4 === 304 && (e33.mapping = 302), e33;
    }
    function r3(r4) {
      if (r4 && r4.isTexture) {
        let a4 = r4.mapping;
        if (a4 === 303 || a4 === 304) if (t3.has(r4)) {
          let e33 = t3.get(r4).texture;
          return n3(e33, r4.mapping);
        } else {
          let a5 = r4.image;
          if (a5 && a5.height > 0) {
            let o3 = new Kr(a5.height);
            return o3.fromEquirectangularTexture(e32, r4), t3.set(r4, o3), r4.addEventListener(`dispose`, i3), n3(o3.texture, r4.mapping);
          } else return null;
        }
      }
      return r4;
    }
    function i3(e33) {
      let n4 = e33.target;
      n4.removeEventListener(`dispose`, i3);
      let r4 = t3.get(n4);
      r4 !== void 0 && (t3.delete(n4), r4.dispose());
    }
    function a3() {
      t3 = /* @__PURE__ */ new WeakMap();
    }
    return { get: r3, dispose: a3 };
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
    constructor(e32) {
      this._renderer = e32, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
    }
    fromScene(e32, t3 = 0, n3 = 0.1, r3 = 100, i3 = {}) {
      let { size: a3 = 256, position: o3 = wa } = i3;
      _a = this._renderer.getRenderTarget(), va = this._renderer.getActiveCubeFace(), ya = this._renderer.getActiveMipmapLevel(), ba = this._renderer.xr.enabled, this._renderer.xr.enabled = false, this._setSize(a3);
      let s3 = this._allocateTargets();
      return s3.depthBuffer = true, this._sceneToCubeUV(e32, n3, r3, s3, o3), t3 > 0 && this._blur(s3, 0, 0, t3), this._applyPMREM(s3), this._cleanup(s3), s3;
    }
    fromEquirectangular(e32, t3 = null) {
      return this._fromTexture(e32, t3);
    }
    fromCubemap(e32, t3 = null) {
      return this._fromTexture(e32, t3);
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
    _setSize(e32) {
      this._lodMax = Math.floor(Math.log2(e32)), this._cubeSize = 2 ** this._lodMax;
    }
    _dispose() {
      this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
      for (let e32 = 0; e32 < this._lodPlanes.length; e32++) this._lodPlanes[e32].dispose();
    }
    _cleanup(e32) {
      this._renderer.setRenderTarget(_a, va, ya), this._renderer.xr.enabled = ba, e32.scissorTest = false, Oa(e32, 0, 0, e32.width, e32.height);
    }
    _fromTexture(e32, t3) {
      e32.mapping === 301 || e32.mapping === 302 ? this._setSize(e32.image.length === 0 ? 16 : e32.image[0].width || e32.image[0].image.width) : this._setSize(e32.image.width / 4), _a = this._renderer.getRenderTarget(), va = this._renderer.getActiveCubeFace(), ya = this._renderer.getActiveMipmapLevel(), ba = this._renderer.xr.enabled, this._renderer.xr.enabled = false;
      let n3 = t3 || this._allocateTargets();
      return this._textureToCubeUV(e32, n3), this._applyPMREM(n3), this._cleanup(n3), n3;
    }
    _allocateTargets() {
      let e32 = 3 * Math.max(this._cubeSize, 112), t3 = 4 * this._cubeSize, n3 = { magFilter: h, minFilter: h, generateMipmaps: false, type: T, format: te, colorSpace: Be, depthBuffer: false }, r3 = Da(e32, t3, n3);
      if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e32 || this._pingPongRenderTarget.height !== t3) {
        this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Da(e32, t3, n3);
        let { _lodMax: r4 } = this;
        ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Ea(r4)), this._blurMaterial = ka(r4, e32, t3);
      }
      return r3;
    }
    _compileMaterial(e32) {
      let t3 = new Tr(this._lodPlanes[0], e32);
      this._renderer.compile(t3, ha);
    }
    _sceneToCubeUV(e32, t3, n3, r3, i3) {
      let a3 = new Vr(90, 1, t3, n3), o3 = [1, -1, 1, 1, 1, 1], s3 = [1, 1, 1, -1, -1, -1], c3 = this._renderer, l3 = c3.autoClear, u3 = c3.toneMapping;
      c3.getClearColor(ga), c3.toneMapping = 0, c3.autoClear = false, c3.state.buffers.depth.getReversed() && (c3.setRenderTarget(r3), c3.clearDepth(), c3.setRenderTarget(null));
      let d3 = new Qn({ name: `PMREM.Background`, side: 1, depthWrite: false, depthTest: false }), f3 = new Tr(new Or(), d3), p3 = false, m3 = e32.background;
      m3 ? m3.isColor && (d3.color.copy(m3), e32.background = null, p3 = true) : (d3.color.copy(ga), p3 = true);
      for (let t4 = 0; t4 < 6; t4++) {
        let n4 = t4 % 3;
        n4 === 0 ? (a3.up.set(0, o3[t4], 0), a3.position.set(i3.x, i3.y, i3.z), a3.lookAt(i3.x + s3[t4], i3.y, i3.z)) : n4 === 1 ? (a3.up.set(0, 0, o3[t4]), a3.position.set(i3.x, i3.y, i3.z), a3.lookAt(i3.x, i3.y + s3[t4], i3.z)) : (a3.up.set(0, o3[t4], 0), a3.position.set(i3.x, i3.y, i3.z), a3.lookAt(i3.x, i3.y, i3.z + s3[t4]));
        let l4 = this._cubeSize;
        Oa(r3, n4 * l4, t4 > 2 ? l4 : 0, l4, l4), c3.setRenderTarget(r3), p3 && c3.render(f3, a3), c3.render(e32, a3);
      }
      f3.geometry.dispose(), f3.material.dispose(), c3.toneMapping = u3, c3.autoClear = l3, e32.background = m3;
    }
    _textureToCubeUV(e32, t3) {
      let n3 = this._renderer, r3 = e32.mapping === 301 || e32.mapping === 302;
      r3 ? (this._cubemapMaterial === null && (this._cubemapMaterial = ja()), this._cubemapMaterial.uniforms.flipEnvMap.value = e32.isRenderTargetTexture === false ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Aa());
      let i3 = r3 ? this._cubemapMaterial : this._equirectMaterial, a3 = new Tr(this._lodPlanes[0], i3), o3 = i3.uniforms;
      o3.envMap.value = e32;
      let s3 = this._cubeSize;
      Oa(t3, 0, 0, 3 * s3, 2 * s3), n3.setRenderTarget(t3), n3.render(a3, ha);
    }
    _applyPMREM(e32) {
      let t3 = this._renderer, n3 = t3.autoClear;
      t3.autoClear = false;
      let r3 = this._lodPlanes.length;
      for (let t4 = 1; t4 < r3; t4++) {
        let n4 = Math.sqrt(this._sigmas[t4] * this._sigmas[t4] - this._sigmas[t4 - 1] * this._sigmas[t4 - 1]), i3 = Ca[(r3 - t4 - 1) % Ca.length];
        this._blur(e32, t4 - 1, t4, n4, i3);
      }
      t3.autoClear = n3;
    }
    _blur(e32, t3, n3, r3, i3) {
      let a3 = this._pingPongRenderTarget;
      this._halfBlur(e32, a3, t3, n3, r3, `latitudinal`, i3), this._halfBlur(a3, e32, n3, n3, r3, `longitudinal`, i3);
    }
    _halfBlur(e32, t3, n3, r3, i3, a3, o3) {
      let s3 = this._renderer, c3 = this._blurMaterial;
      a3 !== `latitudinal` && a3 !== `longitudinal` && console.error(`blur direction must be either latitudinal or longitudinal!`);
      let l3 = new Tr(this._lodPlanes[r3], c3), u3 = c3.uniforms, d3 = this._sizeLods[n3] - 1, f3 = isFinite(i3) ? Math.PI / (2 * d3) : 2 * Math.PI / (2 * ma - 1), p3 = i3 / f3, m3 = isFinite(i3) ? 1 + Math.floor(3 * p3) : ma;
      m3 > ma && console.warn(`sigmaRadians, ${i3}, is too large and will clip, as it requested ${m3} samples when the maximum is set to ${ma}`);
      let h3 = [], g3 = 0;
      for (let e33 = 0; e33 < ma; ++e33) {
        let t4 = e33 / p3, n4 = Math.exp(-t4 * t4 / 2);
        h3.push(n4), e33 === 0 ? g3 += n4 : e33 < m3 && (g3 += 2 * n4);
      }
      for (let e33 = 0; e33 < h3.length; e33++) h3[e33] = h3[e33] / g3;
      u3.envMap.value = e32.texture, u3.samples.value = m3, u3.weights.value = h3, u3.latitudinal.value = a3 === `latitudinal`, o3 && (u3.poleAxis.value = o3);
      let { _lodMax: _3 } = this;
      u3.dTheta.value = f3, u3.mipInt.value = _3 - n3;
      let v3 = this._sizeLods[r3];
      Oa(t3, 3 * v3 * (r3 > _3 - fa ? r3 - _3 + fa : 0), 4 * (this._cubeSize - v3), 3 * v3, 2 * v3), s3.setRenderTarget(t3), s3.render(l3, ha);
    }
  };
  function Ea(e32) {
    let t3 = [], n3 = [], r3 = [], i3 = e32, a3 = e32 - fa + 1 + pa.length;
    for (let o3 = 0; o3 < a3; o3++) {
      let a4 = 2 ** i3;
      n3.push(a4);
      let s3 = 1 / a4;
      o3 > e32 - fa ? s3 = pa[o3 - e32 + fa - 1] : o3 === 0 && (s3 = 0), r3.push(s3);
      let c3 = 1 / (a4 - 2), l3 = -c3, u3 = 1 + c3, d3 = [l3, l3, u3, l3, u3, u3, l3, l3, u3, u3, l3, u3], f3 = new Float32Array(108), p3 = new Float32Array(72), m3 = new Float32Array(36);
      for (let e33 = 0; e33 < 6; e33++) {
        let t4 = e33 % 3 * 2 / 3 - 1, n4 = e33 > 2 ? 0 : -1, r4 = [t4, n4, 0, t4 + 2 / 3, n4, 0, t4 + 2 / 3, n4 + 1, 0, t4, n4, 0, t4 + 2 / 3, n4 + 1, 0, t4, n4 + 1, 0];
        f3.set(r4, 18 * e33), p3.set(d3, 12 * e33);
        let i4 = [e33, e33, e33, e33, e33, e33];
        m3.set(i4, 6 * e33);
      }
      let h3 = new pr();
      h3.setAttribute(`position`, new nr(f3, 3)), h3.setAttribute(`uv`, new nr(p3, 2)), h3.setAttribute(`faceIndex`, new nr(m3, 1)), t3.push(h3), i3 > fa && i3--;
    }
    return { lodPlanes: t3, sizeLods: n3, sigmas: r3 };
  }
  function Da(e32, t3, n3) {
    let r3 = new Et(e32, t3, n3);
    return r3.texture.mapping = 306, r3.texture.name = `PMREM.cubeUv`, r3.scissorTest = true, r3;
  }
  function Oa(e32, t3, n3, r3, i3) {
    e32.viewport.set(t3, n3, r3, i3), e32.scissor.set(t3, n3, r3, i3);
  }
  function ka(e32, t3, n3) {
    let r3 = new Float32Array(ma), i3 = new W(0, 1, 0);
    return new Ir({ name: `SphericalGaussianBlur`, defines: { n: ma, CUBEUV_TEXEL_WIDTH: 1 / t3, CUBEUV_TEXEL_HEIGHT: 1 / n3, CUBEUV_MAX_MIP: `${e32}.0` }, uniforms: { envMap: { value: null }, samples: { value: 1 }, weights: { value: r3 }, latitudinal: { value: false }, dTheta: { value: 0 }, mipInt: { value: 0 }, poleAxis: { value: i3 } }, vertexShader: Ma(), fragmentShader: `

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
  function Na(e32) {
    let t3 = /* @__PURE__ */ new WeakMap(), n3 = null;
    function r3(r4) {
      if (r4 && r4.isTexture) {
        let o4 = r4.mapping, s3 = o4 === 303 || o4 === 304, c3 = o4 === 301 || o4 === 302;
        if (s3 || c3) {
          let o5 = t3.get(r4), l3 = o5 === void 0 ? 0 : o5.texture.pmremVersion;
          if (r4.isRenderTargetTexture && r4.pmremVersion !== l3) return n3 === null && (n3 = new Ta(e32)), o5 = s3 ? n3.fromEquirectangular(r4, o5) : n3.fromCubemap(r4, o5), o5.texture.pmremVersion = r4.pmremVersion, t3.set(r4, o5), o5.texture;
          if (o5 !== void 0) return o5.texture;
          {
            let l4 = r4.image;
            return s3 && l4 && l4.height > 0 || c3 && l4 && i3(l4) ? (n3 === null && (n3 = new Ta(e32)), o5 = s3 ? n3.fromEquirectangular(r4) : n3.fromCubemap(r4), o5.texture.pmremVersion = r4.pmremVersion, t3.set(r4, o5), r4.addEventListener(`dispose`, a3), o5.texture) : null;
          }
        }
      }
      return r4;
    }
    function i3(e33) {
      let t4 = 0;
      for (let n4 = 0; n4 < 6; n4++) e33[n4] !== void 0 && t4++;
      return t4 === 6;
    }
    function a3(e33) {
      let n4 = e33.target;
      n4.removeEventListener(`dispose`, a3);
      let r4 = t3.get(n4);
      r4 !== void 0 && (t3.delete(n4), r4.dispose());
    }
    function o3() {
      t3 = /* @__PURE__ */ new WeakMap(), n3 !== null && (n3.dispose(), n3 = null);
    }
    return { get: r3, dispose: o3 };
  }
  function Pa(e32) {
    let t3 = {};
    function n3(n4) {
      if (t3[n4] !== void 0) return t3[n4];
      let r3;
      switch (n4) {
        case `WEBGL_depth_texture`:
          r3 = e32.getExtension(`WEBGL_depth_texture`) || e32.getExtension(`MOZ_WEBGL_depth_texture`) || e32.getExtension(`WEBKIT_WEBGL_depth_texture`);
          break;
        case `EXT_texture_filter_anisotropic`:
          r3 = e32.getExtension(`EXT_texture_filter_anisotropic`) || e32.getExtension(`MOZ_EXT_texture_filter_anisotropic`) || e32.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);
          break;
        case `WEBGL_compressed_texture_s3tc`:
          r3 = e32.getExtension(`WEBGL_compressed_texture_s3tc`) || e32.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`) || e32.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);
          break;
        case `WEBGL_compressed_texture_pvrtc`:
          r3 = e32.getExtension(`WEBGL_compressed_texture_pvrtc`) || e32.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);
          break;
        default:
          r3 = e32.getExtension(n4);
      }
      return t3[n4] = r3, r3;
    }
    return { has: function(e33) {
      return n3(e33) !== null;
    }, init: function() {
      n3(`EXT_color_buffer_float`), n3(`WEBGL_clip_cull_distance`), n3(`OES_texture_float_linear`), n3(`EXT_color_buffer_half_float`), n3(`WEBGL_multisampled_render_to_texture`), n3(`WEBGL_render_shared_exponent`);
    }, get: function(e33) {
      let t4 = n3(e33);
      return t4 === null && lt(`THREE.WebGLRenderer: ` + e33 + ` extension not supported.`), t4;
    } };
  }
  function Fa(e32, t3, n3, r3) {
    let i3 = {}, a3 = /* @__PURE__ */ new WeakMap();
    function o3(e33) {
      let s4 = e33.target;
      s4.index !== null && t3.remove(s4.index);
      for (let e34 in s4.attributes) t3.remove(s4.attributes[e34]);
      s4.removeEventListener(`dispose`, o3), delete i3[s4.id];
      let c4 = a3.get(s4);
      c4 && (t3.remove(c4), a3.delete(s4)), r3.releaseStatesOfGeometry(s4), s4.isInstancedBufferGeometry === true && delete s4._maxInstanceCount, n3.memory.geometries--;
    }
    function s3(e33, t4) {
      return i3[t4.id] === true ? t4 : (t4.addEventListener(`dispose`, o3), i3[t4.id] = true, n3.memory.geometries++, t4);
    }
    function c3(n4) {
      let r4 = n4.attributes;
      for (let n5 in r4) t3.update(r4[n5], e32.ARRAY_BUFFER);
    }
    function l3(e33) {
      let n4 = [], r4 = e33.index, i4 = e33.attributes.position, o4 = 0;
      if (r4 !== null) {
        let e34 = r4.array;
        o4 = r4.version;
        for (let t4 = 0, r5 = e34.length; t4 < r5; t4 += 3) {
          let r6 = e34[t4 + 0], i5 = e34[t4 + 1], a4 = e34[t4 + 2];
          n4.push(r6, i5, i5, a4, a4, r6);
        }
      } else if (i4 !== void 0) {
        let e34 = i4.array;
        o4 = i4.version;
        for (let t4 = 0, r5 = e34.length / 3 - 1; t4 < r5; t4 += 3) {
          let e35 = t4 + 0, r6 = t4 + 1, i5 = t4 + 2;
          n4.push(e35, r6, r6, i5, i5, e35);
        }
      } else return;
      let s4 = new (at(n4) ? ir : rr)(n4, 1);
      s4.version = o4;
      let c4 = a3.get(e33);
      c4 && t3.remove(c4), a3.set(e33, s4);
    }
    function u3(e33) {
      let t4 = a3.get(e33);
      if (t4) {
        let n4 = e33.index;
        n4 !== null && t4.version < n4.version && l3(e33);
      } else l3(e33);
      return a3.get(e33);
    }
    return { get: s3, update: c3, getWireframeAttribute: u3 };
  }
  function Ia(e32, t3, n3) {
    let r3;
    function i3(e33) {
      r3 = e33;
    }
    let a3, o3;
    function s3(e33) {
      a3 = e33.type, o3 = e33.bytesPerElement;
    }
    function c3(t4, i4) {
      e32.drawElements(r3, i4, a3, t4 * o3), n3.update(i4, r3, 1);
    }
    function l3(t4, i4, s4) {
      s4 !== 0 && (e32.drawElementsInstanced(r3, i4, a3, t4 * o3, s4), n3.update(i4, r3, s4));
    }
    function u3(e33, i4, o4) {
      if (o4 === 0) return;
      t3.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r3, i4, 0, a3, e33, 0, o4);
      let s4 = 0;
      for (let e34 = 0; e34 < o4; e34++) s4 += i4[e34];
      n3.update(s4, r3, 1);
    }
    function d3(e33, i4, s4, c4) {
      if (s4 === 0) return;
      let u4 = t3.get(`WEBGL_multi_draw`);
      if (u4 === null) for (let t4 = 0; t4 < e33.length; t4++) l3(e33[t4] / o3, i4[t4], c4[t4]);
      else {
        u4.multiDrawElementsInstancedWEBGL(r3, i4, 0, a3, e33, 0, c4, 0, s4);
        let t4 = 0;
        for (let e34 = 0; e34 < s4; e34++) t4 += i4[e34] * c4[e34];
        n3.update(t4, r3, 1);
      }
    }
    this.setMode = i3, this.setIndex = s3, this.render = c3, this.renderInstances = l3, this.renderMultiDraw = u3, this.renderMultiDrawInstances = d3;
  }
  function La(e32) {
    let t3 = { geometries: 0, textures: 0 }, n3 = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
    function r3(t4, r4, i4) {
      switch (n3.calls++, r4) {
        case e32.TRIANGLES:
          n3.triangles += t4 / 3 * i4;
          break;
        case e32.LINES:
          n3.lines += t4 / 2 * i4;
          break;
        case e32.LINE_STRIP:
          n3.lines += i4 * (t4 - 1);
          break;
        case e32.LINE_LOOP:
          n3.lines += i4 * t4;
          break;
        case e32.POINTS:
          n3.points += i4 * t4;
          break;
        default:
          console.error(`THREE.WebGLInfo: Unknown draw mode:`, r4);
          break;
      }
    }
    function i3() {
      n3.calls = 0, n3.triangles = 0, n3.points = 0, n3.lines = 0;
    }
    return { memory: t3, render: n3, programs: null, autoReset: true, reset: i3, update: r3 };
  }
  function Ra(e32, t3, n3) {
    let r3 = /* @__PURE__ */ new WeakMap(), i3 = new wt();
    function a3(a4, o3, s3) {
      let c3 = a4.morphTargetInfluences, l3 = o3.morphAttributes.position || o3.morphAttributes.normal || o3.morphAttributes.color, u3 = l3 === void 0 ? 0 : l3.length, d3 = r3.get(o3);
      if (d3 === void 0 || d3.count !== u3) {
        let v4 = function() {
          g3.dispose(), r3.delete(o3), o3.removeEventListener(`dispose`, v4);
        };
        var v3 = v4;
        d3 !== void 0 && d3.texture.dispose();
        let e33 = o3.morphAttributes.position !== void 0, n4 = o3.morphAttributes.normal !== void 0, a5 = o3.morphAttributes.color !== void 0, s4 = o3.morphAttributes.position || [], c4 = o3.morphAttributes.normal || [], l4 = o3.morphAttributes.color || [], f3 = 0;
        e33 === true && (f3 = 1), n4 === true && (f3 = 2), a5 === true && (f3 = 3);
        let p3 = o3.attributes.position.count * f3, m3 = 1;
        p3 > t3.maxTextureSize && (m3 = Math.ceil(p3 / t3.maxTextureSize), p3 = t3.maxTextureSize);
        let h3 = new Float32Array(p3 * m3 * 4 * u3), g3 = new Dt(h3, p3, m3, u3);
        g3.type = w, g3.needsUpdate = true;
        let _3 = f3 * 4;
        for (let t4 = 0; t4 < u3; t4++) {
          let r4 = s4[t4], o4 = c4[t4], u4 = l4[t4], d4 = p3 * m3 * 4 * t4;
          for (let t5 = 0; t5 < r4.count; t5++) {
            let s5 = t5 * _3;
            e33 === true && (i3.fromBufferAttribute(r4, t5), h3[d4 + s5 + 0] = i3.x, h3[d4 + s5 + 1] = i3.y, h3[d4 + s5 + 2] = i3.z, h3[d4 + s5 + 3] = 0), n4 === true && (i3.fromBufferAttribute(o4, t5), h3[d4 + s5 + 4] = i3.x, h3[d4 + s5 + 5] = i3.y, h3[d4 + s5 + 6] = i3.z, h3[d4 + s5 + 7] = 0), a5 === true && (i3.fromBufferAttribute(u4, t5), h3[d4 + s5 + 8] = i3.x, h3[d4 + s5 + 9] = i3.y, h3[d4 + s5 + 10] = i3.z, h3[d4 + s5 + 11] = u4.itemSize === 4 ? i3.w : 1);
          }
        }
        d3 = { count: u3, texture: g3, size: new U(p3, m3) }, r3.set(o3, d3);
        o3.addEventListener(`dispose`, v4);
      }
      if (a4.isInstancedMesh === true && a4.morphTexture !== null) s3.getUniforms().setValue(e32, `morphTexture`, a4.morphTexture, n3);
      else {
        let t4 = 0;
        for (let e33 = 0; e33 < c3.length; e33++) t4 += c3[e33];
        let n4 = o3.morphTargetsRelative ? 1 : 1 - t4;
        s3.getUniforms().setValue(e32, `morphTargetBaseInfluence`, n4), s3.getUniforms().setValue(e32, `morphTargetInfluences`, c3);
      }
      s3.getUniforms().setValue(e32, `morphTargetsTexture`, d3.texture, n3), s3.getUniforms().setValue(e32, `morphTargetsTextureSize`, d3.size);
    }
    return { update: a3 };
  }
  function za(e32, t3, n3, r3) {
    let i3 = /* @__PURE__ */ new WeakMap();
    function a3(a4) {
      let o4 = r3.render.frame, c3 = a4.geometry, l3 = t3.get(a4, c3);
      if (i3.get(l3) !== o4 && (t3.update(l3), i3.set(l3, o4)), a4.isInstancedMesh && (a4.hasEventListener(`dispose`, s3) === false && a4.addEventListener(`dispose`, s3), i3.get(a4) !== o4 && (n3.update(a4.instanceMatrix, e32.ARRAY_BUFFER), a4.instanceColor !== null && n3.update(a4.instanceColor, e32.ARRAY_BUFFER), i3.set(a4, o4))), a4.isSkinnedMesh) {
        let e33 = a4.skeleton;
        i3.get(e33) !== o4 && (e33.update(), i3.set(e33, o4));
      }
      return l3;
    }
    function o3() {
      i3 = /* @__PURE__ */ new WeakMap();
    }
    function s3(e33) {
      let t4 = e33.target;
      t4.removeEventListener(`dispose`, s3), n3.remove(t4.instanceMatrix), t4.instanceColor !== null && n3.remove(t4.instanceColor);
    }
    return { update: a3, dispose: o3 };
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
  function Xa(e32, t3, n3) {
    let r3 = e32[0];
    if (r3 <= 0 || r3 > 0) return e32;
    let i3 = t3 * n3, a3 = Ga[i3];
    if (a3 === void 0 && (a3 = new Float32Array(i3), Ga[i3] = a3), t3 !== 0) {
      r3.toArray(a3, 0);
      for (let r4 = 1, i4 = 0; r4 !== t3; ++r4) i4 += n3, e32[r4].toArray(a3, i4);
    }
    return a3;
  }
  function Za(e32, t3) {
    if (e32.length !== t3.length) return false;
    for (let n3 = 0, r3 = e32.length; n3 < r3; n3++) if (e32[n3] !== t3[n3]) return false;
    return true;
  }
  function Qa(e32, t3) {
    for (let n3 = 0, r3 = t3.length; n3 < r3; n3++) e32[n3] = t3[n3];
  }
  function $a(e32, t3) {
    let n3 = Ka[t3];
    n3 === void 0 && (n3 = new Int32Array(t3), Ka[t3] = n3);
    for (let r3 = 0; r3 !== t3; ++r3) n3[r3] = e32.allocateTextureUnit();
    return n3;
  }
  function eo(e32, t3) {
    let n3 = this.cache;
    n3[0] !== t3 && (e32.uniform1f(this.addr, t3), n3[0] = t3);
  }
  function to(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y) && (e32.uniform2f(this.addr, t3.x, t3.y), n3[0] = t3.x, n3[1] = t3.y);
    else {
      if (Za(n3, t3)) return;
      e32.uniform2fv(this.addr, t3), Qa(n3, t3);
    }
  }
  function no(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y || n3[2] !== t3.z) && (e32.uniform3f(this.addr, t3.x, t3.y, t3.z), n3[0] = t3.x, n3[1] = t3.y, n3[2] = t3.z);
    else if (t3.r !== void 0) (n3[0] !== t3.r || n3[1] !== t3.g || n3[2] !== t3.b) && (e32.uniform3f(this.addr, t3.r, t3.g, t3.b), n3[0] = t3.r, n3[1] = t3.g, n3[2] = t3.b);
    else {
      if (Za(n3, t3)) return;
      e32.uniform3fv(this.addr, t3), Qa(n3, t3);
    }
  }
  function ro(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y || n3[2] !== t3.z || n3[3] !== t3.w) && (e32.uniform4f(this.addr, t3.x, t3.y, t3.z, t3.w), n3[0] = t3.x, n3[1] = t3.y, n3[2] = t3.z, n3[3] = t3.w);
    else {
      if (Za(n3, t3)) return;
      e32.uniform4fv(this.addr, t3), Qa(n3, t3);
    }
  }
  function io(e32, t3) {
    let n3 = this.cache, r3 = t3.elements;
    if (r3 === void 0) {
      if (Za(n3, t3)) return;
      e32.uniformMatrix2fv(this.addr, false, t3), Qa(n3, t3);
    } else {
      if (Za(n3, r3)) return;
      Ya.set(r3), e32.uniformMatrix2fv(this.addr, false, Ya), Qa(n3, r3);
    }
  }
  function ao(e32, t3) {
    let n3 = this.cache, r3 = t3.elements;
    if (r3 === void 0) {
      if (Za(n3, t3)) return;
      e32.uniformMatrix3fv(this.addr, false, t3), Qa(n3, t3);
    } else {
      if (Za(n3, r3)) return;
      Ja.set(r3), e32.uniformMatrix3fv(this.addr, false, Ja), Qa(n3, r3);
    }
  }
  function oo(e32, t3) {
    let n3 = this.cache, r3 = t3.elements;
    if (r3 === void 0) {
      if (Za(n3, t3)) return;
      e32.uniformMatrix4fv(this.addr, false, t3), Qa(n3, t3);
    } else {
      if (Za(n3, r3)) return;
      qa.set(r3), e32.uniformMatrix4fv(this.addr, false, qa), Qa(n3, r3);
    }
  }
  function so(e32, t3) {
    let n3 = this.cache;
    n3[0] !== t3 && (e32.uniform1i(this.addr, t3), n3[0] = t3);
  }
  function co(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y) && (e32.uniform2i(this.addr, t3.x, t3.y), n3[0] = t3.x, n3[1] = t3.y);
    else {
      if (Za(n3, t3)) return;
      e32.uniform2iv(this.addr, t3), Qa(n3, t3);
    }
  }
  function lo(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y || n3[2] !== t3.z) && (e32.uniform3i(this.addr, t3.x, t3.y, t3.z), n3[0] = t3.x, n3[1] = t3.y, n3[2] = t3.z);
    else {
      if (Za(n3, t3)) return;
      e32.uniform3iv(this.addr, t3), Qa(n3, t3);
    }
  }
  function uo(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y || n3[2] !== t3.z || n3[3] !== t3.w) && (e32.uniform4i(this.addr, t3.x, t3.y, t3.z, t3.w), n3[0] = t3.x, n3[1] = t3.y, n3[2] = t3.z, n3[3] = t3.w);
    else {
      if (Za(n3, t3)) return;
      e32.uniform4iv(this.addr, t3), Qa(n3, t3);
    }
  }
  function fo(e32, t3) {
    let n3 = this.cache;
    n3[0] !== t3 && (e32.uniform1ui(this.addr, t3), n3[0] = t3);
  }
  function po(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y) && (e32.uniform2ui(this.addr, t3.x, t3.y), n3[0] = t3.x, n3[1] = t3.y);
    else {
      if (Za(n3, t3)) return;
      e32.uniform2uiv(this.addr, t3), Qa(n3, t3);
    }
  }
  function mo(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y || n3[2] !== t3.z) && (e32.uniform3ui(this.addr, t3.x, t3.y, t3.z), n3[0] = t3.x, n3[1] = t3.y, n3[2] = t3.z);
    else {
      if (Za(n3, t3)) return;
      e32.uniform3uiv(this.addr, t3), Qa(n3, t3);
    }
  }
  function ho(e32, t3) {
    let n3 = this.cache;
    if (t3.x !== void 0) (n3[0] !== t3.x || n3[1] !== t3.y || n3[2] !== t3.z || n3[3] !== t3.w) && (e32.uniform4ui(this.addr, t3.x, t3.y, t3.z, t3.w), n3[0] = t3.x, n3[1] = t3.y, n3[2] = t3.z, n3[3] = t3.w);
    else {
      if (Za(n3, t3)) return;
      e32.uniform4uiv(this.addr, t3), Qa(n3, t3);
    }
  }
  function go(e32, t3, n3) {
    let r3 = this.cache, i3 = n3.allocateTextureUnit();
    r3[0] !== i3 && (e32.uniform1i(this.addr, i3), r3[0] = i3);
    let a3;
    this.type === e32.SAMPLER_2D_SHADOW ? (Va.compareFunction = 515, a3 = Va) : a3 = Ba, n3.setTexture2D(t3 || a3, i3);
  }
  function _o(e32, t3, n3) {
    let r3 = this.cache, i3 = n3.allocateTextureUnit();
    r3[0] !== i3 && (e32.uniform1i(this.addr, i3), r3[0] = i3), n3.setTexture3D(t3 || Ua, i3);
  }
  function vo(e32, t3, n3) {
    let r3 = this.cache, i3 = n3.allocateTextureUnit();
    r3[0] !== i3 && (e32.uniform1i(this.addr, i3), r3[0] = i3), n3.setTextureCube(t3 || Wa, i3);
  }
  function yo(e32, t3, n3) {
    let r3 = this.cache, i3 = n3.allocateTextureUnit();
    r3[0] !== i3 && (e32.uniform1i(this.addr, i3), r3[0] = i3), n3.setTexture2DArray(t3 || Ha, i3);
  }
  function bo(e32) {
    switch (e32) {
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
  function xo(e32, t3) {
    e32.uniform1fv(this.addr, t3);
  }
  function So(e32, t3) {
    let n3 = Xa(t3, this.size, 2);
    e32.uniform2fv(this.addr, n3);
  }
  function Co(e32, t3) {
    let n3 = Xa(t3, this.size, 3);
    e32.uniform3fv(this.addr, n3);
  }
  function wo(e32, t3) {
    let n3 = Xa(t3, this.size, 4);
    e32.uniform4fv(this.addr, n3);
  }
  function To(e32, t3) {
    let n3 = Xa(t3, this.size, 4);
    e32.uniformMatrix2fv(this.addr, false, n3);
  }
  function Eo(e32, t3) {
    let n3 = Xa(t3, this.size, 9);
    e32.uniformMatrix3fv(this.addr, false, n3);
  }
  function Do(e32, t3) {
    let n3 = Xa(t3, this.size, 16);
    e32.uniformMatrix4fv(this.addr, false, n3);
  }
  function Oo(e32, t3) {
    e32.uniform1iv(this.addr, t3);
  }
  function ko(e32, t3) {
    e32.uniform2iv(this.addr, t3);
  }
  function Ao(e32, t3) {
    e32.uniform3iv(this.addr, t3);
  }
  function jo(e32, t3) {
    e32.uniform4iv(this.addr, t3);
  }
  function Mo(e32, t3) {
    e32.uniform1uiv(this.addr, t3);
  }
  function No(e32, t3) {
    e32.uniform2uiv(this.addr, t3);
  }
  function Po(e32, t3) {
    e32.uniform3uiv(this.addr, t3);
  }
  function Fo(e32, t3) {
    e32.uniform4uiv(this.addr, t3);
  }
  function Io(e32, t3, n3) {
    let r3 = this.cache, i3 = t3.length, a3 = $a(n3, i3);
    Za(r3, a3) || (e32.uniform1iv(this.addr, a3), Qa(r3, a3));
    for (let e33 = 0; e33 !== i3; ++e33) n3.setTexture2D(t3[e33] || Ba, a3[e33]);
  }
  function Lo(e32, t3, n3) {
    let r3 = this.cache, i3 = t3.length, a3 = $a(n3, i3);
    Za(r3, a3) || (e32.uniform1iv(this.addr, a3), Qa(r3, a3));
    for (let e33 = 0; e33 !== i3; ++e33) n3.setTexture3D(t3[e33] || Ua, a3[e33]);
  }
  function Ro(e32, t3, n3) {
    let r3 = this.cache, i3 = t3.length, a3 = $a(n3, i3);
    Za(r3, a3) || (e32.uniform1iv(this.addr, a3), Qa(r3, a3));
    for (let e33 = 0; e33 !== i3; ++e33) n3.setTextureCube(t3[e33] || Wa, a3[e33]);
  }
  function zo(e32, t3, n3) {
    let r3 = this.cache, i3 = t3.length, a3 = $a(n3, i3);
    Za(r3, a3) || (e32.uniform1iv(this.addr, a3), Qa(r3, a3));
    for (let e33 = 0; e33 !== i3; ++e33) n3.setTexture2DArray(t3[e33] || Ha, a3[e33]);
  }
  function Bo(e32) {
    switch (e32) {
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
    constructor(e32, t3, n3) {
      this.id = e32, this.addr = n3, this.cache = [], this.type = t3.type, this.setValue = bo(t3.type);
    }
  };
  var Ho = class {
    constructor(e32, t3, n3) {
      this.id = e32, this.addr = n3, this.cache = [], this.type = t3.type, this.size = t3.size, this.setValue = Bo(t3.type);
    }
  };
  var Uo = class {
    constructor(e32) {
      this.id = e32, this.seq = [], this.map = {};
    }
    setValue(e32, t3, n3) {
      let r3 = this.seq;
      for (let i3 = 0, a3 = r3.length; i3 !== a3; ++i3) {
        let a4 = r3[i3];
        a4.setValue(e32, t3[a4.id], n3);
      }
    }
  };
  var Wo = /(\w+)(\])?(\[|\.)?/g;
  function Go(e32, t3) {
    e32.seq.push(t3), e32.map[t3.id] = t3;
  }
  function Ko(e32, t3, n3) {
    let r3 = e32.name, i3 = r3.length;
    for (Wo.lastIndex = 0; ; ) {
      let a3 = Wo.exec(r3), o3 = Wo.lastIndex, s3 = a3[1], c3 = a3[2] === `]`, l3 = a3[3];
      if (c3 && (s3 |= 0), l3 === void 0 || l3 === `[` && o3 + 2 === i3) {
        Go(n3, l3 === void 0 ? new Vo(s3, e32, t3) : new Ho(s3, e32, t3));
        break;
      } else {
        let e33 = n3.map[s3];
        e33 === void 0 && (e33 = new Uo(s3), Go(n3, e33)), n3 = e33;
      }
    }
  }
  var qo = class {
    constructor(e32, t3) {
      this.seq = [], this.map = {};
      let n3 = e32.getProgramParameter(t3, e32.ACTIVE_UNIFORMS);
      for (let r3 = 0; r3 < n3; ++r3) {
        let n4 = e32.getActiveUniform(t3, r3);
        Ko(n4, e32.getUniformLocation(t3, n4.name), this);
      }
    }
    setValue(e32, t3, n3, r3) {
      let i3 = this.map[t3];
      i3 !== void 0 && i3.setValue(e32, n3, r3);
    }
    setOptional(e32, t3, n3) {
      let r3 = t3[n3];
      r3 !== void 0 && this.setValue(e32, n3, r3);
    }
    static upload(e32, t3, n3, r3) {
      for (let i3 = 0, a3 = t3.length; i3 !== a3; ++i3) {
        let a4 = t3[i3], o3 = n3[a4.id];
        o3.needsUpdate !== false && a4.setValue(e32, o3.value, r3);
      }
    }
    static seqWithValue(e32, t3) {
      let n3 = [];
      for (let r3 = 0, i3 = e32.length; r3 !== i3; ++r3) {
        let i4 = e32[r3];
        i4.id in t3 && n3.push(i4);
      }
      return n3;
    }
  };
  function Jo(e32, t3, n3) {
    let r3 = e32.createShader(t3);
    return e32.shaderSource(r3, n3), e32.compileShader(r3), r3;
  }
  var Yo = 37297;
  var Xo = 0;
  function Zo(e32, t3) {
    let n3 = e32.split(`
`), r3 = [], i3 = Math.max(t3 - 6, 0), a3 = Math.min(t3 + 6, n3.length);
    for (let e33 = i3; e33 < a3; e33++) {
      let i4 = e33 + 1;
      r3.push(`${i4 === t3 ? `>` : ` `} ${i4}: ${n3[e33]}`);
    }
    return r3.join(`
`);
  }
  var Qo = new G();
  function $o(e32) {
    K._getMatrix(Qo, K.workingColorSpace, e32);
    let t3 = `mat3( ${Qo.elements.map((e33) => e33.toFixed(4))} )`;
    switch (K.getTransfer(e32)) {
      case Ve:
        return [t3, `LinearTransferOETF`];
      case He:
        return [t3, `sRGBTransferOETF`];
      default:
        return console.warn(`THREE.WebGLProgram: Unsupported color space: `, e32), [t3, `LinearTransferOETF`];
    }
  }
  function es(e32, t3, n3) {
    let r3 = e32.getShaderParameter(t3, e32.COMPILE_STATUS), i3 = (e32.getShaderInfoLog(t3) || ``).trim();
    if (r3 && i3 === ``) return ``;
    let a3 = /ERROR: 0:(\d+)/.exec(i3);
    if (a3) {
      let r4 = parseInt(a3[1]);
      return n3.toUpperCase() + `

` + i3 + `

` + Zo(e32.getShaderSource(t3), r4);
    } else return i3;
  }
  function ts(e32, t3) {
    let n3 = $o(t3);
    return [`vec4 ${e32}( vec4 value ) {`, `	return ${n3[1]}( vec4( value.rgb * ${n3[0]}, value.a ) );`, `}`].join(`
`);
  }
  function ns(e32, t3) {
    let n3;
    switch (t3) {
      case 1:
        n3 = `Linear`;
        break;
      case 2:
        n3 = `Reinhard`;
        break;
      case 3:
        n3 = `Cineon`;
        break;
      case 4:
        n3 = `ACESFilmic`;
        break;
      case 6:
        n3 = `AgX`;
        break;
      case 7:
        n3 = `Neutral`;
        break;
      case 5:
        n3 = `Custom`;
        break;
      default:
        console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`, t3), n3 = `Linear`;
    }
    return `vec3 ` + e32 + `( vec3 color ) { return ` + n3 + `ToneMapping( color ); }`;
  }
  var rs = new W();
  function is() {
    return K.getLuminanceCoefficients(rs), [`float luminance( const in vec3 rgb ) {`, `	const vec3 weights = vec3( ${rs.x.toFixed(4)}, ${rs.y.toFixed(4)}, ${rs.z.toFixed(4)} );`, `	return dot( weights, rgb );`, `}`].join(`
`);
  }
  function as(e32) {
    return [e32.extensionClipCullDistance ? `#extension GL_ANGLE_clip_cull_distance : require` : ``, e32.extensionMultiDraw ? `#extension GL_ANGLE_multi_draw : require` : ``].filter(cs).join(`
`);
  }
  function os(e32) {
    let t3 = [];
    for (let n3 in e32) {
      let r3 = e32[n3];
      r3 !== false && t3.push(`#define ` + n3 + ` ` + r3);
    }
    return t3.join(`
`);
  }
  function ss(e32, t3) {
    let n3 = {}, r3 = e32.getProgramParameter(t3, e32.ACTIVE_ATTRIBUTES);
    for (let i3 = 0; i3 < r3; i3++) {
      let r4 = e32.getActiveAttrib(t3, i3), a3 = r4.name, o3 = 1;
      r4.type === e32.FLOAT_MAT2 && (o3 = 2), r4.type === e32.FLOAT_MAT3 && (o3 = 3), r4.type === e32.FLOAT_MAT4 && (o3 = 4), n3[a3] = { type: r4.type, location: e32.getAttribLocation(t3, a3), locationSize: o3 };
    }
    return n3;
  }
  function cs(e32) {
    return e32 !== ``;
  }
  function ls(e32, t3) {
    let n3 = t3.numSpotLightShadows + t3.numSpotLightMaps - t3.numSpotLightShadowsWithMaps;
    return e32.replace(/NUM_DIR_LIGHTS/g, t3.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t3.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t3.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n3).replace(/NUM_RECT_AREA_LIGHTS/g, t3.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t3.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t3.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t3.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t3.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t3.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t3.numPointLightShadows);
  }
  function us(e32, t3) {
    return e32.replace(/NUM_CLIPPING_PLANES/g, t3.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t3.numClippingPlanes - t3.numClipIntersection);
  }
  var ds = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function fs(e32) {
    return e32.replace(ds, ms);
  }
  var ps = /* @__PURE__ */ new Map();
  function ms(e32, t3) {
    let n3 = Y[t3];
    if (n3 === void 0) {
      let e33 = ps.get(t3);
      if (e33 !== void 0) n3 = Y[e33], console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`, t3, e33);
      else throw Error(`Can not resolve #include <` + t3 + `>`);
    }
    return fs(n3);
  }
  var hs = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
  function gs(e32) {
    return e32.replace(hs, _s);
  }
  function _s(e32, t3, n3, r3) {
    let i3 = ``;
    for (let e33 = parseInt(t3); e33 < parseInt(n3); e33++) i3 += r3.replace(/\[\s*i\s*\]/g, `[ ` + e33 + ` ]`).replace(/UNROLLED_LOOP_INDEX/g, e33);
    return i3;
  }
  function vs(e32) {
    let t3 = `precision ${e32.precision} float;
	precision ${e32.precision} int;
	precision ${e32.precision} sampler2D;
	precision ${e32.precision} samplerCube;
	precision ${e32.precision} sampler3D;
	precision ${e32.precision} sampler2DArray;
	precision ${e32.precision} sampler2DShadow;
	precision ${e32.precision} samplerCubeShadow;
	precision ${e32.precision} sampler2DArrayShadow;
	precision ${e32.precision} isampler2D;
	precision ${e32.precision} isampler3D;
	precision ${e32.precision} isamplerCube;
	precision ${e32.precision} isampler2DArray;
	precision ${e32.precision} usampler2D;
	precision ${e32.precision} usampler3D;
	precision ${e32.precision} usamplerCube;
	precision ${e32.precision} usampler2DArray;
	`;
    return e32.precision === `highp` ? t3 += `
#define HIGH_PRECISION` : e32.precision === `mediump` ? t3 += `
#define MEDIUM_PRECISION` : e32.precision === `lowp` && (t3 += `
#define LOW_PRECISION`), t3;
  }
  function ys(e32) {
    let t3 = `SHADOWMAP_TYPE_BASIC`;
    return e32.shadowMapType === 1 ? t3 = `SHADOWMAP_TYPE_PCF` : e32.shadowMapType === 2 ? t3 = `SHADOWMAP_TYPE_PCF_SOFT` : e32.shadowMapType === 3 && (t3 = `SHADOWMAP_TYPE_VSM`), t3;
  }
  function bs(e32) {
    let t3 = `ENVMAP_TYPE_CUBE`;
    if (e32.envMap) switch (e32.envMapMode) {
      case 301:
      case 302:
        t3 = `ENVMAP_TYPE_CUBE`;
        break;
      case 306:
        t3 = `ENVMAP_TYPE_CUBE_UV`;
        break;
    }
    return t3;
  }
  function xs(e32) {
    let t3 = `ENVMAP_MODE_REFLECTION`;
    if (e32.envMap) switch (e32.envMapMode) {
      case 302:
        t3 = `ENVMAP_MODE_REFRACTION`;
        break;
    }
    return t3;
  }
  function Ss(e32) {
    let t3 = `ENVMAP_BLENDING_NONE`;
    if (e32.envMap) switch (e32.combine) {
      case 0:
        t3 = `ENVMAP_BLENDING_MULTIPLY`;
        break;
      case 1:
        t3 = `ENVMAP_BLENDING_MIX`;
        break;
      case 2:
        t3 = `ENVMAP_BLENDING_ADD`;
        break;
    }
    return t3;
  }
  function Cs(e32) {
    let t3 = e32.envMapCubeUVHeight;
    if (t3 === null) return null;
    let n3 = Math.log2(t3) - 2, r3 = 1 / t3;
    return { texelWidth: 1 / (3 * Math.max(2 ** n3, 112)), texelHeight: r3, maxMip: n3 };
  }
  function ws(e32, t3, n3, r3) {
    let i3 = e32.getContext(), a3 = n3.defines, o3 = n3.vertexShader, s3 = n3.fragmentShader, c3 = ys(n3), l3 = bs(n3), u3 = xs(n3), d3 = Ss(n3), f3 = Cs(n3), p3 = as(n3), m3 = os(a3), h3 = i3.createProgram(), g3, _3, v3 = n3.glslVersion ? `#version ` + n3.glslVersion + `
` : ``;
    n3.isRawShaderMaterial ? (g3 = [`#define SHADER_TYPE ` + n3.shaderType, `#define SHADER_NAME ` + n3.shaderName, m3].filter(cs).join(`
`), g3.length > 0 && (g3 += `
`), _3 = [`#define SHADER_TYPE ` + n3.shaderType, `#define SHADER_NAME ` + n3.shaderName, m3].filter(cs).join(`
`), _3.length > 0 && (_3 += `
`)) : (g3 = [vs(n3), `#define SHADER_TYPE ` + n3.shaderType, `#define SHADER_NAME ` + n3.shaderName, m3, n3.extensionClipCullDistance ? `#define USE_CLIP_DISTANCE` : ``, n3.batching ? `#define USE_BATCHING` : ``, n3.batchingColor ? `#define USE_BATCHING_COLOR` : ``, n3.instancing ? `#define USE_INSTANCING` : ``, n3.instancingColor ? `#define USE_INSTANCING_COLOR` : ``, n3.instancingMorph ? `#define USE_INSTANCING_MORPH` : ``, n3.useFog && n3.fog ? `#define USE_FOG` : ``, n3.useFog && n3.fogExp2 ? `#define FOG_EXP2` : ``, n3.map ? `#define USE_MAP` : ``, n3.envMap ? `#define USE_ENVMAP` : ``, n3.envMap ? `#define ` + u3 : ``, n3.lightMap ? `#define USE_LIGHTMAP` : ``, n3.aoMap ? `#define USE_AOMAP` : ``, n3.bumpMap ? `#define USE_BUMPMAP` : ``, n3.normalMap ? `#define USE_NORMALMAP` : ``, n3.normalMapObjectSpace ? `#define USE_NORMALMAP_OBJECTSPACE` : ``, n3.normalMapTangentSpace ? `#define USE_NORMALMAP_TANGENTSPACE` : ``, n3.displacementMap ? `#define USE_DISPLACEMENTMAP` : ``, n3.emissiveMap ? `#define USE_EMISSIVEMAP` : ``, n3.anisotropy ? `#define USE_ANISOTROPY` : ``, n3.anisotropyMap ? `#define USE_ANISOTROPYMAP` : ``, n3.clearcoatMap ? `#define USE_CLEARCOATMAP` : ``, n3.clearcoatRoughnessMap ? `#define USE_CLEARCOAT_ROUGHNESSMAP` : ``, n3.clearcoatNormalMap ? `#define USE_CLEARCOAT_NORMALMAP` : ``, n3.iridescenceMap ? `#define USE_IRIDESCENCEMAP` : ``, n3.iridescenceThicknessMap ? `#define USE_IRIDESCENCE_THICKNESSMAP` : ``, n3.specularMap ? `#define USE_SPECULARMAP` : ``, n3.specularColorMap ? `#define USE_SPECULAR_COLORMAP` : ``, n3.specularIntensityMap ? `#define USE_SPECULAR_INTENSITYMAP` : ``, n3.roughnessMap ? `#define USE_ROUGHNESSMAP` : ``, n3.metalnessMap ? `#define USE_METALNESSMAP` : ``, n3.alphaMap ? `#define USE_ALPHAMAP` : ``, n3.alphaHash ? `#define USE_ALPHAHASH` : ``, n3.transmission ? `#define USE_TRANSMISSION` : ``, n3.transmissionMap ? `#define USE_TRANSMISSIONMAP` : ``, n3.thicknessMap ? `#define USE_THICKNESSMAP` : ``, n3.sheenColorMap ? `#define USE_SHEEN_COLORMAP` : ``, n3.sheenRoughnessMap ? `#define USE_SHEEN_ROUGHNESSMAP` : ``, n3.mapUv ? `#define MAP_UV ` + n3.mapUv : ``, n3.alphaMapUv ? `#define ALPHAMAP_UV ` + n3.alphaMapUv : ``, n3.lightMapUv ? `#define LIGHTMAP_UV ` + n3.lightMapUv : ``, n3.aoMapUv ? `#define AOMAP_UV ` + n3.aoMapUv : ``, n3.emissiveMapUv ? `#define EMISSIVEMAP_UV ` + n3.emissiveMapUv : ``, n3.bumpMapUv ? `#define BUMPMAP_UV ` + n3.bumpMapUv : ``, n3.normalMapUv ? `#define NORMALMAP_UV ` + n3.normalMapUv : ``, n3.displacementMapUv ? `#define DISPLACEMENTMAP_UV ` + n3.displacementMapUv : ``, n3.metalnessMapUv ? `#define METALNESSMAP_UV ` + n3.metalnessMapUv : ``, n3.roughnessMapUv ? `#define ROUGHNESSMAP_UV ` + n3.roughnessMapUv : ``, n3.anisotropyMapUv ? `#define ANISOTROPYMAP_UV ` + n3.anisotropyMapUv : ``, n3.clearcoatMapUv ? `#define CLEARCOATMAP_UV ` + n3.clearcoatMapUv : ``, n3.clearcoatNormalMapUv ? `#define CLEARCOAT_NORMALMAP_UV ` + n3.clearcoatNormalMapUv : ``, n3.clearcoatRoughnessMapUv ? `#define CLEARCOAT_ROUGHNESSMAP_UV ` + n3.clearcoatRoughnessMapUv : ``, n3.iridescenceMapUv ? `#define IRIDESCENCEMAP_UV ` + n3.iridescenceMapUv : ``, n3.iridescenceThicknessMapUv ? `#define IRIDESCENCE_THICKNESSMAP_UV ` + n3.iridescenceThicknessMapUv : ``, n3.sheenColorMapUv ? `#define SHEEN_COLORMAP_UV ` + n3.sheenColorMapUv : ``, n3.sheenRoughnessMapUv ? `#define SHEEN_ROUGHNESSMAP_UV ` + n3.sheenRoughnessMapUv : ``, n3.specularMapUv ? `#define SPECULARMAP_UV ` + n3.specularMapUv : ``, n3.specularColorMapUv ? `#define SPECULAR_COLORMAP_UV ` + n3.specularColorMapUv : ``, n3.specularIntensityMapUv ? `#define SPECULAR_INTENSITYMAP_UV ` + n3.specularIntensityMapUv : ``, n3.transmissionMapUv ? `#define TRANSMISSIONMAP_UV ` + n3.transmissionMapUv : ``, n3.thicknessMapUv ? `#define THICKNESSMAP_UV ` + n3.thicknessMapUv : ``, n3.vertexTangents && n3.flatShading === false ? `#define USE_TANGENT` : ``, n3.vertexColors ? `#define USE_COLOR` : ``, n3.vertexAlphas ? `#define USE_COLOR_ALPHA` : ``, n3.vertexUv1s ? `#define USE_UV1` : ``, n3.vertexUv2s ? `#define USE_UV2` : ``, n3.vertexUv3s ? `#define USE_UV3` : ``, n3.pointsUvs ? `#define USE_POINTS_UV` : ``, n3.flatShading ? `#define FLAT_SHADED` : ``, n3.skinning ? `#define USE_SKINNING` : ``, n3.morphTargets ? `#define USE_MORPHTARGETS` : ``, n3.morphNormals && n3.flatShading === false ? `#define USE_MORPHNORMALS` : ``, n3.morphColors ? `#define USE_MORPHCOLORS` : ``, n3.morphTargetsCount > 0 ? `#define MORPHTARGETS_TEXTURE_STRIDE ` + n3.morphTextureStride : ``, n3.morphTargetsCount > 0 ? `#define MORPHTARGETS_COUNT ` + n3.morphTargetsCount : ``, n3.doubleSided ? `#define DOUBLE_SIDED` : ``, n3.flipSided ? `#define FLIP_SIDED` : ``, n3.shadowMapEnabled ? `#define USE_SHADOWMAP` : ``, n3.shadowMapEnabled ? `#define ` + c3 : ``, n3.sizeAttenuation ? `#define USE_SIZEATTENUATION` : ``, n3.numLightProbes > 0 ? `#define USE_LIGHT_PROBES` : ``, n3.logarithmicDepthBuffer ? `#define USE_LOGARITHMIC_DEPTH_BUFFER` : ``, n3.reversedDepthBuffer ? `#define USE_REVERSED_DEPTH_BUFFER` : ``, `uniform mat4 modelMatrix;`, `uniform mat4 modelViewMatrix;`, `uniform mat4 projectionMatrix;`, `uniform mat4 viewMatrix;`, `uniform mat3 normalMatrix;`, `uniform vec3 cameraPosition;`, `uniform bool isOrthographic;`, `#ifdef USE_INSTANCING`, `	attribute mat4 instanceMatrix;`, `#endif`, `#ifdef USE_INSTANCING_COLOR`, `	attribute vec3 instanceColor;`, `#endif`, `#ifdef USE_INSTANCING_MORPH`, `	uniform sampler2D morphTexture;`, `#endif`, `attribute vec3 position;`, `attribute vec3 normal;`, `attribute vec2 uv;`, `#ifdef USE_UV1`, `	attribute vec2 uv1;`, `#endif`, `#ifdef USE_UV2`, `	attribute vec2 uv2;`, `#endif`, `#ifdef USE_UV3`, `	attribute vec2 uv3;`, `#endif`, `#ifdef USE_TANGENT`, `	attribute vec4 tangent;`, `#endif`, `#if defined( USE_COLOR_ALPHA )`, `	attribute vec4 color;`, `#elif defined( USE_COLOR )`, `	attribute vec3 color;`, `#endif`, `#ifdef USE_SKINNING`, `	attribute vec4 skinIndex;`, `	attribute vec4 skinWeight;`, `#endif`, `
`].filter(cs).join(`
`), _3 = [vs(n3), `#define SHADER_TYPE ` + n3.shaderType, `#define SHADER_NAME ` + n3.shaderName, m3, n3.useFog && n3.fog ? `#define USE_FOG` : ``, n3.useFog && n3.fogExp2 ? `#define FOG_EXP2` : ``, n3.alphaToCoverage ? `#define ALPHA_TO_COVERAGE` : ``, n3.map ? `#define USE_MAP` : ``, n3.matcap ? `#define USE_MATCAP` : ``, n3.envMap ? `#define USE_ENVMAP` : ``, n3.envMap ? `#define ` + l3 : ``, n3.envMap ? `#define ` + u3 : ``, n3.envMap ? `#define ` + d3 : ``, f3 ? `#define CUBEUV_TEXEL_WIDTH ` + f3.texelWidth : ``, f3 ? `#define CUBEUV_TEXEL_HEIGHT ` + f3.texelHeight : ``, f3 ? `#define CUBEUV_MAX_MIP ` + f3.maxMip + `.0` : ``, n3.lightMap ? `#define USE_LIGHTMAP` : ``, n3.aoMap ? `#define USE_AOMAP` : ``, n3.bumpMap ? `#define USE_BUMPMAP` : ``, n3.normalMap ? `#define USE_NORMALMAP` : ``, n3.normalMapObjectSpace ? `#define USE_NORMALMAP_OBJECTSPACE` : ``, n3.normalMapTangentSpace ? `#define USE_NORMALMAP_TANGENTSPACE` : ``, n3.emissiveMap ? `#define USE_EMISSIVEMAP` : ``, n3.anisotropy ? `#define USE_ANISOTROPY` : ``, n3.anisotropyMap ? `#define USE_ANISOTROPYMAP` : ``, n3.clearcoat ? `#define USE_CLEARCOAT` : ``, n3.clearcoatMap ? `#define USE_CLEARCOATMAP` : ``, n3.clearcoatRoughnessMap ? `#define USE_CLEARCOAT_ROUGHNESSMAP` : ``, n3.clearcoatNormalMap ? `#define USE_CLEARCOAT_NORMALMAP` : ``, n3.dispersion ? `#define USE_DISPERSION` : ``, n3.iridescence ? `#define USE_IRIDESCENCE` : ``, n3.iridescenceMap ? `#define USE_IRIDESCENCEMAP` : ``, n3.iridescenceThicknessMap ? `#define USE_IRIDESCENCE_THICKNESSMAP` : ``, n3.specularMap ? `#define USE_SPECULARMAP` : ``, n3.specularColorMap ? `#define USE_SPECULAR_COLORMAP` : ``, n3.specularIntensityMap ? `#define USE_SPECULAR_INTENSITYMAP` : ``, n3.roughnessMap ? `#define USE_ROUGHNESSMAP` : ``, n3.metalnessMap ? `#define USE_METALNESSMAP` : ``, n3.alphaMap ? `#define USE_ALPHAMAP` : ``, n3.alphaTest ? `#define USE_ALPHATEST` : ``, n3.alphaHash ? `#define USE_ALPHAHASH` : ``, n3.sheen ? `#define USE_SHEEN` : ``, n3.sheenColorMap ? `#define USE_SHEEN_COLORMAP` : ``, n3.sheenRoughnessMap ? `#define USE_SHEEN_ROUGHNESSMAP` : ``, n3.transmission ? `#define USE_TRANSMISSION` : ``, n3.transmissionMap ? `#define USE_TRANSMISSIONMAP` : ``, n3.thicknessMap ? `#define USE_THICKNESSMAP` : ``, n3.vertexTangents && n3.flatShading === false ? `#define USE_TANGENT` : ``, n3.vertexColors || n3.instancingColor || n3.batchingColor ? `#define USE_COLOR` : ``, n3.vertexAlphas ? `#define USE_COLOR_ALPHA` : ``, n3.vertexUv1s ? `#define USE_UV1` : ``, n3.vertexUv2s ? `#define USE_UV2` : ``, n3.vertexUv3s ? `#define USE_UV3` : ``, n3.pointsUvs ? `#define USE_POINTS_UV` : ``, n3.gradientMap ? `#define USE_GRADIENTMAP` : ``, n3.flatShading ? `#define FLAT_SHADED` : ``, n3.doubleSided ? `#define DOUBLE_SIDED` : ``, n3.flipSided ? `#define FLIP_SIDED` : ``, n3.shadowMapEnabled ? `#define USE_SHADOWMAP` : ``, n3.shadowMapEnabled ? `#define ` + c3 : ``, n3.premultipliedAlpha ? `#define PREMULTIPLIED_ALPHA` : ``, n3.numLightProbes > 0 ? `#define USE_LIGHT_PROBES` : ``, n3.decodeVideoTexture ? `#define DECODE_VIDEO_TEXTURE` : ``, n3.decodeVideoTextureEmissive ? `#define DECODE_VIDEO_TEXTURE_EMISSIVE` : ``, n3.logarithmicDepthBuffer ? `#define USE_LOGARITHMIC_DEPTH_BUFFER` : ``, n3.reversedDepthBuffer ? `#define USE_REVERSED_DEPTH_BUFFER` : ``, `uniform mat4 viewMatrix;`, `uniform vec3 cameraPosition;`, `uniform bool isOrthographic;`, n3.toneMapping === 0 ? `` : `#define TONE_MAPPING`, n3.toneMapping === 0 ? `` : Y.tonemapping_pars_fragment, n3.toneMapping === 0 ? `` : ns(`toneMapping`, n3.toneMapping), n3.dithering ? `#define DITHERING` : ``, n3.opaque ? `#define OPAQUE` : ``, Y.colorspace_pars_fragment, ts(`linearToOutputTexel`, n3.outputColorSpace), is(), n3.useDepthPacking ? `#define DEPTH_PACKING ` + n3.depthPacking : ``, `
`].filter(cs).join(`
`)), o3 = fs(o3), o3 = ls(o3, n3), o3 = us(o3, n3), s3 = fs(s3), s3 = ls(s3, n3), s3 = us(s3, n3), o3 = gs(o3), s3 = gs(s3), n3.isRawShaderMaterial !== true && (v3 = `#version 300 es
`, g3 = [p3, `#define attribute in`, `#define varying out`, `#define texture2D texture`].join(`
`) + `
` + g3, _3 = [`#define varying in`, n3.glslVersion === `300 es` ? `` : `layout(location = 0) out highp vec4 pc_fragColor;`, n3.glslVersion === `300 es` ? `` : `#define gl_FragColor pc_fragColor`, `#define gl_FragDepthEXT gl_FragDepth`, `#define texture2D texture`, `#define textureCube texture`, `#define texture2DProj textureProj`, `#define texture2DLodEXT textureLod`, `#define texture2DProjLodEXT textureProjLod`, `#define textureCubeLodEXT textureLod`, `#define texture2DGradEXT textureGrad`, `#define texture2DProjGradEXT textureProjGrad`, `#define textureCubeGradEXT textureGrad`].join(`
`) + `
` + _3);
    let y3 = v3 + g3 + o3, b3 = v3 + _3 + s3, x3 = Jo(i3, i3.VERTEX_SHADER, y3), S3 = Jo(i3, i3.FRAGMENT_SHADER, b3);
    i3.attachShader(h3, x3), i3.attachShader(h3, S3), n3.index0AttributeName === void 0 ? n3.morphTargets === true && i3.bindAttribLocation(h3, 0, `position`) : i3.bindAttribLocation(h3, 0, n3.index0AttributeName), i3.linkProgram(h3);
    function C3(t4) {
      if (e32.debug.checkShaderErrors) {
        let n4 = i3.getProgramInfoLog(h3) || ``, r4 = i3.getShaderInfoLog(x3) || ``, a4 = i3.getShaderInfoLog(S3) || ``, o4 = n4.trim(), s4 = r4.trim(), c4 = a4.trim(), l4 = true, u4 = true;
        if (i3.getProgramParameter(h3, i3.LINK_STATUS) === false) if (l4 = false, typeof e32.debug.onShaderError == `function`) e32.debug.onShaderError(i3, h3, x3, S3);
        else {
          let e33 = es(i3, x3, `vertex`), n5 = es(i3, S3, `fragment`);
          console.error(`THREE.WebGLProgram: Shader Error ` + i3.getError() + ` - VALIDATE_STATUS ` + i3.getProgramParameter(h3, i3.VALIDATE_STATUS) + `

Material Name: ` + t4.name + `
Material Type: ` + t4.type + `

Program Info Log: ` + o4 + `
` + e33 + `
` + n5);
        }
        else o4 === `` ? (s4 === `` || c4 === ``) && (u4 = false) : console.warn(`THREE.WebGLProgram: Program Info Log:`, o4);
        u4 && (t4.diagnostics = { runnable: l4, programLog: o4, vertexShader: { log: s4, prefix: g3 }, fragmentShader: { log: c4, prefix: _3 } });
      }
      i3.deleteShader(x3), i3.deleteShader(S3), w3 = new qo(i3, h3), T3 = ss(i3, h3);
    }
    let w3;
    this.getUniforms = function() {
      return w3 === void 0 && C3(this), w3;
    };
    let T3;
    this.getAttributes = function() {
      return T3 === void 0 && C3(this), T3;
    };
    let E3 = n3.rendererExtensionParallelShaderCompile === false;
    return this.isReady = function() {
      return E3 === false && (E3 = i3.getProgramParameter(h3, Yo)), E3;
    }, this.destroy = function() {
      r3.releaseStatesOfProgram(this), i3.deleteProgram(h3), this.program = void 0;
    }, this.type = n3.shaderType, this.name = n3.shaderName, this.id = Xo++, this.cacheKey = t3, this.usedTimes = 1, this.program = h3, this.vertexShader = x3, this.fragmentShader = S3, this;
  }
  var Ts = 0;
  var Es = class {
    constructor() {
      this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
    }
    update(e32) {
      let t3 = e32.vertexShader, n3 = e32.fragmentShader, r3 = this._getShaderStage(t3), i3 = this._getShaderStage(n3), a3 = this._getShaderCacheForMaterial(e32);
      return a3.has(r3) === false && (a3.add(r3), r3.usedTimes++), a3.has(i3) === false && (a3.add(i3), i3.usedTimes++), this;
    }
    remove(e32) {
      let t3 = this.materialCache.get(e32);
      for (let e33 of t3) e33.usedTimes--, e33.usedTimes === 0 && this.shaderCache.delete(e33.code);
      return this.materialCache.delete(e32), this;
    }
    getVertexShaderID(e32) {
      return this._getShaderStage(e32.vertexShader).id;
    }
    getFragmentShaderID(e32) {
      return this._getShaderStage(e32.fragmentShader).id;
    }
    dispose() {
      this.shaderCache.clear(), this.materialCache.clear();
    }
    _getShaderCacheForMaterial(e32) {
      let t3 = this.materialCache, n3 = t3.get(e32);
      return n3 === void 0 && (n3 = /* @__PURE__ */ new Set(), t3.set(e32, n3)), n3;
    }
    _getShaderStage(e32) {
      let t3 = this.shaderCache, n3 = t3.get(e32);
      return n3 === void 0 && (n3 = new Ds(e32), t3.set(e32, n3)), n3;
    }
  };
  var Ds = class {
    constructor(e32) {
      this.id = Ts++, this.code = e32, this.usedTimes = 0;
    }
  };
  function Os(e32, t3, n3, r3, i3, a3, o3) {
    let s3 = new mn(), c3 = new Es(), l3 = /* @__PURE__ */ new Set(), u3 = [], d3 = i3.logarithmicDepthBuffer, f3 = i3.vertexTextures, p3 = i3.precision, m3 = { MeshDepthMaterial: `depth`, MeshDistanceMaterial: `distanceRGBA`, MeshNormalMaterial: `normal`, MeshBasicMaterial: `basic`, MeshLambertMaterial: `lambert`, MeshPhongMaterial: `phong`, MeshToonMaterial: `toon`, MeshStandardMaterial: `physical`, MeshPhysicalMaterial: `physical`, MeshMatcapMaterial: `matcap`, LineBasicMaterial: `basic`, LineDashedMaterial: `dashed`, PointsMaterial: `points`, ShadowMaterial: `shadow`, SpriteMaterial: `sprite` };
    function h3(e33) {
      return l3.add(e33), e33 === 0 ? `uv` : `uv${e33}`;
    }
    function g3(a4, s4, u4, g4, _4) {
      let v4 = g4.fog, y4 = _4.geometry, b4 = a4.isMeshStandardMaterial ? g4.environment : null, x4 = (a4.isMeshStandardMaterial ? n3 : t3).get(a4.envMap || b4), S4 = x4 && x4.mapping === 306 ? x4.image.height : null, C4 = m3[a4.type];
      a4.precision !== null && (p3 = i3.getMaxPrecision(a4.precision), p3 !== a4.precision && console.warn(`THREE.WebGLProgram.getParameters:`, a4.precision, `not supported, using`, p3, `instead.`));
      let w4 = y4.morphAttributes.position || y4.morphAttributes.normal || y4.morphAttributes.color, T3 = w4 === void 0 ? 0 : w4.length, E3 = 0;
      y4.morphAttributes.position !== void 0 && (E3 = 1), y4.morphAttributes.normal !== void 0 && (E3 = 2), y4.morphAttributes.color !== void 0 && (E3 = 3);
      let D3, O3, k3, A4;
      if (C4) {
        let e33 = na[C4];
        D3 = e33.vertexShader, O3 = e33.fragmentShader;
      } else D3 = a4.vertexShader, O3 = a4.fragmentShader, c3.update(a4), k3 = c3.getVertexShaderID(a4), A4 = c3.getFragmentShaderID(a4);
      let j4 = e32.getRenderTarget(), ee3 = e32.state.buffers.depth.getReversed(), te3 = _4.isInstancedMesh === true, M4 = _4.isBatchedMesh === true, N4 = !!a4.map, P3 = !!a4.matcap, ne3 = !!x4, re3 = !!a4.aoMap, ie3 = !!a4.lightMap, ae3 = !!a4.bumpMap, oe3 = !!a4.normalMap, se3 = !!a4.displacementMap, F3 = !!a4.emissiveMap, ce3 = !!a4.metalnessMap, le3 = !!a4.roughnessMap, ue3 = a4.anisotropy > 0, de3 = a4.clearcoat > 0, fe3 = a4.dispersion > 0, pe3 = a4.iridescence > 0, me3 = a4.sheen > 0, I3 = a4.transmission > 0, he3 = ue3 && !!a4.anisotropyMap, L3 = de3 && !!a4.clearcoatMap, R3 = de3 && !!a4.clearcoatNormalMap, z3 = de3 && !!a4.clearcoatRoughnessMap, ge3 = pe3 && !!a4.iridescenceMap, B3 = pe3 && !!a4.iridescenceThicknessMap, V3 = me3 && !!a4.sheenColorMap, _e3 = me3 && !!a4.sheenRoughnessMap, ve3 = !!a4.specularMap, ye3 = !!a4.specularColorMap, be3 = !!a4.specularIntensityMap, xe3 = I3 && !!a4.transmissionMap, Se3 = I3 && !!a4.thicknessMap, Ce3 = !!a4.gradientMap, we3 = !!a4.alphaMap, Te3 = a4.alphaTest > 0, Ee3 = !!a4.alphaHash, De3 = !!a4.extensions, Oe3 = 0;
      a4.toneMapped && (j4 === null || j4.isXRRenderTarget === true) && (Oe3 = e32.toneMapping);
      let ke3 = { shaderID: C4, shaderType: a4.type, shaderName: a4.name, vertexShader: D3, fragmentShader: O3, defines: a4.defines, customVertexShaderID: k3, customFragmentShaderID: A4, isRawShaderMaterial: a4.isRawShaderMaterial === true, glslVersion: a4.glslVersion, precision: p3, batching: M4, batchingColor: M4 && _4._colorsTexture !== null, instancing: te3, instancingColor: te3 && _4.instanceColor !== null, instancingMorph: te3 && _4.morphTexture !== null, supportsVertexTextures: f3, outputColorSpace: j4 === null ? e32.outputColorSpace : j4.isXRRenderTarget === true ? j4.texture.colorSpace : Be, alphaToCoverage: !!a4.alphaToCoverage, map: N4, matcap: P3, envMap: ne3, envMapMode: ne3 && x4.mapping, envMapCubeUVHeight: S4, aoMap: re3, lightMap: ie3, bumpMap: ae3, normalMap: oe3, displacementMap: f3 && se3, emissiveMap: F3, normalMapObjectSpace: oe3 && a4.normalMapType === 1, normalMapTangentSpace: oe3 && a4.normalMapType === 0, metalnessMap: ce3, roughnessMap: le3, anisotropy: ue3, anisotropyMap: he3, clearcoat: de3, clearcoatMap: L3, clearcoatNormalMap: R3, clearcoatRoughnessMap: z3, dispersion: fe3, iridescence: pe3, iridescenceMap: ge3, iridescenceThicknessMap: B3, sheen: me3, sheenColorMap: V3, sheenRoughnessMap: _e3, specularMap: ve3, specularColorMap: ye3, specularIntensityMap: be3, transmission: I3, transmissionMap: xe3, thicknessMap: Se3, gradientMap: Ce3, opaque: a4.transparent === false && a4.blending === 1 && a4.alphaToCoverage === false, alphaMap: we3, alphaTest: Te3, alphaHash: Ee3, combine: a4.combine, mapUv: N4 && h3(a4.map.channel), aoMapUv: re3 && h3(a4.aoMap.channel), lightMapUv: ie3 && h3(a4.lightMap.channel), bumpMapUv: ae3 && h3(a4.bumpMap.channel), normalMapUv: oe3 && h3(a4.normalMap.channel), displacementMapUv: se3 && h3(a4.displacementMap.channel), emissiveMapUv: F3 && h3(a4.emissiveMap.channel), metalnessMapUv: ce3 && h3(a4.metalnessMap.channel), roughnessMapUv: le3 && h3(a4.roughnessMap.channel), anisotropyMapUv: he3 && h3(a4.anisotropyMap.channel), clearcoatMapUv: L3 && h3(a4.clearcoatMap.channel), clearcoatNormalMapUv: R3 && h3(a4.clearcoatNormalMap.channel), clearcoatRoughnessMapUv: z3 && h3(a4.clearcoatRoughnessMap.channel), iridescenceMapUv: ge3 && h3(a4.iridescenceMap.channel), iridescenceThicknessMapUv: B3 && h3(a4.iridescenceThicknessMap.channel), sheenColorMapUv: V3 && h3(a4.sheenColorMap.channel), sheenRoughnessMapUv: _e3 && h3(a4.sheenRoughnessMap.channel), specularMapUv: ve3 && h3(a4.specularMap.channel), specularColorMapUv: ye3 && h3(a4.specularColorMap.channel), specularIntensityMapUv: be3 && h3(a4.specularIntensityMap.channel), transmissionMapUv: xe3 && h3(a4.transmissionMap.channel), thicknessMapUv: Se3 && h3(a4.thicknessMap.channel), alphaMapUv: we3 && h3(a4.alphaMap.channel), vertexTangents: !!y4.attributes.tangent && (oe3 || ue3), vertexColors: a4.vertexColors, vertexAlphas: a4.vertexColors === true && !!y4.attributes.color && y4.attributes.color.itemSize === 4, pointsUvs: _4.isPoints === true && !!y4.attributes.uv && (N4 || we3), fog: !!v4, useFog: a4.fog === true, fogExp2: !!v4 && v4.isFogExp2, flatShading: a4.flatShading === true && a4.wireframe === false, sizeAttenuation: a4.sizeAttenuation === true, logarithmicDepthBuffer: d3, reversedDepthBuffer: ee3, skinning: _4.isSkinnedMesh === true, morphTargets: y4.morphAttributes.position !== void 0, morphNormals: y4.morphAttributes.normal !== void 0, morphColors: y4.morphAttributes.color !== void 0, morphTargetsCount: T3, morphTextureStride: E3, numDirLights: s4.directional.length, numPointLights: s4.point.length, numSpotLights: s4.spot.length, numSpotLightMaps: s4.spotLightMap.length, numRectAreaLights: s4.rectArea.length, numHemiLights: s4.hemi.length, numDirLightShadows: s4.directionalShadowMap.length, numPointLightShadows: s4.pointShadowMap.length, numSpotLightShadows: s4.spotShadowMap.length, numSpotLightShadowsWithMaps: s4.numSpotLightShadowsWithMaps, numLightProbes: s4.numLightProbes, numClippingPlanes: o3.numPlanes, numClipIntersection: o3.numIntersection, dithering: a4.dithering, shadowMapEnabled: e32.shadowMap.enabled && u4.length > 0, shadowMapType: e32.shadowMap.type, toneMapping: Oe3, decodeVideoTexture: N4 && a4.map.isVideoTexture === true && K.getTransfer(a4.map.colorSpace) === `srgb`, decodeVideoTextureEmissive: F3 && a4.emissiveMap.isVideoTexture === true && K.getTransfer(a4.emissiveMap.colorSpace) === `srgb`, premultipliedAlpha: a4.premultipliedAlpha, doubleSided: a4.side === 2, flipSided: a4.side === 1, useDepthPacking: a4.depthPacking >= 0, depthPacking: a4.depthPacking || 0, index0AttributeName: a4.index0AttributeName, extensionClipCullDistance: De3 && a4.extensions.clipCullDistance === true && r3.has(`WEBGL_clip_cull_distance`), extensionMultiDraw: (De3 && a4.extensions.multiDraw === true || M4) && r3.has(`WEBGL_multi_draw`), rendererExtensionParallelShaderCompile: r3.has(`KHR_parallel_shader_compile`), customProgramCacheKey: a4.customProgramCacheKey() };
      return ke3.vertexUv1s = l3.has(1), ke3.vertexUv2s = l3.has(2), ke3.vertexUv3s = l3.has(3), l3.clear(), ke3;
    }
    function _3(t4) {
      let n4 = [];
      if (t4.shaderID ? n4.push(t4.shaderID) : (n4.push(t4.customVertexShaderID), n4.push(t4.customFragmentShaderID)), t4.defines !== void 0) for (let e33 in t4.defines) n4.push(e33), n4.push(t4.defines[e33]);
      return t4.isRawShaderMaterial === false && (v3(n4, t4), y3(n4, t4), n4.push(e32.outputColorSpace)), n4.push(t4.customProgramCacheKey), n4.join();
    }
    function v3(e33, t4) {
      e33.push(t4.precision), e33.push(t4.outputColorSpace), e33.push(t4.envMapMode), e33.push(t4.envMapCubeUVHeight), e33.push(t4.mapUv), e33.push(t4.alphaMapUv), e33.push(t4.lightMapUv), e33.push(t4.aoMapUv), e33.push(t4.bumpMapUv), e33.push(t4.normalMapUv), e33.push(t4.displacementMapUv), e33.push(t4.emissiveMapUv), e33.push(t4.metalnessMapUv), e33.push(t4.roughnessMapUv), e33.push(t4.anisotropyMapUv), e33.push(t4.clearcoatMapUv), e33.push(t4.clearcoatNormalMapUv), e33.push(t4.clearcoatRoughnessMapUv), e33.push(t4.iridescenceMapUv), e33.push(t4.iridescenceThicknessMapUv), e33.push(t4.sheenColorMapUv), e33.push(t4.sheenRoughnessMapUv), e33.push(t4.specularMapUv), e33.push(t4.specularColorMapUv), e33.push(t4.specularIntensityMapUv), e33.push(t4.transmissionMapUv), e33.push(t4.thicknessMapUv), e33.push(t4.combine), e33.push(t4.fogExp2), e33.push(t4.sizeAttenuation), e33.push(t4.morphTargetsCount), e33.push(t4.morphAttributeCount), e33.push(t4.numDirLights), e33.push(t4.numPointLights), e33.push(t4.numSpotLights), e33.push(t4.numSpotLightMaps), e33.push(t4.numHemiLights), e33.push(t4.numRectAreaLights), e33.push(t4.numDirLightShadows), e33.push(t4.numPointLightShadows), e33.push(t4.numSpotLightShadows), e33.push(t4.numSpotLightShadowsWithMaps), e33.push(t4.numLightProbes), e33.push(t4.shadowMapType), e33.push(t4.toneMapping), e33.push(t4.numClippingPlanes), e33.push(t4.numClipIntersection), e33.push(t4.depthPacking);
    }
    function y3(e33, t4) {
      s3.disableAll(), t4.supportsVertexTextures && s3.enable(0), t4.instancing && s3.enable(1), t4.instancingColor && s3.enable(2), t4.instancingMorph && s3.enable(3), t4.matcap && s3.enable(4), t4.envMap && s3.enable(5), t4.normalMapObjectSpace && s3.enable(6), t4.normalMapTangentSpace && s3.enable(7), t4.clearcoat && s3.enable(8), t4.iridescence && s3.enable(9), t4.alphaTest && s3.enable(10), t4.vertexColors && s3.enable(11), t4.vertexAlphas && s3.enable(12), t4.vertexUv1s && s3.enable(13), t4.vertexUv2s && s3.enable(14), t4.vertexUv3s && s3.enable(15), t4.vertexTangents && s3.enable(16), t4.anisotropy && s3.enable(17), t4.alphaHash && s3.enable(18), t4.batching && s3.enable(19), t4.dispersion && s3.enable(20), t4.batchingColor && s3.enable(21), t4.gradientMap && s3.enable(22), e33.push(s3.mask), s3.disableAll(), t4.fog && s3.enable(0), t4.useFog && s3.enable(1), t4.flatShading && s3.enable(2), t4.logarithmicDepthBuffer && s3.enable(3), t4.reversedDepthBuffer && s3.enable(4), t4.skinning && s3.enable(5), t4.morphTargets && s3.enable(6), t4.morphNormals && s3.enable(7), t4.morphColors && s3.enable(8), t4.premultipliedAlpha && s3.enable(9), t4.shadowMapEnabled && s3.enable(10), t4.doubleSided && s3.enable(11), t4.flipSided && s3.enable(12), t4.useDepthPacking && s3.enable(13), t4.dithering && s3.enable(14), t4.transmission && s3.enable(15), t4.sheen && s3.enable(16), t4.opaque && s3.enable(17), t4.pointsUvs && s3.enable(18), t4.decodeVideoTexture && s3.enable(19), t4.decodeVideoTextureEmissive && s3.enable(20), t4.alphaToCoverage && s3.enable(21), e33.push(s3.mask);
    }
    function b3(e33) {
      let t4 = m3[e33.type], n4;
      if (t4) {
        let e34 = na[t4];
        n4 = Nr.clone(e34.uniforms);
      } else n4 = e33.uniforms;
      return n4;
    }
    function x3(t4, n4) {
      let r4;
      for (let e33 = 0, t5 = u3.length; e33 < t5; e33++) {
        let t6 = u3[e33];
        if (t6.cacheKey === n4) {
          r4 = t6, ++r4.usedTimes;
          break;
        }
      }
      return r4 === void 0 && (r4 = new ws(e32, n4, t4, a3), u3.push(r4)), r4;
    }
    function S3(e33) {
      if (--e33.usedTimes === 0) {
        let t4 = u3.indexOf(e33);
        u3[t4] = u3[u3.length - 1], u3.pop(), e33.destroy();
      }
    }
    function C3(e33) {
      c3.remove(e33);
    }
    function w3() {
      c3.dispose();
    }
    return { getParameters: g3, getProgramCacheKey: _3, getUniforms: b3, acquireProgram: x3, releaseProgram: S3, releaseShaderCache: C3, programs: u3, dispose: w3 };
  }
  function ks() {
    let e32 = /* @__PURE__ */ new WeakMap();
    function t3(t4) {
      return e32.has(t4);
    }
    function n3(t4) {
      let n4 = e32.get(t4);
      return n4 === void 0 && (n4 = {}, e32.set(t4, n4)), n4;
    }
    function r3(t4) {
      e32.delete(t4);
    }
    function i3(t4, n4, r4) {
      e32.get(t4)[n4] = r4;
    }
    function a3() {
      e32 = /* @__PURE__ */ new WeakMap();
    }
    return { has: t3, get: n3, remove: r3, update: i3, dispose: a3 };
  }
  function As(e32, t3) {
    return e32.groupOrder === t3.groupOrder ? e32.renderOrder === t3.renderOrder ? e32.material.id === t3.material.id ? e32.z === t3.z ? e32.id - t3.id : e32.z - t3.z : e32.material.id - t3.material.id : e32.renderOrder - t3.renderOrder : e32.groupOrder - t3.groupOrder;
  }
  function js(e32, t3) {
    return e32.groupOrder === t3.groupOrder ? e32.renderOrder === t3.renderOrder ? e32.z === t3.z ? e32.id - t3.id : t3.z - e32.z : e32.renderOrder - t3.renderOrder : e32.groupOrder - t3.groupOrder;
  }
  function Ms() {
    let e32 = [], t3 = 0, n3 = [], r3 = [], i3 = [];
    function a3() {
      t3 = 0, n3.length = 0, r3.length = 0, i3.length = 0;
    }
    function o3(n4, r4, i4, a4, o4, s4) {
      let c4 = e32[t3];
      return c4 === void 0 ? (c4 = { id: n4.id, object: n4, geometry: r4, material: i4, groupOrder: a4, renderOrder: n4.renderOrder, z: o4, group: s4 }, e32[t3] = c4) : (c4.id = n4.id, c4.object = n4, c4.geometry = r4, c4.material = i4, c4.groupOrder = a4, c4.renderOrder = n4.renderOrder, c4.z = o4, c4.group = s4), t3++, c4;
    }
    function s3(e33, t4, a4, s4, c4, l4) {
      let u4 = o3(e33, t4, a4, s4, c4, l4);
      a4.transmission > 0 ? r3.push(u4) : a4.transparent === true ? i3.push(u4) : n3.push(u4);
    }
    function c3(e33, t4, a4, s4, c4, l4) {
      let u4 = o3(e33, t4, a4, s4, c4, l4);
      a4.transmission > 0 ? r3.unshift(u4) : a4.transparent === true ? i3.unshift(u4) : n3.unshift(u4);
    }
    function l3(e33, t4) {
      n3.length > 1 && n3.sort(e33 || As), r3.length > 1 && r3.sort(t4 || js), i3.length > 1 && i3.sort(t4 || js);
    }
    function u3() {
      for (let n4 = t3, r4 = e32.length; n4 < r4; n4++) {
        let t4 = e32[n4];
        if (t4.id === null) break;
        t4.id = null, t4.object = null, t4.geometry = null, t4.material = null, t4.group = null;
      }
    }
    return { opaque: n3, transmissive: r3, transparent: i3, init: a3, push: s3, unshift: c3, finish: u3, sort: l3 };
  }
  function Ns() {
    let e32 = /* @__PURE__ */ new WeakMap();
    function t3(t4, n4) {
      let r3 = e32.get(t4), i3;
      return r3 === void 0 ? (i3 = new Ms(), e32.set(t4, [i3])) : n4 >= r3.length ? (i3 = new Ms(), r3.push(i3)) : i3 = r3[n4], i3;
    }
    function n3() {
      e32 = /* @__PURE__ */ new WeakMap();
    }
    return { get: t3, dispose: n3 };
  }
  function Ps() {
    let e32 = {};
    return { get: function(t3) {
      if (e32[t3.id] !== void 0) return e32[t3.id];
      let n3;
      switch (t3.type) {
        case `DirectionalLight`:
          n3 = { direction: new W(), color: new q() };
          break;
        case `SpotLight`:
          n3 = { position: new W(), direction: new W(), color: new q(), distance: 0, coneCos: 0, penumbraCos: 0, decay: 0 };
          break;
        case `PointLight`:
          n3 = { position: new W(), color: new q(), distance: 0, decay: 0 };
          break;
        case `HemisphereLight`:
          n3 = { direction: new W(), skyColor: new q(), groundColor: new q() };
          break;
        case `RectAreaLight`:
          n3 = { color: new q(), position: new W(), halfWidth: new W(), halfHeight: new W() };
          break;
      }
      return e32[t3.id] = n3, n3;
    } };
  }
  function Fs() {
    let e32 = {};
    return { get: function(t3) {
      if (e32[t3.id] !== void 0) return e32[t3.id];
      let n3;
      switch (t3.type) {
        case `DirectionalLight`:
          n3 = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new U() };
          break;
        case `SpotLight`:
          n3 = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new U() };
          break;
        case `PointLight`:
          n3 = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new U(), shadowCameraNear: 1, shadowCameraFar: 1e3 };
          break;
      }
      return e32[t3.id] = n3, n3;
    } };
  }
  var Is = 0;
  function Ls(e32, t3) {
    return (t3.castShadow ? 2 : 0) - (e32.castShadow ? 2 : 0) + +!!t3.map - !!e32.map;
  }
  function Rs(e32) {
    let t3 = new Ps(), n3 = Fs(), r3 = { version: 0, hash: { directionalLength: -1, pointLength: -1, spotLength: -1, rectAreaLength: -1, hemiLength: -1, numDirectionalShadows: -1, numPointShadows: -1, numSpotShadows: -1, numSpotMaps: -1, numLightProbes: -1 }, ambient: [0, 0, 0], probe: [], directional: [], directionalShadow: [], directionalShadowMap: [], directionalShadowMatrix: [], spot: [], spotLightMap: [], spotShadow: [], spotShadowMap: [], spotLightMatrix: [], rectArea: [], rectAreaLTC1: null, rectAreaLTC2: null, point: [], pointShadow: [], pointShadowMap: [], pointShadowMatrix: [], hemi: [], numSpotLightShadowsWithMaps: 0, numLightProbes: 0 };
    for (let e33 = 0; e33 < 9; e33++) r3.probe.push(new W());
    let i3 = new W(), a3 = new nn(), o3 = new nn();
    function s3(i4) {
      let a4 = 0, o4 = 0, s4 = 0;
      for (let e33 = 0; e33 < 9; e33++) r3.probe[e33].set(0, 0, 0);
      let c4 = 0, l3 = 0, u3 = 0, d3 = 0, f3 = 0, p3 = 0, m3 = 0, h3 = 0, g3 = 0, _3 = 0, v3 = 0;
      i4.sort(Ls);
      for (let e33 = 0, y4 = i4.length; e33 < y4; e33++) {
        let y5 = i4[e33], b3 = y5.color, x3 = y5.intensity, S3 = y5.distance, C3 = y5.shadow && y5.shadow.map ? y5.shadow.map.texture : null;
        if (y5.isAmbientLight) a4 += b3.r * x3, o4 += b3.g * x3, s4 += b3.b * x3;
        else if (y5.isLightProbe) {
          for (let e34 = 0; e34 < 9; e34++) r3.probe[e34].addScaledVector(y5.sh.coefficients[e34], x3);
          v3++;
        } else if (y5.isDirectionalLight) {
          let e34 = t3.get(y5);
          if (e34.color.copy(y5.color).multiplyScalar(y5.intensity), y5.castShadow) {
            let e35 = y5.shadow, t4 = n3.get(y5);
            t4.shadowIntensity = e35.intensity, t4.shadowBias = e35.bias, t4.shadowNormalBias = e35.normalBias, t4.shadowRadius = e35.radius, t4.shadowMapSize = e35.mapSize, r3.directionalShadow[c4] = t4, r3.directionalShadowMap[c4] = C3, r3.directionalShadowMatrix[c4] = y5.shadow.matrix, p3++;
          }
          r3.directional[c4] = e34, c4++;
        } else if (y5.isSpotLight) {
          let e34 = t3.get(y5);
          e34.position.setFromMatrixPosition(y5.matrixWorld), e34.color.copy(b3).multiplyScalar(x3), e34.distance = S3, e34.coneCos = Math.cos(y5.angle), e34.penumbraCos = Math.cos(y5.angle * (1 - y5.penumbra)), e34.decay = y5.decay, r3.spot[u3] = e34;
          let i5 = y5.shadow;
          if (y5.map && (r3.spotLightMap[g3] = y5.map, g3++, i5.updateMatrices(y5), y5.castShadow && _3++), r3.spotLightMatrix[u3] = i5.matrix, y5.castShadow) {
            let e35 = n3.get(y5);
            e35.shadowIntensity = i5.intensity, e35.shadowBias = i5.bias, e35.shadowNormalBias = i5.normalBias, e35.shadowRadius = i5.radius, e35.shadowMapSize = i5.mapSize, r3.spotShadow[u3] = e35, r3.spotShadowMap[u3] = C3, h3++;
          }
          u3++;
        } else if (y5.isRectAreaLight) {
          let e34 = t3.get(y5);
          e34.color.copy(b3).multiplyScalar(x3), e34.halfWidth.set(y5.width * 0.5, 0, 0), e34.halfHeight.set(0, y5.height * 0.5, 0), r3.rectArea[d3] = e34, d3++;
        } else if (y5.isPointLight) {
          let e34 = t3.get(y5);
          if (e34.color.copy(y5.color).multiplyScalar(y5.intensity), e34.distance = y5.distance, e34.decay = y5.decay, y5.castShadow) {
            let e35 = y5.shadow, t4 = n3.get(y5);
            t4.shadowIntensity = e35.intensity, t4.shadowBias = e35.bias, t4.shadowNormalBias = e35.normalBias, t4.shadowRadius = e35.radius, t4.shadowMapSize = e35.mapSize, t4.shadowCameraNear = e35.camera.near, t4.shadowCameraFar = e35.camera.far, r3.pointShadow[l3] = t4, r3.pointShadowMap[l3] = C3, r3.pointShadowMatrix[l3] = y5.shadow.matrix, m3++;
          }
          r3.point[l3] = e34, l3++;
        } else if (y5.isHemisphereLight) {
          let e34 = t3.get(y5);
          e34.skyColor.copy(y5.color).multiplyScalar(x3), e34.groundColor.copy(y5.groundColor).multiplyScalar(x3), r3.hemi[f3] = e34, f3++;
        }
      }
      d3 > 0 && (e32.has(`OES_texture_float_linear`) === true ? (r3.rectAreaLTC1 = X.LTC_FLOAT_1, r3.rectAreaLTC2 = X.LTC_FLOAT_2) : (r3.rectAreaLTC1 = X.LTC_HALF_1, r3.rectAreaLTC2 = X.LTC_HALF_2)), r3.ambient[0] = a4, r3.ambient[1] = o4, r3.ambient[2] = s4;
      let y3 = r3.hash;
      (y3.directionalLength !== c4 || y3.pointLength !== l3 || y3.spotLength !== u3 || y3.rectAreaLength !== d3 || y3.hemiLength !== f3 || y3.numDirectionalShadows !== p3 || y3.numPointShadows !== m3 || y3.numSpotShadows !== h3 || y3.numSpotMaps !== g3 || y3.numLightProbes !== v3) && (r3.directional.length = c4, r3.spot.length = u3, r3.rectArea.length = d3, r3.point.length = l3, r3.hemi.length = f3, r3.directionalShadow.length = p3, r3.directionalShadowMap.length = p3, r3.pointShadow.length = m3, r3.pointShadowMap.length = m3, r3.spotShadow.length = h3, r3.spotShadowMap.length = h3, r3.directionalShadowMatrix.length = p3, r3.pointShadowMatrix.length = m3, r3.spotLightMatrix.length = h3 + g3 - _3, r3.spotLightMap.length = g3, r3.numSpotLightShadowsWithMaps = _3, r3.numLightProbes = v3, y3.directionalLength = c4, y3.pointLength = l3, y3.spotLength = u3, y3.rectAreaLength = d3, y3.hemiLength = f3, y3.numDirectionalShadows = p3, y3.numPointShadows = m3, y3.numSpotShadows = h3, y3.numSpotMaps = g3, y3.numLightProbes = v3, r3.version = Is++);
    }
    function c3(e33, t4) {
      let n4 = 0, s4 = 0, c4 = 0, l3 = 0, u3 = 0, d3 = t4.matrixWorldInverse;
      for (let t5 = 0, f3 = e33.length; t5 < f3; t5++) {
        let f4 = e33[t5];
        if (f4.isDirectionalLight) {
          let e34 = r3.directional[n4];
          e34.direction.setFromMatrixPosition(f4.matrixWorld), i3.setFromMatrixPosition(f4.target.matrixWorld), e34.direction.sub(i3), e34.direction.transformDirection(d3), n4++;
        } else if (f4.isSpotLight) {
          let e34 = r3.spot[c4];
          e34.position.setFromMatrixPosition(f4.matrixWorld), e34.position.applyMatrix4(d3), e34.direction.setFromMatrixPosition(f4.matrixWorld), i3.setFromMatrixPosition(f4.target.matrixWorld), e34.direction.sub(i3), e34.direction.transformDirection(d3), c4++;
        } else if (f4.isRectAreaLight) {
          let e34 = r3.rectArea[l3];
          e34.position.setFromMatrixPosition(f4.matrixWorld), e34.position.applyMatrix4(d3), o3.identity(), a3.copy(f4.matrixWorld), a3.premultiply(d3), o3.extractRotation(a3), e34.halfWidth.set(f4.width * 0.5, 0, 0), e34.halfHeight.set(0, f4.height * 0.5, 0), e34.halfWidth.applyMatrix4(o3), e34.halfHeight.applyMatrix4(o3), l3++;
        } else if (f4.isPointLight) {
          let e34 = r3.point[s4];
          e34.position.setFromMatrixPosition(f4.matrixWorld), e34.position.applyMatrix4(d3), s4++;
        } else if (f4.isHemisphereLight) {
          let e34 = r3.hemi[u3];
          e34.direction.setFromMatrixPosition(f4.matrixWorld), e34.direction.transformDirection(d3), u3++;
        }
      }
    }
    return { setup: s3, setupView: c3, state: r3 };
  }
  function zs(e32) {
    let t3 = new Rs(e32), n3 = [], r3 = [];
    function i3(e33) {
      l3.camera = e33, n3.length = 0, r3.length = 0;
    }
    function a3(e33) {
      n3.push(e33);
    }
    function o3(e33) {
      r3.push(e33);
    }
    function s3() {
      t3.setup(n3);
    }
    function c3(e33) {
      t3.setupView(n3, e33);
    }
    let l3 = { lightsArray: n3, shadowsArray: r3, camera: null, lights: t3, transmissionRenderTarget: {} };
    return { init: i3, state: l3, setupLights: s3, setupLightsView: c3, pushLight: a3, pushShadow: o3 };
  }
  function Bs(e32) {
    let t3 = /* @__PURE__ */ new WeakMap();
    function n3(n4, r4 = 0) {
      let i3 = t3.get(n4), a3;
      return i3 === void 0 ? (a3 = new zs(e32), t3.set(n4, [a3])) : r4 >= i3.length ? (a3 = new zs(e32), i3.push(a3)) : a3 = i3[r4], a3;
    }
    function r3() {
      t3 = /* @__PURE__ */ new WeakMap();
    }
    return { get: n3, dispose: r3 };
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
  function Us(e32, t3, n3) {
    let r3 = new ai(), i3 = new U(), a3 = new U(), o3 = new wt(), s3 = new gi({ depthPacking: Re }), c3 = new _i(), l3 = {}, u3 = n3.maxTextureSize, d3 = { 0: 1, 1: 0, 2: 2 }, p3 = new Ir({ defines: { VSM_SAMPLES: 8 }, uniforms: { shadow_pass: { value: null }, resolution: { value: new U() }, radius: { value: 4 } }, vertexShader: Vs, fragmentShader: Hs }), m3 = p3.clone();
    m3.defines.HORIZONTAL_PASS = 1;
    let h3 = new pr();
    h3.setAttribute(`position`, new nr(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
    let g3 = new Tr(h3, p3), _3 = this;
    this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = 1;
    let v3 = this.type;
    this.render = function(t4, n4, s4) {
      if (_3.enabled === false || _3.autoUpdate === false && _3.needsUpdate === false || t4.length === 0) return;
      let c4 = e32.getRenderTarget(), l4 = e32.getActiveCubeFace(), d4 = e32.getActiveMipmapLevel(), p4 = e32.state;
      p4.setBlending(0), p4.buffers.depth.getReversed() === true ? p4.buffers.color.setClear(0, 0, 0, 0) : p4.buffers.color.setClear(1, 1, 1, 1), p4.buffers.depth.setTest(true), p4.setScissorTest(false);
      let m4 = v3 !== 3 && this.type === 3, h4 = v3 === 3 && this.type !== 3;
      for (let c5 = 0, l5 = t4.length; c5 < l5; c5++) {
        let l6 = t4[c5], d5 = l6.shadow;
        if (d5 === void 0) {
          console.warn(`THREE.WebGLShadowMap:`, l6, `has no shadow.`);
          continue;
        }
        if (d5.autoUpdate === false && d5.needsUpdate === false) continue;
        i3.copy(d5.mapSize);
        let g4 = d5.getFrameExtents();
        if (i3.multiply(g4), a3.copy(d5.mapSize), (i3.x > u3 || i3.y > u3) && (i3.x > u3 && (a3.x = Math.floor(u3 / g4.x), i3.x = a3.x * g4.x, d5.mapSize.x = a3.x), i3.y > u3 && (a3.y = Math.floor(u3 / g4.y), i3.y = a3.y * g4.y, d5.mapSize.y = a3.y)), d5.map === null || m4 === true || h4 === true) {
          let e33 = this.type === 3 ? {} : { minFilter: f, magFilter: f };
          d5.map !== null && d5.map.dispose(), d5.map = new Et(i3.x, i3.y, e33), d5.map.texture.name = l6.name + `.shadowMap`, d5.camera.updateProjectionMatrix();
        }
        e32.setRenderTarget(d5.map), e32.clear();
        let _4 = d5.getViewportCount();
        for (let e33 = 0; e33 < _4; e33++) {
          let t5 = d5.getViewport(e33);
          o3.set(a3.x * t5.x, a3.y * t5.y, a3.x * t5.z, a3.y * t5.w), p4.viewport(o3), d5.updateMatrices(l6, e33), r3 = d5.getFrustum(), x3(n4, s4, d5.camera, l6, this.type);
        }
        d5.isPointLightShadow !== true && this.type === 3 && y3(d5, s4), d5.needsUpdate = false;
      }
      v3 = this.type, _3.needsUpdate = false, e32.setRenderTarget(c4, l4, d4);
    };
    function y3(n4, r4) {
      let a4 = t3.update(g3);
      p3.defines.VSM_SAMPLES !== n4.blurSamples && (p3.defines.VSM_SAMPLES = n4.blurSamples, m3.defines.VSM_SAMPLES = n4.blurSamples, p3.needsUpdate = true, m3.needsUpdate = true), n4.mapPass === null && (n4.mapPass = new Et(i3.x, i3.y)), p3.uniforms.shadow_pass.value = n4.map.texture, p3.uniforms.resolution.value = n4.mapSize, p3.uniforms.radius.value = n4.radius, e32.setRenderTarget(n4.mapPass), e32.clear(), e32.renderBufferDirect(r4, null, a4, p3, g3, null), m3.uniforms.shadow_pass.value = n4.mapPass.texture, m3.uniforms.resolution.value = n4.mapSize, m3.uniforms.radius.value = n4.radius, e32.setRenderTarget(n4.map), e32.clear(), e32.renderBufferDirect(r4, null, a4, m3, g3, null);
    }
    function b3(t4, n4, r4, i4) {
      let a4 = null, o4 = r4.isPointLight === true ? t4.customDistanceMaterial : t4.customDepthMaterial;
      if (o4 !== void 0) a4 = o4;
      else if (a4 = r4.isPointLight === true ? c3 : s3, e32.localClippingEnabled && n4.clipShadows === true && Array.isArray(n4.clippingPlanes) && n4.clippingPlanes.length !== 0 || n4.displacementMap && n4.displacementScale !== 0 || n4.alphaMap && n4.alphaTest > 0 || n4.map && n4.alphaTest > 0 || n4.alphaToCoverage === true) {
        let e33 = a4.uuid, t5 = n4.uuid, r5 = l3[e33];
        r5 === void 0 && (r5 = {}, l3[e33] = r5);
        let i5 = r5[t5];
        i5 === void 0 && (i5 = a4.clone(), r5[t5] = i5, n4.addEventListener(`dispose`, S3)), a4 = i5;
      }
      if (a4.visible = n4.visible, a4.wireframe = n4.wireframe, i4 === 3 ? a4.side = n4.shadowSide === null ? n4.side : n4.shadowSide : a4.side = n4.shadowSide === null ? d3[n4.side] : n4.shadowSide, a4.alphaMap = n4.alphaMap, a4.alphaTest = n4.alphaToCoverage === true ? 0.5 : n4.alphaTest, a4.map = n4.map, a4.clipShadows = n4.clipShadows, a4.clippingPlanes = n4.clippingPlanes, a4.clipIntersection = n4.clipIntersection, a4.displacementMap = n4.displacementMap, a4.displacementScale = n4.displacementScale, a4.displacementBias = n4.displacementBias, a4.wireframeLinewidth = n4.wireframeLinewidth, a4.linewidth = n4.linewidth, r4.isPointLight === true && a4.isMeshDistanceMaterial === true) {
        let t5 = e32.properties.get(a4);
        t5.light = r4;
      }
      return a4;
    }
    function x3(n4, i4, a4, o4, s4) {
      if (n4.visible === false) return;
      if (n4.layers.test(i4.layers) && (n4.isMesh || n4.isLine || n4.isPoints) && (n4.castShadow || n4.receiveShadow && s4 === 3) && (!n4.frustumCulled || r3.intersectsObject(n4))) {
        n4.modelViewMatrix.multiplyMatrices(a4.matrixWorldInverse, n4.matrixWorld);
        let r4 = t3.update(n4), c5 = n4.material;
        if (Array.isArray(c5)) {
          let t4 = r4.groups;
          for (let l4 = 0, u4 = t4.length; l4 < u4; l4++) {
            let u5 = t4[l4], d4 = c5[u5.materialIndex];
            if (d4 && d4.visible) {
              let t5 = b3(n4, d4, o4, s4);
              n4.onBeforeShadow(e32, n4, i4, a4, r4, t5, u5), e32.renderBufferDirect(a4, null, r4, t5, n4, u5), n4.onAfterShadow(e32, n4, i4, a4, r4, t5, u5);
            }
          }
        } else if (c5.visible) {
          let t4 = b3(n4, c5, o4, s4);
          n4.onBeforeShadow(e32, n4, i4, a4, r4, t4, null), e32.renderBufferDirect(a4, null, r4, t4, n4, null), n4.onAfterShadow(e32, n4, i4, a4, r4, t4, null);
        }
      }
      let c4 = n4.children;
      for (let e33 = 0, t4 = c4.length; e33 < t4; e33++) x3(c4[e33], i4, a4, o4, s4);
    }
    function S3(e33) {
      e33.target.removeEventListener(`dispose`, S3);
      for (let t4 in l3) {
        let n4 = l3[t4], r4 = e33.target.uuid;
        r4 in n4 && (n4[r4].dispose(), delete n4[r4]);
      }
    }
  }
  var Ws = { 0: 1, 2: 6, 4: 7, 3: 5, 1: 0, 6: 2, 7: 4, 5: 3 };
  function Gs(e32, t3) {
    function n3() {
      let t4 = false, n4 = new wt(), r4 = null, i4 = new wt(0, 0, 0, 0);
      return { setMask: function(n5) {
        r4 !== n5 && !t4 && (e32.colorMask(n5, n5, n5, n5), r4 = n5);
      }, setLocked: function(e33) {
        t4 = e33;
      }, setClear: function(t5, r5, a4, o4, s4) {
        s4 === true && (t5 *= o4, r5 *= o4, a4 *= o4), n4.set(t5, r5, a4, o4), i4.equals(n4) === false && (e32.clearColor(t5, r5, a4, o4), i4.copy(n4));
      }, reset: function() {
        t4 = false, r4 = null, i4.set(-1, 0, 0, 0);
      } };
    }
    function r3() {
      let n4 = false, r4 = false, i4 = null, a4 = null, o4 = null;
      return { setReversed: function(e33) {
        if (r4 !== e33) {
          let n5 = t3.get(`EXT_clip_control`);
          e33 ? n5.clipControlEXT(n5.LOWER_LEFT_EXT, n5.ZERO_TO_ONE_EXT) : n5.clipControlEXT(n5.LOWER_LEFT_EXT, n5.NEGATIVE_ONE_TO_ONE_EXT), r4 = e33;
          let i5 = o4;
          o4 = null, this.setClear(i5);
        }
      }, getReversed: function() {
        return r4;
      }, setTest: function(t4) {
        t4 ? F3(e32.DEPTH_TEST) : ce3(e32.DEPTH_TEST);
      }, setMask: function(t4) {
        i4 !== t4 && !n4 && (e32.depthMask(t4), i4 = t4);
      }, setFunc: function(t4) {
        if (r4 && (t4 = Ws[t4]), a4 !== t4) {
          switch (t4) {
            case 0:
              e32.depthFunc(e32.NEVER);
              break;
            case 1:
              e32.depthFunc(e32.ALWAYS);
              break;
            case 2:
              e32.depthFunc(e32.LESS);
              break;
            case 3:
              e32.depthFunc(e32.LEQUAL);
              break;
            case 4:
              e32.depthFunc(e32.EQUAL);
              break;
            case 5:
              e32.depthFunc(e32.GEQUAL);
              break;
            case 6:
              e32.depthFunc(e32.GREATER);
              break;
            case 7:
              e32.depthFunc(e32.NOTEQUAL);
              break;
            default:
              e32.depthFunc(e32.LEQUAL);
          }
          a4 = t4;
        }
      }, setLocked: function(e33) {
        n4 = e33;
      }, setClear: function(t4) {
        o4 !== t4 && (r4 && (t4 = 1 - t4), e32.clearDepth(t4), o4 = t4);
      }, reset: function() {
        n4 = false, i4 = null, a4 = null, o4 = null, r4 = false;
      } };
    }
    function i3() {
      let t4 = false, n4 = null, r4 = null, i4 = null, a4 = null, o4 = null, s4 = null, c4 = null, l4 = null;
      return { setTest: function(n5) {
        t4 || (n5 ? F3(e32.STENCIL_TEST) : ce3(e32.STENCIL_TEST));
      }, setMask: function(r5) {
        n4 !== r5 && !t4 && (e32.stencilMask(r5), n4 = r5);
      }, setFunc: function(t5, n5, o5) {
        (r4 !== t5 || i4 !== n5 || a4 !== o5) && (e32.stencilFunc(t5, n5, o5), r4 = t5, i4 = n5, a4 = o5);
      }, setOp: function(t5, n5, r5) {
        (o4 !== t5 || s4 !== n5 || c4 !== r5) && (e32.stencilOp(t5, n5, r5), o4 = t5, s4 = n5, c4 = r5);
      }, setLocked: function(e33) {
        t4 = e33;
      }, setClear: function(t5) {
        l4 !== t5 && (e32.clearStencil(t5), l4 = t5);
      }, reset: function() {
        t4 = false, n4 = null, r4 = null, i4 = null, a4 = null, o4 = null, s4 = null, c4 = null, l4 = null;
      } };
    }
    let a3 = new n3(), o3 = new r3(), s3 = new i3(), c3 = /* @__PURE__ */ new WeakMap(), l3 = /* @__PURE__ */ new WeakMap(), u3 = {}, d3 = {}, f3 = /* @__PURE__ */ new WeakMap(), p3 = [], m3 = null, h3 = false, g3 = null, _3 = null, v3 = null, y3 = null, b3 = null, x3 = null, S3 = null, C3 = new q(0, 0, 0), w3 = 0, T3 = false, E3 = null, D3 = null, O3 = null, k3 = null, A4 = null, j4 = e32.getParameter(e32.MAX_COMBINED_TEXTURE_IMAGE_UNITS), ee3 = false, te3 = 0, M4 = e32.getParameter(e32.VERSION);
    M4.indexOf(`WebGL`) === -1 ? M4.indexOf(`OpenGL ES`) !== -1 && (te3 = parseFloat(/^OpenGL ES (\d)/.exec(M4)[1]), ee3 = te3 >= 2) : (te3 = parseFloat(/^WebGL (\d)/.exec(M4)[1]), ee3 = te3 >= 1);
    let N4 = null, P3 = {}, ne3 = e32.getParameter(e32.SCISSOR_BOX), re3 = e32.getParameter(e32.VIEWPORT), ie3 = new wt().fromArray(ne3), ae3 = new wt().fromArray(re3);
    function oe3(t4, n4, r4, i4) {
      let a4 = new Uint8Array(4), o4 = e32.createTexture();
      e32.bindTexture(t4, o4), e32.texParameteri(t4, e32.TEXTURE_MIN_FILTER, e32.NEAREST), e32.texParameteri(t4, e32.TEXTURE_MAG_FILTER, e32.NEAREST);
      for (let o5 = 0; o5 < r4; o5++) t4 === e32.TEXTURE_3D || t4 === e32.TEXTURE_2D_ARRAY ? e32.texImage3D(n4, 0, e32.RGBA, 1, 1, i4, 0, e32.RGBA, e32.UNSIGNED_BYTE, a4) : e32.texImage2D(n4 + o5, 0, e32.RGBA, 1, 1, 0, e32.RGBA, e32.UNSIGNED_BYTE, a4);
      return o4;
    }
    let se3 = {};
    se3[e32.TEXTURE_2D] = oe3(e32.TEXTURE_2D, e32.TEXTURE_2D, 1), se3[e32.TEXTURE_CUBE_MAP] = oe3(e32.TEXTURE_CUBE_MAP, e32.TEXTURE_CUBE_MAP_POSITIVE_X, 6), se3[e32.TEXTURE_2D_ARRAY] = oe3(e32.TEXTURE_2D_ARRAY, e32.TEXTURE_2D_ARRAY, 1, 1), se3[e32.TEXTURE_3D] = oe3(e32.TEXTURE_3D, e32.TEXTURE_3D, 1, 1), a3.setClear(0, 0, 0, 1), o3.setClear(1), s3.setClear(0), F3(e32.DEPTH_TEST), o3.setFunc(3), he3(false), L3(1), F3(e32.CULL_FACE), me3(0);
    function F3(t4) {
      u3[t4] !== true && (e32.enable(t4), u3[t4] = true);
    }
    function ce3(t4) {
      u3[t4] !== false && (e32.disable(t4), u3[t4] = false);
    }
    function le3(t4, n4) {
      return d3[t4] === n4 ? false : (e32.bindFramebuffer(t4, n4), d3[t4] = n4, t4 === e32.DRAW_FRAMEBUFFER && (d3[e32.FRAMEBUFFER] = n4), t4 === e32.FRAMEBUFFER && (d3[e32.DRAW_FRAMEBUFFER] = n4), true);
    }
    function ue3(t4, n4) {
      let r4 = p3, i4 = false;
      if (t4) {
        r4 = f3.get(n4), r4 === void 0 && (r4 = [], f3.set(n4, r4));
        let a4 = t4.textures;
        if (r4.length !== a4.length || r4[0] !== e32.COLOR_ATTACHMENT0) {
          for (let t5 = 0, n5 = a4.length; t5 < n5; t5++) r4[t5] = e32.COLOR_ATTACHMENT0 + t5;
          r4.length = a4.length, i4 = true;
        }
      } else r4[0] !== e32.BACK && (r4[0] = e32.BACK, i4 = true);
      i4 && e32.drawBuffers(r4);
    }
    function de3(t4) {
      return m3 === t4 ? false : (e32.useProgram(t4), m3 = t4, true);
    }
    let fe3 = { 100: e32.FUNC_ADD, 101: e32.FUNC_SUBTRACT, 102: e32.FUNC_REVERSE_SUBTRACT };
    fe3[103] = e32.MIN, fe3[104] = e32.MAX;
    let pe3 = { 200: e32.ZERO, 201: e32.ONE, 202: e32.SRC_COLOR, 204: e32.SRC_ALPHA, 210: e32.SRC_ALPHA_SATURATE, 208: e32.DST_COLOR, 206: e32.DST_ALPHA, 203: e32.ONE_MINUS_SRC_COLOR, 205: e32.ONE_MINUS_SRC_ALPHA, 209: e32.ONE_MINUS_DST_COLOR, 207: e32.ONE_MINUS_DST_ALPHA, 211: e32.CONSTANT_COLOR, 212: e32.ONE_MINUS_CONSTANT_COLOR, 213: e32.CONSTANT_ALPHA, 214: e32.ONE_MINUS_CONSTANT_ALPHA };
    function me3(t4, n4, r4, i4, a4, o4, s4, c4, l4, u4) {
      if (t4 === 0) {
        h3 === true && (ce3(e32.BLEND), h3 = false);
        return;
      }
      if (h3 === false && (F3(e32.BLEND), h3 = true), t4 !== 5) {
        if (t4 !== g3 || u4 !== T3) {
          if ((_3 !== 100 || b3 !== 100) && (e32.blendEquation(e32.FUNC_ADD), _3 = 100, b3 = 100), u4) switch (t4) {
            case 1:
              e32.blendFuncSeparate(e32.ONE, e32.ONE_MINUS_SRC_ALPHA, e32.ONE, e32.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              e32.blendFunc(e32.ONE, e32.ONE);
              break;
            case 3:
              e32.blendFuncSeparate(e32.ZERO, e32.ONE_MINUS_SRC_COLOR, e32.ZERO, e32.ONE);
              break;
            case 4:
              e32.blendFuncSeparate(e32.DST_COLOR, e32.ONE_MINUS_SRC_ALPHA, e32.ZERO, e32.ONE);
              break;
            default:
              console.error(`THREE.WebGLState: Invalid blending: `, t4);
              break;
          }
          else switch (t4) {
            case 1:
              e32.blendFuncSeparate(e32.SRC_ALPHA, e32.ONE_MINUS_SRC_ALPHA, e32.ONE, e32.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              e32.blendFuncSeparate(e32.SRC_ALPHA, e32.ONE, e32.ONE, e32.ONE);
              break;
            case 3:
              console.error(`THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);
              break;
            case 4:
              console.error(`THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);
              break;
            default:
              console.error(`THREE.WebGLState: Invalid blending: `, t4);
              break;
          }
          v3 = null, y3 = null, x3 = null, S3 = null, C3.set(0, 0, 0), w3 = 0, g3 = t4, T3 = u4;
        }
        return;
      }
      a4 || (a4 = n4), o4 || (o4 = r4), s4 || (s4 = i4), (n4 !== _3 || a4 !== b3) && (e32.blendEquationSeparate(fe3[n4], fe3[a4]), _3 = n4, b3 = a4), (r4 !== v3 || i4 !== y3 || o4 !== x3 || s4 !== S3) && (e32.blendFuncSeparate(pe3[r4], pe3[i4], pe3[o4], pe3[s4]), v3 = r4, y3 = i4, x3 = o4, S3 = s4), (c4.equals(C3) === false || l4 !== w3) && (e32.blendColor(c4.r, c4.g, c4.b, l4), C3.copy(c4), w3 = l4), g3 = t4, T3 = false;
    }
    function I3(t4, n4) {
      t4.side === 2 ? ce3(e32.CULL_FACE) : F3(e32.CULL_FACE);
      let r4 = t4.side === 1;
      n4 && (r4 = !r4), he3(r4), t4.blending === 1 && t4.transparent === false ? me3(0) : me3(t4.blending, t4.blendEquation, t4.blendSrc, t4.blendDst, t4.blendEquationAlpha, t4.blendSrcAlpha, t4.blendDstAlpha, t4.blendColor, t4.blendAlpha, t4.premultipliedAlpha), o3.setFunc(t4.depthFunc), o3.setTest(t4.depthTest), o3.setMask(t4.depthWrite), a3.setMask(t4.colorWrite);
      let i4 = t4.stencilWrite;
      s3.setTest(i4), i4 && (s3.setMask(t4.stencilWriteMask), s3.setFunc(t4.stencilFunc, t4.stencilRef, t4.stencilFuncMask), s3.setOp(t4.stencilFail, t4.stencilZFail, t4.stencilZPass)), z3(t4.polygonOffset, t4.polygonOffsetFactor, t4.polygonOffsetUnits), t4.alphaToCoverage === true ? F3(e32.SAMPLE_ALPHA_TO_COVERAGE) : ce3(e32.SAMPLE_ALPHA_TO_COVERAGE);
    }
    function he3(t4) {
      E3 !== t4 && (t4 ? e32.frontFace(e32.CW) : e32.frontFace(e32.CCW), E3 = t4);
    }
    function L3(t4) {
      t4 === 0 ? ce3(e32.CULL_FACE) : (F3(e32.CULL_FACE), t4 !== D3 && (t4 === 1 ? e32.cullFace(e32.BACK) : t4 === 2 ? e32.cullFace(e32.FRONT) : e32.cullFace(e32.FRONT_AND_BACK))), D3 = t4;
    }
    function R3(t4) {
      t4 !== O3 && (ee3 && e32.lineWidth(t4), O3 = t4);
    }
    function z3(t4, n4, r4) {
      t4 ? (F3(e32.POLYGON_OFFSET_FILL), (k3 !== n4 || A4 !== r4) && (e32.polygonOffset(n4, r4), k3 = n4, A4 = r4)) : ce3(e32.POLYGON_OFFSET_FILL);
    }
    function ge3(t4) {
      t4 ? F3(e32.SCISSOR_TEST) : ce3(e32.SCISSOR_TEST);
    }
    function B3(t4) {
      t4 === void 0 && (t4 = e32.TEXTURE0 + j4 - 1), N4 !== t4 && (e32.activeTexture(t4), N4 = t4);
    }
    function V3(t4, n4, r4) {
      r4 === void 0 && (r4 = N4 === null ? e32.TEXTURE0 + j4 - 1 : N4);
      let i4 = P3[r4];
      i4 === void 0 && (i4 = { type: void 0, texture: void 0 }, P3[r4] = i4), (i4.type !== t4 || i4.texture !== n4) && (N4 !== r4 && (e32.activeTexture(r4), N4 = r4), e32.bindTexture(t4, n4 || se3[t4]), i4.type = t4, i4.texture = n4);
    }
    function _e3() {
      let t4 = P3[N4];
      t4 !== void 0 && t4.type !== void 0 && (e32.bindTexture(t4.type, null), t4.type = void 0, t4.texture = void 0);
    }
    function ve3() {
      try {
        e32.compressedTexImage2D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function ye3() {
      try {
        e32.compressedTexImage3D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function be3() {
      try {
        e32.texSubImage2D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function xe3() {
      try {
        e32.texSubImage3D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function Se3() {
      try {
        e32.compressedTexSubImage2D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function Ce3() {
      try {
        e32.compressedTexSubImage3D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function we3() {
      try {
        e32.texStorage2D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function Te3() {
      try {
        e32.texStorage3D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function Ee3() {
      try {
        e32.texImage2D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function De3() {
      try {
        e32.texImage3D(...arguments);
      } catch (e33) {
        console.error(`THREE.WebGLState:`, e33);
      }
    }
    function Oe3(t4) {
      ie3.equals(t4) === false && (e32.scissor(t4.x, t4.y, t4.z, t4.w), ie3.copy(t4));
    }
    function ke3(t4) {
      ae3.equals(t4) === false && (e32.viewport(t4.x, t4.y, t4.z, t4.w), ae3.copy(t4));
    }
    function Ae3(t4, n4) {
      let r4 = l3.get(n4);
      r4 === void 0 && (r4 = /* @__PURE__ */ new WeakMap(), l3.set(n4, r4));
      let i4 = r4.get(t4);
      i4 === void 0 && (i4 = e32.getUniformBlockIndex(n4, t4.name), r4.set(t4, i4));
    }
    function je3(t4, n4) {
      let r4 = l3.get(n4).get(t4);
      c3.get(n4) !== r4 && (e32.uniformBlockBinding(n4, r4, t4.__bindingPointIndex), c3.set(n4, r4));
    }
    function Me3() {
      e32.disable(e32.BLEND), e32.disable(e32.CULL_FACE), e32.disable(e32.DEPTH_TEST), e32.disable(e32.POLYGON_OFFSET_FILL), e32.disable(e32.SCISSOR_TEST), e32.disable(e32.STENCIL_TEST), e32.disable(e32.SAMPLE_ALPHA_TO_COVERAGE), e32.blendEquation(e32.FUNC_ADD), e32.blendFunc(e32.ONE, e32.ZERO), e32.blendFuncSeparate(e32.ONE, e32.ZERO, e32.ONE, e32.ZERO), e32.blendColor(0, 0, 0, 0), e32.colorMask(true, true, true, true), e32.clearColor(0, 0, 0, 0), e32.depthMask(true), e32.depthFunc(e32.LESS), o3.setReversed(false), e32.clearDepth(1), e32.stencilMask(4294967295), e32.stencilFunc(e32.ALWAYS, 0, 4294967295), e32.stencilOp(e32.KEEP, e32.KEEP, e32.KEEP), e32.clearStencil(0), e32.cullFace(e32.BACK), e32.frontFace(e32.CCW), e32.polygonOffset(0, 0), e32.activeTexture(e32.TEXTURE0), e32.bindFramebuffer(e32.FRAMEBUFFER, null), e32.bindFramebuffer(e32.DRAW_FRAMEBUFFER, null), e32.bindFramebuffer(e32.READ_FRAMEBUFFER, null), e32.useProgram(null), e32.lineWidth(1), e32.scissor(0, 0, e32.canvas.width, e32.canvas.height), e32.viewport(0, 0, e32.canvas.width, e32.canvas.height), u3 = {}, N4 = null, P3 = {}, d3 = {}, f3 = /* @__PURE__ */ new WeakMap(), p3 = [], m3 = null, h3 = false, g3 = null, _3 = null, v3 = null, y3 = null, b3 = null, x3 = null, S3 = null, C3 = new q(0, 0, 0), w3 = 0, T3 = false, E3 = null, D3 = null, O3 = null, k3 = null, A4 = null, ie3.set(0, 0, e32.canvas.width, e32.canvas.height), ae3.set(0, 0, e32.canvas.width, e32.canvas.height), a3.reset(), o3.reset(), s3.reset();
    }
    return { buffers: { color: a3, depth: o3, stencil: s3 }, enable: F3, disable: ce3, bindFramebuffer: le3, drawBuffers: ue3, useProgram: de3, setBlending: me3, setMaterial: I3, setFlipSided: he3, setCullFace: L3, setLineWidth: R3, setPolygonOffset: z3, setScissorTest: ge3, activeTexture: B3, bindTexture: V3, unbindTexture: _e3, compressedTexImage2D: ve3, compressedTexImage3D: ye3, texImage2D: Ee3, texImage3D: De3, updateUBOMapping: Ae3, uniformBlockBinding: je3, texStorage2D: we3, texStorage3D: Te3, texSubImage2D: be3, texSubImage3D: xe3, compressedTexSubImage2D: Se3, compressedTexSubImage3D: Ce3, scissor: Oe3, viewport: ke3, reset: Me3 };
  }
  function Ks(e32, t3, n3, r3, i3, a3, o3) {
    let s3 = t3.has(`WEBGL_multisampled_render_to_texture`) ? t3.get(`WEBGL_multisampled_render_to_texture`) : null, c3 = typeof navigator > `u` ? false : /OculusBrowser/g.test(navigator.userAgent), v3 = new U(), y3 = /* @__PURE__ */ new WeakMap(), b3, x3 = /* @__PURE__ */ new WeakMap(), S3 = false;
    try {
      S3 = typeof OffscreenCanvas < `u` && new OffscreenCanvas(1, 1).getContext(`2d`) !== null;
    } catch {
    }
    function C3(e33, t4) {
      return S3 ? new OffscreenCanvas(e33, t4) : ot(`canvas`);
    }
    function w3(e33, t4, n4) {
      let r4 = 1, i4 = Ee3(e33);
      if ((i4.width > n4 || i4.height > n4) && (r4 = n4 / Math.max(i4.width, i4.height)), r4 < 1) if (typeof HTMLImageElement < `u` && e33 instanceof HTMLImageElement || typeof HTMLCanvasElement < `u` && e33 instanceof HTMLCanvasElement || typeof ImageBitmap < `u` && e33 instanceof ImageBitmap || typeof VideoFrame < `u` && e33 instanceof VideoFrame) {
        let n5 = Math.floor(r4 * i4.width), a4 = Math.floor(r4 * i4.height);
        b3 === void 0 && (b3 = C3(n5, a4));
        let o4 = t4 ? C3(n5, a4) : b3;
        return o4.width = n5, o4.height = a4, o4.getContext(`2d`).drawImage(e33, 0, 0, n5, a4), console.warn(`THREE.WebGLRenderer: Texture has been resized from (` + i4.width + `x` + i4.height + `) to (` + n5 + `x` + a4 + `).`), o4;
      } else return `data` in e33 && console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (` + i4.width + `x` + i4.height + `).`), e33;
      return e33;
    }
    function T3(e33) {
      return e33.generateMipmaps;
    }
    function E3(t4) {
      e32.generateMipmap(t4);
    }
    function D3(t4) {
      return t4.isWebGLCubeRenderTarget ? e32.TEXTURE_CUBE_MAP : t4.isWebGL3DRenderTarget ? e32.TEXTURE_3D : t4.isWebGLArrayRenderTarget || t4.isCompressedArrayTexture ? e32.TEXTURE_2D_ARRAY : e32.TEXTURE_2D;
    }
    function O3(n4, r4, i4, a4, o4 = false) {
      if (n4 !== null) {
        if (e32[n4] !== void 0) return e32[n4];
        console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '` + n4 + `'`);
      }
      let s4 = r4;
      if (r4 === e32.RED && (i4 === e32.FLOAT && (s4 = e32.R32F), i4 === e32.HALF_FLOAT && (s4 = e32.R16F), i4 === e32.UNSIGNED_BYTE && (s4 = e32.R8)), r4 === e32.RED_INTEGER && (i4 === e32.UNSIGNED_BYTE && (s4 = e32.R8UI), i4 === e32.UNSIGNED_SHORT && (s4 = e32.R16UI), i4 === e32.UNSIGNED_INT && (s4 = e32.R32UI), i4 === e32.BYTE && (s4 = e32.R8I), i4 === e32.SHORT && (s4 = e32.R16I), i4 === e32.INT && (s4 = e32.R32I)), r4 === e32.RG && (i4 === e32.FLOAT && (s4 = e32.RG32F), i4 === e32.HALF_FLOAT && (s4 = e32.RG16F), i4 === e32.UNSIGNED_BYTE && (s4 = e32.RG8)), r4 === e32.RG_INTEGER && (i4 === e32.UNSIGNED_BYTE && (s4 = e32.RG8UI), i4 === e32.UNSIGNED_SHORT && (s4 = e32.RG16UI), i4 === e32.UNSIGNED_INT && (s4 = e32.RG32UI), i4 === e32.BYTE && (s4 = e32.RG8I), i4 === e32.SHORT && (s4 = e32.RG16I), i4 === e32.INT && (s4 = e32.RG32I)), r4 === e32.RGB_INTEGER && (i4 === e32.UNSIGNED_BYTE && (s4 = e32.RGB8UI), i4 === e32.UNSIGNED_SHORT && (s4 = e32.RGB16UI), i4 === e32.UNSIGNED_INT && (s4 = e32.RGB32UI), i4 === e32.BYTE && (s4 = e32.RGB8I), i4 === e32.SHORT && (s4 = e32.RGB16I), i4 === e32.INT && (s4 = e32.RGB32I)), r4 === e32.RGBA_INTEGER && (i4 === e32.UNSIGNED_BYTE && (s4 = e32.RGBA8UI), i4 === e32.UNSIGNED_SHORT && (s4 = e32.RGBA16UI), i4 === e32.UNSIGNED_INT && (s4 = e32.RGBA32UI), i4 === e32.BYTE && (s4 = e32.RGBA8I), i4 === e32.SHORT && (s4 = e32.RGBA16I), i4 === e32.INT && (s4 = e32.RGBA32I)), r4 === e32.RGB && (i4 === e32.UNSIGNED_INT_5_9_9_9_REV && (s4 = e32.RGB9_E5), i4 === e32.UNSIGNED_INT_10F_11F_11F_REV && (s4 = e32.R11F_G11F_B10F)), r4 === e32.RGBA) {
        let t4 = o4 ? Ve : K.getTransfer(a4);
        i4 === e32.FLOAT && (s4 = e32.RGBA32F), i4 === e32.HALF_FLOAT && (s4 = e32.RGBA16F), i4 === e32.UNSIGNED_BYTE && (s4 = t4 === `srgb` ? e32.SRGB8_ALPHA8 : e32.RGBA8), i4 === e32.UNSIGNED_SHORT_4_4_4_4 && (s4 = e32.RGBA4), i4 === e32.UNSIGNED_SHORT_5_5_5_1 && (s4 = e32.RGB5_A1);
      }
      return (s4 === e32.R16F || s4 === e32.R32F || s4 === e32.RG16F || s4 === e32.RG32F || s4 === e32.RGBA16F || s4 === e32.RGBA32F) && t3.get(`EXT_color_buffer_float`), s4;
    }
    function k3(t4, n4) {
      let r4;
      return t4 ? n4 === null || n4 === 1014 || n4 === 1020 ? r4 = e32.DEPTH24_STENCIL8 : n4 === 1015 ? r4 = e32.DEPTH32F_STENCIL8 : n4 === 1012 && (r4 = e32.DEPTH24_STENCIL8, console.warn(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)) : n4 === null || n4 === 1014 || n4 === 1020 ? r4 = e32.DEPTH_COMPONENT24 : n4 === 1015 ? r4 = e32.DEPTH_COMPONENT32F : n4 === 1012 && (r4 = e32.DEPTH_COMPONENT16), r4;
    }
    function A4(e33, t4) {
      return T3(e33) === true || e33.isFramebufferTexture && e33.minFilter !== 1003 && e33.minFilter !== 1006 ? Math.log2(Math.max(t4.width, t4.height)) + 1 : e33.mipmaps !== void 0 && e33.mipmaps.length > 0 ? e33.mipmaps.length : e33.isCompressedTexture && Array.isArray(e33.image) ? t4.mipmaps.length : 1;
    }
    function j4(e33) {
      let t4 = e33.target;
      t4.removeEventListener(`dispose`, j4), te3(t4), t4.isVideoTexture && y3.delete(t4);
    }
    function ee3(e33) {
      let t4 = e33.target;
      t4.removeEventListener(`dispose`, ee3), P3(t4);
    }
    function te3(e33) {
      let t4 = r3.get(e33);
      if (t4.__webglInit === void 0) return;
      let n4 = e33.source, i4 = x3.get(n4);
      if (i4) {
        let r4 = i4[t4.__cacheKey];
        r4.usedTimes--, r4.usedTimes === 0 && M4(e33), Object.keys(i4).length === 0 && x3.delete(n4);
      }
      r3.remove(e33);
    }
    function M4(t4) {
      let n4 = r3.get(t4);
      e32.deleteTexture(n4.__webglTexture);
      let i4 = t4.source, a4 = x3.get(i4);
      delete a4[n4.__cacheKey], o3.memory.textures--;
    }
    function P3(t4) {
      let n4 = r3.get(t4);
      if (t4.depthTexture && (t4.depthTexture.dispose(), r3.remove(t4.depthTexture)), t4.isWebGLCubeRenderTarget) for (let t5 = 0; t5 < 6; t5++) {
        if (Array.isArray(n4.__webglFramebuffer[t5])) for (let r4 = 0; r4 < n4.__webglFramebuffer[t5].length; r4++) e32.deleteFramebuffer(n4.__webglFramebuffer[t5][r4]);
        else e32.deleteFramebuffer(n4.__webglFramebuffer[t5]);
        n4.__webglDepthbuffer && e32.deleteRenderbuffer(n4.__webglDepthbuffer[t5]);
      }
      else {
        if (Array.isArray(n4.__webglFramebuffer)) for (let t5 = 0; t5 < n4.__webglFramebuffer.length; t5++) e32.deleteFramebuffer(n4.__webglFramebuffer[t5]);
        else e32.deleteFramebuffer(n4.__webglFramebuffer);
        if (n4.__webglDepthbuffer && e32.deleteRenderbuffer(n4.__webglDepthbuffer), n4.__webglMultisampledFramebuffer && e32.deleteFramebuffer(n4.__webglMultisampledFramebuffer), n4.__webglColorRenderbuffer) for (let t5 = 0; t5 < n4.__webglColorRenderbuffer.length; t5++) n4.__webglColorRenderbuffer[t5] && e32.deleteRenderbuffer(n4.__webglColorRenderbuffer[t5]);
        n4.__webglDepthRenderbuffer && e32.deleteRenderbuffer(n4.__webglDepthRenderbuffer);
      }
      let i4 = t4.textures;
      for (let t5 = 0, n5 = i4.length; t5 < n5; t5++) {
        let n6 = r3.get(i4[t5]);
        n6.__webglTexture && (e32.deleteTexture(n6.__webglTexture), o3.memory.textures--), r3.remove(i4[t5]);
      }
      r3.remove(t4);
    }
    let ne3 = 0;
    function re3() {
      ne3 = 0;
    }
    function ie3() {
      let e33 = ne3;
      return e33 >= i3.maxTextures && console.warn(`THREE.WebGLTextures: Trying to use ` + e33 + ` texture units while this GPU supports only ` + i3.maxTextures), ne3 += 1, e33;
    }
    function ae3(e33) {
      let t4 = [];
      return t4.push(e33.wrapS), t4.push(e33.wrapT), t4.push(e33.wrapR || 0), t4.push(e33.magFilter), t4.push(e33.minFilter), t4.push(e33.anisotropy), t4.push(e33.internalFormat), t4.push(e33.format), t4.push(e33.type), t4.push(e33.generateMipmaps), t4.push(e33.premultiplyAlpha), t4.push(e33.flipY), t4.push(e33.unpackAlignment), t4.push(e33.colorSpace), t4.join();
    }
    function oe3(t4, i4) {
      let a4 = r3.get(t4);
      if (t4.isVideoTexture && we3(t4), t4.isRenderTargetTexture === false && t4.isExternalTexture !== true && t4.version > 0 && a4.__version !== t4.version) {
        let e33 = t4.image;
        if (e33 === null) console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);
        else if (e33.complete === false) console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);
        else {
          he3(a4, t4, i4);
          return;
        }
      } else t4.isExternalTexture && (a4.__webglTexture = t4.sourceTexture ? t4.sourceTexture : null);
      n3.bindTexture(e32.TEXTURE_2D, a4.__webglTexture, e32.TEXTURE0 + i4);
    }
    function se3(t4, i4) {
      let a4 = r3.get(t4);
      if (t4.isRenderTargetTexture === false && t4.version > 0 && a4.__version !== t4.version) {
        he3(a4, t4, i4);
        return;
      }
      n3.bindTexture(e32.TEXTURE_2D_ARRAY, a4.__webglTexture, e32.TEXTURE0 + i4);
    }
    function F3(t4, i4) {
      let a4 = r3.get(t4);
      if (t4.isRenderTargetTexture === false && t4.version > 0 && a4.__version !== t4.version) {
        he3(a4, t4, i4);
        return;
      }
      n3.bindTexture(e32.TEXTURE_3D, a4.__webglTexture, e32.TEXTURE0 + i4);
    }
    function ce3(t4, i4) {
      let a4 = r3.get(t4);
      if (t4.version > 0 && a4.__version !== t4.version) {
        L3(a4, t4, i4);
        return;
      }
      n3.bindTexture(e32.TEXTURE_CUBE_MAP, a4.__webglTexture, e32.TEXTURE0 + i4);
    }
    let le3 = { [l]: e32.REPEAT, [u]: e32.CLAMP_TO_EDGE, [d]: e32.MIRRORED_REPEAT }, ue3 = { [f]: e32.NEAREST, [p]: e32.NEAREST_MIPMAP_NEAREST, [m]: e32.NEAREST_MIPMAP_LINEAR, [h]: e32.LINEAR, [g]: e32.LINEAR_MIPMAP_NEAREST, [_]: e32.LINEAR_MIPMAP_LINEAR }, de3 = { 512: e32.NEVER, 519: e32.ALWAYS, 513: e32.LESS, 515: e32.LEQUAL, 514: e32.EQUAL, 518: e32.GEQUAL, 516: e32.GREATER, 517: e32.NOTEQUAL };
    function fe3(n4, a4) {
      if (a4.type === 1015 && t3.has(`OES_texture_float_linear`) === false && (a4.magFilter === 1006 || a4.magFilter === 1007 || a4.magFilter === 1005 || a4.magFilter === 1008 || a4.minFilter === 1006 || a4.minFilter === 1007 || a4.minFilter === 1005 || a4.minFilter === 1008) && console.warn(`THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`), e32.texParameteri(n4, e32.TEXTURE_WRAP_S, le3[a4.wrapS]), e32.texParameteri(n4, e32.TEXTURE_WRAP_T, le3[a4.wrapT]), (n4 === e32.TEXTURE_3D || n4 === e32.TEXTURE_2D_ARRAY) && e32.texParameteri(n4, e32.TEXTURE_WRAP_R, le3[a4.wrapR]), e32.texParameteri(n4, e32.TEXTURE_MAG_FILTER, ue3[a4.magFilter]), e32.texParameteri(n4, e32.TEXTURE_MIN_FILTER, ue3[a4.minFilter]), a4.compareFunction && (e32.texParameteri(n4, e32.TEXTURE_COMPARE_MODE, e32.COMPARE_REF_TO_TEXTURE), e32.texParameteri(n4, e32.TEXTURE_COMPARE_FUNC, de3[a4.compareFunction])), t3.has(`EXT_texture_filter_anisotropic`) === true) {
        if (a4.magFilter === 1003 || a4.minFilter !== 1005 && a4.minFilter !== 1008 || a4.type === 1015 && t3.has(`OES_texture_float_linear`) === false) return;
        if (a4.anisotropy > 1 || r3.get(a4).__currentAnisotropy) {
          let o4 = t3.get(`EXT_texture_filter_anisotropic`);
          e32.texParameterf(n4, o4.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(a4.anisotropy, i3.getMaxAnisotropy())), r3.get(a4).__currentAnisotropy = a4.anisotropy;
        }
      }
    }
    function pe3(t4, n4) {
      let r4 = false;
      t4.__webglInit === void 0 && (t4.__webglInit = true, n4.addEventListener(`dispose`, j4));
      let i4 = n4.source, a4 = x3.get(i4);
      a4 === void 0 && (a4 = {}, x3.set(i4, a4));
      let s4 = ae3(n4);
      if (s4 !== t4.__cacheKey) {
        a4[s4] === void 0 && (a4[s4] = { texture: e32.createTexture(), usedTimes: 0 }, o3.memory.textures++, r4 = true), a4[s4].usedTimes++;
        let i5 = a4[t4.__cacheKey];
        i5 !== void 0 && (a4[t4.__cacheKey].usedTimes--, i5.usedTimes === 0 && M4(n4)), t4.__cacheKey = s4, t4.__webglTexture = a4[s4].texture;
      }
      return r4;
    }
    function me3(e33, t4, n4) {
      return Math.floor(Math.floor(e33 / n4) / t4);
    }
    function I3(t4, r4, i4, a4) {
      let o4 = t4.updateRanges;
      if (o4.length === 0) n3.texSubImage2D(e32.TEXTURE_2D, 0, 0, 0, r4.width, r4.height, i4, a4, r4.data);
      else {
        o4.sort((e33, t5) => e33.start - t5.start);
        let s4 = 0;
        for (let e33 = 1; e33 < o4.length; e33++) {
          let t5 = o4[s4], n4 = o4[e33], i5 = t5.start + t5.count, a5 = me3(n4.start, r4.width, 4), c5 = me3(t5.start, r4.width, 4);
          n4.start <= i5 + 1 && a5 === c5 && me3(n4.start + n4.count - 1, r4.width, 4) === a5 ? t5.count = Math.max(t5.count, n4.start + n4.count - t5.start) : (++s4, o4[s4] = n4);
        }
        o4.length = s4 + 1;
        let c4 = e32.getParameter(e32.UNPACK_ROW_LENGTH), l3 = e32.getParameter(e32.UNPACK_SKIP_PIXELS), u3 = e32.getParameter(e32.UNPACK_SKIP_ROWS);
        e32.pixelStorei(e32.UNPACK_ROW_LENGTH, r4.width);
        for (let t5 = 0, s5 = o4.length; t5 < s5; t5++) {
          let s6 = o4[t5], c5 = Math.floor(s6.start / 4), l4 = Math.ceil(s6.count / 4), u4 = c5 % r4.width, d3 = Math.floor(c5 / r4.width), f3 = l4;
          e32.pixelStorei(e32.UNPACK_SKIP_PIXELS, u4), e32.pixelStorei(e32.UNPACK_SKIP_ROWS, d3), n3.texSubImage2D(e32.TEXTURE_2D, 0, u4, d3, f3, 1, i4, a4, r4.data);
        }
        t4.clearUpdateRanges(), e32.pixelStorei(e32.UNPACK_ROW_LENGTH, c4), e32.pixelStorei(e32.UNPACK_SKIP_PIXELS, l3), e32.pixelStorei(e32.UNPACK_SKIP_ROWS, u3);
      }
    }
    function he3(t4, o4, s4) {
      let c4 = e32.TEXTURE_2D;
      (o4.isDataArrayTexture || o4.isCompressedArrayTexture) && (c4 = e32.TEXTURE_2D_ARRAY), o4.isData3DTexture && (c4 = e32.TEXTURE_3D);
      let l3 = pe3(t4, o4), u3 = o4.source;
      n3.bindTexture(c4, t4.__webglTexture, e32.TEXTURE0 + s4);
      let d3 = r3.get(u3);
      if (u3.version !== d3.__version || l3 === true) {
        n3.activeTexture(e32.TEXTURE0 + s4);
        let t5 = K.getPrimaries(K.workingColorSpace), r4 = o4.colorSpace === `` ? null : K.getPrimaries(o4.colorSpace), f3 = o4.colorSpace === `` || t5 === r4 ? e32.NONE : e32.BROWSER_DEFAULT_WEBGL;
        e32.pixelStorei(e32.UNPACK_FLIP_Y_WEBGL, o4.flipY), e32.pixelStorei(e32.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o4.premultiplyAlpha), e32.pixelStorei(e32.UNPACK_ALIGNMENT, o4.unpackAlignment), e32.pixelStorei(e32.UNPACK_COLORSPACE_CONVERSION_WEBGL, f3);
        let p3 = w3(o4.image, false, i3.maxTextureSize);
        p3 = Te3(o4, p3);
        let m3 = a3.convert(o4.format, o4.colorSpace), h3 = a3.convert(o4.type), g3 = O3(o4.internalFormat, m3, h3, o4.colorSpace, o4.isVideoTexture);
        fe3(c4, o4);
        let _3, v4 = o4.mipmaps, y4 = o4.isVideoTexture !== true, b4 = d3.__version === void 0 || l3 === true, x4 = u3.dataReady, S4 = A4(o4, p3);
        if (o4.isDepthTexture) g3 = k3(o4.format === N, o4.type), b4 && (y4 ? n3.texStorage2D(e32.TEXTURE_2D, 1, g3, p3.width, p3.height) : n3.texImage2D(e32.TEXTURE_2D, 0, g3, p3.width, p3.height, 0, m3, h3, null));
        else if (o4.isDataTexture) if (v4.length > 0) {
          y4 && b4 && n3.texStorage2D(e32.TEXTURE_2D, S4, g3, v4[0].width, v4[0].height);
          for (let t6 = 0, r5 = v4.length; t6 < r5; t6++) _3 = v4[t6], y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_2D, t6, 0, 0, _3.width, _3.height, m3, h3, _3.data) : n3.texImage2D(e32.TEXTURE_2D, t6, g3, _3.width, _3.height, 0, m3, h3, _3.data);
          o4.generateMipmaps = false;
        } else y4 ? (b4 && n3.texStorage2D(e32.TEXTURE_2D, S4, g3, p3.width, p3.height), x4 && I3(o4, p3, m3, h3)) : n3.texImage2D(e32.TEXTURE_2D, 0, g3, p3.width, p3.height, 0, m3, h3, p3.data);
        else if (o4.isCompressedTexture) if (o4.isCompressedArrayTexture) {
          y4 && b4 && n3.texStorage3D(e32.TEXTURE_2D_ARRAY, S4, g3, v4[0].width, v4[0].height, p3.depth);
          for (let t6 = 0, r5 = v4.length; t6 < r5; t6++) if (_3 = v4[t6], o4.format !== 1023) if (m3 !== null) if (y4) {
            if (x4) if (o4.layerUpdates.size > 0) {
              let r6 = Qi(_3.width, _3.height, o4.format, o4.type);
              for (let i4 of o4.layerUpdates) {
                let a4 = _3.data.subarray(i4 * r6 / _3.data.BYTES_PER_ELEMENT, (i4 + 1) * r6 / _3.data.BYTES_PER_ELEMENT);
                n3.compressedTexSubImage3D(e32.TEXTURE_2D_ARRAY, t6, 0, 0, i4, _3.width, _3.height, 1, m3, a4);
              }
              o4.clearLayerUpdates();
            } else n3.compressedTexSubImage3D(e32.TEXTURE_2D_ARRAY, t6, 0, 0, 0, _3.width, _3.height, p3.depth, m3, _3.data);
          } else n3.compressedTexImage3D(e32.TEXTURE_2D_ARRAY, t6, g3, _3.width, _3.height, p3.depth, 0, _3.data, 0, 0);
          else console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);
          else y4 ? x4 && n3.texSubImage3D(e32.TEXTURE_2D_ARRAY, t6, 0, 0, 0, _3.width, _3.height, p3.depth, m3, h3, _3.data) : n3.texImage3D(e32.TEXTURE_2D_ARRAY, t6, g3, _3.width, _3.height, p3.depth, 0, m3, h3, _3.data);
        } else {
          y4 && b4 && n3.texStorage2D(e32.TEXTURE_2D, S4, g3, v4[0].width, v4[0].height);
          for (let t6 = 0, r5 = v4.length; t6 < r5; t6++) _3 = v4[t6], o4.format === 1023 ? y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_2D, t6, 0, 0, _3.width, _3.height, m3, h3, _3.data) : n3.texImage2D(e32.TEXTURE_2D, t6, g3, _3.width, _3.height, 0, m3, h3, _3.data) : m3 === null ? console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`) : y4 ? x4 && n3.compressedTexSubImage2D(e32.TEXTURE_2D, t6, 0, 0, _3.width, _3.height, m3, _3.data) : n3.compressedTexImage2D(e32.TEXTURE_2D, t6, g3, _3.width, _3.height, 0, _3.data);
        }
        else if (o4.isDataArrayTexture) if (y4) {
          if (b4 && n3.texStorage3D(e32.TEXTURE_2D_ARRAY, S4, g3, p3.width, p3.height, p3.depth), x4) if (o4.layerUpdates.size > 0) {
            let t6 = Qi(p3.width, p3.height, o4.format, o4.type);
            for (let r5 of o4.layerUpdates) {
              let i4 = p3.data.subarray(r5 * t6 / p3.data.BYTES_PER_ELEMENT, (r5 + 1) * t6 / p3.data.BYTES_PER_ELEMENT);
              n3.texSubImage3D(e32.TEXTURE_2D_ARRAY, 0, 0, 0, r5, p3.width, p3.height, 1, m3, h3, i4);
            }
            o4.clearLayerUpdates();
          } else n3.texSubImage3D(e32.TEXTURE_2D_ARRAY, 0, 0, 0, 0, p3.width, p3.height, p3.depth, m3, h3, p3.data);
        } else n3.texImage3D(e32.TEXTURE_2D_ARRAY, 0, g3, p3.width, p3.height, p3.depth, 0, m3, h3, p3.data);
        else if (o4.isData3DTexture) y4 ? (b4 && n3.texStorage3D(e32.TEXTURE_3D, S4, g3, p3.width, p3.height, p3.depth), x4 && n3.texSubImage3D(e32.TEXTURE_3D, 0, 0, 0, 0, p3.width, p3.height, p3.depth, m3, h3, p3.data)) : n3.texImage3D(e32.TEXTURE_3D, 0, g3, p3.width, p3.height, p3.depth, 0, m3, h3, p3.data);
        else if (o4.isFramebufferTexture) {
          if (b4) if (y4) n3.texStorage2D(e32.TEXTURE_2D, S4, g3, p3.width, p3.height);
          else {
            let t6 = p3.width, r5 = p3.height;
            for (let i4 = 0; i4 < S4; i4++) n3.texImage2D(e32.TEXTURE_2D, i4, g3, t6, r5, 0, m3, h3, null), t6 >>= 1, r5 >>= 1;
          }
        } else if (v4.length > 0) {
          if (y4 && b4) {
            let t6 = Ee3(v4[0]);
            n3.texStorage2D(e32.TEXTURE_2D, S4, g3, t6.width, t6.height);
          }
          for (let t6 = 0, r5 = v4.length; t6 < r5; t6++) _3 = v4[t6], y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_2D, t6, 0, 0, m3, h3, _3) : n3.texImage2D(e32.TEXTURE_2D, t6, g3, m3, h3, _3);
          o4.generateMipmaps = false;
        } else if (y4) {
          if (b4) {
            let t6 = Ee3(p3);
            n3.texStorage2D(e32.TEXTURE_2D, S4, g3, t6.width, t6.height);
          }
          x4 && n3.texSubImage2D(e32.TEXTURE_2D, 0, 0, 0, m3, h3, p3);
        } else n3.texImage2D(e32.TEXTURE_2D, 0, g3, m3, h3, p3);
        T3(o4) && E3(c4), d3.__version = u3.version, o4.onUpdate && o4.onUpdate(o4);
      }
      t4.__version = o4.version;
    }
    function L3(t4, o4, s4) {
      if (o4.image.length !== 6) return;
      let c4 = pe3(t4, o4), l3 = o4.source;
      n3.bindTexture(e32.TEXTURE_CUBE_MAP, t4.__webglTexture, e32.TEXTURE0 + s4);
      let u3 = r3.get(l3);
      if (l3.version !== u3.__version || c4 === true) {
        n3.activeTexture(e32.TEXTURE0 + s4);
        let t5 = K.getPrimaries(K.workingColorSpace), r4 = o4.colorSpace === `` ? null : K.getPrimaries(o4.colorSpace), d3 = o4.colorSpace === `` || t5 === r4 ? e32.NONE : e32.BROWSER_DEFAULT_WEBGL;
        e32.pixelStorei(e32.UNPACK_FLIP_Y_WEBGL, o4.flipY), e32.pixelStorei(e32.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o4.premultiplyAlpha), e32.pixelStorei(e32.UNPACK_ALIGNMENT, o4.unpackAlignment), e32.pixelStorei(e32.UNPACK_COLORSPACE_CONVERSION_WEBGL, d3);
        let f3 = o4.isCompressedTexture || o4.image[0].isCompressedTexture, p3 = o4.image[0] && o4.image[0].isDataTexture, m3 = [];
        for (let e33 = 0; e33 < 6; e33++) !f3 && !p3 ? m3[e33] = w3(o4.image[e33], true, i3.maxCubemapSize) : m3[e33] = p3 ? o4.image[e33].image : o4.image[e33], m3[e33] = Te3(o4, m3[e33]);
        let h3 = m3[0], g3 = a3.convert(o4.format, o4.colorSpace), _3 = a3.convert(o4.type), v4 = O3(o4.internalFormat, g3, _3, o4.colorSpace), y4 = o4.isVideoTexture !== true, b4 = u3.__version === void 0 || c4 === true, x4 = l3.dataReady, S4 = A4(o4, h3);
        fe3(e32.TEXTURE_CUBE_MAP, o4);
        let C4;
        if (f3) {
          y4 && b4 && n3.texStorage2D(e32.TEXTURE_CUBE_MAP, S4, v4, h3.width, h3.height);
          for (let t6 = 0; t6 < 6; t6++) {
            C4 = m3[t6].mipmaps;
            for (let r5 = 0; r5 < C4.length; r5++) {
              let i4 = C4[r5];
              o4.format === 1023 ? y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5, 0, 0, i4.width, i4.height, g3, _3, i4.data) : n3.texImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5, v4, i4.width, i4.height, 0, g3, _3, i4.data) : g3 === null ? console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`) : y4 ? x4 && n3.compressedTexSubImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5, 0, 0, i4.width, i4.height, g3, i4.data) : n3.compressedTexImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5, v4, i4.width, i4.height, 0, i4.data);
            }
          }
        } else {
          if (C4 = o4.mipmaps, y4 && b4) {
            C4.length > 0 && S4++;
            let t6 = Ee3(m3[0]);
            n3.texStorage2D(e32.TEXTURE_CUBE_MAP, S4, v4, t6.width, t6.height);
          }
          for (let t6 = 0; t6 < 6; t6++) if (p3) {
            y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, 0, 0, 0, m3[t6].width, m3[t6].height, g3, _3, m3[t6].data) : n3.texImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, 0, v4, m3[t6].width, m3[t6].height, 0, g3, _3, m3[t6].data);
            for (let r5 = 0; r5 < C4.length; r5++) {
              let i4 = C4[r5].image[t6].image;
              y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5 + 1, 0, 0, i4.width, i4.height, g3, _3, i4.data) : n3.texImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5 + 1, v4, i4.width, i4.height, 0, g3, _3, i4.data);
            }
          } else {
            y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, 0, 0, 0, g3, _3, m3[t6]) : n3.texImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, 0, v4, g3, _3, m3[t6]);
            for (let r5 = 0; r5 < C4.length; r5++) {
              let i4 = C4[r5];
              y4 ? x4 && n3.texSubImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5 + 1, 0, 0, g3, _3, i4.image[t6]) : n3.texImage2D(e32.TEXTURE_CUBE_MAP_POSITIVE_X + t6, r5 + 1, v4, g3, _3, i4.image[t6]);
            }
          }
        }
        T3(o4) && E3(e32.TEXTURE_CUBE_MAP), u3.__version = l3.version, o4.onUpdate && o4.onUpdate(o4);
      }
      t4.__version = o4.version;
    }
    function R3(t4, i4, o4, c4, l3, u3) {
      let d3 = a3.convert(o4.format, o4.colorSpace), f3 = a3.convert(o4.type), p3 = O3(o4.internalFormat, d3, f3, o4.colorSpace), m3 = r3.get(i4), h3 = r3.get(o4);
      if (h3.__renderTarget = i4, !m3.__hasExternalTextures) {
        let t5 = Math.max(1, i4.width >> u3), r4 = Math.max(1, i4.height >> u3);
        l3 === e32.TEXTURE_3D || l3 === e32.TEXTURE_2D_ARRAY ? n3.texImage3D(l3, u3, p3, t5, r4, i4.depth, 0, d3, f3, null) : n3.texImage2D(l3, u3, p3, t5, r4, 0, d3, f3, null);
      }
      n3.bindFramebuffer(e32.FRAMEBUFFER, t4), Ce3(i4) ? s3.framebufferTexture2DMultisampleEXT(e32.FRAMEBUFFER, c4, l3, h3.__webglTexture, 0, Se3(i4)) : (l3 === e32.TEXTURE_2D || l3 >= e32.TEXTURE_CUBE_MAP_POSITIVE_X && l3 <= e32.TEXTURE_CUBE_MAP_NEGATIVE_Z) && e32.framebufferTexture2D(e32.FRAMEBUFFER, c4, l3, h3.__webglTexture, u3), n3.bindFramebuffer(e32.FRAMEBUFFER, null);
    }
    function z3(t4, n4, r4) {
      if (e32.bindRenderbuffer(e32.RENDERBUFFER, t4), n4.depthBuffer) {
        let i4 = n4.depthTexture, a4 = i4 && i4.isDepthTexture ? i4.type : null, o4 = k3(n4.stencilBuffer, a4), c4 = n4.stencilBuffer ? e32.DEPTH_STENCIL_ATTACHMENT : e32.DEPTH_ATTACHMENT, l3 = Se3(n4);
        Ce3(n4) ? s3.renderbufferStorageMultisampleEXT(e32.RENDERBUFFER, l3, o4, n4.width, n4.height) : r4 ? e32.renderbufferStorageMultisample(e32.RENDERBUFFER, l3, o4, n4.width, n4.height) : e32.renderbufferStorage(e32.RENDERBUFFER, o4, n4.width, n4.height), e32.framebufferRenderbuffer(e32.FRAMEBUFFER, c4, e32.RENDERBUFFER, t4);
      } else {
        let t5 = n4.textures;
        for (let i4 = 0; i4 < t5.length; i4++) {
          let o4 = t5[i4], c4 = a3.convert(o4.format, o4.colorSpace), l3 = a3.convert(o4.type), u3 = O3(o4.internalFormat, c4, l3, o4.colorSpace), d3 = Se3(n4);
          r4 && Ce3(n4) === false ? e32.renderbufferStorageMultisample(e32.RENDERBUFFER, d3, u3, n4.width, n4.height) : Ce3(n4) ? s3.renderbufferStorageMultisampleEXT(e32.RENDERBUFFER, d3, u3, n4.width, n4.height) : e32.renderbufferStorage(e32.RENDERBUFFER, u3, n4.width, n4.height);
        }
      }
      e32.bindRenderbuffer(e32.RENDERBUFFER, null);
    }
    function ge3(t4, i4) {
      if (i4 && i4.isWebGLCubeRenderTarget) throw Error(`Depth Texture with cube render targets is not supported`);
      if (n3.bindFramebuffer(e32.FRAMEBUFFER, t4), !(i4.depthTexture && i4.depthTexture.isDepthTexture)) throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);
      let a4 = r3.get(i4.depthTexture);
      a4.__renderTarget = i4, (!a4.__webglTexture || i4.depthTexture.image.width !== i4.width || i4.depthTexture.image.height !== i4.height) && (i4.depthTexture.image.width = i4.width, i4.depthTexture.image.height = i4.height, i4.depthTexture.needsUpdate = true), oe3(i4.depthTexture, 0);
      let o4 = a4.__webglTexture, c4 = Se3(i4);
      if (i4.depthTexture.format === 1026) Ce3(i4) ? s3.framebufferTexture2DMultisampleEXT(e32.FRAMEBUFFER, e32.DEPTH_ATTACHMENT, e32.TEXTURE_2D, o4, 0, c4) : e32.framebufferTexture2D(e32.FRAMEBUFFER, e32.DEPTH_ATTACHMENT, e32.TEXTURE_2D, o4, 0);
      else if (i4.depthTexture.format === 1027) Ce3(i4) ? s3.framebufferTexture2DMultisampleEXT(e32.FRAMEBUFFER, e32.DEPTH_STENCIL_ATTACHMENT, e32.TEXTURE_2D, o4, 0, c4) : e32.framebufferTexture2D(e32.FRAMEBUFFER, e32.DEPTH_STENCIL_ATTACHMENT, e32.TEXTURE_2D, o4, 0);
      else throw Error(`Unknown depthTexture format`);
    }
    function B3(t4) {
      let i4 = r3.get(t4), a4 = t4.isWebGLCubeRenderTarget === true;
      if (i4.__boundDepthTexture !== t4.depthTexture) {
        let e33 = t4.depthTexture;
        if (i4.__depthDisposeCallback && i4.__depthDisposeCallback(), e33) {
          let t5 = () => {
            delete i4.__boundDepthTexture, delete i4.__depthDisposeCallback, e33.removeEventListener(`dispose`, t5);
          };
          e33.addEventListener(`dispose`, t5), i4.__depthDisposeCallback = t5;
        }
        i4.__boundDepthTexture = e33;
      }
      if (t4.depthTexture && !i4.__autoAllocateDepthBuffer) {
        if (a4) throw Error(`target.depthTexture not supported in Cube render targets`);
        let e33 = t4.texture.mipmaps;
        e33 && e33.length > 0 ? ge3(i4.__webglFramebuffer[0], t4) : ge3(i4.__webglFramebuffer, t4);
      } else if (a4) {
        i4.__webglDepthbuffer = [];
        for (let r4 = 0; r4 < 6; r4++) if (n3.bindFramebuffer(e32.FRAMEBUFFER, i4.__webglFramebuffer[r4]), i4.__webglDepthbuffer[r4] === void 0) i4.__webglDepthbuffer[r4] = e32.createRenderbuffer(), z3(i4.__webglDepthbuffer[r4], t4, false);
        else {
          let n4 = t4.stencilBuffer ? e32.DEPTH_STENCIL_ATTACHMENT : e32.DEPTH_ATTACHMENT, a5 = i4.__webglDepthbuffer[r4];
          e32.bindRenderbuffer(e32.RENDERBUFFER, a5), e32.framebufferRenderbuffer(e32.FRAMEBUFFER, n4, e32.RENDERBUFFER, a5);
        }
      } else {
        let r4 = t4.texture.mipmaps;
        if (r4 && r4.length > 0 ? n3.bindFramebuffer(e32.FRAMEBUFFER, i4.__webglFramebuffer[0]) : n3.bindFramebuffer(e32.FRAMEBUFFER, i4.__webglFramebuffer), i4.__webglDepthbuffer === void 0) i4.__webglDepthbuffer = e32.createRenderbuffer(), z3(i4.__webglDepthbuffer, t4, false);
        else {
          let n4 = t4.stencilBuffer ? e32.DEPTH_STENCIL_ATTACHMENT : e32.DEPTH_ATTACHMENT, r5 = i4.__webglDepthbuffer;
          e32.bindRenderbuffer(e32.RENDERBUFFER, r5), e32.framebufferRenderbuffer(e32.FRAMEBUFFER, n4, e32.RENDERBUFFER, r5);
        }
      }
      n3.bindFramebuffer(e32.FRAMEBUFFER, null);
    }
    function V3(t4, n4, i4) {
      let a4 = r3.get(t4);
      n4 !== void 0 && R3(a4.__webglFramebuffer, t4, t4.texture, e32.COLOR_ATTACHMENT0, e32.TEXTURE_2D, 0), i4 !== void 0 && B3(t4);
    }
    function _e3(t4) {
      let i4 = t4.texture, s4 = r3.get(t4), c4 = r3.get(i4);
      t4.addEventListener(`dispose`, ee3);
      let l3 = t4.textures, u3 = t4.isWebGLCubeRenderTarget === true, d3 = l3.length > 1;
      if (d3 || (c4.__webglTexture === void 0 && (c4.__webglTexture = e32.createTexture()), c4.__version = i4.version, o3.memory.textures++), u3) {
        s4.__webglFramebuffer = [];
        for (let t5 = 0; t5 < 6; t5++) if (i4.mipmaps && i4.mipmaps.length > 0) {
          s4.__webglFramebuffer[t5] = [];
          for (let n4 = 0; n4 < i4.mipmaps.length; n4++) s4.__webglFramebuffer[t5][n4] = e32.createFramebuffer();
        } else s4.__webglFramebuffer[t5] = e32.createFramebuffer();
      } else {
        if (i4.mipmaps && i4.mipmaps.length > 0) {
          s4.__webglFramebuffer = [];
          for (let t5 = 0; t5 < i4.mipmaps.length; t5++) s4.__webglFramebuffer[t5] = e32.createFramebuffer();
        } else s4.__webglFramebuffer = e32.createFramebuffer();
        if (d3) for (let t5 = 0, n4 = l3.length; t5 < n4; t5++) {
          let n5 = r3.get(l3[t5]);
          n5.__webglTexture === void 0 && (n5.__webglTexture = e32.createTexture(), o3.memory.textures++);
        }
        if (t4.samples > 0 && Ce3(t4) === false) {
          s4.__webglMultisampledFramebuffer = e32.createFramebuffer(), s4.__webglColorRenderbuffer = [], n3.bindFramebuffer(e32.FRAMEBUFFER, s4.__webglMultisampledFramebuffer);
          for (let n4 = 0; n4 < l3.length; n4++) {
            let r4 = l3[n4];
            s4.__webglColorRenderbuffer[n4] = e32.createRenderbuffer(), e32.bindRenderbuffer(e32.RENDERBUFFER, s4.__webglColorRenderbuffer[n4]);
            let i5 = a3.convert(r4.format, r4.colorSpace), o4 = a3.convert(r4.type), c5 = O3(r4.internalFormat, i5, o4, r4.colorSpace, t4.isXRRenderTarget === true), u4 = Se3(t4);
            e32.renderbufferStorageMultisample(e32.RENDERBUFFER, u4, c5, t4.width, t4.height), e32.framebufferRenderbuffer(e32.FRAMEBUFFER, e32.COLOR_ATTACHMENT0 + n4, e32.RENDERBUFFER, s4.__webglColorRenderbuffer[n4]);
          }
          e32.bindRenderbuffer(e32.RENDERBUFFER, null), t4.depthBuffer && (s4.__webglDepthRenderbuffer = e32.createRenderbuffer(), z3(s4.__webglDepthRenderbuffer, t4, true)), n3.bindFramebuffer(e32.FRAMEBUFFER, null);
        }
      }
      if (u3) {
        n3.bindTexture(e32.TEXTURE_CUBE_MAP, c4.__webglTexture), fe3(e32.TEXTURE_CUBE_MAP, i4);
        for (let n4 = 0; n4 < 6; n4++) if (i4.mipmaps && i4.mipmaps.length > 0) for (let r4 = 0; r4 < i4.mipmaps.length; r4++) R3(s4.__webglFramebuffer[n4][r4], t4, i4, e32.COLOR_ATTACHMENT0, e32.TEXTURE_CUBE_MAP_POSITIVE_X + n4, r4);
        else R3(s4.__webglFramebuffer[n4], t4, i4, e32.COLOR_ATTACHMENT0, e32.TEXTURE_CUBE_MAP_POSITIVE_X + n4, 0);
        T3(i4) && E3(e32.TEXTURE_CUBE_MAP), n3.unbindTexture();
      } else if (d3) {
        for (let i5 = 0, a4 = l3.length; i5 < a4; i5++) {
          let a5 = l3[i5], o4 = r3.get(a5), c5 = e32.TEXTURE_2D;
          (t4.isWebGL3DRenderTarget || t4.isWebGLArrayRenderTarget) && (c5 = t4.isWebGL3DRenderTarget ? e32.TEXTURE_3D : e32.TEXTURE_2D_ARRAY), n3.bindTexture(c5, o4.__webglTexture), fe3(c5, a5), R3(s4.__webglFramebuffer, t4, a5, e32.COLOR_ATTACHMENT0 + i5, c5, 0), T3(a5) && E3(c5);
        }
        n3.unbindTexture();
      } else {
        let r4 = e32.TEXTURE_2D;
        if ((t4.isWebGL3DRenderTarget || t4.isWebGLArrayRenderTarget) && (r4 = t4.isWebGL3DRenderTarget ? e32.TEXTURE_3D : e32.TEXTURE_2D_ARRAY), n3.bindTexture(r4, c4.__webglTexture), fe3(r4, i4), i4.mipmaps && i4.mipmaps.length > 0) for (let n4 = 0; n4 < i4.mipmaps.length; n4++) R3(s4.__webglFramebuffer[n4], t4, i4, e32.COLOR_ATTACHMENT0, r4, n4);
        else R3(s4.__webglFramebuffer, t4, i4, e32.COLOR_ATTACHMENT0, r4, 0);
        T3(i4) && E3(r4), n3.unbindTexture();
      }
      t4.depthBuffer && B3(t4);
    }
    function ve3(e33) {
      let t4 = e33.textures;
      for (let i4 = 0, a4 = t4.length; i4 < a4; i4++) {
        let a5 = t4[i4];
        if (T3(a5)) {
          let t5 = D3(e33), i5 = r3.get(a5).__webglTexture;
          n3.bindTexture(t5, i5), E3(t5), n3.unbindTexture();
        }
      }
    }
    let ye3 = [], be3 = [];
    function xe3(t4) {
      if (t4.samples > 0) {
        if (Ce3(t4) === false) {
          let i4 = t4.textures, a4 = t4.width, o4 = t4.height, s4 = e32.COLOR_BUFFER_BIT, l3 = t4.stencilBuffer ? e32.DEPTH_STENCIL_ATTACHMENT : e32.DEPTH_ATTACHMENT, u3 = r3.get(t4), d3 = i4.length > 1;
          if (d3) for (let t5 = 0; t5 < i4.length; t5++) n3.bindFramebuffer(e32.FRAMEBUFFER, u3.__webglMultisampledFramebuffer), e32.framebufferRenderbuffer(e32.FRAMEBUFFER, e32.COLOR_ATTACHMENT0 + t5, e32.RENDERBUFFER, null), n3.bindFramebuffer(e32.FRAMEBUFFER, u3.__webglFramebuffer), e32.framebufferTexture2D(e32.DRAW_FRAMEBUFFER, e32.COLOR_ATTACHMENT0 + t5, e32.TEXTURE_2D, null, 0);
          n3.bindFramebuffer(e32.READ_FRAMEBUFFER, u3.__webglMultisampledFramebuffer);
          let f3 = t4.texture.mipmaps;
          f3 && f3.length > 0 ? n3.bindFramebuffer(e32.DRAW_FRAMEBUFFER, u3.__webglFramebuffer[0]) : n3.bindFramebuffer(e32.DRAW_FRAMEBUFFER, u3.__webglFramebuffer);
          for (let n4 = 0; n4 < i4.length; n4++) {
            if (t4.resolveDepthBuffer && (t4.depthBuffer && (s4 |= e32.DEPTH_BUFFER_BIT), t4.stencilBuffer && t4.resolveStencilBuffer && (s4 |= e32.STENCIL_BUFFER_BIT)), d3) {
              e32.framebufferRenderbuffer(e32.READ_FRAMEBUFFER, e32.COLOR_ATTACHMENT0, e32.RENDERBUFFER, u3.__webglColorRenderbuffer[n4]);
              let t5 = r3.get(i4[n4]).__webglTexture;
              e32.framebufferTexture2D(e32.DRAW_FRAMEBUFFER, e32.COLOR_ATTACHMENT0, e32.TEXTURE_2D, t5, 0);
            }
            e32.blitFramebuffer(0, 0, a4, o4, 0, 0, a4, o4, s4, e32.NEAREST), c3 === true && (ye3.length = 0, be3.length = 0, ye3.push(e32.COLOR_ATTACHMENT0 + n4), t4.depthBuffer && t4.resolveDepthBuffer === false && (ye3.push(l3), be3.push(l3), e32.invalidateFramebuffer(e32.DRAW_FRAMEBUFFER, be3)), e32.invalidateFramebuffer(e32.READ_FRAMEBUFFER, ye3));
          }
          if (n3.bindFramebuffer(e32.READ_FRAMEBUFFER, null), n3.bindFramebuffer(e32.DRAW_FRAMEBUFFER, null), d3) for (let t5 = 0; t5 < i4.length; t5++) {
            n3.bindFramebuffer(e32.FRAMEBUFFER, u3.__webglMultisampledFramebuffer), e32.framebufferRenderbuffer(e32.FRAMEBUFFER, e32.COLOR_ATTACHMENT0 + t5, e32.RENDERBUFFER, u3.__webglColorRenderbuffer[t5]);
            let a5 = r3.get(i4[t5]).__webglTexture;
            n3.bindFramebuffer(e32.FRAMEBUFFER, u3.__webglFramebuffer), e32.framebufferTexture2D(e32.DRAW_FRAMEBUFFER, e32.COLOR_ATTACHMENT0 + t5, e32.TEXTURE_2D, a5, 0);
          }
          n3.bindFramebuffer(e32.DRAW_FRAMEBUFFER, u3.__webglMultisampledFramebuffer);
        } else if (t4.depthBuffer && t4.resolveDepthBuffer === false && c3) {
          let n4 = t4.stencilBuffer ? e32.DEPTH_STENCIL_ATTACHMENT : e32.DEPTH_ATTACHMENT;
          e32.invalidateFramebuffer(e32.DRAW_FRAMEBUFFER, [n4]);
        }
      }
    }
    function Se3(e33) {
      return Math.min(i3.maxSamples, e33.samples);
    }
    function Ce3(e33) {
      let n4 = r3.get(e33);
      return e33.samples > 0 && t3.has(`WEBGL_multisampled_render_to_texture`) === true && n4.__useRenderToTexture !== false;
    }
    function we3(e33) {
      let t4 = o3.render.frame;
      y3.get(e33) !== t4 && (y3.set(e33, t4), e33.update());
    }
    function Te3(e33, t4) {
      let n4 = e33.colorSpace, r4 = e33.format, i4 = e33.type;
      return e33.isCompressedTexture === true || e33.isVideoTexture === true || n4 !== `srgb-linear` && n4 !== `` && (K.getTransfer(n4) === `srgb` ? (r4 !== 1023 || i4 !== 1009) && console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`) : console.error(`THREE.WebGLTextures: Unsupported texture color space:`, n4)), t4;
    }
    function Ee3(e33) {
      return typeof HTMLImageElement < `u` && e33 instanceof HTMLImageElement ? (v3.width = e33.naturalWidth || e33.width, v3.height = e33.naturalHeight || e33.height) : typeof VideoFrame < `u` && e33 instanceof VideoFrame ? (v3.width = e33.displayWidth, v3.height = e33.displayHeight) : (v3.width = e33.width, v3.height = e33.height), v3;
    }
    this.allocateTextureUnit = ie3, this.resetTextureUnits = re3, this.setTexture2D = oe3, this.setTexture2DArray = se3, this.setTexture3D = F3, this.setTextureCube = ce3, this.rebindTextures = V3, this.setupRenderTarget = _e3, this.updateRenderTargetMipmap = ve3, this.updateMultisampleRenderTarget = xe3, this.setupDepthRenderbuffer = B3, this.setupFrameBufferTexture = R3, this.useMultisampledRTT = Ce3;
  }
  function qs(e32, t3) {
    function n3(n4, r3 = ``) {
      let i3, a3 = K.getTransfer(r3);
      if (n4 === 1009) return e32.UNSIGNED_BYTE;
      if (n4 === 1017) return e32.UNSIGNED_SHORT_4_4_4_4;
      if (n4 === 1018) return e32.UNSIGNED_SHORT_5_5_5_1;
      if (n4 === 35902) return e32.UNSIGNED_INT_5_9_9_9_REV;
      if (n4 === 35899) return e32.UNSIGNED_INT_10F_11F_11F_REV;
      if (n4 === 1010) return e32.BYTE;
      if (n4 === 1011) return e32.SHORT;
      if (n4 === 1012) return e32.UNSIGNED_SHORT;
      if (n4 === 1013) return e32.INT;
      if (n4 === 1014) return e32.UNSIGNED_INT;
      if (n4 === 1015) return e32.FLOAT;
      if (n4 === 1016) return e32.HALF_FLOAT;
      if (n4 === 1021) return e32.ALPHA;
      if (n4 === 1022) return e32.RGB;
      if (n4 === 1023) return e32.RGBA;
      if (n4 === 1026) return e32.DEPTH_COMPONENT;
      if (n4 === 1027) return e32.DEPTH_STENCIL;
      if (n4 === 1028) return e32.RED;
      if (n4 === 1029) return e32.RED_INTEGER;
      if (n4 === 1030) return e32.RG;
      if (n4 === 1031) return e32.RG_INTEGER;
      if (n4 === 1033) return e32.RGBA_INTEGER;
      if (n4 === 33776 || n4 === 33777 || n4 === 33778 || n4 === 33779) if (a3 === `srgb`) if (i3 = t3.get(`WEBGL_compressed_texture_s3tc_srgb`), i3 !== null) {
        if (n4 === 33776) return i3.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        if (n4 === 33777) return i3.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        if (n4 === 33778) return i3.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        if (n4 === 33779) return i3.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
      } else return null;
      else if (i3 = t3.get(`WEBGL_compressed_texture_s3tc`), i3 !== null) {
        if (n4 === 33776) return i3.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n4 === 33777) return i3.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n4 === 33778) return i3.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n4 === 33779) return i3.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
      if (n4 === 35840 || n4 === 35841 || n4 === 35842 || n4 === 35843) if (i3 = t3.get(`WEBGL_compressed_texture_pvrtc`), i3 !== null) {
        if (n4 === 35840) return i3.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n4 === 35841) return i3.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n4 === 35842) return i3.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n4 === 35843) return i3.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
      if (n4 === 36196 || n4 === 37492 || n4 === 37496) if (i3 = t3.get(`WEBGL_compressed_texture_etc`), i3 !== null) {
        if (n4 === 36196 || n4 === 37492) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ETC2 : i3.COMPRESSED_RGB8_ETC2;
        if (n4 === 37496) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i3.COMPRESSED_RGBA8_ETC2_EAC;
      } else return null;
      if (n4 === 37808 || n4 === 37809 || n4 === 37810 || n4 === 37811 || n4 === 37812 || n4 === 37813 || n4 === 37814 || n4 === 37815 || n4 === 37816 || n4 === 37817 || n4 === 37818 || n4 === 37819 || n4 === 37820 || n4 === 37821) if (i3 = t3.get(`WEBGL_compressed_texture_astc`), i3 !== null) {
        if (n4 === 37808) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i3.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n4 === 37809) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i3.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n4 === 37810) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i3.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n4 === 37811) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i3.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n4 === 37812) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i3.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n4 === 37813) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i3.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n4 === 37814) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i3.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n4 === 37815) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i3.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n4 === 37816) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i3.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n4 === 37817) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i3.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n4 === 37818) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i3.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n4 === 37819) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i3.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n4 === 37820) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i3.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n4 === 37821) return a3 === `srgb` ? i3.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i3.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
      if (n4 === 36492 || n4 === 36494 || n4 === 36495) if (i3 = t3.get(`EXT_texture_compression_bptc`), i3 !== null) {
        if (n4 === 36492) return a3 === `srgb` ? i3.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i3.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n4 === 36494) return i3.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n4 === 36495) return i3.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
      if (n4 === 36283 || n4 === 36284 || n4 === 36285 || n4 === 36286) if (i3 = t3.get(`EXT_texture_compression_rgtc`), i3 !== null) {
        if (n4 === 36283) return i3.COMPRESSED_RED_RGTC1_EXT;
        if (n4 === 36284) return i3.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n4 === 36285) return i3.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n4 === 36286) return i3.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
      return n4 === 1020 ? e32.UNSIGNED_INT_24_8 : e32[n4] === void 0 ? null : e32[n4];
    }
    return { convert: n3 };
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
    init(e32, t3) {
      if (this.texture === null) {
        let n3 = new mi(e32.texture);
        (e32.depthNear !== t3.depthNear || e32.depthFar !== t3.depthFar) && (this.depthNear = e32.depthNear, this.depthFar = e32.depthFar), this.texture = n3;
      }
    }
    getMesh(e32) {
      if (this.texture !== null && this.mesh === null) {
        let t3 = e32.cameras[0].viewport, n3 = new Ir({ vertexShader: Js, fragmentShader: Ys, uniforms: { depthColor: { value: this.texture }, depthWidth: { value: t3.z }, depthHeight: { value: t3.w } } });
        this.mesh = new Tr(new hi(20, 20), n3);
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
    constructor(e32, t3) {
      super();
      let n3 = this, r3 = null, i3 = 1, a3 = null, o3 = `local-floor`, s3 = 1, c3 = null, l3 = null, u3 = null, d3 = null, f3 = null, p3 = null, m3 = typeof XRWebGLBinding < `u`, h3 = new Xs(), g3 = {}, _3 = t3.getContextAttributes(), y3 = null, b3 = null, x3 = [], S3 = [], w3 = new U(), T3 = null, E3 = new Vr();
      E3.viewport = new wt();
      let D3 = new Vr();
      D3.viewport = new wt();
      let k3 = [E3, D3], A4 = new Fi(), j4 = null, ee3 = null;
      this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(e33) {
        let t4 = x3[e33];
        return t4 === void 0 && (t4 = new Yr(), x3[e33] = t4), t4.getTargetRaySpace();
      }, this.getControllerGrip = function(e33) {
        let t4 = x3[e33];
        return t4 === void 0 && (t4 = new Yr(), x3[e33] = t4), t4.getGripSpace();
      }, this.getHand = function(e33) {
        let t4 = x3[e33];
        return t4 === void 0 && (t4 = new Yr(), x3[e33] = t4), t4.getHandSpace();
      };
      function P3(e33) {
        let t4 = S3.indexOf(e33.inputSource);
        if (t4 === -1) return;
        let n4 = x3[t4];
        n4 !== void 0 && (n4.update(e33.inputSource, e33.frame, c3 || a3), n4.dispatchEvent({ type: e33.type, data: e33.inputSource }));
      }
      function ne3() {
        r3.removeEventListener(`select`, P3), r3.removeEventListener(`selectstart`, P3), r3.removeEventListener(`selectend`, P3), r3.removeEventListener(`squeeze`, P3), r3.removeEventListener(`squeezestart`, P3), r3.removeEventListener(`squeezeend`, P3), r3.removeEventListener(`end`, ne3), r3.removeEventListener(`inputsourceschange`, re3);
        for (let e33 = 0; e33 < x3.length; e33++) {
          let t4 = S3[e33];
          t4 !== null && (S3[e33] = null, x3[e33].disconnect(t4));
        }
        j4 = null, ee3 = null, h3.reset();
        for (let e33 in g3) delete g3[e33];
        e32.setRenderTarget(y3), f3 = null, d3 = null, u3 = null, r3 = null, b3 = null, ue3.stop(), n3.isPresenting = false, e32.setPixelRatio(T3), e32.setSize(w3.width, w3.height, false), n3.dispatchEvent({ type: `sessionend` });
      }
      this.setFramebufferScaleFactor = function(e33) {
        i3 = e33, n3.isPresenting === true && console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`);
      }, this.setReferenceSpaceType = function(e33) {
        o3 = e33, n3.isPresenting === true && console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`);
      }, this.getReferenceSpace = function() {
        return c3 || a3;
      }, this.setReferenceSpace = function(e33) {
        c3 = e33;
      }, this.getBaseLayer = function() {
        return d3 === null ? f3 : d3;
      }, this.getBinding = function() {
        return u3 === null && m3 && (u3 = new XRWebGLBinding(r3, t3)), u3;
      }, this.getFrame = function() {
        return p3;
      }, this.getSession = function() {
        return r3;
      }, this.setSession = async function(l4) {
        if (r3 = l4, r3 !== null) {
          if (y3 = e32.getRenderTarget(), r3.addEventListener(`select`, P3), r3.addEventListener(`selectstart`, P3), r3.addEventListener(`selectend`, P3), r3.addEventListener(`squeeze`, P3), r3.addEventListener(`squeezestart`, P3), r3.addEventListener(`squeezeend`, P3), r3.addEventListener(`end`, ne3), r3.addEventListener(`inputsourceschange`, re3), _3.xrCompatible !== true && await t3.makeXRCompatible(), T3 = e32.getPixelRatio(), e32.getSize(w3), m3 && `createProjectionLayer` in XRWebGLBinding.prototype) {
            let n4 = null, a4 = null, o4 = null;
            _3.depth && (o4 = _3.stencil ? t3.DEPTH24_STENCIL8 : t3.DEPTH_COMPONENT24, n4 = _3.stencil ? N : M, a4 = _3.stencil ? O : C);
            let s4 = { colorFormat: t3.RGBA8, depthFormat: o4, scaleFactor: i3 };
            u3 = this.getBinding(), d3 = u3.createProjectionLayer(s4), r3.updateRenderState({ layers: [d3] }), e32.setPixelRatio(1), e32.setSize(d3.textureWidth, d3.textureHeight, false), b3 = new Et(d3.textureWidth, d3.textureHeight, { format: te, type: v, depthTexture: new pi(d3.textureWidth, d3.textureHeight, a4, void 0, void 0, void 0, void 0, void 0, void 0, n4), stencilBuffer: _3.stencil, colorSpace: e32.outputColorSpace, samples: _3.antialias ? 4 : 0, resolveDepthBuffer: d3.ignoreDepthValues === false, resolveStencilBuffer: d3.ignoreDepthValues === false });
          } else {
            let n4 = { antialias: _3.antialias, alpha: true, depth: _3.depth, stencil: _3.stencil, framebufferScaleFactor: i3 };
            f3 = new XRWebGLLayer(r3, t3, n4), r3.updateRenderState({ baseLayer: f3 }), e32.setPixelRatio(1), e32.setSize(f3.framebufferWidth, f3.framebufferHeight, false), b3 = new Et(f3.framebufferWidth, f3.framebufferHeight, { format: te, type: v, colorSpace: e32.outputColorSpace, stencilBuffer: _3.stencil, resolveDepthBuffer: f3.ignoreDepthValues === false, resolveStencilBuffer: f3.ignoreDepthValues === false });
          }
          b3.isXRRenderTarget = true, this.setFoveation(s3), c3 = null, a3 = await r3.requestReferenceSpace(o3), ue3.setContext(r3), ue3.start(), n3.isPresenting = true, n3.dispatchEvent({ type: `sessionstart` });
        }
      }, this.getEnvironmentBlendMode = function() {
        if (r3 !== null) return r3.environmentBlendMode;
      }, this.getDepthTexture = function() {
        return h3.getDepthTexture();
      };
      function re3(e33) {
        for (let t4 = 0; t4 < e33.removed.length; t4++) {
          let n4 = e33.removed[t4], r4 = S3.indexOf(n4);
          r4 >= 0 && (S3[r4] = null, x3[r4].disconnect(n4));
        }
        for (let t4 = 0; t4 < e33.added.length; t4++) {
          let n4 = e33.added[t4], r4 = S3.indexOf(n4);
          if (r4 === -1) {
            for (let e34 = 0; e34 < x3.length; e34++) if (e34 >= S3.length) {
              S3.push(n4), r4 = e34;
              break;
            } else if (S3[e34] === null) {
              S3[e34] = n4, r4 = e34;
              break;
            }
            if (r4 === -1) break;
          }
          let i4 = x3[r4];
          i4 && i4.connect(n4);
        }
      }
      let ie3 = new W(), ae3 = new W();
      function oe3(e33, t4, n4) {
        ie3.setFromMatrixPosition(t4.matrixWorld), ae3.setFromMatrixPosition(n4.matrixWorld);
        let r4 = ie3.distanceTo(ae3), i4 = t4.projectionMatrix.elements, a4 = n4.projectionMatrix.elements, o4 = i4[14] / (i4[10] - 1), s4 = i4[14] / (i4[10] + 1), c4 = (i4[9] + 1) / i4[5], l4 = (i4[9] - 1) / i4[5], u4 = (i4[8] - 1) / i4[0], d4 = (a4[8] + 1) / a4[0], f4 = o4 * u4, p4 = o4 * d4, m4 = r4 / (-u4 + d4), h4 = m4 * -u4;
        if (t4.matrixWorld.decompose(e33.position, e33.quaternion, e33.scale), e33.translateX(h4), e33.translateZ(m4), e33.matrixWorld.compose(e33.position, e33.quaternion, e33.scale), e33.matrixWorldInverse.copy(e33.matrixWorld).invert(), i4[10] === -1) e33.projectionMatrix.copy(t4.projectionMatrix), e33.projectionMatrixInverse.copy(t4.projectionMatrixInverse);
        else {
          let t5 = o4 + m4, n5 = s4 + m4, i5 = f4 - h4, a5 = p4 + (r4 - h4), u5 = c4 * s4 / n5 * t5, d5 = l4 * s4 / n5 * t5;
          e33.projectionMatrix.makePerspective(i5, a5, u5, d5, t5, n5), e33.projectionMatrixInverse.copy(e33.projectionMatrix).invert();
        }
      }
      function se3(e33, t4) {
        t4 === null ? e33.matrixWorld.copy(e33.matrix) : e33.matrixWorld.multiplyMatrices(t4.matrixWorld, e33.matrix), e33.matrixWorldInverse.copy(e33.matrixWorld).invert();
      }
      this.updateCamera = function(e33) {
        if (r3 === null) return;
        let t4 = e33.near, n4 = e33.far;
        h3.texture !== null && (h3.depthNear > 0 && (t4 = h3.depthNear), h3.depthFar > 0 && (n4 = h3.depthFar)), A4.near = D3.near = E3.near = t4, A4.far = D3.far = E3.far = n4, (j4 !== A4.near || ee3 !== A4.far) && (r3.updateRenderState({ depthNear: A4.near, depthFar: A4.far }), j4 = A4.near, ee3 = A4.far), A4.layers.mask = e33.layers.mask | 6, E3.layers.mask = A4.layers.mask & 3, D3.layers.mask = A4.layers.mask & 5;
        let i4 = e33.parent, a4 = A4.cameras;
        se3(A4, i4);
        for (let e34 = 0; e34 < a4.length; e34++) se3(a4[e34], i4);
        a4.length === 2 ? oe3(A4, E3, D3) : A4.projectionMatrix.copy(E3.projectionMatrix), F3(e33, A4, i4);
      };
      function F3(e33, t4, n4) {
        n4 === null ? e33.matrix.copy(t4.matrixWorld) : (e33.matrix.copy(n4.matrixWorld), e33.matrix.invert(), e33.matrix.multiply(t4.matrixWorld)), e33.matrix.decompose(e33.position, e33.quaternion, e33.scale), e33.updateMatrixWorld(true), e33.projectionMatrix.copy(t4.projectionMatrix), e33.projectionMatrixInverse.copy(t4.projectionMatrixInverse), e33.isPerspectiveCamera && (e33.fov = Ye * 2 * Math.atan(1 / e33.projectionMatrix.elements[5]), e33.zoom = 1);
      }
      this.getCamera = function() {
        return A4;
      }, this.getFoveation = function() {
        if (!(d3 === null && f3 === null)) return s3;
      }, this.setFoveation = function(e33) {
        s3 = e33, d3 !== null && (d3.fixedFoveation = e33), f3 !== null && f3.fixedFoveation !== void 0 && (f3.fixedFoveation = e33);
      }, this.hasDepthSensing = function() {
        return h3.texture !== null;
      }, this.getDepthSensingMesh = function() {
        return h3.getMesh(A4);
      }, this.getCameraTexture = function(e33) {
        return g3[e33];
      };
      let ce3 = null;
      function le3(t4, i4) {
        if (l3 = i4.getViewerPose(c3 || a3), p3 = i4, l3 !== null) {
          let t5 = l3.views;
          f3 !== null && (e32.setRenderTargetFramebuffer(b3, f3.framebuffer), e32.setRenderTarget(b3));
          let i5 = false;
          t5.length !== A4.cameras.length && (A4.cameras.length = 0, i5 = true);
          for (let n4 = 0; n4 < t5.length; n4++) {
            let r4 = t5[n4], a5 = null;
            if (f3 !== null) a5 = f3.getViewport(r4);
            else {
              let t6 = u3.getViewSubImage(d3, r4);
              a5 = t6.viewport, n4 === 0 && (e32.setRenderTargetTextures(b3, t6.colorTexture, t6.depthStencilTexture), e32.setRenderTarget(b3));
            }
            let o4 = k3[n4];
            o4 === void 0 && (o4 = new Vr(), o4.layers.enable(n4), o4.viewport = new wt(), k3[n4] = o4), o4.matrix.fromArray(r4.transform.matrix), o4.matrix.decompose(o4.position, o4.quaternion, o4.scale), o4.projectionMatrix.fromArray(r4.projectionMatrix), o4.projectionMatrixInverse.copy(o4.projectionMatrix).invert(), o4.viewport.set(a5.x, a5.y, a5.width, a5.height), n4 === 0 && (A4.matrix.copy(o4.matrix), A4.matrix.decompose(A4.position, A4.quaternion, A4.scale)), i5 === true && A4.cameras.push(o4);
          }
          let a4 = r3.enabledFeatures;
          if (a4 && a4.includes(`depth-sensing`) && r3.depthUsage == `gpu-optimized` && m3) {
            u3 = n3.getBinding();
            let e33 = u3.getDepthInformation(t5[0]);
            e33 && e33.isValid && e33.texture && h3.init(e33, r3.renderState);
          }
          if (a4 && a4.includes(`camera-access`) && m3) {
            e32.state.unbindTexture(), u3 = n3.getBinding();
            for (let e33 = 0; e33 < t5.length; e33++) {
              let n4 = t5[e33].camera;
              if (n4) {
                let e34 = g3[n4];
                e34 || (e34 = new mi(), g3[n4] = e34);
                let t6 = u3.getCameraImage(n4);
                e34.sourceTexture = t6;
              }
            }
          }
        }
        for (let e33 = 0; e33 < x3.length; e33++) {
          let t5 = S3[e33], n4 = x3[e33];
          t5 !== null && n4 !== void 0 && n4.update(t5, i4, c3 || a3);
        }
        ce3 && ce3(t4, i4), i4.detectedPlanes && n3.dispatchEvent({ type: `planesdetected`, data: i4 }), p3 = null;
      }
      let ue3 = new ea();
      ue3.setAnimationLoop(le3), this.setAnimationLoop = function(e33) {
        ce3 = e33;
      }, this.dispose = function() {
      };
    }
  };
  var Qs = new pn();
  var $s = new nn();
  function ec(e32, t3) {
    function n3(e33, t4) {
      e33.matrixAutoUpdate === true && e33.updateMatrix(), t4.value.copy(e33.matrix);
    }
    function r3(t4, n4) {
      n4.color.getRGB(t4.fogColor.value, Mr(e32)), n4.isFog ? (t4.fogNear.value = n4.near, t4.fogFar.value = n4.far) : n4.isFogExp2 && (t4.fogDensity.value = n4.density);
    }
    function i3(e33, t4, n4, r4, i4) {
      t4.isMeshBasicMaterial || t4.isMeshLambertMaterial ? a3(e33, t4) : t4.isMeshToonMaterial ? (a3(e33, t4), d3(e33, t4)) : t4.isMeshPhongMaterial ? (a3(e33, t4), u3(e33, t4)) : t4.isMeshStandardMaterial ? (a3(e33, t4), f3(e33, t4), t4.isMeshPhysicalMaterial && p3(e33, t4, i4)) : t4.isMeshMatcapMaterial ? (a3(e33, t4), m3(e33, t4)) : t4.isMeshDepthMaterial ? a3(e33, t4) : t4.isMeshDistanceMaterial ? (a3(e33, t4), h3(e33, t4)) : t4.isMeshNormalMaterial ? a3(e33, t4) : t4.isLineBasicMaterial ? (o3(e33, t4), t4.isLineDashedMaterial && s3(e33, t4)) : t4.isPointsMaterial ? c3(e33, t4, n4, r4) : t4.isSpriteMaterial ? l3(e33, t4) : t4.isShadowMaterial ? (e33.color.value.copy(t4.color), e33.opacity.value = t4.opacity) : t4.isShaderMaterial && (t4.uniformsNeedUpdate = false);
    }
    function a3(e33, r4) {
      e33.opacity.value = r4.opacity, r4.color && e33.diffuse.value.copy(r4.color), r4.emissive && e33.emissive.value.copy(r4.emissive).multiplyScalar(r4.emissiveIntensity), r4.map && (e33.map.value = r4.map, n3(r4.map, e33.mapTransform)), r4.alphaMap && (e33.alphaMap.value = r4.alphaMap, n3(r4.alphaMap, e33.alphaMapTransform)), r4.bumpMap && (e33.bumpMap.value = r4.bumpMap, n3(r4.bumpMap, e33.bumpMapTransform), e33.bumpScale.value = r4.bumpScale, r4.side === 1 && (e33.bumpScale.value *= -1)), r4.normalMap && (e33.normalMap.value = r4.normalMap, n3(r4.normalMap, e33.normalMapTransform), e33.normalScale.value.copy(r4.normalScale), r4.side === 1 && e33.normalScale.value.negate()), r4.displacementMap && (e33.displacementMap.value = r4.displacementMap, n3(r4.displacementMap, e33.displacementMapTransform), e33.displacementScale.value = r4.displacementScale, e33.displacementBias.value = r4.displacementBias), r4.emissiveMap && (e33.emissiveMap.value = r4.emissiveMap, n3(r4.emissiveMap, e33.emissiveMapTransform)), r4.specularMap && (e33.specularMap.value = r4.specularMap, n3(r4.specularMap, e33.specularMapTransform)), r4.alphaTest > 0 && (e33.alphaTest.value = r4.alphaTest);
      let i4 = t3.get(r4), a4 = i4.envMap, o4 = i4.envMapRotation;
      a4 && (e33.envMap.value = a4, Qs.copy(o4), Qs.x *= -1, Qs.y *= -1, Qs.z *= -1, a4.isCubeTexture && a4.isRenderTargetTexture === false && (Qs.y *= -1, Qs.z *= -1), e33.envMapRotation.value.setFromMatrix4($s.makeRotationFromEuler(Qs)), e33.flipEnvMap.value = a4.isCubeTexture && a4.isRenderTargetTexture === false ? -1 : 1, e33.reflectivity.value = r4.reflectivity, e33.ior.value = r4.ior, e33.refractionRatio.value = r4.refractionRatio), r4.lightMap && (e33.lightMap.value = r4.lightMap, e33.lightMapIntensity.value = r4.lightMapIntensity, n3(r4.lightMap, e33.lightMapTransform)), r4.aoMap && (e33.aoMap.value = r4.aoMap, e33.aoMapIntensity.value = r4.aoMapIntensity, n3(r4.aoMap, e33.aoMapTransform));
    }
    function o3(e33, t4) {
      e33.diffuse.value.copy(t4.color), e33.opacity.value = t4.opacity, t4.map && (e33.map.value = t4.map, n3(t4.map, e33.mapTransform));
    }
    function s3(e33, t4) {
      e33.dashSize.value = t4.dashSize, e33.totalSize.value = t4.dashSize + t4.gapSize, e33.scale.value = t4.scale;
    }
    function c3(e33, t4, r4, i4) {
      e33.diffuse.value.copy(t4.color), e33.opacity.value = t4.opacity, e33.size.value = t4.size * r4, e33.scale.value = i4 * 0.5, t4.map && (e33.map.value = t4.map, n3(t4.map, e33.uvTransform)), t4.alphaMap && (e33.alphaMap.value = t4.alphaMap, n3(t4.alphaMap, e33.alphaMapTransform)), t4.alphaTest > 0 && (e33.alphaTest.value = t4.alphaTest);
    }
    function l3(e33, t4) {
      e33.diffuse.value.copy(t4.color), e33.opacity.value = t4.opacity, e33.rotation.value = t4.rotation, t4.map && (e33.map.value = t4.map, n3(t4.map, e33.mapTransform)), t4.alphaMap && (e33.alphaMap.value = t4.alphaMap, n3(t4.alphaMap, e33.alphaMapTransform)), t4.alphaTest > 0 && (e33.alphaTest.value = t4.alphaTest);
    }
    function u3(e33, t4) {
      e33.specular.value.copy(t4.specular), e33.shininess.value = Math.max(t4.shininess, 1e-4);
    }
    function d3(e33, t4) {
      t4.gradientMap && (e33.gradientMap.value = t4.gradientMap);
    }
    function f3(e33, t4) {
      e33.metalness.value = t4.metalness, t4.metalnessMap && (e33.metalnessMap.value = t4.metalnessMap, n3(t4.metalnessMap, e33.metalnessMapTransform)), e33.roughness.value = t4.roughness, t4.roughnessMap && (e33.roughnessMap.value = t4.roughnessMap, n3(t4.roughnessMap, e33.roughnessMapTransform)), t4.envMap && (e33.envMapIntensity.value = t4.envMapIntensity);
    }
    function p3(e33, t4, r4) {
      e33.ior.value = t4.ior, t4.sheen > 0 && (e33.sheenColor.value.copy(t4.sheenColor).multiplyScalar(t4.sheen), e33.sheenRoughness.value = t4.sheenRoughness, t4.sheenColorMap && (e33.sheenColorMap.value = t4.sheenColorMap, n3(t4.sheenColorMap, e33.sheenColorMapTransform)), t4.sheenRoughnessMap && (e33.sheenRoughnessMap.value = t4.sheenRoughnessMap, n3(t4.sheenRoughnessMap, e33.sheenRoughnessMapTransform))), t4.clearcoat > 0 && (e33.clearcoat.value = t4.clearcoat, e33.clearcoatRoughness.value = t4.clearcoatRoughness, t4.clearcoatMap && (e33.clearcoatMap.value = t4.clearcoatMap, n3(t4.clearcoatMap, e33.clearcoatMapTransform)), t4.clearcoatRoughnessMap && (e33.clearcoatRoughnessMap.value = t4.clearcoatRoughnessMap, n3(t4.clearcoatRoughnessMap, e33.clearcoatRoughnessMapTransform)), t4.clearcoatNormalMap && (e33.clearcoatNormalMap.value = t4.clearcoatNormalMap, n3(t4.clearcoatNormalMap, e33.clearcoatNormalMapTransform), e33.clearcoatNormalScale.value.copy(t4.clearcoatNormalScale), t4.side === 1 && e33.clearcoatNormalScale.value.negate())), t4.dispersion > 0 && (e33.dispersion.value = t4.dispersion), t4.iridescence > 0 && (e33.iridescence.value = t4.iridescence, e33.iridescenceIOR.value = t4.iridescenceIOR, e33.iridescenceThicknessMinimum.value = t4.iridescenceThicknessRange[0], e33.iridescenceThicknessMaximum.value = t4.iridescenceThicknessRange[1], t4.iridescenceMap && (e33.iridescenceMap.value = t4.iridescenceMap, n3(t4.iridescenceMap, e33.iridescenceMapTransform)), t4.iridescenceThicknessMap && (e33.iridescenceThicknessMap.value = t4.iridescenceThicknessMap, n3(t4.iridescenceThicknessMap, e33.iridescenceThicknessMapTransform))), t4.transmission > 0 && (e33.transmission.value = t4.transmission, e33.transmissionSamplerMap.value = r4.texture, e33.transmissionSamplerSize.value.set(r4.width, r4.height), t4.transmissionMap && (e33.transmissionMap.value = t4.transmissionMap, n3(t4.transmissionMap, e33.transmissionMapTransform)), e33.thickness.value = t4.thickness, t4.thicknessMap && (e33.thicknessMap.value = t4.thicknessMap, n3(t4.thicknessMap, e33.thicknessMapTransform)), e33.attenuationDistance.value = t4.attenuationDistance, e33.attenuationColor.value.copy(t4.attenuationColor)), t4.anisotropy > 0 && (e33.anisotropyVector.value.set(t4.anisotropy * Math.cos(t4.anisotropyRotation), t4.anisotropy * Math.sin(t4.anisotropyRotation)), t4.anisotropyMap && (e33.anisotropyMap.value = t4.anisotropyMap, n3(t4.anisotropyMap, e33.anisotropyMapTransform))), e33.specularIntensity.value = t4.specularIntensity, e33.specularColor.value.copy(t4.specularColor), t4.specularColorMap && (e33.specularColorMap.value = t4.specularColorMap, n3(t4.specularColorMap, e33.specularColorMapTransform)), t4.specularIntensityMap && (e33.specularIntensityMap.value = t4.specularIntensityMap, n3(t4.specularIntensityMap, e33.specularIntensityMapTransform));
    }
    function m3(e33, t4) {
      t4.matcap && (e33.matcap.value = t4.matcap);
    }
    function h3(e33, n4) {
      let r4 = t3.get(n4).light;
      e33.referencePosition.value.setFromMatrixPosition(r4.matrixWorld), e33.nearDistance.value = r4.shadow.camera.near, e33.farDistance.value = r4.shadow.camera.far;
    }
    return { refreshFogUniforms: r3, refreshMaterialUniforms: i3 };
  }
  function tc(e32, t3, n3, r3) {
    let i3 = {}, a3 = {}, o3 = [], s3 = e32.getParameter(e32.MAX_UNIFORM_BUFFER_BINDINGS);
    function c3(e33, t4) {
      let n4 = t4.program;
      r3.uniformBlockBinding(e33, n4);
    }
    function l3(e33, n4) {
      let o4 = i3[e33.id];
      o4 === void 0 && (m3(e33), o4 = u3(e33), i3[e33.id] = o4, e33.addEventListener(`dispose`, g3));
      let s4 = n4.program;
      r3.updateUBOMapping(e33, s4);
      let c4 = t3.render.frame;
      a3[e33.id] !== c4 && (f3(e33), a3[e33.id] = c4);
    }
    function u3(t4) {
      let n4 = d3();
      t4.__bindingPointIndex = n4;
      let r4 = e32.createBuffer(), i4 = t4.__size, a4 = t4.usage;
      return e32.bindBuffer(e32.UNIFORM_BUFFER, r4), e32.bufferData(e32.UNIFORM_BUFFER, i4, a4), e32.bindBuffer(e32.UNIFORM_BUFFER, null), e32.bindBufferBase(e32.UNIFORM_BUFFER, n4, r4), r4;
    }
    function d3() {
      for (let e33 = 0; e33 < s3; e33++) if (o3.indexOf(e33) === -1) return o3.push(e33), e33;
      return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`), 0;
    }
    function f3(t4) {
      let n4 = i3[t4.id], r4 = t4.uniforms, a4 = t4.__cache;
      e32.bindBuffer(e32.UNIFORM_BUFFER, n4);
      for (let t5 = 0, n5 = r4.length; t5 < n5; t5++) {
        let n6 = Array.isArray(r4[t5]) ? r4[t5] : [r4[t5]];
        for (let r5 = 0, i4 = n6.length; r5 < i4; r5++) {
          let i5 = n6[r5];
          if (p3(i5, t5, r5, a4) === true) {
            let t6 = i5.__offset, n7 = Array.isArray(i5.value) ? i5.value : [i5.value], r6 = 0;
            for (let a5 = 0; a5 < n7.length; a5++) {
              let o4 = n7[a5], s4 = h3(o4);
              typeof o4 == `number` || typeof o4 == `boolean` ? (i5.__data[0] = o4, e32.bufferSubData(e32.UNIFORM_BUFFER, t6 + r6, i5.__data)) : o4.isMatrix3 ? (i5.__data[0] = o4.elements[0], i5.__data[1] = o4.elements[1], i5.__data[2] = o4.elements[2], i5.__data[3] = 0, i5.__data[4] = o4.elements[3], i5.__data[5] = o4.elements[4], i5.__data[6] = o4.elements[5], i5.__data[7] = 0, i5.__data[8] = o4.elements[6], i5.__data[9] = o4.elements[7], i5.__data[10] = o4.elements[8], i5.__data[11] = 0) : (o4.toArray(i5.__data, r6), r6 += s4.storage / Float32Array.BYTES_PER_ELEMENT);
            }
            e32.bufferSubData(e32.UNIFORM_BUFFER, t6, i5.__data);
          }
        }
      }
      e32.bindBuffer(e32.UNIFORM_BUFFER, null);
    }
    function p3(e33, t4, n4, r4) {
      let i4 = e33.value, a4 = t4 + `_` + n4;
      if (r4[a4] === void 0) return typeof i4 == `number` || typeof i4 == `boolean` ? r4[a4] = i4 : r4[a4] = i4.clone(), true;
      {
        let e34 = r4[a4];
        if (typeof i4 == `number` || typeof i4 == `boolean`) {
          if (e34 !== i4) return r4[a4] = i4, true;
        } else if (e34.equals(i4) === false) return e34.copy(i4), true;
      }
      return false;
    }
    function m3(e33) {
      let t4 = e33.uniforms, n4 = 0;
      for (let e34 = 0, r5 = t4.length; e34 < r5; e34++) {
        let r6 = Array.isArray(t4[e34]) ? t4[e34] : [t4[e34]];
        for (let e35 = 0, t5 = r6.length; e35 < t5; e35++) {
          let t6 = r6[e35], i4 = Array.isArray(t6.value) ? t6.value : [t6.value];
          for (let e36 = 0, r7 = i4.length; e36 < r7; e36++) {
            let r8 = i4[e36], a4 = h3(r8), o4 = n4 % 16, s4 = o4 % a4.boundary, c4 = o4 + s4;
            n4 += s4, c4 !== 0 && 16 - c4 < a4.storage && (n4 += 16 - c4), t6.__data = new Float32Array(a4.storage / Float32Array.BYTES_PER_ELEMENT), t6.__offset = n4, n4 += a4.storage;
          }
        }
      }
      let r4 = n4 % 16;
      return r4 > 0 && (n4 += 16 - r4), e33.__size = n4, e33.__cache = {}, this;
    }
    function h3(e33) {
      let t4 = { boundary: 0, storage: 0 };
      return typeof e33 == `number` || typeof e33 == `boolean` ? (t4.boundary = 4, t4.storage = 4) : e33.isVector2 ? (t4.boundary = 8, t4.storage = 8) : e33.isVector3 || e33.isColor ? (t4.boundary = 16, t4.storage = 12) : e33.isVector4 ? (t4.boundary = 16, t4.storage = 16) : e33.isMatrix3 ? (t4.boundary = 48, t4.storage = 48) : e33.isMatrix4 ? (t4.boundary = 64, t4.storage = 64) : e33.isTexture ? console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`) : console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`, e33), t4;
    }
    function g3(t4) {
      let n4 = t4.target;
      n4.removeEventListener(`dispose`, g3);
      let r4 = o3.indexOf(n4.__bindingPointIndex);
      o3.splice(r4, 1), e32.deleteBuffer(i3[n4.id]), delete i3[n4.id], delete a3[n4.id];
    }
    function _3() {
      for (let t4 in i3) e32.deleteBuffer(i3[t4]);
      o3 = [], i3 = {}, a3 = {};
    }
    return { bind: c3, update: l3, dispose: _3 };
  }
  var nc = class {
    constructor(e32 = {}) {
      let { canvas: t3 = st(), context: n3 = null, depth: r3 = true, stencil: i3 = false, alpha: a3 = false, antialias: o3 = false, premultipliedAlpha: s3 = true, preserveDrawingBuffer: c3 = false, powerPreference: l3 = `default`, failIfMajorPerformanceCaveat: u3 = false, reversedDepthBuffer: d3 = false } = e32;
      this.isWebGLRenderer = true;
      let f3;
      if (n3 !== null) {
        if (typeof WebGLRenderingContext < `u` && n3 instanceof WebGLRenderingContext) throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);
        f3 = n3.getContextAttributes().alpha;
      } else f3 = a3;
      let p3 = new Uint32Array(4), m3 = new Int32Array(4), h3 = null, g3 = null, y3 = [], b3 = [];
      this.domElement = t3, this.debug = { checkShaderErrors: true, onShaderError: null }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
      let x3 = this, S3 = false;
      this._outputColorSpace = ze;
      let C3 = 0, w3 = 0, E3 = null, D3 = -1, O3 = null, k3 = new wt(), A4 = new wt(), j4 = null, ee3 = new q(0), te3 = 0, M4 = t3.width, N4 = t3.height, P3 = 1, ne3 = null, re3 = null, ie3 = new wt(0, 0, M4, N4), ae3 = new wt(0, 0, M4, N4), oe3 = false, se3 = new ai(), F3 = false, ce3 = false, le3 = new nn(), ue3 = new W(), de3 = new wt(), fe3 = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: true }, pe3 = false;
      function me3() {
        return E3 === null ? P3 : 1;
      }
      let I3 = n3;
      function he3(e33, n4) {
        return t3.getContext(e33, n4);
      }
      try {
        let e33 = { alpha: true, depth: r3, stencil: i3, antialias: o3, premultipliedAlpha: s3, preserveDrawingBuffer: c3, powerPreference: l3, failIfMajorPerformanceCaveat: u3 };
        if (`setAttribute` in t3 && t3.setAttribute(`data-engine`, `three.js r180`), t3.addEventListener(`webglcontextlost`, Le3, false), t3.addEventListener(`webglcontextrestored`, Re3, false), t3.addEventListener(`webglcontextcreationerror`, Ve3, false), I3 === null) {
          let t4 = `webgl2`;
          if (I3 = he3(t4, e33), I3 === null) throw he3(t4) ? Error(`Error creating WebGL context with your selected attributes.`) : Error(`Error creating WebGL context.`);
        }
      } catch (e33) {
        throw console.error(`THREE.WebGLRenderer: ` + e33.message), e33;
      }
      let L3, R3, z3, ge3, B3, V3, _e3, ve3, ye3, be3, xe3, Se3, Ce3, we3, Te3, Ee3, De3, Oe3, ke3, Ae3, je3, Me3, Ne3, Pe3;
      function Fe3() {
        L3 = new Pa(I3), L3.init(), Me3 = new qs(I3, L3), R3 = new la(I3, L3, e32, Me3), z3 = new Gs(I3, L3), R3.reversedDepthBuffer && d3 && z3.buffers.depth.setReversed(true), ge3 = new La(I3), B3 = new ks(), V3 = new Ks(I3, L3, z3, B3, R3, Me3, ge3), _e3 = new da(x3), ve3 = new Na(x3), ye3 = new ta(I3), Ne3 = new sa(I3, ye3), be3 = new Fa(I3, ye3, ge3, Ne3), xe3 = new za(I3, be3, ye3, ge3), ke3 = new Ra(I3, R3, V3), Ee3 = new ua(B3), Se3 = new Os(x3, _e3, ve3, L3, R3, Ne3, Ee3), Ce3 = new ec(x3, B3), we3 = new Ns(), Te3 = new Bs(L3), Oe3 = new oa(x3, _e3, ve3, z3, xe3, f3, s3), De3 = new Us(x3, xe3, R3), Pe3 = new tc(I3, ge3, R3, z3), Ae3 = new ca(I3, L3, ge3), je3 = new Ia(I3, L3, ge3), ge3.programs = Se3.programs, x3.capabilities = R3, x3.extensions = L3, x3.properties = B3, x3.renderLists = we3, x3.shadowMap = De3, x3.state = z3, x3.info = ge3;
      }
      Fe3();
      let Ie3 = new Zs(x3, I3);
      this.xr = Ie3, this.getContext = function() {
        return I3;
      }, this.getContextAttributes = function() {
        return I3.getContextAttributes();
      }, this.forceContextLoss = function() {
        let e33 = L3.get(`WEBGL_lose_context`);
        e33 && e33.loseContext();
      }, this.forceContextRestore = function() {
        let e33 = L3.get(`WEBGL_lose_context`);
        e33 && e33.restoreContext();
      }, this.getPixelRatio = function() {
        return P3;
      }, this.setPixelRatio = function(e33) {
        e33 !== void 0 && (P3 = e33, this.setSize(M4, N4, false));
      }, this.getSize = function(e33) {
        return e33.set(M4, N4);
      }, this.setSize = function(e33, n4, r4 = true) {
        if (Ie3.isPresenting) {
          console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`);
          return;
        }
        M4 = e33, N4 = n4, t3.width = Math.floor(e33 * P3), t3.height = Math.floor(n4 * P3), r4 === true && (t3.style.width = e33 + `px`, t3.style.height = n4 + `px`), this.setViewport(0, 0, e33, n4);
      }, this.getDrawingBufferSize = function(e33) {
        return e33.set(M4 * P3, N4 * P3).floor();
      }, this.setDrawingBufferSize = function(e33, n4, r4) {
        M4 = e33, N4 = n4, P3 = r4, t3.width = Math.floor(e33 * r4), t3.height = Math.floor(n4 * r4), this.setViewport(0, 0, e33, n4);
      }, this.getCurrentViewport = function(e33) {
        return e33.copy(k3);
      }, this.getViewport = function(e33) {
        return e33.copy(ie3);
      }, this.setViewport = function(e33, t4, n4, r4) {
        e33.isVector4 ? ie3.set(e33.x, e33.y, e33.z, e33.w) : ie3.set(e33, t4, n4, r4), z3.viewport(k3.copy(ie3).multiplyScalar(P3).round());
      }, this.getScissor = function(e33) {
        return e33.copy(ae3);
      }, this.setScissor = function(e33, t4, n4, r4) {
        e33.isVector4 ? ae3.set(e33.x, e33.y, e33.z, e33.w) : ae3.set(e33, t4, n4, r4), z3.scissor(A4.copy(ae3).multiplyScalar(P3).round());
      }, this.getScissorTest = function() {
        return oe3;
      }, this.setScissorTest = function(e33) {
        z3.setScissorTest(oe3 = e33);
      }, this.setOpaqueSort = function(e33) {
        ne3 = e33;
      }, this.setTransparentSort = function(e33) {
        re3 = e33;
      }, this.getClearColor = function(e33) {
        return e33.copy(Oe3.getClearColor());
      }, this.setClearColor = function() {
        Oe3.setClearColor(...arguments);
      }, this.getClearAlpha = function() {
        return Oe3.getClearAlpha();
      }, this.setClearAlpha = function() {
        Oe3.setClearAlpha(...arguments);
      }, this.clear = function(e33 = true, t4 = true, n4 = true) {
        let r4 = 0;
        if (e33) {
          let e34 = false;
          if (E3 !== null) {
            let t5 = E3.texture.format;
            e34 = t5 === 1033 || t5 === 1031 || t5 === 1029;
          }
          if (e34) {
            let e35 = E3.texture.type, t5 = e35 === 1009 || e35 === 1014 || e35 === 1012 || e35 === 1020 || e35 === 1017 || e35 === 1018, n5 = Oe3.getClearColor(), r5 = Oe3.getClearAlpha(), i4 = n5.r, a4 = n5.g, o4 = n5.b;
            t5 ? (p3[0] = i4, p3[1] = a4, p3[2] = o4, p3[3] = r5, I3.clearBufferuiv(I3.COLOR, 0, p3)) : (m3[0] = i4, m3[1] = a4, m3[2] = o4, m3[3] = r5, I3.clearBufferiv(I3.COLOR, 0, m3));
          } else r4 |= I3.COLOR_BUFFER_BIT;
        }
        t4 && (r4 |= I3.DEPTH_BUFFER_BIT), n4 && (r4 |= I3.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), I3.clear(r4);
      }, this.clearColor = function() {
        this.clear(true, false, false);
      }, this.clearDepth = function() {
        this.clear(false, true, false);
      }, this.clearStencil = function() {
        this.clear(false, false, true);
      }, this.dispose = function() {
        t3.removeEventListener(`webglcontextlost`, Le3, false), t3.removeEventListener(`webglcontextrestored`, Re3, false), t3.removeEventListener(`webglcontextcreationerror`, Ve3, false), Oe3.dispose(), we3.dispose(), Te3.dispose(), B3.dispose(), _e3.dispose(), ve3.dispose(), xe3.dispose(), Ne3.dispose(), Pe3.dispose(), Se3.dispose(), Ie3.dispose(), Ie3.removeEventListener(`sessionstart`, Ye3), Ie3.removeEventListener(`sessionend`, Xe3), H3.stop();
      };
      function Le3(e33) {
        e33.preventDefault(), console.log(`THREE.WebGLRenderer: Context Lost.`), S3 = true;
      }
      function Re3() {
        console.log(`THREE.WebGLRenderer: Context Restored.`), S3 = false;
        let e33 = ge3.autoReset, t4 = De3.enabled, n4 = De3.autoUpdate, r4 = De3.needsUpdate, i4 = De3.type;
        Fe3(), ge3.autoReset = e33, De3.enabled = t4, De3.autoUpdate = n4, De3.needsUpdate = r4, De3.type = i4;
      }
      function Ve3(e33) {
        console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `, e33.statusMessage);
      }
      function He3(e33) {
        let t4 = e33.target;
        t4.removeEventListener(`dispose`, He3), Ue3(t4);
      }
      function Ue3(e33) {
        We3(e33), B3.remove(e33);
      }
      function We3(e33) {
        let t4 = B3.get(e33).programs;
        t4 !== void 0 && (t4.forEach(function(e34) {
          Se3.releaseProgram(e34);
        }), e33.isShaderMaterial && Se3.releaseShaderCache(e33));
      }
      this.renderBufferDirect = function(e33, t4, n4, r4, i4, a4) {
        t4 === null && (t4 = fe3);
        let o4 = i4.isMesh && i4.matrixWorld.determinant() < 0, s4 = G3(e33, t4, n4, r4, i4);
        z3.setMaterial(r4, o4);
        let c4 = n4.index, l4 = 1;
        if (r4.wireframe === true) {
          if (c4 = be3.getWireframeAttribute(n4), c4 === void 0) return;
          l4 = 2;
        }
        let u4 = n4.drawRange, d4 = n4.attributes.position, f4 = u4.start * l4, p4 = (u4.start + u4.count) * l4;
        a4 !== null && (f4 = Math.max(f4, a4.start * l4), p4 = Math.min(p4, (a4.start + a4.count) * l4)), c4 === null ? d4 != null && (f4 = Math.max(f4, 0), p4 = Math.min(p4, d4.count)) : (f4 = Math.max(f4, 0), p4 = Math.min(p4, c4.count));
        let m4 = p4 - f4;
        if (m4 < 0 || m4 === 1 / 0) return;
        Ne3.setup(i4, r4, s4, n4, c4);
        let h4, g4 = Ae3;
        if (c4 !== null && (h4 = ye3.get(c4), g4 = je3, g4.setIndex(h4)), i4.isMesh) r4.wireframe === true ? (z3.setLineWidth(r4.wireframeLinewidth * me3()), g4.setMode(I3.LINES)) : g4.setMode(I3.TRIANGLES);
        else if (i4.isLine) {
          let e34 = r4.linewidth;
          e34 === void 0 && (e34 = 1), z3.setLineWidth(e34 * me3()), i4.isLineSegments ? g4.setMode(I3.LINES) : i4.isLineLoop ? g4.setMode(I3.LINE_LOOP) : g4.setMode(I3.LINE_STRIP);
        } else i4.isPoints ? g4.setMode(I3.POINTS) : i4.isSprite && g4.setMode(I3.TRIANGLES);
        if (i4.isBatchedMesh) if (i4._multiDrawInstances !== null) lt(`THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection.`), g4.renderMultiDrawInstances(i4._multiDrawStarts, i4._multiDrawCounts, i4._multiDrawCount, i4._multiDrawInstances);
        else if (L3.get(`WEBGL_multi_draw`)) g4.renderMultiDraw(i4._multiDrawStarts, i4._multiDrawCounts, i4._multiDrawCount);
        else {
          let e34 = i4._multiDrawStarts, t5 = i4._multiDrawCounts, n5 = i4._multiDrawCount, a5 = c4 ? ye3.get(c4).bytesPerElement : 1, o5 = B3.get(r4).currentProgram.getUniforms();
          for (let r5 = 0; r5 < n5; r5++) o5.setValue(I3, `_gl_DrawID`, r5), g4.render(e34[r5] / a5, t5[r5]);
        }
        else if (i4.isInstancedMesh) g4.renderInstances(f4, m4, i4.count);
        else if (n4.isInstancedBufferGeometry) {
          let e34 = n4._maxInstanceCount === void 0 ? 1 / 0 : n4._maxInstanceCount, t5 = Math.min(n4.instanceCount, e34);
          g4.renderInstances(f4, m4, t5);
        } else g4.render(f4, m4);
      };
      function Ke3(e33, t4, n4) {
        e33.transparent === true && e33.side === 2 && e33.forceSinglePass === false ? (e33.side = 1, e33.needsUpdate = true, tt3(e33, t4, n4), e33.side = 0, e33.needsUpdate = true, tt3(e33, t4, n4), e33.side = 2) : tt3(e33, t4, n4);
      }
      this.compile = function(e33, t4, n4 = null) {
        n4 === null && (n4 = e33), g3 = Te3.get(n4), g3.init(t4), b3.push(g3), n4.traverseVisible(function(e34) {
          e34.isLight && e34.layers.test(t4.layers) && (g3.pushLight(e34), e34.castShadow && g3.pushShadow(e34));
        }), e33 !== n4 && e33.traverseVisible(function(e34) {
          e34.isLight && e34.layers.test(t4.layers) && (g3.pushLight(e34), e34.castShadow && g3.pushShadow(e34));
        }), g3.setupLights();
        let r4 = /* @__PURE__ */ new Set();
        return e33.traverse(function(e34) {
          if (!(e34.isMesh || e34.isPoints || e34.isLine || e34.isSprite)) return;
          let t5 = e34.material;
          if (t5) if (Array.isArray(t5)) for (let i4 = 0; i4 < t5.length; i4++) {
            let a4 = t5[i4];
            Ke3(a4, n4, e34), r4.add(a4);
          }
          else Ke3(t5, n4, e34), r4.add(t5);
        }), g3 = b3.pop(), r4;
      }, this.compileAsync = function(e33, t4, n4 = null) {
        let r4 = this.compile(e33, t4, n4);
        return new Promise((t5) => {
          function n5() {
            if (r4.forEach(function(e34) {
              B3.get(e34).currentProgram.isReady() && r4.delete(e34);
            }), r4.size === 0) {
              t5(e33);
              return;
            }
            setTimeout(n5, 10);
          }
          L3.get(`KHR_parallel_shader_compile`) === null ? setTimeout(n5, 10) : n5();
        });
      };
      let qe3 = null;
      function Je3(e33) {
        qe3 && qe3(e33);
      }
      function Ye3() {
        H3.stop();
      }
      function Xe3() {
        H3.start();
      }
      let H3 = new ea();
      H3.setAnimationLoop(Je3), typeof self < `u` && H3.setContext(self), this.setAnimationLoop = function(e33) {
        qe3 = e33, Ie3.setAnimationLoop(e33), e33 === null ? H3.stop() : H3.start();
      }, Ie3.addEventListener(`sessionstart`, Ye3), Ie3.addEventListener(`sessionend`, Xe3), this.render = function(e33, t4) {
        if (t4 !== void 0 && t4.isCamera !== true) {
          console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);
          return;
        }
        if (S3 === true) return;
        if (e33.matrixWorldAutoUpdate === true && e33.updateMatrixWorld(), t4.parent === null && t4.matrixWorldAutoUpdate === true && t4.updateMatrixWorld(), Ie3.enabled === true && Ie3.isPresenting === true && (Ie3.cameraAutoUpdate === true && Ie3.updateCamera(t4), t4 = Ie3.getCamera()), e33.isScene === true && e33.onBeforeRender(x3, e33, t4, E3), g3 = Te3.get(e33, b3.length), g3.init(t4), b3.push(g3), le3.multiplyMatrices(t4.projectionMatrix, t4.matrixWorldInverse), se3.setFromProjectionMatrix(le3, Ge, t4.reversedDepth), ce3 = this.localClippingEnabled, F3 = Ee3.init(this.clippingPlanes, ce3), h3 = we3.get(e33, y3.length), h3.init(), y3.push(h3), Ie3.enabled === true && Ie3.isPresenting === true) {
          let e34 = x3.xr.getDepthSensingMesh();
          e34 !== null && Ze3(e34, t4, -1 / 0, x3.sortObjects);
        }
        Ze3(e33, t4, 0, x3.sortObjects), h3.finish(), x3.sortObjects === true && h3.sort(ne3, re3), pe3 = Ie3.enabled === false || Ie3.isPresenting === false || Ie3.hasDepthSensing() === false, pe3 && Oe3.addToRenderList(h3, e33), this.info.render.frame++, F3 === true && Ee3.beginShadows();
        let n4 = g3.state.shadowsArray;
        De3.render(n4, e33, t4), F3 === true && Ee3.endShadows(), this.info.autoReset === true && this.info.reset();
        let r4 = h3.opaque, i4 = h3.transmissive;
        if (g3.setupLights(), t4.isArrayCamera) {
          let n5 = t4.cameras;
          if (i4.length > 0) for (let t5 = 0, a4 = n5.length; t5 < a4; t5++) {
            let a5 = n5[t5];
            $e3(r4, i4, e33, a5);
          }
          pe3 && Oe3.render(e33);
          for (let t5 = 0, r5 = n5.length; t5 < r5; t5++) {
            let r6 = n5[t5];
            Qe3(h3, e33, r6, r6.viewport);
          }
        } else i4.length > 0 && $e3(r4, i4, e33, t4), pe3 && Oe3.render(e33), Qe3(h3, e33, t4);
        E3 !== null && w3 === 0 && (V3.updateMultisampleRenderTarget(E3), V3.updateRenderTargetMipmap(E3)), e33.isScene === true && e33.onAfterRender(x3, e33, t4), Ne3.resetDefaultState(), D3 = -1, O3 = null, b3.pop(), b3.length > 0 ? (g3 = b3[b3.length - 1], F3 === true && Ee3.setGlobalState(x3.clippingPlanes, g3.state.camera)) : g3 = null, y3.pop(), h3 = y3.length > 0 ? y3[y3.length - 1] : null;
      };
      function Ze3(e33, t4, n4, r4) {
        if (e33.visible === false) return;
        if (e33.layers.test(t4.layers)) {
          if (e33.isGroup) n4 = e33.renderOrder;
          else if (e33.isLOD) e33.autoUpdate === true && e33.update(t4);
          else if (e33.isLight) g3.pushLight(e33), e33.castShadow && g3.pushShadow(e33);
          else if (e33.isSprite) {
            if (!e33.frustumCulled || se3.intersectsSprite(e33)) {
              r4 && de3.setFromMatrixPosition(e33.matrixWorld).applyMatrix4(le3);
              let t5 = xe3.update(e33), i5 = e33.material;
              i5.visible && h3.push(e33, t5, i5, n4, de3.z, null);
            }
          } else if ((e33.isMesh || e33.isLine || e33.isPoints) && (!e33.frustumCulled || se3.intersectsObject(e33))) {
            let t5 = xe3.update(e33), i5 = e33.material;
            if (r4 && (e33.boundingSphere === void 0 ? (t5.boundingSphere === null && t5.computeBoundingSphere(), de3.copy(t5.boundingSphere.center)) : (e33.boundingSphere === null && e33.computeBoundingSphere(), de3.copy(e33.boundingSphere.center)), de3.applyMatrix4(e33.matrixWorld).applyMatrix4(le3)), Array.isArray(i5)) {
              let r5 = t5.groups;
              for (let a4 = 0, o4 = r5.length; a4 < o4; a4++) {
                let o5 = r5[a4], s4 = i5[o5.materialIndex];
                s4 && s4.visible && h3.push(e33, t5, s4, n4, de3.z, o5);
              }
            } else i5.visible && h3.push(e33, t5, i5, n4, de3.z, null);
          }
        }
        let i4 = e33.children;
        for (let e34 = 0, a4 = i4.length; e34 < a4; e34++) Ze3(i4[e34], t4, n4, r4);
      }
      function Qe3(e33, t4, n4, r4) {
        let i4 = e33.opaque, a4 = e33.transmissive, o4 = e33.transparent;
        g3.setupLightsView(n4), F3 === true && Ee3.setGlobalState(x3.clippingPlanes, n4), r4 && z3.viewport(k3.copy(r4)), i4.length > 0 && et3(i4, t4, n4), a4.length > 0 && et3(a4, t4, n4), o4.length > 0 && et3(o4, t4, n4), z3.buffers.depth.setTest(true), z3.buffers.depth.setMask(true), z3.buffers.color.setMask(true), z3.setPolygonOffset(false);
      }
      function $e3(e33, t4, n4, r4) {
        if ((n4.isScene === true ? n4.overrideMaterial : null) !== null) return;
        g3.state.transmissionRenderTarget[r4.id] === void 0 && (g3.state.transmissionRenderTarget[r4.id] = new Et(1, 1, { generateMipmaps: true, type: L3.has(`EXT_color_buffer_half_float`) || L3.has(`EXT_color_buffer_float`) ? T : v, minFilter: _, samples: 4, stencilBuffer: i3, resolveDepthBuffer: false, resolveStencilBuffer: false, colorSpace: K.workingColorSpace }));
        let a4 = g3.state.transmissionRenderTarget[r4.id], o4 = r4.viewport || k3;
        a4.setSize(o4.z * x3.transmissionResolutionScale, o4.w * x3.transmissionResolutionScale);
        let s4 = x3.getRenderTarget(), c4 = x3.getActiveCubeFace(), l4 = x3.getActiveMipmapLevel();
        x3.setRenderTarget(a4), x3.getClearColor(ee3), te3 = x3.getClearAlpha(), te3 < 1 && x3.setClearColor(16777215, 0.5), x3.clear(), pe3 && Oe3.render(n4);
        let u4 = x3.toneMapping;
        x3.toneMapping = 0;
        let d4 = r4.viewport;
        if (r4.viewport !== void 0 && (r4.viewport = void 0), g3.setupLightsView(r4), F3 === true && Ee3.setGlobalState(x3.clippingPlanes, r4), et3(e33, n4, r4), V3.updateMultisampleRenderTarget(a4), V3.updateRenderTargetMipmap(a4), L3.has(`WEBGL_multisampled_render_to_texture`) === false) {
          let e34 = false;
          for (let i4 = 0, a5 = t4.length; i4 < a5; i4++) {
            let a6 = t4[i4], o5 = a6.object, s5 = a6.geometry, c5 = a6.material, l5 = a6.group;
            if (c5.side === 2 && o5.layers.test(r4.layers)) {
              let t5 = c5.side;
              c5.side = 1, c5.needsUpdate = true, U3(o5, n4, r4, s5, c5, l5), c5.side = t5, c5.needsUpdate = true, e34 = true;
            }
          }
          e34 === true && (V3.updateMultisampleRenderTarget(a4), V3.updateRenderTargetMipmap(a4));
        }
        x3.setRenderTarget(s4, c4, l4), x3.setClearColor(ee3, te3), d4 !== void 0 && (r4.viewport = d4), x3.toneMapping = u4;
      }
      function et3(e33, t4, n4) {
        let r4 = t4.isScene === true ? t4.overrideMaterial : null;
        for (let i4 = 0, a4 = e33.length; i4 < a4; i4++) {
          let a5 = e33[i4], o4 = a5.object, s4 = a5.geometry, c4 = a5.group, l4 = a5.material;
          l4.allowOverride === true && r4 !== null && (l4 = r4), o4.layers.test(n4.layers) && U3(o4, t4, n4, s4, l4, c4);
        }
      }
      function U3(e33, t4, n4, r4, i4, a4) {
        e33.onBeforeRender(x3, t4, n4, r4, i4, a4), e33.modelViewMatrix.multiplyMatrices(n4.matrixWorldInverse, e33.matrixWorld), e33.normalMatrix.getNormalMatrix(e33.modelViewMatrix), i4.onBeforeRender(x3, t4, n4, r4, e33, a4), i4.transparent === true && i4.side === 2 && i4.forceSinglePass === false ? (i4.side = 1, i4.needsUpdate = true, x3.renderBufferDirect(n4, t4, r4, i4, e33, a4), i4.side = 0, i4.needsUpdate = true, x3.renderBufferDirect(n4, t4, r4, i4, e33, a4), i4.side = 2) : x3.renderBufferDirect(n4, t4, r4, i4, e33, a4), e33.onAfterRender(x3, t4, n4, r4, i4, a4);
      }
      function tt3(e33, t4, n4) {
        t4.isScene !== true && (t4 = fe3);
        let r4 = B3.get(e33), i4 = g3.state.lights, a4 = g3.state.shadowsArray, o4 = i4.state.version, s4 = Se3.getParameters(e33, i4.state, a4, t4, n4), c4 = Se3.getProgramCacheKey(s4), l4 = r4.programs;
        r4.environment = e33.isMeshStandardMaterial ? t4.environment : null, r4.fog = t4.fog, r4.envMap = (e33.isMeshStandardMaterial ? ve3 : _e3).get(e33.envMap || r4.environment), r4.envMapRotation = r4.environment !== null && e33.envMap === null ? t4.environmentRotation : e33.envMapRotation, l4 === void 0 && (e33.addEventListener(`dispose`, He3), l4 = /* @__PURE__ */ new Map(), r4.programs = l4);
        let u4 = l4.get(c4);
        if (u4 !== void 0) {
          if (r4.currentProgram === u4 && r4.lightsStateVersion === o4) return rt3(e33, s4), u4;
        } else s4.uniforms = Se3.getUniforms(e33), e33.onBeforeCompile(s4, x3), u4 = Se3.acquireProgram(s4, c4), l4.set(c4, u4), r4.uniforms = s4.uniforms;
        let d4 = r4.uniforms;
        return (!e33.isShaderMaterial && !e33.isRawShaderMaterial || e33.clipping === true) && (d4.clippingPlanes = Ee3.uniform), rt3(e33, s4), r4.needsLights = at3(e33), r4.lightsStateVersion = o4, r4.needsLights && (d4.ambientLightColor.value = i4.state.ambient, d4.lightProbe.value = i4.state.probe, d4.directionalLights.value = i4.state.directional, d4.directionalLightShadows.value = i4.state.directionalShadow, d4.spotLights.value = i4.state.spot, d4.spotLightShadows.value = i4.state.spotShadow, d4.rectAreaLights.value = i4.state.rectArea, d4.ltc_1.value = i4.state.rectAreaLTC1, d4.ltc_2.value = i4.state.rectAreaLTC2, d4.pointLights.value = i4.state.point, d4.pointLightShadows.value = i4.state.pointShadow, d4.hemisphereLights.value = i4.state.hemi, d4.directionalShadowMap.value = i4.state.directionalShadowMap, d4.directionalShadowMatrix.value = i4.state.directionalShadowMatrix, d4.spotShadowMap.value = i4.state.spotShadowMap, d4.spotLightMatrix.value = i4.state.spotLightMatrix, d4.spotLightMap.value = i4.state.spotLightMap, d4.pointShadowMap.value = i4.state.pointShadowMap, d4.pointShadowMatrix.value = i4.state.pointShadowMatrix), r4.currentProgram = u4, r4.uniformsList = null, u4;
      }
      function nt3(e33) {
        if (e33.uniformsList === null) {
          let t4 = e33.currentProgram.getUniforms();
          e33.uniformsList = qo.seqWithValue(t4.seq, e33.uniforms);
        }
        return e33.uniformsList;
      }
      function rt3(e33, t4) {
        let n4 = B3.get(e33);
        n4.outputColorSpace = t4.outputColorSpace, n4.batching = t4.batching, n4.batchingColor = t4.batchingColor, n4.instancing = t4.instancing, n4.instancingColor = t4.instancingColor, n4.instancingMorph = t4.instancingMorph, n4.skinning = t4.skinning, n4.morphTargets = t4.morphTargets, n4.morphNormals = t4.morphNormals, n4.morphColors = t4.morphColors, n4.morphTargetsCount = t4.morphTargetsCount, n4.numClippingPlanes = t4.numClippingPlanes, n4.numIntersection = t4.numClipIntersection, n4.vertexAlphas = t4.vertexAlphas, n4.vertexTangents = t4.vertexTangents, n4.toneMapping = t4.toneMapping;
      }
      function G3(e33, t4, n4, r4, i4) {
        t4.isScene !== true && (t4 = fe3), V3.resetTextureUnits();
        let a4 = t4.fog, o4 = r4.isMeshStandardMaterial ? t4.environment : null, s4 = E3 === null ? x3.outputColorSpace : E3.isXRRenderTarget === true ? E3.texture.colorSpace : Be, c4 = (r4.isMeshStandardMaterial ? ve3 : _e3).get(r4.envMap || o4), l4 = r4.vertexColors === true && !!n4.attributes.color && n4.attributes.color.itemSize === 4, u4 = !!n4.attributes.tangent && (!!r4.normalMap || r4.anisotropy > 0), d4 = !!n4.morphAttributes.position, f4 = !!n4.morphAttributes.normal, p4 = !!n4.morphAttributes.color, m4 = 0;
        r4.toneMapped && (E3 === null || E3.isXRRenderTarget === true) && (m4 = x3.toneMapping);
        let h4 = n4.morphAttributes.position || n4.morphAttributes.normal || n4.morphAttributes.color, _3 = h4 === void 0 ? 0 : h4.length, v3 = B3.get(r4), y4 = g3.state.lights;
        if (F3 === true && (ce3 === true || e33 !== O3)) {
          let t5 = e33 === O3 && r4.id === D3;
          Ee3.setState(r4, e33, t5);
        }
        let b4 = false;
        r4.version === v3.__version ? v3.needsLights && v3.lightsStateVersion !== y4.state.version ? b4 = true : v3.outputColorSpace === s4 ? i4.isBatchedMesh && v3.batching === false || !i4.isBatchedMesh && v3.batching === true || i4.isBatchedMesh && v3.batchingColor === true && i4.colorTexture === null || i4.isBatchedMesh && v3.batchingColor === false && i4.colorTexture !== null || i4.isInstancedMesh && v3.instancing === false || !i4.isInstancedMesh && v3.instancing === true || i4.isSkinnedMesh && v3.skinning === false || !i4.isSkinnedMesh && v3.skinning === true || i4.isInstancedMesh && v3.instancingColor === true && i4.instanceColor === null || i4.isInstancedMesh && v3.instancingColor === false && i4.instanceColor !== null || i4.isInstancedMesh && v3.instancingMorph === true && i4.morphTexture === null || i4.isInstancedMesh && v3.instancingMorph === false && i4.morphTexture !== null ? b4 = true : v3.envMap === c4 ? r4.fog === true && v3.fog !== a4 || v3.numClippingPlanes !== void 0 && (v3.numClippingPlanes !== Ee3.numPlanes || v3.numIntersection !== Ee3.numIntersection) ? b4 = true : v3.vertexAlphas === l4 && v3.vertexTangents === u4 && v3.morphTargets === d4 && v3.morphNormals === f4 && v3.morphColors === p4 && v3.toneMapping === m4 ? v3.morphTargetsCount !== _3 && (b4 = true) : b4 = true : b4 = true : b4 = true : (b4 = true, v3.__version = r4.version);
        let S4 = v3.currentProgram;
        b4 === true && (S4 = tt3(r4, t4, i4));
        let C4 = false, w4 = false, T3 = false, k4 = S4.getUniforms(), A5 = v3.uniforms;
        if (z3.useProgram(S4.program) && (C4 = true, w4 = true, T3 = true), r4.id !== D3 && (D3 = r4.id, w4 = true), C4 || O3 !== e33) {
          z3.buffers.depth.getReversed() && e33.reversedDepth !== true && (e33._reversedDepth = true, e33.updateProjectionMatrix()), k4.setValue(I3, `projectionMatrix`, e33.projectionMatrix), k4.setValue(I3, `viewMatrix`, e33.matrixWorldInverse);
          let t5 = k4.map.cameraPosition;
          t5 !== void 0 && t5.setValue(I3, ue3.setFromMatrixPosition(e33.matrixWorld)), R3.logarithmicDepthBuffer && k4.setValue(I3, `logDepthBufFC`, 2 / (Math.log(e33.far + 1) / Math.LN2)), (r4.isMeshPhongMaterial || r4.isMeshToonMaterial || r4.isMeshLambertMaterial || r4.isMeshBasicMaterial || r4.isMeshStandardMaterial || r4.isShaderMaterial) && k4.setValue(I3, `isOrthographic`, e33.isOrthographicCamera === true), O3 !== e33 && (O3 = e33, w4 = true, T3 = true);
        }
        if (i4.isSkinnedMesh) {
          k4.setOptional(I3, i4, `bindMatrix`), k4.setOptional(I3, i4, `bindMatrixInverse`);
          let e34 = i4.skeleton;
          e34 && (e34.boneTexture === null && e34.computeBoneTexture(), k4.setValue(I3, `boneTexture`, e34.boneTexture, V3));
        }
        i4.isBatchedMesh && (k4.setOptional(I3, i4, `batchingTexture`), k4.setValue(I3, `batchingTexture`, i4._matricesTexture, V3), k4.setOptional(I3, i4, `batchingIdTexture`), k4.setValue(I3, `batchingIdTexture`, i4._indirectTexture, V3), k4.setOptional(I3, i4, `batchingColorTexture`), i4._colorsTexture !== null && k4.setValue(I3, `batchingColorTexture`, i4._colorsTexture, V3));
        let j5 = n4.morphAttributes;
        if ((j5.position !== void 0 || j5.normal !== void 0 || j5.color !== void 0) && ke3.update(i4, n4, S4), (w4 || v3.receiveShadow !== i4.receiveShadow) && (v3.receiveShadow = i4.receiveShadow, k4.setValue(I3, `receiveShadow`, i4.receiveShadow)), r4.isMeshGouraudMaterial && r4.envMap !== null && (A5.envMap.value = c4, A5.flipEnvMap.value = c4.isCubeTexture && c4.isRenderTargetTexture === false ? -1 : 1), r4.isMeshStandardMaterial && r4.envMap === null && t4.environment !== null && (A5.envMapIntensity.value = t4.environmentIntensity), w4 && (k4.setValue(I3, `toneMappingExposure`, x3.toneMappingExposure), v3.needsLights && it3(A5, T3), a4 && r4.fog === true && Ce3.refreshFogUniforms(A5, a4), Ce3.refreshMaterialUniforms(A5, r4, P3, N4, g3.state.transmissionRenderTarget[e33.id]), qo.upload(I3, nt3(v3), A5, V3)), r4.isShaderMaterial && r4.uniformsNeedUpdate === true && (qo.upload(I3, nt3(v3), A5, V3), r4.uniformsNeedUpdate = false), r4.isSpriteMaterial && k4.setValue(I3, `center`, i4.center), k4.setValue(I3, `modelViewMatrix`, i4.modelViewMatrix), k4.setValue(I3, `normalMatrix`, i4.normalMatrix), k4.setValue(I3, `modelMatrix`, i4.matrixWorld), r4.isShaderMaterial || r4.isRawShaderMaterial) {
          let e34 = r4.uniformsGroups;
          for (let t5 = 0, n5 = e34.length; t5 < n5; t5++) {
            let n6 = e34[t5];
            Pe3.update(n6, S4), Pe3.bind(n6, S4);
          }
        }
        return S4;
      }
      function it3(e33, t4) {
        e33.ambientLightColor.needsUpdate = t4, e33.lightProbe.needsUpdate = t4, e33.directionalLights.needsUpdate = t4, e33.directionalLightShadows.needsUpdate = t4, e33.pointLights.needsUpdate = t4, e33.pointLightShadows.needsUpdate = t4, e33.spotLights.needsUpdate = t4, e33.spotLightShadows.needsUpdate = t4, e33.rectAreaLights.needsUpdate = t4, e33.hemisphereLights.needsUpdate = t4;
      }
      function at3(e33) {
        return e33.isMeshLambertMaterial || e33.isMeshToonMaterial || e33.isMeshPhongMaterial || e33.isMeshStandardMaterial || e33.isShadowMaterial || e33.isShaderMaterial && e33.lights === true;
      }
      this.getActiveCubeFace = function() {
        return C3;
      }, this.getActiveMipmapLevel = function() {
        return w3;
      }, this.getRenderTarget = function() {
        return E3;
      }, this.setRenderTargetTextures = function(e33, t4, n4) {
        let r4 = B3.get(e33);
        r4.__autoAllocateDepthBuffer = e33.resolveDepthBuffer === false, r4.__autoAllocateDepthBuffer === false && (r4.__useRenderToTexture = false), B3.get(e33.texture).__webglTexture = t4, B3.get(e33.depthTexture).__webglTexture = r4.__autoAllocateDepthBuffer ? void 0 : n4, r4.__hasExternalTextures = true;
      }, this.setRenderTargetFramebuffer = function(e33, t4) {
        let n4 = B3.get(e33);
        n4.__webglFramebuffer = t4, n4.__useDefaultFramebuffer = t4 === void 0;
      };
      let ot3 = I3.createFramebuffer();
      this.setRenderTarget = function(e33, t4 = 0, n4 = 0) {
        E3 = e33, C3 = t4, w3 = n4;
        let r4 = true, i4 = null, a4 = false, o4 = false;
        if (e33) {
          let s4 = B3.get(e33);
          if (s4.__useDefaultFramebuffer !== void 0) z3.bindFramebuffer(I3.FRAMEBUFFER, null), r4 = false;
          else if (s4.__webglFramebuffer === void 0) V3.setupRenderTarget(e33);
          else if (s4.__hasExternalTextures) V3.rebindTextures(e33, B3.get(e33.texture).__webglTexture, B3.get(e33.depthTexture).__webglTexture);
          else if (e33.depthBuffer) {
            let t5 = e33.depthTexture;
            if (s4.__boundDepthTexture !== t5) {
              if (t5 !== null && B3.has(t5) && (e33.width !== t5.image.width || e33.height !== t5.image.height)) throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);
              V3.setupDepthRenderbuffer(e33);
            }
          }
          let c4 = e33.texture;
          (c4.isData3DTexture || c4.isDataArrayTexture || c4.isCompressedArrayTexture) && (o4 = true);
          let l4 = B3.get(e33).__webglFramebuffer;
          e33.isWebGLCubeRenderTarget ? (i4 = Array.isArray(l4[t4]) ? l4[t4][n4] : l4[t4], a4 = true) : i4 = e33.samples > 0 && V3.useMultisampledRTT(e33) === false ? B3.get(e33).__webglMultisampledFramebuffer : Array.isArray(l4) ? l4[n4] : l4, k3.copy(e33.viewport), A4.copy(e33.scissor), j4 = e33.scissorTest;
        } else k3.copy(ie3).multiplyScalar(P3).floor(), A4.copy(ae3).multiplyScalar(P3).floor(), j4 = oe3;
        if (n4 !== 0 && (i4 = ot3), z3.bindFramebuffer(I3.FRAMEBUFFER, i4) && r4 && z3.drawBuffers(e33, i4), z3.viewport(k3), z3.scissor(A4), z3.setScissorTest(j4), a4) {
          let r5 = B3.get(e33.texture);
          I3.framebufferTexture2D(I3.FRAMEBUFFER, I3.COLOR_ATTACHMENT0, I3.TEXTURE_CUBE_MAP_POSITIVE_X + t4, r5.__webglTexture, n4);
        } else if (o4) {
          let r5 = t4;
          for (let t5 = 0; t5 < e33.textures.length; t5++) {
            let i5 = B3.get(e33.textures[t5]);
            I3.framebufferTextureLayer(I3.FRAMEBUFFER, I3.COLOR_ATTACHMENT0 + t5, i5.__webglTexture, n4, r5);
          }
        } else if (e33 !== null && n4 !== 0) {
          let t5 = B3.get(e33.texture);
          I3.framebufferTexture2D(I3.FRAMEBUFFER, I3.COLOR_ATTACHMENT0, I3.TEXTURE_2D, t5.__webglTexture, n4);
        }
        D3 = -1;
      }, this.readRenderTargetPixels = function(e33, t4, n4, r4, i4, a4, o4, s4 = 0) {
        if (!(e33 && e33.isWebGLRenderTarget)) {
          console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);
          return;
        }
        let c4 = B3.get(e33).__webglFramebuffer;
        if (e33.isWebGLCubeRenderTarget && o4 !== void 0 && (c4 = c4[o4]), c4) {
          z3.bindFramebuffer(I3.FRAMEBUFFER, c4);
          try {
            let o5 = e33.textures[s4], c5 = o5.format, l4 = o5.type;
            if (!R3.textureFormatReadable(c5)) {
              console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);
              return;
            }
            if (!R3.textureTypeReadable(l4)) {
              console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);
              return;
            }
            t4 >= 0 && t4 <= e33.width - r4 && n4 >= 0 && n4 <= e33.height - i4 && (e33.textures.length > 1 && I3.readBuffer(I3.COLOR_ATTACHMENT0 + s4), I3.readPixels(t4, n4, r4, i4, Me3.convert(c5), Me3.convert(l4), a4));
          } finally {
            let e34 = E3 === null ? null : B3.get(E3).__webglFramebuffer;
            z3.bindFramebuffer(I3.FRAMEBUFFER, e34);
          }
        }
      }, this.readRenderTargetPixelsAsync = async function(e33, t4, n4, r4, i4, a4, o4, s4 = 0) {
        if (!(e33 && e33.isWebGLRenderTarget)) throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);
        let c4 = B3.get(e33).__webglFramebuffer;
        if (e33.isWebGLCubeRenderTarget && o4 !== void 0 && (c4 = c4[o4]), c4) if (t4 >= 0 && t4 <= e33.width - r4 && n4 >= 0 && n4 <= e33.height - i4) {
          z3.bindFramebuffer(I3.FRAMEBUFFER, c4);
          let o5 = e33.textures[s4], l4 = o5.format, u4 = o5.type;
          if (!R3.textureFormatReadable(l4)) throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);
          if (!R3.textureTypeReadable(u4)) throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);
          let d4 = I3.createBuffer();
          I3.bindBuffer(I3.PIXEL_PACK_BUFFER, d4), I3.bufferData(I3.PIXEL_PACK_BUFFER, a4.byteLength, I3.STREAM_READ), e33.textures.length > 1 && I3.readBuffer(I3.COLOR_ATTACHMENT0 + s4), I3.readPixels(t4, n4, r4, i4, Me3.convert(l4), Me3.convert(u4), 0);
          let f4 = E3 === null ? null : B3.get(E3).__webglFramebuffer;
          z3.bindFramebuffer(I3.FRAMEBUFFER, f4);
          let p4 = I3.fenceSync(I3.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return I3.flush(), await ut(I3, p4, 4), I3.bindBuffer(I3.PIXEL_PACK_BUFFER, d4), I3.getBufferSubData(I3.PIXEL_PACK_BUFFER, 0, a4), I3.deleteBuffer(d4), I3.deleteSync(p4), a4;
        } else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`);
      }, this.copyFramebufferToTexture = function(e33, t4 = null, n4 = 0) {
        let r4 = 2 ** -n4, i4 = Math.floor(e33.image.width * r4), a4 = Math.floor(e33.image.height * r4), o4 = t4 === null ? 0 : t4.x, s4 = t4 === null ? 0 : t4.y;
        V3.setTexture2D(e33, 0), I3.copyTexSubImage2D(I3.TEXTURE_2D, n4, 0, 0, o4, s4, i4, a4), z3.unbindTexture();
      };
      let ct3 = I3.createFramebuffer(), dt3 = I3.createFramebuffer();
      this.copyTextureToTexture = function(e33, t4, n4 = null, r4 = null, i4 = 0, a4 = null) {
        a4 === null && (i4 === 0 ? a4 = 0 : (lt(`WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels.`), a4 = i4, i4 = 0));
        let o4, s4, c4, l4, u4, d4, f4, p4, m4, h4 = e33.isCompressedTexture ? e33.mipmaps[a4] : e33.image;
        if (n4 !== null) o4 = n4.max.x - n4.min.x, s4 = n4.max.y - n4.min.y, c4 = n4.isBox3 ? n4.max.z - n4.min.z : 1, l4 = n4.min.x, u4 = n4.min.y, d4 = n4.isBox3 ? n4.min.z : 0;
        else {
          let t5 = 2 ** -i4;
          o4 = Math.floor(h4.width * t5), s4 = Math.floor(h4.height * t5), c4 = e33.isDataArrayTexture ? h4.depth : e33.isData3DTexture ? Math.floor(h4.depth * t5) : 1, l4 = 0, u4 = 0, d4 = 0;
        }
        r4 === null ? (f4 = 0, p4 = 0, m4 = 0) : (f4 = r4.x, p4 = r4.y, m4 = r4.z);
        let g4 = Me3.convert(t4.format), _3 = Me3.convert(t4.type), v3;
        t4.isData3DTexture ? (V3.setTexture3D(t4, 0), v3 = I3.TEXTURE_3D) : t4.isDataArrayTexture || t4.isCompressedArrayTexture ? (V3.setTexture2DArray(t4, 0), v3 = I3.TEXTURE_2D_ARRAY) : (V3.setTexture2D(t4, 0), v3 = I3.TEXTURE_2D), I3.pixelStorei(I3.UNPACK_FLIP_Y_WEBGL, t4.flipY), I3.pixelStorei(I3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t4.premultiplyAlpha), I3.pixelStorei(I3.UNPACK_ALIGNMENT, t4.unpackAlignment);
        let y4 = I3.getParameter(I3.UNPACK_ROW_LENGTH), b4 = I3.getParameter(I3.UNPACK_IMAGE_HEIGHT), x4 = I3.getParameter(I3.UNPACK_SKIP_PIXELS), S4 = I3.getParameter(I3.UNPACK_SKIP_ROWS), C4 = I3.getParameter(I3.UNPACK_SKIP_IMAGES);
        I3.pixelStorei(I3.UNPACK_ROW_LENGTH, h4.width), I3.pixelStorei(I3.UNPACK_IMAGE_HEIGHT, h4.height), I3.pixelStorei(I3.UNPACK_SKIP_PIXELS, l4), I3.pixelStorei(I3.UNPACK_SKIP_ROWS, u4), I3.pixelStorei(I3.UNPACK_SKIP_IMAGES, d4);
        let w4 = e33.isDataArrayTexture || e33.isData3DTexture, T3 = t4.isDataArrayTexture || t4.isData3DTexture;
        if (e33.isDepthTexture) {
          let n5 = B3.get(e33), r5 = B3.get(t4), h5 = B3.get(n5.__renderTarget), g5 = B3.get(r5.__renderTarget);
          z3.bindFramebuffer(I3.READ_FRAMEBUFFER, h5.__webglFramebuffer), z3.bindFramebuffer(I3.DRAW_FRAMEBUFFER, g5.__webglFramebuffer);
          for (let n6 = 0; n6 < c4; n6++) w4 && (I3.framebufferTextureLayer(I3.READ_FRAMEBUFFER, I3.COLOR_ATTACHMENT0, B3.get(e33).__webglTexture, i4, d4 + n6), I3.framebufferTextureLayer(I3.DRAW_FRAMEBUFFER, I3.COLOR_ATTACHMENT0, B3.get(t4).__webglTexture, a4, m4 + n6)), I3.blitFramebuffer(l4, u4, o4, s4, f4, p4, o4, s4, I3.DEPTH_BUFFER_BIT, I3.NEAREST);
          z3.bindFramebuffer(I3.READ_FRAMEBUFFER, null), z3.bindFramebuffer(I3.DRAW_FRAMEBUFFER, null);
        } else if (i4 !== 0 || e33.isRenderTargetTexture || B3.has(e33)) {
          let n5 = B3.get(e33), r5 = B3.get(t4);
          z3.bindFramebuffer(I3.READ_FRAMEBUFFER, ct3), z3.bindFramebuffer(I3.DRAW_FRAMEBUFFER, dt3);
          for (let e34 = 0; e34 < c4; e34++) w4 ? I3.framebufferTextureLayer(I3.READ_FRAMEBUFFER, I3.COLOR_ATTACHMENT0, n5.__webglTexture, i4, d4 + e34) : I3.framebufferTexture2D(I3.READ_FRAMEBUFFER, I3.COLOR_ATTACHMENT0, I3.TEXTURE_2D, n5.__webglTexture, i4), T3 ? I3.framebufferTextureLayer(I3.DRAW_FRAMEBUFFER, I3.COLOR_ATTACHMENT0, r5.__webglTexture, a4, m4 + e34) : I3.framebufferTexture2D(I3.DRAW_FRAMEBUFFER, I3.COLOR_ATTACHMENT0, I3.TEXTURE_2D, r5.__webglTexture, a4), i4 === 0 ? T3 ? I3.copyTexSubImage3D(v3, a4, f4, p4, m4 + e34, l4, u4, o4, s4) : I3.copyTexSubImage2D(v3, a4, f4, p4, l4, u4, o4, s4) : I3.blitFramebuffer(l4, u4, o4, s4, f4, p4, o4, s4, I3.COLOR_BUFFER_BIT, I3.NEAREST);
          z3.bindFramebuffer(I3.READ_FRAMEBUFFER, null), z3.bindFramebuffer(I3.DRAW_FRAMEBUFFER, null);
        } else T3 ? e33.isDataTexture || e33.isData3DTexture ? I3.texSubImage3D(v3, a4, f4, p4, m4, o4, s4, c4, g4, _3, h4.data) : t4.isCompressedArrayTexture ? I3.compressedTexSubImage3D(v3, a4, f4, p4, m4, o4, s4, c4, g4, h4.data) : I3.texSubImage3D(v3, a4, f4, p4, m4, o4, s4, c4, g4, _3, h4) : e33.isDataTexture ? I3.texSubImage2D(I3.TEXTURE_2D, a4, f4, p4, o4, s4, g4, _3, h4.data) : e33.isCompressedTexture ? I3.compressedTexSubImage2D(I3.TEXTURE_2D, a4, f4, p4, h4.width, h4.height, g4, h4.data) : I3.texSubImage2D(I3.TEXTURE_2D, a4, f4, p4, o4, s4, g4, _3, h4);
        I3.pixelStorei(I3.UNPACK_ROW_LENGTH, y4), I3.pixelStorei(I3.UNPACK_IMAGE_HEIGHT, b4), I3.pixelStorei(I3.UNPACK_SKIP_PIXELS, x4), I3.pixelStorei(I3.UNPACK_SKIP_ROWS, S4), I3.pixelStorei(I3.UNPACK_SKIP_IMAGES, C4), a4 === 0 && t4.generateMipmaps && I3.generateMipmap(v3), z3.unbindTexture();
      }, this.initRenderTarget = function(e33) {
        B3.get(e33).__webglFramebuffer === void 0 && V3.setupRenderTarget(e33);
      }, this.initTexture = function(e33) {
        e33.isCubeTexture ? V3.setTextureCube(e33, 0) : e33.isData3DTexture ? V3.setTexture3D(e33, 0) : e33.isDataArrayTexture || e33.isCompressedArrayTexture ? V3.setTexture2DArray(e33, 0) : V3.setTexture2D(e33, 0), z3.unbindTexture();
      }, this.resetState = function() {
        C3 = 0, w3 = 0, E3 = null, z3.reset(), Ne3.reset();
      }, typeof __THREE_DEVTOOLS__ < `u` && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`, { detail: this }));
    }
    get coordinateSystem() {
      return Ge;
    }
    get outputColorSpace() {
      return this._outputColorSpace;
    }
    set outputColorSpace(e32) {
      this._outputColorSpace = e32;
      let t3 = this.getContext();
      t3.drawingBufferColorSpace = K._getDrawingBufferColorSpace(e32), t3.unpackColorSpace = K._getUnpackColorSpace();
    }
  };
  function rc(e32) {
    if (e32 && !(typeof window > `u`)) {
      var t3 = document.createElement(`style`);
      return t3.setAttribute(`type`, `text/css`), t3.innerHTML = e32, document.head.appendChild(t3), e32;
    }
  }
  function ic(e32, t3) {
    var n3 = e32.__state.conversionName.toString(), r3 = Math.round(e32.r), i3 = Math.round(e32.g), a3 = Math.round(e32.b), o3 = e32.a, s3 = Math.round(e32.h), c3 = e32.s.toFixed(1), l3 = e32.v.toFixed(1);
    if (t3 || n3 === `THREE_CHAR_HEX` || n3 === `SIX_CHAR_HEX`) {
      for (var u3 = e32.hex.toString(16); u3.length < 6; ) u3 = `0` + u3;
      return `#` + u3;
    } else if (n3 === `CSS_RGB`) return `rgb(` + r3 + `,` + i3 + `,` + a3 + `)`;
    else if (n3 === `CSS_RGBA`) return `rgba(` + r3 + `,` + i3 + `,` + a3 + `,` + o3 + `)`;
    else if (n3 === `HEX`) return `0x` + e32.hex.toString(16);
    else if (n3 === `RGB_ARRAY`) return `[` + r3 + `,` + i3 + `,` + a3 + `]`;
    else if (n3 === `RGBA_ARRAY`) return `[` + r3 + `,` + i3 + `,` + a3 + `,` + o3 + `]`;
    else if (n3 === `RGB_OBJ`) return `{r:` + r3 + `,g:` + i3 + `,b:` + a3 + `}`;
    else if (n3 === `RGBA_OBJ`) return `{r:` + r3 + `,g:` + i3 + `,b:` + a3 + `,a:` + o3 + `}`;
    else if (n3 === `HSV_OBJ`) return `{h:` + s3 + `,s:` + c3 + `,v:` + l3 + `}`;
    else if (n3 === `HSVA_OBJ`) return `{h:` + s3 + `,s:` + c3 + `,v:` + l3 + `,a:` + o3 + `}`;
    return `unknown format`;
  }
  var ac = Array.prototype.forEach;
  var oc = Array.prototype.slice;
  var Z = { BREAK: {}, extend: function(e32) {
    return this.each(oc.call(arguments, 1), function(t3) {
      (this.isObject(t3) ? Object.keys(t3) : []).forEach(function(n3) {
        this.isUndefined(t3[n3]) || (e32[n3] = t3[n3]);
      }.bind(this));
    }, this), e32;
  }, defaults: function(e32) {
    return this.each(oc.call(arguments, 1), function(t3) {
      (this.isObject(t3) ? Object.keys(t3) : []).forEach(function(n3) {
        this.isUndefined(e32[n3]) && (e32[n3] = t3[n3]);
      }.bind(this));
    }, this), e32;
  }, compose: function() {
    var e32 = oc.call(arguments);
    return function() {
      for (var t3 = oc.call(arguments), n3 = e32.length - 1; n3 >= 0; n3--) t3 = [e32[n3].apply(this, t3)];
      return t3[0];
    };
  }, each: function(e32, t3, n3) {
    if (e32) {
      if (ac && e32.forEach && e32.forEach === ac) e32.forEach(t3, n3);
      else if (e32.length === e32.length + 0) {
        var r3 = void 0, i3 = void 0;
        for (r3 = 0, i3 = e32.length; r3 < i3; r3++) if (r3 in e32 && t3.call(n3, e32[r3], r3) === this.BREAK) return;
      } else for (var a3 in e32) if (t3.call(n3, e32[a3], a3) === this.BREAK) return;
    }
  }, defer: function(e32) {
    setTimeout(e32, 0);
  }, debounce: function(e32, t3, n3) {
    var r3 = void 0;
    return function() {
      var i3 = this, a3 = arguments;
      function o3() {
        r3 = null, n3 || e32.apply(i3, a3);
      }
      var s3 = n3 || !r3;
      clearTimeout(r3), r3 = setTimeout(o3, t3), s3 && e32.apply(i3, a3);
    };
  }, toArray: function(e32) {
    return e32.toArray ? e32.toArray() : oc.call(e32);
  }, isUndefined: function(e32) {
    return e32 === void 0;
  }, isNull: function(e32) {
    return e32 === null;
  }, isNaN: (function(e32) {
    function t3(t4) {
      return e32.apply(this, arguments);
    }
    return t3.toString = function() {
      return e32.toString();
    }, t3;
  })(function(e32) {
    return isNaN(e32);
  }), isArray: Array.isArray || function(e32) {
    return e32.constructor === Array;
  }, isObject: function(e32) {
    return e32 === Object(e32);
  }, isNumber: function(e32) {
    return e32 === e32 + 0;
  }, isString: function(e32) {
    return e32 === e32 + ``;
  }, isBoolean: function(e32) {
    return e32 === false || e32 === true;
  }, isFunction: function(e32) {
    return e32 instanceof Function;
  } };
  var sc = [{ litmus: Z.isString, conversions: { THREE_CHAR_HEX: { read: function(e32) {
    var t3 = e32.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
    return t3 !== null && { space: `HEX`, hex: parseInt(`0x` + t3[1].toString() + t3[1].toString() + t3[2].toString() + t3[2].toString() + t3[3].toString() + t3[3].toString(), 0) };
  }, write: ic }, SIX_CHAR_HEX: { read: function(e32) {
    var t3 = e32.match(/^#([A-F0-9]{6})$/i);
    return t3 !== null && { space: `HEX`, hex: parseInt(`0x` + t3[1].toString(), 0) };
  }, write: ic }, CSS_RGB: { read: function(e32) {
    var t3 = e32.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
    return t3 !== null && { space: `RGB`, r: parseFloat(t3[1]), g: parseFloat(t3[2]), b: parseFloat(t3[3]) };
  }, write: ic }, CSS_RGBA: { read: function(e32) {
    var t3 = e32.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
    return t3 !== null && { space: `RGB`, r: parseFloat(t3[1]), g: parseFloat(t3[2]), b: parseFloat(t3[3]), a: parseFloat(t3[4]) };
  }, write: ic } } }, { litmus: Z.isNumber, conversions: { HEX: { read: function(e32) {
    return { space: `HEX`, hex: e32, conversionName: `HEX` };
  }, write: function(e32) {
    return e32.hex;
  } } } }, { litmus: Z.isArray, conversions: { RGB_ARRAY: { read: function(e32) {
    return e32.length === 3 && { space: `RGB`, r: e32[0], g: e32[1], b: e32[2] };
  }, write: function(e32) {
    return [e32.r, e32.g, e32.b];
  } }, RGBA_ARRAY: { read: function(e32) {
    return e32.length === 4 && { space: `RGB`, r: e32[0], g: e32[1], b: e32[2], a: e32[3] };
  }, write: function(e32) {
    return [e32.r, e32.g, e32.b, e32.a];
  } } } }, { litmus: Z.isObject, conversions: { RGBA_OBJ: { read: function(e32) {
    return Z.isNumber(e32.r) && Z.isNumber(e32.g) && Z.isNumber(e32.b) && Z.isNumber(e32.a) ? { space: `RGB`, r: e32.r, g: e32.g, b: e32.b, a: e32.a } : false;
  }, write: function(e32) {
    return { r: e32.r, g: e32.g, b: e32.b, a: e32.a };
  } }, RGB_OBJ: { read: function(e32) {
    return Z.isNumber(e32.r) && Z.isNumber(e32.g) && Z.isNumber(e32.b) ? { space: `RGB`, r: e32.r, g: e32.g, b: e32.b } : false;
  }, write: function(e32) {
    return { r: e32.r, g: e32.g, b: e32.b };
  } }, HSVA_OBJ: { read: function(e32) {
    return Z.isNumber(e32.h) && Z.isNumber(e32.s) && Z.isNumber(e32.v) && Z.isNumber(e32.a) ? { space: `HSV`, h: e32.h, s: e32.s, v: e32.v, a: e32.a } : false;
  }, write: function(e32) {
    return { h: e32.h, s: e32.s, v: e32.v, a: e32.a };
  } }, HSV_OBJ: { read: function(e32) {
    return Z.isNumber(e32.h) && Z.isNumber(e32.s) && Z.isNumber(e32.v) ? { space: `HSV`, h: e32.h, s: e32.s, v: e32.v } : false;
  }, write: function(e32) {
    return { h: e32.h, s: e32.s, v: e32.v };
  } } } }];
  var cc = void 0;
  var lc = void 0;
  var uc = function() {
    lc = false;
    var e32 = arguments.length > 1 ? Z.toArray(arguments) : arguments[0];
    return Z.each(sc, function(t3) {
      if (t3.litmus(e32)) return Z.each(t3.conversions, function(t4, n3) {
        if (cc = t4.read(e32), lc === false && cc !== false) return lc = cc, cc.conversionName = n3, cc.conversion = t4, Z.BREAK;
      }), Z.BREAK;
    }), lc;
  };
  var dc = void 0;
  var fc = { hsv_to_rgb: function(e32, t3, n3) {
    var r3 = Math.floor(e32 / 60) % 6, i3 = e32 / 60 - Math.floor(e32 / 60), a3 = n3 * (1 - t3), o3 = n3 * (1 - i3 * t3), s3 = n3 * (1 - (1 - i3) * t3), c3 = [[n3, s3, a3], [o3, n3, a3], [a3, n3, s3], [a3, o3, n3], [s3, a3, n3], [n3, a3, o3]][r3];
    return { r: c3[0] * 255, g: c3[1] * 255, b: c3[2] * 255 };
  }, rgb_to_hsv: function(e32, t3, n3) {
    var r3 = Math.min(e32, t3, n3), i3 = Math.max(e32, t3, n3), a3 = i3 - r3, o3 = void 0, s3 = void 0;
    if (i3 !== 0) s3 = a3 / i3;
    else return { h: NaN, s: 0, v: 0 };
    return o3 = e32 === i3 ? (t3 - n3) / a3 : t3 === i3 ? 2 + (n3 - e32) / a3 : 4 + (e32 - t3) / a3, o3 /= 6, o3 < 0 && (o3 += 1), { h: o3 * 360, s: s3, v: i3 / 255 };
  }, rgb_to_hex: function(e32, t3, n3) {
    var r3 = this.hex_with_component(0, 2, e32);
    return r3 = this.hex_with_component(r3, 1, t3), r3 = this.hex_with_component(r3, 0, n3), r3;
  }, component_from_hex: function(e32, t3) {
    return e32 >> t3 * 8 & 255;
  }, hex_with_component: function(e32, t3, n3) {
    return n3 << (dc = t3 * 8) | e32 & ~(255 << dc);
  } };
  var pc = typeof Symbol == `function` && typeof Symbol.iterator == `symbol` ? function(e32) {
    return typeof e32;
  } : function(e32) {
    return e32 && typeof Symbol == `function` && e32.constructor === Symbol && e32 !== Symbol.prototype ? `symbol` : typeof e32;
  };
  var mc = function(e32, t3) {
    if (!(e32 instanceof t3)) throw TypeError(`Cannot call a class as a function`);
  };
  var hc = /* @__PURE__ */ (function() {
    function e32(e33, t3) {
      for (var n3 = 0; n3 < t3.length; n3++) {
        var r3 = t3[n3];
        r3.enumerable = r3.enumerable || false, r3.configurable = true, `value` in r3 && (r3.writable = true), Object.defineProperty(e33, r3.key, r3);
      }
    }
    return function(t3, n3, r3) {
      return n3 && e32(t3.prototype, n3), r3 && e32(t3, r3), t3;
    };
  })();
  var gc = function e15(t3, n3, r3) {
    t3 === null && (t3 = Function.prototype);
    var i3 = Object.getOwnPropertyDescriptor(t3, n3);
    if (i3 === void 0) {
      var a3 = Object.getPrototypeOf(t3);
      return a3 === null ? void 0 : e15(a3, n3, r3);
    } else if (`value` in i3) return i3.value;
    else {
      var o3 = i3.get;
      return o3 === void 0 ? void 0 : o3.call(r3);
    }
  };
  var _c = function(e32, t3) {
    if (typeof t3 != `function` && t3 !== null) throw TypeError(`Super expression must either be null or a function, not ` + typeof t3);
    e32.prototype = Object.create(t3 && t3.prototype, { constructor: { value: e32, enumerable: false, writable: true, configurable: true } }), t3 && (Object.setPrototypeOf ? Object.setPrototypeOf(e32, t3) : e32.__proto__ = t3);
  };
  var vc = function(e32, t3) {
    if (!e32) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return t3 && (typeof t3 == `object` || typeof t3 == `function`) ? t3 : e32;
  };
  var yc = (function() {
    function e32() {
      if (mc(this, e32), this.__state = uc.apply(this, arguments), this.__state === false) throw Error(`Failed to interpret color arguments`);
      this.__state.a = this.__state.a || 1;
    }
    return hc(e32, [{ key: `toString`, value: function() {
      return ic(this);
    } }, { key: `toHexString`, value: function() {
      return ic(this, true);
    } }, { key: `toOriginal`, value: function() {
      return this.__state.conversion.write(this);
    } }]), e32;
  })();
  function bc(e32, t3, n3) {
    Object.defineProperty(e32, t3, { get: function() {
      return this.__state.space === `RGB` || yc.recalculateRGB(this, t3, n3), this.__state[t3];
    }, set: function(e33) {
      this.__state.space !== `RGB` && (yc.recalculateRGB(this, t3, n3), this.__state.space = `RGB`), this.__state[t3] = e33;
    } });
  }
  function xc(e32, t3) {
    Object.defineProperty(e32, t3, { get: function() {
      return this.__state.space === `HSV` || yc.recalculateHSV(this), this.__state[t3];
    }, set: function(e33) {
      this.__state.space !== `HSV` && (yc.recalculateHSV(this), this.__state.space = `HSV`), this.__state[t3] = e33;
    } });
  }
  yc.recalculateRGB = function(e32, t3, n3) {
    if (e32.__state.space === `HEX`) e32.__state[t3] = fc.component_from_hex(e32.__state.hex, n3);
    else if (e32.__state.space === `HSV`) Z.extend(e32.__state, fc.hsv_to_rgb(e32.__state.h, e32.__state.s, e32.__state.v));
    else throw Error(`Corrupted color state`);
  }, yc.recalculateHSV = function(e32) {
    var t3 = fc.rgb_to_hsv(e32.r, e32.g, e32.b);
    Z.extend(e32.__state, { s: t3.s, v: t3.v }), Z.isNaN(t3.h) ? Z.isUndefined(e32.__state.h) && (e32.__state.h = 0) : e32.__state.h = t3.h;
  }, yc.COMPONENTS = [`r`, `g`, `b`, `h`, `s`, `v`, `hex`, `a`], bc(yc.prototype, `r`, 2), bc(yc.prototype, `g`, 1), bc(yc.prototype, `b`, 0), xc(yc.prototype, `h`), xc(yc.prototype, `s`), xc(yc.prototype, `v`), Object.defineProperty(yc.prototype, "a", { get: function() {
    return this.__state.a;
  }, set: function(e32) {
    this.__state.a = e32;
  } }), Object.defineProperty(yc.prototype, "hex", { get: function() {
    return this.__state.space !== `HEX` && (this.__state.hex = fc.rgb_to_hex(this.r, this.g, this.b), this.__state.space = `HEX`), this.__state.hex;
  }, set: function(e32) {
    this.__state.space = `HEX`, this.__state.hex = e32;
  } });
  var Sc = (function() {
    function e32(t3, n3) {
      mc(this, e32), this.initialValue = t3[n3], this.domElement = document.createElement(`div`), this.object = t3, this.property = n3, this.__onChange = void 0, this.__onFinishChange = void 0;
    }
    return hc(e32, [{ key: `onChange`, value: function(e33) {
      return this.__onChange = e33, this;
    } }, { key: `onFinishChange`, value: function(e33) {
      return this.__onFinishChange = e33, this;
    } }, { key: `setValue`, value: function(e33) {
      return this.object[this.property] = e33, this.__onChange && this.__onChange.call(this, e33), this.updateDisplay(), this;
    } }, { key: `getValue`, value: function() {
      return this.object[this.property];
    } }, { key: `updateDisplay`, value: function() {
      return this;
    } }, { key: `isModified`, value: function() {
      return this.initialValue !== this.getValue();
    } }]), e32;
  })();
  var Cc = { HTMLEvents: [`change`], MouseEvents: [`click`, `mousemove`, `mousedown`, `mouseup`, `mouseover`], KeyboardEvents: [`keydown`] };
  var wc = {};
  Z.each(Cc, function(e32, t3) {
    Z.each(e32, function(e33) {
      wc[e33] = t3;
    });
  });
  var Tc = /(\d+(\.\d+)?)px/;
  function Ec(e32) {
    if (e32 === `0` || Z.isUndefined(e32)) return 0;
    var t3 = e32.match(Tc);
    return Z.isNull(t3) ? 0 : parseFloat(t3[1]);
  }
  var Q = { makeSelectable: function(e32, t3) {
    e32 === void 0 || e32.style === void 0 || (e32.onselectstart = t3 ? function() {
      return false;
    } : function() {
    }, e32.style.MozUserSelect = t3 ? `auto` : `none`, e32.style.KhtmlUserSelect = t3 ? `auto` : `none`, e32.unselectable = t3 ? `on` : `off`);
  }, makeFullscreen: function(e32, t3, n3) {
    var r3 = n3, i3 = t3;
    Z.isUndefined(i3) && (i3 = true), Z.isUndefined(r3) && (r3 = true), e32.style.position = `absolute`, i3 && (e32.style.left = 0, e32.style.right = 0), r3 && (e32.style.top = 0, e32.style.bottom = 0);
  }, fakeEvent: function(e32, t3, n3, r3) {
    var i3 = n3 || {}, a3 = wc[t3];
    if (!a3) throw Error(`Event type ` + t3 + ` not supported.`);
    var o3 = document.createEvent(a3);
    switch (a3) {
      case `MouseEvents`:
        var s3 = i3.x || i3.clientX || 0, c3 = i3.y || i3.clientY || 0;
        o3.initMouseEvent(t3, i3.bubbles || false, i3.cancelable || true, window, i3.clickCount || 1, 0, 0, s3, c3, false, false, false, false, 0, null);
        break;
      case `KeyboardEvents`:
        var l3 = o3.initKeyboardEvent || o3.initKeyEvent;
        Z.defaults(i3, { cancelable: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, keyCode: void 0, charCode: void 0 }), l3(t3, i3.bubbles || false, i3.cancelable, window, i3.ctrlKey, i3.altKey, i3.shiftKey, i3.metaKey, i3.keyCode, i3.charCode);
        break;
      default:
        o3.initEvent(t3, i3.bubbles || false, i3.cancelable || true);
        break;
    }
    Z.defaults(o3, r3), e32.dispatchEvent(o3);
  }, bind: function(e32, t3, n3, r3) {
    var i3 = r3 || false;
    return e32.addEventListener ? e32.addEventListener(t3, n3, i3) : e32.attachEvent && e32.attachEvent(`on` + t3, n3), Q;
  }, unbind: function(e32, t3, n3, r3) {
    var i3 = r3 || false;
    return e32.removeEventListener ? e32.removeEventListener(t3, n3, i3) : e32.detachEvent && e32.detachEvent(`on` + t3, n3), Q;
  }, addClass: function(e32, t3) {
    if (e32.className === void 0) e32.className = t3;
    else if (e32.className !== t3) {
      var n3 = e32.className.split(/ +/);
      n3.indexOf(t3) === -1 && (n3.push(t3), e32.className = n3.join(` `).replace(/^\s+/, ``).replace(/\s+$/, ``));
    }
    return Q;
  }, removeClass: function(e32, t3) {
    if (t3) if (e32.className === t3) e32.removeAttribute(`class`);
    else {
      var n3 = e32.className.split(/ +/), r3 = n3.indexOf(t3);
      r3 !== -1 && (n3.splice(r3, 1), e32.className = n3.join(` `));
    }
    else e32.className = void 0;
    return Q;
  }, hasClass: function(e32, t3) {
    return RegExp(`(?:^|\\s+)` + t3 + `(?:\\s+|$)`).test(e32.className) || false;
  }, getWidth: function(e32) {
    var t3 = getComputedStyle(e32);
    return Ec(t3[`border-left-width`]) + Ec(t3[`border-right-width`]) + Ec(t3[`padding-left`]) + Ec(t3[`padding-right`]) + Ec(t3.width);
  }, getHeight: function(e32) {
    var t3 = getComputedStyle(e32);
    return Ec(t3[`border-top-width`]) + Ec(t3[`border-bottom-width`]) + Ec(t3[`padding-top`]) + Ec(t3[`padding-bottom`]) + Ec(t3.height);
  }, getOffset: function(e32) {
    var t3 = e32, n3 = { left: 0, top: 0 };
    if (t3.offsetParent) do
      n3.left += t3.offsetLeft, n3.top += t3.offsetTop, t3 = t3.offsetParent;
    while (t3);
    return n3;
  }, isActive: function(e32) {
    return e32 === document.activeElement && (e32.type || e32.href);
  } };
  var Dc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3) {
      mc(this, t3);
      var r3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3)), i3 = r3;
      r3.__prev = r3.getValue(), r3.__checkbox = document.createElement(`input`), r3.__checkbox.setAttribute(`type`, `checkbox`);
      function a3() {
        i3.setValue(!i3.__prev);
      }
      return Q.bind(r3.__checkbox, `change`, a3, false), r3.domElement.appendChild(r3.__checkbox), r3.updateDisplay(), r3;
    }
    return hc(t3, [{ key: `setValue`, value: function(e33) {
      var n3 = gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `setValue`, this).call(this, e33);
      return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), n3;
    } }, { key: `updateDisplay`, value: function() {
      return this.getValue() === true ? (this.__checkbox.setAttribute(`checked`, `checked`), this.__checkbox.checked = true, this.__prev = true) : (this.__checkbox.checked = false, this.__prev = false), gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `updateDisplay`, this).call(this);
    } }]), t3;
  })(Sc);
  var Oc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3, r3) {
      mc(this, t3);
      var i3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3)), a3 = r3, o3 = i3;
      if (i3.__select = document.createElement(`select`), Z.isArray(a3)) {
        var s3 = {};
        Z.each(a3, function(e34) {
          s3[e34] = e34;
        }), a3 = s3;
      }
      return Z.each(a3, function(e34, t4) {
        var n4 = document.createElement(`option`);
        n4.innerHTML = t4, n4.setAttribute(`value`, e34), o3.__select.appendChild(n4);
      }), i3.updateDisplay(), Q.bind(i3.__select, `change`, function() {
        var e34 = this.options[this.selectedIndex].value;
        o3.setValue(e34);
      }), i3.domElement.appendChild(i3.__select), i3;
    }
    return hc(t3, [{ key: `setValue`, value: function(e33) {
      var n3 = gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `setValue`, this).call(this, e33);
      return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), n3;
    } }, { key: `updateDisplay`, value: function() {
      return Q.isActive(this.__select) ? this : (this.__select.value = this.getValue(), gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `updateDisplay`, this).call(this));
    } }]), t3;
  })(Sc);
  var kc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3) {
      mc(this, t3);
      var r3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3)), i3 = r3;
      function a3() {
        i3.setValue(i3.__input.value);
      }
      function o3() {
        i3.__onFinishChange && i3.__onFinishChange.call(i3, i3.getValue());
      }
      return r3.__input = document.createElement(`input`), r3.__input.setAttribute(`type`, `text`), Q.bind(r3.__input, `keyup`, a3), Q.bind(r3.__input, `change`, a3), Q.bind(r3.__input, `blur`, o3), Q.bind(r3.__input, `keydown`, function(e34) {
        e34.keyCode === 13 && this.blur();
      }), r3.updateDisplay(), r3.domElement.appendChild(r3.__input), r3;
    }
    return hc(t3, [{ key: `updateDisplay`, value: function() {
      return Q.isActive(this.__input) || (this.__input.value = this.getValue()), gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `updateDisplay`, this).call(this);
    } }]), t3;
  })(Sc);
  function Ac(e32) {
    var t3 = e32.toString();
    return t3.indexOf(`.`) > -1 ? t3.length - t3.indexOf(`.`) - 1 : 0;
  }
  var jc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3, r3) {
      mc(this, t3);
      var i3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3)), a3 = r3 || {};
      return i3.__min = a3.min, i3.__max = a3.max, i3.__step = a3.step, Z.isUndefined(i3.__step) ? i3.initialValue === 0 ? i3.__impliedStep = 1 : i3.__impliedStep = 10 ** Math.floor(Math.log(Math.abs(i3.initialValue)) / Math.LN10) / 10 : i3.__impliedStep = i3.__step, i3.__precision = Ac(i3.__impliedStep), i3;
    }
    return hc(t3, [{ key: `setValue`, value: function(e33) {
      var n3 = e33;
      return this.__min !== void 0 && n3 < this.__min ? n3 = this.__min : this.__max !== void 0 && n3 > this.__max && (n3 = this.__max), this.__step !== void 0 && n3 % this.__step !== 0 && (n3 = Math.round(n3 / this.__step) * this.__step), gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `setValue`, this).call(this, n3);
    } }, { key: `min`, value: function(e33) {
      return this.__min = e33, this;
    } }, { key: `max`, value: function(e33) {
      return this.__max = e33, this;
    } }, { key: `step`, value: function(e33) {
      return this.__step = e33, this.__impliedStep = e33, this.__precision = Ac(e33), this;
    } }]), t3;
  })(Sc);
  function Mc(e32, t3) {
    var n3 = 10 ** t3;
    return Math.round(e32 * n3) / n3;
  }
  var Nc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3, r3) {
      mc(this, t3);
      var i3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3, r3));
      i3.__truncationSuspended = false;
      var a3 = i3, o3 = void 0;
      function s3() {
        var e34 = parseFloat(a3.__input.value);
        Z.isNaN(e34) || a3.setValue(e34);
      }
      function c3() {
        a3.__onFinishChange && a3.__onFinishChange.call(a3, a3.getValue());
      }
      function l3() {
        c3();
      }
      function u3(e34) {
        var t4 = o3 - e34.clientY;
        a3.setValue(a3.getValue() + t4 * a3.__impliedStep), o3 = e34.clientY;
      }
      function d3() {
        Q.unbind(window, `mousemove`, u3), Q.unbind(window, `mouseup`, d3), c3();
      }
      function f3(e34) {
        Q.bind(window, `mousemove`, u3), Q.bind(window, `mouseup`, d3), o3 = e34.clientY;
      }
      return i3.__input = document.createElement(`input`), i3.__input.setAttribute(`type`, `text`), Q.bind(i3.__input, `change`, s3), Q.bind(i3.__input, `blur`, l3), Q.bind(i3.__input, `mousedown`, f3), Q.bind(i3.__input, `keydown`, function(e34) {
        e34.keyCode === 13 && (a3.__truncationSuspended = true, this.blur(), a3.__truncationSuspended = false, c3());
      }), i3.updateDisplay(), i3.domElement.appendChild(i3.__input), i3;
    }
    return hc(t3, [{ key: `updateDisplay`, value: function() {
      return this.__input.value = this.__truncationSuspended ? this.getValue() : Mc(this.getValue(), this.__precision), gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `updateDisplay`, this).call(this);
    } }]), t3;
  })(jc);
  function Pc(e32, t3, n3, r3, i3) {
    return r3 + (i3 - r3) * ((e32 - t3) / (n3 - t3));
  }
  var Fc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3, r3, i3, a3) {
      mc(this, t3);
      var o3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3, { min: r3, max: i3, step: a3 })), s3 = o3;
      o3.__background = document.createElement(`div`), o3.__foreground = document.createElement(`div`), Q.bind(o3.__background, `mousedown`, c3), Q.bind(o3.__background, `touchstart`, d3), Q.addClass(o3.__background, `slider`), Q.addClass(o3.__foreground, `slider-fg`);
      function c3(e34) {
        document.activeElement.blur(), Q.bind(window, `mousemove`, l3), Q.bind(window, `mouseup`, u3), l3(e34);
      }
      function l3(e34) {
        e34.preventDefault();
        var t4 = s3.__background.getBoundingClientRect();
        return s3.setValue(Pc(e34.clientX, t4.left, t4.right, s3.__min, s3.__max)), false;
      }
      function u3() {
        Q.unbind(window, `mousemove`, l3), Q.unbind(window, `mouseup`, u3), s3.__onFinishChange && s3.__onFinishChange.call(s3, s3.getValue());
      }
      function d3(e34) {
        e34.touches.length === 1 && (Q.bind(window, `touchmove`, f3), Q.bind(window, `touchend`, p3), f3(e34));
      }
      function f3(e34) {
        var t4 = e34.touches[0].clientX, n4 = s3.__background.getBoundingClientRect();
        s3.setValue(Pc(t4, n4.left, n4.right, s3.__min, s3.__max));
      }
      function p3() {
        Q.unbind(window, `touchmove`, f3), Q.unbind(window, `touchend`, p3), s3.__onFinishChange && s3.__onFinishChange.call(s3, s3.getValue());
      }
      return o3.updateDisplay(), o3.__background.appendChild(o3.__foreground), o3.domElement.appendChild(o3.__background), o3;
    }
    return hc(t3, [{ key: `updateDisplay`, value: function() {
      var e33 = (this.getValue() - this.__min) / (this.__max - this.__min);
      return this.__foreground.style.width = e33 * 100 + `%`, gc(t3.prototype.__proto__ || Object.getPrototypeOf(t3.prototype), `updateDisplay`, this).call(this);
    } }]), t3;
  })(jc);
  var Ic = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3, r3) {
      mc(this, t3);
      var i3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3)), a3 = i3;
      return i3.__button = document.createElement(`div`), i3.__button.innerHTML = r3 === void 0 ? `Fire` : r3, Q.bind(i3.__button, `click`, function(e34) {
        return e34.preventDefault(), a3.fire(), false;
      }), Q.addClass(i3.__button, `button`), i3.domElement.appendChild(i3.__button), i3;
    }
    return hc(t3, [{ key: `fire`, value: function() {
      this.__onChange && this.__onChange.call(this), this.getValue().call(this.object), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue());
    } }]), t3;
  })(Sc);
  var Lc = (function(e32) {
    _c(t3, e32);
    function t3(e33, n3) {
      mc(this, t3);
      var r3 = vc(this, (t3.__proto__ || Object.getPrototypeOf(t3)).call(this, e33, n3));
      r3.__color = new yc(r3.getValue()), r3.__temp = new yc(0);
      var i3 = r3;
      r3.domElement = document.createElement(`div`), Q.makeSelectable(r3.domElement, false), r3.__selector = document.createElement(`div`), r3.__selector.className = `selector`, r3.__saturation_field = document.createElement(`div`), r3.__saturation_field.className = `saturation-field`, r3.__field_knob = document.createElement(`div`), r3.__field_knob.className = `field-knob`, r3.__field_knob_border = `2px solid `, r3.__hue_knob = document.createElement(`div`), r3.__hue_knob.className = `hue-knob`, r3.__hue_field = document.createElement(`div`), r3.__hue_field.className = `hue-field`, r3.__input = document.createElement(`input`), r3.__input.type = `text`, r3.__input_textShadow = `0 1px 1px `, Q.bind(r3.__input, `keydown`, function(e34) {
        e34.keyCode === 13 && u3.call(this);
      }), Q.bind(r3.__input, `blur`, u3), Q.bind(r3.__selector, `mousedown`, function() {
        Q.addClass(this, `drag`).bind(window, `mouseup`, function() {
          Q.removeClass(i3.__selector, `drag`);
        });
      }), Q.bind(r3.__selector, `touchstart`, function() {
        Q.addClass(this, `drag`).bind(window, `touchend`, function() {
          Q.removeClass(i3.__selector, `drag`);
        });
      });
      var a3 = document.createElement(`div`);
      Z.extend(r3.__selector.style, { width: `122px`, height: `102px`, padding: `3px`, backgroundColor: `#222`, boxShadow: `0px 1px 3px rgba(0,0,0,0.3)` }), Z.extend(r3.__field_knob.style, { position: `absolute`, width: `12px`, height: `12px`, border: r3.__field_knob_border + (r3.__color.v < 0.5 ? `#fff` : `#000`), boxShadow: `0px 1px 3px rgba(0,0,0,0.5)`, borderRadius: `12px`, zIndex: 1 }), Z.extend(r3.__hue_knob.style, { position: `absolute`, width: `15px`, height: `2px`, borderRight: `4px solid #fff`, zIndex: 1 }), Z.extend(r3.__saturation_field.style, { width: `100px`, height: `100px`, border: `1px solid #555`, marginRight: `3px`, display: `inline-block`, cursor: `pointer` }), Z.extend(a3.style, { width: `100%`, height: `100%`, background: `none` }), zc(a3, `top`, `rgba(0,0,0,0)`, `#000`), Z.extend(r3.__hue_field.style, { width: `15px`, height: `100px`, border: `1px solid #555`, cursor: `ns-resize`, position: `absolute`, top: `3px`, right: `3px` }), Bc(r3.__hue_field), Z.extend(r3.__input.style, { outline: `none`, textAlign: `center`, color: `#fff`, border: 0, fontWeight: `bold`, textShadow: r3.__input_textShadow + `rgba(0,0,0,0.7)` }), Q.bind(r3.__saturation_field, `mousedown`, o3), Q.bind(r3.__saturation_field, `touchstart`, o3), Q.bind(r3.__field_knob, `mousedown`, o3), Q.bind(r3.__field_knob, `touchstart`, o3), Q.bind(r3.__hue_field, `mousedown`, s3), Q.bind(r3.__hue_field, `touchstart`, s3);
      function o3(e34) {
        f3(e34), Q.bind(window, `mousemove`, f3), Q.bind(window, `touchmove`, f3), Q.bind(window, `mouseup`, c3), Q.bind(window, `touchend`, c3);
      }
      function s3(e34) {
        p3(e34), Q.bind(window, `mousemove`, p3), Q.bind(window, `touchmove`, p3), Q.bind(window, `mouseup`, l3), Q.bind(window, `touchend`, l3);
      }
      function c3() {
        Q.unbind(window, `mousemove`, f3), Q.unbind(window, `touchmove`, f3), Q.unbind(window, `mouseup`, c3), Q.unbind(window, `touchend`, c3), d3();
      }
      function l3() {
        Q.unbind(window, `mousemove`, p3), Q.unbind(window, `touchmove`, p3), Q.unbind(window, `mouseup`, l3), Q.unbind(window, `touchend`, l3), d3();
      }
      function u3() {
        var e34 = uc(this.value);
        e34 === false ? this.value = i3.__color.toString() : (i3.__color.__state = e34, i3.setValue(i3.__color.toOriginal()));
      }
      function d3() {
        i3.__onFinishChange && i3.__onFinishChange.call(i3, i3.__color.toOriginal());
      }
      r3.__saturation_field.appendChild(a3), r3.__selector.appendChild(r3.__field_knob), r3.__selector.appendChild(r3.__saturation_field), r3.__selector.appendChild(r3.__hue_field), r3.__hue_field.appendChild(r3.__hue_knob), r3.domElement.appendChild(r3.__input), r3.domElement.appendChild(r3.__selector), r3.updateDisplay();
      function f3(e34) {
        e34.type.indexOf(`touch`) === -1 && e34.preventDefault();
        var t4 = i3.__saturation_field.getBoundingClientRect(), n4 = e34.touches && e34.touches[0] || e34, r4 = n4.clientX, a4 = n4.clientY, o4 = (r4 - t4.left) / (t4.right - t4.left), s4 = 1 - (a4 - t4.top) / (t4.bottom - t4.top);
        return s4 > 1 ? s4 = 1 : s4 < 0 && (s4 = 0), o4 > 1 ? o4 = 1 : o4 < 0 && (o4 = 0), i3.__color.v = s4, i3.__color.s = o4, i3.setValue(i3.__color.toOriginal()), false;
      }
      function p3(e34) {
        e34.type.indexOf(`touch`) === -1 && e34.preventDefault();
        var t4 = i3.__hue_field.getBoundingClientRect(), n4 = 1 - ((e34.touches && e34.touches[0] || e34).clientY - t4.top) / (t4.bottom - t4.top);
        return n4 > 1 ? n4 = 1 : n4 < 0 && (n4 = 0), i3.__color.h = n4 * 360, i3.setValue(i3.__color.toOriginal()), false;
      }
      return r3;
    }
    return hc(t3, [{ key: `updateDisplay`, value: function() {
      var e33 = uc(this.getValue());
      if (e33 !== false) {
        var t4 = false;
        Z.each(yc.COMPONENTS, function(n4) {
          if (!Z.isUndefined(e33[n4]) && !Z.isUndefined(this.__color.__state[n4]) && e33[n4] !== this.__color.__state[n4]) return t4 = true, {};
        }, this), t4 && Z.extend(this.__color.__state, e33);
      }
      Z.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
      var n3 = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0, r3 = 255 - n3;
      Z.extend(this.__field_knob.style, { marginLeft: 100 * this.__color.s - 7 + `px`, marginTop: 100 * (1 - this.__color.v) - 7 + `px`, backgroundColor: this.__temp.toHexString(), border: this.__field_knob_border + `rgb(` + n3 + `,` + n3 + `,` + n3 + `)` }), this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + `px`, this.__temp.s = 1, this.__temp.v = 1, zc(this.__saturation_field, `left`, `#fff`, this.__temp.toHexString()), this.__input.value = this.__color.toString(), Z.extend(this.__input.style, { backgroundColor: this.__color.toHexString(), color: `rgb(` + n3 + `,` + n3 + `,` + n3 + `)`, textShadow: this.__input_textShadow + `rgba(` + r3 + `,` + r3 + `,` + r3 + `,.7)` });
    } }]), t3;
  })(Sc);
  var Rc = [`-moz-`, `-o-`, `-webkit-`, `-ms-`, ``];
  function zc(e32, t3, n3, r3) {
    e32.style.background = ``, Z.each(Rc, function(i3) {
      e32.style.cssText += `background: ` + i3 + `linear-gradient(` + t3 + `, ` + n3 + ` 0%, ` + r3 + ` 100%); `;
    });
  }
  function Bc(e32) {
    e32.style.background = ``, e32.style.cssText += `background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);`, e32.style.cssText += `background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`, e32.style.cssText += `background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`, e32.style.cssText += `background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`, e32.style.cssText += `background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);`;
  }
  var Vc = { load: function(e32, t3) {
    var n3 = t3 || document, r3 = n3.createElement(`link`);
    r3.type = `text/css`, r3.rel = `stylesheet`, r3.href = e32, n3.getElementsByTagName(`head`)[0].appendChild(r3);
  }, inject: function(e32, t3) {
    var n3 = t3 || document, r3 = document.createElement(`style`);
    r3.type = `text/css`, r3.innerHTML = e32;
    var i3 = n3.getElementsByTagName(`head`)[0];
    try {
      i3.appendChild(r3);
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
  var Uc = function(e32, t3) {
    var n3 = e32[t3];
    return Z.isArray(arguments[2]) || Z.isObject(arguments[2]) ? new Oc(e32, t3, arguments[2]) : Z.isNumber(n3) ? Z.isNumber(arguments[2]) && Z.isNumber(arguments[3]) ? Z.isNumber(arguments[4]) ? new Fc(e32, t3, arguments[2], arguments[3], arguments[4]) : new Fc(e32, t3, arguments[2], arguments[3]) : Z.isNumber(arguments[4]) ? new Nc(e32, t3, { min: arguments[2], max: arguments[3], step: arguments[4] }) : new Nc(e32, t3, { min: arguments[2], max: arguments[3] }) : Z.isString(n3) ? new kc(e32, t3) : Z.isFunction(n3) ? new Ic(e32, t3, ``) : Z.isBoolean(n3) ? new Dc(e32, t3) : null;
  };
  function Wc(e32) {
    setTimeout(e32, 1e3 / 60);
  }
  var Gc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Wc;
  var Kc = (function() {
    function e32() {
      mc(this, e32), this.backgroundElement = document.createElement(`div`), Z.extend(this.backgroundElement.style, { backgroundColor: `rgba(0,0,0,0.8)`, top: 0, left: 0, display: `none`, zIndex: `1000`, opacity: 0, WebkitTransition: `opacity 0.2s linear`, transition: `opacity 0.2s linear` }), Q.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = `fixed`, this.domElement = document.createElement(`div`), Z.extend(this.domElement.style, { position: `fixed`, display: `none`, zIndex: `1001`, opacity: 0, WebkitTransition: `-webkit-transform 0.2s ease-out, opacity 0.2s linear`, transition: `transform 0.2s ease-out, opacity 0.2s linear` }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
      var t3 = this;
      Q.bind(this.backgroundElement, `click`, function() {
        t3.hide();
      });
    }
    return hc(e32, [{ key: `show`, value: function() {
      var e33 = this;
      this.backgroundElement.style.display = `block`, this.domElement.style.display = `block`, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = `scale(1.1)`, this.layout(), Z.defer(function() {
        e33.backgroundElement.style.opacity = 1, e33.domElement.style.opacity = 1, e33.domElement.style.webkitTransform = `scale(1)`;
      });
    } }, { key: `hide`, value: function() {
      var e33 = this, t3 = function t4() {
        e33.domElement.style.display = `none`, e33.backgroundElement.style.display = `none`, Q.unbind(e33.domElement, `webkitTransitionEnd`, t4), Q.unbind(e33.domElement, `transitionend`, t4), Q.unbind(e33.domElement, `oTransitionEnd`, t4);
      };
      Q.bind(this.domElement, `webkitTransitionEnd`, t3), Q.bind(this.domElement, `transitionend`, t3), Q.bind(this.domElement, `oTransitionEnd`, t3), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = `scale(1.1)`;
    } }, { key: `layout`, value: function() {
      this.domElement.style.left = window.innerWidth / 2 - Q.getWidth(this.domElement) / 2 + `px`, this.domElement.style.top = window.innerHeight / 2 - Q.getHeight(this.domElement) / 2 + `px`;
    } }]), e32;
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
  var $ = function e16(t3) {
    var n3 = this, r3 = t3 || {};
    this.domElement = document.createElement(`div`), this.__ul = document.createElement(`ul`), this.domElement.appendChild(this.__ul), Q.addClass(this.domElement, Jc), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], r3 = Z.defaults(r3, { closeOnTop: false, autoPlace: true, width: e16.DEFAULT_WIDTH }), r3 = Z.defaults(r3, { resizable: r3.autoPlace, hideable: r3.autoPlace }), Z.isUndefined(r3.load) ? r3.load = { preset: Zc } : r3.preset && (r3.load.preset = r3.preset), Z.isUndefined(r3.parent) && r3.hideable && rl.push(this), r3.resizable = Z.isUndefined(r3.parent) && r3.resizable, r3.autoPlace && Z.isUndefined(r3.scrollable) && (r3.scrollable = true);
    var i3 = Qc && localStorage.getItem(ul(this, `isLocal`)) === `true`, a3 = void 0, o3 = void 0;
    if (Object.defineProperties(this, { parent: { get: function() {
      return r3.parent;
    } }, scrollable: { get: function() {
      return r3.scrollable;
    } }, autoPlace: { get: function() {
      return r3.autoPlace;
    } }, closeOnTop: { get: function() {
      return r3.closeOnTop;
    } }, preset: { get: function() {
      return n3.parent ? n3.getRoot().preset : r3.load.preset;
    }, set: function(e32) {
      n3.parent ? n3.getRoot().preset = e32 : r3.load.preset = e32, _l(this), n3.revert();
    } }, width: { get: function() {
      return r3.width;
    }, set: function(e32) {
      r3.width = e32, hl(n3, e32);
    } }, name: { get: function() {
      return r3.name;
    }, set: function(e32) {
      r3.name = e32, o3 && (o3.innerHTML = r3.name);
    } }, closed: { get: function() {
      return r3.closed;
    }, set: function(t4) {
      r3.closed = t4, r3.closed ? Q.addClass(n3.__ul, e16.CLASS_CLOSED) : Q.removeClass(n3.__ul, e16.CLASS_CLOSED), this.onResize(), n3.__closeButton && (n3.__closeButton.innerHTML = t4 ? e16.TEXT_OPEN : e16.TEXT_CLOSED);
    } }, load: { get: function() {
      return r3.load;
    } }, useLocalStorage: { get: function() {
      return i3;
    }, set: function(e32) {
      Qc && (i3 = e32, e32 ? Q.bind(window, `unload`, a3) : Q.unbind(window, `unload`, a3), localStorage.setItem(ul(n3, `isLocal`), e32));
    } } }), Z.isUndefined(r3.parent)) {
      if (this.closed = r3.closed || false, Q.addClass(this.domElement, e16.CLASS_MAIN), Q.makeSelectable(this.domElement, false), Qc && i3) {
        n3.useLocalStorage = true;
        var s3 = localStorage.getItem(ul(this, `gui`));
        s3 && (r3.load = JSON.parse(s3));
      }
      this.__closeButton = document.createElement(`div`), this.__closeButton.innerHTML = e16.TEXT_CLOSED, Q.addClass(this.__closeButton, e16.CLASS_CLOSE_BUTTON), r3.closeOnTop ? (Q.addClass(this.__closeButton, e16.CLASS_CLOSE_TOP), this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0])) : (Q.addClass(this.__closeButton, e16.CLASS_CLOSE_BOTTOM), this.domElement.appendChild(this.__closeButton)), Q.bind(this.__closeButton, `click`, function() {
        n3.closed = !n3.closed;
      });
    } else {
      r3.closed === void 0 && (r3.closed = true);
      var c3 = document.createTextNode(r3.name);
      Q.addClass(c3, `controller-name`), o3 = il(n3, c3), Q.addClass(this.__ul, e16.CLASS_CLOSED), Q.addClass(o3, `title`), Q.bind(o3, `click`, function(e32) {
        return e32.preventDefault(), n3.closed = !n3.closed, false;
      }), r3.closed || (this.closed = false);
    }
    r3.autoPlace && (Z.isUndefined(r3.parent) && (el && (el = (tl = document.createElement(`div`), Q.addClass(tl, Jc), Q.addClass(tl, e16.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(tl), false)), tl.appendChild(this.domElement), Q.addClass(this.domElement, e16.CLASS_AUTO_PLACE)), this.parent || hl(n3, r3.width)), this.__resizeHandler = function() {
      n3.onResizeDebounced();
    }, Q.bind(window, `resize`, this.__resizeHandler), Q.bind(this.__ul, `webkitTransitionEnd`, this.__resizeHandler), Q.bind(this.__ul, `transitionend`, this.__resizeHandler), Q.bind(this.__ul, `oTransitionEnd`, this.__resizeHandler), this.onResize(), r3.resizable && ml(this), a3 = function() {
      Qc && localStorage.getItem(ul(n3, `isLocal`)) === `true` && localStorage.setItem(ul(n3, `gui`), JSON.stringify(n3.getSaveObject()));
    }, this.saveToLocalStorageIfPossible = a3;
    function l3() {
      var e32 = n3.getRoot();
      e32.width += 1, Z.defer(function() {
        --e32.width;
      });
    }
    r3.parent || l3();
  };
  $.toggleHide = function() {
    nl = !nl, Z.each(rl, function(e32) {
      e32.domElement.style.display = nl ? `none` : ``;
    });
  }, $.CLASS_AUTO_PLACE = `a`, $.CLASS_AUTO_PLACE_CONTAINER = `ac`, $.CLASS_MAIN = `main`, $.CLASS_CONTROLLER_ROW = `cr`, $.CLASS_TOO_TALL = `taller-than-window`, $.CLASS_CLOSED = `closed`, $.CLASS_CLOSE_BUTTON = `close-button`, $.CLASS_CLOSE_TOP = `close-top`, $.CLASS_CLOSE_BOTTOM = `close-bottom`, $.CLASS_DRAG = `drag`, $.DEFAULT_WIDTH = 245, $.TEXT_CLOSED = `Close Controls`, $.TEXT_OPEN = `Open Controls`, $._keydownHandler = function(e32) {
    document.activeElement.type !== `text` && (e32.which === Yc || e32.keyCode === Yc) && $.toggleHide();
  }, Q.bind(window, `keydown`, $._keydownHandler, false), Z.extend($.prototype, { add: function(e32, t3) {
    return ll(this, e32, t3, { factoryArgs: Array.prototype.slice.call(arguments, 2) });
  }, addColor: function(e32, t3) {
    return ll(this, e32, t3, { color: true });
  }, remove: function(e32) {
    this.__ul.removeChild(e32.__li), this.__controllers.splice(this.__controllers.indexOf(e32), 1);
    var t3 = this;
    Z.defer(function() {
      t3.onResize();
    });
  }, destroy: function() {
    if (this.parent) throw Error(`Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.`);
    this.autoPlace && tl.removeChild(this.domElement);
    var e32 = this;
    Z.each(this.__folders, function(t3) {
      e32.removeFolder(t3);
    }), Q.unbind(window, `keydown`, $._keydownHandler, false), al(this);
  }, addFolder: function(e32) {
    if (this.__folders[e32] !== void 0) throw Error(`You already have a folder in this GUI by the name "` + e32 + `"`);
    var t3 = { name: e32, parent: this };
    t3.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[e32] && (t3.closed = this.load.folders[e32].closed, t3.load = this.load.folders[e32]);
    var n3 = new $(t3);
    this.__folders[e32] = n3;
    var r3 = il(this, n3.domElement);
    return Q.addClass(r3, `folder`), n3;
  }, removeFolder: function(e32) {
    this.__ul.removeChild(e32.domElement.parentElement), delete this.__folders[e32.name], this.load && this.load.folders && this.load.folders[e32.name] && delete this.load.folders[e32.name], al(e32);
    var t3 = this;
    Z.each(e32.__folders, function(t4) {
      e32.removeFolder(t4);
    }), Z.defer(function() {
      t3.onResize();
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
    var e32 = this.getRoot();
    if (e32.scrollable) {
      var t3 = Q.getOffset(e32.__ul).top, n3 = 0;
      Z.each(e32.__ul.childNodes, function(t4) {
        e32.autoPlace && t4 === e32.__save_row || (n3 += Q.getHeight(t4));
      }), window.innerHeight - t3 - Xc < n3 ? (Q.addClass(e32.domElement, $.CLASS_TOO_TALL), e32.__ul.style.height = window.innerHeight - t3 - Xc + `px`) : (Q.removeClass(e32.domElement, $.CLASS_TOO_TALL), e32.__ul.style.height = `auto`);
    }
    e32.__resize_handle && Z.defer(function() {
      e32.__resize_handle.style.height = e32.__ul.offsetHeight + `px`;
    }), e32.__closeButton && (e32.__closeButton.style.width = e32.width + `px`);
  }, onResizeDebounced: Z.debounce(function() {
    this.onResize();
  }, 50), remember: function() {
    if (Z.isUndefined($c) && ($c = new Kc(), $c.domElement.innerHTML = Hc), this.parent) throw Error(`You can only call remember on a top level GUI.`);
    var e32 = this;
    Z.each(Array.prototype.slice.call(arguments), function(t3) {
      e32.__rememberedObjects.length === 0 && pl(e32), e32.__rememberedObjects.indexOf(t3) === -1 && e32.__rememberedObjects.push(t3);
    }), this.autoPlace && hl(this, this.width);
  }, getRoot: function() {
    for (var e32 = this; e32.parent; ) e32 = e32.parent;
    return e32;
  }, getSaveObject: function() {
    var e32 = this.load;
    return e32.closed = this.closed, this.__rememberedObjects.length > 0 && (e32.preset = this.preset, e32.remembered || (e32.remembered = {}), e32.remembered[this.preset] = gl(this)), e32.folders = {}, Z.each(this.__folders, function(t3, n3) {
      e32.folders[n3] = t3.getSaveObject();
    }), e32;
  }, save: function() {
    this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = gl(this), ol(this, false), this.saveToLocalStorageIfPossible();
  }, saveAs: function(e32) {
    this.load.remembered || (this.load.remembered = {}, this.load.remembered[Zc] = gl(this, true)), this.load.remembered[e32] = gl(this), this.preset = e32, dl(this, e32, true), this.saveToLocalStorageIfPossible();
  }, revert: function(e32) {
    Z.each(this.__controllers, function(t3) {
      this.getRoot().load.remembered ? cl(e32 || this.getRoot(), t3) : t3.setValue(t3.initialValue), t3.__onFinishChange && t3.__onFinishChange.call(t3, t3.getValue());
    }, this), Z.each(this.__folders, function(e33) {
      e33.revert(e33);
    }), e32 || ol(this.getRoot(), false);
  }, listen: function(e32) {
    var t3 = this.__listening.length === 0;
    this.__listening.push(e32), t3 && vl(this.__listening);
  }, updateDisplay: function() {
    Z.each(this.__controllers, function(e32) {
      e32.updateDisplay();
    }), Z.each(this.__folders, function(e32) {
      e32.updateDisplay();
    });
  } });
  function il(e32, t3, n3) {
    var r3 = document.createElement(`li`);
    return t3 && r3.appendChild(t3), n3 ? e32.__ul.insertBefore(r3, n3) : e32.__ul.appendChild(r3), e32.onResize(), r3;
  }
  function al(e32) {
    Q.unbind(window, `resize`, e32.__resizeHandler), e32.saveToLocalStorageIfPossible && Q.unbind(window, `unload`, e32.saveToLocalStorageIfPossible);
  }
  function ol(e32, t3) {
    var n3 = e32.__preset_select[e32.__preset_select.selectedIndex];
    t3 ? n3.innerHTML = n3.value + `*` : n3.innerHTML = n3.value;
  }
  function sl(e32, t3, n3) {
    if (n3.__li = t3, n3.__gui = e32, Z.extend(n3, { options: function(t4) {
      if (arguments.length > 1) {
        var r4 = n3.__li.nextElementSibling;
        return n3.remove(), ll(e32, n3.object, n3.property, { before: r4, factoryArgs: [Z.toArray(arguments)] });
      }
      if (Z.isArray(t4) || Z.isObject(t4)) {
        var i4 = n3.__li.nextElementSibling;
        return n3.remove(), ll(e32, n3.object, n3.property, { before: i4, factoryArgs: [t4] });
      }
    }, name: function(e33) {
      return n3.__li.firstElementChild.firstElementChild.innerHTML = e33, n3;
    }, listen: function() {
      return n3.__gui.listen(n3), n3;
    }, remove: function() {
      return n3.__gui.remove(n3), n3;
    } }), n3 instanceof Fc) {
      var r3 = new Nc(n3.object, n3.property, { min: n3.__min, max: n3.__max, step: n3.__step });
      Z.each([`updateDisplay`, `onChange`, `onFinishChange`, `step`, `min`, `max`], function(e33) {
        var t4 = n3[e33], i4 = r3[e33];
        n3[e33] = r3[e33] = function() {
          var e34 = Array.prototype.slice.call(arguments);
          return i4.apply(r3, e34), t4.apply(n3, e34);
        };
      }), Q.addClass(t3, `has-slider`), n3.domElement.insertBefore(r3.domElement, n3.domElement.firstElementChild);
    } else if (n3 instanceof Nc) {
      var i3 = function(t4) {
        if (Z.isNumber(n3.__min) && Z.isNumber(n3.__max)) {
          var r4 = n3.__li.firstElementChild.firstElementChild.innerHTML, i4 = n3.__gui.__listening.indexOf(n3) > -1;
          n3.remove();
          var a3 = ll(e32, n3.object, n3.property, { before: n3.__li.nextElementSibling, factoryArgs: [n3.__min, n3.__max, n3.__step] });
          return a3.name(r4), i4 && a3.listen(), a3;
        }
        return t4;
      };
      n3.min = Z.compose(i3, n3.min), n3.max = Z.compose(i3, n3.max);
    } else n3 instanceof Dc ? (Q.bind(t3, `click`, function() {
      Q.fakeEvent(n3.__checkbox, `click`);
    }), Q.bind(n3.__checkbox, `click`, function(e33) {
      e33.stopPropagation();
    })) : n3 instanceof Ic ? (Q.bind(t3, `click`, function() {
      Q.fakeEvent(n3.__button, `click`);
    }), Q.bind(t3, `mouseover`, function() {
      Q.addClass(n3.__button, `hover`);
    }), Q.bind(t3, `mouseout`, function() {
      Q.removeClass(n3.__button, `hover`);
    })) : n3 instanceof Lc && (Q.addClass(t3, `color`), n3.updateDisplay = Z.compose(function(e33) {
      return t3.style.borderLeftColor = n3.__color.toString(), e33;
    }, n3.updateDisplay), n3.updateDisplay());
    n3.setValue = Z.compose(function(t4) {
      return e32.getRoot().__preset_select && n3.isModified() && ol(e32.getRoot(), true), t4;
    }, n3.setValue);
  }
  function cl(e32, t3) {
    var n3 = e32.getRoot(), r3 = n3.__rememberedObjects.indexOf(t3.object);
    if (r3 !== -1) {
      var i3 = n3.__rememberedObjectIndecesToControllers[r3];
      if (i3 === void 0 && (i3 = {}, n3.__rememberedObjectIndecesToControllers[r3] = i3), i3[t3.property] = t3, n3.load && n3.load.remembered) {
        var a3 = n3.load.remembered, o3 = void 0;
        if (a3[e32.preset]) o3 = a3[e32.preset];
        else if (a3[Zc]) o3 = a3[Zc];
        else return;
        if (o3[r3] && o3[r3][t3.property] !== void 0) {
          var s3 = o3[r3][t3.property];
          t3.initialValue = s3, t3.setValue(s3);
        }
      }
    }
  }
  function ll(e32, t3, n3, r3) {
    if (t3[n3] === void 0) throw Error(`Object "` + t3 + `" has no property "` + n3 + `"`);
    var i3 = void 0;
    if (r3.color) i3 = new Lc(t3, n3);
    else {
      var a3 = [t3, n3].concat(r3.factoryArgs);
      i3 = Uc.apply(e32, a3);
    }
    r3.before instanceof Sc && (r3.before = r3.before.__li), cl(e32, i3), Q.addClass(i3.domElement, `c`);
    var o3 = document.createElement(`span`);
    Q.addClass(o3, `property-name`), o3.innerHTML = i3.property;
    var s3 = document.createElement(`div`);
    s3.appendChild(o3), s3.appendChild(i3.domElement);
    var c3 = il(e32, s3, r3.before);
    return Q.addClass(c3, $.CLASS_CONTROLLER_ROW), i3 instanceof Lc ? Q.addClass(c3, `color`) : Q.addClass(c3, pc(i3.getValue())), sl(e32, c3, i3), e32.__controllers.push(i3), i3;
  }
  function ul(e32, t3) {
    return document.location.href + `.` + t3;
  }
  function dl(e32, t3, n3) {
    var r3 = document.createElement(`option`);
    r3.innerHTML = t3, r3.value = t3, e32.__preset_select.appendChild(r3), n3 && (e32.__preset_select.selectedIndex = e32.__preset_select.length - 1);
  }
  function fl(e32, t3) {
    t3.style.display = e32.useLocalStorage ? `block` : `none`;
  }
  function pl(e32) {
    var t3 = e32.__save_row = document.createElement(`li`);
    Q.addClass(e32.domElement, `has-save`), e32.__ul.insertBefore(t3, e32.__ul.firstChild), Q.addClass(t3, `save-row`);
    var n3 = document.createElement(`span`);
    n3.innerHTML = `&nbsp;`, Q.addClass(n3, `button gears`);
    var r3 = document.createElement(`span`);
    r3.innerHTML = `Save`, Q.addClass(r3, `button`), Q.addClass(r3, `save`);
    var i3 = document.createElement(`span`);
    i3.innerHTML = `New`, Q.addClass(i3, `button`), Q.addClass(i3, `save-as`);
    var a3 = document.createElement(`span`);
    a3.innerHTML = `Revert`, Q.addClass(a3, `button`), Q.addClass(a3, `revert`);
    var o3 = e32.__preset_select = document.createElement(`select`);
    if (e32.load && e32.load.remembered ? Z.each(e32.load.remembered, function(t4, n4) {
      dl(e32, n4, n4 === e32.preset);
    }) : dl(e32, Zc, false), Q.bind(o3, `change`, function() {
      for (var t4 = 0; t4 < e32.__preset_select.length; t4++) e32.__preset_select[t4].innerHTML = e32.__preset_select[t4].value;
      e32.preset = this.value;
    }), t3.appendChild(o3), t3.appendChild(n3), t3.appendChild(r3), t3.appendChild(i3), t3.appendChild(a3), Qc) {
      var s3 = document.getElementById(`dg-local-explain`), c3 = document.getElementById(`dg-local-storage`), l3 = document.getElementById(`dg-save-locally`);
      l3.style.display = `block`, localStorage.getItem(ul(e32, `isLocal`)) === `true` && c3.setAttribute(`checked`, `checked`), fl(e32, s3), Q.bind(c3, `change`, function() {
        e32.useLocalStorage = !e32.useLocalStorage, fl(e32, s3);
      });
    }
    var u3 = document.getElementById(`dg-new-constructor`);
    Q.bind(u3, `keydown`, function(e33) {
      e33.metaKey && (e33.which === 67 || e33.keyCode === 67) && $c.hide();
    }), Q.bind(n3, `click`, function() {
      u3.innerHTML = JSON.stringify(e32.getSaveObject(), void 0, 2), $c.show(), u3.focus(), u3.select();
    }), Q.bind(r3, `click`, function() {
      e32.save();
    }), Q.bind(i3, `click`, function() {
      var t4 = prompt(`Enter a new preset name.`);
      t4 && e32.saveAs(t4);
    }), Q.bind(a3, `click`, function() {
      e32.revert();
    });
  }
  function ml(e32) {
    var t3 = void 0;
    e32.__resize_handle = document.createElement(`div`), Z.extend(e32.__resize_handle.style, { width: `6px`, marginLeft: `-3px`, height: `200px`, cursor: `ew-resize`, position: `absolute` });
    function n3(n4) {
      return n4.preventDefault(), e32.width += t3 - n4.clientX, e32.onResize(), t3 = n4.clientX, false;
    }
    function r3() {
      Q.removeClass(e32.__closeButton, $.CLASS_DRAG), Q.unbind(window, `mousemove`, n3), Q.unbind(window, `mouseup`, r3);
    }
    function i3(i4) {
      return i4.preventDefault(), t3 = i4.clientX, Q.addClass(e32.__closeButton, $.CLASS_DRAG), Q.bind(window, `mousemove`, n3), Q.bind(window, `mouseup`, r3), false;
    }
    Q.bind(e32.__resize_handle, `mousedown`, i3), Q.bind(e32.__closeButton, `mousedown`, i3), e32.domElement.insertBefore(e32.__resize_handle, e32.domElement.firstElementChild);
  }
  function hl(e32, t3) {
    e32.domElement.style.width = t3 + `px`, e32.__save_row && e32.autoPlace && (e32.__save_row.style.width = t3 + `px`), e32.__closeButton && (e32.__closeButton.style.width = t3 + `px`);
  }
  function gl(e32, t3) {
    var n3 = {};
    return Z.each(e32.__rememberedObjects, function(r3, i3) {
      var a3 = {}, o3 = e32.__rememberedObjectIndecesToControllers[i3];
      Z.each(o3, function(e33, n4) {
        a3[n4] = t3 ? e33.initialValue : e33.getValue();
      }), n3[i3] = a3;
    }), n3;
  }
  function _l(e32) {
    for (var t3 = 0; t3 < e32.__preset_select.length; t3++) e32.__preset_select[t3].value === e32.preset && (e32.__preset_select.selectedIndex = t3);
  }
  function vl(e32) {
    e32.length !== 0 && Gc.call(window, function() {
      vl(e32);
    }), Z.each(e32, function(e33) {
      e33.updateDisplay();
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
  var xl = o(((e32, t3) => {
    function n3(e33) {
      var t4 = e33.length, n4 = 1, r4 = Array(t4), i3;
      for (i3 = t4; i3 > 0; i3--) r4[i3 - 1] = n4, n4 *= e33[i3 - 1];
      return { stride: r4, data: new Uint32Array(n4) };
    }
    function r3(e33) {
      var t4 = e33.length, n4 = 1, r4 = Array(t4), i3 = [], a3, o3;
      for (a3 = t4; a3 > 0; a3--) r4[a3 - 1] = n4, n4 *= e33[a3 - 1];
      for (o3 = 0; o3 < n4; o3++) i3.push([]);
      return { stride: r4, data: i3 };
    }
    t3.exports = { integer: n3, array: r3 };
  }));
  var Sl = o(((e32, t3) => {
    t3.exports = n3;
    function n3(e33, t4) {
      var n4 = Array(e33), r3 = Math.floor(e33 / 2) << 1, i3 = 0, a3, o3, s3, c3, l3;
      for (l3 = 0; l3 < r3; l3 += 2) a3 = -2 * Math.log(t4()), o3 = Math.sqrt(a3), s3 = 2 * Math.PI * t4(), i3 += a3, n4[l3] = o3 * Math.cos(s3), n4[l3 + 1] = o3 * Math.sin(s3);
      if (e33 % 2) {
        var u3 = Math.sqrt(-2 * Math.log(t4())) * Math.cos(2 * Math.PI * t4());
        n4[e33 - 1] = u3, i3 += u3 ** 2;
      }
      for (c3 = 1 / Math.sqrt(i3), l3 = 0; l3 < e33; ++l3) n4[l3] *= c3;
      return n4;
    }
  }));
  var Cl = o(((e32, t3) => {
    t3.exports = function(e33, t4) {
      e33 || (e33 = 1), t4 || (t4 = 2);
      for (var n3 = e33 * 2 + 1, r3 = n3 ** +t4 - 1, i3 = Array(r3), a3 = 0; a3 < r3; a3++) for (var o3 = i3[a3] = Array(t4), s3 = a3 < r3 / 2 ? a3 : a3 + 1, c3 = 1; c3 <= t4; c3++) {
        var l3 = s3 % n3 ** +c3;
        o3[c3 - 1] = l3 / n3 ** (c3 - 1) - e33, s3 -= l3;
      }
      return i3;
    };
  }));
  var wl = o(((e32, t3) => {
    var n3 = Cl();
    function r3(e33) {
      var t4 = n3(2, e33), r4 = [], i4;
      for (t4 = t4.filter(function(t5) {
        for (var n4 = 0, r5 = 0; r5 < e33; r5++) n4 += Math.max(0, Math.abs(t5[r5]) - 1) ** 2;
        return n4 < e33;
      }), i4 = 0; i4 < e33; i4++) r4.push(0);
      return t4.push(r4), t4.sort(function(t5, n4) {
        var r5 = 0, i5 = 0, a4;
        for (a4 = 0; a4 < e33; a4++) r5 += t5[a4] ** 2, i5 += n4[a4] ** 2;
        return r5 < i5 ? -1 : +(r5 > i5);
      }), t4;
    }
    var i3 = {};
    function a3(e33) {
      return i3[e33] || (i3[e33] = r3(e33)), i3[e33];
    }
    t3.exports = a3;
  }));
  var Tl = o(((e32, t3) => {
    var n3 = xl().integer, r3 = Sl(), i3 = wl();
    function a3(e33, t4) {
      for (var n4 = 0, r4 = 0; r4 < e33.length; r4++) n4 += (e33[r4] - t4[r4]) ** 2;
      return n4;
    }
    function o3(e33, t4) {
      if (typeof e33.distanceFunction == `function`) throw Error(`PoissonDiskSampling: Tried to instantiate the fixed density implementation with a distanceFunction`);
      this.shape = e33.shape, this.minDistance = e33.minDistance, this.maxDistance = e33.maxDistance || e33.minDistance * 2, this.maxTries = Math.ceil(Math.max(1, e33.tries || 30)), this.rng = t4 || Math.random;
      for (var r4 = 0, a4 = 0; a4 < this.shape.length; a4++) r4 = Math.max(r4, this.shape[a4]);
      var o4 = 1e-14 * Math.max(1, r4 / 128 | 0);
      this.dimension = this.shape.length, this.squaredMinDistance = this.minDistance * this.minDistance, this.minDistancePlusEpsilon = this.minDistance + o4, this.deltaDistance = Math.max(0, this.maxDistance - this.minDistancePlusEpsilon), this.cellSize = this.minDistance / Math.sqrt(this.dimension), this.neighbourhood = i3(this.dimension), this.currentPoint = null, this.processList = [], this.samplePoints = [], this.gridShape = [];
      for (var a4 = 0; a4 < this.dimension; a4++) this.gridShape.push(Math.ceil(this.shape[a4] / this.cellSize));
      this.grid = n3(this.gridShape);
    }
    o3.prototype.shape = null, o3.prototype.dimension = null, o3.prototype.minDistance = null, o3.prototype.maxDistance = null, o3.prototype.minDistancePlusEpsilon = null, o3.prototype.squaredMinDistance = null, o3.prototype.deltaDistance = null, o3.prototype.cellSize = null, o3.prototype.maxTries = null, o3.prototype.rng = null, o3.prototype.neighbourhood = null, o3.prototype.currentPoint = null, o3.prototype.processList = null, o3.prototype.samplePoints = null, o3.prototype.gridShape = null, o3.prototype.grid = null, o3.prototype.addRandomPoint = function() {
      for (var e33 = Array(this.dimension), t4 = 0; t4 < this.dimension; t4++) e33[t4] = this.rng() * this.shape[t4];
      return this.directAddPoint(e33);
    }, o3.prototype.addPoint = function(e33) {
      var t4, n4 = true;
      if (e33.length === this.dimension) for (t4 = 0; t4 < this.dimension && n4; t4++) n4 = e33[t4] >= 0 && e33[t4] < this.shape[t4];
      else n4 = false;
      return n4 ? this.directAddPoint(e33) : null;
    }, o3.prototype.directAddPoint = function(e33) {
      var t4 = 0, n4 = this.grid.stride, r4;
      for (this.processList.push(e33), this.samplePoints.push(e33), r4 = 0; r4 < this.dimension; r4++) t4 += (e33[r4] / this.cellSize | 0) * n4[r4];
      return this.grid.data[t4] = this.samplePoints.length, e33;
    }, o3.prototype.inNeighbourhood = function(e33) {
      var t4 = this.dimension, n4 = this.grid.stride, r4, i4, o4, s3, c3;
      for (r4 = 0; r4 < this.neighbourhood.length; r4++) {
        for (i4 = 0, o4 = 0; o4 < t4; o4++) {
          if (s3 = (e33[o4] / this.cellSize | 0) + this.neighbourhood[r4][o4], s3 < 0 || s3 >= this.gridShape[o4]) {
            i4 = -1;
            break;
          }
          i4 += s3 * n4[o4];
        }
        if (i4 !== -1 && this.grid.data[i4] !== 0 && (c3 = this.samplePoints[this.grid.data[i4] - 1], a3(e33, c3) < this.squaredMinDistance)) return true;
      }
      return false;
    }, o3.prototype.next = function() {
      for (var e33, t4, n4, i4, a4, o4, s3; this.processList.length > 0; ) {
        for (this.currentPoint === null && (this.currentPoint = this.processList.shift()), i4 = this.currentPoint, e33 = 0; e33 < this.maxTries; e33++) {
          for (o4 = true, n4 = this.minDistancePlusEpsilon + this.deltaDistance * this.rng(), this.dimension === 2 ? (t4 = this.rng() * Math.PI * 2, a4 = [Math.cos(t4), Math.sin(t4)]) : a4 = r3(this.dimension, this.rng), s3 = 0; o4 && s3 < this.dimension; s3++) a4[s3] = i4[s3] + a4[s3] * n4, o4 = a4[s3] >= 0 && a4[s3] < this.shape[s3];
          if (o4 && !this.inNeighbourhood(a4)) return this.directAddPoint(a4);
        }
        e33 === this.maxTries && (this.currentPoint = null);
      }
      return null;
    }, o3.prototype.fill = function() {
      for (this.samplePoints.length === 0 && this.addRandomPoint(); this.next(); ) ;
      return this.samplePoints;
    }, o3.prototype.getAllPoints = function() {
      return this.samplePoints;
    }, o3.prototype.getAllPointsWithDistance = function() {
      throw Error(`PoissonDiskSampling: getAllPointsWithDistance() is not available in fixed-density implementation`);
    }, o3.prototype.reset = function() {
      var e33 = this.grid.data, t4 = 0;
      for (t4 = 0; t4 < e33.length; t4++) e33[t4] = 0;
      this.samplePoints = [], this.currentPoint = null, this.processList.length = 0;
    }, t3.exports = o3;
  }));
  var El = o(((e32, t3) => {
    var n3 = xl().array, r3 = Sl(), i3 = wl();
    function a3(e33, t4) {
      for (var n4 = 0, r4 = 0; r4 < e33.length; r4++) n4 += (e33[r4] - t4[r4]) ** 2;
      return Math.sqrt(n4);
    }
    function o3(e33, t4) {
      if (typeof e33.distanceFunction != `function`) throw Error(`PoissonDiskSampling: Tried to instantiate the variable density implementation without a distanceFunction`);
      this.shape = e33.shape, this.minDistance = e33.minDistance, this.maxDistance = e33.maxDistance || e33.minDistance * 2, this.maxTries = Math.ceil(Math.max(1, e33.tries || 30)), this.distanceFunction = e33.distanceFunction, this.bias = Math.max(0, Math.min(1, e33.bias || 0)), this.rng = t4 || Math.random;
      for (var r4 = 0, a4 = 0; a4 < this.shape.length; a4++) r4 = Math.max(r4, this.shape[a4]);
      var o4 = 1e-14 * Math.max(1, r4 / 128 | 0);
      this.dimension = this.shape.length, this.minDistancePlusEpsilon = this.minDistance + o4, this.deltaDistance = Math.max(0, this.maxDistance - this.minDistancePlusEpsilon), this.cellSize = this.maxDistance / Math.sqrt(this.dimension), this.neighbourhood = i3(this.dimension), this.currentPoint = null, this.currentDistance = 0, this.processList = [], this.samplePoints = [], this.sampleDistance = [], this.gridShape = [];
      for (var a4 = 0; a4 < this.dimension; a4++) this.gridShape.push(Math.ceil(this.shape[a4] / this.cellSize));
      this.grid = n3(this.gridShape);
    }
    o3.prototype.shape = null, o3.prototype.dimension = null, o3.prototype.minDistance = null, o3.prototype.maxDistance = null, o3.prototype.minDistancePlusEpsilon = null, o3.prototype.deltaDistance = null, o3.prototype.cellSize = null, o3.prototype.maxTries = null, o3.prototype.distanceFunction = null, o3.prototype.bias = null, o3.prototype.rng = null, o3.prototype.neighbourhood = null, o3.prototype.currentPoint = null, o3.prototype.currentDistance = null, o3.prototype.processList = null, o3.prototype.samplePoints = null, o3.prototype.sampleDistance = null, o3.prototype.gridShape = null, o3.prototype.grid = null, o3.prototype.addRandomPoint = function() {
      for (var e33 = Array(this.dimension), t4 = 0; t4 < this.dimension; t4++) e33[t4] = this.rng() * this.shape[t4];
      return this.directAddPoint(e33);
    }, o3.prototype.addPoint = function(e33) {
      var t4, n4 = true;
      if (e33.length === this.dimension) for (t4 = 0; t4 < this.dimension && n4; t4++) n4 = e33[t4] >= 0 && e33[t4] < this.shape[t4];
      else n4 = false;
      return n4 ? this.directAddPoint(e33) : null;
    }, o3.prototype.directAddPoint = function(e33) {
      var t4 = 0, n4 = this.grid.stride, r4 = this.samplePoints.length, i4;
      for (this.processList.push(r4), this.samplePoints.push(e33), this.sampleDistance.push(this.distanceFunction(e33)), i4 = 0; i4 < this.dimension; i4++) t4 += (e33[i4] / this.cellSize | 0) * n4[i4];
      return this.grid.data[t4].push(r4), e33;
    }, o3.prototype.inNeighbourhood = function(e33) {
      var t4 = this.dimension, n4 = this.grid.stride, r4, i4, o4, s3, c3, l3, u3 = this.distanceFunction(e33);
      for (r4 = 0; r4 < this.neighbourhood.length; r4++) {
        for (i4 = 0, o4 = 0; o4 < t4; o4++) {
          if (s3 = (e33[o4] / this.cellSize | 0) + this.neighbourhood[r4][o4], s3 < 0 || s3 >= this.gridShape[o4]) {
            i4 = -1;
            break;
          }
          i4 += s3 * n4[o4];
        }
        if (i4 !== -1 && this.grid.data[i4].length > 0) for (var d3 = 0; d3 < this.grid.data[i4].length; d3++) {
          c3 = this.samplePoints[this.grid.data[i4][d3]], l3 = this.sampleDistance[this.grid.data[i4][d3]];
          var f3 = Math.min(l3, u3), p3 = f3 + (Math.max(l3, u3) - f3) * this.bias;
          if (a3(e33, c3) < this.minDistance + this.deltaDistance * p3) return true;
        }
      }
      return false;
    }, o3.prototype.next = function() {
      for (var e33, t4, n4, i4, a4, o4, s3, c3; this.processList.length > 0; ) {
        if (this.currentPoint === null) {
          var l3 = this.processList.shift();
          this.currentPoint = this.samplePoints[l3], this.currentDistance = this.sampleDistance[l3];
        }
        for (i4 = this.currentPoint, a4 = this.currentDistance, e33 = 0; e33 < this.maxTries; e33++) {
          for (s3 = true, n4 = this.minDistancePlusEpsilon + this.deltaDistance * (a4 + (1 - a4) * this.bias), this.dimension === 2 ? (t4 = this.rng() * Math.PI * 2, o4 = [Math.cos(t4), Math.sin(t4)]) : o4 = r3(this.dimension, this.rng), c3 = 0; s3 && c3 < this.dimension; c3++) o4[c3] = i4[c3] + o4[c3] * n4, s3 = o4[c3] >= 0 && o4[c3] < this.shape[c3];
          if (s3 && !this.inNeighbourhood(o4)) return this.directAddPoint(o4);
        }
        e33 === this.maxTries && (this.currentPoint = null);
      }
      return null;
    }, o3.prototype.fill = function() {
      for (this.samplePoints.length === 0 && this.addRandomPoint(); this.next(); ) ;
      return this.samplePoints;
    }, o3.prototype.getAllPoints = function() {
      return this.samplePoints;
    }, o3.prototype.getAllPointsWithDistance = function() {
      var e33 = Array(this.samplePoints.length), t4 = 0, n4 = 0, r4;
      for (t4 = 0; t4 < this.samplePoints.length; t4++) {
        for (r4 = Array(this.dimension + 1), n4 = 0; n4 < this.dimension; n4++) r4[n4] = this.samplePoints[t4][n4];
        r4[this.dimension] = this.sampleDistance[t4], e33[t4] = r4;
      }
      return e33;
    }, o3.prototype.reset = function() {
      var e33 = this.grid.data, t4 = 0;
      for (t4 = 0; t4 < e33.length; t4++) e33[t4] = [];
      this.samplePoints = [], this.currentPoint = null, this.processList.length = 0;
    }, t3.exports = o3;
  }));
  var Dl = o(((e32, t3) => {
    var n3 = Tl(), r3 = El();
    function i3(e33, t4) {
      this.shape = e33.shape, typeof e33.distanceFunction == `function` ? this.implementation = new r3(e33, t4) : this.implementation = new n3(e33, t4);
    }
    i3.prototype.implementation = null, i3.prototype.addRandomPoint = function() {
      return this.implementation.addRandomPoint();
    }, i3.prototype.addPoint = function(e33) {
      return this.implementation.addPoint(e33);
    }, i3.prototype.next = function() {
      return this.implementation.next();
    }, i3.prototype.fill = function() {
      return this.implementation.fill();
    }, i3.prototype.getAllPoints = function() {
      return this.implementation.getAllPoints();
    }, i3.prototype.getAllPointsWithDistance = function() {
      return this.implementation.getAllPointsWithDistance();
    }, i3.prototype.reset = function() {
      this.implementation.reset();
    }, t3.exports = i3;
  }));
  var Ol = class {
    constructor() {
      this.MAX_VERTICES = 256, this.MAX_VERTICES_MASK = this.MAX_VERTICES - 1, this.amplitude = 1, this.scale = 1, this.r = [];
      for (var e32 = 0; e32 < this.MAX_VERTICES; ++e32) this.r.push(Math.random());
    }
    getVal(e32) {
      var t3 = e32 * this.scale, n3 = Math.floor(t3), r3 = t3 - n3, i3 = r3 * r3 * (3 - 2 * r3), a3 = n3 % this.MAX_VERTICES_MASK, o3 = (a3 + 1) % this.MAX_VERTICES_MASK;
      return this.lerp(this.r[a3], this.r[o3], i3) * this.amplitude;
    }
    lerp(e32, t3, n3) {
      return e32 * (1 - n3) + t3 * n3;
    }
  };
  var kl = new class {
    constructor() {
      this.cursor = new U(), this.initEvents(), window.__debugMouse = this, this.screenWidth = window.innerWidth, this.screenHeight = window.innerHeight, this.update();
    }
    initEvents() {
      window.addEventListener(`mousemove`, (e32) => {
        this.onMouve(e32);
      }), window.addEventListener(`resize`, () => {
        this.screenWidth = window.innerWidth, this.screenHeight = window.innerHeight;
      });
    }
    onMouve(e32) {
      this.cursor.x = e32.clientX, this.cursor.y = e32.clientY;
    }
    update() {
      requestAnimationFrame(() => {
        this.update();
      });
    }
  }();

  // public/shopify/plantilla99/assets/js/gsap.Bi_c5vh2.js
  function e17(e32) {
    if (e32 === void 0) throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    return e32;
  }
  function t2(e32, t3) {
    e32.prototype = Object.create(t3.prototype), e32.prototype.constructor = e32, e32.__proto__ = t3;
  }
  var n2 = { autoSleep: 120, force3D: `auto`, nullTargetWarn: 1, units: { lineHeight: `` } };
  var r2 = { duration: 0.5, overwrite: false, delay: 0 };
  var i2;
  var a2;
  var o2;
  var s2 = 1e8;
  var c2 = 1 / s2;
  var l2 = Math.PI * 2;
  var u2 = l2 / 4;
  var d2 = 0;
  var f2 = Math.sqrt;
  var p2 = Math.cos;
  var m2 = Math.sin;
  var h2 = function(e32) {
    return typeof e32 == `string`;
  };
  var g2 = function(e32) {
    return typeof e32 == `function`;
  };
  var _2 = function(e32) {
    return typeof e32 == `number`;
  };
  var v2 = function(e32) {
    return e32 === void 0;
  };
  var y2 = function(e32) {
    return typeof e32 == `object`;
  };
  var b2 = function(e32) {
    return e32 !== false;
  };
  var x2 = function() {
    return typeof window < `u`;
  };
  var S2 = function(e32) {
    return g2(e32) || h2(e32);
  };
  var C2 = typeof ArrayBuffer == `function` && ArrayBuffer.isView || function() {
  };
  var w2 = Array.isArray;
  var T2 = /random\([^)]+\)/g;
  var E2 = /,\s*/g;
  var D2 = /(?:-?\.?\d|\.)+/gi;
  var O2 = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
  var k2 = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
  var A2 = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
  var j2 = /[+-]=-?[.\d]+/;
  var M2 = /[^,'"\[\]\s]+/gi;
  var N2 = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
  var P2;
  var F2;
  var I2;
  var L2;
  var R2 = {};
  var z2 = {};
  var B2;
  var ee2 = function(e32) {
    return (z2 = Oe2(e32, R2)) && Z2;
  };
  var te2 = function(e32, t3) {
    return console.warn(`Invalid property`, e32, `set to`, t3, `Missing plugin? gsap.registerPlugin()`);
  };
  var ne2 = function(e32, t3) {
    return !t3 && console.warn(e32);
  };
  var re2 = function(e32, t3) {
    return e32 && (R2[e32] = t3) && z2 && (z2[e32] = t3) || R2;
  };
  var ie2 = function() {
    return 0;
  };
  var ae2 = { suppressEvents: true, isStart: true, kill: false };
  var oe2 = { suppressEvents: true, kill: false };
  var se2 = { suppressEvents: true };
  var ce2 = {};
  var le2 = [];
  var ue2 = {};
  var de2;
  var V2 = {};
  var fe2 = {};
  var pe2 = 30;
  var me2 = [];
  var he2 = ``;
  var ge2 = function(e32) {
    var t3 = e32[0], n3, r3;
    if (y2(t3) || g2(t3) || (e32 = [e32]), !(n3 = (t3._gsap || {}).harness)) {
      for (r3 = me2.length; r3-- && !me2[r3].targetTest(t3); ) ;
      n3 = me2[r3];
    }
    for (r3 = e32.length; r3--; ) e32[r3] && (e32[r3]._gsap || (e32[r3]._gsap = new en2(e32[r3], n3))) || e32.splice(r3, 1);
    return e32;
  };
  var _e2 = function(e32) {
    return e32._gsap || ge2(ut2(e32))[0]._gsap;
  };
  var ve2 = function(e32, t3, n3) {
    return (n3 = e32[t3]) && g2(n3) ? e32[t3]() : v2(n3) && e32.getAttribute && e32.getAttribute(t3) || n3;
  };
  var H2 = function(e32, t3) {
    return (e32 = e32.split(`,`)).forEach(t3) || e32;
  };
  var U2 = function(e32) {
    return Math.round(e32 * 1e5) / 1e5 || 0;
  };
  var W2 = function(e32) {
    return Math.round(e32 * 1e7) / 1e7 || 0;
  };
  var ye2 = function(e32, t3) {
    var n3 = t3.charAt(0), r3 = parseFloat(t3.substr(2));
    return e32 = parseFloat(e32), n3 === `+` ? e32 + r3 : n3 === `-` ? e32 - r3 : n3 === `*` ? e32 * r3 : e32 / r3;
  };
  var be2 = function(e32, t3) {
    for (var n3 = t3.length, r3 = 0; e32.indexOf(t3[r3]) < 0 && ++r3 < n3; ) ;
    return r3 < n3;
  };
  var xe2 = function() {
    var e32 = le2.length, t3 = le2.slice(0), n3, r3;
    for (ue2 = {}, le2.length = 0, n3 = 0; n3 < e32; n3++) r3 = t3[n3], r3 && r3._lazy && (r3.render(r3._lazy[0], r3._lazy[1], true)._lazy = 0);
  };
  var Se2 = function(e32) {
    return !!(e32._initted || e32._startAt || e32.add);
  };
  var Ce2 = function(e32, t3, n3, r3) {
    le2.length && !a2 && xe2(), e32.render(t3, n3, r3 || !!(a2 && t3 < 0 && Se2(e32))), le2.length && !a2 && xe2();
  };
  var we2 = function(e32) {
    var t3 = parseFloat(e32);
    return (t3 || t3 === 0) && (e32 + ``).match(M2).length < 2 ? t3 : h2(e32) ? e32.trim() : e32;
  };
  var Te2 = function(e32) {
    return e32;
  };
  var Ee2 = function(e32, t3) {
    for (var n3 in t3) n3 in e32 || (e32[n3] = t3[n3]);
    return e32;
  };
  var De2 = function(e32) {
    return function(t3, n3) {
      for (var r3 in n3) r3 in t3 || r3 === `duration` && e32 || r3 === `ease` || (t3[r3] = n3[r3]);
    };
  };
  var Oe2 = function(e32, t3) {
    for (var n3 in t3) e32[n3] = t3[n3];
    return e32;
  };
  var ke2 = function e18(t3, n3) {
    for (var r3 in n3) r3 !== `__proto__` && r3 !== `constructor` && r3 !== `prototype` && (t3[r3] = y2(n3[r3]) ? e18(t3[r3] || (t3[r3] = {}), n3[r3]) : n3[r3]);
    return t3;
  };
  var Ae2 = function(e32, t3) {
    var n3 = {}, r3;
    for (r3 in e32) r3 in t3 || (n3[r3] = e32[r3]);
    return n3;
  };
  var je2 = function(e32) {
    var t3 = e32.parent || P2, n3 = e32.keyframes ? De2(w2(e32.keyframes)) : Ee2;
    if (b2(e32.inherit)) for (; t3; ) n3(e32, t3.vars.defaults), t3 = t3.parent || t3._dp;
    return e32;
  };
  var Me2 = function(e32, t3) {
    for (var n3 = e32.length, r3 = n3 === t3.length; r3 && n3-- && e32[n3] === t3[n3]; ) ;
    return n3 < 0;
  };
  var Ne2 = function(e32, t3, n3, r3, i3) {
    n3 === void 0 && (n3 = `_first`), r3 === void 0 && (r3 = `_last`);
    var a3 = e32[r3], o3;
    if (i3) for (o3 = t3[i3]; a3 && a3[i3] > o3; ) a3 = a3._prev;
    return a3 ? (t3._next = a3._next, a3._next = t3) : (t3._next = e32[n3], e32[n3] = t3), t3._next ? t3._next._prev = t3 : e32[r3] = t3, t3._prev = a3, t3.parent = t3._dp = e32, t3;
  };
  var Pe2 = function(e32, t3, n3, r3) {
    n3 === void 0 && (n3 = `_first`), r3 === void 0 && (r3 = `_last`);
    var i3 = t3._prev, a3 = t3._next;
    i3 ? i3._next = a3 : e32[n3] === t3 && (e32[n3] = a3), a3 ? a3._prev = i3 : e32[r3] === t3 && (e32[r3] = i3), t3._next = t3._prev = t3.parent = null;
  };
  var Fe2 = function(e32, t3) {
    e32.parent && (!t3 || e32.parent.autoRemoveChildren) && e32.parent.remove && e32.parent.remove(e32), e32._act = 0;
  };
  var Ie2 = function(e32, t3) {
    if (e32 && (!t3 || t3._end > e32._dur || t3._start < 0)) for (var n3 = e32; n3; ) n3._dirty = 1, n3 = n3.parent;
    return e32;
  };
  var Le2 = function(e32) {
    for (var t3 = e32.parent; t3 && t3.parent; ) t3._dirty = 1, t3.totalDuration(), t3 = t3.parent;
    return e32;
  };
  var Re2 = function(e32, t3, n3, r3) {
    return e32._startAt && (a2 ? e32._startAt.revert(oe2) : e32.vars.immediateRender && !e32.vars.autoRevert || e32._startAt.render(t3, true, r3));
  };
  var ze2 = function e19(t3) {
    return !t3 || t3._ts && e19(t3.parent);
  };
  var Be2 = function(e32) {
    return e32._repeat ? Ve2(e32._tTime, e32 = e32.duration() + e32._rDelay) * e32 : 0;
  };
  var Ve2 = function(e32, t3) {
    var n3 = Math.floor(e32 = W2(e32 / t3));
    return e32 && n3 === e32 ? n3 - 1 : n3;
  };
  var He2 = function(e32, t3) {
    return (e32 - t3._start) * t3._ts + (t3._ts >= 0 ? 0 : t3._dirty ? t3.totalDuration() : t3._tDur);
  };
  var Ue2 = function(e32) {
    return e32._end = W2(e32._start + (e32._tDur / Math.abs(e32._ts || e32._rts || c2) || 0));
  };
  var We2 = function(e32, t3) {
    var n3 = e32._dp;
    return n3 && n3.smoothChildTiming && e32._ts && (e32._start = W2(n3._time - (e32._ts > 0 ? t3 / e32._ts : ((e32._dirty ? e32.totalDuration() : e32._tDur) - t3) / -e32._ts)), Ue2(e32), n3._dirty || Ie2(n3, e32)), e32;
  };
  var Ge2 = function(e32, t3) {
    var n3;
    if ((t3._time || !t3._dur && t3._initted || t3._start < e32._time && (t3._dur || !t3.add)) && (n3 = He2(e32.rawTime(), t3), (!t3._dur || at2(0, t3.totalDuration(), n3) - t3._tTime > c2) && t3.render(n3, true)), Ie2(e32, t3)._dp && e32._initted && e32._time >= e32._dur && e32._ts) {
      if (e32._dur < e32.duration()) for (n3 = e32; n3._dp; ) n3.rawTime() >= 0 && n3.totalTime(n3._tTime), n3 = n3._dp;
      e32._zTime = -c2;
    }
  };
  var Ke2 = function(e32, t3, n3, r3) {
    return t3.parent && Fe2(t3), t3._start = W2((_2(n3) ? n3 : n3 || e32 !== P2 ? nt2(e32, n3, t3) : e32._time) + t3._delay), t3._end = W2(t3._start + (t3.totalDuration() / Math.abs(t3.timeScale()) || 0)), Ne2(e32, t3, `_first`, `_last`, e32._sort ? `_start` : 0), Xe2(t3) || (e32._recent = t3), r3 || Ge2(e32, t3), e32._ts < 0 && We2(e32, e32._tTime), e32;
  };
  var qe2 = function(e32, t3) {
    return (R2.ScrollTrigger || te2(`scrollTrigger`, t3)) && R2.ScrollTrigger.create(t3, e32);
  };
  var Je2 = function(e32, t3, n3, r3, i3) {
    if (ln2(e32, t3, i3), !e32._initted) return 1;
    if (!n3 && e32._pt && !a2 && (e32._dur && e32.vars.lazy !== false || !e32._dur && e32.vars.lazy) && de2 !== Vt2.frame) return le2.push(e32), e32._lazy = [i3, r3], 1;
  };
  var Ye2 = function e20(t3) {
    var n3 = t3.parent;
    return n3 && n3._ts && n3._initted && !n3._lock && (n3.rawTime() < 0 || e20(n3));
  };
  var Xe2 = function(e32) {
    var t3 = e32.data;
    return t3 === `isFromStart` || t3 === `isStart`;
  };
  var Ze2 = function(e32, t3, n3, r3) {
    var i3 = e32.ratio, o3 = t3 < 0 || !t3 && (!e32._start && Ye2(e32) && !(!e32._initted && Xe2(e32)) || (e32._ts < 0 || e32._dp._ts < 0) && !Xe2(e32)) ? 0 : 1, s3 = e32._rDelay, l3 = 0, u3, d3, f3;
    if (s3 && e32._repeat && (l3 = at2(0, e32._tDur, t3), d3 = Ve2(l3, s3), e32._yoyo && d3 & 1 && (o3 = 1 - o3), d3 !== Ve2(e32._tTime, s3) && (i3 = 1 - o3, e32.vars.repeatRefresh && e32._initted && e32.invalidate())), o3 !== i3 || a2 || r3 || e32._zTime === c2 || !t3 && e32._zTime) {
      if (!e32._initted && Je2(e32, t3, r3, n3, l3)) return;
      for (f3 = e32._zTime, e32._zTime = t3 || (n3 ? c2 : 0), n3 || (n3 = t3 && !f3), e32.ratio = o3, e32._from && (o3 = 1 - o3), e32._time = 0, e32._tTime = l3, u3 = e32._pt; u3; ) u3.r(o3, u3.d), u3 = u3._next;
      t3 < 0 && Re2(e32, t3, n3, true), e32._onUpdate && !n3 && Dt2(e32, `onUpdate`), l3 && e32._repeat && !n3 && e32.parent && Dt2(e32, `onRepeat`), (t3 >= e32._tDur || t3 < 0) && e32.ratio === o3 && (o3 && Fe2(e32, 1), !n3 && !a2 && (Dt2(e32, o3 ? `onComplete` : `onReverseComplete`, true), e32._prom && e32._prom()));
    } else e32._zTime || (e32._zTime = t3);
  };
  var Qe2 = function(e32, t3, n3) {
    var r3;
    if (n3 > t3) for (r3 = e32._first; r3 && r3._start <= n3; ) {
      if (r3.data === `isPause` && r3._start > t3) return r3;
      r3 = r3._next;
    }
    else for (r3 = e32._last; r3 && r3._start >= n3; ) {
      if (r3.data === `isPause` && r3._start < t3) return r3;
      r3 = r3._prev;
    }
  };
  var $e2 = function(e32, t3, n3, r3) {
    var i3 = e32._repeat, a3 = W2(t3) || 0, o3 = e32._tTime / e32._tDur;
    return o3 && !r3 && (e32._time *= a3 / e32._dur), e32._dur = a3, e32._tDur = i3 ? i3 < 0 ? 1e10 : W2(a3 * (i3 + 1) + e32._rDelay * i3) : a3, o3 > 0 && !r3 && We2(e32, e32._tTime = e32._tDur * o3), e32.parent && Ue2(e32), n3 || Ie2(e32.parent, e32), e32;
  };
  var et2 = function(e32) {
    return e32 instanceof J2 ? Ie2(e32) : $e2(e32, e32._dur);
  };
  var tt2 = { _start: 0, endTime: ie2, totalDuration: ie2 };
  var nt2 = function e21(t3, n3, r3) {
    var i3 = t3.labels, a3 = t3._recent || tt2, o3 = t3.duration() >= s2 ? a3.endTime(false) : t3._dur, c3, l3, u3;
    return h2(n3) && (isNaN(n3) || n3 in i3) ? (l3 = n3.charAt(0), u3 = n3.substr(-1) === `%`, c3 = n3.indexOf(`=`), l3 === `<` || l3 === `>` ? (c3 >= 0 && (n3 = n3.replace(/=/, ``)), (l3 === `<` ? a3._start : a3.endTime(a3._repeat >= 0)) + (parseFloat(n3.substr(1)) || 0) * (u3 ? (c3 < 0 ? a3 : r3).totalDuration() / 100 : 1)) : c3 < 0 ? (n3 in i3 || (i3[n3] = o3), i3[n3]) : (l3 = parseFloat(n3.charAt(c3 - 1) + n3.substr(c3 + 1)), u3 && r3 && (l3 = l3 / 100 * (w2(r3) ? r3[0] : r3).totalDuration()), c3 > 1 ? e21(t3, n3.substr(0, c3 - 1), r3) + l3 : o3 + l3)) : n3 == null ? o3 : +n3;
  };
  var rt2 = function(e32, t3, n3) {
    var r3 = _2(t3[1]), i3 = (r3 ? 2 : 1) + (e32 < 2 ? 0 : 1), a3 = t3[i3], o3, s3;
    if (r3 && (a3.duration = t3[1]), a3.parent = n3, e32) {
      for (o3 = a3, s3 = n3; s3 && !(`immediateRender` in o3); ) o3 = s3.vars.defaults || {}, s3 = b2(s3.vars.inherit) && s3.parent;
      a3.immediateRender = b2(o3.immediateRender), e32 < 2 ? a3.runBackwards = 1 : a3.startAt = t3[i3 - 1];
    }
    return new Y2(t3[0], a3, t3[i3 + 1]);
  };
  var it2 = function(e32, t3) {
    return e32 || e32 === 0 ? t3(e32) : t3;
  };
  var at2 = function(e32, t3, n3) {
    return n3 < e32 ? e32 : n3 > t3 ? t3 : n3;
  };
  var G2 = function(e32, t3) {
    return !h2(e32) || !(t3 = N2.exec(e32)) ? `` : t3[1];
  };
  var ot2 = function(e32, t3, n3) {
    return it2(n3, function(n4) {
      return at2(e32, t3, n4);
    });
  };
  var st2 = [].slice;
  var ct2 = function(e32, t3) {
    return e32 && y2(e32) && `length` in e32 && (!t3 && !e32.length || e32.length - 1 in e32 && y2(e32[0])) && !e32.nodeType && e32 !== F2;
  };
  var lt2 = function(e32, t3, n3) {
    return n3 === void 0 && (n3 = []), e32.forEach(function(e33) {
      var r3;
      return h2(e33) && !t3 || ct2(e33, 1) ? (r3 = n3).push.apply(r3, ut2(e33)) : n3.push(e33);
    }) || n3;
  };
  var ut2 = function(e32, t3, n3) {
    return o2 && !t3 && o2.selector ? o2.selector(e32) : h2(e32) && !n3 && (I2 || !Ht2()) ? st2.call((t3 || L2).querySelectorAll(e32), 0) : w2(e32) ? lt2(e32, n3) : ct2(e32) ? st2.call(e32, 0) : e32 ? [e32] : [];
  };
  var dt2 = function(e32) {
    return e32 = ut2(e32)[0] || ne2(`Invalid scope`) || {}, function(t3) {
      var n3 = e32.current || e32.nativeElement || e32;
      return ut2(t3, n3.querySelectorAll ? n3 : n3 === e32 ? ne2(`Invalid scope`) || L2.createElement(`div`) : e32);
    };
  };
  var ft2 = function(e32) {
    return e32.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var pt2 = function(e32) {
    if (g2(e32)) return e32;
    var t3 = y2(e32) ? e32 : { each: e32 }, n3 = Yt2(t3.ease), r3 = t3.from || 0, i3 = parseFloat(t3.base) || 0, a3 = {}, o3 = r3 > 0 && r3 < 1, c3 = isNaN(r3) || o3, l3 = t3.axis, u3 = r3, d3 = r3;
    return h2(r3) ? u3 = d3 = { center: 0.5, edges: 0.5, end: 1 }[r3] || 0 : !o3 && c3 && (u3 = r3[0], d3 = r3[1]), function(e33, o4, p3) {
      var m3 = (p3 || t3).length, h3 = a3[m3], g3, _3, v3, y3, b3, x3, S3, C3, w3;
      if (!h3) {
        if (w3 = t3.grid === `auto` ? 0 : (t3.grid || [1, s2])[1], !w3) {
          for (S3 = -s2; S3 < (S3 = p3[w3++].getBoundingClientRect().left) && w3 < m3; ) ;
          w3 < m3 && w3--;
        }
        for (h3 = a3[m3] = [], g3 = c3 ? Math.min(w3, m3) * u3 - 0.5 : r3 % w3, _3 = w3 === s2 ? 0 : c3 ? m3 * d3 / w3 - 0.5 : r3 / w3 | 0, S3 = 0, C3 = s2, x3 = 0; x3 < m3; x3++) v3 = x3 % w3 - g3, y3 = _3 - (x3 / w3 | 0), h3[x3] = b3 = l3 ? Math.abs(l3 === `y` ? y3 : v3) : f2(v3 * v3 + y3 * y3), b3 > S3 && (S3 = b3), b3 < C3 && (C3 = b3);
        r3 === `random` && ft2(h3), h3.max = S3 - C3, h3.min = C3, h3.v = m3 = (parseFloat(t3.amount) || parseFloat(t3.each) * (w3 > m3 ? m3 - 1 : l3 ? l3 === `y` ? m3 / w3 : w3 : Math.max(w3, m3 / w3)) || 0) * (r3 === `edges` ? -1 : 1), h3.b = m3 < 0 ? i3 - m3 : i3, h3.u = G2(t3.amount || t3.each) || 0, n3 = n3 && m3 < 0 ? Jt2(n3) : n3;
      }
      return m3 = (h3[e33] - h3.min) / h3.max || 0, W2(h3.b + (n3 ? n3(m3) : m3) * h3.v) + h3.u;
    };
  };
  var mt2 = function(e32) {
    var t3 = 10 ** ((e32 + ``).split(`.`)[1] || ``).length;
    return function(n3) {
      var r3 = W2(Math.round(parseFloat(n3) / e32) * e32 * t3);
      return (r3 - r3 % 1) / t3 + (_2(n3) ? 0 : G2(n3));
    };
  };
  var ht2 = function(e32, t3) {
    var n3 = w2(e32), r3, i3;
    return !n3 && y2(e32) && (r3 = n3 = e32.radius || s2, e32.values ? (e32 = ut2(e32.values), (i3 = !_2(e32[0])) && (r3 *= r3)) : e32 = mt2(e32.increment)), it2(t3, n3 ? g2(e32) ? function(t4) {
      return i3 = e32(t4), Math.abs(i3 - t4) <= r3 ? i3 : t4;
    } : function(t4) {
      for (var n4 = parseFloat(i3 ? t4.x : t4), a3 = parseFloat(i3 ? t4.y : 0), o3 = s2, c3 = 0, l3 = e32.length, u3, d3; l3--; ) i3 ? (u3 = e32[l3].x - n4, d3 = e32[l3].y - a3, u3 = u3 * u3 + d3 * d3) : u3 = Math.abs(e32[l3] - n4), u3 < o3 && (o3 = u3, c3 = l3);
      return c3 = !r3 || o3 <= r3 ? e32[c3] : t4, i3 || c3 === t4 || _2(t4) ? c3 : c3 + G2(t4);
    } : mt2(e32));
  };
  var gt2 = function(e32, t3, n3, r3) {
    return it2(w2(e32) ? !t3 : n3 === true ? !!(n3 = 0) : !r3, function() {
      return w2(e32) ? e32[~~(Math.random() * e32.length)] : (n3 || (n3 = 1e-5)) && (r3 = n3 < 1 ? 10 ** ((n3 + ``).length - 2) : 1) && Math.floor(Math.round((e32 - n3 / 2 + Math.random() * (t3 - e32 + n3 * 0.99)) / n3) * n3 * r3) / r3;
    });
  };
  var _t2 = function() {
    var e32 = [...arguments];
    return function(t3) {
      return e32.reduce(function(e33, t4) {
        return t4(e33);
      }, t3);
    };
  };
  var vt2 = function(e32, t3) {
    return function(n3) {
      return e32(parseFloat(n3)) + (t3 || G2(n3));
    };
  };
  var yt2 = function(e32, t3, n3) {
    return wt2(e32, t3, 0, 1, n3);
  };
  var bt2 = function(e32, t3, n3) {
    return it2(n3, function(n4) {
      return e32[~~t3(n4)];
    });
  };
  var xt2 = function e22(t3, n3, r3) {
    var i3 = n3 - t3;
    return w2(t3) ? bt2(t3, e22(0, t3.length), n3) : it2(r3, function(e32) {
      return (i3 + (e32 - t3) % i3) % i3 + t3;
    });
  };
  var St2 = function e23(t3, n3, r3) {
    var i3 = n3 - t3, a3 = i3 * 2;
    return w2(t3) ? bt2(t3, e23(0, t3.length - 1), n3) : it2(r3, function(e32) {
      return e32 = (a3 + (e32 - t3) % a3) % a3 || 0, t3 + (e32 > i3 ? a3 - e32 : e32);
    });
  };
  var Ct2 = function(e32) {
    return e32.replace(T2, function(e33) {
      var t3 = e33.indexOf(`[`) + 1, n3 = e33.substring(t3 || 7, t3 ? e33.indexOf(`]`) : e33.length - 1).split(E2);
      return gt2(t3 ? n3 : +n3[0], t3 ? 0 : +n3[1], +n3[2] || 1e-5);
    });
  };
  var wt2 = function(e32, t3, n3, r3, i3) {
    var a3 = t3 - e32, o3 = r3 - n3;
    return it2(i3, function(t4) {
      return n3 + ((t4 - e32) / a3 * o3 || 0);
    });
  };
  var Tt2 = function e24(t3, n3, r3, i3) {
    var a3 = isNaN(t3 + n3) ? 0 : function(e32) {
      return (1 - e32) * t3 + e32 * n3;
    };
    if (!a3) {
      var o3 = h2(t3), s3 = {}, c3, l3, u3, d3, f3;
      if (r3 === true && (i3 = 1) && (r3 = null), o3) t3 = { p: t3 }, n3 = { p: n3 };
      else if (w2(t3) && !w2(n3)) {
        for (u3 = [], d3 = t3.length, f3 = d3 - 2, l3 = 1; l3 < d3; l3++) u3.push(e24(t3[l3 - 1], t3[l3]));
        d3--, a3 = function(e32) {
          e32 *= d3;
          var t4 = Math.min(f3, ~~e32);
          return u3[t4](e32 - t4);
        }, r3 = n3;
      } else i3 || (t3 = Oe2(w2(t3) ? [] : {}, t3));
      if (!u3) {
        for (c3 in n3) rn2.call(s3, t3, c3, `get`, n3[c3]);
        a3 = function(e32) {
          return wn2(e32, s3) || (o3 ? t3.p : t3);
        };
      }
    }
    return it2(r3, a3);
  };
  var Et2 = function(e32, t3, n3) {
    var r3 = e32.labels, i3 = s2, a3, o3, c3;
    for (a3 in r3) o3 = r3[a3] - t3, o3 < 0 == !!n3 && o3 && i3 > (o3 = Math.abs(o3)) && (c3 = a3, i3 = o3);
    return c3;
  };
  var Dt2 = function(e32, t3, n3) {
    var r3 = e32.vars, i3 = r3[t3], a3 = o2, s3 = e32._ctx, c3, l3, u3;
    if (i3) return c3 = r3[t3 + `Params`], l3 = r3.callbackScope || e32, n3 && le2.length && xe2(), s3 && (o2 = s3), u3 = c3 ? i3.apply(l3, c3) : i3.call(l3), o2 = a3, u3;
  };
  var Ot2 = function(e32) {
    return Fe2(e32), e32.scrollTrigger && e32.scrollTrigger.kill(!!a2), e32.progress() < 1 && Dt2(e32, `onInterrupt`), e32;
  };
  var kt2;
  var At2 = [];
  var jt2 = function(e32) {
    if (e32) if (e32 = !e32.name && e32.default || e32, x2() || e32.headless) {
      var t3 = e32.name, n3 = g2(e32), r3 = t3 && !n3 && e32.init ? function() {
        this._props = [];
      } : e32, i3 = { init: ie2, render: wn2, add: rn2, kill: En2, modifier: Tn2, rawVars: 0 }, a3 = { targetTest: 0, get: 0, getSetter: bn2, aliases: {}, register: 0 };
      if (Ht2(), e32 !== r3) {
        if (V2[t3]) return;
        Ee2(r3, Ee2(Ae2(e32, i3), a3)), Oe2(r3.prototype, Oe2(i3, Ae2(e32, a3))), V2[r3.prop = t3] = r3, e32.targetTest && (me2.push(r3), ce2[t3] = 1), t3 = (t3 === `css` ? `CSS` : t3.charAt(0).toUpperCase() + t3.substr(1)) + `Plugin`;
      }
      re2(t3, r3), e32.register && e32.register(Z2, r3, X2);
    } else At2.push(e32);
  };
  var K2 = 255;
  var Mt2 = { aqua: [0, K2, K2], lime: [0, K2, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, K2], navy: [0, 0, 128], white: [K2, K2, K2], olive: [128, 128, 0], yellow: [K2, K2, 0], orange: [K2, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [K2, 0, 0], pink: [K2, 192, 203], cyan: [0, K2, K2], transparent: [K2, K2, K2, 0] };
  var Nt2 = function(e32, t3, n3) {
    return e32 += e32 < 0 ? 1 : e32 > 1 ? -1 : 0, (e32 * 6 < 1 ? t3 + (n3 - t3) * e32 * 6 : e32 < 0.5 ? n3 : e32 * 3 < 2 ? t3 + (n3 - t3) * (2 / 3 - e32) * 6 : t3) * K2 + 0.5 | 0;
  };
  var Pt2 = function(e32, t3, n3) {
    var r3 = e32 ? _2(e32) ? [e32 >> 16, e32 >> 8 & K2, e32 & K2] : 0 : Mt2.black, i3, a3, o3, s3, c3, l3, u3, d3, f3, p3;
    if (!r3) {
      if (e32.substr(-1) === `,` && (e32 = e32.substr(0, e32.length - 1)), Mt2[e32]) r3 = Mt2[e32];
      else if (e32.charAt(0) === `#`) {
        if (e32.length < 6 && (i3 = e32.charAt(1), a3 = e32.charAt(2), o3 = e32.charAt(3), e32 = `#` + i3 + i3 + a3 + a3 + o3 + o3 + (e32.length === 5 ? e32.charAt(4) + e32.charAt(4) : ``)), e32.length === 9) return r3 = parseInt(e32.substr(1, 6), 16), [r3 >> 16, r3 >> 8 & K2, r3 & K2, parseInt(e32.substr(7), 16) / 255];
        e32 = parseInt(e32.substr(1), 16), r3 = [e32 >> 16, e32 >> 8 & K2, e32 & K2];
      } else if (e32.substr(0, 3) === `hsl`) {
        if (r3 = p3 = e32.match(D2), !t3) s3 = r3[0] % 360 / 360, c3 = r3[1] / 100, l3 = r3[2] / 100, a3 = l3 <= 0.5 ? l3 * (c3 + 1) : l3 + c3 - l3 * c3, i3 = l3 * 2 - a3, r3.length > 3 && (r3[3] *= 1), r3[0] = Nt2(s3 + 1 / 3, i3, a3), r3[1] = Nt2(s3, i3, a3), r3[2] = Nt2(s3 - 1 / 3, i3, a3);
        else if (~e32.indexOf(`=`)) return r3 = e32.match(O2), n3 && r3.length < 4 && (r3[3] = 1), r3;
      } else r3 = e32.match(D2) || Mt2.transparent;
      r3 = r3.map(Number);
    }
    return t3 && !p3 && (i3 = r3[0] / K2, a3 = r3[1] / K2, o3 = r3[2] / K2, u3 = Math.max(i3, a3, o3), d3 = Math.min(i3, a3, o3), l3 = (u3 + d3) / 2, u3 === d3 ? s3 = c3 = 0 : (f3 = u3 - d3, c3 = l3 > 0.5 ? f3 / (2 - u3 - d3) : f3 / (u3 + d3), s3 = u3 === i3 ? (a3 - o3) / f3 + (a3 < o3 ? 6 : 0) : u3 === a3 ? (o3 - i3) / f3 + 2 : (i3 - a3) / f3 + 4, s3 *= 60), r3[0] = ~~(s3 + 0.5), r3[1] = ~~(c3 * 100 + 0.5), r3[2] = ~~(l3 * 100 + 0.5)), n3 && r3.length < 4 && (r3[3] = 1), r3;
  };
  var Ft2 = function(e32) {
    var t3 = [], n3 = [], r3 = -1;
    return e32.split(Lt2).forEach(function(e33) {
      var i3 = e33.match(k2) || [];
      t3.push.apply(t3, i3), n3.push(r3 += i3.length + 1);
    }), t3.c = n3, t3;
  };
  var It2 = function(e32, t3, n3) {
    var r3 = ``, i3 = (e32 + r3).match(Lt2), a3 = t3 ? `hsla(` : `rgba(`, o3 = 0, s3, c3, l3, u3;
    if (!i3) return e32;
    if (i3 = i3.map(function(e33) {
      return (e33 = Pt2(e33, t3, 1)) && a3 + (t3 ? e33[0] + `,` + e33[1] + `%,` + e33[2] + `%,` + e33[3] : e33.join(`,`)) + `)`;
    }), n3 && (l3 = Ft2(e32), s3 = n3.c, s3.join(r3) !== l3.c.join(r3))) for (c3 = e32.replace(Lt2, `1`).split(k2), u3 = c3.length - 1; o3 < u3; o3++) r3 += c3[o3] + (~s3.indexOf(o3) ? i3.shift() || a3 + `0,0,0,0)` : (l3.length ? l3 : i3.length ? i3 : n3).shift());
    if (!c3) for (c3 = e32.split(Lt2), u3 = c3.length - 1; o3 < u3; o3++) r3 += c3[o3] + i3[o3];
    return r3 + c3[u3];
  };
  var Lt2 = (function() {
    var e32 = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`, t3;
    for (t3 in Mt2) e32 += `|` + t3 + `\\b`;
    return RegExp(e32 + `)`, `gi`);
  })();
  var Rt2 = /hsl[a]?\(/;
  var zt2 = function(e32) {
    var t3 = e32.join(` `), n3;
    if (Lt2.lastIndex = 0, Lt2.test(t3)) return n3 = Rt2.test(t3), e32[1] = It2(e32[1], n3), e32[0] = It2(e32[0], n3, Ft2(e32[1])), true;
  };
  var Bt2;
  var Vt2 = (function() {
    var e32 = Date.now, t3 = 500, n3 = 33, r3 = e32(), i3 = r3, a3 = 1e3 / 240, o3 = a3, s3 = [], c3, l3, u3, d3, f3, p3, m3 = function u4(m4) {
      var h3 = e32() - i3, g3 = m4 === true, _3, v3, y3, b3;
      if ((h3 > t3 || h3 < 0) && (r3 += h3 - n3), i3 += h3, y3 = i3 - r3, _3 = y3 - o3, (_3 > 0 || g3) && (b3 = ++d3.frame, f3 = y3 - d3.time * 1e3, d3.time = y3 /= 1e3, o3 += _3 + (_3 >= a3 ? 4 : a3 - _3), v3 = 1), g3 || (c3 = l3(u4)), v3) for (p3 = 0; p3 < s3.length; p3++) s3[p3](y3, f3, b3, m4);
    };
    return d3 = { time: 0, frame: 0, tick: function() {
      m3(true);
    }, deltaRatio: function(e33) {
      return f3 / (1e3 / (e33 || 60));
    }, wake: function() {
      B2 && (!I2 && x2() && (F2 = I2 = window, L2 = F2.document || {}, R2.gsap = Z2, (F2.gsapVersions || (F2.gsapVersions = [])).push(Z2.version), ee2(z2 || F2.GreenSockGlobals || !F2.gsap && F2 || {}), At2.forEach(jt2)), u3 = typeof requestAnimationFrame < `u` && requestAnimationFrame, c3 && d3.sleep(), l3 = u3 || function(e33) {
        return setTimeout(e33, o3 - d3.time * 1e3 + 1 | 0);
      }, Bt2 = 1, m3(2));
    }, sleep: function() {
      (u3 ? cancelAnimationFrame : clearTimeout)(c3), Bt2 = 0, l3 = ie2;
    }, lagSmoothing: function(e33, r4) {
      t3 = e33 || 1 / 0, n3 = Math.min(r4 || 33, t3);
    }, fps: function(e33) {
      a3 = 1e3 / (e33 || 240), o3 = d3.time * 1e3 + a3;
    }, add: function(e33, t4, n4) {
      var r4 = t4 ? function(t5, n5, i4, a4) {
        e33(t5, n5, i4, a4), d3.remove(r4);
      } : e33;
      return d3.remove(e33), s3[n4 ? `unshift` : `push`](r4), Ht2(), r4;
    }, remove: function(e33, t4) {
      ~(t4 = s3.indexOf(e33)) && s3.splice(t4, 1) && p3 >= t4 && p3--;
    }, _listeners: s3 }, d3;
  })();
  var Ht2 = function() {
    return !Bt2 && Vt2.wake();
  };
  var q2 = {};
  var Ut2 = /^[\d.\-M][\d.\-,\s]/;
  var Wt2 = /["']/g;
  var Gt2 = function(e32) {
    for (var t3 = {}, n3 = e32.substr(1, e32.length - 3).split(`:`), r3 = n3[0], i3 = 1, a3 = n3.length, o3, s3, c3; i3 < a3; i3++) s3 = n3[i3], o3 = i3 === a3 - 1 ? s3.length : s3.lastIndexOf(`,`), c3 = s3.substr(0, o3), t3[r3] = isNaN(c3) ? c3.replace(Wt2, ``).trim() : +c3, r3 = s3.substr(o3 + 1).trim();
    return t3;
  };
  var Kt2 = function(e32) {
    var t3 = e32.indexOf(`(`) + 1, n3 = e32.indexOf(`)`), r3 = e32.indexOf(`(`, t3);
    return e32.substring(t3, ~r3 && r3 < n3 ? e32.indexOf(`)`, n3 + 1) : n3);
  };
  var qt2 = function(e32) {
    var t3 = (e32 + ``).split(`(`), n3 = q2[t3[0]];
    return n3 && t3.length > 1 && n3.config ? n3.config.apply(null, ~e32.indexOf(`{`) ? [Gt2(t3[1])] : Kt2(e32).split(`,`).map(we2)) : q2._CE && Ut2.test(e32) ? q2._CE(``, e32) : n3;
  };
  var Jt2 = function(e32) {
    return function(t3) {
      return 1 - e32(1 - t3);
    };
  };
  var Yt2 = function(e32, t3) {
    return e32 && (g2(e32) ? e32 : q2[e32] || qt2(e32)) || t3;
  };
  var Xt2 = function(e32, t3, n3, r3) {
    n3 === void 0 && (n3 = function(e33) {
      return 1 - t3(1 - e33);
    }), r3 === void 0 && (r3 = function(e33) {
      return e33 < 0.5 ? t3(e33 * 2) / 2 : 1 - t3((1 - e33) * 2) / 2;
    });
    var i3 = { easeIn: t3, easeOut: n3, easeInOut: r3 }, a3;
    return H2(e32, function(e33) {
      for (var t4 in q2[e33] = R2[e33] = i3, q2[a3 = e33.toLowerCase()] = n3, i3) q2[a3 + (t4 === `easeIn` ? `.in` : t4 === `easeOut` ? `.out` : `.inOut`)] = q2[e33 + `.` + t4] = i3[t4];
    }), i3;
  };
  var Zt2 = function(e32) {
    return function(t3) {
      return t3 < 0.5 ? (1 - e32(1 - t3 * 2)) / 2 : 0.5 + e32((t3 - 0.5) * 2) / 2;
    };
  };
  var Qt2 = function e25(t3, n3, r3) {
    var i3 = n3 >= 1 ? n3 : 1, a3 = (r3 || (t3 ? 0.3 : 0.45)) / (n3 < 1 ? n3 : 1), o3 = a3 / l2 * (Math.asin(1 / i3) || 0), s3 = function(e32) {
      return e32 === 1 ? 1 : i3 * 2 ** (-10 * e32) * m2((e32 - o3) * a3) + 1;
    }, c3 = t3 === `out` ? s3 : t3 === `in` ? function(e32) {
      return 1 - s3(1 - e32);
    } : Zt2(s3);
    return a3 = l2 / a3, c3.config = function(n4, r4) {
      return e25(t3, n4, r4);
    }, c3;
  };
  var $t2 = function e26(t3, n3) {
    n3 === void 0 && (n3 = 1.70158);
    var r3 = function(e32) {
      return e32 ? --e32 * e32 * ((n3 + 1) * e32 + n3) + 1 : 0;
    }, i3 = t3 === `out` ? r3 : t3 === `in` ? function(e32) {
      return 1 - r3(1 - e32);
    } : Zt2(r3);
    return i3.config = function(n4) {
      return e26(t3, n4);
    }, i3;
  };
  H2(`Linear,Quad,Cubic,Quart,Quint,Strong`, function(e32, t3) {
    var n3 = t3 < 5 ? t3 + 1 : t3;
    Xt2(e32 + `,Power` + (n3 - 1), t3 ? function(e33) {
      return e33 ** +n3;
    } : function(e33) {
      return e33;
    }, function(e33) {
      return 1 - (1 - e33) ** n3;
    }, function(e33) {
      return e33 < 0.5 ? (e33 * 2) ** n3 / 2 : 1 - ((1 - e33) * 2) ** n3 / 2;
    });
  }), q2.Linear.easeNone = q2.none = q2.Linear.easeIn, Xt2(`Elastic`, Qt2(`in`), Qt2(`out`), Qt2()), (function(e32, t3) {
    var n3 = 1 / t3, r3 = 2 * n3, i3 = 2.5 * n3, a3 = function(a4) {
      return a4 < n3 ? e32 * a4 * a4 : a4 < r3 ? e32 * (a4 - 1.5 / t3) ** 2 + 0.75 : a4 < i3 ? e32 * (a4 -= 2.25 / t3) * a4 + 0.9375 : e32 * (a4 - 2.625 / t3) ** 2 + 0.984375;
    };
    Xt2(`Bounce`, function(e33) {
      return 1 - a3(1 - e33);
    }, a3);
  })(7.5625, 2.75), Xt2(`Expo`, function(e32) {
    return 2 ** (10 * (e32 - 1)) * e32 + e32 * e32 * e32 * e32 * e32 * e32 * (1 - e32);
  }), Xt2(`Circ`, function(e32) {
    return -(f2(1 - e32 * e32) - 1);
  }), Xt2(`Sine`, function(e32) {
    return e32 === 1 ? 1 : -p2(e32 * u2) + 1;
  }), Xt2(`Back`, $t2(`in`), $t2(`out`), $t2()), q2.SteppedEase = q2.steps = R2.SteppedEase = { config: function(e32, t3) {
    e32 === void 0 && (e32 = 1);
    var n3 = 1 / e32, r3 = e32 + +!t3, i3 = +!!t3, a3 = 1 - c2;
    return function(e33) {
      return ((r3 * at2(0, a3, e33) | 0) + i3) * n3;
    };
  } }, r2.ease = q2[`quad.out`], H2(`onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`, function(e32) {
    return he2 += e32 + `,` + e32 + `Params,`;
  });
  var en2 = function(e32, t3) {
    this.id = d2++, e32._gsap = this, this.target = e32, this.harness = t3, this.get = t3 ? t3.get : ve2, this.set = t3 ? t3.getSetter : bn2;
  };
  var tn2 = (function() {
    function e32(e33) {
      this.vars = e33, this._delay = +e33.delay || 0, (this._repeat = e33.repeat === 1 / 0 ? -2 : e33.repeat || 0) && (this._rDelay = e33.repeatDelay || 0, this._yoyo = !!e33.yoyo || !!e33.yoyoEase), this._ts = 1, $e2(this, +e33.duration, 1, 1), this.data = e33.data, o2 && (this._ctx = o2, o2.data.push(this)), Bt2 || Vt2.wake();
    }
    var t3 = e32.prototype;
    return t3.delay = function(e33) {
      return e33 || e33 === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e33 - this._delay), this._delay = e33, this) : this._delay;
    }, t3.duration = function(e33) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? e33 + (e33 + this._rDelay) * this._repeat : e33) : this.totalDuration() && this._dur;
    }, t3.totalDuration = function(e33) {
      return arguments.length ? (this._dirty = 0, $e2(this, this._repeat < 0 ? e33 : (e33 - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, t3.totalTime = function(e33, t4) {
      if (Ht2(), !arguments.length) return this._tTime;
      var n3 = this._dp;
      if (n3 && n3.smoothChildTiming && this._ts) {
        for (We2(this, e33), !n3._dp || n3.parent || Ge2(n3, this); n3 && n3.parent; ) n3.parent._time !== n3._start + (n3._ts >= 0 ? n3._tTime / n3._ts : (n3.totalDuration() - n3._tTime) / -n3._ts) && n3.totalTime(n3._tTime, true), n3 = n3.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e33 < this._tDur || this._ts < 0 && e33 > 0 || !this._tDur && !e33) && Ke2(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== e33 || !this._dur && !t4 || this._initted && Math.abs(this._zTime) === c2 || !this._initted && this._dur && e33 || !e33 && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e33), Ce2(this, e33, t4)), this;
    }, t3.time = function(e33, t4) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e33 + Be2(this)) % (this._dur + this._rDelay) || (e33 ? this._dur : 0), t4) : this._time;
    }, t3.totalProgress = function(e33, t4) {
      return arguments.length ? this.totalTime(this.totalDuration() * e33, t4) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, t3.progress = function(e33, t4) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e33 : e33) + Be2(this), t4) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
    }, t3.iteration = function(e33, t4) {
      var n3 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (e33 - 1) * n3, t4) : this._repeat ? Ve2(this._tTime, n3) + 1 : 1;
    }, t3.timeScale = function(e33, t4) {
      if (!arguments.length) return this._rts === -c2 ? 0 : this._rts;
      if (this._rts === e33) return this;
      var n3 = this.parent && this._ts ? He2(this.parent._time, this) : this._tTime;
      return this._rts = +e33 || 0, this._ts = this._ps || e33 === -c2 ? 0 : this._rts, this.totalTime(at2(-Math.abs(this._delay), this.totalDuration(), n3), t4 !== false), Ue2(this), Le2(this);
    }, t3.paused = function(e33) {
      return arguments.length ? (this._ps !== e33 && (this._ps = e33, e33 ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Ht2(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== c2 && (this._tTime -= c2)))), this) : this._ps;
    }, t3.startTime = function(e33) {
      if (arguments.length) {
        this._start = W2(e33);
        var t4 = this.parent || this._dp;
        return t4 && (t4._sort || !this.parent) && Ke2(t4, this, this._start - this._delay), this;
      }
      return this._start;
    }, t3.endTime = function(e33) {
      return this._start + (b2(e33) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, t3.rawTime = function(e33) {
      var t4 = this.parent || this._dp;
      return t4 ? e33 && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? He2(t4.rawTime(e33), this) : this._tTime : this._tTime;
    }, t3.revert = function(e33) {
      e33 === void 0 && (e33 = se2);
      var t4 = a2;
      return a2 = e33, Se2(this) && (this.timeline && this.timeline.revert(e33), this.totalTime(-0.01, e33.suppressEvents)), this.data !== `nested` && e33.kill !== false && this.kill(), a2 = t4, this;
    }, t3.globalTime = function(e33) {
      for (var t4 = this, n3 = arguments.length ? e33 : t4.rawTime(); t4; ) n3 = t4._start + n3 / (Math.abs(t4._ts) || 1), t4 = t4._dp;
      return !this.parent && this._sat ? this._sat.globalTime(e33) : n3;
    }, t3.repeat = function(e33) {
      return arguments.length ? (this._repeat = e33 === 1 / 0 ? -2 : e33, et2(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, t3.repeatDelay = function(e33) {
      if (arguments.length) {
        var t4 = this._time;
        return this._rDelay = e33, et2(this), t4 ? this.time(t4) : this;
      }
      return this._rDelay;
    }, t3.yoyo = function(e33) {
      return arguments.length ? (this._yoyo = e33, this) : this._yoyo;
    }, t3.seek = function(e33, t4) {
      return this.totalTime(nt2(this, e33), b2(t4));
    }, t3.restart = function(e33, t4) {
      return this.play().totalTime(e33 ? -this._delay : 0, b2(t4)), this._dur || (this._zTime = -c2), this;
    }, t3.play = function(e33, t4) {
      return e33 != null && this.seek(e33, t4), this.reversed(false).paused(false);
    }, t3.reverse = function(e33, t4) {
      return e33 != null && this.seek(e33 || this.totalDuration(), t4), this.reversed(true).paused(false);
    }, t3.pause = function(e33, t4) {
      return e33 != null && this.seek(e33, t4), this.paused(true);
    }, t3.resume = function() {
      return this.paused(false);
    }, t3.reversed = function(e33) {
      return arguments.length ? (!!e33 !== this.reversed() && this.timeScale(-this._rts || (e33 ? -c2 : 0)), this) : this._rts < 0;
    }, t3.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -c2, this;
    }, t3.isActive = function() {
      var e33 = this.parent || this._dp, t4 = this._start, n3;
      return !!(!e33 || this._ts && this._initted && e33.isActive() && (n3 = e33.rawTime(true)) >= t4 && n3 < this.endTime(true) - c2);
    }, t3.eventCallback = function(e33, t4, n3) {
      var r3 = this.vars;
      return arguments.length > 1 ? (t4 ? (r3[e33] = t4, n3 && (r3[e33 + `Params`] = n3), e33 === `onUpdate` && (this._onUpdate = t4)) : delete r3[e33], this) : r3[e33];
    }, t3.then = function(e33) {
      var t4 = this, n3 = t4._prom;
      return new Promise(function(r3) {
        var i3 = g2(e33) ? e33 : Te2, a3 = function() {
          var e34 = t4.then;
          t4.then = null, n3 && n3(), g2(i3) && (i3 = i3(t4)) && (i3.then || i3 === t4) && (t4.then = e34), r3(i3), t4.then = e34;
        };
        t4._initted && t4.totalProgress() === 1 && t4._ts >= 0 || !t4._tTime && t4._ts < 0 ? a3() : t4._prom = a3;
      });
    }, t3.kill = function() {
      Ot2(this);
    }, e32;
  })();
  Ee2(tn2.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -c2, _prom: 0, _ps: false, _rts: 1 });
  var J2 = (function(r3) {
    t2(i3, r3);
    function i3(t3, n3) {
      var i4;
      return t3 === void 0 && (t3 = {}), i4 = r3.call(this, t3) || this, i4.labels = {}, i4.smoothChildTiming = !!t3.smoothChildTiming, i4.autoRemoveChildren = !!t3.autoRemoveChildren, i4._sort = b2(t3.sortChildren), P2 && Ke2(t3.parent || P2, e17(i4), n3), t3.reversed && i4.reverse(), t3.paused && i4.paused(true), t3.scrollTrigger && qe2(e17(i4), t3.scrollTrigger), i4;
    }
    var o3 = i3.prototype;
    return o3.to = function(e32, t3, n3) {
      return rt2(0, arguments, this), this;
    }, o3.from = function(e32, t3, n3) {
      return rt2(1, arguments, this), this;
    }, o3.fromTo = function(e32, t3, n3, r4) {
      return rt2(2, arguments, this), this;
    }, o3.set = function(e32, t3, n3) {
      return t3.duration = 0, t3.parent = this, je2(t3).repeatDelay || (t3.repeat = 0), t3.immediateRender = !!t3.immediateRender, new Y2(e32, t3, nt2(this, n3), 1), this;
    }, o3.call = function(e32, t3, n3) {
      return Ke2(this, Y2.delayedCall(0, e32, t3), n3);
    }, o3.staggerTo = function(e32, t3, n3, r4, i4, a3, o4) {
      return n3.duration = t3, n3.stagger = n3.stagger || r4, n3.onComplete = a3, n3.onCompleteParams = o4, n3.parent = this, new Y2(e32, n3, nt2(this, i4)), this;
    }, o3.staggerFrom = function(e32, t3, n3, r4, i4, a3, o4) {
      return n3.runBackwards = 1, je2(n3).immediateRender = b2(n3.immediateRender), this.staggerTo(e32, t3, n3, r4, i4, a3, o4);
    }, o3.staggerFromTo = function(e32, t3, n3, r4, i4, a3, o4, s3) {
      return r4.startAt = n3, je2(r4).immediateRender = b2(r4.immediateRender), this.staggerTo(e32, t3, r4, i4, a3, o4, s3);
    }, o3.render = function(e32, t3, n3) {
      var r4 = this._time, i4 = this._dirty ? this.totalDuration() : this._tDur, o4 = this._dur, s3 = e32 <= 0 ? 0 : W2(e32), l3 = this._zTime < 0 != e32 < 0 && (this._initted || !o4), u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
      if (this !== P2 && s3 > i4 && e32 >= 0 && (s3 = i4), s3 !== this._tTime || n3 || l3) {
        if (r4 !== this._time && o4 && (s3 += this._time - r4, e32 += this._time - r4), u3 = s3, v3 = this._start, _3 = this._ts, h3 = !_3, l3 && (o4 || (r4 = this._zTime), (e32 || !t3) && (this._zTime = e32)), this._repeat) {
          if (b3 = this._yoyo, m3 = o4 + this._rDelay, this._repeat < -1 && e32 < 0) return this.totalTime(m3 * 100 + e32, t3, n3);
          if (u3 = W2(s3 % m3), s3 === i4 ? (p3 = this._repeat, u3 = o4) : (y3 = W2(s3 / m3), p3 = ~~y3, p3 && p3 === y3 && (u3 = o4, p3--), u3 > o4 && (u3 = o4)), y3 = Ve2(this._tTime, m3), !r4 && this._tTime && y3 !== p3 && this._tTime - y3 * m3 - this._dur <= 0 && (y3 = p3), b3 && p3 & 1 && (u3 = o4 - u3, x3 = 1), p3 !== y3 && !this._lock) {
            var S3 = b3 && y3 & 1, C3 = S3 === (b3 && p3 & 1);
            if (p3 < y3 && (S3 = !S3), r4 = S3 ? 0 : s3 % o4 ? o4 : s3, this._lock = 1, this.render(r4 || (x3 ? 0 : W2(p3 * m3)), t3, !o4)._lock = 0, this._tTime = s3, !t3 && this.parent && Dt2(this, `onRepeat`), this.vars.repeatRefresh && !x3 && (this.invalidate()._lock = 1, y3 = p3), r4 && r4 !== this._time || h3 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (o4 = this._dur, i4 = this._tDur, C3 && (this._lock = 2, r4 = S3 ? o4 : -1e-4, this.render(r4, true), this.vars.repeatRefresh && !x3 && this.invalidate()), this._lock = 0, !this._ts && !h3)) return this;
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g3 = Qe2(this, W2(r4), W2(u3)), g3 && (s3 -= u3 - (u3 = g3._start))), this._tTime = s3, this._time = u3, this._act = !!_3, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e32, r4 = 0), !r4 && s3 && o4 && !t3 && !y3 && (Dt2(this, `onStart`), this._tTime !== s3)) return this;
        if (u3 >= r4 && e32 >= 0) for (d3 = this._first; d3; ) {
          if (f3 = d3._next, (d3._act || u3 >= d3._start) && d3._ts && g3 !== d3) {
            if (d3.parent !== this) return this.render(e32, t3, n3);
            if (d3.render(d3._ts > 0 ? (u3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (u3 - d3._start) * d3._ts, t3, n3), u3 !== this._time || !this._ts && !h3) {
              g3 = 0, f3 && (s3 += this._zTime = -c2);
              break;
            }
          }
          d3 = f3;
        }
        else {
          d3 = this._last;
          for (var w3 = e32 < 0 ? e32 : u3; d3; ) {
            if (f3 = d3._prev, (d3._act || w3 <= d3._end) && d3._ts && g3 !== d3) {
              if (d3.parent !== this) return this.render(e32, t3, n3);
              if (d3.render(d3._ts > 0 ? (w3 - d3._start) * d3._ts : (d3._dirty ? d3.totalDuration() : d3._tDur) + (w3 - d3._start) * d3._ts, t3, n3 || a2 && Se2(d3)), u3 !== this._time || !this._ts && !h3) {
                g3 = 0, f3 && (s3 += this._zTime = w3 ? -c2 : c2);
                break;
              }
            }
            d3 = f3;
          }
        }
        if (g3 && !t3 && (this.pause(), g3.render(u3 >= r4 ? 0 : -c2)._zTime = u3 >= r4 ? 1 : -1, this._ts)) return this._start = v3, Ue2(this), this.render(e32, t3, n3);
        this._onUpdate && !t3 && Dt2(this, `onUpdate`, true), (s3 === i4 && this._tTime >= this.totalDuration() || !s3 && r4) && (v3 === this._start || Math.abs(_3) !== Math.abs(this._ts)) && (this._lock || ((e32 || !o4) && (s3 === i4 && this._ts > 0 || !s3 && this._ts < 0) && Fe2(this, 1), !t3 && !(e32 < 0 && !r4) && (s3 || r4 || !i4) && (Dt2(this, s3 === i4 && e32 >= 0 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s3 < i4 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, o3.add = function(e32, t3) {
      var n3 = this;
      if (_2(t3) || (t3 = nt2(this, t3, e32)), !(e32 instanceof tn2)) {
        if (w2(e32)) return e32.forEach(function(e33) {
          return n3.add(e33, t3);
        }), this;
        if (h2(e32)) return this.addLabel(e32, t3);
        if (g2(e32)) e32 = Y2.delayedCall(0, e32);
        else return this;
      }
      return this === e32 ? this : Ke2(this, e32, t3);
    }, o3.getChildren = function(e32, t3, n3, r4) {
      e32 === void 0 && (e32 = true), t3 === void 0 && (t3 = true), n3 === void 0 && (n3 = true), r4 === void 0 && (r4 = -s2);
      for (var i4 = [], a3 = this._first; a3; ) a3._start >= r4 && (a3 instanceof Y2 ? t3 && i4.push(a3) : (n3 && i4.push(a3), e32 && i4.push.apply(i4, a3.getChildren(true, t3, n3)))), a3 = a3._next;
      return i4;
    }, o3.getById = function(e32) {
      for (var t3 = this.getChildren(1, 1, 1), n3 = t3.length; n3--; ) if (t3[n3].vars.id === e32) return t3[n3];
    }, o3.remove = function(e32) {
      return h2(e32) ? this.removeLabel(e32) : g2(e32) ? this.killTweensOf(e32) : (e32.parent === this && Pe2(this, e32), e32 === this._recent && (this._recent = this._last), Ie2(this));
    }, o3.totalTime = function(e32, t3) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = W2(Vt2.time - (this._ts > 0 ? e32 / this._ts : (this.totalDuration() - e32) / -this._ts))), r3.prototype.totalTime.call(this, e32, t3), this._forcing = 0, this) : this._tTime;
    }, o3.addLabel = function(e32, t3) {
      return this.labels[e32] = nt2(this, t3), this;
    }, o3.removeLabel = function(e32) {
      return delete this.labels[e32], this;
    }, o3.addPause = function(e32, t3, n3) {
      var r4 = Y2.delayedCall(0, t3 || ie2, n3);
      return r4.data = `isPause`, this._hasPause = 1, Ke2(this, r4, nt2(this, e32));
    }, o3.removePause = function(e32) {
      var t3 = this._first;
      for (e32 = nt2(this, e32); t3; ) t3._start === e32 && t3.data === `isPause` && Fe2(t3), t3 = t3._next;
    }, o3.killTweensOf = function(e32, t3, n3) {
      for (var r4 = this.getTweensOf(e32, n3), i4 = r4.length; i4--; ) sn2 !== r4[i4] && r4[i4].kill(e32, t3);
      return this;
    }, o3.getTweensOf = function(e32, t3) {
      for (var n3 = [], r4 = ut2(e32), i4 = this._first, a3 = _2(t3), o4; i4; ) i4 instanceof Y2 ? be2(i4._targets, r4) && (a3 ? (!sn2 || i4._initted && i4._ts) && i4.globalTime(0) <= t3 && i4.globalTime(i4.totalDuration()) > t3 : !t3 || i4.isActive()) && n3.push(i4) : (o4 = i4.getTweensOf(r4, t3)).length && n3.push.apply(n3, o4), i4 = i4._next;
      return n3;
    }, o3.tweenTo = function(e32, t3) {
      t3 || (t3 = {});
      var n3 = this, r4 = nt2(n3, e32), i4 = t3, a3 = i4.startAt, o4 = i4.onStart, s3 = i4.onStartParams, l3 = i4.immediateRender, u3, d3 = Y2.to(n3, Ee2({ ease: t3.ease || `none`, lazy: false, immediateRender: false, time: r4, overwrite: `auto`, duration: t3.duration || Math.abs((r4 - (a3 && `time` in a3 ? a3.time : n3._time)) / n3.timeScale()) || c2, onStart: function() {
        if (n3.pause(), !u3) {
          var e33 = t3.duration || Math.abs((r4 - (a3 && `time` in a3 ? a3.time : n3._time)) / n3.timeScale());
          d3._dur !== e33 && $e2(d3, e33, 0, 1).render(d3._time, true, true), u3 = 1;
        }
        o4 && o4.apply(d3, s3 || []);
      } }, t3));
      return l3 ? d3.render(0) : d3;
    }, o3.tweenFromTo = function(e32, t3, n3) {
      return this.tweenTo(t3, Ee2({ startAt: { time: nt2(this, e32) } }, n3));
    }, o3.recent = function() {
      return this._recent;
    }, o3.nextLabel = function(e32) {
      return e32 === void 0 && (e32 = this._time), Et2(this, nt2(this, e32));
    }, o3.previousLabel = function(e32) {
      return e32 === void 0 && (e32 = this._time), Et2(this, nt2(this, e32), 1);
    }, o3.currentLabel = function(e32) {
      return arguments.length ? this.seek(e32, true) : this.previousLabel(this._time + c2);
    }, o3.shiftChildren = function(e32, t3, n3) {
      n3 === void 0 && (n3 = 0);
      var r4 = this._first, i4 = this.labels, a3;
      for (e32 = W2(e32); r4; ) r4._start >= n3 && (r4._start += e32, r4._end += e32), r4 = r4._next;
      if (t3) for (a3 in i4) i4[a3] >= n3 && (i4[a3] += e32);
      return Ie2(this);
    }, o3.invalidate = function(e32) {
      var t3 = this._first;
      for (this._lock = 0; t3; ) t3.invalidate(e32), t3 = t3._next;
      return r3.prototype.invalidate.call(this, e32);
    }, o3.clear = function(e32) {
      e32 === void 0 && (e32 = true);
      for (var t3 = this._first, n3; t3; ) n3 = t3._next, this.remove(t3), t3 = n3;
      return this._dp && (this._time = this._tTime = this._pTime = 0), e32 && (this.labels = {}), Ie2(this);
    }, o3.totalDuration = function(e32) {
      var t3 = 0, n3 = this, r4 = n3._last, i4 = s2, a3, o4, c3;
      if (arguments.length) return n3.timeScale((n3._repeat < 0 ? n3.duration() : n3.totalDuration()) / (n3.reversed() ? -e32 : e32));
      if (n3._dirty) {
        for (c3 = n3.parent; r4; ) a3 = r4._prev, r4._dirty && r4.totalDuration(), o4 = r4._start, o4 > i4 && n3._sort && r4._ts && !n3._lock ? (n3._lock = 1, Ke2(n3, r4, o4 - r4._delay, 1)._lock = 0) : i4 = o4, o4 < 0 && r4._ts && (t3 -= o4, (!c3 && !n3._dp || c3 && c3.smoothChildTiming) && (n3._start += W2(o4 / n3._ts), n3._time -= o4, n3._tTime -= o4), n3.shiftChildren(-o4, false, -1 / 0), i4 = 0), r4._end > t3 && r4._ts && (t3 = r4._end), r4 = a3;
        $e2(n3, n3 === P2 && n3._time > t3 ? n3._time : t3, 1, 1), n3._dirty = 0;
      }
      return n3._tDur;
    }, i3.updateRoot = function(e32) {
      if (P2._ts && (Ce2(P2, He2(e32, P2)), de2 = Vt2.frame), Vt2.frame >= pe2) {
        pe2 += n2.autoSleep || 120;
        var t3 = P2._first;
        if ((!t3 || !t3._ts) && n2.autoSleep && Vt2._listeners.length < 2) {
          for (; t3 && !t3._ts; ) t3 = t3._next;
          t3 || Vt2.sleep();
        }
      }
    }, i3;
  })(tn2);
  Ee2(J2.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
  var nn2 = function(e32, t3, n3, r3, i3, a3, o3) {
    var s3 = new X2(this._pt, e32, t3, 0, 1, Cn2, null, i3), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3;
    for (s3.b = n3, s3.e = r3, n3 += ``, r3 += ``, (g3 = ~r3.indexOf(`random(`)) && (r3 = Ct2(r3)), a3 && (_3 = [n3, r3], a3(_3, e32, t3), n3 = _3[0], r3 = _3[1]), d3 = n3.match(A2) || []; u3 = A2.exec(r3); ) p3 = u3[0], m3 = r3.substring(c3, u3.index), f3 ? f3 = (f3 + 1) % 5 : m3.substr(-5) === `rgba(` && (f3 = 1), p3 !== d3[l3++] && (h3 = parseFloat(d3[l3 - 1]) || 0, s3._pt = { _next: s3._pt, p: m3 || l3 === 1 ? m3 : `,`, s: h3, c: p3.charAt(1) === `=` ? ye2(h3, p3) - h3 : parseFloat(p3) - h3, m: f3 && f3 < 4 ? Math.round : 0 }, c3 = A2.lastIndex);
    return s3.c = c3 < r3.length ? r3.substring(c3, r3.length) : ``, s3.fp = o3, (j2.test(r3) || g3) && (s3.e = 0), this._pt = s3, s3;
  };
  var rn2 = function(e32, t3, r3, i3, a3, o3, s3, c3, l3, u3) {
    g2(i3) && (i3 = i3(a3 || 0, e32, o3));
    var d3 = e32[t3], f3 = r3 === `get` ? g2(d3) ? l3 ? e32[t3.indexOf(`set`) || !g2(e32[`get` + t3.substr(3)]) ? t3 : `get` + t3.substr(3)](l3) : e32[t3]() : d3 : r3, p3 = g2(d3) ? l3 ? vn2 : _n2 : gn2, m3;
    if (h2(i3) && (~i3.indexOf(`random(`) && (i3 = Ct2(i3)), i3.charAt(1) === `=` && (m3 = ye2(f3, i3) + (G2(f3) || 0), (m3 || m3 === 0) && (i3 = m3))), !u3 || f3 !== i3 || cn2) return !isNaN(f3 * i3) && i3 !== `` ? (m3 = new X2(this._pt, e32, t3, +f3 || 0, i3 - (f3 || 0), typeof d3 == `boolean` ? Sn2 : xn2, 0, p3), l3 && (m3.fp = l3), s3 && m3.modifier(s3, this, e32), this._pt = m3) : (!d3 && !(t3 in e32) && te2(t3, i3), nn2.call(this, e32, t3, f3, i3, p3, c3 || n2.stringFilter, l3));
  };
  var an2 = function(e32, t3, n3, r3, i3) {
    if (g2(e32) && (e32 = pn2(e32, i3, t3, n3, r3)), !y2(e32) || e32.style && e32.nodeType || w2(e32) || C2(e32)) return h2(e32) ? pn2(e32, i3, t3, n3, r3) : e32;
    var a3 = {}, o3;
    for (o3 in e32) a3[o3] = pn2(e32[o3], i3, t3, n3, r3);
    return a3;
  };
  var on2 = function(e32, t3, n3, r3, i3, a3) {
    var o3, s3, c3, l3;
    if (V2[e32] && (o3 = new V2[e32]()).init(i3, o3.rawVars ? t3[e32] : an2(t3[e32], r3, i3, a3, n3), n3, r3, a3) !== false && (n3._pt = s3 = new X2(n3._pt, i3, e32, 0, 1, o3.render, o3, 0, o3.priority), n3 !== kt2)) for (c3 = n3._ptLookup[n3._targets.indexOf(i3)], l3 = o3._props.length; l3--; ) c3[o3._props[l3]] = s3;
    return o3;
  };
  var sn2;
  var cn2;
  var ln2 = function e27(t3, n3, o3) {
    var l3 = t3.vars, u3 = l3.ease, d3 = l3.startAt, f3 = l3.immediateRender, p3 = l3.lazy, m3 = l3.onUpdate, h3 = l3.runBackwards, g3 = l3.yoyoEase, _3 = l3.keyframes, v3 = l3.autoRevert, y3 = t3._dur, x3 = t3._startAt, S3 = t3._targets, C3 = t3.parent, w3 = C3 && C3.data === `nested` ? C3.vars.targets : S3, T3 = t3._overwrite === `auto` && !i2, E3 = t3.timeline, D3 = l3.easeReverse || g3, O3, k3, A4, j4, M4, N4, F3, I3, L3, R3, z3, B3, ee3;
    if (E3 && (!_3 || !u3) && (u3 = `none`), t3._ease = Yt2(u3, r2.ease), t3._rEase = D3 && (Yt2(D3) || t3._ease), t3._from = !E3 && !!l3.runBackwards, t3._from && (t3.ratio = 1), !E3 || _3 && !l3.stagger) {
      if (I3 = S3[0] ? _e2(S3[0]).harness : 0, B3 = I3 && l3[I3.prop], O3 = Ae2(l3, ce2), x3 && (x3._zTime < 0 && x3.progress(1), n3 < 0 && h3 && f3 && !v3 ? x3.render(-1, true) : x3.revert(h3 && y3 ? oe2 : ae2), x3._lazy = 0), d3) {
        if (Fe2(t3._startAt = Y2.set(S3, Ee2({ data: `isStart`, overwrite: false, parent: C3, immediateRender: true, lazy: !x3 && b2(p3), startAt: null, delay: 0, onUpdate: m3 && function() {
          return Dt2(t3, `onUpdate`);
        }, stagger: 0 }, d3))), t3._startAt._dp = 0, t3._startAt._sat = t3, n3 < 0 && (a2 || !f3 && !v3) && t3._startAt.revert(oe2), f3 && y3 && n3 <= 0 && o3 <= 0) {
          n3 && (t3._zTime = n3);
          return;
        }
      } else if (h3 && y3 && !x3) {
        if (n3 && (f3 = false), A4 = Ee2({ overwrite: false, data: `isFromStart`, lazy: f3 && !x3 && b2(p3), immediateRender: f3, stagger: 0, parent: C3 }, O3), B3 && (A4[I3.prop] = B3), Fe2(t3._startAt = Y2.set(S3, A4)), t3._startAt._dp = 0, t3._startAt._sat = t3, n3 < 0 && (a2 ? t3._startAt.revert(oe2) : t3._startAt.render(-1, true)), t3._zTime = n3, !f3) e27(t3._startAt, c2, c2);
        else if (!n3) return;
      }
      for (t3._pt = t3._ptCache = 0, p3 = y3 && b2(p3) || p3 && !y3, k3 = 0; k3 < S3.length; k3++) {
        if (M4 = S3[k3], F3 = M4._gsap || ge2(S3)[k3]._gsap, t3._ptLookup[k3] = R3 = {}, ue2[F3.id] && le2.length && xe2(), z3 = w3 === S3 ? k3 : w3.indexOf(M4), I3 && (L3 = new I3()).init(M4, B3 || O3, t3, z3, w3) !== false && (t3._pt = j4 = new X2(t3._pt, M4, L3.name, 0, 1, L3.render, L3, 0, L3.priority), L3._props.forEach(function(e32) {
          R3[e32] = j4;
        }), L3.priority && (N4 = 1)), !I3 || B3) for (A4 in O3) V2[A4] && (L3 = on2(A4, O3, t3, z3, M4, w3)) ? L3.priority && (N4 = 1) : R3[A4] = j4 = rn2.call(t3, M4, A4, `get`, O3[A4], z3, w3, 0, l3.stringFilter);
        t3._op && t3._op[k3] && t3.kill(M4, t3._op[k3]), T3 && t3._pt && (sn2 = t3, P2.killTweensOf(M4, R3, t3.globalTime(n3)), ee3 = !t3.parent, sn2 = 0), t3._pt && p3 && (ue2[F3.id] = 1);
      }
      N4 && On2(t3), t3._onInit && t3._onInit(t3);
    }
    t3._onUpdate = m3, t3._initted = (!t3._op || t3._pt) && !ee3, _3 && n3 <= 0 && E3.render(s2, true, true);
  };
  var un2 = function(e32, t3, n3, r3, i3, a3, o3, s3) {
    var c3 = (e32._pt && e32._ptCache || (e32._ptCache = {}))[t3], l3, u3, d3, f3;
    if (!c3) for (c3 = e32._ptCache[t3] = [], d3 = e32._ptLookup, f3 = e32._targets.length; f3--; ) {
      if (l3 = d3[f3][t3], l3 && l3.d && l3.d._pt) for (l3 = l3.d._pt; l3 && l3.p !== t3 && l3.fp !== t3; ) l3 = l3._next;
      if (!l3) return cn2 = 1, e32.vars[t3] = `+=0`, ln2(e32, o3), cn2 = 0, s3 ? ne2(t3 + ` not eligible for reset. Try splitting into individual properties`) : 1;
      c3.push(l3);
    }
    for (f3 = c3.length; f3--; ) u3 = c3[f3], l3 = u3._pt || u3, l3.s = (r3 || r3 === 0) && !i3 ? r3 : l3.s + (r3 || 0) + a3 * l3.c, l3.c = n3 - l3.s, u3.e && (u3.e = U2(n3) + G2(u3.e)), u3.b && (u3.b = l3.s + G2(u3.b));
  };
  var dn2 = function(e32, t3) {
    var n3 = e32[0] ? _e2(e32[0]).harness : 0, r3 = n3 && n3.aliases, i3, a3, o3, s3;
    if (!r3) return t3;
    for (a3 in i3 = Oe2({}, t3), r3) if (a3 in i3) for (s3 = r3[a3].split(`,`), o3 = s3.length; o3--; ) i3[s3[o3]] = i3[a3];
    return i3;
  };
  var fn2 = function(e32, t3, n3, r3) {
    var i3 = t3.ease || r3 || `power1.inOut`, a3, o3;
    if (w2(t3)) o3 = n3[e32] || (n3[e32] = []), t3.forEach(function(e33, n4) {
      return o3.push({ t: n4 / (t3.length - 1) * 100, v: e33, e: i3 });
    });
    else for (a3 in t3) o3 = n3[a3] || (n3[a3] = []), a3 === `ease` || o3.push({ t: parseFloat(e32), v: t3[a3], e: i3 });
  };
  var pn2 = function(e32, t3, n3, r3, i3) {
    return g2(e32) ? e32.call(t3, n3, r3, i3) : h2(e32) && ~e32.indexOf(`random(`) ? Ct2(e32) : e32;
  };
  var mn2 = he2 + `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`;
  var hn2 = {};
  H2(mn2 + `,id,stagger,delay,duration,paused,scrollTrigger`, function(e32) {
    return hn2[e32] = 1;
  });
  var Y2 = (function(r3) {
    t2(o3, r3);
    function o3(t3, a3, o4, s4) {
      var l3;
      typeof a3 == `number` && (o4.duration = a3, a3 = o4, o4 = null), l3 = r3.call(this, s4 ? a3 : je2(a3)) || this;
      var u3 = l3.vars, d3 = u3.duration, f3 = u3.delay, p3 = u3.immediateRender, m3 = u3.stagger, h3 = u3.overwrite, g3 = u3.keyframes, v3 = u3.defaults, x3 = u3.scrollTrigger, T3 = a3.parent || P2, E3 = (w2(t3) || C2(t3) ? _2(t3[0]) : `length` in a3) ? [t3] : ut2(t3), D3, O3, k3, A4, j4, M4, N4, F3;
      if (l3._targets = E3.length ? ge2(E3) : ne2(`GSAP target ` + t3 + ` not found. https://gsap.com`, !n2.nullTargetWarn) || [], l3._ptLookup = [], l3._overwrite = h3, g3 || m3 || S2(d3) || S2(f3)) {
        a3 = l3.vars;
        var I3 = a3.easeReverse || a3.yoyoEase;
        if (D3 = l3.timeline = new J2({ data: `nested`, defaults: v3 || {}, targets: T3 && T3.data === `nested` ? T3.vars.targets : E3 }), D3.kill(), D3.parent = D3._dp = e17(l3), D3._start = 0, m3 || S2(d3) || S2(f3)) {
          if (A4 = E3.length, N4 = m3 && pt2(m3), y2(m3)) for (j4 in m3) ~mn2.indexOf(j4) && (F3 || (F3 = {}), F3[j4] = m3[j4]);
          for (O3 = 0; O3 < A4; O3++) k3 = Ae2(a3, hn2), k3.stagger = 0, I3 && (k3.easeReverse = I3), F3 && Oe2(k3, F3), M4 = E3[O3], k3.duration = +pn2(d3, e17(l3), O3, M4, E3), k3.delay = (+pn2(f3, e17(l3), O3, M4, E3) || 0) - l3._delay, !m3 && A4 === 1 && k3.delay && (l3._delay = f3 = k3.delay, l3._start += f3, k3.delay = 0), D3.to(M4, k3, N4 ? N4(O3, M4, E3) : 0), D3._ease = q2.none;
          D3.duration() ? d3 = f3 = 0 : l3.timeline = 0;
        } else if (g3) {
          je2(Ee2(D3.vars.defaults, { ease: `none` })), D3._ease = Yt2(g3.ease || a3.ease || `none`);
          var L3 = 0, R3, z3, B3;
          if (w2(g3)) g3.forEach(function(e32) {
            return D3.to(E3, e32, `>`);
          }), D3.duration();
          else {
            for (j4 in k3 = {}, g3) j4 === `ease` || j4 === `easeEach` || fn2(j4, g3[j4], k3, g3.easeEach);
            for (j4 in k3) for (R3 = k3[j4].sort(function(e32, t4) {
              return e32.t - t4.t;
            }), L3 = 0, O3 = 0; O3 < R3.length; O3++) z3 = R3[O3], B3 = { ease: z3.e, duration: (z3.t - (O3 ? R3[O3 - 1].t : 0)) / 100 * d3 }, B3[j4] = z3.v, D3.to(E3, B3, L3), L3 += B3.duration;
            D3.duration() < d3 && D3.to({}, { duration: d3 - D3.duration() });
          }
        }
        d3 || l3.duration(d3 = D3.duration());
      } else l3.timeline = 0;
      return h3 === true && !i2 && (sn2 = e17(l3), P2.killTweensOf(E3), sn2 = 0), Ke2(T3, e17(l3), o4), a3.reversed && l3.reverse(), a3.paused && l3.paused(true), (p3 || !d3 && !g3 && l3._start === W2(T3._time) && b2(p3) && ze2(e17(l3)) && T3.data !== `nested`) && (l3._tTime = -c2, l3.render(Math.max(0, -f3) || 0)), x3 && qe2(e17(l3), x3), l3;
    }
    var s3 = o3.prototype;
    return s3.render = function(e32, t3, n3) {
      var r4 = this._time, i3 = this._tDur, a3 = this._dur, o4 = e32 < 0, s4 = e32 > i3 - c2 && !o4 ? i3 : e32 < c2 ? 0 : e32, l3, u3, d3, f3, p3, m3, h3, g3;
      if (!a3) Ze2(this, e32, t3, n3);
      else if (s4 !== this._tTime || !e32 || n3 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o4 || this._lazy) {
        if (l3 = s4, g3 = this.timeline, this._repeat) {
          if (f3 = a3 + this._rDelay, this._repeat < -1 && o4) return this.totalTime(f3 * 100 + e32, t3, n3);
          if (l3 = W2(s4 % f3), s4 === i3 ? (d3 = this._repeat, l3 = a3) : (p3 = W2(s4 / f3), d3 = ~~p3, d3 && d3 === p3 ? (l3 = a3, d3--) : l3 > a3 && (l3 = a3)), m3 = this._yoyo && d3 & 1, m3 && (l3 = a3 - l3), p3 = Ve2(this._tTime, f3), l3 === r4 && !n3 && this._initted && d3 === p3) return this._tTime = s4, this;
          d3 !== p3 && this.vars.repeatRefresh && !m3 && !this._lock && l3 !== f3 && this._initted && (this._lock = n3 = 1, this.render(W2(f3 * d3), true).invalidate()._lock = 0);
        }
        if (!this._initted) {
          if (Je2(this, o4 ? e32 : l3, n3, t3, s4)) return this._tTime = 0, this;
          if (r4 !== this._time && !(n3 && this.vars.repeatRefresh && d3 !== p3)) return this;
          if (a3 !== this._dur) return this.render(e32, t3, n3);
        }
        if (this._rEase) {
          var _3 = l3 < r4;
          if (_3 !== this._inv) {
            var v3 = _3 ? r4 : a3 - r4;
            this._inv = _3, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = r4, this._invRecip = v3 ? (_3 ? -1 : 1) / v3 : 0, this._invScale = _3 ? -this.ratio : 1 - this.ratio, this._invEase = _3 ? this._rEase : this._ease;
          }
          this.ratio = h3 = this._invRatio + this._invScale * this._invEase((l3 - this._invTime) * this._invRecip);
        } else this.ratio = h3 = this._ease(l3 / a3);
        if (this._from && (this.ratio = h3 = 1 - h3), this._tTime = s4, this._time = l3, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r4 && s4 && !t3 && !p3 && (Dt2(this, `onStart`), this._tTime !== s4)) return this;
        for (u3 = this._pt; u3; ) u3.r(h3, u3.d), u3 = u3._next;
        g3 && g3.render(e32 < 0 ? e32 : g3._dur * g3._ease(l3 / this._dur), t3, n3) || this._startAt && (this._zTime = e32), this._onUpdate && !t3 && (o4 && Re2(this, e32, t3, n3), Dt2(this, `onUpdate`)), this._repeat && d3 !== p3 && this.vars.onRepeat && !t3 && this.parent && Dt2(this, `onRepeat`), (s4 === this._tDur || !s4) && this._tTime === s4 && (o4 && !this._onUpdate && Re2(this, e32, true, true), (e32 || !a3) && (s4 === this._tDur && this._ts > 0 || !s4 && this._ts < 0) && Fe2(this, 1), !t3 && !(o4 && !r4) && (s4 || r4 || m3) && (Dt2(this, s4 === i3 ? `onComplete` : `onReverseComplete`, true), this._prom && !(s4 < i3 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, s3.targets = function() {
      return this._targets;
    }, s3.invalidate = function(e32) {
      return (!e32 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e32), r3.prototype.invalidate.call(this, e32);
    }, s3.resetTo = function(e32, t3, n3, r4, i3) {
      Bt2 || Vt2.wake(), this._ts || this.play();
      var a3 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o4;
      return this._initted || ln2(this, a3), o4 = this._ease(a3 / this._dur), un2(this, e32, t3, n3, r4, o4, a3, i3) ? this.resetTo(e32, t3, n3, r4, 1) : (We2(this, 0), this.parent || Ne2(this._dp, this, `_first`, `_last`, this._dp._sort ? `_start` : 0), this.render(0));
    }, s3.kill = function(e32, t3) {
      if (t3 === void 0 && (t3 = `all`), !e32 && (!t3 || t3 === `all`)) return this._lazy = this._pt = 0, this.parent ? Ot2(this) : this.scrollTrigger && this.scrollTrigger.kill(!!a2), this;
      if (this.timeline) {
        var n3 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(e32, t3, sn2 && sn2.vars.overwrite !== true)._first || Ot2(this), this.parent && n3 !== this.timeline.totalDuration() && $e2(this, this._dur * this.timeline._tDur / n3, 0, 1), this;
      }
      var r4 = this._targets, i3 = e32 ? ut2(e32) : r4, o4 = this._ptLookup, s4 = this._pt, c3, l3, u3, d3, f3, p3, m3;
      if ((!t3 || t3 === `all`) && Me2(r4, i3)) return t3 === `all` && (this._pt = 0), Ot2(this);
      for (c3 = this._op = this._op || [], t3 !== `all` && (h2(t3) && (f3 = {}, H2(t3, function(e33) {
        return f3[e33] = 1;
      }), t3 = f3), t3 = dn2(r4, t3)), m3 = r4.length; m3--; ) if (~i3.indexOf(r4[m3])) for (f3 in l3 = o4[m3], t3 === `all` ? (c3[m3] = t3, d3 = l3, u3 = {}) : (u3 = c3[m3] = c3[m3] || {}, d3 = t3), d3) p3 = l3 && l3[f3], p3 && ((!(`kill` in p3.d) || p3.d.kill(f3) === true) && Pe2(this, p3, `_pt`), delete l3[f3]), u3 !== `all` && (u3[f3] = 1);
      return this._initted && !this._pt && s4 && Ot2(this), this;
    }, o3.to = function(e32, t3) {
      return new o3(e32, t3, arguments[2]);
    }, o3.from = function(e32, t3) {
      return rt2(1, arguments);
    }, o3.delayedCall = function(e32, t3, n3, r4) {
      return new o3(t3, 0, { immediateRender: false, lazy: false, overwrite: false, delay: e32, onComplete: t3, onReverseComplete: t3, onCompleteParams: n3, onReverseCompleteParams: n3, callbackScope: r4 });
    }, o3.fromTo = function(e32, t3, n3) {
      return rt2(2, arguments);
    }, o3.set = function(e32, t3) {
      return t3.duration = 0, t3.repeatDelay || (t3.repeat = 0), new o3(e32, t3);
    }, o3.killTweensOf = function(e32, t3, n3) {
      return P2.killTweensOf(e32, t3, n3);
    }, o3;
  })(tn2);
  Ee2(Y2.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }), H2(`staggerTo,staggerFrom,staggerFromTo`, function(e32) {
    Y2[e32] = function() {
      var t3 = new J2(), n3 = st2.call(arguments, 0);
      return n3.splice(e32 === `staggerFromTo` ? 5 : 4, 0, 0), t3[e32].apply(t3, n3);
    };
  });
  var gn2 = function(e32, t3, n3) {
    return e32[t3] = n3;
  };
  var _n2 = function(e32, t3, n3) {
    return e32[t3](n3);
  };
  var vn2 = function(e32, t3, n3, r3) {
    return e32[t3](r3.fp, n3);
  };
  var yn2 = function(e32, t3, n3) {
    return e32.setAttribute(t3, n3);
  };
  var bn2 = function(e32, t3) {
    return g2(e32[t3]) ? _n2 : v2(e32[t3]) && e32.setAttribute ? yn2 : gn2;
  };
  var xn2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, Math.round((t3.s + t3.c * e32) * 1e6) / 1e6, t3);
  };
  var Sn2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, !!(t3.s + t3.c * e32), t3);
  };
  var Cn2 = function(e32, t3) {
    var n3 = t3._pt, r3 = ``;
    if (!e32 && t3.b) r3 = t3.b;
    else if (e32 === 1 && t3.e) r3 = t3.e;
    else {
      for (; n3; ) r3 = n3.p + (n3.m ? n3.m(n3.s + n3.c * e32) : Math.round((n3.s + n3.c * e32) * 1e4) / 1e4) + r3, n3 = n3._next;
      r3 += t3.c;
    }
    t3.set(t3.t, t3.p, r3, t3);
  };
  var wn2 = function(e32, t3) {
    for (var n3 = t3._pt; n3; ) n3.r(e32, n3.d), n3 = n3._next;
  };
  var Tn2 = function(e32, t3, n3, r3) {
    for (var i3 = this._pt, a3; i3; ) a3 = i3._next, i3.p === r3 && i3.modifier(e32, t3, n3), i3 = a3;
  };
  var En2 = function(e32) {
    for (var t3 = this._pt, n3, r3; t3; ) r3 = t3._next, t3.p === e32 && !t3.op || t3.op === e32 ? Pe2(this, t3, `_pt`) : t3.dep || (n3 = 1), t3 = r3;
    return !n3;
  };
  var Dn2 = function(e32, t3, n3, r3) {
    r3.mSet(e32, t3, r3.m.call(r3.tween, n3, r3.mt), r3);
  };
  var On2 = function(e32) {
    for (var t3 = e32._pt, n3, r3, i3, a3; t3; ) {
      for (n3 = t3._next, r3 = i3; r3 && r3.pr > t3.pr; ) r3 = r3._next;
      (t3._prev = r3 ? r3._prev : a3) ? t3._prev._next = t3 : i3 = t3, (t3._next = r3) ? r3._prev = t3 : a3 = t3, t3 = n3;
    }
    e32._pt = i3;
  };
  var X2 = (function() {
    function e32(e33, t4, n3, r3, i3, a3, o3, s3, c3) {
      this.t = t4, this.s = r3, this.c = i3, this.p = n3, this.r = a3 || xn2, this.d = o3 || this, this.set = s3 || gn2, this.pr = c3 || 0, this._next = e33, e33 && (e33._prev = this);
    }
    var t3 = e32.prototype;
    return t3.modifier = function(e33, t4, n3) {
      this.mSet = this.mSet || this.set, this.set = Dn2, this.m = e33, this.mt = n3, this.tween = t4;
    }, e32;
  })();
  H2(he2 + `parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`, function(e32) {
    return ce2[e32] = 1;
  }), R2.TweenMax = R2.TweenLite = Y2, R2.TimelineLite = R2.TimelineMax = J2, P2 = new J2({ sortChildren: false, defaults: r2, autoRemoveChildren: true, id: `root`, smoothChildTiming: true }), n2.stringFilter = zt2;
  var kn2 = [];
  var An2 = {};
  var jn2 = [];
  var Mn2 = 0;
  var Nn2 = 0;
  var Pn2 = function(e32) {
    return (An2[e32] || jn2).map(function(e33) {
      return e33();
    });
  };
  var Fn2 = function() {
    var e32 = Date.now(), t3 = [];
    e32 - Mn2 > 2 && (Pn2(`matchMediaInit`), kn2.forEach(function(e33) {
      var n3 = e33.queries, r3 = e33.conditions, i3, a3, o3, s3;
      for (a3 in n3) i3 = F2.matchMedia(n3[a3]).matches, i3 && (o3 = 1), i3 !== r3[a3] && (r3[a3] = i3, s3 = 1);
      s3 && (e33.revert(), o3 && t3.push(e33));
    }), Pn2(`matchMediaRevert`), t3.forEach(function(e33) {
      return e33.onMatch(e33, function(t4) {
        return e33.add(null, t4);
      });
    }), Mn2 = e32, Pn2(`matchMedia`));
  };
  var In2 = (function() {
    function e32(e33, t4) {
      this.selector = t4 && dt2(t4), this.data = [], this._r = [], this.isReverted = false, this.id = Nn2++, e33 && this.add(e33);
    }
    var t3 = e32.prototype;
    return t3.add = function(e33, t4, n3) {
      g2(e33) && (n3 = t4, t4 = e33, e33 = g2);
      var r3 = this, i3 = function() {
        var e34 = o2, i4 = r3.selector, a3;
        return e34 && e34 !== r3 && e34.data.push(r3), n3 && (r3.selector = dt2(n3)), o2 = r3, a3 = t4.apply(r3, arguments), g2(a3) && r3._r.push(a3), o2 = e34, r3.selector = i4, r3.isReverted = false, a3;
      };
      return r3.last = i3, e33 === g2 ? i3(r3, function(e34) {
        return r3.add(null, e34);
      }) : e33 ? r3[e33] = i3 : i3;
    }, t3.ignore = function(e33) {
      var t4 = o2;
      o2 = null, e33(this), o2 = t4;
    }, t3.getTweens = function() {
      var t4 = [];
      return this.data.forEach(function(n3) {
        return n3 instanceof e32 ? t4.push.apply(t4, n3.getTweens()) : n3 instanceof Y2 && !(n3.parent && n3.parent.data === `nested`) && t4.push(n3);
      }), t4;
    }, t3.clear = function() {
      this._r.length = this.data.length = 0;
    }, t3.kill = function(e33, t4) {
      var n3 = this;
      if (e33 ? (function() {
        for (var t5 = n3.getTweens(), r4 = n3.data.length, i3; r4--; ) i3 = n3.data[r4], i3.data === `isFlip` && (i3.revert(), i3.getChildren(true, true, false).forEach(function(e34) {
          return t5.splice(t5.indexOf(e34), 1);
        }));
        for (t5.map(function(e34) {
          return { g: e34._dur || e34._delay || e34._sat && !e34._sat.vars.immediateRender ? e34.globalTime(0) : -1 / 0, t: e34 };
        }).sort(function(e34, t6) {
          return t6.g - e34.g || -1 / 0;
        }).forEach(function(t6) {
          return t6.t.revert(e33);
        }), r4 = n3.data.length; r4--; ) i3 = n3.data[r4], i3 instanceof J2 ? i3.data !== `nested` && (i3.scrollTrigger && i3.scrollTrigger.revert(), i3.kill()) : !(i3 instanceof Y2) && i3.revert && i3.revert(e33);
        n3._r.forEach(function(t6) {
          return t6(e33, n3);
        }), n3.isReverted = true;
      })() : this.data.forEach(function(e34) {
        return e34.kill && e34.kill();
      }), this.clear(), t4) for (var r3 = kn2.length; r3--; ) kn2[r3].id === this.id && kn2.splice(r3, 1);
    }, t3.revert = function(e33) {
      this.kill(e33 || {});
    }, e32;
  })();
  var Ln2 = (function() {
    function e32(e33) {
      this.contexts = [], this.scope = e33, o2 && o2.data.push(this);
    }
    var t3 = e32.prototype;
    return t3.add = function(e33, t4, n3) {
      y2(e33) || (e33 = { matches: e33 });
      var r3 = new In2(0, n3 || this.scope), i3 = r3.conditions = {}, a3, s3, c3;
      for (s3 in o2 && !r3.selector && (r3.selector = o2.selector), this.contexts.push(r3), t4 = r3.add(`onMatch`, t4), r3.queries = e33, e33) s3 === `all` ? c3 = 1 : (a3 = F2.matchMedia(e33[s3]), a3 && (kn2.indexOf(r3) < 0 && kn2.push(r3), (i3[s3] = a3.matches) && (c3 = 1), a3.addListener ? a3.addListener(Fn2) : a3.addEventListener(`change`, Fn2)));
      return c3 && t4(r3, function(e34) {
        return r3.add(null, e34);
      }), this;
    }, t3.revert = function(e33) {
      this.kill(e33 || {});
    }, t3.kill = function(e33) {
      this.contexts.forEach(function(t4) {
        return t4.kill(e33, true);
      });
    }, e32;
  })();
  var Rn2 = { registerPlugin: function() {
    [...arguments].forEach(function(e32) {
      return jt2(e32);
    });
  }, timeline: function(e32) {
    return new J2(e32);
  }, getTweensOf: function(e32, t3) {
    return P2.getTweensOf(e32, t3);
  }, getProperty: function(e32, t3, n3, r3) {
    h2(e32) && (e32 = ut2(e32)[0]);
    var i3 = _e2(e32 || {}).get, a3 = n3 ? Te2 : we2;
    return n3 === `native` && (n3 = ``), e32 && (t3 ? a3((V2[t3] && V2[t3].get || i3)(e32, t3, n3, r3)) : function(t4, n4, r4) {
      return a3((V2[t4] && V2[t4].get || i3)(e32, t4, n4, r4));
    });
  }, quickSetter: function(e32, t3, n3) {
    if (e32 = ut2(e32), e32.length > 1) {
      var r3 = e32.map(function(e33) {
        return Z2.quickSetter(e33, t3, n3);
      }), i3 = r3.length;
      return function(e33) {
        for (var t4 = i3; t4--; ) r3[t4](e33);
      };
    }
    e32 = e32[0] || {};
    var a3 = V2[t3], o3 = _e2(e32), s3 = o3.harness && (o3.harness.aliases || {})[t3] || t3, c3 = a3 ? function(t4) {
      var r4 = new a3();
      kt2._pt = 0, r4.init(e32, n3 ? t4 + n3 : t4, kt2, 0, [e32]), r4.render(1, r4), kt2._pt && wn2(1, kt2);
    } : o3.set(e32, s3);
    return a3 ? c3 : function(t4) {
      return c3(e32, s3, n3 ? t4 + n3 : t4, o3, 1);
    };
  }, quickTo: function(e32, t3, n3) {
    var r3, i3 = Z2.to(e32, Ee2((r3 = {}, r3[t3] = `+=0.1`, r3.paused = true, r3.stagger = 0, r3), n3 || {})), a3 = function(e33, n4, r4) {
      return i3.resetTo(t3, e33, n4, r4);
    };
    return a3.tween = i3, a3;
  }, isTweening: function(e32) {
    return P2.getTweensOf(e32, true).length > 0;
  }, defaults: function(e32) {
    return e32 && e32.ease && (e32.ease = Yt2(e32.ease, r2.ease)), ke2(r2, e32 || {});
  }, config: function(e32) {
    return ke2(n2, e32 || {});
  }, registerEffect: function(e32) {
    var t3 = e32.name, n3 = e32.effect, r3 = e32.plugins, i3 = e32.defaults, a3 = e32.extendTimeline;
    (r3 || ``).split(`,`).forEach(function(e33) {
      return e33 && !V2[e33] && !R2[e33] && ne2(t3 + ` effect requires ` + e33 + ` plugin.`);
    }), fe2[t3] = function(e33, t4, r4) {
      return n3(ut2(e33), Ee2(t4 || {}, i3), r4);
    }, a3 && (J2.prototype[t3] = function(e33, n4, r4) {
      return this.add(fe2[t3](e33, y2(n4) ? n4 : (r4 = n4) && {}, this), r4);
    });
  }, registerEase: function(e32, t3) {
    q2[e32] = Yt2(t3);
  }, parseEase: function(e32, t3) {
    return arguments.length ? Yt2(e32, t3) : q2;
  }, getById: function(e32) {
    return P2.getById(e32);
  }, exportRoot: function(e32, t3) {
    e32 === void 0 && (e32 = {});
    var n3 = new J2(e32), r3, i3;
    for (n3.smoothChildTiming = b2(e32.smoothChildTiming), P2.remove(n3), n3._dp = 0, n3._time = n3._tTime = P2._time, r3 = P2._first; r3; ) i3 = r3._next, (t3 || !(!r3._dur && r3 instanceof Y2 && r3.vars.onComplete === r3._targets[0])) && Ke2(n3, r3, r3._start - r3._delay), r3 = i3;
    return Ke2(P2, n3, 0), n3;
  }, context: function(e32, t3) {
    return e32 ? new In2(e32, t3) : o2;
  }, matchMedia: function(e32) {
    return new Ln2(e32);
  }, matchMediaRefresh: function() {
    return kn2.forEach(function(e32) {
      var t3 = e32.conditions, n3, r3;
      for (r3 in t3) t3[r3] && (t3[r3] = false, n3 = 1);
      n3 && e32.revert();
    }) || Fn2();
  }, addEventListener: function(e32, t3) {
    var n3 = An2[e32] || (An2[e32] = []);
    ~n3.indexOf(t3) || n3.push(t3);
  }, removeEventListener: function(e32, t3) {
    var n3 = An2[e32], r3 = n3 && n3.indexOf(t3);
    r3 >= 0 && n3.splice(r3, 1);
  }, utils: { wrap: xt2, wrapYoyo: St2, distribute: pt2, random: gt2, snap: ht2, normalize: yt2, getUnit: G2, clamp: ot2, splitColor: Pt2, toArray: ut2, selector: dt2, mapRange: wt2, pipe: _t2, unitize: vt2, interpolate: Tt2, shuffle: ft2 }, install: ee2, effects: fe2, ticker: Vt2, updateRoot: J2.updateRoot, plugins: V2, globalTimeline: P2, core: { PropTween: X2, globals: re2, Tween: Y2, Timeline: J2, Animation: tn2, getCache: _e2, _removeLinkedListItem: Pe2, reverting: function() {
    return a2;
  }, context: function(e32) {
    return e32 && o2 && (o2.data.push(e32), e32._ctx = o2), o2;
  }, suppressOverwrites: function(e32) {
    return i2 = e32;
  } } };
  H2(`to,from,fromTo,delayedCall,set,killTweensOf`, function(e32) {
    return Rn2[e32] = Y2[e32];
  }), Vt2.add(J2.updateRoot), kt2 = Rn2.to({}, { duration: 0 });
  var zn2 = function(e32, t3) {
    for (var n3 = e32._pt; n3 && n3.p !== t3 && n3.op !== t3 && n3.fp !== t3; ) n3 = n3._next;
    return n3;
  };
  var Bn2 = function(e32, t3) {
    var n3 = e32._targets, r3, i3, a3;
    for (r3 in t3) for (i3 = n3.length; i3--; ) a3 = e32._ptLookup[i3][r3], a3 && (a3 = a3.d) && (a3._pt && (a3 = zn2(a3, r3)), a3 && a3.modifier && a3.modifier(t3[r3], e32, n3[i3], r3));
  };
  var Vn2 = function(e32, t3) {
    return { name: e32, headless: 1, rawVars: 1, init: function(e33, n3, r3) {
      r3._onInit = function(e34) {
        var r4, i3;
        if (h2(n3) && (r4 = {}, H2(n3, function(e35) {
          return r4[e35] = 1;
        }), n3 = r4), t3) {
          for (i3 in r4 = {}, n3) r4[i3] = t3(n3[i3]);
          n3 = r4;
        }
        Bn2(e34, n3);
      };
    } };
  };
  var Z2 = Rn2.registerPlugin({ name: `attr`, init: function(e32, t3, n3, r3, i3) {
    var a3, o3, s3;
    for (a3 in this.tween = n3, t3) s3 = e32.getAttribute(a3) || ``, o3 = this.add(e32, `setAttribute`, (s3 || 0) + ``, t3[a3], r3, i3, 0, 0, a3), o3.op = a3, o3.b = s3, this._props.push(a3);
  }, render: function(e32, t3) {
    for (var n3 = t3._pt; n3; ) a2 ? n3.set(n3.t, n3.p, n3.b, n3) : n3.r(e32, n3.d), n3 = n3._next;
  } }, { name: `endArray`, headless: 1, init: function(e32, t3) {
    for (var n3 = t3.length; n3--; ) this.add(e32, n3, e32[n3] || 0, t3[n3], 0, 0, 0, 0, 0, 1);
  } }, Vn2(`roundProps`, mt2), Vn2(`modifiers`), Vn2(`snap`, ht2)) || Rn2;
  Y2.version = J2.version = Z2.version = `3.15.0`, B2 = 1, x2() && Ht2(), q2.Power0, q2.Power1, q2.Power2, q2.Power3, q2.Power4, q2.Linear, q2.Quad, q2.Cubic, q2.Quart, q2.Quint, q2.Strong, q2.Elastic, q2.Back, q2.SteppedEase, q2.Bounce, q2.Sine, q2.Expo, q2.Circ;
  var Hn2;
  var Un2;
  var Wn2;
  var Gn2;
  var Kn2;
  var qn2;
  var Jn2;
  var Yn2 = function() {
    return typeof window < `u`;
  };
  var Xn2 = {};
  var Zn2 = 180 / Math.PI;
  var Qn2 = Math.PI / 180;
  var $n2 = Math.atan2;
  var er2 = 1e8;
  var tr2 = /([A-Z])/g;
  var nr2 = /(left|right|width|margin|padding|x)/i;
  var rr2 = /[\s,\(]\S/;
  var ir2 = { autoAlpha: `opacity,visibility`, scale: `scaleX,scaleY`, alpha: `opacity` };
  var ar2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, Math.round((t3.s + t3.c * e32) * 1e4) / 1e4 + t3.u, t3);
  };
  var or2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, e32 === 1 ? t3.e : Math.round((t3.s + t3.c * e32) * 1e4) / 1e4 + t3.u, t3);
  };
  var sr2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, e32 ? Math.round((t3.s + t3.c * e32) * 1e4) / 1e4 + t3.u : t3.b, t3);
  };
  var cr2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, e32 === 1 ? t3.e : e32 ? Math.round((t3.s + t3.c * e32) * 1e4) / 1e4 + t3.u : t3.b, t3);
  };
  var lr2 = function(e32, t3) {
    var n3 = t3.s + t3.c * e32;
    t3.set(t3.t, t3.p, ~~(n3 + (n3 < 0 ? -0.5 : 0.5)) + t3.u, t3);
  };
  var ur2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, e32 ? t3.e : t3.b, t3);
  };
  var dr2 = function(e32, t3) {
    return t3.set(t3.t, t3.p, e32 === 1 ? t3.e : t3.b, t3);
  };
  var fr2 = function(e32, t3, n3) {
    return e32.style[t3] = n3;
  };
  var pr2 = function(e32, t3, n3) {
    return e32.style.setProperty(t3, n3);
  };
  var mr2 = function(e32, t3, n3) {
    return e32._gsap[t3] = n3;
  };
  var hr2 = function(e32, t3, n3) {
    return e32._gsap.scaleX = e32._gsap.scaleY = n3;
  };
  var gr2 = function(e32, t3, n3, r3, i3) {
    var a3 = e32._gsap;
    a3.scaleX = a3.scaleY = n3, a3.renderTransform(i3, a3);
  };
  var _r2 = function(e32, t3, n3, r3, i3) {
    var a3 = e32._gsap;
    a3[t3] = n3, a3.renderTransform(i3, a3);
  };
  var Q2 = `transform`;
  var $2 = Q2 + `Origin`;
  var vr2 = function e28(t3, n3) {
    var r3 = this, i3 = this.target, a3 = i3.style, o3 = i3._gsap;
    if (t3 in Xn2 && a3) {
      if (this.tfm = this.tfm || {}, t3 !== `transform`) t3 = ir2[t3] || t3, ~t3.indexOf(`,`) ? t3.split(`,`).forEach(function(e32) {
        return r3.tfm[e32] = Lr2(i3, e32);
      }) : this.tfm[t3] = o3.x ? o3[t3] : Lr2(i3, t3), t3 === $2 && (this.tfm.zOrigin = o3.zOrigin);
      else return ir2.transform.split(`,`).forEach(function(t4) {
        return e28.call(r3, t4, n3);
      });
      if (this.props.indexOf(Q2) >= 0) return;
      o3.svg && (this.svgo = i3.getAttribute(`data-svg-origin`), this.props.push($2, n3, ``)), t3 = Q2;
    }
    (a3 || n3) && this.props.push(t3, n3, a3[t3]);
  };
  var yr2 = function(e32) {
    e32.translate && (e32.removeProperty(`translate`), e32.removeProperty(`scale`), e32.removeProperty(`rotate`));
  };
  var br2 = function() {
    var e32 = this.props, t3 = this.target, n3 = t3.style, r3 = t3._gsap, i3, a3;
    for (i3 = 0; i3 < e32.length; i3 += 3) e32[i3 + 1] ? e32[i3 + 1] === 2 ? t3[e32[i3]](e32[i3 + 2]) : t3[e32[i3]] = e32[i3 + 2] : e32[i3 + 2] ? n3[e32[i3]] = e32[i3 + 2] : n3.removeProperty(e32[i3].substr(0, 2) === `--` ? e32[i3] : e32[i3].replace(tr2, `-$1`).toLowerCase());
    if (this.tfm) {
      for (a3 in this.tfm) r3[a3] = this.tfm[a3];
      r3.svg && (r3.renderTransform(), t3.setAttribute(`data-svg-origin`, this.svgo || ``)), i3 = Jn2(), (!i3 || !i3.isStart) && !n3[Q2] && (yr2(n3), r3.zOrigin && n3[$2] && (n3[$2] += ` ` + r3.zOrigin + `px`, r3.zOrigin = 0, r3.renderTransform()), r3.uncache = 1);
    }
  };
  var xr2 = function(e32, t3) {
    var n3 = { target: e32, props: [], revert: br2, save: vr2 };
    return e32._gsap || Z2.core.getCache(e32), t3 && e32.style && e32.nodeType && t3.split(`,`).forEach(function(e33) {
      return n3.save(e33);
    }), n3;
  };
  var Sr2;
  var Cr2 = function(e32, t3) {
    var n3 = Un2.createElementNS ? Un2.createElementNS((t3 || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`), e32) : Un2.createElement(e32);
    return n3 && n3.style ? n3 : Un2.createElement(e32);
  };
  var wr2 = function e29(t3, n3, r3) {
    var i3 = getComputedStyle(t3);
    return i3[n3] || i3.getPropertyValue(n3.replace(tr2, `-$1`).toLowerCase()) || i3.getPropertyValue(n3) || !r3 && e29(t3, Er2(n3) || n3, 1) || ``;
  };
  var Tr2 = `O,Moz,ms,Ms,Webkit`.split(`,`);
  var Er2 = function(e32, t3, n3) {
    var r3 = (t3 || Kn2).style, i3 = 5;
    if (e32 in r3 && !n3) return e32;
    for (e32 = e32.charAt(0).toUpperCase() + e32.substr(1); i3-- && !(Tr2[i3] + e32 in r3); ) ;
    return i3 < 0 ? null : (i3 === 3 ? `ms` : i3 >= 0 ? Tr2[i3] : ``) + e32;
  };
  var Dr2 = function() {
    Yn2() && window.document && (Hn2 = window, Un2 = Hn2.document, Wn2 = Un2.documentElement, Kn2 = Cr2(`div`) || { style: {} }, Cr2(`div`), Q2 = Er2(Q2), $2 = Q2 + `Origin`, Kn2.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`, Sr2 = !!Er2(`perspective`), Jn2 = Z2.core.reverting, Gn2 = 1);
  };
  var Or2 = function(e32) {
    var t3 = e32.ownerSVGElement, n3 = Cr2(`svg`, t3 && t3.getAttribute(`xmlns`) || `http://www.w3.org/2000/svg`), r3 = e32.cloneNode(true), i3;
    r3.style.display = `block`, n3.appendChild(r3), Wn2.appendChild(n3);
    try {
      i3 = r3.getBBox();
    } catch {
    }
    return n3.removeChild(r3), Wn2.removeChild(n3), i3;
  };
  var kr2 = function(e32, t3) {
    for (var n3 = t3.length; n3--; ) if (e32.hasAttribute(t3[n3])) return e32.getAttribute(t3[n3]);
  };
  var Ar2 = function(e32) {
    var t3, n3;
    try {
      t3 = e32.getBBox();
    } catch {
      t3 = Or2(e32), n3 = 1;
    }
    return t3 && (t3.width || t3.height) || n3 || (t3 = Or2(e32)), t3 && !t3.width && !t3.x && !t3.y ? { x: +kr2(e32, [`x`, `cx`, `x1`]) || 0, y: +kr2(e32, [`y`, `cy`, `y1`]) || 0, width: 0, height: 0 } : t3;
  };
  var jr2 = function(e32) {
    return !!(e32.getCTM && (!e32.parentNode || e32.ownerSVGElement) && Ar2(e32));
  };
  var Mr2 = function(e32, t3) {
    if (t3) {
      var n3 = e32.style, r3;
      t3 in Xn2 && t3 !== $2 && (t3 = Q2), n3.removeProperty ? (r3 = t3.substr(0, 2), (r3 === `ms` || t3.substr(0, 6) === `webkit`) && (t3 = `-` + t3), n3.removeProperty(r3 === `--` ? t3 : t3.replace(tr2, `-$1`).toLowerCase())) : n3.removeAttribute(t3);
    }
  };
  var Nr2 = function(e32, t3, n3, r3, i3, a3) {
    var o3 = new X2(e32._pt, t3, n3, 0, 1, a3 ? dr2 : ur2);
    return e32._pt = o3, o3.b = r3, o3.e = i3, e32._props.push(n3), o3;
  };
  var Pr2 = { deg: 1, rad: 1, turn: 1 };
  var Fr2 = { grid: 1, flex: 1 };
  var Ir2 = function e30(t3, n3, r3, i3) {
    var a3 = parseFloat(r3) || 0, o3 = (r3 + ``).trim().substr((a3 + ``).length) || `px`, s3 = Kn2.style, c3 = nr2.test(n3), l3 = t3.tagName.toLowerCase() === `svg`, u3 = (l3 ? `client` : `offset`) + (c3 ? `Width` : `Height`), d3 = 100, f3 = i3 === `px`, p3 = i3 === `%`, m3, h3, g3, _3;
    if (i3 === o3 || !a3 || Pr2[i3] || Pr2[o3]) return a3;
    if (o3 !== `px` && !f3 && (a3 = e30(t3, n3, r3, `px`)), _3 = t3.getCTM && jr2(t3), (p3 || o3 === `%`) && (Xn2[n3] || ~n3.indexOf(`adius`))) return m3 = _3 ? t3.getBBox()[c3 ? `width` : `height`] : t3[u3], U2(p3 ? a3 / m3 * d3 : a3 / 100 * m3);
    if (s3[c3 ? `width` : `height`] = d3 + (f3 ? o3 : i3), h3 = i3 !== `rem` && ~n3.indexOf(`adius`) || i3 === `em` && t3.appendChild && !l3 ? t3 : t3.parentNode, _3 && (h3 = (t3.ownerSVGElement || {}).parentNode), (!h3 || h3 === Un2 || !h3.appendChild) && (h3 = Un2.body), g3 = h3._gsap, g3 && p3 && g3.width && c3 && g3.time === Vt2.time && !g3.uncache) return U2(a3 / g3.width * d3);
    if (p3 && (n3 === `height` || n3 === `width`)) {
      var v3 = t3.style[n3];
      t3.style[n3] = d3 + i3, m3 = t3[u3], v3 ? t3.style[n3] = v3 : Mr2(t3, n3);
    } else (p3 || o3 === `%`) && !Fr2[wr2(h3, `display`)] && (s3.position = wr2(t3, `position`)), h3 === t3 && (s3.position = `static`), h3.appendChild(Kn2), m3 = Kn2[u3], h3.removeChild(Kn2), s3.position = `absolute`;
    return c3 && p3 && (g3 = _e2(h3), g3.time = Vt2.time, g3.width = h3[u3]), U2(f3 ? m3 * a3 / d3 : m3 && a3 ? d3 / m3 * a3 : 0);
  };
  var Lr2 = function(e32, t3, n3, r3) {
    var i3;
    return Gn2 || Dr2(), t3 in ir2 && t3 !== `transform` && (t3 = ir2[t3], ~t3.indexOf(`,`) && (t3 = t3.split(`,`)[0])), Xn2[t3] && t3 !== `transform` ? (i3 = Yr2(e32, r3), i3 = t3 === `transformOrigin` ? i3.svg ? i3.origin : Xr2(wr2(e32, $2)) + ` ` + i3.zOrigin + `px` : i3[t3]) : (i3 = e32.style[t3], (!i3 || i3 === `auto` || r3 || ~(i3 + ``).indexOf(`calc(`)) && (i3 = Hr2[t3] && Hr2[t3](e32, t3, n3) || wr2(e32, t3) || ve2(e32, t3) || +(t3 === `opacity`))), n3 && !~(i3 + ``).trim().indexOf(` `) ? Ir2(e32, t3, i3, n3) + n3 : i3;
  };
  var Rr2 = function(e32, t3, r3, i3) {
    if (!r3 || r3 === `none`) {
      var a3 = Er2(t3, e32, 1), o3 = a3 && wr2(e32, a3, 1);
      o3 && o3 !== r3 ? (t3 = a3, r3 = o3) : t3 === `borderColor` && (r3 = wr2(e32, `borderTopColor`));
    }
    var s3 = new X2(this._pt, e32.style, t3, 0, 1, Cn2), c3 = 0, l3 = 0, u3, d3, f3, p3, m3, h3, g3, _3, v3, y3, b3, x3;
    if (s3.b = r3, s3.e = i3, r3 += ``, i3 += ``, i3.substring(0, 6) === `var(--` && (i3 = wr2(e32, i3.substring(4, i3.indexOf(`)`)))), i3 === `auto` && (h3 = e32.style[t3], e32.style[t3] = i3, i3 = wr2(e32, t3) || i3, h3 ? e32.style[t3] = h3 : Mr2(e32, t3)), u3 = [r3, i3], zt2(u3), r3 = u3[0], i3 = u3[1], f3 = r3.match(k2) || [], x3 = i3.match(k2) || [], x3.length) {
      for (; d3 = k2.exec(i3); ) g3 = d3[0], v3 = i3.substring(c3, d3.index), m3 ? m3 = (m3 + 1) % 5 : (v3.substr(-5) === `rgba(` || v3.substr(-5) === `hsla(`) && (m3 = 1), g3 !== (h3 = f3[l3++] || ``) && (p3 = parseFloat(h3) || 0, b3 = h3.substr((p3 + ``).length), g3.charAt(1) === `=` && (g3 = ye2(p3, g3) + b3), _3 = parseFloat(g3), y3 = g3.substr((_3 + ``).length), c3 = k2.lastIndex - y3.length, y3 || (y3 = y3 || n2.units[t3] || b3, c3 === i3.length && (i3 += y3, s3.e += y3)), b3 !== y3 && (p3 = Ir2(e32, t3, h3, y3) || 0), s3._pt = { _next: s3._pt, p: v3 || l3 === 1 ? v3 : `,`, s: p3, c: _3 - p3, m: m3 && m3 < 4 || t3 === `zIndex` ? Math.round : 0 });
      s3.c = c3 < i3.length ? i3.substring(c3, i3.length) : ``;
    } else s3.r = t3 === `display` && i3 === `none` ? dr2 : ur2;
    return j2.test(i3) && (s3.e = 0), this._pt = s3, s3;
  };
  var zr2 = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` };
  var Br2 = function(e32) {
    var t3 = e32.split(` `), n3 = t3[0], r3 = t3[1] || `50%`;
    return (n3 === `top` || n3 === `bottom` || r3 === `left` || r3 === `right`) && (e32 = n3, n3 = r3, r3 = e32), t3[0] = zr2[n3] || n3, t3[1] = zr2[r3] || r3, t3.join(` `);
  };
  var Vr2 = function(e32, t3) {
    if (t3.tween && t3.tween._time === t3.tween._dur) {
      var n3 = t3.t, r3 = n3.style, i3 = t3.u, a3 = n3._gsap, o3, s3, c3;
      if (i3 === `all` || i3 === true) r3.cssText = ``, s3 = 1;
      else for (i3 = i3.split(`,`), c3 = i3.length; --c3 > -1; ) o3 = i3[c3], Xn2[o3] && (s3 = 1, o3 = o3 === `transformOrigin` ? $2 : Q2), Mr2(n3, o3);
      s3 && (Mr2(n3, Q2), a3 && (a3.svg && n3.removeAttribute(`transform`), r3.scale = r3.rotate = r3.translate = `none`, Yr2(n3, 1), a3.uncache = 1, yr2(r3)));
    }
  };
  var Hr2 = { clearProps: function(e32, t3, n3, r3, i3) {
    if (i3.data !== `isFromStart`) {
      var a3 = e32._pt = new X2(e32._pt, t3, n3, 0, 0, Vr2);
      return a3.u = r3, a3.pr = -10, a3.tween = i3, e32._props.push(n3), 1;
    }
  } };
  var Ur2 = [1, 0, 0, 1, 0, 0];
  var Wr2 = {};
  var Gr2 = function(e32) {
    return e32 === `matrix(1, 0, 0, 1, 0, 0)` || e32 === `none` || !e32;
  };
  var Kr2 = function(e32) {
    var t3 = wr2(e32, Q2);
    return Gr2(t3) ? Ur2 : t3.substr(7).match(O2).map(U2);
  };
  var qr2 = function(e32, t3) {
    var n3 = e32._gsap || _e2(e32), r3 = e32.style, i3 = Kr2(e32), a3, o3, s3, c3;
    return n3.svg && e32.getAttribute(`transform`) ? (s3 = e32.transform.baseVal.consolidate().matrix, i3 = [s3.a, s3.b, s3.c, s3.d, s3.e, s3.f], i3.join(`,`) === `1,0,0,1,0,0` ? Ur2 : i3) : (i3 === Ur2 && !e32.offsetParent && e32 !== Wn2 && !n3.svg && (s3 = r3.display, r3.display = `block`, a3 = e32.parentNode, (!a3 || !e32.offsetParent && !e32.getBoundingClientRect().width) && (c3 = 1, o3 = e32.nextElementSibling, Wn2.appendChild(e32)), i3 = Kr2(e32), s3 ? r3.display = s3 : Mr2(e32, `display`), c3 && (o3 ? a3.insertBefore(e32, o3) : a3 ? a3.appendChild(e32) : Wn2.removeChild(e32))), t3 && i3.length > 6 ? [i3[0], i3[1], i3[4], i3[5], i3[12], i3[13]] : i3);
  };
  var Jr2 = function(e32, t3, n3, r3, i3, a3) {
    var o3 = e32._gsap, s3 = i3 || qr2(e32, true), c3 = o3.xOrigin || 0, l3 = o3.yOrigin || 0, u3 = o3.xOffset || 0, d3 = o3.yOffset || 0, f3 = s3[0], p3 = s3[1], m3 = s3[2], h3 = s3[3], g3 = s3[4], _3 = s3[5], v3 = t3.split(` `), y3 = parseFloat(v3[0]) || 0, b3 = parseFloat(v3[1]) || 0, x3, S3, C3, w3;
    n3 ? s3 !== Ur2 && (S3 = f3 * h3 - p3 * m3) && (C3 = h3 / S3 * y3 + b3 * (-m3 / S3) + (m3 * _3 - h3 * g3) / S3, w3 = y3 * (-p3 / S3) + f3 / S3 * b3 - (f3 * _3 - p3 * g3) / S3, y3 = C3, b3 = w3) : (x3 = Ar2(e32), y3 = x3.x + (~v3[0].indexOf(`%`) ? y3 / 100 * x3.width : y3), b3 = x3.y + (~(v3[1] || v3[0]).indexOf(`%`) ? b3 / 100 * x3.height : b3)), r3 || r3 !== false && o3.smooth ? (g3 = y3 - c3, _3 = b3 - l3, o3.xOffset = u3 + (g3 * f3 + _3 * m3) - g3, o3.yOffset = d3 + (g3 * p3 + _3 * h3) - _3) : o3.xOffset = o3.yOffset = 0, o3.xOrigin = y3, o3.yOrigin = b3, o3.smooth = !!r3, o3.origin = t3, o3.originIsAbsolute = !!n3, e32.style[$2] = `0px 0px`, a3 && (Nr2(a3, o3, `xOrigin`, c3, y3), Nr2(a3, o3, `yOrigin`, l3, b3), Nr2(a3, o3, `xOffset`, u3, o3.xOffset), Nr2(a3, o3, `yOffset`, d3, o3.yOffset)), e32.setAttribute(`data-svg-origin`, y3 + ` ` + b3);
  };
  var Yr2 = function(e32, t3) {
    var r3 = e32._gsap || new en2(e32);
    if (`x` in r3 && !t3 && !r3.uncache) return r3;
    var i3 = e32.style, a3 = r3.scaleX < 0, o3 = `px`, s3 = `deg`, c3 = getComputedStyle(e32), l3 = wr2(e32, $2) || `0`, u3 = d3 = f3 = h3 = g3 = _3 = v3 = y3 = b3 = 0, d3, f3, p3 = m3 = 1, m3, h3, g3, _3, v3, y3, b3, x3, S3, C3, w3, T3, E3, D3, O3, k3, A4, j4, M4, N4, P3, F3, I3, L3, R3, z3, B3, ee3;
    return r3.svg = !!(e32.getCTM && jr2(e32)), c3.translate && ((c3.translate !== `none` || c3.scale !== `none` || c3.rotate !== `none`) && (i3[Q2] = (c3.translate === `none` ? `` : `translate3d(` + (c3.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) + `) `) + (c3.rotate === `none` ? `` : `rotate(` + c3.rotate + `) `) + (c3.scale === `none` ? `` : `scale(` + c3.scale.split(` `).join(`,`) + `) `) + (c3[Q2] === `none` ? `` : c3[Q2])), i3.scale = i3.rotate = i3.translate = `none`), C3 = qr2(e32, r3.svg), r3.svg && (r3.uncache ? (P3 = e32.getBBox(), l3 = r3.xOrigin - P3.x + `px ` + (r3.yOrigin - P3.y) + `px`, N4 = ``) : N4 = !t3 && e32.getAttribute(`data-svg-origin`), Jr2(e32, N4 || l3, !!N4 || r3.originIsAbsolute, r3.smooth !== false, C3)), x3 = r3.xOrigin || 0, S3 = r3.yOrigin || 0, C3 !== Ur2 && (D3 = C3[0], O3 = C3[1], k3 = C3[2], A4 = C3[3], u3 = j4 = C3[4], d3 = M4 = C3[5], C3.length === 6 ? (p3 = Math.sqrt(D3 * D3 + O3 * O3), m3 = Math.sqrt(A4 * A4 + k3 * k3), h3 = D3 || O3 ? $n2(O3, D3) * Zn2 : 0, v3 = k3 || A4 ? $n2(k3, A4) * Zn2 + h3 : 0, v3 && (m3 *= Math.abs(Math.cos(v3 * Qn2))), r3.svg && (u3 -= x3 - (x3 * D3 + S3 * k3), d3 -= S3 - (x3 * O3 + S3 * A4))) : (ee3 = C3[6], z3 = C3[7], I3 = C3[8], L3 = C3[9], R3 = C3[10], B3 = C3[11], u3 = C3[12], d3 = C3[13], f3 = C3[14], w3 = $n2(ee3, R3), g3 = w3 * Zn2, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N4 = j4 * T3 + I3 * E3, P3 = M4 * T3 + L3 * E3, F3 = ee3 * T3 + R3 * E3, I3 = j4 * -E3 + I3 * T3, L3 = M4 * -E3 + L3 * T3, R3 = ee3 * -E3 + R3 * T3, B3 = z3 * -E3 + B3 * T3, j4 = N4, M4 = P3, ee3 = F3), w3 = $n2(-k3, R3), _3 = w3 * Zn2, w3 && (T3 = Math.cos(-w3), E3 = Math.sin(-w3), N4 = D3 * T3 - I3 * E3, P3 = O3 * T3 - L3 * E3, F3 = k3 * T3 - R3 * E3, B3 = A4 * E3 + B3 * T3, D3 = N4, O3 = P3, k3 = F3), w3 = $n2(O3, D3), h3 = w3 * Zn2, w3 && (T3 = Math.cos(w3), E3 = Math.sin(w3), N4 = D3 * T3 + O3 * E3, P3 = j4 * T3 + M4 * E3, O3 = O3 * T3 - D3 * E3, M4 = M4 * T3 - j4 * E3, D3 = N4, j4 = P3), g3 && Math.abs(g3) + Math.abs(h3) > 359.9 && (g3 = h3 = 0, _3 = 180 - _3), p3 = U2(Math.sqrt(D3 * D3 + O3 * O3 + k3 * k3)), m3 = U2(Math.sqrt(M4 * M4 + ee3 * ee3)), w3 = $n2(j4, M4), v3 = Math.abs(w3) > 2e-4 ? w3 * Zn2 : 0, b3 = B3 ? 1 / (B3 < 0 ? -B3 : B3) : 0), r3.svg && (N4 = e32.getAttribute(`transform`), r3.forceCSS = e32.setAttribute(`transform`, ``) || !Gr2(wr2(e32, Q2)), N4 && e32.setAttribute(`transform`, N4))), Math.abs(v3) > 90 && Math.abs(v3) < 270 && (a3 ? (p3 *= -1, v3 += h3 <= 0 ? 180 : -180, h3 += h3 <= 0 ? 180 : -180) : (m3 *= -1, v3 += v3 <= 0 ? 180 : -180)), t3 || (t3 = r3.uncache), r3.x = u3 - ((r3.xPercent = u3 && (!t3 && r3.xPercent || (Math.round(e32.offsetWidth / 2) === Math.round(-u3) ? -50 : 0))) ? e32.offsetWidth * r3.xPercent / 100 : 0) + o3, r3.y = d3 - ((r3.yPercent = d3 && (!t3 && r3.yPercent || (Math.round(e32.offsetHeight / 2) === Math.round(-d3) ? -50 : 0))) ? e32.offsetHeight * r3.yPercent / 100 : 0) + o3, r3.z = f3 + o3, r3.scaleX = U2(p3), r3.scaleY = U2(m3), r3.rotation = U2(h3) + s3, r3.rotationX = U2(g3) + s3, r3.rotationY = U2(_3) + s3, r3.skewX = v3 + s3, r3.skewY = y3 + s3, r3.transformPerspective = b3 + o3, (r3.zOrigin = parseFloat(l3.split(` `)[2]) || !t3 && r3.zOrigin || 0) && (i3[$2] = Xr2(l3)), r3.xOffset = r3.yOffset = 0, r3.force3D = n2.force3D, r3.renderTransform = r3.svg ? ri2 : Sr2 ? ni2 : Qr2, r3.uncache = 0, r3;
  };
  var Xr2 = function(e32) {
    return (e32 = e32.split(` `))[0] + ` ` + e32[1];
  };
  var Zr2 = function(e32, t3, n3) {
    var r3 = G2(t3);
    return U2(parseFloat(t3) + parseFloat(Ir2(e32, `x`, n3 + `px`, r3))) + r3;
  };
  var Qr2 = function(e32, t3) {
    t3.z = `0px`, t3.rotationY = t3.rotationX = `0deg`, t3.force3D = 0, ni2(e32, t3);
  };
  var $r2 = `0deg`;
  var ei2 = `0px`;
  var ti2 = `) `;
  var ni2 = function(e32, t3) {
    var n3 = t3 || this, r3 = n3.xPercent, i3 = n3.yPercent, a3 = n3.x, o3 = n3.y, s3 = n3.z, c3 = n3.rotation, l3 = n3.rotationY, u3 = n3.rotationX, d3 = n3.skewX, f3 = n3.skewY, p3 = n3.scaleX, m3 = n3.scaleY, h3 = n3.transformPerspective, g3 = n3.force3D, _3 = n3.target, v3 = n3.zOrigin, y3 = ``, b3 = g3 === `auto` && e32 && e32 !== 1 || g3 === true;
    if (v3 && (u3 !== $r2 || l3 !== $r2)) {
      var x3 = parseFloat(l3) * Qn2, S3 = Math.sin(x3), C3 = Math.cos(x3), w3;
      x3 = parseFloat(u3) * Qn2, w3 = Math.cos(x3), a3 = Zr2(_3, a3, S3 * w3 * -v3), o3 = Zr2(_3, o3, -Math.sin(x3) * -v3), s3 = Zr2(_3, s3, C3 * w3 * -v3 + v3);
    }
    h3 !== ei2 && (y3 += `perspective(` + h3 + ti2), (r3 || i3) && (y3 += `translate(` + r3 + `%, ` + i3 + `%) `), (b3 || a3 !== ei2 || o3 !== ei2 || s3 !== ei2) && (y3 += s3 !== ei2 || b3 ? `translate3d(` + a3 + `, ` + o3 + `, ` + s3 + `) ` : `translate(` + a3 + `, ` + o3 + ti2), c3 !== $r2 && (y3 += `rotate(` + c3 + ti2), l3 !== $r2 && (y3 += `rotateY(` + l3 + ti2), u3 !== $r2 && (y3 += `rotateX(` + u3 + ti2), (d3 !== $r2 || f3 !== $r2) && (y3 += `skew(` + d3 + `, ` + f3 + ti2), (p3 !== 1 || m3 !== 1) && (y3 += `scale(` + p3 + `, ` + m3 + ti2), _3.style[Q2] = y3 || `translate(0, 0)`;
  };
  var ri2 = function(e32, t3) {
    var n3 = t3 || this, r3 = n3.xPercent, i3 = n3.yPercent, a3 = n3.x, o3 = n3.y, s3 = n3.rotation, c3 = n3.skewX, l3 = n3.skewY, u3 = n3.scaleX, d3 = n3.scaleY, f3 = n3.target, p3 = n3.xOrigin, m3 = n3.yOrigin, h3 = n3.xOffset, g3 = n3.yOffset, _3 = n3.forceCSS, v3 = parseFloat(a3), y3 = parseFloat(o3), b3, x3, S3, C3, w3;
    s3 = parseFloat(s3), c3 = parseFloat(c3), l3 = parseFloat(l3), l3 && (l3 = parseFloat(l3), c3 += l3, s3 += l3), s3 || c3 ? (s3 *= Qn2, c3 *= Qn2, b3 = Math.cos(s3) * u3, x3 = Math.sin(s3) * u3, S3 = Math.sin(s3 - c3) * -d3, C3 = Math.cos(s3 - c3) * d3, c3 && (l3 *= Qn2, w3 = Math.tan(c3 - l3), w3 = Math.sqrt(1 + w3 * w3), S3 *= w3, C3 *= w3, l3 && (w3 = Math.tan(l3), w3 = Math.sqrt(1 + w3 * w3), b3 *= w3, x3 *= w3)), b3 = U2(b3), x3 = U2(x3), S3 = U2(S3), C3 = U2(C3)) : (b3 = u3, C3 = d3, x3 = S3 = 0), (v3 && !~(a3 + ``).indexOf(`px`) || y3 && !~(o3 + ``).indexOf(`px`)) && (v3 = Ir2(f3, `x`, a3, `px`), y3 = Ir2(f3, `y`, o3, `px`)), (p3 || m3 || h3 || g3) && (v3 = U2(v3 + p3 - (p3 * b3 + m3 * S3) + h3), y3 = U2(y3 + m3 - (p3 * x3 + m3 * C3) + g3)), (r3 || i3) && (w3 = f3.getBBox(), v3 = U2(v3 + r3 / 100 * w3.width), y3 = U2(y3 + i3 / 100 * w3.height)), w3 = `matrix(` + b3 + `,` + x3 + `,` + S3 + `,` + C3 + `,` + v3 + `,` + y3 + `)`, f3.setAttribute(`transform`, w3), _3 && (f3.style[Q2] = w3);
  };
  var ii2 = function(e32, t3, n3, r3, i3) {
    var a3 = 360, o3 = h2(i3), s3 = parseFloat(i3) * (o3 && ~i3.indexOf(`rad`) ? Zn2 : 1) - r3, c3 = r3 + s3 + `deg`, l3, u3;
    return o3 && (l3 = i3.split(`_`)[1], l3 === `short` && (s3 %= a3, s3 !== s3 % (a3 / 2) && (s3 += s3 < 0 ? a3 : -a3)), l3 === `cw` && s3 < 0 ? s3 = (s3 + a3 * er2) % a3 - ~~(s3 / a3) * a3 : l3 === `ccw` && s3 > 0 && (s3 = (s3 - a3 * er2) % a3 - ~~(s3 / a3) * a3)), e32._pt = u3 = new X2(e32._pt, t3, n3, r3, s3, or2), u3.e = c3, u3.u = `deg`, e32._props.push(n3), u3;
  };
  var ai2 = function(e32, t3) {
    for (var n3 in t3) e32[n3] = t3[n3];
    return e32;
  };
  var oi2 = function(e32, t3, n3) {
    var r3 = ai2({}, n3._gsap), i3 = `perspective,force3D,transformOrigin,svgOrigin`, a3 = n3.style, o3, s3, c3, l3, u3, d3, f3, p3;
    for (s3 in r3.svg ? (c3 = n3.getAttribute(`transform`), n3.setAttribute(`transform`, ``), a3[Q2] = t3, o3 = Yr2(n3, 1), Mr2(n3, Q2), n3.setAttribute(`transform`, c3)) : (c3 = getComputedStyle(n3)[Q2], a3[Q2] = t3, o3 = Yr2(n3, 1), a3[Q2] = c3), Xn2) c3 = r3[s3], l3 = o3[s3], c3 !== l3 && i3.indexOf(s3) < 0 && (f3 = G2(c3), p3 = G2(l3), u3 = f3 === p3 ? parseFloat(c3) : Ir2(n3, s3, c3, p3), d3 = parseFloat(l3), e32._pt = new X2(e32._pt, o3, s3, u3, d3 - u3, ar2), e32._pt.u = p3 || 0, e32._props.push(s3));
    ai2(o3, r3);
  };
  H2(`padding,margin,Width,Radius`, function(e32, t3) {
    var n3 = `Top`, r3 = `Right`, i3 = `Bottom`, a3 = `Left`, o3 = (t3 < 3 ? [n3, r3, i3, a3] : [n3 + a3, n3 + r3, i3 + r3, i3 + a3]).map(function(n4) {
      return t3 < 2 ? e32 + n4 : `border` + n4 + e32;
    });
    Hr2[t3 > 1 ? `border` + e32 : e32] = function(e33, t4, n4, r4, i4) {
      var a4, s3;
      if (arguments.length < 4) return a4 = o3.map(function(t5) {
        return Lr2(e33, t5, n4);
      }), s3 = a4.join(` `), s3.split(a4[0]).length === 5 ? a4[0] : s3;
      a4 = (r4 + ``).split(` `), s3 = {}, o3.forEach(function(e34, t5) {
        return s3[e34] = a4[t5] = a4[t5] || a4[(t5 - 1) / 2 | 0];
      }), e33.init(t4, s3, i4);
    };
  });
  var si2 = { name: `css`, register: Dr2, targetTest: function(e32) {
    return e32.style && e32.nodeType;
  }, init: function(e32, t3, r3, i3, a3) {
    var o3 = this._props, s3 = e32.style, c3 = r3.vars.startAt, l3, u3, d3, f3, p3, m3, g3, _3, v3, y3, b3, x3, S3, C3, w3, T3, E3;
    for (g3 in Gn2 || Dr2(), this.styles = this.styles || xr2(e32), T3 = this.styles.props, this.tween = r3, t3) if (g3 !== `autoRound` && (u3 = t3[g3], !(V2[g3] && on2(g3, t3, r3, i3, e32, a3)))) {
      if (p3 = typeof u3, m3 = Hr2[g3], p3 === `function` && (u3 = u3.call(r3, i3, e32, a3), p3 = typeof u3), p3 === `string` && ~u3.indexOf(`random(`) && (u3 = Ct2(u3)), m3) m3(this, e32, g3, u3, r3) && (w3 = 1);
      else if (g3.substr(0, 2) === `--`) l3 = (getComputedStyle(e32).getPropertyValue(g3) + ``).trim(), u3 += ``, Lt2.lastIndex = 0, Lt2.test(l3) || (_3 = G2(l3), v3 = G2(u3), v3 ? _3 !== v3 && (l3 = Ir2(e32, g3, l3, v3) + v3) : _3 && (u3 += _3)), this.add(s3, `setProperty`, l3, u3, i3, a3, 0, 0, g3), o3.push(g3), T3.push(g3, 0, s3[g3]);
      else if (p3 !== `undefined`) {
        if (c3 && g3 in c3 ? (l3 = typeof c3[g3] == `function` ? c3[g3].call(r3, i3, e32, a3) : c3[g3], h2(l3) && ~l3.indexOf(`random(`) && (l3 = Ct2(l3)), G2(l3 + ``) || l3 === `auto` || (l3 += n2.units[g3] || G2(Lr2(e32, g3)) || ``), (l3 + ``).charAt(1) === `=` && (l3 = Lr2(e32, g3))) : l3 = Lr2(e32, g3), f3 = parseFloat(l3), y3 = p3 === `string` && u3.charAt(1) === `=` && u3.substr(0, 2), y3 && (u3 = u3.substr(2)), d3 = parseFloat(u3), g3 in ir2 && (g3 === `autoAlpha` && (f3 === 1 && Lr2(e32, `visibility`) === `hidden` && d3 && (f3 = 0), T3.push(`visibility`, 0, s3.visibility), Nr2(this, s3, `visibility`, f3 ? `inherit` : `hidden`, d3 ? `inherit` : `hidden`, !d3)), g3 !== `scale` && g3 !== `transform` && (g3 = ir2[g3], ~g3.indexOf(`,`) && (g3 = g3.split(`,`)[0]))), b3 = g3 in Xn2, b3) {
          if (this.styles.save(g3), E3 = u3, p3 === `string` && u3.substring(0, 6) === `var(--`) {
            if (u3 = wr2(e32, u3.substring(4, u3.indexOf(`)`))), u3.substring(0, 5) === `calc(`) {
              var D3 = e32.style.perspective;
              e32.style.perspective = u3, u3 = wr2(e32, `perspective`), D3 ? e32.style.perspective = D3 : Mr2(e32, `perspective`);
            }
            d3 = parseFloat(u3);
          }
          if (x3 || (S3 = e32._gsap, S3.renderTransform && !t3.parseTransform || Yr2(e32, t3.parseTransform), C3 = t3.smoothOrigin !== false && S3.smooth, x3 = this._pt = new X2(this._pt, s3, Q2, 0, 1, S3.renderTransform, S3, 0, -1), x3.dep = 1), g3 === `scale`) this._pt = new X2(this._pt, S3, `scaleY`, S3.scaleY, (y3 ? ye2(S3.scaleY, y3 + d3) : d3) - S3.scaleY || 0, ar2), this._pt.u = 0, o3.push(`scaleY`, g3), g3 += `X`;
          else if (g3 === `transformOrigin`) {
            T3.push($2, 0, s3[$2]), u3 = Br2(u3), S3.svg ? Jr2(e32, u3, 0, C3, 0, this) : (v3 = parseFloat(u3.split(` `)[2]) || 0, v3 !== S3.zOrigin && Nr2(this, S3, `zOrigin`, S3.zOrigin, v3), Nr2(this, s3, g3, Xr2(l3), Xr2(u3)));
            continue;
          } else if (g3 === `svgOrigin`) {
            Jr2(e32, u3, 1, C3, 0, this);
            continue;
          } else if (g3 in Wr2) {
            ii2(this, S3, g3, f3, y3 ? ye2(f3, y3 + u3) : u3);
            continue;
          } else if (g3 === `smoothOrigin`) {
            Nr2(this, S3, `smooth`, S3.smooth, u3);
            continue;
          } else if (g3 === `force3D`) {
            S3[g3] = u3;
            continue;
          } else if (g3 === `transform`) {
            oi2(this, u3, e32);
            continue;
          }
        } else g3 in s3 || (g3 = Er2(g3) || g3);
        if (b3 || (d3 || d3 === 0) && (f3 || f3 === 0) && !rr2.test(u3) && g3 in s3) _3 = (l3 + ``).substr((f3 + ``).length), d3 || (d3 = 0), v3 = G2(u3) || (g3 in n2.units ? n2.units[g3] : _3), _3 !== v3 && (f3 = Ir2(e32, g3, l3, v3)), this._pt = new X2(this._pt, b3 ? S3 : s3, g3, f3, (y3 ? ye2(f3, y3 + d3) : d3) - f3, !b3 && (v3 === `px` || g3 === `zIndex`) && t3.autoRound !== false ? lr2 : ar2), this._pt.u = v3 || 0, b3 && E3 !== u3 ? (this._pt.b = l3, this._pt.e = E3, this._pt.r = cr2) : _3 !== v3 && v3 !== `%` && (this._pt.b = l3, this._pt.r = sr2);
        else if (g3 in s3) Rr2.call(this, e32, g3, l3, y3 ? y3 + u3 : u3);
        else if (g3 in e32) this.add(e32, g3, l3 || e32[g3], y3 ? y3 + u3 : u3, i3, a3);
        else if (g3 !== `parseTransform`) {
          te2(g3, u3);
          continue;
        }
        b3 || (g3 in s3 ? T3.push(g3, 0, s3[g3]) : typeof e32[g3] == `function` ? T3.push(g3, 2, e32[g3]()) : T3.push(g3, 1, l3 || e32[g3])), o3.push(g3);
      }
    }
    w3 && On2(this);
  }, render: function(e32, t3) {
    if (t3.tween._time || !Jn2()) for (var n3 = t3._pt; n3; ) n3.r(e32, n3.d), n3 = n3._next;
    else t3.styles.revert();
  }, get: Lr2, aliases: ir2, getSetter: function(e32, t3, n3) {
    var r3 = ir2[t3];
    return r3 && r3.indexOf(`,`) < 0 && (t3 = r3), t3 in Xn2 && t3 !== $2 && (e32._gsap.x || Lr2(e32, `x`)) ? n3 && qn2 === n3 ? t3 === `scale` ? hr2 : mr2 : (qn2 = n3 || {}) && (t3 === `scale` ? gr2 : _r2) : e32.style && !v2(e32.style[t3]) ? fr2 : ~t3.indexOf(`-`) ? pr2 : bn2(e32, t3);
  }, core: { _removeProperty: Mr2, _getMatrix: qr2 } };
  Z2.utils.checkPrefix = Er2, Z2.core.getStyleSaver = xr2, (function(e32, t3, r3, i3) {
    var a3 = H2(e32 + `,` + t3 + `,` + r3, function(e33) {
      Xn2[e33] = 1;
    });
    H2(t3, function(e33) {
      n2.units[e33] = `deg`, Wr2[e33] = 1;
    }), ir2[a3[13]] = e32 + `,` + t3, H2(i3, function(e33) {
      var t4 = e33.split(`:`);
      ir2[t4[1]] = a3[t4[0]];
    });
  })(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`, `rotation,rotationX,rotationY,skewX,skewY`, `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`, `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`), H2(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`, function(e32) {
    n2.units[e32] = `px`;
  }), Z2.registerPlugin(si2);
  var ci2 = Z2.registerPlugin(si2) || Z2;
  ci2.core.Tween;

  // public/shopify/plantilla99/assets/js/MorphingParticlesComponent.astro_astro_type_script_index_0_lang.B4r3VvfF.js
  var A3 = c(Dl(), 1);
  var j3 = (e32, t3, n3, r3, i3) => (e32 - t3) * (i3 - r3) / (n3 - t3) + r3;
  var M3 = class e31 {
    constructor(e32, t3) {
      this.scene = e32, this.renderer = e32.renderer, this.gl = this.gl, this.camera = e32.camera, this.textures = t3, this.lastTime = 0, this.everRendered = false, this.mousePos = new U(0, 0), this.cursorPos = new U(0, 0), this.colorScheme = e32.theme === `dark` ? 0 : 1, this.particleScale = this.scene.renderer.domElement.width / this.scene.pixelRatio / 2e3 * this.scene.particlesScale;
    }
    static async create(t3, n3) {
      let r3 = new e31(t3, n3);
      return r3.createPoints(), await r3.createPointsFromImage(), r3.init(), r3;
    }
    async getImageData(e32) {
      return new Promise((t3, n3) => {
        let r3 = new Image();
        r3.src = e32, r3.onload = () => {
          let e33 = document.createElement(`canvas`);
          e33.width = 500, e33.height = 500;
          let n4 = e33.getContext(`2d`);
          n4.drawImage(r3, 0, 0, 500, 500), t3(n4.getImageData(0, 0, 500, 500));
        }, r3.onerror = n3;
      });
    }
    createPoints() {
      let e32 = new A3.default({ shape: [500, 500], minDistance: j3(this.scene.density, 0, 300, 10, 2), maxDistance: j3(this.scene.density, 0, 300, 11, 3), tries: 20 }).fill();
      this.pointsBaseData = e32, this.pointsData = [];
      for (let t3 = 0; t3 < e32.length; t3++) this.pointsData.push(e32[t3][0] - 250, e32[t3][1] - 250);
      this.count = this.pointsData.length / 2;
    }
    async createPointsFromImage() {
      let e32 = [];
      for (let t4 = 0; t4 < this.textures.length; t4++) {
        let n4 = await this.getImageData(this.textures[t4]);
        e32.push(n4);
      }
      this.nearestPointsData = [];
      let t3 = [];
      for (let n4 = 0; n4 < this.textures.length; n4++) t3.push(this.createPointsDistanceDataWorker(e32[n4], this.pointsBaseData, n4));
      let n3 = await Promise.all(t3);
      n3.sort((e33, t4) => e33.index - t4.index), n3.forEach((e33) => {
        this.nearestPointsData.push(e33.nearestPoints);
      });
    }
    createPointsDistanceDataWorker(e32, t3, n3) {
      return new Promise((r3, i3) => {
        let a3 = new Blob([`
                self.onmessage = function(e) {
                    (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PoissonDiskSampling=f()}})((function(){var define,module,exports;return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,(function(r){var n=e[i][1][r];return o(n||r)}),p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r}()({1:[function(require,module,exports){module.exports=function moore(range,dimensions){range=range||1;dimensions=dimensions||2;var size=range*2+1;var length=Math.pow(size,dimensions)-1;var neighbors=new Array(length);for(var i=0;i<length;i++){var neighbor=neighbors[i]=new Array(dimensions);var index=i<length/2?i:i+1;for(var dimension=1;dimension<=dimensions;dimension++){var value=index%Math.pow(size,dimension);neighbor[dimension-1]=value/Math.pow(size,dimension-1)-range;index-=value}}return neighbors}},{}],2:[function(require,module,exports){"use strict";var tinyNDArray=require("./../tiny-ndarray").integer,sphereRandom=require("./../sphere-random"),getNeighbourhood=require("./../neighbourhood");function squaredEuclideanDistance(point1,point2){var result=0,i=0;for(;i<point1.length;i++){result+=Math.pow(point1[i]-point2[i],2)}return result}function FixedDensityPDS(options,rng){if(typeof options.distanceFunction==="function"){throw new Error("PoissonDiskSampling: Tried to instantiate the fixed density implementation with a distanceFunction")}this.shape=options.shape;this.minDistance=options.minDistance;this.maxDistance=options.maxDistance||options.minDistance*2;this.maxTries=Math.ceil(Math.max(1,options.tries||30));this.rng=rng||Math.random;var maxShape=0;for(var i=0;i<this.shape.length;i++){maxShape=Math.max(maxShape,this.shape[i])}var floatPrecisionMitigation=Math.max(1,maxShape/128|0);var epsilonDistance=1e-14*floatPrecisionMitigation;this.dimension=this.shape.length;this.squaredMinDistance=this.minDistance*this.minDistance;this.minDistancePlusEpsilon=this.minDistance+epsilonDistance;this.deltaDistance=Math.max(0,this.maxDistance-this.minDistancePlusEpsilon);this.cellSize=this.minDistance/Math.sqrt(this.dimension);this.neighbourhood=getNeighbourhood(this.dimension);this.currentPoint=null;this.processList=[];this.samplePoints=[];this.gridShape=[];for(var i=0;i<this.dimension;i++){this.gridShape.push(Math.ceil(this.shape[i]/this.cellSize))}this.grid=tinyNDArray(this.gridShape)}FixedDensityPDS.prototype.shape=null;FixedDensityPDS.prototype.dimension=null;FixedDensityPDS.prototype.minDistance=null;FixedDensityPDS.prototype.maxDistance=null;FixedDensityPDS.prototype.minDistancePlusEpsilon=null;FixedDensityPDS.prototype.squaredMinDistance=null;FixedDensityPDS.prototype.deltaDistance=null;FixedDensityPDS.prototype.cellSize=null;FixedDensityPDS.prototype.maxTries=null;FixedDensityPDS.prototype.rng=null;FixedDensityPDS.prototype.neighbourhood=null;FixedDensityPDS.prototype.currentPoint=null;FixedDensityPDS.prototype.processList=null;FixedDensityPDS.prototype.samplePoints=null;FixedDensityPDS.prototype.gridShape=null;FixedDensityPDS.prototype.grid=null;FixedDensityPDS.prototype.addRandomPoint=function(){var point=new Array(this.dimension);for(var i=0;i<this.dimension;i++){point[i]=this.rng()*this.shape[i]}return this.directAddPoint(point)};FixedDensityPDS.prototype.addPoint=function(point){var dimension,valid=true;if(point.length===this.dimension){for(dimension=0;dimension<this.dimension&&valid;dimension++){valid=point[dimension]>=0&&point[dimension]<this.shape[dimension]}}else{valid=false}return valid?this.directAddPoint(point):null};FixedDensityPDS.prototype.directAddPoint=function(point){var internalArrayIndex=0,stride=this.grid.stride,dimension;this.processList.push(point);this.samplePoints.push(point);for(dimension=0;dimension<this.dimension;dimension++){internalArrayIndex+=(point[dimension]/this.cellSize|0)*stride[dimension]}this.grid.data[internalArrayIndex]=this.samplePoints.length;return point};FixedDensityPDS.prototype.inNeighbourhood=function(point){var dimensionNumber=this.dimension,stride=this.grid.stride,neighbourIndex,internalArrayIndex,dimension,currentDimensionValue,existingPoint;for(neighbourIndex=0;neighbourIndex<this.neighbourhood.length;neighbourIndex++){internalArrayIndex=0;for(dimension=0;dimension<dimensionNumber;dimension++){currentDimensionValue=(point[dimension]/this.cellSize|0)+this.neighbourhood[neighbourIndex][dimension];if(currentDimensionValue<0||currentDimensionValue>=this.gridShape[dimension]){internalArrayIndex=-1;break}internalArrayIndex+=currentDimensionValue*stride[dimension]}if(internalArrayIndex!==-1&&this.grid.data[internalArrayIndex]!==0){existingPoint=this.samplePoints[this.grid.data[internalArrayIndex]-1];if(squaredEuclideanDistance(point,existingPoint)<this.squaredMinDistance){return true}}}return false};FixedDensityPDS.prototype.next=function(){var tries,angle,distance,currentPoint,newPoint,inShape,i;while(this.processList.length>0){if(this.currentPoint===null){this.currentPoint=this.processList.shift()}currentPoint=this.currentPoint;for(tries=0;tries<this.maxTries;tries++){inShape=true;distance=this.minDistancePlusEpsilon+this.deltaDistance*this.rng();if(this.dimension===2){angle=this.rng()*Math.PI*2;newPoint=[Math.cos(angle),Math.sin(angle)]}else{newPoint=sphereRandom(this.dimension,this.rng)}for(i=0;inShape&&i<this.dimension;i++){newPoint[i]=currentPoint[i]+newPoint[i]*distance;inShape=newPoint[i]>=0&&newPoint[i]<this.shape[i]}if(inShape&&!this.inNeighbourhood(newPoint)){return this.directAddPoint(newPoint)}}if(tries===this.maxTries){this.currentPoint=null}}return null};FixedDensityPDS.prototype.fill=function(){if(this.samplePoints.length===0){this.addRandomPoint()}while(this.next()){}return this.samplePoints};FixedDensityPDS.prototype.getAllPoints=function(){return this.samplePoints};FixedDensityPDS.prototype.getAllPointsWithDistance=function(){throw new Error("PoissonDiskSampling: getAllPointsWithDistance() is not available in fixed-density implementation")};FixedDensityPDS.prototype.reset=function(){var gridData=this.grid.data,i=0;for(i=0;i<gridData.length;i++){gridData[i]=0}this.samplePoints=[];this.currentPoint=null;this.processList.length=0};module.exports=FixedDensityPDS},{"./../neighbourhood":4,"./../sphere-random":6,"./../tiny-ndarray":7}],3:[function(require,module,exports){"use strict";var tinyNDArray=require("./../tiny-ndarray").array,sphereRandom=require("./../sphere-random"),getNeighbourhood=require("./../neighbourhood");function euclideanDistance(point1,point2){var result=0,i=0;for(;i<point1.length;i++){result+=Math.pow(point1[i]-point2[i],2)}return Math.sqrt(result)}function VariableDensityPDS(options,rng){if(typeof options.distanceFunction!=="function"){throw new Error("PoissonDiskSampling: Tried to instantiate the variable density implementation without a distanceFunction")}this.shape=options.shape;this.minDistance=options.minDistance;this.maxDistance=options.maxDistance||options.minDistance*2;this.maxTries=Math.ceil(Math.max(1,options.tries||30));this.distanceFunction=options.distanceFunction;this.bias=Math.max(0,Math.min(1,options.bias||0));this.rng=rng||Math.random;var maxShape=0;for(var i=0;i<this.shape.length;i++){maxShape=Math.max(maxShape,this.shape[i])}var floatPrecisionMitigation=Math.max(1,maxShape/128|0);var epsilonDistance=1e-14*floatPrecisionMitigation;this.dimension=this.shape.length;this.minDistancePlusEpsilon=this.minDistance+epsilonDistance;this.deltaDistance=Math.max(0,this.maxDistance-this.minDistancePlusEpsilon);this.cellSize=this.maxDistance/Math.sqrt(this.dimension);this.neighbourhood=getNeighbourhood(this.dimension);this.currentPoint=null;this.currentDistance=0;this.processList=[];this.samplePoints=[];this.sampleDistance=[];this.gridShape=[];for(var i=0;i<this.dimension;i++){this.gridShape.push(Math.ceil(this.shape[i]/this.cellSize))}this.grid=tinyNDArray(this.gridShape)}VariableDensityPDS.prototype.shape=null;VariableDensityPDS.prototype.dimension=null;VariableDensityPDS.prototype.minDistance=null;VariableDensityPDS.prototype.maxDistance=null;VariableDensityPDS.prototype.minDistancePlusEpsilon=null;VariableDensityPDS.prototype.deltaDistance=null;VariableDensityPDS.prototype.cellSize=null;VariableDensityPDS.prototype.maxTries=null;VariableDensityPDS.prototype.distanceFunction=null;VariableDensityPDS.prototype.bias=null;VariableDensityPDS.prototype.rng=null;VariableDensityPDS.prototype.neighbourhood=null;VariableDensityPDS.prototype.currentPoint=null;VariableDensityPDS.prototype.currentDistance=null;VariableDensityPDS.prototype.processList=null;VariableDensityPDS.prototype.samplePoints=null;VariableDensityPDS.prototype.sampleDistance=null;VariableDensityPDS.prototype.gridShape=null;VariableDensityPDS.prototype.grid=null;VariableDensityPDS.prototype.addRandomPoint=function(){var point=new Array(this.dimension);for(var i=0;i<this.dimension;i++){point[i]=this.rng()*this.shape[i]}return this.directAddPoint(point)};VariableDensityPDS.prototype.addPoint=function(point){var dimension,valid=true;if(point.length===this.dimension){for(dimension=0;dimension<this.dimension&&valid;dimension++){valid=point[dimension]>=0&&point[dimension]<this.shape[dimension]}}else{valid=false}return valid?this.directAddPoint(point):null};VariableDensityPDS.prototype.directAddPoint=function(point){var internalArrayIndex=0,stride=this.grid.stride,pointIndex=this.samplePoints.length,dimension;this.processList.push(pointIndex);this.samplePoints.push(point);this.sampleDistance.push(this.distanceFunction(point));for(dimension=0;dimension<this.dimension;dimension++){internalArrayIndex+=(point[dimension]/this.cellSize|0)*stride[dimension]}this.grid.data[internalArrayIndex].push(pointIndex);return point};VariableDensityPDS.prototype.inNeighbourhood=function(point){var dimensionNumber=this.dimension,stride=this.grid.stride,neighbourIndex,internalArrayIndex,dimension,currentDimensionValue,existingPoint,existingPointDistance;var pointDistance=this.distanceFunction(point);for(neighbourIndex=0;neighbourIndex<this.neighbourhood.length;neighbourIndex++){internalArrayIndex=0;for(dimension=0;dimension<dimensionNumber;dimension++){currentDimensionValue=(point[dimension]/this.cellSize|0)+this.neighbourhood[neighbourIndex][dimension];if(currentDimensionValue<0||currentDimensionValue>=this.gridShape[dimension]){internalArrayIndex=-1;break}internalArrayIndex+=currentDimensionValue*stride[dimension]}if(internalArrayIndex!==-1&&this.grid.data[internalArrayIndex].length>0){for(var i=0;i<this.grid.data[internalArrayIndex].length;i++){existingPoint=this.samplePoints[this.grid.data[internalArrayIndex][i]];existingPointDistance=this.sampleDistance[this.grid.data[internalArrayIndex][i]];var minDistance=Math.min(existingPointDistance,pointDistance);var maxDistance=Math.max(existingPointDistance,pointDistance);var dist=minDistance+(maxDistance-minDistance)*this.bias;if(euclideanDistance(point,existingPoint)<this.minDistance+this.deltaDistance*dist){return true}}}}return false};VariableDensityPDS.prototype.next=function(){var tries,angle,distance,currentPoint,currentDistance,newPoint,inShape,i;while(this.processList.length>0){if(this.currentPoint===null){var sampleIndex=this.processList.shift();this.currentPoint=this.samplePoints[sampleIndex];this.currentDistance=this.sampleDistance[sampleIndex]}currentPoint=this.currentPoint;currentDistance=this.currentDistance;for(tries=0;tries<this.maxTries;tries++){inShape=true;distance=this.minDistancePlusEpsilon+this.deltaDistance*(currentDistance+(1-currentDistance)*this.bias);if(this.dimension===2){angle=this.rng()*Math.PI*2;newPoint=[Math.cos(angle),Math.sin(angle)]}else{newPoint=sphereRandom(this.dimension,this.rng)}for(i=0;inShape&&i<this.dimension;i++){newPoint[i]=currentPoint[i]+newPoint[i]*distance;inShape=newPoint[i]>=0&&newPoint[i]<this.shape[i]}if(inShape&&!this.inNeighbourhood(newPoint)){return this.directAddPoint(newPoint)}}if(tries===this.maxTries){this.currentPoint=null}}return null};VariableDensityPDS.prototype.fill=function(){if(this.samplePoints.length===0){this.addRandomPoint()}while(this.next()){}return this.samplePoints};VariableDensityPDS.prototype.getAllPoints=function(){return this.samplePoints};VariableDensityPDS.prototype.getAllPointsWithDistance=function(){var result=new Array(this.samplePoints.length),i=0,dimension=0,point;for(i=0;i<this.samplePoints.length;i++){point=new Array(this.dimension+1);for(dimension=0;dimension<this.dimension;dimension++){point[dimension]=this.samplePoints[i][dimension]}point[this.dimension]=this.sampleDistance[i];result[i]=point}return result};VariableDensityPDS.prototype.reset=function(){var gridData=this.grid.data,i=0;for(i=0;i<gridData.length;i++){gridData[i]=[]}this.samplePoints=[];this.currentPoint=null;this.processList.length=0};module.exports=VariableDensityPDS},{"./../neighbourhood":4,"./../sphere-random":6,"./../tiny-ndarray":7}],4:[function(require,module,exports){"use strict";var moore=require("moore");function getNeighbourhood(dimensionNumber){var neighbourhood=moore(2,dimensionNumber),origin=[],dimension;neighbourhood=neighbourhood.filter((function(n){var dist=0;for(var d=0;d<dimensionNumber;d++){dist+=Math.pow(Math.max(0,Math.abs(n[d])-1),2)}return dist<dimensionNumber}));for(dimension=0;dimension<dimensionNumber;dimension++){origin.push(0)}neighbourhood.push(origin);neighbourhood.sort((function(n1,n2){var squareDist1=0,squareDist2=0,dimension;for(dimension=0;dimension<dimensionNumber;dimension++){squareDist1+=Math.pow(n1[dimension],2);squareDist2+=Math.pow(n2[dimension],2)}if(squareDist1<squareDist2){return-1}else if(squareDist1>squareDist2){return 1}else{return 0}}));return neighbourhood}var neighbourhoodCache={};function getNeighbourhoodMemoized(dimensionNumber){if(!neighbourhoodCache[dimensionNumber]){neighbourhoodCache[dimensionNumber]=getNeighbourhood(dimensionNumber)}return neighbourhoodCache[dimensionNumber]}module.exports=getNeighbourhoodMemoized},{moore:1}],5:[function(require,module,exports){"use strict";var FixedDensityPDS=require("./implementations/fixed-density");var VariableDensityPDS=require("./implementations/variable-density");function PoissonDiskSampling(options,rng){this.shape=options.shape;if(typeof options.distanceFunction==="function"){this.implementation=new VariableDensityPDS(options,rng)}else{this.implementation=new FixedDensityPDS(options,rng)}}PoissonDiskSampling.prototype.implementation=null;PoissonDiskSampling.prototype.addRandomPoint=function(){return this.implementation.addRandomPoint()};PoissonDiskSampling.prototype.addPoint=function(point){return this.implementation.addPoint(point)};PoissonDiskSampling.prototype.next=function(){return this.implementation.next()};PoissonDiskSampling.prototype.fill=function(){return this.implementation.fill()};PoissonDiskSampling.prototype.getAllPoints=function(){return this.implementation.getAllPoints()};PoissonDiskSampling.prototype.getAllPointsWithDistance=function(){return this.implementation.getAllPointsWithDistance()};PoissonDiskSampling.prototype.reset=function(){this.implementation.reset()};module.exports=PoissonDiskSampling},{"./implementations/fixed-density":2,"./implementations/variable-density":3}],6:[function(require,module,exports){"use strict";module.exports=sampleSphere;function sampleSphere(d,rng){var v=new Array(d),d2=Math.floor(d/2)<<1,r2=0,rr,r,theta,h,i;for(i=0;i<d2;i+=2){rr=-2*Math.log(rng());r=Math.sqrt(rr);theta=2*Math.PI*rng();r2+=rr;v[i]=r*Math.cos(theta);v[i+1]=r*Math.sin(theta)}if(d%2){var x=Math.sqrt(-2*Math.log(rng()))*Math.cos(2*Math.PI*rng());v[d-1]=x;r2+=Math.pow(x,2)}h=1/Math.sqrt(r2);for(i=0;i<d;++i){v[i]*=h}return v}},{}],7:[function(require,module,exports){"use strict";function tinyNDArrayOfInteger(gridShape){var dimensions=gridShape.length,totalLength=1,stride=new Array(dimensions),dimension;for(dimension=dimensions;dimension>0;dimension--){stride[dimension-1]=totalLength;totalLength=totalLength*gridShape[dimension-1]}return{stride:stride,data:new Uint32Array(totalLength)}}function tinyNDArrayOfArray(gridShape){var dimensions=gridShape.length,totalLength=1,stride=new Array(dimensions),data=[],dimension,index;for(dimension=dimensions;dimension>0;dimension--){stride[dimension-1]=totalLength;totalLength=totalLength*gridShape[dimension-1]}for(index=0;index<totalLength;index++){data.push([])}return{stride:stride,data:data}}module.exports={integer:tinyNDArrayOfInteger,array:tinyNDArrayOfArray}},{}]},{},[5])(5)}));

                    const { imageData, pointsBase, index, density } = e.data;

                    const distanceFunction = function (point, imageData) {
                        const pixelRedIndex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4;
                        const pixel = imageData.data[pixelRedIndex] / 255;
                        return pixel * pixel * pixel;
                    }

                    const linearMap = (x, a, b, c, d) => {
                        return ((x - a) * (d - c)) / (b - a) + c
                    }

                    const maxDistance = linearMap(density, 0, 300, 10, 50);
                    const poissonDisk = new PoissonDiskSampling({
                        shape: [500, 500],
                        minDistance: 1,
                        maxDistance: maxDistance,
                        tries: 20,
                        distanceFunction: function (point) {
                            return distanceFunction(point, imageData);
                        }
                    });
                    const points = poissonDisk.fill();

                    const nearestPoints = []
                    for (let i = 0; i < pointsBase.length; i++) {
                        let nearestPoint = null;
                        let nearestDistance = Infinity;
                        for (let j = 0; j < points.length; j++) {
                            if( Math.random() < .75) { continue; }
                            const distance = Math.sqrt(Math.pow(points[j][0] - pointsBase[i][0], 2) + Math.pow(points[j][1] - pointsBase[i][1], 2));
                            const pixelRedValue = distanceFunction(points[j], imageData);
                            // if (distance < nearestDistance) {
                            if (pixelRedValue < 1 && distance < nearestDistance) {
                                nearestDistance = distance;
                                nearestPoint = points[j];
                            }
                        }
                        nearestPoints.push(
                            nearestPoint[0] - 250,
                            nearestPoint[1] - 250
                        );
                    }

                    self.postMessage({ nearestPoints, index });
                };
            `], { type: `application/javascript` }), o3 = URL.createObjectURL(a3), s3 = new Worker(o3);
        s3.onmessage = function(e33) {
          let { nearestPoints: t4, index: n4 } = e33.data;
          s3.terminate(), URL.revokeObjectURL(o3), r3({ nearestPoints: t4, index: n4 });
        }, s3.onerror = function(e33) {
          console.error(`Worker error:`, e33), s3.terminate(), URL.revokeObjectURL(o3), i3(e33);
        }, s3.postMessage({ imageData: e32, pointsBase: t3, index: n3, density: this.scene.density });
      });
    }
    createDataTexturePosition(e32) {
      let t3 = new Float32Array(this.length * 4);
      for (let n4 = 0; n4 < this.count; n4++) {
        let r3 = n4 * 4;
        t3[r3 + 0] = e32[n4 * 2 + 0] * (1 / 250), t3[r3 + 1] = e32[n4 * 2 + 1] * (1 / 250), t3[r3 + 2] = 0, t3[r3 + 3] = 0;
      }
      let n3 = new Zr(t3, this.size, this.size, te, w);
      return n3.needsUpdate = true, n3;
    }
    createRenderTarget() {
      return new Et(this.size, this.size, { wrapS: l, wrapT: l, minFilter: f, magFilter: f, texture: this.posTex, format: te, type: T, depthBuffer: false, stencilBuffer: false });
    }
    setPointsTextureFromIndex(e32) {
      this.posNearestTex = this.createDataTexturePosition(this.nearestPointsData[e32]), this.posNearestTex.needsUpdate = true, this.simMaterial.uniforms.uPosNearest = this.posNearestTex;
    }
    init() {
      this.size = 256, this.length = this.size * this.size, this.posTex = this.createDataTexturePosition(this.pointsData), this.posNearestTex = this.createDataTexturePosition(this.nearestPointsData[0]), this.rt1 = this.createRenderTarget(), this.rt2 = this.createRenderTarget(), this.renderer.setRenderTarget(this.rt1), this.renderer.setClearColor(0, 0), this.renderer.clear(), this.renderer.setRenderTarget(this.rt2), this.renderer.setClearColor(0, 0), this.renderer.clear(), this.renderer.setRenderTarget(null), this.noise = new Ol(), this.simScene = new Xr(), this.simCamera = new Pi(-1, 1, 1, -1, 0, 1), this.simMaterial = new Ir({ uniforms: { uPosition: { value: this.posTex }, uPosRefs: { value: this.posTex }, uPosNearest: { value: this.posNearestTex }, uMousePos: { value: new U(0, 0) }, uRingRadius: { value: 0.2 }, uDeltaTime: { value: 0 }, uRingWidth: { value: 0.05 }, uRingWidth2: { value: 0.015 }, uIsHovering: { value: 0 }, uRingDisplacement: { value: this.scene.ringDisplacement }, uTime: { value: 0 } }, vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `, fragmentShader: `
                precision highp float;
                uniform sampler2D uPosition;
                uniform sampler2D uPosRefs;
                uniform sampler2D uPosNearest;

                uniform vec2 uMousePos;
                uniform float uTime;
                uniform float uDeltaTime;
                uniform float uIsHovering;

                vec2 hash( vec2 p ){
                    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
                    return fract(sin(p)*43758.5453);
                }

                void main() {

                    vec2 simTexCoords = gl_FragCoord.xy / vec2(${this.size.toFixed(1)}, ${this.size.toFixed(1)});
                    vec4 pFrame = texture2D(uPosition, simTexCoords);

                    float scale = pFrame.z;
                    float velocity = pFrame.w;
                    vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;
                    vec2 nearestPos = texture2D(uPosNearest, simTexCoords).xy;
                    float seed = hash(simTexCoords).x;
                    float seed2 = hash(simTexCoords).y;

                    float time = uTime * .5;
                    float lifeEnd = 3. + sin(seed2 * 100.) * 1.;
                    float lifeTime = mod((seed * 100.) + time, lifeEnd);

                    vec2 disp = vec2(0., 0.);
                    vec2 pos = pFrame.xy;

                    float distRadius = 0.15;

                    vec2 targetPos = refPos;
                    targetPos = mix(targetPos, nearestPos, uIsHovering * uIsHovering);

                    vec2 direction = normalize(targetPos - pos);
                    direction *= .01;

                    float dist = length(targetPos - pos);
                    float distStrength = smoothstep(distRadius, 0., dist);

                    if(dist > 0.005){
                        pos += direction * distStrength;
                    }

                    if(lifeTime < .01){
                        pos = refPos;
                        pFrame.xy = refPos;
                        scale = 0.;
                    }

                    // Add scale
                    float targetScale = smoothstep(.01, 0.5, lifeTime) - smoothstep(0.5, 1., lifeTime/lifeEnd);
                    targetScale += smoothstep(0.1, 0., smoothstep(0.001, .1, dist)) * 1.5 * uIsHovering;
                    // targetScale *= distStrength;

                    float scaleDiff = targetScale - scale;
                    scaleDiff *= .1;
                    scale += scaleDiff;

                    // Final position
                    vec2 finalPos = pos + (disp * smoothstep(0.001, distRadius, dist));
                    vec2 diff = finalPos - pFrame.xy;
                    diff *= .2;

                    velocity = smoothstep(distRadius, .001, dist) * uIsHovering;

                    vec4 frame = vec4(pFrame.xy + diff, scale, velocity);

                    gl_FragColor = frame;

                }
            ` });
      let e32 = new Tr(new hi(2, 2), this.simMaterial);
      this.simScene.add(e32);
      let t3 = new pr(), i3 = new Float32Array(this.count * 2), a3 = new Float32Array(this.count * 3), s3 = new Float32Array(this.count * 4);
      for (let e33 = 0; e33 < this.count; e33++) {
        let t4 = e33 % this.size, n3 = Math.floor(e33 / this.size);
        i3[e33 * 2] = t4 / this.size, i3[e33 * 2 + 1] = n3 / this.size;
      }
      for (let e33 = 0; e33 < this.count; e33++) s3[e33 * 4] = Math.random(), s3[e33 * 4 + 1] = Math.random(), s3[e33 * 4 + 2] = Math.random(), s3[e33 * 4 + 3] = Math.random();
      t3.setAttribute(`position`, new nr(a3, 3)), t3.setAttribute(`uv`, new nr(i3, 2)), t3.setAttribute(`seeds`, new nr(s3, 4)), this.renderMaterial = new Ir({ uniforms: { uPosition: { value: this.posTex }, uTime: { value: 0 }, uColor1: { value: new q(this.scene.colorControls.color1) }, uColor2: { value: new q(this.scene.colorControls.color2) }, uColor3: { value: new q(this.scene.colorControls.color3) }, uAlpha: { value: 1 }, uIsHovering: { value: 0 }, uPulseProgress: { value: 0 }, uMousePos: { value: new U(0, 0) }, uRez: { value: new U(this.scene.renderer.domElement.width, this.scene.renderer.domElement.height) }, uParticleScale: { value: this.particleScale }, uPixelRatio: { value: this.scene.pixelRatio }, uColorScheme: { value: this.colorScheme } }, vertexShader: `
                precision highp float;
                attribute vec4 seeds;

                uniform sampler2D uPosition;
                uniform float uTime;
                uniform float uParticleScale;
                uniform float uPixelRatio;
                uniform int uColorScheme;
                uniform float uIsHovering;
                uniform float uPulseProgress;

                varying vec4 vSeeds;
                varying float vVelocity;
                varying vec2 vLocalPos;
                varying vec2 vScreenPos;
                varying float vScale;

                ${bl.noise}

                void main() {

                    vec4 pos = texture2D(uPosition, uv);
                    vSeeds = seeds;

                    float noiseX = snoise(vec3( vec2(pos.xy * 10.), uTime * .2 + 100.));
                    float noiseY = snoise(vec3( vec2(pos.xy * 10.), uTime * .2));

                    float noiseX2 = snoise(vec3( vec2(pos.xy * .5), uTime * .15 + 45.));
                    float noiseY2 = snoise(vec3( vec2(pos.xy * .5), uTime * .15 + 87.));

                    // make a smooth disc
                    float cDist = length(pos.xy) * 1.;
                    float progress = uPulseProgress;
                    float t = smoothstep(progress - .25, progress, cDist) - smoothstep(progress, progress + .25, cDist);
                    t *= smoothstep(1., .0, cDist);
                    pos.xy *= 1. + (t * .02);

                    float dist = smoothstep(0., 0.9, pos.w);
                    dist = mix(0., dist, uIsHovering);

                    pos.y += noiseY * 0.005 * dist;
                    pos.x += noiseX * 0.005 * dist;
                    pos.y += noiseY2 * 0.02;
                    pos.x += noiseX2 * 0.02;

                    vVelocity = pos.w;
                    vScale = pos.z;
                    vLocalPos = pos.xy;
                    vec4 viewSpace  = modelViewMatrix * vec4(vec3(pos.xy, 0.), 1.0);

                    gl_Position = projectionMatrix * viewSpace;
                    vScreenPos = gl_Position.xy;

                    float minScale = .25;
                    minScale += float(uColorScheme) * .75;

                    gl_PointSize = ((vScale * 7.) * (uPixelRatio * 0.5) * uParticleScale) + (minScale * uPixelRatio);

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

                uniform vec2 uMousePos;
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

                    // get angle between
                    float angle = atan(vLocalPos.y - uMousePos.y, vLocalPos.x - uMousePos.x);

                    vec2 uv = gl_PointCoord.xy;
                    uv -= vec2(0.5);
                    uv.y *= -1.;

                    vec2 tuv = vScreenPos;
                    tuv = rotate(tuv, uTime * 1.);
                    tuv.y *= 1./ratio;
                    tuv += .5;

                    float h = 0.8; // adjust position of middleColor
                    float progress = vVelocity;
                    vec3 col = mix(mix(uColor1, uColor2, progress/h), mix(uColor2, uColor3, (progress - h)/(1.0 - h)), step(h, progress));
                    vec3 color = col;

                    float dist = sqrt(dot(uv, uv));

                    float dr = .5;
                    float t = smoothstep(dr+(uBorderSize + .0001), dr-uBorderSize, dist);
                    t = clamp(t, 0., 1.);

                    float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25));
                    rounded = smoothstep(.1, 0., rounded);

                    float disc = smoothstep(.5, .45, length(uv));

                    float a = uAlpha * disc * smoothstep(0.1, 0.2, vScale);

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
            `, transparent: true, depthTest: false, depthWrite: false }), this.mesh = new di(t3, this.renderMaterial), this.mesh.position.set(0, 0, 0), this.mesh.scale.set(5, -5, 5), this.scene.scene.add(this.mesh);
    }
    resize() {
      this.renderMaterial.uniforms.uRez.value = new U(this.scene.renderer.domElement.width, this.scene.renderer.domElement.height), this.renderMaterial.uniforms.uPixelRatio.value = this.scene.pixelRatio, this.renderMaterial.needsUpdate = true;
    }
    update() {
      let e32 = this.scene.clock.getElapsedTime() - this.lastTime;
      this.lastTime = this.scene.clock.getElapsedTime(), this.scene.isIntersecting, this.mousePos.set(this.scene.intersectionPoint.x * 0.175, this.scene.intersectionPoint.y * 0.175), this.particleScale = this.scene.renderer.domElement.width / this.scene.pixelRatio / 2e3 * this.scene.particlesScale, this.simMaterial.uniforms.uPosition.value = this.everRendered ? this.rt1.texture : this.posTex, this.simMaterial.uniforms.uTime.value = this.scene.clock.getElapsedTime(), this.simMaterial.uniforms.uDeltaTime.value = e32, this.simMaterial.uniforms.uRingRadius.value = 0.175 + Math.sin(this.scene.time * 1) * 0.03 + Math.cos(this.scene.time * 3) * 0.02, this.simMaterial.uniforms.uMousePos.value = this.mousePos, this.simMaterial.uniforms.uRingWidth.value = this.scene.ringWidth, this.simMaterial.uniforms.uRingWidth2.value = this.scene.ringWidth2, this.simMaterial.uniforms.uRingDisplacement.value = this.scene.ringDisplacement, this.simMaterial.uniforms.uIsHovering.value = this.scene.hoverProgress, this.simMaterial.uniforms.uPosNearest.value = this.posNearestTex, this.renderer.setRenderTarget(this.rt2), this.renderer.render(this.simScene, this.simCamera), this.renderer.setRenderTarget(null), this.renderMaterial.uniforms.uPosition.value = this.everRendered ? this.rt2.texture : this.posTex, this.renderMaterial.uniforms.uTime.value = this.scene.clock.getElapsedTime(), this.renderMaterial.uniforms.uMousePos.value = this.mousePos, this.renderMaterial.uniforms.uParticleScale.value = this.particleScale, this.renderMaterial.uniforms.uIsHovering.value = this.scene.hoverProgress, this.renderMaterial.uniforms.uPulseProgress.value = this.scene.pushProgress;
    }
    postRender() {
      let e32 = this.rt1;
      this.rt1 = this.rt2, this.rt2 = e32, this.everRendered = true;
    }
    kill() {
      this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.rt1.dispose(), this.rt2.dispose(), this.posTex.dispose(), this.simMaterial.dispose(), this.renderMaterial.dispose();
    }
  };
  var N3 = class {
    constructor(e32) {
      this.loaded = false, this.textures = e32.textures || [`/assets/textures/icons/icon_cube.png`], this.color1 = e32.color1 || `#aecbfa`, this.color2 = e32.color2 || `#aecbfa`, this.color3 = e32.color3 || `#93bbfc`, this.options = e32, this.theme = e32.theme || `dark`, this.interactive = false, this.options.background = this.theme === `dark` ? new q(1184535) : new q(16777215), this.pixelRatio = e32.pixelRatio || window.devicePixelRatio, this.particlesScale = e32.particlesScale || 0.5, this.density = e32.density || 150, this.cameraZoom = e32.cameraZoom || 3.5, this.verbose = e32.verbose || false, this.onLoadedCallback = e32.onLoaded || null, this.isHovering = false, this.hoverProgress = 0, this.pushProgress = 0, this.scene = new Xr(), this.scene.background = this.options.background, this.canvas = document.createElement(`canvas`), this.options.container.appendChild(this.canvas), this.canvas.width = this.options.container.offsetWidth, this.canvas.height = this.options.container.offsetHeight, K.enabled = false, this.renderer = new nc({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: `high-performance`, preserveDrawingBuffer: true, stencil: false, precision: `highp` }), this.gl = this.renderer.getContext(), this.renderer.extensions.get(`EXT_color_buffer_float`), this.renderer.setSize(this.canvas.width, this.canvas.height), this.renderer.setPixelRatio(this.pixelRatio), this.onWindowResize = this.onWindowResize.bind(this), this.initCamera(), this.initScene(), this.initEvents(), this.clock = new Ii(), this.time = 0, this.lastTime = 0, this.dt = 0, this.skipFrame = false, this.isPaused = false, this.raycaster = new Yi(), this.mouse = new U(), this.intersectionPoint = new W(), this.isIntersecting = false, this.mouseIsOver = false;
    }
    initEvents() {
      window.addEventListener(`resize`, (e32) => {
        this.onWindowResize();
      });
    }
    onWindowResize() {
      this.canvas.width = this.options.container.offsetWidth, this.canvas.height = this.options.container.offsetHeight, this.renderer.setSize(this.canvas.width, this.canvas.height), this.camera.aspect = this.canvas.width / this.canvas.height, this.camera.updateProjectionMatrix(), this.particles && this.particles.resize();
    }
    onHoverStart() {
      ci2.to(this, { hoverProgress: 1, duration: 0.5, ease: `power3.out` }), ci2.fromTo(this, { pushProgress: 0 }, { pushProgress: 1, duration: 2, delay: 0.1, ease: `power2.out` });
    }
    onHoverEnd() {
      ci2.to(this, { hoverProgress: 0, duration: 0.5, ease: `power3.out` }), ci2.fromTo(this, { pushProgress: 0 }, { pushProgress: 1, duration: 2, delay: 0, ease: `power2.out` });
    }
    setPointsTextureFromIndex(e32) {
      ci2.delayedCall(0.1, () => {
        this.particles && this.particles.setPointsTextureFromIndex(e32);
      }), ci2.fromTo(this, { pushProgress: 0 }, { pushProgress: 1, duration: 2, ease: `power2.out` });
    }
    initCamera() {
      this.camera = new Vr(40, this.gl.drawingBufferWidth / this.gl.drawingBufferHeight, 0.1, 1e3), this.camera.position.z = this.cameraZoom;
    }
    async initScene() {
      this.colorControls = { color1: this.theme === `dark` ? `#318bf7` : this.color1, color2: this.theme === `dark` ? `#bada4c` : this.color2, color3: this.theme === `dark` ? `#e35058` : this.color3 }, await this.initParticles(), this.options.gui && this.initGUI(), this.onLoaded();
    }
    async initParticles() {
      this.particles = await M3.create(this, this.textures);
    }
    initGUI() {
      this.gui = new yl({ autoPlace: false }), this.options.container.appendChild(this.gui.domElement), this.gui.domElement.style.position = `absolute`, this.gui.domElement.style.top = `0`, this.gui.domElement.style.right = `0`, this.gui.domElement.style.zIndex = `1000`;
      let e32 = this.gui.addFolder(`Colors`);
      e32.addColor(this.colorControls, `color1`).name(`Color 1`).onChange((e33) => {
        this.particles.renderMaterial.uniforms.uColor1.value.set(new q(e33));
      }), e32.addColor(this.colorControls, `color2`).name(`Color 2`).onChange((e33) => {
        this.particles.renderMaterial.uniforms.uColor2.value.set(new q(e33));
      }), e32.addColor(this.colorControls, `color3`).name(`Color 3`).onChange((e33) => {
        this.particles.renderMaterial.uniforms.uColor3.value.set(new q(e33));
      }), e32.add(this, `particlesScale`).name(`Particles Scale`).min(0.1).max(4).step(0.01).onChange((e33) => {
        this.particlesScale = e33;
      }), e32.add(this, `density`).name(`Density`).min(50).max(250).step(10).onChange(async (e33) => {
        this.density = e33, this.verbose, this.killParticles(), await this.initParticles();
      }), e32.open();
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
      this.loaded = true, this.onLoadedCallback && typeof this.onLoadedCallback == `function` && this.onLoadedCallback(this);
    }
    preRender() {
      if (this.dt = this.clock.getElapsedTime() - this.lastTime, this.lastTime = this.clock.getElapsedTime(), this.time += this.dt, this.particles.update(), this.interactive && !this.skipFrame) {
        let e32 = this.canvas.getBoundingClientRect();
        kl.cursor, this.mouse.x = (kl.cursor.x - e32.left) * (kl.screenWidth / e32.width), this.mouse.y = (kl.cursor.y - e32.top) * (kl.screenHeight / e32.height), this.mouse.x = this.mouse.x / kl.screenWidth * 2 - 1, this.mouse.y = -(this.mouse.y / kl.screenHeight) * 2 + 1, this.mouse.x < -1 || this.mouse.x > 1 || this.mouse.y < -1 || this.mouse.y > 1 ? this.mouseIsOver = false : this.mouseIsOver = true;
      }
      if (this.skipFrame = !this.skipFrame, !this.skipFrame && this.raycastPlane) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let e32 = this.raycaster.intersectObject(this.raycastPlane);
        e32.length > 0 && this.mouseIsOver ? (this.intersectionPoint.copy(e32[0].point), this.isIntersecting = true) : this.isIntersecting = false;
      }
    }
    render() {
      !this.loaded || this.isPaused || (this.preRender(), this.renderer.setRenderTarget(null), this.renderer.autoClear = false, this.renderer.clear(), this.renderer.render(this.scene, this.camera), this.postRender());
    }
    postRender() {
      this.particles.postRender();
    }
  };
  document.addEventListener(`DOMContentLoaded`, () => {
    document.querySelectorAll(`[data-morphing-particles-component]`).forEach((e32) => {
      let t3 = e32.querySelector(`[data-container]`);
      if (!t3) return;
      let n3 = e32.getAttribute(`data-theme`) || `dark`, r3 = parseInt(e32.getAttribute(`data-density`) || `100`), i3 = new N3({ container: t3, theme: n3, particlesScale: parseFloat(e32.getAttribute(`data-particles-scale`) || `1`), cameraZoom: parseFloat(e32.getAttribute(`data-camera-zoom`) || `3.5`), density: r3, textures: JSON.parse(e32.getAttribute(`data-textures`) || `[]`), color1: e32.getAttribute(`data-color1`) || void 0, color2: e32.getAttribute(`data-color2`) || void 0, color3: e32.getAttribute(`data-color3`) || void 0, interactive: true, gui: new URLSearchParams(window.location.search).get(`gui`) === `true`, verbose: false, onLoaded: () => {
        e32.dispatchEvent(new CustomEvent(`loaded`));
      } }), a3 = false, o3 = null, s3 = new IntersectionObserver((e33) => {
        e33.forEach((e34) => {
          a3 = e34.isIntersecting, e34.isIntersecting ? i3.resume() : i3.stop();
        });
      }, { root: null, rootMargin: `0px`, threshold: 0 });
      s3.observe(t3);
      let c3 = () => {
        o3 = requestAnimationFrame(c3), a3 && i3.render();
      };
      c3(), e32.helper = { onHover: () => i3.onHoverStart(), onLeave: () => i3.onHoverEnd(), setPointsTextureFromIndex: (e33) => i3.setPointsTextureFromIndex(e33), kill: () => i3.kill() }, window.addEventListener(`beforeunload`, () => {
        s3.disconnect(), o3 !== null && cancelAnimationFrame(o3), i3.kill();
      });
    });
  });
})();
