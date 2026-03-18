import { composeFeatures } from '../builders/viewComposer';
import { COLOR_SELECT_CONFIG } from '../config/colorSelectConfig';
import { CUSTOM_BUILDERS } from '../builders/customContentBuilders';
import { elt } from '../../utils';
import { createControlLabel } from '../../components/controlLabel';

export class ColorSelectView {
	constructor(handlers) {
		this.handlers = handlers;

		const { features, references } = composeFeatures(
			COLOR_SELECT_CONFIG,
			handlers,
			CUSTOM_BUILDERS,
		);

		this.featureElements = features;
		this.references = references;

		this.dom = this.assembleDom();
	}

	assembleDom() {
		const featuresArray = Object.values(this.featureElements);
		const featuresArrayLength = featuresArray.length;

		// These are the primary and secondary color DOM
		const activeColorSlots = featuresArray.slice(0, 2);
		this.primaryAndSecondaryColor = elt(
			'div',
			{ className: 'flex flex-col gap-3 z-50' },
			...activeColorSlots,
		);

		// These are the color palette DOM user has created
		const colorSlots = featuresArray.slice(2, featuresArrayLength - 1);

		this.colorSlots = elt(
			'div',
			{
				className: 'flex flex-row flex-wrap gap-2',
			},
			...colorSlots,
		);

		// This is the custom color selection DOM
		this.customColorSelection = elt(
			'div',
			{ className: 'flex flex-row min-w-14' },
			featuresArray[featuresArrayLength - 1],
		);

		// The whole Color DOM wrapper
		this.colorDom = elt(
			'div',
			{ className: 'flex flex-row gap-x-3 p-2 z-20' },
			this.primaryAndSecondaryColor,
			this.colorSlots,
			this.customColorSelection,
		);

		// Event Handler for all the color slots including primary and secondary
		this.colorDom.addEventListener('click', (event) => {
			const slot = event.target.closest('[data-slot]');
			if (slot) this.handlers.onSlotSelect(slot.dataset.slot);
		});

		// control label
		const controlLabelDom = createControlLabel('Colors', 'control-label-style');

		return elt(
			'div',
			{ className: 'control-div-style py-2' },
			this.colorDom,
			controlLabelDom,
		);
	}

	drawSaturationBox(hue, canvas) {
		const ctx = canvas.getContext('2d');
		const w = canvas.width;
		const h = canvas.height;

		// 1. Horizontal gradient: white → pure hue color
		const hueGrad = ctx.createLinearGradient(0, 0, w, 0);
		hueGrad.addColorStop(0, 'white');
		hueGrad.addColorStop(1, `hsl(${hue}, 	100%, 50%)`);
		ctx.fillStyle = hueGrad;
		ctx.fillRect(0, 0, w, h);

		// 2. Vertical gradient: transparent → black (drawn ON TOP)
		const darkGrad = ctx.createLinearGradient(0, 0, 0, h);
		darkGrad.addColorStop(0, 'transparent');
		darkGrad.addColorStop(1, 'black');
		ctx.fillStyle = darkGrad;
		ctx.fillRect(0, 0, w, h);
	}

	drawHueSlider(canvas) {
		const ctx = canvas.getContext('2d');
		const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
		for (let i = 0; i <= 360; i += 10) {
			grad.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
		}
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	updatePreview(preview, hex) {
		preview.style.background = hex;
	}

	updateSbThumb(sbThumb, saturation, brightness) {
		const canvasW = 200;
		const canvasH = 130;
		const thumbSize = 6; // half of w-3 (12px)

		const x = Math.max(
			0,
			Math.min(canvasW - thumbSize, (saturation / 100) * canvasW - thumbSize),
		);
		const y = Math.max(
			0,
			Math.min(
				canvasH - thumbSize,
				(1 - brightness / 100) * canvasH - thumbSize,
			),
		);

		sbThumb.style.left = x + 'px';
		sbThumb.style.top = y + 'px';
	}

	updateHexInput(hexInput, hex) {
		hexInput.value = hex;
	}

	updateHueThumb(hueThumb, hue) {
		const x = hue / 360; // convert to ratio of 0 - 1
		const canvasW = 200;
		const thumbW = 5;
		hueThumb.style.left =
			Math.max(0, Math.min(canvasW - thumbW, x * canvasW - thumbW)) + 'px';
	}

	showPopup(isActive) {
		const popup = this.references['customColorSelectorPopup'];
		const icon = this.references[`customColorSelectorIcon`];

		if (!popup) return;

		if (icon) {
			const rect = icon.getBoundingClientRect();
			popup.style.left = rect.left / 2.5 + 'px';
			popup.style.top = rect.bottom + 'px';
		}

		popup.classList.toggle('tooltipHidden', !isActive);

		popup.classList.toggle('tooltipVisible', isActive);
	}

	highlightIcon(featureName, highlighted) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle('icon-highlight-style', highlighted);
		}
	}
}
