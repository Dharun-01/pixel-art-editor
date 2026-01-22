import {
	elt,
	rgbToHex,
	hexToRgb,
	customName,
	iconDownloader,
} from './utils.js';
import { drawPicture, startLoad } from './tools.js';
import { Picture } from './picture.js';

const iconBorderClasses = ['ring-1', 'ring-custom-blue', 'bg-custom-black'];

export class RotateSelect {
	constructor(state, { _, dispatch }) {
		this.image = elt('img', {
			src: '../assets/rotate_90_degrees_cw_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'z-50 mt-1 p-2 rounded-sm',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleRotate: true });
			},
		});

		this.options = elt(
			'div',
			{
				className:
					'absolute shadow-sm shadow-gray-600 bg-custom-tooltip-gray p-1 top-12 rounded-md ',
			},
			elt(
				'p',
				{
					className: 'p-1 hover:bg-custom-glass-black rounded-md',
					onclick: (event) => {
						this.handleInsideClick(event);
					},
				},
				'Rotate right 90°',
			),
			elt(
				'p',
				{
					className: 'p-1 hover:bg-custom-glass-black rounded-md',
					onclick: (event) => {
						this.handleInsideClick(event);
					},
				},
				'Rotate left 90°',
			),
			elt(
				'p',
				{
					className: 'p-1 hover:bg-custom-glass-black rounded-md',
					onclick: (event) => {
						this.handleInsideClick(event);
					},
				},
				'Rotate 180°',
			),
		);

		this.dom = elt(
			'div',
			{
				className:
					'relative text-white flex flex-column justify-center align-middle',
			},
			this.image,
			this.options,
		);

		this.handleInsideClick = (event) => {
			if (event.target.textContent === 'Rotate right 90°')
				dispatch({ rotate: 'right', toggleRotate: false });
			else if (event.target.textContent === 'Rotate left 90°')
				dispatch({ rotate: 'left', toggleRotate: false });
			else dispatch({ rotate: '180', toggleRotate: false });
		};

		this.handleOutsideClick = (event) => {
			if (!this.dom.contains(event.target)) dispatch({ toggleRotate: false });
		};

		this.syncState(state);
	}

	syncState(state) {
		if (state.toggleRotate) {
			document.addEventListener('click', this.handleOutsideClick);
		} else {
			document.removeEventListener('click', this.handleOutsideClick);
		}

		this.options.classList.toggle('tooltipHidden', !state.toggleRotate);
		iconBorderClasses.forEach((cls) => {
			this.image.classList.toggle(cls, state.toggleRotate);
		});
		this.image.classList.toggle(
			'hover:bg-custom-glass-black',
			!state.toggleRotate,
		);

		this.options.classList.toggle('tooltipVisible', state.toggleRotate);
	}
}

export class StatusBar {
	constructor(state, { tools, dispatch }) {
		this.text = elt('p', { className: 'text-white text-[12px] w-20' });
		this.pixelPosition = elt(
			'div',
			{
				className:
					' flex flex-row items-center w-32 h-5 justify-center gap-x-2',
			},
			elt(
				'p',
				{},
				elt(
					'svg',
					iconDownloader(
						'http://www.w3.org/2000/svg',
						'20px',
						'0 -960 960 960',
						'20px',
						'#ffffff',
					),
					elt('path', {
						d: 'm312-397 85-107h169L312-712v315ZM537-96 399-391 240-192v-672l528 432H486l138 295-87 41ZM397-504Z',
					}),
				),
			),
			this.text,
		);
		this.canvasSizeText = elt(
			'p',
			{
				className: 'text-white text-[12px]',
			},
			`${state.picture.width} x ${state.picture.height}px`,
		);

		this.canvasSize = elt(
			'div',
			{ className: 'flex flex-row items-center justify-between gap-x-2' },
			elt(
				'p',
				{},
				elt(
					'svg',
					iconDownloader(
						'http://www.w3.org/2000/svg',
						'20px',
						'0 -960 960 960',
						'20px',
						'#ffffff',
					),
					elt('path', {
						d: 'M552-312h192v-192h-72v120H552v72ZM216-456h72v-120h120v-72H216v192Zm-48 264q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-432H168v432Zm0 0v-432 432Z',
					}),
				),
			),
			this.canvasSizeText,
		);
		this.leftStatus = elt(
			'div',
			{ className: 'flex flex-row items-center gap-x-8 justify-around ' },
			this.pixelPosition,
			this.canvasSize,
		);
		this.dom = elt(
			'div',
			{
				className:
					'fixed bottom-0 left-0 flex flex-row justify-between items-center h-10 w-screen bg-custom-gray text-gray-300',
			},
			this.leftStatus,
			elt('div', {}, 'Hello'),
		);
		this.syncState(state);
	}

	syncState(state) {
		this.canvasSizeText.textContent = `${state.picture.width} x ${state.picture.height}px`;
		if (!state.cursor) {
			this.text.textContent = '';
		} else {
			console.log(state.cursor.x, state.cursor.y);
			this.text.textContent = `${state.cursor.x}, ${state.cursor.y}px`;
		}
	}
}

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
					name,
				),
			),
		);
		this.dom = elt(
			'label',
			{ className: 'p-1 text-white text-lg' },
			'🖌 Tool: ',
			this.select,
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
			this.input,
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
				elt('option', { selected: name == state.sketch }, name),
			),
		);
		this.dom = elt(
			'label',
			{ className: 'p-1 text-lg text-white' },
			'Sketch: ',
			this.select,
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
			'💾 Save',
		);
	}
	save() {
		let canvas = elt('canvas');
		this.cx = canvas.getContext('2d', { willReadFrequently: true });
		this.ImageData = this.cx.createImageData(
			this.picture.width,
			this.picture.height,
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

			'📁 Load',
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
			'⮪ Undo',
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
			'↪️ Redo',
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
			this.input,
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
			'Erase All',
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
				'🔍+',
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
				'🔍-',
			),
		);
	}

	syncState(state) {
		this.zoom = state.zoom;
	}
}
