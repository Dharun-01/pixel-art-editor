export class SideControlsCalculationService {
	static getPercentageValue(value, min, max) {
		return ((value - min) / (max - min)) * 100;
	}

	static generateSliderGradient(
		percentage,
		activeColor = '#4DA3FF',
		inactiveColor = '#FFFFFF99',
	) {
		return `linear-gradient(to right, ${activeColor} ${percentage}%, ${inactiveColor} ${percentage}%)`;
	}

	static getThumbsPosition(slider, value, min, max) {
		const rect = slider.getBoundingClientRect();
		const ratio = (value - min) / (max - min);
		const x = rect.left + ratio * rect.width;
		const y = rect.top + rect.height / 2;
		return { x, y };
	}
}
