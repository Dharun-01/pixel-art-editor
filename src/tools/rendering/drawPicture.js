import { gridOverlay } from './gridOverlay';
import { drawAxisLines } from '../../utils';
import {
	canvasReset,
	updateOffScreenData,
	zoomCanvas,
	offScreen,
} from './drawPictureHelper';

export function drawPicture(
	state,
	picture,
	canvas,
	oldZoom,
	zoom,
	previous,
	ImageData,
	cx,
) {
	let { imageData, fullRedraw } = canvasReset(
		previous,
		picture,
		canvas,
		oldZoom,
		ImageData,
		zoom,
	);
	let { startX, startY, dirtyWidth, dirtyHeight } = updateOffScreenData(
		picture,
		fullRedraw,
		imageData,
	);
	zoomCanvas(cx, zoom);
	cx.drawImage(
		offScreen,
		startX,
		startY,
		dirtyWidth,
		dirtyHeight,
		startX,
		startY,
		dirtyWidth,
		dirtyHeight,
	);

	gridOverlay(state, cx, 0, 0, picture.width - 1, picture.height - 1);

	if (state.ui.transform.mirror.axis) {
		drawAxisLines(
			cx,
			0,
			0,
			picture.width - 1,
			picture.height - 1,
			state.ui.transform.mirror.axis,
		);
	}

	return imageData;
}
