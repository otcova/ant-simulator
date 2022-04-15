class Color {
	constructor(r, g, b, a) {
		if (g == undefined) {
			if (typeof(r) == "number") Color.#set(this, r, r, r, 1);
			else Color.#copy(this, r);
		}
		else if (a == undefined) Color.#set(this, r, g, b, 1);
		else Color.#set(this, r, g, b, a);
	}
	
	static #copy(dst, src) {
		dst.r = src.r;
		dst.g = src.g;
		dst.b = src.b;
		dst.a = src.a;
	}
	
	static #set(dst, r, g, b, a) {
		dst.r = r;
		dst.g = g;
		dst.b = b;
		dst.a = a;
	}
}