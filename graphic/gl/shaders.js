

const defaultVsSource = `
// #extension GL_EXT_draw_instanced : enable
precision highp float;

attribute vec3 aVertexPosition;

uniform mat3 uModelViewMatrix;

void main() {
	gl_Position = vec4(uModelViewMatrix * aVertexPosition, 1);
}
`;

const defaultFsSource = `
// #extension GL_EXT_draw_instanced : enable
precision lowp float;

uniform vec4 uColor;

void main() {
	gl_FragColor = uColor;
}
`;

const defaultAttribLoc = [
	["vertexPosition", "aVertexPosition"],
]

const defaultUniformLoc = [
	["modelViewMatrix", "uModelViewMatrix"],
	["color", "uColor"],
]

class Shader {
	constructor(gl, vsSource = defaultVsSource, fsSource = defaultFsSource, attribLocations = defaultAttribLoc, uniformLocations = defaultUniformLoc) {
		this.gl = gl;
		this.program = this.#initShaderProgram(vsSource, fsSource);
		this.attribLocations = new Map();
		this.uniformLocations = new Map();

		for (const loc of attribLocations)
			this.attribLocations.set(loc[0], this.gl.getAttribLocation(this.program, loc[1]));
		for (const loc of uniformLocations)
			this.uniformLocations.set(loc[0], this.gl.getUniformLocation(this.program, loc[1]));
	}

	#initShaderProgram(vsSource, fsSource) {
		const vertexShader = this.#loadShader(this.gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.#loadShader(this.gl.FRAGMENT_SHADER, fsSource);

		// Create the shader program

		const shaderProgram = this.gl.createProgram();
		this.gl.attachShader(shaderProgram, vertexShader);
		this.gl.attachShader(shaderProgram, fragmentShader);
		this.gl.linkProgram(shaderProgram);

		// If creating the shader program failed, alert

		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		return shaderProgram;
	}

	#loadShader(type, source) {
		const shader = this.gl.createShader(type);
		
		this.gl.shaderSource(shader, source);

		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.log(source);
			alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}

		return shader;
	}
	
	setAttribMatInstance(name, buffer, dim) { // float32
		const bytesPerMatrix = 4 * dim*dim;
		const globalLoc = this.attribLocations.get(name);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
		for (let i = 0; i < dim; ++i) {
			const loc = globalLoc + i;
			const offset = i * 4 * dim;
			this.gl.enableVertexAttribArray(loc);
			this.gl.vertexAttribPointer(loc, dim, this.gl.FLOAT, false, bytesPerMatrix, offset);
			// this line says this attribute only changes for each 1 instance
			this.gl.ext.vertexAttribDivisorANGLE(loc, 1);
		}
	}
	
	setAttribInstance(name, buffer, numComponents, stride = 0, offset = 0, type=this.gl.FLOAT, normalize = false) {
		const loc = this.attribLocations.get(name);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
		this.gl.enableVertexAttribArray(loc);
		this.gl.vertexAttribPointer(loc, numComponents, type, normalize, stride, offset);
		// this line says this attribute only changes for each 1 instance
		this.gl.ext.vertexAttribDivisorANGLE(loc, 1);
	}
	
	setAttrib(name, buffer, numComponents, stride, offset = 0, type=this.gl.FLOAT, normalize = false,) {
		stride = stride || (4*numComponents);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
		this.gl.vertexAttribPointer(
			this.attribLocations.get(name),
			numComponents,
			type,
			normalize,
			stride,
			offset);
		this.gl.enableVertexAttribArray(this.attribLocations[name]);
	}
	
	setUniformMat3f(name, data, transpose = false) {
		this.use();
		this.gl.uniformMatrix3fv(this.uniformLocations.get(name), transpose, data);
	}
	
	setUniformVec4f(name, x, y, z, w) {
		this.use();
		this.gl.uniform4f(this.uniformLocations.get(name), x, y, z, w);
	}
	setUniformVec2f(name, x, y) {
		this.use();
		this.gl.uniform2f(this.uniformLocations.get(name), x, y, z, w);
	}
	
	setUniformF(name, n) {
		this.use();
		this.gl.uniform1f(this.uniformLocations.get(name), n);
	}
	
	locateUniform(name, sourceName) {
		this.use();
		this.uniformLocations.set(name, this.gl.getUniformLocation(this.program, sourceName));
	}
	
	use() {
		this.gl.useProgram(this.program);
	}
}
