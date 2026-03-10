export class CanvasSyncStateServices {
	/**
	 *
	 * @param {Object} previewPicture
	 * @returns boolean value whether it is a preview or not
	 */

	static isPreview(previewPicture) {
		return previewPicture !== null;
	}

	/**
	 *
	 * @param {Object} oldPicture
	 * @param {Object} newPicture
	 * @param {number} oldZoom
	 * @param {number} newZoom
	 * @param {boolean} isPreview
	 * @returns - boolean value saying whether picture or zoom is same or not.
	 */
	static isSamePictureOrZoom(
		oldPicture,
		newPicture,
		oldZoom,
		newZoom,
		isPreview,
		oldGrid,
		newGrid,
		oldMirrorAxis,
		newMirrorAxis,
	) {
		return (
			oldPicture === newPicture &&
			oldGrid === newGrid &&
			oldMirrorAxis === newMirrorAxis &&
			oldZoom === newZoom &&
			!isPreview
		);
	}
}
