import { SideControlsView } from './sidecontrolsView';
import { SideControlsCalculationService } from './services/sidecontrolsServices';

const BRUSH_DEFAULTS = {
	Brush: 3,
	'Calligraphy brush': 5,
	'Calligraphy pen': 5,
	Airbrush: 10,
	'Oil brush': 30,
	Crayon: 30,
	Marker: 30,
	'Natural pencil': 4,
	'Watercolor brush': 30,
	Pencil: 1, // For when pencil tool is selected
};

export class SideControlsController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.isSizeDragging = false;
		this.isOpacityDragging = false;
		this.view = new SideControlsView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	createHandlers() {
		return {
			// size slider handlers
			onSizeControlInput: (value) => this.handleSizeControlInput(value),
			getBrushSize: () => this.handleBrushSize(this.state),
			onSizeControlMouseDown: () => this.handleSizeControlMouseDown(),
			onSizeControlMouseUp: () => this.handleSizeControlMouseUp(),
			onSizeControlMouseLeave: () => this.handleSizeControlMouseLeave(),
			onSizeControlMouseEnter: () => this.handleSizeControlMouseEnter(),

			// opacity slider handlers
			onOpacityControlInput: (value) => this.handleOpacityControlInput(value),
			getBrushOpacity: () => this.handleBrushOpacity(),
			onOpacityControlMouseDown: () => this.handleOpacityControlMouseDown(),
			onOpacityControlMouseUp: () => this.handleOpacityControlMouseUp(),
			onOpacityControlMouseLeave: () => this.handleOpacityControlMouseLeave(),
			onOpacityControlMouseEnter: () => this.handleOpacityControlMouseEnter(),
		};
	}

	handleBrushSize(state) {
		// Use active tool defaults if brush size not manually set
		if (state.ui.drawingTools.active === 'pencil')
			return state.tools.brushSize || BRUSH_DEFAULTS[brushName];
		const brushName = state.tools.selectedBrush || 'Brush';
		return state.tools.brushSize ?? BRUSH_DEFAULTS[brushName] ?? 8;
	}

	handleSizeControlInput(value) {
		const percentage = SideControlsCalculationService.getPercentageValue(
			value,
			1,
			248,
		);
		this.view.updateSliderColor(percentage, this.view.sizeControlSlider);
		const { x, y } = SideControlsCalculationService.getThumbsPosition(
			this.view.sizeControlSlider,
			value,
			this.view.sizeControlSlider.min,
			this.view.sizeControlSlider.max,
		);
		this.view.updateSliderTooltipPosition(this.view.sizeTooltip, x, y);
		this.view.updateSliderValue(value, this.view.sizeTooltip);
		this.dispatch({ type: 'SET_BRUSH_SIZE', stringValue: value });
	}

	handleSizeControlMouseDown() {
		this.isSizeDragging = true;
		this.view.showTooltip(this.view.sizeTooltip);
	}

	handleSizeControlMouseUp() {
		this.isSizeDragging = false;
		this.view.hideTooltip(this.view.sizeTooltip);
	}

	handleSizeControlMouseLeave() {
		this.isSizeDragging = false;
		this.view.hideTooltip(this.view.sizeTooltip);
	}

	handleSizeControlMouseEnter() {
		if (this.isSizeDragging) {
			this.view.showTooltip(this.view.sizeTooltip);
		}
	}

	handleOpacityControlInput(value) {
		const percentage = SideControlsCalculationService.getPercentageValue(
			value,
			1,
			100,
		);
		this.view.updateSliderColor(percentage, this.view.opacityControlSlider);
		const { x, y } = SideControlsCalculationService.getThumbsPosition(
			this.view.opacityControlSlider,
			value,
			this.view.opacityControlSlider.min,
			this.view.opacityControlSlider.max,
		);
		this.view.updateSliderTooltipPosition(this.view.opacityTooltip, x, y);
		this.view.updateSliderValue(value, this.view.opacityTooltip);
		this.dispatch({ type: 'SET_OPACITY', stringValue: value });
	}

	handleBrushOpacity() {
		return this.state.tools.opacity || 100;
	}

	handleOpacityControlMouseDown() {
		this.isOpacityDragging = true;
		this.view.showTooltip(this.view.opacityTooltip);
	}

	handleOpacityControlMouseUp() {
		this.isOpacityDragging = false;
		this.view.hideTooltip(this.view.opacityTooltip);
	}

	handleOpacityControlMouseLeave() {
		this.isOpacityDragging = false;
		this.view.hideTooltip(this.view.opacityTooltip);
	}

	handleOpacityControlMouseEnter() {
		if (this.isOpacityDragging) {
			this.view.showTooltip(this.view.opacityTooltip);
		}
	}

	syncState(newState) {
		this.state = newState;

		const newSize = this.handleBrushSize(this.state);
		const sizePercentage = SideControlsCalculationService.getPercentageValue(
			newSize,
			1,
			248,
		);

		this.view.updateSliderColor(sizePercentage, this.view.sizeControlSlider);

		if (parseInt(this.view.sizeControlSlider.value, 10) !== newSize) {
			this.view.sizeControlSlider.value = newSize;
			this.view.updateSliderValue(newSize, this.view.sizeTooltip);
		}

		const newOpacity = this.handleBrushOpacity();
		const opacityPercentage = SideControlsCalculationService.getPercentageValue(
			newOpacity,
			1,
			100,
		);

		this.view.updateSliderColor(
			opacityPercentage,
			this.view.opacityControlSlider,
		);

		if (parseInt(this.view.opacityControlSlider.value, 10) !== newOpacity) {
			this.view.opacityControlSlider.value = newOpacity;
		}
	}
}
