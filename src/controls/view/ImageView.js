// controls/ImageView.js
import { IMAGE_SELECT_CONFIG } from '../config/imageSelectConfig.js';
import { CUSTOM_BUILDERS } from '../builders/customContentBuilders.js';
import { composeFeatures } from '../builders/viewComposer.js';
import { createControlLabel } from '../../components/controlLabel.js';
import { createFeatures } from '../../components/features.js';
import { elt } from '../../utils.js';

export class ImageSelectView {
	constructor(handlers) {
		// apis' to perform actions on the ui
		this.handlers = handlers;

		// Compose features from config
		const { features, references } = composeFeatures(
			IMAGE_SELECT_CONFIG,
			this.handlers,
			CUSTOM_BUILDERS,
		);

		this.featureElements = features;
		this.references = references;

		this.dom = this.assembleDom();
	}

	assembleDom() {
		const featuresArray = Object.values(this.featureElements);
		const featuresContainer = createFeatures(
			featuresArray,
			'features-div-style',
		);
		const controlLabelDom = createControlLabel('Image', 'control-label-style');

		return elt(
			'div',
			{ className: 'control-div-style' },
			featuresContainer,
			controlLabelDom,
		);
	}

	// ═══════════════════════════════════════
	//      --- VIEW UPDATE METHODS ---
	// ═══════════════════════════════════════

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

	highlightIcon(featureName, highlighted) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle('icon-highlight-style', highlighted);
		}
	}

	showTooltip(featureName) {
		const tooltip = this.references[`${featureName}Tooltip`];
		if (tooltip) {
			tooltip.classList.add('opacity-100');
		}
	}

	hideTooltip() {}
	unhighlightAllIcons() {
		Object.keys(this.featureElements).forEach((name) => {
			this.highlightIcon(name, false);
		});
	}
}
