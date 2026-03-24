import { beforeEach, expect, test } from 'vitest';
import { SideControlsCalculationService } from './sidecontrolsServices';

/* || GET PERCENTAGE VALUE FUNCTION */
// Percentage value Signature (value, min, max)
describe('Percentage value function', () => {
	test('returns percentage if value is between min and max', () => {
		const result = SideControlsCalculationService.getPercentageValue(
			100,
			1,
			200,
		);
		expect(result).toBeCloseTo(49.749, 3);
	});

	test('returns 0 percentage when value is less than or equals zero', () => {
		const result = SideControlsCalculationService.getPercentageValue(
			-100,
			1,
			200,
		);

		expect(result).toBe(0);
	});

	test('returns 0 percentage when the value is not a number', () => {
		const result = SideControlsCalculationService.getPercentageValue(
			'quest1@#',
			1,
			200,
		);

		expect(result).toBe(0);
	});

	test('returns 100 percentage when the value is greater than max value', () => {
		const result = SideControlsCalculationService.getPercentageValue(
			250,
			1,
			200,
		);

		expect(result).toBe(100);
	});
});
/* !-- GET PERCENTAGE VALUE FUNCTION --! */

/* || THUMB POSITION FUNCTION */
// NOTE: only x value changes because the slides are in erect position (Vertically)
describe('Thumb position function', () => {
	let fakeSlider;
	beforeEach(() => {
		fakeSlider = {
			offsetWidth: 100,
		};
	});

	test('returns x, y coords for thumb when normal value is passed', () => {
		const result = SideControlsCalculationService.getThumbsPosition(
			fakeSlider,
			100,
			1,
			200,
		);

		expect(result.x).toBeCloseTo(49.749, 3); // x value
		expect(result.y).toBeCloseTo(82); // y value
	});

	test('returns x as zero when value  === min', () => {
		const result = SideControlsCalculationService.getThumbsPosition(
			fakeSlider,
			1,
			1,
			200,
		);

		expect(result.x).toBe(0);
		expect(result.y).toBe(82);
	});

	test('returns x as zero when value is not a number', () => {
		const result = SideControlsCalculationService.getThumbsPosition(
			fakeSlider,
			'quest!@#',
			1,
			200,
		);

		expect(result.x).toBe(0);
		expect(result.y).toBe(82);
	});

	test('returns x as 100 when value is greater than max value', () => {
		const result = SideControlsCalculationService.getThumbsPosition(
			fakeSlider,
			250,
			1,
			200,
		);

		expect(result.x).toBe(100);
		expect(result.y).toBe(82);
	});
});
/* !-- THUMB POSITION FUNCTION --!*/
