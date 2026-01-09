export class Picture {
	constructor(width, height, pixels) {
		this.width = width;
		this.height = height;
		this.pixels = pixels;
	}

	static empty(width, height, color) {
		let pixels = new Uint8ClampedArray(width * height * 4);
		for (let i = 0; i < pixels.length; i += 4) {
			const [r, g, b] = color;
			pixels[i] = r;
			pixels[i + 1] = g;
			pixels[i + 2] = b;
			pixels[i + 3] = 255;
		}

		return new Picture(width, height, pixels);
	}

	pixel(x, y) {
		let index = (x + y * this.width) * 4;
		return index;
	}

	draw(pixels) {
		let copy = new Uint8ClampedArray(this.pixels.length);
		copy.set(this.pixels);
		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity;

		for (let { x, y, color } of pixels) {
			let index = (x + y * this.width) * 4;
			copy[index] = color[0];
			copy[index + 1] = color[1];
			copy[index + 2] = color[2];
			copy[index + 3] = 255;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}

		let newPicture = new Picture(this.width, this.height, copy);
		newPicture.dirtyRect = { minX, minY, maxX, maxY };
		return newPicture;
	}
}
