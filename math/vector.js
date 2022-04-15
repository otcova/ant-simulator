class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	set(v) {
		this.x = v.x;
		this.y = v.y;
	}
	setV(x, y) {
		this.x = x;
		this.y = y;
	}

	add(v) {
		return this.addV(v.x, v.y);
	}
	addN(n) {
		return this.addV(n, n);
	}
	addV(x, y) {
		return v2(this.x + x, this.y + y);
	}
	
	sub(v) {
		return this.subV(v.x, v.y);
	}
	subN(n) {
		return this.subV(n, n);
	}
	subV(x, y) {
		return v2(this.x - x, this.y - y);
	}

	mult(v) {
		return this.multV(v.x, v.y);
	}
	
	multN(n) {
		return this.multV(n, n);
	}
	multV(x, y) {
		return v2(this.x * x, this.y * y);
	}
	
	///////
	scalarMult(f) {
		this.x *= f;
		this.y *= f;

		return this;
	}
	
	perpendicular() {
		var x = this.x;
		this.x = -this.y;
		this.y = x;

		return this;
	}
	
	invert() {
		this.x = -this.x;
		this.y = -this.y;

		return this;
	}
	normalize() {
		var mod = this.length();
		this.x /= mod;
		this.y /= mod;
		return this;
	}
	
	angle() {
		return this.y / this.x;
	}
	/////////////
	
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	rotate(a) {
		const s = Math.sin(a), c = Math.cos(a);
		return v2(
			c*this.x - s*this.y,
			s*this.x + c*this.y
		);
	}
	
	abs() {
		return v2(Math.abs(this.x), Math.abs(this.y));
	}
	
	copy() {
		return v2(this.x, this.y);
	}
	
	static randV(min, max) {
		return v2(randRange(min, max), randRange(min, max));
	}
	static randN(min, max) {
		return v2(randRange(min, max));
	}
}

function v2(x, y) {
	if (y == undefined) {
		if (typeof(x) == "number") return new Vec2(x, x);
		return x;
	}
	return new Vec2(x, y);
}

function getSign(n) {
	return n > 0? 1 : -1;
}

function clampMagnitude(n, max) {
	if (n > 0) return Math.min(n, max);
	return Math.max(n, -max);
}
function randRange(min, max) {
	return Math.random()*(max-min) + min;
}