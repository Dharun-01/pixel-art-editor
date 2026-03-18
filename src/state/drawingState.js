import { restoreAutoSavedPicture } from '../app/services/autoSaveService.js';
import { Picture } from '../picture.js';
import { hexToRgb } from '../utils.js';
const autoSavedPicture = await restoreAutoSavedPicture();
export const initialDrawingState = {
	picture:
		autoSavedPicture || Picture.empty(1000, 400, hexToRgb('#ffffff'), 255),
	previewPicture: null,
	zoomLevel: 1,
};
