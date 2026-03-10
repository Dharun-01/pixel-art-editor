import {
	getBrushStamp,
	getPencilStamp,
	calculateStampSpacing,
	hexToRgb,
	elt,
	drawGridOnZoom,
	drawAxisLines,
	drawBrushStamps,
	drawShapeStamps,
	rotateLeft,
	rotateRight,
	rotate180,
	flipVertical,
	flipHorizontal,
} from './utils.js';
import { toolStarterCode } from './tools/utilities.js';
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
		ImageData.data.set(picture.pixels);
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

		for (let y = startY; y <= endY; y++) {
			const rowStart = (y * picture.width + startX) * 4;
			const rowEnd = (y * picture.width + endX + 1) * 4;
			ImageData.data.set(picture.pixels.subarray(rowStart, rowEnd), rowStart);
		}
		dirtyWidth = endX - startX + 1;
		dirtyHeight = endY - startY + 1;
	}

	offCtx.putImageData(ImageData, 0, 0, startX, startY, dirtyWidth, dirtyHeight);

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

export function pencil(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	let color = getColor();
	let opacity = getOpacity();
	let stampCache = null;
	let lastStampPos = null;
	if (!stampCache || state.brushSize !== stampCache.size) {
		stampCache = {
			stamp: getPencilStamp(state),
			size: state.brushSize,
		};
	}
	let stamp = stampCache.stamp;
	const spacing = calculateStampSpacing(state);
	function connect(newPos, state) {
		const result = drawBrushStamps(
			state,
			lastStampPos,
			pos,
			newPos,
			spacing,
			stamp,
			color,
			opacity,
		);
		dispatch({ picture: state.picture.draw(result.allPoints) });
		lastStampPos = result.lastPos;
		pos = newPos;
	}
	lastStampPos = null;
	connect(pos, state);
	return connect;
}

export function brush(
	pos,
	state,
	dispatch,
	getColor = () => state.tools.color,
	getOpacity = () => state.tools.opacity,
) {
	const { stamp, spacing, color, opacity, lastStampPos } = toolStarterCode(
		state,
		getColor,
		getOpacity,
	);
	function connect(newPos, state) {
		let result = drawBrushStamps(
			state,
			lastStampPos,
			pos,
			newPos,
			spacing,
			stamp,
			color,
			opacity,
		);
		dispatch({
			type: 'SET_PICTURE',
			stringValue: state.drawing.picture.draw(result.allPoints),
		});
		lastStampPos = result.lastPos;
		pos = newPos;
	}
	lastStampPos = null;
	connect(pos, state);
	return connect;
}

let stampCache = null;

export function line(
	pos,
	state,
	dispatch,
	getColor = () => state.tools.color,
	getOpacity = () => state.tools.opacity,
) {
	const { stamp, spacing, color, opacity, lastStampPos } = toolStarterCode(
		state,
		getColor,
		getOpacity,
	);

	let base = state.drawing.picture;
	return (end, state, isFinal) => {
		const result = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			pos,
			end,
			color,
			opacity,
			'line',
		);

		dispatch({
			type: 'SET_PICTURE',
			isPreview: !isFinal ? true : false,
			stringValue: base.draw(result),
		});
	};
}

export function triangle(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			shape: state.selectedShapeBrush,
			stamp: getBrushStamp(state),
		};
	}
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawTriangle(to) {
		let size = Math.max(Math.abs(to.x - pos.x), Math.abs(to.y - pos.y));
		let xStart = Math.min(pos.x, to.x);
		let yStart = Math.min(pos.y, to.y);
		let xEnd = Math.max(pos.x, to.x);
		let yEnd = Math.max(pos.y, to.y);
		let topVertex = { x: xStart, y: yStart };
		let bottomRightVertex = { x: xEnd, y: yEnd };
		let bottomLeftVertex = { x: xStart - size, y: yEnd };

		let resultRight = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			topVertex,
			bottomRightVertex,
			color,
			opacity,
			'triangle',
		);
		let resultBottom = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottomRightVertex,
			bottomLeftVertex,
			color,
			opacity,
			'triangle',
		);
		let resultLeft = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottomLeftVertex,
			topVertex,
			color,
			opacity,
			'triangle',
		);
		let result = [...resultRight, ...resultBottom, ...resultLeft];
		dispatch({ picture: state.picture.draw(result) });
	}
	drawTriangle(pos);
	return drawTriangle;
}

