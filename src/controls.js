import {
	elt,
	rgbToHex,
	hexToRgb,
	customName,
	iconDownloader,
	reflectSelect,
} from './utils.js';
import { StatusBar } from './statusbar.js';
import { drawPicture, startLoad } from './tools.js';
import { Picture } from './picture.js';

const iconBorderClasses = ['ring-1', 'ring-custom-blue', 'bg-custom-black'];

export class ImageSelect {
	constructor(state, { _, dispatch }) {
		this.state = state;
		this.rotateIcon = elt('img', {
			src: '../assets/rotate_90_degrees_cw_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'z-50 mt-1 p-2 rounded-sm',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({
					toggleRotate: true,
					toggleFlip: false,
					toggleMirror: false,
				});
			},
		});

		this.rotateOptions = elt(
			'div',
			{
				className:
					'absolute shadow-sm shadow-gray-600 bg-custom-tooltip-gray p-1 top-12 left-3 rounded-md min-w-32',
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

		this.rotate = elt(
			'div',
			{
				className:
					'relative text-white flex flex-column justify-center align-middle',
			},
			this.rotateIcon,
			this.rotateOptions,
		);

		this.flipIcon = elt('img', {
			src: '../assets/flip_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'z-50 mt-1 p-2 rounded-sm',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({
					toggleFlip: true,
					toggleRotate: false,
					toggleMirror: false,
				});
			},
		});

		this.flipOptions = elt(
			'div',
			{
				className:
					'absolute shadow-sm shadow-gray-600 bg-custom-tooltip-gray p-1 min-w-32 top-12 rounded-md ',
			},
			elt(
				'p',
				{
					className: 'hover:bg-custom-glass-black rounded-md p-1',
					onclick: (event) => this.handleInsideClick(event),
				},
				'Flip Vertical',
			),
			elt(
				'p',
				{
					className: 'hover:bg-custom-glass-black rounded-md p-1',
					onclick: (event) => this.handleInsideClick(event),
				},
				'Flip Horizontal',
			),
		);

		this.flip = elt(
			'div',
			{
				className:
					'relative flex flex-column align-middle text-white justify-center',
			},
			this.flipIcon,
			this.flipOptions,
		);

		this.mirrorIcon = elt('img', {
			src: '../assets/align_justify_center_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-sm mt-1 p-2',
			onclick: () => {
				dispatch({
					toggleMirror: true,
					toggleRotate: false,
					toggleFlip: false,
				});
			},
		});

		this.reflectVertical = reflectSelect('Reflect Vertical', dispatch);
		this.reflectHorizontal = reflectSelect('Reflect Horizontal', dispatch);
		this.reflectMainDiagonal = reflectSelect('Reflect MainDiagonal', dispatch);
		this.reflectOffDiagonal = reflectSelect('Reflect OffDiagonal', dispatch);
		this.reflectOptionVertical = this.reflectVertical.reflectOption;
		this.reflectOptionHorizontal = this.reflectHorizontal.reflectOption;
		this.reflectOptionMainDiagonal = this.reflectMainDiagonal.reflectOption;
		this.reflectOptionOffDiagonal = this.reflectOffDiagonal.reflectOption;
		this.reflectCheckboxVertical = this.reflectVertical.reflectCheckbox;
		this.reflectCheckboxHorizontal = this.reflectHorizontal.reflectCheckbox;
		this.reflectCheckboxMainDiagonal = this.reflectMainDiagonal.reflectCheckbox;
		this.reflectCheckboxOffDiagonal = this.reflectOffDiagonal.reflectCheckbox;

		this.mirrorOptions = elt(
			'div',
			{
				className:
					'absolute shadow-sm shadow-gray-600 min-w-36 bg-custom-tooltip-gray p-1 top-12 rounded-md',
			},
			this.reflectOptionVertical,
			this.reflectOptionHorizontal,
			this.reflectOptionMainDiagonal,
			this.reflectOptionOffDiagonal,
		);

		this.mirror = elt(
			'div',
			{
				className:
					'relative flex flex-column align-middle text-white justify-center',
			},
			this.mirrorIcon,
			this.mirrorOptions,
		);

		this.resizeIcon = elt('img', {
			className: 'rounded-sm mt-1 p-2',
			src: '../assets/resize_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleResize: true });
			},
		});

		((this.linkSvg = elt(
			'svg',
			iconDownloader(
				'http://www.w3.org/2000/svg',
				'16px',
				'0 -960 960 960',
				'16px',
				'#e3e3e3',
			),
			elt('path', {
				d: 'M432-288H288q-79.68 0-135.84-56.23Q96-400.45 96-480.23 96-560 152.16-616q56.16-56 135.84-56h144v72H288q-50 0-85 35t-35 85q0 50 35 85t85 35h144v72Zm-96-156v-72h288v72H336Zm192 156v-72h144q50 0 85-35t35-85q0-50-35-85t-85-35H528v-72h144q79.68 0 135.84 56.23 56.16 56.22 56.16 136Q864-400 807.84-344 751.68-288 672-288H528Z',
			}),
		)),
			((this.linkIcon = elt(
				'p',
				{
					className: 'rounded-sm border border-white/10 p-1.5 mb-0.5',
					onclick: (event) => {
						event.stopPropagation();
						dispatch({ toggleLinkIcon: true });
					},
				},
				this.linkSvg,
			)),
			(this.widthInput = elt('input', {
				type: 'text',
				className:
					'w-24 outline-none hover:bg-custom-glass-black focus:bg-custom-black  border-b-[#e3e3e3] border border-x-white/10 border-t-white/10 bg-white/10 rounded-sm p-1 ',
				id: 'width',
				maxLength: '5',
				oninput: (event) => {
					this.validateInput(this.state, event.target, 'width');
					this.inputLinkCheck(event.target, this.state, 'width');
				},
			})),
			(this.widthInputErrorMessage = elt(
				'p',
				{ className: 'absolute top-15 text-red-500 text-[10px] mt-1 hidden' },
				'',
			)),
			(this.heightInput = elt('input', {
				type: 'text',
				className:
					'w-24 outline-none hover:bg-custom-glass-black focus:bg-custom-black  border-b-[#e3e3e3] border border-x-white/10 border-t-white/10 bg-white/10 rounded-sm p-1',
				id: 'height',
				maxLength: '5',
				oninput: (event) => {
					this.validateInput(this.state, event.target, 'height');
					this.inputLinkCheck(event.target, this.state, 'height');
				},
			})),
			(this.heightInputErrorMessage = elt(
				'p',
				{
					className: 'absolute top-15 text-red-500 text-[10px] mt-1 hidden',
				},
				'',
			)),
			(this.okButton = elt(
				'button',
				{
					className:
						' bg-gray-500 cursor-not-allowed px-2 py-1 min-w-32 border-none outline-none rounded-md',
					onclick: () => {
						dispatch({ toggleResize: true });
						this.ok(dispatch);
					},
				},
				'Ok',
			)),
			(this.cancelButton = elt(
				'button',
				{
					className:
						'bg-custom-glass-black hover:bg-white/10 border border-white/2 text-white min-w-32 px-2 py-1 outline-none rounded-md',
					onclick: () => {
						dispatch({ toggleResize: true });
						this.cancel();
					},
				},
				'Cancel',
			)),
			(this.percentageInput = elt('input', {
				type: 'radio',
				name: 'resize',
				checked: true,
				id: 'percentage',
			})),
			(this.resizeOptions = elt(
				'div',
				{
					className:
						'flex flex-col absolute shadow-sm gap-y-6 shadow-gray-600 min-w-36 min-h-32 bg-custom-tooltip-gray p-3 top-12 left-10 rounded-md',
				},
				elt(
					'div',
					{ className: 'flex flex-col gap-y-2' },
					elt('p', { className: 'font-semibold text-[15px] ' }, 'Select Unit'),
					elt(
						'div',
						{
							className: 'flex flex-row items-center gap-x-17 justify-left',
						},
						elt(
							'div',
							{ className: 'flex flex-row gap-x-2' },
							elt('label', { htmlFor: 'percentage' }, 'Percentage'),
							this.percentageInput,
						),
						elt(
							'div',
							{ className: 'flex flex-row gap-x-2' },
							elt('label', { htmlFor: 'pixels' }, 'Pixels'),
							elt('input', { type: 'radio', name: 'resize', id: 'pixels' }),
						),
					),
				),
				elt(
					'div',
					{ className: 'flex flex-row items-end justify-between' },
					elt(
						'div',
						{ className: 'relative flex flex-col gap-y-1' },
						elt('label', { htmlFor: 'width' }, 'Width'),
						this.widthInput,
						this.widthInputErrorMessage,
					),
					this.linkIcon,
					elt(
						'div',
						{ className: 'relative flex flex-col gap-y-1' },
						elt('label', { htmlFor: 'height' }, 'Height'),
						this.heightInput,
						this.heightInputErrorMessage,
					),
				),
				elt(
					'div',
					{
						className:
							'flex flex-row mt-6 gap-x-2 text-custom-black items-center justify-between',
					},
					this.okButton,
					this.cancelButton,
				),
			))));

		this.resize = elt(
			'div',
			{
				className:
					'relative flex flex-column align-middle text-white justify-center',
			},
			this.resizeIcon,
			this.resizeOptions,
		);

		this.gridIcon = elt('img', {
			src: '../assets/grid_3x3_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-sm mt-1 p-2',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleGrid: true });
			},
		});

		this.controlLabel = elt(
			'p',
			{ className: 'text-white/60 text-center text-sm' },
			'Image',
		);
		this.features = elt(
			'div',
			{
				className:
					'flex flex-row flex-wrap gap-x-6 justify-around items-center',
			},
			this.rotate,
			this.flip,
			this.mirror,
			this.resize,
			this.gridIcon,
			this.controlLabel,
		);

		this.dom = elt(
			'div',
			{ className: 'flex flex-col justify-between' },
			this.features,
			this.controlLabel,
		);

		this.handleInsideClick = (event) => {
			if (this.state.toggleRotate) {
				if (event.target.textContent === 'Rotate right 90°')
					dispatch({ rotate: 'right', toggleRotate: false });
				else if (event.target.textContent === 'Rotate left 90°')
					dispatch({ rotate: 'left', toggleRotate: false });
				else dispatch({ rotate: '180', toggleRotate: false });
			} else if (this.state.toggleFlip) {
				if (event.target.textContent === 'Flip Vertical')
					dispatch({ flip: 'vertical', toggleFlip: false });
				else dispatch({ flip: 'horizontal', toggleFlip: false });
			}
		};

		this.handleOutsideClick = (event) => {
			if (!this.rotate.contains(event.target))
				dispatch({ toggleRotate: false });
			if (!this.flip.contains(event.target)) dispatch({ toggleFlip: false });
			if (!this.mirror.contains(event.target))
				dispatch({ toggleMirror: false });
			if (!this.resize.contains(event.target))
				dispatch({ toggleResize: false });
		};

		this.syncState(state);
	}

	inputLinkCheck(eventTarget, state, type) {
		console.log(state.toggleLinkIcon);
		const inputElementType = type == 'width' ? 'height' : 'width';
		let inputElement = type === 'width' ? this.heightInput : this.widthInput;
		inputElement.classList.toggle('border-b-custom-blue', state.toggleLinkIcon);
		inputElement.classList.toggle('bg-custom-black', state.toggleLinkIcon);
		if (state.toggleLinkIcon) {
			inputElement.classList.remove('bg-white/10');
			inputElement.value = eventTarget.value;
			this.validateInput(state, eventTarget, type);
			this.validateInput(state, inputElement, inputElementType);
		} else {
			inputElement.classList.add('bg-white/10');
		}
		return;
	}

	validateInput(state, input, type) {
		const value = input.value.trim();
		const errorElement =
			type === 'width'
				? this.widthInputErrorMessage
				: this.heightInputErrorMessage;
		let isValid = true;
		let errorMessage = '';

		if (value === '') {
			errorMessage = 'This field cannot be empty.';
			isValid = false;
			if (state.toggleLinkIcon) {
				input.classList.add('border-b-red-500');
			}
			input.classList.add('focus:border-b-red-500');
			errorElement.classList.remove('hidden');
			errorElement.textContent = errorMessage;
		} else if (!/^\d+$/.test(value)) {
			errorMessage = 'Please enter a valid positive integer.';
			isValid = false;
			if (state.toggleLinkIcon) {
				input.classList.add('border-b-red-500');
			}
			input.classList.add('focus:border-b-red-500');
			errorElement.classList.remove('hidden');
			errorElement.textContent = errorMessage;
		} else {
			const intValue = parseInt(value, 10);
			if (intValue <= 0 || intValue > 9999) {
				errorMessage = 'Value must be between 1 and 9999.';
				isValid = false;
				if (state.toggleLinkIcon) {
					input.classList.add('border-b-red-500');
				}
				input.classList.add('focus:border-b-red-500');
				errorElement.classList.remove('hidden');
				errorElement.textContent = errorMessage;
			}
		}

		if (isValid) {
			input.classList.remove('border-b-red-500');
			input.classList.remove('focus:border-b-red-500');
			input.classList.add('focus:border-b-custom-blue');
			errorElement.textContent = '';
		}
		this.updateOkButtonState(isValid);
	}

	updateOkButtonState(isValid) {
		if (
			!isValid ||
			this.widthInput.value == '' ||
			this.heightInput.value == ''
		) {
			this.okButton.disabled = true;
			this.okButton.classList.add('bg-gray-500', 'cursor-not-allowed');
			this.okButton.classList.remove(
				'bg-custom-blue',
				'hover:bg-custom-blue/90',
			);
		} else {
			this.okButton.disabled = false;
			this.okButton.classList.remove('bg-gray-500', 'cursor-not-allowed');
			this.okButton.classList.add('bg-custom-blue', 'hover:bg-custom-blue/90');
		}
	}

	ok(dispatch) {
		const width = parseInt(this.widthInput.value, 10);
		const height = parseInt(this.heightInput.value, 10);
		const isPercentage = this.percentageInput.checked;
		console.log(width, height);
		dispatch({
			ok: {
				inputWidth: width,
				inputHeight: height,
				unit: isPercentage ? 'percentage' : 'pixels',
			},
		});
	}
	cancel() {
		this.widthInput.value = '';
		console.log(this.widthInput.value);
		this.heightInput.value = '';
		this.percentageInput.checked = true;
		return;
	}

	syncState(state) {
		this.state = state;
		if (this.reflectCheckboxVertical)
			this.reflectCheckboxVertical.checked = this.state.mirrorVertical;
		if (this.reflectCheckboxHorizontal)
			this.reflectCheckboxHorizontal.checked = this.state.mirrorHorizontal;
		if (this.reflectCheckboxMainDiagonal)
			this.reflectCheckboxMainDiagonal.checked = this.state.mirrorMainDiagonal;
		if (this.reflectCheckboxOffDiagonal)
			this.reflectCheckboxOffDiagonal.checked = this.state.mirrorOffDiagonal;

		/* console.log(
			this.reflectCheckboxVertical.checked,
			this.reflectCheckboxHorizontal.checked,
			this.reflectCheckboxMainDiagonal.checked,
			this.reflectCheckboxOffDiagonal.checked,
		); */

		if (
			this.state.toggleRotate ||
			this.state.toggleFlip ||
			this.state.toggleMirror ||
			this.state.toggleResize
		) {
			document.addEventListener('click', this.handleOutsideClick);
		} else {
			document.removeEventListener('click', this.handleOutsideClick);
		}
		iconBorderClasses.forEach((cls) => {
			this.rotateIcon.classList.toggle(cls, this.state.toggleRotate);
			this.flipIcon.classList.toggle(cls, this.state.toggleFlip);
			this.mirrorIcon.classList.toggle(cls, this.state.toggleMirror);
			this.resizeIcon.classList.toggle(cls, this.state.toggleResize);
			this.gridIcon.classList.toggle(cls, this.state.toggleGrid);
		});

		this.rotateOptions.classList.toggle(
			'tooltipHidden',
			!this.state.toggleRotate,
		);
		this.rotateOptions.classList.toggle(
			'tooltipVisible',
			this.state.toggleRotate,
		);
		this.rotateIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleRotate,
		);

		this.flipOptions.classList.toggle('tooltipVisible', this.state.toggleFlip);
		this.flipOptions.classList.toggle('tooltipHidden', !this.state.toggleFlip);
		this.flipIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleFlip,
		);
		this.mirrorOptions.classList.toggle(
			'tooltipVisible',
			this.state.toggleMirror,
		);
		this.mirrorOptions.classList.toggle(
			'tooltipHidden',
			!this.state.toggleMirror,
		);
		this.resizeOptions.classList.toggle(
			'tooltipHidden',
			!this.state.toggleResize,
		);
		this.resizeOptions.classList.toggle(
			'tooltipVisible',
			this.state.toggleResize,
		);
		this.mirrorIcon.classList.toggle(
			'ring-1',
			(this.state.mirrorVertical ||
				this.state.mirrorHorizontal ||
				this.state.mirrorMainDiagonal ||
				this.state.mirrorOffDiagonal) &&
				!this.state.toggleMirror,
		);
		this.mirrorIcon.classList.toggle(
			'ring-custom-blue',
			(this.state.mirrorVertical ||
				this.state.mirrorHorizontal ||
				this.state.mirrorMainDiagonal ||
				this.state.mirrorOffDiagonal) &&
				!this.state.toggleMirror,
		);
		this.mirrorIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleMirror,
		);
		this.resizeIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleResize,
		);

		this.linkIcon.classList.toggle('bg-custom-blue', this.state.toggleLinkIcon);
		this.linkIcon.classList.toggle(
			'bg-custom-glass-black',
			!this.state.toggleLinkIcon,
		);
		this.linkIcon.classList.toggle(
			'hover:bg-custom-glass-black/80',
			!this.state.toggleLinkIcon,
		);

		this.gridIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleGrid,
		);
		const fillColor = this.state.toggleLinkIcon ? '#202020' : '#e3e3e3';
		this.linkSvg.setAttribute('fill', fillColor);
	}
}

