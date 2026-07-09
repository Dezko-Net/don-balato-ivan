if (!customElements.get("split-hero")) {
  class SplitHero extends HTMLElement {
    constructor() {
      (super(), (this.id = this.dataset.id));
    }
    connectedCallback() {
      ((this.videos = this.querySelectorAll("video")),
        this.videos.forEach((video) => {
          typeof video > "u" ||
            (video.addEventListener("loadeddata", (e) => {
              (video.classList.add("loaded"),
                video
                  .closest(".split-hero-column__media-media")
                  ?.classList.add("loaded"));
            }),
            video.readyState >= 2 &&
              (video.classList.add("loaded"),
              video
                .closest(".split-hero-column__media-media")
                ?.classList.add("loaded")));
        }),
        (this._intervalId = setInterval(async () => {
          if (this._parallaxInitialized) return clearInterval(this._intervalId);
          const container = this.querySelector(".swiper-container");
          if (!container) {
            ((this._parallaxInitialized = !0),
              await this.waitForVideos(),
              this.initParallaxScrollAnimation(),
              clearInterval(this._intervalId));
            return;
          }
          (container.classList.contains("swiper-initialized") ||
            container.swiper) &&
            ((this._parallaxInitialized = !0),
            await this.waitForVideos(),
            requestAnimationFrame(() => {
              this.initParallaxScrollAnimation();
            }),
            clearInterval(this._intervalId));
        }, 100)));
    }
    disconnectedCallback() {
      queueMicrotask(() => {
        this.isConnected ||
          (this._intervalId && clearInterval(this._intervalId),
          (this._intervalId = null),
          this._ro?.disconnect?.(),
          (this._ro = null),
          window.removeEventListener("resize", this._onResize),
          (this._onResize = null),
          this.scene?.destroy?.(!0),
          this.controller?.destroy?.(!0),
          (this.scene = null),
          (this.controller = null),
          (this._parallaxInitialized = !1),
          (this._collapsedState = null),
          this._resizeHandler &&
            (window.removeEventListener("resize", this._resizeHandler),
            (this._resizeHandler = null)));
      });
    }
    waitForVideos() {
      const videos = Array.from(this.querySelectorAll("video"));
      return videos.length
        ? Promise.all(
            videos.map((v) =>
              v.readyState >= 1
                ? Promise.resolve()
                : new Promise((resolve) => {
                    const done = () => {
                      (v.removeEventListener("loadedmetadata", done),
                        v.removeEventListener("loadeddata", done),
                        v.removeEventListener("canplay", done),
                        v.removeEventListener("error", done),
                        resolve());
                    };
                    (v.addEventListener("loadedmetadata", done, { once: !0 }),
                      v.addEventListener("loadeddata", done, { once: !0 }),
                      v.addEventListener("canplay", done, { once: !0 }),
                      v.addEventListener("error", done, { once: !0 }));
                  }),
            ),
          ).then(() => {})
        : Promise.resolve();
    }
    setupAutoRecalc({ contentTarget, tl, durationPx }) {
      this._recalc?.();
      const recalc = () => {
        this.scene &&
          (this.scene.duration(durationPx()),
          tl.invalidate(),
          this.scene.refresh(),
          this.updateMaskScale?.(),
          requestAnimationFrame(() => {
            window.ScrollTrigger && ScrollTrigger.refresh();
          }));
      };
      ((this._recalc = recalc),
        this._ro?.disconnect?.(),
        (this._ro = new ResizeObserver(recalc)),
        this._ro.observe(document.body),
        Array.from(contentTarget.querySelectorAll("video")).forEach((v) => {
          ["loadedmetadata", "loadeddata", "canplay", "resize"].forEach(
            (evt) => {
              v.addEventListener(evt, recalc, { passive: !0 });
            },
          );
        }),
        this._onResize?.(),
        (this._onResize = () => recalc()),
        window.addEventListener("resize", this._onResize, { passive: !0 }),
        recalc());
    }
    async initParallaxScrollAnimation() {
      const parallaxElements = this.querySelectorAll(
        ".split-hero-column__content",
      );
      if (parallaxElements.length === 0) return;
      const contentTarget = parallaxElements[0],
        mediaTarget = this.querySelector(".split-hero-column__media");
      if (!contentTarget || !mediaTarget) return;
      (await this.initMorphMask(),
        window.gsap &&
          window.ScrollTrigger &&
          gsap.registerPlugin(ScrollTrigger),
        this.scene && (this.scene.destroy(!0), (this.scene = null)),
        this.controller &&
          (this.controller.destroy(!0), (this.controller = null)),
        (this.controller = new ScrollMagic.Controller()));
      const getShift = () => this.getShift(contentTarget),
        durationPx = () => Math.max(1, getShift()) + 100,
        tl = gsap.timeline({ defaults: { ease: "power2.out" } }),
        morphTo = (toD) => {
          !this.maskStartPath ||
            !toD ||
            gsap.to(this.maskStartPath, {
              morphSVG: { shape: toD, shapeIndex: "auto" },
              duration: 0.6,
              ease: "power1.inOut",
              overwrite: "auto",
            });
        };
      this._collapsedState = !1;
      const setCollapsed = (on) => {
        this._collapsedState !== on &&
          ((this._collapsedState = on),
          mediaTarget.classList.toggle("is-collapsed", on),
          morphTo(on ? this.maskEndD : this.maskStartD),
          on &&
            contentTarget
              .querySelectorAll(".animation-element")
              .forEach((el) => el.classList.add("in-view")));
      };
      tl.fromTo(
        contentTarget,
        { y: 0 },
        { y: () => -getShift(), duration: 0.1, ease: "power1.out" },
        "+=0.03",
      );
      const EPS = 0.001;
      ((this.scene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: () => durationPx(),
        triggerHook: 0,
      })
        .setTween(tl)
        .setPin(this, { pushFollowers: !0 })
        .on("progress", (e) => {
          (this.updateMaskScale?.(),
            e.progress > EPS ? setCollapsed(!0) : setCollapsed(!1));
        })
        .addTo(this.controller)),
        requestAnimationFrame(() => {
          window.ScrollTrigger && ScrollTrigger.refresh();
        }),
        this.setupAutoRecalc({ contentTarget, tl, durationPx }),
        this._resizeHandler &&
          window.removeEventListener("resize", this._resizeHandler),
        (this._resizeHandler = () => {
          this.scene &&
            (this.scene.duration(durationPx()),
            this.updateMaskScale?.(),
            this.scene.refresh(),
            requestAnimationFrame(() => {
              window.ScrollTrigger && ScrollTrigger.refresh();
            }));
        }),
        window.addEventListener("resize", this._resizeHandler, {
          passive: !0,
        }));
    }
    ensureGlobalDefs(doc) {
      const svgNS = "http://www.w3.org/2000/svg";
      let svg = doc.getElementById("split-hero-clip-defs");
      if (svg) return svg;
      ((svg = doc.createElementNS(svgNS, "svg")),
        svg.setAttribute("id", "split-hero-clip-defs"),
        (svg.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 1px;
                height: 1px;
                pointer-events: none;
                opacity: 0.001;
                overflow: hidden;
            `));
      const defs = doc.createElementNS(svgNS, "defs");
      return (svg.appendChild(defs), document.body.appendChild(svg), svg);
    }
    async fetchSvgPathAndViewBox(url) {
      const txt = await fetch(url).then((r) => r.text()),
        svg = new DOMParser()
          .parseFromString(txt, "image/svg+xml")
          .querySelector("svg"),
        shapeEl = svg.querySelector(
          "path, circle, rect, ellipse, polygon, polyline, line",
        ),
        hasTransform =
          !!shapeEl?.getAttribute("transform") ||
          !!shapeEl?.closest("g[transform]"),
        n = (v, fallback = 0) => {
          const num = parseFloat(v);
          return Number.isFinite(num) ? num : fallback;
        };
      let d = (shapeEl && shapeEl.getAttribute("d")) || "";
      if (shapeEl) {
        const tag = shapeEl.tagName.toLowerCase();
        if (tag === "circle") {
          const cx = n(shapeEl.getAttribute("cx")),
            cy = n(shapeEl.getAttribute("cy")),
            r = n(shapeEl.getAttribute("r"));
          d = `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} Z`;
        }
        if (tag === "ellipse") {
          const cx = n(shapeEl.getAttribute("cx")),
            cy = n(shapeEl.getAttribute("cy")),
            rx = n(shapeEl.getAttribute("rx")),
            ry = n(shapeEl.getAttribute("ry"));
          d = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} Z`;
        }
        if (tag === "rect") {
          const x = n(shapeEl.getAttribute("x")),
            y = n(shapeEl.getAttribute("y")),
            w = n(shapeEl.getAttribute("width")),
            h = n(shapeEl.getAttribute("height"));
          let rx = n(shapeEl.getAttribute("rx")),
            ry = n(shapeEl.getAttribute("ry"));
          (rx && !ry && (ry = rx),
            ry && !rx && (rx = ry),
            (rx = Math.min(Math.max(rx, 0), w / 2)),
            (ry = Math.min(Math.max(ry, 0), h / 2)),
            !rx && !ry
              ? (d = `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`)
              : (d = [
                  `M ${x + rx} ${y}`,
                  `H ${x + w - rx}`,
                  `A ${rx} ${ry} 0 0 1 ${x + w} ${y + ry}`,
                  `V ${y + h - ry}`,
                  `A ${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}`,
                  `H ${x + rx}`,
                  `A ${rx} ${ry} 0 0 1 ${x} ${y + h - ry}`,
                  `V ${y + ry}`,
                  `A ${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
                  "Z",
                ].join(" ")));
        }
        if (tag === "line") {
          const x1 = n(shapeEl.getAttribute("x1")),
            y1 = n(shapeEl.getAttribute("y1")),
            x2 = n(shapeEl.getAttribute("x2")),
            y2 = n(shapeEl.getAttribute("y2"));
          d = `M ${x1} ${y1} L ${x2} ${y2}`;
        }
        if (tag === "polyline" || tag === "polygon") {
          const pts = (shapeEl.getAttribute("points") || "")
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number)
            .filter(Number.isFinite);
          if (pts.length >= 4) {
            let out = `M ${pts[0]} ${pts[1]}`;
            for (let i = 2; i < pts.length && !(i + 1 >= pts.length); i += 2)
              out += ` L ${pts[i]} ${pts[i + 1]}`;
            (tag === "polygon" && (out += " Z"), (d = out));
          } else d = "";
        }
      }
      d = (d || "")
        .replace(/[\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const vb = (svg.getAttribute("viewBox") || "").trim();
      let vbX = 0,
        vbY = 0,
        vbW = 1e3,
        vbH = 700;
      return (
        vb
          ? ([vbX, vbY, vbW, vbH] = vb
              .split(/[\s,]+/)
              .filter(Boolean)
              .map(Number))
          : ((vbW = parseFloat(svg.getAttribute("width")) || 1e3),
            (vbH = parseFloat(svg.getAttribute("height")) || 700)),
        { d, vbX, vbY, vbW, vbH, hasTransform }
      );
    }
    async initMorphMask() {
      const host = this.querySelector(".split-hero-column__media-media");
      if (!host) return;
      const enabled = host.dataset.maskEnabled === "true",
        maskUrl = host.dataset.maskUrl || "";
      if (!enabled || !maskUrl.toLowerCase().includes(".svg")) return;
      const {
        d: maskD,
        vbX,
        vbY,
        vbW,
        vbH,
        hasTransform,
      } = await this.fetchSvgPathAndViewBox(maskUrl);
      hasTransform &&
        console.warn(
          "[mask] Source SVG has transforms. d-only extraction may be offset.",
        );
      const doc = host.ownerDocument,
        svgNS = "http://www.w3.org/2000/svg",
        clipId = `clip-${this.id}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
        defs = this.ensureGlobalDefs(doc).querySelector("defs");
      let clipPath = doc.getElementById(clipId);
      (clipPath
        ? clipPath.replaceChildren()
        : ((clipPath = doc.createElementNS(svgNS, "clipPath")),
          (clipPath.id = clipId),
          defs.appendChild(clipPath)),
        clipPath.setAttribute("clipPathUnits", "objectBoundingBox"));
      const startPath = doc.createElementNS(svgNS, "path");
      (startPath.setAttribute("fill-rule", "evenodd"),
        startPath.setAttribute("clip-rule", "evenodd"));
      let startD = "M0 0 H1 V1 H0 Z";
      this.maskStartD = startD;
      const endPath = doc.createElementNS(svgNS, "path");
      (endPath.setAttribute("fill-rule", "evenodd"),
        endPath.setAttribute("clip-rule", "evenodd"));
      let endD = this.normalizePathDataToBBox(maskD, vbX, vbY, vbW, vbH, 6);
      (startPath.setAttribute("d", startD),
        clipPath.replaceChildren(startPath));
      const ref = `url(#${clipId})`;
      (host.style.setProperty("clip-path", ref),
        host.style.setProperty("-webkit-clip-path", ref),
        (this.maskStartPath = startPath),
        (this.maskEndD = endD));
    }
    normalizePathDataToBBox(d, vbX, vbY, vbW, vbH, precision = 6) {
      const num = /[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi,
        fmt = (n) => (+n).toFixed(precision).replace(/\.?0+$/, ""),
        absX = (x) => (x - vbX) / vbW,
        absY = (y) => (y - vbY) / vbH,
        relX = (x) => x / vbW,
        relY = (y) => y / vbH,
        tokens = [];
      d.replace(
        /([a-zA-Z])|([-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?)/g,
        (m, c, n) => {
          tokens.push(c || n);
        },
      );
      let i = 0,
        cmd = "",
        out = "";
      const take = () => +tokens[i++];
      for (; i < tokens.length;) {
        const t = tokens[i++];
        /[a-zA-Z]/.test(t) ? ((cmd = t), (out += cmd)) : i--;
        const isRel = cmd === cmd.toLowerCase(),
          xy = () => {
            const x = take(),
              y = take(),
              nx = isRel ? relX(x) : absX(x),
              ny = isRel ? relY(y) : absY(y);
            out += `${fmt(nx)} ${fmt(ny)} `;
          },
          xOnly = () => {
            const x = take(),
              nx = isRel ? relX(x) : absX(x);
            out += `${fmt(nx)} `;
          },
          yOnly = () => {
            const y = take(),
              ny = isRel ? relY(y) : absY(y);
            out += `${fmt(ny)} `;
          };
        switch (cmd.toUpperCase()) {
          case "M":
          case "L":
          case "T":
            for (; i < tokens.length && !/[a-zA-Z]/.test(tokens[i]);) xy();
            break;
          case "H":
            for (; i < tokens.length && !/[a-zA-Z]/.test(tokens[i]);) xOnly();
            break;
          case "V":
            for (; i < tokens.length && !/[a-zA-Z]/.test(tokens[i]);) yOnly();
            break;
          case "C":
            for (; i < tokens.length && !/[a-zA-Z]/.test(tokens[i]);)
              (xy(), xy(), xy());
            break;
          case "S":
          case "Q":
            for (; i < tokens.length && !/[a-zA-Z]/.test(tokens[i]);)
              (xy(), xy());
            break;
          case "A":
            for (; i < tokens.length && !/[a-zA-Z]/.test(tokens[i]);) {
              const rx = take(),
                ry = take(),
                rot = take(),
                laf = take(),
                sf = take(),
                x = take(),
                y = take(),
                nrx = isRel ? relX(rx) : rx / vbW,
                nry = isRel ? relY(ry) : ry / vbH,
                nx = isRel ? relX(x) : absX(x),
                ny = isRel ? relY(y) : absY(y);
              out += `${fmt(nrx)} ${fmt(nry)} ${fmt(rot)} ${laf} ${sf} ${fmt(nx)} ${fmt(ny)} `;
            }
            break;
          case "Z":
            break;
        }
      }
      return out.trim();
    }
    getShift(target) {
      const sectionH = this.clientHeight,
        targetH = target.scrollHeight;
      return Math.max(0, targetH - sectionH);
    }
  }
  customElements.define("split-hero", SplitHero);
}
//# sourceMappingURL=/cdn/shop/t/7/assets/split-hero.js.map?v=40255156019615816391779297502
