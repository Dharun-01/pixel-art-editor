export class SelectActivePictureService {
	static selectActivePicture(newState) {
		const isPreview = !!newState.drawing.previewPicture;
		return isPreview
			? newState.drawing.previewPicture
			: newState.drawing.picture;
	}
}
