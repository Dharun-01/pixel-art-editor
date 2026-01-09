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
	cx.lineWidth = 1;
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

export function pointerPosition(pos, domNode, zoom) {
	let rect = domNode.getBoundingClientRect();
	return {
		x: Math.floor((pos.clientX - rect.left) * (domNode.width / rect.width)),
		y: Math.floor((pos.clientY - rect.top) * (domNode.width / rect.width)),
	};
}

export function updateState(state, action) {
	return { ...state, ...action };
}

export function elt(type, props, ...children) {
	let dom = document.createElement(type);
	if (props) Object.assign(dom, props);
	for (let child of children) {
		if (typeof child != 'string') dom.appendChild(child);
		else dom.appendChild(document.createTextNode(child));
	}
	return dom;
}
export function customName() {
	let imageName = prompt('Save as');
	if (!imageName) {
		alert('Please Enter a Name');
		link.remove();
	} else return imageName;
}
export function applyBrush(points, state) {
	let brushSize = null;
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
