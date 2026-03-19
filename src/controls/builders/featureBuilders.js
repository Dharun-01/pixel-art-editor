import { createIconDom } from '../../components/toggleIcon.js';
import { createParaContent } from '../../components/paraTag.js';
import { createPopupCard } from '../../components/popupCard.js';
import { createCardOption } from '../../components/cardOptions.js';
import { createFeatureDiv } from '../../components/featureDiv.js';
import { elt } from '../../utils.js';

// ═══════════════════════════════════════
// BUILDER FUNCTIONS (Pure, reusable)
// ═══════════════════════════════════════

/**
 * Build a standard feature: Icon + Popup with click options
 */

export function buildStandardFeature(name, config, handlers) {
	let icon, stringValue;

	// If the clickable is a text
	if (config.icon) {
		// create icon
		icon = createIconDom(
			config.icon,
			config.iconStyle,
			handlers[`on${capitalize(name)}Click`],
		);
	}
	// If the clickable is a text
	if (config.string) {
		stringValue = elt(
			'p',
			{
				className:
					'text-md text-white hover:ring hover:ring-white/30 cursor-default hover:bg-custom-glass-black py-1 px-2 rounded-sm transition-all duration-150',
				onclick: () => handlers[`on${capitalize(name)}Click`](),
			},
			config.string,
		);
	}

	const tooltip = createParaContent(
		'text-gray-300 bg-black rounded-md px-2 py-1 absolute top-7 whitespace-nowrap pointer-events-none delay-300 z-50 featureTooltipHidden',
		config.tooltip,
	);

	let clickable = icon || stringValue;
	if (icon) {
		clickable.addEventListener('mouseenter', () => {
			tooltip.classList.add('featureTooltipVisible');
			tooltip.classList.remove('featureTooltipHidden');
		});

		clickable.addEventListener('mouseleave', () => {
			tooltip.classList.add('featureTooltipHidden');
			tooltip.classList.remove('featureTooltipVisible');
		});
	}
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

	popupCard.style.position = 'fixed';
	popupCard.style.zIndex = '9999';

	document.body.appendChild(popupCard);

	// create feature div to hold icon and popup
	const featureDiv = createFeatureDiv(
		icon || stringValue,
		'',
		config.featureDivStyle,
		tooltip,
	);

	return {
		icon: icon || stringValue,
		dom: featureDiv,
		popup: popupCard,
		tooltip,
		refs: {},
	};
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

	const tooltip = createParaContent(
		'text-gray-300 fixed bg-black rounded-md z-50 px-2 py-1 top-12 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden',
		config.tooltip,
	);

	document.body.appendChild(tooltip);
	const wrapper = elt(
		'div',
		{ className: 'relative flex flex-row justify-center items-center' },
		icon,
		tooltip,
	);

	icon.addEventListener('mouseenter', () => {
		const rect = icon.getBoundingClientRect();
		tooltip.style.left = rect.left + 'px';
		tooltip.style.top = rect.bottom + 6 + 'px';
		tooltip.classList.add('featureTooltipVisible');
		tooltip.classList.remove('featureTooltipHidden');
	});

	icon.addEventListener('mouseleave', () => {
		tooltip.classList.add('featureTooltipHidden');
		tooltip.classList.remove('featureTooltipVisible');
	});

	return { dom: wrapper, icon, popup: null, tooltip, refs: {} }; // Return the icon as the feature DOM, and also include it in the return object for reference in syncState
}

// Used in color controls
export function buildDivOnlyFeature(name, config) {
	const div = elt(
		'div',
		{
			className: `${config.divStyle}`,
			'data-slot': `${config.data.slot}`,
			'data-empty': 'true',
			style: `background-color: ${config.data.defaultColor}`,
		},
		'',
	);

	return { dom: div, icon: null, popup: null, refs: { [`${name}`]: div } };
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

	const tooltip = createParaContent(
		'text-gray-300 bg-black rounded-md px-2 py-1 absolute top-12 whitespace-nowrap pointer-events-none delay-300 featureTooltipHidden z-50',
		config.tooltip,
	);

	icon.addEventListener('mouseenter', () => {
		tooltip.classList.add('featureTooltipVisible');
		tooltip.classList.remove('featureTooltipHidden');
	});

	icon.addEventListener('mouseleave', () => {
		tooltip.classList.add('featureTooltipHidden');
		tooltip.classList.remove('featureTooltipVisible');
	});

	const popupDom = result.dom; // The custom builder should return an object with a 'dom' property containing the popup content

	popupDom.style.position = 'fixed';
	popupDom.style.zIndex = '9999';

	document.body.appendChild(popupDom);

	const refs = result.refs || {}; // The custom builder can also return any references to important elements (like switches) that need to be accessed in syncState

	// combine into a feature
	const featureDiv = createFeatureDiv(
		icon,
		'',
		config.featureDivStyle,
		tooltip,
	);

	return { icon: icon, dom: featureDiv, popup: popupDom, tooltip, refs: refs }; // Return both the feature div and the popup for reference in syncState
}

// ═══════════════════════════════════════
//                UTILITY
// ═══════════════════════════════════════

// capitalize first letter of a string (for display purposes)
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
