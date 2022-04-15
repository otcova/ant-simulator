
const home = new Home(v2(-400, 300));

const ants = []
ants.push(new Ant(home));


const foodMask = new FoodMask(new Color(0.2, 0.6, 0.3, 0.8), 10000000, 100, 10);
const pheromonesMask = [new PheromonesMask(new Color(0.2, 0.6, 0.3, 0.8)), new PheromonesMask(new Color(0.6, 0.2, 0.3, 0.8))];
let scale = 1200;


function draw() {
	if (Math.random() < 5) {
		if (ants.length < 200) {
			ants.push(new Ant(home));
		}
	}

	
	p.background(0.625, 0.375, 0.25);
	p.pushMatrix();

	p.scale(v2(1 / scale));
	
	home.draw();
	
	foodMask.draw();
	for (const i in pheromonesMask)
		pheromonesMask[i].draw();
		
	for (const antI in ants)
		ants[antI].update(antI, { foodMask, pheromonesMask });
	for (const ant of ants)
		ant.draw();
	
	
	p.popMatrix();
}

function mouseDrag(mousePos, button) {
	mousePos = mapMouse(mousePos);
	if (button.left) {
		foodMask.add(mousePos.add(Vec2.randV(-100, 100)), randRange(40, 100));
	}
}

function mapMouse(realPos) {
	return realPos.subV(innerWidth/2, innerHeight/2).multV(1, -1).multN(2/innerHeight).multN(scale);
}