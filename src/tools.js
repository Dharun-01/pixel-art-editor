import {
	drawLine,
	applyBrush,
	applyMirror,
	hexToRgb,
	elt,
	drawGridOnZoom,
	drawAxisLines,
	rotateLeft,
	rotateRight,
	rotate180,
	flipVertical,
	flipHorizontal,
} from './utils.js';

import { Picture } from './picture.js';

const offScreen = document.createElement('canvas');
const offCtx = offScreen.getContext('2d', { willReadFrequently: true });
const dpr = window.devicePixelRatio;
export function drawPicture(
	state,
	picture,
	canvas,
	zoom,
	previous,
	ImageData,
	cx,
) {
	const fullRedraw =
		previous == null ||
		previous.width != picture.width ||
		previous.height != picture.height ||
		canvas.zoom !== zoom;
	if (fullRedraw) {
		canvas.width = picture.width * zoom * dpr;
		canvas.height = picture.height * zoom * dpr;
		canvas.style.width = picture.width * zoom + 'px';
		canvas.style.height = picture.height * zoom + 'px';
		canvas.zoom = zoom;
		offScreen.width = picture.width;
		offScreen.height = picture.height;
		ImageData = offCtx.createImageData(picture.width, picture.height);
		offCtx.imageSmoothingEnabled = false;
		console.log(dpr);
	}

	/* console.log(
		canvas.width,
		canvas.height,
		canvas.getBoundingClientRect().width,
		canvas.getBoundingClientRect().height
	); */

	console.log('Canvas dimensions:', canvas.width, canvas.height);
	console.log('Canvas style:', canvas.style.width, canvas.style.height);
	console.log('Picture size:', picture.width, picture.height);
	console.log('Zoom:', zoom);

	let startX = 0,
		startY = 0,
		endX = picture.width - 1,
		endY = picture.height - 1;

	let dirtyWidth = picture.width,
		dirtyHeight = picture.height;

	if (!fullRedraw && picture.dirtyRect) {
		startX = Math.max(0, picture.dirtyRect.minX);
		startY = Math.max(0, picture.dirtyRect.minY);
		endX = Math.min(picture.width - 1, picture.dirtyRect.maxX);
		endY = Math.min(picture.height - 1, picture.dirtyRect.maxY);
		dirtyWidth = endX - startX + 1;
		dirtyHeight = endY - startY + 1;
	}

	ImageData.data.set(picture.pixels);
	offCtx.putImageData(ImageData, 0, 0);

	/* let zoomedX = startX;
	let zoomedY = startY;
	let zoomedWidth = dirtyWidth;
	let zoomedHeight = dirtyHeight; */

	/* cx.clearRect(zoomedX, zoomedY, zoomedWidth, zoomedHeight); */
	cx.setTransform(1, 0, 0, 1, 0, 0);
	cx.scale(zoom * dpr, zoom * dpr);
	cx.imageSmoothingEnabled = false;
	/* cx.clearRect(startX, startY, dirtyWidth, dirtyHeight); */

	cx.drawImage(
		offScreen,
		startX,
		startY,
		dirtyWidth,
		dirtyHeight,
		startX,
		startY,
		dirtyWidth,
		dirtyHeight,
	);

	if (state.toggleGrid) {
		drawGridOnZoom(cx, startX + 2, startY + 2, endX, endY);
	}

	if (
		state.mirrorVertical ||
		state.mirrorHorizontal ||
		state.mirrorMainDiagonal ||
		state.mirrorOffDiagonal
	) {
		drawAxisLines(cx, 0, 0, picture.width - 1, picture.height - 1, state);
	}
}

export function rotatedPicture(state, rotateDir) {
	if (rotateDir === 'left') return rotateLeft(state);
	if (rotateDir === 'right') return rotateRight(state);
	if (rotateDir === '180') return rotate180(state);
}
export function flippedPicture(state, flipDir) {
	if (flipDir === 'vertical') return flipVertical(state);
	if (flipDir === 'horizontal') return flipHorizontal(state);
}

