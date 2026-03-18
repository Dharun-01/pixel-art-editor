import { getAssetPath } from '../../utils';

export const BRUSH_SELECT_CONFIG = {
	brush: {
		type: 'standard',
		icon: getAssetPath(
			'/icons/brush_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Brush',
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
