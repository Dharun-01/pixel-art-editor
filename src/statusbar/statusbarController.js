import { StatusbarView } from './statusbarView';
import { StatusbarCalculationService } from './services/statusbarServices';
import { InputValidationService } from './services/statusbarServices';
export class StatusbarController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new StatusbarView(this.createHandlers());
		this.isDragging = false;
		this.syncState(state);
	}

	createHandlers() {
		return {
			onFitWindow: () => this.handleFitWindow(),
			onToggleZoomDropDown: () => this.handleZoomDropDown(),
			onZoomSelect: (value) => this.handleZoomSelect(value),
			onZoomInputChange: (value) => this.handleZoomChange(value),
			onZoomKeyDown: (eventValue) => this.handleZoomChange(eventValue),
			onZoomIn: () => this.handleZoomIn(),
			onZoomOut: () => this.handleZoomOut(),
			onZoomRangeChange: (eventValue) => this.handleZoomRangeChange(eventValue),
			onZoomRangeMouseDown: () => this.handleZoomRangeMouseDown(),
			onZoomRangeMouseUp: () => this.handleZoomRangeMouseUp(),
			onZoomRangeMouseLeave: () => this.handleZoomRangeMouseLeave(),
			onZoomRangeMouseEnter: () => this.handleZoomRangeMouseEnter(),
		};
	}

	handleFitWindow() {
		this.view.hideTooltipOnPopupActive(this.view.fitWindowHoverTooltip);
		const expectedZoom = this.calculateExpectedZoom();
		const expectedZoomPercentage =
			this.calculateExpectedZoomPercentage(expectedZoom);
		this.view.updateZoomDisplay(expectedZoomPercentage);
		this.dispatch({ type: 'SET_ZOOM_LEVEL', stringValue: expectedZoom });
	}

	handleZoomDropDown() {
		this.dispatch({ type: 'TOGGLE_ZOOM_DOWN_ARROW' });
	}

	handleZoomSelect(value) {
		const extractedValue = InputValidationService.extractZoomValue(value);
		this.view.updateZoomLevel(extractedValue);
		this.dispatch({
			type: 'SET_ZOOM_LEVEL',
			stringValue: extractedValue / 100,
		});
		this.dispatch({ type: 'TOGGLE_ZOOM_DOWN_ARROW' });
	}

	handleZoomChange(value) {
		const isValid = InputValidationService.validateInput(value);
		if (isValid) {
			const extractedValue = InputValidationService.extractZoomValue(value);
			this.dispatch({
				type: 'SET_ZOOM_LEVEL',
				stringValue: extractedValue / 100,
			});
			this.view.updateSliderValue(extractedValue);
			this.view.updateZoomDisplay(extractedValue);
		}
	}

	handleZoomIn() {
		this.view.hideTooltipOnPopupActive(this.view.zoomInHoverTooltip);
		const value = this.view.sliderValuePlus10();
		this.dispatch({ type: 'SET_ZOOM_LEVEL', stringValue: value / 100 });
	}

	handleZoomOut() {
		this.view.hideTooltipOnPopupActive(this.view.zoomOutHoverTooltip);
		const value = this.view.sliderValueMinus10();
		this.dispatch({ type: 'SET_ZOOM_LEVEL', stringValue: value / 100 });
	}

	handleZoomRangeChange(value) {
		const percentage = StatusbarCalculationService.calculateSliderPercentage(
			value,
			1,
			1000,
		);
		this.view.updateSliderColor(percentage);
		this.isDragging = true;
		this.view.updateTooltipToThumb();
		this.view.updateZoomDisplay(value);
		this.dispatch({
			type: 'SET_ZOOM_LEVEL',
			stringValue: Math.round(value) / 100,
		});
	}

	handleZoomRangeMouseDown() {
		this.isDragging = true;
		this.view.showTooltip();
	}

	handleZoomRangeMouseUp() {
		this.isDragging = false;
		this.view.hideTooltip();
	}

	handleZoomRangeMouseLeave() {
		this.isDragging = false;
		this.view.hideTooltip();
	}

	handleZoomRangeMouseEnter() {
		if (this.isDragging) {
			this.view.showTooltip();
		}
	}

	syncState(newState) {
		this.state = newState;
		const { zoomLevel } = newState.drawing;
		const { canvas, zoomControls } = newState.ui;
		const { cursorVisible } = newState.ui;
		this.view.updateSliderValue(zoomLevel * 100);
		this.view.updateZoomDisplay(zoomLevel * 100);

		// Update canvas size
		this.view.updateCanvasSize(canvas);

		if (cursorVisible)
			this.view.updatePixelPosition(cursorVisible.x, cursorVisible.y);
		this.view.showDropDown(zoomControls.zoomSelectDownArrow);
	}

	/* UTILITIES */

	calculateExpectedZoom() {
		const expectedZoom = Math.min(
			(window.innerWidth - 60) / this.state.drawing.picture.width,
			(window.innerHeight - 160) / this.state.drawing.picture.height,
		);
		return expectedZoom;
	}

	calculateExpectedZoomPercentage(expectedZoom) {
		let expectedZoomPercentage = `${expectedZoom * 100}%`;
		return expectedZoomPercentage;
	}
}
