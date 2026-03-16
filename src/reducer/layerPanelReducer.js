import { layerToggleMap } from './config/layerPanel.config';
import { createExclusiveToggle } from './helper/nestedUpdate';

const TOGGLE_ACTION_TO_PATH = { ...layerToggleMap };

export function layerPanelReducer(state, action) {
	const { ui } = state;

	if (TOGGLE_ACTION_TO_PATH[action.type]) {
		let newUi = createExclusiveToggle(ui, TOGGLE_ACTION_TO_PATH[action.type]);
		return { ...state, ui: newUi };
	}

	return state;
}
