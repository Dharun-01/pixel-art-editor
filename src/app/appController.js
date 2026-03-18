import { AppView } from './appView';
import { Picture } from '../picture';
import { PictureCanvasController } from '../canvas/canvasController';
import { HeaderController } from '../headerBar/headerBarController';
import { SideControlsController } from '../sidecontrols/sidecontrolsController';
import { StatusbarController } from '../statusbar/statusbarController';
import '../input.css';

export class AppController {
	constructor(state, config) {
		this.state = state;
		this.dispatch = config.dispatch;
		let { tools, controls, dispatch } = config;

		this.headerbarController = new HeaderController(this.state, config);
		this.sideControlsController = new SideControlsController(
			this.state,
			config,
		);
		this.statusbarController = new StatusbarController(this.state, config);

		this.canvasController = new PictureCanvasController(
			this.state,
			(pos) => {
				let tool = tools[this.state.tools.tool];
				try {
					let onMove = tool(pos, this.state, dispatch);
					if (onMove) return (pos, isFinal) => onMove(pos, this.state, isFinal);
				} catch (error) {
					console.error(error);
					alert(`Don't "fill" from Corners OR "Drag" with "fill"`);
				}
			},
			state.drawing.picture,
			config,
		);

		const enrichedConfig = {
			...config,
			canvasEl: this.canvasController.dom, // DOM Passed for animation of flip and rotate180 feature.
		};

		this.controls = controls.map((Control) => {
			return new Control(state, enrichedConfig);
		});

		this.appView = new AppView(
			this.createHandlers(),
			this.headerbarController,
			this.controls,
			this.sideControlsController,
			this.canvasController,
			this.statusbarController,
		);
		this.attachOverlayEventHandlers();
		this.syncState(this.state);
	}

	createHandlers() {
		return {
			onKeyDown: (event) => this.handleKeyDown(event),
		};
	}

	attachOverlayEventHandlers() {
		this.appView.overlay.addEventListener('click', () => {
			if (this.state.ui.header.activeIcon) {
				this.dispatch({ type: 'SET_ACTIVE_ICON', stringValue: null });
				return;
			}

			this.dispatch({ type: 'SET_CUSTOM_ACTIVE' }); // same as cancel
		});
	}

	handleKeyDown(event, config) {}

	syncState(newState) {
		this.state = newState;
		const isPreview = !!newState.drawing.previewPicture;
		const pic = isPreview
			? newState.drawing.previewPicture
			: newState.drawing.picture;
		this.headerbarController.syncState(this.state);
		this.canvasController.syncState(pic, this.state);
		this.statusbarController.syncState(this.state);
		this.sideControlsController.syncState(this.state);
		for (let ctrl of this.controls) ctrl.syncState(this.state);

		const isCustomActive = newState.ui.color.isCustomActive;
		const showOverlay = isCustomActive || !!newState.ui.header.activeIcon;

		this.appView.overlay.classList.toggle('tooltipVisible', showOverlay);
		this.appView.overlay.classList.toggle('tooltipHidden', !showOverlay);
	}
}
