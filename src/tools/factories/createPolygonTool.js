import { shapeToolContext } from '../helpers/shapeToolContext';
import { toolStarterCode } from '../utilities';

export function createPolygonTool(
	pos,
	state,
	dispatch,
	getColor = () => state.tools.color,
	getOpacity = () => state.tools.opacity,
	sides,
	shape,
) {
	let { stamp, spacing, color, opacity, lastStampPos } = toolStarterCode(
		state,
		getColor,
		getOpacity,
	);

	function connect(to, currentState, isFinal) {
		let result = shapeToolContext(
			pos,
			to,
			sides,
			currentState,
			stamp,
			spacing,
			lastStampPos,
			color,
			opacity,
			shape,
		);
		dispatch({
			type: 'SET_PICTURE',
			isPreview: isFinal ? false : true,
			stringValue: currentState.drawing.picture.draw(result),
		});
	}
	connect(pos, state, false);
	return connect;
}
