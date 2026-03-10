import { historyValueMap } from './config/history.config';
import { setExclusiveValue } from './helper/nestedUpdate';

// this maps for non-boolean changes in the state
const VALUE_ACTION_TO_PATH = { ...historyValueMap };

export function historyPanelReducer(state, action) {
	const { drawing, history } = state;

	// edge case handling
	if (action.type === 'SET_UNDO' && history.done.length === 0) {
		return state;
	}

	if (action.type === 'SET_REDO' && history.redone.length === 0) {
		return state;
	}

	if (VALUE_ACTION_TO_PATH[action.type]) {
		let config = VALUE_ACTION_TO_PATH[action.type];
		let newDrawing;
		newDrawing = setExclusiveValue(drawing, config.valuePreviewPath, null);
		let newHistory = history;
		newDrawing = setExclusiveValue(
			newDrawing,
			config.valueZoomPath,
			drawing.zoomLevel,
		);

		if (action.type === 'SET_UNDO') {
			newDrawing = setExclusiveValue(
				newDrawing,
				config.valuePicturePath,
				history.done[0],
			);
			newHistory = setExclusiveValue(newHistory, config.valueRedonePath, [
				drawing.picture,
				...history.redone,
			]);
			newHistory = setExclusiveValue(
				newHistory,
				config.valueDonePath,
				history.done.slice(1),
			);
		} else {
			newDrawing = setExclusiveValue(
				newDrawing,
				config.valuePicturePath,
				history.redone[0],
			);
			newHistory = setExclusiveValue(
				newHistory,
				config.valueRedonePath,
				history.redone.slice(1),
			);
			newHistory = setExclusiveValue(newHistory, config.valueDonePath, [
				drawing.picture,
				...history.done,
			]);
		}

		return { ...state, drawing: newDrawing, history: newHistory };
	}

	return state;
}
