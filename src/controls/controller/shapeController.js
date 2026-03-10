import { ShapeSelectView } from '../view/shapeView';
export class ShapeSelectController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new ShapeSelectView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	createHandlers() {
		return {
			onLineClick: () => this.handleShapeClick('line'),
			onRectangleClick: () => this.handleShapeClick('rectangle'),
			onCircleClick: () => this.handleShapeClick('circle'),
			onTriangleClick: () => this.handleShapeClick('triangle'),
			onRhombusClick: () => this.handleShapeClick('rhombus'),
			onSquareClick: () => this.handleShapeClick('square'),
			onRightTriangleClick: () => this.handleShapeClick('rightTriangle'),
			onPentagonClick: () => this.handleShapeClick('pentagon'),
			onHexagonClick: () => this.handleShapeClick('hexagon'),
			onStarClick: () => this.handleShapeClick('star'),
			onFourPointStarClick: () => this.handleShapeClick('fourPointStar'),
			onSixPointStarClick: () => this.handleShapeClick('sixPointStar'),
			onHeartClick: () => this.handleShapeClick('heart'),

			onShapeBrushClick: () => this.handleShapeBrushClick(),
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

	handleShapeClick(shape) {
		this.dispatch({ type: 'SET_SHAPE', stringValue: shape });
	}

	/* openPopup() {
		this.dispatch({ type: 'SET_SHAPE_BRUSH' });
		const onOutsideClick = (event) => {
			/* if (event.target.closest(`[data-popup="${featureName}"]`)) return; */ // This is used if You want the popup to close only when clicked anywhere outside the popup.
	/* 	this.dispatch({ type: 'SET_SHAPE_BRUSH' });
			document.removeEventListener('click', onOutsideClick);
		}; */

	/* setTimeout(() => document.addEventListener('click', onOutsideClick), 0); */
	// }

	handleShapeBrushClick() {
		this.dispatch({ type: 'SET_SHAPE_BRUSH' });
		/* this.openPopup(); */
	}

	handleBrushType(brushType) {
		let allCaps = brushType.toUpperCase();
		this.dispatch({ type: `VALUE_${allCaps}`, stringValue: allCaps });
	}

	syncState(newState) {
		const { active } = newState.ui.drawingTools;
		const shapes = [
			'rectangle',
			'circle',
			'square',
			'rhombus',
			'triangle',
			'rightTriangle',
			'heart',
			'star',
			'fourPointStar',
			'sixPointStar',
			'pentagon',
			'hexagon',
			'line',
		];

		shapes.forEach((shape) => {
			const isActive = active === shape;
			this.view.highlightIcon(shape, isActive, 'shape-icon-highlight-style');
		});
		const { activeBrush } = newState.ui.drawingShapeTools;
		if (activeBrush) {
			this.view.showPopup('shapeBrush', true);
			this.view.highlightIcon(
				'shapeBrush',
				!!activeBrush,
				'icon-highlight-style',
			);
		} else {
			this.view.highlightIcon(
				'shapeBrush',
				!!activeBrush,
				'icon-highlight-style',
			);
			this.view.showPopup('shapeBrush', false);
		}
	}
}
