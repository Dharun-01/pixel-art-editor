import { elt } from '../utils.js';
export function createErrorMessage(classes, errorMessage) {
	return elt('p', { className: `${classes}` }, errorMessage);
}
