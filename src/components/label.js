import { elt } from '../utils';
export function createLabel(labelFor, labelText, classes) {
	return elt(
		'label',
		{ htmlFor: labelFor, className: `${classes}` },
		labelText,
	);
}
