class AntMesh {
	constructor(spritesIndexes) {
		this.spritesIndexes = spritesIndexes;
	}
	init() {
		let verts = [];
		let insert = (vertices, offset=v2(0), scale=v2(1)) => {
			for (let i = 0; i < vertices.length; i+=2) {
				verts.push(vertices[i]*scale.x + offset.x);
				verts.push(vertices[i+1]*scale.y + offset.y);
			}
		}
		
		insert(antVertices.tail[0], v2(0, -3));
		for (let bodyLen = 0; bodyLen < 4; ++bodyLen)
			insert(antVertices.bodySegment[0], v2(0.7 + bodyLen * 0.12, bodyLen - 3), v2(0.6, -1));
		insert(antVertices.head[0], v2(0, 1));
		for (let bodyLen = 3; bodyLen >= 0; --bodyLen)
			insert(antVertices.bodySegment[0], v2(-0.7 - bodyLen * 0.12, bodyLen - 2), v2(-0.6, 1));
		
		const indexes = triangulatePolygon(verts);
		const final = [];
		for (const i of indexes) {
			final.push(verts[i*2]);
			final.push(verts[i*2+1]);
		}
		this.bodyMesh = new Mesh(p.gl, new Float32Array(final), 2, p.gl.TRIANGLES);
		
		verts = [];
		insert = (vertices, id, offset=v2(0), scale=v2(1)) => {
			verts.push(vertices[0]*scale.x + offset.x);
			verts.push(vertices[1]*scale.y + offset.y);
			verts.push(1 << 0);
			verts.push(id);
			for (let i = 2; i < vertices.length-2; i+=2) {
				const x = vertices[i]*scale.x + offset.x;
				const y = vertices[i+1]*scale.y + offset.y;
				verts.push(x);
				verts.push(y);
				verts.push(1 << i/2);
				verts.push(id);
				verts.push(x);
				verts.push(y);
				verts.push(1 << i/2);
				verts.push(id);
			}
			verts.push(vertices[vertices.length-2]*scale.x + offset.x);
			verts.push(vertices[vertices.length-1]*scale.y + offset.y);
			verts.push(1 << (vertices.length/2-1));
			verts.push(id);
		}
		
		for (let i = 0; i < 3; ++i) {
			insert(antVertices.legs[0][i], 2+i, v2(-0.9, -i), v2(-1, 1));
			insert(antVertices.legs[0][i], 3+2+i, v2(0.9, -i));
		}
		insert(antVertices.antennas[0], 0, v2(-1, 2), v2(-0.7, 0.7));
		insert(antVertices.antennas[0], 1, v2(1, 2), v2(0.7));
		
		this.legsMesh = new Mesh(p.gl, new Float32Array(verts), 4, p.gl.LINES, antVsAnimation);
		this.legsMesh.shader.locateUniform("time", "uTime");
	}
	
	draw(ant) {
		if (!this.bodyMesh) this.init();
		
		p.color(0);
		p.drawMesh(this.bodyMesh, ant.pos, v2(ant.size), ant.dir);
		
		this.legsMesh.shader.setUniformF("time", ant.animationTime);
		p.drawMesh(this.legsMesh, ant.pos, v2(ant.size), ant.dir);
	}
}

