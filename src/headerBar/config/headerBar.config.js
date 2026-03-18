import { getAssetPath } from '../../utils';

export const HEADER_SELECT_CONFIG = {
	/* file: {
		type: 'standard',
		string: 'File',
		tooltip: 'File',
		iconStyle: 'icon-style',
		cardOptionsStyle: 'card-options-style',
		popupStyle: 'popup-card-style',
		featureDivStyle: 'feature-div-style',
		options: [
			{ label: '', action: '' },
			{ label: '', action: '' },
			{ label: '', action: '' },
		],
	},

	edit: {
		type: 'standard',
		string: 'Edit',
		tooltip: 'Edit',
		iconStyle: 'icon-style',
		cardOptionsStyle: 'card-options-style',
		popupStyle: 'popup-card-style',
		featureDivStyle: 'feature-div-style',
		options: [
			{ label: '', action: '' },
			{ label: '', action: '' },
			{ label: '', action: '' },
		],
	},

	view: {
		type: 'standard',
		string: 'View',
		tooltip: 'View',
		iconStyle: 'icon-style',
		cardOptionsStyle: 'card-options-style',
		popupStyle: 'popup-card-style',
		featureDivStyle: 'feature-div-style',
		options: [
			{ label: '', action: '' },
			{ label: '', action: '' },
			{ label: '', action: '' },
		],
	},
 */
	save: {
		type: 'custom',
		icon: getAssetPath(
			'/icons/save_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Save Project',
		iconStyle: 'icon-style',
		featureDivStyle: 'featureDivStyle',
		renderContent: 'createSaveContent',
	},

	share: {
		type: 'custom',
		icon: getAssetPath(
			'/icons/share_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Share',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createShareContent',
	},
	load: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/file_open_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Open file',
		iconStyle: 'icon-style',
	},
	upload: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/upload_file_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Import',
		iconStyle: 'icon-style',
	},

	export: {
		type: 'custom',
		icon: getAssetPath(
			'/icons/file_export_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Export',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createExportContent',
	},

	undo: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/undo_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Undo',
		iconStyle: 'icon-style',
	},

	redo: {
		type: 'icon-only',
		icon: getAssetPath(
			'/icons/redo_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		tooltip: 'Redo',
		iconStyle: 'icon-style',
	},
};
