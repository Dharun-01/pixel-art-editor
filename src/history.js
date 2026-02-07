import { rotatedPicture, flippedPicture } from './tools.js';
import { resizePicture } from './utils.js';
let rotateActions = ['left', 'right', '180'];
let flipActions = ['vertical', 'horizontal'];
export function historyUpdateState(state, action) {
	if (action.toggleRotate) {
		return {
			...state,
			toggleRotate: !state.toggleRotate,
			toggleFlip: false,
			toggleMirror: false,
			toggleResize: false,
		};
	}

	if (action.toggleFlip) {
		return {
			...state,
			toggleFlip: !state.toggleFlip,
			toggleRotate: false,
			toggleMirror: false,
			toggleResize: false,
		};
	}

	if (action.toggleMirror) {
		return {
			...state,
			toggleMirror: !state.toggleMirror,
			toggleRotate: false,
			toggleFlip: false,
			toggleResize: false,
		};
	}

	if (rotateActions.includes(action.rotate)) {
		return {
			...state,
			picture: rotatedPicture(state, action.rotate),
		};
	}

	if (flipActions.includes(action.flip)) {
		return { ...state, picture: flippedPicture(state, action.flip) };
	}

	if (action.mirrorVertical) {
		if (state.mirrorHorizontal) {
			return {
				...state,
				mirrorVertical: action.mirrorVertical,
				mirrorMainDiagonal: false,
				mirrorOffDiagonal: false,
				toggleMirror: false,
			};
		}

		return {
			...state,
			mirrorVertical: action.mirrorVertical,
			mirrorMainDiagonal: false,
			mirrorOffDiagonal: false,
		};
	}

	if (action.mirrorHorizontal) {
		if (state.mirrorVertical) {
			return {
				...state,
				mirrorHorizontal: action.mirrorHorizontal,
				mirrorMainDiagonal: false,
				mirrorOffDiagonal: false,
				toggleMirror: false,
			};
		}

		return {
			...state,
			mirrorHorizontal: action.mirrorHorizontal,
			mirrorMainDiagonal: false,
			mirrorOffDiagonal: false,
		};
	}

	if (action.mirrorMainDiagonal) {
		if (state.mirrorOffDiagonal) {
			return {
				...state,
				mirrorMainDiagonal: action.mirrorMainDiagonal,
				mirrorVertical: false,
				mirrorHorizontal: false,
				toggleMirror: false,
			};
		}

		return {
			...state,
			mirrorMainDiagonal: action.mirrorMainDiagonal,
			mirrorVertical: false,
			mirrorHorizontal: false,
		};
	}

	if (action.mirrorOffDiagonal) {
		if (state.mirrorMainDiagonal) {
			return {
				...state,
				mirrorOffDiagonal: action.mirrorOffDiagonal,
				mirrorVertical: false,
				mirrorHorizontal: false,
				toggleMirror: false,
			};
		}

		return {
			...state,
			mirrorOffDiagonal: action.mirrorOffDiagonal,
			mirrorVertical: false,
			mirrorHorizontal: false,
		};
	}
	if (action.toggleResize) {
		return {
			...state,
			toggleResize: !state.toggleResize,
			toggleFlip: false,
			toggleRotate: false,
			toggleMirror: false,
		};
	}

	if (action.toggleLinkIcon) {
		return { ...state, toggleLinkIcon: !state.toggleLinkIcon };
	}

	if (action.cursor !== undefined) {
		return { ...state, cursor: action.cursor };
	}
	if (action.ok) {
		let { inputWidth, inputHeight, unit } = action.ok;
		let newWidth, newHeight;

		if (unit === 'percentage') {
			newWidth = Math.floor(inputWidth * state.picture.width) / 100;
			newHeight = Math.floor(inputHeight * state.picture.height) / 100;
		} else {
			newWidth = inputWidth;
			newHeight = inputHeight;
		}
		console.log(inputWidth, inputHeight);
		return { ...state, picture: resizePicture(state, newWidth, newHeight) };
	}

	if (action.toggleGrid) {
		return {
			...state,
			toggleGrid: !state.toggleGrid,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleResize: false,
			toggleRotate: false,
		};
	}

	if (action.toggleErase !== undefined) {
		return {
			...state,
			toggleErase: action.toggleErase,
			selectedBrush: null,
			toggleFlip: false,
			toggleZoomPlus: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			togglePencil: false,
			toggleFill: false,
			toggleColorPicker: false,
			tool: action.toggleErase ? 'erase' : 'pencil',
		};
	}

	if (action.togglePencil !== undefined) {
		return {
			...state,
			togglePencil: action.togglePencil,
			selectedBrush: null,
			toggleZoomPlus: false,
			toggleFlip: false,
			toggleFill: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
			toggleColorPicker: false,
			tool: action.togglePencil ? 'pencil' : 'line',
		};
	}

	if (action.toggleFill !== undefined) {
		return {
			...state,
			toggleFill: action.toggleFill,
			toggleZoomPlus: false,
			togglePencil: false,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
			toggleColorPicker: false,
			tool: action.toggleFill ? 'fill' : 'pencil',
		};
	}

	if (action.toggleColorPicker !== undefined) {
		return {
			...state,
			toggleColorPicker: action.toggleColorPicker,
			selectedBrush: null,
			toggleFill: false,
			toggleZoomPlus: false,
			togglePencil: false,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
			tool: action.toggleColorPicker ? 'pick' : 'pencil',
		};
	}
	if (action.toggleZoomPlus !== undefined) {
		return {
			...state,
			toggleZoomPlus: action.toggleZoomPlus,
			toggleColorPicker: false,
			toggleFill: false,
			togglePencil: false,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
		};
	}

	if (action.toggleZoomSelect !== undefined) {
		return {
			...state,
			toggleZoomSelect: action.toggleZoomSelect,
			toggleZoomPlus: false,
			toggleColorPicker: false,
			toggleFill: false,
			togglePencil: false,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
		};
	}

	if (action.toggleZoomSelectDownArrow !== undefined) {
		return {
			...state,
			toggleZoomSelectDownArrow: action.toggleZoomSelectDownArrow,
			toggleZoomSelect: false,
			toggleZoomPlus: false,
			toggleColorPicker: false,
			toggleFill: false,
			togglePencil: false,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
		};
	}

	if (action.toggleBrush !== undefined) {
		return {
			...state,
			toggleBrush: action.toggleBrush,
			toggleZoomSelectDownArrow: false,
			toggleZoomSelect: false,
			toggleZoomPlus: false,
			toggleColorPicker: false,
			toggleFill: false,
			togglePencil: false,
			toggleFlip: false,
			toggleLinkIcon: false,
			toggleMirror: false,
			toggleResize: false,
			toggleRotate: false,
			toggleErase: false,
		};
	}

	if (action.selectedBrush !== undefined) {
		return {
			...state,
			selectedBrush: action.selectedBrush,
			toggleBrush: false,
			tool: 'brush',
		};
	}

	if (action.isPreview) {
		return { ...state, previewPicture: action.picture };
	} else if (action.undo) {
		if (state.done.length == 0) return state;
		return {
			...state,
			picture: state.done[0],
			previewPicture: null,
			redone: [state.picture, ...state.redone],
			done: state.done.slice(1),
			zoom: state.zoom,
			doneAt: 0,
		};
	} else if (action.redo) {
		if (state.redone.length == 0) return state;
		return {
			...state,
			picture: state.redone[0],
			previewPicture: null,
			done: [state.picture, ...state.done],
			redone: state.redone.slice(1),
			zoom: state.zoom,
			doneAt: 0,
		};
	} else if (action.picture && state.doneAt < Date.now() - 1000) {
		return {
			...state,
			...action,
			previewPicture: null,
			done: [state.picture, ...state.done],
			zoom: state.zoom,
			doneAt: Date.now(),
		};
	}

	// Clear any lingering preview when applying a committed picture
	if (action.picture && !action.isPreview) {
		return { ...state, ...action, previewPicture: null };
	}

	return { ...state, ...action };
}
