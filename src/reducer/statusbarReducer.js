import { statusbarValueMap } from './config/statusbar.config';
import {
	createExclusiveToggle,
	setExclusiveValue,
} from './helper/nestedUpdate';
import { statusbarToggleMap } from './config/statusbar.config';

const VALUE_ACTION_TO_PATH = { ...statusbarValueMap };
const TOGGLE_ACTION_TO_PATH = { ...statusbarToggleMap };

export function statusbarReducer(state, action) {
	const { ui, drawing } = state;
	if (action.type === 'SET_ZOOM_LEVEL') {
		const newDrawing = setExclusiveValue(
			drawing,
			VALUE_ACTION_TO_PATH[action.type].valuePath,
			action.stringValue,
		);
		return { ...state, drawing: newDrawing };
	}

	if (action.type === 'SET_CURSOR') {
		return {
			...state,
			ui: setExclusiveValue(
				ui,
				VALUE_ACTION_TO_PATH[action.type].valuePath,
				action.stringValue,
			),
		};
	}

	if (TOGGLE_ACTION_TO_PATH[action.type]) {
		const newUi = createExclusiveToggle(ui, TOGGLE_ACTION_TO_PATH[action.type]);

		return { ...state, ui: newUi };
	}
	return state;
}
