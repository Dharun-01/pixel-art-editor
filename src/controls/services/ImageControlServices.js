import { Picture } from '../../picture.js';

export class ImageSelectRotateService {
	static rotateRight(picture) {
		let { width, height, pixels } = picture;
		let newWidth = height;
		let newHeight = width;

		let newPixels = new Uint8ClampedArray(newWidth * newHeight * 4);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let src = (y * width + x) * 4;
				let newX = height - 1 - y;
				let newY = x;
				let dst = (newY * newWidth + newX) * 4;

				newPixels[dst] = pixels[src];
				newPixels[dst + 1] = pixels[src + 1];
				newPixels[dst + 2] = pixels[src + 2];
				newPixels[dst + 3] = pixels[src + 3];
			}
		}
		return new Picture(newWidth, newHeight, newPixels);
	}

	static rotateLeft(picture) {
		let { width, height, pixels } = picture;
		let newWidth = height;
		let newHeight = width;

		let newPixels = new Uint8ClampedArray(newWidth * newHeight * 4);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let src = (y * width + x) * 4;
				let newX = y;
				let newY = width - 1 - x;
				let dst = (newY * newWidth + newX) * 4;

				newPixels[dst] = pixels[src];
				newPixels[dst + 1] = pixels[src + 1];
				newPixels[dst + 2] = pixels[src + 2];
				newPixels[dst + 3] = pixels[src + 3];
			}
		}
		return new Picture(newWidth, newHeight, newPixels);
	}

	static rotate180(picture) {
		let { width, height, pixels } = picture;
		let newWidth = width;
		let newHeight = height;
		let newPixels = new Uint8ClampedArray(newWidth * newHeight * 4);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let src = (y * width + x) * 4;
				let newX = width - 1 - x;
				let newY = height - 1 - y;
				let dst = (newY * newWidth + newX) * 4;

				newPixels[dst] = pixels[src];
				newPixels[dst + 1] = pixels[src + 1];
				newPixels[dst + 2] = pixels[src + 2];
				newPixels[dst + 3] = pixels[src + 3];
			}
		}
		return new Picture(newWidth, newHeight, newPixels);
	}
}

export class ImageSelectFlipService {
	static flipVertical(picture) {
		let { width, height, pixels } = picture;
		let newWidth = width;
		let newHeight = height;
		let newPixels = new Uint8ClampedArray(newWidth * newHeight * 4);
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let src = (y * width + x) * 4;
				let newX = width - 1 - x;
				let newY = y;
				let dst = (newY * newWidth + newX) * 4;
				newPixels[dst] = pixels[src];
				newPixels[dst + 1] = pixels[src + 1];
				newPixels[dst + 2] = pixels[src + 2];
				newPixels[dst + 3] = pixels[src + 3];
			}
		}
		return new Picture(newWidth, newHeight, newPixels);
	}

	static flipHorizontal(picture) {
		let { width, height, pixels } = picture;
		let newWidth = width;
		let newHeight = height;
		let newPixels = new Uint8ClampedArray(newWidth * newHeight * 4);

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				let src = (y * width + x) * 4;
				let newX = x;
				let newY = height - 1 - y;
				let dst = (newY * newWidth + newX) * 4;
				newPixels[dst] = pixels[src];
				newPixels[dst + 1] = pixels[src + 1];
				newPixels[dst + 2] = pixels[src + 2];
				newPixels[dst + 3] = pixels[src + 3];
			}
		}
		return new Picture(newWidth, newHeight, newPixels);
	}
}

export class ImageSelectValidationService {
	static validateResizeInput(inputType, value) {
		const numberValue = Number(value);
		let isValid = true;
		let errorMessage = '';

		if (value.trim() === '') {
			isValid = false;
			errorMessage = 'Input field cannot be empty';
		} else if (isNaN(numberValue)) {
			isValid = false;
			errorMessage = 'Input must be a number';
		} else if (numberValue <= 0) {
			isValid = false;
			errorMessage = 'Input must be greater than zero';
		}
		return { isValid, errorMessage };
	}
}

export class ImageSelectPercentageService {
	static convertToPercentageIfNeeded(
		dimension,
		value,
		unit,
		oldCanvasDimension,
	) {
		let newValue = value;
		const [oldCanvasWidth, oldCanvasHeight] = oldCanvasDimension
			.split('x')
			.map(Number);

		if (unit === 'percentage') {
			const numberValue = Number(value);
			if (isNaN(numberValue) || numberValue <= 0) {
				return value; // Return original value if it's not a valid positive number
			}

			if (dimension === 'width') {
				newValue = (Number(value) / 100) * oldCanvasWidth;
			} else {
				newValue = (Number(value) / 100) * oldCanvasHeight;
			}
		}
		return newValue; // If unit is pixels, return the original value
	}
}

export class ImageSelectResizeService {
	static resizePicture(newState, newWidth, newHeight) {
		let newPixels = new Uint8ClampedArray(newWidth * newHeight * 4).fill(255);
		let minWidth = Math.min(newState.drawing.picture.width, newWidth);
		let minHeight = Math.min(newState.drawing.picture.height, newHeight);
		for (let y = 0; y < minHeight; y++) {
			for (let x = 0; x < minWidth; x++) {
				let src = (y * newState.drawing.picture.width + x) * 4;
				let dst = (y * newWidth + x) * 4;

				newPixels[dst] = newState.drawing.picture.pixels[src];
				newPixels[dst + 1] = newState.drawing.picture.pixels[src + 1];
				newPixels[dst + 2] = newState.drawing.picture.pixels[src + 2];
				newPixels[dst + 3] = newState.drawing.picture.pixels[src + 3];
			}
		}

		return new Picture(newWidth, newHeight, newPixels);
	}
}
