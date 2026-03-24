import {
	ImageSelectFlipService,
	ImageSelectPercentageService,
	ImageSelectResizeService,
	ImageSelectRotateService,
	ImageSelectValidationService,
} from './ImageControlServices';
import { Picture } from '../../picture';

/* || TESTS FOR VALIDATION SERVICE */
describe('ImageValidationService', () => {
	test('returns invalid for empty string', () => {
		const result = ImageSelectValidationService.validateResizeInput(
			'width',
			'',
		);
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe('Input field cannot be empty');
	});

	test('returns invalid for NaN value', () => {
		const result = ImageSelectValidationService.validateResizeInput(
			'',
			'quest',
		);
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe('Input must be a number');
	});

	test('return invalid for number <= 0 ', () => {
		const result = ImageSelectValidationService.validateResizeInput('', '-2');
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe('Input must be greater than zero');
	});

	test('return valid for positive real numbers', () => {
		const result = ImageSelectValidationService.validateResizeInput('', '2');
		expect(result.isValid).toBe(true);
		expect(result.errorMessage).toBe('');
	});
});

/* !-- TESTS FOR VALIDATION SERVICE --! */

/* || TESTS FOR ROTATE SERVICES */

describe('ImageRotateService', () => {
	let picture;
	beforeEach(() => {
		const pixels = new Uint8ClampedArray([
			255,
			0,
			0,
			255, // top-left -> RED
			0,
			255,
			0,
			255, // top-right -> GREEN
			0,
			0,
			255,
			255, // bottom-left -> BLUE
			255,
			255,
			255,
			255, // bottom-right -> WHITE
		]);

		picture = new Picture(2, 2, pixels);
	});

	test('rotates top-left pixel to top-right', () => {
		const result = ImageSelectRotateService.rotateRight(picture);
		expect(result.pixels[4]).toBe(255); // RED TO BE tTOP-RIGHT PIXEL
		expect(result.pixels[9]).toBe(255); // GREEN TO BE BOTTOM RIGHT
		expect(result.pixels[2]).toBe(255); // BLUE TO BE TOP-LEFT
	});

	test('rotates top-left pixel to bottom-left pixel', () => {
		const result = ImageSelectRotateService.rotateLeft(picture);
		expect(result.pixels[8]).toBe(255); // RED TO BE BOTTOM-LEFT
		expect(result.pixels[1]).toBe(255); // GREEN TO BE TOP-LEFT
		expect(result.pixels[14]).toBe(255); // BLUE TO BE BOTTOM-RIGHT
	});

	test('rotate top-left pixel to bottom-right pixel ', () => {
		const result = ImageSelectRotateService.rotate180(picture);
		expect(result.pixels[11]).toBe(255); // RED TO BE BOTTOM-RIGHT
		expect(result.pixels[9]).toBe(255); // GREEN TO BE BOTTOM-LEFT
		expect(result.pixels[6]).toBe(255); // BLUE TO BE TOP-RIGHT
	});
});
/* !-- TESTS FOR ROTATE SERVICES --!*/

/* || TESTS FOR FLIP SERVICE */
describe('ImageFlipService', () => {
	let picture;

	beforeEach(() => {
		const pixels = new Uint8ClampedArray([
			255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 255,
		]);
		picture = new Picture(2, 2, pixels);
	});

	test('flipVertical mirrors pixels horizontally across vertical axis', () => {
		const result = ImageSelectFlipService.flipVertical(picture);
		expect(result.pixels[4]).toBe(255); // RED
		expect(result.pixels[8]).toBe(0); // BLACK
		expect(result.pixels[14]).toBe(255); // BLUE
		expect(result.pixels[1]).toBe(255); // GREEN
	});

	test('flipHorizontal mirrors pixels vertically across horizontal axis', () => {
		const result = ImageSelectFlipService.flipHorizontal(picture);
		expect(result.pixels[8]).toBe(255); // RED
		expect(result.pixels[2]).toBe(255); // BLUE
		expect(result.pixels[4]).toBe(0); // BLACK
		expect(result.pixels[13]).toBe(255); // GREEN
	});
});
/* !-- TESTS FOR FLIP SERVICE */

/* || TEST FOR VALUE TO PERCENTAGE CONVERSION SERVICE*/
describe('ImageSelectPercentageService', () => {
	test('return pixel if I pass unit as pixels', () => {
		const result = ImageSelectPercentageService.convertToPercentageIfNeeded(
			'width',
			100,
			'pixels',
			'1000x400',
		);
		expect(result).toBe(100);
	});

	test('return percentage of the old pixels if I pass unit as percentage', () => {
		const result = ImageSelectPercentageService.convertToPercentageIfNeeded(
			'width',
			300,
			'percentage',
			'1000x400',
		);
		expect(result).toBe(3000);
	});

	test('return original value if it is not a number or less than zero and the unit is percentage', () => {
		const result = ImageSelectPercentageService.convertToPercentageIfNeeded(
			'width',
			'quest',
			'percentage',
			'1000x400',
		);
		expect(result).toBe('quest');
	});

	test('return original value if the unit is pixels and the value is a not a number or less than zero', () => {
		const result = ImageSelectPercentageService.convertToPercentageIfNeeded(
			'width',
			'quest',
			'pixels',
			'1000x400',
		);
		expect(result).toBe('quest');
	});
});

/* !-- TEST FOR VALUE TO PERCENTAGE CONVERSION SERVICE --!*/

/* ||  TEST FOR RESIZE PICTURE SERVICE */
describe('ImageSelectResizeService', () => {
	let state;
	beforeEach(() => {
		const pixels = new Uint8ClampedArray([
			255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 255,
		]);

		state = {
			drawing: {
				picture: new Picture(2, 2, pixels),
			},
		};
	});

	test('verify dimensions', () => {
		const result = ImageSelectResizeService.resizePicture(state, 5, 5);
		// verify dimensions
		expect(result.width).toBe(5);
		expect(result.height).toBe(5);
		expect(result.pixels.length).toBe(100); // 5 * 5 * 4
	});

	test('verify original pixels were preserved in the top left', () => {
		const result = ImageSelectResizeService.resizePicture(state, 5, 5);
		// verify original pixels were preserved in top-left
		// RED pixel was at index 0 in original 2x2
		expect(result.pixels[0]).toBe(255); // R of RED — still there
		expect(result.pixels[1]).toBe(0); // G of RED — still there
		expect(result.pixels[2]).toBe(0); // B of RED — still there
	});

	test('verify new pixels outside the original are white', () => {
		const result = ImageSelectResizeService.resizePicture(state, 5, 5);
		// verify new pixels outside original area are white
		// pixel at x=4, y=4 is outside the original 2x2
		// index = (y * width + x) * 4 = (4 * 5 + 4) * 4 = 96
		expect(result.pixels[96]).toBe(255); // R — white
		expect(result.pixels[97]).toBe(255); // G — white
		expect(result.pixels[98]).toBe(255); // B — white
	});

	test('resizing smaller crops the picture', () => {
		const result = ImageSelectResizeService.resizePicture(state, 1, 1);
		expect(result.width).toBe(1);
		expect(result.height).toBe(1);
		expect(result.pixels.length).toBe(4); // 1 * 1 * 4
		expect(result.pixels[0]).toBe(255); // RED preserved
	});
});
/* !-- TEST FOR RESIZE PICTURE SERVICE --! */
