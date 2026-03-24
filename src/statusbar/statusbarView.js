import { createParaContent } from '../components/paraTag';
import { createIconDom } from '../components/toggleIcon';
import { createInput } from '../components/inputTag';
import { createCardOption } from '../components/cardOptions';
import { createPopupCard } from '../components/popupCard';
import { elt, getAssetPath } from '../utils.js';
import { StatusbarCalculationService } from './services/statusbarServices.js';
import { createFeatureSeparator } from '../components/featureSeparator.js';
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

export class StatusbarView {
	constructor(handlers) {
		this.handlers = handlers;

		this.pixelSvg = createIconDom(
			getAssetPath(
				'/icons/arrow_selector_tool_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			),
			null,
			null,
		);

		this.pixelText = createParaContent('text-white text-[12px] w-24 h-5', '');

		this.pixelPosition = elt(
			'div',
			{
				className: 'flex flex-row w-40 justify-center gap-x-2 items-center',
			},
			this.pixelSvg,
			this.pixelText,
		);

		this.canvasIcon = createIconDom(
			getAssetPath(
				'/icons/aspect_ratio_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			),
			null,
			null,
		);

		this.canvasSizeText = createParaContent(
			'text-white text-[12px]',
			'1000x400px',
		);

		this.canvasSeparator = createFeatureSeparator(
			'w-[1px] h-5 bg-white/30 rounded-sm my-auto',
		);

		this.canvasSize = elt(
			'div',
			{ className: 'flex flex-row justify-center gap-x-2 items-center w-26' },
			this.canvasSeparator,
			this.canvasIcon,
			this.canvasSizeText,
		);

		this.leftStatus = elt(
			'div',
			{
				className: 'flex flex-row justify-left items-center w-100 h-8',
			},
			this.pixelPosition,
			this.canvasSize,
		);

		this.fitWindowIcon = createIconDom(
			getAssetPath(
				'/icons/fit_screen_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			),
			'hover:bg-custom-glass-black hover:ring hover:ring-white/30 p-1 rounded-sm transition-all duration-150',
			this.handlers.onFitWindow,
		);

		this.fitWindowHoverTooltip = createParaContent(
			'text-gray-300 bg-black rounded-md px-2 py-1 absolute -top-10  -left-7 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden z-50',
			'Fit Window',
		);

		this.fitWindowIcon.addEventListener('mouseenter', () => {
			this.fitWindowHoverTooltip.classList.add('featureTooltipVisible');
			this.fitWindowHoverTooltip.classList.remove('featureTooltipHidden');
		});

		this.fitWindowIcon.addEventListener('mouseleave', () => {
			this.fitWindowHoverTooltip.classList.add('featureTooltipHidden');
			this.fitWindowHoverTooltip.classList.remove('featureTooltipVisible');
		});

		((this.fitWindowSeparator = createFeatureSeparator(
			'w-[1px] h-5 bg-white/30 rounded-sm my-auto',
		)),
			(this.fitWindow = elt(
				'p',
				{
					className: 'p-1 relative flex flex-row gap-x-1',
				},
				this.fitWindowHoverTooltip,
				this.fitWindowIcon,
				this.fitWindowSeparator,
			)));

		this.zoomSelectDownArrowIcon = createIconDom(
			getAssetPath(
				'/icons/keyboard_arrow_down_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
			),
			'px-1 py-0.5 rounded-sm duration-150, hover:bg-custom-glass-black transition-all duration-150',
			this.handlers.onToggleZoomDropDown,
		);

		this.zoomSelectInput = createInput(
			'text',
			' w-16 outline-none text-sm',
			6,
			null,
			(value) => this.handlers.onZoomInputChange(value),
			null,
			null,
			null,
			null,
			(value) => this.handlers.onZoomKeyDown(value),
			null,
			null,
			null,
			null,
			'',
		);

		this.zoomDropDown = this.createZoomDropDown();

		this.zoomSelect = elt(
			'div',
			{
				className:
					'flex relative flex-row justify-center items-center transition-all duration-150 hover:bg-custom-glass-black outline-none border border-x-white/30 border-t-white/30 min-w-28 h-8 rounded-sm',
			},
			this.zoomDropDown,
			this.zoomSelectInput,
			this.zoomSelectDownArrowIcon,
		);

		this.zoomSelectInput.onfocus = () => {
			this.zoomSelect.classList.remove(
				'border-x-white/30',
				'border-t-white/30',
			);
			this.zoomSelect.classList.remove('hover:bg-custom-glass-black');
			this.zoomSelect.classList.add('border-blue-400');
		};

		this.zoomSelectInput.onblur = () => {
			this.zoomSelect.classList.remove('border-blue-400');
			this.zoomSelect.classList.add('hover:bg-custom-glass-black');
			this.zoomSelect.classList.add('border-x-white/30', 'border-t-white/30');
		};

		this.zoomInIcon = createIconDom(
			getAssetPath('/icons/zoom_in_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg'),
			'hover:bg-custom-glass-black hover:ring hover:ring-white/30 p-1 rounded-sm transition-all duration-150',
			this.handlers.onZoomIn,
		);

		this.zoomInHoverTooltip = createParaContent(
			'text-gray-300 bg-black rounded-md px-2 py-1 absolute -top-12  -right-0 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden z-50',
			'Zoom In',
		);

		this.zoomInIcon.addEventListener('mouseenter', () => {
			this.zoomInHoverTooltip.classList.add('featureTooltipVisible');
			this.zoomInHoverTooltip.classList.remove('featureTooltipHidden');
		});

		this.zoomInIcon.addEventListener('mouseleave', () => {
			this.zoomInHoverTooltip.classList.add('featureTooltipHidden');
			this.zoomInHoverTooltip.classList.remove('featureTooltipVisible');
		});

		this.zoomOutIcon = createIconDom(
			getAssetPath(
				'/icons/zoom_out_16dp_4DA3FF_FILL0_wght400_GRAD0_opsz20.svg',
			),
			'hover:bg-custom-glass-black hover:ring hover:ring-white/30 p-1 rounded-sm transition-all duration-150',
			this.handlers.onZoomOut,
		);

		this.zoomOutHoverTooltip = createParaContent(
			'text-gray-300 bg-black rounded-md px-2 py-1 absolute -top-12  -left-7 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden z-50',
			'Zoom Out',
		);

		this.zoomOutIcon.addEventListener('mouseenter', () => {
			this.zoomOutHoverTooltip.classList.add('featureTooltipVisible');
			this.zoomOutHoverTooltip.classList.remove('featureTooltipHidden');
		});

		this.zoomOutIcon.addEventListener('mouseleave', () => {
			this.zoomOutHoverTooltip.classList.add('featureTooltipHidden');
			this.zoomOutHoverTooltip.classList.remove('featureTooltipVisible');
		});

		this.zoomRange = createInput(
			'range',
			'zoom-slider h-[3px] w-48 appearance-none bg-white/10 rounded-lg hover:cursor-ew-resize',
			null,
			'zoomRange',
			(value) => this.handlers.onZoomRangeChange(value),
			null,
			1,
			1000,
			100,
			null,
			() => this.handlers.onZoomRangeMouseDown(),
			() => this.handlers.onZoomRangeMouseUp(),
			() => this.handlers.onZoomRangeMouseLeave(),
			() => this.handlers.onZoomRangeMouseEnter(),
		);

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
			this.zoomOutHoverTooltip,
			this.zoomOutIcon,
			this.sliderTooltip,
			this.zoomRange,
			this.zoomInHoverTooltip,
			this.zoomInIcon,
		);

		this.rightStatus = elt(
			'div',
			{
				className: 'flex flex-row gap-x-6 items-center h-8',
			},
			this.fitWindow,
			this.zoomSelect,
			this.slider,
		);

		this.dom = elt(
			'div',
			{
				className:
					'fixed bottom-0 text-white left-0 flex flex-row justify-between items-center h-10 w-screen bg-custom-gray z-10',
			},
			this.leftStatus,
			this.rightStatus,
		);
	}

	createZoomDropDown() {
		const dropDownOptions = zoomValues.map((zoomValue) => {
			return createCardOption(zoomValue, 'card-options-style', () =>
				this.handlers.onZoomSelect(zoomValue),
			);
		});

		const popupCard = createPopupCard(
			dropDownOptions,
			'custom-scroll-bar flex flex-col absolute rounded-tl-md rounded-tr-md bottom-full z-100 overflow-y-scroll max-h-66 text-[14px] w-28 px-2 py-1 gap-y-1 bg-custom-gray shadow shadow-custom-black transition-all duration-200 ease-out origin-bottom',
		);

		return popupCard;
	}

	/* DOM UPDATE METHODS */

	/**
	 * Update slider background gradient
	 */
	updateSliderColor(percentage) {
		const gradient =
			StatusbarCalculationService.generateSliderGradient(percentage);
		this.zoomRange.style.background = gradient;
	}

	/**
	 * Update slider value
	 */
	updateSliderValue(value) {
		this.zoomRange.value = value;

		// Update color based on new value
		const percentage = StatusbarCalculationService.calculateSliderPercentage(
			value,
			parseFloat(this.zoomRange.min),
			parseFloat(this.zoomRange.max),
		);
		this.updateSliderColor(percentage);
	}

	sliderValuePlus10() {
		this.zoomRange.value = parseInt(this.zoomRange.value, 10) + 10;
		this.zoomSelectInput.value = `${this.zoomRange.value}%`;
		this.updateSliderColor(parseInt(this.zoomRange.value), 10);
		return this.zoomRange.value;
	}

	sliderValueMinus10() {
		this.zoomRange.value = parseInt(this.zoomRange.value, 10) - 10;
		this.zoomSelectInput.value = `${this.zoomRange.value}%`;
		this.updateSliderColor(`${this.zoomRange.value}%`);
		return this.zoomRange.value;
	}

	/**
	 * Update tooltip text and input
	 */
	updateZoomDisplay(value) {
		this.sliderTooltip.textContent = Math.round(value) + '%';
		this.zoomSelectInput.value = Math.round(value) + '%';
	}

	/**
	 * Position tooltip at slider thumb
	 */
	updateTooltipPosition(x, y) {
		this.sliderTooltip.style.left = `${x}px`;
		this.sliderTooltip.style.top = `${y}px`;
	}

	/**
	 * Show tooltip
	 */
	showTooltip() {
		this.sliderTooltip.classList.add('opacity-100');
		this.sliderTooltip.classList.remove('opacity-0');
	}

	/**
	 * Hide tooltip
	 */
	hideTooltip() {
		this.sliderTooltip.classList.remove('opacity-100');
		this.sliderTooltip.classList.add('opacity-0');
	}

	/**
	 * Update tooltip position to slider thumb
	 */
	updateTooltipToThumb() {
		const rect = this.zoomRange.getBoundingClientRect();
		const value = parseFloat(this.zoomRange.value);
		const min = parseFloat(this.zoomRange.min);
		const max = parseFloat(this.zoomRange.max);

		const { x, y } = StatusbarCalculationService.calculateThumbPosition(
			value,
			min,
			max,
			rect,
		);

		this.updateTooltipPosition(x, y);
	}

	/**
		* 
		updates pixel position in DOM 
		*/
	updatePixelPosition(x, y) {
		if (!x || !y) {
			this.pixelText.textContent = ` `;
		} else {
			this.pixelText.textContent = `${x}, ${y}px`;
		}
	}

	updateCanvasSize(size) {
		this.canvasSizeText.textContent = size + 'px';
	}

	updateZoomLevel(level) {
		this.zoomSelectInput.value = `${level}%`;
		this.zoomRange.value = level;
		this.sliderTooltip.textContent = `${level}%`;
	}

	hideTooltipOnPopupActive(reference) {
		reference.classList.add('featureTooltipHidden');
		reference.classList.remove('featureTooltipVisible');
	}

	showDropDown(visible) {
		this.zoomSelectDownArrowIcon.classList.toggle('rotate-180', visible);
		this.zoomDropDown.classList.toggle('scale-y-95', visible);
		this.zoomDropDown.classList.toggle('scale-y-0', !visible);
		this.zoomDropDown.classList.toggle('opacity-0', !visible);
	}
}
