import {
	calculateStampSpacing,
	hexToRgb,
	interpolateCircleStampPosition,
	interpolateStampPosition,
	pointerPosition,
	rgbToHex,
	rgbToHsv,
	isDataAttribute,
	applyStampAtPosition,
	verticalMirrorType,
	horizontalMirrorType,
	mainDiagonalMirrorType,
	offDiagonalMirrorType,
	applyMirror,
} from './utils';

/* || TEST FOR HEX_TO_RGB and RGB_TO_HEX FUNCTIONS */
describe('verify whether rgb_to_hex and hex_to_rgb are inverses', () => {
	test('verify whether rgb_to_hex and hex_to_rgb are inverses', () => {
		const result = hexToRgb(rgbToHex([255, 255, 255]));
		expect(result[0]).toBe(255); // first number that I passed above
		expect(result[1]).toBe(255); // second number that I passed above
		expect(result[2]).toBe(255); // third number that I have passed above
	});
});
/* !-- TEST FOR HEX_TO_RGB and RGB_TO_HEX FUNCTIONS --! */

/* || TEST FOR RGB_TO_HSV */
describe('returns hsv value', () => {
	test('when delta value == 0', () => {
		const result = rgbToHsv(255, 255, 255);
		expect(result[0]).toBe(0); // hue value
		expect(result[1]).toBe(0); // saturation value
		expect(result[2]).toBe(100); // brightness value
	});

	test('when delta value !== 0', () => {
		const result = rgbToHsv(170, 255, 45); // random rgb value to test the delta branch
		expect(result[0]).toBe(84);
		expect(result[1]).toBe(82);
		expect(result[1]).toBe(82);
	});
});
/* !-- TEST FOR RGB_TO_HSV --! */

/* || TEST FOR CALCULATE STAMP SPACING FUNCTION */
describe('returns stamp space', () => {
	let createState = (selectedBrush, selectedShapeBrush, brushSize) => {
		return {
			tools: {
				selectedBrush: selectedBrush,
				selectedShapeBrush: selectedShapeBrush,
				brushSize: brushSize,
			},
		};
	};

	test('selectedBrush route test', () => {
		const result = calculateStampSpacing(createState('OIL_BRUSH', null, 10));
		expect(result).toBe(4);
	});

	test('selectedShapeBrush route test', () => {
		const result = calculateStampSpacing(createState(null, 'OIL_BRUSH', 10));
		expect(result).toBe(4);
	});

	test('default setting test', () => {
		const result = calculateStampSpacing(createState(null, null, 10));
		expect(result).toBe(2.5);
	});
});
/* !-- TEST FOR CALCULATE STAMP SPACING FUNCTION --!*/

/* ||  TEST FOR INTERPOLATE STAMP POSITION */
describe('Interpolate stamp position', () => {
	test('returns last position if distance is less than spacing', () => {
		const result = interpolateStampPosition({ x: 2, y: 3 }, { x: 3, y: 4 }, 3);
		expect(result[0].x).toBe(3);
	});

	test('returns points to be stamped', () => {
		const result = interpolateStampPosition(
			{ x: 1, y: 1 },
			{ x: 10, y: 10 },
			2,
		);

		// first stamp point
		expect(result[0].x).toBe(1);
		expect(result[0].y).toBe(1);

		// 2nd stamp point
		expect(result[1].x).toBe(2);
		expect(result[1].y).toBe(2);

		// last stamp point
		expect(result[result.length - 1].x).toBe(10);
		expect(result[result.length - 1].y).toBe(10);
	});
});
/* !--  TEST FOR INTERPOLATE STAMP POSITION --! */

/* || TEST FOR INTERPOLATE CIRCLE STAMP POSITION */
describe('Interpolate circle stamp position', () => {
	test('returns one stamp position', () => {
		const result = interpolateCircleStampPosition(
			{ x: 1, y: 1 },
			{ x: 1, y: 1 },
			5,
		);
		// length should be 1 and the one point returned should have 1 as the value for x, y
		expect(result.length).toBe(1);
		expect(result[0].x).toBe(1);
		expect(result[0].y).toBe(1);
	});

	test('returns circle stamp positions', () => {
		const result = interpolateCircleStampPosition(
			{ x: 10, y: 10 },
			{ x: 20, y: 20 },
			5,
		);

		// 6th stamp point in the circle given the above func params
		expect(result[5].x).toBe(9);
		expect(result[5].y).toBe(25);
	});
});
/* !-- TEST FOR INTERPOLATE CIRCLE STAMP POSITION --!*/

/* || TEST FOR POINTER POSITION FUNCTION */
describe('pointerPosition', () => {
	let fakeCanvas;

	let createState = (zoomLevel) => {
		return { drawing: { zoomLevel: zoomLevel } };
	};

	beforeEach(() => {
		fakeCanvas = {
			getBoundingClientRect: () => {
				return { left: 100, top: 50 };
			},
		};
	});
	test('returns x,y coords when zoom level equals 0 or null', () => {
		const result = pointerPosition(
			{ clientX: 300, clientY: 150 },
			fakeCanvas,
			createState(null),
		);

		expect(result.x).toBe(200);
		expect(result.y).toBe(100);
	});

	test('returns x, y coords when zoom > 0', () => {
		const result = pointerPosition(
			{ clientX: 300, clientY: 150 },
			fakeCanvas,
			createState(10),
		);

		expect(result.x).toBe(20);
		expect(result.y).toBe(10);
	});
});
/* !-- TEST FOR POINTER POSITION FUNCTION --! */

