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
		const ratio = (value - min) / (max - min);
		const x = ratio * slider.offsetWidth;
		const y = 82;
		return { x, y };
	}
}
