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
		const icon = this.references[`${featureName}Icon`];
		if (!popup) return;

		// position's it using fixed coords from anchor's screen position
		if (visible && icon) {
			const rect = icon.getBoundingClientRect();
			popup.style.top = rect.bottom + 6 + 'px'; // 4px gap below icon
			popup.style.left = rect.left + rect.width + 'px';
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

	hideTooltipOnPopupActive(reference) {
		reference.classList.add('featureTooltipHidden');
		reference.classList.remove('featureTooltipVisible');
	}

	highlightIcon(featureName, highlighted) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle('icon-highlight-style', highlighted);
		}
	}

	unhighlightAllIcons() {
		Object.keys(this.featureElements).forEach((name) => {
			this.highlightIcon(name, false);
		});
	}
}
