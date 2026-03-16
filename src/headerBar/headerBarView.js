import { createFeatures } from '../components/features';
import { CUSTOM_BUILDERS } from '../controls/builders/customContentBuilders';
import { composeFeatures } from '../controls/builders/viewComposer';
import { elt } from '../utils';
import { HEADER_SELECT_CONFIG } from './config/headerBar.config';
import { headerBarUiUpdateServices } from './services/headerbarServices';

export class HeaderView {
	constructor(handlers) {
		this.handlers = handlers;
		const { features, references } = composeFeatures(
			HEADER_SELECT_CONFIG,
			handlers,
			CUSTOM_BUILDERS,
		);
		this.featureElements = features;
		this.references = references;
		this.dom = this.assembleDom();
	}

	assembleDom() {
		const featuresArray = Object.values(this.featureElements);
		const leftFeatures = featuresArray.slice(0, 3);
		const rightFeatures = featuresArray.slice(3);

		const leftFeaturesContainer = createFeatures(
			leftFeatures,
			'header-features-div-style gap-x-8',
		);
		const rightFeaturesContainer = createFeatures(
			rightFeatures,
			'header-features-div-style gap-x-6',
		);

		return elt(
			'div',
			{
				className:
					'fixed flex flex-row justify-between px-5 top-0 left-0 z-30 h-12 w-screen bg-custom-black',
			},
			leftFeaturesContainer,
			rightFeaturesContainer,
		);
	}

	showPopup(featureName, visible) {
		const popup = this.references[`${featureName}Popup`];
		if (popup) {
			popup.classList.toggle('tooltipVisible', visible);
			popup.classList.toggle('tooltipHidden', !visible);
		}
	}

	hideAllPopups() {
		Object.keys(this.featureElements).forEach((name) => {
			this.showPopup(name, false);
		});
	}

	updateSliderColor(value, qualityRange) {
		const gradient = headerBarUiUpdateServices.getSliderGradient(value);
		qualityRange.style.background = gradient;
	}

	updateSliderValue(value, qualityRange) {
		qualityRange.value = Number(parseInt(value, 10));
		this.updateSliderColor(value, qualityRange);
	}

	updateTooltipPosition(x, y, tooltip) {
		console.log(x, y);

		tooltip.style.left = `${x}px`;
		tooltip.style.top = `${y}px`;
		console.log(tooltip);
	}

	updateTooltipValue(tooltip, value) {
		tooltip.textContent = Math.round(value);
	}

	showTooltip(tooltip) {
		tooltip.style.opacity = '1';
	}

	hideTooltip(tooltip) {
		tooltip.style.opacity = '0';
	}
}
