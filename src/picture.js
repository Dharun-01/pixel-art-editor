export class Picture {
	constructor(width, height, pixels) {
		this.width = width;
		this.height = height;
		this.pixels = pixels;
	}

	static empty(width, height, color, opacity) {
		let pixels = new Uint8ClampedArray(width * height * 4);
		for (let i = 0; i < pixels.length; i += 4) {
			const [r, g, b] = color;
			pixels[i] = r;
			pixels[i + 1] = g;
			pixels[i + 2] = b;
			pixels[i + 3] = opacity;
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

		for (let { x, y, color, opacity } of pixels) {
			let index = (x + y * this.width) * 4;
			const dstR = copy[index] / 255;
			const dstG = copy[index + 1] / 255;
			const dstB = copy[index + 2] / 255;
			const dstA = copy[index + 3] / 255;

			// Source pixel (brush)
			const srcR = color[0] / 255;
			const srcG = color[1] / 255;
			const srcB = color[2] / 255;
			const srcA = opacity;

			// Alpha composition (normal blend)
			const outA = srcA + dstA * (1 - srcA);
			if (outA > 0) {
				copy[index] = Math.round(
					((srcR * srcA + dstR * dstA * (1 - srcA)) / outA) * 255,
				);

				copy[index + 1] = Math.round(
					((srcG * srcA + dstG * dstA * (1 - srcA)) / outA) * 255,
				);

				copy[index + 2] = Math.round(
					((srcB * srcA + dstB * dstA * (1 - srcA)) / outA) * 255,
				);

				copy[index + 3] = Math.round(outA * 255);
			}

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
