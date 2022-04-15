class Home {
	
	constructor(pos, color = new Color(0.2, 0.4, 0.7)) {
		this.pos = pos;
		this.color = color;
		this.radius = 100;
	}
	
	draw() {
		p.color(this.color);
		p.ellipse(this.pos, v2(this.radius));
	}
	
	isInside(pos) {
		return this.pos.sub(pos).length() < this.radius;
	}
}