export function draw(pos, state, dispatch, getColor = () => state.color) {
	function connect(newPos, state) {
		let brushedPoints, mirroredPoints;
		let color = getColor();
		console.log('Drawing at color: ' + color);
		let line = drawLine(pos, newPos, color, state);
		brushedPoints = applyBrush(line, state);
		mirroredPoints = applyMirror(brushedPoints, state);
		pos = newPos;

		dispatch({ picture: state.picture.draw(mirroredPoints) });
	}
	connect(pos, state);
	return connect;
}

export function line(pos, state, dispatch) {
	let base = state.picture;
	return (end, state, isFinal) => {
		let line = drawLine(pos, end, state.color);
		if (!isFinal)
			dispatch({
				isPreview: true,
				picture: base.draw(applyBrush(line, state)),
			});
		else
			dispatch({
				picture: base.draw(applyBrush(line, state)),
				isPreview: false,
			});
	};
}

export function rhombus(pos, state, dispatch) {
	function drawRhombus(to) {
		let size = Math.max(Math.abs(to.x - pos.x), Math.abs(to.y - pos.y));

		let drawn = [];

		// A rhombus has 4 edges connecting 4 vertices
		// Top vertex: (pos.x, pos.y - size)
		// Right vertex: (pos.x + size, pos.y)
		// Bottom vertex: (pos.x, pos.y + size)
		// Left vertex: (pos.x - size, pos.y)

		let top = { x: pos.x, y: pos.y - size };
		let right = { x: pos.x + size, y: pos.y };
		let bottom = { x: pos.x, y: pos.y + size };
		let left = { x: pos.x - size, y: pos.y };

		// Draw four edges
		drawn.push(...drawLine(top, right, state.color, state));
		drawn.push(...drawLine(right, bottom, state.color, state));
		drawn.push(...drawLine(bottom, left, state.color, state));
		drawn.push(...drawLine(left, top, state.color, state));

		dispatch({ picture: state.picture.draw(applyBrush(drawn, state)) });
	}
	drawRhombus(pos);
	return drawRhombus;
}

export function rectangle(start, state, dispatch) {
	function drawRectangle(pos) {
		let xStart = Math.min(start.x, pos.x);
		let yStart = Math.min(start.y, pos.y);
		let xEnd = Math.max(start.x, pos.x);
		let yEnd = Math.max(start.y, pos.y);
		let drawn = [];

		// Draw top and bottom edges
		for (let x = xStart; x <= xEnd; x++) {
			drawn.push({ x, y: yStart, color: state.color }); // Top edge
			drawn.push({ x, y: yEnd, color: state.color }); // Bottom edge
		}

		// Draw left and right edges (excluding corners to avoid duplicates)
		for (let y = yStart + 1; y < yEnd; y++) {
			drawn.push({ x: xStart, y, color: state.color }); // Left edge
			drawn.push({ x: xEnd, y, color: state.color }); // Right edge
		}

		dispatch({ picture: state.picture.draw(applyBrush(drawn, state)) });
	}
	drawRectangle(start);
	return drawRectangle;
}

let around = [
	{ dx: -1, dy: 0 },
	{ dx: 1, dy: 0 },
	{ dx: 0, dy: -1 },
	{ dx: 0, dy: 1 },
];

