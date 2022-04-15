class Buffer {
	constructor(gl, data) {
		this.gl = gl;
		this.buffer = gl.createBuffer();
		if (data) this.update(data);
	}

	update(data) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.DYNAMIC_DRAW);
	}

	use() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	}
}