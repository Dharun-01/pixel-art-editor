import { elt } from '../utils';
export function createLabel(labelFor, labelText) {
	return elt('label', { htmlFor: labelFor, className: '' }, labelText);
}
