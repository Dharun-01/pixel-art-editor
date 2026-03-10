import { elt } from '../utils';
export function createInput(
	type,
	classes,
	maxLength,
	id,
	onInput,
	onChange,
	min,
	max,
	value,
	onKeyDown,
	onMouseDown,
	onMouseUp,
	onMouseLeave,
	onMouseEnter,
) {
	return elt('input', {
		type: type,
		min: min,
		max: max,
		value: value,
		className: `${classes}`,
		id: id,
		maxLength: maxLength,
		oninput: (event) => {
			event.stopPropagation();
			if (onInput) onInput(event.target.value);
		},
		onchange: (event) => {
			event.stopPropagation();
			if (onChange) onChange(event.target.value);
		},
		onkeydown: onKeyDown
			? (event) => {
					event.stopPropagation();
					onKeyDown(event.target.value);
				}
			: null,
		onmousedown: onMouseDown
			? (event) => {
					event.stopPropagation();
					onMouseDown(event.target.value);
				}
			: null,
		onmouseup: onMouseUp
			? (event) => {
					event.stopPropagation();
					onMouseUp(event.target.value);
				}
			: null,
		onmouseleave: onMouseLeave
			? (event) => {
					event.stopPropagation();
					onMouseLeave(event.target.value);
				}
			: null,
		onmouseenter: onMouseEnter
			? (event) => {
					event.stopPropagation();
					onMouseEnter(event.target.value);
				}
			: null,
	});
}
