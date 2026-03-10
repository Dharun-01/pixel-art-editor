import { drawShapeStamps } from '../../utils';

export function calculateRadius(pos, to) {
	const radius = Math.ceil(
		Math.sqrt((to.x - pos.x) ** 2 + (to.y - pos.y) ** 2),
	);

	return radius;
}

export function calculatePolygonVertices(pos, to, sides, radius, shape) {
	const vertices = [];

	if (shape === 'Symmetrical Square') {
		let size = Math.max(Math.abs(to.x - pos.x), Math.abs(to.y - pos.y));
		let half = size / 2; // To center the initial position
		vertices.push(
			{ x: pos.x - half, y: pos.y - half }, // top-left
			{ x: pos.x + half, y: pos.y - half }, // top-right
			{ x: pos.x + half, y: pos.y + half }, // bottom-right
			{ x: pos.x - half, y: pos.y + half }, // bottom-left
		);
		return vertices;
	}

	if (shape === 'Symmetrical Right Triangle') {
		let topVertex = { x: pos.x, y: pos.y };
		let bottomRightVertex = { x: to.x, y: to.y };
		let bottomLeftVertex = { x: pos.x, y: to.y };
		vertices.push(topVertex, bottomLeftVertex, bottomRightVertex);
		return vertices;
	}

	if (shape === 'Symmetrical Rectangle') {
		let halfW = Math.abs(to.x - pos.x); // independent width
		let halfH = Math.abs(to.y - pos.y); // independent height

		vertices.push(
			{ x: pos.x - halfW, y: pos.y - halfH }, // top-left
			{ x: pos.x + halfW, y: pos.y - halfH }, // top-right
			{ x: pos.x + halfW, y: pos.y + halfH }, // bottom-right
			{ x: pos.x - halfW, y: pos.y + halfH }, // bottom-left
		);
		return vertices;
	}

	// default shape for side value 4 is rhombus, for other shapes look above
	for (let i = 0; i < sides; i++) {
		let angle = (Math.PI * 2 * i) / sides - Math.PI / 2; // rotate upright
		vertices.push({
			x: Math.round(pos.x + radius * Math.cos(angle)),
			y: Math.round(pos.y + radius * Math.sin(angle)),
		});
	}

	return vertices;
}

export function calculateStarVertices(
	pos,
	outerRadius,
	innerRadius,
	totalPoints,
) {
	const vertices = [];
	for (let i = 0; i < totalPoints; i++) {
		let angle = (2 * Math.PI * i) / totalPoints - Math.PI / 2;
		let r = i % 2 === 0 ? outerRadius : innerRadius;
		vertices.push({
			x: Math.round(pos.x + r * Math.cos(angle)),
			y: Math.round(pos.y + r * Math.sin(angle)),
		});
	}
	return vertices;
}

export function drawStampsFromVertices(
	vertices,
	sides,
	state,
	stamp,
	spacing,
	lastStampPos,
	color,
	opacity,
	shape,
) {
	const result = [];

	for (let i = 0; i < sides; i++) {
		let next = (i + 1) % sides;
		result.push(
			...drawShapeStamps(
				state,
				stamp,
				spacing,
				lastStampPos,
				vertices[i],
				vertices[next],
				color,
				opacity,
				shape,
			),
		);
	}
	return result;
}
