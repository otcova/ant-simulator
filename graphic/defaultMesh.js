
function createDefaultMesh(gl) {
	let verts;
	verts = new Float32Array([
		1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		-1.0, -1.0,
	]);
	
	const quad = new Mesh(gl, verts, 2, GL_TRIANGLE_STRIP);
	
	const circleGen = (circleRes) => {
		verts = new Float32Array(circleRes);
		for (let i = 0; i < circleRes; i+=2) {
			const a = Math.PI*2*i/circleRes;
			verts[i] = Math.cos(a);
			verts[i+1] = Math.sin(a);
		}
	}
	
	circleGen(30*2);
	const circle = new Mesh(gl, verts, 2, GL_TRIANGLE_FAN);
	
	circleGen(6*2);
	const particleMaskMesh = new MeshInstance(gl, verts, gl.TRIANGLE_FAN);

	return {circle, quad, particleMaskMesh}
}