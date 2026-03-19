/**
 * Service for managing drawing interactions (drag operations)
 */
export class CanvasDrawingInteractionServices {
	/**
	 * Create a drawing interaction handler
	 * @param {Object} startPos - Starting position
	 * @param {Function} onMove - Callback when pointer moves
	 * @param {Function} onEnd - Callback when interaction ends
	 * @param {Object} state - Current state
	 * @returns {Object} - Interaction controller
	 */
	static createInteraction(startPos, onMove, onEnd) {
		let currentPos = startPos;

		return {
			/**
			 * Update interaction with new position
			 */
			update(newPos, isFinal = false) {
				// Don't update if position hasn't changed
				if (
					currentPos.x === newPos.x &&
					currentPos.y === newPos.y &&
					!isFinal
				) {
					return false;
				}

				currentPos = newPos;

				if (isFinal) {
					onEnd(newPos);
				} else {
					onMove(newPos, false);
				}

				return true;
			},

			/**
			 * Finalize the interaction
			 */
			finalize() {
				onEnd(currentPos);
			},

			/**
			 * Get current position
			 */
			getCurrentPosition() {
				return currentPos;
			},
		};
	}
}
