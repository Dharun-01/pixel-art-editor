export class InputValidationService {
	/**
	 * Validate zoom input format (e.g., "100%", "50.5%")
	 */
	static validateInput(value) {
		if (/^\d+\.?\d*%$/.test(value)) {
			return true;
		}
		return false;
	}

	/**
	 * Extract number from zoom string
	 * "100%" → 100
	 * "50.5%" → 50.5
	 */
	static extractZoomValue(value) {
		const match = value.match(/\d+\.?\d*/);
		return match ? parseFloat(match[0]) : null;
	}

	/**
	 * Clamp zoom value to valid range
	 */
	static clampZoom(value, min = 12.5, max = 1000) {
		return Math.max(min, Math.min(max, value));
	}
}

// services/StatusbarCalculationService.js
export class StatusbarCalculationService {
	/**
	 * Calculate slider percentage (0-100) from value
	 */
	static calculateSliderPercentage(value, min, max) {
		return ((value - min) / (max - min)) * 100;
	}

	/**
	 * Calculate thumb position for tooltip
	 */
	static calculateThumbPosition(value, min, max, sliderRect) {
		const ratio = (value - min) / (max - min);
		const thumbX = sliderRect.left + ratio * sliderRect.width;
		const thumbY = sliderRect.top + sliderRect.height / 2;

		return { x: thumbX, y: thumbY };
	}

	/**
	 * Generate gradient CSS for slider background
	 */
	static generateSliderGradient(
		percentage,
		activeColor = '#4DA3FF',
		inactiveColor = '#FFFFFF99',
	) {
		return `linear-gradient(to right, ${activeColor} ${percentage}%, ${inactiveColor} ${percentage}%)`;
	}
}
