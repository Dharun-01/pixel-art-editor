import { Picture } from './picture.js';
import { STAMP } from './stamps.js';

export function hexToRgb(hex) {
	let hexWithoutHash = hex.slice(1);

	if (hexWithoutHash.length === 3) {
		hexWithoutHash =
			hexWithoutHash[0] +
			hexWithoutHash[0] +
			hexWithoutHash[1] +
			hexWithoutHash[1] +
			hexWithoutHash[2] +
			hexWithoutHash[2];
	}

	return new Uint8ClampedArray([
		parseInt(hexWithoutHash.slice(0, 2), 16),
		parseInt(hexWithoutHash.slice(2, 4), 16),
		parseInt(hexWithoutHash.slice(4, 6), 16),
	]);
}

export function rgbToHsv(r, g, b) {
	// Normalize to 0-1
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	// --- Brightness (Value) ---
	const v = max; // 0-1

	// --- Saturation ---
	const s = max === 0 ? 0 : delta / max; // 0-1

	// --- Hue ---
	let h = 0;

	if (delta !== 0) {
		if (max === r) {
			h = ((g - b) / delta) % 6;
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else {
			// max === b
			h = (r - g) / delta + 4;
		}

		h *= 60; // convert to degrees

		if (h < 0) h += 360; // keep positive
	}

	return [Math.round(h), Math.round(s * 100), Math.round(v * 100)];
}

export function hexToHsv(hex) {
	const [r, g, b] = hexToRgb(hex);
	return rgbToHsv(r, g, b);
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

/* ---DRAW AXIS LINES HELPERS--- */
export function drawVerticalAxis(cx, startX, endX, startY, endY) {
	// Vertical axis line
	let midX = (startX + endX) / 2;
	cx.beginPath();
	cx.moveTo(midX, startY + 1);
	cx.lineTo(midX, endY + 1);
	cx.stroke();
}

export function drawHorizontalAxis(cx, startX, endX, startY, endY) {
	let midY = (startY + endY) / 2;
	// Horizontal axis line
	cx.beginPath();
	cx.moveTo(startX, midY);
	cx.lineTo(endX + 1, midY);
	cx.stroke();
}

export function drawMainDiagonalAxis(cx, startX, endX, startY, endY) {
	cx.beginPath();
	cx.moveTo(startX, startY);
	cx.lineTo(endX + 1, endY + 1);
	cx.stroke();
}

export function drawOffDiagonalAxis(cx, startX, endX, startY, endY) {
	cx.beginPath();
	cx.moveTo(endX, startY);
	cx.lineTo(startX, endY + 1);
	cx.stroke();
}

export function drawOrthogonalAxis(cx, startX, endX, startY, endY) {
	drawVerticalAxis(cx, startX, endX, startY, endY);
	drawHorizontalAxis(cx, startX, endX, startY, endY);
}

export function drawDiagonalAxis(cx, startX, endX, startY, endY) {
	drawMainDiagonalAxis(cx, startX, endX, startY, endY);
	drawOffDiagonalAxis(cx, startX, endX, startY, endY);
}
/* ---DRAW AXIS LINES HELPERS--- */

let axisDrawers = {
	vertical: drawVerticalAxis,
	horizontal: drawHorizontalAxis,
	mainDiagonal: drawMainDiagonalAxis,
	offDiagonal: drawOffDiagonalAxis,
	orthogonal: drawOrthogonalAxis,
	diagonal: drawDiagonalAxis,
};

/* Draws axis according to the mirror type */
export function drawAxisLines(cx, startX, startY, endX, endY, axis) {
	cx.strokeStyle = 'rgba(77, 163, 255, 1)';
	cx.lineWidth = 1;
	cx.imageSmoothingEnabled = false;

	axisDrawers[axis]?.(cx, startX, endX, startY, endY);
}

export function rgbToHex([r, g, b]) {
	return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

export function pointerPosition(pos, domNode, state) {
	let rect = domNode.getBoundingClientRect();
	let zoom = state.drawing.zoomLevel || 1;
	let x = Math.floor((pos.clientX - rect.left) / zoom);
	let y = Math.floor((pos.clientY - rect.top) / zoom);
	/* console.log('rect:', rect.left, rect.top);
	console.log('client:', pos.clientX, pos.clientY);
	console.log('zoom:', zoom);
	console.log(
		'result:',
		(pos.clientX - rect.left) / zoom,
		(pos.clientY - rect.top) / zoom,
	);
	console.log('x:' + x, 'y:' + y); */
	return {
		x,
		y,
	};
}

export function elt(type, props, ...children) {
	let dom;
	let svgElements = ['svg', 'path'];
	if (!svgElements.includes(type)) {
		dom = document.createElement(type);
		if (props) {
			Object.entries(props).forEach(([key, value]) => {
				if (key.startsWith('data-')) {
					dom.setAttribute(key, value);
				}
				Object.assign(dom, props);
			});
		} else {
			dom = document.createElementNS('http://www.w3.org/2000/svg', type);
			for (let [key, value] of Object.entries(props)) {
				dom.setAttribute(key, value);
			}
		}
	}

	for (let child of children) {
		if (typeof child != 'string') dom.appendChild(child);
		else dom.appendChild(document.createTextNode(child));
	}
	return dom;
}

export function drawBrushStamps(
	state,
	lastStampPos,
	pos,
	newPos,
	spacing,
	stamp,
	color,
	opacity,
) {
	const allStampedPoints = [];
	const startPos = lastStampPos || pos;

	const path = interpolateStampPosition(startPos, newPos, spacing);
	const mirroredPath = applyMirror(path, state);

	for (const stampPos of path) {
		const stampedPoints = applyStampAtPosition(
			stampPos,
			stamp,
			color,
			opacity,
			state,
		);
		allStampedPoints.push(...stampedPoints);
	}

	for (const mirroredStampPos of mirroredPath) {
		const mirroredStampedPoints = applyStampAtPosition(
			mirroredStampPos,
			stamp,
			color,
			opacity,
			state,
		);
		allStampedPoints.push(...mirroredStampedPoints);
	}
	return {
		allPoints: allStampedPoints,
		lastPos: path[path.length - 1] || newPos,
	};
}

export function drawShapeStamps(
	state,
	stamp,
	spacing,
	lastStampPos,
	pos,
	end,
	color,
	opacity,
	shape,
) {
	let allStampedPoints = [];
	let startPos = lastStampPos || pos;
	let path;
	if (shape === 'Symmetrical Circle')
		path = interpolateCircleStampPosition(startPos, end, spacing);
	else path = interpolateStampPosition(startPos, end, spacing);
	let mirroredPath = applyMirror(path, state);

	for (let stampPos of path) {
		let stampedPoints = applyStampAtPosition(
			stampPos,
			stamp,
			color,
			opacity,
			state,
		);
		allStampedPoints.push(...stampedPoints);
	}

	for (let mirroredStampPos of mirroredPath) {
		let mirroredStampedPoints = applyStampAtPosition(
			mirroredStampPos,
			stamp,
			color,
			opacity,
			state,
		);
		allStampedPoints.push(...mirroredStampedPoints);
	}

	return allStampedPoints;
}

export function interpolateCircleStampPosition(center, end, spacing) {
	let radius = Math.sqrt((end.x - center.x) ** 2 + (end.y - center.y) ** 2);
	let radiusC = Math.ceil(radius);
	let circumference = 2 * Math.PI * radiusC;
	let numPoints = Math.max(8, Math.ceil(circumference / spacing));
	let angleStep = (2 * Math.PI) / numPoints;
	const circlePositions = [];
	for (let i = 0; i < numPoints; i++) {
		let angle = i * angleStep;
		const x = center.x + Math.cos(angle) * radiusC;
		const y = center.y + Math.sin(angle) * radiusC;
		circlePositions.push({ x: Math.round(x), y: Math.round(y) });
	}

	return circlePositions;
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

export function customName(link) {
	let imageName = prompt('Save as');
	if (!imageName) {
		alert('Please Enter a Name');
		link.remove();
	} else return imageName;
}

export function applySize(points, state) {
	if (!state.tools.brushSize) return points;
	let result = [];
	for (let p of points) {
		for (let dx = 0; dx < state.tools.brushSize; dx++) {
			for (let dy = 0; dy < state.tools.brushSize; dy++) {
				result.push({
					x: p.x + dx,
					y: p.y + dy,
					color: p.color,
					opacity: p.opacity,
				});
			}
		}
	}
	return result;
}

export function calculateStampSpacing(state) {
	const brushType =
		state.tools.selectedBrush || state.tools.selectedShapeBrush || 'BRUSH';

	const spacingMap = {
		Pencil: 0.15,
		BRUSH: 0.25,
		CALLIGRAPHY_BRUSH: 0.005,
		CALLIGRAPHY_PEN: 0.005,
		AIRBRUSH: 0.1,
		OIL_BRUSH: 0.4,
		CRAYON: 0.5,
		MARKER: 0.005,
		NATURAL_PENCIL: 0.3,
		WATERCOLOR_BRUSH: 0.15,
	};
	const spacingRatio = spacingMap[brushType] || 0.15;
	return Math.max(1, state.tools.brushSize * spacingRatio);
}

export function interpolateStampPosition(from, to, spacing) {
	const positions = [];
	const dx = to.x - from.x;
	const dy = to.y - from.y;

	const dist = Math.sqrt(dx ** 2 + dy ** 2);

	// if dist is too small stamp once at the end
	if (dist < spacing / 2) return [to];

	// calculate no of stamps
	const numStamps = Math.ceil(dist / spacing);
	for (let i = 0; i <= numStamps; i++) {
		const t = i / numStamps;
		positions.push({
			x: Math.round(from.x + dx * t),
			y: Math.round(from.y + dy * t),
		});
	}
	return positions;
}

export function applyStampAtPosition(stampPos, stamp, color, opacity, state) {
	const stampedPoints = [];
	const finalOpacity = opacity / 100 || 1.0;
	for (const { dx, dy, opacity: stampOpacity } of stamp) {
		let x = Math.round(stampPos.x + dx);
		let y = Math.round(stampPos.y + dy);

		if (
			x < 0 ||
			x >= state.drawing.picture.width ||
			y < 0 ||
			y >= state.drawing.picture.height
		) {
			continue;
		}
		stampedPoints.push({ x, y, color, opacity: finalOpacity * stampOpacity });
	}

	return stampedPoints;
}

export function getPencilStamp(state) {
	const size = state.tools.brushSize || 3;
	return STAMP.pencil(size);
}

export function getBrushStamp(state) {
	let stamp;
	const brushType =
		state.tools.selectedBrush || state.tools.selectedShapeBrush || 'BRUSH';
	const size = state.tools.brushSize || 3;
	const opacity = state.tools.opacity / 100;
	const calligraphyBrushAngle = -45;
	const calligraphyPenAngle = 45;
	switch (brushType) {
		case 'Brush':
			stamp = STAMP.circle(size);
			break;
		case 'CALLIGRAPHY_BRUSH':
			stamp = STAMP.calligraphyBrush(size, calligraphyBrushAngle);
			break;
		case 'CALLIGRAPHY_PEN':
			stamp = STAMP.calligraphyPen(size, calligraphyPenAngle);
			break;
		case 'AIRBRUSH':
			stamp = STAMP.airbrush(size);
			break;
		case 'OIL_BRUSH':
			stamp = STAMP.oilBrush(size);
			break;
		case 'CRAYON':
			stamp = STAMP.crayon(size);
			break;
		case 'MARKER':
			stamp = STAMP.marker(size);
			break;
		case 'NATURAL PENCIL':
			stamp = STAMP.naturalPencil(size);
			break;
		case 'WATERCOLOR_BRUSH':
			stamp = STAMP.watercolorBrush(size);
			break;

		default:
			stamp = STAMP.circle(size, 1.0);
	}
	return stamp;
}

export function getStampedPoints(brushedPoints, stamp, state) {
	let stampedPoints = [];
	for (let point of brushedPoints) {
		for (let { dx, dy, opacity } of stamp) {
			let x = point.x + dx;
			let y = point.y + dy;
			stampedPoints.push({
				x: x,
				y: y,
				color: point.color,
				opacity: state.tools.opacity / 100 || opacity,
			});
		}
	}
	return stampedPoints;
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

export function flipVertical(state) {
	let { width, height, pixels } = state.picture;
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

export function flipHorizontal(state) {
	let { width, height, pixels } = state.picture;
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

export function reflectSelect(selectName, dispatch) {
	const splitName = selectName.split(' ');
	const reflectCheckbox = elt('input', {
		type: 'checkbox',
		id: selectName,
		onclick: (event) => {
			event.stopPropagation();
			dispatch({
				[`mirror${splitName[1]}`]: event.target.checked,
				toggleMirror: false,
			});
		},
	});

	const reflectOption = elt(
		'label',
		{ htmlFor: selectName },
		elt(
			'p',
			{
				className: 'p-1 min-w-52 hover:bg-custom-glass-black rounded-md',
			},
			elt(
				'div',
				{
					className: 'flex flex-row items-center justify-between',
				},
				selectName,
				elt(
					'label',
					{
						className: 'switch ',
					},
					reflectCheckbox,
					elt('span', { className: 'slider round' }),
				),
			),
		),
	);

	return { reflectCheckbox, reflectOption };
}

/* MIRROR UTILITIES */
function verticalMirrorType(state, p) {
	let mirroredX = state.drawing.picture.width - 1 - p.x;
	return [{ x: mirroredX, y: p.y, color: p.color, opacity: p.opacity }];
}

function horizontalMirrorType(state, p) {
	let mirroredY = state.drawing.picture.height - 1 - p.y;
	return [{ x: p.x, y: mirroredY, color: p.color, opacity: p.opacity }];
}

function mainDiagonalMirrorType(state, p) {
	let normalizedX = p.x / state.drawing.picture.width;
	let normalizedY = p.y / state.drawing.picture.height;
	let mirroredX = Math.round(normalizedY * state.drawing.picture.width);
	let mirroredY = Math.round(normalizedX * state.drawing.picture.height);

	mirroredX = Math.max(0, Math.min(state.drawing.picture.width - 1, mirroredX));
	mirroredY = Math.max(
		0,
		Math.min(state.drawing.picture.height - 1, mirroredY),
	);
	return [{ x: mirroredX, y: mirroredY, color: p.color, opacity: p.opacity }];
}

function offDiagonalMirrorType(state, p) {
	let normalizedX = p.x / state.drawing.picture.width;
	let normalizedY = p.y / state.drawing.picture.height;
	let mirroredX = Math.round((1 - normalizedY) * state.drawing.picture.width);
	let mirroredY = Math.round((1 - normalizedX) * state.drawing.picture.height);
	mirroredX = Math.max(0, Math.min(state.drawing.picture.width - 1, mirroredX));
	mirroredY = Math.max(
		0,
		Math.min(state.drawing.picture.height - 1, mirroredY),
	);
	return [{ x: mirroredX, y: mirroredY, color: p.color, opacity: p.opacity }];
}

function orthogonalMirrorType(state, p) {
	return [...verticalMirrorType(state, p), ...horizontalMirrorType(state, p)];
}

function diagonalMirrorType(state, p) {
	return [
		...mainDiagonalMirrorType(state, p),
		...offDiagonalMirrorType(state, p),
	];
}
/* MIRROR UTILITIES */

export function applyMirror(points, state) {
	let result = [];
	const axis = state.ui?.transform?.mirror?.axis;
	if (!axis) {
		return result;
	}

	const mirrorFunctions = {
		vertical: verticalMirrorType,
		horizontal: horizontalMirrorType,
		mainDiagonal: mainDiagonalMirrorType,
		offDiagonal: offDiagonalMirrorType,
		orthogonal: orthogonalMirrorType,
		diagonal: diagonalMirrorType,
	};

	const mirrorFn = mirrorFunctions[axis];
	const mirroredPoints = points.flatMap((p) => mirrorFn(state, p));
	result = [...mirroredPoints];
	return result;
}

export function resizePicture(state, newWidth, newHeight) {
	let newPicture = Picture.empty(newWidth, newHeight, hexToRgb('#f0f0f0'));
	let minWidth = Math.min(state.picture.width, newWidth);
	let minHeight = Math.min(state.picture.height, newHeight);
	for (let y = 0; y < minHeight; y++) {
		for (let x = 0; x < minWidth; x++) {
			let src = (y * state.picture.width + x) * 4;
			let dst = (y * newWidth + x) * 4;

			newPicture.pixels[dst] = state.picture.pixels[src];
			newPicture.pixels[dst + 1] = state.picture.pixels[src + 1];
			newPicture.pixels[dst + 2] = state.picture.pixels[src + 2];
			newPicture.pixels[dst + 3] = state.picture.pixels[src + 3];
		}
	}

	return newPicture;
}

export function drawLine(from, to, color, opacity) {
	let points = [];

	if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
		if (from.x > to.x) [from, to] = [to, from];
		let slope = (to.y - from.y) / (to.x - from.x);
		for (let { x, y } = from; x <= to.x; x++) {
			points.push({ x, y: Math.round(y), color, opacity });
			y += slope;
		}
	} else {
		if (from.y > to.y) [from, to] = [to, from];
		let slope = (to.x - from.x) / (to.y - from.y);
		for (let { x, y } = from; y <= to.y; y++) {
			points.push({ x: Math.round(x), y, color, opacity });
			x += slope;
		}
	}
	return points;
}
