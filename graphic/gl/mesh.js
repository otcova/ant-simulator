
const meshVsSource = [`
precision highp float;

uniform mat3 uModelViewMatrix;
`,`
void main() {
	gl_Position =  vec4(uModelViewMatrix * vec3(animation(), 1), 1);
}
`];

class Mesh {
	constructor(gl, vertices, verticesDim = 2, type=GL_TRIANGLES, animation="\nattribute vec2 aVertexPosition;\nvec2 animation(){return aVertexPosition;}") {
		this.gl = gl;
		this.shader = new Shader(gl, meshVsSource[0] + animation + meshVsSource[1]);
		this.buffer = new Buffer(gl);
		this.verticesDim = verticesDim;
		this.type = type;
		this.buffer.use();
		this.updateVertices(vertices);
		
		
		this.shader.use();
		this.shader.setUniformVec4f("color", 1, 1, 1, 1);
	}
	
	updateVertices(vertices) {
		this.buffer.update(vertices);
		this.verticesCount = vertices.length / this.verticesDim;
	}
	
	draw(modelMatrix) {
		this.shader.use();
		this.shader.setAttrib("vertexPosition", this.buffer, this.verticesDim);
		this.shader.setUniformMat3f("modelViewMatrix", modelMatrix);
		this.gl.drawArrays(this.type, 0, this.verticesCount);
	}
	
	color(c) {
		this.shader.use();
		this.shader.setUniformVec4f("color", c.r, c.g, c.b, c.a);
	}
}