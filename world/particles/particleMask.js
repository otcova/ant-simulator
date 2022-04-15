

class ParticleMask {
	constructor(config) {
		this.config = config;
		
		this.pCount = 0;
		this.pDrawDataLen = 4 + 2 + 1; // color, pos, size
		this.pInfoLen = 2; // time, rot
		this.pDrawData = new QueueArray();
		this.pInfoData = new QueueArray();
		this.array = new Float32Array(0);
		this.arrayInfo = new Float32Array(0);
		
		this.tempBuff = {
			draw: new Float32Array(this.pDrawDataLen),
			info: new Float32Array(this.pInfoLen),
		};
	}
	draw() {
		// if (frameCount % 40 == 0) console.log(this.pCount);
		
		const drawArray = this.pDrawData.getArray();
		const infoArray = this.pInfoData.getArray();
		let toShift = 0;
		
		for (let i = 0; i < this.pCount; ++i) {
			const offsetData = this.pDrawDataLen * i;
			const offsetInfo = this.pInfoLen * i;
			
			drawArray[offsetData+3] = Math.min(1, (infoArray[offsetInfo] - time)/(this.config.duration*this.config.deathAlpha));
			
			if (drawArray[offsetData+3] > 0) {
				const pos = v2(drawArray[offsetData+4], drawArray[offsetData+5]);
				pos.set(pos.add(v2(this.config.diffusion * Math.random() * deltaTime).rotate(infoArray[offsetInfo+1])));
				drawArray[offsetData+4] = pos.x;
				drawArray[offsetData+5] = pos.y;
			} else {
				toShift++;
			}
		}
		this.arrayInfo = this.pInfoData.getArray();
		this.array = drawArray;
		if (toShift > 0) {
			this.pCount -= toShift;
			this.pDrawData.shift(toShift * this.pDrawDataLen);
			this.pInfoData.shift(toShift * this.pInfoLen);
			this.array = this.pDrawData.getArray();
		} 
		
		p.defMesh.particleMaskMesh.buffer.data.update(drawArray);
		p.defMesh.particleMaskMesh.draw(p.getMatrix(), this.pCount);
	}
	
	newParticle(pos) {
		
		const o = this.config.initialOffset;
		pos = pos.add(v2(randRange(-o, o),randRange(-o, o)));
		
		this.tempBuff.draw[0] = this.config.color.r;
		this.tempBuff.draw[1] = this.config.color.g;
		this.tempBuff.draw[2] = this.config.color.b;
		this.tempBuff.draw[3] = this.config.color.a;
		
		this.tempBuff.draw[4] = pos.x;
		this.tempBuff.draw[5] = pos.y;
		
		this.tempBuff.draw[6] = randRange(this.config.sizeMin, this.config.sizeMax);
		
		
		this.tempBuff.info[0] = time+this.config.duration;
		
		this.tempBuff.info[1] = randRange(-Math.PI, Math.PI);
		
		this.pDrawData.push(this.tempBuff.draw);
		this.pInfoData.push(this.tempBuff.info);
		
		++this.pCount;
	}
}