export function rightTriangle(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			shape: state.selectedShapeBrush,
			stamp: getBrushStamp(state),
		};
	}
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);

	function drawRightTriangle(to) {
		let topVertex = { x: pos.x, y: pos.y };
		let bottomRightVertex = { x: to.x, y: to.y };
		let bottomLeftVertex = { x: pos.x, y: to.y };
		let resultRight = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			topVertex,
			bottomRightVertex,
			color,
			opacity,
			'triangle',
		);
		let resultBottom = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottomRightVertex,
			bottomLeftVertex,
			color,
			opacity,
			'triangle',
		);
		let resultLeft = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottomLeftVertex,
			topVertex,
			color,
			opacity,
			'triangle',
		);
		let result = [...resultRight, ...resultBottom, ...resultLeft];
		dispatch({ picture: state.picture.draw(result) });
	}
	drawRightTriangle(pos);
	return drawRightTriangle;
}

export function rhombus(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			shape: state.selectedShapeBrush,
			stamp: getBrushStamp(state),
		};
	}
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawRhombus(to) {
		let size = Math.max(Math.abs(to.x - pos.x), Math.abs(to.y - pos.y));
		let top = { x: pos.x, y: pos.y - size };
		let right = { x: pos.x + size, y: pos.y };
		let bottom = { x: pos.x, y: pos.y + size };
		let left = { x: pos.x - size, y: pos.y };
		let topToRight = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			top,
			right,
			color,
			opacity,
			'rhombus',
		);
		let rightToBottom = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			right,
			bottom,
			color,
			opacity,
			'rhombus',
		);
		let bottomToLeft = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottom,
			left,
			color,
			opacity,
			'rhombus',
		);
		let leftToTop = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			left,
			top,
			color,
			opacity,
			'rhombus',
		);
		let result = [
			...topToRight,
			...rightToBottom,
			...bottomToLeft,
			...leftToTop,
		];
		/* // Draw four edges
		drawn.push(...drawLine(top, right, state.color, state.opacity, state));
		drawn.push(...drawLine(right, bottom, state.color, state.opacity, state));
		drawn.push(...drawLine(bottom, left, state.color, state.opacity, state));
		drawn.push(...drawLine(left, top, state.color, state.opacity, state));
		brushedPoints = applySize(drawn, state);
		mirroredPoints = applyMirror(brushedPoints, state); */
		dispatch({ picture: state.picture.draw(result) });
	}
	drawRhombus(pos);
	return drawRhombus;
}

export function rectangle(
	start,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);

	function drawRectangle(pos) {
		let xStart = Math.min(start.x, pos.x);
		let yStart = Math.min(start.y, pos.y);
		let xEnd = Math.max(start.x, pos.x);
		let yEnd = Math.max(start.y, pos.y);

		let resultTop = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			{ x: xStart, y: yStart },
			{ x: xEnd, y: yStart },
			color,
			opacity,
		);
		let resultBottom = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			{ x: xStart, y: yEnd },
			{ x: xEnd, y: yEnd },
			color,
			opacity,
		);
		let resultLeft = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			{ x: xStart, y: yStart },
			{ x: xStart, y: yEnd },
			color,
			opacity,
		);
		let resultRight = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			{ x: xEnd, y: yStart },
			{ x: xEnd, y: yEnd },

			color,
			opacity,
		);

		let allPoints = [
			...resultTop,
			...resultBottom,
			...resultLeft,
			...resultRight,
		];

		dispatch({ picture: state.picture.draw(allPoints) });
	}
	drawRectangle(start);
	return drawRectangle;
}

export function square(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawSquare(to) {
		let size = Math.max(Math.abs(to.x - pos.x), Math.abs(to.y - pos.y));
		let topLeftEdge = { x: pos.x, y: pos.y };
		let topRightEdge = { x: pos.x + size, y: pos.y };
		let bottomLeftEdge = { x: pos.x, y: pos.y + size };
		let bottomRightEdge = { x: pos.x + size, y: pos.y + size };
		let resultTop = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			topLeftEdge,
			topRightEdge,
			color,
			opacity,
		);
		let resultRight = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			topRightEdge,
			bottomRightEdge,
			color,
			opacity,
		);
		let resultBottom = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottomRightEdge,
			bottomLeftEdge,
			color,
			opacity,
		);
		let resultLeft = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			bottomLeftEdge,
			topLeftEdge,
			color,
			opacity,
		);
		let result = [...resultTop, ...resultRight, ...resultBottom, ...resultLeft];
		dispatch({ picture: state.picture.draw(result) });
	}
	drawSquare(pos);
	return drawSquare;
}

