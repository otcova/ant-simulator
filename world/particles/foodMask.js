class FoodMask {
	constructor() {
		this.chunks = [];
	}
	
	draw() {
		for(const chunk of this.chunks)
			chunk.draw();
	}
	
	see(pos) {
		for(const chunk of this.chunks)
			if(chunk.see(pos)) return true;
		return false;
	}
	
	catch(pos) {
		for(let i = 0; i < this.chunks.length; ++i) {
			if(this.chunks[i].catch(pos)) { 
				if (this.chunks[i].size < 25) {
					this.chunks.splice(i, 1);
				}
				return true;
			}
		}
		return false;
	}
	  
	add(pos, size = randRange(20, 30)) {
		this.chunks.push(new FoodChunk(pos, size));
	}
}

class FoodChunk {
	constructor(pos, size) {
		this.pos = pos;
		this.size = size;
		this.color = new Color(0.2, randRange(0.5, 0.7), randRange(0.2, 0.3));
	}
	
	draw() {
		p.color(this.color);
		p.ellipse(this.pos, v2(this.size));
	}
	
	see(pos) {
		return (this.pos.sub(pos)).length() < this.size;
	}
	
	catch(pos, q = 1) {
		if (!this.see(pos)) return false;
		this.size -= q*10;
		return true;
	}
}