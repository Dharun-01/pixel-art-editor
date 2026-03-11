import { composeFeatures } from '../builders/viewComposer';
import { createFeatures } from '../../components/features';
import { elt } from '../../utils';
import { createControlLabel } from '../../components/controlLabel';
import { SHAPE_SELECT_CONFIG } from '../config/shapeSelectConfig';
import { CUSTOM_BUILDERS } from '../builders/customContentBuilders';

export class ShapeSelectView {
	constructor(handlers) {
		this.handlers = handlers;
		const { features, references } = composeFeatures(
			SHAPE_SELECT_CONFIG,
			handlers,
			CUSTOM_BUILDERS,
		);
		this.featureElements = features;
		this.references = references;
		this.dom = this.assembleDom();
	}

	assembleDom() {
		const featuresArray = Object.values(this.featureElements);
		const featureShapesDom = featuresArray.slice(0, featuresArray.length - 1);

		const featuresShapesWrapped = elt(
			'div',
			{
				className:
					'flex flex-wrap justify-center items-center overflow-y-scroll h-10 custom-scroll-bar max-w-28  gap-x-2 rounded-md py-1 border border-white/20 ',
			},
			...featureShapesDom,
		);
		this.featureShapeBrush = elt(
			'div',
			{ className: '' },
			featuresArray[featuresArray.length - 1],
		);

		const featuresContainer = elt(
			'div',
			{ className: 'features-div-style' },
			featuresShapesWrapped,
			this.featureShapeBrush,
		);

		const controlLabelDom = createControlLabel('Shapes', 'control-label-style');
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

	highlightIcon(featureName, highlighted, classes) {
		const icon = this.references[`${featureName}Icon`];
		if (icon) {
			icon.classList.toggle(classes, highlighted);
		}
	}
}
