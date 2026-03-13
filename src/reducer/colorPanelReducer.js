import { colorValueMap, colorToggleMap } from './config/colorPanel.config';
import {
	createExclusiveToggle,
	setExclusiveValue,
} from './helper/nestedUpdate';

const VALUE_ACTION_TO_PATH = { ...colorValueMap };
const TOGGLE_ACTION_TO_PATH = { ...colorToggleMap };

export function colorPanelReducer(state, action) {
	const { ui } = state;

	if (VALUE_ACTION_TO_PATH[action.type]) {
		let newUi = setExclusiveValue(
			ui,
			VALUE_ACTION_TO_PATH[action.type],
			action.stringValue,
		);

		return { ...state, ui: newUi };
	}

	if (TOGGLE_ACTION_TO_PATH[action.type]) {
		let newUi = createExclusiveToggle(ui, TOGGLE_ACTION_TO_PATH[action.type]);
		return { ...state, ui: newUi };
	}

	return state;
}
