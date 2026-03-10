import { TOOL_SELECT_CONFIG } from '../config/toolSelectConfig.js';
import { CUSTOM_BUILDERS } from '../builders/customContentBuilders.js';
import { composeFeatures } from '../builders/viewComposer.js';
import { createControlLabel } from '../../components/controlLabel.js';
import { createFeatures } from '../../components/features.js';
import { elt } from '../../utils.js';

export class ToolSelectView {
	constructor(handlers) {
		// apis' to perform actions on the ui
		this.handlers = handlers;
		// Compose features from config
		const { features, references } = composeFeatures(
			TOOL_SELECT_CONFIG,
			handlers,
			CUSTOM_BUILDERS,
		);
		this.featureElements = features;
		this.references = references;
		this.dom = this.assembleDom();
	}

	highlightIcon(featureName, highlighted) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle('icon-highlight-style', highlighted);
		}
	}

	assembleDom() {
		const featuresArray = Object.values(this.featureElements);
		const featuresContainer = createFeatures(
			featuresArray,
			'features-div-style',
		);
		const controlLabelDom = createControlLabel('Tools', 'control-label-style');

		return elt(
			'div',
			{ className: 'control-div-style' },
			featuresContainer,
			controlLabelDom,
		);
	}
}
