export function calculateHeartVertices(pos, to) {
	let scale = Math.hypot(to.x - pos.x, to.y - pos.y) / 20;

	const vertices = [];
	let steps = 100; // more = smoother

	for (let i = 0; i <= steps; i++) {
		let t = (Math.PI * 2 * i) / steps;

		let x = 16 * Math.pow(Math.sin(t), 3);
		let y =
			13 * Math.cos(t) -
			5 * Math.cos(2 * t) -
			2 * Math.cos(3 * t) -
			Math.cos(4 * t);

		vertices.push({
			x: Math.round(pos.x + x * scale),
			y: Math.round(pos.y - y * scale), // invert Y
		});
	}
	return vertices;
}
