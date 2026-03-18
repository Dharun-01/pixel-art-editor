import { createFeatures } from '../components/features';
import { createFeatureSeparator } from '../components/featureSeparator';
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

		const featureSeparator = createFeatureSeparator(
			'w-[1px] h-7 my-auto bg-white/30 rounded-md',
		);

		const leftFeaturesContainer = createFeatures(
			leftFeatures,
			'header-features-div-style gap-x-6',
		);
		const rightFeaturesContainer = createFeatures(
			rightFeatures,
			'header-features-div-style gap-x-6',
		);

		return elt(
			'div',
			{
				className:
					'fixed flex flex-row justify-start gap-x-2 px-5 top-0 left-0 z-30 h-12 w-screen bg-custom-black',
			},
			leftFeaturesContainer,
			featureSeparator,
			rightFeaturesContainer,
		);
	}

	showPopup(featureName, visible) {
		const popup = this.references[`${featureName}Popup`];
		const icon = this.references[`${featureName}Icon`];

		if (!popup) return;

		if (visible && icon) {
			const rect = icon.getBoundingClientRect();

			// The fancy numbers are to center the popup on the whole app.
			popup.style.left = rect.left / (featureName === 'share' ? 2 : 2.3) + 'px';
			popup.style.top = rect.bottom + (featureName === 'share' ? 8 : 40) + 'px';
		}

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

	// This is feature hover tooltip
	hideTooltipOnPopupActive(reference) {
		reference.classList.add('featureTooltipHidden');
		reference.classList.remove('featureTooltipVisible');
	}

	updateTooltipValue(tooltip, value) {
		tooltip.textContent = Math.round(value);
	}

	// These are tooltip inside dialog
	showTooltip(tooltip) {
		tooltip.style.opacity = '1';
	}

	hideTooltip(tooltip) {
		tooltip.style.opacity = '0';
	}
}
