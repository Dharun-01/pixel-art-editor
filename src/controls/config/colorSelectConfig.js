import { getAssetPath } from '../../utils';

const colorSlots = [
	'slot1',
	'slot2',
	'slot3',
	'slot4',
	'slot5',
	'slot6',
	'slot7',
	'slot8',
	'slot9',
	'slot10',
];

const colorSlotConfig = {
	type: 'div-only',
	data: { slot: '' },
	divStyle: 'color-slot-style',
};

export const COLOR_SELECT_CONFIG = {
	primaryColor: {
		type: 'div-only',
		data: { slot: 'primaryColor', defaultColor: '#202020' },
		divStyle: 'primary-slot-style',
	},

	secondaryColor: {
		type: 'div-only',
		data: { slot: 'secondaryColor', defaultColor: '#ffffff' },
		divStyle: 'secondary-slot-style',
	},

	...Object.fromEntries(
		colorSlots.map((slot) => [
			slot,
			{ ...colorSlotConfig, data: { slot: slot } },
		]),
	),

	customColorSelector: {
		type: 'custom',
		icon: getAssetPath(
			'/icons/palette_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Custom Color',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createColorContent',
	},
};
