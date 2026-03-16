import { LayerSelectView } from '../view/layerView';

export class LayerSelectController {
	constructor(state, { dispatch }) {
		this.state = state;
		this.dispatch = dispatch;
		this.view = new LayerSelectView(this.createHandlers());
		this.dom = this.view.dom;
		this.syncState(state);
	}

	createHandlers() {
		return { onLayerClick: () => this.handleLayerClick() };
	}

	handleLayerClick() {
		this.dispatch({ type: 'TOGGLE_LAYER' });
	}

	syncState(newState) {
		this.state = newState;
		const { layer } = newState.ui;
		this.view.highlightIcon('layer', layer.isActive);
	}
}
