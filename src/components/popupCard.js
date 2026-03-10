import { elt } from '../utils';
export function createPopupCard(options, classes) {
	return elt('div', { className: `${classes}` }, ...options);
}
