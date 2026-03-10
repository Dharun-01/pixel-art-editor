import { pointerPosition } from '../../utils.js';

/**
 * Service for handling pointer event processing
 */
export class CanvasPointerEventServices {
	/**
	 * Get position from mouse event
	 * @param {MouseEvent} event
	 * @param {HTMLCanvasElement} canvas
	 * @param {Object} state
	 * @returns {Object} - {x, y} position
	 */
	static getMousePosition(event, canvas, state) {
		return pointerPosition(event, canvas, state);
	}

	/**
	 * Get position from touch event
	 * @param {TouchEvent} event
	 * @param {HTMLCanvasElement} canvas
	 * @param {Object} state
	 * @returns {Object} - {x, y} position
	 */
	static getTouchPosition(event, canvas, state) {
		return pointerPosition(event.touches[0], canvas, state);
	}

	/**
	 * Create cursor action data
	 * @param {Object} pos - Position or null
	 * @returns {Object} - Action object for dispatch
	 */
	static createCursorAction(pos) {
		return {
			type: 'SET_CURSOR',
			stringValue: pos,
		};
	}
}
