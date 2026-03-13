import { createIconDom } from '../../components/toggleIcon.js';
import { createPopupCard } from '../../components/popupCard.js';
import { createCardOptionWithSwitch } from '../../components/cardOptionWithSwitch.js';
import { createToggleSwitch } from '../../components/toggleSwitch.js';
import { createInput } from '../../components/inputTag.js';
import { createButton } from '../../components/button.js';
import { createRadioInput } from '../../components/radioInput.js';
import { createLabel } from '../../components/label.js';
import { createErrorMessage } from '../../components/errorMessage.js';
import { elt, hexToRgb } from '../../utils.js';
import { createParaContent } from '../../components/paraTag.js';

// ═══════════════════════════════════════
// CUSTOM CONTENT BUILDERS
// ═══════════════════════════════════════

/**
 * Build mirror popup content (switches + grouping)
 */

export function createMirrorContent(handlers) {
	const refs = {};
	// Mirror Options Config
	const mirrorOptions = [
		{ label: 'Reflect Vertical', action: 'onReflectVertical' },
		{ label: 'Reflect Horizontal', action: 'onReflectHorizontal' },
		{ label: 'Reflect Main Diagonal', action: 'onReflectMainDiagonal' },
		{ label: 'Reflect Off Diagonal', action: 'onReflectOffDiagonal' },
	];

	// Group Options Config
	const groupOptions = [
		{ label: 'Reflect Orthogonal', action: 'onReflectOrthogonal' },
		{ label: 'Reflect Diagonal', action: 'onReflectDiagonal' },
	];

	// Build mirror options
	const mirrorOptionsElements = mirrorOptions.map((option) => {
		const toggleSwitch = createToggleSwitch(
			option.label,
			handlers[option.action],
		);
		refs[option.action] = toggleSwitch;
		return createCardOptionWithSwitch(option.label, toggleSwitch);
	});

	//build group options

	const groupOptionsElements = groupOptions.map((option) => {
		const toggleSwitch = createToggleSwitch(
			option.label,
			handlers[option.action],
		);
		refs[option.action] = toggleSwitch;
		return createCardOptionWithSwitch(option.label, toggleSwitch);
	});

	// Combine all options into one popup card
	const allOptions = [...mirrorOptionsElements, ...groupOptionsElements];

	return { dom: createPopupCard(allOptions, 'popup-card-style'), refs };
}

export function createResizeContent(handlers) {
	// To Choose canvas size units
	const labelPercentageUnit = createLabel('percentage', 'Percentage');
	const percentageRadioInput = createRadioInput(
		'resize',
		true,
		'percentage',
		(isChecked, id) => handlers.onUnitChange(isChecked, id),
	);
	const labelPixelsUnit = createLabel('pixels', 'Pixels');
	const pixelRadioInput = createRadioInput(
		'resize',
		false,
		'pixels',
		(isChecked, id) => handlers.onUnitChange(isChecked, id),
	);

	// Wrapping the label + radio input to style it.
	const percentageUnit = elt(
		'div',
		{ className: 'flex flex-row gap-x-2' },
		labelPercentageUnit,
		percentageRadioInput,
	);
	const pixelsUnit = elt(
		'div',
		{ className: 'flex flex-row gap-x-2' },
		labelPixelsUnit,
		pixelRadioInput,
	);

	// Wrapper to radio selection system
	const radioBox = elt(
		'div',
		{
			className: 'flex flex-row items-center gap-x-17 justify-left',
		},
		percentageUnit,
		pixelsUnit,
	);

	// Wrapper for including "Select Unit" h1 tag in the radio system.
	const radioSelectBox = elt(
		'div',
		{ className: 'flex flex-col gap-y-2' },
		elt('p', { className: 'font-semibold text-[15px] ' }, 'Select Unit'),
		radioBox,
	);

	// To link two inputs (width and height)
	const linkIcon = createIconDom(
		'../../assets/link_off_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg',
		'',
		handlers.onLinkClick,
	);

	// Labels for height and width inputs
	const widthInputLabel = createLabel('width', 'Width');
	const heightInputLabel = createLabel('height', 'Height');

	// Inputting width and height
	const widthInput = createInput(
		'text',
		'resize-input-style',
		'5',
		'width',
		(eventValue) => {
			handlers.onWidthChange(eventValue);
		},
		(eventValue) => {
			handlers.onWidthChange(eventValue);
		},
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
	);

	const heightInput = createInput(
		'text',
		'resize-input-style',
		'5',
		'height',
		(eventValue) => {
			handlers.onHeightChange(eventValue);
		},
		(eventValue) => {
			handlers.onHeightChange(eventValue);
		},
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
	);

	// errorMessage
	const widthInputErrorMessage = createErrorMessage(
		'resize-error-message-style',
		'',
	);
	const heightInputErrorMessage = createErrorMessage(
		'resize-error-message-style',
		'',
	);

	// Wrapping the Inputs, labels and error message
	const width = elt(
		'div',
		{ className: 'relative flex flex-col gap-y-1' },
		widthInputLabel,
		widthInput,
		widthInputErrorMessage,
	);
	const height = elt(
		'div',
		{ className: 'relative flex flex-col gap-y-1' },
		heightInputLabel,
		heightInput,
		heightInputErrorMessage,
	);

	// Wrapper to include the link icon in the canvas size entering system
	const inputDataSystem = elt(
		'div',
		{
			className: 'flex flex-row items-end justify-between',
		},
		width,
		linkIcon,
		height,
	);

	// save Button and Cancel Button
	const saveButton = createButton('btn-primary', 'Save', () => {
		handlers.onSave();
	});
	const cancelButton = createButton('btn-secondary', 'Cancel', () => {
		handlers.onCancel();
	});

	// Wrapper to Wrap the Save and Cancel buttons
	const buttonBox = elt(
		'div',
		{
			className:
				'flex flex-row mt-6 gap-x-2 text-custom-black items-center justify-between',
		},
		saveButton,
		cancelButton,
	);

	return {
		dom: elt(
			'div',
			{
				'data-popup': 'resize',
				className:
					'flex flex-col absolute shadow-sm gap-y-6 shadow-gray-600 min-w-36 min-h-32 bg-custom-tooltip-gray p-3 top-12 left-10 rounded-md',
			},
			radioSelectBox,
			inputDataSystem,
			buttonBox,
		),
		refs: {
			widthError: widthInputErrorMessage,
			heightError: heightInputErrorMessage,
			widthInput: widthInput,
			heightInput: heightInput,
			linkIcon: linkIcon,
			saveButton: saveButton,
		},
	};
}

