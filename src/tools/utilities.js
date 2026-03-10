import { getPencilStamp } from '../utils';
import { getBrushStamp } from '../utils';
import { calculateStampSpacing } from '../utils';

let stampCache = null;

export function toolStarterCode(state, getColor, getOpacity, drawingTool) {
	let lastStampPos = null;
	if (
		!stampCache ||
		state.tools.brushSize !== stampCache.size ||
		state.tools.selectedBrush !== stampCache.shape ||
		state.tools.selectedShapeBrush !== stampCache.shape
	) {
		stampCache = {
			stamp:
				drawingTool === 'Pencil' ? getPencilStamp(state) : getBrushStamp(state),
			size: state.tools.brushSize,
			shape: state.tools.selectedBrush || state.tools.selectedShapeBrush,
		};
	}

	const stamp = stampCache.stamp;
	const spacing = calculateStampSpacing(state);
	let color = getColor();
	let opacity = getOpacity();

	return {
		stamp,
		spacing,
		color,
		opacity,
		lastStampPos,
	};
}
