import {
	elt,
	rgbToHex,
	hexToRgb,
	customName,
	iconDownloader,
	reflectSelect,
} from './utils.js';
import { drawPicture, startLoad } from './tools.js';
import { Picture } from './picture.js';

const iconBorderClasses = ['ring-1', 'ring-custom-blue', 'bg-custom-black'];

const brushOptions = [
	'Brush',
	'Calligraphy brush',
	'Calligraphy pen',
	'Airbrush',
	'Oil brush',
	'Crayon',
	'Marker',
	'Natural pencil',
	'Watercolor brush',
];
const shapeBrushOptions = [
	'Brush',
	'Crayon',
	'Marker',
	'Natural pencil',
	'Watercolor brush',
];
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
	}
}

export class ShapeSelect {
	constructor(state, { dispatch }) {
		this.state = state;

		//shapes
		this.line = elt(
			'p',
			{
				className: 'hover:bg-custom-glass-black',
				onclick: (event) => {
					event.stopPropagation();
					console.log('Hello');
					dispatch({ tool: 'line', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				iconDownloader(
					'http://www.w3.org/2000/svg',
					'20px',
					'0 -960 960 960',
					'20px',
					'#e3e3e3',
				),
				elt('path', {
					d: 'M247-247q-7-7-7-17t7-17l432-432q7-7 17-7t17 7q7 7 7 17t-7 17L281-247q-8 8-18 8t-16-8Z',
				}),
			),
		);
		this.circle = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'circle', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'13px',
						'0 0 24 24',
						'13px',
						'#e3e3e3',
					),
					'enable-background': 'new 0 0 24 24',
				},
				elt('path', {
					d: 'M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10s10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z',
				}),
			),
		);

