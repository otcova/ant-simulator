const defMeshInstanceVsSource = `
precision mediump float;

attribute vec2 aVertexPosition;

uniform mat3 modelViewMatrix;
attribute vec4 pos;
attribute vec4 color;

varying vec4 vColor;

void main() {
	gl_Position = vec4(modelViewMatrix * vec3(aVertexPosition * pos.z + pos.xy, 1.), 1.);
	
	vColor = color;
}
`;

const defMeshInstanceFsSource = `
precision lowp float;

varying vec4 vColor;

void main() {
	gl_FragColor = vColor;
}
`;

const defMeshUniformLoc = [["modelViewMatrix","modelViewMatrix"]];
const defMeshAttribLoc = [
	["vertexPosition","aVertexPosition"],
	["pos","pos"],
	["color","color"],
];


class MeshInstance {
	constructor(gl, vertices, type=GL_TRIANGLES) {
		this.gl = gl;
		this.type = type;
		this.verticesDim = 2;
		this.shader = new Shader(gl, defMeshInstanceVsSource, defMeshInstanceFsSource, defMeshAttribLoc, defMeshUniformLoc);
		this.buffer = {
			vertices: new Buffer(gl),
			data: new Buffer(gl),
		};
		this.updateVertices(vertices);
	}
	updateVertices(vertices) {
		this.buffer.vertices.update(vertices);
		this.verticesCount = vertices.length / this.verticesDim;
	}
	
	draw(modelViewMatrix, numInstances) {
		this.shader.use();
		this.shader.setAttrib("vertexPosition", this.buffer.vertices, this.verticesDim);
		
		this.shader.setUniformMat3f("modelViewMatrix", modelViewMatrix);
		this.shader.setAttribInstance("color", this.buffer.data, 4, (4+3)*4);
		this.shader.setAttribInstance("pos", this.buffer.data, 3, (4+3)*4, 4*4);
		
		this.gl.ext.drawArraysInstancedANGLE(this.type, 0, this.verticesCount, numInstances);
	}
}