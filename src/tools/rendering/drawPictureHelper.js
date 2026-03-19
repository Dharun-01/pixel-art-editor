export const offScreen = document.createElement('canvas');
const offCtx = offScreen.getContext('2d', { willReadFrequently: true });
const dpr = window.devicePixelRatio;

export function isFullRedraw(previous, picture, oldZoom, zoom) {
	const fullRedraw =
		previous == null ||
		previous.width != picture.width ||
		previous.height != picture.height ||
		oldZoom !== zoom;
	return fullRedraw;
}

export function updateCanvasProperties(canvas, oldZoom, picture, zoom) {
	canvas.width = picture.width * zoom * dpr;
	canvas.height = picture.height * zoom * dpr;
	canvas.style.width = picture.width * zoom + 'px';
	canvas.style.height = picture.height * zoom + 'px';
	oldZoom = zoom;
}

export function updateOffScreenCanvasDimensions(picture) {
	offScreen.width = picture.width;
	offScreen.height = picture.height;
}

export function updateImageDataForRedraw(picture, ImageData) {
	ImageData = offCtx.createImageData(picture.width, picture.height);
	offCtx.imageSmoothingEnabled = false;
	ImageData.data.set(picture.pixels);
	return ImageData;
}

export function canvasReset(
	previous,
	picture,
	canvas,
	oldZoom,
	ImageData,
	zoom,
) {
	let fullRedraw = isFullRedraw(previous, picture, oldZoom, zoom);
	if (fullRedraw) {
		updateCanvasProperties(canvas, oldZoom, picture, zoom);
		updateOffScreenCanvasDimensions(picture);
		const imageData = updateImageDataForRedraw(picture, ImageData);
		return { imageData, fullRedraw };
	}
	return { imageData: ImageData, fullRedraw };
}

export function dirtyRectCoordinates(picture, startX, startY, endX, endY) {
	startX = Math.max(0, picture.dirtyRect.minX);
	startY = Math.max(0, picture.dirtyRect.minY);
	endX = Math.min(picture.width - 1, picture.dirtyRect.maxX);
	endY = Math.min(picture.height - 1, picture.dirtyRect.maxY);
	return {
		dirtyStartX: startX,
		dirtyStartY: startY,
		dirtyEndX: endX,
		dirtyEndY: endY,
	};
}

export function dirtyCoordinatesInitialization(picture) {
	let startX = 0,
		startY = 0,
		endX = picture.width - 1,
		endY = picture.height - 1;

	let dirtyWidth = picture.width,
		dirtyHeight = picture.height;
	return { startX, startY, endX, endY, dirtyWidth, dirtyHeight };
}

export function updateImageDataLogic(
	picture,
	startX,
	startY,
	endX,
	endY,
	dirtyWidth,
	dirtyHeight,
	ImageData,
) {
	for (let y = startY; y <= endY; y++) {
		const rowStart = (y * picture.width + startX) * 4;
		const rowEnd = (y * picture.width + endX + 1) * 4;
		ImageData.data.set(picture.pixels.subarray(rowStart, rowEnd), rowStart);
	}
	dirtyWidth = endX - startX + 1;
	dirtyHeight = endY - startY + 1;

	return { updatedDirtyWidth: dirtyWidth, updatedDirtyHeight: dirtyHeight };
}

export function updateImageData(fullRedraw, picture, ImageData) {
	const { startX, startY, endX, endY, dirtyWidth, dirtyHeight } =
		dirtyCoordinatesInitialization(picture);

	if (!fullRedraw && picture.dirtyRect) {
		const { dirtyStartX, dirtyStartY, dirtyEndX, dirtyEndY } =
			dirtyRectCoordinates(picture, startX, startY, endX, endY);
		const { updatedDirtyWidth, updatedDirtyHeight } = updateImageDataLogic(
			picture,
			dirtyStartX,
			dirtyStartY,
			dirtyEndX,
			dirtyEndY,
			dirtyWidth,
			dirtyHeight,
			ImageData,
		);
		return {
			startX: dirtyStartX,
			startY: dirtyStartY,
			dirtyWidth: updatedDirtyWidth,
			dirtyHeight: updatedDirtyHeight,
		};
	}
	return {
		startX,
		startY,
		dirtyWidth,
		dirtyHeight,
	};
}

export function updateOffScreenData(picture, fullRedraw, ImageData) {
	const { startX, startY, dirtyWidth, dirtyHeight } = updateImageData(
		fullRedraw,
		picture,
		ImageData,
	);

	offCtx.putImageData(ImageData, 0, 0, startX, startY, dirtyWidth, dirtyHeight);

	return { startX, startY, dirtyWidth, dirtyHeight };
}

export function zoomCanvas(cx, zoom) {
	cx.setTransform(1, 0, 0, 1, 0, 0);
	cx.scale(zoom * dpr, zoom * dpr);
	cx.imageSmoothingEnabled = false;
}
