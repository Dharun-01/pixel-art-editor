import { elt } from '../utils';

export function createParaContent(classes, text) {
	return elt('p', { className: `${classes}` }, text);
}
