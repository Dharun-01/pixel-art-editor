import {
	createExclusiveToggle,
	setExclusiveValue,
} from './helper/nestedUpdate.js';
import {
	imageToggleMap,
	imageBooleanMap,
	imageValueMap,
} from './config/imagePanel.config.js';

// this maps for mutually exclusive toggles in the state
const TOGGLE_ACTION_TO_PATH = {
	...imageToggleMap,
};

// this maps for non-boolean changes in the state
const VALUE_ACTION_TO_PATH = {
	...imageValueMap,
};

//this maps for boolean changes in the state (Here it is gridVisible)
const BOOLEAN_ACTION_TO_PATH = {
	...imageBooleanMap,
};

/**
 *
 * @param {Object} state - the old state ready to have new change
 * @param {string} action - the change to be made in the state.
 * @returns  - new changed state
 */

// handles state reducing of image control
export function imagePanelReducer(state, action) {
	// Toggle the required panels (e.g: rotate,flip, mirror etc...)
	const { ui } = state;

	// for ui toggles
	if (TOGGLE_ACTION_TO_PATH[action.type]) {
		return {
			...state,
			ui: setExclusiveValue(
				ui,
				TOGGLE_ACTION_TO_PATH[action.type],
				action.stringValue,
			),
		};
	}

	// for resize inputs
	if (action.type === 'SET_RESIZE_WIDTH') {
		let newUi = setExclusiveValue(
			ui,
			'transform.resize.width',
			action.stringValue,
		);
		if (ui.transform.resize.linked) {
			newUi = setExclusiveValue(
				newUi,
				'transform.resize.height',
				action.stringValue,
			);
		}
		return { ...state, ui: newUi };
	}

	if (action.type === 'SET_RESIZE_HEIGHT') {
		let newUi = setExclusiveValue(
			ui,
			'transform.resize.height',
			action.stringValue,
		);
		if (ui.transform.resize.linked) {
			newUi = setExclusiveValue(
				newUi,
				'transform.resize.width',
				action.stringValue,
			);
		}
		return { ...state, ui: newUi };
	}

	// set error messages for resize inputs
	if (action.type === 'SET_RESIZE_WIDTH_ERROR') {
		let newUi = setExclusiveValue(
			ui,
			'transform.resize.widthErrorMessage',
			action.stringValue,
		);
		if (ui.transform.resize.linked) {
			newUi = setExclusiveValue(
				newUi,
				'transform.resize.heightErrorMessage',
				action.stringValue,
			);
		}
		return { ...state, ui: newUi };
	}

	if (action.type === 'SET_RESIZE_HEIGHT_ERROR') {
		let newUi = setExclusiveValue(
			ui,
			'transform.resize.heightErrorMessage',
			action.stringValue,
		);
		if (ui.transform.resize.linked) {
			newUi = setExclusiveValue(
				newUi,
				'transform.resize.widthErrorMessage',
				action.stringValue,
			);
		}
		return { ...state, ui: newUi };
	}

	// set canvas dimensions
	if (action.type === 'SET_CANVAS_DIMENSIONS') {
		const newUi = setExclusiveValue(ui, 'canvas', action.stringValue);
		return { ...state, ui: newUi };
	}

	// cancel resize
	if (action.type === 'CANCEL_RESIZE') {
		let newUi = setExclusiveValue(
			ui,
			'transform.resize.width',
			state.ui.transform.resize.width,
		);
		newUi = setExclusiveValue(
			newUi,
			'transform.resize.height',
			state.ui.transform.resize.height,
		);
		return { ...state, ui: newUi };
	}

	// Close resize panel
	if (action.type === 'CLOSE_RESIZE_PANEL') {
		const newUi = setExclusiveValue(ui, 'transform.activeMode', null);
		return { ...state, ui: newUi };
	}

	// for gridVisible toggles
	if (BOOLEAN_ACTION_TO_PATH[action.type]) {
		return {
			...state,
			ui: createExclusiveToggle(ui, BOOLEAN_ACTION_TO_PATH[action.type]),
		};
	}

	// for value toggles
	if (VALUE_ACTION_TO_PATH[action.type]) {
		let newUiState = setExclusiveValue(
			ui,
			VALUE_ACTION_TO_PATH[action.type].valuePath,
			action.stringValue,
		);
		newUiState = setExclusiveValue(
			newUiState,
			VALUE_ACTION_TO_PATH[action.type].togglePath,
			null,
		);
		return { ...state, ui: newUiState };
	}

	return state;
}
