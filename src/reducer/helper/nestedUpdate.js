/**
 * Get nested property value
 * @param {Object} state - State object
 * @param {string} path - Dot notation path
 * @returns {any} Value at path
 */

// This function gets nested paths' value
function getNested(state, activePath) {
	return activePath.split('.').reduce((current, key) => current?.[key], state);
}

/**
 *
 * @param {Object} newState - State object
 * @param {string} path - Dot notation path
 * @param {any} value - Value to be inserted at that path
 * @returns
 */

// This function sets value in the nested path
function setNested(newState, path, value) {
	const keys = path.split('.');

	if (keys.length === 1) {
		return { ...newState, [keys[0]]: value };
	}

	const [first, ...rest] = keys;

	return {
		...newState,
		[first]: setNested(newState[first] || {}, rest.join('.'), value),
	};
}

export function createExclusiveToggle(state, activePath) {
	let newState = state;

	let currentValue = getNested(state, activePath);
	newState = setNested(newState, activePath, !currentValue);

	return newState;
}

// This function sets strings but not booleans
export function setExclusiveValue(state, path, value) {
	let newState = state;
	newState = setNested(newState, path, value);

	return newState;
}
