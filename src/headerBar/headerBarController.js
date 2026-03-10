import { HeaderView } from './headerBarView';

export class HeaderController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new HeaderView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	syncState(newState) {
		this.state = newState;
	}

	createHandlers() {
		return {
			onDownload: () => this.handleDownload(),
			onShare: () => this.handleShare(),
			onUpload: () => this.handleUpload(),
			onExport: () => this.handleExport(),
			onUndo: () => this.handleUndo(),
			onRedo: () => this.handleRedo(),
		};
	}

	handleDownload() {}

	handleShare() {}

	handleExport() {}

	handleRedo() {}

	handleUpload() {}

	handleUndo() {}
}
