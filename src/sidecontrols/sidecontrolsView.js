import { createInput } from '../components/inputTag.js';
import { createParaContent } from '../components/paraTag.js';
import { createIconDom } from '../components/toggleIcon.js';
import { elt, getAssetPath } from '../utils.js';
import { SideControlsCalculationService } from './services/sidecontrolsServices.js';

export class SideControlsView {
	constructor(handlers) {
		this.handlers = handlers;

		this.sizeTooltip = elt(
			'p',
			{
				className:
					'bg-custom-gray text-[12px] opacity-0 transition-all duration-150 ease-out absolute text-white min-w-10 min-h-6 flex justify-center items-center rounded-sm z-100 rotate-90',
			},
			'1px',
		);

		this.opacityTooltip = elt(
			'p',
			{
				className:
					'bg-custom-gray opacity-0 text-[12px] transition-all duration-150 ease-out absolute text-white min-w-8 min-h-6 flex justify-center items-center rounded-sm rotate-90',
			},
			'100%',
		);

		this.sizeIcon = createIconDom(
			getAssetPath(
				'/icons/line_weight_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			),
			'rotate-90',
			null,
		);
		this.sizeHoverTooltip = createParaContent(
			'text-gray-300 bg-black rounded-md px-2 py-1 absolute top-2 -right-9 rotate-90 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden z-50',
			'Size',
		);

		this.sizeIcon.addEventListener('mouseenter', (event) => {
			this.sizeHoverTooltip.classList.add('featureTooltipVisible');
			this.sizeHoverTooltip.classList.remove('featureTooltipHidden');
		});

		this.sizeIcon.addEventListener('mouseleave', (event) => {
			this.sizeHoverTooltip.classList.add('featureTooltipHidden');
			this.sizeHoverTooltip.classList.remove('featureTooltipVisible');
		});

		this.opacityIcon = createIconDom(
			getAssetPath('/icons/opacity_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg'),
			'rotate-90',
			null,
		);

		this.opacityHoverTooltip = createParaContent(
			'text-gray-300 bg-black rounded-md px-2 py-1 absolute top-5 -right-12 rotate-90 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden z-50',
			'Opacity',
		);

		this.opacityIcon.addEventListener('mouseenter', (event) => {
			this.opacityHoverTooltip.classList.add('featureTooltipVisible');
			this.opacityHoverTooltip.classList.remove('featureTooltipHidden');
		});

		this.opacityIcon.addEventListener('mouseleave', (event) => {
			this.opacityHoverTooltip.classList.add('featureTooltipHidden');
			this.opacityHoverTooltip.classList.remove('featureTooltipVisible');
		});

		this.sizeControlSlider = createInput(
			'range',
			'zoom-slider size-control-slider-style ',
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
			'opacity-control-slider-style zoom-slider ',
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
			this.sizeHoverTooltip,
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
			this.opacityHoverTooltip,
			this.opacityControlSlider,
			this.opacityIcon,
			this.opacityTooltip,
		);

		this.dom = elt(
			'div',
			{
				className: 'side-control-dom-style',
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
