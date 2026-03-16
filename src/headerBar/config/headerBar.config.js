export const HEADER_SELECT_CONFIG = {
	file: {
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

	share: {
		type: 'custom',
		icon: '../../../assets/share_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Share',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createShareContent',
	},

	upload: {
		type: 'icon-only',
		icon: '../../../assets/upload_file_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Upload',
		iconStyle: 'icon-style',
	},

	export: {
		type: 'custom',
		icon: '../../../assets/file_export_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Export',
		iconStyle: 'icon-style',
		featureDivStyle: 'feature-div-style',
		renderContent: 'createExportContent',
	},

	undo: {
		type: 'icon-only',
		icon: '../../../assets/undo_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Undo',
		iconStyle: 'icon-style',
	},

	redo: {
		type: 'icon-only',
		icon: '../../../assets/redo_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		tooltip: 'Redo',
		iconStyle: 'icon-style',
	},
};
