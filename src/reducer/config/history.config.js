const historyTypes = ['SET_UNDO', 'SET_REDO'];
const historyTypeConfig = {
	valuePicturePath: 'picture',
	valuePreviewPath: 'previewPicture',
	valueRedonePath: 'redone',
	valueDonePath: 'done',
	valueZoomPath: 'zoomLevel',
	valueDoneAtPath: 'doneAt',
};

export const historyValueMap = Object.fromEntries(
	historyTypes.map((historyType) => {
		return [historyType, { ...historyTypeConfig }];
	}),
);
