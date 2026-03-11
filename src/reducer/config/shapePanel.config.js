import { BRUSH_VALUES } from './brushPanel.config';

export const shapeToggleMap = {
	SET_SHAPE: {
		activePath: 'drawingTools.active',
		valuePath: 'tool',
	},
};

export const shapeBooleanMap = {
	SET_SHAPE_BRUSH: {
		activeShapeBrushPath: 'drawingShapeTools.activeBrush',
	},
};

const SHAPE_BRUSH_VALUES = [
	'SHAPE_VALUE_BRUSH',
	'SHAPE_VALUE_CALLIGRAPHY_BRUSH',
	'SHAPE_VALUE_CALLIGRAPHY_PEN',
	'SHAPE_VALUE_AIRBRUSH',
	'SHAPE_VALUE_OIL_BRUSH',
	'SHAPE_VALUE_CRAYON',
	'SHAPE_VALUE_MARKER',
	'SHAPE_VALUE_NATURAL_PENCIL',
	'SHAPE_VALUE_WATERCOLOR_BRUSH',
];

const shapeBrushValueMapConfig = {
	valuePath: 'selectedShapeBrush', // this is all in upperCase letters
	togglePath: 'drawingShapeTools.activeBrush',
};

export const shapeBrushValueMap = Object.fromEntries(
	SHAPE_BRUSH_VALUES.map((shape_brush_values) => {
		return [shape_brush_values, { ...shapeBrushValueMapConfig }];
	}),
);