export class ToolSelect {
	constructor(state, { tools, dispatch }) {
		this.state = state;
		this.pencilIcon = elt('img', {
			src: '../assets/stylus_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-sm mt-1 p-2',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ togglePencil: !this.state.togglePencil });
			},
		});
		this.fillIcon = elt('img', {
			className: 'rounded-sm mt-1 p-2',
			src: '../assets/format_color_fill_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleFill: !this.state.toggleFill });
			},
		});
		this.eraseIcon = elt('img', {
			src: '../assets/ink_eraser_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-sm mt-1 p-2',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleErase: !this.state.toggleErase });
			},
		});

		this.colorPickerIcon = elt('img', {
			src: '../assets/colorize_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-sm mt-1 p-2',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleColorPicker: !this.state.toggleColorPicker });
			},
		});

		this.zoomPlusIcon = elt('img', {
			src: '../assets/zoom_in_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-sm mt-1 p-2',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleZoomPlus: !this.state.toggleZoomPlus });
			},
		});

		this.features = elt(
			'div',
			{
				className:
					'flex flex-row flex-wrap gap-x-6 justify-around items-center',
			},
			this.pencilIcon,
			this.fillIcon,
			this.eraseIcon,
			this.colorPickerIcon,
			this.zoomPlusIcon,
		);

		/* this.select = elt(
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
		); */
		this.controlLabel = elt(
			'p',
			{ className: 'text-center text-white/60 text-sm' },
			'Tools',
		);
		this.dom = elt(
			'div',
			{ className: 'flex flex-col justify-between' },
			this.features,
			this.controlLabel,
		);
		this.syncState(state);
	}

	syncState(state) {
		this.state = state;

		iconBorderClasses.forEach((cls) => {
			this.eraseIcon.classList.toggle(cls, this.state.toggleErase);
			this.pencilIcon.classList.toggle(cls, this.state.togglePencil);
			this.fillIcon.classList.toggle(cls, this.state.toggleFill);
			this.colorPickerIcon.classList.toggle(cls, this.state.toggleColorPicker);
			this.zoomPlusIcon.classList.toggle(cls, this.state.toggleZoomPlus);
		});
		this.pencilIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.togglePencil,
		);
		this.eraseIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleErase,
		);
		this.fillIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleFill,
		);
		this.colorPickerIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleColorPicker,
		);
		this.zoomPlusIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleZoomPlus,
		);
		/* this.select.value = state.tool; */
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

/* const ZOOM = [1, 1.5, 3, 6, 12, 24];
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
 */
