import { elt, iconDownloader } from './utils.js';

const BRUSH_DEFAULTS = {
	Brush: 3,
	'Calligraphy brush': 5,
	'Calligraphy pen': 5,
	Airbrush: 10,
	'Oil brush': 30,
	Crayon: 30,
	Marker: 30,
	'Natural pencil': 4,
	'Watercolor brush': 30,
	Pencil: 1, // For when pencil tool is selected
};

export class SideControls {
	constructor(state, dispatch) {
		this.state = state;
		this.isDragging = false;
		this.sizeTooltip = elt(
			'p',
			{
				className:
					'bg-custom-gray text-[12px] shadow shadow-custom-black opacity-0 transition-all duration-150 ease-out absolute text-white p-1 rounded-sm z-100 rotate-90',
				style: 'transform:translate(-50%, 50%); margin-top: -40px;',
			},
			'1px',
		);
		this.opacityTooltip = elt(
			'p',
			{
				className:
					'bg-custom-gray opacity-0 text-[12px] transition-all duration-150 ease-out fixed text-white p-1 rounded-sm rotate-90',
				style: 'transform:translate(-50%, 50%); margin-top: 100px',
			},
			'100%',
		);

		this.sizeIcon = elt(
			'svg',
			{
				...iconDownloader(
					'http://www.w3.org/2000/svg',
					'20px',
					'0 -960 960 960',
					'20px',
					'#e3e3e3',
				),
				class: 'rotate-90',
			},
			elt('path', {
				d: 'M145-192v-48h671v48H145Zm0-120v-72h671v72H145Zm-1-144v-96h671v96H144Zm1-168v-144h671v144H145Z',
			}),
		);

		((this.opacityIcon = elt(
			'svg',
			{
				...iconDownloader(
					'http://www.w3.org/2000/svg',
					'20px',
					'0 -960 960 960',
					'20px',
					'#e3e3e3',
				),
				class: 'rotate-90',
			},
			elt('path', {
				d: 'M480-144q-125 0-212.5-86.5T180-440q0-60 22.5-112.5T264-645l216-219 217 220q38 40 60.5 92T780-440q0 123-87.5 209.5T480-144ZM253-432h454q0-48-13.5-87T646-593L480-761 315-594q-35 35-48.5 74.5T253-432Z',
			}),
		)),
			(this.sizeControlSlider = elt('input', {
				type: 'range',
				min: 1,
				value: this.getBrushSize(this.state),
				max: 248,
				className:
					'zoom-slider w-48 appearance-none bg-white/60 h-[3px] rounded-lg ',
				oninput: (event) => {
					event.stopPropagation();
					this.updateSliderColor(
						event.target.value,
						event.target.min,
						event.target.max,
						this.sizeControlSlider,
					);
					const thumbPosition = this.getThumbPosition(this.sizeControlSlider);
					const value = parseInt(event.target.value, 10);
					console.log(thumbPosition);
					this.updateSliderTooltipPosition(thumbPosition, this.sizeTooltip);
					this.updateSliderValue(event.target.value, this.sizeTooltip);
					dispatch({ brushSize: value });
				},
				onmouseenter: (event) => {
					event.stopPropagation();
					if (this.isDragging) this.showTooltip(this.sizeTooltip);
				},

				onmousedown: (event) => {
					event.stopPropagation();
					this.isDragging = true;
					this.showTooltip(this.sizeTooltip);
				},

				onmouseup: (event) => {
					event.stopPropagation();
					this.isDragging = false;
					this.hideTooltip(this.sizeTooltip);
				},
				onmouseleave: (event) => {
					event.stopPropagation();
					this.isDragging = false;
					this.hideTooltip(this.sizeTooltip);
				},
			})));

		this.opacityControlSlider = elt('input', {
			type: 'range',
			min: 1,
			max: 100,
			value: this.state.opacity || 100,
			className:
				' zoom-slider w-48 appearance-none bg-white/60 rounded-lg h-[3px]',

			oninput: (event) => {
				event.stopPropagation();
				this.updateSliderColor(
					event.target.value,
					event.target.min,
					event.target.max,
					this.opacityControlSlider,
				);
				const thumbPosition = this.getThumbPosition(this.opacityControlSlider);
				const value = parseInt(event.target.value, 10);
				console.log(thumbPosition);
				this.updateSliderTooltipPosition(thumbPosition, this.opacityTooltip);
				this.updateSliderValue(event.target.value, this.opacityTooltip);
				dispatch({ opacity: value });
			},
			onmouseenter: (event) => {
				event.stopPropagation();
				if (this.isDragging) this.showTooltip(this.opacityTooltip);
			},

			onmousedown: (event) => {
				event.stopPropagation();
				this.isDragging = true;
				this.showTooltip(this.opacityTooltip);
			},

			onmouseup: (event) => {
				event.stopPropagation();
				this.isDragging = false;
				this.hideTooltip(this.opacityTooltip);
			},
			onmouseleave: (event) => {
				event.stopPropagation();
				this.isDragging = false;
				this.hideTooltip(this.opacityTooltip);
			},
		});
		this.sizeController = elt(
			'div',
			{
				className:
					'bg-custom-gray relative flex gap-x-3 items-center justify-center  rounded-lg py-1 px-2 h-8',
			},
			this.sizeTooltip,
			this.sizeControlSlider,
			this.sizeIcon,
		);
		this.opacityController = elt(
			'div',
			{
				className:
					'bg-custom-gray relative flex items-center justify-center gap-x-3 h-8 rounded-lg py-1 px-2',
			},
			this.opacityControlSlider,
			this.opacityIcon,
			this.opacityTooltip,
		);
		this.dom = elt(
			'div',
			{
				className:
					'fixed top-60 -left-8 flex flex-col h-24 gap-y-2 justify-center  -rotate-90 items-center',
			},
			this.sizeController,
			this.opacityController,
		);
		this.syncState(state);
		this.updateSliderColor(100, 1, 100, this.opacityControlSlider);
		this.updateSliderColor(
			this.getBrushSize(this.state),
			1,
			248,
			this.sizeControlSlider,
		);
	}