export function fill({ x, y }, state, dispatch) {
	let targetIndex1 = state.picture.pixel(x, y);
	let targetIndex2 = targetIndex1 + 1;
	let targetIndex3 = targetIndex1 + 2;
	let targetIndex4 = targetIndex1 + 3;

	let targetColor = new Uint8ClampedArray([
		state.picture.pixels[targetIndex1],
		state.picture.pixels[targetIndex2],
		state.picture.pixels[targetIndex3],
		state.picture.pixels[targetIndex4],
	]);

	let drawn = [{ x, y, color: state.color }];
	let visited = new Set();
	for (let done = 0; done < drawn.length; done++) {
		for (let { dx, dy } of around) {
			let x = drawn[done].x + dx,
				y = drawn[done].y + dy;
			let index = (x + y * state.picture.width) * 4;
			let pixelColor = new Uint8ClampedArray([
				state.picture.pixels[index],
				state.picture.pixels[index + 1],
				state.picture.pixels[index + 2],
				state.picture.pixels[index + 3],
			]);
			if (
				x >= 0 &&
				x < state.picture.width &&
				y >= 0 &&
				y < state.picture.height &&
				!visited.has(x + ',' + y) &&
				pixelColor[0] == targetColor[0] &&
				pixelColor[1] == targetColor[1] &&
				pixelColor[2] == targetColor[2] &&
				pixelColor[3] == targetColor[3]
			) {
				drawn.push({ x, y, color: state.color });
				visited.add(x + ',' + y);
			}
		}
	}
	dispatch({ picture: state.picture.draw(drawn), tool: 'draw' });
}

export function circle(pos, state, dispatch) {
	function drawCircle(to) {
		let radius = Math.sqrt((to.x - pos.x) ** 2 + (to.y - pos.y) ** 2);
		let radiusC = Math.ceil(radius);
		let drawn = [];

		// Thickness of the circle outline (in pixels)
		let thickness = 1;

		for (let dy = -radiusC; dy <= radiusC; dy++) {
			for (let dx = -radiusC; dx <= radiusC; dx++) {
				let dist = Math.sqrt(dx ** 2 + dy ** 2);

				// Only draw if distance is within the outline range
				if (dist > radius + thickness || dist < radius - thickness) continue;

				let y = pos.y + dy,
					x = pos.x + dx;
				if (
					y < 0 ||
					y >= state.picture.height ||
					x < 0 ||
					x >= state.picture.width
				)
					continue;
				drawn.push({ x, y, color: state.color });
			}
		}
		dispatch({ picture: state.picture.draw(applyBrush(drawn, state)) });
	}
	drawCircle(pos);
	return drawCircle;
}

export function erase(pos, state, dispatch) {
	return draw(pos, state, dispatch, () => hexToRgb('#f0f0f0'));
}

export function pick(pos, state, dispatch) {
	let index = state.picture.pixel(pos.x, pos.y);

	dispatch({
		color: new Uint8ClampedArray([
			state.picture.pixels[index],
			state.picture.pixels[index + 1],
			state.picture.pixels[index + 2],
			state.picture.pixels[index + 3],
		]),
	});
}

export function startLoad(dispatch) {
	let input = elt('input', {
		type: 'file',
		onchange: () => finishLoad(input.files[0], dispatch),
	});
	document.body.appendChild(input);
	input.click();
	input.remove();
}

function finishLoad(file, dispatch) {
	if (file == null) return;
	let reader = new FileReader();
	reader.addEventListener('load', () => {
		let image = elt('img', {
			onload: () =>
				dispatch({
					picture: pictureFromImage(image),
				}),
			src: reader.result,
		});
	});
	reader.readAsDataURL(file);
}

function pictureFromImage(image) {
	let maxWidth = 1000;
	let maxHeight = 400;
	/* let scaleX = Math.min(maxWidth / image.width, 1);
	let scaleY = Math.min(maxHeight / image.height, 1);
	let drawWidth = Math.round(image.width * scaleX);
	let drawHeight = Math.round(image.height * scaleY); */

	let canvas = elt('canvas', { width: maxWidth, maxHeight });
	let cx = canvas.getContext('2d');
	cx.imageSmoothingEnabled = true;
	cx.drawImage(image, 0, 0, maxWidth, maxHeight);
	let { data } = cx.getImageData(0, 0, maxWidth, maxHeight);
	const pixels = new Uint8ClampedArray(data);
	return new Picture(maxWidth, maxHeight, pixels);
}
