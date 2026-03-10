// path for toggling features
export const imageToggleMap = {
	SET_TRANSFORM_MODE: 'transform.activeMode',
	SET_RESIZE_UNIT: 'transform.resize.unit',
};

export const imageBooleanMap = {
	SET_LINKED_INPUTS: 'transform.resize.linked',
	SET_GRID: 'transform.gridVisible',
};

export const imageValueMap = {
	SET_ROTATE_DIRECTION: {
		valuePath: 'transform.rotate.direction',
		togglePath: 'transform.activeMode',
	},
	SET_FLIP_DIRECTION: {
		valuePath: 'transform.flip.direction',
		togglePath: 'transform.activeMode',
	},
	SET_MIRROR_AXIS: {
		valuePath: 'transform.mirror.axis',
		togglePath: 'transform.activeMode',
	},
};
