import { elt, rgbToHex, hexToRgb } from './utils.js';
import { drawPicture, startLoad } from './tools.js';
import { Picture } from './picture.js';

export class ToolSelect {
	constructor(state, { tools, dispatch }) {
		this.select = elt(
			'select',
			{
				onchange: () => dispatch({ tool: this.select.value }),
			},
			...Object.keys(tools).map((name) =>
				elt(
					'option',
					{
						selected: name == state.tool,
					},
					name
				)
			)
		);
		this.dom = elt('label', null, '🖌 Tool: ', this.select);
	}

	syncState(state) {
		this.select.value = state.tool;
	}
}

export class ColorSelect {
	constructor(state, { dispatch }) {
		this.input = elt('input', {
			type: 'color',
			value: rgbToHex(state.color),
			onchange: () => dispatch({ color: hexToRgb(this.input.value) }),
		});
		this.dom = elt('label', null, '🎨 Color: ', this.input);
	}

	syncState(state) {
		this.input.value = rgbToHex(state.color);
	}
}

export class SketchSelect {
	constructor(state, { sketches, dispatch }) {
		this.select = elt(
			'select',
			{
				onchange: () => {
					dispatch({ sketch: this.select.value });
				},
			},
			...Object.values(sketches).map((name) =>
				elt('option', { selected: name == state.sketch }, name)
			)
		);
		this.dom = elt('label', null, 'Sketch: ', this.select);
	}

	syncState(state) {
		this.select.value = state.sketch;
	}
}

export class SaveButton {
	constructor(state) {
		this.picture = state.picture;
		this.dom = elt(
			'button',
			{
				onclick: () => this.save(),
			},
			'💾 Save'
		);
	}
	save() {
		let canvas = elt('canvas');
		this.cx = canvas.getContext('2d', { willReadFrequently: true });
		this.ImageData = this.cx.createImageData(
			this.picture.width,
			this.picture.height
		);
		drawPicture(this.picture, canvas, 1, null, this.ImageData, this.cx);
		let link = elt('a', {
			href: canvas.toDataURL(),
			download: 'pixelart.png',
		});
		document.body.appendChild(link);
		link.click();
		link.remove();
	}
	syncState(state) {
		this.picture = state.picture;
	}
}

export class LoadButton {
	constructor(_, { dispatch }) {
		this.dom = elt(
			'button',
			{
				onclick: () => startLoad(dispatch),
			},
			'📁 Load'
		);
	}
	syncState() {}
}

export class UndoButton {
	constructor(state, { dispatch }) {
		this.dom = elt(
			'button',
			{
				onclick: () => dispatch({ undo: true }),
				disabled: state.done.length == 0,
			},
			'⮪ Undo'
		);
	}
	syncState(state) {
		this.dom.disabled = state.done.length == 0;
	}
}

export class RedoButton {
	constructor(state, { dispatch }) {
		this.dom = elt(
			'button',
			{
				onclick: () => {
					dispatch({ redo: true });
				},
				disabled: state.redone.length == 0,
			},
			'↪️ Redo'
		);
	}

	syncState(state) {
		this.dom.disabled = state.redone.length === 0;
	}
}

export class EraseButton {
	constructor(_, { dispatch }) {
		this.input = elt('input', {
			type: 'checkbox',
			onchange: () => {
				if (this.input.checked) dispatch({ tool: 'erase' });
				else dispatch({ tool: 'draw' });
			},
		});

		this.dom = elt('label', null, 'Erase', this.input);
	}
	syncState(state) {
		if (state.tool === 'erase') this.input.checked = true;
		else this.input.checked = false;
	}
}

export class EraseAllButton {
	constructor(state, { dispatch }) {
		this.dom = elt(
			'button',
			{
				onclick: () => {
					this.eraseAll(state, dispatch);
				},
			},
			'Erase All'
		);
	}

	eraseAll(_, dispatch) {
		dispatch({ picture: Picture.empty(1000, 400, hexToRgb('#f0f0f0')) });
	}

	syncState() {}
}
const ZOOM = [1, 1.5, 3, 6, 12, 24];
let i = 0;
export class ZoomControls {
	constructor(state, { dispatch }) {
		this.zoom = state.zoom;
		this.dom = elt(
			'div',
			null,
			elt(
				'button',
				{
					onclick: () => {
						if (i < ZOOM.length) {
							i += 1;
							dispatch({ zoom: ZOOM[i] });
						}
					},
				},
				'🔍+'
			),
			elt(
				'button',
				{
					onclick: () => {
						if (i > 0) {
							i -= 1;
							dispatch({ zoom: ZOOM[i] });
						}
					},
				},
				'🔍-'
			)
		);
	}

	syncState(state) {
		this.zoom = state.zoom;
	}
}
