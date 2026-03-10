import { hexToRgb } from '../utils';
import { createDrawingTool } from './factories/createDrawingTool';

export const erase = (pos, state, dispatch) => {
	return createDrawingTool(
		pos,
		state,
		dispatch,
		() => hexToRgb('#ffffff'),
		() => 100,
		'Pencil',
	);
};

export function zoomPlus(pos, state, dispatch) {
	const currentZoom = state.drawing.zoomLevel;
	const newZoom = Math.min(currentZoom + 0.1, 10); // cap at 1000%
	dispatch({ type: 'SET_ZOOM_LEVEL', stringValue: newZoom });
	return null; // no drag behavior needed
}

export function pick(pos, state, dispatch) {
	let index = state.drawing.picture.pixel(pos.x, pos.y);

	dispatch({
		type: 'SET_COLOR',
		stringValue: new Uint8ClampedArray([
			state.drawing.picture.pixels[index],
			state.drawing.picture.pixels[index + 1],
			state.drawing.picture.pixels[index + 2],
			state.drawing.picture.pixels[index + 3],
		]),
	});
}

let around = [
	{ dx: -1, dy: 0 },
	{ dx: 1, dy: 0 },
	{ dx: 0, dy: -1 },
	{ dx: 0, dy: 1 },
];

export function fill({ x, y }, state, dispatch) {
	const getPixel = (x, y) => {
		const i = (x + y * state.drawing.picture.width) * 4;
		return state.drawing.picture.pixels.slice(i, i + 4);
	};

	const colorsMatch = (a, b) => a.every((v, i) => v === b[i]);
	const targetColor = getPixel(x, y);

	// Early exit if painting same color
	if (colorsMatch(targetColor, state.tools.color)) return;

	const visited = new Set([`${x},${y}`]);
	const queue = [{ x, y }];
	const drawn = [];

	while (queue.length) {
		const { x: cx, y: cy } = queue.pop();
		drawn.push({
			x: cx,
			y: cy,
			color: state.tools.color,
			opacity: state.tools.opacity,
		});

		for (const { dx, dy } of around) {
			const nx = cx + dx,
				ny = cy + dy;
			const key = `${nx},${ny}`;

			if (
				nx >= 0 &&
				nx < state.drawing.picture.width &&
				ny >= 0 &&
				ny < state.drawing.picture.height &&
				!visited.has(key) &&
				colorsMatch(getPixel(nx, ny), targetColor)
			) {
				visited.add(key);
				queue.push({ x: nx, y: ny });
			}
		}
	}

	dispatch({
		type: 'SET_PICTURE',
		stringValue: state.drawing.picture.draw(drawn),
	});
}
