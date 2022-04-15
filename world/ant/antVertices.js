const antVertices = {};

antVertices.head = [
	[1,0,1,0,1.6,0.2,1.5,1,0.6,2,0,2.3,-0.6,2,-1.5,1,-1.6,0.2,-1,0,-1,0],
	[1,0,1,0,2,0.3,1.5,1,0.8,2,0,2.3,-0.8,2,-1.5,1,-2,0.3,-1,0,-1,0],
]

antVertices.bodySegment = [
	[0,0,0.2,-0.2,0.5,-0.5,0.2,-0.8,0,-1],
]

antVertices.tail = [
	[-1,0,-1,0,-1.6,-0.4,-2,-1.4,-0.4,-3,0,-3.4,0.4,-3,2,-1.4,1.6,-0.4,1,0,1,0],
	[-1,0,-1,0,-1.9,-0.7,-1.8,-1.7,-0.9,-3,0,-3.4,0.9,-3,1.8,-1.7,1.9,-0.7,1,0,1,0],
]

antVertices.legs = [[
	[0,0,1,0.3,1.3,1.3,2.3,1.6],
	[0,0,1.6,0.16,2.4,-0.8,3.2,-1.2],
	[0,0,1.1,-0.2,1.4,-1.1,2.1,-1.4],
]]

antVertices.antennas = [
	[0,0,0.6,0.3,1.3,1,1,3,2,4],
	[0,0,1.4,0.3,1.7,0.5,1,3,1.5,4],
]

const antVsAnimation = `
attribute vec4 aVertexPosition;
uniform float uTime;
vec2 animation() {
	if (aVertexPosition.z == 1.)
		return aVertexPosition.xy;
	else if (aVertexPosition.w == 0.)
		return aVertexPosition.xy + sin(uTime+0.2)*0.02*aVertexPosition.z;
	else if (aVertexPosition.w == 1.)
		return aVertexPosition.xy + sin(uTime+0.2+3.14)*0.02*aVertexPosition.z;
		
	else if (aVertexPosition.w == 2.)
		return aVertexPosition.xy + vec2(0, sin(uTime)*0.16*aVertexPosition.z);
	else if (aVertexPosition.w == 3.)
		return aVertexPosition.xy + vec2(0, sin(uTime+3.14)*0.15*aVertexPosition.z);
	else if (aVertexPosition.w == 4.)
		return aVertexPosition.xy + vec2(0, sin(uTime)*0.15*aVertexPosition.z);
		
	else if (aVertexPosition.w == 5.)
		return aVertexPosition.xy + vec2(0, sin(uTime+3.14)*0.16*aVertexPosition.z);
	else if (aVertexPosition.w == 6.)
		return aVertexPosition.xy + vec2(0, sin(uTime)*0.15*aVertexPosition.z);
	else if (aVertexPosition.w == 7.)
		return aVertexPosition.xy + vec2(0, sin(uTime+3.14)*0.15*aVertexPosition.z);
	return aVertexPosition.xy;
}
`;