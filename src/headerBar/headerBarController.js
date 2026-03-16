import { isThisSecond } from 'date-fns';
import { HeaderView } from './headerBarView';
import {
	headerBarCalculationServices,
	headerBarUiUpdateServices,
} from './services/headerbarServices';

export class HeaderController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.isDraggingQ = false; // this property is for quality slider in export popup
		this.view = new HeaderView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	createHandlers() {
		return {
			/* apis for share feature */
			onShareClick: () => this.handleShareClick(),
			onShare: () => this.handleShare(),
			onTitleNameInputChange: (value) => this.handleTitleNameChange(value),
			onDescriptionChange: (value) => this.handleDescriptionChange(value),
			onShareNameInputChange: (value) => this.handleShareNameChange(value),
			onShareSelectChange: (value) => this.handleShareSelectChange(value),
			onShareCancel: () => this.handleShareCancel(),

			// api for upload feature
			onUploadClick: () => this.handleUploadClick(),

			/* apis for export feature */
			onExportClick: () => this.handleExportClick(),
			onExport: () => this.handleExport(),
			onExportNameInputChange: (value) => this.handleExportInputChange(value),
			onExportSelectChange: (value) => this.handleExportSelectChange(value),
			onScaleSelectChange: (value) => this.handleScaleSelectChange(value),
			onQualityRangeChange: (value) => this.handleQualityRangeChange(value),
			onQualityRangeMouseDown: () => this.handleQualityRangeMouseDown(),
			onQualityRangeMouseUp: () => this.handleQualityRangeMouseUp(),
			onQualityRangeMouseLeave: () => this.handleQualityRangeMouseLeave(),
			onQualityRangeMouseEnter: () => this.handleQualityRangeMouseEnter(),
			onExportCancel: () => this.handleExportCancel(),

			// api for undo feature
			onUndoClick: () => this.handleUndoClick(),

			// api for redo feature
			onRedoClick: () => this.handleRedoClick(),
		};
	}

	// custom ui-toggler
	handleShareClick() {
		this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: 'share' });
	}

	handleShare() {
		headerBarCalculationServices.share(
			this.state.drawing.picture,
			this.state.ui.header.share.title,
			this.state.ui.header.share.description,
			this.state.ui.header.share.fileName,
			this.state.ui.header.share.fileType,
		);
		this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: null });
	}

	handleTitleNameChange(value) {
		this.dispatch({ type: 'SET_TITLE', stringValue: value.trim() });
	}

	handleDescriptionChange(value) {
		this.dispatch({ type: 'SET_DESCRIPTION', stringValue: value.trim() });
	}

	handleShareNameChange(value) {
		this.dispatch({ type: 'SET_SHARE_FILENAME', stringValue: value.trim() });
	}

	handleShareSelectChange(value) {
		this.dispatch({ type: 'SET_SHARE_FORMAT', stringValue: value.trim() });
	}

	handleShareCancel() {
		this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: null });
	}

	// icon-only-feature handler
	handleUploadClick() {
		headerBarCalculationServices.upload(
			this.dispatch,
			this.state.drawing.picture.width,
			this.state.drawing.picture.height,
		);
	}

	handleExportClick() {
		this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: 'export' });
	}

	handleExport() {
		headerBarCalculationServices.export(
			this.state.drawing.picture,
			this.state.ui.header.export.scale,
			this.state.ui.header.export.quality,
			this.state.ui.header.export.fileName,
			this.state.ui.header.export.fileType,
		);
		this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: null });
	}

	handleExportInputChange(value) {
		this.dispatch({ type: 'SET_EXPORT_FILENAME', stringValue: value.trim() });
	}

	handleExportSelectChange(value) {
		this.dispatch({ type: 'SET_EXPORT_FORMAT', stringValue: value.trim() });
	}

	handleScaleSelectChange(value) {
		this.dispatch({ type: 'SET_EXPORT_SCALE', stringValue: value });
	}

	handleQualityRangeChange(value) {
		this.dispatch({
			type: 'SET_EXPORT_QUALITY',
			stringValue: Math.round(value.trim()) / 100,
		});

		const qualityValue = this.state.ui.header.export.quality * 100;
		const qualitySliderRange = this.view.references['qualityRange'];
		const qualitySliderTooltip = this.view.references['sliderTooltip'];
		const { x, y } = headerBarUiUpdateServices.getThumbPosition(
			qualitySliderRange,
			qualityValue,
			1,
			100,
		); // 1 and 100 are min and max value of the slider

		this.view.updateTooltipPosition(x, y, qualitySliderTooltip);
	}

	handleQualityRangeMouseDown() {
		this.isDraggingQ = true;
		const qualityValue = this.state.ui.header.export.quality * 100;
		const qualitySliderRange = this.view.references['qualityRange'];
		const qualitySliderTooltip = this.view.references['sliderTooltip'];
		const { x, y } = headerBarUiUpdateServices.getThumbPosition(
			qualitySliderRange,
			qualityValue,
			1,
			100,
		); // 1 and 100 are min and max value of the slider

		this.view.updateTooltipPosition(x, y, qualitySliderTooltip);

		this.view.showTooltip(this.view.references['sliderTooltip']);
	}

	handleQualityRangeMouseUp() {
		this.isDraggingQ = false;
		this.view.hideTooltip(this.view.references['sliderTooltip']);
	}

	handleQualityRangeMouseLeave() {
		this.isDraggingQ = false;
		this.view.hideTooltip(this.view.references['sliderTooltip']);
	}

	handleQualityRangeMouseEnter() {
		if (this.isDraggingQ)
			this.view.showTooltip(this.view.references['sliderTooltip']);
	}

	handleExportCancel() {
		this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: null });
	}

	// icon-only-feature handler
	handleRedoClick() {
		this.dispatch({ type: 'SET_REDO' });
	}

	// icon-only-feature handler
	handleUndoClick() {
		this.dispatch({ type: 'SET_UNDO' });
	}

	syncState(newState) {
		this.state = newState;
		const { header } = newState.ui;
		const activeFeature = newState.ui.header.activeIcon;

		this.view.hideAllPopups();
		this.view.showPopup(activeFeature, true);

		// DOM Elements
		const qualitySliderTooltip = this.view.references['sliderTooltip'];
		const qualitySliderRange = this.view.references['qualityRange'];
		const qualityLabel = this.view.references['qualityLabel'];

		const qualityValue = header.export.quality * 100; // value in percentage

		this.view.updateSliderValue(qualityValue, qualitySliderRange);

		this.view.updateTooltipValue(qualitySliderTooltip, qualityValue);

		// This is for share dialog DOM
		this.view.references['titleNameInput'].value = header.share.title;
		this.view.references['descriptionInput'].value = header.share.description;
		this.view.references['fileNameInput'].value = header.share.fileName;

		// This is for export dialog DOM
		this.view.references['fileNameExportInput'].value = header.export.fileName;
		qualitySliderRange.classList.toggle(
			'hidden',
			header.export.fileType === 'png',
		);
		qualityLabel.classList.toggle('hidden', header.export.fileType === 'png');
	}
}
