import { toolValueMap } from './config/toolPanel.config';
import { setExclusiveValue } from './helper/nestedUpdate';

// this maps for non-boolean changes in the state
const TOOL_ACTION_TO_PATH = { ...toolValueMap };

/**
 *
 * @param {Object} state - the old state ready to have new change
 * @param {string} action - the change to be made in the state.
 * @returns  - new changed state
 */

// handles state reducing of tool panel
export function toolPanelReducer(state, action) {
	const { ui, tools } = state;

	// for tools slice value insertion
	if (TOOL_ACTION_TO_PATH[action.type]) {
		let newToolState = setExclusiveValue(
			tools,
			TOOL_ACTION_TO_PATH[action.type].valuePath,
			action.stringValue,
		);

		let newUi = setExclusiveValue(
			ui,
			TOOL_ACTION_TO_PATH[action.type].activePath,
			action.stringValue,
		);

		return { ...state, ui: newUi, tools: newToolState };
	}

	return state;
}
