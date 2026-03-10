import { sizeValueMap } from './config/setSize.config';
import { setExclusiveValue } from './helper/nestedUpdate';

const VALUE_ACTION_TO_PATH = { ...sizeValueMap };

export function setSizeReducer(state, action) {
	const { tools } = state;
	if (VALUE_ACTION_TO_PATH[action.type]) {
		const newTool = setExclusiveValue(
			tools,
			VALUE_ACTION_TO_PATH[action.type],
			action.stringValue,
		);
		return { ...state, tools: newTool };
	}
	return state;
}
