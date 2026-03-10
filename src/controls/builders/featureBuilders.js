import { createIconDom } from '../../components/toggleIcon.js';
import { createPopupCard } from '../../components/popupCard.js';
import { createCardOption } from '../../components/cardOptions.js';
import { createFeatureDiv } from '../../components/featureDiv.js';

// ═══════════════════════════════════════
// BUILDER FUNCTIONS (Pure, reusable)
// ═══════════════════════════════════════

/**
 * Build a standard feature: Icon + Popup with click options
 */

export function buildStandardFeature(name, config, handlers) {
	// create icon
	const icon = createIconDom(
		config.icon,
		config.iconStyle,
		handlers[`on${capitalize(name)}Click`],
	);

	//create popup options
	const optionElements = config.options.map((option) => {
		return createCardOption(
			option.label,
			config.cardOptionsStyle,
			handlers[option.action],
		);
	});

	// create popup card
	const popupCard = createPopupCard(optionElements, config.popupStyle);

	// create feature div to hold icon and popup
	const featureDiv = createFeatureDiv(icon, popupCard, config.featureDivStyle);

	return { icon: icon, dom: featureDiv, popup: popupCard, refs: {} };
}

/**
  Build an icon-only feature: Just the icon, no popup. Click handler is on the icon itself.
 *  
 */

export function buildIconOnlyFeature(name, config, handlers) {
	// create icon
	const icon = createIconDom(
		config.icon,
		config.iconStyle,
		handlers[`on${capitalize(name)}Click`],
	);

	return { dom: icon, icon, popup: null, refs: {} }; // Return the icon as the feature DOM, and also include it in the return object for reference in syncState
}

/**
 * Build a custom feature: Uses a custom renderContent function defined in the config to create the popup content. This allows for maximum flexibility in feature design, while still leveraging the standard icon and popup structure.
 */

export function buildCustomFeature(name, config, handlers, customBuilders) {
	// Create icon
	const icon = createIconDom(
		config.icon,
		config.iconStyle,
		handlers[`on${capitalize(name)}Click`],
	);

	// Use the custom renderContent function defined in the config to create the popup content
	const builderFunction = customBuilders[config.renderContent];

	if (!builderFunction) {
		throw new Error(
			`Custom builder "${config.renderContent}" not found for feature "${name}"`,
		);
	}

	// create popup card with custom content
	const result = builderFunction(handlers); // Pass handlers to the builder function so it can attach actions to custom options

	const popupDom = result.dom; // The custom builder should return an object with a 'dom' property containing the popup content

	const refs = result.refs || {}; // The custom builder can also return any references to important elements (like switches) that need to be accessed in syncState

	// combine into a feature
	const featureDiv = createFeatureDiv(icon, popupDom, config.featureDivStyle);

	return { icon: icon, dom: featureDiv, popup: popupDom, refs: refs }; // Return both the feature div and the popup for reference in syncState
}

// ═══════════════════════════════════════
//                UTILITY
// ═══════════════════════════════════════

// capitalize first letter of a string (for display purposes)
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
