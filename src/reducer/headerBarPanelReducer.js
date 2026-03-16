import { headerBarValueMap } from './config/headerBarPanel.config';
import { setExclusiveValue } from './helper/nestedUpdate';

const VALUE_ACTION_TO_PATH = { ...headerBarValueMap };

export function headerBarPanelReducer(state, action) {
	const { ui } = state;

	if (VALUE_ACTION_TO_PATH[action.type]) {
		let newUi = setExclusiveValue(
			ui,
			VALUE_ACTION_TO_PATH[action.type],
			action.stringValue,
		);
		return { ...state, ui: newUi };
	}

	return state;
}
