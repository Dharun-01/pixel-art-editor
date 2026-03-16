import { Picture } from '../../picture';
import { elt } from '../../utils';

export class headerBarCalculationServices {
	static upload(dispatch, pictureW, pictureH) {
		let input = elt('input', {
			type: 'file',
			onchange: () => {
				headerBarCalculationServices.finishLoad(
					input.files[0],
					pictureW,
					pictureH,
					dispatch,
				);
				input.remove();
			},
		});
		document.body.appendChild(input);
		input.click();
	}

	static finishLoad(file, pictureW, pictureH, dispatch) {
		if (file == null) return;
		let reader = new FileReader();

		reader.addEventListener('load', () => {
			let image = new Image();
			image.onload = () => {
				dispatch({
					type: 'SET_PICTURE',
					isPreview: false,
					stringValue: headerBarCalculationServices.pictureFromImage(
						image,
						pictureW,
						pictureH,
					),
				});
			};
			image.src = reader.result;
		});
		reader.readAsDataURL(file);
	}

	static pictureFromImage(image, pictureW, pictureH) {
		let maxWidth = pictureW;
		let maxHeight = pictureH;
		/* let scaleX = Math.min(maxWidth / image.width, 1);
    let scaleY = Math.min(maxHeight / image.height, 1);
    let drawWidth = Math.round(image.width * scaleX);
    let drawHeight = Math.round(image.height * scaleY); */

		let canvas = elt('canvas', { width: maxWidth, height: maxHeight });
		let cx = canvas.getContext('2d');
		cx.imageSmoothingEnabled = true;
		cx.drawImage(image, 0, 0, maxWidth, maxHeight);
		let { data } = cx.getImageData(0, 0, maxWidth, maxHeight);
		const pixels = new Uint8ClampedArray(data);
		return new Picture(maxWidth, maxHeight, pixels);
	}