		this.rectangle = elt(
			'p',
			{
				className: 'hover:bg-custom-glass-black',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'rectangle', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 20 20',
						'15px',
						'#e3e3e3',
					),
					'enable-background': 'new 0 0 20 20',
				},
				elt('path', {
					d: 'M2,4v12h16V4H2z M16.5,14.5h-13v-9h13V14.5z',
				}),
			),
		);

		this.square = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'square', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 20 20',
						'15px',
						'#e3e3e3',
					),
					'enable-background': 'new 0 0 20 20',
				},
				elt('path', {
					d: 'M3,3v14h14V3H3z M15.5,15.5h-11v-11h11V15.5z',
				}),
			),
		);

		this.rhombus = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'rhombus', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 -960 960 960',
						'15px',
						'#e3e3e3',
					),
				},
				elt('path', {
					d: 'M480-120 120-480 480-840 840-480 480-120Z',
					fill: 'none',
					stroke: '#e3e3e3',
					'stroke-width': '60',
				}),
			),
		);

		this.pentagon = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'pentagon', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 20 20',
						'15px',
						'#e3e3e3',
					),
					'enable-background': 'new 0 0 20 20',
				},
				elt('path', {
					d: 'M10,3.82l6.21,4.27l-2.57,7.41H6.37L3.79,8.09L10,3.82 M2,7.5L5.3,17h9.4L18,7.5L10,2L2,7.5z',
				}),
			),
		);

		this.hexagon = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'hexagon', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 20 20',
						'15px',
						'#e3e3e3',
					),
					'enable-background': 'new 0 0 20 20',
				},
				elt('path', {
					d: 'M16.27,10l-3.14,5.5H6.87L3.73,10l3.14-5.5h6.26L16.27,10z M6,3l-4,7l4,7h8l4-7l-4-7H6z',
				}),
			),
		);

		this.star = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'star', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 24 24',
						'15px',
						'#e3e3e3',
					),
				},
				elt('path', {
					d: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
				}),
			),
		);

		this.fourPointStar = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'fourPointStar', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'13px',
						'0 0 24 24',
						'13px',
						'#e3e3e3',
					),
				},
				elt('path', {
					d: 'M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z',
					fill: 'none',
					stroke: '#e3e3e3',
					'stroke-width': '2',
				}),
			),
		);

		this.sixPointStar = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'sixPointStar', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'13px',
						'0 0 24 24',
						'13px',
						'#e3e3e3',
					),
				},
				elt('path', {
					d: 'M12 2 L14.5 7.5 L20.7 8.3 L16 12 L20.7 15.7 L14.5 16.5 L12 22 L9.5 16.5 L3.3 15.7 L8 12 L3.3 8.3 L9.5 7.5 Z',
					fill: 'none',
					stroke: 'currentColor',
					'stroke-width': '2',
					'stroke-linejoin': 'round',
				}),
			),
		);

		this.heart = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'heart', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 24 24',
						'15px',
						'#e3e3e3',
					),
				},
				elt('path', {
					d: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
				}),
			),
		);

		this.triangle = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'triangle', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'15px',
						'0 0 24 24',
						'15px',
						'#e3e3e3',
					),
				},
				elt('path', {
					d: 'M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z',
				}),
			),
		);

		this.rightTriangle = elt(
			'p',
			{
				className: '',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ tool: 'rightTriangle', selectedBrush: undefined });
				},
			},
			elt(
				'svg',
				{
					...iconDownloader(
						'http://www.w3.org/2000/svg',
						'13px',
						'0 0 24 24',
						'13px',
						'#e3e3e3',
					),
					'enable-background': 'new 0 0 24 24',
				},
				elt('path', {
					d: 'M2,22h20V2L2,22z M20,20H6.83L20,6.83V20z',
				}),
			),
		);

		this.shapes = elt(
			'div',
			{
				className:
					'flex flex-row gap-x-3 gap-y-1 items-center justify-center flex-wrap ring-1 ring-white/30 h-15 w-36 p-1 rounded-md overflow-y-scroll custom-scroll-bar',
			},
			this.line,
			this.circle,
			this.triangle,
			this.rightTriangle,
			this.rectangle,
			this.square,
			this.rhombus,
			this.pentagon,
			this.hexagon,
			this.fourPointStar,
			this.star,
			this.sixPointStar,
			this.heart,
		);

		this.shapeBrushesIcon = elt(
			'p',
			{
				className: ' p-1 rounded-sm ',
				onclick: () => {
					dispatch({ toggleShapeBrushes: !this.state.toggleShapeBrushes });
				},
			},
			elt('img', {
				className: '',
				src: '../assets/border_color_16dp_4DA3FF.svg',
			}),
		);

		this.shapeBrushesDropDown = elt(
			'div',
			{
				className:
					'flex flex-col absolute gap-y-1 p-1 w-48 top-7 transition-all duration-150 left-3 overflow-auto h-56 custom-scroll-bar absolute bg-custom-tooltip-gray rounded-md shadow shadow-custom-gray z-100',
			},
			...this.createShapeBrushesDropDown(dispatch),
		);

		this.shapeBrushes = elt(
			'div',
			{ className: 'relative transition-all duration-150' },
			this.shapeBrushesIcon,
			this.shapeBrushesDropDown,
		);

		this.shapeControl = elt(
			'div',
			{
				className: 'flex flex-row justify-around items-center w-full h-20',
			},
			this.shapes,
			this.shapeBrushes,
		);

		this.controlLabel = elt(
			'p',
			{ className: 'text-center text-sm text-white/60' },
			'Shapes',
		);
		this.dom = elt(
			'div',
			{ className: 'flex flex-col items-center justify-around h-25 ' },
			this.shapeControl,
			this.controlLabel,
		);

		this.handleOutsideClick = (event) => {
			if (!this.shapeBrushes.contains(event.target))
				dispatch({ toggleShapeBrushes: false });
		};
		this.syncState(this.state);
	}

	createShapeBrushesDropDown(dispatch) {
		return shapeBrushOptions.map((option) => {
			const optionElement = elt(
				'div',
				{
					className:
						'relative hover:bg-white/10 transition-all duration-150 items-center flex flex-row rounded-md overflow-hidden ',
					onclick: (event) => {
						event.stopPropagation();

						dispatch({
							selectedShapeBrush: option,
						});
					},
				},
				elt('div', {
					className:
						'indicator transition-opacity opacity-0 absolute top-2 left-0 bottom-2 w-[2px] bg-custom-blue rounded-md',
				}),
				elt(
					'p',
					{
						className: 'p-2 hover:text-white transition-all duration-150',
					},
					option,
				),
			);
			optionElement.indicator = optionElement.querySelector('.indicator');
			optionElement.brushName = option;
			return optionElement;
		});
	}

	syncState(state) {
		this.state = state;

		if (this.state.toggleShapeBrushes) {
			document.addEventListener('click', this.handleOutsideClick);
		} else {
			document.addEventListener('click', this.handleOutsideClick);
		}
		this.shapeBrushesIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleShapeBrushes,
		);
		iconBorderClasses.forEach((cls) => {
			this.shapeBrushesIcon.classList.toggle(
				cls,
				this.state.toggleShapeBrushes,
			);
		});
		this.shapeBrushesDropDown.classList.toggle(
			'tooltipVisible',
			this.state.toggleShapeBrushes,
		);
		this.shapeBrushesDropDown.classList.toggle(
			'tooltipHidden',
			!this.state.toggleShapeBrushes,
		);

		this.shapeBrushes.classList.toggle(
			'disabled-ui',
			!!this.state.selectedBrush,
		);
		Array.from(this.shapeBrushesDropDown.children).forEach((optionElement) => {
			const isSelected =
				optionElement.brushName === this.state.selectedShapeBrush;
			if (optionElement.indicator) {
				optionElement.indicator.style.opacity = isSelected ? '1' : '0';
				optionElement.classList.toggle('bg-custom-glass-black', isSelected);
			}
		});
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

	createShapeBrushesDropDown(dispatch) {
		return shapeBrushOptions.map((option) => {
			return elt(
				'p',
				{
					className: '',
					onclick: (event) => {
						event.stopPropagation();
						dispatch({ selectedShapeBrush: option });
					},
				},
				option,
			);
		});
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

export class BrushSelect {
	constructor(state, { tools, dispatch }) {
		this.state = state;
		this.brushIcon = elt('img', {
			src: '../assets/brush_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'rounded-t-sm p-2',
		});

		this.arrowDownIcon = elt(
			'svg',
			{
				...iconDownloader(
					'http://www.w3.org/2000/svg',
					'25px',
					'0 -960 960 960',
					'25px',
					'#e3e3e3',
				),
				class: 'h-5 w-[34px] transition-all duration-150 rounded-b-sm',
			},
			elt('path', { d: 'M480-384 288-576h384L480-384Z' }),
		);

		this.arrowDown = elt(
			'p',
			{ className: 'rounded-b-sm border-t border-t-custom-gray' },
			this.arrowDownIcon,
		);
		this.brushOptions = elt(
			'div',
			{
				className:
					'flex flex-col gap-y-1 p-1 w-48 top-15 left-5 overflow-auto h-80 custom-scroll-bar absolute bg-custom-tooltip-gray rounded-md shadow shadow-custom-gray z-100',
			},
			...this.createBrushOptions(dispatch),
		);
		this.brushControl = elt(
			'div',
			{
				className:
					'relative rounded-sm flex flex-col justify-center items-center h-14',
				onclick: (event) => {
					event.stopPropagation();
					dispatch({ toggleBrush: !this.state.toggleBrush });
				},
			},
			this.brushIcon,
			this.arrowDown,
			this.brushOptions,
		);
		this.controlLabel = elt(
			'p',
			{ className: 'text-sm text-white/60' },
			'Brushes',
		);

		this.dom = elt(
			'div',
			{
				className:
					'relative flex flex-col h-25 justify-around items-center mt-3',
			},
			this.brushControl,
			this.controlLabel,
		);

		this.handleOutsideClick = (event) => {
			if (!this.brushControl.contains(event.target))
				dispatch({ toggleBrush: false });
		};
		this.syncState(state);
	}

	createBrushOptions(dispatch) {
		return brushOptions.map((option) => {
			const optionElement = elt(
				'div',
				{
					className:
						'relative hover:bg-white/10 transition-all duration-150 items-center flex flex-row rounded-md overflow-hidden ',
					onclick: (event) => {
						event.stopPropagation();

						dispatch({
							selectedBrush: option,
						});
					},
				},
				elt('div', {
					className:
						'indicator transition-opacity opacity-0 absolute top-2 left-0 bottom-2 w-[2px] bg-custom-blue rounded-md',
				}),
				elt(
					'p',
					{
						className: 'p-2 hover:text-white transition-all duration-150',
					},
					option,
				),
			);
			optionElement.indicator = optionElement.querySelector('.indicator');
			optionElement.brushName = option;
			return optionElement;
		});
	}

	syncState(state) {
		this.state = state;
		if (this.state.toggleBrush) {
			document.addEventListener('click', this.handleOutsideClick);
		} else {
			document.removeEventListener('click', this.handleOutsideClick);
		}
		this.brushIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleBrush,
		);
		this.brushOptions.classList.toggle(
			'tooltipVisible',
			this.state.toggleBrush,
		);
		this.brushOptions.classList.toggle(
			'tooltipHidden',
			!this.state.toggleBrush,
		);
		iconBorderClasses.forEach((cls) => {
			this.brushControl.classList.toggle(
				cls,
				this.state.toggleBrush || this.state.selectedBrush !== undefined,
			);
		});
		this.brushControl.classList.toggle('bg-white/10', !this.state.toggleBrush);
		this.arrowDown.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleBrush,
		);
		this.arrowDownIcon.classList.toggle('rotate-180', this.state.toggleBrush);

		Array.from(this.brushOptions.children).forEach((optionElement) => {
			const isSelected = optionElement.brushName === this.state.selectedBrush;
			if (optionElement.indicator) {
				optionElement.indicator.style.opacity = isSelected ? '1' : '0';
				optionElement.classList.toggle('bg-custom-glass-black', isSelected);
			}
		});
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
