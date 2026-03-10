import { createInput } from '../components/inputTag.js';
import { createIconDom } from '../components/toggleIcon.js';
import { elt } from '../utils.js';
import { SideControlsCalculationService } from './services/sidecontrolsServices.js';

export class SideControlsView {
	constructor(handlers) {
		this.handlers = handlers;

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
					'bg-custom-gray opacity-0 text-[12px] transition-all duration-150 ease-out absolute text-white p-1 rounded-sm rotate-90',
				style: 'transform:translate(-50%, 50%); margin-top: 100px',
			},
			'100%',
		);

		this.sizeIcon = createIconDom(
			'../../assets/line_weight_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			'rotate-90',
			null,
		);

		this.opacityIcon = createIconDom(
			'../../assets/opacity_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			'rotate-90',
			null,
		);

		this.sizeControlSlider = createInput(
			'range',
			'zoom-slider w-48 appearance-none bg-white/60 h-[3px] rounded-lg ',
			null,
			null,
			(value) => this.handlers.onSizeControlInput(value),
			null,
			1,
			248,
			this.handlers.getBrushSize(),
			null,
			(value) => this.handlers.onSizeControlMouseDown(),
			(value) => this.handlers.onSizeControlMouseUp(),
			(value) => this.handlers.onSizeControlMouseLeave(),
			(value) => this.handlers.onSizeControlMouseEnter(),
		);
		this.opacityControlSlider = createInput(
			'range',
			'zoom-slider w-48 appearance-none bg-white/60 h-[3px] rounded-lg ',
			null,
			null,
			(value) => this.handlers.onOpacityControlInput(value),
			null,
			1,
			100,
			this.handlers.getBrushOpacity(),
			null,
			(value) => this.handlers.onOpacityControlMouseDown(),
			(value) => this.handlers.onOpacityControlMouseUp(),
			(value) => this.handlers.onOpacityControlMouseLeave(),
			(value) => this.handlers.onOpacityControlMouseEnter(),
		);

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
					'fixed top-60 -left-20 z-100 flex flex-col h-24 gap-y-2 justify-center  -rotate-90 items-center',
			},
			this.sizeController,
			this.opacityController,
		);
	}

	/* 	UPDATE METHODS */

	updateSliderColor(percentage, slider) {
		const gradient =
			SideControlsCalculationService.generateSliderGradient(percentage);
		slider.style.background = gradient;
	}

	updateSliderTooltipPosition(sliderTooltip, x, y) {
		sliderTooltip.style.left = `${x}px`;
		sliderTooltip.style.top = `${y}px`;
	}

	updateSliderValue(sliderValue, sliderTooltip) {
		if (this.sizeTooltip === sliderTooltip)
			sliderTooltip.textContent = `${sliderValue}px`;
		else sliderTooltip.textContent = `${sliderValue}%`;
	}

	showTooltip(sliderTooltip) {
		sliderTooltip.classList.add('opacity-100');
		sliderTooltip.classList.remove('opacity-0');
	}

	hideTooltip(sliderTooltip) {
		sliderTooltip.classList.add('opacity-0');
		sliderTooltip.classList.remove('opacity-100');
	}
}
