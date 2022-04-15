
const EMPTY = "EMPTY";
const HOME = "HOME";
const ENEMY = "ENEMY";
const FOOD = "FOOD";
const BLUE_PHEROMONE = "BLUE_PHEROMONE";
const GREEN_PHEROMONE = "GREEN_PHEROMONE";
const RED_PHEROMONE = "RED_PHEROMONE";

const injectedCode = {
	top: "", 
	bottom: "return move;"
}

let antData;

const antInterface = {
	carrying: (p)=>{console.log("Carrying(", p, ") > false"); return false; },
	see: (p)=>{console.log("See(", p, ") > true"); return true;},
	nearest: (p)=>{console.log("nearest(", p, ") > false"); return false; },
	
	take: (p)=>{console.log("Take(", p, ") > false"); return false; },
	attack: (p)=>{console.log("Attack(", p, ") > false"); return false; },
	release: (p)=>{console.log("Release(", p, ") > false"); return false; },
	lookAt: (p)=>{console.log("lookAt(", p, ") > false"); return false; },
	moveForward: (p)=>{console.log("moveForward(", p, ") > false"); return false; },
}

onmessage = msg => {
	if (msg.data.type == "run code") {
		antData = msg.antData;
		try {
			const fn = Function(injectedCode.top + msg.data.code + injectedCode.bottom)().bind({})(antInterface);
		} catch (error) {
			postMessage({id: msg.id, type: "run code error", error,
				code: injectedCode.top + msg.data.code + injectedCode.bottom});
		}
	}
}