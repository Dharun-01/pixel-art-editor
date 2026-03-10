import {
	calculatePolygonVertices,
	calculateRadius,
	calculateStarVertices,
	drawStampsFromVertices,
} from '../geometry/polygonGeometry';
import { drawShapeStamps } from '../../utils';
import { calculateHeartVertices } from '../geometry/specialShapes';

export function shapeToolContext(
	pos,
	to,
	sides,
	state,
	stamp,
	spacing,
	lastStampPos,
	color,
	opacity,
	shape,
) {
	if (
		shape === 'Symmetrical Polygon' ||
		shape === 'Symmetrical Square' ||
		shape === 'Symmetrical Rectangle'
	) {
		let radius = calculateRadius(pos, to);
		let vertices = calculatePolygonVertices(pos, to, sides, radius, shape);
		let result = drawStampsFromVertices(
			vertices,
			sides,
			state,
			stamp,
			spacing,
			lastStampPos,
			color,
			opacity,
			shape,
		);
		return result;
	}

	if (shape === 'Symmetrical Star') {
		let outerRadius = calculateRadius(pos, to);
		let innerRadius = outerRadius * 0.4;
		let totalPoints = sides * 2;
		let vertices = calculateStarVertices(
			pos,
			outerRadius,
			innerRadius,
			totalPoints,
		);
		let result = drawStampsFromVertices(
			vertices,
			totalPoints,
			state,
			stamp,
			spacing,
			lastStampPos,
			color,
			opacity,
			shape,
		);

		return result;
	}

	if (shape === 'Symmetrical Right Triangle') {
		let radius = calculateRadius(pos, to);
		let vertices = calculatePolygonVertices(pos, to, sides, radius, shape);
		const result = drawStampsFromVertices(
			vertices,
			sides,
			state,
			stamp,
			spacing,
			lastStampPos,
			color,
			opacity,
			shape,
		);
		return result;
	}

	if (shape === 'Symmetrical Circle' || shape === 'Symmetrical Line') {
		const result = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			pos,
			to,
			color,
			opacity,
			shape,
		);

		return result;
	}

	if (shape === 'Symmetrical Heart') {
		let vertices = calculateHeartVertices(pos, to);
		const result = drawStampsFromVertices(
			vertices,
			vertices.length,
			state,
			stamp,
			spacing,
			lastStampPos,
			color,
			opacity,
			shape,
		);

		return result;
	}

	throw new Error(`Unknown Shape:${shape}`);
}
