import { getAssetPath } from '../../utils';

export const TOOL_SELECT_CONFIG = {
	pencil: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/stylus_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Pencil',
		iconStyle: 'icon-style',
	},

	fill: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/format_color_fill_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Fill',
		iconStyle: 'icon-style',
	},

	erase: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/ink_eraser_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Erase',
		iconStyle: 'icon-style',
	},

	pick: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/colorize_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Color Picker',
		iconStyle: 'icon-style',
	},

	zoomPlus: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/zoom_in_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Zoom In',
		iconStyle: 'icon-style',
	},
};
