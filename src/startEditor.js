import { AppController } from './app/appController';
import { updateState } from './updateState.js';
import { startState, baseTools, baseControls } from './config.js';

export function startPixelEditor({
	state = startState,
	tools = baseTools,
	controls = baseControls,
}) {
	let app = new AppController(state, {
		tools,
		controls,
		dispatch(action) {
			state = updateState(state, action);
			app.syncState(state);
		},
	});
	return app.appView.dom;
}

const app = startPixelEditor({});
document.getElementById('app').appendChild(app);
