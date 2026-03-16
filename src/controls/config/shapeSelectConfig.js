const shapeIconMap = {
	line: {
		img: '../../../assets/pen_size_1_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Line',
	},
	rectangle: {
		img: '../../../assets/rectangle_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Rectangle',
	},
	circle: {
		img: '../../../assets/circle_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Circle',
	},
	triangle: { img: '../../../assets/triangle-icon.svg', tooltip: 'Triangle' },
	rhombus: { img: '../../../assets/rhombus-icon.svg', tooltip: 'Rhombus' },
	square: {
		img: '../../../assets/square_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Square',
	},
	rightTriangle: {
		img: '../../../assets/signal_cellular_null_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Right Triangle',
	},
	pentagon: {
		img: '../../../assets/pentagon_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Pentagon',
	},
	hexagon: {
		img: '../../../assets/hexagon_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Hexagon',
	},
	star: {
		img: '../../../assets/star_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Star',
	},
	fourPointStar: {
		img: '../../../assets/4-point-star-icon.svg',
		tooltip: 'Four Point Star',
	},
	sixPointStar: {
		img: '../../../assets/6-point-star-icon.svg',
		tooltip: 'Six Point Star',
	},
	heart: { img: '../../../assets/heart-icon.svg', tooltip: 'Heart' },
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
			{ ...shapeValueConfig, icon: icon.img, tooltip: icon.tooltip },
		]),
	),
	shapeBrush: {
		type: 'standard',
		icon: '../../../assets/border_color_16dp_4DA3FF.svg',
		tooltip: 'Shape Brushes',
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
