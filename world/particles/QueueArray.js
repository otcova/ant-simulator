class QueueArray {
	constructor (initialSize = 2048) {
		this.start = 0;
		this.end = 0;
		this.chunkSize = Math.round(initialSize/2);
		this.data = new Float32Array(this.chunkSize*2);
	}
	
	getArray() {
		return new Float32Array(this.data.buffer, this.start*4, this.end - this.start);
	}
	
	push(data) {
		this.end += data.length;
		while (this.end >= this.data.length)
			this.#doubleSize();
		this.data.set(data, this.end - data.length);
	}
	
	shift(n) {
		this.start = Math.min(n + this.start, this.end);
		while (this.start >= this.chunkSize)
			this.#removeFirstChunk();
	}
	
	#doubleSize() {
		this.chunkSize *= 2;
		const newData = new Float32Array(this.chunkSize*2);
		newData.set(this.data);
		this.data = newData;
	}
	
	#removeFirstChunk() {
		this.data.set(new Float32Array(this.data.buffer, 4*this.start, this.end - this.start));
		
		this.end -= this.start;
		this.start = 0;
	}
}