/* || TEST FOR ELT FUNCTION */
describe('elt function', () => {
	test('returns true if it is a data attribute', () => {
		const result = isDataAttribute('data-');
		expect(result).toBe(true);
	});

	test('returns false if data attribute is false', () => {
		const result = isDataAttribute('width');
		expect(result).toBe(false);
	});
});
/* !-- TEST FOR ELT FUNCTION --! */

/* || TEST FOR APPLY STAMP AT POSITION FUNCTION */

describe('Apply stamp at position', () => {
	let state, color;

	let createStamp = (dx, dy, opacity) => {
		return [{ dx: dx, dy: dy, opacity: opacity }];
	};

	let createStampPos = (x, y) => {
		return { x: x, y: y };
	};

	beforeEach(() => {
		color = new Uint8ClampedArray([255, 0, 0]);
		state = {
			drawing: {
				picture: {
					width: 1000,
					height: 400,
				},
			},
		};
	});

	test('returns stamp points when stamp is inside canvas', () => {
		const result = applyStampAtPosition(
			createStampPos(20, 20),
			createStamp(0, 0, 1.0),
			color,
			50, // normal opacity
			state,
		);
		expect(result.length).toBe(1);
		expect(result[0].x).toBe(20);
		expect(result[0].y).toBe(20);
		expect(result[0].color).toBe(color);
	});

	test('returns stamp points when opacity is zero or null', () => {
		const result = applyStampAtPosition(
			createStampPos(20, 20),
			createStamp(0, 0, 1.0),
			color,
			0,
			state,
		);
		expect(result[0].opacity).toBe(1.0);
	});

	test('returns no points when stampPos or stamp is outside the canvas', () => {
		const result = applyStampAtPosition(
			createStampPos(-20, -20),
			createStamp(0, 0, 1.0),
			color,
			0.5,
			state,
		);

		expect(result.length).toBe(0);
	});

	test('returns only points inside canvas bounds', () => {
		// stamp with two points — one inside, one outside
		const stamp = [
			{ dx: 0, dy: 0, opacity: 1.0 },
			{ dx: -25, dy: -25, opacity: 1.0 },
		];
		const result = applyStampAtPosition(
			createStampPos(20, 20),
			stamp,
			color,
			50,
			state,
		);
		expect(result.length).toBe(1); // only one point returned
	});
});
/* !-- TEST FOR APPLY STAMP AT POSITION FUNCTION --! */

/* || TEST FOR MIRROR FUNCTIONS */
describe('Mirror utilities', () => {
	let color;
	beforeEach(() => {
		color = new Uint8ClampedArray([255, 0, 0]);
	});

	let createState = (height, width) => {
		return {
			drawing: {
				picture: {
					width: width,
					height: height,
				},
			},
		};
	};
	test('returns vertically mirrored points', () => {
		const result = verticalMirrorType(createState(400, 100), {
			x: 20,
			y: 30,
			color: color,
			opacity: 1.0,
		});

		// coords check
		expect(result[0].x).toBe(79);
		expect(result[0].y).toBe(30);

		//color and opacity check
		expect(result[0].color).toBe(color);
		expect(result[0].opacity).toBe(1.0);
	});

	test('returns horizontally mirrored points', () => {
		const result = horizontalMirrorType(createState(400, 100), {
			x: 20,
			y: 30,
			color: color,
			opacity: 1.0,
		});

		// coords check
		expect(result[0].x).toBe(20);
		expect(result[0].y).toBe(369);

		//color and opacity check
		expect(result[0].color).toBe(color);
		expect(result[0].opacity).toBe(1.0);
	});

	test('returns main diagonal points', () => {
		const result = mainDiagonalMirrorType(createState(100, 100), {
			x: 20,
			y: 30,
			color: color,
			opacity: 1.0,
		});

		// coords check
		expect(result[0].x).toBe(30);
		expect(result[0].y).toBe(20);

		// color and opacity check
		expect(result[0].color).toBe(color);
		expect(result[0].opacity).toBe(1.0);
	});

	test('returns off diagonal points', () => {
		const result = offDiagonalMirrorType(createState(100, 100), {
			x: 20,
			y: 30,
			color: color,
			opacity: 1.0,
		});

		// coords check
		expect(result[0].x).toBe(70);
		expect(result[0].y).toBe(80);

		// color and opacity check
		expect(result[0].color).toBe(color);
		expect(result[0].opacity).toBe(1.0);
	});
});

describe('Apply mirror function', () => {
	let color;
	beforeEach(() => {
		color = new Uint8ClampedArray([255, 0, 0]);
	});

	let createState = (axis, width, height) => {
		return {
			drawing: {
				picture: {
					width: width,
					height: height,
				},
			},
			ui: {
				transform: {
					mirror: {
						axis: axis,
					},
				},
			},
		};
	};

	test('returns nothing when axis equals 0 or null', () => {
		const result = applyMirror(
			[
				{
					x: 20,
					y: 30,
					color: color,
					opacity: 1.0,
				},
			],
			createState(null),
		);

		expect(result.length).toBe(0);
	});

	test('returns mirrored points when given right points', () => {
		const result = applyMirror(
			[
				{
					x: 20,
					y: 30,
					color: color,
					opacity: 1.0,
				},
			],
			createState('vertical', 100, 100),
		); // took vertical axis as an example no need for this test case because I tested the mirror utilities already.

		expect(result[0].x).toBe(79);
	});
});
/* !-- TEST FOR MIRROR FUNCTIONS --!*/
