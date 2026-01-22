import { Picture } from './picture.js';

export function hexToRgb(hex) {
	let hexWithoutHash = hex.slice(1);
	return new Uint8ClampedArray([
		parseInt(hexWithoutHash.slice(0, 2), 16),
		parseInt(hexWithoutHash.slice(2, 4), 16),
		parseInt(hexWithoutHash.slice(4, 6), 16),
	]);
}

export function drawGridOnZoom(cx, startX, startY, endX, endY) {
	cx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
	cx.lineWidth = 0.1;
	cx.imageSmoothingEnabled = false;

	// Vertical line
	for (let x = startX; x <= endX; x += 10) {
		cx.beginPath();
		cx.moveTo(x, startY);
		cx.lineTo(x, endY + 1);
		cx.stroke();
	}

	// Horizontal line
	for (let y = startY; y <= endY; y += 10) {
		cx.beginPath();
		cx.moveTo(startX, y);
		cx.lineTo(endX + 1, y);
		cx.stroke();
	}
}

export function rgbToHex([r, g, b]) {
	return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

export function pointerPosition(pos, domNode, state) {
	let rect = domNode.getBoundingClientRect();
	let zoom = domNode.zoom || 1;
	let x = Math.floor((pos.clientX - rect.left) / zoom);
	let y = Math.floor((pos.clientY - rect.top) / zoom);
	/* console.log('=== POINTER POSITION DEBUG ===');
	console.log('Click clientX, clientY:', pos.clientX, pos.clientY);
	console.log('Rect left, top:', rect.left, rect.top);
	console.log('Rect width, height:', rect.width, rect.height);
	console.log('domNode.zoom:', domNode.zoom);
	console.log('Actual canvas width, height:', domNode.width, domNode.height);
	console.log(
		'Canvas style width, height:',
		domNode.style.width,
		domNode.style.height,
	);
	console.log('Calculated x, y:', x, y);
	console.log('=============================='); */
	return {
		x,
		y,
	};
}

export function updateState(state, action) {
	return { ...state, ...action };
}

export function elt(type, props, ...children) {
	let dom;
	let svgElements = ['svg', 'path'];
	if (!svgElements.includes(type)) {
		dom = document.createElement(type);
		if (props) Object.assign(dom, props);
	} else {
		dom = document.createElementNS('http://www.w3.org/2000/svg', type);
		for (let [key, value] of Object.entries(props)) {
			dom.setAttribute(key, value);
		}
	}

	for (let child of children) {
		if (typeof child != 'string') dom.appendChild(child);
		else dom.appendChild(document.createTextNode(child));
	}
	return dom;
}

export function iconDownloader(...iconProps) {
	let svgProperties = {
		xmlns: iconProps[0],
		height: iconProps[1],
		viewBox: iconProps[2],
		width: iconProps[3],
		fill: iconProps[4],
	};
	return svgProperties;
}

export function customName() {
	let imageName = prompt('Save as');
	if (!imageName) {
		alert('Please Enter a Name');
		link.remove();
	} else return imageName;
}

export function applyBrush(points, state) {
	let brushSize = 2;
	if (state.sketch == 'Marker') {
		if (state.tool === 'erase') {
			brushSize = 30;
		} else {
			brushSize = 3;
		}
	} else {
		if (state.tool === 'erase') brushSize = 20;
	}

	if (!brushSize) return points;
	let result = [];
	for (let p of points) {
		for (let dx = 0; dx < brushSize; dx++) {
			for (let dy = 0; dy < brushSize; dy++) {
				result.push({ x: p.x + dx, y: p.y + dy, color: p.color });
			}
		}
	}
	return result;
}

export function rotateLeft(state) {
	let { width, height, pixels } = state.picture;
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

export function rotateRight(state) {
	let { width, height, pixels } = state.picture;
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

export function rotate180(state) {
	let { width, height, pixels } = state.picture;
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

export function drawLine(from, to, color) {
	let points = [];

	if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
		if (from.x > to.x) [from, to] = [to, from];
		let slope = (to.y - from.y) / (to.x - from.x);
		for (let { x, y } = from; x <= to.x; x++) {
			points.push({ x, y: Math.round(y), color });
			y += slope;
		}
	} else {
		if (from.y > to.y) [from, to] = [to, from];
		let slope = (to.x - from.x) / (to.y - from.y);
		for (let { x, y } = from; y <= to.y; y++) {
			points.push({ x: Math.round(x), y, color });
			x += slope;
		}
	}
	return points;
}
