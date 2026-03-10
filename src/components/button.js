import { elt } from '../utils';
export function createButton(classes, buttonText, onClick) {
	return elt(
		'button',
		{
			className: `${classes}`,
			onclick: (event) => {
				event.stopPropagation();
				onClick();
			},
		},
		buttonText,
	);
}
