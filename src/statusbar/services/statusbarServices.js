export class InputValidationService {
	/**
	 * Validate zoom input format (e.g., "100%", "50.5%")
	 */
	static validateInput(percentage) {
		if (/^\d+\.?\d*%$/.test(percentage)) {
			return parseFloat(percentage) > 0;
		}
		return false;
	}

	/**
	 * Extract number from zoom string
	 * "100%" → 100
	 * "50.5%" → 50.5
	 */
	static extractZoomValue(percentage) {
		const match = percentage.match(/^-?\d+\.?\d*/);
		if (!match) return null;
		const number = parseFloat(match[0]);
		return match && number > 0 ? number : null;
	}

	/**
	 * Clamp zoom value to valid range
	 */
	static clampZoom(value, min = 12.5, max = 1000) {
		if (isNaN(value)) return min;
		return Math.max(min, Math.min(max, value));
	}
}

// services/StatusbarCalculationService.js
export class StatusbarCalculationService {
	/**
	 * Calculate slider percentage (0-100) from value
	 */
	static calculateSliderPercentage(value, min, max) {
		if (value <= 0 || isNaN(value)) return 100;
		if (value >= max) return 1000;
		return ((value - min) / (max - min)) * 100;
	}

	/**
	 * Calculate thumb position for tooltip
	 */
	static calculateThumbPosition(value, min, max, sliderRect) {
		if (value <= 0 || isNaN(value)) value = min;
		if (value >= max) value = max;
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
