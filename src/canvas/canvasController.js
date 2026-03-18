import { autoSave } from '../app/services/autoSaveService.js';
import { PictureCanvasView } from './canvasView.js';
import { CanvasPointerEventServices } from './services/canvasPointerEventService.js';
import { CanvasInteractionServices } from './services/canvasInteractionService.js';
import { CanvasDrawingInteractionServices } from './services/canvasDrawingInteractionService.js';
import { drawPicture } from '../tools/rendering/drawPicture.js';
import { CanvasSyncStateServices } from './services/canvasSyncStateService.js';

export class PictureCanvasController {
	constructor(state, pointerDown, picture, { dispatch }) {
		this.state = state;
		this.pointerDown = pointerDown;
		this.dispatch = dispatch;
		this.picture = null;
		this.gridVisible = null;
		this.view = new PictureCanvasView(this.createHandlers());
		this.view.dom.width = picture.width;
		this.view.dom.height = picture.height;
		this.dom = this.view.dom;
		this.cx = this.view.dom.getContext('2d', { willReadFrequently: true });
		this.ImageData = this.cx.createImageData(picture.width, picture.height);
		this.zoom = null;
		this.mirrorAxis = state.ui.transform.mirror.axis;
		this.autoTimer = null;
		this.syncState(picture, this.state);
	}

	createHandlers() {
		return {
			onMouseMove: (event) => this.handleMouseMove(event),
			onMouseDown: (event) => this.handleMouseDown(event),
			onMouseLeave: () => this.handleMouseLeave(),
			onTouchStart: (event) => this.handleTouchStart(event),
		};
	}

	// ═══════════════════════════════════════
	// MOUSE HANDLERS (Using Services)
	// ═══════════════════════════════════════

	handleMouseMove(event) {
		// Use service to get position
		const pos = CanvasPointerEventServices.getMousePosition(
			event,
			this.dom,
			this.state,
		);

		// Use service to validate position
		const validPos = CanvasInteractionServices.validateCursorPosition(
			pos,
			this.picture.width,
			this.picture.height,
		);

		// Dispatch using service-created action
		this.dispatch(CanvasPointerEventServices.createCursorAction(validPos));
	}

	handleMouseDown(event) {
		// Use service to check if left click
		if (!CanvasInteractionServices.isLeftClick(event)) return;

		// Get position using service
		const startPos = CanvasPointerEventServices.getMousePosition(
			event,
			this.dom,
			this.state,
		);

		// Call pointerDown (from tool)
		const onMove = this.pointerDown(startPos);
		if (!onMove) return;

		// Create interaction using service
		const interaction = CanvasDrawingInteractionServices.createInteraction(
			startPos,
			onMove,
			(endPos) => {
				try {
					onMove(endPos, true);
				} catch (error) {
					console.error('Drawing error:', error);
				}
			},
			this.state,
		);

		// Mouse up handler
		const handleMouseUp = (upEvent) => {
			const endPos = CanvasPointerEventServices.getMousePosition(
				upEvent,
				this.dom,

				this.state,
			);

			interaction.finalize();

			this.dom.removeEventListener('mousemove', handleMouseMove);
			this.dom.removeEventListener('mouseup', handleMouseUp);
		};

		// Mouse move handler
		const handleMouseMove = (moveEvent) => {
			// Use service to check if button is pressed
			if (!CanvasInteractionServices.isMouseButtonPressed(moveEvent)) {
				return;
			}

			// Get new position using service
			const newPos = CanvasPointerEventServices.getMousePosition(
				moveEvent,
				this.dom,
				this.state,
			);

			// Use service to check if position changed
			if (
				CanvasInteractionServices.isSamePosition(
					newPos,
					interaction.getCurrentPosition(),
				)
			) {
				return;
			}

			// Validate and dispatch cursor position
			const validPos = CanvasInteractionServices.validateCursorPosition(
				newPos,
				this.picture.width,
				this.picture.height,
			);
			this.dispatch(CanvasPointerEventServices.createCursorAction(validPos));

			// Update interaction
			interaction.update(newPos, false);
		};

		this.dom.addEventListener('mouseup', handleMouseUp);
		this.dom.addEventListener('mousemove', handleMouseMove);
	}

	handleMouseLeave() {
		// Use service to create action
		this.dispatch(CanvasPointerEventServices.createCursorAction(null));
	}

	handleTouchStart(event) {
		// Get position using service
		const startPos = CanvasPointerEventServices.getTouchPosition(
			event,
			this.dom,
			this.state,
		);

		const onMove = this.pointerDown(startPos);
		event.preventDefault();
		if (!onMove) return;

		// Create interaction using service
		const interaction = CanvasDrawingInteractionServices.createInteraction(
			startPos,
			onMove,
			(endPos) => {
				onMove(endPos, true);
			},
			this.state,
		);

		// Touch move handler
		const handleTouchMove = (moveEvent) => {
			const newPos = CanvasPointerEventServices.getTouchPosition(
				moveEvent,
				this.dom,
				this.state,
			);

			// Check if position changed using service
			if (
				CanvasInteractionServices.isSamePosition(
					newPos,
					interaction.getCurrentPosition(),
				)
			) {
				return;
			}

			// Validate and dispatch cursor
			const validPos = CanvasInteractionServices.validateCursorPosition(
				newPos,
				this.picture.width,
				this.picture.height,
			);
			this.dispatch(CanvasPointerEventServices.createCursorAction(validPos));

			// Update interaction
			interaction.update(newPos, false);
		};

		// Touch end handler
		const handleTouchEnd = () => {
			interaction.finalize();
			this.dom.removeEventListener('touchmove', handleTouchMove);
			this.dom.removeEventListener('touchend', handleTouchEnd);
		};

		this.dom.addEventListener('touchmove', handleTouchMove);
		this.dom.addEventListener('touchend', handleTouchEnd);
	}

	syncState(picture, state) {
		this.state = state;

		const isPreview = CanvasSyncStateServices.isPreview(
			state.drawing.previewPicture,
		);
		const newMirrorAxis = state.ui.transform.mirror.axis;
		const isSame = CanvasSyncStateServices.isSamePictureOrZoom(
			this.picture,
			picture,
			this.zoom,
			state.drawing.zoomLevel,
			isPreview,
			this.gridVisible,
			state.ui.transform.gridVisible,
			this.mirrorAxis,
			newMirrorAxis,
		);

		if (!isSame) {
			clearTimeout(this.autoTimer);

			this.autoTimer = setTimeout(() => {
				autoSave(this.state.drawing.picture);
			}, 1000);
		}

		if (isSame) return;

		this.ImageData = drawPicture(
			state,
			picture,
			this.dom,
			this.zoom,
			state.drawing.zoomLevel,
			null,
			this.ImageData,
			this.cx,
		);

		this.picture = picture;
		this.zoom = state.drawing.zoomLevel;
		this.gridVisible = state.ui.transform.gridVisible;
		this.mirrorAxis = newMirrorAxis;
	}
}