export function pentagon(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawPentagon(to) {
		const radius = Math.ceil(
			Math.sqrt((to.x - pos.x) ** 2, (to.y - pos.y) ** 2),
		);
		const sides = 5;
		const vertices = [];
		for (let i = 0; i < sides; i++) {
			let angle = (Math.PI * 2 * i) / sides - Math.PI / 2; // rotate upright
			vertices.push({
				x: Math.round(pos.x + radius * Math.cos(angle)),
				y: Math.round(pos.y + radius * Math.sin(angle)),
			});
		}

		const result = [];

		for (let i = 0; i < sides; i++) {
			let next = (i + 1) % sides;
			result.push(
				...drawShapeStamps(
					state,
					stamp,
					spacing,
					lastStampPos,
					vertices[i],
					vertices[next],
					color,
					opacity,
					'pentagon',
				),
			);
		}

		dispatch({ picture: state.picture.draw(result) });
	}
	drawPentagon(pos);
	return drawPentagon;
}
export function hexagon(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawHexagon(to) {
		const radius = Math.ceil(
			Math.sqrt((to.x - pos.x) ** 2, (to.y - pos.y) ** 2),
		);
		const sides = 6;
		const vertices = [];
		for (let i = 0; i < sides; i++) {
			let angle = (Math.PI * 2 * i) / sides - Math.PI / 2; // rotate upright
			vertices.push({
				x: Math.round(pos.x + radius * Math.cos(angle)),
				y: Math.round(pos.y + radius * Math.sin(angle)),
			});
		}

		const result = [];

		for (let i = 0; i < sides; i++) {
			let next = (i + 1) % sides;
			result.push(
				...drawShapeStamps(
					state,
					stamp,
					spacing,
					lastStampPos,
					vertices[i],
					vertices[next],
					color,
					opacity,
					'pentagon',
				),
			);
		}

		dispatch({ picture: state.picture.draw(result) });
	}
	drawHexagon(pos);
	return drawHexagon;
}

export function star(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawStar(to) {
		let outerRadius = Math.ceil(
			Math.sqrt(Math.pow(to.x - pos.x, 2), Math.pow(to.y - pos.y), 2),
		);
		let innerRadius = outerRadius * 0.4;
		let points = 5;
		let totalPoints = points * 2;
		let vertices = [];
		for (let i = 0; i < totalPoints; i++) {
			let angle = (2 * Math.PI * i) / totalPoints - Math.PI / 2;
			let r = i % 2 === 0 ? outerRadius : innerRadius;
			vertices.push({
				x: Math.round(pos.x + r * Math.cos(angle)),
				y: Math.round(pos.y + r * Math.sin(angle)),
			});
		}

		let result = [];

		for (let i = 0; i < totalPoints; i++) {
			let next = (i + 1) % totalPoints;
			result.push(
				...drawShapeStamps(
					state,
					stamp,
					spacing,
					lastStampPos,
					vertices[i],
					vertices[next],
					color,
					opacity,
					'star',
				),
			);
		}
		dispatch({ picture: state.picture.draw(result) });
	}
	drawStar(pos);
	return drawStar;
}

