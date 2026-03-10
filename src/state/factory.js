import { initialDrawingState } from './drawingState';
import { initialToolState } from './toolState';
import { initialUiState } from './uiState';
import { initialHistoryState } from './historyState';

function deepMerge(base, override) {
	if (!override) return base;

	const result = { ...base };

	for (const key of Object.keys(override)) {
		const baseVal = base[key];
		const overrideVal = override[key];

		// If both are plain objects, recurse
		if (
			baseVal &&
			typeof baseVal === 'object' &&
			!Array.isArray(baseVal) &&
			overrideVal &&
			typeof overrideVal === 'object' &&
			!Array.isArray(overrideVal)
		) {
			result[key] = deepMerge(baseVal, overrideVal);
		} else {
			// Primitive, array, or null — just overwrite
			result[key] = overrideVal;
		}
	}

	return result;
}

export function createInitialState(overrides = {}) {
	return {
		drawing: deepMerge(initialDrawingState, overrides.drawing),
		tools: deepMerge(initialToolState, overrides.tools),
		ui: deepMerge(initialUiState, overrides.ui),
		history: deepMerge(initialHistoryState, overrides.history),
	};
}