	/**
	 * @param {Picture} picture     - Picture object { width, height, pixels: Uint8ClampedArray }
	 * @param {string}  title       - Share title e.g. 'My Drawing'
	 * @param {string}  description - Share message/text e.g. 'Check out my pixel art!'
	 * @param {string}  filename    - File name without extension e.g. 'my-drawing'
	 * @param {string}  format      - 'png' | 'jpeg' | 'webp'
	 */
	static async share(
		picture,
		title = 'My Art',
		description = 'Check out my pixel art',
		fileName = 'drawing',
		format = 'png',
	) {
		const mimeMap = {
			png: 'image/png',
			jpeg: 'image/jpeg',
			jpg: 'image/jpeg',
			webp: 'image/webp',
		};

		const safeFormat = format in mimeMap ? format : 'png';
		let blob = await new Promise((resolve, reject) => {
			const srcCanvas = document.createElement('canvas');
			const srcCtx = srcCanvas.getContext('2d');
			srcCanvas.width = picture.width;
			srcCanvas.height = picture.height;

			const imageData = new ImageData(
				new Uint8ClampedArray(picture.pixels),
				picture.width,
				picture.height,
			);
			srcCtx.putImageData(imageData, 0, 0);

			const mimeType = mimeMap[safeFormat];
			const isLossy = mimeType === 'image/jpeg' || mimeType === 'image/webp';

			let shareCanvas = srcCanvas;

			if (mimeType === 'image/jpeg') {
				const flatCanvas = document.createElement('canvas');
				flatCanvas.width = shareCanvas.width;
				flatCanvas.height = shareCanvas.height;
				const flatCtx = flatCanvas.getContext('2d');
				flatCtx.fillStyle = '#ffffff';
				flatCtx.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
				flatCtx.drawImage(
					shareCanvas,
					0,
					0,
					shareCanvas.width,
					shareCanvas.height,
				);
				shareCanvas = flatCanvas;
			}

			shareCanvas.toBlob(
				(blob) => {
					if (blob) resolve(blob);
					else reject(new Error('toBlob Failed'));
				},
				mimeType,
				isLossy ? 0.92 : undefined,
			);
		});

		// The Web Share API requires FILES, not raw Blobs.
		// A File is a Blob with a name and last-modified date attached.
		//
		// new File(blobParts, filename, options)
		//   blobParts → array of Blob/ArrayBuffer/string parts — just wrap blob in []
		//   filename  → the filename the recipient sees e.g. 'my-drawing.png'
		//   options   → { type: mimeType } — tells the OS what kind of file this is
		//
		// Without the File wrapper, navigator.share({ files }) would not work —
		// it specifically requires File objects, not plain Blobs.

		const mimeType = blob.type; // e.g. 'image/png'
		const safeFileName = `${fileName}.${safeFormat}`;
		const file = new File([blob], safeFileName, { type: mimeType });

		/* check if share is supported in this browser using 'navigator.share' if supported check if FILES sharing are supported using 'navigator.canShare' */

		if (navigator.share && navigator.canShare?.({ files: [file] })) {
			// Opens the native OS share sheet — on mobile this is the same sheet
			// that appears when you hit share in any other app.
			//
			// Parameters:
			//   title → string — subject line / heading (not all targets use this)
			//   text  → string — message body (WhatsApp message, email body etc.)
			//   url   → string — a URL to share (optional, omit if sharing a file)
			//   files → File[] — array of File objects to attach
			//
			// You can mix files + url + text in one call.
			// title + text + files is the right combo for sharing an image.
			//
			// navigator.share() returns a Promise:
			//   resolves → user completed the share
			//   rejects  → user cancelled (AbortError) or something failed (NotAllowedError)
			//
			// CRITICAL CONSTRAINT — must be called from a user gesture (click handler).
			// If called from setTimeout, async chain that lost gesture context,
			// or programmatically without a click, it throws NotAllowedError.
			// Your share button's onclick directly calling this function satisfies this.
			//
			// Also requires HTTPS — won't work on http:// except localhost.

			try {
				await navigator.share({
					title: title || 'My Drawing',
					text: description || 'Check out my pixel art!',
					files: [file],
				});
			} catch (err) {
				// Two common errors from navigator.share():
				//
				// AbortError
				//   User cancelled the share sheet — closed it without selecting a target.
				//   This is normal user behaviour, not a bug. Don't show an error.
				//
				// NotAllowedError
				//   Called outside a user gesture, or on http:// (not https://).
				//   This is a code bug — fix the call site.
				//
				// Any other error → something unexpected went wrong, log it.

				if (err.name === 'AbortError') {
					console.log('User cancelled share');
				} else {
					console.error('Share failed:', err);
					alert(
						'Something went wrong... Press "Ok" for the File to be copied to clipboard.',
					);
					headerBarCalculationServices.fallbackShare(blob, safeFileName); // try fallback
				}
			}
		} else if (navigator.share) {
			try {
				await navigator.share({
					title: title || 'My Drawing',
					text: description || 'Check out my pixel art!',
					url: window.location.href,
				});
			} catch (err) {
				if (err.name !== 'AbortError') {
					alert(
						'Something went wrong... Press "Ok" for the url to be copied to clipboard.',
					);
					headerBarCalculationServices.fallbackShare(blob, safeFileName);
				}
			}
		} else {
			alert(
				'Sharing is not supported in this browser version Press "Ok" to clipboard the file',
			);
			headerBarCalculationServices.fallbackShare(blob, safeFileName);
		}
	}

	// ----FALLBACK----
	// When Web Share API is unavailable or fails, give the user two options:
	//
	// Option A — ClipboardItem API
	//   Copies the image directly to the clipboard so the user can paste it
	//   into WhatsApp Web, Discord, email, Slack etc.
	//
	//   new ClipboardItem({ mimeType: blob })
	//     Creates a clipboard item from a blob.
	//     The key is the MIME type, the value is the blob or a Promise<Blob>.
	//
	//   navigator.clipboard.write([item])
	//     Writes the item to the system clipboard.
	//     Returns a Promise — resolves on success, rejects if permission denied.
	//     Requires the page to be focused and HTTPS.
	//
	// Option B — trigger download
	//   If clipboard also fails, just download the file.
	//   At minimum the user has the image on disk and can share it manually.

	static async fallbackShare(blob, safeFileName) {
		try {
			const item = new ClipboardItem({ [blob.type]: blob });
			await navigator.clipboard.write([item]);
			alert('Image copied to clip board- paste it anywhere to share!');
		} catch (err) {
			alert('Clipboard failed Press "ok" to download the file');
			// clipboard failed — last resort is download
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = safeFileName;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
		}
	}

