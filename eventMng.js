const p = new Painter(document.getElementById("glCanvas"));
let pastTime = 0;
let time = 0;
let deltaTime = 0;
let frameCount = 0;

let logFps = false;
logFps = true;

{
	document.body.onkeydown = k => {
		// console.log("KEY:  ", k);
	}
	
	document.body.onmousemove = e => {
		if (window.mouseDrag)
			window.mouseDrag(v2(e.clientX, e.clientY), {
				left: (e.buttons & 0b1) != 0,
				right: (e.buttons & 0b10) != 0,
				middle: (e.buttons & 0b100) != 0
			});
	}
	
	document.body.onresize = () => {
		p.resize(innerWidth, innerHeight);
	}
	
	document.body.onload = () => {
		setTimeout(() => {
			document.body.onresize();
			if (window.setup)
			window.setup();
			requestAnimationFrame(internalDrawLoop);
		}, 0);
	};
	
	function internalDrawLoop() {
		ptime = time;
		time = performance.now()/1000;
		deltaTime = Math.min(.1, time - ptime);
		frameCount += 1;
		if (logFps) if (frameCount % 40 == 0) console.log(deltaTime.toFixed(4), (1/deltaTime).toFixed(2));
		p.drawLoop();
		requestAnimationFrame(internalDrawLoop);
	}
}

