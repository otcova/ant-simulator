class PheromonesMask {
	constructor(color) {
		this.particleMask = new ParticleMask({
			color,
			duration: 15,
			deathAlpha: 1,
			sizeMin: 4,
			sizeMax: 4.5,
			initialOffset: 0.1,
			diffusion: 1,
		});
		this.quadtree = d3.quadtree();
		
		this.add = this.particleMask.newParticle.bind(this.particleMask);
	}
	
	draw() {
		this.quadtree = d3.quadtree();
		const duration = this.particleMask.config.duration;
		for (let i = 0; i < this.particleMask.pCount; ++i) {
			const offset = this.particleMask.pDrawDataLen * i;
			const offsetInfo = this.particleMask.pInfoLen * i;
			this.quadtree.add([this.particleMask.array[offset + 4], this.particleMask.array[offset + 5], this.particleMask.arrayInfo[offsetInfo] - time]);
		}
		this.particleMask.draw();
	}
	
	levels(pos) {
		var xmin = pos.x-30;
		var ymin = pos.y-30;
		var xmax = pos.x+30;
		var ymax = pos.y+30;
		var smell = 0;
		this.quadtree.visit(function (node, x1, y1, x2, y2) {
			if (!node.length) {
				do {
					var d = node.data;
					if (d[0] >= xmin && d[0] < xmax && d[1] >= ymin && d[1] < ymax) {
						smell += d[2];
					}
				} while (node = node.next);
			}
			return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
		});
		return smell;
	}
}