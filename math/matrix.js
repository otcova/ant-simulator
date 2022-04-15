class Mat {
	
	static len = 9;
	static byteSize = 4*9;
	
	static new() {
		const m = new Float32Array(9);
		m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0; m[4] = 1; m[5] = 0; m[6] = 0; m[7] = 0; m[8] = 1;
		return m;
	}
	
	static clone(m) {
		const mb = new Float32Array(9);
		mb[0]=m[0]; mb[1]=m[1]; mb[2]=m[2]; mb[3]=m[3]; mb[4]=m[4]; mb[5]=m[5]; mb[6]=m[6]; mb[7]=m[7]; mb[8]=m[8];
		return mb;
	}
	
	static copy(dst, src) {
		dst[0]=src[0]; dst[1]=src[1]; dst[2]=src[2]; dst[3]=src[3]; dst[4]=src[4]; dst[5]=src[5]; dst[6]=src[6]; dst[7]=src[7]; dst[8]=src[8];
		return dst;
	}
	
	static translate(dst, src, vec) {
		const a=src[0],e=src[1],u=src[2],o=src[3],i=src[4],s=src[5],c=src[6],f=src[7],M=src[8],x=vec.x,y=vec.y;
		dst[0] = a;
		dst[1] = e;
		dst[2] = u;
		dst[3] = o;
		dst[4] = i;
		dst[5] = s;
		dst[6] = x * a + y * o + c;
		dst[7] = x * e + y * i + f;
		dst[8] = x * u + y * s + M;
		return dst;
	}
	
	static scale(dst, src, vec) {
		dst[0] = src[0] * vec.x;
		dst[1] = src[1] * vec.x;
		dst[2] = src[2] * vec.x;
		dst[3] = src[3] * vec.y;
		dst[4] = src[4] * vec.y;
		dst[5] = src[5] * vec.y;
		dst[6] = src[6];
		dst[7] = src[7];
		dst[8] = src[8];
		return dst;
	}
	
	static rotate(dst, src, angle) {
		const a=src[0],b=src[1],c=src[2],d=src[3],e=src[4],f=src[5],g=src[6],h=src[7],i=src[8],cos=Math.cos(angle),sin=Math.sin(angle);
		dst[0] = cos * a + sin * d;
		dst[1] = cos * b + sin * e;
		dst[2] = cos * c + sin * f;
		dst[3] = cos * d - sin * a;
		dst[4] = cos * e - sin * b;
		dst[5] = cos * f - sin * c;
		dst[6] = g;
		dst[7] = h;
		dst[8] = i;
		return dst;
	}
}