export function createColorContent(handlers) {
	const editColorText = createParaContent(
		'text-md text-[#E3E3E3]',
		'Edit Color',
	);

	// saturation box
	const sbCanvas = elt('canvas', {
		width: 200,
		height: 130,
		className: 'cursor-crosshair rounded-sm block',
	});

	// Thumb inside the saturation box
	const sbThumb = elt('div', {
		className:
			'w-3 h-3 rounded-full border-2 border-white absolute cursor-crosshair',
		style: 'box-shadow: 0 0 0 1px black; top: 0; left: 0;',
	});

	const sbWrapper = elt(
		'div',
		{
			className: 'relative',
			style: 'width: 200px; height: 130px; overflow: hidden;',
		},
		sbCanvas,
		sbThumb,
	);

	// hue slider
	const hueCanvas = elt('canvas', {
		width: 200,
		height: 14,
		className: 'cursor-pointer rounded-sm block',
	});

	const hueThumb = elt('div', {
		className:
			'absolute w-6 -top-0 cursor-pointer h-[14px] rounded-sm border border-black',
	});

	// Thumb inside the hue slider
	const hueWrapper = elt(
		'div',
		{
			className: 'relative overflow-hidden',
			style: 'width: 200px; height: 14px;',
		},
		hueCanvas,
		hueThumb,
	);

	const sbAndHueCanvasWrapper = elt(
		'div',
		{ className: 'gap-y-2 flex flex-col' },
		sbWrapper,
		hueWrapper,
	);

	// preview of color
	const preview = elt('div', {
		className: 'w-8 h-32 border border-gray-500 rounded-sm',
	});

	// input box to manually input the color
	const hexInput = elt('input', {
		type: 'text',
		maxLength: 7,
		className: 'hex-input-style',
		placeholder: '#000000',
		onchange: (event) => {
			handlers.onHexInputChange(event.target.value);
		},
	});

	//hex input error message
	const hexInputErrorMessage = createErrorMessage(
		'hexInput-error-message-style ',
		'',
	);

	const hexInputSystem = elt(
		'div',
		{ className: 'flex flex-col gap-y-1 relative' },
		hexInput,
		hexInputErrorMessage,
	);

	const entireColorSelectionSystem = elt(
		'div',
		{ className: 'flex flex-row gap-x-5' },
		sbAndHueCanvasWrapper,
		preview,
		hexInputSystem,
	);

	const okButton = createButton(
		'px-2 py-1 bg-custom-blue hover:bg-custom-blue-hover text-custom-black min-w-32 rounded-md',
		'Ok',
		() => handlers.onOkButtonClick(),
	);

	const cancelButton = createButton('btn-secondary', 'Cancel', () =>
		handlers.onCancelButtonClick(),
	);

	// Wrapper to Wrap the Save and Cancel buttons
	const buttonBox = elt(
		'div',
		{
			className:
				'flex flex-row mt-6 gap-x-5 text-custom-black items-center justify-start',
		},
		okButton,
		cancelButton,
	);

	return {
		dom: elt(
			'div',
			{
				className:
					'flex flex-col absolute shadow-sm shadow-gray-600 z-50 gap-y-5 min-w-36 min-h-32 bg-custom-tooltip-gray p-5 top-12 right-80 rounded-md',
			},
			editColorText,
			entireColorSelectionSystem,
			buttonBox,
		),
		refs: {
			sbCanvas,
			hueCanvas,
			sbThumb,
			hueThumb,
			preview,
			hexInput,
			hexInputErrorMessage,
		},
	};
}

export const CUSTOM_BUILDERS = {
	createMirrorContent,
	createResizeContent,
	createColorContent,
};
