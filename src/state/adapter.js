import { createInitialState } from './factory.js';
const appState = createInitialState();
export function getLegacyState() {
	return {
		tool: appState.tools.tool,
		sketch: appState.tools.sketch,
		opacity: appState.tools.opacity,
		color: appState.tools.color,
		cursor: appState.tools.cursor,
		brushSize: appState.tools.brushSize,
		selectedBrush: appState.tools.selectedBrush,
		selectedShapeBrush: appState.tools.selectedShapeBrush,

		// drawing
		picture: appState.drawing.picture,
		previewPicture: appState.drawing.previewPicture,
		done: appState.drawing.done,
		redone: appState.drawing.redone,
		doneAt: appState.drawing.doneAt,

		// ui (map back to old flat names)
		toggleRotate: appState.ui.transform.rotate.enabled,
		toggleFlip: appState.ui.transform.flip.enabled,
		toggleMirror: appState.ui.transform.mirror.enabled,
		toggleResize: appState.ui.transform.resizeEnabled,
		toggleGrid: appState.ui.transform.gridVisible,
		togglePencil: appState.ui.drawingTools.pencil,
		toggleFill: appState.ui.drawingTools.fill,
		toggleErase: appState.ui.drawingTools.erase,
		toggleColorPicker: appState.ui.drawingTools.colorPicker,
		toggleBrush: appState.ui.drawingTools.brush,
		toggleShapeBrushes: appState.ui.drawingTools.shapeBrushes,
		toggleZoomPlus: appState.ui.zoomControls.zoomPlus,
		toggleZoomSelect: appState.ui.zoomControls.zoomSelect,
		toggleZoomSelectDownArrow: appState.ui.zoomControls.zoomSelectDownArrow,
		toggleLinkIcon: appState.ui.utilities.linkIcon,
		zoom: appState.ui.zoomLevel,
	};
}
