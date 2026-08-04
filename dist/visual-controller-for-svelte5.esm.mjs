import e from "ask-for-promise";
import { mount as t, unmount as n } from "svelte";
//#region src/dim.js
function r() {
	let e = {}, t = {};
	function n(n, ...r) {
		let i = document.createTextNode(""), a = document.createTextNode(""), o = n({
			start: i,
			end: a
		}, ...r);
		if (!i.parentNode || !a.parentNode) throw Error("dim.set: callback must attach both \"start\" and \"end\" markers to the DOM");
		let s = document.createRange();
		s.setStartAfter(i), s.setEndBefore(a);
		let c = {
			isEmpty() {
				return !i.isConnected || !a.isConnected ? !0 : (s.setStartAfter(i), s.setEndBefore(a), s.collapsed);
			},
			getContext() {
				return i.isConnected && a.isConnected ? s.commonAncestorContainer : null;
			},
			destroy() {
				i.isConnected && i.parentNode.removeChild(i), a.isConnected && a.parentNode.removeChild(a);
			}
		};
		o && (t[o] = c), e[Object.keys(e).length] = c;
	}
	function r(n) {
		if (!(typeof n != "string" && !Array.isArray(n))) return typeof n == "string" && n.includes(",") && (n = n.split(",").map((e) => e.trim())), Array.isArray(n) ? n.map((n) => t[n] || e[n]) : t[n] || e[n];
	}
	function i() {
		let n = /* @__PURE__ */ new Set();
		for (let t of Object.values(e)) n.add(t);
		for (let e of Object.values(t)) n.add(e);
		for (let e of n) e.destroy();
		for (let t of Object.keys(e)) delete e[t];
		for (let e of Object.keys(t)) delete t[e];
	}
	function a() {
		return Object.keys(t);
	}
	return {
		set: n,
		get: r,
		reset: i,
		aliases: a
	};
}
//#endregion
//#region src/main.js
function i(i = {}) {
	let a = {}, o = /* @__PURE__ */ new Set(), s = {}, c = r();
	function l(e, ...t) {
		let n = null, r = null;
		c.set((t, ...i) => {
			r = t;
			let a = e(t, ...i);
			return typeof a == "string" && (n = a), a;
		}, ...t), n && (o.add(n), s[n] = r);
	}
	function u(n, r, o = {}, c = {}) {
		let l = e();
		if (!r) return console.error("Error: Component is undefined"), l.done(!1), l.promise;
		if (!n || typeof n != "string") return console.error("Error: Alias is missing or invalid"), l.done(!1), l.promise;
		let u = s[n];
		if (!u || !u.start.isConnected || !u.end.isConnected) return console.error(`Error: Region "${n}" was not defined or its markers are orphaned. Call html.set(...) first.`), l.done(!1), l.promise;
		a[n] && d(n);
		let f = [], p = u.start.nextSibling;
		for (; p && p !== u.end;) f.push(p), p = p.nextSibling;
		let m;
		if (f.length === 0) m = document.createElement("span"), m.style.display = "contents", u.end.parentNode.insertBefore(m, u.end);
		else if (f.length === 1 && f[0].nodeType === 1) m = f[0];
		else {
			let e = document.createElement("span");
			e.style.display = "contents", u.end.parentNode.insertBefore(e, u.end), f.forEach((t) => e.appendChild(t)), m = e;
		}
		let h = {
			app: null,
			mountSpan: m,
			setupUpdates: {}
		};
		a[n] = h;
		let g = (e) => {
			h.setupUpdates = e;
		}, _ = {
			dependencies: i,
			...o,
			setupUpdates: g
		};
		return h.app = t(r, {
			target: m,
			props: _
		}), l.done(h.setupUpdates), l.promise;
	}
	function d(e) {
		if (e === void 0) {
			let e = 0;
			for (let t of Object.keys(a)) d(t), e++;
			return e;
		}
		if (Array.isArray(e)) {
			let t = 0;
			for (let n of e) typeof n == "string" && a[n] && (d(n), t++);
			return t;
		}
		if (typeof e != "string") return console.error("Error: destroy() expects a string alias or an array of strings"), !1;
		let t = a[e];
		return t ? (t.app && n(t.app), t.mountSpan.parentNode && t.mountSpan.parentNode.removeChild(t.mountSpan), delete a[e], !0) : !1;
	}
	function f(e) {
		return !!a[e];
	}
	function p(e) {
		let t = a[e];
		return t ? t.setupUpdates : (console.error(`App with alias: "${e}" was not found.`), !1);
	}
	function m() {
		return Array.from(o);
	}
	function h(e) {
		if (!e || typeof e != "string") {
			console.error("Error: Alias is missing or invalid");
			return;
		}
		let t = c.get(e);
		if (!t) {
			console.error(`Region "${e}" was not defined. Call html.set(...) first.`);
			return;
		}
		return t.isEmpty();
	}
	function g() {
		for (let e of Object.keys(a)) d(e);
		o.clear();
		for (let e of Object.keys(s)) delete s[e];
		c.reset();
	}
	return {
		set: l,
		publish: u,
		destroy: d,
		has: f,
		getApp: p,
		isEmpty: h,
		list: m,
		reset: g
	};
}
//#endregion
export { i as default };
