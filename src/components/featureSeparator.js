import { elt } from '../utils';

export function createFeatureSeparator(classes) {
	return elt('div', { className: `${classes}` }, '');
}
