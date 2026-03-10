import { elt } from '../utils';
export function createToggleSwitch(optionText, onOption) {
	return elt('input', {
		type: 'checkbox',
		id: optionText,
		onclick: (event) => {
			event.stopPropagation();
			onOption();
		},
	});
}