export function fourPointStar(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawFourPointStar(to) {
		let outerRadius = Math.ceil(
			Math.sqrt(Math.pow(to.x - pos.x, 2), Math.pow(to.y - pos.y), 2),
		);
		let innerRadius = outerRadius * 0.4;
		let points = 4;
		let totalPoints = points * 2;
		let vertices = [];
		for (let i = 0; i < totalPoints; i++) {
			let angle = (2 * Math.PI * i) / totalPoints - Math.PI / 2;
			let r = i % 2 === 0 ? outerRadius : innerRadius;
			vertices.push({
				x: Math.round(pos.x + r * Math.cos(angle)),
				y: Math.round(pos.y + r * Math.sin(angle)),
			});
		}

		let result = [];

		for (let i = 0; i < totalPoints; i++) {
			let next = (i + 1) % totalPoints;
			result.push(
				...drawShapeStamps(
					state,
					stamp,
					spacing,
					lastStampPos,
					vertices[i],
					vertices[next],
					color,
					opacity,
					'star',
				),
			);
		}
		dispatch({ picture: state.picture.draw(result) });
	}
	drawFourPointStar(pos);
	return drawFourPointStar;
}
export function sixPointStar(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}
	let lastStampPos = null;
	let color = getColor();
	let opacity = getOpacity();
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	function drawSixPointStar(to) {
		let outerRadius = Math.ceil(
			Math.sqrt(Math.pow(to.x - pos.x, 2), Math.pow(to.y - pos.y), 2),
		);
		let innerRadius = outerRadius * 0.4;
		let points = 6;
		let totalPoints = points * 2;
		let vertices = [];
		for (let i = 0; i < totalPoints; i++) {
			let angle = (2 * Math.PI * i) / totalPoints - Math.PI / 2;
			let r = i % 2 === 0 ? outerRadius : innerRadius;
			vertices.push({
				x: Math.round(pos.x + r * Math.cos(angle)),
				y: Math.round(pos.y + r * Math.sin(angle)),
			});
		}

		let result = [];

		for (let i = 0; i < totalPoints; i++) {
			let next = (i + 1) % totalPoints;
			result.push(
				...drawShapeStamps(
					state,
					stamp,
					spacing,
					lastStampPos,
					vertices[i],
					vertices[next],
					color,
					opacity,
					'star',
				),
			);
		}
		dispatch({ picture: state.picture.draw(result) });
	}
	drawSixPointStar(pos);
	return drawSixPointStar;
}

export function heart(
	pos,
	state,
	dispatch,
	getColor = () => state.color,
	getOpacity = () => state.opacity,
) {
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			size: state.brushSize,
			stamp: getBrushStamp(state),
			shape: state.selectedShapeBrush,
		};
	}

	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);
	let color = getColor();
	let opacity = getOpacity();
	let lastStampPos = null;

	function drawHeart(to) {
		let scale = Math.hypot(to.x - pos.x, to.y - pos.y) / 20;

		let vertices = [];
		let steps = 100; // more = smoother

		for (let i = 0; i <= steps; i++) {
			let t = (Math.PI * 2 * i) / steps;

			let x = 16 * Math.pow(Math.sin(t), 3);
			let y =
				13 * Math.cos(t) -
				5 * Math.cos(2 * t) -
				2 * Math.cos(3 * t) -
				Math.cos(4 * t);

			vertices.push({
				x: Math.round(pos.x + x * scale),
				y: Math.round(pos.y - y * scale), // invert Y
			});
		}

		let result = [];

		for (let i = 0; i < vertices.length - 1; i++) {
			let edge = drawShapeStamps(
				state,
				stamp,
				spacing,
				lastStampPos,
				vertices[i],
				vertices[i + 1],
				color,
				opacity,
				'heart',
			);
			result.push(...edge);
		}

		dispatch({ picture: state.picture.draw(result) });
	}

	drawHeart(pos);
	return drawHeart;
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

	let drawn = [{ x, y, color: state.color, opacity: state.opacity }];
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
				drawn.push({ x, y, color: state.color, opacity: state.opacity });
				visited.add(x + ',' + y);
			}
		}
	}
	dispatch({ picture: state.picture.draw(drawn), tool: 'pencil' });
}

export function circle(pos, state, dispatch) {
	let lastStampPos = null;
	if (
		!stampCache ||
		stampCache.size !== state.brushSize ||
		stampCache.shape !== state.selectedShapeBrush
	) {
		stampCache = {
			stamp: getBrushStamp(state),
			size: state.brushSize,
			shape: state.selectedShapeBrush,
		};
	}
	let color = state.color;
	let opacity = state.opacity;
	let stamp = stampCache.stamp;
	let spacing = calculateStampSpacing(state);

	function drawCircle(to) {
		const result = drawShapeStamps(
			state,
			stamp,
			spacing,
			lastStampPos,
			pos,
			to,
			color,
			opacity,
			'circle',
		);
		dispatch({ picture: state.picture.draw(result) });
	}
	drawCircle(pos);
	return drawCircle;
}

export function erase(pos, state, dispatch) {
	return pencil(pos, state, dispatch, () => hexToRgb('#f0f0f0'));
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
