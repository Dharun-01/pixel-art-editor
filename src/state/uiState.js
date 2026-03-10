export const initialUiState = {
	transform: {
		activeMode: null, // rotate, flip, mirror, resize
		rotate: {
			direction: null, // 'left' | 'right' etc.
		},
		flip: {
			direction: null, // 'horizontal' | 'vertical' etc.
		},
		mirror: {
			axis: null, // 'vertical' | 'horizontal' | 'mainDiagonal' | 'offDiagonal' | 'orthogonal' | 'diagonal'
		},
		resize: {
			width: null,
			height: null, // { width: number, height: number }
			widthErrorMessage: null,
			heightErrorMessage: null,
			unit: 'percentage', // or 'pixels'
			linked: false,
		},
		gridVisible: false,
	},
	canvas: '1000x400',
	drawingTools: {
		active: null, // fill, pencil, zoom plus, erase, color picker, brush,
	},
	drawingShapeTools: {
		activeBrush: false,
	},
	zoomControls: {
		zoomSelect: false,
		zoomSelectDownArrow: false,
	},
	utilities: {
		linkIcon: false,
	},
	cursorVisible: null, // Status bar pixel position stats
};
