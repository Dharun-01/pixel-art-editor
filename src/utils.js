import { Picture } from './picture.js';
import { STAMP } from './stamps.js';
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

export function drawAxisLines(cx, startX, startY, endX, endY, state) {
	cx.strokeStyle = 'rgba(77, 163, 255, 1)';
	cx.lineWidth = 1;
	cx.imageSmoothingEnabled = false;
	if (state.mirrorVertical) {
		// Vertical axis line
		let midX = (startX + endX) / 2;
		cx.beginPath();
		cx.moveTo(midX, startY + 1);
		cx.lineTo(midX, endY + 1);
		cx.stroke();
	}
	if (state.mirrorHorizontal) {
		let midY = (startY + endY) / 2;
		// Horizontal axis line
		cx.beginPath();
		cx.moveTo(startX, midY);
		cx.lineTo(endX + 1, midY);
		cx.stroke();
	}

	if (state.mirrorMainDiagonal) {
		cx.beginPath();
		cx.moveTo(startX, startY);
		cx.lineTo(endX + 1, endY + 1);
		cx.stroke();
	}

	if (state.mirrorOffDiagonal) {
		cx.beginPath();
		cx.moveTo(endX, startY);
		cx.lineTo(startX, endY + 1);
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
	console.log(spacing);
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
	if (shape === 'circle')
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

export function customName() {
	let imageName = prompt('Save as');
	if (!imageName) {
		alert('Please Enter a Name');
		link.remove();
	} else return imageName;
}

export function applySize(points, state) {
	/* 	let brushSize = 2;
	if (state.sketch == 'Marker') {
		if (state.tool === 'erase') {
			brushSize = 30;
		} else {
			brushSize = 3;
		}
	} else {
		if (state.tool === 'erase') brushSize = 20;
	} */

	if (!state.brushSize) return points;
	let result = [];
	for (let p of points) {
		for (let dx = 0; dx < state.brushSize; dx++) {
			for (let dy = 0; dy < state.brushSize; dy++) {
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
	const brushType = state.selectedBrush || state.selectedShapeBrush || 'Brush';

	const spacingMap = {
		Pencil: 0.15,
		Brush: 0.25,
		'Calligraphy brush': 0.005,
		'Calligraphy pen': 0.005,
		Airbrush: 0.1,
		'Oil brush': 0.4,
		Crayon: 0.5,
		Marker: 0.005,
		'Natural pencil': 0.3,
		'Watercolor brush': 0.15,
	};
	const spacingRatio = spacingMap[brushType] || 0.15;
	return Math.max(1, state.brushSize * spacingRatio);
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
			x >= state.picture.width ||
			y < 0 ||
			y >= state.picture.height
		) {
			continue;
		}
		stampedPoints.push({ x, y, color, opacity: finalOpacity * stampOpacity });
	}

	return stampedPoints;
}

export function getPencilStamp(state) {
	const size = state.brushSize || 3;
	return STAMP.pencil(size);
}

export function getBrushStamp(state) {
	let stamp;
	const brushType = state.selectedBrush || state.selectedShapeBrush || 'Brush';
	const size = state.brushSize || 3;
	const opacity = state.opacity / 100;
	const calligraphyBrushAngle = -45;
	const calligraphyPenAngle = 45;
	switch (brushType) {
		case 'Brush':
			stamp = STAMP.circle(size);
			break;
		case 'Calligraphy brush':
			stamp = STAMP.calligraphyBrush(size, calligraphyBrushAngle);
			break;
		case 'Calligraphy pen':
			stamp = STAMP.calligraphyPen(size, calligraphyPenAngle);
			break;
		case 'Airbrush':
			stamp = STAMP.airbrush(size);
			break;
		case 'Oil brush':
			stamp = STAMP.oilBrush(size);
			break;
		case 'Crayon':
			stamp = STAMP.crayon(size);
			break;
		case 'Marker':
			stamp = STAMP.marker(size);
			break;
		case 'Natural pencil':
			stamp = STAMP.naturalPencil(size);
			break;
		case 'Watercolor brush':
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
				opacity: state.opacity / 100 || opacity,
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

export function applyMirror(points, state) {
	let result = [];
	result = [...points];
	if (
		!state.mirrorVertical &&
		!state.mirrorHorizontal &&
		!state.mirrorMainDiagonal &&
		!state.mirrorOffDiagonal
	) {
		return result;
	}

	function mirroredPoint(p, mirrorType) {
		if (mirrorType === 'vertical') {
			let mirroredX = state.picture.width - 1 - p.x;
			return { x: mirroredX, y: p.y, color: p.color, opacity: p.opacity };
		}

		if (mirrorType === 'horizontal') {
			let mirroredY = state.picture.height - 1 - p.y;
			return { x: p.x, y: mirroredY, color: p.color, opacity: p.opacity };
		}

		if (mirrorType === 'mainDiagonal') {
			let normalizedX = p.x / state.picture.width;
			let normalizedY = p.y / state.picture.height;
			let mirroredX = Math.round(normalizedY * state.picture.width);
			let mirroredY = Math.round(normalizedX * state.picture.height);

			mirroredX = Math.max(0, Math.min(state.picture.width - 1, mirroredX));
			mirroredY = Math.max(0, Math.min(state.picture.height - 1, mirroredY));
			return { x: mirroredX, y: mirroredY, color: p.color, opacity: p.opacity };
		}

		if (mirrorType === 'offDiagonal') {
			let normalizedX = p.x / state.picture.width;
			let normalizedY = p.y / state.picture.height;
			let mirroredX = Math.round((1 - normalizedY) * state.picture.width);
			let mirroredY = Math.round((1 - normalizedX) * state.picture.height);
			mirroredX = Math.max(0, Math.min(state.picture.width, mirroredX));
			mirroredY = Math.max(0, Math.min(state.picture.height, mirroredY));
			return { x: mirroredX, y: mirroredY, color: p.color, opacity: p.opacity };
		}
	}

	const mirrorTypes = [];
	if (state.mirrorVertical) mirrorTypes.push('vertical');
	if (state.mirrorHorizontal) mirrorTypes.push('horizontal');
	if (state.mirrorMainDiagonal) mirrorTypes.push('mainDiagonal');
	if (state.mirrorOffDiagonal) mirrorTypes.push('offDiagonal');

	for (let mirrorType of mirrorTypes) {
		//collect mirrored points for current mirror type
		let mirroredPoints = points.map((p) => mirroredPoint(p, mirrorType));
		// add first point directly to result to avoid line drawing from last point of previous segment
		if (mirroredPoints.length > 0) {
			result.push(mirroredPoints[0]);
		}
		// draw lines between consecutive mirrored points
		for (let i = 1; i < mirroredPoints.length; i++) {
			let from = mirroredPoints[i - 1];
			let to = mirroredPoints[i];
			let linePoints = drawLine(from, to, from.color, from.opacity);
			result.push(...linePoints);
		}
	}
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
