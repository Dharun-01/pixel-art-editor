import { elt } from '../utils';
export function createFeatureDiv(icon, card, classes, tooltip) {
	// this is a feature icon + feature card wrapper
	return elt('div', { className: `${classes}` }, icon, tooltip, card);
}
