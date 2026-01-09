import { elt, pointerPosition } from './utils.js';
import { drawPicture } from './tools.js';

export class PictureCanvas {
	constructor(picture, pointerDown, state) {
		this.dom = elt('canvas', {
			onmousedown: (event) => this.mouse(event, pointerDown, state),
			ontouchstart: (event) => this.touch(event, pointerDown, state),
			class: 'rounded-lg z-1',
		});
		this.dom.width = picture.width;
		this.dom.height = picture.height;
		this.cx = this.dom.getContext('2d', { willReadFrequently: true });
		this.ImageData = this.cx.createImageData(picture.width, picture.height);
		this.zoom = state.zoom;
		this.syncState(picture, state);
	}

	syncState(picture, state) {
		const isPreview = state.previewPicture != null;
		if (this.picture == picture && this.zoom == state.zoom && !isPreview)
			return;
		drawPicture(
			picture,
			this.dom,
			state.zoom,
			isPreview ? null : state.previewPicture,
			this.ImageData,
			this.cx
		);
		this.picture = picture;
		this.zoom = state.zoom;
	}
}

PictureCanvas.prototype.mouse = function (downEvent, onDown, state) {
	if (downEvent.button != 0) return;
	let pos = pointerPosition(downEvent, this.dom, state.zoom);
	let onMove = onDown(pos);
	if (!onMove) return;
	let up = (upEvent) => {
		const endPos = pointerPosition(upEvent, this.dom, state.zoom);
		try {
			onMove(endPos, state, true);
		} catch (error) {
			console.error(error);
		}
		this.dom.removeEventListener('mousemove', move);
		this.dom.removeEventListener('mouseup', up);
	};
	let move = (moveEvent) => {
		if (moveEvent.buttons == 0) {
			return;
		} else {
			let newPos = pointerPosition(moveEvent, this.dom, state.zoom);
			if (newPos.x == pos.x && newPos.y == pos.y) return;
			pos = newPos;
			onMove(newPos, state, false);
		}
	};
	this.dom.addEventListener('mouseup', up);
	this.dom.addEventListener('mousemove', move);
};

PictureCanvas.prototype.touch = function (startEvent, onDown, state) {
	let pos = pointerPosition(startEvent.touches[0], this.dom, state.zoom);
	let onMove = onDown(pos);
	startEvent.preventDefault();
	if (!onMove) return;
	let move = (moveEvent) => {
		let newPos = pointerPosition(moveEvent.touches[0], this.dom, state.zoom);
		if (newPos.x == pos.x && newPos.y == pos.y) return;
		pos = newPos;
		onMove(newPos, state, false);
	};

	let end = () => {
		// commit final position on touch end
		onMove(pos, state, true);
		this.dom.removeEventListener('touchmove', move);
		this.dom.removeEventListener('touchend', end);
	};
	this.dom.addEventListener('touchmove', move);
	this.dom.addEventListener('touchend', end);
};
