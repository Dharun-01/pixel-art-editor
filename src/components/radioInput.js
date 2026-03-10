import { elt } from '../utils';
export function createRadioInput(name, isChecked, id, onClick) {
	return elt('input', {
		type: 'radio',
		name: name,
		checked: isChecked,
		id: id,
		onchange: (event) => {
			event.stopPropagation();
			event.target.checked
				? onClick(event.target.checked, event.target.id)
				: null;
		},
	});
}
