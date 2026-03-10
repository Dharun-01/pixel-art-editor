import { Picture } from '../picture.js';
import { hexToRgb } from '../utils.js';

export const initialDrawingState = {
	picture: Picture.empty(1000, 400, hexToRgb('#ffffff'), 255),
	previewPicture: null,
	zoomLevel: 1,
};
