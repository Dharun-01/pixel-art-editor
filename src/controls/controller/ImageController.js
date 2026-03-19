import { ImageSelectView } from '../view/ImageView.js';

import {
	ImageSelectRotateService,
	ImageSelectFlipService,
	ImageSelectValidationService,
	ImageSelectPercentageService,
	ImageSelectResizeService,
} from '../services/ImageControlServices';

export class ImageSelectController {
	constructor(state, { dispatch, canvasEl }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new ImageSelectView(this.createHandlers());
		this.dom = this.view.dom;
		this.canvasEl = canvasEl;
		this.syncState(state);
	}

	/* HANDLER CREATION */
	createHandlers() {
		return {
			// Rotate handlers
			onRotateClick: () => this.handleToggle('rotate'),
			onRotateRight: () => this.handleRotateDirection('right'),
			onRotateLeft: () => this.handleRotateDirection('left'),
			onRotate180: () => this.handleRotateDirection('180'),

			// Flip handlers
			onFlipClick: () => this.handleToggle('flip'),
			onFlipVertical: () => this.handleFlipDirection('vertical'),
			onFlipHorizontal: () => this.handleFlipDirection('horizontal'),

			// Mirror handlers
			onMirrorClick: () => this.handleToggle('mirror'),
			onReflectVertical: () => this.handleReflectAxis('vertical'),
			onReflectHorizontal: () => this.handleReflectAxis('horizontal'),
			onReflectMainDiagonal: () => this.handleReflectAxis('mainDiagonal'),
			onReflectOffDiagonal: () => this.handleReflectAxis('offDiagonal'),
			onReflectOrthogonal: () => this.handleReflectAxis('orthogonal'),
			onReflectDiagonal: () => this.handleReflectAxis('diagonal'),

			// Resize handlers
			onResizeClick: () => this.handleToggle('resize'),
			onUnitChange: (booleanValue, unit) =>
				this.handleUnitChange(booleanValue, unit),
			onWidthChange: (eventValue) => this.handleDimensions('width', eventValue),
			onHeightChange: (eventValue) =>
				this.handleDimensions('height', eventValue),
			onLinkClick: () => this.handleLink(),
			onSave: () => this.handleSave(),
			onCancel: () => this.handleCancel(),

			onGridClick: () => this.handleGridClick(),
		};
	}

	// ═══════════════════════════════════════
	//               EVENT HANDLERS
	// ═══════════════════════════════════════

	openPopup(featureName) {
		// If already open, close it
		if (this.state.ui.transform.activeMode === featureName) {
			this.dispatch({ type: 'SET_TRANSFORM_MODE', stringValue: null });
			return;
		}

		this.dispatch({ type: 'SET_TRANSFORM_MODE', stringValue: featureName });

		const onOutsideClick = (event) => {
			if (featureName === 'resize') {
				if (event.target.closest(`[data-popup="${featureName}"]`)) return;
			}
			this.dispatch({ type: 'SET_TRANSFORM_MODE', stringValue: null });
			document.removeEventListener('click', onOutsideClick);
		};

		setTimeout(() => document.addEventListener('click', onOutsideClick), 0);
	}

	handleToggle(featureName) {
		this.openPopup(featureName);
	}

	/* handleToggle(featureName) {
		this.dispatch({ type: 'SET_TRANSFORM_MODE', stringValue: featureName });
		/* 	document.addEventListener('click', () => {
			this.dispatch({ type: 'SET_TRANSFORM_MODE', stringValue: null });
		}); */
	//}

	handleGridClick() {
		this.dispatch({ type: 'SET_GRID' });
	}

	animateRotate(direction, onMidpoint) {
		const canvas = this.canvasEl;
		const duration = 150;

		canvas.style.transition = `transform ${duration}ms ease-in-out`;

		const angle = direction === 'right' ? 90 : direction === 'left' ? -90 : 180;

		// phase 1 — rotate canvas visually to flat or angle
		canvas.style.transform = `rotateZ(${angle}deg)`;

		setTimeout(() => {
			//  reset transform BEFORE dispatch — canvas shows old pixels at 0deg
			canvas.style.transition = 'none';
			canvas.style.transform = 'rotateZ(0deg)';

			requestAnimationFrame(() => {
				// NOW dispatch — canvas redraws with new pixels at 0deg
				onMidpoint();

				requestAnimationFrame(() => {
					// re-enable transition for next animation
					canvas.style.transition = `transform ${duration}ms ease-in-out`;
				});
			});
		}, duration);
	}

