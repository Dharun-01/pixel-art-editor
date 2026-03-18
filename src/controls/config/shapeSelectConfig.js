import { getAssetPath } from '../../utils';

const shapeIconMap = {
	line: {
		img: getAssetPath(
			'/icons/pen_size_1_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Line',
	},
	rectangle: {
		img: getAssetPath(
			'/icons/rectangle_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Rectangle',
	},
	circle: {
		img: getAssetPath(
			'/icons/circle_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Circle',
	},
	triangle: {
		img: getAssetPath('/icons/triangle-icon.svg'),
		tooltip: 'Triangle',
	},
	rhombus: { img: getAssetPath('/icons/rhombus-icon.svg'), tooltip: 'Rhombus' },
	square: {
		img: getAssetPath(
			'/icons/square_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Square',
	},
	rightTriangle: {
		img: getAssetPath(
			'/icons/signal_cellular_null_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Right Triangle',
	},
	pentagon: {
		img: getAssetPath(
			'/icons/pentagon_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Pentagon',
	},
	hexagon: {
		img: getAssetPath(
			'/icons/hexagon_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Hexagon',
	},
	star: {
		img: getAssetPath('/icons/star_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg'),
		tooltip: 'Star',
	},
	fourPointStar: {
		img: getAssetPath('/icons/4-point-star-icon.svg'),
		tooltip: 'Four Point Star',
	},
	sixPointStar: {
		img: getAssetPath('/icons/6-point-star-icon.svg'),
		tooltip: 'Six Point Star',
	},
	heart: { img: getAssetPath('/icons/heart-icon.svg'), tooltip: 'Heart' },
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
		icon: getAssetPath('/icons/border_color_16dp_4DA3FF.svg'),
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
