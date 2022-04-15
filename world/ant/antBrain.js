
const antDefCode = `
function move(Ant) {
	console.log(Ant);
}
`;

class AntBrain {
	
	constructor(ant, code=antDefCode) {
		this.code = code;
		this.ant = ant;
	}
	
	think() {
		antWorkerAPI.run(this.code);
	}
}