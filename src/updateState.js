import { rootReducer } from './reducer/rootReducer.js';
export function updateState(state, action) {
	let newState = rootReducer(state, action);

	return newState;
}
