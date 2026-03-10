import { brushToggleMap, brushValueMap } from './config/brushPanel.config';
import { setExclusiveValue } from './helper/nestedUpdate';

// this maps for mutually exclusive toggles
const TOGGLE_ACTION_TO_PATH = { ...brushToggleMap };

// this maps for non-boolean changes in the state
const VALUE_ACTION_TO_PATH = { ...brushValueMap };

// handles reducing of brush panel
export function brushPanelReducer(state, action) {
	const { ui, tools } = state;
	if (TOGGLE_ACTION_TO_PATH[action.type]) {
		const newUi = setExclusiveValue(
			ui,
			TOGGLE_ACTION_TO_PATH[action.type].activePath,
			action.stringValue,
		);
		return { ...state, ui: newUi };
	}

	if (VALUE_ACTION_TO_PATH[action.type]) {
		let newTool = setExclusiveValue(
			tools,
			VALUE_ACTION_TO_PATH[action.type].valuePath,
			action.stringValue,
		);
		let newUi = setExclusiveValue(
			ui,
			VALUE_ACTION_TO_PATH[action.type].activePath,
			null,
		);
		newTool = setExclusiveValue(newTool, 'tool', 'brush');
		return { ...state, tools: newTool, ui: newUi };
	}

	return state;
}
