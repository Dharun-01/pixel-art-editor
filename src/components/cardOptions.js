import { elt } from '../utils';
export function createCardOption(text, classes, onOption) {
	// options is an array of DOM elements.
	return elt(
		'p',
		{
			className: `${classes}`,
			onclick: (event) => {
				event.stopPropagation();
				onOption();
			},
		},
		text,
	);
}
