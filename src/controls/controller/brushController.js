import { BrushSelectView } from '../view/brushView';

export class BrushSelectController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new BrushSelectView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	createHandlers() {
		return {
			onBrushClick: () => this.handleToggle('brush'),
			onBrush: () => this.handleBrushType('brush'),
			onCalligraphyBrush: () => this.handleBrushType('calligraphy_Brush'),
			onCalligraphyPen: () => this.handleBrushType('calligraphy_Pen'),
			onAirbrush: () => this.handleBrushType('airbrush'),
			onOilBrush: () => this.handleBrushType('oil_Brush'),
			onCrayon: () => this.handleBrushType('crayon'),
			onMarker: () => this.handleBrushType('marker'),
			onNaturalPencil: () => this.handleBrushType('natural_Pencil'),
			onWatercolorBrush: () => this.handleBrushType('watercolor_Brush'),
		};
	}

	openPopup(featureName) {
		if (this.state.ui.drawingTools.active === featureName) {
			this.dispatch({ type: 'SET_BRUSH', stringValue: null });
			return;
		}

		this.dispatch({ type: 'SET_BRUSH', stringValue: featureName });

		const outSideClick = () => {
			this.dispatch({ type: 'SET_BRUSH', stringValue: null });
			document.removeEventListener('click', outSideClick);
		};

		setTimeout(() => document.addEventListener('click', outSideClick), 0);
	}

	handleToggle(featureName) {
		this.openPopup(featureName);
	}

	handleBrushType(brushType) {
		let allCaps = brushType.toUpperCase();
		this.dispatch({
			type: `VALUE_${allCaps}`,
			stringValue: allCaps,
		});
	}

	syncState(newState) {
		this.state = newState;
		const { active } = newState.ui.drawingTools;

		if (active === 'brush') {
			this.view.hideTooltipOnPopupActive(this.view.references['brushTooltip']);
			this.view.highlightIcon('brush', true);
			this.view.showPopup('brush', true);
		} else {
			this.view.highlightIcon('brush', false);
			this.view.showPopup('brush', false);
		}
	}
}
