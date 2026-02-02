import { elt, iconDownloader } from './utils.js';
const zoomValues = [
	'1000%',
	'900%',
	'800%',
	'700%',
	'600%',
	'500%',
	'400%',
	'300%',
	'200%',
	'100%',
	'75%',
	'50%',
	'25%',
	'12.5%',
];
export class StatusBar {
	constructor(state, dispatch) {
		this.state = state;
		this.isDragging = false;
		this.pixelText = elt(
			'p',
			{ className: 'text-white text-[12px] w-24 h-5' },
			'',
		);
		this.pixelSvg = elt(
			'svg',
			iconDownloader(
				'http://www.w3.org/2000/svg',
				'20px',
				'0 -960 960 960',
				'20px',
				'#e3e3e3',
			),
			elt('path', {
				d: 'm312-397 85-107h169L312-712v315ZM537-96 399-391 240-192v-672l528 432H486l138 295-87 41ZM397-504Z',
			}),
		);
		this.pixelPosition = elt(
			'div',
			{
				className: 'flex flex-row w-40 justify-center gap-x-2 items-center',
			},
			this.pixelSvg,
			this.pixelText,
		);
		this.canvasSvg = elt(
			'svg',
			iconDownloader(
				'http://www.w3.org/2000/svg',
				'20px',
				'0 -960 960 960',
				'20px',
				'#e3e3e3',
			),
			elt('path', {
				d: 'M552-312h192v-192h-72v120H552v72ZM216-456h72v-120h120v-72H216v192Zm-48 264q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-432H168v432Zm0 0v-432 432Z',
			}),
		);
		this.canvasSizeText = elt('p', { className: 'text-white text-[12px]' }, '');
		this.canvasSize = elt(
			'div',
			{ className: 'flex flex-row justify-center gap-x-2 items-center w-26' },
			this.canvasSvg,
			this.canvasSizeText,
		);
		this.leftStatus = elt(
			'div',
			{
				className: 'flex flex-row justify-left items-center w-100 h-5',
			},
			this.pixelPosition,
			this.canvasSize,
		);

		this.fitWindowIcon = elt(
			'svg',
			iconDownloader(
				'http://www.w3.org/2000/svg',
				'20px',
				'0 -960 960 960',
				'20px',
				'#e3e3e3',
			),
			elt('path', {
				d: 'M792-576v-120H672v-72h120q30 0 51 21.15T864-696v120h-72Zm-696 0v-120q0-30 21.15-51T168-768h120v72H168v120H96Zm576 384v-72h120v-120h72v120q0 30-21.15 51T792-192H672Zm-504 0q-30 0-51-21.15T96-264v-120h72v120h120v72H168Zm72-144v-288h480v288H240Zm72-72h336v-144H312v144Zm0 0v-144 144Z',
			}),
		);
		this.fitWindow = elt(
			'p',
			{
				className: 'p-1 rounded-sm hover:bg-custom-glass-black',
				onclick: () => {
					const expectedZoom = Math.min(
						(window.innerWidth - 60) / this.state.picture.width,
						(window.innerHeight - 160) / this.state.picture.height,
					);
					console.log(window.innerWidth - 40 / this.state.picture.width);
					console.log(this.state.picture.width);
					console.log(expectedZoom);
					this.zoomSelectInput.value = `${expectedZoom * 100}%`;
					dispatch({ zoom: expectedZoom });
				},
			},
			this.fitWindowIcon,
		);

		this.zoomSelectDownArrowIcon = elt('img', {
			className: 'px-1 py-0.5 rounded-sm duration-150',
			src: '../assets/keyboard_arrow_down_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({
					toggleZoomSelectDownArrow: !this.state.toggleZoomSelectDownArrow,
				});
			},
		});

		this.zoomSelectInput = elt('input', {
			type: 'text',
			value: '100%',
			maxLength: 6,
			className: ' w-16 outline-none text-sm',
			onclick: (event) => {
				event.stopPropagation();
				dispatch({ toggleZoomSelect: true });
			},

			oninput: (event) => {
				event.stopPropagation();

				this.updateSliderValue(
					event.target.value,
					this.validateSliderInput(event.target.value),
				);
			},
			onkeydown: (event) => {
				if (event.key === 'Enter') {
					dispatch({
						zoom: (1 * this.zoomRange.value) / 100,
					});
				}
			},
			onchange: () => {
				dispatch({
					zoom: (1 * this.zoomRange.value) / 100,
				});
			},
		});

		this.zoomDropDown = elt(
			'div',
			{
				className:
					'custom-scroll-bar flex flex-col absolute rounded-tl-md rounded-tr-md bottom-full z-100 overflow-y-scroll max-h-66 text-[14px] w-28 px-2 py-1 gap-y-1 bg-custom-gray shadow shadow-custom-black transition-all duration-200 ease-out origin-bottom',
			},
			...this.createZoomDropDown(),
		);
		this.zoomSelect = elt(
			'div',
			{
				className:
					'flex relative flex-row justify-center items-center duration-150 outline-none border border-x-white/30 border-t-white/30 min-w-28 h-8 rounded-sm',
			},
			this.zoomDropDown,
			this.zoomSelectInput,
			this.zoomSelectDownArrowIcon,
		);

		this.zoomInIcon = elt('img', {
			src: '../assets/zoom_in_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'hover:bg-custom-glass-black rounded-sm p-1',
			onclick: () => {
				this.zoomRange.value = parseInt(this.zoomRange.value, 10) + 10;
				this.zoomSelectInput.value = `${this.zoomRange.value}%`;
				console.log(this.zoomRange.value);
				this.updateSliderColor();
				dispatch({ zoom: (1 * this.zoomRange.value) / 100 });
			},
		});
		this.zoomOutIcon = elt('img', {
			src: '../assets/zoom_out_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			className: 'hover:bg-custom-glass-black rounded-sm p-1',
			onclick: () => {
				this.zoomRange.value = parseInt(this.zoomRange.value, 10) - 10;
				this.zoomSelectInput.value = `${this.zoomRange.value}%`;
				this.updateSliderColor();
				dispatch({ zoom: (1 * this.zoomRange.value) / 100 });
			},
		});

		this.zoomRange = elt('input', {
			type: 'range',
			min: 1,
			max: 1000,
			value: 100,
			className:
				'zoom-slider h-[3px] w-48 appearance-none bg-white/10 rounded-lg',
			id: 'zoomRange',
			oninput: (event) => {
				event.stopPropagation();
				this.updateSliderColor();
				this.isDragging = true;
				if (this.isDragging) {
					let { clientX, clientY } = this.getThumbsPosition();
					this.updateSliderTooltipPosition(clientX, clientY);
				}
				this.updateSliderTooltip(event.target.value);
				dispatch({
					zoom: (1 * this.zoomRange.value) / 100,
				});
			},
			onmousedown: () => {
				this.isDragging = true;
				this.showSliderTooltip();
			},
			onmouseup: () => {
				this.isDragging = false;
				this.hideSliderTooltip();
			},
			onmouseleave: (event) => {
				event.stopPropagation();
				console.log('cursor leaved!');
				this.isDragging = false;
				this.hideSliderTooltip();
			},
			onmouseenter: (event) => {
				event.stopPropagation();
				if (this.isDragging) {
					this.showSliderTooltip();
				}
			},
		});
		this.sliderTooltip = elt(
			'p',
			{
				className:
					'bg-custom-gray transition-all duration-150 opacity-0 shadow shadow-custom-black p-2 rounded-sm fixed  text-[12px]',
				style: 'transform:translate(-50%, -100%); margin-top: -25px;',
			},
			'100%',
		);
		this.slider = elt(
			'div',
			{
				className:
					'relative flex flex-row justify-around items-center w-72 h-5',
			},
			this.zoomOutIcon,
			this.sliderTooltip,
			this.zoomRange,
			this.zoomInIcon,
		);

		this.rightStatus = elt(
			'div',
			{
				className: 'flex flex-row gap-x-6 items-center h-5',
			},
			this.fitWindow,
			this.zoomSelect,
			this.slider,
		);
		this.dom = elt(
			'div',
			{
				className:
					'fixed bottom-0 text-white left-0 flex flex-row justify-between items-center h-10 w-screen bg-custom-gray z-50',
			},
			this.leftStatus,
			this.rightStatus,
		);

		this.handleOutsideClick = (event) => {
			if (!this.zoomSelect.contains(event.target))
				dispatch({ toggleZoomSelect: false });
			if (!this.zoomDropDown.contains(event.target))
				dispatch({ toggleZoomSelectDownArrow: false });
			return;
		};

		this.handleInsideClick = (event) => {
			this.zoomSelectInput.value = event.target.textContent;
			this.updateSliderValue(
				this.zoomSelectInput.value,
				this.validateSliderInput(this.zoomSelectInput.value),
			);
			dispatch({ toggleZoomSelectDownArrow: false });
			dispatch({ zoom: (1 * this.zoomRange.value) / 100 });
			return;
		};

		this.syncState(state);
		this.updateSliderColor();
	}
	createZoomDropDown() {
		return zoomValues.map((level) => {
			return elt(
				'p',
				{
					className: 'p-1 rounded-sm hover:bg-custom-glass-black',
					onclick: (event) => {
						this.handleInsideClick(event);
					},
				},
				level,
			);
		});
	}
	validateSliderInput(value) {
		if (/^\d+\.?\d*%$/.test(value)) {
			return true;
		}
		return false;
	}

	updateSliderColor() {
		const zoomValue =
			((this.zoomRange.value - this.zoomRange.min) /
				(this.zoomRange.max - this.zoomRange.min)) *
			100;
		this.zoomRange.style.background = `linear-gradient(to right, #4DA3FF ${zoomValue}%, #FFFFFF99 ${zoomValue}%)`;
	}

	updateSliderTooltip(value) {
		this.sliderTooltip.textContent = `${value}%`;
		this.zoomSelectInput.value = `${value}%`;
	}
	updateSliderValue(value, validInput) {
		if (validInput) {
			const extractedDigit = parseInt(value.match(/\d+\.?\d*/)[0], 10);
			this.zoomRange.value = extractedDigit;
			this.updateSliderColor();
		}
	}
	getThumbsPosition() {
		const rect = this.zoomRange.getBoundingClientRect();
		const value = parseFloat(this.zoomRange.value);
		const min = parseFloat(this.zoomRange.min);
		const max = parseFloat(this.zoomRange.max);

		const ratio = (value - min) / (max - min);
		const thumbX = rect.left + ratio * rect.width;
		const thumbY = rect.top + rect.height / 2;
		return { clientX: thumbX, clientY: thumbY };
	}

	updateSliderTooltipPosition(clientX, clientY) {
		this.sliderTooltip.style.left = `${clientX}px`;
		this.sliderTooltip.style.top = `${clientY}px`;
	}
	showSliderTooltip() {
		this.sliderTooltip.classList.add('opacity-100');
		this.sliderTooltip.classList.remove('opacity-0');
	}
	hideSliderTooltip() {
		this.sliderTooltip.classList.remove('opacity-100');
		this.sliderTooltip.classList.add('opacity-0');
	}
	syncState(state) {
		this.state = state;
		this.sliderTooltip.textContent = `${this.zoomRange.value}%`;
		if (this.state.toggleZoomSelect || this.state.toggleZoomSelectDownArrow) {
			document.addEventListener('click', this.handleOutsideClick);
		} else {
			document.removeEventListener('click', this.handleOutsideClick);
		}

		this.zoomDropDown.classList.toggle(
			'opacity-0',
			!this.state.toggleZoomSelectDownArrow,
		);
		this.zoomDropDown.classList.toggle(
			'scale-y-95',
			this.state.toggleZoomSelectDownArrow,
		);
		this.zoomDropDown.classList.toggle(
			'scale-y-0',
			!this.state.toggleZoomSelectDownArrow,
		);

		this.zoomSelect.classList.toggle(
			'bg-white/10',
			!this.state.toggleZoomSelect,
		);
		this.zoomSelect.classList.toggle(
			'border-white/30',
			!this.state.toggleZoomSelect,
		);
		this.zoomSelect.classList.toggle(
			'hover:bg-white/15',
			!this.state.toggleZoomSelect,
		);
		this.zoomSelect.classList.toggle(
			'bg-custom-black',
			this.state.toggleZoomSelect,
		);
		this.zoomSelect.classList.toggle(
			'border-b-custom-blue',
			this.state.toggleZoomSelect,
		);

		this.zoomSelectDownArrowIcon.classList.toggle(
			'rotate-180',
			this.state.toggleZoomSelectDownArrow,
		);
		this.zoomSelectDownArrowIcon.classList.toggle(
			'hover:bg-custom-glass-black',
			!this.state.toggleZoomSelectDownArrow,
		);

		this.canvasSizeText.textContent = `${state.picture.width} x ${state.picture.height}px`;
		if (!state.cursor) {
			this.pixelText.textContent = ``;
		} else {
			this.pixelText.textContent = `${state.cursor.x}, ${state.cursor.y}px`;
		}
	}
}
