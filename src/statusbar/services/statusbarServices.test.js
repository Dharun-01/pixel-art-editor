import {
	InputValidationService,
	StatusbarCalculationService,
} from './statusbarServices';

/* || TEST FOR VALIDATE INPUT FUNCTION */
describe('Validate input function', () => {
	// validateInput Signature (percentage)
	// TRUE CASES
	test("returns true if the value is 'number%' format", () => {
		const result = InputValidationService.validateInput('100%');

		expect(result).toBe(true);
	});

	// FALSE CASES
	test('returns true for valid decimal percentage like 95.3%', () => {
		const result = InputValidationService.validateInput('95.3%');

		expect(result).toBe(true);
	});

	test("returns false when the value doesn't contain percentage symbol", () => {
		const result = InputValidationService.validateInput('100');

		expect(result).toBe(false);
	});

	test("returns false when the value doesn't contain numbers", () => {
		const result = InputValidationService.validateInput('quest%');

		expect(result).toBe(false);
	});

	test('returns false when the number is less than zero', () => {
		const result = InputValidationService.validateInput('-100%');

		expect(result).toBe(false);
	});

	test('returns false when the number equals zero', () => {
		const result = InputValidationService.validateInput('0%');

		expect(result).toBe(false);
	});

	test('returns false when you enter special characters', () => {
		const result = InputValidationService.validateInput('!@#');

		expect(result).toBe(false);
	});
});
/* !-- TEST FOR VALIDATE INPUT FUNCTION --! */

/* || TEST FOR EXTRACT ZOOM VALUE */
describe('Extract zoom value function', () => {
	// extractZoomValue Signature (percentage)
	test('returns number when value is extracted from percentage symbol', () => {
		const result = InputValidationService.extractZoomValue('100%');

		expect(result).toBe(100);
	});

	test('returns number when value is a real non-negative number', () => {
		const result = InputValidationService.extractZoomValue('95.5%');

		expect(result).toBe(95.5);
	});

	test('returns null when the value is not a number', () => {
		const result = InputValidationService.extractZoomValue('quest%');

		expect(result).toBeNull();
	});

	test('returns null when it is a negative number', () => {
		const result = InputValidationService.extractZoomValue('-100%');

		expect(result).toBeNull();
	});

	test('returns null when the value is contains special character', () => {
		const result = InputValidationService.extractZoomValue('!@#%');

		expect(result).toBeNull();
	});
});
/* !-- TEST FOR EXTRACT ZOOM VALUE --! */

/* || TEST FOR CLAMP ZOOM FUNCTION */
describe('clamp zoom value', () => {
	// clampZoom Signature (value, min, max)
	test('returns the same value if it is in between min and max', () => {
		const result = InputValidationService.clampZoom(100, 12.5, 1000);

		expect(result).toBe(100);
	});

	test('returns min if value is less than min', () => {
		const result = InputValidationService.clampZoom(10, 12.5, 1000);

		expect(result).toBe(12.5);
	});

	test('returns max if the value is greater than max', () => {
		const result = InputValidationService.clampZoom(10000, 12.5, 1000);

		expect(result).toBe(1000);
	});

	test('returns min if the value is not a number', () => {
		const result = InputValidationService.clampZoom('quest@34', 12.5, 1000);

		expect(result).toBe(12.5);
	});
});
/* !-- TEST FOR CLAMP ZOOM FUNCTION --! */

/* || TEST FOR CALCULATE SLIDER PERCENTAGE FUNCTION */
describe('Calculate slider percentage function', () => {
	// calculateSliderPercentage Signature(value, min, max)
	test('returns percentage when the value, is between min and max', () => {
		const result = StatusbarCalculationService.calculateSliderPercentage(
			200,
			12.5,
			1000,
		);

		expect(result).toBeCloseTo(18.987, 3); // this essentially checks whether the returned decimal part of the value matches the number number and the threshold is 3 which means it matches only exactly three decimal places
	});

	test('returns 100 percent as value when the value passed is less than or equals zero', () => {
		const result = StatusbarCalculationService.calculateSliderPercentage(
			0,
			12.5,
			1000,
		);

		expect(result).toBe(100);
	});

	test('returns 1000 percent as result when the value passed is greater than max value', () => {
		const result = StatusbarCalculationService.calculateSliderPercentage(
			1200,
			12.5,
			1000,
		);

		expect(result).toBe(1000);
	});

	test('returns 100 percent when the value is not a number', () => {
		const result = StatusbarCalculationService.calculateSliderPercentage(
			'quw!27',
			12.5,
			1000,
		);

		expect(result).toBe(100);
	});
});
/* !-- TEST FOR CALCULATE SLIDER PERCENTAGE FUNCTION --!*/

/* || TEST FOR  CALCULATE THUMB POSITION FUNCTION */
// calculateThumbPosition Signature (value, min, max, sliderRect)

// NOTE: y value stays the same because the slider is from left to right.
describe('calculate thumb position', () => {
	let fakeSlider;
	beforeEach(() => {
		fakeSlider = {
			left: 100,
			top: 100,
			width: 100,
			height: 2,
		};
	});

	test('returns thumb position when the normal values are passed', () => {
		const result = StatusbarCalculationService.calculateThumbPosition(
			200,
			12.5,
			1000,
			fakeSlider,
		);

		expect(result.x).toBeCloseTo(118.987, 3); // x value
		expect(result.y).toBeCloseTo(101); // y value
	});

	test('returns thumb position by defaulting to min when value is less than or equal to zero', () => {
		const result = StatusbarCalculationService.calculateThumbPosition(
			-100,
			12.5,
			1000,
			fakeSlider,
		);

		expect(result.x).toBe(100); // x value
		expect(result.y).toBe(101); // y value
	});

	test('returns thumb position by defaulting to max when value is greater than max', () => {
		const result = StatusbarCalculationService.calculateThumbPosition(
			1200,
			12.5,
			1000,
			fakeSlider,
		);

		expect(result.x).toBe(200); // x value
		expect(result.y).toBe(101); // y value
	});

	test('returns thumb position by defaulting to min when value is not a number', () => {
		const result = StatusbarCalculationService.calculateThumbPosition(
			'quest!223@#',
			12.5,
			1000,
			fakeSlider,
		);

		expect(result.x).toBe(100); // x value
		expect(result.y).toBe(101); // y value
	});
});
/* !-- TEST FOR  CALCULATE THUMB POSITION FUNCTION --!*/
