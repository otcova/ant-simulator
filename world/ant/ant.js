const antDefMesh = new AntMesh({head:0,body:0,legs:0,antennas:0,tail:0});

class Ant {
	constructor(home, antMesh=antDefMesh, brain) {
		this.home = home;
		this.antMesh = antMesh;
		this.brain = brain || new AntBrain(this);
		this.pos = home.pos;
		this.vel = v2(0);
		this.dir = randRange(-Math.PI, Math.PI);
		this.size = 3 + randRange(0.8,1.3);
		this.speed = 200 + randRange(-20, 20);
		this.animationTime = randRange(0, 2*Math.PI);
		this.deltaTime = 0.01;
		
		this.phSensors = {
			left: {globalPos: v2(0), pos: v2(-60, 15), value: [0, 0]},
			forward: {globalPos: v2(0), pos: v2(0, 60), value: [0, 0]},
			right: {globalPos: v2(0), pos: v2(60, 15), value: [0, 0]}
		};
		
		
		this.caring = "";
		this.phTarget = 1;
		this.phRelease = 0;
	}
	
	draw() {
		if (this.caring == "food") {
			p.color(0.2, 0.7, 0.3, 1);
			p.ellipse(this.pos.add( v2(0, 5*this.size).rotate(this.dir) ), v2(10));
		}
		this.antMesh.draw(this);
	}
	
	update(n) {
		
		this.#getData();
		
		// this.brain.think();
		this.#think();
		
		this.#move();
	}
	
	#think() {
		if (this.caring == "") { // looking for food
			this.#releasePh(0);
			if (foodMask.catch(this.pos)) {
				this.caring = "food";
				this.#turnAround();
			} else {
				const f = foodMask.see(this.phSensors.forward.globalPos)? 1 : 0;
				const fl = foodMask.see(this.phSensors.left.globalPos)? 1 : 0;
				const fr = foodMask.see(this.phSensors.right.globalPos)? 1 : 0;
				if (f + fl + fr > 0) this.#lookAt(f, fl, fr);
				else this.#lookAtPh(1);
			}
		} else if (this.caring == "food") {  // looking for home
			this.#releasePh(1);
			if (this.home.isInside(this.pos)) { //in home
				this.caring = "";
				this.#turnAround();
			} 
			else {
				const f = this.home.isInside(this.phSensors.forward.globalPos)? 1 : 0;
				const fl = this.home.isInside(this.phSensors.left.globalPos)? 1 : 0;
				const fr = this.home.isInside(this.phSensors.right.globalPos)? 1 : 0;
				if (f + fl + fr > 0) this.#lookAt(f, fl, fr);
				else this.#lookAtPh(0);
			}
		}
	}
	
	#turnAround() {
		this.dir += Math.PI *getSign(randRange(-1, 1));
	}
	
	#getData() {
		this.#updateSensor(this.phSensors.left);
		this.#updateSensor(this.phSensors.forward);
		this.#updateSensor(this.phSensors.right);
	}
	
	#updateSensor(sensor) {
		sensor.globalPos = this.pos.add( sensor.pos.rotate(this.dir) );
		sensor.value[0] = pheromonesMask[0].levels(sensor.globalPos);
		sensor.value[1] = pheromonesMask[1].levels(sensor.globalPos);
	}
	
	#releasePh(phID) {
		if (Math.random() < 0.08)
			pheromonesMask[phID].add(this.pos);
	}
	
	#lookAtPh(phID) {
		const f = this.phSensors.forward.value[phID], fl = this.phSensors.left.value[phID], fr = this.phSensors.right.value[phID];
		this.#lookAt(f, fl, fr);
	}
	
	#lookAt(f, fl, fr) {
		const m = 15 * this.deltaTime;
		if (f > fl && f > fr) this.dir += 0;
		else if (f < fl && f < fr) this.dir += (getSign(randRange(-1, 1))*m*2);
		else if (f < fr) this.dir += (-m);
		else if (f < fl) this.dir += (m);
	}
	
	#move() {
		this.animationTime += this.speed * this.deltaTime * 1.2 / this.size;
		this.pos = this.pos.add( v2(0, this.speed * this.deltaTime).rotate(this.dir) );
		this.dir += (0.5-Math.random())*0.1;
		
		if (this.pos.length() > 2300) {
			this.pos = this.home.pos;
			this.dir = randRange(-Math.PI, Math.PI);
		}
	}
}