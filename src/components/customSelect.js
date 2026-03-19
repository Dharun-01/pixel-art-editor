import { elt, getAssetPath } from '../utils';
import { createIconDom } from './toggleIcon';

/**
 *
 * @param {className} customSelectWrapperClass - the entire select box class
 * @param {*} customSelectTriggerClass - the trigger class
 * @param {*} customSelectDropDownClass - drop down class
 * @param {*} customSelectOptionsClass - select option class
 * @param {*} options - options for the select box
 */

/* ||  COMPONENT DATA
  Options Data Structure:  [{label: 'XYZ', value: 'xyz'}, same thing]
  Dependencies: elt, createIconDom function   
	hardCoded-class: 'tooltipVisible', 'tooltipHidden'
  */

export function createCustomSelect(
	customSelectWrapperClass,
	customSelectTriggerClass,
	customSelectDropDownClass,
	customSelectOptionsClass,
	options, // format [{label: 'XYZ', value: 'xyz'}]
	onChange,
) {
	let selectedIndex = 0;
	let isOpen = false;

	const triggerText = elt('span', {}, options[selectedIndex].label);

	const chevron = createIconDom(
		getAssetPath(
			'/icons/arrow_drop_down_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		),
		'transition-all duration-150',
		null,
	);

	const triggerBox = elt(
		'button',
		{ className: `${customSelectTriggerClass} w-full rounded-md` },
		triggerText,
		chevron,
	);

	const dropDown = elt('div', {
		className: `${customSelectDropDownClass} tooltipHidden z-50 max-h-26 overflow-auto custom-scroll-bar`,
	});
	options.forEach((opt, index) => {
		const item = elt(
			'div',
			{
				className: `${customSelectOptionsClass}`,
				onclick: () => {
					selectedIndex = index;
					triggerText.textContent = opt.label;
					closeDropDown();
					onChange?.(opt.value);
				},
			},
			opt.label,
		);
		dropDown.appendChild(item);
	});

	const selectWrapper = elt(
		'div',
		{ className: `${customSelectWrapperClass} w-full` },
		triggerBox,
		dropDown,
	);

	function closeDropDown() {
		isOpen = false;
		triggerBox.classList.replace('rounded-t-md', 'rounded-md');
		dropDown.classList.replace('tooltipVisible', 'tooltipHidden');
		chevron.style.transform = 'rotate(0deg)';
	}

	function openDropDown() {
		isOpen = true;
		triggerBox.classList.replace('rounded-md', 'rounded-t-md');
		dropDown.classList.replace('tooltipHidden', 'tooltipVisible');
		chevron.style.transform = 'rotate(180deg)';
	}

	triggerBox.addEventListener('click', (event) => {
		event.stopPropagation();
		isOpen ? closeDropDown() : openDropDown();
	});

	chevron.addEventListener('click', (event) => {
		event.stopPropagation();
		isOpen ? closeDropDown() : openDropDown();
	});

	document.addEventListener('click', (event) => {
		if (!selectWrapper.contains(event.target)) {
			closeDropDown();
		}
	});

	return selectWrapper;
}
