import { PictureCanvas } from './canvas.js';
import { historyUpdateState } from './history.js';
import { startState, baseTools, baseControls, baseSketches } from './config.js';
import { elt } from './utils.js';

export class PixelEditor {
	constructor(state, config) {
		let { tools, sketches, controls, dispatch } = config;
		this.state = state;
		this.sketch = sketches[this.state.sketch];
		this.canvas = new PictureCanvas(
			state.picture,
			(pos) => {
				let tool = tools[this.state.tool];
				try {
					let onMove = tool(pos, this.state, dispatch);
					if (onMove) return (pos, isFinal) => onMove(pos, this.state, isFinal);
				} catch (error) {
					console.error(error);
					alert(`Don't "fill" from Corners OR "Drag" with "fill"`);
				}
			},
			this.state
		);
		this.controls = controls.map((Control) => new Control(state, config));
		this.dom = elt(
			'div',
			{
				tabIndex: 0,
				onkeydown: (event) => {
					this.keyDown(event, config);
				},
			},
			this.canvas.dom,
			elt('br'),
			...this.controls.reduce((a, c) => a.concat(' ', c.dom), [])
		);
	}

	keyDown(event, config) {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			if (event.key == 'z') {
				config.dispatch({ undo: true });
			} else {
				config.dispatch({ redo: true });
			}
		} else if (!event.shiftKey) {
			for (let tool of Object.keys(config.tools)) {
				if (tool[0] == event.key) {
					event.preventDefault();
					config.dispatch({ tool });
					return;
				}
			}
		} else {
			for (let sketch of Object.values(config.sketches)) {
				if (sketch[0] == event.key && event.shiftKey) {
					event.preventDefault();
					config.dispatch({ sketch: sketch });
					return;
				}
			}
		}
	}

	syncState(state) {
		let pic = state.previewPicture ?? state.picture;
		this.state = state;
		this.canvas.syncState(pic, state);
		for (let ctrl of this.controls) ctrl.syncState(this.state);
	}
}

export function startPixelEditor({
	state = startState,
	tools = baseTools,
	sketches = baseSketches,
	controls = baseControls,
}) {
	let app = new PixelEditor(state, {
		tools,
		sketches,
		controls,
		dispatch(action) {
			state = historyUpdateState(state, action);
			app.syncState(state);
		},
	});
	return app.dom;
}
