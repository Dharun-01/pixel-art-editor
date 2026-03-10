import { ToolSelectView } from '../view/toolView';

export class ToolSelectController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new ToolSelectView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	createHandlers() {
		return {
			onPencilClick: () => this.handleToolSelect('pencil'),
			onFillClick: () => this.handleToolSelect('fill'),
			onEraseClick: () => this.handleToolSelect('erase'),
			onPickClick: () => this.handleToolSelect('pick'),
			onZoomPlusClick: () => this.handleToolSelect('zoomPlus'),
		};
	}

	handleToolSelect(toolName) {
		this.dispatch({
			type: `SET_${toolName.toUpperCase()}`,
			stringValue: toolName,
		});
	}

	// SYNC_STATE FOR DOM MANIPULATION (SRP)
	syncState(newState) {
		const { active } = newState.ui.drawingTools;
		const tools = ['pencil', 'fill', 'erase', 'pick', 'zoomPlus'];
		// Highlight the active tool
		tools.forEach((tool) => {
			const isActive = active === tool;
			this.view.highlightIcon(tool, isActive);
		});
	}
}
