export const brushToggleMap = {
	SET_BRUSH: { activePath: 'drawingTools.active' },
};

export const BRUSH_VALUES = [
	'VALUE_BRUSH',
	'VALUE_CALLIGRAPHY_BRUSH',
	'VALUE_CALLIGRAPHY_PEN',
	'VALUE_AIRBRUSH',
	'VALUE_OIL_BRUSH',
	'VALUE_CRAYON',
	'VALUE_MARKER',
	'VALUE_NATURAL_PENCIL',
	'VALUE_WATERCOLOR_BRUSH',
];

const brushValueMapConfig = {
	valuePath: 'selectedBrush', // this is all UpperCase letters
	activePath: 'drawingTools.active',
};

export const brushValueMap = Object.fromEntries(
	BRUSH_VALUES.map((brush_value) => {
		return [brush_value, { ...brushValueMapConfig }];
	}),
);
