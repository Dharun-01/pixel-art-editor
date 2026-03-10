import { elt } from '../utils';
export function createFeatures(features, classes) {
	// this is the whole controls' features wrapper
	return elt('div', { className: `${classes}` }, ...features);
}
