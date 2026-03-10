import { createCurvedShapeTool } from './factories/createCurvedShapeTool';
import { createLineTool } from './factories/createLineTool';
import { createPolygonTool } from './factories/createPolygonTool';

/* NOTE */
/**
 * If you want to create a shape tool you need: 
  pos,
	state,
	dispatch,
	getColor = () => state.tools.color,
	getOpacity = () => state.tools.opacity,
  sides,
	shape
 */

export const line = (pos, state, dispatch) => {
	return createLineTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		'Symmetrical Line',
	);
};

export const triangle = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		3,
		'Symmetrical Polygon',
	);
};

export const rightTriangle = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		3,
		'Symmetrical Right Triangle',
	);
};

export const rhombus = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		4,
		'Symmetrical Polygon',
	);
};

export const rectangle = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		4,
		'Symmetrical Rectangle',
	);
};

export const square = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		4,
		'Symmetrical Square',
	);
};

export const pentagon = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		5,
		'Symmetrical Polygon',
	);
};

export const hexagon = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		6,
		'Symmetrical Polygon',
	);
};

export const star = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		5,
		'Symmetrical Star',
	);
};

export const fourPointStar = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		4,
		'Symmetrical Star',
	);
};

export const sixPointStar = (pos, state, dispatch) => {
	return createPolygonTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		6,
		'Symmetrical Star',
	);
};

export const circle = (pos, state, dispatch) => {
	return createCurvedShapeTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		'Symmetrical Circle',
	);
};

export const heart = (pos, state, dispatch) => {
	return createCurvedShapeTool(
		pos,
		state,
		dispatch,
		() => state.tools.color,
		() => state.tools.opacity,
		'Symmetrical Heart',
	);
};
