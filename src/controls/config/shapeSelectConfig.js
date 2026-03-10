const shapeIconMap = {
	line: '../../../assets/pen_size_1_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	rectangle:
		'../../../assets/rectangle_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	circle: '../../../assets/circle_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	triangle: '../../../assets/triangle-icon.svg',
	rhombus: '../../../assets/rhombus-icon.svg',
	square: '../../../assets/square_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	rightTriangle:
		'../../../assets/signal_cellular_null_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	pentagon:
		'../../../assets/pentagon_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	hexagon: '../../../assets/hexagon_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	star: '../../../assets/star_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
	fourPointStar: '../../../assets/4-point-star-icon.svg',
	sixPointStar: '../../../assets/6-point-star-icon.svg',
	heart: '../../../assets/heart-icon.svg',
};

const shapeValueConfig = {
	type: 'icon-only',
	icon: '',
	iconStyle: 'shape-icon-style',
};

export const SHAPE_SELECT_CONFIG = {
	...Object.fromEntries(
		Object.entries(shapeIconMap).map(([key, icon]) => [
			key,
			{ ...shapeValueConfig, icon },
		]),
	),
	shapeBrush: {
		type: 'standard',
		icon: '../../../assets/border_color_16dp_4DA3FF.svg',
		iconStyle: 'icon-style',
		cardOptionsStyle: 'card-options-style',
		popupStyle: 'popup-card-style',
		featureDivStyle: 'feature-div-style',
		options: [
			{ label: 'Brush', action: 'onBrush' },
			{ label: 'Calligraphy brush', action: 'onCalligraphyBrush' },
			{ label: 'Calligraphy pen', action: 'onCalligraphyPen' },
			{ label: 'Airbrush', action: 'onAirbrush' },
			{ label: 'Oil brush', action: 'onOilBrush' },
			{ label: 'Crayon', action: 'onCrayon' },
			{ label: 'Marker', action: 'onMarker' },
			{ label: 'Natural pencil', action: 'onNaturalPencil' },
			{ label: 'Watercolor brush', action: 'onWatercolorBrush' },
		],
	},
};
