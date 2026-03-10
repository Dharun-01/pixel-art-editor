import { toolStarterCode } from '../utilities';
import { shapeToolContext } from '../helpers/shapeToolContext';

export function createLineTool(
	pos,
	state,
	dispatch,
	getColor = () => state.tools.color,
	getOpacity = () => state.tools.opacity,
	shape,
) {
	let { stamp, spacing, color, opacity, lastStampPos } = toolStarterCode(
		state,
		getColor,
		getOpacity,
	);
	let base = state.drawing.picture;
	return (end, state, isFinal) => {
		let result = shapeToolContext(
			pos,
			end,
			null,
			state,
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
			stringValue: base.draw(result),
		});
	};
}
