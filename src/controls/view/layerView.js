import { CUSTOM_BUILDERS } from '../builders/customContentBuilders';
import { composeFeatures } from '../builders/viewComposer';
import { LAYER_SELECT_CONFIG } from '../config/layerSelectConfig';
import { createFeatures } from '../../components/features';
import { createControlLabel } from '../../components/controlLabel';
import { elt } from '../../utils';
import { createParaContent } from '../../components/paraTag';

export class LayerSelectView {
	constructor(handlers) {
		this.handlers = handlers;
		const { features, references } = composeFeatures(
			LAYER_SELECT_CONFIG,
			handlers,
			CUSTOM_BUILDERS,
		);
		this.featureElements = features;
		this.references = references;
		this.dom = this.assembleDom();
	}

	assembleDom() {
		const featuresArray = Object.values(this.featureElements);
		const featureStatusFlag = createParaContent(
			'feature-status-tag-style min-w-24 max-h-7  bg-gray-500/30 text-gray-200 border-white/30 text-center text-nowrap pointer-events-none',
			'Coming soon',
		);

		const featuresContainer = createFeatures(
			featuresArray,
			'features-div-style',
		);
		const controlLabelDom = createControlLabel('Layers', 'control-label-style');

		// Change when you are going to implement like in other controllers
		return elt(
			'div',
			{
				className: 'min-w-48 flex flex-row justify-evenly items-center',
			},
			elt(
				'div',
				{
					className:
						'control-div-style items-start outline-none pointer-events-none disabled-ui',
				},
				featuresContainer,
				controlLabelDom,
			),
			featureStatusFlag,
		);
	}

	highlightIcon(featureName, highlighted) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle('icon-highlight-style', highlighted);
		}
	}
}
