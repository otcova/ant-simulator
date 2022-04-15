export function draw_window(parent) {
	const get_parent_size = () => [parent.offsetWidth, parent.offsetHeight]
	
	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
		}
		g.draw = () => {
			g.background(255)
			g.translate(g.width / 2, g.height / 2)
			let t = performance.now() / 400
			g.fill(180, 255, 3);		
			g.ellipse(g.sin(t) * 100, 0, 10)
			g.ellipse(0, g.cos(t) * 100, 10)
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}