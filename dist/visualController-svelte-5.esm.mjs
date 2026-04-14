import e from "ask-for-promise";
import { mount as t, unmount as n } from "svelte";
//#region src/main.js
function r(r = {}) {
	let i = {};
	function a(a, o, s) {
		let c = i.hasOwnProperty(s), l = e();
		if (!a) return console.error("Error: Component is undefined"), l.done(!1), l.promise;
		c && n(i[s]);
		let u = document.getElementById(s), d = !1;
		return u ? (u.innerHTML.trim() !== "" && (u.innerHTML = ""), i[s] = t(a, {
			target: u,
			props: {
				dependencies: r,
				setupUpdates: (e) => d = e,
				...o
			}
		}), i[s].updates = d || {}, l.done(i[s].updates), l.promise) : (console.error(`Can't find node with id: "${s}"`), l.done(!1), l.promise);
	}
	function o(e) {
		if (i[e]) {
			let t = i[e];
			return n(t), delete i[e], !0;
		} else return !1;
	}
	function s(e) {
		let t = i[e];
		return t ? t.updates : (console.error(`App with id: "${e}" was not found`), !1);
	}
	function c(e) {
		return i.hasOwnProperty(e);
	}
	return {
		publish: a,
		destroy: o,
		getApp: s,
		has: c
	};
}
//#endregion
export { r as default };
