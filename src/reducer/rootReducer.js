import { imagePanelReducer } from './imagePanelReducer.js';
import { toolPanelReducer } from './toolPanelReducer.js';
import { brushPanelReducer } from './brushPanelReducer.js';
import { shapePanelReducer } from './shapePanelReducer.js';
import { historyPanelReducer } from './historyPanelReducer.js';
import { pictureReducer } from './pictureReducer.js';
import { statusbarReducer } from './statusbarReducer.js';
import { setSizeReducer } from './setSizeReducer.js';
import { colorPanelReducer } from './colorPanelReducer.js';

export function rootReducer(state, action) {
	let newState = state;
	newState = imagePanelReducer(newState, action);
	newState = toolPanelReducer(newState, action);
	newState = brushPanelReducer(newState, action);
	newState = shapePanelReducer(newState, action);
	newState = historyPanelReducer(newState, action);
	newState = pictureReducer(newState, action);
	newState = statusbarReducer(newState, action);
	newState = setSizeReducer(newState, action);
	newState = colorPanelReducer(newState, action);
	return newState;
}
