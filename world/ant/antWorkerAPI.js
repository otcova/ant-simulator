

class AntWorkerAPI {
	constructor() {
		this.webWorker = new Worker("world/ant/antWorkerCode.js");
		this.webWorker.onmessage = this.#onmessage;
		this.nextMsgID = 0;
	}
	#onmessage(msg) {
		if (msg.data.type == "run code error") {
			console.log(msg.data.code);
			console.log(msg.data.error);
		}
		else console.log("Worker Response:", msg.data);
	}
	#createRequest() {
		
	}
	run(code) {
		this.webWorker.postMessage({
			id: this.nextMsgID++,
			type: "run code",
			code
		});
	}
}

const antWorkerAPI = new AntWorkerAPI();

















/*
worker = {}

worker.nextID = 0;
worker.resolveMap = new Map();
worker.creteRequest = function(resolve, ant) {
	const id = (worker.nextID++).toString(36);
	worker.resolveMap.set(id, {resolve: (result) => {
		worker.resolveMap.delete(id);
		resolve(result);
	}, ant});
	return id;
}

worker.webWorker = new Worker("world/ant/antWorker.js");

worker.webWorker.onmessage = function(msg) {
	if (msg.data.type == "response") {
		worker.resolveMap.get(msg.data.responseID).resolve(msg.data.result);
	} else if (msg.data.type == "antFn") {
		console.log(msg.data.fn);
	}
}

worker.requestRun = function(source, ant) {
	return new Promise(resolve => {
		const id = worker.creteRequest(resolve, ant);
		worker.webWorker.postMessage({
			type: "run",
			source,
			id,
		});
	});
}*/