import { elt } from '../utils';
export function createControlLabel(text, classes) {
	return elt('p', { className: `${classes}` }, text);
}
