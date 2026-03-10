import { pictureValueMap } from './config/picture.config';
import { setExclusiveValue } from './helper/nestedUpdate';

// this maps for picture object changes in the state
const VALUE_ACTION_TO_PATH = { ...pictureValueMap };

/**
 *
 * @param {Object} state - the old state ready to have new change
 * @param {string} action - the change to be made in the state.
 * @returns  - new changed state
 */

// handler to reduce the picture state which includes doneAt and preview handling
export function pictureReducer(state, action) {
	const { drawing, history } = state;

	// -----PREVIEW-----
	if (VALUE_ACTION_TO_PATH[action.type] && action.isPreview) {
		let config = VALUE_ACTION_TO_PATH[action.type];
		let newDrawing = setExclusiveValue(
			drawing,
			config.valuePreviewPath,
			action.stringValue,
		);

		return { ...state, drawing: newDrawing };
	}

	// if the time diff between old doneAt and new doneAt value is more than 1 second add it to the done array(it is an array containing picture objects).
	if (
		VALUE_ACTION_TO_PATH[action.type] &&
		!action.isPreview &&
		Date.now() - history.doneAt > 1000
	) {
		let config = VALUE_ACTION_TO_PATH[action.type];
		let newDrawing = setExclusiveValue(
			drawing,
			config.valuePicturePath,
			action.stringValue,
		);
		newDrawing = setExclusiveValue(newDrawing, config.valuePreviewPath, null);

		let newHistory = setExclusiveValue(history, config.valueDonePath, [
			drawing.picture,
			...history.done,
		]);

		newHistory = setExclusiveValue(
			newHistory,
			config.valueDoneAtPath,
			Date.now(),
		);
		return { ...state, drawing: newDrawing, history: newHistory };
	}

	// if the action is not previewing, set the new picture object and set the previewPicture to null
	if (VALUE_ACTION_TO_PATH[action.type] && !action.isPreview) {
		let config = VALUE_ACTION_TO_PATH[action.type];
		let newDrawing = setExclusiveValue(
			drawing,
			config.valuePicturePath,
			action.stringValue,
		);
		newDrawing = setExclusiveValue(newDrawing, config.valuePreviewPath, null);
		return { ...state, drawing: newDrawing };
	}

	return state;
}
