import { createDrawingTool } from './factories/createDrawingTool';

export function pencil(pos, state, dispatch) {
	return createDrawingTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		'Pencil',
	);
}

export function brush(pos, state, dispatch) {
	return createDrawingTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		'Brush',
	);
}
