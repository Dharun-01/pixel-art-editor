import {
	ImageSelectRotateService,
	ImageSelectValidationService,
} from './ImageControlServices';
import { Picture } from '../../picture';
import { beforeEach, describe, expect } from 'vitest';

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
