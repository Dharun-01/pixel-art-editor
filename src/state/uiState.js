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
			width: 100 || null,
			height: 100 || null, // { width: number, height: number }
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
	color: {
		isCustomActive: false,
		activeSlot: 'primaryColor',
		hue: 0,
		saturation: 0,
		brightness: 0,
		hexInputErrorMessage: null,
	},
	header: {
		activeIcon: null, // 'export' || 'share'
		export: {
			fileName: 'My Picture',
			fileType: 'png',
			scale: 1,
			quality: 0.92,
		},
		save: {
			fileName: 'myArt',
		},
		share: {
			title: 'My Drawing',
			description: 'Check out my pixel art!',
			fileName: 'pixelArt',
			fileType: 'png',
		},
	},
	layer: {
		isActive: false,
	},
	cursorVisible: null, // Status bar pixel position stats
};
