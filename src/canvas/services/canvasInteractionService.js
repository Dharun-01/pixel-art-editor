export class CanvasInteractionServices {
	/**
	 * Business logic for canvas interactions
	 */

	/**
	 *
	 * @param {object} pos
	 * @param {number} width
	 * @param {number} height
	 * @returns whether the position is in the bounds (boolean)
	 */
	static isPositionValid(pos, width, height) {
		return pos.x >= 0 && pos.y >= 0 && pos.x < width && pos.y < height;
	}

	/**
	 * Validate and return cursor position (null if out of bounds)
	 * @param {Object} pos - {x, y} position
	 * @param {number} width - Canvas width
	 * @param {number} height - Canvas height
	 * @returns {Object|null} - Position if valid, null if out of bounds
	 */
	static validateCursorPosition(pos, width, height) {
		return this.isPositionValid(pos, width, height) ? pos : null;
	}

	/**
	 * Check if two positions are the same
	 * @param {Object} pos1 - {x, y} position
	 * @param {Object} pos2 - {x, y} position
	 * @returns {boolean}
	 */
	static isSamePosition(pos1, pos2) {
		return pos1.x === pos2.x && pos1.y === pos2.y;
	}

	/**
	 * Check if mouse buttons are pressed
	 * @param {MouseEvent} event
	 * @returns {boolean}
	 */
	static isMouseButtonPressed(event) {
		return event.buttons !== 0;
	}

	/**
	 * Check if left mouse button clicked
	 * @param {MouseEvent} event
	 * @returns {boolean}
	 */
	static isLeftClick(event) {
		return event.button === 0;
	}
}