	handleRotateDirection(direction) {
		const serviceMap = {
			right: () =>
				ImageSelectRotateService.rotateRight(this.state.drawing.picture),
			left: () =>
				ImageSelectRotateService.rotateLeft(this.state.drawing.picture),
			180: () => ImageSelectRotateService.rotate180(this.state.drawing.picture),
		};

		// compute rotated picture before animation
		const rotatedPicture = serviceMap[direction]?.();
		if (!rotatedPicture) return;

		this.animateRotate(direction, () => {
			// all dispatches inside the callback — fire at midpoint
			this.dispatch({ type: 'SET_ROTATE_DIRECTION', stringValue: direction });
			this.dispatch({
				type: 'SET_PICTURE',
				stringValue: rotatedPicture,
				isPreview: false,
			});
		});
	}

	/* Animation for Flip */
	animateFlip(axis, onMidpoint) {
		const canvas = this.canvasEl;
		const duration = 150;

		// flatten
		canvas.style.transition = `transform ${duration}ms ease-in-out`;
		canvas.style.transform = axis === 'vertical' ? 'scaleX(0)' : 'scaleY(0)';

		setTimeout(() => {
			onMidpoint(); // dispatch the actual flip

			// requestAnimationFrame ensures the new picture is painted
			// before we start the open animation
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					canvas.style.transform = 'scale(1)'; // open back up
				});
			});
		}, duration);
	}

	handleFlipDirection(direction) {
		if (direction === 'vertical') {
			this.animateFlip('vertical', () => {
				let flippedPicture = ImageSelectFlipService.flipVertical(
					this.state.drawing.picture,
				);
				this.dispatch({ type: 'SET_FLIP_DIRECTION', stringValue: direction });
				this.dispatch({
					type: 'SET_PICTURE',
					stringValue: flippedPicture,
					isPreview: false,
				});
			});
		} else {
			this.animateFlip('horizontal', () => {
				let flippedPicture = ImageSelectFlipService.flipHorizontal(
					this.state.drawing.picture,
				);
				this.dispatch({ type: 'SET_FLIP_DIRECTION', stringValue: direction });
				this.dispatch({
					type: 'SET_PICTURE',
					stringValue: flippedPicture,
					isPreview: false,
				});
			});
		}
	}

	handleReflectAxis(axis) {
		const currentAxis = this.state.ui.transform.mirror.axis;
		const newAxis = currentAxis === axis ? null : axis;
		this.dispatch({ type: 'SET_MIRROR_AXIS', stringValue: newAxis });
	}

	handleUnitChange(booleanValue, unit) {
		this.dispatch({ type: 'SET_RESIZE_UNIT', stringValue: unit });
	}

	handleDimensions(dimension, value) {
		const { isValid, errorMessage } =
			ImageSelectValidationService.validateResizeInput(dimension, value);

		const error = isValid ? null : errorMessage;

		// Always update error for current dimension
		this.dispatch({
			type: `SET_RESIZE_${dimension.toUpperCase()}_ERROR`,
			stringValue: error,
		});

		this.dispatch({
			type: `SET_RESIZE_${dimension.toUpperCase()}`,
			stringValue: value,
		});
	}

	handleLink() {
		this.dispatch({ type: 'SET_LINKED_INPUTS' });
	}

	handleSave() {
		const { width, height, widthErrorMessage, heightErrorMessage, unit } =
			this.state.ui.transform.resize;

		if (!width || !height || widthErrorMessage || heightErrorMessage) return;

		// Convert here, once, at save time
		const processedWidth =
			ImageSelectPercentageService.convertToPercentageIfNeeded(
				'width',
				width,
				unit,
				this.state.ui.canvas,
			);
		const processedHeight =
			ImageSelectPercentageService.convertToPercentageIfNeeded(
				'height',
				height,
				unit,
				this.state.ui.canvas,
			);

		// Guard: only save if both valid
		if (!width || !height || widthErrorMessage || heightErrorMessage) return;

		const newWidth = Math.round(Number(processedWidth));
		const newHeight = Math.round(Number(processedHeight));

		const resizedPicture = ImageSelectResizeService.resizePicture(
			this.state,
			newWidth,
			newHeight,
		);

		this.dispatch({
			type: 'SET_CANVAS_DIMENSIONS',
			stringValue: `${newWidth}x${newHeight}`,
		});

		this.dispatch({
			type: 'SET_PICTURE',
			isPreview: false,
			stringValue: resizedPicture,
		});
		this.dispatch({ type: 'CLOSE_RESIZE_PANEL' });
	}

	handleCancel() {
		this.dispatch({ type: 'CANCEL_RESIZE' });
		this.dispatch({ type: 'CLOSE_RESIZE_PANEL' });
	}

	/* ═══════════════════════════════════════
                   STATE SYNC
     ═══════════════════════════════════════ */

	syncState(newState) {
		this.state = newState;
		let { transform } = newState.ui;
		const modes = ['rotate', 'flip', 'mirror', 'resize'];
		// toggles for all the modes - shows popup and highlights icon if active, hides and unhighlights if not
		modes.forEach((mode) => {
			const isActive = transform.activeMode === mode;
			if (isActive) {
				this.view.hideTooltipOnPopupActive(
					this.view.references[`${mode}Tooltip`],
				);
			}
			this.view.showPopup(mode, isActive);
			this.view.highlightIcon(mode, isActive);
		});

		const axisToAction = {
			vertical: 'onReflectVertical',
			horizontal: 'onReflectHorizontal',
			mainDiagonal: 'onReflectMainDiagonal',
			offDiagonal: 'onReflectOffDiagonal',
			orthogonal: 'onReflectOrthogonal',
			diagonal: 'onReflectDiagonal',
		};

		const currentAxis = transform.mirror.axis;

		Object.entries(axisToAction).forEach(([axis, refKey]) => {
			const checkbox = this.view.references[refKey];
			if (checkbox) checkbox.checked = currentAxis === axis;
		});

		// GRID TOGGLE
		this.view.highlightIcon('grid', transform.gridVisible);

		if (transform.activeMode === 'resize') {
			if (transform.resize) {
				const linkEl = this.view.references.linkIcon;
				const { widthErrorMessage, heightErrorMessage, width, height, linked } =
					transform.resize;

				const widthError = this.view.references.widthError;
				const heightError = this.view.references.heightError;

				widthError.textContent = widthErrorMessage || '';
				heightError.textContent = heightErrorMessage || '';

				widthError.classList.toggle('hidden', !widthErrorMessage);
				heightError.classList.toggle('hidden', !heightErrorMessage);

				const widthInput = this.view.references.widthInput;
				const heightInput = this.view.references.heightInput;

				if (widthInput) {
					widthInput.value = width;
				}
				if (heightInput) {
					heightInput.value = height;
				}

				// Red border when invalid, blue when has value and valid
				widthInput.classList.toggle('border-b-red-500', !!widthErrorMessage);
				widthInput.classList.toggle(
					'border-b-blue-400',
					!widthErrorMessage && !!width,
				);

				heightInput.classList.toggle('border-b-red-500', !!heightErrorMessage);
				heightInput.classList.toggle(
					'border-b-blue-400',
					!heightErrorMessage && !!height,
				);

				if (linkEl)
					linkEl.src = !linked
						? '../../assets/link_off_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg'
						: '../../assets/link_16dp_202020_FILL0_wght400_GRAD0_opsz20.svg';

				linkEl.classList.toggle('link-icon-highlight-style', !!linked);

				linkEl.classList.toggle('link-icon-style', !linked);

				const bothValid =
					width && height && !widthErrorMessage && !heightErrorMessage;

				const saveBtn = this.view.references.saveButton;
				if (saveBtn) {
					//  blue + pointer
					saveBtn.classList.toggle('bg-custom-blue', bothValid);
					saveBtn.classList.toggle('text-custom-black', bothValid);
					saveBtn.classList.toggle('hover:bg-custom-blue-hover', bothValid);

					//locked when invalid
					saveBtn.classList.toggle('cursor-not-allowed', !bothValid);
					saveBtn.classList.toggle('bg-gray-500', !bothValid);
					saveBtn.classList.toggle('text-white', !bothValid);
					saveBtn.classList.toggle('disabled-ui', !bothValid);
					saveBtn.disabled = !bothValid;
				}
			}
		}
	}
}
