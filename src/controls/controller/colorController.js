import { hexToHsv, hexToRgb, rgbToHex } from '../../utils';
import { colorSelectServices } from '../services/colorSelectServices';
import { ColorSelectView } from '../view/colorView';
const slots = [
	'slot1',
	'slot2',
	'slot3',
	'slot4',
	'slot5',
	'slot6',
	'slot7',
	'slot8',
	'slot9',
	'slot10',
];

export class ColorSelectController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new ColorSelectView(this.createHandlers());
		this.dom = this.view.dom;
		this.isDraggingSb = false;
		this.isDraggingHue = false;
		this.hue = state.ui.color.hue;
		this.saturation = state.ui.color.saturation;
		this.brightness = state.ui.color.brightness;
		this.attachCanvasListeners();
		this.syncState(state);
	}

	createHandlers() {
		return {
			onHexInputChange: (value) => this.handleHexInputChange(value),
			onSlotSelect: (slot) => this.handleSlotSelect(slot),
			onCustomColorSelectorClick: () => this.handleCustomColorSelector(),
			onOkButtonClick: () => this.handleOkButtonClick(),
			onCancelButtonClick: () => this.handleCancelButtonClick(),
		};
	}

	attachCanvasListeners() {
		this.view.references.sbCanvas.addEventListener('mousedown', (event) => {
			this.isDraggingSb = true;
			this.dispatch({ type: 'SET_HEX_INPUT_ERROR', stringValue: '' });
			this.handleSaturationFromMouse(event, this.view.references.sbCanvas);
			this.handleBrightnessFromMouse(event, this.view.references.sbCanvas);
		});

		this.view.references.hueCanvas.addEventListener('mousedown', (event) => {
			this.isDraggingHue = true;
			this.dispatch({ type: 'SET_HEX_INPUT_ERROR', stringValue: '' });
			this.handleHueFromMouse(event, this.view.references.hueCanvas);
		});

		window.addEventListener('mousemove', (event) => {
			if (this.isDraggingHue)
				this.handleHueFromMouse(event, this.view.references.hueCanvas);
			this.dispatch({ type: 'SET_HEX_INPUT_ERROR', stringValue: '' });
			if (this.isDraggingSb) {
				this.handleSaturationFromMouse(event, this.view.references.sbCanvas);
				this.handleBrightnessFromMouse(event, this.view.references.sbCanvas);
			}
		});

		window.addEventListener('mouseup', (event) => {
			if (this.isDraggingHue) {
				this.isDraggingHue = false;
				this.handleHueFromMouse(event, this.view.references.hueCanvas);
			}
			this.dispatch({ type: 'SET_HEX_INPUT_ERROR', stringValue: '' });
			if (this.isDraggingSb) {
				this.isDraggingSb = false;
				this.handleSaturationFromMouse(event, this.view.references.sbCanvas);
				this.handleBrightnessFromMouse(event, this.view.references.sbCanvas);
			}
		});
	}

	handleHexInputChange(value) {
		const isValid = colorSelectServices.validateInputValue(
			value,
			this.dispatch,
		);

		if (isValid) {
			const [h, s, v] = hexToHsv(value);
			this.dispatch({ type: 'SET_HUE', stringValue: h });
			this.dispatch({ type: 'SET_SATURATION', stringValue: s });
			this.dispatch({ type: 'SET_BRIGHTNESS', stringValue: v });
		}
	}

	handleActiveColor(slot) {
		const rgbColor = this.view.references[slot].style.backgroundColor;
		const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
		this.dispatch({ type: 'SET_ACTIVE_SLOT', stringValue: slot });
		this.dispatch({
			type: 'SET_COLOR',
			stringValue: new Uint8ClampedArray([r, g, b, 255]),
		});
	}

	handleSlotSelect(slot) {
		if (slot === 'primaryColor' || slot === 'secondaryColor') {
			this.handleActiveColor(slot);
			return;
		}

		const activeSlot = this.state.ui.color.activeSlot;
		const selectedColor = this.view.references[slot].dataset.color;
		this.view.references[activeSlot].style.backgroundColor = selectedColor;
		const [r, g, b] = hexToRgb(selectedColor);
		this.dispatch({
			type: 'SET_COLOR',
			stringValue: new Uint8ClampedArray([r, g, b, 255]),
		});
	}

	handleSaturationFromMouse(event, sbCanvas) {
		const rect = sbCanvas.getBoundingClientRect();
		let x = (event.clientX - rect.left) / rect.width; // 0 - 1
		let saturation = x * 100;
		this.dispatch({ type: 'SET_SATURATION', stringValue: saturation });
	}

	handleBrightnessFromMouse(event, sbCanvas) {
		const rect = sbCanvas.getBoundingClientRect();
		let y = (event.clientY - rect.top) / rect.height; // 0 - 1
		let brightness = (1 - y) * 100; // y=0 is top = bright, y=1 is bottom = dark
		this.dispatch({ type: 'SET_BRIGHTNESS', stringValue: brightness });
	}

	handleHueFromMouse(event, hueCanvas) {
		const rect = hueCanvas.getBoundingClientRect();
		const x = Math.max(
			0,
			Math.min(1, (event.clientX - rect.left) / rect.width),
		);
		let hue = x * 360;
		this.dispatch({ type: 'SET_HUE', stringValue: hue });
	}

	handleOkButtonClick() {
		const hexColor = this.view.references.hexInput.value;
		const isAnySlotEmpty = slots.every(
			(slot) => this.view.references[slot].dataset.empty === 'false',
		);

		if (isAnySlotEmpty) {
			const slotLength = slots.length;
			for (let i = 0; i < slotLength - 1; i++) {
				this.view.references[slots[i]].dataset.color =
					this.view.references[slots[i + 1]].dataset.color;
				this.view.references[slots[i]].style.background =
					this.view.references[slots[i + 1]].dataset.color;
			}
			this.view.references[slots[slotLength - 1]].style.background = hexColor;
			this.view.references[slots[slotLength - 1]].dataset.color = hexColor;
		}

		for (let i = 0; i < slots.length; i++) {
			if (this.view.references[slots[i]].dataset.empty === 'true') {
				this.view.references[slots[i]].style.background = hexColor;
				this.view.references[slots[i]].dataset.color = hexColor;
				this.view.references[slots[i]].dataset.empty = 'false';
				this.view.references[slots[i]].classList.remove('empty-slot');
				break;
			}
		}

		this.dispatch({ type: 'SET_CUSTOM_ACTIVE' });
	}

	handleCancelButtonClick() {
		this.dispatch({ type: 'SET_CUSTOM_ACTIVE' });
	}

	handleCustomColorSelector() {
		this.dispatch({ type: 'SET_CUSTOM_ACTIVE' });
	}

	syncState(newState) {
		this.state = newState;
		const { color } = newState.ui;

		const rgbArray = colorSelectServices.hsvToRgb(
			color.hue,
			color.saturation,
			color.brightness,
		);

		const hex = rgbToHex(rgbArray);

		this.view.updateSbThumb(
			this.view.references.sbThumb,
			color.saturation,
			color.brightness,
		);

		this.view.updateHueThumb(this.view.references.hueThumb, color.hue);
		this.view.updatePreview(this.view.references.preview, hex);
		this.view.updateHexInput(this.view.references.hexInput, hex);
		this.view.drawHueSlider(this.view.references.hueCanvas);
		this.view.drawSaturationBox(color.hue, this.view.references.sbCanvas);

		this.view.references.hexInputErrorMessage.textContent =
			color.hexInputErrorMessage;

		const isError = !!this.view.references.hexInputErrorMessage.textContent;

		this.view.references.hexInput.classList.toggle(
			'border-b-custom-blue',
			!isError,
		);

		this.view.references.hexInput.classList.toggle('border-b-red-500', isError);

		this.view.references.customColorSelectorIcon.classList.toggle(
			'icon-highlight-style',
			color.isCustomActive,
		);

		this.view.references['primaryColor'].classList.toggle(
			'active-color-slot',
			color.activeSlot === 'primaryColor',
		);
		this.view.references['secondaryColor'].classList.toggle(
			'active-color-slot',
			color.activeSlot === 'secondaryColor',
		);

		this.view.showPopup(color.isCustomActive);

		this.hue = color.hue;
		this.brightness = color.brightness;
		this.saturation = color.saturation;
	}
}