	getThumbPosition(slider) {
		const value = parseInt(slider.value, 10);
		const min = parseInt(slider.min, 10);
		const max = parseInt(slider.max, 10);
		const ratio = (value - min) / (max - min);
		const thumbX = slider.offsetLeft + slider.offsetWidth * ratio;
		const thumbY = slider.offsetTop + slider.offsetHeight / 2;
		return { thumbX, thumbY };
	}
	showTooltip(sliderTooltip) {
		sliderTooltip.classList.add('opacity-100');
		sliderTooltip.classList.remove('opacity-0');
	}
	hideTooltip(sliderTooltip) {
		sliderTooltip.classList.remove('opacity-100');
		sliderTooltip.classList.add('opacity-0');
	}
	updateSliderTooltipPosition(thumbPosition, sliderTooltip) {
		sliderTooltip.style.left = `${thumbPosition.thumbX}px`;
		sliderTooltip.style.top = `${thumbPosition.thumbY}px`;
		console.log(sliderTooltip.style.left);
		console.log(sliderTooltip.style.top);
	}
	updateSliderValue(sliderValue, sliderTooltip) {
		const value = parseInt(sliderValue, 10);
		if (sliderTooltip === this.sizeTooltip)
			sliderTooltip.textContent = `${value}px`;
		else sliderTooltip.textContent = `${value}%`;
	}
	updateSliderColor(value, min, max, slider) {
		const distance = ((value - min) / (max - min)) * 100;

		slider.style.background = `linear-gradient(to right, #4da3ff ${distance}%, #FFFFFF99 ${distance}%)`;
	}

	getBrushSize(state) {
		if (state.brushSize !== undefined) return state.brushSize;

		if (state.togglePencil) return BRUSH_DEFAULTS['Pencil'];

		const brushName = state.selectedBrush || 'Brush';
		return BRUSH_DEFAULTS[brushName] || 3;
	}

	syncState(state) {
		this.state = state;

		const newSize = this.getBrushSize(this.state);
		if (parseInt(this.sizeControlSlider.value, 10) !== newSize) {
			this.sizeControlSlider.value = newSize;
			this.updateSliderColor(newSize, 1, 248, this.sizeControlSlider);
			this.updateSliderValue(newSize, this.sizeTooltip);
		}

		const newOpacity = state.opacity || 100;

		if (parseInt(this.opacityControlSlider.value, 10) !== newOpacity) {
			this.opacityControlSlider.value = newOpacity;
			this.updateSliderColor(newOpacity, 1, 100, this.opacityControlSlider);
		}
	}
}
