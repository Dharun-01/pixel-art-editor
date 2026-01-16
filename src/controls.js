import { elt, rgbToHex, hexToRgb, customName } from './utils.js';
import { drawPicture, startLoad } from './tools.js';
import { Picture } from './picture.js';

export class ToolSelect {
	constructor(state, { tools, dispatch }) {
		this.select = elt(
			'select',
			{
				onchange: () => dispatch({ tool: this.select.value }),
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500',
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
		this.dom = elt(
			'label',
			{ className: 'p-1 text-white text-lg' },
			'🖌 Tool: ',
			this.select
		);
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
			className:
				'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500',
		});
		this.dom = elt(
			'label',
			{ className: ' p-1 text-lg text-white' },
			'🎨 Color: ',
			this.input
		);
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
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500',
			},
			...Object.values(sketches).map((name) =>
				elt('option', { selected: name == state.sketch }, name)
			)
		);
		this.dom = elt(
			'label',
			{ className: 'p-1 text-lg text-white' },
			'Sketch: ',
			this.select
		);
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
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500',
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
			download: customName(),
		});

		document.body.appendChild(link);

		link.click();
		window.confirm();
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
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500',
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
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500',
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
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500',
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

		this.dom = elt(
			'label',
			{
				className:
					' px-3 py-2 rounded-lg hover:bg-black hover:opacity-50 text-white text-lg',
			},
			'Erase',
			this.input
		);
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
				className:
					'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500 mt-7',
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
			{ className: 'inline p-5 ml-3 ' },
			elt(
				'button',
				{
					onclick: () => {
						if (i < ZOOM.length) {
							i += 1;
							dispatch({ zoom: ZOOM[i] });
						}
					},
					className:
						'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500',
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
					className:
						'bg-gray-700 text-white rounded-lg px-3 py-2 ml-2 focus:ring-2 focus:ring-green-500 hover:bg-gray-500',
				},
				'🔍-'
			)
		);
	}

	syncState(state) {
		this.zoom = state.zoom;
	}
}
