import { getAssetPath } from '../../utils';

export const IMAGE_SELECT_CONFIG = {
	/* ═══════════════════════════════════════
       STANDARD FEATURES (follow pattern)
     ═══════════════════════════════════════ */

	rotate: {
		type: 'standard',
		icon: getAssetPath(
			'/icons/rotate_90_degrees_cw_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Rotate',
		iconStyle: 'icon-style',
		cardOptionsStyle: 'card-options-style',
		popupStyle: 'popup-card-style',
		featureDivStyle: 'feature-div-style',
		options: [
			{ label: 'Rotate right 90°', action: 'onRotateRight' },
			{ label: 'Rotate left 90°', action: 'onRotateLeft' },
			{ label: 'Rotate 180°', action: 'onRotate180' },
		],
	},

	flip: {
		type: 'standard',
		icon: getAssetPath(
			'/icons/flip_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Flip',
		iconStyle: 'icon-style',
		cardOptionsStyle: 'card-options-style',
		popupStyle: 'popup-card-style',
		featureDivStyle: 'feature-div-style',
		options: [
			{ label: 'Flip Vertical', action: 'onFlipVertical' },
			{ label: 'Flip Horizontal', action: 'onFlipHorizontal' },
		],
	},

	grid: {
		type: 'icon-only',
		tooltip: 'Grid',
		icon: getAssetPath(
			'/icons/grid_3x3_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		iconStyle: 'icon-style',
	},

	/* ═══════════════════════════════════════
         CUSTOM FEATURES (Escape Hatch)
     ═══════════════════════════════════════ */

	mirror: {
		type: 'custom',
		icon: getAssetPath(
			'/icons/align_justify_center_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Mirror',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createMirrorContent', // Reference to custom builder function
	},

	resize: {
		type: 'custom',
		icon: getAssetPath(
			'/icons/resize_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Resize',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createResizeContent', // Reference to custom builder function
	},
};
