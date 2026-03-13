import {
	buildStandardFeature,
	buildIconOnlyFeature,
	buildDivOnlyFeature,
	buildCustomFeature,
} from './featureBuilders.js';

// ═══════════════════════════════════════
// VIEW COMPOSER (SOLID: SRP, OCP)
// ═══════════════════════════════════════

/**
 * Compose features from config
 * @param {Object} config - Feature configuration
 * @param {Object} handlers - Event handlers
 * @param {Object} customBuilders - Custom content builders
 * @returns {Object} - { features, references }
 */

export function composeFeatures(config, handlers, customBuilders) {
	const features = {};
	const references = {}; // store icon / popups for refs in syncState

	Object.entries(config).forEach(([featureName, featureConfig]) => {
		let result;
		// Route to appropriate builder based on feature type

		switch (featureConfig.type) {
			case 'standard':
				result = buildStandardFeature(featureName, featureConfig, handlers);
				break;

			case 'icon-only':
				result = buildIconOnlyFeature(featureName, featureConfig, handlers);
				break;
			case 'div-only':
				result = buildDivOnlyFeature(featureName, featureConfig, handlers);
				break;
			case 'custom':
				result = buildCustomFeature(
					featureName,
					featureConfig,
					handlers,
					customBuilders,
				);
				break;

			default:
				throw new Error(
					`Unknown feature type "${featureConfig.type}" for feature "${featureName}"`,
				);
		}

		features[featureName] = result.dom || result; // Store the feature DOM element (or the icon for icon-only) in features object

		references[`${featureName}Icon`] = result.icon || null;
		references[`${featureName}Popup`] = result.popup || null;
		Object.entries(result.refs || {}).forEach(([key, value]) => {
			references[key] = value; // Store any additional refs returned by the custom builder
		});
	});
	return { features, references };
}
