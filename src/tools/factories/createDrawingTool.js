import { toolStarterCode } from '../utilities';
import { drawBrushStamps } from '../../utils';

/* This function creates a drawing tool like erase, fill, pencil, brush etc.. */
export function createDrawingTool(
	pos,
	state,
	dispatch,
	getColor = () => state.tools.color,
	getOpacity = () => state.tools.opacity,
	drawingTool,
) {
	let { stamp, spacing, color, opacity, lastStampPos } = toolStarterCode(
		state,
		getColor,
		getOpacity,
		drawingTool,
	);
	function connect(newPos, currentState) {
		let result = drawBrushStamps(
			currentState,
			lastStampPos,
			pos,
			newPos,
			spacing,
			stamp,
			color,
			opacity,
		);
		dispatch({
			type: 'SET_PICTURE',
			isPreview: false,
			stringValue: currentState.drawing.picture.draw(result.allPoints),
		});
		lastStampPos = result.lastPos;
		pos = newPos;
	}
	lastStampPos = null;
	connect(pos, state);
	return connect;
}