	/**
	 *
	 * @param {Object} picture
	 * @param {number} scale
	 * @param {number} quality
	 * @param {string} fileName
	 * @param {string} format
	 */
	static export(
		picture,
		scale = 10,
		quality = 85,
		fileName = 'drawing',
		format = 'png',
	) {
		// Convert raw picture pixels into a browser readable Image data object.
		const imageData = new ImageData(
			new Uint8ClampedArray(picture.pixels),
			picture.width,
			picture.height,
		);

		const srcCanvas = document.createElement('canvas');
		srcCanvas.width = picture.width;
		srcCanvas.height = picture.height;

		const srcCtx = srcCanvas.getContext('2d');
		srcCtx.putImageData(imageData, 0, 0);

		const safeScale = Number.isInteger(scale) && scale >= 1 ? scale : 1;

		let exportCanvas = srcCanvas;

		if (safeScale > 1) {
			exportCanvas = document.createElement('canvas');
			let exportCtx = exportCanvas.getContext('2d');
			exportCanvas.width = picture.width * scale;
			exportCanvas.height = picture.height * scale;
			exportCtx.imageSmoothingEnabled = false; // to enable sharp pixel drawing

			exportCtx.drawImage(
				srcCanvas,
				0,
				0,
				exportCanvas.width,
				exportCanvas.height,
			); // scaled canvas
		}

		// mime type mapping
		const mimeMap = {
			png: 'image/png',
			jpeg: 'image/jpeg',
			jpg: 'image/jpeg',
			webp: 'image/webp',
		};

		const safeFormat = format in mimeMap ? format : 'png';
		const mimeType = mimeMap[safeFormat];
		const isLossy = mimeType === 'image/jpeg' || mimeType === 'image/webp';
		const safeQuality = quality > 0 && quality < 1 ? quality : 0.92;

		if (mimeType === 'image/jpeg') {
			const flatCanvas = document.createElement('canvas');
			const flatCtx = flatCanvas.getContext('2d');
			flatCanvas.width = exportCanvas.width;
			flatCanvas.height = exportCanvas.height;
			flatCtx.fillStyle = '#ffffff';
			flatCtx.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
			flatCtx.drawImage(exportCanvas, 0, 0);
			exportCanvas = flatCanvas;
		}

		exportCanvas.toBlob(
			(blob) => {
				if (!blob) {
					console.error('exported Picture: toBlob Failed');
					return;
				}

				// Creates a temporary URL that points to the Blob in memory.
				// Format: 'blob:http://localhost:5173/550e8400-e29b-41d4-a716-446655440000'
				//
				// This URL only exists in the current browser tab — it cannot be shared
				// or accessed from another tab or device.
				//
				// IMPORTANT: every call creates a new URL and holds a reference to the blob
				// in memory. You MUST call URL.revokeObjectURL(url) when done to free memory.
				// If you forget, the blob stays in memory until the page is closed.
				const url = URL.createObjectURL(blob);

				const link = document.createElement('a');
				link.href = url;
				link.download = `${fileName}.${safeFormat}`;
				document.body.appendChild(link);
				link.click();
				link.remove();

				// Releases the memory held by the blob URL created in Step 8.
				// After this call the URL becomes invalid — if anything tries to
				// load it again it will get a 404.
				//
				// Safe to call immediately after click() because the browser has
				// already queued the download — revoking the URL doesn't cancel it.
				URL.revokeObjectURL(url);
			},
			mimeType,
			isLossy ? safeQuality : undefined,
		);
	}
}

export class headerBarUiUpdateServices {
	static getSliderGradient(
		value,
		activeColor = '#4DA3FF',
		inactiveColor = '#FFFFFF99',
	) {
		return `linear-gradient(to right, ${activeColor} ${value}%, ${inactiveColor} ${value}%)`;
	}

	static getThumbPosition(slider, value, min, max) {
		const rect = slider.getBoundingClientRect();
		const ratio = (value - min) / (max - min);
		let thumbWidth = 15;
		const x = ratio * slider.offsetWidth - thumbWidth / 2;
		const y = 0;

		return { x, y };
	}
}
