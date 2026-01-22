import { rotatedPicture } from './tools.js';
let rotateActions = ['left', 'right', '180'];
export function historyUpdateState(state, action) {
	if (action.toggleRotate) {
		return { ...state, toggleRotate: !state.toggleRotate };
	}

	if (rotateActions.includes(action.rotate)) {
		return {
			...state,
			picture: rotatedPicture(state, action.rotate),
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
