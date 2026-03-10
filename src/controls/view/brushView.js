import { elt } from '../../utils';
import { composeFeatures } from '../builders/viewComposer';
import { createFeatures } from '../../components/features';
import { createControlLabel } from '../../components/controlLabel';
import { BRUSH_SELECT_CONFIG } from '../config/brushSelectConfig';
import { CUSTOM_BUILDERS } from '../builders/customContentBuilders';

export class BrushSelectView {
	constructor(handlers) {
		// apis' to perform actions on the ui
		this.handlers = handlers;
		// Compose features from config
		const { features, references } = composeFeatures(
			BRUSH_SELECT_CONFIG,
			handlers,
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
		const controlLabelDom = createControlLabel('Brush', 'control-label-style');
		return elt(
			'div',
			{ className: 'control-div-style' },
			featuresContainer,
			controlLabelDom,
		);
	}

	showPopup(featureName, visible) {
		const popup = this.references[`${featureName}Popup`];
		if (popup) {
			popup.classList.toggle('tooltipVisible', visible);
			popup.classList.toggle('tooltipHidden', !visible);
		}
	}

	highlightIcon(featureName, highlighted) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle('icon-highlight-style', highlighted);
		}
	}
}
