class Painter {
	constructor(canvas) {
		this.canvas = canvas;
		this.gl = canvas.getContext("webgl");
		this.gl.ext = this.gl.getExtension('ANGLE_instanced_arrays');
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE);
		
		
		this.tempMat = Mat.new();
		this.projectionMatrix = Mat.new();
		this.matrix = [Mat.new()];
		this.defMeshColor = new Color(1);
		this.defMesh = createDefaultMesh(this.gl);
	}
	background(r, g, b, a) {
		const c = new Color(r, g, b, a);
		this.gl.clearColor(c.r, c.g, c.b, c.a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
	color(r, g, b, a) {
		this.defMeshColor = new Color(r, g, b, a);
	}
	ellipse(pos, size) {
		this.defMesh.circle.color(this.defMeshColor);
		this.defMesh.circle.draw(
			Mat.scale(this.tempMat, Mat.translate(this.tempMat, this.getMatrix(), pos), size),
			this.projectionMatrix);
	}
	rect(pos, size) {
		this.defMesh.quad.color(this.defMeshColor);
		this.defMesh.quad.draw(
			Mat.scale(this.tempMat, Mat.translate(this.tempMat, this.getMatrix(), pos), size),
			this.projectionMatrix);
	}
	getMatrix() {
		return this.matrix[this.matrix.length-1];
	}
	pushMatrix() {
		this.matrix.push(Mat.clone(this.getMatrix()));
	}
	popMatrix() {
		this.matrix.pop();
	}
	translate(pos) {
		const mat = this.getMatrix();
		Mat.translate(mat, mat, pos);
	}
	rotate(angle) {
		const mat = this.getMatrix();
		Mat.rotate(mat, mat, angle);
	}
	scale(scalar) {
		const mat = this.getMatrix();
		Mat.scale(mat, mat, scalar);
	}
	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, width, height);
		const globalScale = 1;
		Mat.scale(this.projectionMatrix, Mat.new(), v2(height / (globalScale * width), 1 / globalScale, 1));
	}
	drawMesh(mesh, pos, size, rot) {
		mesh.color(this.defMeshColor);
		mesh.draw(
			Mat.scale(this.tempMat, Mat.rotate(this.tempMat, Mat.translate(this.tempMat, this.getMatrix(), pos), rot), size));
	}
	
	drawLoop() {
		this.matrix = [this.projectionMatrix];
		draw();
	}
}