import { drawGridOnZoom } from '../../utils';

export function gridOverlay(state, cx, startX, startY, endX, endY) {
	if (state.ui.transform.gridVisible) {
		drawGridOnZoom(cx, startX, startY, endX, endY);
	}
	return;
}
