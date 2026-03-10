import {
	shapeToggleMap,
	shapeBrushValueMap,
	shapeBooleanMap,
} from './config/shapePanel.config';
import {
	createExclusiveToggle,
	setExclusiveValue,
} from './helper/nestedUpdate';

// this maps for boolean changes in the state
const BOOLEAN_ACTION_TO_PATH = { ...shapeBooleanMap };

// this maps for mutually exclusive toggles
const TOGGLE_ACTION_TO_PATH = { ...shapeToggleMap };

// this maps for non-boolean changes in the state
const VALUE_ACTION_TO_PATH = { ...shapeBrushValueMap };

/**
 *
 * @param {Object} state - the old state ready to have new change
 * @param {string} action - the change to be made in the state.
 * @returns  - new changed state
 */

// handler for reducing shape panel
export function shapePanelReducer(state, action) {
	const { ui, tools } = state;

	if (TOGGLE_ACTION_TO_PATH[action.type]) {
		let config = TOGGLE_ACTION_TO_PATH[action.type];
		let newUi = setExclusiveValue(ui, config.activePath, action.stringValue);
		let newTool = setExclusiveValue(
			tools,
			config.valuePath,
			action.stringValue,
		);
		return { ...state, ui: newUi, tools: newTool };
	}

	if (BOOLEAN_ACTION_TO_PATH[action.type]) {
		let config = BOOLEAN_ACTION_TO_PATH[action.type];
		let newUi = createExclusiveToggle(ui, config.activeShapeBrushPath);
		return { ...state, ui: newUi };
	}

	if (VALUE_ACTION_TO_PATH[action.type]) {
		let config = VALUE_ACTION_TO_PATH[action.type];
		let newTool = setExclusiveValue(
			tools,
			config.valuePath,
			action.stringValue,
		);
		newTool = setExclusiveValue(newTool, 'selectedBrush', null);
		let newUi = setExclusiveValue(ui, config.togglePath, false);
		return { ...state, tools: newTool, ui: newUi };
	}

	return state;
}
