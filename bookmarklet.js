// To install, minify the following JS code (including the `javascript:` part) and paste it in the `URL` field of a new Bookmark.
//You can now click on the bookmark while visiting any page, to start the evaluation

javascript: (() => {
    function e(e) {
        let t = document.createElement("style");
        return t.textContent = e, document.documentElement.appendChild(t), t
    }
    let t = /url\((?:'([^']*)'|"([^"]*)"|([^)]+))\)/g,
        n = e => /\.(gif|apng|webp)(?:[?#].*)?$/i.test(e || ""),
        i = e => /\.svg(?:[?#].*)?$/i.test(e || "");

    function a(e) {
        if (!e) return NaN;
        if (e = String(e).trim(), /^\d+(\.\d+)?ms$/i.test(e)) return parseFloat(e) / 1e3;
        if (/^\d+(\.\d+)?s$/i.test(e)) return parseFloat(e);
        if (/^\d{1,2}:\d{2}:\d{2}(\.\d+)?$/.test(e)) {
            let [t, n, i] = e.split(":").map(Number);
            return 3600 * t + 60 * n + i
        }
        if (/^\d{1,2}:\d{2}(\.\d+)?$/.test(e)) {
            let [a, l] = e.split(":").map(Number);
            return 60 * a + l
        }
        let r = Number(e);
        return Number.isFinite(r) ? r : NaN
    }

    function l(e) {
        try {
            return getComputedStyle(e)
        } catch {
            return null
        }
    }

    function r(e) {
        let t = l(e);
        if (!t) return {
            hasAnim: !1
        };
        let n = (t.animationName || "").split(",")[0]?.trim() || null, i = parseFloat((t.animationDuration || "").split(",")[0]) || 0, a = (t.animationIterationCount || "").split(",")?.[0] || "1", r = /infinite/i.test(a);
        return {
            hasAnim: !!(n && "none" !== n),
            name: n,
            duration: i,
            infinite: r
        }
    }

    function o(e) {
        let t = l(e);
        if (!t) return !1;
        let n = parseFloat((t.transitionDuration || "0s").split(",")[0]) || 0;
        return n > 0
    }

    function s(e) {
        if ("IMG" !== e.tagName) return !1;
        let t = e.currentSrc || e.src || "";
        if (/\.(gif|apng|webp)(?:[?#].*)?$/i.test(t)) return !0;
        // Also check <source> srcset siblings in <picture> (e.g. Giphy embeds with webp source)
        let pic = e.closest("picture");
        if (pic) {
            for (let src of pic.querySelectorAll("source")) {
                if (/\.(gif|apng|webp)(?:[?#].*)?$/i.test(src.srcset || "")) return !0;
            }
        }
        return !1;
    }

    function isGifVideo(e) {
        if ("VIDEO" !== e.tagName) return !1;
        // Matches video elements whose src is a GIF served as video (e.g. reddit gif→mp4)
        let src = e.currentSrc || e.src || e.getAttribute("src") || "";
        return /\.gif(?:[?#&]|$)/i.test(src);
    }

    function d(e) {
        let n = l(e);
        if (!n) return [];
        let i = n.backgroundImage || "", a = [], r;
        for (; null !== (r = t.exec(i));) a.push(r[1] || r[2] || r[3] || "");
        return a.filter(Boolean)
    }

    function p(e) {
        return "VIDEO" !== e.tagName ? null : {
            el: e,
            autoplay: !!e.autoplay,
            loop: !!e.loop,
            controls: !!e.controls
        }
    }

    function u(e = document) {
        let t = [], n = e.querySelectorAll("animate,%20animateTransform,%20animateMotion,%20set");
        return n.forEach(e => {
            let n = e.closest("svg"), i = e.tagName, l = e.getAttribute("attributeName") || "", r = e.getAttribute("dur") || "", o = e.getAttribute("repeatCount") || "", s = a(r), d = /indefinite/i.test(o);
            t.push({
                el: e,
                svg: n,
                tag: i,
                attributeName: l,
                dur: r || null,
                durSec: Number.isFinite(s) ? s : null,
                repeatCount: o || null,
                indefinite: d
            })
        }), t
    }

    function c() {
        if (!document.getAnimations) return [];
        let e = document.getAnimations({
            subtree: !0
        }), t = [];
        return e.forEach(e => {
            let n = "undefined" != typeof CSSAnimation && e instanceof CSSAnimation, i = "undefined" != typeof CSSTransition && e instanceof CSSTransition;
            if (n || i) return;
            let a, l;
            try {
                let r = e.effect?.getTiming?.();
                a = r?.iterations, l = "number" == typeof r?.duration ? r.duration / 1e3 : parseFloat(r?.duration) / 1e3
            } catch { }
            t.push({
                anim: e,
                target: e.effect?.target || null,
                playState: e.playState,
                currentTime: e.currentTime,
                iterations: a,
                duration: Number.isFinite(l) ? l : null,
                infinite: a === 1 / 0
            })
        }), t
    }

    function m() {
        return {
            marquee: Array.from(document.querySelectorAll("marquee")),
            blink: Array.from(document.querySelectorAll("blink"))
        }
    }

    function g() {
        let e = Array.from(document.querySelectorAll('img[src$=".svg"],%20img[src*=".svg?"]')), t = Array.from(document.querySelectorAll('object[type="image/svg+xml"],%20embed[type="image/svg+xml"]')), n = Array.from(document.querySelectorAll('iframe[src$=".svg"],%20iframe[src*=".svg?"]'));
        return {
            imgs: e,
            objs: t,
            ifr: n
        }
    }

    function f() {
        let e = Array.from(document.querySelectorAll("lottie-player,%20dotlottie-player")), t = (window.lottie?.getRegisteredAnimations?.() || []).length || 0;
        return {
            players: e,
            libCount: t
        }
    }

    function h(e) {
        let t = l(e);
        if (!t) return !1;
        let n = (t.animationTimeline || t.animationTimelineName || "auto").trim();
        if (n && "auto" !== n && "none" !== n) return !0;
        let i = (t.viewTimelineName || "").trim();
        return !!(i && "none" !== i)
    }
    let y = 0;
    if (!window.__pse_rafPatched__) {
        let b = window.requestAnimationFrame?.bind(window);
        b && (window.requestAnimationFrame = function (e) {
            return y++, b(e)
        }, window.__pse_rafPatched__ = !0)
    }
    let activeCanvases = window.__pse_activeCanvases || (window.__pse_activeCanvases = new Set());
    if (!window.__pse_canvasPatched__) {
        let patchDraw = (proto, methods) => {
            methods.forEach(method => {
                let orig = proto[method];
                if (!orig) return;
                proto[method] = function (...args) {
                    if (window.__pse_paused) return; // block all draws while paused
                    if (this.canvas) activeCanvases.add(this.canvas);
                    return orig.apply(this, args)
                }
            })
        };
        patchDraw(CanvasRenderingContext2D.prototype, ["drawImage", "fillRect", "strokeRect", "clearRect", "putImageData", "fill", "stroke", "fillText", "strokeText"]);
        if (window.WebGLRenderingContext) patchDraw(WebGLRenderingContext.prototype, ["drawArrays", "drawElements"]);
        if (window.WebGL2RenderingContext) patchDraw(WebGL2RenderingContext.prototype, ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced", "drawRangeElements"]);
        if (window.ImageBitmapRenderingContext) patchDraw(ImageBitmapRenderingContext.prototype, ["transferFromImageBitmap"]);
        window.__pse_canvasPatched__ = !0
    }

    function detectCanvas() {
        let all = Array.from(document.querySelectorAll("canvas")),
            active = all.filter(c => window.__pse_activeCanvases?.has(c));
        return { all, active }
    }

    function C(e = document.body) {
        let t = {
            animatedCss: [],
            fastInfiniteAnim: [],
            transitions: [],
            animatedImages: [],
            bgAnimatedImages: [],
            bgSvgPotential: [],
            videos: [],
            gifVideos: [],
            svgSmil: [],
            svgSmilFastOrInfinite: [],
            waapi: [],
            waapiFastOrInfinite: [],
            legacy: {
                marquee: [],
                blink: []
            },
            externalSvg: {
                imgs: [],
                objs: [],
                ifr: []
            },
            scrollLinked: [],
            lottie: {
                players: [],
                libCount: 0
            },
            rafObserved: 0,
            canvas: {
                all: [],
                active: []
            }
        }, a = e => {
            l(e);
            let u = r(e);
            if (u.hasAnim && (t.animatedCss.push({
                el: e,
                ...u
            }), u.infinite && u.duration > 0 && u.duration <= .33 && t.fastInfiniteAnim.push({
                el: e,
                ...u
            })), o(e) && t.transitions.push({
                el: e
            }), s(e)) {
                let c = e.currentSrc || e.src || "";
                t.animatedImages.push({
                    el: e,
                    src: c
                })
            }
            let m = d(e);
            if (m.forEach(a => {
                n(a) ? t.bgAnimatedImages.push({
                    el: e,
                    url: a
                }) : i(a) && t.bgSvgPotential.push({
                    el: e,
                    url: a
                })
            }), "VIDEO" === e.tagName) {
                let g = p(e);
                g && t.videos.push(g);
                if (isGifVideo(e)) t.gifVideos.push({ el: e, src: e.src || e.getAttribute("src") || "" });
            }
            try {
                h(e) && t.scrollLinked.push({
                    el: e
                })
            } catch { }
            e.children && e.children.length && Array.from(e.children).forEach(a)
        };
        a(e);
        let b = u(document);
        t.svgSmil = b, b.forEach(e => {
            let n = null != e.durSec && e.durSec > 0 && e.durSec <= .33;
            (e.indefinite || n) && t.svgSmilFastOrInfinite.push(e)
        });
        let C = c();
        return t.waapi = C, C.forEach(e => {
            let n = null != e.duration && e.duration > 0 && e.duration <= .33;
            (e.infinite || n) && t.waapiFastOrInfinite.push(e)
        }), t.legacy = m(), t.externalSvg = g(), t.lottie = f(), t.rafObserved = y, t.canvas = detectCanvas(), t
    }

    // Snapshot all canvases, then 150ms later compare pixels.
    // Adds any that changed to activeCanvases (catches setInterval-driven draws
    // that don't fire within the first rAF frame) and calls onChanged().
    function pixelDiffCanvases(onChanged) {
        const snapshots = Array.from(document.querySelectorAll("canvas")).map(c => {
            try { return { c, data: c.toDataURL() }; } catch { return null; }
        }).filter(Boolean);
        if (!snapshots.length) return;
        setTimeout(() => {
            let changed = false;
            snapshots.forEach(({ c, data }) => {
                try { if (c.toDataURL() !== data) { activeCanvases.add(c); changed = true; } } catch { }
            });
            if (changed) onChanged();
        }, 150);
    }

    // ── Scoring ────────────────────────────────────────────────────────────
    // Returns { score 0-100, band, color, topDriver } from static element
    // analysis weighted by visible viewport area, plus a dynamic bonus from
    // the 5-second live measurement window.
    function computeScore(data, dynBonus) {
        const vp = Math.max(1, window.innerWidth * window.innerHeight);
        // Fraction of viewport visibly covered by el (0-1)
        const af = el => {
            try {
                const r = el.getBoundingClientRect();
                const w = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
                const h = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
                return Math.min(1, w * h / vp);
            } catch { return 0; }
        };
        let score = 0, topDriver = "no animations detected", topVal = 0;
        const add = (pts, driver) => {
            if (pts <= 0) return;
            score += pts;
            if (pts > topVal) { topVal = pts; topDriver = driver; }
        };
        // Static contributors (area × frequency weight)
        data.fastInfiniteAnim.forEach(x => add(15 * af(x.el), "fast+infinite CSS animations"));
        data.animatedCss.filter(x => x.infinite && x.duration > .33).forEach(x => add(8 * af(x.el), "infinite CSS animations"));
        // Option B: finite CSS animations — previously scored 0. Short ones (≤0.5s) carry real
        // flash risk even firing once; longer ones are lower but non-zero.
        data.animatedCss.filter(x => !x.infinite).forEach(x => {
            const pts = x.duration <= 0.5 ? 4 * af(x.el) : 1.5 * af(x.el);
            add(pts, x.duration <= 0.5 ? "short finite CSS animations" : "finite CSS animations");
        });
        // Floor of 2pts so a grid of small GIFs always registers; max 30 for large ones.
        data.animatedImages.forEach(x => add(Math.max(2, 30 * af(x.el)), "animated GIF/APNG/WebP images"));
        // GIF videos (e.g. Reddit/Giphy serving GIFs as video elements) — equally disruptive.
        data.gifVideos.forEach(x => add(Math.max(2, 30 * af(x.el)), "GIF videos"));
        data.bgAnimatedImages.forEach(x => add(5 * af(x.el), "animated backgrounds"));
        data.videos.filter(v => v.autoplay || v.loop).forEach(v => add(12 * af(v.el), "autoplay/loop videos"));
        data.svgSmilFastOrInfinite.forEach(x => add(10 * af(x.svg || x.el), "fast/infinite SVG SMIL"));
        data.waapiFastOrInfinite.forEach(x => add(10 * af(x.target || document.documentElement), "fast/infinite WAAPI"));
        [...(data.legacy.marquee || []), ...(data.legacy.blink || [])].forEach(() => add(10, "marquee/blink elements"));
        data.canvas.active.forEach(c => add(10 * af(c), "animated canvas"));
        data.lottie.players.forEach(el => add(5 * af(el), "Lottie animations"));
        data.scrollLinked.forEach(x => add(5 * af(x.el), "scroll-linked animations"));
        // Quantity escalator: many simultaneous animations are disproportionately worse.
        // Uses ln-scaling so impact grows meaningfully but can't run away.
        // c=0.4 → 5 anims ≈ +72%, 10 ≈ +96%, 20 ≈ +122%.
        const totalCount =
            data.fastInfiniteAnim.length +
            data.animatedCss.filter(x => x.infinite && x.duration > .33).length +
            data.animatedCss.filter(x => !x.infinite).length +       // Option B: finite CSS animations
            data.animatedImages.length +
            data.gifVideos.length +
            data.bgAnimatedImages.length +
            data.videos.filter(v => v.autoplay || v.loop).length +
            data.svgSmilFastOrInfinite.length +
            data.waapiFastOrInfinite.length +
            (data.legacy.marquee || []).length + (data.legacy.blink || []).length +
            data.canvas.active.length +
            data.lottie.players.length +
            data.scrollLinked.length;
        if (totalCount > 0) score *= (1 + 0.4 * Math.log(totalCount + 1));
        score = Math.min(100, Math.round(score + dynBonus));
        const [band, color] = score >= 76 ? ["Critical", "#c62828"] :
            score >= 51 ? ["High", "#e65100"] :
                score >= 26 ? ["Moderate", "#f57f17"] :
                    ["Low", "#2e7d32"];
        return { score, band, color, topDriver };
    }

    function $() {
        // ── Panel shell ──────────────────────────────────────────────────
        let t = document.createElement("div");
        t.id = "pse-panel";
        Object.assign(t.style, {
            position: "fixed", zIndex: 2147483647, top: "12px", right: "12px",
            width: "380px", maxHeight: "80vh", overflow: "auto",
            background: "#111", color: "#fff",
            font: "12px/1.5 system-ui,Segoe UI,Roboto,Helvetica,Arial",
            border: "2px solid #444", borderRadius: "8px",
            boxShadow: "0 6px 24px rgba(0,0,0,.45)", padding: "12px"
        });

        // ── Header ───────────────────────────────────────────────────────
        let header = document.createElement("div");
        Object.assign(header.style, { display: "flex", justifyContent: "space-between", alignItems: "flex-start" });
        let titleEl = document.createElement("div");
        Object.assign(titleEl.style, { fontWeight: "700", fontSize: "13px", lineHeight: "1.35" });
        titleEl.appendChild(document.createTextNode("Photosensitive Epilepsy"));
        titleEl.appendChild(document.createElement("br"));
        titleEl.appendChild(document.createTextNode("& Distraction Risk"));
        let closeBtn = document.createElement("button");
        closeBtn.type = "button"; closeBtn.textContent = "\u2715";
        Object.assign(closeBtn.style, {
            border: "0", borderRadius: "6px", background: "#333", color: "#fff",
            width: "28px", height: "24px", cursor: "pointer", lineHeight: "24px",
            textAlign: "center", flexShrink: "0"
        });
        header.appendChild(titleEl); header.appendChild(closeBtn);

        // ── Score area ───────────────────────────────────────────────────
        let scoreArea = document.createElement("div");
        Object.assign(scoreArea.style, { marginTop: "10px", padding: "10px 12px", borderRadius: "6px", background: "#1a1a1a" });
        let scoreRow = document.createElement("div");
        Object.assign(scoreRow.style, { display: "flex", alignItems: "baseline", gap: "8px" });
        let scoreNum = document.createElement("span");
        Object.assign(scoreNum.style, { fontSize: "44px", fontWeight: "800", lineHeight: "1", color: "#666" });
        scoreNum.textContent = "\u2014";
        let scoreMaxEl = document.createElement("span");
        scoreMaxEl.textContent = "/ 100";
        Object.assign(scoreMaxEl.style, { opacity: "0.4", fontSize: "14px" });
        let bandLabel = document.createElement("span");
        Object.assign(bandLabel.style, { fontWeight: "700", fontSize: "13px", marginLeft: "auto" });
        scoreRow.appendChild(scoreNum); scoreRow.appendChild(scoreMaxEl); scoreRow.appendChild(bandLabel);
        let driverText = document.createElement("div");
        Object.assign(driverText.style, { fontSize: "11px", opacity: "0.7", marginTop: "4px" });
        // Progress bar (hidden until evaluation starts)
        let evalBar = document.createElement("div");
        Object.assign(evalBar.style, { marginTop: "8px", display: "none" });
        let evalTrack = document.createElement("div");
        Object.assign(evalTrack.style, { height: "4px", borderRadius: "2px", background: "#333", overflow: "hidden" });
        let evalFill = document.createElement("div");
        Object.assign(evalFill.style, { height: "100%", width: "0%", background: "#1565c0", transition: "width 0.9s linear" });
        evalTrack.appendChild(evalFill);
        let evalLabel = document.createElement("div");
        Object.assign(evalLabel.style, { fontSize: "11px", opacity: "0.7", marginTop: "3px" });
        evalBar.appendChild(evalTrack); evalBar.appendChild(evalLabel);
        scoreArea.appendChild(scoreRow); scoreArea.appendChild(driverText); scoreArea.appendChild(evalBar);

        // ── Buttons ──────────────────────────────────────────────────────
        let btnRow = document.createElement("div");
        btnRow.style.marginTop = "8px";
        let pauseBtn = document.createElement("button");
        pauseBtn.textContent = "Pause ALL";
        pauseBtn.style.cssText = "border:0;border-radius:6px;background:#7b1fa2;color:#fff;padding:6px 8px;cursor:pointer;font-size:11px";
        let resumeBtn = document.createElement("button");
        resumeBtn.textContent = "Resume";
        resumeBtn.style.cssText = "margin-left:6px;border:0;border-radius:6px;background:#2e7d32;color:#fff;padding:6px 8px;cursor:pointer;font-size:11px";
        let evalBtn = document.createElement("button");
        evalBtn.textContent = "Re-evaluate 5s \u21ba";
        evalBtn.style.cssText = "margin-left:6px;border:0;border-radius:6px;background:#1565c0;color:#fff;padding:6px 8px;cursor:pointer;font-size:11px";
        btnRow.appendChild(pauseBtn); btnRow.appendChild(resumeBtn); btnRow.appendChild(evalBtn);

        // ── Disclaimer ───────────────────────────────────────────────────
        let disclaimer = document.createElement("div");
        disclaimer.style.cssText = "margin-top:8px;font-size:10px;color:#f1a800;background:#2a2000;border:1px solid #f1a80055;border-radius:6px;padding:6px 8px;line-height:1.4";
        disclaimer.textContent = "⚠️ This tool may not detect all animations. It can also score non-problematic animations. Use with caution.";

        // ── Details toggle ────────────────────────────────────────────────
        let detailsToggle = document.createElement("button");
        detailsToggle.style.cssText = "margin-top:8px;display:block;width:100%;background:#1a1a1a;color:#bbb;border:0;border-radius:6px;padding:6px 8px;cursor:pointer;text-align:left;font-size:11px";
        detailsToggle.textContent = "\u25b6  Details";
        let d = document.createElement("div");
        d.style.display = "none";

        // ── Hint ─────────────────────────────────────────────────────────
        let p = document.createElement("div");
        p.style.cssText = "margin-top:8px;font-size:10px;opacity:.5;line-height:1.4";
        p.textContent = "Score: element visible area \u00d7 frequency (static) + 5s live rAF & DOM mutation density. Bands: Low 0-25 / Moderate 26-50 / High 51-75 / Critical 76-100. Inspired by WCAG 2.2 / Harding.";

        // ── Internal state ────────────────────────────────────────────────
        let styleEl = null, mutObs = null, dynBonus = 0, evaluating = false, detailsOpen = false;
        const pausedVideos = new Set();
        const frozenImgs = new Map(); // img el → original src

        let lastScanData = null;

        // ── Helpers ───────────────────────────────────────────────────────
        function mkList(arr, labelFn) {
            let ul = document.createElement("ul");
            ul.style.cssText = "margin:4px 0 8px;padding-left:16px";
            if (!arr || !arr.length) {
                let li = document.createElement("li"); li.textContent = "None"; ul.appendChild(li); return ul;
            }
            arr.forEach((item, idx) => {
                let li = document.createElement("li");
                li.textContent = `${idx + 1}. ${labelFn(item) || ""}`;
                ul.appendChild(li);
            });
            return ul;
        }
        function mkRow(label, val) { let div = document.createElement("div"); div.textContent = `${label}: ${val}`; return div; }
        function mkHead(text) { let div = document.createElement("div"); div.textContent = text; div.style.cssText = "margin-top:8px;font-weight:600"; return div; }

        // ── Score render (in-place, no full rebuild) ──────────────────────
        function renderScore(data) {
            const { score, band, color, topDriver } = computeScore(data, dynBonus);
            scoreNum.textContent = score;
            scoreNum.style.color = color;
            bandLabel.textContent = band.toUpperCase();
            bandLabel.style.color = color;
            driverText.textContent = score > 0 ? `Primarily: ${topDriver}` : "No significant animation risk detected";
            t.style.borderColor = color;
        }

        // ── Details render ────────────────────────────────────────────────
        function renderDetails(data) {
            d.replaceChildren();
            d.appendChild(mkHead("Counts"));
            d.appendChild(mkRow("CSS animations", data.animatedCss.length));
            d.appendChild(mkRow("\u26a0\ufe0f Fast & infinite CSS", data.fastInfiniteAnim.length));
            d.appendChild(mkRow("Transitions", data.transitions.length));
            d.appendChild(mkRow("Animated (GIF/APNG/WebP)", data.animatedImages.length));
            d.appendChild(mkRow("GIF videos (video as GIF)", data.gifVideos.length));
            d.appendChild(mkRow("Animated background-image", data.bgAnimatedImages.length));
            d.appendChild(mkRow("Potential animated BG (SVG)", data.bgSvgPotential.length));
            d.appendChild(mkRow("Videos (autoplay/loop)", data.videos.length));
            d.appendChild(mkRow("SVG SMIL elements", data.svgSmil.length));
            d.appendChild(mkRow("\u26a0\ufe0f Fast & infinite SMIL", data.svgSmilFastOrInfinite.length));
            d.appendChild(mkRow("WAAPI animations", data.waapi.length));
            d.appendChild(mkRow("\u26a0\ufe0f Fast & infinite WAAPI", data.waapiFastOrInfinite.length));
            d.appendChild(mkRow("Scroll-linked (timeline)", data.scrollLinked.length));
            d.appendChild(mkRow("Legacy <marquee>/<blink>", data.legacy.marquee.length + data.legacy.blink.length));
            d.appendChild(mkRow("External SVG containers", data.externalSvg.imgs.length + data.externalSvg.objs.length + data.externalSvg.ifr.length));
            d.appendChild(mkRow("Lottie players / reg.", `${data.lottie.players.length} / ${data.lottie.libCount}`));
            d.appendChild(mkRow("rAF calls observed", data.rafObserved));
            d.appendChild(mkRow("Canvas (total / active)", `${data.canvas.all.length} / ${data.canvas.active.length}`));
            d.appendChild(mkHead("Fast & infinite CSS"));
            d.appendChild(mkList(data.fastInfiniteAnim, x => (x.name || x.el?.tagName || "").toString()));
            d.appendChild(mkHead("Animated images"));
            d.appendChild(mkList(data.animatedImages, x => (x.src || "").slice(0, 120)));
            d.appendChild(mkHead("GIF videos"));
            d.appendChild(mkList(data.gifVideos, x => (x.src || "").slice(0, 120)));
            d.appendChild(mkHead("Animated backgrounds"));
            d.appendChild(mkList(data.bgAnimatedImages, x => (x.url || "").slice(0, 120)));
            d.appendChild(mkHead("Potential SVG backgrounds"));
            d.appendChild(mkList(data.bgSvgPotential, x => (x.url || "").slice(0, 120)));
            d.appendChild(mkHead("Videos (risk: autoplay/loop/no controls)"));
            d.appendChild(mkList(data.videos, v => `autoplay:${v.autoplay} \u2022 loop:${v.loop} \u2022 controls:${v.controls}`));
            d.appendChild(mkHead("SVG SMIL"));
            d.appendChild(mkList(data.svgSmil, x => {
                let tag = x.tag || "animate", attr = x.attributeName || "", dur = x.dur || "", rc = x.repeatCount || "";
                return `<${tag} attributeName="${attr}" dur="${dur}" repeatCount="${rc}">`;
            }));
            d.appendChild(mkHead("WAAPI"));
            d.appendChild(mkList(data.waapi, x => {
                let parts = [x.playState || ""];
                if (x.duration != null) parts.push(`${x.duration}s`);
                if (x.infinite) parts.push("infinite");
                return parts.filter(Boolean).join(" \u2022 ");
            }));
            d.appendChild(mkHead("Scroll-linked"));
            d.appendChild(mkList(data.scrollLinked, () => "element uses non-default animation/view timeline"));
            d.appendChild(mkHead("Legacy tags"));
            d.appendChild(mkList([...data.legacy.marquee, ...data.legacy.blink], el => `<${el.tagName.toLowerCase()}>`));
            d.appendChild(mkHead("External SVG containers"));
            const svgItems = [
                ...data.externalSvg.imgs.map(el => ({ type: "img", el })),
                ...data.externalSvg.objs.map(el => ({ type: "object", el })),
                ...data.externalSvg.ifr.map(el => ({ type: "iframe", el }))
            ];
            d.appendChild(mkList(svgItems, x => `<${x.type}>`));
            d.appendChild(mkHead("Canvas (drawing active)"));
            d.appendChild(mkList(data.canvas.active, el => `<canvas${el.id ? ` id="${el.id}"` : ""} ${el.width}x${el.height}>`));
        }

        // ── Full render ───────────────────────────────────────────────────
        function h() {
            const data = C(document.body);
            lastScanData = data; // kept so pauseBtn can freeze detected animated images
            renderScore(data);
            renderDetails(data);
        }

        // ── 5-second evaluation runner ────────────────────────────────────
        function startEvaluation() {
            if (evaluating) return;
            evaluating = true;
            evalBtn.disabled = true; evalBtn.style.opacity = "0.5";
            // Reset bar with no transition, then re-enable it so animation plays
            evalFill.style.transition = "none"; evalFill.style.width = "0%";
            evalBar.style.display = "block";
            void evalFill.offsetWidth; // force reflow
            evalFill.style.transition = "width 0.9s linear";
            evalLabel.textContent = "Evaluating\u2026 5s remaining";
            const rafStart = y;
            let mutCount = 0, animCount = 0;
            const mo = new MutationObserver(() => mutCount++);
            mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
            // Count animationstart events to catch JS-triggered finite animation replays
            const onAnimStart = () => animCount++;
            document.addEventListener('animationstart', onAnimStart);
            let elapsed = 0;
            const tick = setInterval(() => {
                elapsed++;
                evalFill.style.width = `${(elapsed / 5) * 100}%`;
                evalLabel.textContent = `Evaluating\u2026 ${5 - elapsed}s remaining`;
                if (elapsed >= 5) {
                    clearInterval(tick);
                    mo.disconnect();
                    document.removeEventListener('animationstart', onAnimStart);
                    const rafHz = (y - rafStart) / 5;
                    const mutHz = mutCount / 5;
                    const animHz = animCount / 5;
                    // Option A: continuous rAF formula — dead zone <3Hz, linear 1.3pts/Hz above.
                    // Calibration: 1/s→0, 7/s→5, 30/s→35, 41/s→49, 60+→50.
                    const rafBonus = Math.max(0, Math.min(50, (rafHz - 3) * 1.3));
                    // Mutations are an indirect signal — lower ceiling to 10.
                    const mutBonus = mutHz > 20 ? 10 : mutHz > 5 ? 6 : mutHz > 1 ? 2 : 0;
                    // Option C: animationstart rate — detects JS-replayed finite animations.
                    // Calibration: 2/s→5, 5/s→8, 20/s→16, 50+/s→25.
                    const animBonus = Math.min(25, Math.pow(Math.max(0, animHz), 0.6) * 3);
                    dynBonus = Math.round(rafBonus + mutBonus + animBonus);
                    evaluating = false;
                    evalBtn.disabled = false; evalBtn.style.opacity = "1";
                    evalLabel.textContent = `Done \u2014 rAF: ${Math.round(rafHz)}/s, mut: ${Math.round(mutHz)}/s, animStart: ${Math.round(animHz)}/s`;
                    h();
                    pixelDiffCanvases(h);
                }
            }, 1000);
        }

        // ── Event handlers ────────────────────────────────────────────────
        closeBtn.onclick = () => {
            t.remove(); styleEl?.remove(); mutObs?.disconnect();
            window.__pse_paused = false;
            try { document.querySelectorAll("svg").forEach(el => el.unpauseAnimations?.()); } catch { }
            try { document.getAnimations?.().forEach(a => a.play?.()); } catch { }
            pausedVideos.forEach(v => v.play().catch(() => { })); pausedVideos.clear();
            frozenImgs.forEach((src, el) => { el.src = src; }); frozenImgs.clear();
        };
        pauseBtn.onclick = () => {
            styleEl?.remove();
            styleEl = e("*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}");
            try { document.getAnimations?.().forEach(a => a.pause?.()); } catch { }
            try { document.querySelectorAll("svg").forEach(el => el.pauseAnimations?.()); } catch { }
            // Videos: only pause ones that were already playing
            document.querySelectorAll("video").forEach(v => { if (!v.paused) { pausedVideos.add(v); v.pause(); } });
            window.__pse_paused = true; // canvas: block all 2D/WebGL draws
            // GIFs: replace src with a frozen frame snapshot; fall back to src="" for cross-origin
            (lastScanData?.animatedImages || []).forEach(({ el }) => {
                if (frozenImgs.has(el)) return;
                try {
                    const cvs = document.createElement("canvas");
                    cvs.width = el.naturalWidth || el.width || 1;
                    cvs.height = el.naturalHeight || el.height || 1;
                    cvs.getContext("2d").drawImage(el, 0, 0);
                    frozenImgs.set(el, el.src);
                    el.src = cvs.toDataURL();
                } catch {
                    // Cross-origin canvas taint → blank src to stop animation
                    frozenImgs.set(el, el.src);
                    el.src = "";
                }
            });
            // GIF videos (video elements serving GIFs): blank src to stop playback
            (lastScanData?.gifVideos || []).forEach(({ el }) => {
                if (frozenImgs.has(el)) return;
                const src = el.src || el.getAttribute("src") || "";
                if (!src) return;
                frozenImgs.set(el, src);
                el.src = "";
            });
        };
        resumeBtn.onclick = () => {
            styleEl?.remove(); styleEl = null;
            try { document.getAnimations?.().forEach(a => a.play?.()); } catch { }
            try { document.querySelectorAll("svg").forEach(el => el.unpauseAnimations?.()); } catch { }
            pausedVideos.forEach(v => v.play().catch(() => { })); pausedVideos.clear();
            window.__pse_paused = false; // canvas: re-allow draws
            frozenImgs.forEach((src, el) => { el.src = src; }); frozenImgs.clear();
        };
        evalBtn.onclick = () => startEvaluation();
        detailsToggle.onclick = () => {
            detailsOpen = !detailsOpen;
            d.style.display = detailsOpen ? "block" : "none";
            detailsToggle.textContent = (detailsOpen ? "\u25bc" : "\u25b6") + "  Details";
        };

        // ── Assemble ─────────────────────────────────────────────────────
        t.appendChild(header);
        t.appendChild(scoreArea);
        t.appendChild(btnRow);
        t.appendChild(disclaimer);
        t.appendChild(detailsToggle);
        t.appendChild(d);
        t.appendChild(p);
        document.body.appendChild(t);

        // ── Auto-rescan on DOM changes ────────────────────────────────────
        mutObs = new MutationObserver(() => {
            clearTimeout(window.__pse_scan_to);
            window.__pse_scan_to = setTimeout(h, 300);
        });
        mutObs.observe(document.body, {
            subtree: true, childList: true, attributes: true,
            attributeFilter: ["class", "style"]
        });

        // ── First render: 1 rAF defer, then auto-start 5s evaluation ─────
        requestAnimationFrame(() => {
            h();
            pixelDiffCanvases(h);
            startEvaluation();
        });
    }
    $()
})();
